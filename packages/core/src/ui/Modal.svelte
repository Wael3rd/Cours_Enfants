<script lang="ts">
  import type { Snippet } from 'svelte';
  import { gsap } from '../motion';

  interface Props {
    open: boolean;
    title?: string;
    onclose?: () => void;
    children: Snippet;
  }
  let { open = $bindable(), title, onclose, children }: Props = $props();

  let card: HTMLElement | undefined = $state();

  $effect(() => {
    if (open && card) {
      gsap.fromTo(card, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'cePunch' });
    }
  });

  function close() {
    open = false;
    onclose?.();
  }
</script>

{#if open}
  <div class="scrim" role="presentation" onpointerdown={(e) => e.target === e.currentTarget && close()}>
    <div class="card" bind:this={card} role="dialog" aria-modal="true" aria-label={title}>
      {#if title}<h2>{title}</h2>{/if}
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .scrim { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; background: rgba(5, 12, 30, 0.7); }
  .card { max-width: min(92vw, 640px); max-height: 90vh; overflow: auto; padding: 28px; border-radius: 24px; background: #fff; color: #0b1b3a; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5); }
  h2 { margin: 0 0 16px; font-size: 1.8rem; }
</style>
