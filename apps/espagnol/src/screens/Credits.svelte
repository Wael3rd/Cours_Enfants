<script lang="ts">
  /** Creditos : attributions obligatoires (CC BY, MIT) et remerciements (voir assets/LICENSES.md). */
  import { onMount } from 'svelte';
  import { nav } from '../ui/nav.svelte';
  import { music } from '../services/music';
  import TopBar from '../ui/TopBar.svelte';
  import Panel from '../art/Panel.svelte';

  onMount(() => music.setMode('menu'));

  const ROWS: { t: string; who: string; lic: string; url?: string }[] = [
    { t: 'Animaciones de emojis', who: 'Noto Emoji Animation © Google', lic: 'Licencia CC BY 4.0', url: 'googlefonts.github.io/noto-emoji-animation' },
    { t: 'Emojis en 3D', who: 'Fluent Emoji © Microsoft Corporation', lic: 'Licencia MIT', url: 'github.com/microsoft/fluentui-emoji' },
    { t: 'Efectos de sonido y jingles', who: 'Kenney (Kenney Vleugels)', lic: 'CC0, dominio público', url: 'kenney.nl' },
    { t: 'Música y efectos', who: 'Mixkit', lic: 'Mixkit Free License', url: 'mixkit.co' },
    { t: 'Letras', who: 'Nunito y Alfa Slab One', lic: 'SIL Open Font License 1.1', url: 'fonts.google.com' },
    { t: 'Voces', who: 'Voces neuronales de síntesis (edge-tts)', lic: 'Generadas para esta aplicación' },
    { t: 'Dibujos', who: 'El Quetzal, la Sombra, el mapa y los marcos', lic: 'Hechos para esta aplicación' },
  ];
</script>

<div class="scr scr-bg cr">
  <TopBar title="Créditos" onback={() => nav.back()} />
  <div class="body scroll">
    <Panel padding="26px 34px">
      <p class="lead">La Leyenda del Quetzal se hizo con cariño para aprender español viajando por el mundo hispano.</p>
      <ul>
        {#each ROWS as r}
          <li>
            <b>{r.t}</b>
            <span>{r.who}</span>
            <small>{r.lic}{#if r.url} · {r.url}{/if}</small>
          </li>
        {/each}
      </ul>
      <p class="thx">¡Gracias a todos los que comparten su trabajo!</p>
    </Panel>
  </div>
</div>

<style>
  .cr { z-index: 2; }
  .body { flex: 1; min-height: 0; padding: 6px 60px 30px; }
  .lead { margin: 0 0 14px; font: 800 30px/1.35 var(--q-font-body); color: var(--q-papel); }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
  li { display: grid; gap: 2px; padding: 12px 20px; border-radius: 18px; background: rgba(255, 255, 255, 0.07); }
  li b { font: 400 28px/1.1 var(--q-font-title); color: var(--q-sol); }
  li span { font: 800 26px/1.2 var(--q-font-body); }
  li small { font: 700 20px/1.2 var(--q-font-body); opacity: 0.75; }
  .thx { margin: 16px 0 0; text-align: center; font: 900 28px var(--q-font-body); color: var(--q-turquesa); }
</style>
