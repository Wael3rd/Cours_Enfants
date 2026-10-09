// E2E espagnol : espace parent avec donnees simulees (import d'une sauvegarde), screenshots es-parent-*.png
// Usage : node tools/e2e/es-parent.mjs   (SKIP_BUILD=1 pour reutiliser tools/e2e/.es-dist)
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
const distRoot = join(import.meta.dirname, '.es-dist');
mkdirSync(out, { recursive: true });

if (!process.env.SKIP_BUILD) {
  const r = spawnSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
    cwd: join(root, 'apps', 'espagnol'),
    env: { ...process.env, CE_OUT_DIR: join(distRoot, 'espagnol') },
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ---------- serveur statique (/espagnol/...)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const PORT = 4181;
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

// ---------- sauvegarde simulee
const unitsDir = join(root, 'apps/espagnol/src/content/units');
const units = readdirSync(unitsDir).filter((f) => f.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(join(unitsDir, f), 'utf8')));
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return ymd(d); };

const quests = {};
units[0].quests.forEach((q, i) => (quests[q.id] = { done: true, stars: [3, 3, 2, 3, 1, 2, 3, 3][i % 8], bestAccuracy: [0.97, 0.95, 0.84, 0.93, 0.62, 0.81, 0.96, 0.94][i % 8], bestHints: i % 3, attempts: 1 + (i % 3), completedAt: daysAgo(9 - i) }));
units[1].quests.slice(0, 3).forEach((q, i) => (quests[q.id] = { done: true, stars: [3, 2, 2][i], bestAccuracy: [0.92, 0.85, 0.8][i], bestHints: 1, attempts: 1, completedAt: daysAgo(3 - i) }));
quests[units[1].quests[3].id] = { done: false, stars: 0, bestAccuracy: 0, bestHints: 0, attempts: 2 };

const srs = {};
const discovered = {};
units[0].vocab.slice(0, 30).forEach((v, i) => {
  discovered[v.id] = daysAgo(10);
  const seen = 3 + (i % 5);
  const wrong = i % 4 === 0 ? 3 : i % 7 === 0 ? 2 : 0;
  srs[`v:${v.id}`] = { ef: 2.3, reps: 1 + (i % 4), interval: [1, 3, 8, 21][i % 4], due: daysAgo(-(i % 6)), lapses: wrong ? 1 : 0, seen, wrong, last: daysAgo(1) };
});
const days = {};
for (let i = 0; i < 14; i++) {
  const ms = [0, 14, 9, 0, 22, 12, 7, 18, 11, 0, 16, 10, 20, 13][i] * 60000;
  if (ms) days[daysAgo(i)] = { ms, steps: Math.round(ms / 15000), correct: Math.round(ms / 22000), xp: Math.round(ms / 4000), ...(i % 2 === 0 ? { mission: true } : {}) };
}
const backup = {
  app: 'espagnol',
  version: 1,
  data: {
    profile: { name: 'Inès', avatar: { base: 'viajero', items: {} }, ficha: {} },
    settings: { dailyGoalMin: 10 },
    quests,
    plumas: { [units[0].id]: daysAgo(1) },
    xp: { escuchar: 210, hablar: 120, leer: 340, escribir: 150, cultura: 160 },
    srs,
    discovered,
    days,
    hints: { used: 14, steps: 120 },
    offline: { [units[0].id]: { status: 'ready', at: daysAgo(5), files: 485, bytes: 10_700_000 } },
  },
};
const backupPath = join(out, 'es-parent-backup.json');
writeFileSync(backupPath, JSON.stringify(backup));

