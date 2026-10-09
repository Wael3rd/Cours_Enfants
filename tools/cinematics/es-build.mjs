// Generateur des cinematiques de l'app d'espagnol : lit u01..u0N.json (repliques, noms, titres) + durees reelles des mp3 de
// apps/espagnol/public/audio/es/ et (re)ecrit, dans chaque composition apps/espagnol/public/cinematics/<id>/index.html :
//   - le bloc  /*GEN:plan*/ ... /*/GEN:plan*/   (window.PLAN : plans, repliques, timings, mots)
//   - le bloc  <!--GEN:audio--> ... <!--/GEN:audio-->  (balises <audio> : voix, SFX, musique)
//   - data-duration de la racine
//   - copie des voix dans <id>/assets/voz/, des SFX/musique dans _shared/sfx|music/
//   - public/cinematics/manifest.json : { "<cinematica>": { parts:[{id,duration}], total } } (lecture par l'app, en suite)
// Quand une replique change (u01.json) ou que l'audio est regenere : `node tools/cinematics/es-build.mjs` -> tout suit.
// Les animations (index.html) lisent window.PLAN : aucune duree ecrite a la main.
//
// Usage : node tools/cinematics/es-build.mjs [--check] [--unit=u02]      (--check : n'ecrit rien, signale les parties > 12 s ou audio manquant)
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..', '..');
const app = join(root, 'apps', 'espagnol');
const CIN = join(app, 'public', 'cinematics');
const AUDIO = join(app, 'public', 'audio', 'es');
const ASSETS = join(root, 'assets');
const CHECK = process.argv.includes('--check');
const MAX_PART = 12;

