/* 전체 도감 탭(Task 9 — DESIGN.md 5절, 계획 Task 9 Step 1 · Review Focus 4) — 폴드 덮개 344×882 터치 + PC 1280.
   여섯 판(세계 × 밝기): 도시 10줄 · 줄마다 도시 상징 색 띠(palette.hex[0] 맨 위) · 세계 세 칸 + 일상컷 수 · 그림 없는 칸은 「그림 없음」 + 생성기 길 ·
   설계 전 도시(이제 없다 — 도쿄 · 뉴욕은 2026-11-20, 로마 · 파리 · 런던 · 베이징 · 이스탄불 · 카이로 · 리우데자네이루는 2026-11-21 설계, 「설계 전」 판은 설계표를 가로채 리우를 미정으로 되돌려 본다)는 「설계 전」 · 위 머리(설계된 도시 · 세계 그림 · 일상컷 수) · 세계 고르개는 그 세계 칸만 강조 · 44px · 넘침 0 · 대비 4.5 · 콘솔 0 · 장식 영어 대문자 없음.
   줄 누르기: 설계 전이면 짧은 안내(주소 그대로), 서울이면 ?city=seoul 무대 → 돌아오면 도감.
   가짜 등록부(data/img.json 을 가로채기 — 실제 파일은 고치지 않는다): 서울 판타지 세계 그림 + 일상컷 둘(오늘) · 스팀펑크 그림(어제) · 사이버펑크 그림(사흘 전), ?today= 로 날짜를 정한다 —
   작은 그림 칸 · 일상컷 수 · 새 그림 점(오늘 · 어제만) · 그림 칸 → 한 장 · 줄을 열면 점 꺼짐 · 새로 고쳐도 꺼진 채 · 「새 그림 모두 확인」 · 날짜가 지나면 점 없음.
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright> ESM_DIR=<preact 사본> node tests/dex-screen.cjs   (SHOT_DIR 이 있으면 사진) */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const H = require('./lib/harness.cjs');
const D = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/city-design.json'), 'utf8')), S = JSON.parse(fs.readFileSync(path.join(H.ROOT, 'data/style.json'), 'utf8'));
const WORLDS = ['fantasy', 'steampunk', 'cyberpunk'], READY = D.cities.filter(c => Object.keys(c.worlds || {}).length).map(c => c.key);
const TEXT = '.th-dex h2, .th-stats b, .th-stats span, .th-legend, .th-tk-cols span, .th-tk-name b, .th-tk-name small, .th-seat.is-empty, .th-count b, .th-count small, .th-new, .th-seat-n, .th-tab, .th-worlds button';
const rgb = hex => 'rgb(' + hex.match(/[0-9a-f]{2}/gi).map(x => parseInt(x, 16)).join(', ') + ')';
const smallTargets = p => p.$$eval('button, a, select', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 44 || r.height < 44); }).map(e => e.outerHTML.slice(0, 90)));
const calm = p => p.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect && a.effect.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
/* 가짜 등록부 */
const DAY = '2026-11-19', ST = S.default, F = n => 'seoul_' + n + '_' + ST + '_f.webp';
const FAKE = { img: { seoul: { byStyle: { [ST]: { byForm: {
  fantasy: { f: F('fantasy'), casual: { f: [F('fantasy').replace('.webp', '_casual1.webp'), F('fantasy').replace('.webp', '_casual2.webp')] } },
  steampunk: { f: F('steampunk') }, cyberpunk: { f: F('cyberpunk') } } } } } },
  added: { [F('fantasy')]: DAY, [F('fantasy').replace('.webp', '_casual1.webp')]: DAY, [F('fantasy').replace('.webp', '_casual2.webp')]: DAY, [F('steampunk')]: '2026-11-18', [F('cyberpunk')]: '2026-11-16' },
  count: 5, where: {} };
