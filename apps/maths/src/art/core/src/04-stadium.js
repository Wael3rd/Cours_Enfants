// ---------------------------------------------------------------- fond de stade en couches (1920x1200, horizon a y=620)
// Couches empilables / animables separement : ciel, projecteurs (+rayons), foule (+flashs), pelouse.
const SW = 1920, SH = 1200, HZ = 620;
function svgWrap(cls, body, defs) { return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}" preserveAspectRatio="xMidYMid slice"><defs>${defs || ''}</defs>${body}</svg>`; }

export function stadiumSky(opts) {
  opts = opts || {}; const u = opts.uid || uid('sk'); const r = rng(11);
  let stars = '';
  for (let i = 0; i < 70; i++) { const x = r() * SW, y = r() * 300, s = 0.8 + r() * 2; stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="#fff" opacity="${(0.25 + r() * 0.6).toFixed(2)}"/>`; }
  const body = `<rect width="${SW}" height="${SH}" fill="url(#${u}g)"/>${stars}
<ellipse cx="960" cy="470" rx="1100" ry="260" fill="url(#${u}h)"/>
<path d="M0 330 Q960 240 1920 330 L1920 470 L0 470Z" fill="#050A26"/>
<path d="M0 330 Q960 240 1920 330" stroke="#2A3CA0" stroke-width="5" fill="none" opacity=".7"/>`;
  const defs = `<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03051A"/><stop offset=".3" stop-color="#0A1250"/><stop offset=".5" stop-color="#1B2C86"/><stop offset="1" stop-color="#0E1A55"/></linearGradient>
<radialGradient id="${u}h"><stop offset="0" stop-color="#5E7CFF" stop-opacity=".55"/><stop offset="1" stop-color="#5E7CFF" stop-opacity="0"/></radialGradient>`;
  return svgWrap('st-sky', body, defs);
}

export function stadiumLights(opts) {
  opts = opts || {}; const u = opts.uid || uid('li');
  const xs = [250, 700, 1220, 1670];
  let beams = '', banks = '';
  xs.forEach((x, i) => {
    const dir = (960 - x) * 0.55;
    beams += `<polygon class="st-beam st-beam-${i}" points="${x - 46},236 ${x + 46},236 ${x + dir + 360},1040 ${x + dir - 360},1040" fill="url(#${u}b)"/>`;
    let lamps = '';
    for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) lamps += `<circle cx="${x - 54 + b * 36}" cy="${170 + a * 28}" r="11" fill="#FFFBE0"/>`;
    banks += `<g class="st-bank st-bank-${i}"><circle cx="${x}" cy="200" r="150" fill="url(#${u}o)" class="st-halo"/><rect x="${x - 82}" y="136" width="164" height="112" rx="10" fill="#10163A" stroke="#2A3CA0" stroke-width="4"/>${lamps}<rect x="${x - 6}" y="248" width="12" height="90" fill="#10163A"/></g>`;
  });
  const defs = `<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8D0" stop-opacity=".42"/><stop offset=".7" stop-color="#FFF8D0" stop-opacity=".1"/><stop offset="1" stop-color="#FFF8D0" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}o"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".85"/><stop offset=".25" stop-color="#FFE98A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE98A" stop-opacity="0"/></radialGradient>`;
  return svgWrap('st-lights', `<g class="st-beams" style="mix-blend-mode:screen">${beams}</g>${banks}`, defs);
}

/** Tribunes : 14 rangees de supporters (graine fixe), panneaux LED, ~44 emplacements de flashs d'appareils photo (`.st-flash`). */
export function stadiumCrowd(opts) {
  opts = opts || {}; const u = opts.uid || uid('cw'); const r = rng(opts.seed || 7);
  const cols = opts.colors || ['#E8212F', '#1B6BFF', '#FFD23F', '#FFFFFF', '#17B26A', '#FF8A1F'];
  let rows = '', flashes = '';
  const R = 14, y0 = 330, y1 = 598;
  rows += `<rect x="0" y="${y0 - 10}" width="${SW}" height="${HZ - y0 + 10}" fill="url(#${u}s)"/>`;
  for (let k = 0; k < R; k++) {
    const t = k / (R - 1), y = y0 + 12 + t * (y1 - y0 - 12), sc = 0.62 + t * 0.78, step = 30 * sc + 8;
    let row = '';
    for (let x = (k % 2) * step * 0.5 - 10; x < SW + 20; x += step) {
      const c = cols[Math.floor(r() * cols.length)], sk = SKINS[Math.floor(r() * SKINS.length)];
      const h = (r() - 0.5) * 6;
      row += `<path d="M${(x - 15 * sc).toFixed(1)} ${(y + 30 * sc + h).toFixed(1)} q${(15 * sc).toFixed(1)} ${(-24 * sc).toFixed(1)} ${(30 * sc).toFixed(1)} 0z" fill="${c}"/><circle cx="${x.toFixed(1)}" cy="${(y + h).toFixed(1)}" r="${(11 * sc).toFixed(1)}" fill="${sk}"/>`;
      if (r() < 0.05) row += `<path d="M${(x + 6 * sc).toFixed(1)} ${(y + h).toFixed(1)} l${(10 * sc).toFixed(1)} ${(-34 * sc).toFixed(1)}" stroke="#fff" stroke-width="3"/><rect x="${(x + 14 * sc).toFixed(1)}" y="${(y - 36 * sc + h).toFixed(1)}" width="${(26 * sc).toFixed(1)}" height="${(16 * sc).toFixed(1)}" fill="${c}"/>`;
    }
    rows += `<g class="st-row st-row-${k}">${row}</g><rect x="0" y="${(y + 34 * sc).toFixed(1)}" width="${SW}" height="${(4 + 3 * t).toFixed(1)}" fill="#050A26" opacity=".55"/>`;
  }
  for (let i = 0; i < 44; i++) {
    const x = 60 + r() * (SW - 120), y = 350 + r() * 230, s = 0.7 + (y - 350) / 230 * 0.9;
    flashes += `<g class="st-flash st-flash-${i}" opacity="0" transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${s.toFixed(2)})"><circle r="26" fill="url(#${u}f)"/><path d="M0 -26 L4 -4 L26 0 L4 4 L0 26 L-4 4 L-26 0 L-4 -4Z" fill="#fff"/></g>`;
  }
  // panneaux LED au pied de la tribune (formes abstraites, aucun texte : decor)
  let led = '';
  for (let i = 0; i < 6; i++) {
    const w = SW / 6, c = [PAL.corail, PAL.cyan, PAL.jaune, PAL.orange, PAL.cyan, PAL.corail][i];
    led += `<rect x="${i * w + 3}" y="${HZ - 10}" width="${w - 6}" height="40" fill="#0A1030"/><rect x="${i * w + 3}" y="${HZ - 10}" width="${w - 6}" height="5" fill="${c}"/>`;
    for (let k = 0; k < 5; k++) led += `<polygon points="${i * w + 40 + k * 52},${HZ + 6} ${i * w + 62 + k * 52},${HZ + 6} ${i * w + 78 + k * 52},${HZ + 22} ${i * w + 56 + k * 52},${HZ + 22}" fill="${c}" opacity="${(0.9 - k * 0.15).toFixed(2)}"/>`;
  }
  const body = `${rows}<rect x="0" y="${y0 - 10}" width="${SW}" height="${HZ - y0 + 10}" fill="url(#${u}v)"/><g class="st-led">${led}</g><g class="st-flashes" style="mix-blend-mode:screen">${flashes}</g>`;
  const defs = `<linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1146"/><stop offset="1" stop-color="#18246E"/></linearGradient>
<linearGradient id="${u}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03051A" stop-opacity=".78"/><stop offset=".6" stop-color="#050A26" stop-opacity=".3"/><stop offset="1" stop-color="#050A26" stop-opacity=".1"/></linearGradient>
<radialGradient id="${u}f"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  return svgWrap('st-crowd', body, defs);
}

/** Projection pelouse : u in [-1,1] (travers), z in [0,1] (0 = bord camera, 1 = ligne de but au fond, sur l'horizon). */
export function pitchPoint(u, z) {
  const f = 1 / (1 + 2.2 * z), fMin = 1 / 3.2, t = (1 - f) / (1 - fMin);
  return [SW / 2 + u * 1500 * f, SH - (SH - HZ) * t];
}
export function stadiumPitch(opts) {
  opts = opts || {}; const u = opts.uid || uid('pt');
  const P = (a, b) => pitchPoint(a, b).map((n) => n.toFixed(1)).join(',');
  let bands = '';
  const N = 12;
  for (let i = 0; i < N; i++) {
    const z0 = i / N, z1 = (i + 1) / N;
    bands += `<polygon points="${P(-1.6, z0)} ${P(1.6, z0)} ${P(1.6, z1)} ${P(-1.6, z1)}" fill="${i % 2 ? '#0E8A40' : '#12A04B'}"/>`;
  }
  const line = (pts) => `<polyline points="${pts.map((p) => P(p[0], p[1])).join(' ')}" fill="none" stroke="#F4FFF6" stroke-width="7" stroke-linejoin="round" opacity=".9"/>`;
  let arc = [];
  for (let a = 0; a <= 180; a += 10) { const r = a * Math.PI / 180; const uu = 0.2 * Math.cos(r), zz = 0.72 - 0.12 * Math.sin(r); if (zz < 0.7) arc.push([uu, zz]); }
  const lines = line([[-1, 0], [-1, 1]]) + line([[1, 0], [1, 1]]) + line([[-1, 1], [1, 1]]) +
    line([[-0.5, 1], [-0.5, 0.7], [0.5, 0.7], [0.5, 1]]) + line([[-0.22, 1], [-0.22, 0.86], [0.22, 0.86], [0.22, 1]]) + line(arc.map((p) => [p[0], p[1] - 0.0]).filter((p) => p[1] < 0.7)) +
    `<ellipse cx="${pitchPoint(0, 0.78)[0]}" cy="${pitchPoint(0, 0.78)[1]}" rx="7" ry="3" fill="#F4FFF6"/>`;
  const body = `<g class="st-bands">${bands}</g><g class="st-lines">${lines}</g><rect x="0" y="${HZ}" width="${SW}" height="${SH - HZ}" fill="url(#${u}d)"/><rect x="0" y="${HZ}" width="${SW}" height="${SH - HZ}" fill="url(#${u}v)"/>`;
  const defs = `<linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03120A" stop-opacity=".62"/><stop offset=".25" stop-color="#03120A" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}v" cx=".5" cy=".4" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="st-pitch" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><svg x="0" y="${HZ}" width="${SW}" height="${SH - HZ}" viewBox="0 ${HZ} ${SW} ${SH - HZ}" overflow="hidden">${body}</svg></svg>`;
}

/** Stade complet : 4 couches absolues dans un conteneur `.ce-stadium` (chaque couche = classe `st-sky|st-crowd|st-lights|st-pitch`). */
export function stadium(opts) {
  const o = opts || {};
  const L = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block';
  const wrap = (s) => s.replace('<svg ', `<svg style="${L}" `);
  return `<div class="ce-stadium" style="position:absolute;inset:0;overflow:hidden">${wrap(stadiumSky(o))}${wrap(stadiumCrowd(o))}${wrap(stadiumPitch(o))}${wrap(stadiumLights(o))}</div>`;
}
