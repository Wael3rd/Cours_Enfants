/** Etat d'apprentissage persistant + regles de fluence / boites de Leitner. Pur, sans UI. */
import { ALL_FACTS, getFact, type Fact } from './facts.ts';
import { ZONES, zoneFacts, LAST_ZONE, MENTAL_ZONE, FACT_ZONE } from './zones.ts';
import { newMental, mentalZoneRatio, type MentalCat, type MentalStat } from './mental.ts';

export const DEFAULT_THRESHOLD_MS = 3000;
export const THRESHOLD_CHOICES_MS = [3000, 2500, 2000] as const;
/** Seuil de deblocage d'une zone. */
export const UNLOCK_RATIO = 0.8;
/** Intervalles Leitner (en sessions) par boite 0..5. */
export const BOX_INTERVAL = [0, 1, 2, 4, 7, 14] as const;
export const MAX_BOX = 5;
/** Un fait fluent doit avoir ete reussi vite au moins 2 fois de suite. */
export const FLUENT_STREAK = 2;

export interface FactStat {
  attempts: number;
  correct: number;
  errors: number;
  /** 5 derniers temps (ms) des reponses justes. */
  times: number[];
  /** Serie de reponses justes. */
  streak: number;
  /** Serie de reponses justes ET rapides. */
  fluentStreak: number;
  /** Boite de Leitner 0..5. */
  box: number;
  lastOk: boolean;
  lastMs: number | null;
  /** Vu le (epoch ms). */
  seenAt: number;
  /** Du a partir de cette session (compteur de sessions). */
  dueAt: number;
  /** Credit partiel du fait commutatif (0..1). */
  credit: number;
  /** Session ou la boite a ete promue (1 promotion max par session). */
  boxSession: number;
  /** Pre-rempli par le match de detection (jamais teste directement). */
  inferred?: boolean;
}

export interface Progress {
  facts: Record<string, FactStat>;
  mental: Record<MentalCat, MentalStat>;
  /** Nombre de sessions demarrees (sert de calendrier Leitner). */
  sessionCount: number;
  /** Zone en cours de travail (1..10). */
  focusZone: number;
  /** Plus haute zone debloquee. */
  maxUnlocked: number;
  /** Zones gagnees (>= 80 % fluent), avec la date. */
  zonesWon: { zone: number; at: number }[];
  /** Zones forcees par le parent. */
  forcedZones: number[];
  placementDone: boolean;
}

export const newProgress = (): Progress => ({
  facts: {}, mental: newMental(), sessionCount: 0, focusZone: 1, maxUnlocked: 1, zonesWon: [], forcedZones: [], placementDone: false,
});

export const newStat = (): FactStat => ({
  attempts: 0, correct: 0, errors: 0, times: [], streak: 0, fluentStreak: 0, box: 0, lastOk: false, lastMs: null,
  seenAt: 0, dueAt: 0, credit: 0, boxSession: -1,
});

export const ensureStat = (p: Progress, id: string): FactStat => (p.facts[id] ??= newStat());

export const isSeen = (s: FactStat | undefined): s is FactStat => !!s && (s.attempts > 0 || !!s.inferred);

/** Fluent = juste ET rapide (<= T) sur la derniere reponse, deux fois de suite au moins. */
export function isFluent(s: FactStat | undefined, T: number): boolean {
  return !!s && s.lastOk && s.lastMs !== null && s.lastMs <= T && s.fluentStreak >= FLUENT_STREAK;
}

export const avgMs = (s: FactStat | undefined): number | null =>
  s && s.times.length ? s.times.reduce((a, b) => a + b, 0) / s.times.length : null;

export const isZoneUnlocked = (p: Progress, z: number) => z <= p.maxUnlocked || p.forcedZones.includes(z);

/** Nouveau fait encore non maitrise : vu 1..8 fois et pas fluent. Au plus 2 en meme temps. */
export const MAX_LEARNING = 2;
export const LEARNING_MAX_ATTEMPTS = 8;
export const isLearning = (s: FactStat | undefined, T: number) =>
  !!s && s.attempts >= 1 && s.attempts <= LEARNING_MAX_ATTEMPTS && !isFluent(s, T);
/** Seuls comptent les faits des zones debloquees (les autres ne peuvent pas etre travailles). */
export const learningCount = (p: Progress, T: number) =>
  Object.entries(p.facts).filter(([id, s]) => isLearning(s, T) && isZoneUnlocked(p, FACT_ZONE.get(id) ?? 99)).length;

