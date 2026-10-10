// E2E espagnol : carte du monde avec progression avancee forcee (etat sauvegarde simule via window.__q, ?debug).
// Verifie : medaillons des 10 regions + Oaxaca, jeton qui voyage (flags.travel), unites 5-10 qui s'ouvrent. Screenshots es-map-*.png
// Usage : node tools/e2e/es-map.mjs   (SKIP_BUILD=1 pour reutiliser tools/e2e/.es-dist)
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
const distRoot = join(import.meta.dirname, '.es-dist');
mkdirSync(out, { recursive: true });
if (!process.env.SKIP_BUILD) {
  const r = spawnSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
    cwd: join(root, 'apps', 'espagnol'), env: { ...process.env, CE_OUT_DIR: join(distRoot, 'espagnol') }, stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const PORT = 4183;
const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  let p = normalize(join(distRoot, decodeURIComponent(url.pathname)));
  if (!p.startsWith(distRoot)) return void res.writeHead(403).end();
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
  createReadStream(p).pipe(res);
}).listen(PORT);
const ORIGIN = `http://localhost:${PORT}`;

let fails = 0;
const check = (label, ok, extra = '') => { if (!ok) fails++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`); };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: 'block' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

// etat : les `done` premieres unites ordinaires terminees (quetes + plume) ; travel = "from:to" optionnel
const setProgress = (done, travel) => page.evaluate(([n, tr]) => {
  const { game, content } = window.__q;
  game.mutate((s) => {
    s.flags.prologue = '1'; s.profile.name = 'Inès';
    s.quests = {}; s.plumas = {}; delete s.flags.travel;
    content.main.slice(0, n).forEach((u) => {
      u.quests.forEach((q) => (s.quests[q.id] = { done: true, stars: 3, bestAccuracy: 0.95, bestHints: 0, attempts: 1, completedAt: '2026-10-01' }));
      s.plumas[u.id] = '2026-10-01';
    });
    if (tr) s.flags.travel = tr;
  });
}, [done, travel ?? '']);

try {
  await page.goto(`${ORIGIN}/espagnol/?debug`);
  await page.waitForFunction(() => window.__q && window.__q.content && window.__q.content.main?.length);
  const mains = await page.evaluate(() => window.__q.content.main.map((u) => u.id + ':' + u.lugar));
  console.log('unites principales :', mains.join(' | '));
  const goMap = async () => {
    await page.evaluate(() => window.__q.nav.go({ name: 'welcome' }, { root: true }));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
    await page.waitForSelector('.m-svg .m-med');
    await page.waitForTimeout(900);
  };

  // 1. medaillons + segments
  await setProgress(4);
  await goMap();
  const meds = await page.$$eval('.m-svg .m-med', (els) => els.map((e) => e.dataset.id));
  check('11 medaillons (10 regions + Oaxaca)', meds.length === 10 && ['madrid', 'salamanca', 'sevilla', 'cdmx', 'oaxaca', 'valencia', 'baires', 'bogota', 'yucatan', 'cusco'].every((id) => meds.includes(id)), meds.join(','));
  const segs = await page.$$eval('.m-svg .m-seg', (els) => els.map((e) => e.dataset.from + '>' + e.dataset.to));
  const need = ['madrid>salamanca', 'salamanca>sevilla', 'sevilla>cdmx', 'cdmx>valencia', 'valencia>madrid', 'madrid>baires', 'baires>bogota', 'bogota>yucatan', 'yucatan>cusco', 'cdmx>oaxaca', 'oaxaca>valencia'];
  check('segments de route complets', need.every((s) => segs.includes(s)), segs.join(' '));
  await page.screenshot({ path: join(out, 'es-map-01-u05-current.png') });

  // 2. voyage du jeton u04 -> u05 (flags.travel) : on capture en cours de route
  await setProgress(4, 'cdmx:valencia');
  await page.evaluate(() => window.__q.nav.go({ name: 'welcome' }, { root: true }));
  await page.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
  await page.waitForSelector('.m-svg .m-token');
  const samples = [];
  let shot = false;
  for (let i = 0; i < 24; i++) {
    samples.push(await page.$eval('.m-svg .m-token', (e) => e.getAttribute('transform').replace('translate', '')));
    if (!shot && new Set(samples).size >= 6) { shot = true; await page.screenshot({ path: join(out, 'es-map-02-travel.png') }); }
    await page.waitForTimeout(400);
  }
  const distinct = new Set(samples).size;
  check('le jeton voyage de cdmx a valencia (positions distinctes)', distinct >= 4, `${distinct} positions : ${samples[0]} ... ${samples[samples.length - 1]}`);

  // 3. unites 5..10 : on avance la progression, on touche la region courante, l'ecran region s'ouvre
  for (let k = 4; k <= 9; k++) {
    await setProgress(k);
    await goMap();
    const cur = await page.evaluate(() => window.__q.content.main.find((u) => !window.__q.game.state.plumas[u.id])?.id);
    const region = await page.evaluate(() => document.querySelector('.m-svg .m-med.m-current')?.getAttribute('data-id'));
    await page.screenshot({ path: join(out, `es-map-u${String(k + 1).padStart(2, '0')}.png`) });
    await page.locator(`.m-svg .m-med-${region} .m-hit`).click({ force: true });
    await page.waitForTimeout(1500);
    const ok = await page.evaluate((id) => document.body.innerText.length > 40 && !document.querySelector('.m-svg') , cur);
    const quests = await page.evaluate(() => document.querySelectorAll('button, [role=button]').length);
    check(`u${String(k + 1).padStart(2, '0')} (${cur}) : region ${region} courante, ecran region ouvert`, ok && quests > 0 && cur === `u${String(k + 1).padStart(2, '0')}`);
    await page.screenshot({ path: join(out, `es-map-u${String(k + 1).padStart(2, '0')}-region.png`) });
  }
  check('aucune erreur JS', errors.length === 0, errors.join(' ; ').slice(0, 200));
} finally {
  await browser.close();
  server.close();
}
console.log(fails ? `${fails} ECHEC(S)` : 'OK');
process.exit(fails ? 1 : 0);
