<script lang="ts">
  // Carte joueur (bronze / argent / or / legende holographique) avec reflet qui balaie la carte.
  import { gsap, prefersReducedMotion } from '@ce/core';
  import { cardFrame } from './core/ceart.js';
  type Props = { name?: string; number?: number | string; position?: string; rarity?: 'bronze' | 'argent' | 'or' | 'legende'; primary?: string; secondary?: string; initials?: string; player?: Record<string, unknown>; width?: number; shine?: boolean };
  let { name = 'Joueur', number = 10, position = 'ATT', rarity = 'bronze', primary = '#E8212F', secondary = '#FFFFFF', initials, player, width = 240, shine = true }: Props = $props();
  let host: HTMLDivElement | undefined = $state();
  const html = $derived(cardFrame({ name, number, position, rarity, primary, secondary, initials, player }));
  $effect(() => {
    void html;
    const el = host?.querySelector('.card-shine');
    if (!el || !shine || prefersReducedMotion()) return;
    const t = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });
    t.fromTo(el, { x: 0, opacity: 0 }, { x: 1100, opacity: 1, duration: 1.1, ease: 'power2.inOut' }).to(el, { opacity: 0, duration: 0.15 }, '-=0.15');
    return () => { t.kill(); };
  });
</script>

<div bind:this={host} class="box" style:width="{width}px">{@html html}</div>

<style>
  .box { display: inline-block; line-height: 0; }
  .box :global(svg) { width: 100%; height: auto; }
</style>
