// QArt - kit graphique "La Leyenda del Quetzal" (SOURCE UNIQUE, parties dans art/core/src/*.js).
// Fonctions pures : chaque builder renvoie une chaine SVG. `node scripts/cinematics.mjs art` concatene les parties en :
//   - apps/espagnol/src/art/core/qart.js                 (ESM, importe par les composants Svelte)
//   - apps/espagnol/public/cinematics/_shared/qart.js    (IIFE -> window.QArt, utilise par les compositions HyperFrames)
// Regles : pas d'import, `export` uniquement en debut de ligne, pas de Math.random / Date.now (determinisme HyperFrames).
// Tout SVG prend un `uid` (ids de gradients/clipPaths uniques). Parties animables : classes `q-*` (quetzal), `s-*` (sombra), `m-*` (carte).

export const PAL = {
  nuit: '#14173F', nuit2: '#1D2160', nuit3: '#2B318A', encre: '#0B0D2A',
  terracotta: '#C9573B', terracotta2: '#9E3D29', sol: '#FFC83D', sol2: '#FF9F1C',
  turquesa: '#19B7AA', turquesa2: '#0E7F82', magenta: '#D93472', magenta2: '#8F1D4E',
  quetzal: '#0E9F6E', quetzal2: '#066A4A', quetzalClaro: '#42E0A0', rojo: '#D81E3A',
  papel: '#F5E6C8', papel2: '#E6CE9F', carbon: '#201A2B', niebla: '#8F93C7',
};
export const RARITY = {
  comun: { c: '#9AA3C7', glow: 0, label: 'común' },
  raro: { c: '#35B8FF', glow: 1, label: 'raro' },
  epico: { c: '#C65BFF', glow: 2, label: 'épico' },
  legendario: { c: '#FFC83D', glow: 3, label: 'legendario' },
};

export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
let _uid = 0;
export function uid(p) { _uid += 1; return (p || 'q') + _uid; }
export function rng(seed) { // mulberry32 : deterministe
  let a = seed >>> 0;
  return function () { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function hex2rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgb2hex(r, g, b) { return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
export function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
export function shade(c, amt) { return amt >= 0 ? mix(c, '#ffffff', amt) : mix(c, '#000000', -amt); }
export function r1(n) { return Math.round(n * 10) / 10; }
/** Chemin lisse (Catmull-Rom -> Bezier) passant par les points [[x,y],...]. */
export function smooth(pts, closed) {
  const n = pts.length; if (n < 3) return 'M' + pts.map((p) => p.join(' ')).join('L');
  const P = (i) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  let d = 'M' + r1(pts[0][0]) + ' ' + r1(pts[0][1]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += 'C' + r1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + r1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + r1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + r1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + r1(p2[0]) + ' ' + r1(p2[1]);
  }
  return d + (closed ? 'Z' : '');
}
