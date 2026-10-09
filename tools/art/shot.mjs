// Usage : node tools/art/shot.mjs <page.html|url> <out.png> [largeur] [hauteur] [click:Texte] [wait:ms] ...
// Capture rapide d'une page de labo du kit (file:// ou http://). Chrome installe requis.
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [src, out, w = '1600', h = '1000', ...steps] = process.argv.slice(2); // steps : click:<texte> | wait:<ms>
const url = /^https?:/.test(src) ? src : pathToFileURL(resolve(src)).href;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
page.on('console', (m) => { if (m.type() === 'error') console.log('console.error:', m.text()); });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(url);
await page.waitForTimeout(600);
for (const st of steps) {
  if (st.startsWith('click:')) await page.getByText(st.slice(6), { exact: true }).first().click();
  else if (st.startsWith('wait:')) await page.waitForTimeout(+st.slice(5));
}
await page.screenshot({ path: out });
await browser.close();
