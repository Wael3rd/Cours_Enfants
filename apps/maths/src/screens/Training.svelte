<script lang="ts">
  /**
   * Entrainement : choix d'une zone debloquee -> explication du Coach (texte court + voix ; emplacement `strategy-<zone>` pour les
   * cinematiques a venir) -> pratique guidee : l'indice visuel est montre AVANT de repondre, puis s'efface progressivement.
   */
  import { onMount } from 'svelte';
  import { gsap, burst } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { AnswerEntry } from '../lib/entry.svelte.ts';
  import { cine } from '../lib/cine.ts';
  import { kitColors } from '../lib/kit.ts';
  import { sfx, haptic, say, sayVariant, sayHint } from '../lib/sound.ts';
  import { STRATEGY_CINEMATICS, STRATEGY_SHOW, strategyKey } from '../audio/voice-lines.ts';
  import { ZONES, isZoneWon, zoneFacts, hintFor, zoneRatio, type Question, type Session, type VisualHint } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import Keypad from '../ui/Keypad.svelte';
  import CalcPanel from '../ui/CalcPanel.svelte';
  import HintVisual from '../ui/HintVisual.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import Coach from '../art/Coach.svelte';

  const kit = kitColors();
  const club = app.state.club;
  const entry = new AnswerEntry();
  const progress = app.state.profile.progress;
  const T = app.state.settings.thresholdMs;

  let phase = $state<'pick' | 'learn' | 'practice'>('pick');
  let zone = $state(progress.focusZone);
  let s: Session | undefined;
  let q = $state<Question | null>(null);
  let hint = $state<VisualHint | null>(null);
  let calcState = $state<'idle' | 'ok' | 'bad'>('idle');
  let locked = $state(true);
  let idx = $state(0);
  let total = $state(15);
  let wrong = $state(false);
  let calc: CalcPanel | undefined = $state();
  let alive = true;
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  onMount(() => {
    say('training_pick');
    return () => { alive = false; };
  });

  const z = $derived(ZONES[zone - 1]);
  const demo = $derived.by(() => {
    const fs = zoneFacts(zone);
    if (!fs.length) return null;
    // exemple representatif : une addition au milieu de la zone
    const adds = fs.filter((f) => f.op === '+');
    return hintFor((adds.length ? adds : fs)[Math.floor((adds.length || fs.length) / 2)]);
  });

  async function choose(id: number) {
    if (id > progress.maxUnlocked) {
      sfx('wrong-soft'); haptic('bad');
      return;
    }
    zone = id;
    nav.zone = id;
    phase = 'learn';
    sfx('swoosh-in', 0.6);
    const key = ZONES[id - 1].key;
    if (STRATEGY_CINEMATICS.includes(key)) await cine(`strategy-${key}`, {});
    say(strategyKey(id));
  }

  function startPractice() {
    s = app.start('training', { zone });
    total = s.total;
    phase = 'practice';
    say('training_intro');
    setTimeout(() => alive && next(), 1800);
  }

  /** Aide visible AVANT la reponse, de plus en plus discrete : 0..1. */
  const reveal = $derived(Math.max(0, 1 - idx / 11));

  function next() {
    if (!s || !alive) return;
    q = s.next();
    if (!q) return void finish();
    hint = s.hint(q);
    wrong = false;
    calcState = 'idle';
    entry.reset(q.digits);
    locked = false;
    if (idx === 5) say('training_fade');
    else if (idx === 10) say('training_alone');
    else if (hint && ((q.kind === 'fact' && q.isNew) || idx < 3)) sayHint(q.kind === 'fact' ? q.id : null, hint.caption);
  }
  function onDigit(d: string) {
    if (!locked && entry.push(d)) void submit();
  }
  async function submit() {
    if (!s || !q) return;
    locked = true;
    const fb = s.submit(entry.number, entry.elapsed);
    idx = fb.index + 1;
    if (fb.correct) {
      calcState = 'ok'; sfx('correct-pip'); haptic('good');
      if (fb.fluent && Math.random() < 0.4) sayVariant('praise');
      await wait(420);
    } else {
      calcState = 'bad'; sfx('wrong-soft'); haptic('tap'); calc?.nudge(); sayVariant('error');
      wrong = true;
      hint = fb.hint;
      await wait(fb.modelMs + 150);
    }
    if (alive) next();
  }
  function finish() {
    if (!s) return;
    const result = app.finishSession(s);
    sfx('whistle-long');
    burst(document.body, innerWidth / 2, innerHeight / 2, { count: 18 });
    nav.showRewards({ result, from: 'training' });
  }
  void gsap;
