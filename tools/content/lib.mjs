// Utilitaires partages par validate.mjs, build-audio-manifest.mjs et author/*.mjs
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONTENT_DIR = join(ROOT, 'apps', 'espagnol', 'src', 'content');
export const UNITS_DIR = join(CONTENT_DIR, 'units');
export const SLOW_SUFFIX = '.lento';
export const SLOW_RATE = -25; // pourcent
export const VOZ_VOCAB_POR_DEFECTO = 'narrador';

/** Cle audio deterministe : `<voz>.<sha1(texte NFC trim)[0..10]>`. Variante lente : cle + ".lento". */
export function audioKey(voz, es) {
  const t = es.normalize('NFC').trim();
  return `${voz}.${createHash('sha1').update(t, 'utf8').digest('hex').slice(0, 10)}`;
}

export function loadJSON(path) {
  return JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
}

export function loadCharacters() {
  return loadJSON(join(CONTENT_DIR, 'characters.json'));
}

export function loadUnits() {
  return readdirSync(UNITS_DIR)
    .filter((f) => /^u\d\d\.json$/.test(f))
    .sort()
    .map((f) => ({ file: f, data: loadJSON(join(UNITS_DIR, f)) }));
}

/** Normalisation pour comparer des reponses vocales / dictees (casse, ponctuation ; accents conserves). */
export function normSpeech(s) {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[¿?¡!.,;:«»"“”()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parcourt une unite et liste tous les textes espagnols prononces.
 * Retourne [{ key, text, voz, slow, path }]. `slow` = variante lente voulue (vocab, exemples, phrases modeles).
 */
export function collectSpoken(unit) {
  const out = [];
  const isSpoken = (o) => o && typeof o === 'object' && typeof o.es === 'string' && typeof o.audio === 'string';
  const push = (o, voz, slow, path) => out.push({ key: o.audio, text: o.es, voz, slow, path });

  (unit.vocab ?? []).forEach((v, i) => {
    const voz = v.voz ?? VOZ_VOCAB_POR_DEFECTO;
    push(v, voz, true, `vocab[${i}]`);
    if (isSpoken(v.ejemplo)) push(v.ejemplo, v.ejemplo.voz ?? voz, true, `vocab[${i}].ejemplo`);
  });

  const SLOW_KEYS = new Set(['objetivo', 'modelo', 'ejemplos', 'regla']);
  const walk = (node, path, parentKey) => {
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${path}[${i}]`, parentKey));
    if (!node || typeof node !== 'object') return;
    if (isSpoken(node)) push(node, node.voz, SLOW_KEYS.has(parentKey) && parentKey !== 'regla', path);
    for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`, k);
  };
  walk(unit.gramatica ?? [], 'gramatica', 'gramatica');
  walk(unit.quests ?? [], 'quests', 'quests');
  return out;
}

export function addPercent(rateStr, delta) {
  const base = rateStr ? parseInt(rateStr, 10) : 0;
  const v = base + delta;
  return `${v >= 0 ? '+' : ''}${v}%`;
}
