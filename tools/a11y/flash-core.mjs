// Analyse de photosensibilite (pure, sans I/O) : suite d'images en luminance relative -> flashs, eblouissements, scintillements.
// Utilise par tools/a11y/flash-check.mjs et teste par tests/flash-core.test.ts.
//
// Trois regles (politique "mouvement sur", docs/architecture.md) :
//  1. FLASH GENERAL (WCAG 2.3.1) : une transition = variation de luminance relative >= 0,1 dont le niveau le plus sombre
//     est < 0,8 ; un flash = une paire de transitions opposees. Une transition "compte" quand les pixels qui la font
//     au meme moment (fenetre de 0,1 s) couvrent >= 10 % de l'ecran (equivalent WCAG du rectangle 341x256 sur 1024x768).
//     Echec au-dela de 3 flashs dans n'importe quelle seconde.
//  2. EBLOUISSEMENT (plus strict que WCAG) : la luminance moyenne de l'ecran ou d'une moitie d'ecran monte de plus de
//     0,2 en 0,1 s (flash blanc plein ecran, coupe brutale vers une image claire ; un fondu >= 0,3 s depuis le noir passe).
//     Echec des la 1re occurrence.
//  3. SCINTILLEMENT (indicateur, avertissement seulement) : petits eclats sur place (une case de 1/24e de la largeur
//     qui s'allume en <= 2 images puis s'eteint : flashs de foule, etincelles, confettis qui papillotent). Heuristique
//     (les petits mouvements vifs peuvent compter) : avertit au-dela de 3 par seconde. La regle "<= 2 flashs de foule
//     par seconde, fondus >= 0,25 s" est garantie par le kit (CEArt.crowdFlashes) et testee dans tests/safe-motion.test.ts.

