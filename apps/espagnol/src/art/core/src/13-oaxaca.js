// ---------------------------------------------------------------- decors et accessoires de l'evenement Dia de Muertos (Oaxaca) : panorama de rue au crepuscule, patio de nuit avec petit autel,
// ofrenda a trois etages (fotos, velas, flores, pan de muerto, comida), chemin de petales de cempasuchil, calaveras de azucar, Catrina, sceau de laurier.
// Respectueux et joyeux : calaveras souriantes et colorees, aucune imagerie effrayante. Prefixe `ox` pour tout helper interne (un seul scope avec les autres fichiers du kit).
// Aucun texte, aucune marque. Lueurs de bougies = halos (.of-glow) a faire respirer lentement ; flammes = .of-flame (data-px/data-py = pied de la flamme).

const OX = { ocre: '#E8A33A', rosa: '#E0699A', turq: '#19B7AA', azul: '#4F8FE8', terra: '#C9573B', amar: '#FFC83D', viol: '#9A5FD0', naranja: '#FF9F1C', magenta: '#D93472', noche: '#14123F' };

function oxGlowDef(id, c) { return `<radialGradient id="${id}"><stop offset="0" stop-color="${c || '#FFC96A'}" stop-opacity=".55"/><stop offset=".5" stop-color="${c || '#FFC96A'}" stop-opacity=".18"/><stop offset="1" stop-color="${c || '#FFC96A'}" stop-opacity="0"/></radialGradient>`; }

/** Bougie : pied en (x, y), hauteur h, echelle k. Groupe .of-vela > .of-glow (halo), .of-flame (flamme, pivot au pied). gid = id d'un radialGradient (oxGlowDef). */
function oxCandle(x, y, h, gid, k) {
  k = k || 1;
  const w = 18 * k, fh = 34 * k, fy = y - h - 4, tip = fy - fh;
  return `<g class="of-vela" data-px="${r1(x)}" data-py="${r1(y)}"><circle class="of-glow" cx="${r1(x)}" cy="${r1(fy - fh * 0.4)}" r="${r1(74 * k)}" fill="url(#${gid})"/>` +
    `<rect x="${r1(x - w / 2)}" y="${r1(y - h)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(4 * k)}" fill="#FFF3D1"/><rect x="${r1(x + w * 0.1)}" y="${r1(y - h)}" width="${r1(w * 0.4)}" height="${r1(h)}" rx="${r1(3 * k)}" fill="#E8D2A0" opacity=".7"/>` +
    `<path d="M${r1(x)} ${r1(y - h)}v${r1(-5 * k)}" stroke="#3B2216" stroke-width="${r1(3 * k)}"/>` +
    `<g class="of-flame" data-px="${r1(x)}" data-py="${r1(fy)}"><path d="M${r1(x)} ${r1(tip)}C${r1(x + 12 * k)} ${r1(tip + fh * 0.4)} ${r1(x + 10 * k)} ${r1(fy)} ${r1(x)} ${r1(fy)}C${r1(x - 10 * k)} ${r1(fy)} ${r1(x - 12 * k)} ${r1(tip + fh * 0.4)} ${r1(x)} ${r1(tip)}Z" fill="#FF9F1C"/>` +
    `<path d="M${r1(x)} ${r1(tip + fh * 0.3)}C${r1(x + 6 * k)} ${r1(tip + fh * 0.55)} ${r1(x + 5 * k)} ${r1(fy)} ${r1(x)} ${r1(fy)}C${r1(x - 5 * k)} ${r1(fy)} ${r1(x - 6 * k)} ${r1(tip + fh * 0.55)} ${r1(x)} ${r1(tip + fh * 0.3)}Z" fill="#FFE9A8"/></g></g>`;
}

