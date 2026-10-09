// Captures de l'espace parent avec donnees simulees : tools/e2e/out/parent-*.png (ne vide pas out/).
// Pre-requis : npm run build. Usage : node tools/e2e/parent-shots.mjs
import { chromium } from 'playwright-core';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
mkdirSync(out, { recursive: true });
const demo = join(out, 'demo-state.json');

const gen = spawnSync(process.execPath, ['--no-warnings', '--experimental-transform-types', 'tools/e2e/make-demo-state.ts', demo], { cwd: root, encoding: 'utf8' });
console.log(gen.stdout.trim() || gen.stderr.slice(0, 400));
if (!existsSync(demo)) process.exit(1);

const PORT = 4181;
const ORIGIN = `http://localhost:${PORT}`;
const server = spawn(process.execPath, ['scripts/preview.mjs'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, hasTouch: true, locale: 'fr-FR', colorScheme: 'light' });
const page = await context.newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
let ok = true;
const check = (label, cond) => { ok &&= cond; console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`); };

try {
  await page.goto(`${ORIGIN}/maths/`);
  const gate = page.locator('.parent-access button');
  await gate.waitFor();
  // Appui long 3 s
  const box = await gate.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
  const label = await page.locator('label[for="parent-calc"]').innerText();
  const m = /(\d+)\s*×\s*(\d+)/.exec(label);
  check('appui long 3 s ouvre le petit calcul de grand', !!m);
  // Mauvaise reponse puis bonne
  await page.fill('#parent-calc', '1');
  await page.click('button:has-text("Entrer")');
  check('mauvaise reponse refusee', (await page.locator('.parent').count()) === 0);
  const label2 = await page.locator('label[for="parent-calc"]').innerText();
  const m2 = /(\d+)\s*×\s*(\d+)/.exec(label2);
  await page.fill('#parent-calc', String(Number(m2[1]) * Number(m2[2])));
  await page.click('button:has-text("Entrer")');
  await page.waitForSelector('.parent');
  check('bonne reponse : espace parent ouvert', true);

  // Import de la sauvegarde simulee via l'UI
  await page.click('role=tab[name="Réglages"]');
  await page.setInputFiles('input[type=file]', demo);
  await page.waitForSelector('.msg:has-text("Sauvegarde importée")');
  check('import JSON OK', true);
  await page.screenshot({ path: join(out, 'parent-settings.png') });

  await page.click('role=tab[name="Vue d\'ensemble"]');
  await page.locator('.maps .cell.fluent').first().click();
  await page.screenshot({ path: join(out, 'parent-overview.png'), fullPage: false });
  await page.locator('.parent').evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.screenshot({ path: join(out, 'parent-overview-chart.png') });
  check('carte de chaleur : 2 x 121 cases', (await page.locator('.maps .cell').count()) === 242);

  await page.click('role=tab[name="Zones"]');
  await page.screenshot({ path: join(out, 'parent-zones.png') });
  await page.click('role=tab[name="Historique"]');
  await page.screenshot({ path: join(out, 'parent-history.png') });
  // Fermeture + persistance
  await page.click('button:has-text("Fermer")');
  await page.reload();
  check('prenom persiste apres rechargement', (await page.inputValue('#child-name')) === 'Inès');
} finally {
  await browser.close();
  server.kill();
}
process.exit(ok ? 0 : 1);
