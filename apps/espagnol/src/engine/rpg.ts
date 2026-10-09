import { STAT_POR_DEFECTO, STATS, type StatId, type Step, type StepTipo, type Unit, type Vocab } from '../content/schema';
import type { Content, GameState, StepResult } from './types';
import { mastery } from './srs';

// ───────── XP ─────────
/** XP de base d'une etape reussie a 100 %. */
export const BASE_XP: Record<StepTipo, number> = {
  flashcard: 2,
  match_image: 6,
  listen_choose: 5,
  dictado: 8,
  fill_blank: 6,
  reorder_words: 7,
  conjugar: 7,
  dialogue_choice: 6,
  read_answer: 3, // par question
  speak: 10,
  true_false: 4,
  grammar_card: 3,
  write_free: 10,
  cinematic_ref: 3,
};
export const NO_HINT_BONUS = 0.25;
export const QUEST_BONUS = 20;
export const UNIT_BONUS = 100;
export const MISSION_BONUS = 25;

export const statOf = (step: Step): StatId => step.stat ?? STAT_POR_DEFECTO[step.tipo];

export interface XpGain {
  stat: StatId;
  xp: number;
  /** bonus "sans pista" inclus dans xp */
  bonus: number;
}

export function xpFor(step: Step, result: StepResult, hints: number): XpGain {
  const base = step.tipo === 'read_answer' ? BASE_XP.read_answer * step.preguntas.length : BASE_XP[step.tipo];
  const main = Math.round(base * result.score);
  const bonus = hints === 0 && result.score >= 0.99 ? Math.round(main * NO_HINT_BONUS) : 0;
  return { stat: statOf(step), xp: main + bonus, bonus };
}

// ───────── Niveaux ─────────
/** XP cumule pour ATTEINDRE le niveau L : k * L * (L-1) / 2  (L=2 -> k, L=3 -> 3k, L=4 -> 6k). */
export const xpAtLevel = (level: number, k: number) => (k * level * (level - 1)) / 2;
export const STAT_K = 60;
export const PLAYER_K = 200;

export interface LevelInfo {
  level: number;
  /** xp dans le niveau courant */
  into: number;
  /** xp necessaire pour passer au niveau suivant */
  span: number;
  progress: number;
}

export function levelInfo(xp: number, k: number): LevelInfo {
  let level = 1;
  while (xpAtLevel(level + 1, k) <= xp) level++;
  const lo = xpAtLevel(level, k);
  const span = xpAtLevel(level + 1, k) - lo;
  return { level, into: xp - lo, span, progress: (xp - lo) / span };
}

export const totalXp = (xp: Record<StatId, number>) => STATS.reduce((s, k) => s + (xp[k] ?? 0), 0);
export const playerLevel = (s: GameState) => levelInfo(totalXp(s.xp), PLAYER_K);
export const statLevel = (s: GameState, stat: StatId) => levelInfo(s.xp[stat] ?? 0, STAT_K);

// ───────── Inventaire ─────────
export type Rarity = 'comun' | 'poco_comun' | 'raro' | 'epico' | 'legendario';
export const RARITY_LABEL: Record<Rarity, string> = { comun: 'Común', poco_comun: 'Poco común', raro: 'Raro', epico: 'Épico', legendario: 'Legendario' };
export const MASTERY_LABEL = ['Desconocida', 'Descubierta', 'En práctica', 'Conocida', 'Sólida', 'Maestra'];

/** Rarete deterministe : nombre de lettres, +1 palier si n tilde / trema, expression de 3 mots+ = au moins epico. */
export function rarityOf(v: Vocab): Rarity {
  const letters = v.es.replace(/[^\p{L}]/gu, '').length;
  let t = letters <= 4 ? 0 : letters <= 6 ? 1 : letters <= 8 ? 2 : letters <= 10 ? 3 : 4;
  if (/[ñü]/i.test(v.es) && t < 4) t++;
  if (v.es.trim().split(/\s+/).length >= 3) t = Math.max(t, 3);
  return (['comun', 'poco_comun', 'raro', 'epico', 'legendario'] as const)[t];
}

export interface InventoryCard {
  vocab: Vocab & { unitId: string };
  rarity: Rarity;
  mastery: number;
  due: string | null;
  discoveredAt: string;
}

/** Cartes decouvertes (une par mot), maitrise liee a la repetition espacee. */
export function inventory(c: Content, s: GameState): InventoryCard[] {
  const out: InventoryCard[] = [];
  for (const [id, at] of Object.entries(s.discovered)) {
    const vocab = c.vocab.get(id);
    if (!vocab) continue;
    const card = s.srs[`v:${id}`];
    out.push({ vocab, rarity: rarityOf(vocab), mastery: mastery(card), due: card?.due ?? null, discoveredAt: at });
  }
  return out;
}

// ───────── Avatar ─────────
export interface AvatarItem {
  id: string;
  nombre: string;
  emoji: string;
  slot: 'atuendo' | 'accesorio';
}

const REGION_ITEMS: [RegExp, string, string][] = [
  [/madrid/i, 'Capa de la Academia', '🧥'],
  [/salamanca/i, 'Birrete de Salamanca', '🎓'],
  [/sevilla/i, 'Flor de Sevilla', '🌹'],
  [/m[eé]xico|coyoac/i, 'Poncho mexicano', '🧣'],
  [/oaxaca/i, 'Máscara de calavera', '💀'],
  [/valencia/i, 'Abanico de Valencia', '🪭'],
  [/buenos aires/i, 'Camiseta de Boca', '⚽'],
  [/bogot/i, 'Sombrero vueltiao', '👒'],
  [/yucat/i, 'Pluma maya', '🪶'],
  [/cusco|andes/i, 'Chullo andino', '🧢'],
];

/** Element d'avatar debloque en recuperant la plume d'une region. */
export function avatarRewardForUnit(u: Unit): AvatarItem {
  const hay = `${u.lugar} ${u.titulo}`;
  const hit = REGION_ITEMS.find(([re]) => re.test(hay));
  return { id: `av-${u.id}`, nombre: hit?.[1] ?? `Atuendo de ${u.lugar}`, emoji: hit?.[2] ?? u.emoji, slot: 'atuendo' };
}

/** Accessoires lies au niveau du joueur. */
export const LEVEL_ITEMS: { level: number; item: AvatarItem }[] = [
  { level: 3, item: { id: 'lv-3', nombre: 'Brújula de viajero', emoji: '🧭', slot: 'accesorio' } },
  { level: 6, item: { id: 'lv-6', nombre: 'Gafas de aventura', emoji: '🥽', slot: 'accesorio' } },
  { level: 10, item: { id: 'lv-10', nombre: 'Corona del Quetzal', emoji: '👑', slot: 'accesorio' } },
];

export function allAvatarItems(c: Content): AvatarItem[] {
  return [...c.units.map(avatarRewardForUnit), ...LEVEL_ITEMS.map((l) => l.item)];
}
