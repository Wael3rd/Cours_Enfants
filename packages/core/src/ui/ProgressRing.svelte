<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** 0..1 */
    value: number;
    size?: number;
    stroke?: number;
    color?: string;
    track?: string;
    children?: Snippet;
  }
  let { value, size = 96, stroke = 10, color = '#ffd400', track = 'rgba(255,255,255,0.2)', children }: Props = $props();

  const r = $derived((size - stroke) / 2);
  const c = $derived(2 * Math.PI * r);
  const v = $derived(Math.max(0, Math.min(1, value)));
</script>

<div class="ring" style:width="{size}px" style:height="{size}px" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(v * 100)}>
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    <circle cx={size / 2} cy={size / 2} {r} fill="none" stroke={track} stroke-width={stroke} />
    <circle
      cx={size / 2}
      cy={size / 2}
      {r}
      fill="none"
      stroke={color}
      stroke-width={stroke}
      stroke-linecap="round"
      stroke-dasharray={c}
      stroke-dashoffset={c * (1 - v)}
      transform="rotate(-90 {size / 2} {size / 2})"
    />
  </svg>
  {#if children}<div class="inner">{@render children()}</div>{/if}
</div>

<style>
  .ring { position: relative; display: inline-block; }
  .inner { position: absolute; inset: 0; display: grid; place-items: center; }
</style>
