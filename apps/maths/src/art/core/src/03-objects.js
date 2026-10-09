// ---------------------------------------------------------------- blason, ballon, cage
const SHIELD = 'M22 24 Q100 6 178 24 L178 120 C178 178 140 214 100 234 C60 214 22 178 22 120 Z';

/** Blason procedural. opts : primary, secondary, initials, pattern('auto'|'stripes'|'band'|'chevron'|'split'|'plain'), star(bool), uid, width, height. */
export function crest(opts) {
  opts = opts || {};
  const u = opts.uid || uid('cr');
  const p = opts.primary || '#E8212F', s = opts.secondary || '#FFFFFF';
  const ini = esc((opts.initials || 'FC').slice(0, 3).toUpperCase());
  let pat = opts.pattern || 'auto';
  if (pat === 'auto') { let h = 0; for (let i = 0; i < ini.length; i++) h += ini.charCodeAt(i); pat = ['stripes', 'band', 'chevron', 'split', 'stripes', 'band'][h % 6]; }
  let art = '';
  if (pat === 'stripes') for (let x = 28; x < 178; x += 36) art += `<rect x="${x}" y="0" width="18" height="260" fill="${s}"/>`;
  else if (pat === 'band') art = `<polygon points="0,170 220,70 220,118 0,218" fill="${s}"/>`;
  else if (pat === 'chevron') art = `<polygon points="0,96 100,168 200,96 200,140 100,212 0,140" fill="${s}"/>`;
  else if (pat === 'split') art = `<rect x="100" y="0" width="100" height="260" fill="${s}"/>`;
  const tc = pat === 'plain' ? textOn(p) : '#FFFFFF';
  const fs = ini.length >= 3 ? 70 : 92;
  const ink = shade(p, -0.62);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-crest" viewBox="0 0 200 250" width="${opts.width || 200}" height="${opts.height || 250}">
<defs><clipPath id="${u}k"><path d="${SHIELD}" transform="translate(100,128) scale(.9) translate(-100,-128)"/></clipPath>
<linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>
<path d="${SHIELD}" transform="translate(0,6)" fill="#000" opacity=".3"/>
<path d="${SHIELD}" fill="${ink}"/>
<path d="${SHIELD}" transform="translate(100,128) scale(.955) translate(-100,-128)" fill="${s === '#FFFFFF' || lum(s) > 0.7 ? '#F4F6FF' : s}"/>
<g clip-path="url(#${u}k)"><rect width="200" height="250" fill="${p}"/>${art}<rect width="200" height="250" fill="url(#${u}g)"/>
<g class="crest-sweep" opacity="0"><polygon points="-30,0 10,0 -40,250 -80,250" fill="#fff" opacity=".7"/></g></g>
<path d="${SHIELD}" transform="translate(100,128) scale(.9) translate(-100,-128)" fill="none" stroke="${ink}" stroke-width="3"/>
${opts.star === false ? '' : `<path d="M100 36 l7 15 16 2 -12 11 4 16 -15 -9 -15 9 4 -16 -12 -11 16 -2z" fill="#FFD23F" stroke="${ink}" stroke-width="3" stroke-linejoin="round" transform="translate(0,-2)"/>`}
<text x="100" y="${ini.length >= 3 ? 170 : 178}" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="${fs}" fill="${tc}" stroke="${ink}" stroke-width="9" paint-order="stroke" stroke-linejoin="round" class="crest-ini">${ini}</text>
</svg>`;
}

/** Ballon (pavage classique, ombrage de sphere). Le groupe `.ball-spin` est a faire tourner. */
export function ball(opts) {
  opts = opts || {};
  const u = opts.uid || uid('bl');
  const pent = (cx, cy, r, rot) => { let d = ''; for (let i = 0; i < 5; i++) { const a = (rot + i * 72) * Math.PI / 180; d += (i ? 'L' : 'M') + (cx + r * Math.sin(a)).toFixed(1) + ' ' + (cy - r * Math.cos(a)).toFixed(1); } return d + 'Z'; };
  const ink = opts.ink || '#101634';
  let patches = `<path d="${pent(50, 50, 15, 0)}" fill="${ink}"/>`, seams = '';
  for (let i = 0; i < 5; i++) {
    const a = i * 72 * Math.PI / 180;
    const cx = 50 + 41 * Math.sin(a), cy = 50 - 41 * Math.cos(a);
    patches += `<path d="${pent(cx, cy, 13, i * 72 + 36)}" fill="${ink}"/>`;
    const x1 = 50 + 15 * Math.sin(a), y1 = 50 - 15 * Math.cos(a), x2 = 50 + 28 * Math.sin(a), y2 = 50 - 28 * Math.cos(a);
    seams += `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} `;
    const b = (i * 72 + 36) * Math.PI / 180;
    seams += `M${(50 + 15 * Math.sin(b)).toFixed(1)} ${(50 - 15 * Math.cos(b)).toFixed(1)} L${(50 + 44 * Math.sin(b)).toFixed(1)} ${(50 - 44 * Math.cos(b)).toFixed(1)} `;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-ball" viewBox="0 0 100 100" width="${opts.width || 100}" height="${opts.height || 100}">
<defs><clipPath id="${u}c"><circle cx="50" cy="50" r="47"/></clipPath>
<radialGradient id="${u}s" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1a2260" stop-opacity=".5"/></radialGradient></defs>
<circle cx="50" cy="50" r="48" fill="#F4F6FF"/>
<g clip-path="url(#${u}c)"><g class="ball-spin" transform="translate(50,50)"><g class="j"><g transform="translate(-50,-50)">${patches}<path d="${seams}" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/></g></g></g>
<circle cx="50" cy="50" r="47" fill="url(#${u}s)"/></g>
<circle cx="50" cy="50" r="47.5" fill="none" stroke="${ink}" stroke-width="2.6"/>
</svg>`;
}

