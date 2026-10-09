// GENERE par scripts/cinematics.mjs (art) depuis art/core/src/*.js - ne pas editer.
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

// ---------------------------------------------------------------- motifs : azulejo, papel picado, grain de papier
function circlePath(cx, cy, r) { return `M${r1(cx - r)} ${r1(cy)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`; }
function starPath(cx, cy, R, r, n, rot) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (Math.PI * i) / n, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + r1(cx + Math.sin(a) * rr) + ' ' + r1(cy - Math.cos(a) * rr);
  }
  return d + 'Z';
}
function diamondPath(cx, cy, w, h) { return `M${cx} ${cy - h}L${cx + w} ${cy}L${cx} ${cy + h}L${cx - w} ${cy}Z`; }

/** Motif d'azulejo (carreau 100x100) en <pattern>. opts : a (fond), b (etoile), c (coeur), d (liseré). */
export function azulejoPattern(id, opts) {
  opts = opts || {};
  const a = opts.a || PAL.nuit2, b = opts.b || PAL.turquesa, c = opts.c || PAL.sol, d = opts.d || PAL.papel;
  return `<pattern id="${id}" width="100" height="100" patternUnits="userSpaceOnUse">
<rect width="100" height="100" fill="${a}"/>
<path d="${starPath(50, 50, 44, 26, 8, 0)}" fill="${b}"/>
<path d="${starPath(50, 50, 30, 18, 8, Math.PI / 8)}" fill="${a}" opacity=".55"/>
<path d="${diamondPath(50, 50, 12, 12)}" fill="${c}"/>
<circle cx="50" cy="50" r="4" fill="${a}"/>
<path d="${circlePath(0, 0, 13)}" fill="${d}" opacity=".9"/><path d="${circlePath(100, 0, 13)}" fill="${d}" opacity=".9"/>
<path d="${circlePath(0, 100, 13)}" fill="${d}" opacity=".9"/><path d="${circlePath(100, 100, 13)}" fill="${d}" opacity=".9"/>
<circle cx="0" cy="0" r="5" fill="${c}"/><circle cx="100" cy="0" r="5" fill="${c}"/><circle cx="0" cy="100" r="5" fill="${c}"/><circle cx="100" cy="100" r="5" fill="${c}"/>
<rect x="1" y="1" width="98" height="98" fill="none" stroke="${d}" stroke-width="1.5" opacity=".35"/>
</pattern>`;
}
/** Carreau d'azulejo en data-URI (fond CSS repetable). */
export function azulejoDataUri(opts, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size || 56}" height="${size || 56}" viewBox="0 0 100 100">${azulejoPattern('t', opts).replace(/<\/?pattern[^>]*>/g, '')}</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/**
 * Guirlande de papel picado. Chaque fanion = <g class="m-flag"> (pivot en haut au centre -> balancer avec GSAP rotation, svgOrigin).
 * opts : w, h (hauteur d'un fanion), n, colors[], seed, uid, sag (fleche de la corde, px).
 */
export function papelPicado(opts) {
  opts = opts || {};
  const W = opts.w || 1920, H = opts.h || 190, n = opts.n || 9, sag = opts.sag == null ? 40 : opts.sag;
  const cols = opts.colors || [PAL.magenta, PAL.sol, PAL.turquesa, PAL.terracotta, PAL.quetzal, PAL.sol2];
  const rnd = rng(opts.seed || 7), fw = (W / n) * 0.86, step = W / n;
  const ropeY = (x) => 14 + sag * Math.sin((Math.PI * x) / W);
  let flags = '';
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), y0 = ropeY(cx), fh = H * (0.9 + rnd() * 0.12), c = cols[i % cols.length];
    const x0 = cx - fw / 2, x1 = cx + fw / 2, teeth = 6, tw = fw / teeth;
    let outline = `M${r1(x0)} ${r1(y0)}L${r1(x1)} ${r1(y0)}L${r1(x1)} ${r1(y0 + fh - 18)}`;
    for (let t = teeth; t > 0; t--) outline += `L${r1(x0 + tw * (t - 0.5))} ${r1(y0 + fh)}L${r1(x0 + tw * (t - 1))} ${r1(y0 + fh - 18)}`;
    outline += 'Z';
    const my = y0 + fh * 0.46;
    let holes = circlePath(cx, my, fw * 0.17) + diamondPath(cx, my - fh * 0.22, fw * 0.07, fw * 0.1) + diamondPath(cx, my + fh * 0.23, fw * 0.07, fw * 0.1);
    holes += starPath(cx - fw * 0.28, my, fw * 0.1, fw * 0.045, 4, 0) + starPath(cx + fw * 0.28, my, fw * 0.1, fw * 0.045, 4, 0);
    for (let k = 0; k < 5; k++) holes += circlePath(x0 + fw * (0.14 + k * 0.18), y0 + fh * 0.12, fw * 0.028);
    for (let k = 0; k < 4; k++) holes += diamondPath(x0 + fw * (0.23 + k * 0.18), y0 + fh - 36, fw * 0.035, fw * 0.05);
    flags += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="${outline}${holes}" fill="${c}" fill-rule="evenodd"/><path d="M${r1(x0)} ${r1(y0)}L${r1(x1)} ${r1(y0)}L${r1(x1)} ${r1(y0 + 7)}L${r1(x0)} ${r1(y0 + 7)}Z" fill="#fff" opacity=".22"/></g>`;
  }
  let rope = `M0 ${ropeY(0)}`;
  for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H + sag + 30}" width="${W}" height="${H + sag + 30}" class="q-papel" aria-hidden="true"><path d="${rope}" stroke="${PAL.papel2}" stroke-width="3" fill="none" opacity=".8"/>${flags}</svg>`;
}

// ---------------------------------------------------------------- motifs par region : bunting(region) -> frise (Espagne) ou papel picado (Mexique)
/** Palettes de la frise de ceramique par region (a = fond du carreau, b = etoile, c = coeur, d = liseré, band = bandeau, edge = filets, pen = fanions sobres). */
export const FRIEZE_PAL = {
  madrid: { a: '#1D2160', b: '#2F6FD0', c: '#FFC83D', d: '#F5E6C8', band: '#F5E6C8', edge: '#14173F', pen: ['#F5E6C8', '#C9573B', '#FFC83D', '#2B318A'] },
  salamanca: { a: '#7A3A24', b: '#E9B25A', c: '#F5E6C8', d: '#F5E6C8', band: '#EBD7A8', edge: '#4A2417', pen: ['#F5E6C8', '#C9573B', '#E9B25A', '#7A3A24'] },
  sevilla: { a: '#0E7F82', b: '#2B318A', c: '#FFC83D', d: '#FFFFFF', band: '#FFFDF4', edge: '#14173F', pen: ['#FFFDF4', '#2B318A', '#FFC83D', '#19B7AA'] },
};
/**
 * Frise espagnole : bandeau de carreaux d'azulejos (cenefa) a bord festonne d'arcs, + corde de fanions sobres (banderines).
 * opts : w, region ('madrid'|'salamanca'|'sevilla'), n (fanions), seed, uid, pennants (defaut true). Chaque fanion = <g class="m-flag"> (pivot haut-centre).
 */
