<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { UpdateToast, type Updater } from '@ce/core';
  import { game } from './state/game.svelte';
  import { initAudio } from './services/audio';
  import { music } from './services/music';
  import { nav } from './ui/nav.svelte';
  import { ui } from './ui/ui.svelte';
  import MapScreen from './screens/MapScreen.svelte';
  import { content, loadUnit, loadAllUnits } from './engine/data';
  import { azulejoDataUri } from './art/core/qart.js';

  let { updater }: { updater: Updater } = $props();
  // Demo temporaire du kit graphique (src/art) : /espagnol/#art
  const showArt = location.hash === '#art';
  const loadArt = () => import('./art/ArtDemo.svelte');

  const R = {
    welcome: () => import('./screens/Welcome.svelte'),
    region: () => import('./screens/Region.svelte'),
    quest: () => import('./screens/QuestPlayer.svelte'),
    mission: () => import('./screens/Mission.svelte'),
    dictionary: () => import('./screens/Dictionary.svelte'),
    profile: () => import('./screens/Profile.svelte'),
    settings: () => import('./screens/Settings.svelte'),
    credits: () => import('./screens/Credits.svelte'),
  } as const;

  const route = $derived(nav.route);
  const key = $derived(route.name + ('unit' in route ? route.unit : '') + ('quest' in route ? route.quest : ''));

  onMount(async () => {
    await game.init();
    document.documentElement.style.setProperty('--q-tile', `url('${azulejoDataUri({}, 120)}')`);
    // Acces de test (e2e / dev) : ?debug dans l'URL
    if (import.meta.env.DEV || location.search.includes('debug')) (window as unknown as Record<string, unknown>).__q = { game, nav, content, loadUnit, loadAllUnits };
    ui.lento = game.state.settings.lentoDefault;
    music.setEnabled(game.state.settings.music);
    void initAudio();
    nav.init(game.state.profile.name && game.state.flags.prologue ? { name: 'map' } : { name: 'welcome' });
    void game.refreshOffline().then(() => game.autoDownload());
  });
</script>

{#if showArt}
  {#await loadArt() then m}<m.default />{/await}
{:else if !game.ready}
  <div class="splash"><h1 class="h-rpg">La Leyenda<br />del Quetzal</h1></div>
{:else}
  {#key key}
    <div class="route" in:fade={{ duration: 260 }}>
      {#if route.name === 'map'}
        <MapScreen />
      {:else if route.name === 'welcome'}
        {#await R.welcome() then m}<m.default />{/await}
      {:else if route.name === 'region'}
        {#await R.region() then m}<m.default unit={route.unit} />{/await}
      {:else if route.name === 'quest'}
        {#await R.quest() then m}<m.default quest={route.quest} />{/await}
      {:else if route.name === 'mission'}
        {#await R.mission() then m}<m.default />{/await}
      {:else if route.name === 'dictionary'}
        {#await R.dictionary() then m}<m.default />{/await}
      {:else if route.name === 'profile'}
        {#await R.profile() then m}<m.default />{/await}
      {:else if route.name === 'settings'}
        {#await R.settings() then m}<m.default />{/await}
      {:else if route.name === 'credits'}
        {#await R.credits() then m}<m.default />{/await}
      {/if}
    </div>
  {/key}
{/if}
<UpdateToast {updater} />

<style>
  .route { position: absolute; inset: 0; }
  .splash { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; background: radial-gradient(ellipse at 50% 70%, #3b2a8a, #0b0d2a 80%); }
  .splash h1 { font-size: clamp(48px, 7vw, 96px); line-height: 1; }
</style>
