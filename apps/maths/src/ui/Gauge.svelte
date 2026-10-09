<script lang="ts">
  /** Jauge de puissance de tir : baisse doucement sur `ms`, puis reste a un niveau "tir normal" (jamais de compte a rebours anxiogene). */
  import { gsap } from '@ce/core';
  let { floor = 0.24 }: { floor?: number } = $props();
  let fill: HTMLDivElement | undefined = $state();
  let tw: gsap.core.Tween | undefined;
  let glow: HTMLDivElement | undefined = $state();

  export function start(ms: number): void {
    tw?.kill();
    if (!fill || !glow) return;
    gsap.set(fill, { scaleX: 1 });
    gsap.set(glow, { opacity: 1 });
    tw = gsap.to(fill, { scaleX: floor, duration: ms / 1000, ease: 'none' });
    gsap.to(glow, { opacity: 0, duration: ms / 1000, ease: 'power1.in', overwrite: true });
  }
  export function stop(): void {
    tw?.kill();
  }
</script>

<div class="gauge" aria-hidden="true">
  <svg class="bolt" viewBox="0 0 24 32" width="30" height="40"><path d="M14 0 L2 18 H11 L8 32 L22 12 H13Z" fill="#FFD23F" stroke="#0A1030" stroke-width="2.5" stroke-linejoin="round" /></svg>
  <div class="track">
    <div bind:this={fill} class="fill"></div>
    <div bind:this={glow} class="glow"></div>
    <div class="ticks"></div>
  </div>
</div>

<style>
  .gauge { display: flex; align-items: center; gap: 12px; }
  .track { position: relative; flex: 1; height: 30px; border-radius: 15px; overflow: hidden; background: rgba(7, 12, 43, 0.75); border: 3px solid rgba(255, 255, 255, 0.85); box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.6); }
  .fill { position: absolute; inset: 0; transform-origin: 0 50%; background: linear-gradient(90deg, #35D6FF, #1BBF5E 45%, #FFD23F 100%); will-change: transform; }
  .glow { position: absolute; inset: 0; background: linear-gradient(rgba(255, 255, 255, 0.5), transparent 55%); will-change: opacity; }
  .ticks { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 calc(10% - 3px), rgba(7, 12, 43, 0.55) calc(10% - 3px) 10%); }
</style>
