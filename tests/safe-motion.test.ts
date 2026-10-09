// @vitest-environment jsdom
// Politique "mouvement sur" (docs/architecture.md) : garde-fous statiques sur le kit d'effets CEArt, les compositions maths,
// le fond d'accueil et l'outil de controle des flashs. Le controle sur pixels est `npm run a11y:flash`.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import * as A from '../apps/maths/src/art/core/ceart.js';
import { analyze } from '../tools/a11y/flash-core.mjs';

const root = join(import.meta.dirname, '..');

/** Timeline factice : enregistre chaque tween { cible, vars d'arrivee, position }. */
type Tw = { kind: 'set' | 'to' | 'fromTo'; target: unknown; from?: Record<string, any>; vars: Record<string, any>; at: number };
function fakeTl() {
  const tw: Tw[] = [];
  const tl = {
    tw,
    set: (target: unknown, vars: any, at: number) => (tw.push({ kind: 'set', target, vars, at }), tl),
    to: (target: unknown, vars: any, at: number) => (tw.push({ kind: 'to', target, vars, at }), tl),
    fromTo: (target: unknown, from: any, vars: any, at: number) => (tw.push({ kind: 'fromTo', target, from, vars, at }), tl),
  };
  return tl;
}
const flashRoot = () => { const d = document.createElement('div'); d.innerHTML = A.stadiumFlashes({ flashes: 12 }); return d; };

afterEach(() => A.setSoft(false));

describe('kit CEArt : effets surs', () => {
  it('crowdFlashes : au plus 2 flashs par seconde, fondus >= 0,25 s', () => {
    for (const dur of [0.5, 1, 1.1, 3]) {
      const tl = fakeTl();
      A.crowdFlashes(null, tl, flashRoot(), 1, dur, 1, 5);
      const ins = tl.tw.filter((t) => t.kind === 'fromTo');
      expect(ins.length).toBeLessThanOrEqual(Math.max(1, Math.floor(2 * dur)));
      for (const t of ins) expect(t.vars.duration).toBeGreaterThanOrEqual(0.25);
      for (const t of tl.tw.filter((x) => x.kind === 'to')) expect(t.vars.duration).toBeGreaterThanOrEqual(0.25);
      const starts = ins.map((t) => t.at).sort((a, b) => a - b);
      for (let i = 0; i < starts.length; i++) expect(starts.filter((s) => s >= starts[i] && s < starts[i] + 1).length).toBeLessThanOrEqual(2);
      expect(new Set(ins.map((t) => t.target)).size).toBe(ins.length); // jamais deux fois le meme emplacement
    }
  });
  it('bloom : opacite <= 0,25 atteinte en >= 0,3 s', () => {
    const tl = fakeTl();
    A.bloom(null, tl, '#flash', 1, 0.9, 0.05);
    const up = tl.tw.find((t) => t.kind === 'fromTo')!;
    expect(up.vars.opacity).toBeLessThanOrEqual(0.25);
    expect(up.vars.duration).toBeGreaterThanOrEqual(0.3);
  });
  it('confettis : retournements lents (pas de papillotement)', () => {
    const tl = fakeTl();
    const host = document.createElement('div');
    A.confetti(null, tl, host, { at: 0, count: 60, duration: 2, seed: 3 });
    const flips = tl.tw.filter((t) => 'scaleY' in t.vars);
    expect(flips.length).toBeGreaterThan(0);
    for (const t of flips) expect(t.vars.duration).toBeGreaterThanOrEqual(0.45); // demi-periode >= 0,45 s : < 1,2 retournement/s
  });
  it('shake : amplitude plafonnee a 10 px', () => {
    const tl = fakeTl();
    A.shake(null, tl, '#cam', 0, 40, 0.4);
    for (const t of tl.tw) expect(Math.abs(t.vars.x ?? 0)).toBeLessThanOrEqual(10);
  });
  it('mode doux : ni flashs de foule ni secousse, bloom <= 0,12', () => {
    A.setSoft(true);
    const tl = fakeTl();
    A.crowdFlashes(null, tl, flashRoot(), 0, 2, 1, 1);
    A.shake(null, tl, '#cam', 0, 10, 0.4);
    expect(tl.tw.length).toBe(0);
    A.bloom(null, tl, '#flash', 0, 0.25, 0.3);
    expect(tl.tw[0].vars.opacity).toBeLessThanOrEqual(0.12);
  });
});

