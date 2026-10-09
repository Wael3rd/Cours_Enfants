// Cinematiques de strategie (maths) : voix off du Coach + assemblage + calage sur la duree REELLE des mp3.
// Usage : node tools/cinematics/strategy-build.mjs [--check] [--no-tts] [zone ...]
//  1. une phrase = un mp3 (edge-tts via tools/tts/generate.py, avec cache) dans apps/maths/public/cinematics/strategy-<zone>/assets/vo-<i>.mp3 ;
//  2. ffprobe -> debut/duree de chaque phrase (lead + gap), duree totale ;
//  3. index.html = tools/cinematics/strategy/template.html + scenes/<zone>.js + strategy-scripts.json
//     (balises <audio> voix + SFX, `window.PLAN`, data-duration). SFX : [phrase, fraction, fichier, volume].
// Corriger un texte ou un SFX dans strategy-scripts.json puis relancer suffit ; l'animation lit PLAN (T(i,f) dans la scene).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const cfg = JSON.parse(readFileSync(join(import.meta.dirname, 'strategy-scripts.json'), 'utf8'));
const tpl = readFileSync(join(import.meta.dirname, 'strategy', 'template.html'), 'utf8').replace(/\r\n/g, '\n');
const args = process.argv.slice(2);
const check = args.includes('--check');
const noTts = args.includes('--no-tts') || check;
const only = args.filter((a) => !a.startsWith('--'));
const py = join(root, 'tools/tts/.venv/Scripts/python.exe');
const r3 = (n) => Math.round(n * 1000) / 1000;
const dur = (f) => Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout);
let bad = 0;

for (const [zone, z] of Object.entries(cfg.zones)) {
  if (only.length && !only.includes(zone)) continue;
  const id = `strategy-${zone}`;
  const dir = join(root, 'apps/maths/public/cinematics', id);
  const assets = join(dir, 'assets');
  mkdirSync(assets, { recursive: true });
  if (!noTts) {
    const man = join(assets, '.manifest.json');
    writeFileSync(man, JSON.stringify(z.lines.map((text, i) => ({ key: `vo-${i}`, text, ...cfg.voice }))));
    let r;
    for (let k = 0; k < 3; k++) {
      r = spawnSync(py, [join(root, 'tools/tts/generate.py'), man, assets, '--concurrency', '3'], { stdio: 'pipe', encoding: 'utf8' });
      if (r.status === 0) break;
    }
    if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); }
  }
  const t = [], d = [];
  let cursor = cfg.lead;
  z.lines.forEach((_, i) => {
    const v = dur(join(assets, `vo-${i}.mp3`));
    t.push(r3(cursor)); d.push(r3(v));
    cursor += v + cfg.gap;
  });
  const total = r3(cursor - cfg.gap + cfg.tail);
  if (total > 12 || total < 8) bad++;
  console.log(`${id}: ${total} s  t=${JSON.stringify(t)} d=${JSON.stringify(d)}${total > 12 ? '  <-- > 12 s' : ''}`);

  const sceneFile = join(import.meta.dirname, 'strategy', 'scenes', `${zone}.js`);
  if (!existsSync(sceneFile)) continue;
  const vo = z.lines.map((_, i) => `      <audio id="vo${i}" src="./assets/vo-${i}.mp3" data-start="${t[i]}" data-duration="${d[i]}" data-track-index="${10 + i}" data-volume="1"></audio>`).join('\n');
  const sfx = (z.sfx || []).map(([i, f, name, vol], k) => {
    const start = r3(t[i] + f * d[i]);
    const len = r3(Math.min(dur(join(root, 'apps/maths/public/cinematics/_shared/sfx', `${name}.mp3`)), total - start));
    return `      <audio id="sx${k}" src="./_shared/sfx/${name}.mp3" data-start="${start}" data-duration="${len}" data-track-index="${30 + k}" data-volume="${vol}"></audio>`;
  }).join('\n');
  const scene = readFileSync(sceneFile, 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n').map((l) => '      ' + l).join('\n');
  const html = tpl
    .replaceAll('{{ID}}', id).replaceAll('{{KEY}}', zone).replaceAll('{{TITLE}}', z.title).replaceAll('{{BADGE}}', z.badge)
    .replaceAll('{{ZNUM}}', z.znum).replaceAll('{{ZNAME}}', z.zname).replaceAll('{{DURATION}}', String(total))
    .replace('<!--VO-->\n      <!--/VO-->', `<!--VO-->\n${vo}\n      <!--/VO-->`)
    .replace('<!--SFX-->\n      <!--/SFX-->', `<!--SFX-->\n${sfx}\n      <!--/SFX-->`)
    .replace(/\/\*PLAN\*\/[\s\S]*?\/\*END\*\//, `/*PLAN*/ window.PLAN = ${JSON.stringify({ t, d, total })}; /*END*/`)
    .replace('{{SCENE}}', () => scene);
  writeFileSync(join(dir, 'index.html'), html);
}
process.exit(check && bad ? 1 : 0);