// ---------------------------------------------------------------------------------------------------------- configuration
// parts : groupes de plans (numeros uXX.json, ou { n, lines:[1] } pour ne jouer que certaines repliques) -> une composition par groupe (<= 12 s, jouees a la suite par l'app).
// lead / tail / min : respiration (s) avant la 1re replique du plan / apres la derniere / duree minimale du plan.
// sfx : { f: 'ui/swoosh-in', at: ancre, off: decalage s, vol, max: duree max s }.  Ancres : pN (debut du plan N), pN.end,
//       lN.M (debut de la replique M du plan N), lN.M.end, wN.M.K (K-eme mot), end (fin de la partie).
const GAP = 0.3; // silence entre deux repliques d'un meme plan
const CINES = {
  'u01-intro': {
    region: 'madrid',
    music: { vol: 0.2, offsetFrom: 0 },
    parts: [{
      plans: [1, 2], lead: { 1: 0.5, 2: 0.6 }, tail: { 1: 0.3, 2: 0.6 }, min: { 1: 4.1 },
      sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0.05, vol: 0.5 },
        { f: 'jingles/steel00', at: 'w1.1.3', off: 0, vol: 0.55 },
        { f: 'rpg/spell-cast', at: 'w1.1.3', off: 0.02, vol: 0.5 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.2, vol: 0.55 },
        { f: 'rpg/bell', at: 'p2', off: 0.25, vol: 0.28 },
        { f: 'ui/star', at: 'p2', off: 2.3, vol: 0.4 },
        { f: 'ui/pop', at: 'l2.1', off: 0.9, vol: 0.3 },
      ],
    }],
  },
  'u01-historia': {
    region: 'madrid',
    music: { vol: 0.18, offsetFrom: 0 },
    parts: [
      { plans: [1], lead: { 1: 0.9 }, tail: { 1: 0.7 }, sfx: [
        { f: 'rpg/door-open', at: 'p1', off: 0.05, vol: 0.4 },
        { f: 'rpg/step-grass-000', at: 'p1', off: 0.5, vol: 0.2 },
        { f: 'ui/open', at: 'l1.1', off: -0.15, vol: 0.4 },
        { f: 'ui/pop', at: 'l1.3', off: -0.1, vol: 0.4 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [2], lead: { 2: 1.3 }, tail: { 2: 0.7 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p2', off: 0, vol: 0.45 },
        { f: 'rpg/spell-magic', at: 'p2', off: 0.1, vol: 0.28 },
        { f: 'rpg/step-00', at: 'p2', off: 1.0, vol: 0.6 },
        { f: 'rpg/item-get', at: 'p2', off: 0.9, vol: 0.18 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [3], lead: { 3: 0.8 }, tail: { 3: 0.7 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: 0, vol: 0.4 },
        { f: 'rpg/spell-hit', at: 'l3.1', off: 0.4, vol: 0.3 },
        { f: 'rpg/spell-magic', at: 'l3.1', off: 2.6, vol: 0.25 },
        { f: 'ui/pop', at: 'l3.2', off: -0.1, vol: 0.35 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [4], lead: { 4: 0.7 }, tail: { 4: 0.6 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p4', off: -0.1, vol: 0.6 },
        { f: 'rpg/step-01', at: 'p4', off: 0.0, vol: 0.4 },
        { f: 'rpg/step-02', at: 'p4', off: 0.18, vol: 0.4 },
        { f: 'rpg/step-03', at: 'p4', off: 0.36, vol: 0.4 },
        { f: 'ui/pop', at: 'l4.1', off: -0.05, vol: 0.35 },
        { f: 'jingles/nes04', at: 'w4.2.7', off: 0, vol: 0.4 },
        { f: 'rpg/level-up', at: 'l4.2.end', off: -0.35, vol: 0.5 },
      ] },
    ],
  },
  'u01-capsula-hispanos': {
    region: 'madrid',
    music: { vol: 0.2, offsetFrom: 0 },
    parts: [
      { plans: [1, 2], lead: { 1: 0.6, 2: 0.7 }, tail: { 1: 0.9, 2: 1.1 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0.0, vol: 0.4 },
        { f: 'ui/star', at: 'w1.1.1', off: -0.05, vol: 0.45 },
        { f: 'ui/star', at: 'w1.1.4', off: -0.05, vol: 0.45 },
        { f: 'ui/star', at: 'w1.1.6', off: -0.05, vol: 0.45 },
        { f: 'ui/star', at: 'w1.1.7', off: -0.05, vol: 0.5 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.1, vol: 0.45 },
        { f: 'ui/tick', at: 'p2', off: 0.9, vol: 0.35 },
        { f: 'rpg/coins', at: 'p2', off: 1.2, vol: 0.2 },
        { f: 'jingles/steel00', at: 'w2.1.2', off: 0, vol: 0.4 },
      ] },
      { plans: [3, 4], lead: { 3: 0.6, 4: 0.5 }, tail: { 3: 0.9, 4: 0.9 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: -0.1, vol: 0.5 },
        { f: 'ui/pop', at: 'w3.1.1', off: -0.05, vol: 0.55 },
        { f: 'ui/pop', at: 'w3.1.2', off: -0.05, vol: 0.55 },
        { f: 'ui/pop', at: 'w3.1.3', off: -0.05, vol: 0.55 },
        { f: 'ui/combo', at: 'w3.1.6', off: 0, vol: 0.4 },
        { f: 'ui/swoosh-out', at: 'p4', off: -0.2, vol: 0.5 },
        { f: 'rpg/spell-magic', at: 'l4.1', off: 1.0, vol: 0.3 },
        { f: 'rpg/level-up', at: 'end', off: -0.9, vol: 0.4 },
      ] },
    ],
  },
  'u01-pluma': {
    region: 'madrid',
    music: { vol: 0.2, offsetFrom: 0 },
    parts: [{
      plans: [1, 2], lead: { 1: 3.3, 2: 0.6 }, tail: { 1: 0.35, 2: 0.7 },
      sfx: [
        { f: 'rpg/spell-cast', at: 'p1', off: 0.3, vol: 0.55 },
        { f: 'rpg/spell-magic', at: 'p1', off: 0.5, vol: 0.4 },
        { f: 'rpg/spell-hit', at: 'p1', off: 1.7, vol: 0.7 },
        { f: 'rpg/item-get', at: 'p1', off: 3.1, vol: 0.55 },
        { f: 'rpg/level-up-big', at: 'l1.1', off: 0.0, vol: 0.5 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.2, vol: 0.5 },
        { f: 'ui/star', at: 'p2', off: 1.9, vol: 0.45 },
        { f: 'rpg/bell', at: 'p2', off: 1.9, vol: 0.25 },
      ],
    }],
  },
  // ------------------------------------------------------------------------------------------------------------ unite 2 : Salamanca
  'u02-intro': {
    region: 'salamanca', music: { vol: 0.2, offsetFrom: 0 },
    parts: [{
      plans: [1, 2], lead: { 1: 0.5, 2: 0.5 }, tail: { 1: 0.3, 2: 0.5 }, min: { 1: 4.1 },
      sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0.05, vol: 0.5 },
        { f: 'jingles/steel00', at: 'w1.1.3', off: 0, vol: 0.5 },
        { f: 'rpg/spell-cast', at: 'w1.1.3', off: 0.02, vol: 0.45 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.2, vol: 0.55 },
        { f: 'rpg/bell', at: 'p2', off: 1.7, vol: 0.18 },
        { f: 'ui/star', at: 'l2.1.end', off: 0.2, vol: 0.35 },
        { f: 'ui/pop', at: 'l2.2', off: 0.6, vol: 0.3 },
      ],
    }],
  },
  'u02-historia': {
    region: 'salamanca', music: { vol: 0.18, offsetFrom: 0 },
    parts: [
      { plans: [1], lead: { 1: 0.8 }, tail: { 1: 0.7 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0, vol: 0.4 },
        { f: 'rpg/step-02', at: 'l1.1', off: -0.45, vol: 0.35 },
        { f: 'rpg/step-03', at: 'l1.1', off: -0.25, vol: 0.35 },
        { f: 'ui/pop', at: 'l1.1', off: 0, vol: 0.3 },
        { f: 'rpg/bell', at: 'w1.2.5', off: 0, vol: 0.12 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [{ n: 2, lines: [1] }], lead: { 2: 1.0 }, tail: { 2: 0.5 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p2', off: 0, vol: 0.4 },
        { f: 'rpg/step-grass-000', at: 'p2', off: 0.3, vol: 0.25 },
        { f: 'rpg/step-grass-000', at: 'p2', off: 0.65, vol: 0.25 },
        { f: 'ui/pop', at: 'l2.1.end', off: -0.2, vol: 0.3 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [{ n: 2, lines: [2] }], lead: { 2: 0.5 }, tail: { 2: 0.8 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p2', off: 0, vol: 0.4 },
        { f: 'ui/open', at: 'l2.1', off: 0.2, vol: 0.25 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [3], lead: { 3: 0.8 }, tail: { 3: 0.7 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: 0, vol: 0.4 },
        { f: 'rpg/spell-hit', at: 'l3.2', off: -0.3, vol: 0.35 },
        { f: 'rpg/spell-magic', at: 'l3.2', off: 0.1, vol: 0.28 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [4], lead: { 4: 0.6 }, tail: { 4: 0.6 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p4', off: 0, vol: 0.45 },
        { f: 'rpg/spell-magic', at: 'p4', off: 0.2, vol: 0.3 },
        { f: 'ui/star', at: 'l4.1', off: 0.1, vol: 0.4 },
        { f: 'ui/pop', at: 'l4.2', off: 0.0, vol: 0.35 },
        { f: 'rpg/level-up', at: 'l4.2.end', off: -0.35, vol: 0.4 },
      ] },
    ],
  },
  'u02-capsula-cole': {
    region: 'salamanca', music: { vol: 0.2, offsetFrom: 0 },
    parts: [
      { plans: [1, 2], lead: { 1: 0.5, 2: 0.4 }, tail: { 1: 0.4, 2: 0.5 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0, vol: 0.4 },
        { f: 'ui/pop', at: 'w1.1.5', off: -0.05, vol: 0.5 },
        { f: 'ui/pop', at: 'w1.1.7', off: -0.05, vol: 0.5 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.1, vol: 0.45 },
        { f: 'ui/tick', at: 'w2.1.1', off: 0, vol: 0.3 },
        { f: 'ui/star', at: 'w2.1.9', off: -0.05, vol: 0.5 },
        { f: 'ui/correct', at: 'w2.1.11', off: 0.0, vol: 0.4 },
      ] },
      { plans: [3], lead: { 3: 0.6 }, tail: { 3: 0.8 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: 0, vol: 0.4 },
        { f: 'ui/pop', at: 'w3.1.12', off: -0.05, vol: 0.5 },
        { f: 'ui/pop', at: 'w3.1.14', off: -0.05, vol: 0.5 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [4], lead: { 4: 0.6 }, tail: { 4: 1.2 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p4', off: 0, vol: 0.4 },
        { f: 'ui/tick', at: 'l4.1', off: 0.3, vol: 0.3 },
        { f: 'rpg/level-up', at: 'l4.1.end', off: -0.7, vol: 0.4 },
      ] },
    ],
  },
  'u02-pluma': {
    region: 'salamanca', music: { vol: 0.2, offsetFrom: 0 },
    parts: [{
      plans: [1, 2], lead: { 1: 1.1, 2: 0.4 }, tail: { 1: 0.3, 2: 0.6 },
      sfx: [
        { f: 'rpg/bell', at: 'p1', off: 0.05, vol: 0.6 },
        { f: 'rpg/bell', at: 'p1', off: 0.45, vol: 0.5 },
        { f: 'rpg/bell', at: 'p1', off: 0.85, vol: 0.45 },
        { f: 'rpg/spell-magic', at: 'p1', off: 0.4, vol: 0.4 },
        { f: 'rpg/item-get', at: 'p1', off: 0.9, vol: 0.45 },
        { f: 'rpg/level-up-big', at: 'l1.1', off: 0.0, vol: 0.45 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.2, vol: 0.5 },
        { f: 'ui/star', at: 'p2', off: 1.3, vol: 0.4 },
        { f: 'rpg/spell-cast', at: 'l2.1', off: 0.8, vol: 0.3 },
      ],
    }],
  },
  // ------------------------------------------------------------------------------------------------------------ unite 3 : Sevilla
  'u03-intro': {
    region: 'sevilla', music: { vol: 0.2, offsetFrom: 0 },
    parts: [{
      plans: [1, 2], lead: { 1: 0.5, 2: 0.5 }, tail: { 1: 0.3, 2: 0.5 }, min: { 1: 4.0 },
      sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0.05, vol: 0.5 },
        { f: 'jingles/steel00', at: 'w1.1.3', off: 0, vol: 0.5 },
        { f: 'rpg/spell-cast', at: 'w1.1.3', off: 0.02, vol: 0.45 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.2, vol: 0.55 },
        { f: 'ui/star', at: 'l2.1.end', off: 0.1, vol: 0.35 },
        { f: 'ui/pop', at: 'l2.2', off: 0.9, vol: 0.3 },
      ],
    }],
  },
  'u03-historia': {
    region: 'sevilla', music: { vol: 0.18, offsetFrom: 0 },
    parts: [
      { plans: [1], lead: { 1: 0.7 }, tail: { 1: 0.6 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0, vol: 0.4 },
        { f: 'rpg/step-00', at: 'p1', off: 0.1, vol: 0.3 }, { f: 'rpg/step-01', at: 'p1', off: 0.3, vol: 0.3 }, { f: 'rpg/step-02', at: 'p1', off: 0.5, vol: 0.3 }, { f: 'rpg/step-03', at: 'p1', off: 0.7, vol: 0.3 },
        { f: 'rpg/door-open', at: 'l1.1.end', off: -0.1, vol: 0.4 },
        { f: 'ui/pop', at: 'l1.2', off: 0, vol: 0.3 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [{ n: 2, lines: [1, 2] }], lead: { 2: 0.8 }, tail: { 2: 0.4 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p2', off: 0, vol: 0.4 },
        { f: 'ui/pop', at: 'l2.1', off: -0.05, vol: 0.3 },
        { f: 'ui/pop', at: 'l2.2', off: -0.05, vol: 0.3 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [{ n: 2, lines: [3] }], lead: { 2: 0.5 }, tail: { 2: 0.8 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p2', off: 0, vol: 0.4 },
        { f: 'rpg/step-grass-000', at: 'p2', off: 0.1, vol: 0.2 },
        { f: 'ui/pop', at: 'l2.1', off: 0, vol: 0.3 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [3], lead: { 3: 0.7 }, tail: { 3: 0.7 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: 0, vol: 0.4 },
        { f: 'rpg/spell-hit', at: 'l3.2', off: -0.3, vol: 0.35 },
        { f: 'rpg/spell-magic', at: 'l3.2', off: 0.1, vol: 0.28 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [4], lead: { 4: 0.6 }, tail: { 4: 0.7 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p4', off: 0, vol: 0.45 },
        { f: 'rpg/spell-magic', at: 'p4', off: 0.2, vol: 0.3 },
        { f: 'ui/star', at: 'l4.1', off: 0.2, vol: 0.4 },
        { f: 'ui/pop', at: 'l4.2', off: 0.0, vol: 0.35 },
        { f: 'rpg/level-up', at: 'l4.2.end', off: -0.35, vol: 0.4 },
      ] },
    ],
  },
  'u03-capsula-familias': {
    region: 'sevilla', music: { vol: 0.2, offsetFrom: 0 },
    parts: [
      { plans: [1], lead: { 1: 0.6 }, tail: { 1: 0.8 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p1', off: 0, vol: 0.4 },
        { f: 'ui/pop', at: 'w1.1.4', off: -0.05, vol: 0.45 },
        { f: 'ui/pop', at: 'w1.1.7', off: -0.05, vol: 0.45 },
        { f: 'ui/pop', at: 'w1.1.10', off: -0.05, vol: 0.45 },
        { f: 'ui/pop', at: 'w1.1.13', off: -0.05, vol: 0.45 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [2], lead: { 2: 0.6 }, tail: { 2: 0.8 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p2', off: 0, vol: 0.4 },
        { f: 'ui/pop', at: 'w2.1.7', off: -0.05, vol: 0.5 },
        { f: 'ui/pop', at: 'w2.1.12', off: -0.05, vol: 0.5 },
        { f: 'ui/swoosh-out', at: 'end', off: -0.3, vol: 0.4 },
      ] },
      { plans: [3, 4], lead: { 3: 0.5, 4: 0.4 }, tail: { 3: 0.4, 4: 1.0 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: 0, vol: 0.4 },
        { f: 'ui/swoosh-out', at: 'p4', off: -0.15, vol: 0.45 },
        { f: 'ui/tick', at: 'p4', off: 1.0, vol: 0.3 },
        { f: 'ui/star', at: 'l4.1.end', off: -0.5, vol: 0.5 },
        { f: 'rpg/item-get', at: 'l4.1.end', off: -0.3, vol: 0.4 },
      ] },
    ],
  },
  'u03-pluma': {
    region: 'sevilla', music: { vol: 0.2, offsetFrom: 0 },
    parts: [
      { plans: [1, 2], lead: { 1: 0.7, 2: 0.4 }, tail: { 1: 0.3, 2: 0.7 }, sfx: [
        { f: 'rpg/spell-magic', at: 'p1', off: 0.2, vol: 0.4 },
        { f: 'rpg/item-get', at: 'p1', off: 0.5, vol: 0.5 },
        { f: 'rpg/level-up-big', at: 'l1.1', off: 0.0, vol: 0.45 },
        { f: 'ui/swoosh-out', at: 'p2', off: -0.2, vol: 0.5 },
        { f: 'rpg/spell-cast', at: 'p2', off: 0.3, vol: 0.3 },
        { f: 'ui/star', at: 'l2.1', off: 0.6, vol: 0.4 },
      ] },
      { plans: [3], lead: { 3: 0.6 }, tail: { 3: 1.4 }, sfx: [
        { f: 'ui/swoosh-in', at: 'p3', off: 0, vol: 0.45 },
        { f: 'rpg/spell-cast', at: 'l3.1', off: 0.2, vol: 0.4 },
        { f: 'ui/star', at: 'l3.1.end', off: 0.1, vol: 0.4 },
      ] },
    ],
  },
};

// ---------------------------------------------------------------------------------------------------------- utilitaires
const r3 = (n) => Math.round(n * 1000) / 1000;
function dur(file) {
  return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }));
}
/** Silences d'un mp3 (ffmpeg silencedetect) -> [{s,e}]. */
function silences(file, total) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'silencedetect=noise=-36dB:d=0.11', '-f', 'null', '-'], { encoding: 'utf8' });
  const out = [];
  let s = null;
  for (const l of (r.stderr || '').split('\n')) {
    let m = l.match(/silence_start: ([\d.]+)/);
    if (m) s = parseFloat(m[1]);
    m = l.match(/silence_end: ([\d.]+)/);
    if (m && s != null) { out.push({ s, e: parseFloat(m[1]) }); s = null; }
  }
  if (s != null) out.push({ s, e: total });
  return out;
}
const PAUSE = { ',': 0.22, ';': 0.25, ':': 0.25, '…': 0.45, '.': 0.35, '?': 0.2, '!': 0.2 };
/** Decoupe une replique en mots et estime leur debut/duree (poids ~ lettres, pauses ponctuation, recalage sur les silences reels). */
function wordTimes(text, d, sil) {
  const toks = text.replace(/…/g, '… ').split(/\s+/).filter(Boolean);
  // speech = [a, b] : retire le silence final (et initial) detecte
  let a = 0, b = d;
  if (sil.length && sil[sil.length - 1].e >= d - 0.05 && sil[sil.length - 1].s > d * 0.5) b = sil[sil.length - 1].s;
  if (sil.length && sil[0].s < 0.03) a = Math.min(sil[0].e, 0.3);
  const inner = sil.filter((x) => x.s > a + 0.08 && x.e < b - 0.05);
  const weights = toks.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 1.4);
  const pauses = toks.map((w) => { const c = w.replace(/[¿¡"»«)]+$/g, '').slice(-1); return PAUSE[c] || 0; });
  const lastIdx = toks.length - 1; pauses[lastIdx] = 0;
  const S = b - a, totalP = pauses.reduce((x, y) => x + y, 0), totalW = weights.reduce((x, y) => x + y, 0);
  const k = Math.max(0.01, (S - totalP) / totalW);
  const pred = []; let c = a;
  toks.forEach((w, i) => { pred.push({ s: c, e: c + weights[i] * k }); c += weights[i] * k + pauses[i]; });
  // recalage : chaque silence interieur est associe a la pause predite la plus proche
  const anchors = [[a, a]];
  inner.forEach((si) => {
    let best = -1, bd = 0.45;
    pred.forEach((p, i) => { if (pauses[i] > 0 && i < lastIdx) { const dd = Math.abs(p.e - si.s); if (dd < bd) { bd = dd; best = i; } } });
    if (best >= 0) { anchors.push([pred[best].e, si.s]); anchors.push([pred[best + 1].s, si.e]); }
  });
  anchors.push([c, b]);
  anchors.sort((x, y) => x[0] - y[0]);
  const warp = (t) => {
    for (let i = 0; i < anchors.length - 1; i++) {
      const [p0, q0] = anchors[i], [p1, q1] = anchors[i + 1];
      if (t >= p0 && t <= p1) return p1 === p0 ? q0 : q0 + ((t - p0) / (p1 - p0)) * (q1 - q0);
    }
    return t;
  };
  return { end: b, words: toks.map((w, i) => {
    const s = warp(pred[i].s), e = warp(pred[i].e);
    return { w, t: r3(s), d: r3(Math.max(0.08, e - s)) };
  }) };
}

// ---------------------------------------------------------------------------------------------------------- lecture du contenu
// une unite par prefixe d'id (u01-..., u02-..., u03-...) : u0X.json
const UNITS = {};
const scenes = {}, unitOfCine = {};
for (const cid of Object.keys(CINES)) {
  const uid = cid.slice(0, 3);
  if (!UNITS[uid]) {
    UNITS[uid] = JSON.parse(readFileSync(join(app, 'src', 'content', 'units', uid + '.json'), 'utf8'));
    for (const q of UNITS[uid].quests) for (const s of q.steps) if (s.tipo === 'cinematic_ref') { scenes[s.cinematica] = s.escena; unitOfCine[s.cinematica] = uid; }
  }
}
const ONLY = (process.argv.find((a) => a.startsWith('--unit=')) || '').slice(7);

let problems = 0;
const manifest = {};
const sfxDurCache = {};
function sfxDur(f) { return (sfxDurCache[f] ??= dur(join(ASSETS, 'sfx', f + '.mp3'))); }

for (const [cid, cfg] of Object.entries(CINES)) {
  if (ONLY && !cid.startsWith(ONLY + '-')) continue;
  const unit = UNITS[cid.slice(0, 3)];
  const esc = scenes[cid];
  if (!esc) { console.error(`!! ${cid} : scene absente de u01.json`); problems++; continue; }
  let musicCursor = 0;
  const plansByN = Object.fromEntries(esc.planos.map((p) => [p.n, p]));
  const parts = cfg.parts.map((pc, pi) => ({ cfg: pc, id: cfg.parts.length === 1 ? cid : `${cid}-${pi + 1}` }));
  manifest[cid] = { parts: [], total: 0 };
  for (const part of parts) {
    const pc = part.cfg;
    let t = 0;
    const plans = [];
    pc.plans.forEach((pn, idx) => {
      const n = typeof pn === 'number' ? pn : pn.n, only = typeof pn === 'number' ? null : pn.lines; // { n, lines:[1] } : une partie ne joue que certaines repliques du plan
      const src = plansByN[n];
      if (!src) throw new Error(`${cid} : plan ${n} introuvable`);
      const lead = pc.lead?.[n] ?? (idx === 0 ? 0.55 : 0.4), tail = pc.tail?.[n] ?? 0.4, p0 = t;
      let c = p0 + lead;
      const lines = src.lineas.filter((_, li) => !only || only.includes(li + 1)).map((l) => {
        const f = join(AUDIO, l.audio + '.mp3');
        if (!existsSync(f)) { console.error(`!! audio manquant : ${l.audio} (${l.es})`); problems++; return null; }
        const full = dur(f), wt = wordTimes(l.es, full, silences(f, full)), d = Math.min(full, wt.end + 0.15);
        const ln = { who: l.voz, es: l.es, key: l.audio, t: r3(c), d: r3(d), words: wt.words.map((w) => ({ ...w, t: r3(c + w.t) })) };
        c += d + GAP;
        return ln;
      }).filter(Boolean);
      let p1 = Math.max(lines.length ? lines[lines.length - 1].t + lines[lines.length - 1].d + tail : p0 + lead + tail, p0 + (pc.min?.[n] ?? 0));
      plans.push({ n, t0: r3(p0), t1: r3(p1), vista: src.vista, camara: src.camara || '', rotulo: src.rotulo || '', personajes: src.personajes || [], lines });
      t = p1;
    });
    const total = r3(t + 0.25);
    if (total > MAX_PART + 1e-6) { console.error(`!! ${part.id} : ${total} s > ${MAX_PART} s (decouper davantage)`); problems++; }
    // ancres -> temps
    const anchor = (a) => {
      let m;
      if (a === 'end') return total;
      if ((m = a.match(/^p(\d+)(\.end)?$/))) { const p = plans.find((x) => x.n === +m[1]); return m[2] ? p.t1 : p.t0; }
      if ((m = a.match(/^l(\d+)\.(\d+)(\.end)?$/))) { const l = plans.find((x) => x.n === +m[1]).lines[+m[2] - 1]; return m[3] ? l.t + l.d : l.t; }
      if ((m = a.match(/^w(\d+)\.(\d+)\.(\d+)$/))) { const w = plans.find((x) => x.n === +m[1]).lines[+m[2] - 1].words[+m[3] - 1]; return w.t; }
      throw new Error('ancre inconnue : ' + a);
    };
    const sfx = (pc.sfx || []).map((s, i) => {
      const at = Math.max(0, anchor(s.at) + (s.off || 0)), d = Math.min(sfxDur(s.f), s.max || 99);
      return { id: `a-sfx${i + 1}`, f: s.f, t: r3(at), d: r3(Math.min(d, total - at)), vol: s.vol ?? 0.5 };
    });
    const first = parts[0] === part, last = parts[parts.length - 1] === part;
    const music = { f: 'aventure-douce', off: r3(musicCursor), vol: cfg.music?.vol ?? 0.2, fadeIn: first ? 0.8 : 0, fadeOut: last ? 1.2 : 0 };
    musicCursor += total;
    const meta = { cinematica: cid, titulo: esc.titulo, tipo: esc.tipo, unidad: unit.titulo, numero: unit.numero, lugar: unit.lugar, pluma: unit.pluma.nombre, plumaNum: unit.pluma.numero, rotulo: esc.planos[0].rotulo || '', region: cfg.region || 'madrid' };
    const PLAN = { id: part.id, cinematica: cid, part: parts.indexOf(part) + 1, parts: parts.length, total, meta, plans, sfx: sfx.map((s) => ({ t: s.t, f: s.f })) };
    manifest[cid].parts.push({ id: part.id, duration: total });
    manifest[cid].total = r3(manifest[cid].total + total);

    // ------------------------------------------------------------------ ecriture
    const dir = join(CIN, part.id), file = join(dir, 'index.html');
    if (CHECK) { console.log(`${part.id.padEnd(30)} ${String(total).padStart(6)} s`); continue; }
    if (!existsSync(file)) { console.log(`-- ${part.id} : pas d'index.html (a ecrire), timings : ${total} s`); continue; }
    // voix
    const voz = join(dir, 'assets', 'voz');
    rmSync(voz, { recursive: true, force: true });
    mkdirSync(voz, { recursive: true });
    const keys = new Set(plans.flatMap((p) => p.lines.map((l) => l.key)));
    keys.forEach((k) => copyFileSync(join(AUDIO, k + '.mp3'), join(voz, k + '.mp3')));
    // sfx / musique partages
    mkdirSync(join(CIN, '_shared', 'sfx'), { recursive: true });
    mkdirSync(join(CIN, '_shared', 'music'), { recursive: true });
    sfx.forEach((s) => copyFileSync(join(ASSETS, 'sfx', s.f + '.mp3'), join(CIN, '_shared', 'sfx', basename(s.f) + '.mp3')));
    copyFileSync(join(ASSETS, 'music', music.f + '.mp3'), join(CIN, '_shared', 'music', music.f + '.mp3'));
    // balises audio
    let tr = 0;
    const tags = [];
    const auto = (pts) => `data-automation='${JSON.stringify({ version: 1, lanes: [{ target: 'volume', points: pts }] })}'`;
    const mp = [];
    if (music.fadeIn) mp.push({ t: 0, v: 0 }, { t: music.fadeIn, v: 1 }); else mp.push({ t: 0, v: 1 });
    if (music.fadeOut) mp.push({ t: r3(total - music.fadeOut), v: 1 }, { t: total, v: 0 }); else mp.push({ t: r3(total - 0.3), v: 1 }, { t: total, v: 0.5 });
    tags.push(`<audio id="a-music" src="./_shared/music/${music.f}.mp3" data-start="0" data-duration="${total}" data-media-start="${music.off}" data-track-index="${tr++}" data-volume="${music.vol}" ${auto(mp)}></audio>`);
    plans.forEach((p) => p.lines.forEach((l, i) => tags.push(`<audio id="a-voz-${p.n}-${i + 1}" src="./assets/voz/${l.key}.mp3" data-start="${l.t}" data-duration="${l.d}" data-track-index="${tr}" data-volume="1"></audio>`)));
    tr++;
    sfx.forEach((s, i) => tags.push(`<audio id="${s.id}" src="./_shared/sfx/${basename(s.f)}.mp3" data-start="${s.t}" data-duration="${s.d}" data-track-index="${tr + 1 + i}" data-volume="${s.vol}"></audio>`));
    let html = readFileSync(file, 'utf8');
    const sub = (start, end, body) => {
      const a = html.indexOf(start), b = html.indexOf(end);
      if (a < 0 || b < 0) throw new Error(`${part.id} : marqueurs ${start} / ${end} absents`);
      html = html.slice(0, a + start.length) + '\n' + body + '\n      ' + html.slice(b);
    };
    sub('<!--GEN:audio-->', '<!--/GEN:audio-->', tags.map((x) => '      ' + x).join('\n'));
    sub('/*GEN:plan*/', '/*/GEN:plan*/', '      window.PLAN = ' + JSON.stringify(PLAN) + ';');
    html = html.replace(new RegExp(`(data-composition-id="${part.id}"[^>]*?data-duration=")[^"]*(")`), `$1${total}$2`);
    writeFileSync(file, html);
    console.log(`ok ${part.id.padEnd(30)} ${String(total).padStart(6)} s  (${plans.map((p) => `p${p.n} ${p.t0}-${p.t1}`).join(', ')})  ${tags.length} audio`);
  }
}
if (!CHECK && !ONLY) writeFileSync(join(CIN, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
if (problems) { console.error(`${problems} probleme(s)`); process.exit(1); }
