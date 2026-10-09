<script lang="ts">
  // Fond de stade en couches : projecteurs qui respirent + flashs d'appareils photo dans la foule.
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import { stadium } from './core/ceart.js';
  let { live = true }: { live?: boolean } = $props();
  let host: HTMLDivElement | undefined = $state();
  const html = stadium({});
  onMount(() => {
    if (!host || !live || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.to('.st-beam', { opacity: 0.7, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.5 });
      gsap.utils.toArray<SVGGElement>('.st-flash').forEach((f, i) => {
        gsap.timeline({ repeat: -1, repeatDelay: 1.5 + (i % 7) * 0.9, delay: (i * 0.37) % 4 })
          .to(f, { opacity: 1, scale: 1.15, duration: 0.05 }).to(f, { opacity: 0, duration: 0.2 });
      });
    }, host);
    return () => ctx.revert();
  });
</script>

<div bind:this={host} class="host">{@html html}</div>

<style>
  .host { position: absolute; inset: 0; }
  .host :global(.ce-stadium) { position: absolute; inset: 0; }
</style>