/** Table sRGB 8 bits -> lineaire. */
const LIN = new Float32Array(256);
for (let i = 0; i < 256; i++) { const c = i / 255; LIN[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }

/** RGB(A) entrelace 8 bits -> luminance relative (0..1) par pixel. `channels` = 3 ou 4. */
export function toLuminance(rgb, w, h, channels = 3) {
  const out = new Float32Array(w * h);
  for (let p = 0, i = 0; p < out.length; p++, i += channels) out[p] = 0.2126 * LIN[rgb[i]] + 0.7152 * LIN[rgb[i + 1]] + 0.0722 * LIN[rgb[i + 2]];
  return out;
}

export const DEFAULTS = {
  minDelta: 0.1, // WCAG : 10 % de la luminance relative maximale
  darkMax: 0.8, // WCAG : le niveau le plus sombre doit etre < 0,8
  hyst: 0.02, // tolerance au bruit avant de considerer qu'une rampe s'inverse
  holdFrames: 3, // rampe terminee si aucun nouvel extreme pendant 3 images
  areaFrac: 0.1, // part de l'ecran (transitions simultanees) qui fait une transition "generale"
  areaWindow: 3, // images regroupees pour mesurer l'aire d'une transition (0,1 s a 30 i/s)
  maxFlashesPerSec: 3,
  glareDelta: 0.2, // hausse de luminance moyenne (ecran entier ou moitie) ... (un fondu plein ecran de 0,3 s vers une image claire reste en dessous)
  glareWindow: 0.1, // ... en 0,1 s
  cells: 24, // grille de scintillement : 24 cases en largeur (cases carrees)
  blinkDelta: 0.08, // hausse rapide d'une case
  blinkRise: 2, // en au plus 2 images
  blinkMaxCells: 4, // tache de hausse d'au plus 4 cases (un eclat est petit ; au-dela c'est un objet qui bouge)
  blinkFall: 0.4, // puis retour d'au moins 70 % en moins de 0,4 s
  maxBlinksPerSec: 3,
};

/** Suivi par pixel des rampes de luminance -> transitions { t (image de l'extreme), dir (+1/-1) } comptees par image. */
function transitions(frames, n, o) {
  const T = frames.length;
  const up = new Float64Array(T), down = new Float64Array(T);
  const ext = new Float32Array(frames[0]), peak = new Float32Array(frames[0]);
  const dir = new Int8Array(n), peakT = new Int32Array(n), still = new Int32Array(n);
  const emit = (p) => {
    const a = Math.abs(peak[p] - ext[p]);
    if (a >= o.minDelta && Math.min(peak[p], ext[p]) < o.darkMax) (dir[p] > 0 ? up : down)[peakT[p]] += 1;
  };
  for (let t = 1; t < T; t++) {
    const f = frames[t];
    for (let p = 0; p < n; p++) {
      const v = f[p];
      if (dir[p] === 0) {
        const d = v - ext[p];
        if (d > o.hyst || d < -o.hyst) { dir[p] = d > 0 ? 1 : -1; peak[p] = v; peakT[p] = t; still[p] = 0; }
        continue;
      }
      if ((v - peak[p]) * dir[p] > 0.002) { peak[p] = v; peakT[p] = t; still[p] = 0; continue; }
      if ((peak[p] - v) * dir[p] > o.hyst) { // inversion
        emit(p);
        ext[p] = peak[p]; dir[p] = -dir[p]; peak[p] = v; peakT[p] = t; still[p] = 0;
        continue;
      }
      if (++still[p] >= o.holdFrames) { emit(p); ext[p] = peak[p]; dir[p] = 0; }
    }
  }
  for (let p = 0; p < n; p++) if (dir[p] !== 0) emit(p);
  return { up, down };
}

/** Evenements (transitions generales) : images ou l'aire cumulee sur `areaWindow` images depasse `areaFrac`. */
function generalEvents(counts, n, fps, o, dir) {
  const T = counts.length, ev = [];
  let run = null;
  for (let t = 0; t < T; t++) {
    let s = 0;
    for (let k = Math.max(0, t - o.areaWindow + 1); k <= t; k++) s += counts[k];
    const frac = s / n;
    if (frac >= o.areaFrac) {
      if (run && t - run.end <= o.areaWindow) { run.end = t; if (frac > run.area) { run.area = frac; run.t = t; } }
      else { run = { t, end: t, area: frac, dir }; ev.push(run); }
    }
  }
  return ev.map((e) => ({ time: +(e.t / fps).toFixed(3), dir: e.dir > 0 ? 'up' : 'down', area: +e.area.toFixed(3) }));
}

/** Nombre maximal d'evenements dans une fenetre glissante d'une seconde (+ instant de debut). */
function maxPerSecond(times) {
  let best = 0, at = null;
  const s = [...times].sort((a, b) => a - b);
  for (let i = 0, j = 0; i < s.length; i++) {
    while (s[i] - s[j] >= 1 - 1e-9) j++;
    if (i - j + 1 > best) { best = i - j + 1; at = s[j]; }
  }
  return { count: best, at };
}

/** Eblouissement : hausse de luminance moyenne (ecran entier, moitie gauche/droite/haut/bas) > glareDelta en glareWindow s. */
function glare(frames, w, h, fps, o) {
  const k = Math.max(1, Math.round(o.glareWindow * fps));
  const regions = [[0, 0, w, h], [0, 0, w >> 1, h], [w >> 1, 0, w, h], [0, 0, w, h >> 1], [0, h >> 1, w, h]];
  const means = frames.map((f) => regions.map(([x0, y0, x1, y1]) => {
    let s = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) s += f[y * w + x];
    return s / ((x1 - x0) * (y1 - y0));
  }));
  const ev = [];
  let last = -99;
  for (let t = k; t < frames.length; t++) {
    let best = 0;
    for (let r = 0; r < regions.length; r++) best = Math.max(best, means[t][r] - means[t - k][r]);
    if (best > o.glareDelta) {
      if (t - last > k) ev.push({ time: +(t / fps).toFixed(3), rise: +best.toFixed(3) });
      else if (best > ev[ev.length - 1].rise) ev[ev.length - 1].rise = +best.toFixed(3);
      last = t;
    }
  }
  return { events: ev, maxMeanRise: +Math.max(0, ...frames.slice(k).map((_, i) => Math.max(...regions.map((__, r) => means[i + k][r] - means[i][r])))).toFixed(3) };
}

/**
 * Scintillement : petit eclat (tache de hausse <= 4 cases) SUR PLACE d'une case (1/24e de la largeur) = hausse rapide (<= blinkRise images) d'au moins
 * blinkDelta, additive (moins de 15 % de ses pixels s'assombrissent), sans baisse equivalente des cases voisines pendant la
 * hausse (sinon c'est un objet ou un motif qui se deplace), puis
 * retour d'au moins 70 % en moins de blinkFall s (sinon c'est une apparition qui reste). Eclats voisins (<= 1 case,
 * <= 3 images) fusionnes.
 */
