import { describe, expect, it } from 'vitest';
import { genMental, MENTAL_CATS, recordMental, newMentalStat, isMentalFluent, newMental, mentalZoneRatio, pickMentalCat } from '../src/engine/mental.ts';
import { mulberry32 } from '../src/engine/rng.ts';
import { hintFor } from '../src/engine/visuals.ts';
import { getFact, ALL_FACTS } from '../src/engine/facts.ts';
import {
  CARDS, openPack, newRewards, packsAvailable, PACK_COST, computeStars, touchStreak, dayKey, setAvatar, unlockedAvatarIds, AVATAR_ITEMS,
} from '../src/engine/rewards.ts';
import { heatmap, avgTimeSeries, summary } from '../src/engine/stats.ts';
import { newProfile, defaultEngineSettings } from '../src/engine/profile.ts';
import { newProgress, recordAnswer } from '../src/engine/progress.ts';
import { startSession } from '../src/engine/session.ts';
import { startPlacement } from '../src/engine/placement.ts';

describe('calcul mental (niveau 2)', () => {
  const rng = mulberry32(42);
  const many = (cat: (typeof MENTAL_CATS)[number], n = 400) => Array.from({ length: n }, () => genMental(rng, cat));

  it('dizaines +/- dizaines', () => {
    for (const q of many('tens')) {
      expect(q.left % 10).toBe(0);
      expect((q.right as number) % 10).toBe(0);
      expect(q.answer).toBe(q.op === '+' ? q.left + (q.right as number) : q.left - (q.right as number));
      expect(q.answer).toBeGreaterThan(0);
      expect(q.answer).toBeLessThanOrEqual(100);
    }
  });
  it('2 chiffres +/- 1 chiffre sans passage de dizaine', () => {
    for (const q of many('two-one-plain')) {
      const r = q.right as number;
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(9);
      expect(Math.floor(q.answer / 10)).toBe(Math.floor(q.left / 10));
      expect(q.answer).toBe(q.op === '+' ? q.left + r : q.left - r);
    }
  });
  it('2 chiffres +/- 1 chiffre avec passage de dizaine', () => {
    for (const q of many('two-one-carry')) {
      const r = q.right as number;
      expect(Math.floor(q.answer / 10)).not.toBe(Math.floor(q.left / 10));
      expect(q.answer).toBe(q.op === '+' ? q.left + r : q.left - r);
      expect(q.answer).toBeGreaterThanOrEqual(10);
    }
  });
  it('complement a la dizaine superieure', () => {
    for (const q of many('to-ten')) {
      expect(q.right).toBeNull();
      expect((q.left + q.answer) % 10).toBe(0);
      expect(q.answer).toBeGreaterThanOrEqual(1);
      expect(q.answer).toBeLessThanOrEqual(9);
      expect(q.text).toBe(`${q.left} + ? = ${q.left + q.answer}`);
    }
  });
  it('ids stables et nombre de chiffres', () => {
    const q = genMental(mulberry32(1), 'two-one-carry');
    expect(q.id).toBe(`m:two-one-carry:${q.text}`);
    expect(q.digits).toBe(String(q.answer).length);
  });
  it('suivi par categorie : fluent a >= 80 % des 10 derniers, seuil mental = 2 x T', () => {
    const s = newMentalStat();
    for (let i = 0; i < 7; i++) recordMental(s, true, 5000, 3000); // 5 s <= 6 s : fluent
    expect(isMentalFluent(s)).toBe(false); // pas assez de donnees
    for (let i = 0; i < 3; i++) recordMental(s, true, 5500, 3000);
    expect(isMentalFluent(s)).toBe(true);
    recordMental(s, true, 7000, 3000); recordMental(s, false, 3000, 3000);
    expect(isMentalFluent(s)).toBe(true); // 8 sur 10 = 80 %
    recordMental(s, false, 3000, 3000);
    expect(isMentalFluent(s)).toBe(false); // 7 sur 10
  });
  it('la zone 9 est gagnee quand toutes les categories sont fluentes', () => {
    const m = newMental();
    expect(mentalZoneRatio(m)).toBe(0);
    for (const c of MENTAL_CATS) for (let i = 0; i < 10; i++) recordMental(m[c], true, 2000, 3000);
    expect(mentalZoneRatio(m)).toBe(1);
  });
  it('la categorie la moins fluente est la plus travaillee', () => {
    const m = newMental();
    for (let i = 0; i < 10; i++) { recordMental(m.tens, true, 1000, 3000); recordMental(m['two-one-plain'], true, 1000, 3000); recordMental(m['to-ten'], true, 1000, 3000); recordMental(m['two-one-carry'], false, 1000, 3000); }
    const r = mulberry32(3);
    const counts: Record<string, number> = {};
    for (let i = 0; i < 400; i++) { const c = pickMentalCat(r, m); counts[c] = (counts[c] ?? 0) + 1; }
    expect(counts['two-one-carry']).toBeGreaterThan(counts.tens);
  });
});

