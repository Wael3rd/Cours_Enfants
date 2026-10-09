/**
 * La Leyenda del Quetzal — schema des contenus (REFERENCE UNIQUE).
 *
 * Fichiers :
 *   characters.json      Personaje[]
 *   units/uNN.json       Unit
 *   audio-manifest.json  AudioManifestEntry[]   (genere par tools/content/build-audio-manifest.mjs)
 *
 * Regles transversales
 * - Tout texte espagnol prononce est un `Habla` : { es, voz, audio }.
 *   `voz`   = id d'un Personaje (la voix edge-tts est celle du personnage, voir characters.json).
 *   `audio` = cle deterministe  `<voz>.<sha1(es en NFC, trim)[0..10]>`  (ex. "marina.3f9a1c07be").
 *   La variante lente (tortue) a pour cle `audio + ".lento"` ; elle est generee pour le vocabulaire,
 *   les exemples, les phrases modeles (speak.objetivo, write_free.modelo) et les exemples de grammaire.
 *   Le fichier audio est `<audio>.mp3` (c'est `tools/tts` qui le produit a partir de audio-manifest.json).
 * - Interface 100 % espagnole : toute consigne / ligne de PNJ espagnole a son `fr` (= bouton Pista).
 * - Les ids sont des slugs ASCII ; les ids de vocabulaire sont uniques sur TOUT le jeu ; une unite peut
 *   reutiliser (par id) le vocabulaire des unites precedentes sans le redeclarer.
 * - Les emojis sont des caracteres Unicode (images : Fluent Emoji 3D) ; `ilustracion` decrit une image
 *   a creer quand aucun emoji ne convient.
 */

// ───────────────────────── Bases ─────────────────────────

export type StatId = 'escuchar' | 'hablar' | 'leer' | 'escribir' | 'cultura';
export const STATS: StatId[] = ['escuchar', 'hablar', 'leer', 'escribir', 'cultura'];

export type PersonajeId = string;
export type VocabId = string;
export type AudioKey = string;
export type GrammarCardId = string;

/** Reglages de voix edge-tts propres a un personnage (ex. rate "+8%", pitch "+25Hz"). */
export interface Tono {
  rate?: string;
  pitch?: string;
}

export interface Personaje {
  id: PersonajeId;
  nombre: string;
  rol: string;
  region: string;
  /** Voix edge-tts, ex. "es-ES-ElviraNeural" */
  voz: string;
  /** Caractere emoji du portrait (Fluent Emoji 3D) */
  emoji: string;
  descripcion: string;
  tono?: Tono;
}

/** Texte espagnol prononce. */
export interface Habla {
  es: string;
  voz: PersonajeId;
  audio: AudioKey;
}

/** Habla + traduction francaise (affichee par le bouton Pista). */
export interface Linea extends Habla {
  fr: string;
}

/** Consigne d'exercice (voix `narrador`) : `fr` = pista. */
export type Consigna = Linea;

// ───────────────────────── Vocabulaire ─────────────────────────

export interface Vocab {
  id: VocabId;
  es: string;
  fr: string;
  genero?: 'm' | 'f' | 'mf';
  /** Forme plurielle si utile ("libros") */
  plural?: string;
  /** Forme feminine des noms/adjectifs de personnes ("española") */
  femenino?: string;
  /** Au moins un des deux : emoji OU ilustracion */
  emoji?: string;
  ilustracion?: string;
  tags: string[];
  ejemplo: Linea;
  /** Cle audio du mot (voix : `voz` ou "narrador") */
  audio: AudioKey;
  /** Voix du mot et de l'exemple (defaut "narrador") */
  voz?: PersonajeId;
}

// ───────────────────────── Grammaire (cartes de decouverte) ─────────────────────────

export interface EjemploGramatica extends Linea {
  /** Fragments a surligner dans `es` (ex. ["soy"]) */
  resaltar?: string[];
}

export interface GrammarCard {
  id: GrammarCardId;
  titulo: { es: string; fr: string };
  /** 2 a 5 exemples a observer AVANT la regle */
  ejemplos: EjemploGramatica[];
  /** Regle en espagnol tres simple (lue a voix haute) */
  regla: Linea;
  /** Explication / piege en francais (bouton Pista) */
  pista: string;
  /** Tableau optionnel (conjugaison, articles...) */
  tabla?: { encabezado: string[]; filas: string[][] };
}

// ───────────────────────── Etapes (Step) ─────────────────────────

interface StepBase {
  /** Unique dans le jeu : `<quest.id>-sNN` */
  id: string;
  /** Surcharge de la stat creditee (defaut : STAT_POR_DEFECTO[tipo]) */
  stat?: StatId;
}

/** Mini-paquet de cartes-objets a decouvrir (image + audio + genre). */
export interface FlashcardStep extends StepBase {
  tipo: 'flashcard';
  vocab: VocabId[];
}

