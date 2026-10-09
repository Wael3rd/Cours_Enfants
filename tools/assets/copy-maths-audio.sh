#!/bin/sh
# Copie les SFX et la musique utilises par l'app maths depuis assets/ vers apps/maths/public/audio/ (licences : assets/LICENSES.md).
cd "$(dirname "$0")/../.." || exit 1
S=assets/sfx; D=apps/maths/public/audio/sfx
mkdir -p $D apps/maths/public/audio/music
for f in tap pop correct correct-pip wrong-soft star swoosh-in swoosh-out select open tick streak-1 streak-2 streak-3 combo back close toggle; do cp $S/ui/$f.mp3 $D/; done
for f in ball-hit ball-net kick kick-quick whistle-short whistle-long whistle-triple crowd-cheer-short crowd-goal crowd-murmur crowd-ohhh crowd-victory crowd-chant; do cp $S/foot/$f.mp3 $D/; done
cp $S/jingles/hit05.mp3 $D/jingle-win.mp3; cp $S/jingles/sax03.mp3 $D/jingle-sax.mp3; cp $S/rpg/level-up.mp3 $D/level-up.mp3; cp $S/rpg/item-get.mp3 $D/item-get.mp3
cp assets/music/stade-energique.mp3 apps/maths/public/audio/music/
