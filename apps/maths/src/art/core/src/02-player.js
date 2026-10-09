// ---------------------------------------------------------------- footballeur "grosse tete"
// Chaque articulation = <g class="p-xxx" transform="translate(pivot)"><g class="j">contenu en coordonnees absolues</g></g>
// -> on anime `.j` (rotation autour de son origine locale = le pivot) avec GSAP `svgOrigin:"0 0"`.
// Convention des angles : armL/armR/legL/legR = ecart "vers l'exterieur" en degres (>0 : le bras s'ecarte du corps).
export const POSES = {
  idle:        { armL: 9,   armR: 9,   legL: 2,   legR: 2,   lean: 0,  tilt: 0,  y: 0,   sy: 1,    rot: 0,  expr: 'smile' },
  course:      { armL: 52,  armR: -22, legL: 26,  legR: -8,  lean: 6,  tilt: 3,  y: -10, sy: 1,    rot: 0,  expr: 'determined' },
  frappe:      { armL: 74,  armR: -24, legL: 4,   legR: -52, lean: -9, tilt: -4, y: 0,   sy: 1,    rot: 0,  expr: 'focus' },
  celebration: { armL: 158, armR: 158, legL: 16,  legR: 16,  lean: 0,  tilt: -5, y: -46, sy: 1.03, rot: 0,  expr: 'shout' },
  decu:        { armL: 3,   armR: 3,   legL: 0,   legR: 0,   lean: 4,  tilt: 12, y: 8,   sy: 0.96, rot: 0,  expr: 'sad' },
  attente:     { armL: 58,  armR: 58,  legL: 15,  legR: 15,  lean: 0,  tilt: 0,  y: 14,  sy: 0.93, rot: 0,  expr: 'determined' },
  plongeon:    { armL: 168, armR: 168, legL: 22,  legR: 6,   lean: 0,  tilt: -6, y: -40, sy: 1,    rot: 74, expr: 'focus' },
  explique:    { armL: 20,  armR: -78, legL: 3,   legR: 3,   lean: 0,  tilt: -4, y: 0,   sy: 1,    rot: 0,  expr: 'smile' },
};
const PART_SEL = { armL: '.p-armL .j', armR: '.p-armR .j', legL: '.p-legL .j', legR: '.p-legR .j', body: '.p-body .j', head: '.p-head .j', rig: '.p-rig' };

function hairSvg(style, c, cd) {
  const hl = shade(c, 0.28);
  switch (style) {
    case 'boucles': {
      let back = '';
      const pts = [[104, 120, 44], [128, 84, 46], [170, 62, 48], [214, 58, 48], [258, 70, 46], [292, 100, 44], [310, 142, 40], [92, 160, 36], [316, 176, 28], [84, 190, 22]];
      pts.forEach((p) => { back += `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}"/>`; });
      back += `<ellipse cx="200" cy="108" rx="112" ry="52" fill="${c}"/>`;
      let front = `<path d="M96 150 C100 112 140 96 200 96 C260 96 300 112 304 150 C284 128 250 120 200 120 C150 120 116 128 96 150Z" fill="${c}"/>`;
      [[150, 84], [200, 74], [250, 84], [120, 110], [282, 112]].forEach((p) => { front += `<path d="M${p[0] - 14} ${p[1]} q14 -12 28 0" stroke="${hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>`; });
      return { back, front };
    }
    case 'pique':
      return { back: '', front: `<path d="M88 150 L94 92 L128 118 L136 56 L168 102 L200 38 L232 102 L264 56 L272 118 L306 92 L312 150 C290 124 256 112 200 112 C144 112 110 124 88 150Z" fill="${c}"/><path d="M168 102 L200 38 L200 112Z" fill="${cd}" opacity=".35"/><path d="M130 100 L136 70" stroke="${hl}" stroke-width="5" stroke-linecap="round" opacity=".6"/>` };
    case 'long':
      return {
        back: `<path d="M76 170 C70 92 126 50 200 50 C274 50 330 92 324 170 C330 240 326 300 300 336 C282 322 280 290 278 250 L122 250 C120 290 118 322 100 336 C74 300 70 240 76 170Z" fill="${c}"/>`,
        front: `<path d="M86 160 C86 100 134 66 204 66 C268 66 312 100 314 160 C300 128 270 106 232 108 C250 126 214 138 176 120 C150 112 112 124 86 160Z" fill="${c}"/><path d="M120 92 C150 76 180 72 214 74" stroke="${hl}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>`,
      };
    default: // court
      return { back: '', front: `<path d="M84 156 C80 90 134 52 200 52 C266 52 322 90 316 156 C304 128 284 112 262 112 C236 98 206 120 178 106 C150 100 122 118 110 128 C100 134 90 144 84 156Z" fill="${c}"/><path d="M122 84 C150 64 190 58 226 62" stroke="${hl}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M178 106 C196 96 214 104 236 100" stroke="${cd}" stroke-width="4" fill="none" opacity=".35"/>` };
  }
}

