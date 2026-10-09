// ---------------------------------------------------------------- trophee, medaille, paquet de cartes, piste
const METAL = {
  or:     ['#FFF6BF', '#FFD23F', '#C28A00', '#7A5200'],
  argent: ['#FFFFFF', '#D6DDEB', '#8A95A8', '#4C5568'],
  bronze: ['#FFD9B3', '#E0975C', '#9A5A2B', '#5A3010'],
};
function metalGrad(id, m, horizontal) {
  const a = horizontal ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="1" y2="1"';
  return `<linearGradient id="${id}" ${a}><stop offset="0" stop-color="${m[2]}"/><stop offset=".22" stop-color="${m[0]}"/><stop offset=".45" stop-color="${m[1]}"/><stop offset=".7" stop-color="${m[2]}"/><stop offset=".85" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[3]}"/></linearGradient>`;
}

/** Trophee (coupe a anses). Classes : tr-cup, tr-base, tr-glint, tr-star. viewBox 400x640. */
export function trophy(opts) {
  opts = opts || {};
  const u = opts.uid || uid('tr'), m = METAL[opts.metal || 'or'];
  const handle = (s) => `<path d="M${200 + s * 98} 168 C${200 + s * 190} 150 ${200 + s * 196} 280 ${200 + s * 104} 306" stroke="${m[3]}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${200 + s * 98} 168 C${200 + s * 190} 150 ${200 + s * 196} 280 ${200 + s * 104} 306" stroke="url(#${u}g)" stroke-width="20" fill="none" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-trophy" viewBox="0 0 400 640" width="${opts.width || 400}" height="${opts.height || 640}" style="overflow:visible">
<defs>${metalGrad(u + 'g', m, true)}${metalGrad(u + 'd', m, false)}
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D2A5E"/><stop offset="1" stop-color="#070C2B"/></linearGradient>
<radialGradient id="${u}i" cx=".5" cy=".3"><stop offset="0" stop-color="#8A5A00"/><stop offset="1" stop-color="#2A1A00"/></radialGradient></defs>
<ellipse cx="200" cy="626" rx="170" ry="16" fill="#000" opacity=".4"/>
<g class="tr-base"><path d="M70 560 H330 L342 622 H58Z" fill="url(#${u}b)"/><rect x="58" y="612" width="284" height="12" rx="5" fill="url(#${u}g)"/><path d="M104 522 H296 L306 562 H94Z" fill="url(#${u}g)"/><rect x="132" y="570" width="136" height="34" rx="6" fill="url(#${u}g)"/><rect x="140" y="576" width="120" height="22" rx="4" fill="${m[3]}" opacity=".5"/></g>
<g class="tr-cup">${handle(-1)}${handle(1)}
<path d="M176 400 H224 L232 524 H168Z" fill="url(#${u}g)"/><ellipse cx="200" cy="474" rx="40" ry="15" fill="url(#${u}g)"/><ellipse cx="200" cy="474" rx="40" ry="15" fill="none" stroke="${m[3]}" stroke-width="3"/><ellipse cx="200" cy="528" rx="62" ry="14" fill="url(#${u}g)"/>
<path d="M98 130 H302 C306 262 272 350 200 410 C128 350 94 262 98 130Z" fill="url(#${u}g)"/>
<path d="M98 130 H302 C306 262 272 350 200 410 C128 350 94 262 98 130Z" fill="none" stroke="${m[3]}" stroke-width="5"/>
<ellipse cx="200" cy="130" rx="102" ry="26" fill="url(#${u}d)"/><ellipse cx="200" cy="132" rx="90" ry="19" fill="url(#${u}i)"/>
<path d="M200 196 l16 36 40 4 -30 26 9 40 -35 -21 -35 21 9 -40 -30 -26 40 -4z" fill="${m[0]}" opacity=".9" class="tr-star"/><path d="M200 196 l16 36 40 4 -30 26 9 40 -35 -21 -35 21 9 -40 -30 -26 40 -4z" fill="none" stroke="${m[3]}" stroke-width="4" stroke-linejoin="round"/>
<path d="M118 150 C118 240 142 316 176 366" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".55" class="tr-glint"/></g>
</svg>`;
}

