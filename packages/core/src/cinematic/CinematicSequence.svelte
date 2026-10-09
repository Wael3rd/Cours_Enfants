<script lang="ts">
  /**
   * Enchaine plusieurs compositions HyperFrames dans UN SEUL overlay : la partie suivante est chargee (et prete,
   * en pause a t=0) pendant que la courante joue ; au `ended`, bascule immediate sans trou (chaque partie finit/commence
   * par un fondu depuis/vers l'encre). Le bouton passer saute toute la sequence.
   */
  import { onMount } from 'svelte';
  import { gsap } from '../motion';
  import { haptic } from '../haptics';
  import type { CinematicResult } from './Cinematic.svelte';

  interface Props {
    srcs: string[];
    data?: Record<string, unknown>;
    skipLabel?: string;
    skipAfterMs?: number;
    readyTimeoutMs?: number;
    onend?: (result: CinematicResult) => void;
  }
  let { srcs, data = {}, skipLabel = 'Passer', skipAfterMs = 600, readyTimeoutMs = 8000, onend }: Props = $props();

  let root: HTMLElement | undefined = $state();
  let players: (HTMLElement | undefined)[] = $state([]);
  let cur = $state(0);
  let canSkip = $state(false);
  let over = $state(false);
  let playing = $state(false);
  let ready: boolean[] = [];
  let finished = false;

  function finish(result: CinematicResult) {
    if (finished) return;
    finished = true;
    over = true;
    const done = () => onend?.(result);
    if (root) gsap.to(root, { opacity: 0, duration: 0.25, ease: 'power1.in', onComplete: done });
    else done();
  }

  let waitTimer: ReturnType<typeof setTimeout> | undefined;

  /** Action : branche une <hyperframes-player> (donnees, ready/ended/error). */
  function wire(node: HTMLElement, i: number) {
    const p = node as any;
    for (const [channel, payload] of Object.entries(data)) p.setRuntimeData(channel, payload);
    const onReady = () => {
      ready[i] = true;
      if (i === cur) {
        clearTimeout(waitTimer);
        playing = true;
        p.play();
      }
    };
    const onEnded = () => {
      if (i !== cur) return;
      if (cur >= srcs.length - 1) return finish('ended');
      cur += 1;
      if (ready[cur]) (players[cur] as any)?.play?.();
      else waitTimer = setTimeout(() => !ready[cur] && finish('error'), readyTimeoutMs);
    };
    const onError = () => finish('error');
    p.addEventListener('ready', onReady);
    p.addEventListener('ended', onEnded);
    p.addEventListener('error', onError);
    return {
      destroy() {
        p.removeEventListener('ready', onReady);
        p.removeEventListener('ended', onEnded);
        p.removeEventListener('error', onError);
        p.pause?.();
      },
    };
  }

  onMount(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (root) gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    timers.push(setTimeout(() => !ready[0] && finish('error'), readyTimeoutMs));
    timers.push(setTimeout(() => (canSkip = true), skipAfterMs));
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(waitTimer);
    };
  });

  function skip() {
    haptic('tap');
    finish('skipped');
  }
</script>

<div class="cine" bind:this={root} data-state={over ? 'done' : playing ? 'playing' : 'loading'} data-seq={cur} role="dialog" aria-label="Cinematique">
  <div class="frame">
    {#each srcs as src, i (src)}
      <!-- seules la partie courante et la suivante sont chargees ; les parties passees sont retirees -->
      {#if i >= cur && i <= cur + 1}
        <hyperframes-player use:wire={i} bind:this={players[i]} {src} width="1920" height="1080" class:on={i === cur}></hyperframes-player>
      {/if}
    {/each}
  </div>
  {#if canSkip && !over}
    <button type="button" class="skip" onclick={skip} aria-label={skipLabel}>{skipLabel} &#9654;&#9654;</button>
  {/if}
</div>

<style>
  .cine { position: fixed; inset: 0; z-index: 3000; display: grid; place-items: center; background: #0b0d2a; }
  .frame { position: relative; width: min(100vw, calc(100vh * 16 / 9)); aspect-ratio: 16 / 9; }
  hyperframes-player { position: absolute; inset: 0; display: block; width: 100%; height: 100%; opacity: 0; pointer-events: none; }
  hyperframes-player.on { opacity: 1; z-index: 1; }
  .skip {
    position: absolute; z-index: 5; top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right));
    min-width: 64px; min-height: 64px; padding: 0 28px; border: 0; border-radius: 32px;
    background: rgba(255, 255, 255, 0.9); color: #0b1b3a; font: inherit; font-weight: 800; font-size: 1.25rem; cursor: pointer;
  }
  .skip:active { transform: scale(0.95); }
</style>
