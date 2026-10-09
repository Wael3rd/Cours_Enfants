<script lang="ts">
  /** La Forja : on glisse la terminaison (barre de fer chauffee) sur le radical, sur l'enclume. Marteau + etincelles. */
  import { onMount } from 'svelte';
  import { burst, gsap, haptic, prefersReducedMotion } from '@ce/core';
  import type { ConjugarStep } from '../content/schema';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { drag, inside } from '../ui/drag';
  import Consigna from '../ui/Consigna.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import { stableShuffle, type StepProps } from './common';

  let { step, result, onanswer }: StepProps<ConjugarStep> = $props();
  const pieces = $derived(stableShuffle(step.terminaciones, step.id));
  let placed = $state<string | null>(null);
  let slot: HTMLElement | undefined = $state();
  let anvil: HTMLElement | undefined = $state();
  let hammer: SVGSVGElement | undefined = $state();
  let work: HTMLElement | undefined = $state();
  const good = $derived(result ? result.outcome !== 'wrong' : false);

  onMount(() => {
    const t = setTimeout(() => say(step.habla.audio, step.habla.es), 600);
    return () => clearTimeout(t);
  });

  function strike() {
    const ok = placed === step.terminacion;
    sfx('equip');
    haptic(ok ? 'good' : 'bad');
    if (!slot) return;
    const r = slot.getBoundingClientRect();
    if (!prefersReducedMotion() && hammer && anvil) {
      const tl = gsap.timeline();
      tl.fromTo(hammer, { rotation: -50, opacity: 0.2 }, { rotation: -50, opacity: 1, duration: 0.01 })
        .to(hammer, { rotation: 14, duration: 0.16, ease: 'power3.in' })
        .call(() => {
          sfx('hit', 0.8);
          burst(document.body, r.left + r.width / 2, r.top + r.height / 2, { count: ok ? 34 : 14, colors: ok ? ['#ffc83d', '#ff9f1c', '#fff3d1', '#ff6a2b'] : ['#9aa3c7', '#5a6190'], size: 9 });
        })
        .to(anvil, { y: 8, duration: 0.06, yoyo: true, repeat: 1 }, '<')
        .to(hammer, { rotation: -50, duration: 0.3, ease: 'power2.out', delay: 0.1 })
        .to(hammer, { opacity: 0, duration: 0.2 });
    }
    if (ok && work && !prefersReducedMotion()) gsap.fromTo(work, { scale: 1 }, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1, delay: 0.2, ease: 'power2.out' });
    setTimeout(() => say(step.habla.audio, step.habla.es), 700);
  }

  function place(t: string) {
    if (result || placed) return;
    placed = t;
    onanswer({ tipo: 'conjugar', terminacion: t });
    setTimeout(strike, 120);
  }
  const dropOf = (t: string) => (x: number, y: number) => {
    if (result || placed) return false;
    if (inside(slot, x, y, 60)) {
      place(t);
      return true;
    }
    return false;
  };
</script>

