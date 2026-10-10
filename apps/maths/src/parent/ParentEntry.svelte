<script lang="ts">
  /** Porte de l'espace parent : toucher (ParentGate) + petit calcul de grand. */
  import { ParentGate, Modal } from '@ce/core';
  import ParentSpace from './ParentSpace.svelte';

  let askOpen = $state(false);
  let spaceOpen = $state(false);
  let a = $state(7), b = $state(8);
  let value = $state('');
  let wrong = $state(false);

  function newQuestion() {
    a = 6 + Math.floor(Math.random() * 4); // 6..9
    b = 12 + Math.floor(Math.random() * 8); // 12..19
    value = '';
  }
  function onpass() {
    newQuestion();
    wrong = false;
    askOpen = true;
  }
  function submit(e: Event) {
    e.preventDefault();
    if (Number(value) === a * b) {
      askOpen = false;
      spaceOpen = true;
    } else {
      wrong = true;
      newQuestion();
    }
  }
</script>

<div class="entry"><ParentGate {onpass} label="Espace parent" /></div>

<Modal bind:open={askOpen} title="Espace parent">
  <form class="calc" onsubmit={submit}>
    <label for="parent-calc">Pour entrer, combien font <strong>{a} × {b}</strong> ?</label>
    <input id="parent-calc" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value />
    {#if wrong}<p class="err" role="alert">Ce n'est pas ça, essayez ce nouveau calcul.</p>{/if}
    <button type="submit">Entrer</button>
  </form>
</Modal>

{#if spaceOpen}<ParentSpace onclose={() => (spaceOpen = false)} />{/if}

<style>
  .entry { opacity: 0.55; }
  .calc { display: grid; gap: 14px; min-width: 260px; -webkit-user-select: text; user-select: text; }
  label { font-size: 1.15rem; }
  input { min-height: 56px; border-radius: 12px; border: 0; padding: 0 16px; font: inherit; font-size: 1.5rem; color: #0b1b3a; background: #fff; }
  button { min-height: 56px; border-radius: 12px; border: 0; font: inherit; font-size: 1.1rem; font-weight: 700; background: #ffd23f; color: #0b1b3a; cursor: pointer; }
  .err { margin: 0; color: #ffb4b4; }
</style>
