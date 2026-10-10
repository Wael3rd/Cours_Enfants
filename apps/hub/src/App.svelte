<script lang="ts">
  import { UpdateToast, type Updater } from '@ce/core';
  // Kits d'illustration des apps, importés par chemin relatif (pas de copie).
  // @ts-ignore kits JS sans types
  import { bust } from '../../maths/src/art/core/ceart.js';
  // @ts-ignore kits JS sans types
  import { quetzal, papelPicado, azulejoFrieze } from '../../espagnol/src/art/core/qart.js';
  import stadiumUrl from './stadium.webp';

  let { updater }: { updater: Updater } = $props();
  const LICENSES = 'https://github.com/Wael3rd/Cours_Enfants/blob/main/assets/LICENSES.md';

  const striker = bust({ primary: '#1B6BFF', secondary: '#FFD23F', pose: 'idle', kit: 'bande', number: 10, skin: 2, hairColor: 1, expr: 'joy' });
  const bird = quetzal({ uid: 'hubqz', width: 600, height: 720 });
  const bunting = papelPicado({ w: 1920, h: 190, n: 10, sag: 34, seed: 11 });
  const frieze = azulejoFrieze({ w: 1920, region: 'madrid', uid: 'hubfz', pennants: false });
</script>

<main>
  <header>
    <h1>Qui joue aujourd'hui ?</h1>
    <p>Choisis ton aventure et c'est parti.</p>
  </header>

  <nav class="cards" aria-label="Applications">
    <a class="card maths" href="https://calcul-champion.wael3rd.pages.dev/" style="--i:0">
      <div class="bg stadium" style="background-image:url({stadiumUrl})" aria-hidden="true"></div>
      <div class="bg shade" aria-hidden="true"></div>
      <div class="pitch" aria-hidden="true"></div>
      <div class="hero" aria-hidden="true">{@html striker}</div>
      <div class="text">
        <strong>Calcul Champion</strong>
        <span>Les tables d'addition, comme un match de foot</span>
        <em>Jouer</em>
      </div>
    </a>

    <a class="card espagnol" href="https://quetzal.wael3rd.pages.dev/" style="--i:1">
      <div class="bg dusk" aria-hidden="true"></div>
      <div class="bunting" aria-hidden="true">{@html bunting}</div>
      <svg class="trail" viewBox="0 0 400 200" aria-hidden="true" preserveAspectRatio="none">
        <path d="M10 170 C80 90 120 190 200 110 S330 60 390 30" fill="none" stroke="#F5E6C8" stroke-width="5" stroke-dasharray="3 14" stroke-linecap="round" />
      </svg>
      <div class="hero" aria-hidden="true">{@html bird}</div>
      <div class="frieze" aria-hidden="true">{@html frieze}</div>
      <div class="text">
        <strong>La Leyenda del Quetzal</strong>
        <span>Une aventure pour parler espagnol</span>
        <em>Partir</em>
      </div>
    </a>

    <a class="card calcul" href="https://calcul.wael3rd.pages.dev/" style="--i:2">
      <div class="text">
        <strong>Calcul — Entraînement</strong>
        <span>Additions et soustractions, sans histoire ni décor</span>
        <em>S'entraîner</em>
      </div>
    </a>
  </nav>

  <aside class="install">
    <h2>Installer sur la tablette</h2>
    <ol>
      <li>Ouvre un des liens ci-dessus dans Chrome.</li>
      <li>Touche le menu <b>⋮</b> en haut à droite.</li>
      <li>Choisis <b>Installer l'application</b>.</li>
    </ol>
    <p>Chaque jeu a son propre lien : installe-les un par un.</p>
  </aside>

  <footer>
    Images, sons et polices sont libres de droits.
    <a href="{LICENSES}" target="_blank" rel="noopener">Licences</a>
    et écran Crédits de chaque jeu.
  </footer>
</main>

<UpdateToast {updater} />