describe('stade : couches rasterisees, sans mode de fusion', () => {
  it('images WebP presentes (npm run art:raster)', () => {
    for (const f of Object.values(A.STADIUM_IMG) as string[]) expect(existsSync(join(root, 'apps/maths/public/cinematics/_shared/img', f))).toBe(true);
  });
  it('aucun mix-blend-mode dans le kit, 12 emplacements de flashs par defaut', () => {
    const svg = A.stadium({}) + A.stadium({ raster: './_shared/img/' });
    expect(svg).not.toMatch(/mix-blend-mode/);
    expect((A.stadiumCrowd({}).match(/class="st-flash /g) ?? []).length).toBe(12);
    expect(A.stadium({ raster: './x/', lights: 'img', flashes: 0 })).not.toMatch(/st-crowd|st-flash/);
  });
  it("fond d'accueil : images + respiration lente, aucun flash en boucle", () => {
    const src = readFileSync(join(root, 'apps/maths/src/art/StadiumBackdrop.svelte'), 'utf8');
    expect(src).toMatch(/STADIUM_IMG\.base/);
    expect(src).not.toMatch(/st-flash/);
    const d = src.match(/duration:\s*([\d.]+)/g)?.map((x) => Number(x.split(':')[1])) ?? [];
    for (const v of d) expect(v).toBeGreaterThanOrEqual(2);
  });
});

describe('compositions maths : regles statiques', () => {
  const dir = join(root, 'apps/maths/public/cinematics');
  const comps = readdirSync(dir).filter((n) => n !== '_shared' && existsSync(join(dir, n, 'index.html')));
  for (const id of comps) {
    const html = readFileSync(join(dir, id, 'index.html'), 'utf8');
    describe(id, () => {
      it('ecoute le canal "motion" (Animations douces)', () => expect(html).toMatch(/registerRuntimeDataHandler\("motion"/));
      it('pas de flash blanc plein ecran ni de mode de fusion', () => {
        expect(html).not.toMatch(/#flash \{[^}]*background: #fff;/);
        expect(html).not.toMatch(/mix-blend-mode/);
        // toute montee d'opacite de #flash passe par CEArt.bloom
        expect(html).not.toMatch(/tl\.(fromTo|to)\("#flash"[^)]*opacity: (0\.[3-9]|1)/);
      });
      it('aucun filtre anime (repeint complet a chaque image)', () => {
        expect(html).not.toMatch(/tl\.(fromTo|to)\([^;]*filter:/);
      });
    });
  }
});

describe('flash-core (analyse des flashs)', () => {
  const W = 20, H = 12, FPS = 30;
  const frames = (fn: (t: number) => number) => Array.from({ length: 60 }, (_, i) => new Float32Array(W * H).fill(fn(i)));
  it('detecte un stroboscope plein ecran a 5 Hz (echec)', () => {
    const r = analyze(frames((i) => (Math.floor(i / 3) % 2 ? 0.9 : 0.05)), { w: W, h: H, fps: FPS });
    expect(r.flashes.maxPerSecond).toBeGreaterThan(3);
    expect(r.ok).toBe(false);
  });
  it('detecte un flash blanc brutal (eblouissement)', () => {
    const r = analyze(frames((i) => (i >= 20 && i < 22 ? 0.9 : 0.05)), { w: W, h: H, fps: FPS });
    expect(r.glare.events.length).toBe(1);
    expect(r.ok).toBe(false);
  });
  it('accepte une respiration lente et un fondu doux', () => {
    const r = analyze(frames((i) => 0.1 + 0.08 * Math.sin((i / FPS) * Math.PI)), { w: W, h: H, fps: FPS });
    expect(r.ok).toBe(true);
    const fade = analyze(frames((i) => 0.05 + Math.min(1, i / 12) * 0.2), { w: W, h: H, fps: FPS });
    expect(fade.ok).toBe(true);
  });
});
