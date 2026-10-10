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
export function cuLlama(opts) {
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
export function cuCondor(opts) {
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
export const CUSCO = { W: 3200, H: 1200, street: 800 };
export function cuscoSkyline(opts) {
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
export const PLAZA_ARMAS = { W: 3200, H: 1200, floor: 930, cath: 1900, fountain: 1200 };
/** Retourne { back, front, light, W, H, floor, cath, fountain }. */
export function plazaDeArmas(opts) {
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
export const ESCAL = { W: 3200, H: 1200, floor: 930, stepH: 38, topY: 702, steps: 6, cx: 1600 };
/** Retourne { back, front, light, W, H, floor, steps : [{ y, x0, x1 }] } (y = dessus de la marche). */
export function escalinata(opts) {
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
export const MUROS = { W: 3200, H: 1200, floor: 940, wallTop: 480 };
/** Retourne { back, front, light, W, H, floor, wallTop, moon : {x,y} }. Ruelle de pierre : grand mur inca a gauche et au centre, maisons a droite, lune (Killa = lune). */
export function murosIncas(opts) {
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
export const VISTA = { W: 3200, H: 1200, floor: 940, dot: { x: 2330, y: 360 } };
/** Retourne { back, front, light, W, H, floor, dot }. Dans back : .cu-dot (point vert), .cu-dotglow (halo), .cu-mist (bandes de brume derivantes). */
export function andesVista(opts) {
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
export const MACHU = { W: 3200, H: 1700, floor: 1430, sun: { x: 1560, y: 880 } };
/**
 * Retourne { sky, sea, back, front, light, W, H, floor, sun }. Plus haut que les autres decors (1700) : la camera monte avec le Quetzal.
 * Dans `sea` : trois bancs de nuages .cu-sea1/2/3 (parallaxe lente) ; dans `sky` : .cu-sundisc (soleil qui monte), .cu-sunglow.
 */
export function machuPicchu(opts) {
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
export const PERU_VIEW = { lon0: -82.5, lon1: -67.5, lat0: 0.5, lat1: -19.5 };
/** lon/lat -> coordonnees du SVG 1000x1000 de peruMap. */
export function peruProj(lon, lat) {
  const V = PERU_VIEW, k = 820 / (V.lat0 - V.lat1);
  return [r1(500 + (lon + 75) * k), r1(60 + (V.lat0 - lat) * k)];
}
/** Carte du Perou en papier decoupe : terre claire, Andes en relief (pics enneiges), points Cusco + Machu Picchu (.cu-pin-cusco, .cu-pin-mp), trait pointille .cu-route. */
export function peruMap(opts) {
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
export function cuProp(key, opts) {
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
