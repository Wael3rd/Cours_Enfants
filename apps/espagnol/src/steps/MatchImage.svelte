<script lang="ts">
  /** Associer images et mots : on touche une image puis son mot (ou l'inverse). Les erreurs sont comptees par mot. */
  import { gsap, haptic, prefersReducedMotion, shake } from '@ce/core';
  import type { MatchImageStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { sparks } from '../ui/fx';
  import Consigna from '../ui/Consigna.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import { emojiUrl } from '../ui/emoji';
  import { stableShuffle, vocabById, type StepProps } from './common';

  let { step, onanswer }: StepProps<MatchImageStep> = $props();
  const vs = $derived(step.pares.map((p) => vocabById(p.vocab)).filter((v): v is NonNullable<ReturnType<typeof vocabById>> => !!v));
  const imgs = $derived(stableShuffle(vs, step.id + 'i'));
  const words = $derived(stableShuffle(vs, step.id + 'w'));
  let picked = $state<{ side: 'img' | 'word'; id: string } | null>(null);
  let matched = $state<Record<string, boolean>>({});
  let errors = $state<Record<string, number>>({});
  let root: HTMLElement | undefined = $state();

  const num = (v: { ilustracion?: string }) => /nombre\s+(\d+)/i.exec(v.ilustracion ?? '')?.[1];

  function tap(side: 'img' | 'word', id: string, el: HTMLElement) {
    if (matched[id]) return;
    haptic('tap');
    const v = vocabById(id)!;
    if (side === 'word') say(v.audio, v.es);
    else sfx('tap', 0.5);
    if (!picked || picked.side === side) {
      picked = { side, id };
      if (!prefersReducedMotion()) gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
      return;
    }
    if (picked.id === id) {
      matched[id] = true;
      sfx('pip');
      haptic('good');
      const other = root?.querySelectorAll(`[data-id="${id}"]`);
      other?.forEach((e) => sparks(e, ['#42e0a0', '#ffc83d', '#fff'], 8));
      if (side === 'img') say(v.audio, v.es);
      picked = null;
      if (Object.keys(matched).length === vs.length) setTimeout(() => onanswer({ tipo: 'match_image', errors }), 700);
    } else {
      errors[picked.id] = (errors[picked.id] ?? 0) + 1;
      errors[id] = (errors[id] ?? 0) + 1;
      sfx('wrong');
      haptic('bad');
      const prev = root?.querySelector(`[data-side="${picked.side}"][data-id="${picked.id}"]`);
      shake(el, 12);
      if (prev) shake(prev, 12);
      picked = null;
    }
  }
</script>

<div class="mi" bind:this={root}>
  <Consigna c={step.consigna} />
  <div class="cols">
    <div class="col">
      {#each imgs as v (v.id)}
        <button type="button" class="tile img" data-side="img" data-id={v.id} class:sel={picked?.side === 'img' && picked.id === v.id} class:ok={matched[v.id]} disabled={matched[v.id]} onclick={(e) => tap('img', v.id, e.currentTarget as HTMLElement)} aria-label="Imagen">
          {#if emojiUrl(v.emoji) || ['🇪🇸', '🇲🇽', '🇦🇷', '🇫🇷', '🇬🇧'].includes(v.emoji ?? '')}<Emoji e={v.emoji} size={64} />{:else if num(v)}<b class="n">{num(v)}</b>{:else}<Emoji e={v.emoji ?? ''} size={64} />{/if}
        </button>
      {/each}
    </div>
    <div class="col">
      {#each words as v (v.id)}
        <button type="button" class="tile word" data-side="word" data-id={v.id} class:sel={picked?.side === 'word' && picked.id === v.id} class:ok={matched[v.id]} disabled={matched[v.id]} onclick={(e) => tap('word', v.id, e.currentTarget as HTMLElement)}>
          {v.es}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .mi { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 6px 40px 16px; }
  .cols { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1.25fr; gap: 56px; justify-items: stretch; max-width: 980px; width: 100%; margin: 0 auto; }
  .col { display: grid; gap: 10px; align-content: center; grid-auto-rows: minmax(46px, 82px); }
  .tile { min-height: 0; overflow: hidden; }
  .tile :global(img.em), .tile :global(.flag) { max-height: 82%; width: auto; }
  .cols { container-type: size; }
  @container (max-height: 420px) { .col { gap: 6px; } .tile.word { font-size: 30px; } .tile { border-radius: 16px; box-shadow: 0 5px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); } .tile.img { box-shadow: 0 5px 0 #07082a, inset 0 0 0 3px rgba(255, 200, 61, 0.55); } .n { font-size: 40px; } }
  .tile { position: relative; border: 0; border-radius: 22px; display: grid; place-items: center; cursor: pointer; color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 7px 0 #7d5a1c, inset 0 0 0 3px rgba(255, 255, 255, 0.5); touch-action: manipulation; transition: transform 0.08s, box-shadow 0.08s, background 0.2s; }
  .tile.word { font: 900 36px/1 var(--q-font-body); }
  .tile.img { background: radial-gradient(circle at 50% 35%, #3a41a8, var(--q-nuit) 80%); box-shadow: 0 7px 0 #07082a, inset 0 0 0 3px rgba(255, 200, 61, 0.55); }
  .tile:active:not(:disabled) { transform: translateY(5px); }
  .tile.sel { transform: translateY(4px) scale(1.04); box-shadow: 0 2px 0 #7d5a1c, 0 0 0 6px var(--q-sol), 0 0 28px rgba(255, 200, 61, 0.8); }
  .tile.ok { background: linear-gradient(180deg, #7ff0bc, #1fb97a); color: #05382a; opacity: 0.7; box-shadow: 0 2px 0 #066a4a; transform: translateY(5px); }
  .tile.img.ok { background: radial-gradient(circle at 50% 35%, #1fb97a, #066a4a 80%); box-shadow: 0 2px 0 #033a29; }
  .n { font: 400 54px/1 var(--q-font-title); color: var(--q-sol); }
</style>
