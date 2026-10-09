<script lang="ts">
  /** Bouton rond RPG (>= 72 px) avec icone : retour, audio, tortue, pista, reglages... */
  import type { Snippet } from 'svelte';
  import { haptic } from '@ce/core';
  import { sfx } from '../services/sfx';
  import Icon from './Icon.svelte';

  interface Props {
    icon?: string;
    label: string;
    variant?: 'sol' | 'turquesa' | 'magenta' | 'papel' | 'nuit';
    size?: number;
    active?: boolean;
    disabled?: boolean;
    badge?: string | number;
    quiet?: boolean;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }
  let { icon, label, variant = 'sol', size = 72, active = false, disabled = false, badge, quiet = false, onclick, children }: Props = $props();

  function down() {
    if (disabled) return;
    haptic('tap');
    if (!quiet) sfx('tap', 0.6);
  }
</script>

<button type="button" class="rb {variant}" class:active {disabled} style:width="{size}px" style:height="{size}px" aria-label={label} aria-pressed={active ? 'true' : undefined} onpointerdown={down} {onclick}>
  {#if children}{@render children()}{:else if icon}<Icon name={icon as never} size={Math.round(size * 0.55)} />{/if}
  {#if badge !== undefined && badge !== ''}<i class="badge">{badge}</i>{/if}
</button>

<style>
  .rb { --a: #ffe08a; --b: var(--q-sol); --e: #6b3d08; --ink: var(--q-nuit); position: relative; flex: none; border: 0; padding: 0; border-radius: 50%; display: grid; place-items: center; color: var(--ink); cursor: pointer; background: linear-gradient(180deg, var(--a), var(--b)); box-shadow: 0 6px 0 var(--e), inset 0 0 0 3px rgba(255, 255, 255, 0.45), 0 12px 18px rgba(5, 6, 30, 0.35); touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: transform 0.06s, box-shadow 0.06s; }
  .turquesa { --a: #7ff3e4; --b: var(--q-turquesa); --e: #07474f; }
  .magenta { --a: #ff7aa8; --b: var(--q-magenta); --e: #5e0f33; --ink: #fff; }
  .papel { --a: #fff3d1; --b: var(--q-papel2); --e: #7d5a1c; }
  .nuit { --a: #3a41a8; --b: var(--q-nuit2); --e: #07082a; --ink: var(--q-papel); }
  .rb:active:not(:disabled) { transform: translateY(5px); box-shadow: 0 1px 0 var(--e), inset 0 0 0 3px rgba(255, 255, 255, 0.45); }
  .rb.active { box-shadow: 0 2px 0 var(--e), inset 0 0 0 4px #fff, 0 0 26px var(--b); transform: translateY(3px); }
  .rb:disabled { filter: grayscale(0.9) brightness(0.8); cursor: default; }
  .rb:focus-visible { outline: 4px solid #fff; outline-offset: 3px; }
  .badge { position: absolute; top: -6px; right: -6px; min-width: 30px; height: 30px; padding: 0 7px; border-radius: 999px; display: grid; place-items: center; font: 900 18px/1 var(--q-font-body); font-style: normal; color: #fff; background: var(--q-magenta); box-shadow: 0 3px 0 #5e0f33, 0 0 0 3px var(--q-nuit); }
</style>
