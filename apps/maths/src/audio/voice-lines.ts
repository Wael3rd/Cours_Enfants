/**
 * Toutes les repliques dites de Calcul Champion (consignes du coach, reactions du commentateur).
 * Source unique : `npm run voices` (tools/tts/maths-manifest.mjs) genere un mp3 par cle dans public/audio/fr/<cle>.mp3.
 * Les variantes d'un groupe s'appellent `<groupe>_1`, `<groupe>_2`... : `pickVariant('goal')` en tire une au hasard.
 * Aucune replique ne contient le prenom (pre-generees) ; le prenom est dit par la synthese du navigateur (voir `sayText`).
 */
export type Speaker = 'coach' | 'comm';

export interface VoiceLine {
  /** Texte dit (aussi texte de secours speechSynthesis si le mp3 manque). */
  text: string;
  who: Speaker;
}

/** Reglages edge-tts par role (voir tools/tts/voices.md). */
export const SPEAKERS: Record<Speaker, { voice: string; rate: string; pitch: string }> = {
  coach: { voice: 'fr-FR-HenriNeural', rate: '+8%', pitch: '+3Hz' },
  comm: { voice: 'fr-FR-RemyMultilingualNeural', rate: '+18%', pitch: '+5Hz' },
};

const C = (text: string): VoiceLine => ({ text, who: 'coach' });
const M = (text: string): VoiceLine => ({ text, who: 'comm' });

export const VOICE: Record<string, VoiceLine> = {
  // ---- Premier lancement
  setup_name: C("Bienvenue au club ! Un grand peut écrire ton prénom."),
  setup_club: C("Choisis le nom de ton club, tes couleurs et ton blason !"),
  setup_avatar: C("Maintenant, crée ton joueur ! Peau, cheveux, couleur et numéro."),
  placement_intro: C("Match amical de détection ! Réponds le plus vite possible. Pas de panique : c'est pour voir ce que tu sais déjà."),
  placement_end: C("Bravo ! Le coach a tout noté. Voici ton point de départ."),
  // ---- Accueil et modes
  home_welcome: C("Bienvenue au stade ! Prêt pour le match ?"),
  match_ready: C("Coup d'envoi ! Tape la réponse sur le pavé."),
  sprint_intro: C("Sprint ! Dix calculs le plus vite possible. Cours plus vite que ton record !"),
  sprint_go: M("À vos marques... Partez !"),
  penalties_intro: C("Tirs au but ! Cinq tirs sur tes calculs les plus durs. Réponds vite pour marquer !"),
  training_pick: C("Choisis une zone pour t'entraîner."),
  training_intro: C("Regarde bien le dessin, il t'aide à trouver. Ensuite, c'est à toi !"),
  training_fade: C("Maintenant, essaie avec moins d'aide !"),
  training_alone: C("Et maintenant, tout seul comme un champion !"),
  // ---- Erreurs (douces, jamais punitives)
  error_1: C("Pas grave ! Regarde le dessin."),
  error_2: C("Presque ! Regarde comment faire."),
  error_3: C("Ce n'est rien, on le revoit tout de suite."),
  error_4: C("Bien essayé ! Regarde bien."),
  // ---- Felicitations
  praise_1: C("Bravo !"),
  praise_2: C("Super !"),
  praise_3: C("Excellent !"),
  praise_4: C("Bien joué !"),
  praise_5: C("Parfait !"),
  praise_6: C("Tu es fort !"),
  // ---- Buts (commentateur enthousiaste)
  goal_1: M("Buuuut !"),
  goal_2: M("Quel but !"),
  goal_3: M("Il marque ! Quelle frappe !"),
  goal_4: M("Gooool ! Magnifique !"),
  goal_5: M("Dans la lucarne !"),
  goal_6: M("Oh là là, quel tir !"),
  goal_7: M("C'est au fond des filets !"),
  goal_8: M("Quelle patate ! But !"),
  streak_1: M("Il est en feu !"),
  streak_2: M("Quelle série incroyable !"),
  streak_3: M("Rien ne l'arrête !"),
  rival_1: M("Le rival marque, mais ce n'est pas fini !"),
  rival_2: M("Pas de panique, on revient !"),
  rival_3: M("Un but pour l'autre équipe. Allez, on y croit !"),
  // ---- Fin de match / recompenses
  fulltime_win_1: M("Victoire ! Bravo champion !"),
  fulltime_win_2: M("C'est gagné ! Quel match !"),
  fulltime_draw_1: M("Match nul ! Très beau match !"),
  fulltime_loss_1: M("Beau match ! La prochaine fois, ce sera pour toi !"),
  fulltime_loss_2: M("Quel courage ! On les aura au prochain match !"),
  stars_won: C("Tu as gagné des étoiles !"),
  pack_ready: C("Tu as un paquet de cartes ! Ouvre-le !"),
  pack_open: M("Voyons quelle carte tu as gagnée !"),
  trophy_won: M("Un trophée ! Bravo champion !"),
  album_new: C("Une nouvelle carte pour ton album !"),
  // ---- Sprint
  medal_or: M("Médaille d'or ! Incroyable !"),
  medal_argent: M("Médaille d'argent ! Bravo !"),
  medal_bronze: M("Médaille de bronze ! Bien couru !"),
  medal_none: C("Bien couru ! Retente pour battre ton temps."),
  record_new: M("Nouveau record !"),
  // ---- Tirs au but
  pen_goal_1: M("But ! Le gardien est battu !"),
  pen_goal_2: M("Dans la lucarne ! Imparable !"),
  pen_save_1: M("Quel arrêt du gardien ! Presque !"),
  pen_save_2: M("Arrêt de ouf ! Tu y étais presque !"),
  pen_save_3: M("Le gardien s'envole ! Bien tiré !"),
  pen_caught_1: C("Le gardien l'attrape. On y retourne !"),
  pen_caught_2: C("Pas cette fois ! Regarde la bonne réponse."),
  pen_end: M("C'est fini ! Quelle séance de tirs !"),
  // ---- Strategies par zone (explication du Coach, dite et affichee en court)
  strategy_1: C("Quand tu ajoutes zéro, rien ne change. Quand tu ajoutes un, c'est le nombre d'après !"),
  strategy_2: C("Plus deux, ce sont deux petits pas : le nombre d'après, et encore le nombre d'après."),
  strategy_3: C("Les doubles ! Deux équipes identiques en miroir. Sept et sept, ça fait quatorze."),
  strategy_4: C("Les amoureux de dix ! Trois et sept font dix, quatre et six aussi. Cherche ce qui manque pour faire dix."),
  strategy_5: C("Les presque-doubles ! Six plus sept, c'est le double de six, douze, plus un."),
  strategy_6: C("Plus dix, on saute une dizaine : sept devient dix-sept."),
  strategy_7: C("Plus neuf, c'est plus dix, puis moins un. Facile !"),
  strategy_8: C("Pour passer la dizaine : huit plus cinq, je complète jusqu'à dix avec deux, puis j'ajoute trois."),
  strategy_9: C("La Ligue des Champions ! On calcule d'abord avec les dizaines, puis avec les unités."),
};