export function azulejoFrieze(opts) {
  opts = opts || {};
  const W = opts.w || 1920, P = FRIEZE_PAL[opts.region] || FRIEZE_PAL.madrid, id = opts.uid || uid('fz');
  const BH = 84, ARC = 26, nArc = Math.round(W / (ARC * 2)), aw = W / nArc, withPen = opts.pennants !== false;
  const n = opts.n || 16, rnd = rng(opts.seed || 5);
  let arcs = '', shadowArcs = '';
  for (let i = 0; i < nArc; i++) {
    const x0 = aw * i, x1 = aw * (i + 1), cx = (x0 + x1) / 2;
    const arc = `M${r1(x0)} ${BH - 2}H${r1(x1)}Q${r1(x1)} ${BH + ARC} ${r1(cx)} ${BH + ARC}Q${r1(x0)} ${BH + ARC} ${r1(x0)} ${BH - 2}Z`;
    shadowArcs += `<path d="${arc}" fill="#000"/>`;
    arcs += `<path d="${arc}" fill="${P.a}"/><path d="M${r1(x0 + 7)} ${BH - 2}H${r1(x1 - 7)}Q${r1(x1 - 7)} ${BH + ARC - 8} ${r1(cx)} ${BH + ARC - 8}Q${r1(x0 + 7)} ${BH + ARC - 8} ${r1(x0 + 7)} ${BH - 2}Z" fill="${P.b}" opacity=".85"/><circle cx="${r1(cx)}" cy="${BH + 5}" r="5" fill="${P.c}"/>`;
  }
  let pen = '', rope = '';
  if (withPen) {
    const ry = BH + ARC + 4, sag = 14, step = W / n, fw = step * 0.58, fh = 54;
    const ropeY = (x) => ry + sag * Math.sin((Math.PI * x) / W);
    rope = `M0 ${r1(ropeY(0))}`;
    for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
    for (let i = 0; i < n; i++) {
      const cx = step * (i + 0.5), y0 = ropeY(cx), c = P.pen[i % P.pen.length], hh = fh * (0.9 + rnd() * 0.2);
      pen += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="M${r1(cx - fw / 2)} ${r1(y0)}H${r1(cx + fw / 2)}L${r1(cx)} ${r1(y0 + hh)}Z" fill="${c}"/><path d="M${r1(cx - fw / 2)} ${r1(y0)}H${r1(cx + fw / 2)}L${r1(cx + fw / 2 - 6)} ${r1(y0 + 10)}H${r1(cx - fw / 2 + 6)}Z" fill="${shade(c, -0.25)}" opacity=".4"/><circle cx="${r1(cx)}" cy="${r1(y0 + hh * 0.32)}" r="${r1(fw * 0.09)}" fill="${shade(c, -0.35)}" opacity=".75"/></g>`;
    }
  }
  const H = BH + ARC + (withPen ? 4 + 14 + 70 : 12);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="q-frieze" aria-hidden="true"><defs>${azulejoPattern(id + 't', { a: P.a, b: P.b, c: P.c, d: P.d })}<clipPath id="${id}c"><rect width="${W}" height="${BH}"/></clipPath></defs>
<g opacity=".28" transform="translate(0 7)"><rect width="${W}" height="${BH}" fill="#000"/>${shadowArcs}</g>
<rect width="${W}" height="${BH}" fill="${P.band}"/>
<g clip-path="url(#${id}c)"><rect x="0" y="11" width="${W}" height="${BH - 25}" fill="url(#${id}t)"/></g>
<rect y="0" width="${W}" height="8" fill="${P.edge}"/><rect y="${BH - 14}" width="${W}" height="14" fill="${P.edge}"/><rect y="${BH - 10}" width="${W}" height="3" fill="${P.c}"/><rect y="8" width="${W}" height="3" fill="${P.c}"/>
${arcs}
${withPen ? `<path d="${rope}" stroke="${P.edge}" stroke-width="3" fill="none" opacity=".75"/>${pen}` : ''}</svg>`;
}
/** Motif de bordure par region : 'mexico' -> papel picado ; sinon (Espagne : 'madrid' | 'salamanca' | 'sevilla' | 'espana') -> frise d'azulejos + fanions. */
export function bunting(region, opts) {
  opts = opts || {};
  if (region === 'mexico' || region === 'oaxaca' || region === 'cdmx' || region === 'muertos') return papelPicado(opts);
  return azulejoFrieze({ ...opts, region: region === 'espana' ? 'madrid' : region });
}

/** Bruit de papier (filtre feTurbulence, statique) a inserer dans un <defs>. Usage : <rect filter="url(#id)" .../> */
export function paperGrainFilter(id) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .2  0 0 0 .22 0"/></filter>`;
}

/** Ornement de coin (carreau d'azulejo en quart de cercle + fleur). Dessine le coin haut-gauche dans une boite size x size. */
export function cornerOrnament(size, opts) {
  opts = opts || {};
  const s = size || 64, c = opts.c || PAL.sol, b = opts.b || PAL.turquesa, a = opts.a || PAL.nuit;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
<path d="M4 4H44Q28 8 22 22Q8 28 4 44Z" fill="${c}"/>
<path d="M9 9H34Q22 13 17 17Q13 22 9 34Z" fill="${a}"/>
<path d="${starPath(21, 21, 11, 5, 8, 0)}" fill="${b}"/><circle cx="21" cy="21" r="3.2" fill="${c}"/>
<circle cx="54" cy="8" r="3" fill="${c}"/><circle cx="8" cy="54" r="3" fill="${c}"/>
</svg>`;
}

// ---------------------------------------------------------------- El Quetzal (mascotte) - viewBox 0 0 600 720, regarde a droite
// Structure : <g.q-rig> -> tail streamers (q-tail-N, pivot = croupion), far wing (q-wingF), body, feet, near wing (q-wingN), head (q-head)
// Pivots (svgOrigin) : voir QUETZAL_PIVOT. Etats : plumage complet / "bare" (sans plumes). Animation : quetzalSet / quetzalPoseTo / quetzalFlap / quetzalTalk...
export const QUETZAL_PIVOT = { wing: '272 266', wingF: '286 262', head: '318 222', tail: '262 410', jaw: '366 182', rig: '300 330' };

/** Ruban effile le long de points [[x,y,largeur]...] -> chemin ferme (pointe arrondie). */
function ribbon(pts) {
  const L = [], R = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = pts[i][2] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const tip = pts[n - 1], pr = pts[n - 2]; let tx = tip[0] - pr[0], ty = tip[1] - pr[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
  const cap = [tip[0] + tx * tip[2] * 0.9, tip[1] + ty * tip[2] * 0.9];
  return smooth(L.concat([cap], R.reverse()), true);
}
function spine(pts) { return smooth(pts.map((p) => [p[0], p[1]]), false); }

/** Les 4 longues plumes de queue : [ [x,y,w] ... ] (origine ~ croupion 262,410). */
const TAILS = [
  [[262, 410, 22], [244, 470, 28], [214, 540, 30], [176, 610, 28], [118, 668, 20], [60, 700, 8]],
  [[266, 412, 20], [262, 480, 26], [250, 556, 28], [224, 628, 24], [186, 690, 14], [160, 712, 6]],
  [[258, 408, 18], [226, 456, 22], [180, 512, 24], [124, 560, 20], [70, 590, 12], [26, 600, 5]],
  [[270, 414, 16], [284, 476, 20], [286, 548, 20], [270, 620, 16], [244, 676, 10], [226, 706, 4]],
];
const TAIL_ORDER = [2, 0, 1, 3]; // ordre de repousse

function wingShape() {
  return smooth([[300, 250], [338, 266], [352, 318], [336, 382], [304, 446], [282, 470], [262, 428], [250, 360], [262, 296]], true);
}

/**
 * Quetzal SVG. opts : uid, branch (bool, perchoir), width, height.
 * Le SVG est en plumage complet ; pour "sans plumes" appeler quetzalSet(root, 'bare', gsap).
 */
export function quetzal(opts) {
  opts = opts || {};
  const id = opts.uid || uid('qz');
  const W = opts.width || 600, H = opts.height || 720;
  const g = (n) => `${id}-${n}`;
  const tails = TAILS.map((t, i) => {
    const x = t[0][0], y = t[0][1];
    const barbs = t.slice(1, -1).map((p) => `<path d="M${p[0]} ${p[1]}l${r1(-p[2] * 0.55)} ${r1(-p[2] * 0.25)}M${p[0]} ${p[1]}l${r1(p[2] * 0.55)} ${r1(p[2] * 0.25)}" stroke="${PAL.quetzal2}" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`).join('');
    return `<g class="q-tail q-tail-${i}" data-px="${x}" data-py="${y}"><path d="${ribbon(t)}" fill="url(#${g('tail' + (i % 2))})"/><path d="${spine(t.map((p) => [p[0], p[1]]))}" stroke="${PAL.quetzalClaro}" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>${barbs}</g>`;
  }).join('');
  const flightFeathers = [0, 1, 2, 3, 4].map((k) => {
    const x0 = 296 - k * 7, y0 = 400 + k * 6, ang = 14 - k * 6, s = Math.sin((ang * Math.PI) / 180);
    const pts = [[x0, y0, 20], [x0 + s * 30 - 6, y0 + 40, 22], [x0 + s * 60 - 8, y0 + 84, 16], [x0 + s * 72 - 8, y0 + 116, 6]];
    return `<path d="${ribbon(pts)}" fill="${k % 2 ? PAL.turquesa2 : '#0F6F8F'}"/>`;
  }).join('');
  const wingN = `<g class="q-wing q-wingN"><g class="q-wing-j"><g transform="translate(-30 4)">
${flightFeathers}<path d="${wingShape()}" fill="url(#${g('wing')})"/>
<path d="M276 318q30 -14 62 -2M268 352q36 -14 76 -2M268 388q32 -12 58 -2" stroke="${PAL.quetzalClaro}" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>
<path d="M312 268q26 18 30 56" stroke="#fff" stroke-width="4" fill="none" opacity=".25" stroke-linecap="round"/></g></g></g>`;
  const wingF = `<g class="q-wing q-wingF"><g class="q-wing-j">
<g transform="translate(-14 -2)"><path d="${wingShape()}" fill="${PAL.quetzal2}"/><path d="M268 360l40 14M276 400l26 10" stroke="#042F22" stroke-width="3" opacity=".5" stroke-linecap="round"/></g></g></g>`;
  const body = smooth([[286, 214], [248, 252], [226, 322], [230, 392], [262, 436], [318, 436], [356, 392], [374, 322], [368, 262], [352, 224]], true);
  const redCut = 'M200 340C250 328 330 322 400 352L400 470L200 470Z';
  const crest = `<g class="q-crest"><path d="${smooth([[262, 128], [262, 96], [288, 72], [322, 66], [352, 82], [362, 112], [350, 138], [310, 150]], true)}" fill="url(#${g('crest')})"/>
<path d="M286 130q8 -28 36 -40M308 138q14 -26 40 -30M270 112q10 -18 30 -26" stroke="${PAL.quetzalClaro}" stroke-width="3.5" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  const branch = opts.branch ? `<g class="q-branch"><path d="M20 470Q200 454 320 460T590 448" stroke="#5A3418" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M20 464Q200 448 320 454T590 442" stroke="#8A5A2B" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><path d="M470 452q40 -34 80 -30M110 466q-10 -38 -50 -52" stroke="#5A3418" stroke-width="10" fill="none" stroke-linecap="round"/></g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.view || '0 0 600 720'}" width="${W}" height="${H}" class="q-svg" role="img" aria-label="El Quetzal">
<defs>
<linearGradient id="${g('tail0')}" x1="262" y1="410" x2="60" y2="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzal}"/><stop offset=".55" stop-color="${PAL.turquesa}"/><stop offset="1" stop-color="#2468C9"/></linearGradient>
<linearGradient id="${g('tail1')}" x1="262" y1="410" x2="200" y2="710" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzal2}"/><stop offset=".5" stop-color="${PAL.quetzal}"/><stop offset="1" stop-color="${PAL.turquesa}"/></linearGradient>
<linearGradient id="${g('wing')}" x1="270" y1="260" x2="340" y2="460" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzalClaro}"/><stop offset=".35" stop-color="${PAL.quetzal}"/><stop offset=".8" stop-color="${PAL.turquesa2}"/><stop offset="1" stop-color="#1B4E8F"/></linearGradient>
<linearGradient id="${g('body')}" x1="240" y1="230" x2="380" y2="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzalClaro}"/><stop offset=".45" stop-color="${PAL.quetzal}"/><stop offset="1" stop-color="${PAL.quetzal2}"/></linearGradient>
<linearGradient id="${g('red')}" x1="300" y1="330" x2="320" y2="440" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF4A64"/><stop offset=".55" stop-color="${PAL.rojo}"/><stop offset="1" stop-color="#8E0F26"/></linearGradient>
<radialGradient id="${g('head')}" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${PAL.quetzalClaro}"/><stop offset=".55" stop-color="${PAL.quetzal}"/><stop offset="1" stop-color="${PAL.quetzal2}"/></radialGradient>
<linearGradient id="${g('crest')}" x1="280" y1="70" x2="340" y2="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="${PAL.quetzal2}"/></linearGradient>
<clipPath id="${g('eyeclip')}"><circle cx="342" cy="160" r="15.5"/></clipPath>
<clipPath id="${g('clip')}"><path d="${body}"/></clipPath>
</defs>
${branch}
<g class="q-rig">
${tails}
${wingF}
<g class="q-bodyg">
<path class="q-body" d="${body}" fill="url(#${g('body')})"/>
<g clip-path="url(#${g('clip')})"><path class="q-red" d="${redCut}" fill="url(#${g('red')})"/>
<path d="M214 338C260 326 332 322 398 350" stroke="#fff" stroke-width="5" fill="none" opacity=".28"/>
<path d="M232 270Q246 340 238 392" stroke="#fff" stroke-width="10" fill="none" opacity=".12" stroke-linecap="round"/></g>
<path class="q-dull" d="${body}" fill="#9AA79A" opacity="0"/>
</g>
<g class="q-feet" fill="none" stroke="#E0A33A" stroke-width="7" stroke-linecap="round"><path d="M290 432v22l-12 8M290 454l10 8M322 430v24l-12 8M322 454l10 8"/></g>
${wingN}
<g class="q-head">
${crest}
<circle cx="322" cy="168" r="54" fill="url(#${g('head')})"/>
<path d="M276 150q18 -34 56 -36" stroke="#fff" stroke-width="6" fill="none" opacity=".22" stroke-linecap="round"/>
<g class="q-eye"><circle cx="342" cy="160" r="15" fill="#F7F1DC"/><circle cx="345" cy="160" r="10.5" fill="#1A1020"/><circle cx="348" cy="156" r="3.6" fill="#fff"/><circle cx="342" cy="164" r="1.8" fill="#fff" opacity=".6"/></g>
<g clip-path="url(#${g('eyeclip')})"><rect class="q-lid" x="322" y="128" width="44" height="32" fill="${PAL.quetzal}" opacity="0" transform="translate(0 -18)"/></g>
<circle class="q-dull-h" cx="322" cy="168" r="54" fill="#9AA79A" opacity="0"/>
<path d="M334 190q10 8 24 4" stroke="${PAL.quetzal2}" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
<g class="q-jaw"><path d="M364 182Q398 186 378 208Q368 202 362 196Z" fill="#D9930B"/></g>
<path class="q-beak" d="M362 150Q412 158 380 186L362 184Z" fill="#F7B80C"/><path d="M372 160q14 2 20 8" stroke="#fff" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
</g>
</g>
</svg>`;
}

// --- Rig ------------------------------------------------------------------------------------------------------
export const QUETZAL_POSES = {
  perched: { rot: 0, x: 0, y: 0, head: 0, wing: 4, wingF: 4, lid: 0 },
  fly: { rot: 62, x: 0, y: 0, head: -22, wing: -62, wingF: -40, lid: 0 },
  glide: { rot: 48, x: 0, y: 0, head: -16, wing: -78, wingF: -64, lid: 0 },
  talk: { rot: -4, x: 0, y: -4, head: -6, wing: 14, wingF: 8, lid: 0 },
  sad: { rot: 6, x: 0, y: 12, head: 22, wing: 26, wingF: 20, lid: 0.55 },
  happy: { rot: -6, x: 0, y: -14, head: -12, wing: -34, wingF: -26, lid: 0 },
};
function qEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function qa(root, sel) { return Array.from(qEl(root).querySelectorAll(sel)); }
function tailOrigin(t) { return t.dataset.px + ' ' + t.dataset.py; }

/** Applique immediatement (gsap.set) une pose ('perched'|'fly'|'glide'|'talk'|'sad'|'happy') ou l'etat 'bare' (sans plumes) / 'full'. */
export function quetzalSet(root, name, g) {
  if (name === 'bare') {
    qa(root, '.q-tail').forEach((t) => g.set(t, { scale: 0.1, svgOrigin: tailOrigin(t), rotation: 0 }));
    g.set(qa(root, '.q-crest'), { scale: 0.32, svgOrigin: '300 150' });
    g.set(qa(root, '.q-dull, .q-dull-h'), { opacity: 0.72 });
    g.set(qa(root, '.q-red'), { opacity: 0.6 });
    return;
  }
  if (name === 'full') {
    qa(root, '.q-tail').forEach((t) => g.set(t, { scale: 1, svgOrigin: tailOrigin(t) }));
    g.set(qa(root, '.q-crest'), { scale: 1, svgOrigin: '300 150' });
    g.set(qa(root, '.q-dull, .q-dull-h'), { opacity: 0 });
    g.set(qa(root, '.q-red'), { opacity: 1 });
    return;
  }
  const p = QUETZAL_POSES[name] || QUETZAL_POSES.perched;
  g.set(qa(root, '.q-rig'), { rotation: p.rot, x: p.x, y: p.y, svgOrigin: QUETZAL_PIVOT.rig });
  g.set(qa(root, '.q-head'), { rotation: p.head, svgOrigin: QUETZAL_PIVOT.head });
  g.set(qa(root, '.q-wingN .q-wing-j'), { rotation: p.wing, svgOrigin: QUETZAL_PIVOT.wing });
  g.set(qa(root, '.q-wingF .q-wing-j'), { rotation: p.wingF, svgOrigin: QUETZAL_PIVOT.wingF });
  g.set(qa(root, '.q-lid'), { opacity: p.lid ? 1 : 0, y: -18 + 18 * p.lid });
}
/** Tween (dans la timeline tl) vers une pose. */
export function quetzalPoseTo(tl, root, name, at, dur, ease) {
  const p = QUETZAL_POSES[name] || QUETZAL_POSES.perched, e = ease || 'power3.inOut';
  const T = (sel, vars) => { const els = qa(root, sel); if (els.length) tl.to(els, Object.assign({ duration: dur, ease: e }, vars), at); };
  T('.q-rig', { rotation: p.rot, x: p.x, y: p.y, svgOrigin: QUETZAL_PIVOT.rig });
  T('.q-head', { rotation: p.head, svgOrigin: QUETZAL_PIVOT.head });
  T('.q-wingN .q-wing-j', { rotation: p.wing, svgOrigin: QUETZAL_PIVOT.wing });
  T('.q-wingF .q-wing-j', { rotation: p.wingF, svgOrigin: QUETZAL_PIVOT.wingF });
  T('.q-lid', { opacity: p.lid ? 1 : 0, y: -18 + 18 * p.lid });
}
/** Battements d'ailes : `count` cycles de `period` s a partir de `at`. Descente puissante, remontee souple ; le corps ondule avec. */
export function quetzalFlap(tl, root, at, count, period, amp) {
  const a = amp == null ? 1 : amp;
  const wn = qa(root, '.q-wingN .q-wing-j'), wf = qa(root, '.q-wingF .q-wing-j'), body = qa(root, '.q-bodyg, .q-head');
  for (let i = 0; i < count; i++) {
    const t = at + i * period;
    tl.to(wn, { rotation: -92 * a, svgOrigin: QUETZAL_PIVOT.wing, duration: period * 0.42, ease: 'sine.out' }, t);
    tl.to(wn, { rotation: 6 * a, svgOrigin: QUETZAL_PIVOT.wing, duration: period * 0.58, ease: 'power2.inOut' }, t + period * 0.42);
    tl.to(wf, { rotation: -78 * a, svgOrigin: QUETZAL_PIVOT.wingF, duration: period * 0.42, ease: 'sine.out' }, t + period * 0.05);
    tl.to(wf, { rotation: 2 * a, svgOrigin: QUETZAL_PIVOT.wingF, duration: period * 0.58, ease: 'power2.inOut' }, t + period * 0.47);
    tl.to(body, { y: 10 * a, duration: period * 0.42, ease: 'sine.out' }, t);
    tl.to(body, { y: 0, duration: period * 0.58, ease: 'sine.inOut' }, t + period * 0.42);
  }
}
/** Bec qui parle : `n` ouvertures reparties sur `dur`. */
export function quetzalTalk(tl, root, at, dur, n) {
  const jaw = qa(root, '.q-jaw'), step = dur / n;
  for (let i = 0; i < n; i++) {
    tl.to(jaw, { rotation: 22 + (i % 3) * 6, svgOrigin: QUETZAL_PIVOT.jaw, duration: step * 0.4, ease: 'power2.out' }, at + i * step);
    tl.to(jaw, { rotation: 0, svgOrigin: QUETZAL_PIVOT.jaw, duration: step * 0.45, ease: 'power2.in' }, at + i * step + step * 0.45);
  }
}
export function quetzalBlink(tl, root, at) {
  const eye = qa(root, '.q-eye');
  tl.to(eye, { scaleY: 0.08, svgOrigin: '342 160', duration: 0.07, ease: 'power2.in' }, at);
  tl.to(eye, { scaleY: 1, svgOrigin: '342 160', duration: 0.12, ease: 'power2.out' }, at + 0.09);
}
/** Ondulation des plumes de queue (decalee plume par plume), un aller-retour. */
export function quetzalSway(tl, root, at, dur, amp) {
  const a = amp == null ? 1 : amp;
  qa(root, '.q-tail').forEach((t, i) => {
    tl.to(t, { rotation: (i % 2 ? -1 : 1) * 4.5 * a, svgOrigin: tailOrigin(t), duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + i * 0.12);
  });
}
/** Les plumes reviennent : queue (4 plumes en cascade elastique), huppe, couleur. Duree ~ 2.2 s. */
export function quetzalRegrow(tl, root, at) {
  const tails = qa(root, '.q-tail');
  TAIL_ORDER.forEach((idx, k) => {
    const t = tails[idx]; if (!t) return;
    tl.to(t, { scale: 1, svgOrigin: tailOrigin(t), duration: 0.9, ease: 'elastic.out(1,0.55)' }, at + 0.15 + k * 0.28);
  });
  tl.to(qa(root, '.q-crest'), { scale: 1, svgOrigin: '300 150', duration: 0.8, ease: 'back.out(2.2)' }, at + 0.9);
  tl.to(qa(root, '.q-dull, .q-dull-h'), { opacity: 0, duration: 1.2, ease: 'power2.out' }, at + 0.1);
  tl.to(qa(root, '.q-red'), { opacity: 1, duration: 1.2, ease: 'power2.out' }, at + 0.1);
}

// ---------------------------------------------------------------- La Sombra del Silencio - viewBox 0 0 500 660
// Silhouette de fumee encapuchonnee, vide sans visage, deux yeux qui brillent. Parties : s-wisp-N (volutes), s-body, s-void, s-eye (x2), s-arm.
export const SOMBRA_PIVOT = { rig: '250 330', eyeL: '226 142', eyeR: '276 142' };

export function sombra(opts) {
  opts = opts || {};
  const id = opts.uid || uid('sb'), W = opts.width || 480, H = opts.height || 576, g = (n) => `${id}-${n}`;
  const eyeColor = opts.eye || '#FFE7A3', glow = opts.glow || PAL.magenta;
  const body = smooth([[250, 36], [206, 82], [186, 140], [198, 196], [150, 236], [96, 322], [74, 430], [92, 520], [62, 612], [112, 566], [142, 636], [182, 560], [216, 644], [250, 570], [286, 644], [320, 560], [358, 636], [392, 560], [440, 614], [418, 520], [440, 430], [412, 322], [352, 236], [304, 196], [316, 140], [296, 82]], true);
  const wisps = [
    [[110, 330], [70, 270], [88, 200], [56, 140]], [[380, 330], [430, 262], [412, 190], [446, 120]],
    [[160, 220], [140, 150], [168, 96], [150, 40]], [[340, 220], [364, 150], [334, 90], [352, 30]],
    [[250, 36], [236, 0], [262, -22], [250, -50]],
  ].map((w, i) => {
    const thick = [34, 34, 22, 22, 16][i];
    const pts = w.map((p, k) => [p[0], p[1], thick * (1 - k / (w.length + 0.4))]);
    return `<g class="s-wisp s-wisp-${i}" data-px="${w[0][0]}" data-py="${w[0][1]}"><path d="${ribbonS(pts)}" fill="url(#${g('smoke')})" opacity="${0.78 - i * 0.06}"/></g>`;
  }).join('');
  const arm = `<g class="s-arm"><path d="${smooth([[372, 330], [430, 350], [486, 380], [520, 372], [492, 404], [440, 410], [380, 392]], true)}" fill="url(#${g('smoke')})"/><path d="M510 376l30 -10M504 392l32 6M496 404l26 18" stroke="#0C0E2E" stroke-width="7" stroke-linecap="round"/></g>`;
  const eye = (cx, cy, cls) => `<g class="s-eye ${cls}"><ellipse cx="${cx}" cy="${cy}" rx="44" ry="34" fill="url(#${g('glow')})"/><path d="M${cx - 24} ${cy + 5}Q${cx} ${cy - 22} ${cx + 24} ${cy - 5}Q${cx} ${cy + 16} ${cx - 24} ${cy + 5}Z" fill="${eyeColor}"/><ellipse cx="${cx + 3}" cy="${cy - 1}" rx="4.5" ry="8" fill="#2A0A24"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.view || '-40 -60 600 720'}" width="${W}" height="${H}" class="s-svg" role="img" aria-label="La Sombra del Silencio">
<defs>
<linearGradient id="${g('smoke')}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#3A3F9A"/><stop offset=".45" stop-color="#1E2161"/><stop offset="1" stop-color="#0C0E2E"/></linearGradient>
<linearGradient id="${g('body')}" x1="250" y1="30" x2="250" y2="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#262B78"/><stop offset=".4" stop-color="#171A52"/><stop offset="1" stop-color="#06071C"/></linearGradient>
<radialGradient id="${g('void')}" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#02020C"/><stop offset=".8" stop-color="#05061A"/><stop offset="1" stop-color="#0B0D2E"/></radialGradient>
<radialGradient id="${g('glow')}"><stop offset="0" stop-color="${glow}" stop-opacity=".95"/><stop offset=".5" stop-color="${glow}" stop-opacity=".35"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
</defs>
<g class="s-rig">
${wisps}
<g class="s-bodyg"><path class="s-body" d="${body}" fill="url(#${g('body')})" stroke="#6C74F0" stroke-opacity=".38" stroke-width="3" stroke-linejoin="round"/>
<path d="M150 236Q250 270 352 236M118 340Q250 380 382 340" stroke="#4B52C4" stroke-width="3" fill="none" opacity=".25" stroke-linecap="round"/>
<path d="M186 140Q250 30 316 140Q320 214 250 230Q184 214 186 140Z" fill="url(#${g('void')})"/>
${eye(222, 146, 's-eyeL')}${eye(280, 146, 's-eyeR')}
</g>
${opts.arm ? arm : ''}
</g>
</svg>`;
}
function ribbonS(pts) { // ruban lisse (copie locale legere de ribbon() pour les volutes)
  const L = [], R = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = pts[i][2] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const tip = pts[n - 1];
  return smooth(L.concat([[tip[0], tip[1] - 14]], R.reverse()), true);
}

function sEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function sa(root, sel) { return Array.from(sEl(root).querySelectorAll(sel)); }
/** Flottement lent + volutes qui ondulent (cycle fini : `cycles` aller-retours de `period` s). */
export function sombraFloat(tl, root, at, cycles, period) {
  const body = sa(root, '.s-bodyg');
  tl.to(body, { y: -14, duration: period / 2, ease: 'sine.inOut', yoyo: true, repeat: cycles * 2 - 1 }, at);
  sa(root, '.s-wisp').forEach((w, i) => {
    tl.to(w, { rotation: (i % 2 ? -1 : 1) * 7, svgOrigin: w.dataset.px + ' ' + w.dataset.py, duration: period * 0.7, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.round(cycles * 2 * 0.7) * 2 - 1) }, at + i * 0.15);
  });
}
/** Yeux : s'allument (ouverture) ou se plissent. */
export function sombraEyes(tl, root, at, mode, dur) {
  const eyes = sa(root, '.s-eye'), d = dur || 0.3;
  if (mode === 'open') tl.fromTo(eyes, { scaleY: 0.05, opacity: 0 }, { scaleY: 1, opacity: 1, svgOrigin: '250 144', duration: d, ease: 'back.out(3)' }, at);
  else if (mode === 'narrow') tl.to(eyes, { scaleY: 0.35, svgOrigin: '250 144', duration: d, ease: 'power2.inOut' }, at);
  else tl.to(eyes, { scaleY: 1, svgOrigin: '250 144', duration: d, ease: 'power2.out' }, at);
}
/** Dissolution : le corps se detache vers le haut en cendres (la poussiere doree est a la charge de la scene : dustField). */
export function sombraDissolve(tl, root, at, dur) {
  const r = sEl(root);
  tl.to(sa(r, '.s-eye'), { opacity: 0, scale: 0.4, svgOrigin: '250 144', duration: dur * 0.3, ease: 'power2.in' }, at);
  tl.to(sa(r, '.s-bodyg'), { scaleY: 0.35, scaleX: 1.12, y: -30, opacity: 0, svgOrigin: '250 640', duration: dur, ease: 'power2.in' }, at + dur * 0.1);
  sa(r, '.s-wisp').forEach((w, i) => tl.to(w, { y: -160 - i * 30, x: (i % 2 ? 40 : -40), opacity: 0, scale: 0.6, svgOrigin: w.dataset.px + ' ' + w.dataset.py, duration: dur * 0.9, ease: 'power1.in' }, at + i * 0.08));
}

// ---------------------------------------------------------------- icones de monuments (100x100, plates, 2 tons : `c` encre, `a` accent)
// Silhouettes originales simplifiees (aucune IP) : Puerta de Alcala, cathedrale, Giralda, Angel, calavera, Miguelete, Obelisco,
// Monserrate, piramide maya, Machu Picchu, Sagrada Familia.
export const MONUMENTS = ['alcala', 'catedral', 'giralda', 'angel', 'calavera', 'miguelete', 'obelisco', 'monserrate', 'piramide', 'machu', 'sagrada'];
export function monument(key, c, a) {
  c = c || PAL.encre; a = a || PAL.sol;
  switch (key) {
    case 'alcala': // 3 arcs, fronton, statues
      return `<path d="M10 82V46H90V82H72V66a6 6 0 0 0-12 0V82H40V66a6 6 0 0 0-12 0V82Z" fill="${c}"/><path d="M50 82V52a9 9 0 0 1 0 0" /><path d="M42 82V58a8 8 0 0 1 16 0V82Z" fill="${c}"/><path d="M8 46L50 24L92 46Z" fill="${c}"/><path d="M30 44L50 31L70 44Z" fill="${a}"/><rect x="46" y="12" width="8" height="12" fill="${c}"/><circle cx="50" cy="10" r="4.5" fill="${a}"/><path d="M14 46V40h6V46M80 46V40h6V46" stroke="${c}" stroke-width="3"/>`;
    case 'catedral':
      return `<path d="M12 84V42L22 30L32 42V84Z M68 84V42L78 30L88 42V84Z" fill="${c}"/><path d="M32 84V54H68V84Z" fill="${c}"/><path d="M34 54Q50 14 66 54Z" fill="${c}"/><path d="M42 84V66a8 8 0 0 1 16 0V84Z" fill="${a}"/><circle cx="50" cy="44" r="6" fill="${a}"/><rect x="48.5" y="10" width="3" height="14" fill="${c}"/><rect x="43.5" y="14" width="13" height="3" fill="${c}"/><circle cx="22" cy="48" r="3.5" fill="${a}"/><circle cx="78" cy="48" r="3.5" fill="${a}"/>`;
    case 'giralda':
      return `<path d="M36 90V36H64V90Z" fill="${c}"/><path d="M32 36H68V28H32Z" fill="${c}"/><path d="M38 28H62V16H38Z" fill="${c}"/><path d="M42 16Q50 -2 58 16Z" fill="${c}"/><circle cx="50" cy="4" r="3" fill="${a}"/><rect x="42" y="18" width="5" height="9" rx="2.5" fill="${a}"/><rect x="53" y="18" width="5" height="9" rx="2.5" fill="${a}"/><rect x="43" y="44" width="5" height="14" rx="2.5" fill="${a}"/><rect x="52" y="44" width="5" height="14" rx="2.5" fill="${a}"/><rect x="43" y="66" width="5" height="14" rx="2.5" fill="${a}"/><rect x="52" y="66" width="5" height="14" rx="2.5" fill="${a}"/><path d="M20 90H80" stroke="${c}" stroke-width="6"/>`;
    case 'angel': // colonne + victoire ailee
      return `<path d="M30 92H70V84H62V50H38V84H30Z" fill="${c}"/><path d="M42 50V34H58V50Z" fill="${c}"/><circle cx="50" cy="22" r="7" fill="${a}"/><path d="M50 30Q20 22 8 6Q28 6 44 22Z M50 30Q80 22 92 6Q72 6 56 22Z" fill="${a}"/><path d="M50 30L44 46H56Z" fill="${c}"/><path d="M34 60H66M34 70H66" stroke="${a}" stroke-width="3"/>`;
    case 'calavera':
      return `<path d="M50 8C26 8 14 26 16 46C17 56 22 62 28 66V84H72V66C78 62 83 56 84 46C86 26 74 8 50 8Z" fill="${c}"/><circle cx="35" cy="45" r="11" fill="${a}"/><circle cx="65" cy="45" r="11" fill="${a}"/><circle cx="35" cy="45" r="4" fill="${c}"/><circle cx="65" cy="45" r="4" fill="${c}"/><path d="M50 56L44 68H56Z" fill="${a}"/><path d="M34 74V84M42 74V84M50 74V84M58 74V84M66 74V84" stroke="${a}" stroke-width="3.5"/><path d="M35 34l-2 -9 5 5 4 -7 3 8" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'miguelete': // tour octogonale + coupole
      return `<path d="M34 92V34H66V92Z" fill="${c}"/><path d="M30 34H70V26H30Z" fill="${c}"/><path d="M36 26Q50 -2 64 26Z" fill="${c}"/><rect x="48.5" y="-4" width="3" height="10" fill="${c}"/><rect x="40" y="38" width="6" height="14" rx="3" fill="${a}"/><rect x="54" y="38" width="6" height="14" rx="3" fill="${a}"/><rect x="40" y="60" width="6" height="14" rx="3" fill="${a}"/><rect x="54" y="60" width="6" height="14" rx="3" fill="${a}"/><path d="M42 26H58" stroke="${a}" stroke-width="3"/>`;
    case 'obelisco':
      return `<path d="M50 2L58 30L62 86H38L42 30Z" fill="${c}"/><path d="M50 2L58 30H50Z" fill="${a}" opacity=".5"/><path d="M28 92H72V84H28Z" fill="${c}"/><rect x="47" y="56" width="6" height="12" rx="3" fill="${a}"/>`;
    case 'monserrate':
      return `<path d="M0 92L34 36Q44 20 56 36L100 92Z" fill="${c}"/><path d="M34 50L44 40L56 52L66 70H24Z" fill="${a}" opacity=".35"/><rect x="42" y="12" width="12" height="14" fill="${a}"/><path d="M40 12L48 2L56 12Z" fill="${a}"/><rect x="47" y="-4" width="2" height="8" fill="${a}"/><rect x="44" y="-1" width="8" height="2" fill="${a}"/>`;
    case 'piramide':
      return `<path d="M8 90V82H18V74H28V66H38V58H62V66H72V74H82V82H92V90Z" fill="${c}"/><path d="M38 58V46H62V58Z" fill="${c}"/><path d="M42 46V34H58V46Z" fill="${c}"/><rect x="46" y="38" width="8" height="8" fill="${a}"/><path d="M50 90V60" stroke="${a}" stroke-width="7"/><path d="M42 90V74M58 90V74" stroke="${a}" stroke-width="2" opacity=".6"/>`;
    case 'machu':
      return `<path d="M0 92L28 44L40 54L62 8L100 92Z" fill="${c}"/><path d="M6 84H70M14 74H66M22 64H60" stroke="${a}" stroke-width="3.5" stroke-linecap="round"/><circle cx="80" cy="22" r="10" fill="${a}"/>`;
    case 'sagrada':
      return `<path d="M14 92V38L20 8L26 38V92Z M30 92V30L36 2L42 30V92Z M44 92V20L50 -4L56 20V92Z M58 92V30L64 2L70 30V92Z M74 92V38L80 8L86 38V92Z" fill="${c}"/><circle cx="20" cy="40" r="2.5" fill="${a}"/><circle cx="36" cy="32" r="2.5" fill="${a}"/><circle cx="50" cy="22" r="2.5" fill="${a}"/><circle cx="64" cy="32" r="2.5" fill="${a}"/><circle cx="80" cy="40" r="2.5" fill="${a}"/><path d="M40 92V70a10 10 0 0 1 20 0V92Z" fill="${a}"/>`;
    default:
      return `<circle cx="50" cy="50" r="30" fill="${c}"/>`;
  }
}
/** Icone autonome (svg 100x100 avec marge). */
export function monumentSvg(key, opts) {
  opts = opts || {};
  const s = opts.size || 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -10 112 112" width="${s}" height="${s}" aria-hidden="true">${monument(key, opts.c, opts.a)}</svg>`;
}

// ---------------------------------------------------------------- carte du monde hispanique (stylisee) - viewBox 0 0 1600 1200
// Contours simplifies a la main (lon/lat, domaine public / geometrie factuelle, inspires de Natural Earth 110m). Carte "de voyage" :
// l'Iberique est agrandie en inset (x4), le Mexique est "fisheye" (loupe) pour que les medaillons respirent.
// Camera : groupe .m-cam (transform GSAP, svgOrigin "0 0"). Etats des regions : 'locked' | 'open' | 'current' | 'done'.
export const MAP_W = 1600, MAP_H = 1200;

const LAND = {
  mainland: [[-114.8, 32.5], [-114.8, 31.7], [-113.1, 31.2], [-112.2, 29.0], [-110.6, 27.9], [-109.4, 26.0], [-108.4, 25.2], [-107.0, 23.8], [-105.6, 22.4], [-105.5, 20.8], [-105.2, 19.6], [-103.5, 18.3], [-102.0, 17.4], [-100.0, 16.8], [-98.0, 16.0], [-96.2, 15.7], [-94.6, 16.2], [-93.0, 15.2], [-92.2, 14.5], [-91.0, 13.9], [-89.4, 13.5], [-87.6, 13.2], [-86.2, 12.1], [-85.7, 11.0], [-85.7, 10.0], [-84.9, 9.8], [-83.7, 8.7], [-82.9, 8.0], [-81.5, 7.4], [-80.4, 7.3], [-80.4, 8.2], [-79.5, 8.9], [-78.5, 8.3], [-77.9, 7.3], [-77.4, 4.0], [-78.6, 2.4], [-79.0, 1.4], [-80.0, -0.9], [-80.9, -2.3], [-81.2, -4.6], [-79.9, -6.6], [-78.0, -9.0], [-77.0, -11.5], [-76.3, -13.4], [-75.2, -15.3], [-72.8, -16.8], [-71.0, -17.8], [-70.3, -19.0], [-70.2, -23.0], [-70.8, -27.5], [-71.5, -30.3], [-71.7, -34.5], [-72.6, -37.5], [-73.4, -39.8], [-73.8, -42.0], [-74.2, -46.0], [-75.2, -49.5], [-74.5, -52.5], [-72.0, -53.8], [-70.5, -55.0], [-68.3, -55.0], [-66.5, -55.0], [-66.0, -54.4], [-68.4, -52.6], [-68.8, -51.0], [-67.6, -49.0], [-66.4, -47.0], [-65.2, -45.2], [-65.6, -43.0], [-64.5, -41.5], [-62.4, -40.7], [-62.2, -39.0], [-58.5, -38.0], [-57.5, -36.5], [-57.2, -35.5], [-58.4, -34.5], [-56.3, -34.9], [-54.2, -34.7], [-53.4, -33.7], [-51.0, -31.3], [-49.3, -28.5], [-48.5, -26.2], [-48.6, -25.4], [-46.5, -24.0], [-44.0, -23.0], [-41.8, -22.8], [-40.5, -21.0], [-39.7, -18.5], [-39.1, -15.8], [-38.9, -13.0], [-37.2, -11.0], [-35.2, -8.8], [-34.8, -7.0], [-35.2, -5.4], [-37.2, -4.8], [-39.5, -3.0], [-42.0, -2.7], [-44.5, -2.4], [-45.6, -1.0], [-48.5, -1.0], [-50.0, 0.0], [-50.6, 2.0], [-51.5, 4.2], [-53.5, 5.8], [-57.0, 6.0], [-58.5, 6.8], [-60.5, 8.5], [-62.0, 10.6], [-63.0, 10.7], [-64.5, 10.2], [-66.5, 10.6], [-68.0, 10.5], [-69.8, 11.7], [-71.5, 12.4], [-72.2, 11.4], [-73.5, 11.3], [-74.8, 10.9], [-75.6, 10.4], [-76.4, 9.0], [-77.4, 8.7], [-78.0, 9.4], [-79.4, 9.5], [-80.3, 9.2], [-81.6, 8.8], [-82.8, 9.6], [-83.4, 10.4], [-83.6, 11.0], [-83.4, 12.4], [-83.2, 14.0], [-84.0, 15.2], [-85.0, 15.9], [-86.5, 16.0], [-87.8, 15.9], [-88.5, 15.9], [-88.2, 16.5], [-88.2, 17.8], [-87.8, 18.4], [-87.4, 19.4], [-86.8, 20.6], [-87.2, 21.4], [-88.4, 21.5], [-90.2, 21.1], [-90.5, 20.1], [-90.6, 19.4], [-91.6, 18.7], [-92.8, 18.5], [-94.0, 18.2], [-95.2, 18.6], [-96.2, 19.2], [-96.7, 20.5], [-97.3, 21.5], [-97.7, 22.6], [-97.7, 24.0], [-97.4, 25.4], [-97.4, 25.9], [-99.5, 27.6], [-100.6, 28.7], [-101.4, 29.7], [-102.4, 29.8], [-103.1, 29.0], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111.1, 31.3]],
  baja: [[-117.1, 32.5], [-116.6, 31.5], [-115.8, 30.3], [-114.7, 28.6], [-114.1, 27.5], [-112.9, 26.5], [-112.1, 24.9], [-110.7, 23.4], [-109.5, 23.0], [-109.8, 23.9], [-111.0, 25.0], [-111.8, 26.5], [-112.7, 28.0], [-114.3, 29.8], [-114.8, 31.5], [-114.8, 32.5]],
  usa: [[-117.1, 32.5], [-114.8, 32.5], [-111.1, 31.3], [-108.2, 31.3], [-108.2, 31.8], [-106.5, 31.8], [-104.5, 29.6], [-103.1, 29.0], [-102.4, 29.8], [-101.4, 29.7], [-100.6, 28.7], [-99.5, 27.6], [-97.4, 25.9], [-97.3, 27.6], [-95.0, 29.2], [-93.0, 29.7], [-90.5, 29.1], [-89.2, 30.2], [-87.5, 30.3], [-85.4, 29.7], [-84.0, 30.1], [-82.8, 29.0], [-82.7, 27.5], [-81.8, 26.2], [-80.9, 25.2], [-80.2, 25.7], [-80.0, 27.0], [-80.6, 28.8], [-81.4, 30.4], [-81.2, 31.6], [-79.0, 33.4], [-77.0, 34.7], [-75.5, 35.3], [-75.8, 37.0], [-74.0, 40.5], [-72.0, 41.2], [-70.0, 41.7], [-70.5, 43.5], [-67.0, 45.0], [-67.0, 52], [-124.5, 52], [-124.1, 44.0], [-124.3, 41.5], [-123.9, 39.5], [-122.5, 37.8], [-121.9, 36.6], [-120.6, 34.5], [-118.4, 34.0]],
  brasil: [[-51.5, 4.2], [-50.6, 2.0], [-50.0, 0.0], [-48.5, -1.0], [-45.6, -1.0], [-44.5, -2.4], [-42.0, -2.7], [-39.5, -3.0], [-37.2, -4.8], [-35.2, -5.4], [-34.8, -7.0], [-35.2, -8.8], [-37.2, -11.0], [-38.9, -13.0], [-39.1, -15.8], [-39.7, -18.5], [-40.5, -21.0], [-41.8, -22.8], [-44.0, -23.0], [-46.5, -24.0], [-48.6, -25.4], [-48.5, -26.2], [-49.3, -28.5], [-51.0, -31.3], [-53.4, -33.7], [-57.6, -30.2], [-55.7, -28.2], [-53.7, -26.1], [-54.6, -25.6], [-54.5, -24.0], [-55.4, -22.0], [-57.8, -22.1], [-58.2, -19.8], [-60.0, -16.3], [-60.4, -14.5], [-65.0, -12.0], [-65.4, -9.8], [-69.0, -10.9], [-72.4, -9.5], [-73.5, -7.2], [-70.0, -4.2], [-69.5, -1.0], [-69.8, 1.0], [-66.0, 1.5], [-64.0, 1.8], [-62.7, 4.0], [-60.7, 5.2], [-59.0, 1.4], [-57.5, 2.0], [-55.9, 2.0], [-54.0, 2.2], [-52.6, 2.4]],
  guayanas: [[-60.5, 8.5], [-58.5, 6.8], [-57.0, 6.0], [-53.5, 5.8], [-51.5, 4.2], [-52.6, 2.4], [-54.0, 2.2], [-55.9, 2.0], [-57.5, 2.0], [-59.0, 1.4], [-60.7, 5.2]],
  cuba: [[-85.0, 21.9], [-83.4, 22.9], [-81.5, 23.2], [-79.5, 22.9], [-77.8, 21.8], [-76.0, 21.2], [-74.2, 20.2], [-75.6, 19.9], [-77.7, 19.8], [-78.9, 21.6], [-81.0, 22.0], [-82.8, 22.6]],
  hispaniola: [[-74.4, 18.4], [-73.4, 19.9], [-71.6, 19.9], [-69.9, 19.7], [-68.4, 18.6], [-70.0, 18.3], [-71.4, 17.7], [-73.0, 18.1]],
  iberia: [[-9.3, 42.9], [-8.6, 43.5], [-7.0, 43.7], [-5.8, 43.6], [-4.2, 43.4], [-3.0, 43.4], [-1.8, 43.4], [3.2, 42.4], [3.2, 42.0], [2.5, 41.5], [1.4, 41.1], [0.8, 40.8], [0.1, 40.0], [-0.3, 39.4], [0.2, 38.8], [-0.2, 38.5], [-0.7, 37.7], [-1.6, 37.0], [-2.2, 36.7], [-3.4, 36.7], [-4.4, 36.7], [-5.3, 36.1], [-6.3, 36.5], [-6.9, 37.2], [-7.4, 37.2], [-8.4, 37.1], [-8.9, 37.0], [-8.8, 38.0], [-9.4, 38.7], [-8.9, 39.6], [-8.9, 40.9], [-8.8, 41.8], [-9.0, 42.4]],
  francia: [[-1.8, 43.4], [3.2, 42.4], [3.0, 43.3], [6.5, 43.2], [8, 46], [8, 52], [-6, 52], [-5, 48.4], [-1.2, 46]],
  africa: [[-5.9, 35.8], [-2.0, 35.1], [2.0, 36.6], [6.0, 37.0], [10.0, 37.3], [10, 34], [-7.2, 34]],
};

function baseXY(lon, lat) {
  if (lon > -16) return [1330 + (lon + 3.5) * 38, 215 - (lat - 40) * 46]; // inset Iberique
  return [100 + (lon + 118) * 12, (45 - lat) * 12];
}
const FISH = { fx: 316, fy: 306, m: 0.95, R: 260 };
/** lon/lat -> coordonnees carte (inset Iberique + loupe sur le Mexique). */
export function mapProj(lon, lat) {
  const p = baseXY(lon, lat);
  if (lon > -16) return p;
  const dx = p[0] - FISH.fx, dy = p[1] - FISH.fy, d = Math.hypot(dx, dy);
  const f = 1 + FISH.m * Math.exp(-Math.pow(d / FISH.R, 2));
  return [FISH.fx + dx * f, FISH.fy + dy * f];
}
function densify(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
}
const ROUND = { iberia: 1, cuba: 1, hispaniola: 1 };
function landPath(key) {
  if (ROUND[key]) return smooth(LAND[key].map((p) => mapProj(p[0], p[1])), true);
  const pts = densify(LAND[key], 1.2).map((p) => mapProj(p[0], p[1]));
  return 'M' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'Z';
}

export const MAP_REGIONS = [
  { id: 'madrid', n: 1, name: 'Madrid', lon: -3.7, lat: 40.42, icon: 'alcala', color: PAL.terracotta, label: 'bottom', r: 36 },
  { id: 'salamanca', n: 2, name: 'Salamanca', lon: -5.66, lat: 40.97, icon: 'catedral', color: PAL.turquesa, label: 'left', r: 34 },
  { id: 'sevilla', n: 3, name: 'Sevilla', lon: -5.98, lat: 37.39, icon: 'giralda', color: PAL.magenta, label: 'left', r: 34 },
  { id: 'cdmx', n: 4, name: 'Ciudad de México', lon: -99.13, lat: 19.43, icon: 'angel', color: PAL.sol2, label: 'left', r: 33 },
  { id: 'oaxaca', n: '★', name: 'Oaxaca', lon: -96.73, lat: 17.06, icon: 'calavera', color: PAL.magenta2, label: 'bottom', r: 31, event: true },
  { id: 'valencia', n: 5, name: 'Valencia', lon: -0.38, lat: 39.47, icon: 'miguelete', color: PAL.quetzal, label: 'right', r: 34 },
  { id: 'baires', n: 7, name: 'Buenos Aires', lon: -58.38, lat: -34.6, icon: 'obelisco', color: PAL.turquesa2, label: 'right', r: 40 },
  { id: 'bogota', n: 8, name: 'Bogotá', lon: -74.07, lat: 4.71, icon: 'monserrate', color: PAL.terracotta2, label: 'right', r: 38 },
  { id: 'yucatan', n: 9, name: 'Yucatán', lon: -89.6, lat: 20.7, icon: 'piramide', color: PAL.quetzal2, label: 'top', r: 38 },
  { id: 'cusco', n: 10, name: 'Cusco', lon: -71.97, lat: -13.52, icon: 'machu', color: PAL.sol2, label: 'left', r: 40 },
];
/** Ordre du voyage (la Nochebuena de la u06 = Madrid, deja presente). */
export const MAP_ROUTE = ['madrid', 'salamanca', 'sevilla', 'cdmx', 'oaxaca', 'valencia', 'baires', 'bogota', 'yucatan', 'cusco'];
export function mapRegion(id) {
  const r = MAP_REGIONS.find((x) => x.id === id);
  if (!r) return null;
  const p = mapProj(r.lon, r.lat);
  return Object.assign({ x: r5(p[0]), y: r5(p[1]) }, r);
}
function r5(n) { return Math.round(n * 10) / 10; }
function segPath(a, b, k) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, h = len * 0.22 * k;
  return `M${a.x} ${a.y}Q${r1((a.x + b.x) / 2 + nx * h)} ${r1((a.y + b.y) / 2 + ny * h)} ${b.x} ${b.y}`;
}
// Brouillard de guerre : vrais nuages stylises, 3 couches (fond indigo, milieu lavande, devant creme), bords adoucis par un halo
// de traits translucides (pas de filtre -> leger sur tablette). Chaque nuage = <g class="m-cloud m-cl-<couche>"> (data-px/py = centre).
const CLOUD_TINT = {
  back: { halo: '#9AA0E0', shade: '#5E64B8', body: '#8F96DA', hi: '#B5BAF0', hiOp: 0.5 },
  mid: { halo: '#DAD9F6', shade: '#9EA2DE', body: '#CFD0F1', hi: '#EDEBFF', hiOp: 0.5 },
  dusk: { halo: '#FFB3C4', shade: '#C0508A', body: '#FFB89C', hi: '#FFE6C0', hiOp: 0.5 },
  front: { halo: '#FFF8EA', shade: '#B6B4E4', body: '#FFF6E4', hi: '#FFFFFF', hiOp: 0.6 },
};
/** Banc de nuages (brouillard) d'une region, a inserer dans la carte : `<g class="m-fog m-fog-ID">`. Pour les mises en scene ou la region n'est pas verrouillee dans worldMap(). */
export function mapFogHtml(id) {
  const r = mapRegion(id);
  return `<g class="m-fog m-fog-${id}" data-id="${id}">${fogClouds(r.x, r.y, 77, r.lon > -16 ? 0.4 : 0.66)}</g>`;
}
/** Un nuage centre en (cx,cy), largeur w, hauteur h : bosses sur le dessus, base plate arrondie. Renvoie le SVG (halo + ombre + corps + reflets). */
export function cloudSvg(cx, cy, w, h, seed, layer) {
  const T = CLOUD_TINT[layer] || CLOUD_TINT.front, rnd = rng(seed), n = clamp(Math.round(w / (h * 1.05)), 4, 11), bots = cy + h / 2;
  const bumps = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), r = h * (0.3 + 0.24 * Math.sin(Math.PI * u) + rnd() * 0.07);
    bumps.push({ x: cx - w * 0.4 + w * 0.8 * u, r, y: bots - r - h * 0.02 });
  }
  const base = { x: cx - w * 0.44, y: bots - h * 0.3, w: w * 0.88, h: h * 0.3, rx: h * 0.15 };
  const shape = (dx, dy, grow) => bumps.map((b) => `<circle cx="${r1(b.x + dx)}" cy="${r1(b.y + dy)}" r="${r1(b.r + grow)}"/>`).join('') + `<rect x="${r1(base.x + dx - grow)}" y="${r1(base.y + dy - grow)}" width="${r1(base.w + grow * 2)}" height="${r1(base.h + grow * 2)}" rx="${r1(base.rx + grow)}"/>`;
  const rim = (sw, op) => `<g fill="none" stroke="${T.halo}" stroke-width="${sw}" stroke-opacity="${op}" stroke-linejoin="round">${shape(0, 0, 0)}</g>`;
  const tops = bumps.slice(1, -1).map((b) => `<ellipse cx="${r1(b.x - b.r * 0.28)}" cy="${r1(b.y - b.r * 0.42)}" rx="${r1(b.r * 0.42)}" ry="${r1(b.r * 0.24)}" transform="rotate(-24 ${r1(b.x - b.r * 0.28)} ${r1(b.y - b.r * 0.42)})"/>`).join('');
  return `<g class="m-cloud m-cl-${layer}" data-px="${r1(cx)}" data-py="${r1(cy)}">${rim(h * 0.34, 0.16)}${rim(h * 0.17, 0.3)}<g fill="${T.shade}">${shape(h * 0.05, h * 0.075, 0)}</g><g fill="${T.body}">${shape(0, 0, 0)}</g><g fill="${T.hi}" opacity="${T.hiOp}">${tops}</g></g>`;
}
// disposition d'un banc de nuages autour d'une region : [dx, dy, largeur, hauteur, couche]
const FOG_LAYOUT = [
  [-4, -6, 250, 128, 'back'], [-92, 30, 190, 100, 'back'], [96, 24, 200, 104, 'back'],
  [-70, -40, 186, 98, 'mid'], [78, -34, 196, 102, 'mid'], [4, 46, 214, 104, 'mid'],
  [-96, 6, 168, 88, 'front'], [100, -2, 176, 92, 'front'], [-10, -64, 160, 84, 'front'], [14, 20, 150, 80, 'front'],
];
function fogClouds(x, y, seed, k) {
  const rnd = rng(seed);
  return FOG_LAYOUT.map((c, i) => cloudSvg(x + (c[0] + (rnd() - 0.5) * 14) * k, y + (c[1] + (rnd() - 0.5) * 10) * k, c[2] * k, c[3] * k, seed * 13 + i * 7, c[4])).join('');
}

