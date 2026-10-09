import { burst, gsap, prefersReducedMotion } from '@ce/core';

const rect = (el: Element) => el.getBoundingClientRect();

/** Pastille "+N XP" qui s'envole de `from` vers `to` (transform/opacity uniquement), puis fait claquer la cible. */
export function flyXp(from: Element | null | undefined, to: Element | null | undefined, text: string, color = '#ffc83d'): void {
  if (!from || !to) return;
  const a = rect(from);
  const b = rect(to);
  const el = document.createElement('div');
  el.textContent = text;
  Object.assign(el.style, {
    position: 'fixed', left: '0', top: '0', zIndex: '90', pointerEvents: 'none', willChange: 'transform, opacity',
    font: '900 30px/1 Nunito, system-ui, sans-serif', color: '#fff', padding: '8px 16px', borderRadius: '999px',
    background: color, boxShadow: '0 5px 0 rgba(0,0,0,.35), inset 0 0 0 3px rgba(255,255,255,.5)', textShadow: '0 2px 0 rgba(0,0,0,.35)',
    whiteSpace: 'nowrap',
  });
  document.body.appendChild(el);
  const sx = a.left + a.width / 2;
  const sy = a.top + a.height / 2;
  const ex = b.left + b.width / 2;
  const ey = b.top + b.height / 2;
  gsap.set(el, { x: sx, y: sy, xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0 });
  const reduce = prefersReducedMotion();
  gsap
    .timeline({ onComplete: () => el.remove() })
    .to(el, { scale: 1.15, opacity: 1, y: sy - 50, duration: 0.28, ease: 'back.out(2)' })
    .to(el, { x: ex, y: ey, scale: 0.5, duration: reduce ? 0.2 : 0.7, ease: 'power3.in' }, '+=0.12')
    .to(el, { opacity: 0, duration: 0.12 })
    .fromTo(to, { scale: 1 }, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, '-=0.15');
}

/** Gerbe d'etincelles (papel picado) autour d'un element. */
export function sparks(el: Element | null | undefined, colors = ['#ffc83d', '#d93472', '#19b7aa', '#fff3d1'], count = 18): void {
  if (!el) return;
  const r = rect(el);
  burst(document.body, r.left + r.width / 2, r.top + r.height / 2, { count, colors, size: 12 });
}

/** Texte flottant (ex. "¡Genial!") qui monte et s'efface. */
export function floatText(at: Element | null | undefined, text: string, color = '#fff'): void {
  if (!at) return;
  const r = rect(at);
  const el = document.createElement('div');
  el.textContent = text;
  Object.assign(el.style, {
    position: 'fixed', left: `${r.left + r.width / 2}px`, top: `${r.top}px`, zIndex: '90', pointerEvents: 'none', willChange: 'transform, opacity',
    font: '400 44px/1 "Alfa Slab One", Georgia, serif', color, textShadow: '0 4px 0 rgba(0,0,0,.45)', whiteSpace: 'nowrap',
  });
  document.body.appendChild(el);
  gsap.fromTo(el, { xPercent: -50, y: 0, opacity: 0, scale: 0.6 }, { y: -70, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' });
  gsap.to(el, { y: -120, opacity: 0, duration: 0.5, delay: 0.7, ease: 'power1.in', onComplete: () => el.remove() });
}
