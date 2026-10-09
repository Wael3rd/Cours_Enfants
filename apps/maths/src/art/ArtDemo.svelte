<script lang="ts">
  // Page de demo TEMPORAIRE du kit graphique (acces : /maths/#art). Charge a la demande depuis App.svelte.
  import '../../../../assets/fonts/fonts.css';
  import { playCinematic } from '@ce/core';
  import Player from './Player.svelte';
  import Keeper from './Keeper.svelte';
  import Coach from './Coach.svelte';
  import Crest from './Crest.svelte';
  import Ball from './Ball.svelte';
  import GoalNet from './GoalNet.svelte';
  import StadiumBackdrop from './StadiumBackdrop.svelte';
  import ScoreBug from './ScoreBug.svelte';
  import LowerThird from './LowerThird.svelte';
  import PlayerCard from './PlayerCard.svelte';

  const poses = ['idle', 'course', 'frappe', 'celebration', 'decu'] as const;
  const hairs = ['court', 'boucles', 'pique', 'long'] as const;
  const kits = ['uni', 'rayures', 'cerceaux', 'bande'] as const;
  let pose = $state<(typeof poses)[number]>('idle');
  let hair = $state<(typeof hairs)[number]>('court');
  let kit = $state<(typeof kits)[number]>('rayures');
  let skin = $state(1);
  let hairColor = $state(0);
  let primary = $state('#E8212F');
  let secondary = $state('#FFFFFF');
  let number = $state(10);

  const lions = { name: 'Les Lions', primary: '#E8212F', secondary: '#FFFFFF', initials: 'LB' };
  const aigles = { name: 'Les Aigles', primary: '#1B6BFF', secondary: '#FFD23F', initials: 'AZ' };
  const base = import.meta.env.BASE_URL + 'cinematics/';
  const aig = { name: 'Les Aigles', primary: '#1B6BFF', secondary: '#FFD23F', initials: 'AZ' };
  // Donnees d'exemple (differentes des defauts) : verifie aussi le chemin setRuntimeData -> re-rendu de la composition.
  const cines: { id: string; label: string; data: Record<string, unknown> }[] = [
    { id: 'intro-club', label: 'Intro club', data: { name: 'Inès', club: aig } },
    { id: 'match-intro', label: 'Match', data: { home: aig, away: lions } },
    { id: 'goal', label: 'But', data: { name: 'Inès', calc: '9 + 6 = 15', time: '1,4 s', scoreHome: 2, scoreAway: 1 } },
    { id: 'full-time', label: 'Fin de match (défaite)', data: { home: lions, away: aigles, scoreHome: 1, scoreAway: 2, win: false, goals: 2, avgTime: '2,3 s', bestStreak: 3, stars: 1 } },
    { id: 'trophy', label: 'Trophée', data: { competition: 'Coupe du +10', name: 'Inès' } },
    { id: 'card-pack', label: 'Paquet (légende)', data: { card: { name: 'Inès', number: 7, position: 'MIL', rarity: 'legende', primary: '#8A2BE2', secondary: '#FFD23F' } } },
    { id: 'medal', label: 'Médaille (record)', data: { medal: 'argent', time: '14,8 s', record: true } },
  ];
  const play = (c: (typeof cines)[number]) => playCinematic({ src: `${base}${c.id}/index.html`, data: { [c.id]: c.data } });
  const back = () => { location.hash = ''; location.reload(); };
</script>

