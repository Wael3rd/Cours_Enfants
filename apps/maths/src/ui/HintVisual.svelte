<script lang="ts">
  /**
   * Indice visuel du moteur (VisualHint) : cadre a 10 (formation de joueurs), ligne numerique (le terrain), famille de nombres.
   * Les jetons / sauts apparaissent en cascade (GSAP, transform + opacity). `reveal` : 1 = tout, 0 = seulement la question.
   */
  import { gsap } from '@ce/core';
  import type { VisualHint } from '../engine/index.ts';

  let { hint, colorA = '#E8212F', colorB = '#FFD23F', caption = true, compact = false }: {
    hint: VisualHint; colorA?: string; colorB?: string; caption?: boolean; compact?: boolean;
  } = $props();

  type Cell = 0 | 1 | 2 | 3; // 0 vide, 1 equipe A, 2 equipe B, 3 equipe B mise en avant (complement)
  interface Frame { cells: Cell[]; label?: string }

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
  const frames = $derived.by((): Frame[] => {
    const { a, b, kind } = hint;
    if (mode !== 'frames') return [];
    if (kind === 'doubles') return [{ cells: fill(a, 0) }, { cells: fill(0, a).map((v) => (v ? 2 : 0)) as Cell[] }];
    if (kind === 'near-double') {
      const s = Math.min(a, b);
      return [{ cells: fill(s, 0) }, { cells: fill(s, 0).map((v) => (v ? 2 : 0)) as Cell[], label: '+1' }];
    }
    if (kind === 'plus-zero') return [{ cells: fill(Math.max(a, b), 0) }];
    if (kind === 'bridge-ten') {
      const toTen = Math.max(0, 10 - a), rest = b - toTen;
      const f2: Cell[] = Array(10).fill(0);
      for (let i = 0; i < rest; i++) f2[i] = 2;
      return [{ cells: fill(a, toTen, true) }, { cells: f2 }];
    }
    return [{ cells: fill(a, b) }];
  });
  // near-double : 2e cadre = meme nombre en B + 1 jeton mis en avant
  const frames2 = $derived(
    hint.kind === 'near-double' && frames.length === 2
      ? [frames[0], { ...frames[1], cells: frames[1].cells.map((v, i) => (i === Math.min(hint.a, hint.b) ? 3 : v)) as Cell[] }]
      : frames,
  );

  // ---- ligne numerique
  const start = $derived(hint.zone === 9 ? hint.a : hint.kind === 'number-line' ? Math.max(hint.a, hint.b) : hint.a);
  const pts = $derived([start, ...hint.steps.map((s) => s.value)]);
  const lo = $derived(Math.max(0, Math.min(...pts) - 1));
  const hi = $derived(Math.max(...pts) + 1);
  const W = 700, X0 = 30;
  const span = $derived(hi - lo);
  const px = (v: number) => X0 + ((v - lo) / span) * W;
  const tickEvery = $derived(span > 26 ? 5 : 1);

  let root: SVGSVGElement | undefined = $state();
  let ctx: gsap.Context | undefined;
  $effect(() => {
    void hint; void mode;
    ctx?.revert();
    if (!root) return;
    ctx = gsap.context(() => {
      const tl = gsap.timeline();
      gsap.set('.tok, .hop-ball, .fam-n, .hop', { transformOrigin: '50% 50%' });
      tl.from('.tok', { scale: 0, opacity: 0, duration: 0.28, ease: 'back.out(2.2)', stagger: 0.045 });
      tl.from('.hop', { opacity: 0, scale: 0.6, duration: 0.3, ease: 'back.out(1.8)', stagger: 0.25 }, 0.1);
      tl.from('.fam-n', { scale: 0, opacity: 0, duration: 0.32, ease: 'back.out(2)', stagger: 0.12 }, 0);
      tl.from('.fam-eq', { opacity: 0, y: 12, duration: 0.3, stagger: 0.3 }, 0.4);
      if (mode === 'line') {
        const b = '.hop-ball';
        gsap.set(b, { x: px(pts[0]), y: 0 });
        pts.slice(1).forEach((v, i) => {
          const from = px(pts[i]), to = px(v);
          tl.to(b, { x: to, duration: 0.42, ease: 'power1.inOut' }, 0.15 + i * 0.5);
          tl.fromTo(b, { y: 0 }, { y: -34, duration: 0.21, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.15 + i * 0.5);
          void from;
        });
      }
    }, root);
    return () => ctx?.revert();
  });

  const col = (c: Cell) => (c === 1 ? colorA : c === 2 ? colorB : c === 3 ? '#35D6FF' : 'none');
  const nums = $derived(hint.kind === 'fact-family' ? [hint.a, hint.b, hint.a + hint.b] : []);
</script>

<div class="hint" class:compact>
  <svg bind:this={root} viewBox="0 0 760 {mode === 'line' ? 190 : mode === 'family' ? 250 : 210}" role="img" aria-label={hint.caption}>
    {#if mode === 'frames'}
      {#each frames2 as f, fi}
        {@const w = 5 * 56 + 16}
        {@const ox = frames2.length === 1 ? 380 - w / 2 : fi === 0 ? 380 - w - 36 : 380 + 36}
        <g transform="translate({ox}, 38)">
          <rect x="-8" y="-8" width={w} height="132" rx="18" fill="#0B6B31" stroke="#fff" stroke-width="4" opacity=".92" />
          {#each f.cells as c, i}
            {@const cx = (i % 5) * 56 + 20}
            {@const cy = Math.floor(i / 5) * 60 + 26}
            <rect x={cx - 24} y={cy - 24} width="48" height="48" rx="10" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.35)" stroke-width="2" />
            {#if c}
              <g class="tok" transform="translate({cx},{cy})">
                <circle r="21" fill={col(c)} stroke="#0A1030" stroke-width="3" />
                <path d="M-12 -6 q12 -12 24 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55" />
              </g>
            {/if}
          {/each}
        </g>
        {#if frames2.length === 2 && fi === 0}
          <text x="380" y="106" text-anchor="middle" class="op">{hint.kind === 'doubles' ? '=' : '+'}</text>
        {/if}
      {/each}
    {:else if mode === 'line'}
      <g transform="translate(0,70)">
        <rect x="8" y="46" width="744" height="64" rx="18" fill="#0B6B31" stroke="#fff" stroke-width="4" />
        {#each Array.from({ length: Math.floor(span / tickEvery) + 1 }, (_, i) => lo + i * tickEvery) as v}
          <line x1={px(v)} y1="54" x2={px(v)} y2="70" stroke="#fff" stroke-width="3" opacity=".75" />
          {#if span <= 26 || v % 5 === 0}<text x={px(v)} y="100" text-anchor="middle" class="tick">{v}</text>{/if}
        {/each}
        {#each hint.steps as s, i}
          {@const x1 = px(pts[i])}
          {@const x2 = px(s.value)}
          <g class="hop"><path d="M{x1} 46 Q{(x1 + x2) / 2} -28 {x2} 46" fill="none" stroke={colorB} stroke-width="6" stroke-linecap="round" stroke-dasharray="2 12" /><text x={(x1 + x2) / 2} y="-4" text-anchor="middle" class="hop-l">{s.label}</text></g>
        {/each}
        <g class="hop-ball"><circle r="17" cy="30" fill="#fff" stroke="#0A1030" stroke-width="3" /><circle r="6" cy="30" fill="#0A1030" /></g>
      </g>
    {:else}
      <g transform="translate(380,20)">
        <path d="M0 8 L-150 196 H150Z" fill="rgba(255,255,255,.08)" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
        <g class="fam-n" transform="translate(0,66)"><circle r="42" fill={colorB} stroke="#0A1030" stroke-width="4" /><text y="16" text-anchor="middle" class="fam-t">{nums[2]}</text></g>
        <g class="fam-n" transform="translate(-100,168)"><circle r="36" fill={colorA} stroke="#0A1030" stroke-width="4" /><text y="14" text-anchor="middle" class="fam-t s">{nums[0]}</text></g>
        <g class="fam-n" transform="translate(100,168)"><circle r="36" fill="#35D6FF" stroke="#0A1030" stroke-width="4" /><text y="14" text-anchor="middle" class="fam-t s dark">{nums[1]}</text></g>
      </g>
      {#each hint.steps as s, i}
        <text class="fam-eq" x={i === 0 ? 150 : 610} y="130" text-anchor="middle">{s.label}</text>
      {/each}
    {/if}
  </svg>
  {#if caption}<p class="cap">{hint.caption}</p>{/if}
</div>

<style>
  .hint { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
  svg { width: 100%; max-height: 300px; overflow: visible; }
  .compact svg { max-height: 190px; }
  .op { font: 400 64px var(--f-display); fill: #fff; }
  .tick { font: 600 20px var(--f-text); fill: #fff; }
  .hop-l { font: 700 22px var(--f-text); fill: #FFD23F; paint-order: stroke; stroke: #0A1030; stroke-width: 5px; }
  .fam-t { font: 400 44px var(--f-display); fill: #0A1030; }
  .fam-t.s { font-size: 38px; fill: #fff; }
  .fam-t.dark { fill: #0A1030; }
  .fam-eq { font: 400 36px var(--f-display); fill: #fff; letter-spacing: 1px; }
  .cap { margin: 0; font: 600 1.45rem/1.25 var(--f-text); text-align: center; max-width: 34em; text-wrap: balance; text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4); }
  .compact .cap { font-size: 1.2rem; }
</style>
