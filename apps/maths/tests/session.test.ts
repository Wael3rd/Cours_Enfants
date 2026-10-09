import { describe, expect, it } from 'vitest';
import { newProfile, defaultEngineSettings, type Profile } from '../src/engine/profile.ts';
import { startSession, sprintMedal, rivalLevel, type Session, type Feedback } from '../src/engine/session.ts';
import { learningCount, isFluent, recordAnswer } from '../src/engine/progress.ts';
import { FACT_ZONE } from '../src/engine/zones.ts';
import type { Question } from '../src/engine/builder.ts';
import { VirtualChild, AVERAGE_CHILD } from './virtual-child.ts';

const settings = defaultEngineSettings();
let clock = 1_700_000_000_000;
const now = () => (clock += 1000);

/** Joue toute la session avec un enfant virtuel, renvoie les questions et retours. */
function play(s: Session, child: VirtualChild, onStep?: (q: Question, fb: Feedback) => void) {
  const log: { q: Question; fb: Feedback }[] = [];
  let q: Question | null;
  while ((q = s.next())) {
    const a = child.answer(q);
    const fb = s.submit(a.value, a.ms);
    log.push({ q, fb });
    onStep?.(q, fb);
  }
  return log;
}

describe('constructeur de session', () => {
  it('jamais deux fois le meme fait d\'affilee ; au plus 2 nouveaux non maitrises (jour 1)', () => {
    const profile = newProfile();
    const child = new VirtualChild(AVERAGE_CHILD, 3);
    for (let i = 0; i < 6; i++) {
      const s = startSession(profile, settings, 'match', { seed: 100 + i, now });
      let last = '';
      let q: Question | null;
      while ((q = s.next())) {
        expect(q.id).not.toBe(last);
        last = q.id;
        // un fait n'est introduit que s'il y a moins de 2 faits nouveaux non maitrises
        if (q.kind === 'fact' && q.isNew) expect(learningCount(profile.progress, settings.thresholdMs)).toBeLessThanOrEqual(1);
        const a = child.answer(q);
        s.submit(a.value, a.ms);
      }
      s.finish();
    }
  });

  it('une erreur revient 2 a 4 questions plus tard', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'match', { seed: 5, now, questions: 20 });
    const seq: { id: string; ok: boolean }[] = [];
    let q: Question | null;
    let i = 0;
    while ((q = s.next())) {
      const wrong = i === 0;
      s.submit(wrong ? q.answer + 1 : q.answer, 1500);
      seq.push({ id: q.id, ok: !wrong });
      i++;
    }
    const idx = seq.findIndex((x, k) => k > 0 && x.id === seq[0].id);
    expect(idx).toBeGreaterThanOrEqual(2);
    expect(idx).toBeLessThanOrEqual(4);
  });

  it('la modelisation (indice visuel) n\'apparait qu\'apres une erreur', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'match', { seed: 9, now });
    const q1 = s.next()!;
    const bad = s.submit(q1.answer + 2, 2000);
    expect(bad.correct).toBe(false);
    expect(bad.hint).not.toBeNull();
    expect(bad.modelMs).toBe(1500);
    expect(bad.expected).toBe(q1.answer);
    const q2 = s.next()!;
    const good = s.submit(q2.answer, 1000);
    expect(good.hint).toBeNull();
  });

  it('les erreurs de fin de session sont re-posees (max 3 questions en plus)', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'match', { seed: 6, now, questions: 6 });
    let n = 0;
    let q: Question | null;
    while ((q = s.next())) { s.submit(q.answer + 1, 1000); n++; if (n > 30) break; }
    expect(n).toBeLessThanOrEqual(6 + 3);
  });

  it('pas de saut : next() redonne la meme question tant qu\'on n\'a pas repondu', () => {
    const s = startSession(newProfile(), settings, 'match', { seed: 1, now });
    expect(s.next()).toBe(s.next());
    expect(() => startSession(newProfile(), settings, 'match', { seed: 1 }).submit(1, 1)).toThrow();
  });

  it('deterministe avec un seed', () => {
    const run = () => {
      const p = newProfile();
      const s = startSession(p, settings, 'match', { seed: 77, now: () => 5 });
      return play(s, new VirtualChild(AVERAGE_CHILD, 1)).map((x) => x.q.id).join(',');
    };
    expect(run()).toBe(run());
  });

  it('melange approx. 15 % nouveaux / 60 % dus ou non fluents / 25 % fluents (profil intermediaire)', () => {
    const profile = newProfile();
    const child = new VirtualChild(AVERAGE_CHILD, 2);
    for (let i = 0; i < 25; i++) {
      const s = startSession(profile, settings, 'match', { seed: i, now });
      play(s, child);
      s.finish();
    }
    // 12 sessions de plus mesurees
    let fresh = 0, fluent = 0, other = 0, total = 0;
    for (let i = 0; i < 12; i++) {
      const s = startSession(profile, settings, 'match', { seed: 500 + i, now });
      let q: Question | null;
      while ((q = s.next())) {
        const st = profile.progress.facts[q.id];
        const before = !q.id.startsWith('m:') && (!st || st.attempts === 0);
        const wasFluent = !before && isFluent(st, settings.thresholdMs);
        if (before) fresh++; else if (wasFluent) fluent++; else other++;
        total++;
        const a = child.answer(q);
        s.submit(a.value, a.ms);
      }
      s.finish();
    }
    expect(fresh / total).toBeGreaterThan(0.03);
    expect(fresh / total).toBeLessThan(0.25);
    expect(other / total).toBeGreaterThan(0.4);
    expect(fluent / total).toBeGreaterThan(0.05);
  });
});

