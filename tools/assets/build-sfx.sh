#!/usr/bin/env bash
# Reconstruit assets/sfx/** a partir de assets/_downloads/{kenney,mixkit} (ffmpeg requis).
# Normalisation loudnorm, silence initial supprime, mp3 (q4). Usage : bash tools/assets/build-sfx.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
K=assets/_downloads/kenney; M=assets/_downloads/mixkit; O=assets/sfx
T=$(mktemp -d)
TRIM="silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.005"
# enc <in> <out.mp3> [LUFS=-18] [extra filtres avant loudnorm] [mono=1]
enc() {
  local in="$1" out="$2" lufs="${3:--18}" pre="${4:-}" ch="${5:-1}"
  mkdir -p "$(dirname "$out")"
  local dur; dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
  local norm
  if awk "BEGIN{exit !($dur < 1.2)}"; then
    # clips courts : loudnorm peu fiable -> normalisation au pic (-3 dBFS, -8 pour les sons discrets)
    local tgt=-3; awk "BEGIN{exit !($lufs <= -22)}" && tgt=-8
    local mx; mx=$(ffmpeg -hide_banner -i "$in" -af "${pre:+$pre,}$TRIM,volumedetect" -f null - 2>&1 | grep -o 'max_volume: [-0-9.]*' | cut -d' ' -f2)
    norm="volume=$(awk "BEGIN{print $tgt - ($mx)}")dB"
  else
    norm="loudnorm=I=$lufs:TP=-2:LRA=9"
  fi
  ffmpeg -v error -y -i "$in" -af "${pre:+$pre,}$TRIM,$norm,alimiter=limit=0.8:level=0" -ac "$ch" -ar 44100 -c:a libmp3lame -q:a 4 "$out"
}
find_k() { find "$K" -name "$1" | head -1; }
# ---- ui
enc "$(find_k click1.ogg)" $O/ui/tap.mp3 -20
enc "$(find_k switch7.ogg)" $O/ui/select.mp3 -20
enc "$(find_k phaserUp4.ogg)" $O/ui/correct.mp3 -17
enc "$(find_k confirmation_001.ogg)" $O/ui/correct-pip.mp3 -17
enc "$(find_k confirmation_002.ogg)" $O/ui/correct-alt.mp3 -17
enc "$(find_k lowDown.ogg)" $O/ui/wrong-soft.mp3 -22
enc "$(find_k highDown.ogg)" $O/ui/wrong.mp3 -20
enc "$(find_k error_004.ogg)" $O/ui/wrong-pip.mp3 -20
enc "$(find_k back_001.ogg)" $O/ui/back.mp3 -20
enc "$(find_k open_001.ogg)" $O/ui/open.mp3 -20
enc "$(find_k close_001.ogg)" $O/ui/close.mp3 -20
enc "$(find_k toggle_001.ogg)" $O/ui/toggle.mp3 -20
enc "$(find_k tick_001.ogg)" $O/ui/tick.mp3 -22
enc "$(find_k maximize_003.ogg)" $O/ui/swoosh-in.mp3 -20
enc "$(find_k minimize_003.ogg)" $O/ui/swoosh-out.mp3 -20
enc "$(find_k pluck_001.ogg)" $O/ui/pop.mp3 -20
enc "$(find_k glass_003.ogg)" $O/ui/star.mp3 -20
enc "$(find_k rollover1.ogg)" $O/ui/hover.mp3 -24
enc "$(find_k scroll_001.ogg)" $O/ui/scroll.mp3 -24
for i in 1 2 3 4 5; do enc "$(find_k pepSound$i.ogg)" $O/ui/streak-$i.mp3 -18; done
enc "$(find_k powerUp2.ogg)" $O/ui/combo.mp3 -18
# ---- foot
enc $M/615.mp3 $O/foot/whistle-short.mp3 -14
enc $M/614.mp3 $O/foot/whistle-long.mp3 -14
ffmpeg -v error -y -i $M/615.mp3 -i $M/615.mp3 -i $M/614.mp3 -filter_complex "[0]adelay=0|0,apad=pad_dur=0.25[a];[1]apad=pad_dur=0.25[b];[a][b][2]concat=n=3:v=0:a=1" $T/w3.wav
enc $T/w3.wav $O/foot/whistle-triple.mp3 -18
enc $M/2099.mp3 $O/foot/kick.mp3 -16
enc $M/2108.mp3 $O/foot/kick-quick.mp3 -16
enc $M/2112.mp3 $O/foot/ball-hit.mp3 -16
# ballon dans le filet : frappe + frottement de tissu (rpg cloth) + impact mou, melanges
ffmpeg -v error -y -i $M/2108.mp3 -i "$(find_k cloth3.ogg)" -i "$(find_k impactSoft_medium_001.ogg)" \
  -filter_complex "[0]volume=0.8[a];[1]adelay=90|90,volume=1.6,lowpass=f=5000[b];[2]adelay=110|110,volume=0.9[c];[a][b][c]amix=inputs=3:normalize=0,alimiter=limit=0.9:level=0" $T/net.wav
