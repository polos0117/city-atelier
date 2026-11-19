/* 지구본(Task 8) — 회전 무대 위 지구본을 .th-slot 에 띄운다. DESIGN.md 5 · 6절.
   지금의 지구본 = SVG(d3-geo 정사영 + world-atlas 땅). 세계마다 결: 판타지 금 · 남빛 바다 / 스팀펑크 그을린 구리 · 톱니 테 / 사이버펑크 네온 선.
   Blender 모형(계획 Task 6 — 아직 없다)이 그림 저장소 models/globe/<세계>.glb 에 있고 WebGL 이 되면 three.js 캔버스로 바꿔 띄운다.
   없거나(404) · WebGL 이 없거나 · 늦거나 실패하면 SVG 그대로 — 빈 화면이 없다(Review Focus 1). 도시 점 · 이름표는 늘 SVG 가 위에 그린다(같은 정사영).
   좌표 · 앞면 · 조명 안의 도시는 lib/globe-math.js(window.GlobeMath). 뒷면 점은 보이지도 눌리지도 않는다(Review Focus 2).
   끌어 돌리면 조명 안(화면 가운데)에 가장 가까운 도시가 onFocus 로 바뀌고, 놓으면 그 도시가 가운데로 온다(움직임 끔이면 곧바로).
   점을 누르면 그 도시로 돌고, 이미 조명 안인 도시를 누르면 onPick. 세계 바꿈은 부르는 쪽이 이것을 지우고 새로 띄운다 — 늦게 온 응답은 버린다(Review Focus 3). */
const D3 = 'https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/+esm';
const TOPO = 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm';
const LAND = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json';
export const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';   /* index.html 의 importmap 'three' 와 같은 주소 */
const GLTF_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';
const NS = 'http://www.w3.org/2000/svg', RAD = Math.PI / 180, LAT_MAX = 70, TAP = 6;
let geo = null, uid = 0;

/* d3 · 땅 — 한 번만 받는다(실패하면 다음에 다시) */
function loadGeo() {
  return geo || (geo = Promise.all([import(D3), import(TOPO), fetch(LAND).then(r => { if (!r.ok) throw new Error('land ' + r.status); return r.json(); })])
    .then(([d3, topo, t]) => ({ d3, land: topo.feature(t, t.objects.land) }))
    .catch(e => { geo = null; throw e; }));
}
/* 모형 자리 — 그림 저장소(lib/img.js BASE 의 img/ 옆) models/globe/<세계>.glb */
export function modelURL(world) {
  const base = ((window.AtelierImg && window.AtelierImg.BASE) || '').replace(/img\/$/, '');
  return base + 'models/globe/' + world + '.glb';
}
function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}
function el(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs || {}) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}

