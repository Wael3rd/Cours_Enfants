import map from '../art/emoji-map.json';

const BASE = `${import.meta.env?.BASE_URL ?? '/espagnol/'}img/emoji/`;
const strip = (s: string) => s.replace(/️/g, '');
/** Emojis absents de Fluent 3D -> equivalent proche. */
const ALIAS: Record<string, string> = { '👪': '🫂', '👫': '🫂', '🧑‍🤝‍🧑': '🫂', '👩‍👧': '👩', '👨‍👦': '👨', '🧑‍🎒': '🧒' };
const names = map as Record<string, string>;
/** Emojis dont l'image contient du TEXTE anglais (« SOON », « NEW », « OK »...) : jamais affiches, carte typographique a la place. */
const TEXT_EMOJI = new Set(['🔜', '🔚', '🔙', '🔛', '🔝', '🆕', '🆓', '🆗', '🆒', '🆙', '🆖', '🆘', '🆚', '🔞', '🅰', '🅱', '🅾', '🅿', 'ℹ', '🔤', '🔡', '🔠', '🔢', '🔣', '🛅', '🈁', '🈂']);

/** Emoji a texte anglais (pas d'image ni de glyphe natif : remplace par une bulle 💬 dans les composants d'image). */
export const isTextEmoji = (e: string | undefined) => !!e && TEXT_EMOJI.has(strip(e));

/** URL de l'image Fluent 3D d'un emoji (undefined si absent : drapeaux, etc.). */
export function emojiUrl(e: string | undefined): string | undefined {
  if (!e || TEXT_EMOJI.has(strip(e))) return undefined;
  const f = names[strip(e)] ?? names[strip(ALIAS[e] ?? '')];
  return f ? BASE + f : undefined;
}
