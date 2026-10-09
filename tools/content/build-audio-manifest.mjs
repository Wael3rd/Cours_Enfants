#!/usr/bin/env node
// Genere apps/espagnol/src/content/audio-manifest.json : [{ key, text, voice, rate?, pitch? }]
// Une entree par texte parle (cle deterministe), + variante lente (`key.lento`, rate -25 %) pour le vocabulaire,
// les exemples et les phrases modeles. Voix/rate/pitch deduits du personnage (characters.json).
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT_DIR, SLOW_SUFFIX, SLOW_RATE, addPercent, loadCharacters, loadUnits, collectSpoken } from './lib.mjs';

const chars = new Map(loadCharacters().map((c) => [c.id, c]));
const entries = new Map();
const perUnit = [];
let errors = 0;

for (const { data: u } of loadUnits()) {
  const before = entries.size;
  let slowCount = 0;
  for (const sp of collectSpoken(u)) {
    const c = chars.get(sp.voz);
    if (!c) { console.error(`${u.id} ${sp.path}: voix inconnue ${sp.voz}`); errors++; continue; }
    const add = (key, rate) => {
      const prev = entries.get(key);
      if (prev) {
        if (prev.text !== sp.text) { console.error(`collision ${key}: "${prev.text}" vs "${sp.text}"`); errors++; }
        return false;
      }
      const e = { key, text: sp.text, voice: c.voz };
      if (rate) e.rate = rate;
      if (c.tono?.pitch) e.pitch = c.tono.pitch;
      entries.set(key, e);
      return true;
    };
    add(sp.key, c.tono?.rate);
    if (sp.slow && add(sp.key + SLOW_SUFFIX, addPercent(c.tono?.rate, SLOW_RATE))) slowCount++;
  }
  perUnit.push({ unit: u.id, entradas: entries.size - before, de_las_cuales_lentas: slowCount });
}

if (errors) process.exit(1);
const out = [...entries.values()];
writeFileSync(join(CONTENT_DIR, 'audio-manifest.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.table(perUnit);
console.log(`audio-manifest.json : ${out.length} entrées (${out.filter((e) => e.key.endsWith(SLOW_SUFFIX)).length} lentes)`);
