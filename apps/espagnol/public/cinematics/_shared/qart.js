(function(){
// GENERE par scripts/cinematics.mjs (art) depuis art/core/src/*.js - ne pas editer.
// QArt - kit graphique "La Leyenda del Quetzal" (SOURCE UNIQUE, parties dans art/core/src/*.js).
// Fonctions pures : chaque builder renvoie une chaine SVG. `node scripts/cinematics.mjs art` concatene les parties en :
//   - apps/espagnol/src/art/core/qart.js                 (ESM, importe par les composants Svelte)
//   - apps/espagnol/public/cinematics/_shared/qart.js    (IIFE -> window.QArt, utilise par les compositions HyperFrames)
// Regles : pas d'import, `export` uniquement en debut de ligne, pas de Math.random / Date.now (determinisme HyperFrames).
// Tout SVG prend un `uid` (ids de gradients/clipPaths uniques). Parties animables : classes `q-*` (quetzal), `s-*` (sombra), `m-*` (carte).

const PAL = {
  nuit: '#14173F', nuit2: '#1D2160', nuit3: '#2B318A', encre: '#0B0D2A',
  terracotta: '#C9573B', terracotta2: '#9E3D29', sol: '#FFC83D', sol2: '#FF9F1C',
  turquesa: '#19B7AA', turquesa2: '#0E7F82', magenta: '#D93472', magenta2: '#8F1D4E',
  quetzal: '#0E9F6E', quetzal2: '#066A4A', quetzalClaro: '#42E0A0', rojo: '#D81E3A',
  papel: '#F5E6C8', papel2: '#E6CE9F', carbon: '#201A2B', niebla: '#8F93C7',
};
const RARITY = {
  comun: { c: '#9AA3C7', glow: 0, label: 'común' },
  raro: { c: '#35B8FF', glow: 1, label: 'raro' },
  epico: { c: '#C65BFF', glow: 2, label: 'épico' },
  legendario: { c: '#FFC83D', glow: 3, label: 'legendario' },
};

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
let _uid = 0;
function uid(p) { _uid += 1; return (p || 'q') + _uid; }
function rng(seed) { // mulberry32 : deterministe
  let a = seed >>> 0;
  return function () { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hex2rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgb2hex(r, g, b) { return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
function shade(c, amt) { return amt >= 0 ? mix(c, '#ffffff', amt) : mix(c, '#000000', -amt); }
function r1(n) { return Math.round(n * 10) / 10; }
/** Chemin lisse (Catmull-Rom -> Bezier) passant par les points [[x,y],...]. */
function smooth(pts, closed) {
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
function azulejoPattern(id, opts) {
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
function azulejoDataUri(opts, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size || 56}" height="${size || 56}" viewBox="0 0 100 100">${azulejoPattern('t', opts).replace(/<\/?pattern[^>]*>/g, '')}</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/**
 * Guirlande de papel picado. Chaque fanion = <g class="m-flag"> (pivot en haut au centre -> balancer avec GSAP rotation, svgOrigin).
 * opts : w, h (hauteur d'un fanion), n, colors[], seed, uid, sag (fleche de la corde, px).
 */
function papelPicado(opts) {
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
const FRIEZE_PAL = {
  madrid: { a: '#1D2160', b: '#2F6FD0', c: '#FFC83D', d: '#F5E6C8', band: '#F5E6C8', edge: '#14173F', pen: ['#F5E6C8', '#C9573B', '#FFC83D', '#2B318A'] },
  salamanca: { a: '#7A3A24', b: '#E9B25A', c: '#F5E6C8', d: '#F5E6C8', band: '#EBD7A8', edge: '#4A2417', pen: ['#F5E6C8', '#C9573B', '#E9B25A', '#7A3A24'] },
  valencia: { a: '#F5E6C8', b: '#0E7F82', c: '#FF9F1C', d: '#2F6FD0', band: '#FFFDF4', edge: '#0E5A6B', pen: ['#FFFDF4', '#19B7AA', '#FF9F1C', '#2F8FD0'] },
  madridnoche: { a: '#5A1424', b: '#D93A4A', c: '#FFC83D', d: '#F5E6C8', band: '#F5E6C8', edge: '#2A0A12', pen: ['#F5E6C8', '#D81E3A', '#FFC83D', '#1F7F6A'] },
  sevilla: { a: '#0E7F82', b: '#2B318A', c: '#FFC83D', d: '#FFFFFF', band: '#FFFDF4', edge: '#14173F', pen: ['#FFFDF4', '#2B318A', '#FFC83D', '#19B7AA'] },
};
/**
 * Frise espagnole : bandeau de carreaux d'azulejos (cenefa) a bord festonne d'arcs, + corde de fanions sobres (banderines).
 * opts : w, region ('madrid'|'salamanca'|'sevilla'), n (fanions), seed, uid, pennants (defaut true). Chaque fanion = <g class="m-flag"> (pivot haut-centre).
 */
function azulejoFrieze(opts) {
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
/** Frise argentine (filete porteno) : bandeau sombre aux volutes rouges / or / bleues / vertes, bord festonne, medaillons de filete suspendus (.m-flag, pivot haut-centre). opts : w, n, seed. */
const FILETE_PAL = { bg: '#12304A', red: '#D8352A', gold: '#F4B63A', blue: '#3A9AE0', green: '#1E9E6A', cream: '#FFF1CC', edge: '#0B1B2B' };
function fileteFrieze(opts) {
  opts = opts || {};
  const W = opts.w || 1920, P = FILETE_PAL, BH = 84, ARC = 24, n = opts.n || 16, rnd = rng(opts.seed || 5);
  const nM = 16, st = W / nM, cy = 44;
  let motifs = '';
  for (let i = 0; i < nM; i++) {
    const cx = st * (i + 0.5), a = i % 2 ? P.red : P.gold, b = i % 2 ? P.gold : P.blue;
    const scroll = (s) => `<path d="M${r1(cx + s * 12)} ${cy}Q${r1(cx + s * 40)} ${cy - 28} ${r1(cx + s * 66)} ${cy - 8}Q${r1(cx + s * 82)} ${cy + 10} ${r1(cx + s * 62)} ${cy + 20}" stroke="${a}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${r1(cx + s * 30)} ${cy - 14}Q${r1(cx + s * 44)} ${cy + 10} ${r1(cx + s * 24)} ${cy + 22}" stroke="${b}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${r1(cx + s * 62)} ${cy + 20}q${s * 10} 6 ${s * 16} -4q${-s * 4} -12 ${-s * 16} 4Z" fill="${P.green}"/>`;
    const dots = [0, 1, 2, 3].map((k) => `<circle cx="${r1(cx + Math.cos(k * 1.571) * 24)}" cy="${r1(cy + Math.sin(k * 1.571) * 24)}" r="3" fill="${P.cream}"/>`).join('');
    motifs += scroll(1) + scroll(-1) + `<circle cx="${r1(cx)}" cy="${cy}" r="17" fill="${P.cream}"/><circle cx="${r1(cx)}" cy="${cy}" r="12" fill="${a}"/><circle cx="${r1(cx)}" cy="${cy}" r="5" fill="${P.gold}"/>${dots}`;
  }
  let arcs = '';
  const nArc = Math.round(W / (ARC * 2)), aw = W / nArc;
  for (let i = 0; i < nArc; i++) {
    const x0 = aw * i, x1 = aw * (i + 1), cx = (x0 + x1) / 2;
    arcs += `<path d="M${r1(x0)} ${BH - 2}H${r1(x1)}Q${r1(x1)} ${BH + ARC} ${r1(cx)} ${BH + ARC}Q${r1(x0)} ${BH + ARC} ${r1(x0)} ${BH - 2}Z" fill="${i % 2 ? P.red : P.blue}"/><circle cx="${r1(cx)}" cy="${BH + 4}" r="4.5" fill="${P.gold}"/>`;
  }
  const ry = BH + ARC + 4, sag = 14, step = W / n, ropeY = (x) => ry + sag * Math.sin((Math.PI * x) / W);
  let rope = `M0 ${r1(ropeY(0))}`;
  for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
  let pen = '';
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), y0 = ropeY(cx), c = [P.red, P.gold, P.blue, P.green][i % 4], hh = 58 * (0.92 + rnd() * 0.16), fw = step * 0.5;
    pen += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="M${r1(cx - fw / 2)} ${r1(y0)}H${r1(cx + fw / 2)}V${r1(y0 + hh * 0.55)}Q${r1(cx + fw / 2)} ${r1(y0 + hh * 0.9)} ${r1(cx)} ${r1(y0 + hh)}Q${r1(cx - fw / 2)} ${r1(y0 + hh * 0.9)} ${r1(cx - fw / 2)} ${r1(y0 + hh * 0.55)}Z" fill="${c}" stroke="${P.cream}" stroke-width="3"/><circle cx="${r1(cx)}" cy="${r1(y0 + hh * 0.42)}" r="${r1(fw * 0.17)}" fill="${P.cream}"/><circle cx="${r1(cx)}" cy="${r1(y0 + hh * 0.42)}" r="${r1(fw * 0.08)}" fill="${c}"/></g>`;
  }
  const H = BH + ARC + 4 + 14 + 76;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="q-frieze q-filete" aria-hidden="true"><g opacity=".28" transform="translate(0 7)"><rect width="${W}" height="${BH}" fill="#000"/></g><rect width="${W}" height="${BH}" fill="${P.bg}"/><rect y="0" width="${W}" height="8" fill="${P.edge}"/><rect y="8" width="${W}" height="3" fill="${P.gold}"/><rect y="${BH - 14}" width="${W}" height="14" fill="${P.edge}"/><rect y="${BH - 10}" width="${W}" height="3" fill="${P.red}"/>${motifs}${arcs}<path d="${rope}" stroke="${P.edge}" stroke-width="3" fill="none" opacity=".75"/>${pen}</svg>`;
}
/** Motif de bordure par region : 'mexico' -> papel picado ; sinon (Espagne : 'madrid' | 'salamanca' | 'sevilla' | 'espana') -> frise d'azulejos + fanions. */
function bunting(region, opts) {
  opts = opts || {};
  if (region === 'mexico' || region === 'oaxaca' || region === 'cdmx' || region === 'muertos') return papelPicado(opts);
  if (region === 'argentina' || region === 'baires') return fileteFrieze(opts);
  if (region === 'colombia' || region === 'bogota') return colombiaFrieze(opts);
  if (region === 'andes' || region === 'cusco') return andesFrieze(opts);
  return azulejoFrieze({ ...opts, region: region === 'espana' ? 'madrid' : region });
}

/** Bruit de papier (filtre feTurbulence, statique) a inserer dans un <defs>. Usage : <rect filter="url(#id)" .../> */
function paperGrainFilter(id) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .2  0 0 0 .22 0"/></filter>`;
}

/** Ornement de coin (carreau d'azulejo en quart de cercle + fleur). Dessine le coin haut-gauche dans une boite size x size. */
function cornerOrnament(size, opts) {
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
const QUETZAL_PIVOT = { wing: '272 266', wingF: '286 262', head: '318 222', tail: '262 410', jaw: '366 182', rig: '300 330' };

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
function quetzal(opts) {
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
const QUETZAL_POSES = {
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
function quetzalSet(root, name, g) {
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
function quetzalPoseTo(tl, root, name, at, dur, ease) {
  const p = QUETZAL_POSES[name] || QUETZAL_POSES.perched, e = ease || 'power3.inOut';
  const T = (sel, vars) => { const els = qa(root, sel); if (els.length) tl.to(els, Object.assign({ duration: dur, ease: e }, vars), at); };
  T('.q-rig', { rotation: p.rot, x: p.x, y: p.y, svgOrigin: QUETZAL_PIVOT.rig });
  T('.q-head', { rotation: p.head, svgOrigin: QUETZAL_PIVOT.head });
  T('.q-wingN .q-wing-j', { rotation: p.wing, svgOrigin: QUETZAL_PIVOT.wing });
  T('.q-wingF .q-wing-j', { rotation: p.wingF, svgOrigin: QUETZAL_PIVOT.wingF });
  T('.q-lid', { opacity: p.lid ? 1 : 0, y: -18 + 18 * p.lid });
}
/** Battements d'ailes : `count` cycles de `period` s a partir de `at`. Descente puissante, remontee souple ; le corps ondule avec. */
function quetzalFlap(tl, root, at, count, period, amp) {
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
function quetzalTalk(tl, root, at, dur, n) {
  const jaw = qa(root, '.q-jaw'), step = dur / n;
  for (let i = 0; i < n; i++) {
    tl.to(jaw, { rotation: 22 + (i % 3) * 6, svgOrigin: QUETZAL_PIVOT.jaw, duration: step * 0.4, ease: 'power2.out' }, at + i * step);
    tl.to(jaw, { rotation: 0, svgOrigin: QUETZAL_PIVOT.jaw, duration: step * 0.45, ease: 'power2.in' }, at + i * step + step * 0.45);
  }
}
function quetzalBlink(tl, root, at) {
  const eye = qa(root, '.q-eye');
  tl.to(eye, { scaleY: 0.08, svgOrigin: '342 160', duration: 0.07, ease: 'power2.in' }, at);
  tl.to(eye, { scaleY: 1, svgOrigin: '342 160', duration: 0.12, ease: 'power2.out' }, at + 0.09);
}
/** Ondulation des plumes de queue (decalee plume par plume), un aller-retour. */
function quetzalSway(tl, root, at, dur, amp) {
  const a = amp == null ? 1 : amp;
  qa(root, '.q-tail').forEach((t, i) => {
    tl.to(t, { rotation: (i % 2 ? -1 : 1) * 4.5 * a, svgOrigin: tailOrigin(t), duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + i * 0.12);
  });
}
/** Les plumes reviennent : queue (4 plumes en cascade elastique), huppe, couleur. Duree ~ 2.2 s. */
function quetzalRegrow(tl, root, at) {
  const tails = qa(root, '.q-tail');
  TAIL_ORDER.forEach((idx, k) => {
    const t = tails[idx]; if (!t) return;
    tl.to(t, { scale: 1, svgOrigin: tailOrigin(t), duration: 0.9, ease: 'elastic.out(1,0.55)' }, at + 0.15 + k * 0.28);
  });
  tl.to(qa(root, '.q-crest'), { scale: 1, svgOrigin: '300 150', duration: 0.8, ease: 'back.out(2.2)' }, at + 0.9);
  tl.to(qa(root, '.q-dull, .q-dull-h'), { opacity: 0, duration: 1.2, ease: 'power2.out' }, at + 0.1);
  tl.to(qa(root, '.q-red'), { opacity: 1, duration: 1.2, ease: 'power2.out' }, at + 0.1);
}

// ---------------------------------------------------------------- frises textiles des unites 8 (Colombie) et 10 (Andes).
// Meme contrat que azulejoFrieze / fileteFrieze : opts { w, n (fanions), seed, uid } -> <svg class="q-frieze"> ; chaque fanion = <g class="m-flag" data-px data-py> (pivot haut-centre).
// Colombie : bande de tissage geometrique de mochila (losanges et zigzags rouge / jaune / bleu / vert), franges, pompons.
// Andes : bande d'aguayo (rayures vives, croix andines en escalier, zigzags), bord frange, bordes (pompons) suspendus.
const COLOMBIA_PAL = { bg: '#1B2A5C', red: '#D8283A', yellow: '#FCC919', blue: '#2F6FD0', green: '#1FA26B', cream: '#FFF1CC', edge: '#0E1634', pen: ['#FCC919', '#2F6FD0', '#D8283A', '#1FA26B'] };
const ANDES_PAL = { bg: '#3B1F5A', magenta: '#D93472', orange: '#F59F00', turq: '#12A594', cream: '#FFF1CC', red: '#C9402E', edge: '#1F0F33', pen: ['#D93472', '#F59F00', '#12A594', '#C9402E'] };

/** Losange creux (motif de mochila) centre en (cx, cy), demi-diagonale r. */
function andesDiamond(cx, cy, r, c1, c2) {
  return `<path d="M${r1(cx)} ${r1(cy - r)}L${r1(cx + r)} ${r1(cy)}L${r1(cx)} ${r1(cy + r)}L${r1(cx - r)} ${r1(cy)}Z" fill="${c1}"/><path d="M${r1(cx)} ${r1(cy - r * 0.55)}L${r1(cx + r * 0.55)} ${r1(cy)}L${r1(cx)} ${r1(cy + r * 0.55)}L${r1(cx - r * 0.55)} ${r1(cy)}Z" fill="${c2}"/>`;
}
/** Croix andine (chakana) en escalier, centre (cx, cy), cote total s. */
function chakanaPath(cx, cy, s) {
  const u = s / 6, p = [[-1, -3], [1, -3], [1, -2], [2, -2], [2, -1], [3, -1], [3, 1], [2, 1], [2, 2], [1, 2], [1, 3], [-1, 3], [-1, 2], [-2, 2], [-2, 1], [-3, 1], [-3, -1], [-2, -1], [-2, -2], [-1, -2]];
  return 'M' + p.map((q) => r1(cx + q[0] * u) + ' ' + r1(cy + q[1] * u)).join('L') + 'Z';
}

function colombiaFrieze(opts) {
  opts = opts || {};
  const W = opts.w || 1920, P = COLOMBIA_PAL, BH = 84, n = opts.n || 16, rnd = rng(opts.seed || 5), nM = 24, st = W / nM;
  let motifs = '', fringe = '';
  for (let i = 0; i < nM; i++) {
    const cx = st * (i + 0.5);
    motifs += andesDiamond(cx, 30, 15, i % 2 ? P.yellow : P.red, i % 2 ? P.red : P.yellow);
    motifs += `<path d="M${r1(cx - st / 2)} 62L${r1(cx)} 54L${r1(cx + st / 2)} 62" stroke="${i % 3 === 0 ? P.green : P.cream}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
    fringe += `<rect x="${r1(cx - 4)}" y="${BH - 2}" width="8" height="${20 + (i % 3) * 5}" rx="4" fill="${[P.red, P.yellow, P.blue][i % 3]}"/>`;
  }
  const ry = BH + 30, sag = 14, step = W / n, ropeY = (x) => ry + sag * Math.sin((Math.PI * x) / W);
  let rope = `M0 ${r1(ropeY(0))}`;
  for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
  let pen = '';
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), y0 = ropeY(cx), c = P.pen[i % 4], hh = 46 * (0.92 + rnd() * 0.16);
    pen += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="M${r1(cx)} ${r1(y0)}V${r1(y0 + 14)}" stroke="${P.edge}" stroke-width="3"/><circle cx="${r1(cx)}" cy="${r1(y0 + 14 + hh * 0.35)}" r="${r1(hh * 0.36)}" fill="${c}"/><path d="M${r1(cx - 6)} ${r1(y0 + 14 + hh * 0.2)}Q${r1(cx)} ${r1(y0 + 14 + hh * 0.5)} ${r1(cx + 6)} ${r1(y0 + 14 + hh * 0.2)}" stroke="#fff" stroke-width="3" fill="none" opacity=".45"/></g>`;
  }
  const H = BH + 30 + 14 + 78;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="q-frieze q-colombia" aria-hidden="true"><g opacity=".28" transform="translate(0 7)"><rect width="${W}" height="${BH}" fill="#000"/></g><rect width="${W}" height="${BH}" fill="${P.bg}"/>${motifs}<rect y="0" width="${W}" height="8" fill="${P.edge}"/><rect y="${BH - 12}" width="${W}" height="12" fill="${P.edge}"/><rect y="${BH - 9}" width="${W}" height="3" fill="${P.yellow}"/><rect y="8" width="${W}" height="3" fill="${P.yellow}"/>${fringe}<path d="${rope}" stroke="${P.edge}" stroke-width="3" fill="none" opacity=".75"/>${pen}</svg>`;
}

function andesFrieze(opts) {
  opts = opts || {};
  const W = opts.w || 1920, P = ANDES_PAL, BH = 84, n = opts.n || 16, rnd = rng(opts.seed || 5), nM = 16, st = W / nM;
  let motifs = '', fringe = '';
  const stripes = [P.magenta, P.orange, P.turq, P.cream];
  for (let i = 0; i < nM; i++) {
    const cx = st * (i + 0.5);
    motifs += `<path d="${chakanaPath(cx, 42, 46)}" fill="${stripes[i % 4]}"/><circle cx="${r1(cx)}" cy="42" r="5" fill="${P.bg}"/>`;
    motifs += `<path d="M${r1(cx - st / 2)} 20L${r1(cx - st / 4)} 12L${r1(cx)} 20L${r1(cx + st / 4)} 12L${r1(cx + st / 2)} 20" stroke="${stripes[(i + 1) % 4]}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
    motifs += `<path d="M${r1(cx - st / 2)} 66L${r1(cx - st / 4)} 74L${r1(cx)} 66L${r1(cx + st / 4)} 74L${r1(cx + st / 2)} 66" stroke="${stripes[(i + 2) % 4]}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
  }
  for (let i = 0; i < nM * 2; i++) {
    const cx = (W / (nM * 2)) * (i + 0.5);
    fringe += `<rect x="${r1(cx - 5)}" y="${BH - 2}" width="10" height="${22 + (i % 3) * 6}" rx="5" fill="${stripes[i % 4]}"/>`;
  }
  const ry = BH + 32, sag = 14, step = W / n, ropeY = (x) => ry + sag * Math.sin((Math.PI * x) / W);
  let rope = `M0 ${r1(ropeY(0))}`;
  for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
  let pen = '';
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), y0 = ropeY(cx), c = P.pen[i % 4], hh = 50 * (0.92 + rnd() * 0.16);
    pen += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="M${r1(cx)} ${r1(y0)}V${r1(y0 + 10)}" stroke="${P.edge}" stroke-width="3"/><circle cx="${r1(cx)}" cy="${r1(y0 + 10 + hh * 0.3)}" r="${r1(hh * 0.28)}" fill="${c}"/><path d="M${r1(cx - hh * 0.2)} ${r1(y0 + 10 + hh * 0.5)}L${r1(cx - hh * 0.26)} ${r1(y0 + 10 + hh)}M${r1(cx)} ${r1(y0 + 10 + hh * 0.56)}L${r1(cx)} ${r1(y0 + 10 + hh * 1.05)}M${r1(cx + hh * 0.2)} ${r1(y0 + 10 + hh * 0.5)}L${r1(cx + hh * 0.26)} ${r1(y0 + 10 + hh)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/></g>`;
  }
  const H = BH + 32 + 10 + 80;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="q-frieze q-andes" aria-hidden="true"><g opacity=".28" transform="translate(0 7)"><rect width="${W}" height="${BH}" fill="#000"/></g><rect width="${W}" height="${BH}" fill="${P.bg}"/>${motifs}<rect y="0" width="${W}" height="8" fill="${P.edge}"/><rect y="${BH - 12}" width="${W}" height="12" fill="${P.edge}"/><rect y="${BH - 9}" width="${W}" height="3" fill="${P.orange}"/><rect y="8" width="${W}" height="3" fill="${P.orange}"/>${fringe}<path d="${rope}" stroke="${P.edge}" stroke-width="3" fill="none" opacity=".75"/>${pen}</svg>`;
}

// ---------------------------------------------------------------- La Sombra del Silencio - viewBox 0 0 500 660
// Silhouette de fumee encapuchonnee, vide sans visage, deux yeux qui brillent. Parties : s-wisp-N (volutes), s-body, s-void, s-eye (x2), s-arm.
const SOMBRA_PIVOT = { rig: '250 330', eyeL: '226 142', eyeR: '276 142' };

function sombra(opts) {
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
function sombraFloat(tl, root, at, cycles, period) {
  const body = sa(root, '.s-bodyg');
  tl.to(body, { y: -14, duration: period / 2, ease: 'sine.inOut', yoyo: true, repeat: cycles * 2 - 1 }, at);
  sa(root, '.s-wisp').forEach((w, i) => {
    tl.to(w, { rotation: (i % 2 ? -1 : 1) * 7, svgOrigin: w.dataset.px + ' ' + w.dataset.py, duration: period * 0.7, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.round(cycles * 2 * 0.7) * 2 - 1) }, at + i * 0.15);
  });
}
/** Yeux : s'allument (ouverture) ou se plissent. */
function sombraEyes(tl, root, at, mode, dur) {
  const eyes = sa(root, '.s-eye'), d = dur || 0.3;
  if (mode === 'open') tl.fromTo(eyes, { scaleY: 0.05, opacity: 0 }, { scaleY: 1, opacity: 1, svgOrigin: '250 144', duration: d, ease: 'back.out(3)' }, at);
  else if (mode === 'narrow') tl.to(eyes, { scaleY: 0.35, svgOrigin: '250 144', duration: d, ease: 'power2.inOut' }, at);
  else tl.to(eyes, { scaleY: 1, svgOrigin: '250 144', duration: d, ease: 'power2.out' }, at);
}
/** Dissolution : le corps se detache vers le haut en cendres (la poussiere doree est a la charge de la scene : dustField). */
function sombraDissolve(tl, root, at, dur) {
  const r = sEl(root);
  tl.to(sa(r, '.s-eye'), { opacity: 0, scale: 0.4, svgOrigin: '250 144', duration: dur * 0.3, ease: 'power2.in' }, at);
  tl.to(sa(r, '.s-bodyg'), { scaleY: 0.35, scaleX: 1.12, y: -30, opacity: 0, svgOrigin: '250 640', duration: dur, ease: 'power2.in' }, at + dur * 0.1);
  sa(r, '.s-wisp').forEach((w, i) => tl.to(w, { y: -160 - i * 30, x: (i % 2 ? 40 : -40), opacity: 0, scale: 0.6, svgOrigin: w.dataset.px + ' ' + w.dataset.py, duration: dur * 0.9, ease: 'power1.in' }, at + i * 0.08));
}

// ---------------------------------------------------------------- icones de monuments (100x100, plates, 2 tons : `c` encre, `a` accent)
// Silhouettes originales simplifiees (aucune IP) : Puerta de Alcala, cathedrale, Giralda, Angel, calavera, Miguelete, Obelisco,
// Monserrate, piramide maya, Machu Picchu, Sagrada Familia.
const MONUMENTS = ['alcala', 'catedral', 'giralda', 'angel', 'calavera', 'miguelete', 'obelisco', 'monserrate', 'piramide', 'machu', 'sagrada'];
function monument(key, c, a) {
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
function monumentSvg(key, opts) {
  opts = opts || {};
  const s = opts.size || 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -10 112 112" width="${s}" height="${s}" aria-hidden="true">${monument(key, opts.c, opts.a)}</svg>`;
}

// ---------------------------------------------------------------- carte du monde hispanique (stylisee) - viewBox 0 0 1600 1200
// Contours simplifies a la main (lon/lat, domaine public / geometrie factuelle, inspires de Natural Earth 110m). Carte "de voyage" :
// l'Iberique est agrandie en inset (x4), le Mexique est "fisheye" (loupe) pour que les medaillons respirent.
// Camera : groupe .m-cam (transform GSAP, svgOrigin "0 0"). Etats des regions : 'locked' | 'open' | 'current' | 'done'.
const MAP_W = 1600, MAP_H = 1200;

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
function mapProj(lon, lat) {
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

const MAP_REGIONS = [
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
const MAP_ROUTE = ['madrid', 'salamanca', 'sevilla', 'cdmx', 'oaxaca', 'valencia', 'baires', 'bogota', 'yucatan', 'cusco'];
function mapRegion(id) {
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
function mapFogHtml(id) {
  const r = mapRegion(id);
  return `<g class="m-fog m-fog-${id}" data-id="${id}">${fogClouds(r.x, r.y, 77, r.lon > -16 ? 0.4 : 0.66)}</g>`;
}
/** Un nuage centre en (cx,cy), largeur w, hauteur h : bosses sur le dessus, base plate arrondie. Renvoie le SVG (halo + ombre + corps + reflets). */
function cloudSvg(cx, cy, w, h, seed, layer) {
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
function worldMap(opts) {
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
function mapCam(x, y, s, vw, vh) { return { x: r1((vw || MAP_W) / 2 - x * s), y: r1((vh || MAP_H) / 2 - y * s), scale: s }; }
/** Tween de camera vers (x,y,s) ou une region (id). Pas d'attribut layout : transform seul. */
function mapCamTo(tl, root, target, s, at, dur, ease, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  tl.to(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, svgOrigin: '0 0', duration: dur, ease: ease || 'power3.inOut' }, at);
}
/**
 * Comme mapCamTo, mais SANS svgOrigin dans le tween : fiable pour enchainer plusieurs mouvements de camera dans une timeline
 * (avec svgOrigin, GSAP recale x/y et la position finale derive). Prerequis : l'origine 0 0 a deja ete posee par mapCamSet().
 */
function mapCamMove(tl, root, target, s, at, dur, ease, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  tl.to(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, duration: dur, ease: ease || 'power3.inOut' }, at);
}
function mapCamSet(g, root, target, s, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  g.set(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, svgOrigin: '0 0' });
}
/** Le brouillard d'une region se dissipe : les nuages s'ecartent (devant d'abord, puis milieu, puis fond), gonflent, montent doucement et s'effacent ; la medaille s'allume. */
function mapFogClear(tl, root, id, at, dur) {
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
function mapFogDrift(tl, root, at, dur) {
  ma(root, '.m-cloud').forEach((c, i) => tl.to(c, { x: (i % 2 ? -1 : 1) * (7 + (i % 3) * 4), y: ((i % 3) - 1) * 3, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + (i % 4) * 0.1));
}
/** Pulsation de l'anneau "region courante" (finie). */
function mapPulse(tl, root, at, n, period) {
  ma(root, '.m-pulse').forEach((p) => tl.fromTo(p, { scale: 1, opacity: 0.9, svgOrigin: '0 0' }, { scale: 1.28, opacity: 0, svgOrigin: '0 0', duration: period, ease: 'power1.out', repeat: n - 1 }, at));
}
/**
 * Voyage du jeton de `fromId` a `toId` (segments consecutifs de MAP_ROUTE) : le pointille se revele, le jeton suit le chemin
 * (MotionPathPlugin si fourni via `plugin`, sinon interpolation getPointAtLength), petit saut d'arrivee.
 */
function mapTravel(tl, root, fromId, toId, at, dur, g) {
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
function explainerMap(opts) {
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
function explainerReveal(tl, root, at, step) {
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
function sparklePath(cx, cy, R, r) {
  r = r == null ? R * 0.22 : r;
  return `M${r1(cx)} ${r1(cy - R)}L${r1(cx + r)} ${r1(cy - r)}L${r1(cx + R)} ${r1(cy)}L${r1(cx + r)} ${r1(cy + r)}L${r1(cx)} ${r1(cy + R)}L${r1(cx - r)} ${r1(cy + r)}L${r1(cx - R)} ${r1(cy)}L${r1(cx - r)} ${r1(cy - r)}Z`;
}

// ---------------------------------------------------------------- Madrid au coucher du soleil (3200 x 1200)
const SKY = { W: 3200, H: 1200, horizon: 880 };
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
function madridSkyline(opts) {
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
const ROOM = { W: 2400, H: 1200, floor: 930, deskTop: 790 };
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
function academiaRoom(opts) {
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
function featherSvg(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ft'), W = opts.width || 120, H = opts.height || 360, g = (n) => `${id}-${n}`;
  let barbs = ''; for (let i = 0; i < 16; i++) { const y = 40 + i * 17, w = 40 * Math.sin((Math.PI * (i + 1.5)) / 18) + 8; barbs += `<path d="M60 ${y}q${r1(-w * 0.6)} 6 ${r1(-w)} 26M60 ${y}q${r1(w * 0.6)} 6 ${r1(w)} 26" stroke="#066A4A" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 360" width="${W}" height="${H}" class="f-svg" aria-hidden="true"><defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#42E0A0"/><stop offset=".5" stop-color="#0E9F6E"/><stop offset="1" stop-color="#19B7AA"/></linearGradient><radialGradient id="${g('glow')}"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".9"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>
<ellipse class="f-glow" cx="60" cy="170" rx="100" ry="170" fill="url(#${g('glow')})"/>
<path d="M60 8C112 70 118 170 84 262Q70 312 60 352C50 312 36 262 16 190C-6 110 18 60 60 8Z" fill="url(#${g('b')})" stroke="#066A4A" stroke-width="3" stroke-linejoin="round"/>${barbs}<path d="M60 14Q64 190 60 356" stroke="#BFFFE3" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 90Q30 130 46 170" stroke="#fff" stroke-width="4" opacity=".4" fill="none" stroke-linecap="round"/></svg>`;
}

// ---------------------------------------------------------------- drapeaux simples (100 x 66) : es, mx, ar
function flagSvg(code, opts) {
  opts = opts || {};
  const w = opts.width || 200, id = opts.uid || uid('fl');
  const body = { es: `<rect width="100" height="66" fill="#C8102E"/><rect y="16.5" width="100" height="33" fill="#FFC400"/><rect x="22" y="26" width="9" height="14" rx="2" fill="#B4503A"/>`,
    mx: `<rect width="100" height="66" fill="#fff"/><rect width="33.4" height="66" fill="#006847"/><rect x="66.6" width="33.4" height="66" fill="#CE1126"/><circle cx="50" cy="33" r="8.5" fill="#9C7A3C"/><path d="M42 37q8 8 16 0" stroke="#006847" stroke-width="2.4" fill="none"/>`,
    ar: `<rect width="100" height="66" fill="#fff"/><rect width="100" height="22" fill="#74ACDF"/><rect y="44" width="100" height="22" fill="#74ACDF"/><circle cx="50" cy="33" r="6.2" fill="#F6B40E"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M50 33l${r1(Math.cos(i * 0.785) * 10)} ${r1(Math.sin(i * 0.785) * 10)}" stroke="#F6B40E" stroke-width="1.6"/>`).join('')}` }[code] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 66" width="${w}" height="${r1(w * 0.66)}" class="fl-svg" aria-hidden="true"><defs><clipPath id="${id}"><rect width="100" height="66" rx="6"/></clipPath><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#${id})">${body}<rect width="100" height="66" fill="url(#${id}s)"/></g><rect width="100" height="66" rx="6" fill="none" stroke="#14173F" stroke-opacity=".5" stroke-width="2"/></svg>`;
}

// ---------------------------------------------------------------- particules : motes de poussiere, etincelles, confettis de papel picado
/** n points (cercles/etincelles) repartis dans w x h ; chaque <g class="k-mote" data-i> est anime par la composition (positions deterministes). */
function moteField(opts) {
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
const CHAR_PIVOT = { head: '200 288', armL: '142 306', armR: '258 306', legL: '168 440', legR: '232 440', tail: '236 104', rig: '200 640' };
const CHARS = {
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
function character(key, opts) {
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
function charTalk(tl, root, at, dur, n) {
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
function charBlink(tl, root, at) {
  const eyes = ca(root, '.c-eye');
  tl.to(eyes, { scaleY: 0.08, svgOrigin: '200 198', duration: 0.07, ease: 'power2.in' }, at);
  tl.to(eyes, { scaleY: 1, svgOrigin: '200 198', duration: 0.12, ease: 'power2.out' }, at + 0.09);
}
/** Respiration + balancement de la couette / tete (cycles finis). */
function charIdle(tl, root, at, span, amp) {
  const a = amp == null ? 1 : amp, body = ca(root, '.c-body');
  tl.fromTo(body, { y: 0 }, { y: -5 * a, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.1)) }, at);
  ca(root, '.c-tail').forEach((t) => tl.fromTo(t, { rotation: -5 * a, svgOrigin: t.dataset.px + ' ' + t.dataset.py }, { rotation: 6 * a, svgOrigin: t.dataset.px + ' ' + t.dataset.py, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.3)) }, at));
  tl.fromTo(ca(root, '.c-head'), { y: 0 }, { y: -4 * a, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.7)) }, at + 0.3);
}
/** Marche sur place : jambes en opposition, bras qui balancent, rebond du corps. `period` = duree d'un pas. */
function charWalk(tl, root, at, dur, period) {
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
function charWave(tl, root, at, dur, side) {
  const arm = ca(root, '.c-arm' + (side || 'R')), piv = side === 'L' ? CHAR_PIVOT.armL : CHAR_PIVOT.armR, sg = side === 'L' ? 1 : -1;
  tl.to(arm, { rotation: 150 * sg, svgOrigin: piv, duration: 0.3, ease: 'back.out(1.6)' }, at);
  const n = Math.max(2, Math.floor(dur / 0.24));
  tl.fromTo(arm, { rotation: 150 * sg - 14 }, { rotation: 150 * sg + 14, svgOrigin: piv, duration: 0.12, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, immediateRender: false }, at + 0.3);
  tl.to(arm, { rotation: 0, svgOrigin: piv, duration: 0.35, ease: 'power2.inOut' }, at + 0.3 + n * 0.24);
}
/** Emotion : 'happy' (sourcils hauts, grand sourire), 'worry' (sourcils inclines), 'neutral'. */
function charEmote(tl, root, at, kind, dur) {
  const brows = ca(root, '.c-brow');
  const y = kind === 'happy' ? -12 : kind === 'worry' ? -6 : 0, r = kind === 'worry' ? 12 : 0;
  tl.to(brows, { y: y, duration: dur || 0.25, ease: 'power2.out' }, at);
  ca(root, '.c-brow').forEach((b, i) => tl.to(b, { rotation: (i ? -1 : 1) * r, svgOrigin: i ? '245 164' : '155 164', duration: dur || 0.25, ease: 'power2.out' }, at));
}
/** Hochement de tete (rotation autour du cou) : liste de [temps, angle]. */
function charNod(tl, root, at, angle, dur) {
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

// ---------------------------------------------------------------- personnages du Mexique (unite 4 + evenement Dia de Muertos) : meme chibi 400x660.
// Mateo (Coyoacan, casquette bleue + lunettes), Valentina (guide de la Casa Azul, fleurs dans les cheveux), Dona Lupita (marchande, rebozo),
// Dona Remedios (abuela d'Oaxaca, huipil brode), Beto (artisan d'alebrijes, tablier), Xochitl (fillette d'Oaxaca, couronne de cempasuchil).
// Chaque entree : torso (+ jupe/tablier), back / front (cheveux, couvre-chef), acc (lunettes...). Visage, bras, jambes et rig : 08-characters.js.
Object.assign(CHARS, {
  mateo: { name: 'Mateo', skin: '#C98A5E', hair: '#1E120C', top: '#E8A33A', pants: '#3D4468', shoes: '#F5E6C8', accent: '#2F6FD0', mouthY: 0 },
  valentina: { name: 'Valentina', skin: '#D2956B', hair: '#1E120C', top: '#FFFDF4', pants: '#0E7F82', shoes: '#C9573B', accent: '#D93472', mouthY: 0 },
  lupita: { name: 'Doña Lupita', skin: '#B87F55', hair: '#6E6762', top: '#C9573B', pants: '#2B318A', shoes: '#3B2216', accent: '#D93472', mouthY: 0 },
  remedios: { name: 'Doña Remedios', skin: '#C08558', hair: '#E4E0DA', top: '#FFFDF4', pants: '#3B2A4A', shoes: '#3B2216', accent: '#D93472', mouthY: 0 },
  beto: { name: 'Beto', skin: '#B9764A', hair: '#1E120C', top: '#19B7AA', pants: '#2B318A', shoes: '#6B3E26', accent: '#FF9F1C', mouthY: 14 },
  xochitl: { name: 'Xóchitl', skin: '#C78758', hair: '#1A0F0A', top: '#FFFDF4', pants: '#D93472', shoes: '#FFC83D', accent: '#FF9F1C', mouthY: 0 },
});

/** Fleur de cempasuchil (tagete) vue de face : petales orange en couronne, coeur jaune. */
function marigoldFlower(cx, cy, r, c1, c2) {
  let p = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; p += `<ellipse cx="${r1(cx + Math.cos(a) * r * 0.55)}" cy="${r1(cy + Math.sin(a) * r * 0.55)}" rx="${r1(r * 0.42)}" ry="${r1(r * 0.3)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(cx + Math.cos(a) * r * 0.55)} ${r1(cy + Math.sin(a) * r * 0.55)})" fill="${i % 2 ? c1 : c2}"/>`; }
  return p + `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.34)}" fill="#FFC83D"/>`;
}
/** Broderie de bas de jupe / col : bande de losanges + petites fleurs. */
function embroideryBand(x, y, w, h, c1, c2) {
  const n = Math.max(2, Math.floor(w / (h * 1.1))), st = w / n; let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${c1}"/>`;
  for (let i = 0; i < n; i++) s += `<path d="${diamondPath(r1(x + st * (i + 0.5)), r1(y + h / 2), r1(st * 0.28), r1(h * 0.38))}" fill="${c2}"/>`;
  return s;
}

Object.assign(CHX, {
  mateo: {
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M162 286Q200 322 238 286L238 304Q200 340 162 304Z" fill="${shade(c.top, -0.2)}"/><path d="M200 322V450" stroke="${shade(c.top, -0.3)}" stroke-width="5"/><path d="M150 420h100" stroke="${shade(c.top, -0.3)}" stroke-width="4" opacity=".6"/>`,
    front: (c) => `<path d="M100 184Q92 96 200 90Q308 96 300 184Q290 150 262 146Q200 132 138 146Q110 150 100 184Z" fill="${c.hair}"/><path d="M104 150Q110 64 200 58Q290 64 296 150Q200 124 104 150Z" fill="${c.accent}"/><path d="M104 150Q200 124 296 150" stroke="${shade(c.accent, -0.3)}" stroke-width="6" fill="none"/><path d="M96 154Q160 138 232 144Q300 150 322 172Q296 176 268 164Q200 148 96 168Z" fill="${shade(c.accent, -0.22)}"/><circle cx="200" cy="96" r="14" fill="#FFC83D"/><path d="M200 86l3 7h7l-6 5 2 8-6 -5 -6 5 2 -8 -6 -5h7Z" fill="${c.accent}"/>`,
    acc: () => `<g fill="#CFE9F5" fill-opacity=".14" stroke="#1E120C" stroke-width="6"><rect x="122" y="178" width="66" height="50" rx="14"/><rect x="212" y="178" width="66" height="50" rx="14"/></g><path d="M188 196Q200 188 212 196M122 190L106 184M278 190L294 184" stroke="#1E120C" stroke-width="6" fill="none"/>`,
  },
  valentina: {
    torso: (c) => `<path d="M126 436L274 436L304 600Q200 622 96 600Z" fill="${c.pants}"/><path d="M204 440L210 606Q256 604 304 600L274 436Z" fill="#000" opacity=".16"/>${embroideryBand(98, 566, 206, 30, '#D93472', '#FFC83D')}<path d="M130 296Q200 272 270 296L280 446Q200 470 120 446Z" fill="${c.top}"/><path d="M270 296L280 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.12)}" opacity=".5"/><path d="M150 290Q200 326 250 290L250 308Q200 344 150 308Z" fill="#D93472"/>${embroideryBand(150, 322, 100, 22, '#FFC83D', '#D93472')}<g fill="#D93472"><circle cx="176" cy="372" r="8"/><circle cx="224" cy="372" r="8"/><circle cx="200" cy="400" r="8"/></g><g fill="#0E9F6E"><circle cx="176" cy="372" r="3"/><circle cx="224" cy="372" r="3"/><circle cx="200" cy="400" r="3"/></g><path d="M124 436Q200 462 276 436L276 452Q200 478 124 452Z" fill="#FFC83D"/>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 270 288 330Q272 270 272 240L128 240Q128 270 112 330Q88 270 98 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q284 142 244 138Q210 118 168 140Q122 142 102 190Z" fill="${c.hair}"/><path d="M122 150Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M110 120Q200 52 290 120" stroke="${shade(c.hair, 0.12)}" stroke-width="22" fill="none" stroke-linecap="round"/><g>${marigoldFlower(150, 82, 20, '#D93472', '#FF7FB0')}${marigoldFlower(200, 62, 22, '#FFC83D', '#FF9F1C')}${marigoldFlower(252, 80, 20, '#19B7AA', '#6FE7DC')}</g><path d="M178 56q-10 -16 6 -22M226 52q12 -14 -4 -22" stroke="#0E9F6E" stroke-width="5" fill="none"/>`,
  },
  lupita: {
    torso: (c) => `<path d="M126 436L274 436L302 596Q200 616 98 596Z" fill="${c.pants}"/><path d="M204 440L208 604Q254 602 302 596L274 436Z" fill="#000" opacity=".16"/><path d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M122 296Q200 340 278 296L292 400Q200 456 108 400Z" fill="#19B7AA"/><path d="M122 296Q200 340 278 296" stroke="#FFC83D" stroke-width="7" fill="none"/>${[0, 1, 2, 3].map((i) => `<path d="M${116 + i * 4} ${322 + i * 24}Q200 ${372 + i * 24} ${284 - i * 4} ${322 + i * 24}" stroke="${['#D93472', '#FFC83D', '#2B318A', '#F5E6C8'][i]}" stroke-width="6" fill="none" opacity=".9"/>`).join('')}<path d="M150 400H250L262 480Q200 494 138 480Z" fill="#F5E6C8"/><path d="M150 400Q200 414 250 400" fill="none" stroke="${c.accent}" stroke-width="4"/>`,
    back: (c) => `<path d="M98 196Q88 92 200 80Q312 92 302 196Q308 250 286 270Q290 214 274 190L126 190Q110 214 114 270Q92 250 98 196Z" fill="${c.hair}"/><path d="M98 200Q70 270 90 340Q112 320 118 262Z" fill="${c.hair}"/><path d="M302 200Q330 270 310 340Q288 320 282 262Z" fill="${c.hair}"/><path d="M86 330l-8 18M314 330l8 18" stroke="${c.accent}" stroke-width="9" stroke-linecap="round"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M198 98V140" stroke="${shade(c.hair, -0.3)}" stroke-width="4" opacity=".6"/>`,
  },
  remedios: {
    torso: (c) => `<path d="M130 436L270 436L298 596Q200 614 102 596Z" fill="${c.pants}"/><path d="M204 440L208 604Q252 602 298 596L270 436Z" fill="#000" opacity=".16"/>${embroideryBand(102, 566, 196, 26, '#D93472', '#FFC83D')}<path d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.12)}" opacity=".5"/>${embroideryBand(146, 308, 108, 30, '#D93472', '#FFC83D')}<g>${marigoldFlower(176, 384, 16, '#D93472', '#FF7FB0')}${marigoldFlower(224, 384, 16, '#19B7AA', '#6FE7DC')}${marigoldFlower(200, 420, 16, '#FF9F1C', '#FFC83D')}</g>${embroideryBand(122, 436, 156, 20, '#19B7AA', '#FFFDF4')}`,
    back: (c) => `<circle cx="200" cy="72" r="42" fill="${c.hair}"/><circle cx="200" cy="72" r="42" fill="none" stroke="#B8B3AD" stroke-width="4" opacity=".6"/><path d="M96 196Q86 90 200 78Q314 90 304 196Q310 250 286 280Q290 210 274 190L126 190Q110 210 114 280Q90 250 96 196Z" fill="${c.hair}"/><path d="M100 220Q76 300 98 372Q120 352 124 280Z" fill="${c.hair}"/><path d="M300 220Q324 300 302 372Q280 352 276 280Z" fill="${c.hair}"/><path d="M92 366l-6 24M308 366l6 24" stroke="${c.accent}" stroke-width="9" stroke-linecap="round"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><g>${marigoldFlower(256, 92, 15, '#FF9F1C', '#FFC83D')}${marigoldFlower(278, 112, 12, '#FF9F1C', '#FFC83D')}</g>`,
    acc: (c) => `<path d="M126 246Q136 266 150 268M274 246Q264 266 250 268" stroke="${shade(c.skin, -0.3)}" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`,
  },
  beto: {
    torso: (c) => `<path class="c-torso" d="M136 292Q200 272 264 292L280 446Q200 470 120 446Z" fill="${c.top}"/><path d="M264 292L280 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.25)}" opacity=".5"/><path d="M150 330H250L262 480Q200 494 138 480Z" fill="#C9573B"/><path d="M150 330Q200 344 250 330" fill="none" stroke="#7E2F1E" stroke-width="5"/><path d="M168 300L158 334M232 300L242 334" stroke="#7E2F1E" stroke-width="7" stroke-linecap="round"/><g><circle cx="176" cy="398" r="9" fill="#FFC83D"/><circle cx="224" cy="428" r="8" fill="#19B7AA"/><circle cx="196" cy="456" r="7" fill="#D93472"/><circle cx="214" cy="372" r="6" fill="#2F6FD0"/></g><rect x="176" y="404" width="48" height="34" rx="8" fill="none" stroke="#7E2F1E" stroke-width="4"/>`,
    front: (c) => `<path d="M100 184Q94 92 200 86Q306 92 300 184Q290 150 266 144Q200 128 134 144Q108 150 100 184Z" fill="${c.hair}"/><path d="M98 138Q200 98 302 138L300 164Q200 126 100 164Z" fill="#FF9F1C"/><path d="M98 138Q200 98 302 138" fill="none" stroke="#fff" stroke-width="3" opacity=".3"/><g fill="#FFFDF4"><circle cx="150" cy="136" r="5"/><circle cx="200" cy="124" r="5"/><circle cx="250" cy="136" r="5"/></g><path d="M298 142Q338 150 346 182Q316 172 296 164Z" fill="#FF9F1C"/>`,
    acc: () => `<path d="M150 238Q176 218 200 234Q224 218 250 238Q244 262 200 250Q156 262 150 238Z" fill="#1E120C"/>`,
  },
  xochitl: {
    torso: (c) => `<path d="M132 436L268 436L300 590Q200 612 100 590Z" fill="${c.top}"/><path d="M204 440L210 598Q254 596 300 590L268 436Z" fill="#000" opacity=".1"/>${embroideryBand(102, 556, 196, 34, '#D93472', '#FFC83D')}${embroideryBand(110, 528, 180, 14, '#19B7AA', '#FFFDF4')}<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.14)}" opacity=".5"/><path d="M158 286Q200 330 242 286L242 306Q200 350 158 306Z" fill="#D93472"/>${embroideryBand(150, 340, 100, 22, '#FF9F1C', '#D93472')}<g>${marigoldFlower(174, 398, 13, '#FF9F1C', '#FFC83D')}${marigoldFlower(226, 398, 13, '#FF9F1C', '#FFC83D')}</g><path d="M126 436Q200 462 274 436L274 452Q200 478 126 452Z" fill="#D93472"/>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q88 250 98 196Z" fill="${c.hair}"/><path d="M106 232Q64 300 92 386Q124 364 126 290Z" fill="${c.hair}"/><path d="M294 232Q336 300 308 386Q276 364 274 290Z" fill="${c.hair}"/><path d="M88 372l-6 22M312 372l6 22" stroke="#FF9F1C" stroke-width="10" stroke-linecap="round"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q282 140 240 138Q212 112 176 140Q124 142 102 190Z" fill="${c.hair}"/><path d="M122 148Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M104 134Q200 70 296 134" stroke="#0E9F6E" stroke-width="10" fill="none" stroke-linecap="round"/><g>${marigoldFlower(126, 120, 17, '#FF9F1C', '#FFC83D')}${marigoldFlower(166, 92, 18, '#FF9F1C', '#FFC83D')}${marigoldFlower(208, 80, 19, '#FF9F1C', '#FFC83D')}${marigoldFlower(250, 94, 18, '#FF9F1C', '#FFC83D')}${marigoldFlower(284, 124, 17, '#FF9F1C', '#FFC83D')}</g>`,
  },
});

// ---------------------------------------------------------------- personnages de Bogota (unite 8) : meme chibi 400x660.
// Camila (guide de La Candelaria, ruana rouge), Don Hernan (conducteur du teleferique de Monserrate, casquette), Dona Marta (maison de couleurs, tablier, chignon).
// Memes conventions que 08c : torso (+ jupe/tablier), back / front (cheveux, couvre-chef), acc.
Object.assign(CHARS, {
  camila: { name: 'Camila', skin: '#C98F66', hair: '#1E120C', top: '#C8202E', pants: '#2F4A86', shoes: '#F5E6C8', accent: '#FCC919', mouthY: 0 },
  hernan: { name: 'Don Hernán', skin: '#B87F55', hair: '#6E6762', top: '#F5E6C8', pants: '#2A3558', shoes: '#3B2216', accent: '#1FA26B', mouthY: 14 },
  marta: { name: 'Doña Marta', skin: '#E2B592', hair: '#D8D4CE', top: '#D93472', pants: '#2F6FD0', shoes: '#6B3E26', accent: '#FCC919', mouthY: 0 },
});

Object.assign(CHX, {
  camila: {
    // chemise blanche sous une ruana rouge : poncho de laine ouvert devant, bandes jaune / bleu / noir au bas
    torso: (c) => `<path d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="#FFFDF4"/><path d="M118 296Q200 270 282 296L300 470Q200 500 100 470Z" fill="${c.top}"/><path d="M200 300V484" stroke="${shade(c.top, -0.35)}" stroke-width="5"/><path d="M282 296L300 470Q250 484 214 490L222 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M104 440Q200 470 296 440" stroke="${c.accent}" stroke-width="9" fill="none"/><path d="M102 456Q200 486 298 456" stroke="#2B318A" stroke-width="7" fill="none"/><path d="M100 470Q200 500 300 470" stroke="#1E120C" stroke-width="5" fill="none"/><path d="M156 292Q200 318 244 292" stroke="${shade(c.top, -0.3)}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 270 296 330Q280 270 276 240L124 240Q120 270 104 330Q88 270 98 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q284 142 244 138Q210 118 168 140Q122 142 102 190Z" fill="${c.hair}"/><path d="M122 150Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M104 150Q200 70 296 150" stroke="${c.accent}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M196 74Q200 66 204 74" stroke="${c.accent}" stroke-width="6" fill="none"/>`,
  },
  hernan: {
    // chemise claire, gilet vert du teleferique, casquette plate
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M146 296L196 312L190 450Q160 450 126 440Z" fill="${c.accent}"/><path d="M254 296L204 312L210 450Q240 450 274 440Z" fill="${c.accent}"/><path d="M170 292L200 330L230 292" stroke="#fff" stroke-width="6" fill="none" stroke-linejoin="round"/><rect x="226" y="350" width="26" height="18" rx="4" fill="#FCC919"/>`,
    front: (c) => `<path d="M100 186Q96 100 200 94Q304 100 300 186Q290 150 262 146Q200 132 138 146Q110 150 100 186Z" fill="${c.hair}"/><path d="M100 140Q104 88 200 82Q296 88 300 140Q200 118 100 140Z" fill="${c.accent}"/><path d="M96 140Q200 108 304 140L300 156Q200 126 100 156Z" fill="${shade(c.accent, -0.3)}"/><rect x="178" y="104" width="44" height="22" rx="6" fill="#FCC919"/>`,
    acc: () => `<path d="M150 238Q176 220 200 236Q224 220 250 238Q244 262 200 250Q156 262 150 238Z" fill="#8F8A84"/>`,
  },
  marta: {
    // tablier a fleurs sur une robe rose, chale jaune, chignon gris
    torso: (c) => `<path d="M126 436L274 436L304 596Q200 618 96 596Z" fill="${c.pants}"/><path d="M204 440L210 604Q256 602 304 596L274 436Z" fill="#000" opacity=".16"/><path d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M146 340H254L268 540Q200 556 132 540Z" fill="#FFFDF4"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${166 + (i % 3) * 34}" cy="${380 + i * 28}" r="8" fill="${['#D93472', '#FCC919', '#19B7AA'][i % 3]}"/>`).join('')}<path d="M118 296Q200 350 282 296L292 340Q200 390 108 340Z" fill="${c.accent}"/>`,
    back: (c) => `<circle cx="200" cy="70" r="40" fill="${c.hair}"/><path d="M96 196Q86 90 200 78Q314 90 304 196Q310 250 286 270Q290 210 274 190L126 190Q110 210 114 270Q90 250 96 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="256" cy="94" r="12" fill="#D93472"/><circle cx="256" cy="94" r="5" fill="#FCC919"/>`,
    acc: () => `<path d="M126 246Q136 266 150 268M274 246Q264 266 250 268" stroke="#B58A66" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`,
  },
});

// ---------------------------------------------------------------- personnages de l'unite 5 (Valencia) : Neus (12 ans, deux chignons, t-shirt soleil) et Vicent (le paellero, chapeau de paille, tablier)
// Meme chibi 400x660 que 08-characters.js / 08b / 08c. Chaque entree : torso (+ jupe), back / front (cheveux, couvre-chef), acc (moustache...).
Object.assign(CHARS, {
  neus: { name: 'Neus', skin: '#E0A57C', hair: '#2A160E', top: '#FF9F1C', pants: '#0E7F82', shoes: '#F5E6C8', accent: '#19B7AA', mouthY: 0 },
  vicent: { name: 'Vicent', skin: '#C98A5E', hair: '#4A3A30', top: '#FFFDF4', pants: '#3D4468', shoes: '#6B3E26', accent: '#D81E3A', mouthY: 14 },
});
Object.assign(CHX, {
  neus: {
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M162 286Q200 322 238 286L238 304Q200 340 162 304Z" fill="${shade(c.top, -0.2)}"/><g transform="translate(200 378)"><circle r="30" fill="#FFC83D"/><circle r="19" fill="#FFE27A"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M0 -36L5 -46L-5 -46Z" fill="#FFC83D" transform="rotate(${i * 45})"/>`).join('')}</g><path d="M130 432Q200 454 270 432L272 446Q200 470 128 446Z" fill="${c.accent}"/>`,
    back: (c) => `<circle cx="88" cy="96" r="40" fill="${c.hair}"/><circle cx="312" cy="96" r="40" fill="${c.hair}"/><circle cx="88" cy="96" r="40" fill="none" stroke="${shade(c.hair, 0.3)}" stroke-width="5" opacity=".5"/><circle cx="312" cy="96" r="40" fill="none" stroke="${shade(c.hair, 0.3)}" stroke-width="5" opacity=".5"/><path d="M98 196Q86 90 200 78Q314 90 302 196Q306 244 286 262Q288 210 274 190L126 190Q112 210 114 262Q94 244 98 196Z" fill="${c.hair}"/><circle cx="118" cy="106" r="9" fill="${c.accent}"/><circle cx="282" cy="106" r="9" fill="${c.accent}"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q282 142 242 138Q212 116 172 140Q124 142 102 190Z" fill="${c.hair}"/><path d="M122 150Q164 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M104 142Q200 92 296 142" stroke="${c.accent}" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="200" cy="108" r="9" fill="#FFC83D"/>`,
  },
  vicent: {
    torso: (c) => `<path class="c-torso" d="M134 292Q200 270 266 292L282 446Q200 472 118 446Z" fill="${c.top}"/><path d="M266 292L282 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M150 330H250L266 486Q200 502 134 486Z" fill="#FFFDF4"/><path d="M150 330H250L266 486Q200 502 134 486Z" fill="none" stroke="#C9C0AB" stroke-width="4"/><path d="M168 300L158 334M232 300L242 334" stroke="#C9C0AB" stroke-width="7" stroke-linecap="round"/><rect x="172" y="392" width="56" height="40" rx="8" fill="none" stroke="#C9C0AB" stroke-width="4"/><path d="M158 290Q200 336 242 290L248 312Q200 366 152 312Z" fill="${c.accent}"/><circle cx="200" cy="332" r="9" fill="${shade(c.accent, -0.25)}"/>`,
    front: (c) => `<path d="M100 184Q96 120 200 114Q304 120 300 184Q290 156 262 150Q200 138 138 150Q110 156 100 184Z" fill="${c.hair}"/><ellipse cx="200" cy="124" rx="168" ry="30" fill="#E8C070"/><ellipse cx="200" cy="124" rx="168" ry="30" fill="none" stroke="#B88A3A" stroke-width="5"/><path d="M128 120Q130 40 200 36Q270 40 272 120Z" fill="#F0D080"/><path d="M128 120H272V98H128Z" fill="${c.accent}"/><path d="M146 66Q176 48 206 52" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".4"/><g stroke="#B88A3A" stroke-width="3" opacity=".6"><path d="M60 124Q200 154 340 124"/><path d="M96 134Q200 158 304 134"/></g>`,
    acc: () => `<path d="M146 236Q174 214 200 232Q226 214 254 236Q248 258 200 246Q152 258 146 236Z" fill="#6B5848"/><path d="M164 238Q182 230 200 238Q218 230 236 238" stroke="#8A7462" stroke-width="3" fill="none" opacity=".7"/>`,
  },
});

// ---------------------------------------------------------------- personnages des Andes (unite 10, Cusco) : meme chibi 400x660.
// Killa (12 ans, lliclla coloree + tresses a pompons), Don Huaman (vieux conteur, chullo tricote, poncho), Dona Paulina (tisserande de Chinchero, montera).
// Chaque entree : torso (+ jupe/poncho), back / front (cheveux, couvre-chef), acc. Visage, bras, jambes et rig : 08-characters.js.
Object.assign(CHARS, {
  killa: { name: 'Killa', skin: '#C58A60', hair: '#1A0F0A', top: '#FFFDF4', pants: '#D93472', shoes: '#6B3E26', accent: '#F59F00', mouthY: 0 },
  huaman: { name: 'Don Huamán', skin: '#A9714A', hair: '#E4E0DA', top: '#B5452E', pants: '#3D2A4A', shoes: '#3B2216', accent: '#F59F00', mouthY: 14 },
  paulina: { name: 'Doña Paulina', skin: '#B27C54', hair: '#BDB8B2', top: '#2B318A', pants: '#C9402E', shoes: '#3B2216', accent: '#12A594', mouthY: 0 },
});

/** Bande de losanges tisses (aguayo) : x, y, largeur, hauteur, 3 couleurs. */
function cuWeave(x, y, w, h, c1, c2, c3) {
  const n = Math.max(2, Math.floor(w / (h * 1.2))), st = w / n; let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${c1}"/>`;
  for (let i = 0; i < n; i++) {
    const cx = x + st * (i + 0.5), cy = y + h / 2;
    s += `<path d="M${r1(cx)} ${r1(cy - h * 0.42)}L${r1(cx + st * 0.34)} ${r1(cy)}L${r1(cx)} ${r1(cy + h * 0.42)}L${r1(cx - st * 0.34)} ${r1(cy)}Z" fill="${i % 2 ? c2 : c3}"/><circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(h * 0.09)}" fill="${c1}"/>`;
  }
  return s;
}
/** Pompon (borla) : cercle + brins. */
function cuPom(cx, cy, r, c) {
  return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${c}"/><path d="M${r1(cx - r * 0.5)} ${r1(cy + r * 0.8)}l-3 ${r1(r)}M${r1(cx)} ${r1(cy + r)}v${r1(r * 1.2)}M${r1(cx + r * 0.5)} ${r1(cy + r * 0.8)}l3 ${r1(r)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
}

Object.assign(CHX, {
  killa: {
    torso: (c) => `<path d="M126 436L274 436L306 604Q200 626 94 604Z" fill="${c.pants}"/><path d="M204 440L210 610Q258 608 306 604L274 436Z" fill="#000" opacity=".16"/>${cuWeave(97, 556, 206, 30, '#F59F00', '#12A594', '#2B318A')}${cuWeave(110, 520, 180, 14, '#12A594', '#FFFDF4', '#D93472')}<path class="c-torso" d="M136 294Q200 272 264 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M264 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M118 300Q200 346 282 300L300 372Q200 428 100 372Z" fill="#D93472"/><path d="M118 300Q200 346 282 300" stroke="#F59F00" stroke-width="8" fill="none"/>${[0, 1, 2].map((i) => `<path d="M${112 + i * 3} ${326 + i * 22}Q200 ${376 + i * 22} ${288 - i * 3} ${326 + i * 22}" stroke="${['#F59F00', '#12A594', '#FFFDF4'][i]}" stroke-width="7" fill="none"/>`).join('')}<path d="M196 296l4 18 4 -18" stroke="#F59F00" stroke-width="6" fill="none"/>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q88 250 98 196Z" fill="${c.hair}"/><path d="M110 236Q70 320 96 420Q128 396 128 316Z" fill="${c.hair}"/><path d="M290 236Q330 320 304 420Q272 396 272 316Z" fill="${c.hair}"/>${cuPom(98, 424, 10, '#D93472')}${cuPom(302, 424, 10, '#12A594')}<path d="M100 330q-10 4 -4 14M300 330q10 4 4 14" stroke="#F59F00" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q282 140 240 138Q212 112 176 140Q124 142 102 190Z" fill="${c.hair}"/><path d="M122 148Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M200 94V138" stroke="${shade(c.hair, 0.3)}" stroke-width="4" opacity=".7"/><path d="M118 150Q200 98 282 150" stroke="#D93472" stroke-width="10" fill="none" stroke-linecap="round" opacity=".95"/>`,
  },
  huaman: {
    torso: (c) => `<path d="M132 436L268 436L290 596Q200 614 110 596Z" fill="${c.pants}"/><path d="M204 440L208 604Q252 602 290 596L268 436Z" fill="#000" opacity=".16"/><path class="c-torso" d="M136 292Q200 272 264 292L284 452Q200 482 116 452Z" fill="#F5E6C8"/><path d="M110 300Q200 290 290 300L316 500Q200 540 84 500Z" fill="${c.top}"/><path d="M290 300L316 500Q260 520 230 526L246 312Z" fill="${shade(c.top, -0.22)}" opacity=".5"/>${[0, 1, 2].map((i) => `<path d="M${98 + i * 5} ${400 + i * 34}Q200 ${436 + i * 34} ${302 - i * 5} ${400 + i * 34}" stroke="${['#F59F00', '#12A594', '#F5E6C8'][i]}" stroke-width="9" fill="none"/>`).join('')}<path d="M166 296Q200 348 234 296L234 312Q200 372 166 312Z" fill="${shade(c.top, -0.3)}"/><path d="M168 298Q200 340 232 298" stroke="#F59F00" stroke-width="6" fill="none"/>`,
    back: (c) => `<path d="M104 196Q98 224 112 252Q106 218 124 196Z M296 196Q302 224 288 252Q294 218 276 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M98 196Q92 96 200 88Q308 96 302 196Q292 176 276 170L124 170Q108 176 98 196Z" fill="#C9402E"/><path d="M98 156Q200 124 302 156" stroke="#F59F00" stroke-width="12" fill="none"/>${cuWeave(110, 128, 180, 22, '#C9402E', '#F5E6C8', '#12A594')}<path d="M100 150Q76 200 84 262Q110 244 118 196Z" fill="#C9402E"/><path d="M300 150Q324 200 316 262Q290 244 282 196Z" fill="#C9402E"/><path d="M84 214l10 4M88 236l12 2M316 214l-10 4M312 236l-12 2" stroke="#F59F00" stroke-width="5" stroke-linecap="round"/>${cuPom(200, 74, 18, '#F59F00')}<path d="M92 262l-6 26M308 262l6 26" stroke="#F59F00" stroke-width="5" stroke-linecap="round"/>`,
    acc: () => `<path d="M132 168Q160 150 188 168M212 168Q240 150 268 168" stroke="#E4E0DA" stroke-width="9" fill="none" stroke-linecap="round" opacity=".95"/><path d="M132 232Q124 248 128 264M268 232Q276 248 272 264M180 270Q200 280 220 270" stroke="#7A4E32" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>`,
  },
  paulina: {
    torso: (c) => `<path d="M122 436L278 436L310 606Q200 630 90 606Z" fill="${c.pants}"/><path d="M204 440L210 612Q260 610 310 606L278 436Z" fill="#000" opacity=".16"/>${cuWeave(93, 552, 214, 34, '#12A594', '#F59F00', '#D93472')}${cuWeave(104, 516, 192, 16, '#2B318A', '#FFFDF4', '#F59F00')}<path class="c-torso" d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M114 298Q200 350 286 298L304 384Q200 438 96 384Z" fill="#D93472"/><path d="M114 298Q200 350 286 298" stroke="#12A594" stroke-width="8" fill="none"/>${cuWeave(120, 340, 160, 22, '#F59F00', '#2B318A', '#FFFDF4')}`,
    back: (c) => `<path d="M98 196Q86 92 200 80Q314 92 302 196Q310 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q90 250 98 196Z" fill="${c.hair}"/><path d="M108 240Q74 330 100 430Q130 404 130 318Z" fill="${c.hair}"/><path d="M292 240Q326 330 300 430Q270 404 270 318Z" fill="${c.hair}"/><path d="M100 330H128M272 330H300M98 380H126M274 380H302" stroke="#D93472" stroke-width="7"/>`,
    front: (c) => `<path d="M102 190Q100 100 200 94Q300 100 298 190Q282 144 240 140Q212 116 176 142Q124 146 102 190Z" fill="${c.hair}"/><path d="M110 128Q200 56 290 128L284 150Q200 92 116 150Z" fill="#1F1B2E"/><ellipse cx="200" cy="108" rx="112" ry="30" fill="#1F1B2E"/><ellipse cx="200" cy="102" rx="96" ry="22" fill="#2B2A45"/><path d="M104 118Q200 134 296 118" stroke="#F59F00" stroke-width="9" fill="none"/>${cuWeave(116, 112, 168, 14, '#D93472', '#FFFDF4', '#12A594')}`,
    acc: () => `<path d="M132 236Q124 252 130 266M268 236Q276 252 270 266" stroke="#7A4E32" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/>`,
  },
});

// ---------------------------------------------------------------- personnages de l'unite 6 (Madrid de nuit, Noel) : Nacho, Rosa, Paloma. Meme chibi 400x660 (08-characters.js).
// Nacho (ado a trottinette, bonnet rouge + echarpe), Rosa (churrera, tablier + filet a cheveux), Paloma (vendeuse de loterie, bonnet de laine + gros manteau + billets).
Object.assign(CHARS, {
  nacho: { name: 'Nacho', skin: '#D9A07A', hair: '#2A1A12', top: '#2F6FD0', pants: '#2B318A', shoes: '#F5E6C8', accent: '#D81E3A', mouthY: 0 },
  rosa: { name: 'Rosa', skin: '#DDA67F', hair: '#3A2216', top: '#C9573B', pants: '#3B2A4A', shoes: '#3B2216', accent: '#FFC83D', mouthY: 0 },
  paloma: { name: 'Paloma', skin: '#E2B592', hair: '#B8B3AD', top: '#1F7F6A', pants: '#2B318A', shoes: '#3B2216', accent: '#D93472', mouthY: 0 },
});
Object.assign(CHX, {
  nacho: {
    torso: (c) => `<path class="c-torso" d="M134 292Q200 270 266 292L282 446Q200 472 118 446Z" fill="${c.top}"/><path d="M266 292L282 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M150 330Q200 350 250 330M146 380Q200 400 254 380M142 430Q200 450 258 430" stroke="${shade(c.top, -0.3)}" stroke-width="5" fill="none" opacity=".55"/><path d="M200 330V452" stroke="#F5E6C8" stroke-width="5"/><path d="M150 282Q200 328 250 282L254 312Q200 356 146 312Z" fill="${c.accent}"/><path d="M150 296Q200 340 250 296" stroke="#F5E6C8" stroke-width="4" fill="none" opacity=".7"/><path d="M226 322L248 400L226 404L212 340Z" fill="${c.accent}"/><path d="M230 372L246 372M228 388L244 388" stroke="#F5E6C8" stroke-width="4"/>`,
    front: (c) => `<path d="M100 184Q94 100 200 94Q306 100 300 184Q290 154 262 150Q200 134 138 150Q108 154 100 184Z" fill="${c.hair}"/><path d="M98 150Q100 52 200 48Q300 52 302 150Q200 120 98 150Z" fill="${c.accent}"/><path d="M98 146Q200 114 302 146L302 166Q200 134 98 166Z" fill="#F5E6C8"/><path d="M110 138Q200 108 290 138" stroke="${shade(c.accent, -0.3)}" stroke-width="4" fill="none" opacity=".6"/><circle cx="200" cy="40" r="26" fill="#F5E6C8"/><circle cx="190" cy="32" r="8" fill="#fff" opacity=".7"/>`,
  },
  rosa: {
    torso: (c) => `<path d="M126 436L274 436L302 596Q200 616 98 596Z" fill="${c.pants}"/><path d="M204 440L208 604Q254 602 302 596L274 436Z" fill="#000" opacity=".16"/><path d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M158 288Q200 324 242 288L242 308Q200 344 158 308Z" fill="#F5E6C8"/><path d="M152 340H248L266 520Q200 538 134 520Z" fill="#FFFDF4"/><path d="M152 340H248L252 372H148Z" fill="#F5E6C8"/><path d="M172 312L160 344M228 312L240 344" stroke="#FFFDF4" stroke-width="7" stroke-linecap="round"/><rect x="176" y="398" width="48" height="40" rx="8" fill="none" stroke="#E6CE9F" stroke-width="4"/><path d="M152 340Q200 356 248 340" fill="none" stroke="${c.accent}" stroke-width="5"/>`,
    back: (c) => `<circle cx="200" cy="66" r="44" fill="${c.hair}"/><path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 286 262Q290 210 272 188L128 188Q110 210 114 262Q88 250 98 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q284 142 244 138Q210 118 168 140Q122 142 102 190Z" fill="${c.hair}"/><path d="M110 150Q200 100 290 150L290 164Q200 118 110 164Z" fill="${c.accent}"/><path d="M120 138Q160 108 214 116" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="250" cy="110" r="9" fill="${c.accent}"/><circle cx="250" cy="110" r="3.5" fill="#C9573B"/>`,
  },
  paloma: {
    torso: (c) => `<path d="M122 436L278 436L310 600Q200 622 90 600Z" fill="${c.top}"/><path d="M206 440L212 608Q260 606 310 600L278 436Z" fill="#000" opacity=".16"/><path d="M130 296Q200 270 270 296L284 450Q200 476 116 450Z" fill="${c.top}"/><path d="M270 296L284 450Q240 462 214 466L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M200 320V462" stroke="${shade(c.top, -0.35)}" stroke-width="5"/><circle cx="184" cy="380" r="6" fill="${c.accent}"/><circle cx="184" cy="420" r="6" fill="${c.accent}"/><path d="M130 292Q200 346 270 292L282 330Q200 392 118 330Z" fill="${c.accent}"/><path d="M140 306Q200 352 260 306" stroke="#FFC83D" stroke-width="5" fill="none"/><path d="M140 322Q200 368 260 322" stroke="#F5E6C8" stroke-width="4" fill="none" opacity=".8"/><g transform="rotate(-6 150 420)"><rect x="118" y="388" width="46" height="62" rx="4" fill="#FFFDF4"/><rect x="128" y="388" width="46" height="62" rx="4" fill="#F5E6C8"/><rect x="138" y="388" width="46" height="62" rx="4" fill="#FFC83D"/><path d="M146 404h30M146 418h30M146 432h20" stroke="#C9573B" stroke-width="5"/></g>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q310 250 288 268Q290 214 274 190L126 190Q110 214 112 268Q88 250 98 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M94 150Q96 40 200 36Q304 40 306 150Q200 112 94 150Z" fill="#D81E3A"/><path d="M94 146Q200 108 306 146L306 172Q200 134 94 172Z" fill="#F5E6C8"/><path d="M110 156Q200 122 290 156" stroke="#D81E3A" stroke-width="5" fill="none" stroke-dasharray="14 10"/><circle cx="200" cy="30" r="22" fill="#F5E6C8"/><path d="M100 160V250M300 160V250" stroke="#D81E3A" stroke-width="10" stroke-linecap="round"/>`,
    acc: (c) => `<g fill="#CFE9F5" fill-opacity=".16" stroke="${c.accent}" stroke-width="5"><circle cx="155" cy="200" r="28"/><circle cx="245" cy="200" r="28"/></g><path d="M183 198Q200 190 217 198M127 196L110 190M273 196L290 190" stroke="${c.accent}" stroke-width="5" fill="none"/>`,
  },
});

// ---------------------------------------------------------------- personnages du Yucatan (unite 9) : meme chibi 400x660.
// Itzel (12 ans, huipil blanc brode de fleurs, tresses a rubans rouges, panier au bras), Don Chan (guide, chapeau de paille, guayabera, moustache grise),
// Dona Chabela (grand-mere maya, huipil rose, chignon gris). Visage, bras, jambes et rig : 08-characters.js. Broderies : embroideryBand (08c).
Object.assign(CHARS, {
  itzel: { name: 'Itzel', skin: '#C58A5E', hair: '#150C08', top: '#FFFDF4', pants: '#FFFDF4', shoes: '#C9573B', accent: '#D93472', mouthY: 0 },
  chan: { name: 'Don Chan', skin: '#B97F52', hair: '#9C968F', top: '#F3E8CF', pants: '#8C7A5E', shoes: '#4A2A18', accent: '#E9B25A', mouthY: 14 },
  chabela: { name: 'Doña Chabela', skin: '#B57A4E', hair: '#D7D2CB', top: '#FFFDF4', pants: '#FFFDF4', shoes: '#4A2A18', accent: '#D93472', mouthY: 0 },
});

/** Petite fleur brodee a 5 petales (huipil). */
function yuStitchFlower(cx, cy, r, c1, c2) {
  let p = '';
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; p += `<circle cx="${r1(cx + Math.cos(a) * r)}" cy="${r1(cy + Math.sin(a) * r)}" r="${r1(r * 0.62)}" fill="${c1}"/>`; }
  return p + `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.5)}" fill="${c2}"/>`;
}
/** Robe-huipil : longue robe blanche, col carre brode de fleurs, bande de broderie en bas. */
function yuHuipil(c, hem, neckA, neckB) {
  let flowers = '';
  [150, 178, 206, 234].forEach((x, i) => { flowers += yuStitchFlower(x + 6, 320 + (i % 2) * 6, 8, i % 2 ? neckA : neckB, '#FFC83D'); });
  return `<path d="M128 436L272 436L304 598Q200 618 96 598Z" fill="${c.top}"/><path d="M204 440L210 606Q256 604 304 598L272 436Z" fill="#000" opacity=".1"/>${embroideryBand(98, 560, 206, 30, hem, '#FFC83D')}${embroideryBand(108, 540, 186, 12, '#19B7AA', '#FFFDF4')}`
    + `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.16)}" opacity=".5"/>`
    + `<path d="M142 292H258L252 352H148Z" fill="${hem}" opacity=".92"/><path d="M152 300H248L244 344H156Z" fill="${c.top}"/>${flowers}`
    + `<path d="M126 436Q200 462 274 436L274 450Q200 476 126 450Z" fill="${hem}"/>`;
}

Object.assign(CHX, {
  itzel: {
    torso: (c) => `<g><path d="M52 436Q44 500 84 512L134 512Q144 460 128 436Z" fill="#B5793A"/><path d="M52 436H134" stroke="#7E4F22" stroke-width="6"/><path d="M60 452H128M58 470H130M62 488H126" stroke="#7E4F22" stroke-width="3" opacity=".55"/><path d="M56 436Q96 372 138 400" stroke="#7E4F22" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="76" cy="448" r="7" fill="#FF9F1C"/><circle cx="104" cy="446" r="7" fill="#D93472"/></g>` + yuHuipil(c, '#D93472', '#19B7AA', '#FF7FB0'),
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q88 250 98 196Z" fill="${c.hair}"/><path d="M104 226Q70 300 96 398Q126 374 126 290Z" fill="${c.hair}"/><path d="M296 226Q330 300 304 398Q274 374 274 290Z" fill="${c.hair}"/><path d="M92 380l10 24M308 380l-10 24" stroke="#D93472" stroke-width="11" stroke-linecap="round"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q282 140 240 138Q212 112 176 140Q124 142 102 190Z" fill="${c.hair}"/><path d="M122 148Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M104 150Q124 138 130 124M296 150Q276 138 270 124" stroke="#D93472" stroke-width="9" fill="none" stroke-linecap="round"/><g>${yuStitchFlower(210, 100, 9, '#FF9F1C', '#FFC83D')}</g>`,
  },
  chan: {
    torso: (c) => `<path d="M132 436L268 436L284 594Q200 604 116 594Z" fill="${c.pants}"/><path d="M204 440L208 600Q250 598 284 594L268 436Z" fill="#000" opacity=".16"/><path class="c-torso" d="M136 292Q200 272 264 292L280 446Q200 470 120 446Z" fill="${c.top}"/><path d="M264 292L280 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.18)}" opacity=".5"/><path d="M162 288Q200 318 238 288L238 304Q200 336 162 304Z" fill="${shade(c.top, -0.12)}"/>${[170, 186, 214, 230].map((x) => `<path d="M${x} 330V440" stroke="${shade(c.top, -0.3)}" stroke-width="2.5" opacity=".7"/>`).join('')}<path d="M200 312V452" stroke="${shade(c.top, -0.35)}" stroke-width="3"/>${[330, 372, 414].map((y) => `<circle cx="200" cy="${y}" r="3.5" fill="#8C7A5E"/>`).join('')}<path d="M144 346h30v34h-30Z M226 346h30v34h-30Z" fill="none" stroke="${shade(c.top, -0.3)}" stroke-width="2.5" opacity=".8"/>`,
    front: (c) => `<path d="M100 184Q94 96 200 90Q306 96 300 184Q290 150 266 144Q200 130 134 144Q108 150 100 184Z" fill="${c.hair}"/><ellipse cx="200" cy="126" rx="190" ry="24" fill="#D9B368"/><ellipse cx="200" cy="131" rx="190" ry="24" fill="#B8893F" opacity=".35"/><path d="M122 126Q124 28 200 24Q276 28 278 126Q200 146 122 126Z" fill="#E6C27A"/><path d="M122 126Q200 148 278 126L278 108Q200 130 122 108Z" fill="#7A3A24"/><path d="M130 90Q200 62 270 90M136 60Q200 38 264 60" stroke="#B8893F" stroke-width="3" fill="none" opacity=".55"/>`,
    acc: () => `<path d="M148 238Q174 222 200 238Q226 222 252 238Q246 262 200 252Q154 262 148 238Z" fill="#B8B3AD"/><path d="M160 240Q180 234 200 242Q220 234 240 240" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`,
  },
  chabela: {
    torso: (c) => yuHuipil(Object.assign({}, c, { top: '#FFE3EC' }), '#D93472', '#FF9F1C', '#19B7AA') + `<path d="M126 296Q200 340 274 296L290 420Q200 470 110 420Z" fill="#7B4FC0" opacity=".9"/><path d="M126 296Q200 340 274 296" stroke="#FFC83D" stroke-width="7" fill="none"/>${[0, 1, 2].map((i) => `<path d="M${122 + i * 4} ${326 + i * 26}Q200 ${372 + i * 26} ${278 - i * 4} ${326 + i * 26}" stroke="${['#FF9F1C', '#19B7AA', '#FFC83D'][i]}" stroke-width="5" fill="none"/>`).join('')}`,
    back: (c) => `<circle cx="200" cy="74" r="44" fill="${c.hair}"/><circle cx="200" cy="74" r="44" fill="none" stroke="#B8B3AD" stroke-width="4" opacity=".6"/><path d="M96 196Q86 90 200 78Q314 90 304 196Q310 250 286 280Q290 210 274 190L126 190Q110 210 114 280Q90 250 96 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><g>${yuStitchFlower(250, 96, 9, '#D93472', '#FFC83D')}</g>`,
    acc: (c) => `<path d="M126 246Q136 266 150 268M274 246Q264 266 250 268" stroke="${shade(c.skin, -0.3)}" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`,
  },
});

// ---------------------------------------------------------------- personnages de l'unite 7 (Buenos Aires) : meme chibi 400x660.
// Facu (13 ans, de La Boca : maillot bleu et jaune generique, pas d'ecusson), Sol (12 ans, longs cheveux boucles, chemise jaune, guitare a part),
// Don Anibal (le bandoneoniste : feutre, gilet, moustache grise). Chaque entree : torso, back / front (cheveux, couvre-chef), acc. Visage, bras, jambes et rig : 08-characters.js.
Object.assign(CHARS, {
  facu: { name: 'Facu', skin: '#D9A07A', hair: '#1E120C', top: '#2F6FD0', pants: '#1D2160', shoes: '#F5E6C8', accent: '#FFC83D', mouthY: 0 },
  sol: { name: 'Sol', skin: '#E0AC84', hair: '#4A2A18', top: '#FFC83D', pants: '#2B318A', shoes: '#C9573B', accent: '#D93472', mouthY: 0 },
  anibal: { name: 'Don Aníbal', skin: '#D2A07A', hair: '#B9B4AE', top: '#8A3A2E', pants: '#2A2A3A', shoes: '#1E1A16', accent: '#E0A058', mouthY: 14 },
});
Object.assign(CHX, {
  facu: {
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M150 330Q200 350 252 330L256 372Q200 392 146 372Z" fill="${c.accent}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M162 286Q200 322 238 286L238 304Q200 340 162 304Z" fill="${c.accent}"/><circle cx="244" cy="352" r="9" fill="#F5E6C8" opacity=".85"/>`,
    front: (c) => `<path d="M102 186Q90 90 200 84Q310 90 298 186Q290 148 262 144Q236 128 200 138Q164 128 138 144Q110 148 102 186Z" fill="${c.hair}"/><path d="M130 118Q160 98 192 104" stroke="${shade(c.hair, 0.3)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`,
  },
  sol: {
    torso: (c) => `<path d="M134 436L266 436L296 548Q200 568 104 548Z" fill="${c.pants}"/><path d="M206 440L216 556Q258 552 296 548L266 436Z" fill="#000" opacity=".14"/><path class="c-torso" d="M140 292Q200 274 260 292L274 444Q200 468 126 444Z" fill="${c.top}"/><path d="M260 292L274 444Q240 456 214 460L222 300Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M160 286Q200 326 240 286L240 306Q200 346 160 306Z" fill="#FFFDF4"/><g fill="${c.accent}"><circle cx="176" cy="384" r="8"/><circle cx="226" cy="404" r="8"/><circle cx="196" cy="428" r="8"/></g>`,
    back: (c) => `<path d="M96 190Q76 90 200 74Q324 90 304 190Q330 260 306 340Q282 392 256 330Q250 280 270 232L130 232Q150 280 144 330Q118 392 94 340Q70 260 96 190Z" fill="${c.hair}"/>${[[96, 270], [88, 330], [306, 270], [314, 330], [112, 372], [290, 372]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="22" fill="${c.hair}"/>`).join('')}`,
    front: (c) => `<path d="M100 188Q98 94 200 88Q302 94 300 188Q284 140 244 144Q220 118 196 148Q150 130 100 188Z" fill="${c.hair}"/>${[[130, 120], [172, 100], [226, 100], [270, 122]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="20" fill="${c.hair}"/>`).join('')}<path d="M126 126Q166 98 212 106" stroke="${shade(c.hair, 0.35)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M96 150Q200 100 304 150" stroke="${c.accent}" stroke-width="12" fill="none" stroke-linecap="round"/>`,
  },
  anibal: {
    torso: (c) => `<path d="M128 436L272 436L282 560Q200 580 118 560Z" fill="${c.pants}"/><path d="M206 440L210 568Q250 566 282 560L272 436Z" fill="#000" opacity=".16"/><path class="c-torso" d="M134 294Q200 270 266 294L280 446Q200 472 120 446Z" fill="#F5E6C8"/><path d="M134 294Q176 304 186 350L180 456Q150 452 120 446Z" fill="${c.top}"/><path d="M266 294Q224 304 214 350L220 456Q250 452 280 446Z" fill="${c.top}"/><path d="M266 294L280 446Q250 452 220 456L214 350Q224 304 266 294Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M168 288Q200 326 232 288L232 308Q200 348 168 308Z" fill="#14173F"/><path d="M200 330V452" stroke="#F5E6C8" stroke-width="3" opacity=".6"/><circle cx="176" cy="380" r="5" fill="${c.accent}"/><circle cx="176" cy="414" r="5" fill="${c.accent}"/><circle cx="224" cy="380" r="5" fill="${c.accent}"/><circle cx="224" cy="414" r="5" fill="${c.accent}"/>`,
    back: (c) => `<path d="M104 190Q96 224 112 252Q108 214 120 190Z M296 190Q304 224 288 252Q292 214 280 190Z" fill="${c.hair}"/>`,
    front: (c) => `<ellipse cx="200" cy="112" rx="170" ry="30" fill="#2A2A3A"/><path d="M122 114Q124 28 200 24Q276 28 278 114Z" fill="#3A3A4C"/><path d="M122 114H278V90H122Z" fill="${c.accent}"/><path d="M122 98H278" stroke="#fff" stroke-width="3" opacity=".25"/><path d="M130 50Q200 22 270 50" stroke="#fff" stroke-width="5" fill="none" opacity=".18" stroke-linecap="round"/>`,
    acc: () => `<path d="M146 236Q174 216 200 234Q226 216 254 236Q248 262 200 250Q152 262 146 236Z" fill="#CFCAC4"/><path d="M162 240Q182 232 200 242Q218 232 238 240" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/><path d="M118 214q-10 6 -12 16M282 214q10 6 12 16" stroke="#8A5230" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>`,
  },
});

// ---------------------------------------------------------------- accessoires d'histoire (unites 2 et 3) : cloche, bocadillo, chat, guitare, cazuela, grenouille, cigogne, enfant fige
// Chaque prop = chaine SVG (viewBox fixe). Parties animables : .pr-bell (cloche, pivot haut), .pr-clap (battant), .pr-frog, .st-wing*.

/** Stone sandstone palette (Salamanca) */
const STN = { l: '#F8D993', m: '#EBB968', d: '#C98F45', dd: '#8E5A2C', roof: '#B4503A', roof2: '#8E3A2B' };

/**
 * Props. key : 'campana' (cloche de bronze 300x340, pivot haut 150 30) | 'bocadillo' (200x90) | 'gato' (chat orange assis 220x240) |
 * 'guitarra' (160x420) | 'cazuela' (casserole 260x150) | 'rana' (grenouille de pierre 160x140, + crane) | 'azulejo' (carreau 120x120).
 * opts : width, uid, tone (campana : 'bronce'|'muda' = gris terne).
 */
function prop(key, opts) {
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
function storkSvg(opts) {
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
function frozenKid(opts) {
  opts = opts || {};
  const W = opts.width || 120, pose = opts.pose || 'stand', c = opts.color || '#7A85B8', h = opts.hair || '#3A3F73', sk = opts.skin || '#B5BCD9', sh = shade(c, -0.25);
  const arms = pose === 'ball' ? `<path d="M64 130L28 70" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L172 70" stroke="${c}" stroke-width="22" stroke-linecap="round"/><circle cx="100" cy="36" r="26" fill="#C9CCE3"/><path d="M80 24Q100 40 120 24M80 48Q100 32 120 48" stroke="${sh}" stroke-width="4" fill="none"/>`
    : pose === 'rope' ? `<path d="M64 130L30 170" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L170 170" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M30 172Q100 330 170 172" stroke="#9AA2CF" stroke-width="5" fill="none"/>`
    : `<path d="M64 130L50 220" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L150 220" stroke="${c}" stroke-width="22" stroke-linecap="round"/>`;
  const legs = pose === 'run' ? `<path d="M84 224L52 322" stroke="${sh}" stroke-width="24" stroke-linecap="round"/><path d="M116 224L150 300" stroke="${sh}" stroke-width="24" stroke-linecap="round"/>` : `<path d="M84 226V320" stroke="${sh}" stroke-width="26" stroke-linecap="round"/><path d="M116 226V320" stroke="${sh}" stroke-width="26" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="${W}" height="${Math.round(W * 340 / 200)}" class="fk-svg" aria-hidden="true" style="overflow:visible">${arms}${legs}<path d="M58 124Q100 106 142 124L148 236H52Z" fill="${c}"/><circle cx="100" cy="90" r="42" fill="${sk}"/><path d="M58 88Q56 40 100 40Q146 40 142 88Q130 60 100 66Q70 60 58 88Z" fill="${h}"/>${opts.smile ? `<path d="M80 102q20 18 40 0" stroke="#7A2E2E" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="84" cy="88" r="6" fill="#2A160E"/><circle cx="116" cy="88" r="6" fill="#2A160E"/><circle cx="68" cy="102" r="7" fill="#FF7A7A" opacity=".35"/><circle cx="132" cy="102" r="7" fill="#FF7A7A" opacity=".35"/>` : `<path d="M84 104h32" stroke="${sh}" stroke-width="5" stroke-linecap="round"/><circle cx="84" cy="88" r="4.5" fill="${sh}"/><circle cx="116" cy="88" r="4.5" fill="${sh}"/>`}</svg>`;
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
function fachadaUniversidad(opts) {
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
function salamancaSkyline(opts) {
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
const PATIO = { W: 2400, H: 1200, floor: 840 };
/** Retourne { back, front, light, W, H, bellTower: {x,y} } : patio de pierre doree, claustre a arcades, campanile (cadre de cloche VIDE), arbre, marelle, enfants figes. */
function colegioPatio(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cp'), g = (n) => `${id}-${n}`, W = PATIO.W, H = PATIO.H, fl = PATIO.floor, S = STN, rnd = rng(opts.seed || 8);
  const kids = [[300, 930, 170, 'ball', '#7A85B8'], [520, 900, 150, 'stand', '#8D8FBF'], [760, 960, 180, 'rope', '#6F7BAE'], [1000, 905, 150, 'run', '#8D8FBF'], [1230, 960, 170, 'stand', '#7A85B8'], [1560, 920, 160, 'ball', '#6F7BAE'], [1880, 990, 190, 'stand', '#8D8FBF'], [2150, 930, 160, 'run', '#7A85B8']];
  const LIVE = ['#E0694A', '#19B7AA', '#D93472', '#FFC83D', '#5B63D6', '#42E0A0', '#FF8A47', '#9B6BD6'], SKIN = ['#E3AE86', '#C98E66', '#D79A74', '#E8B994'];
  const kidsMarkup = (alive) => kids.map((k, i) => `<g transform="translate(${k[0] - k[2] / 2} ${k[1] - Math.round(k[2] * 1.7)})">${frozenKid(alive ? { width: k[2], pose: k[3], color: LIVE[i % LIVE.length], hair: ['#2A160E', '#3A2216', '#1E120C'][i % 3], skin: SKIN[i % SKIN.length], smile: true } : { width: k[2], pose: k[3], color: k[4], hair: i % 2 ? '#2F3566' : '#4A3F6E' })}</g>`).join('');
  const kidSvg = opts.noKids ? '' : kidsMarkup(false);
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
  return { back, front, light, W, H, bellTower: { x: 1745, y: 176 }, kidsFrozen: scSvg(W, H, kidsMarkup(false), 'cp-kids'), kidsAlive: scSvg(W, H, kidsMarkup(true), 'cp-kids2') };
}

// ---------------------------------------------------------------- salle de classe (2400 x 1200) : tableau vert, fenetre sur la facade de l'Universite
const AULA = { W: 2400, H: 1200, floor: 900, board: { x: 560, y: 190, w: 980, h: 390 }, win: { x: 1760, y: 170, w: 420, h: 520 } };
function desk(x, y, k, c) { // pupitre double + chaises + cartables
  const w = 300 * k, h = 20 * k;
  return `<g class="au-desk" transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="${h}" rx="${6 * k}" fill="#C98A55"/><rect x="0" y="0" width="${w}" height="${6 * k}" rx="${3 * k}" fill="#E8B27A"/><rect x="${14 * k}" y="${h}" width="${8 * k}" height="${96 * k}" fill="#3B2216"/><rect x="${w - 22 * k}" y="${h}" width="${8 * k}" height="${96 * k}" fill="#3B2216"/><rect x="${14 * k}" y="${h + 40 * k}" width="${w - 28 * k}" height="${8 * k}" fill="#3B2216" opacity=".7"/>
<g transform="translate(${44 * k} ${-66 * k})"><rect width="${70 * k}" height="${70 * k}" rx="${14 * k}" fill="${c}"/><rect x="${10 * k}" y="${34 * k}" width="${50 * k}" height="${28 * k}" rx="${8 * k}" fill="${shade(c, -0.25)}"/><path d="M${14 * k} 0v-${14 * k}h${42 * k}v${14 * k}" fill="none" stroke="#3B2216" stroke-width="${5 * k}"/></g><g transform="translate(${186 * k} ${-60 * k})"><rect width="${64 * k}" height="${64 * k}" rx="${14 * k}" fill="${shade(c, 0.1)}"/><rect x="${9 * k}" y="${30 * k}" width="${46 * k}" height="${26 * k}" rx="${8 * k}" fill="${shade(c, -0.3)}"/></g></g>`;
}
/** Retourne { back, desks, front, light, W, H, board, win, frog : { x, y } (grenouille vue par la fenetre, repere salle) }. */
function aula(opts) {
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
function sevillaSkyline(opts) {
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
const CALLEJON = { W: 3200, H: 1200, floor: 900, door: { x: 2720, y: 520, w: 190, h: 380 } };
function balcony(x, y, w, c) { // balcon en fer forge + pots de geraniums
  let s = scRect(x, y, w, 10, '#2A2A3A') + scRect(x - 8, y - 4, w + 16, 8, '#3A3A4A');
  for (let i = 0; i <= Math.floor(w / 18); i++) s += `<path d="M${r1(x + 4 + i * 18)} ${y}v-46" stroke="#2A2A3A" stroke-width="4"/>`;
  s += scRect(x, y - 50, w, 6, '#2A2A3A');
  for (let i = 0; i < Math.floor(w / 56); i++) { const px = x + 14 + i * 56; s += `<path d="M${px} ${y - 50}h34l-5 26h-24Z" fill="${SEV.shut}"/><circle cx="${px + 8}" cy="${y - 62}" r="9" fill="#D81E3A"/><circle cx="${px + 24}" cy="${y - 66}" r="9" fill="#D93472"/><circle cx="${px + 16}" cy="${y - 74}" r="8" fill="#FF6B7A"/><path d="M${px + 4} ${y - 52}q4 -10 12 -8M${px + 28} ${y - 52}q-4 -10 -10 -8" stroke="${SEV.leaf}" stroke-width="4" fill="none"/>`; }
  return s;
}
/** Retourne { back, front, light, W, H, door : { x, y, w, h } (porte bleue, repere ruelle) }. */
function callejonTriana(opts) {
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
const PATIOA = { W: 2400, H: 1200, floor: 860, fountain: { x: 1200, y: 930 } };
/** Retourne { back, front, light, W, H, fountain : { x, y } }. Eau : groupe .pa-water (traits .pa-jet) a animer. */
function patioAndaluz(opts) {
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
const TALLER = { W: 2400, H: 1200, floor: 900, fresco: { x: 560, y: 80, w: 1280, h: 740 } };
/** Retourne { back, front, light, W, H, fresco, names : [{x,y}] (cartouches), center : {x,y} (carreau vert) }.
 *  Classes : .fr-stain (taches d'ombre sur les noms, data-i), .fr-name (cartouche), .fr-glow / .fr-feather (carreau central). */
function tallerCeramica(opts) {
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
  const light = scSvg(W, H, `<defs><radialGradient id="${g('lg')}"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient></defs><ellipse cx="2140" cy="760" rx="520" ry="420" fill="url(#${g('lg')})" opacity=".3"/><defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M1000 0L1400 0L1500 900L700 900Z" opacity=".35"/></g>`, 'tc-light');
  return { back, front, light, W, H, fresco: Fr, names, center };
}

// ---------------------------------------------------------------- decors de Ciudad de Mexico / Coyoacan (unite 4) : panorama (Parroquia, kiosque, fontaine aux coyotes, jacarandas, Casa Azul),
// Plaza Hidalgo (decor de scene), patio de la Casa Azul, autoportraits "effaces" par la Sombra, accessoires de capsule (singe, perroquet, xolo, miroir...).
// Memes conventions que 10-salamanca.js / 11-sevilla.js : calques separes, aucun texte, monuments publics simplifies, aucune vraie personne (les autoportraits sont des figures generiques).
// Prefixe `mx` pour les helpers internes ; exports : coyoacanSkyline, plazaHidalgo, casaAzulPatio, autorretrato, mxProp.

const MX = {
  cobalt: '#1F55C4', cobalt2: '#163E94', cobalt3: '#4A85E8', ochre: '#E8A83C', rosa: '#E5638A', turq: '#22B5A8', mostaza: '#F2C14E', terra: '#C9573B', terra2: '#8E3A24',
  crema: '#FFF1D6', crema2: '#F1DDB4', jac: '#9B6AD9', jac2: '#BE98EE', jac3: '#7B4FC0', leaf: '#3F8A52', leaf2: '#63B66E', leaf3: '#2C6B3F', stone: '#9A8576', stone2: '#6F5F54', rojo: '#D6403A', verde: '#1E8F6A',
};

/** Pave : bandes de pierres en perspective legere (y0 -> y1) sur la largeur W. */
function mxCobbles(W, y0, y1, seed, c1, c2) {
  const rnd = rng(seed); let s = scRect(0, y0, W, y1 - y0, c1);
  for (let y = y0 + 6, row = 0; y < y1; y += 22 + row * 3.2, row++) {
    const h = 20 + row * 3, off = (row % 2) * 24;
    s += `<path d="M0 ${r1(y)}H${W}" stroke="${c2}" stroke-width="3" opacity=".5"/>`;
    for (let x = -off; x < W; x += 52 + rnd() * 26 + row * 3) s += `<path d="M${r1(x)} ${r1(y)}v${r1(h)}" stroke="${c2}" stroke-width="3" opacity=".42"/>`;
  }
  return s;
}
/** Maison coloniale de Coyoacan : facade a la chaux coloree, soubassement, corniche, fenetres a grille et volets, porte en bois, tuiles. */
function mxHouse(x, base, w, h, tone, seed, opts) {
  opts = opts || {};
  const rnd = rng(seed); let s = `<g class="mx-house">${scRect(x, base - h, w, h, tone)}${scRect(x + w - 16, base - h, 16, h, '#000', 'opacity=".08"')}`;
  s += scRect(x, base - 40, w, 40, shade(tone, -0.22)) + scRect(x, base - 44, w, 6, shade(tone, 0.35), 'opacity=".7"');
  s += scRect(x - 8, base - h - 16, w + 16, 20, MX.crema) + scRect(x - 8, base - h + 2, w + 16, 6, '#000', 'opacity=".12"');
  s += `<path d="M${x - 14} ${base - h - 16}h${w + 28}l-8 -26h${-(w + 12)}Z" fill="${MX.terra}"/>` + (() => { let t = ''; for (let i = 0; i < w / 22; i++) t += `<path d="M${r1(x - 6 + i * 22)} ${base - h - 18}v-20" stroke="${MX.terra2}" stroke-width="3" opacity=".5"/>`; return t; })();
  const n = Math.max(2, Math.floor(w / 96));
  for (let i = 0; i < n; i++) {
    const wx = x + (w / n) * (i + 0.5) - 24, door = opts.door === i;
    if (door) { s += scRect(wx - 6, base - 190, 60, 190, MX.crema) + scRect(wx, base - 184, 48, 184, '#6B3E26', 'rx="6"') + `<path d="M${wx + 24} ${base - 184}V${base}" stroke="#4A2A18" stroke-width="3"/><circle cx="${wx + 18}" cy="${base - 90}" r="3.5" fill="#E8A83C"/><circle cx="${wx + 30}" cy="${base - 90}" r="3.5" fill="#E8A83C"/>`; continue; }
    const wy = base - h + 40, wh = Math.min(96, h - 110);
    s += scRect(wx - 6, wy - 6, 60, wh + 12, MX.crema, 'rx="6"') + scRect(wx, wy, 48, wh, '#3B2A4A', 'rx="4"') + scRect(wx + 22, wy, 4, wh, MX.crema) + scRect(wx - 12, wy, 10, wh, rnd() < 0.5 ? MX.verde : MX.turq) + scRect(wx + 50, wy, 10, wh, rnd() < 0.5 ? MX.verde : MX.turq);
    s += `<path d="M${wx} ${wy + wh * 0.5}h48M${wx} ${wy + wh * 0.25}h48M${wx} ${wy + wh * 0.75}h48" stroke="#2A2A3A" stroke-width="3" opacity=".8"/>`;
    if (rnd() < 0.5) s += `<g><rect x="${wx + 4}" y="${wy + wh + 6}" width="40" height="12" rx="4" fill="${MX.terra}"/><circle cx="${wx + 12}" cy="${wy + wh}" r="7" fill="${MX.rosa}"/><circle cx="${wx + 26}" cy="${wy + wh - 4}" r="7" fill="${MX.mostaza}"/><circle cx="${wx + 38}" cy="${wy + wh}" r="6" fill="${MX.rosa}"/></g>`;
  }
  return s + '</g>';
}
/** Jacaranda : tronc fin, houppier de nuages violets (fleurs), quelques fleurs tombees autour. */
function mxJacaranda(x, base, k) {
  let s = `<g class="mx-jac"><path d="M${x - 8 * k} ${base}Q${x - 6 * k} ${base - 90 * k} ${x - 14 * k} ${base - 170 * k}L${x + 4 * k} ${base - 170 * k}Q${x + 8 * k} ${base - 90 * k} ${x + 10 * k} ${base}Z" fill="#5A4034"/>`;
  [[0, -230, 86, MX.jac], [-72, -196, 62, MX.jac3], [74, -200, 66, MX.jac], [-30, -270, 56, MX.jac2], [38, -262, 58, MX.jac2], [-108, -170, 44, MX.jac], [112, -168, 46, MX.jac3], [4, -190, 58, MX.jac3]].forEach((b) => { s += `<circle cx="${r1(x + b[0] * k)}" cy="${r1(base + b[1] * k)}" r="${r1(b[2] * k)}" fill="${b[3]}"/>`; });
  const rnd = rng(Math.round(x) + 7);
  for (let i = 0; i < 14; i++) s += `<circle cx="${r1(x + (rnd() - 0.5) * 220 * k)}" cy="${r1(base - (150 + rnd() * 140) * k)}" r="${r1((4 + rnd() * 5) * k)}" fill="${i % 2 ? '#E3D0FA' : MX.jac2}" opacity=".9"/>`;
  return s + '</g>';
}
/** Parroquia de San Juan Bautista (simplifiee) : facade de pierre claire, deux tours a lanternons, portail en arc, rosace, coupole. */
function mxChurch(x, base, k, tone) {
  const st = tone || '#E9D3A6', st2 = shade(st, -0.18), W = 520 * k;
  let s = `<g class="mx-church">${scRect(x - W / 2, base - 330 * k, W, 330 * k, st)}${scRect(x + W / 2 - 22 * k, base - 330 * k, 22 * k, 330 * k, '#000', 'opacity=".08"')}`;
  [-1, 1].forEach((d) => {
    const tx = x + d * 170 * k;
    s += scRect(tx - 62 * k, base - 520 * k, 124 * k, 200 * k, st) + scRect(tx - 70 * k, base - 528 * k, 140 * k, 14 * k, st2) + scRect(tx - 62 * k, base - 420 * k, 124 * k, 10 * k, st2);
    s += `<path d="${archOpen(tx - 20 * k, base - 424 * k, 40 * k, 100 * k)}" fill="#3B2216"/>`;
    s += `<path d="M${tx - 58 * k} ${base - 520 * k}Q${tx} ${base - 640 * k} ${tx + 58 * k} ${base - 520 * k}Z" fill="${MX.verde}"/><path d="M${tx - 58 * k} ${base - 520 * k}Q${tx - 20 * k} ${base - 600 * k} ${tx} ${base - 630 * k}" stroke="#fff" stroke-width="${3 * k}" fill="none" opacity=".35"/><path d="M${tx} ${base - 640 * k}v${-34 * k}M${tx - 12 * k} ${base - 660 * k}h${24 * k}" stroke="#E8A83C" stroke-width="${6 * k}" stroke-linecap="round"/>`;
  });
  s += `<path d="M${x - 110 * k} ${base - 330 * k}Q${x} ${base - 450 * k} ${x + 110 * k} ${base - 330 * k}Z" fill="${st2}"/>`;
  s += `<path d="${archOpen(x - 54 * k, base, 108 * k, 210 * k)}" fill="#3B2216"/><path d="${archOpen(x - 74 * k, base, 148 * k, 240 * k)}" fill="none" stroke="${st2}" stroke-width="${12 * k}"/>`;
  s += `<circle cx="${x}" cy="${r1(base - 290 * k)}" r="${34 * k}" fill="#3B2216"/><circle cx="${x}" cy="${r1(base - 290 * k)}" r="${44 * k}" fill="none" stroke="${st2}" stroke-width="${8 * k}"/>`;
  [-1, 1].forEach((d) => { s += `<path d="${archOpen(x + d * 130 * k - 18 * k, base - 40 * k, 36 * k, 130 * k)}" fill="#3B2216" opacity=".85"/>`; });
  return s + scRect(x - W / 2 - 20 * k, base - 14 * k, W + 40 * k, 14 * k, st2) + '</g>';
}
/** Kiosque de la plaza : plateforme de pierre, 6 colonnes de fonte, toit a nervures et lanterneau. */
function mxKiosk(x, base, k) {
  let s = `<g class="mx-kiosk">${scRect(x - 190 * k, base - 36 * k, 380 * k, 36 * k, MX.stone)}${scRect(x - 190 * k, base - 36 * k, 380 * k, 8 * k, shade(MX.stone, 0.3))}${scRect(x - 170 * k, base - 52 * k, 340 * k, 18 * k, MX.stone2)}`;
  for (let i = 0; i < 6; i++) { const cx = x - 150 * k + i * 60 * k; s += scRect(cx - 5 * k, base - 250 * k, 10 * k, 200 * k, MX.verde) + scRect(cx - 9 * k, base - 62 * k, 18 * k, 12 * k, MX.leaf3); }
  s += `<path d="M${x - 180 * k} ${base - 200 * k}H${x + 180 * k}" stroke="${MX.leaf3}" stroke-width="${8 * k}"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M${r1(x - 176 * k + i * 32 * k)} ${r1(base - 200 * k)}q${5 * k} ${22 * k} ${10 * k} 0" stroke="${MX.leaf3}" stroke-width="${3 * k}" fill="none"/>`;
  s += `<path d="M${x - 210 * k} ${base - 250 * k}Q${x} ${base - 420 * k} ${x + 210 * k} ${base - 250 * k}Z" fill="${MX.terra}"/>`;
  for (let i = -3; i <= 3; i++) s += `<path d="M${x} ${base - 410 * k}L${r1(x + i * 62 * k)} ${r1(base - 252 * k)}" stroke="${MX.terra2}" stroke-width="${3 * k}" opacity=".6"/>`;
  s += `<path d="M${x - 210 * k} ${base - 250 * k}H${x + 210 * k}" stroke="${MX.crema}" stroke-width="${10 * k}"/><circle cx="${x}" cy="${r1(base - 420 * k)}" r="${14 * k}" fill="${MX.mostaza}"/><path d="M${x} ${base - 430 * k}v${-36 * k}l${22 * k} ${8 * k}l${-22 * k} ${8 * k}" fill="${MX.rojo}" stroke="${MX.rojo}" stroke-width="${3 * k}"/>`;
  return s + '</g>';
}
/** Coyote assis, de profil (statue de pierre doree) : corps, cuisse, pattes, queue, tete a museau pointu, oreille. dir = 1 (regarde a droite) | -1. */
function mxCoyote(x, base, k, dir, c) {
  const d = dir || 1, X = (v) => r1(x + v * d * k), Y = (v) => r1(base + v * k), col = c || '#E0A85A', dark = shade(col, -0.22);
  return `<g class="mx-coyote"><path d="M${X(-60)} ${Y(0)}Q${X(-70)} ${Y(-70)} ${X(-30)} ${Y(-120)}Q${X(0)} ${Y(-150)} ${X(30)} ${Y(-140)}L${X(46)} ${Y(-170)}L${X(54)} ${Y(-186)}L${X(66)} ${Y(-170)}Q${X(100)} ${Y(-168)} ${X(120)} ${Y(-146)}L${X(98)} ${Y(-136)}Q${X(70)} ${Y(-130)} ${X(60)} ${Y(-110)}L${X(56)} ${Y(0)}Z" fill="${col}"/>`
    + `<path d="M${X(-60)} ${Y(0)}Q${X(-110)} ${Y(-20)} ${X(-130)} ${Y(-70)}Q${X(-100)} ${Y(-40)} ${X(-52)} ${Y(-44)}Z" fill="${dark}"/><path d="M${X(-30)} ${Y(-120)}Q${X(-20)} ${Y(-60)} ${X(10)} ${Y(-10)}" stroke="${dark}" stroke-width="${6 * k}" fill="none" stroke-linecap="round" opacity=".55"/>`
    + `<path d="M${X(46)} ${Y(-170)}L${X(54)} ${Y(-186)}L${X(66)} ${Y(-170)}Z" fill="${dark}"/><circle cx="${X(80)}" cy="${Y(-152)}" r="${5 * k}" fill="#2A160E"/><circle cx="${X(122)}" cy="${Y(-146)}" r="${5 * k}" fill="#2A160E"/><path d="M${X(58)} ${Y(-110)}L${X(56)} ${Y(0)}H${X(30)}V${Y(-90)}Z" fill="${dark}" opacity=".5"/></g>`;
}
/** Fontaine du Jardin Centenario : bassin de pierre, piedestal, deux coyotes dos a dos, jets (.mx-jet a animer). */
function mxCoyoteFountain(x, base, k) {
  let s = `<g class="mx-fountain"><ellipse cx="${x}" cy="${r1(base - 6 * k)}" rx="${330 * k}" ry="${64 * k}" fill="${MX.stone2}"/><ellipse cx="${x}" cy="${r1(base - 24 * k)}" rx="${330 * k}" ry="${64 * k}" fill="${MX.stone}"/><ellipse cx="${x}" cy="${r1(base - 30 * k)}" rx="${290 * k}" ry="${48 * k}" fill="#6FC2D6"/><ellipse cx="${x}" cy="${r1(base - 30 * k)}" rx="${290 * k}" ry="${48 * k}" fill="none" stroke="${shade(MX.stone, 0.3)}" stroke-width="${10 * k}"/><ellipse cx="${x}" cy="${r1(base - 28 * k)}" rx="${220 * k}" ry="${32 * k}" fill="#fff" opacity=".18"/>`;
  s += `<path d="M${x - 70 * k} ${base - 30 * k}L${x - 52 * k} ${base - 150 * k}H${x + 52 * k}L${x + 70 * k} ${base - 30 * k}Z" fill="${MX.stone}"/><path d="M${x - 80 * k} ${base - 150 * k}H${x + 80 * k}V${base - 176 * k}H${x - 80 * k}Z" fill="${shade(MX.stone, 0.18)}"/>`;
  s += mxCoyote(x - 22 * k, base - 176 * k, 0.9 * k, -1) + mxCoyote(x + 22 * k, base - 176 * k, 0.9 * k, 1);
  s += `<g class="mx-water" stroke="#CFF3FF" stroke-width="${5 * k}" stroke-linecap="round" fill="none">${[-250, -170, 170, 250].map((dx, i) => `<path class="mx-jet" data-i="${i}" d="M${x + dx * k} ${base - 30 * k}Q${x + dx * 0.9 * k} ${base - 130 * k} ${x + dx * 0.78 * k} ${base - 58 * k}" opacity=".8"/>`).join('')}</g>`;
  return s + '</g>';
}
/** Casa Azul (facade simplifiee, aucune enseigne) : murs cobalt, soubassement rouge, fenetres/porte a encadrement vert et creme, toit-terrasse, pots de plantes, cactus. */
function mxCasaAzul(x, base, w, h, opts) {
  opts = opts || {};
  let s = `<g class="mx-casa">${scRect(x, base - h, w, h, MX.cobalt)}${scRect(x + w - 26, base - h, 26, h, '#000', 'opacity=".12"')}${scRect(x, base - h, 14, h, MX.cobalt3, 'opacity=".45"')}`;
  s += scRect(x, base - 54, w, 54, MX.terra) + scRect(x, base - 58, w, 8, shade(MX.terra, 0.3), 'opacity=".7"');
  s += scRect(x - 12, base - h - 22, w + 24, 26, MX.crema2) + scRect(x - 12, base - h - 22, w + 24, 8, '#fff', 'opacity=".5"') + scRect(x - 12, base - h + 4, w + 24, 7, '#000', 'opacity=".18"');
  for (let i = 0; i < Math.floor(w / 44); i++) s += scRect(x + 8 + i * 44, base - h - 40, 28, 20, MX.cobalt2);
  const cols = opts.cols || 3, st = w / cols;
  for (let i = 0; i < cols; i++) {
    const cx = x + st * (i + 0.5), mid = i === Math.floor(cols / 2);
    if (mid) {
      s += `<path d="${archOpen(cx - 62, base, 124, 250)}" fill="${MX.crema}"/><path d="${archOpen(cx - 50, base, 100, 236)}" fill="${MX.verde}"/><path d="M${cx} ${base - 236}V${base}" stroke="#0E5A40" stroke-width="4"/><path d="${archOpen(cx - 42, base - 6, 36, 160)}" fill="#0E5A40" opacity=".35"/><path d="${archOpen(cx + 6, base - 6, 36, 160)}" fill="#0E5A40" opacity=".35"/><circle cx="${cx - 12}" cy="${base - 110}" r="4" fill="${MX.mostaza}"/><circle cx="${cx + 12}" cy="${base - 110}" r="4" fill="${MX.mostaza}"/>`;
    } else {
      const wy = base - h + 80, wh = Math.min(130, h - 220);
      s += scRect(cx - 52, wy - 12, 104, wh + 24, MX.crema, 'rx="8"') + scRect(cx - 42, wy, 84, wh, '#2A2148', 'rx="6"') + scRect(cx - 4, wy, 8, wh, MX.verde) + scRect(cx - 52, wy - 12, 12, wh + 24, MX.verde, 'opacity=".9"') + scRect(cx + 40, wy - 12, 12, wh + 24, MX.verde, 'opacity=".9"');
      s += `<path d="M${cx - 42} ${wy + wh * 0.5}h84" stroke="${MX.crema}" stroke-width="4" opacity=".7"/>`;
    }
  }
  // pots de plantes : agave + cactus + petits pots
  const pot = (px, c, big) => `<g><path d="M${px - 22} ${base}l5 -${big ? 54 : 40}h34l5 ${big ? 54 : 40}Z" fill="${c}"/><rect x="${px - 26}" y="${base - (big ? 60 : 46)}" width="52" height="10" rx="4" fill="${shade(c, 0.2)}"/><g transform="translate(${px} ${base - (big ? 60 : 46)})">${[-52, -26, 0, 26, 52].map((a, j) => `<path d="M0 0Q${a * 0.9} -${big ? 62 : 46} ${a * 1.5} -${(big ? 96 : 70) - Math.abs(a) * 0.4}Q${a * 0.5} -${big ? 40 : 30} 0 0Z" fill="${[MX.leaf, MX.leaf2, MX.leaf3][j % 3]}"/>`).join('')}</g></g>`;
  s += pot(x + st * 0.5 - 90, MX.terra, true) + pot(x + st * (cols - 0.5) + 90, MX.cobalt3, true);
  return s + '</g>';
}
/** Ballon (bouquet) : fil + ellipse + reflet. */
function mxBalloon(x, y, c, k) { return `<g class="mx-balloon"><path d="M${x} ${y + 40 * k}q-8 ${40 * k} ${4 * k} ${90 * k}" stroke="#F5E6C8" stroke-width="${2 * k}" fill="none" opacity=".8"/><ellipse cx="${x}" cy="${y}" rx="${26 * k}" ry="${32 * k}" fill="${c}"/><ellipse cx="${x - 9 * k}" cy="${y - 10 * k}" rx="${6 * k}" ry="${10 * k}" fill="#fff" opacity=".35"/><path d="M${x - 5 * k} ${y + 32 * k}h${10 * k}l-${5 * k} ${7 * k}Z" fill="${shade(c, -0.2)}"/></g>`; }
/** Etal de marche : toit a rayures, comptoir, auvent festonne ; pose a (x, base), largeur w. */
function mxStall(x, base, w, c1, c2) {
  const n = 8, sw = w / n; let aw = '';
  for (let i = 0; i < n; i++) aw += `<path d="M${r1(x + i * sw)} ${base - 250}h${r1(sw)}v52q-${r1(sw / 2)} 22 -${r1(sw)} 0Z" fill="${i % 2 ? c1 : c2}"/>`;
  return `<g class="mx-stall">${scRect(x + 12, base - 200, 12, 200, '#6B4A32')}${scRect(x + w - 24, base - 200, 12, 200, '#6B4A32')}<path d="M${x - 10} ${base - 250}L${x + 24} ${base - 300}H${x + w - 24}L${x + w + 10} ${base - 250}Z" fill="${c1}"/>${aw}${scRect(x + 6, base - 96, w - 12, 96, '#C98A52')}${scRect(x, base - 108, w, 16, '#E4B070')}${scRect(x + 6, base - 96, w - 12, 8, '#000', 'opacity=".12"')}</g>`;
}

// ---------------------------------------------------------------- panorama de Coyoacan (3200 x 1200) : fin d'apres-midi
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY, casa : { x, w } } (parallaxe : far .25, mid .6, near 1). Fontaine .mx-jet, soleil .sk-disc/.sk-rays. */
function coyoacanSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cy'), g = (n) => `${id}-${n}`, W = SKY.W, H = SKY.H, rnd = rng(opts.seed || 41), street = 800;
  let clouds = ''; [[300, 280, 560, 80], [1100, 180, 640, 90], [1900, 340, 520, 74], [2600, 220, 640, 88], [3000, 430, 420, 64]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 70 + i * 4, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F7FD0"/><stop offset=".3" stop-color="#6FB8E6"/><stop offset=".48" stop-color="#FBD7A0"/><stop offset=".62" stop-color="#FFA861"/><stop offset=".72" stop-color="#F07A55"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'cy-sky');
  const sx = opts.sunX || 1500, sy = opts.sunY || 520;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 40; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFC24A" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A47" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFE9A8" opacity=".1" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="420" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="74" fill="#FFF3B0"/>`, 'cy-sun');
  let hills = `M0 ${street}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(street - 110 - 56 * Math.sin(x / 360) - 26 * Math.sin(x / 130 + 1))}`; hills += `L${W} ${street}Z`;
  let farJ = ''; for (let i = 0; i < 12; i++) farJ += mxJacaranda(120 + i * 270 + rnd() * 90, street - 6, 0.55 + rnd() * 0.18).replace(/#9B6AD9|#7B4FC0|#BE98EE/g, (m) => shade(m, 0.28));
  const far = scSvg(W, H, `<path d="${hills}" fill="#D98A8C" opacity=".6"/>${farJ}${mxChurch(1750, street, 0.8, '#E3BFA0')}${scRect(0, street - 2, W, 14, '#C9786A')}`, 'cy-far');
  // milieu : maisons coloniales, kiosque, Parroquia au centre, Casa Azul a droite (x 2250 -> 2830)
  const tones = [MX.ochre, MX.rosa, MX.turq, MX.mostaza, MX.crema2, '#E58B5B'];
  let houses = '', x = -20, k = 0; const CAS = { x: 1660, w: 780 };
  while (x < W) {
    if (x > 380 && x < 880) { x = 880; continue; }              // trou : la Parroquia
    if (x > 1000 && x < 1330) { x = 1330; continue; }           // trou : le kiosque
    if (x > CAS.x - 40 && x < CAS.x + CAS.w + 30) { x = CAS.x + CAS.w + 40; continue; }
    const w = 170 + rnd() * 120, h = 150 + rnd() * 110;
    houses += mxHouse(x, street, w, h, tones[k++ % tones.length], Math.round(x) + 5, { door: rnd() < 0.5 ? 1 : -1 });
    if (rnd() < 0.5) houses += mxJacaranda(x + w + 22, street, 0.7 + rnd() * 0.3);
    x += w + 16;
  }
  const mid = scSvg(W, H, `${mxChurch(630, street, 1.0)}${houses}${mxKiosk(1165, street, 0.85)}${mxCasaAzul(CAS.x, street, CAS.w, 400)}${scRect(0, street, W, 400, '#B58A60')}${scRect(0, street + 38, W, 5, '#fff', 'opacity=".25"')}`, 'cy-mid');
  // premier plan : chaussee pavee, Jardin Centenario (fontaine aux coyotes), branche de jacaranda en surplomb, bancs
  let bench = (bx) => `<g><rect x="${bx}" y="1020" width="200" height="18" rx="6" fill="#6B4A32"/><rect x="${bx + 8}" y="990" width="184" height="12" rx="5" fill="#6B4A32"/><path d="M${bx + 20} 1038v46M${bx + 180} 1038v46M${bx + 20} 990v30M${bx + 180} 990v30" stroke="#2A2A3A" stroke-width="8"/></g>`;
  const near = scSvg(W, H, `${mxCobbles(W, 880, 1200, 17, '#A8896A', '#6F5438')}${scRect(0, 868, W, 16, '#8E7358')}${scRect(0, 868, W, 5, '#fff', 'opacity=".3"')}${mxCoyoteFountain(640, 1010, 0.82)}${bench(1120)}${bench(2040)}${(() => { let p = ''; for (let i = 0; i < 70; i++) p += `<ellipse cx="${r1(rnd() * W)}" cy="${r1(900 + rnd() * 290)}" rx="${r1(5 + rnd() * 6)}" ry="${r1(3 + rnd() * 3)}" fill="${i % 3 ? MX.jac2 : MX.jac}" opacity=".85" transform="rotate(${Math.round(rnd() * 180)} 0 0)"/>`; return p; })()}
<g transform="translate(-40 -50)"><path d="M0 70Q240 40 460 170" stroke="#5A4034" stroke-width="28" fill="none" stroke-linecap="round"/>${[[110, 90, 80], [250, 120, 70], [350, 170, 60], [60, 150, 66], [210, 188, 58]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${[MX.jac, MX.jac2, MX.jac3][i % 3]}"/>`).join('')}</g>
<g transform="translate(2640 -40)"><path d="M520 40Q320 30 100 180" stroke="#5A4034" stroke-width="28" fill="none" stroke-linecap="round"/>${[[400, 90, 74], [280, 140, 66], [170, 180, 58], [470, 140, 56]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${[MX.jac, MX.jac2, MX.jac3][i % 3]}"/>`).join('')}</g>`, 'cy-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy, casa: CAS };
}

// ---------------------------------------------------------------- Plaza Hidalgo (3200 x 1200) : decor de scene (kiosque, Parroquia, etals a ballons, jacarandas, pave)
const PLAZA = { W: 3200, H: 1200, floor: 930, kiosk: { x: 1500 } };
/** Retourne { back, front, light, W, H, floor, kiosk, balloons : [{ x, y, c }] }. Les ballons ne sont PAS dans le SVG : les poser avec mxBalloonSvg (elements DOM animables). */
function plazaHidalgo(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ph'), g = (n) => `${id}-${n}`, W = PLAZA.W, H = PLAZA.H, fl = PLAZA.floor, rnd = rng(opts.seed || 52);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3C8FDB"/><stop offset=".45" stop-color="#8CCBEE"/><stop offset=".78" stop-color="#FFE2B0"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  let houses = '', x = -60, k = 0; const tones = [MX.ochre, MX.rosa, MX.turq, MX.mostaza, MX.crema2, '#E58B5B'];
  while (x < W) { if (x > 980 && x < 1980) { x = 1980; continue; } const w = 220 + rnd() * 120, h = 260 + rnd() * 90; houses += mxHouse(x, fl - 30, w, h, tones[k++ % tones.length], Math.round(x) + 9, { door: 1 }); x += w + 14; }
  // etals de ballons / vendeurs, bancs, lampadaires
  const stalls = mxStall(210, fl + 50, 330, MX.rosa, MX.crema) + mxStall(2560, fl + 50, 340, MX.turq, MX.crema);
  const balloons = [[330, 560, MX.rojo], [372, 520, MX.mostaza], [418, 566, MX.turq], [2690, 540, MX.rosa], [2740, 500, MX.mostaza], [2790, 552, MX.cobalt3], [2640, 580, MX.rojo]].map((b) => ({ x: b[0], y: b[1], c: b[2] }));
  const lamp = (lx) => `<g class="mx-lamp"><path d="M${lx} ${fl + 40}V${fl - 330}" stroke="#2A2A3A" stroke-width="12"/><path d="M${lx - 30} ${fl - 330}h60l-8 -34h-44Z" fill="#2A2A3A"/><rect x="${lx - 22}" y="${fl - 400}" width="44" height="52" rx="8" fill="#FFE9A8" opacity=".9"/></g>`;
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(600, 150, 520, 74, 81, 'front')}${cloudSvg(2300, 120, 600, 84, 83, 'front')}
${mxChurch(1500, fl - 40, 1.35)}${houses}${mxJacaranda(960, fl - 20, 1.5)}${mxJacaranda(2040, fl - 20, 1.6)}${mxJacaranda(120, fl - 20, 1.2)}${mxJacaranda(3100, fl - 20, 1.3)}
${mxKiosk(PLAZA.kiosk.x, fl + 40, 1.1)}${lamp(1010)}${lamp(1990)}${stalls}
${mxCobbles(W, fl, H, 29, '#B59471', '#7A5C3E')}${scRect(0, fl - 8, W, 14, '#8E7358')}
<g opacity=".5"><path d="M0 ${fl + 120}H${W}" stroke="#6F5438" stroke-width="3" opacity=".3"/></g>`, 'ph-back');
  const flowerBed = (fx) => `<g>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${fx + i * 36}" cy="${H - 40 + (i % 2) * 8}" r="${24 + (i % 3) * 5}" fill="${[MX.leaf, MX.leaf2, MX.leaf3][i % 3]}"/>`).join('')}${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${fx - 10 + i * 30}" cy="${H - 62 + (i % 3) * 10}" r="9" fill="${[MX.rosa, MX.mostaza, MX.rojo][i % 3]}"/>`).join('')}</g>`;
  const front = scSvg(W, H, `${flowerBed(40)}${flowerBed(3000)}`, 'ph-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M2200 0L2900 0L2300 ${H}L1500 ${H}Z" opacity=".5"/></g>`, 'ph-light');
  return { back, front, light, W, H, floor: fl, kiosk: PLAZA.kiosk, balloons };
}
/** Facade de la Casa Azul isolee (SVG 780 x 500, sans enseigne ni decor) pour les capsules en papier decoupe. opts : width, uid. */
function casaAzulFachada(opts) {
  opts = opts || {};
  const W = opts.width || 780;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" width="${W}" height="${Math.round((W * 500) / 780)}" class="mx-fachada" style="overflow:visible" aria-hidden="true">${mxCasaAzul(30, 470, 720, 400, { cols: 3 })}${scRect(0, 470, 780, 18, MX.stone2)}</svg>`;
}
/** Ballon autonome (SVG 80x180, centre du ballon en 40,40) a poser comme element DOM anime (pas dans un gros calque SVG). opts : c (couleur), width. */
function mxBalloonSvg(opts) {
  opts = opts || {};
  const W = opts.width || 80;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 180" width="${W}" height="${Math.round(W * 2.25)}" class="mx-balloon" style="overflow:visible" aria-hidden="true">${mxBalloon(40, 40, opts.c || MX.rojo, 1.4)}</svg>`;
}

// ---------------------------------------------------------------- patio de la Casa Azul (2400 x 1200) : murs cobalt, patio de plantes, galerie d'autoportraits
const CASAP = { W: 2400, H: 1200, floor: 900, door: { x: 1960, y: 440, w: 200, h: 460 }, frames: [{ x: 300, y: 250, w: 250, h: 320 }, { x: 640, y: 250, w: 250, h: 320 }, { x: 980, y: 250, w: 250, h: 320 }, { x: 1320, y: 250, w: 250, h: 320 }] };
/** Retourne { back, front, light, W, H, floor, door, frames }. Les 4 autoportraits du mur sont PRODUITS par la composition (QArt.autorretrato) pour pouvoir etre animes. */
function casaAzulPatio(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cp'), g = (n) => `${id}-${n}`, W = CASAP.W, H = CASAP.H, fl = CASAP.floor, D = CASAP.door, rnd = rng(opts.seed || 63);
  // mur cobalt + soubassement + poutres de la galerie
  let wall = scRect(0, 0, W, fl + 6, MX.cobalt) + scRect(0, 0, W, 150, MX.cobalt2) + scRect(0, 140, W, 14, MX.crema2) + scRect(0, 150, W, 10, '#000', 'opacity=".2"');
  for (let i = 0; i < 12; i++) wall += scRect(i * 210 + 20, 20, 150, 100, MX.cobalt3, 'opacity=".18" rx="6"');
  wall += scRect(0, fl - 70, W, 70, MX.terra) + scRect(0, fl - 76, W, 8, shade(MX.terra, 0.3), 'opacity=".7"');
  // porte verte du fond (a droite) + ciel dans l'ouverture haute
  const door = `<path d="${archOpen(D.x - 18, fl, D.w + 36, D.h + 30)}" fill="${MX.crema}"/><path d="${archOpen(D.x, fl, D.w, D.h)}" fill="#26180F"/>`;
  // plantes : agaves, cactus, fougeres dans des pots cobalt/terracotta
  const agave = (ax, ay, k, c) => `<g transform="translate(${ax} ${ay}) scale(${k})">${[-70, -44, -20, 0, 20, 44, 70].map((a, j) => `<path d="M0 0Q${a * 1.1} -70 ${a * 1.9} ${-150 + Math.abs(a) * 0.9}Q${a * 0.6} -50 0 0Z" fill="${[MX.leaf, MX.leaf2, MX.leaf3][j % 3]}" transform="rotate(${a * 0.1})"/>`).join('')}</g>`;
  const cactus = (cx, cy, k) => `<g transform="translate(${cx} ${cy}) scale(${k})"><rect x="-26" y="-250" width="52" height="250" rx="26" fill="${MX.leaf}"/><rect x="-26" y="-250" width="16" height="250" rx="8" fill="${MX.leaf2}" opacity=".5"/><path d="M-26 -150h-40v-70a20 20 0 0 1 40 0Z" fill="${MX.leaf}"/><path d="M26 -110h40v-90a20 20 0 0 0 -40 0Z" fill="${MX.leaf}"/>${[-200, -160, -120, -80, -40].map((y, j) => `<path d="M-2 ${y}h4" stroke="#F5E6C8" stroke-width="3"/>`).join('')}<circle cx="0" cy="-258" r="12" fill="${MX.rosa}"/></g>`;
  const pot = (px, py, c, w) => `<g><path d="M${px - w / 2} ${py}l${w * 0.08} ${-w * 0.7}h${w * 0.84}l${w * 0.08} ${w * 0.7}Z" fill="${c}"/><rect x="${px - w * 0.56}" y="${py - w * 0.78}" width="${w * 1.12}" height="${w * 0.16}" rx="${w * 0.06}" fill="${shade(c, 0.2)}"/></g>`;
  let plants = '';
  [[120, 1], [1630, 1.1], [2260, 1.2]].forEach((p, i) => { plants += pot(p[0], fl + 14, i % 2 ? MX.terra : MX.cobalt3, 130 * p[1]) + agave(p[0], fl - 90 * p[1], 1.2 * p[1]); });
  plants += cactus(1740, fl + 6, 0.95) + cactus(240, fl + 6, 0.8);
  // sol : dalles de pierre volcanique + chemin
  const floor = `<path d="M0 ${fl}H${W}L${W + 400} ${H}H-400Z" fill="#8E7B6C"/>` + (() => { let l = ''; for (let i = 0; i < 12; i++) { const y = fl + Math.pow(i / 12, 1.4) * (H - fl); l += `<path d="M-400 ${r1(y)}H${W + 400}" stroke="#5A4A3E" stroke-width="3" opacity=".4"/>`; } for (let i = -6; i < 16; i++) l += `<path d="M${i * 190} ${fl}L${i * 190 + (i - 5) * 70} ${H}" stroke="#5A4A3E" stroke-width="3" opacity=".3"/>`; return l; })();
  const back = scSvg(W, H, `${wall}${door}${plants}${floor}`, 'cp-back');
  // premier plan : pots et feuilles en bas ; papel picado reserve a QCine.frame (garland)
  const leaf = (a, c, k) => `<path d="M0 0Q${52 * k} -90 0 -190Q${-52 * k} -90 0 0Z" fill="${c}" transform="rotate(${a})"/><path d="M0 -10V-170" stroke="#fff" stroke-width="3" opacity=".3" transform="rotate(${a})"/>`;
  const front = scSvg(W, H, [[110, 1110, 1.3, MX.cobalt3], [2290, 1100, 1.4, MX.terra]].map((p) => `<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><path d="M-70 0h140l-18 -150h-104Z" fill="${p[3]}"/><rect x="-78" y="-164" width="156" height="22" rx="8" fill="${shade(p[3], 0.2)}"/><g transform="translate(0 -160)">${[-62, -34, -8, 18, 44, 66].map((a, j) => leaf(a, [MX.leaf, MX.leaf2, MX.leaf3][j % 3], 0.9 + (j % 2) * 0.15)).join('')}</g></g>`).join(''), 'cp-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M900 150L1700 150L1900 ${H}L520 ${H}Z" opacity=".4"/></g>`, 'cp-light');
  return { back, front, light, W, H, floor: fl, door: D, frames: CASAP.frames };
}

// ---------------------------------------------------------------- autoportrait encadre (figure GENERIQUE : fleurs dans les cheveux, nattes, col brode) 250 x 320 par defaut
/** opts : width, uid, bg (couleur du fond de toile), state 'full' (visage + couleurs) | 'erased' (visage efface par la Sombra : tache grise, couleurs eteintes) | 'blank' (cadre vide : plus de figure, fond gris, seul .ar-glow vert a allumer). .ar-fig = toute la figure (opacity). Groupes animables :
 *  .ar-face (visage), .ar-dim (voile gris eteint ; opacity 1 -> 0 pour rendre les couleurs), .ar-smudge (tache grise du visage ; 1 -> 0), .ar-glow (halo vert de la plume). */
function autorretrato(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ar'), g = (n) => `${id}-${n}`, W = 250, H = 320, st = opts.state || 'full', ow = opts.width || W, oh = Math.round((ow * H) / W);
  const erased = st === 'erased' || st === 'blank', blank = st === 'blank';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${ow}" height="${oh}" class="ar-svg" style="overflow:visible" aria-hidden="true"><defs><clipPath id="${g('c')}"><rect x="22" y="22" width="206" height="276" rx="6"/></clipPath><radialGradient id="${g('gl')}"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".95"/><stop offset=".5" stop-color="#42E0A0" stop-opacity=".4"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>
<rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="#C99A4E"/><rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="10" fill="#E8C078"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="8" fill="#8E5A22"/>
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${20 + i * 30}" cy="11" r="4" fill="#FFE9A8"/><circle cx="${20 + i * 30}" cy="${H - 11}" r="4" fill="#FFE9A8"/>`).join('')}
<g clip-path="url(#${g('c')})"><rect x="22" y="22" width="206" height="276" fill="${opts.bg || '#1F7F6A'}"/>
${[[40, 80, 52, 120], [210, 70, 60, 150], [30, 220, 70, 100], [220, 230, 64, 110]].map((l, i) => `<path d="M${l[0]} ${l[1] + l[3]}Q${l[0] - l[2]} ${l[1] + l[3] * 0.4} ${l[0]} ${l[1]}Q${l[0] + l[2]} ${l[1] + l[3] * 0.4} ${l[0]} ${l[1] + l[3]}Z" fill="${['#0E5A40', '#2C8F58', '#0E5A40', '#2C8F58'][i]}"/>`).join('')}
<g class="ar-fig" opacity="${blank ? 0 : 1}"><path d="M62 300Q60 236 100 214L150 214Q190 236 188 300Z" fill="#F5E6C8"/><path d="M96 214Q125 244 154 214L150 232Q125 262 100 232Z" fill="#D93472"/><path d="M80 280Q125 266 170 280" stroke="#D93472" stroke-width="7" fill="none"/><g fill="#FFC83D"><circle cx="100" cy="268" r="5"/><circle cx="125" cy="274" r="5"/><circle cx="150" cy="268" r="5"/></g>
<path d="M72 150Q70 90 125 82Q180 90 178 150Q176 230 125 238Q74 230 72 150Z" fill="#1E120C"/>
<g class="ar-face"><ellipse cx="125" cy="168" rx="46" ry="56" fill="#D2956B"/><path d="M84 140Q102 130 118 138M132 138Q148 130 166 140" stroke="#1E120C" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="#FFFBF0"><ellipse cx="106" cy="158" rx="11" ry="9"/><ellipse cx="144" cy="158" rx="11" ry="9"/></g><g fill="#2A160E"><circle cx="107" cy="158" r="5.5"/><circle cx="145" cy="158" r="5.5"/></g><path d="M125 164q-6 14 0 18q6 2 9 -2" stroke="#A8683F" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M106 198Q125 210 144 198" stroke="#8F1D4E" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="92" cy="180" r="9" fill="#FF7A7A" opacity=".3"/><circle cx="158" cy="180" r="9" fill="#FF7A7A" opacity=".3"/></g>
<ellipse class="ar-smudge" cx="125" cy="168" rx="48" ry="58" fill="#7A7C86" opacity="${erased ? 0.95 : 0}"/>
<path d="M72 130Q125 66 178 130" stroke="#1E120C" stroke-width="22" fill="none"/><g>${[[86, 98, '#D93472'], [118, 80, '#FFC83D'], [152, 86, '#19B7AA'], [174, 110, '#FF7FB0']].map((f) => `<circle cx="${f[0]}" cy="${f[1]}" r="12" fill="${f[2]}"/><circle cx="${f[0]}" cy="${f[1]}" r="4" fill="#FFF3B0"/>`).join('')}</g>
</g><rect class="ar-dim" x="22" y="22" width="206" height="276" fill="#6E707C" opacity="${blank ? 0.9 : erased ? 0.86 : 0}"/><ellipse class="ar-glow" cx="125" cy="170" rx="130" ry="150" fill="url(#${g('gl')})" opacity="0"/></g></svg>`;
}

// ---------------------------------------------------------------- accessoires de capsule (papier decoupe) : singe, perroquet, xoloitzcuintle, miroir a main, cadre vide
/** key : 'mono' | 'loro' | 'xolo' | 'espejo' | 'cadre'. opts : width, uid. Meme API que prop() (09-props.js). */
function mxProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('mp'), W = opts.width || 200;
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round(W * h)}" class="mx-prop mx-${key}" aria-hidden="true">${inner}</svg>`;
  if (key === 'mono') return mk('0 0 200 240', 1.2, `<path d="M150 200Q220 190 196 130Q186 100 166 118" stroke="#6B4222" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="170" rx="56" ry="62" fill="#8A5A32"/><ellipse cx="100" cy="184" rx="34" ry="40" fill="#D9A878"/><circle cx="100" cy="90" r="50" fill="#8A5A32"/><circle cx="52" cy="90" r="18" fill="#8A5A32"/><circle cx="148" cy="90" r="18" fill="#8A5A32"/><circle cx="52" cy="90" r="9" fill="#D9A878"/><circle cx="148" cy="90" r="9" fill="#D9A878"/><ellipse cx="100" cy="102" rx="34" ry="30" fill="#D9A878"/><circle cx="84" cy="88" r="7" fill="#2A160E"/><circle cx="116" cy="88" r="7" fill="#2A160E"/><circle cx="86" cy="86" r="2.5" fill="#fff"/><circle cx="118" cy="86" r="2.5" fill="#fff"/><ellipse cx="94" cy="108" rx="3.5" ry="2.5" fill="#6B4222"/><ellipse cx="106" cy="108" rx="3.5" ry="2.5" fill="#6B4222"/><path d="M86 120Q100 130 114 120" stroke="#6B4222" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 210Q56 232 74 232M140 210Q144 232 126 232" stroke="#6B4222" stroke-width="14" fill="none" stroke-linecap="round"/>`);
  if (key === 'loro') return mk('0 0 200 260', 1.3, `<path d="M118 190Q150 250 120 256Q110 230 100 200Z" fill="#D81E3A"/><path d="M92 190Q86 250 70 256Q60 232 74 190Z" fill="#2F6FD0"/><path d="M70 120Q66 200 100 206Q146 200 142 120Q138 56 100 54Q74 56 70 120Z" fill="#1FA85A"/><path d="M82 150Q96 190 124 160" fill="none" stroke="#FFC83D" stroke-width="12" stroke-linecap="round"/><path d="M142 130Q176 150 168 196Q150 176 138 168Z" fill="#2F6FD0"/><circle cx="100" cy="86" r="34" fill="#E8D030"/><circle cx="88" cy="80" r="10" fill="#fff"/><circle cx="90" cy="80" r="5" fill="#2A160E"/><path d="M104 86Q140 80 138 108Q120 116 104 100Z" fill="#F4F0E0"/><path d="M104 86Q130 82 138 100Q116 100 104 94Z" fill="#E8A83C"/><path d="M70 60Q82 30 96 56" fill="#D81E3A"/>`);
  if (key === 'xolo') return mk('0 0 260 220', 0.85, `<path d="M214 150Q250 130 244 90" stroke="#4A4F5C" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M60 100Q40 40 76 40L96 60Z" fill="#3F4450"/><path d="M60 110Q60 70 130 70Q210 70 214 130Q214 170 190 170L70 170Q46 170 60 110Z" fill="#5A6070"/><path d="M60 170L56 210H84L90 170Z M170 170L168 210H196L200 170Z" fill="#4A4F5C"/><path d="M60 110Q30 100 24 128Q22 150 50 150Q70 148 76 130Z" fill="#5A6070"/><path d="M96 56Q100 20 124 34Q132 60 118 80Z" fill="#3F4450"/><circle cx="68" cy="116" r="6" fill="#1A1A22"/><ellipse cx="30" cy="132" rx="10" ry="8" fill="#1A1A22"/><path d="M84 96Q94 82 104 96" stroke="#FFC9B0" stroke-width="4" fill="none" opacity=".6"/>`);
  if (key === 'espejo') return mk('0 0 160 300', 1.9, `<rect x="68" y="150" width="24" height="140" rx="12" fill="#C99A4E"/><circle cx="80" cy="84" r="68" fill="#E8C078"/><circle cx="80" cy="84" r="54" fill="#CFE9F5"/><path d="M42 60Q60 36 92 36" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".7"/><g fill="#C99A4E">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${r1(80 + Math.cos((i / 8) * 6.283) * 62)}" cy="${r1(84 + Math.sin((i / 8) * 6.283) * 62)}" r="7"/>`).join('')}</g>`);
  return mk('0 0 200 240', 1.2, `<rect x="6" y="6" width="188" height="228" rx="10" fill="#C99A4E"/><rect x="18" y="18" width="164" height="204" rx="6" fill="#E8C078"/><rect x="30" y="30" width="140" height="180" rx="4" fill="#1F7F6A"/>`);
}

// ---------------------------------------------------------------- decors et accessoires de l'evenement Dia de Muertos (Oaxaca) : panorama de rue au crepuscule, patio de nuit avec petit autel,
// ofrenda a trois etages (fotos, velas, flores, pan de muerto, comida), chemin de petales de cempasuchil, calaveras de azucar, Catrina, sceau de laurier.
// Respectueux et joyeux : calaveras souriantes et colorees, aucune imagerie effrayante. Prefixe `ox` pour tout helper interne (un seul scope avec les autres fichiers du kit).
// Aucun texte, aucune marque. Lueurs de bougies = halos (.of-glow) a faire respirer lentement ; flammes = .of-flame (data-px/data-py = pied de la flamme).

const OX = { ocre: '#E8A33A', rosa: '#E0699A', turq: '#19B7AA', azul: '#4F8FE8', terra: '#C9573B', amar: '#FFC83D', viol: '#9A5FD0', naranja: '#FF9F1C', magenta: '#D93472', noche: '#14123F' };

function oxGlowDef(id, c) { return `<radialGradient id="${id}"><stop offset="0" stop-color="${c || '#FFC96A'}" stop-opacity=".55"/><stop offset=".5" stop-color="${c || '#FFC96A'}" stop-opacity=".18"/><stop offset="1" stop-color="${c || '#FFC96A'}" stop-opacity="0"/></radialGradient>`; }

/** Bougie : pied en (x, y), hauteur h, echelle k. Groupe .of-vela > .of-glow (halo), .of-flame (flamme, pivot au pied). gid = id d'un radialGradient (oxGlowDef). */
function oxCandle(x, y, h, gid, k) {
  k = k || 1;
  const w = 18 * k, fh = 34 * k, fy = y - h - 4, tip = fy - fh;
  return `<g class="of-vela" data-px="${r1(x)}" data-py="${r1(y)}"><circle class="of-glow" cx="${r1(x)}" cy="${r1(fy - fh * 0.4)}" r="${r1(74 * k)}" fill="url(#${gid})"/>` +
    `<rect x="${r1(x - w / 2)}" y="${r1(y - h)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(4 * k)}" fill="#FFF3D1"/><rect x="${r1(x + w * 0.1)}" y="${r1(y - h)}" width="${r1(w * 0.4)}" height="${r1(h)}" rx="${r1(3 * k)}" fill="#E8D2A0" opacity=".7"/>` +
    `<path d="M${r1(x)} ${r1(y - h)}v${r1(-5 * k)}" stroke="#3B2216" stroke-width="${r1(3 * k)}"/>` +
    `<g class="of-flame" data-px="${r1(x)}" data-py="${r1(fy)}"><path d="M${r1(x)} ${r1(tip)}C${r1(x + 12 * k)} ${r1(tip + fh * 0.4)} ${r1(x + 10 * k)} ${r1(fy)} ${r1(x)} ${r1(fy)}C${r1(x - 10 * k)} ${r1(fy)} ${r1(x - 12 * k)} ${r1(tip + fh * 0.4)} ${r1(x)} ${r1(tip)}Z" fill="#FF9F1C"/>` +
    `<path d="M${r1(x)} ${r1(tip + fh * 0.3)}C${r1(x + 6 * k)} ${r1(tip + fh * 0.55)} ${r1(x + 5 * k)} ${r1(fy)} ${r1(x)} ${r1(fy)}C${r1(x - 5 * k)} ${r1(fy)} ${r1(x - 6 * k)} ${r1(tip + fh * 0.55)} ${r1(x)} ${r1(tip + fh * 0.3)}Z" fill="#FFE9A8"/></g></g>`;
}

/** Rangee de fanions de papel picado (zigzag + decoupes) : corde de x0 a x0+w en y0, n fanions de hauteur fh. */
function oxFlags(x0, y0, w, n, seed, cols, fh) {
  const rnd = rng(seed), step = w / n, fw = step * 0.84;
  let s = `<path d="M${r1(x0)} ${r1(y0)}H${r1(x0 + w)}" stroke="#F5E6C8" stroke-width="3" opacity=".85"/>`;
  for (let i = 0; i < n; i++) {
    const cx = x0 + step * (i + 0.5), xa = cx - fw / 2, xb = cx + fw / 2, hh = fh * (0.9 + rnd() * 0.15), c = cols[i % cols.length], teeth = 5, tw = fw / teeth;
    let d = `M${r1(xa)} ${r1(y0)}H${r1(xb)}V${r1(y0 + hh - 10)}`;
    for (let t = teeth; t > 0; t--) d += `L${r1(xa + tw * (t - 0.5))} ${r1(y0 + hh)}L${r1(xa + tw * (t - 1))} ${r1(y0 + hh - 10)}`;
    d += 'Z' + circlePath(cx, y0 + hh * 0.46, fw * 0.17) + diamondPath(cx, y0 + hh * 0.2, fw * 0.07, fw * 0.1) + diamondPath(cx, y0 + hh * 0.74, fw * 0.07, fw * 0.1) + starPath(cx - fw * 0.28, y0 + hh * 0.46, fw * 0.1, fw * 0.045, 4, 0) + starPath(cx + fw * 0.28, y0 + hh * 0.46, fw * 0.1, fw * 0.045, 4, 0);
    s += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="${d}" fill="${c}" fill-rule="evenodd"/></g>`;
  }
  return s;
}

/** Calavera de azucar souriante (centre cx, cy, rayon r) : yeux a petales, nez, sourire a dents, fleurs au front. pal = 3 couleurs. */
function oxCalavera(cx, cy, r, pal) {
  pal = pal || [OX.magenta, OX.turq, OX.amar];
  let s = `<ellipse cx="${r1(cx)}" cy="${r1(cy + r * 0.78)}" rx="${r1(r * 0.62)}" ry="${r1(r * 0.42)}" fill="#FFF6E4"/><ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(r)}" ry="${r1(r * 1.02)}" fill="#FFF6E4"/><ellipse cx="${r1(cx + r * 0.22)}" cy="${r1(cy + r * 0.1)}" rx="${r1(r * 0.7)}" ry="${r1(r * 0.85)}" fill="#EBD9B8" opacity=".35"/>`;
  s += `<path d="M${r1(cx - r * 0.5)} ${r1(cy - r * 0.62)}Q${r1(cx)} ${r1(cy - r * 0.95)} ${r1(cx + r * 0.5)} ${r1(cy - r * 0.62)}" stroke="${pal[0]}" stroke-width="${r1(r * 0.1)}" fill="none" stroke-linecap="round"/>`;
  s += `<path d="${diamondPath(r1(cx), r1(cy - r * 0.68), r1(r * 0.1), r1(r * 0.16))}" fill="${pal[2]}"/><circle cx="${r1(cx - r * 0.62)}" cy="${r1(cy - r * 0.35)}" r="${r1(r * 0.07)}" fill="${pal[1]}"/><circle cx="${r1(cx + r * 0.62)}" cy="${r1(cy - r * 0.35)}" r="${r1(r * 0.07)}" fill="${pal[1]}"/>`;
  [-1, 1].forEach((sx, k) => {
    const ex = cx + sx * r * 0.38, ey = cy - r * 0.08;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; s += `<ellipse cx="${r1(ex + Math.cos(a) * r * 0.31)}" cy="${r1(ey + Math.sin(a) * r * 0.31)}" rx="${r1(r * 0.09)}" ry="${r1(r * 0.06)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(ex + Math.cos(a) * r * 0.31)} ${r1(ey + Math.sin(a) * r * 0.31)})" fill="${pal[k ? 0 : 2]}"/>`; }
    s += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(r * 0.26)}" fill="${pal[k ? 1 : 0]}"/><circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(r * 0.17)}" fill="#2A1040"/><circle cx="${r1(ex + r * 0.05)}" cy="${r1(ey - r * 0.05)}" r="${r1(r * 0.05)}" fill="#fff"/>`;
  });
  s += `<path d="M${r1(cx)} ${r1(cy + r * 0.2)}l${r1(-r * 0.09)} ${r1(r * 0.17)}h${r1(r * 0.18)}Z" fill="#2A1040"/>`;
  s += `<path d="M${r1(cx - r * 0.5)} ${r1(cy + r * 0.52)}Q${r1(cx)} ${r1(cy + r * 0.86)} ${r1(cx + r * 0.5)} ${r1(cy + r * 0.52)}" stroke="#2A1040" stroke-width="${r1(r * 0.055)}" fill="none" stroke-linecap="round"/>`;
  for (let i = -2; i <= 2; i++) s += `<path d="M${r1(cx + i * r * 0.17)} ${r1(cy + r * 0.62 + Math.abs(i) * r * 0.025)}v${r1(r * 0.17)}" stroke="#2A1040" stroke-width="${r1(r * 0.04)}" stroke-linecap="round"/>`;
  s += `<circle cx="${r1(cx - r * 0.7)}" cy="${r1(cy + r * 0.3)}" r="${r1(r * 0.09)}" fill="${pal[0]}"/><circle cx="${r1(cx + r * 0.7)}" cy="${r1(cy + r * 0.3)}" r="${r1(r * 0.09)}" fill="${pal[0]}"/>`;
  return `<g class="ox-skull">${s}</g>`;
}

/** Catrina stylisee (buste) : base en (cx, baseY), echelle k. Grand chapeau a fleurs, calavera, col a volants. */
function oxCatrina(cx, baseY, k) {
  const hy = baseY - 300 * k, r = 62 * k;
  let s = `<path d="M${r1(cx - 150 * k)} ${r1(baseY)}Q${r1(cx - 140 * k)} ${r1(baseY - 150 * k)} ${r1(cx - 40 * k)} ${r1(baseY - 190 * k)}H${r1(cx + 40 * k)}Q${r1(cx + 140 * k)} ${r1(baseY - 150 * k)} ${r1(cx + 150 * k)} ${r1(baseY)}Z" fill="${OX.magenta}"/>`;
  for (let i = 0; i < 7; i++) s += `<circle cx="${r1(cx - 108 * k + i * 36 * k)}" cy="${r1(baseY - 176 * k + Math.abs(3 - i) * 8 * k)}" r="${r1(22 * k)}" fill="${i % 2 ? OX.turq : OX.amar}"/>`;
  s += `<path d="M${r1(cx - 30 * k)} ${r1(baseY - 200 * k)}h${r1(60 * k)}v${r1(34 * k)}h${r1(-60 * k)}Z" fill="#FFF6E4"/>` + oxCalavera(cx, hy, r, [OX.turq, OX.magenta, OX.amar]);
  s += `<ellipse cx="${r1(cx)}" cy="${r1(hy - r * 0.78)}" rx="${r1(160 * k)}" ry="${r1(30 * k)}" fill="#2A1040"/><path d="M${r1(cx - 76 * k)} ${r1(hy - r * 0.8)}Q${r1(cx - 70 * k)} ${r1(hy - 150 * k)} ${r1(cx)} ${r1(hy - 150 * k)}Q${r1(cx + 70 * k)} ${r1(hy - 150 * k)} ${r1(cx + 76 * k)} ${r1(hy - r * 0.8)}Z" fill="#3B1B5C"/><path d="M${r1(cx - 76 * k)} ${r1(hy - r * 0.8)}H${r1(cx + 76 * k)}" stroke="${OX.magenta}" stroke-width="${r1(14 * k)}"/>`;
  s += `<path d="M${r1(cx + 40 * k)} ${r1(hy - 140 * k)}Q${r1(cx + 150 * k)} ${r1(hy - 230 * k)} ${r1(cx + 190 * k)} ${r1(hy - 120 * k)}Q${r1(cx + 120 * k)} ${r1(hy - 160 * k)} ${r1(cx + 40 * k)} ${r1(hy - 110 * k)}Z" fill="${OX.turq}"/>`;
  s += marigoldFlower(cx - 60 * k, hy - 124 * k, 24 * k, OX.naranja, OX.amar) + marigoldFlower(cx + 4 * k, hy - 146 * k, 26 * k, OX.naranja, OX.amar) + marigoldFlower(cx + 60 * k, hy - 118 * k, 22 * k, OX.rosa, '#FF9AC1');
  return `<g class="ox-catrina">${s}</g>`;
}

/** Pan de muerto : miche doree, os en croix, boule au centre, sucre. */
function oxPan(cx, cy, r) {
  let s = `<ellipse cx="${r1(cx)}" cy="${r1(cy + r * 0.1)}" rx="${r1(r)}" ry="${r1(r * 0.72)}" fill="#B8672F"/><ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(r)}" ry="${r1(r * 0.72)}" fill="#E39A4E"/><ellipse cx="${r1(cx - r * 0.2)}" cy="${r1(cy - r * 0.2)}" rx="${r1(r * 0.55)}" ry="${r1(r * 0.3)}" fill="#F2B772" opacity=".7"/>`;
  [[-1, -0.1], [1, -0.1], [-0.6, 0.45], [0.6, 0.45]].forEach((b) => { s += `<path d="M${r1(cx)} ${r1(cy)}L${r1(cx + b[0] * r * 0.82)} ${r1(cy + b[1] * r * 0.6)}" stroke="#F2B772" stroke-width="${r1(r * 0.17)}" stroke-linecap="round"/>`; });
  s += `<circle cx="${r1(cx)}" cy="${r1(cy - r * 0.06)}" r="${r1(r * 0.2)}" fill="#F2B772"/>`;
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; s += `<circle cx="${r1(cx + Math.cos(a) * r * 0.6)}" cy="${r1(cy + Math.sin(a) * r * 0.4)}" r="${r1(r * 0.04)}" fill="#FFF6E4" opacity=".85"/>`; }
  return `<g class="of-pan">${s}</g>`;
}

/** Photo encadree (cadre dore, silhouette sepia) : coin haut-gauche (x, y), taille w x h ; kind 0 (cheveux longs) | 1 (chapeau + moustache) | 2 (enfant). */
function oxPhoto(x, y, w, h, kind, gid) {
  const cx = x + w / 2, hy = y + h * 0.42, hr = w * (kind === 2 ? 0.2 : 0.17);
  let sil = `<ellipse cx="${r1(cx)}" cy="${r1(y + h * 0.95)}" rx="${r1(w * 0.3)}" ry="${r1(h * 0.28)}" fill="#6B4A32"/><circle cx="${r1(cx)}" cy="${r1(hy)}" r="${r1(hr)}" fill="#8A6444"/>`;
  if (kind === 0) sil += `<path d="M${r1(cx - hr * 1.15)} ${r1(hy)}Q${r1(cx - hr * 1.2)} ${r1(hy - hr * 1.4)} ${r1(cx)} ${r1(hy - hr * 1.3)}Q${r1(cx + hr * 1.2)} ${r1(hy - hr * 1.4)} ${r1(cx + hr * 1.15)} ${r1(hy)}L${r1(cx + hr * 1.3)} ${r1(hy + hr * 2)}H${r1(cx - hr * 1.3)}Z" fill="#3B2A1E" opacity=".9"/><circle cx="${r1(cx)}" cy="${r1(hy + hr * 0.1)}" r="${r1(hr * 0.9)}" fill="#8A6444"/>`;
  if (kind === 1) sil += `<ellipse cx="${r1(cx)}" cy="${r1(hy - hr * 0.8)}" rx="${r1(hr * 1.7)}" ry="${r1(hr * 0.3)}" fill="#3B2A1E"/><path d="M${r1(cx - hr * 0.9)} ${r1(hy - hr * 0.8)}Q${r1(cx)} ${r1(hy - hr * 2)} ${r1(cx + hr * 0.9)} ${r1(hy - hr * 0.8)}Z" fill="#3B2A1E"/><path d="M${r1(cx - hr * 0.6)} ${r1(hy + hr * 0.4)}Q${r1(cx)} ${r1(hy + hr * 0.1)} ${r1(cx + hr * 0.6)} ${r1(hy + hr * 0.4)}Q${r1(cx)} ${r1(hy + hr * 0.7)} ${r1(cx - hr * 0.6)} ${r1(hy + hr * 0.4)}Z" fill="#2A1A10"/>`;
  return `<g class="of-foto"><circle class="of-glow" cx="${r1(cx)}" cy="${r1(y + h / 2)}" r="${r1(w * 0.8)}" fill="url(#${gid})" opacity=".5"/><rect x="${r1(x - 10)}" y="${r1(y - 10)}" width="${r1(w + 20)}" height="${r1(h + 20)}" rx="10" fill="${OX.amar}"/><rect x="${r1(x - 4)}" y="${r1(y - 4)}" width="${r1(w + 8)}" height="${r1(h + 8)}" rx="6" fill="${OX.magenta}"/><rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="3" fill="#E3CFA8"/><clipPath id="${gid}-c${kind}${Math.round(x)}"><rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}"/></clipPath><g clip-path="url(#${gid}-c${kind}${Math.round(x)})">${sil}</g></g>`;
}

/** Fleur de cempasuchil plus grosse avec tige/feuilles pour vase (cx, base, k). */
function oxVase(cx, base, k, flowers) {
  let s = `<path d="M${r1(cx - 26 * k)} ${r1(base)}h${r1(52 * k)}l${r1(-8 * k)} ${r1(-60 * k)}h${r1(-36 * k)}Z" fill="${OX.turq}"/><path d="M${r1(cx - 26 * k)} ${r1(base - 36 * k)}h${r1(52 * k)}" stroke="#fff" stroke-width="${r1(5 * k)}" opacity=".5"/>`;
  [[-34, -100], [0, -126], [34, -98], [-12, -86], [16, -74]].slice(0, flowers || 5).forEach((f, i) => { s += `<path d="M${r1(cx)} ${r1(base - 58 * k)}L${r1(cx + f[0] * k)} ${r1(base + f[1] * k)}" stroke="#2F7F5A" stroke-width="${r1(5 * k)}"/>` + marigoldFlower(cx + f[0] * k, base + f[1] * k, 25 * k, i % 2 ? OX.naranja : OX.amar, i % 2 ? OX.amar : OX.naranja); });
  return `<g class="of-flor">${s}</g>`;
}

/**
 * Ofrenda a trois etages (viewBox 1000 x 820). Groupes animables : .of-cloth (nappes + papel picado, 3 etages .of-tier), .of-foto (x3), .of-vela (x6, .of-flame/.of-glow),
 * .of-flor (x4), .of-pan (x3), .of-comida (assiette de mole + verre d'eau), .of-calavera, .of-arco (arche de fleurs). opts : uid, width.
 */
function ofrendaSvg(opts) {
  opts = opts || {};
  const id = opts.uid || uid('of'), gid = id + '-g', W = opts.width || 1000, H = Math.round(W * 0.82);
  const tier = (x, y, w, h, c, c2, n) => `<g class="of-tier"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="14" fill="${c2}"/>${oxFlags(x, y + h - 2, w, n, x + 5, [OX.amar, OX.turq, OX.magenta, OX.naranja], 52).replace('stroke="#F5E6C8"', 'stroke="none"')}</g>`;
  let s = `<defs>${oxGlowDef(gid)}</defs>`;
  s += `<g class="of-arco"><path d="M120 760V260Q500 20 880 260V760" stroke="#2F7F5A" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = Math.PI * (0.06 + i * 0.079); return marigoldFlower(Math.round(500 - Math.cos(a) * 394), Math.round(300 - Math.sin(a) * 270 + (i < 2 || i > 9 ? 120 : 0)), 22, i % 2 ? OX.naranja : OX.amar, i % 2 ? OX.amar : OX.naranja); }).join('')}</g>`;
  s += `<g class="of-cloth">` + tier(300, 230, 400, 150, '#6B3E9A', '#8E5DBF', 6) + tier(190, 380, 620, 170, '#9A2F6B', '#C9487F', 9) + tier(70, 550, 860, 200, '#2B5FB0', '#4F8FE8', 12) + `</g>`;
  s += `<g class="of-top">${oxFlags(150, 90, 700, 9, 11, [OX.magenta, OX.turq, OX.amar, OX.viol, OX.naranja], 100)}</g>`;
  // etage haut : trois photos
  s += oxPhoto(396, 100, 90, 110, 0, gid).replace('class="of-foto"', 'class="of-foto" data-i="0"');
  s += oxPhoto(514, 100, 90, 110, 1, gid).replace('class="of-foto"', 'class="of-foto" data-i="1"');
  s += `<g class="of-foto-big">${oxPhoto(446, 262, 108, 122, 2, gid).replace('class="of-foto"', 'class="of-foto" data-i="2"')}</g>`;
  // bougies
  [[330, 380, 70], [670, 380, 70], [240, 550, 56], [760, 550, 56], [150, 750, 70], [850, 750, 70]].forEach((c, i) => { s += oxCandle(c[0], c[1], c[2], gid, 1.1).replace('class="of-vela"', `class="of-vela" data-i="${i}"`); });
  // fleurs
  s += oxVase(400, 380, 0.9, 4).replace('class="of-flor"', 'class="of-flor" data-i="0"') + oxVase(600, 380, 0.9, 4).replace('class="of-flor"', 'class="of-flor" data-i="1"');
  s += oxVase(330, 550, 1, 5).replace('class="of-flor"', 'class="of-flor" data-i="2"') + oxVase(670, 550, 1, 5).replace('class="of-flor"', 'class="of-flor" data-i="3"');
  // calavera de azucar
  s += `<g class="of-calavera">${oxCalavera(500, 500, 40, [OX.turq, OX.magenta, OX.amar])}</g>`;
  // pan de muerto
  [[250, 745, 50], [500, 748, 54], [750, 745, 50]].forEach((p, i) => { s += oxPan(p[0], p[1] - 30, p[2]).replace('class="of-pan"', `class="of-pan" data-i="${i}"`); });
  // comida favorita : assiette de mole + verre d'eau + tamal
  s += `<g class="of-comida"><ellipse cx="380" cy="742" rx="64" ry="18" fill="#F5E6C8"/><ellipse cx="380" cy="736" rx="52" ry="13" fill="#6B2A1E"/><circle cx="360" cy="728" r="12" fill="#C9573B"/><circle cx="392" cy="730" r="11" fill="#FFC83D"/><path d="M606 744h40l-6 -64h-28Z" fill="#CFE9F5" opacity=".7"/><path d="M609 710h34" stroke="#fff" stroke-width="4" opacity=".7"/><ellipse cx="500" cy="690" rx="0.1" ry="0.1" fill="none"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 820" width="${W}" height="${H}" class="of-svg" aria-hidden="true" style="overflow:visible">${s}</svg>`;
}

/** Accessoires isoles : 'calavera' (opts.pal) | 'catrina' | 'pan' | 'vela' | 'flor' | 'foto'. Renvoie un SVG (viewBox centre sur l'objet). opts : width, uid, pal, kind. */
function oxProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('oxp'), gid = id + '-g', W = opts.width || 200;
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round((W * h) / parseFloat(vb.split(' ')[2]))}" class="ox-prop" aria-hidden="true" style="overflow:visible"><defs>${oxGlowDef(gid)}</defs>${inner}</svg>`;
  if (key === 'calavera') return mk('0 0 200 200', 200, oxCalavera(100, 100, 80, opts.pal));
  if (key === 'catrina') return mk('0 0 400 700', 700, oxCatrina(200, 700, 1.3));
  if (key === 'pan') return mk('0 0 200 140', 140, oxPan(100, 70, 90));
  if (key === 'vela') return mk('0 0 200 300', 300, oxCandle(100, 280, 120, gid, 2));
  if (key === 'flor') return mk('0 0 200 200', 200, marigoldFlower(100, 100, 80, OX.naranja, OX.amar));
  return mk('0 0 200 240', 240, oxPhoto(40, 30, 120, 150, opts.kind || 0, gid));
}

/** Sceau de papier generique (laurier, etoile, fleur de cempasuchil) : aucun symbole reel. viewBox 400 x 400. */
function oxSeal(opts) {
  opts = opts || {};
  const W = opts.width || 300;
  let leaves = '';
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9, a = Math.PI * (0.55 + 0.9 * t); // arc de gauche a droite en bas
    const lx = 200 + Math.cos(a) * 138, ly = 200 - Math.sin(a) * 138 * -1;
    leaves += `<ellipse cx="${r1(lx)}" cy="${r1(ly)}" rx="24" ry="10" transform="rotate(${r1((a * 180) / Math.PI + 90)} ${r1(lx)} ${r1(ly)})" fill="${i % 2 ? '#0E9F6E' : '#42E0A0'}"/>`;
    const mx = 400 - lx;
    leaves += `<ellipse cx="${r1(mx)}" cy="${r1(ly)}" rx="24" ry="10" transform="rotate(${r1(-(a * 180) / Math.PI - 90)} ${r1(mx)} ${r1(ly)})" fill="${i % 2 ? '#0E9F6E' : '#42E0A0'}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${W}" height="${W}" class="ox-seal" aria-hidden="true" style="overflow:visible"><circle cx="200" cy="200" r="168" fill="#F5E6C8"/><circle cx="200" cy="200" r="150" fill="none" stroke="${OX.magenta}" stroke-width="8"/><circle cx="200" cy="200" r="128" fill="#2B1456"/>${leaves}${marigoldFlower(200, 196, 64, OX.naranja, OX.amar)}<path d="${sparklePath(200, 96, 30, 8)}" fill="#FFE9A8"/></svg>`;
}

// ---------------------------------------------------------------- panorama d'Oaxaca au crepuscule (3200 x 1200)
const OAXACA_SKY = { W: 3200, H: 1200, street: 880 };
/** Retourne { sky, sun (lune), far, mid, near, W, H, moonX, moonY, doors : [{ x, base }], stall : { x } }. Parallaxe : sky .15, sun .2, far .3, mid .6, near 1. */
function oaxacaSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ox'), g = (n) => `${id}-${n}`, W = OAXACA_SKY.W, H = OAXACA_SKY.H, base = 860, rnd = rng(opts.seed || 41);
  let stars = ''; for (let i = 0; i < 46; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(20 + rnd() * 380)}" r="${r1(1.5 + rnd() * 2.6)}" fill="#FFF3D1" opacity="${r1(0.4 + rnd() * 0.5)}"/>`;
  let clouds = ''; [[500, 330, 520, 70], [1500, 240, 620, 80], [2500, 380, 540, 70]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 71 + i * 4, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1252"/><stop offset=".3" stop-color="#4A2078"/><stop offset=".5" stop-color="#B2406F"/><stop offset=".64" stop-color="#F0703F"/><stop offset=".74" stop-color="#FFA33A"/></linearGradient></defs>${scRect(0, 0, W, 900, `url(#${g('s')})`)}${stars}${clouds}`, 'ox-sky');
  const mx = 2250, my = 300;
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('m')}"><stop offset="0" stop-color="#FFF3D1" stop-opacity=".7"/><stop offset=".4" stop-color="#FFD98A" stop-opacity=".25"/><stop offset="1" stop-color="#FF9F1C" stop-opacity="0"/></radialGradient></defs><circle cx="${mx}" cy="${my}" r="330" fill="url(#${g('m')})"/><circle class="sk-disc" cx="${mx}" cy="${my}" r="104" fill="#FFF3D1"/><circle cx="${mx - 30}" cy="${my - 20}" r="22" fill="#F1DDAE" opacity=".7"/><circle cx="${mx + 34}" cy="${my + 28}" r="16" fill="#F1DDAE" opacity=".7"/>`, 'ox-sun');
  // lointain : collines + eglise baroque en cantera + pyramide a degres
  let hills = `M0 ${base - 20}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(base - 120 - 70 * Math.sin(x / 420) - 28 * Math.sin(x / 130 + 1))}`; hills += `L${W} ${base}L0 ${base}Z`;
  const ch = (x) => `<g fill="#5A2F6E"><rect x="${x}" y="${base - 300}" width="360" height="300"/><rect x="${x - 40}" y="${base - 190}" width="440" height="190"/><rect x="${x - 10}" y="${base - 380}" width="100" height="120"/><rect x="${x + 270}" y="${base - 380}" width="100" height="120"/><path d="M${x - 10} ${base - 380}Q${x + 40} ${base - 450} ${x + 90} ${base - 380}Z"/><path d="M${x + 270} ${base - 380}Q${x + 320} ${base - 450} ${x + 370} ${base - 380}Z"/><path d="M${x + 110} ${base - 300}Q${x + 180} ${base - 420} ${x + 250} ${base - 300}Z"/></g><g fill="#FFD98A" opacity=".55"><path d="${archOpen(x + 150, base - 120, 60, 110)}"/><circle cx="${x + 180}" cy="${base - 240}" r="22"/></g>`;
  const pyr = (x) => `<g fill="#4B2566"><path d="M${x} ${base}L${x + 40} ${base - 70}H${x + 340}L${x + 380} ${base}Z"/><path d="M${x + 60} ${base - 70}L${x + 90} ${base - 140}H${x + 290}L${x + 320} ${base - 70}Z"/><path d="M${x + 120} ${base - 140}L${x + 140} ${base - 200}H${x + 240}L${x + 260} ${base - 140}Z"/></g>`;
  const far = scSvg(W, H, `<path d="${hills}" fill="#6A3380" opacity=".8"/>${pyr(2750)}<g transform="translate(1080 ${base}) scale(1.6) translate(-1080 ${-base})">${ch(900)}</g><g opacity=".75" transform="translate(2180 ${base}) scale(1.4) translate(-2180 ${-base})">${ch(2000).replace(/#5A2F6E/g, '#6A3380')}</g>${scRect(0, base - 2, W, 14, '#5A2F6E')}`, 'ox-far');
  // milieu : facades coloniales, fenetres allumees, guirlandes de papel picado
  const tones = [OX.ocre, OX.rosa, OX.turq, OX.azul, OX.terra, OX.amar, OX.viol];
  let houses = '', garl = '', x = -40, n = 0; const doors = [], tops = [];
  while (x < W + 40) {
    const w = 250 + rnd() * 100, h = 320 + rnd() * 100, c = tones[n % tones.length]; n++;
    houses += `<g class="ox-house">${scRect(x, base - h, w, h, c)}${scRect(x + w - 16, base - h, 16, h, '#000', 'opacity=".12"')}${scRect(x - 6, base - h - 14, w + 12, 18, shade(c, -0.2))}${scRect(x, base - 44, w, 44, shade(c, -0.18))}`;
    const nw = 2;
    for (let i = 0; i < nw; i++) { const wx = i ? x + w - 22 - 46 : x + 22; houses += `<g class="ox-win"><path d="${archOpen(wx, base - h + 160, 46, 86)}" fill="#FFD98A"/><path d="M${wx + 23} ${base - h + 74}V${base - h + 160}M${wx} ${base - h + 118}H${wx + 46}" stroke="#7E2F1E" stroke-width="4"/></g>${scRect(wx - 8, base - h + 162, 62, 8, shade(c, -0.3))}`; }
    const dx = x + w / 2 - 48; houses += `<path d="${archOpen(dx, base, 96, 250)}" fill="#3B1B3C"/><path d="${archOpen(dx + 10, base, 76, 236)}" fill="#6B3E52" opacity=".7"/>`;
    doors.push({ x: Math.round(dx + 48), base });
    houses += '</g>'; tops.push({ x: x + w / 2, y: base - h - 14 }); x += w + 14;
  }
  for (let i = 0; i < tops.length - 1; i += 2) {
    const a = tops[i], b = tops[i + 1], mid = (a.x + b.x) / 2, sag = 70, cols = [OX.magenta, OX.turq, OX.amar, OX.viol, OX.naranja];
    garl += `<path d="M${r1(a.x)} ${r1(a.y)}Q${r1(mid)} ${r1(a.y + sag * 2)} ${r1(b.x)} ${r1(b.y)}" stroke="#F5E6C8" stroke-width="3" fill="none" opacity=".85"/>`;
    for (let k = 1; k <= 7; k++) { const t = k / 8, fx = a.x + (b.x - a.x) * t, fy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * (a.y + sag * 2) + t * t * b.y; garl += `<g class="m-flag" data-px="${r1(fx)}" data-py="${r1(fy)}"><path d="M${r1(fx - 20)} ${r1(fy)}H${r1(fx + 20)}V${r1(fy + 44)}L${r1(fx + 10)} ${r1(fy + 38)}L${r1(fx)} ${r1(fy + 46)}L${r1(fx - 10)} ${r1(fy + 38)}L${r1(fx - 20)} ${r1(fy + 44)}Z${circlePath(fx, fy + 22, 7)}" fill="${cols[(i + k) % cols.length]}" fill-rule="evenodd"/></g>`; }
  }
  // premier plan : pavés, petales de cempasuchil, bougies le long de la rue
  const gid = g('cg'); let stones = '', petals = '', can = '';
  for (let r = 0; r < 7; r++) { const y = 900 + r * r * 5 + r * 22; for (let xx = (r % 2) * 50; xx < W; xx += 100 + r * 8) stones += `<path d="M${xx} ${y}q${50 + r * 4} -16 ${100 + r * 8} 0" stroke="#2B1840" stroke-width="3" fill="none" opacity=".45"/>`; }
  for (let i = 0; i < 90; i++) { const px = 40 + (i / 90) * 3100 + (rnd() - 0.5) * 60, py = 960 + Math.sin(i * 0.3) * 40 + (rnd() - 0.5) * 80; petals += `<ellipse class="ox-petal" cx="${r1(px)}" cy="${r1(py)}" rx="${r1(9 + rnd() * 6)}" ry="${r1(5 + rnd() * 3)}" transform="rotate(${r1(rnd() * 180)} ${r1(px)} ${r1(py)})" fill="${i % 3 ? OX.naranja : OX.amar}"/>`; }
  for (let i = 0; i < 9; i++) can += oxCandle(180 + i * 360, 1150 - (i % 2) * 40, 54, gid, 1.2);
  const mid = scSvg(W, H, `${houses}${garl}${scRect(0, base, W, H - base, '#5A3358')}${scRect(0, base + 14, W, 10, '#7A4A6E')}${stones}`, 'ox-mid');
  const near = scSvg(W, H, `<defs>${oxGlowDef(gid)}</defs>${petals}${can}`, 'ox-near');
  return { sky, sun, far, mid, near, W, H, moonX: mx, moonY: my, doors, stall: { x: 1950 } };
}

/** Etal de rue (viewBox 640 x 420) : table a nappe brodee, pan de muerto, calaveras de azucar, alebrijes, fanions. Pied de table en (320, 410). */
function oaxacaStall(opts) {
  opts = opts || {};
  const W = opts.width || 640;
  let s = `<rect x="40" y="70" width="12" height="340" fill="#6B3E26"/><rect x="588" y="70" width="12" height="340" fill="#6B3E26"/><path d="M20 126Q320 100 620 126" stroke="#F5E6C8" stroke-width="4" fill="none"/>${oxFlags(30, 126, 150, 3, 5, [OX.amar, OX.turq, OX.magenta], 60).replace(/<path d="M30 126H180"[^>]*>/, "")}${oxFlags(460, 126, 150, 3, 7, [OX.viol, OX.naranja, OX.turq], 60).replace(/<path d="M460 126H610"[^>]*>/, "")}`;
  s += `<rect x="40" y="250" width="560" height="160" fill="${OX.viol}"/><rect x="40" y="250" width="560" height="14" fill="#B58BE0"/>${embroideryBand(60, 350, 520, 36, '#FFFDF4', OX.magenta)}`;
  [90, 170, 250].forEach((x, i) => { s += oxPan(x + 30, 232, 40 + (i % 2) * 6); });
  [[360, '#D93472'], [440, '#19B7AA'], [520, '#FFC83D']].forEach((c, i) => { s += oxCalavera(c[0] + 10, 214, 34, [c[1], OX.naranja, OX.turq]); });
  [[96, 172], [560, 172]].forEach((a, i) => { s += `<g class="ox-alebrije"><ellipse cx="${a[0]}" cy="${a[1]}" rx="46" ry="26" fill="${i ? OX.turq : OX.naranja}"/><circle cx="${a[0] + 44}" cy="${a[1] - 18}" r="22" fill="${i ? OX.amar : OX.magenta}"/><path d="M${a[0] + 36} ${a[1] - 34}l-6 -22l16 12ZM${a[0] + 56} ${a[1] - 34}l8 -20l6 22Z" fill="${OX.viol}"/><circle cx="${a[0] + 50}" cy="${a[1] - 20}" r="4" fill="#2A1040"/><path d="M${a[0] - 40} ${a[1] + 20}v28M${a[0] - 14} ${a[1] + 24}v26M${a[0] + 14} ${a[1] + 24}v26M${a[0] + 36} ${a[1] + 20}v28" stroke="#6B3E26" stroke-width="7" stroke-linecap="round"/><g fill="#fff" opacity=".8"><circle cx="${a[0] - 20}" cy="${a[1] - 4}" r="5"/><circle cx="${a[0]}" cy="${a[1] + 6}" r="5"/><circle cx="${a[0] + 16}" cy="${a[1] - 8}" r="5"/></g></g>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" width="${W}" height="${Math.round(W * 420 / 640)}" class="ox-stall" aria-hidden="true" style="overflow:visible">${s}</svg>`;
}

// ---------------------------------------------------------------- patio d'Oaxaca de nuit avec petit autel (2400 x 1200)
const OX_PATIO = { W: 2400, H: 1200, floor: 900, altar: { x: 640, y: 760 } };
/** Retourne { back, front, light, W, H, floor, altar, candles : [{x, y}] }. Flammes : .of-flame (pied data-px/data-py) ; halos .of-glow ; tout l'autel dans back. */
function patioOfrenda(opts) {
  opts = opts || {};
  const id = opts.uid || uid('po'), g = (n) => `${id}-${n}`, W = OX_PATIO.W, H = OX_PATIO.H, fl = OX_PATIO.floor, A = OX_PATIO.altar, rnd = rng(opts.seed || 52), gid = g('cg');
  let stars = ''; for (let i = 0; i < 34; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(10 + rnd() * 110)}" r="${r1(1.4 + rnd() * 2.2)}" fill="#FFF3D1" opacity="${r1(0.4 + rnd() * 0.5)}"/>`;
  let wall = `<path d="M0 ${fl}V230H${W}V${fl}Z" fill="url(#${g('w')})"/>`;
  for (let i = 0; i < 30; i++) wall += `<path d="M${r1(rnd() * W)} ${r1(260 + rnd() * 600)}h${r1(60 + rnd() * 120)}" stroke="#5A2A2A" stroke-width="3" opacity=".12"/>`;
  // arche de fond (porte vers la rue de nuit) + fenetre
  wall += `<path d="${archOpen(1500, fl, 300, 520)}" fill="#1A1348"/><path d="${archOpen(1500, fl, 300, 520)}" fill="none" stroke="#E0699A" stroke-width="16"/><path d="${archOpen(1530, fl - 330, 240, 200)}" fill="#2B1F6E" opacity=".0"/>` + `<g fill="#FFD98A" opacity=".5">${[0, 1, 2].map((i) => `<circle cx="${1580 + i * 70}" cy="${fl - 360 - (i % 2) * 40}" r="6"/>`).join('')}</g>`;
  wall += `<path d="${archOpen(1890, fl - 150, 230, 230)}" fill="#1A1348"/><path d="${archOpen(1890, fl - 150, 230, 230)}" fill="none" stroke="#19B7AA" stroke-width="14"/>`;
  // bandeau de papel picado sur le mur
  wall += `<g>${oxFlags(0, 290, W, 24, 8, [OX.magenta, OX.turq, OX.amar, OX.viol, OX.naranja], 96)}</g>`;
  // autel : table, nappe, retablo de papier, photos, fleurs, bougies
  const tx = A.x - 360, tw = 720, ty = A.y;
  let altar = `<g class="po-altar"><rect x="${tx}" y="${ty}" width="${tw}" height="${fl - ty}" fill="#8E3A5E"/><rect x="${tx - 14}" y="${ty - 18}" width="${tw + 28}" height="26" rx="8" fill="#B8537F"/>${oxFlags(tx - 14, fl - 4, tw + 28, 10, 9, [OX.amar, OX.turq, OX.naranja, OX.viol], 70).replace('stroke="#F5E6C8"', 'stroke="none"')}`;
  altar += `<rect x="${tx + 70}" y="${ty - 250}" width="${tw - 140}" height="240" rx="10" fill="#5A2F86"/><rect x="${tx + 70}" y="${ty - 250}" width="${tw - 140}" height="16" fill="#8E5DBF"/>${oxFlags(tx + 70, ty - 250, tw - 140, 7, 13, [OX.magenta, OX.turq, OX.amar, OX.naranja], 70).replace('stroke="#F5E6C8"', 'stroke="none"')}`;
  altar += oxPhoto(A.x - 70, ty - 200, 140, 170, 2, gid).replace('class="of-foto"', 'class="of-foto po-photo"') + oxPhoto(A.x - 250, ty - 190, 100, 130, 0, gid) + oxPhoto(A.x + 150, ty - 190, 100, 130, 1, gid);
  altar += oxVase(A.x - 300, ty - 6, 1.0, 4) + oxVase(A.x + 300, ty - 6, 1.0, 4) + oxPan(A.x - 130, ty - 40, 44) + oxPan(A.x + 130, ty - 40, 44) + oxCalavera(A.x, ty - 36, 36, [OX.turq, OX.magenta, OX.amar]);
  const cs = [[A.x - 210, ty - 6, 66], [A.x - 90, ty - 6, 50], [A.x + 20, ty - 6, 58], [A.x + 110, ty - 6, 50], [A.x + 220, ty - 6, 66]], candles = [];
  cs.forEach((c, i) => { altar += oxCandle(c[0], c[1], c[2], gid, 1.2).replace('class="of-vela"', `class="of-vela" data-i="${i}"`); candles.push({ x: c[0], y: c[1] - c[2] - 40 }); });
  altar += '</g>';
  // sol de dalles + chemin de petales vers l'autel
  let tiles = ''; for (let r = 0; r < 8; r++) { const y = fl + Math.pow(r / 8, 1.4) * (H - fl); tiles += `<path d="M-400 ${r1(y)}H${W + 400}" stroke="#2B1840" stroke-width="3" opacity=".4"/>`; }
  let pet = ''; for (let i = 0; i < 40; i++) { const px = 300 + i * 40 + (rnd() - 0.5) * 30, py = fl + 40 + (i % 5) * 30 + rnd() * 20; pet += `<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="12" ry="6" transform="rotate(${r1(rnd() * 180)} ${r1(px)} ${r1(py)})" fill="${i % 3 ? OX.naranja : OX.amar}" opacity=".95"/>`; }
  const back = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E3A55"/><stop offset="1" stop-color="#A4604A"/></linearGradient><linearGradient id="${g('sk')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15104A"/><stop offset="1" stop-color="#3A1F6E"/></linearGradient><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2C48"/><stop offset="1" stop-color="#2B1840"/></linearGradient>${oxGlowDef(gid)}</defs>${scRect(0, 0, W, 260, `url(#${g('sk')})`)}${stars}${wall}${scRect(0, 224, W, 22, '#B8672F')}<path d="M0 ${fl}H${W}L${W + 400} ${H}H-400Z" fill="url(#${g('f')})"/>${tiles}${pet}${altar}`, 'po-back');
  const leaf = (a, c, k) => `<path d="M0 0Q${52 * k} -90 0 -190Q${-52 * k} -90 0 0Z" fill="${c}" transform="rotate(${a})"/>`;
  const front = scSvg(W, H, [[110, 1110, 1.3, '#C9573B'], [2290, 1100, 1.4, '#2B5FB0']].map((p) => `<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><path d="M-70 0h140l-18 -150h-104Z" fill="${p[3]}"/><g transform="translate(0 -150)">${[-60, -30, 0, 30, 60].map((a, j) => leaf(a, ['#2F7F5A', '#0E9F6E', '#3F8A52'][j % 3], 0.9)).join('')}${marigoldFlower(-30, -150, 24, OX.naranja, OX.amar)}${marigoldFlower(26, -170, 24, OX.naranja, OX.amar)}</g></g>`).join(''), 'po-front');
  const light = scSvg(W, H, `<defs><radialGradient id="${g('lg')}"><stop offset="0" stop-color="#FFC96A" stop-opacity=".5"/><stop offset="1" stop-color="#FFC96A" stop-opacity="0"/></radialGradient></defs><ellipse class="po-light" cx="${A.x}" cy="${A.y - 100}" rx="760" ry="520" fill="url(#${g('lg')})"/>`, 'po-light');
  return { back, front, light, W, H, floor: fl, altar: A, candles };
}

// ---------------------------------------------------------------- chemin de petales (2400 x 1200) : rue de nuit, maison a la porte ouverte, petales et bougies
/** Retourne { svg, W, H, path : [[x,y]...] (centre de chaque petale, dans l'ordre), door : { x, y, w, h } }. Classes : .pp-petal (data-i), .pp-candle (.of-flame/.of-glow, data-i = indice du petale), .pp-door (halo), .pp-house. */
function oaxacaPetalPath(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pp'), g = (n) => `${id}-${n}`, W = 2400, H = 1500, rnd = rng(opts.seed || 63), gid = g('cg');
  let stars = ''; for (let i = 0; i < 40; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(20 + rnd() * 330)}" r="${r1(1.4 + rnd() * 2.4)}" fill="#FFF3D1" opacity="${r1(0.4 + rnd() * 0.5)}"/>`;
  let row = ''; [[0, 240, 360], [380, 200, 320], [730, 260, 380], [1130, 190, 320]].forEach((h, i) => { row += `<g>${scRect(h[0], 700 - h[1], h[2] - 20, h[1], ['#2B2A7A', '#3A2A82', '#2F2478', '#3C3090'][i])}<path d="${archOpen(h[0] + 40, 700, 50, 90)}" fill="#FFD98A" opacity=".6"/><path d="${archOpen(h[0] + h[2] - 120, 700, 50, 90)}" fill="#FFD98A" opacity=".35"/></g>`; });
  const door = { x: 1880, y: 560, w: 200, h: 300 };
  const house = `<g class="pp-house">${scRect(1640, 330, 700, 530, '#E8A33A')}${scRect(1640, 330, 700, 20, '#B8672F')}${scRect(2300, 330, 40, 530, '#000', 'opacity=".14"')}${scRect(1640, 810, 700, 50, '#C9573B')}<path d="${archOpen(door.x - 20, 860, door.w + 40, door.h + 40)}" fill="#E0699A"/><path d="${archOpen(door.x, 860, door.w, door.h)}" fill="url(#${g('d')})"/><rect class="pp-door" x="${door.x - 90}" y="${door.y - 40}" width="${door.w + 180}" height="${door.h + 120}" rx="90" fill="url(#${g('dg')})" opacity="0"/><path d="${archOpen(1690, 640, 70, 110)}" fill="#3B1B3C"/><path d="${archOpen(2200, 640, 70, 110)}" fill="#3B1B3C"/>${scRect(1600, 860, 780, 24, '#7A4A6E')}</g>`;
  const fl = 860; let cob = ''; for (let r = 0; r < 10; r++) { const y = fl + 20 + r * r * 5 + r * 24; for (let xx = (r % 2) * 60; xx < W; xx += 120 + r * 8) cob += `<path d="M${xx} ${y}q${60 + r * 4} -16 ${120 + r * 8} 0" stroke="#2B1840" stroke-width="3" fill="none" opacity=".45"/>`; }
  // courbe du chemin : (120, 1080) -> (door.x + 100, 880), S legere
  const P = (t) => [120 + (door.x + 100 - 120) * t, 1080 - 200 * t + Math.sin(t * Math.PI * 2) * 70 * (1 - t * 0.6)];
  const path = []; let pet = '', can = '';
  for (let i = 0; i < 64; i++) { const t = i / 63, p = P(t), px = p[0] + (rnd() - 0.5) * 70, py = p[1] + (rnd() - 0.5) * 36; path.push([r1(px), r1(py)]); pet += `<ellipse class="pp-petal" data-i="${i}" cx="${r1(px)}" cy="${r1(py)}" rx="${r1(13 + rnd() * 6)}" ry="${r1(7 + rnd() * 3)}" transform="rotate(${r1(rnd() * 180)} ${r1(px)} ${r1(py)})" fill="${i % 3 ? OX.naranja : OX.amar}"/>`; }
  for (let i = 0; i < 64; i += 4) { const t = i / 63, p = P(t), side = (i / 4) % 2 ? 1 : -1; can += oxCandle(p[0] + side * 100, p[1] + 20 + side * 8, 46, gid, 1.2).replace('class="of-vela"', `class="of-vela pp-candle" data-i="${i}"`); }
  const svg = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1245"/><stop offset=".6" stop-color="#2A1A6E"/><stop offset="1" stop-color="#5A2A7A"/></linearGradient><linearGradient id="${g('d')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6A8"/><stop offset="1" stop-color="#F0964A"/></linearGradient><radialGradient id="${g('dg')}"><stop offset="0" stop-color="#FFC96A" stop-opacity=".6"/><stop offset="1" stop-color="#FFC96A" stop-opacity="0"/></radialGradient><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2C58"/><stop offset="1" stop-color="#2B1840"/></linearGradient>${oxGlowDef(gid)}</defs>${scRect(0, 0, W, 880, `url(#${g('s')})`)}${stars}<circle cx="520" cy="190" r="70" fill="#FFF3D1" opacity=".92"/>${row}${house}<path d="M0 ${fl}H${W}V${H}H0Z" fill="url(#${g('f')})"/>${cob}${can}${pet}`, 'pp-svg');
  return { svg, W, H, path, door };
}

// ---------------------------------------------------------------- decors de Bogota (unite 8) : panorama au crepuscule (Monserrate, toits de La Candelaria, bus rouge),
// rue de La Candelaria (decor de scene 3200x1200), poteau de rue a plaques (lettres animables), plan de la ville, accessoires de capsule en papier decoupe
// (carte de Colombie, vitrine du Museo del Oro, teleferique de Monserrate, Plaza de Bolivar + pigeons, Ciclovia).
// Memes conventions que 12-mexico.js : calques separes, AUCUN texte (les lettres des panneaux sont des barres stylisees `.bg-let`), monuments publics simplifies, aucune marque.
// Prefixe `bg` / `bogota` pour tout ; exports : bogotaSkyline, calleCandelaria, bgSignPost, bgCityMap, bgColombiaMap, bgOroVitrina, bgTeleferico, bgPlazaCard, bgCiclovia, bgStreetCard.

const BG = {
  yellow: '#F2C14E', blue: '#2F6FD0', white: '#FFF5E1', green: '#2E9E6B', red: '#D8283A', pink: '#E5638A', turq: '#22B5A8', orange: '#EE8A3C', cream: '#FFEBC4',
  tile: '#B8482E', tile2: '#8A3220', wood: '#6B4226', wood2: '#4A2C18', stone: '#9A8576', stone2: '#6F5F54', sanct: '#FFF8EA', lav: '#8D78C4',
};
function bgCobbles(W, y0, y1, seed, c1, c2) {
  const rnd = rng(seed); let s = scRect(0, y0, W, y1 - y0, c1);
  for (let y = y0 + 6, row = 0; y < y1; y += 22 + row * 3.2, row++) {
    const h = 20 + row * 3, off = (row % 2) * 24;
    s += `<path d="M0 ${r1(y)}H${W}" stroke="${c2}" stroke-width="3" opacity=".5"/>`;
    for (let x = -off; x < W; x += 52 + rnd() * 26 + row * 3) s += `<path d="M${r1(x)} ${r1(y)}v${r1(h)}" stroke="${c2}" stroke-width="3" opacity=".42"/>`;
  }
  return s;
}
/** Maison coloniale de La Candelaria : facade coloree, soubassement, toit de tuiles, fenetres a volets, balcon de bois fleuri, porte. opts : door (index), balcony (defaut true), lit. */
function bgHouse(x, base, w, h, tone, seed, opts) {
  opts = opts || {};
  const rnd = rng(seed), ph = Math.min(150, h - 140);
  let s = `<g class="bg-house">${scRect(x, base - h, w, h, tone)}${scRect(x + w - 14, base - h, 14, h, '#000', 'opacity=".09"')}${scRect(x, base - 36, w, 36, shade(tone, -0.2))}${scRect(x, base - 40, w, 5, shade(tone, 0.4), 'opacity=".7"')}`;
  s += `<path d="M${x - 16} ${base - h + 2}h${w + 32}l-12 -34h${-(w + 8)}Z" fill="${BG.tile}"/><path d="M${x - 16} ${base - h + 2}h${w + 32}v8h${-(w + 32)}Z" fill="${BG.tile2}"/>`;
  for (let i = 0; i < w / 20; i++) s += `<path d="M${r1(x - 6 + i * 20)} ${base - h - 30}l-4 30" stroke="${BG.tile2}" stroke-width="3" opacity=".5"/>`;
  const n = Math.max(1, Math.floor(w / 110));
  for (let i = 0; i < n; i++) {
    const wx = x + (w / n) * (i + 0.5) - 26, door = opts.door === i;
    if (door) { s += scRect(wx - 8, base - 200, 68, 200, BG.white) + `<path d="M${wx} ${base} V${base - 160} Q${wx + 26} ${base - 196} ${wx + 52} ${base - 160} V${base}Z" fill="${BG.wood}"/><path d="M${wx + 26} ${base - 186}V${base}" stroke="${BG.wood2}" stroke-width="3"/><circle cx="${wx + 40}" cy="${base - 90}" r="4" fill="${BG.yellow}"/>`; continue; }
    const wy = base - h + 54 + (h > 330 ? 0 : 0), wh = Math.min(100, ph);
    s += scRect(wx - 6, wy - 6, 64, wh + 12, BG.white, 'rx="6"') + scRect(wx, wy, 52, wh, opts.lit ? '#FFD98A' : '#3B2A4A', 'rx="4"') + scRect(wx + 24, wy, 4, wh, BG.white) + scRect(wx - 14, wy, 11, wh, [BG.green, BG.blue, BG.red][(i + (seed | 0)) % 3]) + scRect(wx + 55, wy, 11, wh, [BG.green, BG.blue, BG.red][(i + (seed | 0)) % 3]);
    if (opts.balcony !== false && (i + (seed | 0)) % 2 === 0) {
      const by = wy + wh + 2; s += scRect(wx - 22, by, 100, 12, BG.wood) + scRect(wx - 22, by - 36, 100, 5, BG.wood2);
      for (let k = 0; k < 8; k++) s += scRect(wx - 18 + k * 12, by - 34, 4, 34, BG.wood2);
      s += scRect(wx - 12, by - 52, 30, 16, BG.tile, 'rx="4"') + `<circle cx="${wx - 4}" cy="${by - 58}" r="8" fill="${BG.pink}"/><circle cx="${wx + 12}" cy="${by - 60}" r="8" fill="${BG.yellow}"/>` + scRect(wx + 40, by - 52, 30, 16, BG.tile, 'rx="4"') + `<circle cx="${wx + 48}" cy="${by - 58}" r="8" fill="${BG.red}"/><circle cx="${wx + 62}" cy="${by - 59}" r="8" fill="${BG.orange}"/>`;
    }
  }
  return s + '</g>';
}
/** Monserrate : montagne verte en dome, sentier en lacets, sanctuaire blanc au sommet (point vert optionnel = la plume), telepherique. k = echelle. */
function bgMonserrate(cx, base, k, opts) {
  opts = opts || {};
  const h = 560 * k, w = 1500 * k, top = base - h;
  let s = `<g class="bg-mont"><path d="M${r1(cx - w / 2)} ${base}Q${r1(cx - w * 0.3)} ${r1(top + h * 0.35)} ${r1(cx - w * 0.06)} ${r1(top + 14 * k)}Q${r1(cx)} ${r1(top - 6 * k)} ${r1(cx + w * 0.08)} ${r1(top + 20 * k)}Q${r1(cx + w * 0.3)} ${r1(top + h * 0.4)} ${r1(cx + w / 2)} ${base}Z" fill="#4B7F52"/>`;
  s += `<path d="M${r1(cx + w * 0.08)} ${r1(top + 20 * k)}Q${r1(cx + w * 0.3)} ${r1(top + h * 0.4)} ${r1(cx + w / 2)} ${base}H${r1(cx + w * 0.1)}Z" fill="#2F5C3A" opacity=".55"/>`;
  s += `<path d="M${r1(cx - w * 0.3)} ${r1(base - 20 * k)}Q${r1(cx - w * 0.1)} ${r1(top + h * 0.7)} ${r1(cx - w * 0.2)} ${r1(top + h * 0.5)}Q${r1(cx + w * 0.02)} ${r1(top + h * 0.34)} ${r1(cx - w * 0.04)} ${r1(top + 34 * k)}" stroke="#E9D7A4" stroke-width="${r1(5 * k)}" fill="none" opacity=".7" stroke-dasharray="${r1(14 * k)} ${r1(10 * k)}"/>`;
  for (let i = 0; i < 18; i++) s += `<circle cx="${r1(cx - w * 0.4 + (i * 71) % (w * 0.8))}" cy="${r1(top + h * (0.35 + ((i * 37) % 60) / 100))}" r="${r1(18 * k)}" fill="#3C6B47" opacity=".7"/>`;
  const sx = cx - w * 0.03, sy = top + 6 * k;
  s += `<g class="bg-sanct"><rect x="${r1(sx - 40 * k)}" y="${r1(sy - 34 * k)}" width="${r1(80 * k)}" height="${r1(34 * k)}" fill="${BG.sanct}"/><rect x="${r1(sx - 20 * k)}" y="${r1(sy - 70 * k)}" width="${r1(40 * k)}" height="${r1(40 * k)}" fill="${BG.sanct}"/><path d="M${r1(sx - 28 * k)} ${r1(sy - 70 * k)}L${r1(sx)} ${r1(sy - 100 * k)}L${r1(sx + 28 * k)} ${r1(sy - 70 * k)}Z" fill="${BG.tile}"/><rect x="${r1(sx - 3 * k)}" y="${r1(sy - 130 * k)}" width="${r1(6 * k)}" height="${r1(30 * k)}" fill="${BG.sanct}"/><rect x="${r1(sx - 12 * k)}" y="${r1(sy - 118 * k)}" width="${r1(24 * k)}" height="${r1(5 * k)}" fill="${BG.sanct}"/><rect x="${r1(sx - 8 * k)}" y="${r1(sy - 20 * k)}" width="${r1(16 * k)}" height="${r1(20 * k)}" rx="${r1(8 * k)}" fill="${BG.wood}"/><path d="M${r1(sx - 40 * k)} ${r1(sy - 34 * k)}L${r1(sx - 32 * k)} ${r1(sy - 48 * k)}H${r1(sx + 32 * k)}L${r1(sx + 40 * k)} ${r1(sy - 34 * k)}Z" fill="${BG.tile}"/></g>`;
  if (opts.feather) s += `<g class="bg-pdot" data-px="${r1(sx + 60 * k)}" data-py="${r1(sy - 20 * k)}"><circle cx="${r1(sx + 60 * k)}" cy="${r1(sy - 20 * k)}" r="${r1(30 * k)}" fill="#42E0A0" opacity=".28"/><circle cx="${r1(sx + 60 * k)}" cy="${r1(sy - 20 * k)}" r="${r1(11 * k)}" fill="#42E0A0"/><circle cx="${r1(sx + 60 * k)}" cy="${r1(sy - 20 * k)}" r="${r1(5 * k)}" fill="#E8FFF4"/></g>`;
  return s + '</g>';
}
function bgMist(cx, cy, w, h, op) { return `<g class="bg-mist" opacity="${op}"><ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(w / 2)}" ry="${r1(h / 2)}" fill="#FFF3E8"/><ellipse cx="${r1(cx - w * 0.2)}" cy="${r1(cy + h * 0.18)}" rx="${r1(w * 0.32)}" ry="${r1(h * 0.34)}" fill="#FFF3E8"/><ellipse cx="${r1(cx + w * 0.24)}" cy="${r1(cy + h * 0.1)}" rx="${r1(w * 0.3)}" ry="${r1(h * 0.36)}" fill="#FFF3E8"/></g>`; }
/** Eglise coloniale a deux tours. */
function bgChurch(x, base, k, tone) {
  const w = 300 * k, h = 260 * k, t = tone || BG.cream;
  let s = `<g class="bg-church">${scRect(x, base - h, w, h, t)}${scRect(x + w - 14 * k, base - h, 14 * k, h, '#000', 'opacity=".08"')}`;
  [x - 6 * k, x + w - 64 * k].forEach((tx) => { s += scRect(tx, base - h - 130 * k, 70 * k, 130 * k, t) + `<path d="M${r1(tx - 6 * k)} ${r1(base - h - 130 * k)}L${r1(tx + 35 * k)} ${r1(base - h - 190 * k)}L${r1(tx + 76 * k)} ${r1(base - h - 130 * k)}Z" fill="${BG.tile}"/><path d="M${r1(tx + 20 * k)} ${r1(base - h - 100 * k)}q15 -26 30 0v34h-30Z" fill="${BG.wood2}"/>`; });
  s += `<path d="M${r1(x + 70 * k)} ${r1(base - h)}L${r1(x + w / 2)} ${r1(base - h - 54 * k)}L${r1(x + w - 70 * k)} ${r1(base - h)}Z" fill="${shade(t, -0.12)}"/>`;
  s += `<path d="M${r1(x + w / 2 - 40 * k)} ${base}V${r1(base - 130 * k)}Q${r1(x + w / 2)} ${r1(base - 190 * k)} ${r1(x + w / 2 + 40 * k)} ${r1(base - 130 * k)}V${base}Z" fill="${BG.wood}"/><circle cx="${r1(x + w / 2)}" cy="${r1(base - h + 60 * k)}" r="${r1(26 * k)}" fill="${BG.white}" stroke="${shade(t, -0.3)}" stroke-width="${r1(5 * k)}"/>`;
  return s + '</g>';
}
/** Bus rouge generique (aucune marque). */
function bgBus(x, y, k) {
  const w = 360 * k, h = 130 * k;
  let s = `<g class="bg-bus">${scRect(x, y - h, w, h, BG.red, `rx="${r1(16 * k)}"`)}${scRect(x, y - 38 * k, w, 12 * k, '#fff', 'opacity=".85"')}${scRect(x + 8 * k, y - 12 * k, w - 16 * k, 12 * k, '#7A121E')}`;
  for (let i = 0; i < 6; i++) s += scRect(x + 16 * k + i * 54 * k, y - h + 18 * k, 44 * k, 44 * k, '#FFE9A8', `rx="${r1(6 * k)}"`);
  s += scRect(x + w - 54 * k, y - h + 18 * k, 40 * k, 62 * k, '#FFE9A8', `rx="${r1(6 * k)}"`);
  [60, 270].forEach((wx) => { s += `<circle cx="${r1(x + wx * k)}" cy="${r1(y + 4 * k)}" r="${r1(24 * k)}" fill="#1E1A26"/><circle cx="${r1(x + wx * k)}" cy="${r1(y + 4 * k)}" r="${r1(10 * k)}" fill="#9AA3C7"/>`; });
  return s + '</g>';
}
function bgLamp(x, base, k) { return `<g class="bg-lamp"><path d="M${x} ${base}V${r1(base - 250 * k)}" stroke="#2A2A3A" stroke-width="${r1(9 * k)}"/><path d="M${r1(x - 22 * k)} ${r1(base - 250 * k)}h${r1(44 * k)}l${r1(-6 * k)} ${r1(-30 * k)}h${r1(-32 * k)}Z" fill="#2A2A3A"/><rect x="${r1(x - 16 * k)}" y="${r1(base - 306 * k)}" width="${r1(32 * k)}" height="${r1(34 * k)}" rx="${r1(6 * k)}" fill="#FFE9A8" opacity=".92"/></g>`; }

// ---------------------------------------------------------------- panorama de Bogota au crepuscule (3200 x 1200)
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY, mont : {x, y} (point vert de la plume = sommet de Monserrate) }. */
function bogotaSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('bg'), g = (n) => `${id}-${n}`, W = SKY.W, H = SKY.H, rnd = rng(opts.seed || 63), street = 860;
  let clouds = ''; [[300, 250, 560, 80], [1150, 170, 640, 90], [2000, 300, 520, 74], [2700, 200, 640, 88]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 90 + i * 4, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26397E"/><stop offset=".3" stop-color="#6A5AA8"/><stop offset=".5" stop-color="#E58A7C"/><stop offset=".66" stop-color="#FFB873"/><stop offset=".78" stop-color="#FFD59A"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'bg-sky');
  const sx = opts.sunX || 700, sy = opts.sunY || 640;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 40; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFB45A" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A47" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFE9A8" opacity=".1" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="400" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="70" fill="#FFF0B8"/>`, 'bg-sun');
  // lointain : cretes des Andes + Monserrate (sommet a droite) + bancs de brume
  let ridge = `M0 ${street}`; for (let x = 0; x <= W; x += 80) ridge += `L${x} ${r1(street - 250 - 90 * Math.sin(x / 420) - 40 * Math.sin(x / 150 + 1))}`; ridge += `L${W} ${street}Z`;
  const mk = opts.mk || 2250, mscale = 1.0, mtop = street - 560 * mscale;
  const far = scSvg(W, H, `<path d="${ridge}" fill="#7E6FB5" opacity=".7"/>${bgMonserrate(mk, street + 10, mscale, { feather: opts.feather !== false })}${bgMist(1700, street - 130, 1300, 150, 0.5)}${bgMist(2800, street - 250, 1000, 130, 0.42)}${bgMist(900, street - 90, 1200, 130, 0.45)}`, 'bg-far');
  // milieu : toits de tuiles rouges, facades colorees, deux eglises, lumieres
  const tones = [BG.yellow, BG.white, BG.blue, BG.pink, BG.turq, BG.orange, BG.green];
  let houses = '', x = -30, k = 0;
  while (x < W) {
    if (x > 560 && x < 880) { x = 880; continue; }
    if (x > 1960 && x < 2200) { x = 2200; continue; }
    const w = 190 + rnd() * 110, h = 210 + rnd() * 150;
    houses += bgHouse(x, street, w, h, tones[k++ % tones.length], Math.round(x) + 3, { door: rnd() < 0.5 ? 0 : -1, lit: rnd() < 0.7 });
    x += w + 10;
  }
  const mid = scSvg(W, H, `${bgChurch(600, street, 1.0)}${bgChurch(1990, street, 0.85, BG.white)}${houses}${scRect(0, street, W, 340, '#7E6552')}`, 'bg-mid');
  // premier plan : rue pavee, bus rouge, lampadaires, balcon fleuri en surplomb
  const bus = bgBus(0, street + 112, 1.15);
  const near = scSvg(W, H, `${bgCobbles(W, street + 20, H, 21, '#9C7E62', '#654A33')}${scRect(0, street + 8, W, 16, '#7E6552')}${scRect(0, street + 8, W, 5, '#fff', 'opacity=".3"')}${bgLamp(300, street + 90, 1.1)}${bgLamp(1500, street + 90, 1.1)}${bgLamp(2700, street + 90, 1.1)}
<g class="bg-buswrap" data-px="0" data-py="${street + 112}">${bus}</g>
<g transform="translate(2560 20)"><path d="M0 40H700" stroke="${BG.wood}" stroke-width="30"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${60 + i * 120}" cy="${20 + (i % 2) * 14}" r="${50 + (i % 3) * 8}" fill="${[BG.green, '#3F8A52', '#2C6B3F'][i % 3]}"/><circle cx="${40 + i * 120}" cy="${(i % 2) * 14}" r="14" fill="${[BG.pink, BG.yellow, BG.red][i % 3]}"/>`).join('')}</g>`, 'bg-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy, mont: { x: mk - 1500 * mscale * 0.03 + 60, y: mtop - 14 }, street };
}

// ---------------------------------------------------------------- rue de La Candelaria (decor de scene 3200 x 1200)
const CALLE = { W: 3200, H: 1200, floor: 930, signs: [{ x: 1180, w: 230 }, { x: 2010, w: 230 }], map: { x: 2480, y: 330, w: 420, h: 330 } };
/** Retourne { back, front, light, W, H, floor, signs, map } (map = emplacement du grand plan mural, a poser avec bgCityMap). */
function calleCandelaria(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cc'), g = (n) => `${id}-${n}`, W = CALLE.W, H = CALLE.H, fl = CALLE.floor, rnd = rng(opts.seed || 71);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A8CDB"/><stop offset=".5" stop-color="#9CCDEE"/><stop offset=".82" stop-color="#FFE4B4"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  const tones = [BG.yellow, BG.white, BG.blue, BG.pink, BG.turq, BG.orange, BG.green, BG.cream];
  let houses = '', x = -40, k = 0;
  while (x < W) { const w = 280 + rnd() * 120, h = 360 + rnd() * 110; houses += bgHouse(x, fl - 26, w, h, tones[k++ % tones.length], Math.round(x) + 7, { door: 0 }); x += w + 12; }
  const lamp = (lx) => bgLamp(lx, fl + 44, 1.3);
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(520, 150, 520, 74, 61, 'front')}${cloudSvg(2300, 120, 600, 84, 63, 'front')}
${bgMonserrate(1500, 640, 0.9, { feather: opts.feather !== false })}${bgMist(1500, 620, 1700, 130, 0.5)}${houses}${lamp(650)}${lamp(1620)}${lamp(2780)}
${bgCobbles(W, fl, H, 29, '#B59471', '#7A5C3E')}${scRect(0, fl - 8, W, 14, '#8E7358')}`, 'cc-back');
  const pot = (px) => `<g>${[0, 1, 2, 3].map((i) => `<circle cx="${px + i * 34}" cy="${H - 38 + (i % 2) * 8}" r="${24 + (i % 3) * 5}" fill="${['#2E9E6B', '#3F8A52', '#2C6B3F'][i % 3]}"/>`).join('')}${[0, 1, 2, 3, 4].map((i) => `<circle cx="${px - 8 + i * 30}" cy="${H - 62 + (i % 3) * 10}" r="9" fill="${[BG.pink, BG.yellow, BG.red][i % 3]}"/>`).join('')}</g>`;
  const front = scSvg(W, H, `${pot(40)}${pot(3020)}`, 'cc-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M2200 0L2900 0L2300 ${H}L1500 ${H}Z" opacity=".5"/></g>`, 'cc-light');
  return { back, front, light, W, H, floor: fl, signs: CALLE.signs, map: CALLE.map };
}
/** Poteau de rue a deux plaques (SVG 240 x 520). opts : width, uid, letters (defaut true) = barres `.bg-let` (lettres) sur les plaques. */
function bgSignPost(opts) {
  opts = opts || {};
  const w = opts.width || 240, h = Math.round((w * 520) / 240), letters = opts.letters !== false;
  const plate = (y, c, seed) => {
    const rnd = rng(seed); let l = '';
    if (letters) { let lx = 34; while (lx < 192) { const lw = 10 + rnd() * 12; l += `<g class="bg-let"><rect x="${r1(lx)}" y="${y + 20}" width="${r1(lw)}" height="40" rx="3" fill="#1B2A5C"/><rect x="${r1(lx + 3)}" y="${y + 28}" width="${r1(Math.max(3, lw - 6))}" height="12" fill="${c}"/></g>`; lx += lw + 9; } }
    return `<g class="bg-plate"><rect x="14" y="${y}" width="212" height="80" rx="10" fill="${c}"/><rect x="20" y="${y + 6}" width="200" height="68" rx="7" fill="none" stroke="#1B2A5C" stroke-width="4"/>${l}</g>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 520" width="${w}" height="${h}" class="bg-post" aria-hidden="true"><rect x="108" y="30" width="24" height="490" fill="#3A3A4A"/><rect x="108" y="30" width="8" height="490" fill="#fff" opacity=".18"/><circle cx="120" cy="26" r="14" fill="#3A3A4A"/>${plate(60, '#FFF8EA', 3)}${plate(168, '#F2F2F2', 9)}</svg>`;
}
/** Plan de la ville sur panneau (SVG 420 x 330) : papier, rues, fleuve, cases de quartier ; opts.names (defaut true) = barres de noms `.bg-let` ; uid. */
function bgCityMap(opts) {
  opts = opts || {};
  const w = opts.width || 420, h = Math.round((w * 330) / 420), names = opts.names !== false, rnd = rng(opts.seed || 5);
  let s = `<rect x="6" y="6" width="408" height="318" rx="16" fill="${BG.wood}"/><rect x="18" y="18" width="384" height="294" rx="8" fill="#FFF3D6"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${30 + i * 66} 20V310" stroke="#D8C9A5" stroke-width="${i % 2 ? 6 : 10}"/>`;
  for (let j = 0; j < 4; j++) s += `<path d="M20 ${60 + j * 70}H400" stroke="#D8C9A5" stroke-width="${j % 2 ? 6 : 10}"/>`;
  s += `<path d="M20 250Q130 210 210 250T400 220" stroke="#8EC8EE" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M170 110L200 160L230 110Z" fill="${BG.red}"/><circle cx="200" cy="112" r="9" fill="#fff"/>`;
  if (names) for (let i = 0; i < 9; i++) { const nx = 40 + (i % 3) * 120 + rnd() * 20, ny = 54 + Math.floor(i / 3) * 70 + rnd() * 10; s += `<g class="bg-let"><rect x="${r1(nx)}" y="${r1(ny)}" width="${r1(50 + rnd() * 26)}" height="10" rx="4" fill="#1B2A5C"/></g>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 330" width="${w}" height="${h}" class="bg-citymap" aria-hidden="true">${s}</svg>`;
}
/** Lettre qui vole : petit glyphe isole (SVG 40 x 52) pour les flux d'encre de la Sombra. */
function bgLetterSvg(opts) {
  opts = opts || {};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="${opts.width || 40}" height="${Math.round(((opts.width || 40) * 52) / 40)}" aria-hidden="true"><rect x="4" y="4" width="32" height="44" rx="8" fill="${opts.c || '#1B2A5C'}"/><rect x="12" y="14" width="16" height="10" fill="#FFF8EA"/></svg>`;
}

// ---------------------------------------------------------------- accessoires de capsule (papier decoupe)
/** Carte de Colombie (SVG 520 x 600) : contour, relief des Andes (3 cordilleres), points Bogota / autres. opts : width, uid. */
function bgColombiaMap(opts) {
  opts = opts || {};
  const w = opts.width || 520, h = Math.round((w * 600) / 520), k = 33;
  const P = (lon, lat) => [r1((lon + 79.6) * k + 50), r1((13 - lat) * k + 8)];
  const out = [[-77.3, 8.6], [-76.2, 9.0], [-75.5, 10.4], [-74.8, 11.0], [-73.3, 11.3], [-72.2, 12.4], [-71.3, 12.4], [-71.9, 11.5], [-72.6, 10.8], [-72.5, 9.7], [-72.4, 8.4], [-71.9, 7.0], [-70.1, 6.9], [-67.8, 6.2], [-67.5, 5.2], [-67.9, 4.5], [-67.3, 3.3], [-67.8, 1.8], [-66.9, 1.2], [-69.9, 1.1], [-69.5, -1.0], [-70.1, -2.3], [-69.4, -4.2], [-70.5, -3.8], [-73.2, -4.2], [-75.2, -0.2], [-77.0, 0.3], [-78.8, 1.4], [-78.6, 2.5], [-77.9, 4.0], [-77.4, 6.0], [-77.9, 7.2]].map((p) => P(p[0], p[1]));
  const bog = P(-74.07, 4.71), med = P(-75.57, 6.25), cal = P(-76.52, 3.45), car = P(-75.5, 10.4);
  let s = `<path d="${smooth(out, true)}" fill="#F2C14E" stroke="#8A5A12" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="${smooth(out, true)}" fill="none" stroke="#fff" stroke-width="3" opacity=".5" transform="translate(-4 -4)"/>`;
  // cordilleres : trois chaines de reliefs triangulaires
  [[P(-77.0, 1.2), P(-76.6, 4.5), P(-76.0, 7.5), P(-75.4, 8.6)], [P(-75.6, 1.6), P(-75.2, 4.5), P(-74.8, 7.0), P(-74.0, 9.2)], [P(-77.4, 1.2), P(-76.6, 2.5), P(-73.6, 5.2), P(-72.6, 7.4)]].forEach((ch, ci) => {
    ch.forEach((p, i) => { s += `<path d="M${r1(p[0] - 16)} ${r1(p[1] + 12)}L${r1(p[0])} ${r1(p[1] - 20)}L${r1(p[0] + 16)} ${r1(p[1] + 12)}Z" fill="#B8742A"/><path d="M${r1(p[0])} ${r1(p[1] - 20)}L${r1(p[0] + 16)} ${r1(p[1] + 12)}H${r1(p[0] + 2)}Z" fill="#8A5A12" opacity=".6"/>`; });
  });
  [med, cal, car].forEach((p) => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#fff" stroke="#8A5A12" stroke-width="3"/>`; });
  s += `<g class="bg-pin" data-px="${bog[0]}" data-py="${bog[1]}"><circle class="bg-pin-halo" cx="${bog[0]}" cy="${bog[1]}" r="30" fill="#D8283A" opacity=".22"/><path d="M${bog[0]} ${bog[1] + 6}C${bog[0] - 34} ${bog[1] - 26} ${bog[0] - 28} ${bog[1] - 62} ${bog[0]} ${bog[1] - 62}C${bog[0] + 28} ${bog[1] - 62} ${bog[0] + 34} ${bog[1] - 26} ${bog[0]} ${bog[1] + 6}Z" fill="#D8283A" stroke="#fff" stroke-width="4"/><circle cx="${bog[0]}" cy="${bog[1] - 38}" r="9" fill="#fff"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 600" width="${w}" height="${h}" class="bg-colmap" aria-hidden="true" data-bx="${bog[0]}" data-by="${bog[1]}">${s}</svg>`;
}
/** Vitrine du Museo del Oro (SVG 760 x 520) : vitrine vitree sur socle, masque, collier, figurine, pieces d'or (originaux, generiques). */
function bgOroVitrina(opts) {
  opts = opts || {};
  const w = opts.width || 760, h = Math.round((w * 520) / 760), gold = '#F2B93B', gold2 = '#C98A12', gold3 = '#FFE08A';
  let s = `<rect x="40" y="60" width="680" height="400" rx="22" fill="#1B1E4A"/><rect x="40" y="60" width="680" height="400" rx="22" fill="none" stroke="#F5E6C8" stroke-width="10"/><rect x="60" y="400" width="640" height="60" fill="#3A2E6A"/><rect x="20" y="450" width="720" height="50" rx="12" fill="${BG.wood}"/>`;
  // masque
  s += `<g class="bg-oro bg-oro-mask"><ellipse cx="220" cy="250" rx="86" ry="104" fill="${gold}"/><ellipse cx="220" cy="250" rx="86" ry="104" fill="none" stroke="${gold2}" stroke-width="8"/><path d="M160 236Q186 216 208 238Q190 256 160 236Z M232 238Q254 216 280 236Q250 256 232 238Z" fill="#2A1A08"/><path d="M220 250V300M200 308Q220 322 240 308" stroke="${gold2}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M134 232Q104 240 108 290M306 232Q336 240 332 290" stroke="${gold}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="220" cy="170" r="10" fill="${gold3}"/></g>`;
  // collier
  s += `<g class="bg-oro bg-oro-neck"><path d="M380 150Q460 300 540 150" stroke="${gold2}" stroke-width="6" fill="none"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const t = i / 8, x = 380 + 160 * t, y = 150 + 300 * t * (1 - t) * 1.1; return `<circle cx="${r1(x)}" cy="${r1(y + 16)}" r="${i === 4 ? 18 : 12}" fill="${i % 2 ? gold : gold3}" stroke="${gold2}" stroke-width="3"/>`; }).join('')}</g>`;
  // figurine
  s += `<g class="bg-oro bg-oro-fig"><circle cx="610" cy="250" r="26" fill="${gold}" stroke="${gold2}" stroke-width="5"/><path d="M576 276H644L632 360H588Z" fill="${gold}" stroke="${gold2}" stroke-width="5"/><path d="M576 296L548 330M644 296L672 330M600 360L592 398M620 360L628 398" stroke="${gold2}" stroke-width="10" stroke-linecap="round"/><path d="M586 232Q610 206 634 232" stroke="${gold2}" stroke-width="6" fill="none"/></g>`;
  // pieces
  s += [[400, 410], [440, 416], [480, 410], [520, 418]].map((p, i) => `<g class="bg-oro"><ellipse cx="${p[0]}" cy="${p[1]}" rx="20" ry="8" fill="${gold}" stroke="${gold2}" stroke-width="3"/></g>`).join('');
  s += `<path d="M64 90L210 90L64 250Z" fill="#fff" opacity=".1"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520" width="${w}" height="${h}" class="bg-vitrina" aria-hidden="true">${s}</svg>`;
}
/** Teleferique de Monserrate (SVG 900 x 560) : colline, cable en pente, cabine (`.bg-cabin` pivot haut), funiculaire, sanctuaire, ville en bas. */
function bgTeleferico(opts) {
  opts = opts || {};
  const w = opts.width || 900, h = Math.round((w * 560) / 900);
  let s = `<rect width="900" height="560" fill="#BFE4F5"/><path d="M0 520Q260 440 500 300Q700 180 900 120V560H0Z" fill="#4B7F52"/><path d="M500 300Q700 180 900 120V560H640Z" fill="#2F5C3A" opacity=".45"/>`;
  s += `<path d="M120 500Q380 470 520 330" stroke="#E9D7A4" stroke-width="6" stroke-dasharray="14 10" fill="none"/>`;
  s += `<g>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${40 + i * 52}" y="${516 - (i % 3) * 8}" width="${40 + (i % 2) * 14}" height="${44 + (i % 3) * 10}" fill="${[BG.yellow, BG.pink, BG.blue, BG.white, BG.turq, BG.orange, BG.green][i]}"/><path d="M${34 + i * 52} ${516 - (i % 3) * 8}h${52 + (i % 2) * 14}l-8 -14h${-(36 + (i % 2) * 14)}Z" fill="${BG.tile}"/>`).join('')}</g>`;
  s += `<path d="M110 480L780 150" stroke="#2A2A3A" stroke-width="5"/><rect x="760" y="130" width="12" height="60" fill="#2A2A3A"/><rect x="100" y="470" width="12" height="60" fill="#2A2A3A"/>`;
  s += `<g class="bg-cabin" data-px="430" data-py="268"><path d="M430 268V292" stroke="#2A2A3A" stroke-width="5"/><rect x="394" y="292" width="72" height="50" rx="10" fill="${BG.red}"/><rect x="404" y="300" width="22" height="22" rx="4" fill="#FFE9A8"/><rect x="434" y="300" width="22" height="22" rx="4" fill="#FFE9A8"/><rect x="394" y="332" width="72" height="8" fill="#7A121E"/></g>`;
  s += `<g><rect x="820" y="72" width="54" height="48" fill="${BG.sanct}"/><path d="M812 72L847 40L882 72Z" fill="${BG.tile}"/><rect x="843" y="14" width="6" height="30" fill="${BG.sanct}"/><rect x="835" y="22" width="22" height="5" fill="${BG.sanct}"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="${w}" height="${h}" class="bg-tele" aria-hidden="true">${s}</svg>`;
}
/** Cathedrale de la Plaza de Bolivar + pigeons (SVG 900 x 560). Facade neoclassique simplifiee, statue sur socle, pave. */
function bgPlazaCard(opts) {
  opts = opts || {};
  const w = opts.width || 900, h = Math.round((w * 560) / 900), st = '#E8DCC0';
  let s = `<rect width="900" height="560" fill="#9CCDEE"/><rect y="400" width="900" height="160" fill="#B59471"/>`;
  s += `<rect x="180" y="150" width="540" height="270" fill="${st}"/><rect x="180" y="150" width="540" height="14" fill="#CDBE9A"/><path d="M200 150L450 70L700 150Z" fill="#D4C5A0"/><circle cx="450" cy="120" r="16" fill="${BG.white}" stroke="#B3A37A" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${220 + i * 86}" y="170" width="34" height="250" fill="#F4EBD3"/><rect x="${216 + i * 86}" y="160" width="42" height="12" fill="#CDBE9A"/>`;
  s += `<path d="M390 420V310Q450 250 510 310V420Z" fill="${BG.wood}"/><rect x="250" y="250" width="70" height="96" rx="10" fill="#3B2A4A"/><rect x="580" y="250" width="70" height="96" rx="10" fill="#3B2A4A"/>`;
  s += `<path d="M180 150V110L210 110V150ZM690 150V110L720 110V150Z" fill="${st}"/>`;
  s += `<rect x="410" y="430" width="80" height="50" fill="#9A8576"/><circle cx="450" cy="410" r="14" fill="#6F5F54"/><rect x="438" y="418" width="24" height="16" fill="#6F5F54"/>`;
  [[110, 470, 1], [260, 500, -1], [700, 480, 1], [800, 508, -1], [580, 520, 1]].forEach((p, i) => {
    s += `<g class="bg-pigeon" data-px="${p[0]}" data-py="${p[1]}" transform="translate(${p[0]} ${p[1]}) scale(${p[2]} 1)"><ellipse cx="0" cy="0" rx="22" ry="14" fill="#8F93A8"/><circle cx="20" cy="-10" r="9" fill="#7A7E94"/><path d="M28 -10l10 3l-10 3Z" fill="${BG.orange}"/><path d="M-20 -2l-16 -8l6 16Z" fill="#6E7288"/><circle cx="23" cy="-12" r="2" fill="#111"/><path d="M-4 14v10M6 14v10" stroke="${BG.tile}" stroke-width="3"/></g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="${w}" height="${h}" class="bg-plaza" aria-hidden="true">${s}</svg>`;
}
/** Rue colorée de La Candelaria en carte de papier (SVG 900 x 560) : maisons, balcons, pavés, graffiti generique. */
function bgStreetCard(opts) {
  opts = opts || {};
  const w = opts.width || 900, h = Math.round((w * 560) / 900);
  let s = `<rect width="900" height="560" fill="#9CCDEE"/>`;
  let x = -20, k = 0; const tones = [BG.yellow, BG.blue, BG.pink, BG.turq, BG.orange, BG.green];
  while (x < 900) { const ww = 190 + (k % 3) * 24; s += bgHouse(x, 440, ww, 300 + (k % 2) * 60, tones[k % tones.length], 11 + k * 7, { door: k % 2 }); x += ww + 8; k++; }
  s += bgCobbles(900, 440, 560, 33, '#B59471', '#7A5C3E');
  s += `<g class="bg-graf"><path d="M280 400q40 -60 80 0q40 60 80 0" stroke="${BG.pink}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="470" cy="380" r="16" fill="${BG.yellow}"/><path d="M500 410l30 -40l30 40Z" fill="${BG.turq}"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="${w}" height="${h}" class="bg-street" aria-hidden="true">${s}</svg>`;
}
/** Cycliste de profil (SVG 160 x 130) : roues `.bg-wheel` (rayons), corps. opts : c (couleur du maillot). */
function bgCyclist(opts) {
  opts = opts || {};
  const c = opts.c || BG.red, wheel = (cx) => `<g class="bg-wheel" data-px="${cx}" data-py="94"><circle cx="${cx}" cy="94" r="30" fill="none" stroke="#1E1A26" stroke-width="6"/><path d="M${cx - 28} 94H${cx + 28}M${cx} 66V122" stroke="#9AA3C7" stroke-width="3"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 130" width="${opts.width || 160}" height="${Math.round(((opts.width || 160) * 130) / 160)}" class="bg-cyc" aria-hidden="true">${wheel(34)}${wheel(124)}<path d="M34 94L70 60H110L124 94M70 60L84 94H34M84 94L110 60" stroke="#2A2A3A" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="M72 58L84 30L100 32L98 58Z" fill="${c}"/><circle cx="96" cy="16" r="12" fill="#D2956B"/><path d="M84 8Q96 -2 108 8Z" fill="#2A2A3A"/><path d="M98 36L116 56" stroke="#D2956B" stroke-width="7" stroke-linecap="round"/><path d="M80 60L90 94" stroke="${BG.blue}" stroke-width="9" stroke-linecap="round"/></svg>`;
}
/** Piéton qui marche/court (SVG 80 x 150). opts : c (haut), p (pantalon). */
function bgWalker(opts) {
  opts = opts || {};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 150" width="${opts.width || 80}" height="${Math.round(((opts.width || 80) * 150) / 80)}" class="bg-walker" aria-hidden="true"><circle cx="40" cy="20" r="14" fill="${opts.s || '#C98F66'}"/><path d="M26 14Q40 -4 54 14Z" fill="#1E120C"/><path d="M28 38H52L56 92H24Z" fill="${opts.c || BG.green}"/><path d="M28 92H40V140H28ZM42 92H54V140H42Z" fill="${opts.p || '#2F4A86'}"/><path d="M28 42L14 76M52 42L66 76" stroke="${opts.s || '#C98F66'}" stroke-width="8" stroke-linecap="round"/></svg>`;
}
/** Avenue de la Ciclovia (SVG 1400 x 640) : avenue large fermee aux voitures, plots, arbres, immeubles lointains, ligne d'horizon sur la montagne. Cyclistes et pietons = elements DOM a ajouter (bgCyclist / bgWalker). */
function bgCiclovia(opts) {
  opts = opts || {};
  const w = opts.width || 1400, h = Math.round((w * 640) / 1400);
  let s = `<rect width="1400" height="640" fill="#A9D8F2"/><path d="M0 250Q260 120 520 220T1040 170T1400 230V400H0Z" fill="#6F9A7A"/>`;
  [[80, 260], [200, 230], [330, 270], [500, 220], [660, 250], [820, 210], [980, 250], [1150, 230], [1290, 260]].forEach((b, i) => { s += scRect(b[0], b[1], 90, 160 + (i % 3) * 30, ['#C9B7A5', '#D8C9B8', '#BFA999'][i % 3]) + scRect(b[0] + 12, b[1] + 22, 66, 90, '#8FB0C8', 'opacity=".6"'); });
  s += `<path d="M0 400H1400V640H0Z" fill="#6B6F78"/><path d="M0 400H1400" stroke="#4A4E58" stroke-width="10"/><path d="M0 520H1400" stroke="#fff" stroke-width="8" stroke-dasharray="70 56"/>`;
  s += `<rect y="400" width="1400" height="26" fill="#8D9099"/>`;
  [[110, 410], [420, 410], [760, 410], [1090, 410]].forEach((t, i) => { s += `<rect x="${t[0] - 8}" y="${t[1] - 110}" width="16" height="110" fill="#6B4226"/><circle cx="${t[0]}" cy="${t[1] - 130}" r="64" fill="${['#3F8A52', '#2E9E6B'][i % 2]}"/>`; });
  [240, 560, 900, 1230].forEach((x) => { s += `<path d="M${x} 590l12 -42h16l12 42Z" fill="${BG.orange}"/><rect x="${x + 8}" y="${566}" width="32" height="8" fill="#fff"/>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 640" width="${w}" height="${h}" class="bg-ciclovia" aria-hidden="true">${s}</svg>`;
}

// ---------------------------------------------------------------- Valencia (unite 5) : Ciudad de las Artes y las Ciencias (formes blanches simplifiees, aucun texte), bassins turquoise,
// horloges arretees a 12:05 (chiffres 7 segments dessines en paths), paella, fallas. Prefixe vl : tout le kit est concatene dans un seul scope.
// Monuments publics simplifies, aucune marque.

const VL = {
  w1: '#FBF8F1', w2: '#E2E9EE', w3: '#BCCBD8', w4: '#8FA4B8', agua: '#2CC4C8', agua2: '#12909F', agua3: '#0B6E80', azul: '#2F8FD6',
  sand: '#EADFC6', sand2: '#CFBB92', nar: '#FF8A1F', nar2: '#E86A0C', hoja: '#2E9E5B', hoja2: '#1F7A45', hoja3: '#52BE6E',
  hierro: '#2B3A55', hierro2: '#455572', oro: '#FFC83D', rojo: '#D8352A', crema: '#FFFDF4',
};

// ---------------------------------------------------------------- chiffres 7 segments (aucun texte)
const VL_SEGS = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function vlDigit(x, y, w, h, d, on, off) {
  const t = h * 0.14, g = 1.6;
  const H = (x0, y0, len) => `M${r1(x0)} ${r1(y0)}l${r1(t / 2)} ${r1(-t / 2)}h${r1(len - t)}l${r1(t / 2)} ${r1(t / 2)}l${r1(-t / 2)} ${r1(t / 2)}h${r1(-(len - t))}Z`;
  const V = (x0, y0, len) => `M${r1(x0)} ${r1(y0)}l${r1(t / 2)} ${r1(t / 2)}v${r1(len - t)}l${r1(-t / 2)} ${r1(t / 2)}l${r1(-t / 2)} ${r1(-t / 2)}v${r1(-(len - t))}Z`;
  const P = {
    a: H(x + g, y + t / 2, w - 2 * g), d: H(x + g, y + h - t / 2, w - 2 * g), g: H(x + g, y + h / 2, w - 2 * g),
    f: V(x + t / 2, y + g, h / 2 - g), e: V(x + t / 2, y + h / 2 + g * 0.2, h / 2 - g), b: V(x + w - t / 2, y + g, h / 2 - g), c: V(x + w - t / 2, y + h / 2 + g * 0.2, h / 2 - g),
  };
  const lit = VL_SEGS[d] || '';
  return Object.keys(P).map((k) => `<path d="${P[k]}" fill="${lit.indexOf(k) >= 0 ? on : off}"/>`).join('');
}
/** Groupe SVG des chiffres 'HH:MM' (repere local 0..w x 0..h). Renvoie { g, w, h }. opts : on, off, dw (largeur d'un chiffre), dh. */
function vlDigitsG(time, opts) {
  opts = opts || {};
  const on = opts.on || '#FF5A3C', off = opts.off || 'rgba(255,255,255,0.07)', dw = opts.dw || 56, dh = opts.dh || 96, gap = 14, col = 26;
  const ch = String(time).split(''); let x = 0, s = '';
  ch.forEach((c) => {
    if (c === ':') { s += `<circle cx="${x + col / 2}" cy="${dh * 0.32}" r="6" fill="${on}"/><circle cx="${x + col / 2}" cy="${dh * 0.68}" r="6" fill="${on}"/>`; x += col + gap * 0.4; }
    else { s += vlDigit(x, 0, dw, dh, +c, on, off); x += dw + gap; }
  });
  return { g: s, w: x - gap, h: dh };
}
/** Affichage numerique seul (SVG, fond sombre arrondi). time 'HH:MM'. opts : width, on, uid. */
function vlDigital(time, opts) {
  opts = opts || {};
  const D = vlDigitsG(time, opts), pad = 26, W = D.w + pad * 2, H = D.h + pad * 2, ow = opts.width || 300;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r1(W)} ${r1(H)}" width="${ow}" height="${Math.round((ow * H) / W)}" class="vl-digital" style="overflow:visible" aria-hidden="true"><rect width="${r1(W)}" height="${r1(H)}" rx="18" fill="#16222E"/><rect x="5" y="5" width="${r1(W - 10)}" height="${r1(H - 10)}" rx="14" fill="none" stroke="#3A4C60" stroke-width="3"/><g transform="translate(${pad} ${pad})">${D.g}</g></svg>`;
}
/** Reveil numerique (400x300) : cloches, boitier bleu, ecran 7 segments. time 'HH:MM'. Parties : .vl-bellL / .vl-bellR (cloches), .vl-scr (ecran). */
function vlAlarm(time, opts) {
  opts = opts || {};
  const D = vlDigitsG(time, { on: opts.on || '#FF5A3C', dw: 50, dh: 86 }), ow = opts.width || 300, sx = 200 - D.w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="${ow}" height="${Math.round(ow * 0.75)}" class="vl-alarm" style="overflow:visible" aria-hidden="true">
<path d="M70 262l-16 26M330 262l16 26" stroke="#1B2140" stroke-width="12" stroke-linecap="round"/>
<g class="vl-bellL" data-px="110" data-py="96"><path d="M62 92Q110 18 158 92Z" fill="#FFC83D"/><path d="M62 92H158V102H62Z" fill="#E0A020"/><circle cx="110" cy="40" r="8" fill="#E0A020"/></g>
<g class="vl-bellR" data-px="290" data-py="96"><path d="M242 92Q290 18 338 92Z" fill="#FFC83D"/><path d="M242 92H338V102H242Z" fill="#E0A020"/><circle cx="290" cy="40" r="8" fill="#E0A020"/></g>
<rect x="30" y="86" width="340" height="190" rx="46" fill="#2F8FD6"/><rect x="30" y="86" width="340" height="190" rx="46" fill="none" stroke="#1D5E96" stroke-width="6"/><path d="M60 110Q200 92 340 110" stroke="#fff" stroke-width="8" fill="none" opacity=".25" stroke-linecap="round"/>
<g class="vl-scr"><rect x="62" y="116" width="276" height="130" rx="22" fill="#16222E"/><g transform="translate(${r1(sx)} ${r1(138 + (86 - D.h) / 2 - 0)})">${D.g}</g></g>
<circle cx="200" cy="268" r="9" fill="#FFC83D"/></svg>`;
}

// ---------------------------------------------------------------- horloge de rue (300x520, avec pied) ou horloge murale (300x300)
/** Horloge. opts : width, post (pied, defaut true), hour / min (angles en degres, defaut 12:05 = 2.5 / 30), uid.
 *  Parties animables : .vl-hh / .vl-hm (aiguilles ; pivot svgOrigin "150 150" en repere SVG), .vl-gl (halo vert de la plume), .vl-sh (voile d'ombre de la Sombra). */
function vlClock(opts) {
  opts = opts || {};
  const id = opts.uid || uid('vc'), post = opts.post !== false, H = post ? 520 : 300, ow = opts.width || 300;
  const ah = opts.hour == null ? 2.5 : opts.hour, am = opts.min == null ? 30 : opts.min;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180, big = i % 3 === 0, r = 112; ticks += `<circle cx="${r1(150 + Math.sin(a) * r)}" cy="${r1(150 - Math.cos(a) * r)}" r="${big ? 8 : 5}" fill="${big ? VL.rojo : VL.hierro}"/>`; }
  const pole = post ? `<defs><linearGradient id="${id}-p" x1="0" x2="1"><stop offset="0" stop-color="${VL.hierro}"/><stop offset=".5" stop-color="${VL.hierro2}"/><stop offset="1" stop-color="${VL.hierro}"/></linearGradient></defs><path d="M132 280H168L174 500H126Z" fill="url(#${id}-p)"/><rect x="112" y="486" width="76" height="26" rx="8" fill="${VL.hierro}"/><rect x="124" y="270" width="52" height="16" rx="6" fill="${VL.oro}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 ${H}" width="${ow}" height="${Math.round((ow * H) / 300)}" class="vl-clock" style="overflow:visible" aria-hidden="true">${pole}
<circle cx="150" cy="150" r="146" fill="${VL.hierro}"/><circle cx="150" cy="150" r="136" fill="${VL.oro}"/><circle cx="150" cy="150" r="126" fill="${VL.crema}"/><circle cx="150" cy="150" r="126" fill="none" stroke="${VL.sand2}" stroke-width="3"/>${ticks}
<circle class="vl-gl" cx="150" cy="150" r="130" fill="url(#${id}-g)" opacity="0"/><defs><radialGradient id="${id}-g"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".95"/><stop offset=".55" stop-color="#42E0A0" stop-opacity=".45"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>
<g class="vl-hh" data-px="150" data-py="150" transform="rotate(${ah} 150 150)"><path d="M141 164L150 70L159 164Z" fill="${VL.hierro}"/></g>
<g class="vl-hm" data-px="150" data-py="150" transform="rotate(${am} 150 150)"><path d="M144 166L150 40L156 166Z" fill="${VL.hierro2}"/></g>
<circle cx="150" cy="150" r="11" fill="${VL.rojo}"/><circle cx="150" cy="150" r="4" fill="${VL.crema}"/>
<circle class="vl-sh" cx="150" cy="150" r="146" fill="#14122A" opacity="0"/></svg>`;
}

// ---------------------------------------------------------------- paella (560 x 330) : feu de bois, poele, riz, poulet, haricots verts, tomate
/** Parties animables : .vl-flame (flammes, pivot bas), .vl-smoke (fumee, cercles .vl-pf). opts : width, uid. */
function vlPaella(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pl'), ow = opts.width || 560, rnd = rng(opts.seed || 9);
  let rice = '';
  for (let i = 0; i < 90; i++) { const a = rnd() * 6.283, r = Math.sqrt(rnd()); rice += `<ellipse cx="${r1(280 + Math.cos(a) * r * 214)}" cy="${r1(168 + Math.sin(a) * r * 48)}" rx="4.5" ry="2" fill="${i % 3 ? '#FFE27A' : '#E3A82C'}" transform="rotate(${Math.round(rnd() * 180)} ${r1(280 + Math.cos(a) * r * 214)} ${r1(168 + Math.sin(a) * r * 48)})"/>`; }
  const chick = [[170, 160, 0], [250, 188, 1], [340, 150, 2], [400, 182, 1], [300, 138, 0], [210, 134, 2], [440, 154, 0]].map((c) => `<g transform="translate(${c[0]} ${c[1]}) rotate(${c[2] * 24 - 20})"><ellipse rx="30" ry="15" fill="#B0682C"/><ellipse cx="-4" cy="-4" rx="20" ry="8" fill="#D08A44"/><circle cx="26" cy="2" r="6" fill="#F3E2C2"/></g>`).join('');
  const beans = [[130, 176], [200, 196], [290, 160], [372, 170], [326, 196], [150, 144], [420, 140], [240, 150], [460, 176], [364, 130]].map((b, i) => `<path d="M${b[0]} ${b[1]}q22 -12 44 ${i % 2 ? 6 : -4}" stroke="${i % 2 ? '#3E9B4F' : '#2E7D3E'}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('');
  const tom = [[190, 172], [310, 176], [392, 160], [262, 146], [120, 164]].map((t) => `<circle cx="${t[0]}" cy="${t[1]}" r="10" fill="#D8352A"/><circle cx="${t[0] - 3}" cy="${t[1] - 3}" r="4" fill="#F0705A"/>`).join('');
  const flames = [[200, 0], [280, 1], [360, 2]].map((f) => `<g class="vl-flame" data-px="${f[0]}" data-py="276"><path d="M${f[0] - 22} 276Q${f[0] - 26} 236 ${f[0] - 8} 214Q${f[0] - 6} 238 ${f[0]} 226Q${f[0] + 4} 198 ${f[0] + 4} 190Q${f[0] + 30} 226 ${f[0] + 22} 276Z" fill="#FF8A1F"/><path d="M${f[0] - 12} 276Q${f[0] - 14} 248 ${f[0]} 232Q${f[0] + 14} 250 ${f[0] + 12} 276Z" fill="#FFD24A"/></g>`).join('');
  const smoke = [[170, 80, 40], [235, 48, 52], [300, 74, 46], [360, 30, 40], [420, 66, 36]].map((s) => `<circle class="vl-pf" cx="${s[0]}" cy="${s[1]}" r="${s[2]}" fill="#E6E6EE" opacity=".55"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 330" width="${ow}" height="${Math.round(ow * 330 / 560)}" class="vl-paella" style="overflow:visible" aria-hidden="true"><defs><linearGradient id="${id}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C5CDD8"/><stop offset="1" stop-color="#7C8798"/></linearGradient></defs>
<g class="vl-smoke">${smoke}</g>
<ellipse cx="280" cy="312" rx="230" ry="14" fill="#000" opacity=".22"/>
<path d="M120 200L96 312M440 200L464 312M280 224V308" stroke="${VL.hierro}" stroke-width="10" stroke-linecap="round"/>
<g fill="#6B4226"><rect x="150" y="268" width="150" height="26" rx="12" transform="rotate(-8 225 281)"/><rect x="260" y="266" width="160" height="26" rx="12" transform="rotate(7 340 279)"/><rect x="190" y="282" width="170" height="24" rx="12"/></g><g fill="#8A5A34"><ellipse cx="156" cy="272" rx="10" ry="12"/><ellipse cx="410" cy="276" rx="10" ry="12"/></g>
${flames}
<path d="M46 156Q30 150 28 168Q34 180 62 176Z M514 156Q530 150 532 168Q526 180 498 176Z" fill="#7C8798"/>
<ellipse cx="280" cy="170" rx="250" ry="62" fill="url(#${id}-s)"/><path d="M30 170Q40 232 280 234Q520 232 530 170Q500 200 280 202Q60 200 30 170Z" fill="#6B7586" opacity=".6"/>
<ellipse cx="280" cy="166" rx="234" ry="54" fill="#8E98A8"/><ellipse cx="280" cy="168" rx="226" ry="49" fill="#EDC247"/><ellipse cx="280" cy="168" rx="226" ry="49" fill="none" stroke="#C99A24" stroke-width="3" opacity=".6"/>${rice}${beans}${chick}${tom}
<path d="M120 190Q280 224 440 190" stroke="#fff" stroke-width="4" fill="none" opacity=".25" stroke-linecap="round"/></svg>`;
}

// ---------------------------------------------------------------- batiments simplifies de la Ciudad de las Artes y las Ciencias
function vlHemi(cx, b, s) { // Hemisferic : dome blanc en forme d'oeil, pupille sombre sous la paupiere
  const w = 190 * s, h = 150 * s;
  return `<g class="vl-hemi"><path d="M${r1(cx - w)} ${b}A${r1(w)} ${r1(h)} 0 0 1 ${r1(cx + w)} ${b}Z" fill="${VL.w2}"/><path d="M${r1(cx)} ${r1(b - h)}A${r1(w)} ${r1(h)} 0 0 1 ${r1(cx + w)} ${b}H${r1(cx)}Z" fill="${VL.w3}" opacity=".55"/>
<circle cx="${r1(cx)}" cy="${r1(b - h * 0.42)}" r="${r1(h * 0.36)}" fill="#1D3A66"/><circle cx="${r1(cx)}" cy="${r1(b - h * 0.42)}" r="${r1(h * 0.2)}" fill="#0B1B33"/><circle cx="${r1(cx - h * 0.1)}" cy="${r1(b - h * 0.52)}" r="${r1(h * 0.07)}" fill="#fff" opacity=".75"/>
<path d="M${r1(cx - w * 1.12)} ${r1(b - h * 0.12)}Q${r1(cx)} ${r1(b - h * 1.38)} ${r1(cx + w * 1.12)} ${r1(b - h * 0.12)}Q${r1(cx)} ${r1(b - h * 0.68)} ${r1(cx - w * 1.12)} ${r1(b - h * 0.12)}Z" fill="${VL.w1}"/><path d="M${r1(cx - w * 1.12)} ${r1(b - h * 0.12)}Q${r1(cx)} ${r1(b - h * 0.68)} ${r1(cx + w * 1.12)} ${r1(b - h * 0.12)}" stroke="${VL.w4}" stroke-width="${r1(5 * s)}" fill="none" opacity=".6"/>
<rect x="${r1(cx - w * 1.1)}" y="${r1(b - 14 * s)}" width="${r1(w * 2.2)}" height="${r1(14 * s)}" fill="${VL.w3}"/></g>`;
}
function vlMuseo(x0, b, s) { // Museo de las Ciencias : coque blanche a cotes sur corps vitre
  const w = 640 * s, ribs = 11; let r = '';
  for (let i = 1; i < ribs; i++) { const xi = x0 + (w * i) / ribs; r += `<path d="M${r1(xi)} ${b - 110 * s}L${r1(xi + 14 * s)} ${r1(b - (150 + 230 * Math.sin((Math.PI * i) / ribs)) * s)}" stroke="${VL.w3}" stroke-width="${r1(6 * s)}" fill="none"/>`; }
  let glass = ''; for (let i = 0; i <= 14; i++) glass += `<path d="M${r1(x0 + (w * i) / 14)} ${r1(b - 110 * s)}V${b}" stroke="${VL.w1}" stroke-width="${r1(4 * s)}" opacity=".7"/>`;
  return `<g class="vl-museo"><rect x="${r1(x0)}" y="${r1(b - 110 * s)}" width="${r1(w)}" height="${r1(110 * s)}" fill="#8FC9E6"/>${glass}<rect x="${r1(x0)}" y="${r1(b - 114 * s)}" width="${r1(w)}" height="${r1(10 * s)}" fill="${VL.w2}"/>
<path d="M${r1(x0 - 10 * s)} ${r1(b - 108 * s)}Q${r1(x0 + w * 0.3)} ${r1(b - 430 * s)} ${r1(x0 + w * 0.62)} ${r1(b - 330 * s)}Q${r1(x0 + w * 0.9)} ${r1(b - 250 * s)} ${r1(x0 + w + 10 * s)} ${r1(b - 108 * s)}Z" fill="${VL.w1}"/>${r}
<path d="M${r1(x0 + w * 0.3)} ${r1(b - 360 * s)}Q${r1(x0 + w * 0.62)} ${r1(b - 400 * s)} ${r1(x0 + w * 0.92)} ${r1(b - 200 * s)}" stroke="${VL.w3}" stroke-width="${r1(5 * s)}" fill="none" opacity=".7"/></g>`;
}
function vlPalau(cx, b, s) { // Palau de les Arts : grande voute blanche a pointe, nef bleutee
  return `<g class="vl-palau"><path d="M${r1(cx - 140 * s)} ${b}V${r1(b - 240 * s)}Q${r1(cx - 120 * s)} ${r1(b - 500 * s)} ${r1(cx + 6 * s)} ${r1(b - 660 * s)}Q${r1(cx + 100 * s)} ${r1(b - 520 * s)} ${r1(cx + 140 * s)} ${r1(b - 300 * s)}V${b}Z" fill="${VL.w1}"/>
<path d="M${r1(cx + 6 * s)} ${r1(b - 660 * s)}Q${r1(cx + 100 * s)} ${r1(b - 520 * s)} ${r1(cx + 140 * s)} ${r1(b - 300 * s)}V${b}H${r1(cx + 20 * s)}Z" fill="${VL.w2}"/>
<path d="M${r1(cx - 78 * s)} ${b}V${r1(b - 230 * s)}Q${r1(cx - 60 * s)} ${r1(b - 420 * s)} ${r1(cx)} ${r1(b - 500 * s)}Q${r1(cx + 60 * s)} ${r1(b - 420 * s)} ${r1(cx + 78 * s)} ${r1(b - 230 * s)}V${b}Z" fill="#7FB7DA"/><path d="M${r1(cx)} ${r1(b - 500 * s)}V${b}M${r1(cx - 40 * s)} ${r1(b - 440 * s)}V${b}M${r1(cx + 40 * s)} ${r1(b - 440 * s)}V${b}" stroke="${VL.w1}" stroke-width="${r1(4 * s)}" opacity=".8"/>
<path d="M${r1(cx - 160 * s)} ${r1(b - 40 * s)}H${r1(cx + 160 * s)}V${b}H${r1(cx - 160 * s)}Z" fill="${VL.w3}"/></g>`;
}
function vlMast(x, b, s) { // pont a haubans (pylone blanc + cables)
  let c = ''; for (let i = 0; i < 9; i++) c += `<path d="M${r1(x)} ${r1(b - 640 * s)}L${r1(x + (60 + i * 46) * s)} ${r1(b - 40 * s)}" stroke="${VL.w1}" stroke-width="${r1(2.6 * s)}" opacity=".8"/>`;
  return `<g class="vl-mast"><path d="M${r1(x - 9 * s)} ${b}L${r1(x - 4 * s)} ${r1(b - 650 * s)}L${r1(x + 4 * s)} ${r1(b - 650 * s)}L${r1(x + 9 * s)} ${b}Z" fill="${VL.w1}"/>${c}<path d="M${r1(x - 40 * s)} ${r1(b - 36 * s)}H${r1(x + 520 * s)}" stroke="${VL.w2}" stroke-width="${r1(7 * s)}"/></g>`;
}
function vlPalm(x, b, s, k) {
  let f = ''; const cols = [VL.hoja, VL.hoja2, VL.hoja3];
  for (let i = 0; i < 8; i++) { const a = -90 + (i - 3.5) * 38 + (k || 0); f += `<path d="M0 0Q${r1(54 * s)} ${r1(-46 * s)} ${r1(130 * s)} ${r1(-4 * s)}Q${r1(66 * s)} ${r1(-16 * s)} 0 0Z" fill="${cols[i % 3]}" transform="rotate(${a} 0 0) translate(0 0)"/>`; }
  return `<g class="vl-palm"><path d="M${r1(x - 9 * s)} ${b}Q${r1(x - 20 * s)} ${r1(b - 150 * s)} ${r1(x + 6 * s)} ${r1(b - 290 * s)}L${r1(x + 18 * s)} ${r1(b - 288 * s)}Q${r1(x - 2 * s)} ${r1(b - 150 * s)} ${r1(x + 10 * s)} ${b}Z" fill="#8A5A34"/><g transform="translate(${r1(x + 12 * s)} ${r1(b - 290 * s)})">${f}</g></g>`;
}
function vlOrangeTree(x, b, s) {
  let o = ''; [[-40, -170], [30, -190], [-6, -128], [56, -140], [-62, -120], [18, -224]].forEach((p) => { o += `<circle cx="${r1(x + p[0] * s)}" cy="${r1(b + p[1] * s)}" r="${r1(11 * s)}" fill="${VL.nar}"/><circle cx="${r1(x + (p[0] - 3) * s)}" cy="${r1(b + (p[1] - 3) * s)}" r="${r1(4 * s)}" fill="#FFC070"/>`; });
  return `<g class="vl-otree"><rect x="${r1(x - 9 * s)}" y="${r1(b - 110 * s)}" width="${r1(18 * s)}" height="${r1(110 * s)}" fill="#6B4226"/><circle cx="${r1(x)}" cy="${r1(b - 170 * s)}" r="${r1(88 * s)}" fill="${VL.hoja2}"/><circle cx="${r1(x - 44 * s)}" cy="${r1(b - 140 * s)}" r="${r1(58 * s)}" fill="${VL.hoja}"/><circle cx="${r1(x + 50 * s)}" cy="${r1(b - 150 * s)}" r="${r1(62 * s)}" fill="${VL.hoja}"/><circle cx="${r1(x + 8 * s)}" cy="${r1(b - 214 * s)}" r="${r1(54 * s)}" fill="${VL.hoja3}"/>${o}</g>`;
}
/** Etal d'oranges (PREMIER PLAN, 420 x 360 environ) : auvent raye, cageots d'oranges. x = centre, b = sol. */
function vlOrangeStall(x, b, s) {
  const w = 380 * s; let aw = '', ors = '';
  for (let i = 0; i < 8; i++) aw += `<path d="M${r1(x - w / 2 + (w * i) / 8)} ${r1(b - 300 * s)}h${r1(w / 8)}v${r1(50 * s)}q${r1(-w / 16)} ${r1(22 * s)} ${r1(-w / 8)} 0Z" fill="${i % 2 ? VL.nar : VL.crema}"/>`;
  for (let i = 0; i < 18; i++) { const ox = x - w / 2 + 30 * s + (i % 9) * 38 * s, oy = b - (118 + Math.floor(i / 9) * 30) * s; ors += `<circle cx="${r1(ox)}" cy="${r1(oy)}" r="${r1(19 * s)}" fill="${i % 4 ? VL.nar : VL.nar2}"/><circle cx="${r1(ox - 6 * s)}" cy="${r1(oy - 6 * s)}" r="${r1(6 * s)}" fill="#FFC070"/>`; }
  return `<g class="vl-stall"><rect x="${r1(x - w / 2 + 10 * s)}" y="${r1(b - 250 * s)}" width="${r1(10 * s)}" height="${r1(250 * s)}" fill="#6B4226"/><rect x="${r1(x + w / 2 - 20 * s)}" y="${r1(b - 250 * s)}" width="${r1(10 * s)}" height="${r1(250 * s)}" fill="#6B4226"/>
<path d="M${r1(x - w / 2 - 10 * s)} ${r1(b - 250 * s)}L${r1(x - w / 2 + 24 * s)} ${r1(b - 330 * s)}H${r1(x + w / 2 - 24 * s)}L${r1(x + w / 2 + 10 * s)} ${r1(b - 250 * s)}Z" fill="${VL.nar2}"/>${aw}
<rect x="${r1(x - w / 2)}" y="${r1(b - 100 * s)}" width="${r1(w)}" height="${r1(100 * s)}" fill="#C98A52"/><rect x="${r1(x - w / 2)}" y="${r1(b - 112 * s)}" width="${r1(w)}" height="${r1(14 * s)}" fill="#E4B070"/>${ors}</g>`;
}
function vlBuildings(b, s0) { // la ligne d'horizon de la Ciudad (reutilisee pour le reflet)
  const s = s0 || 1;
  return vlMast(3010, b, 1.0 * s) + vlPalau(2650, b, 1.0 * s) + vlMuseo(950, b, 1.15 * s) + vlHemi(500, b, 1.5 * s);
}
function vlStoneFloor(W, y0, H, c1, c2) { // dalles en perspective
  let s = `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${c1}"/>`;
  for (let i = 0; i < 12; i++) { const y = y0 + Math.pow(i / 12, 1.5) * (H - y0); s += `<path d="M0 ${r1(y)}H${W}" stroke="${c2}" stroke-width="3" opacity=".45"/>`; }
  for (let i = -8; i < 28; i++) s += `<path d="M${i * 150} ${y0}L${r1(i * 150 + (i - 10) * 90)} ${H}" stroke="${c2}" stroke-width="3" opacity=".3"/>`;
  return s;
}

// ---------------------------------------------------------------- panorama de Valencia (3200 x 1200) : plein soleil, bassins turquoise
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY } (parallaxe : far .25, mid .6, near 1). Eau scintillante : .vl-sh (traits), soleil .sk-disc / .sk-rays. */
function vlSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('vk'), g = (n) => `${id}-${n}`, W = 3200, H = 1200, hor = 800, rnd = rng(opts.seed || 33);
  let clouds = ''; [[300, 250, 520, 70], [1200, 170, 620, 84], [2000, 300, 480, 66], [2700, 200, 600, 80]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 90 + i * 3, 'front'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E8CE0"/><stop offset=".42" stop-color="#7CC8F0"/><stop offset=".7" stop-color="#CDEBF5"/><stop offset=".82" stop-color="#FFF0D0"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'vk-sky');
  const sx = opts.sunX || 2050, sy = opts.sunY || 330;
  let rays = ''; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, a2 = a + Math.PI / 36; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1400)} ${r1(sy + Math.sin(a) * 1400)}L${r1(sx + Math.cos(a2) * 1400)} ${r1(sy + Math.sin(a2) * 1400)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFFBD0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE48A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE48A" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFF6C8" opacity=".09" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="380" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="64" fill="#FFFBD0"/>`, 'vk-sun');
  let hills = `M0 ${hor}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(hor - 70 - 36 * Math.sin(x / 400) - 16 * Math.sin(x / 140))}`; hills += `L${W} ${hor}Z`;
  let farB = ''; for (let i = 0; i < 16; i++) { const bx = 40 + i * 205 + rnd() * 60, bh = 70 + rnd() * 120; farB += `<rect x="${r1(bx)}" y="${r1(hor - bh)}" width="${r1(70 + rnd() * 50)}" height="${r1(bh)}" fill="${i % 2 ? '#CFE0EA' : '#E9DDC9'}" opacity=".85"/>`; }
  const far = scSvg(W, H, `<path d="${hills}" fill="#A7C7D6" opacity=".55"/>${farB}${scRect(0, hor - 2, W, 14, '#8FB5C6')}`, 'vk-far');
  const mid = scSvg(W, H, `${vlBuildings(hor)}${vlPalm(180, hor + 6, 1.3)}${vlPalm(1020, hor + 6, 1.05, 10)}${vlPalm(2200, hor + 6, 1.2, -8)}${vlPalm(3040, hor + 6, 1.35)}${scRect(0, hor, W, 18, VL.sand)}${scRect(0, hor + 18, W, 8, VL.sand2)}`, 'vk-mid');
  // premier plan : bassin turquoise (reflet des batiments), traits de lumiere, bord de pierre, palmiers et etal d'oranges
  let glints = ''; for (let i = 0; i < 46; i++) glints += `<path class="vl-sh" d="M${r1(rnd() * W)} ${r1(860 + rnd() * 320)}h${r1(30 + rnd() * 50)}" stroke="#fff" stroke-width="${i % 3 ? 4 : 6}" stroke-linecap="round" opacity=".55"/>`;
  const near = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${VL.agua}"/><stop offset="1" stop-color="${VL.agua2}"/></linearGradient><clipPath id="${g('c')}"><rect x="0" y="${hor + 26}" width="${W}" height="${H - hor - 26}"/></clipPath></defs>
${scRect(0, hor + 26, W, H - hor - 26, `url(#${g('w')})`)}<g clip-path="url(#${g('c')})"><g transform="translate(0 ${2 * (hor + 26)}) scale(1 -1)" opacity=".36">${vlBuildings(hor + 26)}</g></g>${glints}
${scRect(0, 1130, W, 70, VL.sand)}${scRect(0, 1126, W, 8, VL.sand2)}${vlPalm(260, 1180, 1.7)}${vlPalm(1750, 1190, 1.5, 12)}${vlOrangeStall(2750, 1186, 1.15)}${vlOrangeTree(3130, 1186, 0.9)}`, 'vk-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy };
}

// ---------------------------------------------------------------- esplanade de la Ciudad (3200 x 1200) : decor de scene (dalles, bassin, edifices en fond)
const VLPLAZA = { W: 3200, H: 1200, floor: 930, pool: 780, clock: { x: 2230, foot: 960 }, paella: { x: 2760, floor: 1010 } };
/** Retourne { back, front, light, W, H, floor, clock, paella }. L'horloge de rue et la paella sont des elements a poser (vlClock / vlPaella) pour pouvoir les animer. */
function vlPlaza(opts) {
  opts = opts || {};
  const id = opts.uid || uid('vz'), g = (n) => `${id}-${n}`, W = VLPLAZA.W, H = VLPLAZA.H, fl = VLPLAZA.floor, pool = VLPLAZA.pool;
  const sky = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E8CE0"/><stop offset=".45" stop-color="#7CC8F0"/><stop offset=".72" stop-color="#E0F1F5"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${VL.agua}"/><stop offset="1" stop-color="${VL.agua2}"/></linearGradient><clipPath id="${g('c')}"><rect x="0" y="${pool}" width="${W}" height="${fl - pool}"/></clipPath><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".5"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".02"/></linearGradient></defs>`;
  let glints = ''; const rnd = rng(opts.seed || 12); for (let i = 0; i < 26; i++) glints += `<path class="vl-sh" d="M${r1(rnd() * W)} ${r1(pool + 20 + rnd() * (fl - pool - 40))}h${r1(30 + rnd() * 50)}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/>`;
  const back = scSvg(W, H, `${sky}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(500, 170, 560, 78, 91, 'front')}${cloudSvg(2000, 130, 640, 84, 93, 'front')}${cloudSvg(2900, 240, 420, 62, 95, 'front')}
${vlBuildings(pool)}${vlPalm(120, pool + 6, 1.3)}${vlPalm(1000, pool + 6, 1.1, 8)}${vlPalm(3100, pool + 6, 1.35)}
${scRect(0, pool, W, 10, VL.sand)}${scRect(0, pool + 10, W, fl - pool - 10, `url(#${g('w')})`)}<g clip-path="url(#${g('c')})"><g transform="translate(0 ${2 * (pool + 10)}) scale(1 -1)" opacity=".36">${vlBuildings(pool + 10)}</g></g>${glints}
${vlStoneFloor(W, fl - 4, H, '#EFE4CC', '#C9B68E')}${scRect(0, fl - 8, W, 14, VL.sand2)}`, 'vz-back');
  const planter = (px) => `<g><rect x="${px - 70}" y="${H - 70}" width="140" height="70" rx="10" fill="#C98A52"/><rect x="${px - 76}" y="${H - 82}" width="152" height="16" rx="8" fill="#E4B070"/>${[-40, -14, 14, 40].map((dx, i) => `<circle cx="${px + dx}" cy="${H - 100 - (i % 2) * 14}" r="${30 + (i % 2) * 6}" fill="${[VL.hoja, VL.hoja2, VL.hoja3, VL.hoja][i]}"/>`).join('')}<circle cx="${px - 20}" cy="${H - 120}" r="8" fill="${VL.nar}"/><circle cx="${px + 30}" cy="${H - 108}" r="8" fill="${VL.nar}"/></g>`;
  const front = scSvg(W, H, `${planter(70)}${planter(3130)}`, 'vz-front');
  const light = scSvg(W, H, `${sky}<g class="ac-beams" fill="url(#${g('b')})"><path d="M1700 0L2500 0L2000 ${H}L1100 ${H}Z" opacity=".35"/></g>`, 'vz-light');
  return { back, front, light, W, H, floor: fl, pool, clock: VLPLAZA.clock, paella: VLPLAZA.paella };
}

// ---------------------------------------------------------------- accessoires de capsule (papier decoupe)
/** key : 'europa' (carte Europe/Espagne/France 520x420) | 'desayuno' | 'comida' | 'merienda' | 'cena' (assiettes 200x200, .vl-glow = halo or) |
 *  'mochila' (200x240) | 'sillon' (abuelo endormi 300x280 ; .vl-z = les Z) | 'colegio' (520x340) | 'falla' (360x540 ; opts.fire = flammes .vl-fl) |
 *  'naranja' (80x80) | 'humo' (nuage de fumee de mascleta 500x300, .vl-pf). opts : width, uid, fire. */
function vlProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('vp'), W = opts.width || 200, rnd = rng(opts.seed || 4);
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round(W * h)}" class="vl-prop vl-${key}" style="overflow:visible" aria-hidden="true">${inner}</svg>`;
  const plate = (inner) => `<circle class="vl-glow" cx="100" cy="100" r="104" fill="none" stroke="#FFC83D" stroke-width="10" opacity="0"/><circle cx="100" cy="104" r="86" fill="#000" opacity=".18"/><circle cx="100" cy="100" r="86" fill="#FFFDF4"/><circle cx="100" cy="100" r="86" fill="none" stroke="#2F8FD6" stroke-width="7"/><circle cx="100" cy="100" r="64" fill="none" stroke="#9CC9EC" stroke-width="3"/>${inner}`;
  if (key === 'europa') {
    return mk('0 0 520 420', 0.808, `<rect x="0" y="0" width="520" height="420" rx="26" fill="#2F6FD0"/><path d="M130 52L170 40L186 70L150 84Z M92 96L112 90L116 124L96 126Z" fill="#D6E4C8"/>
<path class="vl-fr" d="M150 130L210 100L300 108L342 152L312 208L262 224L202 230L150 210L124 166Z" fill="#6FA8DC" stroke="#FFFDF4" stroke-width="5"/>
<path d="M340 104L424 84L466 134L402 192L340 156Z" fill="#D6E4C8" stroke="#FFFDF4" stroke-width="4"/><path d="M332 206L404 204L440 304L408 336L384 266L332 232Z" fill="#D6E4C8" stroke="#FFFDF4" stroke-width="4"/>
<path class="vl-pt" d="M58 254L96 236L100 340L72 322Z" fill="#E8D8B0" stroke="#FFFDF4" stroke-width="4"/>
<path class="vl-es" d="M96 236L200 232L258 224L282 256L252 306L206 342L112 346L100 336Z" fill="#FFC83D" stroke="#FFFDF4" stroke-width="5"/>
<path d="M120 260Q170 250 220 262" stroke="#E0A020" stroke-width="4" fill="none" opacity=".6"/>
<circle cx="176" cy="290" r="9" fill="#D8352A"/><circle cx="236" cy="164" r="9" fill="#2B318A"/>`);
  }
  if (key === 'desayuno') return mk('0 0 200 200', 1, plate(`<path d="M52 118Q64 74 112 80Q150 88 148 122Q132 100 112 108Q86 100 52 118Z" fill="#E0A04C"/><path d="M66 112Q80 92 106 94" stroke="#F4C480" stroke-width="6" fill="none" stroke-linecap="round"/><g transform="translate(112 92)"><rect x="-6" y="-10" width="56" height="42" rx="10" fill="#C9573B"/><path d="M50 0q22 0 22 16q0 14 -22 14" stroke="#C9573B" stroke-width="8" fill="none"/><ellipse cx="22" cy="-8" rx="26" ry="8" fill="#6B3E26"/></g>`));
  if (key === 'comida') return mk('0 0 200 200', 1, plate(`<ellipse cx="100" cy="106" rx="54" ry="40" fill="#EDC247"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<ellipse cx="${r1(70 + rnd() * 60)}" cy="${r1(92 + rnd() * 30)}" rx="5" ry="2.4" fill="#FFE27A"/>`).join('')}<ellipse cx="86" cy="100" rx="17" ry="10" fill="#B0682C"/><ellipse cx="122" cy="112" rx="15" ry="9" fill="#B0682C"/><path d="M70 120q16 -10 32 0" stroke="#3E9B4F" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="106" cy="86" r="8" fill="#D8352A"/>`));
  if (key === 'merienda') return mk('0 0 200 200', 1, plate(`<rect x="52" y="82" width="96" height="30" rx="14" fill="#E8B15C"/><rect x="56" y="106" width="88" height="14" rx="6" fill="#D8352A"/><rect x="52" y="114" width="96" height="26" rx="13" fill="#E8B15C"/><path d="M66 90Q100 80 134 90" stroke="#F8D993" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="150" cy="70" r="14" fill="${VL.nar}"/><path d="M150 56q4 -10 12 -10" stroke="${VL.hoja}" stroke-width="5" fill="none"/>`));
  if (key === 'cena') return mk('0 0 200 200', 1, plate(`<circle cx="100" cy="100" r="46" fill="#F4D36B"/><circle cx="100" cy="100" r="46" fill="none" stroke="#C99A24" stroke-width="5"/><path d="M100 100L146 100A46 46 0 0 0 130 66Z" fill="#E8B83C"/><circle cx="80" cy="86" r="8" fill="#E8F0C0"/><circle cx="114" cy="122" r="9" fill="#E8F0C0"/><circle cx="116" cy="84" r="6" fill="${VL.hoja}"/><circle cx="84" cy="120" r="6" fill="${VL.hoja}"/>`));
  if (key === 'mochila') return mk('0 0 200 240', 1.2, `<path d="M64 62Q100 18 136 62" stroke="#1B2140" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="26" y="52" width="148" height="170" rx="46" fill="#2F8FD6"/><rect x="26" y="52" width="148" height="170" rx="46" fill="none" stroke="#1D5E96" stroke-width="5"/><rect x="46" y="140" width="108" height="64" rx="22" fill="#FF9F1C"/><path d="M60 156H140" stroke="#E86A0C" stroke-width="6"/><circle cx="100" cy="176" r="9" fill="#FFC83D"/><path d="M52 90Q100 70 148 90" stroke="#fff" stroke-width="7" fill="none" opacity=".3" stroke-linecap="round"/>`);
  if (key === 'sillon') return mk('0 0 300 280', 0.934, `<ellipse cx="150" cy="268" rx="130" ry="12" fill="#000" opacity=".22"/><rect x="30" y="64" width="240" height="170" rx="54" fill="#8F2438"/><rect x="14" y="140" width="64" height="110" rx="26" fill="#A62E46"/><rect x="222" y="140" width="64" height="110" rx="26" fill="#A62E46"/><rect x="60" y="170" width="180" height="70" rx="22" fill="#B83A55"/>
<path d="M92 176Q150 150 214 176L222 244H84Z" fill="#6FA8DC"/><path d="M92 176Q150 150 214 176" stroke="#9CC9EC" stroke-width="5" fill="none"/>
<circle cx="150" cy="110" r="42" fill="#E0A57C"/><path d="M110 98Q112 64 150 62Q190 64 190 98Q176 80 150 82Q124 80 110 98Z" fill="#E4E0DA"/><path d="M110 112Q104 140 118 146M190 112Q196 140 182 146" stroke="#E4E0DA" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M126 112Q136 120 146 112M156 112Q166 120 176 112" stroke="#3B2216" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M138 134Q150 140 162 134" stroke="#8F1D4E" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="124" cy="126" r="7" fill="#FF7A7A" opacity=".3"/><circle cx="176" cy="126" r="7" fill="#FF7A7A" opacity=".3"/>
<g class="vl-z" fill="none" stroke="#F5E6C8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path class="vl-z1" d="M214 54h22l-22 24h22"/><path class="vl-z2" d="M244 22h26l-26 28h26"/></g>`);
  if (key === 'colegio') return mk('0 0 520 340', 0.654, `<rect x="20" y="70" width="480" height="250" fill="#D9805C"/><rect x="20" y="70" width="480" height="18" fill="#B4503A"/><path d="M0 70L260 6L520 70Z" fill="#B4503A"/><path d="M0 70L260 6L520 70" stroke="#8E3A2B" stroke-width="6" fill="none"/>
${[60, 160, 330, 430].map((x) => `<rect x="${x}" y="110" width="40" height="70" rx="6" fill="#CFE9F5"/><path d="M${x + 20} 110V180M${x} 145H${x + 40}" stroke="#FFFDF4" stroke-width="5"/><rect x="${x}" y="206" width="40" height="70" rx="6" fill="#CFE9F5"/><path d="M${x + 20} 206V276M${x} 241H${x + 40}" stroke="#FFFDF4" stroke-width="5"/>`).join('')}
<path d="M216 320V220Q216 190 260 190Q304 190 304 220V320Z" fill="#6B3E26"/><path d="M260 190V320" stroke="#3B2216" stroke-width="5"/><circle cx="260" cy="146" r="22" fill="#FFFDF4"/><circle cx="260" cy="146" r="22" fill="none" stroke="#2B3A55" stroke-width="5"/><rect x="0" y="318" width="520" height="22" fill="#CFBB92"/>`);
  if (key === 'falla') {
    const fire = opts.fire ? [[40, 400, 1.2], [110, 330, 1.5], [180, 260, 1.8], [250, 340, 1.5], [310, 410, 1.2], [140, 440, 1.3], [230, 450, 1.3]].map((f) => `<g class="vl-fl" data-px="${f[0]}" data-py="${f[1] + 70}"><path d="M${f[0] - 26 * f[2]} ${f[1] + 70}Q${f[0] - 34 * f[2]} ${f[1] + 20} ${f[0] - 8 * f[2]} ${f[1] - 20 * f[2]}Q${f[0] - 4 * f[2]} ${f[1] + 10} ${f[0] + 4} ${f[1]}Q${f[0] + 8 * f[2]} ${f[1] - 50 * f[2]} ${f[0] + 6} ${f[1] - 70 * f[2]}Q${f[0] + 44 * f[2]} ${f[1] - 10} ${f[0] + 30 * f[2]} ${f[1] + 70}Z" fill="#FF6A1F"/><path d="M${f[0] - 14 * f[2]} ${f[1] + 70}Q${f[0] - 16 * f[2]} ${f[1] + 30} ${f[0]} ${f[1] - 10}Q${f[0] + 20 * f[2]} ${f[1] + 30} ${f[0] + 14 * f[2]} ${f[1] + 70}Z" fill="#FFC83D"/></g>`).join('') : '';
    return mk('0 0 360 540', 1.5, `<ellipse cx="180" cy="520" rx="170" ry="14" fill="#000" opacity=".22"/><rect x="10" y="470" width="340" height="44" rx="8" fill="#7A4A2B"/><rect x="10" y="470" width="340" height="12" fill="#A06A3E"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${34 + i * 49}" cy="494" r="9" fill="${[VL.oro, VL.rojo, VL.azul][i % 3]}"/>`).join('')}
<rect x="50" y="394" width="260" height="80" rx="10" fill="#D8352A"/><rect x="50" y="394" width="260" height="14" fill="#FFC83D"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${76 + i * 52} 432l14 14l-14 14l-14 -14Z" fill="#FFC83D"/>`).join('')}
<rect x="86" y="326" width="188" height="72" rx="10" fill="#2F8FD6"/><rect x="86" y="326" width="188" height="12" fill="#FFFDF4"/>${[0, 1, 2].map((i) => `<circle cx="${130 + i * 50}" cy="366" r="14" fill="#FF9F1C"/>`).join('')}
<path d="M120 330Q110 230 180 200Q250 230 240 330Z" fill="#E8368F"/><path d="M180 200Q250 230 240 330H196Z" fill="#B82272" opacity=".55"/><path d="M130 300Q180 320 230 300" stroke="#FFC83D" stroke-width="8" fill="none"/>
<path d="M120 250Q70 230 60 190" stroke="#E0A57C" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M240 250Q290 230 300 190" stroke="#E0A57C" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="58" cy="182" r="16" fill="#E0A57C"/><circle cx="302" cy="182" r="16" fill="#E0A57C"/>
<circle cx="180" cy="150" r="58" fill="#E0A57C"/><circle cx="180" cy="86" r="26" fill="#2A160E"/><circle cx="130" cy="124" r="22" fill="#2A160E"/><circle cx="230" cy="124" r="22" fill="#2A160E"/><path d="M128 130Q180 90 232 130Q220 106 180 100Q140 106 128 130Z" fill="#2A160E"/><path d="M166 70L180 40L194 70Z" fill="#FFC83D"/><circle cx="180" cy="38" r="8" fill="#D8352A"/>
<circle cx="158" cy="152" r="9" fill="#2A160E"/><circle cx="202" cy="152" r="9" fill="#2A160E"/><circle cx="161" cy="149" r="3" fill="#fff"/><circle cx="205" cy="149" r="3" fill="#fff"/><path d="M160 178Q180 196 200 178" stroke="#8F1D4E" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="142" cy="170" r="11" fill="#FF7A7A" opacity=".4"/><circle cx="218" cy="170" r="11" fill="#FF7A7A" opacity=".4"/>
${[[34, 420, '#D8352A'], [326, 410, '#2F8FD6'], [20, 330, '#FFC83D'], [340, 320, '#19B7AA']].map((b, i) => `<path d="M${b[0]} ${b[1]}V${b[1] + 60}" stroke="#F5E6C8" stroke-width="3"/><ellipse cx="${b[0]}" cy="${b[1] - 4}" rx="22" ry="28" fill="${b[2]}"/><ellipse cx="${b[0] - 7}" cy="${b[1] - 14}" rx="5" ry="9" fill="#fff" opacity=".4"/>`).join('')}${fire}`);
  }
  if (key === 'naranja') return mk('0 0 80 80', 1, `<circle cx="40" cy="44" r="30" fill="${VL.nar}"/><circle cx="31" cy="35" r="8" fill="#FFC070"/><path d="M40 16q-6 -12 6 -14q14 2 4 14Z" fill="${VL.hoja}"/>`);
  if (key === 'humo') {
    let p = ''; [[110, 190, 70], [200, 150, 90], [300, 180, 80], [390, 200, 64], [160, 110, 64], [270, 90, 70], [350, 120, 58], [230, 200, 60]].forEach((c, i) => { p += `<circle class="vl-pf" cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${i % 2 ? '#D8D8E2' : '#EDEDF4'}"/>`; });
    return mk('0 0 500 300', 0.6, p);
  }
  return '';
}

/** Foule vue de dos / de face (silhouettes sombres, 3 rangs) : w x h, n tetes par rang ; bords eclaires par le feu (.vl-rim). Aucun texte. */
function vlCrowd(opts) {
  opts = opts || {};
  const W = opts.w || 1920, H = opts.h || 300, n = opts.n || 22, rnd = rng(opts.seed || 5), rows = [{ y: H - 190, c: '#2A1E3E', k: 0.8 }, { y: H - 110, c: '#1E1530', k: 0.95 }, { y: H - 30, c: '#140E22', k: 1.1 }];
  let s = '';
  rows.forEach((r, ri) => {
    for (let i = 0; i < n; i++) {
      const x = (W / n) * (i + 0.5) + (rnd() - 0.5) * 40 + (ri % 2) * 30, hr = (24 + rnd() * 8) * r.k, y = r.y + (rnd() - 0.5) * 16;
      s += `<g><path d="M${r1(x - hr * 1.9)} ${H}Q${r1(x - hr * 1.9)} ${r1(y + hr * 1.5)} ${r1(x)} ${r1(y + hr * 1.3)}Q${r1(x + hr * 1.9)} ${r1(y + hr * 1.5)} ${r1(x + hr * 1.9)} ${H}Z" fill="${r.c}"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(hr)}" fill="${r.c}"/><path class="vl-rim" d="M${r1(x - hr)} ${r1(y)}A${r1(hr)} ${r1(hr)} 0 0 1 ${r1(x + hr)} ${r1(y)}" stroke="#FF9F4A" stroke-width="${r1(3 * r.k)}" fill="none" opacity=".55"/></g>`;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="vl-crowd" aria-hidden="true">${s}</svg>`;
}

// ---------------------------------------------------------------- Madrid de nuit a Noel (unite 6) : panorama, Plaza Mayor + marche + grand sapin, accessoires de capsule
// Prefixe mn. Aucun texte, aucune marque : monuments publics simplifies. Les lumieres sont des groupes ANIMABLES separes (.mn-lights, .mn-treelights,
// .mn-star-lit, .mn-candle) : les compositions les allument en fondu >= 0,3 s (jamais d'eclair). Tout reste en transform / opacity.

const MN = { night: '#0F1240', night2: '#1B1F66', night3: '#2B2A7A', brick: '#B4503A', brick2: '#8E3A2B', ocre: '#E8B060', crema: '#F5E6C8', slate: '#3F3470', warm: '#FFD98A', gold: '#FFC83D', red: '#D81E3A', green: '#1F7F6A', pine: '#14503F', pine2: '#0E3A2E', wood: '#6B4A32' };
function mnSvg(vb, w, h, inner, cls) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" class="mn-prop ${cls || ''}" aria-hidden="true" style="overflow:visible">${inner}</svg>`; }
/** Guirlande de lumieres entre deux points (fil + ampoules + halos). Retourne { wire, lights } : lights est a poser dans un groupe .mn-lights. */
function mnString(x0, y0, x1, y1, sag, n, seed, cols) {
  const rnd = rng(seed || 3), colors = cols || ['#FFD98A', '#FF9F6B', '#FFF1B0', '#8FE3D6'];
  let wire = `M${r1(x0)} ${r1(y0)}`, lights = '';
  for (let i = 0; i <= 20; i++) { const u = i / 20; wire += `L${r1(x0 + (x1 - x0) * u)} ${r1(y0 + (y1 - y0) * u + sag * Math.sin(Math.PI * u))}`; }
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u + sag * Math.sin(Math.PI * u) + 8, c = colors[(i + Math.floor(rnd() * 3)) % colors.length];
    lights += `<circle cx="${r1(x)}" cy="${r1(y)}" r="15" fill="${c}" opacity=".22"/><circle cx="${r1(x)}" cy="${r1(y)}" r="5" fill="${c}"/>`;
  }
  return { wire: `<path d="${wire}" stroke="#0B0820" stroke-width="3" fill="none" opacity=".8"/>`, lights };
}
/** Fenetres : cadre sombre + volet chaud allume (le volet chaud va dans .mn-lights). */
function mnWindows(x, y, w, h, cols, rows, seed, lit) {
  const rnd = rng(seed), cw = w / cols, rh = h / rows; let dark = '', warm = '';
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const rx = r1(x + i * cw + cw * 0.24), ry = r1(y + j * rh + rh * 0.16), ww = r1(cw * 0.52), hh = r1(rh * 0.62);
    dark += `<rect x="${rx}" y="${ry}" width="${ww}" height="${hh}" rx="${r1(ww * 0.2)}" fill="#2A2358"/>`;
    if (rnd() < lit) warm += `<rect x="${rx}" y="${ry}" width="${ww}" height="${hh}" rx="${r1(ww * 0.2)}" fill="#FFD98A"/>`;
  }
  return { dark, warm };
}
function mnStar(cx, cy, R, fill) { return `<path d="${starPath(cx, cy, R, R * 0.46, 5, 0)}" fill="${fill}"/>`; }
/** Sapin (triangles etages) : pose en (cx, base), hauteur h. Retourne { shape, lights } ; l'etoile est a part (mnStar). */
function mnTree(cx, base, h, seed) {
  const rnd = rng(seed || 9), tiers = 5, w0 = h * 0.5; let shape = `<rect x="${r1(cx - h * 0.04)}" y="${r1(base - h * 0.1)}" width="${r1(h * 0.08)}" height="${r1(h * 0.12)}" fill="#3B2216"/>`, lights = '';
  for (let t = 0; t < tiers; t++) {
    const yb = base - h * 0.08 - t * h * 0.17, yt = yb - h * 0.3, w = w0 * (1 - t * 0.17);
    shape += `<path d="M${r1(cx - w / 2)} ${r1(yb)}Q${r1(cx)} ${r1(yb + h * 0.03)} ${r1(cx + w / 2)} ${r1(yb)}L${r1(cx)} ${r1(yt)}Z" fill="${t % 2 ? MN.pine : '#1B6B50'}"/><path d="M${r1(cx)} ${r1(yt)}L${r1(cx + w / 2)} ${r1(yb)}Q${r1(cx + w * 0.1)} ${r1(yb - h * 0.04)} ${r1(cx)} ${r1(yt)}Z" fill="#000" opacity=".2"/>`;
    for (let k = 0; k < 4 + (tiers - t); k++) {
      const u = (k + 0.5) / (4 + (tiers - t)), y = yb - rnd() * h * 0.2 - 6, half = (w / 2) * (1 - (yb - y) / (yb - yt)), x = cx + (u * 2 - 1) * half * 0.9;
      lights += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(h * 0.022)}" fill="${['#FFD98A', '#FF7A6B', '#8FE3D6', '#FFF1B0'][(k + t) % 4]}" opacity=".3"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(h * 0.009)}" fill="${['#FFD98A', '#FF7A6B', '#8FE3D6', '#FFF1B0'][(k + t) % 4]}"/>`;
    }
  }
  return { shape, lights };
}
/** Caseta de marche de Noel : toit a pignon, auvent rayé, comptoir, creche miniature ; bougie = .mn-candle (halo), guirlande dans lights. */
function mnGlow(gid) { return `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".8"/><stop offset=".4" stop-color="#FFC24A" stop-opacity=".32"/><stop offset="1" stop-color="#FFB84D" stop-opacity="0"/></radialGradient></defs>`; }
function mnStall(x, base, w, c1, c2, seed, gid) {
  const h = 300, n = 7, sw = w / n; let aw = '';
  for (let i = 0; i < n; i++) aw += `<path d="M${r1(x + i * sw)} ${base - h + 90}h${r1(sw)}v38q${-r1(sw / 2)} 18 ${-r1(sw)} 0Z" fill="${i % 2 ? c1 : c2}"/>`;
  const st = mnString(x - 6, base - h + 112, x + w + 6, base - h + 112, 18, 8, seed || 4);
  const shape = `<g class="mn-stall">${scRect(x + 10, base - h + 90, 12, h - 90, MN.wood)}${scRect(x + w - 22, base - h + 90, 12, h - 90, MN.wood)}${scRect(x + 6, base - 110, w - 12, 110, '#8A5A38')}${scRect(x, base - 124, w, 16, '#C98A52')}` +
    `<path d="M${x - 14} ${base - h + 96}L${x + w / 2} ${base - h - 10}L${x + w + 14} ${base - h + 96}Z" fill="${MN.brick2}"/><path d="M${x - 14} ${base - h + 96}L${x + w / 2} ${base - h - 10}L${x + w + 14} ${base - h + 96}" stroke="#F5E6C8" stroke-width="5" fill="none"/>${aw}` +
    `<g transform="translate(${x + w * 0.2} ${base - 124})"><path d="M0 0l16 -34 16 34Z" fill="#E8B060"/><circle cx="16" cy="-42" r="7" fill="#F5D0B0"/><path d="M52 0l12 -28 12 28Z" fill="#2F6FD0"/><circle cx="64" cy="-36" r="6" fill="#F5D0B0"/><path d="M96 0l12 -26 12 26Z" fill="#C9573B"/><circle cx="108" cy="-33" r="6" fill="#F5D0B0"/></g>` +
    `<g transform="translate(${x + w * 0.7} ${base - 124})"><rect x="0" y="-30" width="26" height="30" rx="4" fill="#C9573B"/><rect x="34" y="-40" width="22" height="40" rx="4" fill="#1F7F6A"/></g></g>`;
  const candle = `<g class="mn-candle"><circle cx="${r1(x + w * 0.5)}" cy="${base - 150}" r="110" fill="url(#${gid})"/></g>`;
  return { shape, lights: st.lights, wire: st.wire, candle };
}
function mnLamp(lx, fl, gid) { return { shape: `<path d="M${lx} ${fl + 40}V${fl - 330}" stroke="#0B0820" stroke-width="12"/><path d="M${lx - 30} ${fl - 330}h60l-8 -34h-44Z" fill="#0B0820"/><rect x="${lx - 20}" y="${fl - 394}" width="40" height="46" rx="8" fill="#3A3360"/>`, lights: `<circle cx="${lx}" cy="${fl - 372}" r="150" fill="url(#${gid})"/><rect x="${lx - 20}" y="${fl - 394}" width="40" height="46" rx="8" fill="#FFE9A8"/>` }; }

// ---------------------------------------------------------------- Plaza Mayor de nuit + marche de Noel + grand sapin (3200 x 1200)
const MN_PLAZA = { W: 3200, H: 1200, floor: 930, tree: { x: 1640, base: 960, h: 760 }, rosa: { x: 2330 }, star: { x: 1640, y: 214 } };
/** Retourne { back, front, light, W, H, floor, tree, rosa, star }. Dans back : calques animables .mn-lights (guirlandes, fenetres, lampadaires), .mn-treelights, .mn-star-lit (etoile doree + halo), .mn-candle (bougies des etals).
 *  Etat par defaut = LUMIERES ALLUMEES : les compositions de la nuit noire font tl.set('.mn-lights,.mn-treelights,.mn-star-lit', { opacity: 0 }, 0) puis rallument en fondu. */
function mnPlaza(opts) {
  opts = opts || {};
  const id = opts.uid || uid('mp'), g = (n) => `${id}-${n}`, W = MN_PLAZA.W, H = MN_PLAZA.H, fl = MN_PLAZA.floor, rnd = rng(opts.seed || 71);
  let stars = ''; for (let i = 0; i < 60; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(rnd() * 300)}" r="${r1(1 + rnd() * 2)}" fill="#FFF3D1" opacity="${r1(0.25 + rnd() * 0.5)}"/>`;
  const sky = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B0D3A"/><stop offset=".55" stop-color="#262A78"/><stop offset="1" stop-color="#4A3A8A"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${stars}<circle cx="2860" cy="150" r="54" fill="#F5E6C8"/><circle cx="2880" cy="138" r="54" fill="#0B0D3A" opacity=".16"/>`;
  // facades de la Plaza Mayor (fond continu) + deux tours a fleches d'ardoise
  const fb = fl - 20, top = fb - 470; let facade = scRect(-40, top, W + 80, 470, MN.brick) + scRect(-40, top, W + 80, 26, MN.brick2) + scRect(-40, fb - 62, W + 80, 62, MN.brick2) + scRect(-40, top - 18, W + 80, 18, MN.slate);
  let warm = '', arches = '';
  for (let i = 0; i < 28; i++) arches += `<path d="${archOpen(i * 118 + 18, fb, 74, 86)}" fill="#2A1A3A"/>`;
  const wins = mnWindows(30, top + 60, W - 60, 300, 36, 3, 17, 0.5);
  for (let r = 0; r < 3; r++) facade += scRect(-40, top + 60 + r * 100 + 78, W + 80, 7, MN.brick2, 'opacity=".75"');
  const tower = (tx) => scRect(tx, top - 200, 150, 200, MN.brick) + `<path d="M${tx - 12} ${top - 200}L${tx + 75} ${top - 360}L${tx + 162} ${top - 200}Z" fill="${MN.slate}"/><path d="M${tx + 75} ${top - 360}v-40" stroke="${MN.slate}" stroke-width="6"/><circle cx="${tx + 75}" cy="${top - 404}" r="9" fill="#C9C5C0"/><rect x="${tx + 50}" y="${top - 150}" width="50" height="62" rx="25" fill="#2A2358"/><path d="M${tx - 6} ${top - 24}h162" stroke="${MN.brick2}" stroke-width="10"/>`;
  facade += tower(300) + tower(2740) + `<path d="M0 ${top - 18}h${W}" stroke="#241B58" stroke-width="3" opacity=".5"/>`;
  const towerWin = `<rect x="${350}" y="${top - 150}" width="50" height="62" rx="25" fill="#FFD98A"/><rect x="${2790}" y="${top - 150}" width="50" height="62" rx="25" fill="#FFD98A"/>`;
  // sol pave sombre
  const floor = mxCobbles(W, fl, H, 33, '#3A3568', '#1F1B45') + scRect(0, fl - 8, W, 12, '#2A2558');
  // grand sapin
  const T = MN_PLAZA.tree, tr = mnTree(T.x, T.base, T.h, 5), starY = MN_PLAZA.star.y;
  const tree = `<g class="mn-tree">${tr.shape}${mnStar(T.x, starY, 56, '#8A8CB0')}</g>`;
  const treeLights = `<g class="mn-treelights">${tr.lights}</g>`;
  const starLit = `<g class="mn-star-lit"><circle cx="${T.x}" cy="${starY}" r="230" fill="url(#${g('gw')})"/>${mnStar(T.x, starY, 56, '#FFE27A')}</g>`;
  // etals
  const stalls = [mnStall(190, fl + 50, 330, MN.red, '#F5E6C8', 4, g('gw')), mnStall(880, fl + 40, 300, MN.green, '#F5E6C8', 6, g('gw')), mnStall(2210, fl + 50, 360, '#D9703A', '#F5E6C8', 8, g('gw')), mnStall(2820, fl + 44, 320, '#2F6FD0', '#F5E6C8', 10, g('gw'))];
  const lamps = [mnLamp(1180, fl, g('gw')), mnLamp(2100, fl, g('gw')), mnLamp(560, fl + 10, g('gw')), mnLamp(3080, fl + 10, g('gw'))];
  const strings = [mnString(0, top + 20, 1600, top + 20, 90, 20, 21), mnString(1600, top + 20, 3200, top + 20, 90, 20, 22), mnString(760, fl - 400, 1500, fl - 560, 40, 9, 23), mnString(1780, fl - 560, 2500, fl - 400, 40, 9, 24)];
  const back = scSvg(W, H, `${mnGlow(g('gw'))}${sky}${facade}${arches}${wins.dark}${towerWin.replace(/#FFD98A/g, '#2A2358')}${floor}${stalls.map((s) => s.shape).join('')}${lamps.map((l) => l.shape).join('')}${strings.map((s) => s.wire).join('')}${tree}<rect class="mn-dim" width="${W}" height="${H}" fill="#0B0D3A" opacity=".5"/>` +
    `<g class="mn-lights"><g>${wins.warm}${towerWin}</g>${stalls.map((s) => s.lights).join('')}${lamps.map((l) => l.lights).join('')}${strings.map((s) => s.lights).join('')}</g>${treeLights}${starLit}${stalls.map((s) => s.candle).join('')}`, 'mnp-back');
  // comptoir de Rosa (devant les personnages : cache les jambes de la churrera) : planche, churros dores en eventail, tasses de chocolat
  const rx = 2216; let churros = '';
  for (let i = 0; i < 9; i++) { const a = -34 + i * 8.5, cx = rx + 110 + i * 14; churros += `<g transform="rotate(${a} ${cx} 856)"><rect x="${cx - 9}" y="770" width="18" height="90" rx="9" fill="#E3A94E"/><path d="M${cx - 3} 778V852M${cx + 3} 778V852" stroke="#B9782A" stroke-width="3" opacity=".7"/></g>`; }
  const cups = [0, 1, 2].map((i) => `<g transform="translate(${rx + 218 + i * 52} 800)"><path d="M0 0H40L34 54Q20 60 6 54Z" fill="#FFFDF4"/><ellipse cx="20" cy="2" rx="20" ry="5" fill="#5A3020"/><path d="M40 12q16 2 12 16q-4 10 -14 8" stroke="#FFFDF4" stroke-width="5" fill="none"/></g>`).join('');
  const counter = `<g class="mn-counter">${scRect(rx, 870, 348, 112, '#8A5A38')}${scRect(rx - 6, 856, 360, 16, '#C98A52')}${scRect(rx, 870, 348, 8, '#000', 'opacity=".15"')}<path d="M${rx + 70} 856h120l-12 -20h-96Z" fill="#6B4A32"/>${churros}${cups}</g>`;
  const front = scSvg(W, H, `${counter}<defs><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B0D3A" stop-opacity="0"/><stop offset="1" stop-color="#0B0D3A" stop-opacity=".55"/></linearGradient></defs>${scRect(0, H - 220, W, 220, `url(#${g('f')})`)}`, 'mnp-front');
  return { back, front, light: '', W, H, floor: fl, tree: T, rosa: MN_PLAZA.rosa, star: MN_PLAZA.star };
}

// ---------------------------------------------------------------- panorama de Madrid de nuit en decembre (3200 x 1200, 5 calques pour la parallaxe)
/** Retourne { sky, sun (lune), far, mid, near, W, H }. Lumieres animables : .mn-lights (fenetres, guirlandes de la Gran Via, lampadaires, etals, sapin de la Puerta del Sol) dans mid et near. */
function mnSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ms'), g = (n) => `${id}-${n}`, W = 3200, H = 1200, hz = 880, rnd = rng(opts.seed || 33);
  let stars = ''; for (let i = 0; i < 90; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(rnd() * 520)}" r="${r1(1 + rnd() * 2.2)}" fill="#FFF3D1" opacity="${r1(0.3 + rnd() * 0.5)}"/>`;
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0C36"/><stop offset=".4" stop-color="#1F2270"/><stop offset=".7" stop-color="#4B3C96"/><stop offset="1" stop-color="#8A5AA8"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${stars}`, 'ms-sky');
  const mx = opts.moonX || 1500, my = opts.moonY || 300;
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#F5E6C8" stop-opacity=".55"/><stop offset="1" stop-color="#F5E6C8" stop-opacity="0"/></radialGradient></defs><circle cx="${mx}" cy="${my}" r="320" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${mx}" cy="${my}" r="70" fill="#F5E6C8"/><circle cx="${mx + 22}" cy="${my - 12}" r="66" fill="#1F2270" opacity=".12"/>`, 'ms-moon');
  let blocks = '', bx = -20; while (bx < W) { const w = 60 + rnd() * 80, h = 90 + rnd() * 230; blocks += scRect(bx, hz - h, w, h + 4, '#3A2F85') + (rnd() < 0.2 ? scRect(bx + w * 0.4, hz - h - 36, 10, 38, '#3A2F85') : ''); bx += w + 4 + rnd() * 10; }
  const far = scSvg(W, H, `<g opacity=".85">${blocks}</g>${scRect(0, hz - 2, W, H - hz + 2, '#3A2F85')}`, 'ms-far');
  // milieu : Gran Via (Metropolis + immeubles), Puerta del Sol (Real Casa de Correos + sapin) ; lumieres dans .mn-lights
  let midShape = '', midWarm = '';
  const tones = ['#7A4A6A', '#8A5470', '#6A4A7A', '#935A5A', '#7A5A86'];
  let x = -30, k = 0; const base = hz + 10;
  while (x < W) {
    if (x > 800 && x < 1900) { x = 1900; continue; }
    const w = 150 + rnd() * 110, h = 200 + rnd() * 190, wn = mnWindows(x + 12, base - h + 24, w - 24, h - 50, Math.max(2, Math.round(w / 50)), Math.max(3, Math.round(h / 60)), Math.round(x) + 3, 0.62);
    midShape += `<g><rect x="${r1(x)}" y="${r1(base - h)}" width="${r1(w)}" height="${r1(h + 2)}" fill="${tones[k++ % 5]}"/><rect x="${r1(x)}" y="${r1(base - h)}" width="${r1(w)}" height="12" fill="#2E2466"/>${wn.dark}</g>`;
    midWarm += wn.warm;
    x += w + 8;
  }
  const metro = `<g transform="translate(300 ${base - 30})">${metropolis(0, 0)}</g>`;
  // Real Casa de Correos (x 1180..1780)
  const rx = 1180, rw = 600, rh = 250, ry = base - rh;
  const rwn = mnWindows(rx + 30, ry + 30, rw - 60, rh - 70, 12, 3, 8, 0.7);
  const correos = `<g>${scRect(rx, ry, rw, rh, '#E6C9B0')}${scRect(rx, ry, rw, 18, '#B4503A')}${scRect(rx - 10, base - 20, rw + 20, 20, '#B4503A')}${rwn.dark}` +
    `${scRect(rx + 230, ry - 150, 140, 150, '#E6C9B0')}<path d="M${rx + 214} ${ry - 150}L${rx + 300} ${ry - 250}L${rx + 386} ${ry - 150}Z" fill="#4A3C70"/>${scRect(rx + 276, ry - 280, 48, 40, '#E6C9B0')}<path d="M${rx + 270} ${ry - 280}Q${rx + 300} ${ry - 330} ${rx + 330} ${ry - 280}Z" fill="#4A3C70"/><circle cx="${rx + 300}" cy="${ry - 340}" r="14" fill="#C9C5C0"/>` +
    `<circle cx="${rx + 300}" cy="${ry - 90}" r="40" fill="#F5E6C8" stroke="#4A3C70" stroke-width="6"/><path d="M${rx + 300} ${ry - 90}V${ry - 116}M${rx + 300} ${ry - 90}H${rx + 320}" stroke="#2A2358" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="${archOpen(rx + 270, base, 60, 90)}" fill="#2A1A3A"/></g>`;
  const correosWarm = `<g>${rwn.warm}<circle cx="${rx + 300}" cy="${ry - 90}" r="34" fill="#FFF1B0" opacity=".75"/></g>`;
  const T = mnTree(1000, base + 70, 520, 7), tree = `<g>${T.shape}${mnStar(1000, base + 70 - 520 - 14, 34, '#8A8CB0')}</g>`;
  const treeLit = `<g class="mn-treelights">${T.lights}</g><g class="mn-star-lit"><circle cx="1000" cy="${base + 70 - 534}" r="150" fill="url(#${g('gw')})"/>${mnStar(1000, base + 70 - 534, 34, '#FFE27A')}</g>`;
  const arcs = [mnString(0, base - 250, 1000, base - 360, 60, 14, 41), mnString(1900, base - 360, 3200, base - 250, 60, 16, 42), mnString(-20, base - 120, 3220, base - 120, 70, 40, 43)];
  const mid = scSvg(W, H, `${mnGlow(g('gw'))}${scRect(0, base - 8, W, H - base + 8, '#241B58')}${midShape}${metro}${correos}${tree}${arcs.map((s) => s.wire).join('')}<g class="mn-lights">${midWarm}${correosWarm}${arcs.map((s) => s.lights).join('')}</g>${treeLit}`, 'ms-mid');
  // premier plan : chaussee, etals de Noel a guirlandes, lampadaires, silhouettes de promeneurs en echarpe
  const st = [mnStall(120, 1100, 340, MN.red, '#F5E6C8', 4, g('gn')), mnStall(2480, 1110, 360, MN.green, '#F5E6C8', 6, g('gn')), mnStall(1340, 1120, 320, '#D9703A', '#F5E6C8', 8, g('gn'))];
  const lps = [mnLamp(680, 1030, g('gn')), mnLamp(2200, 1030, g('gn')), mnLamp(3060, 1030, g('gn'))];
  let walkers = ''; const wc = ['#C9573B', '#2F6FD0', '#1F7F6A', '#D93472', '#FFC83D'];
  [[900, 1.0], [1240, 0.9], [2040, 1.05], [2900, 0.95], [520, 0.9]].forEach((p, i) => { const wx = p[0], s = p[1]; walkers += `<g class="mn-walker" transform="translate(${wx} 1130) scale(${s})"><ellipse cx="0" cy="0" rx="46" ry="9" fill="#000" opacity=".3"/><path d="M-30 0L-24 -150Q0 -176 24 -150L30 0Z" fill="#1B1F5A"/><circle cx="0" cy="-186" r="26" fill="#C98A5E"/><path d="M-30 -196Q0 -246 30 -196Q0 -208 -30 -196Z" fill="${wc[i % 5]}"/><circle cx="0" cy="-246" r="9" fill="#F5E6C8"/><path d="M-26 -166Q0 -150 26 -166L26 -146Q0 -130 -26 -146Z" fill="${wc[(i + 2) % 5]}"/></g>`; });
  const near = scSvg(W, H, `${mnGlow(g('gn'))}${mxCobbles(W, 1040, H, 19, '#2C2762', '#171345')}${scRect(0, 1030, W, 12, '#3A3470')}${st.map((s) => s.shape).join('')}${lps.map((l) => l.shape).join('')}${walkers}<g class="mn-lights">${st.map((s) => s.lights).join('')}${lps.map((l) => l.lights).join('')}</g>${st.map((s) => s.wire).join('')}${st.map((s) => s.candle).join('')}`, 'ms-near');
  return { sky, sun, far, mid, near, W, H, moonX: mx, moonY: my };
}

// ---------------------------------------------------------------- accessoires de capsule (papier decoupe)
/** key : 'puertaSol' (900x640 : Real Casa de Correos de nuit, horloge .mn-clock, boule .mn-ball) | 'multitud' (opts n, seed ; 1000x230) | 'vaso' (gobelet 160x200) | 'uva' (60x60) |
 *  'reloj' (cadran 300x300, aiguilles .mn-hh / .mn-mh pivot 150 150 a minuit) | 'bombo' (bombo de loterie 360x420, boules dans .mn-drum pivot 180 170) | 'bolaLoteria' (80x80, opts c) | 'teatro' (700x430) |
 *  'coro' (enfant en uniforme qui chante 100x190, opts hair, mouth) | 'carroza' (char 760x430) | 'rey' (roi mage 160x300, opts v 0|1|2 : Melchor/Gaspar/Baltasar) | 'camello' (carton 360x300) | 'caramelo' (40x40) |
 *  'zapatos' (200x120) | 'carta' (220x150) | 'roscon' (entier 420x300) | 'rebanada' (part coupee 420x300 : .mn-fig figurine, .mn-haba feve) | 'taza' (chocolat 160x120). opts : width, uid. */
function mnProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('mq'), g = (n) => `${id}-${n}`, W = opts.width;
  const mk = (vw, vh, inner, cls) => mnSvg(`0 0 ${vw} ${vh}`, W || vw, Math.round((W || vw) * vh / vw), inner, 'mn-' + key + ' ' + (cls || ''));
  if (key === 'puertaSol') {
    const wn = mnWindows(110, 340, 680, 190, 12, 2, 5, 0.85);
    return mk(900, 640, `${scRect(60, 300, 780, 290, '#EBD2B4')}${scRect(60, 300, 780, 18, '#B4503A')}${scRect(40, 580, 820, 24, '#B4503A')}${wn.dark}<g fill="#FFD98A">${wn.warm.replace(/fill="#FFD98A"/g, '')}</g>` +
      `${scRect(360, 130, 180, 180, '#EBD2B4')}${scRect(360, 130, 180, 14, '#B4503A')}<path d="M344 130L450 40L556 130Z" fill="#4A3C70"/>${scRect(420, 0, 60, 40, '#EBD2B4')}<path d="M414 0Q450 -50 486 0Z" fill="#4A3C70" transform="translate(0 4)"/><g class="mn-ball"><circle cx="450" cy="-26" r="16" fill="#E8EAF2"/><circle cx="445" cy="-31" r="5" fill="#fff" opacity=".7"/></g>` +
      `<g class="mn-clock"><circle cx="450" cy="206" r="54" fill="#F5E6C8" stroke="#4A3C70" stroke-width="8"/><path d="M450 206V166" stroke="#2A2358" stroke-width="6" stroke-linecap="round" class="mn-mh"/><path d="M450 206V176" stroke="#2A2358" stroke-width="8" stroke-linecap="round" class="mn-hh"/><circle cx="450" cy="206" r="6" fill="#2A2358"/></g>` +
      `<path d="${archOpen(410, 590, 80, 120)}" fill="#2A1A3A"/>${scRect(0, 604, 900, 36, '#241B58')}`);
  }
  if (key === 'multitud') {
    const n = opts.n || 14, rnd = rng(opts.seed || 4), cols = ['#C9573B', '#2F6FD0', '#1F7F6A', '#D93472', '#FFC83D', '#8A5AC0', '#E8B060'], sk = ['#C98A5E', '#E3AE86', '#D2956B', '#B9764A'];
    let p = ''; for (let i = 0; i < n; i++) { const cx = 40 + (i + 0.5) * ((1000 - 80) / n) + (rnd() - 0.5) * 16, s = 0.85 + rnd() * 0.3, base = 230 - (i % 2) * 14, c = cols[i % 7];
      p += `<g class="mn-person" transform="translate(${r1(cx)} ${base}) scale(${r1(s)})"><path d="M-34 0L-28 -110Q0 -138 28 -110L34 0Z" fill="${cols[(i + 3) % 7]}"/><circle cx="0" cy="-138" r="26" fill="${sk[i % 4]}"/><path d="M-30 -148Q0 -192 30 -148Q0 -160 -30 -148Z" fill="${c}"/><circle cx="0" cy="-192" r="8" fill="#F5E6C8"/><path d="M-26 -120Q0 -104 26 -120L26 -102Q0 -86 -26 -102Z" fill="${cols[(i + 1) % 7]}"/></g>`; }
    return mk(1000, 230, p);
  }
  if (key === 'vaso') return mk(160, 200, `<path d="M20 20H140L124 190Q80 200 36 190Z" fill="#E8EAF2"/><path d="M20 20H140L136 56H24Z" fill="#fff" opacity=".6"/><path d="M36 190L24 56H48L56 194Z" fill="#000" opacity=".08"/>`);
  if (key === 'uva') return mk(60, 60, `<circle cx="30" cy="30" r="26" fill="#6BBF59"/><circle cx="30" cy="30" r="26" fill="none" stroke="#3E8E3A" stroke-width="3"/><ellipse cx="21" cy="21" rx="8" ry="5" fill="#fff" opacity=".5" transform="rotate(-30 21 21)"/>`);
  if (key === 'reloj') return mk(300, 300, `<circle cx="150" cy="150" r="140" fill="#4A3C70"/><circle cx="150" cy="150" r="122" fill="#F5E6C8"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = (i / 12) * 6.283; return `<path d="M${r1(150 + Math.sin(a) * 100)} ${r1(150 - Math.cos(a) * 100)}L${r1(150 + Math.sin(a) * 114)} ${r1(150 - Math.cos(a) * 114)}" stroke="#2A2358" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>`; }).join('')}<g class="mn-mh" data-px="150" data-py="150"><path d="M150 160V46" stroke="#2A2358" stroke-width="9" stroke-linecap="round"/></g><g class="mn-hh" data-px="150" data-py="150"><path d="M150 160V70" stroke="#C9573B" stroke-width="13" stroke-linecap="round"/></g><circle cx="150" cy="150" r="11" fill="#2A2358"/>`);
  if (key === 'bombo') {
    const rnd = rng(6), cs = ['#D81E3A', '#FFC83D', '#2F6FD0', '#1F7F6A', '#F5E6C8', '#D93472'];
    let balls = ''; for (let i = 0; i < 12; i++) { const a = i * 2.4, r = 20 + (i % 4) * 22; balls += `<circle cx="${r1(180 + Math.cos(a) * r)}" cy="${r1(170 + Math.sin(a) * r)}" r="24" fill="${cs[i % 6]}" stroke="#fff" stroke-width="3"/><circle cx="${r1(180 + Math.cos(a) * r - 7)}" cy="${r1(170 + Math.sin(a) * r - 8)}" r="6" fill="#fff" opacity=".5"/>`; }
    return mk(360, 420, `<path d="M90 420L120 300H240L270 420Z" fill="#6B4A32"/><rect x="100" y="296" width="160" height="20" rx="8" fill="#C98A52"/><circle cx="180" cy="170" r="150" fill="#CFE9F5" fill-opacity=".28" stroke="#E6CE9F" stroke-width="10"/><g class="mn-drum" data-px="180" data-py="170">${balls}</g><path d="M60 100Q90 52 150 40" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/><rect x="170" y="14" width="20" height="30" fill="#C98A52"/><path d="M180 170H330" stroke="#C98A52" stroke-width="10"/><circle cx="338" cy="170" r="14" fill="#D81E3A"/>`);
  }
  if (key === 'bolaLoteria') return mk(80, 80, `<circle cx="40" cy="40" r="36" fill="${opts.c || '#FFC83D'}" stroke="#fff" stroke-width="4"/><ellipse cx="28" cy="26" rx="10" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 28 26)"/>`);
  if (key === 'teatro') return mk(700, 430, `${scRect(0, 90, 700, 340, '#C98A52')}<path d="M0 90L350 0L700 90Z" fill="#8E3A2B"/>${scRect(40, 130, 620, 50, '#E8B060')}${[70, 190, 310, 430, 550].map((x) => scRect(x, 190, 70, 190, '#F5E6C8') + scRect(x - 8, 180, 86, 14, '#E8B060') + scRect(x - 8, 376, 86, 14, '#E8B060')).join('')}${scRect(0, 380, 700, 50, '#6B4A32')}<path d="${archOpen(250, 380, 200, 190)}" fill="#7A1B2E"/><path d="M262 380V210M300 380V200M340 380V196M380 380V200M420 380V210" stroke="#A82A40" stroke-width="8"/><circle cx="350" cy="40" r="16" fill="#FFD98A"/>`);
  if (key === 'coro') { const h = opts.hair || '#2A1A12'; return mk(100, 190, `<path d="M20 190L16 90Q50 70 84 90L80 190Z" fill="#1B2A6A"/><path d="M34 84L50 112L66 84Z" fill="#fff"/><path d="M30 190V150M70 190V150" stroke="#000" stroke-width="0"/><circle cx="50" cy="52" r="30" fill="${opts.skin || '#E3AE86'}"/><path d="M18 50Q20 14 50 14Q82 14 82 50Q70 30 50 32Q30 30 18 50Z" fill="${h}"/><ellipse class="mn-mouth" cx="50" cy="66" rx="9" ry="${opts.mouth || 8}" fill="#6B1E24"/><circle cx="38" cy="50" r="4" fill="#2A160E"/><circle cx="62" cy="50" r="4" fill="#2A160E"/>`, 'mn-coro'); }
  if (key === 'camello') return mk(360, 300, `<path d="M70 250V190M120 250V196M250 250V196M300 250V190" stroke="#B9824A" stroke-width="22" stroke-linecap="round"/><path d="M40 160Q50 100 110 110Q130 60 160 110Q190 60 220 110Q300 100 310 170Q300 210 250 206L110 208Q50 214 40 160Z" fill="#D9A262"/><path d="M280 120Q320 100 330 50Q350 40 352 70Q346 100 324 140Z" fill="#D9A262"/><path d="M326 50Q352 30 358 62L336 66Z" fill="#B9824A"/><circle cx="342" cy="58" r="4" fill="#2A160E"/><rect x="130" y="130" width="120" height="70" rx="10" fill="#D81E3A"/><path d="M130 160H250" stroke="#FFC83D" stroke-width="8"/><path d="M60 140Q100 150 120 200" stroke="#fff" stroke-width="4" fill="none" opacity=".3"/>`);
  if (key === 'rey') {
    const V = [{ r: '#7A2E9A', g: '#FFC83D', sk: '#E3AE86', b: '#E8E4DE' }, { r: '#C9573B', g: '#F5E6C8', sk: '#D9A47C', b: '#6B4A32' }, { r: '#1F7F6A', g: '#FFC83D', sk: '#7A4A32', b: '#1E120C' }][opts.v || 0];
    return mk(160, 300, `<path d="M30 300L44 120Q80 90 116 120L130 300Z" fill="${V.r}"/><path d="M80 110V300" stroke="${V.g}" stroke-width="10"/><path d="M44 150Q80 170 116 150" stroke="${V.g}" stroke-width="8" fill="none"/><circle cx="80" cy="76" r="34" fill="${V.sk}"/><path d="M46 84Q80 156 114 84Q96 112 80 112Q64 112 46 84Z" fill="${V.b}"/><path d="M50 52L56 18L68 38L80 10L92 38L104 18L110 52Z" fill="${V.g}"/><rect x="50" y="48" width="60" height="12" fill="${V.g}"/><circle cx="68" cy="74" r="4" fill="#2A160E"/><circle cx="92" cy="74" r="4" fill="#2A160E"/><path d="M70 92Q80 98 90 92" stroke="#8F1D4E" stroke-width="3" fill="none"/><g transform="translate(116 150)"><rect x="0" y="0" width="44" height="40" rx="4" fill="${V.g}"/><path d="M22 0V40M0 20H44" stroke="${V.r}" stroke-width="6"/><path d="M22 0q-14 -14 -4 -20q10 -2 4 20q6 -22 18 -18q8 8 -18 18" fill="${V.r}"/></g>`);
  }
  if (key === 'carroza') return mk(760, 430, `${scRect(20, 280, 720, 70, '#B4503A')}${scRect(20, 270, 720, 16, '#FFC83D')}${[60, 130, 200, 270, 340, 410, 480, 550, 620, 690].map((x, i) => `<circle cx="${x}" cy="318" r="12" fill="${['#FFC83D', '#F5E6C8'][i % 2]}"/>`).join('')}<path d="M300 270L320 130H440L460 270Z" fill="#7A2E9A"/><path d="M290 130H470L450 100H310Z" fill="#FFC83D"/><circle cx="380" cy="60" r="26" fill="#FFC83D"/><path d="M380 28l8 20 22 2 -16 14 5 22 -19 -12 -19 12 5 -22 -16 -14 22 -2Z" fill="#fff" opacity=".7"/><circle cx="140" cy="390" r="34" fill="#2A2358"/><circle cx="140" cy="390" r="14" fill="#C9C5C0"/><circle cx="620" cy="390" r="34" fill="#2A2358"/><circle cx="620" cy="390" r="14" fill="#C9C5C0"/><rect x="40" y="350" width="680" height="20" fill="#2A2358"/><path d="M40 240h60M660 240h60" stroke="#FFC83D" stroke-width="8"/>`);
  if (key === 'caramelo') return mk(40, 40, `<circle cx="20" cy="20" r="11" fill="${opts.c || '#D93472'}"/><path d="M9 20L0 12V28ZM31 20L40 12V28Z" fill="${opts.c || '#D93472'}"/><circle cx="16" cy="16" r="3" fill="#fff" opacity=".6"/>`);
  if (key === 'zapatos') return mk(200, 120, `<path d="M10 100Q8 50 50 46L64 70Q96 74 100 100Z" fill="#6B3E26"/><path d="M10 100H100V112H12Z" fill="#2A160E"/><path d="M104 100Q102 50 144 46L158 70Q190 74 194 100Z" fill="#C9573B"/><path d="M104 100H194V112H106Z" fill="#2A160E"/><path d="M46 46V30M140 46V30" stroke="#fff" stroke-width="4"/>`);
  if (key === 'carta') return mk(220, 150, `<rect x="10" y="10" width="200" height="130" rx="8" fill="#F5E6C8" stroke="#C9B58A" stroke-width="4"/><path d="M10 14L110 84L210 14" stroke="#C9B58A" stroke-width="5" fill="none"/><circle cx="110" cy="84" r="20" fill="#D81E3A"/><path d="${starPath(110, 84, 12, 5, 5, 0)}" fill="#FFC83D"/>`);
  if (key === 'roscon' || key === 'rebanada') {
    const fruits = [[210, 40, '#D81E3A'], [330, 80, '#1F7F6A'], [356, 170, '#FFC83D'], [300, 250, '#D93472'], [160, 252, '#1F7F6A'], [60, 190, '#D81E3A'], [80, 90, '#FFC83D'], [116, 50, '#D93472']];
    if (key === 'roscon') return mk(420, 300, `<ellipse cx="210" cy="160" rx="200" ry="130" fill="#C98A3C"/><ellipse cx="210" cy="150" rx="196" ry="124" fill="#E3A94E"/><ellipse cx="210" cy="152" rx="96" ry="58" fill="#0D1038"/><ellipse cx="210" cy="140" rx="96" ry="54" fill="#1B1F66"/>${fruits.map((f) => `<ellipse cx="${f[0]}" cy="${f[1] + 10}" rx="22" ry="14" fill="${f[2]}"/><ellipse cx="${f[0] - 4}" cy="${f[1] + 6}" rx="7" ry="4" fill="#fff" opacity=".5"/>`).join('')}${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<circle cx="${r1(210 + Math.cos(i * 0.52 + 0.2) * 150)}" cy="${r1(150 + Math.sin(i * 0.52 + 0.2) * 92)}" r="5" fill="#fff" opacity=".85"/>`).join('')}`);
    return mk(420, 300, `<path d="M40 260L90 100Q210 40 330 100L380 260Z" fill="#C98A3C"/><path d="M60 250L100 110Q210 60 320 110L360 250Z" fill="#F5E0A8"/><path d="M90 100Q210 40 330 100" stroke="#E3A94E" stroke-width="22" fill="none"/>${[[130, 76, '#D81E3A'], [210, 56, '#1F7F6A'], [290, 76, '#FFC83D']].map((f) => `<ellipse cx="${f[0]}" cy="${f[1]}" rx="22" ry="12" fill="${f[2]}"/>`).join('')}<path d="M60 250H360V268H60Z" fill="#C98A3C"/><g class="mn-fig"><circle cx="150" cy="190" r="22" fill="#F5E6C8" stroke="#C98A3C" stroke-width="3"/><path d="M140 176l5 -14 5 8 5 -8 5 14Z" fill="#FFC83D"/><circle cx="146" cy="190" r="3" fill="#2A160E"/><circle cx="156" cy="190" r="3" fill="#2A160E"/><rect x="136" y="204" width="28" height="22" rx="6" fill="#7A2E9A"/></g><g class="mn-haba"><ellipse cx="270" cy="200" rx="22" ry="14" fill="#F4EBD0" stroke="#B9A878" stroke-width="3" transform="rotate(-20 270 200)"/><path d="M262 196Q270 190 280 196" stroke="#B9A878" stroke-width="3" fill="none"/></g>`);
  }
  if (key === 'taza') return mk(160, 120, `<ellipse cx="80" cy="104" rx="70" ry="10" fill="#000" opacity=".25"/><path d="M20 30H120L112 90Q80 108 48 90Z" fill="#F5E6C8"/><ellipse cx="70" cy="30" rx="50" ry="10" fill="#5A3020"/><path d="M118 42Q150 44 146 66Q142 84 112 80" stroke="#F5E6C8" stroke-width="9" fill="none"/>`);
  return '';
}

// ---------------------------------------------------------------- decors du Yucatan (unite 9) : survol de la selva (panorama), sentier de selva, El Castillo (pyramide) et ses glyphes,
// temple du sommet, cenote sacre, accessoires de capsule en papier decoupe (pyramide en plan / en facade avec l'ombre de Kukulcan, Tenochtitlan, Mexico, mais / cacao / chocolat), flamant.
// Memes conventions que 12-mexico.js : calques separes, aucun texte ; glyphes mayas GENERIQUES (aucun codex ni inscription reelle) ; monuments simplifies.
// Prefixe `yu` pour les helpers internes ; exports : yucatanSkyline, selvaSentier, elCastillo, templeCima, cenote, yuGlyph, yuPyramidPlan, yuPyramidSide, yuTenochtitlan, yuCiudad, yuFood, yuFlamingo.

const YU = {
  sel1: '#1B5E34', sel2: '#2A7F45', sel3: '#43A55A', sel4: '#0F4126', sel5: '#86CF86', sel6: '#B6E08A',
  stone: '#DCCDA8', stone2: '#C4B38A', stone3: '#9C8C6B', stoneD: '#6F634B',
  ink: '#A8481F', cen: '#19B7AA', cen2: '#0E7F82', deep: '#0A4A5E', pink: '#FF8FB0', sun: '#FFE9A8', trunk: '#5A4030', trunk2: '#3E2B20',
};

/** Arbre tropical : tronc a racines, houppier de boules vertes, lianes. */
function yuTree(x, base, k, seed, tones) {
  tones = tones || [YU.sel2, YU.sel3, YU.sel1];
  const rnd = rng(seed), th = (270 + rnd() * 120) * k, ct = base - th;
  let s = `<g class="yu-tree"><path d="M${r1(x - 16 * k)} ${base}Q${r1(x - 10 * k)} ${r1(base - th * 0.5)} ${r1(x - 8 * k)} ${r1(ct)}L${r1(x + 8 * k)} ${r1(ct)}Q${r1(x + 14 * k)} ${r1(base - th * 0.5)} ${r1(x + 20 * k)} ${base}Z" fill="${YU.trunk}"/>`;
  s += `<path d="M${r1(x + 4 * k)} ${base}Q${r1(x + 6 * k)} ${r1(base - th * 0.5)} ${r1(x + 2 * k)} ${r1(ct)}L${r1(x + 8 * k)} ${r1(ct)}Q${r1(x + 14 * k)} ${r1(base - th * 0.5)} ${r1(x + 20 * k)} ${base}Z" fill="${YU.trunk2}" opacity=".5"/>`;
  s += `<path d="M${r1(x - 16 * k)} ${base}Q${r1(x - 44 * k)} ${r1(base + 2 * k)} ${r1(x - 64 * k)} ${r1(base + 10 * k)}L${r1(x - 12 * k)} ${r1(base - 36 * k)}Z M${r1(x + 20 * k)} ${base}Q${r1(x + 48 * k)} ${r1(base + 2 * k)} ${r1(x + 70 * k)} ${r1(base + 10 * k)}L${r1(x + 16 * k)} ${r1(base - 36 * k)}Z" fill="${YU.trunk}"/>`;
  for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 112 * k; s += `<circle cx="${r1(x + Math.cos(a) * d * 1.35)}" cy="${r1(ct + Math.sin(a) * d * 0.55)}" r="${r1((58 + rnd() * 52) * k)}" fill="${tones[i % tones.length]}"/>`; }
  for (let i = 0; i < 5; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 90 * k; s += `<ellipse cx="${r1(x + Math.cos(a) * d * 1.3 - 20 * k)}" cy="${r1(ct + Math.sin(a) * d * 0.5 - 30 * k)}" rx="${r1(30 * k)}" ry="${r1(14 * k)}" fill="${YU.sel6}" opacity=".35"/>`; }
  for (let i = 0; i < 3; i++) { const vx = x + (rnd() - 0.5) * 170 * k; s += `<path d="M${r1(vx)} ${r1(ct + 36 * k)}Q${r1(vx + 12 * k)} ${r1(ct + 110 * k)} ${r1(vx - 6 * k)} ${r1(ct + (190 + rnd() * 90) * k)}" stroke="${YU.sel1}" stroke-width="${r1(3 * k + 1)}" fill="none" opacity=".85" stroke-linecap="round"/>`; }
  return s + '</g>';
}
/** Palmier : tronc courbe + 7 palmes. */
function yuPalm(x, base, k, lean) {
  lean = lean || 0;
  const topx = x + lean * k, topy = base - 330 * k;
  let s = `<g class="yu-palm"><path d="M${r1(x - 9 * k)} ${base}Q${r1(x + lean * 0.2 * k)} ${r1(base - 170 * k)} ${r1(topx - 5 * k)} ${r1(topy)}L${r1(topx + 7 * k)} ${r1(topy)}Q${r1(x + lean * 0.3 * k + 10 * k)} ${r1(base - 170 * k)} ${r1(x + 11 * k)} ${base}Z" fill="#7A5A3E"/>`;
  [-78, -48, -20, 10, 40, 70, 98].forEach((a, i) => {
    const L = (150 + (i % 2) * 24) * k, ex = topx + Math.sin((a * Math.PI) / 180) * L, ey = topy + 30 * k + Math.abs(Math.cos((a * Math.PI) / 180)) * -L * 0.35 + Math.abs(a) * 0.5 * k;
    s += `<path d="M${r1(topx)} ${r1(topy)}Q${r1(topx + (ex - topx) * 0.5)} ${r1(topy - 70 * k)} ${r1(ex)} ${r1(ey + 40 * k)}Q${r1(topx + (ex - topx) * 0.5)} ${r1(topy - 30 * k)} ${r1(topx)} ${r1(topy + 6 * k)}Z" fill="${i % 2 ? YU.sel3 : YU.sel2}"/>`;
  });
  return s + '</g>';
}
/** Fougere au sol : 7 frondes. */
function yuFern(x, base, k, c) {
  let s = `<g class="yu-fern">`;
  [-64, -42, -22, 0, 22, 42, 64].forEach((a, i) => { s += `<path d="M${x} ${base}Q${r1(x + a * 1.2 * k)} ${r1(base - 70 * k)} ${r1(x + a * 2.1 * k)} ${r1(base - (110 - Math.abs(a) * 0.6) * k)}Q${r1(x + a * 0.8 * k)} ${r1(base - 60 * k)} ${x} ${base}Z" fill="${c || [YU.sel2, YU.sel3, YU.sel1][i % 3]}"/>`; });
  return s + '</g>';
}

// ---------------------------------------------------------------- panorama : survol de la selva du Yucatan (3200 x 1200), 5 calques de parallaxe
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY, pyr:{x,y,w}, cenote:{x,y}, lagoon:{x,y} }. */
function yucatanSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('yk'), g = (n) => `${id}-${n}`, W = 3200, H = 1200, rnd = rng(opts.seed || 91), hz = 560;
  let clouds = ''; [[420, 190, 560, 76], [1250, 120, 640, 84], [2050, 240, 520, 70], [2800, 150, 600, 80]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 31 + i * 5, 'front'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB2E6"/><stop offset=".3" stop-color="#8ED4EE"/><stop offset=".45" stop-color="#E9F1CF"/><stop offset=".5" stop-color="#FFE9A8"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'yk-sky');
  const sx = opts.sunX || 760, sy = opts.sunY || 300;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 40; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF8D0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE48A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE48A" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFF3B0" opacity=".1" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="380" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="64" fill="#FFF8D8"/>`, 'yk-sun');
  // lointain : collines de selva dans la brume
  let hills = `M0 ${hz + 30}`; for (let x = 0; x <= W; x += 70) hills += `L${x} ${r1(hz - 36 - 26 * Math.sin(x / 300) - 14 * Math.sin(x / 110 + 1))}`; hills += `L${W} ${hz + 40}Z`;
  let farB = ''; for (let i = 0; i < 46; i++) farB += `<circle cx="${r1(i * 72 + rnd() * 30)}" cy="${r1(hz - 14 + rnd() * 22)}" r="${r1(34 + rnd() * 24)}" fill="${shade('#5BA37A', 0.18 + rnd() * 0.1)}"/>`;
  const far = scSvg(W, H, `<path d="${hills}" fill="#8FC6A4" opacity=".7"/>${farB}${scRect(0, hz + 10, W, 40, '#7DBB92', 'opacity=".7"')}`, 'yk-far');
  // milieu : canopee en rangees (perspective), pyramide qui sort des arbres, cenote turquoise, lagune au loin
  const PY = { x: 2140, y: 720, w: 380 }, CE = { x: 1150, y: 930 }, LA = { x: 2900, y: 640 };
  let rows = '';
  for (let r = 0; r < 9; r++) {
    const y = hz + 10 + r * 78, rad = 30 + r * 10, step = rad * 1.35;
    for (let x = -rad + (r % 2) * step * 0.5; x < W + rad; x += step) {
      const jx = (rnd() - 0.5) * rad * 0.6, jy = (rnd() - 0.5) * rad * 0.4, tone = [YU.sel2, YU.sel3, YU.sel1, YU.sel4][Math.floor(rnd() * 4)];
      rows += `<circle cx="${r1(x + jx)}" cy="${r1(y + jy)}" r="${r1(rad * (0.9 + rnd() * 0.3))}" fill="${shade(tone, 0.22 - r * 0.045)}"/>`;
    }
    if (r === 1) rows += yuSkyPyramid(PY.x, PY.y - 12, PY.w) + yuLagoon(LA.x, LA.y);
  }
  // quelques arbres plus hauts qui depassent
  let emerg = ''; for (let i = 0; i < 9; i++) { const ex = 120 + i * 350 + rnd() * 120, ey = 720 + rnd() * 100; if (Math.abs(ex - PY.x) < 300 || Math.abs(ex - CE.x) < 260) continue; emerg += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(60 + rnd() * 24)}" fill="${YU.sel3}"/><circle cx="${r1(ex - 20)}" cy="${r1(ey - 16)}" r="${r1(34 + rnd() * 12)}" fill="${YU.sel5}" opacity=".55"/>`; }
  const mid = scSvg(W, H, `${rows}${emerg}${yuCenoteHole(CE.x, CE.y, 1.15)}`, 'yk-mid');
  // premier plan : cimes et palmes qui passent devant la camera
  let nearP = '';
  for (let i = 0; i < 16; i++) { const nx = i * 220 + rnd() * 80, ny = 1110 + rnd() * 90, rr = 80 + rnd() * 70; nearP += `<circle cx="${r1(nx)}" cy="${r1(ny)}" r="${r1(rr)}" fill="${shade([YU.sel1, YU.sel4, YU.sel2][i % 3], -0.1)}"/>`; }
  const frond = (fx, fy, a, k) => `<g transform="translate(${fx} ${fy}) rotate(${a}) scale(${k})">${[-50, -30, -12, 8, 28, 48].map((q, j) => `<path d="M0 0Q${q * 2} -70 ${q * 4.2} ${-150 + Math.abs(q) * 1.6}Q${q * 1.4} -60 0 0Z" fill="${[YU.sel2, YU.sel3, YU.sel1][j % 3]}"/>`).join('')}</g>`;
  const near = scSvg(W, H, `${nearP}${frond(60, 1210, -6, 1.5)}${frond(900, 1220, 8, 1.3)}${frond(1700, 1216, -4, 1.6)}${frond(2500, 1220, 6, 1.4)}${frond(3150, 1210, -10, 1.5)}${frond(-20, -10, 160, 1.4)}${frond(3200, -20, 200, 1.5)}`, 'yk-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy, pyr: PY, cenote: CE, lagoon: LA };
}
/** Pyramide lointaine (silhouette claire a 9 gradins + temple), centre cx, base y. */
function yuSkyPyramid(cx, base, w) {
  let s = '';
  for (let i = 0; i < 9; i++) { const wi = w * (1 - i * 0.092), h = w * 0.085; s += `<rect x="${r1(cx - wi / 2)}" y="${r1(base - (i + 1) * h)}" width="${r1(wi)}" height="${r1(h)}" fill="${i % 2 ? YU.stone : YU.stone2}"/><rect x="${r1(cx - wi / 2)}" y="${r1(base - (i + 1) * h)}" width="${r1(wi)}" height="5" fill="#fff" opacity=".35"/>`; }
  const top = base - 9 * w * 0.085;
  s += `<rect x="${r1(cx - 22 - w * 0.1)}" y="${r1(top - w * 0.12)}" width="${r1(44 + w * 0.2)}" height="${r1(w * 0.12)}" fill="${YU.stone}"/><rect x="${r1(cx - 10)}" y="${r1(top - w * 0.1)}" width="20" height="${r1(w * 0.1)}" fill="${YU.stoneD}"/><rect x="${r1(cx - 30 - w * 0.1)}" y="${r1(top - w * 0.135)}" width="${r1(60 + w * 0.2)}" height="8" fill="${YU.stone2}"/>`;
  s += `<path d="M${r1(cx - w * 0.07)} ${base}L${r1(cx - w * 0.04)} ${r1(top)}H${r1(cx + w * 0.04)}L${r1(cx + w * 0.07)} ${base}Z" fill="${YU.stone3}" opacity=".7"/>`;
  return `<g class="yk-pyr">${s}</g>`;
}
function yuLagoon(x, y) {
  return `<g class="yk-lagoon"><ellipse cx="${x}" cy="${y}" rx="330" ry="46" fill="#9ED7E8"/><ellipse cx="${x}" cy="${y - 4}" rx="300" ry="36" fill="#C6ECF0"/><ellipse cx="${x - 60}" cy="${y - 8}" rx="120" ry="12" fill="#fff" opacity=".4"/><ellipse cx="${x + 80}" cy="${y + 6}" rx="150" ry="10" fill="#FFB7CE" opacity=".35"/></g>`;
}
function yuCenoteHole(x, y, k) {
  return `<g class="yk-cenote"><ellipse cx="${x}" cy="${y + 8 * k}" rx="${210 * k}" ry="${62 * k}" fill="#6F634B"/><ellipse cx="${x}" cy="${y}" rx="${196 * k}" ry="${54 * k}" fill="${YU.cen2}"/><ellipse cx="${x}" cy="${y + 4 * k}" rx="${170 * k}" ry="${42 * k}" fill="${YU.cen}"/><ellipse cx="${x - 40 * k}" cy="${y - 6 * k}" rx="${90 * k}" ry="${16 * k}" fill="#BFF3EC" opacity=".6"/></g>`;
}

// ---------------------------------------------------------------- sentier de selva (3200 x 1200) : arbres a lianes, fougeres, sentier de terre, ruine lointaine
const SELVA = { W: 3200, H: 1200, floor: 930 };
/** Retourne { back, front, light, W, H, floor }. */
function selvaSentier(opts) {
  opts = opts || {};
  const id = opts.uid || uid('sv'), g = (n) => `${id}-${n}`, W = SELVA.W, H = SELVA.H, fl = SELVA.floor, rnd = rng(opts.seed || 73);
  let far = '', mid = '';
  for (let i = 0; i < 20; i++) far += yuTree(40 + i * 170 + rnd() * 60, fl - 70, 0.55 + rnd() * 0.2, 200 + i, [shade('#3E8A55', 0.25), shade('#4FA466', 0.25), shade('#2E7547', 0.25)]);
  for (let i = 0; i < 11; i++) mid += yuTree(100 + i * 300 + rnd() * 90, fl - 20, 0.95 + rnd() * 0.3, 300 + i);
  // ruine lointaine entre les arbres (petite pyramide dans la brume)
  const ruin = `<g opacity=".55">${yuSkyPyramid(2280, fl - 60, 330)}</g>`;
  let ferns = ''; for (let i = 0; i < 18; i++) ferns += yuFern(rnd() * W, fl + 8 + rnd() * 30, 0.8 + rnd() * 0.5);
  const palms = yuPalm(520, fl + 20, 1.1, -40) + yuPalm(1560, fl + 10, 0.9, 50) + yuPalm(2700, fl + 20, 1.2, -30);
  const ground = `<path d="M0 ${fl - 30}Q800 ${fl - 56} 1600 ${fl - 30}T3200 ${fl - 26}V${H}H0Z" fill="#3E7A3F"/><path d="M0 ${fl - 10}Q800 ${fl - 34} 1600 ${fl - 8}T3200 ${fl - 4}V${H}H0Z" fill="#4C8F47"/>`
    + `<path d="M-100 ${H}L420 ${fl}Q1000 ${fl - 30} 1700 ${fl + 6}Q2400 ${fl + 24} 3300 ${H}Z" fill="#9A7249"/><path d="M200 ${H}L700 ${fl + 14}Q1300 ${fl - 8} 1900 ${fl + 22}Q2500 ${fl + 40} 3000 ${H}Z" fill="#B58A58"/><path d="M500 ${H}L950 ${fl + 26}Q1500 ${fl + 12} 2000 ${fl + 40}Q2400 ${fl + 60} 2700 ${H}Z" fill="#C9A06A" opacity=".7"/>`
    + (() => { let p = ''; for (let i = 0; i < 40; i++) p += `<ellipse cx="${r1(300 + rnd() * 2600)}" cy="${r1(fl + 50 + rnd() * 240)}" rx="${r1(10 + rnd() * 18)}" ry="${r1(4 + rnd() * 7)}" fill="${i % 2 ? '#8A6A44' : '#D9B986'}" opacity=".6"/>`; return p; })();
  const back = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD8A8"/><stop offset=".5" stop-color="#5DB07A"/><stop offset="1" stop-color="#2E7547"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}<g opacity=".8">${far}</g>${ruin}${mid}${palms}${ground}${ferns}`, 'sv-back');
  let fr = ''; for (let i = 0; i < 9; i++) fr += yuFern(60 + i * 400 + rnd() * 140, H + 6, 1.7 + rnd() * 0.9, [shade(YU.sel1, -0.1), shade(YU.sel4, 0.05), YU.sel2][i % 3]);
  const hang = (hx, len) => `<path d="M${hx} -10Q${hx + 24} ${len * 0.5} ${hx - 6} ${len}" stroke="${YU.sel1}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="${hx - 6}" cy="${len + 8}" rx="16" ry="22" fill="${YU.sel3}"/>`;
  const front = scSvg(W, H, `${fr}${hang(180, 360)}${hang(250, 240)}${hang(1900, 300)}${hang(3010, 380)}${hang(3080, 260)}`, 'sv-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".02"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M700 0L980 0L1180 ${H}L520 ${H}Z" opacity=".5"/><path d="M1500 0L1700 0L2000 ${H}L1450 ${H}Z" opacity=".4"/><path d="M2300 0L2560 0L2800 ${H}L2200 ${H}Z" opacity=".45"/></g>`, 'sv-light');
  return { back, front, light, W, H, floor: fl };
}

// ---------------------------------------------------------------- glyphe maya GENERIQUE (motifs inventes : visage rond, spirale, barres-points, serpent, meandre, soleil)
/** SVG 120 x 120 (trait d'encre). opts : v (0..5), width, ink, uid. Classe .yu-gl-ink pour l'animer. */
function yuGlyph(opts) {
  opts = opts || {};
  const v = (opts.v || 0) % 6, c = opts.ink || YU.ink, W = opts.width || 120;
  const st = `stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const parts = [
    `<circle cx="60" cy="62" r="38" ${st}/><circle cx="46" cy="54" r="6" fill="${c}"/><circle cx="74" cy="54" r="6" fill="${c}"/><path d="M42 80Q60 92 78 80" ${st}/><path d="M22 36Q10 30 14 44M98 36Q110 30 106 44" ${st}/>`,
    `<path d="M60 60m0 0a6 6 0 1 1 12 0a14 14 0 1 1 -28 0a22 22 0 1 1 44 0a30 30 0 1 1 -60 0" ${st}/><circle cx="20" cy="104" r="5" fill="${c}"/><circle cx="40" cy="104" r="5" fill="${c}"/><circle cx="60" cy="104" r="5" fill="${c}"/>`,
    `<path d="M24 28H96M24 52H96" ${st}/><circle cx="36" cy="82" r="6" fill="${c}"/><circle cx="60" cy="82" r="6" fill="${c}"/><circle cx="84" cy="82" r="6" fill="${c}"/><path d="M24 104H96" ${st}/><circle cx="60" cy="14" r="5" fill="${c}"/>`,
    `<path d="M16 86Q30 20 52 70T92 40" ${st}/><path d="M92 40l12 -14l6 18Z" fill="${c}"/><circle cx="100" cy="38" r="3" fill="#fff"/><path d="M20 100H100" ${st}/>`,
    `<path d="M20 100V20H100V80H44V48H76V68" ${st}/><circle cx="60" cy="60" r="5" fill="${c}"/>`,
    `<circle cx="60" cy="60" r="22" ${st}/><circle cx="60" cy="60" r="7" fill="${c}"/><path d="M60 12V26M60 94V108M12 60H26M94 60H108M26 26L36 36M94 26L84 36M26 94L36 84M94 94L84 84" ${st}/>`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${W}" height="${W}" class="yu-gl" style="overflow:visible" aria-hidden="true"><g class="yu-gl-ink">${parts[v]}</g></svg>`;
}

// ---------------------------------------------------------------- El Castillo (pyramide de Kukulcan) vue de face, simplifiee (3200 x 1200)
/** Pyramide : 9 gradins, escalier central, temple. Retourne { svg, slots:[{x,y,w,h}], topY, stair:{x0,x1,y0,y1}, door }. Les glyphes sont des elements DOM (yuGlyph) poses sur les `slots`. */
function yuPyramid(cx, base, w, th) {
  const n = 9, ws = w * 0.15, slots = [];
  let s = '';
  for (let i = 0; i < n; i++) {
    const wi = w * (1 - i * 0.092), y = base - (i + 1) * th, tone = i % 2 ? YU.stone : YU.stone2;
    s += `<rect x="${r1(cx - wi / 2)}" y="${r1(y)}" width="${r1(wi)}" height="${th}" fill="${tone}"/><rect x="${r1(cx - wi / 2)}" y="${r1(y)}" width="${r1(wi)}" height="7" fill="#fff" opacity=".4"/><rect x="${r1(cx - wi / 2)}" y="${r1(y + th - 8)}" width="${r1(wi)}" height="8" fill="#000" opacity=".16"/><rect x="${r1(cx + wi / 2 - 34)}" y="${r1(y)}" width="34" height="${th}" fill="#000" opacity=".07"/>`;
    // emplacements de glyphes : de chaque cote de l'escalier, tiers 0..5
    if (i < 6) {
      const avail = (wi - ws) / 2 - 70, ph = th - 18;
      if (avail > 70) {
        const nSlot = avail > 300 ? 2 : 1, sw = Math.min(110, avail / nSlot - 16);
        for (const side of [-1, 1]) for (let q = 0; q < nSlot; q++) {
          const px = side < 0 ? cx - wi / 2 + 40 + q * (sw + 36) : cx + wi / 2 - 40 - sw - q * (sw + 36);
          s += `<rect x="${r1(px - 6)}" y="${r1(y + 6)}" width="${r1(sw + 12)}" height="${ph + 6}" rx="8" fill="#000" opacity=".1"/><rect x="${r1(px - 4)}" y="${r1(y + 8)}" width="${r1(sw + 8)}" height="${ph + 2}" rx="6" fill="${YU.stone3}" opacity=".42"/>`;
          slots.push({ x: r1(px), y: r1(y + 9 + (ph - Math.min(sw, ph)) / 2), w: r1(Math.min(sw, ph)), h: r1(Math.min(sw, ph)) });
        }
      }
    }
  }
  const top = base - n * th, topW = w * (1 - 8 * 0.092);
  // escalier central (leger retrecissement) + alfardas
  const sx0b = cx - ws / 2, sx1b = cx + ws / 2, sx0t = cx - ws * 0.38, sx1t = cx + ws * 0.38;
  s += `<path d="M${r1(sx0b - 16)} ${base}L${r1(sx0t - 14)} ${top}H${r1(sx1t + 14)}L${r1(sx1b + 16)} ${base}Z" fill="${YU.stone3}"/><path d="M${r1(sx0b)} ${base}L${r1(sx0t)} ${top}H${r1(sx1t)}L${r1(sx1b)} ${base}Z" fill="${YU.stone}"/>`;
  for (let i = 1; i < 36; i++) { const y = base - ((base - top) * i) / 36, k = i / 36, xa = sx0b + (sx0t - sx0b) * k, xb = sx1b + (sx1t - sx1b) * k; s += `<path d="M${r1(xa)} ${r1(y)}H${r1(xb)}" stroke="${YU.stoneD}" stroke-width="3" opacity=".5"/><path d="M${r1(xa)} ${r1(y + 5)}H${r1(xb)}" stroke="#fff" stroke-width="2" opacity=".35"/>`; }
  // temple du sommet
  const tw = topW * 0.78, thh = th * 2.6, tx = cx - tw / 2, ty = top - thh;
  s += `<rect x="${r1(tx)}" y="${r1(ty)}" width="${r1(tw)}" height="${r1(thh)}" fill="${YU.stone}"/><rect x="${r1(tx - 10)}" y="${r1(ty - 16)}" width="${r1(tw + 20)}" height="22" fill="${YU.stone2}"/><rect x="${r1(tx + tw * 0.14)}" y="${r1(ty - 52)}" width="${r1(tw * 0.72)}" height="40" fill="${YU.stone2}"/><rect x="${r1(tx - 10)}" y="${r1(ty - 16)}" width="${r1(tw + 20)}" height="6" fill="#fff" opacity=".4"/>`;
  const dw = tw * 0.36, dx = cx - dw / 2;
  s += `<rect x="${r1(dx)}" y="${r1(ty + thh * 0.26)}" width="${r1(dw)}" height="${r1(thh * 0.74)}" fill="#2A2018"/><rect x="${r1(dx - 12)}" y="${r1(ty + thh * 0.26)}" width="12" height="${r1(thh * 0.74)}" fill="${YU.stone3}"/><rect x="${r1(dx + dw)}" y="${r1(ty + thh * 0.26)}" width="12" height="${r1(thh * 0.74)}" fill="${YU.stone3}"/>`;
  [[tx + 16, 0.62], [tx + tw - 40, 0.62]].forEach((p) => { s += `<rect x="${r1(p[0])}" y="${r1(ty + thh * 0.28)}" width="24" height="${r1(thh * 0.5)}" rx="6" fill="${YU.stone3}" opacity=".5"/>`; });
  return { svg: s, slots, topY: ty - 52, stair: { x0: sx0b, x1: sx1b, y0: top, y1: base }, door: { x: dx, y: ty + thh * 0.26, w: dw, h: thh * 0.74 }, templeY: ty, top };
}
const CASTILLO = { W: 3200, H: 1500, floor: 1300, cx: 1600 };
/** Retourne { back, front, light, W, H, floor, slots, stair, door, topY }. Pierres LISSES (cadres vides) : poser des yuGlyph sur `slots` pour les montrer. */
function elCastillo(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ec'), g = (n) => `${id}-${n}`, W = CASTILLO.W, H = CASTILLO.H, fl = CASTILLO.floor, cx = CASTILLO.cx, rnd = rng(opts.seed || 83);
  const P = yuPyramid(cx, fl - 20, 1760, 100);
  let trees = ''; for (let i = 0; i < 16; i++) { const tx = i * 230 + rnd() * 80; if (tx > 560 && tx < 2640) continue; trees += yuTree(tx, fl - 40, 0.9 + rnd() * 0.5, 400 + i); }
  let behind = ''; for (let i = 0; i < 18; i++) behind += `<circle cx="${r1(i * 190 + rnd() * 60)}" cy="${r1(fl - 160 - rnd() * 60)}" r="${r1(90 + rnd() * 50)}" fill="${shade(YU.sel2, 0.15)}"/>`;
  let clouds = ''; [[500, 190, 560, 76], [1500, 130, 640, 84], [2500, 220, 520, 70]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 55 + i * 4, 'front'); });
  let paving = ''; for (let i = 0; i < 9; i++) { const y = fl + Math.pow(i / 9, 1.3) * (H - fl); paving += `<path d="M0 ${r1(y)}H${W}" stroke="#A89A76" stroke-width="3" opacity=".5"/>`; }
  for (let i = -4; i < 18; i++) paving += `<path d="M${i * 230} ${fl}L${i * 230 + (i - 7) * 90} ${H}" stroke="#A89A76" stroke-width="3" opacity=".4"/>`;
  const back = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB2E6"/><stop offset=".45" stop-color="#9EDBEB"/><stop offset=".85" stop-color="#F6F0D0"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}${behind}${P.svg}${trees}<path d="M0 ${fl - 20}H${W}V${H}H0Z" fill="#E4D9B6"/>${scRect(0, fl - 22, W, 12, '#fff', 'opacity=".4"')}${paving}`, 'ec-back');
  const bush = (bx, k) => `<g>${[0, 1, 2, 3].map((j) => `<circle cx="${bx + j * 44 * k}" cy="${H - 20 - (j % 2) * 14}" r="${(40 + (j % 3) * 8) * k}" fill="${[YU.sel1, YU.sel2, YU.sel4][j % 3]}"/>`).join('')}</g>`;
  const front = scSvg(W, H, `${bush(20, 1.4)}${bush(2860, 1.4)}${yuFern(520, H + 4, 1.5)}${yuFern(2700, H + 4, 1.6)}`, 'ec-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".5"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".02"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M300 0L600 0L900 ${H}L250 ${H}Z" opacity=".35"/><path d="M2400 0L2700 0L3000 ${H}L2350 ${H}Z" opacity=".3"/></g>`, 'ec-light');
  return { back, front, light, W, H, floor: fl, slots: P.slots, stair: P.stair, door: P.door, topY: P.topY, cx };
}

// ---------------------------------------------------------------- temple du sommet vu de pres (2400 x 1200) : facade, colonnes-serpents, frise de glyphes, escalier qui descend
const CIMA = { W: 2400, H: 1200, floor: 1060 };
/** Retourne { back, front, light, W, H, floor, slots } (slots = 9 emplacements de glyphes sur la frise et les pilastres). */
function templeCima(opts) {
  opts = opts || {};
  const id = opts.uid || uid('tc'), g = (n) => `${id}-${n}`, W = CIMA.W, H = CIMA.H, rnd = rng(opts.seed || 97);
  const slots = [];
  let t = `<rect x="440" y="260" width="1520" height="640" fill="${YU.stone}"/><rect x="420" y="236" width="1560" height="44" fill="${YU.stone2}"/><rect x="420" y="236" width="1560" height="9" fill="#fff" opacity=".4"/><rect x="560" y="150" width="1280" height="90" fill="${YU.stone2}"/><rect x="560" y="150" width="1280" height="9" fill="#fff" opacity=".4"/>`;
  t += `<rect x="1920" y="260" width="40" height="640" fill="#000" opacity=".08"/><rect x="440" y="860" width="1520" height="40" fill="#000" opacity=".12"/>`;
  // frise haute : 5 panneaux ; pilastres : 2 + 2
  for (let i = 0; i < 5; i++) { const px = 600 + i * 300, py = 176; t += `<rect x="${px - 6}" y="${py - 6}" width="130" height="62" rx="8" fill="${YU.stone3}" opacity=".4"/>`; slots.push({ x: px + 5, y: py - 12, w: 110, h: 110 }); }
  // grande porte centrale + piliers carres a gauche et a droite, 2 panneaux chacun
  t += `<rect x="1020" y="420" width="360" height="480" fill="#2A2018"/><rect x="990" y="400" width="30" height="500" fill="${YU.stone3}"/><rect x="1380" y="400" width="30" height="500" fill="${YU.stone3}"/><rect x="990" y="390" width="420" height="30" fill="${YU.stone3}"/>`;
  t += `<ellipse cx="1200" cy="600" rx="150" ry="90" fill="#000" opacity=".25"/>`;
  [[520, 330], [520, 590], [1700, 330], [1700, 590]].forEach((p) => { t += `<rect x="${p[0] - 6}" y="${p[1] - 6}" width="190" height="230" rx="10" fill="${YU.stone3}" opacity=".4"/>`; slots.push({ x: p[0] + 20, y: p[1] + 42, w: 140, h: 140 }); });
  // crete de toit
  t += `<rect x="1060" y="40" width="280" height="120" fill="${YU.stone}"/><rect x="1030" y="26" width="340" height="24" fill="${YU.stone2}"/>`;
  // plate-forme et escalier qui descend vers nous
  let steps = `<rect x="0" y="880" width="${W}" height="40" fill="${YU.stone2}"/><rect x="0" y="880" width="${W}" height="8" fill="#fff" opacity=".4"/><rect x="0" y="920" width="${W}" height="${H - 920}" fill="${YU.stone}"/>`;
  for (let i = 0; i < 7; i++) { const y = 920 + i * 44; steps += `<rect x="0" y="${y}" width="${W}" height="${44}" fill="${i % 2 ? YU.stone : YU.stone2}"/><rect x="0" y="${y}" width="${W}" height="7" fill="#fff" opacity=".4"/><rect x="0" y="${y + 36}" width="${W}" height="8" fill="#000" opacity=".12"/>`; }
  let clouds = ''; [[300, 120, 520, 70], [1900, 90, 600, 80]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 63 + i * 4, 'front'); });
  let jungle = ''; for (let i = 0; i < 14; i++) jungle += `<circle cx="${r1(i * 190 + rnd() * 60)}" cy="${r1(860 + rnd() * 30)}" r="${r1(100 + rnd() * 50)}" fill="${shade(YU.sel2, 0.1 + (i % 3) * 0.05)}"/>`;
  const back = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB2E6"/><stop offset=".6" stop-color="#9EDBEB"/><stop offset="1" stop-color="#F6F0D0"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}${jungle}${t}${steps}`, 'tc-back');
  const front = scSvg(W, H, `<path d="M-20 ${H}L-20 1060Q120 1040 200 ${H}Z" fill="${YU.stone3}"/><path d="M${W + 20} ${H}L${W + 20} 1070Q${W - 120} 1050 ${W - 200} ${H}Z" fill="${YU.stone3}"/>`, 'tc-front');
  const light = scSvg(W, H, `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".45"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".02"/></linearGradient></defs><g class="ac-beams" fill="url(#${g('b')})"><path d="M200 0L520 0L820 ${H}L120 ${H}Z" opacity=".3"/></g>`, 'tc-light');
  return { back, front, light, W, H, floor: CIMA.floor, slots };
}

// ---------------------------------------------------------------- cenote sacre (2400 x 1200) : caverne, ouverture sur la selva, rayon de lumiere, eau turquoise, rebord de pierre
const CENOTE = { W: 2400, H: 1200, floor: 930, surface: 950, glow: { x: 1640, y: 1100 }, shaftX: 1500 };
/** Retourne { back, front, light, W, H, floor, surface, glow, shaftX }. Classes animables : .yu-rip (rides), .yu-shaft (rayon). */
function cenote(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cn'), g = (n) => `${id}-${n}`, W = CENOTE.W, H = CENOTE.H, fl = CENOTE.floor, sf = CENOTE.surface, rnd = rng(opts.seed || 61);
  const defs = `<defs><linearGradient id="${g('rock')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2A36"/><stop offset=".6" stop-color="#4A4A5A"/><stop offset="1" stop-color="#6A6670"/></linearGradient>`
    + `<linearGradient id="${g('wat')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FD6C8"/><stop offset=".35" stop-color="#14A5A8"/><stop offset="1" stop-color="#083F55"/></linearGradient>`
    + `<radialGradient id="${g('op')}" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".6" stop-color="#BFE9D0"/><stop offset="1" stop-color="#6CC080"/></radialGradient>`
    + `<linearGradient id="${g('sh')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".9"/><stop offset="1" stop-color="#CFF7EE" stop-opacity=".1"/></linearGradient>`
    + `<radialGradient id="${g('gl')}"><stop offset="0" stop-color="#9BFFD6"/><stop offset=".4" stop-color="#42E0A0" stop-opacity=".55"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>`;
  // roche : mur du fond avec strates
  let rock = scRect(0, 0, W, H, `url(#${g('rock')})`);
  for (let i = 0; i < 9; i++) rock += `<path d="M0 ${200 + i * 78}Q${600 + rnd() * 300} ${180 + i * 78 + rnd() * 40} 1200 ${210 + i * 78}T2400 ${190 + i * 78}" stroke="#000" stroke-width="${3 + (i % 3)}" fill="none" opacity=".18"/>`;
  // ouverture sur la selva
  const ox = 1500, oy = 130;
  let open = `<ellipse cx="${ox}" cy="${oy}" rx="560" ry="200" fill="#1E1D28"/><ellipse cx="${ox}" cy="${oy}" rx="520" ry="172" fill="url(#${g('op')})"/>`;
  for (let i = 0; i < 14; i++) open += `<circle cx="${r1(ox - 480 + i * 70 + rnd() * 30)}" cy="${r1(oy + 130 + rnd() * 40)}" r="${r1(40 + rnd() * 30)}" fill="${[YU.sel2, YU.sel3, YU.sel1][i % 3]}" opacity=".95"/>`;
  open += cloudSvg(ox - 120, oy - 40, 300, 50, 99, 'front');
  // racines qui pendent depuis l'ouverture
  let roots = ''; for (let i = 0; i < 9; i++) { const rx = ox - 440 + i * 110 + rnd() * 40, len = 220 + rnd() * 240; roots += `<path d="M${r1(rx)} ${oy + 160}Q${r1(rx + 20)} ${r1(oy + 160 + len * 0.5)} ${r1(rx - 8)} ${r1(oy + 160 + len)}" stroke="${YU.trunk}" stroke-width="${r1(5 + rnd() * 5)}" fill="none" stroke-linecap="round"/>`; }
  // eau
  let water = `<path d="M820 ${sf}Q1100 ${sf - 10} 1500 ${sf - 4}T2400 ${sf - 8}V${H}H760Z" fill="url(#${g('wat')})"/>`;
  for (let i = 0; i < 7; i++) water += `<ellipse class="yu-rip" cx="${r1(1060 + i * 190 + rnd() * 60)}" cy="${r1(sf + 18 + (i % 3) * 14)}" rx="${r1(70 + rnd() * 50)}" ry="${r1(7 + rnd() * 4)}" fill="#fff" opacity=".28"/>`;
  water += `<path d="M820 ${sf}Q1100 ${sf - 10} 1500 ${sf - 4}T2400 ${sf - 8}" stroke="#CFF7EE" stroke-width="5" fill="none" opacity=".7"/>`;
  // rayon de lumiere dans l'eau (reflet) + tache de lumiere sur l'eau
  const gl = CENOTE.glow;
  water += `<ellipse cx="${ox + 60}" cy="${sf + 12}" rx="200" ry="22" fill="#FFF3B0" opacity=".3"/>`;
  // stalactites
  let stal = ''; for (let i = 0; i < 10; i++) { const sx = rnd() * W; if (sx > 900 && sx < 2100) continue; stal += `<path d="M${r1(sx - 40)} -10L${r1(sx + 40)} -10L${r1(sx + 4)} ${r1(130 + rnd() * 200)}Z" fill="#1A1922"/>`; }
  // rebord de pierre a gauche (sol des personnages)
  const ledge = `<path d="M-40 ${fl + 8}Q300 ${fl - 12} 620 ${fl - 6}Q860 ${fl} 940 ${fl + 40}L960 ${H}H-40Z" fill="#7C7684"/><path d="M-40 ${fl + 8}Q300 ${fl - 12} 620 ${fl - 6}Q860 ${fl} 940 ${fl + 40}" stroke="#B8B2C0" stroke-width="10" fill="none"/><path d="M-40 ${fl + 60}Q300 ${fl + 40} 640 ${fl + 50}" stroke="#4A4652" stroke-width="5" fill="none" opacity=".5"/>`
    + `<path d="M0 ${fl + 120}Q240 ${fl + 100} 520 ${fl + 130}M80 ${fl + 200}Q300 ${fl + 180} 700 ${fl + 210}" stroke="#4A4652" stroke-width="4" fill="none" opacity=".4"/>`;
  const back = scSvg(W, H, `${defs}${rock}${open}${roots}${stal}<g class="yu-shaft"><path d="M${ox - 300} 250L${ox + 300} 250L${ox + 360} ${sf}L${ox - 180} ${sf}Z" fill="url(#${g('sh')})" opacity=".22"/><path d="M${ox - 120} 250L${ox + 180} 250L${ox + 220} ${sf}L${ox - 40} ${sf}Z" fill="url(#${g('sh')})" opacity=".18"/></g>${water}${ledge}<ellipse cx="${gl.x}" cy="${gl.y}" rx="20" ry="8" fill="#0A3A4A" opacity=".5"/>`, 'cn-back');
  // premier plan : lianes depuis le haut, rocher sombre a droite
  const front = scSvg(W, H, `<path d="M${W + 40} ${H}L${W + 40} 760Q${W - 120} 780 ${W - 200} ${H}Z" fill="#14131C"/><path d="M-30 -10Q60 210 20 340" stroke="${YU.sel1}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M110 -10Q150 140 118 230" stroke="${YU.sel1}" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="352" rx="22" ry="30" fill="${YU.sel3}"/><ellipse cx="118" cy="244" rx="16" ry="22" fill="${YU.sel3}"/>`, 'cn-front');
  // lumiere : rayon doux (<= .25) qui descend de l'ouverture jusqu'a l'eau
  const light = scSvg(W, H, `${defs}<g class="ac-beams" fill="url(#${g('sh')})"><path d="M${ox - 360} 140L${ox - 200} 140L${ox - 140} ${sf}L${ox - 320} ${sf}Z" opacity=".3"/></g>`, 'cn-light');
  return { back, front, light, W, H, floor: fl, surface: sf, glow: gl, shaftX: ox };
}

// ---------------------------------------------------------------- flamant rose en vol (SVG 200 x 150), aile = .fl-wing (pivot data-px/py)
function yuFlamingo(opts) {
  opts = opts || {};
  const W = opts.width || 200, c = opts.c || '#FF8FB0', c2 = shade(c, -0.18);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="${W}" height="${r1(W * 0.75)}" class="yu-flam" style="overflow:visible" aria-hidden="true">`
    + `<path d="M30 74L-30 66M30 78L-26 82" stroke="${c2}" stroke-width="5" stroke-linecap="round"/>`
    + `<path d="M150 66Q176 40 168 18Q166 8 176 8" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M174 6l22 6l-14 8Z" fill="#fff"/><path d="M184 9l12 3l-8 4Z" fill="#2B2233"/><circle cx="176" cy="11" r="2.5" fill="#2B2233"/>`
    + `<g class="fl-wing" data-px="100" data-py="66"><path d="M92 66Q64 6 8 14Q52 38 70 74Z" fill="${c}"/><path d="M8 14Q40 24 64 52" stroke="#2B2233" stroke-width="7" fill="none" opacity=".85"/></g>`
    + `<ellipse cx="100" cy="76" rx="62" ry="26" fill="${c}"/><path d="M52 82Q100 100 148 82Q130 98 100 100Q70 100 52 82Z" fill="${c2}" opacity=".55"/><path d="M44 70Q22 64 6 76Q26 84 48 82Z" fill="${c2}"/></svg>`;
}

// ---------------------------------------------------------------- accessoires de capsule en papier decoupe
/** Pyramide vue de dessus (SVG 600 x 600) : 4 escaliers (.yu-st-n/e/s/w avec .yu-st-lit a allumer), 9 gradins en carres, temple au centre. */
function yuPyramidPlan(opts) {
  opts = opts || {};
  const W = opts.width || 600;
  let sq = '';
  for (let i = 0; i < 9; i++) { const m = i * 30 + 20, sz = 560 - i * 60; sq += `<rect x="${m}" y="${m}" width="${sz}" height="${sz}" fill="${i % 2 ? YU.stone : YU.stone2}" stroke="${YU.stoneD}" stroke-width="3"/>`; }
  const stair = (cls, rot) => {
    let steps = ''; for (let i = 0; i < 12; i++) steps += `<path d="M262 ${20 + i * 22}H338" stroke="${YU.stoneD}" stroke-width="3" opacity=".6"/>`;
    return `<g class="yu-st ${cls}" transform="rotate(${rot} 300 300)"><rect x="256" y="14" width="88" height="276" fill="${YU.stone}" stroke="${YU.stoneD}" stroke-width="3"/>${steps}<rect class="yu-st-lit" x="256" y="14" width="88" height="276" fill="#FFC83D" opacity="0"/><rect x="246" y="14" width="12" height="276" fill="${YU.stone3}"/><rect x="342" y="14" width="12" height="276" fill="${YU.stone3}"/></g>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="${W}" height="${W}" class="yu-plan" style="overflow:visible" aria-hidden="true">${sq}${stair('yu-st-n', 0)}${stair('yu-st-e', 90)}${stair('yu-st-s', 180)}${stair('yu-st-w', 270)}<rect x="250" y="250" width="100" height="100" fill="${YU.stone}" stroke="${YU.stoneD}" stroke-width="3"/><rect x="272" y="272" width="56" height="56" fill="#6F5A3F"/><rect x="290" y="290" width="20" height="20" fill="#2A2018"/></svg>`;
}
/** Pyramide de face (SVG 800 x 560) avec l'ombre de Kukulcan : .yu-zz (7 dents d'ombre, du haut vers le bas), .yu-head (tete de serpent en pierre), .yu-sun. */
function yuPyramidSide(opts) {
  opts = opts || {};
  const W = opts.width || 800;
  let s = '';
  for (let i = 0; i < 9; i++) { const wi = 720 * (1 - i * 0.092), y = 520 - (i + 1) * 44; s += `<rect x="${r1(400 - wi / 2)}" y="${y}" width="${r1(wi)}" height="44" fill="${i % 2 ? YU.stone : YU.stone2}"/><rect x="${r1(400 - wi / 2)}" y="${y}" width="${r1(wi)}" height="5" fill="#fff" opacity=".4"/><rect x="${r1(400 - wi / 2)}" y="${y + 38}" width="${r1(wi)}" height="6" fill="#000" opacity=".14"/>`; }
  const top = 520 - 9 * 44;
  s += `<path d="M330 520L356 ${top}H444L470 520Z" fill="${YU.stone}"/>`;
  for (let i = 1; i < 26; i++) { const y = 520 - ((520 - top) * i) / 26, k = i / 26; s += `<path d="M${r1(330 + 26 * k)} ${r1(y)}H${r1(470 - 26 * k)}" stroke="${YU.stoneD}" stroke-width="2.5" opacity=".5"/>`; }
  // balustrade gauche (la ou tombe l'ombre) : bande large le long de l'escalier
  s += `<path d="M298 520L336 ${top}L360 ${top}L330 520Z" fill="${YU.stone3}"/>`;
  // temple
  s += `<rect x="332" y="${top - 70}" width="136" height="70" fill="${YU.stone}"/><rect x="322" y="${top - 82}" width="156" height="16" fill="${YU.stone2}"/><rect x="376" y="${top - 56}" width="48" height="56" fill="#2A2018"/>`;
  // dents d'ombre (de haut en bas) le long de la balustrade
  let zz = ''; for (let i = 0; i < 7; i++) { const y0 = top + 8 + i * 58, k0 = (y0 - top) / (520 - top), x0 = 336 - 38 * k0; zz += `<path class="yu-zz" d="M${r1(x0 - 4)} ${r1(y0)}L${r1(x0 + 30)} ${r1(y0 + 30)}L${r1(x0 - 4)} ${r1(y0 + 56)}Z" fill="#2A1A0E" opacity=".82"/>`; }
  // tete de serpent en pierre au pied de l'escalier (gueule ouverte)
  const head = `<g class="yu-head"><path d="M236 520Q228 478 270 470Q318 466 330 500L332 520Z" fill="${YU.stone2}" stroke="${YU.stoneD}" stroke-width="3"/><path d="M236 520Q232 538 262 540L330 540L332 520Z" fill="${YU.stone3}"/><circle cx="276" cy="486" r="8" fill="#fff"/><circle cx="278" cy="486" r="4" fill="#2A2018"/><path d="M244 508l10 14l10 -12l10 14l10 -12" stroke="#fff" stroke-width="4" fill="none"/><path d="M240 474q14 -26 40 -22" stroke="#19B7AA" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="${W}" height="${r1(W * 0.7)}" class="yu-side" style="overflow:visible" aria-hidden="true">${scRect(0, 520, 800, 40, '#8A9E5B')}${s}${zz}${head}</svg>`;
}
/** Tenochtitlan (SVG 900 x 600) : lac, ile aux maisons blanches, chaussees, temple double, pirogues. */
function yuTenochtitlan(opts) {
  opts = opts || {};
  const W = opts.width || 900, rnd = rng(opts.seed || 12), id = opts.uid || uid('tn');
  let houses = '';
  for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 120; const hx = 450 + Math.cos(a) * d * 1.3, hy = 330 + Math.sin(a) * d * 0.78; houses += `<rect x="${r1(hx - 9)}" y="${r1(hy - 6)}" width="18" height="12" fill="${i % 4 ? '#F5E6C8' : '#E8C98A'}"/>`; }
  let canoes = ''; [[200, 200, 0], [720, 440, 1], [300, 470, 0], [650, 160, 1]].forEach((c) => { canoes += `<g class="yu-canoe"><path d="M${c[0] - 26} ${c[1]}Q${c[0]} ${c[1] + 12} ${c[0] + 26} ${c[1]}L${c[0] + 20} ${c[1] - 4}H${c[0] - 20}Z" fill="#6B4A32"/><rect x="${c[0] - 6}" y="${c[1] - 14}" width="12" height="10" fill="#F5E6C8"/></g>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="${W}" height="${r1(W * 0.6667)}" class="yu-tenoch" style="overflow:visible" aria-hidden="true"><defs><radialGradient id="${id}"><stop offset="0" stop-color="#7FD6E8"/><stop offset="1" stop-color="#2F8FB5"/></radialGradient></defs>`
    + `<ellipse cx="450" cy="320" rx="440" ry="270" fill="url(#${id})"/><ellipse cx="450" cy="320" rx="440" ry="270" fill="none" stroke="#A97B4A" stroke-width="14"/>`
    + `<g class="yu-causeways" fill="#C9B07A"><rect x="436" y="40" width="28" height="140"/><rect x="436" y="460" width="28" height="130"/><rect x="20" y="306" width="200" height="28"/></g>`
    + `<ellipse cx="450" cy="332" rx="170" ry="118" fill="#8A6A44"/><ellipse cx="450" cy="326" rx="160" ry="108" fill="#B58A58"/>${houses}`
    + `<g class="yu-twin"><rect x="396" y="290" width="108" height="14" fill="${YU.stone}"/><rect x="404" y="276" width="92" height="14" fill="${YU.stone2}"/><rect x="412" y="262" width="76" height="14" fill="${YU.stone}"/><rect x="420" y="236" width="24" height="26" fill="#C9573B"/><rect x="456" y="236" width="24" height="26" fill="#2F6FD0"/></g>`
    + `${canoes}</svg>`;
}
/** Mexico aujourd'hui (SVG 900 x 600) : tours de verre generiques, avenue, arbres. */
function yuCiudad(opts) {
  opts = opts || {};
  const W = opts.width || 900, rnd = rng(opts.seed || 19), id = opts.uid || uid('cd');
  let b = '';
  const towers = [[40, 260, 120], [150, 160, 140], [300, 300, 110], [420, 110, 150], [580, 230, 130], [720, 180, 120], [830, 300, 90]];
  towers.forEach((t, i) => {
    b += `<rect x="${t[0]}" y="${600 - t[1] - 60}" width="${t[2]}" height="${t[1] + 60}" fill="${['#3C4A8E', '#2F6FD0', '#4F5FA8', '#2B3B7A'][i % 4]}"/><rect x="${t[0] + t[2] - 18}" y="${600 - t[1] - 60}" width="18" height="${t[1] + 60}" fill="#000" opacity=".15"/>`;
    for (let y = 600 - t[1] - 46; y < 520; y += 26) for (let x = t[0] + 12; x < t[0] + t[2] - 22; x += 24) b += `<rect x="${x}" y="${y}" width="12" height="14" rx="2" fill="${rnd() < 0.45 ? '#FFE9A8' : '#9CB8F0'}" opacity=".9"/>`;
  });
  b += `<rect x="456" y="${600 - 110 - 60 - 40}" width="6" height="40" fill="#CFE0FF"/>`;
  let trees = ''; for (let i = 0; i < 9; i++) trees += `<circle cx="${r1(40 + i * 100 + rnd() * 30)}" cy="${r1(552 + rnd() * 10)}" r="${r1(26 + rnd() * 12)}" fill="${[YU.sel2, YU.sel3, YU.sel1][i % 3]}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="${W}" height="${r1(W * 0.6667)}" class="yu-ciudad" style="overflow:visible" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB2E6"/><stop offset="1" stop-color="#FFE9B0"/></linearGradient></defs>${scRect(0, 0, 900, 600, `url(#${id})`)}${b}${trees}${scRect(0, 560, 900, 40, '#3A3F4A')}<path d="M0 580H900" stroke="#FFC83D" stroke-width="4" stroke-dasharray="36 28"/></svg>`;
}
/** Aliments (SVG 200 x 200) : 'maiz' | 'cacao' | 'tortilla' | 'taza' | 'chile'. Classes animables : .yu-steam (vapeur de la taza). */
function yuFood(key, opts) {
  opts = opts || {};
  const W = opts.width || 200;
  let b = '';
  if (key === 'maiz') {
    let k = ''; for (let r = 0; r < 9; r++) for (let q = 0; q < 5; q++) k += `<rect x="${r1(72 + q * 14.4 + (r % 2) * 3)}" y="${r1(34 + r * 15.4)}" width="12" height="13" rx="4" fill="${(r + q) % 5 ? '#FFC83D' : '#FFE070'}"/>`;
    b = `<path d="M100 190Q30 140 40 60Q48 80 90 110Z" fill="${YU.sel3}"/><path d="M100 190Q170 140 160 60Q152 80 110 110Z" fill="${YU.sel2}"/><ellipse cx="100" cy="106" rx="36" ry="78" fill="#E8A83C"/><g>${k}</g><path d="M100 196Q70 150 62 100Q92 130 100 196Z" fill="${YU.sel1}" opacity=".9"/>`;
  } else if (key === 'cacao') {
    b = `<ellipse cx="100" cy="108" rx="52" ry="78" fill="#D8742A" transform="rotate(24 100 108)"/><path d="M100 36Q66 108 100 180M70 50Q40 108 72 172M130 50Q150 108 124 172" stroke="#8E3A1E" stroke-width="5" fill="none" transform="rotate(24 100 108)" opacity=".6"/><ellipse cx="86" cy="86" rx="14" ry="26" fill="#FFB86B" opacity=".55" transform="rotate(24 86 86)"/><path d="M134 36q14 -14 24 -4" stroke="#5A4030" stroke-width="8" fill="none" stroke-linecap="round"/>`
      + `<g transform="translate(12 120)"><ellipse cx="20" cy="20" rx="11" ry="15" fill="#5A3322"/><ellipse cx="44" cy="30" rx="11" ry="15" fill="#6B3E26"/><ellipse cx="30" cy="48" rx="11" ry="15" fill="#5A3322"/></g>`;
  } else if (key === 'tortilla') {
    b = `<circle cx="100" cy="106" r="82" fill="#E8C47A"/><circle cx="100" cy="106" r="82" fill="none" stroke="#C99A4A" stroke-width="6"/>${[[70, 80, 10], [126, 96, 12], [96, 140, 9], [60, 124, 7], [136, 138, 8], [104, 64, 7]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#B27A32" opacity=".6"/>`).join('')}<ellipse cx="78" cy="66" rx="30" ry="10" fill="#fff" opacity=".28"/>`;
  } else if (key === 'taza') {
    b = `<path d="M44 90H148L138 168Q96 184 56 168Z" fill="#F5E6C8"/><path d="M148 104Q186 104 182 134Q178 158 142 156" stroke="#F5E6C8" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="96" cy="90" rx="52" ry="14" fill="#6B3E26"/><ellipse cx="96" cy="88" rx="44" ry="9" fill="#8A5230"/><path d="M52 128H140M54 146H138" stroke="#D93472" stroke-width="6" opacity=".85"/>`
      + `<path class="yu-steam" d="M76 74Q64 54 80 40Q92 26 78 10" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><path class="yu-steam" d="M104 76Q92 56 108 42Q120 28 106 12" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>`;
  } else {
    b = `<path d="M60 70Q40 90 52 130Q66 176 150 186Q132 140 118 104Q108 74 88 60Z" fill="#D81E3A"/><path d="M62 78Q50 100 60 126" stroke="#FF7A8A" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/><path d="M88 60Q94 40 120 34" stroke="${YU.sel2}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="86" cy="62" rx="22" ry="12" fill="${YU.sel2}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${W}" height="${W}" class="yu-food yu-${key}" style="overflow:visible" aria-hidden="true">${b}</svg>`;
}

// ---------------------------------------------------------------- decors de Buenos Aires (unite 7) : panorama (Obelisco, Casa Rosada, avenue 9 de Julio, Caminito), Caminito (La Boca),
// feria de San Telmo, accessoires de capsule (bandoneon, mate, maillots, coupe, stade, couple de tango, sceau, bulle, banc).
// Memes conventions que 10-salamanca.js / 12-mexico.js : calques separes, aucun texte, monuments publics simplifies, aucune marque ni ecusson (maillots generiques).
// Prefixe `ba` pour les helpers internes ; exports : baSkyline, baCaminito, baSanTelmo, baProp, baPareja. Reutilise les helpers `mx*` (pave, etal) et la palette MX de 12-mexico.js.

const BA = {
  red: '#D6403A', blue: '#2F6FD0', blue2: '#1D4FA8', yel: '#F2C14E', grn: '#1E8F6A', ora: '#E8823A', pnk: '#E5638A', tur: '#22B5A8',
  crema: '#FFF1D6', metal: '#9AA3B0', metal2: '#6F7A8A', ink: '#1D2160', rio: '#B88A62', rio2: '#D3AD86', rosada: '#E9A3B4', rosada2: '#C97B92',
};
const BA_TONES = [BA.red, BA.blue, BA.yel, BA.grn, BA.ora, BA.pnk, BA.tur];

/** Maison de La Boca : facade en tole ondulee coloree (lignes verticales), parapet, toit de zinc, balcon a balustres au 1er etage, volets de couleur contrastee, porte. */
function baHouse(x, base, w, h, tone, seed, o) {
  o = o || {};
  const rnd = rng(seed), dark = shade(tone, -0.28), top = base - h, trim = o.trim || BA_TONES[(seed + 3) % BA_TONES.length];
  let s = `<g class="ba-house">${scRect(x, top, w, h, tone)}`;
  for (let lx = x + 9; lx < x + w - 4; lx += 14) s += `<path d="M${lx} ${top}V${base}" stroke="${dark}" stroke-width="3" opacity=".3"/>`;
  s += scRect(x + w - 14, top, 14, h, '#000', 'opacity=".1"') + scRect(x, base - 36, w, 36, shade(tone, -0.18));
  s += `<path d="M${x - 10} ${top}L${x + 14} ${top - 34}H${x + w - 14}L${x + w + 10} ${top}Z" fill="${BA.metal}"/><path d="M${x - 10} ${top}L${x + 14} ${top - 34}H${x + w - 14}L${x + w + 10} ${top}" stroke="${BA.metal2}" stroke-width="4" fill="none"/>`;
  for (let rx = x + 24; rx < x + w - 20; rx += 22) s += `<path d="M${rx} ${top - 32}L${rx - 6} ${top - 2}" stroke="${BA.metal2}" stroke-width="3" opacity=".5"/>`;
  s += scRect(x - 4, top - 2, w + 8, 12, trim);
  const n = Math.max(2, Math.floor(w / 104)), bw = w / n, by = top + h * 0.46;
  for (let i = 0; i < n; i++) {
    const cx = x + bw * (i + 0.5), upW = 46, upH = 78, up = top + 38;
    if (up + upH < by - 6) {
      s += scRect(cx - upW / 2 - 6, up - 6, upW + 12, upH + 12, trim) + scRect(cx - upW / 2, up, upW, upH, '#2A2148') + scRect(cx - 3, up, 6, upH, trim) + scRect(cx - upW / 2 - 14, up - 4, 12, upH + 8, shade(trim, -0.15)) + scRect(cx + upW / 2 + 2, up - 4, 12, upH + 8, shade(trim, -0.15));
    }
    const lw = 46, lh = 84, ly = base - 36 - lh - 18;
    if (o.door === i) s += scRect(cx - 34, base - 150, 68, 150, trim) + scRect(cx - 27, base - 143, 54, 143, '#3B2216') + `<circle cx="${r1(cx + 17)}" cy="${base - 72}" r="4" fill="${BA.yel}"/>`;
    else s += scRect(cx - lw / 2 - 5, ly - 5, lw + 10, lh + 10, trim) + scRect(cx - lw / 2, ly, lw, lh, '#2A2148') + scRect(cx - 2, ly, 4, lh, trim) + scRect(cx - lw / 2, ly + lh * 0.55, lw, 4, trim);
  }
  // balcon : dalle + balustres + garde-corps
  s += scRect(x - 6, by, w + 12, 12, shade(tone, 0.25)) + scRect(x - 6, by + 12, w + 12, 4, '#000', 'opacity=".16"') + scRect(x - 6, by - 52, w + 12, 5, '#2A2A3A');
  for (let bx = x + 2; bx < x + w; bx += 16) s += `<path d="M${bx} ${by}V${by - 52}" stroke="#2A2A3A" stroke-width="4"/>`;
  if (rnd() < 0.7) { const px = x + w * (0.2 + rnd() * 0.6); s += `<path d="M${r1(px - 16)} ${by}l3 -24h26l3 24Z" fill="${BA.red}"/>` + [0, 1, 2].map((k) => `<circle cx="${r1(px - 8 + k * 8)}" cy="${by - 30 - (k % 2) * 6}" r="7" fill="${[BA.pnk, '#fff', BA.pnk][k]}"/>`).join('') + `<circle cx="${r1(px)}" cy="${by - 34}" r="11" fill="#2C6B3F" opacity=".9"/>`; }
  return s + '</g>';
}
/** Immeuble a fenetres (avenue 9 de Julio) : bloc, grille de fenetres (quelques-unes eclairees), corniche. */
function baTower(x, base, w, h, tone, seed, lit) {
  const rnd = rng(seed); let s = `<g class="ba-tower">${scRect(x, base - h, w, h, tone)}${scRect(x + w - 12, base - h, 12, h, '#000', 'opacity=".12"')}${scRect(x - 4, base - h - 10, w + 8, 12, shade(tone, -0.2))}`;
  const cols = Math.max(2, Math.floor(w / 34)), rows = Math.floor((h - 40) / 46);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += scRect(x + 12 + c * ((w - 24) / cols), base - h + 24 + r * 46, (w - 24) / cols - 10, 28, lit && rnd() < 0.35 ? '#FFE9A8' : shade(tone, -0.4), 'rx="2"');
  return s + '</g>';
}
/** Obelisco : fut effile, pointe pyramidale, face ombree, fenetres-fentes, socle a degres. (x,base) = centre du pied ; hauteur ~h. */
function baObelisk(x, base, h) {
  const bw = h * 0.085, tw = h * 0.036, top = base - h;
  return `<g class="ba-obelisk"><path d="M${r1(x - bw)} ${base - 26}L${r1(x - tw)} ${r1(top + h * 0.06)}L${x} ${top}L${r1(x + tw)} ${r1(top + h * 0.06)}L${r1(x + bw)} ${base - 26}Z" fill="#F4EEE2"/><path d="M${x} ${top}L${r1(x + tw)} ${r1(top + h * 0.06)}L${r1(x + bw)} ${base - 26}H${x}Z" fill="#CFC6B6"/><path d="M${r1(x - tw)} ${r1(top + h * 0.06)}H${r1(x + tw)}" stroke="#B9AE9A" stroke-width="3"/>${[0.3, 0.5, 0.7].map((f) => `<path d="M${r1(x - 4)} ${r1(top + h * f)}h8" stroke="#8E8474" stroke-width="3"/>`).join('')}${scRect(x - bw - 18, base - 26, bw * 2 + 36, 14, '#E4DACA')}${scRect(x - bw - 32, base - 12, bw * 2 + 64, 12, '#CFC6B6')}</g>`;
}
/** Casa Rosada : long batiment rose, deux niveaux d'arcades, portique central a colonnes + fronton, toit sombre. (x,base) = coin gauche. */
function baRosada(x, base, w, h) {
  let s = `<g class="ba-rosada">${scRect(x, base - h, w, h, BA.rosada)}${scRect(x, base - h, w, 16, BA.rosada2)}${scRect(x - 6, base - h - 14, w + 12, 18, '#F6E4E4')}${scRect(x, base - 26, w, 26, BA.rosada2)}`;
  const n = Math.floor(w / 90), bw = w / n;
  for (let i = 0; i < n; i++) {
    const cx = x + bw * (i + 0.5), mid = Math.abs(i - (n - 1) / 2) < 1;
    s += `<path d="${archOpen(cx - 22, base - h * 0.52, 44, 74)}" fill="#F6E4E4"/><path d="${archOpen(cx - 17, base - h * 0.52, 34, 68)}" fill="#6A3A4A"/>`;
    s += `<path d="${archOpen(cx - 22, base - 26, 44, 78)}" fill="#F6E4E4"/><path d="${archOpen(cx - 17, base - 26, 34, 72)}" fill="#6A3A4A"/>`;
    if (mid) s += scRect(cx - 5, base - h * 0.52 - 66, 10, 16, '#fff');
  }
  const cx = x + w / 2, pw = 230;
  s += scRect(cx - pw / 2, base - h - 4, pw, h + 4, '#F6E4E4') + `<path d="M${cx - pw / 2 - 14} ${base - h - 4}L${cx} ${base - h - 70}L${cx + pw / 2 + 14} ${base - h - 4}Z" fill="#F6E4E4"/><path d="M${cx - pw / 2 + 12} ${base - h - 12}L${cx} ${base - h - 54}L${cx + pw / 2 - 12} ${base - h - 12}Z" fill="${BA.rosada2}"/>`;
  for (let k = 0; k < 6; k++) s += scRect(cx - pw / 2 + 14 + k * 38, base - h + 8, 16, h - 34, '#FFFDF4') + scRect(cx - pw / 2 + 10 + k * 38, base - h + 4, 24, 8, '#E3CFCF');
  s += `<path d="${archOpen(cx - 34, base - 26, 68, 84)}" fill="#6A3A4A"/>`;
  return s + '</g>';
}
/** Palmier / platane (avenue) : tronc + houppier arrondi. */
function baTree(x, base, k, c1, c2) {
  return `<g class="ba-tree"><path d="M${x - 9 * k} ${base}L${x - 5 * k} ${base - 170 * k}H${x + 5 * k}L${x + 9 * k} ${base}Z" fill="#6B4A32"/><circle cx="${x}" cy="${r1(base - 230 * k)}" r="${r1(80 * k)}" fill="${c1}"/><circle cx="${r1(x - 60 * k)}" cy="${r1(base - 190 * k)}" r="${r1(56 * k)}" fill="${c2}"/><circle cx="${r1(x + 62 * k)}" cy="${r1(base - 196 * k)}" r="${r1(58 * k)}" fill="${c2}"/><circle cx="${r1(x - 22 * k)}" cy="${r1(base - 258 * k)}" r="${r1(36 * k)}" fill="${shade(c1, 0.18)}" opacity=".7"/></g>`;
}
/** Lampadaire ancien (fer forge) : fut, bras, lanterne. */
function baLamp(lx, fl, k) {
  k = k || 1;
  return `<g class="ba-lamp"><path d="M${lx} ${fl + 40}V${fl - 300 * k}" stroke="#1E1E2A" stroke-width="${12 * k}"/><path d="M${lx - 16 * k} ${fl + 40}h${32 * k}l${-4 * k} ${-60 * k}h${-24 * k}Z" fill="#1E1E2A"/><path d="M${lx - 36 * k} ${fl - 300 * k}h${72 * k}l${-8 * k} ${-36 * k}h${-56 * k}Z" fill="#1E1E2A"/><rect x="${r1(lx - 26 * k)}" y="${r1(fl - 372 * k)}" width="${52 * k}" height="${40 * k}" rx="${8 * k}" fill="#FFE9A8" opacity=".92"/><path d="M${lx - 30 * k} ${fl - 376 * k}h${60 * k}l${-30 * k} ${-22 * k}Z" fill="#1E1E2A"/></g>`;
}

// ---------------------------------------------------------------- panorama de Buenos Aires (3200 x 1200) : plein ete, apres-midi
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY } : 5 SVG de 3200x1200 (parallaxe far .25, mid .6, near 1). .sk-rays / .sk-disc (soleil), .ba-glint (reflets du fleuve), .ba-cp (couples de tango au 1er plan). */
function baSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('bs'), g = (n) => `${id}-${n}`, W = SKY.W, H = SKY.H, rnd = rng(opts.seed || 71), street = 820;
  let clouds = ''; [[300, 250, 560, 80], [1150, 170, 640, 90], [1950, 320, 520, 74], [2650, 200, 620, 86], [3050, 400, 420, 64]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 90 + i * 5, 'front'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F86DC"/><stop offset=".34" stop-color="#6DBBEE"/><stop offset=".56" stop-color="#BFE3F2"/><stop offset=".68" stop-color="#FFE2B8"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'ba-sky');
  const sx = opts.sunX || 2350, sy = opts.sunY || 360;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 40; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF8D0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE08A" stop-opacity=".5"/><stop offset="1" stop-color="#FFC24A" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFF3C4" opacity=".1" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="400" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="70" fill="#FFF8D0"/>`, 'ba-sun');
  // loin : le Rio de la Plata (cafe au lait) + silhouettes de tours + grues du port
  let blocks = ''; for (let x = -20; x < W; x += 48) { const h = 40 + rnd() * 150; blocks += scRect(x, street - 60 - h, 44, h + 4, '#8FA9C9'); }
  let glints = ''; for (let i = 0; i < 26; i++) glints += `<path class="ba-glint" d="M${r1(60 + rnd() * 3000)} ${r1(street - 120 + rnd() * 50)}h${r1(40 + rnd() * 90)}" stroke="#FFF1D6" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  const crane = (cx) => `<g fill="none" stroke="#6F7A8A" stroke-width="7"><path d="M${cx} ${street - 60}V${street - 330}H${cx + 200}"/><path d="M${cx + 200} ${street - 330}L${cx + 150} ${street - 60}"/><path d="M${cx} ${street - 330}L${cx + 130} ${street - 330}M${cx - 60} ${street - 330}H${cx}"/></g><path d="M${cx + 190} ${street - 326}v60" stroke="#6F7A8A" stroke-width="4"/>`;
  const far = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BA.rio2}"/><stop offset="1" stop-color="${BA.rio}"/></linearGradient></defs>${scRect(0, street - 150, W, 160, `url(#${g('w')})`)}<g opacity=".55">${blocks}</g>${glints}${crane(430)}${crane(2950)}${scRect(0, street - 6, W, 14, '#8E7358')}`, 'ba-far');
  // milieu : Casa Rosada (gauche), avenue 9 de Julio + Obelisco (centre), Caminito (droite)
  let towers = '', x = 1180; const tt = ['#D8CFC0', '#C7B9A6', '#E2D3BC', '#B6C0CC'];
  for (let i = 0; i < 4; i++) { const w = 120 + rnd() * 50, h = 300 + rnd() * 240; towers += baTower(x, street, w, h, tt[i % 4], 40 + i, true); x += w + 6; if (i === 1) x += 260; }
  x = 1980; for (let i = 0; i < 2; i++) { const w = 120 + rnd() * 40, h = 320 + rnd() * 160; towers += baTower(x, street, w, h, tt[(i + 2) % 4], 50 + i, true); x += w + 6; }
  let houses = ''; x = 2260; let k = 0; while (x < W + 40) { const w = 190 + rnd() * 70, h = 230 + rnd() * 110; houses += baHouse(x, street, w, h, BA_TONES[k++ % BA_TONES.length], 60 + k, { door: 0 }); x += w + 8; }
  const mid = scSvg(W, H, `${baRosada(120, street, 900, 230)}${towers}${baObelisk(1650, street, 560)}${houses}${scRect(0, street, W, 400, '#6F6A70')}${scRect(0, street + 6, W, 5, '#fff', 'opacity=".22"')}`, 'ba-mid');
  // premier plan : avenue, trottoir, platanes, lampadaires, bancs
  let lanes = ''; for (let lx = 0; lx < W; lx += 190) lanes += scRect(lx, street + 120, 110, 10, '#F5E6C8', 'opacity=".55"');
  const near = scSvg(W, H, `${scRect(0, street, W, 400, '#58545C')}${scRect(0, street + 40, W, 56, '#8E8A88')}${scRect(0, street + 96, W, 8, '#B5B1AD')}${lanes}${scRect(0, street + 214, W, 260, '#8E8A88')}${scRect(0, street + 210, W, 8, '#B5B1AD')}${baTree(260, street + 240, 1.3, '#4E9A56', '#6DB86E')}${baTree(1380, street + 240, 1.2, '#3F8A52', '#5FAF6A')}${baTree(2540, street + 240, 1.35, '#4E9A56', '#6DB86E')}${baLamp(780, street + 240, 1.1)}${baLamp(1960, street + 240, 1.1)}${baLamp(3060, street + 240, 1.1)}`, 'ba-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy };
}

// ---------------------------------------------------------------- Caminito, La Boca (3200 x 1200)
const BA_CAM = { W: 3200, H: 1200, floor: 930 };
/** Retourne { back, front, light, W, H, floor }. Rue pavee entre deux rangees de maisons de tole coloree, guirlande de fanions sobres. */
function baCaminito(opts) {
  opts = opts || {};
  const id = opts.uid || uid('bc'), g = (n) => `${id}-${n}`, W = BA_CAM.W, H = BA_CAM.H, fl = BA_CAM.floor, rnd = rng(opts.seed || 83);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F86DC"/><stop offset=".5" stop-color="#7CC4EE"/><stop offset=".8" stop-color="#FFE2B0"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".02"/></linearGradient></defs>`;
  // rangee du fond (plus petite, plus claire) puis rangee principale
  let back2 = '', x = -40, k = 2; while (x < W) { const w = 170 + rnd() * 60, h = 230 + rnd() * 90; back2 += baHouse(x, fl - 150, w, h, shade(BA_TONES[(k++) % BA_TONES.length], 0.28), 100 + k, {}); x += w + 6; }
  let houses = ''; x = -60; k = 0; while (x < W) { const w = 230 + rnd() * 90, h = 330 + rnd() * 130; houses += baHouse(x, fl - 30, w, h, BA_TONES[(k++ * 3) % BA_TONES.length], 120 + k, { door: k % 2 }); x += w + 10; }
  // guirlande de fanions entre les facades
  let flags = `<path d="M-20 300Q1600 470 3220 300" stroke="#2A2A3A" stroke-width="4" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 26; i++) { const t = (i + 0.5) / 26, fx = -20 + t * 3240, fy = 300 + 4 * 85 * t * (1 - t) * 2; flags += `<path d="M${r1(fx - 22)} ${r1(fy)}H${r1(fx + 22)}L${r1(fx)} ${r1(fy + 52)}Z" fill="${BA_TONES[i % 7]}"/>`; }
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(600, 130, 520, 74, 91, 'front')}${cloudSvg(2300, 110, 600, 84, 93, 'front')}${back2}${houses}${flags}
${mxCobbles(W, fl, H, 31, '#C2A27E', '#8A6A48')}${scRect(0, fl - 8, W, 14, '#8E7358')}${baLamp(1100, fl, 1)}${baLamp(2150, fl, 1)}`, 'bc-back');
  const pot = (px, c) => `<g><path d="M${px - 26} ${H}l5 -54h42l5 54Z" fill="${c}"/><rect x="${px - 30}" y="${H - 64}" width="60" height="12" rx="4" fill="${shade(c, 0.2)}"/>${[0, 1, 2, 3].map((i) => `<circle cx="${px - 24 + i * 16}" cy="${H - 78 - (i % 2) * 8}" r="13" fill="${[BA.red, BA.pnk, BA.red, BA.yel][i]}"/>`).join('')}<circle cx="${px}" cy="${H - 70}" r="20" fill="#2C6B3F" opacity=".85"/></g>`;
  const front = scSvg(W, H, pot(60, BA.blue) + pot(3140, BA.ora) + pot(1580, BA.tur), 'bc-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M1900 0L2700 0L2200 ${H}L1400 ${H}Z" opacity=".5"/></g>`, 'bc-light');
  return { back, front, light, W, H, floor: fl };
}

// ---------------------------------------------------------------- feria de San Telmo (3200 x 1200)
const BA_TEL = { W: 3200, H: 1200, floor: 930 };
/** Retourne { back, front, light, W, H, floor, dance : { x0, x1 } }. Facades coloniales a balcons de fer forge, etals a auvents, guirlande d'ampoules fixes, pave ; l'espace central est libre pour les danseurs. */
function baSanTelmo(opts) {
  opts = opts || {};
  const id = opts.uid || uid('bt'), g = (n) => `${id}-${n}`, W = BA_TEL.W, H = BA_TEL.H, fl = BA_TEL.floor, rnd = rng(opts.seed || 97);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3C8FDB"/><stop offset=".5" stop-color="#9CD0EC"/><stop offset=".85" stop-color="#FFE2B0"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  const tones = ['#F1DDB4', '#E8A83C', '#D98A6A', '#B9D0DE', '#F2C14E', '#E5B8A0'];
  let bld = '', x = -60, k = 0;
  while (x < W) {
    const w = 290 + rnd() * 70, h = 420 + rnd() * 90, tone = tones[k++ % tones.length], top = fl - 30 - h; let s = `<g class="ba-colonial">${scRect(x, top, w, h, tone)}${scRect(x + w - 14, top, 14, h, '#000', 'opacity=".09"')}${scRect(x - 8, top - 18, w + 16, 22, shade(tone, 0.3))}${scRect(x - 8, top + 4, w + 16, 6, '#000', 'opacity=".12"')}${scRect(x, fl - 70, w, 40, shade(tone, -0.2))}`;
    const n = Math.max(2, Math.floor(w / 100)), bw = w / n;
    for (let i = 0; i < n; i++) {
      const cx = x + bw * (i + 0.5);
      s += `<path d="${archOpen(cx - 24, top + 190, 48, 120)}" fill="#F5E6C8"/><path d="${archOpen(cx - 19, top + 190, 38, 114)}" fill="#2A2148"/><path d="M${cx} ${top + 76}V${top + 190}" stroke="#F5E6C8" stroke-width="4"/>`;
      s += scRect(cx - 40, top + 194, 80, 10, '#1E1E2A') + scRect(cx - 40, top + 150, 80, 4, '#1E1E2A');
      for (let bx = cx - 38; bx <= cx + 40; bx += 10) s += `<path d="M${bx} ${top + 154}V${top + 194}" stroke="#1E1E2A" stroke-width="3"/>`;
      s += `<path d="${archOpen(cx - 24, fl - 70, 48, 150)}" fill="#F5E6C8"/><path d="${archOpen(cx - 19, fl - 70, 38, 144)}" fill="#3B2216"/>`;
    }
    bld += s + '</g>'; x += w + 8;
  }
  // guirlande d'ampoules (fixes, lumiere chaude) et lampadaires
  let bulbs = `<path d="M-20 250Q1600 400 3220 250" stroke="#2A2A3A" stroke-width="3" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 44; i++) { const t = (i + 0.5) / 44, bx = -20 + t * 3240, by = 250 + 4 * 75 * t * (1 - t) * 2; bulbs += `<circle cx="${r1(bx)}" cy="${r1(by + 10)}" r="9" fill="#FFE9A8"/><circle cx="${r1(bx)}" cy="${r1(by + 10)}" r="16" fill="#FFE9A8" opacity=".25"/>`; }
  const stalls = mxStall(120, fl + 50, 320, BA.red, BA.crema) + mxStall(2760, fl + 50, 330, BA.blue, BA.crema) + mxStall(2280, fl + 50, 300, BA.yel, BA.crema);
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(800, 120, 520, 74, 81, 'front')}${bld}${bulbs}${baLamp(980, fl, 1)}${baLamp(2150, fl, 1)}${stalls}
${mxCobbles(W, fl, H, 29, '#B59471', '#7A5C3E')}${scRect(0, fl - 8, W, 14, '#8E7358')}`, 'bt-back');
  const front = scSvg(W, H, '', 'bt-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M1800 0L2600 0L2000 ${H}L1200 ${H}Z" opacity=".5"/></g>`, 'bt-light');
  return { back, front, light, W, H, floor: fl, dance: { x0: 820, x1: 2200 } };
}

// ---------------------------------------------------------------- accessoires (papier decoupe) et couple de tango
/** Couple de tango en papier decoupe (SVG 260 x 420) : .ba-cp (tout), .ba-cp-m (lui, costume sombre + chapeau), .ba-cp-w (elle, robe rouge). opts : width, uid, w (couleur de la robe), m (couleur du costume). */
function baPareja(opts) {
  opts = opts || {};
  const W = opts.width || 260, dress = opts.w || '#D8352A', suit = opts.m || '#2A2A3A', skin1 = opts.skin1 || '#D9A07A', skin2 = opts.skin2 || '#E0AC84';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 420" width="${W}" height="${Math.round(W * 420 / 260)}" class="ba-cp" style="overflow:visible" aria-hidden="true">
<ellipse cx="130" cy="408" rx="104" ry="10" fill="#000" opacity=".2"/>
<g class="ba-cp-w"><path d="M168 222Q190 330 250 392L200 400Q150 380 128 300Z" fill="${shade(dress, -0.25)}"/><path d="M150 140Q146 100 176 96Q206 100 202 140L226 330Q210 372 152 384Q128 330 150 140Z" fill="${dress}"/><path d="M196 234Q226 330 222 388" stroke="${shade(dress, -0.3)}" stroke-width="5" fill="none" opacity=".6"/><path d="M178 252Q214 236 212 296Q190 276 178 252Z" fill="${shade(dress, 0.2)}" opacity=".45"/><path d="M212 372l30 22-12 8-30 -12Z" fill="#7A1C16"/><path d="M168 372l-22 26 12 6 24 -22Z" fill="#7A1C16"/><circle cx="176" cy="78" r="26" fill="${skin2}"/><path d="M148 74Q150 44 178 46Q206 48 204 76Q190 62 176 64Q160 62 148 74Z" fill="#1E120C"/><circle cx="172" cy="40" r="14" fill="#1E120C"/><circle cx="166" cy="82" r="3" fill="#2A160E"/><path d="M164 94Q174 100 184 92" stroke="#B02C2C" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M196 124Q150 112 118 132" stroke="${skin2}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M204 128Q238 112 232 82" stroke="${skin2}" stroke-width="12" fill="none" stroke-linecap="round"/></g>
<g class="ba-cp-m"><path d="M82 232L52 392L86 396L112 296L138 396L172 392L142 232Z" fill="${shade(suit, -0.1)}"/><path d="M42 392h50v14H36Z M122 392h52v14h-56Z" fill="#14141C"/><path d="M62 132Q56 112 96 108Q132 112 128 132L146 242Q96 262 60 242Z" fill="${suit}"/><path d="M92 112L96 168L104 112Z" fill="#F5E6C8"/><path d="M96 124l-8 20 8 70 8 -70Z" fill="#D8352A" opacity=".85"/><circle cx="100" cy="86" r="26" fill="${skin1}"/><path d="M70 74Q100 46 130 74Z" fill="#14141C"/><ellipse cx="100" cy="74" rx="38" ry="9" fill="#14141C"/><circle cx="108" cy="90" r="3" fill="#2A160E"/><path d="M96 102Q108 108 120 100" stroke="#8F3A2E" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M130 128Q176 116 188 92" stroke="${suit}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M128 140Q170 150 190 156" stroke="${suit}" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="188" cy="88" r="8" fill="${skin1}"/></g></svg>`;
}

/**
 * Accessoires de capsule / d'histoire. key : 'bandoneon' (400x300 ; .ba-bellows = soufflet, .ba-right = planche droite + boutons : translate x = 200*(s-1) quand le soufflet fait scaleX s, svgOrigin "100 150" ; .ba-glow = reflet vert),
 * 'mate' (calebasse + bombilla, 200x300), 'termo' (120x300), 'camiseta' (kind 'boca' = bleu + bande jaune | 'river' = blanc + bande rouge en diagonale ; 220x230, sans ecusson),
 * 'copa' (coupe doree 160x260), 'estadio' (stade en cuvette bleu / jaune 520x300), 'sello' (sceau de laurier generique 240x240), 'burbuja' (bulle de dialogue 360x200), 'banco' (banc 520x200).
 */
function baProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('bp'), g = (n) => `${id}-${n}`, W = opts.width || 240;
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round(W * h)}" class="ba-prop ba-${key}" style="overflow:visible" aria-hidden="true">${inner}</svg>`;
  if (key === 'bandoneon') {
    const folds = 14, x0 = 100, x1 = 300, fw = (x1 - x0) / folds;
    let bell = ''; for (let i = 0; i < folds; i++) bell += `<path d="M${r1(x0 + i * fw)} ${70 + (i % 2) * 6}L${r1(x0 + (i + 1) * fw)} 64V${236 - (i % 2) * 6 + 0}L${r1(x0 + i * fw)} 230Z" fill="${i % 2 ? '#2A2148' : '#4A3F7A'}"/><path d="M${r1(x0 + i * fw)} 150H${r1(x0 + (i + 1) * fw)}" stroke="#F5E6C8" stroke-width="2" opacity=".25"/>`;
    const btns = (bx) => { let b = ''; for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) b += `<circle cx="${bx + 20 + c * 20}" cy="${r1(86 + r * 28)}" r="7.5" fill="#F5E6C8"/><circle cx="${bx + 20 + c * 20}" cy="${r1(86 + r * 28)}" r="3" fill="#B8AF9A"/>`; return b; };
    return mk('0 0 400 300', 0.75, `<defs><radialGradient id="${g('gl')}"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".95"/><stop offset=".5" stop-color="#42E0A0" stop-opacity=".4"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs><ellipse cx="200" cy="284" rx="170" ry="12" fill="#000" opacity=".22"/>
<g class="ba-bellows">${bell}<ellipse class="ba-glow" cx="200" cy="150" rx="120" ry="90" fill="url(#${g('gl')})" opacity="0"/></g>
<g class="ba-left"><rect x="20" y="52" width="86" height="196" rx="14" fill="#1E1A24"/><rect x="26" y="58" width="74" height="184" rx="10" fill="#2E2836"/>${btns(14)}<rect x="14" y="48" width="12" height="204" rx="6" fill="#C9A24A"/></g>
<g class="ba-right"><rect x="294" y="52" width="86" height="196" rx="14" fill="#1E1A24"/><rect x="300" y="58" width="74" height="184" rx="10" fill="#2E2836"/>${btns(294)}<rect x="374" y="48" width="12" height="204" rx="6" fill="#C9A24A"/></g>`);
  }
  if (key === 'mate') {
    return mk('0 0 200 300', 1.5, `<ellipse cx="96" cy="286" rx="70" ry="9" fill="#000" opacity=".22"/><path d="M104 140L168 20" stroke="#C9CED6" stroke-width="9" stroke-linecap="round"/><path d="M100 150L166 26" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/><ellipse cx="170" cy="18" rx="14" ry="8" fill="#C9CED6" transform="rotate(-28 170 18)"/>
<path d="M32 130Q22 250 96 278Q170 250 160 130Z" fill="#8A5A32"/><path d="M32 130Q96 150 160 130L158 144Q96 164 34 144Z" fill="#C9CED6"/><ellipse cx="96" cy="128" rx="64" ry="18" fill="#C9CED6"/><ellipse cx="96" cy="128" rx="54" ry="13" fill="#5B8A3A"/><ellipse cx="86" cy="126" rx="26" ry="6" fill="#7BB04E" opacity=".8"/><path d="M52 160Q46 220 80 262" stroke="#B3804E" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/><path d="M60 230Q96 250 132 230" stroke="#C9CED6" stroke-width="7" fill="none"/>`);
  }
  if (key === 'termo') {
    return mk('0 0 120 300', 2.5, `<rect x="10" y="40" width="100" height="250" rx="22" fill="#2F6FD0"/><rect x="10" y="40" width="30" height="250" rx="14" fill="#fff" opacity=".18"/><rect x="18" y="10" width="84" height="48" rx="14" fill="#C9CED6"/><rect x="38" y="0" width="44" height="18" rx="6" fill="#9AA3B0"/><rect x="10" y="150" width="100" height="14" fill="#F2C14E"/><path d="M110 90Q146 110 110 190" stroke="#2A2A3A" stroke-width="10" fill="none" stroke-linecap="round"/>`);
  }
  if (key === 'camiseta') {
    const boca = opts.kind !== 'river', body = boca ? BA.blue : '#FFFFFF', band = boca ? BA.yel : BA.red;
    const bandP = boca ? `<path d="M40 100H180V150H40Z" fill="${band}"/>` : `<path d="M60 40L120 40L170 150L170 190L120 190L60 80Z" fill="${band}" clip-path="url(#${g('c')})"/>`;
    return mk('0 0 220 230', 1.05, `<defs><clipPath id="${g('c')}"><path d="M70 18Q110 46 150 18L206 56L180 108L164 98V214H56V98L40 108L14 56Z"/></clipPath></defs><path d="M70 18Q110 46 150 18L206 56L180 108L164 98V214H56V98L40 108L14 56Z" fill="${body}"/><g clip-path="url(#${g('c')})">${bandP}</g><path d="M70 18Q110 46 150 18" stroke="${band}" stroke-width="10" fill="none"/><path d="M70 18Q110 46 150 18L206 56L180 108L164 98V214H56V98L40 108L14 56Z" fill="none" stroke="#14173F" stroke-width="4" stroke-linejoin="round" opacity=".5"/><path d="M164 98V214H130Z" fill="#000" opacity=".08"/>`);
  }
  if (key === 'copa') {
    return mk('0 0 160 260', 1.6, `<defs><linearGradient id="${g('c')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B9791E"/><stop offset=".4" stop-color="#FFE08A"/><stop offset="1" stop-color="#C9891E"/></linearGradient></defs><ellipse cx="80" cy="250" rx="58" ry="8" fill="#000" opacity=".22"/><rect x="34" y="214" width="92" height="34" rx="6" fill="#1E8F6A"/><rect x="34" y="214" width="92" height="8" fill="#0E5A40"/><path d="M52 214Q60 150 70 126Q36 112 34 70Q36 30 80 18Q124 30 126 70Q124 112 90 126Q100 150 108 214Z" fill="url(#${g('c')})"/><path d="M52 60Q62 38 82 34" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="80" cy="64" r="22" fill="#FFF3B0" opacity=".55"/>`);
  }
  if (key === 'estadio') {
    let seats = ''; for (let r = 0; r < 5; r++) seats += `<path d="M${60 + r * 20} ${120 - r * 14}H${460 - r * 20}" stroke="#14173F" stroke-width="3" opacity=".35"/>`;
    let crowd = ''; for (let i = 0; i < 38; i++) crowd += `<circle cx="${r1(70 + i * 10.5)}" cy="${r1(106 - (i % 5) * 14)}" r="4.5" fill="${['#FFC83D', '#2F6FD0', '#F5E6C8'][i % 3]}"/>`;
    return mk('0 0 520 300', 0.58, `<ellipse cx="260" cy="280" rx="240" ry="14" fill="#000" opacity=".2"/><path d="M20 250V90Q20 30 90 30H430Q500 30 500 90V250Z" fill="#2F6FD0"/><path d="M20 250V170H500V250Z" fill="#1D4FA8"/><path d="M20 120H500V150H20Z" fill="#F2C14E"/><path d="M50 250V130H470V250Z" fill="#1E8F6A"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${50 + i * 60} 250V130" stroke="#0E5A40" stroke-width="3" opacity=".4"/>`).join('')}<path d="M50 62H470" stroke="#fff" stroke-width="6" opacity=".4"/><path d="M80 30V12H440V30" fill="#C9CED6"/>${seats}${crowd}<ellipse cx="260" cy="250" rx="150" ry="22" fill="#2C8F58"/><ellipse cx="260" cy="250" rx="150" ry="22" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`);
  }
  if (key === 'sello') {
    let leaves = ''; for (let i = 0; i < 10; i++) { const a = 0.55 + i * 0.22; for (const s of [-1, 1]) { const px = 120 + s * Math.sin(a) * 78, py = 130 + Math.cos(a) * 78 - 10; leaves += `<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="15" ry="7" fill="${i % 2 ? '#1E8F6A' : '#2C8F58'}" transform="rotate(${r1(s * (a * 57 - 90) + 90 * (s > 0 ? 1 : -1) * 0)} ${r1(px)} ${r1(py)})"/>`; } }
    return mk('0 0 240 240', 1, `<circle cx="120" cy="120" r="112" fill="#F5E6C8"/><circle cx="120" cy="120" r="100" fill="#14173F"/><circle cx="120" cy="120" r="92" fill="none" stroke="#FFC83D" stroke-width="3" stroke-dasharray="4 7"/>${leaves}<path d="M120 62l10 22h24l-19 15 7 24-22 -14 -22 14 7 -24 -19 -15h24Z" fill="#FFC83D"/><rect x="82" y="148" width="76" height="12" rx="6" fill="#F5E6C8" opacity=".5"/>`);
  }
  if (key === 'burbuja') {
    const c = opts.c || '#FFF1D6';
    return mk('0 0 360 200', 0.56, `<path d="M40 14H320Q350 14 350 44V120Q350 150 320 150H190L130 190L146 150H40Q10 150 10 120V44Q10 14 40 14Z" fill="${c}"/><path d="M40 14H320Q350 14 350 44V120Q350 150 320 150H190L130 190L146 150H40Q10 150 10 120V44Q10 14 40 14Z" fill="none" stroke="#14173F" stroke-width="5" opacity=".6"/>`);
  }
  if (key === 'balon') {
    return mk('0 0 100 100', 1, `<circle cx="50" cy="50" r="46" fill="#FFFDF4"/><path d="M50 30L68 43L61 64H39L32 43Z" fill="#1E1E2A"/><path d="M50 4V30M68 43L94 36M61 64L76 86M39 64L24 86M32 43L6 36" stroke="#1E1E2A" stroke-width="4" fill="none"/><circle cx="50" cy="50" r="46" fill="none" stroke="#1E1E2A" stroke-width="4"/><path d="M20 24Q34 10 52 8" stroke="#fff" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>`);
  }
  if (key === 'nota') {
    const c = opts.c || '#FFC83D';
    return mk('0 0 60 90', 1.5, `<ellipse cx="18" cy="70" rx="15" ry="11" fill="${c}" transform="rotate(-20 18 70)"/><path d="M30 66V12L54 26Q50 40 36 34" fill="${c}"/><path d="M30 66V12" stroke="${c}" stroke-width="5"/>`);
  }
  if (key === 'paraguas') {
    return mk('0 0 300 260', 0.87, `<path d="M150 70V250" stroke="#8A5A32" stroke-width="9" stroke-linecap="round"/><path d="M10 120Q20 30 150 14Q280 30 290 120Q256 98 220 120Q184 98 150 120Q116 98 80 120Q44 98 10 120Z" fill="#E5638A"/><path d="M150 14Q120 60 116 106Q132 112 150 120Z M150 14Q180 60 184 106Q168 112 150 120Z" fill="#FFFDF4"/><path d="M150 14V4" stroke="#8A5A32" stroke-width="6"/>`);
  }
  if (key === 'banco') {
    return mk('0 0 520 200', 0.385, `<ellipse cx="260" cy="190" rx="240" ry="10" fill="#000" opacity=".22"/><rect x="20" y="40" width="480" height="22" rx="8" fill="#8A5A32"/><rect x="20" y="76" width="480" height="22" rx="8" fill="#8A5A32"/><rect x="14" y="118" width="492" height="26" rx="9" fill="#A8703E"/><rect x="40" y="144" width="22" height="46" fill="#2A2A3A"/><rect x="458" y="144" width="22" height="46" fill="#2A2A3A"/><rect x="40" y="30" width="22" height="116" fill="#2A2A3A"/><rect x="458" y="30" width="22" height="116" fill="#2A2A3A"/>`);
  }
  return '';
}

// ---------------------------------------------------------------- Argentine en papier decoupe (+ Uruguay et estuaire du Rio de la Plata)
const BA_ARG = [[-69, -22.8], [-65, -22.1], [-62.4, -22.2], [-60, -24.2], [-58.2, -27.3], [-55.8, -27.4], [-54.6, -25.6], [-54.2, -27.3], [-55.8, -28.5], [-57.6, -30.2], [-58.2, -32.4], [-58.4, -33.9], [-58.4, -34.4], [-57.0, -36.0], [-57.5, -38.0], [-62.0, -39.0], [-62.9, -41.0], [-63.6, -42.5], [-65.2, -44.8], [-67.5, -46.5], [-66.0, -47.8], [-68.5, -50.2], [-68.4, -52.4], [-67.0, -54.0], [-65.2, -54.8], [-68.6, -55.0], [-68.7, -54.0], [-69.5, -52.0], [-72.3, -51.0], [-72.1, -48.0], [-71.6, -44.0], [-71.7, -41.0], [-71.0, -37.5], [-70.4, -35.0], [-70.0, -32.0], [-69.8, -29.0], [-68.3, -26.5], [-67.0, -23.0]];
const BA_URY = [[-57.6, -30.2], [-55.5, -30.9], [-53.4, -33.7], [-53.5, -34.4], [-54.9, -34.9], [-56.4, -34.9], [-57.9, -34.5], [-58.4, -33.9], [-58.2, -32.4]];
const BA_RIO = [[-58.5, -33.4], [-58.1, -34.3], [-56.6, -36.4], [-54.2, -36.2], [-54.2, -34.6], [-56.4, -34.9], [-58, -34.2]];
const baGeo = (lon, lat) => [r1((lon + 74) * 17), r1((-lat - 21) * 19)];
const baPoly = (pts) => 'M' + pts.map((p) => baGeo(p[0], p[1]).join(' ')).join('L') + 'Z';
/** Argentine (viewBox 0 0 420 680), Uruguay voisin et estuaire. .ba-arg (pays), .ba-ury, .ba-rio (estuaire), .ba-bsas / .ba-mvd (points, centre en (cx,cy) via data-px/py). opts : width, view (viewBox, defaut tout), uid. */
function baArgentina(opts) {
  opts = opts || {};
  const W = opts.width || 420, view = opts.view || '0 0 420 680', vb = view.split(' ').map(Number), H = Math.round((W * vb[3]) / vb[2]);
  const bs = baGeo(-58.4, -34.6), mv = baGeo(-56.2, -34.9);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${W}" height="${H}" class="ba-map" style="overflow:visible" aria-hidden="true"><path class="ba-rio" d="${baPoly(BA_RIO)}" fill="#B88A62" opacity=".9"/><path class="ba-ury" d="${baPoly(BA_URY)}" fill="#3B44A8" stroke="#6A72D8" stroke-width="3" stroke-linejoin="round"/><path class="ba-arg" d="${baPoly(BA_ARG)}" fill="#19B7AA" stroke="#F5E6C8" stroke-width="5" stroke-linejoin="round"/><path d="${baPoly(BA_ARG)}" fill="none" stroke="#0E7F82" stroke-width="14" stroke-linejoin="round" opacity=".25" transform="translate(4 6)"/><circle class="ba-bsas" cx="${bs[0]}" cy="${bs[1]}" r="13" fill="#FFC83D" stroke="#fff" stroke-width="4" data-px="${bs[0]}" data-py="${bs[1]}"/><circle class="ba-mvd" cx="${mv[0]}" cy="${mv[1]}" r="13" fill="#F5E6C8" stroke="#fff" stroke-width="4" data-px="${mv[0]}" data-py="${mv[1]}"/></svg>`;
}

// ---------------------------------------------------------------- decors de Cusco / Andes (unite 10) : panorama dore, Plaza de Armas, escalinata de l'eglise, murs incas,
// vue sur les montagnes (point vert de Machu Picchu), sommet de Machu Picchu a l'aube (finale), carte du Perou, accessoires de capsule, lama, condor.
// Memes conventions que 10-salamanca.js / 12-mexico.js : calques separes, aucun texte, monuments publics simplifies, aucune marque.
// Prefixe `cu` pour les helpers internes ; exports : cuscoSkyline, plazaDeArmas, escalinata, murosIncas, andesVista, machuPicchu, peruMap, cuProp, cuLlama, cuCondor.

const CU = {
  roof: '#B8442F', roof2: '#D2603A', roof3: '#8E2F22', wall: '#F3E4C8', wall2: '#E4CDA2', wall3: '#D2B88A', wood: '#6B4A32', wood2: '#8A5E3C',
  stone: '#A8947E', stone2: '#8C7A68', stone3: '#6B5A4B', stone4: '#C4B09A', cath: '#C2AE92', cath2: '#9A8670', cath3: '#7A6853',
  mt1: '#5B3C8C', mt2: '#7A55A8', mt3: '#9B78C4', mt4: '#B79BD8', grass: '#6FA24A', grass2: '#4F8238', grass3: '#8DBF5A', gold: '#FFC24A', leaf: '#3F8A52', leaf2: '#2C6B3F',
  mag: '#D93472', ora: '#F59F00', turq: '#12A594',
};

/** Ligne de crete : de x=0 a W, ligne de base y, amplitude amp, graine (path ferme jusqu'a baseY). */
function cuRidge(W, y, amp, seed, step, baseY) {
  const rnd = rng(seed); let d = `M0 ${baseY}L0 ${r1(y)}`;
  for (let x = step; x <= W + step; x += step) d += `L${r1(x)} ${r1(y - amp * (0.2 + rnd() * 0.8) * (0.6 + 0.4 * Math.sin(x / 520 + seed)))}`;
  return d + `L${W} ${baseY}Z`;
}
/** Pavage de pierre (rangees en perspective legere). */
function cuCobbles(W, y0, y1, seed, c1, c2) {
  const rnd = rng(seed); let s = scRect(0, y0, W, y1 - y0, c1);
  for (let y = y0 + 6, row = 0; y < y1; y += 24 + row * 3.4, row++) {
    const h = 22 + row * 3, off = (row % 2) * 30;
    s += `<path d="M0 ${r1(y)}H${W}" stroke="${c2}" stroke-width="3" opacity=".5"/>`;
    for (let x = -off; x < W; x += 60 + rnd() * 34 + row * 4) s += `<path d="M${r1(x)} ${r1(y)}v${r1(h)}" stroke="${c2}" stroke-width="3" opacity=".42"/>`;
  }
  return s;
}
/** Maison coloniale : mur blanchi, toit de tuiles rouges, fenetres, balcon de bois. */
function cuHouse(x, base, w, h, seed, opts) {
  opts = opts || {};
  const rnd = rng(seed), wall = opts.wall || [CU.wall, CU.wall2, CU.wall3][seed % 3], top = base - h;
  let s = `<g class="cu-house">${scRect(x, top, w, h, wall)}${scRect(x, top, w, 10, shade(wall, -0.08))}${scRect(x + w - 16, top, 16, h, '#000', 'opacity=".07"')}`;
  s += `<path d="M${r1(x - 14)} ${r1(top + 6)}L${r1(x + 22)} ${r1(top - 44)}H${r1(x + w - 22)}L${r1(x + w + 14)} ${r1(top + 6)}Z" fill="${CU.roof}"/><path d="M${r1(x - 14)} ${r1(top + 6)}L${r1(x + 22)} ${r1(top - 44)}H${r1(x + w - 22)}L${r1(x + w + 14)} ${r1(top + 6)}" fill="none" stroke="${CU.roof3}" stroke-width="5"/>`;
  for (let i = 1; i < 6; i++) s += `<path d="M${r1(x - 10 + i * (w / 6))} ${r1(top - 40)}l-${r1(8 - i)} 44" stroke="${CU.roof3}" stroke-width="3" opacity=".5"/>`;
  const cols = Math.max(1, Math.floor(w / 90));
  for (let i = 0; i < cols; i++) {
    const cx = x + (w / cols) * (i + 0.5), wy = top + h * 0.28;
    s += `<rect x="${r1(cx - 17)}" y="${r1(wy)}" width="34" height="${r1(h * 0.3)}" rx="4" fill="${rnd() < 0.5 ? '#FFD98A' : '#5A4A6A'}"/><path d="M${r1(cx - 17)} ${r1(wy + h * 0.15)}h34M${r1(cx)} ${r1(wy)}v${r1(h * 0.3)}" stroke="${CU.wood}" stroke-width="3"/>`;
  }
  if (opts.balcony !== false && h > 150) s += `<rect x="${r1(x + 8)}" y="${r1(top + h * 0.5)}" width="${r1(w - 16)}" height="${r1(h * 0.18)}" rx="4" fill="${CU.wood2}"/><path d="M${r1(x + 8)} ${r1(top + h * 0.5)}h${r1(w - 16)}" stroke="${CU.wood}" stroke-width="6"/>${Array.from({ length: Math.floor(w / 22) }, (_, i) => `<path d="M${r1(x + 18 + i * 22)} ${r1(top + h * 0.5 + 4)}v${r1(h * 0.14)}" stroke="${CU.wood}" stroke-width="4"/>`).join('')}`;
  const dx = x + w * (0.3 + rnd() * 0.4);
  s += `<path d="M${r1(dx - 22)} ${base}V${r1(base - 78)}Q${r1(dx)} ${r1(base - 104)} ${r1(dx + 22)} ${r1(base - 78)}V${base}Z" fill="${CU.wood}"/>`;
  return s + '</g>';
}
/** Cathedrale de Cusco (simplifiee) : facade large, deux tours carrees a clochers, portail a arcs, fenetres. x = centre. */
function cuCathedral(x, base, k, tone) {
  const c = tone || CU.cath, c2 = shade(c, -0.18), c3 = shade(c, -0.34), W = 760 * k, H = 250 * k, x0 = x - W / 2, tw = 150 * k, th = 400 * k;
  const tower = (tx) => `${scRect(tx, base - th, tw, th, c)}${scRect(tx + tw - 20 * k, base - th, 20 * k, th, '#000', 'opacity=".1"')}${scRect(tx - 8 * k, base - th + 150 * k, tw + 16 * k, 12 * k, c2)}${scRect(tx - 8 * k, base - th, tw + 16 * k, 14 * k, c2)}
<path d="M${r1(tx + tw * 0.2)} ${r1(base - th + 130 * k)}V${r1(base - th + 50 * k)}Q${r1(tx + tw / 2)} ${r1(base - th + 8 * k)} ${r1(tx + tw * 0.8)} ${r1(base - th + 50 * k)}V${r1(base - th + 130 * k)}Z" fill="${c3}"/>
<path d="M${r1(tx - 8 * k)} ${r1(base - th)}Q${r1(tx + tw / 2)} ${r1(base - th - 96 * k)} ${r1(tx + tw + 8 * k)} ${r1(base - th)}Z" fill="${c2}"/><path d="M${r1(tx + tw / 2)} ${r1(base - th - 90 * k)}v${r1(-26 * k)}M${r1(tx + tw / 2 - 12 * k)} ${r1(base - th - 106 * k)}h${r1(24 * k)}" stroke="${c3}" stroke-width="${r1(6 * k)}"/>
<rect x="${r1(tx + tw * 0.25)}" y="${r1(base - th + 210 * k)}" width="${r1(tw * 0.5)}" height="${r1(70 * k)}" rx="${r1(tw * 0.25)}" fill="${c3}"/>`;
  let s = `<g class="cu-cath">${scRect(x0 + tw * 0.7, base - H, W - tw * 1.4, H, c)}${scRect(x0 + tw * 0.7, base - H, W - tw * 1.4, 14 * k, c2)}${tower(x0)}${tower(x0 + W - tw)}`;
  const cx = x, pw = 230 * k;
  s += `<path d="M${r1(cx - pw / 2)} ${r1(base - H)}V${r1(base - H - 100 * k)}L${r1(cx)} ${r1(base - H - 150 * k)}L${r1(cx + pw / 2)} ${r1(base - H - 100 * k)}V${r1(base - H)}Z" fill="${c2}"/><circle cx="${r1(cx)}" cy="${r1(base - H - 84 * k)}" r="${r1(26 * k)}" fill="${c3}"/>`;
  [-1, 0, 1].forEach((i) => { const ax = cx + i * 110 * k, aw = i === 0 ? 70 * k : 52 * k; s += `<path d="M${r1(ax - aw / 2)} ${base}V${r1(base - 120 * k)}Q${r1(ax)} ${r1(base - 120 * k - aw * 0.8)} ${r1(ax + aw / 2)} ${r1(base - 120 * k)}V${base}Z" fill="${c3}"/><path d="M${r1(ax - aw / 2 - 8 * k)} ${base}V${r1(base - 124 * k)}Q${r1(ax)} ${r1(base - 124 * k - aw * 0.9)} ${r1(ax + aw / 2 + 8 * k)} ${r1(base - 124 * k)}V${base}" fill="none" stroke="${c2}" stroke-width="${r1(8 * k)}"/>`; });
  [-2, 2].forEach((i) => { const ax = cx + i * 108 * k; s += `<rect x="${r1(ax - 18 * k)}" y="${r1(base - 150 * k)}" width="${r1(36 * k)}" height="${r1(64 * k)}" rx="${r1(18 * k)}" fill="${c3}"/>`; });
  return s + '</g>';
}
/** Mur inca : pierres polygonales ajustees, rangees de hauteur variable ; opts.door = { x, w, h } (porte trapezoidale), opts.tone. */
function cuIncaWall(x, base, w, h, seed, opts) {
  opts = opts || {};
  const rnd = rng(seed), tones = opts.tones || [CU.stone, CU.stone2, CU.stone4, '#9A8672', '#B5A18A'], door = opts.door;
  let s = `<g class="cu-wall">` + scRect(x, base - h, w, h, CU.stone3);
  let y = base;
  while (y > base - h + 8) {
    const rh = Math.min(y - (base - h), 62 + rnd() * 34); let cx = x - rnd() * 40;
    while (cx < x + w) {
      const sw = 90 + rnd() * 120, a = (rnd() - 0.5) * 8, b = (rnd() - 0.5) * 8;
      const x1 = Math.max(x, cx), x2 = Math.min(x + w, cx + sw);
      if (x2 - x1 > 10 && !(door && x1 >= door.x - 4 && x2 <= door.x + door.w + 4)) {
        const c = tones[Math.floor(rnd() * tones.length)];
        s += `<path d="M${r1(x1 + 3)} ${r1(y - 2 + a)}L${r1(x2 - 3)} ${r1(y - 2 + b)}L${r1(x2 - 2)} ${r1(y - rh + 3 + a)}L${r1(x1 + 2)} ${r1(y - rh + 3 + b)}Z" fill="${c}"/><path d="M${r1(x1 + 6)} ${r1(y - rh + 8 + b)}L${r1(x2 - 8)} ${r1(y - rh + 8 + a)}" stroke="#fff" stroke-width="3" opacity=".18"/><path d="M${r1(x1 + 4)} ${r1(y - 4 + a)}L${r1(x2 - 4)} ${r1(y - 4 + b)}" stroke="#000" stroke-width="4" opacity=".16"/>`;
      }
      cx += sw;
    }
    y -= rh;
  }
  if (door) {
    const d = door, tw = d.w * 0.22;
    s += `<path d="M${r1(d.x)} ${base}L${r1(d.x + tw)} ${r1(base - d.h)}H${r1(d.x + d.w - tw)}L${r1(d.x + d.w)} ${base}Z" fill="#1B1426"/><path d="M${r1(d.x)} ${base}L${r1(d.x + tw)} ${r1(base - d.h)}H${r1(d.x + d.w - tw)}L${r1(d.x + d.w)} ${base}" fill="none" stroke="${CU.stone4}" stroke-width="12" stroke-linejoin="round"/>`;
  }
  return s + '</g>';
}
/** Eucalyptus / arbre rond. */
function cuTree(x, base, k, c1, c2) {
  c1 = c1 || CU.leaf; c2 = c2 || CU.leaf2;
  return `<g class="cu-tree"><path d="M${r1(x)} ${base}V${r1(base - 170 * k)}" stroke="#5A4034" stroke-width="${r1(16 * k)}" stroke-linecap="round"/>${[[0, -230, 70], [-50, -190, 56], [50, -196, 58], [-14, -280, 52], [30, -250, 48]].map((b, i) => `<circle cx="${r1(x + b[0] * k)}" cy="${r1(base + b[1] * k)}" r="${r1(b[2] * k)}" fill="${i % 2 ? c1 : c2}"/>`).join('')}</g>`;
}

/** Lama (SVG 200 x 220, regarde a droite). opts : width, body, blanket, uid. Classes : cu-ll-head (tete+cou), cu-ll-tail. */
function cuLlama(opts) {
  opts = opts || {};
  const W = opts.width || 200, body = opts.body || '#EAD9BC', sh = shade(body, -0.16), bl = opts.blanket || CU.mag;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="${W}" height="${r1(W * 1.1)}" class="cu-llama" style="overflow:visible" aria-hidden="true">
<ellipse cx="96" cy="212" rx="64" ry="7" fill="#000" opacity=".22"/>
<g fill="${sh}"><rect x="52" y="140" width="15" height="68" rx="6"/><rect x="118" y="140" width="15" height="68" rx="6"/></g>
<g fill="${body}"><rect x="40" y="140" width="16" height="70" rx="6"/><rect x="106" y="140" width="16" height="70" rx="6"/></g>
<path class="cu-ll-tail" d="M34 100q-16 -4 -14 12q6 6 18 -2Z" fill="${body}"/>
<ellipse cx="88" cy="112" rx="58" ry="40" fill="${body}"/><ellipse cx="94" cy="130" rx="46" ry="22" fill="${sh}" opacity=".25"/>
<path d="M54 84Q88 66 124 84L130 122Q88 138 48 122Z" fill="${bl}"/><path d="M54 98Q88 82 128 98M52 110Q88 94 130 110" stroke="${CU.ora}" stroke-width="5" fill="none"/><path d="M60 88l6 -10 6 10M92 80l6 -10 6 10" stroke="#FFFDF4" stroke-width="4" fill="none"/>
<g class="cu-ll-head"><path d="M118 100Q142 92 148 50Q150 36 158 36L170 40Q172 54 164 74Q158 116 138 128Z" fill="${body}"/><ellipse cx="164" cy="38" rx="20" ry="16" fill="${body}"/><ellipse cx="176" cy="42" rx="11" ry="9" fill="${shade(body, -0.1)}"/><circle cx="170" cy="32" r="4.4" fill="#2A160E"/><circle cx="171" cy="30.6" r="1.4" fill="#fff"/><path d="M148 24q-6 -22 2 -24q8 2 6 22Z" fill="${body}"/><path d="M158 24q0 -22 8 -22q6 4 -2 24Z" fill="${body}"/><circle cx="149" cy="14" r="5" fill="${CU.mag}"/><circle cx="163" cy="12" r="5" fill="${CU.turq}"/><path d="M176 48q4 2 8 0" stroke="#2A160E" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>`;
}
/** Condor des Andes (SVG 460 x 200, vu de face/dessous, ailes deployees a doigts de plumes). Classes : cu-cd-wingL / cu-cd-wingR (pivot = epaule), cu-cd-body. */
function cuCondor(opts) {
  opts = opts || {};
  const W = opts.width || 460, blk = '#1F1B2E', blk2 = '#34304A';
  const wing = (s) => {
    const m = (x) => 230 + s * (x - 230);
    let f = ''; for (let i = 0; i < 7; i++) f += `<path d="M${m(246 + i * 28)} ${88 + i * 4}q${s * 6} 56 ${s * -8} ${74 - i * 3}q${s * -16} -34 ${s * -20} -74Z" fill="${i % 2 ? blk2 : blk}"/>`;
    return `<g class="cu-cd-wing${s > 0 ? 'R' : 'L'}" data-px="230" data-py="78"><path d="M${m(246)} 70Q${m(320)} 54 ${m(420)} 84L${m(452)} 100Q${m(330)} 100 ${m(246)} 108Z" fill="${blk}"/><path d="M${m(300)} 72Q${m(360)} 66 ${m(420)} 86" stroke="#F5E6C8" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>${f}</g>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="${W}" height="${r1(W * 200 / 460)}" class="cu-condor" style="overflow:visible" aria-hidden="true">${wing(-1)}${wing(1)}
<g class="cu-cd-body"><path d="M214 70Q230 62 246 70L252 130Q230 150 208 130Z" fill="${blk}"/><path d="M210 128Q230 176 250 128Q230 142 210 128Z" fill="${blk2}"/><ellipse cx="230" cy="74" rx="26" ry="9" fill="#FFFDF4"/><ellipse cx="230" cy="58" rx="13" ry="16" fill="#C98A8A"/><path d="M230 52q-12 4 -10 -10q10 -10 20 0q2 14 -10 10Z" fill="#8F4F5A"/><path d="M226 66q4 8 8 0" stroke="${blk}" stroke-width="4" fill="none"/><circle cx="224" cy="54" r="2.4" fill="#2A160E"/><circle cx="236" cy="54" r="2.4" fill="#2A160E"/></g></svg>`;
}

// ---------------------------------------------------------------- panorama de Cusco a l'heure doree (3200 x 1200)
const CUSCO = { W: 3200, H: 1200, street: 800 };
function cuscoSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('cu'), g = (n) => `${id}-${n}`, W = CUSCO.W, H = CUSCO.H, rnd = rng(opts.seed || 63), street = CUSCO.street;
  let clouds = ''; [[380, 250, 600, 80], [1300, 170, 660, 90], [2000, 330, 520, 74], [2750, 210, 640, 88]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 90 + i * 5, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2A78"/><stop offset=".3" stop-color="#7A4FA6"/><stop offset=".5" stop-color="#E88AA0"/><stop offset=".64" stop-color="#FFB871"/><stop offset=".74" stop-color="#FFD98A"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'cu-sky');
  const sx = opts.sunX || 1850, sy = opts.sunY || 600;
  let rays = ''; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, a2 = a + Math.PI / 40; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1500)} ${r1(sy + Math.sin(a) * 1500)}L${r1(sx + Math.cos(a2) * 1500)} ${r1(sy + Math.sin(a2) * 1500)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFC24A" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A47" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFE9A8" opacity=".1" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="420" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="64" fill="#FFF3C4"/>`, 'cu-sun');
  // lointain : trois cretes violettes, un pic haut dont le sommet est cache par un nuage (Machu Picchu)
  const mpX = 2480;
  const far = scSvg(W, H, `<path d="${cuRidge(W, 640, 170, 3, 90, 860)}" fill="${CU.mt4}" opacity=".7"/><path d="${cuRidge(W, 690, 190, 5, 80, 860)}" fill="${CU.mt3}" opacity=".85"/>
<path d="M${mpX - 260} 860L${mpX - 120} 520L${mpX - 40} 470L${mpX + 20} 330L${mpX + 70} 480L${mpX + 150} 540L${mpX + 280} 860Z" fill="#4B2F80"/><path d="M${mpX + 20} 330L${mpX + 70} 480L${mpX + 40} 560L${mpX} 470Z" fill="#33205F" opacity=".8"/>
<g class="cu-mpcloud">${cloudSvg(mpX + 10, 360, 380, 70, 71, 'dusk')}${cloudSvg(mpX + 90, 330, 260, 54, 72, 'dusk')}</g>
<path d="${cuRidge(W, 740, 120, 9, 70, 860)}" fill="${CU.mt1}"/>${scRect(0, street - 2, W, 14, '#8E4A52')}`, 'cu-far');
  // milieu : cathedrale, Plaza de Armas, maisons a toits rouges, mur inca, colline en terrasses a droite
  let houses = '', x = -30, k = 0;
  while (x < W) {
    if (x > 760 && x < 1460) { x = 1460; continue; }                  // trou : la cathedrale
    if (x > 2250 && x < 3000) { x = 3000; continue; }                 // trou : la colline
    const w = 150 + rnd() * 110, h = 150 + rnd() * 120;
    houses += cuHouse(x, street, w, h, 20 + k++, { balcony: rnd() < 0.7 });
    if (rnd() < 0.3) houses += cuTree(x + w + 18, street, 0.5 + rnd() * 0.3);
    x += w + 14;
  }
  let hill = `M2180 ${street}L2380 640L2620 540L2900 470L3200 440V${street}Z`; let terr = '';
  for (let i = 0; i < 6; i++) { const ty = 700 - i * 38; terr += `<path d="M${2300 + i * 110} ${ty + 52}Q${2700 + i * 40} ${ty - 16} ${3200} ${ty - 26}V${ty + 8}Q${2700 + i * 40} ${ty + 20} ${2300 + i * 110} ${ty + 70}Z" fill="${i % 2 ? CU.grass2 : CU.grass}"/><path d="M${2300 + i * 110} ${ty + 70}Q${2700 + i * 40} ${ty + 20} 3200 ${ty + 8}" stroke="${CU.stone2}" stroke-width="7" fill="none"/>`; }
  let hh = ''; [[2450, 700], [2640, 640], [2820, 590], [3000, 540]].forEach((p, i) => { hh += cuHouse(p[0], p[1], 120, 110, 40 + i, { balcony: false }); });
  const mid = scSvg(W, H, `${cuIncaWall(-20, street + 6, 330, 210, 11, { door: { x: 60, w: 110, h: 150 } })}${houses}${cuCathedral(1110, street, 1.0)}<path d="${hill}" fill="${CU.grass2}"/>${terr}${hh}${cuTree(2210, street, 0.9)}${scRect(0, street, W, 400, '#B58A60')}${scRect(0, street + 38, W, 5, '#fff', 'opacity=".25"')}`, 'cu-mid');
  // premier plan : rue pavee, lamas, eucalyptus en surplomb, muret
  const near = scSvg(W, H, `${cuCobbles(W, 880, 1200, 17, '#A98A6A', '#6F5438')}${scRect(0, 868, W, 16, '#8E7358')}${scRect(0, 868, W, 5, '#fff', 'opacity=".3"')}
<g transform="translate(540 600) scale(1.4)">${cuLlama({ width: 200 }).replace(/^<svg[^>]*>/, '<g>').replace(/<\/svg>$/, '</g>')}</g>
<g transform="translate(900 640) scale(1.2)">${cuLlama({ width: 200, body: '#8A6A4A', blanket: CU.turq }).replace(/^<svg[^>]*>/, '<g>').replace(/<\/svg>$/, '</g>')}</g>
<g transform="translate(-60 -40)"><path d="M0 60Q240 30 470 170" stroke="#5A4034" stroke-width="28" fill="none" stroke-linecap="round"/>${[[110, 80, 80], [250, 114, 70], [350, 168, 60], [60, 140, 66], [210, 182, 58]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${[CU.leaf, CU.leaf2, '#5BA060'][i % 3]}"/>`).join('')}</g>
<g transform="translate(2680 -30)"><path d="M520 40Q320 30 100 180" stroke="#5A4034" stroke-width="28" fill="none" stroke-linecap="round"/>${[[400, 90, 74], [280, 140, 66], [170, 180, 58], [470, 140, 56]].map((b, i) => `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${[CU.leaf, CU.leaf2, '#5BA060'][i % 3]}"/>`).join('')}</g>`, 'cu-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy, mp: { x: mpX + 20, y: 330 } };
}

// ---------------------------------------------------------------- Plaza de Armas (3200 x 1200) : decor de scene
const PLAZA_ARMAS = { W: 3200, H: 1200, floor: 930, cath: 1900, fountain: 1200 };
/** Retourne { back, front, light, W, H, floor, cath, fountain }. */
function plazaDeArmas(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pa'), g = (n) => `${id}-${n}`, W = PLAZA_ARMAS.W, H = PLAZA_ARMAS.H, fl = PLAZA_ARMAS.floor, rnd = rng(opts.seed || 64);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3F86D6"/><stop offset=".42" stop-color="#8CC4EA"/><stop offset=".75" stop-color="#FFE2B0"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  let arcade = '', x = -80, k = 0;
  while (x < W) {
    if (x > 1360 && x < 2440) { x = 2440; continue; }
    const w = 230 + rnd() * 100, h = 250 + rnd() * 80;
    arcade += cuHouse(x, fl - 40, w, h, 30 + k++, {});
    x += w + 10;
  }
  let arches = ''; for (let ax = 0; ax < 1300; ax += 120) arches += `<path d="M${ax + 14} ${fl - 40}V${fl - 130}Q${ax + 60} ${fl - 175} ${ax + 106} ${fl - 130}V${fl - 40}Z" fill="#3A2A22"/>`;
  const fx = PLAZA_ARMAS.fountain;
  const fountain = `<g class="cu-fountain"><ellipse cx="${fx}" cy="${fl + 70}" rx="190" ry="36" fill="${CU.stone2}"/><ellipse cx="${fx}" cy="${fl + 58}" rx="176" ry="30" fill="${CU.stone4}"/><ellipse cx="${fx}" cy="${fl + 54}" rx="150" ry="24" fill="#5FB7C9"/><path d="M${fx - 26} ${fl + 56}V${fl - 70}Q${fx} ${fl - 90} ${fx + 26} ${fl - 70}V${fl + 56}Z" fill="${CU.stone}"/><ellipse cx="${fx}" cy="${fl - 70}" rx="70" ry="14" fill="${CU.stone4}"/><ellipse cx="${fx}" cy="${fl - 72}" rx="54" ry="9" fill="#5FB7C9"/>${[-46, -20, 0, 20, 46].map((o, i) => `<path class="pa-jet" d="M${fx} ${fl - 110 + Math.abs(o) * 0.4}Q${fx + o * 1.2} ${fl - 170 + Math.abs(o)} ${fx + o * 2} ${fl - 82}" stroke="#D8F3FF" stroke-width="5" fill="none" opacity=".85" stroke-linecap="round"/>`).join('')}</g>`;
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(600, 150, 520, 74, 85, 'front')}${cloudSvg(2500, 120, 600, 84, 87, 'front')}
<path d="${cuRidge(W, 520, 150, 4, 90, fl)}" fill="${CU.mt3}"/><path d="${cuRidge(W, 600, 120, 8, 80, fl)}" fill="${CU.mt2}"/>
${cuCathedral(PLAZA_ARMAS.cath, fl - 30, 1.5)}${arcade}${arches}${cuTree(1320, fl - 10, 1.2)}${cuTree(2480, fl - 10, 1.3)}${cuTree(3120, fl - 10, 1.1)}
${cuCobbles(W, fl - 40, H, 29, '#B59471', '#7A5C3E')}${scRect(0, fl - 48, W, 14, '#8E7358')}${fountain}`, 'pa-back');
  const front = scSvg(W, H, [60, 3040].map((fx2) => `<g>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${fx2 + i * 34}" cy="${H - 40 + (i % 2) * 8}" r="${24 + (i % 3) * 5}" fill="${[CU.leaf, CU.grass3, CU.leaf2][i % 3]}"/>`).join('')}${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${fx2 - 10 + i * 30}" cy="${H - 62 + (i % 3) * 10}" r="9" fill="${[CU.mag, CU.ora, '#FFFDF4'][i % 3]}"/>`).join('')}</g>`).join(''), 'pa-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M2300 0L2900 0L2200 ${H}L1400 ${H}Z" opacity=".5"/></g>`, 'pa-light');
  return { back, front, light, W, H, floor: fl, cath: PLAZA_ARMAS.cath, fountain: fx };
}

// ---------------------------------------------------------------- escalinata de l'eglise (3200 x 1200) : Don Huaman et les enfants sur les marches
const ESCAL = { W: 3200, H: 1200, floor: 930, stepH: 38, topY: 702, steps: 6, cx: 1600 };
/** Retourne { back, front, light, W, H, floor, steps : [{ y, x0, x1 }] } (y = dessus de la marche). */
function escalinata(opts) {
  opts = opts || {};
  const id = opts.uid || uid('es'), g = (n) => `${id}-${n}`, W = ESCAL.W, H = ESCAL.H, fl = ESCAL.floor, cx = ESCAL.cx, rnd = rng(opts.seed || 66);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B7FD0"/><stop offset=".5" stop-color="#C9B4D8"/><stop offset=".8" stop-color="#FFD9A0"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  let houses = '', x = -60, k = 0;
  while (x < W) { if (x > 960 && x < 2240) { x = 2240; continue; } const w = 230 + rnd() * 90, h = 300 + rnd() * 100; houses += cuHouse(x, fl - 40, w, h, 50 + k++, {}); x += w + 12; }
  const steps = []; let st = '';
  for (let i = 0; i < ESCAL.steps; i++) {
    const y = fl - (i + 1) * ESCAL.stepH, x0 = cx - 600 + i * 46, x1 = cx + 600 - i * 46; steps.push({ y, x0, x1 });
    st += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${ESCAL.stepH}" fill="${CU.stone4}"/><rect x="${x0}" y="${y}" width="${x1 - x0}" height="8" fill="#fff" opacity=".28"/><rect x="${x0}" y="${y + ESCAL.stepH - 8}" width="${x1 - x0}" height="8" fill="#000" opacity=".16"/>`;
  }
  const topY = ESCAL.topY, c = CU.cath, c2 = shade(c, -0.18), c3 = shade(c, -0.34);
  const church = `<g class="cu-church">${scRect(cx - 470, topY - 520, 940, 520, c)}${scRect(cx - 470, topY - 520, 940, 20, c2)}
<path d="M${cx - 300} ${topY - 520}V${topY - 640}L${cx} ${topY - 760}L${cx + 300} ${topY - 640}V${topY - 520}Z" fill="${c2}"/><circle cx="${cx}" cy="${topY - 620}" r="46" fill="${c3}"/><circle cx="${cx}" cy="${topY - 620}" r="30" fill="#6BB4D8" opacity=".7"/>
${[-1, 1].map((s) => `${scRect(cx + s * 360 - 70, topY - 700, 140, 700, c)}${scRect(cx + s * 360 - 78, topY - 700, 156, 14, c2)}<path d="M${cx + s * 360 - 48} ${topY - 520}V${topY - 610}Q${cx + s * 360} ${topY - 660} ${cx + s * 360 + 48} ${topY - 610}V${topY - 520}Z" fill="${c3}"/><path d="M${cx + s * 360 - 78} ${topY - 700}Q${cx + s * 360} ${topY - 790} ${cx + s * 360 + 78} ${topY - 700}Z" fill="${c2}"/>`).join('')}
<path d="M${cx - 120} ${topY}V${topY - 250}Q${cx} ${topY - 330} ${cx + 120} ${topY - 250}V${topY}Z" fill="#2A1C16"/><path d="M${cx - 150} ${topY}V${topY - 256}Q${cx} ${topY - 356} ${cx + 150} ${topY - 256}V${topY}" fill="none" stroke="${c2}" stroke-width="22"/>
${[-1, 1].map((s) => `<rect x="${cx + s * 230 - 26}" y="${topY - 400}" width="52" height="110" rx="26" fill="${c3}"/>`).join('')}${scRect(cx - 470, topY - 6, 940, 6, '#000', 'opacity=".25"')}</g>`;
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(500, 170, 520, 74, 91, 'front')}${cloudSvg(2700, 130, 600, 84, 93, 'front')}<path d="${cuRidge(W, 560, 140, 6, 90, fl)}" fill="${CU.mt3}"/>
${houses}${church}${cuTree(900, fl - 20, 1.3)}${cuTree(2300, fl - 20, 1.4)}${cuCobbles(W, fl - 8, H, 31, '#B59471', '#7A5C3E')}${scRect(0, fl - 14, W, 12, '#8E7358')}${st}`, 'es-back');
  const front = scSvg(W, H, `<g>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${50 + i * 34}" cy="${H - 40 + (i % 2) * 8}" r="${24 + (i % 3) * 5}" fill="${[CU.leaf, CU.grass3, CU.leaf2][i % 3]}"/>`).join('')}</g>`, 'es-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M2100 0L2700 0L2000 ${H}L1300 ${H}Z" opacity=".45"/></g>`, 'es-light');
  return { back, front, light, W, H, floor: fl, steps, topY };
}

// ---------------------------------------------------------------- murs incas au crepuscule (3200 x 1200) : la Sombra sur le mur
const MUROS = { W: 3200, H: 1200, floor: 940, wallTop: 480 };
/** Retourne { back, front, light, W, H, floor, wallTop, moon : {x,y} }. Ruelle de pierre : grand mur inca a gauche et au centre, maisons a droite, lune (Killa = lune). */
function murosIncas(opts) {
  opts = opts || {};
  const id = opts.uid || uid('mi'), g = (n) => `${id}-${n}`, W = MUROS.W, H = MUROS.H, fl = MUROS.floor, rnd = rng(opts.seed || 68);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241F63"/><stop offset=".45" stop-color="#6C4A9C"/><stop offset=".78" stop-color="#E88A9A"/></linearGradient><radialGradient id="${g('m')}"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></radialGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".4"/><stop offset="1" stop-color="#FFD9A0" stop-opacity=".02"/></linearGradient></defs>`;
  const moon = { x: 2380, y: 190 };
  let houses = '', x = 2060; let k = 0;
  while (x < W) { const w = 230 + rnd() * 80, h = 300 + rnd() * 80; houses += cuHouse(x, fl - 20, w, h, 70 + k++, {}); x += w + 12; }
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}<circle cx="${moon.x}" cy="${moon.y}" r="170" fill="url(#${g('m')})"/><circle cx="${moon.x}" cy="${moon.y}" r="62" fill="#FFF6D8"/><circle cx="${moon.x - 18}" cy="${moon.y - 8}" r="8" fill="#E8DCB8"/><circle cx="${moon.x + 20}" cy="${moon.y + 18}" r="12" fill="#E8DCB8"/>
${[...Array(26)].map(() => `<circle cx="${r1(rnd() * W)}" cy="${r1(rnd() * 360)}" r="${r1(1.5 + rnd() * 2.2)}" fill="#FFF6D8" opacity=".8"/>`).join('')}
<path d="${cuRidge(W, 560, 130, 12, 90, fl)}" fill="${CU.mt1}"/>
${houses}${cuIncaWall(-60, fl, 2000, 520, 77, { door: { x: 720, w: 190, h: 330 }, tones: ['#9A8672', '#8C7A68', '#B5A18A', '#7D6B5B', '#A8947E'] })}
<path d="M-60 ${fl - 520}H1940" stroke="#C4B09A" stroke-width="14"/>${cuCobbles(W, fl - 8, H, 41, '#6F5A4A', '#3E2F26')}${scRect(0, fl - 14, W, 10, '#4A3A30')}`, 'mi-back');
  const front = scSvg(W, H, `<g>${[0, 1, 2, 3].map((i) => `<circle cx="${3060 + i * 36}" cy="${H - 36 + (i % 2) * 8}" r="${24 + (i % 3) * 5}" fill="${[CU.leaf2, CU.leaf, '#5BA060'][i % 3]}"/>`).join('')}</g>`, 'mi-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M2300 0L2800 0L2100 ${H}L1500 ${H}Z" opacity=".35"/></g>`, 'mi-light');
  return { back, front, light, W, H, floor: fl, wallTop: MUROS.wallTop + 0, moon };
}

// ---------------------------------------------------------------- vue vers les montagnes dans la brume, point vert sur Machu Picchu (3200 x 1200)
const VISTA = { W: 3200, H: 1200, floor: 940, dot: { x: 2330, y: 360 } };
/** Retourne { back, front, light, W, H, floor, dot }. Dans back : .cu-dot (point vert), .cu-dotglow (halo), .cu-mist (bandes de brume derivantes). */
function andesVista(opts) {
  opts = opts || {};
  const id = opts.uid || uid('av'), g = (n) => `${id}-${n}`, W = VISTA.W, H = VISTA.H, fl = VISTA.floor, dot = VISTA.dot, rnd = rng(opts.seed || 70);
  const skyG = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C5BB0"/><stop offset=".4" stop-color="#9C8ACB"/><stop offset=".7" stop-color="#F3B9A8"/><stop offset="1" stop-color="#FFE0A8"/></linearGradient><radialGradient id="${g('d')}"><stop offset="0" stop-color="#9DFFD0" stop-opacity=".95"/><stop offset=".4" stop-color="#42E0A0" stop-opacity=".45"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".4"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  const mist = (cx, cy, w, h, o) => `<g class="cu-mist" opacity="${o}"><ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="#F4EBFA"/><ellipse cx="${cx - w * 0.25}" cy="${cy + h * 0.1}" rx="${w * 0.3}" ry="${h * 0.42}" fill="#FFFFFF" opacity=".7"/><ellipse cx="${cx + w * 0.3}" cy="${cy + h * 0.12}" rx="${w * 0.26}" ry="${h * 0.38}" fill="#FFFFFF" opacity=".6"/></g>`;
  const back = scSvg(W, H, `${skyG}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(500, 150, 560, 80, 95, 'dusk')}${cloudSvg(1700, 120, 640, 84, 96, 'dusk')}
<path d="${cuRidge(W, 470, 200, 14, 90, fl)}" fill="${CU.mt4}"/>
<path d="M${dot.x - 520} ${fl}L${dot.x - 300} 520L${dot.x - 120} 440L${dot.x - 40} 400L${dot.x} 340L${dot.x + 60} 430L${dot.x + 200} 470L${dot.x + 420} ${fl}Z" fill="${CU.mt3}"/><path d="M${dot.x} 340L${dot.x + 60} 430L${dot.x + 20} 520L${dot.x - 40} 400Z" fill="${CU.mt2}" opacity=".6"/>
${mist(1200, 640, 1100, 150, 0.7)}${mist(2500, 600, 1200, 150, 0.75)}
<path d="${cuRidge(W, 640, 150, 18, 80, fl)}" fill="${CU.mt2}"/>${mist(800, 760, 1300, 170, 0.72)}${mist(2000, 790, 1400, 180, 0.7)}
<path d="${cuRidge(W, 740, 110, 22, 70, fl)}" fill="${CU.mt1}"/>${mist(1500, 860, 1700, 150, 0.6)}
<circle class="cu-dotglow" cx="${dot.x}" cy="${dot.y}" r="90" fill="url(#${g('d')})"/><circle class="cu-dot" cx="${dot.x}" cy="${dot.y}" r="13" fill="#7DFFC4" stroke="#fff" stroke-width="3"/>
${scRect(0, fl - 90, W, 90, '#7A5F4C')}${[...Array(40)].map((_, i) => `<rect x="${i * 86}" y="${fl - 90}" width="80" height="26" rx="4" fill="${i % 2 ? CU.stone4 : CU.stone}" opacity=".95"/>`).join('')}${scRect(0, fl - 66, W, 66, CU.stone2)}${cuCobbles(W, fl - 6, H, 45, '#8C7860', '#4F3F30')}`, 'av-back');
  const front = scSvg(W, H, `<g>${[0, 1, 2, 3].map((i) => `<circle cx="${60 + i * 34}" cy="${H - 36 + (i % 2) * 8}" r="${24 + (i % 3) * 5}" fill="${[CU.leaf2, CU.leaf, '#5BA060'][i % 3]}"/>`).join('')}</g>`, 'av-front');
  const light = scSvg(W, H, `${skyG}<g class="ac-beams" fill="url(#${g('w')})"><path d="M1800 0L2500 0L1700 ${H}L900 ${H}Z" opacity=".35"/></g>`, 'av-light');
  return { back, front, light, W, H, floor: fl, dot };
}

// ---------------------------------------------------------------- sommet de Machu Picchu a l'aube (3200 x 1700) : finale
const MACHU = { W: 3200, H: 1700, floor: 1430, sun: { x: 1560, y: 880 } };
/**
 * Retourne { sky, sea, back, front, light, W, H, floor, sun }. Plus haut que les autres decors (1700) : la camera monte avec le Quetzal.
 * Dans `sea` : trois bancs de nuages .cu-sea1/2/3 (parallaxe lente) ; dans `sky` : .cu-sundisc (soleil qui monte), .cu-sunglow.
 */
function machuPicchu(opts) {
  opts = opts || {};
  const id = opts.uid || uid('mp'), g = (n) => `${id}-${n}`, W = MACHU.W, H = MACHU.H, fl = MACHU.floor, sun = MACHU.sun, rnd = rng(opts.seed || 72);
  const skyDef = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F2468"/><stop offset=".22" stop-color="#5B3F96"/><stop offset=".38" stop-color="#C560A0"/><stop offset=".5" stop-color="#FF8F94"/><stop offset=".58" stop-color="#FFC27A"/><stop offset=".68" stop-color="#FFE9A8"/></linearGradient><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".3" stop-color="#FFC24A" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A47" stop-opacity="0"/></radialGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".45"/><stop offset="1" stop-color="#FFE9A8" stop-opacity=".02"/></linearGradient></defs>`;
  const stars = [...Array(34)].map(() => `<circle cx="${r1(rnd() * W)}" cy="${r1(rnd() * 560)}" r="${r1(1.4 + rnd() * 2)}" fill="#FFF6D8" opacity="${r1(0.4 + rnd() * 0.5)}"/>`).join('');
  const sky = scSvg(W, H, `${skyDef}${scRect(0, 0, W, H, `url(#${g('s')})`)}${stars}<g class="cu-sunglow"><circle cx="${sun.x}" cy="${sun.y}" r="520" fill="url(#${g('h')})"/></g><circle class="cu-sundisc" cx="${sun.x}" cy="${sun.y}" r="74" fill="#FFF3C4"/>`, 'mp-sky');
  // pics : Huayna Picchu (pain de sucre a droite), cretes lointaines
  const hp = 2360;
  const back = scSvg(W, H, `<path d="${cuRidge(W, 960, 190, 31, 100, fl)}" fill="#8A5FA8" opacity=".75"/><path d="${cuRidge(W, 1040, 170, 33, 90, fl)}" fill="#6A4A98"/>
<path d="M${hp - 360} ${fl}L${hp - 250} 920L${hp - 150} 700L${hp - 70} 620L${hp - 20} 470L${hp + 20} 430L${hp + 60} 500L${hp + 110} 680L${hp + 190} 780L${hp + 330} ${fl}Z" fill="#4B3A82"/><path d="M${hp - 20} 470L${hp + 20} 430L${hp + 60} 500L${hp + 110} 680L${hp + 40} 760L${hp - 6} 620Z" fill="#33286A" opacity=".7"/><path d="M${hp - 50} 640Q${hp} 590 ${hp + 40} 640M${hp - 80} 740Q${hp} 690 ${hp + 80} 750" stroke="#8FD6A0" stroke-width="10" fill="none" opacity=".35"/>
<path d="${cuRidge(W, 1150, 120, 35, 80, fl)}" fill="#3F3279"/>`, 'mp-back');
  const bank = (y, o, c1, c2, seed, cls) => { let s = ''; const r = rng(seed); for (let x = -200; x < W + 200; x += 140 + r() * 80) { const rr = 90 + r() * 90; s += `<ellipse cx="${r1(x)}" cy="${r1(y + (r() - 0.5) * 30)}" rx="${r1(rr * 1.5)}" ry="${r1(rr * 0.55)}" fill="${c1}"/>`; s += `<ellipse cx="${r1(x - rr * 0.2)}" cy="${r1(y - rr * 0.18)}" rx="${r1(rr * 1.1)}" ry="${r1(rr * 0.38)}" fill="${c2}" opacity=".8"/>`; } return `<g class="${cls}" opacity="${o}">${s}<rect x="-400" y="${r1(y + 20)}" width="${W + 800}" height="${H}" fill="${c1}"/></g>`; };
  const sea = scSvg(W, H, `${bank(1150, 0.82, '#FFD0B8', '#FFE9D6', 5, 'cu-sea1')}${bank(1240, 0.9, '#F2A9B0', '#FFC8C4', 7, 'cu-sea2')}${bank(1330, 0.96, '#C77FA4', '#E9A4B4', 9, 'cu-sea3')}`, 'mp-sea');
  // terrasses + ruines (premier plan) : plate-forme de pierre, murs trapezoidaux, herbe
  let terr = ''; for (let i = 0; i < 5; i++) { const ty = fl + 20 + i * 52; terr += `<path d="M${-40 + i * 60} ${ty}H${W + 40 - i * 60}V${ty + 56}H${-40 + i * 60}Z" fill="${i % 2 ? CU.grass2 : CU.grass}"/><rect x="${-40 + i * 60}" y="${ty}" width="${W + 80 - i * 120}" height="9" fill="${CU.stone4}"/><rect x="${-40 + i * 60}" y="${ty + 46}" width="${W + 80 - i * 120}" height="10" fill="${CU.stone2}"/>`; }
  const ruin = (rx, rw, rh) => `<g>${cuIncaWall(rx, fl + 8, rw, rh, Math.round(rx) % 97 + 3, { door: { x: rx + rw * 0.36, w: rw * 0.28, h: rh * 0.72 } })}<path d="M${rx - 16} ${fl + 8 - rh}L${rx + rw / 2} ${fl + 8 - rh - 120}L${rx + rw + 16} ${fl + 8 - rh}Z" fill="#CDB57A"/><path d="M${rx - 16} ${fl + 8 - rh}L${rx + rw / 2} ${fl + 8 - rh - 120}L${rx + rw + 16} ${fl + 8 - rh}" fill="none" stroke="#A8904F" stroke-width="8"/></g>`;
  const front = scSvg(W, H, `${ruin(120, 520, 250)}${ruin(2760, 400, 220)}${scRect(0, fl - 4, W, H - fl + 4, CU.stone2)}${[...Array(30)].map((_, i) => `<rect x="${i * 110 - 20}" y="${fl - 4}" width="104" height="34" rx="6" fill="${i % 2 ? CU.stone4 : CU.stone}"/>`).join('')}${terr}
${[...Array(26)].map((_, i) => `<path d="M${r1(30 + i * 124)} ${H}q-6 -40 -2 -62M${r1(36 + i * 124)} ${H}q4 -50 10 -70M${r1(44 + i * 124)} ${H}q10 -36 20 -50" stroke="${i % 2 ? CU.grass3 : CU.grass}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}`, 'mp-front');
  const light = scSvg(W, H, `${skyDef}<g class="ac-beams" fill="url(#${g('w')})"><path d="M1500 700L1700 700L2300 ${H}L800 ${H}Z" opacity=".3"/></g>`, 'mp-light');
  return { sky, sea, back, front, light, W, H, floor: fl, sun };
}

// ---------------------------------------------------------------- carte du Perou (capsule) : 1000 x 1000, Andes en relief, Cusco + Machu Picchu
const PERU = [[-81.3, -4.2], [-80.3, -3.4], [-80.9, -5.0], [-81.1, -6.0], [-79.9, -7.1], [-78.7, -8.7], [-77.7, -10.5], [-77.1, -12.1], [-76.2, -14.0], [-75.2, -15.5], [-73.9, -16.2], [-72.3, -17.2], [-70.6, -18.3], [-69.5, -17.6], [-69.1, -16.4], [-69.4, -15.0], [-68.9, -13.2], [-69.6, -10.9], [-71.0, -11.0], [-72.7, -9.6], [-73.3, -8.0], [-74.1, -7.4], [-73.3, -5.6], [-72.0, -4.8], [-70.6, -4.1], [-69.9, -4.3], [-70.5, -2.8], [-72.0, -2.4], [-74.0, -1.0], [-75.3, -0.1], [-76.5, -1.5], [-77.8, -2.7], [-78.8, -4.2], [-79.6, -4.2]];
const PERU_VIEW = { lon0: -82.5, lon1: -67.5, lat0: 0.5, lat1: -19.5 };
/** lon/lat -> coordonnees du SVG 1000x1000 de peruMap. */
function peruProj(lon, lat) {
  const V = PERU_VIEW, k = 820 / (V.lat0 - V.lat1);
  return [r1(500 + (lon + 75) * k), r1(60 + (V.lat0 - lat) * k)];
}
/** Carte du Perou en papier decoupe : terre claire, Andes en relief (pics enneiges), points Cusco + Machu Picchu (.cu-pin-cusco, .cu-pin-mp), trait pointille .cu-route. */
function peruMap(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pm'), g = (n) => `${id}-${n}`, W = opts.width || 1000;
  const land = 'M' + PERU.map((p) => peruProj(p[0], p[1]).join(' ')).join('L') + 'Z';
  const spine = [[-78.4, -4.8], [-77.8, -7.4], [-76.9, -9.8], [-76.0, -11.8], [-74.6, -13.2], [-73.0, -13.8], [-71.6, -14.4], [-70.4, -15.8], [-69.6, -16.8]];
  let peaks = ''; const rnd = rng(opts.seed || 8);
  for (let i = 0; i < spine.length - 1; i++) for (let j = 0; j < 3; j++) {
    const t = j / 3, lon = spine[i][0] + (spine[i + 1][0] - spine[i][0]) * t, lat = spine[i][1] + (spine[i + 1][1] - spine[i][1]) * t, p = peruProj(lon, lat), s = 34 + rnd() * 22, ox = (rnd() - 0.5) * 24;
    peaks += `<g class="cu-peak"><path d="M${r1(p[0] + ox - s)} ${r1(p[1] + s * 0.7)}L${r1(p[0] + ox)} ${r1(p[1] - s)}L${r1(p[0] + ox + s)} ${r1(p[1] + s * 0.7)}Z" fill="#7A55A8"/><path d="M${r1(p[0] + ox)} ${r1(p[1] - s)}L${r1(p[0] + ox + s)} ${r1(p[1] + s * 0.7)}H${r1(p[0] + ox + s * 0.2)}Z" fill="#5B3C8C"/><path d="M${r1(p[0] + ox - s * 0.34)} ${r1(p[1] - s * 0.3)}L${r1(p[0] + ox)} ${r1(p[1] - s)}L${r1(p[0] + ox + s * 0.34)} ${r1(p[1] - s * 0.3)}L${r1(p[0] + ox + s * 0.1)} ${r1(p[1] - s * 0.18)}L${r1(p[0] + ox - s * 0.1)} ${r1(p[1] - s * 0.34)}Z" fill="#fff"/></g>`;
  }
  const cu = peruProj(-71.97, -13.52), mp = peruProj(-72.55, -13.16);
  const pin = (p, cls, c) => `<g class="${cls}" transform="translate(${p[0]} ${p[1]})"><circle class="cu-pin-ring" r="26" fill="none" stroke="${c}" stroke-width="6" opacity="0"/><circle r="14" fill="${c}" stroke="#fff" stroke-width="5"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="${W}" height="${W}" class="cu-peru" style="overflow:visible" aria-hidden="true"><defs><linearGradient id="${g('l')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FA06A"/><stop offset=".55" stop-color="#E8C46A"/><stop offset="1" stop-color="#D9A04A"/></linearGradient></defs>
<path d="${land}" fill="#000" opacity=".25" transform="translate(0 12)"/><path d="${land}" fill="url(#${g('l')})" stroke="#F5E6C8" stroke-width="7" stroke-linejoin="round"/>
<g class="cu-relief">${peaks}</g>
<path class="cu-route" d="M${mp[0]} ${mp[1]}L${cu[0]} ${cu[1]}" stroke="#14173F" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round" fill="none"/>
${pin(cu, 'cu-pin-cusco', CU.ora)}${pin(mp, 'cu-pin-mp', CU.mag)}</svg>`;
}

// ---------------------------------------------------------------- accessoires de capsule (SVG 240 x 240)
/** key : inti | intihuatana | pacha | llama | puma | condor | papa | quinua | wasi | mayu | terraza. */
function cuProp(key, opts) {
  opts = opts || {};
  const W = opts.width || 240, id = opts.uid || uid('cp');
  const wrap = (inner, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w || 240} ${h || 240}" width="${W}" height="${r1(W * (h || 240) / (w || 240))}" class="cu-prop cu-prop-${key}" style="overflow:visible" aria-hidden="true">${inner}</svg>`;
  switch (key) {
    case 'inti': {
      let rays = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r0 = 78, r1_ = i % 2 ? 112 : 100; rays += i % 2 ? `<path d="M${r1(120 + Math.cos(a) * r0)} ${r1(120 + Math.sin(a) * r0)}Q${r1(120 + Math.cos(a + 0.12) * 96)} ${r1(120 + Math.sin(a + 0.12) * 96)} ${r1(120 + Math.cos(a) * r1_)} ${r1(120 + Math.sin(a) * r1_)}" stroke="#F59F00" stroke-width="9" fill="none" stroke-linecap="round"/>` : `<path d="M${r1(120 + Math.cos(a - 0.1) * r0)} ${r1(120 + Math.sin(a - 0.1) * r0)}L${r1(120 + Math.cos(a) * 118)} ${r1(120 + Math.sin(a) * 118)}L${r1(120 + Math.cos(a + 0.1) * r0)} ${r1(120 + Math.sin(a + 0.1) * r0)}Z" fill="#FFC24A"/>`; }
      return wrap(`<g class="cu-rays" data-px="120" data-py="120">${rays}</g><circle cx="120" cy="120" r="74" fill="#FFD76A" stroke="#F59F00" stroke-width="7"/><circle cx="96" cy="108" r="8" fill="#7A3E1E"/><circle cx="144" cy="108" r="8" fill="#7A3E1E"/><path d="M120 112v26" stroke="#B8651E" stroke-width="7" stroke-linecap="round"/><path d="M98 150Q120 168 142 150" stroke="#B8651E" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="84" cy="130" r="9" fill="#FF9F70" opacity=".5"/><circle cx="156" cy="130" r="9" fill="#FF9F70" opacity=".5"/>`);
    }
    case 'intihuatana':
      return wrap(`<ellipse cx="120" cy="210" rx="100" ry="14" fill="#000" opacity=".25"/><path d="M30 208L52 150H188L210 208Z" fill="${CU.stone}"/><path d="M52 150H188L192 160H48Z" fill="${CU.stone4}"/><path d="M188 150L210 208H150Z" fill="${CU.stone3}" opacity=".5"/><path d="M96 150V84L112 70H136L148 84V150Z" fill="${CU.stone4}"/><path d="M136 70L148 84V150H128Z" fill="${CU.stone2}"/><path d="M112 70L124 30L136 70Z" fill="${CU.stone}"/><path d="M52 180H100M140 180H190" stroke="${CU.stone3}" stroke-width="5" opacity=".6"/>`);
    case 'pacha':
      return wrap(`<ellipse cx="120" cy="214" rx="104" ry="14" fill="#000" opacity=".22"/><path d="M10 212Q40 110 120 100Q200 110 230 212Z" fill="#6B4A2F"/><path d="M24 196Q50 118 120 112Q190 118 216 196Q120 170 24 196Z" fill="#8DBF5A" opacity=".95"/>${[[70, 150, 0.9], [120, 120, 1.15], [170, 150, 0.9]].map((p, i) => `<g class="cu-sprout" data-px="${p[0]}" data-py="${p[1] + 30}"><path d="M${p[0]} ${p[1] + 30}Q${p[0] - 4} ${p[1] - 10} ${p[0]} ${p[1] - 50 * p[2]}" stroke="#2C6B3F" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${p[0]} ${p[1] - 14 * p[2]}q-34 -10 -40 -38q30 4 40 38Z M${p[0]} ${p[1] - 30 * p[2]}q30 -8 38 -36q-30 4 -38 36Z" fill="${i % 2 ? '#4F8238' : '#6FA24A'}"/></g>`).join('')}<circle cx="120" cy="52" r="14" fill="${CU.mag}"/><circle cx="120" cy="52" r="6" fill="#FFC24A"/>`);
    case 'llama': return cuLlama({ width: W });
    case 'condor': return cuCondor({ width: W });
    case 'puma':
      return wrap(`<ellipse cx="120" cy="214" rx="86" ry="11" fill="#000" opacity=".22"/><path d="M60 214Q40 150 74 110Q86 70 132 70Q180 70 190 118Q200 150 176 214Z" fill="#D9A763"/><path d="M176 214Q200 150 190 118Q186 92 160 80Q196 110 168 214Z" fill="#B88444" opacity=".7"/><path d="M60 214Q38 220 34 200Q50 196 64 196Z" fill="#D9A763"/><path class="cu-pu-tail" d="M180 190Q232 190 224 142Q222 128 212 132Q218 168 176 170Z" fill="#D9A763"/><circle cx="132" cy="76" r="44" fill="#E3B676"/><path d="M96 46L100 20L122 40ZM168 46L164 20L142 40Z" fill="#E3B676"/><path d="M102 40L103 28L114 38ZM162 40L161 28L150 38Z" fill="#B87A60"/><ellipse cx="132" cy="94" rx="26" ry="18" fill="#FBEBD0"/><path d="M122 84l10 8 10 -8Z" fill="#6B3E2E"/><path d="M132 92v8M122 100Q132 108 142 100" stroke="#6B3E2E" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="116" cy="70" r="5" fill="#2A160E"/><circle cx="148" cy="70" r="5" fill="#2A160E"/><circle cx="117.5" cy="68.4" r="1.6" fill="#fff"/><circle cx="149.5" cy="68.4" r="1.6" fill="#fff"/>`);
    case 'papa':
      return wrap(`<ellipse cx="120" cy="210" rx="90" ry="12" fill="#000" opacity=".22"/>${[[84, 150, 56, 42, -12, '#C98A4A'], [156, 158, 60, 44, 10, '#B97A3C'], [118, 112, 50, 38, 4, '#D9A060']].map((p) => `<g transform="rotate(${p[4]} ${p[0]} ${p[1]})"><ellipse cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[3]}" fill="${p[5]}"/><ellipse cx="${p[0] - 10}" cy="${p[1] - 12}" rx="${p[2] * 0.55}" ry="${p[3] * 0.4}" fill="#fff" opacity=".18"/><circle cx="${p[0] - 18}" cy="${p[1] + 6}" r="4" fill="#6B3E1E"/><circle cx="${p[0] + 16}" cy="${p[1] - 4}" r="4" fill="#6B3E1E"/><circle cx="${p[0] + 4}" cy="${p[1] + 16}" r="3.4" fill="#6B3E1E"/></g>`).join('')}<path d="M118 76Q112 44 124 28" stroke="#4F8238" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M124 40q22 -6 28 -24q-24 0 -28 24Z" fill="#6FA24A"/>`);
    case 'quinua':
      return wrap(`<ellipse cx="120" cy="214" rx="70" ry="10" fill="#000" opacity=".22"/><path d="M120 214Q116 130 120 60" stroke="#4F8238" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M120 150q-44 -8 -54 -40q40 4 54 40Z M120 170q44 -8 54 -40q-40 4 -54 40Z" fill="#6FA24A"/>${[...Array(28)].map((_, i) => { const a = (i * 2.4) % 6.28, rr = 8 + (i % 7) * 4.4, yy = 62 - Math.floor(i / 4) * 0 + (i % 9) * 6 - 30; return `<circle cx="${r1(120 + Math.cos(a) * rr * 1.4)}" cy="${r1(76 + yy * 0.6 + Math.sin(a) * rr * 0.6)}" r="${r1(7 + (i % 3))}" fill="${['#D93472', '#F59F00', '#C9402E', '#FFC24A'][i % 4]}"/>`; }).join('')}`);
    case 'wasi':
      return wrap(`<ellipse cx="120" cy="216" rx="104" ry="12" fill="#000" opacity=".22"/><rect x="40" y="120" width="160" height="94" fill="${CU.stone}"/><rect x="40" y="120" width="160" height="94" fill="${CU.stone2}" opacity=".3"/><path d="M60 214L76 150H164L180 214Z" fill="#241A2E"/><path d="M20 126L120 40L220 126Z" fill="#D8B66A"/><path d="M20 126L120 40L220 126" fill="none" stroke="#A8904F" stroke-width="8" stroke-linejoin="round"/>${[60, 90, 120, 150, 180].map((x) => `<path d="M${x} 118L${x - 8} 74" stroke="#A8904F" stroke-width="3" opacity=".6"/>`).join('')}`);
    case 'mayu':
      return wrap(`<path d="M0 90Q60 40 120 80Q180 40 240 90V240H0Z" fill="${CU.mt2}"/><path d="M0 130Q60 100 120 120Q180 100 240 130V240H0Z" fill="${CU.grass2}"/><path d="M80 240Q100 190 120 160Q150 130 130 112Q160 126 140 176Q130 210 160 240Z" fill="#4CB7E0"/><path d="M96 232Q112 196 128 176M120 140Q130 128 124 118" stroke="#D8F3FF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`);
    case 'terraza':
    default: {
      let t = ''; for (let i = 0; i < 6; i++) t += `<path d="M${10 + i * 20} ${200 - i * 26}H${230 - i * 20}V${222 - i * 26}H${10 + i * 20}Z" fill="${i % 2 ? CU.grass2 : CU.grass}"/><rect x="${10 + i * 20}" y="${200 - i * 26}" width="${220 - i * 40}" height="6" fill="${CU.stone4}"/>`;
      return wrap(t);
    }
  }
}

window.QArt = {PAL,RARITY,clamp,esc,uid,rng,hex2rgb,rgb2hex,mix,shade,r1,smooth,azulejoPattern,azulejoDataUri,papelPicado,FRIEZE_PAL,azulejoFrieze,FILETE_PAL,fileteFrieze,bunting,paperGrainFilter,cornerOrnament,QUETZAL_PIVOT,quetzal,QUETZAL_POSES,quetzalSet,quetzalPoseTo,quetzalFlap,quetzalTalk,quetzalBlink,quetzalSway,quetzalRegrow,COLOMBIA_PAL,ANDES_PAL,chakanaPath,colombiaFrieze,andesFrieze,SOMBRA_PIVOT,sombra,sombraFloat,sombraEyes,sombraDissolve,MONUMENTS,monument,monumentSvg,MAP_W,mapProj,MAP_REGIONS,MAP_ROUTE,mapRegion,mapFogHtml,cloudSvg,worldMap,mapCam,mapCamTo,mapCamMove,mapCamSet,mapFogClear,mapFogDrift,mapPulse,mapTravel,explainerMap,explainerReveal,sparklePath,SKY,madridSkyline,ROOM,academiaRoom,featherSvg,flagSvg,moteField,CHAR_PIVOT,CHARS,character,charTalk,charBlink,charIdle,charWalk,charWave,charEmote,charNod,prop,storkSvg,frozenKid,fachadaUniversidad,salamancaSkyline,PATIO,colegioPatio,AULA,aula,sevillaSkyline,CALLEJON,callejonTriana,PATIOA,patioAndaluz,TALLER,tallerCeramica,coyoacanSkyline,PLAZA,plazaHidalgo,casaAzulFachada,mxBalloonSvg,CASAP,casaAzulPatio,autorretrato,mxProp,ofrendaSvg,oxProp,oxSeal,OAXACA_SKY,oaxacaSkyline,oaxacaStall,OX_PATIO,patioOfrenda,oaxacaPetalPath,bogotaSkyline,CALLE,calleCandelaria,bgSignPost,bgCityMap,bgLetterSvg,bgColombiaMap,bgOroVitrina,bgTeleferico,bgPlazaCard,bgStreetCard,bgCyclist,bgWalker,bgCiclovia,vlDigital,vlAlarm,vlClock,vlPaella,vlSkyline,VLPLAZA,vlPlaza,vlProp,vlCrowd,MN_PLAZA,mnPlaza,mnSkyline,mnProp,yucatanSkyline,SELVA,selvaSentier,yuGlyph,CASTILLO,elCastillo,CIMA,templeCima,CENOTE,cenote,yuFlamingo,yuPyramidPlan,yuPyramidSide,yuTenochtitlan,yuCiudad,yuFood,baSkyline,BA_CAM,baCaminito,BA_TEL,baSanTelmo,baPareja,baProp,baArgentina,cuLlama,cuCondor,CUSCO,cuscoSkyline,PLAZA_ARMAS,plazaDeArmas,ESCAL,escalinata,MUROS,murosIncas,VISTA,andesVista,MACHU,machuPicchu,PERU_VIEW,peruProj,peruMap,cuProp};
})();
