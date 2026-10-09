<script lang="ts">
  /** Carte de decouverte : des exemples reveles un par un (mots cles surlignes), puis la regle. */
  import { onMount, tick } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import type { GrammarCardStep } from '../content/schema';
  import { content } from '../engine/data';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { sparks } from '../ui/fx';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import type { StepProps } from './common';

  let { step, onanswer }: StepProps<GrammarCardStep> = $props();
  const card = $derived(content.grammar.get(step.ref));
  let shown = $state(1);
  let rule = $state(false);
  let list: HTMLElement | undefined = $state();
  let rulebox: HTMLElement | undefined = $state();
  const total = $derived(card?.ejemplos.length ?? 0);

  onMount(() => {
    const e = card?.ejemplos[0];
    const t = setTimeout(() => e && say(e.audio, e.es), 500);
    return () => clearTimeout(t);
  });

  async function next() {
    haptic('tap');
    if (!card) return onanswer({ tipo: 'grammar_card' });
    if (shown < total) {
      const e = card.ejemplos[shown];
      shown += 1;
      sfx('page');
      await tick();
      const el = list?.lastElementChild;
      if (el && !prefersReducedMotion()) gsap.fromTo(el, { x: 80, opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' });
      setTimeout(() => say(e.audio, e.es), 350);
    } else if (!rule) {
      rule = true;
      sfx('magic');
      await tick();
      if (rulebox && !prefersReducedMotion()) {
        gsap.fromTo(rulebox, { scale: 0.7, opacity: 0, rotation: -3 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' });
        setTimeout(() => sparks(rulebox, ['#ffc83d', '#fff3d1', '#7ff3e4'], 22), 250);
      }
      setTimeout(() => card && say(card.regla.audio, card.regla.es), 600);
    } else onanswer({ tipo: 'grammar_card' });
  }
</script>

{#if card}
  <div class="gc">
    <div class="ttl"><h2 class="h-rpg">{card.titulo.es}</h2></div>
    <div class="cols">
      <div class="ex" bind:this={list}>
        {#each card.ejemplos.slice(0, shown) as e, i (e.audio + i)}
          <div class="e"><span class="n">{i + 1}</span><p><SpeakText text={e.es} audio={e.audio} mark={e.resaltar ?? []} /></p></div>
        {/each}
      </div>
      <div class="rule">
        {#if rule}
          <div class="rb" bind:this={rulebox}>
            <p class="r"><SpeakText text={card.regla.es} audio={card.regla.audio} /></p>
            {#if card.tabla}
              <table>
                <thead><tr>{#each card.tabla.encabezado as h}<th>{h}</th>{/each}</tr></thead>
                <tbody>{#each card.tabla.filas as f}<tr>{#each f as c}<td>{c}</td>{/each}</tr>{/each}</tbody>
              </table>
            {/if}
          </div>
        {:else}
          <div class="locked"><span>✦</span><p>{shown < total ? 'Observa los ejemplos…' : '¡Ya lo ves! Descubre la regla.'}</p></div>
        {/if}
      </div>
    </div>
    <div class="go"><PrimaryButton variant={rule ? 'turquesa' : 'sol'} onclick={next}>{shown < total ? 'Siguiente' : !rule ? '¡Descubrir la regla!' : '¡Entendido!'}</PrimaryButton></div>
  </div>
{/if}

<style>
  .gc { height: 100%; display: flex; flex-direction: column; gap: 8px; padding: 4px 40px 12px; }
  .ttl h2 { font-size: 46px; text-align: center; }
  .cols { flex: 1; min-height: 0; display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; align-items: start; }
  .ex { display: grid; gap: 12px; max-height: 100%; overflow-y: auto; scrollbar-width: none; padding: 4px 4px 12px; }
  .e { display: flex; align-items: center; gap: 16px; padding: 14px 22px; border-radius: 22px; background: rgba(11, 13, 42, 0.62); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.45); }
  .n { flex: none; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font: 400 26px var(--q-font-title); color: var(--q-nuit); background: var(--q-sol); }
  .e p { margin: 0; font: 800 33px/1.3 var(--q-font-body); color: var(--q-papel); }
  .rule { min-height: 0; }
  .locked { height: 260px; border-radius: 26px; display: grid; place-content: center; justify-items: center; gap: 8px; text-align: center; background: rgba(255, 255, 255, 0.06); box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.14); border: 0; }
  .locked span { font-size: 64px; color: rgba(255, 200, 61, 0.55); }
  .locked p { margin: 0; font: 800 28px var(--q-font-body); color: var(--q-papel2); }
  .rb { padding: 22px 28px; border-radius: 26px; background: linear-gradient(180deg, #fff3d1, var(--q-papel)); color: var(--q-nuit); box-shadow: 0 0 0 6px var(--q-sol), 0 8px 0 6px #6b3d08, 0 0 40px rgba(255, 200, 61, 0.55); }
  .r { margin: 0 0 8px; font: 900 32px/1.3 var(--q-font-body); }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font: 800 26px var(--q-font-body); }
  th { text-align: left; padding: 6px 10px; border-bottom: 4px solid var(--q-terracotta); color: var(--q-terracotta2); }
  td { padding: 6px 10px; border-bottom: 2px solid rgba(158, 61, 41, 0.25); }
  .go { display: flex; justify-content: center; }
</style>
