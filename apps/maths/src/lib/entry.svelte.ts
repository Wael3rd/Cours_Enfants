/** Saisie de la reponse : chiffres tapes, validation automatique au bon nombre de chiffres. */
export class AnswerEntry {
  value = $state('');
  digits = $state(1);
  /** Instant d'affichage de la question (performance.now()). */
  t0 = 0;
  reset(digits: number): void {
    this.value = '';
    this.digits = digits;
    this.t0 = performance.now();
  }
  /** Ajoute un chiffre ; renvoie true quand la reponse est complete (a valider). */
  push(d: string): boolean {
    if (this.value.length >= this.digits) return false;
    this.value += d;
    return this.value.length >= this.digits;
  }
  back(): void {
    this.value = this.value.slice(0, -1);
  }
  get number(): number {
    return Number(this.value);
  }
  get elapsed(): number {
    return performance.now() - this.t0;
  }
}
