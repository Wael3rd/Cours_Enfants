// E2E : build deja fait (npm run build). Sert dist/, joue la cinematique en ligne puis hors-ligne.
// Usage : npm run e2e   (ou node tools/e2e/run.mjs)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const PORT = 4179;
const ORIGIN = `http://localhost:${PORT}`;
const NAME = 'Inès';
const CALC = '8 + 6 = 14';

const results = [];
const check = (label, ok, extra = '') => {
  results.push({ label, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`);
};

const server = spawn(process.execPath, ['scripts/preview.mjs'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
const page = await context.newPage();

const external = [];
const failed = [];
context.on('request', (req) => {
  const u = req.url();
  if (/^(data|blob|about|chrome-extension):/.test(u)) return;
  if (new URL(u).origin !== ORIGIN) external.push(u);
});
context.on('requestfailed', (req) => failed.push(`${req.url()} (${req.failure()?.errorText})`));
page.on('pageerror', (e) => console.log('pageerror:', e.message));

/** Joue la cinematique et verifie : lecture, prenom/calcul injectes, screenshots, fin propre. */
async function playAndVerify(tag) {
  await page.fill('#child-name', NAME);
  await page.click('button:has-text("Tester la cinématique")');
  await page.waitForSelector('.cine[data-state="playing"]', { timeout: 10000 });
  check(`[${tag}] la cinématique démarre (state=playing)`, true);

  const time = () => page.evaluate(() => document.querySelector('hyperframes-player').currentTime);
  const shots = [
    [0.6, 'impact'],
    [1.5, 'lower-third'],
    [2.4, 'fin'],
  ];
  for (const [t, name] of shots) {
    await page.waitForFunction((x) => document.querySelector('hyperframes-player')?.currentTime >= x, t, { timeout: 8000 });
    await page.screenshot({ path: join(out, `${tag}-${name}.png`) });
  }
  const cur = await time();
  check(`[${tag}] le temps avance (currentTime=${cur.toFixed(2)} >= 2.4)`, cur >= 2.4);

  const dom = await page.evaluate(() => {
    const d = document.querySelector('hyperframes-player').iframeElement.contentDocument;
    return { who: d.getElementById('pg-who')?.textContent, what: d.getElementById('pg-what')?.textContent, word: d.getElementById('goal-word')?.textContent };
  });
  check(`[${tag}] prénom injecté affiché ("${dom.who}")`, dom.who === NAME);
  check(`[${tag}] calcul injecté affiché ("${dom.what}")`, dom.what === CALC);
  check(`[${tag}] "BUT !" présent`, dom.word === 'BUT !');

  await page.waitForFunction(() => document.getElementById('status')?.textContent.includes('ended'), null, { timeout: 8000 });
  check(`[${tag}] fin propre -> overlay retiré, promesse résolue 'ended'`, (await page.locator('.cine').count()) === 0);
}

try {
  // ---- 1. En ligne
  await page.goto(`${ORIGIN}/maths/`);
  await page.waitForSelector('h1:has-text("Calcul Champion")');
  await page.screenshot({ path: join(out, 'online-home.png') });
  await playAndVerify('online');

  // ---- 2. Attendre que le SW ait tout precache, puis recharger (page controlee)
  const cached = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    for (let i = 0; i < 50 && !reg.active; i++) await new Promise((r) => setTimeout(r, 100));
    const need = ['cinematics/proof-goal/index.html', 'cinematics/_shared/hyperframe.runtime.iife.js', 'cinematics/_shared/gsap.min.js', 'cinematics/_shared/BebasNeue-latin.woff2'];
    for (let i = 0; i < 100; i++) {
      const keys = await caches.keys();
      const urls = [];
      for (const k of keys) urls.push(...(await (await caches.open(k)).keys()).map((r) => r.url));
      if (need.every((n) => urls.some((u) => u.includes('/maths/' + n)))) return { ok: true, count: urls.length };
      await new Promise((r) => setTimeout(r, 200));
    }
    return { ok: false };
  });
  check(`SW maths : cinématique + runtime + gsap + police en precache (${cached.count} entrées)`, cached.ok);
  await page.reload();
  await page.waitForSelector('h1:has-text("Calcul Champion")');
  const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
  check('la page rechargée est contrôlée par le SW', controlled);

  // ---- 3. Hors-ligne
  await context.setOffline(true);
  const failedBefore = failed.length;
  await page.reload();
  await page.waitForSelector('h1:has-text("Calcul Champion")', { timeout: 10000 });
  check('hors-ligne : l\'app se recharge depuis le cache SW', true);
  await page.screenshot({ path: join(out, 'offline-home.png') });
  await playAndVerify('offline');
  const newFailures = failed.slice(failedBefore).filter((f) => !/favicon/.test(f));
  check('hors-ligne : aucune requête en échec', newFailures.length === 0, newFailures.join(' | '));
  await context.setOffline(false);

  check(`aucune requête hors origine (${external.length})`, external.length === 0, external.join(' | '));
} catch (e) {
  check('exécution sans exception', false, String(e?.stack ?? e));
  await page.screenshot({ path: join(out, 'error.png') }).catch(() => {});
} finally {
  await browser.close();
  server.kill();
}

const bad = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - bad}/${results.length} checks OK ; screenshots dans ${out}`);
process.exit(bad ? 1 : 0);
