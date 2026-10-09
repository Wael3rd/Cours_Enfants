import { STATS, type Quest, type Step, type Unit } from '../content/schema';
import { ymd } from './calendar';
import { eventWindow, inWindow } from './calendar';
import { introduce, newCard, quality, review } from './srs';
import {
  LEVEL_ITEMS,
  MISSION_BONUS,
  PLAYER_K,
  QUEST_BONUS,
  STAT_K,
  UNIT_BONUS,
  avatarRewardForUnit,
  levelInfo,
  statOf,
  totalXp,
  xpFor,
  type XpGain,
} from './rpg';
import type { Content, DayStat, GameState, Settings, StatId, StepResult } from './types';

export const STATE_VERSION = 1;

export function defaultSettings(): Settings {
  return { sound: true, haptics: true, speechEnabled: true, lentoDefault: false, autoDownload: true, dailyGoalMin: 10, reducedMotion: false };
}

export function defaultState(now = new Date()): GameState {
  return {
    profile: { name: '', avatar: { base: 'viajero', items: {} }, ficha: {} },
    settings: defaultSettings(),
    quests: {},
    plumas: {},
    xp: { escuchar: 0, hablar: 0, leer: 0, escribir: 0, cultura: 0 },
    srs: {},
    discovered: {},
    days: {},
    hints: { used: 0, steps: 0 },
    missionDone: '',
    unlocked: [],
    offline: {},
    createdAt: ymd(now),
  };
}

// ───────── Statuts (deblocage) ─────────
export type QuestStatus = 'locked' | 'available' | 'done';
export type UnitStatus = 'locked' | 'available' | 'done' | 'closed';

/** Unite evenement ouverte a cette date ? */
export function eventOpen(u: Unit, now: Date): boolean {
  const w = eventWindow(u);
  return !!w && inWindow(w, now);
}

export function unitDone(s: GameState, u: Unit): boolean {
  return !!s.plumas[u.id];
}

/**
 * - unites ordinaires : dans l'ordre (la plume de la precedente debloque la suivante)
 * - unites evenement : ouvertes pendant leur fenetre de dates ('closed' en dehors, sauf si deja faites)
 */
export function unitStatus(c: Content, s: GameState, u: Unit, now: Date): UnitStatus {
  if (unitDone(s, u)) return 'done';
  if (eventWindow(u)) return eventOpen(u, now) ? 'available' : 'closed';
  const i = c.main.findIndex((x) => x.id === u.id);
  if (i <= 0) return 'available';
  return unitDone(s, c.main[i - 1]) ? 'available' : 'locked';
}

export function questStatus(c: Content, s: GameState, questId: string, now: Date): QuestStatus {
  const uid = c.questUnit.get(questId);
  const u = uid ? c.unitById.get(uid) : undefined;
  if (!u) return 'locked';
  if (s.quests[questId]?.done) return 'done';
  const us = unitStatus(c, s, u, now);
  if (us === 'locked' || us === 'closed') return 'locked';
  const i = u.quests.findIndex((q) => q.id === questId);
  if (i <= 0) return 'available';
  return s.quests[u.quests[i - 1].id]?.done ? 'available' : 'locked';
}

/** Unite en cours : premiere unite ordinaire sans plume (null si tout est fini). */
export function currentUnit(c: Content, s: GameState): Unit | null {
  return c.main.find((u) => !unitDone(s, u)) ?? null;
}

/** Evenements ouverts maintenant et pas encore termines. */
export function activeEvents(c: Content, s: GameState, now: Date): Unit[] {
  return c.events.filter((u) => !unitDone(s, u) && eventOpen(u, now));
}

/** Prochaine quete a jouer dans une unite (null si l'unite est finie). */
export function nextQuest(c: Content, s: GameState, u: Unit): Quest | null {
  return u.quests.find((q) => !s.quests[q.id]?.done) ?? null;
}

export interface UnitProgress {
  questsDone: number;
  questsTotal: number;
  stars: number;
  starsMax: number;
  accuracy: number;
  plume: boolean;
}

export function unitProgress(s: GameState, u: Unit): UnitProgress {
  let done = 0;
  let stars = 0;
  let acc = 0;
  for (const q of u.quests) {
    const p = s.quests[q.id];
    if (p?.done) {
      done++;
      stars += p.stars;
      acc += p.bestAccuracy;
    }
  }
  return { questsDone: done, questsTotal: u.quests.length, stars, starsMax: u.quests.length * 3, accuracy: done ? acc / done : 0, plume: !!s.plumas[u.id] };
}

