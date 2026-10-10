<script lang="ts">
  import { onMount } from 'svelte';
  import { UpdateToast, type Updater } from '@ce/core';
  import type { SessionResult } from '../../maths/src/engine/index.ts';
  import { app } from './state/store.svelte.ts';
  import { setupAudio, applyAudioSettings } from './lib/sound.ts';
  import type { RunConfig } from './lib/run.ts';
  import Home from './screens/Home.svelte';
  import Explain from './screens/Explain.svelte';
  import Practice from './screens/Practice.svelte';
  import End from './screens/End.svelte';

  let { updater }: { updater: Updater } = $props();

  type Screen = 'home' | 'explain' | 'run' | 'end';
  let screen = $state<Screen>('home');
  let cfg = $state<RunConfig>({ kind: 'mix' });
  let result = $state<SessionResult | null>(null);
  let runId = $state(0);

  onMount(async () => {
    setupAudio();
    await app.load();
    applyAudioSettings();
  });

  function pick(c: RunConfig) {
    cfg = c;
    // Explication seulement pour un module precis ; « Tout melanger » et « Defi vitesse » demarrent directement.
    screen = c.kind === 'zone' ? 'explain' : 'run';
    runId++;
  }
  const start = () => { screen = 'run'; runId++; };
  const home = () => { screen = 'home'; };
</script>

{#if app.ready}
  {#if screen === 'home'}<Home onpick={pick} />
  {:else if screen === 'explain' && cfg.kind === 'zone'}<Explain zone={cfg.zone} onstart={start} onback={home} />
  {:else if screen === 'run'}
    {#key runId}<Practice {cfg} onend={(r) => { result = r; screen = 'end'; }} onquit={home} />{/key}
  {:else if screen === 'end' && result}
    <End {result} {cfg} onretry={start} onback={home} />
  {/if}
{/if}

<UpdateToast {updater} />
