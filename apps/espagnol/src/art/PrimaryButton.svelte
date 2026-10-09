<script lang="ts">
  /** Bouton principal 3D (>= 72 px de haut). Enfoncement GSAP < 50 ms, son + vibration via @ce/core. */
  import type { Snippet } from 'svelte';
  import { gsap, haptic, playSfx } from '@ce/core';

  interface Props {
    variant?: 'sol' | 'turquesa' | 'magenta' | 'quetzal';
    size?: 'md' | 'lg';
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }
  let { variant = 'sol', size = 'md', disabled = false, onclick, children }: Props = $props();
  let face: HTMLElement | undefined = $state();

  function down() {
    if (disabled || !face) return;
    gsap.to(face, { y: 7, duration: 0.05, ease: 'power2.out', overwrite: true });
    haptic('tap');
    try { playSfx('tap'); } catch { /* audio non configure */ }
  }
  function up() {
    if (!face) return;
    gsap.to(face, { y: 0, duration: 0.32, ease: 'elastic.out(1.1,0.45)', overwrite: true });
  }
</script>

<button class="btn {variant} {size}" {disabled} {onclick} onpointerdown={down} onpointerup={up} onpointerleave={up} onpointercancel={up}>
  <span class="face" bind:this={face}>
    <span class="gloss"></span>
    <span class="label">{@render children?.()}</span>
  </span>
</button>

<style>
  .btn {
    --top: #ffd45a; --mid: #ffb21e; --low: #d9820b; --edge: #8a4a05; --ink: #3a1d02;
    position: relative; border: 0; padding: 0; margin: 0; background: none; cursor: pointer;
    min-height: 72px; min-width: 160px; border-radius: 22px; background: var(--edge);
    box-shadow: 0 9px 0 var(--edge), 0 16px 24px rgba(5, 6, 30, 0.4);
    touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none;
    margin-bottom: 9px;
  }
  .btn.lg { min-height: 92px; min-width: 240px; border-radius: 28px; }
  .turquesa { --top: #5eead8; --mid: #19b7aa; --low: #0e7f82; --edge: #07474f; --ink: #04262b; }
  .magenta { --top: #ff7aa8; --mid: #d93472; --low: #a31f56; --edge: #5e0f33; --ink: #fff; }
  .quetzal { --top: #5df0b0; --mid: #0e9f6e; --low: #066a4a; --edge: #033a29; --ink: #fff; }
  .face {
    position: relative; display: flex; align-items: center; justify-content: center;
    min-height: inherit; padding: 0 34px; border-radius: inherit; overflow: hidden;
    background: linear-gradient(180deg, var(--top), var(--mid) 55%, var(--low));
    box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.35), inset 0 -6px 0 rgba(0, 0, 0, 0.12);
    transform: translateY(0); will-change: transform;
  }
  .gloss { position: absolute; left: 10px; right: 10px; top: 6px; height: 34%; border-radius: 16px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0)); }
  .label { position: relative; font-family: var(--q-font-title); font-size: 30px; color: var(--ink); letter-spacing: 0.02em; text-shadow: 0 2px 0 rgba(255, 255, 255, 0.25); }
  .lg .label { font-size: 38px; }
  .btn:disabled { filter: grayscale(0.9) brightness(0.8); cursor: default; }
  .btn:focus-visible { outline: 4px solid #fff; outline-offset: 4px; }
</style>
