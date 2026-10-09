<script lang="ts">
  /**
   * Carte du monde hispanique. `states` : etat de chaque region ('locked' | 'open' | 'current' | 'done') ; les regions verrouillees
   * sont sous le brouillard de guerre. Tap sur une region deverrouillee -> `onselect(id)` (verrouillee : elle tremble).
   * Methodes (bind:this) : focus(id, zoom, dur), reset(), travel(from, to), clearFog(id).
   */
  import { onMount } from 'svelte';
  import { gsap, prefersReducedMotion } from '@ce/core';
  import * as Q from './core/qart.js';

  type State = 'locked' | 'open' | 'current' | 'done';
  interface Props {
    states?: Record<string, State>;
    player?: string;
    initial?: string;
    /** region sur laquelle la camera est cadree au depart (null = carte entiere) */
    focusOn?: string | null;
    zoom?: number;
    /** pan (1 doigt) + pinch/molette (zoom) */
    interactive?: boolean;
    onselect?: (id: string) => void;
  }
  let { states = { madrid: 'current' }, player, initial = 'A', focusOn = null, zoom = 1.6, interactive = true, onselect }: Props = $props();
  let host: HTMLElement | undefined = $state();
  let pulse: gsap.core.Timeline | undefined;
  const svg = $derived(Q.worldMap({ states, player, initial }));

  onMount(() => {
    if (!host) return;
    if (focusOn) Q.mapCamSet(gsap, host, focusOn, zoom);
    if (!prefersReducedMotion()) {
      pulse = gsap.timeline({ repeat: -1 });
      Q.mapPulse(pulse, host, 0, 1, 1.6);
      Q.mapFogDrift(pulse, host, 0, 8);
      pulse.to({}, { duration: 8 }, 0);
    }
    return () => pulse?.kill();
  });

  // ───────── gestes : pan, pinch, molette. La camera = transform de .m-cam (svgOrigin 0 0) : p -> s*p + t.
  const MIN_S = 0.9, MAX_S = 3.4;
  const pts = new Map<number, { x: number; y: number }>();
  let dragged = false;
  let moved = 0;
  let pinch: { dist: number } | null = null;

  const camEl = () => host?.querySelector('.m-cam') as SVGGElement | null;
  const getCam = () => {
    const c = camEl();
    return { x: Number(gsap.getProperty(c, 'x')) || 0, y: Number(gsap.getProperty(c, 'y')) || 0, s: Number(gsap.getProperty(c, 'scaleX')) || 1 };
  };
  /** metrique ecran -> espace utilisateur du SVG */
  function metrics() {
    const svg = host?.querySelector('svg') as SVGSVGElement | null;
    const m = svg?.getScreenCTM();
    const r = host!.getBoundingClientRect();
    const k = m?.a || 1;
    return { k, left: r.left, top: r.top, vx0: -((m?.e ?? r.left) - r.left) / k, vy0: -((m?.f ?? r.top) - r.top) / k, vw: r.width / k, vh: r.height / k };
  }
  function clampAxis(t: number, s: number, size: number, v0: number, vlen: number) {
    const len = size * s;
    if (len >= vlen) return Math.min(v0, Math.max(v0 + vlen - len, t));
    return v0 + vlen / 2 - len / 2;
  }
  function setCam(x: number, y: number, s: number) {
    const m = metrics();
    s = Math.max(MIN_S, Math.min(MAX_S, s));
    gsap.set(camEl(), { x: clampAxis(x, s, 1600, m.vx0, m.vw), y: clampAxis(y, s, 1200, m.vy0, m.vh), scale: s, svgOrigin: '0 0' });
  }
  /** zoom autour d'un point ecran (px) */
  function zoomAt(px: number, py: number, factor: number) {
    const m = metrics();
    const c = getCam();
    const ux = (px - m.left) / m.k + m.vx0;
    const uy = (py - m.top) / m.k + m.vy0;
    const s2 = Math.max(MIN_S, Math.min(MAX_S, c.s * factor));
    setCam(ux - ((ux - c.x) / c.s) * s2, uy - ((uy - c.y) / c.s) * s2, s2);
  }
  function pdown(e: PointerEvent) {
    if (!interactive) return;
    gsap.killTweensOf(camEl());
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) { dragged = false; moved = 0; }
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
      dragged = true;
    }
  }
  function pmove(e: PointerEvent) {
    const p = pts.get(e.pointerId);
    if (!p || !interactive) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const prev = { ...p };
    p.x = e.clientX;
    p.y = e.clientY;
    if (pts.size === 1) {
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 14) dragged = true;
      if (!dragged) return;
      const m = metrics();
      const c = getCam();
      setCam(c.x + dx / m.k, c.y + dy / m.k, c.s);
    } else if (pts.size === 2 && pinch) {
      const [a, b] = [...pts.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const factor = dist / (pinch.dist || dist);
      pinch.dist = dist;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const m = metrics();
      const c = getCam();
      // translation du milieu + zoom autour du milieu
      setCam(c.x + ((dx + (prev.x === a.x ? 0 : 0)) / 2) / m.k, c.y + (dy / 2) / m.k, c.s);
      zoomAt(mx, my, factor);
    }
  }
  function pup(e: PointerEvent) {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
  }
  function wheel(e: WheelEvent) {
    if (!interactive) return;
    zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015));
  }

  function tap(e: MouseEvent) {
    if (dragged) { dragged = false; return; }
    const el = (e.target as Element).closest('[data-id]') as HTMLElement | null;
    if (!el) return;
    const id = el.dataset.id as string;
    if ((states[id] ?? 'locked') === 'locked') {
      const body = host?.querySelector(`.m-med-${id}`);
      if (body) gsap.fromTo(body, { x: 0 }, { x: 8, duration: 0.07, repeat: 5, yoyo: true, ease: 'power1.inOut', clearProps: 'x' });
      return;
    }
    onselect?.(id);
  }

  export function focus(id: string, z = zoom, dur = 1.4) {
    const tl = gsap.timeline();
    if (host) Q.mapCamTo(tl, host, id, z, 0, dur, 'power3.inOut');
    return tl;
  }
  export function reset(dur = 1.2) {
    const tl = gsap.timeline();
    if (host) tl.to(host.querySelector('.m-cam'), { x: 0, y: 0, scale: 1, svgOrigin: '0 0', duration: dur, ease: 'power3.inOut' });
    return tl;
  }
  export function travel(from: string, to: string, dur = 2.2) {
    const tl = gsap.timeline();
    if (host) Q.mapTravel(tl, host, from, to, 0, dur, gsap);
    return tl;
  }
  export function clearFog(id: string, dur = 1.6) {
    const tl = gsap.timeline();
    if (host) Q.mapFogClear(tl, host, id, 0, dur);
    return tl;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="wm" bind:this={host} onclick={tap} onpointerdown={pdown} onpointermove={pmove} onpointerup={pup} onpointercancel={pup} onwheel={wheel}>{@html svg}</div>

<style>
  .wm { width: 100%; height: 100%; display: grid; place-items: center; background: linear-gradient(135deg, #0a4a66, #0e6985 55%, #0b4b73); overflow: hidden; touch-action: none; }
  .wm :global(svg) { width: 100%; height: 100%; display: block; }
  .wm :global(.m-med) { cursor: pointer; }
</style>
