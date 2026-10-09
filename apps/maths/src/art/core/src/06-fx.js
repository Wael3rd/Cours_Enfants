// ---------------------------------------------------------------- effets deterministes (utilisables dans une timeline GSAP pausee)
// Politique "mouvement sur" (docs/architecture.md, controle : npm run a11y:flash) : rien ne flashe plus de 3 fois par seconde,
// pas de flash blanc plein ecran (bloom <= 0,25 d'opacite, fondus >= 0,3 s), flashs de foule rares et doux (<= 2/s),
// confettis sans papillotement rapide, secousses moderees. L'energie vient du mouvement, pas de la lumiere.
let SOFT = false;
/** Mode "Animations douces" (reglage parent, ou prefers-reduced-motion) : pas de flashs de foule ni de secousse, bloom et confettis reduits. */
export function setSoft(v) { SOFT = !!v; }
export function isSoft() { return SOFT; }
/** Rayons tournants (sunburst). Renvoie un SVG carre `size` px ; a faire tourner. */
export function rays(opts) {
  opts = opts || {}; const n = opts.count || 14, size = opts.size || 2400, c = opts.color || '#fff', op = opts.opacity == null ? 0.16 : opts.opacity;
  let d = '';
  for (let i = 0; i < n; i++) { const a0 = (i * 360) / n, a1 = a0 + 180 / n; const f = (t) => `${(size / 2 + size * Math.cos(t * Math.PI / 180)).toFixed(0)},${(size / 2 + size * Math.sin(t * Math.PI / 180)).toFixed(0)}`; d += `<polygon points="${size / 2},${size / 2} ${f(a0)} ${f(a1)}" fill="${c}"/>`; }
  const u = opts.uid || uid('ry');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fx-rays" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><defs><radialGradient id="${u}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".7" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="${u}m"><rect width="${size}" height="${size}" fill="url(#${u})"/></mask></defs><g mask="url(#${u}m)" opacity="${op}">${d}</g></svg>`;
}
/** Etoile a 4 branches (eclat). */
export function sparkle(opts) {
  opts = opts || {}; const c = opts.color || '#fff', s = opts.size || 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fx-sparkle" viewBox="-50 -50 100 100" width="${s}" height="${s}"><path d="M0 -50 C3 -12 12 -3 50 0 C12 3 3 12 0 50 C-3 12 -12 3 -50 0 C-12 -3 -3 -12 0 -50Z" fill="${c}"/></svg>`;
}
/** Lignes de vitesse horizontales (seed fixe), SVG 1920x1200. */
export function speedLines(opts) {
  opts = opts || {}; const r = rng(opts.seed || 3), n = opts.count || 26, c = opts.color || '#fff'; let d = '';
  for (let i = 0; i < n; i++) { const y = r() * 1200, x = r() * 900, w = 380 + r() * 700, h = 3 + r() * 9; d += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(1)}" rx="${(h / 2).toFixed(1)}" fill="${c}" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fx-speed" viewBox="0 0 1920 1200" width="1920" height="1200">${d}</svg>`;
}
/** Confettis balistiques : `host` = element positionne ; chaque morceau = x lineaire + y montee/descente (gravite) + rotation lente. Tout est calcule a la construction (seed).
 * Nombre reel = 70 % de `count` (30 % en mode doux) : moins de noeuds animes sur tablette. */
export function confetti(gsap, tl, host, o) {
  o = o || {}; const r = rng(o.seed || 5), n = Math.max(6, Math.round((o.count || 90) * (SOFT ? 0.3 : 0.7))), at = o.at || 0;
  const cols = o.colors || ['#FFD23F', '#FF4D6D', '#35D6FF', '#FFFFFF', '#FF8A1F', '#7CFF9E'];
  const xs = o.xSpread || 0, ox0 = o.x == null ? 960 : o.x, ox = ox0, oy = o.y == null ? 600 : o.y, power = o.power || 700, spread = o.spread == null ? 150 : o.spread, grav = o.gravity || 1500, dur = o.duration || 2.2;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    const w = 10 + r() * 14, h = w * (0.45 + r() * 0.9), col = cols[i % cols.length];
    el.style.cssText = `position:absolute;left:0;top:0;width:${w.toFixed(0)}px;height:${h.toFixed(0)}px;background:${col};border-radius:${r() < 0.3 ? '50%' : '2px'};opacity:0`;
    el.setAttribute('data-layout-allow-occlusion', '');
    host.appendChild(el);
    const ang = (o.angle == null ? -90 : o.angle) + (r() - 0.5) * 2 * spread, v = power * (0.45 + r() * 0.75), rad = ang * Math.PI / 180;
    const vx = Math.cos(rad) * v, vy = Math.sin(rad) * v, life = dur * (0.75 + r() * 0.45), tUp = Math.max(0.05, -vy / grav), delay = r() * 0.12;
    const oxi = ox + (r() - 0.5) * 2 * xs;
    const xEnd = oxi + vx * life * 0.9, yApex = oy + vy * tUp + 0.5 * grav * tUp * tUp, yEnd = oy + vy * life + 0.5 * grav * life * life;
    const t0 = at + delay;
    tl.set(el, { x: oxi, y: oy, opacity: 1, rotation: r() * 360 }, t0);
    tl.to(el, { x: xEnd, duration: life, ease: 'none' }, t0);
    tl.to(el, { y: yApex, duration: Math.min(tUp, life), ease: 'power2.out' }, t0);
    if (life > tUp) tl.to(el, { y: yEnd, duration: life - tUp, ease: 'power2.in' }, t0 + tUp);
    tl.to(el, { rotation: '+=' + ((r() - 0.5) * 900).toFixed(0), duration: life, ease: 'none' }, t0);
    // retournement lent (<= ~1 par seconde) : pas de papillotement
    if (!SOFT) { const flips = Math.max(1, Math.floor(life / 1.1)); tl.to(el, { scaleY: 0.45, duration: life / (2 * flips), repeat: 2 * flips - 1, yoyo: true, ease: 'sine.inOut' }, t0); }
    tl.to(el, { opacity: 0, duration: 0.3, ease: 'power1.in' }, t0 + life - 0.3);
  }
}
/** Secousse amortie (deterministe) d'un element : amplitude plafonnee a 10 px (cadre 1920), rien en mode doux. */
export function shake(gsap, tl, el, at, amp, dur) {
  if (SOFT) return;
  const a = Math.min(amp || 10, 10), d = Math.max(dur || 0.4, 0.3), steps = 6;
  for (let i = 0; i < steps; i++) { const k = 1 - i / steps; tl.to(el, { x: (i % 2 ? -1 : 1) * a * k, y: (i % 3 === 0 ? -1 : 1) * a * 0.5 * k, duration: d / steps, ease: 'sine.inOut' }, at + (i * d) / steps); }
  tl.to(el, { x: 0, y: 0, duration: d / steps, ease: 'power2.out' }, at + d);
}
/** Compteur : texte pilote par la progression (seek-safe). fmt(v) -> string. */
export function countUp(gsap, tl, el, from, to, at, dur, fmt, ease) {
  const o = { v: from }; const f = fmt || ((v) => String(Math.round(v)));
  el.textContent = f(from);
  tl.to(o, { v: to, duration: dur, ease: ease || 'power2.out', onUpdate: () => { el.textContent = f(o.v); } }, at);
}
/** Flashs d'appareils photo de la foule (emplacements `.st-flash`), version sure : au plus 2 par seconde (x density),
 * fondu d'entree 0,3 s et de sortie 0,45 s, emplacements tous differents (ordre graine). Aucun en mode doux. */
export function crowdFlashes(gsap, tl, root, at, dur, density, seed) {
  const list = Array.prototype.slice.call(root.querySelectorAll('.st-flash'));
  if (SOFT || !list.length) return;
  const r = rng(seed || 9), n = Math.min(list.length, Math.max(1, Math.floor(2 * dur * Math.min(1, density == null ? 1 : density))));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)), x = list[i]; list[i] = list[j]; list[j] = x; }
  const step = dur / n; // >= 0,5 s : jamais plus de 2 departs dans une meme seconde
  for (let i = 0; i < n; i++) {
    const t = at + i * step;
    tl.fromTo(list[i], { opacity: 0 }, { opacity: 0.7, duration: 0.3, ease: 'sine.out', immediateRender: false }, t);
    tl.to(list[i], { opacity: 0, duration: 0.45, ease: 'sine.inOut' }, t + 0.32);
  }
}
/** Bloom doux (remplace le flash blanc plein ecran) : `el` = calque plein cadre (degrade radial clair), opacite <= 0,25
 * atteinte en >= 0,3 s puis fondu de 0,6 s. Mode doux : 0,12 max. */
export function bloom(gsap, tl, el, at, peak, rise) {
  const p = Math.min(peak == null ? 0.22 : peak, SOFT ? 0.12 : 0.25), up = Math.max(rise || 0.3, 0.3);
  tl.fromTo(el, { opacity: 0 }, { opacity: p, duration: up, ease: 'sine.out', immediateRender: false }, at);
  tl.to(el, { opacity: 0, duration: 0.6, ease: 'sine.inOut' }, at + up + 0.01);
}
/** Balayage lumineux diagonal (shimmer) sur un element conteneur. */
export function sheen(gsap, tl, el, at, dur, fromX, toX) {
  tl.fromTo(el, { x: fromX, opacity: 0 }, { x: toX, opacity: 1, duration: dur, ease: 'power2.inOut' }, at);
  tl.to(el, { opacity: 0, duration: 0.25, ease: 'sine.inOut' }, at + dur - 0.2);
}