export interface AnswerOutcome {
  correct: boolean;
  fluent: boolean;
  boxBefore: number;
  boxAfter: number;
  /** Le fait vient de devenir fluent (n'etait pas fluent avant). */
  becameFluent: boolean;
}

/** Applique une reponse a un fait (regles de docs/maths.md). `now` = epoch ms. */
export function recordAnswer(p: Progress, id: string, ok: boolean, ms: number, T: number, now: number): AnswerOutcome {
  const f = getFact(id);
  const s = ensureStat(p, id);
  const wasFluent = isFluent(s, T);
  const boxBefore = s.box;
  const fluent = ok && ms <= T;
  s.attempts++;
  s.seenAt = now;
  s.lastOk = ok;
  s.lastMs = ok ? ms : null;
  s.inferred = undefined;
  if (ok) {
    s.correct++;
    s.streak++;
    s.times.push(ms);
    if (s.times.length > 5) s.times.shift();
    if (fluent) {
      s.fluentStreak++;
      if (s.boxSession !== p.sessionCount) {
        s.box = Math.min(MAX_BOX, s.box + 1);
        s.boxSession = p.sessionCount;
      }
      giveCredit(p, f);
    } else {
      s.fluentStreak = 0;
      s.box = Math.max(1, s.box); // juste mais lent : boite inchangee (min 1)
    }
  } else {
    s.errors++;
    s.streak = 0;
    s.fluentStreak = 0;
    s.box = 0;
    s.boxSession = -1;
  }
  s.dueAt = p.sessionCount + BOX_INTERVAL[s.box];
  return { correct: ok, fluent, boxBefore, boxAfter: s.box, becameFluent: !wasFluent && isFluent(s, T) };
}

/** Reussir un fait vite donne un demi-credit au fait commutatif (jamais fluent par credit seul). */
function giveCredit(p: Progress, f: Fact) {
  if (!f.partner) return;
  const ps = ensureStat(p, f.partner);
  if (ps.box >= 2) return;
  ps.credit += 0.5;
  if (ps.credit >= 1) {
    ps.credit -= 1;
    ps.box = Math.min(2, ps.box + 1);
    ps.dueAt = Math.max(ps.dueAt, p.sessionCount + BOX_INTERVAL[ps.box]);
  }
}

// ---- Zones ------------------------------------------------------------------------------

export function zoneRatio(p: Progress, zoneId: number, T: number): number {
  if (zoneId === MENTAL_ZONE) return mentalZoneRatio(p.mental);
  const fs = zoneFacts(zoneId);
  return fs.filter((f) => isFluent(p.facts[f.id], T)).length / fs.length;
}

export const zoneFluentCount = (p: Progress, zoneId: number, T: number) =>
  zoneFacts(zoneId).filter((f) => isFluent(p.facts[f.id], T)).length;

export const isZoneWon = (p: Progress, z: number) => p.zonesWon.some((w) => w.zone === z);

/**
 * Met a jour deblocages / zones gagnees apres une session. Renvoie les zones nouvellement gagnees.
 * Regle : zone suivante debloquee quand >= 80 % des faits de la zone sont fluents.
 */
export function advanceZones(p: Progress, T: number, now: number): number[] {
  const won: number[] = [];
  for (const z of ZONES) {
    if (z.id > p.maxUnlocked) break;
    if (!isZoneWon(p, z.id) && zoneRatio(p, z.id, T) >= UNLOCK_RATIO) {
      p.zonesWon.push({ zone: z.id, at: now });
      won.push(z.id);
    }
  }
  while (p.focusZone < LAST_ZONE && isZoneWon(p, p.focusZone)) {
    p.focusZone++;
    p.maxUnlocked = Math.max(p.maxUnlocked, p.focusZone);
  }
  return won;
}

/** Le parent force une zone : debloquee et mise au travail. */
export function forceZone(p: Progress, zoneId: number): void {
  if (zoneId < 1 || zoneId > LAST_ZONE) throw new Error('zone invalide');
  if (!p.forcedZones.includes(zoneId)) p.forcedZones.push(zoneId);
  p.maxUnlocked = Math.max(p.maxUnlocked, zoneId);
  p.focusZone = zoneId;
}


/** Faits vus (ou pre-remplis) appartenant a une zone debloquee : pool de revision. */
export function reviewableFacts(p: Progress, zoneFilter?: number): Fact[] {
  return ALL_FACTS.filter((f) => {
    const z = FACT_ZONE.get(f.id)!;
    if (zoneFilter !== undefined && z !== zoneFilter) return false;
    return isSeen(p.facts[f.id]) && isZoneUnlocked(p, z);
  });
}