/** Rangee de fanions de papel picado (zigzag + decoupes) : corde de x0 a x0+w en y0, n fanions de hauteur fh. */
function oxFlags(x0, y0, w, n, seed, cols, fh) {
  const rnd = rng(seed), step = w / n, fw = step * 0.84;
  let s = `<path d="M${r1(x0)} ${r1(y0)}H${r1(x0 + w)}" stroke="#F5E6C8" stroke-width="3" opacity=".85"/>`;
  for (let i = 0; i < n; i++) {
    const cx = x0 + step * (i + 0.5), xa = cx - fw / 2, xb = cx + fw / 2, hh = fh * (0.9 + rnd() * 0.15), c = cols[i % cols.length], teeth = 5, tw = fw / teeth;
    let d = `M${r1(xa)} ${r1(y0)}H${r1(xb)}V${r1(y0 + hh - 10)}`;
    for (let t = teeth; t > 0; t--) d += `L${r1(xa + tw * (t - 0.5))} ${r1(y0 + hh)}L${r1(xa + tw * (t - 1))} ${r1(y0 + hh - 10)}`;
    d += 'Z' + circlePath(cx, y0 + hh * 0.46, fw * 0.17) + diamondPath(cx, y0 + hh * 0.2, fw * 0.07, fw * 0.1) + diamondPath(cx, y0 + hh * 0.74, fw * 0.07, fw * 0.1) + starPath(cx - fw * 0.28, y0 + hh * 0.46, fw * 0.1, fw * 0.045, 4, 0) + starPath(cx + fw * 0.28, y0 + hh * 0.46, fw * 0.1, fw * 0.045, 4, 0);
    s += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="${d}" fill="${c}" fill-rule="evenodd"/></g>`;
  }
  return s;
}

/** Calavera de azucar souriante (centre cx, cy, rayon r) : yeux a petales, nez, sourire a dents, fleurs au front. pal = 3 couleurs. */
function oxCalavera(cx, cy, r, pal) {
  pal = pal || [OX.magenta, OX.turq, OX.amar];
  let s = `<ellipse cx="${r1(cx)}" cy="${r1(cy + r * 0.78)}" rx="${r1(r * 0.62)}" ry="${r1(r * 0.42)}" fill="#FFF6E4"/><ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(r)}" ry="${r1(r * 1.02)}" fill="#FFF6E4"/><ellipse cx="${r1(cx + r * 0.22)}" cy="${r1(cy + r * 0.1)}" rx="${r1(r * 0.7)}" ry="${r1(r * 0.85)}" fill="#EBD9B8" opacity=".35"/>`;
  s += `<path d="M${r1(cx - r * 0.5)} ${r1(cy - r * 0.62)}Q${r1(cx)} ${r1(cy - r * 0.95)} ${r1(cx + r * 0.5)} ${r1(cy - r * 0.62)}" stroke="${pal[0]}" stroke-width="${r1(r * 0.1)}" fill="none" stroke-linecap="round"/>`;
  s += `<path d="${diamondPath(r1(cx), r1(cy - r * 0.68), r1(r * 0.1), r1(r * 0.16))}" fill="${pal[2]}"/><circle cx="${r1(cx - r * 0.62)}" cy="${r1(cy - r * 0.35)}" r="${r1(r * 0.07)}" fill="${pal[1]}"/><circle cx="${r1(cx + r * 0.62)}" cy="${r1(cy - r * 0.35)}" r="${r1(r * 0.07)}" fill="${pal[1]}"/>`;
  [-1, 1].forEach((sx, k) => {
    const ex = cx + sx * r * 0.38, ey = cy - r * 0.08;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; s += `<ellipse cx="${r1(ex + Math.cos(a) * r * 0.31)}" cy="${r1(ey + Math.sin(a) * r * 0.31)}" rx="${r1(r * 0.09)}" ry="${r1(r * 0.06)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(ex + Math.cos(a) * r * 0.31)} ${r1(ey + Math.sin(a) * r * 0.31)})" fill="${pal[k ? 0 : 2]}"/>`; }
    s += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(r * 0.26)}" fill="${pal[k ? 1 : 0]}"/><circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(r * 0.17)}" fill="#2A1040"/><circle cx="${r1(ex + r * 0.05)}" cy="${r1(ey - r * 0.05)}" r="${r1(r * 0.05)}" fill="#fff"/>`;
  });
  s += `<path d="M${r1(cx)} ${r1(cy + r * 0.2)}l${r1(-r * 0.09)} ${r1(r * 0.17)}h${r1(r * 0.18)}Z" fill="#2A1040"/>`;
  s += `<path d="M${r1(cx - r * 0.5)} ${r1(cy + r * 0.52)}Q${r1(cx)} ${r1(cy + r * 0.86)} ${r1(cx + r * 0.5)} ${r1(cy + r * 0.52)}" stroke="#2A1040" stroke-width="${r1(r * 0.055)}" fill="none" stroke-linecap="round"/>`;
  for (let i = -2; i <= 2; i++) s += `<path d="M${r1(cx + i * r * 0.17)} ${r1(cy + r * 0.62 + Math.abs(i) * r * 0.025)}v${r1(r * 0.17)}" stroke="#2A1040" stroke-width="${r1(r * 0.04)}" stroke-linecap="round"/>`;
  s += `<circle cx="${r1(cx - r * 0.7)}" cy="${r1(cy + r * 0.3)}" r="${r1(r * 0.09)}" fill="${pal[0]}"/><circle cx="${r1(cx + r * 0.7)}" cy="${r1(cy + r * 0.3)}" r="${r1(r * 0.09)}" fill="${pal[0]}"/>`;
  return `<g class="ox-skull">${s}</g>`;
}

/** Catrina stylisee (buste) : base en (cx, baseY), echelle k. Grand chapeau a fleurs, calavera, col a volants. */
function oxCatrina(cx, baseY, k) {
  const hy = baseY - 300 * k, r = 62 * k;
  let s = `<path d="M${r1(cx - 150 * k)} ${r1(baseY)}Q${r1(cx - 140 * k)} ${r1(baseY - 150 * k)} ${r1(cx - 40 * k)} ${r1(baseY - 190 * k)}H${r1(cx + 40 * k)}Q${r1(cx + 140 * k)} ${r1(baseY - 150 * k)} ${r1(cx + 150 * k)} ${r1(baseY)}Z" fill="${OX.magenta}"/>`;
  for (let i = 0; i < 7; i++) s += `<circle cx="${r1(cx - 108 * k + i * 36 * k)}" cy="${r1(baseY - 176 * k + Math.abs(3 - i) * 8 * k)}" r="${r1(22 * k)}" fill="${i % 2 ? OX.turq : OX.amar}"/>`;
  s += `<path d="M${r1(cx - 30 * k)} ${r1(baseY - 200 * k)}h${r1(60 * k)}v${r1(34 * k)}h${r1(-60 * k)}Z" fill="#FFF6E4"/>` + oxCalavera(cx, hy, r, [OX.turq, OX.magenta, OX.amar]);
  s += `<ellipse cx="${r1(cx)}" cy="${r1(hy - r * 0.78)}" rx="${r1(160 * k)}" ry="${r1(30 * k)}" fill="#2A1040"/><path d="M${r1(cx - 76 * k)} ${r1(hy - r * 0.8)}Q${r1(cx - 70 * k)} ${r1(hy - 150 * k)} ${r1(cx)} ${r1(hy - 150 * k)}Q${r1(cx + 70 * k)} ${r1(hy - 150 * k)} ${r1(cx + 76 * k)} ${r1(hy - r * 0.8)}Z" fill="#3B1B5C"/><path d="M${r1(cx - 76 * k)} ${r1(hy - r * 0.8)}H${r1(cx + 76 * k)}" stroke="${OX.magenta}" stroke-width="${r1(14 * k)}"/>`;
  s += `<path d="M${r1(cx + 40 * k)} ${r1(hy - 140 * k)}Q${r1(cx + 150 * k)} ${r1(hy - 230 * k)} ${r1(cx + 190 * k)} ${r1(hy - 120 * k)}Q${r1(cx + 120 * k)} ${r1(hy - 160 * k)} ${r1(cx + 40 * k)} ${r1(hy - 110 * k)}Z" fill="${OX.turq}"/>`;
  s += marigoldFlower(cx - 60 * k, hy - 124 * k, 24 * k, OX.naranja, OX.amar) + marigoldFlower(cx + 4 * k, hy - 146 * k, 26 * k, OX.naranja, OX.amar) + marigoldFlower(cx + 60 * k, hy - 118 * k, 22 * k, OX.rosa, '#FF9AC1');
  return `<g class="ox-catrina">${s}</g>`;
}

/** Pan de muerto : miche doree, os en croix, boule au centre, sucre. */
function oxPan(cx, cy, r) {
  let s = `<ellipse cx="${r1(cx)}" cy="${r1(cy + r * 0.1)}" rx="${r1(r)}" ry="${r1(r * 0.72)}" fill="#B8672F"/><ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(r)}" ry="${r1(r * 0.72)}" fill="#E39A4E"/><ellipse cx="${r1(cx - r * 0.2)}" cy="${r1(cy - r * 0.2)}" rx="${r1(r * 0.55)}" ry="${r1(r * 0.3)}" fill="#F2B772" opacity=".7"/>`;
  [[-1, -0.1], [1, -0.1], [-0.6, 0.45], [0.6, 0.45]].forEach((b) => { s += `<path d="M${r1(cx)} ${r1(cy)}L${r1(cx + b[0] * r * 0.82)} ${r1(cy + b[1] * r * 0.6)}" stroke="#F2B772" stroke-width="${r1(r * 0.17)}" stroke-linecap="round"/>`; });
  s += `<circle cx="${r1(cx)}" cy="${r1(cy - r * 0.06)}" r="${r1(r * 0.2)}" fill="#F2B772"/>`;
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; s += `<circle cx="${r1(cx + Math.cos(a) * r * 0.6)}" cy="${r1(cy + Math.sin(a) * r * 0.4)}" r="${r1(r * 0.04)}" fill="#FFF6E4" opacity=".85"/>`; }
  return `<g class="of-pan">${s}</g>`;
}

