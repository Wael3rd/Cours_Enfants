/** Logique pure du clavier d'accents (á é í ó ú ü ñ ¿ ¡) pour les exercices d'ecriture. */

export const ACCENT_ROW = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'] as const;

export interface EditState {
  value: string;
  /** selection (indices UTF-16) */
  start: number;
  end: number;
  /** majuscule active pour la prochaine lettre */
  shift: boolean;
}

export type Key = { kind: 'char'; ch: string } | { kind: 'backspace' } | { kind: 'shift' } | { kind: 'clear' };

export const upper = (ch: string) => ch.toLocaleUpperCase('es-ES');

/** Touches affichees (majuscule si shift ; ¿ ¡ restent tels quels). */
export function layout(shift: boolean): string[] {
  return ACCENT_ROW.map((c) => (shift ? upper(c) : c));
}

/** Applique une touche : insere a la position du curseur (remplace la selection), gere retour arriere et majuscule. */
export function applyKey(st: EditState, key: Key): EditState {
  const { value, start, end } = st;
  switch (key.kind) {
    case 'shift':
      return { ...st, shift: !st.shift };
    case 'clear':
      return { value: '', start: 0, end: 0, shift: false };
    case 'backspace': {
      if (start !== end) return { ...st, value: value.slice(0, start) + value.slice(end), start, end: start };
      if (start === 0) return st;
      // supprime un caractere complet (gere les paires de substitution)
      const prev = Array.from(value.slice(0, start)).slice(0, -1).join('');
      return { ...st, value: prev + value.slice(end), start: prev.length, end: prev.length };
    }
    case 'char': {
      const ch = st.shift ? upper(key.ch) : key.ch;
      const next = value.slice(0, start) + ch + value.slice(end);
      const pos = start + ch.length;
      return { value: next, start: pos, end: pos, shift: false };
    }
  }
}

/** Majuscule automatique en debut de saisie (pour les prenoms). */
export const initialState = (value = '', autoShift = false): EditState => ({ value, start: value.length, end: value.length, shift: autoShift && !value });

/** Lettres utiles pour l'etape : accents presents dans la reponse attendue (pour mettre en avant ces touches). */
export function neededKeys(expected: string): string[] {
  const set = new Set<string>();
  for (const ch of expected.toLowerCase()) if ((ACCENT_ROW as readonly string[]).includes(ch)) set.add(ch);
  return [...set];
}
