<script lang="ts">
  /**
   * Mini-terrain (vue de cote, "plan TV") : le joueur et le ballon avancent a chaque bonne reponse (`advance`),
   * `shoot()` envoie le ballon dans la cage (but en jeu, ~0,6 s), `reset()` ramene tout au centre.
   * Uniquement transform / opacity (GSAP).
   */
  import { gsap } from '@ce/core';
  import PlayerSide from '../art/PlayerSide.svelte';
  import Ball from '../art/Ball.svelte';
  import type { AvatarLook } from '../state/model.ts';
  import { sfx } from '../lib/sound.ts';

  let { look, primary, secondary, shoe = '#121528', height = 250 }: { look: AvatarLook; primary: string; secondary: string; shoe?: string; height?: number } = $props();

  let w = $state(700);
  let actor: HTMLDivElement | undefined = $state();
  let ballEl: HTMLDivElement | undefined = $state();
  let goalEl: HTMLDivElement | undefined = $state();
  let netEl: HTMLDivElement | undefined = $state();
  let speed = $state(0.45);
  let progress = 0;

  const PW = 118; // largeur du joueur
  const maxX = $derived(Math.max(0, w - PW - 190));

  function xFor(p: number): number {
    return p * maxX;
  }

  /** Avance vers la cage (p entre 0 et 1). */
  export function advance(p: number): void {
    progress = Math.min(1, p);
    if (!actor) return;
    speed = 2.4;
    gsap.to(actor, { x: xFor(progress), duration: 0.5, ease: 'power2.out', overwrite: 'auto', onComplete: () => { speed = 0.45; } });
    gsap.fromTo(ballEl!, { y: 0 }, { y: -16, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.out' });
  }

  /** Tir : le ballon part du pied, arc, filet qui bouge. Resolue quand le ballon touche le filet. */
  export function shoot(): Promise<void> {
    return new Promise((resolve) => {
      if (!ballEl || !goalEl) return resolve();
      const start = gsap.getProperty(actor!, 'x') as number;
      const goalX = w - PW - 120 - start;
      sfx('kick-quick');
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(ballEl, { x: goalX, duration: 0.34, ease: 'power1.in' }, 0);
      tl.to(ballEl, { y: -70, duration: 0.17, ease: 'power2.out' }, 0);
      tl.to(ballEl, { y: -10, duration: 0.17, ease: 'power2.in' }, 0.17);
      tl.add(() => {
        sfx('ball-net');
        // filet qui se tend une fois (secousse moderee, pas de vibration rapide)
        gsap.fromTo(netEl!, { scaleX: 1 }, { scaleX: 1.15, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut', transformOrigin: '0 50%' });
        gsap.fromTo(goalEl!, { y: 0 }, { y: -5, duration: 0.12, yoyo: true, repeat: 1, ease: 'sine.inOut' });
      }, 0.34);
      tl.to(ballEl, { x: goalX + 40, y: 14, opacity: 0, duration: 0.16, ease: 'power1.out' }, 0.34);
    });
  }

  /** Saut de joie du joueur. */
  export function celebrate(): void {
    if (!actor) return;
    gsap.timeline().to(actor, { y: -46, duration: 0.2, ease: 'power2.out' }).to(actor, { y: 0, duration: 0.24, ease: 'bounce.out' });
  }

  /** Retour au rond central (apres but). */
  export function reset(): void {
    progress = 0;
    if (!actor || !ballEl) return;
    gsap.timeline()
      .to(actor, { x: 0, y: 0, opacity: 0, duration: 0.18, ease: 'power1.in' })
      .set(ballEl, { x: 0, y: 0, opacity: 1 })
      .to(actor, { opacity: 1, duration: 0.2 });
  }
</script>

<div class="pitch" style:height="{height}px" bind:clientWidth={w}>
  <svg class="lines" viewBox="0 0 700 250" preserveAspectRatio="none" aria-hidden="true">
    <g fill="none" stroke="#fff" stroke-width="3" opacity=".55">
      <line x1="350" y1="6" x2="350" y2="244" /><circle cx="350" cy="125" r="46" />
      <rect x="-4" y="55" width="86" height="140" /><rect x="618" y="55" width="86" height="140" /><rect x="618" y="95" width="40" height="60" />
    </g>
  </svg>
  <div bind:this={goalEl} class="goal"><div bind:this={netEl} class="net"></div></div>
  <div bind:this={actor} class="actor">
    <div class="runner"><PlayerSide {primary} {secondary} {shoe} skin={look.skin} hair={look.hair} hairColor={look.hairColor} number={look.number} width={PW} {speed} /></div>
    <div bind:this={ballEl} class="ball"><Ball width={40} spin /></div>
  </div>
</div>

<style>
  .pitch {
    position: relative; width: 100%; border-radius: 26px; overflow: hidden; border: 4px solid rgba(255, 255, 255, 0.85);
    background: repeating-linear-gradient(90deg, #13923F 0 64px, #0F7F36 64px 128px);
    box-shadow: 0 10px 0 rgba(4, 36, 16, 0.7), 0 22px 40px rgba(0, 0, 0, 0.45), inset 0 0 40px rgba(0, 0, 0, 0.35);
  }
  .pitch::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(255, 255, 255, 0.12), transparent 40%, rgba(0, 0, 0, 0.22)); pointer-events: none; }
  .lines { position: absolute; inset: 0; width: 100%; height: 100%; }
  .goal { position: absolute; right: 14px; top: 50%; margin-top: -78px; width: 92px; height: 150px; border: 7px solid #fff; border-right: 0; border-radius: 10px 0 0 10px; will-change: transform; }
  .net { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.55) 0 2px, transparent 2px 14px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0 2px, transparent 2px 14px); background-color: rgba(10, 16, 48, 0.35); will-change: transform; }
  .actor { position: absolute; left: 26px; bottom: 20px; width: 118px; height: 160px; will-change: transform; }
  .runner { position: absolute; left: 0; bottom: 0; filter: drop-shadow(0 6px 4px rgba(0, 0, 0, 0.35)); }
  .ball { position: absolute; left: 104px; bottom: 2px; will-change: transform; }
</style>
