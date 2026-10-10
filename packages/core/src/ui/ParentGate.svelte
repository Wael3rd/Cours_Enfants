<script lang="ts">
  // Bouton d'acces parent : un simple toucher. (L'appui long etait annule par Android : pointercancel.)
  // La vraie barriere est la question de grand posee ensuite par l'app (ex. maths : ParentEntry).
  import type { Snippet } from 'svelte';
  import { haptic } from '../haptics';

  interface Props {
    onpass: () => void;
    /** Conserve pour compatibilite, ignore. */
    holdMs?: number;
    children?: Snippet;
    label?: string;
  }
  let { onpass, children, label = 'Espace parent' }: Props = $props();

  function open() {
    haptic('press');
    onpass();
  }
</script>

<button type="button" class="gate" aria-label={label} title={label} onclick={open}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">&#9881;</span>{/if}
</button>

<style>
  .gate {
    min-width: 72px; min-height: 72px; padding: 0; border: 0; border-radius: 50%;
    background: transparent; color: #fff; font-size: 1.8rem; cursor: pointer;
    display: grid; place-items: center; touch-action: manipulation;
  }
</style>