<div class="demo">
  <StadiumBackdrop />
  <div class="scroll">
    <header>
      <h1>Kit graphique</h1>
      <button class="ghost" onclick={back}>Retour</button>
    </header>

    <section>
      <h2>Footballeur</h2>
      <div class="row">
        <Player {primary} {secondary} {pose} {hair} {kit} {skin} {hairColor} {number} motion={pose === 'course' ? 'run' : 'idle'} width={230} />
        <div class="ctl">
          <div class="chips">{#each poses as p}<button class:on={pose === p} onclick={() => (pose = p)}>{p}</button>{/each}</div>
          <div class="chips">{#each hairs as h}<button class:on={hair === h} onclick={() => (hair = h)}>{h}</button>{/each}</div>
          <div class="chips">{#each kits as k}<button class:on={kit === k} onclick={() => (kit = k)}>{k}</button>{/each}</div>
          <div class="chips">peau {#each [0, 1, 2, 3, 4, 5] as s}<button class:on={skin === s} onclick={() => (skin = s)}>{s}</button>{/each}</div>
          <div class="chips">cheveux {#each [0, 1, 2, 3, 4, 5, 6] as s}<button class:on={hairColor === s} onclick={() => (hairColor = s)}>{s}</button>{/each}</div>
          <label>maillot <input type="color" bind:value={primary} /> <input type="color" bind:value={secondary} /> n° <input type="number" min="1" max="99" bind:value={number} /></label>
        </div>
        <Keeper width={200} number={1} />
        <Keeper width={200} pose="plongeon" primary="#FF8A1F" />
        <Coach width={200} />
      </div>
    </section>

    <section>
      <h2>Blasons, ballon, cage</h2>
      <div class="row">
        <Crest primary="#E8212F" secondary="#FFFFFF" initials="LB" width={110} />
        <Crest primary="#1B6BFF" secondary="#FFD23F" initials="AZ" width={110} />
        <Crest primary="#17B26A" secondary="#0A1030" initials="VRT" width={110} />
        <Crest primary="#FFD23F" secondary="#0A1030" initials="OR" width={110} />
        <Crest primary="#8A2BE2" secondary="#FFFFFF" initials="PX" width={110} />
        <Ball width={96} spin />
        <GoalNet width={360} />
      </div>
    </section>

    <section>
      <h2>Habillage TV</h2>
      <div class="col">
        <ScoreBug home={lions} away={aigles} scoreHome={2} scoreAway={1} clock="02:14" width={620} />
        <LowerThird title="LÉO" subtitle="7 + 8 = 15  ·  1,8 s" badge="10" width={620} />
      </div>
    </section>

    <section>
      <h2>Cartes joueurs</h2>
      <div class="row">
        <PlayerCard rarity="bronze" name="Léo Martin" number={10} position="ATT" player={{ hair: 'pique', skin: 2, hairColor: 3 }} />
        <PlayerCard rarity="argent" name="Inès" number={7} position="MIL" primary="#1B6BFF" secondary="#FFD23F" player={{ hair: 'long', skin: 4, hairColor: 5 }} />
        <PlayerCard rarity="or" name="Maxime" number={9} position="ATT" primary="#17B26A" secondary="#FFFFFF" player={{ hair: 'boucles', skin: 0, hairColor: 2 }} />
        <PlayerCard rarity="legende" name="Capitaine Zéro" number={1} position="GAR" primary="#8A2BE2" secondary="#FFD23F" player={{ hair: 'court', skin: 3, hairColor: 6 }} />
      </div>
    </section>

    <section>
      <h2>Cinématiques</h2>
      <div class="chips big">{#each cines as c}<button onclick={() => play(c)}>{c.label}</button>{/each}</div>
    </section>
  </div>
</div>

<style>
  .demo { position: fixed; inset: 0; color: #fff; font-family: 'Fredoka', system-ui, sans-serif; }
  .scroll { position: absolute; inset: 0; overflow-y: auto; padding: 16px 24px 80px; background: linear-gradient(#0A103088, #0A1030cc 40%); }
  header { display: flex; align-items: center; justify-content: space-between; }
  h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: 3rem; margin: 0; letter-spacing: 2px; }
  h2 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: 1.8rem; margin: 28px 0 10px; letter-spacing: 1px; color: #FFD23F; }
  .row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 22px; }
  .col { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
  .ctl { display: flex; flex-direction: column; gap: 8px; min-width: 260px; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  button { min-height: 44px; padding: 0 16px; border: 0; border-radius: 12px; font: inherit; font-weight: 600; color: #fff; background: #1B2C86; }
  button.on { background: #FFD23F; color: #0A1030; }
  .big button { min-height: 64px; padding: 0 26px; font-size: 1.2rem; background: #E8212F; }
  .ghost { background: #ffffff22; }
  input[type='number'] { width: 64px; min-height: 40px; border-radius: 8px; border: 0; padding: 0 8px; }
</style>
