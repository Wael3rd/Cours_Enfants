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
export function bogotaSkyline(opts) {
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
export const CALLE = { W: 3200, H: 1200, floor: 930, signs: [{ x: 1180, w: 230 }, { x: 2010, w: 230 }], map: { x: 2480, y: 330, w: 420, h: 330 } };
/** Retourne { back, front, light, W, H, floor, signs, map } (map = emplacement du grand plan mural, a poser avec bgCityMap). */
export function calleCandelaria(opts) {
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
export function bgSignPost(opts) {
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
export function bgCityMap(opts) {
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
export function bgLetterSvg(opts) {
  opts = opts || {};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="${opts.width || 40}" height="${Math.round(((opts.width || 40) * 52) / 40)}" aria-hidden="true"><rect x="4" y="4" width="32" height="44" rx="8" fill="${opts.c || '#1B2A5C'}"/><rect x="12" y="14" width="16" height="10" fill="#FFF8EA"/></svg>`;
}

// ---------------------------------------------------------------- accessoires de capsule (papier decoupe)
/** Carte de Colombie (SVG 520 x 600) : contour, relief des Andes (3 cordilleres), points Bogota / autres. opts : width, uid. */
export function bgColombiaMap(opts) {
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
export function bgOroVitrina(opts) {
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
export function bgTeleferico(opts) {
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
export function bgPlazaCard(opts) {
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
export function bgStreetCard(opts) {
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
export function bgCyclist(opts) {
  opts = opts || {};
  const c = opts.c || BG.red, wheel = (cx) => `<g class="bg-wheel" data-px="${cx}" data-py="94"><circle cx="${cx}" cy="94" r="30" fill="none" stroke="#1E1A26" stroke-width="6"/><path d="M${cx - 28} 94H${cx + 28}M${cx} 66V122" stroke="#9AA3C7" stroke-width="3"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 130" width="${opts.width || 160}" height="${Math.round(((opts.width || 160) * 130) / 160)}" class="bg-cyc" aria-hidden="true">${wheel(34)}${wheel(124)}<path d="M34 94L70 60H110L124 94M70 60L84 94H34M84 94L110 60" stroke="#2A2A3A" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="M72 58L84 30L100 32L98 58Z" fill="${c}"/><circle cx="96" cy="16" r="12" fill="#D2956B"/><path d="M84 8Q96 -2 108 8Z" fill="#2A2A3A"/><path d="M98 36L116 56" stroke="#D2956B" stroke-width="7" stroke-linecap="round"/><path d="M80 60L90 94" stroke="${BG.blue}" stroke-width="9" stroke-linecap="round"/></svg>`;
}
/** Piéton qui marche/court (SVG 80 x 150). opts : c (haut), p (pantalon). */
export function bgWalker(opts) {
  opts = opts || {};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 150" width="${opts.width || 80}" height="${Math.round(((opts.width || 80) * 150) / 80)}" class="bg-walker" aria-hidden="true"><circle cx="40" cy="20" r="14" fill="${opts.s || '#C98F66'}"/><path d="M26 14Q40 -4 54 14Z" fill="#1E120C"/><path d="M28 38H52L56 92H24Z" fill="${opts.c || BG.green}"/><path d="M28 92H40V140H28ZM42 92H54V140H42Z" fill="${opts.p || '#2F4A86'}"/><path d="M28 42L14 76M52 42L66 76" stroke="${opts.s || '#C98F66'}" stroke-width="8" stroke-linecap="round"/></svg>`;
}
/** Avenue de la Ciclovia (SVG 1400 x 640) : avenue large fermee aux voitures, plots, arbres, immeubles lointains, ligne d'horizon sur la montagne. Cyclistes et pietons = elements DOM a ajouter (bgCyclist / bgWalker). */
export function bgCiclovia(opts) {
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
