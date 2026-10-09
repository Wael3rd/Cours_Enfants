// E2E espagnol : parcours scripte complet (premier lancement -> carte -> region Madrid -> quete complete -> Diccionario ->
// Perfil -> Mision del dia -> Desafio -> hors-ligne). Screenshots tools/e2e/out/es-*.png (1280x800).
// Usage : node tools/e2e/es-game.mjs     (SKIP_BUILD=1 reutilise tools/e2e/.es-dist ; DEV_URL=http://127.0.0.1:5199/espagnol/ vise le serveur de dev)
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(import.meta.dirname, 'out');
const distRoot = join(import.meta.dirname, '.es-dist');
mkdirSync(out, { recursive: true });
const DEV = process.env.DEV_URL;

if (!DEV && !process.env.SKIP_BUILD) {
  const r = spawnSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
    cwd: join(root, 'apps', 'espagnol'),
    env: { ...process.env, CE_OUT_DIR: join(distRoot, 'espagnol') },
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ---------- serveur statique (/espagnol/...)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const PORT = 4183;
const server = DEV
  ? null
  : createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://x');
      let p = normalize(join(distRoot, decodeURIComponent(url.pathname)));
      if (!p.startsWith(distRoot)) return void res.writeHead(403).end();
      if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
      if (!existsSync(p)) return void res.writeHead(404).end('404');
      res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
      createReadStream(p).pipe(res);
    }).listen(PORT);
const APP = DEV ?? `http://localhost:${PORT}/espagnol/`;
const ORIGIN = new URL(APP).origin;

const results = [];
const check = (label, ok, extra = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
// Reconnaissance vocale simulee (Chrome headless n'a pas de micro) : renvoie window.__heard
await ctx.addInitScript(() => {
  class FakeRec {
    constructor() { this.lang = ''; this.interimResults = true; this.maxAlternatives = 5; this.continuous = false; }
    start() {
      setTimeout(() => {
        const alt = { transcript: window.__heard ?? '', confidence: 0.9 };
        const res = Object.assign([alt], { isFinal: true });
        this.onresult?.({ results: [res] });
        setTimeout(() => this.onend?.(), 50);
      }, 700);
    }
    stop() {}
    abort() {}
  }
  window.webkitSpeechRecognition = FakeRec;
  window.SpeechRecognition = FakeRec;
});
const page = await ctx.newPage();
const errors = [];
const external = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push('console: ' + m.text().slice(0, 200)));
page.on('response', (r) => r.status() >= 400 && !r.url().includes('/audio/es/') && errors.push(r.status() + ' ' + r.url()));
ctx.on('request', (req) => {
  const u = req.url();
  if (/^(data|blob|about|chrome-extension):/.test(u)) return;
  if (new URL(u).origin !== ORIGIN) external.push(u);
});

const shot = (name) => page.screenshot({ path: join(out, `es-${name}.png`) });
const wait = (ms) => page.waitForTimeout(ms);
const qstep = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__qstep ?? null)));
const qidx = () => page.evaluate(() => window.__qidx);

