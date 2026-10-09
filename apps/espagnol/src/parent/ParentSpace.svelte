<script lang="ts">
  import { game } from '../state/game.svelte';
  import { content } from '../engine/data';
  import { activeEvents, eventForced, setEventForced, STATE_VERSION } from "../engine/progress";
  import { loadLentoSet } from '../services/audio';
  import { AVG_AUDIO_BYTES, estimateBytes, unitAudioUrls } from '../services/offline';
  import { speechSupport } from '../services/speech';
  import BarChart from './BarChart.svelte';
  import { fmtBytes, fmtDate, fmtMin, hardItems, lastDays, objectiveCoverage, overview, pct, statRows, unitRows } from './stats';

  let { onclose }: { onclose: () => void } = $props();

  const TABS = [
    ['resumen', 'Vue d’ensemble'],
    ['progreso', 'Progression'],
    ['dificiles', 'Mots difficiles'],
    ['objetivos', 'Objectifs A1+'],
    ['ajustes', 'Réglages et sauvegarde'],
  ] as const;
  type Tab = (typeof TABS)[number][0];
  let tab = $state<Tab>('resumen');
  let open = $state<Record<string, boolean>>({});
  let message = $state('');
  let confirmReset = $state(false);
  let lentoSet = $state<Set<string>>(new Set());
  void loadLentoSet().then((s) => (lentoSet = s));

  const now = new Date();
  const s = $derived(game.state);
  const ov = $derived(overview(content, s, now));
  const days = $derived(lastDays(s, now, 14));
  const stats = $derived(statRows(s));
  const rows = $derived(unitRows(content, s, now));
  const hard = $derived(hardItems(content, s, 20));
  const objs = $derived(objectiveCoverage(content, s));
  const objCount = $derived({
    adquirido: objs.filter((o) => o.status === 'adquirido').length,
    'en curso': objs.filter((o) => o.status === 'en curso').length,
    pendiente: objs.filter((o) => o.status === 'pendiente').length,
  });
  const events = $derived(activeEvents(content, s, now));
  const speech = speechSupport();

  const STATUS: Record<string, [string, string]> = {
    done: ['✓', 'Terminée'],
    available: ['▶', 'Disponible'],
    locked: ['⏸', 'Pas encore débloquée'],
    closed: ['⏸', 'Événement fermé'],
    adquirido: ['✓', 'Acquis'],
    'en curso': ['◐', 'En cours'],
    pendiente: ['○', 'À venir'],
    hecha: ['✓', 'Faite'],
  };
  const KIND: Record<string, string> = { mot: 'Mot', phrase: 'Phrase', forme: 'Forme verbale' };
  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(3 - n);

  async function onImport(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      await game.importBackup(await file.text());
      message = `Sauvegarde « ${file.name} » restaurée.`;
    } catch (err) {
      message = `Import impossible : ${(err as Error).message}`;
    }
    input.value = '';
  }
  async function doReset() {
    await game.reset();
    confirmReset = false;
    message = 'Progression réinitialisée.';
  }
  const set = <K extends keyof typeof game.state.settings>(k: K, v: (typeof game.state.settings)[K]) => game.mutate((st) => ((st.settings[k] = v), game.applySettings()));
</script>

