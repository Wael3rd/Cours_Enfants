<script lang="ts">
  /**
   * El Quetzal. `pose` : perched | fly | glide | talk | sad | happy. `bare` : sans plumes (queue et huppe reduites, couleurs ternes).
   * Methodes (bind:this) : setPose(p, dur), flap(n), talk(secondes), regrow(), blink().
   */
  import { onMount } from 'svelte';
  import { gsap, prefersReducedMotion } from '@ce/core';
  import * as Q from './core/qart.js';

  interface Props {
    pose?: 'perched' | 'fly' | 'glide' | 'talk' | 'sad' | 'happy';
    bare?: boolean;
    branch?: boolean;
    width?: number;
    /** viewBox personnalise (ex. buste : "210 50 220 220") */
    view?: string;
    /** plumes gagnees (0-10) : plumes de queue puis de huppe en plus */
    plumas?: number;
    /** clignement + ondulation de la queue en boucle */
    idle?: boolean;
  }
  let { pose = 'perched', bare = false, branch = false, width = 300, view, idle = true, plumas = 0 }: Props = $props();
  let host: HTMLElement | undefined = $state();
  let loop: gsap.core.Timeline | undefined;
  const svg = $derived(Q.quetzal({ branch, plumas, width, height: view ? width : Math.round(width * 1.2), view }));
  let current = 'perched';

  function startIdle() {
    loop?.kill();
    if (!idle || !host || prefersReducedMotion()) return;
    loop = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
    Q.quetzalBlink(loop, host, 1.8);
    Q.quetzalSway(loop, host, 0.4, 2.4, 0.8);
    Q.quetzalBlink(loop, host, 4.2);
    loop.to({}, { duration: 5 }, 0);
  }

  onMount(() => {
    if (!host) return;
    Q.quetzalSet(host, bare ? 'bare' : 'full', gsap);
    Q.quetzalSet(host, pose, gsap);
    current = pose;
    startIdle();
    return () => loop?.kill();
  });
  $effect(() => { if (host && pose !== current) setPose(pose, 0.6); });

  export function setPose(p: string, dur = 0.6) {
    if (!host) return;
    const tl = gsap.timeline();
    Q.quetzalPoseTo(tl, host, p, 0, dur);
    current = p;
  }
  export function flap(n = 4, period = 0.42) {
    if (!host) return gsap.timeline();
    const tl = gsap.timeline();
    Q.quetzalFlap(tl, host, 0, n, period, 1);
    return tl;
  }
  export function talk(seconds = 2) {
    if (!host) return gsap.timeline();
    const tl = gsap.timeline();
    Q.quetzalTalk(tl, host, 0, seconds, Math.max(2, Math.round(seconds * 4)));
    return tl;
  }
  export function blink() { if (host) Q.quetzalBlink(gsap.timeline(), host, 0); }
  /** Les plumes reviennent (apres une pluma recuperee). */
  export function regrow() {
    if (!host) return gsap.timeline();
    const tl = gsap.timeline();
    Q.quetzalRegrow(tl, host, 0);
    return tl;
  }
</script>

<div class="qz" bind:this={host} aria-label="El Quetzal" role="img">{@html svg}</div>

<style>
  .qz { display: inline-block; line-height: 0; }
  .qz :global(svg) { display: block; overflow: visible; }
</style>
