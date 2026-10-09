<script lang="ts">
  /** Carte-objet de vocabulaire : image Fluent 3D, mot, article colore (el/los = bleu, la/las = rouge), bordure de rarete qui brille. */
  interface Props {
    word: string;
    article?: 'el' | 'la' | 'los' | 'las' | 'un' | 'una' | '';
    img?: string;
    rarity?: 'comun' | 'raro' | 'epico' | 'legendario';
    locked?: boolean;
    size?: number; // largeur px
    ontap?: () => void;
  }
  let { word, article = '', img, rarity = 'comun', locked = false, size = 220, ontap }: Props = $props();
  const masc = $derived(article === 'el' || article === 'los' || article === 'un');
  const RC: Record<string, string> = { comun: '#9aa3c7', raro: '#35b8ff', epico: '#c65bff', legendario: '#ffc83d' };
</script>

<button class="card {rarity}" class:locked style:width="{size}px" style:--rc={RC[rarity]} onclick={() => ontap?.()} aria-label={`${article} ${word}`}>
  <span class="frame">
    <span class="art">
      {#if img && !locked}<img src={img} alt="" draggable="false" />{:else}<b class="q">?</b>{/if}
      {#if rarity !== 'comun' && !locked}<i class="sheen"></i>{/if}
    </span>
    <span class="name">
      {#if article && !locked}<em class:masc class:fem={!masc}>{article}</em>{/if}
      <strong>{locked ? '???' : word}</strong>
    </span>
  </span>
</button>

<style>
  .card { padding: 0; border: 0; background: none; cursor: pointer; text-align: center; font-family: var(--q-font-body); touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: transform 0.12s; }
  .card:active { transform: scale(0.96); }
  .card:focus-visible { outline: 4px solid #fff; outline-offset: 4px; border-radius: 24px; }
  .frame { display: block; position: relative; padding: 8px; border-radius: 24px; background: linear-gradient(160deg, color-mix(in srgb, var(--rc) 70%, #fff), var(--rc) 45%, color-mix(in srgb, var(--rc) 55%, #000)); box-shadow: 0 6px 0 color-mix(in srgb, var(--rc) 40%, #000), 0 14px 22px rgba(5, 6, 30, 0.4); }
  .raro .frame { box-shadow: 0 6px 0 color-mix(in srgb, var(--rc) 40%, #000), 0 0 22px color-mix(in srgb, var(--rc) 70%, transparent), 0 14px 22px rgba(5, 6, 30, 0.4); }
  .epico .frame { box-shadow: 0 6px 0 color-mix(in srgb, var(--rc) 40%, #000), 0 0 30px color-mix(in srgb, var(--rc) 80%, transparent), 0 14px 22px rgba(5, 6, 30, 0.4); }
  .legendario .frame { box-shadow: 0 6px 0 #7a4a06, 0 0 38px rgba(255, 200, 61, 0.85), 0 14px 22px rgba(5, 6, 30, 0.4); }
  .art { position: relative; display: grid; place-items: center; aspect-ratio: 1 / 0.92; overflow: hidden; border-radius: 17px 17px 6px 6px; background: radial-gradient(circle at 50% 38%, #3a41a8, var(--q-nuit) 78%); box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12); }
  .art img { width: 70%; height: 70%; object-fit: contain; filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45)); }
  .q { font: 400 80px/1 var(--q-font-title); color: #4b52b5; }
  .sheen { position: absolute; top: -20%; left: -60%; width: 40%; height: 140%; background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.55), transparent); transform: translateX(0) skewX(-18deg); animation: sheen 3.6s ease-in-out infinite; }
  @keyframes sheen { 0%, 55% { transform: translateX(0) skewX(-18deg); } 100% { transform: translateX(520%) skewX(-18deg); } }
  .name { display: flex; align-items: baseline; justify-content: center; gap: 10px; padding: 9px 8px 10px; margin-top: 3px; border-radius: 6px 6px 16px 16px; background: var(--q-papel); color: var(--q-nuit); }
  .name strong { font: 900 30px/1.1 var(--q-font-body); }
  em { font: 800 24px/1 var(--q-font-body); font-style: normal; padding: 2px 10px 4px; border-radius: 999px; color: #fff; }
  .masc { background: var(--q-el); }
  .fem { background: var(--q-la); }
  .locked .art { filter: saturate(0); }
  @media (prefers-reduced-motion: reduce) { .sheen { animation: none; opacity: 0; } }
</style>
