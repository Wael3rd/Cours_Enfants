#!/usr/bin/env python
"""Genere assets/LICENSES.md (inventaire des ressources). Usage : python tools/assets/gen-licenses.py"""
import glob, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))

sfx = []
def row(path, src, url):
    sfx.append(f"| `{path}` | {src} | {url} |")

kmap = {
 'ui/tap': 'UI Audio click1', 'ui/select': 'UI Audio switch7', 'ui/correct': 'Digital Audio phaserUp4',
 'ui/correct-pip': 'Interface Sounds confirmation_001', 'ui/correct-alt': 'Interface Sounds confirmation_002',
 'ui/wrong-soft': 'Digital Audio lowDown', 'ui/wrong': 'Digital Audio highDown', 'ui/wrong-pip': 'Interface Sounds error_004',
 'ui/back': 'Interface Sounds back_001', 'ui/open': 'Interface Sounds open_001', 'ui/close': 'Interface Sounds close_001',
 'ui/toggle': 'Interface Sounds toggle_001', 'ui/tick': 'Interface Sounds tick_001', 'ui/swoosh-in': 'Interface Sounds maximize_003',
 'ui/swoosh-out': 'Interface Sounds minimize_003', 'ui/pop': 'Interface Sounds pluck_001', 'ui/star': 'Interface Sounds glass_003',
 'ui/hover': 'UI Audio rollover1', 'ui/scroll': 'Interface Sounds scroll_001', 'ui/combo': 'Digital Audio powerUp2',
 'rpg/level-up': 'Digital Audio powerUp5', 'rpg/level-up-big': 'Digital Audio powerUp3', 'rpg/item-get': 'Digital Audio pepSound5',
 'rpg/coins': 'RPG Audio handleCoins', 'rpg/coins-2': 'RPG Audio handleCoins2', 'rpg/book-open': 'RPG Audio bookOpen',
 'rpg/book-close': 'RPG Audio bookClose', 'rpg/spell-cast': 'Digital Audio phaserUp3', 'rpg/spell-magic': 'Digital Audio zapThreeToneUp',
 'rpg/spell-hit': 'Digital Audio zap2', 'rpg/chest-open': 'RPG Audio creak2 + metalLatch + handleCoins2 (montage)',
 'rpg/door-open': 'RPG Audio doorOpen_1', 'rpg/door-close': 'RPG Audio doorClose_1', 'rpg/sword-draw': 'RPG Audio drawKnife1',
 'rpg/slash': 'RPG Audio knifeSlice', 'rpg/equip': 'RPG Audio cloth1', 'rpg/bell': 'Impact Sounds impactBell_heavy_001',
}
for i in (1, 2, 3, 4, 5): kmap[f'ui/streak-{i}'] = f'Digital Audio pepSound{i}'
for i in (1, 2, 3): kmap[f'rpg/page-{i}'] = f'RPG Audio bookFlip{i}'
for i in ('00', '01', '02', '03'): kmap[f'rpg/step-{i}'] = f'RPG Audio footstep{i}'
for i in ('000', '001', '002'): kmap[f'rpg/step-grass-{i}'] = f'Impact Sounds footstep_grass_{i}'
pack = {'UI Audio': 'ui-audio', 'Interface Sounds': 'interface-sounds', 'Digital Audio': 'digital-audio', 'RPG Audio': 'rpg-audio', 'Impact Sounds': 'impact-sounds'}
for k, v in kmap.items():
    pk = next(n for n in pack if v.startswith(n))
    row(k + '.mp3', f'Kenney {v}', f'https://kenney.nl/assets/{pack[pk]}')
for j in 'HIT00 HIT02 HIT05 HIT08 SAX00 SAX03 STEEL00 STEEL03 NES00 NES04 PIZZI00 PIZZI05'.split():
    row(f'jingles/{j.lower()}.mp3', f'Kenney Music Jingles jingles_{j}', 'https://kenney.nl/assets/music-jingles')
