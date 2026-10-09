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
