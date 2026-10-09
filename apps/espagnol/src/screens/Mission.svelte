<script lang="ts">
  /** Mision del dia : ~5 min de repetition espacee (mots dus + nouveaux mots), la boucle quotidienne. */
  import { onMount } from 'svelte';
  import { countUp, gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content, loadAllUnits } from '../engine/data';
  import { buildMission, completeMission, streak, ymd, MISSION_BONUS, type Mission } from '../engine';
  import { speechSupport } from '../services/speech';
  import { nav } from '../ui/nav.svelte';
  import { now } from '../ui/clock';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import Runner, { type RunSummary } from './Runner.svelte';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import Panel from '../art/Panel.svelte';
  import LevelUp from '../art/LevelUp.svelte';
  import Icon from '../ui/Icon.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import { LEVEL_ITEMS } from '../engine/rpg';
  import { emojiUrl } from '../ui/emoji';

  let phase = $state<'loading' | 'intro' | 'play' | 'end'>('loading');
  let mission = $state<Mission | undefined>();
  let summary = $state<RunSummary | undefined>();
  let bonus = $state(0);
  let days = $state(0);
  let showLevel = $state(false);
  let xpEl: HTMLElement | undefined = $state();
  let root: HTMLElement | undefined = $state();
  const t = now();
  const already = game.state.missionDone === ymd(t);

  onMount(async () => {
    music.setMode('menu');
    await loadAllUnits();
    mission = buildMission(content, game.state, { now: t, speech: speechSupport() === 'ok' && game.state.settings.speechEnabled });
    phase = 'intro';
    requestAnimationFrame(() => root && !prefersReducedMotion() && gsap.from(root.querySelectorAll('.in'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' }));
  });

  function start() {
    sfx('door');
    haptic('tap');
    phase = 'play';
  }
  function finished(s: RunSummary) {
    summary = s;
    bonus = game.mutate((st) => completeMission(st, t));
    days = streak(game.state, t);
    phase = 'end';
    music.setMode('menu');
    sfx('win');
    requestAnimationFrame(() => {
      if (xpEl) countUp(xpEl, s.xp + bonus, { duration: 1.2, format: (n) => `+${Math.round(n)}` });
      if (root && !prefersReducedMotion()) gsap.from(root.querySelectorAll('.in'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out' });
    });
    if (s.levelUps.some((l) => l.player)) setTimeout(() => (showLevel = true), 1800);
  }
  const pl = $derived(summary?.levelUps.find((l) => l.player));
  const rewards = $derived(
    pl ? LEVEL_ITEMS.filter((l) => l.level === pl.level).map((l) => ({ icon: emojiUrl(l.item.emoji), label: l.item.nombre })) : [],
  );
</script>

{#if phase === 'play' && mission}
  <Runner title="Misión del día" mode="mission" steps={mission.exercises.map((ex) => ({ step: ex.step, ex }))} onfinish={finished} onexit={() => nav.back()} />
{:else}
  <div class="scr scr-bg ms" bind:this={root}>
    {#if phase === 'loading'}
      <div class="mid"><Icon name="scroll" size={72} /><p>Preparando tu misión…</p></div>
    {:else if phase === 'intro' && mission}
      <header class="hd in"><button type="button" class="x" aria-label="Volver" onclick={() => nav.back()}><Icon name="back" size={36} /></button></header>
      <div class="mid">
        <div class="in bird"><QuetzalMascot pose="talk" branch width={230} /></div>
        <Panel padding="30px 44px">
          <div class="in card">
            <h1 class="h-rpg">Misión del día</h1>
            {#if mission.exercises.length}
              <ul>
                <li><Emoji e="⏱️" size={56} /><b>{mission.minutes} min</b></li>
                <li><Emoji e="🎯" size={56} /><b>{mission.exercises.length} retos</b></li>
                {#if mission.dueCount}<li><Emoji e="📖" size={56} /><b>{mission.dueCount} para repasar</b></li>{/if}
                {#if mission.newCount}<li><Emoji e="🌟" size={56} /><b>{mission.newCount} palabras nuevas</b></li>{/if}
              </ul>
              <p class="bn">{already ? 'Ya la has hecho hoy. ¡Repite para practicar!' : `Termínala y gana +${MISSION_BONUS} XP.`}</p>
              <div class="go"><PrimaryButton size="lg" variant="magenta" onclick={start}>¡Empezar!</PrimaryButton></div>
            {:else}
              <p class="bn">Todavía no hay nada que repasar. ¡Juega una misión en el mapa!</p>
              <div class="go"><PrimaryButton variant="turquesa" onclick={() => nav.back()}>Volver al mapa</PrimaryButton></div>
            {/if}
          </div>
        </Panel>
      </div>
    {:else if phase === 'end' && summary}
      <div class="mid end">
        <div class="in bird"><QuetzalMascot pose="happy" branch width={250} /></div>
        <div class="in endcard">
          <h1 class="h-rpg">¡Misión cumplida!</h1>
          <div class="stats">
            <div class="stat"><b bind:this={xpEl}>+0</b><span>XP</span></div>
            <div class="stat"><b>{summary.total - summary.wrong}/{summary.total}</b><span>aciertos</span></div>
            <div class="stat"><b>{days} 🔥</b><span>{days === 1 ? 'día seguido' : 'días seguidos'}</span></div>
          </div>
          {#if summary.newItems.length}<p class="bn">{summary.newItems.filter((k) => k.startsWith('v:')).length} cartas nuevas en tu diccionario.</p>{/if}
          <div class="go"><PrimaryButton size="lg" variant="turquesa" onclick={() => nav.back()}>Volver al mapa</PrimaryButton></div>
        </div>
      </div>
      {#if showLevel && pl}<LevelUp level={pl.level} {rewards} onclose={() => (showLevel = false)} />{/if}
    {/if}
  </div>
{/if}

<style>
  .ms { z-index: 2; }
  .hd { padding: 16px 24px 0; }
  .x { width: 72px; height: 72px; border: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer; color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 6px 0 #7d5a1c; }
  .mid { flex: 1; display: flex; align-items: center; justify-content: center; gap: 40px; padding: 10px 60px 40px; font: 800 30px var(--q-font-body); color: var(--q-papel2); }
  .card, .endcard { display: grid; gap: 16px; justify-items: center; min-width: 560px; }
  h1 { font-size: 56px; line-height: 1; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 40px; }
  li { display: flex; align-items: center; gap: 12px; font: 900 32px var(--q-font-body); color: var(--q-papel); }
  .bn { margin: 0; font: 800 28px/1.3 var(--q-font-body); color: var(--q-papel); text-align: center; max-width: 560px; }
  .go { margin-top: 4px; }
  .stats { display: flex; gap: 18px; }
  .stat { min-width: 170px; padding: 8px 22px 10px; border-radius: 22px; text-align: center; background: rgba(11, 13, 42, 0.65); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.55); }
  .stat b { display: block; font: 400 48px/1.05 var(--q-font-title); color: var(--q-sol); }
  .stat span { font: 800 22px var(--q-font-body); color: var(--q-papel2); }
  .end { flex-direction: row; }
</style>
