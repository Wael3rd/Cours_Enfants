// Utilitaires cinematiques HyperFrames.
//  sync   : copie apps/<app>/public/cinematics/_shared/ dans chaque <id>/_shared/ (copies gitignorees).
//           Necessaire car `hyperframes check/preview/render` ne servent que le dossier de la composition
//           (pas de "../"). Les compositions referencent donc "./_shared/...".
//  stage  : prepare un publicDir de build (<app>/.public-build) SANS les copies : un seul _shared par app,
//           les compositions sont reecrites en "../_shared/". Evite de precacher N fois le runtime (500 Ko).
//  art    : concatene apps/maths/src/art/core/src/*.js (kit graphique CEArt, source unique) en
//           - src/art/core/ceart.js (ESM pour Svelte) et - public/cinematics/_shared/ceart.js (IIFE window.CEArt pour HyperFrames).
//           Lance automatiquement par sync/check ; `npm run art` pour le regenerer a la main.
//  check  : sync puis `hyperframes check` sur chaque composition (0 finding exige).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const apps = readdirSync(join(root, 'apps')).filter((a) => existsSync(join(root, 'apps', a, 'public')));

const cinDir = (app) => join(root, 'apps', app, 'public', 'cinematics');
const compos = (app) => {
  const d = cinDir(app);
  if (!existsSync(d)) return [];
  return readdirSync(d).filter((n) => n !== '_shared' && existsSync(join(d, n, 'index.html')));
};

const ARTS = [
  { app: 'maths', glob: 'CEArt', file: 'ceart.js' },
  { app: 'espagnol', glob: 'QArt', file: 'qart.js' },
];
function art() {
  for (const a of ARTS) {
    const src = join(root, 'apps', a.app, 'src', 'art', 'core', 'src');
    if (!existsSync(src)) continue;
    const NL = String.fromCharCode(10);
    const parts = readdirSync(src).filter((f) => f.endsWith('.js')).sort();
    const banner = '// GENERE par scripts/cinematics.mjs (art) depuis art/core/src/*.js - ne pas editer.' + NL;
    const esm = banner + parts.map((f) => readFileSync(join(src, f), 'utf8')).join(NL);
    writeFileSync(join(src, '..', a.file), esm);
    const names = [...esm.matchAll(/^export (?:function|const|let) ([A-Za-z0-9_]+)/gm)].map((m) => m[1]);
    const iife = '(function(){' + NL + esm.replace(/^export /gm, '') + NL + 'window.' + a.glob + ' = {' + names.join(',') + '};' + NL + '})();' + NL;
    const dts = names.map((n) => (/^[A-Z_0-9]+$/.test(n) ? `export const ${n}: any;` : `export function ${n}(...a: any[]): any;`));
    writeFileSync(join(src, '..', a.file.replace(/\.js$/, '.d.ts')), '// GENERE (art)' + NL + dts.join(NL) + NL);
    const sh = join(cinDir(a.app), '_shared');
    mkdirSync(sh, { recursive: true });
    writeFileSync(join(sh, a.file), iife);
  }
}

function sync(app) {
  art();
  const shared = join(cinDir(app), '_shared');
  if (!existsSync(shared)) return;
  for (const id of compos(app)) {
    const dest = join(cinDir(app), id, '_shared');
    rmSync(dest, { recursive: true, force: true });
    cpSync(shared, dest, { recursive: true });
  }
}

function stage(app) {
  const src = join(root, 'apps', app, 'public');
  const dest = join(root, 'apps', app, '.public-build');
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (p) => !/\/cinematics\/[^/]+\/_shared(\/|$)/.test(p.split(sep).join('/')),
  });
  const cd = join(dest, 'cinematics');
  if (existsSync(cd))
    for (const id of readdirSync(cd)) {
      const f = join(cd, id, 'index.html');
      if (id === '_shared' || !existsSync(f)) continue;
      writeFileSync(f, readFileSync(f, 'utf8').replaceAll('./_shared/', '../_shared/'));
    }
}

const [cmd, only] = process.argv.slice(2);
const targets = only ? [only] : apps;
if (cmd === 'art') art();
else if (cmd === 'sync') targets.forEach(sync);
else if (cmd === 'stage') targets.forEach(stage);
else if (cmd === 'check') {
  let bad = 0;
  for (const app of targets) {
    sync(app);
    for (const id of compos(app)) {
      const dir = join(cinDir(app), id);
      console.log(`\n== hyperframes check ${app}/${id}`);
      const r = spawnSync('npx', ['hyperframes', 'check', dir], { cwd: root, stdio: 'inherit', shell: true });
      if (r.status !== 0) bad++;
    }
  }
  process.exit(bad ? 1 : 0);
} else {
  console.error('usage: node scripts/cinematics.mjs sync|stage|check [app]');
  process.exit(2);
}
