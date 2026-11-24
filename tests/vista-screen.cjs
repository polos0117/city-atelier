/* 도시 무대 전경(2026-11-24 — lib/city-view.js VistaStage · lib/room.css .th-vista, DESIGN.md 5절) — 가짜 등록부(서울 세 세계 전경 + 그림 몇 장)로:
   (a) 세계마다 그 세계 전경이 무대 배경(.th-vista-bg 의 background-image 가 <도시>_<세계>_<화풍>_vista.webp) · 세계를 바꾸면 배경도 바뀜
   (b) 작은 지도 — 랜드마크 점 수 = 좌표 있는 랜드마크 수, 도시 한가운데 점 하나, 점은 지도 안
   (c) 카드 띠 — 1(그 도시 사람) + 랜드마크 수, 차례는 도시 다음 설계표 차례, 카드는 누를 수 있는 것(그림 → 단추, 그림 없음 → 생성기 길) · 44px
   (d) 점 누르기 → 그 카드 강조 + 띠가 그쪽으로 · 강조된 점을 한 번 더 → 그 카드를 연 것과 같다(한 장). 카드를 누르면 한 장
   (e) 휴대폰 세로 390×844 움직임 켬이면 배경이 좌우로(th-pan) · 기기 움직임 줄이기면 멈춤 · 넓은 화면 1280 은 멈춘 cover
   (f) 가로 넘침 0(390 · 344 · 1280) · 콘솔 오류 0 (g) 전경이 없는 도시(도쿄)는 예전 그대로(전경 무대 없음, 돌아가기 · 제목 · 세 칸)
   (h) 좁은 화면 지도 접기 (i) 전경 구경(단추 · 배경 길게 누르기 · 나오기 셋) (j) 좁은 화면 도시 무대 머리 한 줄 (k) 펼친 폴드 · 태블릿 PC 꼴 — 2026-11-24 둘째(「휴대폰 쪽까지 고친 다음 한 번에 올려줘」)
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright> ESM_DIR=<preact 사본> node tests/vista-screen.cjs   (SHOT_DIR 이 있으면 사진) */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const H = require('./lib/harness.cjs');
const D = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/city-design.json'), 'utf8')), ST = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/style.json'), 'utf8'))['default'];
const WORLDS = ['fantasy', 'steampunk', 'cyberpunk'], SEOUL = D.cities.find(c => c.key === 'seoul');
const LMS = SEOUL.landmarks, WITH_LL = LMS.filter(l => typeof l.lat === 'number' && typeof l.lon === 'number');
const V = w => `seoul_${w}_${ST}_vista.webp`, F = (k, w) => `${k}_${w}_${ST}_f.webp`;
/* 가짜 등록부 — 서울 세 세계 전경 · 서울 판타지 · 한강철교 판타지 그림. 도쿄는 그림만(전경 없음) */
const REG = { img: {
  seoul: { byStyle: { [ST]: { byForm: { fantasy: { f: F('seoul', 'fantasy'), vista: V('fantasy') }, steampunk: { vista: V('steampunk') }, cyberpunk: { vista: V('cyberpunk') } } } } },
  'seoul-hangangbridge': { byStyle: { [ST]: { byForm: { fantasy: { f: F('seoul-hangangbridge', 'fantasy') } } } } },
  tokyo: { byStyle: { [ST]: { byForm: { fantasy: { f: F('tokyo', 'fantasy') } } } } } }, added: {}, count: 3, where: {} };
/* 전경 그림은 3:2(1536×1024) 비탈로 — 하네스의 그림 대신(그쪽은 2:3) */
const WIDE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#3a2a5a"/><stop offset="1" stop-color="#c98a4a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>';
const FULFILL = [{ url: /\/data\/img\.json/, body: JSON.stringify(REG), contentType: 'application/json' }, { url: /_vista\.webp/, body: WIDE_SVG, contentType: 'image/svg+xml' }];
const PHONE = { width: 390, height: 844 };
const smallTargets = p => p.$$eval('.th-vista button:not(.th-map-pin), .th-vista a', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 44 || r.height < 44); }).map(e => e.outerHTML.slice(0, 90)));
const bg = p => p.evaluate(() => { const e = document.querySelector('.th-vista-bg'); return e ? getComputedStyle(e).backgroundImage : ''; });
const anim = p => p.evaluate(() => getComputedStyle(document.querySelector('.th-vista-bg')).animationName);

