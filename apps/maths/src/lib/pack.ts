/** Ouverture d'un paquet : tirage moteur (jamais de doublon) + cinematique `card-pack` ; helpers d'affichage des cartes. */
import { openPack, randomRng, type Card } from '../engine/index.ts';
import { app } from '../state/store.svelte.ts';
import { avatarOf } from '../art/core/ceart.js';
import { cine } from './cine.ts';
import { POSITIONS } from './teams.ts';
import { say, sfx } from './sound.ts';

/** Props de <PlayerCard> pour une carte du catalogue. */
export function cardProps(c: Card) {
  const look = avatarOf(c.name);
  return {
    name: c.name,
    number: c.number,
    position: POSITIONS[c.post] ?? 'MIL',
    rarity: c.rarity,
    primary: c.colors.primary,
    secondary: c.colors.secondary,
    player: { skin: c.colors.skin, hair: look.hair, hairColor: c.colors.hair },
  };
}

/** Depense un paquet, joue la cinematique, renvoie la carte tiree (null si impossible). */
export async function openOnePack(): Promise<Card | null> {
  const card = openPack(app.state.profile.rewards, randomRng, Date.now());
  if (!card) return null;
  void app.saveNow();
  say('pack_open');
  sfx('open');
  const p = cardProps(card);
  await cine('card-pack', { card: { name: p.name, number: p.number, position: p.position, rarity: p.rarity, primary: p.primary, secondary: p.secondary } });
  sfx('item-get');
  return card;
}
