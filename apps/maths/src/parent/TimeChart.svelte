<script lang="ts">
  import type { PointSeries } from '../engine/stats.ts';
  import { fmtSec, fmtDate, MODE_LABEL } from './format.ts';

  interface Props {
    series: PointSeries[];
    thresholdMs: number;
  }
  let { series, thresholdMs }: Props = $props();

  const W = 640, H = 260, M = { l: 44, r: 16, t: 14, b: 30 };
  const iw = W - M.l - M.r, ih = H - M.t - M.b;

  const maxMs = $derived(Math.max(thresholdMs * 1.4, ...series.map((p) => p.avgMs)) * 1.08);
  const yMax = $derived(Math.ceil(maxMs / 1000));
  const x = (i: number) => M.l + (series.length <= 1 ? iw / 2 : (i / (series.length - 1)) * iw);
  const y = (ms: number) => M.t + ih - (ms / (yMax * 1000)) * ih;
  const path = $derived(series.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.avgMs).toFixed(1)}`).join(''));
  const area = $derived(series.length > 1 ? `${path}L${x(series.length - 1).toFixed(1)},${M.t + ih}L${x(0).toFixed(1)},${M.t + ih}Z` : '');
  const yTicks = $derived(Array.from({ length: yMax + 1 }, (_, i) => i).filter((v) => yMax <= 6 || v % 2 === 0));
  const xTicks = $derived(
    series.length <= 8 ? series.map((_, i) => i) : [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * (series.length - 1))),
  );
  const showDots = $derived(series.length <= 30);

  let hover = $state<number | null>(null);
  let table = $state(false);
  let svg: SVGSVGElement | undefined = $state();

  function move(e: PointerEvent) {
    if (!svg || !series.length) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0, bd = Infinity;
    for (let i = 0; i < series.length; i++) { const d = Math.abs(x(i) - px); if (d < bd) { bd = d; best = i; } }
    hover = best;
  }
  const hp = $derived(hover !== null ? series[hover] : null);
  const first = $derived(series[0]);
  const last = $derived(series[series.length - 1]);
</script>

<figure class="tc">
  <figcaption>
    <h3>Temps moyen de réponse par session</h3>
    <button type="button" class="link" onclick={() => (table = !table)} aria-pressed={table}>{table ? 'Voir le graphique' : 'Voir en tableau'}</button>
  </figcaption>

  {#if series.length === 0}
    <p class="empty">Pas encore de session jouée.</p>
  {:else if table}
    <div class="tbl">
      <table>
        <thead><tr><th>Session</th><th>Date</th><th>Mode</th><th class="n">Temps moyen</th></tr></thead>
        <tbody>
          {#each series.toReversed().slice(0, 60) as p}
            <tr><td>{p.n}</td><td>{fmtDate(p.at)}</td><td>{MODE_LABEL[p.mode]}</td><td class="n">{fmtSec(p.avgMs)}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <svg bind:this={svg} viewBox="0 0 {W} {H}" role="img"
      aria-label="Courbe du temps moyen de réponse : {fmtSec(first.avgMs)} à la session 1, {fmtSec(last.avgMs)} à la session {last.n}. Seuil de fluence {fmtSec(thresholdMs)}."
      onpointermove={move} onpointerdown={move} onpointerleave={() => (hover = null)}>
      {#each yTicks as v}
        <line class="grid" x1={M.l} x2={W - M.r} y1={y(v * 1000)} y2={y(v * 1000)} />
        <text class="tick" x={M.l - 8} y={y(v * 1000) + 4} text-anchor="end">{v} s</text>
      {/each}
      <line class="axis" x1={M.l} x2={W - M.r} y1={M.t + ih} y2={M.t + ih} />
      {#each xTicks as i}
        <text class="tick" x={x(i)} y={H - 8} text-anchor="middle">{series[i].n}</text>
      {/each}
      

      <!-- seuil de fluence : reference -->
      <line class="thr" x1={M.l} x2={W - M.r} y1={y(thresholdMs)} y2={y(thresholdMs)} />
      <text class="thr-l" x={W - M.r} y={y(thresholdMs) - 6} text-anchor="end">Seuil de fluence {fmtSec(thresholdMs)}</text>

      {#if area}<path class="area" d={area} />{/if}
      {#if series.length > 1}<path class="line" d={path} />{/if}
      {#if showDots}
        {#each series as p, i}<circle class="dot" cx={x(i)} cy={y(p.avgMs)} r="4" />{/each}
      {:else}
        <circle class="dot" cx={x(series.length - 1)} cy={y(last.avgMs)} r="4" />
      {/if}
      <text class="lab" x={Math.min(x(series.length - 1), W - M.r - 40)} y={y(last.avgMs) - 10} text-anchor="middle">{fmtSec(last.avgMs)}</text>

      {#if hp && hover !== null}
        <line class="cross" x1={x(hover)} x2={x(hover)} y1={M.t} y2={M.t + ih} />
        <circle class="dot big" cx={x(hover)} cy={y(hp.avgMs)} r="6" />
      {/if}
    </svg>
    <div class="tip" aria-live="polite">
      {#if hp}
        <strong>Session {hp.n}</strong> · {fmtDate(hp.at)} · {MODE_LABEL[hp.mode]} · <strong>{fmtSec(hp.avgMs)}</strong>
      {:else}
        <span class="hint">Touchez la courbe pour lire une session.</span>
      {/if}
    </div>
  {/if}
</figure>

<style>
  .tc { margin: 0; min-width: 0; }
  figcaption { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
  h3 { margin: 0; font-size: 1rem; font-weight: 650; }
  .link { background: none; border: 0; padding: 6px 4px; color: var(--accent); font: inherit; font-size: 0.875rem; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
  svg { width: 100%; height: auto; display: block; touch-action: pan-y; }
  .grid { stroke: var(--grid); stroke-width: 1; }
  .axis { stroke: var(--axis); stroke-width: 1; }
  .tick { fill: var(--text-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .thr { stroke: var(--text-secondary); stroke-width: 1; stroke-dasharray: 5 4; }
  .thr-l { fill: var(--text-secondary); font-size: 11px; }
  .line { fill: none; stroke: var(--series-1); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .area { fill: var(--series-1); opacity: 0.1; }
  .dot { fill: var(--series-1); stroke: var(--surface); stroke-width: 2; }
  .dot.big { stroke-width: 2.5; }
  .lab { fill: var(--text-primary); font-size: 12px; font-weight: 650; font-variant-numeric: tabular-nums; }
  .cross { stroke: var(--text-muted); stroke-width: 1; }
  .tip { min-height: 28px; margin-top: 4px; font-size: 0.875rem; color: var(--text-secondary); }
  .tip strong { color: var(--text-primary); }
  .hint, .empty { color: var(--text-muted); }
  .tbl { max-height: 280px; overflow: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  th, td { padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--grid); }
  th { color: var(--text-secondary); font-weight: 600; position: sticky; top: 0; background: var(--surface); }
  .n { text-align: right; font-variant-numeric: tabular-nums; }
</style>