/** Photo encadree (cadre dore, silhouette sepia) : coin haut-gauche (x, y), taille w x h ; kind 0 (cheveux longs) | 1 (chapeau + moustache) | 2 (enfant). */
function oxPhoto(x, y, w, h, kind, gid) {
  const cx = x + w / 2, hy = y + h * 0.42, hr = w * (kind === 2 ? 0.2 : 0.17);
  let sil = `<ellipse cx="${r1(cx)}" cy="${r1(y + h * 0.95)}" rx="${r1(w * 0.3)}" ry="${r1(h * 0.28)}" fill="#6B4A32"/><circle cx="${r1(cx)}" cy="${r1(hy)}" r="${r1(hr)}" fill="#8A6444"/>`;
  if (kind === 0) sil += `<path d="M${r1(cx - hr * 1.15)} ${r1(hy)}Q${r1(cx - hr * 1.2)} ${r1(hy - hr * 1.4)} ${r1(cx)} ${r1(hy - hr * 1.3)}Q${r1(cx + hr * 1.2)} ${r1(hy - hr * 1.4)} ${r1(cx + hr * 1.15)} ${r1(hy)}L${r1(cx + hr * 1.3)} ${r1(hy + hr * 2)}H${r1(cx - hr * 1.3)}Z" fill="#3B2A1E" opacity=".9"/><circle cx="${r1(cx)}" cy="${r1(hy + hr * 0.1)}" r="${r1(hr * 0.9)}" fill="#8A6444"/>`;
  if (kind === 1) sil += `<ellipse cx="${r1(cx)}" cy="${r1(hy - hr * 0.8)}" rx="${r1(hr * 1.7)}" ry="${r1(hr * 0.3)}" fill="#3B2A1E"/><path d="M${r1(cx - hr * 0.9)} ${r1(hy - hr * 0.8)}Q${r1(cx)} ${r1(hy - hr * 2)} ${r1(cx + hr * 0.9)} ${r1(hy - hr * 0.8)}Z" fill="#3B2A1E"/><path d="M${r1(cx - hr * 0.6)} ${r1(hy + hr * 0.4)}Q${r1(cx)} ${r1(hy + hr * 0.1)} ${r1(cx + hr * 0.6)} ${r1(hy + hr * 0.4)}Q${r1(cx)} ${r1(hy + hr * 0.7)} ${r1(cx - hr * 0.6)} ${r1(hy + hr * 0.4)}Z" fill="#2A1A10"/>`;
  return `<g class="of-foto"><circle class="of-glow" cx="${r1(cx)}" cy="${r1(y + h / 2)}" r="${r1(w * 0.8)}" fill="url(#${gid})" opacity=".5"/><rect x="${r1(x - 10)}" y="${r1(y - 10)}" width="${r1(w + 20)}" height="${r1(h + 20)}" rx="10" fill="${OX.amar}"/><rect x="${r1(x - 4)}" y="${r1(y - 4)}" width="${r1(w + 8)}" height="${r1(h + 8)}" rx="6" fill="${OX.magenta}"/><rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="3" fill="#E3CFA8"/><clipPath id="${gid}-c${kind}${Math.round(x)}"><rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}"/></clipPath><g clip-path="url(#${gid}-c${kind}${Math.round(x)})">${sil}</g></g>`;
}

/** Fleur de cempasuchil plus grosse avec tige/feuilles pour vase (cx, base, k). */
function oxVase(cx, base, k, flowers) {
  let s = `<path d="M${r1(cx - 26 * k)} ${r1(base)}h${r1(52 * k)}l${r1(-8 * k)} ${r1(-60 * k)}h${r1(-36 * k)}Z" fill="${OX.turq}"/><path d="M${r1(cx - 26 * k)} ${r1(base - 36 * k)}h${r1(52 * k)}" stroke="#fff" stroke-width="${r1(5 * k)}" opacity=".5"/>`;
  [[-34, -100], [0, -126], [34, -98], [-12, -86], [16, -74]].slice(0, flowers || 5).forEach((f, i) => { s += `<path d="M${r1(cx)} ${r1(base - 58 * k)}L${r1(cx + f[0] * k)} ${r1(base + f[1] * k)}" stroke="#2F7F5A" stroke-width="${r1(5 * k)}"/>` + marigoldFlower(cx + f[0] * k, base + f[1] * k, 25 * k, i % 2 ? OX.naranja : OX.amar, i % 2 ? OX.amar : OX.naranja); });
  return `<g class="of-flor">${s}</g>`;
}

/**
 * Ofrenda a trois etages (viewBox 1000 x 820). Groupes animables : .of-cloth (nappes + papel picado, 3 etages .of-tier), .of-foto (x3), .of-vela (x6, .of-flame/.of-glow),
 * .of-flor (x4), .of-pan (x3), .of-comida (assiette de mole + verre d'eau), .of-calavera, .of-arco (arche de fleurs). opts : uid, width.
 */
