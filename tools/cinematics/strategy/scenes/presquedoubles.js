// Zone 5 : presque-double = double + un remplacant (6 + 7 = 6 + 6 + 1 = 13), 13 - 7 = 6.
// Phrases : 0 "Six plus sept ? Six plus six, douze." 1 "Un remplaçant arrive : plus un, treize !" 2 "Treize moins sept, six."
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
  var sub = c.tok({ c: S.GOLD, c2: "#0a1030", num: 7, skin: 3, hair: 3 }, 680, 770, 150);
  var plus1 = c.lbl("+ 1", 680, 510, "gold");
  var n12 = c.nb("12", 680, 330, "gold md"), n13 = c.nb("13", 680, 330, "gold md"), n6 = c.nb("6", 680, 330, "gold");
  var e1 = S.eq(c.eq[0], [["6", "e"], ["+", "op"], ["7", "e"]]);
  var e2 = S.eq(c.eq[1], [["6", "e"], ["+", "op"], ["6", "e"], ["=", "op"], ["12", "res"]]);
  var e3 = S.eq(c.eq[2], [["6", "e"], ["+", "op"], ["7", "e"], ["=", "op"], ["13", "res"]]);
  var e4 = S.eq(c.eq[3], [["13", "e"], ["−", "op"], ["7", "e"], ["=", "op"], ["6", "res"]]);
  S.hide(tl, L.concat(R, [plus1, n12, n13, n6], e1, e2, e3, e4));
  tl.set(sub, { opacity: 0, scale: 1, x: 700 }, 0);
  tl.set(line, { scaleY: 0 }, 0);
  // --- phrase 0 : 6 + 7 ? on commence par le double 6 + 6
  S.pop(tl, e1, T(0, 0.05), 0.3);
  L.forEach(function (t, i) { S.pop(tl, t, T(0, 0.35) + i * 0.06, 0.3); });
  tl.to(line, { scaleY: 1, duration: 0.35, ease: "power2.out" }, T(0, 0.5));
  R.forEach(function (t, i) { S.pop(tl, t, T(0, 0.62) + i * 0.06, 0.3); });
  S.unpop(tl, e1, T(0, 0.58));
  S.pop(tl, e2.slice(0, 3), T(0, 0.74), 0.3);
  S.pop(tl, [e2[3], e2[4], n12], T(0, 0.93), 0.35);
  // --- phrase 1 : un remplacant arrive
  S.unpop(tl, [].concat(e2, [n12]), T(1, 0));
  S.pop(tl, e3.slice(0, 3), T(1, 0.06), 0.3);
  tl.set(sub, { opacity: 1 }, T(1, 0.05));
  tl.to(sub, { x: 0, duration: 0.8, ease: "power2.out" }, T(1, 0.05));
  S.hop(tl, sub, T(1, 0.05), 0.8, 4, 24);
  S.pop(tl, plus1, T(1, 0.4), 0.3);
  S.pop(tl, [e3[3], e3[4], n13], T(1, 0.72), 0.35);
  c.ring(680, 650, T(1, 0.72));
  // --- phrase 2 : 13 - 7 = 6
  S.unpop(tl, [].concat(e3, [n13, plus1]), T(2, 0));
  S.pop(tl, e4.slice(0, 3), T(2, 0.06), 0.3);
  R.concat([sub]).forEach(function (t, i) { S.unpop(tl, t, T(2, 0.2) + i * 0.05, 0.25); });
  tl.to(line, { opacity: 0, duration: 0.3 }, T(2, 0.3));
  S.pop(tl, [e4[3], e4[4], n6], T(2, 0.65), 0.35);
  c.ring(300, 540, T(2, 0.68));
  c.cheer(T(2, 0.7));
}
