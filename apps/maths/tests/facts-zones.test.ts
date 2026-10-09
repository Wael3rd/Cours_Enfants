import { describe, expect, it } from 'vitest';
import { ALL_FACTS, getFact, FACT_BY_ID } from '../src/engine/facts.ts';
import { ZONES, ZONE_FACTS, FACT_ZONE, MENTAL_ZONE, zoneFacts, parentIds } from '../src/engine/zones.ts';

describe('faits', () => {
  it('121 additions + 121 soustractions, ids uniques', () => {
    expect(ALL_FACTS.filter((f) => f.op === '+')).toHaveLength(121);
    expect(ALL_FACTS.filter((f) => f.op === '-')).toHaveLength(121);
    expect(FACT_BY_ID.size).toBe(242);
  });
  it('reponses correctes, c <= 20', () => {
    for (const f of ALL_FACTS) {
      if (f.op === '+') expect(f.left + f.right).toBe(f.answer);
      else {
        expect(f.left - f.right).toBe(f.answer);
        expect(f.left).toBeLessThanOrEqual(20);
        expect(f.answer).toBeLessThanOrEqual(10);
        expect(f.right).toBeLessThanOrEqual(10);
      }
    }
  });
  it('commutativite : 3+5 <-> 5+3, 8-3 <-> 8-5, symetriques sans partenaire', () => {
    expect(getFact('3+5').partner).toBe('5+3');
    expect(getFact('8-3').partner).toBe('8-5');
    expect(getFact('4+4').partner).toBeNull();
    expect(getFact('8-4').partner).toBeNull();
    for (const f of ALL_FACTS) if (f.partner) expect(getFact(f.partner).partner).toBe(f.id);
  });
});

describe('zones', () => {
  it('9 zones, chaque fait dans exactement une zone, la soustraction avec son addition parente', () => {
    expect(ZONES).toHaveLength(9);
    expect(MENTAL_ZONE).toBe(9);
    const all = ZONE_FACTS.flat();
    expect(all).toHaveLength(242);
    expect(new Set(all.map((f) => f.id)).size).toBe(242);
    for (const f of ALL_FACTS) {
      if (f.op === '+') expect(FACT_ZONE.get(f.id)).toBe(ZONES.find((z) => z.covers(f))!.id);
      else expect(FACT_ZONE.get(f.id)).toBe(Math.min(...parentIds(f).map((id) => FACT_ZONE.get(id)!)));
    }
    expect(zoneFacts(9)).toHaveLength(0);
  });
  it('tailles : autant de soustractions que d additions dans chaque zone de faits', () => {
    expect(ZONE_FACTS.map((z) => z.length)).toEqual([80, 34, 16, 8, 28, 24, 20, 32, 0]);
    for (const z of ZONE_FACTS) expect(z.filter((f) => f.op === '+').length).toBe(z.filter((f) => f.op === '-').length);
    const ids = (z: number) => zoneFacts(z).filter((f) => f.op === '+').map((f) => f.id);
    expect(ids(1)).toContain('0+0');
    expect(ids(1)).toContain('1+10');
    expect(ids(1)).toContain('10+0');
    expect(ids(2)).toContain('2+2');
    expect(ids(2)).toContain('10+2');
    expect(ids(3).sort()).toEqual(['3+3', '4+4', '5+5', '6+6', '7+7', '8+8', '9+9', '10+10'].sort());
    expect(ids(4).sort()).toEqual(['3+7', '4+6', '6+4', '7+3']);
    expect(ids(5)).toContain('6+7');
    expect(ids(5)).toContain('10+9');
    expect(ids(6)).toContain('10+5');
    expect(ids(7)).toContain('9+4');
    expect(ids(8)).toContain('8+5');
    expect(ids(8)).toContain('7+4');
  });
  it('familles : 8-5 et 8-3 sont avec 5+3 et 3+5 (zone 4 pour les amoureux de 10)', () => {
    expect(parentIds(getFact('8-5')).sort()).toEqual(['3+5', '5+3']);
    expect(parentIds(getFact('4-2'))).toEqual(['2+2']);
    expect(FACT_ZONE.get('10-3')).toBe(4);
    expect(FACT_ZONE.get('10-7')).toBe(4);
    expect(FACT_ZONE.get('8-4')).toBe(3);
    expect(FACT_ZONE.get('8-5')).toBe(8);
    expect(FACT_ZONE.get('7-6')).toBe(1); // 6+1 : +1
    expect(FACT_ZONE.get('12-10')).toBe(2); // 10+2 : +2 (avant +10)
  });
  it('priorite a la premiere zone : 5+5 est un double, 9+1 un +1, 10+10 un double', () => {
    expect(FACT_ZONE.get('5+5')).toBe(3);
    expect(FACT_ZONE.get('9+1')).toBe(1);
    expect(FACT_ZONE.get('2+8')).toBe(2);
    expect(FACT_ZONE.get('10+10')).toBe(3);
  });
});
