/** Economie de recompenses : etoiles, cartes joueurs, trophees, avatar, serie de jours (douce). */
import cardsJson from './cards.json' with { type: 'json' };
import { weighted, type Rng } from './rng.ts';
import { ZONES } from './zones.ts';

export type Rarity = 'bronze' | 'argent' | 'or' | 'legende';
export interface Card {
  id: string;
  name: string;
  post: 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant';
  number: number;
  rarity: Rarity;
  colors: { primary: string; secondary: string; skin: string; hair: string };
}
export const CARDS: readonly Card[] = cardsJson as Card[];
export const RARITIES: readonly Rarity[] = ['bronze', 'argent', 'or', 'legende'];
/** Probabilite de tirage par rarete dans un paquet. */
export const PACK_ODDS: Record<Rarity, number> = { bronze: 0.58, argent: 0.28, or: 0.12, legende: 0.02 };
/** Etoiles pour un paquet (1 carte). */
export const PACK_COST = 6;

export interface StreakState {
  current: number;
  best: number;
  /** Dernier jour d'entrainement "YYYY-MM-DD". */
  lastDay: string | null;
  totalDays: number;
}

export interface RewardsState {
  stars: number;
  starsSpent: number;
  cards: { id: string; at: number }[];
  avatar: { jersey: string; boots: string };
  medals: { bronze: number; argent: number; or: number };
  streak: StreakState;
}

export const newRewards = (): RewardsState => ({
  stars: 0, starsSpent: 0, cards: [], avatar: { jersey: 'vert', boots: 'noirs' },
  medals: { bronze: 0, argent: 0, or: 0 }, streak: { current: 0, best: 0, lastDay: null, totalDays: 0 },
});

// ---- Etoiles -------------------------------------------------------------------------------

export interface StarInput {
  questions: number;
  correct: number;
  fluent: number;
  /** Bonus de mode : victoire au match, medaille, tirs reussis... (0..1) */
  modeBonus?: boolean;
  zonesWon?: number;
}

/** 1 pour avoir joue, +1 precision >= 80 %, +1 fluence >= 50 %, +1 bonus de mode, +1 zone gagnee. Max 5. */
export function computeStars(i: StarInput): number {
  if (i.questions <= 0) return 0;
  let s = 1;
  if (i.correct / i.questions >= 0.8) s++;
  if (i.fluent / i.questions >= 0.5) s++;
  if (i.modeBonus) s++;
  if (i.zonesWon) s++;
  return Math.min(5, s);
}

// ---- Cartes --------------------------------------------------------------------------------

export const packsAvailable = (r: RewardsState) => Math.max(0, Math.floor((r.stars - r.starsSpent) / PACK_COST));
export const starsToNextPack = (r: RewardsState) => PACK_COST - ((r.stars - r.starsSpent) % PACK_COST);
export const ownsCard = (r: RewardsState, id: string) => r.cards.some((c) => c.id === id);

/** Ouvre un paquet : depense PACK_COST etoiles, renvoie une carte non possedee (null si album complet / pas assez d'etoiles). */
export function openPack(r: RewardsState, rng: Rng, now: number): Card | null {
  if (packsAvailable(r) < 1) return null;
  const missing = CARDS.filter((c) => !ownsCard(r, c.id));
  if (!missing.length) return null;
  // Rarete tiree, puis repli sur une rarete disponible (la plus proche).
  const target = RARITIES[weighted(rng, RARITIES.map((x) => PACK_ODDS[x]))];
  const order = [...RARITIES].sort((a, b) => Math.abs(RARITIES.indexOf(a) - RARITIES.indexOf(target)) - Math.abs(RARITIES.indexOf(b) - RARITIES.indexOf(target)));
  const rarity = order.find((x) => missing.some((c) => c.rarity === x))!;
  const pool = missing.filter((c) => c.rarity === rarity);
  const card = pool[Math.floor(rng.next() * pool.length)];
  r.starsSpent += PACK_COST;
  r.cards.push({ id: card.id, at: now });
  return card;
}

// ---- Avatar --------------------------------------------------------------------------------

export type UnlockRule =
  | { type: 'start' }
  | { type: 'stars'; n: number }
  | { type: 'zone'; zone: number }
  | { type: 'medal'; medal: 'bronze' | 'argent' | 'or'; n: number };

export interface AvatarItem {
  id: string;
  slot: 'jersey' | 'boots';
  name: string;
  /** Couleurs pour dessiner (maillot : principale / secondaire ; crampons : principale / lacets). */
  colors: [string, string];
  unlock: UnlockRule;
}

