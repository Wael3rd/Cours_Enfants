<script lang="ts">
  /** Mini-paquet de cartes-objets : chaque mot est revele (retournement), prononce, avec sa phrase d'exemple. */
  import { onMount } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import type { FlashcardStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { sparks } from '../ui/fx';
  import { rarityOf, RARITY_LABEL } from '../engine/rpg';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import VocabCard from '../ui/VocabCard.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import RoundBtn from '../ui/RoundBtn.svelte';
  import { vocabById, type StepProps } from './common';

  let { step, onanswer }: StepProps<FlashcardStep> = $props();
  const words = $derived(step.vocab.map(vocabById).filter((v): v is NonNullable<ReturnType<typeof vocabById>> => !!v));
  let i = $state(0);
  const v = $derived(words[i]);
  let cardWrap: HTMLElement | undefined = $state();
  let info: HTMLElement | undefined = $state();

  function reveal() {
    if (!cardWrap) return;
    const rare = v && rarityOf(v) !== 'comun' && rarityOf(v) !== 'poco_comun';
    sfx(rare ? 'item' : 'page', 0.8);
    if (!prefersReducedMotion()) {
      gsap.fromTo(cardWrap, { rotationY: 90, scale: 0.7, opacity: 0 }, { rotationY: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' });
      if (info) gsap.fromTo(info.children, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.25, ease: 'power3.out' });
      if (rare) setTimeout(() => sparks(cardWrap), 380);
    }
    setTimeout(() => v && say(v.audio, v.es), 420);
  }
  onMount(reveal);

  function next() {
    haptic('tap');
    if (i < words.length - 1) {
      i += 1;
      requestAnimationFrame(reveal);
    } else onanswer({ tipo: 'flashcard' });
  }
</script>

{#if v}
  <div class="fc">
    <div class="stage">
      <div class="card" bind:this={cardWrap}>
        <VocabCard {v} size={330} ontap={() => say(v.audio, v.es)} />
      </div>
      <span class="rare">{RARITY_LABEL[rarityOf(v)]}</span>
    </div>
    <div class="info" bind:this={info}>
      <h2 class="word"><SpeakText text={v.es} audio={v.audio} /></h2>
      <div class="forms">
        {#if v.plural}<span class="chip">plural · <SpeakText text={v.plural} audio={undefined} icon={false} /></span>{/if}
        {#if v.femenino}<span class="chip">femenino · <SpeakText text={v.femenino} audio={undefined} icon={false} /></span>{/if}
        {#if v.genero === 'm'}<span class="chip m">masculino</span>{:else if v.genero === 'f'}<span class="chip f">femenino</span>{/if}
      </div>
      <p class="ex"><SpeakText text={v.ejemplo.es} audio={v.ejemplo.audio} /></p>
      <div class="acts">
        <RoundBtn icon="turtle" label="Más despacio" variant="turquesa" onclick={() => say(v.audio, v.es, { lento: true })} />
        <PrimaryButton onclick={next}>{i < words.length - 1 ? 'Siguiente' : '¡Entendido!'}</PrimaryButton>
      </div>
      <div class="pips">{#each words as _, k}<i class:on={k === i} class:done={k < i}></i>{/each}</div>
    </div>
  </div>
{/if}

<style>
  .fc { height: 100%; display: grid; grid-template-columns: auto 1fr; gap: 56px; align-items: center; padding: 10px 70px 20px 90px; }
  .stage { position: relative; perspective: 1000px; display: grid; justify-items: center; gap: 18px; }
  .card { will-change: transform, opacity; }
  .rare { font: 900 24px var(--q-font-body); color: var(--q-sol); letter-spacing: 0.04em; }
  .info { display: grid; gap: 18px; align-content: center; }
  .word { margin: 0; font: 400 clamp(58px, 7vw, 92px)/1 var(--q-font-title); color: var(--q-sol); text-shadow: 0 5px 0 #8a4a05; }
  .word :global(.sp) { text-decoration: none; }
  .forms { display: flex; gap: 10px; flex-wrap: wrap; }
  .chip { padding: 5px 18px 7px; border-radius: 999px; font: 900 22px var(--q-font-body); background: rgba(255, 255, 255, 0.14); color: var(--q-papel); }
  .chip.m { background: var(--q-el); color: #fff; }
  .chip.f { background: var(--q-la); color: #fff; }
  .ex { margin: 0; font: 800 34px/1.35 var(--q-font-body); color: var(--q-papel); padding: 16px 22px; border-radius: 20px; background: rgba(11, 13, 42, 0.55); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.35); }
  .acts { display: flex; align-items: center; gap: 22px; }
  .pips { display: flex; gap: 10px; }
  .pips i { width: 16px; height: 16px; border-radius: 50%; background: rgba(255, 255, 255, 0.25); }
  .pips i.on { background: var(--q-sol); transform: scale(1.35); }
  .pips i.done { background: var(--q-quetzal); }
</style>
