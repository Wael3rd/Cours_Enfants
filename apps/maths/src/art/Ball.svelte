<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap, prefersReducedMotion } from '@ce/core';
  import { ball } from './core/ceart.js';
  let { width = 90, spin = false }: { width?: number; spin?: boolean } = $props();
  let host: HTMLDivElement | undefined = $state();
  const html = ball({});
  onMount(() => {
    const j = host?.querySelector('.ball-spin .j');
    if (!j || !spin || prefersReducedMotion()) return;
    const t = gsap.to(j, { rotation: 360, svgOrigin: '0 0', duration: 2.4, ease: 'none', repeat: -1 });
    return () => { t.kill(); };
  });
</script>

<div bind:this={host} class="box" style:width="{width}px">{@html html}</div>

<style>
  .box { display: inline-block; line-height: 0; }
  .box :global(svg) { width: 100%; height: auto; }
</style>
