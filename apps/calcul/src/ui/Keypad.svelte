<script lang="ts">
  /** Pave numerique geant (touches >= 88 px). Reaction au pointerdown : couleur + son + vibration, sans animation. */
  import { sfx, haptic } from '../lib/sound.ts';
  let { ondigit, onback, disabled = false }: { ondigit: (d: string) => void; onback: () => void; disabled?: boolean } = $props();

  function press(k: string, e: PointerEvent) {
    if (disabled) return;
    e.preventDefault();
    haptic('tap');
    sfx('tap', 0.6);
    if (k === 'back') onback(); else ondigit(k);
  }
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];
</script>

<div class="pad" role="group" aria-label="Pavé numérique">
  {#each keys as k}
    <button type="button" class="key" {disabled} onpointerdown={(e) => press(k, e)}>{k}</button>
  {/each}
  <button type="button" class="key zero" {disabled} onpointerdown={(e) => press('0', e)}>0</button>
  <button type="button" class="key back" {disabled} aria-label="Effacer" onpointerdown={(e) => press('back', e)}>
    <svg viewBox="0 0 48 32" width="46" height="31" aria-hidden="true"><path d="M16 2 H42 a4 4 0 0 1 4 4 V26 a4 4 0 0 1 -4 4 H16 L3 16Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M26 11 l10 10 M36 11 l-10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
  </button>
</div>

<style>
  .pad { display: grid; grid-template-columns: repeat(3, minmax(88px, 1fr)); gap: 12px; width: min(100%, 380px); }
  .key {
    min-height: clamp(88px, 11vh, 108px); min-width: 88px; border: 3px solid var(--line); border-radius: 20px; padding: 0;
    background: var(--card); color: var(--ink); font-family: var(--f); font-weight: 600; font-size: 3.2rem; line-height: 1;
    transition: background-color 70ms; touch-action: manipulation;
  }
  .key:active:not(:disabled) { background: var(--accent-soft); border-color: var(--accent); }
  .zero { grid-column: span 2; }
  .back { display: flex; align-items: center; justify-content: center; color: var(--muted); }
  .key:disabled { opacity: 0.55; cursor: default; }
</style>
