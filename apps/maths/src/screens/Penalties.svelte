<script lang="ts">
  /** Tirs au but : cage + gardien, 5 tirs sur ses faits les plus durs. Fluent = but, juste mais lent = arret spectaculaire (sans honte), faux = gardien capte. */
  import { onMount } from 'svelte';
  import { gsap, burst } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { AnswerEntry } from '../lib/entry.svelte.ts';
  import { cine, preload } from '../lib/cine.ts';
  import { kitColors } from '../lib/kit.ts';
  import { sfx, haptic, say, sayVariant } from '../lib/sound.ts';
  import type { Question, Session } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import Keypad from '../ui/Keypad.svelte';
  import CalcPanel from '../ui/CalcPanel.svelte';
  import Gauge from '../ui/Gauge.svelte';
  import HintVisual from '../ui/HintVisual.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import GoalNet from '../art/GoalNet.svelte';
  import Keeper from '../art/Keeper.svelte';
  import Ball from '../art/Ball.svelte';

  const kit = kitColors();
  const entry = new AnswerEntry();
  const GW = 600; // largeur de la cage
  const k = GW / 900;

  let s: Session | undefined;
  let q = $state<Question | null>(null);
  let calcState = $state<'idle' | 'ok' | 'bad'>('idle');
  let locked = $state(true);
  let shots = $state<('goal' | 'save' | 'caught' | null)[]>([null, null, null, null, null]);
  let kpose = $state<'attente' | 'plongeon' | 'celebration' | 'decu'>('attente');
  let kflip = $state(false);
  let tag = $state<{ text: string; cls: string } | null>(null);
  let hint = $state<NonNullable<ReturnType<Session['hint']>> | null>(null);
  let showQuit = $state(false);
  let calc: CalcPanel | undefined = $state();
  let gauge: Gauge | undefined = $state();
  let keeperEl: HTMLDivElement | undefined = $state();
  let ballEl: HTMLDivElement | undefined = $state();
  let scene: HTMLDivElement | undefined = $state();
  let alive = true;
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  onMount(() => {
    preload('trophy', 'card-pack');
    void begin();
    return () => { alive = false; };
  });

  async function begin() {
    s = app.start('penalties');
    say('penalties_intro');
    await wait(4200);
    if (alive) next();
  }

  function resetScene() {
    kpose = 'attente'; kflip = false;
    if (keeperEl) gsap.set(keeperEl, { x: 0, y: 0, rotation: 0 });
    if (ballEl) gsap.set(ballEl, { x: 0, y: 0, scale: 1, opacity: 1 });
    tag = null;
  }
  function next() {
    if (!s || !alive) return;
    q = s.next();
    if (!q) return void finish();
    hint = null;
    resetScene();
    calcState = 'idle';
    entry.reset(q.digits);
    locked = false;
    gauge?.start(s.T);
  }
  function onDigit(d: string) {
    if (!locked && entry.push(d)) void submit();
  }

  /** Cible dans la cage (px, repere de la scene) : [x, y]. */
  const target = (side: -1 | 0 | 1, top: boolean): [number, number] => [(450 + side * 190) * k, (top ? 160 : 400) * k];

  async function submit() {
    if (!s || !q) return;
    locked = true;
    gauge?.stop();
    const idx = shots.findIndex((x) => x === null);
    const fb = s.submit(entry.number, entry.elapsed);
    const side: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
    let kind: 'goal' | 'save' | 'caught';
    if (!fb.correct) kind = 'caught'; else if (fb.fluent) kind = 'goal'; else kind = 'save';
    calcState = fb.correct ? 'ok' : 'bad';
    haptic(fb.correct ? 'good' : 'tap');

    const [bx0, by0] = [450 * k, 560 * k]; // point de penalty
    void bx0; void by0;
    const tl = gsap.timeline();
    sfx('kick');
    if (kind === 'goal') {
      const [tx, ty] = target(side, true);
      // gardien plonge du mauvais cote
      kpose = 'plongeon'; kflip = side > 0;
      tl.to(keeperEl!, { x: -side * 150 * k * 1.4, y: -10, rotation: -side * 10, duration: 0.45, ease: 'power2.out' }, 0.05);
      tl.to(ballEl!, { x: tx - 450 * k, y: ty - 470 * k, scale: 0.55, duration: 0.42, ease: 'power1.in' }, 0);
      tl.add(() => { sfx('ball-net'); sfx('crowd-goal'); sayVariant('pen_goal'); }, 0.42);
    } else if (kind === 'save') {
      const [tx, ty] = target(side, true);
      kpose = 'plongeon'; kflip = side < 0;
      tl.to(keeperEl!, { x: side * 160 * k * 1.3, y: -34, rotation: side * 8, duration: 0.4, ease: 'power3.out' }, 0.05);
      tl.to(ballEl!, { x: tx - 450 * k, y: ty - 470 * k, scale: 0.55, duration: 0.38, ease: 'power1.in' }, 0);
      tl.to(ballEl!, { x: tx - 450 * k + side * 120, y: -40, scale: 0.5, opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.4);
      tl.add(() => { sfx('crowd-ohhh'); sfx('ball-hit'); sayVariant('pen_save'); }, 0.4);
    } else {
      // gardien capte : tir plein centre
      tl.to(ballEl!, { x: 0, y: -330 * k, scale: 0.6, duration: 0.45, ease: 'power1.in' }, 0);
      tl.add(() => { kpose = 'celebration'; sfx('ball-hit', 0.7); sayVariant('pen_caught'); }, 0.45);
      tl.to(keeperEl!, { y: -10, duration: 0.15, yoyo: true, repeat: 1 }, 0.45);
    }
    await tl.then();
    shots[idx] = kind;
    tag = kind === 'goal' ? { text: 'BUT !', cls: 'goal' } : kind === 'save' ? { text: 'ARRÊT DE OUF !', cls: 'save' } : { text: 'CAPTÉ !', cls: 'caught' };
    gsap.fromTo('.tag', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'cePunch' });
    if (kind === 'goal' && scene) {
      const r = scene.getBoundingClientRect();
      burst(document.body, r.left + r.width / 2, r.top + r.height * 0.45, { count: 26, colors: [kit.primary, '#FFD23F', '#fff'] });
    }
    if (kind === 'caught') {
      calc?.nudge();
      hint = fb.hint;
      await wait(fb.modelMs + 200);
    } else {
      await wait(900);
    }
    if (alive) next();
  }

  async function finish() {
    if (!s) return;
    locked = true;
    gauge?.stop();
    const result = app.finishSession(s);
    sfx('whistle-triple');
    say('pen_end');
    await wait(600);
    nav.showRewards({ result, from: 'penalties' });
  }
  function quit() {
    if (s) app.finishSession(s);
    nav.go('home');
  }
