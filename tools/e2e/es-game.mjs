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
const fakeSpeech = () => {
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
};
await ctx.addInitScript(fakeSpeech);
let page = await ctx.newPage();
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

  // ---- 9b. corrections de revue : cinematiques en parties, evenement, unite 4, Desafio compact, Diccionario typographique
  {
    const mk = async (viewport, now) => {
      const c = await browser.newContext({ viewport, hasTouch: true });
      await c.addInitScript(fakeSpeech);
      const p = await c.newPage();
      p.on('pageerror', (e) => errors.push('pageerror(extra): ' + e.message));
      p.on('response', (r) => r.status() >= 400 && !r.url().includes('/audio/es/') && errors.push(r.status() + ' ' + r.url()));
      c.on('request', (req) => { const u = req.url(); if (!/^(data|blob|about):/.test(u) && new URL(u).origin !== ORIGIN) external.push(u); });
      await p.goto(`${APP}?debug${now ? `&now=${now}` : ''}`);
      await p.waitForFunction(() => window.__q);
      await p.evaluate(async () => {
        const { game, loadAllUnits, content } = window.__q;
        await loadAllUnits();
        game.mutate((s) => {
          s.flags.prologue = '1';
          s.profile.name = 'Josué';
          for (const u of ['u01', 'u02', 'u03']) {
            s.plumas[u] = '2026-10-01';
            for (const q of content.unitById.get(u).quests) s.quests[q.id] = { done: true, stars: 2, bestAccuracy: 0.9, bestHints: 0, attempts: 1 };
          }
          for (const u of content.units) for (const v of u.vocab) s.discovered[v.id] = '2026-10-01';
        });
        await game.flush();
      });
      return { c, p };
    };
    const shotp = (p, name) => p.screenshot({ path: join(out, `es-${name}.png`) });
    const playOn = async (p, opts) => {
      const saved = page;
      page = p;
      try { await playAll(opts); } finally { page = saved; }
    };

    // (1) cinematique en parties : un seul overlay, la partie 2 suit sans trou, "Saltar" saute tout
    {
      const { c, p } = await mk({ width: 1280, height: 800 }, '2026-10-12');
      const manifest = await p.evaluate(() => fetch('cinematics/manifest.json').then((r) => r.json()).catch(() => ({})));
      const multi = manifest['u01-historia'];
      check('manifeste des cinématiques lu (u01-historia en parties)', !!multi && multi.parts.length >= 3, `(${multi?.parts.length} parties)`);
      const info = await p.evaluate(async () => {
        const { loadUnit, content } = window.__q;
        await loadUnit('u01');
        for (const q of content.unitById.get('u01').quests) {
          const i = q.steps.findIndex((st) => st.tipo === 'cinematic_ref' && st.cinematica === 'u01-historia');
          if (i >= 0) return { quest: q.id, i, n: q.steps.length };
        }
        return null;
      });
      await p.evaluate(({ quest, i }) => { history.replaceState(null, '', `?debug&from=${i}`); window.__q.nav.go({ name: 'quest', quest }, { root: true }); }, info);
      await p.waitForSelector('.cine[data-state="playing"]', { timeout: 20000 });
      const seen = new Set();
      let maxOverlays = 0;
      const t0 = Date.now();
      while (Date.now() - t0 < 40000 && seen.size < 2) {
        const r = await p.evaluate(() => ({ n: document.querySelectorAll('.cine').length, src: document.querySelector('.cine hyperframes-player.on')?.getAttribute('src') ?? '' }));
        maxOverlays = Math.max(maxOverlays, r.n);
        if (r.src) seen.add(r.src);
        await p.waitForTimeout(250);
      }
      await shotp(p, '46-cinematica-partes');
      check('cinématique : la partie 2 enchaîne dans le même overlay', seen.size >= 2 && maxOverlays === 1, `(${[...seen].map((x) => x.split('/').slice(-2)[0]).join(' -> ')})`);
      const idxBefore = await p.evaluate(() => window.__qidx);
      await p.locator('.cine .skip').click();
      await p.waitForSelector('.cine', { state: 'detached', timeout: 8000 });
      await p.waitForTimeout(800);
      const after = await p.evaluate(() => ({ idx: window.__qidx, step: window.__qstep?.cinematica ?? null }));
      check('« Saltar » saute toute la cinématique (étape suivante)', after.idx === idxBefore + 1 && after.step !== 'u01-historia', `(${idxBefore} -> ${after.idx})`);
      await c.close();
    }

    // (2) evenement : dans la fenetre / hors fenetre / ouverture forcee par le parent
    {
      const { c, p } = await mk({ width: 1280, height: 800 }, '2026-10-28');
      await p.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
      await p.waitForSelector('.map .evento', { timeout: 15000 });
      await p.waitForTimeout(1500);
      const banner = await p.locator('.map .evento').innerText();
      check('événement (28 oct) : bannière « ¡Evento: Día de Muertos! »', /¡Evento: Día de Muertos!/.test(banner), `(${banner.replace(/\s+/g, ' ')})`);
      check('événement : marqueur animé (halo + papel picado) sur Oaxaca', (await p.locator('.map .m-evfx').count()) === 1);
      await shotp(p, '47-mapa-evento');
      await p.evaluate(() => window.__q.nav.go({ name: 'region', unit: 'e01' }));
      await p.waitForSelector('.reg .node', { timeout: 15000 });
      await p.waitForTimeout(1200);
      const cap = await p.locator('.reg .cap').innerText();
      check('région événement : « Evento especial », jamais « Capítulo 0 »', /Evento especial/.test(cap) && !/Cap[ií]tulo 0/.test(await p.locator('.reg').innerText()), `(${cap})`);
      await shotp(p, '48-region-evento');
      await p.locator('.reg .node.available').first().click();
      await p.waitForTimeout(600);
      await p.click('.sheet button:has-text("Jugar")');
      await p.waitForSelector('.run .stepwrap', { timeout: 20000 });
      await p.waitForTimeout(800);
      await playOn(p, { max: 40 });
      await p.waitForSelector('.end', { timeout: 40000 });
      await p.waitForTimeout(4500);
      check('événement e01 : une quête jouée jusqu\'au bout', true);
      await shotp(p, '48b-quest-evento');
      await c.close();

      const o = await mk({ width: 1280, height: 800 }, '2026-06-10');
      await o.p.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
      await o.p.waitForSelector('.map .hud-l');
      await o.p.waitForTimeout(1200);
      check('hors fenêtre (10 juin) : ni bannière ni marqueur d\'événement', (await o.p.locator('.map .evento').count()) === 0 && (await o.p.locator('.map .m-evfx').count()) === 0);
      await o.p.evaluate(() => window.__q.nav.go({ name: 'settings' }, { root: true }));
      await o.p.waitForSelector('.set .gate button');
      const gate = await o.p.locator('.set .gate button').boundingBox();
      await o.p.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
      await o.p.mouse.down();
      await o.p.waitForTimeout(3400);
      await o.p.mouse.up();
      await o.p.waitForSelector('[data-testid=parent-space]');
      await o.p.click('[data-testid=tab-ajustes]');
      await o.p.locator('[data-testid=force-e01] input').check();
      await o.p.waitForTimeout(400);
      await o.p.click('[data-testid=parent-close]');
      await o.p.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
      await o.p.waitForSelector('.map .evento', { timeout: 15000 });
      check('espace parent : ouverture forcée de l\'événement hors dates', (await o.p.locator('.map .m-evfx').count()) === 1);
      await shotp(o.p, '49-evento-forzado');
      await o.c.close();
    }

    // (3) Desafio compact : aucune etape rognee en haut, en 1280x800 et en portrait 800x1280 (u04 + e01)
    const shotDone = new Set();
    const bossLayout = async (vp, qid, fb) => {
      const { c, p } = await mk(vp, '2026-10-28');
      const uid = qid.split('-')[0];
      const n = await p.evaluate(async ({ uid, qid }) => (await window.__q.loadUnit(uid)).quests.find((q) => q.id === qid).steps.length, { uid, qid });
      const bad = [];
      const types = new Set();
      for (let i = 0; i < n; i++) {
        await p.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
        await p.waitForTimeout(300);
        await p.evaluate(({ qid, i }) => { history.replaceState(null, '', `?debug&now=2026-10-28&from=${i}`); window.__q.nav.go({ name: 'quest', quest: qid }, { root: true }); }, { qid, i });
        await p.waitForSelector('.run .stepwrap', { timeout: 20000 });
        await p.waitForSelector('.bossintro', { state: 'hidden', timeout: 8000 }).catch(() => {});
        await p.waitForTimeout(700);
        const t = await p.evaluate(() => window.__qstep?.tipo);
        if (t === 'cinematic_ref') continue;
        types.add(t);
        if (fb) await p.evaluate(() => { const w = document.querySelector('.stepwrap'); w.classList.add('fbshown'); w.style.paddingBottom = '110px'; });
        await p.waitForTimeout(250);
        const r = await p.evaluate(() => {
          const area = document.querySelector('.area').getBoundingClientRect();
          const out = [];
          document.querySelectorAll('.stepwrap *').forEach((e) => {
            if (e.children.length || getComputedStyle(e).position === 'absolute' || getComputedStyle(e).visibility === 'hidden') return;
            const b = e.getBoundingClientRect();
            if (b.width && (b.top < area.top - 2 || b.left < -2 || b.right > innerWidth + 2)) out.push(`${String(e.className?.baseVal ?? e.className).slice(0, 24)}@${Math.round(b.top - area.top)}`);
          });
          const forge = document.querySelector('.forge')?.getBoundingClientRect();
          if (forge) for (const sel of ['.work', '.anvilwrap', '.bank']) { const b = document.querySelector(sel)?.getBoundingClientRect(); if (b && (b.top < forge.top - 1 || b.bottom > forge.bottom + 1)) out.push(`forge ${sel} hors cadre`); }
          return out;
        });
        if (r.length) bad.push(`#${i} ${t}: ${r.slice(0, 3).join(',')}`);
        const key = `${qid}${vp.width}${fb}`;
        if (t === 'conjugar' && !shotDone.has(key)) { shotDone.add(key); await shotp(p, `50-desafio-forja-${vp.width}x${vp.height}${fb ? '-fb' : ''}`); }
        if (t === 'match_image' && !shotDone.has('m' + key)) { shotDone.add('m' + key); await shotp(p, `50b-desafio-asociar-${vp.width}x${vp.height}${fb ? '-fb' : ''}`); }
      }
      await c.close();
      return { bad, types: [...types] };
    };
    for (const [vp, qid, fb] of [[{ width: 1280, height: 800 }, 'u04-q08', true], [{ width: 800, height: 1280 }, 'u04-q08', true], [{ width: 1280, height: 800 }, 'e01-q04', false]]) {
      const r = await bossLayout(vp, qid, fb);
      check(`Desafío ${qid} ${vp.width}x${vp.height}${fb ? ' (bandeau de réponse)' : ''} : aucune étape rognée`, r.bad.length === 0, `(${r.types.join(',')}) ${r.bad.join(' | ')}`);
    }

    // (4) unite 4 (Ciudad de Mexico) : carte, region, quete, Desafio
    {
      const { c, p } = await mk({ width: 1280, height: 800 }, '2026-10-12');
      await p.evaluate(() => window.__q.nav.go({ name: 'map' }, { root: true }));
      await p.waitForSelector('.map .hud-l');
      await p.waitForTimeout(1500);
      check('unité 4 : pas de bannière d\'événement le 12 oct', (await p.locator('.map .evento').count()) === 0);
      const cdmx = await p.evaluate(() => document.querySelector('.m-med-cdmx')?.getAttribute('class') ?? '');
      check('unité 4 : Ciudad de México ouverte sur la carte', /m-current|m-open/.test(cdmx), `(${cdmx})`);
      await shotp(p, '51-mapa-u04');
      await p.evaluate(() => window.__q.nav.go({ name: 'region', unit: 'u04' }));
      await p.waitForSelector('.reg .node', { timeout: 15000 });
      await p.waitForTimeout(1200);
      check('unité 4 : région « Capítulo 4 » avec 8 quêtes', (await p.locator('.reg .node').count()) === 8 && /Cap[ií]tulo 4/.test(await p.locator('.reg .cap').innerText()));
      await shotp(p, '52-region-u04');
      await p.locator('.reg .node.available').first().click();
      await p.waitForTimeout(600);
      await p.click('.sheet button:has-text("Jugar")');
      await p.waitForSelector('.run .stepwrap', { timeout: 20000 });
      await p.waitForTimeout(1000);
      await playOn(p, { max: 40 });
      await p.waitForSelector('.end', { timeout: 40000 });
      await p.waitForTimeout(4500);
      check('unité 4 : quête 1 jouée jusqu\'au bout', true);
      await shotp(p, '53-quest-u04');
      await p.evaluate(() => window.__q.game.mutate((s) => { for (const q of ['u04-q01', 'u04-q02', 'u04-q03', 'u04-q04', 'u04-q05', 'u04-q06', 'u04-q07']) s.quests[q] = { done: true, stars: 2, bestAccuracy: 0.9, bestHints: 0, attempts: 1 }; }));
      await p.evaluate(() => { history.replaceState(null, '', '?debug&now=2026-10-12'); window.__q.nav.go({ name: 'quest', quest: 'u04-q08' }, { root: true }); });
      await p.waitForSelector('.bossintro', { timeout: 20000 });
      await p.waitForSelector('.bossintro', { state: 'hidden', timeout: 8000 }).catch(() => {});
      await p.waitForTimeout(600);
      await playOn(p, { max: 40 });
      await p.waitForSelector('.end', { timeout: 40000 });
      await p.waitForTimeout(4500);
      await shotp(p, '54-desafio-u04');
      check('unité 4 : Desafío terminé', await p.evaluate(() => window.__q.game.state.quests['u04-q08']?.done === true));
      await c.close();
    }

    // (5) Diccionario : jamais de texte "SOON" ; carte typographique pour un mot sans image
    {
      const { c, p } = await mk({ width: 1280, height: 800 }, '2026-10-12');
      await p.evaluate(() => window.__q.nav.go({ name: 'dictionary' }, { root: true }));
      await p.waitForSelector('.dic .cell', { timeout: 30000 });
      await p.waitForTimeout(1000);
      await p.locator('.dic .u').first().click();
      await p.waitForTimeout(500);
      const nTypo1 = await p.locator('.dic .typo').count();
      const html1 = await p.locator('.dic').innerHTML();
      await p.locator('.dic .u:has-text("México")').first().click();
      await p.waitForTimeout(500);
      const nTypo4 = await p.locator('.dic .typo').count();
      const html4 = await p.locator('.dic').innerHTML();
      check('Diccionario : cartes typographiques (mot en grand, article, motif), sans placeholder', nTypo1 + nTypo4 > 0 && !/SOON/i.test(html1 + html4) && !(html1 + html4).includes('\u{1F51C}'), `(${nTypo1} u1, ${nTypo4} u4)`);
      await shotp(p, '55-diccionario-tipografico');
      await p.locator('.dic .u').first().click();
      await p.waitForTimeout(400);
      await p.locator('.dic .cell:has-text("hasta luego") button').click();
      await p.waitForSelector('.det', { timeout: 5000 });
      await p.waitForTimeout(600);
      await shotp(p, '56-diccionario-carta-tipografica');
      await c.close();
    }
  }

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
