// Mesure de fluidite "tablette" de Calcul Champion : temps entre images (requestAnimationFrame) sur l'accueil et pendant
// des cinematiques jouees par-dessus l'accueil (comme dans l'app), CPU ralenti 4x (CDP Emulation.setCPUThrottlingRate),
// 1280x800 CSS a 1,5 dppx (tablette Android 10" 1920x1200). Exige `npm run build` (sert dist/).
//
//   npm run perf:frames                                   # accueil + intro-club, goal, match-intro
//   node tools/perf/frame-times.mjs --cines intro-club,goal --rate 4 --dsf 1.5 --seconds 8 --runs 3 --json tools/perf/out/x.json [--soft] [--dist <dossier>]
//
// Objectif : p95 < 20 ms. Chiffres comparables entre eux (meme machine, meme Chrome headless), pas des mesures absolues de
// tablette. La machine de dev est souvent chargee : --runs N rejoue tout N fois et garde la mediane de chaque indicateur ;
// comparer deux versions en alternant les lancements (--dist <autre build>).
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const RATE = Number(opt('--rate', 4));
const DSF = Number(opt('--dsf', 1.5));
const SECONDS = Number(opt('--seconds', 8));
const CINES = opt('--cines', 'intro-club,goal,match-intro').split(',').filter(Boolean);
const SOFT = argv.includes('--soft');
const RUNS = Number(opt('--runs', 1));

