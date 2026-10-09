// Usage : node tools/assets/pick-emoji.mjs <dossier-sortie> <emoji|nom>... [--list fichier.json] [--size 256]
// Copie les emojis Fluent 3D demandes en WebP (256 px par defaut), nom stable = codepoints (ex: 26bd.webp,
// 1f44b-1f3fd.webp). Un argument peut etre un caractere (⚽, 👋🏽), un nom CLDR ("soccer ball"), ou
// un codepoint ("26bd"). --list : JSON tableau de chaines (ou objet {cle: emoji}).
// Ecrit aussi <sortie>/emoji-map.json : { "⚽": "26bd.webp" }.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'assets/fluent-3d-index.json'), 'utf8'));
const dl = path.join(root, 'assets/_downloads/fluent-3d');
const strip = (s) => s.replace(/️/g, '');
const args = process.argv.slice(2);
let size = 256; const items = [];
const outDir = args.shift();
if (!outDir) { console.error('usage: pick-emoji.mjs <dossier-sortie> <emoji|nom>... [--list f.json] [--size N]'); process.exit(1); }
while (args.length) {
  const a = args.shift();
  if (a === '--size') size = +args.shift();
  else if (a === '--list') { const j = JSON.parse(fs.readFileSync(args.shift(), 'utf8')); items.push(...(Array.isArray(j) ? j : Object.values(j))); }
  else items.push(a);
}
// separe aussi "⚽ 🏆" passe en un seul argument
const flat = items.flatMap((s) => (/\s/.test(s.trim()) && !idx.byName[s.trim().toLowerCase()] ? s.trim().split(/\s+/) : [s]));
function resolve(q) {
  const k = strip(q);
  if (idx.emoji[k]) return [k, idx.emoji[k]];
  const nm = idx.byName[q.trim().toLowerCase()];
  if (nm) return [nm, idx.emoji[nm]];
  if (/^[0-9a-f]{4,6}(-[0-9a-f]{4,6})*$/i.test(q)) {
    const hit = Object.entries(idx.emoji).find(([, v]) => v.cp === q.toLowerCase());
    if (hit) return hit;
  }
  return null;
}
fs.mkdirSync(outDir, { recursive: true });
const map = {}; let bad = 0;
for (const q of flat) {
  const r = resolve(q);
  if (!r) { console.error('introuvable:', q); bad++; continue; }
  const [chr, v] = r;
  const dst = v.cp + '.webp';
  await sharp(path.join(dl, v.file)).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(outDir, dst));
  map[chr] = dst;
}
const mp = path.join(outDir, 'emoji-map.json');
const prev = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, 'utf8')) : {};
fs.writeFileSync(mp, JSON.stringify({ ...prev, ...map }, null, 2));
console.log(`ok ${Object.keys(map).length} emoji -> ${outDir}` + (bad ? ` (${bad} introuvables)` : ''));
process.exit(bad ? 2 : 0);