/** Associer mots et images. */
export interface MatchImageStep extends StepBase {
  tipo: 'match_image';
  consigna: Consigna;
  pares: { vocab: VocabId }[];
}

export interface OpcionEscucha {
  /** Option image (emoji/ilustracion du vocab) */
  vocab?: VocabId;
  /** Option texte */
  texto?: string;
  correcta: boolean;
}

/** Ecouter un audio puis choisir l'image (modo "imagen") ou le texte (modo "texto"). Une seule `correcta`. */
export interface ListenChooseStep extends StepBase {
  tipo: 'listen_choose';
  consigna: Consigna;
  habla: Habla;
  modo: 'imagen' | 'texto';
  opciones: OpcionEscucha[];
}

/** Dictee : ecouter puis ecrire. `respuesta` + variantes acceptees (comparaison insensible a la casse/ponctuation). */
export interface DictadoStep extends StepBase {
  tipo: 'dictado';
  consigna: Consigna;
  habla: Habla;
  respuesta: string;
  aceptadas?: string[];
}

/** Texte a trou (`___`). Avec `opciones` : choix ; sans : saisie libre. */
export interface FillBlankStep extends StepBase {
  tipo: 'fill_blank';
  consigna: Consigna;
  /** Phrase avec un seul "___" */
  frase: string;
  respuesta: string;
  aceptadas?: string[];
  opciones?: string[];
  /** Phrase complete, lue apres la reponse */
  habla: Habla;
  /** Traduction de la phrase complete (pista) */
  fr?: string;
}

/** Remettre des mots dans l'ordre. `palabras` = ordre correct (le client melange). */
export interface ReorderWordsStep extends StepBase {
  tipo: 'reorder_words';
  consigna: Consigna;
  palabras: string[];
  /** Mots pieges a ne pas utiliser */
  senuelos?: string[];
  /** Phrase complete (palabras.join(" ")) */
  habla: Habla;
  fr?: string;
}

/** La Forja : radical + terminaison. forma === radical + terminacion. */
export interface ConjugarStep extends StepBase {
  tipo: 'conjugar';
  consigna: Consigna;
  verbo: string;
  /** Pronom sujet affiche (yo, tú, él, ella, nosotros…) */
  sujeto: string;
  radical: string;
  terminacion: string;
  /** Choix de terminaisons (contient `terminacion`) */
  terminaciones: string[];
  /** Forme complete conjuguee (sans pronom) */
  forma: string;
  /** "sujeto + forma", lu a voix haute apres la reponse */
  habla: Habla;
  fr?: string;
}

export interface OpcionDialogo {
  /** Replique du joueur (voix `viajero`) */
  habla: Habla;
  fr?: string;
  correcta: boolean;
  /** Reaction du PNJ si on choisit cette option */
  reaccion: Linea & { emoji: string };
}

/** Conversation a choix avec un PNJ. */
export interface DialogueChoiceStep extends StepBase {
  tipo: 'dialogue_choice';
  consigna: Consigna;
  pnj: PersonajeId;
  replica: Linea;
  opciones: OpcionDialogo[];
}

export interface PreguntaLectura {
  pregunta: Linea;
  opciones: { texto: string; correcta: boolean }[];
}

/** Texte court + questions de comprehension. */
export interface ReadAnswerStep extends StepBase {
  tipo: 'read_answer';
  consigna: Consigna;
  texto: Linea;
  preguntas: PreguntaLectura[];
}

/** Jeton de `SpeakStep.patrones` remplace par le prenom de l'eleve. */
export const NOMBRE_LIBRE = '{nombre}';

/** Hechizo : dire une phrase (Web Speech es-ES). */
export interface SpeakStep extends StepBase {
  tipo: 'speak';
  consigna: Consigna;
  /** Phrase modele (audio normal + lento) */
  objetivo: Linea;
  /**
   * Transcriptions acceptees, normalisees : NFC, minuscules, ponctuation ¿?¡!.,;:«»"“”()…—– remplacee par
   * un espace, espaces compactes (accents conserves). La 1re = objetivo normalise.
   */
  aceptadas: string[];
  /**
   * Prenom libre : gabarits normalises (comme `aceptadas`) contenant une fois NOMBRE_LIBRE ("{nombre}").
   * Le jeton accepte 1 a 3 mots quelconques : l'eleve dit SON prenom au lieu de celui du modele
   * (l'audio de `objetivo` garde "Álex"). Ex. "hola me llamo {nombre}". Une transcription est correcte
   * si elle est dans `aceptadas` OU correspond a un gabarit.
   */
  patrones?: string[];
  /** Point de phonologie travaille (explication FR) */
  foco?: string;
  hechizo?: { nombre: string; efecto: string };
}

export interface TrueFalseStep extends StepBase {
  tipo: 'true_false';
  consigna: Consigna;
  afirmacion: Linea;
  correcta: boolean;
  /** Image associee (vocab) */
  imagen?: VocabId;
  explicacion?: Linea;
}

