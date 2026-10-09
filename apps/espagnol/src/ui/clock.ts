/** Horloge du jeu. `?now=2026-10-28` dans l'URL force la date (tests des evenements, e2e). */
const forced = (() => {
  try {
    const q = new URLSearchParams(location.search).get('now');
    if (q && /^\d{4}-\d{2}-\d{2}/.test(q)) {
      const d = new Date(q.length === 10 ? `${q}T12:00:00` : q);
      if (!Number.isNaN(d.getTime())) return d.getTime() - Date.now();
    }
  } catch {
    /* hors navigateur */
  }
  return null;
})();

export const now = (): Date => new Date(Date.now() + (forced ?? 0));
