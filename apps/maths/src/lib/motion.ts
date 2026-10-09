/** Reglage "Animations douces" : propage au kit d'animation partage (@ce/core : pop, shake, burst, countUp). */
import { setSoftMotion, prefersReducedMotion } from '@ce/core';
import { app } from '../state/store.svelte.ts';

/** A appeler apres le chargement de l'etat et a chaque changement du reglage. */
export function applyMotionSettings(): void {
  setSoftMotion(app.state.settings.softMotion);
}

/** Mode reduit effectif : reglage parent OU prefers-reduced-motion du systeme. */
export const softMotion = (): boolean => prefersReducedMotion();