</script>

<Stage>
  <StadiumBackdrop live={false} />
  <div class="shade"></div>
  <div class="pn">
    <div class="left">
      <div class="head">
        <div class="shots" aria-label="Tirs">
          {#each shots as r}<span class="shot" class:goal={r === 'goal'} class:save={r === 'save'} class:caught={r === 'caught'}>{#if r === 'goal'}<svg viewBox="0 0 48 48" width="32" height="32"><path d="M8 25 l11 11 21 -24" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>{:else if r}<svg viewBox="0 0 48 48" width="26" height="26"><circle cx="24" cy="24" r="8" fill="#fff"/></svg>{/if}</span>{/each}
        </div>
      </div>
      <div bind:this={scene} class="scene" style:width="{GW}px" style:height="{GW * 0.62}px">
        <GoalNet width={GW} />
        <div bind:this={keeperEl} class="keeper"><Keeper width={150} pose={kpose} flip={kflip} primary="#17B26A" /></div>
        <div bind:this={ballEl} class="ball"><Ball width={46} /></div>
        {#if tag}<div class="tag disp {tag.cls}">{tag.text}</div>{/if}
      </div>
      <div class="mid">
        {#if q}<div class="calcw"><CalcPanel bind:this={calc} text={q.text} value={entry.value} digits={entry.digits} status={calcState} />
          {#if hint}<div class="hintcard"><HintVisual {hint} colorA={kit.primary} compact /></div>{/if}</div>{/if}
      </div>
      <div class="bottom"><Gauge bind:this={gauge} /></div>
    </div>
    <div class="right">
      <div class="quit"><GameButton size="icon" variant="ghost" label="Quitter" onclick={() => (showQuit = true)}>✕</GameButton></div>
      <Keypad ondigit={onDigit} onback={() => entry.back()} disabled={locked} />
    </div>
  </div>
  {#if showQuit}
    <div class="modal" role="dialog" aria-label="Quitter ?"><div class="card"><div class="disp title">On arrête les tirs ?</div>
      <div class="row"><GameButton variant="pitch" size="lg" onclick={() => (showQuit = false)}>Continuer</GameButton><GameButton variant="ghost" size="lg" onclick={quit}>Quitter</GameButton></div></div></div>
  {/if}
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.5), rgba(7, 12, 43, 0.72)); }
  .pn { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); gap: 20px; padding: max(12px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); }
  .left { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
  .head { align-self: stretch; display: flex; height: 54px; align-items: center; }
  .shots { display: flex; gap: 12px; }
  .shot { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); border: 3px solid rgba(255, 255, 255, 0.5); }
  .shot.goal { background: #1BBF5E; border-color: #fff; }
  .shot.save { background: #35D6FF; border-color: #fff; }
  .shot.caught { background: #7C8BC9; border-color: #fff; }
  .scene { position: relative; flex: none; }
  .keeper { position: absolute; left: 50%; bottom: 14%; margin-left: -75px; will-change: transform; transform-origin: 50% 90%; }
  .ball { position: absolute; left: 50%; bottom: -2%; margin-left: -23px; will-change: transform; }
  .tag { position: absolute; left: 0; right: 0; top: 30%; text-align: center; font-size: 5.5rem; line-height: 1; color: var(--jaune); -webkit-text-stroke: 7px #0A1030; paint-order: stroke fill; pointer-events: none; will-change: transform, opacity; }
  .tag.save { color: var(--cyan); font-size: 4.4rem; }
  .tag.caught { color: #fff; font-size: 4.6rem; }
  .mid { flex: 1; display: grid; place-items: center; min-height: 0; align-self: stretch; }
  .calcw { position: relative; display: grid; place-items: center; }
  .hintcard { position: absolute; inset: -14px -30px; display: flex; flex-direction: column; justify-content: center; padding: 8px 18px; border-radius: 24px; background: rgba(7, 12, 43, 0.93); border: 4px solid rgba(255, 255, 255, 0.85); }
  .bottom { align-self: stretch; padding-bottom: 4px; }
  .right { position: relative; display: flex; align-items: center; justify-content: center; }
  .quit { position: absolute; top: 0; right: 0; }
  .modal { position: absolute; inset: 0; z-index: 20; display: grid; place-items: center; background: rgba(7, 12, 43, 0.78); }
  .card { display: flex; flex-direction: column; gap: 26px; align-items: center; padding: 34px 44px; border-radius: 28px; background: var(--nuit2); border: 4px solid rgba(255, 255, 255, 0.8); }
  .title { font-size: 3rem; }
  .row { display: flex; gap: 22px; }
  @media (orientation: portrait) { .pn { grid-template-columns: 1fr; grid-template-rows: 1fr auto; } }
</style>
