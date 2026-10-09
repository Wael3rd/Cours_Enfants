<script lang="ts">
  import { app } from '../state/store.svelte.ts';
  import { heatmap, avgTimeSeries, summary } from '../engine/stats.ts';
  import { THRESHOLD_CHOICES_MS } from '../engine/progress.ts';
  import { SESSION_MINUTES_CHOICES } from '../state/model.ts';
  import { dayKey } from '../engine/rewards.ts';
  import Heatmap from './Heatmap.svelte';
  import TimeChart from './TimeChart.svelte';
  import { fmtSec, fmtDateTime, pct, MODE_LABEL } from './format.ts';

  let { onclose }: { onclose: () => void } = $props();

  type Tab = 'overview' | 'history' | 'zones' | 'settings';
  const TABS: [Tab, string][] = [
    ['overview', "Vue d'ensemble"], ['history', 'Historique'], ['zones', 'Zones'], ['settings', 'Réglages'],
  ];
  let tab = $state<Tab>('overview');

  const T = $derived(app.state.settings.thresholdMs);
  const profile = $derived(app.state.profile);
  const sum = $derived(summary(profile, T));
  const addCells = $derived(heatmap(profile.progress, '+', T));
  const subCells = $derived(heatmap(profile.progress, '-', T));
  const series = $derived(avgTimeSeries(profile.history));
  const history = $derived(profile.history.toReversed());
  let histLimit = $state(40);

  let message = $state('');
  let confirmZone = $state<number | null>(null);
  let confirmReset = $state(false);
  let fileInput: HTMLInputElement | undefined = $state();

  async function doImport(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      await app.importText(await file.text());
      message = `Sauvegarde importée : ${app.state.childName}, ${app.state.profile.history.length} sessions.`;
    } catch (err) {
      message = `Import impossible : ${(err as Error).message}`;
    }
    input.value = '';
  }
  async function doExport() {
    await app.exportDownload();
    message = 'Sauvegarde téléchargée.';
  }
  function force(z: number) {
    app.forceZone(z);
    confirmZone = null;
    message = `Zone ${z} forcée : débloquée et mise au travail.`;
  }
  const streak = $derived(profile.rewards.streak);
  const medalTxt = $derived(`${profile.rewards.medals.or} or · ${profile.rewards.medals.argent} argent · ${profile.rewards.medals.bronze} bronze`);
  const lastDay = $derived(streak.lastDay ?? dayKey(Date.now()));
</script>

