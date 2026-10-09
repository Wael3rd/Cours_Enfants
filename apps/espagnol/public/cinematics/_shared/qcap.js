/* QCap - helpers des capsules culturelles "explainer" (papier decoupe sur fond indigo a points) - window.QCap. A la main (non genere).
 * Fournit : fond a points, bloc titre (barre or + kicker + titre), pastilles / etiquettes d'appel, "pop" de papier, ombre portee de papier decoupe.
 * Depend de gsap, QArt, QCine (charges avant). Tout est cale sur window.PLAN par les compositions. */
(function () {
  var C = window.QCine;
  var Cap = (window.QCap = {});
  var CSS = '' +
    '.cap-bg{position:absolute;inset:0;background:#0d1038}' +
    '.cap-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.16) 2px,transparent 2.5px);background-size:26px 26px}' +
    '.cap-title{position:absolute;left:96px;top:236px;z-index:14}' +
    '.cap-bar{width:150px;height:10px;border-radius:5px;background:#ffc83d;transform-origin:0 50%}' +
    '.cap-kick{margin-top:14px;font:900 30px/1 Nunito,sans-serif;letter-spacing:.2em;color:#19b7aa}' +
    '.cap-ttl{margin-top:8px;font:400 62px/1.04 "Alfa Slab One",serif;color:#f5e6c8;text-shadow:0 5px 0 rgba(0,0,0,.45)}' +
    '.cap-chip{position:absolute;left:0;top:0;z-index:12;padding:8px 28px 12px;border-radius:999px;background:rgba(13,16,56,.94);border:4px solid #19b7aa;font:900 42px/1 Nunito,sans-serif;color:#f5e6c8;white-space:nowrap;box-shadow:0 6px 0 rgba(0,0,0,.35)}' +
    '.cap-chip.gold{border-color:#ffc83d}.cap-chip.terra{border-color:#e0694a}.cap-chip.pink{border-color:#ff7fb0}' +
    '.cap-paper{filter:drop-shadow(0 10px 0 rgba(0,0,0,.35))}';
  Cap.css = function () { if (!document.getElementById('qcap-css')) { var s = document.createElement('style'); s.id = 'qcap-css'; s.textContent = CSS; document.head.appendChild(s); } };
  function el(tag, cls, html, parent) { var e = document.createElement(tag); e.setAttribute('data-layout-allow-orbit', ''); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  Cap.el = el;
  /** Fond indigo a points. */
  Cap.bg = function (root, before) {
    Cap.css();
    var bg = el('div', 'cap-bg'); el('div', 'cap-dots', '', bg);
    if (before) root.insertBefore(bg, before); else root.insertBefore(bg, root.firstChild);
    return bg;
  };
  /** Bloc titre (barre or qui se trace, kicker, titre) : renvoie le conteneur. */
  Cap.title = function (tl, root, kicker, title, at) {
    Cap.css();
    var t = el('div', 'cap-title', '<div class="cap-bar"></div><div class="cap-kick">' + kicker + '</div><div class="cap-ttl">' + title + '</div>', root);
    tl.fromTo(t.querySelector('.cap-bar'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, at);
    tl.fromTo(t.querySelector('.cap-kick'), { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, at + 0.1);
    tl.fromTo(t.querySelector('.cap-ttl'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, at + 0.18);
    return t;
  };
  /** Pastille de texte posee en (x, y) (coin haut-gauche). cls : 'gold' | 'terra' | 'pink'. */
  Cap.chip = function (parent, html, x, y, cls) {
    var c = el('div', 'cap-chip' + (cls ? ' ' + cls : ''), html, parent);
    gsap.set(c, { x: x, y: y });
    return c;
  };
  /** Apparition "papier" : ressort + leger roulis. from : 'up' | 'down' | 'scale'. */
  Cap.pop = function (tl, target, at, opts) {
    opts = opts || {};
    var from = opts.from || 'scale', y0 = +gsap.getProperty(target, 'y') || 0, v = { opacity: 0, rotation: opts.rot == null ? -4 : opts.rot, scale: 0.4, y: y0 };
    if (from === 'up') { v.y = y0 + 90; v.scale = 0.9; } else if (from === 'down') { v.y = y0 - 90; v.scale = 0.9; }
    tl.set(target, { opacity: 0 }, 0);
    tl.fromTo(target, v, { opacity: 1, rotation: opts.to == null ? 0 : opts.to, scale: 1, y: y0, duration: opts.dur || 0.5, ease: opts.ease || 'back.out(1.9)', immediateRender: false }, at);
  };
  Cap.paper = function (e) { e.classList.add('cap-paper'); return e; };
  /** Fond clair de papier (grain) pour les scenes plein cadre. */
  Cap.sparks = function (tl, parent, x, y, at, n, color) {
    for (var k = 0; k < (n || 8); k++) {
      var sp = el('div', 'cap-spark q-fx', '<svg width="40" height="40" viewBox="-20 -20 40 40"><path d="' + window.QArt.sparklePath(0, 0, 16, 4) + '" fill="' + (color || '#ffe9a8') + '"/></svg>', parent);
      sp.style.cssText = 'position:absolute;left:0;top:0;z-index:15';
      var ang = (k / (n || 8)) * 6.283, d = 60 + (k % 3) * 24;
      tl.fromTo(sp, { x: x, y: y, scale: 0, opacity: 1 }, { x: x + Math.cos(ang) * d, y: y + Math.sin(ang) * d, scale: 0.9, duration: 0.45, ease: 'power2.out', immediateRender: false }, at + k * 0.03);
      tl.to(sp, { scale: 0, opacity: 0, duration: 0.35 }, at + 0.5 + k * 0.03);
    }
  };
})();
