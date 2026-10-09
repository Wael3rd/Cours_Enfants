<script lang="ts">
  // Fond de stade calme et leger (politique "mouvement sur", docs/architecture.md) : deux images rasterisees
  // (`npm run art:raster`) — tribunes/ciel/pelouse fixes + projecteurs qui "respirent" lentement (opacite seule, couche
  // composee par le GPU : aucun repeint). Plus de flashs de foule en boucle. Immobile en "Animations douces".
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import { STADIUM_IMG } from './core/ceart.js';
  import { softMotion } from '../lib/motion.ts';
  let { live = true }: { live?: boolean } = $props();
  let lights: HTMLImageElement | undefined = $state();
  const dir = `${import.meta.env.BASE_URL}cinematics/_shared/img/`;
  onMount(() => {
    if (!lights || !live || softMotion()) return;
    const t = gsap.to(lights, { opacity: 0.8, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return () => t.kill();
  });
</script>

<div class="host" aria-hidden="true">
  <img class="layer" src={dir + STADIUM_IMG.base} alt="" draggable="false" decoding="async" />
  <img bind:this={lights} class="layer lights" src={dir + STADIUM_IMG.lights} alt="" draggable="false" decoding="async" />
</div>

<style>
  .host { position: absolute; inset: 0; overflow: hidden; background: #070c2b; }
  .layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; user-select: none; }
  .lights { will-change: opacity; }
</style>
