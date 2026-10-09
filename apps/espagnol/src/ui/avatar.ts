import characters from '../content/characters.json';
import type { Personaje } from '../content/schema';
import { emojiUrl } from './emoji';

/** Avatar du joueur : `profile.avatar.base` = "<tipo>:<teinte>" (ex. "chico:3"). Teinte 0 = emoji jaune par defaut. */
export const AVATAR_TIPOS = [
  { id: 'chico', emoji: '👦', label: 'Chico' },
  { id: 'chica', emoji: '👧', label: 'Chica' },
  { id: 'joven', emoji: '🧑', label: 'Joven' },
  { id: 'peque', emoji: '🧒', label: 'Peque' },
] as const;
export const TONES = ['', '🏻', '🏼', '🏽', '🏾', '🏿'] as const;
/** Couleurs de pastille pour le choix de teinte. */
export const TONE_COLORS = ['#ffcc33', '#f7d7c4', '#e7b98f', '#bf8f68', '#9b643d', '#594539'] as const;

export function parseAvatar(base: string | undefined): { tipo: (typeof AVATAR_TIPOS)[number]; tone: number } {
  const [t, n] = (base ?? '').split(':');
  const tipo = AVATAR_TIPOS.find((x) => x.id === t) ?? AVATAR_TIPOS[0];
  const tone = Math.max(0, Math.min(TONES.length - 1, Number(n) || 0));
  return { tipo, tone };
}

export const avatarKey = (tipo: string, tone: number) => `${tipo}:${tone}`;

/** Emoji (caractere) de l'avatar. */
export function avatarEmoji(base: string | undefined): string {
  const { tipo, tone } = parseAvatar(base);
  return tipo.emoji + TONES[tone];
}

export const avatarUrl = (base: string | undefined) => emojiUrl(avatarEmoji(base));

const chars = characters as unknown as Personaje[];
export const character = (id: string) => chars.find((c) => c.id === id);

/** Portrait (URL) d'un personnage ; le joueur ("viajero") prend son avatar. */
export function portraitOf(id: string, avatarBase?: string): string | undefined {
  if (id === 'viajero') return avatarUrl(avatarBase);
  const c = character(id);
  return c ? emojiUrl(c.emoji) : undefined;
}

/** Couleur d'accent de la plaque de nom par personnage. */
export const ACCENT: Record<string, string> = {
  ignacio: '#ffc83d',
  marina: '#ff7aa8',
  quetzal: '#42e0a0',
  sombra: '#a99bff',
  narrador: '#ffc83d',
  viajero: '#7ff3e4',
};
export const accentOf = (id: string) => ACCENT[id] ?? '#ffc83d';
