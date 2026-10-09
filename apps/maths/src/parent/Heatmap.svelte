<script lang="ts">
  import type { HeatCell, CellStatus } from '../engine/stats.ts';
  import { fmtSec } from './format.ts';

  interface Props {
    cells: HeatCell[];
    title: string;
    rowLabel: string;
    colLabel: string;
    thresholdMs: number;
  }
  let { cells, title, rowLabel, colLabel, thresholdMs }: Props = $props();

  let selected = $state<string | null>(null);
  const sel = $derived(cells.find((c) => c.id === selected) ?? null);
  const idx = Array.from({ length: 11 }, (_, i) => i);

  const GLYPH: Record<CellStatus, string> = { unseen: '', error: '✕', slow: '⋯', fluent: '✓' };
  const LABEL: Record<CellStatus, string> = {
    unseen: 'Jamais vu',
    error: 'Erreur à la dernière réponse',
    slow: 'Juste mais pas encore automatique',
    fluent: 'Fluent',
  };
  const counts = $derived({
    fluent: cells.filter((c) => c.status === 'fluent').length,
    slow: cells.filter((c) => c.status === 'slow').length,
    error: cells.filter((c) => c.status === 'error').length,
    unseen: cells.filter((c) => c.status === 'unseen').length,
  });
  const byPos = $derived(new Map(cells.map((c) => [c.row * 11 + c.col, c])));
  const answer = (c: HeatCell) => c.text.split('= ')[1];
</script>

<figure class="hm">
  <figcaption>
    <h3>{title}</h3>
    <span class="meta">{counts.fluent}/121 fluents</span>
  </figcaption>

  <div class="grid" role="grid" aria-label={title}>
    <div class="corner" aria-hidden="true"><span class="rl">{rowLabel}</span><span class="cl">{colLabel}</span></div>
    {#each idx as c}<div class="ch" role="columnheader">{c}</div>{/each}
    {#each idx as r}
      <div class="rh" role="rowheader">{r}</div>
      {#each idx as c}
        {@const cell = byPos.get(r * 11 + c)!}
        <button
          type="button"
          class="cell {cell.status}"
          class:on={selected === cell.id}
          aria-label="{cell.text} : {LABEL[cell.status]}"
          aria-pressed={selected === cell.id}
          onclick={() => (selected = selected === cell.id ? null : cell.id)}
        >
          <span class="val">{answer(cell)}</span>
          <span class="gl" aria-hidden="true">{GLYPH[cell.status]}</span>
        </button>
      {/each}
    {/each}
  </div>

  <div class="detail" aria-live="polite">
    {#if sel}
      <strong>{sel.text}</strong>
      <span class="chip {sel.status}"><span aria-hidden="true">{GLYPH[sel.status]}</span> {LABEL[sel.status]}</span>
      <span>
        {#if sel.attempts === 0}Jamais posé directement{:else}
          {sel.attempts} tentative{sel.attempts > 1 ? 's' : ''}, {sel.errors} erreur{sel.errors > 1 ? 's' : ''}
          · temps moyen {sel.avgMs === null ? '—' : fmtSec(sel.avgMs)} (seuil {fmtSec(thresholdMs)})
          · boîte {sel.box}/5{/if}
      </span>
    {:else}
      <span class="hint">Touchez une case pour le détail.</span>
    {/if}
  </div>
</figure>

<style>
  .hm { margin: 0; min-width: 0; }
  figcaption { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  h3 { margin: 0; font-size: 1rem; font-weight: 650; }
  .meta { color: var(--text-secondary); font-size: 0.875rem; font-variant-numeric: tabular-nums; }
  .grid { display: grid; grid-template-columns: 26px repeat(11, minmax(0, 1fr)); gap: 2px; }
  .corner { position: relative; font-size: 0.6875rem; color: var(--text-muted); }
  .rl { position: absolute; left: 0; bottom: 0; }
  .cl { position: absolute; right: 0; top: 0; }
  .ch, .rh { display: grid; place-items: center; font-size: 0.75rem; color: var(--text-secondary); font-variant-numeric: tabular-nums; min-height: 22px; }
  .cell {
    position: relative; aspect-ratio: 1; min-width: 0; padding: 0; border: 0; border-radius: 4px; cursor: pointer;
    color: #0b0b0b; font: inherit; font-size: 0.8125rem; font-variant-numeric: tabular-nums;
    display: grid; place-items: center;
  }
  .cell .gl { position: absolute; top: 1px; right: 3px; font-size: 0.625rem; line-height: 1; font-weight: 700; }
  .cell.on { outline: 2px solid var(--text-primary); outline-offset: 1px; z-index: 1; }
  .cell:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 1px; }
  .unseen { background: var(--st-unseen); color: var(--text-muted); }
  .error { background: var(--st-error); }
  .slow { background: var(--st-slow); }
  .fluent { background: var(--st-fluent); }
  .detail { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; min-height: 44px; margin-top: 10px; font-size: 0.875rem; color: var(--text-secondary); }
  .detail strong { color: var(--text-primary); font-size: 1rem; font-variant-numeric: tabular-nums; }
  .hint { color: var(--text-muted); }
  .chip { display: inline-flex; gap: 5px; align-items: center; padding: 2px 8px; border-radius: 99px; font-size: 0.8125rem; color: #0b0b0b; }
</style>
