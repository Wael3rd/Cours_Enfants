import { appConfig } from '../../packages/core/vite.ts';

export default appConfig({
  dir: import.meta.dirname,
  base: '/maths/',
  name: 'Calcul Champion',
  shortName: 'Calcul',
  description: "Tables d'addition et calcul rapide - univers foot",
  themeColor: '#0a6b30',
  backgroundColor: '#06210f',
  foreignScopes: [],
});
