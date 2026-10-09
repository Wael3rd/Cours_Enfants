// ---------------------------------------------------------------- accessoires d'histoire (unites 2 et 3) : cloche, bocadillo, chat, guitare, cazuela, grenouille, cigogne, enfant fige
// Chaque prop = chaine SVG (viewBox fixe). Parties animables : .pr-bell (cloche, pivot haut), .pr-clap (battant), .pr-frog, .st-wing*.

/** Stone sandstone palette (Salamanca) */
const STN = { l: '#F8D993', m: '#EBB968', d: '#C98F45', dd: '#8E5A2C', roof: '#B4503A', roof2: '#8E3A2B' };

/**
 * Props. key : 'campana' (cloche de bronze 300x340, pivot haut 150 30) | 'bocadillo' (200x90) | 'gato' (chat orange assis 220x240) |
 * 'guitarra' (160x420) | 'cazuela' (casserole 260x150) | 'rana' (grenouille de pierre 160x140, + crane) | 'azulejo' (carreau 120x120).
 * opts : width, uid, tone (campana : 'bronce'|'muda' = gris terne).
 */
export function prop(key, opts) {
  opts = opts || {};
  const id = opts.uid || uid('pr'), g = (n) => `${id}-${n}`;
  const mk = (vb, w, h, inner, cls) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" class="pr-svg ${cls || ''}" aria-hidden="true" style="overflow:visible">${inner}</svg>`;
  if (key === 'campana') {
    const mute = opts.tone === 'muda', b1 = mute ? '#8C8A93' : '#E3A53C', b2 = mute ? '#6C6A75' : '#B97A1E', b3 = mute ? '#B5B3BC' : '#FFE08A';
    const W = opts.width || 300;
    return mk('0 0 300 340', W, Math.round(W * 340 / 300), `<defs><linearGradient id="${g('b')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${b2}"/><stop offset=".35" stop-color="${b1}"/><stop offset=".6" stop-color="${b3}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs>
<g class="pr-bell" data-px="150" data-py="34"><rect x="96" y="14" width="108" height="26" rx="10" fill="#6B3E26"/><rect x="96" y="14" width="108" height="8" rx="4" fill="#9A6038"/>
<path d="M130 40h40v26h-40Z" fill="${b2}"/><path d="M150 52C84 56 66 138 50 234Q36 270 24 296H276Q264 270 250 234C234 138 216 56 150 52Z" fill="url(#${g('b')})"/>
<path d="M24 296H276V312Q150 332 24 312Z" fill="${b2}"/><path d="M60 214Q150 236 240 214" stroke="${b2}" stroke-width="7" fill="none" opacity=".8"/><path d="M52 246Q150 268 248 246" stroke="${b3}" stroke-width="4" fill="none" opacity=".6"/>
<path d="M112 90Q96 150 84 226" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".35"/>
<g class="pr-clap" data-px="150" data-py="280"><path d="M150 280V316" stroke="#4A2A1C" stroke-width="7"/><circle cx="150" cy="324" r="15" fill="#4A2A1C"/></g></g>`, 'pr-campana');
  }
  if (key === 'bocadillo') {
    const W = opts.width || 200;
    return mk('0 0 200 90', W, Math.round(W * 0.45), `<path d="M10 52Q4 22 40 20L170 18Q198 22 190 52Q194 78 160 80L40 82Q8 80 10 52Z" fill="#E8B15C"/><path d="M26 28Q100 10 176 28" stroke="#F8D993" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/><g stroke="#B27A2E" stroke-width="5" stroke-linecap="round" opacity=".6"><path d="M52 26l-8 14M90 22l-8 14M128 22l-8 14M162 28l-8 12"/></g><path d="M16 56Q30 44 52 54Q80 44 104 54Q130 44 156 54Q176 46 188 56L186 68Q100 78 14 68Z" fill="#D8433F"/><path d="M18 62Q100 74 184 62" stroke="#F5E6C8" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 70Q100 84 182 70L176 78Q100 90 24 78Z" fill="#E8B15C"/>`, 'pr-bocadillo');
  }
  if (key === 'gato') {
    const W = opts.width || 220;
    return mk('0 0 220 240', W, Math.round(W * 240 / 220), `<g class="pr-cat"><path class="pr-tail" d="M170 206Q236 196 226 130Q220 104 200 112Q214 140 196 164Q176 178 150 186Z" fill="#E98A2E"/><path d="M62 228Q36 120 110 112Q184 120 162 228Z" fill="#F0A04B"/><path d="M96 228Q92 168 110 150Q132 168 128 228Z" fill="#FFE2B8"/>
<g class="pr-cat-head"><path d="M50 78L58 30L88 56Q110 50 132 56L162 30L170 78Q176 138 110 142Q44 138 50 78Z" fill="#F0A04B"/><path d="M62 44L66 66L82 58ZM158 44L154 66L138 58Z" fill="#F7B6A0"/><path d="M96 66Q110 54 124 66" stroke="#C86A1C" stroke-width="5" fill="none"/><path d="M80 74q-2 14 4 24M140 74q2 14 -4 24" stroke="#C86A1C" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="84" cy="102" rx="12" ry="14" fill="#9BE08B"/><ellipse cx="136" cy="102" rx="12" ry="14" fill="#9BE08B"/><ellipse cx="84" cy="104" rx="4" ry="11" fill="#1E2A14"/><ellipse cx="136" cy="104" rx="4" ry="11" fill="#1E2A14"/><circle cx="88" cy="96" r="3.4" fill="#fff"/><circle cx="140" cy="96" r="3.4" fill="#fff"/>
<path d="M104 118h12l-6 8Z" fill="#E8708A"/><path d="M110 126q-10 12 -20 6M110 126q10 12 20 6" stroke="#8A4A1C" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 116L22 108M60 126L24 132M160 116L198 108M160 126L196 132" stroke="#FFF1DC" stroke-width="3" stroke-linecap="round" opacity=".9"/></g>
<path d="M70 222Q74 236 92 238L104 238Q108 226 98 220ZM150 222Q146 236 128 238L116 238Q112 226 122 220Z" fill="#FFE2B8"/></g>`, 'pr-gato');
  }
  if (key === 'guitarra') {
    const W = opts.width || 160;
    return mk('0 0 160 420', W, Math.round(W * 420 / 160), `<rect x="68" y="0" width="26" height="40" rx="6" fill="#4A2A1C"/><g fill="#E0C07A"><circle cx="64" cy="10" r="5"/><circle cx="64" cy="26" r="5"/><circle cx="98" cy="10" r="5"/><circle cx="98" cy="26" r="5"/></g><rect x="70" y="38" width="22" height="168" fill="#3B2216"/><path d="M81 40V300" stroke="#E8DDC4" stroke-width="2.5"/><g stroke="#C9B890" stroke-width="2" opacity=".8"><path d="M70 70h22M70 100h22M70 132h22M70 164h22"/></g>
<path d="M81 196C26 196 8 232 22 262C-4 290 6 372 60 394Q81 402 102 394C156 372 166 290 140 262C154 232 136 196 81 196Z" fill="#C46B2E"/><path d="M81 206C38 206 24 236 36 258C16 284 24 360 66 380Q81 386 96 380C138 360 146 284 126 258C138 236 124 206 81 206Z" fill="#E0873A"/><circle cx="81" cy="290" r="26" fill="#2A160E"/><circle cx="81" cy="290" r="26" fill="none" stroke="#F8D993" stroke-width="6"/><rect x="58" y="344" width="46" height="12" rx="4" fill="#4A2A1C"/><path d="M40 244Q60 232 74 236" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".4"/>`, 'pr-guitarra');
  }
  if (key === 'cazuela') {
    const W = opts.width || 260;
    return mk('0 0 260 150', W, Math.round(W * 150 / 260), `<ellipse cx="130" cy="140" rx="110" ry="9" fill="#000" opacity=".25"/><path d="M26 62H234L222 120Q214 138 190 138H70Q46 138 38 120Z" fill="#C9573B"/><path d="M26 62H234L230 76H30Z" fill="#E8795A"/><path d="M232 78H256Q262 78 262 88Q262 98 254 98H228Z" fill="#8E3A2B"/><path d="M28 78H4Q-2 78 -2 88Q-2 98 6 98H32Z" fill="#8E3A2B"/><ellipse cx="130" cy="62" rx="104" ry="14" fill="#7A2E1E"/><ellipse cx="130" cy="62" rx="92" ry="10" fill="#E8A53C"/><g fill="#D8433F"><circle cx="96" cy="62" r="6"/><circle cx="130" cy="58" r="6"/><circle cx="164" cy="63" r="6"/></g><g fill="#3AA66A"><circle cx="112" cy="64" r="4"/><circle cx="148" cy="60" r="4"/></g><path d="M60 100Q130 112 200 100" stroke="#fff" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>`, 'pr-cazuela');
  }
  if (key === 'rana') {
    const W = opts.width || 160, glow = opts.glow === false ? '' : `<ellipse class="fz-glow" cx="80" cy="60" rx="120" ry="100" fill="url(#${g('gl')})" opacity="0"/>`;
    return mk('0 0 160 150', W, Math.round(W * 150 / 160), `<defs><radialGradient id="${g('gl')}"><stop offset="0" stop-color="#9bffd6" stop-opacity=".95"/><stop offset=".5" stop-color="#42E0A0" stop-opacity=".45"/><stop offset="1" stop-color="#42E0A0" stop-opacity="0"/></radialGradient></defs>${glow}
<path d="M30 148V104Q30 70 80 70Q130 70 130 104V148Z" fill="${STN.d}"/><ellipse cx="80" cy="104" rx="46" ry="38" fill="#F2E6C8"/><ellipse cx="62" cy="104" rx="11" ry="13" fill="#4A2A1C"/><ellipse cx="98" cy="104" rx="11" ry="13" fill="#4A2A1C"/><path d="M76 120l4 -10 4 10Z" fill="#4A2A1C"/><path d="M58 138h44" stroke="#4A2A1C" stroke-width="5"/><path d="M68 138v-10M80 138v-10M92 138v-10" stroke="#4A2A1C" stroke-width="4"/>
<g class="pr-frog"><path d="M34 70Q30 40 58 34Q80 28 102 34Q130 40 126 70Q118 82 80 82Q42 82 34 70Z" fill="${STN.m}"/><path d="M34 70Q30 40 58 34Q80 28 102 34Q130 40 126 70" fill="none" stroke="${STN.l}" stroke-width="4" opacity=".8"/><circle cx="52" cy="32" r="16" fill="${STN.m}"/><circle cx="108" cy="32" r="16" fill="${STN.m}"/><circle cx="52" cy="32" r="8" fill="#fff" opacity=".95"/><circle cx="108" cy="32" r="8" fill="#fff" opacity=".95"/><circle class="pr-eye" cx="52" cy="33" r="4.4" fill="#0E7F52"/><circle class="pr-eye" cx="108" cy="33" r="4.4" fill="#0E7F52"/><path d="M52 62Q80 78 108 62" stroke="${STN.dd}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M40 78Q30 92 44 98M120 78Q130 92 116 98" stroke="${STN.d}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M74 48q6 4 12 0" stroke="${STN.dd}" stroke-width="3" fill="none"/></g>`, 'pr-rana');
  }
  if (key === 'azulejo') {
    const W = opts.width || 120, c = opts.c || '#2F6FD0';
    return mk('0 0 100 100', W, W, `${azulejoPattern(g('t'), { a: opts.a || '#F5E6C8', b: c, c: opts.cc || PAL.sol, d: opts.d || '#F5E6C8' })}<rect width="100" height="100" rx="6" fill="url(#${g('t')})"/><rect x="2" y="2" width="96" height="96" rx="6" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>`, 'pr-azulejo');
  }
  return '';
}

