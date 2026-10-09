<script lang="ts">
  /** La Sombra del Silencio : silhouette de fumee, yeux qui brillent. `float` : flottement en boucle. Methodes : dissolve(), narrow(). */
  import { onMount } from 'svelte';
  import { gsap, prefersReducedMotion } from '@ce/core';
  import * as Q from './core/qart.js';

  interface Props { width?: number; arm?: boolean; float?: boolean; view?: string; }
  let { width = 320, arm = false, float = true, view }: Props = $props();
  let host: HTMLElement | undefined = $state();
  let loop: gsap.core.Timeline | undefined;
  const svg = $derived(Q.sombra({ width, height: view ? width : Math.round(width * 1.2), arm, view }));

  onMount(() => {
    if (!host || !float || prefersReducedMotion()) return;
    loop = gsap.timeline({ repeat: -1 });
    Q.sombraFloat(loop, host, 0, 1, 3.4);
    return () => loop?.kill();
  });
  export function dissolve(seconds = 1.6) { const tl = gsap.timeline(); if (host) Q.sombraDissolve(tl, host, 0, seconds); return tl; }
  export function narrow() { const tl = gsap.timeline(); if (host) Q.sombraEyes(tl, host, 0, 'narrow'); return tl; }
</script>

<div class="sb" bind:this={host} role="img" aria-label="La Sombra del Silencio">{@html svg}</div>

<style>
  .sb { display: inline-block; line-height: 0; }
  .sb :global(svg) { display: block; overflow: visible; }
</style>
