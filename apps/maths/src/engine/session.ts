/** Sessions de jeu : Match, Sprint 100 m, Tirs au but, Entrainement. Point d'entree : startSession(). */
import { ALL_FACTS } from './facts.ts';
import { zoneFacts, FACT_ZONE } from './zones.ts';
import {
  advanceZones, avgMs, isFluent, isSeen, isZoneUnlocked, recordAnswer, reviewableFacts, type Progress,
} from './progress.ts';
import { recordMental } from './mental.ts';
import { QuestionBuilder, factQuestion, type Question } from './builder.ts';
import { hintFor, MODEL_MS, type VisualHint } from './visuals.ts';
import { mulberry32, shuffle, randomRng, type Rng } from './rng.ts';
import {
  computeStars, touchStreak, packsAvailable, unlockedAvatarIds,
} from './rewards.ts';
import { HISTORY_CAP, type EngineSettings, type Mode, type Profile, type SessionRecord } from './profile.ts';

export type { Question } from './builder.ts';

export interface StartOptions {
  /** Seed du RNG (tests / reproductibilite). Sans seed : Math.random. */
  seed?: number;
  rng?: Rng;
  /** Horloge injectable (epoch ms). */
  now?: () => number;
  /** Entrainement : zone a travailler (defaut = zone en cours). */
  zone?: number;
  /** Nombre de questions (defaut : match = minutes x 7, entrainement 15, sprint 10, tirs 5). */
  questions?: number;
}

export type Medal = 'bronze' | 'argent' | 'or';

export interface Feedback {
  correct: boolean;
  /** Juste ET <= seuil. */
  fluent: boolean;
  expected: number;
  /** Modelisation apres erreur : indice visuel a montrer ~1,5 s (null si juste, ou en Sprint). */
  hint: VisualHint | null;
  modelMs: number;
  /** Cette reponse rend le fait fluent pour la 1re fois. */
  becameFluent: boolean;
  /** Match : but marque par le joueur (reponse fluente) / par le rival. */
  goal?: boolean;
  rivalGoal?: boolean;
  score?: { goals: number; rival: number };
  /** Sprint : temps cumule du joueur et du fantome a cette question (ms), ecart (>0 = devant). */
  sprint?: { elapsedMs: number; ghostMs: number | null; leadMs: number | null; errors: number };
  /** Tirs au but : tir cadre (juste) / lucarne (fluent). */
  shot?: { scored: boolean; topCorner: boolean };
  index: number;
  total: number;
}

export interface SessionResult {
  mode: Mode;
  questions: number;
  correct: number;
  errors: number;
  fluent: number;
  accuracy: number;
  fluentRate: number;
  avgMs: number | null;
  bestStreak: number;
  durationMs: number;
  stars: number;
  newFluentFacts: string[];
  zonesWon: number[];
  /** Faits rates (pour le revoir). */
  missed: { id: string; text: string; answer: number }[];
  goals?: number;
  rivalGoals?: number;
  outcome?: 'win' | 'draw' | 'loss';
  rivalLevel?: number;
  totalMs?: number;
  medal?: Medal | null;
  isRecord?: boolean;
  shotsScored?: number;
  newAvatarItems: string[];
  packsAvailable: number;
  streak: { current: number; best: number };
  perQuestion: { id: string; text: string; ok: boolean; ms: number; fluent: boolean }[];
}

export const SPRINT_LENGTH = 10;
export const PENALTY_SHOTS = 5;
export const SPRINT_ERROR_PENALTY_MS = 3000;
/** Plafond du temps retenu pour une question (evite les pauses). */
export const MAX_ANSWER_MS = 20000;
export const QUESTIONS_PER_MINUTE = 10;

// ---- Niveau du rival / medailles ------------------------------------------------------------

/** Niveau du rival (0..1) = taux de fluence recent de l'enfant (matchs serres). */
export function rivalLevel(matchRates: readonly number[]): number {
  if (!matchRates.length) return 0.45;
  const avg = matchRates.reduce((a, b) => a + b, 0) / matchRates.length;
  return Math.min(0.85, Math.max(0.15, avg - 0.02));
}

/**
 * Medailles du Sprint (10 faits, penalites incluses). ref = 10 x seuil de fluence.
 * bronze : <= ref et au plus 2 erreurs ; argent : <= 0,8 ref (et <= 1,1 x record), 1 erreur max ;
 * or : <= 0,6 ref, ou nouveau record sous 0,8 ref ; 0 erreur.
 */
