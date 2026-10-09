<script lang="ts">
  /** Premier lancement : prenom (saisi par le parent) -> club (nom, couleurs, blason) -> joueur (apercu anime) -> cinematique intro-club. */
  import { onMount } from 'svelte';
  import { gsap } from '@ce/core';
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { cine, preload } from '../lib/cine.ts';
  import { CLUB_NAMES, COLOR_CHOICES, initialsFor, teamOf } from '../lib/teams.ts';
  import { say, sayText, sfx, haptic } from '../lib/sound.ts';
  import { defaultClub, defaultLook, type AvatarLook, type Club, type CrestPattern, type HairStyle } from '../state/model.ts';
  import { SKINS, HAIRS, bust } from '../art/core/ceart.js';
  import Stage from '../ui/Stage.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import Player from '../art/Player.svelte';
  import Crest from '../art/Crest.svelte';
  import Ball from '../art/Ball.svelte';

  let step = $state(0);
  let name = $state(app.state.setupDone ? app.state.childName : '');
  let club = $state<Club>({ ...defaultClub(), name: CLUB_NAMES[0], initials: initialsFor(CLUB_NAMES[0]) });
  let look = $state<AvatarLook>({ ...defaultLook() });
  let nameIdx = 0;
  let pose = $state<'idle' | 'celebration'>('idle');
  let busy = $state(false);

  const HAIRS_STYLE: HairStyle[] = ['court', 'boucles', 'pique', 'long'];
  const PATTERNS: CrestPattern[] = ['auto', 'stripes', 'band', 'chevron', 'split', 'plain'];
  const VOICES = ['setup_name', 'setup_club', 'setup_avatar'];

  onMount(() => {
    preload('intro-club');
    say(VOICES[0]);
  });

  function goStep(n: number) {
    step = n;
    sfx('swoosh-in', 0.6);
    say(VOICES[n]);
    gsap.fromTo('.panel-in', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'ceSnap', clearProps: 'transform' });
  }
  function bump() {
    pose = 'celebration';
    setTimeout(() => (pose = 'idle'), 650);
  }
  function pick<T>(set: (v: T) => void, v: T) {
    haptic('tap');
    sfx('select', 0.8);
    set(v);
    bump();
  }
  function reroll() {
    nameIdx = (nameIdx + 1 + Math.floor(Math.random() * (CLUB_NAMES.length - 1))) % CLUB_NAMES.length;
    club.name = CLUB_NAMES[nameIdx];
    club.initials = initialsFor(club.name);
    sfx('pop');
    haptic('tap');
  }
  function onClubName() {
    club.initials = initialsFor(club.name);
  }
  const changeNumber = (d: number) => {
    look.number = Math.min(99, Math.max(1, look.number + d));
    sfx('tick');
    haptic('tap');
  };

  async function finish() {
    if (busy) return;
    busy = true;
    app.completeSetup(name, club, look);
    const first = name.trim() || 'Léo';
    sayText(`Bienvenue au club, ${first} !`);
    await cine('intro-club', { name: app.state.childName, club: teamOf(app.state.club) });
    nav.go('placement');
  }
  const canNext = $derived(step === 0 ? name.trim().length > 0 : step === 1 ? club.name.trim().length > 0 : true);
  const titles = ['Ton prénom', 'Ton club', 'Ton joueur'];
</script>

