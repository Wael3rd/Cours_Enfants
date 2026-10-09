<script lang="ts">
  import type { Snippet } from 'svelte';
  import { haptic } from '../haptics';
  import { playSfx } from '../audio';

  interface Props {
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'md' | 'lg' | 'xl';
    disabled?: boolean;
    /** Cle SFX jouee a l'appui (ex. 'tap'). Silencieux si non configuree. */
    sfx?: string;
    label?: string;
    class?: string;
  }
  let { children, onclick, variant = 'primary', size = 'md', disabled = false, sfx = 'tap', label, class: cls = '' }: Props = $props();

  let pressed = $state(false);

  // Feedback sur pointerdown (synchrone, < 50 ms) : enfoncement CSS + son + vibration.
  function down() {
    if (disabled) return;
    pressed = true;
    haptic('tap');
    playSfx(sfx);
  }
  const up = () => (pressed = false);
</script>

<button
  type="button"
  class="ce-btn {variant} {size} {cls}"
  class:pressed
  {disabled}
  aria-label={label}
  onpointerdown={down}
  onpointerup={up}
  onpointerleave={up}
  onpointercancel={up}
  {onclick}
>
  {@render children()}
</button>

<style>
  .ce-btn {
    --face: #ffd400;
    --edge: #b38f00;
    --ink: #0b1b3a;
    --depth: 8px;
    min-height: 64px;
    min-width: 64px;
    padding: 0 28px;
    border: 0;
    border-radius: 18px;
    background: var(--face);
    color: var(--ink);
    font: inherit;
    font-weight: 800;
    font-size: 1.35rem;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 var(--depth) 0 var(--edge), 0 calc(var(--depth) + 8px) 18px rgba(0, 0, 0, 0.35);
    transform: translateY(0);
    transition: none; /* pas de delai au toucher */
    will-change: transform;
  }
  .secondary { --face: #e8eefc; --edge: #9aa8c9; }
  .danger { --face: #ff5a5f; --edge: #b22b30; --ink: #fff; }
  .md { min-height: 64px; }
  .lg { min-height: 80px; font-size: 1.6rem; padding: 0 40px; }
  .xl { min-height: 96px; min-width: 96px; font-size: 2.2rem; border-radius: 22px; }
  .pressed, .ce-btn:active:not(:disabled) {
    transform: translateY(calc(var(--depth) - 2px));
    box-shadow: 0 2px 0 var(--edge), 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  .ce-btn:not(.pressed) { transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 140ms; }
  .ce-btn:disabled { opacity: 0.45; cursor: default; }
  .ce-btn:focus-visible { outline: 4px solid #fff; outline-offset: 3px; }
</style>