export function sprintMedal(totalMs: number, errors: number, T: number, recordMs: number | null): Medal | null {
  const ref = SPRINT_LENGTH * T;
  const rec = recordMs ?? Infinity;
  if (errors === 0 && (totalMs <= 0.6 * ref || (totalMs < rec && totalMs <= 0.8 * ref))) return 'or';
  if (errors <= 1 && totalMs <= 0.8 * ref && totalMs <= 1.1 * rec) return 'argent';
  if (errors <= 2 && totalMs <= ref) return 'bronze';
  return null;
}

/** Faits les plus difficiles : erreurs, lenteur, boite basse. */
export function hardestFacts(p: Progress, T: number, n: number): string[] {
  const seen = reviewableFacts(p).filter((f) => p.facts[f.id].attempts > 0);
  const score = (id: string) => {
    const s = p.facts[id];
    const slow = (avgMs(s) ?? T * 2) / T;
    const err = s.attempts ? s.errors / s.attempts : 0;
    return err * 4 + slow + (5 - s.box) * 0.3 + (isFluent(s, T) ? -1 : 0);
  };
  return seen.map((f) => f.id).sort((a, b) => score(b) - score(a)).slice(0, n);
}

// ---- Session --------------------------------------------------------------------------------

export class Session {
  readonly mode: Mode;
  readonly total: number;
  index = 0; // numero de la question courante (0-based)
  current: Question | null = null;
  private asked = 0;
  private extra = 0;
  private done = false;
  private result: SessionResult | null = null;
  private lastId: string | null = null;
  private answers: SessionResult['perQuestion'] = [];
  private newFluent: string[] = [];
  private answerOf = new Map<string, number>();
  private streak = 0;
  private bestStreak = 0;
  private elapsed = 0;
  private builder: QuestionBuilder | null = null;
  private fixed: string[] = []; // sprint / tirs : faits predetermines
  private startedAt: number;
  // match
  private goals = 0;
  private rivalGoals = 0;
  private rivalP = 0.45;
  // sprint
  private errors = 0;
  private ghost: number[] = [];
  private cum: number[] = [];
  // tirs
  private scored = 0;

  readonly T: number;
  private rng: Rng;
  private now: () => number;
  readonly zone: number;

  constructor(private profile: Profile, private settings: EngineSettings, mode: Mode, o: StartOptions = {}) {
    if (mode === 'placement') throw new Error('Utiliser startPlacement()');
    this.mode = mode;
    this.T = settings.thresholdMs;
    this.rng = o.rng ?? (o.seed !== undefined ? mulberry32(o.seed) : randomRng);
    this.now = o.now ?? Date.now;
    this.startedAt = this.now();
    const p = profile.progress;
    p.sessionCount++;
    this.zone = mode === 'training' ? (o.zone ?? p.focusZone) : p.focusZone;

    if (mode === 'sprint') {
      this.fixed = this.sprintFacts();
      this.total = this.fixed.length;
      this.ghost = [...profile.sprint.ghost];
    } else if (mode === 'penalties') {
      this.fixed = this.penaltyFacts();
      this.total = this.fixed.length;
    } else {
      this.total = o.questions ?? (mode === 'training' ? 15 : Math.round(settings.sessionMinutes * QUESTIONS_PER_MINUTE));
      this.builder = new QuestionBuilder(p, this.T, this.rng, mode === 'training' ? { zone: this.zone } : {});
    }
    if (mode === 'match') this.rivalP = rivalLevel(profile.matchRates);
  }

  get rivalLevel(): number { return this.rivalP; }
  get finished(): boolean { return this.done; }

  private sprintFacts(): string[] {
    const p = this.profile.progress;
    const seen = reviewableFacts(p).filter((f) => p.facts[f.id].box >= 1 || isFluent(p.facts[f.id], this.T));
    let pool = seen.length >= SPRINT_LENGTH ? seen : reviewableFacts(p);
    if (pool.length < SPRINT_LENGTH) {
      const z = Math.min(p.focusZone, 9);
      pool = [...pool, ...ALL_FACTS.filter((f) => FACT_ZONE.get(f.id)! <= z && !pool.includes(f))];
    }
    if (pool.length < SPRINT_LENGTH) pool = [...pool, ...zoneFacts(1)];
    const out: string[] = [];
    for (const f of shuffle(this.rng, pool)) {
      if (out.length >= SPRINT_LENGTH) break;
      if (!out.includes(f.id)) out.push(f.id);
    }
    return out;
  }

