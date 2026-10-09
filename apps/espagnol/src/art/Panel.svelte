<script lang="ts">
  /** Panneau RPG : cadre dore, bande d'azulejos, coins ornes. `tone` = fond du contenu. */
  import type { Snippet } from 'svelte';
  import { azulejoDataUri, cornerOrnament } from './core/qart.js';

  interface Props {
    tone?: 'nuit' | 'papel' | 'terracotta';
    corners?: boolean;
    padding?: string;
    class?: string;
    children?: Snippet;
  }
  let { tone = 'nuit', corners = true, padding = '28px 32px', class: klass = '', children }: Props = $props();

  const tile = azulejoDataUri({}, 56);
  const corner = cornerOrnament(56);
</script>

<div class="panel {tone} {klass}" style:--tile="url('{tile}')">
  <div class="band">
    <div class="body" style:padding>
      {@render children?.()}
    </div>
  </div>
  {#if corners}
    <span class="c tl">{@html corner}</span>
    <span class="c tr">{@html corner}</span>
    <span class="c bl">{@html corner}</span>
    <span class="c br">{@html corner}</span>
  {/if}
</div>

<style>
  .panel {
    position: relative;
    padding: 7px;
    border-radius: 26px;
    background: linear-gradient(160deg, #ffe08a, var(--q-sol) 40%, #c98a12);
    box-shadow: 0 6px 0 #6b3d08, 0 16px 30px rgba(5, 6, 30, 0.45);
  }
  .band {
    border-radius: 20px;
    padding: 14px;
    background-color: var(--q-nuit2);
    background-image: var(--tile);
    background-size: 56px 56px;
    box-shadow: inset 0 0 0 3px rgba(11, 13, 42, 0.55);
  }
  .body {
    border-radius: 12px;
    color: var(--q-papel);
    background: linear-gradient(180deg, #1b1f5c, var(--q-nuit));
    box-shadow: inset 0 3px 0 rgba(255, 255, 255, 0.08), inset 0 0 0 3px rgba(255, 200, 61, 0.55), inset 0 -18px 30px rgba(0, 0, 0, 0.25);
    font-family: var(--q-font-body);
  }
  .papel .body { color: var(--q-nuit); background: linear-gradient(180deg, #fbf0d8, var(--q-papel)); box-shadow: inset 0 0 0 3px rgba(158, 61, 41, 0.5), inset 0 -14px 24px rgba(158, 110, 41, 0.18); }
  .terracotta .body { background: linear-gradient(180deg, #d8654a, var(--q-terracotta2)); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.6); }
  .c { position: absolute; width: 56px; height: 56px; pointer-events: none; filter: drop-shadow(0 2px 0 rgba(60, 30, 4, 0.7)); }
  .c :global(svg) { display: block; }
  .tl { top: -10px; left: -10px; }
  .tr { top: -10px; right: -10px; transform: scaleX(-1); }
  .bl { bottom: -10px; left: -10px; transform: scaleY(-1); }
  .br { bottom: -10px; right: -10px; transform: scale(-1, -1); }
</style>
