<script lang="ts">
  /**
   * Champ de saisie + rangee de touches d'accents (á é í ó ú ü ñ ¿ ¡), majuscule, effacer.
   * Les touches inserent au curseur (logique pure : services/accents.ts). `value` est liable.
   */
  import { tick } from 'svelte';
  import { haptic } from '@ce/core';
  import { applyKey, layout, neededKeys, type Key } from '../services/accents';
  import { sfx } from '../services/sfx';
  import { gsap, prefersReducedMotion } from '@ce/core';

  interface Props {
    value: string;
    placeholder?: string;
    /** reponse attendue : met en avant les touches utiles */
    expected?: string;
    label?: string;
    autofocus?: boolean;
    disabled?: boolean;
    big?: boolean;
    maxlength?: number;
    onenter?: () => void;
    /** majuscule automatique en debut (prenoms) */
    capitalize?: boolean;
  }
  let { value = $bindable(''), placeholder = '', expected = '', label = 'Escribe aquí', autofocus = false, disabled = false, big = false, maxlength = 80, onenter, capitalize = false }: Props = $props();

  let input: HTMLInputElement | undefined = $state();
  let shift = $state(false);
  const keys = $derived(layout(shift));
  const need = $derived(neededKeys(expected));

  async function press(k: Key) {
    if (disabled || !input) return;
    haptic('tap');
    sfx('tick', 0.5);
    const st = applyKey({ value, start: input.selectionStart ?? value.length, end: input.selectionEnd ?? value.length, shift }, k);
    value = st.value;
    shift = st.shift;
    await tick();
    input.focus({ preventScroll: true });
    input.setSelectionRange(st.start, st.end);
  }
  // evite de faire perdre le focus (donc fermer le clavier natif) au toucher d'une touche
  const keep = (e: Event) => e.preventDefault();

  $effect(() => {
    if (autofocus && input) input.focus({ preventScroll: true });
  });
  export function shake() {
    if (input && !prefersReducedMotion()) gsap.fromTo(input, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
  }
</script>

<div class="ab">
  <input
    bind:this={input}
    bind:value
    class:big
    {placeholder}
    {disabled}
    {maxlength}
    aria-label={label}
    autocomplete="off"
    autocapitalize={capitalize ? 'words' : 'off'}
    autocorrect="off"
    spellcheck="false"
    enterkeyhint="done"
    onkeydown={(e) => e.key === 'Enter' && onenter?.()}
  />
  <div class="row" role="group" aria-label="Teclas con acento">
    {#each keys as k}
      <button type="button" class="key" class:need={need.includes(k.toLowerCase())} {disabled} onpointerdown={keep} onclick={() => press({ kind: 'char', ch: k })}>{k}</button>
    {/each}
    <button type="button" class="key fn" class:on={shift} aria-label="Mayúscula" {disabled} onpointerdown={keep} onclick={() => press({ kind: 'shift' })}>⇧</button>
    <button type="button" class="key fn" aria-label="Borrar" {disabled} onpointerdown={keep} onclick={() => press({ kind: 'backspace' })}>⌫</button>
  </div>
</div>

<style>
  .ab { display: grid; gap: 14px; width: 100%; }
  input { width: 100%; height: 76px; padding: 0 24px; border: 0; border-radius: 20px; font: 800 36px/1 var(--q-font-body); color: var(--q-nuit); background: var(--q-papel); box-shadow: inset 0 5px 0 rgba(158, 110, 41, 0.35), 0 0 0 5px var(--q-sol), 0 8px 0 5px #6b3d08; user-select: text; -webkit-user-select: text; }
  input.big { height: 92px; font-size: 44px; }
  input::placeholder { color: #b39a6b; font-weight: 700; }
  input:focus { outline: none; box-shadow: inset 0 5px 0 rgba(158, 110, 41, 0.35), 0 0 0 5px #fff, 0 0 0 9px var(--q-sol), 0 8px 0 9px #6b3d08; }
  .row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .key { width: 76px; height: 72px; border: 0; border-radius: 18px; font: 900 36px/1 var(--q-font-body); color: var(--q-nuit); cursor: pointer; background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 6px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); touch-action: manipulation; transition: transform 0.05s, box-shadow 0.05s; }
  .key:active { transform: translateY(5px); box-shadow: 0 1px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); }
  .key.need { background: linear-gradient(180deg, #ffe08a, var(--q-sol)); animation: nudge 1.4s ease-in-out infinite; }
  .key.fn { background: linear-gradient(180deg, #7ff3e4, var(--q-turquesa)); box-shadow: 0 6px 0 #07474f, inset 0 0 0 3px rgba(255, 255, 255, 0.45); font-size: 32px; }
  .key.fn.on { box-shadow: 0 1px 0 #07474f, 0 0 20px var(--q-turquesa); transform: translateY(5px); }
  .key:disabled { opacity: 0.5; }
  @keyframes nudge { 50% { transform: translateY(-5px); } }
</style>
