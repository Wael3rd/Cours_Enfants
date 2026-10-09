<script lang="ts">
  /** Interrupteur tactile (>= 72 px) : etiquette + etat. */
  import { haptic } from '@ce/core';
  import { sfx } from '../services/sfx';
  import Icon from './Icon.svelte';

  interface Props { label: string; sub?: string; icon?: string; checked: boolean; onchange: (v: boolean) => void; }
  let { label, sub, icon, checked, onchange }: Props = $props();
  function flip() {
    haptic('tap');
    sfx(checked ? 'close' : 'open', 0.6);
    onchange(!checked);
  }
</script>

<button type="button" class="tg" role="switch" aria-checked={checked} onclick={flip}>
  {#if icon}<span class="ic"><Icon name={icon as never} size={38} /></span>{/if}
  <span class="tx"><b>{label}</b>{#if sub}<small>{sub}</small>{/if}</span>
  <span class="sw" class:on={checked}><i></i></span>
</button>

<style>
  .tg { display: flex; align-items: center; gap: 16px; width: 100%; min-height: 84px; padding: 8px 20px; border: 0; border-radius: 22px; cursor: pointer; text-align: left; color: var(--q-papel); background: rgba(255, 255, 255, 0.07); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.12); touch-action: manipulation; }
  .tg:active { background: rgba(255, 255, 255, 0.14); }
  .ic { flex: none; width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; color: var(--q-nuit); background: var(--q-sol); }
  .tx { flex: 1; display: grid; gap: 2px; }
  .tx b { font: 900 28px/1.1 var(--q-font-body); }
  .tx small { font: 700 20px/1.2 var(--q-font-body); opacity: 0.75; }
  .sw { position: relative; flex: none; width: 96px; height: 52px; border-radius: 26px; background: #3a3f7a; box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.5); transition: background 0.2s; }
  .sw i { position: absolute; top: 5px; left: 5px; width: 42px; height: 42px; border-radius: 50%; background: #fff; box-shadow: 0 3px 0 rgba(0, 0, 0, 0.35); transition: transform 0.2s cubic-bezier(0.2, 1.4, 0.4, 1); }
  .sw.on { background: var(--q-quetzal); }
  .sw.on i { transform: translateX(44px); }
</style>
