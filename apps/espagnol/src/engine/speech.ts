import { NOMBRE_LIBRE, type SpeakStep } from '../content/schema';
import { digitsToWords, editDistance, foldAll, normalize, tokens } from './text';
import { freeNameWords } from './freeName';
import type { SpeechAlt } from './types';

export const SPEECH_OK = 0.85;
export const SPEECH_ALMOST = 0.6;

export type SpeechLevel = 'logrado' | 'casi' | 'repetir';

export interface SpeechScore {
  level: SpeechLevel;
  /** 0..1 meilleur score toutes alternatives x phrases acceptees confondues */
  score: number;
  /** transcription retenue */
  heard: string;
  /** phrase acceptee la plus proche */
  target: string;
}

/** Normalisation d'une transcription : chiffres -> mots, pas de ponctuation, accents plies. */
export function speechTokens(s: string): string[] {
  return tokens(foldAll(normalize(digitsToWords(s.normalize('NFC')))));
}

const wordEq = (a: string, b: string) => a === b || (a.length >= 5 && b.length >= 5 && editDistance(a, b) <= 1);

/** Longueur de la plus longue sous-sequence commune (mots flous, ordre respecte). */
export function lcsWords(e: string[], s: string[]): number {
  const dp = Array.from({ length: e.length + 1 }, () => new Array<number>(s.length + 1).fill(0));
  for (let i = 1; i <= e.length; i++)
    for (let j = 1; j <= s.length; j++)
      dp[i][j] = wordEq(e[i - 1], s[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[e.length][s.length];
}

/**
 * Score d'une prononciation : rappel des mots attendus (LCS, ordre respecte) moins une petite penalite
 * pour les mots en trop (hors jokers de prenom). 0.85+ = logrado, 0.6+ = casi.
 */
export function scoreWords(expected: string[], spoken: string[], slack = 0): number {
  if (!spoken.length) return 0;
  if (!expected.length) return 1;
  const m = lcsWords(expected, spoken);
  const extras = Math.max(0, spoken.length - m - slack);
  return Math.max(0, m / expected.length - (0.25 * extras) / expected.length);
}

export function levelOf(score: number): SpeechLevel {
  return score >= SPEECH_OK ? 'logrado' : score >= SPEECH_ALMOST ? 'casi' : 'repetir';
}

/** Compare les alternatives de la reconnaissance vocale aux phrases acceptees de l'etape `speak`. */
export function scoreSpeech(step: SpeakStep, alts: (string | SpeechAlt)[]): SpeechScore {
  const heards = alts.map((a) => (typeof a === 'string' ? a : a.transcript)).filter((t) => t && t.trim());
  const targets = [...new Set([step.objetivo.es, ...step.aceptadas])];
  const wild = new Set(freeNameWords(step, step.objetivo.es).map((w) => foldAll(normalize(w))).filter(Boolean));
  let best: SpeechScore = { level: 'repetir', score: 0, heard: heards[0] ?? '', target: targets[0] };
  for (const heard of heards) {
    const sp = speechTokens(heard);
    for (const t of targets) {
      const raw = speechTokens(t);
      const ex = raw.filter((w) => !wild.has(w));
      const slack = (raw.length - ex.length) * 2;
      const sc = scoreWords(ex, sp, slack);
      if (sc > best.score) best = { level: levelOf(sc), score: sc, heard, target: t };
    }
  }
  // prenom libre (schema : SpeakStep.patrones, jeton {nombre} = 1 a 3 mots quelconques)
  for (const heard of heards) {
    const sp = speechTokens(heard);
    for (const pat of (step as SpeakStep & { patrones?: string[] }).patrones ?? []) {
      const [pre = '', post = ''] = pat.split(NOMBRE_LIBRE);
      const ex = [...speechTokens(pre), ...speechTokens(post)];
      const sc = scoreWords(ex, sp, 3);
      if (sc > best.score) best = { level: levelOf(sc), score: sc, heard, target: pat };
    }
  }
  best.level = levelOf(best.score);
  return best;
}
