// ---------------------------------------------------------------- carte du monde hispanique (stylisee) - viewBox 0 0 1600 1200
// Contours simplifies a la main (lon/lat, domaine public / geometrie factuelle, inspires de Natural Earth 110m). Carte "de voyage" :
// l'Iberique est agrandie en inset (x4), le Mexique est "fisheye" (loupe) pour que les medaillons respirent.
// Camera : groupe .m-cam (transform GSAP, svgOrigin "0 0"). Etats des regions : 'locked' | 'open' | 'current' | 'done'.
export const MAP_W = 1600, MAP_H = 1200;

const LAND = {
  mainland: [[-114.8, 32.5], [-114.8, 31.7], [-113.1, 31.2], [-112.2, 29.0], [-110.6, 27.9], [-109.4, 26.0], [-108.4, 25.2], [-107.0, 23.8], [-105.6, 22.4], [-105.5, 20.8], [-105.2, 19.6], [-103.5, 18.3], [-102.0, 17.4], [-100.0, 16.8], [-98.0, 16.0], [-96.2, 15.7], [-94.6, 16.2], [-93.0, 15.2], [-92.2, 14.5], [-91.0, 13.9], [-89.4, 13.5], [-87.6, 13.2], [-86.2, 12.1], [-85.7, 11.0], [-85.7, 10.0], [-84.9, 9.8], [-83.7, 8.7], [-82.9, 8.0], [-81.5, 7.4], [-80.4, 7.3], [-80.4, 8.2], [-79.5, 8.9], [-78.5, 8.3], [-77.9, 7.3], [-77.4, 4.0], [-78.6, 2.4], [-79.0, 1.4], [-80.0, -0.9], [-80.9, -2.3], [-81.2, -4.6], [-79.9, -6.6], [-78.0, -9.0], [-77.0, -11.5], [-76.3, -13.4], [-75.2, -15.3], [-72.8, -16.8], [-71.0, -17.8], [-70.3, -19.0], [-70.2, -23.0], [-70.8, -27.5], [-71.5, -30.3], [-71.7, -34.5], [-72.6, -37.5], [-73.4, -39.8], [-73.8, -42.0], [-74.2, -46.0], [-75.2, -49.5], [-74.5, -52.5], [-72.0, -53.8], [-70.5, -55.0], [-68.3, -55.0], [-66.5, -55.0], [-66.0, -54.4], [-68.4, -52.6], [-68.8, -51.0], [-67.6, -49.0], [-66.4, -47.0], [-65.2, -45.2], [-65.6, -43.0], [-64.5, -41.5], [-62.4, -40.7], [-62.2, -39.0], [-58.5, -38.0], [-57.5, -36.5], [-57.2, -35.5], [-58.4, -34.5], [-56.3, -34.9], [-54.2, -34.7], [-53.4, -33.7], [-51.0, -31.3], [-49.3, -28.5], [-48.5, -26.2], [-48.6, -25.4], [-46.5, -24.0], [-44.0, -23.0], [-41.8, -22.8], [-40.5, -21.0], [-39.7, -18.5], [-39.1, -15.8], [-38.9, -13.0], [-37.2, -11.0], [-35.2, -8.8], [-34.8, -7.0], [-35.2, -5.4], [-37.2, -4.8], [-39.5, -3.0], [-42.0, -2.7], [-44.5, -2.4], [-45.6, -1.0], [-48.5, -1.0], [-50.0, 0.0], [-50.6, 2.0], [-51.5, 4.2], [-53.5, 5.8], [-57.0, 6.0], [-58.5, 6.8], [-60.5, 8.5], [-62.0, 10.6], [-63.0, 10.7], [-64.5, 10.2], [-66.5, 10.6], [-68.0, 10.5], [-69.8, 11.7], [-71.5, 12.4], [-72.2, 11.4], [-73.5, 11.3], [-74.8, 10.9], [-75.6, 10.4], [-76.4, 9.0], [-77.4, 8.7], [-78.0, 9.4], [-79.4, 9.5], [-80.3, 9.2], [-81.6, 8.8], [-82.8, 9.6], [-83.4, 10.4], [-83.6, 11.0], [-83.4, 12.4], [-83.2, 14.0], [-84.0, 15.2], [-85.0, 15.9], [-86.5, 16.0], [-87.8, 15.9], [-88.5, 15.9], [-88.2, 16.5], [-88.2, 17.8], [-87.8, 18.4], [-87.4, 19.4], [-86.8, 20.6], [-87.2, 21.4], [-88.4, 21.5], [-90.2, 21.1], [-90.5, 20.1], [-90.6, 19.4], [-91.6, 18.7], [-92.8, 18.5], [-94.0, 18.2], [-95.2, 18.6], [-96.2, 19.2], [-96.7, 20.5], [-97.3, 21.5], [-97.7, 22.6], [-97.7, 24.0], [-97.4, 25.4], [-97.4, 25.9], [-99.5, 27.6], [-100.6, 28.7], [-101.4, 29.7], [-102.4, 29.8], [-103.1, 29.0], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111.1, 31.3]],
  baja: [[-117.1, 32.5], [-116.6, 31.5], [-115.8, 30.3], [-114.7, 28.6], [-114.1, 27.5], [-112.9, 26.5], [-112.1, 24.9], [-110.7, 23.4], [-109.5, 23.0], [-109.8, 23.9], [-111.0, 25.0], [-111.8, 26.5], [-112.7, 28.0], [-114.3, 29.8], [-114.8, 31.5], [-114.8, 32.5]],
  usa: [[-117.1, 32.5], [-114.8, 32.5], [-111.1, 31.3], [-108.2, 31.3], [-108.2, 31.8], [-106.5, 31.8], [-104.5, 29.6], [-103.1, 29.0], [-102.4, 29.8], [-101.4, 29.7], [-100.6, 28.7], [-99.5, 27.6], [-97.4, 25.9], [-97.3, 27.6], [-95.0, 29.2], [-93.0, 29.7], [-90.5, 29.1], [-89.2, 30.2], [-87.5, 30.3], [-85.4, 29.7], [-84.0, 30.1], [-82.8, 29.0], [-82.7, 27.5], [-81.8, 26.2], [-80.9, 25.2], [-80.2, 25.7], [-80.0, 27.0], [-80.6, 28.8], [-81.4, 30.4], [-81.2, 31.6], [-79.0, 33.4], [-77.0, 34.7], [-75.5, 35.3], [-75.8, 37.0], [-74.0, 40.5], [-72.0, 41.2], [-70.0, 41.7], [-70.5, 43.5], [-67.0, 45.0], [-67.0, 52], [-124.5, 52], [-124.1, 44.0], [-124.3, 41.5], [-123.9, 39.5], [-122.5, 37.8], [-121.9, 36.6], [-120.6, 34.5], [-118.4, 34.0]],
  brasil: [[-51.5, 4.2], [-50.6, 2.0], [-50.0, 0.0], [-48.5, -1.0], [-45.6, -1.0], [-44.5, -2.4], [-42.0, -2.7], [-39.5, -3.0], [-37.2, -4.8], [-35.2, -5.4], [-34.8, -7.0], [-35.2, -8.8], [-37.2, -11.0], [-38.9, -13.0], [-39.1, -15.8], [-39.7, -18.5], [-40.5, -21.0], [-41.8, -22.8], [-44.0, -23.0], [-46.5, -24.0], [-48.6, -25.4], [-48.5, -26.2], [-49.3, -28.5], [-51.0, -31.3], [-53.4, -33.7], [-57.6, -30.2], [-55.7, -28.2], [-53.7, -26.1], [-54.6, -25.6], [-54.5, -24.0], [-55.4, -22.0], [-57.8, -22.1], [-58.2, -19.8], [-60.0, -16.3], [-60.4, -14.5], [-65.0, -12.0], [-65.4, -9.8], [-69.0, -10.9], [-72.4, -9.5], [-73.5, -7.2], [-70.0, -4.2], [-69.5, -1.0], [-69.8, 1.0], [-66.0, 1.5], [-64.0, 1.8], [-62.7, 4.0], [-60.7, 5.2], [-59.0, 1.4], [-57.5, 2.0], [-55.9, 2.0], [-54.0, 2.2], [-52.6, 2.4]],
  guayanas: [[-60.5, 8.5], [-58.5, 6.8], [-57.0, 6.0], [-53.5, 5.8], [-51.5, 4.2], [-52.6, 2.4], [-54.0, 2.2], [-55.9, 2.0], [-57.5, 2.0], [-59.0, 1.4], [-60.7, 5.2]],
  cuba: [[-85.0, 21.9], [-83.4, 22.9], [-81.5, 23.2], [-79.5, 22.9], [-77.8, 21.8], [-76.0, 21.2], [-74.2, 20.2], [-75.6, 19.9], [-77.7, 19.8], [-78.9, 21.6], [-81.0, 22.0], [-82.8, 22.6]],
  hispaniola: [[-74.4, 18.4], [-73.4, 19.9], [-71.6, 19.9], [-69.9, 19.7], [-68.4, 18.6], [-70.0, 18.3], [-71.4, 17.7], [-73.0, 18.1]],
  iberia: [[-9.3, 42.9], [-8.6, 43.5], [-7.0, 43.7], [-5.8, 43.6], [-4.2, 43.4], [-3.0, 43.4], [-1.8, 43.4], [3.2, 42.4], [3.2, 42.0], [2.5, 41.5], [1.4, 41.1], [0.8, 40.8], [0.1, 40.0], [-0.3, 39.4], [0.2, 38.8], [-0.2, 38.5], [-0.7, 37.7], [-1.6, 37.0], [-2.2, 36.7], [-3.4, 36.7], [-4.4, 36.7], [-5.3, 36.1], [-6.3, 36.5], [-6.9, 37.2], [-7.4, 37.2], [-8.4, 37.1], [-8.9, 37.0], [-8.8, 38.0], [-9.4, 38.7], [-8.9, 39.6], [-8.9, 40.9], [-8.8, 41.8], [-9.0, 42.4]],
  francia: [[-1.8, 43.4], [3.2, 42.4], [3.0, 43.3], [6.5, 43.2], [8, 46], [8, 52], [-6, 52], [-5, 48.4], [-1.2, 46]],
  africa: [[-5.9, 35.8], [-2.0, 35.1], [2.0, 36.6], [6.0, 37.0], [10.0, 37.3], [10, 34], [-7.2, 34]],
};