describe('indices visuels', () => {
  it('un indice par fait, adapte a la strategie de la zone', () => {
    const kind = (id: string) => hintFor(getFact(id)).kind;
    expect(kind('7+0')).toBe('plus-zero');
    expect(kind('7+1')).toBe('number-line');
    expect(kind('4+2')).toBe('number-line');
    expect(kind('6+6')).toBe('doubles');
    expect(kind('3+7')).toBe('make-ten');
    expect(kind('6+7')).toBe('near-double');
    expect(kind('10+4')).toBe('plus-ten');
    expect(kind('9+5')).toBe('plus-nine');
    expect(kind('8+5')).toBe('bridge-ten');
    expect(kind('3+5')).toBe('ten-frame');
    expect(kind('8-3')).toBe('fact-family');
  });
  it('indice d une soustraction = la famille ("5 + 3 = 8 donc 8 − 5 = 3")', () => {
    const h = hintFor(getFact('8-5'));
    expect(h.caption).toContain('5 + 3 = 8 donc 8 − 5 = 3');
    expect(h.caption).toContain('8 − 3 = 5');
    expect(h.steps.map((s) => s.label)).toEqual(['5 + 3 = 8', '8 − 5 = 3']);
    expect(hintFor(getFact('8-4')).caption).toBe('4 + 4 = 8 donc 8 − 4 = 4.');
  });
  it('les etapes sont arithmetiquement justes', () => {
    const h = hintFor(getFact('8+5'));
    expect(h.steps.map((s) => s.value)).toEqual([10, 13]);
    expect(h.caption).toContain('13');
    const n = hintFor(getFact('9+4'));
    expect(n.steps.map((s) => s.value)).toEqual([14, 13]);
    for (const f of ALL_FACTS) {
      const hint = hintFor(f);
      expect(hint.result).toBe(f.answer);
      expect(hint.steps.at(-1)!.value).toBe(f.answer);
    }
  });
});

