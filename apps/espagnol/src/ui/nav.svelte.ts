export type Route =
  | { name: 'welcome' }
  | { name: 'map' }
  | { name: 'region'; unit: string }
  | { name: 'quest'; quest: string }
  | { name: 'mission' }
  | { name: 'dictionary' }
  | { name: 'profile' }
  | { name: 'settings' }
  | { name: 'credits' };

/**
 * Navigation en pile. Le bouton retour d'Android (popstate) depile ; `guard` permet a un ecran (quete en cours)
 * de demander confirmation avant de quitter : guard() renvoie true si on peut quitter.
 */
class Nav {
  stack = $state<Route[]>([{ name: 'map' }]);
  /** direction de la derniere transition (pour l'animation) */
  dir = $state<'in' | 'out'>('in');
  guard: (() => boolean) | null = null;
  private inited = false;

  get route(): Route {
    return this.stack[this.stack.length - 1];
  }

  init(first: Route): void {
    this.stack = [first];
    if (this.inited || typeof window === 'undefined') return;
    this.inited = true;
    history.replaceState({ d: 0 }, '');
    history.pushState({ d: 0 }, '');
    window.addEventListener('popstate', () => {
      if (this.stack.length > 1) {
        if (this.guard && !this.guard()) {
          history.pushState({ d: this.stack.length - 1 }, '');
          return;
        }
        this.guard = null;
        this.dir = 'out';
        this.stack = this.stack.slice(0, -1);
      } else {
        history.pushState({ d: 0 }, '');
      }
    });
  }

  go(r: Route, opts: { replace?: boolean; root?: boolean } = {}): void {
    this.guard = null;
    this.dir = 'in';
    if (opts.root) this.stack = [r];
    else if (opts.replace) this.stack = [...this.stack.slice(0, -1), r];
    else {
      this.stack = [...this.stack, r];
      if (typeof history !== 'undefined') history.pushState({ d: this.stack.length - 1 }, '');
    }
  }

  /** Retour (bouton de l'interface) : respecte `guard`. */
  back(): void {
    if (this.stack.length <= 1) return;
    if (this.guard && !this.guard()) return;
    this.guard = null;
    this.dir = 'out';
    this.stack = this.stack.slice(0, -1);
  }
}

export const nav = new Nav();
