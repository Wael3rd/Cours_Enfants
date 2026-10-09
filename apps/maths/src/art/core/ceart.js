// GENERE par scripts/cinematics.mjs (art) depuis art/core/src/*.js - ne pas editer.
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

// ---------------------------------------------------------------- footballeur "grosse tete"
// Chaque articulation = <g class="p-xxx" transform="translate(pivot)"><g class="j">contenu en coordonnees absolues</g></g>
// -> on anime `.j` (rotation autour de son origine locale = le pivot) avec GSAP `svgOrigin:"0 0"`.
// Convention des angles : armL/armR/legL/legR = ecart "vers l'exterieur" en degres (>0 : le bras s'ecarte du corps).
export const POSES = {
  idle:        { armL: 9,   armR: 9,   legL: 2,   legR: 2,   lean: 0,  tilt: 0,  y: 0,   sy: 1,    rot: 0,  expr: 'smile' },
  course:      { armL: 52,  armR: -22, legL: 26,  legR: -8,  lean: 6,  tilt: 3,  y: -10, sy: 1,    rot: 0,  expr: 'determined' },
  frappe:      { armL: 74,  armR: -24, legL: 4,   legR: -52, lean: -9, tilt: -4, y: 0,   sy: 1,    rot: 0,  expr: 'focus' },
  celebration: { armL: 158, armR: 158, legL: 16,  legR: 16,  lean: 0,  tilt: -5, y: -46, sy: 1.03, rot: 0,  expr: 'shout' },
  decu:        { armL: 3,   armR: 3,   legL: 0,   legR: 0,   lean: 4,  tilt: 12, y: 8,   sy: 0.96, rot: 0,  expr: 'sad' },
  attente:     { armL: 58,  armR: 58,  legL: 15,  legR: 15,  lean: 0,  tilt: 0,  y: 14,  sy: 0.93, rot: 0,  expr: 'determined' },
  plongeon:    { armL: 168, armR: 168, legL: 22,  legR: 6,   lean: 0,  tilt: -6, y: -40, sy: 1,    rot: 74, expr: 'focus' },
  explique:    { armL: 20,  armR: -78, legL: 3,   legR: 3,   lean: 0,  tilt: -4, y: 0,   sy: 1,    rot: 0,  expr: 'smile' },
};
const PART_SEL = { armL: '.p-armL .j', armR: '.p-armR .j', legL: '.p-legL .j', legR: '.p-legR .j', body: '.p-body .j', head: '.p-head .j', rig: '.p-rig' };

function hairSvg(style, c, cd) {
  const hl = shade(c, 0.28);
  switch (style) {
    case 'boucles': {
      let back = '';
      const pts = [[104, 120, 44], [128, 84, 46], [170, 62, 48], [214, 58, 48], [258, 70, 46], [292, 100, 44], [310, 142, 40], [92, 160, 36], [316, 176, 28], [84, 190, 22]];
      pts.forEach((p) => { back += `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}"/>`; });
      back += `<ellipse cx="200" cy="108" rx="112" ry="52" fill="${c}"/>`;
      let front = `<path d="M96 150 C100 112 140 96 200 96 C260 96 300 112 304 150 C284 128 250 120 200 120 C150 120 116 128 96 150Z" fill="${c}"/>`;
      [[150, 84], [200, 74], [250, 84], [120, 110], [282, 112]].forEach((p) => { front += `<path d="M${p[0] - 14} ${p[1]} q14 -12 28 0" stroke="${hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>`; });
      return { back, front };
    }
    case 'pique':
      return { back: '', front: `<path d="M88 150 L94 92 L128 118 L136 56 L168 102 L200 38 L232 102 L264 56 L272 118 L306 92 L312 150 C290 124 256 112 200 112 C144 112 110 124 88 150Z" fill="${c}"/><path d="M168 102 L200 38 L200 112Z" fill="${cd}" opacity=".35"/><path d="M130 100 L136 70" stroke="${hl}" stroke-width="5" stroke-linecap="round" opacity=".6"/>` };
    case 'long':
      return {
        back: `<path d="M76 170 C70 92 126 50 200 50 C274 50 330 92 324 170 C330 240 326 300 300 336 C282 322 280 290 278 250 L122 250 C120 290 118 322 100 336 C74 300 70 240 76 170Z" fill="${c}"/>`,
        front: `<path d="M86 160 C86 100 134 66 204 66 C268 66 312 100 314 160 C300 128 270 106 232 108 C250 126 214 138 176 120 C150 112 112 124 86 160Z" fill="${c}"/><path d="M120 92 C150 76 180 72 214 74" stroke="${hl}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>`,
      };
    default: // court
      return { back: '', front: `<path d="M84 156 C80 90 134 52 200 52 C266 52 322 90 316 156 C304 128 284 112 262 112 C236 98 206 120 178 106 C150 100 122 118 110 128 C100 134 90 144 84 156Z" fill="${c}"/><path d="M122 84 C150 64 190 58 226 62" stroke="${hl}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M178 106 C196 96 214 104 236 100" stroke="${cd}" stroke-width="4" fill="none" opacity=".35"/>` };
  }
}

function legSvg(cx, d, o) {
  const coach = o.role === 'coach';
  const body = coach
    ? `<path d="M${cx - 28} 392 h56 v118 h-56z" fill="${o.shorts}"/><rect x="${cx - 28}" y="498" width="56" height="12" fill="${shade(o.shorts, -0.2)}"/>`
    : `<path d="M${cx - 28} 392 h56 v46 q0 6 -6 6 h-44 q-6 0 -6 -6z" fill="${o.shorts}"/><rect x="${cx - 28}" y="430" width="56" height="8" fill="${o.trim}"/>` +
      `<rect x="${cx - 17}" y="438" width="34" height="22" fill="${o.skin}"/><rect x="${cx - 20}" y="456" width="40" height="54" fill="${o.socks}"/><rect x="${cx - 20}" y="468" width="40" height="8" fill="${o.socks2}"/>`;
  const shoe = `<g transform="translate(${cx},0) scale(${d},1)"><path d="M-23 504 L21 504 C35 512 53 526 55 542 Q55 553 45 553 L-21 553 Q-27 553 -27 545 Z" fill="${o.shoe}"/><path d="M-27 543 H55 V548 Q55 554 48 554 H-22 Q-27 554 -27 548Z" fill="#fff"/><path d="M6 508 l10 -2 M10 515 l10 -2 M15 522 l9 -1" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M-23 520 C-10 516 4 522 14 534" stroke="${shade(o.shoe, 0.35)}" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  return `<g class="p-leg${d < 0 ? 'L' : 'R'}" transform="translate(${cx},392)"><g class="j"><g transform="translate(${-cx},-392)">${body}${shoe}</g></g></g>`;
}

function armSvg(cx, d, o) {
  const keeper = o.role === 'gardien';
  const hand = keeper
    ? `<ellipse cx="${cx}" cy="392" rx="24" ry="26" fill="${o.glove}"/><rect x="${cx - 18}" y="372" width="36" height="9" rx="4" fill="${o.glove2}"/><path d="M${cx - 10} 396 v-14 M${cx} 398 v-16 M${cx + 10} 396 v-14" stroke="${shade(o.glove, -0.22)}" stroke-width="3" stroke-linecap="round"/>`
    : `<circle cx="${cx}" cy="388" r="17" fill="${o.skin}"/><path d="M${cx - 6} 396 q6 6 12 0" stroke="${o.skinD}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const forearm = o.role === 'coach' ? `<rect x="${cx - 14}" y="326" width="28" height="54" rx="12" fill="${o.primary}"/>` : `<rect x="${cx - 13}" y="332" width="26" height="50" rx="12" fill="${o.skin}"/>`;
  const sleeve = o.role === 'coach'
    ? `<rect x="${cx - 19}" y="290" width="38" height="70" rx="16" fill="${o.primary}"/><rect x="${cx - 19}" y="348" width="38" height="10" fill="${o.secondary}"/>`
    : `<rect x="${cx - 20}" y="290" width="40" height="52" rx="16" fill="${o.primary}"/><rect x="${cx - 20}" y="330" width="40" height="10" fill="${o.secondary}"/>`;
  return `<g class="p-arm${d < 0 ? 'L' : 'R'}" transform="translate(${cx},304)"><g class="j"><g transform="translate(${-cx},-304)">${forearm}${hand}${sleeve}</g></g></g>`;
}

function exprSvg(o) {
  const brow = (p) => `<path d="${p}" stroke="${o.brow}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  const dk = '#2a1418';
  const E = {};
  E.smile = brow('M122 148 Q152 128 182 142') + brow('M218 142 Q248 128 278 148') +
    `<path d="M158 238 Q200 296 242 238 Q200 250 158 238Z" fill="#6b1d2a"/><path d="M162 240 Q200 254 238 240 Q233 252 200 256 Q167 252 162 240Z" fill="#fff"/><ellipse cx="200" cy="270" rx="17" ry="7" fill="#ff7a8c"/>`;
  E.determined = brow('M120 140 Q150 148 184 162') + brow('M216 162 Q250 148 280 140') +
    `<path d="M166 252 Q198 266 236 244" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M236 244 q8 -4 10 -12" stroke="${dk}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  E.focus = brow('M120 140 Q150 148 184 162') + brow('M216 162 Q250 148 280 140') +
    `<rect x="170" y="242" width="60" height="26" rx="10" fill="#fff" stroke="${dk}" stroke-width="5"/><path d="M190 242 v26 M210 242 v26 M170 255 h60" stroke="${dk}" stroke-width="3"/>`;
  E.shout = brow('M120 134 Q152 112 184 130') + brow('M216 130 Q248 112 280 134') +
    `<path d="M148 236 Q200 252 252 236 Q256 302 200 312 Q144 302 148 236Z" fill="#6b1d2a"/><path d="M152 238 Q200 254 248 238 Q246 252 200 258 Q154 252 152 238Z" fill="#fff"/><ellipse cx="200" cy="290" rx="26" ry="14" fill="#ff7a8c"/>`;
  E.sad = brow('M122 158 Q150 152 184 138') + brow('M216 138 Q250 152 278 158') +
    `<path d="M164 266 Q200 236 236 266" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M262 206 q-11 18 0 30 q11 -12 0 -30z" fill="#7fdcff" stroke="#fff" stroke-width="2"/>`;
  return Object.keys(E).map((k) => `<g class="p-expr p-expr-${k}" opacity="${k === o.expr ? 1 : 0}">${E[k]}</g>`).join('');
}

/** Footballeur. opts : role('joueur'|'gardien'|'coach'), primary, secondary, shorts, socks, skin(0-5|hex), hair('court'|'boucles'|'pique'|'long'),
 *  hairColor(0-6|hex), number, kit('uni'|'rayures'|'cerceaux'|'bande'), pose, expr, look(-1..1), uid, width, height. */