function blinks(frames, w, h, fps, o) {
  const cs = Math.max(1, Math.round(w / o.cells)), cw = Math.ceil(w / cs), ch = Math.ceil(h / cs), N = cw * ch;
  const M = frames.map((f) => {
    const m = new Float32Array(N), c = new Float32Array(N);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((y / cs) | 0) * cw + ((x / cs) | 0); m[i] += f[y * w + x]; c[i]++; }
    for (let i = 0; i < N; i++) m[i] /= c[i];
    return m;
  });
  const T = frames.length, fall = Math.round(o.blinkFall * fps), R = o.blinkRise, out = [];
  const busyUntil = new Int32Array(N).fill(-1);
  const comp = new Int32Array(N), size = [];
  for (let t = R; t < T; t++) {
    // taches de hausse (8-connexes, seuil moitie) : un eclat est PETIT et isole ; une grande tache = gros objet/motif en mouvement
    comp.fill(-1); size.length = 0;
    for (let i = 0; i < N; i++) {
      if (comp[i] >= 0 || M[t][i] - M[t - R][i] < o.blinkDelta / 2) continue;
      const id = size.length, stack = [i]; comp[i] = id; let n = 0;
      while (stack.length) {
        const c = stack.pop(), x0 = c % cw, y0 = (c / cw) | 0; n++;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x0 + dx, ny = y0 + dy, j = ny * cw + nx;
          if (nx >= 0 && ny >= 0 && nx < cw && ny < ch && comp[j] < 0 && M[t][j] - M[t - R][j] >= o.blinkDelta / 2) { comp[j] = id; stack.push(j); }
        }
      }
      size.push(n);
    }
    for (let i = 0; i < N; i++) {
      if (t <= busyUntil[i]) continue;
      if (comp[i] < 0 || size[comp[i]] > o.blinkMaxCells) continue;
      const base = M[t - R][i];
      let top = M[t][i], tt = t;
      if (top - base < o.blinkDelta) continue;
      if (t + 1 < T && M[t + 1][i] > top) { top = M[t + 1][i]; tt = t + 1; }
      const amp = top - base;
      // objet en mouvement : une voisine perd autant de lumiere que la case en gagne
      const cx = i % cw, cy = (i / cw) | 0;
      let lost = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < cw && ny < ch) lost = Math.max(lost, M[t - R][ny * cw + nx] - M[tt][ny * cw + nx]);
      }
      if (lost > 0.5 * amp) continue;
      // eclat = eclaircissement additif : presque aucun pixel de la case ne s'assombrit pendant la hausse
      // (un motif qui se deplace ou retrecit, lui, eclaircit certains pixels et en assombrit d'autres)
      let darker = 0, total = 0;
      const fb = frames[t - R], fp = frames[tt];
      for (let y = cy * cs; y < Math.min(h, (cy + 1) * cs); y++) for (let x = cx * cs; x < Math.min(w, (cx + 1) * cs); x++) {
        total++;
        if (fp[y * w + x] < fb[y * w + x] - 0.02) darker++;
      }
      if (darker > 0.15 * total) continue;
      let back = -1;
      for (let u = tt + 1; u < Math.min(T, tt + fall + 1); u++) if (top - M[u][i] >= 0.7 * amp) { back = u; break; }
      if (back < 0) continue;
      busyUntil[i] = back;
      const ev = { t, cx, cy };
      const prev = out.find((e) => t - e.t <= 3 && Math.abs(e.cx - cx) <= 1 && Math.abs(e.cy - cy) <= 1);
      if (prev) { prev.t = t; prev.cx = cx; prev.cy = cy; prev.merged = (prev.merged || 0) + 1; continue; }
      ev.first = t;
      out.push(ev);
    }
  }
  return out.map((e) => ({ time: +(e.first / fps).toFixed(3), x: +((e.cx + 0.5) / cw).toFixed(2), y: +((e.cy + 0.5) / ch).toFixed(2) }));
}

/**
 * Analyse une suite d'images (Float32Array de luminance relative, w*h, a `fps` images/s).
 * Renvoie { ok, duration, flashes: {maxPerSecond, at, events}, glare: {events, maxMeanRise}, blinks: {maxPerSecond, at, total}, failures[], warnings[] }.
 * `ok` = aucun echec (flash general, eblouissement) ; le scintillement ne fait qu'avertir.
 */
export function analyze(frames, { w, h, fps }, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const n = w * h;
  if (frames.length < 2) throw new Error('au moins 2 images');
  const { up, down } = transitions(frames, n, o);
  const events = [...generalEvents(up, n, fps, o, 1), ...generalEvents(down, n, fps, o, -1)].sort((a, b) => a.time - b.time);
  const fl = maxPerSecond(events.map((e) => e.time));
  const flashesPerSec = fl.count / 2;
  const gl = glare(frames, w, h, fps, o);
  const bl = blinks(frames, w, h, fps, o);
  const blm = maxPerSecond(bl.map((b) => b.time));
  const failures = [];
  if (flashesPerSec > o.maxFlashesPerSec) failures.push(`flash general : ${flashesPerSec} flashs/s a ${fl.at?.toFixed(2)} s (max ${o.maxFlashesPerSec})`);
  for (const g of gl.events) failures.push(`eblouissement a ${g.time.toFixed(2)} s : luminance moyenne +${g.rise} en ${o.glareWindow} s (max ${o.glareDelta})`);
  const warnings = [];
  if (blm.count > o.maxBlinksPerSec) warnings.push(`scintillement (indicateur) : ${blm.count} petits eclats/s a ${blm.at.toFixed(2)} s (repere ${o.maxBlinksPerSec})`);
  return {
    ok: failures.length === 0,
    duration: +(frames.length / fps).toFixed(2),
    flashes: { maxPerSecond: flashesPerSec, at: fl.at, transitions: events.length, events },
    glare: gl,
    blinks: { maxPerSecond: blm.count, at: blm.at, total: bl.length, events: o.debug ? bl : undefined },
    failures,
    warnings,
  };
}
