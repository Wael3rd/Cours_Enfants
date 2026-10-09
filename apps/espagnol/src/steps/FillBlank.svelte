<script lang="ts">
  /** Texte a trou : choix de chips ou saisie libre (clavier d'accents). */
  import { haptic, shake } from '@ce/core';
  import type { FillBlankStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import Consigna from '../ui/Consigna.svelte';
  import AccentBar from '../ui/AccentBar.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import { stableShuffle, type StepProps } from './common';

  let { step, result, onanswer }: StepProps<FillBlankStep> = $props();
  const [before, after] = $derived((() => {
    const i = step.frase.indexOf('___');
    return i < 0 ? [step.frase, ''] : [step.frase.slice(0, i), step.frase.slice(i + 3)];
  })());
  const options = $derived(step.opciones ? stableShuffle(step.opciones, step.id) : null);
  let text = $state('');
  let picked = $state('');
  let bar: AccentBar | undefined = $state();
  const shown = $derived(result ? (result.outcome === 'wrong' ? text || picked : step.respuesta) : options ? picked : text);

  function choose(o: string, el: HTMLElement) {
    if (result) return;
    picked = o;
    haptic('tap');
    onanswer({ tipo: 'fill_blank', text: o });
    if (o.toLowerCase() !== step.respuesta.toLowerCase()) shake(el, 12);
    setTimeout(() => say(step.habla.audio, step.habla.es), 450);
  }
  function check() {
    if (result) return;
    if (!text.trim()) return bar?.shake();
    onanswer({ tipo: 'fill_blank', text });
    setTimeout(() => say(step.habla.audio, step.habla.es), 450);
  }
</script>

<div class="fb">
  <Consigna c={step.consigna} />
  <div class="body">
    <p class="sentence">
      <span class="w">{before}</span><span class="gap" class:filled={!!shown} class:ok={result && result.outcome !== 'wrong'} class:bad={result && result.outcome === 'wrong'}>{shown || ' '}</span><span class="w">{after}</span>
    </p>
    {#if result}
      <p class="full"><SpeakText text={step.habla.es} audio={step.habla.audio} /></p>
    {/if}
    {#if options}
      <div class="chips">
        {#each options as o}
          <button type="button" class="chip" class:sel={picked === o} class:right={result && o.toLowerCase() === step.respuesta.toLowerCase()} class:wrong={result && picked === o && o.toLowerCase() !== step.respuesta.toLowerCase()} disabled={!!result} onclick={(e) => choose(o, e.currentTarget as HTMLElement)}>{o}</button>
        {/each}
      </div>
    {:else}
      <div class="in"><AccentBar bind:this={bar} bind:value={text} expected={step.respuesta} disabled={!!result} autofocus placeholder="Escribe la palabra…" label="Respuesta" onenter={check} /></div>
      {#if !result}<PrimaryButton variant="turquesa" onclick={check} disabled={!text.trim()}>Comprobar</PrimaryButton>{/if}
    {/if}
  </div>
</div>

<style>
  .fb { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 6px 40px 16px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 26px; }
  .sentence { margin: 0; text-align: center; font: 900 clamp(44px, 5.2vw, 64px)/1.3 var(--q-font-body); color: var(--q-papel); }
  .gap { display: inline-block; min-width: 190px; margin: 0 8px; padding: 0 16px 2px; border-radius: 16px; vertical-align: baseline; color: var(--q-nuit); background: rgba(255, 255, 255, 0.12); box-shadow: inset 0 -6px 0 var(--q-sol); }
  .gap.filled { background: var(--q-papel); }
  .gap.ok { background: #7ff0bc; box-shadow: inset 0 -6px 0 #1fb97a; }
  .gap.bad { background: #ffa3b0; box-shadow: inset 0 -6px 0 #e8434f; text-decoration: line-through; }
  .full { margin: 0; font: 800 30px/1.3 var(--q-font-body); color: var(--q-papel2); }
  .chips { display: flex; flex-wrap: wrap; gap: 18px; justify-content: center; max-width: 960px; }
  .chip { min-width: 150px; min-height: 84px; padding: 0 30px; border: 0; border-radius: 22px; cursor: pointer; font: 900 40px/1 var(--q-font-body); color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 8px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); touch-action: manipulation; transition: transform 0.08s, box-shadow 0.08s; }
  .chip:active:not(:disabled) { transform: translateY(6px); box-shadow: 0 2px 0 #7d5a1c; }
  .chip.sel { opacity: 0.75; }
  .chip.right { background: linear-gradient(180deg, #7ff0bc, #1fb97a); box-shadow: 0 8px 0 #066a4a, 0 0 0 5px #42e0a0; opacity: 1; }
  .chip.wrong { background: linear-gradient(180deg, #ffa3b0, #e8434f); box-shadow: 0 8px 0 #7a1f2f; opacity: 1; }
  .in { width: 100%; max-width: 960px; }
</style>
