import { appConfig } from '../../packages/core/vite.ts';

export default appConfig({
  dir: import.meta.dirname,
  base: '/calcul/',
  name: 'Calcul — Entraînement',
  shortName: 'Calcul',
  description: "Entraînement simple au calcul : additions et soustractions, sans univers",
  themeColor: '#2563EB',
  backgroundColor: '#F6F3EA',
  foreignScopes: [],
});
