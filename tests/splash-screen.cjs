/* 들어갈 때 로딩 화면(2026-11-24 — lib/splash.js · lib/splash.css, 지구본 「세 사람 무대로」 → 도시 무대) — 가짜 등록부(서울 세 세계 전경, 부산은 전경 없음)로:
   (a) 처음 들어가면 덮개가 뜨고 제목 = 도시 이름 · 세계 줄 = 세계 이름 · 한 줄 = 설계표 성격 첫 마디(40자 이하) · 덮개 aria-hidden · 알림 한 줄에 도시 이름
   (b) 빛 입자(PixiJS) 1~150 · 덮개는 나타나고 2초 안에 걷힌다 · 걷히면 도시 무대 · 초점은 무대 제목 · 가로 넘침 0 · 콘솔 오류 0 — 휴대폰 390×844 · PC 1280×800
   (c) 같은 탭에서 다시 들어가면 없음 · 무대에서 세계를 바꿔도 없음 · 다른 세계로 들어가면 그 세계 것 한 번
   (d) 누르기 · Enter · Esc 로 곧바로 걷힘(누른 것이 무대로 새지 않는다) (e) 움직임 줄이기면 없음 (f) 전경 없는 도시(부산)는 없음
   (g) PixiJS 막힘 → 덮개는 그대로 뜨고 걷힘(입자만 없음) (h) 그림이 600ms 안에 안 오면(느림 · 404) 덮개 없이 들어감 (i) 깊은 주소(?city=&w=)는 덮개 없음 · 뒤로 가기는 지구본
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright> ESM_DIR=<preact · pixi.js@8.19.0 사본> node tests/splash-screen.cjs
   SHOT_DIR 이 있으면 덮개 한가운데 사진(배율 2) — SPLASH_IMG=<폴더>에 seoul-<세계>.jpg 가 있으면 그 그림으로 */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const H = require('./lib/harness.cjs');
const D = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/city-design.json'), 'utf8')), ST = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/style.json'), 'utf8'))['default'];
const SEOUL = D.cities.find(c => c.key === 'seoul'), WN = { fantasy: '판타지', steampunk: '스팀펑크', cyberpunk: '사이버펑크' };
const V = w => `seoul_${w}_${ST}_vista.webp`;
const REG = { img: {
  seoul: { byStyle: { [ST]: { byForm: { fantasy: { f: `seoul_fantasy_${ST}_f.webp`, vista: V('fantasy') }, steampunk: { vista: V('steampunk') }, cyberpunk: { vista: V('cyberpunk') } } } } },
  busan: { byStyle: { [ST]: { byForm: { fantasy: { f: `busan_fantasy_${ST}_f.webp` } } } } } }, added: {}, count: 2, where: {} };
const WIDE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#3a2a5a"/><stop offset="1" stop-color="#c98a4a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>';
const REAL = process.env.SPLASH_IMG;
const vistaRoute = { url: /_vista\.webp/, body: WIDE_SVG, contentType: 'image/svg+xml' };
const REAL_ROUTES = REAL ? ['fantasy', 'steampunk', 'cyberpunk'].map(w => ({ url: new RegExp('seoul_' + w + '_.*_vista\\.webp'), body: fs.readFileSync(path.join(REAL, 'seoul-' + w + '.jpg')), contentType: 'image/jpeg' })) : [];
const REG_ROUTE = { url: /\/data\/img\.json/, body: JSON.stringify(REG), contentType: 'application/json' };
const PHONE = { width: 390, height: 844 }, DESK = { width: 1280, height: 800 };
const sp = p => p.evaluate(() => ({ on: !!document.querySelector('.sp'), log: JSON.parse(JSON.stringify(window.AtelierSplash || { shown: [], skipped: 0 })) }));
/* 덮개가 한 번이라도 붙었나 — 들어가기 전에 지켜보기를 건다 */
const watch = p => p.evaluate(() => { window.__sp = 0; new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.classList && n.classList.contains('sp')) window.__sp++; }).observe(document.body, { childList: true }); });

