<script lang="ts">
  /** Emoji Fluent 3D (WebP local). Drapeaux : SVG maison. Sinon : le caractere natif. */
  import { flagSvg } from '../art/core/qart.js';
  import { emojiUrl } from './emoji';

  interface Props { e?: string; size?: number; class?: string; }
  let { e = '', size = 64, class: klass = '' }: Props = $props();
  const url = $derived(emojiUrl(e));
  const FR = `<svg viewBox="0 0 100 66" width="100%" aria-hidden="true"><defs><clipPath id="frc"><rect width="100" height="66" rx="6"/></clipPath></defs><g clip-path="url(#frc)"><rect width="34" height="66" fill="#0055A4"/><rect x="33" width="34" height="66" fill="#fff"/><rect x="66" width="34" height="66" fill="#EF4135"/></g><rect width="100" height="66" rx="6" fill="none" stroke="#14173F" stroke-opacity=".5" stroke-width="2"/></svg>`;
  const GB = `<svg viewBox="0 0 100 66" width="100%" aria-hidden="true"><defs><clipPath id="gbc"><rect width="100" height="66" rx="6"/></clipPath></defs><g clip-path="url(#gbc)"><rect width="100" height="66" fill="#012169"/><path d="M0 0L100 66M100 0L0 66" stroke="#fff" stroke-width="12"/><path d="M0 0L100 66M100 0L0 66" stroke="#C8102E" stroke-width="5"/><path d="M50 0V66M0 33H100" stroke="#fff" stroke-width="20"/><path d="M50 0V66M0 33H100" stroke="#C8102E" stroke-width="11"/></g><rect width="100" height="66" rx="6" fill="none" stroke="#14173F" stroke-opacity=".5" stroke-width="2"/></svg>`;
  const flag = $derived(
    e === '🇪🇸' ? flagSvg('es', { width: 100 }) : e === '🇲🇽' ? flagSvg('mx', { width: 100 }) : e === '🇦🇷' ? flagSvg('ar', { width: 100 }) : e === '🇫🇷' ? FR : e === '🇬🇧' ? GB : '',
  );
</script>

{#if flag}
  <span class="em flag {klass}" style:width="{size}px" style:height="{size * 0.66}px" aria-hidden="true">{@html flag}</span>
{:else if url}
  <img class="em {klass}" src={url} alt="" width={size} height={size} draggable="false" decoding="async" />
{:else}
  <span class="em txt {klass}" style:font-size="{size * 0.8}px" style:width="{size}px" style:height="{size}px" aria-hidden="true">{e}</span>
{/if}

<style>
  .em { display: inline-block; flex: none; object-fit: contain; }
  .flag :global(svg) { display: block; width: 100%; height: auto; }
  .txt { display: inline-grid; place-items: center; line-height: 1; }
</style>
