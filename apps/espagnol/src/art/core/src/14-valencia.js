// ---------------------------------------------------------------- Valencia (unite 5) : Ciudad de las Artes y las Ciencias (formes blanches simplifiees, aucun texte), bassins turquoise,
// horloges arretees a 12:05 (chiffres 7 segments dessines en paths), paella, fallas. Prefixe vl : tout le kit est concatene dans un seul scope.
// Monuments publics simplifies, aucune marque.

const VL = {
  w1: '#FBF8F1', w2: '#E2E9EE', w3: '#BCCBD8', w4: '#8FA4B8', agua: '#2CC4C8', agua2: '#12909F', agua3: '#0B6E80', azul: '#2F8FD6',
  sand: '#EADFC6', sand2: '#CFBB92', nar: '#FF8A1F', nar2: '#E86A0C', hoja: '#2E9E5B', hoja2: '#1F7A45', hoja3: '#52BE6E',
  hierro: '#2B3A55', hierro2: '#455572', oro: '#FFC83D', rojo: '#D8352A', crema: '#FFFDF4',
};

// ---------------------------------------------------------------- chiffres 7 segments (aucun texte)
const VL_SEGS = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function vlDigit(x, y, w, h, d, on, off) {
  const t = h * 0.14, g = 1.6;
  const H = (x0, y0, len) => `M${r1(x0)} ${r1(y0)}l${r1(t / 2)} ${r1(-t / 2)}h${r1(len - t)}l${r1(t / 2)} ${r1(t / 2)}l${r1(-t / 2)} ${r1(t / 2)}h${r1(-(len - t))}Z`;
  const V = (x0, y0, len) => `M${r1(x0)} ${r1(y0)}l${r1(t / 2)} ${r1(t / 2)}v${r1(len - t)}l${r1(-t / 2)} ${r1(t / 2)}l${r1(-t / 2)} ${r1(-t / 2)}v${r1(-(len - t))}Z`;
  const P = {
    a: H(x + g, y + t / 2, w - 2 * g), d: H(x + g, y + h - t / 2, w - 2 * g), g: H(x + g, y + h / 2, w - 2 * g),
    f: V(x + t / 2, y + g, h / 2 - g), e: V(x + t / 2, y + h / 2 + g * 0.2, h / 2 - g), b: V(x + w - t / 2, y + g, h / 2 - g), c: V(x + w - t / 2, y + h / 2 + g * 0.2, h / 2 - g),
  };
  const lit = VL_SEGS[d] || '';
  return Object.keys(P).map((k) => `<path d="${P[k]}" fill="${lit.indexOf(k) >= 0 ? on : off}"/>`).join('');
}
/** Groupe SVG des chiffres 'HH:MM' (repere local 0..w x 0..h). Renvoie { g, w, h }. opts : on, off, dw (largeur d'un chiffre), dh. */
function vlDigitsG(time, opts) {
  opts = opts || {};
  const on = opts.on || '#FF5A3C', off = opts.off || 'rgba(255,255,255,0.07)', dw = opts.dw || 56, dh = opts.dh || 96, gap = 14, col = 26;
  const ch = String(time).split(''); let x = 0, s = '';
  ch.forEach((c) => {
    if (c === ':') { s += `<circle cx="${x + col / 2}" cy="${dh * 0.32}" r="6" fill="${on}"/><circle cx="${x + col / 2}" cy="${dh * 0.68}" r="6" fill="${on}"/>`; x += col + gap * 0.4; }
    else { s += vlDigit(x, 0, dw, dh, +c, on, off); x += dw + gap; }
  });
  return { g: s, w: x - gap, h: dh };
}
/** Affichage numerique seul (SVG, fond sombre arrondi). time 'HH:MM'. opts : width, on, uid. */
export function vlDigital(time, opts) {
  opts = opts || {};
  const D = vlDigitsG(time, opts), pad = 26, W = D.w + pad * 2, H = D.h + pad * 2, ow = opts.width || 300;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r1(W)} ${r1(H)}" width="${ow}" height="${Math.round((ow * H) / W)}" class="vl-digital" style="overflow:visible" aria-hidden="true"><rect width="${r1(W)}" height="${r1(H)}" rx="18" fill="#16222E"/><rect x="5" y="5" width="${r1(W - 10)}" height="${r1(H - 10)}" rx="14" fill="none" stroke="#3A4C60" stroke-width="3"/><g transform="translate(${pad} ${pad})">${D.g}</g></svg>`;
}
/** Reveil numerique (400x300) : cloches, boitier bleu, ecran 7 segments. time 'HH:MM'. Parties : .vl-bellL / .vl-bellR (cloches), .vl-scr (ecran). */
export function vlAlarm(time, opts) {
  opts = opts || {};
  const D = vlDigitsG(time, { on: opts.on || '#FF5A3C', dw: 50, dh: 86 }), ow = opts.width || 300, sx = 200 - D.w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="${ow}" height="${Math.round(ow * 0.75)}" class="vl-alarm" style="overflow:visible" aria-hidden="true">
<path d="M70 262l-16 26M330 262l16 26" stroke="#1B2140" stroke-width="12" stroke-linecap="round"/>
<g class="vl-bellL" data-px="110" data-py="96"><path d="M62 92Q110 18 158 92Z" fill="#FFC83D"/><path d="M62 92H158V102H62Z" fill="#E0A020"/><circle cx="110" cy="40" r="8" fill="#E0A020"/></g>
<g class="vl-bellR" data-px="290" data-py="96"><path d="M242 92Q290 18 338 92Z" fill="#FFC83D"/><path d="M242 92H338V102H242Z" fill="#E0A020"/><circle cx="290" cy="40" r="8" fill="#E0A020"/></g>
<rect x="30" y="86" width="340" height="190" rx="46" fill="#2F8FD6"/><rect x="30" y="86" width="340" height="190" rx="46" fill="none" stroke="#1D5E96" stroke-width="6"/><path d="M60 110Q200 92 340 110" stroke="#fff" stroke-width="8" fill="none" opacity=".25" stroke-linecap="round"/>
<g class="vl-scr"><rect x="62" y="116" width="276" height="130" rx="22" fill="#16222E"/><g transform="translate(${r1(sx)} ${r1(138 + (86 - D.h) / 2 - 0)})">${D.g}</g></g>
<circle cx="200" cy="268" r="9" fill="#FFC83D"/></svg>`;
}

// ---------------------------------------------------------------- horloge de rue (300x520, avec pied) ou horloge murale (300x300)
/** Horloge. opts : width, post (pied, defaut true), hour / min (angles en degres, defaut 12:05 = 2.5 / 30), uid.
 *  Parties animables : .vl-hh / .vl-hm (aiguilles ; pivot svgOrigin "150 150" en repere SVG), .vl-gl (halo vert de la plume), .vl-sh (voile d'ombre de la Sombra). */
export function vlClock(opts) {
  opts = opts || {};
  const id = opts.uid || uid('vc'), post = opts.post !== false, H = post ? 520 : 300, ow = opts.width || 300;
  const ah = opts.hour == null ? 2.5 : opts.hour, am = opts.min == null ? 30 : opts.min;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180, big = i % 3 === 0, r = 112; ticks += `<circle cx="${r1(150 + Math.sin(a) * r)}" cy="${r1(150 - Math.cos(a) * r)}" r="${big ? 8 : 5}" fill="${big ? VL.rojo : VL.hierro}"/>`; }
  const pole = post ? `<defs><linearGradient id="${id}-p" x1="0" x2="1"><stop offset="0" stop-color="${VL.hierro}"/><stop offset=".5" stop-color="${VL.hierro2}"/><stop offset="1" stop-color="${VL.hierro}"/></linearGradient></defs><path d="M132 280H168L174 500H126Z" fill="url(#${id}-p)"/><rect x="112" y="486" width="76" height="26" rx="8" fill="${VL.hierro}"/><rect x="124" y="270" width="52" height="16" rx="6" fill="${VL.oro}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 ${H}" width="${ow}" height="${Math.round((ow * H) / 300)}" class="vl-clock" style="overflow:visible" aria-hidden="true">${pole}
<circle cx="150" cy="150" r="146" fill="${VL.hierro}"/><circle cx="150" cy="150" r="136" fill="${VL.oro}"/><circle cx="150" cy="150" r="126" fill="${VL.crema}"/><circle cx="150" cy="150" r="126" fill="none" stroke="${VL.sand2}" stroke-width="3"/>${ticks}
<circle class="vl-gl" cx="150" cy="150" r="130" fill="url(#${id}-g)" opacity="0"/><defs><radialGradient id="${id}-g"><stop offset="0" stop-color="#9BFFD6" stop-opacity=".95"/><stop offset=".55" stop-color="#42E0A0" stop-opacity=".45"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>
<g class="vl-hh" data-px="150" data-py="150" transform="rotate(${ah} 150 150)"><path d="M141 164L150 70L159 164Z" fill="${VL.hierro}"/></g>
<g class="vl-hm" data-px="150" data-py="150" transform="rotate(${am} 150 150)"><path d="M144 166L150 40L156 166Z" fill="${VL.hierro2}"/></g>
<circle cx="150" cy="150" r="11" fill="${VL.rojo}"/><circle cx="150" cy="150" r="4" fill="${VL.crema}"/>
<circle class="vl-sh" cx="150" cy="150" r="146" fill="#14122A" opacity="0"/></svg>`;
}

// ---------------------------------------------------------------- paella (560 x 330) : feu de bois, poele, riz, poulet, haricots verts, tomate
/** Parties animables : .vl-flame (flammes, pivot bas), .vl-smoke (fumee, cercles .vl-pf). opts : width, uid. */
export function vlPaella(opts) {
  opts = opts || {};
  const id = opts.uid || uid('pl'), ow = opts.width || 560, rnd = rng(opts.seed || 9);
  let rice = '';
  for (let i = 0; i < 90; i++) { const a = rnd() * 6.283, r = Math.sqrt(rnd()); rice += `<ellipse cx="${r1(280 + Math.cos(a) * r * 214)}" cy="${r1(168 + Math.sin(a) * r * 48)}" rx="4.5" ry="2" fill="${i % 3 ? '#FFE27A' : '#E3A82C'}" transform="rotate(${Math.round(rnd() * 180)} ${r1(280 + Math.cos(a) * r * 214)} ${r1(168 + Math.sin(a) * r * 48)})"/>`; }
  const chick = [[170, 160, 0], [250, 188, 1], [340, 150, 2], [400, 182, 1], [300, 138, 0], [210, 134, 2], [440, 154, 0]].map((c) => `<g transform="translate(${c[0]} ${c[1]}) rotate(${c[2] * 24 - 20})"><ellipse rx="30" ry="15" fill="#B0682C"/><ellipse cx="-4" cy="-4" rx="20" ry="8" fill="#D08A44"/><circle cx="26" cy="2" r="6" fill="#F3E2C2"/></g>`).join('');
  const beans = [[130, 176], [200, 196], [290, 160], [372, 170], [326, 196], [150, 144], [420, 140], [240, 150], [460, 176], [364, 130]].map((b, i) => `<path d="M${b[0]} ${b[1]}q22 -12 44 ${i % 2 ? 6 : -4}" stroke="${i % 2 ? '#3E9B4F' : '#2E7D3E'}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('');
  const tom = [[190, 172], [310, 176], [392, 160], [262, 146], [120, 164]].map((t) => `<circle cx="${t[0]}" cy="${t[1]}" r="10" fill="#D8352A"/><circle cx="${t[0] - 3}" cy="${t[1] - 3}" r="4" fill="#F0705A"/>`).join('');
  const flames = [[200, 0], [280, 1], [360, 2]].map((f) => `<g class="vl-flame" data-px="${f[0]}" data-py="276"><path d="M${f[0] - 22} 276Q${f[0] - 26} 236 ${f[0] - 8} 214Q${f[0] - 6} 238 ${f[0]} 226Q${f[0] + 4} 198 ${f[0] + 4} 190Q${f[0] + 30} 226 ${f[0] + 22} 276Z" fill="#FF8A1F"/><path d="M${f[0] - 12} 276Q${f[0] - 14} 248 ${f[0]} 232Q${f[0] + 14} 250 ${f[0] + 12} 276Z" fill="#FFD24A"/></g>`).join('');
  const smoke = [[170, 80, 40], [235, 48, 52], [300, 74, 46], [360, 30, 40], [420, 66, 36]].map((s) => `<circle class="vl-pf" cx="${s[0]}" cy="${s[1]}" r="${s[2]}" fill="#E6E6EE" opacity=".55"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 330" width="${ow}" height="${Math.round(ow * 330 / 560)}" class="vl-paella" style="overflow:visible" aria-hidden="true"><defs><linearGradient id="${id}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C5CDD8"/><stop offset="1" stop-color="#7C8798"/></linearGradient></defs>
<g class="vl-smoke">${smoke}</g>
<ellipse cx="280" cy="312" rx="230" ry="14" fill="#000" opacity=".22"/>
<path d="M120 200L96 312M440 200L464 312M280 224V308" stroke="${VL.hierro}" stroke-width="10" stroke-linecap="round"/>
<g fill="#6B4226"><rect x="150" y="268" width="150" height="26" rx="12" transform="rotate(-8 225 281)"/><rect x="260" y="266" width="160" height="26" rx="12" transform="rotate(7 340 279)"/><rect x="190" y="282" width="170" height="24" rx="12"/></g><g fill="#8A5A34"><ellipse cx="156" cy="272" rx="10" ry="12"/><ellipse cx="410" cy="276" rx="10" ry="12"/></g>
${flames}
<path d="M46 156Q30 150 28 168Q34 180 62 176Z M514 156Q530 150 532 168Q526 180 498 176Z" fill="#7C8798"/>
<ellipse cx="280" cy="170" rx="250" ry="62" fill="url(#${id}-s)"/><path d="M30 170Q40 232 280 234Q520 232 530 170Q500 200 280 202Q60 200 30 170Z" fill="#6B7586" opacity=".6"/>
<ellipse cx="280" cy="166" rx="234" ry="54" fill="#8E98A8"/><ellipse cx="280" cy="168" rx="226" ry="49" fill="#EDC247"/><ellipse cx="280" cy="168" rx="226" ry="49" fill="none" stroke="#C99A24" stroke-width="3" opacity=".6"/>${rice}${beans}${chick}${tom}
<path d="M120 190Q280 224 440 190" stroke="#fff" stroke-width="4" fill="none" opacity=".25" stroke-linecap="round"/></svg>`;
}

// ---------------------------------------------------------------- batiments simplifies de la Ciudad de las Artes y las Ciencias
function vlHemi(cx, b, s) { // Hemisferic : dome blanc en forme d'oeil, pupille sombre sous la paupiere
  const w = 190 * s, h = 150 * s;
  return `<g class="vl-hemi"><path d="M${r1(cx - w)} ${b}A${r1(w)} ${r1(h)} 0 0 1 ${r1(cx + w)} ${b}Z" fill="${VL.w2}"/><path d="M${r1(cx)} ${r1(b - h)}A${r1(w)} ${r1(h)} 0 0 1 ${r1(cx + w)} ${b}H${r1(cx)}Z" fill="${VL.w3}" opacity=".55"/>
<circle cx="${r1(cx)}" cy="${r1(b - h * 0.42)}" r="${r1(h * 0.36)}" fill="#1D3A66"/><circle cx="${r1(cx)}" cy="${r1(b - h * 0.42)}" r="${r1(h * 0.2)}" fill="#0B1B33"/><circle cx="${r1(cx - h * 0.1)}" cy="${r1(b - h * 0.52)}" r="${r1(h * 0.07)}" fill="#fff" opacity=".75"/>
<path d="M${r1(cx - w * 1.12)} ${r1(b - h * 0.12)}Q${r1(cx)} ${r1(b - h * 1.38)} ${r1(cx + w * 1.12)} ${r1(b - h * 0.12)}Q${r1(cx)} ${r1(b - h * 0.68)} ${r1(cx - w * 1.12)} ${r1(b - h * 0.12)}Z" fill="${VL.w1}"/><path d="M${r1(cx - w * 1.12)} ${r1(b - h * 0.12)}Q${r1(cx)} ${r1(b - h * 0.68)} ${r1(cx + w * 1.12)} ${r1(b - h * 0.12)}" stroke="${VL.w4}" stroke-width="${r1(5 * s)}" fill="none" opacity=".6"/>
<rect x="${r1(cx - w * 1.1)}" y="${r1(b - 14 * s)}" width="${r1(w * 2.2)}" height="${r1(14 * s)}" fill="${VL.w3}"/></g>`;
}
function vlMuseo(x0, b, s) { // Museo de las Ciencias : coque blanche a cotes sur corps vitre
  const w = 640 * s, ribs = 11; let r = '';
  for (let i = 1; i < ribs; i++) { const xi = x0 + (w * i) / ribs; r += `<path d="M${r1(xi)} ${b - 110 * s}L${r1(xi + 14 * s)} ${r1(b - (150 + 230 * Math.sin((Math.PI * i) / ribs)) * s)}" stroke="${VL.w3}" stroke-width="${r1(6 * s)}" fill="none"/>`; }
  let glass = ''; for (let i = 0; i <= 14; i++) glass += `<path d="M${r1(x0 + (w * i) / 14)} ${r1(b - 110 * s)}V${b}" stroke="${VL.w1}" stroke-width="${r1(4 * s)}" opacity=".7"/>`;
  return `<g class="vl-museo"><rect x="${r1(x0)}" y="${r1(b - 110 * s)}" width="${r1(w)}" height="${r1(110 * s)}" fill="#8FC9E6"/>${glass}<rect x="${r1(x0)}" y="${r1(b - 114 * s)}" width="${r1(w)}" height="${r1(10 * s)}" fill="${VL.w2}"/>
<path d="M${r1(x0 - 10 * s)} ${r1(b - 108 * s)}Q${r1(x0 + w * 0.3)} ${r1(b - 430 * s)} ${r1(x0 + w * 0.62)} ${r1(b - 330 * s)}Q${r1(x0 + w * 0.9)} ${r1(b - 250 * s)} ${r1(x0 + w + 10 * s)} ${r1(b - 108 * s)}Z" fill="${VL.w1}"/>${r}
<path d="M${r1(x0 + w * 0.3)} ${r1(b - 360 * s)}Q${r1(x0 + w * 0.62)} ${r1(b - 400 * s)} ${r1(x0 + w * 0.92)} ${r1(b - 200 * s)}" stroke="${VL.w3}" stroke-width="${r1(5 * s)}" fill="none" opacity=".7"/></g>`;
}
function vlPalau(cx, b, s) { // Palau de les Arts : grande voute blanche a pointe, nef bleutee
  return `<g class="vl-palau"><path d="M${r1(cx - 140 * s)} ${b}V${r1(b - 240 * s)}Q${r1(cx - 120 * s)} ${r1(b - 500 * s)} ${r1(cx + 6 * s)} ${r1(b - 660 * s)}Q${r1(cx + 100 * s)} ${r1(b - 520 * s)} ${r1(cx + 140 * s)} ${r1(b - 300 * s)}V${b}Z" fill="${VL.w1}"/>
<path d="M${r1(cx + 6 * s)} ${r1(b - 660 * s)}Q${r1(cx + 100 * s)} ${r1(b - 520 * s)} ${r1(cx + 140 * s)} ${r1(b - 300 * s)}V${b}H${r1(cx + 20 * s)}Z" fill="${VL.w2}"/>
<path d="M${r1(cx - 78 * s)} ${b}V${r1(b - 230 * s)}Q${r1(cx - 60 * s)} ${r1(b - 420 * s)} ${r1(cx)} ${r1(b - 500 * s)}Q${r1(cx + 60 * s)} ${r1(b - 420 * s)} ${r1(cx + 78 * s)} ${r1(b - 230 * s)}V${b}Z" fill="#7FB7DA"/><path d="M${r1(cx)} ${r1(b - 500 * s)}V${b}M${r1(cx - 40 * s)} ${r1(b - 440 * s)}V${b}M${r1(cx + 40 * s)} ${r1(b - 440 * s)}V${b}" stroke="${VL.w1}" stroke-width="${r1(4 * s)}" opacity=".8"/>
<path d="M${r1(cx - 160 * s)} ${r1(b - 40 * s)}H${r1(cx + 160 * s)}V${b}H${r1(cx - 160 * s)}Z" fill="${VL.w3}"/></g>`;
}
function vlMast(x, b, s) { // pont a haubans (pylone blanc + cables)
  let c = ''; for (let i = 0; i < 9; i++) c += `<path d="M${r1(x)} ${r1(b - 640 * s)}L${r1(x + (60 + i * 46) * s)} ${r1(b - 40 * s)}" stroke="${VL.w1}" stroke-width="${r1(2.6 * s)}" opacity=".8"/>`;
  return `<g class="vl-mast"><path d="M${r1(x - 9 * s)} ${b}L${r1(x - 4 * s)} ${r1(b - 650 * s)}L${r1(x + 4 * s)} ${r1(b - 650 * s)}L${r1(x + 9 * s)} ${b}Z" fill="${VL.w1}"/>${c}<path d="M${r1(x - 40 * s)} ${r1(b - 36 * s)}H${r1(x + 520 * s)}" stroke="${VL.w2}" stroke-width="${r1(7 * s)}"/></g>`;
}
function vlPalm(x, b, s, k) {
  let f = ''; const cols = [VL.hoja, VL.hoja2, VL.hoja3];
  for (let i = 0; i < 8; i++) { const a = -90 + (i - 3.5) * 38 + (k || 0); f += `<path d="M0 0Q${r1(54 * s)} ${r1(-46 * s)} ${r1(130 * s)} ${r1(-4 * s)}Q${r1(66 * s)} ${r1(-16 * s)} 0 0Z" fill="${cols[i % 3]}" transform="rotate(${a} 0 0) translate(0 0)"/>`; }
  return `<g class="vl-palm"><path d="M${r1(x - 9 * s)} ${b}Q${r1(x - 20 * s)} ${r1(b - 150 * s)} ${r1(x + 6 * s)} ${r1(b - 290 * s)}L${r1(x + 18 * s)} ${r1(b - 288 * s)}Q${r1(x - 2 * s)} ${r1(b - 150 * s)} ${r1(x + 10 * s)} ${b}Z" fill="#8A5A34"/><g transform="translate(${r1(x + 12 * s)} ${r1(b - 290 * s)})">${f}</g></g>`;
}
function vlOrangeTree(x, b, s) {
  let o = ''; [[-40, -170], [30, -190], [-6, -128], [56, -140], [-62, -120], [18, -224]].forEach((p) => { o += `<circle cx="${r1(x + p[0] * s)}" cy="${r1(b + p[1] * s)}" r="${r1(11 * s)}" fill="${VL.nar}"/><circle cx="${r1(x + (p[0] - 3) * s)}" cy="${r1(b + (p[1] - 3) * s)}" r="${r1(4 * s)}" fill="#FFC070"/>`; });
  return `<g class="vl-otree"><rect x="${r1(x - 9 * s)}" y="${r1(b - 110 * s)}" width="${r1(18 * s)}" height="${r1(110 * s)}" fill="#6B4226"/><circle cx="${r1(x)}" cy="${r1(b - 170 * s)}" r="${r1(88 * s)}" fill="${VL.hoja2}"/><circle cx="${r1(x - 44 * s)}" cy="${r1(b - 140 * s)}" r="${r1(58 * s)}" fill="${VL.hoja}"/><circle cx="${r1(x + 50 * s)}" cy="${r1(b - 150 * s)}" r="${r1(62 * s)}" fill="${VL.hoja}"/><circle cx="${r1(x + 8 * s)}" cy="${r1(b - 214 * s)}" r="${r1(54 * s)}" fill="${VL.hoja3}"/>${o}</g>`;
}
/** Etal d'oranges (PREMIER PLAN, 420 x 360 environ) : auvent raye, cageots d'oranges. x = centre, b = sol. */
function vlOrangeStall(x, b, s) {
  const w = 380 * s; let aw = '', ors = '';
  for (let i = 0; i < 8; i++) aw += `<path d="M${r1(x - w / 2 + (w * i) / 8)} ${r1(b - 300 * s)}h${r1(w / 8)}v${r1(50 * s)}q${r1(-w / 16)} ${r1(22 * s)} ${r1(-w / 8)} 0Z" fill="${i % 2 ? VL.nar : VL.crema}"/>`;
  for (let i = 0; i < 18; i++) { const ox = x - w / 2 + 30 * s + (i % 9) * 38 * s, oy = b - (118 + Math.floor(i / 9) * 30) * s; ors += `<circle cx="${r1(ox)}" cy="${r1(oy)}" r="${r1(19 * s)}" fill="${i % 4 ? VL.nar : VL.nar2}"/><circle cx="${r1(ox - 6 * s)}" cy="${r1(oy - 6 * s)}" r="${r1(6 * s)}" fill="#FFC070"/>`; }
  return `<g class="vl-stall"><rect x="${r1(x - w / 2 + 10 * s)}" y="${r1(b - 250 * s)}" width="${r1(10 * s)}" height="${r1(250 * s)}" fill="#6B4226"/><rect x="${r1(x + w / 2 - 20 * s)}" y="${r1(b - 250 * s)}" width="${r1(10 * s)}" height="${r1(250 * s)}" fill="#6B4226"/>
<path d="M${r1(x - w / 2 - 10 * s)} ${r1(b - 250 * s)}L${r1(x - w / 2 + 24 * s)} ${r1(b - 330 * s)}H${r1(x + w / 2 - 24 * s)}L${r1(x + w / 2 + 10 * s)} ${r1(b - 250 * s)}Z" fill="${VL.nar2}"/>${aw}
<rect x="${r1(x - w / 2)}" y="${r1(b - 100 * s)}" width="${r1(w)}" height="${r1(100 * s)}" fill="#C98A52"/><rect x="${r1(x - w / 2)}" y="${r1(b - 112 * s)}" width="${r1(w)}" height="${r1(14 * s)}" fill="#E4B070"/>${ors}</g>`;
}
function vlBuildings(b, s0) { // la ligne d'horizon de la Ciudad (reutilisee pour le reflet)
  const s = s0 || 1;
  return vlMast(3010, b, 1.0 * s) + vlPalau(2650, b, 1.0 * s) + vlMuseo(950, b, 1.15 * s) + vlHemi(500, b, 1.5 * s);
}
function vlStoneFloor(W, y0, H, c1, c2) { // dalles en perspective
  let s = `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${c1}"/>`;
  for (let i = 0; i < 12; i++) { const y = y0 + Math.pow(i / 12, 1.5) * (H - y0); s += `<path d="M0 ${r1(y)}H${W}" stroke="${c2}" stroke-width="3" opacity=".45"/>`; }
  for (let i = -8; i < 28; i++) s += `<path d="M${i * 150} ${y0}L${r1(i * 150 + (i - 10) * 90)} ${H}" stroke="${c2}" stroke-width="3" opacity=".3"/>`;
  return s;
}

// ---------------------------------------------------------------- panorama de Valencia (3200 x 1200) : plein soleil, bassins turquoise
/** Retourne { sky, sun, far, mid, near, W, H, sunX, sunY } (parallaxe : far .25, mid .6, near 1). Eau scintillante : .vl-sh (traits), soleil .sk-disc / .sk-rays. */
export function vlSkyline(opts) {
  opts = opts || {};
  const id = opts.uid || uid('vk'), g = (n) => `${id}-${n}`, W = 3200, H = 1200, hor = 800, rnd = rng(opts.seed || 33);
  let clouds = ''; [[300, 250, 520, 70], [1200, 170, 620, 84], [2000, 300, 480, 66], [2700, 200, 600, 80]].forEach((c, i) => { clouds += cloudSvg(c[0], c[1], c[2], c[3], 90 + i * 3, 'front'); });
  const sky = scSvg(W, H, `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E8CE0"/><stop offset=".42" stop-color="#7CC8F0"/><stop offset=".7" stop-color="#CDEBF5"/><stop offset=".82" stop-color="#FFF0D0"/></linearGradient></defs>${scRect(0, 0, W, H, `url(#${g('s')})`)}${clouds}`, 'vk-sky');
  const sx = opts.sunX || 2050, sy = opts.sunY || 330;
  let rays = ''; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, a2 = a + Math.PI / 36; rays += `<path d="M${sx} ${sy}L${r1(sx + Math.cos(a) * 1400)} ${r1(sy + Math.sin(a) * 1400)}L${r1(sx + Math.cos(a2) * 1400)} ${r1(sy + Math.sin(a2) * 1400)}Z"/>`; }
  const sun = scSvg(W, H, `<defs><radialGradient id="${g('h')}"><stop offset="0" stop-color="#FFFBD0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE48A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE48A" stop-opacity="0"/></radialGradient></defs><g class="sk-rays" fill="#FFF6C8" opacity=".09" data-px="${sx}" data-py="${sy}">${rays}</g><circle cx="${sx}" cy="${sy}" r="380" fill="url(#${g('h')})"/><circle class="sk-disc" cx="${sx}" cy="${sy}" r="64" fill="#FFFBD0"/>`, 'vk-sun');
  let hills = `M0 ${hor}`; for (let x = 0; x <= W; x += 80) hills += `L${x} ${r1(hor - 70 - 36 * Math.sin(x / 400) - 16 * Math.sin(x / 140))}`; hills += `L${W} ${hor}Z`;
  let farB = ''; for (let i = 0; i < 16; i++) { const bx = 40 + i * 205 + rnd() * 60, bh = 70 + rnd() * 120; farB += `<rect x="${r1(bx)}" y="${r1(hor - bh)}" width="${r1(70 + rnd() * 50)}" height="${r1(bh)}" fill="${i % 2 ? '#CFE0EA' : '#E9DDC9'}" opacity=".85"/>`; }
  const far = scSvg(W, H, `<path d="${hills}" fill="#A7C7D6" opacity=".55"/>${farB}${scRect(0, hor - 2, W, 14, '#8FB5C6')}`, 'vk-far');
  const mid = scSvg(W, H, `${vlBuildings(hor)}${vlPalm(180, hor + 6, 1.3)}${vlPalm(1020, hor + 6, 1.05, 10)}${vlPalm(2200, hor + 6, 1.2, -8)}${vlPalm(3040, hor + 6, 1.35)}${scRect(0, hor, W, 18, VL.sand)}${scRect(0, hor + 18, W, 8, VL.sand2)}`, 'vk-mid');
  // premier plan : bassin turquoise (reflet des batiments), traits de lumiere, bord de pierre, palmiers et etal d'oranges
  let glints = ''; for (let i = 0; i < 46; i++) glints += `<path class="vl-sh" d="M${r1(rnd() * W)} ${r1(860 + rnd() * 320)}h${r1(30 + rnd() * 50)}" stroke="#fff" stroke-width="${i % 3 ? 4 : 6}" stroke-linecap="round" opacity=".55"/>`;
  const near = scSvg(W, H, `<defs><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${VL.agua}"/><stop offset="1" stop-color="${VL.agua2}"/></linearGradient><clipPath id="${g('c')}"><rect x="0" y="${hor + 26}" width="${W}" height="${H - hor - 26}"/></clipPath></defs>
${scRect(0, hor + 26, W, H - hor - 26, `url(#${g('w')})`)}<g clip-path="url(#${g('c')})"><g transform="translate(0 ${2 * (hor + 26)}) scale(1 -1)" opacity=".36">${vlBuildings(hor + 26)}</g></g>${glints}
${scRect(0, 1130, W, 70, VL.sand)}${scRect(0, 1126, W, 8, VL.sand2)}${vlPalm(260, 1180, 1.7)}${vlPalm(1750, 1190, 1.5, 12)}${vlOrangeStall(2750, 1186, 1.15)}${vlOrangeTree(3130, 1186, 0.9)}`, 'vk-near');
  return { sky, sun, far, mid, near, W, H, sunX: sx, sunY: sy };
}

// ---------------------------------------------------------------- esplanade de la Ciudad (3200 x 1200) : decor de scene (dalles, bassin, edifices en fond)
export const VLPLAZA = { W: 3200, H: 1200, floor: 930, pool: 780, clock: { x: 2230, foot: 960 }, paella: { x: 2760, floor: 1010 } };
/** Retourne { back, front, light, W, H, floor, clock, paella }. L'horloge de rue et la paella sont des elements a poser (vlClock / vlPaella) pour pouvoir les animer. */
export function vlPlaza(opts) {
  opts = opts || {};
  const id = opts.uid || uid('vz'), g = (n) => `${id}-${n}`, W = VLPLAZA.W, H = VLPLAZA.H, fl = VLPLAZA.floor, pool = VLPLAZA.pool;
  const sky = `<defs><linearGradient id="${g('s')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E8CE0"/><stop offset=".45" stop-color="#7CC8F0"/><stop offset=".72" stop-color="#E0F1F5"/></linearGradient><linearGradient id="${g('w')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${VL.agua}"/><stop offset="1" stop-color="${VL.agua2}"/></linearGradient><clipPath id="${g('c')}"><rect x="0" y="${pool}" width="${W}" height="${fl - pool}"/></clipPath><linearGradient id="${g('b')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".5"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".02"/></linearGradient></defs>`;
  let glints = ''; const rnd = rng(opts.seed || 12); for (let i = 0; i < 26; i++) glints += `<path class="vl-sh" d="M${r1(rnd() * W)} ${r1(pool + 20 + rnd() * (fl - pool - 40))}h${r1(30 + rnd() * 50)}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/>`;
  const back = scSvg(W, H, `${sky}${scRect(0, 0, W, H, `url(#${g('s')})`)}${cloudSvg(500, 170, 560, 78, 91, 'front')}${cloudSvg(2000, 130, 640, 84, 93, 'front')}${cloudSvg(2900, 240, 420, 62, 95, 'front')}
${vlBuildings(pool)}${vlPalm(120, pool + 6, 1.3)}${vlPalm(1000, pool + 6, 1.1, 8)}${vlPalm(3100, pool + 6, 1.35)}
${scRect(0, pool, W, 10, VL.sand)}${scRect(0, pool + 10, W, fl - pool - 10, `url(#${g('w')})`)}<g clip-path="url(#${g('c')})"><g transform="translate(0 ${2 * (pool + 10)}) scale(1 -1)" opacity=".36">${vlBuildings(pool + 10)}</g></g>${glints}
${vlStoneFloor(W, fl - 4, H, '#EFE4CC', '#C9B68E')}${scRect(0, fl - 8, W, 14, VL.sand2)}`, 'vz-back');
  const planter = (px) => `<g><rect x="${px - 70}" y="${H - 70}" width="140" height="70" rx="10" fill="#C98A52"/><rect x="${px - 76}" y="${H - 82}" width="152" height="16" rx="8" fill="#E4B070"/>${[-40, -14, 14, 40].map((dx, i) => `<circle cx="${px + dx}" cy="${H - 100 - (i % 2) * 14}" r="${30 + (i % 2) * 6}" fill="${[VL.hoja, VL.hoja2, VL.hoja3, VL.hoja][i]}"/>`).join('')}<circle cx="${px - 20}" cy="${H - 120}" r="8" fill="${VL.nar}"/><circle cx="${px + 30}" cy="${H - 108}" r="8" fill="${VL.nar}"/></g>`;
  const front = scSvg(W, H, `${planter(70)}${planter(3130)}`, 'vz-front');
  const light = scSvg(W, H, `${sky}<g class="ac-beams" fill="url(#${g('b')})"><path d="M1700 0L2500 0L2000 ${H}L1100 ${H}Z" opacity=".35"/></g>`, 'vz-light');
  return { back, front, light, W, H, floor: fl, pool, clock: VLPLAZA.clock, paella: VLPLAZA.paella };
}

// ---------------------------------------------------------------- accessoires de capsule (papier decoupe)
/** key : 'europa' (carte Europe/Espagne/France 520x420) | 'desayuno' | 'comida' | 'merienda' | 'cena' (assiettes 200x200, .vl-glow = halo or) |
 *  'mochila' (200x240) | 'sillon' (abuelo endormi 300x280 ; .vl-z = les Z) | 'colegio' (520x340) | 'falla' (360x540 ; opts.fire = flammes .vl-fl) |
 *  'naranja' (80x80) | 'humo' (nuage de fumee de mascleta 500x300, .vl-pf). opts : width, uid, fire. */
export function vlProp(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('vp'), W = opts.width || 200, rnd = rng(opts.seed || 4);
  const mk = (vb, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${Math.round(W * h)}" class="vl-prop vl-${key}" style="overflow:visible" aria-hidden="true">${inner}</svg>`;
  const plate = (inner) => `<circle class="vl-glow" cx="100" cy="100" r="104" fill="none" stroke="#FFC83D" stroke-width="10" opacity="0"/><circle cx="100" cy="104" r="86" fill="#000" opacity=".18"/><circle cx="100" cy="100" r="86" fill="#FFFDF4"/><circle cx="100" cy="100" r="86" fill="none" stroke="#2F8FD6" stroke-width="7"/><circle cx="100" cy="100" r="64" fill="none" stroke="#9CC9EC" stroke-width="3"/>${inner}`;
  if (key === 'europa') {
    return mk('0 0 520 420', 0.808, `<rect x="0" y="0" width="520" height="420" rx="26" fill="#2F6FD0"/><path d="M130 52L170 40L186 70L150 84Z M92 96L112 90L116 124L96 126Z" fill="#D6E4C8"/>
<path class="vl-fr" d="M150 130L210 100L300 108L342 152L312 208L262 224L202 230L150 210L124 166Z" fill="#6FA8DC" stroke="#FFFDF4" stroke-width="5"/>
<path d="M340 104L424 84L466 134L402 192L340 156Z" fill="#D6E4C8" stroke="#FFFDF4" stroke-width="4"/><path d="M332 206L404 204L440 304L408 336L384 266L332 232Z" fill="#D6E4C8" stroke="#FFFDF4" stroke-width="4"/>
<path class="vl-pt" d="M58 254L96 236L100 340L72 322Z" fill="#E8D8B0" stroke="#FFFDF4" stroke-width="4"/>
<path class="vl-es" d="M96 236L200 232L258 224L282 256L252 306L206 342L112 346L100 336Z" fill="#FFC83D" stroke="#FFFDF4" stroke-width="5"/>
<path d="M120 260Q170 250 220 262" stroke="#E0A020" stroke-width="4" fill="none" opacity=".6"/>
<circle cx="176" cy="290" r="9" fill="#D8352A"/><circle cx="236" cy="164" r="9" fill="#2B318A"/>`);
  }
  if (key === 'desayuno') return mk('0 0 200 200', 1, plate(`<path d="M52 118Q64 74 112 80Q150 88 148 122Q132 100 112 108Q86 100 52 118Z" fill="#E0A04C"/><path d="M66 112Q80 92 106 94" stroke="#F4C480" stroke-width="6" fill="none" stroke-linecap="round"/><g transform="translate(112 92)"><rect x="-6" y="-10" width="56" height="42" rx="10" fill="#C9573B"/><path d="M50 0q22 0 22 16q0 14 -22 14" stroke="#C9573B" stroke-width="8" fill="none"/><ellipse cx="22" cy="-8" rx="26" ry="8" fill="#6B3E26"/></g>`));
  if (key === 'comida') return mk('0 0 200 200', 1, plate(`<ellipse cx="100" cy="106" rx="54" ry="40" fill="#EDC247"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<ellipse cx="${r1(70 + rnd() * 60)}" cy="${r1(92 + rnd() * 30)}" rx="5" ry="2.4" fill="#FFE27A"/>`).join('')}<ellipse cx="86" cy="100" rx="17" ry="10" fill="#B0682C"/><ellipse cx="122" cy="112" rx="15" ry="9" fill="#B0682C"/><path d="M70 120q16 -10 32 0" stroke="#3E9B4F" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="106" cy="86" r="8" fill="#D8352A"/>`));
  if (key === 'merienda') return mk('0 0 200 200', 1, plate(`<rect x="52" y="82" width="96" height="30" rx="14" fill="#E8B15C"/><rect x="56" y="106" width="88" height="14" rx="6" fill="#D8352A"/><rect x="52" y="114" width="96" height="26" rx="13" fill="#E8B15C"/><path d="M66 90Q100 80 134 90" stroke="#F8D993" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="150" cy="70" r="14" fill="${VL.nar}"/><path d="M150 56q4 -10 12 -10" stroke="${VL.hoja}" stroke-width="5" fill="none"/>`));
  if (key === 'cena') return mk('0 0 200 200', 1, plate(`<circle cx="100" cy="100" r="46" fill="#F4D36B"/><circle cx="100" cy="100" r="46" fill="none" stroke="#C99A24" stroke-width="5"/><path d="M100 100L146 100A46 46 0 0 0 130 66Z" fill="#E8B83C"/><circle cx="80" cy="86" r="8" fill="#E8F0C0"/><circle cx="114" cy="122" r="9" fill="#E8F0C0"/><circle cx="116" cy="84" r="6" fill="${VL.hoja}"/><circle cx="84" cy="120" r="6" fill="${VL.hoja}"/>`));
  if (key === 'mochila') return mk('0 0 200 240', 1.2, `<path d="M64 62Q100 18 136 62" stroke="#1B2140" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="26" y="52" width="148" height="170" rx="46" fill="#2F8FD6"/><rect x="26" y="52" width="148" height="170" rx="46" fill="none" stroke="#1D5E96" stroke-width="5"/><rect x="46" y="140" width="108" height="64" rx="22" fill="#FF9F1C"/><path d="M60 156H140" stroke="#E86A0C" stroke-width="6"/><circle cx="100" cy="176" r="9" fill="#FFC83D"/><path d="M52 90Q100 70 148 90" stroke="#fff" stroke-width="7" fill="none" opacity=".3" stroke-linecap="round"/>`);
  if (key === 'sillon') return mk('0 0 300 280', 0.934, `<ellipse cx="150" cy="268" rx="130" ry="12" fill="#000" opacity=".22"/><rect x="30" y="64" width="240" height="170" rx="54" fill="#8F2438"/><rect x="14" y="140" width="64" height="110" rx="26" fill="#A62E46"/><rect x="222" y="140" width="64" height="110" rx="26" fill="#A62E46"/><rect x="60" y="170" width="180" height="70" rx="22" fill="#B83A55"/>
<path d="M92 176Q150 150 214 176L222 244H84Z" fill="#6FA8DC"/><path d="M92 176Q150 150 214 176" stroke="#9CC9EC" stroke-width="5" fill="none"/>
<circle cx="150" cy="110" r="42" fill="#E0A57C"/><path d="M110 98Q112 64 150 62Q190 64 190 98Q176 80 150 82Q124 80 110 98Z" fill="#E4E0DA"/><path d="M110 112Q104 140 118 146M190 112Q196 140 182 146" stroke="#E4E0DA" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M126 112Q136 120 146 112M156 112Q166 120 176 112" stroke="#3B2216" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M138 134Q150 140 162 134" stroke="#8F1D4E" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="124" cy="126" r="7" fill="#FF7A7A" opacity=".3"/><circle cx="176" cy="126" r="7" fill="#FF7A7A" opacity=".3"/>
<g class="vl-z" fill="none" stroke="#F5E6C8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path class="vl-z1" d="M214 54h22l-22 24h22"/><path class="vl-z2" d="M244 22h26l-26 28h26"/></g>`);
  if (key === 'colegio') return mk('0 0 520 340', 0.654, `<rect x="20" y="70" width="480" height="250" fill="#D9805C"/><rect x="20" y="70" width="480" height="18" fill="#B4503A"/><path d="M0 70L260 6L520 70Z" fill="#B4503A"/><path d="M0 70L260 6L520 70" stroke="#8E3A2B" stroke-width="6" fill="none"/>
${[60, 160, 330, 430].map((x) => `<rect x="${x}" y="110" width="40" height="70" rx="6" fill="#CFE9F5"/><path d="M${x + 20} 110V180M${x} 145H${x + 40}" stroke="#FFFDF4" stroke-width="5"/><rect x="${x}" y="206" width="40" height="70" rx="6" fill="#CFE9F5"/><path d="M${x + 20} 206V276M${x} 241H${x + 40}" stroke="#FFFDF4" stroke-width="5"/>`).join('')}
<path d="M216 320V220Q216 190 260 190Q304 190 304 220V320Z" fill="#6B3E26"/><path d="M260 190V320" stroke="#3B2216" stroke-width="5"/><circle cx="260" cy="146" r="22" fill="#FFFDF4"/><circle cx="260" cy="146" r="22" fill="none" stroke="#2B3A55" stroke-width="5"/><rect x="0" y="318" width="520" height="22" fill="#CFBB92"/>`);
  if (key === 'falla') {
    const fire = opts.fire ? [[40, 400, 1.2], [110, 330, 1.5], [180, 260, 1.8], [250, 340, 1.5], [310, 410, 1.2], [140, 440, 1.3], [230, 450, 1.3]].map((f) => `<g class="vl-fl" data-px="${f[0]}" data-py="${f[1] + 70}"><path d="M${f[0] - 26 * f[2]} ${f[1] + 70}Q${f[0] - 34 * f[2]} ${f[1] + 20} ${f[0] - 8 * f[2]} ${f[1] - 20 * f[2]}Q${f[0] - 4 * f[2]} ${f[1] + 10} ${f[0] + 4} ${f[1]}Q${f[0] + 8 * f[2]} ${f[1] - 50 * f[2]} ${f[0] + 6} ${f[1] - 70 * f[2]}Q${f[0] + 44 * f[2]} ${f[1] - 10} ${f[0] + 30 * f[2]} ${f[1] + 70}Z" fill="#FF6A1F"/><path d="M${f[0] - 14 * f[2]} ${f[1] + 70}Q${f[0] - 16 * f[2]} ${f[1] + 30} ${f[0]} ${f[1] - 10}Q${f[0] + 20 * f[2]} ${f[1] + 30} ${f[0] + 14 * f[2]} ${f[1] + 70}Z" fill="#FFC83D"/></g>`).join('') : '';
    return mk('0 0 360 540', 1.5, `<ellipse cx="180" cy="520" rx="170" ry="14" fill="#000" opacity=".22"/><rect x="10" y="470" width="340" height="44" rx="8" fill="#7A4A2B"/><rect x="10" y="470" width="340" height="12" fill="#A06A3E"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${34 + i * 49}" cy="494" r="9" fill="${[VL.oro, VL.rojo, VL.azul][i % 3]}"/>`).join('')}
<rect x="50" y="394" width="260" height="80" rx="10" fill="#D8352A"/><rect x="50" y="394" width="260" height="14" fill="#FFC83D"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${76 + i * 52} 432l14 14l-14 14l-14 -14Z" fill="#FFC83D"/>`).join('')}
<rect x="86" y="326" width="188" height="72" rx="10" fill="#2F8FD6"/><rect x="86" y="326" width="188" height="12" fill="#FFFDF4"/>${[0, 1, 2].map((i) => `<circle cx="${130 + i * 50}" cy="366" r="14" fill="#FF9F1C"/>`).join('')}
<path d="M120 330Q110 230 180 200Q250 230 240 330Z" fill="#E8368F"/><path d="M180 200Q250 230 240 330H196Z" fill="#B82272" opacity=".55"/><path d="M130 300Q180 320 230 300" stroke="#FFC83D" stroke-width="8" fill="none"/>
<path d="M120 250Q70 230 60 190" stroke="#E0A57C" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M240 250Q290 230 300 190" stroke="#E0A57C" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="58" cy="182" r="16" fill="#E0A57C"/><circle cx="302" cy="182" r="16" fill="#E0A57C"/>
<circle cx="180" cy="150" r="58" fill="#E0A57C"/><circle cx="180" cy="86" r="26" fill="#2A160E"/><circle cx="130" cy="124" r="22" fill="#2A160E"/><circle cx="230" cy="124" r="22" fill="#2A160E"/><path d="M128 130Q180 90 232 130Q220 106 180 100Q140 106 128 130Z" fill="#2A160E"/><path d="M166 70L180 40L194 70Z" fill="#FFC83D"/><circle cx="180" cy="38" r="8" fill="#D8352A"/>
<circle cx="158" cy="152" r="9" fill="#2A160E"/><circle cx="202" cy="152" r="9" fill="#2A160E"/><circle cx="161" cy="149" r="3" fill="#fff"/><circle cx="205" cy="149" r="3" fill="#fff"/><path d="M160 178Q180 196 200 178" stroke="#8F1D4E" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="142" cy="170" r="11" fill="#FF7A7A" opacity=".4"/><circle cx="218" cy="170" r="11" fill="#FF7A7A" opacity=".4"/>
${[[34, 420, '#D8352A'], [326, 410, '#2F8FD6'], [20, 330, '#FFC83D'], [340, 320, '#19B7AA']].map((b, i) => `<path d="M${b[0]} ${b[1]}V${b[1] + 60}" stroke="#F5E6C8" stroke-width="3"/><ellipse cx="${b[0]}" cy="${b[1] - 4}" rx="22" ry="28" fill="${b[2]}"/><ellipse cx="${b[0] - 7}" cy="${b[1] - 14}" rx="5" ry="9" fill="#fff" opacity=".4"/>`).join('')}${fire}`);
  }
  if (key === 'naranja') return mk('0 0 80 80', 1, `<circle cx="40" cy="44" r="30" fill="${VL.nar}"/><circle cx="31" cy="35" r="8" fill="#FFC070"/><path d="M40 16q-6 -12 6 -14q14 2 4 14Z" fill="${VL.hoja}"/>`);
  if (key === 'humo') {
    let p = ''; [[110, 190, 70], [200, 150, 90], [300, 180, 80], [390, 200, 64], [160, 110, 64], [270, 90, 70], [350, 120, 58], [230, 200, 60]].forEach((c, i) => { p += `<circle class="vl-pf" cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${i % 2 ? '#D8D8E2' : '#EDEDF4'}"/>`; });
    return mk('0 0 500 300', 0.6, p);
  }
  return '';
}

/** Foule vue de dos / de face (silhouettes sombres, 3 rangs) : w x h, n tetes par rang ; bords eclaires par le feu (.vl-rim). Aucun texte. */
export function vlCrowd(opts) {
  opts = opts || {};
  const W = opts.w || 1920, H = opts.h || 300, n = opts.n || 22, rnd = rng(opts.seed || 5), rows = [{ y: H - 190, c: '#2A1E3E', k: 0.8 }, { y: H - 110, c: '#1E1530', k: 0.95 }, { y: H - 30, c: '#140E22', k: 1.1 }];
  let s = '';
  rows.forEach((r, ri) => {
    for (let i = 0; i < n; i++) {
      const x = (W / n) * (i + 0.5) + (rnd() - 0.5) * 40 + (ri % 2) * 30, hr = (24 + rnd() * 8) * r.k, y = r.y + (rnd() - 0.5) * 16;
      s += `<g><path d="M${r1(x - hr * 1.9)} ${H}Q${r1(x - hr * 1.9)} ${r1(y + hr * 1.5)} ${r1(x)} ${r1(y + hr * 1.3)}Q${r1(x + hr * 1.9)} ${r1(y + hr * 1.5)} ${r1(x + hr * 1.9)} ${H}Z" fill="${r.c}"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(hr)}" fill="${r.c}"/><path class="vl-rim" d="M${r1(x - hr)} ${r1(y)}A${r1(hr)} ${r1(hr)} 0 0 1 ${r1(x + hr)} ${r1(y)}" stroke="#FF9F4A" stroke-width="${r1(3 * r.k)}" fill="none" opacity=".55"/></g>`;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="vl-crowd" aria-hidden="true">${s}</svg>`;
}