/* slot: 지구본 자리(.th-slot). o = { cities:[{key,ko,lat,lon,hex,ready}], world, focus, onFocus(key), onPick(key) } → { focus(key), destroy() } */
export function mountGlobe(slot, o) {
  const GM = window.GlobeMath, id = 'gl' + (++uid), motion = () => document.documentElement.dataset.motion === 'on';
  const byKey = Object.fromEntries(o.cities.map(c => [c.key, c]));
  let alive = true, d3 = null, land = null, svg = null, parts = null, model = null, size = null, frame = 0, tween = 0;
  let focusKey = byKey[o.focus] ? o.focus : o.cities[0].key;
  const start = byKey[focusKey];
  const center = { lat: Math.max(-LAT_MAX, Math.min(LAT_MAX, start.lat)), lon: start.lon };
  slot.dataset.globe = 'wait';

  function setFocus(k) { if (k && k !== focusKey) { focusKey = k; o.onFocus && o.onFocus(k); } }
  function proj() {
    return d3.geoOrthographic().scale(size.r).translate([size.cx, size.cy]).rotate([-center.lon, -center.lat]).clipAngle(90);
  }

  /* 판 — 크기가 바뀌면 다시 짓는다(장식은 크기에 묶인다) */
  function layout() {
    const W = slot.clientWidth, H = slot.clientHeight;
    if (!W || !H) return false;
    const r = Math.max(60, Math.min(W / 2 - 30, (H - 64) / 2)), cx = W / 2, cy = Math.min(H - 56 - r, r + 22);
    size = { W, H, r, cx, cy };
    if (svg) svg.remove();
    svg = el('svg', { class: 'gl-svg', viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, 'aria-hidden': 'true' });
    const defs = el('defs', null, svg);
    defs.innerHTML = '<filter id="' + id + '-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<radialGradient id="' + id + '-shade" cx=".38" cy=".3" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>' +
      '<clipPath id="' + id + '-ball"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/></clipPath>';
    const w = o.world, back = el('g', { class: 'gl-deco' }, svg), ball = el('g', { class: 'gl-ball' }, svg), front = el('g', { class: 'gl-deco' }, svg);
    const glow = 'url(#' + id + '-glow)';
    if (w === 'steampunk') {   /* 톱니 테 + 놋쇠 기둥 */
      const n = 40, R1 = r + 7, R2 = r + 14; let d = '';
      for (let i = 0; i < n; i++) [0, .25, .5, .75].forEach((f, j) => { const a = (i + f) / n * 2 * Math.PI, R = j === 1 || j === 2 ? R2 : R1; d += (i || j ? 'L' : 'M') + (cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1); });
      el('rect', { class: 'gl-post', x: cx - 8, y: cy + r + 10, width: 16, height: Math.max(0, H - 40 - (cy + r + 10)) }, back);
      el('path', { class: 'gl-gear', d: d + 'Z' }, back);
    } else if (w === 'fantasy') {   /* 금 받침 */
      el('path', { class: 'gl-post', d: 'M' + (cx - 16) + ',' + (H - 40) + ' Q' + cx + ',' + (cy + r - 4) + ' ' + (cx + 16) + ',' + (H - 40) + 'Z' }, back);
    } else {   /* 빛 고리 받침 */
      el('ellipse', { class: 'gl-halo-base', cx, cy: H - 34, rx: r * .45, ry: 8, filter: glow }, back);
    }
    el('circle', { class: 'gl-sea', cx, cy, r }, ball);
    const grat = el('path', { class: 'gl-grat' }, ball), landP = el('path', { class: 'gl-land', filter: w === 'cyberpunk' ? glow : null }, ball);
    if (w !== 'cyberpunk') el('circle', { class: 'gl-shade', cx, cy, r, fill: 'url(#' + id + '-shade)' }, ball);
    else { const sc = el('g', { class: 'gl-scan', 'clip-path': 'url(#' + id + '-ball)' }, ball); for (let y = cy - r; y < cy + r; y += 6) el('line', { x1: cx - r, x2: cx + r, y1: y, y2: y }, sc); }
    el('circle', { class: 'gl-rim', cx, cy, r, filter: w === 'cyberpunk' ? glow : null }, ball);
    if (w === 'fantasy') {   /* 기운 금 고리 · 꼭대기 장식 */
      el('ellipse', { class: 'gl-ring', cx, cy, rx: r + 12, ry: r * .24, transform: 'rotate(-14 ' + cx + ' ' + cy + ')' }, front);
      el('path', { class: 'gl-finial', d: 'M' + cx + ',' + (cy - r - 22) + ' l6,12 l-6,7 l-6,-7z' }, front);
    } else if (w === 'cyberpunk') {
      el('ellipse', { class: 'gl-ring', cx, cy, rx: r + 14, ry: r * .2, transform: 'rotate(-12 ' + cx + ' ' + cy + ')', filter: glow }, front);
    }
    const pins = el('g', { class: 'gl-pins' }, svg), pinEls = {};
    for (const c of o.cities) {
      const g = el('g', { class: 'gl-pin' + (c.ready ? '' : ' is-pre'), 'data-city': c.key }, pins);
      el('circle', { class: 'gl-hit', r: 22 }, g);
      el('circle', { class: 'gl-halo', r: 11 }, g);
      el('circle', { class: 'gl-dot', r: 5, style: 'fill:' + c.hex }, g);
      const t = el('text', { class: 'gl-tag', 'text-anchor': 'middle', y: -16 }, g); t.textContent = c.ko;
      pinEls[c.key] = g;
    }
    parts = { grat, land: landP, pinEls };
    slot.insertBefore(svg, slot.firstChild);
    if (model) sizeModel();
    return true;
  }

  function draw() {
    frame = 0;
    if (!alive || !size || !d3) return;
    const p = proj(), path = d3.geoPath(p), view = GM.viewDir(center);
    parts.grat.setAttribute('d', path(d3.geoGraticule10()) || '');
    parts.land.setAttribute('d', path(land) || '');
    for (const c of o.cities) {
      const g = parts.pinEls[c.key], front = GM.facing(GM.latLonToVec3(c.lat, c.lon), view), xy = p([c.lon, c.lat]);
      g.setAttribute('transform', 'translate(' + xy[0].toFixed(1) + ',' + xy[1].toFixed(1) + ')');
      g.classList.toggle('is-back', !front);
      g.classList.toggle('is-on', c.key === focusKey);
      if (c.key === focusKey && g.nextSibling) g.parentNode.appendChild(g);   /* 조명 안 도시가 맨 위 — 이웃 점의 누르는 자리에 가리지 않게 */
      /* 이름표는 조명 안 도시와 가까운 앞면 도시만(멀면 가장자리에 몰려 겹친다) */
      const near = front && Math.acos(Math.max(-1, Math.min(1, GM.latLonToVec3(c.lat, c.lon).reduce((s, v, i) => s + v * view[i], 0)))) < 62 * RAD;
      g.classList.toggle('is-far', !near);
      /* 조명 안 도시는 점 위 가운데, 나머지는 바깥쪽 옆으로(가운데에 몰린 이름끼리 겹치지 않게) */
      const t = g.lastChild, on = c.key === focusKey, left = xy[0] < size.cx;
      t.setAttribute('x', on ? 0 : left ? -9 : 9); t.setAttribute('y', on ? -16 : 4); t.setAttribute('text-anchor', on ? 'middle' : left ? 'end' : 'start');
      g.dataset.front = front ? '1' : '0';
    }
    if (model) {
      model.globe.rotation.set(center.lat * RAD, -center.lon * RAD, 0, 'XYZ');
      model.renderer.render(model.scene, model.camera);
    }
  }
  const redraw = () => { if (!frame) frame = requestAnimationFrame(draw); };

  /* 도시를 가운데로 — 움직임 켬이면 0.45초 동안(경도는 짧은 쪽으로, 날짜변경선을 건너도 튀지 않는다), 끔이면 곧바로 */
  function goTo(key) {
    const c = byKey[key]; if (!c) return;
    cancelAnimationFrame(tween); tween = 0;
    const to = { lat: Math.max(-LAT_MAX, Math.min(LAT_MAX, c.lat)), lon: c.lon };
    if (!motion() || !d3) { center.lat = to.lat; center.lon = to.lon; if (d3) draw(); return; }
    const from = { lat: center.lat, lon: center.lon }, dl = GM.lonDelta(from.lon, to.lon), t0 = performance.now(), T = 450;
    const step = now => {
      if (!alive) return;
      const k = Math.min(1, (now - t0) / T), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      center.lat = from.lat + (to.lat - from.lat) * e; center.lon = GM.wrapLon(from.lon + dl * e);
      draw(); tween = k < 1 ? requestAnimationFrame(step) : 0;
    };
    tween = requestAnimationFrame(step);
  }

  /* 끌기 · 누르기 — 한 손가락(첫 포인터)만 */
  let drag = null;
  function down(e) {
    if (drag || !size || (e.button != null && e.button > 0)) return;
    cancelAnimationFrame(tween); tween = 0;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, lat: center.lat, lon: center.lon, moved: false, pin: e.target.closest && e.target.closest('.gl-pin') };
    try { slot.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < TAP) return;
    drag.moved = true;
    center.lon = GM.wrapLon(drag.lon - dx / size.r / RAD);
    center.lat = Math.max(-LAT_MAX, Math.min(LAT_MAX, drag.lat + dy / size.r / RAD));
    setFocus(GM.nearestCity(o.cities, center));
    redraw();
  }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.moved) { goTo(focusKey); return; }
    const k = d.pin && d.pin.dataset.city;
    if (!k || !byKey[k] || d.pin.classList.contains('is-back')) return;
    if (k === focusKey) { o.onPick && o.onPick(k); return; }
    setFocus(k); goTo(k);
  }
  function cancel(e) { if (drag && e.pointerId === drag.id) { drag = null; goTo(focusKey); } }

  /* three.js 길 — 모형이 있고 WebGL 이 될 때만. 무엇이든 실패하면 SVG 그대로 */
  function sizeModel() {
    const { W, H, r, cx, cy } = size, cam = model.camera;
    cam.left = -cx / r; cam.right = (W - cx) / r; cam.top = cy / r; cam.bottom = -(H - cy) / r; cam.updateProjectionMatrix();
    model.renderer.setSize(W, H, false);
  }
  async function tryModel() {
    const url = modelURL(o.world);
    let ok = false;
    try { ok = (await fetch(url, { method: 'HEAD' })).ok; } catch (e) {}
    if (!ok || !alive || !webgl()) return;
    let renderer = null;
    try {
      const THREE = await import(THREE_URL), { GLTFLoader } = await import(GLTF_URL);
      const gltf = await new GLTFLoader().loadAsync(url);
      if (!alive) return;
      const globe = gltf.scene.getObjectByName('Globe');
      if (!globe) throw new Error('glb: Globe');
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.domElement.className = 'gl-canvas';
      const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 100);
      camera.position.set(0, 0, 10);
      scene.add(gltf.scene, new THREE.AmbientLight(0xffffff, 1.2));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-2, 3, 5); scene.add(sun);
      model = { renderer, scene, camera, globe };
      slot.insertBefore(renderer.domElement, slot.firstChild);
      sizeModel(); slot.classList.add('is-model'); slot.dataset.globe = 'model'; draw();
    } catch (e) {
      model = null; slot.classList.remove('is-model'); if (alive) slot.dataset.globe = 'svg';
      if (renderer) { renderer.domElement.remove(); renderer.dispose(); }
    }
  }

  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (d3 && layout()) draw(); }) : null;
  loadGeo().then(g => {
    if (!alive) return;
    d3 = g.d3; land = g.land;
    if (!layout()) return;
    /* 손잡이는 자리(slot)에 — svg 는 크기가 바뀌면 새로 짓는다 */
    slot.addEventListener('pointerdown', down); slot.addEventListener('pointermove', move);
    slot.addEventListener('pointerup', up); slot.addEventListener('pointercancel', cancel);
    slot.classList.add('is-ready'); slot.dataset.globe = 'svg';
    draw(); if (ro) ro.observe(slot);
    tryModel();
  }).catch(() => { if (alive) slot.dataset.globe = 'none'; });   /* d3 · 땅을 못 받으면 CSS 공 그대로 — 전광판이 도시를 고른다 */

  return {
    focus(key) { if (alive && byKey[key] && key !== focusKey && !drag) { focusKey = key; goTo(key); } },
    destroy() {
      alive = false; cancelAnimationFrame(frame);
      slot.removeEventListener('pointerdown', down); slot.removeEventListener('pointermove', move); slot.removeEventListener('pointerup', up); slot.removeEventListener('pointercancel', cancel); cancelAnimationFrame(tween); if (ro) ro.disconnect();
      if (svg) svg.remove();
      if (model) { model.renderer.domElement.remove(); model.renderer.dispose(); model = null; }
      slot.classList.remove('is-ready', 'is-model'); delete slot.dataset.globe;
    }
  };
}
