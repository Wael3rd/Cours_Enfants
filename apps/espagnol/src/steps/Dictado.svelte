<script lang="ts">
  /** Dictee : on ecoute (normal / lent) puis on ecrit avec le clavier d'accents. */
  import type { DictadoStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import Consigna from '../ui/Consigna.svelte';
  import ListenBtn from '../ui/ListenBtn.svelte';
  import AccentBar from '../ui/AccentBar.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import type { StepProps } from './common';

  let { step, result, onanswer }: StepProps<DictadoStep> = $props();
  let text = $state('');
  let bar: AccentBar | undefined = $state();

  function check() {
    if (result) return;
    if (!text.trim()) return bar?.shake();
    onanswer({ tipo: 'dictado', text });
    setTimeout(() => say(step.habla.audio, step.habla.es), 400);
  }
</script>

<div class="di">
  <Consigna c={step.consigna} />
  <div class="body">
    <ListenBtn audio={step.habla.audio} text={step.habla.es} size={112} />
    <div class="in">
      <AccentBar bind:this={bar} bind:value={text} expected={step.respuesta} disabled={!!result} autofocus placeholder="Escribe lo que oyes…" label="Respuesta" onenter={check} />
    </div>
    {#if result}
      <p class="ans" class:ok={result.outcome !== 'wrong'}><SpeakText text={step.respuesta} audio={step.habla.audio} /></p>
    {:else}
      <PrimaryButton variant="turquesa" onclick={check} disabled={!text.trim()}>Comprobar</PrimaryButton>
    {/if}
  </div>
</div>

<style>
  .di { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 6px 40px 16px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 22px; }
  .in { width: 100%; max-width: 960px; }
  .ans { margin: 0; padding: 10px 30px 12px; border-radius: 20px; font: 900 44px/1.1 var(--q-font-body); color: #fff; background: rgba(232, 67, 79, 0.85); }
  .ans.ok { background: rgba(31, 185, 122, 0.85); }
</style>
