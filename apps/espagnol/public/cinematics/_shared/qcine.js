/* QCine - runtime commun des cinematiques de La Leyenda del Quetzal (window.QCine). A la main (non genere).
 * Fournit : prenom du joueur (canal "player"), sous-titres espagnols mot a mot (boite JRPG, portrait, plaque de nom),
 * cadre commun (vignette, grain, guirlande de papel picado, fondus), petits utilitaires de timeline.
 * Depend de gsap + QArt (qart.js) + du runtime HyperFrames, charges avant. Deterministe : tout est cale sur window.PLAN. */
(function () {
  var SPEAK = {
    ignacio: { name: 'Don Ignacio', color: '#FFC83D', char: 'ignacio' },
    marina: { name: 'Marina', color: '#FF7FB0', char: 'marina' },
    viajero: { name: 'Álex', color: '#6FE7DC', char: 'alex', player: true },
    quetzal: { name: 'Quetzal', color: '#42E0A0', quetzal: true },
    sombra: { name: 'La Sombra', color: '#C65BFF', sombra: true },
    mateo: { name: 'Mateo', color: '#4F8FE8', char: 'mateo' },
    valentina: { name: 'Valentina', color: '#FF7FB0', char: 'valentina' },
    lupita: { name: 'Doña Lupita', color: '#19B7AA', char: 'lupita' },
    remedios: { name: 'Doña Remedios', color: '#FFA13D', char: 'remedios' },
    beto: { name: 'Beto', color: '#FFC83D', char: 'beto' },
    xochitl: { name: 'Xóchitl', color: '#FF9F1C', char: 'xochitl' },
    neus: { name: 'Neus', color: '#2EC4C8', char: 'neus' },
    vicent: { name: 'Vicent', color: '#FF9F1C', char: 'vicent' },
    nacho: { name: 'Nacho', color: '#7FB5FF', char: 'nacho' },
    rosa: { name: 'Rosa', color: '#FF8F6B', char: 'rosa' },
    paloma: { name: 'Paloma', color: '#FF7FB0', char: 'paloma' },
    facu: { name: 'Facu', color: '#5FB8FF', char: 'facu' },
    sol: { name: 'Sol', color: '#FFC83D', char: 'sol' },
    anibal: { name: 'Don Aníbal', color: '#E0A058', char: 'anibal' },
    camila: { name: 'Camila', color: '#FF8F6B', char: 'camila' },
    hernan: { name: 'Don Hernán', color: '#E0A058', char: 'hernan' },
    marta: { name: 'Doña Marta', color: '#FF7FB0', char: 'marta' },
    itzel: { name: 'Itzel', color: '#6FE7DC', char: 'itzel' },
    chan: { name: 'Don Chan', color: '#E9B25A', char: 'chan' },
    chabela: { name: 'Doña Chabela', color: '#FF9F1C', char: 'chabela' },
    killa: { name: 'Killa', color: '#B8A6FF', char: 'killa' },
    huaman: { name: 'Don Huamán', color: '#F59F00', char: 'huaman' },
    paulina: { name: 'Doña Paulina', color: '#D93472', char: 'paulina' },
    narrador: null,
  };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); };
  var DEFAULT_NAME = 'Álex';
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '') || './_shared/';
  var Q = (window.QCine = { speakers: SPEAK, player: { name: DEFAULT_NAME }, nameHooks: [] });

  function applyName() {
    var n = Q.player.name;
    document.querySelectorAll('.pname').forEach(function (el) { el.textContent = n; });
    SPEAK.viajero.name = n;
    (Q.nameHooks || []).forEach(function (f) { try { f(n); } catch (e) { /* ignore */ } });
  }
  /** Lit le prenom : variable de rendu (playerName) puis canal live "player" ({ name }). A appeler au chargement du script (synchrone). */
  Q.initPlayer = function () {
    try {
      var v = window.__hyperframes && window.__hyperframes.getVariables && window.__hyperframes.getVariables();
      if (v && typeof v.playerName === 'string' && v.playerName.trim()) Q.player.name = v.playerName.trim().slice(0, 18);
    } catch (e) { /* defaut */ }
    try {
      window.__hyperframes.registerRuntimeDataHandler('player', function (d) {
        var n = d && (d.name || d.nombre || d.playerName);
        if (typeof n === 'string' && n.trim()) { Q.player.name = n.trim().slice(0, 18); applyName(); }
      });
    } catch (e) { /* hors runtime */ }
    try {
      // canal "motion" (reglage "Animations douces" de l'app) : { soft: bool }
      window.__hyperframes.registerRuntimeDataHandler('motion', function (d) { Q.setSoft(!!(d && d.soft)); });
    } catch (e) { /* hors runtime */ }
    return Q.player.name;
  };
  Q.applyName = applyName;

  /* ---- mouvement sur (docs/architecture.md) : mode doux + effets plafonnes ---- */
  Q.soft = false;
  /** Mode "Animations douces" : plus de lueurs ni secousses ni etincelles/confettis ; les tweens relisent leurs valeurs (invalidate). */
  Q.setSoft = function (on) {
    Q.soft = !!on;
    var root = document.getElementById('root') || document.body;
    root.classList.toggle('q-soft', Q.soft);
    var tls = window.__timelines || {};
    Object.keys(tls).forEach(function (k) { try { var t = tls[k]; t.invalidate(); t.time(0); } catch (e) { /* ignore */ } });
  };
  var softV = function (v) { return function () { return Q.soft ? 0 : v; }; };
  /** Lueur douce a la place d'un flash : opacite <= .25, montee >= .3 s, descente .6 s. sel = element en degrade radial chaud. */
  Q.bloom = function (tl, sel, at, peak, rise, fall) {
    var p = Math.min(peak == null ? 0.2 : peak, 0.25), r = Math.max(rise == null ? 0.32 : rise, 0.3);
    tl.fromTo(sel, { opacity: 0 }, { opacity: softV(p), duration: r, ease: 'sine.inOut', immediateRender: false }, at);
    tl.to(sel, { opacity: 0, duration: fall || 0.6, ease: 'sine.inOut' }, at + r + 0.005);
  };
  /** Secousse moderee : amplitude <= 10 px, oscillations >= .1 s, 4 allers-retours ; rien en mode doux. */
  Q.shake = function (tl, sel, at, amp) {
    var a = Math.min(amp == null ? 8 : amp, 10), d = 0.11, ks = [];
    [-1, 0.8, -0.55, 0.3, 0].forEach(function (k) { ks.push({ x: softV(k * a), y: softV(k * a * 0.35), duration: d, ease: 'sine.inOut' }); });
    tl.to(sel, { keyframes: ks }, at);
  };

  function el(tag, cls, html, parent) {
    var e = document.createElement(tag);
    e.setAttribute('data-layout-allow-orbit', '');
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }

  var CSS = '' +
    '.q-soft .q-fx,.q-soft .st-motes,.q-soft .shard,.q-soft .dust,.q-soft .star,.q-soft .spark,.q-soft .cf,.q-soft .vflash,.q-soft #flash,.q-soft #rays,.q-soft #raysB{display:none!important}' +
    '.q-frame{position:absolute;inset:0;pointer-events:none}' +
    '.q-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(11,13,42,0) 52%,rgba(11,13,42,.5) 100%);z-index:30}' +
    '.q-grain{position:absolute;inset:0;z-index:31;opacity:.55;background-size:256px 256px;background-repeat:repeat}' +
    '.q-garland{position:absolute;left:0;top:-26px;width:1920px;z-index:40}' +
    '.q-fade{position:absolute;inset:0;background:#0B0D2A;z-index:90;opacity:0}' +
    '#subs{position:absolute;left:96px;right:96px;bottom:60px;height:260px;z-index:50}' +
    '.sub-plaque{position:absolute;left:0;right:0;bottom:0;height:178px;border-radius:30px;background:linear-gradient(180deg,rgba(29,33,96,.96),rgba(20,23,63,.97));border:5px solid #F5E6C8;box-shadow:0 0 0 4px #14173F,0 18px 0 -2px rgba(0,0,0,.28),inset 0 0 0 4px rgba(255,200,61,.55);opacity:0}' +
    '.sub-orn{position:absolute;width:46px;height:46px;z-index:2}' +
    '.sub-line{position:absolute;left:0;right:0;bottom:0;height:178px;display:flex;align-items:center;justify-content:center;padding:0 54px 0 54px;box-sizing:border-box;opacity:0;z-index:3}' +
    '.sub-line.has-p{padding-left:268px}' +
    '.sub-txt{font:900 56px/1.22 Nunito,sans-serif;color:#F5E6C8;text-align:center;max-width:1620px;text-shadow:0 3px 0 rgba(0,0,0,.35)}' +
    '.sub-line.has-p .sub-txt{text-align:left}' +
    '.sub-txt{white-space:normal;word-spacing:0}' +
    '.sub-txt .w{display:inline-block;white-space:pre;font:inherit;letter-spacing:0}' +
    '.sub-txt .sp{display:inline;white-space:pre}' +
    '.sub-who{position:absolute;left:262px;bottom:150px;z-index:5;transform-origin:0 100%}' +
    '.sub-who span{display:inline-block;padding:6px 28px 10px;font:400 34px/1 "Alfa Slab One",serif;color:#14173F;border-radius:14px;box-shadow:0 5px 0 rgba(0,0,0,.35),inset 0 0 0 3px rgba(255,255,255,.45)}' +
    '.sub-portrait{position:absolute;left:20px;bottom:-4px;width:228px;height:270px;z-index:6;display:flex;align-items:flex-end;justify-content:center;opacity:0}' +
    '.sub-portrait img,.sub-portrait svg{position:relative;width:100%;height:auto;max-height:100%;object-fit:contain;filter:drop-shadow(0 8px 0 rgba(0,0,0,.32))}' +
    '.sub-portrait .halo{position:absolute;left:4px;right:4px;bottom:8px;height:170px;border-radius:50%;opacity:.55}';

  Q.css = function () { if (!document.getElementById('qcine-css')) { var s = el('style'); s.id = 'qcine-css'; s.textContent = CSS; document.head.appendChild(s); } };

  /** Cadre commun : vignette, grain, guirlande de papel picado qui se balance, fondu d'entree/sortie. root = #root. opts.garland (defaut true). */
  Q.frame = function (tl, root, plan, opts) {
    opts = opts || {};
    Q.css();
    var Qa = window.QArt;
    if (opts.vig !== false) el('div', 'q-vig q-frame', '', root);
    var gr = el('div', 'q-grain q-frame', '', root); gr.style.backgroundImage = 'url(' + BASE + 'img/grain.webp)'; gr.setAttribute('data-layout-ignore', '');
    if (opts.garland !== false) {
      // motif de bordure selon la region : Espagne -> frise d'azulejos + fanions sobres ; Mexique -> papel picado
      var region = opts.region || (plan.meta && plan.meta.region) || 'madrid', mx = region === 'mexico';
      var g = el('div', 'q-garland', Qa.bunting(region, mx ? { w: 1920, h: 150, n: 11, seed: opts.seed || 7, sag: 36 } : { w: 1920, n: 16, seed: opts.seed || 7 }), root);
      if (!mx) g.style.top = '0px';
      var flags = g.querySelectorAll('.m-flag');
      var T = plan.total, per = mx ? 2.6 : 3.2, amp = mx ? 4 : 2.2;
      flags.forEach(function (f, i) {
        var rep = Math.max(1, Math.floor(T / per) * 2);
        tl.fromTo(f, { rotation: -amp - (i % 3) * 0.6, svgOrigin: f.dataset.px + ' ' + f.dataset.py }, { rotation: amp + (i % 3) * 0.6, svgOrigin: f.dataset.px + ' ' + f.dataset.py, duration: per / 2 + (i % 4) * 0.12, ease: 'sine.inOut', yoyo: true, repeat: rep }, 0);
      });
      if (opts.garlandIn !== false) tl.fromTo(g, { y: -260 }, { y: 0, duration: 0.8, ease: 'back.out(1.3)' }, 0.15);
    }
    var fade = el('div', 'q-fade', '', root);
    tl.fromTo(fade, { opacity: 1 }, { opacity: 0, duration: opts.fadeIn == null ? 0.45 : opts.fadeIn, ease: 'power2.out' }, 0);
    tl.to(fade, { opacity: 1, duration: opts.fadeOut == null ? 0.28 : opts.fadeOut, ease: 'power2.in' }, plan.total - (opts.fadeOut == null ? 0.28 : opts.fadeOut));
    return { fade: fade, garland: g };
  };

  /** Sous-titres mot a mot. Cree #subs dans root et programme apparitions + karaoke (mot actif en or). Renvoie { lines, groups }.
   *  opts : { skip: [numeros de plan sans sous-titres] } */
  Q.subs = function (tl, root, plan, opts) {
    opts = opts || {};
    Q.css();
    var Qa = window.QArt;
    var host = el('div', null, '', root); host.id = 'subs';
    var plaque = el('div', 'sub-plaque', '', host);
    el('div', 'sub-orn', Qa.cornerOrnament(46), plaque).style.cssText = 'left:8px;top:8px';
    var orn2 = el('div', 'sub-orn', Qa.cornerOrnament(46), plaque); orn2.style.cssText = 'right:8px;top:8px;transform:scaleX(-1)';
    var flat = [];
    plan.plans.forEach(function (p) { p.lines.forEach(function (l, i) { flat.push({ p: p, l: l, i: i }); }); });
    // portraits (un par locuteur)
    var portraits = {};
    flat.forEach(function (f) {
      var s = SPEAK[f.l.who];
      if (!s || portraits[f.l.who]) return;
      var d = el('div', 'sub-portrait', '<div class="halo" style="background:radial-gradient(closest-side,' + s.color + ',transparent)"></div>', host);
      if (s.quetzal) { d.insertAdjacentHTML('beforeend', Qa.quetzal({ view: '200 40 240 240', width: 228, height: 228, uid: 'qp' })); d.querySelector('svg').setAttribute('data-layout-allow-overflow', ''); }
      else if (s.sombra) { d.insertAdjacentHTML('beforeend', Qa.sombra({ view: '110 10 300 300', width: 228, height: 228, uid: 'ps' })); d.querySelector('svg').setAttribute('data-layout-allow-overflow', ''); }
      else if (s.char) { d.insertAdjacentHTML('beforeend', Qa.character(s.char, { view: 'bust', width: 228, uid: 'pt' + f.l.who })); d.querySelector('svg').setAttribute('data-layout-allow-overflow', ''); }
      else d.insertAdjacentHTML('beforeend', '<img src="' + s.img + '" alt="">');
      portraits[f.l.who] = d;
    });
    var lines = [];
    flat.forEach(function (f) {
      var s = SPEAK[f.l.who], l = f.l;
      var ln = el('div', 'sub-line' + (s ? ' has-p' : ''), '', host);
      var txt = el('div', 'sub-txt', '', ln);
      var words = l.words.map(function (w) {
        if (txt.childNodes.length) txt.appendChild(document.createTextNode(' '));
        var span = el('span', 'w', '', txt);
        var core = w.w.replace(/^[¿¡"«(]+/, '').replace(/[.,;:!?…"»)]+$/, '');
        if (norm(core) === norm(DEFAULT_NAME)) {
          var pre = w.w.slice(0, w.w.indexOf(core)), post = w.w.slice(w.w.indexOf(core) + core.length);
          span.innerHTML = pre + '<span class="pname">' + Q.player.name + '</span>' + post;
        } else span.textContent = w.w;
        return span;
      });
      var who = null;
      if (s) { who = el('div', 'sub-who', '<span style="background:linear-gradient(180deg,#FFF1B5,' + s.color + ')"' + (s.player ? ' class="pname"' : '') + '>' + s.name + '</span>', host); }
      lines.push({ el: ln, who: who, words: words, data: l, plan: f.p, speaker: l.who });
    });
    // ajustement deterministe : taille de depart 56 px, reduite par pas de 2 px jusqu'a ce que le texte tienne dans la plaque
    // (hauteur utile = plaque - marges). Mesure sans transform (offsetHeight) ; refaite quand la police ou le prenom changent.
    var fit = function () {
      var avail = 178 - 26;
      lines.forEach(function (L) {
        var t = L.el.querySelector('.sub-txt'), sz = 56;
        t.style.fontSize = sz + 'px';
        while (sz > 30 && t.offsetHeight > avail) { sz -= 2; t.style.fontSize = sz + 'px'; }
      });
    };
    fit();
    Q.nameHooks.push(fit);
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); } catch (e) { /* ignore */ }
    // groupes (plaque affichee tant que les repliques s'enchainent, ecart < 1.4 s)
    var groups = [], g = null;
    lines.forEach(function (L) {
      var skip = opts.skip && opts.skip.indexOf(L.plan.n) >= 0;
      L.skip = skip;
      if (skip) return;
      if (g && L.data.t - g.end < 1.4) { g.end = L.data.t + L.data.d; g.lines.push(L); } else { g = { t: L.data.t, end: L.data.t + L.data.d, lines: [L] }; groups.push(g); }
    });
    groups.forEach(function (G) {
      var tIn = Math.max(0.05, G.t - 0.3);
      tl.fromTo(plaque, { y: 80, opacity: 0, scale: 0.94, transformOrigin: '50% 100%' }, { y: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.5)' }, tIn);
      tl.to(plaque, { y: 60, opacity: 0, duration: 0.26, ease: 'power2.in' }, G.end + 0.18);
    });
    lines.forEach(function (L, k) {
      if (L.skip) return;
      var d = L.data, prev = lines[k - 1], next = lines[k + 1];
      var sameAsPrev = prev && !prev.skip && prev.speaker === L.speaker && d.t - (prev.data.t + prev.data.d) < 0.9;
      var sameAsNext = next && !next.skip && next.speaker === L.speaker && next.data.t - (d.t + d.d) < 0.9;
      tl.fromTo(L.el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, d.t - 0.06);
      tl.to(L.el, { opacity: 0, duration: 0.14, ease: 'power1.in' }, d.t + d.d + 0.12);
      var P = portraits[L.speaker];
      if (L.who) {
        tl.fromTo(L.who, { scale: 0, y: 10, rotation: -4 }, { scale: 1, y: 0, rotation: -1.5, duration: 0.3, ease: 'back.out(2.4)' }, d.t - 0.06);
        tl.to(L.who, { scale: 0, duration: 0.16, ease: 'power2.in' }, d.t + d.d + 0.12);
      }
      if (P && !sameAsPrev) tl.fromTo(P, { opacity: 0, y: 40, scale: 0.86, transformOrigin: '50% 100%' }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, d.t - 0.12);
      if (P && !sameAsNext) tl.to(P, { opacity: 0, y: 24, duration: 0.2, ease: 'power2.in' }, d.t + d.d + 0.12);
      // karaoke : mots a venir attenues, mot actif or + petit saut, mots dits normaux
      L.words.forEach(function (w, i) {
        var wd = d.words[i];
        tl.set(w, { opacity: 0.72 }, 0);
        // mise en valeur par la couleur seule (+ leger saut en transform) : aucune taille/graisse ne change -> aucun reflow
        tl.to(w, { opacity: 1, color: '#FFC83D', y: -4, duration: 0.09, ease: 'power2.out' }, wd.t);
        tl.to(w, { color: '#F5E6C8', y: 0, duration: 0.2, ease: 'power2.out' }, wd.t + Math.max(0.12, wd.d));
      });
    });
    return { lines: lines, groups: groups, host: host, portraits: portraits };
  };

  /** Ligne du plan (n, i = 1..) -> donnees { t, d, words }. */
  Q.line = function (plan, n, i) { var p = plan.plans.filter(function (x) { return x.n === n; })[0]; return p && p.lines[i - 1]; };
  Q.planOf = function (plan, n) { return plan.plans.filter(function (x) { return x.n === n; })[0]; };
  /** Temps du mot k (1..) de la replique i du plan n. */
  Q.wordT = function (plan, n, i, k) { var l = Q.line(plan, n, i); return l.words[Math.min(k, l.words.length) - 1].t; };

  /** Bouche du Quetzal sur une replique : n ouvertures proportionnelles au nombre de mots. */
  Q.talkQuetzal = function (tl, root, line) {
    var Qa = window.QArt;
    line.words.forEach(function (w) { Qa.quetzalTalk(tl, root, w.t, Math.max(0.16, w.d), 1); });
  };

  /** Rebond de parole (petit squash and stretch) d'un personnage plat sur toute la replique. */
  Q.talkBounce = function (tl, target, line, amp) {
    var a = amp || 8;
    line.words.forEach(function (w, i) {
      if (i % 2) return;
      tl.to(target, { y: -a, scaleY: 1.025, scaleX: 0.99, duration: 0.1, ease: 'power2.out' }, w.t);
      tl.to(target, { y: 0, scaleY: 1, scaleX: 1, duration: 0.18, ease: 'power2.in' }, w.t + 0.1);
    });
  };

  /** Personnage vectoriel (QStage.chr) qui parle : bouche mot a mot + hochements de tete discrets. */
  Q.talkChar = function (tl, ch, line, nod) {
    var Qa = window.QArt;
    line.words.forEach(function (w, i) {
      Qa.charTalk(tl, ch.svg, w.t, Math.max(0.14, Math.min(w.d, 0.42)), 1);
      if (nod !== false && i % 2 === 0) Qa.charNod(tl, ch.svg, w.t, (i % 4 ? -1 : 1) * (nod || 2.6), 0.14);
    });
  };

  /** Nombre de repetitions finies d'un cycle (jamais -1) pour remplir `span` secondes. */
  Q.reps = function (span, cycle) { return Math.max(0, Math.floor(span / cycle) - 1); };
  Q.el = el;
})();
