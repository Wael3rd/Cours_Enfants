// Zone 7 : +9 = +10 puis -1 : 8 + 9 : cadre avec 9 joueurs + une place vide ; 8 + 10 = 18, un sort : 17 ; 17 - 9 = 8.
// Phrases : 0 "Plus neuf : presque plus dix !" 1 "Huit plus dix, dix-huit." 2 "Un joueur sort : moins un. Dix-sept !" 3 "Dix-sept moins neuf, huit."
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var fr = S.frame10(c.field, 980, 500, 130);
  var slot = fr.slots, W = 100, FOOT = 72;
  var red = [], blue = [];
  var pos = [[130, 470], [260, 470], [390, 470], [520, 470], [130, 710], [260, 710], [390, 710], [520, 710]];
  pos.forEach(function (p, i) { red.push(c.tok({ c: S.RED, c2: "#fff", skin: i % 6, hair: i % 5 }, p[0], p[1], 130)); });
  for (var i = 0; i < 10; i++) blue.push(c.tok({ c: i === 9 ? S.GOLD : S.BLUE, c2: i === 9 ? "#0a1030" : "#FFD23F", skin: (i + 2) % 6, hair: (i * 2) % 5 }, slot[i].x, slot[i].y + FOOT, W));
  var n9 = c.nb("9", 980, 150, "gold"), n10 = c.nb("10", 980, 150, "gold");
  var n8 = c.nb("8", 325, 150, "");
  var lm = c.lbl("− 1", 980, 722, "pink");
  var e1 = S.eq(c.eq[0], [["8", "e"], ["+", "op"], ["9", "e"]]);
  var e2 = S.eq(c.eq[1], [["8", "e"], ["+", "op"], ["10", "e"], ["=", "op"], ["18", "res"]]);
  var e3 = S.eq(c.eq[2], [["18", "e"], ["−", "op"], ["1", "e"], ["=", "op"], ["17", "res"]]);
  var e4 = S.eq(c.eq[3], [["17", "e"], ["−", "op"], ["9", "e"], ["=", "op"], ["8", "res"]]);
  S.hide(tl, red.concat([fr.el, n9, n10, n8, lm], e1, e2, e3, e4));
  tl.set(blue[9], { opacity: 0, scale: 1, x: 760 }, 0);
  blue.slice(0, 9).forEach(function (b) { tl.set(b, { opacity: 0, scale: 0.2 }, 0); });
  // --- phrase 0 : 8 + 9 : presque une equipe de 10 (il manque une place)
  red.forEach(function (t, i) { S.pop(tl, t, T(0, 0) + i * 0.05, 0.3); });
  S.pop(tl, n8, T(0, 0.1)); S.pop(tl, e1, T(0, 0.15), 0.3);
  S.pop(tl, fr.el, T(0, 0.3), 0.3);
  blue.slice(0, 9).forEach(function (b, i) { S.pop(tl, b, T(0, 0.4) + i * 0.06, 0.28); });
  S.pop(tl, n9, T(0, 0.8), 0.4, "back.out(3)");
  // --- phrase 1 : le 10e arrive : 8 + 10 = 18
  S.unpop(tl, e1, T(1, 0));
  S.pop(tl, e2.slice(0, 3), T(1, 0.06), 0.3);
  S.unpop(tl, n9, T(1, 0.1), 0.18);
  tl.set(blue[9], { opacity: 1 }, T(1, 0.1));
  tl.to(blue[9], { x: 0, duration: 0.5, ease: "power2.out" }, T(1, 0.1));
  S.hop(tl, blue[9], T(1, 0.1), 0.5, 2, 20);
  S.pop(tl, n10, T(1, 0.3), 0.35, "back.out(3)");
  S.pop(tl, e2.slice(3), T(1, 0.55));
  c.ring(slot[9].x, slot[9].y, T(1, 0.55));
  // --- phrase 2 : un joueur sort : moins un, 17
  S.unpop(tl, e2, T(2, 0));
  S.pop(tl, e3.slice(0, 3), T(2, 0.1), 0.3);
  S.pop(tl, lm, T(2, 0.2), 0.3);
  tl.to(blue[9], { x: 760, duration: 0.6, ease: "power2.in" }, T(2, 0.25));
  S.unpop(tl, n10, T(2, 0.4), 0.18);
  S.pop(tl, n9, T(2, 0.55), 0.35, "back.out(3)");
  S.pop(tl, e3.slice(3), T(2, 0.62));
  c.ring(980, 500, T(2, 0.65));
  // --- phrase 3 : 17 - 9 = 8
  S.unpop(tl, [].concat(e3, [lm]), T(3, 0));
  S.pop(tl, e4.slice(0, 3), T(3, 0.06), 0.3);
  blue.slice(0, 9).forEach(function (b, i) { tl.to(b, { x: 760, duration: 0.45, ease: "power2.in" }, T(3, 0.15) + i * 0.04); });
  S.unpop(tl, n9, T(3, 0.3), 0.25); S.unpop(tl, fr.el, T(3, 0.55), 0.25);
  S.pop(tl, e4.slice(3), T(3, 0.7));
  tl.to(n8, { scale: 1.25, duration: 0.15, ease: "power2.out" }, T(3, 0.7)); tl.to(n8, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T(3, 0.85));
  c.cheer(T(3, 0.72));
}
