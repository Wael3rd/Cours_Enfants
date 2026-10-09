<script lang="ts">
  /**
   * Match (~3 min) : score bug, mini-terrain, calcul enorme, pave geant, jauge de puissance de tir.
   * Rythme : but en jeu (<= 0,8 s) a chaque reponse fluente ; cinematique `goal` seulement pour le 1er but et le but decisif.
   */
  import { onMount } from 'svelte';
  import { gsap, burst } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { AnswerEntry } from '../lib/entry.svelte.ts';
  import { cine, preload } from '../lib/cine.ts';
  import { pickRival, teamOf } from '../lib/teams.ts';
  import { sfx, haptic, say, sayVariant } from '../lib/sound.ts';
  import type { Question, Session } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import Keypad from '../ui/Keypad.svelte';
  import CalcPanel from '../ui/CalcPanel.svelte';
  import Gauge from '../ui/Gauge.svelte';
  import Pitch from '../ui/Pitch.svelte';
  import HintVisual from '../ui/HintVisual.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import ScoreBug from '../art/ScoreBug.svelte';
  import { kitColors } from '../lib/kit.ts';

  const club = app.state.club;
  const home = teamOf(club);
  const away = pickRival(club);
  const kit = kitColors();
  const entry = new AnswerEntry();

  let s: Session | undefined;
  let q = $state<Question | null>(null);
  let calcState = $state<'idle' | 'ok' | 'bad'>('idle');
  let locked = $state(true);
  let score = $state({ goals: 0, rival: 0 });
  let idx = $state(0);
  let total = $state(30);
  let hint = $state<NonNullable<ReturnType<Session['hint']>> | null>(null);
  let showQuit = $state(false);
  let goalText = $state(false);
  let run = $state(0);
  let firstGoalDone = false;

  let calc: CalcPanel | undefined = $state();
  let gauge: Gauge | undefined = $state();
  let pitch: Pitch | undefined = $state();
  let pitchBox: HTMLDivElement | undefined = $state();
  let goalEl: HTMLDivElement | undefined = $state();
  let flash: HTMLDivElement | undefined = $state();
  let hintBox: HTMLDivElement | undefined = $state();
  let bug: HTMLDivElement | undefined = $state();
  let alive = true;

  const minute = $derived(`${Math.min(90, Math.round((idx / Math.max(1, total)) * 90))}'`);
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const fmtTime = (ms: number) => `${(ms / 1000).toFixed(1).replace('.', ',')} s`;

  onMount(() => {
    preload('goal', 'full-time', 'trophy', 'card-pack');
    void begin();
    return () => { alive = false; };
  });

  async function begin() {
    s = app.start('match');
    total = s.total;
    await cine('match-intro', { home, away });
    if (!alive) return;
    sfx('whistle-short');
    say('match_ready');
    next();
  }

  function next() {
    if (!s || !alive) return;
    q = s.next();
    if (!q) return void finish();
    hint = null;
    calcState = 'idle';
    entry.reset(q.digits);
    locked = false;
    gauge?.start(s.T);
  }

  function onDigit(d: string) {
    if (locked || !q) return;
    if (entry.push(d)) void submit();
  }

  async function submit() {
    if (!s || !q || locked) return;
    locked = true;
    gauge?.stop();
    const asked = q;
    const ms = entry.elapsed;
    const fb = s.submit(entry.number, ms);
    idx = fb.index + 1;
    if (fb.score) score = fb.score;

    if (fb.correct) {
      calcState = 'ok';
      haptic('good');
      run = fb.fluent ? run + 1 : 0;
      if (fb.goal) {
        sfx('correct');
        const p = scoreFlash();
        pitch?.advance(1);
        const decisive = fb.score!.goals > fb.score!.rival && fb.index >= fb.total - 3;
        const big = !firstGoalDone || decisive;
        firstGoalDone = true;
        void p;
        await goalInGame(fb.score!.goals);
        if (big) {
          const calcStr = asked.text.includes('?') ? asked.text.replace('?', String(asked.answer)) : `${asked.text} = ${asked.answer}`;
          await cine('goal', { name: app.state.childName, calc: calcStr, time: fmtTime(ms), scoreHome: fb.score!.goals, scoreAway: fb.score!.rival, home, away });
        }
        if (run === 4 || run === 8) sfx('combo');
      } else {
        sfx('correct-pip');
        pitch?.advance(Math.min(0.8, 0.28 * (1 + ((idx % 3) as number))));
        if (Math.random() < 0.3) sayVariant('praise');
        await wait(380);
      }
      if (fb.rivalGoal) rivalFlash();
      await wait(fb.goal ? 120 : 0);
    } else {
      run = 0;
      calcState = 'bad';
      haptic('bad');
      sfx('wrong-soft');
      calc?.nudge();
      sayVariant('error');
      hint = fb.hint;
      await wait(fb.modelMs + 150);
      if (fb.rivalGoal) rivalFlash();
    }
    if (alive) next();
  }

  /** But en jeu : tir, filet, "BUT !", foule, confettis. <= 0,8 s, la saisie suivante n'attend pas la fin. */
  async function goalInGame(goals: number) {
    void goals;
    haptic('win');
    const shot = pitch?.shoot() ?? Promise.resolve();
    sayVariant('goal');
    await shot;
    sfx('crowd-goal');
    pitch?.celebrate();
    goalText = true;
    if (goalEl) gsap.fromTo(goalEl, { scale: 0.3, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: -3, duration: 0.22, ease: 'cePunch', overwrite: true });
    if (flash) gsap.fromTo(flash, { opacity: 0.55 }, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    if (pitchBox) {
      const r = pitchBox.getBoundingClientRect();
      burst(document.body, r.right - 90, r.top + r.height / 2, { count: 22, colors: [club.primary, club.secondary, '#FFD23F', '#ffffff'] });
    }
    scoreFlash();
    setTimeout(() => {
      if (goalEl) gsap.to(goalEl, { opacity: 0, scale: 1.15, duration: 0.2, onComplete: () => { goalText = false; } });
      pitch?.reset();
    }, 380);
    await wait(420); // saisie rendue ~0,6 s apres le tir
  }

  function scoreFlash() {
    if (bug) gsap.fromTo(bug, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'cePunch', overwrite: true });
  }
  function rivalFlash() {
    sfx('crowd-ohhh', 0.5);
    if (Math.random() < 0.5) sayVariant('rival');
    if (bug) gsap.fromTo(bug, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.4)', overwrite: true });
  }

  async function finish() {
    if (!s) return;
    locked = true;
    gauge?.stop();
    const result = app.finishSession(s);
    sfx('whistle-triple');
    const win = result.outcome === 'win';
    say(win ? (Math.random() < 0.5 ? 'fulltime_win_1' : 'fulltime_win_2') : result.outcome === 'draw' ? 'fulltime_draw_1' : Math.random() < 0.5 ? 'fulltime_loss_1' : 'fulltime_loss_2');
    await cine('full-time', {
      home, away, scoreHome: result.goals ?? 0, scoreAway: result.rivalGoals ?? 0, win,
      goals: result.goals ?? 0, avgTime: result.avgMs ? fmtTime(result.avgMs) : '—', bestStreak: result.bestStreak, stars: Math.min(3, Math.ceil(result.stars / 2)),
    });
    nav.showRewards({ result, from: 'match' });
  }

  function quit() {
    if (s) app.finishSession(s);
    nav.go('home');
  }
