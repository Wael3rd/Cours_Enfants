import { describe, expect, it } from 'vitest';
import {
  newProgress, recordAnswer, isFluent, advanceZones, forceZone, zoneRatio, BOX_INTERVAL, learningCount, isFactAvailable,
} from '../src/engine/progress.ts';
import { zoneFacts } from '../src/engine/zones.ts';
import { getFact } from '../src/engine/facts.ts';
import { newProfile, defaultEngineSettings } from '../src/engine/profile.ts';
import { startSession } from '../src/engine/session.ts';

const T = 3000;
const NOW = 1_700_000_000_000;
const fresh = () => { const p = newProgress(); p.sessionCount = 1; return p; };

describe('regles de boite (docs/maths.md)', () => {
  it('juste et fluent : boite +1', () => {
    const p = fresh();
    const o = recordAnswer(p, '3+4', true, 2000, T, NOW);
    expect(o.fluent).toBe(true);
    expect(p.facts['3+4'].box).toBe(1);
    p.sessionCount = 2;
    recordAnswer(p, '3+4', true, 2500, T, NOW);
    expect(p.facts['3+4'].box).toBe(2);
  });
  it('au plus une promotion par session', () => {
    const p = fresh();
    recordAnswer(p, '3+4', true, 1000, T, NOW);
    recordAnswer(p, '3+4', true, 1000, T, NOW);
    recordAnswer(p, '3+4', true, 1000, T, NOW);
    expect(p.facts['3+4'].box).toBe(1);
    expect(p.facts['3+4'].fluentStreak).toBe(3);
  });
  it('juste mais lent : boite inchangee, minimum 1', () => {
    const p = fresh();
    recordAnswer(p, '6+7', true, 5000, T, NOW);
    expect(p.facts['6+7'].box).toBe(1);
    p.sessionCount = 2; recordAnswer(p, '6+7', true, 1000, T, NOW);
    p.sessionCount = 3; recordAnswer(p, '6+7', true, 1000, T, NOW);
    expect(p.facts['6+7'].box).toBe(3);
    p.sessionCount = 4; recordAnswer(p, '6+7', true, 4000, T, NOW);
    expect(p.facts['6+7'].box).toBe(3);
    expect(isFluent(p.facts['6+7'], T)).toBe(false);
  });
  it('faux : boite 0, serie remise a zero, du tout de suite', () => {
    const p = fresh();
    recordAnswer(p, '6+7', true, 1000, T, NOW);
    p.sessionCount = 2;
    const o = recordAnswer(p, '6+7', false, 2000, T, NOW);
    expect(o.correct).toBe(false);
    expect(p.facts['6+7'].box).toBe(0);
    expect(p.facts['6+7'].streak).toBe(0);
    expect(p.facts['6+7'].dueAt).toBe(2 + BOX_INTERVAL[0]);
    expect(p.facts['6+7'].errors).toBe(1);
  });
  it('apres une erreur la boite peut remonter dans la meme session', () => {
    const p = fresh();
    recordAnswer(p, '6+7', true, 1000, T, NOW);
    recordAnswer(p, '6+7', false, 1000, T, NOW);
    recordAnswer(p, '6+7', true, 1000, T, NOW);
    expect(p.facts['6+7'].box).toBe(1);
  });
  it('5 derniers temps seulement ; echeance en sessions selon la boite', () => {
    const p = fresh();
    for (let i = 1; i <= 7; i++) { p.sessionCount = i; recordAnswer(p, '2+9', true, 1000 + i, T, NOW); }
    expect(p.facts['2+9'].times).toHaveLength(5);
    expect(p.facts['2+9'].times[4]).toBe(1007);
    expect(p.facts['2+9'].box).toBe(5);
    expect(p.facts['2+9'].dueAt).toBe(7 + BOX_INTERVAL[5]);
  });
  it('fluent = deux reponses rapides de suite ; le seuil est reglable', () => {
    const p = fresh();
    recordAnswer(p, '4+8', true, 2400, T, NOW);
    expect(isFluent(p.facts['4+8'], T)).toBe(false);
    recordAnswer(p, '4+8', true, 2400, T, NOW);
    expect(isFluent(p.facts['4+8'], T)).toBe(true);
    expect(isFluent(p.facts['4+8'], 2000)).toBe(false);
    expect(isFluent(p.facts['4+8'], 2500)).toBe(true);
  });
  it('credit partiel au fait commutatif, jamais fluent par credit seul', () => {
    const p = fresh();
    recordAnswer(p, '3+8', true, 1000, T, NOW);
    expect(p.facts['8+3'].credit).toBe(0.5);
    p.sessionCount = 2;
    recordAnswer(p, '3+8', true, 1000, T, NOW);
    expect(p.facts['8+3'].box).toBe(1);
    expect(isFluent(p.facts['8+3'], T)).toBe(false);
    expect(p.facts['8+3'].attempts).toBe(0);
  });
  it('compte les faits en cours d apprentissage', () => {
    const p = fresh(); p.maxUnlocked = 9;
    recordAnswer(p, '3+4', true, 1000, T, NOW);
    recordAnswer(p, '3+5', false, 1000, T, NOW);
    expect(learningCount(p, T)).toBe(2);
    recordAnswer(p, '3+4', true, 1000, T, NOW);
    expect(learningCount(p, T)).toBe(1);
  });
});

