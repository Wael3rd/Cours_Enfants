<script lang="ts">
  /** Sprint 100 m : piste, coureur de profil + fantome translucide (record perso), 10 calculs, chrono, puis medaille. */
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { AnswerEntry } from '../lib/entry.svelte.ts';
  import { cine, preload } from '../lib/cine.ts';
  import { kitColors } from '../lib/kit.ts';
  import { sfx, haptic, say } from '../lib/sound.ts';
  import { SPRINT_LENGTH } from '../engine/index.ts';
  import type { Question, Session } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import Keypad from '../ui/Keypad.svelte';
  import CalcPanel from '../ui/CalcPanel.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import PlayerSide from '../art/PlayerSide.svelte';

  const kit = kitColors();
  const look = app.state.look;
  const entry = new AnswerEntry();
  const ghostCum: number[] = [...app.state.profile.sprint.ghost];
  const hasGhost = ghostCum.length >= SPRINT_LENGTH;

  let s: Session | undefined;
  let q = $state<Question | null>(null);
  let calcState = $state<'idle' | 'ok' | 'bad'>('idle');
  let locked = $state(true);
  let count = $state<string | null>(null);
  let answered = $state(0);
  let speed = $state(0.4);
  let delta = $state<{ text: string; good: boolean } | null>(null);
  let penalty = $state(false);
  let showQuit = $state(false);

  let calc: CalcPanel | undefined = $state();
  let runner: HTMLDivElement | undefined = $state();
  let ghost: HTMLDivElement | undefined = $state();
  let chrono: HTMLElement | undefined = $state();
  let track: HTMLDivElement | undefined = $state();
  let trackW = $state(700);
  let alive = true;
  let baseMs = 0; // temps cumule (reponses + penalites) avant la question en cours
  let running = false;
  let t0 = 0;
  let raf = 0;
  const RUNNER_W = 130;
  const maxX = $derived(Math.max(0, trackW - RUNNER_W - 120));
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const fmt = (ms: number) => `${(ms / 1000).toFixed(1).replace('.', ',')}`;

  /** Position du fantome (0..1) au temps t : interpolation lineaire entre ses temps de passage. */
  function ghostPos(t: number): number {
    let prevT = 0;
    for (let i = 0; i < SPRINT_LENGTH; i++) {
      const gt = ghostCum[i];
      if (t <= gt) return (i + (t - prevT) / Math.max(1, gt - prevT)) / SPRINT_LENGTH;
      prevT = gt;
    }
    return 1;
  }
  function tickLoop() {
    if (!running) return;
    const now = baseMs + (q ? entry.elapsed : 0);
    if (chrono) chrono.textContent = fmt(now);
    if (hasGhost && ghost) gsap.set(ghost, { x: ghostPos(now) * maxX });
    raf = requestAnimationFrame(tickLoop);
  }

  onMount(() => {
    preload('medal', 'trophy', 'card-pack');
    void begin();
    return () => { alive = false; cancelAnimationFrame(raf); };
  });

  async function begin() {
    s = app.start('sprint');
    say('sprint_intro');
    await wait(3600);
    if (!alive) return;
    for (const c of ['3', '2', '1']) {
      count = c; sfx('tick'); haptic('tap');
      if (runner) gsap.fromTo('.count', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'cePunch' });
      await wait(650);
    }
    count = 'GO !';
    sfx('whistle-short');
    say('sprint_go');
    await wait(450);
    count = null;
    running = true;
    next();
    tickLoop();
  }

  function next() {
    if (!s || !alive) return;
    q = s.next();
    if (!q) return void finish();
    calcState = 'idle';
    entry.reset(q.digits);
    locked = false;
    penalty = false;
  }
  function onDigit(d: string) {
    if (!locked && entry.push(d)) void submit();
  }
  async function submit() {
    if (!s || !q) return;
    locked = true;
    const fb = s.submit(entry.number, entry.elapsed);
    answered = fb.index + 1;
    const sp = fb.sprint!;
    baseMs = sp.elapsedMs;
    speed = 2.6;
    if (runner) gsap.to(runner, { x: (answered / SPRINT_LENGTH) * maxX, duration: 0.38, ease: 'power2.out', overwrite: 'auto', onComplete: () => { speed = 1.6; } });
    if (fb.correct) {
      calcState = 'ok'; sfx('correct-pip'); haptic('good');
    } else {
      calcState = 'bad'; sfx('wrong-soft'); haptic('tap'); penalty = true; calc?.nudge();
    }
    if (sp.leadMs !== null) delta = { text: `${sp.leadMs >= 0 ? '+' : '−'}${fmt(Math.abs(sp.leadMs))} s`, good: sp.leadMs >= 0 };
    await wait(fb.correct ? 260 : 520);
    if (alive) next();
  }

  async function finish() {
    if (!s) return;
    running = false;
    locked = true;
    cancelAnimationFrame(raf);
    const result = app.finishSession(s);
    sfx('whistle-triple');
    if (result.medal) {
      say(`medal_${result.medal}`);
      await cine('medal', { medal: result.medal, time: `${fmt(result.totalMs ?? 0)} s`, record: !!result.isRecord });
    } else {
      say('medal_none');
    }
    nav.showRewards({ result, from: 'sprint' });
  }
  function quit() {
    running = false;
    if (s) app.finishSession(s);
    nav.go('home');
  }
</script>

