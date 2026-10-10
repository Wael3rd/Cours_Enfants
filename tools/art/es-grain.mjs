// Grain de papier des cinematiques espagnol : tuile 256x256 WebP rasterisee une fois (remplace le filtre feTurbulence plein cadre).
// Usage : node tools/art/es-grain.mjs  ->  apps/espagnol/public/cinematics/_shared/img/grain.webp
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const N = 256;
let s = 20261010;
const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
// bruit a 2 octaves, tuile sans couture (coordonnees modulo N)
const grid = (g) => Float32Array.from({ length: g * g }, rnd);
const oct = [{ g: 32, a: 0.6, v: grid(32) }, { g: 64, a: 0.4, v: grid(64) }];
const sample = (o, x, y) => {
  const fx = (x / N) * o.g, fy = (y / N) * o.g, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
  const at = (i, j) => o.v[(j % o.g) * o.g + (i % o.g)];
  const a = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx, b = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
  return a * (1 - ty) + b * ty;
};
const buf = Buffer.alloc(N * N * 4);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const n = oct.reduce((t, o) => t + sample(o, x, y) * o.a, 0) + (rnd() - 0.5) * 0.35;
  const i = (y * N + x) * 4;
  buf[i] = 115; buf[i + 1] = 89; buf[i + 2] = 51;
  buf[i + 3] = Math.max(0, Math.min(255, Math.round((n - 0.2) * 255 * 0.5)));
}
const out = resolve(import.meta.dirname, '../../apps/espagnol/public/cinematics/_shared/img');
mkdirSync(out, { recursive: true });
await sharp(buf, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 60, alphaQuality: 70 }).toFile(resolve(out, 'grain.webp'));
console.log('grain.webp ecrit');
