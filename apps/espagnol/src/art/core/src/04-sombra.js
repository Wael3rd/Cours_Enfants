// ---------------------------------------------------------------- La Sombra del Silencio - viewBox 0 0 500 660
// Silhouette de fumee encapuchonnee, vide sans visage, deux yeux qui brillent. Parties : s-wisp-N (volutes), s-body, s-void, s-eye (x2), s-arm.
export const SOMBRA_PIVOT = { rig: '250 330', eyeL: '226 142', eyeR: '276 142' };

export function sombra(opts) {
  opts = opts || {};
  const id = opts.uid || uid('sb'), W = opts.width || 480, H = opts.height || 576, g = (n) => `${id}-${n}`;
  const eyeColor = opts.eye || '#FFE7A3', glow = opts.glow || PAL.magenta;
  const body = smooth([[250, 36], [206, 82], [186, 140], [198, 196], [150, 236], [96, 322], [74, 430], [92, 520], [62, 612], [112, 566], [142, 636], [182, 560], [216, 644], [250, 570], [286, 644], [320, 560], [358, 636], [392, 560], [440, 614], [418, 520], [440, 430], [412, 322], [352, 236], [304, 196], [316, 140], [296, 82]], true);
  const wisps = [
    [[110, 330], [70, 270], [88, 200], [56, 140]], [[380, 330], [430, 262], [412, 190], [446, 120]],
    [[160, 220], [140, 150], [168, 96], [150, 40]], [[340, 220], [364, 150], [334, 90], [352, 30]],
    [[250, 36], [236, 0], [262, -22], [250, -50]],
  ].map((w, i) => {
    const thick = [34, 34, 22, 22, 16][i];
    const pts = w.map((p, k) => [p[0], p[1], thick * (1 - k / (w.length + 0.4))]);
    return `<g class="s-wisp s-wisp-${i}" data-px="${w[0][0]}" data-py="${w[0][1]}"><path d="${ribbonS(pts)}" fill="url(#${g('smoke')})" opacity="${0.78 - i * 0.06}"/></g>`;
  }).join('');
  const arm = `<g class="s-arm"><path d="${smooth([[372, 330], [430, 350], [486, 380], [520, 372], [492, 404], [440, 410], [380, 392]], true)}" fill="url(#${g('smoke')})"/><path d="M510 376l30 -10M504 392l32 6M496 404l26 18" stroke="#0C0E2E" stroke-width="7" stroke-linecap="round"/></g>`;
  const eye = (cx, cy, cls) => `<g class="s-eye ${cls}"><ellipse cx="${cx}" cy="${cy}" rx="44" ry="34" fill="url(#${g('glow')})"/><path d="M${cx - 24} ${cy + 5}Q${cx} ${cy - 22} ${cx + 24} ${cy - 5}Q${cx} ${cy + 16} ${cx - 24} ${cy + 5}Z" fill="${eyeColor}"/><ellipse cx="${cx + 3}" cy="${cy - 1}" rx="4.5" ry="8" fill="#2A0A24"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.view || '-40 -60 600 720'}" width="${W}" height="${H}" class="s-svg" role="img" aria-label="La Sombra del Silencio">
<defs>
<linearGradient id="${g('smoke')}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#3A3F9A"/><stop offset=".45" stop-color="#1E2161"/><stop offset="1" stop-color="#0C0E2E"/></linearGradient>
<linearGradient id="${g('body')}" x1="250" y1="30" x2="250" y2="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#262B78"/><stop offset=".4" stop-color="#171A52"/><stop offset="1" stop-color="#06071C"/></linearGradient>
<radialGradient id="${g('void')}" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#02020C"/><stop offset=".8" stop-color="#05061A"/><stop offset="1" stop-color="#0B0D2E"/></radialGradient>
<radialGradient id="${g('glow')}"><stop offset="0" stop-color="${glow}" stop-opacity=".95"/><stop offset=".5" stop-color="${glow}" stop-opacity=".35"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
</defs>
<g class="s-rig">
${wisps}
<g class="s-bodyg"><path class="s-body" d="${body}" fill="url(#${g('body')})" stroke="#6C74F0" stroke-opacity=".38" stroke-width="3" stroke-linejoin="round"/>
<path d="M150 236Q250 270 352 236M118 340Q250 380 382 340" stroke="#4B52C4" stroke-width="3" fill="none" opacity=".25" stroke-linecap="round"/>
<path d="M186 140Q250 30 316 140Q320 214 250 230Q184 214 186 140Z" fill="url(#${g('void')})"/>
${eye(222, 146, 's-eyeL')}${eye(280, 146, 's-eyeR')}
</g>
${opts.arm ? arm : ''}
</g>
</svg>`;
}
function ribbonS(pts) { // ruban lisse (copie locale legere de ribbon() pour les volutes)
  const L = [], R = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = pts[i][2] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const tip = pts[n - 1];
  return smooth(L.concat([[tip[0], tip[1] - 14]], R.reverse()), true);
}

function sEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function sa(root, sel) { return Array.from(sEl(root).querySelectorAll(sel)); }
/** Flottement lent + volutes qui ondulent (cycle fini : `cycles` aller-retours de `period` s). */
export function sombraFloat(tl, root, at, cycles, period) {
  const body = sa(root, '.s-bodyg');
  tl.to(body, { y: -14, duration: period / 2, ease: 'sine.inOut', yoyo: true, repeat: cycles * 2 - 1 }, at);
  sa(root, '.s-wisp').forEach((w, i) => {
    tl.to(w, { rotation: (i % 2 ? -1 : 1) * 7, svgOrigin: w.dataset.px + ' ' + w.dataset.py, duration: period * 0.7, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.round(cycles * 2 * 0.7) * 2 - 1) }, at + i * 0.15);
  });
}
/** Yeux : s'allument (ouverture) ou se plissent. */
export function sombraEyes(tl, root, at, mode, dur) {
  const eyes = sa(root, '.s-eye'), d = dur || 0.3;
  if (mode === 'open') tl.fromTo(eyes, { scaleY: 0.05, opacity: 0 }, { scaleY: 1, opacity: 1, svgOrigin: '250 144', duration: d, ease: 'back.out(3)' }, at);
  else if (mode === 'narrow') tl.to(eyes, { scaleY: 0.35, svgOrigin: '250 144', duration: d, ease: 'power2.inOut' }, at);
  else tl.to(eyes, { scaleY: 1, svgOrigin: '250 144', duration: d, ease: 'power2.out' }, at);
}
/** Dissolution : le corps se detache vers le haut en cendres (la poussiere doree est a la charge de la scene : dustField). */
export function sombraDissolve(tl, root, at, dur) {
  const r = sEl(root);
  tl.to(sa(r, '.s-eye'), { opacity: 0, scale: 0.4, svgOrigin: '250 144', duration: dur * 0.3, ease: 'power2.in' }, at);
  tl.to(sa(r, '.s-bodyg'), { scaleY: 0.35, scaleX: 1.12, y: -30, opacity: 0, svgOrigin: '250 640', duration: dur, ease: 'power2.in' }, at + dur * 0.1);
  sa(r, '.s-wisp').forEach((w, i) => tl.to(w, { y: -160 - i * 30, x: (i % 2 ? 40 : -40), opacity: 0, scale: 0.6, svgOrigin: w.dataset.px + ' ' + w.dataset.py, duration: dur * 0.9, ease: 'power1.in' }, at + i * 0.08));
}
