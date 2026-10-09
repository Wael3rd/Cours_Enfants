<script lang="ts">
  /** Premier lancement : titre -> prenom -> avatar -> prologue (scene de dialogue) -> carte. */
  import { onMount } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { nav } from '../ui/nav.svelte';
  import { say, ui } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import { AVATAR_TIPOS, TONES, TONE_COLORS, avatarKey, avatarUrl, accentOf, parseAvatar, portraitOf, character } from '../ui/avatar';
  import { papelPicado, quetzal as quetzalSvg, sombra as sombraSvg, academiaRoom } from '../art/core/qart.js';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';
  import SombraFigure from '../art/SombraFigure.svelte';
  import DialogBox from '../art/DialogBox.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import Panel from '../art/Panel.svelte';
  import AccentBar from '../ui/AccentBar.svelte';
  import HintBubble from '../ui/HintBubble.svelte';
  import Emoji from '../ui/Emoji.svelte';

  type Phase = 'title' | 'name' | 'avatar' | 'prologue';
  let phase = $state<Phase>('title');
  let name = $state(game.state.profile.name);
  let tipo = $state(parseAvatar(game.state.profile.avatar.base).tipo.id);
  let tone = $state(parseAvatar(game.state.profile.avatar.base).tone);
  let hint = $state('');
  let line = $state(0);
  let root: HTMLElement | undefined = $state();
  let quetzal: QuetzalMascot | undefined = $state();
  let dlg: DialogBox | undefined = $state();
  let nameBar: AccentBar | undefined = $state();

  const picado = papelPicado({ w: 1600, h: 170, n: 11, uid: 'welc' });
  const room = academiaRoom({ uid: 'wroom' });
  const roomBack = (room.back as string).replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ');
  const bust = quetzalSvg({ width: 190, height: 190, view: '210 50 220 220' });
  const sombraBust = sombraSvg({ width: 190, height: 228 });

  /** Prologue : voix deja generees (u01-q01), traductions = Pista. */
  const PROLOGO = [
    { who: 'ignacio', es: '¡Bienvenido a la Academia de Viajeros! Me llamo Ignacio.', fr: "Bienvenue à l'Académie des Voyageurs ! Je m'appelle Ignacio.", audio: 'ignacio.29234dcc48', pose: 'perched' },
    { who: 'ignacio', es: 'Mira, es el Quetzal. Está muy cansado.', fr: "Regarde, c'est le Quetzal. Il est très fatigué.", audio: 'ignacio.81ef280a77', pose: 'sad' },
    { who: 'quetzal', es: 'Hola… Sin plumas… no puedo volar.', fr: 'Salut… Sans plumes… je ne peux pas voler.', audio: 'quetzal.4f370da724', pose: 'sad' },
    { who: 'ignacio', es: 'La Sombra del Silencio tiene las plumas del Quetzal. Quiere un mundo sin palabras.', fr: "L'Ombre du Silence a les plumes du Quetzal. Elle veut un monde sans mots.", audio: 'ignacio.4fdd5d6698', pose: 'sad', sombra: true },
    { who: 'quetzal', es: '¡Ayúdame, por favor!', fr: "Aide-moi, s'il te plaît !", audio: 'quetzal.4311b250d5', pose: 'talk' },
    { who: 'ignacio', es: 'La primera pluma está en Madrid. ¡Vamos!', fr: 'La première plume est à Madrid. En route !', audio: 'ignacio.2a6f7adb29', pose: 'happy' },
  ];
  const cur = $derived(PROLOGO[line]);

  onMount(() => {
    music.setMode('menu');
    if (!root || prefersReducedMotion()) return;
    gsap.from(root.querySelectorAll('.in'), { y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
  });

  function go(p: Phase) {
    sfx('in', 0.6);
    phase = p;
    requestAnimationFrame(() => {
      if (root && !prefersReducedMotion()) gsap.from(root.querySelectorAll('.in'), { y: 36, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', clearProps: 'all' });
      if (p === 'name') say('ignacio.a49859644c', 'Y tú, ¿cómo te llamas?');
      if (p === 'prologue') playLine();
    });
  }

  function saveName() {
    const n = name.trim();
    if (!n) {
      nameBar?.shake();
      sfx('wrong');
      return;
    }
    game.mutate((s) => (s.profile.name = n.slice(0, 24)));
    go('avatar');
  }

  function saveAvatar() {
    game.mutate((s) => (s.profile.avatar.base = avatarKey(tipo, tone)));
    sfx('item');
    go('prologue');
  }

  function playLine() {
    const l = PROLOGO[line];
    say(l.audio, l.es);
    if (l.pose === 'talk') quetzal?.talk(1.6);
    if (l.pose === 'happy') quetzal?.flap(2);
  }

  function next() {
    haptic('tap');
    if (line < PROLOGO.length - 1) {
      line += 1;
      sfx('page', 0.6);
      playLine();
    } else finish();
  }

  function finish() {
    game.mutate((s) => (s.flags.prologue = '1'));
    sfx('win', 0.7);
    nav.go({ name: 'map' }, { root: true });
  }

  const lentoSay = () => say(cur.audio, cur.es, { lento: true });
</script>

<div class="scr welc" bind:this={root}>
  {#if phase === 'title'}
    <div class="bg night"></div>
    <div class="picado">{@html picado}</div>
    <div class="titlebox">
      <div class="in bird"><QuetzalMascot pose="sad" bare branch width={300} /></div>
      <div class="in tt">
        <p class="kick">Español · 5º</p>
        <h1 class="h-rpg">La Leyenda<br />del Quetzal</h1>
        <p class="tag">Las plumas se han perdido. Tú vas a encontrarlas.</p>
      </div>
      <div class="in cta"><PrimaryButton size="lg" onclick={() => go('name')}>¡Empezar!</PrimaryButton></div>
    </div>
  {:else if phase === 'name'}
    <div class="bg night"></div>
    <div class="picado small">{@html picado}</div>
    <div class="col">
      <div class="in"><DialogBox name="Don Ignacio" portrait={portraitOf('ignacio')} text="Y tú, ¿cómo te llamas?" accent={accentOf('ignacio')} onaudio={() => say('ignacio.a49859644c', 'Y tú, ¿cómo te llamas?')} onslow={() => say('ignacio.a49859644c', 'Y tú, ¿cómo te llamas?', { lento: true })} onhint={() => (hint = 'Et toi, comment tu t’appelles ? — Écris ton prénom.')} /></div>
      <div class="in form">
        <AccentBar bind:this={nameBar} bind:value={name} big capitalize autofocus placeholder="Me llamo…" label="Tu nombre" onenter={saveName} maxlength={24} />
        <div class="cta2"><PrimaryButton variant="turquesa" disabled={!name.trim()} onclick={saveName}>{name.trim() ? `Me llamo ${name.trim()}` : 'Me llamo…'}</PrimaryButton></div>
      </div>
    </div>
  {:else if phase === 'avatar'}
    <div class="bg night"></div>
    <div class="picado small">{@html picado}</div>
    <div class="avatar">
      <div class="in stage">
        <div class="halo"></div>
        <div class="pedestal"></div>
        {#key avatarKey(tipo, tone)}<img class="big" src={avatarUrl(avatarKey(tipo, tone))} alt="" draggable="false" />{/key}
        <div class="nameplate"><span>{name.trim() || 'Viajero'}</span></div>
      </div>
      <div class="in pick">
        <Panel padding="26px 30px">
          <h2 class="h-rpg">Elige tu viajero</h2>
          <div class="tipos">
            {#each AVATAR_TIPOS as t}
              <button type="button" class="tp" class:on={tipo === t.id} onclick={() => { tipo = t.id; haptic('tap'); sfx('select', 0.7); }} aria-label={t.label}>
                <Emoji e={t.emoji + TONES[tone]} size={92} />
              </button>
            {/each}
          </div>
          <div class="tones" role="group" aria-label="Color de piel">
            {#each TONE_COLORS as c, i}
              <button type="button" class="tn" class:on={tone === i} style:--c={c} onclick={() => { tone = i; haptic('tap'); sfx('select', 0.7); }} aria-label={`Tono ${i + 1}`}></button>
            {/each}
          </div>
          <div class="go"><PrimaryButton onclick={saveAvatar}>¡Listo!</PrimaryButton></div>
        </Panel>
      </div>
    </div>
  {:else}
    <div class="room">{@html roomBack}</div>
    <div class="shade"></div>
    <div class="actors">
      <div class="actor left">{#key cur.pose === 'sad' || cur.pose === 'perched'}<QuetzalMascot bind:this={quetzal} pose={cur.pose as never} bare branch width={330} />{/key}</div>
      {#if cur.sombra}<div class="actor right"><SombraFigure width={300} arm /></div>{/if}
    </div>
    <div class="dlgwrap in">
      {#key line}
        <DialogBox
          bind:this={dlg}
          name={character(cur.who)?.nombre ?? cur.who}
          portrait={cur.who === 'quetzal' ? undefined : portraitOf(cur.who)}
          portraitSvg={cur.who === 'quetzal' ? bust : undefined}
          accent={accentOf(cur.who)}
          text={cur.es}
          onaudio={() => say(cur.audio, cur.es)}
          onslow={lentoSay}
          onhint={() => (hint = cur.fr)}
        />
      {/key}
      <div class="nx"><PrimaryButton onclick={next}>{line < PROLOGO.length - 1 ? 'Siguiente' : '¡Vamos!'}</PrimaryButton></div>
    </div>
  {/if}
  {#if hint}<HintBubble text={hint} onclose={() => (hint = '')} />{/if}
</div>

<style>
  .welc { z-index: 1; }
  .bg { position: absolute; inset: 0; }
  .night { background: radial-gradient(ellipse at 50% 70%, #3b2a8a 0%, #1d2160 40%, #0b0d2a 90%); }
  .picado { position: absolute; left: 0; right: 0; top: 0; height: 170px; overflow: hidden; pointer-events: none; }
  .picado :global(svg) { width: 100%; height: auto; display: block; }
  .picado.small { height: 110px; opacity: 0.9; }
  .titlebox { position: relative; flex: 1; display: grid; grid-template-columns: auto 1fr; grid-template-rows: 1fr auto; align-items: center; gap: 0 56px; padding: 150px 90px 56px 110px; }
  .bird { grid-row: 1; }
  .tt { grid-row: 1; }
  .kick { margin: 0 0 8px; font: 900 26px var(--q-font-body); color: var(--q-turquesa); letter-spacing: 0.04em; }
  h1 { font-size: clamp(64px, 8.4vw, 118px); line-height: 0.98; }
  .tag { margin: 22px 0 0; max-width: 560px; font: 800 30px/1.35 var(--q-font-body); color: var(--q-papel); }
  .cta { grid-column: 1 / -1; justify-self: end; }
  .col { position: relative; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 22px; padding: 70px 100px 24px; max-width: 1280px; width: 100%; margin: 0 auto; }
  .form { display: grid; gap: 14px; padding: 0 20px; }
  .cta2 { justify-self: center; }
  .avatar { position: relative; flex: 1; display: grid; grid-template-columns: 1fr 1.1fr; align-items: center; gap: 30px; padding: 96px 70px 24px; }
  .stage { position: relative; height: 560px; display: grid; place-items: end center; }
  .halo { position: absolute; left: 50%; bottom: 60px; width: 520px; height: 520px; margin-left: -260px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255, 200, 61, 0.55), rgba(255, 200, 61, 0)); }
  .pedestal { position: absolute; bottom: 40px; left: 50%; width: 360px; height: 70px; margin-left: -180px; border-radius: 50%; background: radial-gradient(closest-side, rgba(11, 13, 42, 0.8), transparent); }
  .big { position: relative; width: 420px; height: 420px; margin-bottom: 70px; object-fit: contain; filter: drop-shadow(0 18px 0 rgba(0, 0, 0, 0.25)); animation: pop 0.45s cubic-bezier(0.2, 1.6, 0.4, 1); }
  @keyframes pop { from { transform: scale(0.7) translateY(30px); opacity: 0; } }
  .nameplate { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%) rotate(-1.5deg); }
  .nameplate span { display: inline-block; padding: 8px 34px 10px; font: 400 36px/1 var(--q-font-title); color: var(--q-nuit); background: linear-gradient(180deg, #ffe08a, var(--q-sol)); border-radius: 14px; box-shadow: 0 5px 0 #6b3d08, inset 0 0 0 3px rgba(255, 255, 255, 0.4); }
  .pick h2 { font-size: 40px; margin-bottom: 18px; }
  .tipos { display: flex; gap: 16px; justify-content: center; }
  .tp { width: 124px; height: 124px; border-radius: 28px; border: 0; display: grid; place-items: center; cursor: pointer; background: rgba(255, 255, 255, 0.08); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.15); transition: transform 0.12s; touch-action: manipulation; }
  .tp.on { background: rgba(255, 200, 61, 0.25); box-shadow: inset 0 0 0 5px var(--q-sol), 0 0 24px rgba(255, 200, 61, 0.5); transform: translateY(-6px); }
  .tones { display: flex; gap: 16px; justify-content: center; margin: 22px 0 8px; }
  .tn { width: 72px; height: 72px; border-radius: 50%; border: 0; cursor: pointer; background: var(--c); box-shadow: 0 5px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 4px rgba(255, 255, 255, 0.35); transition: transform 0.12s; touch-action: manipulation; }
  .tn.on { transform: scale(1.18); box-shadow: 0 5px 0 rgba(0, 0, 0, 0.35), 0 0 0 5px #fff, 0 0 0 9px var(--q-sol); }
  .go { display: flex; justify-content: center; margin-top: 14px; }
  .room { position: absolute; inset: 0; }
  .room :global(svg) { width: 100%; height: 100%; display: block; }
  .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11, 13, 42, 0.15), rgba(11, 13, 42, 0.55) 60%, rgba(11, 13, 42, 0.85)); }
  .actors { position: absolute; inset: 0 0 330px 0; }
  .actor { position: absolute; bottom: 0; }
  .actor.left { left: 18%; }
  .actor.right { right: 14%; }
  .dlgwrap { position: absolute; left: 0; right: 0; bottom: 18px; padding: 0 24px; }
  .nx { position: absolute; right: 60px; top: -22px; z-index: 6; }
</style>
