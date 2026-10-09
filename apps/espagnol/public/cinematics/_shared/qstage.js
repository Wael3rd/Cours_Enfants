/* QStage - decor "Academia de Viajeros" + personnages vectoriels du kit (QArt.character) + camera pour les cinematiques d histoire (window.QStage).
 * A la main. Depend de gsap, QArt (qart.js) et QCine (qcine.js). Coordonnees en "pixels de salle" (2400 x 1200) ; la camera cadre
 * un point (px,py) de la salle au centre de l'ecran (960,600) avec un zoom s. Zoom 1 = salle entiere de 240 a 2160. */
(function () {
  var Q = window.QArt;
  var CSS = '' +
    '.st-cam{position:absolute;left:0;top:0;width:2400px;height:1200px;transform-origin:0 0}' +
    '.st-fx{position:absolute;left:-900px;top:1196px;width:4200px;height:700px;background:linear-gradient(180deg,#3B1F12,#140804)}' +
    '.st-l{position:absolute;left:0;top:0;width:2400px;height:1200px}' +
    '.st-l svg{display:block}' +
    '.st-light{mix-blend-mode:screen;opacity:.55}' +
    '.chr{position:absolute}' +
    '.chr-sh{position:absolute;left:12%;right:12%;bottom:-4%;height:9%;border-radius:50%;background:radial-gradient(closest-side,rgba(20,8,4,.55),rgba(20,8,4,0))}' +
    '.chr-b{position:relative;transform-origin:50% 100%}' +
    '.chr-b img{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 0 rgba(0,0,0,.18))}' +
    '.st-tag{position:absolute;display:inline-block;padding:6px 26px 10px;font:400 40px/1 "Alfa Slab One",serif;color:#14173f;border-radius:14px;box-shadow:0 5px 0 rgba(0,0,0,.35),inset 0 0 0 3px rgba(255,255,255,.45);white-space:nowrap}';
  var S = (window.QStage = {});
  function mk(parent, cls, html) { var d = document.createElement('div'); d.className = cls || ''; d.setAttribute('data-layout-allow-orbit', ''); if (html != null) d.innerHTML = html; if (parent) parent.appendChild(d); return d; }
  S.mk = mk;
  S.css = function () { if (!document.getElementById('qstage-css')) { var st = document.createElement('style'); st.id = 'qstage-css'; st.textContent = CSS; document.head.appendChild(st); } };

  /** Construit la salle dans root. Renvoie { cam, back, desk, qlayer, actors, front, light, motes }. */
  S.room = function (root, opts) {
    opts = opts || {};
    S.css();
    var R = Q.academiaRoom({ uid: 'ac' });
    var cam = mk(root, 'st-cam'); cam.setAttribute('data-layout-allow-overflow', '');
    var fx = mk(cam, 'st-fx'); fx.setAttribute('data-layout-allow-overflow', '');
    var L = function (cls, html) { var d = mk(cam, 'st-l ' + cls, html); d.setAttribute('data-layout-allow-overflow', ''); return d; };
    var back = L('st-back', R.back), mid = L('st-mid', ''), desk = L('st-desk', R.desk), qlayer = L('st-q', ''), actors = L('st-actors', ''), front = L('st-front', R.front), light = L('st-light', R.light);
    var motes = L('st-motes', Q.moteField({ n: 34, w: 2400, h: 1200, seed: 5, rmin: 2, rmax: 5, colors: ['#FFF3B0', '#FFE9A8', '#FFFFFF'] }));
    gsap.set(cam, { transformOrigin: '0 0' });
    return { cam: cam, back: back, mid: mid, desk: desk, qlayer: qlayer, actors: actors, front: front, light: light, motes: motes, W: R.W, H: R.H };
  };
  /** Decor generique (patio, aula, ruelle, atelier...) : set = { back, [desks], front, light, W, H } produit par le kit. Calques : back, desks, qlayer, actors, front, light, motes.
   *  opts : motes (nb), below (couleur sous le monde), moteColors. Meme camera que la salle (S.camSet / S.cam). */
  S.set = function (root, set, opts) {
    opts = opts || {};
    S.css();
    var W = set.W, H = set.H;
    var cam = mk(root, 'st-cam'); cam.style.width = W + 'px'; cam.style.height = H + 'px'; cam.setAttribute('data-layout-allow-overflow', '');
    var fx = mk(cam, 'st-fx'); fx.style.background = opts.below || '#3B1F12'; fx.style.top = (H - 4) + 'px'; fx.style.left = '-1200px'; fx.style.width = (W + 2400) + 'px'; fx.setAttribute('data-layout-allow-overflow', '');
    var L = function (cls, html) { var d = mk(cam, 'st-l ' + cls, html); d.style.width = W + 'px'; d.style.height = H + 'px'; d.setAttribute('data-layout-allow-overflow', ''); return d; };
    var back = L('st-back', set.back), desks = set.desks ? L('st-desks', set.desks) : null, qlayer = L('st-q', ''), actors = L('st-actors', ''), front = L('st-front', set.front || ''), light = L('st-light', set.light || '');
    var motes = L('st-motes', Q.moteField({ n: opts.motes == null ? 30 : opts.motes, w: W, h: H, seed: opts.seed || 5, rmin: 2, rmax: 5, colors: opts.moteColors || ['#FFF3B0', '#FFE9A8', '#FFFFFF'] }));
    gsap.set(cam, { transformOrigin: '0 0' });
    return { cam: cam, back: back, desks: desks, qlayer: qlayer, actors: actors, front: front, light: light, motes: motes, W: W, H: H };
  };
  /** Ambiance generique : faisceaux qui respirent + poussiere doree qui monte (cycles finis). */
  S.drift = function (tl, ref, span, at) {
    at = at || 0;
    ref.light.querySelectorAll('.ac-beams path').forEach(function (b, i) {
      tl.fromTo(b, { opacity: 0.45 + i * 0.1 }, { opacity: 0.95, duration: 2.4 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / (2.4 + i * 0.6))) }, at);
    });
    ref.motes.querySelectorAll('.k-mote').forEach(function (m, i) {
      var x = +m.dataset.x, y = +m.dataset.y;
      tl.fromTo(m, { x: x, y: y, opacity: 0 }, { x: x + 30 - (i % 5) * 14, y: y - 120 - (i % 6) * 25, opacity: 0.85, duration: span * 0.5, ease: 'sine.out' }, at + (i % 7) * 0.12);
      tl.to(m, { opacity: 0, duration: span * 0.5, ease: 'sine.in' }, at + span * 0.5 + (i % 7) * 0.12);
    });
  };
  /** Fontaine du patio andalou : jets qui scintillent et ondulent (cycles finis sur `span` s). */
  S.fountain = function (tl, ref, span, at) {
    at = at || 0;
    ref.back.querySelectorAll('.pa-jet').forEach(function (j, i) {
      var per = 0.22 + (i % 4) * 0.05, n = Math.max(1, Math.floor(span / per));
      tl.fromTo(j, { opacity: 0.9, y: 0 }, { opacity: 0.35, y: 4 + (i % 3) * 2, duration: per, ease: 'sine.inOut', yoyo: true, repeat: n }, at + i * 0.03);
    });
  };
  /** Accessoire du kit (QArt.prop) pose dans `layer`, centre en cx, bord haut en top, largeur w. */
  S.prop = function (layer, key, cx, top, w, opts) {
    var d = mk(layer, 'st-prop', Q.prop(key, Object.assign({ width: w }, opts || {}))); d.style.cssText = 'position:absolute;left:' + (cx - w / 2) + 'px;top:' + top + 'px;width:' + w + 'px';
    d.setAttribute('data-layout-allow-overflow', ''); var sv = d.querySelector('svg'); if (sv) sv.style.overflow = 'visible';
    return d;
  };
  /** Camera : place (px,py) au centre de l'ecran, zoom s (immediat). */
  S.camSet = function (ref, px, py, s) { gsap.set(ref.cam, { x: 960 - px * s, y: 600 - py * s, scale: s, transformOrigin: '0 0' }); };
  /** Camera : mouvement anime. */
  S.cam = function (tl, ref, px, py, s, at, dur, ease) { return tl.to(ref.cam, { x: 960 - px * s, y: 600 - py * s, scale: s, duration: dur, ease: ease || 'power2.inOut' }, at); };

  /** Ambiance de la salle : lanternes qui se balancent, faisceaux qui respirent, poussiere qui monte (cycles finis). span = duree. */
  S.ambience = function (tl, ref, span, at) {
    at = at || 0;
    ref.back.querySelectorAll('.ac-lamp').forEach(function (l, i) {
      var per = 3.2 + i * 0.5;
      tl.fromTo(l, { rotation: -1.6, svgOrigin: l.dataset.px + ' ' + l.dataset.py }, { rotation: 1.6, svgOrigin: l.dataset.px + ' ' + l.dataset.py, duration: per / 2, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / (per / 2))) }, at);
    });
    ref.light.querySelectorAll('.ac-beams path').forEach(function (b, i) {
      tl.fromTo(b, { opacity: 0.45 + i * 0.1 }, { opacity: 0.95, duration: 2.4 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(span / (2.4 + i * 0.6))) }, at);
    });
    ref.motes.querySelectorAll('.k-mote').forEach(function (m, i) {
      var x = +m.dataset.x, y = +m.dataset.y;
      tl.fromTo(m, { x: x, y: y, opacity: 0 }, { x: x + 30 - (i % 5) * 14, y: y - 120 - (i % 6) * 25, opacity: 0.85, duration: span * 0.5, ease: 'sine.out' }, at + (i % 7) * 0.12);
      tl.to(m, { opacity: 0, duration: span * 0.5, ease: 'sine.in' }, at + span * 0.5 + (i % 7) * 0.12);
    });
  };

  /** Personnage vectoriel (kit) : key 'ignacio'|'viajero'|'marina' ; pieds en (cx, feet), largeur w. Renvoie { el, b, svg, key, cx, feet, w }.
   *  `b` = enveloppe animable (origine aux pieds) ; `svg` = racine pour les fonctions charTalk / charWalk / charWave... du kit. */
  S.chr = function (layer, key, cx, feet, w, opts) {
    opts = opts || {};
    S.css();
    var ck = key === 'viajero' ? 'alex' : key, h = Math.round((w * 660) / 400);
    var el = mk(layer, 'chr'); el.id = 'chr-' + key; el.style.cssText = 'left:' + (cx - w / 2) + 'px;top:' + (feet - h * 0.965) + 'px;width:' + w + 'px;height:' + h + 'px';
    el.setAttribute('data-layout-allow-overflow', '');
    var b = mk(el, 'chr-b', Q.character(ck, { width: w, height: h, uid: 'ch' + key }));
    var svg = b.querySelector('svg'); svg.style.overflow = 'visible';
    if (opts.flip) gsap.set(b, { scaleX: -1 });
    return { el: el, b: b, svg: svg, key: key, cx: cx, feet: feet, w: w };
  };
  /** Etiquette de nom (plaque doree). */
  S.tag = function (layer, html, cx, y, color, cls) {
    var t = mk(layer, 'st-tag ' + (cls || ''), html);
    t.style.background = 'linear-gradient(180deg,#FFF1B5,' + (color || '#FFC83D') + ')';
    t.style.left = (cx - 100) + 'px'; t.style.top = y + 'px'; t.setAttribute('data-layout-allow-overflow', '');
    return t;
  };
  /** Marche : translation x0 -> x1 (jambes/bras animes par le kit). */
  S.walk = function (tl, ch, x0, x1, at, dur, step, ease) {
    tl.fromTo(ch.el, { x: x0 - ch.cx }, { x: x1 - ch.cx, duration: dur, ease: ease || 'power1.out' }, at);
    Q.charWalk(tl, ch.svg, at, dur, step || 0.34);
  };
  /** Saut de joie. */
  S.hop = function (tl, ch, at, h) {
    h = h || 60;
    tl.to(ch.b, { scaleY: 0.9, scaleX: 1.06, duration: 0.1, ease: 'power2.in' }, at);
    tl.to(ch.b, { y: -h, scaleY: 1.06, scaleX: 0.96, duration: 0.24, ease: 'power2.out' }, at + 0.1);
    tl.to(ch.b, { y: 0, scaleY: 0.92, scaleX: 1.05, duration: 0.2, ease: 'power2.in' }, at + 0.34);
    tl.to(ch.b, { scaleY: 1, scaleX: 1, duration: 0.25, ease: 'elastic.out(1,0.5)' }, at + 0.54);
  };
  /** Respiration douce + balancement (cycles finis). */
  S.breathe = function (tl, ch, at, span, amp) { Q.charIdle(tl, ch.svg, at, span, amp || 1); };
  /** Le Quetzal de la salle (svg du kit) pose en (cx, feet) ; largeur w. */
  S.quetzal = function (layer, cx, feet, w, pose, bare, uid) {
    var h = w * 1.2, el = mk(layer, 'st-qz'); el.style.cssText = 'position:absolute;left:' + (cx - w * 0.5) + 'px;top:' + (feet - h * 0.64) + 'px;width:' + w + 'px;height:' + h + 'px';
    el.setAttribute('data-layout-allow-overflow', '');
    el.innerHTML = Q.quetzal({ uid: uid || 'qs', width: w, height: h });
    el.querySelector('svg').style.overflow = 'visible';
    Q.quetzalSet(el, pose || 'perched', gsap);
    if (bare) Q.quetzalSet(el, 'bare', gsap);
    return el;
  };
  /** Plume qui tombe en tournoyant : renvoie l'element. */
  S.feather = function (layer, w) {
    var el = mk(layer, 'st-feather'); el.style.cssText = 'position:absolute;left:0;top:0;width:' + w + 'px;height:' + w * 3 + 'px;transform-origin:50% 8%';
    el.setAttribute('data-layout-allow-overflow', '');
    el.innerHTML = Q.featherSvg({ uid: 'ft' + Math.round(w), width: w, height: w * 3 });
    return el;
  };
})();
