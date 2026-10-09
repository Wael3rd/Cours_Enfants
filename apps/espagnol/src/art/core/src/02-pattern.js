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
