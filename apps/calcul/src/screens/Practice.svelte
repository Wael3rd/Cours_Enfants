<script lang="ts">
  /** Serie de calculs : calcul geant, pave geant, validation auto, retour immediat simple. */
  import { onDestroy, onMount } from 'svelte';
  import { app } from '../state/store.svelte.ts';
  import { AnswerEntry } from '../../../maths/src/lib/entry.svelte.ts';
  import type { Question, Session, SessionResult, VisualHint } from '../../../maths/src/engine/index.ts';
  import { RUN_LENGTH, fmtSec, type RunConfig } from '../lib/run.ts';
  import { sfx, haptic } from '../lib/sound.ts';
  import Keypad from '../ui/Keypad.svelte';
  import HintVisual from '../ui/HintVisual.svelte';

  let { cfg, onend, onquit }: { cfg: RunConfig; onend: (r: SessionResult) => void; onquit: () => void } = $props();

  const sprint = cfg.kind === 'sprint';
  const entry = new AnswerEntry();
  let s: Session;
  if (cfg.kind === 'zone') {
    app.openZone(cfg.zone);
    s = app.start('training', { zone: cfg.zone, questions: RUN_LENGTH });
  } else if (cfg.kind === 'mix') {
    s = app.start('match', { questions: RUN_LENGTH });
  } else {
    s = app.start('sprint');
  }
  const total = s.total;

  let q = $state<Question | null>(null);
  let phase = $state<'ask' | 'ok' | 'bad'>('ask');
  let fluent = $state(false);
  let expected = $state(0);
  let hint = $state<VisualHint | null>(null);
  let answered = $state(0);
  let clock = $state(0);
  let alive = true;
  let finished = false;
  const t0 = performance.now();
  let tick: ReturnType<typeof setInterval> | undefined;

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  onMount(() => {
    if (sprint) tick = setInterval(() => (clock = performance.now() - t0), 500);
    next();
  });
  onDestroy(() => {
    alive = false;
    clearInterval(tick);
  });

  function next() {
    if (!alive) return;
    q = s.next();
    if (!q) return finish();
    phase = 'ask';
    hint = null;
    entry.reset(q.digits);
  }
  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(tick);
    onend(app.finishSession(s));
  }
  function quit() {
    alive = false;
    clearInterval(tick);
    if (answered > 0 && !finished) app.finishSession(s);
    else void app.saveNow();
    onquit();
  }

  function onDigit(d: string) {
    if (phase !== 'ask') return;
    if (entry.push(d)) void submit();
  }
  function onBack() {
    if (phase === 'ask') entry.back();
  }
  async function submit() {
    if (!q) return;
    const fb = s.submit(entry.number, entry.elapsed);
    answered = fb.index + 1;
    expected = fb.expected;
    fluent = fb.fluent;
    if (fb.correct) {
      phase = 'ok';
      sfx('correct-pip'); haptic('good');
      await wait(650);
    } else {
      phase = 'bad';
      hint = fb.hint;
      sfx('wrong-soft', 0.8); haptic('tap');
      await wait(hint ? fb.modelMs : 1100);
    }
    next();
  }

  // « 7 + 8 » -> « 7 + 8 = [ ] » ; « 37 + ? = 40 » -> la case remplace le « ? »
  const parts = $derived.by(() => {
    const t = q?.text ?? '';
    return t.includes('?') ? { pre: t.split('?')[0], post: t.split('?')[1] } : { pre: t + ' = ', post: '' };
  });
  const shown = $derived(Math.min(answered + 1, total));
  const slot = $derived(phase === 'ask' ? entry.value : String(expected));
</script>

<div class="screen run">
  <header>
    <button type="button" class="btn quiet quit" onclick={quit}>✕ Quitter</button>
    <div class="prog" aria-label="Calcul {shown} sur {total}">
      <span class="bar" aria-hidden="true"><i style:width="{Math.round((answered / total) * 100)}%"></i></span>
      <span class="count num">{shown} / {total}</span>
    </div>
    {#if sprint}<span class="clock num" aria-label="Temps">{fmtSec(clock)}</span>{/if}
  </header>

  <div class="body">
    <section class="stage" aria-live="polite">
      <div class="calc num" class:ok={phase === 'ok'} class:bad={phase === 'bad'}>
        <span class="expr">{parts.pre}</span>
        <span class="slot" style:min-width="{(q?.digits ?? 1) * 0.72 + 0.5}em">{slot}</span>
        {#if parts.post}<span class="expr">{parts.post}</span>{/if}
      </div>

      <div class="fb">
        {#if phase === 'ok'}
          <p class="msg ok">{fluent ? 'Rapide !' : 'Juste !'}</p>
        {:else if phase === 'bad'}
          <p class="msg bad">La réponse est {expected}</p>
          {#if hint}<div class="hintbox"><HintVisual {hint} /></div>{/if}
        {/if}
      </div>
    </section>

    <section class="padwrap"><Keypad ondigit={onDigit} onback={onBack} disabled={phase !== 'ask'} /></section>
  </div>
</div>

<style>
  .run { gap: 8px; }
  header { display: flex; align-items: center; gap: 16px; }
  .quit { min-height: 64px; padding: 0 20px; font-size: 1.2rem; }
  .prog { flex: 1; display: flex; align-items: center; gap: 12px; }
  .bar { flex: 1; height: 14px; border-radius: 7px; background: #E7E2D3; overflow: hidden; display: block; }
  .bar i { display: block; height: 100%; background: var(--accent); border-radius: 7px; transition: width 200ms; }
  .count { font-size: 1.3rem; font-weight: 600; color: var(--muted); min-width: 4.5em; text-align: right; }
  .clock { font-size: 1.6rem; font-weight: 600; color: var(--accent-dark); min-width: 4.2em; text-align: right; }

  .body { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr minmax(300px, 400px); gap: 20px; align-items: center; }
  .stage { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; min-height: 0; }
  .calc { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0 0.15em; font-size: clamp(4rem, 12vw, 8.5rem); font-weight: 600; line-height: 1.1; white-space: pre; }
  .slot { display: inline-flex; align-items: center; justify-content: center; min-height: 1.25em; padding: 0 0.15em; border-radius: 0.16em; border: 0.06em solid var(--line); background: var(--card); color: var(--accent-dark); transition: background-color 90ms; }
  .calc.ok .slot { background: var(--ok-bg); border-color: var(--ok); color: var(--ok); }
  .calc.bad .slot { background: var(--bad-bg); border-color: var(--bad); color: var(--bad); }
  .fb { min-height: 250px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .msg { margin: 0; font-size: clamp(2rem, 4.4vw, 3rem); font-weight: 600; }
  .msg.ok { color: var(--ok); }
  .msg.bad { color: var(--bad); font-size: clamp(1.7rem, 3.4vw, 2.4rem); }
  .hintbox { width: 100%; max-width: 620px; }
  .padwrap { display: flex; justify-content: center; }

  @media (max-aspect-ratio: 1/1), (max-width: 760px) {
    .body { grid-template-columns: 1fr; grid-template-rows: 1fr auto; gap: 8px; }
    .fb { min-height: 200px; }
    .calc { font-size: clamp(3.6rem, 16vw, 7rem); }
  }
</style>
