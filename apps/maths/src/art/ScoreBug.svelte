<script lang="ts">
  import { scoreBug } from './core/ceart.js';
  type T = { name: string; primary: string; secondary: string; initials: string };
  let { home, away, scoreHome = 0, scoreAway = 0, clock = '', width = 640 }: { home?: T; away?: T; scoreHome?: number; scoreAway?: number; clock?: string; width?: number } = $props();
  const html = $derived(scoreBug({ home, away, scoreHome, scoreAway, clock }));
</script>

<div class="box" style:width="{width}px">{@html html}</div>

<style>
  .box { display: inline-block; line-height: 0; }
  .box :global(svg) { width: 100%; height: auto; }
</style>
