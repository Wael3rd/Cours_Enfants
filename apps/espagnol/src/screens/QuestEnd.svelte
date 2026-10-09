<script lang="ts">
  /** Fin de quete : etoiles, XP, nouvelles cartes (ItemCard revelees), niveaux (LevelUp), plume recuperee. */
  import { onMount, tick } from 'svelte';
  import { burst, countUp, gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { content } from '../engine/data';
  import { LEVEL_ITEMS } from '../engine/rpg';
  import type { QuestOutcome } from '../engine/progress';
  import type { Quest, Unit } from '../content/schema';
  import type { RunSummary } from './Runner.svelte';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import { sparks } from '../ui/fx';
  import { emojiUrl } from '../ui/emoji';
  import { STAT_INFO } from '../ui/stats';
  import { featherSvg } from '../art/core/qart.js';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import LevelUp from '../art/LevelUp.svelte';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';
  import Panel from '../art/Panel.svelte';
  import Icon from '../ui/Icon.svelte';
  import VocabCard from '../ui/VocabCard.svelte';
  import SpeakText from '../ui/SpeakText.svelte';

  interface Props {
    quest: Quest;
    unit: Unit;
    outcome: QuestOutcome;
    summary: RunSummary;
    onclose: () => void;
    onretry: () => void;
  }
  let { quest, unit, outcome, summary, onclose, onretry }: Props = $props();

  type Phase = 'summary' | 'level' | 'pluma';
  let phase = $state<Phase>('summary');
  let root: HTMLElement | undefined = $state();
  let xpEl: HTMLElement | undefined = $state();
  let btn = $state(false);
  let lvIndex = $state(0);
  let quetzal: QuetzalMascot | undefined = $state();
  let plumaDone = $state(false);

  const cards = $derived(
    summary.newItems
      .filter((k) => k.startsWith('v:'))
      .map((k) => content.vocab.get(k.slice(2)))
      .filter((v): v is NonNullable<typeof v> => !!v),
  );
  const shownCards = $derived(cards.slice(0, 6));
  const playerLevels = summary.levelUps.filter((l) => l.player);
  const statLevels = summary.levelUps.filter((l) => l.stat);
  const pct = Math.round(outcome.accuracy * 100);
  const totalXp = summary.xp + outcome.bonusXp;

  function rewardsFor(level: number) {
    const r: { icon?: string; label: string }[] = [];
    for (const li of LEVEL_ITEMS) if (li.level === level) r.push({ icon: emojiUrl(li.item.emoji), label: li.item.nombre });
    for (const s of statLevels) r.push({ label: `${STAT_INFO[s.stat!].label}: nivel ${s.level}` });
    return r;
  }

  onMount(() => {
    music.setMode('menu');
    if (!root) return;
    const reduce = prefersReducedMotion();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    sfx(outcome.passed ? 'win' : 'wrong', 0.8);
    tl.from(root.querySelector('.hd'), { y: -60, opacity: 0, scale: 0.7, duration: 0.6, ease: 'back.out(2)' }, 0.1);
    const stars = root.querySelectorAll('.star');
    stars.forEach((s, i) => {
      const on = i < outcome.stars;
      tl.fromTo(s, { scale: 0, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: on ? 1 : 0.28, duration: 0.55, ease: 'elastic.out(1,0.5)' }, 0.5 + i * 0.4);
      if (on) tl.call(() => { sfx('star'); haptic('good'); sparks(s, ['#ffc83d', '#fff3d1', '#ff9f1c'], 14); }, [], 0.55 + i * 0.4);
    });
    tl.from(root.querySelectorAll('.stat'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.5 }, 1.7);
    if (xpEl) tl.add(countUp(xpEl, totalXp, { duration: 1, format: (n) => `+${Math.round(n)}` }).play(), 1.9);
    if (shownCards.length) {
      tl.call(() => sfx('item'), [], 2.3);
      tl.fromTo(root.querySelectorAll('.cd'), { rotationY: 90, scale: 0.6, opacity: 0 }, { rotationY: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.18, ease: 'back.out(1.6)' }, 2.3);
    }
    tl.call(() => (btn = true), [], reduce ? 0 : 2.6 + shownCards.length * 0.1);
    if (reduce) { gsap.set(root.querySelectorAll('.star'), { opacity: 1 }); btn = true; }
    return () => tl.kill();
  });

  function proceed() {
    haptic('tap');
    if (phase === 'summary' && playerLevels.length) {
      lvIndex = 0;
      phase = 'level';
      return;
    }
    afterLevels();
  }
  function afterLevels() {
    if (outcome.unitCompleted && outcome.plume && !plumaDone) {
      phase = 'pluma';
      void tick().then(playPluma);
      return;
    }
    onclose();
  }
  function levelClosed() {
    if (lvIndex < playerLevels.length - 1) lvIndex += 1;
    else afterLevels();
  }

  function playPluma() {
    plumaDone = true;
    music.setMode('menu');
    sfx('magic');
    const el = document.querySelector('.pl-feather');
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { y: -500, scale: 0.3, rotation: -30, opacity: 0 }, { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.4, ease: 'power3.out' });
      gsap.to(el, { x: -280, y: 120, scale: 0.35, opacity: 0, duration: 0.9, delay: 1.9, ease: 'power2.in', onComplete: () => { quetzal?.regrow(); sfx('item'); burst(document.body, window.innerWidth * 0.32, window.innerHeight * 0.55, { count: 36, colors: ['#42e0a0', '#ffc83d', '#7ff3e4', '#fff'] }); } });
    } else quetzal?.regrow();
    setTimeout(() => outcome.plume && say(outcome.plume.descripcion.audio, outcome.plume.descripcion.es), 3200);
    setTimeout(() => (btn = true), 3600);
  }