describe('Match', () => {
  it('un but = reponse fluente ; bilan, etoiles, historique, compteur de sessions', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'match', { seed: 3, now, questions: 8 });
    expect(profile.progress.sessionCount).toBe(1);
    let goals = 0;
    let q: Question | null;
    let i = 0;
    while ((q = s.next())) {
      const fast = i % 2 === 0;
      const fb = s.submit(q.answer, fast ? 1500 : 4500);
      expect(fb.goal).toBe(fast);
      if (fb.goal) goals++;
      expect(fb.score!.goals).toBe(goals);
      i++;
    }
    const r = s.finish();
    expect(r.goals).toBe(goals);
    expect(r.errors).toBe(0);
    expect(r.stars).toBeGreaterThanOrEqual(2);
    expect(profile.history).toHaveLength(1);
    expect(profile.history[0].mode).toBe('match');
    expect(profile.rewards.stars).toBe(r.stars);
    expect(profile.rewards.streak.current).toBe(1);
    expect(s.finish()).toBe(r); // idempotent
    expect(profile.history).toHaveLength(1);
  });

  it('niveau du rival = performances recentes (matchs serres)', () => {
    expect(rivalLevel([])).toBeCloseTo(0.45);
    expect(rivalLevel([0.2, 0.4])).toBeCloseTo(0.28);
    expect(rivalLevel([0.99])).toBeLessThanOrEqual(0.85);
    expect(rivalLevel([0])).toBeGreaterThanOrEqual(0.15);
    const profile = newProfile();
    profile.matchRates = [0.7, 0.7, 0.7];
    expect(startSession(profile, settings, 'match', { seed: 1 }).rivalLevel).toBeCloseTo(0.68);
  });

  it('simulation de 200 matchs : scores serres (tout le monde gagne, perd et fait nul)', () => {
    const profile = newProfile();
    const child = new VirtualChild(AVERAGE_CHILD, 11);
    const outcomes = { win: 0, draw: 0, loss: 0 };
    const diffs: number[] = [];
    for (let i = 0; i < 200; i++) {
      const s = startSession(profile, settings, 'match', { seed: 900 + i, now });
      play(s, child);
      const r = s.finish();
      if (i >= 20) { outcomes[r.outcome!]++; diffs.push(Math.abs(r.goals! - r.rivalGoals!)); }
    }
    expect(outcomes.win).toBeGreaterThan(15);
    expect(outcomes.loss).toBeGreaterThan(15);
    expect(diffs.reduce((a, b) => a + b, 0) / diffs.length).toBeLessThan(4);
  });
});

describe('Sprint 100 m', () => {
  function sprintWith(profile: Profile, ms: number, wrongAt: number[] = []) {
    const s = startSession(profile, settings, 'sprint', { seed: 2, now });
    let i = 0;
    let q: Question | null;
    let last: Feedback | null = null;
    while ((q = s.next())) {
      last = s.submit(wrongAt.includes(i) ? q.answer + 1 : q.answer, ms);
      i++;
    }
    return { s, last: last!, r: s.finish() };
  }

  it('10 faits distincts, penalite d\'erreur, fantome = record perso', () => {
    const profile = newProfile();
    const a = sprintWith(profile, 1500);
    expect(a.r.questions).toBe(10);
    expect(new Set(a.r.perQuestion.map((x) => x.id)).size).toBe(10);
    expect(a.r.totalMs).toBe(15000);
    expect(a.r.isRecord).toBe(true);
    expect(profile.sprint.bestMs).toBe(15000);
    expect(profile.sprint.ghost).toHaveLength(10);
    expect(profile.sprint.ghost[9]).toBe(15000);
    // 2e course, plus lente : pas de record, ecart au fantome negatif
    const b = sprintWith(profile, 2000);
    expect(b.r.isRecord).toBeFalsy();
    expect(b.last.sprint!.leadMs).toBe(15000 - 20000);
    // erreur = +3 s
    const c = sprintWith(profile, 1000, [4]);
    expect(c.r.totalMs).toBe(10000 + 3000);
    expect(c.r.errors).toBe(1);
    expect(c.r.isRecord).toBeFalsy(); // un record doit etre sans faute
    // plus rapide et sans faute : nouveau record
    const d = sprintWith(profile, 1000);
    expect(d.r.isRecord).toBe(true);
    expect(profile.sprint.bestMs).toBe(10000);
  });

  it('pas d\'indice visuel en sprint (mesure pure de vitesse)', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'sprint', { seed: 2, now });
    const q = s.next()!;
    expect(s.submit(q.answer + 1, 1000).hint).toBeNull();
  });

  it('medailles : seuils relatifs au seuil de fluence (T = 3 s, ref = 30 s) et au record', () => {
    const T = 3000;
    expect(sprintMedal(40000, 0, T, null)).toBeNull(); // trop lent
    expect(sprintMedal(29000, 0, T, null)).toBe('bronze'); // sous ref
    expect(sprintMedal(29000, 2, T, null)).toBe('bronze');
    expect(sprintMedal(29000, 3, T, null)).toBeNull();
    expect(sprintMedal(23000, 1, T, null)).toBe('argent'); // <= 0,8 ref
    expect(sprintMedal(23000, 0, T, 20000)).toBe('bronze'); // > 1,1 x record
  });

  it('or : <= 0,6 ref, ou record battu sous 0,8 ref', () => {
    const T = 3000;
    expect(sprintMedal(17000, 0, T, null)).toBe('or');
    expect(sprintMedal(17000, 1, T, null)).toBe('argent');
    expect(sprintMedal(22000, 0, T, 25000)).toBe('or');
    expect(sprintMedal(22000, 0, T, 21000)).toBe('argent');
    expect(sprintMedal(31000, 0, T, 40000)).toBeNull();
    // seuil plus exigeant = medailles plus dures
    expect(sprintMedal(25000, 0, 2000, null)).toBeNull();
  });

  it('la medaille est comptee dans les recompenses', () => {
    const profile = newProfile();
    const r = sprintWith(profile, 1200).r;
    expect(r.medal).toBe('or');
    expect(profile.rewards.medals.or).toBe(1);
    expect(r.newAvatarItems).toContain('dores');
  });
});

