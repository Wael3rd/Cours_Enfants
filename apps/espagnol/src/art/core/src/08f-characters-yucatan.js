// ---------------------------------------------------------------- personnages du Yucatan (unite 9) : meme chibi 400x660.
// Itzel (12 ans, huipil blanc brode de fleurs, tresses a rubans rouges, panier au bras), Don Chan (guide, chapeau de paille, guayabera, moustache grise),
// Dona Chabela (grand-mere maya, huipil rose, chignon gris). Visage, bras, jambes et rig : 08-characters.js. Broderies : embroideryBand (08c).
Object.assign(CHARS, {
  itzel: { name: 'Itzel', skin: '#C58A5E', hair: '#150C08', top: '#FFFDF4', pants: '#FFFDF4', shoes: '#C9573B', accent: '#D93472', mouthY: 0 },
  chan: { name: 'Don Chan', skin: '#B97F52', hair: '#9C968F', top: '#F3E8CF', pants: '#8C7A5E', shoes: '#4A2A18', accent: '#E9B25A', mouthY: 14 },
  chabela: { name: 'Doña Chabela', skin: '#B57A4E', hair: '#D7D2CB', top: '#FFFDF4', pants: '#FFFDF4', shoes: '#4A2A18', accent: '#D93472', mouthY: 0 },
});

/** Petite fleur brodee a 5 petales (huipil). */
function yuStitchFlower(cx, cy, r, c1, c2) {
  let p = '';
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; p += `<circle cx="${r1(cx + Math.cos(a) * r)}" cy="${r1(cy + Math.sin(a) * r)}" r="${r1(r * 0.62)}" fill="${c1}"/>`; }
  return p + `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.5)}" fill="${c2}"/>`;
}
/** Robe-huipil : longue robe blanche, col carre brode de fleurs, bande de broderie en bas. */
function yuHuipil(c, hem, neckA, neckB) {
  let flowers = '';
  [150, 178, 206, 234].forEach((x, i) => { flowers += yuStitchFlower(x + 6, 320 + (i % 2) * 6, 8, i % 2 ? neckA : neckB, '#FFC83D'); });
  return `<path d="M128 436L272 436L304 598Q200 618 96 598Z" fill="${c.top}"/><path d="M204 440L210 606Q256 604 304 598L272 436Z" fill="#000" opacity=".1"/>${embroideryBand(98, 560, 206, 30, hem, '#FFC83D')}${embroideryBand(108, 540, 186, 12, '#19B7AA', '#FFFDF4')}`
    + `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.16)}" opacity=".5"/>`
    + `<path d="M142 292H258L252 352H148Z" fill="${hem}" opacity=".92"/><path d="M152 300H248L244 344H156Z" fill="${c.top}"/>${flowers}`
    + `<path d="M126 436Q200 462 274 436L274 450Q200 476 126 450Z" fill="${hem}"/>`;
}

