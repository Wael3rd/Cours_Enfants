<script lang="ts">
  /** Ecriture libre : la fiche du viajero (plantilla a trous) ; le prenom du joueur est pre-rempli. Clavier d'accents. */
  import { game } from '../state/game.svelte';
  import { playerName } from '../engine/progress';
  import type { WriteFreeStep } from '../content/schema';
  import Consigna from '../ui/Consigna.svelte';
  import AccentBar from '../ui/AccentBar.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import type { StepProps } from './common';

  let { step, result, onanswer }: StepProps<WriteFreeStep> = $props();
  const parts = $derived(step.plantilla.split('___'));
  const init = () =>
    step.campos.map((c) => {
      const saved = game.state.profile.ficha[c.id];
      if (saved) return saved;
      if (/^(nombre|name|prenom|nom)/i.test(c.id) && c.tipo === 'texto') return game.state.profile.name || '';
      return '';
    });
  let values = $state<string[]>(init());
  let active = $state(0);
  let bar: AccentBar | undefined = $state();
  const complete = $derived(values.every((v) => v.trim()));

  function enter() {
    if (active < values.length - 1) active += 1;
    else submit();
  }
  function submit() {
    if (result) return;
    if (!complete) {
      bar?.shake();
      const k = values.findIndex((v) => !v.trim());
      if (k >= 0) active = k;
      return;
    }
    const fields: Record<string, string> = {};
    step.campos.forEach((c, i) => (fields[c.id] = values[i].trim()));
    onanswer({ tipo: 'write_free', fields });
  }
</script>

<div class="wf">
  <Consigna c={step.consigna} />
  <div class="body">
    <p class="tpl">
      {#each parts as p, i}
        <span class="t">{p}</span>{#if i < step.campos.length}<button type="button" class="slot" class:on={active === i} class:empty={!values[i].trim()} disabled={!!result} onclick={() => (active = i)}>{values[i] || ' '}</button>{/if}
      {/each}
    </p>
    {#if !result}
      <div class="in">
        {#key active}
          <AccentBar bind:this={bar} bind:value={values[active]} autofocus capitalize={step.campos[active].tipo === 'texto'} placeholder="Escribe aquí…" label={`Campo ${active + 1}`} onenter={enter} />
        {/key}
      </div>
      <PrimaryButton variant="turquesa" onclick={enter} disabled={!values[active].trim()}>{active < values.length - 1 ? 'Siguiente' : '¡Listo!'}</PrimaryButton>
    {/if}
    <div class="model"><span>Ejemplo</span><SpeakText text={step.modelo.es} audio={step.modelo.audio} /></div>
  </div>
</div>

<style>
  .wf { height: 100%; display: flex; flex-direction: column; gap: 12px; padding: 6px 40px 12px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 14px; }
  .tpl { margin: 0; text-align: center; max-width: 1100px; font: 900 clamp(36px, 4.2vw, 50px)/1.6 var(--q-font-body); color: var(--q-papel); }
  .slot { display: inline-block; min-width: 130px; margin: 0 6px; padding: 0 16px 2px; border: 0; border-radius: 14px; cursor: pointer; font: inherit; color: var(--q-nuit); background: var(--q-papel); box-shadow: inset 0 -5px 0 var(--q-sol); touch-action: manipulation; }
  .slot.empty { background: rgba(255, 255, 255, 0.14); color: transparent; }
  .slot.on { box-shadow: inset 0 -5px 0 var(--q-turquesa), 0 0 0 4px var(--q-turquesa); }
  .in { width: 100%; max-width: 960px; }
  .model { display: flex; align-items: center; gap: 14px; padding: 8px 24px; border-radius: 18px; background: rgba(11, 13, 42, 0.55); font: 700 24px/1.3 var(--q-font-body); color: var(--q-papel2); max-width: 1000px; }
  .model span { flex: none; padding: 2px 14px 4px; border-radius: 999px; background: var(--q-turquesa); color: var(--q-nuit); font: 900 20px var(--q-font-body); }
</style>
