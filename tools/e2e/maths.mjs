// E2E Calcul Champion (1280x800, tactile) : parcours complet scripte avec screenshots dans tools/e2e/out/maths-*.png.
// Usage : node tools/e2e/maths.mjs [url]   (par defaut : build servi par scripts/preview.mjs sur 4179 ; ex. http://localhost:5173/maths/ pour le dev)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
mkdirSync(out, { recursive: true });
const arg = process.argv[2];
const PORT = 4179;
const URL = arg ?? `http://localhost:${PORT}/maths/`;
let server = null;
if (!arg) {
  server = spawn(process.execPath, ['scripts/preview.mjs'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 900));
}

const results = [];
const check = (label, ok, extra = '') => {
  results.push({ label, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => { errors.push(e.message); console.log('pageerror:', e.message); });
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_FAILED|net::/.test(m.text())) { errors.push(m.text()); console.log('console.error:', m.text()); } });

const shot = (name) => page.screenshot({ path: join(out, `maths-${name}.png`) });
const wait = (ms) => page.waitForTimeout(ms);

/** Lit le calcul affiche et renvoie la bonne reponse. */
async function readAnswer() {
  const txt = (await page.locator('.calc').first().innerText()).replace(/\s+/g, ' ').trim();
  const t = txt.replace(/−/g, '-').replace(/= \?$/, '').trim();
  let m = t.match(/^(\d+) \+ \? = (\d+)/);
  if (m) return { text: txt, answer: Number(m[2]) - Number(m[1]) };
  m = t.match(/^\? \+ (\d+) = (\d+)/);
  if (m) return { text: txt, answer: Number(m[2]) - Number(m[1]) };
  m = t.match(/^(\d+) ([+-]) (\d+)/);
  if (!m) throw new Error(`calcul illisible : "${txt}"`);
  const a = Number(m[1]), b = Number(m[3]);
  return { text: txt, answer: m[2] === '+' ? a + b : a - b };
}
async function typeNumber(n) {
  for (const d of String(n)) {
    const k = page.locator('.key:not([disabled])', { hasText: new RegExp(`^${d}$`) }).first();
    if (!(await k.count())) return;
    await k.click({ delay: 10, timeout: 4000 }).catch(() => {});
  }
}
/** Repond a la question courante : mode 'fast' (fluent), 'slow' (juste mais lent), 'wrong'. Renvoie le texte du calcul. */
async function answer(mode = 'fast') {
  if (!(await page.locator('.calc').count())) return '';
  const { text, answer: a } = await readAnswer();
  if (mode === 'slow') await wait(3400);
  const n = mode === 'wrong' ? (a + 1) % 100 : a;
  if (mode === 'wrong' && String(n).length !== String(a).length) { await typeNumber(a === 9 ? 8 : (a + 1) % 10 === 0 ? 1 : (a + 1) % 10); return text; }
  await typeNumber(n);
  return text;
}
async function waitCalcChange(prev, timeout = 8000) {
  await page.waitForFunction((p) => {
    const el = document.querySelector('.calc');
    return !el || el.innerText.replace(/\s+/g, ' ').trim() !== p;
  }, prev, { timeout });
}
async function skipCine(name, atMs = 1500) {
  await page.waitForSelector('.cine[data-state="playing"]', { timeout: 15000 });
  if (name) { await wait(atMs); await shot(name); }
  await wait(700);
  const skip = page.locator('.cine .skip');
  if (await skip.count()) await skip.click().catch(() => {});
  await page.waitForSelector('.cine', { state: 'detached', timeout: 12000 });
}
const click = (sel) => page.locator(sel).first().click();

