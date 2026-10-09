<script lang="ts">
  import type { Updater } from '../pwa';
  import Button from './Button.svelte';

  let { updater }: { updater: Updater } = $props();
  let needRefresh = $state(false);
  let offlineReady = $state(false);
  let dismissed = $state(false);

  $effect(() => updater.subscribe((n, o) => {
    needRefresh = n;
    offlineReady = o;
    if (o) setTimeout(() => (dismissed = true), 4000);
  }));
</script>

{#if (needRefresh || offlineReady) && !(offlineReady && !needRefresh && dismissed)}
  <div class="toast" role="status">
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
</style>
