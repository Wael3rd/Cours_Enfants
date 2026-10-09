// Zone 4 : cadre a 10 = formation de 10 joueurs ; 7 + 3 = 10, 10 - 7 = 3.
// Phrases : 0 "Amoureux de dix : ensemble, ça fait dix !" 1 "Sept joueurs : il en manque trois !" 2 "Sept plus trois, dix !" 3 "Dix moins sept ? Trois !"
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var fr = S.frame10(c.field, 560, 430, 170);
  var W = 120, FOOT = 84, slot = fr.slots;
  var red = [], gold = [];
  for (var i = 0; i < 7; i++) red.push(c.tok({ c: S.RED, c2: "#fff", num: i + 1, skin: i % 6, hair: i % 5 }, slot[i].x, slot[i].y + FOOT, W));
  for (var j = 0; j < 3; j++) gold.push(c.tok({ c: S.GOLD, c2: "#0a1030", num: 8 + j, skin: (j + 2) % 6, hair: (j + 1) % 5 }, slot[7 + j].x, slot[7 + j].y + FOOT, W));
  var heart = c.put('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><path d="M50 84 C10 56 0 36 0 24 C0 8 14 0 26 0 C38 0 46 8 50 16 C54 8 62 0 74 0 C86 0 100 8 100 24 C100 36 90 56 50 84Z" fill="#ff4d6d" stroke="#fff" stroke-width="6"/></svg>', 1190, 600, 190, "it");
  var n10 = c.nb("10", 1190, 230, "gold");
  var e1 = S.eq(c.eq[0], [["7", "e"], ["+", "op"], ["?", "fam"], ["=", "op"], ["10", "res"]]);
  var e2 = S.eq(c.eq[1], [["7", "e"], ["+", "op"], ["3", "e"], ["=", "op"], ["10", "res"]]);
  var e3 = S.eq(c.eq[2], [["10", "e"], ["−", "op"], ["7", "e"], ["=", "op"], ["3", "res"]]);
  var e0 = S.eq(c.eq[3], [["10", "res"]]);
  S.hide(tl, red.concat([heart, n10, fr.el], e0, e1, e2, e3));
  // les 3 joueurs qui manquent attendent hors du terrain (a droite)
  gold.forEach(function (g) { tl.set(g, { opacity: 0, scale: 1, x: 900 }, 0); });
  // --- phrase 0 : le cadre = formation de 10
  S.pop(tl, fr.el, T(0, 0), 0.4); S.pop(tl, n10, T(0, 0.55), 0.4, "back.out(3)"); S.pop(tl, e0, T(0, 0.6), 0.4, "back.out(3)");
  // --- phrase 1 : 7 joueurs, il en manque 3
  red.forEach(function (t, i) { S.pop(tl, t, T(1, 0) + i * 0.06, 0.3); });
  S.unpop(tl, e0, T(1, 0), 0.2);
  S.pop(tl, e1.slice(0, 2), T(1, 0.05), 0.3);
  S.pop(tl, e1[2], T(1, 0.55), 0.35); S.pop(tl, e1.slice(3), T(1, 0.75), 0.3);
  // --- phrase 2 : les 3 arrivent
  S.unpop(tl, e1, T(2, 0));
  S.pop(tl, e2.slice(0, 3), T(2, 0.06), 0.3);
  gold.forEach(function (g, k) {
    var at = T(2, 0.1) + k * 0.13;
    tl.set(g, { opacity: 1 }, at);
    tl.to(g, { x: 0, duration: 0.55, ease: "power2.out" }, at);
    S.hop(tl, g, at, 0.55, 3, 22);
  });
  S.pop(tl, e2.slice(3), T(2, 0.55));
  c.ring(slot[9].x, slot[9].y, T(2, 0.6)); S.pop(tl, heart, T(2, 0.62), 0.4, "back.out(3)");
  tl.to(n10, { scale: 1.25, duration: 0.15, ease: "power2.out" }, T(2, 0.6)); tl.to(n10, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T(2, 0.75));
  // --- phrase 3 : 10 - 7 = 3
  S.unpop(tl, e2, T(3, 0));
  S.pop(tl, e3.slice(0, 3), T(3, 0.06), 0.3);
  red.forEach(function (t) { tl.to(t, { opacity: 0.55, duration: 0.3 }, T(3, 0.15)); });
  S.pop(tl, e3.slice(3), T(3, 0.55));
  gold.forEach(function (g, k) { S.hop(tl, g, T(3, 0.55) + k * 0.07, 0.4, 1, 34); });
  c.ring(slot[8].x, slot[8].y, T(3, 0.58));
  c.cheer(T(3, 0.62));
}
