import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { createStore, migrate } from '../../../packages/core/src/storage';
import { STATE_VERSION, defaultState, migrations, normalizeState, type AppState } from '../src/state/model.ts';
import { startSession } from '../src/engine/session.ts';

const mk = () => createStore<AppState>({ name: 'maths', version: STATE_VERSION, defaults: defaultState, migrations });

describe('etat persistant', () => {
  it('migration v1 (fondations) -> v2 : le prenom est conserve', () => {
    const out = migrate({ childName: 'Inès' }, 1, STATE_VERSION, migrations) as AppState;
    const st = normalizeState(out);
    expect(st.childName).toBe('Inès');
    expect(st.settings.thresholdMs).toBe(3000);
    expect(st.profile.progress.focusZone).toBe(1);
  });

  it('migration v2 -> v3 : zones renumerotees (9 soustractions -> 8, 10 Ligue -> 9), donnees conservees', () => {
    const old = {
      childName: 'Ana', settings: { thresholdMs: 2500 },
      profile: {
        history: [{ at: 1, mode: 'match', zone: 10, questions: 5 }, { at: 2, mode: 'match', zone: 9, questions: 5 }],
        rewards: { stars: 42 },
        progress: {
          facts: { '3+5': { attempts: 4, box: 3 } }, sessionCount: 90, focusZone: 10, maxUnlocked: 10,
          zonesWon: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((zone) => ({ zone, at: zone })), forcedZones: [9, 10], placementDone: true,
        },
      },
    };
    const st = normalizeState(migrate(old, 2, STATE_VERSION, migrations));
    const pr = st.profile.progress;
    expect(STATE_VERSION).toBe(3);
    expect(pr.zonesWon.map((w) => w.zone)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(pr.focusZone).toBe(9);
    expect(pr.maxUnlocked).toBe(9);
    expect(pr.forcedZones.sort()).toEqual([8, 9]);
    expect(pr.facts['3+5'].box).toBe(3);
    expect(pr.sessionCount).toBe(90);
    expect(st.profile.rewards.stars).toBe(42);
    expect(st.profile.history.map((h) => h.zone)).toEqual([9, 8]);
    expect(st.settings.thresholdMs).toBe(2500);
    expect(st.childName).toBe('Ana');
  });

  it('migration v2 -> v3 : un enfant en zone 5 y reste, sans perdre ses zones gagnees', () => {
    const old = { childName: 'Bo', profile: { progress: { focusZone: 5, maxUnlocked: 5, zonesWon: [1, 2, 3, 4].map((zone) => ({ zone, at: 1 })) } } };
    const pr = normalizeState(migrate(old, 2, STATE_VERSION, migrations)).profile.progress;
    expect([pr.focusZone, pr.maxUnlocked, pr.zonesWon.length]).toEqual([5, 5, 4]);
  });

  it('normalizeState complete les champs manquants et corrige les valeurs hors bornes', () => {
    const st = normalizeState({ childName: '  ', settings: { thresholdMs: 1234, sessionMinutes: 99 }, profile: { history: 'oups' } });
    expect(st.childName).toBe('Léo');
    expect(st.settings.thresholdMs).toBe(3000);
    expect(st.settings.sessionMinutes).toBe(5);
    expect(st.settings.sound).toBe(true);
    expect(st.profile.history).toEqual([]);
    expect(Object.keys(st.profile.progress.mental)).toHaveLength(4);
    expect(normalizeState(null).profile.rewards.avatar.jersey).toBe('vert');
  });

  it('sauvegarde / chargement / export / import aller-retour avec de vraies donnees', async () => {
    const store = mk();
    await store.reset();
    const st = defaultState();
    st.childName = 'Zoé';
    st.settings.thresholdMs = 2500;
    const s = startSession(st.profile, st.settings, 'match', { seed: 1, questions: 8, now: () => 1000 });
    let q;
    while ((q = s.next())) s.submit(q.answer, 1500);
    s.finish();
    await store.save(st);

    const loaded = normalizeState(await store.load());
    expect(loaded.childName).toBe('Zoé');
    expect(loaded.settings.thresholdMs).toBe(2500);
    expect(loaded.profile.history).toHaveLength(1);
    expect(Object.keys(loaded.profile.progress.facts).length).toBeGreaterThan(0);

    const text = await store.exportJSON();
    expect(JSON.parse(text).app).toBe('maths');
    await store.reset();
    expect((await store.load()).childName).toBe('Léo');
    await store.importJSON(text);
    const back = normalizeState(await store.load());
    expect(back.profile.history).toHaveLength(1);
    expect(back.profile.rewards.stars).toBe(loaded.profile.rewards.stars);
  });

  it('importer la sauvegarde d\'une autre app ou d\'une version plus recente est refuse', async () => {
    const store = mk();
    await expect(store.importJSON(JSON.stringify({ app: 'espagnol', version: 1, data: {} }))).rejects.toThrow();
    await expect(store.importJSON(JSON.stringify({ app: 'maths', version: 99, data: {} }))).rejects.toThrow();
  });

  it('une ancienne sauvegarde v1 importee est migree', async () => {
    const store = mk();
    await store.importJSON(JSON.stringify({ app: 'maths', version: 1, data: { childName: 'Max' } }));
    expect(normalizeState(await store.load()).childName).toBe('Max');
  });
});
