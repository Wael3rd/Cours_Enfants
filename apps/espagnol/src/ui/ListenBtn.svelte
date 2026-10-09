<script lang="ts">
  /** Gros bouton "ecouter" (+ tortue) pour les exercices d'ecoute / dictee. Ondes quand la voix joue. */
  import { onMount } from 'svelte';
  import { say, ui } from './ui.svelte';
  import RoundBtn from './RoundBtn.svelte';
  import Icon from './Icon.svelte';

  interface Props { audio?: string; text?: string; autoplay?: boolean; size?: number; }
  let { audio, text, autoplay = true, size = 128 }: Props = $props();
  const speaking = $derived(!!audio && ui.speaking === audio);

  onMount(() => {
    if (!autoplay) return;
    const t = setTimeout(() => say(audio, text), 450);
    return () => clearTimeout(t);
  });
</script>

<div class="lb">
  <button type="button" class="big" class:on={speaking} style:width="{size}px" style:height="{size}px" aria-label="Escuchar" onclick={() => say(audio, text, { lento: false })}>
    <i class="w w1"></i><i class="w w2"></i>
    <Icon name="speaker" size={Math.round(size * 0.5)} />
  </button>
  <RoundBtn icon="turtle" label="Más despacio" variant="turquesa" size={88} onclick={() => say(audio, text, { lento: true })} />
</div>

<style>
  .lb { display: flex; align-items: center; justify-content: center; gap: 22px; }
  .big { position: relative; border: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer; color: var(--q-nuit); background: linear-gradient(180deg, #ffe08a, var(--q-sol)); box-shadow: 0 9px 0 #6b3d08, inset 0 0 0 4px rgba(255, 255, 255, 0.45), 0 18px 26px rgba(5, 6, 30, 0.4); touch-action: manipulation; transition: transform 0.06s, box-shadow 0.06s; }
  .big:active { transform: translateY(7px); box-shadow: 0 2px 0 #6b3d08, inset 0 0 0 4px rgba(255, 255, 255, 0.45); }
  .w { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 4px var(--q-sol); opacity: 0; pointer-events: none; }
  .on .w1 { animation: wave 1.1s ease-out infinite; }
  .on .w2 { animation: wave 1.1s ease-out 0.45s infinite; }
  @keyframes wave { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.7); opacity: 0; } }
</style>
