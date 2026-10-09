<script lang="ts">
  /** Carte-objet d'un mot de vocabulaire (ItemCard du kit + image Fluent 3D / drapeau / nombre). */
  import type { Vocab } from '../content/schema';
  import { rarityOf } from '../engine/rpg';
  import ItemCard from '../art/ItemCard.svelte';
  import Emoji from './Emoji.svelte';
  import { articleOf, RARITY_UI } from '../steps/common';
  import { emojiUrl } from './emoji';
  import { content } from '../engine/data';
  import { regionOf } from './regions';
  import { azulejoDataUri } from '../art/core/qart.js';

  interface Props { v: Vocab; size?: number; locked?: boolean; ontap?: () => void; showArticle?: boolean; }
  let { v, size = 220, locked = false, ontap, showArticle = true }: Props = $props();
  const rarity = $derived(RARITY_UI[rarityOf(v)]);
  const num = $derived(/nombre\s+(\d+)/i.exec(v.ilustracion ?? '')?.[1]);
  const hasImg = $derived(!!emojiUrl(v.emoji) || ['🇪🇸', '🇲🇽', '🇦🇷', '🇫🇷', '🇬🇧'].includes(v.emoji ?? ''));

  // Carte typographique (mot sans image) : motif de la region (azulejos en Espagne, papel picado au Mexique, losanges andins ailleurs)
  const region = $derived.by(() => {
    const u = content.unitById.get(content.vocab.get(v.id)?.unitId ?? '');
    return (u && regionOf(u)) || 'madrid';
  });
  const MEX = new Set(['cdmx', 'oaxaca', 'yucatan']);
  const SPAIN = new Set(['madrid', 'salamanca', 'sevilla', 'valencia']);
  const motif = $derived.by(() => {
    if (SPAIN.has(region)) return { kind: 'azulejo', url: azulejoDataUri({ a: '#1b2070', b: '#2e3aa8', c: '#ffc83d', d: '#9bd8ff' }, 64) };
    if (MEX.has(region)) {
      const cols = ['#ff4f8b', '#ffc83d', '#19b7aa', '#ff7a45'];
      const flags = cols.map((c, i) => `<path d="M${i * 25 + 2} 6H${i * 25 + 23}V40L${i * 25 + 12.5} 32L${i * 25 + 2} 40Z" fill="${c}"/><circle cx="${i * 25 + 12.5}" cy="16" r="4" fill="#1b0d3a"/><path d="M${i * 25 + 6} 24h13" stroke="#1b0d3a" stroke-width="2" stroke-dasharray="2 3"/>`).join('');
      return { kind: 'picado', url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60"><rect width="100" height="60" fill="#2a1250"/><path d="M0 4H100" stroke="#ffc83d" stroke-width="2"/>${flags}</svg>`)}` };
    }
    return { kind: 'andino', url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="#17306a"/><path d="M24 4L44 24L24 44L4 24Z" fill="none" stroke="#35b8ff" stroke-width="3"/><path d="M24 14L34 24L24 34L14 24Z" fill="#ffc83d"/></svg>')}` };
  });
  const words = $derived(v.es.split(' '));
  const longest = $derived(Math.max(...words.map((w) => w.length), 1));
  const fs = $derived(Math.max(22, Math.min(size * 0.3, (size * 0.8) / (longest * 0.62))));
  const artic = $derived(articleOf(v));
</script>

<ItemCard word={v.es} article={showArticle ? articleOf(v) : ''} {rarity} {locked} {size} {ontap}>
  {#snippet art()}
    {#if hasImg && v.emoji}
      <Emoji e={v.emoji} size={Math.round(size * 0.58)} />
    {:else if num}
      <b class="num" style:font-size="{Math.round(size * 0.42)}px">{num}</b>
    {:else}
      <span class="typo {motif.kind}" style:background-image="url({motif.url})" style:background-size={motif.kind === 'azulejo' ? `${Math.round(size * 0.2)}px` : motif.kind === 'picado' ? `${Math.round(size * 0.4)}px auto` : `${Math.round(size * 0.16)}px`}>
        <span class="plate">
          {#if artic && showArticle}<em class="ar" class:masc={artic === 'el'} class:fem={artic === 'la'} style:font-size="{Math.round(size * 0.12)}px">{artic}</em>{/if}
          <b class="w" style:font-size="{Math.round(fs)}px">{#each words as w}<span>{w}</span>{/each}</b>
        </span>
      </span>
    {/if}
  {/snippet}
</ItemCard>

<style>
  .typo { position: absolute; inset: 0; display: grid; place-items: center; }
  .typo::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, rgba(11, 13, 42, 0.15), rgba(11, 13, 42, 0.55) 90%); }
  .plate { position: relative; z-index: 1; display: grid; justify-items: center; gap: 6px; padding: 10px 14px 12px; max-width: 92%; border-radius: 18px; background: rgba(20, 23, 63, 0.82); box-shadow: 0 0 0 3px rgba(255, 200, 61, 0.7), 0 6px 14px rgba(0, 0, 0, 0.4); }
  .w { display: grid; justify-items: center; font: 900 1em/1.05 var(--q-font-title); font-weight: 400; color: var(--q-papel); text-shadow: 0 4px 0 rgba(0, 0, 0, 0.45); text-align: center; }
  .ar { font-family: var(--q-font-body); font-weight: 900; font-style: normal; padding: 1px 14px 3px; border-radius: 999px; color: #fff; }
  .ar.masc { background: var(--q-el); }
  .ar.fem { background: var(--q-la); }
  .num { font-family: var(--q-font-title); font-weight: 400; line-height: 1; color: var(--q-sol); text-shadow: 0 5px 0 #8a4a05, 0 10px 12px rgba(0, 0, 0, 0.4); }
</style>
