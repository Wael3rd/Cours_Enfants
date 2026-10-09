import { describe, expect, it } from 'vitest';
import { newProfile, defaultEngineSettings, type Profile } from '../src/engine/profile.ts';
import { startSession } from '../src/engine/session.ts';
import { startPlacement } from '../src/engine/placement.ts';
import { zoneRatio } from '../src/engine/progress.ts';
import { VirtualChild, AVERAGE_CHILD, SLOW_CHILD, FAST_CHILD, type ChildProfile } from './virtual-child.ts';
import type { Question } from '../src/engine/builder.ts';

const settings = defaultEngineSettings();
let clock = 1_700_000_000_000;
const now = () => (clock += 500);

/** Un enfant virtuel enchaine des sessions Match jusqu'a gagner les 9 zones. */
function runChild(cp: ChildProfile, seed: number, opts: { placement?: boolean; maxSessions?: number } = {}) {
  const profile: Profile = newProfile();
  const child = new VirtualChild(cp, seed);
  if (opts.placement) {
    const ps = startPlacement(profile, settings, { seed, now });
    let q: Question | null;
    while ((q = ps.next())) { const a = child.answer(q); ps.submit(a.value, a.ms); }
    ps.finish();
  }
  const wonAt: Record<number, number> = {};
  let sessions = 0;
  let firstSub = 0; // 1re soustraction proposee comme nouvelle (numero de session)
  const max = opts.maxSessions ?? 600;
  while (sessions < max && profile.progress.zonesWon.length < 9) {
    // une journee type : 1 Match (+ 1 entrainement de la zone quand on apprend une nouvelle zone)
    const s = startSession(profile, settings, 'match', { seed: seed * 1000 + sessions, now });
    let q: Question | null;
    while ((q = s.next())) {
      if (!firstSub && q.kind === 'fact' && q.op === '-' && q.isNew) firstSub = sessions + 1;
      const a = child.answer(q); s.submit(a.value, a.ms);
    }
    const r = s.finish();
    sessions++;
    for (const z of r.zonesWon) wonAt[z] = sessions;
  }
  return { profile, wonAt, sessions, firstSub };
}