</script>

<div class="end scr scr-bg" bind:this={root}>
  {#if phase !== 'pluma'}
    <div class="rays"></div>
    <div class="col">
      <div class="hd">
        <h1 class="h-rpg">{outcome.passed ? '¡Misión cumplida!' : '¡Casi lo tienes!'}</h1>
        <p>{quest.titulo}</p>
      </div>
      <div class="stars">
        {#each [0, 1, 2] as i}<span class="star"><Icon name="star" size={104} class={i < outcome.stars ? 'on' : 'off'} /></span>{/each}
      </div>
      <div class="stats">
        <div class="stat"><b>{pct} %</b><span>aciertos</span></div>
        <div class="stat xp"><b bind:this={xpEl}>+0</b><span>XP</span></div>
        <div class="stat"><b>{outcome.hints}</b><span>pistas</span></div>
        {#if outcome.bonusXp}<div class="stat"><b>+{outcome.bonusXp}</b><span>bonus</span></div>{/if}
      </div>
      {#if statLevels.length}
        <div class="chips">{#each statLevels as s}<span class="chip" style:--c={STAT_INFO[s.stat!].color}>¡{STAT_INFO[s.stat!].label} · nivel {s.level}!</span>{/each}</div>
      {/if}
      {#if shownCards.length}
        <div class="cards">
          <p class="lbl">Cartas nuevas</p>
          <div class="row">
            {#each shownCards as v}<div class="cd"><VocabCard {v} size={132} /></div>{/each}
            {#if cards.length > shownCards.length}<span class="more">+{cards.length - shownCards.length}</span>{/if}
          </div>
        </div>
      {/if}
      <div class="go" class:show={btn}>
        {#if outcome.passed}
          <PrimaryButton size="lg" variant="turquesa" onclick={proceed}>Continuar</PrimaryButton>
        {:else}
          <PrimaryButton size="lg" variant="magenta" onclick={onretry}>Otra vez</PrimaryButton>
          <PrimaryButton variant="turquesa" onclick={onclose}>Volver</PrimaryButton>
        {/if}
      </div>
    </div>
  {:else}
    <div class="pl">
      <div class="glowbg"></div>
      <div class="pl-bird"><QuetzalMascot bind:this={quetzal} pose="perched" bare branch width={360} /></div>
      <div class="pl-feather">{@html featherSvg({ width: 150, height: 450 })}</div>
      <div class="pl-txt">
        <h1 class="h-rpg">¡Pluma recuperada!</h1>
        <h2>{outcome.plume?.nombre}</h2>
        {#if outcome.plume}<Panel padding="16px 28px"><p class="line"><SpeakText text={outcome.plume.descripcion.es} audio={outcome.plume.descripcion.audio} /></p></Panel>{/if}
        {#if outcome.unlockedItem}<p class="item">Nuevo objeto: {outcome.unlockedItem.nombre}</p>{/if}
      </div>
      <div class="go" class:show={btn}><PrimaryButton size="lg" variant="turquesa" onclick={onclose}>¡Genial!</PrimaryButton></div>
    </div>
  {/if}

  {#if phase === 'level'}
    <LevelUp level={playerLevels[lvIndex].level} rewards={rewardsFor(playerLevels[lvIndex].level)} onclose={levelClosed} />
  {/if}
</div>

<style>
  .end { z-index: 3; align-items: center; }
  .rays { position: absolute; left: 50%; top: 30%; width: 2000px; height: 2000px; margin: -1000px 0 0 -1000px; background: repeating-conic-gradient(from 0deg, rgba(255, 200, 61, 0.1) 0deg 7deg, transparent 7deg 22deg); -webkit-mask: radial-gradient(closest-side, #000 15%, transparent 70%); mask: radial-gradient(closest-side, #000 15%, transparent 70%); animation: spin 40s linear infinite; pointer-events: none; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .col { position: relative; flex: 1; width: 100%; max-width: 1100px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px 30px; }
  .hd { text-align: center; }
  .hd h1 { font-size: 64px; line-height: 1; }
  .hd p { margin: 8px 0 0; font: 800 30px var(--q-font-body); color: var(--q-papel2); }
  .stars { display: flex; gap: 18px; margin: 0 0 4px; }
  .star { display: block; will-change: transform; opacity: 0; }
  .star :global(.on) { color: var(--q-sol); filter: drop-shadow(0 6px 0 #8a4a05) drop-shadow(0 0 18px rgba(255, 200, 61, 0.8)); }
  .star :global(.off) { color: #4b52b5; }
  .stats { display: flex; gap: 22px; }
  .stat { min-width: 150px; padding: 8px 22px 10px; border-radius: 22px; text-align: center; background: rgba(11, 13, 42, 0.65); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.55); }
  .stat b { display: block; font: 400 46px/1.05 var(--q-font-title); color: var(--q-sol); }
  .stat span { font: 800 22px var(--q-font-body); color: var(--q-papel2); }
  .chips { display: flex; gap: 10px; }
  .chip { padding: 6px 20px 8px; border-radius: 999px; font: 900 24px var(--q-font-body); color: #fff; background: var(--c); box-shadow: 0 4px 0 rgba(0, 0, 0, 0.35); }
  .cards { display: grid; justify-items: center; gap: 4px; perspective: 900px; }
  .lbl { margin: 0; font: 900 24px var(--q-font-body); color: var(--q-turquesa); }
  .row { display: flex; gap: 14px; align-items: center; }
  .cd { will-change: transform; }
  .more { font: 400 44px var(--q-font-title); color: var(--q-sol); }
  .go { display: flex; gap: 20px; opacity: 0; transform: translateY(24px); transition: opacity 0.4s, transform 0.4s; pointer-events: none; margin-top: 4px; }
  .go.show { opacity: 1; transform: none; pointer-events: auto; }
  .pl { position: absolute; inset: 0; display: grid; place-items: center; }
  .glowbg { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 55%, rgba(66, 224, 160, 0.35), transparent 60%), radial-gradient(ellipse at 50% 50%, #3b2a8a, #0b0d2a 80%); }
  .pl-bird { position: absolute; left: 12%; top: 22%; }
  .pl-feather { position: absolute; left: 40%; top: 14%; filter: drop-shadow(0 0 30px #42e0a0); }
  .pl-txt { position: absolute; right: 7%; top: 16%; width: 560px; display: grid; gap: 14px; justify-items: start; }
  .pl-txt h1 { font-size: 64px; line-height: 1; }
  .pl-txt h2 { margin: 0; font: 400 40px var(--q-font-title); color: #42e0a0; text-shadow: 0 4px 0 #033a29; }
  .line { margin: 0; font: 800 32px/1.35 var(--q-font-body); }
  .item { margin: 0; font: 900 26px var(--q-font-body); color: var(--q-papel); padding: 8px 20px; border-radius: 999px; background: rgba(255, 255, 255, 0.14); }
  .pl .go { position: absolute; right: 7%; bottom: 8%; }
</style>
