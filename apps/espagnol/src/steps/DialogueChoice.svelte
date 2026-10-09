<script lang="ts">
  /** Conversation a choix : le PNJ parle (DialogBox + portrait), on choisit sa replique, le PNJ reagit (audio + visage). */
  import { onMount } from 'svelte';
  import { haptic, shake } from '@ce/core';
  import type { DialogueChoiceStep } from '../content/schema';
  import { game } from '../state/game.svelte';
  import { say } from '../ui/ui.svelte';
  import { accentOf, character, portraitOf } from '../ui/avatar';
  import { emojiUrl } from '../ui/emoji';
  import { bustOf } from '../ui/bust';
  import DialogBox from '../art/DialogBox.svelte';
  import Consigna from '../ui/Consigna.svelte';
  import { stableShuffle, type StepProps } from './common';

  let { step, result, onanswer, onhint }: StepProps<DialogueChoiceStep> = $props();
  const npc = $derived(character(step.pnj));
  const order = $derived(stableShuffle(step.opciones.map((o, i) => ({ o, i })), step.id));
  let chosen = $state<number | null>(null);
  const reaction = $derived(chosen !== null ? step.opciones[chosen].reaccion : null);

  onMount(() => {
    const t = setTimeout(() => say(step.replica.audio, step.replica.es), 500);
    return () => clearTimeout(t);
  });

  function pick(i: number, el: HTMLElement) {
    if (result) return;
    chosen = i;
    haptic('tap');
    // la correction utilise l'index DANS step.opciones
    onanswer({ tipo: 'dialogue_choice', choice: i });
    if (!step.opciones[i].correcta) shake(el, 12);
    const r = step.opciones[i].reaccion;
    setTimeout(() => say(r.audio, r.es), 450);
  }
</script>

<div class="dc">
  <Consigna c={step.consigna} />
  <div class="dlg">
    {#key reaction?.audio ?? 'q'}
      <DialogBox
        name={npc?.nombre ?? step.pnj}
        portrait={bustOf(step.pnj) ? undefined : reaction ? emojiUrl(reaction.emoji) : portraitOf(step.pnj)}
        portraitSvg={bustOf(step.pnj)}
        accent={accentOf(step.pnj)}
        text={reaction ? reaction.es : step.replica.es}
        onaudio={() => (reaction ? say(reaction.audio, reaction.es) : say(step.replica.audio, step.replica.es))}
        onslow={() => (reaction ? say(reaction.audio, reaction.es, { lento: true }) : say(step.replica.audio, step.replica.es, { lento: true }))}
        onhint={() => onhint?.()}
      />
    {/key}
  </div>
  <div class="opts" class:two={order.length > 3}>
    {#each order as { o, i }}
      <div class="row">
        <button type="button" class="say" aria-label="Escuchar" onclick={() => say(o.habla.audio, o.habla.es)}>
          <svg viewBox="0 0 48 48" width="34" height="34" fill="currentColor"><path d="M8 18h8l11-9v30l-11-9H8Z" /><path d="M33 16q8 8 0 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" /></svg>
        </button>
        <button
          type="button"
          class="opt"
          class:right={result && o.correcta}
          class:wrong={result && chosen === i && !o.correcta}
          class:dim={result && chosen !== i && !o.correcta}
          disabled={!!result}
          onclick={(e) => pick(i, e.currentTarget as HTMLElement)}
        >{o.habla.es}</button>
      </div>
    {/each}
  </div>
</div>

<style>
  .dc { min-height: 100%; display: flex; flex-direction: column; gap: 8px; padding: 4px 30px 12px; }
  .dlg { flex: none; }
  .dlg :global(.dlg) { padding-top: 56px; }
  .dlg :global(.txt) { min-height: 108px; }
  .dlg :global(p) { font-size: 31px; }
  .opts { flex: none; display: grid; gap: 12px; align-content: start; padding-top: 6px; max-width: 1040px; width: 100%; margin: 0 auto; }
  .opts.two { grid-template-columns: 1fr 1fr; }
  .row { display: flex; align-items: center; gap: 12px; }
  .say { flex: none; width: 64px; height: 64px; border: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer; color: var(--q-nuit); background: linear-gradient(180deg, #ffe08a, var(--q-sol)); box-shadow: 0 5px 0 #6b3d08; touch-action: manipulation; }
  .say:active { transform: translateY(4px); box-shadow: 0 1px 0 #6b3d08; }
  .opt { flex: 1; min-height: 80px; padding: 8px 26px; border: 0; border-radius: 22px; text-align: left; cursor: pointer; font: 900 33px/1.15 var(--q-font-body); color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 7px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); touch-action: manipulation; transition: transform 0.08s, box-shadow 0.08s; }
  .opt:active:not(:disabled) { transform: translateY(5px); box-shadow: 0 2px 0 #7d5a1c; }
  .opt.right { background: linear-gradient(180deg, #7ff0bc, #1fb97a); box-shadow: 0 7px 0 #066a4a, 0 0 0 5px #42e0a0; }
  .opt.wrong { background: linear-gradient(180deg, #ffa3b0, #e8434f); box-shadow: 0 7px 0 #7a1f2f; }
  .opt.dim { opacity: 0.5; }
</style>
