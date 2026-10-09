<script lang="ts">
  /** Remettre les mots dans l'ordre : glisser-deposer (ou toucher) entre la banque et la ligne de phrase. */
  import { haptic } from '@ce/core';
  import type { ReorderWordsStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { drag, inside } from '../ui/drag';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import Consigna from '../ui/Consigna.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import { stableShuffle, type StepProps } from './common';

  let { step, result, onanswer }: StepProps<ReorderWordsStep> = $props();
  interface Tile { id: number; w: string }
  const all: Tile[] = $derived(stableShuffle([...step.palabras, ...(step.senuelos ?? [])].map((w, i) => ({ id: i, w })), step.id));
  let line = $state<Tile[]>([]);
  let lineEl: HTMLElement | undefined = $state();
  let bankEl: HTMLElement | undefined = $state();
  const bank = $derived(all.filter((t) => !line.some((l) => l.id === t.id)));
  const locked = $derived(!!result);

  function toLine(t: Tile, at = line.length) {
    line = [...line.filter((l) => l.id !== t.id)];
    line.splice(at, 0, t);
    line = [...line];
    sfx('tick', 0.6);
  }
  function toBank(t: Tile) {
    line = line.filter((l) => l.id !== t.id);
    sfx('tick', 0.4);
  }
  /** index d'insertion dans la ligne d'apres la position du doigt */
  function indexAt(x: number, y: number, skip: Tile): number {
    const els = [...(lineEl?.querySelectorAll('[data-tid]') ?? [])] as HTMLElement[];
    let n = 0;
    for (const el of els) {
      if (Number(el.dataset.tid) === skip.id) continue;
      const r = el.getBoundingClientRect();
      if (y > r.bottom || (y >= r.top && x > r.left + r.width / 2)) n += 1;
      else break;
    }
    return n;
  }
  const dropOf = (t: Tile, fromLine: boolean) => (x: number, y: number) => {
    if (locked) return false;
    if (inside(lineEl, x, y, 24)) {
      toLine(t, indexAt(x, y, t));
      haptic('tap');
      return true;
    }
    if (fromLine) {
      toBank(t);
      return true;
    }
    return false;
  };
  const tapOf = (t: Tile, fromLine: boolean) => () => {
    if (locked) return;
    haptic('tap');
    if (fromLine) toBank(t);
    else toLine(t);
  };

  function check() {
    if (locked || !line.length) return;
    onanswer({ tipo: 'reorder_words', words: line.map((t) => t.w) });
    setTimeout(() => say(step.habla.audio, step.habla.es), 450);
  }
  const ok = $derived(result?.outcome === 'correct' || result?.outcome === 'partial');
</script>

<div class="ro">
  <Consigna c={step.consigna} />
  <div class="body">
    <div class="line" class:ok class:bad={result && !ok} bind:this={lineEl} aria-label="Tu frase">
      {#each line as t (t.id)}
        <button type="button" class="tile" data-tid={t.id} use:drag={{ ondrop: dropOf(t, true), ontap: tapOf(t, true), disabled: locked }}>{t.w}</button>
      {/each}
      {#if !line.length}<span class="ph">Toca o arrastra las palabras aquí</span>{/if}
    </div>
    {#if result}
      <p class="full"><SpeakText text={step.habla.es} audio={step.habla.audio} /></p>
    {:else}
      <div class="bank" bind:this={bankEl}>
        {#each bank as t (t.id)}
          <button type="button" class="tile" data-tid={t.id} use:drag={{ ondrop: dropOf(t, false), ontap: tapOf(t, false), disabled: locked }}>{t.w}</button>
        {/each}
      </div>
      <PrimaryButton variant="turquesa" onclick={check} disabled={!line.length}>Comprobar</PrimaryButton>
    {/if}
  </div>
</div>

<style>
  .ro { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 6px 40px 16px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 26px; }
  .line { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; align-content: center; width: 100%; max-width: 1060px; min-height: 140px; padding: 20px 24px; border-radius: 28px; background: rgba(11, 13, 42, 0.55); box-shadow: inset 0 0 0 4px rgba(255, 200, 61, 0.5), inset 0 8px 18px rgba(0, 0, 0, 0.35); }
  .line.ok { box-shadow: inset 0 0 0 5px #42e0a0, 0 0 30px rgba(66, 224, 160, 0.4); }
  .line.bad { box-shadow: inset 0 0 0 5px #ff5a75; }
  .ph { font: 800 28px var(--q-font-body); color: var(--q-papel2); opacity: 0.6; }
  .bank { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; max-width: 1060px; min-height: 100px; }
  .tile { min-width: 84px; height: 84px; padding: 0 28px; border: 0; border-radius: 22px; cursor: grab; font: 900 40px/1 var(--q-font-body); color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 8px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); touch-action: none; user-select: none; }
  .tile:global(.dragging) { box-shadow: 0 22px 24px rgba(0, 0, 0, 0.45), 0 0 0 5px var(--q-sol); cursor: grabbing; }
  .full { margin: 0; font: 800 36px/1.3 var(--q-font-body); color: var(--q-papel); }
</style>
