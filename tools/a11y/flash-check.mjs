// Non-regression photosensibilite (politique "mouvement sur", docs/architecture.md) : flashs, eblouissements, scintillements.
//
//   npm run a11y:flash                                   # cinematiques maths + accueil maths (video Playwright 10 s, exige `npm run build`)
//   node tools/a11y/flash-check.mjs maths espagnol       # cibles : maths | espagnol | home | <dossier de composition> | --video <fichier>
//   node tools/a11y/flash-check.mjs maths --only goal,intro-club --json tools/a11y/out/maths.json
//   options : --report-only (code 0 meme en cas d'echec), --soft (cinematiques et accueil en "Animations douces"),
//             --dist <dossier> (autre build pour l'accueil, ex. comparaison avant/apres),
//             --fps 30, --jobs 4 (cinematiques en parallele), --home-seconds 10
//
// Cinematique : chaque image (30 i/s) est obtenue en positionnant la timeline (window.__player.renderSeek, comme le rendu
// HyperFrames) puis capturee en 192x120 (luminance relative). Accueil : etat injecte dans IndexedDB (accueil direct, sans
// cinematique de strategie), capture video par screencast (Playwright/CDP) 1280x800, MP4 de controle dans tools/a11y/out/.
// Analyse : tools/a11y/flash-core.mjs.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import sharp from 'sharp';
import { analyze, toLuminance } from './flash-core.mjs';

const root = resolve(import.meta.dirname, '..', '..');
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const FPS = Number(opt('--fps', 30));
const JOBS = Number(opt('--jobs', 4));
const SOFT = flag('--soft');
const ONLY = opt('--only', '')?.split(',').filter(Boolean) ?? [];
const HOME_S = Number(opt('--home-seconds', 10));
const valued = new Set(['--fps', '--jobs', '--only', '--json', '--video', '--home-seconds', '--save-frames', '--dist']);
const targets = argv.filter((a, i) => !a.startsWith('--') && !valued.has(argv[i - 1]));
if (!targets.length && !opt('--video')) targets.push('maths', 'home');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };

/** Serveur statique ; `fallback(path)` propose un 2e chemin (ex. ./_shared/ d'une composition -> _shared/ de l'app). */
function serve(dir, fallback) {
  const srv = createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    let p = join(dir, u);
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p) && fallback) p = join(dir, fallback(u));
    if (!p.startsWith(dir) || !existsSync(p) || statSync(p).isDirectory()) return void res.writeHead(404).end();
    res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
    createReadStream(p).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, () => ok({ srv, url: `http://localhost:${srv.address().port}` })));
}

/** Compositions d'une cible : dossier d'app -> [{ label, dir, id }]. */
function compositions(t) {
  if (t === 'maths' || t === 'espagnol') {
    const d = join(root, 'apps', t, 'public', 'cinematics');
    return readdirSync(d).filter((n) => n !== '_shared' && existsSync(join(d, n, 'index.html')) && (!ONLY.length || ONLY.includes(n)))
      .map((id) => ({ label: `${t}/${id}`, base: d, id }));
  }
  const d = resolve(t);
  return [{ label: basename(d), base: dirname(d), id: basename(d) }];
}

async function frameFromPng(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { y: toLuminance(data, info.width, info.height, 3), w: info.width, h: info.height };
}

/** Capture image par image d'une composition (timeline positionnee, pas de lecture en temps reel). */
async function captureComposition(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(url);
    await page.waitForFunction(() => window.__playerReady && window.__player, null, { timeout: 20000 });
    // "Animations douces" : meme effet que le canal "motion" envoye par l'app (compositions maths)
    if (SOFT) await page.evaluate(() => { if (window.CEArt?.setSoft && typeof window.build === 'function') { window.CEArt.setSoft(true); window.build(); } if (window.QCine?.setSoft) window.QCine.setSoft(true); });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1200, deviceScaleFactor: 0.1, mobile: false });
    const dur = await page.evaluate(() => window.__player.getDuration());
    const frames = [];
    let w = 0, h = 0;
    // garde-fou : une image qui ne se rend pas en 15 s (composition bloquee) arrete la capture avec une erreur
    const guard = (p, what) => Promise.race([p, new Promise((_, ko) => setTimeout(() => ko(new Error(`${what} bloque (> 15 s)`)), 15000))]);
    for (let i = 0; i <= Math.floor(dur * FPS); i++) {
      const t = Math.min(i / FPS, dur - 0.001);
      await guard(page.evaluate(async (t) => {
        const r = window.__player.renderSeek ? window.__player.renderSeek(t) : window.__player.seek(t);
        if (r && r.then) await r;
      }, t), `positionnement a ${t.toFixed(2)} s`);
      const s = await guard(cdp.send('Page.captureScreenshot', { format: 'png' }), `capture a ${t.toFixed(2)} s`);
      const f = await frameFromPng(Buffer.from(s.data, 'base64'));
      frames.push(f.y); w = f.w; h = f.h;
    }
    return { frames, w, h, errors };
  } finally {
    await page.close();
  }
}

