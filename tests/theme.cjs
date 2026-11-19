/* 공간 여섯(도시 극장, Task 7 · 2026-11-19 — DESIGN.md · lib/room.css · lib/workspace-theme.js) — 폴드 덮개 344×882 터치.
   여섯 판(세계 셋 × 객석 불 둘)마다 변수가 다 정해지고 서로 다름 · 판타지 · 스팀펑크 어두운 판 강조색 색상 차이 ≥ 25° ·
   글자 대비 4.5:1 · 누르는 자리 44px · 가로 넘침 0 · 콘솔 오류 0 · 장식 영어 대문자 없음 ·
   세계를 바꾸면 data-world · 주소 · 공간이 따라감(역사 안 늘림) · 밝기는 도구 상자에서 고르고 새로 고쳐도 남음 · 탭 둘 · 도구 화면도 세계를 따름 ·
   움직임 줄이기(기기 · 도구 상자)면 효과 없음.
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright 가 든 node_modules> node tests/theme.cjs   (SHOT_DIR 이 있으면 여섯 판 사진 theme-<세계>-<밝기>.png) */
const assert = require('node:assert/strict');
const { serve, launch, open, noOverflow, shot, contrast } = require('./lib/harness.cjs');
const WORLDS = ['fantasy', 'steampunk', 'cyberpunk'], TONES = ['dark', 'light'];
const VARS = ['--bg', '--deck', '--card', '--text', '--muted', '--line', '--accent', '--on-accent', '--accent2', '--curtain', '--curtain-deep', '--trim', '--spot', '--floor', '--w-fantasy', '--w-steampunk', '--w-cyberpunk'];
const TEXT = '.th-sub, .th-name, .th-marquee p, .th-marquee-name, .th-tab, .th-worlds button, .th-head .tb-open';
const hue = hex => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
  if (!d) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
const hueGap = (a, b) => { const d = Math.abs(hue(a) - hue(b)) % 360; return Math.min(d, 360 - d); };
const cssVars = p => p.evaluate(V => { const cs = getComputedStyle(document.documentElement); return Object.fromEntries(V.map(v => [v, cs.getPropertyValue(v).trim()])); }, VARS);
const smallTargets = p => p.$$eval('button, a, select', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 44 || r.height < 44); }).map(e => e.outerHTML.slice(0, 90)));