<Stage>
  <StadiumBackdrop live={false} />
  <div class="shade"></div>
  <div class="sp">
    <div class="left">
      <div class="head">
        <div class="chrono disp num"><span bind:this={chrono}>0,0</span><small>s</small></div>
        <div class="dots" aria-label="{answered} sur {SPRINT_LENGTH}">{#each Array.from({ length: SPRINT_LENGTH }, (_, i) => i) as i}<i class:on={i < answered}></i>{/each}</div>
        {#if delta}<div class="delta disp" class:good={delta.good}>{delta.text}</div>{/if}
      </div>

      <div bind:this={track} class="track" bind:clientWidth={trackW}>
        <div class="lane l1"></div><div class="lane l2"></div>
        <div class="start"></div><div class="finish"></div>
        {#if hasGhost}<div bind:this={ghost} class="run ghost"><PlayerSide primary={kit.primary} secondary={kit.secondary} skin={look.skin} hair={look.hair} hairColor={look.hairColor} ghost speed={1.4} width={RUNNER_W} /></div>{/if}
        <div bind:this={runner} class="run me"><PlayerSide primary={kit.primary} secondary={kit.secondary} shoe={kit.shoe} skin={look.skin} hair={look.hair} hairColor={look.hairColor} number={look.number} {speed} width={RUNNER_W} /></div>
        {#if count}<div class="count disp">{count}</div>{/if}
        {#if penalty}<div class="pen disp">+3 s</div>{/if}
      </div>

      <div class="mid">{#if q && !count}<CalcPanel bind:this={calc} text={q.text} value={entry.value} digits={entry.digits} status={calcState} />{/if}</div>
    </div>
    <div class="right">
      <div class="quit"><GameButton size="icon" variant="ghost" label="Quitter" onclick={() => (showQuit = true)}>✕</GameButton></div>
      <Keypad ondigit={onDigit} onback={() => entry.back()} disabled={locked} />
    </div>
  </div>
  {#if showQuit}
    <div class="modal" role="dialog" aria-label="Quitter le sprint ?"><div class="card"><div class="disp title">On arrête le sprint ?</div>
      <div class="row"><GameButton variant="pitch" size="lg" onclick={() => (showQuit = false)}>Continuer</GameButton><GameButton variant="ghost" size="lg" onclick={quit}>Quitter</GameButton></div></div></div>
  {/if}
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.55), rgba(7, 12, 43, 0.7)); }
  .sp { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); gap: 20px; padding: max(14px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); }
  .left { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .head { display: flex; align-items: center; gap: 22px; height: 78px; }
  .chrono { display: flex; align-items: baseline; gap: 6px; font-size: 4.6rem; line-height: 1; min-width: 190px; padding: 0 22px; border-radius: 16px; background: rgba(7, 12, 43, 0.85); border: 3px solid rgba(255, 255, 255, 0.5); transform: skewX(-8deg); }
  .chrono small { font-size: 2rem; opacity: 0.8; }
  .dots { display: flex; gap: 8px; }
  .dots i { width: 22px; height: 22px; border-radius: 50%; background: rgba(255, 255, 255, 0.25); transition: transform 0.2s var(--ease-pop); }
  .dots i.on { background: var(--jaune); transform: scale(1.15); }
  .delta { font-size: 2.2rem; padding: 4px 16px; border-radius: 12px; background: rgba(7, 12, 43, 0.8); color: #9FB4FF; }
  .delta.good { color: #5CF08C; }
  .track { position: relative; height: clamp(230px, 34vh, 290px); border-radius: 22px; overflow: hidden; background: #B5451B; border: 4px solid rgba(255, 255, 255, 0.85); box-shadow: 0 10px 0 rgba(60, 20, 5, 0.7), 0 22px 40px rgba(0, 0, 0, 0.45); }
  .lane { position: absolute; left: 0; right: 0; height: 50%; background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0 56px, transparent 56px 112px); }
  .l1 { top: 0; border-bottom: 5px solid #fff; background-color: #C85A28; }
  .l2 { bottom: 0; background-color: #B84C1E; }
  .start { position: absolute; left: 120px; top: 0; bottom: 0; width: 6px; background: #fff; opacity: 0.8; }
  .finish { position: absolute; right: 26px; top: 0; bottom: 0; width: 34px; background: conic-gradient(#fff 25%, #0A1030 0 50%, #fff 0 75%, #0A1030 0) 0 0 / 34px 34px; }
  .run { position: absolute; left: 0; will-change: transform; line-height: 0; }
  .run.ghost { top: 0; margin-top: -26px; }
  .run.me { bottom: -22px; }
  .run { margin-left: -4px; }
  .count { position: absolute; inset: 0; display: grid; place-items: center; font-size: 9rem; color: var(--jaune); -webkit-text-stroke: 8px #0A1030; paint-order: stroke fill; }
  .pen { position: absolute; right: 70px; top: 10px; font-size: 2.2rem; color: #fff; background: var(--corail); padding: 2px 14px; border-radius: 10px; }
  .mid { flex: 1; display: grid; place-items: center; min-height: 0; }
  .right { position: relative; display: flex; align-items: center; justify-content: center; }
  .quit { position: absolute; top: 0; right: 0; }
  .modal { position: absolute; inset: 0; z-index: 20; display: grid; place-items: center; background: rgba(7, 12, 43, 0.78); }
  .card { display: flex; flex-direction: column; gap: 26px; align-items: center; padding: 34px 44px; border-radius: 28px; background: var(--nuit2); border: 4px solid rgba(255, 255, 255, 0.8); }
  .title { font-size: 3rem; }
  .row { display: flex; gap: 22px; }
  @media (orientation: portrait) { .sp { grid-template-columns: 1fr; grid-template-rows: 1fr auto; } }
</style>