const dist = resolve(opt('--dist', join(root, 'dist')));
if (!existsSync(join(dist, 'maths', 'index.html'))) { console.error('dist/maths absent : lancer `npm run build`'); process.exit(2); }
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const srv = createServer((req, res) => {
  let p = join(dist, decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!p.startsWith(dist) || !existsSync(p)) return void res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise((ok) => srv.listen(0, ok));
const BASE = `http://localhost:${srv.address().port}/maths/`;

function stats(d) {
  const s = [...d].sort((a, b) => a - b), q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  const sum = d.reduce((a, b) => a + b, 0);
  return { frames: d.length, fps: +(1000 * d.length / sum).toFixed(1), p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), p99: +q(0.99).toFixed(1), max: +s[s.length - 1].toFixed(1),
    over20: +(100 * d.filter((x) => x > 20).length / d.length).toFixed(1), over33: +(100 * d.filter((x) => x > 33.4).length / d.length).toFixed(1) };
}

/** Enregistre les intervalles rAF de la page pendant `ms` (ou jusqu'a ce que `until()` soit vrai). */
const RECORD = `window.__ft = { d: [], on: false, start() { this.d = []; this.on = true; let last = performance.now();
  const loop = (t) => { if (!this.on) return; this.d.push(t - last); last = t; requestAnimationFrame(loop); }; requestAnimationFrame((t) => { last = t; requestAnimationFrame(loop); }); },
  stop() { this.on = false; return this.d.slice(1); } };`;

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const runs = [];
const show = (k, s) => console.log(k.padEnd(22), String(s.frames).padStart(6), String(s.fps).padStart(5), ...['p50', 'p95', 'p99', 'max'].map((x) => String(s[x]).padStart(6)), `${s.over20}%`.padStart(7), `${s.over33}%`.padStart(6));
console.log(`CPU /${RATE}, 1280x800 @${DSF}x${SOFT ? ', animations douces' : ''}, ${RUNS} passage(s)
`);
console.log('scenario'.padEnd(22), 'images  fps    p50    p95    p99    max   >20ms  >33ms');
for (let run = 0; run < RUNS; run++) {
const results = {};
runs.push(results);
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: DSF, hasTouch: true, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.goto(BASE);
  await page.evaluate(async (soft) => {
    const data = { setupDone: true, placementDone: true, childName: 'Léo', strategySeen: [1, 2, 3, 4, 5, 6, 7, 8, 9], settings: { music: false, sound: false, voice: false, softMotion: soft } };
    await new Promise((ok, ko) => {
      const req = indexedDB.open('keyval-store');
      req.onupgradeneeded = () => req.result.createObjectStore('keyval');
      req.onsuccess = () => { const tx = req.result.transaction('keyval', 'readwrite'); tx.objectStore('keyval').put({ app: 'maths', version: 3, data }, 'ce:maths'); tx.oncomplete = () => { req.result.close(); ok(); }; tx.onerror = () => ko(tx.error); };
      req.onerror = () => ko(req.error);
    });
  }, SOFT);
  await page.addInitScript(RECORD);
  await page.reload();
  await page.waitForSelector('#btn-match', { timeout: 20000 });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
  await page.waitForTimeout(1500); // entree de l'ecran terminee

  console.log(`CPU /${RATE}, 1280x800 @${DSF}x${SOFT ? ', animations douces' : ''}\n`);
  console.log('scenario'.padEnd(22), 'images  fps    p50    p95    p99    max   >20ms  >33ms');
  const show = (k, s) => console.log(k.padEnd(22), String(s.frames).padStart(6), String(s.fps).padStart(5), ...['p50', 'p95', 'p99', 'max'].map((x) => String(s[x]).padStart(6)), `${s.over20}%`.padStart(7), `${s.over33}%`.padStart(6));

  await page.evaluate(() => window.__ft.start());
  await page.waitForTimeout(SECONDS * 1000);
  results.accueil = stats(await page.evaluate(() => window.__ft.stop()));
  if (RUNS === 1) show('accueil', results.accueil);

  for (const id of CINES) {
    // meme montage que Cinematic.svelte (overlay plein ecran, cadre 16:9, <hyperframes-player>) par-dessus l'accueil vivant
    const ok = await page.evaluate(async (src) => {
      if (!customElements.get('hyperframes-player')) return 'player non enregistre';
      const o = document.createElement('div');
      o.id = '__perfcine';
      o.style.cssText = 'position:fixed;inset:0;z-index:3000;display:grid;place-items:center;background:#000';
      o.innerHTML = `<div style="width:min(100vw,calc(100vh*16/9));aspect-ratio:16/9"><hyperframes-player src="${src}" width="1920" height="1080" style="display:block;width:100%;height:100%"></hyperframes-player></div>`;
      document.body.appendChild(o);
      const p = o.querySelector('hyperframes-player');
      return await new Promise((res) => {
        const to = setTimeout(() => res('timeout'), 30000);
        p.addEventListener('ready', () => { clearTimeout(to); res('ok'); }, { once: true });
      });
    }, `${BASE}cinematics/${id}/index.html`);
    if (ok !== 'ok') { console.log(id.padEnd(22), ok); continue; }
    if (SOFT) await page.evaluate(() => document.querySelector('#__perfcine hyperframes-player').setRuntimeData('motion', { soft: true }));
    await page.waitForTimeout(500);
    const d = await page.evaluate(async () => {
      const p = document.querySelector('#__perfcine hyperframes-player');
      window.__ft.start();
      p.play();
      await new Promise((res) => { p.addEventListener('ended', res, { once: true }); setTimeout(res, 15000); });
      const r = window.__ft.stop();
      document.getElementById('__perfcine').remove();
      return r;
    });
    results[id] = stats(d);
    if (RUNS === 1) show(id, results[id]);
    await page.waitForTimeout(800);
  }
  await ctx.close();
} catch (e) {
  console.log('erreur :', e.message);
}
}
await browser.close();
srv.close();
// mediane par scenario et par indicateur
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const results = {};
for (const k of Object.keys(runs[0] ?? {})) {
  const all = runs.map((r) => r[k]).filter(Boolean);
  results[k] = Object.fromEntries(Object.keys(all[0]).map((m) => [m, med(all.map((x) => x[m]))]));
  if (RUNS > 1) show(k, results[k]);
}
const json = opt('--json');
if (json) { mkdirSync(dirname(resolve(json)), { recursive: true }); writeFileSync(resolve(json), JSON.stringify({ rate: RATE, dsf: DSF, soft: SOFT, runs: RUNS, dist, results, all: runs }, null, 2)); }
const worst = Math.max(...Object.values(results).map((s) => s.p95));
console.log(`
p95 le plus haut : ${worst} ms (objectif < 20 ms)`);
