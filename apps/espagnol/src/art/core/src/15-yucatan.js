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
export function yucatanSkyline(opts) {
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
export const SELVA = { W: 3200, H: 1200, floor: 930 };
/** Retourne { back, front, light, W, H, floor }. */
export function selvaSentier(opts) {
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
export function yuGlyph(opts) {
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
export const CASTILLO = { W: 3200, H: 1500, floor: 1300, cx: 1600 };
/** Retourne { back, front, light, W, H, floor, slots, stair, door, topY }. Pierres LISSES (cadres vides) : poser des yuGlyph sur `slots` pour les montrer. */
export function elCastillo(opts) {
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
export const CIMA = { W: 2400, H: 1200, floor: 1060 };
/** Retourne { back, front, light, W, H, floor, slots } (slots = 9 emplacements de glyphes sur la frise et les pilastres). */
export function templeCima(opts) {
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
export const CENOTE = { W: 2400, H: 1200, floor: 930, surface: 950, glow: { x: 1640, y: 1100 }, shaftX: 1500 };
/** Retourne { back, front, light, W, H, floor, surface, glow, shaftX }. Classes animables : .yu-rip (rides), .yu-shaft (rayon). */
export function cenote(opts) {
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
export function yuFlamingo(opts) {
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
export function yuPyramidPlan(opts) {
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
export function yuPyramidSide(opts) {
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
export function yuTenochtitlan(opts) {
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
export function yuCiudad(opts) {
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
export function yuFood(key, opts) {
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