/**
 * Carte du monde. opts : uid, states {id: 'locked'|'open'|'current'|'done'} (defaut : madrid current, reste locked),
 * player (id de la region du jeton), initial (lettre du jeton), route (bool, defaut true), width/height (defaut 1600x1200).
 */
export function worldMap(opts) {
  opts = opts || {};
  const id = opts.uid || uid('wm'), g = (n) => `${id}-${n}`;
  const states = opts.states || { madrid: 'current' };
  const regs = MAP_REGIONS.map((r) => mapRegion(r.id));
  const st = (r) => states[r.id] || 'locked';
  const lands = ['usa', 'francia', 'iberia', 'mainland', 'brasil', 'guayanas', 'baja', 'cuba', 'hispaniola'].map((k) => ({ k, d: landPath(k) }));
  const hispanic = new Set(['iberia', 'mainland', 'baja', 'cuba', 'hispaniola']);
  const allLand = lands.map((l) => `<path d="${l.d}"/>`).join('');
  // eau : halos concentriques autour des cotes (aplats peints), vagues
  const halo = [[46, 0.16], [30, 0.2], [16, 0.26], [6, 0.34]].map((h) => `<g stroke="#9FE6E0" stroke-width="${h[0]}" opacity="${h[1]}" stroke-linejoin="round" fill="none">${allLand}</g>`).join('');
  const landFill = lands.map((l) => `<path d="${l.d}" fill="${hispanic.has(l.k) ? `url(#${g('sand')})` : l.k === 'africa' ? `url(#${g('sand3')})` : `url(#${g('sand2')})`}"/>`).join('');
  const landEdge = `<g fill="none" stroke="#9C4A2C" stroke-width="3.2" stroke-linejoin="round" opacity=".9">${allLand}</g>`;
  const hatch = `<g fill="url(#${g('hatch')})" opacity=".5">${allLand}</g>`;
  const segs = [];
  for (let i = 0; i < MAP_ROUTE.length - 1; i++) {
    const a = mapRegion(MAP_ROUTE[i]), b = mapRegion(MAP_ROUTE[i + 1]);
    const d = segPath(a, b, i % 2 ? -1 : 1), lit = st(a) !== 'locked' && st(b) !== 'locked';
    segs.push(`<g class="m-seg" data-from="${a.id}" data-to="${b.id}"><path class="m-seg-path" d="${d}" fill="none" stroke="none"/>
<path class="m-seg-dots" d="${d}" fill="none" stroke="#FFF3D1" stroke-width="7" stroke-dasharray="0.1 17" stroke-linecap="round" opacity="${lit ? 0.9 : 0.28}"/></g>`);
  }
  const route = opts.route === false ? '' : `<g class="m-route">${segs.join('')}</g>`;
  const plaques = [];
  const meds = regs.map((r) => {
    const s = st(r), locked = s === 'locked', R = r.r;
    const ring = locked ? '#7E83B8' : PAL.sol, disc = locked ? '#4F548C' : r.color, ink = locked ? '#B9BDE6' : '#1B1030', acc = locked ? '#6E74B0' : '#FFF3D1';
    const nameW = Math.max(96, r.name.length * 13.5 + 30);
    const px = r.label === 'left' ? -(R + nameW / 2 + 6) : r.label === 'right' ? R + nameW / 2 + 6 : 0;
    const py = r.label === 'top' ? -(R + 28) : r.label === 'bottom' ? R + 34 : 4;
    const plaque = `<g class="m-plaque" transform="translate(${r1(px)} ${r1(py)})"><rect x="${-nameW / 2}" y="-19" width="${nameW}" height="38" rx="12" fill="${PAL.nuit}" stroke="${locked ? '#7E83B8' : PAL.sol}" stroke-width="3"/><rect x="${-nameW / 2 + 4}" y="-15" width="${nameW - 8}" height="30" rx="9" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/><text x="0" y="8" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="21" fill="${locked ? '#B9BDE6' : PAL.papel}" letter-spacing=".3">${esc(r.name)}</text></g>`;
    const badge = `<g transform="translate(${r1(R * 0.74)} ${r1(-R * 0.74)})"><circle r="15" fill="${r.event ? PAL.magenta : PAL.nuit}" stroke="${ring}" stroke-width="3"/>${r.event ? '<path d="' + starPath(0, 0, 10, 4.4, 5, 0) + '" fill="#fff"/>' : `<text y="6" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="16" fill="${PAL.papel}">${r.n}</text>`}</g>`;
    const check = s === 'done' ? `<g transform="translate(${r1(-R * 0.74)} ${r1(-R * 0.74)})"><circle r="15" fill="${PAL.quetzal}" stroke="${PAL.sol}" stroke-width="3"/><path d="M-7 1l5 5 9-11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : '';
    const lock = locked ? `<g transform="translate(${r1(-R * 0.74)} ${r1(-R * 0.74)})"><circle r="15" fill="#2B2F66" stroke="${ring}" stroke-width="3"/><path d="M-6 -1h12v10h-12z M-4 -1v-4a4 4 0 0 1 8 0v4" fill="#B9BDE6" stroke="#B9BDE6" stroke-width="2"/></g>` : '';
    plaques.push(`<g class="m-plq m-plq-${r.id}" transform="translate(${r.x} ${r.y})">${plaque}</g>`);
    return `<g class="m-med m-med-${r.id} m-${s}" data-id="${r.id}" data-x="${r.x}" data-y="${r.y}" transform="translate(${r.x} ${r.y})">
<ellipse cx="0" cy="${R + 10}" rx="${R * 0.9}" ry="8" fill="#000" opacity=".28"/>
${s === 'current' ? `<circle class="m-pulse" r="${R + 14}" fill="none" stroke="${PAL.sol}" stroke-width="5" opacity=".9"/>` : ''}
<g class="m-med-body"><circle r="${R + 8}" fill="${ring}" stroke="#6B2E12" stroke-width="3"/><circle r="${R + 2}" fill="url(#${g('tile')})"/>
<circle r="${R - 7}" fill="${disc}" stroke="#1B1030" stroke-width="2.5"/><circle r="${R - 7}" fill="url(#${g('shine')})"/>
<g transform="translate(${-R * 0.62} ${-R * 0.64}) scale(${r1((R * 1.24) / 100)})">${monument(r.icon, ink, acc)}</g>
${badge}${check}${lock}</g><circle class="m-hit" r="${R + 22}" fill="transparent"/></g>`;
  }).join('');
  const fog = regs.filter((r) => st(r) === 'locked').map((r, i) => `<g class="m-fog m-fog-${r.id}" data-id="${r.id}">${fogClouds(r.x, r.y, 31 + i * 7, r.lon > -16 ? 0.4 : 0.66)}</g>`).join('');
  const pr = mapRegion(opts.player || MAP_ROUTE.find((k) => states[k] === 'current') || 'madrid');
  const token = `<g class="m-token" transform="translate(${pr.x} ${pr.y - 6})"><g class="m-token-j"><ellipse cx="0" cy="2" rx="16" ry="6" fill="#000" opacity=".3"/>
<path d="M0 0C-26 -26 -30 -44 -30 -52A30 30 0 1 1 30 -52C30 -44 26 -26 0 0Z" fill="${PAL.terracotta}" stroke="#4A1A0C" stroke-width="3.5"/><circle cx="0" cy="-52" r="21" fill="${PAL.papel}" stroke="${PAL.sol}" stroke-width="4"/>
<text x="0" y="-43" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="26" fill="${PAL.nuit}">${esc(opts.initial || 'A')}</text></g></g>`;
  const guinea = mapProj(10, 1.7);
  const gx = 1500, gy = 700;
  void guinea;
  const compass = `<g class="m-compass" transform="translate(1470 1010)" opacity=".9"><circle r="78" fill="none" stroke="${PAL.papel}" stroke-width="3" opacity=".5"/><circle r="64" fill="none" stroke="${PAL.papel}" stroke-width="1.5" stroke-dasharray="3 7" opacity=".6"/><path d="M0 -92L14 -14L0 0L-14 -14Z" fill="${PAL.sol}"/><path d="M0 92L14 14L0 0L-14 14Z" fill="${PAL.papel}" opacity=".7"/><path d="M-92 0L-14 -14L0 0L-14 14Z M92 0L14 -14L0 0L14 14Z" fill="${PAL.papel}" opacity=".5"/><text y="-102" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="22" fill="${PAL.papel}">N</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}" width="${opts.width || MAP_W}" height="${opts.height || MAP_H}" class="m-svg" style="overflow:visible" role="img" aria-label="Mapa del mundo hispano">
<defs>
<linearGradient id="${g('sea')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A4A66"/><stop offset=".5" stop-color="#0E6985"/><stop offset="1" stop-color="#0B4B73"/></linearGradient>
<radialGradient id="${g('vig')}" cx="800" cy="600" r="1250" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#050A24" stop-opacity=".55"/></radialGradient>
<linearGradient id="${g('sand')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4CE86"/><stop offset="1" stop-color="#E0A058"/></linearGradient>
<linearGradient id="${g('sand2')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9C39B"/><stop offset="1" stop-color="#BFA37A"/></linearGradient>
<linearGradient id="${g('sand3')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9C39B"/><stop offset="1" stop-color="#D9C39B" stop-opacity="0"/></linearGradient>
<radialGradient id="${g('shine')}" cx=".35" cy=".28" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
<pattern id="${g('hatch')}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="10" height="10" fill="none"/><path d="M0 0V10" stroke="#B4642E" stroke-width="2.4" opacity=".28"/></pattern>
<pattern id="${g('waves')}" width="90" height="46" patternUnits="userSpaceOnUse"><path d="M0 23q11 -12 22 0t22 0t22 0t22 0" fill="none" stroke="#BDF1EC" stroke-width="2.2" opacity=".14" stroke-linecap="round"/></pattern>
${azulejoPattern(g('tile'), { a: PAL.nuit2, b: PAL.turquesa, c: PAL.sol })}
</defs>
<rect x="-1400" y="-600" width="4400" height="2400" fill="url(#${g('sea')})"/>
<rect x="-1400" y="-600" width="4400" height="2400" fill="url(#${g('waves')})"/>
<g class="m-cam">
<g class="m-grat" stroke="#BDF1EC" stroke-width="1.5" opacity=".1" fill="none"><path d="M0 120H1600M0 360H1600M0 600H1600M0 840H1600M0 1080H1600M260 0V1200M620 0V1200M980 0V1200M1340 0V1200" stroke-dasharray="4 10"/></g>
<g class="m-sea-halo">${halo}</g>
<g class="m-land">${landFill}${hatch}${landEdge}</g>
${compass}
<g class="m-guinea" transform="translate(${gx} ${gy})"><circle r="26" fill="${PAL.turquesa}" stroke="${PAL.sol}" stroke-width="4" opacity=".0" class="m-guinea-dot"/><text y="48" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="19" fill="${PAL.papel}" opacity="0" class="m-guinea-lbl">Guinea Ecuatorial</text></g>
${route}
${meds}
${fog}
${plaques.join('')}
${token}
</g>
<rect x="-1400" y="-600" width="4400" height="2400" fill="url(#${g('vig')})" pointer-events="none"/>
</svg>`;
}

// --- animation de la carte ------------------------------------------------------------------------------------
function mEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function ma(root, sel) { return Array.from(mEl(root).querySelectorAll(sel)); }
/** Position de camera (transform de .m-cam) qui centre (x,y) carte au centre du viewBox, a l'echelle s. vw/vh : taille affichee de la vue (defaut carte). */
export function mapCam(x, y, s, vw, vh) { return { x: r1((vw || MAP_W) / 2 - x * s), y: r1((vh || MAP_H) / 2 - y * s), scale: s }; }
/** Tween de camera vers (x,y,s) ou une region (id). Pas d'attribut layout : transform seul. */
export function mapCamTo(tl, root, target, s, at, dur, ease, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  tl.to(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, svgOrigin: '0 0', duration: dur, ease: ease || 'power3.inOut' }, at);
}
/**
 * Comme mapCamTo, mais SANS svgOrigin dans le tween : fiable pour enchainer plusieurs mouvements de camera dans une timeline
 * (avec svgOrigin, GSAP recale x/y et la position finale derive). Prerequis : l'origine 0 0 a deja ete posee par mapCamSet().
 */
export function mapCamMove(tl, root, target, s, at, dur, ease, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  tl.to(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, duration: dur, ease: ease || 'power3.inOut' }, at);
}
export function mapCamSet(g, root, target, s, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  g.set(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, svgOrigin: '0 0' });
}
/** Le brouillard d'une region se dissipe : les nuages s'ecartent (devant d'abord, puis milieu, puis fond), gonflent, montent doucement et s'effacent ; la medaille s'allume. */
export function mapFogClear(tl, root, id, at, dur) {
  const d = dur || 1.8, r = mapRegion(id), order = { front: 0, mid: 0.22, back: 0.42 };
  ma(root, '.m-fog-' + id + ' .m-cloud').forEach((c, i) => {
    const px = +c.dataset.px - r.x, py = +c.dataset.py - r.y, l = Math.hypot(px, py) || 1;
    const layer = c.getAttribute('class').match(/m-cl-(\w+)/)[1], delay = (order[layer] || 0) + (i % 3) * 0.05;
    tl.to(c, { x: (px / l) * (120 + (i % 3) * 30) + (px >= 0 ? 40 : -40), y: (py / l) * 50 - 46 - (i % 2) * 14, scale: 1.3, rotation: (px >= 0 ? 1 : -1) * 4, opacity: 0, svgOrigin: c.dataset.px + ' ' + c.dataset.py, duration: d * 0.78, ease: 'power2.inOut' }, at + delay * d * 0.55);
  });
  const med = ma(root, '.m-med-' + id + ' .m-med-body');
  tl.fromTo(med, { scale: 0.9, svgOrigin: '0 0' }, { scale: 1, svgOrigin: '0 0', duration: 0.9, ease: 'elastic.out(1,0.5)' }, at + d * 0.5);
}
/** Brume lente des regions verrouillees : chaque nuage derive a son rythme (un aller-retour). */
export function mapFogDrift(tl, root, at, dur) {
  ma(root, '.m-cloud').forEach((c, i) => tl.to(c, { x: (i % 2 ? -1 : 1) * (7 + (i % 3) * 4), y: ((i % 3) - 1) * 3, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + (i % 4) * 0.1));
}
/** Pulsation de l'anneau "region courante" (finie). */
export function mapPulse(tl, root, at, n, period) {
  ma(root, '.m-pulse').forEach((p) => tl.fromTo(p, { scale: 1, opacity: 0.9, svgOrigin: '0 0' }, { scale: 1.28, opacity: 0, svgOrigin: '0 0', duration: period, ease: 'power1.out', repeat: n - 1 }, at));
}
/**
 * Voyage du jeton de `fromId` a `toId` (segments consecutifs de MAP_ROUTE) : le pointille se revele, le jeton suit le chemin
 * (MotionPathPlugin si fourni via `plugin`, sinon interpolation getPointAtLength), petit saut d'arrivee.
 */
export function mapTravel(tl, root, fromId, toId, at, dur, g) {
  const r = mEl(root), seg = r.querySelector(`.m-seg[data-from="${fromId}"][data-to="${toId}"]`);
  if (!seg) return;
  const path = seg.querySelector('.m-seg-path'), dots = seg.querySelector('.m-seg-dots'), len = path.getTotalLength();
  const token = r.querySelector('.m-token'), jar = r.querySelector('.m-token-j');
  const maskId = 'mk-' + fromId + '-' + toId;
  if (!r.querySelector('#' + maskId)) {
    const defs = r.querySelector('defs'), NS = 'http://www.w3.org/2000/svg';
    const mk = document.createElementNS(NS, 'mask'); mk.setAttribute('id', maskId); mk.setAttribute('maskUnits', 'userSpaceOnUse'); mk.setAttribute('x', 0); mk.setAttribute('y', 0); mk.setAttribute('width', MAP_W); mk.setAttribute('height', MAP_H);
    const mp = document.createElementNS(NS, 'path'); mp.setAttribute('d', path.getAttribute('d')); mp.setAttribute('fill', 'none'); mp.setAttribute('stroke', '#fff'); mp.setAttribute('stroke-width', 26); mp.setAttribute('stroke-linecap', 'round'); mp.setAttribute('class', 'm-seg-mask');
    mp.style.strokeDasharray = len; mp.style.strokeDashoffset = len;
    mk.appendChild(mp); defs.appendChild(mk);
    dots.setAttribute('mask', `url(#${maskId})`);
  }
  const mp = r.querySelector('#' + maskId + ' path'), a = mapRegion(fromId), prog = { p: 0 };
  g.set(dots, { opacity: 0.85 });
  tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut' }, at);
  tl.to(prog, { p: 1, duration: dur, ease: 'power1.inOut', onUpdate: () => { const pt = path.getPointAtLength(prog.p * len); g.set(token, { x: pt.x, y: pt.y - 6 }); } }, at);
  tl.to(jar, { y: -26, duration: dur * 0.5, ease: 'sine.out', yoyo: true, repeat: 1 }, at);
  tl.fromTo(jar, { scaleY: 0.82, scaleX: 1.12, svgOrigin: '0 0' }, { scaleY: 1, scaleX: 1, svgOrigin: '0 0', duration: 0.45, ease: 'elastic.out(1,0.4)' }, at + dur);
}

/**
 * Planisphere "explainer" (style documentaire) : terres neutres sombres, pays hispanophones en turquoise (opacite 0 au depart,
 * a reveler avec explainerReveal). Groupes : .x-hi-es (Espagne), .x-hi-mx (Mexique + Amerique centrale + Caraibes), .x-hi-sa
 * (Amerique du Sud), .x-gq (Guinee equatoriale, pastille). Meme viewBox que worldMap.
 */
export function explainerMap(opts) {
  opts = opts || {};
  const id = opts.uid || uid('xm'), g = (n) => id + '-' + n;
  const P = (k) => landPath(k);
  const neutral = ['usa', 'francia', 'mainland', 'baja', 'cuba', 'hispaniola', 'iberia'].map((k) => '<path d="' + P(k) + '"/>').join('');
  const over = ['brasil', 'guayanas'].map((k) => '<path d="' + P(k) + '"/>').join('');
  const hiMx = '<g clip-path="url(#' + g('cn') + ')"><path d="' + P('mainland') + '"/></g><path d="' + P('baja') + '"/><path d="' + P('cuba') + '"/><path d="' + P('hispaniola') + '"/>';
  const hiSa = '<g clip-path="url(#' + g('cs') + ')"><path d="' + P('mainland') + '"/></g>';
  const hiEs = '<path d="' + P('iberia') + '"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '" width="' + (opts.width || MAP_W) + '" height="' + (opts.height || MAP_H) + '" class="x-svg" style="overflow:visible" aria-hidden="true">'
    + '<defs><clipPath id="' + g('cn') + '"><rect x="-200" y="-200" width="2200" height="640"/></clipPath><clipPath id="' + g('cs') + '"><rect x="-200" y="440" width="2200" height="900"/></clipPath>'
    + '<pattern id="' + g('dots') + '" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="2" fill="#fff" opacity=".16"/></pattern></defs>'
    + '<rect x="-1400" y="-600" width="4400" height="2400" fill="#0D1038"/><rect x="-1400" y="-600" width="4400" height="2400" fill="url(#' + g('dots') + ')"/>'
    + '<g class="x-land" fill="#2A3079" stroke="#4A52B8" stroke-width="2.5" stroke-linejoin="round">' + neutral + '</g>'
    + '<g class="x-hi x-hi-es" fill="' + PAL.turquesa + '" opacity="0">' + hiEs + '</g>'
    + '<g class="x-hi x-hi-mx" fill="' + PAL.turquesa + '" opacity="0">' + hiMx + '</g>'
    + '<g class="x-hi x-hi-sa" fill="' + PAL.turquesa + '" opacity="0">' + hiSa + '</g>'
    + '<g class="x-over" fill="#2A3079" stroke="#4A52B8" stroke-width="2.5" stroke-linejoin="round">' + over + '</g>'
    + '<g class="x-edge" fill="none" stroke="#0D1038" stroke-width="2" stroke-linejoin="round" opacity=".7">' + ['mainland', 'iberia', 'baja', 'cuba', 'hispaniola'].map((k) => '<path d="' + P(k) + '"/>').join('') + '</g>'
    + '<g class="x-gq" transform="translate(1500 706)"><circle class="x-gq-ring" r="30" fill="none" stroke="' + PAL.sol + '" stroke-width="4" opacity="0"/><circle class="x-gq-dot" r="14" fill="' + PAL.turquesa + '" stroke="#fff" stroke-width="4" opacity="0"/></g>'
    + '</svg>';
}
/** Revele les pays hispanophones (Espagne, puis Mexique/Amerique centrale, puis Amerique du Sud, puis Guinee equatoriale). */
export function explainerReveal(tl, root, at, step) {
  const r = typeof root === 'string' ? document.querySelector(root) : root, s = step || 0.55;
  ['es', 'mx', 'sa'].forEach((k, i) => tl.fromTo(r.querySelectorAll('.x-hi-' + k), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' }, at + i * s));
  tl.fromTo(r.querySelectorAll('.x-gq-dot'), { opacity: 0, scale: 0.2, svgOrigin: '0 0' }, { opacity: 1, scale: 1, svgOrigin: '0 0', duration: 0.6, ease: 'back.out(3)' }, at + 3 * s);
  tl.fromTo(r.querySelectorAll('.x-gq-ring'), { opacity: 1, scale: 0.6, svgOrigin: '0 0' }, { opacity: 0, scale: 2.2, svgOrigin: '0 0', duration: 0.9, ease: 'power2.out' }, at + 3 * s);
}

// ---------------------------------------------------------------- decors de cinematiques : skyline de Madrid, Academia de Viajeros, plume, drapeaux, particules
// Tout est SVG pur (chaines), en calques separes pour la parallaxe : chaque calque a la meme taille (W x H) et se pose a (0,0).
// Aucune marque, aucun logo : silhouettes originales simplifiees de monuments publics.

function scEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function scRect(x, y, w, h, fill, extra) { return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" ${extra || ''}/>`; }
function scSvg(W, H, inner, cls) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="${cls || ''}" aria-hidden="true">${inner}</svg>`; }
/** Etoile a 4 branches (etincelle). */
export function sparklePath(cx, cy, R, r) {
  r = r == null ? R * 0.22 : r;
  return `M${r1(cx)} ${r1(cy - R)}L${r1(cx + r)} ${r1(cy - r)}L${r1(cx + R)} ${r1(cy)}L${r1(cx + r)} ${r1(cy + r)}L${r1(cx)} ${r1(cy + R)}L${r1(cx - r)} ${r1(cy + r)}L${r1(cx - R)} ${r1(cy)}L${r1(cx - r)} ${r1(cy - r)}Z`;
}

// ---------------------------------------------------------------- Madrid au coucher du soleil (3200 x 1200)
export const SKY = { W: 3200, H: 1200, horizon: 880 };
function windowsGrid(x, y, w, h, cols, rows, lit, seed, on, off) {
  const rnd = rng(seed), cw = w / cols, rh = h / rows; let s = '';
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const isOn = rnd() < lit;
    s += `<rect x="${r1(x + i * cw + cw * 0.26)}" y="${r1(y + j * rh + rh * 0.2)}" width="${r1(cw * 0.48)}" height="${r1(rh * 0.58)}" rx="${r1(cw * 0.12)}" fill="${isOn ? on : off}"/>`;
  }
  return s;
}
function palacioReal(x, base) { // facade classique : corps central, deux pavillons, balustrade, statues
  const gold = '#F6C36A', gold2 = '#D98A45', sh = '#8E3F4C', win = '#4B2A66', w = 760, h = 150;
  let s = `<g class="sk-palacio">`;
  s += scRect(x, base - h, w, h, gold);
  s += scRect(x, base - h, w, 16, gold2); // corniche
  s += scRect(x + w * 0.36, base - h - 40, w * 0.28, 40, gold);
  s += `<path d="M${x + w * 0.34} ${base - h - 40}L${x + w * 0.5} ${base - h - 86}L${x + w * 0.66} ${base - h - 40}Z" fill="${gold2}"/>`;
  s += scRect(x - 14, base - h - 62, 130, h + 62, gold) + scRect(x + w - 116, base - h - 62, 130, h + 62, gold);
  s += `<path d="M${x - 20} ${base - h - 62}L${x + 50} ${base - h - 100}L${x + 122} ${base - h - 62}Z" fill="${sh}"/><path d="M${x + w - 122} ${base - h - 62}L${x + w - 50} ${base - h - 100}L${x + w + 20} ${base - h - 62}Z" fill="${sh}"/>`;
  s += scRect(x + 116, base - h - 18, w - 232, 18, gold2, 'opacity=".55"');
  for (let i = 0; i < 26; i++) s += `<rect x="${r1(x + 124 + i * 20.6)}" y="${base - h - 30}" width="6" height="12" fill="${gold2}"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${r1(x + 150 + i * 62)} ${base - h - 34}l6 -20 6 20Z" fill="${gold}"/>`;
  s += windowsGrid(x + 24, base - h + 24, 82, h - 40, 3, 3, 0.5, 5, '#FFE9A8', win) + windowsGrid(x + w - 108, base - h + 24, 82, h - 40, 3, 3, 0.5, 6, '#FFE9A8', win);
  s += windowsGrid(x + 130, base - h + 28, w - 260, h - 44, 12, 2, 0.35, 9, '#FFE9A8', win);
  s += `<rect x="${x - 30}" y="${base - 14}" width="${w + 60}" height="14" fill="${gold2}"/>`;
  return s + '</g>';
}
function plazaMayor(x, base) { // facade rouge a arcades + tour a fleches d'ardoise (type Casa de la Panaderia)
  const red = '#E07A4C', red2 = '#B4503A', sl = '#5A2B66', win = '#4B2A66', w = 640, h = 250;
  let s = `<g class="sk-plaza">`;
  s += scRect(x, base - h, w, h, red);
  s += scRect(x, base - 36, w, 36, red2);
  for (let i = 0; i < 11; i++) s += `<path d="M${r1(x + 12 + i * 57)} ${base}v-26a14 14 0 0 1 28 0v26Z" fill="${win}"/>`;
  for (let r = 0; r < 4; r++) for (let i = 0; i < 14; i++) {
    const on = ((i * 7 + r * 3) % 5) < 2;
    s += `<rect x="${r1(x + 18 + i * 44)}" y="${base - h + 26 + r * 46}" width="18" height="28" rx="3" fill="${on ? '#FFE9A8' : win}"/>`;
  }
  const tower = (tx) => scRect(tx, base - h - 150, 84, 150, red) + `<path d="M${tx - 8} ${base - h - 150}L${tx + 42} ${base - h - 250}L${tx + 92} ${base - h - 150}Z" fill="${sl}"/><path d="M${tx + 42} ${base - h - 250}v-26" stroke="${sl}" stroke-width="5"/>`
    + `<rect x="${tx + 28}" y="${base - h - 124}" width="28" height="38" rx="14" fill="#FFE9A8"/>` + windowsGrid(tx + 8, base - h - 70, 68, 60, 2, 2, 0.5, 11, '#FFE9A8', win);
  s += tower(x + 70) + tower(x + w - 154);
  s += `<path d="M${x - 10} ${base - h}L${x + w / 2} ${base - h - 70}L${x + w + 10} ${base - h}Z" fill="${sl}"/>`;
  return s + '</g>';
}
function metropolis(x, base) { // tour a gradins + coupole + victoire doree
  const gold = '#F6C36A', gold2 = '#D98A45', win = '#4B2A66';
  let s = `<g class="sk-metro">` + scRect(x, base - 300, 170, 300, gold) + scRect(x - 20, base - 230, 210, 230, gold2) + scRect(x + 18, base - 380, 134, 82, gold);
  s += `<path d="M${x + 30} ${base - 380}Q${x + 85} ${base - 520} ${x + 140} ${base - 380}Z" fill="#6B3C7A"/>`;
  s += `<circle cx="${x + 85}" cy="${base - 462}" r="12" fill="#FFE9A8"/><path d="M${x + 85} ${base - 450}l-26 -22q10 -14 26 -4q16 -10 26 4Z" fill="#FFE9A8"/><path d="M${x + 85} ${base - 448}v-28" stroke="#FFE9A8" stroke-width="5"/>`;
  s += windowsGrid(x + 10, base - 280, 150, 250, 4, 7, 0.4, 3, '#FFE9A8', win);
  return s + '</g>';
}
function almudena(x, base) { // coupole + tambour (lointain)
  let s = `<g>` + scRect(x, base - 200, 360, 200, 'currentColor');
  s += scRect(x + 120, base - 300, 120, 100, 'currentColor') + `<path d="M${x + 112} ${base - 300}Q${x + 180} ${base - 430} ${x + 248} ${base - 300}Z" fill="currentColor"/><path d="M${x + 180} ${base - 400}v-50M${x + 160} ${base - 428}h40" stroke="currentColor" stroke-width="6"/>`;
  s += scRect(x - 20, base - 140, 60, 140, 'currentColor') + scRect(x + 320, base - 140, 60, 140, 'currentColor') + `<path d="M${x - 24} ${base - 140}l50 -60 50 60Z" fill="currentColor"/><path d="M${x + 316} ${base - 140}l50 -60 50 60Z" fill="currentColor"/></g>`;
  return s;
}
/** Retourne { sky, sun, far, mid, near, W, H } : 5 SVG de 3200x1200, a empiler (parallaxe : far 0.25, mid 0.6, near 1). */
export function madridSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('sk'), g = (n) => `${id}-${n}`, W = SKY.W, H = SKY.H, hz = SKY.horizon, rnd = rng(opts.seed || 11);
  // ciel
  let stars = ''; for (let i = 0; i < 70; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(rnd() * 420)}" r="${r1(1 + rnd() * 2.2)}" fill="#FFF3D1" opacity="${r1(0.25 + rnd() * 0.5)}"/>`;
  let streaks = ''; [[260, 360, 520, 70], [900, 250, 620, 60], [1500, 470, 700, 70], [2300, 320, 640, 66], [2860, 520, 500, 56], [600, 610, 560, 60], [1950, 640, 600, 62]].forEach((c, i) => { streaks += cloudSvg(c[0], c[1], c[2], c[3], 40 + i * 5, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171A55"/><stop offset=".22" stop-color="#3A2F8E"/><stop offset=".42" stop-color="#8F2F7E"/><stop offset=".58" stop-color="#E0476F"/><stop offset=".72" stop-color="#FF8A47"/><stop offset=".83" stop-color="#FFC24A"/><stop offset="1" stop-color="#FFE29A"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${stars}${streaks}`, 'sk-sky');
  // soleil + rayons (tournent lentement)
  const sx = opts.sunX || 1440, sy = opts.sunY || hz - 330;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 42; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('halo')}"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".9"/><stop offset=".35" stop-color="#FFC24A" stop-opacity=".45"/><stop offset="1" stop-color="#FF8A47" stop-opacity="0"/></radialGradient><linearGradient id="${g('disc')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A8"/><stop offset="1" stop-color="#FFB13B"/></linearGradient><clipPath id="${g('cut')}"><rect x="0" y="0" width="${W}" height="${hz + 8}"/></clipPath></defs>
<g clip-path="url(#${g('cut')})"><g class="sk-rays" fill="#FFE9A8" opacity=".09" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="560" fill="url(#${g('halo')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="215" fill="url(#${g('disc')})"/><path d="M${sx - 215} ${sy + 40}h430M${sx - 205} ${sy + 80}h410M${sx - 180} ${sy + 120}h360" stroke="#FF9A3D" stroke-width="9" opacity=".5"/></g>`, 'sk-sun');
  // loin : sierra + silhouettes brumeuses + Almudena
  const far0 = '#7A2F7E';
  let sierra = `M0 ${hz}`; for (let x = 0; x <= W; x += 80) sierra += `L${x} ${r1(hz - 120 - 90 * Math.sin(x / 310) - 55 * Math.sin(x / 117 + 1) - 30 * Math.sin(x / 61))}`; sierra += `L${W} ${hz}Z`;
  let blocks = ''; for (let x = -20; x < W; x += 56) { const h = 40 + rnd() * 140; blocks += scRect(x, hz - h, 50, h + 4, far0); if (rnd() < 0.18) blocks += scRect(x + 18, hz - h - 40, 14, 44, far0); }
  const far = scSvg(W, H, `<g opacity=".62"><path d="${sierra}" fill="#B9418A"/></g><g fill="${far0}" opacity=".78">${blocks}</g><g color="${far0}" style="color:${far0}" opacity=".85" transform="translate(300 ${hz - 4})">${almudena(0, 0).replace(/currentColor/g, far0)}</g>${scRect(0, hz - 2, W, H - hz + 2, far0)}`, 'sk-far');
  // milieu : les 3 monuments dores
  const mid = scSvg(W, H, `<defs><linearGradient id="${g('gl')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE9A8" stop-opacity="0"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".35"/></linearGradient></defs>
${scRect(0, hz - 36, W, H - hz + 36, '#3B2373')}<g transform="translate(0 ${hz - 22}) scale(1.4) translate(0 ${-(hz - 22)})">${palacioReal(60, hz - 22)}${metropolis(900, hz - 22)}${plazaMayor(1200, hz - 22)}</g>${scRect(0, hz - 22, W, 22, '#4B2A7A')}`, 'sk-mid');
  // pres : toits, cheminees, antennes, Puerta de Alcala, lampadaires, arbres
  let roofs = ''; let x = -40;
  while (x < W) { const w = 150 + rnd() * 160, h = 120 + rnd() * 150, top = hz + 60 - h * 0.15 + (rnd() - 0.5) * 20; roofs += `<path d="M${r1(x)} ${H}V${r1(top + 40)}L${r1(x + 12)} ${r1(top)}H${r1(x + w - 12)}L${r1(x + w)} ${r1(top + 40)}V${H}Z" fill="#150F3A"/>`; roofs += windowsGrid(x + 14, top + 56, w - 28, 140, Math.max(2, Math.round(w / 52)), 3, 0.34, Math.round(x), '#FFC24A', '#241B58'); if (rnd() < 0.6) roofs += scRect(x + w * (0.2 + rnd() * 0.5), top - 40, 22, 44, '#150F3A'); if (rnd() < 0.3) { const ax = x + w * 0.7; roofs += `<path d="M${r1(ax)} ${r1(top)}v-60M${r1(ax - 20)} ${r1(top - 44)}h40M${r1(ax - 14)} ${r1(top - 30)}h28" stroke="#150F3A" stroke-width="4"/>`; } x += w + 4 + rnd() * 10; }
  const gold = '#F6C36A', gold2 = '#D98A45';
  const alcala = `<g class="sk-alcala" transform="translate(2640 ${hz + 70}) scale(1.75)"><defs><linearGradient id="${g('ag')}" x1="0" y1="-330" x2="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8F2F7E"/><stop offset=".45" stop-color="#E0476F"/><stop offset=".75" stop-color="#FF8A47"/><stop offset="1" stop-color="#FFC24A"/></linearGradient><clipPath id="${g('ac')}"><path d="M-55 0V-120A55 55 0 0 1 55 -120V0Z"/></clipPath></defs><path fill="url(#${g('ag')})" d="M-55 0V-120A55 55 0 0 1 55 -120V0ZM-175 0V-130H-125V0ZM125 0V-130H175V0ZM-245 0V-100H-205V0ZM205 0V-100H245V0Z"/><g clip-path="url(#${g('ac')})"><circle cx="0" cy="-58" r="46" fill="#FFE29A"/><circle cx="0" cy="-58" r="82" fill="#FFC24A" opacity=".35"/></g><path fill-rule="evenodd" fill="${gold}" d="M-260 0V-250H-100V-330L0 -400L100 -330V-250H260V0ZM-55 0V-120A55 55 0 0 1 55 -120V0ZM-175 0V-130H-125V0ZM125 0V-130H175V0ZM-245 0V-100H-205V0ZM205 0V-100H245V0Z"/>
<path d="M-260 -250H260V-232H-260ZM-100 -330H100V-312H-100ZM-270 -20H270V0H-270Z" fill="${gold2}"/><path d="M-70 -330L0 -384L70 -330Z" fill="${gold2}" opacity=".7"/><path d="M-260 0V-250H-215V0ZM-110 0V-250H-100V0ZM100 0V-250H110V0Z" fill="${gold2}" opacity=".45"/>
${[-230, -180, -130, 130, 180, 230].map((x) => `<rect x="${x - 6}" y="-284" width="12" height="34" fill="${gold}"/><circle cx="${x}" cy="-290" r="7" fill="${gold2}"/>`).join('')}
${[-60, -20, 20, 60].map((x) => `<rect x="${x - 5}" y="-250" width="10" height="30" fill="${gold2}" opacity=".7"/>`).join('')}<rect x="-14" y="-300" width="28" height="30" rx="14" fill="#3B2373"/></g>`;
  let lamps = ''; [180, 760, 1260, 2060, 2780].forEach((lx) => { lamps += `<path d="M${lx} ${H}V${hz + 150}" stroke="#0B0820" stroke-width="9"/><path d="M${lx - 22} ${hz + 150}h44l-10 -34h-24Z" fill="#0B0820"/><path d="M${lx - 12} ${hz + 146}h24l-6 -24h-12Z" fill="#FFD76A"/><circle cx="${lx}" cy="${hz + 132}" r="70" fill="url(#${g('lg')})"/>`; });
  const near = scSvg(W, H, `<defs><radialGradient id="${g('lg')}"><stop offset="0" stop-color="#FFD76A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD76A" stop-opacity="0"/></radialGradient></defs>${alcala}${roofs}${lamps}${scRect(0, H - 90, W, 90, '#0B0820')}`, 'sk-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy };
}

// ---------------------------------------------------------------- Academia de Viajeros (2400 x 1200)
export const ROOM = { W: 2400, H: 1200, floor: 930, deskTop: 790 };
function books(x, y, w, h, seed) { // une etagere de livres colores
  const rnd = rng(seed), cols = [PAL.terracotta, PAL.turquesa, PAL.magenta, PAL.sol, PAL.quetzal, '#5B63D6', PAL.papel, PAL.terracotta2, PAL.turquesa2];
  let s = '', cx = x + 6;
  while (cx < x + w - 14) {
    const bw = 16 + rnd() * 20, bh = h * (0.62 + rnd() * 0.36), c = cols[Math.floor(rnd() * cols.length)];
    const lean = rnd() < 0.08;
    s += `<g ${lean ? `transform="rotate(${r1(8 + rnd() * 6)} ${r1(cx + bw)} ${y + h})"` : ''}>${scRect(cx, y + h - bh, bw, bh, c)}${scRect(cx, y + h - bh, bw, 5, shade(c, 0.25))}${scRect(cx + bw * 0.2, y + h - bh * 0.7, bw * 0.6, 5, shade(c, -0.3))}${scRect(cx + bw * 0.2, y + h - bh * 0.4, bw * 0.6, 3, shade(c, 0.35))}</g>`;
    cx += bw + 1.5;
  }
  return s;
}
function bookcase(x, y, w, h, seed) {
  const wood = '#4A2A1C', wood2 = '#6B3E26', rows = 5, rh = (h - 40) / rows;
  let s = scRect(x, y, w, h, wood) + scRect(x + 14, y + 28, w - 28, h - 28, '#2A160E');
  for (let r = 0; r < rows; r++) s += books(x + 14, y + 28 + r * rh, w - 28, rh - 10, seed + r * 3) + scRect(x + 10, y + 28 + (r + 1) * rh - 10, w - 20, 12, wood2);
  s += scRect(x - 14, y - 22, w + 28, 26, wood2) + scRect(x - 14, y - 22, w + 28, 7, shade(wood2, 0.3));
  return `<g class="ac-case">${s}</g>`;
}
function globe(cx, cy, R, c1, c2) {
  return `<g class="ac-globe"><path d="M${cx - R * 0.5} ${cy + R * 2.3}h${R}l-${R * 0.12} -${R * 1.15}h-${R * 0.76}Z" fill="#3B2216"/><path d="M${cx - R * 0.78} ${cy + R * 2.35}h${R * 1.56}v${R * 0.16}h-${R * 1.56}Z" fill="#3B2216"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="${c1}"/><path d="M${cx - R * 0.6} ${cy - R * 0.2}q${R * 0.4} -${R * 0.5} ${R * 0.7} -${R * 0.1}q${R * 0.2} ${R * 0.5} -${R * 0.1} ${R * 0.7}q-${R * 0.5} ${R * 0.1} -${R * 0.6} -${R * 0.6}ZM${cx + R * 0.2} ${cy + R * 0.3}q${R * 0.3} -${R * 0.1} ${R * 0.45} ${R * 0.2}q-${R * 0.1} ${R * 0.4} -${R * 0.4} ${R * 0.3}Z" fill="${c2}"/><path d="M${cx - R} ${cy}a${R} ${R * 0.28} 0 0 0 ${R * 2} 0" fill="none" stroke="#FFE9A8" stroke-width="3" opacity=".7"/><path d="M${cx - R * 1.04} ${cy - R * 0.6}A${R * 1.2} ${R * 1.2} 0 0 0 ${cx + R * 0.6} ${cy + R * 1.04}" stroke="#E0A058" stroke-width="7" fill="none"/><ellipse cx="${cx - R * 0.35}" cy="${cy - R * 0.4}" rx="${R * 0.22}" ry="${R * 0.12}" fill="#fff" opacity=".35" transform="rotate(-35 ${cx - R * 0.35} ${cy - R * 0.4})"/></g>`;
}
function lantern(cx, top, len, c) {
  return `<g class="ac-lamp" data-px="${cx}" data-py="${top}"><path d="M${cx} ${top}V${top + len}" stroke="#2A160E" stroke-width="5"/><path d="M${cx - 34} ${top + len + 6}h68l-10 -22h-48Z" fill="#2A160E"/><path d="M${cx - 30} ${top + len + 6}q-6 50 30 74q36 -24 30 -74Z" fill="${c}"/><path d="M${cx - 18} ${top + len + 18}q-2 34 18 50q20 -16 18 -50Z" fill="#FFF3B0"/><circle cx="${cx}" cy="${top + len + 46}" r="130" fill="#FFD76A" opacity=".16" class="ac-lamp-glow"/></g>`;
}
function suitcase(x, y, w, h, c, stick) {
  return `<g class="ac-case-l"><path d="M${x + w * 0.38} ${y}v-18q0 -14 14 -14h${w * 0.24}q14 0 14 14v18" fill="none" stroke="#2A160E" stroke-width="9"/>${`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${c}"/>`}${scRect(x + 8, y + h * 0.36, w - 16, 8, shade(c, -0.35))}${scRect(x + 8, y + h * 0.7, w - 16, 8, shade(c, -0.35))}<rect x="${x + w * 0.44}" y="${y + h * 0.28}" width="${w * 0.12}" height="${h * 0.2}" rx="4" fill="#FFD76A"/>${scRect(x, y + h - 14, w, 14, shade(c, -0.3), 'rx="8"')}${stick ? `<circle cx="${x + w * 0.2}" cy="${y + h * 0.2}" r="${w * 0.07}" fill="${PAL.turquesa}"/><rect x="${x + w * 0.66}" y="${y + h * 0.1}" width="${w * 0.16}" height="${w * 0.12}" rx="3" fill="${PAL.sol}" transform="rotate(-8 ${x + w * 0.7} ${y + h * 0.15})"/><circle cx="${x + w * 0.8}" cy="${y + h * 0.62}" r="${w * 0.06}" fill="${PAL.magenta}"/>` : ''}</g>`;
}
/** Retourne { back, light, front, W, H } : decor (mur, fenetre, etageres, carte, bureau, tapis), faisceaux de lumiere (a melanger en "screen"), avant-plan. */
export function academiaRoom(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ac'), g = (n) => `${id}-${n}`, W = ROOM.W, H = ROOM.H, fl = ROOM.floor, rnd = rng(opts.seed || 5);
  const mapSvg = explainerMap({ uid: g('xm'), width: 520, height: 390 }).replace('<svg ', '<svg x="1535" y="250" ');
  let dots = ''; MAP_ROUTE.forEach((rid, i) => { const r = mapRegion(rid); dots += `<g class="ac-feather" data-i="${i}" transform="translate(${r1(1535 + (r.x / 1600) * 520)} ${r1(250 + (r.y / 1200) * 390)})"><circle r="16" fill="#FFD76A" opacity=".3"/><path d="${sparklePath(0, 0, 11, 3)}" fill="#FFF3B0"/></g>`; });
  // plancher
  let planks = ''; for (let i = 0; i < 9; i++) { const y = fl + Math.pow(i / 9, 1.4) * (H - fl); planks += `<path d="M0 ${r1(y)}H${W}" stroke="#2A1208" stroke-width="${r1(2 + i * 0.5)}" opacity=".5"/>`; }
  for (let i = 0; i < 40; i++) { const x = (i / 40) * W, y0 = fl; planks += `<path d="M${r1(x)} ${y0}L${r1(x + (x - W / 2) * 0.35)} ${H}" stroke="#2A1208" stroke-width="2" opacity=".28"/>`; }
  const back = scSvg(W, H, `<defs>
<linearGradient id="${g('wall')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4573C"/><stop offset=".55" stop-color="#D98A50"/><stop offset="1" stop-color="#C46B3E"/></linearGradient>
<linearGradient id="${g('floor')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4528"/><stop offset="1" stop-color="#3B1F12"/></linearGradient>
<linearGradient id="${g('glass')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B3AA0"/><stop offset=".45" stop-color="#F0709A"/><stop offset=".8" stop-color="#FFC24A"/><stop offset="1" stop-color="#FFE9A8"/></linearGradient>
<radialGradient id="${g('rugg')}" cx=".5" cy=".5" r=".5"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
<clipPath id="${g('mapc')}"><rect x="1535" y="250" width="520" height="390" rx="10"/></clipPath>
${azulejoPattern(g('tile'), { a: PAL.nuit2, b: PAL.turquesa, c: PAL.sol })}
${azulejoPattern(g('rug'), { a: '#8F1D4E', b: '#FFC83D', c: '#19B7AA', d: '#F5E6C8' })}
</defs>
${scRect(0, 0, W, fl + 10, `url(#${g('wall')})`)}
${(() => { let p = ''; for (let i = 0; i < 24; i++) p += scRect(i * 100 + 46, 70, 8, fl - 70, '#000', 'opacity=".06"'); return p; })()}
${scRect(0, 0, W, 70, '#6B3322')}${scRect(0, 62, W, 14, '#E0A058')}${scRect(0, 76, W, 5, '#000', 'opacity=".25"')}
<g class="ac-wainscot">${scRect(0, 760, W, fl - 760 + 10, `url(#${g('tile')})`)}${scRect(0, 752, W, 12, PAL.papel)}${scRect(0, 764, W, 6, '#000', 'opacity=".28"')}</g>
${scRect(0, fl, W, H - fl, `url(#${g('floor')})`)}${planks}${scRect(0, fl - 2, W, 8, '#2A1208', 'opacity=".6"')}
<g class="ac-window"><path d="M450 700V330a190 190 0 0 1 380 0V700Z" fill="#2A160E"/><path d="M468 690V330a172 172 0 0 1 344 0V690Z" fill="url(#${g('glass')})"/><circle cx="640" cy="560" r="86" fill="#FFF3B0" opacity=".9"/><path d="M468 600H812M640 158V690M468 430H812" stroke="#2A160E" stroke-width="12"/><path d="M468 330a172 172 0 0 1 344 0" fill="none" stroke="#2A160E" stroke-width="12"/>${scRect(430, 690, 420, 30, '#6B3E26')}${scRect(430, 690, 420, 8, '#E0A058')}</g>
${bookcase(40, 200, 330, 560, 21)}${bookcase(960, 230, 380, 530, 77)}
<g class="ac-mapframe"><rect x="1515" y="230" width="560" height="430" rx="18" fill="#3B2216"/><rect x="1523" y="238" width="544" height="414" rx="13" fill="#E0A058"/><g clip-path="url(#${g('mapc')})">${mapSvg}</g><rect x="1535" y="250" width="520" height="390" rx="10" fill="none" stroke="#FFC83D" stroke-width="3"/><g class="ac-feathers">${dots}</g></g>
${globe(1160, 860, 72, '#0E7F82', '#F4CE86')}
${globe(430, 880, 96, '#1D2160', '#F4CE86')}
<ellipse cx="1200" cy="1060" rx="640" ry="108" fill="url(#${g('rug')})"/><ellipse cx="1200" cy="1060" rx="640" ry="108" fill="url(#${g('rugg')})"/><ellipse cx="1200" cy="1060" rx="640" ry="108" fill="none" stroke="#FFC83D" stroke-width="6"/>
${lantern(1100, -10, 90, '#E0A058')}${lantern(1800, -10, 70, '#E0A058')}${lantern(300, -10, 110, '#E0A058')}
`, 'ac-back');
  // bureau (plan median, devant le mur) : Quetzal se pose sur le dessus
  const dx = 1560, dw = 740, dt = ROOM.deskTop;
  const desk = `<g class="ac-desk">${scRect(dx, dt, dw, 34, '#8A5230')}${scRect(dx, dt, dw, 8, '#C98A55')}${scRect(dx + 24, dt + 34, dw - 48, 180, '#5B3220')}${scRect(dx + 44, dt + 56, 300, 130, '#6B3E26', 'rx="8"')}${scRect(dx + 390, dt + 56, 300, 130, '#6B3E26', 'rx="8"')}<circle cx="${dx + 194}" cy="${dt + 121}" r="12" fill="#FFD76A"/><circle cx="${dx + 540}" cy="${dt + 121}" r="12" fill="#FFD76A"/>${scRect(dx + 24, dt + 214, 60, 16, '#2A160E')}${scRect(dx + dw - 84, dt + 214, 60, 16, '#2A160E')}
<path d="M${dx + 80} ${dt} h150 l10 -16 h-170Z" fill="${PAL.papel}"/><path d="M${dx + 150} ${dt - 6}l56 -64" stroke="#F5E6C8" stroke-width="5"/><path d="M${dx + 200} ${dt - 70}q40 -30 36 -66q-30 20 -36 66Z" fill="${PAL.quetzalClaro}"/>
<g class="ac-books">${scRect(dx + 430, dt - 24, 120, 24, PAL.terracotta)}${scRect(dx + 440, dt - 46, 106, 22, PAL.turquesa)}${scRect(dx + 450, dt - 66, 92, 20, PAL.sol)}</g>
<path d="M${dx + 600} ${dt}v-84h16v-10q0 -26 34 -30h70v14h-60q-20 2 -20 16v94Z" fill="#0E7F82"/><path d="M${dx + 660} ${dt - 118}h74a24 24 0 0 1 0 -4Z" fill="#0E7F82"/><ellipse cx="${dx + 700}" cy="${dt - 116}" rx="46" ry="14" fill="#19B7AA"/><ellipse cx="${dx + 700}" cy="${dt - 108}" rx="40" ry="8" fill="#FFF3B0" opacity=".9"/><circle cx="${dx + 700}" cy="${dt - 70}" r="90" fill="#FFD76A" opacity=".13"/>
<circle cx="${dx + 340}" cy="${dt - 12}" r="34" fill="#E0A058" stroke="#6B3C1A" stroke-width="4"/><path d="M${dx + 340} ${dt - 12}l14 -22" stroke="#6B3C1A" stroke-width="5" stroke-linecap="round"/><circle cx="${dx + 340}" cy="${dt - 12}" r="6" fill="#FFF3B0"/></g>`;
  const frontL = '';
  // avant-plan : valises, plante
  const bag = (sx, sy, k) => `<g transform="translate(${sx} ${sy}) scale(${k})">${suitcase(0, 0, 260, 160, PAL.terracotta, true)}${suitcase(24, -140, 210, 130, PAL.turquesa2, true)}${suitcase(60, -250, 150, 100, PAL.sol2, true)}</g>`;
  let leaves = ''; for (let i = 0; i < 9; i++) { const a = -80 + i * 20; leaves += `<path d="M0 0Q${r1(40 + i * 6)} -${r1(130 + (i % 3) * 40)} ${r1(Math.sin((a * Math.PI) / 180) * 260)} -${r1(330 - Math.abs(a) * 1.1 + (i % 2) * 40)}Q${r1(Math.sin((a * Math.PI) / 180) * 120 - 40)} -${r1(150 + (i % 3) * 20)} 0 0Z" fill="${i % 2 ? '#0E9F6E' : '#066A4A'}"/>`; }
  const front = scSvg(W, H, `<g transform="translate(120 1130)">${leaves}</g><path d="M60 1130h150l-24 100h-102Z" fill="#9E3D29"/><rect x="50" y="1122" width="170" height="26" rx="10" fill="#C9573B"/>${bag(2050, 1070, 1)}`, 'ac-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('beam')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".62"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>
<g class="ac-beams" fill="url(#${g('beam')})"><path d="M470 330L650 330L1220 1130L760 1130Z" opacity=".7"/><path d="M660 250L800 250L1500 1100L1130 1100Z" opacity=".45"/><path d="M510 520L560 520L860 1130L610 1130Z" opacity=".6"/></g>`, 'ac-light');
  return { back, desk: scSvg(W, H, desk, 'ac-desk-l'), light, front, W, H };
}

// ---------------------------------------------------------------- plume du Quetzal (120 x 360, pointe en bas)
export function featherSvg(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ft'), W = opts.width || 120, H = opts.height || 360, g = (n) => `${id}-${n}`;
  let barbs = ''; for (let i = 0; i < 16; i++) { const y = 40 + i * 17, w = 40 * Math.sin((Math.PI * (i + 1.5)) / 18) + 8; barbs += `<path d="M60 ${y}q${r1(-w * 0.6)} 6 ${r1(-w)} 26M60 ${y}q${r1(w * 0.6)} 6 ${r1(w)} 26" stroke="#066A4A" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 360" width="${W}" height="${H}" class="f-svg" aria-hidden="true"><defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#42E0A0"/><stop offset=".5" stop-color="#0E9F6E"/><stop offset="1" stop-color="#19B7AA"/></linearGradient><radialGradient id="${g('glow')}"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".9"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>
<ellipse class="f-glow" cx="60" cy="170" rx="100" ry="170" fill="url(#${g('glow')})"/>
<path d="M60 8C112 70 118 170 84 262Q70 312 60 352C50 312 36 262 16 190C-6 110 18 60 60 8Z" fill="url(#${g('b')})" stroke="#066A4A" stroke-width="3" stroke-linejoin="round"/>${barbs}<path d="M60 14Q64 190 60 356" stroke="#BFFFE3" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 90Q30 130 46 170" stroke="#fff" stroke-width="4" opacity=".4" fill="none" stroke-linecap="round"/></svg>`;
}

// ---------------------------------------------------------------- drapeaux simples (100 x 66) : es, mx, ar
export function flagSvg(code, opts) {
  opts = opts || {};
  const w = opts.width || 200, id = opts.uid || uid('fl');
  const body = { es: `<rect width="100" height="66" fill="#C8102E"/><rect y="16.5" width="100" height="33" fill="#FFC400"/><rect x="22" y="26" width="9" height="14" rx="2" fill="#B4503A"/>`,
    mx: `<rect width="100" height="66" fill="#fff"/><rect width="33.4" height="66" fill="#006847"/><rect x="66.6" width="33.4" height="66" fill="#CE1126"/><circle cx="50" cy="33" r="8.5" fill="#9C7A3C"/><path d="M42 37q8 8 16 0" stroke="#006847" stroke-width="2.4" fill="none"/>`,
    ar: `<rect width="100" height="66" fill="#fff"/><rect width="100" height="22" fill="#74ACDF"/><rect y="44" width="100" height="22" fill="#74ACDF"/><circle cx="50" cy="33" r="6.2" fill="#F6B40E"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M50 33l${r1(Math.cos(i * 0.785) * 10)} ${r1(Math.sin(i * 0.785) * 10)}" stroke="#F6B40E" stroke-width="1.6"/>`).join('')}` }[code] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 66" width="${w}" height="${r1(w * 0.66)}" class="fl-svg" aria-hidden="true"><defs><clipPath id="${id}"><rect width="100" height="66" rx="6"/></clipPath><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#${id})">${body}<rect width="100" height="66" fill="url(#${id}s)"/></g><rect width="100" height="66" rx="6" fill="none" stroke="#14173F" stroke-opacity=".5" stroke-width="2"/></svg>`;
}

// ---------------------------------------------------------------- particules : motes de poussiere, etincelles, confettis de papel picado
/** n points (cercles/etincelles) repartis dans w x h ; chaque <g class="k-mote" data-i> est anime par la composition (positions deterministes). */
export function moteField(opts) {
  opts = opts || {};
  const n = opts.n || 40, W = opts.w || 1920, H = opts.h || 1200, rnd = rng(opts.seed || 3), cols = opts.colors || ['#FFE9A8', '#FFD76A', '#FFF3D1'];
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rnd() * W, y = rnd() * H, r = (opts.rmin || 2) + rnd() * ((opts.rmax || 6) - (opts.rmin || 2)), c = cols[i % cols.length];
    s += `<g class="k-mote" data-i="${i}" data-x="${r1(x)}" data-y="${r1(y)}" data-r="${r1(r)}" transform="translate(${r1(x)} ${r1(y)})">${opts.stars && i % 3 === 0 ? `<path d="${sparklePath(0, 0, r * 2.4)}" fill="${c}"/>` : `<circle r="${r1(r)}" fill="${c}"/>`}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="k-svg" aria-hidden="true">${s}</svg>`;
}

// ---------------------------------------------------------------- personnages de l'histoire (chibis vectoriels) - viewBox 0 0 400 660
// Alex (le joueur), Marina, Don Ignacio : meme langage que le Quetzal (aplats + ombrages, pas de photo). Face avant, tete large.
// Parties animables (classes c-*) : c-rig (corps), c-head, c-armL / c-armR, c-legL / c-legR, c-eye, c-brow, c-m-c / c-m-o (bouche), c-tail (couette).
export const CHAR_PIVOT = { head: '200 288', armL: '142 306', armR: '258 306', legL: '168 440', legR: '232 440', tail: '236 104', rig: '200 640' };
export const CHARS = {
  alex: { name: 'Álex', skin: '#E3AE86', hair: '#3A2216', top: '#19B7AA', pants: '#2B318A', shoes: '#F5E6C8', accent: '#D93472', mouthY: 0 },
  marina: { name: 'Marina', skin: '#D79A74', hair: '#2A160E', top: '#D93472', pants: '#0E7F82', shoes: '#FFC83D', accent: '#FFC83D', mouthY: 0 },
  diego: { name: 'Diego', skin: '#C8895F', hair: '#2A1A12', top: '#2F6FD0', pants: '#3D4468', shoes: '#F5E6C8', accent: '#FFC83D', mouthY: 0 },
  pilar: { name: 'Doña Pilar', skin: '#E2B592', hair: '#8A7A74', top: '#B4503A', pants: '#2B318A', shoes: '#3B2216', accent: '#E0A058', mouthY: 0 },
  lola: { name: 'Lola', skin: '#D79A74', hair: '#1E120C', top: '#FFC83D', pants: '#F5E6C8', shoes: '#D93472', accent: '#D93472', mouthY: 0 },
  abuela_carmen: { name: 'Abuela Carmen', skin: '#D9A47C', hair: '#E8E4DE', top: '#19B7AA', pants: '#6B3E7A', shoes: '#3B2216', accent: '#E0A058', mouthY: 0 },
  rafa: { name: 'Tío Rafa', skin: '#C98A5E', hair: '#1E120C', top: '#2B318A', pants: '#3D4468', shoes: '#6B3E26', accent: '#D81E3A', mouthY: 14 },
  ignacio: { name: 'Don Ignacio', skin: '#D9A47C', hair: '#C9C5C0', top: '#E0A058', pants: '#2F5D50', shoes: '#6B3E26', accent: '#C9573B', mouthY: 14 },
};
function chTorso(k, c, g) {
  if (CHX[k]) return CHX[k].torso(c);
  const shade2 = shade(c.top, -0.22);
  const base = `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade2}" opacity=".5"/>`;
  if (k === 'alex') return base + `<path d="M162 286Q200 330 238 286L238 306Q200 346 162 306Z" fill="${shade(c.top, -0.18)}"/><path d="M200 330V452" stroke="${PAL.sol}" stroke-width="5" stroke-linecap="round"/><path d="M152 404h96q8 30 -4 44h-88q-12 -14 -4 -44Z" fill="${shade(c.top, -0.12)}"/><path d="M168 292Q200 306 232 292" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>`;
  if (k === 'marina') return `<path d="M138 292Q200 272 262 292L274 440Q200 464 126 440Z" fill="${PAL.sol}"/><path d="M138 292Q168 300 176 346L170 450Q150 448 126 440Z" fill="${c.top}"/><path d="M262 292Q232 300 224 346L230 450Q250 448 274 440Z" fill="${c.top}"/><path d="M262 292L274 440Q250 448 230 450L224 346Q232 300 262 292Z" fill="${shade2}" opacity=".45"/><path d="M178 288Q200 322 222 288" fill="${shade(PAL.sol, -0.2)}"/><path d="M186 344h28M190 356h20" stroke="${PAL.magenta2}" stroke-width="4" stroke-linecap="round"/>`;
  return `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="#F5E6C8"/><path d="M138 292Q176 304 184 350L176 456Q148 452 124 442Z" fill="${c.top}"/><path d="M262 292Q224 304 216 350L224 456Q252 452 276 442Z" fill="${c.top}"/><path d="M262 292L276 442Q252 452 224 456L216 350Q224 304 262 292Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M150 286Q200 322 250 286L250 314Q200 350 150 314Z" fill="${c.accent}"/><path d="M168 316L246 440" stroke="#6B3E26" stroke-width="12" stroke-linecap="round"/><circle cx="188" cy="372" r="5" fill="#8A5230"/><circle cx="188" cy="404" r="5" fill="#8A5230"/>`;
}
function chArm(k, c, side) {
  const m = (x) => (side === 'R' ? 400 - x : x), hand = c.skin;
  const cuff = k === 'ignacio' ? '#F5E6C8' : shade(c.top, -0.18);
  return `<g class="c-arm c-arm${side}"><path d="M${m(130)} 296Q${m(104)} 300 ${m(102)} 332L${m(98)} 418Q${m(98)} 440 ${m(118)} 440Q${m(138)} 440 ${m(138)} 418L${m(146)} 336Q${m(150)} 300 ${m(130)} 296Z" fill="${c.top}"/><path d="M${m(98)} 418Q${m(98)} 440 ${m(118)} 440Q${m(138)} 440 ${m(138)} 418L${m(139)} 404L${m(98)} 404Z" fill="${cuff}"/><path d="M${m(102)} 332L${m(98)} 418" stroke="${shade(c.top, -0.25)}" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/><circle cx="${m(118)}" cy="452" r="23" fill="${hand}"/><path d="M${m(104)} 462q${side === 'R' ? -10 : 10} 8 ${side === 'R' ? -24 : 24} 2" stroke="${shade(hand, -0.2)}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></g>`;
}
function chLeg(c, side) {
  const dark = shade(c.pants, -0.22), shoe = c.shoes, m = (x) => (side === 'R' ? 408 - x : x - 8);
  return `<g class="c-leg c-leg${side}"><path d="M${m(146)} 430H${m(206)}L${m(204)} 586H${m(150)}Z" fill="${c.pants}"/><path d="M${m(190)} 432H${m(206)}L${m(204)} 586H${m(188)}Z" fill="${dark}" opacity=".5"/><path d="M${m(142)} 586H${m(208)}V618Q${m(208)} 634 ${m(190)} 634H${m(128)}Q${m(122)} 634 ${m(124)} 624Q${m(128)} 598 ${m(142)} 586Z" fill="${shoe}"/><path d="M${m(124)} 624H${m(208)}V634H${m(128)}Q${m(122)} 634 ${m(124)} 624Z" fill="${shade(shoe, -0.35)}"/><path d="M${m(146)} 600Q${m(172)} 592 ${m(200)} 600" stroke="${c.accent}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/></g>`;
}
function chHairBack(k, c) {
  if (CHX[k]) return CHX[k].back ? CHX[k].back(c) : '';
  if (k === 'marina') return `<path d="M98 196Q84 84 200 78Q316 84 302 196Q320 290 292 346Q250 330 252 262L148 262Q150 330 108 346Q80 290 98 196Z" fill="${c.hair}"/>`;
  if (k === 'ignacio') return `<path d="M104 190Q96 224 112 250Q108 214 120 190Z M296 190Q304 224 288 250Q292 214 280 190Z" fill="${c.hair}"/>`;
  return '';
}
function chHairFront(k, c, g) {
  if (CHX[k]) return CHX[k].front(c);
  if (k === 'alex') return `<path d="M100 184Q92 84 200 80Q308 84 300 184Q296 144 268 134Q254 164 224 142Q200 176 176 142Q148 164 136 134Q106 146 100 184Z" fill="${c.hair}"/><path d="M186 88Q196 48 230 66Q212 76 216 94Z" fill="${c.hair}"/><path d="M130 112Q156 92 186 96" stroke="${shade(c.hair, 0.25)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`;
  if (k === 'marina') return `<g class="c-tail" data-px="236" data-py="104"><path d="M236 98Q330 62 348 144Q356 210 322 262Q304 208 292 156Q272 122 236 122Z" fill="${c.hair}"/><path d="M300 120Q336 140 330 196" stroke="${shade(c.hair, 0.3)}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/></g><path d="M102 188Q96 94 200 88Q304 94 298 188Q272 132 234 142Q216 114 190 144Q150 124 102 188Z" fill="${c.hair}"/><path d="M106 152Q200 66 294 152L288 170Q200 92 112 170Z" fill="${PAL.sol}"/><circle cx="250" cy="104" r="14" fill="${PAL.sol}"/><path d="M244 104l6 -6 6 6 -6 6Z" fill="${PAL.magenta2}"/>`;
  return `<ellipse cx="200" cy="130" rx="160" ry="34" fill="#6B3E26"/><path d="M118 128Q120 36 200 32Q280 36 282 128Z" fill="#8A5230"/><path d="M118 128H282V104H118Z" fill="${c.accent}"/><path d="M118 112H282" stroke="#fff" stroke-width="3" opacity=".25"/><path d="M262 108Q300 70 332 78Q312 92 290 118Z" fill="${PAL.quetzal}"/><path d="M270 106Q306 86 326 82" stroke="${PAL.quetzalClaro}" stroke-width="3" fill="none"/><ellipse cx="200" cy="132" rx="160" ry="34" fill="none" stroke="${shade('#6B3E26', 0.2)}" stroke-width="4" opacity=".6"/><g fill="none" stroke="#E0A058" stroke-width="5"><circle cx="156" cy="82" r="15"/><circle cx="196" cy="82" r="15"/><path d="M171 82h10"/></g><path d="M120 128Q200 150 280 128" fill="#000" opacity=".16"/>`;
}
function chFace(k, c, uid) {
  const my = c.mouthY, hairBrow = k === 'ignacio' ? '#B8B3AD' : c.hair;
  const eye = (cx) => `<g class="c-eye"><ellipse cx="${cx}" cy="198" rx="19" ry="24" fill="#FFFBF0"/><circle cx="${cx + 3}" cy="202" r="13.5" fill="${k === 'ignacio' ? '#3B2A1E' : '#2A160E'}"/><circle cx="${cx + 8}" cy="194" r="5.4" fill="#fff"/><circle cx="${cx - 2}" cy="209" r="2.6" fill="#fff" opacity=".7"/></g>`;
  const brow = (x0, x1, up) => `<path class="c-brow" d="M${x0} ${up ? 160 : 164}Q${(x0 + x1) / 2} ${up ? 140 : 142} ${x1} ${up ? 158 : 160}" stroke="${hairBrow}" stroke-width="${k === 'ignacio' ? 12 : 7}" fill="none" stroke-linecap="round"/>`;
  const stache = k === 'ignacio' ? `<path d="M148 236Q174 218 200 236Q226 218 252 236Q246 266 200 252Q154 266 148 236Z" fill="#D9D5D0"/><path d="M160 240Q180 232 200 242Q220 232 240 240" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>` : '';
  return `<ellipse cx="102" cy="206" rx="16" ry="22" fill="${c.skin}"/><ellipse cx="298" cy="206" rx="16" ry="22" fill="${c.skin}"/>
<ellipse cx="200" cy="190" rx="100" ry="94" fill="${c.skin}"/><ellipse cx="200" cy="228" rx="86" ry="56" fill="${shade(c.skin, -0.08)}" opacity=".35"/>
<ellipse cx="140" cy="232" rx="22" ry="14" fill="#FF7A7A" opacity=".3"/><ellipse cx="260" cy="232" rx="22" ry="14" fill="#FF7A7A" opacity=".3"/>
${eye(155)}${eye(245)}${brow(126, 184, false)}${brow(216, 274, false)}
${k === 'ignacio' ? '<path d="M120 214q-10 6 -12 16M280 214q10 6 12 16" stroke="#8A5230" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>' : ''}
<path d="M200 208q-9 15 0 21q9 4 14 -3" stroke="${shade(c.skin, -0.28)}" stroke-width="5" fill="none" stroke-linecap="round"/>
<g class="c-mouth" transform="translate(0 ${my})"><path class="c-m-c" d="M168 246Q200 276 232 246" stroke="#7A2E2E" stroke-width="8" fill="none" stroke-linecap="round"/><g class="c-m-o" opacity="0"><ellipse cx="200" cy="256" rx="26" ry="22" fill="#6B1E24"/><path d="M178 244Q200 252 222 244L222 240H178Z" fill="#fff"/><ellipse cx="200" cy="270" rx="15" ry="8" fill="#E0606A"/></g></g>${stache}`;
}
/** Personnage : key 'alex'|'marina'|'ignacio'|'diego'|'pilar'|'lola'|'abuela_carmen'|'rafa'. opts : width, view ('full' | 'bust' | viewBox), uid, pack (sac a dos, defaut true). */
export function character(key, opts) {
  opts = opts || {};
  const c = CHARS[key] || CHARS.alex, id = opts.uid || uid('ch');
  const bust = opts.view === 'bust', view = bust ? '30 22 340 312' : opts.view && opts.view !== 'full' ? opts.view : '0 0 400 660';
  const W = opts.width || 400, H = opts.height || Math.round((W * (bust ? 312 : 660)) / (bust ? 340 : 400));
  const pack = key === 'alex' ? `<g class="c-pack"><rect x="98" y="252" width="204" height="236" rx="56" fill="${PAL.terracotta}"/><rect x="98" y="252" width="204" height="236" rx="56" fill="url(#${id}-pk)"/><rect x="124" y="396" width="152" height="74" rx="24" fill="${PAL.terracotta2}"/><circle cx="278" cy="262" r="22" fill="${PAL.sol}"/><rect x="170" y="236" width="60" height="26" rx="13" fill="${PAL.terracotta2}"/></g>` : key === 'marina' ? `<rect x="136" y="300" width="128" height="126" rx="38" fill="${PAL.sol}"/>` : `<path d="M254 340L300 470Q304 492 280 494H236Q214 494 220 470Z" fill="#8A5230"/><path d="M226 376Q250 366 272 380" stroke="#6B3E26" stroke-width="5" fill="none"/>`;
  const strap = key === 'alex' ? `<path d="M162 292V420M238 292V420" stroke="${PAL.terracotta2}" stroke-width="12" stroke-linecap="round"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${W}" height="${H}" class="c-svg c-${key}" role="img" aria-label="${c.name}"><defs><linearGradient id="${id}-pk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
<g class="c-rig"><ellipse class="c-shadow" cx="200" cy="640" rx="118" ry="15" fill="#000" opacity=".28"/>
${bust ? '' : pack}${bust ? '' : chLeg(c, 'L') + chLeg(c, 'R')}
<g class="c-body">${chTorso(key, c)}${strap}${bust ? '' : chArm(key, c, 'L') + chArm(key, c, 'R')}
<rect x="184" y="268" width="32" height="30" fill="${shade(c.skin, -0.12)}"/>
<g class="c-head">${chHairBack(key, c)}${chFace(key, c, id)}${chHairFront(key, c)}${CHX[key] && CHX[key].acc ? CHX[key].acc(c) : ''}</g></g></g></svg>`;
}

function cEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function ca(root, sel) { return Array.from(cEl(root).querySelectorAll(sel)); }
/** Bouche : une ouverture par mot (debut `at`, duree `dur` repartie en n ouvertures). */
export function charTalk(tl, root, at, dur, n) {
  const open = ca(root, '.c-m-o'), closed = ca(root, '.c-m-c'), step = dur / (n || 1);
  for (let i = 0; i < (n || 1); i++) {
    const t = at + i * step, amp = 0.55 + ((i * 37) % 5) * 0.11;
    tl.to(open, { opacity: 1, scaleY: amp + 0.2, scaleX: 0.9 + (i % 2) * 0.15, svgOrigin: '200 256', duration: step * 0.32, ease: 'power2.out' }, t);
    tl.to(closed, { opacity: 0, duration: 0.02 }, t);
    tl.to(open, { scaleY: 0.18, duration: step * 0.3, ease: 'power2.in' }, t + step * 0.4);
    tl.to(closed, { opacity: 1, duration: 0.02 }, t + step * 0.78);
  }
  tl.to(open, { opacity: 0, duration: 0.05 }, at + dur);
  tl.to(closed, { opacity: 1, duration: 0.02 }, at + dur);
}
export function charBlink(tl, root, at) {
  const eyes = ca(root, '.c-eye');
  tl.to(eyes, { scaleY: 0.08, svgOrigin: '200 198', duration: 0.07, ease: 'power2.in' }, at);
  tl.to(eyes, { scaleY: 1, svgOrigin: '200 198', duration: 0.12, ease: 'power2.out' }, at + 0.09);
}
/** Respiration + balancement de la couette / tete (cycles finis). */
export function charIdle(tl, root, at, span, amp) {
  const a = amp == null ? 1 : amp, body = ca(root, '.c-body');
  tl.fromTo(body, { y: 0 }, { y: -5 * a, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.1)) }, at);
  ca(root, '.c-tail').forEach((t) => tl.fromTo(t, { rotation: -5 * a, svgOrigin: t.dataset.px + ' ' + t.dataset.py }, { rotation: 6 * a, svgOrigin: t.dataset.px + ' ' + t.dataset.py, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.3)) }, at));
  tl.fromTo(ca(root, '.c-head'), { y: 0 }, { y: -4 * a, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.7)) }, at + 0.3);
}
/** Marche sur place : jambes en opposition, bras qui balancent, rebond du corps. `period` = duree d'un pas. */
export function charWalk(tl, root, at, dur, period) {
  const per = period || 0.36, n = Math.max(1, Math.round(dur / per)), L = ca(root, '.c-legL'), R = ca(root, '.c-legR'), aL = ca(root, '.c-armL'), aR = ca(root, '.c-armR'), body = ca(root, '.c-body, .c-pack');
  for (let i = 0; i < n; i++) {
    const t = at + i * per, s = i % 2 ? -1 : 1;
    tl.to(L, { rotation: 24 * s, svgOrigin: CHAR_PIVOT.legL, duration: per, ease: 'sine.inOut' }, t);
    tl.to(R, { rotation: -24 * s, svgOrigin: CHAR_PIVOT.legR, duration: per, ease: 'sine.inOut' }, t);
    tl.to(aL, { rotation: -22 * s, svgOrigin: CHAR_PIVOT.armL, duration: per, ease: 'sine.inOut' }, t);
    tl.to(aR, { rotation: 22 * s, svgOrigin: CHAR_PIVOT.armR, duration: per, ease: 'sine.inOut' }, t);
    tl.to(body, { y: -14, duration: per / 2, ease: 'sine.out' }, t);
    tl.to(body, { y: 0, duration: per / 2, ease: 'sine.in' }, t + per / 2);
  }
  tl.to(L.concat(R, aL, aR), { rotation: 0, duration: 0.25, ease: 'power2.out' }, at + n * per);
}
/** Salut de la main (bras `side` 'L'|'R' leve qui oscille). */
export function charWave(tl, root, at, dur, side) {
  const arm = ca(root, '.c-arm' + (side || 'R')), piv = side === 'L' ? CHAR_PIVOT.armL : CHAR_PIVOT.armR, sg = side === 'L' ? 1 : -1;
  tl.to(arm, { rotation: 150 * sg, svgOrigin: piv, duration: 0.3, ease: 'back.out(1.6)' }, at);
  const n = Math.max(2, Math.floor(dur / 0.24));
  tl.fromTo(arm, { rotation: 150 * sg - 14 }, { rotation: 150 * sg + 14, svgOrigin: piv, duration: 0.12, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, immediateRender: false }, at + 0.3);
  tl.to(arm, { rotation: 0, svgOrigin: piv, duration: 0.35, ease: 'power2.inOut' }, at + 0.3 + n * 0.24);
}
/** Emotion : 'happy' (sourcils hauts, grand sourire), 'worry' (sourcils inclines), 'neutral'. */
export function charEmote(tl, root, at, kind, dur) {
  const brows = ca(root, '.c-brow');
  const y = kind === 'happy' ? -12 : kind === 'worry' ? -6 : 0, r = kind === 'worry' ? 12 : 0;
  tl.to(brows, { y: y, duration: dur || 0.25, ease: 'power2.out' }, at);
  ca(root, '.c-brow').forEach((b, i) => tl.to(b, { rotation: (i ? -1 : 1) * r, svgOrigin: i ? '245 164' : '155 164', duration: dur || 0.25, ease: 'power2.out' }, at));
}
/** Hochement de tete (rotation autour du cou) : liste de [temps, angle]. */
export function charNod(tl, root, at, angle, dur) {
  const h = ca(root, '.c-head'), d = dur || 0.16;
  tl.to(h, { rotation: angle, svgOrigin: CHAR_PIVOT.head, duration: d, ease: 'power2.out' }, at);
  tl.to(h, { rotation: 0, svgOrigin: CHAR_PIVOT.head, duration: d * 1.6, ease: 'power2.inOut' }, at + d);
}

// ---------------------------------------------------------------- personnages des unites 2 et 3 (meme chibi, 400x660) : Diego, Dona Pilar, Lola, Abuela Carmen, Tio Rafa
// Chaque entree fournit torse (+ jupe/tablier), cheveux arriere/avant et accessoires de tete ; le reste (visage, bras, jambes, rig) vient de 08-characters.js.
const CHX = {
  diego: {
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M162 286Q200 322 238 286L238 304Q200 340 162 304Z" fill="#F5E6C8"/><path d="M132 392L268 404L270 424L130 412Z" fill="${c.accent}"/><circle cx="236" cy="366" r="14" fill="${c.accent}"/><path d="M236 358l3 6h6l-5 4 2 7-6 -4 -6 4 2 -7 -5 -4h6Z" fill="${c.top}"/>`,
    front: (c) => `<path d="M100 186Q88 88 200 80Q312 88 300 186Q292 150 266 144L254 112L228 150L204 104L180 150L152 114L136 144Q108 152 100 186Z" fill="${c.hair}"/><path d="M130 116Q160 94 190 100" stroke="${shade(c.hair, 0.3)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`,
  },
  pilar: {
    torso: (c) => `<path d="M132 436L268 436L296 592Q200 612 104 592Z" fill="${c.pants}"/><path d="M200 440L206 600Q250 600 296 592L268 436Z" fill="#000" opacity=".16"/><path d="M130 296Q200 272 270 296L280 446Q200 470 120 446Z" fill="${c.top}"/><path d="M270 296L280 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M162 288Q200 330 238 288L238 310Q200 352 162 310Z" fill="#F5E6C8"/><path d="M200 330V456" stroke="${shade(c.top, -0.35)}" stroke-width="5"/><circle cx="200" cy="372" r="5" fill="${c.accent}"/><circle cx="200" cy="414" r="5" fill="${c.accent}"/><path d="M168 300Q200 360 232 300" fill="none" stroke="${c.accent}" stroke-width="4" opacity=".9"/><circle cx="200" cy="352" r="9" fill="${c.accent}"/>`,
    back: (c) => `<circle cx="200" cy="72" r="46" fill="${c.hair}"/><path d="M170 52Q200 30 232 52" stroke="${shade(c.hair, 0.35)}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 286 262Q290 210 272 188L128 188Q110 210 114 262Q88 250 98 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q284 142 244 138Q210 118 168 140Q122 142 102 190Z" fill="${c.hair}"/><path d="M118 150Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`,
    acc: (c) => `<g fill="none" stroke="#3B2216" stroke-width="5"><rect x="124" y="176" width="64" height="50" rx="20" fill="#CFE9F5" fill-opacity=".18"/><rect x="212" y="176" width="64" height="50" rx="20" fill="#CFE9F5" fill-opacity=".18"/><path d="M188 196Q200 188 212 196"/><path d="M124 190L108 184M276 190L292 184"/></g>`,
  },
  lola: {
    torso: (c) => `<path d="M134 436L266 436L306 540Q200 560 94 540Z" fill="${c.top}"/><path d="M206 440L220 552Q268 548 306 540L266 436Z" fill="#000" opacity=".12"/><path d="M96 520Q200 540 306 520L306 540Q200 562 94 540Z" fill="${c.accent}"/><path class="c-torso" d="M142 292Q200 276 258 292L270 446Q200 466 130 446Z" fill="${c.top}"/><path d="M258 292L270 446Q238 454 214 458L222 300Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M150 292Q200 330 250 292L250 310Q200 350 150 310Z" fill="#F5E6C8"/><path d="M130 438Q200 462 270 438L270 456Q200 480 130 456Z" fill="${c.accent}"/><circle cx="200" cy="344" r="9" fill="${c.accent}"/>`,
    back: (c) => `<path d="M104 186Q36 196 40 290Q58 326 96 288Q118 240 110 196Z" fill="${c.hair}"/><path d="M296 186Q364 196 360 290Q342 326 304 288Q282 240 290 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M100 186Q98 92 200 86Q302 92 300 186Q282 138 244 150Q222 124 196 152Q150 130 100 186Z" fill="${c.hair}"/><path d="M122 134Q160 100 200 106" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><g fill="${c.accent}"><path d="M92 222l-30 -22q-8 22 8 44Z"/><path d="M92 222l-6 -34q24 6 28 28Z"/><circle cx="92" cy="224" r="9"/><path d="M308 222l30 -22q8 22 -8 44Z"/><path d="M308 222l6 -34q-24 6 -28 28Z"/><circle cx="308" cy="224" r="9"/></g>`,
  },
  abuela_carmen: {
    torso: (c) => `<path d="M130 436L270 436L298 596Q200 614 102 596Z" fill="${c.pants}"/><path d="M204 440L208 604Q252 602 298 596L270 436Z" fill="#000" opacity=".16"/><path d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M158 288Q200 322 242 288L242 308Q200 342 158 308Z" fill="#F5E6C8"/><path d="M152 336H248L262 470Q200 486 138 470Z" fill="#F5E6C8"/><path d="M152 336Q200 352 248 336" fill="none" stroke="${c.accent}" stroke-width="4"/><g fill="#D93472"><circle cx="176" cy="392" r="9"/><circle cx="224" cy="414" r="9"/><circle cx="196" cy="444" r="9"/></g><g fill="#FFC83D"><circle cx="176" cy="392" r="3.5"/><circle cx="224" cy="414" r="3.5"/><circle cx="196" cy="444" r="3.5"/></g><path d="M170 392q-14 -6 -10 -18M224 414q14 -6 10 -18" stroke="#0E9F6E" stroke-width="3" fill="none"/>`,
    back: (c) => `<circle cx="200" cy="70" r="44" fill="${c.hair}"/><circle cx="200" cy="70" r="44" fill="none" stroke="#B8B3AD" stroke-width="4" opacity=".6"/><path d="M96 196Q86 90 200 78Q314 90 304 196Q310 240 290 252Q292 206 276 190L124 190Q108 206 110 252Q90 240 96 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><g fill="#D93472"><circle cx="248" cy="84" r="10"/><circle cx="268" cy="96" r="8"/></g><path d="M240 80q-12 -14 6 -22" stroke="#0E9F6E" stroke-width="5" fill="none"/>`,
    acc: (c) => `<g fill="#CFE9F5" fill-opacity=".16" stroke="${c.accent}" stroke-width="5"><circle cx="155" cy="200" r="30"/><circle cx="245" cy="200" r="30"/></g><path d="M185 198Q200 190 215 198M125 196L108 190M275 196L292 190" stroke="${c.accent}" stroke-width="5" fill="none"/>`,
  },
  rafa: {
    torso: (c) => `<path class="c-torso" d="M136 292Q200 272 264 292L280 446Q200 470 120 446Z" fill="${c.top}"/><path d="M264 292L280 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.25)}" opacity=".5"/><path d="M156 336H244L258 476Q200 490 142 476Z" fill="#F5E6C8"/><path d="M156 336Q200 348 244 336" fill="none" stroke="#C9C0AB" stroke-width="4"/><path d="M162 290Q200 332 238 290L238 314Q200 356 162 314Z" fill="#F5E6C8"/><path d="M170 292V332M230 292V332" stroke="#C9C0AB" stroke-width="5"/><rect x="176" y="380" width="48" height="36" rx="8" fill="none" stroke="#C9C0AB" stroke-width="4"/>`,
    front: (c) => `<path d="M100 182Q94 90 200 84Q306 90 300 182Q292 150 268 144Q238 134 200 144Q162 134 132 144Q108 150 100 182Z" fill="${c.hair}"/><path d="M98 138Q200 100 302 138L298 168Q200 132 102 168Z" fill="${c.accent}"/><path d="M98 138Q200 100 302 138" fill="none" stroke="#fff" stroke-width="3" opacity=".3"/><path d="M300 150Q340 150 350 176Q320 170 298 166Z" fill="${c.accent}"/><circle cx="160" cy="130" r="5" fill="#fff" opacity=".5"/><circle cx="214" cy="116" r="5" fill="#fff" opacity=".5"/><circle cx="262" cy="134" r="5" fill="#fff" opacity=".5"/>`,
    acc: () => `<path d="M146 236Q174 214 200 232Q226 214 254 236Q248 258 200 246Q152 258 146 236Z" fill="#1E120C"/><path d="M164 238Q182 230 200 238Q218 230 236 238" stroke="#4A3A30" stroke-width="3" fill="none" opacity=".6"/>`,
  },
};

// ---------------------------------------------------------------- accessoires d'histoire (unites 2 et 3) : cloche, bocadillo, chat, guitare, cazuela, grenouille, cigogne, enfant fige
// Chaque prop = chaine SVG (viewBox fixe). Parties animables : .pr-bell (cloche, pivot haut), .pr-clap (battant), .pr-frog, .st-wing*.

/** Stone sandstone palette (Salamanca) */
const STN = { l: '#F8D993', m: '#EBB968', d: '#C98F45', dd: '#8E5A2C', roof: '#B4503A', roof2: '#8E3A2B' };

/**
 * Props. key : 'campana' (cloche de bronze 300x340, pivot haut 150 30) | 'bocadillo' (200x90) | 'gato' (chat orange assis 220x240) |
 * 'guitarra' (160x420) | 'cazuela' (casserole 260x150) | 'rana' (grenouille de pierre 160x140, + crane) | 'azulejo' (carreau 120x120).
 * opts : width, uid, tone (campana : 'bronce'|'muda' = gris terne).
 */
export function prop(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('pr'), g = (n) => `${id}-${n}`;
  const mk = (vb, w, h, inner, cls) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" class="pr-svg ${cls || ''}" aria-hidden="true" style="overflow:visible">${inner}</svg>`;
  if (key === 'campana') {
    const mute = opts.tone === 'muda', b1 = mute ? '#8C8A93' : '#E3A53C', b2 = mute ? '#6C6A75' : '#B97A1E', b3 = mute ? '#B5B3BC' : '#FFE08A';
    const W = opts.width || 300;
    return mk('0 0 300 340', W, Math.round(W * 340 / 300), `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${b2}"/><stop offset=".35" stop-color="${b1}"/><stop offset=".6" stop-color="${b3}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs>
<g class="pr-bell" data-px="150" data-py="34"><rect x="96" y="14" width="108" height="26" rx="10" fill="#6B3E26"/><rect x="96" y="14" width="108" height="8" rx="4" fill="#9A6038"/>
<path d="M130 40h40v26h-40Z" fill="${b2}"/><path d="M150 52C84 56 66 138 50 234Q36 270 24 296H276Q264 270 250 234C234 138 216 56 150 52Z" fill="url(#${g('b')})"/>
<path d="M24 296H276V312Q150 332 24 312Z" fill="${b2}"/><path d="M60 214Q150 236 240 214" stroke="${b2}" stroke-width="7" fill="none" opacity=".8"/><path d="M52 246Q150 268 248 246" stroke="${b3}" stroke-width="4" fill="none" opacity=".6"/>
<path d="M112 90Q96 150 84 226" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".35"/>
<g class="pr-clap" data-px="150" data-py="280"><path d="M150 280V316" stroke="#4A2A1C" stroke-width="7"/><circle cx="150" cy="324" r="15" fill="#4A2A1C"/></g></g>`, 'pr-campana');
  }
  if (key === 'bocadillo') {
    const W = opts.width || 200;
    return mk('0 0 200 90', W, Math.round(W * 0.45), `<path d="M10 52Q4 22 40 20L170 18Q198 22 190 52Q194 78 160 80L40 82Q8 80 10 52Z" fill="#E8B15C"/><path d="M26 28Q100 10 176 28" stroke="#F8D993" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/><g stroke="#B27A2E" stroke-width="5" stroke-linecap="round" opacity=".6"><path d="M52 26l-8 14M90 22l-8 14M128 22l-8 14M162 28l-8 12"/></g><path d="M16 56Q30 44 52 54Q80 44 104 54Q130 44 156 54Q176 46 188 56L186 68Q100 78 14 68Z" fill="#D8433F"/><path d="M18 62Q100 74 184 62" stroke="#F5E6C8" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 70Q100 84 182 70L176 78Q100 90 24 78Z" fill="#E8B15C"/>`, 'pr-bocadillo');
  }
  if (key === 'gato') {
    const W = opts.width || 220;
    return mk('0 0 220 240', W, Math.round(W * 240 / 220), `<g class="pr-cat"><path class="pr-tail" d="M170 206Q236 196 226 130Q220 104 200 112Q214 140 196 164Q176 178 150 186Z" fill="#E98A2E"/><path d="M62 228Q36 120 110 112Q184 120 162 228Z" fill="#F0A04B"/><path d="M96 228Q92 168 110 150Q132 168 128 228Z" fill="#FFE2B8"/>
<g class="pr-cat-head"><path d="M50 78L58 30L88 56Q110 50 132 56L162 30L170 78Q176 138 110 142Q44 138 50 78Z" fill="#F0A04B"/><path d="M62 44L66 66L82 58ZM158 44L154 66L138 58Z" fill="#F7B6A0"/><path d="M96 66Q110 54 124 66" stroke="#C86A1C" stroke-width="5" fill="none"/><path d="M80 74q-2 14 4 24M140 74q2 14 -4 24" stroke="#C86A1C" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="84" cy="102" rx="12" ry="14" fill="#9BE08B"/><ellipse cx="136" cy="102" rx="12" ry="14" fill="#9BE08B"/><ellipse cx="84" cy="104" rx="4" ry="11" fill="#1E2A14"/><ellipse cx="136" cy="104" rx="4" ry="11" fill="#1E2A14"/><circle cx="88" cy="96" r="3.4" fill="#fff"/><circle cx="140" cy="96" r="3.4" fill="#fff"/>
<path d="M104 118h12l-6 8Z" fill="#E8708A"/><path d="M110 126q-10 12 -20 6M110 126q10 12 20 6" stroke="#8A4A1C" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 116L22 108M60 126L24 132M160 116L198 108M160 126L196 132" stroke="#FFF1DC" stroke-width="3" stroke-linecap="round" opacity=".9"/></g>
<path d="M70 222Q74 236 92 238L104 238Q108 226 98 220ZM150 222Q146 236 128 238L116 238Q112 226 122 220Z" fill="#FFE2B8"/></g>`, 'pr-gato');
  }
  if (key === 'guitarra') {
    const W = opts.width || 160;
    return mk('0 0 160 420', W, Math.round(W * 420 / 160), `<rect x="68" y="0" width="26" height="40" rx="6" fill="#4A2A1C"/><g fill="#E0C07A"><circle cx="64" cy="10" r="5"/><circle cx="64" cy="26" r="5"/><circle cx="98" cy="10" r="5"/><circle cx="98" cy="26" r="5"/></g><rect x="70" y="38" width="22" height="168" fill="#3B2216"/><path d="M81 40V300" stroke="#E8DDC4" stroke-width="2.5"/><g stroke="#C9B890" stroke-width="2" opacity=".8"><path d="M70 70h22M70 100h22M70 132h22M70 164h22"/></g>
<path d="M81 196C26 196 8 232 22 262C-4 290 6 372 60 394Q81 402 102 394C156 372 166 290 140 262C154 232 136 196 81 196Z" fill="#C46B2E"/><path d="M81 206C38 206 24 236 36 258C16 284 24 360 66 380Q81 386 96 380C138 360 146 284 126 258C138 236 124 206 81 206Z" fill="#E0873A"/><circle cx="81" cy="290" r="26" fill="#2A160E"/><circle cx="81" cy="290" r="26" fill="none" stroke="#F8D993" stroke-width="6"/><rect x="58" y="344" width="46" height="12" rx="4" fill="#4A2A1C"/><path d="M40 244Q60 232 74 236" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".4"/>`, 'pr-guitarra');
  }
  if (key === 'cazuela') {
    const W = opts.width || 260;
    return mk('0 0 260 150', W, Math.round(W * 150 / 260), `<ellipse cx="130" cy="140" rx="110" ry="9" fill="#000" opacity=".25"/><path d="M26 62H234L222 120Q214 138 190 138H70Q46 138 38 120Z" fill="#C9573B"/><path d="M26 62H234L230 76H30Z" fill="#E8795A"/><path d="M232 78H256Q262 78 262 88Q262 98 254 98H228Z" fill="#8E3A2B"/><path d="M28 78H4Q-2 78 -2 88Q-2 98 6 98H32Z" fill="#8E3A2B"/><ellipse cx="130" cy="62" rx="104" ry="14" fill="#7A2E1E"/><ellipse cx="130" cy="62" rx="92" ry="10" fill="#E8A53C"/><g fill="#D8433F"><circle cx="96" cy="62" r="6"/><circle cx="130" cy="58" r="6"/><circle cx="164" cy="63" r="6"/></g><g fill="#3AA66A"><circle cx="112" cy="64" r="4"/><circle cx="148" cy="60" r="4"/></g><path d="M60 100Q130 112 200 100" stroke="#fff" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>`, 'pr-cazuela');
  }
  if (key === 'rana') {
    const W = opts.width || 160, glow = opts.glow === false ? '' : `<ellipse class="fz-glow" cx="80" cy="60" rx="120" ry="100" fill="url(#${g('gl')})" opacity="0"/>`;
    return mk('0 0 160 150', W, Math.round(W * 150 / 160), `<defs><radialGradient id="${g('gl')}"><stop offset="0" stop-color="#9bffd6" stop-opacity=".95"/><stop offset=".5" stop-color="#42E0A0" stop-opacity=".45"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>${glow}
<path d="M30 148V104Q30 70 80 70Q130 70 130 104V148Z" fill="${STN.d}"/><ellipse cx="80" cy="104" rx="46" ry="38" fill="#F2E6C8"/><ellipse cx="62" cy="104" rx="11" ry="13" fill="#4A2A1C"/><ellipse cx="98" cy="104" rx="11" ry="13" fill="#4A2A1C"/><path d="M76 120l4 -10 4 10Z" fill="#4A2A1C"/><path d="M58 138h44" stroke="#4A2A1C" stroke-width="5"/><path d="M68 138v-10M80 138v-10M92 138v-10" stroke="#4A2A1C" stroke-width="4"/>
<g class="pr-frog"><path d="M34 70Q30 40 58 34Q80 28 102 34Q130 40 126 70Q118 82 80 82Q42 82 34 70Z" fill="${STN.m}"/><path d="M34 70Q30 40 58 34Q80 28 102 34Q130 40 126 70" fill="none" stroke="${STN.l}" stroke-width="4" opacity=".8"/><circle cx="52" cy="32" r="16" fill="${STN.m}"/><circle cx="108" cy="32" r="16" fill="${STN.m}"/><circle cx="52" cy="32" r="8" fill="#fff" opacity=".95"/><circle cx="108" cy="32" r="8" fill="#fff" opacity=".95"/><circle class="pr-eye" cx="52" cy="33" r="4.4" fill="#0E7F52"/><circle class="pr-eye" cx="108" cy="33" r="4.4" fill="#0E7F52"/><path d="M52 62Q80 78 108 62" stroke="${STN.dd}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M40 78Q30 92 44 98M120 78Q130 92 116 98" stroke="${STN.d}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M74 48q6 4 12 0" stroke="${STN.dd}" stroke-width="3" fill="none"/></g>`, 'pr-rana');
  }
  if (key === 'azulejo') {
    const W = opts.width || 120, c = opts.c || '#2F6FD0';
    return mk('0 0 100 100', W, W, `${azulejoPattern(g('t'), { a: opts.a || '#F5E6C8', b: c, c: opts.cc || PAL.sol, d: opts.d || '#F5E6C8' })}<rect width="100" height="100" rx="6" fill="url(#${g('t')})"/><rect x="2" y="2" width="96" height="96" rx="6" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>`, 'pr-azulejo');
  }
  return '';
}

/** Cigogne (cigueña) en vol (160x100) : ailes .st-wing (pivot epaule) a battre par rotation ; en 'rest' : posee sur un nid (120x150). */
export function storkSvg(opts) {
  opts = opts || {};
  const W = opts.width || 160;
  if (opts.rest) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="${W}" height="${Math.round(W * 150 / 120)}" class="st-svg" aria-hidden="true" style="overflow:visible"><path d="M30 140Q60 150 90 140L100 120H20Z" fill="#8A5A30"/><path d="M14 124l24 -8M96 116l16 -6M30 138l-12 6M88 140l16 4M44 120l-6 -12M76 118l8 -12" stroke="#6B3E26" stroke-width="5" stroke-linecap="round"/>
<path d="M44 118L40 80M76 118L80 80" stroke="#D8433F" stroke-width="5" stroke-linecap="round"/><path d="M34 82Q34 50 64 48Q96 52 92 86Q80 110 54 108Q36 104 34 82Z" fill="#fff"/><path d="M40 92Q64 112 92 82L90 96Q70 118 44 108Z" fill="#1E1A2B"/><g class="st-neck"><path d="M76 56Q92 40 86 22Q84 12 94 10L94 24Q108 34 90 62Z" fill="#fff"/><circle cx="92" cy="14" r="9" fill="#fff"/><path d="M98 12L132 20L98 22Z" fill="#D8433F"/><circle cx="94" cy="12" r="2.4" fill="#1E1A2B"/></g></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="${W}" height="${Math.round(W * 100 / 160)}" class="st-svg" aria-hidden="true" style="overflow:visible"><path d="M40 70L8 78" stroke="#D8433F" stroke-width="4" stroke-linecap="round"/><path d="M46 74L14 90" stroke="#D8433F" stroke-width="4" stroke-linecap="round"/>
<g class="st-wing st-wingB" data-px="80" data-py="50"><path d="M80 50Q60 6 14 8Q40 30 54 54Z" fill="#fff"/><path d="M14 8Q40 30 54 54L46 54Q36 30 14 8Z" fill="#1E1A2B"/></g><path d="M126 46Q150 38 156 50L126 56Z" fill="#D8433F"/><path d="M40 60Q40 40 76 40Q112 40 120 54Q112 70 76 72Q46 74 40 60Z" fill="#fff"/><path d="M110 50Q124 42 128 50Q122 58 112 58Z" fill="#fff"/><circle cx="120" cy="46" r="2.4" fill="#1E1A2B"/>
<g class="st-wing st-wingF" data-px="82" data-py="50"><path d="M82 50Q104 4 150 6Q124 30 108 56Z" fill="#fff"/><path d="M150 6Q124 30 108 56L116 56Q126 30 150 6Z" fill="#1E1A2B"/></g></svg>`;
}

/** Enfant "fige" (silence de la Sombra) : silhouette de papier decoupe grise-bleutee, bouche fermee, pose figee. pose : 'stand'|'ball'|'rope'|'run'|'sit'. 200x340. */
export function frozenKid(opts) {
  opts = opts || {};
  const W = opts.width || 120, pose = opts.pose || 'stand', c = opts.color || '#7A85B8', h = opts.hair || '#3A3F73', sk = opts.skin || '#B5BCD9', sh = shade(c, -0.25);
  const arms = pose === 'ball' ? `<path d="M64 130L28 70" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L172 70" stroke="${c}" stroke-width="22" stroke-linecap="round"/><circle cx="100" cy="36" r="26" fill="#C9CCE3"/><path d="M80 24Q100 40 120 24M80 48Q100 32 120 48" stroke="${sh}" stroke-width="4" fill="none"/>`
    : pose === 'rope' ? `<path d="M64 130L30 170" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L170 170" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M30 172Q100 330 170 172" stroke="#9AA2CF" stroke-width="5" fill="none"/>`
    : `<path d="M64 130L50 220" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L150 220" stroke="${c}" stroke-width="22" stroke-linecap="round"/>`;
  const legs = pose === 'run' ? `<path d="M84 224L52 322" stroke="${sh}" stroke-width="24" stroke-linecap="round"/><path d="M116 224L150 300" stroke="${sh}" stroke-width="24" stroke-linecap="round"/>` : `<path d="M84 226V320" stroke="${sh}" stroke-width="26" stroke-linecap="round"/><path d="M116 226V320" stroke="${sh}" stroke-width="26" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="${W}" height="${Math.round(W * 340 / 200)}" class="fk-svg" aria-hidden="true" style="overflow:visible">${arms}${legs}<path d="M58 124Q100 106 142 124L148 236H52Z" fill="${c}"/><circle cx="100" cy="90" r="42" fill="${sk}"/><path d="M58 88Q56 40 100 40Q146 40 142 88Q130 60 100 66Q70 60 58 88Z" fill="${h}"/><path d="M84 104h32" stroke="${sh}" stroke-width="5" stroke-linecap="round"/><circle cx="84" cy="88" r="4.5" fill="${sh}"/><circle cx="116" cy="88" r="4.5" fill="${sh}"/></svg>`;
}

// ---------------------------------------------------------------- decors de Salamanca (unite 2) : facade plateresque de l'Universite (+ la grenouille), panorama dore, patio du colegio, salle de classe
// Pierre dorée de Villamayor : meme langage graphique que Madrid / Academia (aplats + ombrages, calques separes pour la parallaxe).
// Aucun texte, aucune marque : monuments publics simplifies.

/** Position de la grenouille sur la facade (repere 1000x820) : coin haut-gauche + largeur ; centre = (x + w/2, y + w*0.47). */
const FROG = { x: 290, y: 316, w: 120 };
function archOpen(x, yb, w, h) { const r = w / 2; return `M${r1(x)} ${r1(yb)}V${r1(yb - h + r)}A${r1(r)} ${r1(r)} 0 0 1 ${r1(x + w)} ${r1(yb - h + r)}V${r1(yb)}Z`; }
/** Appareil de pierre : joints horizontaux + joints verticaux decales. */
function stoneBlocks(x, y, w, h, rowH, seed, c, op) {
  const rnd = rng(seed); let s = '';
  for (let r = 0; r * rowH < h; r++) {
    const yy = y + r * rowH;
    s += `<path d="M${r1(x)} ${r1(yy)}H${r1(x + w)}" stroke="${c}" stroke-width="2" opacity="${op || 0.3}"/>`;
    for (let xx = x + (r % 2) * rowH * 1.1 + rowH * (1.4 + rnd()); xx < x + w; xx += rowH * (2.1 + rnd() * 1.4)) s += `<path d="M${r1(xx)} ${r1(yy)}v${rowH}" stroke="${c}" stroke-width="2" opacity="${(op || 0.3) * 0.85}"/>`;
  }
  return s;
}
/** Frise sculptee : motifs repetes (circ | dia | scal | star) dans une bande x,y,w,h. */
function carvedBand(x, y, w, h, kind, c, bg) {
  const n = Math.max(1, Math.floor(w / (h * 0.95))), st = w / n; let s = bg ? scRect(x, y, w, h, bg) : '';
  for (let i = 0; i < n; i++) {
    const cx = x + st * (i + 0.5), cy = y + h / 2;
    if (kind === 'circ') s += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(h * 0.3)}" fill="${c}"/>`;
    else if (kind === 'dia') s += `<path d="${diamondPath(r1(cx), r1(cy), r1(h * 0.28), r1(h * 0.4))}" fill="${c}"/>`;
    else if (kind === 'star') s += `<path d="${starPath(cx, cy, h * 0.42, h * 0.2, 6, 0)}" fill="${c}"/>`;
    else s += `<path d="M${r1(cx - st / 2 + 1)} ${r1(y + h)}A${r1(st / 2 - 1)} ${r1(h * 0.9)} 0 0 1 ${r1(cx + st / 2 - 1)} ${r1(y + h)}Z" fill="${c}"/>`;
  }
  return s;
}
function wallWindow(x, y, w, h, S) { // fenetre en arc avec grille
  const r = w / 2;
  return `<path d="${archOpen(x - 8, y + h + 8, w + 16, h + 16)}" fill="${S.l}"/><path d="${archOpen(x, y + h, w, h)}" fill="#3B2216"/><path d="M${x + r} ${y + h - h + 4}V${y + h}M${x + 6} ${y + h * 0.55}H${x + w - 6}" stroke="${S.m}" stroke-width="4" opacity=".7"/><path d="M${x} ${y + h}H${x + w}" stroke="${S.dd}" stroke-width="6"/>`;
}

/**
 * Facade plateresque de l'Universite de Salamanca (1000 x 820) : retablo sculpte (medaillon, niches, portail), ailes a fenetres, et la
 * petite grenouille de pierre sur son crane (.fz-frog = groupe, .fz-glow = halo vert, a animer). opts : width, uid, frog (defaut true).
 */
export function fachadaUniversidad(opts) {
  opts = opts || {};
  const id = opts.uid || uid('fu'), W = opts.width || 1000, H = Math.round(W * 0.82), S = STN, g = (n) => `${id}-${n}`;
  let s = `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.l}"/><stop offset=".35" stop-color="${S.m}"/><stop offset="1" stop-color="${S.d}"/></linearGradient><linearGradient id="${g('p')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${S.d}"/><stop offset=".3" stop-color="${S.l}"/><stop offset=".7" stop-color="${S.l}"/><stop offset="1" stop-color="${S.d}"/></linearGradient></defs>`;
  s += scRect(0, 96, 1000, 724, `url(#${g('w')})`) + stoneBlocks(0, 96, 1000, 724, 46, 3, S.dd, 0.32);
  // couronnement : corniche + balustrade + pinacles
  s += scRect(0, 70, 1000, 26, S.l) + scRect(0, 90, 1000, 8, S.dd, 'opacity=".4"') + carvedBand(0, 74, 1000, 14, 'dia', S.d);
  for (let i = 0; i < 40; i++) s += scRect(12 + i * 25, 38, 9, 32, S.m) + scRect(8 + i * 25, 34, 17, 7, S.l);
  [60, 940].forEach((x) => { s += `<path d="M${x - 16} 34L${x} -6L${x + 16} 34Z" fill="${S.m}"/><rect x="${x - 16}" y="34" width="32" height="40" fill="${S.l}"/>`; });
  // ailes : fenetres en arc + bandeaux
  [[40, 210], [140, 210], [40, 470], [140, 470], [756, 210], [856, 210], [756, 470], [856, 470]].forEach((p) => { s += wallWindow(p[0] + 10, p[1], 52, 104, S); });
  s += scRect(0, 380, 290, 14, S.l) + scRect(710, 380, 290, 14, S.l) + scRect(0, 394, 290, 6, S.dd, 'opacity=".3"') + scRect(710, 394, 290, 6, S.dd, 'opacity=".3"');
  s += scRect(0, 640, 290, 16, S.l) + scRect(710, 640, 290, 16, S.l);
  // retablo : cadre, colonnes-candelabres, etages
  s += scRect(276, 20, 448, 704, S.dd, 'rx="6" opacity=".45"') + scRect(284, 28, 432, 696, `url(#${g('p')})`, 'rx="4"') + scRect(284, 28, 432, 696, 'none', `stroke="${S.dd}" stroke-width="5" rx="4" opacity=".6"`);
  s += carvedBand(284, 28, 432, 20, 'scal', S.m, S.l);
  [296, 660].forEach((x) => {
    s += scRect(x, 60, 44, 650, S.l, 'opacity=".55"');
    for (let i = 0; i < 11; i++) { const y = 70 + i * 58; s += `<path d="M${x + 22} ${y}q-16 6 -14 22q-8 8 -6 18h40q2 -10 -6 -18q2 -16 -14 -22Z" fill="${S.m}"/><circle cx="${x + 22}" cy="${y + 4}" r="5" fill="${S.d}"/><path d="${diamondPath(x + 22, y + 46, 9, 9)}" fill="${S.d}"/>`; }
  });
  // etage 1 : fronton + medaillon
  s += `<path d="M360 150Q360 56 500 50Q640 56 640 150Z" fill="${S.m}"/><path d="M372 150Q372 70 500 64Q628 70 628 150Z" fill="${S.l}"/>`;
  s += `<circle cx="500" cy="106" r="42" fill="${S.dd}"/><circle cx="500" cy="106" r="34" fill="${S.m}"/><path d="M488 112q0 -22 12 -22q12 0 12 22Z" fill="${S.l}"/><circle cx="500" cy="92" r="9" fill="${S.l}"/>`;
  s += carvedBand(360, 150, 280, 14, 'circ', S.d, S.l);
  // etage 2 : ecu + grand medaillon des Rois Catholiques
  s += `<path d="M470 176h60v30Q530 232 500 240Q470 232 470 206Z" fill="${S.dd}"/><path d="M478 182h44v24Q522 224 500 230Q478 224 478 206Z" fill="${S.m}"/><path d="M500 184v44M478 204h44" stroke="${S.d}" stroke-width="4"/>`;
  s += `<circle cx="500" cy="318" r="74" fill="${S.dd}"/><circle cx="500" cy="318" r="64" fill="${S.l}"/><circle cx="500" cy="318" r="52" fill="${S.m}"/>`;
  for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; s += `<circle cx="${r1(500 + Math.cos(a) * 70)}" cy="${r1(318 + Math.sin(a) * 70)}" r="4.4" fill="${S.m}"/>`; }
  s += `<circle cx="476" cy="306" r="17" fill="${S.l}"/><circle cx="524" cy="306" r="17" fill="${S.l}"/><path d="M458 350Q466 326 490 332Q494 346 490 352ZM542 350Q534 326 510 332Q506 346 510 352Z" fill="${S.l}"/><path d="M486 284l7 -14 7 14 7 -14 7 14Z" fill="${S.d}"/><path d="M468 304q8 -10 14 0M518 304q8 -10 14 0" stroke="${S.dd}" stroke-width="3" fill="none"/>`;
  s += carvedBand(360, 398, 280, 16, 'star', S.d, S.l);
  // etage 3 : trois niches avec statues
  [366, 458, 550].forEach((x, i) => {
    s += `<path d="${archOpen(x - 6, 540, 92, 134)}" fill="${S.dd}"/><path d="${archOpen(x, 540, 80, 124)}" fill="#6B4222"/>`;
    s += `<circle cx="${x + 40}" cy="486" r="12" fill="${S.l}"/><path d="M${x + 22} 540Q${x + 24} 504 ${x + 40} 502Q${x + 56} 504 ${x + 58} 540Z" fill="${S.l}"/><path d="M${x + 22} 540h36" stroke="${S.d}" stroke-width="4"/>`;
  });
  s += carvedBand(360, 550, 280, 16, 'dia', S.d, S.l);
  // etage 4 : portail a deux vantaux
  s += `<path d="${archOpen(398, 724, 204, 164)}" fill="${S.dd}"/><path d="${archOpen(408, 724, 184, 154)}" fill="#4A2A1C"/><path d="M500 574V724" stroke="#2A160E" stroke-width="6"/><g stroke="#6B4222" stroke-width="4" fill="none"><path d="${archOpen(418, 724, 76, 130)}"/><path d="${archOpen(506, 724, 76, 130)}"/></g><circle cx="486" cy="660" r="5" fill="${S.l}"/><circle cx="514" cy="660" r="5" fill="${S.l}"/>`;
  [0, 1, 2].forEach((k) => { s += scRect(372 - k * 12, 724 + k * 18 - 18, 256 + k * 24, 18, k % 2 ? S.d : S.l); });
  // sol : parvis dore
  s += scRect(0, 764, 1000, 56, S.d, 'opacity=".55"') + `<path d="M0 764H1000" stroke="${S.dd}" stroke-width="3" opacity=".5"/>`;
  for (let i = 0; i < 16; i++) s += `<path d="M${r1(500 + (i - 8) * 22)} 764L${r1(500 + (i - 8) * 120)} 820" stroke="${S.dd}" stroke-width="2" opacity=".25"/>`;
  // la grenouille sur le crane (pilastre de gauche, 3e niveau) : prop 'rana' emboite
  if (opts.frog !== false) s += prop('rana', { uid: g('fr'), width: FROG.w }).replace('<svg ', `<svg x="${FROG.x}" y="${FROG.y}" `);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 820" width="${W}" height="${H}" class="fz-svg" aria-hidden="true" style="overflow:visible">${s}</svg>`;
}

// ---------------------------------------------------------------- panorama de Salamanca, fin d'apres-midi (3200 x 1200)
function catedralFar(x, base, col) {
  return `<g fill="${col}">${scRect(x, base - 170, 420, 170)}${scRect(x + 130, base - 250, 160, 80)}<path d="M${x + 120} ${base - 250}Q${x + 210} ${base - 400} ${x + 300} ${base - 250}Z"/>${scRect(x + 200, base - 440, 20, 40)}<path d="M${x + 210} ${base - 470}v-26M${x + 196} ${base - 458}h28" stroke="${col}" stroke-width="5"/>
${scRect(x - 20, base - 330, 104, 330)}<path d="M${x - 28} ${base - 330}L${x + 32} ${base - 440}L${x + 92} ${base - 330}Z"/>${scRect(x + 336, base - 300, 104, 300)}<path d="M${x + 328} ${base - 300}L${x + 388} ${base - 410}L${x + 448} ${base - 300}Z"/></g><g fill="#fff" opacity=".18">${scRect(x + 6, base - 290, 12, 40)}${scRect(x + 356, base - 270, 12, 40)}</g>`;
}
function plazaMayorSal(x, base, wTot) { // facade doree a arcades, medaillons, balcons, pavillon a horloge
  const S = STN; let s = `<g class="sk-plazaSal">`;
  const h1 = 150, h2 = 120, h3 = 100;
  s += scRect(x, base - h1 - h2 - h3, wTot, h1 + h2 + h3, S.m) + scRect(x, base - h1 - h2 - h3, wTot, 14, S.l);
  s += stoneBlocks(x, base - h1 - h2 - h3, wTot, h1 + h2 + h3, 40, 5, S.dd, 0.22);
  const n = Math.floor(wTot / 96), st = wTot / n;
  for (let i = 0; i < n; i++) {
    const ax = x + i * st + st * 0.14, aw = st * 0.72;
    s += `<path d="${archOpen(ax, base, aw, h1 - 12)}" fill="#4B2A66"/><path d="${archOpen(ax + 6, base, aw - 12, h1 - 22)}" fill="#7A3E5E" opacity=".5"/><circle cx="${r1(ax + aw / 2)}" cy="${r1(base - h1 - 8)}" r="${r1(st * 0.13)}" fill="${S.l}" stroke="${S.d}" stroke-width="3"/>`;
    s += scRect(ax + aw * 0.2, base - h1 - h2 + 18, aw * 0.6, h2 - 38, '#4B2A66', 'rx="4"') + scRect(ax + aw * 0.1, base - h1 - h2 + 12, aw * 0.8, 8, S.l) + scRect(ax + aw * 0.08, base - h1 - 22, aw * 0.84, 10, S.dd, 'opacity=".5"');
    s += `<path d="M${r1(ax + aw * 0.1)} ${r1(base - h1 - 22)}v-14M${r1(ax + aw * 0.3)} ${r1(base - h1 - 22)}v-14M${r1(ax + aw * 0.5)} ${r1(base - h1 - 22)}v-14M${r1(ax + aw * 0.7)} ${r1(base - h1 - 22)}v-14M${r1(ax + aw * 0.9)} ${r1(base - h1 - 22)}v-14" stroke="${S.l}" stroke-width="4"/>`;
    s += scRect(ax + aw * 0.28, base - h1 - h2 - h3 + 26, aw * 0.44, h3 - 46, '#4B2A66', 'rx="3"');
    if (i % 2 === 0) s += `<path d="M${r1(ax + aw / 2)} ${r1(base - h1 - h2 - h3 - 2)}l8 -22 8 22Z" fill="${S.l}"/>`;
  }
  s += scRect(x - 6, base - 10, wTot + 12, 10, S.dd, 'opacity=".5"');
  return s + '</g>';
}
function relojPavilion(x, base) {
  const S = STN, w = 260, h = 330;
  return `<g class="sk-reloj">${scRect(x, base - h, w, h, S.m)}${scRect(x - 10, base - h, w + 20, 18, S.l)}${scRect(x + 20, base - h - 120, w - 40, 120, S.m)}<path d="M${x + 6} ${base - h - 120}L${x + w / 2} ${base - h - 220}L${x + w - 6} ${base - h - 120}Z" fill="${S.roof}"/>
<circle cx="${x + w / 2}" cy="${base - h - 64}" r="44" fill="#FFF4D8" stroke="${S.dd}" stroke-width="7"/><path d="M${x + w / 2} ${base - h - 64}v-28M${x + w / 2} ${base - h - 64}l20 10" stroke="#3B2216" stroke-width="5" stroke-linecap="round"/>
<path d="M${x + w / 2} ${base - h - 220}v-36" stroke="${S.dd}" stroke-width="5"/><path d="M${x + w / 2} ${base - h - 256}l34 10 -34 10Z" fill="#D8433F"/>
${scRect(x + 30, base - 200, 60, 200, '#4B2A66', 'rx="4"')}${scRect(x + 170, base - 200, 60, 200, '#4B2A66', 'rx="4"')}<path d="${archOpen(x + 100, base, 60, 150)}" fill="#4B2A66"/>${windowsGrid(x + 24, base - h + 40, w - 48, 120, 4, 2, 0.45, 21, '#FFE9A8', '#4B2A66')}</g>`;
}
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY } : 5 SVG de 3200x1200 pour la parallaxe (comme madridSkyline). */
export function salamancaSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ss'), g = (n) => `${id}-${n}`, W = SKY.W, H = SKY.H, hz = SKY.horizon, S = STN, rnd = rng(opts.seed || 17);
  let clouds = ''; [[300, 250, 520, 90], [980, 160, 620, 100], [1700, 330, 560, 92], [2350, 190, 640, 104], [2880, 380, 460, 80], [620, 430, 420, 72]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 70 + i * 3, 'front'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4F9BDD"/><stop offset=".3" stop-color="#8CC8EC"/><stop offset=".55" stop-color="#F5E5B8"/><stop offset=".75" stop-color="#FFCF88"/><stop offset="1" stop-color="#FF9F5A"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'sk-sky');
  const sx = opts.sunX || 2050, sy = opts.sunY || hz - 360;
  let rays = ''; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, a2 = a + Math.PI / 38; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF7C8" stop-opacity=".95"/><stop offset=".35" stop-color="#FFD76A" stop-opacity=".5"/><stop offset="1" stop-color="#FFB05A" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFF3B0" opacity=".12" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="520" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="150" fill="#FFF3C0"/><circle cx="${sx}" cy="${sy}" r="150" fill="none" stroke="#FFFFFF" stroke-width="8" opacity=".5"/>`, 'sk-sun');
  let hills = `M0 ${hz}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(hz - 70 - 50 * Math.sin(x / 400) - 28 * Math.sin(x / 150 + 1))}`; hills += `L${W} ${hz}Z`;
  let blocks = ''; for (let x = -20; x < W; x += 60) { const h = 30 + rnd() * 90; blocks += scRect(x, hz - h, 54, h + 4, '#D9A77C'); }
  const far = scSvg(W, H, `<path d="${hills}" fill="#E7B98A" opacity=".75"/><g opacity=".8">${blocks}</g><g opacity=".85" transform="translate(240 ${hz - 6})">${catedralFar(0, 0, '#D6A67A')}</g><g opacity=".7" transform="translate(2050 ${hz - 6}) scale(.8)">${catedralFar(0, 0, '#D6A67A')}</g>${scRect(0, hz - 2, W, H - hz + 2, '#D9A77C')}`, 'sk-far');
  const uni = fachadaUniversidad({ uid: g('u'), width: 900 }).replace('<svg ', `<svg x="${1500}" y="${hz - 22 - 738}" `);
  const mid = scSvg(W, H, `${scRect(0, hz - 36, W, H - hz + 36, '#B88556')}<g>${plazaMayorSal(40, hz - 22, 1280)}${relojPavilion(560, hz - 22)}</g>${uni}${plazaMayorSal(2420, hz - 22, 780)}${scRect(0, hz - 22, W, 22, '#9A6A40')}`, 'sk-mid');
  // premier plan : toits en tuiles, espadana avec sa cloche muette, nids de cigognes, lampadaires
  let roofs = ''; let x = -40;
  while (x < W) {
    const w = 170 + rnd() * 170, top = hz + 70 + (rnd() - 0.5) * 24;
    roofs += `<path d="M${r1(x)} ${H}V${r1(top + 40)}L${r1(x + 16)} ${r1(top)}H${r1(x + w - 16)}L${r1(x + w)} ${r1(top + 40)}V${H}Z" fill="${S.roof2}"/><path d="M${r1(x + 16)} ${r1(top)}H${r1(x + w - 16)}L${r1(x + w - 8)} ${r1(top + 24)}H${r1(x + 8)}Z" fill="${S.roof}"/>`;
    for (let k = 0; k < Math.floor(w / 24); k++) roofs += `<path d="M${r1(x + 10 + k * 24)} ${r1(top + 26)}v44" stroke="${S.roof2}" stroke-width="3" opacity=".6"/>`;
    roofs += windowsGrid(x + 18, top + 90, w - 36, 120, Math.max(2, Math.round(w / 70)), 2, 0.4, Math.round(x) + 5, '#FFD98A', '#4B2A3A');
    if (rnd() < 0.3) roofs += scRect(x + w * 0.6, top - 40, 22, 44, S.roof2);
    x += w - 6;
  }
  const bellGable = (gx, nest) => `<g class="sk-espadana" transform="translate(${gx} ${hz + 40})">${scRect(0, -300, 260, 340, S.m)}${stoneBlocks(0, -300, 260, 340, 34, 9, S.dd, 0.3)}${scRect(-14, -312, 288, 18, S.l)}<path d="M20 -312L130 -400L240 -312Z" fill="${S.m}"/><path d="M122 -400V-428M110 -418h24" stroke="${S.dd}" stroke-width="5"/>
<path d="${archOpen(30, -120, 80, 150)}" fill="#3B2216"/><path d="${archOpen(150, -120, 80, 150)}" fill="#3B2216"/><g class="sk-bell" data-px="70" data-py="-262"><path d="M70 -266v16" stroke="#3B2216" stroke-width="5"/><path d="M70 -252C42 -250 36 -214 28 -170Q22 -158 14 -150H126Q118 -158 112 -170C104 -214 98 -250 70 -252Z" fill="#8C8A93"/><path d="M14 -150H126V-142Q70 -132 14 -142Z" fill="#6C6A75"/><circle cx="70" cy="-136" r="8" fill="#4A4A55"/></g>
<g transform="translate(150 -266)"><path d="M0 0v110" stroke="#3B2216" stroke-width="5"/></g>${nest ? `<g transform="translate(24 -396)">${storkSvg({ rest: true, width: 120 })}</g>` : ''}</g>`;
  let lamps = ''; [200, 1180, 1900, 2640].forEach((lx) => { lamps += `<path d="M${lx} ${H}V${hz + 130}" stroke="#2A160E" stroke-width="9"/><path d="M${lx - 22} ${hz + 130}h44l-10 -34h-24Z" fill="#2A160E"/><path d="M${lx - 12} ${hz + 126}h24l-6 -24h-12Z" fill="#FFE9A8"/>`; });
  const near = scSvg(W, H, `${bellGable(380, false)}${bellGable(1880, true)}${roofs}${lamps}${scRect(0, H - 80, W, 80, '#3B1F12')}`, 'sk-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy };
}

// ---------------------------------------------------------------- patio du Colegio Fray Luis de Leon (2400 x 1200)
export const PATIO = { W: 2400, H: 1200, floor: 840 };
/** Retourne { back, front, light, W, H, bellTower: {x,y} } : patio de pierre doree, claustre a arcades, campanile (cadre de cloche VIDE), arbre, marelle, enfants figes. */
export function colegioPatio(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cp'), g = (n) => `${id}-${n}`, W = PATIO.W, H = PATIO.H, fl = PATIO.floor, S = STN, rnd = rng(opts.seed || 8);
  const kids = [[300, 930, 170, 'ball', '#7A85B8'], [520, 900, 150, 'stand', '#8D8FBF'], [760, 960, 180, 'rope', '#6F7BAE'], [1000, 905, 150, 'run', '#8D8FBF'], [1230, 960, 170, 'stand', '#7A85B8'], [1620, 920, 160, 'ball', '#6F7BAE'], [1880, 990, 190, 'stand', '#8D8FBF'], [2150, 930, 160, 'run', '#7A85B8']];
  const kidSvg = kids.map((k, i) => `<g transform="translate(${k[0] - k[2] / 2} ${k[1] - Math.round(k[2] * 1.7)})" ${opts.noKids ? 'display="none"' : ''}>${frozenKid({ width: k[2], pose: k[3], color: k[4], hair: i % 2 ? '#2F3566' : '#4A3F6E' })}</g>`).join('');
  let stones = ''; for (let i = 0; i < 12; i++) { const y = fl + Math.pow(i / 12, 1.5) * (H - fl); stones += `<path d="M0 ${r1(y)}H${W}" stroke="#8A5A30" stroke-width="${r1(2 + i * 0.5)}" opacity=".35"/>`; }
  for (let i = 0; i < 36; i++) { const x = (i / 36) * W; stones += `<path d="M${r1(x)} ${fl}L${r1(x + (x - W / 2) * 0.5)} ${H}" stroke="#8A5A30" stroke-width="2" opacity=".22"/>`; }
  // marelle (rayuela) peinte au sol
  let hop = ''; [[1060, 1010, 110], [1060, 1068, 118], [1054, 1128, 126]].forEach((r, i) => { hop += `<path d="M${r[0] - r[2] / 2} ${r[1]}h${r[2]}l${r1(r[2] * 0.06)} 54h-${r1(r[2] * 1.12)}Z" fill="none" stroke="#F5E6C8" stroke-width="5" opacity=".7"/>`; });
  const tower = `<g class="cp-tower">${scRect(1640, 70, 210, 790, S.m)}${stoneBlocks(1640, 70, 210, 790, 46, 4, S.dd, 0.3)}${scRect(1628, 60, 234, 22, S.l)}${scRect(1628, 360, 234, 16, S.l)}<path d="M1636 60L1745 -70L1854 60Z" fill="${S.roof}"/><path d="M1745 -70v-34M1730 -92h30" stroke="${S.dd}" stroke-width="6"/>
<path d="${archOpen(1690, 360, 110, 200)}" fill="#3B2216"/><path d="M1745 176v34" stroke="#6B3E26" stroke-width="7"/><path d="M1706 176H1784" stroke="#6B3E26" stroke-width="10" stroke-linecap="round"/><circle cx="1745" cy="224" r="7" fill="#6B3E26"/><path d="M1745 216v20" stroke="#6B3E26" stroke-width="5"/>${windowsGrid(1670, 420, 150, 160, 2, 3, 0.5, 7, '#FFE9A8', '#4B2A3A')}</g>`;
  const arcN = 6, aw = 230, ast = 270, ax0 = 60;
  let arcade = scRect(0, 330, 1640, 530, S.m) + stoneBlocks(0, 330, 1640, 530, 46, 6, S.dd, 0.28) + scRect(0, 330, 1640, 20, S.l) + scRect(0, 292, 1640, 40, S.roof) + scRect(0, 322, 1640, 12, S.roof2);
  for (let k = 0; k < 82; k++) arcade += `<path d="M${k * 20 + 6} 292v32" stroke="${S.roof2}" stroke-width="3" opacity=".5"/>`;
  for (let i = 0; i < arcN; i++) {
    const x = ax0 + i * ast;
    arcade += `<path d="${archOpen(x - 10, 860, aw + 20, 330)}" fill="${S.l}"/><path d="${archOpen(x, 860, aw, 320)}" fill="#4B2A3A"/><path d="${archOpen(x + 16, 860, aw - 32, 290)}" fill="#6B3E4A" opacity=".55"/><circle cx="${x + aw / 2}" cy="${860 - 340}" r="16" fill="${S.l}" stroke="${S.d}" stroke-width="4"/>`;
    arcade += scRect(x + 40, 380, aw - 80, 120, '#4B2A3A', 'rx="6"') + scRect(x + 30, 372, aw - 60, 10, S.l) + scRect(x + 30, 500, aw - 60, 12, S.d);
    arcade += `<path d="M${x + 40} 380h${aw - 80}" stroke="#2F7F5A" stroke-width="0"/><g fill="#2F7F5A"><rect x="${x + 32}" y="382" width="22" height="116"/><rect x="${x + aw - 54}" y="382" width="22" height="116"/></g>`;
  }
  const tree = `<g class="cp-tree"><ellipse cx="2080" cy="930" rx="230" ry="34" fill="#000" opacity=".2"/><path d="M2050 940Q2040 780 2060 640Q2090 600 2110 640Q2122 780 2112 940Z" fill="#6B4A32"/><path d="M2070 700Q2000 640 1960 560M2096 690Q2160 620 2210 540" stroke="#6B4A32" stroke-width="22" fill="none" stroke-linecap="round"/>${[[2080, 470, 200], [1960, 560, 150], [2220, 540, 160], [2080, 600, 190], [1880, 650, 110], [2300, 640, 110]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${['#4F9A5C', '#5FB06A', '#3F8A52', '#6BBE74', '#4F9A5C', '#3F8A52'][i]}"/>`).join('')}<g fill="#8DD58E" opacity=".6">${[[2020, 420, 70], [2150, 480, 60], [1940, 540, 46]].map((b) => `<ellipse cx="${b[0]}" cy="${b[1]}" rx="${b[2]}" ry="${b[2] * 0.5}"/>`).join('')}</g></g>`;
  const bench = `<g transform="translate(200 ${fl + 120})"><rect x="0" y="-60" width="300" height="14" rx="5" fill="#8A5230"/><rect x="0" y="-100" width="300" height="12" rx="5" fill="#8A5230"/><rect x="14" y="-46" width="14" height="50" fill="#3B2216"/><rect x="272" y="-46" width="14" height="50" fill="#3B2216"/></g>`;
  const back = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5BA7E0"/><stop offset=".6" stop-color="#BFE3F2"/><stop offset="1" stop-color="#FFE7B8"/></linearGradient><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9AE75"/><stop offset="1" stop-color="#9E7342"/></linearGradient></defs>
${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(500, 140, 520, 90, 31, 'front')}${cloudSvg(1200, 70, 420, 76, 33, 'front')}${cloudSvg(2200, 190, 480, 84, 35, 'front')}
${arcade}${tower}${scRect(0, fl - 8, W, H - fl + 8, `url(#${g('f')})`)}${stones}${hop}${scRect(0, fl - 8, W, 14, '#6B4A2A', 'opacity=".5"')}${tree}${bench}${kidSvg}`, 'cp-back');
  const front = scSvg(W, H, `<path d="M0 1130Q300 1100 640 1136V1200H0Z" fill="#6B4A32"/><g transform="translate(60 1100)">${[0, 1, 2, 3, 4].map((i) => `<path d="M${i * 54} 20Q${i * 54 - 18} -60 ${i * 54 + 12} -110Q${i * 54 + 30} -50 ${i * 54 + 34} 20Z" fill="${['#3F8A52', '#4F9A5C', '#2F7F5A'][i % 3]}"/>`).join('')}</g><g fill="#D93472">${[[90, 1040], [150, 1020], [220, 1052], [270, 1030]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="10"/>`).join('')}</g>`, 'cp-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M0 0L520 0L1320 1200L0 1200Z" opacity=".4"/><path d="M600 0L760 0L1500 1200L1180 1200Z" opacity=".3"/></g>`, 'cp-light');
  return { back, front, light, W, H, bellTower: { x: 1745, y: 176 } };
}

