// Usage : node tools/e2e/_dev/screen.mjs <route-json> <nom> [js-seed] ; ex: '{"name":"dictionary"}' dic
import { open, seed, out } from './lib.mjs';
const route = JSON.parse(process.argv[2]);
const name = process.argv[3] || 'screen';
const js = process.argv[4] || '(g,c)=>{}';
const { browser, page } = await open();
await seed(page, js);
await page.evaluate((r) => window.__q.nav.go(r, { root: true }), route);
await page.waitForTimeout(4000);
await page.screenshot({ path: `${out}/${name}.png` });
await browser.close();
