// ---------------------------------------------------------------- decors de cinematiques : skyline de Madrid, Academia de Viajeros, plume, drapeaux, particules
// Tout est SVG pur (chaines), en calques separes pour la parallaxe : chaque calque a la meme taille (W x H) et se pose a (0,0).
// Aucune marque, aucun logo : silhouettes originales simplifiees de monuments publics.

function scEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function scRect(x, y, w, h, fill, extra) { return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" ${extra || ''}/>`; }
function scSvg(W, H, inner, cls) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="${cls || ''}" aria-hidden="true">${inner}</svg>`; }
/** Etoile a 4 branches (etincelle). */
export function sparklePath(cx, cy, R, r) {
  r = r == null ? R * 0.22 : r;
  return `M${r1(cx)} ${r1(cy - R)}L${r1(cx + r)} ${r1(cy - r)}L${r1(cx + R)} ${r1(cy)}L${r1(cx + r)} ${r1(cy + r)}L${r1(cx)} ${r1(cy + R)}L${r1(cx - r)} ${r1(cy + r)}L${r1(cx - R)} ${r1(cy)}L${r1(cx - r)} ${r1(cy - r)}Z`;
}

// ---------------------------------------------------------------- Madrid au coucher du soleil (3200 x 1200)
export const SKY = { W: 3200, H: 1200, horizon: 880 };
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
export function madridSkyline(opts) {
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
export const ROOM = { W: 2400, H: 1200, floor: 930, deskTop: 790 };
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
export function academiaRoom(opts) {
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
export function featherSvg(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ft'), W = opts.width || 120, H = opts.height || 360, g = (n) => `${id}-${n}`;
  let barbs = ''; for (let i = 0; i < 16; i++) { const y = 40 + i * 17, w = 40 * Math.sin((Math.PI * (i + 1.5)) / 18) + 8; barbs += `<path d="M60 ${y}q${r1(-w * 0.6)} 6 ${r1(-w)} 26M60 ${y}q${r1(w * 0.6)} 6 ${r1(w)} 26" stroke="#066A4A" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 360" width="${W}" height="${H}" class="f-svg" aria-hidden="true"><defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#42E0A0"/><stop offset=".5" stop-color="#0E9F6E"/><stop offset="1" stop-color="#19B7AA"/></linearGradient><radialGradient id="${g('glow')}"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".9"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>
<ellipse class="f-glow" cx="60" cy="170" rx="100" ry="170" fill="url(#${g('glow')})"/>
<path d="M60 8C112 70 118 170 84 262Q70 312 60 352C50 312 36 262 16 190C-6 110 18 60 60 8Z" fill="url(#${g('b')})" stroke="#066A4A" stroke-width="3" stroke-linejoin="round"/>${barbs}<path d="M60 14Q64 190 60 356" stroke="#BFFFE3" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 90Q30 130 46 170" stroke="#fff" stroke-width="4" opacity=".4" fill="none" stroke-linecap="round"/></svg>`;
}

// ---------------------------------------------------------------- drapeaux simples (100 x 66) : es, mx, ar
export function flagSvg(code, opts) {
  opts = opts || {};
  const w = opts.width || 200, id = opts.uid || uid('fl');
  const body = { es: `<rect width="100" height="66" fill="#C8102E"/><rect y="16.5" width="100" height="33" fill="#FFC400"/><rect x="22" y="26" width="9" height="14" rx="2" fill="#B4503A"/>`,
    mx: `<rect width="100" height="66" fill="#fff"/><rect width="33.4" height="66" fill="#006847"/><rect x="66.6" width="33.4" height="66" fill="#CE1126"/><circle cx="50" cy="33" r="8.5" fill="#9C7A3C"/><path d="M42 37q8 8 16 0" stroke="#006847" stroke-width="2.4" fill="none"/>`,
    ar: `<rect width="100" height="66" fill="#fff"/><rect width="100" height="22" fill="#74ACDF"/><rect y="44" width="100" height="22" fill="#74ACDF"/><circle cx="50" cy="33" r="6.2" fill="#F6B40E"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M50 33l${r1(Math.cos(i * 0.785) * 10)} ${r1(Math.sin(i * 0.785) * 10)}" stroke="#F6B40E" stroke-width="1.6"/>`).join('')}` }[code] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 66" width="${w}" height="${r1(w * 0.66)}" class="fl-svg" aria-hidden="true"><defs><clipPath id="${id}"><rect width="100" height="66" rx="6"/></clipPath><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#${id})">${body}<rect width="100" height="66" fill="url(#${id}s)"/></g><rect width="100" height="66" rx="6" fill="none" stroke="#14173F" stroke-opacity=".5" stroke-width="2"/></svg>`;
}

// ---------------------------------------------------------------- particules : motes de poussiere, etincelles, confettis de papel picado
/** n points (cercles/etincelles) repartis dans w x h ; chaque <g class="k-mote" data-i> est anime par la composition (positions deterministes). */
export function moteField(opts) {
  opts = opts || {};
  const n = opts.n || 40, W = opts.w || 1920, H = opts.h || 1200, rnd = rng(opts.seed || 3), cols = opts.colors || ['#FFE9A8', '#FFD76A', '#FFF3D1'];
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rnd() * W, y = rnd() * H, r = (opts.rmin || 2) + rnd() * ((opts.rmax || 6) - (opts.rmin || 2)), c = cols[i % cols.length];
    s += `<g class="k-mote" data-i="${i}" data-x="${r1(x)}" data-y="${r1(y)}" data-r="${r1(r)}" transform="translate(${r1(x)} ${r1(y)})">${opts.stars && i % 3 === 0 ? `<path d="${sparklePath(0, 0, r * 2.4)}" fill="${c}"/>` : `<circle r="${r1(r)}" fill="${c}"/>`}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="k-svg" aria-hidden="true">${s}</svg>`;
}