Object.assign(CHX, {
  itzel: {
    torso: (c) => `<g><path d="M52 436Q44 500 84 512L134 512Q144 460 128 436Z" fill="#B5793A"/><path d="M52 436H134" stroke="#7E4F22" stroke-width="6"/><path d="M60 452H128M58 470H130M62 488H126" stroke="#7E4F22" stroke-width="3" opacity=".55"/><path d="M56 436Q96 372 138 400" stroke="#7E4F22" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="76" cy="448" r="7" fill="#FF9F1C"/><circle cx="104" cy="446" r="7" fill="#D93472"/></g>` + yuHuipil(c, '#D93472', '#19B7AA', '#FF7FB0'),
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q88 250 98 196Z" fill="${c.hair}"/><path d="M104 226Q70 300 96 398Q126 374 126 290Z" fill="${c.hair}"/><path d="M296 226Q330 300 304 398Q274 374 274 290Z" fill="${c.hair}"/><path d="M92 380l10 24M308 380l-10 24" stroke="#D93472" stroke-width="11" stroke-linecap="round"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q282 140 240 138Q212 112 176 140Q124 142 102 190Z" fill="${c.hair}"/><path d="M122 148Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M104 150Q124 138 130 124M296 150Q276 138 270 124" stroke="#D93472" stroke-width="9" fill="none" stroke-linecap="round"/><g>${yuStitchFlower(210, 100, 9, '#FF9F1C', '#FFC83D')}</g>`,
  },
  chan: {
    torso: (c) => `<path d="M132 436L268 436L284 594Q200 604 116 594Z" fill="${c.pants}"/><path d="M204 440L208 600Q250 598 284 594L268 436Z" fill="#000" opacity=".16"/><path class="c-torso" d="M136 292Q200 272 264 292L280 446Q200 470 120 446Z" fill="${c.top}"/><path d="M264 292L280 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.18)}" opacity=".5"/><path d="M162 288Q200 318 238 288L238 304Q200 336 162 304Z" fill="${shade(c.top, -0.12)}"/>${[170, 186, 214, 230].map((x) => `<path d="M${x} 330V440" stroke="${shade(c.top, -0.3)}" stroke-width="2.5" opacity=".7"/>`).join('')}<path d="M200 312V452" stroke="${shade(c.top, -0.35)}" stroke-width="3"/>${[330, 372, 414].map((y) => `<circle cx="200" cy="${y}" r="3.5" fill="#8C7A5E"/>`).join('')}<path d="M144 346h30v34h-30Z M226 346h30v34h-30Z" fill="none" stroke="${shade(c.top, -0.3)}" stroke-width="2.5" opacity=".8"/>`,
    front: (c) => `<path d="M100 184Q94 96 200 90Q306 96 300 184Q290 150 266 144Q200 130 134 144Q108 150 100 184Z" fill="${c.hair}"/><ellipse cx="200" cy="126" rx="190" ry="24" fill="#D9B368"/><ellipse cx="200" cy="131" rx="190" ry="24" fill="#B8893F" opacity=".35"/><path d="M122 126Q124 28 200 24Q276 28 278 126Q200 146 122 126Z" fill="#E6C27A"/><path d="M122 126Q200 148 278 126L278 108Q200 130 122 108Z" fill="#7A3A24"/><path d="M130 90Q200 62 270 90M136 60Q200 38 264 60" stroke="#B8893F" stroke-width="3" fill="none" opacity=".55"/>`,
    acc: () => `<path d="M148 238Q174 222 200 238Q226 222 252 238Q246 262 200 252Q154 262 148 238Z" fill="#B8B3AD"/><path d="M160 240Q180 234 200 242Q220 234 240 240" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`,
  },
  chabela: {
    torso: (c) => yuHuipil(Object.assign({}, c, { top: '#FFE3EC' }), '#D93472', '#FF9F1C', '#19B7AA') + `<path d="M126 296Q200 340 274 296L290 420Q200 470 110 420Z" fill="#7B4FC0" opacity=".9"/><path d="M126 296Q200 340 274 296" stroke="#FFC83D" stroke-width="7" fill="none"/>${[0, 1, 2].map((i) => `<path d="M${122 + i * 4} ${326 + i * 26}Q200 ${372 + i * 26} ${278 - i * 4} ${326 + i * 26}" stroke="${['#FF9F1C', '#19B7AA', '#FFC83D'][i]}" stroke-width="5" fill="none"/>`).join('')}`,
    back: (c) => `<circle cx="200" cy="74" r="44" fill="${c.hair}"/><circle cx="200" cy="74" r="44" fill="none" stroke="#B8B3AD" stroke-width="4" opacity=".6"/><path d="M96 196Q86 90 200 78Q314 90 304 196Q310 250 286 280Q290 210 274 190L126 190Q110 210 114 280Q90 250 96 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><g>${yuStitchFlower(250, 96, 9, '#D93472', '#FFC83D')}</g>`,
    acc: (c) => `<path d="M126 246Q136 266 150 268M274 246Q264 266 250 268" stroke="${shade(c.skin, -0.3)}" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`,
  },
});
