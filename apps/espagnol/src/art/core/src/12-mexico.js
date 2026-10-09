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
export function coyoacanSkyline(opts) {
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
export const PLAZA = { W: 3200, H: 1200, floor: 930, kiosk: { x: 1500 } };
/** Retourne { back, front, light, W, H, floor, kiosk, balloons : [{ x, y, c }] }. Les ballons ne sont PAS dans le SVG : les poser avec mxBalloonSvg (elements DOM animables). */
export function plazaHidalgo(opts) {
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
export function casaAzulFachada(opts) {
  opts = opts || {};
  const W = opts.width || 780;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" width="${W}" height="${Math.round((W * 500) / 780)}" class="mx-fachada" style="overflow:visible" aria-hidden="true">${mxCasaAzul(30, 470, 720, 400, { cols: 3 })}${scRect(0, 470, 780, 18, MX.stone2)}</svg>`;
}
/** Ballon autonome (SVG 80x180, centre du ballon en 40,40) a poser comme element DOM anime (pas dans un gros calque SVG). opts : c (couleur), width. */
export function mxBalloonSvg(opts) {
  opts = opts || {};
  const W = opts.width || 80;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 180" width="${W}" height="${Math.round(W * 2.25)}" class="mx-balloon" style="overflow:visible" aria-hidden="true">${mxBalloon(40, 40, opts.c || MX.rojo, 1.4)}</svg>`;
}

// ---------------------------------------------------------------- patio de la Casa Azul (2400 x 1200) : murs cobalt, patio de plantes, galerie d'autoportraits
export const CASAP = { W: 2400, H: 1200, floor: 900, door: { x: 1960, y: 440, w: 200, h: 460 }, frames: [{ x: 300, y: 250, w: 250, h: 320 }, { x: 640, y: 250, w: 250, h: 320 }, { x: 980, y: 250, w: 250, h: 320 }, { x: 1320, y: 250, w: 250, h: 320 }] };
/** Retourne { back, front, light, W, H, floor, door, frames }. Les 4 autoportraits du mur sont PRODUITS par la composition (QArt.autorretrato) pour pouvoir etre animes. */
export function casaAzulPatio(opts) {
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
export function autorretrato(opts) {
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
export function mxProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('mp'), W = opts.width || 200;
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round(W * h)}" class="mx-prop mx-${key}" aria-hidden="true">${inner}</svg>`;
  if (key === 'mono') return mk('0 0 200 240', 1.2, `<path d="M150 200Q220 190 196 130Q186 100 166 118" stroke="#6B4222" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="170" rx="56" ry="62" fill="#8A5A32"/><ellipse cx="100" cy="184" rx="34" ry="40" fill="#D9A878"/><circle cx="100" cy="90" r="50" fill="#8A5A32"/><circle cx="52" cy="90" r="18" fill="#8A5A32"/><circle cx="148" cy="90" r="18" fill="#8A5A32"/><circle cx="52" cy="90" r="9" fill="#D9A878"/><circle cx="148" cy="90" r="9" fill="#D9A878"/><ellipse cx="100" cy="102" rx="34" ry="30" fill="#D9A878"/><circle cx="84" cy="88" r="7" fill="#2A160E"/><circle cx="116" cy="88" r="7" fill="#2A160E"/><circle cx="86" cy="86" r="2.5" fill="#fff"/><circle cx="118" cy="86" r="2.5" fill="#fff"/><ellipse cx="94" cy="108" rx="3.5" ry="2.5" fill="#6B4222"/><ellipse cx="106" cy="108" rx="3.5" ry="2.5" fill="#6B4222"/><path d="M86 120Q100 130 114 120" stroke="#6B4222" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 210Q56 232 74 232M140 210Q144 232 126 232" stroke="#6B4222" stroke-width="14" fill="none" stroke-linecap="round"/>`);
  if (key === 'loro') return mk('0 0 200 260', 1.3, `<path d="M118 190Q150 250 120 256Q110 230 100 200Z" fill="#D81E3A"/><path d="M92 190Q86 250 70 256Q60 232 74 190Z" fill="#2F6FD0"/><path d="M70 120Q66 200 100 206Q146 200 142 120Q138 56 100 54Q74 56 70 120Z" fill="#1FA85A"/><path d="M82 150Q96 190 124 160" fill="none" stroke="#FFC83D" stroke-width="12" stroke-linecap="round"/><path d="M142 130Q176 150 168 196Q150 176 138 168Z" fill="#2F6FD0"/><circle cx="100" cy="86" r="34" fill="#E8D030"/><circle cx="88" cy="80" r="10" fill="#fff"/><circle cx="90" cy="80" r="5" fill="#2A160E"/><path d="M104 86Q140 80 138 108Q120 116 104 100Z" fill="#F4F0E0"/><path d="M104 86Q130 82 138 100Q116 100 104 94Z" fill="#E8A83C"/><path d="M70 60Q82 30 96 56" fill="#D81E3A"/>`);
  if (key === 'xolo') return mk('0 0 260 220', 0.85, `<path d="M214 150Q250 130 244 90" stroke="#4A4F5C" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M60 100Q40 40 76 40L96 60Z" fill="#3F4450"/><path d="M60 110Q60 70 130 70Q210 70 214 130Q214 170 190 170L70 170Q46 170 60 110Z" fill="#5A6070"/><path d="M60 170L56 210H84L90 170Z M170 170L168 210H196L200 170Z" fill="#4A4F5C"/><path d="M60 110Q30 100 24 128Q22 150 50 150Q70 148 76 130Z" fill="#5A6070"/><path d="M96 56Q100 20 124 34Q132 60 118 80Z" fill="#3F4450"/><circle cx="68" cy="116" r="6" fill="#1A1A22"/><ellipse cx="30" cy="132" rx="10" ry="8" fill="#1A1A22"/><path d="M84 96Q94 82 104 96" stroke="#FFC9B0" stroke-width="4" fill="none" opacity=".6"/>`);
  if (key === 'espejo') return mk('0 0 160 300', 1.9, `<rect x="68" y="150" width="24" height="140" rx="12" fill="#C99A4E"/><circle cx="80" cy="84" r="68" fill="#E8C078"/><circle cx="80" cy="84" r="54" fill="#CFE9F5"/><path d="M42 60Q60 36 92 36" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".7"/><g fill="#C99A4E">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${r1(80 + Math.cos((i / 8) * 6.283) * 62)}" cy="${r1(84 + Math.sin((i / 8) * 6.283) * 62)}" r="7"/>`).join('')}</g>`);
  return mk('0 0 200 240', 1.2, `<rect x="6" y="6" width="188" height="228" rx="10" fill="#C99A4E"/><rect x="18" y="18" width="164" height="204" rx="6" fill="#E8C078"/><rect x="30" y="30" width="140" height="180" rx="4" fill="#1F7F6A"/>`);
}
