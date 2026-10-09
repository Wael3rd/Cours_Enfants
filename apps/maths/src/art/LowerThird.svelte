<script lang="ts">
  import { lowerThird } from './core/ceart.js';
  let { title = '', subtitle = '', primary = '#1B6BFF', accent = '#FFD23F', badge, width = 640 }: { title?: string; subtitle?: string; primary?: string; accent?: string; badge?: string | number; width?: number } = $props();
  const html = $derived(lowerThird({ title, subtitle, primary, accent, badge }));
</script>

<div class="box" style:width="{width}px">{@html html}</div>

<style>
  .box { display: inline-block; line-height: 0; }
  .box :global(svg) { width: 100%; height: auto; }
</style>