</script>

<Stage>
  <StadiumBackdrop live={false} />
  <div bind:this={flash} class="flash"></div>
  <div class="match">
    <div class="left">
      <div class="top">
        <div bind:this={bug} class="bug"><ScoreBug {home} {away} scoreHome={score.goals} scoreAway={score.rival} clock={minute} width={500} /></div>
        {#if run >= 3}<div class="streak disp" aria-label="Série">
          <svg viewBox="0 0 24 32" width="30" height="40" aria-hidden="true"><path d="M12 0 C14 8 22 12 22 21 A10 11 0 0 1 2 21 C2 15 6 13 7 8 C9 10 10 12 10 14 C13 10 13 5 12 0Z" fill="#FF8A1F" stroke="#0A1030" stroke-width="2"/></svg>{run}
        </div>{/if}
      </div>
      <div bind:this={pitchBox} class="pitchwrap">
        <Pitch bind:this={pitch} look={app.state.look} primary={kit.primary} secondary={kit.secondary} shoe={kit.shoe} />
        {#if goalText}<div bind:this={goalEl} class="goaltext disp">BUT !</div>{/if}
      </div>
      <div class="mid">
        {#if q}
          <CalcPanel bind:this={calc} text={q.text} value={entry.value} digits={entry.digits} status={calcState} />
        {/if}
        {#if hint}
          <div bind:this={hintBox} class="hintcard"><HintVisual {hint} colorA={club.primary} compact />
            <div class="ans disp">{q?.text.includes('?') ? q.text.replace('?', String(q.answer)) : `${q?.text} = ${q?.answer}`}</div></div>
        {/if}
      </div>
      <div class="bottom"><Gauge bind:this={gauge} /></div>
    </div>
    <div class="right">
      <div class="quit"><GameButton size="icon" variant="ghost" label="Quitter" onclick={() => (showQuit = true)}>✕</GameButton></div>
      <Keypad ondigit={onDigit} onback={() => entry.back()} disabled={locked} />
    </div>
  </div>

  {#if showQuit}
    <div class="modal" role="dialog" aria-label="Quitter le match ?">
      <div class="card">
        <div class="disp title">On arrête le match ?</div>
        <div class="row">
          <GameButton variant="pitch" size="lg" onclick={() => (showQuit = false)}>Continuer</GameButton>
          <GameButton variant="ghost" size="lg" onclick={quit}>Quitter</GameButton>
        </div>
      </div>
    </div>
  {/if}
</Stage>

<style>
  .match { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); padding: max(14px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); gap: 20px; background: linear-gradient(rgba(7, 12, 43, 0.15), rgba(7, 12, 43, 0.55)); }
  .left { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .top { display: flex; align-items: center; gap: 18px; height: 78px; }
  .bug { transform-origin: 0 50%; will-change: transform; }
  .streak { display: flex; align-items: center; gap: 6px; font-size: 2.6rem; color: var(--jaune); text-shadow: 0 3px 0 #0A1030; }
  .pitchwrap { position: relative; }
  .goaltext { position: absolute; inset: 0; display: grid; place-items: center; font-size: clamp(110px, 20vh, 170px); color: var(--jaune); -webkit-text-stroke: 8px #0A1030; paint-order: stroke fill; text-shadow: 0 10px 0 rgba(10, 16, 48, 0.55); pointer-events: none; will-change: transform, opacity; }
  .mid { position: relative; flex: 1; display: grid; place-items: center; min-height: 0; }
  .hintcard { position: absolute; inset: -8px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px 22px; border-radius: 26px; background: rgba(7, 12, 43, 0.9); border: 4px solid rgba(255, 255, 255, 0.85); box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5); }
  .ans { font-size: 4rem; color: var(--jaune); text-shadow: 0 4px 0 #0A1030; line-height: 1; }
  .bottom { padding-bottom: 6px; }
  .right { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .quit { position: absolute; top: 0; right: 0; }
  .flash { position: absolute; inset: 0; opacity: 0; background: radial-gradient(circle at 60% 40%, #fff, rgba(255, 210, 63, 0.5) 50%, transparent 75%); pointer-events: none; z-index: 5; will-change: opacity; }
  .modal { position: absolute; inset: 0; z-index: 20; display: grid; place-items: center; background: rgba(7, 12, 43, 0.78); }
  .card { display: flex; flex-direction: column; gap: 26px; align-items: center; padding: 34px 44px; border-radius: 28px; background: var(--nuit2); border: 4px solid rgba(255, 255, 255, 0.8); }
  .title { font-size: 3rem; }
  .row { display: flex; gap: 22px; }
  @media (orientation: portrait) {
    .match { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
    .right { padding-bottom: 8px; }
  }
</style>