// ---------------------------------------------------------------- salle de classe (2400 x 1200) : tableau vert, fenetre sur la facade de l'Universite
export const AULA = { W: 2400, H: 1200, floor: 900, board: { x: 560, y: 190, w: 980, h: 390 }, win: { x: 1760, y: 170, w: 420, h: 520 } };
function desk(x, y, k, c) { // pupitre double + chaises + cartables
  const w = 300 * k, h = 20 * k;
  return `<g class="au-desk" transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="${h}" rx="${6 * k}" fill="#C98A55"/><rect x="0" y="0" width="${w}" height="${6 * k}" rx="${3 * k}" fill="#E8B27A"/><rect x="${14 * k}" y="${h}" width="${8 * k}" height="${96 * k}" fill="#3B2216"/><rect x="${w - 22 * k}" y="${h}" width="${8 * k}" height="${96 * k}" fill="#3B2216"/><rect x="${14 * k}" y="${h + 40 * k}" width="${w - 28 * k}" height="${8 * k}" fill="#3B2216" opacity=".7"/>
<g transform="translate(${44 * k} ${-66 * k})"><rect width="${70 * k}" height="${70 * k}" rx="${14 * k}" fill="${c}"/><rect x="${10 * k}" y="${34 * k}" width="${50 * k}" height="${28 * k}" rx="${8 * k}" fill="${shade(c, -0.25)}"/><path d="M${14 * k} 0v-${14 * k}h${42 * k}v${14 * k}" fill="none" stroke="#3B2216" stroke-width="${5 * k}"/></g><g transform="translate(${186 * k} ${-60 * k})"><rect width="${64 * k}" height="${64 * k}" rx="${14 * k}" fill="${shade(c, 0.1)}"/><rect x="${9 * k}" y="${30 * k}" width="${46 * k}" height="${26 * k}" rx="${8 * k}" fill="${shade(c, -0.3)}"/></g></g>`;
}
/** Retourne { back, desks, front, light, W, H, board, win, frog : { x, y } (grenouille vue par la fenetre, repere salle) }. */
export function aula(opts) {
  opts = opts || {};
  const id = opts.uid || uid('au'), g = (n) => `${id}-${n}`, W = AULA.W, H = AULA.H, fl = AULA.floor, S = STN, B = AULA.board, Wn = AULA.win;
  let planks = ''; for (let i = 0; i < 9; i++) { const y = fl + Math.pow(i / 9, 1.4) * (H - fl); planks += `<path d="M0 ${r1(y)}H${W}" stroke="#2A1208" stroke-width="${r1(2 + i * 0.5)}" opacity=".45"/>`; }
  for (let i = 0; i < 40; i++) { const x = (i / 40) * W; planks += `<path d="M${r1(x)} ${fl}L${r1(x + (x - W / 2) * 0.35)} ${H}" stroke="#2A1208" stroke-width="2" opacity=".25"/>`; }
  const fk = (Wn.w / 1000) * 2.0, fx0 = Wn.x + Wn.w / 2 - 500 * fk, fy0 = Wn.y + Wn.h * 0.52 - (FROG.y + FROG.w * 0.47) * fk;
  const fachada = fachadaUniversidad({ uid: g('fu'), width: 1000 * fk }).replace('<svg ', `<svg x="${r1(fx0)}" y="${r1(fy0)}" `);
  const frog = { x: r1(fx0 + (FROG.x + FROG.w / 2) * fk), y: r1(fy0 + (FROG.y + FROG.w * 0.47) * fk) };
  let alphabet = ''; for (let i = 0; i < 22; i++) alphabet += `<rect x="${60 + i * 24}" y="130" width="18" height="26" rx="3" fill="${['#D93472', '#19B7AA', '#FFC83D', '#C9573B'][i % 4]}"/>`;
  const back = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E3BB"/><stop offset="1" stop-color="#E7C98D"/></linearGradient><linearGradient id="${g('fl')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9703F"/><stop offset="1" stop-color="#5B3220"/></linearGradient><linearGradient id="${g('sk')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5BA7E0"/><stop offset="1" stop-color="#FFE7B8"/></linearGradient><clipPath id="${g('wc')}"><path d="${archOpen(Wn.x, Wn.y + Wn.h, Wn.w, Wn.h)}"/></clipPath></defs>
${scRect(0, 0, W, fl + 10, `url(#${g('w')})`)}${scRect(0, 0, W, 90, '#B07A44')}${scRect(0, 84, W, 12, '#E8B27A')}
${scRect(0, 640, W, fl - 640 + 10, '#4F8F78')}${scRect(0, 632, W, 14, '#F5E6C8')}${scRect(0, 646, W, 6, '#000', 'opacity=".2"')}
<g class="au-win"><path d="${archOpen(Wn.x - 22, Wn.y + Wn.h + 22, Wn.w + 44, Wn.h + 22)}" fill="#8A5230"/><g clip-path="url(#${g('wc')})">${scRect(Wn.x, Wn.y, Wn.w, Wn.h, `url(#${g('sk')})`)}${cloudSvg(Wn.x + 120, Wn.y + 100, 220, 50, 91, 'front')}${scRect(Wn.x, Wn.y + Wn.h - 90, Wn.w, 100, '#C98F45')}${fachada}</g><path d="M${Wn.x + Wn.w / 2} ${Wn.y}V${Wn.y + Wn.h}M${Wn.x} ${Wn.y + Wn.h * 0.45}H${Wn.x + Wn.w}" stroke="#8A5230" stroke-width="12"/><rect x="${Wn.x - 30}" y="${Wn.y + Wn.h}" width="${Wn.w + 60}" height="22" rx="6" fill="#C98A55"/></g>
<g class="au-board"><rect x="${B.x - 26}" y="${B.y - 26}" width="${B.w + 52}" height="${B.h + 52}" rx="12" fill="#6B3E26"/><rect x="${B.x - 14}" y="${B.y - 14}" width="${B.w + 28}" height="${B.h + 28}" rx="8" fill="#8A5230"/><rect class="au-slate" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="4" fill="#2F5D50"/><path d="M${B.x + 30} ${B.y + 60}h${B.w - 60}M${B.x + 30} ${B.y + 190}h${B.w - 60}M${B.x + 30} ${B.y + 320}h${B.w - 60}" stroke="#fff" stroke-width="2" opacity=".07"/><rect x="${B.x - 30}" y="${B.y + B.h + 14}" width="${B.w + 60}" height="16" rx="5" fill="#8A5230"/><rect x="${B.x + 90}" y="${B.y + B.h + 4}" width="46" height="10" rx="3" fill="#F5E6C8"/><rect x="${B.x + 150}" y="${B.y + B.h + 6}" width="32" height="8" rx="3" fill="#FFC83D"/></g>
<g class="au-clock"><circle cx="1650" cy="110" r="46" fill="#F5E6C8" stroke="#8A5230" stroke-width="8"/><path d="M1650 110v-26M1650 110l18 12" stroke="#3B2216" stroke-width="5" stroke-linecap="round"/></g>${alphabet}
<g class="au-mapposter"><rect x="150" y="260" width="300" height="230" rx="8" fill="#F5E6C8" stroke="#8A5230" stroke-width="8"/><path d="${(() => { const pts = [[190, 330], [260, 300], [340, 306], [410, 330], [396, 390], [340, 440], [260, 450], [210, 410]]; return smooth(pts, true); })()}" fill="#E8B15C" stroke="#B27A2E" stroke-width="4"/><circle cx="296" cy="368" r="9" fill="#D8433F"/></g>
${scRect(0, fl, W, H - fl, `url(#${g('fl')})`)}${planks}${scRect(0, fl - 2, W, 8, '#2A1208', 'opacity=".5"')}`, 'au-back');
  const desks = scSvg(W, H, `${desk(240, 905, 0.9, '#C9573B')}${desk(640, 905, 0.9, '#19B7AA')}${desk(1040, 905, 0.9, '#D93472')}${desk(1440, 905, 0.9, '#FFC83D')}${desk(1840, 905, 0.9, '#2B318A')}`, 'au-desks');
  const front = scSvg(W, H, `${desk(120, 1040, 1.25, '#19B7AA')}${desk(1700, 1050, 1.25, '#C9573B')}`, 'au-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M1760 200L2180 200L1500 1100L900 1100Z" opacity=".5"/></g>`, 'au-light');
  return { back, desks, front, light, W, H, board: B, win: Wn, frog };
}