<div class="parent" role="dialog" aria-modal="true" aria-label="Espace parent">
  <header>
    <div>
      <h1>Espace parent</h1>
      <p class="sub">{app.state.childName} · Calcul Champion</p>
    </div>
    <button type="button" class="btn" onclick={onclose}>Fermer</button>
  </header>

  <div class="tabs" role="tablist" aria-label="Sections">
    {#each TABS as [id, label]}
      <button type="button" role="tab" id="tab-{id}" aria-selected={tab === id} class:on={tab === id} onclick={() => (tab = id)}>{label}</button>
    {/each}
  </div>

  <div class="panel" role="tabpanel" aria-labelledby="tab-{tab}">
    {#if message}<p class="msg" role="status">{message}</p>{/if}

    {#if tab === 'overview'}
      <section class="tiles" aria-label="Résumé">
        <div class="tile"><span class="v">{sum.fluentAdd}<small>/121</small></span><span class="l">additions fluentes</span></div>
        <div class="tile"><span class="v">{sum.fluentSub}<small>/121</small></span><span class="l">soustractions fluentes</span></div>
        <div class="tile"><span class="v">{sum.sessions}</span><span class="l">sessions jouées</span></div>
        <div class="tile"><span class="v">{streak.current}<small> j</small></span><span class="l">série en cours (record {streak.best} j)</span></div>
      </section>

      <section class="legend" aria-label="Légende">
        <span><i class="sw fluent"></i><b aria-hidden="true">&#10003;</b> Fluent (juste et ≤ {fmtSec(T)}, 2 fois de suite)</span>
        <span><i class="sw slow"></i><b aria-hidden="true">&#8943;</b> Juste, pas encore automatique</span>
        <span><i class="sw error"></i><b aria-hidden="true">&#10005;</b> Erreur</span>
        <span><i class="sw unseen"></i> Jamais vu</span>
      </section>

      <section class="maps">
        <Heatmap cells={addCells} title="Additions" rowLabel="1er" colLabel="2e" thresholdMs={T} />
        <Heatmap cells={subCells} title="Soustractions (c − a = b)" rowLabel="a" colLabel="b" thresholdMs={T} />
      </section>
      <p class="note">Soustractions : la ligne est le nombre retiré (a), la colonne le résultat (b) ; le calcul est (a + b) − a.</p>

      <section class="card"><TimeChart {series} thresholdMs={T} /></section>
    {:else if tab === 'history'}
      <section class="card">
        {#if history.length === 0}
          <p class="empty">Aucune session pour l'instant.</p>
        {:else}
          <div class="tbl">
            <table>
              <thead>
                <tr><th>Date</th><th>Mode</th><th>Zone</th><th class="n">Questions</th><th class="n">Justes</th><th class="n">Rapides</th><th class="n">Temps moyen</th><th class="n">Résultat</th><th class="n">★</th></tr>
              </thead>
              <tbody>
                {#each history.slice(0, histLimit) as h}
                  <tr>
                    <td>{fmtDateTime(h.at)}</td>
                    <td>{MODE_LABEL[h.mode]}</td>
                    <td>{h.zone}</td>
                    <td class="n">{h.questions}</td>
                    <td class="n">{pct(h.questions ? h.correct / h.questions : 0)}</td>
                    <td class="n">{pct(h.questions ? h.fluent / h.questions : 0)}</td>
                    <td class="n">{h.avgMs === null ? '—' : fmtSec(h.avgMs)}</td>
                    <td class="n">
                      {#if h.goals !== undefined}{h.goals}–{h.rivalGoals}
                      {:else if h.totalMs !== undefined}{fmtSec(h.totalMs)}{h.medal ? ` · ${h.medal}` : ''}
                      {:else}—{/if}
                    </td>
                    <td class="n">{h.stars}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          {#if history.length > histLimit}
            <button type="button" class="btn ghost" onclick={() => (histLimit += 40)}>Voir plus ({history.length - histLimit} restantes)</button>
          {/if}
        {/if}
      </section>
      <p class="note">Étoiles : {profile.rewards.stars} · Cartes : {profile.rewards.cards.length} · Médailles sprint : {medalTxt}.</p>
    {:else if tab === 'zones'}
      <section class="card">
        <p class="note top">Une zone est gagnée quand au moins 80 % de ses faits sont fluents ; la suivante se débloque alors. Vous pouvez forcer une zone.</p>
        <ol class="zones">
          {#each sum.zones as z}
            <li class:focus={z.focus}>
              <div class="zh">
                <span class="zn">{z.id}</span>
                <span class="zt">{z.name}</span>
                <span class="state {z.won ? 'won' : z.focus ? 'now' : z.unlocked ? 'open' : 'locked'}">
                  {z.won ? 'Gagnée' : z.focus ? 'En cours' : z.unlocked ? 'Débloquée' : 'Verrouillée'}
                </span>
              </div>
              <div class="bar" role="img" aria-label="{z.fluent} sur {z.total} fluents, objectif 80 %">
                <i style="width:{Math.round(z.ratio * 100)}%"></i><u></u>
              </div>
              <div class="zf">
                <span>{z.fluent}/{z.total}{z.id === 10 ? ' catégories' : ' faits'} · {pct(z.ratio)}</span>
                {#if confirmZone === z.id}
                  <span class="confirm">Forcer la zone {z.id} ?
                    <button type="button" class="btn small" onclick={() => force(z.id)}>Oui</button>
                    <button type="button" class="btn small ghost" onclick={() => (confirmZone = null)}>Non</button>
                  </span>
                {:else if !z.focus}
                  <button type="button" class="btn small ghost" onclick={() => (confirmZone = z.id)}>Forcer</button>
                {/if}
              </div>
              {#if z.id === 10}
                <ul class="mental">
                  {#each sum.mental as m}
                    <li><span>{m.label}</span><span class="n">{m.attempts ? pct(m.rate) : '—'}{m.fluent ? ' ✓' : ''}</span></li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ol>
      </section>
    {:else}
      <section class="card form">
        <h2>Enfant</h2>
        <label class="row"><span>Prénom</span>
          <input type="text" maxlength="16" value={app.state.childName} onchange={(e) => app.setName(e.currentTarget.value)} autocomplete="off" />
        </label>

        <h2>Apprentissage</h2>
        <fieldset class="row">
          <legend>Seuil de fluence</legend>
          <div class="seg">
            {#each THRESHOLD_CHOICES_MS as v}
              <button type="button" class:on={T === v} aria-pressed={T === v} onclick={() => app.setSettings({ thresholdMs: v })}>{fmtSec(v)}</button>
            {/each}
          </div>
          <small>Une réponse est fluente si elle est juste et donnée en moins de ce temps.</small>
        </fieldset>
        <fieldset class="row">
          <legend>Durée d'un match</legend>
          <div class="seg">
            {#each SESSION_MINUTES_CHOICES as v}
              <button type="button" class:on={app.state.settings.sessionMinutes === v} aria-pressed={app.state.settings.sessionMinutes === v} onclick={() => app.setSettings({ sessionMinutes: v })}>{v} min</button>
            {/each}
          </div>
        </fieldset>
        <label class="row chk"><input type="checkbox" checked={app.state.settings.sound} onchange={(e) => app.setSettings({ sound: e.currentTarget.checked })} /> Sons et bruitages</label>
        <label class="row chk"><input type="checkbox" checked={app.state.settings.voice} onchange={(e) => app.setSettings({ voice: e.currentTarget.checked })} /> Consignes dites à voix haute</label>

        <h2>Sauvegarde</h2>
        <div class="actions">
          <button type="button" class="btn" onclick={doExport}>Exporter (JSON)</button>
          <button type="button" class="btn ghost" onclick={() => fileInput?.click()}>Importer…</button>
          <input bind:this={fileInput} type="file" accept="application/json,.json" hidden onchange={doImport} aria-label="Fichier de sauvegarde" />
        </div>
        <small>La sauvegarde contient le prénom, les réglages et toute la progression. Importer remplace l'état actuel.</small>

        <h2>Zone dangereuse</h2>
        {#if confirmReset}
          <div class="actions">
            <span>Effacer toute la progression de {app.state.childName} ?</span>
            <button type="button" class="btn danger" onclick={() => { app.resetProgress(); confirmReset = false; message = 'Progression effacée.'; }}>Oui, effacer</button>
            <button type="button" class="btn ghost" onclick={() => (confirmReset = false)}>Annuler</button>
          </div>
        {:else}
          <div class="actions"><button type="button" class="btn danger ghost" onclick={() => (confirmReset = true)}>Effacer la progression…</button></div>
        {/if}
        <small>Dernière activité : {lastDay}</small>
      </section>
    {/if}
  </div>
</div>

<style>
  .parent {
    --surface: #fcfcfb; --page: #f4f4f1; --text-primary: #0b0b0b; --text-secondary: #52514e; --text-muted: #6f6d67;
    --grid: #e1e0d9; --axis: #c3c2b7; --series-1: #2a78d6; --accent: #1d5fb0; --ring: rgba(11, 11, 11, 0.1);
    --st-fluent: #0ca30c; --st-slow: #ec835a; --st-error: #d03b3b; --st-unseen: #d9d8d1;
    position: fixed; inset: 0; z-index: 1000; overflow-y: auto; overflow-x: hidden;
    background: var(--page); color: var(--text-primary);
    font: 16px/1.45 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    -webkit-user-select: text; user-select: text; touch-action: pan-y;
    padding: max(env(safe-area-inset-top), 0px) 0 env(safe-area-inset-bottom);
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .parent {
      --surface: #1a1a19; --page: #0d0d0d; --text-primary: #ffffff; --text-secondary: #c3c2b7; --text-muted: #9c9a92;
      --grid: #2c2c2a; --axis: #383835; --series-1: #3987e5; --accent: #6aa8f0; --ring: rgba(255, 255, 255, 0.1);
      --st-unseen: #3a3a37; color-scheme: dark;
    }
  }
  header, .tabs, .panel { max-width: 1100px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 18px; padding-bottom: 6px; }
  h1 { margin: 0; font-size: 1.5rem; font-weight: 700; }
  .sub { margin: 0; color: var(--text-secondary); font-size: 0.9375rem; }
  .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--grid); overflow-x: auto; }
  .tabs button { background: none; border: 0; border-bottom: 2px solid transparent; padding: 12px 14px; font: inherit; font-weight: 600; color: var(--text-secondary); cursor: pointer; white-space: nowrap; min-height: 48px; }
  .tabs button.on { color: var(--text-primary); border-bottom-color: var(--accent); }
  .panel { padding-top: 18px; padding-bottom: 40px; display: grid; gap: 16px; }
  .card { background: var(--surface); border-radius: 12px; box-shadow: 0 0 0 1px var(--ring); padding: 18px; min-width: 0; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
  .tile { background: var(--surface); border-radius: 12px; box-shadow: 0 0 0 1px var(--ring); padding: 14px 16px; display: grid; gap: 2px; }
  .tile .v { font-size: 1.75rem; font-weight: 700; line-height: 1.1; }
  .tile small { font-size: 0.9rem; font-weight: 500; color: var(--text-muted); }
  .tile .l { color: var(--text-secondary); font-size: 0.875rem; }
  .legend { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 0.875rem; color: var(--text-secondary); }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .sw { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
  .sw.fluent { background: var(--st-fluent); } .sw.slow { background: var(--st-slow); } .sw.error { background: var(--st-error); } .sw.unseen { background: var(--st-unseen); }
  .maps { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px; }
  .maps > :global(figure) { background: var(--surface); border-radius: 12px; box-shadow: 0 0 0 1px var(--ring); padding: 16px; }
  .note { margin: 0; color: var(--text-secondary); font-size: 0.8125rem; }
  .note.top { margin-bottom: 12px; font-size: 0.875rem; }
  .msg { margin: 0; padding: 10px 14px; border-radius: 8px; background: var(--surface); box-shadow: 0 0 0 1px var(--ring); color: var(--text-primary); }
  .btn { min-height: 44px; padding: 0 18px; border-radius: 10px; border: 1px solid var(--accent); background: var(--accent); color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  .btn.ghost { background: transparent; color: var(--accent); }
  .btn.danger { background: #b32d2d; border-color: #b32d2d; color: #fff; }
  .btn.danger.ghost { background: transparent; color: #c0392b; }
  .btn.small { min-height: 36px; padding: 0 12px; font-size: 0.875rem; }
  .tbl { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--grid); white-space: nowrap; }
  th { color: var(--text-secondary); font-weight: 600; }
  .n { text-align: right; font-variant-numeric: tabular-nums; }
  .empty { color: var(--text-muted); margin: 0; }
  .zones { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
  .zones > li { padding: 12px 14px; border-radius: 10px; box-shadow: 0 0 0 1px var(--ring); }
  .zones > li.focus { box-shadow: 0 0 0 2px var(--accent); }
  .zh { display: flex; align-items: center; gap: 10px; }
  .zn { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: var(--grid); font-size: 0.8125rem; font-weight: 700; }
  .zt { font-weight: 650; flex: 1; }
  .state { font-size: 0.8125rem; padding: 2px 10px; border-radius: 99px; background: var(--grid); color: var(--text-secondary); }
  .state.won { background: var(--st-fluent); color: #0b0b0b; }
  .state.now { background: var(--accent); color: #fff; }
  .bar { position: relative; height: 8px; border-radius: 4px; background: var(--grid); margin: 10px 0 6px; }
  .bar i { position: absolute; inset: 0 auto 0 0; border-radius: 4px; background: var(--series-1); }
  .bar u { position: absolute; left: 80%; top: -3px; bottom: -3px; width: 2px; background: var(--text-secondary); text-decoration: none; }
  .zf { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 0.875rem; color: var(--text-secondary); min-height: 36px; }
  .confirm { display: inline-flex; align-items: center; gap: 8px; }
  .mental { list-style: none; margin: 6px 0 0; padding: 0; font-size: 0.8125rem; color: var(--text-secondary); }
  .mental li { display: flex; justify-content: space-between; padding: 4px 0; border-top: 1px solid var(--grid); }
  .form h2 { margin: 18px 0 8px; font-size: 1rem; }
  .form h2:first-child { margin-top: 0; }
  .row { display: grid; gap: 6px; margin: 0 0 12px; border: 0; padding: 0; }
  legend { padding: 0; font-weight: 600; margin-bottom: 6px; }
  .row input[type='text'] { min-height: 44px; border-radius: 8px; border: 1px solid var(--axis); padding: 0 12px; font: inherit; background: var(--page); color: inherit; max-width: 280px; }
  .row.chk { display: flex; align-items: center; gap: 10px; min-height: 40px; }
  .row.chk input { width: 22px; height: 22px; }
  .seg { display: inline-flex; border-radius: 10px; box-shadow: 0 0 0 1px var(--axis); overflow: hidden; width: fit-content; }
  .seg button { min-height: 44px; min-width: 76px; padding: 0 16px; border: 0; background: transparent; color: var(--text-primary); font: inherit; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--axis); }
  .seg button.on { background: var(--accent); color: #fff; font-weight: 650; }
  small { color: var(--text-secondary); }
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px; }
</style>
