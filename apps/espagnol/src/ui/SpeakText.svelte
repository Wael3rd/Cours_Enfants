<script lang="ts">
  /** Texte espagnol touchable : un toucher = la voix (variante lente si le mode tortue est actif). */
  import { haptic } from '@ce/core';
  import { say, ui } from './ui.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    text: string;
    audio?: string;
    /** fragments a surligner dans le texte */
    mark?: string[];
    icon?: boolean;
    class?: string;
    /** force la variante lente (ex. bouton tortue dedie) */
    lento?: boolean;
    onplay?: () => void;
  }
  let { text, audio, mark = [], icon = true, class: klass = '', lento, onplay }: Props = $props();

  const parts = $derived.by(() => {
    if (!mark.length) return [{ t: text, m: false }];
    const re = new RegExp(`(${mark.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    return text.split(re).filter(Boolean).map((t) => ({ t, m: mark.some((x) => x.toLowerCase() === t.toLowerCase()) }));
  });
  const on = $derived(!!audio && ui.speaking === audio);

  function tap() {
    haptic('tap');
    say(audio, text, { lento });
    onplay?.();
  }
</script>

<button type="button" class="sp {klass}" class:on onclick={tap} aria-label={`Escuchar: ${text}`}>
  <span class="t">{#each parts as p}{#if p.m}<mark>{p.t}</mark>{:else}{p.t}{/if}{/each}</span>{#if icon}<Icon name="sound" size={Math.round(24)} class="ic" />{/if}
</button>

<style>
  .sp { all: unset; box-sizing: border-box; cursor: pointer; display: inline; color: inherit; font: inherit; line-height: inherit; -webkit-tap-highlight-color: transparent; touch-action: manipulation; border-radius: 10px; padding: 2px 4px; margin: -2px -4px; text-decoration: underline dotted rgba(255, 200, 61, 0.7); text-underline-offset: 6px; text-decoration-thickness: 2px; transition: background 0.15s; }
  .sp:active { background: rgba(255, 200, 61, 0.28); }
  .sp:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
  .sp.on { background: rgba(255, 200, 61, 0.25); }
  .sp :global(.ic) { display: inline-block; vertical-align: -0.12em; margin-left: 0.35em; opacity: 0.6; width: 0.72em; height: 0.72em; }
  mark { background: var(--q-sol); color: var(--q-nuit); border-radius: 8px; padding: 0 6px; }
</style>
