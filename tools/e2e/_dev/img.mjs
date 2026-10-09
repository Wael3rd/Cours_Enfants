import { open, seed } from './lib.mjs';
const { browser, page } = await open();
page.on('response', (r) => { if (r.url().includes('/img/emoji/') && r.status() !== 200) console.log('HTTP', r.status(), r.url()); });
page.on('requestfailed', (r) => console.log('FAILED', r.url(), r.failure()?.errorText));
await seed(page, '(g,c)=>{ for (const v of c.units[0].vocab.slice(0,12)) { g.state.discovered[v.id]="2026-10-09"; } }');
await page.evaluate(() => window.__q.nav.go({ name: 'dictionary' }, { root: true }));
await page.waitForTimeout(4000);
console.log(await page.evaluate(() => [...document.querySelectorAll('img')].map((i) => `${i.src.split('/').pop()}:${i.naturalWidth}:${i.complete}:${getComputedStyle(i).opacity}:${i.getBoundingClientRect().width}`).join('\n')));
await browser.close();