function legSvg(cx, d, o) {
  const coach = o.role === 'coach';
  const body = coach
    ? `<path d="M${cx - 28} 392 h56 v118 h-56z" fill="${o.shorts}"/><rect x="${cx - 28}" y="498" width="56" height="12" fill="${shade(o.shorts, -0.2)}"/>`
    : `<path d="M${cx - 28} 392 h56 v46 q0 6 -6 6 h-44 q-6 0 -6 -6z" fill="${o.shorts}"/><rect x="${cx - 28}" y="430" width="56" height="8" fill="${o.trim}"/>` +
      `<rect x="${cx - 17}" y="438" width="34" height="22" fill="${o.skin}"/><rect x="${cx - 20}" y="456" width="40" height="54" fill="${o.socks}"/><rect x="${cx - 20}" y="468" width="40" height="8" fill="${o.socks2}"/>`;
  const shoe = `<g transform="translate(${cx},0) scale(${d},1)"><path d="M-23 504 L21 504 C35 512 53 526 55 542 Q55 553 45 553 L-21 553 Q-27 553 -27 545 Z" fill="${o.shoe}"/><path d="M-27 543 H55 V548 Q55 554 48 554 H-22 Q-27 554 -27 548Z" fill="#fff"/><path d="M6 508 l10 -2 M10 515 l10 -2 M15 522 l9 -1" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M-23 520 C-10 516 4 522 14 534" stroke="${shade(o.shoe, 0.35)}" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  return `<g class="p-leg${d < 0 ? 'L' : 'R'}" transform="translate(${cx},392)"><g class="j"><g transform="translate(${-cx},-392)">${body}${shoe}</g></g></g>`;
}

function armSvg(cx, d, o) {
  const keeper = o.role === 'gardien';
  const hand = keeper
    ? `<ellipse cx="${cx}" cy="392" rx="24" ry="26" fill="${o.glove}"/><rect x="${cx - 18}" y="372" width="36" height="9" rx="4" fill="${o.glove2}"/><path d="M${cx - 10} 396 v-14 M${cx} 398 v-16 M${cx + 10} 396 v-14" stroke="${shade(o.glove, -0.22)}" stroke-width="3" stroke-linecap="round"/>`
    : `<circle cx="${cx}" cy="388" r="17" fill="${o.skin}"/><path d="M${cx - 6} 396 q6 6 12 0" stroke="${o.skinD}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const forearm = o.role === 'coach' ? `<rect x="${cx - 14}" y="326" width="28" height="54" rx="12" fill="${o.primary}"/>` : `<rect x="${cx - 13}" y="332" width="26" height="50" rx="12" fill="${o.skin}"/>`;
  const sleeve = o.role === 'coach'
    ? `<rect x="${cx - 19}" y="290" width="38" height="70" rx="16" fill="${o.primary}"/><rect x="${cx - 19}" y="348" width="38" height="10" fill="${o.secondary}"/>`
    : `<rect x="${cx - 20}" y="290" width="40" height="52" rx="16" fill="${o.primary}"/><rect x="${cx - 20}" y="330" width="40" height="10" fill="${o.secondary}"/>`;
  return `<g class="p-arm${d < 0 ? 'L' : 'R'}" transform="translate(${cx},304)"><g class="j"><g transform="translate(${-cx},-304)">${forearm}${hand}${sleeve}</g></g></g>`;
}

