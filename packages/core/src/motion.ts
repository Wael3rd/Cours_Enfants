import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MorphSVGPlugin, SplitText, Physics2DPlugin);

/** Eases maison nommees (`ease: 'ceSnap'`). */
CustomEase.create('ceSnap', '0.2,0.9,0.1,1'); // arrivee vive, atterrissage doux
CustomEase.create('cePunch', '0.34,1.56,0.64,1'); // overshoot franc (pop)
CustomEase.create('cePress', '0.4,0,0.2,1');
export const eases = ['ceSnap', 'cePunch', 'cePress'] as const;

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

type Target = gsap.TweenTarget;

/** Pop : l'element "claque" (scale overshoot). Version attenuee si reduced-motion. */
export function pop(el: Target, scale = 1.25): gsap.core.Timeline {
  const s = prefersReducedMotion() ? 1.08 : scale;
  return gsap
    .timeline()
    .to(el, { scale: s, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
    .to(el, { scale: 1, duration: 0.35, ease: 'cePunch' });
}

/** Shake horizontal decroissant (erreur). */
export function shake(el: Target, amp = 14): gsap.core.Timeline {
  const a = prefersReducedMotion() ? amp / 3 : amp;
  const tl = gsap.timeline();
  for (const x of [a, -a, a * 0.6, -a * 0.4, 0]) tl.to(el, { x, duration: 0.06, ease: 'power1.inOut', overwrite: 'auto' });
  return tl;
}

/** Compteur anime jusqu'a `to` dans le textContent de `el`. */
export function countUp(
  el: HTMLElement,
  to: number,
  opts: { from?: number; duration?: number; format?: (n: number) => string } = {},
): gsap.core.Tween {
  const o = { v: opts.from ?? 0 };
  const fmt = opts.format ?? ((n: number) => String(Math.round(n)));
  return gsap.to(o, {
    v: to,
    duration: prefersReducedMotion() ? 0.01 : (opts.duration ?? 1),
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = fmt(o.v);
    },
    onComplete: () => {
      el.textContent = fmt(to);
    },
  });
}

/** Gerbe de confettis depuis (x,y) (px ecran) dans `parent`. Transform/opacity uniquement. */
export function burst(
  parent: HTMLElement,
  x: number,
  y: number,
  opts: { count?: number; colors?: string[]; size?: number } = {},
): void {
  const count = prefersReducedMotion() ? 6 : (opts.count ?? 24);
  const colors = opts.colors ?? ['#ffd400', '#ffffff', '#12a34a', '#c8102e'];
  const size = opts.size ?? 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    Object.assign(p.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size * 0.6}px`,
      background: colors[i % colors.length],
      borderRadius: '2px',
      pointerEvents: 'none',
      willChange: 'transform, opacity',
      zIndex: '9999',
    });
    parent.appendChild(p);
    gsap.to(p, {
      duration: 1.1 + Math.random() * 0.5,
      physics2D: { velocity: 350 + Math.random() * 450, angle: -90 + (Math.random() - 0.5) * 140, gravity: 1100 },
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      ease: 'power1.in',
      onComplete: () => p.remove(),
    });
  }
}

export { gsap, CustomEase, MotionPathPlugin, MorphSVGPlugin, SplitText, Physics2DPlugin };
