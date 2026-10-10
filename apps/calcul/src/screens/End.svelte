<script lang="ts">
  /** Fin de serie : justes, temps moyen, calculs a revoir, Recommencer / Retour. */
  import type { SessionResult } from '../../../maths/src/engine/index.ts';
  import { app } from '../state/store.svelte.ts';
  import { fmtSec, type RunConfig } from '../lib/run.ts';

  let { result, cfg, onretry, onback }: { result: SessionResult; cfg: RunConfig; onretry: () => void; onback: () => void } = $props();
  const sprint = cfg.kind === 'sprint';
  const missed = $derived([...new Map(result.missed.map((m) => [m.id, m])).values()]);
  const best = $derived(app.state.profile.sprint.bestMs);
  const headline = $derived(
    result.accuracy >= 0.9 ? 'Bravo !' : result.accuracy >= 0.7 ? 'Bien joué !' : 'Continue, ça vient !',
  );
</script>

<div class="screen end">
  <main>
    <h1>{headline}</h1>

    <div class="stats">
      <div class="stat"><span class="v num">{result.correct} / {result.questions}</span><span class="l">justes</span></div>
      {#if sprint}
        <div class="stat"><span class="v num">{fmtSec(result.totalMs ?? null)}</span><span class="l">temps total</span></div>
        <div class="stat"><span class="v num">{fmtSec(best)}</span><span class="l">{result.isRecord ? 'nouveau record !' : 'record'}</span></div>
      {:else}
        <div class="stat"><span class="v num">{fmtSec(result.avgMs)}</span><span class="l">temps moyen</span></div>
      {/if}
    </div>

    <section class="review">
      <h2>À revoir</h2>
      {#if missed.length}
        <ul>
          {#each missed as m}<li class="num">{m.text} = <b>{m.answer}</b></li>{/each}
        </ul>
      {:else}
        <p>Rien à revoir, tout est juste.</p>
      {/if}
    </section>

    <div class="actions">
      <button type="button" class="btn primary big" onclick={onretry}>Recommencer</button>
      <button type="button" class="btn big quiet" onclick={onback}>Retour</button>
    </div>
  </main>
</div>

<style>
  .end { align-items: center; justify-content: center; }
  main { width: 100%; max-width: 900px; display: flex; flex-direction: column; align-items: center; gap: 18px; }
  h1 { margin: 0; font-size: clamp(2.4rem, 6vw, 3.6rem); color: var(--accent-dark); }
  .stats { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; width: 100%; }
  .stat { flex: 1 1 200px; background: var(--card); border: 3px solid var(--line); border-radius: 22px; padding: 14px 18px; display: flex; flex-direction: column; align-items: center; }
  .v { font-size: clamp(2.4rem, 6vw, 3.8rem); font-weight: 600; line-height: 1.1; }
  .l { font-size: 1.3rem; color: var(--muted); }
  .review { width: 100%; background: var(--card); border: 3px solid var(--line); border-radius: 22px; padding: 12px 22px 16px; }
  .review h2 { margin: 0 0 6px; font-size: 1.4rem; color: var(--muted); }
  .review p { margin: 0; font-size: 1.4rem; }
  ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 8px 14px; }
  li { font-size: 1.7rem; background: var(--bad-bg); color: var(--bad); border-radius: 12px; padding: 4px 14px; }
  li b { font-weight: 600; }
  .actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
</style>
