<script lang="ts">
  /** Icones SVG maison (48x48, currentColor). */
  type Name = 'speaker' | 'turtle' | 'bulb' | 'mic' | 'back' | 'check' | 'cross' | 'lock' | 'star' | 'feather' | 'book' | 'gear' | 'user' | 'map' | 'music' | 'musicoff' | 'play' | 'download' | 'heart' | 'sword' | 'scroll' | 'home' | 'bolt' | 'sound';
  interface Props { name: Name; size?: number; class?: string; }
  let { name, size = 40, class: klass = '' }: Props = $props();
</script>

<svg class={klass} viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  {#if name === 'speaker'}
    <path d="M8 18h8l11-9v30l-11-9H8Z" fill="currentColor" stroke-width="2" /><path d="M33 16q8 8 0 16M38 10q13 14 0 28" />
  {:else if name === 'sound'}
    <path d="M8 18h8l11-9v30l-11-9H8Z" fill="currentColor" stroke-width="2" /><path d="M33 16q8 8 0 16" />
  {:else if name === 'turtle'}
    <ellipse cx="22" cy="26" rx="14" ry="11" fill="currentColor" stroke="none" /><circle cx="40" cy="25" r="5" fill="currentColor" stroke="none" /><path d="M12 36l-3 6M30 36l3 6M18 37v6M26 37v6" /><path d="M12 28q10-14 22 0" stroke="#14173f" stroke-width="2.5" opacity=".5" /><circle cx="41.5" cy="23.5" r="1.4" fill="#14173f" stroke="none" />
  {:else if name === 'bulb'}
    <path d="M24 5a13 13 0 0 0-7 24v5h14v-5A13 13 0 0 0 24 5Z" fill="currentColor" stroke="none" /><path d="M18 39h12M20 43h8" />
  {:else if name === 'mic'}
    <rect x="17" y="4" width="14" height="26" rx="7" fill="currentColor" stroke="none" /><path d="M10 22q0 14 14 14t14-14M24 36v8M16 44h16" />
  {:else if name === 'back'}
    <path d="M30 8L14 24l16 16" stroke-width="6" />
  {:else if name === 'check'}
    <path d="M9 25l10 10 20-22" stroke-width="7" />
  {:else if name === 'cross'}
    <path d="M12 12l24 24M36 12L12 36" stroke-width="7" />
  {:else if name === 'lock'}
    <rect x="9" y="20" width="30" height="22" rx="6" fill="currentColor" stroke="none" /><path d="M15 20v-6a9 9 0 0 1 18 0v6" stroke-width="5" /><circle cx="24" cy="31" r="3.5" fill="#14173f" stroke="none" />
  {:else if name === 'star'}
    <path d="M24 4l6.2 12.9 14.1 1.9-10.3 9.8 2.6 14L24 35.8 11.4 42.6l2.6-14L3.7 18.8l14.1-1.9Z" fill="currentColor" stroke-width="2.5" />
  {:else if name === 'feather'}
    <path d="M40 6C22 6 10 18 10 34l-4 8 8-4c16 0 28-12 26-32Z" fill="currentColor" stroke="none" /><path d="M10 38C18 26 26 18 34 12" stroke="#14173f" stroke-width="2.5" opacity=".45" />
  {:else if name === 'book'}
    <path d="M6 10q10-3 18 3 8-6 18-3v26q-10-3-18 3-8-6-18-3Z" fill="currentColor" stroke="none" /><path d="M24 13v26" stroke="#14173f" stroke-width="2.5" opacity=".5" />
  {:else if name === 'gear'}
    <circle cx="24" cy="24" r="7" /><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2" />
  {:else if name === 'user'}
    <circle cx="24" cy="15" r="9" fill="currentColor" stroke="none" /><path d="M7 43q0-15 17-15t17 15Z" fill="currentColor" stroke="none" />
  {:else if name === 'map'}
    <path d="M5 11l12-4 14 4 12-4v30l-12 4-14-4-12 4Z" fill="currentColor" stroke="none" /><path d="M17 7v30M31 11v30" stroke="#14173f" stroke-width="2.5" opacity=".45" />
  {:else if name === 'music'}
    <path d="M18 34V10l22-4v24" /><circle cx="12" cy="35" r="6" fill="currentColor" stroke="none" /><circle cx="34" cy="31" r="6" fill="currentColor" stroke="none" />
  {:else if name === 'musicoff'}
    <path d="M18 34V10l22-4v24" /><circle cx="12" cy="35" r="6" fill="currentColor" stroke="none" /><circle cx="34" cy="31" r="6" fill="currentColor" stroke="none" /><path d="M6 6l36 36" stroke="#ff7aa8" stroke-width="6" />
  {:else if name === 'play'}
    <path d="M13 8l26 16-26 16Z" fill="currentColor" stroke-width="3" />
  {:else if name === 'download'}
    <path d="M24 6v24M13 21l11 11 11-11M8 40h32" stroke-width="5" />
  {:else if name === 'heart'}
    <path d="M24 42C8 30 5 20 8 14c4-8 14-6 16 1 2-7 12-9 16-1 3 6 0 16-16 28Z" fill="currentColor" stroke="none" />
  {:else if name === 'sword'}
    <path d="M10 38L34 14l5-8 3 3-8 5L10 38ZM8 36l6 6M6 42l4-4" />
  {:else if name === 'scroll'}
    <path d="M12 8h26v28a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V14a6 6 0 0 1 4-6Z" fill="currentColor" stroke="none" /><path d="M18 18h14M18 25h14M18 32h9" stroke="#14173f" stroke-width="3" opacity=".5" />
  {:else if name === 'home'}
    <path d="M6 24L24 8l18 16M12 20v20h24V20" fill="currentColor" stroke-width="3" />
  {:else if name === 'bolt'}
    <path d="M27 4L10 27h12l-3 17 19-25H26Z" fill="currentColor" stroke="none" />
  {/if}
</svg>
