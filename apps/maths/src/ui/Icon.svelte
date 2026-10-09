<script lang="ts">
  /** Petites icones SVG pleines (aucun texte requis pour comprendre un bouton). */
  type Name = 'ball' | 'sprint' | 'goal' | 'train' | 'album' | 'trophy' | 'shirt' | 'star' | 'flame' | 'sound' | 'mute' | 'music' | 'musicoff' | 'gear' | 'lock' | 'check' | 'home' | 'again' | 'play';
  let { name, size = 40 }: { name: Name; size?: number } = $props();
</script>

<svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" class="ic">
  {#if name === 'ball'}
    <circle cx="24" cy="24" r="20" fill="#fff" stroke="#0A1030" stroke-width="3.5" /><path d="M24 12 l9 6.5 -3.5 10.5 h-11 l-3.5 -10.5z" fill="#0A1030" /><path d="M24 12 V4 M33 18.5 l8 -3 M29.5 29 l5 7 M18.5 29 l-5 7 M15 18.5 l-8 -3" stroke="#0A1030" stroke-width="3" stroke-linecap="round" />
  {:else if name === 'sprint'}
    <circle cx="30" cy="9" r="5.5" fill="currentColor" /><path d="M26 17 l-8 6 -2 9 M26 17 l8 7 8 -2 M26 17 l-2 11 10 6 2 10 M24 28 l-9 4 -8 8" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  {:else if name === 'goal'}
    <path d="M5 40 V12 H43 V40" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" /><path d="M13 12 V38 M22 12 V38 M31 12 V38 M5 22 H43 M5 31 H43" stroke="currentColor" stroke-width="2.4" opacity=".6" /><circle cx="33" cy="30" r="6" fill="#fff" stroke="#0A1030" stroke-width="2.5" />
  {:else if name === 'train'}
    <path d="M24 5 L36 38 H12Z" fill="currentColor" /><rect x="7" y="38" width="34" height="6" rx="3" fill="currentColor" /><path d="M18 24 H30 M15 31 H33" stroke="#fff" stroke-width="4" /><circle cx="24" cy="5" r="0" />
  {:else if name === 'album'}
    <rect x="7" y="9" width="24" height="32" rx="4" fill="currentColor" transform="rotate(-9 19 25)" opacity=".55" /><rect x="15" y="6" width="24" height="34" rx="4" fill="currentColor" /><path d="M27 13 l3 6 6.5 .8 -4.8 4.4 1.3 6.4 -6 -3.3 -6 3.3 1.3 -6.4 -4.8 -4.4 6.5 -.8z" fill="#FFD23F" />
  {:else if name === 'trophy'}
    <path d="M13 6 H35 V19 C35 28 30 33 24 33 C18 33 13 28 13 19Z" fill="currentColor" /><path d="M13 10 H6 C6 20 9 24 14 25 M35 10 H42 C42 20 39 24 34 25" fill="none" stroke="currentColor" stroke-width="4" /><rect x="21" y="33" width="6" height="7" fill="currentColor" /><rect x="14" y="40" width="20" height="5" rx="2" fill="currentColor" />
  {:else if name === 'shirt'}
    <path d="M17 5 C19 9 29 9 31 5 L43 11 L38 21 L33 19 V43 H15 V19 L10 21 L5 11Z" fill="currentColor" />
  {:else if name === 'star'}
    <path d="M24 3 l6.2 13.4 14.6 1.7 -10.9 9.9 3 14.4 -12.9 -7.3 -12.9 7.3 3 -14.4 -10.9 -9.9 14.6 -1.7z" fill="#FFD23F" stroke="#7A5200" stroke-width="3" stroke-linejoin="round" />
  {:else if name === 'flame'}
    <path d="M24 3 C27 14 40 19 40 31 A16 16 0 0 1 8 31 C8 22 14 20 15 12 C19 15 21 18 21 22 C26 16 26 9 24 3Z" fill="#FF8A1F" stroke="#7A2E00" stroke-width="3" stroke-linejoin="round" />
  {:else if name === 'sound'}
    <path d="M6 18 H14 L25 9 V39 L14 30 H6Z" fill="currentColor" /><path d="M31 16 C36 21 36 27 31 32 M36 11 C45 19 45 29 36 37" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
  {:else if name === 'mute'}
    <path d="M6 18 H14 L25 9 V39 L14 30 H6Z" fill="currentColor" /><path d="M32 17 L44 31 M44 17 L32 31" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
  {:else if name === 'music'}
    <path d="M19 36 V10 L40 5 V31" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round" /><ellipse cx="13" cy="37" rx="7" ry="5.5" fill="currentColor" /><ellipse cx="34" cy="32" rx="7" ry="5.5" fill="currentColor" />
  {:else if name === 'musicoff'}
    <path d="M19 36 V10 L40 5 V31" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round" opacity=".5" /><ellipse cx="13" cy="37" rx="7" ry="5.5" fill="currentColor" opacity=".5" /><ellipse cx="34" cy="32" rx="7" ry="5.5" fill="currentColor" opacity=".5" /><path d="M6 42 L42 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
  {:else if name === 'gear'}
    <path d="M24 15 a9 9 0 1 0 0.01 0z M20 4 h8 l1.4 5 3.6 1.5 4.6 -2.6 5.6 5.6 -2.6 4.6 1.5 3.6 5 1.4 v8 l-5 1.4 -1.5 3.6 2.6 4.6 -5.6 5.6 -4.6 -2.6 -3.6 1.5 -1.4 5 h-8 l-1.4 -5 -3.6 -1.5 -4.6 2.6 -5.6 -5.6 2.6 -4.6 -1.5 -3.6 -5 -1.4 v-8 l5 -1.4 1.5 -3.6 -2.6 -4.6 5.6 -5.6 4.6 2.6 3.6 -1.5z" fill="currentColor" fill-rule="evenodd" />
  {:else if name === 'lock'}
    <rect x="9" y="21" width="30" height="22" rx="5" fill="currentColor" /><path d="M15 21 V15 a9 9 0 0 1 18 0 V21" fill="none" stroke="currentColor" stroke-width="5" />
  {:else if name === 'check'}
    <path d="M8 25 l11 11 21 -24" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
  {:else if name === 'home'}
    <path d="M5 24 L24 6 L43 24 H37 V41 H28 V30 H20 V41 H11 V24Z" fill="currentColor" />
  {:else if name === 'again'}
    <path d="M38 24 a14 14 0 1 1 -5 -10.6" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" /><path d="M40 6 V18 H28Z" fill="currentColor" />
  {:else if name === 'play'}
    <path d="M13 6 L41 24 L13 42Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
  {/if}
</svg>

<style>
  .ic { display: block; flex: none; }
</style>