  private penaltyFacts(): string[] {
    const p = this.profile.progress;
    const out = hardestFacts(p, this.T, PENALTY_SHOTS);
    const z = Math.min(p.focusZone, 9);
    for (const f of shuffle(this.rng, zoneFacts(z))) {
      if (out.length >= PENALTY_SHOTS) break;
      if (!out.includes(f.id)) out.push(f.id);
    }
    for (const f of shuffle(this.rng, ALL_FACTS)) {
      if (out.length >= PENALTY_SHOTS) break;
      if (!out.includes(f.id) && isZoneUnlocked(p, FACT_ZONE.get(f.id)!)) out.push(f.id);
    }
    return shuffle(this.rng, out);
  }

  /** Question suivante, ou null quand la session est terminee (appeler alors finish()). */
  next(): Question | null {
    if (this.done) return null;
    if (this.current) return this.current; // pas de saut sans reponse
    let q: Question | null = null;
    if (this.builder) {
      const force = this.asked >= this.total;
      if (force && (this.builder.pendingErrors === 0 || this.extra >= 3)) return null;
      if (force) this.extra++;
      q = this.builder.pick(this.asked, this.lastId, force);
    } else {
      if (this.asked >= this.total) return null;
      q = factQuestion(ALL_FACTS.find((f) => f.id === this.fixed[this.asked])!, !isSeen(this.profile.progress.facts[this.fixed[this.asked]]));
    }
    this.current = q;
    return q;
  }

  /** Indice visuel pour la question (entrainement : a montrer AVANT la 1re reponse d'un fait nouveau). */
  hint(q: Question | null = this.current): VisualHint | null {
    if (!q) return null;
    return hintFor(q.kind === 'fact' ? q.fact : q);
  }

  /** Soumet la reponse (nombre) et le temps de reponse (ms). */
  submit(answer: number, ms: number): Feedback {
    const q = this.current;
    if (!q) throw new Error('Aucune question en cours : appeler next()');
    const p = this.profile.progress;
    const t = Math.max(0, Math.min(MAX_ANSWER_MS, ms));
    const ok = answer === q.answer;
    let fluent: boolean;
    let becameFluent = false;
    const now = this.now();
    if (q.kind === 'fact') {
      const o = recordAnswer(p, q.id, ok, t, this.T, now);
      fluent = o.fluent;
      becameFluent = o.becameFluent;
      if (becameFluent) this.newFluent.push(q.id);
    } else {
      fluent = recordMental(p.mental[q.cat], ok, t, this.T);
    }
    this.answers.push({ id: q.id, text: q.text, ok, ms: t, fluent });
    this.answerOf.set(q.id, q.answer);
    this.streak = ok ? this.streak + 1 : 0;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    this.elapsed += t;
    this.builder?.onAnswer(q, ok, this.asked);
    const fb: Feedback = {
      correct: ok, fluent, expected: q.answer, becameFluent, modelMs: MODEL_MS,
      hint: ok || this.mode === 'sprint' ? null : this.hint(q),
      index: this.asked, total: this.total,
    };

    if (this.mode === 'match') {
      fb.goal = fluent;
      if (fluent) this.goals++;
      fb.rivalGoal = this.rng.next() < this.rivalP;
      if (fb.rivalGoal) this.rivalGoals++;
      fb.score = { goals: this.goals, rival: this.rivalGoals };
    } else if (this.mode === 'sprint') {
      const spent = t + (ok ? 0 : SPRINT_ERROR_PENALTY_MS);
      if (!ok) this.errors++;
      this.cum.push((this.cum[this.cum.length - 1] ?? 0) + spent);
      const g = this.ghost[this.asked] ?? null;
      const mine = this.cum[this.cum.length - 1];
      fb.sprint = { elapsedMs: mine, ghostMs: g, leadMs: g === null ? null : g - mine, errors: this.errors };
    } else if (this.mode === 'penalties') {
      if (ok) this.scored++;
      fb.shot = { scored: ok, topCorner: fluent };
    }

    this.asked++;
    this.index = this.asked;
    this.lastId = q.id;
    this.current = null;
    return fb;
  }