describe('Tirs au but', () => {
  it('5 tirs sur les faits les plus difficiles', () => {
    const profile = newProfile();
    const p = profile.progress;
    p.sessionCount = 1;
    for (const id of ['3+4', '3+5', '3+6', '3+7', '3+8', '4+4', '5+5', '6+6']) {
      recordAnswer(p, id, true, 1000, 3000, 0);
      recordAnswer(p, id, true, 1000, 3000, 0);
    }
    for (const id of ['4+7', '5+8', '6+9']) { recordAnswer(p, id, false, 2000, 3000, 0); recordAnswer(p, id, true, 6000, 3000, 0); }
    p.maxUnlocked = 8; p.focusZone = 8;
    const s = startSession(profile, settings, 'penalties', { seed: 4, now });
    const asked: string[] = [];
    let q: Question | null;
    while ((q = s.next())) { asked.push(q.id); const fb = s.submit(q.answer, 1000); expect(fb.shot!.scored).toBe(true); expect(fb.shot!.topCorner).toBe(true); }
    expect(asked).toHaveLength(5);
    for (const id of ['4+7', '5+8', '6+9']) expect(asked).toContain(id);
    const r = s.finish();
    expect(r.shotsScored).toBe(5);
  });

  it('erreur = arret du gardien + modelisation', () => {
    const s = startSession(newProfile(), settings, 'penalties', { seed: 4, now });
    const q = s.next()!;
    const fb = s.submit(q.answer + 1, 1000);
    expect(fb.shot!.scored).toBe(false);
    expect(fb.hint).not.toBeNull();
  });
});

describe('Entrainement', () => {
  it('uniquement les faits de la zone choisie, avec indice visuel', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'training', { seed: 8, now, zone: 3 });
    let n = 0;
    const kinds = new Set<string>();
    let q: Question | null;
    while ((q = s.next())) {
      expect(FACT_ZONE.get(q.id)).toBe(3);
      const h = s.hint(q)!;
      kinds.add(h.kind);
      expect(h.caption.length).toBeGreaterThan(5);
      s.submit(q.answer, 2500);
      n++;
    }
    expect(n).toBeGreaterThanOrEqual(15);
    expect([...kinds]).toEqual(['doubles']);
  });
  it('zone 10 : calcul mental uniquement', () => {
    const s = startSession(newProfile(), settings, 'training', { seed: 8, now, zone: 10, questions: 10 });
    let q: Question | null;
    while ((q = s.next())) { expect(q.kind).toBe('mental'); s.submit(q.answer, 4000); }
    const r = s.finish();
    expect(r.questions).toBe(10);
  });
});

describe('fluence en sessions', () => {
  it('apres une session, un fait repondu vite deux fois devient fluent (becameFluent)', () => {
    const profile = newProfile();
    const s = startSession(profile, settings, 'match', { seed: 12, now, questions: 24 });
    const seenFluent = new Set<string>();
    let q: Question | null;
    while ((q = s.next())) { const fb = s.submit(q.answer, 1200); if (fb.becameFluent) seenFluent.add(q.id); }
    const r = s.finish();
    expect(seenFluent.size).toBeGreaterThan(0);
    expect(r.newFluentFacts.length).toBe(seenFluent.size);
  });
});
