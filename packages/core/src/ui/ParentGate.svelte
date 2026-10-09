<script lang="ts">
  import type { Snippet } from 'svelte';
  import ProgressRing from './ProgressRing.svelte';
  import { haptic } from '../haptics';

  interface Props {
    /** Appele quand l'appui long est mene a terme. */
    onpass: () => void;
    holdMs?: number;
    children?: Snippet;
    label?: string;
  }
  let { onpass, holdMs = 3000, children, label = 'Maintenir 3 secondes (parents)' }: Props = $props();

  let progress = $state(0);
  let raf = 0;
  let t0 = 0;

  function tick(now: number) {
    progress = Math.min(1, (now - t0) / holdMs);
    if (progress >= 1) {
      cancel(false);
      haptic('win');
      onpass();
      return;
    }
    raf = requestAnimationFrame(tick);
  }
  function start(e: PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    t0 = performance.now();
    haptic('press');
    raf = requestAnimationFrame(tick);
  }
  function cancel(reset = true) {
    cancelAnimationFrame(raf);
    raf = 0;
    if (reset) progress = 0;
  }
</script>

<button
  type="button"
  class="gate"
  aria-label={label}
  onpointerdown={start}
  onpointerup={() => cancel()}
  onpointercancel={() => cancel()}
  onlostpointercapture={() => cancel()}
  oncontextmenu={(e) => e.preventDefault()}
>
  <ProgressRing value={progress} size={72} stroke={8}>
    {#if children}{@render children()}{:else}<span aria-hidden="true">&#9881;</span>{/if}
  </ProgressRing>
</button>

<style>
  .gate { min-width: 72px; min-height: 72px; padding: 0; border: 0; background: transparent; color: #fff; font-size: 1.8rem; cursor: pointer; }
</style>
