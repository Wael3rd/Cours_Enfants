// Manifeste TTS de l'app maths : repliques (voice-lines.ts) + legendes d'indices visuels de tous les faits.
// Usage : npm run voices   (genere puis lance generate.py -> apps/maths/public/audio/fr/*.mp3 ; cache : seules les nouveautes sont regenerees)
import { writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { VOICE, SPEAKERS, hintKey, speakable } from '../../apps/maths/src/audio/voice-lines.ts';
import { ALL_FACTS } from '../../apps/maths/src/engine/facts.ts';
import { hintFor } from '../../apps/maths/src/engine/visuals.ts';

const root = resolve(import.meta.dirname, '..', '..');
const out = join(root, 'apps/maths/public/audio/fr');
mkdirSync(out, { recursive: true });

const manifest = [];
for (const [key, l] of Object.entries(VOICE)) manifest.push({ key, text: l.text, ...SPEAKERS[l.who] });
const seen = new Set();
for (const f of ALL_FACTS) {
  const key = hintKey(f.id);
  if (seen.has(key)) continue;
  seen.add(key);
  manifest.push({ key, text: speakable(hintFor(f).caption), ...SPEAKERS.coach });
}
const file = join(root, 'tools/tts/maths-manifest.json');
writeFileSync(file, JSON.stringify(manifest, null, 1));
console.log(`${manifest.length} repliques dans ${file}`);
const py = join(root, 'tools/tts/.venv/Scripts/python.exe');
const r = spawnSync(py, [join(root, 'tools/tts/generate.py'), file, out, '--concurrency', '4'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
