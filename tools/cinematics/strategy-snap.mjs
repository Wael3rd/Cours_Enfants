// Snapshots de controle des cinematiques de strategie : une image a la fin de chaque phrase (+ le milieu de la 1re).
// Usage : node tools/cinematics/strategy-snap.mjs zone [zone ...]   (images dans <id>/snapshots/, gitignorees)
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..', '..');
for (const zone of process.argv.slice(2)) {
  const dir = join(root, 'apps/maths/public/cinematics', `strategy-${zone}`);
  const P = JSON.parse(readFileSync(join(dir, 'index.html'), 'utf8').match(/window\.PLAN = (\{.*?\});/)[1]);
  const at = [P.t[0] + 0.5 * P.d[0], ...P.t.map((t, i) => t + 0.97 * P.d[i])].map((n) => n.toFixed(2)).join(',');
  const r = spawnSync('npx', ['hyperframes', 'snapshot', dir, '--at', at], { cwd: root, shell: true, encoding: 'utf8' });
  console.log(zone, r.status === 0 ? 'ok' : 'FAIL', at);
}