// ---------------------------------------------------------------- decors de Sevilla (unite 3) : panorama de Triana (Giralda, Torre del Oro, fleuve, balustrade d'azulejos type Plaza de Espana),
// ruelle de Triana a la porte bleue, patio andalou (fontaine, geraniums), atelier de ceramique et sa fresque "El arbol de la familia".
// Memes conventions que 10-salamanca.js (calques separes, aucun texte, monuments publics simplifies).

const SEV = { alb: '#F2C260', alm: '#B4503A', cal: '#FFF6E4', cal2: '#EBD9B8', azul: '#2F6FD0', azul2: '#1D2160', brick: '#D98A45', brick2: '#B8672F', stone: '#F6D08A', leaf: '#3F8A52', leaf2: '#5FB06A', shut: '#2B6C8F' };

/** Giralda (centre x, pied base, echelle k) : fut de brique a panneaux losanges, corps des cloches, lanterne, dome, Giraldillo. */
function giralda(x, base, k, col) {
  const c = col || SEV.brick, c2 = col ? shade(col, -0.15) : SEV.brick2, st = col ? shade(col, 0.15) : SEV.stone, h = 520 * k;
  let s = `<g class="sv-giralda">${scRect(x - 62 * k, base - h, 124 * k, h, c)}${scRect(x - 62 * k, base - h, 18 * k, h, c2, 'opacity=".5"')}`;
  for (let i = 0; i < 9; i++) { const y = base - h + 40 * k + i * 44 * k; s += `<path d="${diamondPath(x - 20 * k, y + 18 * k, 12 * k, 18 * k)}" fill="${st}" opacity=".55"/><path d="${diamondPath(x + 24 * k, y + 18 * k, 12 * k, 18 * k)}" fill="${st}" opacity=".55"/>`; }
  for (let i = 0; i < 6; i++) { const y = base - h + 70 * k + i * 76 * k; s += `<path d="${archOpen(x - 5 * k, y + 40 * k, 10 * k, 40 * k)}" fill="#3B2216"/>`; }
  s += scRect(x - 70 * k, base - 90 * k, 140 * k, 90 * k, st, 'opacity=".4"');
  const bt = base - h - 120 * k;
  s += scRect(x - 56 * k, bt, 112 * k, 120 * k, st) + scRect(x - 62 * k, bt - 8 * k, 124 * k, 14 * k, c2) + scRect(x - 62 * k, bt + 112 * k, 124 * k, 12 * k, c2);
  [-34, 0, 34].forEach((dx) => { s += `<path d="${archOpen(x + (dx - 11) * k, bt + 108 * k, 22 * k, 84 * k)}" fill="#3B2216"/><circle cx="${r1(x + dx * k)}" cy="${r1(bt + 66 * k)}" r="${r1(5 * k)}" fill="#E3A53C"/>`; });
  s += scRect(x - 40 * k, bt - 56 * k, 80 * k, 50 * k, c) + scRect(x - 46 * k, bt - 62 * k, 92 * k, 10 * k, c2) + `<path d="${archOpen(x - 8 * k, bt - 8 * k, 16 * k, 34 * k)}" fill="#3B2216"/>`;
  s += `<path d="M${x - 30 * k} ${bt - 62 * k}Q${x} ${bt - 118 * k} ${x + 30 * k} ${bt - 62 * k}Z" fill="${st}"/><circle cx="${x}" cy="${bt - 122 * k}" r="${7 * k}" fill="#E3A53C"/><path d="M${x} ${bt - 128 * k}v-${22 * k}l${16 * k} ${6 * k}l-${16 * k} ${6 * k}" fill="#E3A53C" stroke="#E3A53C" stroke-width="${3 * k}"/>`;
  return s + '</g>';
}
function torreDelOro(x, base, k) {
  const g1 = '#E8C078', g2 = '#C99A4E';
  return `<g class="sv-torre">${scRect(x - 50 * k, base - 90 * k, 100 * k, 90 * k, g1)}${scRect(x - 50 * k, base - 90 * k, 16 * k, 90 * k, g2, 'opacity=".5"')}${scRect(x - 40 * k, base - 140 * k, 80 * k, 52 * k, g1)}${scRect(x - 30 * k, base - 200 * k, 60 * k, 62 * k, g1)}<path d="M${x - 34 * k} ${base - 200 * k}Q${x} ${base - 262 * k} ${x + 34 * k} ${base - 200 * k}Z" fill="#E3A53C"/><path d="M${x} ${base - 258 * k}v-${22 * k}" stroke="#E3A53C" stroke-width="${4 * k}"/>
<g fill="#6B4222">${[-30, -10, 12, 30].map((dx) => `<path d="${archOpen(x + (dx - 5) * k, base - 66 * k, 10 * k, 24 * k)}"/>`).join('')}<path d="${archOpen(x - 6 * k, base - 160 * k, 12 * k, 22 * k)}"/><path d="${archOpen(x - 6 * k, base - 218 * k, 12 * k, 22 * k)}"/></g>${scRect(x - 56 * k, base - 94 * k, 112 * k, 8 * k, g2)}${scRect(x - 46 * k, base - 142 * k, 92 * k, 6 * k, g2)}</g>`;
}
/** Maison blanche de Triana (facade chaux, soubassement d'azulejos, toit de tuiles, fenetres a volets bleus, balcon de fer). */
function trianaHouse(x, base, w, h, tone, seed, roof) {
  const rnd = rng(seed), c = tone || SEV.cal; let s = `<g class="sv-house">${scRect(x, base - h, w, h, c)}${scRect(x + w - 14, base - h, 14, h, '#000', 'opacity=".07"')}`;
  s += scRect(x, base - 36, w, 36, SEV.azul, 'opacity=".9"') + `<path d="M${x} ${base - 36}h${w}" stroke="${SEV.stone}" stroke-width="4"/>`;
  s += roof === 'flat' ? scRect(x - 6, base - h - 12, w + 12, 14, shade(c, -0.15)) : `<path d="M${x - 10} ${base - h}L${x + w * 0.5} ${base - h - 44}L${x + w + 10} ${base - h}Z" fill="${SEV.alm}"/><path d="M${x - 10} ${base - h}L${x + w * 0.5} ${base - h - 44}L${x + w + 10} ${base - h}Z" fill="none" stroke="#7E2F1E" stroke-width="3" opacity=".5"/>`;
  const n = Math.max(2, Math.floor(w / 62));
  for (let i = 0; i < n; i++) {
    const wx = x + (w / n) * (i + 0.5) - 14;
    s += scRect(wx, base - h + 28, 28, 46, '#3B2A4A', 'rx="4"') + scRect(wx - 8, base - h + 28, 8, 46, SEV.shut) + scRect(wx + 28, base - h + 28, 8, 46, SEV.shut) + scRect(wx - 4, base - h + 76, 36, 8, '#2A2A3A') + (rnd() < 0.5 ? `<circle cx="${wx + 6}" cy="${base - h + 70}" r="6" fill="#D93472"/><circle cx="${wx + 20}" cy="${base - h + 72}" r="6" fill="#D81E3A"/>` : '');
    if (h > 190) s += scRect(wx, base - h + 120, 28, 50, '#FFD98A', 'rx="4"') + scRect(wx - 6, base - h + 170, 40, 6, '#2A2A3A');
  }
  return s + '</g>';
}
function orangeTree(x, base, k) {
  let s = `<g class="sv-orange"><path d="M${x - 6 * k} ${base}L${x - 4 * k} ${base - 70 * k}H${x + 4 * k}L${x + 6 * k} ${base}Z" fill="#6B4A32"/>`;
  [[0, -120, 60], [-44, -96, 44], [44, -100, 46], [-18, -150, 40], [26, -146, 38]].forEach((b, i) => { s += `<circle cx="${r1(x + b[0] * k)}" cy="${r1(base + b[1] * k)}" r="${r1(b[2] * k)}" fill="${i % 2 ? SEV.leaf2 : SEV.leaf}"/>`; });
  [[-26, -110], [20, -128], [-4, -152], [34, -94], [-48, -92], [8, -100]].forEach((o) => { s += `<circle cx="${r1(x + o[0] * k)}" cy="${r1(base + o[1] * k)}" r="${r1(7 * k)}" fill="#FF9F1C"/>`; });
  return s + '</g>';
}
/** Panneau d'azulejos (bleu/jaune sur blanc) avec cadre. */
function azulejoPanel(x, y, w, h, pid, framec) {
  return `<g class="sv-panel">${scRect(x - 8, y - 8, w + 16, h + 16, framec || SEV.azul2, 'rx="6"')}${scRect(x, y, w, h, `url(#${pid})`, 'rx="3"')}${scRect(x, y, w, h, 'none', 'stroke="#fff" stroke-width="3" rx="3" opacity=".6"')}</g>`;
}
const SEV_TILE = (id, a) => azulejoPattern(id, { a: a || '#FFFDF4', b: '#2F6FD0', c: '#FFC83D', d: '#2F6FD0' });

// ---------------------------------------------------------------- panorama de Triana a l'heure doree (3200 x 1200)
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY, river : {y0, y1} } (parallaxe : far .25, mid .6, near 1). */
export function sevillaSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('sv'), g = (n) => `${id}-${n}`, W = SKY.W, H = SKY.H, rnd = rng(opts.seed || 23), bank = 700, riverBottom = 1010;
  let clouds = ''; [[300, 300, 560, 80], [1000, 190, 640, 92], [1800, 360, 520, 74], [2500, 240, 640, 90], [2950, 440, 420, 66], [640, 470, 440, 66]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 50 + i * 4, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E7FBF"/><stop offset=".25" stop-color="#6FC2D6"/><stop offset=".42" stop-color="#F7D9A0"/><stop offset=".56" stop-color="#FFB86B"/><stop offset=".66" stop-color="#FF8A47"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'sv-sky');
  const sx = opts.sunX || 1300, sy = opts.sunY || 470;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 40; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFC24A" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A47" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFE9A8" opacity=".1" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="560" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="180" fill="#FFF1B0"/>`, 'sv-sun');
  let hills = `M0 ${bank}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(bank - 90 - 50 * Math.sin(x / 330) - 24 * Math.sin(x / 120 + 1))}`; hills += `L${W} ${bank}Z`;
  const cath = (x) => `<g fill="#C9786A"><rect x="${x}" y="${bank - 190}" width="640" height="190"/><rect x="${x + 80}" y="${bank - 260}" width="480" height="80"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${x + 24 + i * 78} ${bank - 190}l12 -64 12 64Z"/>`).join('')}<path d="M${x + 250} ${bank - 260}Q${x + 320} ${bank - 380} ${x + 390} ${bank - 260}Z"/></g>`;
  const far = scSvg(W, H, `<path d="${hills}" fill="#E39A82" opacity=".6"/>${cath(900)}${giralda(1840, bank, 0.95, '#C9786A')}<g opacity=".8">${cath(2300).replace('<g fill', '<g transform="scale(1)" fill')}</g>${scRect(0, bank - 2, W, 14, '#C9786A')}`, 'sv-far');
  // milieu : berge de Triana (maisons, orangers, Torre del Oro) + fleuve et reflets
  let houses = '', x = -30; const tones = [SEV.cal, SEV.alb, SEV.cal, SEV.cal2, SEV.cal, '#F4C9B0'];
  while (x < W) { const w = 150 + rnd() * 120, h = 130 + rnd() * 120; houses += trianaHouse(x, bank, w, h, tones[Math.floor(rnd() * tones.length)], Math.round(x) + 3, rnd() < 0.3 ? 'flat' : 'gable'); if (rnd() < 0.45) houses += orangeTree(x + w + 4, bank, 0.9 + rnd() * 0.5); x += w + 18; }
  let refl = ''; for (let i = 0; i < 26; i++) { const rx = rnd() * W, ry = bank + 40 + rnd() * (riverBottom - bank - 70), rw = 90 + rnd() * 220; refl += `<path class="sv-shim" data-i="${i}" d="M${r1(rx)} ${r1(ry)}h${r1(rw)}" stroke="${i % 3 ? '#FFE9A8' : '#FFFFFF'}" stroke-width="${r1(3 + rnd() * 5)}" stroke-linecap="round" opacity="${r1(0.25 + rnd() * 0.4)}"/>`; }
  const mid = scSvg(W, H, `<defs><linearGradient id="${g('r')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A25A"/><stop offset=".5" stop-color="#2E8DB5"/><stop offset="1" stop-color="#13547A"/></linearGradient></defs>${scRect(0, bank, W, riverBottom - bank, `url(#${g('r')})`)}${scRect(0, bank, W, 22, '#B8672F')}<g transform="translate(0 0)">${houses}</g>${torreDelOro(640, bank, 1.5)}${scRect(0, bank - 2, W, 24, '#B8672F')}<g opacity=".38" transform="translate(0 ${2 * bank + 36}) scale(1 -1)">${houses}</g>${refl}`, 'sv-mid');
  // premier plan : terrasse a balustrade et panneaux d'azulejos (type Plaza de Espana), branche d'oranger en surplomb
  let balus = ''; for (let i = 0; i < 60; i++) balus += `<path d="M${r1(20 + i * 54)} 1028v-10q-14 6 -12 20q4 18 -2 34q-8 14 4 30q-2 14 12 18q14 -4 12 -18q12 -16 4 -30q-6 -16 -2 -34q2 -14 -12 -20Z" fill="#F5E6C8"/>`;
  const near = scSvg(W, H, `<defs>${SEV_TILE(g('t'))}${SEV_TILE(g('t2'), '#FFF3C0')}</defs>${scRect(0, 1010, W, 190, '#E8C078')}${balus}${scRect(0, 984, W, 36, '#F5E6C8')}${scRect(0, 984, W, 8, '#fff', 'opacity=".6"')}${scRect(0, 1130, W, 70, '#B8672F')}
