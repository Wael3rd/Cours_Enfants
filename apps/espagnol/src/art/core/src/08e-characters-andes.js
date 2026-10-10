// ---------------------------------------------------------------- personnages des Andes (unite 10, Cusco) : meme chibi 400x660.
// Killa (12 ans, lliclla coloree + tresses a pompons), Don Huaman (vieux conteur, chullo tricote, poncho), Dona Paulina (tisserande de Chinchero, montera).
// Chaque entree : torso (+ jupe/poncho), back / front (cheveux, couvre-chef), acc. Visage, bras, jambes et rig : 08-characters.js.
Object.assign(CHARS, {
  killa: { name: 'Killa', skin: '#C58A60', hair: '#1A0F0A', top: '#FFFDF4', pants: '#D93472', shoes: '#6B3E26', accent: '#F59F00', mouthY: 0 },
  huaman: { name: 'Don Huamán', skin: '#A9714A', hair: '#E4E0DA', top: '#B5452E', pants: '#3D2A4A', shoes: '#3B2216', accent: '#F59F00', mouthY: 14 },
  paulina: { name: 'Doña Paulina', skin: '#B27C54', hair: '#BDB8B2', top: '#2B318A', pants: '#C9402E', shoes: '#3B2216', accent: '#12A594', mouthY: 0 },
});

