<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, UpdateToast, createStore, playCinematic, preloadCinematic, pop, gsap, type Updater } from '@ce/core';

  let { updater }: { updater: Updater } = $props();

  const store = createStore({ name: 'maths', version: 1, defaults: () => ({ childName: 'Léo' }) });
  const CINE = `${import.meta.env.BASE_URL}cinematics/proof-goal/index.html`;

  let childName = $state('Léo');
  let status = $state('');
  let title: HTMLElement | undefined = $state();

  onMount(async () => {
    childName = (await store.load()).childName;
    void preloadCinematic(CINE);
    if (title) gsap.from(title, { y: -40, opacity: 0, duration: 0.6, ease: 'cePunch' });
  });

  const saveName = () => store.save({ childName });

  async function testCinematic() {
    status = '';
    if (title) pop(title);
    await saveName();
    const result = await playCinematic({
      src: CINE,
      data: { goal: { name: childName.trim() || 'Léo', calc: '8 + 6 = 14' } },
    });
    status = `Cinématique : ${result}`;
  }
</script>

<main>
  <h1 bind:this={title}>Calcul Champion</h1>
  <p class="sub">Les tables d'addition, version foot</p>

  <label class="name">
    <span>Prénom</span>
    <input id="child-name" bind:value={childName} onchange={saveName} maxlength="16" autocomplete="off" />
  </label>

  <Button size="xl" onclick={testCinematic}>Tester la cinématique</Button>
  <p id="status" class="status" role="status">{status}</p>
</main>

<UpdateToast {updater} />

<style>
  main {
    height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
    padding: env(safe-area-inset-top) 24px env(safe-area-inset-bottom);
    background: radial-gradient(ellipse at 50% 70%, #12a34a 0%, #0a6b30 50%, #06210f 100%);
  }
  h1 { margin: 0; font-size: clamp(2.4rem, 7vw, 4.5rem); text-shadow: 0 6px 0 #0b1b3a; }
  .sub { margin: 0; opacity: 0.85; font-size: 1.3rem; }
  .name { display: flex; align-items: center; gap: 14px; font-size: 1.3rem; font-weight: 700; }
  .name input {
    width: 240px; min-height: 64px; padding: 0 18px; border: 0; border-radius: 16px;
    font: inherit; font-size: 1.6rem; color: #0b1b3a; background: #fff;
    -webkit-user-select: text; user-select: text;
  }
  .status { min-height: 1.5em; margin: 0; opacity: 0.8; }
</style>
