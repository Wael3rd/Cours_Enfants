<script lang="ts">
  // Footballeur "grosse tete" anime (respiration / course). Le SVG vient de core/ceart.js (source unique avec HyperFrames).
  import { onMount, tick } from 'svelte';
  import { gsap } from '@ce/core';
  import { player, setPose, toPose, idleCycle, runCycle } from './core/ceart.js';

  type Props = {
    role?: 'joueur' | 'gardien' | 'coach';
    primary?: string; secondary?: string; shorts?: string; socks?: string; shoe?: string;
    skin?: number | string; hair?: 'court' | 'boucles' | 'pique' | 'long'; hairColor?: number | string;
    number?: number | string; kit?: 'uni' | 'rayures' | 'cerceaux' | 'bande';
    pose?: 'idle' | 'course' | 'frappe' | 'celebration' | 'decu' | 'attente' | 'plongeon' | 'explique';
    motion?: 'idle' | 'run' | 'none'; look?: number; width?: number; flip?: boolean;
  };
  let { role = 'joueur', primary, secondary, shorts, socks, shoe, skin, hair, hairColor, number, kit, pose = 'idle', motion = 'idle', look = 0, width = 200, flip = false }: Props = $props();

  let host: HTMLDivElement | undefined = $state();
  let tl: gsap.core.Timeline | undefined;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = $derived(player({ role, primary, secondary, shorts, socks, shoe, skin, hair, hairColor, number, kit, look, pose }));

  function svg() { return host?.querySelector('svg') as SVGSVGElement | null; }
  function loop() {
    const s = svg(); if (!s || reduce) return;
    tl?.kill(); tl = gsap.timeline({ repeat: -1 });
    if (motion === 'idle') idleCycle(gsap, tl, s, 0, 1.6);
    else if (motion === 'run') runCycle(gsap, tl, s, 0, 0.42, 0.42);
  }
  // Nouveau rendu (couleurs...) : re-appliquer la pose.
  $effect(() => {
    void html;
    void tick().then(() => { const s = svg(); if (!s) return; tl?.kill(); setPose(gsap, s, pose); loop(); });
  });
  // Changement de pose : transition douce puis reprise de la boucle.
  let first = true;
  $effect(() => {
    const p = pose; void motion;
    if (first) { first = false; return; }
    const s = svg(); if (!s) return;
    tl?.kill();
    const t = gsap.timeline({ onComplete: loop });
    toPose(gsap, t, s, p, 0, reduce ? 0.01 : 0.38);
    tl = t;
  });
  onMount(() => () => tl?.kill());
</script>

<div bind:this={host} class="ce-player-host" style:width="{width}px" style:transform={flip ? 'scaleX(-1)' : undefined}>{@html html}</div>

<style>
  .ce-player-host { display: inline-block; line-height: 0; }
  .ce-player-host :global(svg) { width: 100%; height: auto; }
</style>