<style>
  main {
    height: 100%; overflow-y: auto; overflow-x: hidden;
    display: flex; flex-direction: column; align-items: center; gap: clamp(14px, 2.4vh, 26px);
    padding: calc(env(safe-area-inset-top) + 18px) clamp(14px, 3vw, 40px) calc(env(safe-area-inset-bottom) + 14px);
    background: radial-gradient(120% 80% at 50% -10%, #1d3a78 0%, #0b1b3a 60%) fixed;
    font-family: 'Nunito', system-ui, sans-serif;
  }
  header { text-align: center; }
  h1 { margin: 0; font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: clamp(1.9rem, 4.6vw, 3.1rem); letter-spacing: 0.01em; }
  header p { margin: 4px 0 0; font-size: clamp(1rem, 2vw, 1.3rem); opacity: 0.8; }

  .cards { width: 100%; max-width: 1180px; flex: 1 0 auto; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr auto; gap: clamp(14px, 2.4vw, 30px); min-height: min(52vh, 520px); }
  .card {
    position: relative; overflow: hidden; isolation: isolate; display: block;
    min-height: 300px; border-radius: 32px; color: #fff; text-decoration: none;
    box-shadow: 0 10px 0 rgba(0, 0, 0, 0.35), 0 24px 40px rgba(0, 0, 0, 0.3);
    animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; animation-delay: calc(var(--i) * 0.12s);
    transition: transform 0.12s, box-shadow 0.12s;
  }
  .card:active { transform: translateY(7px); box-shadow: 0 3px 0 rgba(0, 0, 0, 0.35); }
  .card:focus-visible { outline: 4px solid #FFD23F; outline-offset: 4px; }
  .card > * { position: absolute; }
  .bg { inset: 0; z-index: -3; }

  .text { z-index: 3; left: 0; bottom: 0; right: 42%; padding: clamp(16px, 2.6vw, 30px); display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
  .text strong { font-size: clamp(1.7rem, 3.6vw, 2.7rem); line-height: 1.02; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.35); }
  .text span { font-size: clamp(0.95rem, 1.7vw, 1.2rem); font-weight: 700; opacity: 0.92; max-width: 22ch; }
  .text em {
    font-style: normal; font-family: 'Lilita One', sans-serif; font-size: 1.4rem; margin-top: 6px;
    min-height: 64px; min-width: 150px; padding: 0 30px; display: inline-flex; align-items: center; justify-content: center;
    border-radius: 999px; box-shadow: 0 5px 0 rgba(0, 0, 0, 0.3);
  }

  .hero { z-index: 2; right: 2%; bottom: 0; width: 46%; height: 92%; animation: bob 5.5s ease-in-out infinite; transform-origin: 50% 100%; }
  .hero :global(svg) { width: 100%; height: 100%; display: block; }

  /* Calcul Champion : stade, vert / bleu nuit / jaune */
  .maths .text strong { font-family: 'Lilita One', sans-serif; font-weight: 400; color: #FFD23F; }
  .maths .text em { background: #FFD23F; color: #0A1030; }
  .stadium { background-color: #070C2B; background-position: center 30%; background-size: cover; transform-origin: 50% 40%; animation: drift 26s ease-in-out infinite alternate; }
  .shade { z-index: -2; background: linear-gradient(90deg, rgba(7, 12, 43, 0.88) 0%, rgba(7, 12, 43, 0.45) 55%, rgba(7, 12, 43, 0.15) 100%); }
  .pitch { z-index: -1; left: 0; right: 0; bottom: 0; height: 22%; background: repeating-linear-gradient(90deg, #0F8F42 0 9%, #0B6B31 9% 18%); border-top: 4px solid #F7F9FF; opacity: 0.95; }
  .maths .hero { width: 40%; right: 4%; height: 84%; bottom: 8%; }

  /* La Leyenda del Quetzal : indigo / terracotta, papel picado, azulejos */
  .espagnol .text strong { font-family: 'Alfa Slab One', serif; font-weight: 400; color: #F5E6C8; font-size: clamp(1.5rem, 3.1vw, 2.3rem); }
  .espagnol .text em { background: #C9573B; color: #F5E6C8; }
  .dusk { background: radial-gradient(90% 70% at 70% 40%, #2B318A 0%, #1D2160 45%, #14173F 100%); }
  .bunting { z-index: -1; top: 0; left: 0; right: 0; opacity: 0.95; transform-origin: 50% 0; animation: sway 7s ease-in-out infinite alternate; }
  .bunting :global(svg) { width: 100%; height: auto; display: block; }
  .trail { z-index: -1; left: 4%; top: 24%; width: 52%; height: 38%; opacity: 0.5; }
  .frieze { z-index: 1; left: 0; right: 0; bottom: 0; }
  .frieze :global(svg) { width: 100%; height: auto; display: block; }
  .espagnol .hero { width: 40%; height: 86%; right: 3%; bottom: 8%; }

  /* Entraînement simple : carte sobre, sans décor */
  .calcul { grid-column: 1 / -1; min-height: 0; background: #F6F3EA; color: #1B2430; box-shadow: 0 6px 0 rgba(0, 0, 0, 0.3); }
  .calcul .text { position: static; padding: clamp(16px, 2.2vw, 26px); }
  .calcul .text strong { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: clamp(1.5rem, 3vw, 2.2rem); color: #1D4ED8; text-shadow: none; }
  .calcul .text span { max-width: none; color: #55606E; opacity: 1; }
  .calcul .text em { background: #2563EB; color: #fff; box-shadow: none; font-family: 'Fredoka', sans-serif; font-weight: 600; }
  .calcul:active { box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3); }

  .install {
    width: 100%; max-width: 1180px; padding: 14px clamp(16px, 2.4vw, 28px); border-radius: 24px;
    background: rgba(255, 255, 255, 0.08); border: 2px dashed rgba(255, 255, 255, 0.28);
  }
  .install h2 { margin: 0 0 6px; font-family: 'Fredoka', sans-serif; font-size: 1.25rem; }
  .install ol { margin: 0; padding-left: 1.3em; display: flex; flex-wrap: wrap; gap: 4px 36px; font-size: 1.02rem; line-height: 1.5; }
  .install p { margin: 6px 0 0; font-size: 0.95rem; opacity: 0.75; }

  footer { max-width: 1180px; text-align: center; font-size: 0.82rem; opacity: 0.6; padding-bottom: 4px; }
  footer a { color: inherit; text-underline-offset: 3px; }

  /* Portrait / petit écran : cartes empilées */
  @media (max-aspect-ratio: 1/1), (max-width: 720px) {
    .cards { grid-template-columns: 1fr; grid-template-rows: none; min-height: 0; }
    .card { min-height: clamp(250px, 34vh, 380px); }
    .maths .hero { width: 30%; height: 80%; }
    .espagnol .hero { width: 32%; }
  }
  @media (max-width: 480px) {
    .text { right: 40%; }
    .maths .hero, .espagnol .hero { width: 36%; }
    .maths .text strong { font-size: 1.5rem; }
    .text span { font-size: 0.9rem; }
    .text em { min-width: 120px; padding: 0 22px; }
  }

  /* Mouvement sûr : transform/opacity seulement, lent, sans flash */
  @keyframes rise { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: none; } }
  @keyframes bob { 0%, 100% { transform: translateY(0) rotate(-0.6deg); } 50% { transform: translateY(-10px) rotate(0.6deg); } }
  @keyframes sway { from { transform: rotate(-0.7deg); } to { transform: rotate(0.7deg); } }
  @keyframes drift { from { transform: scale(1); } to { transform: scale(1.08); } }
  @media (prefers-reduced-motion: reduce) {
    .card, .hero, .bunting, .stadium { animation: none; }
  }
</style>
