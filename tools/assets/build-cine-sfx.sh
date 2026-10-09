#!/bin/sh
# Sons des cinematiques maths : decoupes + fondus (derives de assets/sfx/foot, CC0 Kenney / licence Mixkit, voir assets/LICENSES.md).
# Sortie : apps/maths/public/cinematics/_shared/sfx/
set -e
S=assets/sfx
O=apps/maths/public/cinematics/_shared/sfx
mkdir -p $O
cut() { # src start dur fadeIn fadeOut out [vol]
  ffmpeg -v error -y -ss "$2" -t "$3" -i "$S/$1" -af "afade=t=in:d=$4,afade=t=out:st=$(awk "BEGIN{print $3-$5}"):d=$5,volume=${7:-1}" -c:a libmp3lame -q:a 4 "$O/$6"
}
cut foot/crowd-goal.mp3 0 2.1 0.05 0.7 roar-goal.mp3
cut foot/crowd-victory.mp3 0 5.4 0.4 1.2 roar-long.mp3
cut foot/crowd-cheer-short.mp3 0 2.6 0.1 0.7 roar-short.mp3
cut foot/crowd-murmur.mp3 0 5.2 0.5 0.8 murmur.mp3 0.7
cut foot/ambience-stadium-loop.mp3 0 7.2 0.6 0.8 ambience.mp3 0.55
cut foot/crowd-chant.mp3 0 4.0 0.3 0.8 chant.mp3 0.8
cut foot/whistle-triple.mp3 0 3.9 0.02 0.3 whistle-triple.mp3
cut foot/crowd-victory.mp3 1.0 2.4 0.2 1.0 roar-outro.mp3
