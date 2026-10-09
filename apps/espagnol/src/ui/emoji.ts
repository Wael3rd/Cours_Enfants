import map from '../art/emoji-map.json';

const BASE = `${import.meta.env?.BASE_URL ?? '/espagnol/'}img/emoji/`;
const strip = (s: string) => s.replace(/️/g, '');
/** Emojis absents de Fluent 3D -> equivalent proche. */
const ALIAS: Record<string, string> = { '👪': '🫂', '👫': '🫂', '🧑‍🤝‍🧑': '🫂', '👩‍👧': '👩', '👨‍👦': '👨', '🧑‍🎒': '🧒' };
const names = map as Record<string, string>;

/** URL de l'image Fluent 3D d'un emoji (undefined si absent : drapeaux, etc.). */
export function emojiUrl(e: string | undefined): string | undefined {
  if (!e) return undefined;
  const f = names[strip(e)] ?? names[strip(ALIAS[e] ?? '')];
  return f ? BASE + f : undefined;
}