enc $T/net.wav $O/foot/ball-net.mp3 -16
enc $M/3022.mp3 $O/foot/crowd-goal.mp3 -16 "atrim=0:7,afade=t=out:st=5.5:d=1.5" 2
enc $M/462.mp3 $O/foot/crowd-victory.mp3 -16 "atrim=0:8,afade=t=out:st=6.5:d=1.5" 2
enc $M/459.mp3 $O/foot/crowd-cheer-short.mp3 -18 "" 2
enc $M/363.mp3 $O/foot/crowd-chant.mp3 -20 "atrim=0:10,afade=t=out:st=8.5:d=1.5" 2
enc $M/469.mp3 $O/foot/crowd-ohhh.mp3 -20 "atrim=0:2.4,afade=t=in:d=0.1,afade=t=out:st=1.4:d=1.0" 2
# ambiance stade en boucle sans couture (crossfade fin -> debut)
ffmpeg -v error -y -ss 0 -t 32 -i $M/2097.mp3 -af "loudnorm=I=-26:TP=-2:LRA=9" -ar 44100 $T/amb.wav
ffmpeg -v error -y -i $T/amb.wav -ss 2 -to 32 $T/amb_main.wav
ffmpeg -v error -y -i $T/amb.wav -t 2 $T/amb_head.wav
ffmpeg -v error -y -i $T/amb_main.wav -i $T/amb_head.wav -filter_complex "acrossfade=d=1.2:c1=tri:c2=tri" $T/amb_loop.wav
mkdir -p $O/foot; ffmpeg -v error -y -i $T/amb_loop.wav -ac 2 -c:a libmp3lame -q:a 5 $O/foot/ambience-stadium-loop.mp3
enc $M/2111.mp3 $O/foot/crowd-murmur.mp3 -24 "" 2
# ---- rpg
enc "$(find_k powerUp5.ogg)" $O/rpg/level-up.mp3 -17
enc "$(find_k powerUp3.ogg)" $O/rpg/level-up-big.mp3 -17
enc "$(find_k pepSound5.ogg)" $O/rpg/item-get.mp3 -18
enc "$(find_k handleCoins.ogg)" $O/rpg/coins.mp3 -18
enc "$(find_k handleCoins2.ogg)" $O/rpg/coins-2.mp3 -18
for i in 1 2 3; do enc "$(find_k bookFlip$i.ogg)" $O/rpg/page-$i.mp3 -20; done
enc "$(find_k bookOpen.ogg)" $O/rpg/book-open.mp3 -20
enc "$(find_k bookClose.ogg)" $O/rpg/book-close.mp3 -20
enc "$(find_k phaserUp3.ogg)" $O/rpg/spell-cast.mp3 -18
enc "$(find_k zapThreeToneUp.ogg)" $O/rpg/spell-magic.mp3 -18
enc "$(find_k zap2.ogg)" $O/rpg/spell-hit.mp3 -18
ffmpeg -v error -y -i "$(find_k creak2.ogg)" -i "$(find_k metalLatch.ogg)" -i "$(find_k handleCoins2.ogg)" -filter_complex "[0]atrim=0:0.9,apad=pad_dur=0.05[a];[1]apad=pad_dur=0.05[b];[a][b][2]concat=n=3:v=0:a=1" $T/chest.wav
enc $T/chest.wav $O/rpg/chest-open.mp3 -18
enc "$(find_k doorOpen_1.ogg)" $O/rpg/door-open.mp3 -20
enc "$(find_k doorClose_1.ogg)" $O/rpg/door-close.mp3 -20
for i in 00 01 02 03; do enc "$(find_k footstep$i.ogg)" $O/rpg/step-$i.mp3 -24; done
for i in 000 001 002; do enc "$(find_k footstep_grass_$i.ogg)" $O/rpg/step-grass-$i.mp3 -24; done
enc "$(find_k drawKnife1.ogg)" $O/rpg/sword-draw.mp3 -20
enc "$(find_k knifeSlice.ogg)" $O/rpg/slash.mp3 -20
enc "$(find_k cloth1.ogg)" $O/rpg/equip.mp3 -22
enc "$(find_k impactBell_heavy_001.ogg)" $O/rpg/bell.mp3 -20
# ---- jingles (Kenney Music Jingles) : stingers courts
for j in HIT00 HIT02 HIT05 HIT08 SAX00 SAX03 STEEL00 STEEL03 NES00 NES04 PIZZI00 PIZZI05; do
  enc "$(find_k jingles_$j.ogg)" $O/jingles/$(echo $j | tr 'A-Z' 'a-z').mp3 -16 "" 2
done
rm -rf "$T"
echo done