const HF = 'seoul-haechi_fantasy_' + ST + '_f';
const FAKE_LM = JSON.parse(JSON.stringify(FAKE)); FAKE_LM.added[HF + '_casual1.webp'] = DAY; FAKE_LM.img['seoul-haechi'] = { byStyle: { [ST]: { byForm: { fantasy: { f: HF + '.webp', casual: { f: [HF + '_casual1.webp', HF + '_casual2.webp'] } } } } } };
const fakeLM = [{ url: /\/data\/img\.json/, body: JSON.stringify(FAKE_LM), contentType: 'application/json' }];
const fake = [{ url: /\/data\/img\.json/, body: JSON.stringify(FAKE), contentType: 'application/json' }];
/* 설계 전 판 — 설계표 사본에서 리우만 미정({})으로(2026-11-21 리우까지 열 곳 모두 설계) */
const DPRE = JSON.parse(JSON.stringify(D)); DPRE.cities.find(c => c.key === 'rio').worlds = {};
const PRE = [{ url: /\/data\/city-design\.json/, body: JSON.stringify(DPRE), contentType: 'application/json' }];
const newSeats = p => p.$$eval('.th-ticket .th-seat .th-new', es => es.map(e => e.closest('.th-ticket').dataset.city + ':' + e.closest('.th-seat').dataset.world));

