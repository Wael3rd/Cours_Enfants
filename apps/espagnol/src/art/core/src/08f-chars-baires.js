// ---------------------------------------------------------------- personnages de l'unite 7 (Buenos Aires) : meme chibi 400x660.
// Facu (13 ans, de La Boca : maillot bleu et jaune generique, pas d'ecusson), Sol (12 ans, longs cheveux boucles, chemise jaune, guitare a part),
// Don Anibal (le bandoneoniste : feutre, gilet, moustache grise). Chaque entree : torso, back / front (cheveux, couvre-chef), acc. Visage, bras, jambes et rig : 08-characters.js.
Object.assign(CHARS, {
  facu: { name: 'Facu', skin: '#D9A07A', hair: '#1E120C', top: '#2F6FD0', pants: '#1D2160', shoes: '#F5E6C8', accent: '#FFC83D', mouthY: 0 },
  sol: { name: 'Sol', skin: '#E0AC84', hair: '#4A2A18', top: '#FFC83D', pants: '#2B318A', shoes: '#C9573B', accent: '#D93472', mouthY: 0 },
  anibal: { name: 'Don Aníbal', skin: '#D2A07A', hair: '#B9B4AE', top: '#8A3A2E', pants: '#2A2A3A', shoes: '#1E1A16', accent: '#E0A058', mouthY: 14 },
});
Object.assign(CHX, {
  facu: {
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M150 330Q200 350 252 330L256 372Q200 392 146 372Z" fill="${c.accent}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M162 286Q200 322 238 286L238 304Q200 340 162 304Z" fill="${c.accent}"/><circle cx="244" cy="352" r="9" fill="#F5E6C8" opacity=".85"/>`,
    front: (c) => `<path d="M102 186Q90 90 200 84Q310 90 298 186Q290 148 262 144Q236 128 200 138Q164 128 138 144Q110 148 102 186Z" fill="${c.hair}"/><path d="M130 118Q160 98 192 104" stroke="${shade(c.hair, 0.3)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`,
  },
  sol: {
    torso: (c) => `<path d="M134 436L266 436L296 548Q200 568 104 548Z" fill="${c.pants}"/><path d="M206 440L216 556Q258 552 296 548L266 436Z" fill="#000" opacity=".14"/><path class="c-torso" d="M140 292Q200 274 260 292L274 444Q200 468 126 444Z" fill="${c.top}"/><path d="M260 292L274 444Q240 456 214 460L222 300Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M160 286Q200 326 240 286L240 306Q200 346 160 306Z" fill="#FFFDF4"/><g fill="${c.accent}"><circle cx="176" cy="384" r="8"/><circle cx="226" cy="404" r="8"/><circle cx="196" cy="428" r="8"/></g>`,
    back: (c) => `<path d="M96 190Q76 90 200 74Q324 90 304 190Q330 260 306 340Q282 392 256 330Q250 280 270 232L130 232Q150 280 144 330Q118 392 94 340Q70 260 96 190Z" fill="${c.hair}"/>${[[96, 270], [88, 330], [306, 270], [314, 330], [112, 372], [290, 372]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="22" fill="${c.hair}"/>`).join('')}`,
    front: (c) => `<path d="M100 188Q98 94 200 88Q302 94 300 188Q284 140 244 144Q220 118 196 148Q150 130 100 188Z" fill="${c.hair}"/>${[[130, 120], [172, 100], [226, 100], [270, 122]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="20" fill="${c.hair}"/>`).join('')}<path d="M126 126Q166 98 212 106" stroke="${shade(c.hair, 0.35)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M96 150Q200 100 304 150" stroke="${c.accent}" stroke-width="12" fill="none" stroke-linecap="round"/>`,
  },
  anibal: {
    torso: (c) => `<path d="M128 436L272 436L282 560Q200 580 118 560Z" fill="${c.pants}"/><path d="M206 440L210 568Q250 566 282 560L272 436Z" fill="#000" opacity=".16"/><path class="c-torso" d="M134 294Q200 270 266 294L280 446Q200 472 120 446Z" fill="#F5E6C8"/><path d="M134 294Q176 304 186 350L180 456Q150 452 120 446Z" fill="${c.top}"/><path d="M266 294Q224 304 214 350L220 456Q250 452 280 446Z" fill="${c.top}"/><path d="M266 294L280 446Q250 452 220 456L214 350Q224 304 266 294Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M168 288Q200 326 232 288L232 308Q200 348 168 308Z" fill="#14173F"/><path d="M200 330V452" stroke="#F5E6C8" stroke-width="3" opacity=".6"/><circle cx="176" cy="380" r="5" fill="${c.accent}"/><circle cx="176" cy="414" r="5" fill="${c.accent}"/><circle cx="224" cy="380" r="5" fill="${c.accent}"/><circle cx="224" cy="414" r="5" fill="${c.accent}"/>`,
    back: (c) => `<path d="M104 190Q96 224 112 252Q108 214 120 190Z M296 190Q304 224 288 252Q292 214 280 190Z" fill="${c.hair}"/>`,
    front: (c) => `<ellipse cx="200" cy="112" rx="170" ry="30" fill="#2A2A3A"/><path d="M122 114Q124 28 200 24Q276 28 278 114Z" fill="#3A3A4C"/><path d="M122 114H278V90H122Z" fill="${c.accent}"/><path d="M122 98H278" stroke="#fff" stroke-width="3" opacity=".25"/><path d="M130 50Q200 22 270 50" stroke="#fff" stroke-width="5" fill="none" opacity=".18" stroke-linecap="round"/>`,
    acc: () => `<path d="M146 236Q174 216 200 234Q226 216 254 236Q248 262 200 250Q152 262 146 236Z" fill="#CFCAC4"/><path d="M162 240Q182 232 200 242Q218 232 238 240" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/><path d="M118 214q-10 6 -12 16M282 214q10 6 12 16" stroke="#8A5230" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>`,
  },
});
