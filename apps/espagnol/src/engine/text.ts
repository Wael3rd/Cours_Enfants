/** Normalisation et distances de texte (espagnol). Pur. */

const PUNCT = /[¿¡?!.,;:"'«»()\[\]{}…‘’“”\-–—_/\*]/g;

/** minuscules (NFC), sans ponctuation, espaces compactes. Les accents sont CONSERVES. */
export function normalize(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
}

/** Retire accents et trema (a e i o u u) mais CONSERVE le n tilde (ano != año). */
export function foldAccents(s: string): string {
  return s
    .normalize('NFC')
    .replace(/ñ/g, '\u0001')
    .replace(/Ñ/g, '\u0002')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\u0001/g, 'ñ')
    .replace(/\u0002/g, 'Ñ')
    .normalize('NFC');
}

/** Pliage total (reconnaissance vocale : le ñ est aussi plie). */
export function foldAll(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}

export const tokens = (s: string): string[] => (s ? s.split(' ') : []);

/** Distance de Damerau-Levenshtein (transposition = 1). */
export function editDistance(a: string, b: string): number {
  const n = a.length;
  const m = b.length;
  if (!n) return m;
  if (!m) return n;
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => [i, ...new Array<number>(m).fill(0)]);
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[n][m];
}

/** Similarite relative 0..1 (1 = identique). */
export function similarity(a: string, b: string): number {
  const L = Math.max(a.length, b.length);
  return L ? 1 - editDistance(a, b) / L : 1;
}

/** Nombre d'erreurs de frappe toleres selon la longueur : <5 -> 0, 5-11 -> 1, >=12 -> 2. */
export function typoBudget(len: number): number {
  return len < 5 ? 0 : len < 12 ? 1 : 2;
}

// ---- nombres (reconnaissance vocale : "3" -> "tres")
const UNITS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

/** 0..100 -> mots espagnols ("34" -> "treinta y cuatro"). Hors plage : renvoie le nombre tel quel. */
export function numberToWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 100) return String(n);
  if (n < 30) return UNITS[n];
  if (n === 100) return 'cien';
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u ? `${TENS[t]} y ${UNITS[u]}` : TENS[t];
}

/** Mots espagnols -> entier (0..100) ou null. Accepte les accents manquants. */
export function wordsToNumber(s: string): number | null {
  const t = foldAll(normalize(s));
  if (/^\d{1,3}$/.test(t)) return Number(t);
  for (let i = 0; i <= 100; i++) if (foldAll(numberToWords(i)) === t) return i;
  return null;
}

/** Remplace les chiffres isoles par leurs mots (pour comparer des transcriptions). */
export function digitsToWords(s: string): string {
  return s.replace(/\b\d{1,3}\b/g, (m) => numberToWords(Number(m)));
}
