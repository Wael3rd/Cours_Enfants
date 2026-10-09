/** Profil moteur = tout ce que le moteur persiste (a stocker tel quel dans l'etat de l'app). */
import { newProgress, DEFAULT_THRESHOLD_MS, type Progress } from './progress.ts';
import { newRewards, type RewardsState } from './rewards.ts';

export type Mode = 'match' | 'sprint' | 'penalties' | 'training' | 'placement';

export interface SessionRecord {
  /** epoch ms */
  at: number;
  mode: Mode;
  /** Zone de travail pendant la session. */
  zone: number;
  questions: number;
  correct: number;
  fluent: number;
  /** Temps moyen des reponses justes (ms), null si aucune. */
  avgMs: number | null;
  stars: number;
  durationMs: number;
  /** Match : buts marques / encaisses. */
  goals?: number;
  rivalGoals?: number;
  /** Sprint : temps total et medaille. */
  totalMs?: number;
  medal?: 'bronze' | 'argent' | 'or' | null;
}

export interface SprintRecord {
  /** Meilleur temps total (ms, penalites incluses), null si jamais fait. */
  bestMs: number | null;
  /** Temps cumule a chaque question du meilleur sprint : le fantome. */
  ghost: number[];
}

export interface Profile {
  progress: Progress;
  rewards: RewardsState;
  history: SessionRecord[];
  sprint: SprintRecord;
  /** Taux de fluence des derniers matchs (5 max) : base du niveau du rival. */
  matchRates: number[];
}

export interface EngineSettings {
  /** Seuil de fluence en ms : 3000 / 2500 / 2000. */
  thresholdMs: number;
  /** Duree visee d'un match en minutes (2..5). */
  sessionMinutes: number;
}

export const defaultEngineSettings = (): EngineSettings => ({ thresholdMs: DEFAULT_THRESHOLD_MS, sessionMinutes: 3 });

export const newProfile = (): Profile => ({
  progress: newProgress(), rewards: newRewards(), history: [], sprint: { bestMs: null, ghost: [] }, matchRates: [],
});

export const HISTORY_CAP = 500;
