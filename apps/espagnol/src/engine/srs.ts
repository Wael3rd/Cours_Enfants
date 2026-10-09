import type { SrsCard } from './types';
import { addDays } from './calendar';

/** SM-2 simplifie, intervalles courts au debut (1 j, 3 j) pour un debutant de 12 ans. */
export const MAX_INTERVAL = 180;

export function newCard(today: string): SrsCard {
  return { ef: 2.5, reps: 0, interval: 0, due: today, lapses: 0, seen: 0, wrong: 0, last: today };
}

export const isDue = (c: SrsCard, today: string) => c.due <= today;

/**
 * Qualite 0-5 depuis le credit (0..1) et les pistes.
 *  echec -> 1 ; partiel (accent, presque) ou piste -> 3 ; reussi -> 4 ; reussi sans piste a la 2e+ revision -> 5
 */
export function quality(score: number, hints: number, reps: number): number {
  if (score < 0.5) return 1;
  if (score < 0.99 || hints > 0) return 3;
  return reps >= 1 ? 5 : 4;
}

/** Applique une revision. `q` 0-5. Si la carte n'est pas due, une reussite n'allonge pas l'intervalle. */
export function review(card: SrsCard, q: number, today: string): SrsCard {
  const c = { ...card, seen: card.seen + 1, last: today };
  const due = isDue(card, today);
  if (q < 3) {
    c.wrong += 1;
    c.lapses += due && card.reps > 0 ? 1 : 0;
    c.ef = Math.max(1.3, card.ef - 0.2);
    c.reps = 0;
    c.interval = 0;
    c.due = today; // a revoir dans la session
    return c;
  }
  if (!due) return c; // pratique en cours de quete : pas de gain d'intervalle
  c.ef = Math.max(1.3, card.ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  c.reps = card.reps + 1;
  let interval = c.reps === 1 ? 1 : c.reps === 2 ? 3 : Math.round(Math.max(card.interval, 3) * c.ef);
  if (q === 3 && c.reps > 2) interval = Math.max(3, Math.round(interval * 0.8));
  c.interval = Math.min(MAX_INTERVAL, interval);
  c.due = addDays(today, c.interval);
  return c;
}

/** Introduction d'un element (flashcard / premiere rencontre reussie) : due demain. */
export function introduce(today: string): SrsCard {
  const c = newCard(today);
  c.seen = 1;
  c.reps = 1;
  c.interval = 1;
  c.due = addDays(today, 1);
  return c;
}

/** Maitrise 0..5 : 0 inconnu, 1 decouvert, 2 en apprentissage, 3 connu, 4 solide, 5 maitrise. */
export function mastery(card: SrsCard | undefined): number {
  if (!card) return 0;
  if (card.reps === 0) return 1;
  if (card.interval >= 21 && card.reps >= 4) return 5;
  if (card.interval >= 8) return 4;
  if (card.interval >= 3) return 3;
  return 2;
}

/** Taux d'echec d'un element (mots difficiles). */
export function difficulty(card: SrsCard): number {
  return card.seen ? (card.wrong + card.lapses) / card.seen : 0;
}