function baseXY(lon, lat) {
  if (lon > -16) return [1330 + (lon + 3.5) * 38, 215 - (lat - 40) * 46]; // inset Iberique
  return [100 + (lon + 118) * 12, (45 - lat) * 12];
}
const FISH = { fx: 316, fy: 306, m: 0.95, R: 260 };
/** lon/lat -> coordonnees carte (inset Iberique + loupe sur le Mexique). */
export function mapProj(lon, lat) {
  const p = baseXY(lon, lat);
  if (lon > -16) return p;
  const dx = p[0] - FISH.fx, dy = p[1] - FISH.fy, d = Math.hypot(dx, dy);
  const f = 1 + FISH.m * Math.exp(-Math.pow(d / FISH.R, 2));
  return [FISH.fx + dx * f, FISH.fy + dy * f];
}
function densify(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
}
const ROUND = { iberia: 1, cuba: 1, hispaniola: 1 };
function landPath(key) {
  if (ROUND[key]) return smooth(LAND[key].map((p) => mapProj(p[0], p[1])), true);
  const pts = densify(LAND[key], 1.2).map((p) => mapProj(p[0], p[1]));
  return 'M' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'Z';
}

export const MAP_REGIONS = [
  { id: 'madrid', n: 1, name: 'Madrid', lon: -3.7, lat: 40.42, icon: 'alcala', color: PAL.terracotta, label: 'bottom', r: 36 },
  { id: 'salamanca', n: 2, name: 'Salamanca', lon: -5.66, lat: 40.97, icon: 'catedral', color: PAL.turquesa, label: 'left', r: 34 },
  { id: 'sevilla', n: 3, name: 'Sevilla', lon: -5.98, lat: 37.39, icon: 'giralda', color: PAL.magenta, label: 'left', r: 34 },
  { id: 'cdmx', n: 4, name: 'Ciudad de México', lon: -99.13, lat: 19.43, icon: 'angel', color: PAL.sol2, label: 'left', r: 33 },
  { id: 'oaxaca', n: '★', name: 'Oaxaca', lon: -96.73, lat: 17.06, icon: 'calavera', color: PAL.magenta2, label: 'bottom', r: 31, event: true },
  { id: 'valencia', n: 5, name: 'Valencia', lon: -0.38, lat: 39.47, icon: 'miguelete', color: PAL.quetzal, label: 'right', r: 34 },
  { id: 'baires', n: 7, name: 'Buenos Aires', lon: -58.38, lat: -34.6, icon: 'obelisco', color: PAL.turquesa2, label: 'right', r: 40 },
  { id: 'bogota', n: 8, name: 'Bogotá', lon: -74.07, lat: 4.71, icon: 'monserrate', color: PAL.terracotta2, label: 'right', r: 38 },
  { id: 'yucatan', n: 9, name: 'Yucatán', lon: -89.6, lat: 20.7, icon: 'piramide', color: PAL.quetzal2, label: 'top', r: 38 },
  { id: 'cusco', n: 10, name: 'Cusco', lon: -71.97, lat: -13.52, icon: 'machu', color: PAL.sol2, label: 'left', r: 40 },
];
/** Ordre du voyage des unites principales u01-u10 (la Nochebuena de la u06 = retour a Madrid : meme medaillon, madrid y figure 2 fois). */
export const MAP_ROUTE = ['madrid', 'salamanca', 'sevilla', 'cdmx', 'valencia', 'madrid', 'baires', 'bogota', 'yucatan', 'cusco'];
/** Branche de l'evenement (Oaxaca, hors route principale) : cdmx -> oaxaca -> valencia. */
export const MAP_SPUR = [['cdmx', 'oaxaca'], ['oaxaca', 'valencia']];
/** Tous les segments tracables : [from, to] (route principale puis branche). */
export const MAP_SEGMENTS = MAP_ROUTE.slice(1).map((id, i) => [MAP_ROUTE[i], id]).concat(MAP_SPUR);
export function mapRegion(id) {
  const r = MAP_REGIONS.find((x) => x.id === id);
  if (!r) return null;
  const p = mapProj(r.lon, r.lat);
  return Object.assign({ x: r5(p[0]), y: r5(p[1]) }, r);
}
function r5(n) { return Math.round(n * 10) / 10; }
function segPath(a, b, k) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, h = len * 0.22 * k;
  return `M${a.x} ${a.y}Q${r1((a.x + b.x) / 2 + nx * h)} ${r1((a.y + b.y) / 2 + ny * h)} ${b.x} ${b.y}`;
}
// Brouillard de guerre : vrais nuages stylises, 3 couches (fond indigo, milieu lavande, devant creme), bords adoucis par un halo
// de traits translucides (pas de filtre -> leger sur tablette). Chaque nuage = <g class="m-cloud m-cl-<couche>"> (data-px/py = centre).
const CLOUD_TINT = {
  back: { halo: '#9AA0E0', shade: '#5E64B8', body: '#8F96DA', hi: '#B5BAF0', hiOp: 0.5 },
  mid: { halo: '#DAD9F6', shade: '#9EA2DE', body: '#CFD0F1', hi: '#EDEBFF', hiOp: 0.5 },
  dusk: { halo: '#FFB3C4', shade: '#C0508A', body: '#FFB89C', hi: '#FFE6C0', hiOp: 0.5 },
  front: { halo: '#FFF8EA', shade: '#B6B4E4', body: '#FFF6E4', hi: '#FFFFFF', hiOp: 0.6 },
};
/** Banc de nuages (brouillard) d'une region, a inserer dans la carte : `<g class="m-fog m-fog-ID">`. Pour les mises en scene ou la region n'est pas verrouillee dans worldMap(). */
export function mapFogHtml(id) {
  const r = mapRegion(id);
  return `<g class="m-fog m-fog-${id}" data-id="${id}">${fogClouds(r.x, r.y, 77, r.lon > -16 ? 0.4 : 0.66)}</g>`;
}
/** Un nuage centre en (cx,cy), largeur w, hauteur h : bosses sur le dessus, base plate arrondie. Renvoie le SVG (halo + ombre + corps + reflets). */
export function cloudSvg(cx, cy, w, h, seed, layer) {
  const T = CLOUD_TINT[layer] || CLOUD_TINT.front, rnd = rng(seed), n = clamp(Math.round(w / (h * 1.05)), 4, 11), bots = cy + h / 2;
  const bumps = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), r = h * (0.3 + 0.24 * Math.sin(Math.PI * u) + rnd() * 0.07);
    bumps.push({ x: cx - w * 0.4 + w * 0.8 * u, r, y: bots - r - h * 0.02 });
  }
  const base = { x: cx - w * 0.44, y: bots - h * 0.3, w: w * 0.88, h: h * 0.3, rx: h * 0.15 };
  const shape = (dx, dy, grow) => bumps.map((b) => `<circle cx="${r1(b.x + dx)}" cy="${r1(b.y + dy)}" r="${r1(b.r + grow)}"/>`).join('') + `<rect x="${r1(base.x + dx - grow)}" y="${r1(base.y + dy - grow)}" width="${r1(base.w + grow * 2)}" height="${r1(base.h + grow * 2)}" rx="${r1(base.rx + grow)}"/>`;
  const rim = (sw, op) => `<g fill="none" stroke="${T.halo}" stroke-width="${sw}" stroke-opacity="${op}" stroke-linejoin="round">${shape(0, 0, 0)}</g>`;
  const tops = bumps.slice(1, -1).map((b) => `<ellipse cx="${r1(b.x - b.r * 0.28)}" cy="${r1(b.y - b.r * 0.42)}" rx="${r1(b.r * 0.42)}" ry="${r1(b.r * 0.24)}" transform="rotate(-24 ${r1(b.x - b.r * 0.28)} ${r1(b.y - b.r * 0.42)})"/>`).join('');
  return `<g class="m-cloud m-cl-${layer}" data-px="${r1(cx)}" data-py="${r1(cy)}">${rim(h * 0.34, 0.16)}${rim(h * 0.17, 0.3)}<g fill="${T.shade}">${shape(h * 0.05, h * 0.075, 0)}</g><g fill="${T.body}">${shape(0, 0, 0)}</g><g fill="${T.hi}" opacity="${T.hiOp}">${tops}</g></g>`;
}
// disposition d'un banc de nuages autour d'une region : [dx, dy, largeur, hauteur, couche]
const FOG_LAYOUT = [
  [-4, -6, 250, 128, 'back'], [-92, 30, 190, 100, 'back'], [96, 24, 200, 104, 'back'],
  [-70, -40, 186, 98, 'mid'], [78, -34, 196, 102, 'mid'], [4, 46, 214, 104, 'mid'],
  [-96, 6, 168, 88, 'front'], [100, -2, 176, 92, 'front'], [-10, -64, 160, 84, 'front'], [14, 20, 150, 80, 'front'],
];
function fogClouds(x, y, seed, k) {
  const rnd = rng(seed);
  return FOG_LAYOUT.map((c, i) => cloudSvg(x + (c[0] + (rnd() - 0.5) * 14) * k, y + (c[1] + (rnd() - 0.5) * 10) * k, c[2] * k, c[3] * k, seed * 13 + i * 7, c[4])).join('');
}

