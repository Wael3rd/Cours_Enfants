<script lang="ts">
  /** Avatar : maillots et crampons debloques (etoiles, zones, medailles) ; les autres restent verrouilles avec leur condition en icones. */
  import { app } from '../state/store.svelte.ts';
  import { nav } from '../lib/nav.svelte.ts';
  import { kitColors } from '../lib/kit.ts';
  import { sfx, haptic } from '../lib/sound.ts';
  import { AVATAR_ITEMS, isUnlocked, type AvatarItem } from '../engine/index.ts';
  import Stage from '../ui/Stage.svelte';
  import GameButton from '../ui/GameButton.svelte';
  import Icon from '../ui/Icon.svelte';
  import StadiumBackdrop from '../art/StadiumBackdrop.svelte';
  import Player from '../art/Player.svelte';

  const look = $derived(app.state.look);
  const club = $derived(app.state.club);
  const kit = $derived(kitColors());
  const ctx = $derived({ rewards: app.state.profile.rewards, zonesWon: app.state.profile.progress.zonesWon.map((w) => w.zone) });
  let tab = $state<'jersey' | 'boots'>('jersey');
  let pose = $state<'idle' | 'celebration'>('idle');
  const items = $derived(AVATAR_ITEMS.filter((i) => i.slot === tab));

  function choose(id: string, it?: AvatarItem) {
    if (it && !isUnlocked(it.unlock, ctx)) {
      sfx('wrong-soft', 0.5); haptic('tap');
      return;
    }
    app.setKit(tab, id);
    sfx('item-get', 0.8); haptic('good');
    pose = 'celebration';
    setTimeout(() => (pose = 'idle'), 800);
  }
  const need = (it: AvatarItem) => it.unlock;
</script>

<Stage>
  <StadiumBackdrop />
  <div class="shade"></div>
  <div class="av">
    <header>
      <GameButton size="icon" variant="ghost" label="Retour" onclick={() => nav.go('home')}><Icon name="home" size={36} /></GameButton>
      <h1 class="disp">Mon joueur</h1>
      <div class="tabs">
        <GameButton variant={tab === 'jersey' ? 'go' : 'ghost'} size="md" onclick={() => (tab = 'jersey')}><Icon name="shirt" size={36} />Maillots</GameButton>
        <GameButton variant={tab === 'boots' ? 'go' : 'ghost'} size="md" onclick={() => (tab = 'boots')}><Icon name="sprint" size={36} />Crampons</GameButton>
      </div>
    </header>
    <div class="body">
      <div class="stage"><Player primary={kit.primary} secondary={kit.secondary} shoe={kit.shoe} skin={look.skin} hair={look.hair} hairColor={look.hairColor} number={look.number} {pose} width={360} /></div>
      <div class="items" role="list">
        {#if tab === 'jersey'}
          <button type="button" class="it" class:sel={kit.jerseyId === 'club'} role="listitem" aria-label="Maillot du club" onclick={() => choose('club')}>
            <span class="swatch" style:background="linear-gradient(135deg, {club.primary} 55%, {club.secondary} 55%)"></span>
            <span class="nm disp">Mon club</span>
          </button>
        {/if}
        {#each items as it (it.id)}
          {@const open = isUnlocked(it.unlock, ctx)}
          <button type="button" class="it" class:sel={tab === 'jersey' ? kit.jerseyId === it.id : kit.bootsId === it.id} class:locked={!open} role="listitem" aria-label={it.name} onclick={() => choose(it.id, it)}>
            <span class="swatch" style:background="linear-gradient(135deg, {it.colors[0]} 55%, {it.colors[1]} 55%)"></span>
            <span class="nm disp">{it.name}</span>
            {#if !open}
              <span class="need">
                <Icon name="lock" size={26} />
                {#if need(it).type === 'stars'}<Icon name="star" size={26} /><b class="disp num">{(need(it) as { n: number }).n}</b>
                {:else if need(it).type === 'zone'}<Icon name="trophy" size={26} /><b class="disp num">{(need(it) as { zone: number }).zone}</b>
                {:else if need(it).type === 'medal'}<Icon name="sprint" size={26} /><b class="disp">{(need(it) as { medal: string }).medal}</b>{/if}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</Stage>

<style>
  .shade { position: absolute; inset: 0; background: linear-gradient(rgba(7, 12, 43, 0.6), rgba(7, 12, 43, 0.82)); }
  .av { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 10px; padding: max(14px, env(safe-area-inset-top)) max(30px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(30px, env(safe-area-inset-left)); }
  header { display: flex; align-items: center; gap: 22px; }
  h1 { margin: 0; font-size: 3.4rem; text-shadow: 0 5px 0 #0A1030; flex: 1; }
  .tabs { display: flex; gap: 14px; }
  .body { flex: 1; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 30px; min-height: 0; }
  .stage { display: grid; place-items: center; filter: drop-shadow(0 18px 14px rgba(0, 0, 0, 0.45)); }
  .items { align-self: center; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-height: 100%; overflow-y: auto; overscroll-behavior: contain; touch-action: pan-y; padding: 8px 4px 14px; }
  .it { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 8px 12px; min-height: 140px; border: 4px solid rgba(255, 255, 255, 0.35); border-radius: 20px; color: #fff; cursor: pointer; background: rgba(14, 26, 85, 0.85); box-shadow: 0 7px 0 #0A1030; transition: transform 140ms var(--ease-pop); }
  .it:active { transform: translateY(5px); transition: none; }
  .it.sel { border-color: var(--jaune); background: rgba(255, 210, 63, 0.2); }
  .it.locked { opacity: 0.6; }
  .swatch { width: 70px; height: 70px; border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.85); }
  .nm { font-size: 1.15rem; line-height: 1.05; text-align: center; }
  .need { display: flex; align-items: center; gap: 4px; font-size: 1.3rem; }
</style>