export function ofrendaSvg(opts) {
  opts = opts || {};
  const id = opts.uid || uid('of'), gid = id + '-g', W = opts.width || 1000, H = Math.round(W * 0.82);
  const tier = (x, y, w, h, c, c2, n) => `<g class="of-tier"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="14" fill="${c2}"/>${oxFlags(x, y + h - 2, w, n, x + 5, [OX.amar, OX.turq, OX.magenta, OX.naranja], 52).replace('stroke="#F5E6C8"', 'stroke="none"')}</g>`;
  let s = `<defs>${oxGlowDef(gid)}</defs>`;
  s += `<g class="of-arco"><path d="M120 760V260Q500 20 880 260V760" stroke="#2F7F5A" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = Math.PI * (0.06 + i * 0.079); return marigoldFlower(Math.round(500 - Math.cos(a) * 394), Math.round(300 - Math.sin(a) * 270 + (i < 2 || i > 9 ? 120 : 0)), 22, i % 2 ? OX.naranja : OX.amar, i % 2 ? OX.amar : OX.naranja); }).join('')}</g>`;
  s += `<g class="of-cloth">` + tier(300, 230, 400, 150, '#6B3E9A', '#8E5DBF', 6) + tier(190, 380, 620, 170, '#9A2F6B', '#C9487F', 9) + tier(70, 550, 860, 200, '#2B5FB0', '#4F8FE8', 12) + `</g>`;
  s += `<g class="of-top">${oxFlags(150, 90, 700, 9, 11, [OX.magenta, OX.turq, OX.amar, OX.viol, OX.naranja], 100)}</g>`;
  // etage haut : trois photos
  s += oxPhoto(396, 100, 90, 110, 0, gid).replace('class="of-foto"', 'class="of-foto" data-i="0"');
  s += oxPhoto(514, 100, 90, 110, 1, gid).replace('class="of-foto"', 'class="of-foto" data-i="1"');
  s += `<g class="of-foto-big">${oxPhoto(446, 262, 108, 122, 2, gid).replace('class="of-foto"', 'class="of-foto" data-i="2"')}</g>`;
  // bougies
  [[330, 380, 70], [670, 380, 70], [240, 550, 56], [760, 550, 56], [150, 750, 70], [850, 750, 70]].forEach((c, i) => { s += oxCandle(c[0], c[1], c[2], gid, 1.1).replace('class="of-vela"', `class="of-vela" data-i="${i}"`); });
  // fleurs
  s += oxVase(400, 380, 0.9, 4).replace('class="of-flor"', 'class="of-flor" data-i="0"') + oxVase(600, 380, 0.9, 4).replace('class="of-flor"', 'class="of-flor" data-i="1"');
  s += oxVase(330, 550, 1, 5).replace('class="of-flor"', 'class="of-flor" data-i="2"') + oxVase(670, 550, 1, 5).replace('class="of-flor"', 'class="of-flor" data-i="3"');
  // calavera de azucar
  s += `<g class="of-calavera">${oxCalavera(500, 500, 40, [OX.turq, OX.magenta, OX.amar])}</g>`;
  // pan de muerto
  [[250, 745, 50], [500, 748, 54], [750, 745, 50]].forEach((p, i) => { s += oxPan(p[0], p[1] - 30, p[2]).replace('class="of-pan"', `class="of-pan" data-i="${i}"`); });
  // comida favorita : assiette de mole + verre d'eau + tamal
  s += `<g class="of-comida"><ellipse cx="380" cy="742" rx="64" ry="18" fill="#F5E6C8"/><ellipse cx="380" cy="736" rx="52" ry="13" fill="#6B2A1E"/><circle cx="360" cy="728" r="12" fill="#C9573B"/><circle cx="392" cy="730" r="11" fill="#FFC83D"/><path d="M606 744h40l-6 -64h-28Z" fill="#CFE9F5" opacity=".7"/><path d="M609 710h34" stroke="#fff" stroke-width="4" opacity=".7"/><ellipse cx="500" cy="690" rx="0.1" ry="0.1" fill="none"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 820" width="${W}" height="${H}" class="of-svg" aria-hidden="true" style="overflow:visible">${s}</svg>`;
}

/** Accessoires isoles : 'calavera' (opts.pal) | 'catrina' | 'pan' | 'vela' | 'flor' | 'foto'. Renvoie un SVG (viewBox centre sur l'objet). opts : width, uid, pal, kind. */
export function oxProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('oxp'), gid = id + '-g', W = opts.width || 200;
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round((W * h) / 200)}" class="ox-prop" aria-hidden="true" style="overflow:visible"><defs>${oxGlowDef(gid)}</defs>${inner}</svg>`;
  if (key === 'calavera') return mk('0 0 200 200', 200, oxCalavera(100, 100, 80, opts.pal));
  if (key === 'catrina') return mk('0 0 400 700', 700, oxCatrina(200, 700, 1.3));
  if (key === 'pan') return mk('0 0 200 140', 140, oxPan(100, 70, 90));
  if (key === 'vela') return mk('0 0 200 300', 300, oxCandle(100, 280, 120, gid, 2));
  if (key === 'flor') return mk('0 0 200 200', 200, marigoldFlower(100, 100, 80, OX.naranja, OX.amar));
  return mk('0 0 200 240', 240, oxPhoto(40, 30, 120, 150, opts.kind || 0, gid));
}

/** Sceau de papier generique (laurier, etoile, fleur de cempasuchil) : aucun symbole reel. viewBox 400 x 400. */
export function oxSeal(opts) {
  opts = opts || {};
  const W = opts.width || 300;
  let leaves = '';
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9, a = Math.PI * (0.55 + 0.9 * t); // arc de gauche a droite en bas
    const lx = 200 + Math.cos(a) * 138, ly = 200 - Math.sin(a) * 138 * -1;
    leaves += `<ellipse cx="${r1(lx)}" cy="${r1(ly)}" rx="24" ry="10" transform="rotate(${r1((a * 180) / Math.PI + 90)} ${r1(lx)} ${r1(ly)})" fill="${i % 2 ? '#0E9F6E' : '#42E0A0'}"/>`;
    const mx = 400 - lx;
    leaves += `<ellipse cx="${r1(mx)}" cy="${r1(ly)}" rx="24" ry="10" transform="rotate(${r1(-(a * 180) / Math.PI - 90)} ${r1(mx)} ${r1(ly)})" fill="${i % 2 ? '#0E9F6E' : '#42E0A0'}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${W}" height="${W}" class="ox-seal" aria-hidden="true" style="overflow:visible"><circle cx="200" cy="200" r="168" fill="#F5E6C8"/><circle cx="200" cy="200" r="150" fill="none" stroke="${OX.magenta}" stroke-width="8"/><circle cx="200" cy="200" r="128" fill="#2B1456"/>${leaves}${marigoldFlower(200, 196, 64, OX.naranja, OX.amar)}<path d="${sparklePath(200, 96, 30, 8)}" fill="#FFE9A8"/></svg>`;
}

