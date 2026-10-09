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
