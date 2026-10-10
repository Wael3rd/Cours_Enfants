<script lang="ts">
  /** Reglages minimaux (ouverts par appui long 2 s sur l'engrenage) : prenom, seuil de vitesse, son, remise a zero. */
  import { app } from '../state/store.svelte.ts';
  import { applyAudioSettings } from '../lib/sound.ts';

  let { onclose }: { onclose: () => void } = $props();
  let confirmReset = $state(false);
  const thresholds = [{ ms: 3000, label: '3 s' }, { ms: 2500, label: '2,5 s' }, { ms: 2000, label: '2 s' }];
</script>

<div class="veil" role="presentation">
  <div class="panel" role="dialog" aria-modal="true" aria-label="Réglages">
    <h2>Réglages</h2>

    <label class="row">
      <span>Prénom (facultatif)</span>
      <input type="text" maxlength="16" value={app.state.name} oninput={(e) => app.setName(e.currentTarget.value)} autocomplete="off" />
    </label>

    <div class="row">
      <span>Un calcul est « rapide » en moins de</span>
      <div class="seg" role="radiogroup" aria-label="Seuil de vitesse">
        {#each thresholds as t}
          <button type="button" role="radio" aria-checked={app.state.settings.thresholdMs === t.ms} class:on={app.state.settings.thresholdMs === t.ms}
            onclick={() => app.setSettings({ thresholdMs: t.ms })}>{t.label}</button>
        {/each}
      </div>
    </div>

    <div class="row">
      <span>Son</span>
      <div class="seg" role="radiogroup" aria-label="Son">
        <button type="button" role="radio" aria-checked={app.state.settings.sound} class:on={app.state.settings.sound}
          onclick={() => { app.setSettings({ sound: true }); applyAudioSettings(); }}>Oui</button>
        <button type="button" role="radio" aria-checked={!app.state.settings.sound} class:on={!app.state.settings.sound}
          onclick={() => { app.setSettings({ sound: false }); applyAudioSettings(); }}>Non</button>
      </div>
    </div>

    <div class="row">
      <span>Remise à zéro</span>
      {#if !confirmReset}
        <button type="button" class="btn quiet" onclick={() => (confirmReset = true)}>Tout effacer…</button>
      {:else}
        <div class="seg">
          <button type="button" class="danger" onclick={() => { app.resetProgress(); confirmReset = false; }}>Oui, effacer</button>
          <button type="button" onclick={() => (confirmReset = false)}>Non</button>
        </div>
      {/if}
    </div>

    <button type="button" class="btn primary close" onclick={onclose}>Fermer</button>
  </div>
</div>

<style>
  .veil { position: fixed; inset: 0; z-index: 20; background: rgba(27, 36, 48, 0.45); display: grid; place-items: center; padding: 16px; }
  .panel { width: min(100%, 640px); max-height: 100%; overflow-y: auto; background: var(--card); border-radius: 24px; padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; border: 3px solid var(--line); }
  h2 { margin: 0; font-size: 2rem; }
  .row { display: flex; flex-direction: column; gap: 8px; font-size: 1.2rem; font-weight: 500; }
  input { height: 64px; border-radius: 14px; border: 3px solid var(--line); padding: 0 16px; font-size: 1.5rem; background: #fff; color: var(--ink); }
  input:focus { border-color: var(--accent); outline: none; }
  .seg { display: flex; gap: 10px; flex-wrap: wrap; }
  .seg button { min-height: 64px; min-width: 96px; padding: 0 22px; border-radius: 14px; border: 3px solid var(--line); background: #fff; font-size: 1.3rem; font-weight: 600; }
  .seg button.on { background: var(--accent); border-color: var(--accent); color: #fff; }
  .seg button.danger { border-color: var(--bad); color: var(--bad); }
  .close { align-self: flex-end; }
</style>