(async () => {
  const srv = await H.serve(), br = await H.launch();
  let checks = 0;
  const open = (url, o = {}) => H.open(br, srv.base, url, Object.assign({ viewport: PHONE, touch: true }, o, { fulfill: [REG_ROUTE, ...(o.fulfill || [vistaRoute])] }));
  const ready = p => p.waitForFunction(() => document.querySelector('.th-marquee[data-city]') && document.querySelector('.th-go'));
  const go = (p, touch) => touch ? p.tap('.th-go') : p.click('.th-go');
  try {
    /* (a) (b) (c) — 휴대폰 · PC */
    for (const [vp, touch, tag] of [[PHONE, true, '390'], [DESK, false, '1280']]) {
      const o = await open('/index.html?w=fantasy', { viewport: vp, touch }), p = o.page;
      await ready(p); assert.equal(await p.getAttribute('.th-marquee', 'data-city'), 'seoul', tag + ' 처음 조명 안은 서울');
      const t0 = Date.now(); await go(p, touch);
      await p.waitForSelector('.sp', { timeout: 1500 }); const t1 = Date.now();
      const txt = await p.evaluate(() => { const q = s => (document.querySelector(s) || {}).textContent || ''; return { k: q('.sp-kicker'), t: q('.sp-title'), l: q('.sp-line'), hid: document.querySelector('.sp').getAttribute('aria-hidden'), live: q('.sp-live'), liveRole: document.querySelector('.sp-live').getAttribute('aria-live') }; });
      assert.equal(txt.t, SEOUL.ko, tag + ' (a) 제목 = 도시 이름'); assert.equal(txt.k, WN.fantasy, tag + ' (a) 세계 줄');
      assert(txt.l.length > 4 && txt.l.length <= 41 && SEOUL.persona.startsWith(txt.l.replace(/…$/, '')), tag + ' (a) 한 줄 = 성격 첫 마디 ' + txt.l);
      assert(!/[A-Z]{2,}/.test(txt.t + txt.k + txt.l), tag + ' (a) 장식 영어 대문자 없음');
      assert.equal(txt.hid, 'true', tag + ' (a) 덮개 aria-hidden'); assert(txt.live.includes(SEOUL.ko) && txt.liveRole === 'polite', tag + ' (a) 알림 한 줄 ' + txt.live);
      await p.waitForFunction(() => window.AtelierSplash.pixi !== 'wait', null, { timeout: 1500 });
      const lg = (await sp(p)).log;
      assert(lg.pixi === 'on' && lg.sprites >= 1 && lg.sprites <= 150, tag + ' (b) 빛 입자 ' + JSON.stringify(lg));
      assert(await H.noOverflow(p), tag + ' (b) 가로 넘침');
      await p.waitForFunction(() => /city=seoul/.test(location.search) && document.querySelector('.sp'), null, { timeout: 1000 }).catch(() => assert.fail(tag + ' (b) 덮개 뒤에서 들어감'));
      await p.waitForSelector('.sp', { state: 'detached', timeout: 2500 }); const t2 = Date.now();
      assert(t2 - t1 <= 2000, tag + ' (b) 2초 안에 걷힘 ' + (t2 - t1) + 'ms(누르고부터 ' + (t2 - t0) + 'ms)');
      assert.equal(await p.locator('.th-city .th-vista').count(), 1, tag + ' (b) 걷히면 도시 무대');
      assert.equal(await p.evaluate(() => document.activeElement && document.activeElement.matches('.th-city-title h2')), true, tag + ' (b) 초점은 무대 제목');
      /* (c) 세계를 바꿔도 다시 안 뜨고, 뒤로 → 다시 들어가도 안 뜨고, 다른 세계로 들어가면 그 세계 것 한 번 */
      await watch(p);
      await p.click('.th-worlds button[data-world="steampunk"]'); await p.waitForTimeout(300);
      assert.equal(await p.evaluate(() => window.__sp), 0, tag + ' (c) 무대에서 세계를 바꾸면 없음');
      await p.click('.th-worlds button[data-world="fantasy"]');
      await p.goBack(); await ready(p); await watch(p);
      await go(p, touch); await p.waitForSelector('.th-city'); await p.waitForTimeout(400);
      assert.equal(await p.evaluate(() => window.__sp), 0, tag + ' (c) 같은 탭에서 다시 들어가면 없음');
      await p.goBack(); await ready(p);
      await p.click('.th-worlds button[data-world="cyberpunk"]'); await p.waitForTimeout(800);
      await go(p, touch); await p.waitForSelector('.sp', { timeout: 1500 });
      assert.equal(await p.textContent('.sp-kicker'), WN.cyberpunk, tag + ' (c) 다른 세계로 들어가면 그 세계 것');
      await p.waitForSelector('.sp', { state: 'detached', timeout: 2500 });
      assert.deepEqual((await sp(p)).log.shown, ['seoul|fantasy', 'seoul|cyberpunk'], tag + ' (c) 본 자리');
      assert.deepEqual(o.errors, [], tag + ' 콘솔'); checks += 17; await o.ctx.close();
    }
    /* (d) 누르기 · Enter · Esc — 곧바로 걷히고, 누른 것은 무대로 새지 않는다 */
    for (const how of ['tap', 'Enter', 'Escape']) {
      const o = await open('/index.html?w=fantasy'), p = o.page;
      await ready(p); await p.tap('.th-go'); await p.waitForSelector('.sp', { timeout: 1500 }); await p.waitForTimeout(350);
      const t = Date.now();
      if (how === 'tap') { const b = await p.locator('.th-city .th-vista').boundingBox(); await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height - 40); }   /* 띠의 카드 자리 — 새면 한 장이 열린다 */
      else await p.keyboard.press(how);
      await p.waitForSelector('.sp', { state: 'detached', timeout: 600 }); const dt = Date.now() - t;
      assert(dt < 600, how + ' (d) 곧바로 걷힘 ' + dt + 'ms');
      await p.waitForTimeout(300);
      const s = await p.evaluate(() => location.search);
      assert(/city=seoul/.test(s) && !/card=/.test(s), how + ' (d) 무대 그대로(새지 않음) ' + s);
      assert.equal((await sp(p)).log.skipped, 1, how + ' (d) 건너뜀 1');
      assert.deepEqual(o.errors, [], how + ' 콘솔'); checks += 4; await o.ctx.close();
    }
    /* (e) 움직임 줄이기 · (f) 전경 없는 도시 · (g) PixiJS 막힘 · (h) 느린 그림 · 404 · (i) 깊은 주소 */
    { const o = await open('/index.html?w=fantasy', { reduced: true }), p = o.page;
      await ready(p); await watch(p); await p.tap('.th-go'); await p.waitForSelector('.th-city'); await p.waitForTimeout(500);
      assert.equal(await p.evaluate(() => window.__sp), 0, '(e) 움직임 줄이기 — 없음');
      assert.deepEqual(o.errors, [], '(e) 콘솔'); checks += 2; await o.ctx.close(); }
    { const o = await open('/index.html?w=fantasy'), p = o.page;
      await ready(p);
      for (let i = 0; i < 16 && await p.getAttribute('.th-marquee', 'data-city') !== 'busan'; i++) { await p.tap('.th-mq-next'); await p.waitForTimeout(80); }
      assert.equal(await p.getAttribute('.th-marquee', 'data-city'), 'busan', '(f) 조명 안 부산');
      await watch(p); await p.tap('.th-go'); await p.waitForSelector('.th-city'); await p.waitForTimeout(500);
      assert(/city=busan/.test(await p.evaluate(() => location.search)) && await p.evaluate(() => window.__sp) === 0, '(f) 전경 없는 도시 — 없음');
      assert.deepEqual(o.errors, [], '(f) 콘솔'); checks += 2; await o.ctx.close(); }
    { const o = await open('/index.html?w=steampunk', { blockPixi: true }), p = o.page;
      await ready(p); await p.tap('.th-go'); await p.waitForSelector('.sp', { timeout: 1500 });
      assert.equal(await p.textContent('.sp-title'), SEOUL.ko, '(g) PixiJS 막혀도 덮개');
      await p.waitForSelector('.sp', { state: 'detached', timeout: 2500 });
      const lg = (await sp(p)).log;
      assert(lg.pixi === 'none' && lg.sprites === 0, '(g) 입자만 없음 ' + JSON.stringify(lg));
      assert.equal(await p.locator('.th-city .th-vista').count(), 1, '(g) 무대');
      assert.deepEqual(o.errors, [], '(g) 콘솔'); checks += 4; await o.ctx.close(); }
    for (const [what, opt] of [['느림', { fulfill: [], slowImg: 1500 }], ['404', { fulfill: [], failURL: /_vista\.webp/ }]]) {
      const o = await open('/index.html?w=fantasy', opt), p = o.page;
      await ready(p); await watch(p); const t = Date.now(); await p.tap('.th-go'); await p.waitForSelector('.th-city', { timeout: 3000 }); const dt = Date.now() - t;
      await p.waitForTimeout(300);
      assert(await p.evaluate(() => window.__sp) === 0 && dt < 1500, '(h) ' + what + ' — 덮개 없이 들어감 ' + dt + 'ms');
      assert.deepEqual(o.errors, [], '(h) ' + what + ' 콘솔'); checks += 2; await o.ctx.close();
    }
    { const o = await open('/index.html?city=seoul&w=fantasy'), p = o.page;
      await p.waitForSelector('.th-vista'); await p.waitForTimeout(800);
      assert.equal(await p.locator('.sp').count() + (await sp(p)).log.shown.length, 0, '(i) 깊은 주소 — 없음');
      await p.click('.th-back'); await ready(p);
      assert.equal(await p.evaluate(() => location.search), '?w=fantasy', '(i) 돌아가기 → 지구본');
      assert.deepEqual(o.errors, [], '(i) 콘솔'); checks += 3; await o.ctx.close(); }
    /* 사진 — 덮개 한가운데(글이 다 오른 뒤) */
    if (process.env.SHOT_DIR) for (const [w, vp, touch, name] of [['fantasy', PHONE, true, 'city-seoul-fantasy-phone'], ['cyberpunk', PHONE, true, 'city-seoul-cyberpunk-phone'], ['steampunk', DESK, false, 'city-seoul-steampunk-desktop']]) {
      const o = await open('/index.html?w=' + w, { viewport: vp, touch, scale: 2, fonts: true, fulfill: REAL_ROUTES.length ? REAL_ROUTES : [vistaRoute] }), p = o.page;
      await ready(p); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); await p.evaluate(() => { window.AtelierSplash = window.AtelierSplash || { shown: [], skipped: 0, sprites: 0, pixi: '', state: 'idle' }; window.AtelierSplash.hold = 6000; });
      await go(p, touch); await p.waitForSelector('.sp', { timeout: 1500 });
      await p.waitForTimeout(1000); assert.equal(await p.locator('.sp').count(), 1, name + ' 덮개'); await H.shot(p, name); await o.ctx.close();
    }
    console.log(`PASS 들어갈 때 로딩 화면: 휴대폰 · PC 처음 한 번(제목 · 세계 · 한 줄 · 입자 ≤150 · 2초 안에 걷힘 · 초점) · 다시 · 세계 바꿈은 없음 · 다른 세계는 한 번 · 누르기 · Enter · Esc 건너뜀(새지 않음) · 움직임 줄이기 · 전경 없는 도시 · PixiJS 막힘 · 느린 그림 · 404 · 깊은 주소 (${checks})`);
  } finally { await br.close(); srv.close(); }
})().catch(e => { console.error(e); process.exit(1); });