${[0, 1, 2, 3, 4, 5, 6].map((i) => azulejoPanel(60 + i * 470, 1096, 380, 74, i % 2 ? g('t2') : g('t'))).join('')}${scRect(0, 1180, W, 20, '#8E4A22')}
<g transform="translate(-60 -20)"><path d="M0 60Q220 40 420 150" stroke="#6B4A32" stroke-width="26" fill="none" stroke-linecap="round"/>${[[120, 80, 74], [250, 110, 66], [340, 160, 56], [60, 130, 60], [200, 168, 54]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${i % 2 ? SEV.leaf2 : SEV.leaf}"/>`).join('')}${[[110, 120], [210, 80], [300, 130], [170, 190], [330, 200], [80, 70]].map((o) => `<circle cx="${o[0]}" cy="${o[1]}" r="17" fill="#FF9F1C"/><circle cx="${o[0] - 5}" cy="${o[1] - 5}" r="5" fill="#FFD27A"/>`).join('')}</g>
<g transform="translate(2700 -30)"><path d="M500 40Q300 30 100 160" stroke="#6B4A32" stroke-width="26" fill="none" stroke-linecap="round"/>${[[380, 90, 70], [260, 130, 62], [160, 170, 56], [440, 130, 54]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${i % 2 ? SEV.leaf2 : SEV.leaf}"/>`).join('')}${[[350, 130], [260, 90], [170, 200], [430, 80]].map((o) => `<circle cx="${o[0]}" cy="${o[1]}" r="17" fill="#FF9F1C"/>`).join('')}</g>`, 'sv-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy, river: { y0: bank, y1: riverBottom } };
}

// ---------------------------------------------------------------- ruelle de Triana (3200 x 1200) : facades chaulees, azulejos, balcons fleuris, porte bleue au fond
export const CALLEJON = { W: 3200, H: 1200, floor: 900, door: { x: 2720, y: 520, w: 190, h: 380 } };
function balcony(x, y, w, c) { // balcon en fer forge + pots de geraniums
  let s = scRect(x, y, w, 10, '#2A2A3A') + scRect(x - 8, y - 4, w + 16, 8, '#3A3A4A');
  for (let i = 0; i <= Math.floor(w / 18); i++) s += `<path d="M${r1(x + 4 + i * 18)} ${y}v-46" stroke="#2A2A3A" stroke-width="4"/>`;
  s += scRect(x, y - 50, w, 6, '#2A2A3A');
  for (let i = 0; i < Math.floor(w / 56); i++) { const px = x + 14 + i * 56; s += `<path d="M${px} ${y - 50}h34l-5 26h-24Z" fill="${SEV.shut}"/><circle cx="${px + 8}" cy="${y - 62}" r="9" fill="#D81E3A"/><circle cx="${px + 24}" cy="${y - 66}" r="9" fill="#D93472"/><circle cx="${px + 16}" cy="${y - 74}" r="8" fill="#FF6B7A"/><path d="M${px + 4} ${y - 52}q4 -10 12 -8M${px + 28} ${y - 52}q-4 -10 -10 -8" stroke="${SEV.leaf}" stroke-width="4" fill="none"/>`; }
  return s;
}
/** Retourne { back, front, light, W, H, door : { x, y, w, h } (porte bleue, repere ruelle) }. */
export function callejonTriana(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ct'), g = (n) => `${id}-${n}`, W = CALLEJON.W, H = CALLEJON.H, fl = CALLEJON.floor, D = CALLEJON.door, rnd = rng(opts.seed || 12);
  const bays = [[0, 520, SEV.cal], [520, 440, SEV.alb], [960, 480, SEV.cal], [1440, 420, '#F4C9B0'], [1860, 500, SEV.cal], [2360, 360, SEV.alb], [2720, 480, SEV.cal]];
  let wall = ''; bays.forEach((b, i) => {
    const [bx, bw, c] = b, top = 150 + (i % 3) * 14;
    wall += scRect(bx, top, bw, fl - top, c) + scRect(bx + bw - 18, top, 18, fl - top, '#000', 'opacity=".08"') + scRect(bx, top - 14, bw, 16, shade(c, -0.12)) + scRect(bx, top + 4, bw, 8, SEV.alm, 'opacity=".8"');
    wall += scRect(bx, fl - 200, bw, 200, `url(#${g('zoc')})`) + scRect(bx, fl - 206, bw, 8, SEV.azul2) + scRect(bx, fl - 198, bw, 4, SEV.stone);
    // fenetres d'etage + balcon
    const n = Math.max(2, Math.round(bw / 170));
    for (let k = 0; k < n; k++) {
      const wx = bx + (bw / n) * (k + 0.5) - 34, wy = top + 80;
      wall += scRect(wx - 12, wy - 12, 92, 214, shade(c, -0.1), 'rx="6"') + scRect(wx, wy, 68, 190, '#3B2A4A', 'rx="6"') + scRect(wx - 16, wy, 16, 190, SEV.shut) + scRect(wx + 68, wy, 16, 190, SEV.shut) + `<path d="M${wx + 34} ${wy}V${wy + 190}" stroke="#2A2A3A" stroke-width="3"/>`;
      wall += balcony(wx - 20, wy + 190, 108, c);
    }
    // grilles (rejas) au rez-de-chaussee
    if (bx !== 2720) for (let k = 0; k < Math.max(1, Math.round(bw / 260)); k++) { const wx = bx + 60 + k * 240; wall += scRect(wx, fl - 520, 90, 190, '#3B2A4A', 'rx="6"') + scRect(wx - 8, fl - 530, 106, 14, shade(c, -0.18)) + `<g stroke="#2A2A3A" stroke-width="4">${[0, 1, 2, 3, 4].map((j) => `<path d="M${wx + 10 + j * 18} ${fl - 520}v190"/>`).join('')}</g>` + scRect(wx - 6, fl - 336, 102, 8, '#2A2A3A'); }
  });
  // porte bleue (bien visible) + arc + carreau + lanterne
  wall += `<g class="ct-door"><path d="${archOpen(D.x - 26, fl, D.w + 52, D.h + 70)}" fill="${SEV.stone}"/><path d="${archOpen(D.x - 10, fl, D.w + 20, D.h + 56)}" fill="#14173F"/><path d="${archOpen(D.x, fl, D.w, D.h + 40)}" fill="#2F6FD0"/><path d="${archOpen(D.x + 14, fl - 14, D.w - 28, D.h - 12)}" fill="none" stroke="#1D4FA0" stroke-width="6"/><path d="M${D.x + D.w / 2} ${fl - D.h - 30}V${fl}" stroke="#1D4FA0" stroke-width="6"/><circle cx="${D.x + D.w / 2 - 22}" cy="${fl - 170}" r="9" fill="#E3A53C"/><circle cx="${D.x + D.w / 2 + 22}" cy="${fl - 170}" r="9" fill="#E3A53C"/><path d="M${D.x + D.w / 2 + 40} ${fl - 140}q14 -2 14 14q0 12 -14 12" fill="none" stroke="#E3A53C" stroke-width="6"/><g transform="translate(${D.x + D.w + 44} ${fl - 330})">${prop('azulejo', { uid: g('az'), width: 66, a: '#FFFDF4', c: '#2F6FD0' }).replace('<svg ', '<svg x="0" y="0" ')}</g><g transform="translate(${D.x + D.w / 2} ${fl - D.h - 110})"><path d="M0 -10v30M-16 20h32l-6 40h-20Z" fill="#2A2A3A"/><path d="M-12 24h24l-4 30h-16Z" fill="#FFE9A8"/><circle cx="0" cy="40" r="46" fill="#FFE9A8" opacity=".25"/></g></g>`;
  let cob = ''; for (let i = 0; i < 14; i++) { const y = fl + Math.pow(i / 14, 1.5) * (H - fl); cob += `<path d="M0 ${r1(y)}H${W}" stroke="#7A5A3A" stroke-width="${r1(2 + i * 0.4)}" opacity=".4"/>`; }
  for (let i = 0; i < 70; i++) { const x = (i / 70) * W; cob += `<path d="M${r1(x)} ${fl}L${r1(x + (x - W / 2) * 0.4)} ${H}" stroke="#7A5A3A" stroke-width="2" opacity=".3"/>`; }
  const back = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA8D8"/><stop offset="1" stop-color="#FFD9A0"/></linearGradient><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A064"/><stop offset="1" stop-color="#8A6638"/></linearGradient>${SEV_TILE(g('zoc'))}</defs>
${scRect(0, 0, W, 260, `url(#${g('s')})`)}${cloudSvg(600, 80, 460, 70, 41, 'front')}${cloudSvg(1900, 60, 520, 76, 43, 'front')}${cloudSvg(2900, 110, 380, 64, 45, 'front')}
${wall}${scRect(0, fl, W, H - fl, `url(#${g('f')})`)}${cob}${scRect(0, fl - 4, W, 14, '#6B4A2A', 'opacity=".5"')}`, 'ct-back');
  // avant-plan : pots fleuris, plantes, chat sur le muret
  const pots = [180, 760, 1300, 1780, 2500].map((x, i) => `<g transform="translate(${x} 1150)"><path d="M-44 0h88l-12 -90h-64Z" fill="${i % 2 ? '#C9573B' : SEV.shut}"/><rect x="-50" y="-100" width="100" height="16" rx="6" fill="${i % 2 ? '#E8795A' : '#4F9AB8'}"/>${[-34, -12, 10, 32].map((dx, j) => `<path d="M${dx} -100Q${dx - 20} -170 ${dx + 6} -214" stroke="${SEV.leaf}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="${dx + 6}" cy="${-218 - (j % 2) * 20}" r="22" fill="${['#D81E3A', '#D93472', '#FF6B7A', '#E8402A'][j]}"/>`).join('')}</g>`).join('');
  const front = scSvg(W, H, pots, 'ct-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".6"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M300 0L760 0L1500 1200L700 1200Z" opacity=".35"/><path d="M1700 0L2060 0L2800 1200L2200 1200Z" opacity=".3"/></g>`, 'ct-light');
  return { back, front, light, W, H, door: D };
}

// ---------------------------------------------------------------- patio andalou (2400 x 1200) : arcades, fontaine, geraniums, sol de mosaique
export const PATIOA = { W: 2400, H: 1200, floor: 860, fountain: { x: 1200, y: 930 } };
/** Retourne { back, front, light, W, H, fountain : { x, y } }. Eau : groupe .pa-water (traits .pa-jet) a animer. */
export function patioAndaluz(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pa'), g = (n) => `${id}-${n}`, W = PATIOA.W, H = PATIOA.H, fl = PATIOA.floor, F = PATIOA.fountain, rnd = rng(opts.seed || 14);
  let arcs = ''; const n = 7, st = 320, x0 = 80;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * st;
    arcs += `<path d="${archOpen(x, fl, st - 60, 420)}" fill="#3B2A4A" opacity=".85"/><path d="${archOpen(x + 14, fl, st - 88, 390)}" fill="#6B4A6A" opacity=".5"/>`;
    arcs += `<rect x="${x + st - 60}" y="${fl - 420 + 10}" width="60" height="${420 - 10}" fill="#F5E6C8"/><rect x="${x + st - 66}" y="${fl - 440}" width="72" height="26" rx="6" fill="#E6CE9F"/><rect x="${x + st - 68}" y="${fl - 24}" width="76" height="24" rx="6" fill="#E6CE9F"/><path d="M${x + st - 44} ${fl - 410}v400" stroke="#C9B890" stroke-width="3" opacity=".7"/>`;
  }
  let gallery = scRect(0, 290, W, 12, '#E6CE9F') + scRect(0, 300, W, 10, '#000', 'opacity=".12"');
  for (let i = 0; i < n; i++) { const x = x0 + i * st; gallery += scRect(x + 40, 150, 160, 130, '#3B2A4A', 'rx="6"') + scRect(x + 30, 140, 180, 12, '#E6CE9F') + scRect(x + 24, 150, 18, 130, SEV.shut) + scRect(x + 198, 150, 18, 130, SEV.shut) + balcony(x + 24, 298, 190, SEV.cal).replace(/y="298"/g, 'y="298"'); }
  let pots = ''; for (let i = 0; i < 14; i++) { const px = 150 + i * 160 + (i % 2) * 20, py = 410 + (i % 3) * 8; pots += `<g transform="translate(${px} ${py})"><path d="M-22 0h44l-6 40h-32Z" fill="${i % 2 ? '#2F6FD0' : '#FFFDF4'}" stroke="#2F6FD0" stroke-width="3"/><path d="M-14 0Q-34 28 -24 60M0 0Q-4 36 6 70M14 0Q34 24 26 56" stroke="${SEV.leaf}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="-12" cy="-8" r="11" fill="#D81E3A"/><circle cx="8" cy="-12" r="11" fill="#D93472"/><circle cx="22" cy="-4" r="9" fill="#FF6B7A"/></g>`; }
  // fontaine a trois vasques
  const fountain = `<g class="pa-fountain"><ellipse cx="${F.x}" cy="${F.y + 70}" rx="330" ry="70" fill="#2F6FD0"/><ellipse cx="${F.x}" cy="${F.y + 60}" rx="316" ry="58" fill="#6FC2D6"/><ellipse cx="${F.x}" cy="${F.y + 60}" rx="316" ry="58" fill="none" stroke="#FFFDF4" stroke-width="12"/><ellipse cx="${F.x}" cy="${F.y + 66}" rx="260" ry="40" fill="#fff" opacity=".18"/>
<path d="M${F.x - 40} ${F.y + 50}L${F.x - 28} ${F.y - 150}H${F.x + 28}L${F.x + 40} ${F.y + 50}Z" fill="#F5E6C8"/><ellipse cx="${F.x}" cy="${F.y - 30}" rx="130" ry="30" fill="#FFFDF4"/><ellipse cx="${F.x}" cy="${F.y - 36}" rx="112" ry="22" fill="#6FC2D6"/><path d="M${F.x - 16} ${F.y - 150}h32l-6 -120h-20Z" fill="#F5E6C8"/><ellipse cx="${F.x}" cy="${F.y - 170}" rx="74" ry="18" fill="#FFFDF4"/><ellipse cx="${F.x}" cy="${F.y - 174}" rx="62" ry="12" fill="#6FC2D6"/><path d="M${F.x - 8} ${F.y - 270}h16l-3 -64h-10Z" fill="#F5E6C8"/><circle cx="${F.x}" cy="${F.y - 346}" r="16" fill="#E3A53C"/>
<g class="pa-water" stroke="#CFF3FF" stroke-width="6" stroke-linecap="round" fill="none">${[[-30, -150], [-10, -170], [10, -170], [30, -150]].map((j, i) => `<path class="pa-jet" data-i="${i}" d="M${F.x} ${F.y - 340}Q${F.x + j[0] * 2} ${F.y - 380 + j[1] / 4} ${F.x + j[0] * 3.2} ${F.y - 180}" opacity=".85"/>`).join('')}${[-90, -60, 60, 90].map((dx, i) => `<path class="pa-jet" data-i="${i + 4}" d="M${F.x + dx} ${F.y - 40}v34" opacity=".7"/>`).join('')}</g></g>`;
  const back = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E4"/><stop offset="1" stop-color="#F0DDB8"/></linearGradient>${SEV_TILE(g('t'))}${azulejoPattern(g('fl'), { a: '#F5E6C8', b: '#2F6FD0', c: '#C9573B', d: '#FFC83D' })}<linearGradient id="${g('sk')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA8D8"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><clipPath id="${g('o')}"><rect x="760" y="-10" width="880" height="140"/></clipPath></defs>
${scRect(0, 0, W, fl + 6, `url(#${g('w')})`)}${scRect(0, 0, W, 130, `url(#${g('sk')})`)}${cloudSvg(1000, 70, 380, 56, 61, 'front')}${scRect(0, 120, W, 24, '#C9573B')}${scRect(0, 138, W, 10, '#7E2F1E', 'opacity=".4"')}
${gallery}${scRect(0, fl - 200, W, 200, `url(#${g('t')})`)}${scRect(0, fl - 210, W, 12, SEV.azul2)}${arcs}${pots}${orangeTree(2160, 480, 1.1).replace('class="sv-orange"', 'class="sv-orange pa-tree"')}
<path d="M0 ${fl}H${W}L${W + 400} ${H}H-400Z" fill="url(#${g('fl')})"/><path d="M0 ${fl}H${W}L${W + 400} ${H}H-400Z" fill="#000" opacity=".1"/>
${(() => { let l = ''; for (let i = 0; i < 12; i++) { const y = fl + Math.pow(i / 12, 1.4) * (H - fl); l += `<path d="M-400 ${r1(y)}H${W + 400}" stroke="#8A5A30" stroke-width="2" opacity=".25"/>`; } return l; })()}${fountain}`, 'pa-back');
  const leaf = (a, c, k) => `<path d="M0 0Q${52 * k} -90 0 -190Q${-52 * k} -90 0 0Z" fill="${c}" transform="rotate(${a})"/><path d="M0 -10V-170" stroke="#fff" stroke-width="3" opacity=".3" transform="rotate(${a})"/>`;
  const front = scSvg(W, H, [[120, 1100, 1.3, '#2F6FD0'], [2280, 1090, 1.4, '#C9573B']].map((p) => `<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><path d="M-70 0h140l-18 -150h-104Z" fill="${p[3]}"/><rect x="-78" y="-164" width="156" height="22" rx="8" fill="${shade(p[3], 0.2)}"/><g transform="translate(0 -160)">${[-62, -34, -8, 18, 44, 66].map((a, j) => leaf(a, [SEV.leaf, SEV.leaf2, '#2F7F5A'][j % 3], 0.9 + (j % 2) * 0.2)).join('')}</g></g>`).join(''), 'pa-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".6"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M760 130L1640 130L1900 1100L500 1100Z" opacity=".45"/></g>`, 'pa-light');
  return { back, front, light, W, H, fountain: F };
}