<Stage>
  <StadiumBackdrop />
  <div class="shade"></div>
  <div class="setup">
    <header>
      <div class="steps" aria-label="Étape {step + 1} sur 3">
        {#each [0, 1, 2] as i}<span class="pip" class:on={i === step} class:done={i < step}></span>{/each}
      </div>
      <h1 class="disp">{titles[step]}</h1>
    </header>

    <section class="preview">
      {#if step === 0}
        <div class="logo"><Ball width={150} spin /><div class="disp brand">Calcul<br />Champion</div></div>
      {:else if step === 1}
        <div class="crestbig"><Crest primary={club.primary} secondary={club.secondary} initials={club.initials} pattern={club.pattern} width={290} /></div>
        <div class="clubname disp">{club.name}</div>
      {:else}
        <Player primary={club.primary} secondary={club.secondary} skin={look.skin} hair={look.hair} hairColor={look.hairColor} number={look.number} {pose} motion="idle" width={300} />
        <div class="crestsmall"><Crest primary={club.primary} secondary={club.secondary} initials={club.initials} pattern={club.pattern} width={74} /></div>
      {/if}
    </section>

    <section class="controls panel-in">
      {#if step === 0}
        <label class="field">
          <span class="hint">Un grand écrit le prénom</span>
          <input id="child-name" class="big" bind:value={name} maxlength="16" autocomplete="off" placeholder="Prénom" onkeydown={(e) => e.key === 'Enter' && canNext && goStep(1)} />
        </label>
      {:else if step === 1}
        <div class="namerow">
          <input id="club-name" class="big club" bind:value={club.name} maxlength="22" autocomplete="off" aria-label="Nom du club" oninput={onClubName} />
          <GameButton variant="cyan" size="icon" label="Autre nom" onclick={reroll} sound="pop"><svg viewBox="0 0 48 48" width="38" height="38" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="9" fill="currentColor" /><g fill="#fff"><circle cx="16" cy="16" r="3.6" /><circle cx="32" cy="16" r="3.6" /><circle cx="24" cy="24" r="3.6" /><circle cx="16" cy="32" r="3.6" /><circle cx="32" cy="32" r="3.6" /></g></svg></GameButton>
        </div>
        <div class="group"><div class="gl">Maillot</div>
          <div class="swatches">{#each COLOR_CHOICES as c}<button type="button" class="sw" class:sel={club.primary === c} style:background={c} aria-label="Couleur {c}" onclick={() => pick((v) => (club.primary = v), c)}></button>{/each}</div></div>
        <div class="group"><div class="gl">Détails</div>
          <div class="swatches">{#each COLOR_CHOICES as c}<button type="button" class="sw" class:sel={club.secondary === c} style:background={c} aria-label="Couleur {c}" onclick={() => pick((v) => (club.secondary = v), c)}></button>{/each}</div></div>
        <div class="group"><div class="gl">Blason</div>
          <div class="patterns">{#each PATTERNS as p}<button type="button" class="pat" class:sel={club.pattern === p} aria-label="Motif {p}" onclick={() => pick((v) => (club.pattern = v), p)}><Crest primary={club.primary} secondary={club.secondary} initials={club.initials} pattern={p} width={64} /></button>{/each}</div></div>
      {:else}
        <div class="group"><div class="gl">Peau</div>
          <div class="swatches">{#each SKINS as c, i}<button type="button" class="sw" class:sel={look.skin === i} style:background={c} aria-label="Peau {i + 1}" onclick={() => pick((v) => (look.skin = v), i)}></button>{/each}</div></div>
        <div class="group"><div class="gl">Coiffure</div>
          <div class="patterns">{#each HAIRS_STYLE as h}<button type="button" class="pat bustbtn" class:sel={look.hair === h} aria-label="Coiffure {h}" onclick={() => pick((v) => (look.hair = v), h)}>{@html bust({ skin: look.skin, hair: h, hairColor: look.hairColor, primary: club.primary, secondary: club.secondary })}</button>{/each}</div></div>
        <div class="group"><div class="gl">Cheveux</div>
          <div class="swatches">{#each HAIRS as c, i}<button type="button" class="sw" class:sel={look.hairColor === i} style:background={c} aria-label="Couleur de cheveux {i + 1}" onclick={() => pick((v) => (look.hairColor = v), i)}></button>{/each}</div></div>
        <div class="group"><div class="gl">Numéro</div>
          <div class="numrow">
            <GameButton variant="night" size="icon" label="Moins" onclick={() => changeNumber(-1)}>−</GameButton>
            <div class="numv disp num">{look.number}</div>
            <GameButton variant="night" size="icon" label="Plus" onclick={() => changeNumber(1)}>+</GameButton>
            {#each [7, 9, 10, 11] as n}<button type="button" class="q disp" class:sel={look.number === n} onclick={() => pick((v) => (look.number = v), n)}>{n}</button>{/each}
          </div></div>
      {/if}

      <div class="nav">
        {#if step > 0}<GameButton variant="ghost" size="lg" label="Retour" onclick={() => goStep(step - 1)}>←</GameButton>{/if}
        {#if step < 2}
          <GameButton id="btn-next" size="lg" disabled={!canNext} onclick={() => goStep(step + 1)}>Suivant <Icon name="play" size={34} /></GameButton>
        {:else}
          <GameButton id="btn-start" size="lg" variant="pitch" disabled={busy} onclick={finish}>C'est parti ! <Icon name="ball" size={44} /></GameButton>
        {/if}
      </div>
    </section>
  </div>
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.72), rgba(7, 12, 43, 0.55) 40%, rgba(7, 12, 43, 0.82)); }
  .setup { position: absolute; inset: 0; display: grid; grid-template-columns: 0.9fr 1.1fr; grid-template-rows: auto 1fr; column-gap: 30px; padding: max(18px, env(safe-area-inset-top)) max(34px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(34px, env(safe-area-inset-left)); }
  header { grid-column: 1 / -1; display: flex; align-items: center; gap: 24px; }
  h1 { margin: 0; font-size: 3.4rem; text-shadow: 0 5px 0 #0A1030; }
  .steps { display: flex; gap: 10px; }
  .pip { width: 46px; height: 14px; border-radius: 7px; background: rgba(255, 255, 255, 0.25); transform: skewX(-18deg); transition: transform 0.2s, background 0.2s; }
  .pip.on { background: var(--jaune); transform: skewX(-18deg) scaleX(1.25); }
  .pip.done { background: #1BBF5E; }
  .preview { display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; gap: 14px; }
  .logo { display: flex; align-items: center; gap: 24px; }
  .brand { font-size: 4.6rem; line-height: 0.95; color: var(--jaune); text-shadow: 0 6px 0 #0A1030; transform: rotate(-3deg); }
  .crestbig { filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.5)); }
  .clubname { font-size: 2.8rem; text-align: center; text-shadow: 0 4px 0 #0A1030; line-height: 1.05; }
  .crestsmall { position: absolute; right: 8%; top: 6%; }
  .controls { display: flex; flex-direction: column; justify-content: center; gap: 18px; min-height: 0; }
  .field { display: flex; flex-direction: column; gap: 10px; }
  .hint { font-size: 1.3rem; font-weight: 600; opacity: 0.85; }
  .big { width: 100%; min-height: 96px; padding: 0 28px; border: 0; border-radius: 22px; font: 400 3.4rem var(--f-display); color: var(--encre); background: #fff; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.35); -webkit-user-select: text; user-select: text; }
  .big.club { font-size: 2.6rem; min-height: 84px; }
  .big:focus { outline: 5px solid var(--jaune); }
  .namerow { display: flex; gap: 16px; align-items: flex-start; }
  .gl { font-weight: 700; font-size: 1.15rem; opacity: 0.8; margin-bottom: 6px; }
  .swatches, .patterns { display: flex; flex-wrap: wrap; gap: 9px; }
  .sw { width: 54px; height: 54px; border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.55); cursor: pointer; padding: 0; box-shadow: 0 5px 0 rgba(0, 0, 0, 0.4); transition: transform 140ms var(--ease-pop); }
  .sw.sel { border-color: #fff; transform: scale(1.18); box-shadow: 0 0 0 5px var(--jaune), 0 5px 0 rgba(0, 0, 0, 0.4); }
  .sw:active { transform: scale(0.92); transition: none; }
  .pat { min-width: 76px; min-height: 76px; border-radius: 16px; border: 4px solid transparent; background: rgba(255, 255, 255, 0.14); cursor: pointer; display: grid; place-items: center; padding: 4px; line-height: 0; transition: transform 140ms var(--ease-pop); }
  .pat.sel { border-color: var(--jaune); background: rgba(255, 210, 63, 0.22); transform: scale(1.08); }
  .pat:active { transform: scale(0.94); transition: none; }
  .bustbtn :global(svg) { width: 84px; height: auto; }
  .numrow { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .numv { min-width: 100px; text-align: center; font-size: 4rem; line-height: 1; text-shadow: 0 4px 0 #0A1030; }
  .q { min-width: 64px; min-height: 64px; border-radius: 14px; border: 0; font-size: 1.8rem; color: #fff; background: rgba(255, 255, 255, 0.18); cursor: pointer; }
  .q.sel { background: var(--jaune); color: var(--encre); }
  .nav { display: flex; gap: 18px; justify-content: flex-end; margin-top: 4px; }
  @media (orientation: portrait) { .setup { grid-template-columns: 1fr; grid-template-rows: auto 38% 1fr; } }
</style>