// ───────── Etoiles ─────────
export const PASS_ACCURACY = 0.5;

/**
 * 1 etoile = quete terminee (precision >= 50 %), 2 = >= 80 %, 3 = >= 92 %.
 * Trop de pistes (> 25 % des etapes, minimum 3) retire une etoile (jamais sous 1).
 */
export function starsFor(accuracy: number, hints: number, steps: number): number {
  if (accuracy < PASS_ACCURACY) return 0;
  let st = accuracy >= 0.92 ? 3 : accuracy >= 0.8 ? 2 : 1;
  if (hints > Math.max(3, Math.ceil(steps * 0.25))) st = Math.max(1, st - 1);
  return st;
}

/** Vies restantes d'un boss (`quest.jefe.vidas`) apres N reponses fausses. */
export function bossLives(q: Quest, wrong: number): number {
  return Math.max(0, (q.jefe?.vidas ?? 3) - wrong);
}

// ───────── Reducers (mutent `s` en place et le renvoient) ─────────
function day(s: GameState, today: string): DayStat {
  return (s.days[today] ??= { ms: 0, steps: 0, correct: 0, xp: 0 });
}

export function addTime(s: GameState, ms: number, now: Date): void {
  day(s, ymd(now)).ms += Math.max(0, Math.round(ms));
}

function touchItem(s: GameState, key: string, score: number, hints: number, today: string): void {
  let card = s.srs[key];
  if (!card) {
    card = score >= 0.5 ? introduce(today) : { ...newCard(today), seen: 1, wrong: 1 };
    s.srs[key] = card;
    if (key.startsWith('v:')) s.discovered[key.slice(2)] ??= today;
    return;
  }
  s.srs[key] = review(card, quality(score, hints, card.reps), today);
  if (key.startsWith('v:')) s.discovered[key.slice(2)] ??= today;
}

export interface StepOutcome {
  gain: XpGain;
  levelUps: { stat?: StatId; player?: boolean; level: number }[];
  newItems: string[];
}

/**
 * Enregistre le resultat d'une etape : XP (+ bonus sans pista), repetition espacee, inventaire, stats du jour, fiche du joueur.
 * `fields` (write_free) est sauve dans le profil.
 */
export function applyStepResult(
  c: Content,
  s: GameState,
  step: Step,
  result: StepResult,
  opts: { hints?: number; now?: Date; fields?: Record<string, string> } = {},
): StepOutcome {
  const now = opts.now ?? new Date();
  const today = ymd(now);
  const hints = opts.hints ?? 0;
  const beforeStat = levelInfo(s.xp[statOf(step)] ?? 0, STAT_K).level;
  const beforePlayer = levelInfo(totalXp(s.xp), PLAYER_K).level;
  const gain = xpFor(step, result, hints);
  s.xp[gain.stat] = (s.xp[gain.stat] ?? 0) + gain.xp;

  const newItems: string[] = [];
  for (const it of result.items ?? []) {
    const had = !!s.srs[it.key];
    if (step.tipo === 'flashcard') {
      if (!had) {
        s.srs[it.key] = introduce(today);
        newItems.push(it.key);
      }
      if (it.key.startsWith('v:')) s.discovered[it.key.slice(2)] ??= today;
    } else {
      touchItem(s, it.key, it.ok ? result.score || 1 : 0, hints, today);
      if (!had) newItems.push(it.key);
    }
  }
  if (step.tipo === 'write_free' && opts.fields) Object.assign(s.profile.ficha, opts.fields);

  s.hints.used += hints;
  s.hints.steps += 1;
  const d = day(s, today);
  d.steps += 1;
  if (result.score >= 0.99) d.correct += 1;
  d.xp += gain.xp;

  const levelUps: StepOutcome['levelUps'] = [];
  const afterStat = levelInfo(s.xp[gain.stat], STAT_K).level;
  if (afterStat > beforeStat) levelUps.push({ stat: gain.stat, level: afterStat });
  const afterPlayer = levelInfo(totalXp(s.xp), PLAYER_K).level;
  if (afterPlayer > beforePlayer) {
    levelUps.push({ player: true, level: afterPlayer });
    for (const li of LEVEL_ITEMS) if (afterPlayer >= li.level && !s.unlocked.includes(li.item.id)) s.unlocked.push(li.item.id);
  }
  return { gain, levelUps, newItems };
}

