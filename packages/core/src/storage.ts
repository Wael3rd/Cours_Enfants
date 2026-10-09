import { get, set, del } from 'idb-keyval';

export type Migration = (old: any) => any;

/** Enveloppe persistee : la version permet de migrer les anciennes sauvegardes. */
export interface Envelope<T> {
  app: string;
  version: number;
  data: T;
}

export interface StoreOptions<T> {
  /** Identifiant de l'app (cle IndexedDB `ce:<name>`). */
  name: string;
  /** Version courante du schema. */
  version: number;
  defaults: () => T;
  /** migrations[n] transforme les donnees de la version n vers n+1. */
  migrations?: Record<number, Migration>;
}

/** Applique les migrations de `from` jusqu'a `to`. Pure, testable. */
export function migrate(data: unknown, from: number, to: number, migrations: Record<number, Migration> = {}): unknown {
  let d = data;
  for (let v = from; v < to; v++) {
    const m = migrations[v];
    if (!m) throw new Error(`Migration manquante ${v} -> ${v + 1}`);
    d = m(d);
  }
  return d;
}

export function createStore<T extends object>(opts: StoreOptions<T>) {
  const key = `ce:${opts.name}`;

  /** Fusionne avec les valeurs par defaut pour tolerer les champs ajoutes. */
  const hydrate = (raw: unknown): T => ({ ...opts.defaults(), ...(raw as object) }) as T;

  function open(env: Envelope<unknown> | undefined): T {
    if (!env || typeof env !== 'object' || typeof env.version !== 'number') return opts.defaults();
    if (env.version > opts.version) {
      throw new Error(`Sauvegarde plus recente (v${env.version}) que l'app (v${opts.version})`);
    }
    return hydrate(migrate(env.data, env.version, opts.version, opts.migrations));
  }

  return {
    key,
    async load(): Promise<T> {
      try {
        return open(await get<Envelope<unknown>>(key));
      } catch (e) {
        console.error('[storage] chargement impossible, valeurs par defaut', e);
        return opts.defaults();
      }
    },
    async save(state: T): Promise<void> {
      const env: Envelope<T> = { app: opts.name, version: opts.version, data: state };
      await set(key, env);
    },
    async update(fn: (s: T) => T | void): Promise<T> {
      const cur = await this.load();
      const next = (fn(cur) as T | undefined) ?? cur;
      await this.save(next);
      return next;
    },
    async reset(): Promise<void> {
      await del(key);
    },
    /** Sauvegarde parent : texte JSON (a telecharger). */
    async exportJSON(): Promise<string> {
      const env: Envelope<T> = { app: opts.name, version: opts.version, data: await this.load() };
      return JSON.stringify(env, null, 2);
    },
    /** Restaure une sauvegarde (migre si ancienne). Leve une erreur si elle ne correspond pas a l'app. */
    async importJSON(text: string): Promise<T> {
      const env = JSON.parse(text) as Envelope<unknown>;
      if (env.app !== opts.name) throw new Error(`Sauvegarde d'une autre app (${env.app})`);
      const state = open(env);
      await this.save(state);
      return state;
    },
  };
}

export type Store<T extends object> = ReturnType<typeof createStore<T>>;

/** Declenche le telechargement d'un fichier texte (export parent). */
export function downloadText(filename: string, text: string, mime = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
