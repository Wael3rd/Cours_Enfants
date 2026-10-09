<script lang="ts">
  /** Ecouter puis choisir l'image (modo imagen) ou le texte (modo texto). Reponse immediate au toucher. */
  import { haptic, shake } from '@ce/core';
  import type { ListenChooseStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import Consigna from '../ui/Consigna.svelte';
  import ListenBtn from '../ui/ListenBtn.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import { emojiUrl } from '../ui/emoji';
  import { vocabById, type StepProps } from './common';

  let { step, result, onanswer }: StepProps<ListenChooseStep> = $props();
  let chosen = $state<number | null>(null);
  const correctIdx = $derived(step.opciones.findIndex((o) => o.correcta));

  function pick(i: number, el: HTMLElement) {
    if (result) return;
    chosen = i;
    haptic('tap');
    onanswer({ tipo: 'listen_choose', choice: i });
    if (!step.opciones[i].correcta) shake(el, 12);
    setTimeout(() => say(step.habla.audio, step.habla.es), 500);
  }
  const num = (id?: string) => /nombre\s+(\d+)/i.exec(vocabById(id)?.ilustracion ?? '')?.[1];
  const hasImg = (e?: string) => !!emojiUrl(e) || ['🇪🇸', '🇲🇽', '🇦🇷', '🇫🇷', '🇬🇧'].includes(e ?? '');
</script>

<div class="lc">
  <Consigna c={step.consigna} />
  <div class="body">
    <ListenBtn audio={step.habla.audio} text={step.habla.es} />
    {#if step.modo === 'imagen'}
      <div class="grid img" class:n3={step.opciones.length === 3}>
        {#each step.opciones as o, i}
          {@const v = vocabById(o.vocab)}
          <button
            type="button"
            class="opt"
            class:right={result && i === correctIdx}
            class:wrong={result && chosen === i && !o.correcta}
            class:dim={result && i !== correctIdx && chosen !== i}
            disabled={!!result}
            onclick={(e) => pick(i, e.currentTarget as HTMLElement)}
            aria-label={`Opción ${i + 1}`}
          >
            {#if v && hasImg(v.emoji)}<Emoji e={v.emoji} size={120} />{:else if v && num(o.vocab)}<b class="n">{num(o.vocab)}</b>{:else if v}<Emoji e={v.emoji ?? ''} size={120} />{/if}
            {#if result && v}<span class="cap">{v.es}</span>{/if}
          </button>
        {/each}
      </div>
    {:else}
      <div class="grid txt">
        {#each step.opciones as o, i}
          <button
            type="button"
            class="opt t"
            class:right={result && i === correctIdx}
            class:wrong={result && chosen === i && !o.correcta}
            class:dim={result && i !== correctIdx && chosen !== i}
            disabled={!!result}
            onclick={(e) => pick(i, e.currentTarget as HTMLElement)}
          >{o.texto}</button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .lc { height: 100%; display: flex; flex-direction: column; gap: 16px; padding: 6px 40px 16px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 24px; }
  .grid { display: grid; gap: 18px; }
  .grid.img { grid-template-columns: repeat(2, 240px); }
  .grid.img.n3 { grid-template-columns: repeat(3, 240px); }
  .grid.txt { grid-template-columns: repeat(2, minmax(300px, 1fr)); width: 100%; max-width: 900px; }
  .opt { position: relative; min-height: 170px; border: 0; border-radius: 26px; display: grid; place-items: center; align-content: center; gap: 4px; cursor: pointer; color: var(--q-nuit); background: radial-gradient(circle at 50% 35%, #3a41a8, var(--q-nuit) 80%); box-shadow: 0 9px 0 #07082a, inset 0 0 0 4px rgba(255, 200, 61, 0.6); touch-action: manipulation; transition: transform 0.08s, box-shadow 0.08s; }
  .grid.img .opt { min-height: 168px; }
  .opt.t { min-height: 92px; font: 900 38px/1.1 var(--q-font-body); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 8px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); padding: 0 20px; }
  .opt:active:not(:disabled) { transform: translateY(6px); box-shadow: 0 2px 0 #07082a, inset 0 0 0 4px rgba(255, 200, 61, 0.6); }
  .opt.t:active:not(:disabled) { box-shadow: 0 2px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); }
  .opt.right { background: radial-gradient(circle at 50% 35%, #2fd698, #066a4a 85%); box-shadow: 0 9px 0 #033a29, 0 0 0 6px #42e0a0, 0 0 30px rgba(66, 224, 160, 0.7); color: #fff; }
  .opt.t.right { background: linear-gradient(180deg, #7ff0bc, #1fb97a); color: #05382a; }
  .opt.wrong { background: radial-gradient(circle at 50% 35%, #ff7a8a, #8f1d3a 85%); box-shadow: 0 9px 0 #4a0f1f, 0 0 0 6px #ff5a75; }
  .opt.t.wrong { background: linear-gradient(180deg, #ffa3b0, #e8434f); color: #4a0f1f; }
  .opt.dim { opacity: 0.45; }
  .cap { font: 900 30px/1 var(--q-font-body); color: #fff; text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4); }
  .n { font: 400 84px/1 var(--q-font-title); color: var(--q-sol); text-shadow: 0 5px 0 #8a4a05; }
</style>