// ---------------------------------------------------------------- atelier de ceramique (2400 x 1200) : fresque d'azulejos "El arbol de la familia"
export const TALLER = { W: 2400, H: 1200, floor: 900, fresco: { x: 560, y: 80, w: 1280, h: 740 } };
/** Retourne { back, front, light, W, H, fresco, names : [{x,y}] (cartouches), center : {x,y} (carreau vert) }.
 *  Classes : .fr-stain (taches d'ombre sur les noms, data-i), .fr-name (cartouche), .fr-glow / .fr-feather (carreau central). */
export function tallerCeramica(opts) {
  opts = opts || {};
  const id = opts.uid || uid('tc'), g = (n) => `${id}-${n}`, W = TALLER.W, H = TALLER.H, fl = TALLER.floor, Fr = TALLER.fresco, rnd = rng(opts.seed || 33);
  const cx = Fr.x + Fr.w / 2, trunkTop = Fr.y + 330;
  // arbre : tronc, branches, feuillage
  const branches = [[-300, -210], [-180, -290], [-60, -330], [60, -330], [180, -290], [300, -210], [-390, -80], [390, -80]];
  let tree = `<path d="M${cx - 46} ${Fr.y + Fr.h - 40}Q${cx - 30} ${Fr.y + 520} ${cx - 22} ${trunkTop}H${cx + 22}Q${cx + 30} ${Fr.y + 520} ${cx + 46} ${Fr.y + Fr.h - 40}Z" fill="#8A5230" stroke="#4A2A1C" stroke-width="6"/><path d="M${cx - 10} ${Fr.y + Fr.h - 60}Q${cx - 6} ${Fr.y + 520} ${cx - 4} ${trunkTop + 20}" stroke="#C98A55" stroke-width="8" fill="none" opacity=".7"/>`;
  branches.forEach((b) => { tree += `<path d="M${cx} ${trunkTop + 50}Q${cx + b[0] * 0.35} ${trunkTop + b[1] * 0.2 - 30} ${cx + b[0]} ${trunkTop + b[1] + 120}" stroke="#4A2A1C" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${cx} ${trunkTop + 50}Q${cx + b[0] * 0.35} ${trunkTop + b[1] * 0.2 - 30} ${cx + b[0]} ${trunkTop + b[1] + 120}" stroke="#8A5230" stroke-width="20" fill="none" stroke-linecap="round"/>`; });
  const names = []; let leaves = '';
  const spots = [[-330, -160], [-190, -250], [-40, -290], [100, -290], [250, -250], [380, -160], [-440, -30], [-300, 20], [300, 20], [440, -30], [-160, -120], [180, -130], [0, -190]];
  spots.forEach((p, i) => {
    const x = cx + p[0], y = trunkTop + p[1] + 90;
    for (let k = 0; k < 7; k++) { const a = rnd() * Math.PI * 2, d = 20 + rnd() * 60; leaves += `<ellipse cx="${r1(x + Math.cos(a) * d)}" cy="${r1(y + Math.sin(a) * d * 0.7)}" rx="30" ry="15" transform="rotate(${r1(a * 57 % 180)} ${r1(x + Math.cos(a) * d)} ${r1(y + Math.sin(a) * d * 0.7)})" fill="${['#3F8A52', '#5FB06A', '#2F7F5A', '#6BBE74'][k % 4]}"/>`; }
    names.push({ x: r1(x), y: r1(y) });
  });
  let cart = ''; names.forEach((p, i) => { const sc = [[0, 7], [1, 11], [2, 9]][i % 3]; cart += `<g class="fr-name" data-i="${i}" transform="translate(${p.x} ${p.y})"><rect x="-62" y="-24" width="124" height="48" rx="10" fill="#FFFDF4" stroke="#C9573B" stroke-width="5"/><rect x="-54" y="-17" width="108" height="34" rx="6" fill="none" stroke="#FFC83D" stroke-width="2.5"/><path d="M-40 4q8 -14 14 0q6 14 12 0q8 -14 14 0q6 14 12 0q8 -14 14 0q5 10 10 0" stroke="#2B318A" stroke-width="4" fill="none" stroke-linecap="round" transform="scale(${[1, 0.8, 0.92][i % 3]} 1)"/></g>`; });
  let stains = ''; names.forEach((p, i) => { const r = rng(i * 7 + 3); const pts = []; for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2, rr = 44 + r() * 12; pts.push([p.x + Math.cos(a) * rr * 1.4, p.y + Math.sin(a) * rr * 0.78]); } stains += `<g class="fr-stain" data-i="${i}" data-px="${p.x}" data-py="${p.y}"><path d="${smooth(pts, true)}" fill="#14122A"/><path d="${smooth(pts.map((q) => [q[0] * 0.94 + p.x * 0.06 + 6, q[1] * 0.94 + p.y * 0.06 + 8]), true)}" fill="#2A2640" opacity=".7"/></g>`; });
  const center = { x: r1(cx), y: r1(trunkTop - 6) };
  const centerTile = `<g class="fr-feather" transform="translate(${center.x} ${center.y})"><ellipse class="fr-glow" cx="0" cy="0" rx="150" ry="150" fill="url(#${g('gl')})" opacity="0"/><rect x="-46" y="-46" width="92" height="92" rx="8" fill="#0E9F6E" stroke="#BFFFE3" stroke-width="5"/><rect x="-38" y="-38" width="76" height="76" rx="5" fill="none" stroke="#42E0A0" stroke-width="3"/><path d="M0 -30C26 -10 30 18 8 34Q0 38 -8 34C-26 20 -24 -10 0 -30Z" fill="#9bffd6"/><path d="M0 -26V34" stroke="#0E9F6E" stroke-width="3"/></g>`;
  // etageres de poterie, four, table
  const shelf = (x, y, w) => `<g>${scRect(x, y, w, 14, '#6B3E26')}${[0, 1, 2, 3].map((i) => { const px = x + 30 + i * (w - 60) / 3.2; return i % 2 ? `<path d="M${px} ${y}v-12q-26 -6 -22 -40q-4 -30 22 -30t22 30q4 34 -22 40v12Z" fill="${['#2F6FD0', '#C9573B', '#19B7AA'][i % 3]}" transform="translate(${r1(-0)} 0)"/>` : `<ellipse cx="${px}" cy="${y - 38}" rx="38" ry="38" fill="#FFFDF4" stroke="#2F6FD0" stroke-width="5"/><ellipse cx="${px}" cy="${y - 38}" rx="22" ry="22" fill="none" stroke="#C9573B" stroke-width="4"/>`; }).join('')}</g>`;
  const kiln = `<g class="tc-kiln"><path d="M1980 ${fl}V560Q1980 400 2140 400Q2300 400 2300 560V${fl}Z" fill="#B4503A"/><path d="M1980 ${fl}V560Q1980 400 2140 400Q2300 400 2300 560V${fl}Z" fill="none" stroke="#7E2F1E" stroke-width="6"/>${stoneBlocks(1990, 420, 300, 460, 40, 7, '#7E2F1E', 0.45)}<path d="${archOpen(2070, fl - 40, 140, 190)}" fill="#14100A"/><path d="${archOpen(2084, fl - 40, 112, 150)}" fill="#FF8A2F" opacity=".9"/><path d="${archOpen(2104, fl - 40, 72, 110)}" fill="#FFD76A" opacity=".9"/><rect x="2120" y="340" width="40" height="80" fill="#8E3A2B"/></g>`;
  const back = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFD9B0"/><stop offset="1" stop-color="#DDBE8C"/></linearGradient><linearGradient id="${g('fl')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4503A"/><stop offset="1" stop-color="#6E2A1E"/></linearGradient><radialGradient id="${g('gl')}"><stop offset="0" stop-color="#9bffd6" stop-opacity=".95"/><stop offset=".5" stop-color="#42E0A0" stop-opacity=".4"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient>${SEV_TILE(g('t'))}${SEV_TILE(g('t2'), '#FFF1CC')}</defs>
