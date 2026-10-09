// CEArt - kit graphique "habillage TV foot pour enfants" (SOURCE UNIQUE, parties dans art/core/src/*.js).
// Fonctions pures : chaque builder renvoie une chaine SVG. `node scripts/cinematics.mjs art` concatene les parties en :
//   - apps/maths/src/art/core/ceart.js          (ESM, importe par les composants Svelte)
//   - apps/maths/public/cinematics/_shared/ceart.js  (IIFE -> window.CEArt, utilise par les compositions HyperFrames)
// Regles : pas d'import, `export` uniquement en debut de ligne, pas de Math.random / Date.now.
// Tout SVG a un `uid` (ids de gradients/clipPaths uniques) ; les parties animables ont des classes `p-*`, `st-*`...

export const PAL = {
  nuit: '#070C2B', nuit2: '#0E1A55', nuit3: '#1B2C86', pelouse: '#0F8F42', pelouse2: '#0B6B31', pelouseSombre: '#06361A',
  jaune: '#FFD23F', orange: '#FF8A1F', corail: '#FF4D6D', cyan: '#35D6FF', blanc: '#F7F9FF', encre: '#0A1030',
};
export const SKINS = ['#FFDDBF', '#F3BC92', '#D89A6C', '#B97A50', '#8B5A3B', '#5D3A26'];
export const HAIRS = ['#2A1A12', '#5A3A22', '#B7742E', '#E3B04B', '#C8381E', '#1C1C24', '#F1F1F1'];

export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
let _uid = 0;
export function uid(p) { _uid += 1; return (p || 'u') + _uid; }
export function rng(seed) { // mulberry32 : deterministe
  let a = seed >>> 0;
  return function () { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function hex2rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgb2hex(r, g, b) { return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
export function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
export function shade(c, amt) { return amt >= 0 ? mix(c, '#ffffff', amt) : mix(c, '#000000', -amt); }
export function lum(c) { const [r, g, b] = hex2rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
export function textOn(c) { return lum(c) > 0.42 ? '#0A1030' : '#FFFFFF'; }
export function initialsOf(name) { const w = String(name || '?').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[1][0] : String(name || '?').slice(0, 2)).toUpperCase(); }

/** Repositionne un SVG imbrique : remplace width/height du tag racine et ajoute x/y. */
export function nest(svg, x, y, w, h) {
  return svg.replace(/<svg ([^>]*)>/, (m, a) => '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" ' + a.replace(/\s(width|height)="[^"]*"/g, '') + '>');
}
