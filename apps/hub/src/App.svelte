<script lang="ts">
  import { UpdateToast, type Updater } from '@ce/core';

  let { updater }: { updater: Updater } = $props();
  const base = import.meta.env.BASE_URL;
</script>

<main>
  <h1>Cours Enfants</h1>
  <nav>
    <a class="card maths" href="{base}maths/">
      <strong>Calcul Champion</strong>
      <span>Tables d'addition</span>
    </a>
    <a class="card espagnol" href="{base}espagnol/">
      <strong>La Leyenda del Quetzal</strong>
      <span>Espagnol</span>
    </a>
  </nav>
</main>

<UpdateToast {updater} />

<style>
  main {
    height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 32px;
    padding: env(safe-area-inset-top) 24px env(safe-area-inset-bottom);
    background: linear-gradient(160deg, #13294f, #0b1b3a 60%);
  }
  h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.2rem); }
  nav { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
  .card {
    display: flex; flex-direction: column; gap: 6px; justify-content: center;
    width: 300px; min-height: 160px; padding: 20px 26px; border-radius: 24px;
    color: #fff; text-decoration: none; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.35);
  }
  .card:active { transform: translateY(6px); box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35); }
  .card strong { font-size: 1.6rem; }
  .card span { opacity: 0.8; font-size: 1.1rem; }
  .maths { background: #0a6b30; }
  .espagnol { background: #7a1f2b; }
</style>