<div class="cj">
  <Consigna c={step.consigna} />
  <div class="forge">
    <div class="embers" aria-hidden="true">{#each Array(14) as _, i}<i style:left="{(i * 7.3 + 5) % 100}%" style:animation-delay="{(i * 0.37) % 3}s" style:--d="{3 + (i % 4)}s"></i>{/each}</div>
    <div class="verb"><span class="chip">{step.verbo}</span></div>

    <div class="work" bind:this={work}>
      <span class="suj">{step.sujeto}</span>
      {#if step.radical}<span class="ingot rad">{step.radical}</span>{/if}
      <span class="slot" bind:this={slot} class:filled={!!placed} class:ok={result && good} class:bad={result && !good}>
        {#if placed}<span class="ingot ter" class:hot={!result} class:cooled={result && !good} class:glow={result && good}>{placed}</span>{:else}<span class="hole">?</span>{/if}
      </span>
    </div>

    <div class="anvilwrap" bind:this={anvil}>
      <svg class="anvil" viewBox="0 0 420 170" aria-hidden="true">
        <defs><linearGradient id="av" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3c7" /><stop offset=".35" stop-color="#5a6190" /><stop offset="1" stop-color="#2b2f55" /></linearGradient></defs>
        <path d="M14 30H312Q372 30 404 6L410 56Q372 70 330 72H292L274 112H336V160H84V112H146L128 72H74Q30 70 14 30Z" fill="url(#av)" stroke="#14173f" stroke-width="5" stroke-linejoin="round" />
        <path d="M24 34H306" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round" />
      </svg>
      <svg class="hammer" bind:this={hammer} viewBox="0 0 200 200" aria-hidden="true">
        <rect x="96" y="60" width="16" height="130" rx="8" fill="#9e6a3a" stroke="#4a2c12" stroke-width="4" />
        <rect x="40" y="20" width="120" height="52" rx="12" fill="#7d86b8" stroke="#14173f" stroke-width="5" />
        <rect x="48" y="26" width="104" height="12" rx="6" fill="#fff" opacity=".35" />
      </svg>
    </div>

    <div class="bank" class:gone={!!placed}>
      {#each pieces as t (t)}
        {#if t !== placed}
          <button type="button" class="ingot ter hot piece" use:drag={{ ondrop: dropOf(t), ontap: () => place(t), disabled: !!placed || !!result }}>{t}</button>
        {/if}
      {/each}
    </div>

    {#if result}
      <p class="forged"><SpeakText text={`${step.sujeto} ${step.forma}`} audio={step.habla.audio} /></p>
    {/if}
  </div>
</div>

<style>
  .cj { height: 100%; display: flex; flex-direction: column; gap: 12px; padding: 6px 40px 10px; }
  .forge { position: relative; flex: 1; min-height: 0; border-radius: 30px; overflow: hidden; background: radial-gradient(ellipse at 50% 100%, rgba(255, 106, 43, 0.5), rgba(120, 30, 20, 0.35) 40%, rgba(20, 10, 30, 0.9) 85%), linear-gradient(180deg, #2a1230, #14091f); box-shadow: inset 0 0 0 4px rgba(255, 159, 28, 0.5); display: flex; flex-direction: column; align-items: center; justify-content: safe center; padding: 14px 20px 14px; container-type: size; }
  .embers i { position: absolute; bottom: -10px; width: 8px; height: 8px; border-radius: 50%; background: #ffb347; opacity: 0; animation: rise var(--d) ease-in infinite; }
  @keyframes rise { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: translateY(-420px) scale(0.3); opacity: 0; } }
  .verb { position: absolute; left: 26px; top: 16px; }
  .chip { display: inline-block; padding: 6px 22px 8px; border-radius: 999px; font: 900 28px var(--q-font-body); color: var(--q-nuit); background: var(--q-sol); }
  .work { position: relative; z-index: 3; display: flex; align-items: center; gap: 12px; margin-bottom: -28px; }
  .suj { font: 400 46px/1 var(--q-font-title); color: var(--q-turquesa); margin-right: 12px; text-shadow: 0 4px 0 #07474f; }
  .ingot { display: inline-grid; place-items: center; min-width: 84px; height: 80px; padding: 0 22px; border-radius: 16px; font: 400 48px/1 var(--q-font-title); }
  .rad { color: #fff; background: linear-gradient(180deg, #b6bde8, #7d86b8 55%, #4a5190); box-shadow: 0 8px 0 #2b2f55, inset 0 0 0 3px rgba(255, 255, 255, 0.35); text-shadow: 0 3px 0 rgba(0, 0, 0, 0.4); }
  .ter { color: #fff; text-shadow: 0 3px 0 rgba(120, 30, 0, 0.7); }
  .hot { background: linear-gradient(180deg, #ffd34d, #ff8a1c 55%, #e0480f); box-shadow: 0 8px 0 #8a2a05, 0 0 22px rgba(255, 138, 28, 0.8), inset 0 0 0 3px rgba(255, 255, 255, 0.45); }
  .ter.cooled { background: linear-gradient(180deg, #b6bde8, #6a719f 55%, #3a4070); box-shadow: 0 8px 0 #2b2f55; text-shadow: none; }
  .ter.glow { background: linear-gradient(180deg, #fff3a0, #ffc83d 55%, #ff8a1c); box-shadow: 0 8px 0 #8a4a05, 0 0 40px rgba(255, 200, 61, 0.95), inset 0 0 0 3px rgba(255, 255, 255, 0.6); }
  .slot { min-width: 104px; height: 86px; display: grid; place-items: center; border-radius: 20px; border: 4px dashed rgba(255, 200, 61, 0.8); animation: pulse 1.4s ease-in-out infinite; }
  .slot.filled { border-style: solid; border-color: transparent; animation: none; }
  .hole { font: 400 46px var(--q-font-title); color: rgba(255, 200, 61, 0.7); }
  @keyframes pulse { 50% { background: rgba(255, 200, 61, 0.18); } }
  .anvilwrap { position: relative; z-index: 2; width: 400px; }
  .anvil { display: block; width: 100%; }
  .hammer { position: absolute; right: -60px; top: -110px; width: 160px; height: 160px; transform-origin: 104px 186px; opacity: 0; }
  .bank { position: relative; z-index: 4; display: flex; gap: 18px; justify-content: center; min-height: 92px; margin-top: 8px; }
  .bank.gone { opacity: 0.4; }
  .piece { border: 0; cursor: grab; touch-action: none; user-select: none; }
  .piece:global(.dragging) { cursor: grabbing; box-shadow: 0 24px 26px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 138, 28, 1), inset 0 0 0 3px rgba(255, 255, 255, 0.5); }
  .forged { position: absolute; right: 26px; top: 14px; margin: 0; text-align: right; font: 400 44px/1 var(--q-font-title); color: var(--q-sol); text-shadow: 0 4px 0 #8a4a05; z-index: 6; }
  .forged :global(.sp) { text-decoration: none; }
  /* combat / retour de reponse : peu de hauteur -> tout se reduit pour rester dans le cadre (jamais rogne en haut) */
  @container (max-height: 400px) {
    .work { gap: 8px; margin-bottom: -18px; }
    .suj { font-size: 36px; margin-right: 6px; }
    .ingot { min-width: 68px; height: 62px; padding: 0 16px; font-size: 38px; border-radius: 14px; }
    .slot { min-width: 84px; height: 66px; }
    .anvilwrap { width: 270px; }
    .hammer { width: 110px; height: 110px; right: -40px; top: -76px; transform-origin: 71px 128px; }
    .bank { min-height: 70px; margin-top: 4px; gap: 14px; }
    .forged { font-size: 34px; }
  }
  @container (max-height: 300px) {
    .anvilwrap { width: 200px; }
    .ingot { min-width: 56px; height: 52px; font-size: 32px; }
    .slot { min-width: 70px; height: 56px; }
    .bank { min-height: 58px; }
  }
</style>