export function player(opts) {
  opts = opts || {};
  const role = opts.role || 'joueur';
  const u = opts.uid || uid('pl');
  const primary = opts.primary || '#E8212F', secondary = opts.secondary || '#FFFFFF';
  const skin = typeof opts.skin === 'number' ? SKINS[opts.skin % SKINS.length] : opts.skin || SKINS[1];
  const hair = typeof opts.hairColor === 'number' ? HAIRS[opts.hairColor % HAIRS.length] : opts.hairColor || HAIRS[0];
  const o = {
    role, primary, secondary, skin, skinD: shade(skin, -0.2),
    shorts: opts.shorts || (role === 'coach' ? '#1B2440' : lum(primary) > 0.5 ? '#13204f' : '#FFFFFF'),
    trim: opts.trim || secondary, socks: opts.socks || primary, socks2: opts.socks2 || secondary,
    shoe: opts.shoe || '#121528', glove: opts.glove || '#FFD23F', glove2: opts.glove2 || '#FF4D6D', brow: shade(hair, -0.25),
    expr: opts.expr || (POSES[opts.pose || 'idle'] || POSES.idle).expr,
  };
  const kit = opts.kit || 'uni';
  const numC = lum(primary) > 0.5 ? '#0A1030' : '#FFFFFF', numS = lum(primary) > 0.5 ? '#FFFFFF' : '#0A1030';
  const jersey = 'M146 300 Q146 286 170 284 L230 284 Q254 286 254 300 L260 402 Q260 414 248 414 L152 414 Q140 414 140 402 Z';
  let pat = '';
  if (kit === 'rayures') for (let x = 140; x < 262; x += 30) pat += `<rect x="${x}" y="280" width="15" height="140" fill="${secondary}"/>`;
  if (kit === 'cerceaux') for (let y = 300; y < 414; y += 34) pat += `<rect x="130" y="${y}" width="140" height="16" fill="${secondary}"/>`;
  if (kit === 'bande') pat = `<polygon points="120,322 270,276 270,318 120,364" fill="${secondary}"/>`;
  // Lisibilite de tous les tons : contour clair sur cheveux sombres, ombre portee sous la frange, reflets sur peau foncee.
  const darkHair = lum(hair) < 0.07, darkSkin = lum(skin) < 0.22;
  const rim = darkHair ? shade(hair, 0.55) : shade(hair, -0.4);
  const hairShade = `<path d="M90 156 C104 112 296 112 310 156 L310 190 C270 160 130 160 90 190Z" fill="#000" opacity="${darkSkin ? 0.3 : 0.12}"/>`;
  const faceLight = darkSkin
    ? `<ellipse cx="200" cy="124" rx="70" ry="22" fill="#fff" opacity=".13"/><ellipse cx="126" cy="214" rx="26" ry="18" fill="#fff" opacity=".16"/><ellipse cx="274" cy="214" rx="26" ry="18" fill="#fff" opacity=".16"/><ellipse cx="200" cy="224" rx="14" ry="9" fill="#fff" opacity=".18"/>`
    : '';
  const hs = hairSvg(opts.hair || 'court', hair, shade(hair, -0.3));
  const cap = role === 'coach'
    ? `<path d="M88 150 C84 84 134 52 200 52 C266 52 316 84 312 150 L88 150Z" fill="${secondary}"/><path d="M88 150 C140 138 260 138 312 150 L312 158 C260 148 140 148 88 158Z" fill="${shade(secondary, -0.25)}"/><path d="M96 152 C130 176 270 176 330 148 C310 136 280 140 262 142Z" fill="${shade(secondary, -0.1)}"/><circle cx="200" cy="92" r="14" fill="${primary}"/>`
    : '';
  const mustache = role === 'coach' ? `<path d="M158 232 Q180 214 200 228 Q220 214 242 232 Q220 240 200 236 Q180 240 158 232Z" fill="${shade(hair, -0.1)}"/>` : '';
  const num = `<text x="200" y="378" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="62" fill="${numC}" stroke="${numS}" stroke-width="6" paint-order="stroke" class="p-num">${esc(opts.number == null ? (role === 'gardien' ? '1' : '') : opts.number)}</text>`;
  const bodyDeco = role === 'coach'
    ? `<path d="M200 300 V414" stroke="${shade(primary, -0.3)}" stroke-width="4"/><path d="M176 286 L200 312 L224 286" fill="none" stroke="${secondary}" stroke-width="8" stroke-linejoin="round"/><path d="M172 288 Q200 346 228 288" stroke="#1B2440" stroke-width="4" fill="none"/><g class="p-whistle"><rect x="190" y="336" width="28" height="16" rx="8" fill="#C9D2E4"/><circle cx="195" cy="344" r="9" fill="#8E9AB8"/></g>`
    : `<path d="M174 285 L200 318 L226 285 Z" fill="${skin}"/><path d="M172 284 L200 322 L228 284" fill="none" stroke="${secondary}" stroke-width="8" stroke-linejoin="round"/>${num}`;
  const headScale = role === 'coach' ? 0.86 : 1;
  const look = opts.look || 0;
  const eye = (cx) => `<g class="p-eye-open"><ellipse cx="${cx}" cy="190" rx="28" ry="34" fill="#fff"/><circle cx="${cx + look * 7}" cy="197" r="19.5" fill="${opts.eye || '#3a2a20'}"/><circle cx="${cx + look * 7}" cy="197" r="10.5" fill="#0c0a10"/><circle cx="${cx + look * 7 - 7}" cy="188" r="6.5" fill="#fff"/><circle cx="${cx + look * 7 + 7}" cy="205" r="3" fill="#fff" opacity=".8"/><path d="M${cx - 29} 188 Q${cx} 148 ${cx + 29} 188" stroke="#2a1418" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  const happy = `<g class="p-eye-happy" opacity="0"><path d="M122 194 Q152 160 182 194" stroke="#2a1418" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M218 194 Q248 160 278 194" stroke="#2a1418" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-player" data-role="${role}" viewBox="0 0 400 600" width="${opts.width || 400}" height="${opts.height || 600}" style="overflow:visible">
<defs><radialGradient id="${u}f" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${shade(skin, 0.18)}"/><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${shade(skin, -0.14)}"/></radialGradient>
<linearGradient id="${u}j" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
<clipPath id="${u}c"><path d="${jersey}"/></clipPath></defs>
<g class="p-shadow"><ellipse cx="200" cy="558" rx="104" ry="16" fill="#000" opacity=".32"/></g>
<g class="p-rig">
${legSvg(168, -1, o)}${legSvg(232, 1, o)}
<g class="p-body" transform="translate(200,400)"><g class="j"><g transform="translate(-200,-400)">
<rect x="184" y="266" width="32" height="36" rx="10" fill="${skin}"/>
<path d="${jersey}" fill="${primary}"/><g clip-path="url(#${u}c)">${pat}</g><path d="${jersey}" fill="url(#${u}j)"/>
${bodyDeco}
<path d="M146 398 H254 L260 438 H140Z" fill="${o.shorts}"/><rect x="146" y="396" width="108" height="9" fill="${o.trim}" opacity=".9"/>
</g></g></g>
${armSvg(138, -1, o)}${armSvg(262, 1, o)}
<g class="p-head" transform="translate(200,290) scale(${headScale})"><g class="j"><g transform="translate(-200,-290)">
<g class="p-hair-back" stroke="${rim}" stroke-width="3" stroke-linejoin="round">${hs.back}</g>
<circle cx="82" cy="190" r="21" fill="${skin}" stroke="${shade(skin, -0.34)}" stroke-width="4"/><circle cx="82" cy="190" r="11" fill="${o.skinD}" opacity=".55"/><circle cx="318" cy="190" r="21" fill="${skin}" stroke="${shade(skin, -0.34)}" stroke-width="4"/><circle cx="318" cy="190" r="11" fill="${o.skinD}" opacity=".55"/>
<path d="M82 160 C82 98 130 58 200 58 C270 58 318 98 318 160 C318 232 270 286 200 286 C130 286 82 232 82 160Z" fill="url(#${u}f)" stroke="${shade(skin, -0.34)}" stroke-width="4"/>${faceLight}
<ellipse cx="124" cy="228" rx="23" ry="13" fill="#FF5E7A" opacity=".32"/><ellipse cx="276" cy="228" rx="23" ry="13" fill="#FF5E7A" opacity=".32"/>
<g class="p-eyes">${eye(152)}${eye(248)}${happy}</g>
<path d="M190 224 Q200 234 210 224" stroke="${shade(skin, -0.4)}" stroke-width="5" fill="none" stroke-linecap="round"/>
${mustache}
${exprSvg(o)}
${hairShade}<g class="p-hair-front" stroke="${rim}" stroke-width="3" stroke-linejoin="round">${hs.front}</g>${cap}
</g></g></g>
</g></svg>`;
}
export function gardien(opts) { return player(Object.assign({ role: 'gardien', primary: '#17B26A', secondary: '#0A1030', pose: 'attente', number: 1, kit: 'bande' }, opts)); }
export function coach(opts) { return player(Object.assign({ role: 'coach', primary: '#1B6BFF', secondary: '#FFFFFF', pose: 'explique', hair: 'court', hairColor: 4 }, opts)); }
/** Buste (tete + epaules) pour cartes joueurs : meme SVG, cadre rogne. */
export function bust(opts) { return player(opts).replace('viewBox="0 0 400 600"', 'viewBox="58 44 284 294"').replace('overflow:visible', 'overflow:hidden'); }

// ----- animation du rig (GSAP injecte : marche dans l'app ET dans une composition HyperFrames)
function q(svg, sel) { return svg.querySelector(sel); }
export function poseVars(name) { return POSES[name] || POSES.idle; }
function jv(extra) { return Object.assign({ svgOrigin: '0 0' }, extra); }
export function setExpr(gsap, svg, expr) {
  svg.querySelectorAll('.p-expr').forEach((g) => gsap.set(g, { opacity: g.classList.contains('p-expr-' + expr) ? 1 : 0 }));
  const happy = expr === 'shout';
  gsap.set(svg.querySelectorAll('.p-eye-open'), { opacity: happy ? 0 : 1 });
  gsap.set(svg.querySelectorAll('.p-eye-happy'), { opacity: happy ? 1 : 0 });
}
export function setPose(gsap, svg, name) {
  const p = poseVars(name);
  gsap.set(q(svg, PART_SEL.armL), jv({ rotation: p.armL }));
  gsap.set(q(svg, PART_SEL.armR), jv({ rotation: -p.armR }));
  gsap.set(q(svg, PART_SEL.legL), jv({ rotation: p.legL }));
  gsap.set(q(svg, PART_SEL.legR), jv({ rotation: -p.legR }));
  gsap.set(q(svg, PART_SEL.body), jv({ rotation: p.lean, scaleY: p.sy }));
  gsap.set(q(svg, PART_SEL.head), jv({ rotation: p.tilt + p.lean * 0.5 }));
  gsap.set(q(svg, PART_SEL.rig), { y: p.y, rotation: p.rot, svgOrigin: '200 400' });
  setExpr(gsap, svg, p.expr);
}
/** Ajoute a la timeline `tl` la transition vers une pose. */
export function toPose(gsap, tl, svg, name, at, dur, ease) {
  const p = poseVars(name); const e = ease || 'back.out(1.6)'; const d = dur == null ? 0.35 : dur;
  tl.to(q(svg, PART_SEL.armL), jv({ rotation: p.armL, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.armR), jv({ rotation: -p.armR, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.legL), jv({ rotation: p.legL, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.legR), jv({ rotation: -p.legR, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.body), jv({ rotation: p.lean, scaleY: p.sy, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.head), jv({ rotation: p.tilt + p.lean * 0.5, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.rig), { y: p.y, rotation: p.rot, svgOrigin: '200 400', duration: d, ease: e }, at);
  tl.call(() => setExpr(gsap, svg, p.expr), null, at + d * 0.3);
  return tl;
}
/** Respiration + clignement ; n cycles de 1,6 s entre `at` et `at+dur`. */
export function idleCycle(gsap, tl, svg, at, dur) {
  const n = Math.max(1, Math.floor(dur / 1.6));
  for (let i = 0; i < n; i++) {
    const t = at + i * 1.6;
    tl.to(q(svg, PART_SEL.body), jv({ scaleY: 1.03, duration: 0.8, ease: 'sine.inOut' }), t);
    tl.to(q(svg, PART_SEL.body), jv({ scaleY: 1, duration: 0.8, ease: 'sine.inOut' }), t + 0.8);
    tl.to(q(svg, PART_SEL.head), jv({ rotation: 1.6, duration: 0.8, ease: 'sine.inOut' }), t);
    tl.to(q(svg, PART_SEL.head), jv({ rotation: -1.2, duration: 0.8, ease: 'sine.inOut' }), t + 0.8);
    svg.querySelectorAll('.p-eye-open').forEach((e, k) => {
      tl.to(e, { scaleY: 0.08, svgOrigin: k ? '248 190' : '152 190', duration: 0.07, ease: 'power1.in' }, t + 1.15);
      tl.to(e, { scaleY: 1, svgOrigin: k ? '248 190' : '152 190', duration: 0.1, ease: 'power1.out' }, t + 1.22);
    });
  }
  return tl;
}
/** Course "en face" : alternance jambes / bras, rebond du corps et de la tete. `period` = duree d'un pas complet (s). */
export function runCycle(gsap, tl, svg, at, dur, period) {
  const T = period || 0.42; const h = T / 2; const n = Math.max(1, Math.round(dur / T));
  for (let i = 0; i < n; i++) {
    const t = at + i * T;
    [[0, 1], [h, -1]].forEach(([off, s]) => {
      const a = t + off;
      tl.to(q(svg, PART_SEL.legL), jv({ rotation: s > 0 ? 34 : -6, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.legR), jv({ rotation: s > 0 ? 6 : -34, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.armL), jv({ rotation: s > 0 ? -18 : 62, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.armR), jv({ rotation: s > 0 ? -62 : 18, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.rig), { y: -16, duration: h * 0.45, ease: 'power2.out', svgOrigin: '200 400' }, a);
      tl.to(q(svg, PART_SEL.rig), { y: 0, duration: h * 0.55, ease: 'power2.in', svgOrigin: '200 400' }, a + h * 0.45);
      tl.to(q(svg, PART_SEL.head), jv({ rotation: s * 3.5, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.body), jv({ rotation: s * -3, duration: h, ease: 'sine.inOut' }), a);
    });
  }
  return tl;
}

/** Apparence stable derivee d'un texte (meme prenom -> meme visage). Renvoie {hair, skin, hairColor, kit}. */
export function avatarOf(seed) {
  let h = 7; const s = String(seed || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return { hair: ['court', 'boucles', 'pique', 'long'][h % 4], skin: (h >> 3) % 6, hairColor: (h >> 6) % 7, kit: ['uni', 'rayures', 'bande', 'cerceaux'][(h >> 9) % 4] };
}

// ---------------------------------------------------------------- blason, ballon, cage
const SHIELD = 'M22 24 Q100 6 178 24 L178 120 C178 178 140 214 100 234 C60 214 22 178 22 120 Z';

/** Blason procedural. opts : primary, secondary, initials, pattern('auto'|'stripes'|'band'|'chevron'|'split'|'plain'), star(bool), uid, width, height. */
export function crest(opts) {
  opts = opts || {};
  const u = opts.uid || uid('cr');
  const p = opts.primary || '#E8212F', s = opts.secondary || '#FFFFFF';
  const ini = esc((opts.initials || 'FC').slice(0, 3).toUpperCase());
  let pat = opts.pattern || 'auto';
  if (pat === 'auto') { let h = 0; for (let i = 0; i < ini.length; i++) h += ini.charCodeAt(i); pat = ['stripes', 'band', 'chevron', 'split', 'stripes', 'band'][h % 6]; }
  let art = '';
  if (pat === 'stripes') for (let x = 28; x < 178; x += 36) art += `<rect x="${x}" y="0" width="18" height="260" fill="${s}"/>`;
  else if (pat === 'band') art = `<polygon points="0,170 220,70 220,118 0,218" fill="${s}"/>`;
  else if (pat === 'chevron') art = `<polygon points="0,96 100,168 200,96 200,140 100,212 0,140" fill="${s}"/>`;
  else if (pat === 'split') art = `<rect x="100" y="0" width="100" height="260" fill="${s}"/>`;
  const tc = pat === 'plain' ? textOn(p) : '#FFFFFF';
  const fs = ini.length >= 3 ? 70 : 92;
  const ink = shade(p, -0.62);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-crest" viewBox="0 0 200 250" width="${opts.width || 200}" height="${opts.height || 250}">
<defs><clipPath id="${u}k"><path d="${SHIELD}" transform="translate(100,128) scale(.9) translate(-100,-128)"/></clipPath>
<linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>
<path d="${SHIELD}" transform="translate(0,6)" fill="#000" opacity=".3"/>
<path d="${SHIELD}" fill="${ink}"/>
<path d="${SHIELD}" transform="translate(100,128) scale(.955) translate(-100,-128)" fill="${s === '#FFFFFF' || lum(s) > 0.7 ? '#F4F6FF' : s}"/>
<g clip-path="url(#${u}k)"><rect width="200" height="250" fill="${p}"/>${art}<rect width="200" height="250" fill="url(#${u}g)"/>
<g class="crest-sweep" opacity="0"><polygon points="-30,0 10,0 -40,250 -80,250" fill="#fff" opacity=".7"/></g></g>
<path d="${SHIELD}" transform="translate(100,128) scale(.9) translate(-100,-128)" fill="none" stroke="${ink}" stroke-width="3"/>
${opts.star === false ? '' : `<path d="M100 36 l7 15 16 2 -12 11 4 16 -15 -9 -15 9 4 -16 -12 -11 16 -2z" fill="#FFD23F" stroke="${ink}" stroke-width="3" stroke-linejoin="round" transform="translate(0,-2)"/>`}
<text x="100" y="${ini.length >= 3 ? 170 : 178}" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="${fs}" fill="${tc}" stroke="${ink}" stroke-width="9" paint-order="stroke" stroke-linejoin="round" class="crest-ini">${ini}</text>
</svg>`;
}