/** Legende courte affichee a l'ecran avec la voix de strategie (l'enfant lit encore lentement). */
export const STRATEGY_SHOW: Record<number, string> = {
  1: '+0 : rien ne change · +1 : le suivant',
  2: '+2 : deux petits pas',
  3: 'Les doubles : en miroir',
  4: 'Amoureux de 10 : ensemble = 10',
  5: 'Presque-double : double, puis +1',
  6: '+10 : on saute une dizaine',
  7: '+9 : +10 puis −1',
  8: 'Passer la dizaine : d\'abord 10',
  9: 'Dizaines d\'abord, unités ensuite',
};

/** Cle de la voix d'une consigne de strategie. */
export const strategyKey = (zone: number) => `strategy_${zone}`;

/** Voix de l'indice visuel d'un fait (legende du moteur) : cle stable `hint_7p8` / `hint_15m7`. */
export const hintKey = (factId: string) => `hint_${factId.replace(/\+/g, 'p').replace(/[-−]/g, 'm')}`;
/** Texte lisible par la synthese : symboles dits en toutes lettres. */
export const speakable = (s: string) =>
  s.replace(/−|-/g, ' moins ').replace(/\+/g, ' plus ').replace(/=/g, ' égale ').replace(/→/g, ' puis ').replace(/\s+/g, ' ').trim();

/** Variantes d'un groupe (`praise` -> praise_1..n). */
export function variants(group: string): string[] {
  const out: string[] = [];
  for (let i = 1; VOICE[`${group}_${i}`]; i++) out.push(`${group}_${i}`);
  return out;
}

/** Emplacement des cinematiques de strategie a venir : `public/cinematics/strategy-<cle de zone>/index.html`.
 *  Ajouter ici la cle de zone (ex. 'doubles') quand la composition existe : l'entrainement la jouera avant la pratique. */
export const STRATEGY_CINEMATICS: readonly string[] = [];