/** Bande de losanges tisses (aguayo) : x, y, largeur, hauteur, 3 couleurs. */
function cuWeave(x, y, w, h, c1, c2, c3) {
  const n = Math.max(2, Math.floor(w / (h * 1.2))), st = w / n; let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${c1}"/>`;
  for (let i = 0; i < n; i++) {
    const cx = x + st * (i + 0.5), cy = y + h / 2;
    s += `<path d="M${r1(cx)} ${r1(cy - h * 0.42)}L${r1(cx + st * 0.34)} ${r1(cy)}L${r1(cx)} ${r1(cy + h * 0.42)}L${r1(cx - st * 0.34)} ${r1(cy)}Z" fill="${i % 2 ? c2 : c3}"/><circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(h * 0.09)}" fill="${c1}"/>`;
  }
  return s;
}
/** Pompon (borla) : cercle + brins. */
function cuPom(cx, cy, r, c) {
  return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${c}"/><path d="M${r1(cx - r * 0.5)} ${r1(cy + r * 0.8)}l-3 ${r1(r)}M${r1(cx)} ${r1(cy + r)}v${r1(r * 1.2)}M${r1(cx + r * 0.5)} ${r1(cy + r * 0.8)}l3 ${r1(r)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
}

Object.assign(CHX, {
  killa: {
    torso: (c) => `<path d="M126 436L274 436L306 604Q200 626 94 604Z" fill="${c.pants}"/><path d="M204 440L210 610Q258 608 306 604L274 436Z" fill="#000" opacity=".16"/>${cuWeave(97, 556, 206, 30, '#F59F00', '#12A594', '#2B318A')}${cuWeave(110, 520, 180, 14, '#12A594', '#FFFDF4', '#D93472')}<path class="c-torso" d="M136 294Q200 272 264 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M264 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M118 300Q200 346 282 300L300 372Q200 428 100 372Z" fill="#D93472"/><path d="M118 300Q200 346 282 300" stroke="#F59F00" stroke-width="8" fill="none"/>${[0, 1, 2].map((i) => `<path d="M${112 + i * 3} ${326 + i * 22}Q200 ${376 + i * 22} ${288 - i * 3} ${326 + i * 22}" stroke="${['#F59F00', '#12A594', '#FFFDF4'][i]}" stroke-width="7" fill="none"/>`).join('')}<path d="M196 296l4 18 4 -18" stroke="#F59F00" stroke-width="6" fill="none"/>`,
    back: (c) => `<path d="M98 196Q86 90 200 78Q314 90 302 196Q312 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q88 250 98 196Z" fill="${c.hair}"/><path d="M110 236Q70 320 96 420Q128 396 128 316Z" fill="${c.hair}"/><path d="M290 236Q330 320 304 420Q272 396 272 316Z" fill="${c.hair}"/>${cuPom(98, 424, 10, '#D93472')}${cuPom(302, 424, 10, '#12A594')}<path d="M100 330q-10 4 -4 14M300 330q10 4 4 14" stroke="#F59F00" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    front: (c) => `<path d="M102 190Q100 96 200 90Q300 96 298 190Q282 140 240 138Q212 112 176 140Q124 142 102 190Z" fill="${c.hair}"/><path d="M122 148Q160 112 214 122" stroke="${shade(c.hair, 0.4)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/><path d="M200 94V138" stroke="${shade(c.hair, 0.3)}" stroke-width="4" opacity=".7"/><path d="M118 150Q200 98 282 150" stroke="#D93472" stroke-width="10" fill="none" stroke-linecap="round" opacity=".95"/>`,
  },
  huaman: {
    torso: (c) => `<path d="M132 436L268 436L290 596Q200 614 110 596Z" fill="${c.pants}"/><path d="M204 440L208 604Q252 602 290 596L268 436Z" fill="#000" opacity=".16"/><path class="c-torso" d="M136 292Q200 272 264 292L284 452Q200 482 116 452Z" fill="#F5E6C8"/><path d="M110 300Q200 290 290 300L316 500Q200 540 84 500Z" fill="${c.top}"/><path d="M290 300L316 500Q260 520 230 526L246 312Z" fill="${shade(c.top, -0.22)}" opacity=".5"/>${[0, 1, 2].map((i) => `<path d="M${98 + i * 5} ${400 + i * 34}Q200 ${436 + i * 34} ${302 - i * 5} ${400 + i * 34}" stroke="${['#F59F00', '#12A594', '#F5E6C8'][i]}" stroke-width="9" fill="none"/>`).join('')}<path d="M166 296Q200 348 234 296L234 312Q200 372 166 312Z" fill="${shade(c.top, -0.3)}"/><path d="M168 298Q200 340 232 298" stroke="#F59F00" stroke-width="6" fill="none"/>`,
    back: (c) => `<path d="M104 196Q98 224 112 252Q106 218 124 196Z M296 196Q302 224 288 252Q294 218 276 196Z" fill="${c.hair}"/>`,
    front: (c) => `<path d="M98 196Q92 96 200 88Q308 96 302 196Q292 176 276 170L124 170Q108 176 98 196Z" fill="#C9402E"/><path d="M98 156Q200 124 302 156" stroke="#F59F00" stroke-width="12" fill="none"/>${cuWeave(110, 128, 180, 22, '#C9402E', '#F5E6C8', '#12A594')}<path d="M100 150Q76 200 84 262Q110 244 118 196Z" fill="#C9402E"/><path d="M300 150Q324 200 316 262Q290 244 282 196Z" fill="#C9402E"/><path d="M84 214l10 4M88 236l12 2M316 214l-10 4M312 236l-12 2" stroke="#F59F00" stroke-width="5" stroke-linecap="round"/>${cuPom(200, 74, 18, '#F59F00')}<path d="M92 262l-6 26M308 262l6 26" stroke="#F59F00" stroke-width="5" stroke-linecap="round"/>`,
    acc: () => `<path d="M132 168Q160 150 188 168M212 168Q240 150 268 168" stroke="#E4E0DA" stroke-width="9" fill="none" stroke-linecap="round" opacity=".95"/><path d="M132 232Q124 248 128 264M268 232Q276 248 272 264M180 270Q200 280 220 270" stroke="#7A4E32" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>`,
  },
  paulina: {
    torso: (c) => `<path d="M122 436L278 436L310 606Q200 630 90 606Z" fill="${c.pants}"/><path d="M204 440L210 612Q260 610 310 606L278 436Z" fill="#000" opacity=".16"/>${cuWeave(93, 552, 214, 34, '#12A594', '#F59F00', '#D93472')}${cuWeave(104, 516, 192, 16, '#2B318A', '#FFFDF4', '#F59F00')}<path class="c-torso" d="M134 294Q200 272 266 294L278 446Q200 470 122 446Z" fill="${c.top}"/><path d="M266 294L278 446Q240 458 214 462L224 304Z" fill="${shade(c.top, -0.2)}" opacity=".5"/><path d="M114 298Q200 350 286 298L304 384Q200 438 96 384Z" fill="#D93472"/><path d="M114 298Q200 350 286 298" stroke="#12A594" stroke-width="8" fill="none"/>${cuWeave(120, 340, 160, 22, '#F59F00', '#2B318A', '#FFFDF4')}`,
    back: (c) => `<path d="M98 196Q86 92 200 80Q314 92 302 196Q310 250 290 270Q292 214 276 190L124 190Q108 214 110 270Q90 250 98 196Z" fill="${c.hair}"/><path d="M108 240Q74 330 100 430Q130 404 130 318Z" fill="${c.hair}"/><path d="M292 240Q326 330 300 430Q270 404 270 318Z" fill="${c.hair}"/><path d="M100 330H128M272 330H300M98 380H126M274 380H302" stroke="#D93472" stroke-width="7"/>`,
    front: (c) => `<path d="M102 190Q100 100 200 94Q300 100 298 190Q282 144 240 140Q212 116 176 142Q124 146 102 190Z" fill="${c.hair}"/><path d="M110 128Q200 56 290 128L284 150Q200 92 116 150Z" fill="#1F1B2E"/><ellipse cx="200" cy="108" rx="112" ry="30" fill="#1F1B2E"/><ellipse cx="200" cy="102" rx="96" ry="22" fill="#2B2A45"/><path d="M104 118Q200 134 296 118" stroke="#F59F00" stroke-width="9" fill="none"/>${cuWeave(116, 112, 168, 14, '#D93472', '#FFFDF4', '#12A594')}`,
    acc: () => `<path d="M132 236Q124 252 130 266M268 236Q276 252 270 266" stroke="#7A4E32" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/>`,
  },
});
