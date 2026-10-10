<script lang="ts">
  /** Carte d'explication tres courte d'un module : strategie + visuel + « Commencer ». Lue a voix haute si la voix existe. */
  import { onMount } from 'svelte';
  import { MODULES, SUB_TIP, demoHint } from '../lib/modules.ts';
  import { sayStrategy, stopVoice } from '../lib/sound.ts';
  import HintVisual from '../ui/HintVisual.svelte';

  let { zone, onstart, onback }: { zone: number; onstart: () => void; onback: () => void } = $props();
  const m = $derived(MODULES[zone - 1]);
  const hint = $derived(demoHint(m));

  onMount(() => {
    sayStrategy(zone);
    return () => stopVoice();
  });
</script>

<div class="screen explain">
  <header>
    <button type="button" class="btn quiet" onclick={onback}>← Retour</button>
    {#if m.voice}<button type="button" class="btn quiet" onclick={() => sayStrategy(zone)} aria-label="Réécouter l'explication">🔊 Réécouter</button>{/if}
  </header>

  <article class="card">
    <h1>{m.name}</h1>
    <p class="tip">{m.tip}</p>
    <div class="visual"><HintVisual {hint} /></div>
    <p class="more">{m.more}</p>
    {#if zone < 9}<p class="sub">{SUB_TIP}</p>{/if}
  </article>

  <footer><button type="button" class="btn primary big" onclick={onstart}>Commencer</button></footer>
</div>

<style>
  .explain { gap: 14px; align-items: center; }
  header { width: 100%; max-width: 980px; display: flex; justify-content: space-between; gap: 12px; }
  .card { width: 100%; max-width: 980px; background: var(--card); border: 3px solid var(--line); border-radius: 26px; padding: 18px 28px 22px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
  h1 { margin: 0; font-size: clamp(1.9rem, 4vw, 2.6rem); color: var(--accent-dark); }
  .tip { margin: 0; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; line-height: 1.25; text-wrap: balance; }
  .visual { width: 100%; max-width: 760px; }
  .more { margin: 0; font-size: 1.45rem; font-weight: 500; text-wrap: balance; }
  .sub { margin: 4px 0 0; font-size: 1.2rem; color: var(--muted); padding: 8px 16px; background: #F1EEE3; border-radius: 14px; text-wrap: balance; }
  footer { margin-top: auto; padding-top: 6px; }
</style>
