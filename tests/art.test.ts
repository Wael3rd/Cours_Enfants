// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as A from '../apps/maths/src/art/core/ceart.js';

const root = join(import.meta.dirname, '..');
const svgs: Record<string, string> = {
  player: A.player({ number: 7, pose: 'course', hair: 'long', kit: 'rayures' }),
  gardien: A.gardien({}),
  coach: A.coach({}),
  bust: A.bust({}),
  crest: A.crest({ primary: '#E8212F', secondary: '#fff', initials: 'LB' }),
  ball: A.ball({}),
  goal: A.goal({}),
  sky: A.stadiumSky({}),
  crowd: A.stadiumCrowd({}),
  pitch: A.stadiumPitch({}),
  lights: A.stadiumLights({}),
  scoreBug: A.scoreBug({ scoreHome: 2, scoreAway: 1, clock: '02:14' }),
  lowerThird: A.lowerThird({ title: 'LÉO', subtitle: '7 + 8 = 15', badge: 10 }),
  card: A.cardFrame({ name: 'Léo Martin', number: 10, position: 'ATT', rarity: 'legende' }),
  cardBack: A.cardBack({}),
  pack: A.cardPack({}),
  trophy: A.trophy({}),
  medal: A.medal({ metal: 'argent' }),
  track: A.track({}),
};

describe('kit graphique CEArt', () => {
  for (const [name, svg] of Object.entries(svgs)) {
    it(`${name} : SVG bien forme`, () => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      expect(doc.querySelector('parsererror'), svg.slice(0, 120)).toBeNull();
      expect(doc.documentElement.tagName.toLowerCase()).toBe('svg');
    });
  }
  it('le joueur expose ses groupes animables', () => {
    const doc = new DOMParser().parseFromString(svgs.player, 'image/svg+xml');
    for (const c of ['p-armL', 'p-armR', 'p-legL', 'p-legR', 'p-body', 'p-head', 'p-rig']) expect(doc.querySelector('.' + c), c).not.toBeNull();
  });
  it('quatre raretes distinctes', () => {
    const l = ['bronze', 'argent', 'or', 'legende'].map((r) => A.cardFrame({ rarity: r }));
    expect(new Set(l).size).toBe(4);
  });
  it('couleurs : blason et maillot suivent les props', () => {
    expect(A.crest({ primary: '#123456' })).toContain('#123456');
    expect(A.player({ primary: '#654321' })).toContain('#654321');
  });
  it('_shared/ceart.js (IIFE) est synchronise avec la source', () => {
    const f = join(root, 'apps/maths/public/cinematics/_shared/ceart.js');
    expect(existsSync(f)).toBe(true);
    const iife = readFileSync(f, 'utf8');
    for (const n of Object.keys(A)) expect(iife).toContain(n);
    expect(iife).toContain('window.CEArt');
  });
});
