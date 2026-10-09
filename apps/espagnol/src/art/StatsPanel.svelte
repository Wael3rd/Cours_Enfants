<script lang="ts" module>
  export interface Stat { level: number; xp: number; max: number }
</script>

<script lang="ts">
  /** Panneau de stats RPG : 5 competences (activites langagieres) en radar + barres. Le radar se deploie a l'apparition. */
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import Panel from './Panel.svelte';

  interface Props {
    stats: { escuchar: Stat; hablar: Stat; leer: Stat; escribir: Stat; cultura: Stat };
    title?: string;
  }
  let { stats, title = 'Habilidades' }: Props = $props();

  const KEYS = [
    { k: 'escuchar', label: 'Escuchar', color: '#19b7aa', icon: 'M10 20h7l9-8v24l-9-8h-7Zm17-3q6 7 0 14' },
    { k: 'hablar', label: 'Hablar', color: '#ff9f1c', icon: 'M8 10h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H22l-9 8v-8H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z' },
    { k: 'leer', label: 'Leer', color: '#3a8dff', icon: 'M6 10q10-3 18 3 8-6 18-3v26q-10-3-18 3-8-6-18-3Zm18 3v26' },
    { k: 'escribir', label: 'Escribir', color: '#d93472', icon: 'M8 40l4-12 22-22 8 8-22 22Zm20-30l8 8' },
    { k: 'cultura', label: 'Cultura', color: '#0e9f6e', icon: 'M24 6a18 18 0 1 0 0 36 18 18 0 0 0 0-36Zm-18 18h36M24 6q-10 18 0 36M24 6q10 18 0 36' },
  ] as const;
  const C = 150, R = 118;
  const ang = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
  const pt = (i: number, f: number) => [C + Math.cos(ang(i)) * R * f, C + Math.sin(ang(i)) * R * f];
  const ring = (f: number) => KEYS.map((_, i) => pt(i, f).map((n) => n.toFixed(1)).join(',')).join(' ');
  const poly = $derived(KEYS.map((s, i) => { const st = stats[s.k]; return pt(i, 0.18 + 0.82 * Math.min(1, st.level / 10)).map((n) => n.toFixed(1)).join(','); }).join(' '));

  let shape: SVGElement | undefined = $state();
  onMount(() => {
    if (shape) gsap.fromTo(shape, { scale: 0.2, opacity: 0, svgOrigin: `${C} ${C}` }, { scale: 1, opacity: 1, svgOrigin: `${C} ${C}`, duration: 0.9, ease: 'elastic.out(1,0.6)' });
  });
</script>

<Panel padding="26px 30px">
  <h3>{title}</h3>
  <div class="row">
    <svg viewBox="0 0 300 300" width="300" height="300" aria-hidden="true">
      {#each [0.25, 0.5, 0.75, 1] as f}<polygon points={ring(f)} fill="none" stroke="#f5e6c8" stroke-opacity={f === 1 ? 0.5 : 0.18} stroke-width="2" />{/each}
      {#each KEYS as _, i}<line x1={C} y1={C} x2={pt(i, 1)[0]} y2={pt(i, 1)[1]} stroke="#f5e6c8" stroke-opacity="0.18" stroke-width="2" />{/each}
      <g bind:this={shape}>
        <polygon points={poly} fill="#ffc83d" fill-opacity="0.35" stroke="#ffc83d" stroke-width="5" stroke-linejoin="round" />
        {#each KEYS as s, i}<circle cx={pt(i, 0.18 + 0.82 * Math.min(1, stats[s.k].level / 10))[0]} cy={pt(i, 0.18 + 0.82 * Math.min(1, stats[s.k].level / 10))[1]} r="8" fill={s.color} stroke="#fff" stroke-width="3" />{/each}
      </g>
    </svg>
    <ul>
      {#each KEYS as s}
        {@const st = stats[s.k]}
        <li>
          <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><circle cx="24" cy="24" r="23" fill={s.color} /><path d={s.icon} transform="translate(7 7) scale(.7)" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <div class="meta"><b>{s.label}</b><span class="bar"><i style:transform="scaleX({Math.min(1, st.xp / st.max)})" style:background={s.color}></i></span></div>
          <strong>{st.level}</strong>
        </li>
      {/each}
    </ul>
  </div>
</Panel>

<style>
  h3 { margin: 0 0 6px; font: 400 32px/1 var(--q-font-title); color: var(--q-sol); }
  .row { display: flex; align-items: center; gap: 28px; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; min-width: 330px; }
  li { display: flex; align-items: center; gap: 14px; }
  .meta { flex: 1; display: grid; gap: 5px; }
  b { font: 800 22px/1 var(--q-font-body); }
  .bar { display: block; height: 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.14); overflow: hidden; }
  .bar i { display: block; height: 100%; width: 100%; transform-origin: 0 50%; border-radius: 6px; }
  strong { font: 400 34px/1 var(--q-font-title); color: var(--q-sol); min-width: 34px; text-align: right; }
</style>
