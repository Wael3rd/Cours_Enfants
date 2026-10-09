<script lang="ts">
  /**
   * Scene du Desafio : le Quetzal (gauche) lance un sort a chaque bonne reponse, la Sombra (droite) attaque a chaque erreur.
   * Vie de la Sombra (barre) et coeurs du joueur en props ; methodes : cast(), strike(), refill(), defeat().
   */
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { sfx } from '../services/sfx';
  import { floatText } from './fx';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';
  import SombraFigure from '../art/SombraFigure.svelte';
  import Icon from './Icon.svelte';

  interface Props { hp: number; lives: number; maxLives: number; name?: string; }
  let { hp, lives, maxLives, name = 'La Sombra del Silencio' }: Props = $props();
  let scene: HTMLElement | undefined = $state();
  let quetzal: QuetzalMascot | undefined = $state();
  let sombra: SombraFigure | undefined = $state();
  let qEl: HTMLElement | undefined = $state();
  let sEl: HTMLElement | undefined = $state();
  let hearts: HTMLElement | undefined = $state();
  let defeated = $state(false);

  const SPELLS = ['¡Luz del Quetzal!', '¡Pluma brillante!', '¡Voz clara!', '¡Eco dorado!', '¡Palabra mágica!', '¡Canto verde!'];
  let spellN = 0;

  function center(el: Element | undefined) {
    const r = el!.getBoundingClientRect();
    const s = scene!.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }

  function orb(color: string, from: { x: number; y: number }, to: { x: number; y: number }, size = 46): Promise<void> {
    return new Promise((res) => {
      const el = document.createElement('i');
      Object.assign(el.style, { position: 'absolute', left: '0', top: '0', width: `${size}px`, height: `${size}px`, borderRadius: '50%', marginLeft: `${-size / 2}px`, marginTop: `${-size / 2}px`, background: `radial-gradient(circle at 35% 30%, #fff, ${color} 55%, transparent 75%)`, boxShadow: `0 0 28px ${color}`, willChange: 'transform' });
      scene!.appendChild(el);
      gsap.set(el, { x: from.x, y: from.y, scale: 0.3 });
      const dur = prefersReducedMotion() ? 0.15 : 0.5;
      gsap.timeline({ onComplete: () => { el.remove(); res(); } })
        .to(el, { scale: 1.2, duration: 0.15, ease: 'back.out(3)' })
        .to(el, { x: to.x, y: to.y - 10, duration: dur, ease: 'power2.in' }, '>-0.02');
    });
  }

  /** Bonne reponse : sort du Quetzal -> la Sombra encaisse. */
  export async function cast(): Promise<void> {
    if (!scene || !qEl || !sEl) return;
    const spell = SPELLS[spellN++ % SPELLS.length];
    quetzal?.flap(2);
    sfx('spell');
    const a = center(qEl);
    const b = center(sEl);
    floatText(scene, spell, '#ffe08a', 120);
    await orb('#ffd34d', { x: a.x + 40, y: a.y - 20 }, b);
    sfx('hit');
    haptic('good');
    if (!prefersReducedMotion()) {
      gsap.fromTo(sEl, { x: 0 }, { x: 16, duration: 0.05, repeat: 7, yoyo: true, ease: 'sine.inOut', clearProps: 'x' });
      gsap.fromTo(sEl, { opacity: 0.25 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
    sombra?.narrow();
  }

  /** Erreur : la Sombra attaque, un coeur se brise (jamais de game over). */
  export async function strike(): Promise<void> {
    if (!scene || !qEl || !sEl) return;
    sfx('slash');
    const a = center(qEl);
    const b = center(sEl);
    await orb('#6a3df0', { x: b.x - 40, y: b.y }, a, 56);
    haptic('bad');
    quetzal?.setPose('sad', 0.2);
    if (!prefersReducedMotion()) {
      gsap.fromTo(scene, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.25)' });
      gsap.fromTo(qEl, { opacity: 0.3 }, { opacity: 1, duration: 0.6 });
    }
    setTimeout(() => quetzal?.setPose('perched', 0.5), 900);
  }

  export function refill(): void {
    sfx('item');
    if (hearts && !prefersReducedMotion()) gsap.fromTo(hearts.children, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(3)' });
    quetzal?.flap(3);
  }

  /** Victoire : la Sombra se dissout. */
  export async function defeat(): Promise<void> {
    sfx('win');
    quetzal?.setPose('happy', 0.4);
    quetzal?.flap(3);
    if (sombra) await sombra.dissolve(1.6);
    defeated = true;
  }
</script>

<div class="scene" bind:this={scene}>
  <div class="bgfx" aria-hidden="true"></div>
  <div class="hearts" bind:this={hearts} role="img" aria-label={`${lives} corazones`}>
    {#each Array(maxLives) as _, i}<span class="h" class:lost={i >= lives}><Icon name="heart" size={34} /></span>{/each}
  </div>
  <div class="hp">
    <b>{name}</b>
    <span class="bar"><i style:transform="scaleX({Math.max(0, hp)})"></i></span>
  </div>
  <div class="q" bind:this={qEl}><QuetzalMascot bind:this={quetzal} pose="perched" width={112} /></div>
  <div class="s" bind:this={sEl} class:gone={defeated}><SombraFigure bind:this={sombra} width={128} arm /></div>
</div>

<style>
  .scene { container-type: inline-size; position: relative; flex: none; height: 176px; overflow: hidden; background: radial-gradient(ellipse at 75% 60%, #4a2a9a, #1b0d3a 70%); box-shadow: inset 0 -10px 24px rgba(0, 0, 0, 0.5); }
  .bgfx { position: absolute; inset: 0; background: repeating-linear-gradient(100deg, rgba(255, 255, 255, 0.03) 0 2px, transparent 2px 38px); }
  .hearts { position: absolute; left: 20px; top: 10px; display: flex; gap: 4px; z-index: 2; }
  .h { color: #ff4f7b; filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.5)); transition: transform 0.3s cubic-bezier(0.2, 1.6, 0.4, 1), color 0.3s; }
  .h.lost { color: #4a3f6a; transform: scale(0.8); }
  .hp { position: absolute; left: 50%; margin-left: -190px; top: 10px; z-index: 2; width: 380px; display: grid; gap: 6px; text-align: center; }
  .hp b { font: 400 24px/1 var(--q-font-title); color: #d6c8ff; text-shadow: 0 3px 0 #000a; }
  .bar { display: block; height: 22px; border-radius: 14px; overflow: hidden; background: #0b0d2a; box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.6), 0 0 0 3px #a99bff; }
  .bar i { display: block; height: 100%; width: 100%; transform-origin: 100% 50%; background: linear-gradient(180deg, #c8b8ff, #7b4cf0 55%, #4a2a9a); transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.1, 1); }
  .q { position: absolute; left: 90px; bottom: 6px; }
  .s { position: absolute; right: 90px; bottom: -4px; }
  .s.gone { visibility: hidden; }
  /* portrait / etroit : les coeurs passent sous la barre de vie, entre les deux personnages */
  @container (max-width: 1000px) {
    .hp { top: 8px; margin-left: -160px; width: 320px; }
    .hearts { left: 50%; transform: translateX(-50%); top: 74px; gap: 2px; }
    .hearts :global(svg) { width: 28px; height: 28px; }
  }
</style>
