// ---------------------------------------------------------------- habillage TV : score bug, lower-third, carte joueur
function abbr(t) { const w = String(t || '').split(/[\s']+/).filter((x) => x && !/^(les|le|la|l|the|fc|ac|us)$/i.test(x)); return (w[0] || String(t || '')).replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 3).toUpperCase(); }
function fitSize(txt, base, maxW, k) { const w = String(txt).length * base * (k || 0.5); return w > maxW ? Math.floor(base * maxW / w) : base; }

/** Score bug TV (viewBox 980x130). opts : home/away {name,primary,secondary,initials}, scoreHome, scoreAway, clock. Classes : sb-home, sb-away, sb-clock. */
export function scoreBug(opts) {
  opts = opts || {};
  const h = Object.assign({ name: 'Les Lions', primary: '#E8212F', secondary: '#fff', initials: 'LL' }, opts.home);
  const a = Object.assign({ name: 'Les Aigles', primary: '#1B6BFF', secondary: '#fff', initials: 'LA' }, opts.away);
  const u = opts.uid || uid('sb');
  const sh = opts.scoreHome == null ? 0 : opts.scoreHome, sa = opts.scoreAway == null ? 0 : opts.scoreAway;
  const cr = (t, x) => nest(crest({ primary: t.primary, secondary: t.secondary, initials: t.initials, star: false, uid: u + x }), x === 'h' ? 26 : 854, 14, 96, 108);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-scorebug" viewBox="0 0 980 140" width="${opts.width || 980}" height="${opts.height || 140}">
<polygon points="14,10 966,10 946,134 34,134" fill="#000" opacity=".35"/>
<polygon points="10,4 970,4 950,126 30,126" fill="#0A1030"/>
<polygon points="10,4 400,4 380,126 30,126" fill="${h.primary}" class="sb-home-bg"/><polygon points="400,4 380,126 372,126 392,4" fill="#fff" opacity=".9"/>
<polygon points="970,4 580,4 600,126 950,126" fill="${a.primary}" class="sb-away-bg"/><polygon points="580,4 588,4 608,126 600,126" fill="#fff" opacity=".9"/>
<polygon points="10,4 400,4 392,40 18,40" fill="#fff" opacity=".12"/><polygon points="970,4 580,4 588,40 962,40" fill="#fff" opacity=".12"/>
${cr(h, 'h')}${cr(a, 'a')}
<text x="146" y="86" font-family="Anton, Bebas Neue, sans-serif" font-size="${fitSize(abbr(h.name), 70, 200, 0.46)}" fill="${textOn(h.primary)}" class="sb-home-name" letter-spacing="3">${esc(abbr(h.name))}</text>
<text x="834" y="86" text-anchor="end" font-family="Anton, Bebas Neue, sans-serif" font-size="${fitSize(abbr(a.name), 70, 200, 0.46)}" fill="${textOn(a.primary)}" class="sb-away-name" letter-spacing="3">${esc(abbr(a.name))}</text>
<polygon points="404,16 584,16 576,114 412,114" fill="#FFD23F"/>
<polygon points="404,16 584,16 580,40 408,40" fill="#fff" opacity=".35"/>
<text x="468" y="100" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="82" fill="#0A1030" class="sb-home sb-score" style="font-variant-numeric:tabular-nums">${sh}</text>
<text x="494" y="94" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#0A1030" opacity=".6">-</text>
<text x="520" y="100" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="82" fill="#0A1030" class="sb-away sb-score" style="font-variant-numeric:tabular-nums">${sa}</text>
<g class="sb-clock-chip"><polygon points="410,112 578,112 568,140 420,140" fill="#0A1030" stroke="#FFD23F" stroke-width="3"/><text x="494" y="134" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="#fff" class="sb-clock">${esc(opts.clock || '')}</text></g>
</svg>`;
}

/** Lower-third (viewBox 1100x230). opts : title, subtitle, primary, accent, badge. Classes : lt-title, lt-sub, lt-tab, lt-body, lt-bar. */
export function lowerThird(opts) {
  opts = opts || {};
  const p = opts.primary || '#1B6BFF', ac = opts.accent || '#FFD23F';
  const title = String(opts.title || ''), sub = String(opts.subtitle || '');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-lower" viewBox="0 0 1100 230" width="${opts.width || 1100}" height="${opts.height || 230}">
<g class="lt-shadow"><polygon points="40,22 1090,22 1054,222 6,222" fill="#000" opacity=".35"/></g>
<g class="lt-body"><polygon points="30,10 1080,10 1044,206 0,206" fill="#0A1030"/><polygon points="30,10 1080,10 1074,40 24,40" fill="#fff" opacity=".1"/></g>
<g class="lt-tab"><polygon points="0,206 30,10 150,10 116,206" fill="${ac}"/>${opts.badge != null ? `<text x="70" y="146" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#0A1030" class="lt-badge">${esc(opts.badge)}</text>` : ''}</g>
<g class="lt-bar"><polygon points="116,206 1044,206 1050,226 108,226" fill="${p}"/></g>
<text x="190" y="118" font-family="Anton, Bebas Neue, sans-serif" font-size="${fitSize(title, 92, 780, 0.46)}" fill="#fff" class="lt-title" letter-spacing="2">${esc(title)}</text>
<text x="192" y="180" font-family="Fredoka, sans-serif" font-weight="600" font-size="${fitSize(sub, 54, 780, 0.5)}" fill="${ac}" class="lt-sub">${esc(sub)}</text>
</svg>`;
}

const RARITY = {
  bronze:  { name: 'BRONZE',  stops: ['#F0B98A', '#C88A55', '#7A4A25'], edge: '#4A2810', ink: '#3A1E0C', glow: '#E0A070', stars: 1 },
  argent:  { name: 'ARGENT',  stops: ['#FFFFFF', '#D3DAE6', '#7C8798'], edge: '#3E4656', ink: '#1E2533', glow: '#DCE6FF', stars: 2 },
  or:      { name: 'OR',      stops: ['#FFF3B0', '#FFD23F', '#B07A00'], edge: '#5E3E00', ink: '#3A2600', glow: '#FFE48A', stars: 3 },
  legende: { name: 'LEGENDE', stops: ['#7CF3FF', '#C57BFF', '#FF7BC8'], edge: '#0A0630', ink: '#0A0630', glow: '#9AF', stars: 5 },
};
/** Carte joueur. opts : name, number, position, rarity('bronze'|'argent'|'or'|'legende'), primary, secondary, initials(blason), player{skin,hair,hairColor,kit}. Classes : cd-name, cd-num, cd-pos, card-shine, card-holo. */
export function cardFrame(opts) {
  opts = opts || {};
  const u = opts.uid || uid('cd');
  const R = RARITY[opts.rarity] || RARITY.bronze, leg = opts.rarity === 'legende';
  const p = opts.primary || '#E8212F', s = opts.secondary || '#FFFFFF';
  const name = String(opts.name || 'JOUEUR').toUpperCase();
  const shape = 'M70 0 H530 Q600 0 600 70 V690 Q600 750 546 776 L330 840 H270 L54 776 Q0 750 0 690 V70 Q0 0 70 0Z';
  const inner = 'M86 34 H514 Q566 34 566 86 V682 Q566 726 528 744 L322 804 H278 L72 744 Q34 726 34 682 V86 Q34 34 86 34Z';
  let rays = '';
  for (let i = 0; i < 14; i++) { const a0 = i * 25.7, a1 = a0 + 12.8; const f = (d) => `${(300 + 700 * Math.cos(d * Math.PI / 180)).toFixed(0)},${(380 + 700 * Math.sin(d * Math.PI / 180)).toFixed(0)}`; rays += `<polygon points="300,380 ${f(a0)} ${f(a1)}" fill="#fff" opacity=".1"/>`; }
  const stars = Array.from({ length: R.stars }, (_, i) => { const x = 300 + (i - (R.stars - 1) / 2) * 46; return `<path d="M${x} 746 l7 15 16 2 -12 11 4 16 -15 -9 -15 9 4 -16 -12 -11 16 -2z" fill="${leg ? '#fff' : R.stops[0]}" stroke="${leg ? '#0A0630' : R.edge}" stroke-width="3" paint-order="stroke"/>`; }).join('');
  const bustSvg = nest(bust(Object.assign({ primary: p, secondary: s, number: opts.number, pose: 'idle', uid: u + 'b' }, opts.player)), 70, 86, 460, 476);
  const badge = nest(crest({ primary: p, secondary: s, initials: opts.initials || initialsOf(name), star: false, uid: u + 'c' }), 40, 262, 82, 102);
  const nameSize = fitSize(name, 84, 470, 0.46);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ce-card ce-card-${opts.rarity || 'bronze'}" viewBox="0 0 600 840" width="${opts.width || 600}" height="${opts.height || 840}">
<defs><linearGradient id="${u}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${R.stops[0]}"/><stop offset=".5" stop-color="${R.stops[1]}"/><stop offset="1" stop-color="${R.stops[2]}"/></linearGradient>
<linearGradient id="${u}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00F0FF"/><stop offset=".25" stop-color="#7B5CFF"/><stop offset=".5" stop-color="#FF4FD8"/><stop offset=".75" stop-color="#FFE14F"/><stop offset="1" stop-color="#3CFF9E"/></linearGradient>
<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(p, -0.1)}"/><stop offset="1" stop-color="${shade(p, -0.62)}"/></linearGradient>
<linearGradient id="${u}n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1030" stop-opacity="0"/><stop offset="1" stop-color="#0A1030" stop-opacity=".92"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="${u}k"><path d="${shape}"/></clipPath><clipPath id="${u}i"><path d="${inner}"/></clipPath></defs>
<path d="${shape}" transform="translate(0,10)" fill="#000" opacity=".35"/>
<path d="${shape}" fill="${leg ? '#0A0630' : `url(#${u}r)`}"/>
${leg ? `<path d="${shape}" fill="url(#${u}h)" opacity=".95" class="card-holo"/>` : ''}
<g clip-path="url(#${u}i)"><rect width="600" height="840" fill="url(#${u}p)"/>${rays}
<polygon points="0,560 600,420 600,520 0,660" fill="${s}" opacity=".16"/>
<polygon points="0,610 600,470 600,500 0,640" fill="${R.stops[0]}" opacity=".5"/>
${bustSvg}<rect x="0" y="470" width="600" height="360" fill="url(#${u}n)"/><rect width="600" height="840" fill="${R.stops[1]}" opacity="${leg ? 0.08 : 0.14}"/></g>
<path d="${inner}" fill="none" stroke="${R.edge}" stroke-width="5"/><path d="${shape}" fill="none" stroke="${R.edge}" stroke-width="6"/>
<text x="62" y="214" font-family="Anton, Bebas Neue, sans-serif" font-size="128" fill="#fff" stroke="${R.edge}" stroke-width="8" paint-order="stroke" stroke-linejoin="round" class="cd-num">${esc(opts.number == null ? '' : opts.number)}</text>
<text x="64" y="262" font-family="Fredoka, sans-serif" font-weight="700" font-size="42" fill="${R.stops[0]}" stroke="${R.edge}" stroke-width="6" paint-order="stroke" class="cd-pos">${esc(opts.position || '')}</text>
${badge}
<polygon points="40,590 560,570 560,672 40,692" fill="#0A1030" opacity=".92"/><polygon points="40,590 560,570 560,580 40,600" fill="${R.stops[1]}"/>
<text x="300" y="${650 + (84 - nameSize) / 6}" text-anchor="middle" font-family="Anton, Bebas Neue, sans-serif" font-size="${nameSize}" fill="#fff" class="cd-name" letter-spacing="2" transform="rotate(-2.3 300 630)">${esc(name)}</text>
${stars}<text x="300" y="728" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="28" fill="${leg ? '#fff' : R.stops[0]}" letter-spacing="6">${R.name}</text>
<g clip-path="url(#${u}k)"><g class="card-shine" opacity="0"><polygon points="-120,0 -20,0 -260,840 -360,840" fill="url(#${u}w)" style="mix-blend-mode:overlay"/><polygon points="-110,0 -70,0 -310,840 -350,840" fill="#fff" opacity=".6"/></g></g>
</svg>`;
}
