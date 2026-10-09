<script lang="ts">
  // Footballeur de PROFIL en course (regarde a droite). `speed` (0 = a l'arret, 1 = course normale, 2 = sprint) pilote le timeScale.
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import { playerSide, setRunSide, runSide } from './core/ceart.js';

  type Props = {
    primary?: string; secondary?: string; shorts?: string; socks?: string;
    skin?: number | string; hair?: 'court' | 'boucles' | 'pique' | 'long'; hairColor?: number | string;
    number?: number | string; ghost?: boolean; width?: number; speed?: number;
  };
  let { primary, secondary, shorts, socks, skin, hair, hairColor, number, ghost = false, width = 200, speed = 1 }: Props = $props();

  let host: HTMLDivElement | undefined = $state();
  let tl: gsap.core.Timeline | undefined;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = $derived(playerSide({ primary, secondary, shorts, socks, skin, hair, hairColor, number, ghost }));

  $effect(() => {
    void html;
    const s = host?.querySelector('svg') as SVGSVGElement | null;
    if (!s) return;
    tl?.kill();
    setRunSide(gsap, s);
    if (reduce) return;
    tl = gsap.timeline({ repeat: -1 });
    runSide(gsap, tl, s, 0, 0.5, 0.5);
    tl.timeScale(Math.max(0.01, speed));
    tl.paused(speed <= 0);
  });
  $effect(() => {
    const v = speed;
    if (!tl) return;
    tl.paused(v <= 0);
    if (v > 0) gsap.to(tl, { timeScale: v, duration: 0.2, overwrite: true });
  });
  onMount(() => () => tl?.kill());
</script>

<div bind:this={host} class="ce-ps-host" style:width="{width}px">{@html html}</div>

<style>
  .ce-ps-host { display: inline-block; line-height: 0; }
  .ce-ps-host :global(svg) { width: 100%; height: auto; }
</style>
