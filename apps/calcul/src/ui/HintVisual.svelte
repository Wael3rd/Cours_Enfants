<script lang="ts">
  /**
   * Indice visuel du moteur (VisualHint), version sobre et statique : cadre(s) a 10, ligne numerique, famille de nombres.
   * Aucune animation. Les couleurs : accent (premier groupe), orange (second), vert (complement).
   */
  import type { VisualHint } from '../../../maths/src/engine/index.ts';
  import { plain } from '../lib/modules.ts';

  let { hint, caption = true }: { hint: VisualHint; caption?: boolean } = $props();

  type Cell = 0 | 1 | 2 | 3;
  const tokenKinds = new Set(['ten-frame', 'make-ten', 'doubles', 'near-double', 'plus-zero', 'bridge-ten']);
  const mode = $derived(
    hint.kind === 'fact-family' ? 'family'
      : tokenKinds.has(hint.kind) && hint.zone !== 9 && hint.a <= 10 && hint.b <= 10 ? 'frames'
        : 'line',
  );

  function fill(a: number, b: number, hi = false): Cell[] {
    const c: Cell[] = Array(10).fill(0);
    for (let i = 0; i < Math.min(a, 10); i++) c[i] = 1;
    for (let i = 0; i < b && a + i < 10; i++) c[a + i] = hi ? 3 : 2;
    return c;
  }
  const frames = $derived.by((): Cell[][] => {
    const { a, b, kind } = hint;
    if (mode !== 'frames') return [];
    if (kind === 'doubles') return [fill(a, 0), fill(0, a)];
    if (kind === 'near-double') {
      const s = Math.min(a, b);
      return [fill(s, 0), fill(0, s).map((v, i) => (i === s ? 3 : v)) as Cell[]];
    }
    if (kind === 'plus-zero') return [fill(Math.max(a, b), 0)];
    if (kind === 'bridge-ten') {
      const toTen = Math.max(0, 10 - a), rest = b - toTen;
      const f2: Cell[] = Array(10).fill(0);
      for (let i = 0; i < rest; i++) f2[i] = 2;
      return [fill(a, toTen, true), f2];
    }
    return [fill(a, b)];
  });

  // ligne numerique
  const start = $derived(hint.zone === 9 ? hint.a : hint.kind === 'number-line' ? Math.max(hint.a, hint.b) : hint.a);
  const pts = $derived([start, ...hint.steps.map((s) => s.value)]);
  const lo = $derived(Math.max(0, Math.min(...pts) - 1));
  const hi = $derived(Math.max(...pts) + 1);
  const W = 700, X0 = 30;
  const span = $derived(hi - lo);
  const px = (v: number) => X0 + ((v - lo) / span) * W;
  const tickEvery = $derived(span > 26 ? 5 : 1);

  const col = (c: Cell) => (c === 1 ? '#2563EB' : c === 2 ? '#F59E0B' : c === 3 ? '#0F9D58' : 'none');
  const nums = $derived(hint.kind === 'fact-family' ? [hint.a, hint.b, hint.a + hint.b] : []);
</script>

<div class="hint">
  <svg viewBox="0 0 760 {mode === 'line' ? 170 : mode === 'family' ? 250 : 170}" role="img" aria-label={plain(hint.caption)}>
    {#if mode === 'frames'}
      {#each frames as cells, fi}
        {@const w = 5 * 56 + 16}
        {@const ox = frames.length === 1 ? 380 - w / 2 : fi === 0 ? 380 - w - 36 : 380 + 36}
        <g transform="translate({ox}, 20)">
          <rect x="-8" y="-8" width={w} height="132" rx="14" fill="#fff" stroke="#55606E" stroke-width="3" />
          {#each cells as c, i}
            {@const cx = (i % 5) * 56 + 20}
            {@const cy = Math.floor(i / 5) * 60 + 26}
            <rect x={cx - 24} y={cy - 24} width="48" height="48" rx="8" fill="#F1EEE3" stroke="#CFC9B8" stroke-width="2" />
            {#if c}<circle cx={cx} cy={cy} r="20" fill={col(c)} />{/if}
          {/each}
        </g>
        {#if frames.length === 2 && fi === 0}
          <text x="380" y="98" text-anchor="middle" class="op">+</text>
        {/if}
      {/each}
    {:else if mode === 'line'}
      <g transform="translate(0,40)">
        <rect x="8" y="46" width="744" height="64" rx="16" fill="#fff" stroke="#55606E" stroke-width="3" />
        {#each Array.from({ length: Math.floor(span / tickEvery) + 1 }, (_, i) => lo + i * tickEvery) as v}
          <line x1={px(v)} y1="54" x2={px(v)} y2="70" stroke="#55606E" stroke-width="3" />
          {#if span <= 26 || v % 5 === 0}<text x={px(v)} y="98" text-anchor="middle" class="tick">{v}</text>{/if}
        {/each}
        {#each hint.steps as s, i}
          {@const x1 = px(pts[i])}
          {@const x2 = px(s.value)}
          <path d="M{x1} 46 Q{(x1 + x2) / 2} -22 {x2} 46" fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" />
          <text x={(x1 + x2) / 2} y="-2" text-anchor="middle" class="hop-l">{s.label}</text>
        {/each}
        <circle cx={px(pts[0])} cy="30" r="12" fill="#2563EB" />
        <circle cx={px(pts[pts.length - 1])} cy="30" r="12" fill="#0F9D58" />
      </g>
    {:else}
      <g transform="translate(380,16)">
        <path d="M0 8 L-150 196 H150Z" fill="#fff" stroke="#55606E" stroke-width="4" stroke-linejoin="round" />
        <g transform="translate(0,66)"><circle r="42" fill="#F59E0B" /><text y="15" text-anchor="middle" class="fam-t">{nums[2]}</text></g>
        <g transform="translate(-100,168)"><circle r="36" fill="#2563EB" /><text y="13" text-anchor="middle" class="fam-t s">{nums[0]}</text></g>
        <g transform="translate(100,168)"><circle r="36" fill="#0F9D58" /><text y="13" text-anchor="middle" class="fam-t s">{nums[1]}</text></g>
      </g>
      {#each hint.steps as s, i}
        <text class="fam-eq" x={i === 0 ? 150 : 610} y="130" text-anchor="middle">{s.label}</text>
      {/each}
    {/if}
  </svg>
  {#if caption}<p class="cap">{plain(hint.caption)}</p>{/if}
</div>

<style>
  .hint { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
  svg { width: 100%; max-height: 230px; overflow: visible; }
  .op { font: 600 64px var(--f); fill: #1B2430; }
  .tick { font: 600 20px var(--f); fill: #1B2430; }
  .hop-l { font: 600 22px var(--f); fill: #9A3412; }
  .fam-t { font: 600 40px var(--f); fill: #fff; }
  .fam-eq { font: 600 34px var(--f); fill: #1B2430; }
  .cap { margin: 0; font: 500 1.5rem/1.3 var(--f); text-align: center; max-width: 30em; text-wrap: balance; }
</style>
