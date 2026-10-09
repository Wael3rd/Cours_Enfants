// Aplati les PNG 3D de fluentui-emoji (clone dans assets/_downloads/fluent-src) vers
// assets/_downloads/fluent-3d/<codepoints>.png et genere assets/fluent-3d-index.json
// Usage : node tools/assets/build-emoji-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = path.join(root, 'assets/_downloads/fluent-src/assets');
const out = path.join(root, 'assets/_downloads/fluent-3d');
fs.mkdirSync(out, { recursive: true });
const TONES = ['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];
const MOD = { Light: 0x1f3fb, 'Medium-Light': 0x1f3fc, Medium: 0x1f3fd, 'Medium-Dark': 0x1f3fe, Dark: 0x1f3ff };
const strip = (s) => s.replace(/️/g, '');
const emoji = {}, byName = {};
let n = 0, miss = 0;
for (const dir of fs.readdirSync(src)) {
  const base = path.join(src, dir);
  const mp = path.join(base, 'metadata.json');
  if (!fs.existsSync(mp)) continue;
  const meta = JSON.parse(fs.readFileSync(mp, 'utf8'));
  const baseCps = meta.unicode.split(' ');
  const add = (png, cps, tone) => {
    const chr = strip(String.fromCodePoint(...cps.map((c) => parseInt(c, 16))));
    const key = cps.filter((c) => c !== 'fe0f').join('-');
    const file = key + '.png';
    fs.copyFileSync(png, path.join(out, file));
    emoji[chr] = { name: meta.cldr, cp: key, file, group: meta.group, ...(tone ? { tone } : {}) };
    if (!tone) byName[meta.cldr] = chr;
    n++;
  };
  const find3d = (d) => {
    const p = path.join(d, '3D');
    if (!fs.existsSync(p)) return null;
    const f = fs.readdirSync(p).find((x) => x.endsWith('.png'));
    return f ? path.join(p, f) : null;
  };
  const direct = find3d(base);
  if (direct) { add(direct, baseCps, null); continue; }
  for (const t of TONES) {
    const png = find3d(path.join(base, t));
    if (!png) { if (t === 'Default') miss++; continue; }
    let cps;
    if (t === 'Default') cps = baseCps;
    else if (Array.isArray(meta.unicodeSkintones) && meta.unicodeSkintones.length === 6) cps = meta.unicodeSkintones[TONES.indexOf(t)].split(' ');
    else { cps = [...baseCps]; cps.splice(1, 0, MOD[t].toString(16)); }
    add(png, cps, t === 'Default' ? null : t);
  }
}
fs.writeFileSync(path.join(root, 'assets/fluent-3d-index.json'), JSON.stringify({ source: 'microsoft/fluentui-emoji (MIT) - style 3D', note: 'cle = caractere sans U+FE0F ; file relatif a assets/_downloads/fluent-3d/', count: n, emoji, byName }));
console.log('emojis', n, 'sans 3D default', miss);