/** Video -> images de luminance via ffmpeg (fps fixe, 160x100). */
function decodeVideo(file, skip = 0) {
  const w = 160, h = 100;
  const r = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(skip), '-i', file, '-vf', `fps=${FPS},scale=${w}:${h}:flags=area`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`ffmpeg : ${r.stderr?.toString().slice(0, 300)}`);
  const frames = [];
  for (let o = 0; o + w * h * 3 <= r.stdout.length; o += w * h * 3) frames.push(toLuminance(r.stdout.subarray(o, o + w * h * 3), w, h, 3));
  return { frames, w, h };
}

/**
 * Accueil de l'app maths : etat injecte (accueil direct, sans cinematique de strategie), capture video Playwright par
 * screencast CDP (images horodatees, reechantillonnees a FPS) pendant HOME_S secondes ; video MP4 de controle si ffmpeg.
 */
async function captureHome(browser) {
  const dist = resolve(opt('--dist', join(root, 'dist')));
  if (!existsSync(join(dist, 'maths', 'index.html'))) throw new Error("dist/maths absent : lancer `npm run build` avant le controle de l'accueil");
  const { srv, url } = await serve(dist);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, serviceWorkers: 'block' });
  try {
    const page = await ctx.newPage();
    await page.goto(`${url}/maths/`);
    await page.evaluate(async (soft) => {
      const data = { setupDone: true, placementDone: true, childName: 'Léo', strategySeen: [1, 2, 3, 4, 5, 6, 7, 8, 9], settings: { music: false, sound: false, voice: false, softMotion: soft } };
      await new Promise((ok, ko) => {
        const req = indexedDB.open('keyval-store');
        req.onupgradeneeded = () => req.result.createObjectStore('keyval');
        req.onsuccess = () => {
          const tx = req.result.transaction('keyval', 'readwrite');
          tx.objectStore('keyval').put({ app: 'maths', version: 3, data }, 'ce:maths');
          tx.oncomplete = () => { req.result.close(); ok(); };
          tx.onerror = () => ko(tx.error);
        };
        req.onerror = () => ko(req.error);
      });
    }, SOFT);
    await page.goto('about:blank');
    const cdp = await ctx.newCDPSession(page);
    const shots = [];
    cdp.on('Page.screencastFrame', (f) => {
      shots.push({ t: f.metadata.timestamp, data: f.data });
      cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
    });
    await page.goto(`${url}/maths/`, { waitUntil: 'commit' });
    await cdp.send('Page.startScreencast', { format: 'png', maxWidth: 320, maxHeight: 200, everyNthFrame: 1 });
    await page.waitForSelector('#btn-match', { timeout: 15000 });
    const shown = Date.now() / 1000;
    await page.waitForTimeout(HOME_S * 1000 + 300);
    await cdp.send('Page.stopScreencast');
    // de l'apparition de l'accueil (-0,2 s) a +HOME_S s : a chaque 1/FPS, la derniere image recue (horodatage du screencast, s epoch)
    const t0 = Math.max(shots[0].t, shown - 0.2);
    const idx = [];
    for (let i = 0, j = 0; i < Math.round(HOME_S * FPS); i++) {
      while (j + 1 < shots.length && shots[j + 1].t <= t0 + i / FPS) j++;
      idx.push(j);
    }
    const lum = new Map();
    for (const j of new Set(idx)) {
      const { data, info } = await sharp(Buffer.from(shots[j].data, 'base64')).resize(320, 200, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      lum.set(j, toLuminance(data, info.width, info.height, 3));
    }
    const frames = idx.map((j) => lum.get(j));
    const outDir = join(root, 'tools', 'a11y', 'out');
    mkdirSync(outDir, { recursive: true });
    const mp4 = join(outDir, `accueil${SOFT ? '-doux' : ''}.mp4`);
    const ff = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-pix_fmt', 'yuv420p', '-vf', 'scale=320:200', mp4],
      { input: Buffer.concat(idx.map((j) => Buffer.from(shots[j].data, 'base64'))), maxBuffer: 1 << 28 });
    const file = ff.status === 0 ? mp4 : null;
    const w = 320, h = 200; // 1/4 de la definition CSS : les petits eclats (flashs de foule) restent mesurables
    return { frames, w, h, errors: [], file };
  } finally {
    await ctx.close();
    srv.close();
  }
}

