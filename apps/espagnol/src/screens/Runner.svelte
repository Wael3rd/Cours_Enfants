<script lang="ts" module>
  import type { Step } from '../content/schema';
  import type { MissionExercise } from '../engine/mission';
  import type { RunEntry } from '../engine/progress';
  import type { StatId } from '../content/schema';

  export interface RunStep { step: Step; ex?: MissionExercise }
  export interface RunSummary {
    run: RunEntry[];
    xp: number;
    xpByStat: Partial<Record<StatId, number>>;
    newItems: string[];
    levelUps: { stat?: StatId; player?: boolean; level: number }[];
    hints: number;
    wrong: number;
    total: number;
  }
</script>

<script lang="ts">
  /**
   * Coque de jeu : joue une suite d'etapes (quete, desafio, mision del dia). Une etape = un composant ; la coque corrige
   * (gradeStep), applique l'XP / la repetition espacee (applyStepResult), affiche le feedback, la Pista, la progression.
   * Mode 'boss' : la scene du combat (BossScene) reagit a chaque reponse.
   */
  import { onDestroy, onMount, tick } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content } from '../engine/data';
  import { ACCENT_WARNING, applyStepResult, gradeStep, NOT_GRADED, runEntry, statLevel, withItems, type Answer, type StepResult } from '../engine';
  import { collectAudioKeysOf } from '../engine/audioKeys';
  import { nav } from '../ui/nav.svelte';
  import { ui } from '../ui/ui.svelte';
  import { hintText } from '../steps/common';
  import { sfx } from '../services/sfx';
  import { preloadHablas } from '../services/audio';
  import { music } from '../services/music';
  import { flyXp } from '../ui/fx';
  import { STAT_INFO, STAT_ORDER } from '../ui/stats';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';
  import SombraFigure from '../art/SombraFigure.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import RoundBtn from '../ui/RoundBtn.svelte';
  import Icon from '../ui/Icon.svelte';
  import HintBubble from '../ui/HintBubble.svelte';
  import BossScene from '../ui/BossScene.svelte';
  import Flashcard from '../steps/Flashcard.svelte';
  import MatchImage from '../steps/MatchImage.svelte';
  import ListenChoose from '../steps/ListenChoose.svelte';
  import Dictado from '../steps/Dictado.svelte';
  import FillBlank from '../steps/FillBlank.svelte';
  import ReorderWords from '../steps/ReorderWords.svelte';
  import Conjugar from '../steps/Conjugar.svelte';
  import DialogueChoice from '../steps/DialogueChoice.svelte';
  import ReadAnswer from '../steps/ReadAnswer.svelte';
  import Speak from '../steps/Speak.svelte';
  import TrueFalse from '../steps/TrueFalse.svelte';
  import GrammarCard from '../steps/GrammarCard.svelte';
  import CinematicRef from '../steps/CinematicRef.svelte';
  import WriteFree from '../steps/WriteFree.svelte';

  interface Props {
    title: string;
    steps: RunStep[];
    mode: 'quest' | 'boss' | 'mission';
    boss?: { vidas: number; nombre?: string };
    /** indice de depart (tests / reprise) */
    from?: number;
    onfinish: (s: RunSummary) => void;
    onexit: () => void;
  }
  let { title, steps, mode, boss, from = 0, onfinish, onexit }: Props = $props();

  const COMP = {
    flashcard: Flashcard,
    match_image: MatchImage,
    listen_choose: ListenChoose,
    dictado: Dictado,
    fill_blank: FillBlank,
    reorder_words: ReorderWords,
    conjugar: Conjugar,
    dialogue_choice: DialogueChoice,
    read_answer: ReadAnswer,
    speak: Speak,
    true_false: TrueFalse,
    grammar_card: GrammarCard,
    cinematic_ref: CinematicRef,
    write_free: WriteFree,
  } as const;

  // ───────── etat de la partie ─────────
  const initial = steps.slice(from);
  let queue = $state<RunStep[]>([...initial]);
  let idx = $state(0);
  let result = $state<StepResult | null>(null);
  let hints = $state(0);
  let hintOpen = $state(false);
  let confirmExit = $state(false);
  let intro = $state(mode === 'boss');
  const run: RunEntry[] = [];
  const seen = new Set<string>();
  const requeued = new Set<string>();
  const sum: RunSummary = { run, xp: 0, xpByStat: {}, newItems: [], levelUps: [], hints: 0, wrong: 0, total: initial.length };
  let lastGain = $state<{ xp: number; bonus: number } | null>(null);
  let toast = $state('');
  let feedbackEl: HTMLElement | undefined = $state();
  let xpPill: HTMLElement | undefined = $state();
  let orbEls: Partial<Record<StatId, HTMLElement>> = {};
  let bossScene: BossScene | undefined = $state();
  let stepArea: HTMLElement | undefined = $state();
  let mood = $state<'happy' | 'sad'>('happy');
  let msg = $state('');

  // boss : cœurs et vie de la Sombra
  const maxLives = boss?.vidas ?? 3;
  let lives = $state(maxLives);
  const gradedTotal = initial.filter((r) => !NOT_GRADED.includes(r.step.tipo)).length;
  let solved = $state(0);
  const hp = $derived(gradedTotal ? 1 - solved / gradedTotal : 0);

  const cur = $derived(queue[idx]);
  const Comp = $derived(cur ? (COMP[cur.step.tipo] as never as typeof Flashcard) : null);
  const graded = $derived(cur ? !NOT_GRADED.includes(cur.step.tipo) : false);
  const full = $derived(cur?.step.tipo === 'cinematic_ref');
  const progress = $derived(Math.min(1, (idx + (result ? 1 : 0)) / Math.max(1, queue.length)));

  onMount(() => {
    music.setMode('quest');
    nav.guard = () => {
      confirmExit = true;
      return false;
    };
    if (intro) {
      sfx('levelbig', 0.6);
      setTimeout(() => (intro = false), 2800);
    }
  });
  onDestroy(() => {
    nav.guard = null;
  });

  // expose l'etape courante pour les tests e2e (?debug)
  $effect(() => {
    if (typeof window !== 'undefined' && (window as unknown as { __q?: unknown }).__q) { (window as unknown as { __qstep?: unknown }).__qstep = cur?.step; (window as unknown as { __qidx?: number }).__qidx = idx; }
  });

  // prechauffe les voix de l'etape courante et de la suivante
  $effect(() => {
    const keys = [cur, queue[idx + 1]].flatMap((r) => (r ? collectAudioKeysOf(r.step) : []));
    preloadHablas(keys, true);
  });

  const CORRECT = ['¡Muy bien!', '¡Perfecto!', '¡Genial!', '¡Excelente!', '¡Eso es!', '¡Fantástico!'];
  const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

  function describe(r: StepResult): string {
    if (r.speech === 'logrado') return '¡Logrado!';
    if (r.speech === 'casi') return '¡Casi!';
    if (r.speech === 'repetir') return 'Otra vez, ¡tú puedes!';
    if (r.speech === 'autoevaluacion') return r.outcome === 'wrong' ? '¡A seguir practicando!' : '¡Anotado!';
    if (r.outcome === 'correct') return pick(CORRECT);
    if (r.outcome === 'partial') return r.warnings.length ? '¡Casi!' : '¡Bien!';
    return 'Casi… ¡a la próxima!';
  }

  function onanswer(a: Answer) {
    if (result || !cur) return;
    const rs = cur;
    const step = rs.step;
    let r = gradeStep(step, a);
    if (rs.ex) r = withItems(r, rs.ex);
    result = r;
    const out = game.mutate((s) => applyStepResult(content, s, step, r, { hints, fields: a.tipo === 'write_free' ? a.fields : undefined }));
    sum.xp += out.gain.xp;
    sum.xpByStat[out.gain.stat] = (sum.xpByStat[out.gain.stat] ?? 0) + out.gain.xp;
    for (const k of out.newItems) if (!sum.newItems.includes(k)) sum.newItems.push(k);
    sum.levelUps.push(...out.levelUps);
    sum.hints += hints;
    lastGain = { xp: out.gain.xp, bonus: out.gain.bonus };
    if (!seen.has(step.id)) {
      seen.add(step.id);
      run.push(runEntry(step, r, hints));
    }
    const ok = r.outcome !== 'wrong';
    if (!ok) sum.wrong += 1;
    msg = describe(r);
    mood = ok ? 'happy' : 'sad';

    if (!graded) {
      // etapes de lecture / decouverte : pas de feedback, on enchaine
      if (out.gain.xp) flyToStat(out.gain.stat, `+${out.gain.xp}`);
      setTimeout(next, step.tipo === 'cinematic_ref' ? 50 : 350);
      return;
    }
    sfx(ok ? (r.outcome === 'correct' ? 'ok' : 'pip') : 'wrong');
    haptic(ok ? 'good' : 'bad');
    if (mode === 'boss') void combat(ok, requeued.has(step.id));
    else if (ok && r.outcome === 'correct' && r.score >= 0.99) streakFx();
    tick().then(() => {
      if (feedbackEl && !prefersReducedMotion()) gsap.fromTo(feedbackEl, { y: 200 }, { y: 0, duration: 0.45, ease: 'back.out(1.5)' });
      setTimeout(() => out.gain.xp && flyToStat(out.gain.stat, `+${out.gain.xp}`), 450);
    });
    for (const lu of out.levelUps) if (lu.stat) setTimeout(() => showToast(`¡${STAT_INFO[lu.stat!].label}, nivel ${lu.level}!`), 1200);
  }

  let won = false;
  let streak = 0;
  function streakFx() {
    streak += 1;
    if (streak === 3) sfx('streak3', 0.7);
    if (streak === 5) sfx('streak5', 0.7);
  }

  function flyToStat(stat: StatId, text: string) {
    flyXp(xpPill ?? feedbackEl ?? stepArea, orbEls[stat], text, STAT_INFO[stat].color);
  }
  function showToast(t: string) {
    toast = t;
    sfx('level', 0.6);
    setTimeout(() => (toast = ''), 2400);
  }

  async function combat(ok: boolean, wasRetry: boolean) {
    if (ok) {
      solved += 1;
      await bossScene?.cast();
    } else {
      await bossScene?.strike();
      lives = Math.max(0, lives - 1);
      if (lives === 0) {
        // pas de game over : le Quetzal se reprend, la partie continue
        setTimeout(() => {
          lives = maxLives;
          bossScene?.refill();
          showToast('¡El Quetzal recupera fuerzas!');
        }, 700);
      }
      // la Sombra se resiste : on reposera cette etape plus tard (une seule fois)
      if (!wasRetry && cur && !requeued.has(cur.step.id)) {
        requeued.add(cur.step.id);
        queue = [...queue, { ...cur }];
      }
    }
  }

  async function next() {
    hintOpen = false;
    const nxt = queue[idx + 1];
    // victoire : la Sombra se dissout avant la scene finale (plume) ou la fin de la partie
    if (mode === 'boss' && !won && hp <= 0.001 && (!nxt || NOT_GRADED.includes(nxt.step.tipo))) {
      won = true;
      await bossScene?.defeat();
    }
    result = null;
    hints = 0;
    lastGain = null;
    if (!nxt) {
      onfinish(sum);
      return;
    }
    idx += 1;
  }

  function openHint() {
    if (!cur) return;
    hints += 1;
    hintOpen = true;
  }
  const hintContent = $derived(cur ? hintText(cur.step) || cur.step.id : '');
  function toggleLento() {
    ui.lento = !ui.lento;
    sfx('select', 0.7);
    haptic('tap');
  }

  const startingBoss = $derived(mode === 'boss');
