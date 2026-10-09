// Zone 6 : +10 = une equipe de 10 arrive ; 7 + 10 = 17 (le 7 reste, un 1 devant) ; 17 - 10 = 7.
// Phrases : 0 "Plus dix : une équipe entière arrive !" 1 "Sept plus dix, dix-sept." 2 "Le sept reste là. Un un arrive devant !" 3 "Dix-sept moins dix, sept."
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var fr = S.frame10(c.field, 980, 500, 130);
  var slot = fr.slots, W = 100, FOOT = 72;
  var red = [], blue = [];
  var pos = [[130, 470], [260, 470], [390, 470], [520, 470], [195, 710], [325, 710], [455, 710]];
  pos.forEach(function (p, i) { red.push(c.tok({ c: S.RED, c2: "#fff", skin: i % 6, hair: i % 5 }, p[0], p[1], 130)); });
  for (var i = 0; i < 10; i++) blue.push(c.tok({ c: S.BLUE, c2: "#FFD23F", skin: (i + 2) % 6, hair: (i * 2) % 5 }, slot[i].x, slot[i].y + FOOT, W));
  var n10 = c.nb("10", 980, 150, "gold");
  var n7 = c.nb("7", 380, 150, ""), n1 = c.nb("1", 250, 150, "gold");
  var e1 = S.eq(c.eq[0], [["7", "e"], ["+", "op"], ["10", "e"], ["=", "op"], ["17", "res"]]);
  var e3 = S.eq(c.eq[2], [["17", "e"], ["−", "op"], ["10", "e"], ["=", "op"], ["7", "res"]]);
  S.hide(tl, red.concat([fr.el, n10, n7, n1], e1, e3));
  blue.forEach(function (b) { tl.set(b, { opacity: 0, scale: 1, x: 760 }, 0); });
  // --- phrase 0 : 7 joueurs la, une equipe de 10 arrive dans le cadre
  red.forEach(function (t, i) { S.pop(tl, t, T(0, 0) + i * 0.05, 0.3); });
  S.pop(tl, n7, T(0, 0.1)); S.pop(tl, e1.slice(0, 3), T(0, 0.15), 0.3);
  S.pop(tl, fr.el, T(0, 0.3), 0.3);
  blue.forEach(function (b, i) {
    var at = T(0, 0.35) + i * 0.1;
    tl.set(b, { opacity: 1 }, at);
    tl.to(b, { x: 0, duration: 0.5, ease: "power2.out" }, at);
    S.hop(tl, b, at, 0.5, 2, 20);
  });
  S.pop(tl, n10, T(0, 0.75), 0.4, "back.out(3)");
  // --- phrase 1 : 7 + 10 = 17
  S.pop(tl, e1.slice(3), T(1, 0.5));
  c.ring(980, 500, T(1, 0.5));
  // --- phrase 2 : le 7 reste, un 1 arrive devant
  tl.to(n7, { scale: 1.25, duration: 0.18, ease: "power2.out" }, T(2, 0.05)); tl.to(n7, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T(2, 0.23));
  tl.set(n1, { x: 730, y: 250, opacity: 1, scale: 1.4 }, T(2, 0.4));
  tl.to(n1, { x: 0, duration: 0.5, ease: "power2.out" }, T(2, 0.4));
  tl.to(n1, { y: 0, scale: 1, duration: 0.5, ease: "power3.inOut" }, T(2, 0.4));
  S.unpop(tl, n10, T(2, 0.4), 0.2);
  c.ring(315, 150, T(2, 0.9), "#7fe3ff");
  // --- phrase 3 : 17 - 10 = 7
  S.unpop(tl, e1, T(3, 0));
  S.pop(tl, e3.slice(0, 3), T(3, 0.06), 0.3);
  blue.forEach(function (b, i) { tl.to(b, { x: 760, duration: 0.5, ease: "power2.in" }, T(3, 0.15) + i * 0.05); });
  S.unpop(tl, n1, T(3, 0.3), 0.25); S.unpop(tl, fr.el, T(3, 0.55), 0.25);
  S.pop(tl, e3.slice(3), T(3, 0.7));
  tl.to(n7, { scale: 1.25, duration: 0.15, ease: "power2.out" }, T(3, 0.7)); tl.to(n7, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T(3, 0.85));
  c.cheer(T(3, 0.72));
}
