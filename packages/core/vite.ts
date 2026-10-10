import { defineConfig, type UserConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';

export interface AppOptions {
  /** Dossier de l'app (import.meta.dirname du vite.config). */
  dir: string;
  /** '/', '/maths/', '/espagnol/' */
  base: string;
  /** Identifiant PWA explicite (relatif a start_url) ; defaut = base. Changer = nouvelle app pour Android. */
  manifestId?: string;
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  /** Sous-chemins du site a ne jamais capter par ce service worker (ex. les autres apps pour le hub). */
  foreignScopes?: string[];
  /** Motifs supplementaires exclus du precache (ex. 'audio/**' : telecharge a la demande, voir runtimeCaching). */
  precacheIgnore?: string[];
  /** Regles Workbox runtimeCaching (ex. CacheFirst dedie pour l'audio telecharge par unite). */
  runtimeCaching?: NonNullable<NonNullable<Parameters<typeof VitePWA>[0]>['workbox']>['runtimeCaching'];
}

/**
 * Config Vite commune : Svelte 5, PWA (generateSW, prompt, precache de tout), manifest propre a l'app.
 * Variables d'env (positionnees par scripts/build-all.mjs) :
 *  CE_OUT_DIR    dossier de sortie (defaut dist/<app>)
 *  CE_PUBLIC_DIR dossier public de build (copie sans les _shared dupliques, voir scripts/cinematics.mjs)
 *  CE_BASE_PREFIX prefixe du site (ex. '/Cours_Enfants/' pour GitHub Pages ; defaut '/')
 */
export function appConfig(o: AppOptions): UserConfig {
  const isHub = o.base === '/';
  const prefix = (process.env.CE_BASE_PREFIX ?? '/').replace(/\/?$/, '/');
  const withPrefix = (p: string) => prefix + p.replace(/^\//, '');
  o = { ...o, base: withPrefix(o.base), foreignScopes: (o.foreignScopes ?? []).map(withPrefix) };
  return defineConfig({
    base: o.base,
    publicDir: process.env.CE_PUBLIC_DIR ?? resolve(o.dir, 'public'),
    plugins: [
      svelte(),
      VitePWA({
        strategies: 'generateSW',
        registerType: 'prompt',
        injectRegister: false, // enregistrement via virtual:pwa-register (setupUpdater)
        manifest: {
          id: o.manifestId ?? o.base,
          name: o.name,
          short_name: o.shortName,
          description: o.description,
          lang: 'fr',
          // Le hub ne doit PAS englober les apps (sinon Android croit /espagnol/ deja installe) : scope = sa seule page.
          start_url: isHub ? `${o.base}index.html` : o.base,
          scope: isHub ? `${o.base}index.html` : o.base,
          display: 'fullscreen',
          display_override: ['fullscreen', 'standalone'],
          orientation: 'any',
          theme_color: o.themeColor,
          background_color: o.backgroundColor,
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // TOUT en precache : app, polices, images, audio, cinematiques (html/js/woff2...).
          globPatterns: ['**/*.{js,css,html,json,svg,png,jpg,jpeg,webp,gif,ico,woff,woff2,ttf,mp3,ogg,wav,m4a,mp4,webm,webmanifest}'],
          globIgnores: [...(isHub ? ['maths/**', 'espagnol/**', 'quetzal/**', 'calcul/**'] : []), ...(o.precacheIgnore ?? [])],
          runtimeCaching: o.runtimeCaching,
          maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // defaut workbox = 2 Mo : le runtime HyperFrames fait 500 Ko, une voix/musique plus
          navigateFallback: `${o.base}index.html`,
          navigateFallbackDenylist: (o.foreignScopes ?? []).map((s) => new RegExp(`^${s}`)),
          cleanupOutdatedCaches: true,
          clientsClaim: false, // mise a jour sur demande de l'utilisateur (toast)
          skipWaiting: false,
        },
      }),
    ],
    build: {
      outDir: process.env.CE_OUT_DIR ?? resolve(o.dir, 'dist'),
      emptyOutDir: !process.env.CE_KEEP_OUT,
      target: 'es2022',
    },
    server: { host: true },
  });
}