/** Cage vue de face avec filet : groupes `.goal-back` (fond de filet), `.goal-sides`, `.goal-frame`. */
export function goal(opts) {
  opts = opts || {};
  const u = opts.uid || uid('gl');
  const net = `<pattern id="${u}n" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 H22 M0 0 V22" stroke="#fff" stroke-width="2.2" opacity=".78"/></pattern>`;
  const post = (d) => `<path d="${d}" stroke="#0A1030" stroke-width="26" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" stroke="url(#${u}p)" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-goal" viewBox="0 0 900 540" width="${opts.width || 900}" height="${opts.height || 540}" style="overflow:visible">
<defs>${net}<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#E3E9F7"/><stop offset="1" stop-color="#B7C2DE"/></linearGradient>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1030" stop-opacity=".55"/><stop offset="1" stop-color="#0A1030" stop-opacity=".15"/></linearGradient></defs>
<ellipse cx="450" cy="486" rx="410" ry="22" fill="#000" opacity=".28"/>
<g class="goal-back"><polygon points="210,176 690,176 690,424 210,424" fill="url(#${u}b)"/><polygon points="210,176 690,176 690,424 210,424" fill="url(#${u}n)"/></g>
<g class="goal-sides"><polygon points="112,128 210,176 210,424 112,476" fill="#0A1030" opacity=".28"/><polygon points="112,128 210,176 210,424 112,476" fill="url(#${u}n)" opacity=".75"/>
<polygon points="788,128 690,176 690,424 788,476" fill="#0A1030" opacity=".28"/><polygon points="788,128 690,176 690,424 788,476" fill="url(#${u}n)" opacity=".75"/>
<polygon points="112,128 788,128 690,176 210,176" fill="#0A1030" opacity=".18"/><polygon points="112,128 788,128 690,176 210,176" fill="url(#${u}n)" opacity=".6"/></g>
<g class="goal-frame"><path d="M210 176 H690 M210 176 V424 M690 176 V424" stroke="#fff" stroke-width="4" opacity=".7" fill="none"/>
${post('M112 476 V128 H788 V476')}</g>
</svg>`;
}
