/* 주소 순수 함수(lib/walk-core.js) — 읽기/쓰기 · 층 · 부모/조상 · 기억값 · 검증. 설계표 없이 작은 가짜 표로 돈다(진짜 표는 Task 2).
   Run: node tests/walk-core.cjs */
const assert = require('node:assert/strict');
const R = require('../lib/walk-core.js');
const doc = { d: { vocab: { worlds: ['fantasy', 'steampunk', 'cyberpunk'] }, cities: [{ key: 'seoul' }, { key: 'tokyo' }] }, s: { default: 'a', styles: { a: {}, b: {} } } };
const r = s => R.readRoute(s);
// 읽고 쓰기 — 차례 고정, 빈 값 뺌, 모르는 열쇠 버림
assert.equal(R.routeSearch(r('?w=cyberpunk&zz=1&city=seoul&card=seoul&tab=dex')), '?tab=dex&city=seoul&card=seoul&w=cyberpunk');
assert.equal(R.routeSearch(R.EMPTY), '');
// 층
assert.equal(R.layerOf(r('')), 'globe'); assert.equal(R.layerOf(r('?tab=dex')), 'dex');
assert.equal(R.layerOf(r('?city=seoul')), 'city'); assert.equal(R.layerOf(r('?city=seoul&card=seoul&pic=a.webp')), 'card');
// 부모 · 조상 — 전역 값은 따라간다
assert.equal(R.routeSearch(R.parentOf(r('?city=seoul&card=seoul&pic=a.webp&w=fantasy'))), '?city=seoul&w=fantasy');
assert.equal(R.routeSearch(R.parentOf(r('?tab=dex&city=seoul&w=fantasy&view=casual'))), '?tab=dex&w=fantasy&view=casual');
assert.equal(R.parentOf(r('')), null);
assert.deepEqual(R.ancestors(r('?city=seoul&card=seoul')).map(R.layerOf), ['globe', 'city', 'card']);
// 기억값 채우기
assert.equal(R.resolve(r(''), { tab: 'dex' }).tab, 'dex'); assert.equal(R.resolve(r('?w=cyberpunk'), { w: 'fantasy' }).w, 'cyberpunk');
// 검증 — 낡은 열쇠는 가장 가까운 맞는 층으로
const v = s => R.routeSearch(R.validate(r(s), doc));
assert.equal(v('?city=zz&card=zz&w=steampunk'), '?w=steampunk');
assert.equal(v('?city=seoul&card=nope&pic=x.webp'), '?city=seoul');
assert.equal(v('?tab=weird&w=moon&st=nope&view=odd'), '');
assert.equal(v('?tab=dex&city=tokyo&card=tokyo&pic=tokyo_fantasy_b_f.webp&w=fantasy&st=b'), '?tab=dex&city=tokyo&card=tokyo&pic=tokyo_fantasy_b_f.webp&w=fantasy&st=b');
assert.equal(v('?city=tokyo&card=tokyo&pic=seoul_fantasy_b_f.webp'), '?city=tokyo&card=tokyo', '다른 도시 그림은 비운다');
assert.equal(v('?w=all'), '', '원소 잔재 w=all 은 받지 않는다');
assert.equal(R.worldOf(r('?w=cyberpunk'), doc.d.vocab.worlds), 'cyberpunk'); assert.equal(R.worldOf(r('?w=mecha'), doc.d.vocab.worlds), 'fantasy');
assert.equal(R.motionOn(), true);
console.log('PASS walk-core: 주소 읽기/쓰기 · 층 · 부모/조상 · 기억값 · 검증 · 세계');
