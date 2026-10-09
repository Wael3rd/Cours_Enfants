<script lang="ts">
  import { goal } from './core/ceart.js';
  let { width = 420 }: { width?: number } = $props();
  const html = goal({});
</script>

<div class="box" style:width="{width}px">{@html html}</div>

<style>
  .box { display: inline-block; line-height: 0; }
  .box :global(svg) { width: 100%; height: auto; }
</style>
