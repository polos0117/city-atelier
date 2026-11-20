/* 지구본 탭 · 도시 무대 · 한 장(Task 8 — DESIGN.md 5 · 6절, 계획 Task 8 Step 1 (a)~(f)) — 폴드 덮개 344×882 터치.
   (a) SVG 지구본이 곧바로(모형 glb 가 없으면 캔버스 없음), glb 가 있고 WebGL 이 되면 그 뒤 three.js 캔버스
   (b) 끌면 돌고 조명 안 도시가 바뀌며 전광판 이름이 따라감 · 앞 · 뒤 단추로 도시 차례 · 조명 안 서울 점을 누르면 ?city=seoul 도시 무대에 세 칸
   (c) 세계 바꿈 중 끌기 · 점 두 번 누르기 · 단추 연타에 오류 0, 엉뚱한 도시로 가지 않음(Review Focus 3)
   (d) WebGL 없음(--disable-webgl + getContext 막기) · glb 404 · CDN 막힘에도 지구본 자리가 비지 않고 전광판으로 도시를 고를 수 있음(Review Focus 1)
   (e) 뒷면 점은 보이지 않고 pointer-events:none · 앞면 판정 = GlobeMath = d3 geoDistance < 90° · 날짜변경선을 넘겨 끌어도 점이 튀지 않음(Review Focus 2)
   (f) 여섯 판(세계 × 밝기) 누르는 자리 44px · 가로 넘침 0 · 콘솔 오류 0 · 대비 4.5 · 장식 영어 대문자 없음
   더해서: 설계 전 도시는 흐린 점 · 「설계 전」 · 무대로 막힘(짧은 안내) · 도시 무대 글은 설계표 · 직업표에서 · 생성기 길 · 그림이 있으면 한 장 · 움직임 줄이기면 효과 없음.
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright> ESM_DIR=<preact 사본> node tests/globe-screen.cjs   (SHOT_DIR 이 있으면 사진) */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const H = require('./lib/harness.cjs'), GM = require('../lib/globe-math.js');
const D = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/city-design.json'), 'utf8')), OWN = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/casual-own.json'), 'utf8'));
const WORLDS = ['fantasy', 'steampunk', 'cyberpunk'], C = Object.fromEntries(D.cities.map(c => [c.key, c]));
const GLB = /models\/globe\/[a-z]+\.glb/;
const TEXT = '.th-sub, .th-name, .th-marquee p, .th-marquee-name, .th-mq-sub, .th-tab, .th-worlds button, .th-go, .th-mq-prev, .th-mq-next';
/* 아주 작은 glb — 노드 Globe · Stand 만(계획 Task 6 의 노드 약속) */
function glb() {
  const j = Buffer.from(JSON.stringify({ asset: { version: '2.0' }, scene: 0, scenes: [{ nodes: [0, 1] }], nodes: [{ name: 'Globe' }, { name: 'Stand' }] }));
  const jp = Buffer.concat([j, Buffer.alloc((4 - j.length % 4) % 4, 0x20)]), b = Buffer.alloc(20 + jp.length);
  b.writeUInt32LE(0x46546C67, 0); b.writeUInt32LE(2, 4); b.writeUInt32LE(b.length, 8); b.writeUInt32LE(jp.length, 12); b.writeUInt32LE(0x4E4F534A, 16); jp.copy(b, 20);
  return b;
}
const smallTargets = p => p.$$eval('button, a, select', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 44 || r.height < 44); }).map(e => e.outerHTML.slice(0, 90)));
const globeIs = (p, v, timeout = 8000) => p.waitForFunction(v => (document.querySelector('.th-slot') || {}).dataset && document.querySelector('.th-slot').dataset.globe === v, v, { timeout });
const marquee = p => p.evaluate(() => { const m = document.querySelector('.th-marquee'); return { city: m.dataset.city, name: m.querySelector('.th-marquee-name').textContent }; });
/* 점 — { key: { x, y, front, on, pe, vis } } (화면 좌표) */
const pins = p => p.evaluate(() => {
  const out = {}, svg = document.querySelector('.gl-svg'), box = svg.getBoundingClientRect();
  for (const g of svg.querySelectorAll('.gl-pin')) {
    const m = g.getAttribute('transform').match(/translate\(([-\d.]+),([-\d.]+)\)/), cs = getComputedStyle(g);
    out[g.dataset.city] = { x: box.left + +m[1], y: box.top + +m[2], front: g.dataset.front === '1', on: g.classList.contains('is-on'), pe: cs.pointerEvents, vis: cs.visibility, pre: g.classList.contains('is-pre') };
  }
  return out;
});
/* 끝나는 효과(이름 켜짐 · 세 조명)가 다 끝날 때까지 — 대비는 멈춘 화면에서 잰다 */
const calm = p => p.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect && a.effect.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
const ballCenter = p => p.evaluate(() => { const c = document.querySelector('.gl-sea').getBoundingClientRect(); return { x: c.left + c.width / 2, y: c.top + c.height / 2, r: c.width / 2 }; });
async function drag(p, dx, dy = 0, steps = 8) {
  const b = await ballCenter(p);
  await p.mouse.move(b.x, b.y); await p.mouse.down(); await p.mouse.move(b.x + dx, b.y + dy, { steps }); await p.mouse.up();
}
/* 전광판 도시가 조명 안(가운데)에 와서 멈출 때까지 */
const settle = p => p.waitForFunction(() => { const k = document.querySelector('.th-marquee').dataset.city, g = document.querySelector('.gl-pin.is-on'), s = document.querySelector('.gl-sea');
  if (!g || !s || g.dataset.city !== k) return false;
  const m = g.getAttribute('transform').match(/translate\(([-\d.]+),([-\d.]+)\)/); return Math.abs(+m[1] - +s.getAttribute('cx')) < 1 && Math.abs(+m[2] - +s.getAttribute('cy')) < 40; }, null, { timeout: 3000 });

