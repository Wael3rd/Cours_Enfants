<script lang="ts">
  /** Region (= unite) : en-tete illustre, chaine de quetes en chemin de noeuds, noeud boss, audio hors-ligne. */
  import { onMount } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content, loadUnit } from '../engine/data';
  import { nextQuest, questStatus, unitProgress, unitStatus } from '../engine';
  import type { Quest, Unit } from '../content/schema';
  import { nav } from '../ui/nav.svelte';
  import { now } from '../ui/clock';
  import { regionOf } from '../ui/regions';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import { loadLentoSet } from '../services/audio';
  import { AVG_AUDIO_BYTES, unitAudioUrls } from '../services/offline';
  import { MAP_REGIONS, madridSkyline, monumentSvg, papelPicado } from '../art/core/qart.js';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import Panel from '../art/Panel.svelte';
  import SombraFigure from '../art/SombraFigure.svelte';
  import RoundBtn from '../ui/RoundBtn.svelte';
  import Icon from '../ui/Icon.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import HintBubble from '../ui/HintBubble.svelte';

  let { unit: unitId }: { unit: string } = $props();

  let unit = $state<Unit | undefined>();
  let sel = $state<Quest | undefined>();
  let hint = $state('');
  let lentoSet = $state<Set<string>>(new Set());
  let scroller: HTMLElement | undefined = $state();
  let root: HTMLElement | undefined = $state();
  const t = now();

  const regionId = $derived(unit ? regionOf(unit) : undefined);
  const region = $derived(MAP_REGIONS.find((r: { id: string }) => r.id === regionId));
  const prog = $derived(unit ? unitProgress(game.state, unit) : undefined);
  const status = $derived(unit ? unitStatus(content, game.state, unit, t) : 'locked');
  const off = $derived(unit ? game.state.offline[unit.id] : undefined);
  const dl = $derived(unit ? game.downloads[unit.id] : undefined);
  const next = $derived(unit ? nextQuest(content, game.state, unit) : null);
  const sky = $derived(unit && regionId === 'madrid' ? madridSkyline({ uid: 'rsky' }) : null);
  const picado = papelPicado({ w: 1600, h: 150, n: 11, uid: 'reg' });
  const total = $derived(unit ? unitAudioUrls(unit, lentoSet).length : 0);
  const mb = $derived(((total * AVG_AUDIO_BYTES) / 1_000_000).toFixed(1).replace('.', ','));

  const STEP_X = 188;
  const nodes = $derived(
    (unit?.quests ?? []).map((q, i) => ({ q, x: 130 + i * STEP_X, y: 210 + (i % 2 ? 70 : -70) + Math.sin(i * 1.3) * 22, st: questStatus(content, game.state, q.id, t) })),
  );
  const width = $derived(Math.max(1200, (unit?.quests.length ?? 0) * STEP_X + 130));
  const roadD = $derived(
    nodes.length
      ? nodes.reduce((d, n, i) => {
          if (!i) return `M${n.x} ${n.y}`;
          const p = nodes[i - 1];
          const mx = (p.x + n.x) / 2;
          return d + `C${mx} ${p.y} ${mx} ${n.y} ${n.x} ${n.y}`;
        }, '')
      : '',
  );
  const doneUpTo = $derived(nodes.filter((n) => n.st === 'done').length);

  onMount(async () => {
    music.setMode('menu');
    lentoSet = await loadLentoSet();
    unit = await loadUnit(unitId);
    await Promise.resolve();
    requestAnimationFrame(() => {
      const cur = scroller?.querySelector('.node.available, .node.boss.available') as HTMLElement | null;
      if (cur && scroller) scroller.scrollLeft = Math.max(0, cur.offsetLeft - scroller.clientWidth / 2 + 60);
      if (root && !prefersReducedMotion()) {
        gsap.from(root.querySelectorAll('.node'), { y: 60, opacity: 0, scale: 0.6, duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)', delay: 0.25 });
        gsap.from(root.querySelector('.head'), { y: -40, opacity: 0, duration: 0.5 });
      }
    });
  });

  function tapNode(q: Quest, st: string, el: HTMLElement) {
    haptic('tap');
    if (st === 'locked') {
      sfx('wrong');
      if (!prefersReducedMotion()) gsap.fromTo(el, { x: 0 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, clearProps: 'x' });
      return;
    }
    sfx('select');
    sel = q;
    say(q.intro.audio, q.intro.es);
  }

  function play(q: Quest) {
    sfx('door');
    nav.go({ name: 'quest', quest: q.id });
  }

  const typeLabel: Record<string, string> = {
    cinematica: 'Historia', vocabulario: 'Vocabulario', escucha: 'Escucha', dialogo: 'Diálogo', forja: 'La Forja', lectura: 'Lectura',
    escritura: 'Escritura', hechizo: 'Hechizo', cultura: 'Cultura', desafio: 'Desafío',
  };
  const STAT_NAME: Record<string, string> = { escuchar: 'Escuchar', hablar: 'Hablar', leer: 'Leer', escribir: 'Escribir', cultura: 'Cultura' };

  async function download() {
    if (!unit) return;
    sfx('open', 0.7);
    await game.downloadUnitAudio(unit);
    sfx('item');
  }
</script>

<div class="scr scr-bg reg" bind:this={root}>
  {#if !unit}
    <div class="loading"><Icon name="map" size={64} /><p>Cargando…</p></div>
  {:else}
    <header class="head" style:--rc={region?.color ?? '#c9573b'}>
      {#if sky}
        <div class="sky">
          {#each [sky.sky, sky.sun, sky.far, sky.mid, sky.near] as layer}<div class="lay">{@html (layer as string).replace(/<svg /, '<svg preserveAspectRatio="xMidYMax slice" ')}</div>{/each}
        </div>
      {:else}
        <div class="sky plain"><div class="mon">{@html monumentSvg(region?.icon ?? 'catedral', { size: 360, c: 'rgba(11,13,42,.55)', a: 'rgba(255,200,61,.8)' })}</div></div>
      {/if}
      <div class="fade"></div>
      <div class="picado">{@html picado}</div>
      <div class="bar">
        <RoundBtn icon="back" label="Volver al mapa" variant="papel" onclick={() => nav.back()} />
        <div class="ttl">
          <p class="cap">{unit.numero ? `Capítulo ${unit.numero}` : 'Evento'} · {unit.lugar}</p>
          <h1 class="h-rpg">{unit.titulo}</h1>
        </div>
        <div class="stats">
          <div class="chip pl" class:got={prog?.plume}>
            <span class="fe"><Icon name="feather" size={34} /></span>
            <b>{unit.pluma.nombre}</b>
          </div>
          <div class="chip"><Icon name="star" size={30} /><b>{prog?.stars ?? 0}/{prog?.starsMax ?? 0}</b></div>
        </div>
      </div>
    </header>

    <div class="road scroll" bind:this={scroller}>
      <div class="track" style:width="{width}px">
        <svg class="path" viewBox="0 0 {width} 420" width={width} height="420" aria-hidden="true">
          <path d={roadD} fill="none" stroke="rgba(11,13,42,.55)" stroke-width="30" stroke-linecap="round" />
          <path d={roadD} fill="none" stroke="#f5e6c8" stroke-opacity=".55" stroke-width="8" stroke-dasharray="2 20" stroke-linecap="round" />
          {#if doneUpTo > 0}
            <path d={nodes.slice(0, doneUpTo + 1).reduce((d, n, i, a) => (i ? d + `C${(a[i - 1].x + n.x) / 2} ${a[i - 1].y} ${(a[i - 1].x + n.x) / 2} ${n.y} ${n.x} ${n.y}` : `M${n.x} ${n.y}`), '')} fill="none" stroke="#ffc83d" stroke-width="10" stroke-dasharray="2 20" stroke-linecap="round" />
          {/if}
        </svg>
        {#each nodes as n, i}
          {@const boss = n.q.tipo === 'desafio'}
          {@const p = game.state.quests[n.q.id]}
          <button
            type="button"
            class="node {n.st}"
            class:boss
            class:cur={next?.id === n.q.id}
            style:left="{n.x}px"
            style:top="{n.y}px"
            aria-label={`${n.q.titulo} (${n.st === 'locked' ? 'bloqueada' : n.st === 'done' ? 'hecha' : 'disponible'})`}
            onclick={(e) => tapNode(n.q, n.st, e.currentTarget as HTMLElement)}
          >
            {#if n.st === 'available'}<span class="ping"></span>{/if}
            <span class="disc">
              {#if boss}
                <span class="sb"><SombraFigure width={86} float={false} /></span>
              {:else}
                <Emoji e={n.q.emoji} size={74} />
              {/if}
              {#if n.st === 'locked'}<span class="lk"><Icon name="lock" size={30} /></span>{/if}
              {#if n.st === 'done'}<span class="ok"><Icon name="check" size={26} /></span>{/if}
            </span>
            <span class="stars">
              {#each [1, 2, 3] as s}<Icon name="star" size={28} class={s <= (p?.stars ?? 0) ? 'sf on' : 'sf'} />{/each}
            </span>
            <span class="nm">{n.q.titulo}</span>
          </button>
        {/each}
      </div>
    </div>

    <footer class="foot">
      <div class="offline" class:ready={off?.status === 'ready'}>
        <Icon name={off?.status === 'ready' ? 'check' : 'download'} size={36} />
        <div class="otxt">
          {#if dl}
            <b>Descargando voces… {Math.round((dl.done / Math.max(1, dl.total)) * 100)} %</b>
            <span class="bar2"><i style:transform="scaleX({dl.done / Math.max(1, dl.total)})"></i></span>
          {:else if off?.status === 'ready'}
            <b>Voces sin conexión: listas</b>
            <span>Esta región funciona sin internet.</span>
          {:else}
            <b>{off?.status === 'partial' ? 'Faltan algunas voces' : 'Voces sin conexión'}</b>
            <span>Descarga unos {mb} MB para jugar sin internet.</span>
          {/if}
        </div>
        {#if !dl && off?.status !== 'ready'}
          <PrimaryButton variant="turquesa" onclick={download}>Descargar</PrimaryButton>
        {/if}
      </div>
      {#if next && status !== 'locked' && status !== 'closed'}
        <PrimaryButton size="lg" onclick={() => play(next!)}>{(prog?.questsDone ?? 0) === 0 ? '¡Empezar!' : 'Seguir'}</PrimaryButton>
      {/if}
    </footer>

    {#if sel}
      {@const q = sel}
      {@const qs = questStatus(content, game.state, q.id, t)}
      {@const qp = game.state.quests[q.id]}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div class="veil" onclick={() => (sel = undefined)}>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="sheet" onclick={(e) => e.stopPropagation()}>
          <Panel padding="26px 34px">
            <div class="qh">
              {#if q.tipo === 'desafio'}<div class="bsb"><SombraFigure width={110} /></div>{:else}<Emoji e={q.emoji} size={110} />{/if}
              <div class="qt">
                <p class="tipo">{typeLabel[q.tipo] ?? q.tipo} · {q.minutos} min</p>
                <h2 class="h-rpg">{q.titulo}</h2>
                <p class="intro"><SpeakText text={q.intro.es} audio={q.intro.audio} /></p>
                <div class="skills">
                  {#each q.stats as st}<span class="sk">{STAT_NAME[st] ?? st}</span>{/each}
                  <span class="stars big">{#each [1, 2, 3] as s}<Icon name="star" size={34} class={s <= (qp?.stars ?? 0) ? 'sf on' : 'sf'} />{/each}</span>
                </div>
              </div>
              <div class="acts">
                <RoundBtn icon="bulb" label="Pista" variant="turquesa" onclick={() => (hint = q.pista)} />
                <PrimaryButton variant={q.tipo === 'desafio' ? 'magenta' : 'sol'} size="lg" onclick={() => play(q)}>{q.tipo === 'desafio' ? '¡Desafiar!' : qs === 'done' ? 'Repetir' : '¡Jugar!'}</PrimaryButton>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    {/if}
    {#if hint}<HintBubble text={hint} onclose={() => (hint = '')} />{/if}
  {/if}
</div>

<style>
  .loading { flex: 1; display: grid; place-content: center; justify-items: center; gap: 12px; font: 800 30px var(--q-font-body); color: var(--q-papel2); }
  .head { position: relative; flex: none; height: 262px; overflow: hidden; }
  .sky { position: absolute; inset: 0; }
  .lay { position: absolute; inset: 0; }
  .lay :global(svg) { width: 100%; height: 100%; display: block; }
  .sky.plain { background: linear-gradient(180deg, color-mix(in srgb, var(--rc) 55%, #14173f), #1d2160); }
  .mon { position: absolute; right: 90px; bottom: -30px; opacity: 0.9; }
  .fade { position: absolute; inset: auto 0 0 0; height: 90px; background: linear-gradient(180deg, transparent, #1d2160); }
  .picado { position: absolute; left: 0; right: 0; top: 0; height: 104px; overflow: hidden; pointer-events: none; opacity: 0.95; }
  .picado :global(svg) { width: 100%; height: auto; display: block; }
  .bar { position: absolute; left: 0; right: 0; bottom: 14px; display: flex; align-items: flex-end; gap: 22px; padding: 0 24px; }
  .ttl { flex: 1; min-width: 0; padding-bottom: 2px; }
  .cap { margin: 0 0 6px; font: 900 24px/1 var(--q-font-body); color: #fff; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.55); }
  h1 { font-size: 52px; line-height: 1.02; text-shadow: 0 5px 0 #8a4a05, 0 10px 14px rgba(0, 0, 0, 0.5); }
  .stats { display: flex; gap: 12px; padding-bottom: 6px; }
  .chip { display: flex; align-items: center; gap: 8px; height: 60px; padding: 0 20px 0 14px; border-radius: 999px; color: var(--q-papel); background: rgba(11, 13, 42, 0.82); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.65); font: 900 26px var(--q-font-body); }
  .chip :global(svg) { color: var(--q-sol); }
  .chip.pl .fe { display: grid; place-items: center; }
  .chip.pl.got { box-shadow: inset 0 0 0 3px #42e0a0; }
  .chip.pl .fe { color: #8f93c7; }
  .chip.pl.got .fe { color: #42e0a0; }
  .road { flex: 1; min-height: 0; overflow-x: auto; overflow-y: hidden; }
  .track { position: relative; height: 100%; min-height: 440px; }
  .path { position: absolute; left: 0; top: 10px; }
  .node { position: absolute; transform: translate(-50%, -50%); width: 190px; margin-top: 10px; border: 0; padding: 0; background: none; display: grid; justify-items: center; gap: 4px; cursor: pointer; touch-action: manipulation; color: var(--q-papel); }
  .disc { position: relative; width: 124px; height: 124px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 35% 28%, #3a41a8, var(--q-nuit)); box-shadow: 0 0 0 6px var(--q-sol), 0 9px 0 6px #6b3d08, 0 16px 20px rgba(0, 0, 0, 0.4); transition: transform 0.1s; }
  .node:active .disc { transform: translateY(6px) scale(0.97); }
  .node.done .disc { box-shadow: 0 0 0 6px #42e0a0, 0 9px 0 6px #066a4a, 0 16px 20px rgba(0, 0, 0, 0.4); }
  .node.locked .disc { background: #2b2f66; box-shadow: 0 0 0 6px #7e83b8, 0 9px 0 6px #1a1d4a; }
  .node.locked :global(img), .node.locked .sb { filter: grayscale(1) brightness(0.65); }
  .lk { position: absolute; right: -6px; bottom: -6px; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; color: #b9bde6; background: #2b2f66; box-shadow: 0 0 0 4px #7e83b8; }
  .ok { position: absolute; right: -6px; top: -6px; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: var(--q-quetzal); box-shadow: 0 0 0 4px var(--q-sol); }
  .ping { position: absolute; top: 0; left: 50%; width: 124px; height: 124px; margin-left: -62px; border-radius: 50%; box-shadow: 0 0 0 6px var(--q-sol); animation: ping 1.6s ease-out infinite; pointer-events: none; }
  @keyframes ping { 0% { transform: scale(1); opacity: 0.9; } 100% { transform: scale(1.5); opacity: 0; } }
  .node.boss .disc { width: 148px; height: 148px; background: radial-gradient(circle at 40% 30%, #5a2c9a, #1b0d3a); box-shadow: 0 0 0 7px #d93472, 0 10px 0 7px #5e0f33, 0 0 40px rgba(217, 52, 114, 0.6); }
  .node.boss.locked .disc { box-shadow: 0 0 0 7px #7e83b8, 0 10px 0 7px #1a1d4a; background: #2b2f66; }
  .node.boss .ping { width: 148px; height: 148px; margin-left: -74px; box-shadow: 0 0 0 7px #d93472; }
  .sb { display: grid; place-items: center; transform: translateY(6px); }
  .stars { display: flex; gap: 2px; margin-top: 10px; }
  .stars :global(.sf) { color: rgba(255, 255, 255, 0.2); }
  .stars :global(.sf.on) { color: var(--q-sol); filter: drop-shadow(0 2px 0 #6b3d08); }
  .nm { max-width: 190px; padding: 4px 14px 6px; border-radius: 14px; font: 900 22px/1.12 var(--q-font-body); text-align: center; color: #fff; background: rgba(11, 13, 42, 0.78); }
  .node.locked .nm { opacity: 0.6; }
  .foot { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 6px 28px 10px; }
  .offline { flex: 1; display: flex; align-items: center; gap: 16px; padding: 12px 20px; border-radius: 22px; background: rgba(11, 13, 42, 0.7); box-shadow: inset 0 0 0 3px rgba(122, 214, 255, 0.4); color: var(--q-turquesa); max-width: 760px; }
  .offline.ready { color: #42e0a0; box-shadow: inset 0 0 0 3px rgba(66, 224, 160, 0.5); }
  .otxt { flex: 1; display: grid; gap: 4px; color: var(--q-papel); }
  .otxt b { font: 900 24px/1.1 var(--q-font-body); }
  .otxt span { font: 700 20px/1.1 var(--q-font-body); opacity: 0.8; }
  .bar2 { display: block; height: 14px; border-radius: 7px; background: rgba(255, 255, 255, 0.15); overflow: hidden; }
  .bar2 i { display: block; height: 100%; width: 100%; transform-origin: 0 50%; background: linear-gradient(90deg, #19b7aa, #7ff3e4); transition: transform 0.2s; }
  .veil { position: fixed; inset: 0; z-index: 40; display: flex; align-items: flex-end; justify-content: center; padding: 0 34px 26px; background: rgba(8, 9, 32, 0.55); animation: fadein 0.2s; }
  @keyframes fadein { from { opacity: 0; } }
  .sheet { width: 100%; max-width: 1180px; animation: rise 0.4s cubic-bezier(0.2, 1.2, 0.4, 1); }
  @keyframes rise { from { transform: translateY(120px); opacity: 0; } }
  .qh { display: flex; align-items: center; gap: 28px; }
  .qt { flex: 1; min-width: 0; }
  .tipo { margin: 0; font: 900 22px/1 var(--q-font-body); color: var(--q-turquesa); }
  .qt h2 { font-size: 44px; line-height: 1.05; margin: 6px 0 8px; }
  .intro { margin: 0 0 10px; font: 800 28px/1.3 var(--q-font-body); }
  .skills { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .sk { padding: 4px 16px 6px; border-radius: 999px; font: 900 20px var(--q-font-body); color: var(--q-nuit); background: var(--q-papel2); }
  .stars.big { margin: 0 0 0 10px; }
  .acts { display: grid; gap: 14px; justify-items: end; align-content: center; }
  .acts :global(.btn) { margin-bottom: 9px; }
  .bsb { display: grid; place-items: center; width: 130px; }
</style>