describe('zones : deblocage', () => {
  function makeFluent(p: ReturnType<typeof fresh>, ids: string[]) {
    for (const id of ids) { recordAnswer(p, id, true, 1000, T, NOW); recordAnswer(p, id, true, 1000, T, NOW); }
  }
  it('deblocage a >= 80 % de faits fluents', () => {
    const p = fresh();
    const z1 = zoneFacts(1).map((f) => f.id);
    makeFluent(p, z1.slice(0, 63)); // 63/80 = 78,75 %
    expect(advanceZones(p, T, NOW)).toEqual([]);
    expect(p.focusZone).toBe(1);
    makeFluent(p, z1.slice(63, 64)); // 64/80 = 80 %
    expect(zoneRatio(p, 1, T)).toBeCloseTo(0.8);
    expect(advanceZones(p, T, NOW)).toEqual([1]);
    expect(p.focusZone).toBe(2);
    expect(p.maxUnlocked).toBe(2);
    expect(p.zonesWon).toHaveLength(1);
  });
  it('une zone n est gagnee qu une fois', () => {
    const p = fresh();
    makeFluent(p, zoneFacts(1).map((f) => f.id));
    advanceZones(p, T, NOW);
    expect(advanceZones(p, T, NOW)).toEqual([]);
  });
  it('le parent peut forcer une zone', () => {
    const p = fresh();
    forceZone(p, 6);
    expect(p.focusZone).toBe(6);
    expect(p.maxUnlocked).toBe(6);
    expect(p.forcedZones).toContain(6);
    expect(() => forceZone(p, 11)).toThrow();
  });
});

describe('familles de nombres : soustraction debloquee par son addition', () => {
  const T3 = 3000;
  it('une soustraction n est disponible comme nouveau fait que si 3+5 ou 5+3 est fluent', () => {
    const p = fresh();
    const f = getFact('8-5');
    expect(isFactAvailable(p, f, T3)).toBe(false);
    recordAnswer(p, '3+5', true, 1000, T3, NOW);
    expect(isFactAvailable(p, f, T3)).toBe(false); // une seule reussite : pas encore fluent
    recordAnswer(p, '3+5', true, 1000, T3, NOW);
    expect(isFactAvailable(p, f, T3)).toBe(true);
    expect(isFactAvailable(p, getFact('8-3'), T3)).toBe(true);
    expect(isFactAvailable(p, getFact('7-3'), T3)).toBe(false);
    expect(isFactAvailable(p, getFact('3+5'), T3)).toBe(true);
  });
  it('en Match, aucune soustraction n est posee tant qu aucune addition n est fluente', () => {
    const profile = newProfile();
    const s = startSession(profile, defaultEngineSettings(), 'match', { seed: 3, now: () => 1, questions: 12 });
    let q;
    while ((q = s.next())) { expect(q.kind === 'fact' && q.op === '-').toBe(false); s.submit(q.answer, 5000); } // toujours lent
  });
  it('une zone est gagnee sur additions ET soustractions (80 % de 80 faits en zone 1)', () => {
    const p = fresh();
    const adds = zoneFacts(1).filter((f) => f.op === '+').map((f) => f.id);
    for (const id of adds) { recordAnswer(p, id, true, 1000, T3, NOW); recordAnswer(p, id, true, 1000, T3, NOW); }
    expect(zoneRatio(p, 1, T3)).toBeCloseTo(0.5);
    expect(advanceZones(p, T3, NOW)).toEqual([]);
  });
});
