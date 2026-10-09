<script lang="ts">
  /** Barre haute des ecrans secondaires : retour, titre RPG, contenu a droite. */
  import type { Snippet } from 'svelte';
  import RoundBtn from './RoundBtn.svelte';

  interface Props { title: string; onback?: () => void; right?: Snippet; sub?: string; }
  let { title, onback, right, sub }: Props = $props();
</script>

<header class="tb">
  <RoundBtn icon="back" label="Volver" variant="papel" onclick={() => onback?.()} />
  <div class="tt"><h1 class="h-rpg">{title}</h1>{#if sub}<p>{sub}</p>{/if}</div>
  <div class="rt">{@render right?.()}</div>
</header>

<style>
  .tb { flex: none; display: flex; align-items: center; gap: 20px; padding: 14px 24px 8px; }
  .tt { flex: 1; min-width: 0; }
  h1 { font-size: 44px; line-height: 1.05; }
  p { margin: 4px 0 0; font: 800 22px/1.2 var(--q-font-body); color: var(--q-papel2); opacity: 0.9; }
  .rt { display: flex; align-items: center; gap: 14px; }
</style>
