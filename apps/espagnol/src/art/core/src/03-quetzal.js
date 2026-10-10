// ---------------------------------------------------------------- El Quetzal (mascotte) - viewBox 0 0 600 720, regarde a droite
// Structure : <g.q-rig> -> tail streamers (q-tail-N, pivot = croupion), far wing (q-wingF), body, feet, near wing (q-wingN), head (q-head)
// Pivots (svgOrigin) : voir QUETZAL_PIVOT. Etats : plumage complet / "bare" (sans plumes). Animation : quetzalSet / quetzalPoseTo / quetzalFlap / quetzalTalk...
export const QUETZAL_PIVOT = { wing: '272 266', wingF: '286 262', head: '318 222', tail: '262 410', jaw: '366 182', rig: '300 330' };

/** Ruban effile le long de points [[x,y,largeur]...] -> chemin ferme (pointe arrondie). */
function ribbon(pts) {
  const L = [], R = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = pts[i][2] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const tip = pts[n - 1], pr = pts[n - 2]; let tx = tip[0] - pr[0], ty = tip[1] - pr[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
  const cap = [tip[0] + tx * tip[2] * 0.9, tip[1] + ty * tip[2] * 0.9];
  return smooth(L.concat([cap], R.reverse()), true);
}
function spine(pts) { return smooth(pts.map((p) => [p[0], p[1]]), false); }

/** Les 4 longues plumes de queue : [ [x,y,w] ... ] (origine ~ croupion 262,410). */
const TAILS = [
  [[262, 410, 22], [244, 470, 28], [214, 540, 30], [176, 610, 28], [118, 668, 20], [60, 700, 8]],
  [[266, 412, 20], [262, 480, 26], [250, 556, 28], [224, 628, 24], [186, 690, 14], [160, 712, 6]],
  [[258, 408, 18], [226, 456, 22], [180, 512, 24], [124, 560, 20], [70, 590, 12], [26, 600, 5]],
  [[270, 414, 16], [284, 476, 20], [286, 548, 20], [270, 620, 16], [244, 676, 10], [226, 706, 4]],
];
const TAIL_ORDER = [2, 0, 1, 3]; // ordre de repousse
/** Plumes de queue supplementaires (une par plume gagnee, jusqu'a 6) : eventail [angle depuis la verticale (deg), longueur, largeur, courbure]. */
const EXTRA_TAILS = [[-62, 250, 15, 22], [24, 300, 16, -18], [-44, 330, 15, 26], [40, 240, 14, -20], [-24, 360, 14, 18], [12, 380, 13, -12]];
function extraTail(e) {
  const a = (e[0] * Math.PI) / 180, sx = Math.sin(a), cy = Math.cos(a), L = e[1], w = e[2], bow = e[3];
  return [0, 0.22, 0.46, 0.7, 0.88, 1].map((t, i, arr) => [r1(262 + sx * L * t + bow * Math.sin(t * Math.PI) * cy), r1(410 + cy * L * t + bow * Math.sin(t * Math.PI) * -sx), r1(w * (1 - t * t * 0.78) * (i === arr.length - 1 ? 0.35 : 1))]);
}
/** Plume de huppe supplementaire (au-dela de 6 plumes gagnees : 7e a 10e), eventail vers l'arriere : [angle, longueur]. */
const EXTRA_CREST = [[-58, 70], [-36, 92], [-14, 100], [8, 84]];
function crestPlume(c) {
  const a = (c[0] * Math.PI) / 180, L = c[1], sx = Math.sin(a), cy = Math.cos(a), bx = 300, by = 92;
  return [0, 0.35, 0.7, 1].map((t, i) => [r1(bx + sx * L * t - (1 - cy) * 10 * t), r1(by - cy * L * t * 0.9), i === 3 ? 3 : 11 - t * 5]);
}
/** Nombre de plumes gagnees (0-10) deduit de l'id de la composition u0N-pluma* (rien hors cinematiques) : le Quetzal s'etoffe d'unite en unite. */
function plumasFromDoc() {
  try {
    const el = typeof document !== 'undefined' && document.querySelector('[data-composition-id]');
    const m = el && /^u([0-9]+)-(?:pluma|finale)/.exec(el.getAttribute('data-composition-id') || '');
    return m ? Math.min(10, +m[1]) : 0;
  } catch (e) { return 0; }
}

function wingShape() {
  return smooth([[300, 250], [338, 266], [352, 318], [336, 382], [304, 446], [282, 470], [262, 428], [250, 360], [262, 296]], true);
}

/**
 * Quetzal SVG. opts : uid, branch (bool, perchoir), width, height, plumas (0-10 : nombre de plumes gagnees ; 1 a 6 = plumes de queue en plus, 7 a 10 = plumes de huppe ;
 * defaut : numero N d'une composition `uN-pluma*`, sinon 0).
 * Le SVG est en plumage complet ; pour "sans plumes" appeler quetzalSet(root, 'bare', gsap).
 */
export function quetzal(opts) {
  opts = opts || {};
  const id = opts.uid || uid('qz');
  const W = opts.width || 600, H = opts.height || 720;
  const g = (n) => `${id}-${n}`;
  const tails = TAILS.map((t, i) => {
    const x = t[0][0], y = t[0][1];
    const barbs = t.slice(1, -1).map((p) => `<path d="M${p[0]} ${p[1]}l${r1(-p[2] * 0.55)} ${r1(-p[2] * 0.25)}M${p[0]} ${p[1]}l${r1(p[2] * 0.55)} ${r1(p[2] * 0.25)}" stroke="${PAL.quetzal2}" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`).join('');
    return `<g class="q-tail q-tail-${i}" data-px="${x}" data-py="${y}"><path d="${ribbon(t)}" fill="url(#${g('tail' + (i % 2))})"/><path d="${spine(t.map((p) => [p[0], p[1]]))}" stroke="${PAL.quetzalClaro}" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>${barbs}</g>`;
  }).join('');
  const np = Math.max(0, Math.min(10, Math.round(opts.plumas == null ? plumasFromDoc() : opts.plumas)));
  const extraTails = EXTRA_TAILS.slice(0, Math.min(6, np)).map((e, j) => {
    const t = extraTail(e), i = 4 + j;
    return `<g class="q-tail q-tail-${i} q-tail-x" data-px="262" data-py="410"><path d="${ribbon(t)}" fill="url(#${g('tail' + (j % 2 ? 1 : 0))})"/><path d="${spine(t.map((p) => [p[0], p[1]]))}" stroke="${PAL.quetzalClaro}" stroke-width="2.6" fill="none" opacity=".65" stroke-linecap="round"/></g>`;
  }).join('');
  const extraCrest = EXTRA_CREST.slice(0, Math.max(0, np - 6)).map((c) => {
    const t = crestPlume(c);
    return `<path class="q-crest-x" d="${ribbon(t)}" fill="url(#${g('crest')})"/><path d="${spine(t.map((p) => [p[0], p[1]]))}" stroke="${PAL.quetzalClaro}" stroke-width="2.2" fill="none" opacity=".6" stroke-linecap="round"/>`;
  }).join('');
  const flightFeathers = [0, 1, 2, 3, 4].map((k) => {
    const x0 = 296 - k * 7, y0 = 400 + k * 6, ang = 14 - k * 6, s = Math.sin((ang * Math.PI) / 180);
    const pts = [[x0, y0, 20], [x0 + s * 30 - 6, y0 + 40, 22], [x0 + s * 60 - 8, y0 + 84, 16], [x0 + s * 72 - 8, y0 + 116, 6]];
    return `<path d="${ribbon(pts)}" fill="${k % 2 ? PAL.turquesa2 : '#0F6F8F'}"/>`;
  }).join('');
  const wingN = `<g class="q-wing q-wingN"><g class="q-wing-j"><g transform="translate(-30 4)">
${flightFeathers}<path d="${wingShape()}" fill="url(#${g('wing')})"/>
<path d="M276 318q30 -14 62 -2M268 352q36 -14 76 -2M268 388q32 -12 58 -2" stroke="${PAL.quetzalClaro}" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>
<path d="M312 268q26 18 30 56" stroke="#fff" stroke-width="4" fill="none" opacity=".25" stroke-linecap="round"/></g></g></g>`;
  const wingF = `<g class="q-wing q-wingF"><g class="q-wing-j">
<g transform="translate(-14 -2)"><path d="${wingShape()}" fill="${PAL.quetzal2}"/><path d="M268 360l40 14M276 400l26 10" stroke="#042F22" stroke-width="3" opacity=".5" stroke-linecap="round"/></g></g></g>`;
  const body = smooth([[286, 214], [248, 252], [226, 322], [230, 392], [262, 436], [318, 436], [356, 392], [374, 322], [368, 262], [352, 224]], true);
  const redCut = 'M200 340C250 328 330 322 400 352L400 470L200 470Z';
  const crest = `<g class="q-crest">${extraCrest}<path d="${smooth([[262, 128], [262, 96], [288, 72], [322, 66], [352, 82], [362, 112], [350, 138], [310, 150]], true)}" fill="url(#${g('crest')})"/>
<path d="M286 130q8 -28 36 -40M308 138q14 -26 40 -30M270 112q10 -18 30 -26" stroke="${PAL.quetzalClaro}" stroke-width="3.5" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  const branch = opts.branch ? `<g class="q-branch"><path d="M20 470Q200 454 320 460T590 448" stroke="#5A3418" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M20 464Q200 448 320 454T590 442" stroke="#8A5A2B" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><path d="M470 452q40 -34 80 -30M110 466q-10 -38 -50 -52" stroke="#5A3418" stroke-width="10" fill="none" stroke-linecap="round"/></g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.view || '0 0 600 720'}" width="${W}" height="${H}" class="q-svg" role="img" aria-label="El Quetzal">
<defs>
<linearGradient id="${g('tail0')}" x1="262" y1="410" x2="60" y2="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzal}"/><stop offset=".55" stop-color="${PAL.turquesa}"/><stop offset="1" stop-color="#2468C9"/></linearGradient>
<linearGradient id="${g('tail1')}" x1="262" y1="410" x2="200" y2="710" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzal2}"/><stop offset=".5" stop-color="${PAL.quetzal}"/><stop offset="1" stop-color="${PAL.turquesa}"/></linearGradient>
<linearGradient id="${g('wing')}" x1="270" y1="260" x2="340" y2="460" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzalClaro}"/><stop offset=".35" stop-color="${PAL.quetzal}"/><stop offset=".8" stop-color="${PAL.turquesa2}"/><stop offset="1" stop-color="#1B4E8F"/></linearGradient>
<linearGradient id="${g('body')}" x1="240" y1="230" x2="380" y2="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PAL.quetzalClaro}"/><stop offset=".45" stop-color="${PAL.quetzal}"/><stop offset="1" stop-color="${PAL.quetzal2}"/></linearGradient>
<linearGradient id="${g('red')}" x1="300" y1="330" x2="320" y2="440" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF4A64"/><stop offset=".55" stop-color="${PAL.rojo}"/><stop offset="1" stop-color="#8E0F26"/></linearGradient>
<radialGradient id="${g('head')}" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${PAL.quetzalClaro}"/><stop offset=".55" stop-color="${PAL.quetzal}"/><stop offset="1" stop-color="${PAL.quetzal2}"/></radialGradient>
<linearGradient id="${g('crest')}" x1="280" y1="70" x2="340" y2="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="${PAL.quetzal2}"/></linearGradient>
<clipPath id="${g('eyeclip')}"><circle cx="342" cy="160" r="15.5"/></clipPath>
<clipPath id="${g('clip')}"><path d="${body}"/></clipPath>
</defs>
${branch}
<g class="q-rig">
${tails}${extraTails}
${wingF}
<g class="q-bodyg">
<path class="q-body" d="${body}" fill="url(#${g('body')})"/>
<g clip-path="url(#${g('clip')})"><path class="q-red" d="${redCut}" fill="url(#${g('red')})"/>
<path d="M214 338C260 326 332 322 398 350" stroke="#fff" stroke-width="5" fill="none" opacity=".28"/>
<path d="M232 270Q246 340 238 392" stroke="#fff" stroke-width="10" fill="none" opacity=".12" stroke-linecap="round"/></g>
<path class="q-dull" d="${body}" fill="#9AA79A" opacity="0"/>
</g>
<g class="q-feet" fill="none" stroke="#E0A33A" stroke-width="7" stroke-linecap="round"><path d="M290 432v22l-12 8M290 454l10 8M322 430v24l-12 8M322 454l10 8"/></g>
${wingN}
<g class="q-head">
${crest}
<circle cx="322" cy="168" r="54" fill="url(#${g('head')})"/>
<path d="M276 150q18 -34 56 -36" stroke="#fff" stroke-width="6" fill="none" opacity=".22" stroke-linecap="round"/>
<g class="q-eye"><circle cx="342" cy="160" r="15" fill="#F7F1DC"/><circle cx="345" cy="160" r="10.5" fill="#1A1020"/><circle cx="348" cy="156" r="3.6" fill="#fff"/><circle cx="342" cy="164" r="1.8" fill="#fff" opacity=".6"/></g>
<g clip-path="url(#${g('eyeclip')})"><rect class="q-lid" x="322" y="128" width="44" height="32" fill="${PAL.quetzal}" opacity="0" transform="translate(0 -18)"/></g>
<circle class="q-dull-h" cx="322" cy="168" r="54" fill="#9AA79A" opacity="0"/>
<path d="M334 190q10 8 24 4" stroke="${PAL.quetzal2}" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
<g class="q-jaw"><path d="M364 182Q398 186 378 208Q368 202 362 196Z" fill="#D9930B"/></g>
<path class="q-beak" d="M362 150Q412 158 380 186L362 184Z" fill="#F7B80C"/><path d="M372 160q14 2 20 8" stroke="#fff" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
</g>
</g>
</svg>`;
}

// --- Rig ------------------------------------------------------------------------------------------------------
export const QUETZAL_POSES = {
  perched: { rot: 0, x: 0, y: 0, head: 0, wing: 4, wingF: 4, lid: 0 },
  fly: { rot: 62, x: 0, y: 0, head: -22, wing: -62, wingF: -40, lid: 0 },
  glide: { rot: 48, x: 0, y: 0, head: -16, wing: -78, wingF: -64, lid: 0 },
  talk: { rot: -4, x: 0, y: -4, head: -6, wing: 14, wingF: 8, lid: 0 },
  sad: { rot: 6, x: 0, y: 12, head: 22, wing: 26, wingF: 20, lid: 0.55 },
  happy: { rot: -6, x: 0, y: -14, head: -12, wing: -34, wingF: -26, lid: 0 },
};
function qEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function qa(root, sel) { return Array.from(qEl(root).querySelectorAll(sel)); }
function tailOrigin(t) { return t.dataset.px + ' ' + t.dataset.py; }

/** Applique immediatement (gsap.set) une pose ('perched'|'fly'|'glide'|'talk'|'sad'|'happy') ou l'etat 'bare' (sans plumes) / 'full'. */
export function quetzalSet(root, name, g) {
  if (name === 'bare') {
    qa(root, '.q-tail').forEach((t) => g.set(t, { scale: 0.1, svgOrigin: tailOrigin(t), rotation: 0 }));
    g.set(qa(root, '.q-crest'), { scale: 0.32, svgOrigin: '300 150' });
    g.set(qa(root, '.q-dull, .q-dull-h'), { opacity: 0.72 });
    g.set(qa(root, '.q-red'), { opacity: 0.6 });
    return;
  }
  if (name === 'full') {
    qa(root, '.q-tail').forEach((t) => g.set(t, { scale: 1, svgOrigin: tailOrigin(t) }));
    g.set(qa(root, '.q-crest'), { scale: 1, svgOrigin: '300 150' });
    g.set(qa(root, '.q-dull, .q-dull-h'), { opacity: 0 });
    g.set(qa(root, '.q-red'), { opacity: 1 });
    return;
  }
  const p = QUETZAL_POSES[name] || QUETZAL_POSES.perched;
  g.set(qa(root, '.q-rig'), { rotation: p.rot, x: p.x, y: p.y, svgOrigin: QUETZAL_PIVOT.rig });
  g.set(qa(root, '.q-head'), { rotation: p.head, svgOrigin: QUETZAL_PIVOT.head });
  g.set(qa(root, '.q-wingN .q-wing-j'), { rotation: p.wing, svgOrigin: QUETZAL_PIVOT.wing });
  g.set(qa(root, '.q-wingF .q-wing-j'), { rotation: p.wingF, svgOrigin: QUETZAL_PIVOT.wingF });
  g.set(qa(root, '.q-lid'), { opacity: p.lid ? 1 : 0, y: -18 + 18 * p.lid });
}
/** Tween (dans la timeline tl) vers une pose. */
export function quetzalPoseTo(tl, root, name, at, dur, ease) {
  const p = QUETZAL_POSES[name] || QUETZAL_POSES.perched, e = ease || 'power3.inOut';
  const T = (sel, vars) => { const els = qa(root, sel); if (els.length) tl.to(els, Object.assign({ duration: dur, ease: e }, vars), at); };
  T('.q-rig', { rotation: p.rot, x: p.x, y: p.y, svgOrigin: QUETZAL_PIVOT.rig });
  T('.q-head', { rotation: p.head, svgOrigin: QUETZAL_PIVOT.head });
  T('.q-wingN .q-wing-j', { rotation: p.wing, svgOrigin: QUETZAL_PIVOT.wing });
  T('.q-wingF .q-wing-j', { rotation: p.wingF, svgOrigin: QUETZAL_PIVOT.wingF });
  T('.q-lid', { opacity: p.lid ? 1 : 0, y: -18 + 18 * p.lid });
}
/** Battements d'ailes : `count` cycles de `period` s a partir de `at`. Descente puissante, remontee souple ; le corps ondule avec. */
export function quetzalFlap(tl, root, at, count, period, amp) {
  const a = amp == null ? 1 : amp;
  const wn = qa(root, '.q-wingN .q-wing-j'), wf = qa(root, '.q-wingF .q-wing-j'), body = qa(root, '.q-bodyg, .q-head');
  for (let i = 0; i < count; i++) {
    const t = at + i * period;
    tl.to(wn, { rotation: -92 * a, svgOrigin: QUETZAL_PIVOT.wing, duration: period * 0.42, ease: 'sine.out' }, t);
    tl.to(wn, { rotation: 6 * a, svgOrigin: QUETZAL_PIVOT.wing, duration: period * 0.58, ease: 'power2.inOut' }, t + period * 0.42);
    tl.to(wf, { rotation: -78 * a, svgOrigin: QUETZAL_PIVOT.wingF, duration: period * 0.42, ease: 'sine.out' }, t + period * 0.05);
    tl.to(wf, { rotation: 2 * a, svgOrigin: QUETZAL_PIVOT.wingF, duration: period * 0.58, ease: 'power2.inOut' }, t + period * 0.47);
    tl.to(body, { y: 10 * a, duration: period * 0.42, ease: 'sine.out' }, t);
    tl.to(body, { y: 0, duration: period * 0.58, ease: 'sine.inOut' }, t + period * 0.42);
  }
}
/** Bec qui parle : `n` ouvertures reparties sur `dur`. */
export function quetzalTalk(tl, root, at, dur, n) {
  const jaw = qa(root, '.q-jaw'), step = dur / n;
  for (let i = 0; i < n; i++) {
    tl.to(jaw, { rotation: 22 + (i % 3) * 6, svgOrigin: QUETZAL_PIVOT.jaw, duration: step * 0.4, ease: 'power2.out' }, at + i * step);
    tl.to(jaw, { rotation: 0, svgOrigin: QUETZAL_PIVOT.jaw, duration: step * 0.45, ease: 'power2.in' }, at + i * step + step * 0.45);
  }
}
export function quetzalBlink(tl, root, at) {
  const eye = qa(root, '.q-eye');
  tl.to(eye, { scaleY: 0.08, svgOrigin: '342 160', duration: 0.07, ease: 'power2.in' }, at);
  tl.to(eye, { scaleY: 1, svgOrigin: '342 160', duration: 0.12, ease: 'power2.out' }, at + 0.09);
}
/** Ondulation des plumes de queue (decalee plume par plume), un aller-retour. */
export function quetzalSway(tl, root, at, dur, amp) {
  const a = amp == null ? 1 : amp;
  qa(root, '.q-tail').forEach((t, i) => {
    tl.to(t, { rotation: (i % 2 ? -1 : 1) * 4.5 * a, svgOrigin: tailOrigin(t), duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + i * 0.12);
  });
}
/** Les plumes reviennent : queue (4 plumes en cascade elastique), huppe, couleur. Duree ~ 2.2 s. */
export function quetzalRegrow(tl, root, at) {
  const tails = qa(root, '.q-tail');
  TAIL_ORDER.forEach((idx, k) => {
    const t = tails[idx]; if (!t) return;
    tl.to(t, { scale: 1, svgOrigin: tailOrigin(t), duration: 0.9, ease: 'elastic.out(1,0.55)' }, at + 0.15 + k * 0.28);
  });
  tails.slice(4).forEach((t, k) => tl.to(t, { scale: 1, svgOrigin: tailOrigin(t), duration: 0.8, ease: 'elastic.out(1,0.55)' }, at + 0.5 + k * 0.16));
  tl.to(qa(root, '.q-crest'), { scale: 1, svgOrigin: '300 150', duration: 0.8, ease: 'back.out(2.2)' }, at + 0.9);
  tl.to(qa(root, '.q-dull, .q-dull-h'), { opacity: 0, duration: 1.2, ease: 'power2.out' }, at + 0.1);
  tl.to(qa(root, '.q-red'), { opacity: 1, duration: 1.2, ease: 'power2.out' }, at + 0.1);
}
