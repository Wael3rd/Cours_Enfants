/**
 * Glisser-deposer tactile (pointer events, transform uniquement). Action Svelte : `use:drag={{ ondrop, ontap, ... }}`.
 * - un toucher court (< 8 px de deplacement) = `ontap` (repli accessible : tout se fait aussi au toucher) ;
 * - un glissement deplace l'element sous le doigt (translate + leger agrandissement) ; au relachement `ondrop(x, y)` recoit la
 *   position ecran ; si rien n'a consomme le depot (`ondrop` renvoie false), l'element revient a sa place en ressort.
 */
import { gsap } from '@ce/core';

export interface DragOptions {
  ondrop?: (x: number, y: number, el: HTMLElement) => boolean | void;
  ontap?: (el: HTMLElement) => void;
  onstart?: (el: HTMLElement) => void;
  onmove?: (x: number, y: number, el: HTMLElement) => void;
  disabled?: boolean;
}

export function drag(node: HTMLElement, initial: DragOptions) {
  let o = initial;
  let id = -1;
  let sx = 0;
  let sy = 0;
  let moved = false;

  const down = (e: PointerEvent) => {
    if (o.disabled || id !== -1) return;
    id = e.pointerId;
    sx = e.clientX;
    sy = e.clientY;
    moved = false;
    node.setPointerCapture?.(id);
  };
  const move = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (!moved && Math.hypot(dx, dy) > 8) {
      moved = true;
      node.style.zIndex = '60';
      node.style.willChange = 'transform';
      node.classList.add('dragging');
      gsap.killTweensOf(node);
      o.onstart?.(node);
    }
    if (moved) {
      gsap.set(node, { x: dx, y: dy, scale: 1.1, rotation: dx * 0.02 });
      o.onmove?.(e.clientX, e.clientY, node);
    }
  };
  const end = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    id = -1;
    try { node.releasePointerCapture?.(e.pointerId); } catch { /* deja libere */ }
    if (!moved) {
      o.ontap?.(node);
      return;
    }
    node.classList.remove('dragging');
    const consumed = o.ondrop?.(e.clientX, e.clientY, node);
    // si le depot a ete consomme l'element est (re)rendu ailleurs ; sinon retour en ressort
    if (node.isConnected) {
      gsap.to(node, { x: 0, y: 0, scale: 1, rotation: 0, duration: consumed ? 0.01 : 0.45, ease: consumed ? 'none' : 'elastic.out(1,0.55)', onComplete: () => { node.style.zIndex = ''; node.style.willChange = ''; } });
    }
  };
  const cancel = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    id = -1;
    node.classList.remove('dragging');
    gsap.to(node, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.25 });
  };

  node.style.touchAction = 'none';
  node.addEventListener('pointerdown', down);
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerup', end);
  node.addEventListener('pointercancel', cancel);
  return {
    update(next: DragOptions) {
      o = next;
    },
    destroy() {
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', end);
      node.removeEventListener('pointercancel', cancel);
    },
  };
}

/** Le point (x, y) est-il dans le rectangle de `el` (marge en px) ? */
export function inside(el: Element | null | undefined, x: number, y: number, pad = 0): boolean {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
}
