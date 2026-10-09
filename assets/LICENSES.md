# Licences des ressources externes

Toute ressource externe du projet est listee ici (regeneree par `python tools/assets/gen-licenses.py`, a completer a chaque ajout). Aucune marque / vraie star / IP tierce.

## Attribution obligatoire (a afficher dans l'ecran "Credits" des deux apps)

- **Animations Noto Emoji (Lottie)** : "Noto Emoji Animation (c) Google, licence CC BY 4.0" - https://googlefonts.github.io/noto-emoji-animation/ - https://creativecommons.org/licenses/by/4.0/
- **Fluent Emoji 3D** (si les WebP sont embarques) : "Fluent Emoji (c) Microsoft Corporation, licence MIT" - https://github.com/microsoft/fluentui-emoji - la notice MIT doit accompagner la redistribution.
- Les autres ressources n'exigent aucune attribution (OFL, CC0, licences Mixkit). Credit courtois recommande : Kenney (kenney.nl), Mixkit.

## Polices - SIL Open Font License 1.1 (Google Fonts), `assets/fonts/`

Sous-ensembles latin + latin-ext, woff2, declares dans `assets/fonts/fonts.css` (unicode-range). Usage commercial et embarquement autorises, pas d'attribution exigee. Texte OFL : https://openfontlicense.org/open-font-license-official-text/

| Police | Auteur | Source |
|---|---|---|
| Bebas Neue | Ryoichi Tsunekawa / Dharma Type | https://fonts.google.com/specimen/Bebas+Neue |
| Anton | Vernon Adams | https://fonts.google.com/specimen/Anton |
| Fredoka (variable) | Milena Brandao, Hafontia | https://fonts.google.com/specimen/Fredoka |
| Baloo 2 (variable) | Ek Type | https://fonts.google.com/specimen/Baloo+2 |
| Nunito (variable) | Vernon Adams, Cyreal, Jacques Le Bailly | https://fonts.google.com/specimen/Nunito |
| Lilita One | Juan Montoreano | https://fonts.google.com/specimen/Lilita+One |
| Rye | Sol Matas | https://fonts.google.com/specimen/Rye |
| Alfa Slab One | JM Solé | https://fonts.google.com/specimen/Alfa+Slab+One |

## Emoji 3D - Microsoft Fluent Emoji, licence MIT

- Source : https://github.com/microsoft/fluentui-emoji (c) Microsoft Corporation, MIT. Style "3D" (3 145 PNG, tons de peau compris) telecharge dans `assets/_downloads/fluent-3d/` (non versionne ; licence : `assets/_downloads/FLUENT-LICENSE.txt`). Index : `assets/fluent-3d-index.json`. Extraction/WebP 256 px via `tools/assets/pick-emoji.mjs`.

## Emoji animes - Google Noto Emoji Animation, `assets/lottie/`

- Source : https://googlefonts.github.io/noto-emoji-animation/ (JSON Lottie : `https://fonts.gstatic.com/s/e/notoemoji/latest/<codepoint>/lottie.json`). Auteur : Google. **Licence CC BY 4.0 - attribution obligatoire** (voir en haut).

| Fichier | Codepoint Noto |
|---|---|
| `lottie/1st-place-medal.json` | 1f947 |
| `lottie/clapping-hands.json` | 1f44f |
| `lottie/collision.json` | 1f4a5 |
| `lottie/confetti-ball.json` | 1f38a |
| `lottie/crown.json` | 1f451 |
| `lottie/crying-face.json` | 1f622 |
| `lottie/dizzy.json` | 1f4ab |
| `lottie/fire.json` | 1f525 |
| `lottie/flexed-biceps.json` | 1f4aa |
| `lottie/glowing-star.json` | 1f31f |
| `lottie/hundred-points.json` | 1f4af |
| `lottie/party-popper.json` | 1f389 |
| `lottie/partying-face.json` | 1f973 |
| `lottie/raising-hands.json` | 1f64c |
| `lottie/red-heart.json` | 2764_fe0f |
| `lottie/rocket.json` | 1f680 |
| `lottie/sleeping-face.json` | 1f634 |
| `lottie/smiling-face-with-hearts.json` | 1f970 |
| `lottie/soccer-ball.json` | 26bd |
| `lottie/sparkles.json` | 2728 |
| `lottie/star-struck.json` | 1f929 |
| `lottie/thinking-face.json` | 1f914 |
| `lottie/thumbs-up.json` | 1f44d |
| `lottie/trophy.json` | 1f3c6 |

