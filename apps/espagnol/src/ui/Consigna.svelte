<script lang="ts">
  /** Consigne d'exercice : plaque en haut de l'etape, texte espagnol touchable (voix narrador). */
  import type { Snippet } from 'svelte';
  import type { Consigna } from '../content/schema';
  import SpeakText from './SpeakText.svelte';

  interface Props { c: Consigna; children?: Snippet; }
  let { c, children }: Props = $props();
</script>

<div class="cons">
  <span class="rune" aria-hidden="true">✦</span>
  <p><SpeakText text={c.es} audio={c.audio} /></p>
  {@render children?.()}
</div>

<style>
  .cons { display: flex; align-items: center; gap: 16px; padding: 14px 26px; border-radius: 22px; background: rgba(11, 13, 42, 0.6); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.55); }
  .rune { font-size: 30px; color: var(--q-sol); }
  p { margin: 0; flex: 1; font: 900 34px/1.2 var(--q-font-body); color: var(--q-papel); }
</style>
