# Voix edge-tts (Microsoft Edge neural) - fr-FR et es-*

Liste produite le 2026-10-09 avec `edge-tts` 7.2.8 (`tools/tts/voices.json` = données brutes). Toutes les voix sont `Friendly, Positive`, catégorie General. edge-tts ne gère que `rate`, `pitch`, `volume` (pas les styles SSML `cheerful`/`excited` : l'enthousiasme se règle avec `rate:+10%` et `pitch:+3..+5Hz`).

## Inventaire

| Locale | Pays | Femme | Homme |
|---|---|---|---|
| fr-FR | France | VivienneMultilingual, Denise, Eloise | RemyMultilingual, Henri |
| es-AR | Argentine | Elena | Tomas |
| es-BO | Bolivie | Sofia | Marcelo |
| es-CL | Chili | Catalina | Lorenzo |
| es-CO | Colombie | Salome | Gonzalo |
| es-CR | Costa Rica | Maria | Juan |
| es-CU | Cuba | Belkys | Manuel |
| es-DO | Rép. dominicaine | Ramona | Emilio |
| es-EC | Équateur | Andrea | Luis |
| es-ES | Espagne | Ximena, Elvira | Alvaro |
| es-GQ | Guinée équat. | Teresa | Javier |
| es-GT | Guatemala | Marta | Andres |
| es-HN | Honduras | Karla | Carlos |
| es-MX | Mexique | Dalia | Jorge |
| es-NI | Nicaragua | Yolanda | Federico |
| es-PA | Panama | Margarita | Roberto |
| es-PE | Pérou | Camila | Alex |
| es-PR | Porto Rico | Karina | Victor |
| es-PY | Paraguay | Tania | Mario |
| es-SV | Salvador | Lorena | Rodrigo |
| es-US | États-Unis (hispanique) | Paloma | Alonso |
| es-UY | Uruguay | Valentina | Mateo |
| es-VE | Venezuela | Paola | Sebastian |

Noms complets = `<locale>-<Nom>Neural` (ex. `es-ES-ElviraNeural`). Notes : `fr-FR-EloiseNeural` est la voix de **jeune/enfant** ; `VivienneMultilingual` / `RemyMultilingual` lisent aussi l'espagnol mais avec accent français : ne pas les utiliser pour l'espagnol. Une seule voix par pays en général : les PNJ « régionaux » se distinguent par le pays (accent) + le genre, pas par plusieurs voix de la même région.

## Casting proposé

### Maths (« Calcul Champion », 7 ans, ambiance foot / habillage TV)

| Rôle | Voix | Réglages | Usage |
|---|---|---|---|
| Coach (encouragements, consignes) | `fr-FR-HenriNeural` | rate `+8%`, pitch `+3Hz` | « Allez, tu y es presque ! », énoncés des questions |
| Commentateur (but, séries, fin de match) | `fr-FR-RemyMultilingualNeural` | rate `+18%`, pitch `+5Hz` | « Quel but ! », bandeaux « Score »; à tester contre Henri (timbre plus posé) |
| Enfant / jeune (coéquipier, mascotte) | `fr-FR-EloiseNeural` | rate `+5%`, pitch `+2Hz` | partenaire d'équipe, félicitations « entre copains » |
| Voix féminine alternative (rappels, doux) | `fr-FR-DeniseNeural` | rate `0%` | fin de session, consignes parents |

### Espagnol (« La Leyenda del Quetzal », 12 ans, 5e LVB débutant, RPG)

| Rôle | Voix | Réglages |
|---|---|---|
| Narrador (cinématiques) | `es-ES-AlvaroNeural` | rate `-10%`, pitch `-2Hz` |
| Mentor : la profesora (guide, corrige, explique) | `es-ES-ElviraNeural` | rate `-8%` |
| Compañero adolescente (aide, humour) | `es-MX-JorgeNeural` (garçon) ou `es-US-PalomaNeural` (fille) | rate `0%`, pitch `+4Hz` |
| PNJ Madrid | `es-ES-XimenaNeural` | rate `-8%` |
| PNJ Salamanca | `es-ES-AlvaroNeural` | rate `-8%`, pitch `+0Hz` (ou Elvira pour une femme) |
| PNJ Sevilla | `es-ES-ElviraNeural` | rate `-3%`, pitch `+2Hz` (même accent castillan : nuancer par le texte/graphies, pas par la voix) |
| PNJ Ciudad de México | `es-MX-DaliaNeural` | rate `-8%` |
| PNJ Oaxaca | `es-MX-JorgeNeural` | rate `-12%`, pitch `-2Hz` |
| PNJ Valencia | `es-ES-XimenaNeural` | rate `-5%`, pitch `+3Hz` |
| PNJ Buenos Aires | `es-AR-ElenaNeural` / `es-AR-TomasNeural` | rate `-8%` |
| PNJ Bogotá | `es-CO-SalomeNeural` / `es-CO-GonzaloNeural` | rate `-8%` |

Contrainte réelle : l'Espagne n'a que 3 voix (Elvira, Ximena, Alvaro) et le Mexique 2 (Dalia, Jorge). Pour 8 régions + narrateur + mentor + compagnon, on réutilise ; on différencie par `pitch` (±3 Hz), `rate` et le dialecte du texte (vosotros pour Madrid/Salamanca, ustedes pour Mexique/Amérique, voseo « vos » pour Buenos Aires).

## Vitesse recommandée (débutant)

- **Normale** (`rate` `-10%` en espagnol, `+0..+8%` en français pour les 7 ans) : lecture des dialogues et des consignes.
- **Lento** (`rate` `-30%`) : mots/phrases à répéter, correction de prononciation ; produire une 2e clé `<id>_slow` à côté de `<id>` dans le manifeste (bouton tortue).
- Éviter en dessous de `-40%` (artefacts). Pour l'espagnol débutant ne pas dépasser `-5%` en « normal » pour les PNJ, `-10%` pour narrateur/mentor.
- Phrases courtes (≤ 12 mots), ponctuation soignée (¡ ¿ , ...) : edge-tts en tire la prosodie.

## Échantillons

`tools/tts/samples/` : `fr_coach.mp3` (Henri +12% / +4Hz), `es_es_mujer.mp3` (Elvira -10%), `es_es_hombre.mp3` (Alvaro -10%), `es_mx.mp3` (Jorge -10%). Générés par `generate.py samples/manifest.json samples/`.

## Utilisation

```
tools/tts/.venv/Scripts/python tools/tts/generate.py manifeste.json dossier_sortie [--voice V] [--concurrency 3] [--retries 4] [--force] [--no-normalize]
```
Manifeste : `[{"key","text","voice","rate"?,"pitch"?,"volume"?}]`. Sortie : `<key>.mp3` (mono 24 kHz 64 kbps, silence initial coupé, -16 LUFS via ffmpeg). Cache `.tts-cache.json` (hash texte+voix+params) ; rapport `.tts-report.json`. Le service Microsoft coupe parfois la connexion : les retries (backoff) sont normaux.
