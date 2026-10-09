<script lang="ts">
  import type { Updater } from '../pwa';
  import Button from './Button.svelte';

  /** Le toast "Pret pour le hors-ligne" disparait seul apres ce delai. */
  const OFFLINE_TOAST_MS = 3000;

  let { updater }: { updater: Updater } = $props();
  let needRefresh = $state(false);
  let offlineReady = $state(false);
  let offlineShown = $state(false);
  let offlineSeen = false;

  $effect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = updater.subscribe((n, o) => {
      needRefresh = n;
      offlineReady = o;
      // un seul affichage, borne dans le temps ; ne se reaffiche pas si le service worker re-notifie
      if (o && !offlineSeen) {
        offlineSeen = true;
        offlineShown = true;
        timer = setTimeout(() => (offlineShown = false), OFFLINE_TOAST_MS);
      }
    });
    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  });
</script>

{#if needRefresh || (offlineReady && offlineShown)}
  <div class="toast" class:passive={!needRefresh} role="status">
    {#if needRefresh}
      <span>Nouvelle version disponible</span>
      <Button size="md" onclick={() => updater.apply()}>Mettre a jour</Button>
    {:else}
      <span>Pret pour le hors-ligne</span>
    {/if}
  </div>
{/if}

<style>
  .toast { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 2000; display: flex; gap: 16px; align-items: center; padding: 12px 16px 12px 24px; border-radius: 20px; background: #0b1b3a; color: #fff; font-weight: 700; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); }
  /* simple information : ne capte jamais les appuis, ne masque rien */
  .toast.passive { pointer-events: none; }
</style>
