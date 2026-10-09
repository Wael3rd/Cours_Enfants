import type { StatId, Step, StepTipo, Unit, Vocab, Personaje, GrammarCard } from '../content/schema';

export type { StatId, Step, StepTipo, Unit, Vocab, Personaje, GrammarCard };

// ───────── Reponses de l'enfant (une par type d'etape) ─────────
export interface SpeechAlt {
  transcript: string;
  confidence?: number;
}

export type Answer =
  | { tipo: 'flashcard' | 'grammar_card' | 'cinematic_ref' }
  /** errors : nombre d'erreurs par vocabId pendant l'association */
  | { tipo: 'match_image'; errors?: Record<string, number> }
  | { tipo: 'listen_choose' | 'dialogue_choice'; choice: number }
  | { tipo: 'dictado' | 'fill_blank'; text: string }
  | { tipo: 'reorder_words'; words: string[] }
  /** Saisie libre d'une forme complete OU terminaison choisie */
  | { tipo: 'conjugar'; terminacion?: string; text?: string }
  /** choices[i] = index choisi pour la question i */
  | { tipo: 'read_answer'; choices: number[] }
  /** alts = alternatives de la reconnaissance vocale ; self = auto-evaluation (repli) */
  | { tipo: 'speak'; alts?: (string | SpeechAlt)[]; self?: 'bien' | 'casi' | 'no' }
  | { tipo: 'true_false'; value: boolean }
  | { tipo: 'write_free'; fields: Record<string, string> };

export type Outcome = 'correct' | 'partial' | 'wrong';

export interface StepResult {
  outcome: Outcome;
  /** 0..1 : credit (XP, precision, SRS) */
  score: number;
  /** Messages a afficher (ex. "¡Ojo con el acento!") */
  warnings: string[];
  /** Forme attendue, a montrer si faux / accent / faute */
  expected?: string;
  /** Detail par sous-element (SRS) : cle d'item -> reussi */
  items?: { key: string; ok: boolean }[];
  /** speak : niveau detaille */
  speech?: 'logrado' | 'casi' | 'repetir' | 'autoevaluacion';
  /** read_answer / write_free : detail par question / champ */
  detail?: Record<string, boolean>;
  /** write_free : plantilla remplie */
  filled?: string;
}

export const ACCENT_WARNING = '¡Ojo con el acento!';

// ───────── Contenu indexe ─────────
export interface Content {
  units: Unit[];
  /** Unites ordinaires (sans fenetre d'evenement), triees par numero. */
  main: Unit[];
  /** Unites evenement. */
  events: Unit[];
  vocab: Map<string, Vocab & { unitId: string }>;
  characters: Personaje[];
  steps: Map<string, { step: Step; unitId: string; questId: string }>;
  grammar: Map<string, GrammarCard>;
  unitById: Map<string, Unit>;
  questUnit: Map<string, string>;
}

// ───────── Etat persistant ─────────
export type ItemKind = 'v' | 'p' | 'g';
/** Cle SRS : "v:<vocabId>" | "p:<audioKey phrase>" | "g:<stepId conjugar>" */
export type ItemKey = string;

export interface SrsCard {
  ef: number;
  reps: number;
  /** jours */
  interval: number;
  /** YYYY-MM-DD (local) */
  due: string;
  lapses: number;
  seen: number;
  wrong: number;
  last: string;
  /** vocab : vu mais jamais ete reussi */
  step?: string;
}

export interface QuestProgress {
  done: boolean;
  stars: number;
  bestAccuracy: number;
  bestHints: number;
  attempts: number;
  completedAt?: string;
}

export interface DayStat {
  ms: number;
  steps: number;
  correct: number;
  xp: number;
  mission?: boolean;
}

export type OfflineStatus = 'none' | 'partial' | 'ready';

export interface Settings {
  sound: boolean;
  haptics: boolean;
  /** Reconnaissance vocale desactivee -> auto-evaluation */
  speechEnabled: boolean;
  /** Joue la variante lente par defaut */
  lentoDefault: boolean;
  autoDownload: boolean;
  /** Objectif quotidien en minutes */
  dailyGoalMin: number;
  /** Jours de la semaine (0=dim) ou le parent attend une session ; informatif */
  reducedMotion: boolean;
}

export interface Profile {
  name: string;
  avatar: { base: string; items: Record<string, string> };
  /** Reponses des write_free (guardarEn: perfil) : fieldId -> valeur */
  ficha: Record<string, string>;
}

export interface GameState {
  profile: Profile;
  settings: Settings;
  quests: Record<string, QuestProgress>;
  /** unitId -> plume recuperee (YYYY-MM-DD) */
  plumas: Record<string, string>;
  xp: Record<StatId, number>;
  srs: Record<ItemKey, SrsCard>;
  /** Mots decouverts (carte debloquee dans l'inventaire) */
  discovered: Record<string, string>;
  days: Record<string, DayStat>;
  /** Total des pistas utilisees / etapes jouees */
  hints: { used: number; steps: number };
  /** Derniere Mision del dia terminee (date) */
  missionDone: string;
  /** Elements d'avatar debloques */
  unlocked: string[];
  offline: Record<string, { status: OfflineStatus; at: string; files: number; bytes: number }>;
  createdAt: string;
}
