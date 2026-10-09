<script lang="ts">
  /** Hechizo : dire la phrase au micro (Web Speech es-ES). Repli auto-evaluation si le micro / le reseau manque. */
  import { onDestroy, onMount } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import type { SpeakStep } from '../content/schema';
  import { game } from '../state/game.svelte';
  import { scoreSpeech, type SpeechScore } from '../engine/speech';
  import { listen, speechSupport, type Listening, type RecognitionResult } from '../services/speech';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { sparks } from '../ui/fx';
  import Consigna from '../ui/Consigna.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import Icon from '../ui/Icon.svelte';
  import RoundBtn from '../ui/RoundBtn.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import type { StepProps } from './common';

  let { step, result, onanswer }: StepProps<SpeakStep> = $props();
  type Phase = 'idle' | 'listening' | 'scored';
  let phase = $state<Phase>('idle');
  let interim = $state('');
  let score = $state<SpeechScore | null>(null);
  let attempts = $state(0);
  let note = $state('');
  let fallback = $state(!game.state.settings.speechEnabled || speechSupport() !== 'ok');
  let cur: Listening | null = null;
  let mic: HTMLElement | undefined = $state();
  let lastAlts: RecognitionResult['alts'] = [];

  onMount(() => {
    const t = setTimeout(() => say(step.objetivo.audio, step.objetivo.es), 500);
    return () => clearTimeout(t);
  });
  onDestroy(() => cur?.abort());

  async function start() {
    if (phase === 'listening') {
      cur?.stop();
      return;
    }
    haptic('tap');
    sfx('open', 0.6);
    interim = '';
    note = '';
    phase = 'listening';
    attempts += 1;
    cur = listen({ onInterim: (t) => (interim = t), timeoutMs: 9000, noSpeechMs: 6000 });
    const r = await cur.result;
    cur = null;
    if (!r.ok) {
      if (r.fallback) {
        fallback = true;
        phase = 'idle';
        note = r.failure === 'denied' ? 'El micrófono no está permitido.' : r.failure === 'offline' || r.failure === 'network' ? 'Sin internet: el micrófono no funciona.' : 'No puedo usar el micrófono.';
        return;
      }
      phase = 'idle';
      note = 'No te he oído. ¡Inténtalo otra vez!';
      return;
    }
    lastAlts = r.alts;
    score = scoreSpeech(step, r.alts);
    interim = score.heard;
    phase = 'scored';
    if (score.level === 'repetir') {
      sfx('wrong');
      haptic('bad');
      return;
    }
    sfx(score.level === 'logrado' ? 'spell' : 'pip');
    haptic('good');
    if (score.level === 'logrado' && mic) sparks(mic, ['#ff7aa8', '#ffc83d', '#7ff3e4', '#fff'], 26);
    setTimeout(() => submit(), 1300);
  }

  function submit() {
    if (result) return;
    onanswer({ tipo: 'speak', alts: lastAlts.length ? lastAlts : [interim || ''] });
  }
  function selfEval(v: 'bien' | 'casi' | 'no') {
    if (result) return;
    haptic('tap');
    onanswer({ tipo: 'speak', self: v });
  }
  function retry() {
    phase = 'idle';
    score = null;
    interim = '';
  }
  $effect(() => {
    if (phase === 'listening' && mic && !prefersReducedMotion()) {
      const tw = gsap.fromTo(mic, { scale: 1 }, { scale: 1.08, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      return () => { tw.kill(); gsap.set(mic!, { scale: 1 }); };
    }
  });
  const LEVEL = { logrado: '¡Logrado!', casi: '¡Casi!', repetir: 'Otra vez' } as const;
</script>

<div class="sp">
  <Consigna c={step.consigna} />
  <div class="body">
    <div class="target">
      <p class="phrase"><SpeakText text={step.objetivo.es} audio={step.objetivo.audio} /></p>
      <RoundBtn icon="turtle" label="Más despacio" variant="turquesa" size={84} onclick={() => say(step.objetivo.audio, step.objetivo.es, { lento: true })} />
    </div>
    {#if step.hechizo}
      <p class="spell"><span>✦</span> {step.hechizo.nombre}</p>
    {/if}

    {#if fallback}
      <div class="self">
        <p class="say">Dilo en voz alta y evalúate:</p>
        {#if note}<p class="note">{note}</p>{/if}
        <div class="three">
          <button type="button" class="ev good" disabled={!!result} onclick={() => selfEval('bien')}><Icon name="check" size={40} /> ¡Bien!</button>
          <button type="button" class="ev mid" disabled={!!result} onclick={() => selfEval('casi')}>Casi</button>
          <button type="button" class="ev bad" disabled={!!result} onclick={() => selfEval('no')}>Otra vez</button>
        </div>
      </div>
    {:else}
      <div class="micwrap">
        <span class="ring r1" class:on={phase === 'listening'}></span><span class="ring r2" class:on={phase === 'listening'}></span><span class="ring r3" class:on={phase === 'listening'}></span>
        <button type="button" class="mic" class:live={phase === 'listening'} class:ok={score && score.level !== 'repetir'} bind:this={mic} disabled={!!result || (phase === 'scored' && score?.level !== 'repetir')} onclick={start} aria-label={phase === 'listening' ? 'Parar' : 'Hablar'}>
          <Icon name="mic" size={82} />
        </button>
      </div>
      <div class="tx">
        {#if phase === 'listening'}
          <p class="live">{interim || 'Te escucho…'}</p>
        {:else if phase === 'scored' && score}
          <p class="heard">« {interim} »</p>
          <p class="lvl {score.level}">{LEVEL[score.level]}</p>
          {#if score.level === 'repetir'}
            <div class="again">
              <PrimaryButton variant="magenta" onclick={retry}>Otra vez</PrimaryButton>
              {#if attempts >= 3}<PrimaryButton variant="sol" onclick={submit}>Seguir</PrimaryButton>{/if}
            </div>
          {/if}
        {:else}
          <p class="hint">{note || 'Toca el micrófono y di la frase.'}</p>
          {#if attempts >= 1 && note}<button type="button" class="skip" onclick={() => (fallback = true)}>Evaluarme yo</button>{/if}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .sp { height: 100%; display: flex; flex-direction: column; gap: 12px; padding: 6px 40px 16px; }
  .body { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 14px; }
  .target { display: flex; align-items: center; gap: 22px; padding: 14px 30px; border-radius: 26px; background: linear-gradient(180deg, #fbf0d8, var(--q-papel)); color: var(--q-nuit); box-shadow: 0 0 0 6px var(--q-sol), 0 8px 0 6px #6b3d08, 0 20px 28px rgba(0, 0, 0, 0.35); }
  .phrase { margin: 0; font: 900 clamp(38px, 4.6vw, 54px)/1.2 var(--q-font-body); }
  .spell { margin: 0; padding: 4px 22px 6px; border-radius: 999px; font: 900 26px var(--q-font-body); color: #fff; background: linear-gradient(180deg, #c65bff, #7b2fc4); box-shadow: 0 4px 0 #3b1070; }
  .micwrap { position: relative; width: 170px; height: 170px; display: grid; place-items: center; margin-top: 4px; }
  .ring { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 5px var(--q-magenta); opacity: 0; }
  .ring.on { animation: ripple 1.6s ease-out infinite; }
  .ring.r2.on { animation-delay: 0.5s; }
  .ring.r3.on { animation-delay: 1s; }
  @keyframes ripple { from { transform: scale(0.9); opacity: 0.9; } to { transform: scale(1.9); opacity: 0; } }
  .mic { position: relative; width: 156px; height: 156px; border: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer; color: #fff; background: linear-gradient(180deg, #ff7aa8, var(--q-magenta) 55%, var(--q-magenta2)); box-shadow: 0 10px 0 #5e0f33, inset 0 0 0 5px rgba(255, 255, 255, 0.45), 0 20px 30px rgba(0, 0, 0, 0.4); touch-action: manipulation; transition: transform 0.06s, box-shadow 0.06s; }
  .mic:active:not(:disabled) { transform: translateY(8px); box-shadow: 0 2px 0 #5e0f33, inset 0 0 0 5px rgba(255, 255, 255, 0.45); }
  .mic.live { background: linear-gradient(180deg, #ffd34d, #ff8a1c); box-shadow: 0 10px 0 #8a2a05, 0 0 40px rgba(255, 138, 28, 0.9); }
  .mic.ok { background: linear-gradient(180deg, #5df0b0, #0e9f6e); box-shadow: 0 10px 0 #033a29; }
  .tx { min-height: 120px; display: grid; justify-items: center; align-content: start; gap: 6px; text-align: center; }
  .tx p { margin: 0; }
  .live { font: 800 40px/1.2 var(--q-font-body); color: var(--q-sol); }
  .heard { font: 800 38px/1.2 var(--q-font-body); color: var(--q-papel); }
  .lvl { font: 400 52px/1 var(--q-font-title); }
  .lvl.logrado { color: #5df0b0; text-shadow: 0 4px 0 #033a29; }
  .lvl.casi { color: var(--q-sol); text-shadow: 0 4px 0 #8a4a05; }
  .lvl.repetir { color: #ff8a99; text-shadow: 0 4px 0 #5e0f33; }
  .hint { font: 800 30px var(--q-font-body); color: var(--q-papel2); }
  .again { display: flex; gap: 20px; margin-top: 4px; }
  .skip { margin-top: 6px; padding: 10px 26px; border: 0; border-radius: 16px; cursor: pointer; font: 800 26px var(--q-font-body); color: var(--q-nuit); background: var(--q-papel2); min-height: 64px; }
  .self { display: grid; gap: 14px; justify-items: center; margin-top: 8px; }
  .say { margin: 0; font: 900 34px var(--q-font-body); color: var(--q-papel); }
  .note { margin: 0; font: 800 24px var(--q-font-body); color: var(--q-sol); }
  .three { display: flex; gap: 20px; }
  .ev { display: flex; align-items: center; justify-content: safe center; gap: 10px; min-width: 220px; height: 100px; border: 0; border-radius: 26px; cursor: pointer; font: 400 40px/1 var(--q-font-title); color: #fff; touch-action: manipulation; transition: transform 0.06s, box-shadow 0.06s; }
  .ev:active:not(:disabled) { transform: translateY(7px); }
  .good { background: linear-gradient(180deg, #5df0b0, #0e9f6e); box-shadow: 0 9px 0 #033a29; }
  .mid { background: linear-gradient(180deg, #ffe08a, var(--q-sol2)); color: var(--q-nuit); box-shadow: 0 9px 0 #8a4a05; }
  .bad { background: linear-gradient(180deg, #ff8a99, #d93472); box-shadow: 0 9px 0 #5e0f33; }
  .ev:disabled { opacity: 0.5; }
</style>
