<script lang="ts">
  // Footballeur "grosse tete" anime (respiration / course). Le SVG vient de core/ceart.js (source unique avec HyperFrames).
  import { onMount, tick } from 'svelte';
  import { gsap, prefersReducedMotion } from '@ce/core';
  import { player, setPose, toPose, runCycle } from './core/ceart.js';

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
  const reduce = prefersReducedMotion();
  const html = $derived(player({ role, primary, secondary, shorts, socks, shoe, skin, hair, hairColor, number, kit, look, pose }));

  let breath: HTMLDivElement | undefined = $state();
  function svg() { return host?.querySelector('svg') as SVGSVGElement | null; }
  /** Attente : respiration sur le conteneur (couche composee par le GPU, le SVG n'est pas repeint a chaque image : fluide
   * sur tablette) + clignement des yeux toutes les 3,2 s (2 repeints brefs). La rotation de tete d'idleCycle reste pour les cinematiques. */
  function idleLight(t: gsap.core.Timeline, s: SVGSVGElement) {
    if (breath) t.to(breath, { scaleY: 1.022, duration: 1.6, ease: 'sine.inOut' }, 0).to(breath, { scaleY: 1, duration: 1.6, ease: 'sine.inOut' }, 1.6);
    s.querySelectorAll('.p-eye-open').forEach((e, k) => {
      const o = k ? '248 190' : '152 190';
      t.to(e, { scaleY: 0.08, svgOrigin: o, duration: 0.07, ease: 'power1.in' }, 2.3);
      t.to(e, { scaleY: 1, svgOrigin: o, duration: 0.1, ease: 'power1.out' }, 2.37);
    });
  }
  function loop() {
    const s = svg(); if (!s || reduce) return;
    tl?.kill(); tl = gsap.timeline({ repeat: -1 });
    if (motion === 'idle') idleLight(tl, s);
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
    if (breath) gsap.set(breath, { scaleY: 1 });
    const t = gsap.timeline({ onComplete: loop });
    toPose(gsap, t, s, p, 0, reduce ? 0.01 : 0.38);
    tl = t;
  });
  onMount(() => () => tl?.kill());
</script>

<div bind:this={host} class="ce-player-host" style:width="{width}px" style:transform={flip ? 'scaleX(-1)' : undefined}><div bind:this={breath} class="breath" class:live={motion === 'idle' && !reduce}>{@html html}</div></div>

<style>
  .ce-player-host { display: inline-block; line-height: 0; }
  .ce-player-host :global(svg) { width: 100%; height: auto; }
  .breath { transform-origin: 50% 100%; }
  .breath.live { will-change: transform; }
</style>
