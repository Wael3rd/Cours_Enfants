// ---------------------------------------------------------------- personnages de Bogota (unite 8) : meme chibi 400x660.
// Camila (guide de La Candelaria, ruana rouge), Don Hernan (conducteur du teleferique de Monserrate, casquette), Dona Marta (maison de couleurs, tablier, chignon).
// Memes conventions que 08c : torso (+ jupe/tablier), back / front (cheveux, couvre-chef), acc.
Object.assign(CHARS, {
  camila: { name: 'Camila', skin: '#C98F66', hair: '#1E120C', top: '#C8202E', pants: '#2F4A86', shoes: '#F5E6C8', accent: '#FCC919', mouthY: 0 },
  hernan: { name: 'Don Hernán', skin: '#B87F55', hair: '#6E6762', top: '#F5E6C8', pants: '#2A3558', shoes: '#3B2216', accent: '#1FA26B', mouthY: 14 },
  marta: { name: 'Doña Marta', skin: '#E2B592', hair: '#D8D4CE', top: '#D93472', pants: '#2F6FD0', shoes: '#6B3E26', accent: '#FCC919', mouthY: 0 },
});

Object.assign(CHX, {
  camila: {
    // chemise blanche sous une ruana rouge : poncho de laine ouvert devant, bandes jaune / bleu / noir au bas
    torso: (c) => `<path d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="#FFFDF4"/><path d="M118 296Q200 270 282 296L300 470Q200 500 100 470Z" fill="${c.top}"/><path d="M200 300V484" stroke="${shade(c.top, -0.35)}" stroke-width="5"/><path d="M282 296L300 470Q250 484 214 490L222 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M104 440Q200 470 296 440" stroke="${c.accent}" stroke-width="9" fill="none"/><path d="M102 456Q200 486 298 456" stroke="#2B318A" stroke-width="7" fill="none"/><path d="M100 470Q200 500 300 470" stroke="#1E120C" stroke-width="5" fill="none"/><path d="M156 292Q200 318 244 292" stroke="${shade(c.top, -0.3)}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 270 296 330Q280 270 276 240L124 240Q120 270 104 330Q88 270 98 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q284 142 244 138Q210 118 168 140Q122 142 102 190Z" fill="${c.hair}"/><path d="M122 150Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M104 150Q200 70 296 150" stroke="${c.accent}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M196 74Q200 66 204 74" stroke="${c.accent}" stroke-width="6" fill="none"/>`,
  },
  hernan: {
    // chemise claire, gilet vert du teleferique, casquette plate
    torso: (c) => `<path class="c-torso" d="M138 292Q200 272 262 292L276 442Q200 466 124 442Z" fill="${c.top}"/><path d="M262 292L276 442Q240 454 214 458L222 300Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M146 296L196 312L190 450Q160 450 126 440Z" fill="${c.accent}"/><path d="M254 296L204 312L210 450Q240 450 274 440Z" fill="${c.accent}"/><path d="M170 292L200 330L230 292" stroke="#fff" stroke-width="6" fill="none" stroke-linejoin="round"/><rect x="226" y="350" width="26" height="18" rx="4" fill="#FCC919"/>`,
    front: (c) => `<path d="M100 186Q96 100 200 94Q304 100 300 186Q290 150 262 146Q200 132 138 146Q110 150 100 186Z" fill="${c.hair}"/><path d="M100 140Q104 88 200 82Q296 88 300 140Q200 118 100 140Z" fill="${c.accent}"/><path d="M96 140Q200 108 304 140L300 156Q200 126 100 156Z" fill="${shade(c.accent, -0.3)}"/><rect x="178" y="104" width="44" height="22" rx="6" fill="#FCC919"/>`,
    acc: () => `<path d="M150 238Q176 220 200 236Q224 220 250 238Q244 262 200 250Q156 262 150 238Z" fill="#8F8A84"/>`,
  },
  marta: {
    // tablier a fleurs sur une robe rose, chale jaune, chignon gris
    torso: (c) => `<path d="M126 436L274 436L304 596Q200 618 96 596Z" fill="${c.pants}"/><path d="M204 440L210 604Q256 602 304 596L274 436Z" fill="#000" opacity=".16"/><path d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.22)}" opacity=".5"/><path d="M146 340H254L268 540Q200 556 132 540Z" fill="#FFFDF4"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${166 + (i % 3) * 34}" cy="${380 + i * 28}" r="8" fill="${['#D93472', '#FCC919', '#19B7AA'][i % 3]}"/>`).join('')}<path d="M118 296Q200 350 282 296L292 340Q200 390 108 340Z" fill="${c.accent}"/>`,
    back: (c) => `<circle cx="200" cy="70" r="40" fill="${c.hair}"/><path d="M96 196Q86 90 200 78Q314 90 304 196Q310 250 286 270Q290 210 274 190L126 190Q110 210 114 270Q90 250 96 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M104 190Q100 100 200 92Q300 100 296 190Q280 142 236 136Q208 112 170 138Q124 144 104 190Z" fill="${c.hair}"/><path d="M122 148Q164 112 214 122" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="256" cy="94" r="12" fill="#D93472"/><circle cx="256" cy="94" r="5" fill="#FCC919"/>`,
    acc: () => `<path d="M126 246Q136 266 150 268M274 246Q264 266 250 268" stroke="#B58A66" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`,
  },
});