## Sons, `assets/sfx/` (mp3 normalises ; script : `tools/assets/build-sfx.sh`)

- **Kenney** (https://kenney.nl) - packs UI Audio, Interface Sounds, Impact Sounds, Music Jingles, Digital Audio, RPG Audio. Auteur : Kenney Vleugels. **CC0 1.0** (domaine public) - https://creativecommons.org/publicdomain/zero/1.0/ - aucune attribution exigee.
- **Mixkit** (https://mixkit.co) - "Mixkit Sound Effects Free License" : usage gratuit commercial et non commercial, **aucune attribution exigee**, redistribution/revente des sons seuls interdite - https://mixkit.co/license/#sfxFree. Auteurs varies (non precises par Mixkit).
- Les fichiers sont recoupes/normalises, certains montes (triple sifflet, but dans le filet, coffre, boucle d'ambiance) a partir de ces sources.

| Fichier | Source | Page |
|---|---|---|
| `ui/tap.mp3` | Kenney UI Audio click1 | https://kenney.nl/assets/ui-audio |
| `ui/select.mp3` | Kenney UI Audio switch7 | https://kenney.nl/assets/ui-audio |
| `ui/correct.mp3` | Kenney Digital Audio phaserUp4 | https://kenney.nl/assets/digital-audio |
| `ui/correct-pip.mp3` | Kenney Interface Sounds confirmation_001 | https://kenney.nl/assets/interface-sounds |
| `ui/correct-alt.mp3` | Kenney Interface Sounds confirmation_002 | https://kenney.nl/assets/interface-sounds |
| `ui/wrong-soft.mp3` | Kenney Digital Audio lowDown | https://kenney.nl/assets/digital-audio |
| `ui/wrong.mp3` | Kenney Digital Audio highDown | https://kenney.nl/assets/digital-audio |
| `ui/wrong-pip.mp3` | Kenney Interface Sounds error_004 | https://kenney.nl/assets/interface-sounds |
| `ui/back.mp3` | Kenney Interface Sounds back_001 | https://kenney.nl/assets/interface-sounds |
| `ui/open.mp3` | Kenney Interface Sounds open_001 | https://kenney.nl/assets/interface-sounds |
| `ui/close.mp3` | Kenney Interface Sounds close_001 | https://kenney.nl/assets/interface-sounds |
| `ui/toggle.mp3` | Kenney Interface Sounds toggle_001 | https://kenney.nl/assets/interface-sounds |
| `ui/tick.mp3` | Kenney Interface Sounds tick_001 | https://kenney.nl/assets/interface-sounds |
| `ui/swoosh-in.mp3` | Kenney Interface Sounds maximize_003 | https://kenney.nl/assets/interface-sounds |
| `ui/swoosh-out.mp3` | Kenney Interface Sounds minimize_003 | https://kenney.nl/assets/interface-sounds |
| `ui/pop.mp3` | Kenney Interface Sounds pluck_001 | https://kenney.nl/assets/interface-sounds |
| `ui/star.mp3` | Kenney Interface Sounds glass_003 | https://kenney.nl/assets/interface-sounds |
| `ui/hover.mp3` | Kenney UI Audio rollover1 | https://kenney.nl/assets/ui-audio |
| `ui/scroll.mp3` | Kenney Interface Sounds scroll_001 | https://kenney.nl/assets/interface-sounds |
| `ui/combo.mp3` | Kenney Digital Audio powerUp2 | https://kenney.nl/assets/digital-audio |
| `rpg/level-up.mp3` | Kenney Digital Audio powerUp5 | https://kenney.nl/assets/digital-audio |
| `rpg/level-up-big.mp3` | Kenney Digital Audio powerUp3 | https://kenney.nl/assets/digital-audio |
| `rpg/item-get.mp3` | Kenney Digital Audio pepSound5 | https://kenney.nl/assets/digital-audio |
| `rpg/coins.mp3` | Kenney RPG Audio handleCoins | https://kenney.nl/assets/rpg-audio |
| `rpg/coins-2.mp3` | Kenney RPG Audio handleCoins2 | https://kenney.nl/assets/rpg-audio |
| `rpg/book-open.mp3` | Kenney RPG Audio bookOpen | https://kenney.nl/assets/rpg-audio |
| `rpg/book-close.mp3` | Kenney RPG Audio bookClose | https://kenney.nl/assets/rpg-audio |
| `rpg/spell-cast.mp3` | Kenney Digital Audio phaserUp3 | https://kenney.nl/assets/digital-audio |
| `rpg/spell-magic.mp3` | Kenney Digital Audio zapThreeToneUp | https://kenney.nl/assets/digital-audio |
| `rpg/spell-hit.mp3` | Kenney Digital Audio zap2 | https://kenney.nl/assets/digital-audio |
| `rpg/chest-open.mp3` | Kenney RPG Audio creak2 + metalLatch + handleCoins2 (montage) | https://kenney.nl/assets/rpg-audio |
| `rpg/door-open.mp3` | Kenney RPG Audio doorOpen_1 | https://kenney.nl/assets/rpg-audio |
| `rpg/door-close.mp3` | Kenney RPG Audio doorClose_1 | https://kenney.nl/assets/rpg-audio |
| `rpg/sword-draw.mp3` | Kenney RPG Audio drawKnife1 | https://kenney.nl/assets/rpg-audio |
| `rpg/slash.mp3` | Kenney RPG Audio knifeSlice | https://kenney.nl/assets/rpg-audio |
| `rpg/equip.mp3` | Kenney RPG Audio cloth1 | https://kenney.nl/assets/rpg-audio |
| `rpg/bell.mp3` | Kenney Impact Sounds impactBell_heavy_001 | https://kenney.nl/assets/impact-sounds |
| `ui/streak-1.mp3` | Kenney Digital Audio pepSound1 | https://kenney.nl/assets/digital-audio |
| `ui/streak-2.mp3` | Kenney Digital Audio pepSound2 | https://kenney.nl/assets/digital-audio |
| `ui/streak-3.mp3` | Kenney Digital Audio pepSound3 | https://kenney.nl/assets/digital-audio |
| `ui/streak-4.mp3` | Kenney Digital Audio pepSound4 | https://kenney.nl/assets/digital-audio |
| `ui/streak-5.mp3` | Kenney Digital Audio pepSound5 | https://kenney.nl/assets/digital-audio |
| `rpg/page-1.mp3` | Kenney RPG Audio bookFlip1 | https://kenney.nl/assets/rpg-audio |
| `rpg/page-2.mp3` | Kenney RPG Audio bookFlip2 | https://kenney.nl/assets/rpg-audio |
| `rpg/page-3.mp3` | Kenney RPG Audio bookFlip3 | https://kenney.nl/assets/rpg-audio |
| `rpg/step-00.mp3` | Kenney RPG Audio footstep00 | https://kenney.nl/assets/rpg-audio |
| `rpg/step-01.mp3` | Kenney RPG Audio footstep01 | https://kenney.nl/assets/rpg-audio |
| `rpg/step-02.mp3` | Kenney RPG Audio footstep02 | https://kenney.nl/assets/rpg-audio |
| `rpg/step-03.mp3` | Kenney RPG Audio footstep03 | https://kenney.nl/assets/rpg-audio |
| `rpg/step-grass-000.mp3` | Kenney Impact Sounds footstep_grass_000 | https://kenney.nl/assets/impact-sounds |
| `rpg/step-grass-001.mp3` | Kenney Impact Sounds footstep_grass_001 | https://kenney.nl/assets/impact-sounds |
| `rpg/step-grass-002.mp3` | Kenney Impact Sounds footstep_grass_002 | https://kenney.nl/assets/impact-sounds |
| `jingles/hit00.mp3` | Kenney Music Jingles jingles_HIT00 | https://kenney.nl/assets/music-jingles |
| `jingles/hit02.mp3` | Kenney Music Jingles jingles_HIT02 | https://kenney.nl/assets/music-jingles |
| `jingles/hit05.mp3` | Kenney Music Jingles jingles_HIT05 | https://kenney.nl/assets/music-jingles |
| `jingles/hit08.mp3` | Kenney Music Jingles jingles_HIT08 | https://kenney.nl/assets/music-jingles |
| `jingles/sax00.mp3` | Kenney Music Jingles jingles_SAX00 | https://kenney.nl/assets/music-jingles |
| `jingles/sax03.mp3` | Kenney Music Jingles jingles_SAX03 | https://kenney.nl/assets/music-jingles |
| `jingles/steel00.mp3` | Kenney Music Jingles jingles_STEEL00 | https://kenney.nl/assets/music-jingles |
| `jingles/steel03.mp3` | Kenney Music Jingles jingles_STEEL03 | https://kenney.nl/assets/music-jingles |
| `jingles/nes00.mp3` | Kenney Music Jingles jingles_NES00 | https://kenney.nl/assets/music-jingles |
| `jingles/nes04.mp3` | Kenney Music Jingles jingles_NES04 | https://kenney.nl/assets/music-jingles |
| `jingles/pizzi00.mp3` | Kenney Music Jingles jingles_PIZZI00 | https://kenney.nl/assets/music-jingles |
| `jingles/pizzi05.mp3` | Kenney Music Jingles jingles_PIZZI05 | https://kenney.nl/assets/music-jingles |
| `foot/whistle-short.mp3` | Mixkit SFX #615 "Police short whistle" | https://mixkit.co/free-sound-effects/ |
| `foot/whistle-long.mp3` | Mixkit SFX #614 "Police whistle" | https://mixkit.co/free-sound-effects/ |
| `foot/whistle-triple.mp3` | Mixkit SFX #615 "Police short whistle x2 + Police whistle (montage triple)" | https://mixkit.co/free-sound-effects/ |
| `foot/kick.mp3` | Mixkit SFX #2099 "Soccer ball kick" | https://mixkit.co/free-sound-effects/ |
| `foot/kick-quick.mp3` | Mixkit SFX #2108 "Soccer ball quick kick" | https://mixkit.co/free-sound-effects/ |
| `foot/ball-hit.mp3` | Mixkit SFX #2112 "Hitting soccer ball" | https://mixkit.co/free-sound-effects/ |
| `foot/ball-net.mp3` | Mixkit SFX #2108 "Soccer ball quick kick + Kenney RPG cloth3 + Kenney Impact impactSoft_medium_001 (montage)" | https://mixkit.co/free-sound-effects/ |
| `foot/crowd-goal.mp3` | Mixkit SFX #3022 "Stadium joy shouting crowd" | https://mixkit.co/free-sound-effects/ |
| `foot/crowd-victory.mp3` | Mixkit SFX #462 "Huge crowd cheering victory" | https://mixkit.co/free-sound-effects/ |
| `foot/crowd-cheer-short.mp3` | Mixkit SFX #459 "Male crowd cheering short" | https://mixkit.co/free-sound-effects/ |
| `foot/crowd-chant.mp3` | Mixkit SFX #363 "Stadium chaotic loud applause, drums and chants" | https://mixkit.co/free-sound-effects/ |
| `foot/crowd-ohhh.mp3` | Mixkit SFX #469 "People moaning sadly (premieres 2,4 s)" | https://mixkit.co/free-sound-effects/ |
| `foot/ambience-stadium-loop.mp3` | Mixkit SFX #2097 "Ambient sports crowd sound (32 s, boucle sans couture)" | https://mixkit.co/free-sound-effects/ |
| `foot/crowd-murmur.mp3` | Mixkit SFX #2111 "Crowd at the stadium" | https://mixkit.co/free-sound-effects/ |

## Musique, `assets/music/` (Mixkit - Stock Music Free License, aucune attribution exigee, https://mixkit.co/license/#musicFree)

| Fichier | Source |
|---|---|
| `music/stade-energique.mp3` | Mixkit Music #51 "Sports Highlights" - https://mixkit.co/free-stock-music/sports/ |
| `music/aventure-douce.mp3` | Mixkit Music #31 "Dreaming Big" - https://mixkit.co/free-stock-music/fantasy/ |

## Voix de synthese

- Generees avec `edge-tts` (voix neurales Microsoft Edge, API non officielle ; lib LGPLv3 https://github.com/rany2/edge-tts) via `tools/tts/generate.py`. Pas d'attribution exigee. Point d'attention : les conditions de l'API Microsoft ne donnent pas de licence commerciale explicite - OK pour un usage familial/prive ; a revoir (Azure Speech officiel) en cas de distribution publique.
