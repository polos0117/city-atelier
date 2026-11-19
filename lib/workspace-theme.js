/* 공간 — html[data-world][data-tone][data-density][data-motion] 를 그리기 전에 붙인다(색 변수는 lib/room.css, 뼈대는 DESIGN.md).
   세계(공간)는 저절로: 주소 ?w=(공방) · ?world=(생성기)가 먼저, 없으면 이 기기의 마지막 세계(city_world_v1), 없으면 판타지.
   밝기(객석 불)는 도구 상자 설정: dark 끔(기본) · light 켬 — 이 기기에 기억(city_room_v1).
   움직임: 기기의 움직임 줄이기 또는 도구 상자 「끄기」(city_motion_v1 — lib/walk-core.js 의 motionOn 과 같은 판단)면 data-motion="off", 효과 CSS 는 "on" 에서만 돈다. */
(function () {
  'use strict';
  var root = document.documentElement;
  var WORLDS = ['fantasy', 'steampunk', 'cyberpunk'], TONES = ['dark', 'light'], MOTION = 'city_motion_v1';
  var keys = { world: 'city_world_v1', tone: 'city_room_v1', density: 'atelier_density_v1' };
  /* 주소창 색 = 그 공간의 --bg(lib/room.css 와 같이) */
  var BG = { 'fantasy-dark': '#1c0810', 'fantasy-light': '#f9f0e1', 'steampunk-dark': '#131211', 'steampunk-light': '#e9e4dc', 'cyberpunk-dark': '#07061a', 'cyberpunk-light': '#eef0f7' };
  var viewportFrame = 0;
  function fitVisibleViewport() {
    if (viewportFrame) cancelAnimationFrame(viewportFrame);
    viewportFrame = requestAnimationFrame(function () {
      viewportFrame = 0;
      var viewport = window.visualViewport;
      var height = viewport && viewport.height ? viewport.height : window.innerHeight;
      if (height) root.style.setProperty('--atelier-vh', Math.round(height * 100) / 100 + 'px');
    });
  }
  function normalize(key, value) {
    return key === 'world' ? (WORLDS.indexOf(value) >= 0 ? value : WORLDS[0])
      : key === 'tone' ? (value === 'light' ? 'light' : 'dark')
      : (value === 'relaxed' ? value : 'compact');
  }
  function apply(key, value) {
    root.dataset[key] = normalize(key, value);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && root.dataset.world && root.dataset.tone) meta.content = BG[root.dataset.world + '-' + root.dataset.tone];
  }
  function store(key) { try { localStorage.setItem(keys[key], root.dataset[key]); } catch (e) {} }
  function read(key) {
    var value;
    try { value = localStorage.getItem(keys[key]); } catch (e) {}
    apply(key, value);
  }
  function motion() {
    var off = false;
    try { off = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    try { off = off || localStorage.getItem(MOTION) === 'off'; } catch (e) {}
    root.dataset.motion = off ? 'off' : 'on';
  }
  Object.keys(keys).forEach(read);
  var q = new URLSearchParams(location.search), urlWorld = q.get('w') || q.get('world');
  if (WORLDS.indexOf(urlWorld) >= 0) { apply('world', urlWorld); store('world'); }
  motion();
  /* 제목 글꼴 하나(간판 글씨) — 화면 그리기를 막지 않는다(display=swap) */
  (function () {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (!head || document.getElementById('display-font')) return;
    var link = document.createElement('link'); link.rel = 'stylesheet'; link.id = 'display-font';
    link.href = 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap'; head.appendChild(link);
  })();
  fitVisibleViewport();
  window.addEventListener('resize', fitVisibleViewport, { passive: true });
  window.addEventListener('orientationchange', fitVisibleViewport, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fitVisibleViewport, { passive: true });
    window.visualViewport.addEventListener('scroll', fitVisibleViewport, { passive: true });
  }
  window.addEventListener('city-motion', motion);
  try { matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', motion); } catch (e) {}
  window.AtelierAppearance = {
    worlds: Object.freeze(WORLDS.slice()), tones: Object.freeze(TONES.slice()),
    /* theme 은 lib/img.js 의 진열(세계마다 따로)이 읽는다 */
    get: function () { return { world: root.dataset.world, tone: root.dataset.tone, density: root.dataset.density, theme: root.dataset.world }; },
    set: function (key, value) {
      if (!keys[key]) return;
      apply(key, value); store(key);
      window.dispatchEvent(new Event('atelier-appearance'));
    }
  };
  window.addEventListener('storage', function (event) {
    ['tone', 'density'].forEach(function (key) {   /* 세계는 탭마다 제 주소를 따른다 — 다른 탭이 바꿔도 따라가지 않는다 */
      if (event.key === keys[key] || event.key === null) read(key);
    });
    if (event.key === MOTION || event.key === null) motion();
    window.dispatchEvent(new Event('atelier-appearance'));
  });
})();
