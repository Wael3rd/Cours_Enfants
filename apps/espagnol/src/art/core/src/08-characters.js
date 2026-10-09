// ---------------------------------------------------------------- personnages de l'histoire (chibis vectoriels) - viewBox 0 0 400 660
// Alex (le joueur), Marina, Don Ignacio : meme langage que le Quetzal (aplats + ombrages, pas de photo). Face avant, tete large.
// Parties animables (classes c-*) : c-rig (corps), c-head, c-armL / c-armR, c-legL / c-legR, c-eye, c-brow, c-m-c / c-m-o (bouche), c-tail (couette).
export const CHAR_PIVOT = { head: '200 288', armL: '142 306', armR: '258 306', legL: '168 440', legR: '232 440', tail: '236 104', rig: '200 640' };
export const CHARS = {
  alex: { name: 'Álex', skin: '#E3AE86', hair: '#3A2216', top: '#19B7AA', pants: '#2B318A', shoes: '#F5E6C8', accent: '#D93472', mouthY: 0 },
  marina: { name: 'Marina', skin: '#D79A74', hair: '#2A160E', top: '#D93472', pants: '#0E7F82', shoes: '#FFC83D', accent: '#FFC83D', mouthY: 0 },
  ignacio: { name: 'Don Ignacio', skin: '#D9A47C', hair: '#C9C5C0', top: '#E0A058', pants: '#2F5D50', shoes: '#6B3E26', accent: '#C9573B', mouthY: 14 },
};
function chTorso(k, c, g) {
  const shade2 = shade(c.top, -0.22);
  const base = `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade2}" opacity=".5"/>`;
  if (k === 'alex') return base + `<path d="M162 286Q200 330 238 286L238 306Q200 346 162 306Z" fill="${shade(c.top, -0.18)}"/><path d="M200 330V452" stroke="${PAL.sol}" stroke-width="5" stroke-linecap="round"/><path d="M152 404h96q8 30 -4 44h-88q-12 -14 -4 -44Z" fill="${shade(c.top, -0.12)}"/><path d="M168 292Q200 306 232 292" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>`;
  if (k === 'marina') return `<path d="M138 292Q200 272 262 292L274 440Q200 464 126 440Z" fill="${PAL.sol}"/><path d="M138 292Q168 300 176 346L170 450Q150 448 126 440Z" fill="${c.top}"/><path d="M262 292Q232 300 224 346L230 450Q250 448 274 440Z" fill="${c.top}"/><path d="M262 292L274 440Q250 448 230 450L224 346Q232 300 262 292Z" fill="${shade2}" opacity=".45"/><path d="M178 288Q200 322 222 288" fill="${shade(PAL.sol, -0.2)}"/><path d="M186 344h28M190 356h20" stroke="${PAL.magenta2}" stroke-width="4" stroke-linecap="round"/>`;
  return `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="#F5E6C8"/><path d="M138 292Q176 304 184 350L176 456Q148 452 124 442Z" fill="${c.top}"/><path d="M262 292Q224 304 216 350L224 456Q252 452 276 442Z" fill="${c.top}"/><path d="M262 292L276 442Q252 452 224 456L216 350Q224 304 262 292Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M150 286Q200 322 250 286L250 314Q200 350 150 314Z" fill="${c.accent}"/><path d="M168 316L246 440" stroke="#6B3E26" stroke-width="12" stroke-linecap="round"/><circle cx="188" cy="372" r="5" fill="#8A5230"/><circle cx="188" cy="404" r="5" fill="#8A5230"/>`;
}
function chArm(k, c, side) {
  const m = (x) => (side === 'R' ? 400 - x : x), hand = c.skin;
  const cuff = k === 'ignacio' ? '#F5E6C8' : shade(c.top, -0.18);
  return `<g class="c-arm c-arm${side}"><path d="M${m(130)} 296Q${m(104)} 300 ${m(102)} 332L${m(98)} 418Q${m(98)} 440 ${m(118)} 440Q${m(138)} 440 ${m(138)} 418L${m(146)} 336Q${m(150)} 300 ${m(130)} 296Z" fill="${c.top}"/><path d="M${m(98)} 418Q${m(98)} 440 ${m(118)} 440Q${m(138)} 440 ${m(138)} 418L${m(139)} 404L${m(98)} 404Z" fill="${cuff}"/><path d="M${m(102)} 332L${m(98)} 418" stroke="${shade(c.top, -0.25)}" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/><circle cx="${m(118)}" cy="452" r="23" fill="${hand}"/><path d="M${m(104)} 462q${side === 'R' ? -10 : 10} 8 ${side === 'R' ? -24 : 24} 2" stroke="${shade(hand, -0.2)}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></g>`;
}
function chLeg(c, side) {
  const dark = shade(c.pants, -0.22), shoe = c.shoes, m = (x) => (side === 'R' ? 408 - x : x - 8);
  return `<g class="c-leg c-leg${side}"><path d="M${m(146)} 430H${m(206)}L${m(204)} 586H${m(150)}Z" fill="${c.pants}"/><path d="M${m(190)} 432H${m(206)}L${m(204)} 586H${m(188)}Z" fill="${dark}" opacity=".5"/><path d="M${m(142)} 586H${m(208)}V618Q${m(208)} 634 ${m(190)} 634H${m(128)}Q${m(122)} 634 ${m(124)} 624Q${m(128)} 598 ${m(142)} 586Z" fill="${shoe}"/><path d="M${m(124)} 624H${m(208)}V634H${m(128)}Q${m(122)} 634 ${m(124)} 624Z" fill="${shade(shoe, -0.35)}"/><path d="M${m(146)} 600Q${m(172)} 592 ${m(200)} 600" stroke="${c.accent}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/></g>`;
}
function chHairBack(k, c) {
  if (k === 'marina') return `<path d="M98 196Q84 84 200 78Q316 84 302 196Q320 290 292 346Q250 330 252 262L148 262Q150 330 108 346Q80 290 98 196Z" fill="${c.hair}"/>`;
  if (k === 'ignacio') return `<path d="M104 190Q96 224 112 250Q108 214 120 190Z M296 190Q304 224 288 250Q292 214 280 190Z" fill="${c.hair}"/>`;
  return '';
}
function chHairFront(k, c, g) {
  if (k === 'alex') return `<path d="M100 184Q92 84 200 80Q308 84 300 184Q296 144 268 134Q254 164 224 142Q200 176 176 142Q148 164 136 134Q106 146 100 184Z" fill="${c.hair}"/><path d="M186 88Q196 48 230 66Q212 76 216 94Z" fill="${c.hair}"/><path d="M130 112Q156 92 186 96" stroke="${shade(c.hair, 0.25)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`;
  if (k === 'marina') return `<g class="c-tail" data-px="236" data-py="104"><path d="M236 98Q330 62 348 144Q356 210 322 262Q304 208 292 156Q272 122 236 122Z" fill="${c.hair}"/><path d="M300 120Q336 140 330 196" stroke="${shade(c.hair, 0.3)}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/></g><path d="M102 188Q96 94 200 88Q304 94 298 188Q272 132 234 142Q216 114 190 144Q150 124 102 188Z" fill="${c.hair}"/><path d="M106 152Q200 66 294 152L288 170Q200 92 112 170Z" fill="${PAL.sol}"/><circle cx="250" cy="104" r="14" fill="${PAL.sol}"/><path d="M244 104l6 -6 6 6 -6 6Z" fill="${PAL.magenta2}"/>`;
  return `<ellipse cx="200" cy="130" rx="160" ry="34" fill="#6B3E26"/><path d="M118 128Q120 36 200 32Q280 36 282 128Z" fill="#8A5230"/><path d="M118 128H282V104H118Z" fill="${c.accent}"/><path d="M118 112H282" stroke="#fff" stroke-width="3" opacity=".25"/><path d="M262 108Q300 70 332 78Q312 92 290 118Z" fill="${PAL.quetzal}"/><path d="M270 106Q306 86 326 82" stroke="${PAL.quetzalClaro}" stroke-width="3" fill="none"/><ellipse cx="200" cy="132" rx="160" ry="34" fill="none" stroke="${shade('#6B3E26', 0.2)}" stroke-width="4" opacity=".6"/><g fill="none" stroke="#E0A058" stroke-width="5"><circle cx="156" cy="82" r="15"/><circle cx="196" cy="82" r="15"/><path d="M171 82h10"/></g><path d="M120 128Q200 150 280 128" fill="#000" opacity=".16"/>`;
}
function chFace(k, c, uid) {
  const my = c.mouthY, hairBrow = k === 'ignacio' ? '#B8B3AD' : c.hair;
  const eye = (cx) => `<g class="c-eye"><ellipse cx="${cx}" cy="198" rx="19" ry="24" fill="#FFFBF0"/><circle cx="${cx + 3}" cy="202" r="13.5" fill="${k === 'ignacio' ? '#3B2A1E' : '#2A160E'}"/><circle cx="${cx + 8}" cy="194" r="5.4" fill="#fff"/><circle cx="${cx - 2}" cy="209" r="2.6" fill="#fff" opacity=".7"/></g>`;
  const brow = (x0, x1, up) => `<path class="c-brow" d="M${x0} ${up ? 160 : 164}Q${(x0 + x1) / 2} ${up ? 140 : 142} ${x1} ${up ? 158 : 160}" stroke="${hairBrow}" stroke-width="${k === 'ignacio' ? 12 : 7}" fill="none" stroke-linecap="round"/>`;
  const stache = k === 'ignacio' ? `<path d="M148 236Q174 218 200 236Q226 218 252 236Q246 266 200 252Q154 266 148 236Z" fill="#D9D5D0"/><path d="M160 240Q180 232 200 242Q220 232 240 240" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>` : '';
  return `<ellipse cx="102" cy="206" rx="16" ry="22" fill="${c.skin}"/><ellipse cx="298" cy="206" rx="16" ry="22" fill="${c.skin}"/>
<ellipse cx="200" cy="190" rx="100" ry="94" fill="${c.skin}"/><ellipse cx="200" cy="228" rx="86" ry="56" fill="${shade(c.skin, -0.08)}" opacity=".35"/>
<ellipse cx="140" cy="232" rx="22" ry="14" fill="#FF7A7A" opacity=".3"/><ellipse cx="260" cy="232" rx="22" ry="14" fill="#FF7A7A" opacity=".3"/>
${eye(155)}${eye(245)}${brow(126, 184, false)}${brow(216, 274, false)}
${k === 'ignacio' ? '<path d="M120 214q-10 6 -12 16M280 214q10 6 12 16" stroke="#8A5230" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>' : ''}
<path d="M200 208q-9 15 0 21q9 4 14 -3" stroke="${shade(c.skin, -0.28)}" stroke-width="5" fill="none" stroke-linecap="round"/>
<g class="c-mouth" transform="translate(0 ${my})"><path class="c-m-c" d="M168 246Q200 276 232 246" stroke="#7A2E2E" stroke-width="8" fill="none" stroke-linecap="round"/><g class="c-m-o" opacity="0"><ellipse cx="200" cy="256" rx="26" ry="22" fill="#6B1E24"/><path d="M178 244Q200 252 222 244L222 240H178Z" fill="#fff"/><ellipse cx="200" cy="270" rx="15" ry="8" fill="#E0606A"/></g></g>${stache}`;
}
/** Personnage : key 'alex'|'marina'|'ignacio'. opts : width, view ('full' | 'bust' | viewBox), uid, pack (sac a dos, defaut true). */
export function character(key, opts) {
  opts = opts || {};
  const c = CHARS[key] || CHARS.alex, id = opts.uid || uid('ch');
  const bust = opts.view === 'bust', view = bust ? '30 22 340 312' : opts.view && opts.view !== 'full' ? opts.view : '0 0 400 660';
  const W = opts.width || 400, H = opts.height || Math.round((W * (bust ? 312 : 660)) / (bust ? 340 : 400));
  const pack = key === 'alex' ? `<g class="c-pack"><rect x="98" y="252" width="204" height="236" rx="56" fill="${PAL.terracotta}"/><rect x="98" y="252" width="204" height="236" rx="56" fill="url(#${id}-pk)"/><rect x="124" y="396" width="152" height="74" rx="24" fill="${PAL.terracotta2}"/><circle cx="278" cy="262" r="22" fill="${PAL.sol}"/><rect x="170" y="236" width="60" height="26" rx="13" fill="${PAL.terracotta2}"/></g>` : key === 'marina' ? `<rect x="136" y="300" width="128" height="126" rx="38" fill="${PAL.sol}"/>` : `<path d="M254 340L300 470Q304 492 280 494H236Q214 494 220 470Z" fill="#8A5230"/><path d="M226 376Q250 366 272 380" stroke="#6B3E26" stroke-width="5" fill="none"/>`;
  const strap = key === 'alex' ? `<path d="M162 292V420M238 292V420" stroke="${PAL.terracotta2}" stroke-width="12" stroke-linecap="round"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${W}" height="${H}" class="c-svg c-${key}" role="img" aria-label="${c.name}"><defs><linearGradient id="${id}-pk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
<g class="c-rig"><ellipse class="c-shadow" cx="200" cy="640" rx="118" ry="15" fill="#000" opacity=".28"/>
${bust ? '' : pack}${bust ? '' : chLeg(c, 'L') + chLeg(c, 'R')}
<g class="c-body">${chTorso(key, c)}${strap}${bust ? '' : chArm(key, c, 'L') + chArm(key, c, 'R')}
<rect x="184" y="268" width="32" height="30" fill="${shade(c.skin, -0.12)}"/>
<g class="c-head">${chHairBack(key, c)}${chFace(key, c, id)}${chHairFront(key, c)}</g></g></g></svg>`;
}

function cEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function ca(root, sel) { return Array.from(cEl(root).querySelectorAll(sel)); }
/** Bouche : une ouverture par mot (debut `at`, duree `dur` repartie en n ouvertures). */
export function charTalk(tl, root, at, dur, n) {
  const open = ca(root, '.c-m-o'), closed = ca(root, '.c-m-c'), step = dur / (n || 1);
  for (let i = 0; i < (n || 1); i++) {
    const t = at + i * step, amp = 0.55 + ((i * 37) % 5) * 0.11;
    tl.to(open, { opacity: 1, scaleY: amp + 0.2, scaleX: 0.9 + (i % 2) * 0.15, svgOrigin: '200 256', duration: step * 0.32, ease: 'power2.out' }, t);
    tl.to(closed, { opacity: 0, duration: 0.02 }, t);
    tl.to(open, { scaleY: 0.18, duration: step * 0.3, ease: 'power2.in' }, t + step * 0.4);
    tl.to(closed, { opacity: 1, duration: 0.02 }, t + step * 0.78);
  }
  tl.to(open, { opacity: 0, duration: 0.05 }, at + dur);
  tl.to(closed, { opacity: 1, duration: 0.02 }, at + dur);
}
export function charBlink(tl, root, at) {
  const eyes = ca(root, '.c-eye');
  tl.to(eyes, { scaleY: 0.08, svgOrigin: '200 198', duration: 0.07, ease: 'power2.in' }, at);
  tl.to(eyes, { scaleY: 1, svgOrigin: '200 198', duration: 0.12, ease: 'power2.out' }, at + 0.09);
}
/** Respiration + balancement de la couette / tete (cycles finis). */
export function charIdle(tl, root, at, span, amp) {
  const a = amp == null ? 1 : amp, body = ca(root, '.c-body');
  tl.fromTo(body, { y: 0 }, { y: -5 * a, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.1)) }, at);
  ca(root, '.c-tail').forEach((t) => tl.fromTo(t, { rotation: -5 * a, svgOrigin: t.dataset.px + ' ' + t.dataset.py }, { rotation: 6 * a, svgOrigin: t.dataset.px + ' ' + t.dataset.py, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.3)) }, at));
  tl.fromTo(ca(root, '.c-head'), { y: 0 }, { y: -4 * a, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / 1.7)) }, at + 0.3);
}
/** Marche sur place : jambes en opposition, bras qui balancent, rebond du corps. `period` = duree d'un pas. */
export function charWalk(tl, root, at, dur, period) {
  const per = period || 0.36, n = Math.max(1, Math.round(dur / per)), L = ca(root, '.c-legL'), R = ca(root, '.c-legR'), aL = ca(root, '.c-armL'), aR = ca(root, '.c-armR'), body = ca(root, '.c-body, .c-pack');
  for (let i = 0; i < n; i++) {
    const t = at + i * per, s = i % 2 ? -1 : 1;
    tl.to(L, { rotation: 24 * s, svgOrigin: CHAR_PIVOT.legL, duration: per, ease: 'sine.inOut' }, t);
    tl.to(R, { rotation: -24 * s, svgOrigin: CHAR_PIVOT.legR, duration: per, ease: 'sine.inOut' }, t);
    tl.to(aL, { rotation: -22 * s, svgOrigin: CHAR_PIVOT.armL, duration: per, ease: 'sine.inOut' }, t);
    tl.to(aR, { rotation: 22 * s, svgOrigin: CHAR_PIVOT.armR, duration: per, ease: 'sine.inOut' }, t);
    tl.to(body, { y: -14, duration: per / 2, ease: 'sine.out' }, t);
    tl.to(body, { y: 0, duration: per / 2, ease: 'sine.in' }, t + per / 2);
  }
  tl.to(L.concat(R, aL, aR), { rotation: 0, duration: 0.25, ease: 'power2.out' }, at + n * per);
}
/** Salut de la main (bras `side` 'L'|'R' leve qui oscille). */
export function charWave(tl, root, at, dur, side) {
  const arm = ca(root, '.c-arm' + (side || 'R')), piv = side === 'L' ? CHAR_PIVOT.armL : CHAR_PIVOT.armR, sg = side === 'L' ? 1 : -1;
  tl.to(arm, { rotation: 150 * sg, svgOrigin: piv, duration: 0.3, ease: 'back.out(1.6)' }, at);
  const n = Math.max(2, Math.floor(dur / 0.24));
  tl.fromTo(arm, { rotation: 150 * sg - 14 }, { rotation: 150 * sg + 14, svgOrigin: piv, duration: 0.12, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, immediateRender: false }, at + 0.3);
  tl.to(arm, { rotation: 0, svgOrigin: piv, duration: 0.35, ease: 'power2.inOut' }, at + 0.3 + n * 0.24);
}
/** Emotion : 'happy' (sourcils hauts, grand sourire), 'worry' (sourcils inclines), 'neutral'. */
export function charEmote(tl, root, at, kind, dur) {
  const brows = ca(root, '.c-brow');
  const y = kind === 'happy' ? -12 : kind === 'worry' ? -6 : 0, r = kind === 'worry' ? 12 : 0;
  tl.to(brows, { y: y, duration: dur || 0.25, ease: 'power2.out' }, at);
  ca(root, '.c-brow').forEach((b, i) => tl.to(b, { rotation: (i ? -1 : 1) * r, svgOrigin: i ? '245 164' : '155 164', duration: dur || 0.25, ease: 'power2.out' }, at));
}
/** Hochement de tete (rotation autour du cou) : liste de [temps, angle]. */
export function charNod(tl, root, at, angle, dur) {
  const h = ca(root, '.c-head'), d = dur || 0.16;
  tl.to(h, { rotation: angle, svgOrigin: CHAR_PIVOT.head, duration: d, ease: 'power2.out' }, at);
  tl.to(h, { rotation: 0, svgOrigin: CHAR_PIVOT.head, duration: d * 1.6, ease: 'power2.inOut' }, at + d);
}