function exprSvg(o) {
  const brow = (p) => `<path d="${p}" stroke="${o.brow}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  const dk = '#2a1418';
  const E = {};
  E.smile = brow('M122 148 Q152 128 182 142') + brow('M218 142 Q248 128 278 148') +
    `<path d="M158 238 Q200 296 242 238 Q200 250 158 238Z" fill="#6b1d2a"/><path d="M162 240 Q200 254 238 240 Q233 252 200 256 Q167 252 162 240Z" fill="#fff"/><ellipse cx="200" cy="270" rx="17" ry="7" fill="#ff7a8c"/>`;
  E.determined = brow('M120 140 Q150 148 184 162') + brow('M216 162 Q250 148 280 140') +
    `<path d="M166 252 Q198 266 236 244" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M236 244 q8 -4 10 -12" stroke="${dk}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  E.focus = brow('M120 140 Q150 148 184 162') + brow('M216 162 Q250 148 280 140') +
    `<rect x="170" y="242" width="60" height="26" rx="10" fill="#fff" stroke="${dk}" stroke-width="5"/><path d="M190 242 v26 M210 242 v26 M170 255 h60" stroke="${dk}" stroke-width="3"/>`;
  E.shout = brow('M120 134 Q152 112 184 130') + brow('M216 130 Q248 112 280 134') +
    `<path d="M148 236 Q200 252 252 236 Q256 302 200 312 Q144 302 148 236Z" fill="#6b1d2a"/><path d="M152 238 Q200 254 248 238 Q246 252 200 258 Q154 252 152 238Z" fill="#fff"/><ellipse cx="200" cy="290" rx="26" ry="14" fill="#ff7a8c"/>`;
  E.sad = brow('M122 158 Q150 152 184 138') + brow('M216 138 Q250 152 278 158') +
    `<path d="M164 266 Q200 236 236 266" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M262 206 q-11 18 0 30 q11 -12 0 -30z" fill="#7fdcff" stroke="#fff" stroke-width="2"/>`;
  return Object.keys(E).map((k) => `<g class="p-expr p-expr-${k}" opacity="${k === o.expr ? 1 : 0}">${E[k]}</g>`).join('');
}

/** Footballeur. opts : role('joueur'|'gardien'|'coach'), primary, secondary, shorts, socks, skin(0-5|hex), hair('court'|'boucles'|'pique'|'long'),
 *  hairColor(0-6|hex), number, kit('uni'|'rayures'|'cerceaux'|'bande'), pose, expr, look(-1..1), uid, width, height. */
