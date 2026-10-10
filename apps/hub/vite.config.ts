import { appConfig } from '../../packages/core/vite.ts';

export default appConfig({
  dir: import.meta.dirname,
  base: '/',
  name: 'Cours Enfants',
  shortName: 'Cours',
  description: "Accueil des applications d'apprentissage",
  themeColor: '#0b1b3a',
  backgroundColor: '#0b1b3a',
  foreignScopes: ['/maths/', '/espagnol/', '/calcul/'],
});