describe('simulation : enfant virtuel qui progresse avec la pratique', () => {
  it('enfant moyen : traverse les 9 zones en un nombre raisonnable de sessions', () => {
    const { wonAt, sessions, profile, firstSub: first } = runChild(AVERAGE_CHILD, 1);
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(30); // les soustractions arrivent dans les premieres semaines, pas apres ~56 sessions
    console.log('[sim moyen] sessions par zone (cumul) :', JSON.stringify(wonAt), 'total', sessions, '1re soustraction a la session', first);
    expect(Object.keys(wonAt)).toHaveLength(9);
    expect(profile.progress.zonesWon).toHaveLength(9);
    // zones triees dans l'ordre
    const order = Object.entries(wonAt).sort((a, b) => a[1] - b[1] || +a[0] - +b[0]).map(([z]) => +z);
    expect(order).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(sessions).toBeLessThan(250);
    // les premieres zones sont franchies vite
    expect(wonAt[1]).toBeLessThan(30);
  });

  it('enfant plus lent : plus de sessions, mais il y arrive', () => {
    const avg = runChild(AVERAGE_CHILD, 2);
    const slow = runChild(SLOW_CHILD, 2);
    console.log('[sim lent] sessions par zone (cumul) :', JSON.stringify(slow.wonAt), 'total', slow.sessions, '1re soustraction a la session', slow.firstSub);
    expect(slow.profile.progress.zonesWon).toHaveLength(9);
    expect(slow.sessions).toBeGreaterThan(avg.sessions);
    expect(slow.sessions).toBeLessThan(400);
  });

  it('plusieurs graines : resultats stables (ecart raisonnable)', () => {
    const totals = [3, 4, 5].map((s) => runChild(AVERAGE_CHILD, s).sessions);
    console.log('[sim moyen x3 graines] sessions :', totals.join(', '));
    const min = Math.min(...totals), max = Math.max(...totals);
    expect(max).toBeLessThan(min * 1.6);
  });

  it('enfant deja fort : le match de detection le place loin', () => {
    const profile = newProfile();
    const child = new VirtualChild(FAST_CHILD, 7);
    const ps = startPlacement(profile, settings, { seed: 7, now });
    let q: Question | null;
    let n = 0;
    while ((q = ps.next())) { const a = child.answer(q); ps.submit(a.value, a.ms); n++; }
    const r = ps.finish();
    console.log('[placement fort] questions', n, 'zones reussies', r.zonesPassed.join(','), 'zone de travail', r.focusZone, 'pre-remplis', r.prefilled);
    expect(r.focusZone).toBeGreaterThanOrEqual(9);
    expect(r.zonesPassed.length).toBeGreaterThanOrEqual(8);
    expect(r.prefilled).toBeGreaterThan(100);
    expect(profile.progress.placementDone).toBe(true);
    expect(profile.progress.zonesWon.length).toBeGreaterThanOrEqual(8);
    expect(profile.history[0].mode).toBe('placement');
    expect(n).toBeLessThanOrEqual(30);
  });

  it('enfant debutant : place en zone 1, rien de sur-estime', () => {
    const profile = newProfile();
    const child = new VirtualChild(SLOW_CHILD, 7);
    const ps = startPlacement(profile, settings, { seed: 7, now });
    let q: Question | null;
    while ((q = ps.next())) { const a = child.answer(q); ps.submit(a.value, a.ms); }
    const r = ps.finish();
    console.log('[placement debutant] zones reussies', r.zonesPassed.join(',') || '(aucune)', 'zone de travail', r.focusZone);
    expect(r.focusZone).toBeLessThanOrEqual(2);
    expect(r.prefilled).toBeLessThan(60);
  });

  it('enfant fort place puis joue : finit bien plus vite qu\'un debutant', () => {
    const strong = runChild(FAST_CHILD, 8, { placement: true });
    const avg = runChild(AVERAGE_CHILD, 8);
    console.log('[sim fort apres placement] sessions', strong.sessions, 'vs moyen', avg.sessions, 'wonAt', JSON.stringify(strong.wonAt), '1re soustraction', strong.firstSub);
    expect(strong.profile.progress.zonesWon.length).toBe(9);
    expect(strong.sessions).toBeLessThan(avg.sessions / 2);
  });

  it('enfant fort sans detection : les familles avancent vite, soustractions des les premieres sessions', () => {
    const strong = runChild(FAST_CHILD, 6);
    console.log('[sim fort sans detection] sessions par zone (cumul) :', JSON.stringify(strong.wonAt), 'total', strong.sessions, '1re soustraction a la session', strong.firstSub);
    expect(strong.profile.progress.zonesWon).toHaveLength(9);
    expect(strong.firstSub).toBeGreaterThan(0);
    expect(strong.firstSub).toBeLessThan(10);
  });

  it('la progression est monotone : zone de travail et zones gagnees ne reculent jamais', () => {
    const profile = newProfile();
    const child = new VirtualChild(AVERAGE_CHILD, 9);
    let prevFocus = 1, prevWon = 0;
    for (let i = 0; i < 60; i++) {
      const s = startSession(profile, settings, 'match', { seed: i, now });
      let q: Question | null;
      while ((q = s.next())) { const a = child.answer(q); s.submit(a.value, a.ms); }
      s.finish();
      expect(profile.progress.focusZone).toBeGreaterThanOrEqual(prevFocus);
      expect(profile.progress.zonesWon.length).toBeGreaterThanOrEqual(prevWon);
      prevFocus = profile.progress.focusZone; prevWon = profile.progress.zonesWon.length;
    }
    expect(zoneRatio(profile.progress, 1, settings.thresholdMs)).toBeGreaterThan(0);
  });
});