/** --save-frames <dir> : garde les images de luminance (Float32, w*h par image) pour recalibrer l'analyse sans recapturer. */
function saveFrames(label, cap) {
  const dir = opt('--save-frames');
  if (!dir) return;
  mkdirSync(resolve(dir), { recursive: true });
  const name = label.replace(/[\/]/g, '__');
  const all = new Float32Array(cap.frames.length * cap.w * cap.h);
  cap.frames.forEach((f, i) => all.set(f, i * cap.w * cap.h));
  writeFileSync(join(resolve(dir), `${name}.f32`), Buffer.from(all.buffer));
  writeFileSync(join(resolve(dir), `${name}.json`), JSON.stringify({ w: cap.w, h: cap.h, fps: FPS, n: cap.frames.length }));
}

function row(label, r) {
  const v = r.error ? 'ERREUR' : r.ok ? 'OK' : 'ECHEC';
  const f = r.error ? '' : `${String(r.flashes.maxPerSecond).padStart(4)} flash/s | ${String(r.glare.events.length).padStart(2)} eblouis. (max +${r.glare.maxMeanRise.toFixed(2)}) | ${String(r.blinks.maxPerSecond).padStart(3)} eclats/s`;
  console.log(`${v.padEnd(6)} ${label.padEnd(40)} ${f}`);
  for (const m of r.failures ?? []) console.log(`         - ${m}`);
  for (const m of r.warnings ?? []) console.log(`         ~ ${m}`);
  if (r.error) console.log(`         - ${r.error}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const results = {};
try {
  console.log(`Controle photosensibilite (${FPS} i/s${SOFT ? ", animations douces" : ""}) : echec si flash general > 3/s ou eblouissement ; scintillement = indicateur
`);
  const servers = new Map();
  const jobs = [];
  for (const t of targets) {
    if (t === 'home') continue;
    for (const c of compositions(t)) jobs.push(c);
  }
  // cinematiques en parallele (un onglet par composition)
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const c = jobs[next++];
      if (!servers.has(c.base)) servers.set(c.base, serve(c.base, (u) => u.replace(/^\/[^/]+\/_shared\//, '/_shared/')));
      const { url } = await servers.get(c.base);
      try {
        const cap = await captureComposition(browser, `${url}/${c.id}/index.html`);
        saveFrames(c.label, cap);
        results[c.label] = analyze(cap.frames, { w: cap.w, h: cap.h, fps: FPS });
        if (cap.errors.length) results[c.label].pageErrors = cap.errors;
      } catch (e) {
        results[c.label] = { ok: false, error: String(e.message ?? e) };
      }
      row(c.label, results[c.label]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(JOBS, jobs.length) }, worker));
  for (const s of servers.values()) (await s).srv.close();

  if (targets.includes('home')) {
    try {
      const cap = await captureHome(browser);
      saveFrames('maths/accueil', cap);
      results['maths/accueil'] = analyze(cap.frames, { w: cap.w, h: cap.h, fps: FPS });
      if (cap.file) results['maths/accueil'].video = cap.file;
    } catch (e) {
      results['maths/accueil'] = { ok: false, error: String(e.message ?? e) };
    }
    row('maths/accueil (video 10 s)', results['maths/accueil']);
  }
  const vid = opt('--video');
  if (vid) {
    const cap = decodeVideo(resolve(vid));
    results[basename(vid)] = analyze(cap.frames, { w: cap.w, h: cap.h, fps: FPS });
    row(basename(vid), results[basename(vid)]);
  }
} finally {
  await browser.close();
}

const bad = Object.entries(results).filter(([, r]) => !r.ok);
console.log(`\n${Object.keys(results).length - bad.length}/${Object.keys(results).length} conformes${bad.length ? ' ; a corriger : ' + bad.map(([k]) => k).join(', ') : ''}`);
const json = opt('--json');
if (json) {
  mkdirSync(dirname(resolve(json)), { recursive: true });
  writeFileSync(resolve(json), JSON.stringify(results, null, 2));
}
process.exit(bad.length && !flag('--report-only') ? 1 : 0);