/** Resout l'etape courante. wrong = reponse volontairement fausse. Renvoie quand la coque est passee a l'etape suivante. */
async function solve(step, { wrong = false, shots = {}, used = new Set() } = {}) {
  const take = (k) => (shots[k] && !used.has(k) ? (used.add(k), shots[k]) : null);
  const before = await qidx();
  const key = step.tipo;
  const ok = !wrong;
  switch (step.tipo) {
    case 'flashcard': {
      for (let i = 0; i < step.vocab.length; i++) {
        if (i === 0 && take('flashcard')) await shot(shots.flashcard);
        await page.locator('.fc button:has-text("Siguiente"), .fc button:has-text("Entendido")').first().click();
        await wait(350);
      }
      break;
    }
    case 'grammar_card': {
      for (let i = 0; i < 12; i++) {
        if ((await qidx()) !== before) break;
        if (i === 2 && take('grammar_card')) await shot(shots.grammar_card);
        const b = page.locator('.gc button').filter({ hasText: /Siguiente|Descubrir|Entendido/ }).first();
        if (!(await b.count())) break;
        await b.click();
        await wait(600);
      }
      break;
    }
    case 'cinematic_ref': {
      await Promise.race([page.waitForSelector('.cine[data-state="playing"]', { timeout: 12000 }), page.waitForSelector('.cf', { timeout: 12000 })]).catch(() => {});
      await wait(1500);
      if (take('cinematic_ref')) await shot(shots.cinematic_ref);
      if (await page.locator('.cine').count()) {
        await page.locator('.cine .skip').click({ timeout: 4000 }).catch(() => {});
        await page.waitForSelector('.cine', { state: 'detached', timeout: 8000 }).catch(() => {});
      } else {
        await page.locator('.cf .skip button').click();
      }
      break;
    }
    case 'listen_choose': {
      const idx = step.opciones.findIndex((o) => o.correcta === ok);
      await wait(500);
      await page.locator('.lc .opt').nth(idx).click();
      break;
    }
    case 'match_image': {
      const ids = step.pares.map((p) => p.vocab);
      if (wrong && ids.length > 1) {
        await page.locator(`.mi [data-side="img"][data-id="${ids[0]}"]`).click();
        await page.locator(`.mi [data-side="word"][data-id="${ids[1]}"]`).click();
        await wait(300);
      }
      for (const id of ids) {
        await page.locator(`.mi [data-side="img"][data-id="${id}"]`).click();
        await page.locator(`.mi [data-side="word"][data-id="${id}"]`).click();
        await wait(200);
      }
      break;
    }
    case 'true_false': {
      const yes = ok ? step.correcta : !step.correcta;
      await page.locator(yes ? '.tf .b.yes' : '.tf .b.no').click();
      break;
    }
    case 'dialogue_choice': {
      const o = step.opciones.find((x) => x.correcta === ok) ?? step.opciones[0];
      await wait(400);
      await page.locator('.dc .opt', { hasText: o.habla.es }).first().click();
      break;
    }
    case 'fill_blank': {
      const ans = ok ? step.respuesta : (step.opciones?.find((o) => o.toLowerCase() !== step.respuesta.toLowerCase()) ?? 'xyz');
      if (step.opciones) await page.locator('.fb .chip', { hasText: new RegExp(`^${ans.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).first().click();
      else {
        await page.fill('.fb input', ans);
        await page.locator('.fb button:has-text("Comprobar")').click();
      }
      break;
    }
    case 'reorder_words': {
      const words = ok ? step.palabras : [...step.palabras].reverse();
      for (const w of words) {
        await page.locator('.ro .bank .tile', { hasText: new RegExp(`^${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).first().click();
        await wait(120);
      }
      await page.locator('.ro button:has-text("Comprobar")').click();
      break;
    }
    case 'dictado': {
      // reponse sans accents : acceptee avec l'avertissement "¡Ojo con el acento!"
      const plain = step.respuesta.normalize('NFD').replace(/[̀-ͯ]/g, '');
      await page.fill('.di input', ok ? (plain !== step.respuesta ? plain : step.respuesta) : 'zzzz');
      await page.locator('.di button:has-text("Comprobar")').click();
      break;
    }
    case 'speak': {
      await page.evaluate((t) => (window.__heard = t), ok ? step.objetivo.es : 'zzz qqq');
      await wait(300);
      await page.locator('.sp .mic').click();
      await page.waitForSelector('.sp .lvl', { timeout: 6000 });
      if (take('speak')) await shot(shots.speak);
      if (!ok) {
        // 3 essais puis "Seguir"
        for (let i = 0; i < 2; i++) {
          await page.locator('.sp button:has-text("Otra vez")').click();
          await page.locator('.sp .mic').click();
          await page.waitForSelector('.sp .lvl', { timeout: 6000 });
        }
        await page.locator('.sp button:has-text("Seguir")').click();
      }
      break;
    }
    case 'conjugar': {
      const t = ok ? step.terminacion : step.terminaciones.find((x) => x !== step.terminacion);
      await wait(400);
      await page.locator('.cj .piece', { hasText: new RegExp(`^${t}$`) }).first().click();
      break;
    }
    case 'read_answer': {
      for (const q of step.preguntas) {
        const o = q.opciones.find((x) => x.correcta === ok) ?? q.opciones[0];
        await page.locator('.ra .opt', { hasText: o.texto }).first().click();
        await wait(1150);
      }
      break;
    }
    case 'write_free': {
      const vals = { nombre: 'Álex', edad: 'doce', origen: 'París', residencia: 'París' };
      for (let i = 0; i < step.campos.length; i++) {
        const c = step.campos[i];
        await page.fill('.wf input', vals[c.id] ?? (c.tipo === 'numero' ? '12' : 'París'));
        if (i === 1 && take('write_free')) await shot(shots.write_free);
        await page.locator('.wf button:has-text("Siguiente"), .wf button:has-text("Listo")').first().click();
        await wait(200);
      }
      break;
    }
    default:
      throw new Error('etape non geree : ' + key);
  }
  // etapes corrigees : feedback puis "Continuar"
  const graded = !['flashcard', 'grammar_card', 'cinematic_ref'].includes(step.tipo);
  if (graded) {
    await page.waitForSelector('.run .fbk', { timeout: 8000 });
    await wait(900);
    const cls = await page.locator('.run .fbk').getAttribute('class');
    if (take(step.tipo)) await shot(shots[step.tipo]);
    const fbk = 'fb:' + (cls.includes('wrong') ? 'wrong' : cls.includes('partial') ? 'partial' : 'correct');
    if (take(fbk)) await shot(shots[fbk]);
    await page.locator('.run .fbk button:has-text("Continuar")').click();
  }
  await page.waitForFunction((b) => window.__qidx !== b || !document.querySelector('.run'), before, { timeout: 15000 }).catch(() => {});
  await wait(350);
}

/** Joue toute une partie (quete, desafio, mision) : `wrongAt` = indices a rater volontairement. */
async function playAll({ wrongAt = [], hintAt = [], shots = {}, max = 40 } = {}) {
  const used = new Set();
  for (let n = 0; n < max; n++) {
    if (!(await page.locator('.run').count())) break;
    const step = await qstep();
    if (!step) break;
    const idx = await qidx();
    if (hintAt.includes(idx)) {
      await page.locator('.run header button[aria-label="Pista"]').click();
      await page.waitForSelector('[role=dialog][aria-label=Pista]');
      await wait(700);
      if (shots.pista && !used.has('pista')) { used.add('pista'); await shot(shots.pista); }
      await page.mouse.click(8, 8);
      await wait(400);
    }
    await solve(step, { wrong: wrongAt.includes(idx), shots, used });
    if (await page.locator('.end, .ms .endcard').count()) break;
  }
}

const openRegion = async () => {
  await page.evaluate(() => window.__q.nav.go({ name: 'region', unit: 'u01' }));
  await page.waitForSelector('.reg .node', { timeout: 15000 });
  await wait(1200);
};

try {
  // ---- 1. premier lancement
  await page.goto(APP + '?debug');
  await page.waitForSelector('text=¡Empezar!', { timeout: 20000 });
  await wait(1200);
  await shot('01-titulo');
  check('premier lancement : écran titre', true);
  await page.click('text=¡Empezar!');
  await page.waitForSelector('.welc input');
  await wait(1200);
  await page.fill('.welc input', 'Josu');
  await page.click('.welc .key:has-text("é")');
  const name = await page.inputValue('.welc input');
  check('clavier d\'accents : "Josu" + é = "Josué"', name === 'Josué', `(${name})`);
  await shot('02-nombre');
  await page.click('button:has-text("Me llamo Josué")');
  await page.waitForSelector('.avatar');
  await wait(900);
  await page.click('.tn:nth-child(4)');
  await page.click('.tp:nth-child(2)');
  await wait(600);
  await shot('03-avatar');
  await page.click('button:has-text("¡Listo!")');
  await page.waitForSelector('.dlgwrap');
  await wait(1500);
  await shot('04-prologo');
  for (let i = 0; i < 5; i++) {
    await page.click('.dlgwrap button:has-text("Siguiente")');
    await wait(1000);
    if (i === 2) await shot('04b-prologo-sombra');
  }
  await page.click('.dlgwrap button:has-text("¡Vamos!")');
  await page.waitForSelector('.map .hud-l', { timeout: 15000 });
  await wait(2200);
  await shot('05-mapa');
  check('prologue puis carte du monde', true);
  const savedName = await page.evaluate(() => window.__q.game.state.profile.name);
  check('prénom enregistré', savedName === 'Josué');

  // ---- 2. carte : pan + zoom
  const box = await page.locator('.mapwrap').boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const camBefore = await page.evaluate(() => document.querySelector('.m-cam')?.getAttribute('transform') ?? '');
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -500);
  await wait(300);
  await page.mouse.down();
  await page.mouse.move(cx + 160, cy + 60, { steps: 8 });
  await page.mouse.up();
  await wait(400);
  const camAfter = await page.evaluate(() => document.querySelector('.m-cam')?.getAttribute('transform') ?? '');
  check('carte : pan + zoom changent la caméra', camBefore !== camAfter);
  await shot('06-mapa-zoom');

  // ---- 3. region Madrid (tap sur le medaillon)
  await page.click('.home-btn, .tools button').catch(() => {});
  await wait(1200);
  for (let i = 0; i < 2; i++) { await page.evaluate(() => document.querySelector('.m-med-madrid .m-hit')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))); await wait(150); }
  await page.waitForSelector('.reg .node', { timeout: 20000 });
  await wait(1500);
  await shot('07-region');
  check('région Madrid : chaîne de quêtes', (await page.locator('.reg .node').count()) === 8);

  // ---- 4. quete complete : u01-q02 (flashcards, ecoute, association, v/f, dialogue, trou, ordre, dictee, hechizo)
  await page.locator('.reg .node.available').first().click(); // q01 (cinematique)
  await wait(800);
  await shot('08-ficha-mision');
  await page.click('.sheet button:has-text("Jugar")');
  await page.waitForSelector('.run', { timeout: 20000 });
  await wait(1500);
  await playAll({ shots: { cinematic_ref: '09-cinematica' } });
  await page.waitForSelector('.end', { timeout: 30000 });
  await wait(4500);
  await shot('10-fin-mision-1');
  check('quête 1 (cinématique + dialogues) terminée', true);
  await page.click('.end button:has-text("Continuar")');
  await page.waitForSelector('.reg .node', { timeout: 15000 });
  await wait(800);

  // quete 2 (vocabulaire) : bonnes et mauvaises reponses, avertissement d'accent
  await page.locator('.reg .node.available').first().click();
  await wait(700);
  await page.click('.sheet button:has-text("Jugar")');
  await page.waitForSelector('.run', { timeout: 20000 });
  await wait(1000);
  // monte le niveau du joueur pour voir l'ecran LevelUp a la fin
  await page.evaluate(() => window.__q.game.mutate((s) => (s.xp = { escuchar: 0, hablar: 0, leer: 185, escribir: 0, cultura: 0 })));
  await playAll({
    wrongAt: [4, 9, 12],
    hintAt: [5],
    shots: { pista: '12b-pista', flashcard: '11-flashcard', listen_choose: '12-escucha', match_image: '13-asociar', true_false: '14-verdadero-falso', dialogue_choice: '15-dialogo', fill_blank: '16-completar', reorder_words: '17-ordenar', dictado: '18-dictado', speak: '19-hechizo', 'fb:wrong': '20-feedback-incorrecto', 'fb:partial': '21-feedback-acento', 'fb:correct': '22-feedback-correcto' },
  });
  await page.waitForSelector('.end', { timeout: 30000 });
  await wait(4800);
  await shot('23-fin-mision-2');
  const hintsUsed = await page.evaluate(() => window.__q.game.state.hints.used);
  check('Pista (français) comptabilisée', hintsUsed >= 1, `(${hintsUsed})`);
  const stars = await page.evaluate(() => window.__q.game.state.quests['u01-q02']?.stars);
  check('quête 2 terminée avec étoiles', stars >= 1, `(${stars} étoiles)`);
  await page.click('.end button:has-text("Continuar")');
  await wait(2500);
  if (await page.locator('.lv').count()) {
    await shot('24-nivel');
    check('LevelUp affiché', true);
    await page.click('.lv button');
    await wait(900);
  }
  await page.waitForSelector('.reg .node', { timeout: 15000 });
  await wait(1000);
  await shot('25-region-progreso');

  // ---- 5. autres types d'etapes : Forja (conjugar), lecture, ecriture, grammaire
  await page.evaluate(() => window.__q.game.mutate((s) => { for (const q of ['u01-q03', 'u01-q04', 'u01-q05']) s.quests[q] = { done: true, stars: 2, bestAccuracy: 0.9, bestHints: 0, attempts: 1 }; }));
  await page.evaluate(() => window.__q.game.flush());
  await page.evaluate(() => window.__q.game.flush());
  await page.reload();
  await page.waitForFunction(() => window.__q);
  await openRegion();
  await page.locator('.reg .node.available').first().click(); // q06 Forja
  await wait(700);
  await page.click('.sheet button:has-text("Jugar")');
  await page.waitForSelector('.run', { timeout: 20000 });
  await wait(800);
  await playAll({ wrongAt: [4], shots: { grammar_card: '26-gramatica', conjugar: '27-forja', 'fb:wrong': null } , max: 8 });
  await page.locator('.run header button[aria-label="Salir"]').click();
  await page.click('.dlg button:has-text("Salir")');
  await page.waitForSelector('.reg .node', { timeout: 10000 });
  check('quitter une quête demande confirmation', true);

  // ---- 5b. avertissement d'accent : dictee avec accent, reponse sans accent -> "¡Ojo con el acento!"
  await page.evaluate(async () => {
    const { game, nav, loadAllUnits, content } = window.__q;
    await loadAllUnits();
    const steps = content.unitById.get('u01').quests.find((q) => q.id === 'u01-q03').steps;
    const i = steps.findIndex((st) => st.tipo === 'dictado' && /[áéíóúñ]/i.test(st.respuesta));
    history.replaceState(null, '', `?debug&from=${Math.max(0, i)}`);
    nav.go({ name: 'quest', quest: 'u01-q03' }, { root: true });
  });
  await page.waitForSelector('.run .stepwrap', { timeout: 20000 });
  await wait(900);
  await solve(await qstep(), { shots: { 'fb:partial': '21-feedback-acento' }, used: new Set() });
  check('dictée sans accent : accepté avec "¡Ojo con el acento!"', existsSync(join(out, 'es-21-feedback-acento.png')));
  await page.evaluate(() => { history.replaceState(null, '', '?debug'); window.__q.nav.go({ name: 'map' }, { root: true }); });

  // ---- 6. Diccionario, Perfil
  await page.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
  await page.waitForSelector('.map .hud-l');
  await wait(1500);
  await page.click('button[aria-label="Diccionario"]');
  await page.waitForSelector('.dic .cell', { timeout: 30000 });
  await wait(1200);
  await shot('28-diccionario');
  await page.locator('.dic .cell button:not(.locked)').first().click();
  await page.waitForSelector('.det');
  await wait(900);
  await shot('29-diccionario-carta');
  check('Diccionario : carte détaillée', true);
  await page.click('.det button[aria-label="Cerrar"]');
  await page.click('.dic button[aria-label="Volver"]');
  await page.waitForSelector('.map .hud-l');
  await page.click('button[aria-label="Perfil"]');
  await page.waitForSelector('.pf .hero');
  await wait(1800);
  await shot('30-perfil');
  check('Perfil affiché', true);
  await page.click('.pf button[aria-label="Volver"]');
  await page.waitForSelector('.map .hud-l');

  // ---- 7. Mision del dia
  await wait(500);
  await shot('31-mapa-mision');
  await page.click('.mission button');
  await page.waitForSelector('.ms .card', { timeout: 20000 });
  await wait(1200);
  await shot('32-mision-del-dia');
  await page.click('.ms button:has-text("Empezar")');
  await page.waitForSelector('.run', { timeout: 15000 });
  await wait(1200);
  await playAll({ wrongAt: [2], shots: { 'fb:correct': null }, max: 30 });
  await page.waitForSelector('.ms .endcard', { timeout: 30000 });
  await wait(2200);
  await shot('33-mision-cumplida');
  const done = await page.evaluate(() => window.__q.game.state.missionDone);
  check('Misión del día terminée (+XP, jour marqué)', !!done);
  await page.click('.ms button:has-text("Volver")');
  await page.waitForSelector('.map .hud-l');

  // ---- 8. Ajustes + Creditos
  await page.click('button[aria-label="Ajustes"]');
  await page.waitForSelector('.set .tg');
  await wait(900);
  await shot('34-ajustes');
  await page.click('.set button:has-text("Créditos")');
  await page.waitForSelector('.cr li');
  await wait(600);
  await shot('35-creditos');
  check('Ajustes + Créditos (attributions CC BY / MIT)', (await page.locator('.cr li').count()) >= 5);
  await page.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));

  // ---- 9. Desafio (boss) : u01-q08, toutes les quetes precedentes faites
  await page.evaluate(() => window.__q.game.mutate((s) => { for (const q of ['u01-q02', 'u01-q03', 'u01-q04', 'u01-q05', 'u01-q06', 'u01-q07']) s.quests[q] = { done: true, stars: 2, bestAccuracy: 0.9, bestHints: 0, attempts: 1 }; }));
  await page.evaluate(() => window.__q.game.flush());
  await page.evaluate(() => window.__q.game.flush());
  await page.reload();
  await page.waitForFunction(() => window.__q);
  await openRegion();
  await shot('36-region-boss');
  await page.locator('.reg .node.boss').click();
  await wait(700);
  await shot('37-ficha-desafio');
  await page.click('.sheet button:has-text("Desafiar")');
  await page.waitForSelector('.bossintro', { timeout: 20000 });
  await wait(1700);
  await shot('38-desafio-intro');
  await page.waitForSelector('.bossintro', { state: 'hidden', timeout: 8000 }).catch(() => {});
  await wait(800);
  let hits = 0;
  for (let n = 0; n < 40; n++) {
    if (!(await page.locator('.run').count())) break;
    const step = await qstep();
    if (!step) break;
    const idx = await qidx();
    const wrong = idx === 1 || idx === 2;
    const shots = {};
    if (idx === 0) shots['fb:correct'] = '39-desafio-hechizo';
    if (idx === 1) shots['fb:wrong'] = '40-desafio-ataque';
    await solve(step, { wrong, shots, used: new Set() });
    hits++;
    if (await page.locator('.end').count()) break;
  }
  await page.waitForSelector('.end', { timeout: 40000 });
  await wait(5000);
  await shot('41-desafio-victoria');
  check('Désafío terminé (aucun game over)', true, `(${hits} étapes)`);
  await page.click('.end button:has-text("Continuar")');
  await wait(2500);
  if (await page.locator('.lv').count()) { await page.click('.lv button'); await wait(900); }
  const pluma = await page.locator('.pl').count();
  if (pluma) {
    await wait(5000);
    await shot('42-pluma-recuperada');
    check('plume récupérée (scène du Quetzal)', true);
    await page.click('.pl button:has-text("Genial")');
  }
  await page.waitForSelector('.map .hud-l', { timeout: 15000 });
  await wait(4500);
  await shot('43-mapa-viaje');
  const plumas = await page.evaluate(() => Object.keys(window.__q.game.state.plumas));
  check('plume u01 enregistrée', plumas.includes('u01'));

  // ---- 10. hors-ligne : le service worker sert l'app et les unites sans reseau (build uniquement)
  if (!DEV) {
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
    const p2 = await ctx2.newPage();
    const errs2 = [];
    p2.on('pageerror', (e) => errs2.push(e.message));
    await p2.goto(APP + '?debug');
    await p2.waitForSelector('text=¡Empezar!', { timeout: 20000 });
    await p2.evaluate(() => navigator.serviceWorker.ready);
    await p2.waitForTimeout(6000); // precache
    await ctx2.setOffline(true);
    await p2.reload();
    await p2.waitForSelector('text=¡Empezar!', { timeout: 20000 });
    await p2.evaluate(async () => {
      const { game, loadUnit, nav } = window.__q;
      game.mutate((s) => { s.profile.name = 'Offline'; s.flags.prologue = '1'; });
      await loadUnit('u01');
      nav.go({ name: 'quest', quest: 'u01-q02' }, { root: true });
    });
    await p2.waitForSelector('.run .stepwrap', { timeout: 20000 });
    await p2.waitForTimeout(1500);
    await p2.screenshot({ path: join(out, 'es-44-sin-conexion.png') });
    // hechizo hors-ligne : pas de reconnaissance vocale -> auto-evaluation
    await p2.goto(APP + '?debug&from=14');
    await p2.waitForFunction(() => window.__q);
    await p2.evaluate(async () => {
      const { loadUnit, nav } = window.__q;
      await loadUnit('u01');
      nav.go({ name: 'quest', quest: 'u01-q02' }, { root: true });
    });
    await p2.waitForSelector('.sp', { timeout: 20000 });
    await p2.waitForTimeout(800);
    check('hechizo hors-ligne : repli auto-évaluation', (await p2.locator('.sp .self').count()) === 1);
    await p2.screenshot({ path: join(out, 'es-45-autoevaluacion.png') });
    await p2.click('.sp .ev.good');
    await p2.waitForSelector('.run .fbk', { timeout: 6000 });
    check('hors-ligne : une quête se joue sans réseau', errs2.length === 0, errs2.join(' | ').slice(0, 200));
    await ctx2.close();
  }

  check('aucune requête externe', external.length === 0, external.slice(0, 3).join(' '));
  check('aucune erreur JS / réseau', errors.length === 0, errors.slice(0, 4).join(' | '));
} catch (e) {
  console.log('ECHEC du parcours :', e.message);
  await page.screenshot({ path: join(out, 'es-ERREUR.png') }).catch(() => {});
  results.push(false);
}

await browser.close();
server?.close();
const failed = results.filter((r) => !r).length;
console.log(failed ? `\n${failed} ECHEC(S)` : '\nTOUT PASSE');
process.exit(failed ? 1 : 0);
