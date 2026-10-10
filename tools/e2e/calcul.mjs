// Captures « Calcul — Entrainement » (1280x800 tactile + portrait) : accueil, explication, calcul, erreur, fin.
// Usage : node tools/e2e/calcul.mjs [url]  (build servi par scripts/preview.mjs sur 4180). Sortie : tools/e2e/out/calcul-*.png
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
mkdirSync(out, { recursive: true });
const PORT = 4180;
const BASE = process.argv[2] ?? `http://localhost:${PORT}/calcul/`;
let server = null;
if (!process.argv[2]) {
  server = spawn(process.execPath, ['scripts/preview.mjs'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 900));
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const results = [];
const check = (label, ok) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`); };

async function newPage(viewport) {
  const context = await browser.newContext({ viewport, hasTouch: true });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|net::/.test(m.text())) errors.push(m.text()); });
  await page.goto(BASE);
  await page.waitForSelector('.home');
  return page;
}
const shot = (page, name) => page.screenshot({ path: join(out, `calcul-${name}.png`) });

async function answerOf(page) {
  const txt = (await page.locator('.calc').first().textContent()).replace(/\s+/g, ' ').trim().replace(/−/g, '-');
  let m = txt.match(/^(\d+) \+ \? = (\d+)/) ;
  if (m) return Number(m[2]) - Number(m[1]);
  m = txt.match(/^(\d+) ([+-]) (\d+)/);
  if (!m) throw new Error(`calcul illisible : ${txt}`);
  return m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
}
async function type(page, n) {
  for (const d of String(n)) await page.locator('.key', { hasText: new RegExp(`^${d}$`) }).first().dispatchEvent('pointerdown');
}

// ---- paysage
const page = await newPage({ width: 1280, height: 800 });
await shot(page, 'home');
const keyH = await (async () => { await page.goto(BASE); return 0; })();
void keyH;
await page.waitForSelector('.home');
await page.locator('.card', { hasText: 'Les doubles' }).click();
await page.waitForSelector('.explain');
await shot(page, 'explain');
await page.getByRole('button', { name: 'Commencer' }).click();
await page.waitForSelector('.calc');
const box = await page.locator('.key').first().boundingBox();
check(`touches >= 88 px (${Math.round(box.width)}x${Math.round(box.height)})`, box.width >= 88 && box.height >= 88);
await type(page, await answerOf(page));
await page.waitForTimeout(120);
await shot(page, 'ok');
await page.waitForTimeout(800);
const good = await answerOf(page);
await type(page, (good + 1) % 100); // erreur volontaire
await page.waitForTimeout(250);
await shot(page, 'error');
await page.waitForTimeout(1800);
// finir la serie
for (let i = 0; i < 40; i++) {
  if (await page.locator('.end').count()) break;
  if (!(await page.locator('.calc .slot').count())) break;
  await page.waitForFunction(() => !document.querySelector('.msg'), null, { timeout: 4000 }).catch(() => {});
  if (await page.locator('.end').count()) break;
  await type(page, await answerOf(page));
  await page.waitForTimeout(800);
}
await page.waitForSelector('.end', { timeout: 15000 });
await shot(page, 'end');
check('ecran de fin', await page.locator('.end .stat').count() >= 2);
await page.getByRole('button', { name: 'Retour' }).click();
await page.waitForSelector('.home');
await shot(page, 'home-after');

// defi vitesse + reglages (appui long)
await page.locator('.special', { hasText: 'Défi vitesse' }).click();
await page.waitForSelector('.clock');
await shot(page, 'sprint');
await page.getByRole('button', { name: /Quitter/ }).click();
await page.waitForSelector('.home');
const gear = page.locator('.gear');
const gb = await gear.boundingBox();
await page.mouse.move(gb.x + 20, gb.y + 20);
await page.mouse.down();
await page.waitForTimeout(2200);
await page.mouse.up();
check('reglages par appui long', (await page.locator('[role=dialog]').count()) === 1);
await shot(page, 'settings');

// ---- portrait
const portrait = await newPage({ width: 800, height: 1280 });
await shot(portrait, 'home-portrait');
await portrait.locator('.card', { hasText: 'Passer la dizaine' }).click();
await portrait.getByRole('button', { name: 'Commencer' }).click();
await portrait.waitForSelector('.calc');
await shot(portrait, 'calc-portrait');

check('aucune erreur JS', errors.length === 0);
if (errors.length) console.log(errors);
await browser.close();
server?.kill();
process.exit(results.every(Boolean) ? 0 : 1);
