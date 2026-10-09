// Zone 2 : +2 = deux passes (6 -> 7 -> 8), puis retour (8 - 2 = 6).
// Phrases : 0 "Plus deux : deux passes !" 1 "Une passe : sept. Encore une : huit !" 2 "Et huit moins deux, six."
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var xs = [280, 680, 1080];
  function disc(n, x) {
    return c.put('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#0a1030" stroke-width="10"/><text x="100" y="138" text-anchor="middle" font-family="Anton" font-size="112" fill="#0a1030">' + n + '</text></svg>', x, 690, 230, "it");
  }
  var d = [disc(6, xs[0]), disc(7, xs[1]), disc(8, xs[2])];
  var p = xs.map(function (x, i) { return c.tok({ c: S.RED, c2: "#fff", skin: [1, 3, 0][i], hair: [0, 3, 2][i] }, x, 590, 230); });
  var ball = c.ball(xs[0] + 150, 560, 130);
  var plus2 = c.lbl("+ 2", 1180, 130, "gold");
  var up1 = c.lbl("+ 1", 480, 200, "gold"), up2 = c.lbl("+ 1", 880, 200, "gold");
  var dn1 = c.lbl("− 1", 880, 200, "pink"), dn2 = c.lbl("− 1", 480, 200, "pink");
  var e1 = S.eq(c.eq[0], [["6", "e"], ["+", "op"], ["2", "e"], ["=", "op"], ["8", "res"]]);
  var e2 = S.eq(c.eq[1], [["8", "e"], ["−", "op"], ["2", "e"], ["=", "op"], ["6", "res"]]);
  S.hide(tl, [d[0], p[0], ball, plus2, up1, up2, dn1, dn2].concat(e1, e2));
  tl.set([d[1], d[2], p[1], p[2]], { opacity: 0, scale: 0.2 }, 0);
  // --- phrase 0 : 6, +2
  S.pop(tl, d[0], T(0, 0)); S.pop(tl, p[0], T(0, 0.08));
  S.pop(tl, e1.slice(0, 3), T(0, 0.15), 0.3);
  S.pop(tl, plus2, T(0, 0.3)); S.pop(tl, ball, T(0, 0.5));
  tl.to([d[1], d[2]], { opacity: 0.35, scale: 1, duration: 0.35, ease: "back.out(2)" }, T(0, 0.62));
  // --- phrase 1 : deux passes
  var a1 = T(1, 0.02), a2 = T(1, 0.52), L = 0.55;
  S.arc(tl, ball, 0, 0, 400, 0, a1, L, 190);
  tl.to(ball, { rotation: 360, duration: L, ease: "none" }, a1);
  S.pop(tl, up1, a1 + 0.15, 0.3);
  tl.to(d[1], { opacity: 1, duration: 0.15 }, a1 + L);
  S.pop(tl, p[1], a1 + L - 0.05, 0.3);
  S.arc(tl, ball, 400, 0, 800, 0, a2, L, 190);
  tl.to(ball, { rotation: 720, duration: L, ease: "none" }, a2);
  S.pop(tl, up2, a2 + 0.15, 0.3);
  tl.to(d[2], { opacity: 1, duration: 0.15 }, a2 + L);
  S.pop(tl, p[2], a2 + L - 0.05, 0.3);
  S.pop(tl, e1.slice(3), T(1, 0.8));
  c.ring(xs[2], 690, T(1, 0.8));
  // --- phrase 2 : retour, 8 - 2 = 6
  S.unpop(tl, [].concat(e1, [up1, up2, plus2]), T(2, 0));
  S.pop(tl, e2.slice(0, 3), T(2, 0.08), 0.3);
  var b1 = T(2, 0.2), b2 = T(2, 0.58);
  S.arc(tl, ball, 800, 0, 400, 0, b1, 0.42, 160); S.pop(tl, dn1, b1 + 0.1, 0.25);
  S.arc(tl, ball, 400, 0, 0, 0, b2, 0.42, 160); S.pop(tl, dn2, b2 + 0.1, 0.25);
  tl.to([d[2], p[2]], { opacity: 0.3, duration: 0.2 }, b1 + 0.1);
  tl.to([d[1], p[1]], { opacity: 0.3, duration: 0.2 }, b2 + 0.1);
  S.pop(tl, e2.slice(3), T(2, 0.66));
  c.ring(xs[0], 690, T(2, 0.7));
  c.cheer(T(2, 0.72));
}