(async () => {
  const srv = await H.serve(), br = await H.launch();
  let checks = 0;
  const open = (url, o = {}) => H.open(br, srv.base, url, Object.assign({ viewport: PHONE, touch: true }, o, { fulfill: FULFILL }));
  try {
    /* (a) (b) (c) (e) (f) 세계마다 — 휴대폰 세로 */
    for (const w of WORLDS) {
      const o = await open('/index.html?city=seoul&w=' + w), p = o.page;
      await p.waitForSelector('.th-vista');
      assert((await bg(p)).includes(V(w)), w + ' (a) 무대 배경 = 그 세계 전경 — ' + await bg(p));
      assert.equal(await p.locator('.th-vista .th-crumb .th-back').count(), 1, w + ' 돌아가기는 전경 위에');
      assert.equal(await p.locator('.th-vista .th-city-title h2').textContent(), SEOUL.ko, w + ' 제목은 전경 위에');
      /* (h) 좁은 화면 — 지도는 「지도」 단추 하나로 접혀 있다가 누르면 편다(이 탭에 기억) */
      assert.equal(await p.locator('.th-map').count(), 0, w + ' (h) 390 지도는 접힌 채로 시작');
      assert.equal(await p.getAttribute('.th-map-toggle', 'aria-expanded'), 'false', w + ' (h) 지도 단추');
      await p.click('.th-map-toggle');
      assert.equal(await p.getAttribute('.th-map-toggle', 'aria-expanded'), 'true', w + ' (h) 눌러 폄');
      assert.equal(await p.locator('.th-map-pin:not(.is-home)').count(), WITH_LL.length, w + ' (b) 지도 점 = 좌표 있는 랜드마크 ' + WITH_LL.length);
      assert.equal(await p.locator('.th-map-pin.is-home').count(), 1, w + ' (b) 도시 한가운데 점');
      const inMap = await p.evaluate(() => { const m = document.querySelector('.th-map').getBoundingClientRect(); return [...document.querySelectorAll('.th-map-pin')].every(b => { const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; return x >= m.left && x <= m.right && y >= m.top && y <= m.bottom; }); });
      assert(inMap, w + ' (b) 점은 지도 안');
      const cards = await p.$$eval('.th-vista-strip > li', ls => ls.map(l => l.dataset.card));
      assert.deepEqual(cards, ['seoul', ...LMS.map(l => 'seoul-' + l.key)], w + ' (c) 띠 = 도시 + 랜드마크 ' + (1 + LMS.length));
      const kinds = await p.$$eval('.th-vcard', es => es.map(e => e.tagName + (e.tagName === 'A' ? ':' + e.getAttribute('href') : '')));
      assert(kinds.every(k => k === 'BUTTON' || /^A:prompt\.html\?card=seoul(-[a-z0-9]+)?&o=world&world=/.test(k)), w + ' (c) 카드는 단추 · 생성기 길 ' + kinds);
      if (w === 'fantasy') assert.equal(kinds.filter(k => k === 'BUTTON').length, 2, '(c) 그림 있는 카드(서울 · 한강철교)는 단추');
      assert.deepEqual(await smallTargets(p), [], w + ' (c) 44px');
      assert.equal(await anim(p), 'th-pan', w + ' (e) 휴대폰 세로 — 배경이 좌우로');
      assert(await p.evaluate(() => sessionStorage.getItem('city_map_v1')) === 'open', w + ' (h) 편 것을 이 탭에 기억');
      assert(await H.noOverflow(p), w + ' (f) 390 가로 넘침');
      await H.shot(p, 'vista-' + w);
      assert.deepEqual(o.errors, [], w + ' 콘솔'); checks += 16; await o.ctx.close();
    }
    /* (a) 세계 바꾸기 → 배경도 · (d) 점 · 카드 */
    { const o = await open('/index.html?city=seoul&w=steampunk'), p = o.page;
      await p.waitForSelector('.th-vista');
      await p.click('.th-worlds button[data-world="fantasy"]');
      await p.waitForFunction(v => getComputedStyle(document.querySelector('.th-vista-bg')).backgroundImage.includes(v), V('fantasy'));
      await p.click('.th-map-toggle');
      const pin = '.th-map-pin[data-card="seoul-hangangbridge"]', card = '.th-vista-strip li[data-card="seoul-hangangbridge"] .th-vcard';
      await p.click(pin);
      assert.equal(await p.getAttribute(pin, 'aria-pressed'), 'true', '(d) 누른 점');
      assert(await p.locator(card).evaluate(e => e.classList.contains('is-sel')), '(d) 그 카드 강조');
      assert.equal(await p.locator('.th-vcard.is-sel').count(), 1, '(d) 강조는 하나');
      /* 띠가 그 카드까지 밀린다(부드럽게 — 다 밀릴 때까지 기다린다) */
      await p.waitForFunction(s => { const b = document.querySelector('.th-vista-strip'), br = b.getBoundingClientRect(), r = document.querySelector(s).getBoundingClientRect(); return b.scrollLeft > 0 && r.left >= br.left - 1 && r.right <= br.right + 1; }, card, { timeout: 4000 });
      await p.click(pin);
      await p.waitForFunction(() => /card=seoul-hangangbridge/.test(location.search));
      assert(/pic=seoul-hangangbridge_fantasy_/.test(await p.evaluate(() => location.search)) && await p.locator('.th-card').count() === 1, '(d) 한 번 더 누르면 한 장');
      await p.goBack(); await p.waitForSelector('.th-vista');
      await p.click('.th-vista-strip li[data-card="seoul"] .th-vcard');
      await p.waitForFunction(() => /card=seoul&/.test(location.search + '&'));
      assert.equal(await p.locator('.th-card').count(), 1, '(d) 도시 카드를 누르면 한 장');
      assert.deepEqual(o.errors, [], '(d) 콘솔'); checks += 7; await o.ctx.close(); }
    /* (i) 전경 구경 — 「전경」 단추로 들고 남, Esc · 「돌아가기」 · 그림 한 번 누르기로 남, 배경 길게 누르기로 듦(짧게 · 카드 위는 아님) */
    { const o = await open('/index.html?city=seoul&w=fantasy'), p = o.page;
      await p.waitForSelector('.th-vista');
      const state = () => p.evaluate(() => { const v = document.querySelector('.th-vista'), vis = s => { const e = document.querySelector(s); return e ? getComputedStyle(e).visibility : 'none'; };
        return { look: v.classList.contains('is-look'), pressed: document.querySelector('.th-look-btn').getAttribute('aria-pressed'), top: vis('.th-vista-top'), strip: vis('.th-vista-strip'), toggle: vis('.th-map-toggle'), scroller: !!document.querySelector('.th-vista-look') }; });
      assert.deepEqual(await state(), { look: false, pressed: 'false', top: 'visible', strip: 'visible', toggle: 'visible', scroller: false }, '(i) 처음');
      const lookIs = (v, msg) => p.waitForFunction(v => !!document.querySelector('.th-vista.is-look') === v, v, { timeout: 2000 }).catch(() => assert.fail(msg));
      const lb = await p.locator('.th-look-btn').boundingBox(); assert(lb.width >= 44 && lb.height >= 44, '(i) 전경 단추 44px');
      await p.click('.th-look-btn');
      await p.waitForFunction(() => getComputedStyle(document.querySelector('.th-vista-strip')).visibility === 'hidden');
      assert.deepEqual(await state(), { look: true, pressed: 'true', top: 'hidden', strip: 'hidden', toggle: 'hidden', scroller: true }, '(i) 전경 단추 → 제목 · 지도 · 띠 감춤');
      assert.equal(await anim(p), 'none', '(i) 구경 중에는 흐름 멈춤');
      const sc = await p.evaluate(() => { const b = document.querySelector('.th-vista-look'), i = b.querySelector('img'); return { h: Math.round(i.getBoundingClientRect().height), bh: b.clientHeight, sw: b.scrollWidth, cw: b.clientWidth, sl: b.scrollLeft, ox: getComputedStyle(b).overflowX }; });
      assert(sc.h === sc.bh && sc.sw > sc.cw * 1.5 && sc.ox === 'auto', '(i) 그림은 무대 높이에 맞춰 펴고 옆으로 밀린다 ' + JSON.stringify(sc));
      const cl = await p.locator('.th-look-close').boundingBox(); assert(cl.width >= 44 && cl.height >= 44, '(i) 돌아가기 44px');
      await p.evaluate(() => { const b = document.querySelector('.th-vista-look'); b.scrollLeft = 120; });
      assert.equal(await p.evaluate(() => document.querySelector('.th-vista-look').scrollLeft), 120, '(i) 옆으로 밀림');
      assert(await H.noOverflow(p), '(i) 구경 중 가로 넘침 없음');
      await H.shot(p, 'vista-look');
      await p.click('.th-look-btn'); await lookIs(false, '(i) 전경 단추 다시 → 나옴');
      const inLook = () => p.waitForSelector('.th-vista.is-look .th-look-close');
      await p.click('.th-look-btn'); await inLook(); await p.keyboard.press('Escape'); await lookIs(false, '(i) Esc → 나옴');
      await p.click('.th-look-btn'); await inLook(); await p.click('.th-look-close'); await lookIs(false, '(i) 돌아가기 → 나옴');
      await p.click('.th-look-btn'); await inLook(); await p.waitForTimeout(100);
      const b0 = await p.locator('.th-vista-look').boundingBox(); await p.mouse.click(b0.x + b0.width / 2, b0.y + b0.height / 2);
      await lookIs(false, '(i) 그림 한 번 누르기 → 나옴');
      /* 길게 누르기 — 배경 빈 곳(제목 아래 · 띠 위 왼쪽) */
      const vb = await p.locator('.th-vista').boundingBox(), sb = await p.locator('.th-vista-strip').boundingBox(), x = vb.x + 60, y = sb.y - 120;
      await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(200); await p.mouse.up();
      await lookIs(false, '(i) 짧게 누르면 그대로');
      await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(650);
      await lookIs(true, '(i) 배경 길게 누르기 → 구경'); await p.mouse.up();
      await lookIs(true, '(i) 손을 떼도 구경(뗀 것은 누르기가 아니다)');
      await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('.th-vista.is-look'));
      const cb = await p.locator('.th-vista-strip li[data-card="seoul-haechi"] .th-vcard').boundingBox();
      await p.mouse.move(cb.x + cb.width / 2, cb.y + 30); await p.mouse.down(); await p.waitForTimeout(650);
      await lookIs(false, '(i) 카드 위 길게 누르기는 구경이 아니다'); await p.mouse.move(cb.x + cb.width / 2, cb.y - 400); await p.mouse.up();
      assert.deepEqual(o.errors, [], '(i) 콘솔'); checks += 17; await o.ctx.close(); }
    /* (j) 좁은 화면 도시 무대의 머리 — 한 줄(세계 고르개 + 도구), 공방 이름 · 부제는 숨김. 지구본 층은 그대로 */
    { const o = await open('/index.html?city=seoul&w=fantasy'), p = o.page;
      await p.waitForSelector('.th-vista');
      const m = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); return { vt: r('.th-vista').top, wt: r('.th-worlds').top, tt: r('.th-head .tb-open').top, th: r('.th-head .tb-open').height, wh: r('.th-worlds').height, nw: r('.th-name').width }; });
      assert(m.nw <= 1 && Math.abs((m.wt + m.wh / 2) - (m.tt + m.th / 2)) < 4, '(j) 세계 고르개 · 도구 한 줄, 이름 숨김 ' + JSON.stringify(m));
      await p.click('.th-back'); await p.waitForSelector('.th-marquee');
      const g = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); return { wb: r('.th-worlds').bottom, nw: r('.th-name').width, sw: r('.th-sub').width }; });
      assert(g.nw > 40 && g.sw > 40, '(j) 지구본 층 머리는 그대로 ' + JSON.stringify(g));
      assert(m.vt < g.wb, '(j) 무대 머리가 더 낮다 — 전경 위쪽 ' + m.vt + ' < 예전 머리 끝 ' + g.wb);
      assert.deepEqual(o.errors, [], '(j) 콘솔'); checks += 4; await o.ctx.close(); }
    /* (k) 펼친 폴드 · 태블릿 — PC 꼴(지도 늘 폄 · 지도 단추 없음 · 띠 한 줄 · 흐름 없음 · 머리 그대로) */
    for (const vp of [{ width: 720, height: 800 }, { width: 884, height: 1104 }]) {
      const o = await open('/index.html?city=seoul&w=steampunk', { viewport: vp }), p = o.page, at = vp.width + '×' + vp.height;
      await p.waitForSelector('.th-vista');
      assert.equal(await p.locator('.th-map-toggle').count(), 0, at + ' (k) 지도 단추 없음');
      assert.equal(await p.locator('.th-map-pin:not(.is-home)').count(), WITH_LL.length, at + ' (k) 지도 펴 둠');
      assert.equal(await anim(p), 'none', at + ' (k) 흐름 없음');
      assert.equal(new Set(await p.$$eval('.th-vista-strip > li', ls => ls.map(l => l.offsetTop))).size, 1, at + ' (k) 띠 한 줄');
      assert(await p.evaluate(() => document.querySelector('.th-name').getBoundingClientRect().width > 40), at + ' (k) 머리 그대로');
      assert(await H.noOverflow(p), at + ' (k) 가로 넘침');
      assert.deepEqual(await smallTargets(p), [], at + ' (k) 44px');
      await H.shot(p, 'vista-fold-' + vp.width);
      assert.deepEqual(o.errors, [], at + ' 콘솔'); checks += 8; await o.ctx.close();
    }
    /* (e) 움직임 줄이기 · 넓은 화면 · (f) 344 */
    { const o = await open('/index.html?city=seoul&w=fantasy', { reduced: true }), p = o.page;
      await p.waitForSelector('.th-vista');
      assert.equal(await anim(p), 'none', '(e) 움직임 줄이기 — 배경 멈춤');
      await p.click('.th-look-btn');
      assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('.th-vista-strip')).transitionDuration + '|' + getComputedStyle(document.querySelector('.th-vista-look')).animationName), '0s|none', '(e) 움직임 줄이기 — 구경도 흐려지기 없음');
      assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('.th-vista-strip')).visibility), 'hidden', '(e) 곧바로 감춤');
      await o.ctx.close(); }
    { const o = await open('/index.html?city=seoul&w=fantasy', { viewport: H.WIDE, touch: false }), p = o.page;
      await p.waitForSelector('.th-vista');
      assert.equal(await anim(p), 'none', '(e) 넓은 화면 — 멈춘 cover');
      assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('.th-vista-bg')).backgroundSize), 'cover', '(e) cover');
      assert.equal(await p.locator('.th-map-toggle').count(), 0, '1280 지도 단추 없음(늘 폄)');
      assert.equal(await p.locator('.th-map-pin:not(.is-home)').count(), WITH_LL.length, '1280 지도 점');
      assert(await H.noOverflow(p), '(f) 1280 가로 넘침');
      await H.shot(p, 'vista-wide');
      assert.deepEqual(o.errors, [], '넓은 화면 콘솔'); checks += 4; await o.ctx.close(); }
    { const o = await open('/index.html?city=seoul&w=cyberpunk', { viewport: H.COVER }), p = o.page;
      await p.waitForSelector('.th-vista');
      assert(await H.noOverflow(p), '(f) 344 가로 넘침');
      await p.click('.th-map-toggle'); assert(await H.noOverflow(p), '(f) 344 지도 편 채 가로 넘침');
      assert.deepEqual(await smallTargets(p), [], '(f) 344 44px'); checks += 2; await o.ctx.close(); }
    /* (g) 전경 없는 도시 · 전경 없는 세계 */
    { const o = await open('/index.html?city=tokyo&w=fantasy'), p = o.page;
      await p.waitForSelector('.th-cast');
      assert.equal(await p.locator('.th-vista').count(), 0, '(g) 전경 없는 도시 — 전경 무대 없음');
      assert.equal(await p.locator('.th-city > .th-crumb').count() + await p.locator('.th-city > .th-city-title').count(), 2, '(g) 돌아가기 · 제목은 예전 자리');
      assert.equal(await p.locator('.th-role').count(), 3, '(g) 세 칸');
      assert.deepEqual(o.errors, [], '(g) 콘솔'); checks += 4; await o.ctx.close(); }
    console.log(`PASS 도시 무대 전경: 세 세계 배경 · 세계 바꿈 · 지도 점 ${WITH_LL.length}+1 · 띠 ${1 + LMS.length} · 점 → 강조 · 한 번 더 → 한 장 · 좌우 흐름(휴대폰 세로만, 움직임 줄이기 · 넓은 화면은 멈춤) · 넘침 0(390 · 344 · 1280) · 44px · 전경 없으면 예전 그대로 · 전경 구경(단추 · 길게 누르기 · Esc · 돌아가기 · 한 번 누르기 · 움직임 줄이기면 흐려지기 없음) · 좁은 화면 지도 접기 · 머리 한 줄 · 폴드 720 · 884 PC 꼴 (${checks})`);
  } finally { await br.close(); srv.close(); }
})().catch(e => { console.error(e); process.exit(1); });
