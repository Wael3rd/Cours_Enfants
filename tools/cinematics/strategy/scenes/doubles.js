// Zone 3 : doubles = deux equipes identiques en miroir (6 + 6 = 12), moitie (12 - 6 = 6).
// Phrases : 0 "Les doubles : deux équipes en miroir !" 1 "Six et six, douze !" 2 "La moitié de douze ? Six !"
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  var rows = [380, 690], lx = [130, 300, 470], rx = [890, 1060, 1230];
  var line = c.put('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 760" width="40" height="760"><line x1="20" y1="0" x2="20" y2="760" stroke="#fff" stroke-width="10" stroke-dasharray="26 20" stroke-linecap="round"/></svg>', 680, 400, 40, "it");
  line.style.height = "760px"; line.style.top = "20px";
  var L = [], R = [];
  rows.forEach(function (y, r) {
    lx.forEach(function (x, k) { L.push(c.tok({ c: S.RED, c2: "#fff", skin: (r + k) % 6, hair: (r * 2 + k) % 5 }, x, y, 150)); });
    rx.forEach(function (x, k) { R.push(c.tok({ c: S.BLUE, c2: "#FFD23F", skin: (r + k + 2) % 6, hair: (r + k * 2) % 5 }, x, y, 150)); });
  });
  var n12 = c.nb("12", 680, 400, "gold md"), n6 = c.nb("6", 680, 400, "gold");
  var e1 = S.eq(c.eq[0], [["6", "e"], ["+", "op"], ["6", "e"], ["=", "op"], ["12", "res"]]);
  var e2 = S.eq(c.eq[1], [["12", "e"], ["−", "op"], ["6", "e"], ["=", "op"], ["6", "res"]]);
  S.hide(tl, L.concat(R, [n12, n6], e1, e2));
  tl.set(line, { scaleY: 0 }, 0);
  // --- phrase 0 : deux equipes en miroir
  L.forEach(function (t, i) { S.pop(tl, t, T(0, 0) + i * 0.07, 0.3); });
  S.pop(tl, e1[0], T(0, 0.3), 0.3);
  tl.to(line, { scaleY: 1, duration: 0.4, ease: "power2.out" }, T(0, 0.38));
  R.forEach(function (t, i) { S.pop(tl, t, T(0, 0.55) + i * 0.07, 0.3); });
  S.pop(tl, [e1[1], e1[2]], T(0, 0.75), 0.3);
  // --- phrase 1 : six et six, douze
  S.pop(tl, [e1[3], e1[4]], T(1, 0.5));
  S.pop(tl, n12, T(1, 0.5), 0.4, "back.out(3)");
  L.concat(R).forEach(function (t, i) { S.hop(tl, t, T(1, 0.5) + (i % 6) * 0.02, 0.4, 1, 30); });
  c.ring(680, 400, T(1, 0.5));
  // --- phrase 2 : moitie
  S.unpop(tl, [].concat(e1, [n12]), T(2, 0));
  S.pop(tl, e2.slice(0, 3), T(2, 0.08), 0.3);
  R.forEach(function (t, i) { S.unpop(tl, t, T(2, 0.3) + i * 0.06, 0.25); });
  tl.to(line, { opacity: 0, duration: 0.3 }, T(2, 0.4));
  S.pop(tl, n6, T(2, 0.62)); S.pop(tl, e2.slice(3), T(2, 0.62));
  c.ring(680, 400, T(2, 0.64));
  c.cheer(T(2, 0.66));
}
