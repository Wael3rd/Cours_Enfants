<script lang="ts">
  // Page de demo TEMPORAIRE du kit graphique (acces : /espagnol/#art). Chargee a la demande depuis App.svelte.
  import './art.css';
  import { playCinematic } from '@ce/core';
  import QuetzalMascot from './QuetzalMascot.svelte';
  import SombraFigure from './SombraFigure.svelte';
  import WorldMap from './WorldMap.svelte';
  import Panel from './Panel.svelte';
  import DialogBox from './DialogBox.svelte';
  import ItemCard from './ItemCard.svelte';
  import XpBar from './XpBar.svelte';
  import StatsPanel from './StatsPanel.svelte';
  import PrimaryButton from './PrimaryButton.svelte';
  import LevelUp from './LevelUp.svelte';
  import { papelPicado } from './core/qart.js';
  import mage from './img/portraits/1f9d9-200d-2642.webp';
  import book from './img/items/1f4d6.webp';
  import bag from './img/items/1f392.webp';
  import house from './img/items/1f3e0.webp';
  import sun from './img/items/2600.webp';

  const tabs = ['Quetzal', 'Mapa', 'Interfaz', 'Cinemáticas'] as const;
  let tab = $state<(typeof tabs)[number]>('Quetzal');
  let pose = $state<'perched' | 'fly' | 'talk' | 'sad' | 'happy'>('perched');
  let bare = $state(false);
  let quetzal: QuetzalMascot | undefined = $state();
  let map: WorldMap | undefined = $state();
  let states = $state<Record<string, 'locked' | 'open' | 'current' | 'done'>>({ madrid: 'current' });
  let xp = $state(340);
  let level = $state(6);
  let showLevel = $state(false);
  let line = $state(0);
  const lines = ['¡Bienvenido a la Academia de Viajeros! Me llamo Ignacio.', 'Y tú, ¿cómo te llamas?'];
  const stats = { escuchar: { level: 6, xp: 40, max: 100 }, hablar: { level: 3, xp: 70, max: 100 }, leer: { level: 5, xp: 20, max: 100 }, escribir: { level: 2, xp: 55, max: 100 }, cultura: { level: 4, xp: 90, max: 100 } };
  const base = import.meta.env.BASE_URL + 'cinematics/';
  const cines = [
    { id: 'u01-intro', label: 'Intro Madrid', data: { player: { name: 'Álex' } } },
    { id: 'u01-historia', label: 'Historia', data: { player: { name: 'Álex' } } },
    { id: 'u01-capsula-hispanos', label: 'Cápsula cultural', data: {} },
    { id: 'u01-pluma', label: 'Primera pluma', data: { player: { name: 'Álex' } } },
  ];
  const picado = papelPicado({ w: 1920, h: 170, n: 10, uid: 'demo' });

  function unlockNext() {
    const order = ['madrid', 'salamanca', 'sevilla', 'cdmx', 'oaxaca', 'valencia', 'baires', 'bogota', 'yucatan', 'cusco'];
    const cur = order.find((k) => states[k] === 'current');
    if (!cur) return;
    const next = order[order.indexOf(cur) + 1];
    if (!next) return;
    states = { ...states, [cur]: 'done', [next]: 'current' };
    map?.clearFog(next);
    map?.travel(cur, next, 2.4);
  }
</script>

