// ---------------------------------------------------------------- frises textiles des unites 8 (Colombie) et 10 (Andes).
// Meme contrat que azulejoFrieze / fileteFrieze : opts { w, n (fanions), seed, uid } -> <svg class="q-frieze"> ; chaque fanion = <g class="m-flag" data-px data-py> (pivot haut-centre).
// Colombie : bande de tissage geometrique de mochila (losanges et zigzags rouge / jaune / bleu / vert), franges, pompons.
// Andes : bande d'aguayo (rayures vives, croix andines en escalier, zigzags), bord frange, bordes (pompons) suspendus.
export const COLOMBIA_PAL = { bg: '#1B2A5C', red: '#D8283A', yellow: '#FCC919', blue: '#2F6FD0', green: '#1FA26B', cream: '#FFF1CC', edge: '#0E1634', pen: ['#FCC919', '#2F6FD0', '#D8283A', '#1FA26B'] };
export const ANDES_PAL = { bg: '#3B1F5A', magenta: '#D93472', orange: '#F59F00', turq: '#12A594', cream: '#FFF1CC', red: '#C9402E', edge: '#1F0F33', pen: ['#D93472', '#F59F00', '#12A594', '#C9402E'] };

/** Losange creux (motif de mochila) centre en (cx, cy), demi-diagonale r. */
function andesDiamond(cx, cy, r, c1, c2) {
  return `<path d="M${r1(cx)} ${r1(cy - r)}L${r1(cx + r)} ${r1(cy)}L${r1(cx)} ${r1(cy + r)}L${r1(cx - r)} ${r1(cy)}Z" fill="${c1}"/><path d="M${r1(cx)} ${r1(cy - r * 0.55)}L${r1(cx + r * 0.55)} ${r1(cy)}L${r1(cx)} ${r1(cy + r * 0.55)}L${r1(cx - r * 0.55)} ${r1(cy)}Z" fill="${c2}"/>`;
}
/** Croix andine (chakana) en escalier, centre (cx, cy), cote total s. */
export function chakanaPath(cx, cy, s) {
  const u = s / 6, p = [[-1, -3], [1, -3], [1, -2], [2, -2], [2, -1], [3, -1], [3, 1], [2, 1], [2, 2], [1, 2], [1, 3], [-1, 3], [-1, 2], [-2, 2], [-2, 1], [-3, 1], [-3, -1], [-2, -1], [-2, -2], [-1, -2]];
  return 'M' + p.map((q) => r1(cx + q[0] * u) + ' ' + r1(cy + q[1] * u)).join('L') + 'Z';
}

