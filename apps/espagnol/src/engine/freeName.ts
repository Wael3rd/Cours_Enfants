import type { Step } from '../content/schema';

/**
 * Prenom libre : le relecteur peut ajouter un petit champ au schema pour les etapes `speak` / `write_free`.
 * Le nom exact n'est pas fige : on accepte plusieurs graphies. Valeurs possibles :
 *   true            -> les mots capitalises (hors 1er mot) de `objetivo.es` sont des jokers
 *   string          -> ce mot (ou "a b") de `objetivo.es` est un joker
 *   string[]        -> ces mots sont des jokers
 */
const KEYS = ['nombreLibre', 'nombre_libre', 'prenomLibre', 'nombreAbierto', 'libre', 'nombreCualquiera', 'cualquierNombre', 'nombreLibreEs'];

export function freeNameSpec(step: unknown): true | string[] | null {
  const s = step as Record<string, unknown>;
  for (const k of KEYS) {
    const v = s[k];
    if (v === true) return true;
    if (typeof v === 'string' && v) return [v];
    if (Array.isArray(v) && v.length) return v.map(String);
  }
  return null;
}

/** Mots (bruts) de la phrase modele consideres comme jokers de prenom. */
export function freeNameWords(step: Step, phrase: string): string[] {
  const spec = freeNameSpec(step);
  if (!spec) return [];
  if (spec !== true) return spec.flatMap((x) => x.split(/\s+/));
  const words = phrase.split(/\s+/).map((w) => w.replace(/[¿¡?!.,;:]/g, ''));
  return words.slice(1).filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w));
}
