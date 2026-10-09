/* Aides communes des cinematiques de strategie (window.Strat). Pas de reseau, deterministe. Depend de gsap + CEArt (charges avant). */
(function () {
  var S = {};
  var SK = ["#F6C9A0", "#E8B48A", "#D49A6A", "#B9774A", "#8A5230", "#5E3721"];
  var HR = ["#2a1a12", "#5a3320", "#c9892f", "#161616", "#8a2f12"];
  S.RED = "#E8212F"; S.BLUE = "#1B6BFF"; S.GOLD = "#FFD23F"; S.GREEN = "#17B26A"; S.ORANGE = "#FF8A1F";

  /** Petit joueur "grosse tete" (SVG leger). o : c (maillot), c2 (col), num, skin 0-5, hair 0-4, shorts. */
  S.token = function (o) {
    o = o || {};
    var c = o.c || S.RED, c2 = o.c2 || "#fff", skin = SK[(o.skin == null ? 1 : o.skin) % 6], hair = HR[(o.hair == null ? 0 : o.hair) % 5];
    var sh = o.shorts || (CEArt.lum(c) > 0.5 ? "#13204f" : "#fff"), nc = CEArt.textOn(c), sd = CEArt.shade(skin, -0.34);
    var num = o.num == null || o.num === "" ? "" : '<text x="60" y="103" text-anchor="middle" font-family="Anton, sans-serif" font-size="30" fill="' + nc + '" stroke="' + (nc === "#FFFFFF" ? "#0A1030" : "#fff") + '" stroke-width="3" paint-order="stroke">' + o.num + "</text>";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">' +
      '<ellipse cx="60" cy="162" rx="36" ry="8" fill="#000" opacity=".28"/>' +
      '<rect x="40" y="120" width="16" height="36" rx="6" fill="' + skin + '"/><rect x="64" y="120" width="16" height="36" rx="6" fill="' + skin + '"/>' +
      '<rect x="40" y="134" width="16" height="20" fill="' + c + '"/><rect x="64" y="134" width="16" height="20" fill="' + c + '"/>' +
      '<ellipse cx="46" cy="157" rx="14" ry="7" fill="#121528"/><ellipse cx="74" cy="157" rx="14" ry="7" fill="#121528"/>' +
      '<rect x="34" y="106" width="52" height="26" rx="8" fill="' + sh + '"/>' +
      '<rect x="14" y="78" width="16" height="36" rx="8" fill="' + skin + '"/><rect x="90" y="78" width="16" height="36" rx="8" fill="' + skin + '"/>' +
      '<path d="M30 80 Q30 70 44 68 H76 Q90 70 90 80 L92 112 H28Z" fill="' + c + '"/><rect x="14" y="78" width="16" height="16" rx="7" fill="' + c + '"/><rect x="90" y="78" width="16" height="16" rx="7" fill="' + c + '"/>' +
      '<path d="M48 68 L60 84 L72 68" fill="none" stroke="' + c2 + '" stroke-width="5" stroke-linejoin="round"/>' + num +
      '<circle cx="60" cy="44" r="31" fill="' + skin + '" stroke="' + sd + '" stroke-width="3"/>' +
      '<path d="M29 42 Q28 11 60 11 Q92 11 91 42 Q78 27 60 30 Q42 27 29 42Z" fill="' + hair + '"/>' +
      '<ellipse cx="48" cy="48" rx="6" ry="7.5" fill="#fff"/><ellipse cx="72" cy="48" rx="6" ry="7.5" fill="#fff"/>' +
      '<circle cx="49" cy="50" r="3.8" fill="#0c0a10"/><circle cx="73" cy="50" r="3.8" fill="#0c0a10"/>' +
      '<circle cx="47.6" cy="47.6" r="1.5" fill="#fff"/><circle cx="71.6" cy="47.6" r="1.5" fill="#fff"/>' +
      '<path d="M47 62 Q60 73 73 62" stroke="#6b1d2a" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="38" cy="58" rx="6" ry="3.6" fill="#ff5e7a" opacity=".35"/><ellipse cx="82" cy="58" rx="6" ry="3.6" fill="#ff5e7a" opacity=".35"/></svg>';
  };

  /** Terrain vu de dessus, 1360x800 : bandes de pelouse + contour. extra : svg additionnel. */
  S.pitch = function (extra) {
    var b = "";
    for (var i = 0; i < 10; i++) b += '<rect x="' + i * 136 + '" y="0" width="136" height="800" fill="' + (i % 2 ? "#1c9a52" : "#22a95a") + '"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1360 800" width="1360" height="800">' + b +
      '<rect x="26" y="26" width="1308" height="748" rx="14" fill="none" stroke="#fff" stroke-width="7" opacity=".85"/>' + (extra || "") + "</svg>";
  };

  /** Place un element absolu dans `host`. kind 'tk' : pieds en (x,y), w = largeur ; 'it' : centre en (x,y), carre w. Renvoie l'element. */
  S.put = function (host, html, x, y, w, kind, cls) {
    var d = document.createElement("div");
    d.className = (kind || "tk") + (cls ? " " + cls : "");
    var h = kind === "it" ? w : (w * 170) / 120;
    d.style.width = w + "px"; d.style.height = h + "px";
    d.style.left = x - w / 2 + "px"; d.style.top = (kind === "it" ? y - h / 2 : y - h) + "px";
    d.innerHTML = html;
    host.appendChild(d);
    return d;
  };

  /** Cadre a 10 (2 rangees x 5 postes). Renvoie { el, slots:[{x,y}], w, h } (centres des postes, repere `host`). cell = pas. */
  S.frame10 = function (host, cx, cy, cell) {
    var w = cell * 5 + 40, h = cell * 2 + 40, x0 = cx - w / 2, y0 = cy - h / 2;
    var f = document.createElement("div");
    f.className = "it";
    f.style.cssText = "left:" + x0 + "px;top:" + y0 + "px;width:" + w + "px;height:" + h + "px;border-radius:26px;background:rgba(10,16,48,.5);box-shadow:0 0 0 7px rgba(255,255,255,.9) inset";
    var slots = [], dots = "";
    for (var r = 0; r < 2; r++) for (var c = 0; c < 5; c++) {
      var sx = 20 + cell * c + cell / 2, sy = 20 + cell * r + cell / 2;
      slots.push({ x: x0 + sx, y: y0 + sy });
      dots += '<circle cx="' + sx + '" cy="' + sy + '" r="' + cell * 0.36 + '" fill="rgba(255,255,255,.14)" stroke="#fff" stroke-width="5" stroke-dasharray="14 12"/>';
    }
    f.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '">' + dots + "</svg>";
    host.appendChild(f);
    return { el: f, slots: slots, w: w, h: h, x0: x0, y0: y0 };
  };

  /** Equation : parts = [["7","n"],["+","op"],...] ; classes : n, op, res, fam. */
  S.eq = function (el, parts) {
    el.innerHTML = parts.map(function (p, i) { return '<span class="e ' + p[1] + '" data-i="' + i + '">' + p[0] + "</span>"; }).join("");
    return Array.prototype.slice.call(el.querySelectorAll(".e"));
  };

  /** Apparition "pop" (etat initial pose a t=0, pas de fromTo). */
  S.hide = function (tl, targets, scale) { tl.set(targets, { opacity: 0, scale: scale == null ? 0.2 : scale }, 0); };
  S.pop = function (tl, targets, at, dur, ease) {
    tl.to(targets, { opacity: 1, scale: 1, duration: dur || 0.35, ease: ease || "back.out(2.2)" }, at);
  };
  S.unpop = function (tl, targets, at, dur) {
    var d = dur || 0.22;
    tl.to(targets, { scale: 0, duration: d, ease: "power2.in" }, at);
    tl.set(targets, { opacity: 0 }, at + d + 0.01);
  };
  /** Bonds (marche/course) : n bonds de hauteur h sur dur a partir de `at` (y absolu, base y0 = 0). */
  S.hop = function (tl, el, at, dur, n, h, y0) {
    var s = dur / n, b = y0 || 0;
    for (var i = 0; i < n; i++) {
      tl.to(el, { y: b - h, duration: s * 0.45, ease: "power2.out" }, at + i * s);
      tl.to(el, { y: b, duration: s * 0.55, ease: "power2.in" }, at + i * s + s * 0.45);
    }
  };
  /** Passe en arc : (x0,y0) -> (x1,y1) (decalages de transform), sommet h px au-dessus de la droite. */
  S.arc = function (tl, el, x0, y0, x1, y1, at, dur, h) {
    tl.fromTo(el, { x: x0 }, { x: x1, duration: dur, ease: "none", immediateRender: false }, at);
    var ym = (y0 + y1) / 2 - h;
    tl.fromTo(el, { y: y0 }, { y: ym, duration: dur / 2, ease: "power2.out", immediateRender: false }, at);
    tl.to(el, { y: y1, duration: dur / 2 - 0.005, ease: "power2.in" }, at + dur / 2 + 0.005);
  };
  /** Coach : pose "explique", respiration, petit rebond au debut de chaque phrase, celebration optionnelle a `cel`. */
  S.coach = function (tl, host, P, cel) {
    host.innerHTML = CEArt.coach({ width: 400, height: 600, uid: "co" });
    var svg = host.firstChild;
    CEArt.setPose(gsap, svg, "explique");
    CEArt.idleCycle(gsap, tl, svg, 0, P.total);
    P.t.forEach(function (t) {
      tl.to(host, { y: -16, duration: 0.12, ease: "power2.out" }, t);
      tl.to(host, { y: 0, duration: 0.3, ease: "bounce.out" }, t + 0.12);
    });
    if (cel != null) CEArt.toPose(gsap, tl, svg, "celebration", cel, 0.4, "back.out(1.7)");
    return svg;
  };
  /** Fondu d'ouverture/fermeture (voile marine). */
  S.fades = function (tl, total) {
    tl.set("#fadein", { opacity: 1 }, 0);
    tl.to("#fadein", { opacity: 0, duration: 0.3, ease: "power1.out" }, 0);
    tl.to("#fadein", { opacity: 1, duration: 0.3, ease: "power1.in" }, total - 0.3);
  };
  window.Strat = S;
})();
