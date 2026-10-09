import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
export const out = 'tools/e2e/_dev/out';
mkdirSync(out, { recursive: true });
export async function open(query = '') {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  page.on('console', (m) => { if (['error'].includes(m.type())) console.log('CONSOLE', m.type(), m.text().slice(0, 300)); });
  await page.goto('http://127.0.0.1:5199/espagnol/?debug&' + query);
  await page.waitForFunction(() => window.__q, null, { timeout: 15000 });
  return { browser, page };
}
/** Etat initial : prenom + prologue vu (la carte s'affiche). */
export async function seed(page, fn = '() => {}') {
  await page.evaluate(async (src) => {
    const { game, loadAllUnits, content } = window.__q;
    await loadAllUnits();
    game.mutate((s) => { s.profile.name = 'Wael'; s.profile.avatar.base = 'chico:2'; s.flags.prologue = '1'; });
    // eslint-disable-next-line no-eval
    (0, eval)(src)(game, content);
  }, fn);
}
export const go = (page, route) => page.evaluate((r) => window.__q.nav.go(r), route);
