<script lang="ts">
  /** Conteneur d'ecran : entree douce (fondu + leger zoom, 400 ms, transform/opacity). */
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  let { children, bg = '' }: { children: Snippet; bg?: string } = $props();
  let el: HTMLDivElement | undefined = $state();
  onMount(() => {
    if (el) gsap.fromTo(el, { opacity: 0, scale: 1.025 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', clearProps: 'transform' });
  });
</script>

<div bind:this={el} class="screen" style:background={bg || undefined}>{@render children()}</div>
