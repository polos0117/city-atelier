/* 화면 검사 — 화풍 비교 · 생성기를 브라우저로 연다. 폴드 덮개(344×882)와 PC(1280).
   도시 꼴(2026-11-19 Task 3): 생성기는 도시 › 갈래 › 단계. 세계 그림은 세계 → 장면 → 자세 · 표정 → 실루엣 → 설계 줄 → 외형 → 덧붙임 → 다 골랐다 —
   화면이 지은 지시문이 node 쪽 조립기(lib/prompt-city.js)와 글자 하나 다르지 않다. 도시 판은 열 곳(설계 미정은 누를 수 없다 — 2026-11-21 열 곳 모두 설계돼 설계표를 가로챈 사본으로 본다), 화풍 고르개(내린 화풍 빠짐), 주소 ?card=&o=&world=,
   폰 칩 레일 · 아래 막대 · 시트, 새로 고쳐도 남음, 옆 넘침 없음, 콘솔 오류 없음.
   일상컷(Task 4): 세계 → 시대 → 장소(서울 생활 장면) → … 한 칸씩 · 화면 지시문 = 조립기(생활 장면표 · 세계 소품 사전) · 그 세계 장면 글 · 금지 낱말은 Avoid 단락만 ·
   손에 드는 그 도시의 물건 · 해방 · 랜덤 · 여기부터 다시 · 처음부터 다시 · 파일 이름 · 주소.
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright 가 든 node_modules> node tests/screen.cjs   (ESM_DIR — preact 사본, 비면 tests/lib/harness.cjs 의 기본 자리 · SHOT_DIR 이 있으면 사진) */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const H = require('./lib/harness.cjs'), ROOT = H.ROOT;
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const D = JSON.parse(read('data/city-design.json')), S = JSON.parse(read('data/style.json'));
const { T, P } = (() => { const c = { window: {} }; vm.createContext(c); for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(read(f), c); return { T: c.window.AtelierSpec, P: c.window.AtelierPrompt }; })();
const TREE = JSON.parse(read('data/casual-tree.json')), TREE2 = JSON.parse(read('data/casual-tree-v2.json')), LIFE = JSON.parse(read('data/city-life.json')), PROPS = JSON.parse(read('data/world-props.json'));
const casualOf = (scene, world) => P.buildCasual(D, S, 'seoul', scene, { world, style: DEF, tree: TREE, tree2: TREE2, life: LIFE, props: PROPS });
const LIVE = Object.keys(S.styles).filter(k => !S.styles[k].retired), DEF = S.default;
const lineOf = (txt, head) => (String(txt).split('\n').find(l => l.startsWith(head)) || '');

