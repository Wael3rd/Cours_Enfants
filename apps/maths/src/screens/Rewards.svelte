<script lang="ts">
  /** Ecran recompenses : etoiles, trophees de zone (cinematique `trophy`), paquet de cartes (cinematique `card-pack`). */
  import { onMount } from 'svelte';
  import { gsap, burst } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { cine } from '../lib/cine.ts';
  import { openOnePack, cardProps } from '../lib/pack.ts';
  import { sfx, say, haptic } from '../lib/sound.ts';
  import { packsAvailable, trophyName, ZONES, type Card } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import PlayerCard from '../art/PlayerCard.svelte';

  const p = nav.rewards!;
  const r = p.result;
  const packs = $derived(packsAvailable(app.state.profile.rewards));
  let shown = $state(0);
  let ready = $state(false);
  let card = $state<Card | null>(null);
  let opening = $state(false);
  let root: HTMLDivElement | undefined = $state();

  const fmt = (ms: number) => `${(ms / 1000).toFixed(1).replace('.', ',')} s`;
  const title = $derived(
    p.from === 'match' ? (r.outcome === 'win' ? 'VICTOIRE !' : r.outcome === 'draw' ? 'MATCH NUL' : 'BEAU MATCH !')
      : p.from === 'sprint' ? (r.medal ? { or: 'MÉDAILLE D\'OR', argent: 'MÉDAILLE D\'ARGENT', bronze: 'MÉDAILLE DE BRONZE' }[r.medal] : 'BIEN COURU !')
        : p.from === 'penalties' ? 'TIRS AU BUT' : 'ENTRAÎNEMENT',
  );
  const big = $derived(
    p.from === 'match' ? `${r.goals ?? 0} - ${r.rivalGoals ?? 0}`
      : p.from === 'sprint' ? fmt(r.totalMs ?? 0)
        : p.from === 'penalties' ? `${r.fluent} / ${r.questions}`
          : `${r.correct} / ${r.questions}`,
  );

  onMount(() => {
    void sequence();
  });

  async function sequence() {
    await new Promise((res) => setTimeout(res, 350));
    // Etoiles une par une.
    for (let i = 1; i <= r.stars; i++) {
      shown = i;
      sfx('star', 0.9 + i * 0.02);
      haptic('good');
      await new Promise((res) => setTimeout(res, 260));
    }
    if (r.stars > 0) say('stars_won');
    if (r.stars >= 3 && root) burst(document.body, innerWidth / 2, innerHeight * 0.3, { count: 26 });
    // Trophees de zone gagnee.
    if (r.zonesWon.length) {
      await new Promise((res) => setTimeout(res, 500));
      say('trophy_won');
      await cine('trophy', { competition: trophyName(Math.max(...r.zonesWon)), name: app.state.childName });
    }
    ready = true;
    if (packs > 0) {
      say('pack_ready');
      sfx('item-get', 0.7);
    }
  }

  async function open() {
    if (opening) return;
    opening = true;
    card = null;
    const c = await openOnePack();
    card = c;
    opening = false;
    if (c) {
      say('album_new');
      if (root) burst(document.body, innerWidth / 2, innerHeight * 0.45, { count: 30, colors: [c.colors.primary, '#FFD23F', '#fff'] });
    }
  }
  function again() {
    nav.go(p.from);
  }
  void ZONES;
  void gsap;
</script>

<Stage>
  <StadiumBackdrop />
  <div class="shade"></div>
  <div bind:this={root} class="rw">
    <div class="main">
      <h1 class="disp title">{title}</h1>
      <div class="bignum disp num">{big}</div>
      <div class="stars" aria-label="{r.stars} étoiles">
        {#each [1, 2, 3, 4, 5] as i}
          <span class="st" class:on={i <= shown} class:empty={i > r.stars}><Icon name="star" size={92} /></span>
        {/each}
      </div>
      <div class="chips">
        {#if r.avgMs}<div class="chip"><Icon name="sprint" size={34} /><span class="disp num">{fmt(r.avgMs)}</span></div>{/if}
        <div class="chip"><Icon name="flame" size={34} /><span class="disp num">{r.bestStreak}</span></div>
        {#if r.newFluentFacts.length}<div class="chip good"><Icon name="check" size={32} /><span class="disp num">{r.newFluentFacts.length}</span></div>{/if}
        {#if r.newAvatarItems.length}<div class="chip good"><Icon name="shirt" size={34} /><span class="disp">NOUVEAU</span></div>{/if}
        {#if p.from === 'sprint' && r.isRecord}<div class="chip good"><Icon name="trophy" size={34} /><span class="disp">RECORD</span></div>{/if}
      </div>
      {#if ready}
        <div class="actions">
          {#if packs > 0}<GameButton id="btn-pack" size="lg" variant="go" onclick={open} disabled={opening}><Icon name="album" size={50} />Ouvrir un paquet<span class="badge disp">{packs}</span></GameButton>{/if}
          <div class="row">
            <GameButton id="btn-again" variant="pitch" size="lg" onclick={again}><Icon name="again" size={42} />Rejouer</GameButton>
            <GameButton id="btn-home" variant="night" size="lg" onclick={() => nav.go('home')}><Icon name="home" size={42} />Accueil</GameButton>
          </div>
        </div>
      {/if}
    </div>
    {#if card}
      <div class="reveal"><div class="newcard"><PlayerCard {...cardProps(card)} width={290} /></div><div class="disp cn">{card.name}</div></div>
    {/if}
  </div>
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.6), rgba(7, 12, 43, 0.82)); }
  .rw { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 56px; padding: 24px; }
  .main { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .title { margin: 0; font-size: clamp(3.4rem, 9vh, 5.4rem); line-height: 1; color: var(--jaune); text-shadow: 0 6px 0 #0A1030; text-align: center; }
  .bignum { font-size: clamp(5rem, 15vh, 8rem); line-height: 1; text-shadow: 0 7px 0 #0A1030; }
  .stars { display: flex; gap: 8px; }
  .st { display: block; transform: scale(0.35); opacity: 0.25; filter: grayscale(1) brightness(0.6); will-change: transform; transition: transform 0.35s var(--ease-pop), opacity 0.2s; }
  .st.on { transform: scale(1); opacity: 1; filter: none; }
  .st.empty:not(.on) { opacity: 0.2; }
  .chips { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .chip { display: flex; align-items: center; gap: 8px; min-height: 60px; padding: 0 20px 0 12px; border-radius: 16px; font-size: 1.9rem; background: rgba(7, 12, 43, 0.75); border: 3px solid rgba(255, 255, 255, 0.35); }
  .chip.good { border-color: #1BBF5E; }
  .actions { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 8px; }
  .row { display: flex; gap: 20px; }
  .badge { margin-left: 4px; min-width: 40px; height: 40px; border-radius: 20px; display: grid; place-items: center; background: var(--corail); color: #fff; font-size: 1.5rem; }
  .reveal { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .newcard { filter: drop-shadow(0 20px 26px rgba(0, 0, 0, 0.55)); }
  .cn { font-size: 2.2rem; text-shadow: 0 4px 0 #0A1030; }
  @media (orientation: portrait) { .rw { flex-direction: column; } }
</style>
