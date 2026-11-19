/* 지구본 순수 함수(Task 8) — 위도경도 → 구 위의 점 · 앞면 판정 · 조명 안의 도시 · 도시 차례 · 경도 감기.
   좌표 약속은 계획 Task 6 Interfaces 그대로: 반지름 1, 경도 0 = +Z, 동경 90 = +X, 북극 = +Y(three.js 오른손 좌표).
   SVG 지구본(d3 정사영, 가운데 = rotation {lat, lon})과 three.js 길이 같은 함수를 쓴다 — 앞면 판정은 d3 clipAngle(90) 과 같은 답(tests/globe-screen.cjs).
   DOM 을 만지지 않는다. node 로도 돈다(tests/globe-math.cjs). */
(function (root) {
  'use strict';
  var RAD = Math.PI / 180;

  function latLonToVec3(lat, lon, r) {
    if (r == null) r = 1;
    var p = lat * RAD, l = lon * RAD, c = Math.cos(p);
    return [r * c * Math.sin(l), r * Math.sin(p), r * c * Math.cos(l)];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  /* 앞면 — 점이 카메라 쪽 반구에 있나(cameraDir = 구 가운데에서 카메라로 가는 방향) */
  function facing(vec, cameraDir) { return dot(vec, cameraDir) > 0; }
  /* 화면 가운데에 오는 점의 방향 — rotation = { lat, lon }(지구본이 그 점을 정면으로 보고 있다) */
  function viewDir(rotation) { return latLonToVec3(rotation.lat, rotation.lon); }
  /* 조명 안의 도시 = 화면 가운데에 가장 가까운 도시(각거리). 늘 앞면 */
  function nearestCity(cities, rotation) {
    var v = viewDir(rotation), best = null, bd = -2;
    (cities || []).forEach(function (c) { var d = dot(latLonToVec3(c.lat, c.lon), v); if (d > bd) { bd = d; best = c.key; } });
    return best;
  }
  /* 경도를 (-180, 180] 로 — 날짜변경선을 넘어 끌어도 값이 커지지 않는다 */
  function wrapLon(lon) { var x = ((lon + 180) % 360 + 360) % 360 - 180; return x === -180 ? 180 : x; }
  /* a → b 가장 짧은 경도 차(날짜변경선 건너는 쪽이 짧으면 그쪽) — 돌려 맞출 때 지구를 거꾸로 한 바퀴 돌지 않게 */
  function lonDelta(a, b) { return wrapLon(b - a); }
  /* 앞 · 뒤 도시 — 서에서 동(경도) 차례로 돈다 */
  function order(cities) { return (cities || []).slice().sort(function (a, b) { return a.lon - b.lon; }).map(function (c) { return c.key; }); }
  function step(cities, key, d) { var o = order(cities), i = o.indexOf(key); return o[((i < 0 ? 0 : i) + d + o.length) % o.length]; }

  var API = { latLonToVec3: latLonToVec3, facing: facing, viewDir: viewDir, nearestCity: nearestCity, wrapLon: wrapLon, lonDelta: lonDelta, order: order, step: step };
  if (typeof module === 'object' && module.exports) module.exports = API; else root.GlobeMath = API;
})(this);
