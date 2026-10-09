<script lang="ts">
  /** Diccionario : toutes les cartes-objets par unite et categorie, detail avec audio, exemple et niveau de maitrise. */
  import { onMount } from 'svelte';
  import { gsap, haptic, prefersReducedMotion, shake } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content, loadAllUnits } from '../engine/data';
  import { inventory, MASTERY_LABEL, rarityOf, RARITY_LABEL } from '../engine';
  import type { Vocab } from '../content/schema';
  import { nav } from '../ui/nav.svelte';
  import { say } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import TopBar from '../ui/TopBar.svelte';
  import VocabCard from '../ui/VocabCard.svelte';
  import SpeakText from '../ui/SpeakText.svelte';
  import RoundBtn from '../ui/RoundBtn.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import Panel from '../art/Panel.svelte';

  let ready = $state(false);
  let unitId = $state('');
  let tag = $state('todas');
  let sel = $state<(Vocab & { unitId: string }) | null>(null);
  let grid: HTMLElement | undefined = $state();

  onMount(async () => {
    music.setMode('menu');
    await loadAllUnits();
    unitId = content.units.find((u) => u.vocab.length)?.id ?? '';
    ready = true;
  });

  const inv = $derived(new Map(inventory(content, game.state).map((c) => [c.vocab.id, c])));
  const unit = $derived(content.unitById.get(unitId));
  const tags = $derived.by(() => {
    const m = new Map<string, number>();
    for (const v of unit?.vocab ?? []) for (const t of v.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  });
  const words = $derived((unit?.vocab ?? []).filter((v) => tag === 'todas' || v.tags.includes(tag)));
  const total = $derived([...content.vocab.values()].length);
  const found = $derived(inv.size);
  const unitFound = (id: string) => (content.unitById.get(id)?.vocab ?? []).filter((v) => inv.has(v.id)).length;

  function pickUnit(id: string) {
    unitId = id;
    tag = 'todas';
    sfx('page', 0.6);
    if (grid && !prefersReducedMotion()) gsap.from(grid.children, { y: 30, opacity: 0, scale: 0.9, duration: 0.35, stagger: 0.015, ease: 'power3.out', clearProps: 'all' });
  }
  function openCard(v: Vocab & { unitId: string }, el: HTMLElement) {
    haptic('tap');
    if (!inv.has(v.id)) {
      sfx('wrong', 0.6);
      shake(el, 8);
      return;
    }
    sfx('book');
    sel = v;
    say(v.audio, v.es);
  }
  const dueText = (due: string | null) => {
    if (!due) return '';
    const d = Math.round((new Date(due + 'T12:00:00').getTime() - new Date().setHours(12, 0, 0, 0)) / 86400000);
    return d <= 0 ? 'Para repasar hoy' : d === 1 ? 'Repaso: mañana' : `Repaso: en ${d} días`;
  };
</script>

<div class="scr scr-bg dic">
  <TopBar title="Diccionario" sub={`${found} / ${total} cartas`} onback={() => nav.back()} />
  {#if !ready}
    <div class="empty"><p>Abriendo el libro…</p></div>
  {:else}
    <nav class="units" aria-label="Regiones">
      {#each content.units.filter((u) => u.vocab.length) as u}
        <button type="button" class="u" class:on={u.id === unitId} onclick={() => pickUnit(u.id)}>
          <Emoji e={u.emoji} size={44} /><span><b>{u.lugar}</b><small>{unitFound(u.id)}/{u.vocab.length}</small></span>
        </button>
      {/each}
    </nav>
    <div class="tags scroll" role="group" aria-label="Categorías">
      <button type="button" class="t" class:on={tag === 'todas'} onclick={() => (tag = 'todas')}>todas</button>
      {#each tags as t}<button type="button" class="t" class:on={tag === t} onclick={() => (tag = t)}>{t}</button>{/each}
    </div>
    <div class="gridwrap scroll">
      <div class="grid" bind:this={grid}>
        {#each words as v (v.id)}
          {@const c = inv.get(v.id)}
          <div class="cell">
            <VocabCard {v} size={168} locked={!c} ontap={() => openCard({ ...v, unitId }, grid!)} />
            <span class="mast" aria-label={c ? MASTERY_LABEL[c.mastery] : 'Sin descubrir'}>{#each [1, 2, 3, 4, 5] as k}<i class:on={!!c && c.mastery >= k}></i>{/each}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if sel}
    {@const c = inv.get(sel.id)}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="veil" onclick={() => (sel = null)}>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div class="det" onclick={(e) => e.stopPropagation()}>
        <Panel padding="26px 34px">
          <div class="dc">
            <VocabCard v={sel} size={300} ontap={() => say(sel!.audio, sel!.es)} />
            <div class="info">
              <h2 class="h-rpg"><SpeakText text={sel.es} audio={sel.audio} /></h2>
              <div class="chips">
                <span class="chip r">{RARITY_LABEL[rarityOf(sel)]}</span>
                {#if sel.genero === 'm'}<span class="chip m">masculino</span>{:else if sel.genero === 'f'}<span class="chip f">femenino</span>{/if}
                {#if sel.plural}<span class="chip">plural · {sel.plural}</span>{/if}
                {#if sel.femenino}<span class="chip">femenino · {sel.femenino}</span>{/if}
              </div>
              <p class="ex"><SpeakText text={sel.ejemplo.es} audio={sel.ejemplo.audio} /></p>
              <div class="level">
                <span class="mast big">{#each [1, 2, 3, 4, 5] as k}<i class:on={!!c && c.mastery >= k}></i>{/each}</span>
                <b>{MASTERY_LABEL[c?.mastery ?? 0]}</b>
                {#if c?.due}<small>{dueText(c.due)}</small>{/if}
              </div>
              <div class="acts">
                <RoundBtn icon="turtle" label="Más despacio" variant="turquesa" onclick={() => say(sel!.audio, sel!.es, { lento: true })} />
                <RoundBtn icon="cross" label="Cerrar" variant="papel" onclick={() => (sel = null)} />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  {/if}
</div>

<style>
  .dic { z-index: 2; }
  .empty { flex: 1; display: grid; place-items: center; font: 800 30px var(--q-font-body); color: var(--q-papel2); }
  .units { flex: none; display: flex; gap: 12px; padding: 4px 24px 8px; overflow-x: auto; scrollbar-width: none; }
  .u { flex: none; display: flex; align-items: center; gap: 10px; min-height: 72px; padding: 6px 22px 6px 14px; border: 0; border-radius: 22px; cursor: pointer; color: var(--q-papel); background: rgba(255, 255, 255, 0.08); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.14); text-align: left; touch-action: manipulation; }
  .u b { display: block; font: 900 24px/1.1 var(--q-font-body); }
  .u small { font: 800 18px var(--q-font-body); opacity: 0.75; }
  .u.on { background: rgba(255, 200, 61, 0.22); box-shadow: inset 0 0 0 4px var(--q-sol); }
  .tags { flex: none; display: flex; gap: 10px; padding: 2px 24px 10px; overflow-x: auto; overflow-y: hidden; }
  .t { flex: none; min-height: 52px; padding: 0 22px; border: 0; border-radius: 999px; cursor: pointer; font: 900 22px var(--q-font-body); color: var(--q-nuit); background: var(--q-papel2); touch-action: manipulation; }
  .t.on { background: var(--q-sol); box-shadow: 0 0 0 3px #fff; }
  .gridwrap { flex: 1; min-height: 0; padding: 6px 24px 24px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 22px 16px; justify-items: center; }
  .cell { display: grid; gap: 10px; justify-items: center; }
  .mast { display: flex; gap: 6px; }
  .mast i { width: 14px; height: 14px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); }
  .mast i.on { background: var(--q-sol); box-shadow: 0 0 8px rgba(255, 200, 61, 0.8); }
  .mast.big i { width: 22px; height: 22px; }
  .veil { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 30px; background: rgba(8, 9, 32, 0.7); animation: fadein 0.2s; }
  @keyframes fadein { from { opacity: 0; } }
  .det { width: 100%; max-width: 1020px; animation: pop 0.4s cubic-bezier(0.2, 1.4, 0.4, 1); }
  @keyframes pop { from { transform: scale(0.8); opacity: 0; } }
  .dc { display: flex; gap: 40px; align-items: center; }
  .info { flex: 1; display: grid; gap: 14px; }
  .info h2 { font-size: 66px; line-height: 1; }
  .info h2 :global(.sp) { text-decoration: none; }
  .chips { display: flex; gap: 10px; flex-wrap: wrap; }
  .chip { padding: 4px 18px 6px; border-radius: 999px; font: 900 22px var(--q-font-body); background: rgba(255, 255, 255, 0.14); }
  .chip.r { background: var(--q-sol); color: var(--q-nuit); }
  .chip.m { background: var(--q-el); color: #fff; }
  .chip.f { background: var(--q-la); color: #fff; }
  .ex { margin: 0; padding: 14px 20px; border-radius: 18px; background: rgba(11, 13, 42, 0.55); font: 800 30px/1.35 var(--q-font-body); }
  .level { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .level b { font: 900 26px var(--q-font-body); color: var(--q-sol); }
  .level small { font: 800 22px var(--q-font-body); opacity: 0.8; }
  .acts { display: flex; gap: 16px; }
</style>
