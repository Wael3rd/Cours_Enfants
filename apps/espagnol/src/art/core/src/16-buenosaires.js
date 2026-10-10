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
export function baSkyline(opts) {
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
export const BA_CAM = { W: 3200, H: 1200, floor: 930 };
/** Retourne { back, front, light, W, H, floor }. Rue pavee entre deux rangees de maisons de tole coloree, guirlande de fanions sobres. */
export function baCaminito(opts) {
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
export const BA_TEL = { W: 3200, H: 1200, floor: 930 };
/** Retourne { back, front, light, W, H, floor, dance : { x0, x1 } }. Facades coloniales a balcons de fer forge, etals a auvents, guirlande d'ampoules fixes, pave ; l'espace central est libre pour les danseurs. */
export function baSanTelmo(opts) {
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
export function baPareja(opts) {
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
export function baProp(key, opts) {
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
export function baArgentina(opts) {
  opts = opts || {};
  const W = opts.width || 420, view = opts.view || '0 0 420 680', vb = view.split(' ').map(Number), H = Math.round((W * vb[3]) / vb[2]);
  const bs = baGeo(-58.4, -34.6), mv = baGeo(-56.2, -34.9);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${W}" height="${H}" class="ba-map" style="overflow:visible" aria-hidden="true"><path class="ba-rio" d="${baPoly(BA_RIO)}" fill="#B88A62" opacity=".9"/><path class="ba-ury" d="${baPoly(BA_URY)}" fill="#3B44A8" stroke="#6A72D8" stroke-width="3" stroke-linejoin="round"/><path class="ba-arg" d="${baPoly(BA_ARG)}" fill="#19B7AA" stroke="#F5E6C8" stroke-width="5" stroke-linejoin="round"/><path d="${baPoly(BA_ARG)}" fill="none" stroke="#0E7F82" stroke-width="14" stroke-linejoin="round" opacity=".25" transform="translate(4 6)"/><circle class="ba-bsas" cx="${bs[0]}" cy="${bs[1]}" r="13" fill="#FFC83D" stroke="#fff" stroke-width="4" data-px="${bs[0]}" data-py="${bs[1]}"/><circle class="ba-mvd" cx="${mv[0]}" cy="${mv[1]}" r="13" fill="#F5E6C8" stroke="#fff" stroke-width="4" data-px="${mv[0]}" data-py="${mv[1]}"/></svg>`;
}
