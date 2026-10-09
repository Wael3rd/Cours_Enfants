import type { Content, GameState, ItemKey, StepResult } from './types';
import type { Step, Vocab, ListenChooseStep, DictadoStep, MatchImageStep, FlashcardStep } from '../content/schema';
import { consignaFor, phraseSteps, vocabVoice } from './content';
import { ymd } from './calendar';
import { currentUnit } from './progress';
import { isDue, mastery } from './srs';

/** Petit PRNG deterministe (mulberry32) seede par une chaine. */
export function rng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface MissionExercise {
  /** Etape jouable par les composants d'ecran habituels (ids `gen:...` pour les exercices generes). */
  step: Step;
  kind: 'new' | 'review';
  /** Elements SRS concernes (mis a jour via result.items par applyStepResult) */
  items: ItemKey[];
}

export interface Mission {
  date: string;
  exercises: MissionExercise[];
  dueCount: number;
  newCount: number;
  /** duree estimee en minutes */
  minutes: number;
}

export interface MissionOptions {
  now?: Date;
  /** nombre d'exercices cible (~20 s chacun => 15 = 5 min) */
  target?: number;
  /** nouveaux mots maximum */
  newMax?: number;
  /** la reconnaissance vocale est-elle disponible ? (sinon pas de `speak` dans la mission) */
  speech?: boolean;
}

const SECONDS_PER_EXERCISE = 20;

function habla(v: Vocab) {
  return { es: v.es, voz: vocabVoice(v), audio: v.audio };
}

/** Exercices generes a partir d'un mot. */
export function vocabExercise(c: Content, v: Vocab, level: number, pool: Vocab[], r: () => number): Step {
  const distractors = (n: number) => {
    const same = pool.filter((p) => p.id !== v.id && p.tags.some((t) => v.tags.includes(t)));
    const other = pool.filter((p) => p.id !== v.id && !same.includes(p));
    return [...shuffle(same, r), ...shuffle(other, r)].slice(0, n);
  };
  const id = `gen:${v.id}:${level}`;
  if (level >= 3) {
    const s: DictadoStep = { id, tipo: 'dictado', consigna: consignaFor(c, 'dictado'), habla: habla(v), respuesta: v.es };
    return s;
  }
  const modo: 'imagen' | 'texto' = level <= 1 ? 'imagen' : 'texto';
  const ds = distractors(3);
  const opciones = shuffle(
    [
      modo === 'imagen' ? { vocab: v.id, correcta: true } : { texto: v.es, correcta: true },
      ...ds.map((d) => (modo === 'imagen' ? { vocab: d.id, correcta: false } : { texto: d.es, correcta: false })),
    ],
    r,
  );
  const s: ListenChooseStep = { id, tipo: 'listen_choose', consigna: consignaFor(c, 'listen_choose'), habla: habla(v), modo, opciones };
  return s;
}

function matchExercise(c: Content, vs: Vocab[], tag: string): MatchImageStep {
  return { id: `gen:match:${tag}`, tipo: 'match_image', consigna: consignaFor(c, 'match_image'), pares: vs.map((v) => ({ vocab: v.id })) };
}

function dueKeys(s: GameState, today: string): ItemKey[] {
  return Object.entries(s.srs)
    .filter(([, card]) => isDue(card, today) && card.reps >= 0 && card.seen > 0)
    .sort(([, a], [, b]) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.ef - b.ef))
    .map(([k]) => k);
}

/**
 * Construit la "Mision del dia" (~5 min) : d'abord les elements dus (les plus en retard d'abord), puis les nouveaux
 * mots de l'unite en cours (flashcards + exercice de verification). Deterministe pour un jour donne.
 */
