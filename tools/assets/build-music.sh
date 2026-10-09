#!/usr/bin/env bash
# Musique : Mixkit (licence Mixkit). loudnorm -20 LUFS, mp3 128k, fondu en sortie 2 s.
set -euo pipefail
cd "$(dirname "$0")/../.."
M=assets/_downloads/mixkit; O=assets/music; mkdir -p $O
enc() { d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"); ffmpeg -v error -y -i "$1" -af "loudnorm=I=-20:TP=-2:LRA=9,afade=t=out:st=$(awk "BEGIN{print $d-2}"):d=2" -ar 44100 -b:a 128k "$2"; }
enc $M/m51.mp3 $O/stade-energique.mp3   # Mixkit "Sports Highlights"
enc $M/m31.mp3 $O/aventure-douce.mp3    # Mixkit "Dreaming Big"
