// Genere apps/espagnol/src/content/units/uNN.json a partir des sources d'ecriture u01.mjs, u02.mjs, ...
// node tools/content/author/build.mjs
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { UNITS_DIR } from '../lib.mjs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(UNITS_DIR, { recursive: true });
const names = readdirSync(dirname(fileURLToPath(import.meta.url))).filter((f) => /^[ue]\d\d\.mjs$/.test(f)).map((f) => f.slice(0, 3)).sort();
for (const n of names) {
  const f = join(here, `${n}.mjs`);
  if (!existsSync(f)) continue;
  const unit = (await import(pathToFileURL(f).href)).default();
  writeFileSync(join(UNITS_DIR, `${n}.json`), JSON.stringify(unit, null, 2) + '\n', 'utf8');
  console.log(`${n}.json écrit (${unit.vocab.length} mots, ${unit.quests.length} quêtes)`);
}
