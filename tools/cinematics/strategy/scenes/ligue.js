// Zone 9 : calcul mental a 2 chiffres : paquets de 10 ballons (dizaines) + ballons seuls (unites). 35 + 24 = 59.
// Phrases : 0 "Trente-cinq plus vingt-quatre !" 1 "Les paquets de dix : trois plus deux, cinq." 2 "Les ballons seuls : cinq plus quatre, neuf." 3 "Cinquante-neuf !"
function scene(c) {
  var tl = c.tl, T = c.T, S = c.S;
  function pack() {
    var dots = "";
    for (var r = 0; r < 2; r++) for (var k = 0; k < 5; k++) dots += '<circle cx="' + (26 + k * 27) + '" cy="' + (36 + r * 28) + '" r="10" fill="#fff" stroke="#0a1030" stroke-width="3"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect x="4" y="4" width="152" height="152" rx="22" fill="#1b6bff" stroke="#fff" stroke-width="8"/>' + dots +
      '<text x="80" y="140" text-anchor="middle" font-family="Anton" font-size="56" fill="#ffd23f" stroke="#0a1030" stroke-width="4" paint-order="stroke">10</text></svg>';
  }
  var PW = 170, BW = 100;
  // groupe 35 a gauche (centre 300), groupe 24 a droite (centre 1060) : paquets en haut, ballons seuls en bas
  var xa = [110, 300, 490], xb = [965, 1155], xba = [90, 195, 300, 405, 510], xbb = [902, 1007, 1112, 1217];
  var pa = [], pb = [], ba = [], bb = [];
  xa.forEach(function (x) { pa.push(c.put(pack(), x, 380, PW, "it")); });
  xb.forEach(function (x) { pb.push(c.put(pack(), x, 380, PW, "it")); });
  xba.forEach(function (x) { ba.push(c.ball(x, 600, BW)); });
  xbb.forEach(function (x) { bb.push(c.ball(x, 600, BW)); });
  var n35 = c.nb("35", 300, 130, ""), n24 = c.nb("24", 1060, 130, ""), plus = c.nb("+", 680, 380, "gold");
  var n5p = c.nb("5", 680, 130, "gold"), n9b = c.nb("9", 680, 130, "gold");
  var e1 = S.eq(c.eq[0], [["35", "e"], ["+", "op"], ["24", "e"]]);
  var e2 = S.eq(c.eq[1], [["30", "e"], ["+", "op"], ["20", "e"], ["=", "op"], ["50", "res"]]);
  var e3 = S.eq(c.eq[2], [["5", "e"], ["+", "op"], ["4", "e"], ["=", "op"], ["9", "res"]]);
  var e4 = S.eq(c.eq[3], [["50", "e"], ["+", "op"], ["9", "e"], ["=", "op"], ["59", "res"]]);
  var all = [].concat(pa, pb, ba, bb);
  S.hide(tl, all.concat([n35, n24, plus, n5p, n9b], e1, e2, e3, e4));
  // --- phrase 0 : 35 + 24 : 3 paquets + 5 ballons, 2 paquets + 4 ballons
  pa.concat(ba).forEach(function (t, i) { S.pop(tl, t, T(0, 0.02) + i * 0.05, 0.3); });
  S.pop(tl, n35, T(0, 0.15), 0.35); S.pop(tl, e1.slice(0, 1), T(0, 0.15), 0.3);
  S.pop(tl, plus, T(0, 0.4), 0.3); S.pop(tl, e1[1], T(0, 0.4), 0.3);
  pb.concat(bb).forEach(function (t, i) { S.pop(tl, t, T(0, 0.45) + i * 0.05, 0.3); });
  S.pop(tl, n24, T(0, 0.6), 0.35); S.pop(tl, e1[2], T(0, 0.6), 0.3);
  // --- phrase 1 : les paquets de dix : 3 + 2 = 5 paquets
  S.unpop(tl, [].concat(e1, [plus, n35, n24]), T(1, 0));
  S.pop(tl, e2.slice(0, 3), T(1, 0.08), 0.3);
  tl.to(ba.concat(bb), { opacity: 0.3, duration: 0.25 }, T(1, 0.1));
  var all5 = pa.concat(pb);
  var px = xa.concat(xb), tx = [280, 480, 680, 880, 1080];
  all5.forEach(function (p, i) {
    tl.to(p, { x: tx[i] - px[i], y: 40, duration: 0.55, ease: "power2.inOut" }, T(1, 0.2) + i * 0.05);
  });
  S.pop(tl, n5p, T(1, 0.78), 0.35, "back.out(3)");
  S.pop(tl, [e2[3], e2[4]], T(1, 0.82), 0.3);
  c.ring(680, 420, T(1, 0.82));
  // --- phrase 2 : les ballons seuls : 5 + 4 = 9
  S.unpop(tl, [].concat(e2, [n5p]), T(2, 0));
  S.pop(tl, e3.slice(0, 3), T(2, 0.08), 0.3);
  tl.to(ba.concat(bb), { opacity: 1, duration: 0.2 }, T(2, 0.05));
  tl.to(all5, { opacity: 0.3, duration: 0.25 }, T(2, 0.05));
  var bxs = xba.concat(xbb);
  ba.concat(bb).forEach(function (b, i) {
    tl.to(b, { x: 680 + (i - 4) * 112 - bxs[i], y: 70, duration: 0.5, ease: "power2.inOut" }, T(2, 0.18) + i * 0.04);
  });
  S.pop(tl, n9b, T(2, 0.75), 0.35, "back.out(3)");
  S.pop(tl, [e3[3], e3[4]], T(2, 0.8), 0.3);
  c.ring(680, 670, T(2, 0.8), "#7fe3ff");
  // --- phrase 3 : cinquante-neuf !
  S.unpop(tl, [].concat(e3, [n9b]), T(3, 0));
  tl.to(all5, { opacity: 1, duration: 0.2 }, T(3, 0));
  S.pop(tl, e4.slice(0, 3), T(3, 0.05), 0.3);
  S.pop(tl, e4.slice(3), T(3, 0.4), 0.4, "back.out(3)");
  all5.forEach(function (t, i) { S.hop(tl, t, T(3, 0.4) + i * 0.02, 0.4, 1, 24, 40); });
  ba.concat(bb).forEach(function (t, i) { S.hop(tl, t, T(3, 0.4) + i * 0.02, 0.4, 1, 24, 70); });
  c.ring(680, 420, T(3, 0.42));
  c.cheer(T(3, 0.45));
}