try {
  await page.goto(URL);
  await page.evaluate(() => indexedDB.databases?.().then((dbs) => dbs.forEach((d) => indexedDB.deleteDatabase(d.name)))).catch(() => {});
  await page.reload();

  // ---------- 1. Premier lancement
  await page.waitForSelector('#child-name', { timeout: 15000 });
  await wait(700);
  await shot('01-setup-prenom');
  await page.fill('#child-name', 'Inès');
  await click('#btn-next');
  await page.waitForSelector('#club-name');
  await wait(500);
  await page.locator('.swatches .sw').nth(1).click();
  await page.locator('.swatches').nth(1).locator('.sw').nth(3).click();
  await page.locator('.patterns .pat').nth(2).click();
  await wait(500);
  await shot('02-setup-club');
  await click('#btn-next');
  await page.waitForSelector('#btn-start');
  await page.locator('.swatches .sw').nth(4).click();
  await page.locator('.patterns .pat').nth(1).click();
  await page.locator('.numrow .q').nth(1).click();
  await wait(1100);
  await shot('03-setup-joueur');
  check('création du club et du joueur', true);
  await click('#btn-start');
  await skipCine('04-cine-intro-club', 2200);
  check('cinématique intro-club jouée', true);

  // ---------- 2. Match de detection
  await page.waitForSelector('#btn-go');
  await wait(500);
  await shot('05-detection-intro');
  await click('#btn-go');
  await page.waitForSelector('.calc');
  for (let i = 0; i < 40; i++) {
    if (!(await page.locator('.calc').count())) break;
    const prev = (await page.locator('.calc').first().innerText()).replace(/\s+/g, ' ').trim();
    if (i === 3) await shot('06-detection-jeu');
    await answer(i < 14 ? 'fast' : 'wrong');
    await waitCalcChange(prev).catch(() => {});
    if (await page.locator('#btn-to-stadium').count()) break;
    await wait(80);
  }
  await page.waitForSelector('#btn-to-stadium, .cine', { timeout: 25000 });
  if (await page.locator('.cine').count()) await skipCine('07-cine-trophee-detection', 1500);
  await page.waitForSelector('#btn-to-stadium', { timeout: 15000 });
  await wait(600);
  await shot('08-detection-resultat');
  check('détection terminée, zone de départ affichée', (await page.locator('.zname').count()) === 1);
  await click('#btn-to-stadium');

  // ---------- 3. Accueil
  await page.waitForSelector('#btn-match');
  await wait(1400);
  await shot('09-accueil');
  check('accueil : MATCH, Sprint, Tirs au but, Entraînement', (await page.locator('#btn-match, #btn-sprint, #btn-penalties, #btn-training').count()) === 4);
  check('aucun accès de dev visible (pas de bouton "Tester la cinématique")', (await page.getByText('Tester la cinématique').count()) === 0);

  // ---------- 4. Match : bonnes (fluentes), lentes, mauvaises
  await click('#btn-match');
  await skipCine('10-cine-match-intro', 1800);
  await page.waitForSelector('.calc');
  await wait(400);
  await shot('11-match-jeu');
  let goalCine = false;
  const plan = ['fast', 'fast', 'slow', 'fast', 'wrong', 'fast', 'fast', 'slow', 'fast', 'wrong'];
  let n = 0;
  for (let i = 0; i < 60; i++) {
    if (await page.locator('.cine[data-state]').count()) {
      goalCine = true;
      await skipCine('12-cine-but', 1200);
      continue;
    }
    if (!(await page.locator('.calc').count())) {
      if (await page.locator('.cine').count() || await page.locator('#btn-home').count()) break;
      await wait(200); continue;
    }
    const prev = (await page.locator('.calc').first().innerText()).replace(/\s+/g, ' ').trim();
    const mode = plan[n % plan.length]; n++;
    await answer(mode);
    if (mode === 'fast' && n === 2) { await wait(330); await shot('13-match-but-en-jeu'); }
    if (mode === 'wrong' && n === 5) { await wait(500); await shot('14-match-erreur-indice'); }
    await waitCalcChange(prev, 12000).catch(() => {});
    await wait(60);
    if (await page.locator('.cine').count()) { goalCine = goalCine || true; }
    if (n > 40 && (await page.locator('.cine').count())) break;
  }
  check('cinématique goal jouée (1er but)', goalCine);
  // fin : full-time puis récompenses
  for (let i = 0; i < 30; i++) {
    if (await page.locator('#btn-home').count()) break;
    if (await page.locator('.cine[data-state]').count()) await skipCine(i === 0 ? '15-cine-full-time' : null, 2500);
    else await wait(300);
  }
  await page.waitForSelector('#btn-home', { timeout: 30000 });
  await wait(2200);
  await shot('16-recompenses');
  check('écran récompenses affiché', true);

  // paquet de cartes si disponible
  if (await page.locator('#btn-pack').count()) {
    await click('#btn-pack');
    await skipCine('17-cine-card-pack', 2000);
    await wait(900);
    await shot('18-nouvelle-carte');
    check('paquet ouvert : carte tirée', true);
  } else {
    console.log('INFO  pas assez d\'étoiles pour un paquet à ce stade');
  }
  await click('#btn-home');

  // ---------- 5. Album, Trophées, Joueur
  await page.waitForSelector('#btn-album');
  await click('#btn-album');
  await page.waitForSelector('.grid .slot');
  await wait(700);
  await shot('19-album');
  check('album : 48 emplacements', (await page.locator('.grid .slot').count()) === 48);
  await click('header button[aria-label="Retour"]');
  await page.waitForSelector('#btn-trophies');
  await click('#btn-trophies');
  await page.waitForSelector('.shelf');
  await wait(500);
  await shot('20-trophees');
  await click('header button[aria-label="Retour"]');
  await page.waitForSelector('#btn-avatar');
  await click('#btn-avatar');
  await page.waitForSelector('.items');
  await wait(600);
  await shot('21-avatar');
  await click('header button[aria-label="Retour"]');

  // ---------- 6. Sprint
  await page.waitForSelector('#btn-sprint');
  await click('#btn-sprint');
  await page.waitForSelector('.count', { timeout: 15000 });
  await wait(300);
  await shot('22-sprint-depart');
  await page.waitForSelector('.calc', { timeout: 10000 });
  for (let i = 0; i < 10; i++) {
    const prev = (await page.locator('.calc').first().innerText()).replace(/\s+/g, ' ').trim();
    if (i === 4) await shot('23-sprint-course');
    await answer(i === 6 ? 'wrong' : 'fast');
    await waitCalcChange(prev).catch(() => {});
    await wait(60);
  }
  await page.waitForSelector('.cine[data-state], #btn-home', { timeout: 15000 });
  if (await page.locator('.cine[data-state]').count()) { await skipCine('24-cine-medaille', 2000); check('médaille jouée', true); }
  await page.waitForSelector('#btn-home', { timeout: 15000 });
  await wait(1800);
  await shot('25-sprint-recompenses');
  await click('#btn-home');

  // ---------- 7. Tirs au but
  await page.waitForSelector('#btn-penalties');
  await click('#btn-penalties');
  await page.waitForSelector('.calc', { timeout: 15000 });
  await wait(300);
  await shot('26-tirs-au-but');
  const pen = ['fast', 'slow', 'wrong', 'fast', 'slow'];
  for (let i = 0; i < 5; i++) {
    const prev = (await page.locator('.calc').first().innerText()).replace(/\s+/g, ' ').trim();
    await answer(pen[i]);
    await wait(i === 0 ? 700 : i === 1 ? 650 : 850);
    await shot(`27-tirs-${['but', 'arret', 'capte', 'but2', 'arret2'][i]}`);
    if (i < 4) await waitCalcChange(prev, 9000).catch(() => {});
  }
  await page.waitForSelector('#btn-home', { timeout: 20000 });
  await click('#btn-home');

  // ---------- 8. Entrainement
  await page.waitForSelector('#btn-training');
  await click('#btn-training');
  await page.waitForSelector('.zcard');
  await wait(600);
  await shot('28-entrainement-zones');
  await click('#zone-1');
  await page.waitForSelector('#btn-practice');
  await wait(900);
  await shot('29-entrainement-coach');
  await click('#btn-practice');
  await page.waitForSelector('.calc', { timeout: 10000 });
  await wait(900);
  await shot('30-entrainement-indice');
  for (let i = 0; i < 15; i++) {
    if (!(await page.locator('.calc').count())) break;
    const prev = (await page.locator('.calc').first().innerText()).replace(/\s+/g, ' ').trim();
    if (i === 8) await shot('31-entrainement-indice-estompe');
    await answer(i === 2 ? 'wrong' : 'fast');
    await waitCalcChange(prev, 6000).catch(() => {});
    await wait(80);
  }
  await page.waitForSelector('#btn-home', { timeout: 15000 });
  await click('#btn-home');
  await page.waitForSelector('#btn-match');
  check('parcours complet jusqu\'au retour à l\'accueil', true);

  // ---------- 9. Hors-ligne (build uniquement)
  if (!arg) {
    const cached = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      for (let i = 0; i < 50 && !reg.active; i++) await new Promise((r) => setTimeout(r, 100));
      const need = ['cinematics/goal/index.html', 'cinematics/_shared/ceart.js', 'audio/sfx/tap.mp3', 'audio/fr/praise_1.mp3'];
      for (let i = 0; i < 150; i++) {
        const keys = await caches.keys();
        const urls = [];
        for (const k of keys) urls.push(...(await (await caches.open(k)).keys()).map((r) => r.url));
        if (need.every((x) => urls.some((u) => u.includes('/maths/' + x)))) return { ok: true, count: urls.length };
        await new Promise((r) => setTimeout(r, 200));
      }
      return { ok: false };
    });
    check(`SW : cinématiques, SFX et voix en précache (${cached.count ?? 0} entrées)`, cached.ok);
    await page.reload();
    await context.setOffline(true);
    await page.reload();
    await page.waitForSelector('#btn-match', { timeout: 15000 });
    check('hors-ligne : l\'accueil se recharge depuis le cache', true);
    await click('#btn-match');
    await skipCine(null);
    await page.waitForSelector('.calc', { timeout: 10000 });
    check('hors-ligne : match-intro + écran de match fonctionnent', true);
    await shot('32-hors-ligne-match');
    await context.setOffline(false);
  }
  check('aucune erreur JS', errors.length === 0, errors.slice(0, 3).join(' | '));
} catch (e) {
  check('exécution sans exception', false, String(e?.stack ?? e).split('\n').slice(0, 4).join(' | '));
  await shot('ERREUR').catch(() => {});
} finally {
  await browser.close();
  server?.kill();
}

const bad = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - bad}/${results.length} checks OK ; screenshots dans ${out}`);
process.exit(bad ? 1 : 0);