(async () => {
  const srv = await H.serve(), br = await H.launch();
  let checks = 0;
  try {
    for (const vp of [H.COVER, H.WIDE]) {
      const mob = vp.width <= 768, open = url => H.open(br, srv.base, url, { viewport: vp });
      const state = pg => pg.evaluate(() => window.AtelierStudio.state());
      const openOf = async pg => (await state(pg)).open;
      const promptOf = pg => pg.evaluate(() => window.AtelierStudio.prompt());
      const menu = async pg => { const m = pg.locator('[data-menu="rand"]'); if (await m.count()) await m.click(); };
      const randAll = async (pg, k) => { await menu(pg); await pg.click('[data-rand-all="' + k + '"]'); };
      /* 고르기 — 폰에서 묶음 탭에 가려져 있으면 「전체」 탭을 누르고 */
      const pick = async (pg, v) => { const o = pg.locator('#panel .opt[data-pick="' + v + '"]'); if (!(await o.count()) && (await pg.locator('#panel [data-gtab=""]').count())) await pg.click('#panel [data-gtab=""]'); await pg.click('#panel .opt[data-pick="' + v + '"]'); };
      const next = async (pg, k) => { if (mob) await pg.click('#hbar [data-next="' + k + '"]'); else await pg.click('#panel [data-next="' + k + '"]'); };
      /* 다 골랐다로 — 「다 골랐다로」 단추가 있으면 그것, 없으면 남은 칸을 다음 · 건너뛰기로 */
      const toDone = async pg => {
        for (let i = 0; i < 12 && (await openOf(pg)) !== 'done'; i++) {
          if (await pg.locator('#panel [data-open="done"]').count()) { await pg.click('#panel [data-open="done"]'); continue; }
          const m = pg.locator('[data-menu="rand"]');
          if (await m.count()) { await m.click(); if (await pg.locator('#hbar .hmenu [data-open="done"]').count()) { await pg.click('#hbar .hmenu [data-open="done"]'); continue; } await m.click(); }
          const nx = pg.locator('#hbar [data-skip], #hbar [data-next], #panel [data-next]').first();
          assert(await nx.count(), '넘길 단추가 없다 — ' + (await openOf(pg)));
          await nx.click();
        }
        assert.equal(await openOf(pg), 'done', '다 골랐다에 못 갔다');
      };

      /* 화풍 비교 — 도구 막대에 화풍, 묶음이 없으면 빈 안내(서울 묶음은 Task 11) */
      { const SC = JSON.parse(read('data/style-compare.json')), sv = await open('/styles.html');
        await sv.page.waitForSelector('.sc-lede');
        await sv.page.waitForFunction(() => !/불러오는/.test(document.querySelector('.sc-lede').innerText));   /* 2026-11-20 — 불러오는 중 글에서 단언해 가끔 깨졌다 */
        assert.equal(await sv.page.locator('h1.tb-name').textContent(), '화풍', '화풍 도구 막대');
        if (!SC.rounds.length) { assert.equal(await sv.page.locator('.sc-cell').count(), 0, '묶음 없음 — 빈 안내'); assert.match(await sv.page.locator('.sc-lede').innerText(), /화풍 시험 전/, '빈 안내 말'); }
        assert.deepEqual(SC.worlds, ['fantasy', 'steampunk', 'cyberpunk'], '화풍 비교 세계 셋');
        assert(await H.noOverflow(sv.page), vp.width + ' 화풍 비교 넘침'); assert.deepEqual(sv.errors, [], '화풍 비교 콘솔'); checks += 4; await sv.ctx.close(); }

      /* 생성기 화풍 고르개 — 맨 위 기본(''), 내린 화풍은 목록 · 주소 · 기억값에서 빠진다(폰에서만) */
      if (mob) {
        const gv = await open('/prompt.html?card=seoul&o=world&world=fantasy'), gp = gv.page; await gp.waitForSelector('.hchip');
        const ov = await gp.$$eval('#st-style option', os => os.map(o => o.value));
        assert.equal(ov[0], '', '화풍 맨 위는 기본'); assert.deepEqual(ov.slice(1).sort(), LIVE.filter(k => k !== DEF).sort(), '화풍 목록 — 살아 있는 화풍만');
        const d0 = await promptOf(gp);
        assert.equal(d0, P.build(D, S, 'seoul', 'fantasy', { style: DEF }), '주소대로 서울 판타지 — 기본 화풍 지시문');
        const other = LIVE.find(k => k !== DEF);
        await gp.selectOption('#st-style', other); assert.equal(await promptOf(gp), P.build(D, S, 'seoul', 'fantasy', { style: other }), '고른 화풍 지시문');
        await gp.selectOption('#st-style', ''); assert.equal(await promptOf(gp), d0, '기본으로 돌아옴');
        await gp.goto(srv.base + '/prompt.html?card=seoul&o=world&world=fantasy&style=game_keyart'); await gp.waitForSelector('.hchip');
        assert.equal((await state(gp)).style, DEF, '지운 화풍 주소(game_keyart, 2026-11-20 지움) — 기본 화풍으로 짓는다');
        /* 옛 세계(mecha)가 주소로 와도 버린다 — 조립기가 던지지 않게 */
        await gp.goto(srv.base + '/prompt.html?card=seoul&o=world&world=mecha'); await gp.waitForSelector('.hchip');
        assert.equal((await state(gp)).world, '', '세계 mecha 주소는 버린다'); assert.equal(await openOf(gp), 'world', '세계 칸부터');
        /* 랜드마크 카드 — 주소가 그대로 열리고 고르개에 서울 바로 아래 */
        await gp.goto(srv.base + '/prompt.html?card=seoul-haechi&o=world&world=fantasy'); await gp.waitForSelector('.hchip');
        assert.equal(await promptOf(gp), P.build(D, S, 'seoul-haechi', 'fantasy', { style: DEF }), '해치 주소 지시문');
        await gp.click('[data-open="city"]');
        const ck = await gp.$$eval('#panel [data-city]', bs => bs.map(b => b.dataset.city)); assert.equal(ck[ck.indexOf('seoul') + 1], 'seoul-haechi', '서울 바로 아래 해치');
        assert.match(await gp.locator('#panel [data-city="seoul-haechi"]').innerText(), /서울 › 해치/, '랜드마크 줄 글');
        assert.deepEqual(gv.errors, [], '생성기 화풍 콘솔'); checks += 11; await gv.ctx.close();
      }

      /* 도시 판 — 처음 오면 도시부터. 열 곳, 설계 미정은 누를 수 없다(2026-11-21 리우까지 열 곳이 다 설계돼 실제 표엔 미정이 없다 — 미정 칸은 아래에서 설계표를 가로채 리우를 {} 로 되돌려 본다) */
      const v = await open('/prompt.html'), p = v.page;
      await p.evaluate(() => localStorage.removeItem('city_studio_v1')); await p.reload(); await p.waitForSelector('#panel .opt');
      assert.equal(await openOf(p), 'city', '처음은 도시 판');
      assert.equal(await p.locator('#panel .opt[data-city]').count(), P.cards(D).length, '카드 칸(도시 + 랜드마크)');
      assert.equal(await p.locator('#panel .opt[data-city][disabled]').count(), D.cities.filter(c => !P.worldsOf(D, c.key).length).length, '설계 미정은 누를 수 없다');
      assert.equal(D.cities.filter(c => !P.worldsOf(D, c.key).length).length, 0, '열 곳 모두 설계(리우데자네이루 2026-11-21)');
      assert.doesNotMatch(await p.locator('#panel .opt[data-city="rio"]').textContent(), /설계 미정/, '리우는 설계됨');
      { const DPRE = JSON.parse(JSON.stringify(D)); DPRE.cities.find(c => c.key === 'rio').worlds = {};
        const pv = await H.open(br, srv.base, '/prompt.html', { viewport: vp, fulfill: [{ url: /\/data\/city-design\.json/, body: JSON.stringify(DPRE), contentType: 'application/json' }] }), pp = pv.page;
        await pp.waitForSelector('#panel .opt');
        assert.equal(await pp.locator('#panel .opt[data-city][disabled]').count(), 1, '가로챈 설계표 — 설계 미정 하나(리우)는 누를 수 없다');
        assert(await pp.locator('#panel .opt[data-city="rio"]').isDisabled(), '가로챈 설계표 — 리우 칸이 막힘');
        assert.match(await pp.locator('#panel .opt[data-city="rio"]').textContent(), /설계 미정/, '설계 미정 표시');
        assert.deepEqual(pv.errors, [], '가로챈 설계표 판 콘솔'); await pv.ctx.close(); }
      await p.click('#panel .opt[data-city="seoul"]'); assert.equal(await openOf(p), 'out', '도시 다음 갈래');
      await p.click('[data-out="world"]'); assert.equal(await openOf(p), 'world', '갈래 다음 세계');
      assert.deepEqual(await p.$$eval('#panel .opt[data-pick]', os => os.map(o => o.dataset.pick)), D.vocab.worlds, '세계 셋(mecha 없음)');
      /* 세계 그림 — 사이버펑크: 장면(설계표 셋 + 고르지 않음) · 시간대 → 자세 · 표정 → 실루엣 → 설계 줄 → 외형 → 덧붙임 */
      await p.click('#panel .opt[data-pick="cyberpunk"]'); assert.equal(await openOf(p), 'scene', '세계 다음 장면');
      const cw = D.cities.find(c => c.key === 'seoul').worlds.cyberpunk;
      assert.equal(await p.locator('#panel .opt[data-pick]').count(), 1 + cw.scenes.length, '장면 선택지');
      await p.selectOption('#panel select[data-shot="time"]', 'night');
      await p.click('#panel .opt[data-pick="alley"]'); assert.equal(await openOf(p), 'pose', '장면 다음 자세');
      assert((await p.locator('.hchip[data-open="scene"]').textContent()).includes(cw.scenes[2].ko), '장면 칩');
      await p.selectOption('#panel select[data-shot="expr"]', 'confident');
      await p.click('#panel .opt[data-pick="stride"]'); assert.equal(await openOf(p), 'sil', '자세 다음 실루엣');
      assert.equal(await p.locator('#panel .opt[data-pick]').count(), 2 + T.SILHOUETTES.cyberpunk.length, '실루엣 — 고르지 않음 · 자유 + 사이버펑크 갈래');
      await p.click('#panel .opt[data-pick="long_raincoat"]'); assert.equal(await openOf(p), 'design', '실루엣 다음 설계 줄');
      assert.equal(await p.locator('#panel [data-lookcheck]').count(), 2, '실루엣 · 얼굴 싣기');
      assert((await p.locator('#panel .design-list').first().textContent()).includes(T.VOCAB_EN.hair_color[cw.look.silhouette.hair_color]), '설계표 머리색이 목록에');
      assert((await p.locator('#panel .note').first().textContent()).includes(cw.look.why.slice(0, 12)), '왜 이 외형인가 — 그 세계의 why');
      await p.selectOption('#panel select[data-exposure]', 'moderate');
      await p.uncheck('#panel [data-lookcheck="face"]');
      await next(p, 'design'); assert.equal(await openOf(p), 'look', '설계 줄 다음 외형');
      assert.equal(await p.locator('#panel details.grp').count(), 4, '외형 네 묶음');
      await p.evaluate(() => { document.querySelector('#panel details.grp[data-grp="hair"]').open = true; });
      await p.selectOption('#panel select[data-param="hair color"]', 'silver');
      await next(p, 'look'); assert.equal(await openOf(p), 'notes', '외형 다음 덧붙임');
      await p.fill('textarea[data-note="scene"]', 'a windy ridge');
      await next(p, 'notes'); assert.equal(await openOf(p), 'done');
      const t0 = await promptOf(p);
      assert.equal(t0, P.build(D, S, 'seoul', 'cyberpunk', { style: DEF, notes: { scene: 'a windy ridge' }, look: { params: { 'hair color': 'silver' }, faceDesignOn: false, silhouetteOn: true, exposure: 'moderate' },
        shot: { scene: 'alley', time: 'night', pose: 'stride', expr: 'confident', frame: 'long_raincoat' } }), '화면 지시문 = 조립기(고른 칸 전부)');
      assert(t0.includes(cw.scenes[2].en) && t0.includes(T.SILHOUETTES.cyberpunk[0].en) && /Exposure \(moderate\)/.test(t0) && !lineOf(t0, 'Face — her own: ') && t0.includes('hair color: silver'), '고른 칸이 지시문에');
      assert((await p.locator(mob ? '.hres .file' : '#file-name').textContent()).includes('seoul_cyberpunk_' + DEF + '_f.webp'), '파일 이름');
      /* 다 고른 뒤 세계를 바꾸면 바로 다음 칸 — 그 세계 몫 칸은 따로(판타지는 기본) */
      await p.click('[data-open="world"]'); await p.click('[data-pick="fantasy"]');
      assert.equal(await openOf(p), 'scene', '다 고른 뒤 고쳐도 바로 다음 칸');
      await toDone(p);
      const tf = await promptOf(p), fw = D.cities.find(c => c.key === 'seoul').worlds.fantasy;
      assert.equal(tf, P.build(D, S, 'seoul', 'fantasy', { style: DEF }), '판타지는 기본 설정 그대로');
      assert(tf.includes(fw.motif.en) && tf.includes(fw.scenes[0].en), '판타지 motif · 첫 장면');
      assert.match(p.url(), /card=seoul&o=world&world=fantasy/, '주소에 적힌다');
      checks += 24;
      /* 갈래 → 일상컷(버전2, Task 4): 세계(참고 그림이 되는 세계 그림)부터 한 칸씩 — 서울 생활 장면 · 그 세계 소품 */
      await p.click('[data-open="out"]'); await p.click('[data-out="casual"]');
      assert.equal(await openOf(p), 'world', '일상컷은 참고 그림의 세계부터');
      assert.equal(await p.locator('#panel .opt[data-pick="fantasy"][aria-pressed="true"]').count(), 1, '세계 그림 갈래에서 고른 세계가 눌려 있다');
      await p.click('#panel .opt[data-pick="fantasy"]'); assert.equal(await openOf(p), 'era', '세계 다음 시대');
      assert.equal(await p.locator('#panel .opt[data-pick]').count(), 1, '시대는 하나 — 그 세계의 하루');
      await p.click('#panel .opt[data-pick="now"]'); assert.equal(await openOf(p), 'place', '다음은 장소');
      assert((await p.locator('#panel .opt[data-pick]').count()) > 20, '장소 목록');
      await pick(p, 'seoul_pojangmacha'); assert.equal(await openOf(p), 'weather', '다음은 계절·날씨');
      await p.click('#panel .opt[data-pick=""]'); assert.equal(await openOf(p), 'time', '날씨 다음 시간대');
      assert.equal(await p.locator('#panel .opt[data-pick="past_midnight"]').count(), 1, '시간대에 생활 장면표의 시간(한밤)');
      await p.click('#panel .opt[data-pick="past_midnight"]'); assert.equal(await openOf(p), 'ofam');
      await pick(p, 'everyday'); assert.equal(await openOf(p), 'item');
      await p.click('#panel .opt[data-pick=""]'); assert.equal(await openOf(p), 'color', '옷 다음 옷 색');
      await p.click('#panel .opt[data-pick=""]'); assert.equal(await openOf(p), 'denier', '옷 색 다음 데니어');
      await p.click('#panel .opt[data-pick=""]'); assert.equal(await openOf(p), 'situ', '데니어 다음 상황');
      await p.click('#panel .opt[data-pick=""]'); assert.equal(await openOf(p), 'hair', '상황 다음 머리 변화');
      await p.click('#panel .opt[data-pick="tied"]'); assert.equal(await openOf(p), 'preset', '머리 다음 자세 추천');
      const presetKey = await p.locator('#panel .opt[data-pick]:not([data-out])').nth(1).getAttribute('data-pick');
      await p.click('#panel .opt[data-pick="' + presetKey + '"]');
      let sc = (await state(p)).scene;
      assert(sc.posture && sc.support && sc.frame && sc.body && sc.head && sc.camera, '추천이 몸 쪽을 채웠다 ' + JSON.stringify(sc));
      /* 해방 — 몸 자세에서 트리 밖이 흐리게, 까닭이 붙는다 */
      await p.click('[data-open="posture"]');
      const unlock = p.locator('#unlock'); if (await unlock.count()) { await unlock.check(); assert((await p.locator('#panel .opt.out .why').count()) >= 1, '트리 밖 까닭'); await unlock.uncheck(); }
      await toDone(p);
      sc = (await state(p)).scene;
      const t1 = await promptOf(p), fwl = LIFE.cities.seoul.scenes.find(x => x.key === 'pojangmacha').worlds.fantasy;
      assert.equal(t1, casualOf(sc, 'fantasy'), '화면 일상컷 지시문 = 조립기(생활 장면표 · 세계 소품 사전)');
      assert(t1.includes('\nPlace: ' + fwl.en + '.\n') && fwl.props.every(k => t1.includes(PROPS.props[k].worlds.fantasy.en)) && [LIFE.times.find(x => x.key === 'past_midnight').en + '.', LIFE.times.find(x => x.key === 'past_midnight').en + '; '].some(x => lineOf(t1, 'Time of day: ').startsWith('Time of day: ' + x))   /* 2026-11-21 빛 모습이 「; …」 로 붙는다 */, '판타지 포장마차 · 그 세계 소품 · 한밤');
      const neg = t1.split('\n\n').filter(b => /^Avoid: /.test(b))[0] || '';
      assert(neg && D.vocab.markers.fantasy.banned_en.every(b => !new RegExp('\\b' + b + '\\b', 'i').test(t1.replace(neg, ''))), '판타지 금지 낱말은 Avoid 단락만');
      assert.match(await p.locator('.hchip[data-open="time"]').textContent(), /한밤/, '시간대 칩(생활 장면표)');
      /* 손에 드는 그 도시의 물건 — 오른손을 「소품 동작」 으로 하면 「그 물건을 든다」 */
      await p.click('[data-open="right"]'); await p.click('#panel .opt[data-pick="prop"]'); assert.equal(await openOf(p), 'left', '오른손 다음 왼손');
      await p.click('#panel .opt[data-pick=""]'); assert.equal(await openOf(p), 'use', '소품 동작 칸');
      if (!(await p.locator('#panel .opt[data-pick^="sig_"]').count()) && (await p.locator('#panel [data-gtab=""]').count())) await p.click('#panel [data-gtab=""]');
      assert((await p.locator('#panel .opt[data-pick^="sig_"]').count()) >= 1, '그 물건을 드는 동작 선택지');
      await p.click('#panel .opt[data-pick^="sig_"]'); await toDone(p);
      assert(lineOf(await promptOf(p), 'PROP: ').includes(D.cities.find(c => c.key === 'seoul').worlds.fantasy.hold.en), '서울 판타지의 물건(해치 금 도장)을 든다 ' + lineOf(await promptOf(p), 'PROP: ').slice(0, 90));
      assert.equal(await promptOf(p), casualOf((await state(p)).scene, 'fantasy'), '소품을 바꿔도 화면 = 조립기');
      assert((await p.locator(mob ? '.hres .file' : '#file-name').textContent()).includes('seoul_fantasy_' + DEF + '_f_casual1.webp'), '일상컷 파일 이름(세계를 탄다)');
      assert.match(p.url(), /card=seoul&o=casual&world=fantasy/, '일상컷도 주소에 세계');
      checks += 22;
      /* 랜덤 처음부터 — 다 찬다(화면 = 조립기). 여기부터 다시 — 장소를 열면 뒤가 빈다. 처음부터 다시 — 도시 · 갈래는 그대로 */
      await randAll(p, 'world'); assert.equal(await openOf(p), 'done', '랜덤 뒤 다 골랐다');
      sc = (await state(p)).scene; assert(sc.era && sc.place && sc.ofam && sc.posture && sc.frame, '랜덤이 다 채운다');
      assert.equal(await promptOf(p), casualOf(sc, (await state(p)).world), '랜덤 일상컷도 화면 = 조립기');
      await p.click('[data-open="place"]'); await menu(p); await p.click('[data-restart="place"]');
      sc = (await state(p)).scene; assert.equal(await openOf(p), 'place'); assert(!sc.posture && !sc.frame && sc.era && sc.place, '뒤 칸을 비웠다 ' + JSON.stringify(sc));
      await randAll(p, 'place'); assert.equal(await openOf(p), 'done');
      await p.click('[data-reset]'); assert.equal(await openOf(p), 'world'); sc = (await state(p)).scene; assert(!sc.place && !sc.posture && !(await state(p)).world, '모든 칸을 비웠다(세계도)');
      await randAll(p, 'world'); assert((await state(p)).world && (await state(p)).scene.era, '랜덤이 세계도 채운다');
      assert.equal((await state(p)).card, 'seoul'); assert.equal((await state(p)).out, 'casual');
      checks += 9;
      await p.click('[data-open="out"]'); await p.click('[data-out="world"]');
      await p.click('[data-open="world"]'); await p.click('#panel .opt[data-pick="fantasy"]');
      /* 폰 — 칩 레일 한 줄 · 아래 막대 · 경로(도시 · 갈래) · 시트 */
      if (mob) {
        await p.click('[data-open="done"]').catch(() => {});
        const mb = await p.evaluate(() => { const hb = document.getElementById('hbar'), r = hb.getBoundingClientRect(); return { rail: document.querySelector('.hrail') ? document.querySelector('.hrail').getBoundingClientRect().height : 0, barIn: !hb.hidden && r.bottom <= innerHeight + 0.5, path: document.querySelectorAll('.hpath .hcrumb').length }; });
        assert(mb.rail > 0 && mb.rail <= 60, '칩 레일 한 줄 ' + mb.rail); assert(mb.barIn, '아래 막대'); assert.equal(mb.path, 2, '경로 도시 · 갈래');
        await p.click('[data-open="scene"]'); await p.click('#hbar [data-act="sheet"]'); assert((await p.locator('#hsheet textarea').inputValue()).length > 200, '시트에 지시문'); await p.click('#hsheet [data-act="sheet-close"]');
        /* 누르는 자리 44px — 생성기 판의 선택지 · 아래 막대 단추 */
        const small = await p.$$eval('#panel .opt, #hbar .btn', bs => bs.filter(b => b.offsetParent).map(b => b.getBoundingClientRect()).filter(r => r.height < 44).length);
        assert.equal(small, 0, '44px 보다 낮은 단추 ' + small);
        checks += 5;
      }
      /* 새로 고쳐도 남는다 */
      await p.reload(); await p.waitForSelector('.hchip');
      assert.equal((await state(p)).card, 'seoul'); assert.equal((await state(p)).world, 'fantasy');
      assert(await H.noOverflow(p), vp.width + ' 생성기 넘침'); assert.deepEqual(v.errors, [], '생성기 콘솔'); checks += 4;
      await H.shot(p, 'prompt-' + vp.width);
      await v.ctx.close();
    }
  } finally { await br.close(); srv.close(); }
  console.log('PASS 화면: 화풍 비교 · 생성기(도시 판 · 세계 그림 한 칸씩 · 화면 = 조립기 · 화풍 고르개 · 옛 mecha 주소 · 일상컷 한 칸씩(서울 생활 장면 · 그 세계 소품 · 화면 = 조립기 · 해방 · 랜덤 · 여기부터 다시 · 처음부터 · 그 도시의 물건) · 주소 · 저장 · 폰 레일/막대/시트/44px) · 폴드 덮개 · PC — ' + checks + '가지');
})().catch(e => { console.error(e); process.exit(1); });
