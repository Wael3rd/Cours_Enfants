<script lang="ts">
  /** Bouton "habillage TV" : parallelogramme 3D. Reaction au pointerdown (enfoncement + son + vibration) : < 50 ms. */
  import type { Snippet } from 'svelte';
  import { sfx, haptic } from '../lib/sound.ts';

  interface Props {
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
    variant?: 'go' | 'pitch' | 'night' | 'coral' | 'cyan' | 'ghost';
    size?: 'md' | 'lg' | 'xl' | 'icon';
    disabled?: boolean;
    label?: string;
    sound?: string;
    class?: string;
    id?: string;
  }
  let { children, onclick, variant = 'go', size = 'md', disabled = false, label, sound = 'tap', class: cls = '', id }: Props = $props();
  let pressed = $state(false);
  function down() {
    if (disabled) return;
    pressed = true;
    haptic('tap');
    sfx(sound);
  }
  const up = () => (pressed = false);
</script>

<button
  {id}
  type="button"
  class="gb {variant} {size} {cls}"
  class:pressed
  {disabled}
  aria-label={label}
  onpointerdown={down}
  onpointerup={up}
  onpointerleave={up}
  onpointercancel={up}
  {onclick}
>
  <span class="face"><span class="in">{@render children()}</span></span>
</button>

<style>
  .gb {
    --face: var(--jaune); --edge: #B88A00; --ink: var(--encre); --d: 8px;
    position: relative; border: 0; padding: 0 0 var(--d); background: none; color: var(--ink); cursor: pointer;
    font-family: var(--f-display); letter-spacing: 0.04em; -webkit-tap-highlight-color: transparent;
  }
  .face {
    display: block; background: var(--face); border-radius: 14px; transform: skewX(-8deg) translateY(0);
    box-shadow: 0 var(--d) 0 var(--edge), 0 calc(var(--d) + 8px) 20px rgba(0, 0, 0, 0.42), inset 0 3px 0 rgba(255, 255, 255, 0.45);
    will-change: transform; transition: transform 150ms var(--ease-pop), box-shadow 150ms;
  }
  .in { display: flex; align-items: center; justify-content: center; gap: 12px; transform: skewX(8deg); padding: 0 30px; min-height: 68px; font-size: 1.7rem; white-space: nowrap; }
  .pelouse, .pitch { --face: #1BBF5E; --edge: #0B6B31; --ink: #fff; }
  .night { --face: #2B3FAE; --edge: #131E63; --ink: #fff; }
  .coral { --face: var(--corail); --edge: #B02444; --ink: #fff; }
  .cyan { --face: var(--cyan); --edge: #1688A8; --ink: var(--encre); }
  .ghost { --face: rgba(255, 255, 255, 0.16); --edge: rgba(0, 0, 0, 0.35); --ink: #fff; }
  .lg .in { min-height: 84px; font-size: 2.2rem; padding: 0 44px; }
  .xl { --d: 12px; }
  .xl .in { min-height: 128px; font-size: 4.2rem; padding: 0 70px; gap: 18px; }
  .icon .in { min-width: 72px; min-height: 72px; padding: 0 12px; font-size: 2rem; }
  .pressed .face, .gb:active:not(:disabled) .face {
    transform: skewX(-8deg) translateY(calc(var(--d) - 2px));
    box-shadow: 0 2px 0 var(--edge), 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 3px 0 rgba(255, 255, 255, 0.35);
    transition: none;
  }
  .gb:disabled { opacity: 0.4; cursor: default; }
  .gb:focus-visible { outline: 4px solid #fff; outline-offset: 4px; }
</style>