// ---------------------------------------------------------------- panorama d'Oaxaca au crepuscule (3200 x 1200)
export const OAXACA_SKY = { W: 3200, H: 1200, street: 880 };
/** Retourne { sky, sun (lune), far, mid, near, W, H, moonX, moonY, doors : [{ x, base }], stall : { x } }. Parallaxe : sky .15, sun .2, far .3, mid .6, near 1. */
export function oaxacaSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('ox'), g = (n) => `${id}-${n}`, W = OAXACA_SKY.W, H = OAXACA_SKY.H, base = 860, rnd = rng(opts.seed || 41);
  let stars = ''; for (let i = 0; i < 46; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(20 + rnd() * 380)}" r="${r1(1.5 + rnd() * 2.6)}" fill="#FFF3D1" opacity="${r1(0.4 + rnd() * 0.5)}"/>`;
  let clouds = ''; [[500, 330, 520, 70], [1500, 240, 620, 80], [2500, 380, 540, 70]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 71 + i * 4, 'dusk'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1252"/><stop offset=".3" stop-color="#4A2078"/><stop offset=".5" stop-color="#B2406F"/><stop offset=".64" stop-color="#F0703F"/><stop offset=".74" stop-color="#FFA33A"/></linearGradient></defs>${scRect(0, 0, W, 900, `url(#${g('s')})`)}${stars}${clouds}`, 'ox-sky');
  const mx = 2250, my = 300;
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('m')}"><stop offset="0" stop-color="#FFF3D1" stop-opacity=".7"/><stop offset=".4" stop-color="#FFD98A" stop-opacity=".25"/><stop offset="1" stop-color="#FF9F1C" stop-opacity="0"/></radialGradient></defs><circle cx="${mx}" cy="${my}" r="330" fill="url(#${g('m')})"/><circle class="sk-disc" cx="${mx}" cy="${my}" r="104" fill="#FFF3D1"/><circle cx="${mx - 30}" cy="${my - 20}" r="22" fill="#F1DDAE" opacity=".7"/><circle cx="${mx + 34}" cy="${my + 28}" r="16" fill="#F1DDAE" opacity=".7"/>`, 'ox-sun');
  // lointain : collines + eglise baroque en cantera + pyramide a degres
  let hills = `M0 ${base - 20}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(base - 120 - 70 * Math.sin(x / 420) - 28 * Math.sin(x / 130 + 1))}`; hills += `L${W} ${base}L0 ${base}Z`;
  const ch = (x) => `<g fill="#5A2F6E"><rect x="${x}" y="${base - 300}" width="360" height="300"/><rect x="${x - 40}" y="${base - 190}" width="440" height="190"/><rect x="${x - 10}" y="${base - 380}" width="100" height="120"/><rect x="${x + 270}" y="${base - 380}" width="100" height="120"/><path d="M${x - 10} ${base - 380}Q${x + 40} ${base - 450} ${x + 90} ${base - 380}Z"/><path d="M${x + 270} ${base - 380}Q${x + 320} ${base - 450} ${x + 370} ${base - 380}Z"/><path d="M${x + 110} ${base - 300}Q${x + 180} ${base - 420} ${x + 250} ${base - 300}Z"/></g><g fill="#FFD98A" opacity=".55"><path d="${archOpen(x + 150, base - 120, 60, 110)}"/><circle cx="${x + 180}" cy="${base - 240}" r="22"/></g>`;
  const pyr = (x) => `<g fill="#4B2566"><path d="M${x} ${base}L${x + 40} ${base - 70}H${x + 340}L${x + 380} ${base}Z"/><path d="M${x + 60} ${base - 70}L${x + 90} ${base - 140}H${x + 290}L${x + 320} ${base - 70}Z"/><path d="M${x + 120} ${base - 140}L${x + 140} ${base - 200}H${x + 240}L${x + 260} ${base - 140}Z"/></g>`;
  const far = scSvg(W, H, `<path d="${hills}" fill="#6A3380" opacity=".8"/>${pyr(2750)}<g transform="translate(1080 ${base}) scale(1.6) translate(-1080 ${-base})">${ch(900)}</g><g opacity=".75" transform="translate(2180 ${base}) scale(1.4) translate(-2180 ${-base})">${ch(2000).replace(/#5A2F6E/g, '#6A3380')}</g>${scRect(0, base - 2, W, 14, '#5A2F6E')}`, 'ox-far');
  // milieu : facades coloniales, fenetres allumees, guirlandes de papel picado
  const tones = [OX.ocre, OX.rosa, OX.turq, OX.azul, OX.terra, OX.amar, OX.viol];
  let houses = '', garl = '', x = -40, n = 0; const doors = [], tops = [];
  while (x < W + 40) {
    const w = 250 + rnd() * 100, h = 320 + rnd() * 100, c = tones[n % tones.length]; n++;
    houses += `<g class="ox-house">${scRect(x, base - h, w, h, c)}${scRect(x + w - 16, base - h, 16, h, '#000', 'opacity=".12"')}${scRect(x - 6, base - h - 14, w + 12, 18, shade(c, -0.2))}${scRect(x, base - 44, w, 44, shade(c, -0.18))}`;
    const nw = 2;
    for (let i = 0; i < nw; i++) { const wx = i ? x + w - 22 - 46 : x + 22; houses += `<g class="ox-win"><path d="${archOpen(wx, base - h + 160, 46, 86)}" fill="#FFD98A"/><path d="M${wx + 23} ${base - h + 74}V${base - h + 160}M${wx} ${base - h + 118}H${wx + 46}" stroke="#7E2F1E" stroke-width="4"/></g>${scRect(wx - 8, base - h + 162, 62, 8, shade(c, -0.3))}`; }
    const dx = x + w / 2 - 48; houses += `<path d="${archOpen(dx, base, 96, 250)}" fill="#3B1B3C"/><path d="${archOpen(dx + 10, base, 76, 236)}" fill="#6B3E52" opacity=".7"/>`;
    doors.push({ x: Math.round(dx + 48), base });
    houses += '</g>'; tops.push({ x: x + w / 2, y: base - h - 14 }); x += w + 14;
  }
  for (let i = 0; i < tops.length - 1; i += 2) {
    const a = tops[i], b = tops[i + 1], mid = (a.x + b.x) / 2, sag = 70, cols = [OX.magenta, OX.turq, OX.amar, OX.viol, OX.naranja];
    garl += `<path d="M${r1(a.x)} ${r1(a.y)}Q${r1(mid)} ${r1(a.y + sag * 2)} ${r1(b.x)} ${r1(b.y)}" stroke="#F5E6C8" stroke-width="3" fill="none" opacity=".85"/>`;
    for (let k = 1; k <= 7; k++) { const t = k / 8, fx = a.x + (b.x - a.x) * t, fy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * (a.y + sag * 2) + t * t * b.y; garl += `<g class="m-flag" data-px="${r1(fx)}" data-py="${r1(fy)}"><path d="M${r1(fx - 20)} ${r1(fy)}H${r1(fx + 20)}V${r1(fy + 44)}L${r1(fx + 10)} ${r1(fy + 38)}L${r1(fx)} ${r1(fy + 46)}L${r1(fx - 10)} ${r1(fy + 38)}L${r1(fx - 20)} ${r1(fy + 44)}Z${circlePath(fx, fy + 22, 7)}" fill="${cols[(i + k) % cols.length]}" fill-rule="evenodd"/></g>`; }
  }
  // premier plan : pavés, petales de cempasuchil, bougies le long de la rue
  const gid = g('cg'); let stones = '', petals = '', can = '';
  for (let r = 0; r < 7; r++) { const y = 900 + r * r * 5 + r * 22; for (let xx = (r % 2) * 50; xx < W; xx += 100 + r * 8) stones += `<path d="M${xx} ${y}q${50 + r * 4} -16 ${100 + r * 8} 0" stroke="#2B1840" stroke-width="3" fill="none" opacity=".45"/>`; }
  for (let i = 0; i < 90; i++) { const px = 40 + (i / 90) * 3100 + (rnd() - 0.5) * 60, py = 960 + Math.sin(i * 0.3) * 40 + (rnd() - 0.5) * 80; petals += `<ellipse class="ox-petal" cx="${r1(px)}" cy="${r1(py)}" rx="${r1(9 + rnd() * 6)}" ry="${r1(5 + rnd() * 3)}" transform="rotate(${r1(rnd() * 180)} ${r1(px)} ${r1(py)})" fill="${i % 3 ? OX.naranja : OX.amar}"/>`; }
  for (let i = 0; i < 9; i++) can += oxCandle(180 + i * 360, 1150 - (i % 2) * 40, 54, gid, 1.2);
  const mid = scSvg(W, H, `${houses}${garl}${scRect(0, base, W, H - base, '#5A3358')}${scRect(0, base + 14, W, 10, '#7A4A6E')}${stones}`, 'ox-mid');
  const near = scSvg(W, H, `<defs>${oxGlowDef(gid)}</defs>${petals}${can}`, 'ox-near');
  return { sky, sun, far, mid, near, W, H, moonX: mx, moonY: my, doors, stall: { x: 1950 } };
}

