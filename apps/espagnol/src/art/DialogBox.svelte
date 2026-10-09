<script lang="ts">
  /**
   * Boite de dialogue RPG : portrait (Fluent 3D ou SVG), plaque de nom, texte machine a ecrire (tap = tout afficher),
   * boutons audio / lento (tortue) / pista (ampoule). Tous les boutons >= 72 px.
   */
  import { gsap, prefersReducedMotion } from '@ce/core';
  import Panel from './Panel.svelte';

  interface Props {
    name: string;
    text: string;
    /** URL d'image (portrait Fluent 3D) */
    portrait?: string;
    /** ou SVG inline (ex. quetzal({view})) */
    portraitSvg?: string;
    accent?: string;
    cps?: number;
    showButtons?: boolean;
    onaudio?: () => void;
    onslow?: () => void;
    onhint?: () => void;
    ondone?: () => void;
  }
  let { name, text, portrait, portraitSvg, accent = '#ffc83d', cps = 34, showButtons = true, onaudio, onslow, onhint, ondone }: Props = $props();

  let n = $state(0);
  let done = $derived(n >= text.length);
  let portraitEl: HTMLElement | undefined = $state();
  const prog = { v: 0 };
  let tween: gsap.core.Tween | undefined;

  $effect(() => {
    const len = text.length;
    tween?.kill();
    prog.v = 0;
    n = 0;
    if (prefersReducedMotion()) { n = len; ondone?.(); return; }
    tween = gsap.to(prog, {
      v: len, duration: len / cps, ease: 'none', delay: 0.15,
      onUpdate: () => { n = Math.floor(prog.v); },
      onComplete: () => { n = len; ondone?.(); },
    });
    if (portraitEl) gsap.fromTo(portraitEl, { y: 24, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.8)' });
    return () => tween?.kill();
  });

  export function skip() {
    if (done) return;
    tween?.kill();
    n = text.length;
    ondone?.();
  }
</script>

<div class="dlg" style:--accent={accent}>
  <div class="portrait" bind:this={portraitEl}>
    <div class="halo"></div>
    {#if portraitSvg}{@html portraitSvg}{:else if portrait}<img src={portrait} alt="" draggable="false" />{/if}
  </div>
  <div class="plate"><span>{name}</span></div>
  <Panel padding="30px 36px 28px 220px">
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="txt" onclick={skip}>
      <p><span class="seen">{text.slice(0, n)}</span><span class="rest">{text.slice(n)}</span></p>
      {#if done}<i class="caret" aria-hidden="true"></i>{/if}
    </div>
    {#if showButtons}
      <div class="tools">
        <button class="tool" aria-label="Escuchar" onclick={() => onaudio?.()}>
          <svg viewBox="0 0 48 48" width="40" height="40"><path d="M8 18h8l11-9v30l-11-9H8Z" fill="currentColor"/><path d="M33 16q8 8 0 16M38 10q13 14 0 28" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
        </button>
        <button class="tool" aria-label="Más despacio" onclick={() => onslow?.()}>
          <svg viewBox="0 0 48 48" width="42" height="42"><ellipse cx="22" cy="26" rx="14" ry="11" fill="currentColor"/><path d="M12 28q10 -14 22 0" fill="none" stroke="#14173f" stroke-width="2.5" opacity=".5"/><circle cx="40" cy="25" r="5" fill="currentColor"/><path d="M12 36l-3 6M30 36l3 6M18 37v6M26 37v6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="41.5" cy="23.5" r="1.4" fill="#14173f"/></svg>
        </button>
        <button class="tool hint" aria-label="Pista" onclick={() => onhint?.()}>
          <svg viewBox="0 0 48 48" width="40" height="40"><path d="M24 5a13 13 0 0 0-7 24v5h14v-5A13 13 0 0 0 24 5Z" fill="currentColor"/><path d="M18 39h12M20 43h8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M20 22l4 5 4-5" fill="none" stroke="#14173f" stroke-width="2.5" stroke-linecap="round" opacity=".5"/></svg>
        </button>
      </div>
    {/if}
  </Panel>
</div>

<style>
  .dlg { position: relative; width: 100%; max-width: 1280px; margin: 0 auto; padding-top: 70px; }
  .portrait { position: absolute; left: 30px; bottom: 14px; width: 190px; height: 250px; z-index: 3; display: flex; align-items: flex-end; justify-content: center; pointer-events: none; }
  .portrait img, .portrait :global(svg) { position: relative; width: 100%; height: auto; max-height: 100%; object-fit: contain; filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.3)); }
  .halo { position: absolute; inset: auto 0 6px 0; height: 150px; border-radius: 50%; background: radial-gradient(closest-side, var(--accent), transparent); opacity: 0.45; }
  .plate { position: absolute; left: 232px; top: 36px; z-index: 4; transform: rotate(-1.5deg); }
  .plate span { display: inline-block; padding: 8px 30px 10px; font: 400 30px/1 var(--q-font-title); color: var(--q-nuit); background: linear-gradient(180deg, #ffe08a, var(--accent)); border-radius: 14px; box-shadow: 0 4px 0 #6b3d08, inset 0 0 0 3px rgba(255, 255, 255, 0.4); }
  .txt { position: relative; min-height: 132px; cursor: pointer; padding-right: 250px; }
  p { margin: 0; font: 800 34px/1.38 var(--q-font-body); color: var(--q-papel); }
  .rest { opacity: 0; }
  .caret { position: absolute; right: 270px; bottom: 0; width: 0; height: 0; border: 14px solid transparent; border-top: 20px solid var(--q-sol); border-bottom: 0; animation: bob 0.8s ease-in-out infinite; }
  @keyframes bob { 50% { transform: translateY(8px); } }
  .tools { position: absolute; right: 26px; top: 50%; transform: translateY(-50%); display: flex; gap: 12px; }
  .tool { width: 76px; height: 76px; border-radius: 50%; border: 0; display: grid; place-items: center; color: var(--q-nuit); cursor: pointer; background: linear-gradient(180deg, #ffe08a, var(--q-sol)); box-shadow: 0 5px 0 #6b3d08, inset 0 0 0 3px rgba(255, 255, 255, 0.45); touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: transform 0.06s; }
  .tool:active { transform: translateY(4px); box-shadow: 0 1px 0 #6b3d08, inset 0 0 0 3px rgba(255, 255, 255, 0.45); }
  .tool.hint { background: linear-gradient(180deg, #7ff3e4, var(--q-turquesa)); box-shadow: 0 5px 0 #07474f, inset 0 0 0 3px rgba(255, 255, 255, 0.45); }
  .tool:focus-visible { outline: 4px solid #fff; outline-offset: 3px; }
</style>