export function buildMission(c: Content, s: GameState, o: MissionOptions = {}): Mission {
  const now = o.now ?? new Date();
  const today = ymd(now);
  const target = o.target ?? 15;
  const newMax = o.newMax ?? 4;
  const r = rng(`mision:${today}:${Object.keys(s.srs).length}`);
  const phrases = phraseSteps(c);
  const exercises: MissionExercise[] = [];
  const discoveredVocab = [...c.vocab.values()].filter((v) => s.discovered[v.id]);
  const poolOrAll = discoveredVocab.length >= 4 ? discoveredVocab : [...c.vocab.values()];

  // 1. dus
  const dues = dueKeys(s, today);
  const matchBucket: Vocab[] = [];
  let dueCount = 0;
  for (const key of dues) {
    if (exercises.length >= target - 1) break;
    const card = s.srs[key];
    const m = mastery(card);
    if (key.startsWith('v:')) {
      const v = c.vocab.get(key.slice(2));
      if (!v) continue;
      dueCount++;
      if (m === 2 && matchBucket.length < 4) {
        matchBucket.push(v);
        continue;
      }
      exercises.push({ step: vocabExercise(c, v, m, poolOrAll, r), kind: 'review', items: [key] });
    } else if (key.startsWith('p:')) {
      const p = phrases.get(key.slice(2));
      const step = (m >= 3 && o.speech !== false ? p?.speak : undefined) ?? p?.reorder ?? p?.speak;
      if (!step || (step.tipo === 'speak' && o.speech === false)) continue;
      dueCount++;
      exercises.push({ step, kind: 'review', items: [key] });
    } else if (key.startsWith('g:')) {
      const e = c.steps.get(key.slice(2));
      if (!e) continue;
      dueCount++;
      exercises.push({ step: e.step, kind: 'review', items: [key] });
    }
  }
  if (matchBucket.length >= 3) {
    exercises.push({ step: matchExercise(c, matchBucket, today), kind: 'review', items: matchBucket.map((v) => `v:${v.id}`) });
  } else {
    for (const v of matchBucket) exercises.push({ step: vocabExercise(c, v, 2, poolOrAll, r), kind: 'review', items: [`v:${v.id}`] });
  }

  // 2. nouveaux mots de l'unite en cours
  let newCount = 0;
  const unit = currentUnit(c, s);
  if (unit) {
    const fresh = unit.vocab.filter((v) => !s.discovered[v.id] && !s.srs[`v:${v.id}`]).slice(0, Math.max(0, Math.min(newMax, target - exercises.length)));
    for (let i = 0; i < fresh.length; i += 3) {
      const grp = fresh.slice(i, i + 3);
      const fc: FlashcardStep = { id: `gen:flash:${grp[0].id}`, tipo: 'flashcard', vocab: grp.map((v) => v.id) };
      exercises.push({ step: fc, kind: 'new', items: grp.map((v) => `v:${v.id}`) });
      for (const v of grp) exercises.push({ step: vocabExercise(c, v, 1, [...unit.vocab, ...poolOrAll], r), kind: 'new', items: [`v:${v.id}`] });
      newCount += grp.length;
    }
  }

  // 3. complement : si trop court, reviser les elements les plus proches de l'echeance
  if (exercises.length < 6) {
    const soon = Object.entries(s.srs)
      .filter(([k, card]) => !dues.includes(k) && k.startsWith('v:') && card.seen > 0)
      .sort(([, a], [, b]) => (a.due < b.due ? -1 : 1))
      .slice(0, 6 - exercises.length);
    for (const [k, card] of soon) {
      const v = c.vocab.get(k.slice(2));
      if (v) exercises.push({ step: vocabExercise(c, v, mastery(card), poolOrAll, r), kind: 'review', items: [k] });
    }
  }
  return { date: today, exercises, dueCount, newCount, minutes: Math.max(1, Math.round((exercises.length * SECONDS_PER_EXERCISE) / 60)) };
}

/** Rattache le resultat d'un exercice de mission a ses elements SRS (exercices generes sans `items`). */
export function withItems(result: StepResult, ex: MissionExercise): StepResult {
  if (result.items?.length || ex.items.length !== 1) return result;
  return { ...result, items: [{ key: ex.items[0], ok: result.score >= 0.5 }] };
}
