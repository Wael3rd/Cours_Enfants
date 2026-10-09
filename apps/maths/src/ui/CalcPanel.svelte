<script lang="ts">
  /** Calcul ENORME + cases de reponse (une case par chiffre attendu, validation automatique). */
  import { gsap, shake } from '@ce/core';

  let { text, value = '', digits = 1, status = 'idle', size = 'lg' }: {
    text: string; value?: string; digits?: number; status?: 'idle' | 'ok' | 'bad'; size?: 'lg' | 'md';
  } = $props();

  let calc: HTMLDivElement | undefined = $state();
  let slots: HTMLDivElement | undefined = $state();
  const hasBlank = $derived(text.includes('?') || text.includes('='));
  const long = $derived(text.length > 9);

  /** Nouvelle question : le calcul "claque" (cePunch). */
  export function enter(): void {
    if (!calc) return;
    gsap.fromTo(calc, { scale: 0.7, opacity: 0, y: 14 }, { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'cePunch', overwrite: true });
  }
  export function nudge(): void {
    if (slots) shake(slots, 9);
  }
  $effect(() => {
    void text;
    enter();
  });
</script>

<div class="panel" class:md={size === 'md'}>
  <div bind:this={calc} class="calc disp num" class:long aria-live="polite">
    <span>{text}</span>{#if !hasBlank}<span class="eq">=</span><span class="q">?</span>{/if}
  </div>
  <div bind:this={slots} class="slots" aria-label="Réponse">
    {#each Array.from({ length: digits }, (_, i) => i) as i}
      <div class="slot disp num" class:filled={!!value[i]} class:ok={status === 'ok'} class:bad={status === 'bad'} class:cur={i === value.length && status === 'idle'}>
        {value[i] ?? ''}
      </div>
    {/each}
  </div>
</div>

<style>
  .panel { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.4vh, 26px); }
  .calc {
    display: flex; align-items: baseline; gap: 0.22em; font-size: clamp(120px, 24vh, 210px); line-height: 1; color: #fff;
    text-shadow: 0 6px 0 #0A1030, 0 12px 28px rgba(0, 0, 0, 0.5); will-change: transform, opacity; white-space: nowrap;
  }
  .calc.long { font-size: clamp(90px, 17vh, 150px); }
  .md .calc { font-size: clamp(84px, 15vh, 128px); }
  .md .calc.long { font-size: clamp(70px, 12vh, 100px); }
  .md .slot { width: clamp(64px, 9.5vh, 84px); height: clamp(72px, 11vh, 96px); font-size: clamp(48px, 7.5vh, 66px); border-radius: 14px; }
  .eq { color: var(--jaune); }
  .q { color: var(--cyan); }
  .slots { display: flex; gap: 14px; }
  .slot {
    width: clamp(86px, 13vh, 118px); height: clamp(96px, 14.5vh, 132px); border-radius: 18px; display: grid; place-items: center;
    font-size: clamp(64px, 10.5vh, 96px); line-height: 1; color: var(--encre); background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35), inset 0 -6px 0 rgba(10, 16, 48, 0.12); transition: background 120ms, transform 120ms var(--ease-pop);
  }
  .slot:not(.filled) { background: rgba(255, 255, 255, 0.22); color: transparent; box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.35); border: 4px dashed rgba(255, 255, 255, 0.55); }
  .slot { position: relative; }
  .slot.cur::after { content: ''; position: absolute; inset: -6px; border: 5px solid var(--jaune); border-radius: 22px; animation: caret 0.9s ease-in-out infinite; }
  .slot.filled { transform: scale(1.04); }
  .slot.ok { background: #5CF08C; }
  .slot.bad { background: #FFB4C0; }
  @keyframes caret { 50% { opacity: 0.2; } }
  @media (prefers-reduced-motion: reduce) { .slot.cur::after { animation: none; } }
</style>
