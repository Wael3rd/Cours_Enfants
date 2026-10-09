<script lang="ts">
  /** Accueil : carte du monde (pan/zoom), HUD (niveau, plumas, Mision del dia, diccionario, perfil, ajustes), Quetzal perche. */
  import { onMount, tick } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content, loadUnit } from '../engine/data';
  import { activeEvents, currentUnit, playerLevel, playerName, ymd } from '../engine';
  import { nav } from '../ui/nav.svelte';
  import { now } from '../ui/clock';
  import { mapStates, regionOf, unitForRegion } from '../ui/regions';
  import { avatarUrl } from '../ui/avatar';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import WorldMap from '../art/WorldMap.svelte';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';
  import XpBar from '../art/XpBar.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import RoundBtn from '../ui/RoundBtn.svelte';
  import Icon from '../ui/Icon.svelte';
  import Emoji from '../ui/Emoji.svelte';

  const t = now();
  const s = $derived(game.state);
  const real = mapStates(content, game.state, t);
  const cur = currentUnit(content, game.state);
  const curRegion = (cur && regionOf(cur)) || 'madrid';
  // Voyage apres une plume : la nouvelle region demarre sous le brouillard, le jeton part de la region precedente
  const [tFrom, tTo] = (game.state.flags.travel ?? '').split(':');
  const traveling = !!(tFrom && tTo && real[tTo]);
  let states = $state<Record<string, 'locked' | 'open' | 'current' | 'done'>>(traveling ? { ...real, [tTo]: 'locked' } : real);
  let player = $state(traveling ? tFrom : curRegion);
  let banner = $state('');
  const lvl = $derived(playerLevel(s));
  const plumas = $derived(Object.keys(s.plumas).length);
  const missionDone = $derived(s.missionDone === ymd(t));
  const events = activeEvents(content, game.state, t);
  const initial = $derived(playerName(s).charAt(0).toUpperCase());

  let map: WorldMap | undefined = $state();
  let quetzal: QuetzalMascot | undefined = $state();
  let bubble = $state('');
  let leaving = false;
  let root: HTMLElement | undefined = $state();

  async function runTravel() {
    leaving = true;
    await new Promise((r) => setTimeout(r, 1100));
    sfx('magic');
    map?.clearFog(tTo, 1.8);
    await new Promise((r) => setTimeout(r, 900));
    sfx('step');
    const tl = map?.travel(tFrom, tTo, 2.6);
    const end = () => {
      states = real;
      player = curRegion;
      game.mutate((st) => delete st.flags.travel);
      void tick().then(() => {
        map?.focus(curRegion, 1.25, 0);
        banner = `¡Nueva región: ${content.units.find((u) => u.id === cur?.id)?.lugar ?? ''}!`;
        sfx('level');
        setTimeout(() => (banner = ''), 3200);
        leaving = false;
      });
    };
    if (tl && tl.duration() > 0) tl.eventCallback('onComplete', end);
    else end();
  }

  onMount(() => {
    music.setMode('menu');
    if (traveling) void runTravel();
    if (!root || prefersReducedMotion()) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(root.querySelector('.hud-l'), { x: -120, opacity: 0, duration: 0.6 }, 0.1)
      .from(root.querySelector('.hud-r'), { x: 120, opacity: 0, duration: 0.6 }, 0.1)
      .from(root.querySelector('.mission'), { y: 140, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.3)
      .from(root.querySelector('.bird'), { y: 160, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.4);
  });

  function open(id: string) {
    if (leaving) return;
    const u = unitForRegion(content, game.state, id, t);
    if (!u) return;
    leaving = true;
    haptic('tap');
    sfx('step');
    void loadUnit(u.id);
    map?.focus(id, 2.6, 0.85);
    setTimeout(() => nav.go({ name: 'region', unit: u.id }), 760);
  }

  function chirp() {
    sfx('pluck');
    quetzal?.flap(2);
    const hi = [`¡Hola, ${playerName(game.state)}!`, plumas ? '¡Gracias por mis plumas!' : 'Necesito mis plumas…', '¡Vamos a aprender!', cur ? `${cur.lugar} nos espera.` : '¡Qué viaje!'];
    bubble = hi[Math.floor(Math.random() * hi.length)];
    setTimeout(() => (bubble = ''), 2400);
  }

  function mission() {
    sfx('open');
    nav.go({ name: 'mission' });
  }
  const go = (r: Parameters<typeof nav.go>[0]) => {
    sfx('open', 0.7);
    nav.go(r);
  };
  function toggleMusic() {
    game.mutate((x) => (x.settings.music = !x.settings.music));
    music.setEnabled(game.state.settings.music);
  }
  function recenter() {
    sfx('in');
    map?.focus(curRegion, 1.6, 1);
  }
</script>

<div class="scr map" bind:this={root}>
  <div class="mapwrap">
    <WorldMap bind:this={map} {states} {player} {initial} focusOn={traveling ? tFrom : curRegion} zoom={traveling ? 1.6 : 1.25} onselect={open} />
  </div>
  <div class="vignette"></div>

  <div class="hud-l">
    <div class="face"><img src={avatarUrl(s.profile.avatar.base)} alt="" draggable="false" /></div>
    <div class="who">
      <b class="nm">{playerName(s)}</b>
      <XpBar value={lvl.into} max={lvl.span} level={lvl.level} label="XP" color="#19b7aa" width={360} />
    </div>
  </div>

  <div class="hud-r">
    <div class="plumas" title="Plumas"><Icon name="feather" size={34} /><b>{plumas}</b></div>
    <RoundBtn icon="book" label="Diccionario" variant="papel" onclick={() => go({ name: 'dictionary' })} />
    <RoundBtn icon="user" label="Perfil" variant="turquesa" onclick={() => go({ name: 'profile' })} />
    <RoundBtn icon={s.settings.music ? 'music' : 'musicoff'} label={s.settings.music ? 'Quitar la música' : 'Poner la música'} variant="nuit" onclick={toggleMusic} />
    <RoundBtn icon="gear" label="Ajustes" variant="nuit" onclick={() => go({ name: 'settings' })} />
  </div>

  {#if banner}<div class="banner">{banner}</div>{/if}

  {#if events.length}
    <button class="evento" type="button" onclick={() => open(regionOf(events[0]) ?? 'oaxaca')}>
      <span>★</span> {events[0].titulo}
    </button>
  {/if}

  <div class="bird">
    {#if bubble}<div class="bubble">{bubble}</div>{/if}
    <button type="button" class="birdbtn" onclick={chirp} aria-label="El Quetzal">
      <QuetzalMascot bind:this={quetzal} pose="perched" bare={plumas === 0} branch width={170} />
    </button>
  </div>

  <div class="mission">
    <div class="glow" class:off={missionDone}></div>
    <PrimaryButton variant={missionDone ? 'quetzal' : 'magenta'} size="lg" onclick={mission}>
      <span class="mlabel"><Emoji e={missionDone ? '✅' : '🎯'} size={46} /> Misión del día</span>
    </PrimaryButton>
    <p>{missionDone ? '¡Hecha! Puedes repetir.' : '5 minutos · +25 XP'}</p>
  </div>

  <div class="tools">
    <RoundBtn icon="home" label="Volver a mi región" variant="papel" onclick={recenter} />
  </div>
</div>

<style>
  .map { background: #0a4a66; }
  .mapwrap { position: absolute; inset: 0; }
  .vignette { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(11, 13, 42, 0.7), rgba(11, 13, 42, 0) 22%, rgba(11, 13, 42, 0) 70%, rgba(11, 13, 42, 0.65)); }
  .hud-l { position: absolute; left: 22px; top: 18px; display: flex; align-items: center; gap: 4px; pointer-events: none; }
  .face { position: relative; z-index: 3; width: 112px; height: 112px; margin-right: 6px; flex: none; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 40% 30%, #3a41a8, var(--q-nuit)); box-shadow: 0 0 0 5px var(--q-sol), 0 8px 0 5px #6b3d08, 0 14px 22px rgba(0, 0, 0, 0.4); overflow: hidden; }
  .face img { width: 92%; height: 92%; object-fit: contain; transform: translateY(6px); }
  .who { display: grid; gap: 2px; padding-top: 6px; }
  .nm { margin-left: 30px; font: 400 30px/1 var(--q-font-title); color: var(--q-papel); text-shadow: 0 3px 0 #000a; }
  .who :global(.xp) { margin-left: 0; }
  .hud-r { position: absolute; right: 22px; top: 18px; display: flex; align-items: center; gap: 16px; }
  .plumas { display: flex; align-items: center; gap: 8px; height: 62px; padding: 0 22px 0 16px; border-radius: 999px; color: var(--q-nuit); background: linear-gradient(180deg, #7ff3e4, var(--q-turquesa)); box-shadow: 0 5px 0 #07474f, inset 0 0 0 3px rgba(255, 255, 255, 0.45); }
  .plumas b { font: 400 34px/1 var(--q-font-title); }
  .evento { position: absolute; left: 50%; top: 20px; transform: translateX(-50%); display: flex; gap: 10px; align-items: center; height: 64px; padding: 0 28px; border: 0; border-radius: 999px; cursor: pointer; font: 400 28px/1 var(--q-font-title); color: #fff; background: linear-gradient(180deg, #ff7aa8, var(--q-magenta)); box-shadow: 0 6px 0 #5e0f33, inset 0 0 0 3px rgba(255, 255, 255, 0.4); animation: bob 2s ease-in-out infinite; }
  @keyframes bob { 50% { transform: translateX(-50%) translateY(-6px); } }
  .banner { position: absolute; left: 50%; top: 130px; transform: translateX(-50%); z-index: 6; padding: 14px 40px 16px; border-radius: 999px; font: 400 44px/1 var(--q-font-title); color: var(--q-nuit); background: linear-gradient(180deg, #ffe08a, var(--q-sol)); box-shadow: 0 7px 0 #6b3d08, 0 0 40px rgba(255, 200, 61, 0.6); animation: bnr 0.5s cubic-bezier(0.2, 1.6, 0.4, 1); white-space: nowrap; }
  @keyframes bnr { from { transform: translateX(-50%) scale(0.4); opacity: 0; } }
  .bird { position: absolute; left: 20px; bottom: 14px; z-index: 4; }
  .birdbtn { all: unset; cursor: pointer; display: block; padding: 8px 18px 0; touch-action: manipulation; }
  .bubble { position: absolute; left: 150px; bottom: 190px; white-space: nowrap; padding: 12px 24px; border-radius: 22px 22px 22px 4px; font: 800 28px/1 var(--q-font-body); color: var(--q-nuit); background: var(--q-papel); box-shadow: 0 5px 0 #7d5a1c, 0 10px 20px rgba(0, 0, 0, 0.35); animation: popin 0.25s cubic-bezier(0.2, 1.6, 0.4, 1); }
  @keyframes popin { from { transform: scale(0.6); opacity: 0; } }
  .mission { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); text-align: center; }
  .mission p { margin: -2px 0 0; font: 900 22px/1 var(--q-font-body); color: var(--q-papel); text-shadow: 0 3px 0 #000a; }
  .mlabel { display: inline-flex; align-items: center; gap: 12px; }
  .glow { position: absolute; left: -26px; right: -26px; top: -20px; bottom: 6px; border-radius: 50px; background: radial-gradient(closest-side, rgba(255, 122, 168, 0.85), rgba(255, 122, 168, 0)); animation: glow 1.8s ease-in-out infinite; pointer-events: none; }
  .glow.off { display: none; }
  @keyframes glow { 0%, 100% { opacity: 0.35; transform: scale(0.96); } 50% { opacity: 1; transform: scale(1.1); } }
  .tools { position: absolute; right: 22px; bottom: 24px; }
</style>
