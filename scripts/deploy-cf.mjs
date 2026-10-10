// Deploiement Cloudflare Pages : UNE origine (*.pages.dev) par app installable (contrainte Android : une WebAPK par origine).
// usage : npm run deploy:cf [maths|calcul|espagnol ...]   (sans argument = les 3)
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const vite = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
// UN projet Pages, une BRANCHE par app -> https://<alias>.<PROJECT>.pages.dev/ (chaque sous-domaine = une origine distincte).
// Si le nom 'wael3rd' est pris globalement, utiliser 'wael3rd-apps'.
const PROJECT = 'wael3rd';
const PROJECTS = { maths: 'calcul-champion', calcul: 'calcul', espagnol: 'quetzal' };
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root, shell: cmd === 'npx', ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

function walk(d, acc = { n: 0, big: [] }) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else { acc.n++; if (statSync(p).size > 25 * 1024 * 1024) acc.big.push(p); }
  }
  return acc;
}

const wanted = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const apps = wanted.length ? wanted : Object.keys(PROJECTS);
for (const app of apps) {
  if (!PROJECTS[app]) { console.error(`app inconnue: ${app} (maths|calcul|espagnol)`); process.exit(2); }
  const out = join(root, 'dist-cf', app);
  console.log(`\n=== ${app} -> ${PROJECTS[app]}.${PROJECT}.pages.dev`);
  rmSync(out, { recursive: true, force: true });
  run(process.execPath, ['scripts/cinematics.mjs', 'stage', app]);
  run(process.execPath, [vite, 'build'], {
    cwd: join(root, 'apps', app),
    env: { ...process.env, CE_FORCE_BASE: '/', CE_BASE_PREFIX: '/', CE_OUT_DIR: out, CE_PUBLIC_DIR: join(root, 'apps', app, '.public-build') },
  });
  const { n, big } = walk(out);
  console.log(`${n} fichiers (limite Cloudflare Pages : 20000, 25 Mo/fichier)`);
  if (n > 20000 || big.length) { console.error('Limites Cloudflare depassees', big); process.exit(1); }
  // Cree le projet s'il n'existe pas (erreur ignoree si deja present).
  spawnSync('npx', ['wrangler', 'pages', 'project', 'create', PROJECT, '--production-branch', 'main'], { cwd: root, shell: true, stdio: 'inherit' });
  run('npx', ['wrangler', 'pages', 'deploy', out, '--project-name', PROJECT, '--branch', PROJECTS[app], '--commit-dirty=true']);
}
