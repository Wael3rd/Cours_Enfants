<script lang="ts">
  /** Ajustes : son, musique, vibration, voix lente, micro, telechargements audio par region, creditos, espace parent. */
  import { onMount } from 'svelte';
  import { ParentGate } from '@ce/core';
  import { game } from '../state/game.svelte';
  import { content, loadAllUnits, loadUnit } from '../engine/data';
  import { nav } from '../ui/nav.svelte';
  import { ui } from '../ui/ui.svelte';
  import { sfx } from '../services/sfx';
  import { music } from '../services/music';
  import { setSound } from '../services/audio';
  import { speechSupport } from '../services/speech';
  import { setHaptics, setSoftMotion } from '@ce/core';
  import TopBar from '../ui/TopBar.svelte';
  import Toggle from '../ui/Toggle.svelte';
  import Emoji from '../ui/Emoji.svelte';
  import Icon from '../ui/Icon.svelte';
  import PrimaryButton from '../art/PrimaryButton.svelte';
  const fmtBytes = (b: number) => `${(b / 1e6).toFixed(1).replace('.', ',')} MB`;

  let parentOpen = $state(false);
  let ParentComp = $state<typeof import('../parent/ParentSpace.svelte').default | null>(null);
  const st = $derived(game.state.settings);
  const mic = speechSupport();
  const sysReduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  onMount(() => {
    music.setMode('menu');
    void loadAllUnits();
  });

  function set<K extends keyof typeof st>(k: K, v: (typeof st)[K]) {
    game.mutate((s) => (s.settings[k] = v));
    if (k === 'sound') setSound(v as boolean);
    if (k === 'haptics') setHaptics(v as boolean);
    if (k === 'reducedMotion') setSoftMotion(v as boolean);
    if (k === 'music') music.setEnabled(v as boolean);
    if (k === 'lentoDefault') ui.lento = v as boolean;
  }

  async function openParent() {
    await loadAllUnits();
    ParentComp = (await import('../parent/ParentSpace.svelte')).default;
    parentOpen = true;
  }
  async function download(id: string) {
    const u = await loadUnit(id);
    sfx('open', 0.6);
    await game.downloadUnitAudio(u);
    sfx('item');
  }
  async function remove(id: string) {
    const u = await loadUnit(id);
    sfx('close', 0.6);
    await game.removeUnitAudio(u);
  }
  const label = (s?: string) => (s === 'ready' ? 'Lista' : s === 'partial' ? 'Incompleta' : 'Sin descargar');
</script>

<div class="scr scr-bg set">
  <TopBar title="Ajustes" onback={() => nav.back()} />
  <div class="body scroll">
    <section class="col">
      <h2 class="h-rpg">Sonido</h2>
      <Toggle icon="sound" label="Sonidos" sub="Efectos y voces" checked={st.sound} onchange={(v) => set('sound', v)} />
      <Toggle icon="music" label="Música" sub="Aventura de fondo" checked={st.music} onchange={(v) => set('music', v)} />
      <Toggle icon="turtle" label="Voz lenta" sub="Las voces hablan más despacio" checked={st.lentoDefault} onchange={(v) => set('lentoDefault', v)} />
      <Toggle icon="bolt" label="Vibración" sub="Al tocar y al acertar" checked={st.haptics} onchange={(v) => set('haptics', v)} />
      <Toggle icon="bolt" label="Animaciones suaves" sub="Menos movimiento y destellos en las animaciones" checked={st.reducedMotion || sysReduced} onchange={(v) => set('reducedMotion', v)} />
      <Toggle icon="mic" label="Micrófono" sub={mic === 'ok' ? 'Para los hechizos de voz' : 'No disponible: te evalúas tú'} checked={st.speechEnabled} onchange={(v) => set('speechEnabled', v)} />
    </section>

    <section class="col">
      <h2 class="h-rpg">Voces sin conexión</h2>
      <Toggle icon="download" label="Descarga automática" sub="La región actual y la siguiente, con Wi-Fi" checked={st.autoDownload} onchange={(v) => set('autoDownload', v)} />
      <ul class="units">
        {#each [...content.main, ...content.events] as u}
          {@const o = game.state.offline[u.id]}
          {@const dl = game.downloads[u.id]}
          <li>
            <Emoji e={u.emoji} size={52} />
            <div class="ut"><b>{u.lugar}</b>
              {#if dl}
                <span class="bar"><i style:transform="scaleX({dl.done / Math.max(1, dl.total)})"></i></span>
              {:else}<small class:ok={o?.status === 'ready'}>{label(o?.status)}{#if o?.bytes} · {fmtBytes(o.bytes)}{/if}</small>{/if}
            </div>
            {#if !dl}
              {#if o?.status === 'ready'}
                <button type="button" class="sm del" aria-label="Borrar" onclick={() => remove(u.id)}><Icon name="cross" size={30} /></button>
              {:else}
                <button type="button" class="sm" aria-label="Descargar" onclick={() => download(u.id)}><Icon name="download" size={32} /></button>
              {/if}
            {/if}
          </li>
        {/each}
      </ul>
    </section>

    <section class="foot">
      <PrimaryButton variant="turquesa" onclick={() => nav.go({ name: 'credits' })}>Créditos</PrimaryButton>
      <div class="gate">
        <span class="gl">Adultos: mantén pulsado 3 segundos</span>
        <ParentGate onpass={openParent} label="Mantén pulsado 3 segundos (adultos)"><Icon name="lock" size={30} /></ParentGate>
      </div>
    </section>
  </div>
  {#if parentOpen && ParentComp}<ParentComp onclose={() => (parentOpen = false)} />{/if}
</div>

<style>
  .set { z-index: 2; }
  .body { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 14px 40px; padding: 6px 36px 30px; align-content: start; }
  .col { display: grid; gap: 12px; align-content: start; }
  h2 { font-size: 36px; margin: 0 0 2px; }
  .units { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .units li { display: flex; align-items: center; gap: 14px; min-height: 76px; padding: 6px 16px; border-radius: 20px; background: rgba(255, 255, 255, 0.07); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.12); }
  .ut { flex: 1; display: grid; gap: 4px; }
  .ut b { font: 900 26px var(--q-font-body); color: var(--q-papel); }
  .ut small { font: 800 20px var(--q-font-body); color: var(--q-papel2); opacity: 0.8; }
  .ut small.ok { color: #42e0a0; opacity: 1; }
  .bar { display: block; height: 14px; border-radius: 7px; background: rgba(255, 255, 255, 0.15); overflow: hidden; }
  .bar i { display: block; height: 100%; width: 100%; transform-origin: 0 50%; background: linear-gradient(90deg, #19b7aa, #7ff3e4); }
  .sm { width: 68px; height: 68px; border: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer; color: var(--q-nuit); background: linear-gradient(180deg, #7ff3e4, var(--q-turquesa)); box-shadow: 0 5px 0 #07474f; touch-action: manipulation; }
  .sm.del { background: linear-gradient(180deg, #ffa3b0, #e8434f); box-shadow: 0 5px 0 #7a1f2f; }
  .foot { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding-top: 8px; }
  .gate { display: flex; align-items: center; gap: 14px; opacity: 0.75; }
  .gl { display: flex; align-items: center; gap: 8px; font: 800 22px var(--q-font-body); color: var(--q-papel2); }
</style>
