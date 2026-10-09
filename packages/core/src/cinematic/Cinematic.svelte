<script lang="ts" module>
  import '@hyperframes/player'; // enregistre <hyperframes-player>

  export type CinematicResult = 'ended' | 'skipped' | 'error';
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from '../motion';
  import { haptic } from '../haptics';

  interface Props {
    /** URL de la composition HyperFrames (ex. `${import.meta.env.BASE_URL}cinematics/proof-goal/index.html`). */
    src: string;
    /** Donnees dynamiques : { canal: payload }. Livrees au runtime de la composition (player.setRuntimeData). */
    data?: Record<string, unknown>;
    /** Bouton "passer" (apparait apres `skipAfterMs`). */
    skippable?: boolean;
    skipAfterMs?: number;
    /** Abandon si la composition n'est pas prete a temps (l'app ne reste jamais bloquee). */
    readyTimeoutMs?: number;
    onend?: (result: CinematicResult) => void;
  }
  let { src, data = {}, skippable = true, skipAfterMs = 600, readyTimeoutMs = 8000, onend }: Props = $props();

  let root: HTMLElement | undefined = $state();
  let player: HTMLElement | undefined = $state();
  let phase = $state<'loading' | 'playing' | 'done'>('loading');
  let canSkip = $state(false);
  let finished = false;

  function finish(result: CinematicResult) {
    if (finished) return;
    finished = true;
    phase = 'done';
    const done = () => onend?.(result);
    if (root) gsap.to(root, { opacity: 0, duration: 0.25, ease: 'power1.in', onComplete: done });
    else done();
  }

  onMount(() => {
    const p = player as any;
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (root) gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2 });

    // setRuntimeData retient la valeur et la livre des que le runtime de la composition est pret.
    for (const [channel, payload] of Object.entries(data)) p.setRuntimeData(channel, payload);

    const onReady = () => {
      phase = 'playing';
      p.play();
    };
    const onEnded = () => finish('ended');
    const onError = () => finish('error');
    p.addEventListener('ready', onReady);
    p.addEventListener('ended', onEnded);
    p.addEventListener('error', onError);
    timers.push(setTimeout(() => phase === 'loading' && finish('error'), readyTimeoutMs));
    if (skippable) timers.push(setTimeout(() => (canSkip = true), skipAfterMs));

    return () => {
      timers.forEach(clearTimeout);
      p.removeEventListener('ready', onReady);
      p.removeEventListener('ended', onEnded);
      p.removeEventListener('error', onError);
      p.pause?.();
    };
  });

  function skip() {
    haptic('tap');
    finish('skipped');
  }
</script>

<div class="cine" bind:this={root} data-state={phase} role="dialog" aria-label="Cinematique">
  <div class="frame">
    <hyperframes-player bind:this={player} {src} width="1920" height="1080"></hyperframes-player>
  </div>
  {#if skippable && canSkip && phase !== 'done'}
    <button type="button" class="skip" onclick={skip} aria-label="Passer">Passer &#9654;&#9654;</button>
  {/if}
</div>

<style>
  .cine { position: fixed; inset: 0; z-index: 3000; display: grid; place-items: center; background: #000; }
  .frame { width: min(100vw, calc(100vh * 16 / 9)); aspect-ratio: 16 / 9; }
  hyperframes-player { display: block; width: 100%; height: 100%; }
  .skip {
    position: absolute; top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right));
    min-width: 64px; min-height: 64px; padding: 0 28px; border: 0; border-radius: 32px;
    background: rgba(255, 255, 255, 0.9); color: #0b1b3a; font: inherit; font-weight: 800; font-size: 1.25rem; cursor: pointer;
  }
  .skip:active { transform: scale(0.95); }
</style>