(async () => {
  const srv = await H.serve(), br = await H.launch(), noGL = await H.launch(['--disable-webgl', '--disable-3d-apis']);
  let checks = 0;
  /* 등록부는 늘 빈 것으로(2026-11-20 — GPT 가 서울 사이버펑크를 올려 진짜 등록부가 차기 시작했다. 그림 있는 판은 칸마다 따로 fulfill) */
  const EMPTY_IMG = { url: /\/data\/img\.json/, body: JSON.stringify({ img: {}, added: {}, count: 0, where: {} }), contentType: 'application/json' };
  const open = (url, o = {}) => H.open(o.browser || br, srv.base, url, Object.assign({ touch: true }, o, { fulfill: (o.fulfill || []).concat(EMPTY_IMG) }));
  try {
    /* (f) 여섯 판 — 지구본 탭 */
    for (const w of WORLDS) for (const t of ['dark', 'light']) {
      const o = await open('/index.html?w=' + w), p = o.page, at = w + '-' + t;
      if (t === 'light') { await p.evaluate(() => localStorage.setItem('city_room_v1', 'light')); await p.reload(); }
      await globeIs(p, 'svg'); await p.evaluate(() => document.fonts.ready); await calm(p);
      assert.equal(await p.locator('.gl-canvas').count(), 0, at + ' glb 없음 → 캔버스 없음');
      assert.deepEqual(await smallTargets(p), [], at + ' 44px');
      assert(await H.noOverflow(p), at + ' 가로 넘침');
      assert.equal(await p.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1), true, at + ' 한 화면에(스크롤 없음)');
      for (const [txt, c] of await H.contrast(p, TEXT)) assert(c >= 4.5, at + ' 대비 ' + c + ' — ' + txt);
      assert(!/[A-Z]{3,}/.test(await p.evaluate(() => document.body.innerText)), at + ' 장식 영어 대문자');
      assert.deepEqual(await marquee(p), { city: 'seoul', name: C.seoul.ko }, at + ' 첫 도시 서울');
      await H.shot(p, 'globe-' + at);
      assert.deepEqual(o.errors, [], at + ' 콘솔'); checks += 9; await o.ctx.close();
    }

    /* (a) (b) (e) 판타지 어두운 — 끌기 · 앞뒤 · 앞면 · 날짜변경선 · 들어가기 */
    { const o = await open('/index.html?w=fantasy', { failURL: GLB }), p = o.page;
      const t0 = Date.now(); await globeIs(p, 'svg', 4000);
      assert(Date.now() - t0 < 4000, '(a) SVG 지구본이 곧바로');
      await p.waitForTimeout(300);
      assert.equal(await p.evaluate(() => document.querySelector('.th-slot').dataset.globe), 'svg', '(a) glb 404 → SVG 그대로');
      // (e) 앞면 판정 — GlobeMath · d3 geoDistance · 화면 표시가 같다
      const ps = await pins(p);
      assert.equal(await p.evaluate(() => document.querySelector('.gl-pin.is-on').dataset.city), 'seoul');
      const front = await p.evaluate(async cities => {
        const d3 = await import('https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/+esm'), c = cities.find(x => x.key === 'seoul'), ctr = [c.lon, Math.max(-70, Math.min(70, c.lat))];
        return Object.fromEntries(cities.map(x => [x.key, d3.geoDistance([x.lon, x.lat], ctr) < Math.PI / 2]));
      }, D.cities.map(c => ({ key: c.key, lat: c.lat, lon: c.lon })));
      for (const c of D.cities) {
        assert.equal(ps[c.key].front, front[c.key], c.key + ' 앞면 = d3');
        assert.equal(ps[c.key].front, GM.facing(GM.latLonToVec3(c.lat, c.lon), GM.viewDir(C.seoul)), c.key + ' 앞면 = GlobeMath');
        if (!ps[c.key].front) {
          assert.equal(ps[c.key].pe, 'none', c.key + ' 뒷면 pointer-events'); assert.equal(ps[c.key].vis, 'hidden', c.key + ' 뒷면 숨김');
          const hit = await p.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); const g = e && e.closest('.gl-pin'); return g ? g.dataset.city : ''; }, [ps[c.key].x, ps[c.key].y]);
          assert.notEqual(hit, c.key, c.key + ' 뒷면 점이 눌린다');
        }
        assert.equal(ps[c.key].pre, !Object.keys(c.worlds).length, c.key + ' 설계 전 흐린 점');
      }
      assert(!ps.rio.front && ps.tokyo.front, '서울 정면 — 리우 뒷면 · 도쿄 앞면'); checks += 4;
      // (b) 앞 · 뒤 단추 — 서에서 동으로
      await p.tap('.th-mq-next'); assert.deepEqual(await marquee(p), { city: 'tokyo', name: C.tokyo.ko }, '뒤 → 도쿄');
      await settle(p);
      assert.equal((await pins(p)).tokyo.on, true, '조명이 도쿄로');
      await p.tap('.th-mq-prev'); await p.tap('.th-mq-prev'); assert.equal((await marquee(p)).city, 'beijing', '앞 앞 → 베이징');
      await settle(p);
      // 설계 전 도시 — 「설계 전」 · 무대로 막힘(짧은 안내, 주소 그대로)
      assert.equal(await p.locator('.th-marquee .th-pre').count(), 1, '설계 전 표지');
      assert.equal(await p.getAttribute('.th-go', 'aria-disabled'), 'true');
      const before = await p.evaluate(() => location.search);
      await p.tap('.th-go', { force: true }); await p.waitForSelector('.th-go-note');
      assert.match(await p.textContent('.th-go-note'), new RegExp(C.beijing.ko));
      assert.equal(await p.evaluate(() => location.search), before, '설계 전 — 무대로 가지 않는다');
      await H.shot(p, 'globe-pre-beijing'); checks += 6;
      // (b) 끌어 돌리기 — 조명 안 도시가 바뀌고 전광판 이름이 따라감(놓으면 그 도시가 가운데로)
      const m0 = await marquee(p); const b = await ballCenter(p);
      await p.mouse.move(b.x, b.y); await p.mouse.down();
      const seen = new Set();
      for (let i = 1; i <= 30; i++) { await p.mouse.move(b.x - i * 8, b.y); const m = await marquee(p); seen.add(m.city); assert.equal(m.name, C[m.city].ko, '이름이 도시를 따라감'); }
      await p.mouse.up(); await settle(p);
      const m1 = await marquee(p);
      assert.notEqual(m1.city, m0.city, '끌면 조명 안 도시가 바뀐다'); assert(seen.size >= 2, '끄는 동안 이름이 바뀐다');
      assert.equal((await pins(p))[m1.city].on, true, '놓으면 그 도시가 조명 안(가운데)');
      checks += 3;
      // (e) 날짜변경선 — 도쿄에서 동쪽으로 끌어 180° 를 넘겨도 점이 튀지 않음
      while ((await marquee(p)).city !== 'tokyo') await p.tap('.th-mq-next');
      await settle(p);
      const c2 = await ballCenter(p); await p.mouse.move(c2.x, c2.y); await p.mouse.down();
      let last = await pins(p), maxJump = 0;
      for (let i = 1; i <= 26; i++) {
        await p.mouse.move(c2.x - i * 6, c2.y); await p.waitForTimeout(20);
        const now = await pins(p);
        for (const k in now) if (now[k].front && last[k].front) maxJump = Math.max(maxJump, Math.hypot(now[k].x - last[k].x, now[k].y - last[k].y));
        last = now;
      }
      await p.mouse.up(); await settle(p);
      assert(C.tokyo.lon + 26 * 6 / c2.r * 180 / Math.PI > 180, '끈 거리가 날짜변경선을 넘었다');
      assert(maxJump < 14, '날짜변경선 근처에서 점이 튄다 — ' + maxJump.toFixed(1) + 'px'); checks++;
      // (b) 조명 안 서울 점을 누르면 도시 무대
      while ((await marquee(p)).city !== 'seoul') await p.tap('.th-mq-prev');
      await settle(p);
      const sp = (await pins(p)).seoul, len = await p.evaluate(() => history.length);
      await p.mouse.click(sp.x, sp.y);
      await p.waitForSelector('.th-cast');
      assert.equal(await p.evaluate(() => location.search), '?city=seoul&w=fantasy', '서울 점 → 도시 무대');
      assert.equal(await p.evaluate(() => history.length), len + 1, '들어가기는 역사 한 칸');
      assert.equal(await p.locator('.th-role').count(), 3, '세 칸');
      // 도시 무대 글 — 설계표 · 직업표 그대로
      const s = C.seoul;
      assert.equal(await p.textContent('.th-city-title h2'), s.ko);
      assert.match(await p.textContent('.th-city-meta'), /북위 37\.56° · 동경 126\.99°/);
      assert.match(await p.textContent('.th-city-sym'), new RegExp(s.card_ko.symbols));
      for (const w of WORLDS) {
        const r = p.locator('.th-role[data-world="' + w + '"]'), txt = await r.textContent();
        for (const want of [s.worlds[w].card_ko.look, s.worlds[w].card_ko.motif, OWN.cards.seoul.worlds[w].job_ko]) assert(txt.includes(want), w + ' 칸에 ' + want);
        assert.equal(await r.locator('.th-fig.is-empty').count(), 1, w + ' 그림 없음 자리');
        assert.equal(await r.locator('.th-draw').getAttribute('href'), 'prompt.html?card=seoul&o=world&world=' + w, w + ' 생성기 길');
      }
      assert.equal(await p.evaluate(() => document.getAnimations().filter(a => a.animationName === 'th-light').length), 3, '세 조명 켜짐(움직임 켬)');
      await calm(p); assert.deepEqual(await smallTargets(p), [], '도시 무대 44px'); assert(await H.noOverflow(p), '도시 무대 넘침');
      for (const [txt, c] of await H.contrast(p, '.th-back, .th-crumb span, .th-city-title h2, .th-city-meta, .th-city-sym, .th-plaque span, .th-plaque b, .th-fig, .th-draw, .th-day')) assert(c >= 4.5, '도시 무대 대비 ' + c + ' — ' + txt);
      await p.tap('.th-back'); await globeIs(p, 'svg');
      assert.equal(await p.evaluate(() => location.search), '?w=fantasy', '← 지구본 — 들어온 곳으로');
      assert.equal((await marquee(p)).city, 'seoul', '돌아와도 조명은 서울');
      // 「세 사람 무대로」
      await p.tap('.th-go'); await p.waitForSelector('.th-cast'); assert.equal(await p.evaluate(() => location.search), '?city=seoul&w=fantasy');
      assert.deepEqual(o.errors, [], '(b) 콘솔'); checks += 20; await o.ctx.close(); }

    /* (c) 세계 바꿈 중 끌기 · 점 두 번 누르기 · 단추 연타 — 오류 0, 엉뚱한 도시로 가지 않음 */
    { const o = await open('/index.html?w=fantasy'), p = o.page; await globeIs(p, 'svg');
      const b = await ballCenter(p);
      await p.mouse.move(b.x, b.y); await p.mouse.down(); await p.mouse.move(b.x - 30, b.y, { steps: 3 });
      await p.tap('.th-worlds [data-world="cyberpunk"]');   // 끄는 중에 세계를 바꾼다
      await p.mouse.move(b.x - 90, b.y, { steps: 4 }); await p.mouse.up();
      await p.tap('.th-mq-next'); await p.tap('.th-worlds [data-world="steampunk"]'); await p.tap('.th-mq-next'); await p.tap('.th-worlds [data-world="fantasy"]');
      await globeIs(p, 'svg');
      assert.equal(await p.evaluate(() => document.querySelectorAll('.gl-svg').length), 1, '지구본은 하나');
      assert.equal(await p.evaluate(() => document.documentElement.dataset.world), 'fantasy');
      const m = await marquee(p); assert.equal((await pins(p))[m.city] && m.name, C[m.city].ko, '전광판 = 그 도시');
      // 세계를 바꾸자마자 서울 점 두 번 — 서울 무대로(다른 도시로 가지 않음)
      while ((await marquee(p)).city !== 'seoul') await p.tap('.th-mq-next');
      await settle(p);
      await p.tap('.th-worlds [data-world="steampunk"]'); await globeIs(p, 'svg');
      const sp = (await pins(p)).seoul;
      await p.mouse.click(sp.x, sp.y); await p.mouse.click(sp.x, sp.y).catch(() => {});
      await p.waitForSelector('.th-cast');
      assert.equal(await p.evaluate(() => new URLSearchParams(location.search).get('city')), 'seoul', '두 번 눌러도 서울');
      await p.goBack(); await globeIs(p, 'svg');
      // 막 바꾼 직후 바깥 도시 점(설계 전) 두 번 — 무대로 가지 않는다
      while ((await marquee(p)).city !== 'cairo') await p.tap('.th-mq-next');
      await settle(p); await p.tap('.th-worlds [data-world="cyberpunk"]'); await globeIs(p, 'svg');
      const all = await pins(p), sx = all.cairo, pre = Object.entries(all).find(([k, v]) => v.front && v.pre && !v.on && Math.hypot(v.x - sx.x, v.y - sx.y) > 50);   // 조명 안 도시의 누르는 자리(22px)에 겹치지 않는 점
      assert(pre, '설계 전 앞면 점이 있다');
      { await p.mouse.click(pre[1].x, pre[1].y); await p.mouse.click(pre[1].x, pre[1].y); await p.waitForTimeout(600);
        assert.equal(await p.evaluate(() => new URLSearchParams(location.search).get('city')), null, '설계 전 도시는 무대로 안 감'); }
      assert.deepEqual(o.errors, [], '(c) 콘솔'); checks += 5; await o.ctx.close(); }

    /* (a) (d) 모형 길 — glb 가 있고 WebGL 이 되면 그 뒤 캔버스, WebGL 이 없으면 SVG 그대로 */
    { const o = await open('/index.html?w=cyberpunk', { fulfill: [{ url: GLB, body: glb(), contentType: 'model/gltf-binary' }] }), p = o.page;
      await globeIs(p, 'svg', 4000);
      const gl = await p.evaluate(() => { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); });
      if (gl) {
        await globeIs(p, 'model', 30000);
        assert.equal(await p.locator('.gl-canvas').count(), 1, '(a) glb 있음 → 캔버스');
        assert.equal(await p.locator('.gl-ball').evaluate(e => getComputedStyle(e).display), 'none', '모형이면 SVG 공은 숨김');
        assert.equal((await pins(p)).seoul.on, true, '모형 위에도 도시 점');
        await p.tap('.th-mq-next'); assert.equal((await marquee(p)).city, 'tokyo');
        await p.tap('.th-worlds [data-world="fantasy"]'); await globeIs(p, 'svg'); await globeIs(p, 'model', 30000);   // 세계 바꿈 — 새 모형
        assert.equal(await p.locator('.gl-canvas').count(), 1, '캔버스는 하나'); checks += 5;
      } else console.log('  (알림) 이 브라우저는 WebGL 이 없어 모형 길은 (d) 로만 본다');
      assert.deepEqual(o.errors, [], '모형 길 콘솔'); await o.ctx.close(); }
    for (const [name, b, opt] of [['--disable-webgl', noGL, {}], ['getContext 막기', br, { noWebGL: true }]]) {
      const o = await open('/index.html?w=steampunk', Object.assign({ browser: b, fulfill: [{ url: GLB, body: glb(), contentType: 'model/gltf-binary' }] }, opt)), p = o.page;
      await globeIs(p, 'svg'); await p.waitForTimeout(800);
      assert.equal(await p.evaluate(() => document.querySelector('.th-slot').dataset.globe), 'svg', name + ' — SVG 그대로');
      assert.equal(await p.locator('.gl-canvas').count(), 0, name + ' — 캔버스 없음');
      await drag(p, -60); await settle(p);
      while ((await marquee(p)).city !== 'seoul') await p.tap('.th-mq-next');
      await p.tap('.th-go'); await p.waitForSelector('.th-cast');
      assert.deepEqual(o.errors, [], name + ' 콘솔'); checks += 4; await o.ctx.close();
    }
    /* (d) CDN 막힘 — d3 · 땅을 못 받아도 빈 화면이 아니고(CSS 공) 전광판으로 도시를 고른다 */
    { const o = await open('/index.html?w=fantasy', { blockCDN: true }), p = o.page;
      await globeIs(p, 'none');
      assert.notEqual(await p.locator('.th-slot').evaluate(e => getComputedStyle(e, '::before').content), 'none', 'CSS 공 자리');
      await p.tap('.th-mq-next'); assert.equal((await marquee(p)).city, 'tokyo');
      await p.tap('.th-mq-prev'); await p.tap('.th-go'); await p.waitForSelector('.th-cast');
      assert.deepEqual(o.errors, [], 'CDN 막힘 콘솔'); checks += 3; await o.ctx.close(); }

    /* 그림이 있으면 — 세계 그림이 그 자리에, 누르면 한 장(세계 넘기기) */
    { const img = { img: { seoul: { byStyle: { s1: { byForm: { fantasy: { f: 'seoul_fantasy_s1_f.webp' }, cyberpunk: { f: 'seoul_cyberpunk_s1_f.webp', casual: { f: ['seoul_cyberpunk_s1_f_casual2.webp', 'seoul_cyberpunk_s1_f_casual90.webp', 'seoul_cyberpunk_s1_f_casual1.webp'] } } } } } } }, added: {}, count: 5, where: {} };
      const o = await open('/index.html?city=seoul&w=cyberpunk', { fulfill: [{ url: /\/data\/img\.json/, body: JSON.stringify(img), contentType: 'application/json' }] }), p = o.page;
      await p.waitForSelector('.th-cast');
      assert.equal(await p.locator('button.th-fig').count(), 2, '그림 있는 두 세계'); assert.equal(await p.locator('.th-fig.is-empty').count(), 1);
      await H.shot(p, 'city-seoul-cyberpunk-pics');
      await p.tap('.th-role[data-world="cyberpunk"] button.th-fig'); await p.waitForSelector('.th-card');
      assert.equal(await p.evaluate(() => location.search), '?city=seoul&card=seoul&pic=seoul_cyberpunk_s1_f.webp&w=cyberpunk', '한 장 주소');
      assert.equal(await p.locator('.th-card').getAttribute('data-world'), 'cyberpunk', '한 장의 세계'); assert.match(await p.locator('.th-card figcaption').innerText(), /사이버펑크/, '세계 이름'); assert.match(await p.locator('.th-card').getAttribute('style'), /--w-cyberpunk/, '테 색');
      // 그림 줄 — 그 세계 그림 넷(세계 · 일상 1 · 2 · 직업), 번호 차례 · 90 은 끝
      assert.deepEqual(await p.$$eval('.th-strip button span', s => s.map(x => x.textContent)), ['세계', '1', '2', '직업'], '그림 줄 차례');
      assert.match(await p.textContent('.th-card-n'), /2 \/ 5/, '세는 말 — 판타지 세계 그림 다음');
      await p.tap('.th-card-nav button:last-child'); assert.match(await p.evaluate(() => location.search), /pic=seoul_cyberpunk_s1_f_casual1\.webp/, '뒤 장 — 일상컷 1');
      assert.match(await p.locator('.th-card figcaption').innerText(), /일상컷 1/, '일상컷 이름');
      await p.tap('.th-strip li:last-child button'); assert.match(await p.evaluate(() => location.search), /pic=seoul_cyberpunk_s1_f_casual90\.webp/, '줄에서 고르기');
      await p.tap('.th-card-nav button:last-child'); assert.match(await p.evaluate(() => location.search), /pic=seoul_fantasy_s1_f\.webp/, '끝에서 다음 세계로');
      await p.tap('.th-card-worlds button[style*="cyberpunk"]'); assert.match(await p.evaluate(() => location.search), /pic=seoul_cyberpunk_s1_f\.webp/, '세계 단추');
      // 크게 보기 — 누르면 화면 가득, 그림을 누르면 두 배 반 · 다시 맞춤, Esc 로 닫는다
      await p.tap('.th-zoom-open'); await p.waitForSelector('.th-zoom');
      const fit = await p.locator('.th-zoom img').evaluate(i => i.getBoundingClientRect().width);
      await p.tap('.th-zoom img'); const big = await p.locator('.th-zoom img').evaluate(i => i.getBoundingClientRect().width);
      assert(big > fit * 1.8, '크게 ' + fit + ' → ' + big); assert.deepEqual(await smallTargets(p), [], '크게 보기 44px');
      await H.shot(p, 'card-zoom-big'); await p.keyboard.press('Escape'); await p.waitForSelector('.th-zoom', { state: 'detached' });
      assert.match(await p.evaluate(() => location.search), /pic=seoul_cyberpunk_s1_f\.webp/, 'Esc 는 크게 보기만 닫는다');
      await p.tap('.th-zoom-open'); await p.tap('.th-zoom-bar button'); await p.waitForSelector('.th-zoom', { state: 'detached' });
      await H.shot(p, 'card-strip');
      assert.deepEqual(await smallTargets(p), [], '한 장 44px'); assert(await H.noOverflow(p));
      await p.tap('.th-back'); await p.waitForSelector('.th-cast'); assert.equal(await p.evaluate(() => location.search), '?city=seoul&w=cyberpunk', '한 장 → 도시 무대');
      assert.deepEqual(o.errors, [], '한 장 콘솔'); checks += 16; await o.ctx.close(); }

    /* 랜드마크 줄 — 서울 무대에 해치(세계 그림 + 일상 둘), 한 장, 돌아가기 · 도쿄엔 줄 없음 */
    { const HF = 'seoul-haechi_fantasy_s1_f', img = { img: { 'seoul-haechi': { byStyle: { s1: { byForm: { fantasy: { f: HF + '.webp', casual: { f: [HF + '_casual2.webp', HF + '_casual1.webp'] } } } } } } }, added: {}, count: 3, where: {} };
      const fl = [{ url: /\/data\/img\.json/, body: JSON.stringify(img), contentType: 'application/json' }];
      const o = await open('/index.html?city=seoul&w=fantasy', { fulfill: fl }), p = o.page;
      await p.waitForSelector('.th-cast'); await calm(p);
      assert.equal(await p.locator('.th-marks .th-mark').count(), 1, '랜드마크 하나'); assert.equal(await p.locator('.th-mark[data-card="seoul-haechi"]').count(), 1);
      assert.equal(await p.locator('.th-mark[data-card="seoul-haechi"] button').count(), 1, '그림 있는 세계 하나만 누를 수 있다');
      assert.equal(await p.locator('.th-mark[data-card="seoul-haechi"] .is-empty').count(), 2, '빈 자리 둘');
      assert.deepEqual(await smallTargets(p), [], '랜드마크 줄 44px'); assert(await H.noOverflow(p), '랜드마크 줄 넘침 없음');
      for (const [txt, c] of await H.contrast(p, '.th-mark-name')) assert(c >= 4.5, '랜드마크 대비 ' + c + ' — ' + txt);
      await H.shot(p, 'city-seoul-landmark');
      await p.tap('.th-mark[data-card="seoul-haechi"] button'); await p.waitForSelector('.th-card');
      assert.equal(await p.evaluate(() => location.search), '?city=seoul&card=seoul-haechi&pic=seoul-haechi_fantasy_s1_f.webp&w=fantasy', '랜드마크 한 장 주소');
      assert.deepEqual(await p.$$eval('.th-strip button span', s => s.map(x => x.textContent)), ['세계', '1', '2'], '한 장 그림 줄');
      assert.match(await p.locator('.th-card figcaption').innerText(), /해치/, '캡션에 해치'); await H.shot(p, 'card-landmark');
      await p.tap('.th-strip li:last-child button'); assert.match(await p.evaluate(() => location.search), /pic=seoul-haechi_fantasy_s1_f_casual2\.webp/, '줄에서 일상컷');
      assert.deepEqual(await smallTargets(p), [], '한 장 44px'); assert(await H.noOverflow(p));
      await p.tap('.th-back'); await p.waitForSelector('.th-cast'); assert.equal(await p.evaluate(() => location.search), '?city=seoul&w=fantasy', '돌아가기 → 서울 무대');
      assert.deepEqual(o.errors, [], '랜드마크 콘솔'); checks += 13; await o.ctx.close(); }
    { const o = await open('/index.html?city=tokyo'), p = o.page; await p.waitForSelector('.th-cast'); assert.equal(await p.locator('.th-marks').count(), 0, '도쿄엔 랜드마크 줄 없음'); checks += 1; await o.ctx.close(); }
    { const o = await open('/index.html?city=seoul&card=seoul-haechi&pic=seoul-haechi_fantasy_zz_f.webp'), p = o.page;
      await p.waitForSelector('.th-cast'); assert.equal(await p.locator('.th-card').count(), 0, '없는 랜드마크 그림 — 무대'); checks += 1; await o.ctx.close(); }

    /* 등록부에 없는 pic 주소는 도시 무대로 */
    { const o = await open('/index.html?city=seoul&card=seoul&pic=seoul_fantasy_zz_f.webp'), p = o.page;
      await p.waitForSelector('.th-cast'); assert.equal(await p.locator('.th-card').count(), 0, '없는 그림 — 무대'); checks += 1; await o.ctx.close(); }

    /* 움직임 줄이기 — 효과 없음(조명 따라감 · 세 조명 · 이름 깜빡임), 앞 · 뒤는 곧바로 그 도시가 가운데 */
    { const o = await open('/index.html?w=cyberpunk', { reduced: true }), p = o.page; await globeIs(p, 'svg');
      await p.tap('.th-mq-next'); await p.waitForTimeout(50);
      const t = (await pins(p)).tokyo, bc = await ballCenter(p);
      assert(Math.abs(t.x - bc.x) < 1, '움직임 끔 — 곧바로 도쿄가 가운데');
      assert.equal(await p.evaluate(() => document.getAnimations().length), 0, '움직임 끔 — 효과 없음');
      await p.tap('.th-mq-prev'); await p.tap('.th-go'); await p.waitForSelector('.th-cast');
      assert.equal(await p.evaluate(() => document.getAnimations().length), 0, '움직임 끔 — 세 조명 효과 없음');
      await H.shot(p, 'city-seoul-cyberpunk');
      assert.deepEqual(o.errors, []); checks += 4; await o.ctx.close(); }
    { const o = await open('/index.html?w=fantasy'), p = o.page; await globeIs(p, 'svg');
      await p.tap('.th-mq-next'); await p.waitForTimeout(60);
      const t = (await pins(p)).tokyo, bc = await ballCenter(p);
      assert(Math.abs(t.x - bc.x) > 2, '움직임 켬 — 조명이 도시를 따라 돈다(곧바로가 아님)');
      assert(await p.evaluate(() => document.getAnimations().some(a => a.animationName === 'th-flick')), '전광판 이름 켜짐');
      assert.deepEqual(o.errors, []); checks += 2; await o.ctx.close(); }

    console.log('PASS globe-screen: 여섯 판 · SVG 지구본 곧바로 · 끌기/앞뒤/이름 따라감 · 앞면=d3=GlobeMath · 뒷면 안 눌림 · 날짜변경선 · 세계 바꿈 중 끌기/두 번 누르기 · ' +
      'WebGL 없음/glb 404/CDN 막힘 · 설계 전 막힘 · 도시 무대 글=설계표 · 한 장 · 움직임 끔 (' + checks + ')');
  } finally { await br.close(); await noGL.close(); srv.close(); }
})().catch(e => { console.error(e); process.exit(1); });