/** Ballon (pavage classique, ombrage de sphere). Le groupe `.ball-spin` est a faire tourner. */
export function ball(opts) {
  opts = opts || {};
  const u = opts.uid || uid('bl');
  const pent = (cx, cy, r, rot) => { let d = ''; for (let i = 0; i < 5; i++) { const a = (rot + i * 72) * Math.PI / 180; d += (i ? 'L' : 'M') + (cx + r * Math.sin(a)).toFixed(1) + ' ' + (cy - r * Math.cos(a)).toFixed(1); } return d + 'Z'; };
  const ink = opts.ink || '#101634';
  let patches = `<path d="${pent(50, 50, 15, 0)}" fill="${ink}"/>`, seams = '';
  for (let i = 0; i < 5; i++) {
    const a = i * 72 * Math.PI / 180;
    const cx = 50 + 41 * Math.sin(a), cy = 50 - 41 * Math.cos(a);
    patches += `<path d="${pent(cx, cy, 13, i * 72 + 36)}" fill="${ink}"/>`;
    const x1 = 50 + 15 * Math.sin(a), y1 = 50 - 15 * Math.cos(a), x2 = 50 + 28 * Math.sin(a), y2 = 50 - 28 * Math.cos(a);
    seams += `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} `;
    const b = (i * 72 + 36) * Math.PI / 180;
    seams += `M${(50 + 15 * Math.sin(b)).toFixed(1)} ${(50 - 15 * Math.cos(b)).toFixed(1)} L${(50 + 44 * Math.sin(b)).toFixed(1)} ${(50 - 44 * Math.cos(b)).toFixed(1)} `;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-ball" viewBox="0 0 100 100" width="${opts.width || 100}" height="${opts.height || 100}">
<defs><clipPath id="${u}c"><circle cx="50" cy="50" r="47"/></clipPath>
<radialGradient id="${u}s" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1a2260" stop-opacity=".5"/></radialGradient></defs>
<circle cx="50" cy="50" r="48" fill="#F4F6FF"/>
<g clip-path="url(#${u}c)"><g class="ball-spin" transform="translate(50,50)"><g class="j"><g transform="translate(-50,-50)">${patches}<path d="${seams}" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/></g></g></g>
<circle cx="50" cy="50" r="47" fill="url(#${u}s)"/></g>
<circle cx="50" cy="50" r="47.5" fill="none" stroke="${ink}" stroke-width="2.6"/>
</svg>`;
}

/** Cage vue de face avec filet : groupes `.goal-back` (fond de filet), `.goal-sides`, `.goal-frame`. */
export function goal(opts) {
  opts = opts || {};
  const u = opts.uid || uid('gl');
  const net = `<pattern id="${u}n" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 H22 M0 0 V22" stroke="#fff" stroke-width="2.2" opacity=".78"/></pattern>`;
  const post = (d) => `<path d="${d}" stroke="#0A1030" stroke-width="26" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" stroke="url(#${u}p)" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-goal" viewBox="0 0 900 540" width="${opts.width || 900}" height="${opts.height || 540}" style="overflow:visible">
<defs>${net}<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#E3E9F7"/><stop offset="1" stop-color="#B7C2DE"/></linearGradient>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1030" stop-opacity=".55"/><stop offset="1" stop-color="#0A1030" stop-opacity=".15"/></linearGradient></defs>
<ellipse cx="450" cy="486" rx="410" ry="22" fill="#000" opacity=".28"/>
<g class="goal-back"><polygon points="210,176 690,176 690,424 210,424" fill="url(#${u}b)"/><polygon points="210,176 690,176 690,424 210,424" fill="url(#${u}n)"/></g>
<g class="goal-sides"><polygon points="112,128 210,176 210,424 112,476" fill="#0A1030" opacity=".28"/><polygon points="112,128 210,176 210,424 112,476" fill="url(#${u}n)" opacity=".75"/>
<polygon points="788,128 690,176 690,424 788,476" fill="#0A1030" opacity=".28"/><polygon points="788,128 690,176 690,424 788,476" fill="url(#${u}n)" opacity=".75"/>
<polygon points="112,128 788,128 690,176 210,176" fill="#0A1030" opacity=".18"/><polygon points="112,128 788,128 690,176 210,176" fill="url(#${u}n)" opacity=".6"/></g>
<g class="goal-frame"><path d="M210 176 H690 M210 176 V424 M690 176 V424" stroke="#fff" stroke-width="4" opacity=".7" fill="none"/>
${post('M112 476 V128 H788 V476')}</g>
</svg>`;
}

// ---------------------------------------------------------------- fond de stade en couches (1920x1200, horizon a y=620)
// Couches empilables / animables separement : ciel, projecteurs (+rayons), foule (+flashs), pelouse.
// Perf tablette : les couches statiques (ciel + tribunes + pelouse, ~2 500 noeuds SVG) sont rasterisees une fois en WebP
// (`npm run art:raster` -> cinematics/_shared/img/) ; `stadium({ raster })` les utilise. Pas de mix-blend-mode (repeint couteux).
const SW = 1920, SH = 1200, HZ = 620;
function svgWrap(cls, body, defs) { return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}" preserveAspectRatio="xMidYMid slice"><defs>${defs || ''}</defs>${body}</svg>`; }

export function stadiumSky(opts) {
  opts = opts || {}; const u = opts.uid || uid('sk'); const r = rng(11);
  let stars = '';
  for (let i = 0; i < 70; i++) { const x = r() * SW, y = r() * 300, s = 0.8 + r() * 2; stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="#fff" opacity="${(0.25 + r() * 0.6).toFixed(2)}"/>`; }
  const body = `<rect width="${SW}" height="${SH}" fill="url(#${u}g)"/>${stars}
<ellipse cx="960" cy="470" rx="1100" ry="260" fill="url(#${u}h)"/>
<path d="M0 330 Q960 240 1920 330 L1920 470 L0 470Z" fill="#050A26"/>
<path d="M0 330 Q960 240 1920 330" stroke="#2A3CA0" stroke-width="5" fill="none" opacity=".7"/>`;
  const defs = `<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03051A"/><stop offset=".3" stop-color="#0A1250"/><stop offset=".5" stop-color="#1B2C86"/><stop offset="1" stop-color="#0E1A55"/></linearGradient>
<radialGradient id="${u}h"><stop offset="0" stop-color="#5E7CFF" stop-opacity=".55"/><stop offset="1" stop-color="#5E7CFF" stop-opacity="0"/></radialGradient>`;
  return svgWrap('st-sky', body, defs);
}

export function stadiumLights(opts) {
  opts = opts || {}; const u = opts.uid || uid('li');
  const xs = [250, 700, 1220, 1670];
  let beams = '', banks = '';
  xs.forEach((x, i) => {
    const dir = (960 - x) * 0.55;
    beams += `<polygon class="st-beam st-beam-${i}" points="${x - 46},236 ${x + 46},236 ${x + dir + 360},1040 ${x + dir - 360},1040" fill="url(#${u}b)"/>`;
    let lamps = '';
    for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) lamps += `<circle cx="${x - 54 + b * 36}" cy="${170 + a * 28}" r="11" fill="#FFFBE0"/>`;
    banks += `<g class="st-bank st-bank-${i}"><circle cx="${x}" cy="200" r="150" fill="url(#${u}o)" class="st-halo"/><rect x="${x - 82}" y="136" width="164" height="112" rx="10" fill="#10163A" stroke="#2A3CA0" stroke-width="4"/>${lamps}<rect x="${x - 6}" y="248" width="12" height="90" fill="#10163A"/></g>`;
  });
  const defs = `<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8D0" stop-opacity=".42"/><stop offset=".7" stop-color="#FFF8D0" stop-opacity=".1"/><stop offset="1" stop-color="#FFF8D0" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}o"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".85"/><stop offset=".25" stop-color="#FFE98A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE98A" stop-opacity="0"/></radialGradient>`;
  return svgWrap('st-lights', `<g class="st-beams">${beams}</g>${banks}`, defs);
}

/** Emplacements de flashs d'appareils photo (`.st-flash`, invisibles au repos) : `count` (12 par defaut), graine fixe.
 * Politique "mouvement sur" : animes seulement par `crowdFlashes` (rares, fondus lents). */
function flashSlots(count, u, seed) {
  const r = rng(seed || 17); let s = '';
  for (let i = 0; i < count; i++) {
    const x = 60 + r() * (SW - 120), y = 350 + r() * 230, k = 0.7 + (y - 350) / 230 * 0.9;
    s += `<g class="st-flash st-flash-${i}" opacity="0" transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${k.toFixed(2)})"><circle r="26" fill="url(#${u}f)"/><path d="M0 -26 L4 -4 L26 0 L4 4 L0 26 L-4 4 L-26 0 L-4 -4Z" fill="#fff" opacity=".85"/></g>`;
  }
  return s;
}
const FLASH_GRAD = (u) => `<radialGradient id="${u}f"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
/** Calque seul des flashs (pour le stade rasterise). */
export function stadiumFlashes(opts) {
  opts = opts || {}; const u = opts.uid || uid('fl');
  return svgWrap('st-flashes-layer', `<g class="st-flashes">${flashSlots(opts.flashes == null ? 12 : opts.flashes, u, opts.flashSeed)}</g>`, FLASH_GRAD(u));
}

/** Tribunes : 14 rangees de supporters (graine fixe), panneaux LED, `flashes` emplacements de flashs (`.st-flash`, 12 par defaut, 0 = aucun). */
export function stadiumCrowd(opts) {
  opts = opts || {}; const u = opts.uid || uid('cw'); const r = rng(opts.seed || 7);
  const cols = opts.colors || ['#E8212F', '#1B6BFF', '#FFD23F', '#FFFFFF', '#17B26A', '#FF8A1F'];
  let rows = '';
  const R = 14, y0 = 330, y1 = 598;
  rows += `<rect x="0" y="${y0 - 10}" width="${SW}" height="${HZ - y0 + 10}" fill="url(#${u}s)"/>`;
  for (let k = 0; k < R; k++) {
    const t = k / (R - 1), y = y0 + 12 + t * (y1 - y0 - 12), sc = 0.62 + t * 0.78, step = 30 * sc + 8;
    let row = '';
    for (let x = (k % 2) * step * 0.5 - 10; x < SW + 20; x += step) {
      const c = cols[Math.floor(r() * cols.length)], sk = SKINS[Math.floor(r() * SKINS.length)];
      const h = (r() - 0.5) * 6;
      row += `<path d="M${(x - 15 * sc).toFixed(1)} ${(y + 30 * sc + h).toFixed(1)} q${(15 * sc).toFixed(1)} ${(-24 * sc).toFixed(1)} ${(30 * sc).toFixed(1)} 0z" fill="${c}"/><circle cx="${x.toFixed(1)}" cy="${(y + h).toFixed(1)}" r="${(11 * sc).toFixed(1)}" fill="${sk}"/>`;
      if (r() < 0.05) row += `<path d="M${(x + 6 * sc).toFixed(1)} ${(y + h).toFixed(1)} l${(10 * sc).toFixed(1)} ${(-34 * sc).toFixed(1)}" stroke="#fff" stroke-width="3"/><rect x="${(x + 14 * sc).toFixed(1)}" y="${(y - 36 * sc + h).toFixed(1)}" width="${(26 * sc).toFixed(1)}" height="${(16 * sc).toFixed(1)}" fill="${c}"/>`;
    }
    rows += `<g class="st-row st-row-${k}">${row}</g><rect x="0" y="${(y + 34 * sc).toFixed(1)}" width="${SW}" height="${(4 + 3 * t).toFixed(1)}" fill="#050A26" opacity=".55"/>`;
  }
  const nf = opts.flashes == null ? 12 : opts.flashes;
  // panneaux LED au pied de la tribune (formes abstraites, aucun texte : decor)
  let led = '';
  for (let i = 0; i < 6; i++) {
    const w = SW / 6, c = [PAL.corail, PAL.cyan, PAL.jaune, PAL.orange, PAL.cyan, PAL.corail][i];
    led += `<rect x="${i * w + 3}" y="${HZ - 10}" width="${w - 6}" height="40" fill="#0A1030"/><rect x="${i * w + 3}" y="${HZ - 10}" width="${w - 6}" height="5" fill="${c}"/>`;
    for (let k = 0; k < 5; k++) led += `<polygon points="${i * w + 40 + k * 52},${HZ + 6} ${i * w + 62 + k * 52},${HZ + 6} ${i * w + 78 + k * 52},${HZ + 22} ${i * w + 56 + k * 52},${HZ + 22}" fill="${c}" opacity="${(0.9 - k * 0.15).toFixed(2)}"/>`;
  }
  const body = `${rows}<rect x="0" y="${y0 - 10}" width="${SW}" height="${HZ - y0 + 10}" fill="url(#${u}v)"/><g class="st-led">${led}</g>${nf ? `<g class="st-flashes">${flashSlots(nf, u, opts.flashSeed)}</g>` : ''}`;
  const defs = `<linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1146"/><stop offset="1" stop-color="#18246E"/></linearGradient>
<linearGradient id="${u}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03051A" stop-opacity=".78"/><stop offset=".6" stop-color="#050A26" stop-opacity=".3"/><stop offset="1" stop-color="#050A26" stop-opacity=".1"/></linearGradient>
${FLASH_GRAD(u)}`;
  return svgWrap('st-crowd', body, defs);
}

/** Projection pelouse : u in [-1,1] (travers), z in [0,1] (0 = bord camera, 1 = ligne de but au fond, sur l'horizon). */
export function pitchPoint(u, z) {
  const f = 1 / (1 + 2.2 * z), fMin = 1 / 3.2, t = (1 - f) / (1 - fMin);
  return [SW / 2 + u * 1500 * f, SH - (SH - HZ) * t];
}
export function stadiumPitch(opts) {
  opts = opts || {}; const u = opts.uid || uid('pt');
  const P = (a, b) => pitchPoint(a, b).map((n) => n.toFixed(1)).join(',');
  let bands = '';
  const N = 12;
  for (let i = 0; i < N; i++) {
    const z0 = i / N, z1 = (i + 1) / N;
    bands += `<polygon points="${P(-1.6, z0)} ${P(1.6, z0)} ${P(1.6, z1)} ${P(-1.6, z1)}" fill="${i % 2 ? '#0E8A40' : '#12A04B'}"/>`;
  }
  const line = (pts) => `<polyline points="${pts.map((p) => P(p[0], p[1])).join(' ')}" fill="none" stroke="#F4FFF6" stroke-width="7" stroke-linejoin="round" opacity=".9"/>`;
  let arc = [];
  for (let a = 0; a <= 180; a += 10) { const r = a * Math.PI / 180; const uu = 0.2 * Math.cos(r), zz = 0.72 - 0.12 * Math.sin(r); if (zz < 0.7) arc.push([uu, zz]); }
  const lines = line([[-1, 0], [-1, 1]]) + line([[1, 0], [1, 1]]) + line([[-1, 1], [1, 1]]) +
    line([[-0.5, 1], [-0.5, 0.7], [0.5, 0.7], [0.5, 1]]) + line([[-0.22, 1], [-0.22, 0.86], [0.22, 0.86], [0.22, 1]]) + line(arc.map((p) => [p[0], p[1] - 0.0]).filter((p) => p[1] < 0.7)) +
    `<ellipse cx="${pitchPoint(0, 0.78)[0]}" cy="${pitchPoint(0, 0.78)[1]}" rx="7" ry="3" fill="#F4FFF6"/>`;
  const body = `<g class="st-bands">${bands}</g><g class="st-lines">${lines}</g><rect x="0" y="${HZ}" width="${SW}" height="${SH - HZ}" fill="url(#${u}d)"/><rect x="0" y="${HZ}" width="${SW}" height="${SH - HZ}" fill="url(#${u}v)"/>`;
  const defs = `<linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03120A" stop-opacity=".62"/><stop offset=".25" stop-color="#03120A" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}v" cx=".5" cy=".4" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="st-pitch" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><svg x="0" y="${HZ}" width="${SW}" height="${SH - HZ}" viewBox="0 ${HZ} ${SW} ${SH - HZ}" overflow="hidden">${body}</svg></svg>`;
}

/** Images rasterisees du stade (generees par `npm run art:raster`, dossier `cinematics/_shared/img/` de l'app maths). */
export const STADIUM_IMG = { base: 'stadium-base.webp', lights: 'stadium-lights.webp', soft: 'stadium-soft.webp' };

/**
 * Stade complet dans un conteneur `.ce-stadium`.
 * - SVG (defaut) : 4 couches `st-sky|st-crowd|st-pitch|st-lights` (laboratoire du kit, generation des images).
 * - `raster: '<dossier>/'` : image `stadium-base.webp` (ciel + tribunes + pelouse) + flashs SVG (`flashes`, 0 = aucun)
 *   + projecteurs en SVG animables (`.st-bank-i`, `.st-beam-i`, `.st-halo`) ou, avec `lights: 'img'`, en image.
 */
export function stadium(opts) {
  const o = opts || {};
  const L = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block';
  const wrap = (s) => s.replace('<svg ', `<svg style="${L}" `);
  if (o.raster) {
    const img = (f, cls) => `<img class="${cls}" src="${o.raster}${f}" alt="" draggable="false" style="${L};object-fit:cover">`;
    const fl = o.flashes == null ? 12 : o.flashes;
    return `<div class="ce-stadium" style="position:absolute;inset:0;overflow:hidden">${img(STADIUM_IMG.base, 'st-base')}${fl ? wrap(stadiumFlashes(o)) : ''}${o.lights === 'img' ? img(STADIUM_IMG.lights, 'st-lights-img') : wrap(stadiumLights(o))}</div>`;
  }
  return `<div class="ce-stadium" style="position:absolute;inset:0;overflow:hidden">${wrap(stadiumSky(o))}${wrap(stadiumCrowd(o))}${wrap(stadiumPitch(o))}${wrap(stadiumLights(o))}</div>`;
}

// ---------------------------------------------------------------- habillage TV : score bug, lower-third, carte joueur
function abbr(t) { const w = String(t || '').split(/[\s']+/).filter((x) => x && !/^(les|le|la|l|the|fc|ac|us)$/i.test(x)); return (w[0] || String(t || '')).replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 3).toUpperCase(); }
function fitSize(txt, base, maxW, k) { const w = String(txt).length * base * (k || 0.5); return w > maxW ? Math.floor(base * maxW / w) : base; }

/** Score bug TV (viewBox 980x130). opts : home/away {name,primary,secondary,initials}, scoreHome, scoreAway, clock. Classes : sb-home, sb-away, sb-clock. */
export function scoreBug(opts) {
  opts = opts || {};
  const h = Object.assign({ name: 'Les Lions', primary: '#E8212F', secondary: '#fff', initials: 'LL' }, opts.home);
  const a = Object.assign({ name: 'Les Aigles', primary: '#1B6BFF', secondary: '#fff', initials: 'LA' }, opts.away);
  const u = opts.uid || uid('sb');
  const sh = opts.scoreHome == null ? 0 : opts.scoreHome, sa = opts.scoreAway == null ? 0 : opts.scoreAway;
  const cr = (t, x) => nest(crest({ primary: t.primary, secondary: t.secondary, initials: t.initials, star: false, uid: u + x }), x === 'h' ? 26 : 854, 14, 96, 108);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-scorebug" viewBox="0 0 980 140" width="${opts.width || 980}" height="${opts.height || 140}">
<polygon points="14,10 966,10 946,134 34,134" fill="#000" opacity=".35"/>
<polygon points="10,4 970,4 950,126 30,126" fill="#0A1030"/>
<polygon points="10,4 400,4 380,126 30,126" fill="${h.primary}" class="sb-home-bg"/><polygon points="400,4 380,126 372,126 392,4" fill="#fff" opacity=".9"/>
<polygon points="970,4 580,4 600,126 950,126" fill="${a.primary}" class="sb-away-bg"/><polygon points="580,4 588,4 608,126 600,126" fill="#fff" opacity=".9"/>
<polygon points="10,4 400,4 392,40 18,40" fill="#fff" opacity=".12"/><polygon points="970,4 580,4 588,40 962,40" fill="#fff" opacity=".12"/>
${cr(h, 'h')}${cr(a, 'a')}
<text x="146" y="86" font-family="Anton, Bebas Neue, sans-serif" font-size="${fitSize(abbr(h.name), 70, 200, 0.46)}" fill="${textOn(h.primary)}" class="sb-home-name" letter-spacing="3">${esc(abbr(h.name))}</text>
<text x="834" y="86" text-anchor="end" font-family="Anton, Bebas Neue, sans-serif" font-size="${fitSize(abbr(a.name), 70, 200, 0.46)}" fill="${textOn(a.primary)}" class="sb-away-name" letter-spacing="3">${esc(abbr(a.name))}</text>
<polygon points="404,16 584,16 576,114 412,114" fill="#FFD23F"/>
<polygon points="404,16 584,16 580,40 408,40" fill="#fff" opacity=".35"/>
<text x="468" y="100" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="82" fill="#0A1030" class="sb-home sb-score" style="font-variant-numeric:tabular-nums">${sh}</text>
<text x="494" y="94" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#0A1030" opacity=".6">-</text>
<text x="520" y="100" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="82" fill="#0A1030" class="sb-away sb-score" style="font-variant-numeric:tabular-nums">${sa}</text>
<g class="sb-clock-chip"><polygon points="410,112 578,112 568,140 420,140" fill="#0A1030" stroke="#FFD23F" stroke-width="3"/><text x="494" y="134" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="#fff" class="sb-clock">${esc(opts.clock || '')}</text></g>
</svg>`;
}

/** Lower-third (viewBox 1100x230). opts : title, subtitle, primary, accent, badge. Classes : lt-title, lt-sub, lt-tab, lt-body, lt-bar. */
export function lowerThird(opts) {
  opts = opts || {};
  const p = opts.primary || '#1B6BFF', ac = opts.accent || '#FFD23F';
  const title = String(opts.title || ''), sub = String(opts.subtitle || '');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-lower" viewBox="0 0 1100 230" width="${opts.width || 1100}" height="${opts.height || 230}">
<g class="lt-shadow"><polygon points="40,22 1090,22 1054,222 6,222" fill="#000" opacity=".35"/></g>
<g class="lt-body"><polygon points="30,10 1080,10 1044,206 0,206" fill="#0A1030"/><polygon points="30,10 1080,10 1074,40 24,40" fill="#fff" opacity=".1"/></g>
<g class="lt-tab"><polygon points="0,206 30,10 150,10 116,206" fill="${ac}"/>${opts.badge != null ? `<text x="70" y="146" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#0A1030" class="lt-badge">${esc(opts.badge)}</text>` : ''}</g>
<g class="lt-bar"><polygon points="116,206 1044,206 1050,226 108,226" fill="${p}"/></g>
<text x="190" y="118" font-family="Anton, Bebas Neue, sans-serif" font-size="${fitSize(title, 92, 780, 0.46)}" fill="#fff" class="lt-title" letter-spacing="2">${esc(title)}</text>
<text x="192" y="180" font-family="Fredoka, sans-serif" font-weight="600" font-size="${fitSize(sub, 54, 780, 0.5)}" fill="${ac}" class="lt-sub">${esc(sub)}</text>
</svg>`;
}

const RARITY = {
  bronze:  { name: 'BRONZE',  stops: ['#F0B98A', '#C88A55', '#7A4A25'], edge: '#4A2810', ink: '#3A1E0C', glow: '#E0A070', stars: 1 },
  argent:  { name: 'ARGENT',  stops: ['#FFFFFF', '#D3DAE6', '#7C8798'], edge: '#3E4656', ink: '#1E2533', glow: '#DCE6FF', stars: 2 },
  or:      { name: 'OR',      stops: ['#FFF3B0', '#FFD23F', '#B07A00'], edge: '#5E3E00', ink: '#3A2600', glow: '#FFE48A', stars: 3 },
  legende: { name: 'LEGENDE', stops: ['#7CF3FF', '#C57BFF', '#FF7BC8'], edge: '#0A0630', ink: '#0A0630', glow: '#9AF', stars: 5 },
};
/** Carte joueur. opts : name, number, position, rarity('bronze'|'argent'|'or'|'legende'), primary, secondary, initials(blason), player{skin,hair,hairColor,kit}. Classes : cd-name, cd-num, cd-pos, card-shine, card-holo. */
export function cardFrame(opts) {
  opts = opts || {};
  const u = opts.uid || uid('cd');
  const R = RARITY[opts.rarity] || RARITY.bronze, leg = opts.rarity === 'legende';
  const p = opts.primary || '#E8212F', s = opts.secondary || '#FFFFFF';
  const name = String(opts.name || 'JOUEUR').toUpperCase();
  const shape = 'M70 0 H530 Q600 0 600 70 V690 Q600 750 546 776 L330 840 H270 L54 776 Q0 750 0 690 V70 Q0 0 70 0Z';
  const inner = 'M86 34 H514 Q566 34 566 86 V682 Q566 726 528 744 L322 804 H278 L72 744 Q34 726 34 682 V86 Q34 34 86 34Z';
  let rays = '';
  for (let i = 0; i < 14; i++) { const a0 = i * 25.7, a1 = a0 + 12.8; const f = (d) => `${(300 + 700 * Math.cos(d * Math.PI / 180)).toFixed(0)},${(380 + 700 * Math.sin(d * Math.PI / 180)).toFixed(0)}`; rays += `<polygon points="300,380 ${f(a0)} ${f(a1)}" fill="#fff" opacity=".1"/>`; }
  const stars = Array.from({ length: R.stars }, (_, i) => { const x = 300 + (i - (R.stars - 1) / 2) * 46; return `<path d="M${x} 746 l7 15 16 2 -12 11 4 16 -15 -9 -15 9 4 -16 -12 -11 16 -2z" fill="${leg ? '#fff' : R.stops[0]}" stroke="${leg ? '#0A0630' : R.edge}" stroke-width="3" paint-order="stroke"/>`; }).join('');
  const bustSvg = nest(bust(Object.assign({ primary: p, secondary: s, number: opts.number, pose: 'idle', uid: u + 'b' }, opts.player)), 70, 86, 460, 476);
  const badge = nest(crest({ primary: p, secondary: s, initials: opts.initials || initialsOf(name), star: false, uid: u + 'c' }), 40, 262, 82, 102);
  const nameSize = fitSize(name, 84, 470, 0.46);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-card ce-card-${opts.rarity || 'bronze'}" viewBox="0 0 600 840" width="${opts.width || 600}" height="${opts.height || 840}">
<defs><linearGradient id="${u}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${R.stops[0]}"/><stop offset=".5" stop-color="${R.stops[1]}"/><stop offset="1" stop-color="${R.stops[2]}"/></linearGradient>
<linearGradient id="${u}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00F0FF"/><stop offset=".25" stop-color="#7B5CFF"/><stop offset=".5" stop-color="#FF4FD8"/><stop offset=".75" stop-color="#FFE14F"/><stop offset="1" stop-color="#3CFF9E"/></linearGradient>
<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(p, -0.1)}"/><stop offset="1" stop-color="${shade(p, -0.62)}"/></linearGradient>
<linearGradient id="${u}n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1030" stop-opacity="0"/><stop offset="1" stop-color="#0A1030" stop-opacity=".92"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="${u}k"><path d="${shape}"/></clipPath><clipPath id="${u}i"><path d="${inner}"/></clipPath></defs>
<path d="${shape}" transform="translate(0,10)" fill="#000" opacity=".35"/>
<path d="${shape}" fill="${leg ? '#0A0630' : `url(#${u}r)`}"/>
${leg ? `<path d="${shape}" fill="url(#${u}h)" opacity=".95" class="card-holo"/>` : ''}
<g clip-path="url(#${u}i)"><rect width="600" height="840" fill="url(#${u}p)"/>${rays}
<polygon points="0,560 600,420 600,520 0,660" fill="${s}" opacity=".16"/>
<polygon points="0,610 600,470 600,500 0,640" fill="${R.stops[0]}" opacity=".5"/>
${bustSvg}<rect x="0" y="470" width="600" height="360" fill="url(#${u}n)"/><rect width="600" height="840" fill="${R.stops[1]}" opacity="${leg ? 0.08 : 0.14}"/></g>
<path d="${inner}" fill="none" stroke="${R.edge}" stroke-width="5"/><path d="${shape}" fill="none" stroke="${R.edge}" stroke-width="6"/>
<text x="62" y="214" font-family="Anton, Bebas Neue, sans-serif" font-size="128" fill="#fff" stroke="${R.edge}" stroke-width="8" paint-order="stroke" stroke-linejoin="round" class="cd-num">${esc(opts.number == null ? '' : opts.number)}</text>
<text x="64" y="262" font-family="Fredoka, sans-serif" font-weight="700" font-size="42" fill="${R.stops[0]}" stroke="${R.edge}" stroke-width="6" paint-order="stroke" class="cd-pos">${esc(opts.position || '')}</text>
${badge}
<polygon points="40,590 560,570 560,672 40,692" fill="#0A1030" opacity=".92"/><polygon points="40,590 560,570 560,580 40,600" fill="${R.stops[1]}"/>
<text x="300" y="${650 + (84 - nameSize) / 6}" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="${nameSize}" fill="#fff" class="cd-name" letter-spacing="2" transform="rotate(-2.3 300 630)">${esc(name)}</text>
${stars}<text x="300" y="728" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="28" fill="${leg ? '#fff' : R.stops[0]}" letter-spacing="6">${R.name}</text>
<g clip-path="url(#${u}k)"><g class="card-shine" opacity="0"><polygon points="-120,0 -20,0 -260,840 -360,840" fill="url(#${u}w)" style="mix-blend-mode:overlay"/><polygon points="-110,0 -70,0 -310,840 -350,840" fill="#fff" opacity=".6"/></g></g>
</svg>`;
}

// ---------------------------------------------------------------- effets deterministes (utilisables dans une timeline GSAP pausee)
// Politique "mouvement sur" (docs/architecture.md, controle : npm run a11y:flash) : rien ne flashe plus de 3 fois par seconde,
// pas de flash blanc plein ecran (bloom <= 0,25 d'opacite, fondus >= 0,3 s), flashs de foule rares et doux (<= 2/s),
// confettis sans papillotement rapide, secousses moderees. L'energie vient du mouvement, pas de la lumiere.
let SOFT = false;
/** Mode "Animations douces" (reglage parent, ou prefers-reduced-motion) : pas de flashs de foule ni de secousse, bloom et confettis reduits. */
export function setSoft(v) { SOFT = !!v; }
export function isSoft() { return SOFT; }
/** Rayons tournants (sunburst). Renvoie un SVG carre `size` px ; a faire tourner. */
export function rays(opts) {
  opts = opts || {}; const n = opts.count || 14, size = opts.size || 2400, c = opts.color || '#fff', op = opts.opacity == null ? 0.16 : opts.opacity;
  let d = '';
  for (let i = 0; i < n; i++) { const a0 = (i * 360) / n, a1 = a0 + 180 / n; const f = (t) => `${(size / 2 + size * Math.cos(t * Math.PI / 180)).toFixed(0)},${(size / 2 + size * Math.sin(t * Math.PI / 180)).toFixed(0)}`; d += `<polygon points="${size / 2},${size / 2} ${f(a0)} ${f(a1)}" fill="${c}"/>`; }
  const u = opts.uid || uid('ry');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fx-rays" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><defs><radialGradient id="${u}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".7" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="${u}m"><rect width="${size}" height="${size}" fill="url(#${u})"/></mask></defs><g mask="url(#${u}m)" opacity="${op}">${d}</g></svg>`;
}
/** Etoile a 4 branches (eclat). */
export function sparkle(opts) {
  opts = opts || {}; const c = opts.color || '#fff', s = opts.size || 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fx-sparkle" viewBox="-50 -50 100 100" width="${s}" height="${s}"><path d="M0 -50 C3 -12 12 -3 50 0 C12 3 3 12 0 50 C-3 12 -12 3 -50 0 C-12 -3 -3 -12 0 -50Z" fill="${c}"/></svg>`;
}
/** Lignes de vitesse horizontales (seed fixe), SVG 1920x1200. */
export function speedLines(opts) {
  opts = opts || {}; const r = rng(opts.seed || 3), n = opts.count || 26, c = opts.color || '#fff'; let d = '';
  for (let i = 0; i < n; i++) { const y = r() * 1200, x = r() * 900, w = 380 + r() * 700, h = 3 + r() * 9; d += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(1)}" rx="${(h / 2).toFixed(1)}" fill="${c}" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fx-speed" viewBox="0 0 1920 1200" width="1920" height="1200">${d}</svg>`;
}
/** Confettis balistiques : `host` = element positionne ; chaque morceau = x lineaire + y montee/descente (gravite) + rotation lente. Tout est calcule a la construction (seed).
 * Nombre reel = 70 % de `count` (30 % en mode doux) : moins de noeuds animes sur tablette. */
export function confetti(gsap, tl, host, o) {
  o = o || {}; const r = rng(o.seed || 5), n = Math.max(6, Math.round((o.count || 90) * (SOFT ? 0.3 : 0.7))), at = o.at || 0;
  const cols = o.colors || ['#FFD23F', '#FF4D6D', '#35D6FF', '#FFFFFF', '#FF8A1F', '#7CFF9E'];
  const xs = o.xSpread || 0, ox0 = o.x == null ? 960 : o.x, ox = ox0, oy = o.y == null ? 600 : o.y, power = o.power || 700, spread = o.spread == null ? 150 : o.spread, grav = o.gravity || 1500, dur = o.duration || 2.2;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    const w = 10 + r() * 14, h = w * (0.45 + r() * 0.9), col = cols[i % cols.length];
    el.style.cssText = `position:absolute;left:0;top:0;width:${w.toFixed(0)}px;height:${h.toFixed(0)}px;background:${col};border-radius:${r() < 0.3 ? '50%' : '2px'};opacity:0`;
    el.setAttribute('data-layout-allow-occlusion', '');
    host.appendChild(el);
    const ang = (o.angle == null ? -90 : o.angle) + (r() - 0.5) * 2 * spread, v = power * (0.45 + r() * 0.75), rad = ang * Math.PI / 180;
    const vx = Math.cos(rad) * v, vy = Math.sin(rad) * v, life = dur * (0.75 + r() * 0.45), tUp = Math.max(0.05, -vy / grav), delay = r() * 0.12;
    const oxi = ox + (r() - 0.5) * 2 * xs;
    const xEnd = oxi + vx * life * 0.9, yApex = oy + vy * tUp + 0.5 * grav * tUp * tUp, yEnd = oy + vy * life + 0.5 * grav * life * life;
    const t0 = at + delay;
    tl.set(el, { x: oxi, y: oy, opacity: 1, rotation: r() * 360 }, t0);
    tl.to(el, { x: xEnd, duration: life, ease: 'none' }, t0);
    tl.to(el, { y: yApex, duration: Math.min(tUp, life), ease: 'power2.out' }, t0);
    if (life > tUp) tl.to(el, { y: yEnd, duration: life - tUp, ease: 'power2.in' }, t0 + tUp);
    tl.to(el, { rotation: '+=' + ((r() - 0.5) * 900).toFixed(0), duration: life, ease: 'none' }, t0);
    // retournement lent (<= ~1 par seconde) : pas de papillotement
    if (!SOFT) { const flips = Math.max(1, Math.floor(life / 1.1)); tl.to(el, { scaleY: 0.45, duration: life / (2 * flips), repeat: 2 * flips - 1, yoyo: true, ease: 'sine.inOut' }, t0); }
    tl.to(el, { opacity: 0, duration: 0.3, ease: 'power1.in' }, t0 + life - 0.3);
  }
}
/** Secousse amortie (deterministe) d'un element : amplitude plafonnee a 10 px (cadre 1920), rien en mode doux. */
export function shake(gsap, tl, el, at, amp, dur) {
  if (SOFT) return;
  const a = Math.min(amp || 10, 10), d = Math.max(dur || 0.4, 0.3), steps = 6;
  for (let i = 0; i < steps; i++) { const k = 1 - i / steps; tl.to(el, { x: (i % 2 ? -1 : 1) * a * k, y: (i % 3 === 0 ? -1 : 1) * a * 0.5 * k, duration: d / steps, ease: 'sine.inOut' }, at + (i * d) / steps); }
  tl.to(el, { x: 0, y: 0, duration: d / steps, ease: 'power2.out' }, at + d);
}
/** Compteur : texte pilote par la progression (seek-safe). fmt(v) -> string. */
export function countUp(gsap, tl, el, from, to, at, dur, fmt, ease) {
  const o = { v: from }; const f = fmt || ((v) => String(Math.round(v)));
  el.textContent = f(from);
  tl.to(o, { v: to, duration: dur, ease: ease || 'power2.out', onUpdate: () => { el.textContent = f(o.v); } }, at);
}
/** Flashs d'appareils photo de la foule (emplacements `.st-flash`), version sure : au plus 2 par seconde (x density),
 * fondu d'entree 0,3 s et de sortie 0,45 s, emplacements tous differents (ordre graine). Aucun en mode doux. */
export function crowdFlashes(gsap, tl, root, at, dur, density, seed) {
  const list = Array.prototype.slice.call(root.querySelectorAll('.st-flash'));
  if (SOFT || !list.length) return;
  const r = rng(seed || 9), n = Math.min(list.length, Math.max(1, Math.floor(2 * dur * Math.min(1, density == null ? 1 : density))));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)), x = list[i]; list[i] = list[j]; list[j] = x; }
  const step = dur / n; // >= 0,5 s : jamais plus de 2 departs dans une meme seconde
  for (let i = 0; i < n; i++) {
    const t = at + i * step;
    tl.fromTo(list[i], { opacity: 0 }, { opacity: 0.7, duration: 0.3, ease: 'sine.out', immediateRender: false }, t);
    tl.to(list[i], { opacity: 0, duration: 0.45, ease: 'sine.inOut' }, t + 0.32);
  }
}
/** Bloom doux (remplace le flash blanc plein ecran) : `el` = calque plein cadre (degrade radial clair), opacite <= 0,25
 * atteinte en >= 0,3 s puis fondu de 0,6 s. Mode doux : 0,12 max. */
export function bloom(gsap, tl, el, at, peak, rise) {
  const p = Math.min(peak == null ? 0.22 : peak, SOFT ? 0.12 : 0.25), up = Math.max(rise || 0.3, 0.3);
  tl.fromTo(el, { opacity: 0 }, { opacity: p, duration: up, ease: 'sine.out', immediateRender: false }, at);
  tl.to(el, { opacity: 0, duration: 0.6, ease: 'sine.inOut' }, at + up + 0.01);
}
/** Balayage lumineux diagonal (shimmer) sur un element conteneur. */
export function sheen(gsap, tl, el, at, dur, fromX, toX) {
  tl.fromTo(el, { x: fromX, opacity: 0 }, { x: toX, opacity: 1, duration: dur, ease: 'power2.inOut' }, at);
  tl.to(el, { opacity: 0, duration: 0.25, ease: 'sine.inOut' }, at + dur - 0.2);
}

// ---------------------------------------------------------------- trophee, medaille, paquet de cartes, piste
const METAL = {
  or:     ['#FFF6BF', '#FFD23F', '#C28A00', '#7A5200'],
  argent: ['#FFFFFF', '#D6DDEB', '#8A95A8', '#4C5568'],
  bronze: ['#FFD9B3', '#E0975C', '#9A5A2B', '#5A3010'],
};
function metalGrad(id, m, horizontal) {
  const a = horizontal ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="1" y2="1"';
  return `<linearGradient id="${id}" ${a}><stop offset="0" stop-color="${m[2]}"/><stop offset=".22" stop-color="${m[0]}"/><stop offset=".45" stop-color="${m[1]}"/><stop offset=".7" stop-color="${m[2]}"/><stop offset=".85" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[3]}"/></linearGradient>`;
}

/** Trophee (coupe a anses). Classes : tr-cup, tr-base, tr-glint, tr-star. viewBox 400x640. */
export function trophy(opts) {
  opts = opts || {};
  const u = opts.uid || uid('tr'), m = METAL[opts.metal || 'or'];
  const handle = (s) => `<path d="M${200 + s * 98} 168 C${200 + s * 190} 150 ${200 + s * 196} 280 ${200 + s * 104} 306" stroke="${m[3]}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${200 + s * 98} 168 C${200 + s * 190} 150 ${200 + s * 196} 280 ${200 + s * 104} 306" stroke="url(#${u}g)" stroke-width="20" fill="none" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-trophy" viewBox="0 0 400 640" width="${opts.width || 400}" height="${opts.height || 640}" style="overflow:visible">
<defs>${metalGrad(u + 'g', m, true)}${metalGrad(u + 'd', m, false)}
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D2A5E"/><stop offset="1" stop-color="#070C2B"/></linearGradient>
<radialGradient id="${u}i" cx=".5" cy=".3"><stop offset="0" stop-color="#8A5A00"/><stop offset="1" stop-color="#2A1A00"/></radialGradient></defs>
<ellipse cx="200" cy="626" rx="170" ry="16" fill="#000" opacity=".4"/>
<g class="tr-base"><path d="M70 560 H330 L342 622 H58Z" fill="url(#${u}b)"/><rect x="58" y="612" width="284" height="12" rx="5" fill="url(#${u}g)"/><path d="M104 522 H296 L306 562 H94Z" fill="url(#${u}g)"/><rect x="132" y="570" width="136" height="34" rx="6" fill="url(#${u}g)"/><rect x="140" y="576" width="120" height="22" rx="4" fill="${m[3]}" opacity=".5"/></g>
<g class="tr-cup">${handle(-1)}${handle(1)}
<path d="M176 400 H224 L232 524 H168Z" fill="url(#${u}g)"/><ellipse cx="200" cy="474" rx="40" ry="15" fill="url(#${u}g)"/><ellipse cx="200" cy="474" rx="40" ry="15" fill="none" stroke="${m[3]}" stroke-width="3"/><ellipse cx="200" cy="528" rx="62" ry="14" fill="url(#${u}g)"/>
<path d="M98 130 H302 C306 262 272 350 200 410 C128 350 94 262 98 130Z" fill="url(#${u}g)"/>
<path d="M98 130 H302 C306 262 272 350 200 410 C128 350 94 262 98 130Z" fill="none" stroke="${m[3]}" stroke-width="5"/>
<ellipse cx="200" cy="130" rx="102" ry="26" fill="url(#${u}d)"/><ellipse cx="200" cy="132" rx="90" ry="19" fill="url(#${u}i)"/>
<path d="M200 196 l16 36 40 4 -30 26 9 40 -35 -21 -35 21 9 -40 -30 -26 40 -4z" fill="${m[0]}" opacity=".9" class="tr-star"/><path d="M200 196 l16 36 40 4 -30 26 9 40 -35 -21 -35 21 9 -40 -30 -26 40 -4z" fill="none" stroke="${m[3]}" stroke-width="4" stroke-linejoin="round"/>
<path d="M118 150 C118 240 142 316 176 366" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".55" class="tr-glint"/></g>
</svg>`;
}

/** Medaille avec ruban (viewBox 400x720, point d'accroche en haut au centre). opts : metal('or'|'argent'|'bronze'), rank. Classes : md-disc, md-glint. */
export function medal(opts) {
  opts = opts || {};
  const k = opts.metal || 'or', m = METAL[k], u = opts.uid || uid('md');
  const rank = opts.rank || (k === 'or' ? 1 : k === 'argent' ? 2 : 3);
  let leaves = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2, r = 118, x = 200 + r * Math.cos(a), y = 470 + r * Math.sin(a), rot = (a * 180) / Math.PI + 90;
    leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="22" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${m[0]}" stroke="${m[3]}" stroke-width="2.5"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-medal" viewBox="0 0 400 720" width="${opts.width || 400}" height="${opts.height || 720}" style="overflow:visible">
<defs>${metalGrad(u + 'g', m, false)}<radialGradient id="${u}r" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${m[0]}"/><stop offset=".6" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></radialGradient></defs>
<polygon points="110,-40 200,300 150,300 40,-40" fill="#1B6BFF"/><polygon points="290,-40 200,300 250,300 360,-40" fill="#E8212F"/>
<polygon points="110,-40 200,300 250,300 160,-40" fill="#fff" opacity=".0"/><polygon points="160,-40 200,300 250,300 200,-40" fill="#F7F9FF"/><polygon points="200,-40 250,300 290,-40" fill="#E8212F" opacity="0"/>
<polygon points="40,-40 110,-40 200,300 150,300" fill="#1B6BFF"/><polygon points="40,-40 70,-40 170,300 150,300" fill="#fff" opacity=".18"/>
<rect x="168" y="286" width="64" height="40" rx="12" fill="url(#${u}g)" stroke="${m[3]}" stroke-width="4"/><circle cx="200" cy="316" r="22" fill="none" stroke="${m[3]}" stroke-width="12"/><circle cx="200" cy="316" r="22" fill="none" stroke="url(#${u}g)" stroke-width="7"/>
<g class="md-disc"><ellipse cx="206" cy="480" rx="160" ry="160" fill="#000" opacity=".3"/>
<circle cx="200" cy="470" r="160" fill="url(#${u}g)" stroke="${m[3]}" stroke-width="6"/>${leaves}
<circle cx="200" cy="470" r="104" fill="url(#${u}r)" stroke="${m[3]}" stroke-width="6"/><circle cx="200" cy="470" r="92" fill="none" stroke="${m[0]}" stroke-width="3" opacity=".8"/>
<text x="200" y="${rank === 1 ? 528 : 526}" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="170" fill="${m[0]}" stroke="${m[3]}" stroke-width="9" paint-order="stroke" stroke-linejoin="round">${rank}</text>
<path d="M200 380 l9 18 20 3 -15 14 4 20 -18 -10 -18 10 4 -20 -15 -14 20 -3z" fill="#fff" opacity=".0"/>
<path d="M92 400 C120 330 200 304 260 322" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".5" class="md-glint"/></g>
</svg>`;
}

/** Dos de carte (meme forme que cardFrame). */
export function cardBack(opts) {
  opts = opts || {};
  const u = opts.uid || uid('cb'), p = opts.primary || '#1B2C86';
  const shape = 'M70 0 H530 Q600 0 600 70 V690 Q600 750 546 776 L330 840 H270 L54 776 Q0 750 0 690 V70 Q0 0 70 0Z';
  let dia = '';
  for (let y = -40; y < 880; y += 70) for (let x = (Math.round(y / 70) % 2) * 35 - 35; x < 640; x += 70) dia += `<path d="M${x} ${y + 35} l35 -35 35 35 -35 35z" fill="#fff" opacity=".05"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-cardback" viewBox="0 0 600 840" width="${opts.width || 600}" height="${opts.height || 840}">
<defs><clipPath id="${u}k"><path d="${shape}"/></clipPath><radialGradient id="${u}r" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#4B6BFF"/><stop offset="1" stop-color="${shade(p, -0.55)}"/></radialGradient></defs>
<path d="${shape}" transform="translate(0,10)" fill="#000" opacity=".35"/><path d="${shape}" fill="#FFD23F"/>
<g clip-path="url(#${u}k)"><rect x="14" y="14" width="572" height="812" fill="url(#${u}r)" clip-path="url(#${u}k)"/>${dia}</g>
<path d="M86 34 H514 Q566 34 566 86 V682 Q566 726 528 744 L322 804 H278 L72 744 Q34 726 34 682 V86 Q34 34 86 34Z" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>
<circle cx="300" cy="400" r="150" fill="#0A1030" opacity=".55"/><circle cx="300" cy="400" r="150" fill="none" stroke="#FFD23F" stroke-width="8"/>
<path d="M300 290 l26 58 64 6 -48 42 15 62 -57 -33 -57 33 15 -62 -48 -42 64 -6z" fill="#FFD23F" stroke="#7A5200" stroke-width="6" stroke-linejoin="round"/>
<text x="300" y="640" text-anchor="middle" font-family="Anton, sans-serif" font-size="70" fill="#fff" letter-spacing="6">CALCUL</text><text x="300" y="706" text-anchor="middle" font-family="Anton, sans-serif" font-size="70" fill="#FFD23F" letter-spacing="6">CHAMPION</text>
</svg>`;
}

/** Paquet de cartes en aluminium (viewBox 440x680). Groupes : pk-body, pk-top (partie a dechirer, y < 130). */
export function cardPack(opts) {
  opts = opts || {};
  const u = opts.uid || uid('pk'), a = opts.primary || '#2A46FF', b = opts.secondary || '#FF3D9A';
  const pts = [];
  for (let x = 0; x <= 440; x += 11) pts.push([x, ((x / 11) | 0) % 2 ? 9 : 0]);
  for (let x = 440; x >= 0; x -= 11) pts.push([x, 680 - (((x / 11) | 0) % 2 ? 9 : 0)]);
  const bodyPath = 'M' + pts.map((q) => q[0] + ' ' + q[1]).join(' L') + 'Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-pack" viewBox="0 0 440 680" width="${opts.width || 440}" height="${opts.height || 680}" style="overflow:visible">
<defs><linearGradient id="${u}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${shade(a, 0.25)}"/><stop offset="1" stop-color="${b}"/></linearGradient>
<linearGradient id="${u}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".25" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
<clipPath id="${u}t"><rect x="-20" y="-20" width="480" height="150"/></clipPath><clipPath id="${u}m"><rect x="-20" y="130" width="480" height="570"/></clipPath></defs>
<ellipse cx="220" cy="676" rx="190" ry="18" fill="#000" opacity=".35"/>
<g class="pk-body" clip-path="url(#${u}m)"><path d="${bodyPath}" fill="url(#${u}f)"/><path d="${bodyPath}" fill="url(#${u}s)"/>
<circle cx="220" cy="360" r="120" fill="#0A1030" opacity=".35"/><path d="M220 262 l23 52 56 5 -42 37 13 55 -50 -29 -50 29 13 -55 -42 -37 56 -5z" fill="#FFD23F" stroke="#7A5200" stroke-width="6" stroke-linejoin="round"/>
<text x="220" y="546" text-anchor="middle" font-family="Anton, sans-serif" font-size="74" fill="#fff" stroke="#0A1030" stroke-width="8" paint-order="stroke" letter-spacing="4">CARTES</text><text x="220" y="596" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="30" fill="#FFD23F">5 joueurs</text></g>
<g class="pk-top" clip-path="url(#${u}t)"><path d="${bodyPath}" fill="url(#${u}f)"/><path d="${bodyPath}" fill="url(#${u}s)"/><rect x="0" y="118" width="440" height="12" fill="#000" opacity=".25"/></g>
</svg>`;
}

/** Piste d'athletisme (vue de face, couloirs en perspective). SVG 1920x1200, horizon y=620. */
export function track(opts) {
  opts = opts || {}; const u = opts.uid || uid('tk'), HZ = 620;
  let lanes = '', lines = '';
  const N = 7;
  for (let i = 0; i < N; i++) {
    const x0 = 960 + (i - N / 2) * 70, x1 = 960 + (i + 1 - N / 2) * 70, y0 = 2400 * 0 + 0;
    const X0 = 960 + (i - N / 2) * 560, X1 = 960 + (i + 1 - N / 2) * 560;
    lanes += `<polygon points="${x0},${HZ} ${x1},${HZ} ${X1},1200 ${X0},1200" fill="${i % 2 ? '#E5502A' : '#D8431F'}"/>`;
    lines += `<line x1="${x0}" y1="${HZ}" x2="${X0}" y2="1200" stroke="#fff" stroke-width="8" opacity=".9"/>`;
  }
  lines += `<line x1="${960 + N / 2 * 70}" y1="${HZ}" x2="${960 + N / 2 * 560}" y2="1200" stroke="#fff" stroke-width="8" opacity=".9"/>`;
  let marks = '';
  for (let k = 1; k < 8; k++) { const t = Math.pow(k / 8, 1.9), y = HZ + (1200 - HZ) * t; marks += `<rect x="0" y="${y.toFixed(1)}" width="1920" height="${(2 + 6 * t).toFixed(1)}" fill="#000" opacity=".07"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="st-track" viewBox="0 0 1920 1200" width="1920" height="1200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0a05" stop-opacity=".6"/><stop offset=".3" stop-color="#2a0a05" stop-opacity="0"/></linearGradient></defs>
<rect x="0" y="${HZ}" width="1920" height="580" fill="#0F8F42"/><svg x="0" y="${HZ}" width="1920" height="580" viewBox="0 ${HZ} 1920 580" overflow="hidden">${lanes}${lines}${marks}<rect x="0" y="${HZ}" width="1920" height="580" fill="url(#${u}d)"/></svg></svg>`;
}

// ---------------------------------------------------------------- footballeur de PROFIL en course (regarde a droite)
// Meme esprit que player() : articulations <g class="ps-xxx"><g class="j"> animables avec svgOrigin "0 0".
// Classes : ps-rig, ps-legF, ps-legB, ps-armF, ps-armB, ps-head, ps-body. viewBox 400x600.
function sideLeg(cls, shadeAmt, o) {
  const k = (c) => (shadeAmt ? shade(c, shadeAmt) : c);
  const shoe = `<g transform="translate(205,0)"><path d="M-23 504 L21 504 C35 512 53 526 55 542 Q55 553 45 553 L-21 553 Q-27 553 -27 545 Z" fill="${k(o.shoe)}"/><path d="M-27 543 H55 V548 Q55 554 48 554 H-22 Q-27 554 -27 548Z" fill="${k('#ffffff')}"/><path d="M6 508 l10 -2 M10 515 l10 -2 M15 522 l9 -1" stroke="${k('#ffffff')}" stroke-width="3" stroke-linecap="round"/></g>`;
  return `<g class="${cls}" transform="translate(205,392)"><g class="j"><g transform="translate(-205,-392)">` +
    `<path d="M178 392 h54 v46 q0 6 -6 6 h-42 q-6 0 -6 -6z" fill="${k(o.shorts)}"/><rect x="178" y="430" width="54" height="8" fill="${k(o.trim)}"/>` +
    `<rect x="188" y="438" width="34" height="22" fill="${k(o.skin)}"/><rect x="185" y="456" width="40" height="54" fill="${k(o.socks)}"/><rect x="185" y="468" width="40" height="8" fill="${k(o.socks2)}"/>${shoe}</g></g></g>`;
}
function sideArm(cls, shadeAmt, o) {
  const k = (c) => (shadeAmt ? shade(c, shadeAmt) : c);
  return `<g class="${cls}" transform="translate(205,304)"><g class="j"><g transform="translate(-205,-304)">` +
    `<rect x="192" y="332" width="26" height="50" rx="12" fill="${k(o.skin)}"/><circle cx="205" cy="388" r="17" fill="${k(o.skin)}"/>` +
    `<rect x="185" y="290" width="40" height="52" rx="16" fill="${k(o.primary)}"/><rect x="185" y="330" width="40" height="10" fill="${k(o.secondary)}"/></g></g></g>`;
}
function sideHair(style, c) {
  const hl = shade(c, 0.3), rim = lum(c) < 0.07 ? shade(c, 0.5) : shade(c, -0.35);
  const base = `stroke="${rim}" stroke-width="3" stroke-linejoin="round"`;
  switch (style) {
    case 'boucles': {
      let s = '';
      [[120, 120, 40], [150, 84, 44], [200, 66, 46], [250, 78, 42], [286, 110, 34], [108, 168, 32], [140, 140, 34], [192, 110, 40], [244, 112, 32]].forEach((p) => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}" ${base}/>`; });
      return s + `<path d="M150 80 q14 -12 28 0 M214 66 q14 -12 28 0" stroke="${hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    }
    case 'pique':
      return `<path d="M98 168 L100 100 L134 118 L142 58 L174 100 L208 38 L240 96 L276 60 L280 114 L312 100 L306 150 C284 128 250 116 205 116 C160 116 126 134 98 168Z" fill="${c}" ${base}/>`;
    case 'long':
      return `<path d="M96 180 C84 100 140 52 212 54 C276 56 316 96 310 146 C288 122 250 112 212 114 C176 114 150 134 150 180 C152 236 160 290 138 330 C108 300 92 240 96 180Z" fill="${c}" ${base}/><path d="M130 90 C160 70 196 64 232 68" stroke="${hl}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>`;
    default:
      return `<path d="M96 178 C86 100 140 54 210 54 C274 54 316 92 312 146 C296 124 272 112 244 114 C214 108 186 124 160 130 C132 140 108 154 96 178Z" fill="${c}" ${base}/><path d="M130 86 C160 66 198 60 238 66" stroke="${hl}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`;
  }
}

/** Footballeur de profil en course. opts : primary, secondary, shorts, socks, skin(0-5|hex), hair, hairColor, number, ghost(bool: silhouette translucide) */
export function playerSide(opts) {
  opts = opts || {};
  const u = opts.uid || uid('ps');
  const primary = opts.primary || '#E8212F', secondary = opts.secondary || '#FFFFFF';
  const skin = typeof opts.skin === 'number' ? SKINS[opts.skin % SKINS.length] : opts.skin || SKINS[1];
  const hairC = typeof opts.hairColor === 'number' ? HAIRS[opts.hairColor % HAIRS.length] : opts.hairColor || HAIRS[0];
  const o = {
    primary, secondary, skin, skinD: shade(skin, -0.22),
    shorts: opts.shorts || (lum(primary) > 0.5 ? '#13204f' : '#FFFFFF'),
    trim: opts.trim || secondary, socks: opts.socks || primary, socks2: opts.socks2 || secondary, shoe: opts.shoe || '#121528',
  };
  const numC = lum(primary) > 0.5 ? '#0A1030' : '#FFFFFF', numS = lum(primary) > 0.5 ? '#FFFFFF' : '#0A1030';
  const brow = shade(hairC, lum(hairC) < 0.07 ? 0.1 : -0.25);
  const dk = '#2a1418';
  const jersey = 'M166 300 Q166 286 188 284 L228 284 Q248 286 248 300 L252 402 Q252 414 240 414 L176 414 Q164 414 164 402 Z';
  const num = opts.number == null ? '' : `<text x="208" y="372" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="54" fill="${numC}" stroke="${numS}" stroke-width="6" paint-order="stroke">${esc(opts.number)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-player-side" viewBox="0 0 400 600" width="${opts.width || 400}" height="${opts.height || 600}" style="overflow:visible${opts.ghost ? ';opacity:.42;filter:saturate(.5)' : ''}">
<defs><radialGradient id="${u}f" cx=".6" cy=".3" r=".85"><stop offset="0" stop-color="${shade(skin, 0.2)}"/><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${shade(skin, -0.14)}"/></radialGradient>
<linearGradient id="${u}j" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".4" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>
<g class="ps-shadow"><ellipse cx="205" cy="558" rx="104" ry="14" fill="#000" opacity=".3"/></g>
<g class="ps-rig">
${sideArm('ps-armB', -0.25, o)}${sideLeg('ps-legB', -0.25, o)}
<g class="ps-body" transform="translate(205,400)"><g class="j"><g transform="translate(-205,-400)">
<rect x="192" y="266" width="30" height="36" rx="10" fill="${skin}"/>
<path d="${jersey}" fill="${primary}"/><path d="${jersey}" fill="url(#${u}j)"/><rect x="164" y="400" width="88" height="9" fill="${secondary}" opacity=".9"/>
<path d="M166 300 Q166 286 188 284 L228 284" fill="none" stroke="${secondary}" stroke-width="7" stroke-linecap="round"/>${num}
<path d="M164 398 H252 L254 438 H162Z" fill="${o.shorts}"/><rect x="164" y="396" width="88" height="9" fill="${o.trim}" opacity=".9"/>
</g></g></g>
${sideLeg('ps-legF', 0, o)}${sideArm('ps-armF', 0, o)}
<g class="ps-head" transform="translate(205,290)"><g class="j"><g transform="translate(-205,-290)">
<path d="M96 176 C92 100 140 58 206 58 C268 58 312 100 312 164 C312 232 270 286 206 286 C142 286 100 236 96 176Z" fill="url(#${u}f)" stroke="${shade(skin, -0.32)}" stroke-width="4"/>
<path d="M306 186 C334 196 336 220 314 232 C304 236 296 232 294 224Z" fill="${skin}" stroke="${shade(skin, -0.32)}" stroke-width="4" stroke-linejoin="round"/>
<circle cx="168" cy="196" r="24" fill="${skin}" stroke="${shade(skin, -0.32)}" stroke-width="4"/><circle cx="168" cy="196" r="12" fill="${o.skinD}" opacity=".6"/>
<ellipse cx="268" cy="236" rx="22" ry="12" fill="#FF5E7A" opacity=".3"/>
<ellipse cx="262" cy="176" rx="28" ry="34" fill="#fff"/><circle cx="272" cy="182" r="19" fill="#3a2a20"/><circle cx="274" cy="182" r="10" fill="#0c0a10"/><circle cx="266" cy="173" r="6.5" fill="#fff"/>
<path d="M232 172 Q262 132 292 172" stroke="${dk}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M226 132 Q262 114 296 138" stroke="${brow}" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M250 252 Q278 262 300 244" stroke="${dk}" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M130 230 C150 262 180 280 206 284" stroke="#000" stroke-width="0" fill="none"/>
${sideHair(opts.hair || 'court', hairC)}
</g></g></g>
</g></svg>`;
}

function sq(svg, sel) { return svg.querySelector(sel); }
function sj(extra) { return Object.assign({ svgOrigin: '0 0' }, extra); }
/** Pose de depart de la course de profil. */
export function setRunSide(gsap, svg) {
  gsap.set(sq(svg, '.ps-legF .j'), sj({ rotation: -30 })); gsap.set(sq(svg, '.ps-legB .j'), sj({ rotation: 24 }));
  gsap.set(sq(svg, '.ps-armF .j'), sj({ rotation: 38 })); gsap.set(sq(svg, '.ps-armB .j'), sj({ rotation: -38 }));
  gsap.set(sq(svg, '.ps-body .j'), sj({ rotation: -9 })); gsap.set(sq(svg, '.ps-head .j'), sj({ rotation: 4 }));
}
/** Cycle de course de profil : jambes/bras en opposition, genou plie (scaleY) en phase de reprise, rebond. `period` = un pas complet (s). */
export function runSide(gsap, tl, svg, at, dur, period) {
  const T = period || 0.5, h = T / 2, n = Math.max(1, Math.round(dur / T));
  for (let i = 0; i < n; i++) {
    const t = at + i * T;
    [[0, 1], [h, -1]].forEach(([off, s]) => {
      const a = t + off;
      // s>0 : jambe avant (F) part en arriere, jambe B revient (pliee) vers l'avant
      tl.to(sq(svg, '.ps-legF .j'), sj({ rotation: s > 0 ? 34 : -44, scaleY: s > 0 ? 1 : 0.8, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-legB .j'), sj({ rotation: s > 0 ? -44 : 34, scaleY: s > 0 ? 0.8 : 1, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-armF .j'), sj({ rotation: s > 0 ? -52 : 62, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-armB .j'), sj({ rotation: s > 0 ? 62 : -52, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-rig'), { y: -14, duration: h * 0.45, ease: 'power2.out' }, a);
      tl.to(sq(svg, '.ps-rig'), { y: 0, duration: h * 0.55, ease: 'power2.in' }, a + h * 0.45);
      tl.to(sq(svg, '.ps-head .j'), sj({ rotation: 4 + s * 2, duration: h, ease: 'sine.inOut' }), a);
    });
  }
  return tl;
}
