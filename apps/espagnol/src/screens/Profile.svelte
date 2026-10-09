<script lang="ts">
  /** Perfil : avatar (et objets debloques), niveau, habilidades (radar), plumas recuperees, Quetzal qui reprend ses couleurs. */
  import { onMount } from 'svelte';
  import { gsap, haptic, prefersReducedMotion } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content } from '../engine/data';
  import { allAvatarItems, playerLevel, playerName, statLevel, streak, totalXp, inventory } from '../engine';
  import { STATS, type StatId } from '../content/schema';
  import { nav } from '../ui/nav.svelte';
  import { now } from '../ui/clock';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import { AVATAR_TIPOS, TONES, TONE_COLORS, avatarKey, avatarUrl, parseAvatar } from '../ui/avatar';
  import { regionOf } from '../ui/regions';
  import TopBar from '../ui/TopBar.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import Icon from '../ui/Icon.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  import StatsPanel from '../art/StatsPanel.svelte';
  import XpBar from '../art/XpBar.svelte';
  import Panel from '../art/Panel.svelte';
  import QuetzalMascot from '../art/QuetzalMascot.svelte';

  const s = $derived(game.state);
  const lvl = $derived(playerLevel(s));
  const plumas = $derived(content.main.filter((u) => s.plumas[u.id]).length);
  const frac = $derived(content.main.length ? plumas / content.main.length : 0);
  const stats = $derived(
    Object.fromEntries(STATS.map((k: StatId) => { const l = statLevel(s, k); return [k, { level: l.level, xp: l.into, max: l.span }]; })) as Record<StatId, { level: number; xp: number; max: number }>,
  );
  const items = $derived(allAvatarItems(content).filter((i) => s.unlocked.includes(i.id)));
  const locked = $derived(allAvatarItems(content).filter((i) => !s.unlocked.includes(i.id)).length);
  const equipped = $derived(Object.values(s.profile.avatar.items));
  const days = $derived(streak(s, now()));
  const words = $derived(inventory(content, s).length);
  const quests = $derived(Object.values(s.quests).filter((q) => q.done).length);
  let editing = $state(false);
  let tipo = $state(parseAvatar(game.state.profile.avatar.base).tipo.id);
  let tone = $state(parseAvatar(game.state.profile.avatar.base).tone);
  let quetzal: QuetzalMascot | undefined = $state();
  let root: HTMLElement | undefined = $state();

  onMount(() => {
    music.setMode('menu');
    if (plumas > 0) setTimeout(() => quetzal?.regrow(), 600);
    if (root && !prefersReducedMotion()) gsap.from(root.querySelectorAll('.pop'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' });
  });

  function equip(id: string, slot: string) {
    haptic('tap');
    sfx('equip');
    game.mutate((st) => {
      if (st.profile.avatar.items[slot] === id) delete st.profile.avatar.items[slot];
      else st.profile.avatar.items[slot] = id;
    });
  }
  function saveAvatar() {
    game.mutate((st) => (st.profile.avatar.base = avatarKey(tipo, tone)));
    sfx('item');
    editing = false;
  }
  const itemOf = (slot: string) => items.find((i) => i.id === s.profile.avatar.items[slot]);
</script>

<div class="scr scr-bg pf" bind:this={root}>
  <TopBar title="Perfil" onback={() => nav.back()} />
  <div class="body scroll">
    <section class="hero pop">
      <div class="stage">
        <div class="halo"></div>
        <img class="av" src={avatarUrl(s.profile.avatar.base)} alt="" draggable="false" />
        {#if itemOf('accesorio')}<span class="gear top"><Emoji e={itemOf('accesorio')!.emoji} size={72} /></span>{/if}
        {#if itemOf('atuendo')}<span class="gear bot"><Emoji e={itemOf('atuendo')!.emoji} size={84} /></span>{/if}
        <button type="button" class="chg" aria-label="Cambiar de aspecto" onclick={() => { editing = true; sfx('open'); }}><Icon name="user" size={30} /> Cambiar</button>
      </div>
      <div class="who">
        <h2 class="h-rpg">{playerName(s)}</h2>
        <XpBar value={lvl.into} max={lvl.span} level={lvl.level} label="XP" width={420} />
        <ul class="nums">
          <li><b>{totalXp(s.xp)}</b><span>XP total</span></li>
          <li><b>{words}</b><span>cartas</span></li>
          <li><b>{quests}</b><span>misiones</span></li>
          <li><b>{days}</b><span>{days === 1 ? 'día seguido' : 'días seguidos'}</span></li>
        </ul>
      </div>
    </section>

    <div class="pop"><StatsPanel {stats} title="Habilidades" /></div>

    <section class="pl pop">
      <Panel padding="22px 28px">
        <div class="plrow">
          <div class="qz" style:filter="saturate({0.25 + frac * 0.75}) brightness({0.85 + frac * 0.15})">
            <QuetzalMascot bind:this={quetzal} pose="perched" bare={plumas === 0} branch width={150} />
          </div>
          <div class="pls">
            <h3 class="h-rpg">Las plumas del Quetzal</h3>
            <p class="cnt">{plumas} de {content.units.filter((u) => !u.evento).length}</p>
            <div class="feathers">
              {#each content.main as u}
                <div class="f" class:got={!!s.plumas[u.id]} title={u.pluma.nombre}>
                  <Icon name="feather" size={52} />
                  <small>{u.lugar}</small>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </Panel>
    </section>

    <section class="inv pop">
      <h3 class="h-rpg">Objetos</h3>
      <div class="items">
        {#each items as i (i.id)}
          <button type="button" class="it" class:on={equipped.includes(i.id)} onclick={() => equip(i.id, i.slot)} aria-label={i.nombre}>
            <Emoji e={i.emoji} size={72} /><small>{i.nombre}</small>
          </button>
        {/each}
        {#each Array(Math.min(locked, 4)) as _}<div class="it lock"><Icon name="lock" size={44} /><small>???</small></div>{/each}
      </div>
    </section>
  </div>

  {#if editing}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="veil" onclick={() => (editing = false)}>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div class="ed" onclick={(e) => e.stopPropagation()}>
        <Panel padding="26px 30px">
          <h2 class="h-rpg">Elige tu viajero</h2>
          <div class="tipos">
            {#each AVATAR_TIPOS as t}
              <button type="button" class="tp" class:on={tipo === t.id} onclick={() => { tipo = t.id; sfx('select', 0.7); }} aria-label={t.label}><Emoji e={t.emoji + TONES[tone]} size={92} /></button>
            {/each}
          </div>
          <div class="tones">
            {#each TONE_COLORS as c, i}<button type="button" class="tn" class:on={tone === i} style:--c={c} onclick={() => { tone = i; sfx('select', 0.7); }} aria-label={`Tono ${i + 1}`}></button>{/each}
          </div>
          <div class="go"><PrimaryButton onclick={saveAvatar}>¡Listo!</PrimaryButton></div>
        </Panel>
      </div>
    </div>
  {/if}
</div>

<style>
  .pf { z-index: 2; }
  .body { flex: 1; min-height: 0; display: grid; grid-template-columns: auto 1fr; gap: 22px 28px; padding: 6px 28px 30px; align-content: start; align-items: start; }
  .hero { grid-column: 1 / -1; display: flex; align-items: center; gap: 36px; padding-left: 20px; }
  .stage { position: relative; width: 250px; height: 300px; flex: none; display: grid; place-items: center; }
  .halo { position: absolute; inset: 20px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255, 200, 61, 0.55), transparent); }
  .av { position: relative; width: 240px; height: 240px; object-fit: contain; filter: drop-shadow(0 12px 0 rgba(0, 0, 0, 0.25)); }
  .gear { position: absolute; filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.4)); }
  .gear.top { right: -4px; top: 0; }
  .gear.bot { left: -10px; bottom: 36px; }
  .chg { position: absolute; bottom: 0; display: flex; align-items: center; gap: 8px; height: 60px; padding: 0 22px; border: 0; border-radius: 999px; cursor: pointer; font: 900 24px var(--q-font-body); color: var(--q-nuit); background: linear-gradient(180deg, #fff3d1, var(--q-papel2)); box-shadow: 0 5px 0 #7d5a1c; touch-action: manipulation; }
  .who { display: grid; gap: 14px; }
  .who h2 { font-size: 54px; line-height: 1; }
  .nums { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
  .nums li { display: grid; padding: 6px 16px 8px; border-radius: 16px; background: rgba(11, 13, 42, 0.6); box-shadow: inset 0 0 0 3px rgba(255, 200, 61, 0.4); }
  .nums b { font: 400 34px/1 var(--q-font-title); color: var(--q-sol); }
  .nums span { font: 800 18px var(--q-font-body); color: var(--q-papel2); }
  .plrow { display: flex; align-items: center; gap: 20px; }
  .pls { flex: 1; display: grid; gap: 6px; }
  .pls h3 { font-size: 36px; }
  .cnt { margin: 0; font: 900 26px var(--q-font-body); color: var(--q-papel); }
  .feathers { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 4px; }
  .f { display: grid; justify-items: center; gap: 2px; width: 96px; padding: 8px 4px; border-radius: 18px; color: #6b72b8; background: rgba(255, 255, 255, 0.06); }
  .f small { font: 800 18px var(--q-font-body); color: var(--q-papel2); opacity: 0.7; text-align: center; }
  .f.got { color: #42e0a0; background: rgba(66, 224, 160, 0.14); box-shadow: inset 0 0 0 3px rgba(66, 224, 160, 0.6); filter: drop-shadow(0 0 10px rgba(66, 224, 160, 0.5)); }
  .f.got small { opacity: 1; }
  .inv { grid-column: 1 / -1; }
  .inv h3 { font-size: 34px; margin-bottom: 10px; }
  .items { display: flex; gap: 14px; flex-wrap: wrap; }
  .it { display: grid; justify-items: center; gap: 2px; width: 150px; padding: 10px 8px; border: 0; border-radius: 20px; cursor: pointer; color: var(--q-papel); background: rgba(255, 255, 255, 0.08); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.14); touch-action: manipulation; }
  .it small { font: 800 18px/1.1 var(--q-font-body); text-align: center; }
  .it.on { background: rgba(255, 200, 61, 0.22); box-shadow: inset 0 0 0 4px var(--q-sol); }
  .it.lock { color: #6b72b8; cursor: default; opacity: 0.7; align-content: center; }
  .veil { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; background: rgba(8, 9, 32, 0.7); }
  .ed { width: 640px; }
  .ed h2 { font-size: 40px; margin-bottom: 16px; }
  .tipos { display: flex; gap: 14px; justify-content: center; }
  .tp { width: 116px; height: 116px; border-radius: 26px; border: 0; display: grid; place-items: center; cursor: pointer; background: rgba(255, 255, 255, 0.08); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.15); touch-action: manipulation; }
  .tp.on { background: rgba(255, 200, 61, 0.25); box-shadow: inset 0 0 0 5px var(--q-sol); }
  .tones { display: flex; gap: 14px; justify-content: center; margin: 20px 0 8px; }
  .tn { width: 66px; height: 66px; border-radius: 50%; border: 0; cursor: pointer; background: var(--c); box-shadow: 0 5px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 4px rgba(255, 255, 255, 0.35); touch-action: manipulation; }
  .tn.on { transform: scale(1.18); box-shadow: 0 5px 0 rgba(0, 0, 0, 0.35), 0 0 0 5px #fff, 0 0 0 9px var(--q-sol); }
  .go { display: flex; justify-content: center; margin-top: 12px; }
</style>
