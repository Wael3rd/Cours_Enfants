/** Niveau 2 "Ligue des Champions" : calcul mental a 2 chiffres, genere, suivi par categorie (pas par fait). */
import { int, pick, type Rng } from './rng.ts';

export type MentalCat = 'tens' | 'two-one-plain' | 'two-one-carry' | 'to-ten';
export const MENTAL_CATS: readonly MentalCat[] = ['tens', 'two-one-plain', 'two-one-carry', 'to-ten'];

export const MENTAL_LABELS: Record<MentalCat, string> = {
  tens: 'Dizaines (30 + 40)',
  'two-one-plain': '2 chiffres ± 1 chiffre, sans passage (34 + 5)',
  'two-one-carry': '2 chiffres ± 1 chiffre, avec passage (38 + 7)',
  'to-ten': 'Compléter à la dizaine (37 + ? = 40)',
};

export interface MentalQuestion {
  kind: 'mental';
  id: string; // m:<cat>:<texte>
  cat: MentalCat;
  /** Texte du calcul, ex "38 + 7" ou "37 + ? = 40". */
  text: string;
  op: '+' | '-';
  left: number;
  /** null pour les complements ("37 + ? = 40"). */
  right: number | null;
  answer: number;
  digits: number;
}

export interface MentalStat {
  attempts: number;
  correct: number;
  /** Derniers resultats fluents (true = juste et assez vite), 10 max. */
  recent: boolean[];
  times: number[];
}
export const RECENT_WINDOW = 10;
export const MIN_RECENT = 8;

export const newMentalStat = (): MentalStat => ({ attempts: 0, correct: 0, recent: [], times: [] });
export const newMental = (): Record<MentalCat, MentalStat> =>
  Object.fromEntries(MENTAL_CATS.map((c) => [c, newMentalStat()])) as Record<MentalCat, MentalStat>;

/** Seuil du calcul mental = 2 x seuil des faits. */
export const mentalThreshold = (T: number) => T * 2;

export function recordMental(s: MentalStat, ok: boolean, ms: number, T: number): boolean {
  const fluent = ok && ms <= mentalThreshold(T);
  s.attempts++;
  if (ok) {
    s.correct++;
    s.times.push(ms);
    if (s.times.length > 5) s.times.shift();
  }
  s.recent.push(fluent);
  if (s.recent.length > RECENT_WINDOW) s.recent.shift();
  return fluent;
}

export const mentalRate = (s: MentalStat) => (s.recent.length ? s.recent.filter(Boolean).length / s.recent.length : 0);
export const isMentalFluent = (s: MentalStat) => s.recent.length >= MIN_RECENT && mentalRate(s) >= 0.8;

/** Part de categories fluentes (0..1) : sert de "ratio de zone" pour la zone 10. */
export function mentalZoneRatio(m: Record<MentalCat, MentalStat>): number {
  return MENTAL_CATS.filter((c) => isMentalFluent(m[c])).length / MENTAL_CATS.length;
}

const MINUS = '−';
const q = (cat: MentalCat, op: '+' | '-', left: number, right: number | null, answer: number, text: string): MentalQuestion => ({
  kind: 'mental', id: `m:${cat}:${text}`, cat, text, op, left, right, answer, digits: String(answer).length,
});

export function genMental(rng: Rng, cat: MentalCat): MentalQuestion {
  const op: '+' | '-' = rng.next() < 0.5 ? '+' : '-';
  switch (cat) {
    case 'tens': {
      if (op === '+') {
        const a = int(rng, 1, 9) * 10;
        const b = int(rng, 1, Math.min(9, 10 - a / 10)) * 10;
        return q(cat, op, a, b, a + b, `${a} + ${b}`);
      }
      const a = int(rng, 2, 10) * 10;
      const b = int(rng, 1, a / 10 - 1) * 10;
      return q(cat, op, a, b, a - b, `${a} ${MINUS} ${b}`);
    }
    case 'two-one-plain': {
      const t = int(rng, 1, 9) * 10;
      if (op === '+') {
        const u = int(rng, 0, 7);
        const d = int(rng, 1, 9 - u);
        return q(cat, op, t + u, d, t + u + d, `${t + u} + ${d}`);
      }
      const u = int(rng, 1, 9);
      const d = int(rng, 1, u);
      return q(cat, op, t + u, d, t + u - d, `${t + u} ${MINUS} ${d}`);
    }
    case 'two-one-carry': {
      const t = int(rng, op === '+' ? 1 : 2, 8) * 10;
      if (op === '+') {
        const u = int(rng, 2, 9);
        const d = int(rng, 10 - u, 9);
        return q(cat, op, t + u, d, t + u + d, `${t + u} + ${d}`);
      }
      const u = int(rng, 0, 7);
      const d = int(rng, u + 1, 9);
      return q(cat, op, t + u, d, t + u - d, `${t + u} ${MINUS} ${d}`);
    }
    case 'to-ten': {
      const n = int(rng, 1, 9) * 10 + int(rng, 1, 9);
      const target = Math.ceil(n / 10) * 10;
      return q(cat, '+', n, null, target - n, `${n} + ? = ${target}`);
    }
  }
}

/** Categorie a travailler : ponderee vers les categories les moins fluentes. */
export function pickMentalCat(rng: Rng, m: Record<MentalCat, MentalStat>): MentalCat {
  const w = MENTAL_CATS.map((c) => 0.25 + (1 - mentalRate(m[c])));
  const total = w.reduce((s, x) => s + x, 0);
  let x = rng.next() * total;
  for (let i = 0; i < w.length; i++) {
    x -= w[i];
    if (x < 0) return MENTAL_CATS[i];
  }
  return pick(rng, MENTAL_CATS);
}