describe('recompenses', () => {
  it('au moins 40 cartes fictives, ids uniques, 4 raretes, champs complets', () => {
    expect(CARDS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(CARDS.length);
    expect(new Set(CARDS.map((c) => c.rarity))).toEqual(new Set(['bronze', 'argent', 'or', 'legende']));
    for (const c of CARDS) {
      expect(c.name.length).toBeGreaterThan(3);
      expect(['Gardien', 'Défenseur', 'Milieu', 'Attaquant']).toContain(c.post);
      expect(c.number).toBeGreaterThanOrEqual(1);
      expect(c.colors.primary).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
  it('paquet : coute des etoiles, jamais de doublon, album complet -> null', () => {
    const r = newRewards();
    const rng = mulberry32(5);
    expect(openPack(r, rng, 0)).toBeNull();
    r.stars = PACK_COST * CARDS.length;
    const got = new Set<string>();
    for (let i = 0; i < CARDS.length; i++) {
      const c = openPack(r, rng, i)!;
      expect(got.has(c.id)).toBe(false);
      got.add(c.id);
    }
    expect(got.size).toBe(CARDS.length);
    expect(openPack(r, rng, 0)).toBeNull();
    expect(packsAvailable(r)).toBe(0);
  });
  it('etoiles par session', () => {
    expect(computeStars({ questions: 0, correct: 0, fluent: 0 })).toBe(0);
    expect(computeStars({ questions: 20, correct: 10, fluent: 2 })).toBe(1);
    expect(computeStars({ questions: 20, correct: 19, fluent: 3 })).toBe(2);
    expect(computeStars({ questions: 20, correct: 19, fluent: 15 })).toBe(3);
    expect(computeStars({ questions: 20, correct: 19, fluent: 15, modeBonus: true, zonesWon: 1 })).toBe(5);
  });
  it('serie de jours douce : un jour manque ne casse pas, un long trou repart a 1 sans perdre le record', () => {
    const s = { current: 0, best: 0, lastDay: null as string | null, totalDays: 0 };
    const d = (n: number) => new Date(2026, 9, n, 12).getTime();
    touchStreak(s, d(1)); touchStreak(s, d(1));
    expect(s.current).toBe(1);
    touchStreak(s, d(2)); touchStreak(s, d(4)); // un jour manque
    expect(s.current).toBe(3);
    touchStreak(s, d(10));
    expect(s.current).toBe(1);
    expect(s.best).toBe(3);
    expect(s.totalDays).toBe(4);
    expect(dayKey(d(7))).toBe('2026-10-07');
  });
  it('avatar : elements debloques par etoiles / zones / medailles', () => {
    const rewards = newRewards();
    const ctx = { rewards, zonesWon: [] as number[] };
    expect(unlockedAvatarIds(ctx).sort()).toEqual(['noirs', 'vert']);
    expect(setAvatar(ctx, 'jersey', 'bleu')).toBe(false);
    rewards.stars = 8;
    expect(setAvatar(ctx, 'jersey', 'bleu')).toBe(true);
    expect(rewards.avatar.jersey).toBe('bleu');
    ctx.zonesWon.push(2);
    expect(unlockedAvatarIds(ctx)).toContain('rouge');
    expect(AVATAR_ITEMS.filter((i) => i.slot === 'jersey').length).toBeGreaterThanOrEqual(8);
    expect(setAvatar(ctx, 'boots', 'bleu')).toBe(false); // mauvais slot
  });
});

describe('statistiques', () => {
  it('carte de chaleur 11x11 : gris / rouge / orange / vert', () => {
    const p = newProgress(); p.sessionCount = 1;
    recordAnswer(p, '3+4', true, 1000, 3000, 0); recordAnswer(p, '3+4', true, 1000, 3000, 0); // vert
    recordAnswer(p, '5+6', false, 1000, 3000, 0); // rouge
    recordAnswer(p, '7+8', true, 5000, 3000, 0); // orange (lent)
    recordAnswer(p, '2+2', true, 1000, 3000, 0); // 1 seule reponse rapide : pas encore automatique
    const add = heatmap(p, '+', 3000);
    expect(add).toHaveLength(121);
    const at = (r: number, c: number) => add.find((x) => x.row === r && x.col === c)!;
    expect(at(3, 4).status).toBe('fluent');
    expect(at(3, 4).avgMs).toBe(1000);
    expect(at(5, 6).status).toBe('error');
    expect(at(5, 6).errors).toBe(1);
    expect(at(7, 8).status).toBe('slow');
    expect(at(2, 2).status).toBe('slow');
    expect(at(0, 0).status).toBe('unseen');
    const sub = heatmap(p, '-', 3000);
    expect(sub).toHaveLength(121);
    expect(sub.every((c) => c.status === 'unseen')).toBe(true);
    expect(sub.find((c) => c.row === 3 && c.col === 4)!.text).toContain('7');
  });
  it('serie du temps moyen par session et resume des zones', () => {
    const profile = newProfile();
    const settings = defaultEngineSettings();
    for (let i = 0; i < 3; i++) {
      const s = startSession(profile, settings, 'match', { seed: i, now: () => 1000 + i, questions: 6 });
      let q;
      while ((q = s.next())) s.submit(q.answer, 2000 - i * 300);
      s.finish();
    }
    const series = avgTimeSeries(profile.history);
    expect(series.map((x) => x.avgMs)).toEqual([2000, 1700, 1400]);
    expect(series.map((x) => x.n)).toEqual([1, 2, 3]);
    const sm = summary(profile, 3000);
    expect(sm.zones).toHaveLength(9);
    expect(sm.zones[0].focus).toBe(true);
    expect(sm.sessions).toBe(3);
  });
});

describe('match de detection', () => {
  it('arret apres 2 zones ratees de suite, et au plus 30 questions', () => {
    const profile = newProfile();
    const ps = startPlacement(profile, defaultEngineSettings(), { seed: 1, now: () => 1 });
    let n = 0;
    let q;
    while ((q = ps.next())) { ps.submit(q.answer + 1, 1000); n++; }
    expect(n).toBe(6);
    const r = ps.finish();
    expect(r.focusZone).toBe(1);
    expect(r.prefilled).toBe(0);
    expect(profile.progress.placementDone).toBe(true);
  });
  it('pre-remplit les faits connus des zones reussies (erreurs conservees)', () => {
    const profile = newProfile();
    const ps = startPlacement(profile, defaultEngineSettings(), { seed: 2, now: () => 1 });
    let q;
    let k = 0;
    while ((q = ps.next())) {
      if (q.zone <= 2) ps.submit(q.answer, 1500); // zones 1-2 : tout juste et vite
      else ps.submit(q.answer + 1, 1500);
      k++;
    }
    const r = ps.finish();
    expect(r.zonesPassed).toEqual([1, 2]);
    expect(r.focusZone).toBe(3);
    expect(profile.progress.zonesWon.map((z) => z.zone)).toEqual([1, 2]);
    expect(profile.progress.facts['9+1'].inferred || profile.progress.facts['9+1'].attempts > 0).toBe(true);
    expect(profile.progress.facts['9+9']).toBeUndefined();
    expect(k).toBeLessThan(15);
  });
});