</script>

<div class="scr scr-bg run" class:boss={startingBoss}>
  <header class="top">
    <RoundBtn icon="cross" label="Salir" variant="nuit" size={64} onclick={() => (confirmExit = true)} />
    <div class="ttl">
      <b>{title}</b>
      {#if mode !== 'boss'}
        <span class="prog"><i style:transform="scaleX({progress})"></i></span>
      {:else}
        <span class="sub">{Math.min(solved + 1, gradedTotal)} / {gradedTotal}</span>
      {/if}
    </div>
    <div class="orbs">
      {#each STAT_ORDER as k}
        <span class="orb" bind:this={orbEls[k]} style:--c={STAT_INFO[k].color} title={STAT_INFO[k].label}>
          <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><path d={STAT_INFO[k].icon} transform="translate(7 7) scale(.7)" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <i>{statLevel(game.state, k).level}</i>
        </span>
      {/each}
    </div>
    <RoundBtn icon="turtle" label="Voz lenta" variant="turquesa" size={64} active={ui.lento} onclick={toggleLento} />
    <RoundBtn icon="bulb" label="Pista" variant="sol" size={64} badge={hints || ''} disabled={!cur || full} onclick={openHint} />
  </header>

  {#if mode === 'boss'}
    <BossScene bind:this={bossScene} {hp} {lives} {maxLives} name={boss?.nombre} />
  {/if}

  <main class="area" bind:this={stepArea}>
    {#if cur && Comp}
      {#key `${idx}:${cur.step.id}`}
        <div class="stepwrap" class:fbshown={!!result && graded}>
          <Comp step={cur.step as never} {result} {onanswer} onhint={openHint} />
        </div>
      {/key}
    {/if}
  </main>

  {#if result && graded}
    <div class="fbk {result.outcome}" bind:this={feedbackEl} role="status">
      <div class="mood">
        {#key result}<QuetzalMascot pose={mood === 'happy' ? 'happy' : 'sad'} width={74} idle={false} />{/key}
      </div>
      <div class="txt">
        <h3>{msg}</h3>
        {#each result.warnings as w}<p class="warn">{w === ACCENT_WARNING ? ACCENT_WARNING : w}</p>{/each}
        {#if result.outcome !== 'correct' && result.expected && result.speech !== 'autoevaluacion'}
          <p class="exp">{result.outcome === 'wrong' ? 'La respuesta:' : 'Mejor:'} <b>{result.expected}</b></p>
        {/if}
      </div>
      <div class="xp" bind:this={xpPill}>
        {#if lastGain && lastGain.xp > 0}<b>+{lastGain.xp} XP</b>{#if lastGain.bonus > 0}<small>sin pistas</small>{/if}{/if}
      </div>
      <PrimaryButton variant={result.outcome === 'wrong' ? 'magenta' : 'quetzal'} onclick={next}>Continuar</PrimaryButton>
    </div>
  {/if}

  {#if toast}<div class="toast">{toast}</div>{/if}
  {#if hintOpen}<HintBubble text={hintContent} onclose={() => (hintOpen = false)} />{/if}

  {#if intro}
    <div class="bossintro" role="dialog" aria-label="Desafío">
      <div class="bi"><SombraFigure width={260} arm /></div>
      <h2 class="h-rpg">¡Desafío!</h2>
      <p>{title}</p>
    </div>
  {/if}

  {#if confirmExit}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="veil" onclick={() => (confirmExit = false)}>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div class="dlg" onclick={(e) => e.stopPropagation()} role="alertdialog" aria-label="Salir">
        <h3>¿Salir de la misión?</h3>
        <p>Perderás lo que has hecho en esta partida.</p>
        <div class="row">
          <PrimaryButton variant="quetzal" onclick={() => (confirmExit = false)}>Seguir jugando</PrimaryButton>
          <PrimaryButton variant="magenta" onclick={() => { nav.guard = null; onexit(); }}>Salir</PrimaryButton>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .run { z-index: 2; }
  .top { flex: none; display: flex; align-items: center; gap: 16px; padding: 10px 20px 8px; }
  .ttl { flex: 1; min-width: 0; display: grid; gap: 8px; }
  .ttl b { font: 400 30px/1 var(--q-font-title); color: var(--q-sol); text-shadow: 0 3px 0 #8a4a05; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prog { display: block; height: 16px; border-radius: 8px; overflow: hidden; background: rgba(0, 0, 0, 0.45); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 0 3px rgba(255, 200, 61, 0.7); }
  .prog i { display: block; height: 100%; width: 100%; transform-origin: 0 50%; background: linear-gradient(180deg, #7ff3e4, #19b7aa); transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.1, 1); }
  .sub { font: 900 22px var(--q-font-body); color: var(--q-papel2); }
  .orbs { display: flex; gap: 8px; }
  .orb { position: relative; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: var(--c); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.45), 0 4px 0 rgba(0, 0, 0, 0.4); will-change: transform; }
  .orb i { position: absolute; right: -6px; bottom: -6px; min-width: 24px; height: 24px; padding: 0 5px; border-radius: 12px; display: grid; place-items: center; font: 900 15px/1 var(--q-font-body); font-style: normal; color: var(--q-nuit); background: var(--q-sol); box-shadow: 0 0 0 2px var(--q-nuit); }
  .area { position: relative; flex: 1; min-height: 0; overflow: hidden; }
  .stepwrap { position: absolute; inset: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; overscroll-behavior: contain; animation: stepin 0.4s cubic-bezier(0.2, 0.9, 0.1, 1); }
  @keyframes stepin { from { transform: translateX(60px); opacity: 0; } }
  .stepwrap.fbshown { padding-bottom: 104px; }
  .fbk { position: absolute; left: 0; right: 0; bottom: 0; z-index: 20; display: flex; align-items: center; gap: 22px; padding: 8px 30px 12px 22px; min-height: 100px; will-change: transform; }
  .fbk.correct { background: linear-gradient(180deg, #2fd698, #0e9f6e); box-shadow: 0 -8px 0 #5df0b0, 0 -16px 40px rgba(0, 0, 0, 0.4); color: #02281d; }
  .fbk.partial { background: linear-gradient(180deg, #ffe08a, #ffb21e); box-shadow: 0 -8px 0 #fff3b0, 0 -16px 40px rgba(0, 0, 0, 0.4); color: #3a1d02; }
  .fbk.wrong { background: linear-gradient(180deg, #ffa3b0, #e8434f); box-shadow: 0 -8px 0 #ffd0d6, 0 -16px 40px rgba(0, 0, 0, 0.4); color: #3a0612; }
  .mood { flex: none; width: 74px; height: 84px; display: grid; place-items: end center; overflow: visible; }
  .txt { flex: 1; min-width: 0; }
  .txt h3 { margin: 0; font: 400 40px/1 var(--q-font-title); text-shadow: 0 3px 0 rgba(255, 255, 255, 0.35); }
  .txt p { margin: 4px 0 0; font: 800 24px/1.2 var(--q-font-body); }
  .txt .warn { font-weight: 900; }
  .xp { flex: none; display: grid; justify-items: center; gap: 2px; }
  .xp b { padding: 6px 20px 8px; border-radius: 999px; font: 900 32px/1 var(--q-font-body); color: #fff; background: rgba(11, 13, 42, 0.8); }
  .xp small { font: 900 18px var(--q-font-body); }
  .toast { position: absolute; left: 50%; top: 96px; transform: translateX(-50%); z-index: 40; padding: 12px 34px 14px; border-radius: 999px; font: 400 34px/1 var(--q-font-title); color: var(--q-nuit); background: linear-gradient(180deg, #ffe08a, var(--q-sol)); box-shadow: 0 6px 0 #6b3d08; animation: pop 0.4s cubic-bezier(0.2, 1.6, 0.4, 1); white-space: nowrap; }
  @keyframes pop { from { transform: translateX(-50%) scale(0.5); opacity: 0; } }
  .bossintro { position: absolute; inset: 0; z-index: 60; display: grid; place-content: center; justify-items: center; gap: 6px; background: radial-gradient(ellipse at 50% 55%, #4a2a9a, #0b0420 75%); animation: fadeout 0.5s 2.3s forwards; }
  .bossintro h2 { font-size: 110px; line-height: 1; color: #ff7aa8; text-shadow: 0 7px 0 #5e0f33; animation: slam 0.6s 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
  .bossintro p { margin: 0; font: 900 38px var(--q-font-body); color: #d6c8ff; }
  .bi { animation: rise 1.2s cubic-bezier(0.2, 0.9, 0.1, 1) both; }
  @keyframes rise { from { transform: translateY(160px) scale(0.6); opacity: 0; } }
  @keyframes slam { from { transform: scale(3); opacity: 0; } }
  @keyframes fadeout { to { opacity: 0; visibility: hidden; } }
  .veil { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; background: rgba(8, 9, 32, 0.7); }
  .dlg { padding: 34px 44px 30px; border-radius: 30px; text-align: center; background: linear-gradient(180deg, #fff3d1, var(--q-papel)); color: var(--q-nuit); box-shadow: 0 0 0 6px var(--q-sol), 0 10px 0 6px #6b3d08; }
  .dlg h3 { margin: 0 0 6px; font: 400 44px/1.1 var(--q-font-title); color: var(--q-terracotta2); }
  .dlg p { margin: 0 0 22px; font: 800 28px var(--q-font-body); }
  .row { display: flex; gap: 20px; justify-content: center; }
</style>