export const AVATAR_ITEMS: readonly AvatarItem[] = [
  { id: 'vert', slot: 'jersey', name: 'Vert Pelouse', colors: ['#12a34a', '#ffffff'], unlock: { type: 'start' } },
  { id: 'bleu', slot: 'jersey', name: 'Bleu Nuit', colors: ['#1d4ed8', '#fbbf24'], unlock: { type: 'stars', n: 8 } },
  { id: 'jaune', slot: 'jersey', name: 'Jaune Projecteur', colors: ['#facc15', '#0b1b3a'], unlock: { type: 'stars', n: 20 } },
  { id: 'rouge', slot: 'jersey', name: 'Rouge Volcan', colors: ['#d03b3b', '#ffffff'], unlock: { type: 'zone', zone: 2 } },
  { id: 'rose', slot: 'jersey', name: 'Rose Bonbon', colors: ['#ec4899', '#ffffff'], unlock: { type: 'stars', n: 40 } },
  { id: 'orange', slot: 'jersey', name: 'Orange Mandarine', colors: ['#f97316', '#0b1b3a'], unlock: { type: 'zone', zone: 4 } },
  { id: 'violet', slot: 'jersey', name: 'Violet Galaxie', colors: ['#7c3aed', '#fde68a'], unlock: { type: 'stars', n: 80 } },
  { id: 'tigre', slot: 'jersey', name: 'Rayé Tigre', colors: ['#f59e0b', '#111827'], unlock: { type: 'zone', zone: 6 } },
  { id: 'or', slot: 'jersey', name: 'Maillot en Or', colors: ['#fbbf24', '#ffffff'], unlock: { type: 'zone', zone: 9 } },
  { id: 'noirs', slot: 'boots', name: 'Crampons Classiques', colors: ['#111827', '#ffffff'], unlock: { type: 'start' } },
  { id: 'bleus', slot: 'boots', name: 'Crampons Éclair', colors: ['#0ea5e9', '#ffffff'], unlock: { type: 'stars', n: 12 } },
  { id: 'fluo', slot: 'boots', name: 'Crampons Fluo', colors: ['#a3e635', '#111827'], unlock: { type: 'medal', medal: 'bronze', n: 1 } },
  { id: 'roses', slot: 'boots', name: 'Crampons Bonbon', colors: ['#f472b6', '#ffffff'], unlock: { type: 'stars', n: 50 } },
  { id: 'argent', slot: 'boots', name: 'Crampons Argentés', colors: ['#cbd5e1', '#1e293b'], unlock: { type: 'medal', medal: 'argent', n: 1 } },
  { id: 'dores', slot: 'boots', name: 'Crampons Dorés', colors: ['#fbbf24', '#7c2d12'], unlock: { type: 'medal', medal: 'or', n: 1 } },
];

export interface RewardsContext {
  rewards: RewardsState;
  zonesWon: number[];
}

export function isUnlocked(rule: UnlockRule, ctx: RewardsContext): boolean {
  switch (rule.type) {
    case 'start': return true;
    case 'stars': return ctx.rewards.stars >= rule.n;
    case 'zone': return ctx.zonesWon.includes(rule.zone);
    case 'medal': return ctx.rewards.medals[rule.medal] >= rule.n;
  }
}
export const unlockedAvatarIds = (ctx: RewardsContext): string[] =>
  AVATAR_ITEMS.filter((it) => isUnlocked(it.unlock, ctx)).map((it) => it.id);

export function setAvatar(ctx: RewardsContext, slot: 'jersey' | 'boots', id: string): boolean {
  const it = AVATAR_ITEMS.find((x) => x.id === id && x.slot === slot);
  if (!it || !isUnlocked(it.unlock, ctx)) return false;
  ctx.rewards.avatar[slot] = id;
  return true;
}

// ---- Trophees ------------------------------------------------------------------------------

export const trophyName = (zone: number) => ZONES[zone - 1].cup;

// ---- Serie de jours (douce) ----------------------------------------------------------------

export const dayKey = (now: number): string => {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const dayNum = (key: string) => Math.round(Date.parse(`${key}T00:00:00Z`) / 86400000);

/**
 * Serie douce : un jour manque ne casse pas la serie (tolerance 1 jour). Au-dela, elle repart a 1,
 * sans message negatif ; le meilleur score reste acquis.
 */
export function touchStreak(s: StreakState, now: number): void {
  const today = dayKey(now);
  if (s.lastDay === today) return;
  if (s.lastDay === null) s.current = 1;
  else {
    const gap = dayNum(today) - dayNum(s.lastDay);
    s.current = gap <= 2 ? s.current + 1 : 1;
  }
  s.lastDay = today;
  s.totalDays++;
  s.best = Math.max(s.best, s.current);
}