/** Une etape jouee dans une quete (pour calculer la precision). */
export interface RunEntry {
  stepId: string;
  tipo: Step['tipo'];
  score: number;
  hints: number;
}
export const NOT_GRADED: Step['tipo'][] = ['flashcard', 'grammar_card', 'cinematic_ref'];
export const runEntry = (step: Step, result: StepResult, hints: number): RunEntry => ({ stepId: step.id, tipo: step.tipo, score: result.score, hints });

export interface QuestOutcome {
  passed: boolean;
  accuracy: number;
  hints: number;
  stars: number;
  newBest: boolean;
  bonusXp: number;
  unitCompleted: boolean;
  plume?: Unit['pluma'];
  unlockedItem?: ReturnType<typeof avatarRewardForUnit>;
}

/** Cloture une quete : etoiles (meilleur score conserve), plume + element d'avatar si c'etait la derniere. */
export function completeQuest(c: Content, s: GameState, questId: string, run: RunEntry[], now = new Date()): QuestOutcome {
  const graded = run.filter((r) => !NOT_GRADED.includes(r.tipo));
  const accuracy = graded.length ? graded.reduce((a, r) => a + r.score, 0) / graded.length : 1;
  const hints = run.reduce((a, r) => a + r.hints, 0);
  const stars = starsFor(accuracy, hints, run.length);
  const prev = s.quests[questId];
  const attempts = (prev?.attempts ?? 0) + 1;
  const out: QuestOutcome = { passed: stars > 0, accuracy, hints, stars, newBest: false, bonusXp: 0, unitCompleted: false };
  if (!out.passed) {
    s.quests[questId] = { done: prev?.done ?? false, stars: prev?.stars ?? 0, bestAccuracy: prev?.bestAccuracy ?? 0, bestHints: prev?.bestHints ?? 0, attempts, completedAt: prev?.completedAt };
    return out;
  }
  const first = !prev?.done;
  out.newBest = first || stars > prev.stars;
  s.quests[questId] = {
    done: true,
    stars: Math.max(stars, prev?.stars ?? 0),
    bestAccuracy: Math.max(accuracy, prev?.bestAccuracy ?? 0),
    bestHints: prev?.done ? Math.min(hints, prev.bestHints) : hints,
    attempts,
    completedAt: prev?.completedAt ?? ymd(now),
  };
  const uid = c.questUnit.get(questId);
  const unit = uid ? c.unitById.get(uid) : undefined;
  const quest = unit?.quests.find((q) => q.id === questId);
  if (first && quest) {
    const stat = quest.stats[0] ?? STATS[0];
    s.xp[stat] += QUEST_BONUS;
    day(s, ymd(now)).xp += QUEST_BONUS;
    out.bonusXp += QUEST_BONUS;
  }
  if (unit && !s.plumas[unit.id] && unit.quests.every((q) => s.quests[q.id]?.done)) {
    s.plumas[unit.id] = ymd(now);
    out.unitCompleted = true;
    out.plume = unit.pluma;
    const item = avatarRewardForUnit(unit);
    if (!s.unlocked.includes(item.id)) s.unlocked.push(item.id);
    out.unlockedItem = item;
    s.xp.cultura += UNIT_BONUS;
    day(s, ymd(now)).xp += UNIT_BONUS;
    out.bonusXp += UNIT_BONUS;
  }
  return out;
}

export function completeMission(s: GameState, now = new Date()): number {
  const t = ymd(now);
  if (s.missionDone === t) return 0;
  s.missionDone = t;
  const d = day(s, t);
  d.mission = true;
  d.xp += MISSION_BONUS;
  s.xp.leer += MISSION_BONUS;
  return MISSION_BONUS;
}

/** Jours consecutifs d'activite (aujourd'hui compte s'il y a de l'activite, sinon on part d'hier). */
export function streak(s: GameState, now = new Date()): number {
  let n = 0;
  const d = new Date(now);
  const active = (dt: Date) => (s.days[ymd(dt)]?.steps ?? 0) > 0;
  if (!active(d)) d.setDate(d.getDate() - 1);
  while (active(d)) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Fiche du joueur : prenom libre pour les phrases ("Hola, me llamo ___"). */
export const playerName = (s: GameState) => s.profile.name.trim() || 'Álex';