/** Medaille avec ruban (viewBox 400x720, point d'accroche en haut au centre). opts : metal('or'|'argent'|'bronze'), rank. Classes : md-disc, md-glint. */
export function medal(opts) {
  opts = opts || {};
  const k = opts.metal || 'or', m = METAL[k], u = opts.uid || uid('md');
  const rank = opts.rank || (k === 'or' ? 1 : k === 'argent' ? 2 : 3);
  let leaves = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2, r = 118, x = 200 + r * Math.cos(a), y = 470 + r * Math.sin(a), rot = (a * 180) / Math.PI + 90;
    leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="22" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${m[0]}" stroke="${m[3]}" stroke-width="2.5"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-medal" viewBox="0 0 400 720" width="${opts.width || 400}" height="${opts.height || 720}" style="overflow:visible">
<defs>${metalGrad(u + 'g', m, false)}<radialGradient id="${u}r" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${m[0]}"/><stop offset=".6" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></radialGradient></defs>
<polygon points="110,-40 200,300 150,300 40,-40" fill="#1B6BFF"/><polygon points="290,-40 200,300 250,300 360,-40" fill="#E8212F"/>
<polygon points="110,-40 200,300 250,300 160,-40" fill="#fff" opacity=".0"/><polygon points="160,-40 200,300 250,300 200,-40" fill="#F7F9FF"/><polygon points="200,-40 250,300 290,-40" fill="#E8212F" opacity="0"/>
<polygon points="40,-40 110,-40 200,300 150,300" fill="#1B6BFF"/><polygon points="40,-40 70,-40 170,300 150,300" fill="#fff" opacity=".18"/>
<rect x="168" y="286" width="64" height="40" rx="12" fill="url(#${u}g)" stroke="${m[3]}" stroke-width="4"/><circle cx="200" cy="316" r="22" fill="none" stroke="${m[3]}" stroke-width="12"/><circle cx="200" cy="316" r="22" fill="none" stroke="url(#${u}g)" stroke-width="7"/>
<g class="md-disc"><ellipse cx="206" cy="480" rx="160" ry="160" fill="#000" opacity=".3"/>
<circle cx="200" cy="470" r="160" fill="url(#${u}g)" stroke="${m[3]}" stroke-width="6"/>${leaves}
<circle cx="200" cy="470" r="104" fill="url(#${u}r)" stroke="${m[3]}" stroke-width="6"/><circle cx="200" cy="470" r="92" fill="none" stroke="${m[0]}" stroke-width="3" opacity=".8"/>
<text x="200" y="${rank === 1 ? 528 : 526}" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="170" fill="${m[0]}" stroke="${m[3]}" stroke-width="9" paint-order="stroke" stroke-linejoin="round">${rank}</text>
<path d="M200 380 l9 18 20 3 -15 14 4 20 -18 -10 -18 10 4 -20 -15 -14 20 -3z" fill="#fff" opacity=".0"/>
<path d="M92 400 C120 330 200 304 260 322" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".5" class="md-glint"/></g>
</svg>`;
}

/** Dos de carte (meme forme que cardFrame). */
export function cardBack(opts) {
  opts = opts || {};
  const u = opts.uid || uid('cb'), p = opts.primary || '#1B2C86';
  const shape = 'M70 0 H530 Q600 0 600 70 V690 Q600 750 546 776 L330 840 H270 L54 776 Q0 750 0 690 V70 Q0 0 70 0Z';
  let dia = '';
  for (let y = -40; y < 880; y += 70) for (let x = (Math.round(y / 70) % 2) * 35 - 35; x < 640; x += 70) dia += `<path d="M${x} ${y + 35} l35 -35 35 35 -35 35z" fill="#fff" opacity=".05"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-cardback" viewBox="0 0 600 840" width="${opts.width || 600}" height="${opts.height || 840}">
<defs><clipPath id="${u}k"><path d="${shape}"/></clipPath><radialGradient id="${u}r" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#4B6BFF"/><stop offset="1" stop-color="${shade(p, -0.55)}"/></radialGradient></defs>
<path d="${shape}" transform="translate(0,10)" fill="#000" opacity=".35"/><path d="${shape}" fill="#FFD23F"/>
<g clip-path="url(#${u}k)"><rect x="14" y="14" width="572" height="812" fill="url(#${u}r)" clip-path="url(#${u}k)"/>${dia}</g>
<path d="M86 34 H514 Q566 34 566 86 V682 Q566 726 528 744 L322 804 H278 L72 744 Q34 726 34 682 V86 Q34 34 86 34Z" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>
<circle cx="300" cy="400" r="150" fill="#0A1030" opacity=".55"/><circle cx="300" cy="400" r="150" fill="none" stroke="#FFD23F" stroke-width="8"/>
<path d="M300 290 l26 58 64 6 -48 42 15 62 -57 -33 -57 33 15 -62 -48 -42 64 -6z" fill="#FFD23F" stroke="#7A5200" stroke-width="6" stroke-linejoin="round"/>
<text x="300" y="640" text-anchor="middle" font-family="Anton, sans-serif" font-size="70" fill="#fff" letter-spacing="6">CALCUL</text><text x="300" y="706" text-anchor="middle" font-family="Anton, sans-serif" font-size="70" fill="#FFD23F" letter-spacing="6">CHAMPION</text>
</svg>`;
}

/** Paquet de cartes en aluminium (viewBox 440x680). Groupes : pk-body, pk-top (partie a dechirer, y < 130). */
export function cardPack(opts) {
  opts = opts || {};
  const u = opts.uid || uid('pk'), a = opts.primary || '#2A46FF', b = opts.secondary || '#FF3D9A';
  const pts = [];
  for (let x = 0; x <= 440; x += 11) pts.push([x, ((x / 11) | 0) % 2 ? 9 : 0]);
  for (let x = 440; x >= 0; x -= 11) pts.push([x, 680 - (((x / 11) | 0) % 2 ? 9 : 0)]);
  const bodyPath = 'M' + pts.map((q) => q[0] + ' ' + q[1]).join(' L') + 'Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-pack" viewBox="0 0 440 680" width="${opts.width || 440}" height="${opts.height || 680}" style="overflow:visible">
<defs><linearGradient id="${u}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${shade(a, 0.25)}"/><stop offset="1" stop-color="${b}"/></linearGradient>
<linearGradient id="${u}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".25" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
<clipPath id="${u}t"><rect x="-20" y="-20" width="480" height="150"/></clipPath><clipPath id="${u}m"><rect x="-20" y="130" width="480" height="570"/></clipPath></defs>
<ellipse cx="220" cy="676" rx="190" ry="18" fill="#000" opacity=".35"/>
<g class="pk-body" clip-path="url(#${u}m)"><path d="${bodyPath}" fill="url(#${u}f)"/><path d="${bodyPath}" fill="url(#${u}s)"/>
<circle cx="220" cy="360" r="120" fill="#0A1030" opacity=".35"/><path d="M220 262 l23 52 56 5 -42 37 13 55 -50 -29 -50 29 13 -55 -42 -37 56 -5z" fill="#FFD23F" stroke="#7A5200" stroke-width="6" stroke-linejoin="round"/>
<text x="220" y="546" text-anchor="middle" font-family="Anton, sans-serif" font-size="74" fill="#fff" stroke="#0A1030" stroke-width="8" paint-order="stroke" letter-spacing="4">CARTES</text><text x="220" y="596" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="30" fill="#FFD23F">5 joueurs</text></g>
<g class="pk-top" clip-path="url(#${u}t)"><path d="${bodyPath}" fill="url(#${u}f)"/><path d="${bodyPath}" fill="url(#${u}s)"/><rect x="0" y="118" width="440" height="12" fill="#000" opacity=".25"/></g>
</svg>`;
}