(async () => {
  const { base, close } = await serve(), br = await launch();
  let checks = 0;
  try {
    /* 여섯 판 */
    const seen = {};
    for (const w of WORLDS) for (const t of TONES) {
      const o = await open(br, base, '/index.html?w=' + w, { touch: true }), p = o.page, at = w + '-' + t;
      if (t === 'light') { await p.evaluate(() => localStorage.setItem('city_room_v1', 'light')); await p.reload(); }
      await p.waitForSelector('.th-marquee'); await p.evaluate(() => document.fonts.ready);
      const ds = await p.evaluate(() => Object.assign({}, document.documentElement.dataset));
      assert.equal(ds.world, w, at + ' data-world'); assert.equal(ds.tone, t, at + ' data-tone'); assert.equal(ds.motion, 'on', at + ' 움직임 기본 켬');
      const v = await cssVars(p); seen[at] = v;
      for (const k of VARS) assert(v[k], at + ' 변수 ' + k + ' 비어 있음');
      assert.equal(await p.evaluate(() => document.querySelector('meta[name="theme-color"]').content), v['--bg'], at + ' 주소창 색 = --bg');
      for (const [txt, c] of await contrast(p, TEXT)) assert(c >= 4.5, at + ' 대비 ' + c + ' — ' + txt);
      assert.deepEqual(await smallTargets(p), [], at + ' 누르는 자리 44px');
      assert(await noOverflow(p), at + ' 가로 넘침');
      assert(!/[A-Z]{3,}/.test(await p.evaluate(() => document.body.innerText)), at + ' 장식 영어 대문자');
      await shot(p, 'theme-' + at);
      assert.deepEqual(o.errors, [], at + ' 콘솔'); checks += 9; await o.ctx.close();
    }
    const sig = k => VARS.filter(x => !x.startsWith('--w-')).map(x => seen[k][x]).join('|');
    assert.equal(new Set(Object.keys(seen).map(sig)).size, 6, '여섯 판이 서로 다르다');
    for (const t of TONES) assert.equal(new Set(WORLDS.map(w => seen[w + '-' + t]['--curtain'])).size, 3, t + ' 막이 세계마다 다르다');
    const gap = hueGap(seen['fantasy-dark']['--accent'], seen['steampunk-dark']['--accent']);
    assert(gap >= 25, '판타지 · 스팀펑크 어두운 판 강조색 색상 차이 ' + gap.toFixed(1) + '°');
    checks += 3;

    /* 세계 고르개 · 밝기 기억 · 탭 둘 */
    { const o = await open(br, base, '/index.html?w=fantasy', { touch: true }), p = o.page;
      await p.waitForSelector('.th-worlds'); const len = await p.evaluate(() => history.length), cur0 = (await cssVars(p))['--curtain'];
      assert.equal(await p.locator('.th-spot').evaluate(e => getComputedStyle(e).animationName), 'th-breathe', '조명 숨쉬기(움직임 켬)');
      await p.tap('.th-worlds [data-world="steampunk"]');
      await p.waitForFunction(() => document.getAnimations().some(a => a.animationName === 'th-drop'), null, { timeout: 2000 });   // 세계를 바꾸면 막 내림
      await p.waitForFunction(() => !document.querySelector('.th-drop.is-on'), null, { timeout: 2000 });   // 다 내려왔다 오르면 걷힌다
      assert.equal(await p.evaluate(() => document.documentElement.dataset.world), 'steampunk');
      assert.match(await p.evaluate(() => location.search), /w=steampunk/, '주소의 세계');
      assert.equal(await p.evaluate(() => history.length), len, '세계 바꾸기는 역사를 늘리지 않는다');
      assert.notEqual((await cssVars(p))['--curtain'], cur0, '공간이 세계를 따라간다');
      assert.equal(await p.getAttribute('.th-worlds [data-world="steampunk"]', 'aria-pressed'), 'true');
      assert.equal(await p.evaluate(() => localStorage.getItem('city_world_v1')), 'steampunk', '세계 기억');
      // 도구 상자 — 객석 불(밝기)
      await p.tap('.th-head .tb-open'); await p.waitForSelector('.tb-sheet [data-tone="light"]');
      assert.deepEqual(await smallTargets(p), [], '도구 상자 44px');
      assert.equal(await p.locator('#tb-theme').count(), 0, '옛 공간 고르개 없음');
      await p.tap('.tb-sheet [data-tone="light"]');
      assert.equal(await p.evaluate(() => document.documentElement.dataset.tone), 'light');
      assert.equal(await p.getAttribute('.tb-sheet [data-tone="light"]', 'aria-pressed'), 'true');
      assert.equal(await p.evaluate(() => localStorage.getItem('city_room_v1')), 'light', '밝기 기억');
      for (const [txt, c] of await contrast(p, '.tb-sheet h2, .tb-sheet h3, .tb-sheet button, .tb-sheet a, .tb-field > span')) assert(c >= 4.5, '도구 상자 대비 ' + c + ' — ' + txt);
      await shot(p, 'theme-toolbox');
      await p.keyboard.press('Escape'); await p.waitForSelector('.tb-sheet', { state: 'detached' });
      await p.reload(); await p.waitForSelector('.th-worlds');
      assert.deepEqual(await p.evaluate(() => [document.documentElement.dataset.world, document.documentElement.dataset.tone]), ['steampunk', 'light'], '새로 고쳐도 남음');
      // 탭 둘
      await p.tap('.th-tab[data-tab="dex"]');
      assert.equal(await p.evaluate(() => location.search), '?tab=dex&w=steampunk', '도감 탭 주소');
      assert.equal(await p.getAttribute('.th-tab[data-tab="dex"]', 'aria-current'), 'page');
      assert.equal(await p.textContent('.th-marquee-name'), await p.evaluate(() => W('tab.dex')));
      await p.goBack(); await p.waitForFunction(() => document.querySelector('.th-tab[data-tab="globe"]').getAttribute('aria-current') === 'page');
      assert.deepEqual(o.errors, []); checks += 18;
      // 주소에 세계가 없으면 이 기기의 마지막 세계
      const p2 = await o.ctx.newPage(); await p2.goto(base + '/index.html'); await p2.waitForSelector('.th-worlds');
      assert.equal(await p2.evaluate(() => document.documentElement.dataset.world), 'steampunk', '마지막 세계'); await p2.close();
      // 도구 상자 「움직임 끄기」 → 효과 꺼짐
      await p.evaluate(() => AtelierWalk.setMotion(false));
      assert.equal(await p.evaluate(() => document.documentElement.dataset.motion), 'off');
      assert.equal(await p.locator('.th-spot').evaluate(e => getComputedStyle(e).animationName), 'none', '움직임 끄기 — 조명 멈춤');
      checks += 3; await o.ctx.close(); }

    /* 기기의 움직임 줄이기 — 효과 없음, 세계는 그대로 바뀐다 */
    { const o = await open(br, base, '/index.html?w=fantasy', { touch: true, reduced: true }), p = o.page; await p.waitForSelector('.th-worlds');
      assert.equal(await p.evaluate(() => document.documentElement.dataset.motion), 'off');
      assert.equal(await p.locator('.th-spot').evaluate(e => getComputedStyle(e).animationName), 'none');
      await p.tap('.th-worlds [data-world="cyberpunk"]'); await p.waitForTimeout(250);   // 막 내림이 걸렸다면 돌고 있을 때
      assert.equal(await p.evaluate(() => document.getAnimations().length), 0, '움직임 줄이기 — 막 내림 없음');
      assert.equal(await p.evaluate(() => document.documentElement.dataset.world), 'cyberpunk');
      assert.deepEqual(o.errors, []); checks += 5; await o.ctx.close(); }

    /* 도구 화면 — 생성기는 제 주소의 세계(?world=)를 따른다 */
    { const o = await open(br, base, '/prompt.html?card=seoul&o=world&world=cyberpunk', { touch: true }), p = o.page; await p.waitForSelector('.tb-bar');
      assert.equal(await p.evaluate(() => document.documentElement.dataset.world), 'cyberpunk', '생성기 공간');
      assert(await noOverflow(p)); assert.deepEqual(o.errors, []); checks += 3; await o.ctx.close(); }

    console.log('PASS theme: 여섯 판 변수 · 서로 다름 · 강조색 색상 차이 ' + gap.toFixed(1) + '° · 대비 4.5 · 44px · 넘침 0 · 콘솔 0 · 세계 따라감 · 밝기 기억 · 탭 둘 · 움직임 끔 (' + checks + ')');
    for (const t of TONES) console.log('  ' + t + ': ' + WORLDS.map(w => w + ' ' + seen[w + '-' + t]['--accent'] + ' (' + hue(seen[w + '-' + t]['--accent']).toFixed(0) + '°)').join(' · '));
  } finally { await br.close(); close(); }
})().catch(e => { console.error(e); process.exit(1); });
