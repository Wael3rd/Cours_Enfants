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
export const MN_PLAZA = { W: 3200, H: 1200, floor: 930, tree: { x: 1640, base: 960, h: 760 }, rosa: { x: 2330 }, star: { x: 1640, y: 214 } };
/** Retourne { back, front, light, W, H, floor, tree, rosa, star }. Dans back : calques animables .mn-lights (guirlandes, fenetres, lampadaires), .mn-treelights, .mn-star-lit (etoile doree + halo), .mn-candle (bougies des etals).
 *  Etat par defaut = LUMIERES ALLUMEES : les compositions de la nuit noire font tl.set('.mn-lights,.mn-treelights,.mn-star-lit', { opacity: 0 }, 0) puis rallument en fondu. */
export function mnPlaza(opts) {
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
export function mnSkyline(opts) {
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
export function mnProp(key, opts) {
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
