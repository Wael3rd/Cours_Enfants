<script lang="ts">
  /** Lecture : un texte court (touchable) + des questions de comprehension, une par une. */
  import { haptic } from '@ce/core';
  import type { ReadAnswerStep } from '../content/schema';
  import { sfx } from '../services/sfx';
  import Consigna from '../ui/Consigna.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import { stableShuffle, type StepProps } from './common';

  let { step, onanswer }: StepProps<ReadAnswerStep> = $props();
  let q = $state(0);
  let picks = $state<number[]>([]);
  let shown = $state<number | null>(null);
  const cur = $derived(step.preguntas[q]);
  const order = $derived(stableShuffle(cur.opciones.map((o, i) => ({ o, i })), step.id + q));

  function pick(i: number) {
    if (shown !== null) return;
    shown = i;
    haptic('tap');
    sfx(cur.opciones[i].correcta ? 'pip' : 'wrong', 0.7);
    picks = [...picks, i];
    setTimeout(() => {
      if (q < step.preguntas.length - 1) {
        q += 1;
        shown = null;
      } else onanswer({ tipo: 'read_answer', choices: picks });
    }, 1000);
  }
</script>

<div class="ra">
  <Consigna c={step.consigna} />
  <div class="cols">
    <div class="text">
      <div class="scroll"><p><SpeakText text={step.texto.es} audio={step.texto.audio} /></p></div>
    </div>
    <div class="qa">
      <p class="count">{q + 1} / {step.preguntas.length}</p>
      <h3><SpeakText text={cur.pregunta.es} audio={cur.pregunta.audio} /></h3>
      <div class="opts">
        {#each order as { o, i }}
          <button type="button" class="opt" class:right={shown !== null && o.correcta} class:wrong={shown === i && !o.correcta} class:dim={shown !== null && shown !== i && !o.correcta} disabled={shown !== null} onclick={() => pick(i)}>{o.texto}</button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .ra { height: 100%; display: flex; flex-direction: column; gap: 12px; padding: 6px 36px 14px; }
  .cols { flex: 1; min-height: 0; display: grid; grid-template-columns: 1.05fr 1fr; gap: 28px; }
  .text { align-self: start; max-height: 100%; display: flex; border-radius: 26px; padding: 8px; background: linear-gradient(180deg, #fbf0d8, var(--q-papel)); box-shadow: 0 0 0 6px var(--q-sol), 0 8px 0 6px #6b3d08; min-height: 0; }
  .text .scroll { flex: 1; padding: 22px 28px; color: var(--q-nuit); }
  .text p { margin: 0; font: 800 34px/1.45 var(--q-font-body); white-space: pre-line; }
  .qa { display: flex; flex-direction: column; justify-content: safe center; gap: 14px; min-height: 0; }
  .count { margin: 0; font: 900 24px var(--q-font-body); color: var(--q-turquesa); }
  h3 { margin: 0; font: 900 36px/1.2 var(--q-font-body); color: var(--q-papel); }
  .opts { display: grid; gap: 12px; }
  .opt { min-height: 78px; padding: 8px 24px; border: 0; border-radius: 20px; text-align: left; cursor: pointer; font: 900 32px/1.15 var(--q-font-body); color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 7px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); touch-action: manipulation; transition: transform 0.08s, box-shadow 0.08s; }
  .opt:active:not(:disabled) { transform: translateY(5px); box-shadow: 0 2px 0 #7d5a1c; }
  .opt.right { background: linear-gradient(180deg, #7ff0bc, #1fb97a); box-shadow: 0 7px 0 #066a4a, 0 0 0 5px #42e0a0; }
  .opt.wrong { background: linear-gradient(180deg, #ffa3b0, #e8434f); box-shadow: 0 7px 0 #7a1f2f; }
  .opt.dim { opacity: 0.5; }
</style>
