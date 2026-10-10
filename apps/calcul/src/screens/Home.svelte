<script lang="ts">
  /** Accueil : 9 modules (les zones du moteur) + « Tout melanger » + « Defi vitesse ». Tout est libre ; le module conseille est mis en avant. */
  import { onDestroy } from 'svelte';
  import { app } from '../state/store.svelte.ts';
  import { MODULES, starsOf } from '../lib/modules.ts';
  import { sfx } from '../lib/sound.ts';
  import { zoneRatio, UNLOCK_RATIO } from '../../../maths/src/engine/index.ts';
  import Settings from '../ui/Settings.svelte';
  import type { RunConfig } from '../lib/run.ts';

  let { onpick }: { onpick: (cfg: RunConfig) => void } = $props();

  const T = $derived(app.state.settings.thresholdMs);
  const progress = $derived(app.state.profile.progress);
  const rows = $derived(MODULES.map((m) => ({ m, ratio: zoneRatio(progress, m.zone, T) })));
  const recommended = $derived(rows.find((r) => r.ratio < UNLOCK_RATIO)?.m.zone ?? null);
  const best = $derived(app.state.profile.sprint.bestMs);
  const fmt = (ms: number) => (ms / 1000).toFixed(1).replace('.', ',') + ' s';

  // Engrenage : appui long 2 s
  let settingsOpen = $state(false);
  let holding = $state(false);
  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  function holdStart() {
    holding = true;
    holdTimer = setTimeout(() => { holding = false; settingsOpen = true; }, 2000);
  }
  function holdEnd() {
    holding = false;
    clearTimeout(holdTimer);
  }
  onDestroy(() => clearTimeout(holdTimer));

  const pick = (cfg: RunConfig) => { sfx('tap', 0.6); onpick(cfg); };
</script>

<div class="screen home">
  <header>
    <div>
      <h1>Calcul{app.state.name ? ` · ${app.state.name}` : ''}</h1>
      <p>Choisis un entraînement.</p>
    </div>
    <button type="button" class="gear" class:holding aria-label="Réglages (appui long 2 secondes)"
      onpointerdown={holdStart} onpointerup={holdEnd} onpointerleave={holdEnd} onpointercancel={holdEnd} oncontextmenu={(e) => e.preventDefault()}>
      <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.6a.5.5 0 0 0 .1-.6l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.4 1a7.4 7.4 0 0 0-1.7-1l-.4-2.5a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.5a7.4 7.4 0 0 0-1.7 1l-2.4-1a.5.5 0 0 0-.6.2L2.5 8.8a.5.5 0 0 0 .1.6l2 1.6a7.7 7.7 0 0 0 0 2l-2 1.6a.5.5 0 0 0-.1.6l1.9 3.3a.5.5 0 0 0 .6.2l2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.5a.5.5 0 0 0 .5.4h3.8a.5.5 0 0 0 .5-.4l.4-2.5a7.4 7.4 0 0 0 1.7-1l2.4 1a.5.5 0 0 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.6ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"/></svg>
      <i class="fill" aria-hidden="true"></i>
    </button>
  </header>

  <section class="specials" aria-label="Entraînements spéciaux">
    <button type="button" class="special" onclick={() => pick({ kind: 'mix' })}>
      <strong>Tout mélanger</strong>
      <span>Révise tout ce que tu as déjà travaillé</span>
    </button>
    <button type="button" class="special" onclick={() => pick({ kind: 'sprint' })}>
      <strong>Défi vitesse</strong>
      <span>10 calculs, le plus vite possible{best !== null ? ` · Record : ${fmt(best)}` : ''}</span>
    </button>
  </section>

  <section class="grid" aria-label="Modules">
    {#each rows as { m, ratio }}
      {@const stars = starsOf(ratio)}
      <button type="button" class="card" class:reco={recommended === m.zone} onclick={() => pick({ kind: 'zone', zone: m.zone })}>
        {#if recommended === m.zone}<em class="tag">Conseillé</em>{/if}
        <span class="n">{m.zone}</span>
        <span class="t">
          <strong>{m.name}</strong>
          <span class="ex num">{m.example}</span>
        </span>
        <span class="prog">
          <span class="bar" aria-hidden="true"><i style:width="{Math.round(ratio * 100)}%"></i></span>
          <span class="meta num">
            <span class="stars" aria-label="{stars} étoile{stars > 1 ? 's' : ''} sur 3">{'★'.repeat(stars)}<b>{'★'.repeat(3 - stars)}</b></span>
            {Math.round(ratio * 100)} %
          </span>
        </span>
      </button>
    {/each}
  </section>
</div>

{#if settingsOpen}<Settings onclose={() => (settingsOpen = false)} />{/if}

<style>
  .home { gap: 14px; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  h1 { margin: 0; font-size: clamp(2rem, 4vw, 2.8rem); line-height: 1.1; }
  header p { margin: 2px 0 0; font-size: 1.3rem; color: var(--muted); }
  .gear { position: relative; overflow: hidden; width: 64px; height: 64px; border-radius: 18px; border: 3px solid var(--line); background: var(--card); color: var(--muted); display: grid; place-items: center; }
  .gear .fill { position: absolute; left: 0; bottom: 0; height: 6px; width: 100%; background: var(--accent); transform: scaleX(0); transform-origin: 0 50%; transition: transform 0s; }
  .gear.holding .fill { transform: scaleX(1); transition: transform 2s linear; }

  .specials { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .special { text-align: left; min-height: 96px; padding: 12px 20px; border-radius: 20px; border: 3px solid var(--accent); background: var(--accent); color: #fff; display: flex; flex-direction: column; justify-content: center; gap: 2px; transition: background-color 90ms; }
  .special:active { background: var(--accent-dark); }
  .special strong { font-size: 1.7rem; font-weight: 600; }
  .special span { font-size: 1.1rem; opacity: 0.95; }

  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .card { position: relative; text-align: left; min-height: 150px; padding: 14px 16px 14px; border-radius: 20px; border: 3px solid var(--line); background: var(--card); display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 12px; row-gap: 10px; align-content: space-between; transition: background-color 90ms; }
  .card:active { background: var(--accent-soft); }
  .card.reco { border-color: var(--accent); border-width: 4px; background: #F2F6FF; }
  .tag { position: absolute; top: -13px; right: 14px; font-style: normal; font-size: 0.95rem; font-weight: 600; background: var(--accent); color: #fff; padding: 2px 12px; border-radius: 999px; }
  .n { width: 44px; height: 44px; border-radius: 50%; background: var(--accent-soft); color: var(--accent-dark); display: grid; place-items: center; font-size: 1.4rem; font-weight: 600; }
  .t { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .t strong { font-size: 1.4rem; font-weight: 600; line-height: 1.15; }
  .ex { font-size: 1.7rem; color: var(--accent-dark); font-weight: 600; }
  .prog { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 6px; }
  .bar { height: 14px; border-radius: 7px; background: #E7E2D3; overflow: hidden; display: block; }
  .bar i { display: block; height: 100%; background: var(--accent); border-radius: 7px; }
  .meta { display: flex; justify-content: space-between; align-items: center; font-size: 1.15rem; font-weight: 600; color: var(--muted); }
  .stars { color: #D97706; font-size: 1.5rem; letter-spacing: 2px; }
  .stars b { color: #D8D2C0; font-weight: 400; }

  @media (max-aspect-ratio: 1/1), (max-width: 820px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .specials, .grid { grid-template-columns: 1fr; }
  }
</style>
