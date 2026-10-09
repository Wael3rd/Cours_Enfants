<script lang="ts">
  import { onMount } from 'svelte';
  import { ParentGate, UpdateToast, type Updater } from '@ce/core';
  import { game } from './state/game.svelte';
  import { initAudio } from './services/audio';
  import ParentSpace from './parent/ParentSpace.svelte';

  let { updater }: { updater: Updater } = $props();
  let parentOpen = $state(false);
  // Demo temporaire du kit graphique (src/art) : /espagnol/#art
  const showArt = location.hash === '#art';
  const loadArt = () => import('./art/ArtDemo.svelte');

  onMount(async () => {
    await game.init();
    void initAudio();
    void game.refreshOffline().then(() => game.autoDownload());
  });
</script>

{#if showArt}
  {#await loadArt() then m}<m.default />{/await}
{:else}
<main>
  <h1>La Leyenda del Quetzal</h1>
  <p class="sub">Espagnol 5e - aventure en immersion</p>
  <p class="soon">Bientôt</p>
  <!-- Accès temporaire à l'espace parent (appui long 3 s) : sera déplacé dans les réglages de l'écran d'accueil -->
  <div class="gate"><ParentGate onpass={() => (parentOpen = true)} /></div>
</main>
{/if}

{#if parentOpen}<ParentSpace onclose={() => (parentOpen = false)} />{/if}
<UpdateToast {updater} />

<style>
  main {
    height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
    padding: env(safe-area-inset-top) 24px env(safe-area-inset-bottom);
    background: radial-gradient(ellipse at 50% 70%, #7a1f2b 0%, #3d0f17 55%, #1a0508 100%);
  }
  h1 { margin: 0; font-size: clamp(2.2rem, 6vw, 4rem); text-align: center; color: #ffd98a; text-shadow: 0 5px 0 #1a0508; }
  .sub { margin: 0; opacity: 0.85; font-size: 1.3rem; }
  .soon { margin: 12px 0 0; font-size: 1.1rem; opacity: 0.6; }
  .gate { position: fixed; right: 12px; bottom: 12px; opacity: 0.5; }
</style>
