<script lang="ts">
  /** Accueil "Stade du club" : stade vivant, avatar, blason, gros bouton MATCH, modes, etoiles, serie, album / trophees. */
  import { onMount } from 'svelte';
  import { gsap, countUp } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { kitColors } from '../lib/kit.ts';
  import { applyAudioSettings, sfx, say } from '../lib/sound.ts';
  import { packsAvailable, starsToNextPack, PACK_COST, ZONES, isZoneWon } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import Player from '../art/Player.svelte';
  import Crest from '../art/Crest.svelte';
  import Ball from '../art/Ball.svelte';
  import ParentEntry from '../parent/ParentEntry.svelte';
  import { hasStrategy, playStrategy } from '../lib/cine.ts';
  import { softMotion } from '../lib/motion.ts';

  const club = $derived(app.state.club);
  const look = $derived(app.state.look);
  const kit = $derived(kitColors());
  const rewards = $derived(app.state.profile.rewards);
  const progress = $derived(app.state.profile.progress);
  const packs = $derived(packsAvailable(rewards));
  const toNext = $derived(starsToNextPack(rewards));
  const starsInPack = $derived(PACK_COST - toNext);
  const streak = $derived(rewards.streak.current);
  const musicOn = $derived(app.state.settings.music && app.state.settings.sound);

  let pose = $state<'idle' | 'celebration'>('idle');
  let matchBtn: HTMLDivElement | undefined = $state();
  let starNum: HTMLSpanElement | undefined = $state();
  let avatarBox: HTMLDivElement | undefined = $state();

  onMount(() => {
    applyAudioSettings();
    // 1re arrivee sur une zone : le Coach explique sa strategie (une fois par zone), sinon accueil vocal habituel.
    const zone = app.state.profile.progress.focusZone;
    let strat: ReturnType<typeof setTimeout> | undefined;
    if (app.state.setupDone && app.state.placementDone && !app.state.strategySeen.includes(zone) && hasStrategy(zone)) {
      app.markStrategySeen(zone);
      strat = setTimeout(() => void playStrategy(zone), 700);
    } else say('home_welcome');
    const ctx = gsap.context(() => {
      // Entree orchestree : l'avatar glisse, le bouton MATCH claque, puis il "respire".
      gsap.from('.home-avatar', { x: -120, opacity: 0, duration: 0.6, ease: 'ceSnap', delay: 0.15 });
      gsap.from('.stagger', { y: 40, opacity: 0, duration: 0.45, ease: 'ceSnap', stagger: 0.07, delay: 0.25 });
      if (matchBtn) {
        gsap.from(matchBtn, { scale: 0.6, opacity: 0, duration: 0.5, ease: 'cePunch', delay: 0.2 });
        if (!softMotion()) gsap.to(matchBtn, { scale: 1.035, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.9 });
      }
    });
    if (starNum) countUp(starNum, rewards.stars - rewards.starsSpent, { duration: 0.8 });
    return () => { clearTimeout(strat); ctx.revert(); };
  });

  function cheer() {
    sfx('pop');
    pose = 'celebration';
    if (avatarBox) gsap.fromTo(avatarBox, { y: 0 }, { y: -18, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
    setTimeout(() => (pose = 'idle'), 900);
  }
  function toggleMusic() {
    app.setSettings({ music: !app.state.settings.music, sound: app.state.settings.music ? app.state.settings.sound : true });
    applyAudioSettings();
  }
  const go = (s: Parameters<typeof nav.go>[0]) => () => nav.go(s);
</script>

<Stage>
  <StadiumBackdrop />
  <div class="shade"></div>

  <header class="top">
    <div class="club stagger">
      <Crest primary={club.primary} secondary={club.secondary} initials={club.initials} pattern={club.pattern} width={84} />
      <div class="names"><div class="cn disp">{club.name}</div><div class="kid">{app.state.childName}</div></div>
    </div>
    <div class="chips stagger">
      <div class="chip" aria-label="Étoiles">
        <Icon name="star" size={34} /><span class="disp num" bind:this={starNum}>{rewards.stars - rewards.starsSpent}</span>
        <span class="mini" aria-label="Avancée vers le prochain paquet"><i style:width="{(starsInPack / PACK_COST) * 100}%"></i></span>
      </div>
      <div class="chip" aria-label="Jours de suite"><Icon name="flame" size={34} /><span class="disp num">{streak}</span></div>
      <GameButton size="icon" variant="ghost" label={musicOn ? 'Couper la musique' : 'Remettre la musique'} onclick={toggleMusic}><Icon name={musicOn ? 'music' : 'musicoff'} size={34} /></GameButton>
      <div class="parent"><ParentEntry /></div>
    </div>
  </header>

  <div bind:this={avatarBox} class="home-avatar">
    <button type="button" class="avatar-btn" onclick={cheer} aria-label="Ton joueur">
      <Player primary={kit.primary} secondary={kit.secondary} shoe={kit.shoe} skin={look.skin} hair={look.hair} hairColor={look.hairColor} number={look.number} {pose} motion="idle" width={330} />
    </button>
    <div class="ball"><Ball width={70} spin /></div>
  </div>

  <main class="menu">
    <div bind:this={matchBtn} class="matchwrap"><GameButton id="btn-match" size="xl" variant="go" onclick={go('match')}><Icon name="ball" size={78} />MATCH</GameButton></div>
    <div class="modes stagger">
      <GameButton id="btn-sprint" size="lg" variant="night" onclick={go('sprint')}><Icon name="sprint" size={46} />Sprint 100 m</GameButton>
      <GameButton id="btn-penalties" size="lg" variant="night" onclick={go('penalties')}><Icon name="goal" size={46} />Tirs au but</GameButton>
    </div>
    <div class="modes stagger">
      <GameButton id="btn-training" size="lg" variant="pitch" onclick={go('training')}><Icon name="train" size={44} />Entraînement</GameButton>
    </div>
  </main>

  <footer class="bottom">
    <div class="route stagger" aria-label="Route des zones">
      {#each ZONES as z}
        <span class="dot" class:won={isZoneWon(progress, z.id)} class:cur={z.id === progress.focusZone} class:lock={z.id > progress.maxUnlocked}>{z.id}</span>
      {/each}
    </div>
    <div class="dock stagger">
      <GameButton id="btn-album" variant="cyan" size="md" onclick={go('album')}>
        <Icon name="album" size={38} />Album
        {#if packs > 0}<span class="badge disp">{packs}</span>{/if}
      </GameButton>
      <GameButton id="btn-trophies" variant="cyan" size="md" onclick={go('trophies')}><Icon name="trophy" size={38} />Trophées</GameButton>
      <GameButton id="btn-avatar" variant="cyan" size="md" onclick={go('avatar')}><Icon name="shirt" size={38} />Joueur</GameButton>
    </div>
  </footer>
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: radial-gradient(ellipse at 28% 78%, rgba(7, 12, 43, 0) 20%, rgba(7, 12, 43, 0.55) 80%), linear-gradient(rgba(7, 12, 43, 0.5), transparent 28%); pointer-events: none; }
  .top { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: flex-start; padding: max(14px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) 0 max(22px, env(safe-area-inset-left)); }
  .club { display: flex; align-items: center; gap: 14px; }
  .cn { font-size: 2.3rem; line-height: 1; text-shadow: 0 4px 0 #0A1030; }
  .kid { font-weight: 700; font-size: 1.35rem; color: var(--jaune); text-shadow: 0 2px 0 #0A1030; }
  .chips { display: flex; gap: 12px; align-items: center; }
  .chip { display: flex; align-items: center; gap: 8px; min-height: 64px; padding: 0 18px 0 12px; border-radius: 16px; background: rgba(7, 12, 43, 0.72); border: 3px solid rgba(255, 255, 255, 0.35); font-size: 2rem; }
  .mini { width: 54px; height: 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
  .mini i { display: block; height: 100%; background: var(--jaune); transform-origin: 0 50%; }
  .parent { margin-left: 4px; }
  .home-avatar { position: absolute; left: clamp(30px, 6vw, 90px); bottom: clamp(96px, 15vh, 130px); }
  .avatar-btn { border: 0; background: none; padding: 0; cursor: pointer; filter: drop-shadow(0 18px 14px rgba(0, 0, 0, 0.45)); }
  .ball { position: absolute; right: -52px; bottom: 6px; }
  .menu { position: absolute; right: clamp(26px, 5vw, 70px); top: 17%; display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }
  .matchwrap { transform-origin: 100% 50%; will-change: transform; }
  .modes { display: flex; gap: 18px; }
  .bottom { position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 max(22px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(22px, env(safe-area-inset-left)); gap: 16px; }
  .route { display: flex; gap: 8px; margin-bottom: 18px; padding: 10px 14px; border-radius: 40px; background: rgba(7, 12, 43, 0.7); }
  .dot { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; font: 400 1.05rem var(--f-display); background: rgba(255, 255, 255, 0.18); color: #fff; }
  .dot.won { background: var(--jaune); color: var(--encre); }
  .dot.cur { background: #1BBF5E; box-shadow: 0 0 0 4px rgba(27, 191, 94, 0.45); }
  .dot.lock { opacity: 0.4; }
  .dock { display: flex; gap: 16px; }
  .badge { position: absolute; top: -8px; right: -6px; z-index: 2; min-width: 38px; height: 38px; border-radius: 19px; display: grid; place-items: center; background: var(--corail); color: #fff; font-size: 1.4rem; border: 3px solid #fff; transform: skewX(8deg); }
  @media (orientation: portrait) {
    .menu { right: 50%; transform: translateX(50%); top: 14%; align-items: center; }
    .home-avatar { left: 50%; transform: translateX(-50%); bottom: 24%; }
    .bottom { flex-direction: column; align-items: center; }
  }
</style>
