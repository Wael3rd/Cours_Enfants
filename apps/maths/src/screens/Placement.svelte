<script lang="ts">
  /** "Match amical de detection" (~2 min) : la meme interface que le match, sans indice ni score, puis la zone de depart. */
  import { onMount } from 'svelte';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { AnswerEntry } from '../lib/entry.svelte.ts';
  import { cine } from '../lib/cine.ts';
  import { kitColors } from '../lib/kit.ts';
  import { sfx, haptic, say, sayVariant } from '../lib/sound.ts';
  import { ZONES, trophyName, PLACEMENT_MAX_MS, PLACEMENT_MAX_QUESTIONS, type PlacementSession, type PlacementResult } from '../engine/index.ts';
  import type { Question } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import Keypad from '../ui/Keypad.svelte';
  import CalcPanel from '../ui/CalcPanel.svelte';
  import Gauge from '../ui/Gauge.svelte';
  import Pitch from '../ui/Pitch.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import Coach from '../art/Coach.svelte';

  const kit = kitColors();
  const entry = new AnswerEntry();
  let ps: PlacementSession | undefined;
  let phase = $state<'intro' | 'play' | 'result'>('intro');
  let q = $state<Question | null>(null);
  let calcState = $state<'idle' | 'ok' | 'bad'>('idle');
  let locked = $state(true);
  let result = $state<PlacementResult | null>(null);
  let calc: CalcPanel | undefined = $state();
  let gauge: Gauge | undefined = $state();
  let pitch: Pitch | undefined = $state();
  let started = 0;
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  onMount(() => { say('placement_intro'); });

  function start() {
    ps = app.startPlacement();
    phase = 'play';
    started = performance.now();
    sfx('whistle-short');
    next();
  }
  function skip() {
    app.markPlacementDone();
    nav.go('home');
  }

  function next() {
    if (!ps) return;
    const nq = ps.next();
    if (!nq) return void finish();
    q = nq as unknown as Question;
    calcState = 'idle';
    entry.reset(String(nq.answer).length);
    locked = false;
    gauge?.start(app.state.settings.thresholdMs);
  }
  function onDigit(d: string) {
    if (!locked && entry.push(d)) void submit();
  }
  async function submit() {
    if (!ps || !q) return;
    locked = true;
    gauge?.stop();
    const fb = ps.submit(entry.number, entry.elapsed);
    const prog = Math.max((fb.index + 1) / PLACEMENT_MAX_QUESTIONS, (performance.now() - started) / PLACEMENT_MAX_MS) * 0.9;
    pitch?.advance(Math.min(1, prog));
    if (fb.correct) {
      calcState = 'ok'; haptic('good'); sfx('correct-pip');
      if (Math.random() < 0.25) sayVariant('praise');
    } else {
      calcState = 'bad'; haptic('tap'); sfx('wrong-soft'); calc?.nudge();
    }
    await wait(fb.correct ? 320 : 700);
    if (performance.now() - started > PLACEMENT_MAX_MS * 1.05) return void finish();
    next();
  }

  async function finish() {
    if (!ps || phase === 'result') return;
    locked = true;
    gauge?.stop();
    result = app.finishSession(ps);
    app.markPlacementDone();
    sfx('whistle-triple');
    // Plusieurs zones d'un coup : une seule cinematique (la plus haute), les autres sont sur l'etagere.
    if (result.zonesWon.length) await cine('trophy', { competition: trophyName(Math.max(...result.zonesWon)), name: app.state.childName });
    phase = 'result';
    say('placement_end');
    sfx('jingle-win', 0.7);
  }
  const zone = $derived(result ? ZONES[result.focusZone - 1] : null);
</script>

<Stage>
  <StadiumBackdrop live={phase !== 'play'} />
  <div class="shade"></div>
  {#if phase === 'intro'}
    <div class="intro">
      <div class="coach"><Coach width={300} /></div>
      <div class="card">
        <div class="disp title">Match amical</div>
        <div class="sub">Réponds vite. Pas de panique : c'est pour voir ce que tu sais déjà.</div>
        <GameButton id="btn-go" variant="go" size="xl" onclick={start}><Icon name="play" size={64} />GO</GameButton>
        <GameButton variant="ghost" size="md" onclick={skip}>Passer</GameButton>
      </div>
    </div>
  {:else if phase === 'play'}
    <div class="match">
      <div class="left">
        <Pitch bind:this={pitch} look={app.state.look} primary={kit.primary} secondary={kit.secondary} shoe={kit.shoe} />
        <div class="mid">{#if q}<CalcPanel bind:this={calc} text={q.text} value={entry.value} digits={entry.digits} status={calcState} />{/if}</div>
        <div class="bottom"><Gauge bind:this={gauge} /></div>
      </div>
      <div class="right"><Keypad ondigit={onDigit} onback={() => entry.back()} disabled={locked} /></div>
    </div>
  {:else if result && zone}
    <div class="result">
      <div class="coach"><Coach width={280} /></div>
      <div class="card">
        <div class="disp title">Ton point de départ</div>
        <div class="zonebadge"><span class="zn disp">{zone.id}</span><span class="zname disp">{zone.name}</span></div>
        <div class="route" aria-label="Zones">
          {#each ZONES as z}<span class="dot" class:won={result.zonesPassed.includes(z.id)} class:cur={z.id === result.focusZone}>{z.id}</span>{/each}
        </div>
        <div class="sub">{result.prefilled > 0 ? `${result.prefilled} calculs déjà connus !` : 'On commence en douceur.'}</div>
        <GameButton id="btn-to-stadium" variant="pitch" size="lg" onclick={() => nav.go('home')}><Icon name="home" size={44} />Au stade !</GameButton>
      </div>
    </div>
  {/if}
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.6), rgba(7, 12, 43, 0.75)); }
  .intro, .result { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 40px; padding: 30px; }
  .card { display: flex; flex-direction: column; align-items: center; gap: 22px; padding: 36px 44px; max-width: 640px; border-radius: 30px; background: rgba(14, 26, 85, 0.88); border: 4px solid rgba(255, 255, 255, 0.8); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
  .title { font-size: 3.8rem; line-height: 1; text-shadow: 0 5px 0 #0A1030; text-align: center; }
  .sub { font-size: 1.5rem; font-weight: 600; text-align: center; text-wrap: balance; }
  .zonebadge { display: flex; align-items: center; gap: 18px; }
  .zn { display: grid; place-items: center; width: 96px; height: 96px; border-radius: 50%; font-size: 3.8rem; background: var(--jaune); color: var(--encre); box-shadow: 0 6px 0 #B88A00; }
  .zname { font-size: 3rem; }
  .route { display: flex; gap: 8px; }
  .dot { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; font: 400 1.3rem var(--f-display); background: rgba(255, 255, 255, 0.18); }
  .dot.won { background: var(--jaune); color: var(--encre); }
  .dot.cur { background: #1BBF5E; box-shadow: 0 0 0 5px rgba(27, 191, 94, 0.45); }
  .match { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); gap: 20px; padding: max(18px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); }
  .left { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .mid { flex: 1; display: grid; place-items: center; }
  .right { display: flex; align-items: center; justify-content: center; }
  @media (orientation: portrait) { .match { grid-template-columns: 1fr; grid-template-rows: 1fr auto; } .intro, .result { flex-direction: column; } }
</style>
