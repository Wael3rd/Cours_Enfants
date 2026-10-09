<script lang="ts">
  /** Carte-objet d'un mot de vocabulaire (ItemCard du kit + image Fluent 3D / drapeau / nombre). */
  import type { Vocab } from '../content/schema';
  import { rarityOf } from '../engine/rpg';
  import ItemCard from '../art/ItemCard.svelte';
  import Emoji from './Emoji.svelte';
  import { articleOf, RARITY_UI } from '../steps/common';
  import { emojiUrl } from './emoji';

  interface Props { v: Vocab; size?: number; locked?: boolean; ontap?: () => void; showArticle?: boolean; }
  let { v, size = 220, locked = false, ontap, showArticle = true }: Props = $props();
  const rarity = $derived(RARITY_UI[rarityOf(v)]);
  const num = $derived(/nombre\s+(\d+)/i.exec(v.ilustracion ?? '')?.[1]);
  const hasImg = $derived(!!emojiUrl(v.emoji) || ['🇪🇸', '🇲🇽', '🇦🇷', '🇫🇷', '🇬🇧'].includes(v.emoji ?? ''));
</script>

<ItemCard word={v.es} article={showArticle ? articleOf(v) : ''} {rarity} {locked} {size} {ontap}>
  {#snippet art()}
    {#if hasImg && v.emoji}
      <Emoji e={v.emoji} size={Math.round(size * 0.58)} />
    {:else if num}
      <b class="num" style:font-size="{Math.round(size * 0.42)}px">{num}</b>
    {:else if v.emoji}
      <Emoji e={v.emoji} size={Math.round(size * 0.58)} />
    {:else}
      <b class="num" style:font-size="{Math.round(size * 0.4)}px">{v.es.charAt(0).toUpperCase()}</b>
    {/if}
  {/snippet}
</ItemCard>

<style>
  .num { font-family: var(--q-font-title); font-weight: 400; line-height: 1; color: var(--q-sol); text-shadow: 0 5px 0 #8a4a05, 0 10px 12px rgba(0, 0, 0, 0.4); }
</style>
