/** Match de detection (~2 min) : pre-remplit les faits connus et place l'enfant dans la bonne zone. */
import { zoneFacts, LAST_ZONE } from './zones.ts';
import { advanceZones, ensureStat, recordAnswer, FLUENT_STREAK, BOX_INTERVAL } from './progress.ts';
import { factQuestion, type FactQuestion } from './builder.ts';
import { mulberry32, shuffle, randomRng, type Rng } from './rng.ts';
import { touchStreak, packsAvailable } from './rewards.ts';
import { HISTORY_CAP, type EngineSettings, type Profile } from './profile.ts';
import type { StartOptions } from './session.ts';

/** Zones testees (la 10 = calcul mental, hors detection). */
export const PLACEMENT_ZONES = LAST_ZONE - 1;
export const PROBES_PER_ZONE = 3;
export const PLACEMENT_MAX_MS = 120_000;
export const PLACEMENT_MAX_QUESTIONS = 30;

export interface PlacementFeedback {
  correct: boolean;
  fluent: boolean;
  expected: number;
  zone: number;
  index: number;
}

export interface PlacementResult {
  questions: number;
  /** Zones reussies (>= 2 sondes fluentes sur 3). */
  zonesPassed: number[];
  /** Zone ou l'enfant est place. */
  focusZone: number;
  /** Faits pre-remplis comme connus. */
  prefilled: number;
  zonesWon: number[];
  stars: number;
  packsAvailable: number;
}

export class PlacementSession {
  readonly mode = 'placement' as const;
  current: FactQuestion | null = null;
  private queue: string[] = [];
  private zone = 1;
  private probes: { id: string; fluent: boolean; ms: number | null; ok: boolean }[] = []; // sondes de la zone courante
  private passed: number[] = [];
  private tested = new Map<string, { ok: boolean; fluent: boolean; ms: number }>();
  private failStreak = 0;
  private asked = 0;
  private elapsed = 0;
  private done = false;
  private result: PlacementResult | null = null;
  private rng: Rng;
  private now: () => number;
  private T: number;

  constructor(private profile: Profile, settings: EngineSettings, o: StartOptions = {}) {
    this.T = settings.thresholdMs;
    this.rng = o.rng ?? (o.seed !== undefined ? mulberry32(o.seed) : randomRng);
    this.now = o.now ?? Date.now;
    profile.progress.sessionCount++;
    this.loadZone();
  }

  private loadZone() {
    this.queue = shuffle(this.rng, zoneFacts(this.zone)).slice(0, PROBES_PER_ZONE).map((f) => f.id);
    this.probes = [];
  }

  get finished() { return this.done; }

  next(): FactQuestion | null {
    if (this.done) return null;
    if (this.current) return this.current;
    if (this.stopped()) return null;
    this.current = factQuestion(zoneFacts(this.zone).find((f) => f.id === this.queue[this.probes.length])!, true, false);
    return this.current;
  }

  private stopped() {
    return this.zone > PLACEMENT_ZONES || this.failStreak >= 2 || this.asked >= PLACEMENT_MAX_QUESTIONS || this.elapsed >= PLACEMENT_MAX_MS;
  }

  submit(answer: number, ms: number): PlacementFeedback {
    const q = this.current;
    if (!q) throw new Error('Aucune question en cours : appeler next()');
    const t = Math.max(0, Math.min(20000, ms));
    const ok = answer === q.answer;
    const fluent = ok && t <= this.T;
    this.probes.push({ id: q.id, fluent, ms: ok ? t : null, ok });
    this.tested.set(q.id, { ok, fluent, ms: t });
    this.asked++;
    this.elapsed += t;
    this.current = null;
    const fb = { correct: ok, fluent, expected: q.answer, zone: this.zone, index: this.asked - 1 };
    if (this.probes.length >= this.queue.length) this.closeZone();
    return fb;
  }

  private closeZone() {
    const okCount = this.probes.filter((p) => p.fluent).length;
    if (okCount >= 2) { this.passed.push(this.zone); this.failStreak = 0; } else this.failStreak++;
    this.zone++;
    if (this.zone <= PLACEMENT_ZONES) this.loadZone();
  }

  finish(): PlacementResult {
    if (this.result) return this.result;
    this.done = true;
    // zone en cours interrompue (temps ecoule) : evaluee sur les sondes deja posees
    if (this.probes.length && this.probes.length < this.queue.length && this.probes.filter((p) => p.fluent).length >= 2) {
      this.passed.push(this.zone);
    }
    const profile = this.profile;
    const p = profile.progress;
    const now = this.now();
    const T = this.T;
    const passedSet = new Set(this.passed);

    for (const [id, t] of this.tested) recordAnswer(p, id, t.ok, t.ms, T, now);
    let prefilled = 0;
    for (const z of this.passed) {
      const times = [...this.tested.entries()].filter(([id, t]) => t.fluent && zoneFacts(z).some((f) => f.id === id)).map(([, t]) => t.ms);
      const typical = times.length ? [...times].sort((a, b) => a - b)[Math.floor(times.length / 2)] : T * 0.8;
      for (const f of zoneFacts(z)) {
        const t = this.tested.get(f.id);
        if (t && !t.ok) continue; // une erreur reste une erreur : on la retravaillera
        const s = ensureStat(p, f.id);
        s.box = Math.max(s.box, 3);
        s.lastOk = true;
        s.lastMs = t ? t.ms : typical;
        s.fluentStreak = Math.max(s.fluentStreak, FLUENT_STREAK);
        s.streak = Math.max(s.streak, FLUENT_STREAK);
        s.seenAt = now;
        s.dueAt = p.sessionCount + BOX_INTERVAL[3];
        if (!t) { s.inferred = true; prefilled++; }
      }
    }
    // Placement : premiere zone non reussie ; les zones reussies au-dela restent connues.
    const firstFail = Array.from({ length: PLACEMENT_ZONES }, (_, i) => i + 1).find((z) => !passedSet.has(z));
    p.focusZone = firstFail ?? LAST_ZONE;
    p.maxUnlocked = Math.max(p.maxUnlocked, p.focusZone, ...(this.passed.length ? [Math.max(...this.passed)] : [1]));
    p.placementDone = true;
    const zonesWon = advanceZones(p, T, now);

    const stars = this.asked > 0 ? 2 : 0;
    profile.rewards.stars += stars;
    if (this.asked > 0) {
      touchStreak(profile.rewards.streak, now);
      const fluentN = [...this.tested.values()].filter((t) => t.fluent).length;
      const goodMs = [...this.tested.values()].filter((t) => t.ok).map((t) => t.ms);
      profile.history.push({
        at: now, mode: 'placement', zone: p.focusZone, questions: this.asked,
        correct: [...this.tested.values()].filter((t) => t.ok).length, fluent: fluentN,
        avgMs: goodMs.length ? goodMs.reduce((a, b) => a + b, 0) / goodMs.length : null, stars, durationMs: this.elapsed,
      });
      if (profile.history.length > HISTORY_CAP) profile.history.splice(0, profile.history.length - HISTORY_CAP);
    }
    this.result = {
      questions: this.asked, zonesPassed: [...this.passed], focusZone: p.focusZone, prefilled, zonesWon, stars,
      packsAvailable: packsAvailable(profile.rewards),
    };
    return this.result;
  }
}

export function startPlacement(profile: Profile, settings: EngineSettings, o: StartOptions = {}): PlacementSession {
  return new PlacementSession(profile, settings, o);
}
