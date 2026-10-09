// Zone 1 : +0 (rien ne change), +1 (un joueur entre), -1 (un joueur sort).
// Phrases : 0 "Plus zéro, rien ne change : sept." 1 "Plus un : un joueur entre !" 2 "Sept plus un, huit !" 3 "Un joueur sort : huit moins un, sept !"
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var spots = [[290, 380], [470, 380], [650, 380], [830, 380], [380, 620], [560, 620], [740, 620]];
  var team = [];
  spots.forEach(function (p, i) { team.push(c.tok({ c: S.RED, c2: "#fff", num: i + 2, skin: i % 6, hair: i % 5 }, p[0], p[1], 140)); });
  var sub = c.tok({ c: S.GOLD, c2: "#0a1030", num: 8, skin: 2, hair: 1 }, 920, 620, 140);
  var ghost = c.put('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><circle cx="80" cy="80" r="66" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="8" stroke-dasharray="16 14"/><text x="80" y="108" text-anchor="middle" font-family="Anton" font-size="84" fill="#fff">0</text></svg>', 1000, 620, 170, "it");
  var n7 = c.nb("7", 1180, 250, "gold"), n8 = c.nb("8", 1180, 250, "gold"), n7b = c.nb("7", 1180, 250, "gold");
  var l0 = c.lbl("+ 0", 1180, 730, ""), l1 = c.lbl("+ 1", 1180, 730, "gold"), lm = c.lbl("− 1", 1180, 730, "pink");
  var e1 = S.eq(c.eq[0], [["7", "e"], ["+", "op"], ["0", "e"], ["=", "op"], ["7", "res"]]);
  var e2 = S.eq(c.eq[1], [["7", "e"], ["+", "op"], ["1", "e"], ["=", "op"], ["8", "res"]]);
  var e3 = S.eq(c.eq[2], [["8", "e"], ["−", "op"], ["1", "e"], ["=", "op"], ["7", "res"]]);
  S.hide(tl, team.concat([ghost, n7, n8, n7b, l0, l1, lm], e1, e2, e3));
  tl.set(sub, { scale: 1, opacity: 0, x: 640 }, 0);
  // --- phrase 0 : 7 joueurs, +0, rien ne change
  team.forEach(function (t, i) { S.pop(tl, t, T(0, 0) + i * 0.07, 0.35); });
  S.pop(tl, n7, T(0, 0.12));
  S.pop(tl, [e1[0]], T(0, 0.1)); S.pop(tl, [e1[1], e1[2]], T(0, 0.28));
  S.pop(tl, l0, T(0, 0.28)); S.pop(tl, ghost, T(0, 0.3));
  tl.to(ghost, { x: -80, scale: 0.4, opacity: 0, duration: 0.5, ease: "power2.in" }, T(0, 0.58));
  S.pop(tl, [e1[3], e1[4]], T(0, 0.74));
  // --- phrase 1 : +1, un joueur entre
  S.unpop(tl, [].concat(e1, [l0]), T(1, 0));
  S.pop(tl, l1, T(1, 0.05)); S.pop(tl, [e2[0], e2[1], e2[2]], T(1, 0.1), 0.3);
  tl.set(sub, { opacity: 1 }, T(1, 0.1));
  tl.to(sub, { x: 0, duration: 1.0, ease: "power2.out" }, T(1, 0.1));
  S.hop(tl, sub, T(1, 0.1), 1.0, 4, 28);
  // --- phrase 2 : huit !
  S.pop(tl, [e2[3], e2[4]], T(2, 0.45));
  S.unpop(tl, n7, T(2, 0.42), 0.18);
  S.pop(tl, n8, T(2, 0.5), 0.4, "back.out(3)");
  tl.to(sub, { y: -40, duration: 0.18, ease: "power2.out" }, T(2, 0.5)); tl.to(sub, { y: 0, duration: 0.28, ease: "bounce.out" }, T(2, 0.68));
  // --- phrase 3 : un joueur sort, 8 - 1 = 7
  S.unpop(tl, [].concat(e2, [l1]), T(3, 0));
  S.pop(tl, lm, T(3, 0.05)); S.pop(tl, e3.slice(0, 3), T(3, 0.1), 0.3);
  tl.to(sub, { x: 640, duration: 0.9, ease: "power2.in" }, T(3, 0.14));
  S.hop(tl, sub, T(3, 0.14), 0.9, 4, 24);
  S.unpop(tl, n8, T(3, 0.72), 0.18);
  S.pop(tl, n7b, T(3, 0.78), 0.4, "back.out(3)");
  S.pop(tl, e3.slice(3), T(3, 0.78));
  c.cheer(T(3, 0.8));
}