mk = {
 'foot/whistle-short': ('615', 'Police short whistle'), 'foot/whistle-long': ('614', 'Police whistle'),
 'foot/whistle-triple': ('615', 'Police short whistle x2 + Police whistle (montage triple)'),
 'foot/kick': ('2099', 'Soccer ball kick'), 'foot/kick-quick': ('2108', 'Soccer ball quick kick'), 'foot/ball-hit': ('2112', 'Hitting soccer ball'),
 'foot/ball-net': ('2108', 'Soccer ball quick kick + Kenney RPG cloth3 + Kenney Impact impactSoft_medium_001 (montage)'),
 'foot/crowd-goal': ('3022', 'Stadium joy shouting crowd'), 'foot/crowd-victory': ('462', 'Huge crowd cheering victory'),
 'foot/crowd-cheer-short': ('459', 'Male crowd cheering short'), 'foot/crowd-chant': ('363', 'Stadium chaotic loud applause, drums and chants'),
 'foot/crowd-ohhh': ('469', 'People moaning sadly (premieres 2,4 s)'),
 'foot/ambience-stadium-loop': ('2097', 'Ambient sports crowd sound (32 s, boucle sans couture)'),
 'foot/crowd-murmur': ('2111', 'Crowd at the stadium'),
}
for k, (i, t) in mk.items():
    row(k + '.mp3', f'Mixkit SFX #{i} "{t}"', 'https://mixkit.co/free-sound-effects/')

fonts = [
 ('Bebas Neue', 'Ryoichi Tsunekawa / Dharma Type', 'https://fonts.google.com/specimen/Bebas+Neue'),
 ('Anton', 'Vernon Adams', 'https://fonts.google.com/specimen/Anton'),
 ('Fredoka (variable)', 'Milena Brandao, Hafontia', 'https://fonts.google.com/specimen/Fredoka'),
 ('Baloo 2 (variable)', 'Ek Type', 'https://fonts.google.com/specimen/Baloo+2'),
 ('Nunito (variable)', 'Vernon Adams, Cyreal, Jacques Le Bailly', 'https://fonts.google.com/specimen/Nunito'),
 ('Lilita One', 'Juan Montoreano', 'https://fonts.google.com/specimen/Lilita+One'),
 ('Rye', 'Sol Matas', 'https://fonts.google.com/specimen/Rye'),
]
cp = {'party-popper': '1f389', 'confetti-ball': '1f38a', 'star-struck': '1f929', 'fire': '1f525', 'sparkles': '2728', 'trophy': '1f3c6',
      'clapping-hands': '1f44f', 'flexed-biceps': '1f4aa', 'rocket': '1f680', 'hundred-points': '1f4af', 'glowing-star': '1f31f',
      'soccer-ball': '26bd', '1st-place-medal': '1f947', 'thumbs-up': '1f44d', 'red-heart': '2764_fe0f', 'smiling-face-with-hearts': '1f970',
      'partying-face': '1f973', 'crown': '1f451', 'raising-hands': '1f64c', 'collision': '1f4a5', 'dizzy': '1f4ab', 'thinking-face': '1f914',
      'crying-face': '1f622', 'sleeping-face': '1f634'}

