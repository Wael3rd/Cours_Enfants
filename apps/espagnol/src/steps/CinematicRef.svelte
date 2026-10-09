<script lang="ts">
  /**
   * Cinematique de l'histoire : joue public/cinematics/<id>/ (HyperFrames, prenom injecte via setRuntimeData canal `player`)
   * si elle existe ; sinon REPLI : diaporama anime des repliques du script (decor, personnages, sous-titres, voix).
   */
  import { onDestroy, onMount } from 'svelte';
  import { gsap, playCinematic, preloadCinematic, prefersReducedMotion } from '@ce/core';
  import type { CinematicRefStep, Linea, Plano } from '../content/schema';
  import { game } from '../state/game.svelte';
  import { playerName } from '../engine/progress';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import { accentOf, character, portraitOf } from '../ui/avatar';
  import { academiaRoom, explainerMap, explainerReveal, quetzal as quetzalSvg, sombra as sombraSvg, featherSvg, papelPicado } from '../art/core/qart.js';
  import DialogBox from '../art/DialogBox.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import HintBubble from '../ui/HintBubble.svelte';
  import type { StepProps } from './common';

  let { step, onanswer }: StepProps<CinematicRefStep> = $props();
  const BASE = `${import.meta.env.BASE_URL}cinematics/`;
  const esc = step.escena;

  type Mode = 'check' | 'cine' | 'fallback';
  let mode = $state<Mode>('check');
  let done = false;
  let alive = true;

  const manifestP: { p?: Promise<Record<string, { parts: { id: string }[] }>> } = (globalThis as unknown as { __cineManifest?: { p?: Promise<Record<string, { parts: { id: string }[] }>> } }).__cineManifest ?? {};
  (globalThis as unknown as { __cineManifest?: unknown }).__cineManifest = manifestP;

  async function exists(id: string): Promise<boolean> {
    try {
      const r = await fetch(`${BASE}${id}/index.html`);
      if (!r.ok) return false;
      return (await r.text()).includes('data-composition-id');
    } catch {
      return false;
    }
  }

  function finish() {
    if (done) return;
    done = true;
    onanswer({ tipo: 'cinematic_ref' });
  }

  onMount(async () => {
    manifestP.p ??= fetch(`${BASE}manifest.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
    const manifest = await manifestP.p;
    const parts = (manifest[step.cinematica]?.parts?.map((p) => p.id) ?? []) as string[];
    const ok = parts.length > 0 && (await Promise.all(parts.map(exists))).every(Boolean);
    if (!alive) return;
    if (!ok) {
      mode = 'fallback';
      return;
    }
    mode = 'cine';
    music.setMode('off');
    parts.forEach((p) => void preloadCinematic(`${BASE}${p}/index.html`));
    for (const p of parts) {
      const r = await playCinematic({ src: `${BASE}${p}/index.html`, data: { player: { name: playerName(game.state) } }, skipLabel: 'Saltar' });
      if (!alive) return;
      if (r === 'error') {
        mode = 'fallback';
        music.setMode('quest');
        return;
      }
      if (r === 'skipped') break;
    }
    music.setMode('quest');
    finish();
  });
  onDestroy(() => (alive = false));

  // ───────── repli : diaporama ─────────
  let pi = $state(0);
  let li = $state(0);
  let title = $state(false);
  let hint = $state('');
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stage: HTMLElement | undefined = $state();
  const plano = $derived<Plano | undefined>(esc.planos[pi]);
  const line = $derived<Linea | undefined>(plano?.lineas[li]);
  const room = academiaRoom({ uid: 'cfb' });
  const roomBack = (room.back as string).replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ');
  const xmap = explainerMap({ uid: 'cfx' });
  const picado = papelPicado({ w: 1600, h: 150, n: 11, uid: 'cfp' });
  const bust = quetzalSvg({ width: 190, height: 190, view: '210 50 220 220' });
  const sombraBust = sombraSvg({ width: 190, height: 228, view: '120 60 260 300' });
  const feather = featherSvg({ width: 200, height: 600 });
  const who = (id: string) => (id === 'narrador' ? undefined : portraitOf(id, game.state.profile.avatar.base));
  const nameOf = (id: string) => (id === 'viajero' ? playerName(game.state) : (character(id)?.nombre ?? id));

  function lineDelay(l: Linea) {
    return Math.max(2400, l.es.length * 78 + 1200);
  }

  function showLine() {
    clearTimeout(timer);
    const l = line;
    if (!l) return;
    say(l.audio, l.es);
    timer = setTimeout(advance, lineDelay(l));
  }

  function enterPlano() {
    title = !!plano?.rotulo;
    if (title) {
      sfx('in');
      timer = setTimeout(() => {
        title = false;
        showLine();
      }, 2000);
    } else showLine();
  }

  function advance() {
    clearTimeout(timer);
    if (!plano) return finish();
    if (title) {
      title = false;
      showLine();
      return;
    }
    if (li < plano.lineas.length - 1) {
      li += 1;
      showLine();
    } else if (pi < esc.planos.length - 1) {
      pi += 1;
      li = 0;
      sfx('page');
      enterPlano();
    } else finish();
  }

  $effect(() => {
    if (mode !== 'fallback') return;
    music.setMode('quest');
    enterPlano();
    if (esc.tipo === 'capsula') setTimeout(() => stage && !prefersReducedMotion() && explainerReveal(gsap.timeline(), stage, 0.3, 0.7), 100);
    return () => clearTimeout(timer);
  });
</script>

{#if mode === 'fallback' && plano}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="cf" bind:this={stage} onclick={advance}>
    {#if esc.tipo === 'capsula'}
      <div class="bg map">{@html xmap}</div>
    {:else if esc.tipo === 'pluma'}
      <div class="bg night"><div class="fe">{@html feather}</div></div>
    {:else}
      <div class="bg room">{@html roomBack}</div>
      <div class="shade"></div>
    {/if}
    <div class="picado">{@html picado}</div>

    <div class="cast">
      {#each plano.personajes ?? [] as p (p)}
        <div class="who">
          {#if p === 'quetzal'}<div class="svg">{@html quetzalSvg({ width: 240, height: 290 })}</div>
          {:else if p === 'sombra'}<div class="svg">{@html sombraSvg({ width: 220, height: 264 })}</div>
          {:else if who(p)}<img src={who(p)} alt="" draggable="false" />{/if}
        </div>
      {/each}
    </div>

    {#if title && plano.rotulo}
      <div class="rot"><h2 class="h-rpg">{plano.rotulo}</h2></div>
    {/if}

    {#if line && !title}
      <div class="sub">
        {#key `${pi}-${li}`}
          <DialogBox
            name={nameOf(line.voz)}
            portrait={line.voz === 'quetzal' || line.voz === 'sombra' ? undefined : who(line.voz) ?? portraitOf('ignacio')}
            portraitSvg={line.voz === 'quetzal' ? bust : line.voz === 'sombra' ? sombraBust : undefined}
            accent={accentOf(line.voz)}
            text={line.es}
            onaudio={() => say(line.audio, line.es)}
            onslow={() => say(line.audio, line.es, { lento: true })}
            onhint={() => (hint = line.fr)}
          />
        {/key}
      </div>
    {/if}
    <div class="skip"><PrimaryButton variant="turquesa" onclick={(e: MouseEvent) => { e.stopPropagation(); finish(); }}>Saltar</PrimaryButton></div>
    {#if hint}<HintBubble text={hint} onclose={() => (hint = '')} />{/if}
  </div>
{:else}
  <div class="load"><p>{mode === 'cine' ? '▶' : '…'}</p></div>
{/if}

<style>
  .load { height: 100%; display: grid; place-items: center; font: 400 80px var(--q-font-title); color: var(--q-sol); opacity: 0.6; }
  .cf { position: absolute; inset: 0; overflow: hidden; cursor: pointer; }
  .bg { position: absolute; inset: 0; }
  .bg :global(svg) { width: 100%; height: 100%; display: block; }
  .bg.map :global(svg) { object-fit: cover; }
  .bg.night { background: radial-gradient(ellipse at 50% 55%, #3b2a8a, #0b0d2a 80%); display: grid; place-items: center; }
  .fe { height: 70%; filter: drop-shadow(0 0 40px #42e0a0); animation: floaty 3s ease-in-out infinite; }
  .fe :global(svg) { width: auto; height: 100%; }
  @keyframes floaty { 50% { transform: translateY(-14px) rotate(2deg); } }
  .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11, 13, 42, 0.1), rgba(11, 13, 42, 0.55) 55%, rgba(11, 13, 42, 0.88)); }
  .picado { position: absolute; left: 0; right: 0; top: 0; height: 100px; overflow: hidden; pointer-events: none; opacity: 0.9; }
  .picado :global(svg) { width: 100%; height: auto; display: block; }
  .cast { position: absolute; left: 0; right: 0; bottom: 330px; display: flex; justify-content: center; align-items: flex-end; gap: 70px; pointer-events: none; }
  .who img { height: 280px; filter: drop-shadow(0 14px 0 rgba(0, 0, 0, 0.3)); animation: pop 0.5s cubic-bezier(0.2, 1.5, 0.4, 1); }
  .who .svg { animation: pop 0.5s cubic-bezier(0.2, 1.5, 0.4, 1); }
  @keyframes pop { from { transform: translateY(40px) scale(0.8); opacity: 0; } }
  .rot { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(11, 13, 42, 0.6); animation: fade 0.4s; }
  .rot h2 { font-size: clamp(56px, 7vw, 100px); text-align: center; padding: 0 60px; animation: pop 0.6s cubic-bezier(0.2, 1.5, 0.4, 1); }
  @keyframes fade { from { opacity: 0; } }
  .sub { position: absolute; left: 0; right: 0; bottom: 14px; padding: 0 24px; }
  .skip { position: absolute; right: 24px; top: 24px; z-index: 5; }
  .skip :global(.btn) { min-width: 120px; min-height: 64px; }
</style>
