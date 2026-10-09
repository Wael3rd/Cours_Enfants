<script lang="ts">
  /** Barre d'XP : remplissage en transform (scaleX) anime par GSAP, pastille de niveau, reflet qui passe a chaque gain. */
  import { gsap, prefersReducedMotion } from '@ce/core';

  interface Props {
    value: number;
    max: number;
    level: number;
    label?: string;
    color?: string;
    width?: number;
  }
  let { value, max, level, label = 'XP', color = '#19b7aa', width = 520 }: Props = $props();
  let fill: HTMLElement | undefined = $state();
  let glint: HTMLElement | undefined = $state();
  let shown = $state(0);
  let first = true;

  $effect(() => {
    const target = Math.max(0, Math.min(1, value / max));
    if (!fill) return;
    if (first || prefersReducedMotion()) {
      gsap.set(fill, { scaleX: target });
      shown = value;
      first = false;
      return;
    }
    const o = { v: shown };
    gsap.to(fill, { scaleX: target, duration: 0.9, ease: 'power3.out', overwrite: true });
    gsap.to(o, { v: value, duration: 0.9, ease: 'power3.out', onUpdate: () => { shown = Math.round(o.v); } });
    if (glint) gsap.fromTo(glint, { x: '-120%', opacity: 1 }, { x: '420%', opacity: 0, duration: 0.8, ease: 'power2.inOut', delay: 0.1 });
  });
</script>

<div class="xp" style:width="{width}px" style:--c={color} role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
  <div class="lvl"><small>nivel</small><b>{level}</b></div>
  <div class="track">
    <div class="fill" bind:this={fill}><i class="glint" bind:this={glint}></i></div>
    <span class="num">{shown} / {max} {label}</span>
  </div>
</div>

<style>
  .xp { position: relative; display: flex; align-items: center; height: 64px; }
  .lvl { position: relative; z-index: 2; flex: none; width: 76px; height: 76px; margin-right: -18px; border-radius: 50%; display: grid; place-content: center; text-align: center; background: radial-gradient(circle at 35% 30%, #ffe08a, #ffc83d 55%, #c98a12); box-shadow: 0 5px 0 #6b3d08, inset 0 0 0 4px rgba(255, 255, 255, 0.4); color: var(--q-nuit); }
  .lvl small { font: 800 13px/1 var(--q-font-body); letter-spacing: 0.04em; }
  .lvl b { font: 400 38px/1 var(--q-font-title); }
  .track { position: relative; flex: 1; height: 40px; border-radius: 0 20px 20px 0; overflow: hidden; background: #0b0d2a; box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.6), 0 0 0 3px #ffc83d, 0 5px 0 3px #6b3d08; }
  .fill { position: absolute; inset: 0; transform-origin: 0 50%; transform: scaleX(0); background: linear-gradient(180deg, color-mix(in srgb, var(--c) 60%, #fff), var(--c) 50%, color-mix(in srgb, var(--c) 70%, #000)); overflow: hidden; }
  .glint { position: absolute; top: 0; bottom: 0; width: 22%; background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.7), transparent); opacity: 0; }
  .num { position: absolute; inset: 0; display: grid; place-items: center; padding-left: 14px; font: 900 21px/1 var(--q-font-body); color: #fff; text-shadow: 0 2px 0 rgba(0, 0, 0, 0.55); }
</style>