${scRect(0, 0, W, fl + 8, `url(#${g('w')})`)}${stoneBlocks(0, 0, W, fl, 70, 2, '#8A5A30', 0.1)}${scRect(0, 0, W, 60, '#6B3E26')}${scRect(0, 54, W, 10, '#C98A55')}
${[0, 1, 2, 3].map((i) => scRect(i * 640 + 180, 0, 40, 64, '#4A2A1C')).join('')}
${shelf(60, 330, 400)}${shelf(60, 560, 400)}${shelf(60, 790, 400)}
<g class="fr-fresco">${scRect(Fr.x - 26, Fr.y - 26, Fr.w + 52, Fr.h + 52, '#8A5230', 'rx="14"')}${scRect(Fr.x - 12, Fr.y - 12, Fr.w + 24, Fr.h + 24, '#2B318A', 'rx="8"')}${scRect(Fr.x, Fr.y, Fr.w, Fr.h, `url(#${g('t')})`)}${scRect(Fr.x, Fr.y, Fr.w, Fr.h, '#FFFDF4', 'opacity=".55"')}${scRect(Fr.x + 20, Fr.y + 20, Fr.w - 40, Fr.h - 40, 'none', 'stroke="#FFC83D" stroke-width="5" rx="6"')}
<g class="fr-tree">${tree}${leaves}</g>${cart}${stains}${centerTile}</g>
${kiln}${scRect(0, fl, W, H - fl, `url(#${g('fl')})`)}${(() => { let l = ''; for (let i = 0; i < 9; i++) { const y = fl + Math.pow(i / 9, 1.4) * (H - fl); l += `<path d="M0 ${r1(y)}H${W}" stroke="#4A1A10" stroke-width="2" opacity=".4"/>`; } for (let i = 0; i < 28; i++) { const x = (i / 28) * W; l += `<path d="M${r1(x)} ${fl}L${r1(x + (x - W / 2) * 0.4)} ${H}" stroke="#4A1A10" stroke-width="2" opacity=".3"/>`; } return l; })()}${scRect(0, fl - 2, W, 8, '#3B1F12', 'opacity=".5"')}`, 'tc-back');
  const front = scSvg(W, H, `<g transform="translate(420 1010)">${scRect(0, 0, 640, 26, '#8A5230', 'rx="8"')}${scRect(30, 26, 22, 160, '#4A2A1C')}${scRect(588, 26, 22, 160, '#4A2A1C')}${[0, 1, 2, 3].map((i) => `<rect x="${40 + i * 140}" y="-22" width="120" height="22" rx="4" fill="${['#FFFDF4', '#FFC83D', '#2F6FD0', '#C9573B'][i]}" stroke="#2B318A" stroke-width="3"/>`).join('')}<path d="M520 -18l70 -30" stroke="#4A2A1C" stroke-width="7" stroke-linecap="round"/><circle cx="598" cy="-52" r="9" fill="#C9573B"/></g>${[[1800, 1100], [2260, 1120]].map((p) => `<g transform="translate(${p[0]} ${p[1]})"><path d="M-50 0h100l-12 -120h-76Z" fill="#C9573B"/><rect x="-56" y="-132" width="112" height="18" rx="8" fill="#E8795A"/></g>`).join('')}`, 'tc-front');
  const light = scSvg(W, H, `<defs><radialGradient id="${g('lg')}"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient></defs><ellipse cx="2140" cy="760" rx="520" ry="420" fill="url(#${g('lg')})" opacity=".7"/><g class="ac-beams"><path d="M1000 0L1400 0L1500 900L700 900Z" fill="#FFE9A8" opacity=".12"/></g>`, 'tc-light');
  return { back, front, light, W, H, fresco: Fr, names, center };
}