o = """# Licences des ressources externes

Toute ressource externe du projet est listee ici (regeneree par `python tools/assets/gen-licenses.py`, a completer a chaque ajout). Aucune marque / vraie star / IP tierce.

## Attribution obligatoire (a afficher dans l'ecran "Credits" des deux apps)

- **Animations Noto Emoji (Lottie)** : "Noto Emoji Animation (c) Google, licence CC BY 4.0" - https://googlefonts.github.io/noto-emoji-animation/ - https://creativecommons.org/licenses/by/4.0/
- **Fluent Emoji 3D** (si les WebP sont embarques) : "Fluent Emoji (c) Microsoft Corporation, licence MIT" - https://github.com/microsoft/fluentui-emoji - la notice MIT doit accompagner la redistribution.
- Les autres ressources n'exigent aucune attribution (OFL, CC0, licences Mixkit). Credit courtois recommande : Kenney (kenney.nl), Mixkit.

## Polices - SIL Open Font License 1.1 (Google Fonts), `assets/fonts/`

Sous-ensembles latin + latin-ext, woff2, declares dans `assets/fonts/fonts.css` (unicode-range). Usage commercial et embarquement autorises, pas d'attribution exigee. Texte OFL : https://openfontlicense.org/open-font-license-official-text/

| Police | Auteur | Source |
|---|---|---|
"""
for n, a, u in fonts: o += f"| {n} | {a} | {u} |\n"
o += """
## Emoji 3D - Microsoft Fluent Emoji, licence MIT

- Source : https://github.com/microsoft/fluentui-emoji (c) Microsoft Corporation, MIT. Style "3D" (3 145 PNG, tons de peau compris) telecharge dans `assets/_downloads/fluent-3d/` (non versionne ; licence : `assets/_downloads/FLUENT-LICENSE.txt`). Index : `assets/fluent-3d-index.json`. Extraction/WebP 256 px via `tools/assets/pick-emoji.mjs`.

## Emoji animes - Google Noto Emoji Animation, `assets/lottie/`

- Source : https://googlefonts.github.io/noto-emoji-animation/ (JSON Lottie : `https://fonts.gstatic.com/s/e/notoemoji/latest/<codepoint>/lottie.json`). Auteur : Google. **Licence CC BY 4.0 - attribution obligatoire** (voir en haut).

| Fichier | Codepoint Noto |
|---|---|
"""
for f in sorted(os.path.basename(x) for x in glob.glob('assets/lottie/*.json')):
    o += f"| `lottie/{f}` | {cp.get(f[:-5], '?')} |\n"
o += """
## Sons, `assets/sfx/` (mp3 normalises ; script : `tools/assets/build-sfx.sh`)

- **Kenney** (https://kenney.nl) - packs UI Audio, Interface Sounds, Impact Sounds, Music Jingles, Digital Audio, RPG Audio. Auteur : Kenney Vleugels. **CC0 1.0** (domaine public) - https://creativecommons.org/publicdomain/zero/1.0/ - aucune attribution exigee.
- **Mixkit** (https://mixkit.co) - "Mixkit Sound Effects Free License" : usage gratuit commercial et non commercial, **aucune attribution exigee**, redistribution/revente des sons seuls interdite - https://mixkit.co/license/#sfxFree. Auteurs varies (non precises par Mixkit).
- Les fichiers sont recoupes/normalises, certains montes (triple sifflet, but dans le filet, coffre, boucle d'ambiance) a partir de ces sources.

| Fichier | Source | Page |
|---|---|---|
"""
o += '\n'.join(sfx) + """

## Musique, `assets/music/` (Mixkit - Stock Music Free License, aucune attribution exigee, https://mixkit.co/license/#musicFree)

| Fichier | Source |
|---|---|
| `music/stade-energique.mp3` | Mixkit Music #51 "Sports Highlights" - https://mixkit.co/free-stock-music/sports/ |
| `music/aventure-douce.mp3` | Mixkit Music #31 "Dreaming Big" - https://mixkit.co/free-stock-music/fantasy/ |

## Voix de synthese

- Generees avec `edge-tts` (voix neurales Microsoft Edge, API non officielle ; lib LGPLv3 https://github.com/rany2/edge-tts) via `tools/tts/generate.py`. Pas d'attribution exigee. Point d'attention : les conditions de l'API Microsoft ne donnent pas de licence commerciale explicite - OK pour un usage familial/prive ; a revoir (Azure Speech officiel) en cas de distribution publique.
"""
open('assets/LICENSES.md', 'w', encoding='utf8').write(o)
print('LICENSES.md', o.count('\n'), 'lignes')