/** Cigogne (cigueña) en vol (160x100) : ailes .st-wing (pivot epaule) a battre par rotation ; en 'rest' : posee sur un nid (120x150). */
export function storkSvg(opts) {
  opts = opts || {};
  const W = opts.width || 160;
  if (opts.rest) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="${W}" height="${Math.round(W * 150 / 120)}" class="st-svg" aria-hidden="true" style="overflow:visible"><path d="M30 140Q60 150 90 140L100 120H20Z" fill="#8A5A30"/><path d="M14 124l24 -8M96 116l16 -6M30 138l-12 6M88 140l16 4M44 120l-6 -12M76 118l8 -12" stroke="#6B3E26" stroke-width="5" stroke-linecap="round"/>
<path d="M44 118L40 80M76 118L80 80" stroke="#D8433F" stroke-width="5" stroke-linecap="round"/><path d="M34 82Q34 50 64 48Q96 52 92 86Q80 110 54 108Q36 104 34 82Z" fill="#fff"/><path d="M40 92Q64 112 92 82L90 96Q70 118 44 108Z" fill="#1E1A2B"/><g class="st-neck"><path d="M76 56Q92 40 86 22Q84 12 94 10L94 24Q108 34 90 62Z" fill="#fff"/><circle cx="92" cy="14" r="9" fill="#fff"/><path d="M98 12L132 20L98 22Z" fill="#D8433F"/><circle cx="94" cy="12" r="2.4" fill="#1E1A2B"/></g></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="${W}" height="${Math.round(W * 100 / 160)}" class="st-svg" aria-hidden="true" style="overflow:visible"><path d="M40 70L8 78" stroke="#D8433F" stroke-width="4" stroke-linecap="round"/><path d="M46 74L14 90" stroke="#D8433F" stroke-width="4" stroke-linecap="round"/>
<g class="st-wing st-wingB" data-px="80" data-py="50"><path d="M80 50Q60 6 14 8Q40 30 54 54Z" fill="#fff"/><path d="M14 8Q40 30 54 54L46 54Q36 30 14 8Z" fill="#1E1A2B"/></g><path d="M126 46Q150 38 156 50L126 56Z" fill="#D8433F"/><path d="M40 60Q40 40 76 40Q112 40 120 54Q112 70 76 72Q46 74 40 60Z" fill="#fff"/><path d="M110 50Q124 42 128 50Q122 58 112 58Z" fill="#fff"/><circle cx="120" cy="46" r="2.4" fill="#1E1A2B"/>
<g class="st-wing st-wingF" data-px="82" data-py="50"><path d="M82 50Q104 4 150 6Q124 30 108 56Z" fill="#fff"/><path d="M150 6Q124 30 108 56L116 56Q126 30 150 6Z" fill="#1E1A2B"/></g></svg>`;
}

/** Enfant "fige" (silence de la Sombra) : silhouette de papier decoupe grise-bleutee, bouche fermee, pose figee. pose : 'stand'|'ball'|'rope'|'run'|'sit'. 200x340. */
export function frozenKid(opts) {
  opts = opts || {};
  const W = opts.width || 120, pose = opts.pose || 'stand', c = opts.color || '#7A85B8', h = opts.hair || '#3A3F73', sk = opts.skin || '#B5BCD9', sh = shade(c, -0.25);
  const arms = pose === 'ball' ? `<path d="M64 130L28 70" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L172 70" stroke="${c}" stroke-width="22" stroke-linecap="round"/><circle cx="100" cy="36" r="26" fill="#C9CCE3"/><path d="M80 24Q100 40 120 24M80 48Q100 32 120 48" stroke="${sh}" stroke-width="4" fill="none"/>`
    : pose === 'rope' ? `<path d="M64 130L30 170" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L170 170" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M30 172Q100 330 170 172" stroke="#9AA2CF" stroke-width="5" fill="none"/>`
    : `<path d="M64 130L50 220" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M136 130L150 220" stroke="${c}" stroke-width="22" stroke-linecap="round"/>`;
  const legs = pose === 'run' ? `<path d="M84 224L52 322" stroke="${sh}" stroke-width="24" stroke-linecap="round"/><path d="M116 224L150 300" stroke="${sh}" stroke-width="24" stroke-linecap="round"/>` : `<path d="M84 226V320" stroke="${sh}" stroke-width="26" stroke-linecap="round"/><path d="M116 226V320" stroke="${sh}" stroke-width="26" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="${W}" height="${Math.round(W * 340 / 200)}" class="fk-svg" aria-hidden="true" style="overflow:visible">${arms}${legs}<path d="M58 124Q100 106 142 124L148 236H52Z" fill="${c}"/><circle cx="100" cy="90" r="42" fill="${sk}"/><path d="M58 88Q56 40 100 40Q146 40 142 88Q130 60 100 66Q70 60 58 88Z" fill="${h}"/>${opts.smile ? `<path d="M80 102q20 18 40 0" stroke="#7A2E2E" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="84" cy="88" r="6" fill="#2A160E"/><circle cx="116" cy="88" r="6" fill="#2A160E"/><circle cx="68" cy="102" r="7" fill="#FF7A7A" opacity=".35"/><circle cx="132" cy="102" r="7" fill="#FF7A7A" opacity=".35"/>` : `<path d="M84 104h32" stroke="${sh}" stroke-width="5" stroke-linecap="round"/><circle cx="84" cy="88" r="4.5" fill="${sh}"/><circle cx="116" cy="88" r="4.5" fill="${sh}"/>`}</svg>`;
}