<div class="demo">
  <nav>
    {#each tabs as t}<button class:on={tab === t} onclick={() => (tab = t)}>{t}</button>{/each}
  </nav>

  {#if tab === 'Quetzal'}
    <section class="two">
      <div class="stage tall">
        <QuetzalMascot bind:this={quetzal} {pose} {bare} branch width={420} />
        <div class="row">
          {#each ['perched', 'fly', 'talk', 'sad', 'happy'] as p}<button class:on={pose === p} onclick={() => (pose = p as typeof pose)}>{p}</button>{/each}
          <button onclick={() => { bare = false; quetzal?.regrow(); }}>plumas vuelven</button>
          <button onclick={() => quetzal?.flap(4)}>aletear</button>
          <button onclick={() => quetzal?.talk(2)}>hablar</button>
        </div>
      </div>
      <div class="stage tall"><SombraFigure width={380} arm /></div>
    </section>
  {:else if tab === 'Mapa'}
    <section class="map">
      <WorldMap bind:this={map} {states} player="madrid" initial="Á" onselect={(id) => map?.focus(id, 1.7)} />
      <div class="mapbtn"><PrimaryButton onclick={unlockNext}>Siguiente región</PrimaryButton><PrimaryButton variant="turquesa" onclick={() => map?.reset()}>Mapa entero</PrimaryButton></div>
    </section>
  {:else if tab === 'Interfaz'}
    <section class="ui">
      <div class="picado">{@html picado}</div>
      <DialogBox name="Don Ignacio" portrait={mage} text={lines[line]} onaudio={() => {}} onslow={() => {}} onhint={() => {}} />
      <div class="row center"><PrimaryButton onclick={() => (line = (line + 1) % lines.length)}>Siguiente</PrimaryButton><PrimaryButton variant="magenta" onclick={() => (showLevel = true)}>¡Nivel!</PrimaryButton></div>
      <div class="cards">
        <ItemCard word="libro" article="el" img={book} rarity="comun" />
        <ItemCard word="mochila" article="la" img={bag} rarity="raro" />
        <ItemCard word="casa" article="la" img={house} rarity="epico" />
        <ItemCard word="sol" article="el" img={sun} rarity="legendario" />
        <ItemCard word="" locked />
      </div>
      <div class="row center"><XpBar value={xp} max={500} {level} label="XP" /><PrimaryButton variant="turquesa" onclick={() => (xp = Math.min(500, xp + 80))}>+80 XP</PrimaryButton></div>
      <StatsPanel {stats} />
    </section>
  {:else}
    <section class="cin">
      {#each cines as c}<PrimaryButton size="lg" onclick={() => playCinematic({ src: `${base}${c.id}/index.html`, data: c.data })}>{c.label}</PrimaryButton>{/each}
    </section>
  {/if}
</div>
{#if showLevel}<LevelUp level={level + 1} rewards={[{ icon: sun, label: '+1 nivel Hablar' }, { icon: book, label: 'Carta nueva: el libro' }]} onclose={() => { showLevel = false; level += 1; }} />{/if}

<style>
  :global(body) { background: #14173f; }
  .demo { min-height: 100%; height: 100%; overflow: auto; background: radial-gradient(ellipse at 50% 0%, #2b318a, #14173f 60%); color: var(--q-papel); font-family: var(--q-font-body); padding-bottom: 60px; }
  nav { position: sticky; top: 0; z-index: 5; display: flex; gap: 10px; justify-content: center; padding: 12px; background: rgba(11, 13, 42, 0.85); }
  button:not(.tool):not(.card):not(.btn) { min-height: 64px; padding: 0 22px; border-radius: 16px; border: 0; font: 800 22px var(--q-font-body); color: var(--q-nuit); background: #e6ce9f; cursor: pointer; }
  nav button.on, .row button.on { background: var(--q-sol); }
  section { padding: 24px; }
  .two { display: flex; gap: 24px; justify-content: center; align-items: flex-start; flex-wrap: wrap; }
  .stage { display: grid; gap: 16px; justify-items: center; padding: 24px; border-radius: 28px; background: rgba(255, 255, 255, 0.06); }
  .row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .center { align-items: center; margin: 22px 0; }
  .map { position: relative; height: calc(100vh - 100px); padding: 0; }
  .mapbtn { position: absolute; left: 20px; bottom: 20px; display: flex; gap: 14px; }
  .ui { display: grid; gap: 14px; }
  .picado { overflow: hidden; height: 190px; margin: -24px -24px 0; }
  .picado :global(svg) { width: 100%; height: auto; }
  .cards { display: flex; gap: 22px; justify-content: center; flex-wrap: wrap; margin: 12px 0 22px; }
  .cin { display: flex; gap: 22px; justify-content: center; flex-wrap: wrap; padding-top: 80px; }
</style>