<div class="parent" role="dialog" aria-modal="true" aria-label="Espace parent" data-testid="parent-space">
  <header>
    <div>
      <h1>Espace parent</h1>
      <p>{s.profile.name || 'Élève'} · La Leyenda del Quetzal · espagnol 5e</p>
    </div>
    <button class="close" type="button" onclick={onclose} data-testid="parent-close">Fermer</button>
  </header>
  <div aria-label="Sections" role="tablist" class="tabs">
    {#each TABS as [id, label]}
      <button role="tab" aria-selected={tab === id} class:on={tab === id} onclick={() => (tab = id)} data-testid="tab-{id}">{label}</button>
    {/each}
  </div>

  <main>
    {#if tab === 'resumen'}
      <section class="kpis" data-testid="kpis">
        <div class="kpi"><span class="v">{fmtMin(ov.weekMin)}</span><span class="l">cette semaine</span></div>
        <div class="kpi"><span class="v">{fmtMin(ov.totalMin)}</span><span class="l">au total ({ov.activeDays} jours actifs)</span></div>
        <div class="kpi"><span class="v">{ov.streak} j</span><span class="l">d’affilée</span></div>
        <div class="kpi"><span class="v">{ov.level}</span><span class="l">niveau du joueur · {ov.xp} XP</span></div>
        <div class="kpi"><span class="v">{ov.wordsSeen}</span><span class="l">mots découverts, dont {ov.wordsSolid} bien ancrés</span></div>
        <div class="kpi"><span class="v">{ov.steps ? pct(ov.accuracy) : '—'}</span><span class="l">réussite du premier coup ({ov.steps} exercices)</span></div>
        <div class="kpi"><span class="v">{ov.steps ? pct(ov.hintRate > 1 ? 1 : ov.hintRate) : '—'}</span><span class="l">pistes (français) par exercice</span></div>
        <div class="kpi"><span class="v">{ov.missionsDone}</span><span class="l">« Misión del día » faites</span></div>
      </section>
      <section class="card">
        <BarChart title="Temps passé sur l’application, 14 derniers jours" data={days.map((d) => ({ label: d.label, value: d.minutes, detail: `${d.steps} exercices` }))} goal={s.settings.dailyGoalMin} goalLabel="Objectif du jour" />
      </section>
      <section class="card">
        <h2>Compétences travaillées</h2>
        <p class="note">Chaque exercice crédite une activité langagière du programme ; le niveau monte avec les points d’expérience (XP).</p>
        <ul class="stats" data-testid="stats">
          {#each stats as r}
            <li>
              <div class="statrow"><span class="statname">{r.label}</span><span class="statact">{r.activite}</span><span class="statlvl">niv. {r.level} · {r.xp} XP</span></div>
              <div class="track"><div class="fill" style:width="{Math.round(r.progress * 100)}%"></div></div>
            </li>
          {/each}
        </ul>
      </section>
      {#if events.length}
        <section class="card"><h2>Événement en cours</h2><p>{events.map((u) => `${u.emoji} ${u.titulo}`).join(', ')} — disponible jusqu’à la fin de sa période.</p></section>
      {/if}
    {:else if tab === 'progreso'}
      <section class="card">
        <h2>Progression par unité</h2>
        <p class="note">Les quêtes se jouent dans l’ordre ; la plume du Quetzal est obtenue à la fin de chaque unité. Étoiles : précision et pistes utilisées (maximum 3 par quête).</p>
        <ul class="units" data-testid="units">
          {#each rows as r}
            {@const st = STATUS[r.status]}
            <li class="unit">
              <button class="uhead" onclick={() => (open[r.unit.id] = !open[r.unit.id])} aria-expanded={!!open[r.unit.id]}>
                <span class="uemoji">{r.unit.emoji}</span>
                <span class="utitle"><strong>{r.unit.numero ? `Unité ${r.unit.numero}` : 'Événement'} · {r.unit.titulo}</strong><small>{r.unit.lugar} · {r.unit.periodo}</small></span>
                <span class="chip {r.status}" title={st[1]}><span aria-hidden="true">{st[0]}</span> {st[1]}</span>
                <span class="ucount">{r.questsDone}/{r.questsTotal} quêtes</span>
                <span class="ustars" aria-label="{r.stars} étoiles sur {r.starsMax}">★ {r.stars}/{r.starsMax}</span>
                <span class="uplume">{r.plume ? '🪶 plume' : ''}</span>
              </button>
              <div class="track thin"><div class="fill" style:width="{r.questsTotal ? (r.questsDone / r.questsTotal) * 100 : 0}%"></div></div>
              {#if open[r.unit.id]}
                <table>
                  <thead><tr><th>Quête</th><th>Type</th><th>État</th><th>Étoiles</th><th>Précision</th><th>Essais</th></tr></thead>
                  <tbody>
                    {#each r.quests as q}
                      <tr>
                        <td>{q.emoji} {q.titulo}</td>
                        <td>{q.tipo}</td>
                        <td><span aria-hidden="true">{STATUS[q.state === 'hecha' ? 'hecha' : q.state === 'en curso' ? 'en curso' : 'pendiente'][0]}</span> {q.state === 'hecha' ? 'Faite' : q.state === 'en curso' ? 'En cours' : 'À faire'}</td>
                        <td class="stars">{q.state === 'hecha' ? stars(q.stars) : '—'}</td>
                        <td>{q.state === 'hecha' ? pct(q.accuracy) : '—'}</td>
                        <td>{q.attempts || '—'}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {:else if tab === 'dificiles'}
      <section class="card">
        <h2>Mots et structures difficiles</h2>
        <p class="note">Éléments échoués plusieurs fois (au moins 2 essais). Ils reviennent plus souvent dans la « Misión del día ».</p>
        {#if hard.length === 0}
          <p class="empty">Rien de difficile pour l’instant.</p>
        {:else}
          <table data-testid="hard">
            <thead><tr><th>Espagnol</th><th>Français</th><th>Type</th><th>Unité</th><th>Échecs</th><th>Essais</th><th>Taux d’échec</th></tr></thead>
            <tbody>
              {#each hard as h}
                <tr><td lang="es"><strong>{h.es}</strong></td><td>{h.fr}</td><td>{KIND[h.kind]}</td><td>{h.unit}</td><td>{h.wrong}</td><td>{h.seen}</td>
                  <td><span class="rate"><span class="ratebar" style:width="{Math.min(100, Math.round(h.rate * 100))}%"></span></span> {pct(Math.min(1, h.rate))}</td></tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </section>
    {:else if tab === 'objetivos'}
      <section class="card">
        <h2>Couverture des attendus A1+</h2>
        <p class="note">Le programme vise le niveau A1+ en fin de 5e. Un objectif est « acquis » quand l’unité est terminée avec au moins 70 % de précision, « en cours » dès qu’une quête de l’unité est réussie. Le détail par quête n’est pas relié aux objectifs.</p>
        <p class="sum" data-testid="obj-sum">✓ {objCount.adquirido} acquis · ◐ {objCount['en curso']} en cours · ○ {objCount.pendiente} à venir</p>
        {#each [...content.main, ...content.events] as u}
          {@const list = objs.filter((o) => o.unit === u.id)}
          {#if list.length}
            <h3>{u.emoji} {u.numero ? `Unité ${u.numero}` : 'Événement'} · {u.titulo}</h3>
            <ul class="objs">
              {#each list as o}
                <li><span class="chip {o.status}"><span aria-hidden="true">{STATUS[o.status][0]}</span> {STATUS[o.status][1]}</span><span><span lang="es">{o.es}</span><br /><small>{o.fr}</small></span></li>
              {/each}
            </ul>
          {/if}
        {/each}
      </section>
    {:else}
      <section class="card">
        <h2>Profil</h2>
        <label class="field">Prénom de l’élève
          <input type="text" value={s.profile.name} maxlength="24" oninput={(e) => game.mutate((st) => (st.profile.name = e.currentTarget.value))} data-testid="name-input" />
        </label>
        <label class="field">Objectif quotidien
          <select value={s.settings.dailyGoalMin} onchange={(e) => set('dailyGoalMin', Number(e.currentTarget.value))}>
            {#each [5, 10, 15, 20, 30] as m}<option value={m}>{m} minutes</option>{/each}
          </select>
        </label>
      </section>
      <section class="card">
        <h2>Réglages</h2>
        <label class="check"><input type="checkbox" checked={s.settings.sound} onchange={(e) => set('sound', e.currentTarget.checked)} /> Son</label>
        <label class="check"><input type="checkbox" checked={s.settings.haptics} onchange={(e) => set('haptics', e.currentTarget.checked)} /> Vibrations</label>
        <label class="check"><input type="checkbox" checked={s.settings.lentoDefault} onchange={(e) => set('lentoDefault', e.currentTarget.checked)} /> Lire les voix au ralenti par défaut</label>
        <label class="check"><input type="checkbox" checked={s.settings.speechEnabled} onchange={(e) => set('speechEnabled', e.currentTarget.checked)} /> Reconnaissance vocale (« hechizos »)</label>
        {#each content.events as ev (ev.id)}
          <label class="check" data-testid="force-{ev.id}"><input type="checkbox" checked={eventForced(s, ev.id)} onchange={(e) => { const on = e.currentTarget.checked; game.mutate((st) => setEventForced(st, ev.id, on)); }} /> Ouvrir l’événement « {ev.titulo} » maintenant (test, hors des dates)</label>
        {/each}
        <p class="note">
          Reconnaissance vocale sur cet appareil :
          {speech === 'ok' ? 'disponible (nécessite une connexion Internet)' : speech === 'offline' ? 'indisponible hors connexion — l’élève s’auto-évalue' : speech === 'insecure' ? 'indisponible (HTTPS requis)' : 'non prise en charge par ce navigateur — l’élève s’auto-évalue'}.
        </p>
      </section>
      <section class="card">
        <h2>Audio hors connexion</h2>
        <p class="note">Les voix sont téléchargées par unité (environ {fmtBytes(AVG_AUDIO_BYTES)} par fichier). L’unité en cours et la suivante se téléchargent automatiquement en Wi-Fi.</p>
        <label class="check"><input type="checkbox" checked={s.settings.autoDownload} onchange={(e) => set('autoDownload', e.currentTarget.checked)} /> Téléchargement automatique (unité en cours + suivante)</label>
        <table data-testid="offline">
          <thead><tr><th>Unité</th><th>Fichiers audio</th><th>État</th><th></th></tr></thead>
          <tbody>
            {#each content.units as u}
              {@const n = unitAudioUrls(u, lentoSet).length}
              {@const o = s.offline[u.id]}
              {@const dl = game.downloads[u.id]}
              <tr>
                <td>{u.emoji} {u.titulo}</td>
                <td>{n} (~{fmtBytes(estimateBytes(n))})</td>
                <td>{#if dl}Téléchargement {dl.done}/{dl.total}{:else if o?.status === 'ready'}✓ Disponible hors connexion{:else if o?.status === 'partial'}◐ Partiel ({o.files}/{n}){:else}○ Non téléchargée{/if}</td>
                <td class="actions">
                  {#if dl}<progress max={dl.total} value={dl.done}></progress>
                  {:else if o?.status === 'ready'}<button onclick={() => game.removeUnitAudio(u)}>Supprimer</button>
                  {:else}<button onclick={() => game.downloadUnitAudio(u)}>Télécharger</button>{/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
      <section class="card">
        <h2>Sauvegarde</h2>
        <p class="note">La progression est stockée sur cet appareil. Exportez-la pour la conserver ou la transférer sur une autre tablette.</p>
        <div class="row">
          <button class="primary" onclick={() => game.exportBackup()} data-testid="export">Exporter (fichier .json)</button>
          <label class="filebtn">Importer une sauvegarde<input type="file" accept="application/json,.json" onchange={onImport} data-testid="import" /></label>
        </div>
        {#if message}<p class="msg" role="status" data-testid="msg">{message}</p>{/if}
        <h3>Zone sensible</h3>
        {#if confirmReset}
          <p>Effacer toute la progression de {s.profile.name || 'l’élève'} ? Cette action est définitive.</p>
          <div class="row"><button class="danger" onclick={doReset}>Oui, tout effacer</button><button onclick={() => (confirmReset = false)}>Annuler</button></div>
        {:else}
          <button class="danger" onclick={() => (confirmReset = true)}>Réinitialiser la progression…</button>
        {/if}
        <p class="note">Dernière activité : {fmtDate(ov.lastSeen)} · version de la sauvegarde v{STATE_VERSION}</p>
      </section>
    {/if}
  </main>
</div>

<style>
  .parent {
    --bg: #f4f1ea; --surface: #fff; --surface2: #fbfaf7; --ink: #1d2433; --ink2: #4a5568; --muted: #667085; --grid: #e2ded3;
    --accent: #1b5fa8; --series: #2f6fb0; --good: #1d7a46; --warn: #8a5a00; --bad: #a3262a;
    position: fixed; inset: 0; z-index: 100; overflow-y: auto; background: var(--bg); color: var(--ink);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.45;
    user-select: text; -webkit-user-select: text; touch-action: pan-y;
    padding: max(16px, env(safe-area-inset-top)) 16px 40px;
  }
  @media (prefers-color-scheme: dark) {
    .parent { --bg: #14171f; --surface: #1c212c; --surface2: #232a38; --ink: #eef0f5; --ink2: #b7bfce; --muted: #98a2b3; --grid: #323a4b; --accent: #7db4f0; --series: #6aa6e6; --good: #5fd08d; --warn: #e8b74f; --bad: #ff8a8d; }
  }
  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; max-width: 980px; margin: 0 auto 8px; }
  h1 { margin: 0; font-size: 1.5rem; }
  header p { margin: 2px 0 0; color: var(--muted); }
  h2 { margin: 0 0 8px; font-size: 1.1rem; }
  h3 { margin: 18px 0 6px; font-size: 1rem; }
  .tabs { display: flex; gap: 4px; flex-wrap: wrap; max-width: 980px; margin: 0 auto 12px; border-bottom: 1px solid var(--grid); }
  .tabs button { background: none; border: 0; border-bottom: 3px solid transparent; padding: 10px 12px; font: inherit; color: var(--ink2); cursor: pointer; min-height: 44px; }
  .tabs button.on { color: var(--ink); border-bottom-color: var(--accent); font-weight: 600; }
  main { max-width: 980px; margin: 0 auto; display: grid; gap: 14px; }
  .card { background: var(--surface); border: 1px solid var(--grid); border-radius: 10px; padding: 16px; }
  .note { color: var(--muted); font-size: 0.9rem; margin: 0 0 10px; }
  .empty { color: var(--muted); }
  button, select, input[type='text'] { font: inherit; }
  button { min-height: 40px; padding: 6px 14px; border: 1px solid var(--grid); background: var(--surface2); color: var(--ink); border-radius: 8px; cursor: pointer; }
  button.primary { background: var(--accent); border-color: var(--accent); color: var(--bg); font-weight: 600; }
  button.danger { color: var(--bad); border-color: var(--bad); }
  .close { white-space: nowrap; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
  .kpi { background: var(--surface); border: 1px solid var(--grid); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; }
  .kpi .v { font-size: 1.7rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  .kpi .l { color: var(--muted); font-size: 0.85rem; }
  .stats { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  .statrow { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; margin-bottom: 4px; }
  .statname { font-weight: 600; min-width: 70px; }
  .statact { color: var(--muted); font-size: 0.85rem; flex: 1; }
  .statlvl { font-variant-numeric: tabular-nums; }
  .track { height: 8px; background: var(--grid); border-radius: 4px; overflow: hidden; }
  .track.thin { height: 5px; margin: 6px 0 2px; }
  .fill { height: 100%; background: var(--series); border-radius: 4px; }
  .units { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .unit { border: 1px solid var(--grid); border-radius: 8px; padding: 8px 10px; }
  .uhead { display: grid; grid-template-columns: 34px 1fr auto auto auto auto; align-items: center; gap: 10px; width: 100%; text-align: left; border: 0; background: none; padding: 4px 0; }
  .uemoji { font-size: 1.6rem; }
  .utitle { display: flex; flex-direction: column; }
  .utitle small { color: var(--muted); }
  .ucount, .ustars { font-variant-numeric: tabular-nums; white-space: nowrap; }
  .chip { display: inline-flex; gap: 4px; align-items: center; font-size: 0.8rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; border: 1px solid currentColor; white-space: nowrap; }
  .chip.done, .chip.adquirido { color: var(--good); }
  .chip.available, .chip.en.curso { color: var(--accent); }
  .chip.locked, .chip.closed, .chip.pendiente { color: var(--muted); }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-top: 8px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--grid); vertical-align: middle; }
  th { color: var(--muted); font-weight: 600; font-size: 0.8rem; }
  .stars { color: var(--warn); letter-spacing: 1px; white-space: nowrap; }
  .rate { display: inline-block; width: 60px; height: 6px; background: var(--grid); border-radius: 3px; vertical-align: middle; overflow: hidden; }
  .ratebar { display: block; height: 100%; background: var(--bad); }
  .objs { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
  .objs li { display: grid; grid-template-columns: 110px 1fr; gap: 10px; align-items: start; }
  .objs small { color: var(--muted); }
  .sum { font-weight: 600; }
  .field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; max-width: 320px; }
  .field input, .field select { padding: 8px 10px; border: 1px solid var(--grid); border-radius: 8px; background: var(--surface2); color: var(--ink); min-height: 40px; }
  .check { display: flex; gap: 8px; align-items: center; padding: 6px 0; min-height: 40px; }
  .check input { width: 20px; height: 20px; }
  .row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .filebtn { position: relative; display: inline-flex; align-items: center; min-height: 40px; padding: 6px 14px; border: 1px solid var(--grid); background: var(--surface2); border-radius: 8px; cursor: pointer; }
  .filebtn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .msg { padding: 8px 10px; border-left: 3px solid var(--accent); background: var(--surface2); }
  .actions { text-align: right; }
  progress { width: 120px; }
  @media (max-width: 720px) {
    .uhead { grid-template-columns: 34px 1fr auto; }
    .ucount, .ustars, .uplume { grid-column: 2 / -1; }
    .objs li { grid-template-columns: 1fr; }
  }
</style>
