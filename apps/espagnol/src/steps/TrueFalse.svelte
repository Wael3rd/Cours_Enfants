<script lang="ts">
  /** Verdadero / Falso : affirmation (touchable), image optionnelle, explication apres reponse. */
  import { haptic, shake } from '@ce/core';
  import type { TrueFalseStep } from '../content/schema';
  import Consigna from '../ui/Consigna.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import Icon from '../ui/Icon.svelte';
  import { say } from '../ui/ui.svelte';
  import { vocabById, type StepProps } from './common';

  let { step, result, onanswer }: StepProps<TrueFalseStep> = $props();
  let chosen = $state<boolean | null>(null);
  const v = $derived(vocabById(step.imagen));

  function pick(val: boolean, el: HTMLElement) {
    if (result) return;
    chosen = val;
    haptic('tap');
    onanswer({ tipo: 'true_false', value: val });
    if (val !== step.correcta) shake(el, 12);
    const ex = step.explicacion;
    if (ex) setTimeout(() => say(ex.audio, ex.es), 600);
  }
</script>

<div class="tf">
  <Consigna c={step.consigna} />
  <div class="body">
    <div class="claim">
      {#if v?.emoji}<Emoji e={v.emoji} size={150} />{/if}
      <p><SpeakText text={step.afirmacion.es} audio={step.afirmacion.audio} /></p>
    </div>
    <div class="btns">
      <button type="button" class="b yes" class:right={result && step.correcta} class:wrong={result && chosen === true && !step.correcta} disabled={!!result} onclick={(e) => pick(true, e.currentTarget as HTMLElement)}>
        <Icon name="check" size={52} /> Verdadero
      </button>
      <button type="button" class="b no" class:right={result && !step.correcta} class:wrong={result && chosen === false && step.correcta} disabled={!!result} onclick={(e) => pick(false, e.currentTarget as HTMLElement)}>
        <Icon name="cross" size={48} /> Falso
      </button>
    </div>
    {#if result && step.explicacion}
      <p class="exp"><SpeakText text={step.explicacion.es} audio={step.explicacion.audio} /></p>
    {/if}
  </div>
</div>

<style>
  .tf { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 6px 40px 16px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 30px; }
  .claim { display: flex; align-items: center; gap: 30px; padding: 24px 44px; border-radius: 28px; max-width: 1000px; background: linear-gradient(180deg, #fbf0d8, var(--q-papel)); color: var(--q-nuit); box-shadow: 0 0 0 6px var(--q-sol), 0 10px 0 6px #6b3d08, 0 22px 30px rgba(0, 0, 0, 0.35); }
  .claim p { margin: 0; font: 900 clamp(38px, 4.6vw, 54px)/1.25 var(--q-font-body); }
  .btns { display: flex; gap: 40px; }
  .b { display: flex; align-items: center; justify-content: safe center; gap: 14px; min-width: 330px; height: 120px; border: 0; border-radius: 30px; cursor: pointer; font: 400 46px/1 var(--q-font-title); color: #fff; touch-action: manipulation; transition: transform 0.08s, box-shadow 0.08s, opacity 0.2s; }
  .yes { background: linear-gradient(180deg, #5df0b0, #0e9f6e); box-shadow: 0 10px 0 #033a29, inset 0 0 0 4px rgba(255, 255, 255, 0.4); }
  .no { background: linear-gradient(180deg, #ff8a99, #d93472); box-shadow: 0 10px 0 #5e0f33, inset 0 0 0 4px rgba(255, 255, 255, 0.4); }
  .b:active:not(:disabled) { transform: translateY(8px); box-shadow: 0 2px 0 rgba(0, 0, 0, 0.5); }
  .b:disabled { opacity: 0.45; cursor: default; }
  .b.right { opacity: 1; box-shadow: 0 10px 0 #033a29, 0 0 0 7px #fff, 0 0 40px rgba(66, 224, 160, 0.9); }
  .b.wrong { opacity: 1; filter: saturate(0.3) brightness(0.7); }
  .exp { margin: 0; max-width: 900px; text-align: center; font: 800 32px/1.35 var(--q-font-body); color: var(--q-papel); }
</style>
