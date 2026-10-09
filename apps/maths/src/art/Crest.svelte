<script lang="ts">
  import { crest } from './core/ceart.js';
  let { primary = '#E8212F', secondary = '#FFFFFF', initials = 'FC', pattern = 'auto', star = true, width = 120 }:
    { primary?: string; secondary?: string; initials?: string; pattern?: 'auto' | 'stripes' | 'band' | 'chevron' | 'split' | 'plain'; star?: boolean; width?: number } = $props();
  const html = $derived(crest({ primary, secondary, initials, pattern, star }));
</script>

<div class="box" style:width="{width}px">{@html html}</div>

<style>
  .box { display: inline-block; line-height: 0; }
  .box :global(svg) { width: 100%; height: auto; }
</style>
