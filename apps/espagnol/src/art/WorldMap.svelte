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
    onselect?: (id: string) => void;
  }
  let { states = { madrid: 'current' }, player, initial = 'A', focusOn = null, zoom = 1.6, onselect }: Props = $props();
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

  function tap(e: MouseEvent) {
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
<div class="wm" bind:this={host} onclick={tap}>{@html svg}</div>

<style>
  .wm { width: 100%; height: 100%; display: grid; place-items: center; background: linear-gradient(135deg, #0a4a66, #0e6985 55%, #0b4b73); overflow: hidden; touch-action: manipulation; }
  .wm :global(svg) { width: 100%; height: 100%; display: block; }
  .wm :global(.m-med) { cursor: pointer; }
</style>
