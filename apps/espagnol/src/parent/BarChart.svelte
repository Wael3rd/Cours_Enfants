<script lang="ts">
  /** Barres verticales, une seule série (une teinte), survol = infobulle, ligne d'objectif optionnelle. */
  interface Point {
    label: string;
    value: number;
    detail?: string;
  }
  interface Props {
    data: Point[];
    title: string;
    unit?: string;
    goal?: number;
    goalLabel?: string;
    height?: number;
  }
  let { data, title, unit = 'min', goal, goalLabel = 'Objectif', height = 190 }: Props = $props();

  const W = 640;
  const padL = 34;
  const padB = 28;
  const padT = 12;
  const max = $derived(Math.max(1, goal ?? 0, ...data.map((d) => d.value)) * 1.1);
  const plotH = $derived(height - padB - padT);
  const step = $derived((W - padL - 8) / Math.max(1, data.length));
  const bw = $derived(Math.min(28, step * 0.62));
  const y = (v: number) => padT + plotH - (v / max) * plotH;
  const ticks = $derived([0, 0.5, 1].map((f) => Math.round(f * max * 0.9)));
  let hover = $state<number | null>(null);
  let table = $state(false);

  /** Barre arrondie en haut (4 px), ancrée sur la ligne de base. */
  function bar(i: number, v: number): string {
    const x = padL + i * step + (step - bw) / 2;
    const h = Math.max(0, (v / max) * plotH);
    if (h <= 0) return '';
    const r = Math.min(4, h, bw / 2);
    const top = y(v);
    const base = padT + plotH;
    return `M${x},${base} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${base} Z`;
  }
</script>

<figure class="chart">
  <figcaption>
    <span>{title}</span>
    <button type="button" class="link" onclick={() => (table = !table)}>{table ? 'Voir le graphique' : 'Voir le tableau'}</button>
  </figcaption>
  {#if table}
    <table>
      <thead><tr><th>Jour</th><th>{unit}</th><th>Détail</th></tr></thead>
      <tbody>
        {#each data as d}<tr><td>{d.label}</td><td>{d.value}</td><td>{d.detail ?? ''}</td></tr>{/each}
      </tbody>
    </table>
  {:else}
    <div class="wrap">
      <svg viewBox="0 0 {W} {height}" role="img" aria-label={title} onpointerleave={() => (hover = null)}>
        {#each ticks as t}
          <line x1={padL} x2={W - 8} y1={y(t)} y2={y(t)} class="grid" />
          <text x={padL - 6} y={y(t) + 4} class="tick" text-anchor="end">{t}</text>
        {/each}
        {#each data as d, i}
          <rect
            x={padL + i * step}
            y={padT}
            width={step}
            height={plotH + padB}
            fill="transparent"
            onpointerenter={() => (hover = i)}
            onpointerdown={() => (hover = i)}
            role="presentation"
          />
          <path d={bar(i, d.value)} class="bar" class:dim={hover !== null && hover !== i} />
          {#if i % Math.ceil(data.length / 7) === 0 || i === data.length - 1}
            <text x={padL + i * step + step / 2} y={height - 8} class="tick" text-anchor="middle">{d.label}</text>
          {/if}
        {/each}
        {#if goal}
          <line x1={padL} x2={W - 8} y1={y(goal)} y2={y(goal)} class="goal" />

        {/if}
      </svg>
      {#if hover !== null}
        <div class="tip" style:left="{((padL + hover * step + step / 2) / W) * 100}%">
          <strong>{data[hover].label}</strong>
          {data[hover].value} {unit}{data[hover].detail ? ` · ${data[hover].detail}` : ''}
        </div>
      {/if}
    </div>
  {/if}
  {#if goal && !table}<p class="legend"><svg width="26" height="8" aria-hidden="true"><line x1="0" x2="26" y1="4" y2="4" class="goal" /></svg> {goalLabel} : {goal} {unit}</p>{/if}
</figure>

<style>
  .chart { margin: 0; }
  figcaption { display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; margin-bottom: 6px; color: var(--ink); }
  .link { background: none; border: 0; color: var(--accent); cursor: pointer; font: inherit; font-weight: 500; font-size: 0.85rem; text-decoration: underline; padding: 4px; }
  .wrap { position: relative; }
  svg { width: 100%; height: auto; display: block; }
  .grid { stroke: var(--grid); stroke-width: 1; }
  .tick { fill: var(--muted); font-size: 11px; }
  .bar { fill: var(--series); transition: opacity 0.12s; }
  .bar.dim { opacity: 0.45; }
  .goal { stroke: var(--ink2); stroke-width: 1.5; stroke-dasharray: 5 4; }
  .legend svg { width: 26px; height: 8px; flex: none; }
  .legend { margin: 4px 0 0; font-size: 0.82rem; color: var(--ink2); display: flex; gap: 6px; align-items: center; }
  .tip { position: absolute; top: 0; transform: translateX(-50%); background: var(--surface2); color: var(--ink); border: 1px solid var(--grid); border-radius: 6px; padding: 4px 8px; font-size: 0.8rem; pointer-events: none; white-space: nowrap; box-shadow: 0 2px 8px #0003; }
  .tip strong { margin-right: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th, td { text-align: left; padding: 4px 8px; border-bottom: 1px solid var(--grid); }
</style>
