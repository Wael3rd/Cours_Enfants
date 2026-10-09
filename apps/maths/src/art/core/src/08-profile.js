// ---------------------------------------------------------------- footballeur de PROFIL en course (regarde a droite)
// Meme esprit que player() : articulations <g class="ps-xxx"><g class="j"> animables avec svgOrigin "0 0".
// Classes : ps-rig, ps-legF, ps-legB, ps-armF, ps-armB, ps-head, ps-body. viewBox 400x600.
function sideLeg(cls, shadeAmt, o) {
  const k = (c) => (shadeAmt ? shade(c, shadeAmt) : c);
  const shoe = `<g transform="translate(205,0)"><path d="M-23 504 L21 504 C35 512 53 526 55 542 Q55 553 45 553 L-21 553 Q-27 553 -27 545 Z" fill="${k(o.shoe)}"/><path d="M-27 543 H55 V548 Q55 554 48 554 H-22 Q-27 554 -27 548Z" fill="${k('#ffffff')}"/><path d="M6 508 l10 -2 M10 515 l10 -2 M15 522 l9 -1" stroke="${k('#ffffff')}" stroke-width="3" stroke-linecap="round"/></g>`;
  return `<g class="${cls}" transform="translate(205,392)"><g class="j"><g transform="translate(-205,-392)">` +
    `<path d="M178 392 h54 v46 q0 6 -6 6 h-42 q-6 0 -6 -6z" fill="${k(o.shorts)}"/><rect x="178" y="430" width="54" height="8" fill="${k(o.trim)}"/>` +
    `<rect x="188" y="438" width="34" height="22" fill="${k(o.skin)}"/><rect x="185" y="456" width="40" height="54" fill="${k(o.socks)}"/><rect x="185" y="468" width="40" height="8" fill="${k(o.socks2)}"/>${shoe}</g></g></g>`;
}
function sideArm(cls, shadeAmt, o) {
  const k = (c) => (shadeAmt ? shade(c, shadeAmt) : c);
  return `<g class="${cls}" transform="translate(205,304)"><g class="j"><g transform="translate(-205,-304)">` +
    `<rect x="192" y="332" width="26" height="50" rx="12" fill="${k(o.skin)}"/><circle cx="205" cy="388" r="17" fill="${k(o.skin)}"/>` +
    `<rect x="185" y="290" width="40" height="52" rx="16" fill="${k(o.primary)}"/><rect x="185" y="330" width="40" height="10" fill="${k(o.secondary)}"/></g></g></g>`;
}
function sideHair(style, c) {
  const hl = shade(c, 0.3), rim = lum(c) < 0.07 ? shade(c, 0.5) : shade(c, -0.35);
  const base = `stroke="${rim}" stroke-width="3" stroke-linejoin="round"`;
  switch (style) {
    case 'boucles': {
      let s = '';
      [[120, 120, 40], [150, 84, 44], [200, 66, 46], [250, 78, 42], [286, 110, 34], [108, 168, 32], [140, 140, 34], [192, 110, 40], [244, 112, 32]].forEach((p) => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}" ${base}/>`; });
      return s + `<path d="M150 80 q14 -12 28 0 M214 66 q14 -12 28 0" stroke="${hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    }
    case 'pique':
      return `<path d="M98 168 L100 100 L134 118 L142 58 L174 100 L208 38 L240 96 L276 60 L280 114 L312 100 L306 150 C284 128 250 116 205 116 C160 116 126 134 98 168Z" fill="${c}" ${base}/>`;
    case 'long':
      return `<path d="M96 180 C84 100 140 52 212 54 C276 56 316 96 310 146 C288 122 250 112 212 114 C176 114 150 134 150 180 C152 236 160 290 138 330 C108 300 92 240 96 180Z" fill="${c}" ${base}/><path d="M130 90 C160 70 196 64 232 68" stroke="${hl}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>`;
    default:
      return `<path d="M96 178 C86 100 140 54 210 54 C274 54 316 92 312 146 C296 124 272 112 244 114 C214 108 186 124 160 130 C132 140 108 154 96 178Z" fill="${c}" ${base}/><path d="M130 86 C160 66 198 60 238 66" stroke="${hl}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`;
  }
}

/** Footballeur de profil en course. opts : primary, secondary, shorts, socks, skin(0-5|hex), hair, hairColor, number, ghost(bool: silhouette translucide) */
export function playerSide(opts) {
  opts = opts || {};
  const u = opts.uid || uid('ps');
  const primary = opts.primary || '#E8212F', secondary = opts.secondary || '#FFFFFF';
  const skin = typeof opts.skin === 'number' ? SKINS[opts.skin % SKINS.length] : opts.skin || SKINS[1];
  const hairC = typeof opts.hairColor === 'number' ? HAIRS[opts.hairColor % HAIRS.length] : opts.hairColor || HAIRS[0];
  const o = {
    primary, secondary, skin, skinD: shade(skin, -0.22),
    shorts: opts.shorts || (lum(primary) > 0.5 ? '#13204f' : '#FFFFFF'),
    trim: opts.trim || secondary, socks: opts.socks || primary, socks2: opts.socks2 || secondary, shoe: opts.shoe || '#121528',
  };
  const numC = lum(primary) > 0.5 ? '#0A1030' : '#FFFFFF', numS = lum(primary) > 0.5 ? '#FFFFFF' : '#0A1030';
  const brow = shade(hairC, lum(hairC) < 0.07 ? 0.1 : -0.25);
  const dk = '#2a1418';
  const jersey = 'M166 300 Q166 286 188 284 L228 284 Q248 286 248 300 L252 402 Q252 414 240 414 L176 414 Q164 414 164 402 Z';
  const num = opts.number == null ? '' : `<text x="208" y="372" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="54" fill="${numC}" stroke="${numS}" stroke-width="6" paint-order="stroke">${esc(opts.number)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-player-side" viewBox="0 0 400 600" width="${opts.width || 400}" height="${opts.height || 600}" style="overflow:visible${opts.ghost ? ';opacity:.42;filter:saturate(.5)' : ''}">
<defs><radialGradient id="${u}f" cx=".6" cy=".3" r=".85"><stop offset="0" stop-color="${shade(skin, 0.2)}"/><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${shade(skin, -0.14)}"/></radialGradient>
<linearGradient id="${u}j" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".4" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>
<g class="ps-shadow"><ellipse cx="205" cy="558" rx="104" ry="14" fill="#000" opacity=".3"/></g>
<g class="ps-rig">
${sideArm('ps-armB', -0.25, o)}${sideLeg('ps-legB', -0.25, o)}
<g class="ps-body" transform="translate(205,400)"><g class="j"><g transform="translate(-205,-400)">
<rect x="192" y="266" width="30" height="36" rx="10" fill="${skin}"/>
<path d="${jersey}" fill="${primary}"/><path d="${jersey}" fill="url(#${u}j)"/><rect x="164" y="400" width="88" height="9" fill="${secondary}" opacity=".9"/>
<path d="M166 300 Q166 286 188 284 L228 284" fill="none" stroke="${secondary}" stroke-width="7" stroke-linecap="round"/>${num}
<path d="M164 398 H252 L254 438 H162Z" fill="${o.shorts}"/><rect x="164" y="396" width="88" height="9" fill="${o.trim}" opacity=".9"/>
</g></g></g>
${sideLeg('ps-legF', 0, o)}${sideArm('ps-armF', 0, o)}
<g class="ps-head" transform="translate(205,290)"><g class="j"><g transform="translate(-205,-290)">
<path d="M96 176 C92 100 140 58 206 58 C268 58 312 100 312 164 C312 232 270 286 206 286 C142 286 100 236 96 176Z" fill="url(#${u}f)" stroke="${shade(skin, -0.32)}" stroke-width="4"/>
<path d="M306 186 C334 196 336 220 314 232 C304 236 296 232 294 224Z" fill="${skin}" stroke="${shade(skin, -0.32)}" stroke-width="4" stroke-linejoin="round"/>
<circle cx="168" cy="196" r="24" fill="${skin}" stroke="${shade(skin, -0.32)}" stroke-width="4"/><circle cx="168" cy="196" r="12" fill="${o.skinD}" opacity=".6"/>
<ellipse cx="268" cy="236" rx="22" ry="12" fill="#FF5E7A" opacity=".3"/>
<ellipse cx="262" cy="176" rx="28" ry="34" fill="#fff"/><circle cx="272" cy="182" r="19" fill="#3a2a20"/><circle cx="274" cy="182" r="10" fill="#0c0a10"/><circle cx="266" cy="173" r="6.5" fill="#fff"/>
<path d="M232 172 Q262 132 292 172" stroke="${dk}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M226 132 Q262 114 296 138" stroke="${brow}" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M250 252 Q278 262 300 244" stroke="${dk}" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M130 230 C150 262 180 280 206 284" stroke="#000" stroke-width="0" fill="none"/>
${sideHair(opts.hair || 'court', hairC)}
</g></g></g>
</g></svg>`;
}

function sq(svg, sel) { return svg.querySelector(sel); }
function sj(extra) { return Object.assign({ svgOrigin: '0 0' }, extra); }
/** Pose de depart de la course de profil. */
export function setRunSide(gsap, svg) {
  gsap.set(sq(svg, '.ps-legF .j'), sj({ rotation: -30 })); gsap.set(sq(svg, '.ps-legB .j'), sj({ rotation: 24 }));
  gsap.set(sq(svg, '.ps-armF .j'), sj({ rotation: 38 })); gsap.set(sq(svg, '.ps-armB .j'), sj({ rotation: -38 }));
  gsap.set(sq(svg, '.ps-body .j'), sj({ rotation: -9 })); gsap.set(sq(svg, '.ps-head .j'), sj({ rotation: 4 }));
}
/** Cycle de course de profil : jambes/bras en opposition, genou plie (scaleY) en phase de reprise, rebond. `period` = un pas complet (s). */
export function runSide(gsap, tl, svg, at, dur, period) {
  const T = period || 0.5, h = T / 2, n = Math.max(1, Math.round(dur / T));
  for (let i = 0; i < n; i++) {
    const t = at + i * T;
    [[0, 1], [h, -1]].forEach(([off, s]) => {
      const a = t + off;
      // s>0 : jambe avant (F) part en arriere, jambe B revient (pliee) vers l'avant
      tl.to(sq(svg, '.ps-legF .j'), sj({ rotation: s > 0 ? 34 : -44, scaleY: s > 0 ? 1 : 0.8, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-legB .j'), sj({ rotation: s > 0 ? -44 : 34, scaleY: s > 0 ? 0.8 : 1, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-armF .j'), sj({ rotation: s > 0 ? -52 : 62, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-armB .j'), sj({ rotation: s > 0 ? 62 : -52, duration: h, ease: 'sine.inOut' }), a);
      tl.to(sq(svg, '.ps-rig'), { y: -14, duration: h * 0.45, ease: 'power2.out' }, a);
      tl.to(sq(svg, '.ps-rig'), { y: 0, duration: h * 0.55, ease: 'power2.in' }, a + h * 0.45);
      tl.to(sq(svg, '.ps-head .j'), sj({ rotation: 4 + s * 2, duration: h, ease: 'sine.inOut' }), a);
    });
  }
  return tl;
}
