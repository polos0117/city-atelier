/* 지구본 순수 함수(lib/globe-math.js) — 좌표 약속(경도 0 = +Z, 북극 +Y) · 앞면 · 조명 안의 도시 · 날짜변경선 · 도시 차례.
   Run: node tests/globe-math.cjs */
const assert = require('node:assert/strict');
const G = require('../lib/globe-math.js');
const D = require('../data/city-design.json');
const near = (a, b, e = 1e-9) => a.every((v, i) => Math.abs(v - b[i]) < e);
const C = Object.fromEntries(D.cities.map(c => [c.key, c]));

assert(near(G.latLonToVec3(0, 0), [0, 0, 1]), '경도 0 = +Z');
assert(near(G.latLonToVec3(90, 0), [0, 1, 0]), '북극 = +Y');
assert(near(G.latLonToVec3(0, 90), [1, 0, 0]), '동경 90 = +X');
assert(near(G.latLonToVec3(0, 0, 2), [0, 0, 2]), '반지름');
// 서울과 리우는 서로 반대편 — 한쪽을 정면으로 보면 다른 쪽은 뒷면
const vs = G.latLonToVec3(C.seoul.lat, C.seoul.lon), vr = G.latLonToVec3(C.rio.lat, C.rio.lon);
assert(G.facing(vs, G.viewDir(C.seoul)) && !G.facing(vr, G.viewDir(C.seoul)), '서울 정면 → 리우 뒷면');
assert(G.facing(vr, G.viewDir(C.rio)) && !G.facing(vs, G.viewDir(C.rio)), '리우 정면 → 서울 뒷면');
// 날짜변경선 — 179.9 와 −179.9 는 거의 같은 점
const a = G.latLonToVec3(10, 179.9), b = G.latLonToVec3(10, -179.9), gap = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
assert(gap < 0.004, '날짜변경선 양쪽 거리 ' + gap);
assert.equal(G.wrapLon(181), -179); assert.equal(G.wrapLon(-181), 179); assert.equal(G.wrapLon(540), 180); assert.equal(G.wrapLon(-180), 180);
assert(Math.abs(G.lonDelta(170, -170) - 20) < 1e-9, '짧은 쪽 — 동으로 20°'); assert(Math.abs(G.lonDelta(-170, 170) + 20) < 1e-9, '서로 20°');
// 날짜변경선 위 가운데 — 조명 안 도시가 변경선 양쪽에서 같다(튀지 않음)
assert.equal(G.nearestCity(D.cities, { lat: 30, lon: 179.99 }), G.nearestCity(D.cities, { lat: 30, lon: -179.99 }));
// 조명 안의 도시 — 도시 위에 서면 그 도시
for (const c of D.cities) assert.equal(G.nearestCity(D.cities, c), c.key, c.key + ' 위에서 그 도시');
assert.equal(G.nearestCity(D.cities, { lat: 36, lon: 131 }), 'seoul');
assert.equal(G.nearestCity([], { lat: 0, lon: 0 }), null);
// 앞 · 뒤 — 서에서 동으로, 끝에서 처음으로
assert.equal(G.step(D.cities, 'seoul', 1), 'tokyo'); assert.equal(G.step(D.cities, 'seoul', -1), 'beijing');
assert.equal(G.step(D.cities, 'tokyo', 1), 'newyork', '동쪽 끝 다음은 서쪽 끝'); assert.equal(G.step(D.cities, 'newyork', -1), 'tokyo');
assert.equal(G.order(D.cities).length, 10);
// 앞면 판정 = 각거리 < 90°(d3 clipAngle 90 의 규칙) — 무작위 점
let n = 0;
for (let i = 0; i < 2000; i++) {
  const p = [Math.random() * 180 - 90, Math.random() * 360 - 180], q = { lat: Math.random() * 140 - 70, lon: Math.random() * 360 - 180 };
  const R = Math.PI / 180, ang = Math.acos(Math.sin(p[0] * R) * Math.sin(q.lat * R) + Math.cos(p[0] * R) * Math.cos(q.lat * R) * Math.cos((p[1] - q.lon) * R));
  if (Math.abs(ang - Math.PI / 2) < 1e-6) continue;
  assert.equal(G.facing(G.latLonToVec3(p[0], p[1]), G.viewDir(q)), ang < Math.PI / 2); n++;
}
console.log('PASS globe-math: 좌표 약속 · 앞면(무작위 ' + n + ') · 서울/리우 반대편 · 날짜변경선 · 조명 안의 도시 · 앞뒤 차례');