/**
 * Carte du monde. opts : uid, states {id: 'locked'|'open'|'current'|'done'} (defaut : madrid current, reste locked),
 * player (id de la region du jeton), initial (lettre du jeton), route (bool, defaut true), width/height (defaut 1600x1200).
 */
export function worldMap(opts) {
  opts = opts || {};
  const id = opts.uid || uid('wm'), g = (n) => `${id}-${n}`;
  const states = opts.states || { madrid: 'current' };
  const regs = MAP_REGIONS.map((r) => mapRegion(r.id));
  const st = (r) => states[r.id] || 'locked';
  const lands = ['usa', 'francia', 'iberia', 'mainland', 'brasil', 'guayanas', 'baja', 'cuba', 'hispaniola'].map((k) => ({ k, d: landPath(k) }));
  const hispanic = new Set(['iberia', 'mainland', 'baja', 'cuba', 'hispaniola']);
  const allLand = lands.map((l) => `<path d="${l.d}"/>`).join('');
  // eau : halos concentriques autour des cotes (aplats peints), vagues
  const halo = [[46, 0.16], [30, 0.2], [16, 0.26], [6, 0.34]].map((h) => `<g stroke="#9FE6E0" stroke-width="${h[0]}" opacity="${h[1]}" stroke-linejoin="round" fill="none">${allLand}</g>`).join('');
  const landFill = lands.map((l) => `<path d="${l.d}" fill="${hispanic.has(l.k) ? `url(#${g('sand')})` : l.k === 'africa' ? `url(#${g('sand3')})` : `url(#${g('sand2')})`}"/>`).join('');
  const landEdge = `<g fill="none" stroke="#9C4A2C" stroke-width="3.2" stroke-linejoin="round" opacity=".9">${allLand}</g>`;
  const hatch = `<g fill="url(#${g('hatch')})" opacity=".5">${allLand}</g>`;
  const segs = [];
  for (let i = 0; i < MAP_SEGMENTS.length; i++) {
    const a = mapRegion(MAP_SEGMENTS[i][0]), b = mapRegion(MAP_SEGMENTS[i][1]);
    const d = segPath(a, b, i % 2 ? -1 : 1), lit = st(a) !== 'locked' && st(b) !== 'locked';
    segs.push(`<g class="m-seg" data-from="${a.id}" data-to="${b.id}"><path class="m-seg-path" d="${d}" fill="none" stroke="none"/>
<path class="m-seg-dots" d="${d}" fill="none" stroke="#FFF3D1" stroke-width="7" stroke-dasharray="0.1 17" stroke-linecap="round" opacity="${lit ? 0.9 : 0.28}"/></g>`);
  }
  const route = opts.route === false ? '' : `<g class="m-route">${segs.join('')}</g>`;
  const plaques = [];
  const meds = regs.map((r) => {
    const s = st(r), locked = s === 'locked', R = r.r;
    const ring = locked ? '#7E83B8' : PAL.sol, disc = locked ? '#4F548C' : r.color, ink = locked ? '#B9BDE6' : '#1B1030', acc = locked ? '#6E74B0' : '#FFF3D1';
    const nameW = Math.max(96, r.name.length * 13.5 + 30);
    const px = r.label === 'left' ? -(R + nameW / 2 + 6) : r.label === 'right' ? R + nameW / 2 + 6 : 0;
    const py = r.label === 'top' ? -(R + 28) : r.label === 'bottom' ? R + 34 : 4;
    const plaque = `<g class="m-plaque" transform="translate(${r1(px)} ${r1(py)})"><rect x="${-nameW / 2}" y="-19" width="${nameW}" height="38" rx="12" fill="${PAL.nuit}" stroke="${locked ? '#7E83B8' : PAL.sol}" stroke-width="3"/><rect x="${-nameW / 2 + 4}" y="-15" width="${nameW - 8}" height="30" rx="9" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/><text x="0" y="8" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="21" fill="${locked ? '#B9BDE6' : PAL.papel}" letter-spacing=".3">${esc(r.name)}</text></g>`;
    const badge = `<g transform="translate(${r1(R * 0.74)} ${r1(-R * 0.74)})"><circle r="15" fill="${r.event ? PAL.magenta : PAL.nuit}" stroke="${ring}" stroke-width="3"/>${r.event ? '<path d="' + starPath(0, 0, 10, 4.4, 5, 0) + '" fill="#fff"/>' : `<text y="6" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="16" fill="${PAL.papel}">${r.n}</text>`}</g>`;
    const check = s === 'done' ? `<g transform="translate(${r1(-R * 0.74)} ${r1(-R * 0.74)})"><circle r="15" fill="${PAL.quetzal}" stroke="${PAL.sol}" stroke-width="3"/><path d="M-7 1l5 5 9-11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : '';
    const lock = locked ? `<g transform="translate(${r1(-R * 0.74)} ${r1(-R * 0.74)})"><circle r="15" fill="#2B2F66" stroke="${ring}" stroke-width="3"/><path d="M-6 -1h12v10h-12z M-4 -1v-4a4 4 0 0 1 8 0v4" fill="#B9BDE6" stroke="#B9BDE6" stroke-width="2"/></g>` : '';
    plaques.push(`<g class="m-plq m-plq-${r.id}" transform="translate(${r.x} ${r.y})">${plaque}</g>`);
    return `<g class="m-med m-med-${r.id} m-${s}" data-id="${r.id}" data-x="${r.x}" data-y="${r.y}" transform="translate(${r.x} ${r.y})">
<ellipse cx="0" cy="${R + 10}" rx="${R * 0.9}" ry="8" fill="#000" opacity=".28"/>
${s === 'current' ? `<circle class="m-pulse" r="${R + 14}" fill="none" stroke="${PAL.sol}" stroke-width="5" opacity=".9"/>` : ''}
<g class="m-med-body"><circle r="${R + 8}" fill="${ring}" stroke="#6B2E12" stroke-width="3"/><circle r="${R + 2}" fill="url(#${g('tile')})"/>
<circle r="${R - 7}" fill="${disc}" stroke="#1B1030" stroke-width="2.5"/><circle r="${R - 7}" fill="url(#${g('shine')})"/>
<g transform="translate(${-R * 0.62} ${-R * 0.64}) scale(${r1((R * 1.24) / 100)})">${monument(r.icon, ink, acc)}</g>
${badge}${check}${lock}</g><circle class="m-hit" r="${R + 22}" fill="transparent"/></g>`;
  }).join('');
  const fog = regs.filter((r) => st(r) === 'locked').map((r, i) => `<g class="m-fog m-fog-${r.id}" data-id="${r.id}">${fogClouds(r.x, r.y, 31 + i * 7, r.lon > -16 ? 0.4 : 0.66)}</g>`).join('');
  const pr = mapRegion(opts.player || MAP_ROUTE.find((k) => states[k] === 'current') || 'madrid');
  const token = `<g class="m-token" transform="translate(${pr.x} ${pr.y - 6})"><g class="m-token-j"><ellipse cx="0" cy="2" rx="16" ry="6" fill="#000" opacity=".3"/>
<path d="M0 0C-26 -26 -30 -44 -30 -52A30 30 0 1 1 30 -52C30 -44 26 -26 0 0Z" fill="${PAL.terracotta}" stroke="#4A1A0C" stroke-width="3.5"/><circle cx="0" cy="-52" r="21" fill="${PAL.papel}" stroke="${PAL.sol}" stroke-width="4"/>
<text x="0" y="-43" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="26" fill="${PAL.nuit}">${esc(opts.initial || 'A')}</text></g></g>`;
  const guinea = mapProj(10, 1.7);
  const gx = 1500, gy = 700;
  void guinea;
  const compass = `<g class="m-compass" transform="translate(1470 1010)" opacity=".9"><circle r="78" fill="none" stroke="${PAL.papel}" stroke-width="3" opacity=".5"/><circle r="64" fill="none" stroke="${PAL.papel}" stroke-width="1.5" stroke-dasharray="3 7" opacity=".6"/><path d="M0 -92L14 -14L0 0L-14 -14Z" fill="${PAL.sol}"/><path d="M0 92L14 14L0 0L-14 14Z" fill="${PAL.papel}" opacity=".7"/><path d="M-92 0L-14 -14L0 0L-14 14Z M92 0L14 -14L0 0L14 14Z" fill="${PAL.papel}" opacity=".5"/><text y="-102" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="22" fill="${PAL.papel}">N</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}" width="${opts.width || MAP_W}" height="${opts.height || MAP_H}" class="m-svg" style="overflow:visible" role="img" aria-label="Mapa del mundo hispano">
<defs>
<linearGradient id="${g('sea')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A4A66"/><stop offset=".5" stop-color="#0E6985"/><stop offset="1" stop-color="#0B4B73"/></linearGradient>
<radialGradient id="${g('vig')}" cx="800" cy="600" r="1250" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#050A24" stop-opacity=".55"/></radialGradient>
<linearGradient id="${g('sand')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4CE86"/><stop offset="1" stop-color="#E0A058"/></linearGradient>
<linearGradient id="${g('sand2')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9C39B"/><stop offset="1" stop-color="#BFA37A"/></linearGradient>
<linearGradient id="${g('sand3')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9C39B"/><stop offset="1" stop-color="#D9C39B" stop-opacity="0"/></linearGradient>
<radialGradient id="${g('shine')}" cx=".35" cy=".28" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
<pattern id="${g('hatch')}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="10" height="10" fill="none"/><path d="M0 0V10" stroke="#B4642E" stroke-width="2.4" opacity=".28"/></pattern>
<pattern id="${g('waves')}" width="90" height="46" patternUnits="userSpaceOnUse"><path d="M0 23q11 -12 22 0t22 0t22 0t22 0" fill="none" stroke="#BDF1EC" stroke-width="2.2" opacity=".14" stroke-linecap="round"/></pattern>
${azulejoPattern(g('tile'), { a: PAL.nuit2, b: PAL.turquesa, c: PAL.sol })}
</defs>
<rect x="-1400" y="-600" width="4400" height="2400" fill="url(#${g('sea')})"/>
<rect x="-1400" y="-600" width="4400" height="2400" fill="url(#${g('waves')})"/>
<g class="m-cam">
<g class="m-grat" stroke="#BDF1EC" stroke-width="1.5" opacity=".1" fill="none"><path d="M0 120H1600M0 360H1600M0 600H1600M0 840H1600M0 1080H1600M260 0V1200M620 0V1200M980 0V1200M1340 0V1200" stroke-dasharray="4 10"/></g>
<g class="m-sea-halo">${halo}</g>
<g class="m-land">${landFill}${hatch}${landEdge}</g>
${compass}
<g class="m-guinea" transform="translate(${gx} ${gy})"><circle r="26" fill="${PAL.turquesa}" stroke="${PAL.sol}" stroke-width="4" opacity=".0" class="m-guinea-dot"/><text y="48" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="19" fill="${PAL.papel}" opacity="0" class="m-guinea-lbl">Guinea Ecuatorial</text></g>
${route}
${meds}
${fog}
${plaques.join('')}
${token}
</g>
<rect x="-1400" y="-600" width="4400" height="2400" fill="url(#${g('vig')})" pointer-events="none"/>
</svg>`;
}

// --- animation de la carte ------------------------------------------------------------------------------------
function mEl(root) { return typeof root === 'string' ? document.querySelector(root) : root; }
function ma(root, sel) { return Array.from(mEl(root).querySelectorAll(sel)); }
/** Position de camera (transform de .m-cam) qui centre (x,y) carte au centre du viewBox, a l'echelle s. vw/vh : taille affichee de la vue (defaut carte). */
export function mapCam(x, y, s, vw, vh) { return { x: r1((vw || MAP_W) / 2 - x * s), y: r1((vh || MAP_H) / 2 - y * s), scale: s }; }
/** Tween de camera vers (x,y,s) ou une region (id). Pas d'attribut layout : transform seul. */
export function mapCamTo(tl, root, target, s, at, dur, ease, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  tl.to(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, svgOrigin: '0 0', duration: dur, ease: ease || 'power3.inOut' }, at);
}
/**
 * Comme mapCamTo, mais SANS svgOrigin dans le tween : fiable pour enchainer plusieurs mouvements de camera dans une timeline
 * (avec svgOrigin, GSAP recale x/y et la position finale derive). Prerequis : l'origine 0 0 a deja ete posee par mapCamSet().
 */
export function mapCamMove(tl, root, target, s, at, dur, ease, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  tl.to(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, duration: dur, ease: ease || 'power3.inOut' }, at);
}
export function mapCamSet(g, root, target, s, vw, vh) {
  const p = typeof target === 'string' ? mapRegion(target) : target, c = mapCam(p.x, p.y, s, vw, vh);
  g.set(ma(root, '.m-cam'), { x: c.x, y: c.y, scale: c.scale, svgOrigin: '0 0' });
}
/** Le brouillard d'une region se dissipe : les nuages s'ecartent (devant d'abord, puis milieu, puis fond), gonflent, montent doucement et s'effacent ; la medaille s'allume. */
export function mapFogClear(tl, root, id, at, dur) {
  const d = dur || 1.8, r = mapRegion(id), order = { front: 0, mid: 0.22, back: 0.42 };
  ma(root, '.m-fog-' + id + ' .m-cloud').forEach((c, i) => {
    const px = +c.dataset.px - r.x, py = +c.dataset.py - r.y, l = Math.hypot(px, py) || 1;
    const layer = c.getAttribute('class').match(/m-cl-(\w+)/)[1], delay = (order[layer] || 0) + (i % 3) * 0.05;
    tl.to(c, { x: (px / l) * (120 + (i % 3) * 30) + (px >= 0 ? 40 : -40), y: (py / l) * 50 - 46 - (i % 2) * 14, scale: 1.3, rotation: (px >= 0 ? 1 : -1) * 4, opacity: 0, svgOrigin: c.dataset.px + ' ' + c.dataset.py, duration: d * 0.78, ease: 'power2.inOut' }, at + delay * d * 0.55);
  });
  const med = ma(root, '.m-med-' + id + ' .m-med-body');
  tl.fromTo(med, { scale: 0.9, svgOrigin: '0 0' }, { scale: 1, svgOrigin: '0 0', duration: 0.9, ease: 'elastic.out(1,0.5)' }, at + d * 0.5);
}
/** Brume lente des regions verrouillees : chaque nuage derive a son rythme (un aller-retour). */
export function mapFogDrift(tl, root, at, dur) {
  ma(root, '.m-cloud').forEach((c, i) => tl.to(c, { x: (i % 2 ? -1 : 1) * (7 + (i % 3) * 4), y: ((i % 3) - 1) * 3, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + (i % 4) * 0.1));
}
/** Pulsation de l'anneau "region courante" (finie). */
export function mapPulse(tl, root, at, n, period) {
  ma(root, '.m-pulse').forEach((p) => tl.fromTo(p, { scale: 1, opacity: 0.9, svgOrigin: '0 0' }, { scale: 1.28, opacity: 0, svgOrigin: '0 0', duration: period, ease: 'power1.out', repeat: n - 1 }, at));
}
/**
 * Voyage du jeton de `fromId` a `toId` (segments consecutifs de MAP_ROUTE) : le pointille se revele, le jeton suit le chemin
 * (MotionPathPlugin si fourni via `plugin`, sinon interpolation getPointAtLength), petit saut d'arrivee.
 */
export function mapTravel(tl, root, fromId, toId, at, dur, g) {
  const r = mEl(root), seg = r.querySelector(`.m-seg[data-from="${fromId}"][data-to="${toId}"]`);
  if (!seg) return;
  const path = seg.querySelector('.m-seg-path'), dots = seg.querySelector('.m-seg-dots'), len = path.getTotalLength();
  const token = r.querySelector('.m-token'), jar = r.querySelector('.m-token-j');
  const maskId = 'mk-' + fromId + '-' + toId;
  if (!r.querySelector('#' + maskId)) {
    const defs = r.querySelector('defs'), NS = 'http://www.w3.org/2000/svg';
    const mk = document.createElementNS(NS, 'mask'); mk.setAttribute('id', maskId); mk.setAttribute('maskUnits', 'userSpaceOnUse'); mk.setAttribute('x', 0); mk.setAttribute('y', 0); mk.setAttribute('width', MAP_W); mk.setAttribute('height', MAP_H);
    const mp = document.createElementNS(NS, 'path'); mp.setAttribute('d', path.getAttribute('d')); mp.setAttribute('fill', 'none'); mp.setAttribute('stroke', '#fff'); mp.setAttribute('stroke-width', 26); mp.setAttribute('stroke-linecap', 'round'); mp.setAttribute('class', 'm-seg-mask');
    mp.style.strokeDasharray = len; mp.style.strokeDashoffset = len;
    mk.appendChild(mp); defs.appendChild(mk);
    dots.setAttribute('mask', `url(#${maskId})`);
  }
  const mp = r.querySelector('#' + maskId + ' path'), a = mapRegion(fromId), prog = { p: 0 };
  g.set(dots, { opacity: 0.85 });
  tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut' }, at);
  tl.to(prog, { p: 1, duration: dur, ease: 'power1.inOut', onUpdate: () => { const pt = path.getPointAtLength(prog.p * len); g.set(token, { x: pt.x, y: pt.y - 6 }); } }, at);
  tl.to(jar, { y: -26, duration: dur * 0.5, ease: 'sine.out', yoyo: true, repeat: 1 }, at);
  tl.fromTo(jar, { scaleY: 0.82, scaleX: 1.12, svgOrigin: '0 0' }, { scaleY: 1, scaleX: 1, svgOrigin: '0 0', duration: 0.45, ease: 'elastic.out(1,0.4)' }, at + dur);
}

/**
 * Planisphere "explainer" (style documentaire) : terres neutres sombres, pays hispanophones en turquoise (opacite 0 au depart,
 * a reveler avec explainerReveal). Groupes : .x-hi-es (Espagne), .x-hi-mx (Mexique + Amerique centrale + Caraibes), .x-hi-sa
 * (Amerique du Sud), .x-gq (Guinee equatoriale, pastille). Meme viewBox que worldMap.
 */
export function explainerMap(opts) {
  opts = opts || {};
  const id = opts.uid || uid('xm'), g = (n) => id + '-' + n;
  const P = (k) => landPath(k);
  const neutral = ['usa', 'francia', 'mainland', 'baja', 'cuba', 'hispaniola', 'iberia'].map((k) => '<path d="' + P(k) + '"/>').join('');
  const over = ['brasil', 'guayanas'].map((k) => '<path d="' + P(k) + '"/>').join('');
  const hiMx = '<g clip-path="url(#' + g('cn') + ')"><path d="' + P('mainland') + '"/></g><path d="' + P('baja') + '"/><path d="' + P('cuba') + '"/><path d="' + P('hispaniola') + '"/>';
  const hiSa = '<g clip-path="url(#' + g('cs') + ')"><path d="' + P('mainland') + '"/></g>';
  const hiEs = '<path d="' + P('iberia') + '"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '" width="' + (opts.width || MAP_W) + '" height="' + (opts.height || MAP_H) + '" class="x-svg" style="overflow:visible" aria-hidden="true">'
    + '<defs><clipPath id="' + g('cn') + '"><rect x="-200" y="-200" width="2200" height="640"/></clipPath><clipPath id="' + g('cs') + '"><rect x="-200" y="440" width="2200" height="900"/></clipPath>'
    + '<pattern id="' + g('dots') + '" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="2" fill="#fff" opacity=".16"/></pattern></defs>'
    + '<rect x="-1400" y="-600" width="4400" height="2400" fill="#0D1038"/><rect x="-1400" y="-600" width="4400" height="2400" fill="url(#' + g('dots') + ')"/>'
    + '<g class="x-land" fill="#2A3079" stroke="#4A52B8" stroke-width="2.5" stroke-linejoin="round">' + neutral + '</g>'
    + '<g class="x-hi x-hi-es" fill="' + PAL.turquesa + '" opacity="0">' + hiEs + '</g>'
    + '<g class="x-hi x-hi-mx" fill="' + PAL.turquesa + '" opacity="0">' + hiMx + '</g>'
    + '<g class="x-hi x-hi-sa" fill="' + PAL.turquesa + '" opacity="0">' + hiSa + '</g>'
    + '<g class="x-over" fill="#2A3079" stroke="#4A52B8" stroke-width="2.5" stroke-linejoin="round">' + over + '</g>'
    + '<g class="x-edge" fill="none" stroke="#0D1038" stroke-width="2" stroke-linejoin="round" opacity=".7">' + ['mainland', 'iberia', 'baja', 'cuba', 'hispaniola'].map((k) => '<path d="' + P(k) + '"/>').join('') + '</g>'
    + '<g class="x-gq" transform="translate(1500 706)"><circle class="x-gq-ring" r="30" fill="none" stroke="' + PAL.sol + '" stroke-width="4" opacity="0"/><circle class="x-gq-dot" r="14" fill="' + PAL.turquesa + '" stroke="#fff" stroke-width="4" opacity="0"/></g>'
    + '</svg>';
}
/** Revele les pays hispanophones (Espagne, puis Mexique/Amerique centrale, puis Amerique du Sud, puis Guinee equatoriale). */
export function explainerReveal(tl, root, at, step) {
  const r = typeof root === 'string' ? document.querySelector(root) : root, s = step || 0.55;
  ['es', 'mx', 'sa'].forEach((k, i) => tl.fromTo(r.querySelectorAll('.x-hi-' + k), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' }, at + i * s));
  tl.fromTo(r.querySelectorAll('.x-gq-dot'), { opacity: 0, scale: 0.2, svgOrigin: '0 0' }, { opacity: 1, scale: 1, svgOrigin: '0 0', duration: 0.6, ease: 'back.out(3)' }, at + 3 * s);
  tl.fromTo(r.querySelectorAll('.x-gq-ring'), { opacity: 1, scale: 0.6, svgOrigin: '0 0' }, { opacity: 0, scale: 2.2, svgOrigin: '0 0', duration: 0.9, ease: 'power2.out' }, at + 3 * s);
}
