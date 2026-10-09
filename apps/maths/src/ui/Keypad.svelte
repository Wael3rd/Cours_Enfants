<script lang="ts">
  /** Pave numerique geant (touches >= 88 px). Chaque touche reagit au pointerdown : enfoncement + son + vibration. */
  import { sfx, haptic } from '../lib/sound.ts';
  let { ondigit, onback, disabled = false }: { ondigit: (d: string) => void; onback: () => void; disabled?: boolean } = $props();
  let down = $state<string | null>(null);

  function press(k: string, e: PointerEvent) {
    if (disabled) return;
    e.preventDefault();
    down = k;
    haptic('tap');
    sfx('tap', 0.7);
    if (k === 'back') onback(); else ondigit(k);
  }
  const rows = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']];
</script>

<div class="pad" role="group" aria-label="Pavé numérique">
  {#each rows as r}
    {#each r as k}
      <button type="button" class="key" class:on={down === k} {disabled} onpointerdown={(e) => press(k, e)} onpointerup={() => (down = null)} onpointerleave={() => (down = null)} onpointercancel={() => (down = null)}>
        <span>{k}</span>
      </button>
    {/each}
  {/each}
  <button type="button" class="key zero" class:on={down === '0'} {disabled} onpointerdown={(e) => press('0', e)} onpointerup={() => (down = null)} onpointerleave={() => (down = null)} onpointercancel={() => (down = null)}><span>0</span></button>
  <button type="button" class="key back" class:on={down === 'back'} {disabled} aria-label="Effacer" onpointerdown={(e) => press('back', e)} onpointerup={() => (down = null)} onpointerleave={() => (down = null)} onpointercancel={() => (down = null)}>
    <svg viewBox="0 0 48 32" width="44" height="30" aria-hidden="true"><path d="M16 2 H42 a4 4 0 0 1 4 4 V26 a4 4 0 0 1 -4 4 H16 L3 16Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M26 11 l10 10 M36 11 l-10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
  </button>
</div>

<style>
  .pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: min(100%, 372px); }
  .key {
    --edge: #0D164F; position: relative; min-height: clamp(88px, 11vh, 112px); border: 0; border-radius: 20px; padding: 0;
    background: linear-gradient(#3A52D8, #2B3FAE); color: #fff; font-family: var(--f-display); font-size: 3.4rem; cursor: pointer;
    box-shadow: 0 8px 0 var(--edge), 0 14px 18px rgba(0, 0, 0, 0.4), inset 0 3px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(0); will-change: transform; transition: transform 140ms var(--ease-pop), box-shadow 140ms;
    touch-action: manipulation; -webkit-tap-highlight-color: transparent;
  }
  .key span { display: block; transform: translateY(-2px); }
  .zero { grid-column: span 2; }
  .back { background: linear-gradient(#FF7A8E, var(--corail)); --edge: #A82341; display: flex; align-items: center; justify-content: center; }
  .on, .key:active:not(:disabled) { transform: translateY(6px); box-shadow: 0 2px 0 var(--edge), 0 4px 8px rgba(0, 0, 0, 0.35), inset 0 3px 0 rgba(255, 255, 255, 0.25); transition: none; }
  .key:disabled { opacity: 1; cursor: default; }
</style>
