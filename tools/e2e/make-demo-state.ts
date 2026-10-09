// Genere une sauvegarde de demo (enfant virtuel, ~50 jours de pratique) pour les captures de l'espace parent.
// Usage : node --experimental-transform-types tools/e2e/make-demo-state.ts <sortie.json>
import { writeFileSync } from 'node:fs';
import { defaultState, STATE_VERSION, APP_NAME } from '../../apps/maths/src/state/model.ts';
import { startSession } from '../../apps/maths/src/engine/session.ts';
import { startPlacement } from '../../apps/maths/src/engine/placement.ts';
import { VirtualChild, AVERAGE_CHILD } from '../../apps/maths/tests/virtual-child.ts';
import type { Question } from '../../apps/maths/src/engine/builder.ts';

const out = process.argv[2] ?? 'demo-state.json';
const DAY = 86_400_000;
const days = Number(process.argv[3] ?? 46);

const st = defaultState();
st.childName = 'Inès';
const child = new VirtualChild(AVERAGE_CHILD, 5);
let t = Date.now() - days * DAY;
const now = () => (t += 700);

const ps = startPlacement(st.profile, st.settings, { seed: 1, now });
let q: Question | null;
while ((q = ps.next())) { const a = child.answer(q); ps.submit(a.value, a.ms); }
ps.finish();

for (let d = 0; d < days; d++) {
  t = Date.now() - (days - d) * DAY + 17 * 3600_000;
  if (d % 9 === 4) continue; // jours sans pratique (serie douce)
  const modes = d % 7 === 6 ? (['match', 'sprint'] as const) : d % 5 === 3 ? (['match', 'penalties'] as const) : (['match'] as const);
  for (const mode of modes) {
    const s = startSession(st.profile, st.settings, mode, { seed: d * 31 + 7, now });
    while ((q = s.next())) { const a = child.answer(q); s.submit(a.value, a.ms); }
    s.finish();
  }
}
st.createdAt = Date.now() - days * DAY;
writeFileSync(out, JSON.stringify({ app: APP_NAME, version: STATE_VERSION, data: st }));
const p = st.profile.progress;
console.log(`demo: ${st.profile.history.length} sessions, zone ${p.focusZone}, gagnees ${p.zonesWon.map((z) => z.zone).join(',')}`);