export function colombiaFrieze(opts) {
  opts = opts || {};
  const W = opts.w || 1920, P = COLOMBIA_PAL, BH = 84, n = opts.n || 16, rnd = rng(opts.seed || 5), nM = 24, st = W / nM;
  let motifs = '', fringe = '';
  for (let i = 0; i < nM; i++) {
    const cx = st * (i + 0.5);
    motifs += andesDiamond(cx, 30, 15, i % 2 ? P.yellow : P.red, i % 2 ? P.red : P.yellow);
    motifs += `<path d="M${r1(cx - st / 2)} 62L${r1(cx)} 54L${r1(cx + st / 2)} 62" stroke="${i % 3 === 0 ? P.green : P.cream}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
    fringe += `<rect x="${r1(cx - 4)}" y="${BH - 2}" width="8" height="${20 + (i % 3) * 5}" rx="4" fill="${[P.red, P.yellow, P.blue][i % 3]}"/>`;
  }
  const ry = BH + 30, sag = 14, step = W / n, ropeY = (x) => ry + sag * Math.sin((Math.PI * x) / W);
  let rope = `M0 ${r1(ropeY(0))}`;
  for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
  let pen = '';
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), y0 = ropeY(cx), c = P.pen[i % 4], hh = 46 * (0.92 + rnd() * 0.16);
    pen += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="M${r1(cx)} ${r1(y0)}V${r1(y0 + 14)}" stroke="${P.edge}" stroke-width="3"/><circle cx="${r1(cx)}" cy="${r1(y0 + 14 + hh * 0.35)}" r="${r1(hh * 0.36)}" fill="${c}"/><path d="M${r1(cx - 6)} ${r1(y0 + 14 + hh * 0.2)}Q${r1(cx)} ${r1(y0 + 14 + hh * 0.5)} ${r1(cx + 6)} ${r1(y0 + 14 + hh * 0.2)}" stroke="#fff" stroke-width="3" fill="none" opacity=".45"/></g>`;
  }
  const H = BH + 30 + 14 + 78;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="q-frieze q-colombia" aria-hidden="true"><g opacity=".28" transform="translate(0 7)"><rect width="${W}" height="${BH}" fill="#000"/></g><rect width="${W}" height="${BH}" fill="${P.bg}"/>${motifs}<rect y="0" width="${W}" height="8" fill="${P.edge}"/><rect y="${BH - 12}" width="${W}" height="12" fill="${P.edge}"/><rect y="${BH - 9}" width="${W}" height="3" fill="${P.yellow}"/><rect y="8" width="${W}" height="3" fill="${P.yellow}"/>${fringe}<path d="${rope}" stroke="${P.edge}" stroke-width="3" fill="none" opacity=".75"/>${pen}</svg>`;
}

export function andesFrieze(opts) {
  opts = opts || {};
  const W = opts.w || 1920, P = ANDES_PAL, BH = 84, n = opts.n || 16, rnd = rng(opts.seed || 5), nM = 16, st = W / nM;
  let motifs = '', fringe = '';
  const stripes = [P.magenta, P.orange, P.turq, P.cream];
  for (let i = 0; i < nM; i++) {
    const cx = st * (i + 0.5);
    motifs += `<path d="${chakanaPath(cx, 42, 46)}" fill="${stripes[i % 4]}"/><circle cx="${r1(cx)}" cy="42" r="5" fill="${P.bg}"/>`;
    motifs += `<path d="M${r1(cx - st / 2)} 20L${r1(cx - st / 4)} 12L${r1(cx)} 20L${r1(cx + st / 4)} 12L${r1(cx + st / 2)} 20" stroke="${stripes[(i + 1) % 4]}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
    motifs += `<path d="M${r1(cx - st / 2)} 66L${r1(cx - st / 4)} 74L${r1(cx)} 66L${r1(cx + st / 4)} 74L${r1(cx + st / 2)} 66" stroke="${stripes[(i + 2) % 4]}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
  }
  for (let i = 0; i < nM * 2; i++) {
    const cx = (W / (nM * 2)) * (i + 0.5);
    fringe += `<rect x="${r1(cx - 5)}" y="${BH - 2}" width="10" height="${22 + (i % 3) * 6}" rx="5" fill="${stripes[i % 4]}"/>`;
  }
  const ry = BH + 32, sag = 14, step = W / n, ropeY = (x) => ry + sag * Math.sin((Math.PI * x) / W);
  let rope = `M0 ${r1(ropeY(0))}`;
  for (let x = 40; x <= W; x += 40) rope += `L${x} ${r1(ropeY(x))}`;
  let pen = '';
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), y0 = ropeY(cx), c = P.pen[i % 4], hh = 50 * (0.92 + rnd() * 0.16);
    pen += `<g class="m-flag" data-px="${r1(cx)}" data-py="${r1(y0)}"><path d="M${r1(cx)} ${r1(y0)}V${r1(y0 + 10)}" stroke="${P.edge}" stroke-width="3"/><circle cx="${r1(cx)}" cy="${r1(y0 + 10 + hh * 0.3)}" r="${r1(hh * 0.28)}" fill="${c}"/><path d="M${r1(cx - hh * 0.2)} ${r1(y0 + 10 + hh * 0.5)}L${r1(cx - hh * 0.26)} ${r1(y0 + 10 + hh)}M${r1(cx)} ${r1(y0 + 10 + hh * 0.56)}L${r1(cx)} ${r1(y0 + 10 + hh * 1.05)}M${r1(cx + hh * 0.2)} ${r1(y0 + 10 + hh * 0.5)}L${r1(cx + hh * 0.26)} ${r1(y0 + 10 + hh)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/></g>`;
  }
  const H = BH + 32 + 10 + 80;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="q-frieze q-andes" aria-hidden="true"><g opacity=".28" transform="translate(0 7)"><rect width="${W}" height="${BH}" fill="#000"/></g><rect width="${W}" height="${BH}" fill="${P.bg}"/>${motifs}<rect y="0" width="${W}" height="8" fill="${P.edge}"/><rect y="${BH - 12}" width="${W}" height="12" fill="${P.edge}"/><rect y="${BH - 9}" width="${W}" height="3" fill="${P.orange}"/><rect y="8" width="${W}" height="3" fill="${P.orange}"/>${fringe}<path d="${rope}" stroke="${P.edge}" stroke-width="3" fill="none" opacity=".75"/>${pen}</svg>`;
}
