// Icones provisoires (PNG 192/512 + maskable 512) generees depuis du SVG avec sharp.
// Usage : node scripts/make-icons.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const glyphs = {
  // Ballon de foot stylise
  maths: `<circle cx="256" cy="256" r="150" fill="#fff" stroke="#0b1b3a" stroke-width="12"/>
    <polygon points="256,176 316,220 293,290 219,290 196,220" fill="#0b1b3a"/>
    <path d="M256 176 V110 M316 220 L378 198 M293 290 L335 345 M219 290 L177 345 M196 220 L134 198" stroke="#0b1b3a" stroke-width="12" fill="none" stroke-linecap="round"/>`,
  // Plume stylisee
  espagnol: `<path d="M256 90 C380 150 400 300 256 430 C112 300 132 150 256 90Z" fill="#ffd98a" stroke="#1a0508" stroke-width="12"/>
    <path d="M256 110 V420" stroke="#7a1f2b" stroke-width="14" stroke-linecap="round"/>
    <path d="M256 180 L330 150 M256 250 L350 220 M256 320 L330 300 M256 180 L182 150 M256 250 L162 220 M256 320 L182 300" stroke="#7a1f2b" stroke-width="10" stroke-linecap="round"/>`,
  // Signes + et = sur fond bleu uni (Calcul — Entrainement)
  calcul: `<path d="M256 120 V270 M181 195 H331" stroke="#fff" stroke-width="34" stroke-linecap="round"/>
    <path d="M181 340 H331 M181 410 H331" stroke="#fff" stroke-width="34" stroke-linecap="round"/>`,
  // Deux pastilles (acces aux apps)
  hub: `<rect x="110" y="170" width="130" height="170" rx="28" fill="#12a34a"/>
    <rect x="272" y="170" width="130" height="170" rx="28" fill="#c8102e"/>`,
};
const colors = { maths: ['#12a34a', '#06210f'], espagnol: ['#9a2a3a', '#2a0b10'], hub: ['#1d3a73', '#0b1b3a'], calcul: ['#3b7bf5', '#1d4ed8'] };

function svg(app, scale) {
  const [a, b] = colors[app];
  const t = `translate(${256 - 256 * scale} ${256 - 256 * scale}) scale(${scale})`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs><radialGradient id="g" cx="50%" cy="35%" r="80%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>
    <rect width="512" height="512" fill="url(#g)"/>
    <g transform="${t}">${glyphs[app]}</g></svg>`);
}

// Usage : node scripts/make-icons.mjs [app]  (sans argument : toutes les apps)
for (const app of Object.keys(glyphs).filter((a) => !process.argv[2] || a === process.argv[2])) {
  const dir = join(root, 'apps', app, 'public', 'icons');
  mkdirSync(dir, { recursive: true });
  // "any" : motif plein cadre ; "maskable" : motif reduit (zone de securite 80 %)
  await sharp(svg(app, 1)).resize(512, 512).png().toFile(join(dir, 'icon-512.png'));
  await sharp(svg(app, 1)).resize(192, 192).png().toFile(join(dir, 'icon-192.png'));
  await sharp(svg(app, 0.7)).resize(512, 512).png().toFile(join(dir, 'maskable-512.png'));
}
console.log('icones OK');
