<script lang="ts">
  import { onMount } from 'svelte';
  import { UpdateToast, type Updater } from '@ce/core';
  import { app } from './state/store.svelte.ts';
  import { nav } from './lib/nav.svelte.ts';
  import { setupAudio, applyAudioSettings } from './lib/sound.ts';
  import { applyMotionSettings } from './lib/motion.ts';
  import Setup from './screens/Setup.svelte';
  import Placement from './screens/Placement.svelte';
  import Home from './screens/Home.svelte';
  import Match from './screens/Match.svelte';
  import Sprint from './screens/Sprint.svelte';
  import Penalties from './screens/Penalties.svelte';
  import Training from './screens/Training.svelte';
  import Rewards from './screens/Rewards.svelte';
  import Album from './screens/Album.svelte';
  import Trophies from './screens/Trophies.svelte';
  import AvatarScreen from './screens/AvatarScreen.svelte';

  let { updater }: { updater: Updater } = $props();
  // Laboratoire du kit graphique : accessible uniquement depuis l'espace parent (/maths/#art).
  const showArt = location.hash === '#art';
  const loadArt = () => import('./art/ArtDemo.svelte');

  onMount(async () => {
    setupAudio();
    await app.load();
    applyAudioSettings();
    applyMotionSettings();
    nav.go(!app.state.setupDone ? 'setup' : !app.state.placementDone ? 'placement' : 'home');
  });
</script>

{#if showArt}
  {#await loadArt() then m}<m.default />{/await}
{:else if app.ready}
  {#if nav.screen === 'setup'}<Setup />
  {:else if nav.screen === 'placement'}<Placement />
  {:else if nav.screen === 'home'}<Home />
  {:else if nav.screen === 'match'}<Match />
  {:else if nav.screen === 'sprint'}<Sprint />
  {:else if nav.screen === 'penalties'}<Penalties />
  {:else if nav.screen === 'training'}<Training />
  {:else if nav.screen === 'rewards'}<Rewards />
  {:else if nav.screen === 'album'}<Album />
  {:else if nav.screen === 'trophies'}<Trophies />
  {:else if nav.screen === 'avatar'}<AvatarScreen />
  {/if}
{/if}

<UpdateToast {updater} />