export function player(opts) {
  opts = opts || {};
  const role = opts.role || 'joueur';
  const u = opts.uid || uid('pl');
  const primary = opts.primary || '#E8212F', secondary = opts.secondary || '#FFFFFF';
  const skin = typeof opts.skin === 'number' ? SKINS[opts.skin % SKINS.length] : opts.skin || SKINS[1];
  const hair = typeof opts.hairColor === 'number' ? HAIRS[opts.hairColor % HAIRS.length] : opts.hairColor || HAIRS[0];
  const o = {
    role, primary, secondary, skin, skinD: shade(skin, -0.2),
    shorts: opts.shorts || (role === 'coach' ? '#1B2440' : lum(primary) > 0.5 ? '#13204f' : '#FFFFFF'),
    trim: opts.trim || secondary, socks: opts.socks || primary, socks2: opts.socks2 || secondary,
    shoe: opts.shoe || '#121528', glove: opts.glove || '#FFD23F', glove2: opts.glove2 || '#FF4D6D', brow: shade(hair, -0.25),
    expr: opts.expr || (POSES[opts.pose || 'idle'] || POSES.idle).expr,
  };
  const kit = opts.kit || 'uni';
  const numC = lum(primary) > 0.5 ? '#0A1030' : '#FFFFFF', numS = lum(primary) > 0.5 ? '#FFFFFF' : '#0A1030';
  const jersey = 'M146 300 Q146 286 170 284 L230 284 Q254 286 254 300 L260 402 Q260 414 248 414 L152 414 Q140 414 140 402 Z';
  let pat = '';
  if (kit === 'rayures') for (let x = 140; x < 262; x += 30) pat += `<rect x="${x}" y="280" width="15" height="140" fill="${secondary}"/>`;
  if (kit === 'cerceaux') for (let y = 300; y < 414; y += 34) pat += `<rect x="130" y="${y}" width="140" height="16" fill="${secondary}"/>`;
  if (kit === 'bande') pat = `<polygon points="120,322 270,276 270,318 120,364" fill="${secondary}"/>`;
  // Lisibilite de tous les tons : contour clair sur cheveux sombres, ombre portee sous la frange, reflets sur peau foncee.
  const darkHair = lum(hair) < 0.07, darkSkin = lum(skin) < 0.22;
  const rim = darkHair ? shade(hair, 0.55) : shade(hair, -0.4);
  const hairShade = `<path d="M90 156 C104 112 296 112 310 156 L310 190 C270 160 130 160 90 190Z" fill="#000" opacity="${darkSkin ? 0.3 : 0.12}"/>`;
  const faceLight = darkSkin
    ? `<ellipse cx="200" cy="124" rx="70" ry="22" fill="#fff" opacity=".13"/><ellipse cx="126" cy="214" rx="26" ry="18" fill="#fff" opacity=".16"/><ellipse cx="274" cy="214" rx="26" ry="18" fill="#fff" opacity=".16"/><ellipse cx="200" cy="224" rx="14" ry="9" fill="#fff" opacity=".18"/>`
    : '';
  const hs = hairSvg(opts.hair || 'court', hair, shade(hair, -0.3));
  const cap = role === 'coach'
    ? `<path d="M88 150 C84 84 134 52 200 52 C266 52 316 84 312 150 L88 150Z" fill="${secondary}"/><path d="M88 150 C140 138 260 138 312 150 L312 158 C260 148 140 148 88 158Z" fill="${shade(secondary, -0.25)}"/><path d="M96 152 C130 176 270 176 330 148 C310 136 280 140 262 142Z" fill="${shade(secondary, -0.1)}"/><circle cx="200" cy="92" r="14" fill="${primary}"/>`
    : '';
  const mustache = role === 'coach' ? `<path d="M158 232 Q180 214 200 228 Q220 214 242 232 Q220 240 200 236 Q180 240 158 232Z" fill="${shade(hair, -0.1)}"/>` : '';
  const num = `<text x="200" y="378" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="62" fill="${numC}" stroke="${numS}" stroke-width="6" paint-order="stroke" class="p-num">${esc(opts.number == null ? (role === 'gardien' ? '1' : '') : opts.number)}</text>`;
  const bodyDeco = role === 'coach'
    ? `<path d="M200 300 V414" stroke="${shade(primary, -0.3)}" stroke-width="4"/><path d="M176 286 L200 312 L224 286" fill="none" stroke="${secondary}" stroke-width="8" stroke-linejoin="round"/><path d="M172 288 Q200 346 228 288" stroke="#1B2440" stroke-width="4" fill="none"/><g class="p-whistle"><rect x="190" y="336" width="28" height="16" rx="8" fill="#C9D2E4"/><circle cx="195" cy="344" r="9" fill="#8E9AB8"/></g>`
    : `<path d="M174 285 L200 318 L226 285 Z" fill="${skin}"/><path d="M172 284 L200 322 L228 284" fill="none" stroke="${secondary}" stroke-width="8" stroke-linejoin="round"/>${num}`;
  const headScale = role === 'coach' ? 0.86 : 1;
  const look = opts.look || 0;
  const eye = (cx) => `<g class="p-eye-open"><ellipse cx="${cx}" cy="190" rx="28" ry="34" fill="#fff"/><circle cx="${cx + look * 7}" cy="197" r="19.5" fill="${opts.eye || '#3a2a20'}"/><circle cx="${cx + look * 7}" cy="197" r="10.5" fill="#0c0a10"/><circle cx="${cx + look * 7 - 7}" cy="188" r="6.5" fill="#fff"/><circle cx="${cx + look * 7 + 7}" cy="205" r="3" fill="#fff" opacity=".8"/><path d="M${cx - 29} 188 Q${cx} 148 ${cx + 29} 188" stroke="#2a1418" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  const happy = `<g class="p-eye-happy" opacity="0"><path d="M122 194 Q152 160 182 194" stroke="#2a1418" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M218 194 Q248 160 278 194" stroke="#2a1418" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-player" data-role="${role}" viewBox="0 0 400 600" width="${opts.width || 400}" height="${opts.height || 600}" style="overflow:visible">
<defs><radialGradient id="${u}f" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${shade(skin, 0.18)}"/><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${shade(skin, -0.14)}"/></radialGradient>
<linearGradient id="${u}j" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
<clipPath id="${u}c"><path d="${jersey}"/></clipPath></defs>
<g class="p-shadow"><ellipse cx="200" cy="558" rx="104" ry="16" fill="#000" opacity=".32"/></g>
<g class="p-rig">
${legSvg(168, -1, o)}${legSvg(232, 1, o)}
<g class="p-body" transform="translate(200,400)"><g class="j"><g transform="translate(-200,-400)">
<rect x="184" y="266" width="32" height="36" rx="10" fill="${skin}"/>
<path d="${jersey}" fill="${primary}"/><g clip-path="url(#${u}c)">${pat}</g><path d="${jersey}" fill="url(#${u}j)"/>
${bodyDeco}
<path d="M146 398 H254 L260 438 H140Z" fill="${o.shorts}"/><rect x="146" y="396" width="108" height="9" fill="${o.trim}" opacity=".9"/>
</g></g></g>
${armSvg(138, -1, o)}${armSvg(262, 1, o)}
<g class="p-head" transform="translate(200,290) scale(${headScale})"><g class="j"><g transform="translate(-200,-290)">
<g class="p-hair-back" stroke="${rim}" stroke-width="3" stroke-linejoin="round">${hs.back}</g>
<circle cx="82" cy="190" r="21" fill="${skin}" stroke="${shade(skin, -0.34)}" stroke-width="4"/><circle cx="82" cy="190" r="11" fill="${o.skinD}" opacity=".55"/><circle cx="318" cy="190" r="21" fill="${skin}" stroke="${shade(skin, -0.34)}" stroke-width="4"/><circle cx="318" cy="190" r="11" fill="${o.skinD}" opacity=".55"/>
<path d="M82 160 C82 98 130 58 200 58 C270 58 318 98 318 160 C318 232 270 286 200 286 C130 286 82 232 82 160Z" fill="url(#${u}f)" stroke="${shade(skin, -0.34)}" stroke-width="4"/>${faceLight}
<ellipse cx="124" cy="228" rx="23" ry="13" fill="#FF5E7A" opacity=".32"/><ellipse cx="276" cy="228" rx="23" ry="13" fill="#FF5E7A" opacity=".32"/>
<g class="p-eyes">${eye(152)}${eye(248)}${happy}</g>
<path d="M190 224 Q200 234 210 224" stroke="${shade(skin, -0.4)}" stroke-width="5" fill="none" stroke-linecap="round"/>
${mustache}
${exprSvg(o)}
${hairShade}<g class="p-hair-front" stroke="${rim}" stroke-width="3" stroke-linejoin="round">${hs.front}</g>${cap}
</g></g></g>
</g></svg>`;
}
export function gardien(opts) { return player(Object.assign({ role: 'gardien', primary: '#17B26A', secondary: '#0A1030', pose: 'attente', number: 1, kit: 'bande' }, opts)); }
export function coach(opts) { return player(Object.assign({ role: 'coach', primary: '#1B6BFF', secondary: '#FFFFFF', pose: 'explique', hair: 'court', hairColor: 4 }, opts)); }
/** Buste (tete + epaules) pour cartes joueurs : meme SVG, cadre rogne. */
export function bust(opts) { return player(opts).replace('viewBox="0 0 400 600"', 'viewBox="58 44 284 294"').replace('overflow:visible', 'overflow:hidden'); }

// ----- animation du rig (GSAP injecte : marche dans l'app ET dans une composition HyperFrames)
function q(svg, sel) { return svg.querySelector(sel); }
export function poseVars(name) { return POSES[name] || POSES.idle; }
function jv(extra) { return Object.assign({ svgOrigin: '0 0' }, extra); }
export function setExpr(gsap, svg, expr) {
  svg.querySelectorAll('.p-expr').forEach((g) => gsap.set(g, { opacity: g.classList.contains('p-expr-' + expr) ? 1 : 0 }));
  const happy = expr === 'shout';
  gsap.set(svg.querySelectorAll('.p-eye-open'), { opacity: happy ? 0 : 1 });
  gsap.set(svg.querySelectorAll('.p-eye-happy'), { opacity: happy ? 1 : 0 });
}
export function setPose(gsap, svg, name) {
  const p = poseVars(name);
  gsap.set(q(svg, PART_SEL.armL), jv({ rotation: p.armL }));
  gsap.set(q(svg, PART_SEL.armR), jv({ rotation: -p.armR }));
  gsap.set(q(svg, PART_SEL.legL), jv({ rotation: p.legL }));
  gsap.set(q(svg, PART_SEL.legR), jv({ rotation: -p.legR }));
  gsap.set(q(svg, PART_SEL.body), jv({ rotation: p.lean, scaleY: p.sy }));
  gsap.set(q(svg, PART_SEL.head), jv({ rotation: p.tilt + p.lean * 0.5 }));
  gsap.set(q(svg, PART_SEL.rig), { y: p.y, rotation: p.rot, svgOrigin: '200 400' });
  setExpr(gsap, svg, p.expr);
}
/** Ajoute a la timeline `tl` la transition vers une pose. */
export function toPose(gsap, tl, svg, name, at, dur, ease) {
  const p = poseVars(name); const e = ease || 'back.out(1.6)'; const d = dur == null ? 0.35 : dur;
  tl.to(q(svg, PART_SEL.armL), jv({ rotation: p.armL, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.armR), jv({ rotation: -p.armR, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.legL), jv({ rotation: p.legL, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.legR), jv({ rotation: -p.legR, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.body), jv({ rotation: p.lean, scaleY: p.sy, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.head), jv({ rotation: p.tilt + p.lean * 0.5, duration: d, ease: e }), at);
  tl.to(q(svg, PART_SEL.rig), { y: p.y, rotation: p.rot, svgOrigin: '200 400', duration: d, ease: e }, at);
  tl.call(() => setExpr(gsap, svg, p.expr), null, at + d * 0.3);
  return tl;
}
/** Respiration + clignement ; n cycles de 1,6 s entre `at` et `at+dur`. */
export function idleCycle(gsap, tl, svg, at, dur) {
  const n = Math.max(1, Math.floor(dur / 1.6));
  for (let i = 0; i < n; i++) {
    const t = at + i * 1.6;
    tl.to(q(svg, PART_SEL.body), jv({ scaleY: 1.03, duration: 0.8, ease: 'sine.inOut' }), t);
    tl.to(q(svg, PART_SEL.body), jv({ scaleY: 1, duration: 0.8, ease: 'sine.inOut' }), t + 0.8);
    tl.to(q(svg, PART_SEL.head), jv({ rotation: 1.6, duration: 0.8, ease: 'sine.inOut' }), t);
    tl.to(q(svg, PART_SEL.head), jv({ rotation: -1.2, duration: 0.8, ease: 'sine.inOut' }), t + 0.8);
    svg.querySelectorAll('.p-eye-open').forEach((e, k) => {
      tl.to(e, { scaleY: 0.08, svgOrigin: k ? '248 190' : '152 190', duration: 0.07, ease: 'power1.in' }, t + 1.15);
      tl.to(e, { scaleY: 1, svgOrigin: k ? '248 190' : '152 190', duration: 0.1, ease: 'power1.out' }, t + 1.22);
    });
  }
  return tl;
}
/** Course "en face" : alternance jambes / bras, rebond du corps et de la tete. `period` = duree d'un pas complet (s). */
export function runCycle(gsap, tl, svg, at, dur, period) {
  const T = period || 0.42; const h = T / 2; const n = Math.max(1, Math.round(dur / T));
  for (let i = 0; i < n; i++) {
    const t = at + i * T;
    [[0, 1], [h, -1]].forEach(([off, s]) => {
      const a = t + off;
      tl.to(q(svg, PART_SEL.legL), jv({ rotation: s > 0 ? 34 : -6, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.legR), jv({ rotation: s > 0 ? 6 : -34, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.armL), jv({ rotation: s > 0 ? -18 : 62, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.armR), jv({ rotation: s > 0 ? -62 : 18, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.rig), { y: -16, duration: h * 0.45, ease: 'power2.out', svgOrigin: '200 400' }, a);
      tl.to(q(svg, PART_SEL.rig), { y: 0, duration: h * 0.55, ease: 'power2.in', svgOrigin: '200 400' }, a + h * 0.45);
      tl.to(q(svg, PART_SEL.head), jv({ rotation: s * 3.5, duration: h, ease: 'sine.inOut' }), a);
      tl.to(q(svg, PART_SEL.body), jv({ rotation: s * -3, duration: h, ease: 'sine.inOut' }), a);
    });
  }
  return tl;
}

/** Apparence stable derivee d'un texte (meme prenom -> meme visage). Renvoie {hair, skin, hairColor, kit}. */
export function avatarOf(seed) {
  let h = 7; const s = String(seed || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return { hair: ['court', 'boucles', 'pique', 'long'][h % 4], skin: (h >> 3) % 6, hairColor: (h >> 6) % 7, kit: ['uni', 'rayures', 'bande', 'cerceaux'][(h >> 9) % 4] };
}
