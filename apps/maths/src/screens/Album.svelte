<script lang="ts">
  /** Album : 48 cartes (obtenues en couleur, les autres en silhouette), ouverture de paquet (cinematique card-pack). */
  import { gsap, burst } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { openOnePack, cardProps } from '../lib/pack.ts';
  import { sfx, say } from '../lib/sound.ts';
  import { CARDS, ownsCard, packsAvailable, starsToNextPack, PACK_COST, type Card } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import PlayerCard from '../art/PlayerCard.svelte';

  const rewards = $derived(app.state.profile.rewards);
  const owned = $derived(CARDS.filter((c) => ownsCard(rewards, c.id)).length);
  const packs = $derived(packsAvailable(rewards));
  const toNext = $derived(starsToNextPack(rewards));
  let zoom = $state<Card | null>(null);
  let fresh = $state<string | null>(null);
  let opening = $state(false);
  const RARITY_ORDER = ['legende', 'or', 'argent', 'bronze'];
  const sorted = $derived([...CARDS].sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity) || a.number - b.number));
  let scroller: HTMLDivElement | undefined = $state();

  async function open() {
    if (opening || packs < 1) return;
    opening = true;
    const c = await openOnePack();
    opening = false;
    if (!c) return;
    fresh = c.id;
    zoom = c;
    say('album_new');
    burst(document.body, innerWidth / 2, innerHeight * 0.4, { count: 30, colors: [c.colors.primary, '#FFD23F', '#fff'] });
    setTimeout(() => { fresh = null; }, 2500);
  }
  function show(c: Card) {
    if (!ownsCard(rewards, c.id)) { sfx('wrong-soft', 0.4); return; }
    sfx('pop');
    zoom = c;
  }
  function pop(node: HTMLElement) {
    gsap.fromTo(node, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'cePunch' });
  }
</script>

<Stage bg="linear-gradient(160deg, #0E1A55, #070C2B)">
  <div class="al">
    <header>
      <GameButton size="icon" variant="ghost" label="Retour" onclick={() => nav.go('home')}><Icon name="home" size={36} /></GameButton>
      <h1 class="disp">Album</h1>
      <div class="count disp num">{owned}<small>/ {CARDS.length}</small></div>
      <div class="prog" aria-label="Étoiles vers le prochain paquet"><Icon name="star" size={34} /><span class="barw"><i style:width="{((PACK_COST - toNext) / PACK_COST) * 100}%"></i></span></div>
      <GameButton id="btn-open-pack" variant="go" size="md" disabled={packs < 1 || opening} onclick={open}><Icon name="album" size={40} />Paquet{#if packs > 0}<span class="badge disp">{packs}</span>{/if}</GameButton>
    </header>
    <div bind:this={scroller} class="grid" role="list">
      {#each sorted as c (c.id)}
        {@const has = ownsCard(rewards, c.id)}
        <button type="button" class="slot" class:new={fresh === c.id} role="listitem" aria-label={has ? c.name : 'Carte à découvrir'} onclick={() => show(c)}>
          {#if has}<PlayerCard {...cardProps(c)} width={150} shine={false} />
          {:else}<div class="sil {c.rarity}"><span class="disp">?</span></div>{/if}
        </button>
      {/each}
    </div>
  </div>

  {#if zoom}
    <div class="zoom" role="dialog" aria-label={zoom.name} onpointerdown={() => (zoom = null)} use:pop>
      <div class="zc"><PlayerCard {...cardProps(zoom)} width={330} /></div>
      <div class="disp zn">{zoom.name}</div>
    </div>
  {/if}
</Stage>

<style>
  .al { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 14px; padding: max(14px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right)) 0 max(24px, env(safe-area-inset-left)); }
  header { display: flex; align-items: center; gap: 22px; }
  h1 { margin: 0; font-size: 3.4rem; text-shadow: 0 5px 0 #0A1030; }
  .count { font-size: 3rem; color: var(--jaune); display: flex; align-items: baseline; gap: 6px; }
  .count small { font-size: 1.6rem; opacity: 0.8; }
  .prog { display: flex; align-items: center; gap: 8px; flex: 1; max-width: 260px; }
  .barw { flex: 1; height: 14px; border-radius: 7px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
  .barw i { display: block; height: 100%; background: var(--jaune); }
  .badge { margin-left: 8px; min-width: 38px; height: 38px; border-radius: 19px; display: grid; place-items: center; background: var(--corail); color: #fff; font-size: 1.4rem; }
  .grid { flex: 1; overflow-y: auto; overscroll-behavior: contain; touch-action: pan-y; display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px 14px; justify-items: center; align-content: start; padding: 6px 4px 40px; -webkit-overflow-scrolling: touch; }
  .slot { border: 0; background: none; padding: 0; cursor: pointer; line-height: 0; transition: transform 140ms var(--ease-pop); filter: drop-shadow(0 8px 8px rgba(0, 0, 0, 0.4)); }
  .slot:active { transform: scale(0.95); transition: none; }
  .slot.new { animation: glow 0.8s ease-in-out 3; }
  @keyframes glow { 50% { transform: scale(1.08); } }
  .sil { position: relative; width: 150px; height: 210px; display: grid; place-items: center; clip-path: polygon(11% 0, 89% 0, 100% 8%, 100% 82%, 92% 92%, 55% 100%, 45% 100%, 8% 92%, 0 82%, 0 8%); background: linear-gradient(160deg, #2A3578, #131B4A); }
  .sil::after { content: ''; position: absolute; inset: 5px; clip-path: inherit; background: linear-gradient(160deg, #1B2358, #0C1235); }
  .sil span { position: relative; z-index: 1; font-size: 4.4rem; color: rgba(255, 255, 255, 0.28); }
  .sil.or { background: linear-gradient(160deg, #8A6A12, #4B3A08); }
  .sil.legende { background: linear-gradient(160deg, #6A3FB8, #2C1860); }
  .sil.argent { background: linear-gradient(160deg, #6B7488, #3A4152); }
  .sil.bronze { background: linear-gradient(160deg, #8A5A34, #4A2D18); }
  .zoom { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: rgba(7, 12, 43, 0.88); }
  .zc { filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.6)); }
  .zn { font-size: 2.4rem; text-shadow: 0 4px 0 #0A1030; }
  @media (prefers-reduced-motion: reduce) { .slot.new { animation: none; } }
</style>