/** Piste d'athletisme (vue de face, couloirs en perspective). SVG 1920x1200, horizon y=620. */
export function track(opts) {
  opts = opts || {}; const u = opts.uid || uid('tk'), HZ = 620;
  let lanes = '', lines = '';
  const N = 7;
  for (let i = 0; i < N; i++) {
    const x0 = 960 + (i - N / 2) * 70, x1 = 960 + (i + 1 - N / 2) * 70, y0 = 2400 * 0 + 0;
    const X0 = 960 + (i - N / 2) * 560, X1 = 960 + (i + 1 - N / 2) * 560;
    lanes += `<polygon points="${x0},${HZ} ${x1},${HZ} ${X1},1200 ${X0},1200" fill="${i % 2 ? '#E5502A' : '#D8431F'}"/>`;
    lines += `<line x1="${x0}" y1="${HZ}" x2="${X0}" y2="1200" stroke="#fff" stroke-width="8" opacity=".9"/>`;
  }
  lines += `<line x1="${960 + N / 2 * 70}" y1="${HZ}" x2="${960 + N / 2 * 560}" y2="1200" stroke="#fff" stroke-width="8" opacity=".9"/>`;
  let marks = '';
  for (let k = 1; k < 8; k++) { const t = Math.pow(k / 8, 1.9), y = HZ + (1200 - HZ) * t; marks += `<rect x="0" y="${y.toFixed(1)}" width="1920" height="${(2 + 6 * t).toFixed(1)}" fill="#000" opacity=".07"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="st-track" viewBox="0 0 1920 1200" width="1920" height="1200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0a05" stop-opacity=".6"/><stop offset=".3" stop-color="#2a0a05" stop-opacity="0"/></linearGradient></defs>
<rect x="0" y="${HZ}" width="1920" height="580" fill="#0F8F42"/><svg x="0" y="${HZ}" width="1920" height="580" viewBox="0 ${HZ} 1920 580" overflow="hidden">${lanes}${lines}${marks}<rect x="0" y="${HZ}" width="1920" height="580" fill="url(#${u}d)"/></svg></svg>`;
}
