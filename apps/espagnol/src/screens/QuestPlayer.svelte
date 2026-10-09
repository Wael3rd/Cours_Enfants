<script lang="ts">
  /** Lecteur de quete : charge l'unite, joue la quete (ou le Desafio) dans la coque `Runner`, puis affiche la fin de quete. */
  import { onMount } from 'svelte';
  import { game } from '../state/game.svelte';
  import { content, loadUnit } from '../engine/data';
  import { completeQuest, type QuestOutcome } from '../engine/progress';
  import type { Quest, Unit } from '../content/schema';
  import { nav } from '../ui/nav.svelte';
  import { regionOf } from '../ui/regions';
  import { sfx } from '../services/sfx';
  import { MAP_ROUTE } from '../art/core/qart.js';
  import Runner, { type RunSummary } from './Runner.svelte';
  import QuestEnd from './QuestEnd.svelte';
  import Icon from '../ui/Icon.svelte';

  let { quest: questId }: { quest: string } = $props();
  let unit = $state<Unit | undefined>();
  let quest = $state<Quest | undefined>();
  let phase = $state<'loading' | 'play' | 'end'>('loading');
  let outcome = $state<QuestOutcome | undefined>();
  let summary = $state<RunSummary | undefined>();
  let attempt = $state(0);
  const from = Number(new URLSearchParams(location.search).get('from') ?? 0) || 0;

  onMount(async () => {
    const uid = content.questUnit.get(questId);
    if (!uid) return nav.back();
    unit = await loadUnit(uid);
    quest = unit.quests.find((q) => q.id === questId);
    phase = 'play';
  });

  function finished(s: RunSummary) {
    if (!quest || !unit) return;
    summary = s;
    const before = unit.quests.every((q) => game.state.quests[q.id]?.done);
    outcome = game.mutate((st) => completeQuest(content, st, quest!.id, s.run));
    void before;
    if (outcome.unitCompleted) {
      // prochaine region sur la route : le jeton y voyagera depuis la carte
      const here = regionOf(unit);
      const i = here ? MAP_ROUTE.indexOf(here) : -1;
      const next = content.main.find((u) => u.numero > unit!.numero);
      const to = next ? regionOf(next) : MAP_ROUTE[i + 1];
      if (here && to && to !== here) game.mutate((st) => (st.flags.travel = `${here}:${to}`));
    }
    phase = 'end';
  }

  function close() {
    sfx('back', 0.6);
    if (outcome?.unitCompleted) nav.go({ name: 'map' }, { root: true });
    else nav.back();
  }
  function retry() {
    attempt += 1;
    phase = 'play';
  }
</script>

{#if phase === 'loading' || !quest || !unit}
  <div class="scr scr-bg load"><Icon name="scroll" size={72} /><p>Cargando…</p></div>
{:else if phase === 'play'}
  {#key attempt}
    <Runner
      title={quest.titulo}
      steps={quest.steps.map((step) => ({ step }))}
      mode={quest.tipo === 'desafio' ? 'boss' : 'quest'}
      boss={quest.jefe ? { vidas: quest.jefe.vidas } : undefined}
      from={attempt === 0 ? from : 0}
      onfinish={finished}
      onexit={() => nav.back()}
    />
  {/key}
{:else if outcome && summary}
  <QuestEnd {quest} {unit} {outcome} {summary} onclose={close} onretry={retry} />
{/if}

<style>
  .load { place-content: center; justify-items: center; gap: 12px; font: 800 30px var(--q-font-body); color: var(--q-papel2); }
</style>
