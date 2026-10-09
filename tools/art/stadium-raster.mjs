// Rasterise une fois les couches statiques du stade (kit CEArt) en WebP, pour la fluidite sur tablette :
//   stadium-base.webp   1920x1200  ciel + tribunes (14 rangees, ~2 500 noeuds SVG) + pelouse, sans flashs
//   stadium-lights.webp 1920x1200  projecteurs (rayons + rampes), fond transparent
//   stadium-soft.webp    960x600   base + projecteurs flous (arriere-plans assombris des cinematiques)
// Sortie : apps/maths/public/cinematics/_shared/img/ (servie a l'app via BASE_URL et aux compositions via ./_shared/img/).
// Rendu par Chrome (Playwright) = meme moteur que l'app. A relancer apres toute modification de 04-stadium.js :
//   npm run art:raster
import { chromium } from 'playwright-core';
import { mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..', '..');
spawnSync(process.execPath, ['scripts/cinematics.mjs', 'art', 'maths'], { cwd: root, stdio: 'inherit' });
const A = await import(`file://${join(root, 'apps/maths/src/art/core/ceart.js').replace(/\\/g, '/')}?t=${Date.now()}`);
const out = join(root, 'apps/maths/public/cinematics/_shared/img');
mkdirSync(out, { recursive: true });

const L = 'position:absolute;left:0;top:0;width:1920px;height:1200px;display:block';
const wrap = (s) => s.replace('<svg ', `<svg style="${L}" `);
const page0 = (body, bg) => `<!doctype html><html><head><style>html,body{margin:0;width:1920px;height:1200px;overflow:hidden;background:${bg}}</style></head><body>${body}</body></html>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1 });
  async function shot(html, transparent) {
    await page.setContent(html);
    await page.waitForTimeout(100);
    return page.screenshot({ type: 'png', omitBackground: transparent });
  }
  const base = await shot(page0(wrap(A.stadiumSky({})) + wrap(A.stadiumCrowd({ flashes: 0 })) + wrap(A.stadiumPitch({})), '#070c2b'), false);
  const lights = await shot(page0(wrap(A.stadiumLights({})), 'transparent'), true);
  await sharp(base).webp({ quality: 82, effort: 6 }).toFile(join(out, 'stadium-base.webp'));
  await sharp(lights).webp({ quality: 85, alphaQuality: 90, effort: 6 }).toFile(join(out, 'stadium-lights.webp'));
  const both = await sharp(base).composite([{ input: lights }]).png().toBuffer();
  await sharp(both).resize(960, 600).blur(4).webp({ quality: 72, effort: 6 }).toFile(join(out, 'stadium-soft.webp'));
  for (const f of ['stadium-base.webp', 'stadium-lights.webp', 'stadium-soft.webp']) console.log(`${f}  ${(statSync(join(out, f)).size / 1024).toFixed(0)} Ko`);
} finally {
  await browser.close();
}