/** Etal de rue (viewBox 640 x 420) : table a nappe brodee, pan de muerto, calaveras de azucar, alebrijes, fanions. Pied de table en (320, 410). */
export function oaxacaStall(opts) {
  opts = opts || {};
  const W = opts.width || 640;
  let s = `<rect x="40" y="70" width="12" height="340" fill="#6B3E26"/><rect x="588" y="70" width="12" height="340" fill="#6B3E26"/><path d="M20 126Q320 100 620 126" stroke="#F5E6C8" stroke-width="4" fill="none"/>${oxFlags(30, 126, 150, 3, 5, [OX.amar, OX.turq, OX.magenta], 60).replace(/<path d="M30 126H180"[^>]*>/, "")}${oxFlags(460, 126, 150, 3, 7, [OX.viol, OX.naranja, OX.turq], 60).replace(/<path d="M460 126H610"[^>]*>/, "")}`;
  s += `<rect x="40" y="250" width="560" height="160" fill="${OX.viol}"/><rect x="40" y="250" width="560" height="14" fill="#B58BE0"/>${embroideryBand(60, 350, 520, 36, '#FFFDF4', OX.magenta)}`;
  [90, 170, 250].forEach((x, i) => { s += oxPan(x + 30, 232, 40 + (i % 2) * 6); });
  [[360, '#D93472'], [440, '#19B7AA'], [520, '#FFC83D']].forEach((c, i) => { s += oxCalavera(c[0] + 10, 214, 34, [c[1], OX.naranja, OX.turq]); });
  [[96, 172], [560, 172]].forEach((a, i) => { s += `<g class="ox-alebrije"><ellipse cx="${a[0]}" cy="${a[1]}" rx="46" ry="26" fill="${i ? OX.turq : OX.naranja}"/><circle cx="${a[0] + 44}" cy="${a[1] - 18}" r="22" fill="${i ? OX.amar : OX.magenta}"/><path d="M${a[0] + 36} ${a[1] - 34}l-6 -22l16 12ZM${a[0] + 56} ${a[1] - 34}l8 -20l6 22Z" fill="${OX.viol}"/><circle cx="${a[0] + 50}" cy="${a[1] - 20}" r="4" fill="#2A1040"/><path d="M${a[0] - 40} ${a[1] + 20}v28M${a[0] - 14} ${a[1] + 24}v26M${a[0] + 14} ${a[1] + 24}v26M${a[0] + 36} ${a[1] + 20}v28" stroke="#6B3E26" stroke-width="7" stroke-linecap="round"/><g fill="#fff" opacity=".8"><circle cx="${a[0] - 20}" cy="${a[1] - 4}" r="5"/><circle cx="${a[0]}" cy="${a[1] + 6}" r="5"/><circle cx="${a[0] + 16}" cy="${a[1] - 8}" r="5"/></g></g>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" width="${W}" height="${Math.round(W * 420 / 640)}" class="ox-stall" aria-hidden="true" style="overflow:visible">${s}</svg>`;
}

// ---------------------------------------------------------------- patio d'Oaxaca de nuit avec petit autel (2400 x 1200)
export const OX_PATIO = { W: 2400, H: 1200, floor: 900, altar: { x: 640, y: 760 } };
/** Retourne { back, front, light, W, H, floor, altar, candles : [{x, y}] }. Flammes : .of-flame (pied data-px/data-py) ; halos .of-glow ; tout l'autel dans back. */
export function patioOfrenda(opts) {
  opts = opts || {};
  const id = opts.uid || uid('po'), g = (n) => `${id}-${n}`, W = OX_PATIO.W, H = OX_PATIO.H, fl = OX_PATIO.floor, A = OX_PATIO.altar, rnd = rng(opts.seed || 52), gid = g('cg');
  let stars = ''; for (let i = 0; i < 34; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(10 + rnd() * 110)}" r="${r1(1.4 + rnd() * 2.2)}" fill="#FFF3D1" opacity="${r1(0.4 + rnd() * 0.5)}"/>`;
  let wall = `<path d="M0 ${fl}V230H${W}V${fl}Z" fill="url(#${g('w')})"/>`;
  for (let i = 0; i < 30; i++) wall += `<path d="M${r1(rnd() * W)} ${r1(260 + rnd() * 600)}h${r1(60 + rnd() * 120)}" stroke="#5A2A2A" stroke-width="3" opacity=".12"/>`;
  // arche de fond (porte vers la rue de nuit) + fenetre
  wall += `<path d="${archOpen(1500, fl, 300, 520)}" fill="#1A1348"/><path d="${archOpen(1500, fl, 300, 520)}" fill="none" stroke="#E0699A" stroke-width="16"/><path d="${archOpen(1530, fl - 330, 240, 200)}" fill="#2B1F6E" opacity=".0"/>` + `<g fill="#FFD98A" opacity=".5">${[0, 1, 2].map((i) => `<circle cx="${1580 + i * 70}" cy="${fl - 360 - (i % 2) * 40}" r="6"/>`).join('')}</g>`;
  wall += `<path d="${archOpen(1890, fl - 150, 230, 230)}" fill="#1A1348"/><path d="${archOpen(1890, fl - 150, 230, 230)}" fill="none" stroke="#19B7AA" stroke-width="14"/>`;
  // bandeau de papel picado sur le mur
  wall += `<g>${oxFlags(0, 290, W, 24, 8, [OX.magenta, OX.turq, OX.amar, OX.viol, OX.naranja], 96)}</g>`;
  // autel : table, nappe, retablo de papier, photos, fleurs, bougies
  const tx = A.x - 360, tw = 720, ty = A.y;
  let altar = `<g class="po-altar"><rect x="${tx}" y="${ty}" width="${tw}" height="${fl - ty}" fill="#8E3A5E"/><rect x="${tx - 14}" y="${ty - 18}" width="${tw + 28}" height="26" rx="8" fill="#B8537F"/>${oxFlags(tx - 14, fl - 4, tw + 28, 10, 9, [OX.amar, OX.turq, OX.naranja, OX.viol], 70).replace('stroke="#F5E6C8"', 'stroke="none"')}`;
  altar += `<rect x="${tx + 70}" y="${ty - 250}" width="${tw - 140}" height="240" rx="10" fill="#5A2F86"/><rect x="${tx + 70}" y="${ty - 250}" width="${tw - 140}" height="16" fill="#8E5DBF"/>${oxFlags(tx + 70, ty - 250, tw - 140, 7, 13, [OX.magenta, OX.turq, OX.amar, OX.naranja], 70).replace('stroke="#F5E6C8"', 'stroke="none"')}`;
  altar += oxPhoto(A.x - 70, ty - 200, 140, 170, 2, gid).replace('class="of-foto"', 'class="of-foto po-photo"') + oxPhoto(A.x - 250, ty - 190, 100, 130, 0, gid) + oxPhoto(A.x + 150, ty - 190, 100, 130, 1, gid);
  altar += oxVase(A.x - 300, ty - 6, 1.0, 4) + oxVase(A.x + 300, ty - 6, 1.0, 4) + oxPan(A.x - 130, ty - 40, 44) + oxPan(A.x + 130, ty - 40, 44) + oxCalavera(A.x, ty - 36, 36, [OX.turq, OX.magenta, OX.amar]);
  const cs = [[A.x - 210, ty - 6, 66], [A.x - 90, ty - 6, 50], [A.x + 20, ty - 6, 58], [A.x + 110, ty - 6, 50], [A.x + 220, ty - 6, 66]], candles = [];
  cs.forEach((c, i) => { altar += oxCandle(c[0], c[1], c[2], gid, 1.2).replace('class="of-vela"', `class="of-vela" data-i="${i}"`); candles.push({ x: c[0], y: c[1] - c[2] - 40 }); });
  altar += '</g>';
  // sol de dalles + chemin de petales vers l'autel
  let tiles = ''; for (let r = 0; r < 8; r++) { const y = fl + Math.pow(r / 8, 1.4) * (H - fl); tiles += `<path d="M-400 ${r1(y)}H${W + 400}" stroke="#2B1840" stroke-width="3" opacity=".4"/>`; }
  let pet = ''; for (let i = 0; i < 40; i++) { const px = 300 + i * 40 + (rnd() - 0.5) * 30, py = fl + 40 + (i % 5) * 30 + rnd() * 20; pet += `<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="12" ry="6" transform="rotate(${r1(rnd() * 180)} ${r1(px)} ${r1(py)})" fill="${i % 3 ? OX.naranja : OX.amar}" opacity=".95"/>`; }
  const back = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E3A55"/><stop offset="1" stop-color="#A4604A"/></linearGradient><linearGradient id="${g('sk')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15104A"/><stop offset="1" stop-color="#3A1F6E"/></linearGradient><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2C48"/><stop offset="1" stop-color="#2B1840"/></linearGradient>${oxGlowDef(gid)}</defs>${scRect(0, 0, W, 260, `url(#${g('sk')})`)}${stars}${wall}${scRect(0, 224, W, 22, '#B8672F')}<path d="M0 ${fl}H${W}L${W + 400} ${H}H-400Z" fill="url(#${g('f')})"/>${tiles}${pet}${altar}`, 'po-back');
  const leaf = (a, c, k) => `<path d="M0 0Q${52 * k} -90 0 -190Q${-52 * k} -90 0 0Z" fill="${c}" transform="rotate(${a})"/>`;
  const front = scSvg(W, H, [[110, 1110, 1.3, '#C9573B'], [2290, 1100, 1.4, '#2B5FB0']].map((p) => `<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><path d="M-70 0h140l-18 -150h-104Z" fill="${p[3]}"/><g transform="translate(0 -150)">${[-60, -30, 0, 30, 60].map((a, j) => leaf(a, ['#2F7F5A', '#0E9F6E', '#3F8A52'][j % 3], 0.9)).join('')}${marigoldFlower(-30, -150, 24, OX.naranja, OX.amar)}${marigoldFlower(26, -170, 24, OX.naranja, OX.amar)}</g></g>`).join(''), 'po-front');
  const light = scSvg(W, H, `<defs><radialGradient id="${g('lg')}"><stop offset="0" stop-color="#FFC96A" stop-opacity=".5"/><stop offset="1" stop-color="#FFC96A" stop-opacity="0"/></radialGradient></defs><ellipse class="po-light" cx="${A.x}" cy="${A.y - 100}" rx="760" ry="520" fill="url(#${g('lg')})"/>`, 'po-light');
  return { back, front, light, W, H, floor: fl, altar: A, candles };
}

// ---------------------------------------------------------------- chemin de petales (2400 x 1200) : rue de nuit, maison a la porte ouverte, petales et bougies
/** Retourne { svg, W, H, path : [[x,y]...] (centre de chaque petale, dans l'ordre), door : { x, y, w, h } }. Classes : .pp-petal (data-i), .pp-candle (.of-flame/.of-glow, data-i = indice du petale), .pp-door (halo), .pp-house. */
export function oaxacaPetalPath(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pp'), g = (n) => `${id}-${n}`, W = 2400, H = 1200, rnd = rng(opts.seed || 63), gid = g('cg');
  let stars = ''; for (let i = 0; i < 40; i++) stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(20 + rnd() * 330)}" r="${r1(1.4 + rnd() * 2.4)}" fill="#FFF3D1" opacity="${r1(0.4 + rnd() * 0.5)}"/>`;
  let row = ''; [[0, 240, 360], [380, 200, 320], [730, 260, 380], [1130, 190, 320]].forEach((h, i) => { row += `<g>${scRect(h[0], 700 - h[1], h[2] - 20, h[1], ['#2B2A7A', '#3A2A82', '#2F2478', '#3C3090'][i])}<path d="${archOpen(h[0] + 40, 700, 50, 90)}" fill="#FFD98A" opacity=".6"/><path d="${archOpen(h[0] + h[2] - 120, 700, 50, 90)}" fill="#FFD98A" opacity=".35"/></g>`; });
  const door = { x: 1880, y: 560, w: 200, h: 300 };
  const house = `<g class="pp-house">${scRect(1640, 330, 700, 530, '#E8A33A')}${scRect(1640, 330, 700, 20, '#B8672F')}${scRect(2300, 330, 40, 530, '#000', 'opacity=".14"')}${scRect(1640, 810, 700, 50, '#C9573B')}<path d="${archOpen(door.x - 20, 860, door.w + 40, door.h + 40)}" fill="#E0699A"/><path d="${archOpen(door.x, 860, door.w, door.h)}" fill="url(#${g('d')})"/><rect class="pp-door" x="${door.x - 90}" y="${door.y - 40}" width="${door.w + 180}" height="${door.h + 120}" rx="90" fill="url(#${g('dg')})" opacity="0"/><path d="${archOpen(1690, 640, 70, 110)}" fill="#3B1B3C"/><path d="${archOpen(2200, 640, 70, 110)}" fill="#3B1B3C"/>${scRect(1600, 860, 780, 24, '#7A4A6E')}</g>`;
  const fl = 860; let cob = ''; for (let r = 0; r < 8; r++) { const y = fl + 20 + r * r * 5 + r * 24; for (let xx = (r % 2) * 60; xx < W; xx += 120 + r * 8) cob += `<path d="M${xx} ${y}q${60 + r * 4} -16 ${120 + r * 8} 0" stroke="#2B1840" stroke-width="3" fill="none" opacity=".45"/>`; }
  // courbe du chemin : (120, 1080) -> (door.x + 100, 880), S legere
  const P = (t) => [120 + (door.x + 100 - 120) * t, 1080 - 200 * t + Math.sin(t * Math.PI * 2) * 70 * (1 - t * 0.6)];
  const path = []; let pet = '', can = '';
  for (let i = 0; i < 64; i++) { const t = i / 63, p = P(t), px = p[0] + (rnd() - 0.5) * 70, py = p[1] + (rnd() - 0.5) * 36; path.push([r1(px), r1(py)]); pet += `<ellipse class="pp-petal" data-i="${i}" cx="${r1(px)}" cy="${r1(py)}" rx="${r1(13 + rnd() * 6)}" ry="${r1(7 + rnd() * 3)}" transform="rotate(${r1(rnd() * 180)} ${r1(px)} ${r1(py)})" fill="${i % 3 ? OX.naranja : OX.amar}"/>`; }
  for (let i = 0; i < 64; i += 4) { const t = i / 63, p = P(t), side = (i / 4) % 2 ? 1 : -1; can += oxCandle(p[0] + side * 100, p[1] + 20 + side * 8, 46, gid, 1.2).replace('class="of-vela"', `class="of-vela pp-candle" data-i="${i}"`); }
  const svg = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1245"/><stop offset=".6" stop-color="#2A1A6E"/><stop offset="1" stop-color="#5A2A7A"/></linearGradient><linearGradient id="${g('d')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6A8"/><stop offset="1" stop-color="#F0964A"/></linearGradient><radialGradient id="${g('dg')}"><stop offset="0" stop-color="#FFC96A" stop-opacity=".6"/><stop offset="1" stop-color="#FFC96A" stop-opacity="0"/></radialGradient><linearGradient id="${g('f')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2C58"/><stop offset="1" stop-color="#2B1840"/></linearGradient>${oxGlowDef(gid)}</defs>${scRect(0, 0, W, 880, `url(#${g('s')})`)}${stars}<circle cx="520" cy="190" r="70" fill="#FFF3D1" opacity=".92"/>${row}${house}<path d="M0 ${fl}H${W}V${H}H0Z" fill="url(#${g('f')})"/>${cob}${can}${pet}`, 'pp-svg');
  return { svg, W, H, path, door };
}
