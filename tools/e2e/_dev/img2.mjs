import { open, seed, out } from './lib.mjs';
const { browser, page } = await open();
await seed(page, '(g,c)=>{ for (const v of c.units[0].vocab.slice(0,12)) { g.state.discovered[v.id]="2026-10-09"; } }');
await page.evaluate(() => window.__q.nav.go({ name: 'dictionary' }, { root: true }));
for (const t of [1500, 3000, 6000]) { await page.waitForTimeout(t); await page.screenshot({ path: `${out}/img-${t}.png`, clip: { x: 0, y: 240, width: 1280, height: 300 } }); }
await browser.close();
