// ---------------------------------------------------------------- effets deterministes (utilisables dans une timeline GSAP pausee)
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
/** Confettis balistiques : `host` = element positionne ; chaque morceau = x lineaire + y montee/descente (gravite) + rotation. Tout est calcule a la construction (seed). */
export function confetti(gsap, tl, host, o) {
  o = o || {}; const r = rng(o.seed || 5), n = o.count || 90, at = o.at || 0;
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
    tl.to(el, { scaleY: 0.15, duration: 0.18 + r() * 0.2, repeat: Math.max(1, Math.floor(life / 0.5)), yoyo: true, ease: 'sine.inOut' }, t0);
    tl.to(el, { opacity: 0, duration: 0.3, ease: 'power1.in' }, t0 + life - 0.3);
  }
}
/** Secousse amortie (deterministe) d'un element. */
export function shake(gsap, tl, el, at, amp, dur) {
  const a = amp || 14, d = dur || 0.4, steps = 8;
  for (let i = 0; i < steps; i++) { const k = 1 - i / steps; tl.to(el, { x: (i % 2 ? -1 : 1) * a * k, y: (i % 3 === 0 ? -1 : 1) * a * 0.5 * k, duration: d / steps, ease: 'power1.inOut' }, at + (i * d) / steps); }
  tl.to(el, { x: 0, y: 0, duration: d / steps, ease: 'power2.out' }, at + d);
}
/** Compteur : texte pilote par la progression (seek-safe). fmt(v) -> string. */
export function countUp(gsap, tl, el, from, to, at, dur, fmt, ease) {
  const o = { v: from }; const f = fmt || ((v) => String(Math.round(v)));
  el.textContent = f(from);
  tl.to(o, { v: to, duration: dur, ease: ease || 'power2.out', onUpdate: () => { el.textContent = f(o.v); } }, at);
}
/** Flashs d'appareils photo de la foule : ordre et instants graines. */
export function crowdFlashes(gsap, tl, root, at, dur, density, seed) {
  const r = rng(seed || 9), list = root.querySelectorAll('.st-flash'); const n = Math.floor(list.length * (density == null ? 1 : density));
  for (let i = 0; i < n; i++) { const t = at + r() * dur; tl.fromTo(list[i], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.1, duration: 0.05, ease: 'power2.out' }, t); tl.to(list[i], { opacity: 0, duration: 0.18, ease: 'power1.in' }, t + 0.06); }
}
/** Balayage lumineux diagonal (shimmer) sur un element conteneur. */
export function sheen(gsap, tl, el, at, dur, fromX, toX) {
  tl.fromTo(el, { x: fromX, opacity: 0 }, { x: toX, opacity: 1, duration: dur, ease: 'power2.inOut' }, at);
  tl.to(el, { opacity: 0, duration: 0.1 }, at + dur - 0.08);
}
