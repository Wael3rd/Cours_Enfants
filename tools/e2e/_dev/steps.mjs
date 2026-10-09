import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const out = 'tools/e2e/_dev/out';
mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);
const SHOTS = [
  ['flash', 'u01-q02', 0],
  ['listen-img', 'u01-q02', 1],
  ['match', 'u01-q02', 2],
  ['truefalse', 'u01-q02', 3],
  ['dialogue', 'u01-q02', 9],
  ['fillblank', 'u01-q02', 11],
  ['reorder', 'u01-q02', 12],
  ['dictado', 'u01-q02', 13],
  ['speak', 'u01-q02', 14],
  ['grammar', 'u01-q03', 0],
  ['conjugar', 'u01-q06', 2],
  ['read', 'u01-q05', 10],
  ['write', 'u01-q07', 13],
  ['cine', 'u01-q01', 0],
  ['boss', 'u01-q08', 0],
].filter((s) => !only.length || only.includes(s[0]));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [name, quest, from] of SHOTS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(name, 'PAGEERROR', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log(name, 'CONSOLE', m.text().slice(0, 200)); });
  await page.goto(`http://127.0.0.1:5199/espagnol/?debug&from=${from}`);
  await page.waitForFunction(() => window.__q, null, { timeout: 15000 });
  await page.evaluate(async () => {
    const { game, loadAllUnits } = window.__q;
    await loadAllUnits();
    game.mutate((s) => { s.profile.name = 'Wael'; s.profile.avatar.base = 'chico:2'; s.flags.prologue = '1'; });
  });
  await page.evaluate((q) => window.__q.nav.go({ name: 'quest', quest: q }), quest);
  await page.waitForSelector('.stepwrap, .bossintro, .cf', { timeout: 30000 });
  await page.waitForTimeout(name === 'boss' ? 3600 : name === 'cine' ? 3500 : 1800);
  await page.screenshot({ path: `${out}/step-${name}.png` });
  await ctx.close();
}
await browser.close();