// ---------- navigateur
const results = [];
const check = (label, ok, extra = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: 'block' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('response', (r) => r.status() >= 400 && !r.url().includes('/audio/es/') && errors.push(r.status() + ' ' + r.url()));

try {
  // l'espace parent s'ouvre depuis Ajustes (porte : appui long 3 s)
  const toSettings = async () => {
    await page.waitForFunction(() => window.__q);
    await page.evaluate(() => {
      const { game, nav } = window.__q;
      game.mutate((s) => { s.flags.prologue = '1'; s.profile.name ||= 'Test'; });
      nav.go({ name: 'settings' }, { root: true });
    });
    await page.waitForSelector('.set .gate button');
  };
  await page.goto(`${ORIGIN}/espagnol/?debug`);
  await toSettings();
  const gate = await page.locator('.set .gate button').boundingBox();
  await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1000);
  check('la porte parent ne s\'ouvre pas avant 3 s', (await page.locator('[data-testid=parent-space]').count()) === 0);
  await page.waitForTimeout(2400);
  await page.mouse.up();
  await page.waitForSelector('[data-testid=parent-space]');
  check('appui long 3 s -> espace parent', true);

  // etat vide
  await page.screenshot({ path: join(out, 'es-parent-00-vacio.png') });
  check('etat vide : 0 min', (await page.locator('[data-testid=kpis]').innerText()).includes('0 min'));

  // import de la sauvegarde simulee
  await page.click('[data-testid=tab-ajustes]');
  await page.setInputFiles('[data-testid=import]', backupPath);
  await page.waitForSelector('[data-testid=msg]');
  check('import de la sauvegarde', (await page.locator('[data-testid=msg]').innerText()).includes('restaurée'));
  check('prenom restaure', (await page.inputValue('[data-testid=name-input]')) === 'Inès');
  await page.screenshot({ path: join(out, 'es-parent-05-ajustes.png'), fullPage: false });
  const offlineTxt = await page.locator('[data-testid=offline]').innerText();
  check('audio hors-ligne : unite 1 marquee disponible', offlineTxt.includes('Disponible hors connexion'));

  await page.click('[data-testid=tab-resumen]');
  const kp = await page.locator('[data-testid=kpis]').innerText();
  check('resume : temps et mots', /\d+ h|\d+ min/.test(kp) && kp.includes('30'), kp.replace(/\s+/g, ' ').slice(0, 120));
  check('resume : 5 competences', (await page.locator('[data-testid=stats] li').count()) === 5);
  await page.screenshot({ path: join(out, 'es-parent-01-resumen.png') });
  // survol d'une barre
  const svg = await page.locator('figure svg[role=img]').boundingBox();
  await page.mouse.move(svg.x + 5, svg.y + 5);
  await page.mouse.move(svg.x + svg.width * 0.6, svg.y + svg.height * 0.5, { steps: 4 });
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(out, 'es-parent-01b-tooltip.png') });
  check('infobulle du graphique', (await page.locator('.tip').count()) === 1);

  await page.click('[data-testid=tab-progreso]');
  const firstUnit = page.locator('[data-testid=units] .unit').first();
  await firstUnit.locator('button.uhead').click();
  const utext = await firstUnit.innerText();
  check('progression : unite 1 terminee avec plume', utext.includes('Terminée') && utext.includes('plume'));
  const second = page.locator('[data-testid=units] .unit').nth(1);
  await second.locator('button.uhead').click();
  check('progression : unite 2 en cours (3 quetes)', (await second.innerText()).includes(`3/${units[1].quests.length}`));
  await page.screenshot({ path: join(out, 'es-parent-02-progreso.png') });

  await page.click('[data-testid=tab-dificiles]');
  const hard = await page.locator('[data-testid=hard] tbody tr').count();
  check('mots difficiles listes', hard >= 5, `${hard} lignes`);
  await page.screenshot({ path: join(out, 'es-parent-03-dificiles.png') });

  await page.click('[data-testid=tab-objetivos]');
  const sum = await page.locator('[data-testid=obj-sum]').innerText();
  check('objectifs A1+ : acquis/en cours/a venir', /✓ [1-9]/.test(sum) && /◐ [1-9]/.test(sum) && /○ \d+/.test(sum), sum);
  await page.screenshot({ path: join(out, 'es-parent-04-objetivos.png') });

  // persistance : recharger -> sauvegarde conservee
  await page.waitForTimeout(700);
  await page.reload();
  await toSettings();
  const g2 = await page.locator('.set .gate button').boundingBox();
  await page.mouse.move(g2.x + g2.width / 2, g2.y + g2.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
  await page.waitForSelector('[data-testid=parent-space]');
  check('persistance apres rechargement (IndexedDB)', (await page.locator('[data-testid=kpis]').innerText()).includes('mots découverts'));

  // mode sombre + tablette
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.screenshot({ path: join(out, 'es-parent-06-dark-tablet.png') });

  check('aucune erreur console / page', errors.length === 0, errors.slice(0, 3).join(' | '));
} catch (e) {
  console.log('ERREUR', e.message);
  results.push(false);
  await page.screenshot({ path: join(out, 'es-parent-error.png') }).catch(() => {});
} finally {
  await browser.close();
  server.close();
}
const failed = results.filter((x) => !x).length;
console.log(failed ? `\n${failed} echec(s)` : `\nTout est OK (${results.length} verifications)`);
process.exit(failed ? 1 : 0);