(async () => {
  const srv = await H.serve(), br = await H.launch(), fonts = !!process.env.SHOT_DIR;
  /* 등록부는 늘 빈 것으로(2026-11-20 — GPT 가 서울 사이버펑크를 올려 진짜 등록부가 차기 시작했다. 그림 있는 판은 칸마다 따로 fulfill) */
  const EMPTY_IMG = { url: /\/data\/img\.json/, body: JSON.stringify({ img: {}, added: {}, count: 0, where: {} }), contentType: 'application/json' };
  const open = (url, o = {}) => H.open(br, srv.base, url, Object.assign({ touch: true, fonts }, o, { fulfill: (o.fulfill || []).concat(EMPTY_IMG) }));
  let checks = 0;
  try {
    /* 여섯 판 — 등록부 그대로(비어 있다: Review Focus 4 — 그림이 하나도 없는 도시) */
    for (const w of WORLDS) for (const t of ['dark', 'light']) {
      const o = await open('/index.html?tab=dex&w=' + w), p = o.page, at = w + '-' + t;
      if (t === 'light') { await p.evaluate(() => localStorage.setItem('city_room_v1', 'light')); await p.reload(); }
      await p.waitForSelector('.th-ticket'); await p.evaluate(() => document.fonts.ready); await calm(p);
      assert.equal(await p.getAttribute('.th-tab[data-tab="dex"]', 'aria-current'), 'page', at + ' 도감 탭');
      assert.equal(await p.locator('.th-worlds button').count(), 3, at + ' 세계 고르개'); assert.equal(await p.locator('.th-head .tb-open').count(), 1, at + ' 도구 단추');
      const rows = await p.$$eval('.th-ticket', ts => ts.map(t => ({ city: t.dataset.city, stub: getComputedStyle(t.querySelector('.th-stub')).backgroundImage, name: t.querySelector('.th-tk-name b').textContent,
        country: t.querySelector('.th-tk-name small').textContent, seats: [...t.querySelectorAll('.th-seat')].map(s => ({ w: s.dataset.world, cls: s.className, tag: s.tagName, href: s.getAttribute('href'), text: s.textContent })),
        count: t.querySelector('.th-count b').textContent })));
      assert.deepEqual(rows.map(r => r.city), D.cities.map(c => c.key), at + ' 도시 10줄(설계표 차례)');
      for (const r of rows) {
        const c = D.cities.find(x => x.key === r.city);
        assert(r.stub.startsWith('linear-gradient(' + rgb(c.palette.hex[0])), at + ' ' + r.city + ' 색 띠 = palette.hex[0] ' + r.stub.slice(0, 60));
        c.palette.hex.forEach(x => assert(r.stub.includes(rgb(x)), at + ' ' + r.city + ' 띠에 상징 색 셋'));
        assert.equal(r.name, c.ko); assert.equal(r.country, c.country);
        assert.deepEqual(r.seats.map(s => s.w), WORLDS, at + ' ' + r.city + ' 세계 세 칸');
        assert.equal(r.count, '0', at + ' 일상컷 수 0');
        for (const s of r.seats) {
          assert.equal(/is-cur/.test(s.cls), s.w === w, at + ' 고른 세계 칸만 강조 ' + r.city + ':' + s.w);
          if (READY.includes(r.city)) {
            assert(/is-empty/.test(s.cls) && s.tag === 'A' && s.href === 'prompt.html?card=' + r.city + '&o=world&world=' + s.w, at + ' 그림 없음 → 생성기 길 ' + JSON.stringify(s));
            assert.equal(s.text.replace(/\s/g, ''), '그림없음');
          } else { assert(/is-pre/.test(s.cls) && s.tag === 'SPAN' && !s.href, at + ' 설계 전 칸 ' + r.city); assert.equal(s.text.replace(/\s/g, ''), '설계전'); }
        }
      }
      assert.deepEqual(READY, ['seoul', 'tokyo', 'beijing', 'paris', 'london', 'rome', 'newyork', 'istanbul', 'cairo', 'rio', 'busan', 'bangkok', 'barcelona', 'sydney', 'mexicocity', 'daejeon', 'venice', 'prague', 'dubai', 'hongkong', 'sanfrancisco'], '설계된 도시는 스물한 곳 모두(다섯 도시 2026-11-25 · 대전 2026-11-23 · 도쿄 · 뉴욕 2026-11-20 · 로마 · 파리 · 런던 · 베이징 · 이스탄불 · 카이로 · 리우데자네이루 2026-11-21)');
      assert.deepEqual(await p.$$eval('.th-stats b', bs => bs.map(b => b.textContent.replace(/\s/g, ''))), [READY.length + '/21', '0/63', '0'], at + ' 위 머리');
      assert.equal(await p.locator('.th-new').count(), 1, at + ' 새 그림 점은 범례 하나뿐');
      assert.match(await p.getAttribute('.th-tk-cols span.is-cur', 'style'), new RegExp('--w-' + w + '\\)'), at + ' 고른 세계 머리 강조');
      assert.deepEqual(await smallTargets(p), [], at + ' 44px');
      assert(await H.noOverflow(p), at + ' 가로 넘침');
      for (const [txt, c] of await H.contrast(p, TEXT)) assert(c >= 4.5, at + ' 대비 ' + c + ' — ' + txt);
      assert(!/[A-Z]{3,}/.test(await p.evaluate(() => document.body.innerText)), at + ' 장식 영어 대문자');
      if ((w === 'fantasy' && t === 'dark') || (w === 'cyberpunk' && t === 'light')) await H.shot(p, 'dex-' + at);
      assert.deepEqual(o.errors, [], at + ' 콘솔'); checks += 14; await o.ctx.close();
    }

    /* 줄 누르기 — 설계 전은 짧은 안내, 서울은 무대(돌아오면 도감). 2026-11-21 리우까지 열 곳이 다 설계돼 설계표(data/city-design.json)를 가로채 리우를 미정({})으로 되돌린다 — 실제 파일은 안 고친다 */
    { const o = await open('/index.html?tab=dex&w=fantasy', { fulfill: PRE }), p = o.page; await p.waitForSelector('.th-ticket');
      for (const wk of WORLDS) { const c = await p.getAttribute('.th-ticket[data-city="rio"] .th-seat[data-world="' + wk + '"]', 'class'); assert(/is-pre/.test(c), '가로챈 설계표 — 리우 ' + wk + ' 설계 전 칸'); }
      assert.deepEqual(await p.$$eval('.th-stats b', bs => bs.map(b => b.textContent.replace(/\s/g, ''))).then(x => x[0]), (READY.length - 1) + '/21', '가로챈 설계표 — 설계된 도시 스물(리우만 비움)');
      await p.tap('.th-ticket[data-city="rio"] .th-seat[data-world="steampunk"]');   /* 설계 전 예 — 사본의 리우 */
      assert.match(await p.textContent('.th-ticket[data-city="rio"] .th-tk-note'), /리우데자네이루.*설계 전/, '설계 전 줄 — 짧은 안내');
      assert.equal(await p.evaluate(() => location.search), '?tab=dex&w=fantasy', '설계 전 줄은 주소 그대로');
      await p.tap('.th-ticket[data-city="rio"] .th-tk-name'); assert.equal(await p.locator('.th-tk-note').count(), 0, '다시 누르면 안내 닫힘');
      await p.tap('.th-ticket[data-city="seoul"] .th-count');
      await p.waitForSelector('.th-role'); assert.equal(await p.locator('.th-role').count(), 3, '서울 무대 세 칸');
      assert.equal(await p.evaluate(() => location.search), '?tab=dex&city=seoul&w=fantasy');
      assert.equal(await p.textContent('.th-back'), '← 전체 도감');
      await p.tap('.th-back'); await p.waitForSelector('.th-ticket');
      assert.equal(await p.evaluate(() => location.search), '?tab=dex&w=fantasy', '돌아오면 도감');
      /* 세계 고르개 — 도감은 세 세계를 다 보이고 강조만 옮긴다 */
      await p.tap('.th-worlds [data-world="cyberpunk"]');
      assert.deepEqual(await p.$$eval('.th-ticket[data-city="seoul"] .th-seat', ss => ss.map(s => s.classList.contains('is-cur'))), [false, false, true], '세계 고르개 → 그 칸 강조');
      assert.equal(await p.locator('.th-seat').count(), D.cities.length * 3, '세 세계 다');
      assert.deepEqual(o.errors, [], '줄 누르기 콘솔'); checks += 9; await o.ctx.close(); }

    /* 랜드마크 일상컷은 그 도시 줄 일상컷 수에 더한다 */
    { const o = await open('/index.html?tab=dex&today=' + DAY, { fulfill: fakeLM }), p = o.page; await p.waitForSelector('.th-ticket');
      assert.equal(await p.textContent('.th-ticket[data-city="seoul"] .th-count b'), '4', '서울 일상컷 = 도시 2 + 해치 2');
      await p.tap('.th-head .tb-open'); assert.equal(await p.textContent('.tb-seen'), '새 그림 모두 확인 5', '랜드마크 새 일상컷도 센다(도시 넷 + 해치 하나)'); checks += 2; await o.ctx.close(); }
    /* 랜드마크 새 그림 표시(2026-11-22) — 도감 서울 줄 이름 밑 「랜드마크 새」 · 도시 무대 해치 판타지 칸 점(도시를 열어도 안 꺼짐) · 해치 그림을 열면 꺼짐 */
    { const o = await open('/index.html?tab=dex&today=' + DAY, { fulfill: fakeLM }), p = o.page; await p.waitForSelector('.th-ticket');
      assert.equal(await p.textContent('.th-ticket[data-city="seoul"] .th-new-mark'), '랜드마크 새', '도감 서울 줄 — 랜드마크 새');
      assert.equal(await p.locator('.th-new-mark').count(), 1, '랜드마크 새는 서울 줄 하나뿐');
      await p.tap('.th-ticket[data-city="seoul"] .th-tk-name'); await p.waitForSelector('.th-marks');
      assert.equal(await p.locator('.th-mark[data-card="seoul-haechi"] .th-mark-fig .th-new').count(), 1, '무대 해치 칸에 새 점 — 도시를 열어도 안 꺼짐');
      assert.deepEqual(await smallTargets(p), [], '랜드마크 줄 44px'); assert(await H.noOverflow(p), '랜드마크 점 넘침 없음');
      await p.tap('.th-mark[data-card="seoul-haechi"] .th-mark-fig'); await p.waitForSelector('.th-card'); await p.waitForFunction(() => /seoul-haechi_/.test(localStorage.getItem('city_seen_v1') || ''));
      await p.goto(srv.base + '/index.html?tab=dex&today=' + DAY); await p.waitForSelector('.th-ticket');
      assert.equal(await p.locator('.th-new-mark').count(), 0, '해치를 열면 랜드마크 새가 꺼진다');
      assert.deepEqual(o.errors, [], '랜드마크 새 콘솔'); checks += 6; await o.ctx.close(); }

    /* 가짜 등록부 — 그림 · 일상컷 · 새 그림 점 · 열면 꺼짐 · 새로 고쳐도 · 한 장 */
    { const o = await open('/index.html?tab=dex&w=fantasy&today=' + DAY, { fulfill: fake }), p = o.page; await p.waitForSelector('.th-seat.has-pic'); await p.evaluate(() => document.fonts.ready);
      const seats = await p.$$eval('.th-ticket[data-city="seoul"] .th-seat', ss => ss.map(s => ({ w: s.dataset.world, tag: s.tagName, img: (s.querySelector('img') || {}).src || '', n: (s.querySelector('.th-seat-n') || {}).textContent || '' })));
      WORLDS.forEach((w, i) => { assert.equal(seats[i].tag, 'BUTTON', w + ' 그림 칸'); assert(seats[i].img.endsWith('/thumb/' + F(w)), w + ' 작은 그림 ' + seats[i].img); });
      assert.deepEqual(seats.map(s => s.n), ['2', '', ''], '세계별 일상컷 수');
      assert.equal(await p.textContent('.th-ticket[data-city="seoul"] .th-count b'), '2', '서울 일상컷 수');
      assert.deepEqual(await p.$$eval('.th-stats b', bs => bs.map(b => b.textContent.replace(/\s/g, ''))), [READY.length + '/21', '3/63', '2'], '위 머리 — 설계된 도시 · 그림 셋 · 일상컷 둘');
      assert.deepEqual(await newSeats(p), ['seoul:fantasy', 'seoul:steampunk'], '새 그림 점 — 오늘 · 어제만(사흘 전 사이버펑크는 아님)');
      assert.deepEqual(await smallTargets(p), [], '그림 칸 44px'); assert(await H.noOverflow(p), '그림 칸 넘침');
      for (const [txt, c] of await H.contrast(p, '.th-new, .th-seat-n, .th-count b')) assert(c >= 4.5, '새 점 대비 ' + c + ' — ' + txt);
      await calm(p); await H.shot(p, 'dex-fake-fantasy-dark');
      // 도구 상자 수
      await p.tap('.th-head .tb-open'); assert.equal(await p.textContent('.tb-seen'), '새 그림 모두 확인 4', '새 그림 넷(세계 그림 둘 · 일상컷 둘)');
      await p.keyboard.press('Escape'); await p.waitForSelector('.tb-sheet', { state: 'detached' });
      // 그림 칸 → 한 장, 줄(무대)을 열었으니 점 꺼짐
      await p.tap('.th-ticket[data-city="seoul"] .th-seat[data-world="fantasy"]'); await p.waitForSelector('.th-card');
      assert.equal(await p.evaluate(() => location.search), '?tab=dex&city=seoul&card=seoul&pic=' + encodeURIComponent(F('fantasy')) + '&w=fantasy', '그림 칸 → 한 장');
      await p.goBack(); await p.waitForSelector('.th-ticket');
      assert.deepEqual(await newSeats(p), [], '열어 보면 점이 꺼진다');
      await p.reload(); await p.waitForSelector('.th-seat.has-pic');
      assert.deepEqual(await newSeats(p), [], '새로 고쳐도 꺼진 채');
      await p.tap('.th-head .tb-open'); assert.equal(await p.textContent('.tb-seen'), '새 그림 모두 확인 0'); assert(await p.locator('.tb-seen').isDisabled(), '없으면 누를 수 없다');
      assert.deepEqual(o.errors, [], '가짜 등록부 콘솔'); checks += 15; await o.ctx.close(); }

    /* 「새 그림 모두 확인」 · 날짜가 지나면 점 없음 */
    { const o = await open('/index.html?tab=dex&w=steampunk&today=' + DAY, { fulfill: fake }), p = o.page; await p.waitForSelector('.th-seat.has-pic');
      assert.equal((await newSeats(p)).length, 2, '새 기기 — 점 둘');
      await p.tap('.th-head .tb-open'); await p.tap('.tb-seen');
      assert.equal(await p.textContent('.tb-seen'), '새 그림 모두 확인 0', '모두 확인 뒤 0');
      assert.deepEqual(await smallTargets(p), [], '도구 상자 44px');
      await p.keyboard.press('Escape'); await p.waitForSelector('.tb-sheet', { state: 'detached' });
      assert.deepEqual(await newSeats(p), [], '모두 확인 — 점 꺼짐');
      await p.reload(); await p.waitForSelector('.th-seat.has-pic'); assert.deepEqual(await newSeats(p), [], '모두 확인 — 새로 고쳐도');
      const q = await o.ctx.newPage(); await q.goto(srv.base + '/index.html?tab=dex&today=2026-11-21'); await q.waitForSelector('.th-seat.has-pic');
      await q.evaluate(() => localStorage.removeItem('city_seen_v1')); await q.reload(); await q.waitForSelector('.th-seat.has-pic');
      assert.deepEqual(await newSeats(q), [], '이틀 지나면 새 그림 아님');
      assert.deepEqual(o.errors, [], '모두 확인 콘솔'); checks += 6; await o.ctx.close(); }

    /* PC 1280 — 깨지지 않음 */
    { const o = await open('/index.html?tab=dex&w=fantasy&today=' + DAY, { viewport: H.WIDE, touch: false, fulfill: fake }), p = o.page; await p.waitForSelector('.th-seat.has-pic');
      assert.equal(await p.locator('.th-ticket').count(), D.cities.length); assert(await H.noOverflow(p), '1280 넘침');
      const box = await p.$$eval('.th-ticket', ts => ts.map(t => t.getBoundingClientRect()).map(r => [Math.round(r.width), Math.round(r.height)]));
      assert(box.every(([w, h]) => w === box[0][0] && h >= 52 && h < 80), '1280 표 한 장 꼴 ' + JSON.stringify(box));
      const nameFit = await p.$$eval('.th-tk-name b', bs => bs.every(b => b.scrollWidth <= b.clientWidth + 1));
      assert(nameFit, '도시 이름이 잘리지 않음');
      await H.shot(p, 'dex-1280');
      assert.deepEqual(o.errors, [], '1280 콘솔'); checks += 5; await o.ctx.close(); }
    /* 폴드 덮개에서도 이름이 잘리지 않음(리우데자네이루) */
    { const o = await open('/index.html?tab=dex&w=fantasy'), p = o.page; await p.waitForSelector('.th-ticket'); await p.evaluate(() => document.fonts.ready);
      assert(await p.$$eval('.th-tk-name b', bs => bs.every(b => b.scrollWidth <= b.clientWidth + 1)), '344 도시 이름이 잘리지 않음');
      await o.ctx.close(); checks += 1; }
  } finally { await br.close(); srv.close(); }
  console.log('PASS 도감: 여섯 판(10줄 · 색 띠 · 세 칸 · 그림 없음 → 생성기 · 설계 전 · 머리 · 세계 강조 · 44px · 넘침 · 대비 · 콘솔) · 줄 누르기 · 가짜 등록부(그림 · 일상컷 · 새 점 · 열면 꺼짐 · 새로 고침 · 모두 확인 · 날짜) · 1280 — ' + checks + '가지');
})().catch(e => { console.error(e); process.exit(1); });
