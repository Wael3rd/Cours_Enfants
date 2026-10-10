// Construit les 4 apps dans UN site statique : dist/ = hub, dist/maths/, dist/espagnol/, dist/calcul/.
import { rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const vite = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const run = (args, opts = {}) => {
  const r = spawnSync(process.execPath, args, { stdio: 'inherit', cwd: root, ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

rmSync(dist, { recursive: true, force: true });

// Le hub d'abord (il vide dist/), puis les apps dans leurs sous-dossiers.
const targets = [
  { app: 'hub', out: dist },
  { app: 'maths', out: join(dist, 'maths') },
  { app: 'espagnol', out: join(dist, 'espagnol') },
  { app: 'calcul', out: join(dist, 'calcul') },
];
for (const { app, out } of targets) {
  console.log(`\n=== build ${app} -> ${out}`);
  run(['scripts/cinematics.mjs', 'stage', app]);
  run([vite, 'build'], {
    cwd: join(root, 'apps', app),
    env: { ...process.env, CE_OUT_DIR: out, CE_PUBLIC_DIR: join(root, 'apps', app, '.public-build'), CE_KEEP_OUT: app === 'hub' ? '' : '1' },
  });
}
console.log('\nBuild OK -> dist/');
