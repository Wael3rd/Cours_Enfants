<script lang="ts">
  /**
   * Ecran "¡Nivel!" : rayons de soleil, le quetzal passe en plein vol, le numero de niveau claque (elastic), recompenses en cascade,
   * confettis de papel picado. Une seule sequence GSAP (~3 s) puis bouton. `onclose` quand le joueur continue.
   */
  import { onMount } from 'svelte';
  import { gsap, prefersReducedMotion, playSfx, haptic } from '@ce/core';
  import * as Q from './core/qart.js';
  import PrimaryButton from './PrimaryButton.svelte';

  interface Reward { icon?: string; label: string }
  interface Props { level: number; rewards?: Reward[]; onclose?: () => void }
  let { level, rewards = [], onclose }: Props = $props();

  let root: HTMLElement | undefined = $state();
  const bird = Q.quetzal({ width: 420, height: 504 });
  // confettis deterministes (papel picado)
  const rnd = Q.rng(12);
  const COL = ['#ffc83d', '#d93472', '#19b7aa', '#c9573b', '#0e9f6e', '#ff9f1c'];
  const bits = Array.from({ length: 36 }, (_, i) => ({ x: rnd() * 100, d: rnd() * 0.9, s: 14 + rnd() * 22, c: COL[i % COL.length], r: rnd() * 360, dur: 2.2 + rnd() * 1.6, sw: (rnd() - 0.5) * 160 }));

  onMount(() => {
    if (!root) return;
    const q = (s: string) => root!.querySelector(s) as HTMLElement;
    const reduce = prefersReducedMotion();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    Q.quetzalSet(q('.bird'), 'glide', gsap);
    if (reduce) { gsap.set([q('.title'), q('.num'), q('.btn'), ...root.querySelectorAll('.rw')], { opacity: 1 }); return; }
    gsap.set(q('.bird'), { x: -900, y: 120, rotation: -8 });
    tl.fromTo(q('.rays'), { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1 }, 0)
      .call(() => { try { playSfx('level-up'); } catch { /* */ } haptic('win'); }, [], 0.1)
      .to(q('.bird'), { x: 0, y: 0, rotation: 0, duration: 1.1, ease: 'power4.out' }, 0.15);
    Q.quetzalFlap(tl, q('.bird'), 0.15, 3, 0.36, 1);
    Q.quetzalPoseTo(tl, q('.bird'), 'happy', 1.1, 0.5);
    tl.fromTo(q('.title'), { y: 60, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2.4)' }, 0.55)
      .fromTo(q('.num'), { scale: 3.2, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: -3, duration: 0.8, ease: 'elastic.out(1,0.55)' }, 0.85)
      .fromTo(root.querySelectorAll('.rw'), { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.14 }, 1.5)
      .fromTo(q('.btn'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.5 + rewards.length * 0.14 + 0.2);
    root.querySelectorAll('.bit').forEach((b) => {
      const d = +(b as HTMLElement).dataset.d!;
      tl.fromTo(b, { y: -80, opacity: 1 }, { y: 1300, x: +(b as HTMLElement).dataset.sw!, rotation: '+=540', duration: +(b as HTMLElement).dataset.dur!, ease: 'power1.in' }, 0.6 + d);
    });
    tl.to(q('.rays'), { rotation: 25, duration: 5, ease: 'none' }, 0);
    return () => tl.kill();
  });
</script>

<div class="lv" bind:this={root} role="dialog" aria-label="¡Nivel {level}!">
  <div class="rays"></div>
  {#each bits as b}
    <i class="bit" data-d={b.d} data-sw={b.sw} data-dur={b.dur} style:left="{b.x}%" style:width="{b.s}px" style:height="{b.s * 1.3}px" style:background={b.c} style:transform="rotate({b.r}deg)"></i>
  {/each}
  <div class="bird">{@html bird}</div>
  <div class="center">
    <h2 class="title">¡Nivel!</h2>
    <div class="num">{level}</div>
    <ul class="rews">
      {#each rewards as r}<li class="rw">{#if r.icon}<img src={r.icon} alt="" />{/if}<span>{r.label}</span></li>{/each}
    </ul>
    <div class="btn"><PrimaryButton variant="turquesa" size="lg" onclick={() => onclose?.()}>¡Seguir!</PrimaryButton></div>
  </div>
</div>

<style>
  .lv { position: fixed; inset: 0; z-index: 50; overflow: hidden; display: grid; place-items: center; background: radial-gradient(ellipse at 50% 45%, #3b2a8a, #14173f 70%); }
  .rays { position: absolute; left: 50%; top: 46%; width: 2400px; height: 2400px; margin: -1200px 0 0 -1200px; opacity: 0; background: repeating-conic-gradient(from 0deg, rgba(255, 200, 61, 0.2) 0deg 7deg, transparent 7deg 22deg); -webkit-mask: radial-gradient(closest-side, #000 20%, transparent 72%); mask: radial-gradient(closest-side, #000 20%, transparent 72%); }
  .bit { position: absolute; top: 0; opacity: 0; border-radius: 3px; }
  .bird { position: absolute; left: 3%; bottom: 4%; }
  .bird :global(svg) { overflow: visible; }
  .center { position: relative; z-index: 2; text-align: center; font-family: var(--q-font-body); }
  .title { margin: 0; opacity: 0; font: 400 clamp(56px, 8vw, 110px)/1 var(--q-font-title); color: var(--q-sol); text-shadow: 0 6px 0 #8a4a05, 0 14px 0 rgba(0, 0, 0, 0.25); }
  .num { opacity: 0; font: 400 clamp(150px, 24vw, 320px)/0.9 var(--q-font-title); color: #fff; -webkit-text-stroke: 10px #14173f; paint-order: stroke fill; text-shadow: 0 12px 0 var(--q-magenta), 0 26px 0 rgba(0, 0, 0, 0.3); }
  .rews { list-style: none; margin: 10px 0 24px; padding: 0; display: grid; gap: 10px; justify-items: center; }
  .rw { opacity: 0; display: flex; align-items: center; gap: 12px; padding: 8px 24px 8px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.7); color: var(--q-papel); font: 800 30px/1 var(--q-font-body); }
  .rw img { width: 48px; height: 48px; }
  .btn { opacity: 0; display: inline-block; }
</style>
