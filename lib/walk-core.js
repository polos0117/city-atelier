/* 주소의 순수 함수 — 주소 쿼리가 층을 정한다. 지구본(globe) · 도감(dex) 탭 → 도시 → 한 장.
   원소 공방 lib/walk-core.js 의 주소 · 층 꼴(readRoute · routeSearch · layerOf · parentOf · ancestors · resolve · validate)을 도시 층으로 옮겼다(2026-11-19 Task 1).
   DOM · 저장소를 만지지 않는다(움직임 판단 motionOn · setMotion 만 예외 — 기기 기억 city_motion_v1). node 로도 돈다(tests/walk-core.cjs).
   주소 약속은 Task 7 이 DESIGN.md 에 확정한다: ?tab=globe|dex &w=<세계> &city=<열쇠> &card= &pic= &st= &view= */
(function (root) {
  'use strict';

  var KEYS = ['tab', 'city', 'card', 'pic', 'w', 'st', 'view'];   /* 주소에 쓰는 차례도 이대로 */
  var GLOBALS = ['tab', 'w', 'st', 'view'];                        /* 뒤로 가기에도 지금 값이 남는 것(「세계는 하나의 상태」) */
  var TABS = ['globe', 'dex'], VIEWS = ['world', 'casual', 'all'];

  function blank() { var r = {}; KEYS.forEach(function (k) { r[k] = ''; }); return r; }
  var EMPTY = Object.freeze(blank());
  function copy(route, patch) { var r = blank(); KEYS.forEach(function (k) { r[k] = String((route && route[k]) || ''); }); if (patch) for (var k in patch) if (KEYS.indexOf(k) >= 0) r[k] = String(patch[k] || ''); return r; }

  function readRoute(search) {
    var q = new URLSearchParams(search || ''), r = blank();
    KEYS.forEach(function (k) { r[k] = q.get(k) || ''; });
    return r;
  }
  function routeSearch(route) {
    var parts = [];
    KEYS.forEach(function (k) { if (route[k]) parts.push(k + '=' + encodeURIComponent(route[k])); });
    return parts.length ? '?' + parts.join('&') : '';
  }
  /* 층: globe(첫 화면) · dex(전체 도감) · city(한 도시) · card(한 장) */
  function layerOf(r) {
    if (r.card) return 'card';
    if (r.city) return 'city';
    return r.tab === 'dex' ? 'dex' : 'globe';
  }
  function parentOf(r) {
    switch (layerOf(r)) {
      case 'card': return copy(r, { card: '', pic: '' });
      case 'city': return copy({ tab: r.tab, w: r.w, st: r.st, view: r.view });
      default: return null;
    }
  }
  function ancestors(r) { var out = [], x = copy(r); while (x) { out.unshift(x); x = parentOf(x); } return out; }
  /* 빈 전역 값만 기억값으로. 맞는 값인지는 validate 가 본다 */
  function resolve(r, pref) {
    var out = copy(r); pref = pref || {};
    GLOBALS.forEach(function (k) { if (!out[k] && pref[k]) out[k] = String(pref[k]); });
    return out;
  }
  /* 낡은 열쇠 — 빈 화면 없이 가장 가까운 맞는 층으로. doc = { d: 설계표(cities · vocab.worlds), s: 화풍 판 } */
  function validate(r, doc) {
    var out = copy(r), d = doc.d, cities = d.cities || [];
    if (!cities.some(function (c) { return c.key === out.city; })) out.city = out.card = out.pic = '';
    else if (out.card && out.card !== out.city) out.card = '';
    if (!out.card) out.pic = '';
    if (TABS.indexOf(out.tab) < 0) out.tab = '';
    if (d.vocab.worlds.indexOf(out.w) < 0 && out.w !== 'all') out.w = '';
    if (!(doc.s && doc.s.styles && Object.prototype.hasOwnProperty.call(doc.s.styles, out.st))) out.st = '';
    if (VIEWS.indexOf(out.view) < 0) out.view = '';
    return out;
  }
  function worldOf(r, worlds) { return worlds.indexOf(r.w) >= 0 ? r.w : worlds[0]; }
  /* 움직임 판단은 여기 한 곳 — 기기의 움직임 줄이기가 아니고, 이 기기에서 끄지 않았으면 켜짐. 끄고 켜기는 도구 상자 설정(lib/toolbox.js) */
  var MOTION = 'city_motion_v1';
  function motionOn() {
    try { if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return false; } catch (e) {}
    try { return root.localStorage.getItem(MOTION) !== 'off'; } catch (e) { return true; }
  }
  function setMotion(on) {
    try { if (on) root.localStorage.removeItem(MOTION); else root.localStorage.setItem(MOTION, 'off'); } catch (e) {}
    try { root.dispatchEvent(new Event('city-motion')); } catch (e) {}
  }

  var API = { KEYS: KEYS, GLOBALS: GLOBALS, TABS: TABS, EMPTY: EMPTY, readRoute: readRoute, routeSearch: routeSearch, layerOf: layerOf, parentOf: parentOf,
    ancestors: ancestors, resolve: resolve, validate: validate, worldOf: worldOf, motionOn: motionOn, setMotion: setMotion };
  if (typeof module === 'object' && module.exports) module.exports = API; else root.AtelierWalk = API;
})(this);
