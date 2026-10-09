// Zone 8 : passer la dizaine : 8 + 5 = 8 + 2 + 3 : remplir le 1er cadre (10) puis le reste dans le 2e ; 13 - 5 = 8.
// Phrases : 0 "Huit plus cinq : remplis d'abord le cadre !" 1 "Huit plus deux, dix." 2 "Il reste trois : dix plus trois, treize !" 3 "Treize moins cinq, huit."
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var A = S.frame10(c.field, 340, 400, 115), B = S.frame10(c.field, 1020, 400, 115);
  var W = 100, FOOT = 74;
  var red = [], gold = [];
  for (var i = 0; i < 8; i++) red.push(c.tok({ c: S.RED, c2: "#fff", skin: i % 6, hair: i % 5 }, A.slots[i].x, A.slots[i].y + FOOT, W));
  // 5 remplacants sur le banc (en bas) : 2 iront dans le cadre A, 3 dans le cadre B
  var bx = [360, 520, 680, 840, 1000];
  var dst = [A.slots[8], A.slots[9], B.slots[0], B.slots[1], B.slots[2]];
  for (var j = 0; j < 5; j++) gold.push(c.tok({ c: S.GOLD, c2: "#0a1030", num: 9 + j, skin: (j + 1) % 6, hair: (j + 2) % 5 }, bx[j], 760, W));
  var nA = c.nb("8", 340, 120, ""), nA10 = c.nb("10", 340, 120, "gold"), nB = c.nb("3", 1020, 120, ""), n13 = c.nb("13", 680, 120, "gold");
  var split = c.lbl("5 = 2 + 3", 680, 620, "gold");
  var e1 = S.eq(c.eq[0], [["8", "e"], ["+", "op"], ["5", "e"]]);
  var e2 = S.eq(c.eq[1], [["8", "e"], ["+", "op"], ["2", "e"], ["=", "op"], ["10", "res"]]);
  var e3 = S.eq(c.eq[2], [["10", "e"], ["+", "op"], ["3", "e"], ["=", "op"], ["13", "res"]]);
  var e4 = S.eq(c.eq[3], [["13", "e"], ["−", "op"], ["5", "e"], ["=", "op"], ["8", "res"]]);
  S.hide(tl, red.concat(gold, [A.el, B.el, nA, nA10, nB, n13, split], e1, e2, e3, e4));
  // --- phrase 0 : 8 joueurs dans le cadre, 5 remplacants sur le banc
  S.pop(tl, A.el, T(0, 0), 0.35);
  red.forEach(function (t, i) { S.pop(tl, t, T(0, 0.1) + i * 0.05, 0.3); });
  S.pop(tl, nA, T(0, 0.3)); S.pop(tl, e1, T(0, 0.35), 0.3);
  gold.forEach(function (g, i) { S.pop(tl, g, T(0, 0.55) + i * 0.06, 0.3); });
  S.pop(tl, split, T(0, 0.85), 0.35);
  // --- phrase 1 : 8 + 2 = 10
  S.unpop(tl, e1, T(1, 0));
  S.pop(tl, e2.slice(0, 3), T(1, 0.06), 0.3);
  [0, 1].forEach(function (k) {
    var at = T(1, 0.12) + k * 0.14;
    tl.to(gold[k], { x: dst[k].x - bx[k], y: dst[k].y + FOOT - 760, duration: 0.55, ease: "power2.inOut" }, at);
  });
  S.unpop(tl, nA, T(1, 0.5), 0.15);
  S.pop(tl, [e2[3], e2[4], nA10], T(1, 0.62), 0.35);
  c.ring(A.slots[9].x, A.slots[9].y, T(1, 0.62));
  // --- phrase 2 : il reste 3, 10 + 3 = 13
  S.unpop(tl, [].concat(e2, [split]), T(2, 0));
  S.pop(tl, e3.slice(0, 3), T(2, 0.06), 0.3);
  S.pop(tl, B.el, T(2, 0.1), 0.35);
  [2, 3, 4].forEach(function (k) {
    var at = T(2, 0.2) + (k - 2) * 0.14;
    tl.to(gold[k], { x: dst[k].x - bx[k], y: dst[k].y + FOOT - 760, duration: 0.55, ease: "power2.inOut" }, at);
  });
  S.pop(tl, nB, T(2, 0.45));
  S.pop(tl, [e3[3], e3[4], n13], T(2, 0.68), 0.35);
  c.ring(B.slots[2].x, B.slots[2].y, T(2, 0.7));
  // --- phrase 3 : 13 - 5 = 8
  S.unpop(tl, [].concat(e3, [n13, nB, nA10]), T(3, 0));
  S.pop(tl, e4.slice(0, 3), T(3, 0.06), 0.3);
  gold.forEach(function (g, k) { S.unpop(tl, g, T(3, 0.15) + k * 0.06, 0.25); });
  S.unpop(tl, B.el, T(3, 0.4), 0.25);
  S.pop(tl, nA, T(3, 0.55));
  S.pop(tl, e4.slice(3), T(3, 0.6));
  c.ring(340, 400, T(3, 0.62));
  c.cheer(T(3, 0.64));
}