  /** Termine la session : met a jour zones, etoiles, historique, serie... et renvoie le bilan. Idempotent. */
  finish(): SessionResult {
    if (this.result) return this.result;
    this.done = true;
    const profile = this.profile;
    const p = profile.progress;
    const now = this.now();
    const n = this.answers.length;
    const correct = this.answers.filter((a) => a.ok).length;
    const fluentN = this.answers.filter((a) => a.fluent).length;
    const goodTimes = this.answers.filter((a) => a.ok).map((a) => a.ms);
    const avg = goodTimes.length ? goodTimes.reduce((a, b) => a + b, 0) / goodTimes.length : null;
    const before = unlockedAvatarIds({ rewards: profile.rewards, zonesWon: p.zonesWon.map((z) => z.zone) });
    const zonesWon = n > 0 ? advanceZones(p, this.T, now) : [];

    const res: SessionResult = {
      mode: this.mode, questions: n, correct, errors: n - correct, fluent: fluentN,
      accuracy: n ? correct / n : 0, fluentRate: n ? fluentN / n : 0, avgMs: avg, bestStreak: this.bestStreak,
      durationMs: this.elapsed, stars: 0, newFluentFacts: this.newFluent, zonesWon,
      missed: [...new Map(this.answers.filter((a) => !a.ok).map((a) => [a.id, { id: a.id, text: a.text, answer: this.answerOf.get(a.id)! }])).values()],
      newAvatarItems: [], packsAvailable: 0, streak: { current: 0, best: 0 }, perQuestion: this.answers,
    };

    let modeBonus = false;
    const rec: SessionRecord = {
      at: now, mode: this.mode, zone: this.zone, questions: n, correct, fluent: fluentN, avgMs: avg, stars: 0, durationMs: this.elapsed,
    };
    if (this.mode === 'match') {
      res.goals = this.goals; res.rivalGoals = this.rivalGoals; res.rivalLevel = this.rivalP;
      res.outcome = this.goals > this.rivalGoals ? 'win' : this.goals < this.rivalGoals ? 'loss' : 'draw';
      modeBonus = res.outcome === 'win';
      rec.goals = this.goals; rec.rivalGoals = this.rivalGoals;
      if (n >= 5) { profile.matchRates.push(res.fluentRate); if (profile.matchRates.length > 5) profile.matchRates.shift(); }
    } else if (this.mode === 'sprint') {
      const complete = n === this.total;
      const total = this.cum[this.cum.length - 1] ?? 0;
      res.totalMs = total;
      res.medal = complete ? sprintMedal(total, this.errors, this.T, profile.sprint.bestMs) : null;
      if (complete && this.errors === 0 && (profile.sprint.bestMs === null || total < profile.sprint.bestMs)) {
        res.isRecord = true;
        profile.sprint = { bestMs: total, ghost: [...this.cum] };
      }
      if (res.medal) profile.rewards.medals[res.medal]++;
      modeBonus = res.medal === 'argent' || res.medal === 'or';
      rec.totalMs = total; rec.medal = res.medal;
    } else if (this.mode === 'penalties') {
      res.shotsScored = this.scored;
      modeBonus = this.scored >= 4;
    }
    res.stars = computeStars({ questions: n, correct, fluent: fluentN, modeBonus, zonesWon: zonesWon.length });
    rec.stars = res.stars;
    profile.rewards.stars += res.stars;
    if (n > 0) {
      touchStreak(profile.rewards.streak, now);
      profile.history.push(rec);
      if (profile.history.length > HISTORY_CAP) profile.history.splice(0, profile.history.length - HISTORY_CAP);
    }
    const after = unlockedAvatarIds({ rewards: profile.rewards, zonesWon: p.zonesWon.map((z) => z.zone) });
    res.newAvatarItems = after.filter((id) => !before.includes(id));
    res.packsAvailable = packsAvailable(profile.rewards);
    res.streak = { current: profile.rewards.streak.current, best: profile.rewards.streak.best };
    this.result = res;
    return res;
  }
}

export function startSession(profile: Profile, settings: EngineSettings, mode: Exclude<Mode, 'placement'>, o: StartOptions = {}): Session {
  return new Session(profile, settings, mode, o);
}