/** Carte de decouverte : exemples -> regle (voir Unit.gramatica). */
export interface GrammarCardStep extends StepBase {
  tipo: 'grammar_card';
  ref: GrammarCardId;
}

/** Ecriture personnelle (fiche du joueur) : plantilla avec `___` pour chaque champ. */
export interface WriteFreeStep extends StepBase {
  tipo: 'write_free';
  consigna: Consigna;
  plantilla: string;
  campos: { id: string; pista: string; tipo: 'texto' | 'numero' }[];
  modelo: Linea;
  /** Stockee dans le profil du joueur */
  guardarEn: 'perfil';
}

export interface Plano {
  n: number;
  /** secondes */
  duracion: number;
  /** Description visuelle du plan (FR, pour le realisateur HyperFrames) */
  vista: string;
  camara?: string;
  personajes?: PersonajeId[];
  /** Carton / titre incruste a l'ecran (ES) */
  rotulo?: string;
  /** Repliques / voix off de ce plan, dans l'ordre (sous-titres ES synchronises) */
  lineas: Linea[];
  musica?: string;
}

export interface Escena {
  id: string;
  /** 'intro' (~8 s) | 'historia' | 'capsula' (explainer) | 'pluma' (2-4 s) */
  tipo: 'intro' | 'historia' | 'capsula' | 'pluma';
  titulo: string;
  /** Somme des plans, 1920x1080 */
  duracion: number;
  planos: Plano[];
}

/** Cinematique HyperFrames a creer par un autre worker (id stable = nom du fichier video). */
export interface CinematicRefStep extends StepBase {
  tipo: 'cinematic_ref';
  cinematica: string;
  escena: Escena;
}

export type Step =
  | FlashcardStep
  | MatchImageStep
  | ListenChooseStep
  | DictadoStep
  | FillBlankStep
  | ReorderWordsStep
  | ConjugarStep
  | DialogueChoiceStep
  | ReadAnswerStep
  | SpeakStep
  | TrueFalseStep
  | GrammarCardStep
  | WriteFreeStep
  | CinematicRefStep;

export type StepTipo = Step['tipo'];

/** Stat creditee par defaut selon le type d'etape. */
export const STAT_POR_DEFECTO: Record<StepTipo, StatId> = {
  flashcard: 'leer',
  match_image: 'leer',
  listen_choose: 'escuchar',
  dictado: 'escribir',
  fill_blank: 'escribir',
  reorder_words: 'leer',
  conjugar: 'escribir',
  dialogue_choice: 'hablar',
  read_answer: 'leer',
  speak: 'hablar',
  true_false: 'leer',
  grammar_card: 'leer',
  write_free: 'escribir',
  cinematic_ref: 'escuchar',
};

// ───────────────────────── Quetes & unites ─────────────────────────

export type QuestTipo =
  | 'cinematica'
  | 'vocabulario'
  | 'escucha'
  | 'dialogo'
  | 'forja'
  | 'lectura'
  | 'escritura'
  | 'hechizo'
  | 'cultura'
  | 'desafio';

export interface Quest {
  /** `uNN-qNN` */
  id: string;
  tipo: QuestTipo;
  /** Titre (ES) */
  titulo: string;
  emoji: string;
  /** Introduction (ES, lue par le PNJ `intro.voz`) */
  intro: Linea;
  /** Pista (FR) : de quoi parle la quete */
  pista: string;
  /** Stats creditees (en plus du detail par etape) */
  stats: StatId[];
  /** Duree indicative en minutes */
  minutos: number;
  /** Seulement pour 'desafio' : le boss */
  jefe?: { personaje: PersonajeId; vidas: number };
  steps: Step[];
}

export interface Pluma {
  numero: number;
  nombre: string;
  descripcion: Linea;
}

export interface Unit {
  /** "u01" */
  id: string;
  numero: number;
  titulo: string;
  /** Region du jeu (Madrid, Salamanca, Sevilla…) */
  lugar: string;
  emoji: string;
  /** Axes culturels du programme (1-6) */
  ejes: number[];
  /** Periode scolaire indicative ("sept") */
  periodo: string;
  /** Attendus A1+ vises */
  objetivos: { es: string; fr: string }[];
  /** Nouveau vocabulaire de l'unite (40-60) */
  vocab: Vocab[];
  gramatica: GrammarCard[];
  quests: Quest[];
  /** Plume du Quetzal recuperee a la fin de l'unite */
  pluma: Pluma;
  /** Unite EVENEMENT : ouverte seulement entre ces dates annuelles ("MM-DD"). Seule source de verite (pas de deduction par mots-cles). */
  evento?: { desde: string; hasta: string };
}

// ───────────────────────── Audio ─────────────────────────

export interface AudioManifestEntry {
  key: AudioKey;
  text: string;
  /** Voix edge-tts */
  voice: string;
  /** ex. "-25%" (variante lente ou rate du personnage) */
  rate?: string;
  /** ex. "+25Hz" */
  pitch?: string;
}