</script>

<Stage>
  <StadiumBackdrop live={phase !== 'practice'} />
  <div class="shade"></div>

  {#if phase === 'pick'}
    <div class="pick">
      <header><GameButton size="icon" variant="ghost" label="Retour" onclick={() => nav.go('home')}><Icon name="home" size={36} /></GameButton><h1 class="disp">Choisis ta zone</h1></header>
      <div class="grid">
        {#each ZONES as zz}
          {@const locked = zz.id > progress.maxUnlocked}
          {@const won = isZoneWon(progress, zz.id)}
          <button type="button" id="zone-{zz.id}" class="zcard" class:locked class:won class:cur={zz.id === progress.focusZone} onclick={() => choose(zz.id)} aria-label="Zone {zz.id} : {zz.name}">
            <span class="zn disp">{zz.id}</span>
            <span class="zt disp">{zz.name}</span>
            {#if locked}<span class="zi"><Icon name="lock" size={34} /></span>
            {:else if won}<span class="zi"><Icon name="star" size={38} /></span>
            {:else}<span class="bar" aria-hidden="true"><i style:width="{Math.round(zoneRatio(progress, zz.id, T) * 100)}%"></i></span>{/if}
          </button>
        {/each}
      </div>
    </div>
  {:else if phase === 'learn'}
    <div class="learn">
      <div class="coach"><Coach width={320} /></div>
      <div class="lesson">
        <div class="zhead"><span class="zn disp">{z.id}</span><span class="disp zname">{z.name}</span></div>
        <div class="bubble disp">{STRATEGY_SHOW[z.id]}</div>
        {#if demo}<div class="demo"><HintVisual hint={demo} colorA={club.primary} /></div>{/if}
        <div class="acts">
          <GameButton variant="ghost" size="md" label="Retour" onclick={() => (phase = 'pick')}>←</GameButton>
          <GameButton id="btn-practice" variant="pitch" size="lg" onclick={startPractice}>À toi de jouer <Icon name="play" size={34} /></GameButton>
        </div>
      </div>
    </div>
  {:else}
    <div class="prac">
      <div class="left">
        <div class="head">
          <div class="zpill disp"><span class="zn s">{z.id}</span>{z.name}</div>
          <div class="dots" aria-label="{idx} sur {total}">{#each Array.from({ length: total }, (_, i) => i) as i}<i class:on={i < idx}></i>{/each}</div>
        </div>
        <div class="mid">
          {#if q}<CalcPanel bind:this={calc} text={q.text} value={entry.value} digits={entry.digits} status={calcState} />{/if}
        </div>
        <div class="help" class:err={wrong} style:opacity={wrong ? 1 : reveal}>
          {#if hint && (wrong || reveal > 0.18)}<HintVisual {hint} colorA={club.primary} caption={wrong || reveal > 0.55} compact />{/if}
        </div>
      </div>
      <div class="right">
        <div class="quit"><GameButton size="icon" variant="ghost" label="Quitter" onclick={() => { if (s) app.finishSession(s); nav.go('home'); }}>✕</GameButton></div>
        <Keypad ondigit={onDigit} onback={() => entry.back()} disabled={locked} />
      </div>
    </div>
  {/if}
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.62), rgba(7, 12, 43, 0.8)); }
  .pick { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 18px; padding: max(18px, env(safe-area-inset-top)) max(34px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(34px, env(safe-area-inset-left)); }
  header { display: flex; align-items: center; gap: 22px; }
  h1 { margin: 0; font-size: 3.4rem; text-shadow: 0 5px 0 #0A1030; }
  .grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 16px; min-height: 0; }
  .zcard { position: relative; display: flex; align-items: center; gap: 18px; padding: 0 22px; border: 4px solid rgba(255, 255, 255, 0.45); border-radius: 22px; color: #fff; text-align: left; cursor: pointer; background: linear-gradient(160deg, #2B3FAE, #131E63); box-shadow: 0 8px 0 #0A1030, 0 14px 22px rgba(0, 0, 0, 0.4); transform: translateY(0); transition: transform 140ms var(--ease-pop), box-shadow 140ms; will-change: transform; }
  .zcard:active:not(.locked) { transform: translateY(6px); box-shadow: 0 2px 0 #0A1030; transition: none; }
  .zcard.cur { border-color: var(--jaune); }
  .zcard.won { background: linear-gradient(160deg, #1E8F52, #0B5A2C); }
  .zcard.locked { opacity: 0.5; filter: grayscale(0.6); }
  .zn { display: grid; place-items: center; flex: none; width: 74px; height: 74px; border-radius: 50%; font-size: 2.8rem; color: var(--encre); background: var(--jaune); box-shadow: 0 5px 0 #B88A00; }
  .zn.s { width: 38px; height: 38px; font-size: 1.5rem; box-shadow: none; }
  .zt { font-size: 1.9rem; line-height: 1.05; flex: 1; }
  .zi { flex: none; }
  .bar { position: absolute; left: 22px; right: 22px; bottom: 12px; height: 10px; border-radius: 5px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
  .bar i { display: block; height: 100%; background: var(--jaune); }
  .learn { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 40px; padding: 30px 40px; }
  .lesson { display: flex; flex-direction: column; gap: 16px; max-width: 760px; flex: 1; padding: 28px 34px; border-radius: 30px; background: rgba(14, 26, 85, 0.9); border: 4px solid rgba(255, 255, 255, 0.8); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
  .zhead { display: flex; align-items: center; gap: 16px; }
  .zname { font-size: 3rem; line-height: 1; }
  .bubble { font-size: 2.1rem; color: var(--jaune); line-height: 1.1; }
  .demo { min-height: 220px; display: grid; place-items: center; }
  .acts { display: flex; justify-content: flex-end; gap: 16px; }
  .prac { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); gap: 20px; padding: max(12px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); }
  .left { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .head { display: flex; align-items: center; gap: 20px; height: 56px; }
  .zpill { display: flex; align-items: center; gap: 12px; padding: 6px 22px 6px 8px; border-radius: 30px; font-size: 1.6rem; background: rgba(7, 12, 43, 0.8); border: 3px solid rgba(255, 255, 255, 0.4); }
  .dots { display: flex; gap: 6px; flex-wrap: wrap; }
  .dots i { width: 16px; height: 16px; border-radius: 50%; background: rgba(255, 255, 255, 0.22); }
  .dots i.on { background: var(--jaune); }
  .mid { display: grid; place-items: center; min-height: 0; flex: 1; }
  .help { flex: none; min-height: 250px; display: grid; place-items: center; padding: 6px 14px; border-radius: 24px; background: rgba(7, 12, 43, 0.55); border: 3px dashed rgba(255, 255, 255, 0.3); will-change: opacity; }
  .help.err { background: rgba(7, 12, 43, 0.92); border: 4px solid rgba(255, 255, 255, 0.85); }
  .right { position: relative; display: flex; align-items: center; justify-content: center; }
  .quit { position: absolute; top: 0; right: 0; }
  @media (orientation: portrait) { .prac { grid-template-columns: 1fr; grid-template-rows: 1fr auto; } .learn { flex-direction: column; } .grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: none; } }
</style>
