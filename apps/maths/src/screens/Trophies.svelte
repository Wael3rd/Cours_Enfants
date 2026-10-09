<script lang="ts">
  /** Etagere a trophees : une coupe par zone (doree si gagnee, silhouette + jauge sinon) + medailles du Sprint. */
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { sfx } from '../lib/sound.ts';
  import { ZONES, isZoneWon, zoneRatio } from '../engine/index.ts';
  import { trophy } from '../art/core/ceart.js';
  import Stage from '../ui/Stage.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';

  const progress = $derived(app.state.profile.progress);
  const medals = $derived(app.state.profile.rewards.medals);
  const T = $derived(app.state.settings.thresholdMs);
  const won = $derived(ZONES.filter((z) => isZoneWon(progress, z.id)).length);
  const svgs = ZONES.map((z) => trophy({ metal: 'or', width: 400, height: 640, uid: `tz${z.id}` }));
  const shelves = [ZONES.slice(0, 3), ZONES.slice(3, 6), ZONES.slice(6, 9)];
</script>

<Stage bg="linear-gradient(180deg, #14205F, #070C2B)">
  <div class="tr">
    <header>
      <GameButton size="icon" variant="ghost" label="Retour" onclick={() => nav.go('home')}><Icon name="home" size={36} /></GameButton>
      <h1 class="disp">Trophées</h1>
      <div class="count disp num">{won}<small>/ {ZONES.length}</small></div>
      <div class="medals" aria-label="Médailles du sprint">
        <span class="md or"><i></i><b class="disp num">{medals.or}</b></span>
        <span class="md argent"><i></i><b class="disp num">{medals.argent}</b></span>
        <span class="md bronze"><i></i><b class="disp num">{medals.bronze}</b></span>
      </div>
    </header>
    <div class="shelves">
      {#each shelves as row}
        <div class="shelf">
          <div class="items">
            {#each row as z}
              {@const w = isZoneWon(progress, z.id)}
              <button type="button" class="cup" class:locked={!w} aria-label="{z.cup}{w ? '' : ' (à gagner)'}" onclick={() => sfx(w ? 'pop' : 'wrong-soft', 0.5)}>
                <span class="art">{@html svgs[z.id - 1]}</span>
                <span class="nm disp">{z.cup}</span>
                {#if !w}<span class="ring"><i style:width="{Math.round(zoneRatio(progress, z.id, T) * 100)}%"></i></span>{/if}
              </button>
            {/each}
          </div>
          <div class="plank"></div>
        </div>
      {/each}
    </div>
  </div>
</Stage>

<style>
  .tr { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 10px; padding: max(14px, env(safe-area-inset-top)) max(30px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(30px, env(safe-area-inset-left)); }
  header { display: flex; align-items: center; gap: 22px; }
  h1 { margin: 0; font-size: 3.4rem; text-shadow: 0 5px 0 #0A1030; flex: 1; }
  .count { font-size: 3rem; color: var(--jaune); display: flex; align-items: baseline; gap: 6px; }
  .count small { font-size: 1.6rem; opacity: 0.8; }
  .medals { display: flex; gap: 12px; }
  .md { display: flex; align-items: center; gap: 6px; padding: 4px 14px 4px 6px; border-radius: 30px; background: rgba(7, 12, 43, 0.75); font-size: 1.7rem; }
  .md i { width: 34px; height: 34px; border-radius: 50%; border: 4px solid rgba(0, 0, 0, 0.35); }
  .md.or i { background: radial-gradient(circle at 35% 30%, #FFF6BF, #FFD23F 55%, #C28A00); }
  .md.argent i { background: radial-gradient(circle at 35% 30%, #fff, #D6DDEB 55%, #8A95A8); }
  .md.bronze i { background: radial-gradient(circle at 35% 30%, #FFD9B3, #E0975C 55%, #9A5A2B); }
  .shelves { flex: 1; display: grid; grid-template-rows: repeat(3, 1fr); gap: 4px; min-height: 0; }
  .shelf { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 0; }
  .items { display: flex; justify-content: space-around; align-items: flex-end; flex: 1; min-height: 0; padding-bottom: 2px; }
  .cup { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; height: 100%; border: 0; background: none; padding: 0 0 0; cursor: pointer; color: #fff; min-width: 200px; }
  .art { flex: 1; min-height: 0; display: block; line-height: 0; }
  .art :global(svg) { height: 100%; width: auto; max-width: 150px; filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.45)); }
  .cup.locked .art { filter: brightness(0) opacity(0.35); }
  .nm { font-size: 1.15rem; line-height: 1; letter-spacing: 0.03em; }
  .ring { position: absolute; left: 20%; right: 20%; bottom: 22px; height: 9px; border-radius: 5px; background: rgba(255, 255, 255, 0.25); overflow: hidden; }
  .ring i { display: block; height: 100%; background: var(--jaune); }
  .plank { height: 16px; border-radius: 6px; background: linear-gradient(#9A6A3A, #6B4423); box-shadow: 0 8px 14px rgba(0, 0, 0, 0.5), inset 0 3px 0 rgba(255, 255, 255, 0.25); }
</style>
