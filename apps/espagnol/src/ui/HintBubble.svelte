<script lang="ts">
  /** Pista : le SEUL endroit ou le francais apparait. Carte qui sort de l'ampoule ; un toucher ailleurs la ferme. */
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import { sfx } from '../services/sfx';
  import Icon from './Icon.svelte';

  interface Props { text: string; title?: string; onclose: () => void; }
  let { text, title = 'Pista', onclose }: Props = $props();
  let card: HTMLElement | undefined = $state();

  onMount(() => {
    sfx('open', 0.7);
    if (card) gsap.fromTo(card, { y: 40, scale: 0.85, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(1.8)' });
  });
  function close() {
    sfx('close', 0.6);
    if (card) gsap.to(card, { y: 30, opacity: 0, duration: 0.18, onComplete: onclose });
    else onclose();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="veil" onclick={close}>
  <div class="card" bind:this={card} role="dialog" aria-label="Pista">
    <div class="head"><span class="bulb"><Icon name="bulb" size={34} /></span><b>{title}</b></div>
    <p>{text}</p>
    <small>Toca para cerrar</small>
  </div>
</div>

<style>
  .veil { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; background: rgba(8, 9, 32, 0.6); padding: 40px; }
  .card { max-width: 760px; padding: 26px 34px 20px; border-radius: 28px; color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel)); box-shadow: 0 0 0 6px #19b7aa, 0 8px 0 6px #07474f, 0 30px 50px rgba(0, 0, 0, 0.5); will-change: transform, opacity; }
  .head { display: flex; align-items: center; gap: 12px; font: 400 32px/1 var(--q-font-title); color: var(--q-turquesa2); }
  .bulb { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; background: var(--q-turquesa); color: #fff; }
  p { margin: 14px 0 10px; font: 800 32px/1.4 var(--q-font-body); white-space: pre-line; }
  small { display: block; text-align: right; font: 800 18px var(--q-font-body); opacity: 0.55; }
</style>
