/* 일상컷 묶음 계획기(tools/casual-plan.cjs — 2026-11-19 계획 Task 4, 원소 계획기를 도시 꼴로 · 열 장 2026-11-20) — 서울 세 세계 × 씨앗 셋.
   세계마다 열 장(필수 다섯 — 생활 장면 · 란제리풍 · 수영복 · 역할극 · 게임 코스프레, 보통 셋 — 상황 노출 한 장, 자유 설계 둘 — 옷 자유 · 갈래 자유), 묶음 규칙(check) 통과,
   장소는 서울 생활 장면 ∪ 일반 장소(버전1 트리 장소 — 그 세계 금지 낱말이 글에 든 곳은 빼고) · 생활 장면 컷은 생활 장면 · 한 묶음 안 같은 장소 겹침 0 · 같은 자세 추천 겹침 0(세계끼리도),
   코스프레 칸은 게임 · 캐릭터 · 재단(코스프레 장소, 물가는 수영복 재단), 시간 · 계절 · 날씨는 서울 표 안(장소가 받는 것만, 트리 날씨 안 씀),
   기록 꼴 · 지시문(생활 장면은 그 세계 글 · 소품, 일반 장소는 그 장소 글, 판타지 · 스팀펑크 금지 낱말 없음, 코스프레 Outfit 줄),
   캐릭터만의 컷(90번 — 세 세계 자세 서로 다르게), 있는 세 장 위에 일곱 장, 같은 씨앗 같은 답, 틀린 칸을 잡는다, 코스프레 고르기(쓴 것 · 2회차).
   쓴 횟수 · 최근 장면 · 쓴 코스프레는 빈 기록으로(usage · cosplayUsed 를 주지 않는다). node tests/casual-plan.cjs */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), os = require('node:os'), vm = require('node:vm');
const C = require('../tools/casual-plan.cjs');
const R = path.join(__dirname, '..');
const ctx = { window: {}, console }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx);
const P = ctx.window.AtelierPrompt, TS = ctx.window.AtelierSpec;
const J = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const D = J('data/city-design.json'), LIFE = J('data/city-life.json'), PROPS = J('data/world-props.json'), FD = TS.FREE_DESIGN;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), word = w => new RegExp('\\b' + esc(w) + '\\b', 'i');
const SCENES = LIFE.cities.seoul.scenes, byKey = (l, k) => (l || []).find(r => r.key === k);
const TEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const T1 = J('data/casual-tree.json'), GENERIC = new Set([...T1.places, ...(J('data/casual-tree-v2.json').extra_places || [])].map(p => p.key)), COSP = J('data/game-cosplay.json');   /* 일반 장소 = 버전1 + 버전2 새 장소(2026-11-26 — 계획기 GEN 과 같게) */

let n = 0;
const card = C.cardOf('seoul');
assert.deepEqual(card.worlds, ['fantasy', 'steampunk', 'cyberpunk'], '서울 세 세계');
assert(SCENES.length >= 10, '서울 생활 장면 10 이상 — ' + SCENES.length);
const lifeCount = {};
for (const seed of [3, 11, 29]) {
  const planned = [];   /* --world all 처럼 — 앞 세계 묶음이 다음 세계의 겹침 검사(others)에 든다 */
  const gfrees = [];
  for (const w of card.worlds) {
    card.world = w;
    const id = 'seoul ' + w + ' seed ' + seed;
    const res = C.plan(card, TEN, [], { seed: seed + card.worlds.indexOf(w), others: planned, recent: ['a test place — standing'] });
    assert.equal(res.cuts.length, 10, id + ' 열 장');
    assert.deepEqual(C.check(res.cuts, card, [], planned), [], id + ' 묶음 규칙');
    const scene = res.cuts.filter(c => !c.sfree), free = res.cuts.filter(c => c.sfree);
    assert.equal(scene.length, 8, id + ' 장면 컷 여덟');
    assert.deepEqual(free.map(c => c.n), [9, 10], id + ' 자유 설계 칸은 맨 뒤 번호');
    assert(free.some(c => c.ofree) && free.some(c => c.gfree && C.EXPOSE_TYPES.includes(c.gfree) && c.gsitu === 'free'), id + ' 옷 자유 · 갈래 자유');
    /* 필수 다섯 — 생활 장면 컷(서울 생활 장면) · 노출 갈래 셋 · 게임 코스프레 */
    const kinds = res.cuts.map(C.kindOf).sort();
    assert.deepEqual(kinds, C.KINDS.slice().sort(), id + ' 칸 갈래 열 — ' + kinds);
    const lm = scene.filter(c => c.lifeMust);
    assert(lm.length === 1 && C.lifeOf(lm[0].place) && C.lifeOf(lm[0].place).city === 'seoul' && lm[0].n === 1, id + ' 생활 장면 필수 컷은 서울 생활 장면(1번)');
    for (const f of C.EXPOSE_TYPES) assert.equal(scene.filter(c => C.requiredType(c) === f).length, 1, id + ' 노출 갈래 ' + f + ' 한 장');
    const cos = scene.filter(C.isCosplay);
    assert.equal(cos.length, 1, id + ' 게임 코스프레 한 장');
    { const c = cos[0], cs = c.cosplay, g = COSP.games.find(x => x.key === cs.game);
      assert(g && String(cs.character).trim() && (g.many ? g.characters.some(x => x.name === cs.character) : cs.character === g.character), id + ' 코스프레 게임 · 캐릭터 ' + cs.game + '/' + cs.character);
      assert(c.item === 'gc_' + cs.cut && COSP.cuts.some(x => x.key === cs.cut), id + ' 코스프레 재단 = 옷');
      assert(c.frame !== 'face_close' && !c.color && !c.denier && !c.situ, id + ' 코스프레 컷엔 클로즈업 · 색 · 데니어 · 상황 없음');
      const rec = C.record(card, w, c);
      assert(rec.prompt.includes(cs.character) && rec.prompt.includes(g.en) && rec.prompt.includes('\n\nCostume: '), id + ' 코스프레 지시문(캐릭터 · 게임 · 코스튬 줄)');
      assert.deepEqual(rec.scene.cosplay, cs, id + ' 기록 scene.cosplay'); }
    const gf = free.find(c => c.gfree), req = scene.find(c => C.requiredType(c) === gf.gfree); gfrees.push(gf.gfree);
    if (req.item) { assert.equal(gf.gnot, req.item, id + ' 갈래 자유는 그 갈래 필수 컷의 옷을 피한다'); assert(C.record(card, w, gf).prompt.includes('Not the same outfit as the one already in this set: '), id + ' 갈래 자유 피할 옷 줄'); }
    /* 상황 노출 — 보통 컷 한 장 */
    const si = scene.filter(c => c.situ);
    assert(si.length === 1 && C.kindOf(si[0]) === 'plain' && P.situFits(si[0].situ, C.outfitEn(si[0])), id + ' 상황 노출은 보통 컷 한 장');
    /* 장소 — 서울 생활 장면 ∪ 일반 장소, 같은 장소 겹침 0 · 같은 자세 추천 겹침 0(세계끼리도) */
    const ls = scene.map(c => C.lifeOf(c.place));
    scene.forEach((c, i) => assert(ls[i] ? ls[i].city === 'seoul' : GENERIC.has(c.place), id + ' 장소 ' + c.place + ' 는 서울 생활 장면 또는 일반 장소'));
    lifeCount[w] = (lifeCount[w] || 0) + ls.filter(Boolean).length;
    assert.equal(new Set(scene.map(c => c.place)).size, 8, id + ' 같은 장소 겹침 0');
    assert.equal(new Set(scene.map(c => c.preset)).size, 8, id + ' 같은 자세 추천 겹침 0');
    assert(!scene.some(c => planned.some(o => o.preset === c.preset)), id + ' 다른 세계와 같은 자세 추천 0');
    assert(!scene.some(c => planned.some(o => o.place === c.place && o.ofam === c.ofam)), id + ' 다른 세계와 같은 장소 · 같은 옷 계열 0');
    ls.forEach((s, i) => assert(!s || !s.outfits || s.outfits.includes(scene[i].ofam), id + ' 장면 ' + (s && s.key) + ' 의 의상 계열 ' + scene[i].ofam));
    /* 시간 · 계절 · 날씨 — 서울 표 안, 장소가 받는 것, 트리 날씨 없음 */
    scene.forEach(c => {
      const pr = C.placeRules(c.place), wx = c.cityWeather && byKey(LIFE.weather.seoul, c.cityWeather);
      if (c.time) assert(byKey(LIFE.times, c.time) && (!pr.times || pr.times.includes(c.time)), id + ' 시간대 ' + c.time + ' @ ' + c.place);
      assert(byKey(LIFE.seasons.seoul, c.season) && (!pr.seasons || pr.seasons.includes(c.season)), id + ' 계절 ' + c.season + ' @ ' + c.place);
      if (c.cityWeather) assert(wx && !pr.indoor && (!wx.seasons || wx.seasons.includes(c.season)) && (!wx.times || wx.times.includes(c.time)), id + ' 날씨 ' + c.cityWeather);
      assert(!c.weather, id + ' 트리 날씨는 안 쓴다');
    });
    { const cs = scene.map(c => c.color).filter(Boolean); assert.equal(new Set(cs).size, cs.length, id + ' 옷 색 갈래 겹침 0'); }
    /* 기록 · 지시문 */
    const mk = D.vocab.markers[w];
    for (const c of res.cuts) {
      const rec = C.record(card, w, c), t = rec.prompt, neg = (t.split('\n\n').filter(b => /^Avoid: /.test(b))[0] || ''), body = neg ? t.replace(neg, '') : t;
      assert.equal(rec.file, `seoul_${w}_${C.STYLE}_f_casual${c.n}.webp`, id + ' 파일 이름');
      assert.equal(rec.record, `records/seoul/${w}-casual${c.n}.${C.STYLE}-ui.json`);
      assert.equal(rec.ref, `seoul_${w}_${C.STYLE}_f.webp`, '참고 그림은 그 세계 그림');
      assert(rec.treeV === 2 && rec.world === w && t.length > 500, id + ' 기록 꼴');
      for (const b of mk.banned_en) assert(!word(b).test(body), id + ' 칸 ' + c.n + ' 금지 낱말 「' + b + '」 (Avoid 단락 밖)');
      if (mk.banned_en.length) assert(neg.includes(mk.banned_en[0]), id + ' Avoid 단락에 그 세계 금지 낱말');
      assert(!/\b(?:element|kingdom|mecha|atomic)\b/i.test(t) && !/[가-힣]/.test(t), id + ' 원소 말 · 한국어 없음');
      assert(t.includes('\n\nWorld: an ordinary day in Seoul as her world knows it — '), id + ' 그 세계의 서울의 하루 줄');
      if (c.sfree) { assert(t.includes(FD.head) && !/^Place: [^…]/m.test(t), id + ' 자유 설계 덩어리'); continue; }
      assert(!!rec.scene.lifeMust === !!c.lifeMust, id + ' 기록에 생활 장면 필수 표시');
      const s = C.lifeOf(c.place);
      if (s) {
        const sw = s.worlds[w];
        assert(t.includes('\nPlace: ' + sw.en.replace(/\.$/, '') + '.\n'), id + ' 그 장면의 그 세계 글');
        const own = (((D.cities.find(x => x.key === card.key) || {}).worlds || {})[w] || {}).own_vocab || {};   /* 도시별 말(2026-11-20) */
        for (const k of sw.props) assert(t.includes((own.props || {})[k] || PROPS.props[k].worlds[w].en), id + ' 소품 ' + k + ' 의 그 세계 낱말');
      } else assert(t.includes('\nPlace: ' + P.placeEn(T1.places.find(p => p.key === c.place) || (J('data/casual-tree-v2.json').extra_places || []).find(p => p.key === c.place), w) + '\n'), id + ' 일반 장소 글 그대로(세계 글이 있으면 그 세계 글 — 2026-11-24 탈 것)');
      assert(t.includes(PROPS.clothes[w].en) === !C.isCosplay(c), id + ' 옷의 결 — 그 세계 평상복(코스프레 컷은 없음)');
      /* 실내면 계절 이름만 · 창밖 · 옷차림(2026-11-20 「실내공간까지 따라들어오는것 같아」), 바깥이면 계절 글 그대로 */
      const sea = byKey(LIFE.seasons.seoul, c.season), inSeason = 'Season: ' + sea.en.split(' — ')[0] + ' — but she is indoors';
      assert((C.placeRules(c.place).indoor ? t.includes(inSeason) && !t.includes(sea.en) : t.includes('Season: ' + sea.en.replace(/\.$/, '') + '.')) && (!c.time || ['.', '; '].some(x => t.includes('Time of day: ' + byKey(LIFE.times, c.time).en + x))), id + ' 계절 · 시간대 줄');   /* 시간대 뒤 빛 모습(2026-11-21 — 표 ambience.looks) */
    }
    planned.push(...res.cuts);
    n++;
  }
  assert.equal(new Set(gfrees).size, 3, 'seed ' + seed + ' 갈래 자유는 세계마다 다른 갈래(덜 쓴 것) — ' + gfrees);
}
for (const w of card.worlds) assert(lifeCount[w] >= 3, w + ' 생활 장면이 세 묶음에 ' + lifeCount[w] + ' 장 — 필수 한 장 + 섞은 풀');
/* 캐릭터만의 컷(90번) — 서울 세 세계, 자세 서로 다르게, 지시문에 그 직업 장소 · 도구 · 의상 단계 */
{
  const presets = [];
  for (const w of card.worlds) {
    card.world = w;
    const row = C.ownRow(card, w); assert(row && row.job_ko && row.place && row.activity && row.prop && row.outfit.bold && row.outfit.moderate && row.outfit.low, w + ' 직업 줄');
    for (const lv of C.OWN_LEVELS) {
      const oc = C.ownCut(card, w, lv, () => 0.3), rec = C.record(card, w, oc), t = rec.prompt;
      assert(oc.n === C.OWN_N && oc.preset === row.preset && oc.axes.skin_exposure === lv, w + ' ' + lv + ' 90번');
      assert(t.includes('Place: ' + row.place) && t.includes(row.outfit[lv]) && t.includes(row.prop), w + ' ' + lv + ' 직업 지시문');
      const neg = t.split('\n\n').filter(b => /^Avoid: /.test(b))[0] || '', body = t.replace(neg, '');
      for (const b of D.vocab.markers[w].banned_en) assert(!word(b).test(body), w + ' 90번 금지 낱말 「' + b + '」');
    }
    presets.push(row.preset);
  }
  assert.equal(new Set(presets).size, 3, '세 세계 직업컷 자세가 서로 다르다 — ' + presets);
}
/* 이미 있는 세 장 위에 일곱 장 — 앞 세 장은 생활 장면 · 란제리풍 · 수영복, 뒤 일곱이 나머지 칸 갈래 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'casual-plan-'));
try {
  card.world = 'steampunk';
  const first = C.plan(card, [1, 2, 3], [], { seed: 5 });
  assert.deepEqual(first.cuts.map(C.kindOf), ['life', 'lingerie', 'swimwear'], '앞 세 칸 갈래');
  for (const c of first.cuts) fs.writeFileSync(path.join(tmp, `${card.world}-casual${c.n}.${C.STYLE}-ui.json`), JSON.stringify(C.record(card, card.world, c)));
  const old = C.oldCuts(tmp, card, card.world);
  assert.equal(old.length, 3);
  assert(old.some(c => c.lifeMust), '기록에서 읽은 생활 장면 필수 표시');
  const more = C.plan(card, [4, 5, 6, 7, 8, 9, 10], old, { seed: 9 });
  assert.deepEqual(C.check(more.cuts, card, old), []);
  assert.deepEqual([...old, ...more.cuts].map(C.kindOf).sort(), C.KINDS.slice().sort(), '있는 컷과 합쳐 열 칸 갈래');
  assert.equal(new Set([...old, ...more.cuts].filter(c => !c.sfree).map(c => c.place)).size, 8, '장소가 있는 컷과도 다르다');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
/* 금지 장소 — 판타지 · 스팀펑크는 글에 그 세계 금지 낱말이 든 일반 장소를 풀에서 뺀다 */
{
  const ban = w => T1.places.filter(p => C.BANNED[w] && C.BANNED[w].test(P.placeEn(p, w))).map(p => p.key);
  for (const w of ['fantasy', 'steampunk']) {
    card.world = w; card.g.world = w;
    const b = ban(w); assert(b.length >= 3, w + ' 금지 낱말이 든 일반 장소 ' + b);
    const pool = C.placeCands(card, 'plain');
    assert(!b.some(k => pool.gen.includes(k)) && pool.gen.length > 50, w + ' 일반 장소 풀에 금지 장소 없음');
    /* 세계 글(worlds — 2026-11-24 탈 것): 판타지 길가 마차는 장소 글에 car 가 있어도 그 세계 글로 풀에 든다, 그 세계 글이 없는 곳(worlds_only 밖 — 판타지 바이크)은 빠진다 */
    assert(pool.gen.includes('car_kerb') && !C.BANNED[w].test(P.placeEn(T1.places.find(p => p.key === 'car_kerb'), w)) && C.BANNED.fantasy.test(T1.places.find(p => p.key === 'car_kerb').en), w + ' 길가 탈것은 그 세계 글로(장소 글엔 판타지 금지 낱말 car)');
    for (const p of T1.places.filter(p => p.worlds_only && !p.worlds_only.includes(w))) assert(!pool.gen.includes(p.key), w + ' 세계 밖 장소 ' + p.key);
  }
  card.world = 'cyberpunk'; card.g.world = 'cyberpunk';
  assert(ban('fantasy').every(k => C.placeCands(card, 'plain').gen.includes(k)), '사이버펑크는 그 장소들을 쓴다');
  /* 코스프레 장소 — 그 계열을 적은 일반 장소, 물가는 수영복 재단만 */
  const dry = C.placeCands(card, 'cosplay', 'mini_dress'), wet = C.placeCands(card, 'cosplay', 'bikini');
  assert(dry.gen.length >= 4 && !dry.gen.some(k => /^water_/.test(k)) && wet.gen.some(k => /^water_/.test(k)), '코스프레 장소 ' + dry.gen + ' / ' + wet.gen);
  assert(C.placeCands(card, 'life').gen.length === 0 && C.placeCands(card, 'life').life.length === SCENES.length, '생활 장면 컷은 생활 장면만');
}
/* 같은 씨앗 같은 답 · 틀린 칸을 잡는다 */
{
  card.world = 'fantasy';
  const a = C.plan(card, TEN, [], { seed: 7 }).cuts;
  assert.deepEqual(a, C.plan(card, TEN, [], { seed: 7 }).cuts, '같은 답');
  const c0 = a.find(c => C.kindOf(c) === 'plain' && !c.situ), at = i => a.map((c, j) => (j === i ? { ...c } : c)), i0 = a.indexOf(c0);
  const bad = (patch, re, why, i = i0) => { const x = at(i); Object.assign(x[i], patch); assert(C.check(x, card, []).some(e => re.test(e)), why); };
  bad({ place: 'no_such_place' }, /생활 장면도 일반 장소/, '표에 없는 장소');
  bad({ place: 'orbit_lounge' }, /cyberpunk 세계에만 있다/, '궤도 정거장은 사이버펑크만(2026-11-26)');
  assert(!C.check(at(i0).map((c, j) => (j === i0 ? { ...c, place: 'library_reading' } : c)), card, []).some(e => /생활 장면도 일반 장소/.test(e)), '버전2 새 장소(열람실)도 일반 장소(2026-11-26 사용자 「응 24개도 같이 열고」)');
  bad({ place: 'night_bar' }, /일반 장소 night_bar 의 글에 fantasy 금지 낱말/, '판타지에 네온 바');
  bad({ ofam: 'everyday', item: 'jeans_tee' }, /금지 낱말/, '판타지에 청바지');
  bad({ season: 'winter', place: 'seoul_river_pool' }, /계절 winter/, '여름 수영장에 겨울');
  bad({ cityWeather: 'snowfall', season: 'summer' }, /날씨 snowfall/, '여름에 눈');
  bad({ time: 'night' }, /시간대 night/, '트리 시간대');
  bad({ weather: 'rain' }, /트리 날씨/, '트리 날씨');
  bad({ ofam: 'traditional', item: 'kimono_formal' }, /전통 의상 kimono_formal/, '서울에 기모노(heritage — 그 문화의 도시에서만)');
  bad({ ofam: 'traditional', item: 'abaya_modern' }, /전통 의상 abaya_modern/, '종교 옷은 어디서도 안 고른다');
  assert(!C.check(at(i0).map((c, j) => j === i0 ? { ...c, ofam: 'traditional', item: 'hanbok_daily' } : c), card, []).some(e => /전통 의상/.test(e)), '서울에 한복은 된다');
  const iL = a.findIndex(c => c.lifeMust), iC = a.findIndex(C.isCosplay), iX = a.findIndex(c => C.requiredType(c) === 'roleplay');
  bad({ place: a.find(c => !c.sfree && !C.lifeOf(c.place)).place }, /생활 장면 필수 컷의 장소/, '생활 장면 필수 컷이 일반 장소', iL);
  bad({ lifeMust: false }, /생활 장면 필수 컷이 없다/, '생활 장면 필수 컷 없음', iL);
  bad({ ofam: 'everyday', item: '' }, /필수 노출 갈래 roleplay 컷이 없다/, '역할극 없음', iX);
  bad({ cosplay: { ...a[iC].cosplay, cut: 'knit' } }, /재단 knit 이 옷/, '코스프레 재단 ≠ 옷', iC);
  bad({ cosplay: { ...a[iC].cosplay, game: 'no_game' } }, /게임 no_game 이 목록에 없다/, '없는 게임', iC);
  bad({ situ: 'wet' }, /상황 노출은 보통 컷에만/, '코스프레에 상황', iC);
  bad({ gnot: 'x' }, /갈래 자유가 피할 옷/, '갈래 자유 gnot', a.findIndex(c => c.gfree));
  card.world = 'steampunk';
  const ph = C.check([{ ...c0, use: 'phone_selfie' }], card, []);
  assert(ph.some(e => /phone_selfie 는 steampunk 에서 안 쓴다/.test(e)), '스팀펑크 셀카');
}
/* 코스프레 고르기 — 주인공 하나 게임은 그 주인공 · 안 입은 재단, 등장인물 많은 게임은 안 쓴 캐릭터, 다 쓰면 2회차, 쓴 것은 그림 저장소 기록 + 계획 예약 */
{
  const solo = COSP.games.find(g => !g.many), many = COSP.games.find(g => g.many && g.characters.length >= 2);
  const usedSolo = COSP.cuts.slice(1).map(c => ({ game: solo.key, character: solo.character, cut: c.key }));
  const keep = g => g.key === solo.key;
  const s1 = C.pickCosplay(usedSolo, () => 0.5, () => true, keep);
  assert(s1 && s1.character === solo.character && s1.cut === COSP.cuts[0].key, '주인공 하나 — 안 입은 재단 하나');
  assert.equal(C.pickCosplay([...usedSolo, { game: solo.key, character: solo.character, cut: COSP.cuts[0].key }], () => 0.5, () => true, keep), null, '다 입으면 그 게임은 빠진다');
  const all = many.characters.slice(1).map(ch => ({ game: many.key, character: ch.name, cut: 'knit' }));
  const m1 = C.pickCosplay(all, () => 0.3, () => true, g => g.key === many.key);
  assert(m1.character === many.characters[0].name && m1.round === 1, '등장인물 많음 — 안 쓴 캐릭터');
  const m2 = C.pickCosplay([...all, { game: many.key, character: many.characters[0].name, cut: 'knit' }], () => 0.3, () => true, g => g.key === many.key);
  assert(m2.round === 2 && m2.cut !== 'knit', '다 쓰면 2회차 — 안 입은 재단');
  const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'cosplay-use-'));
  try {
    const d = path.join(tmp2, 'records', 'seoul'); fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'fantasy-casual5.x-ui.json'), JSON.stringify({ scene: {}, generation: { cosplay: { game: 'overwatch', character: 'Mercy', cut: 'knit' } } }));
    fs.writeFileSync(path.join(d, 'steampunk-casual-plan.json'), JSON.stringify({ world: 'steampunk', cuts: [{ n: 5, ofam: 'game_cosplay', cosplay: { game: 'overwatch', character: 'Tracer', cut: 'idol' } }] }));
    const u = C.cosplayUsage([tmp2]);
    assert.deepEqual(u.map(x => x.character).sort(), ['Mercy', 'Tracer'], '그린 기록 + 계획 예약');
    assert.deepEqual(C.cosplayUsage([tmp2], { skip: ['seoul|steampunk'] }).map(x => x.character), ['Mercy'], '다시 짜는 세계의 옛 계획은 안 센다');
  } finally { fs.rmSync(tmp2, { recursive: true, force: true }); }
}
/* 일상컷 검토 고침 — 판타지 · 스팀펑크 모든 칸 옷 글에 그 세계 banned_en 낱말이 없다(씨앗 12개) · 노출 갈래 컷은 얼굴 클로즈업이 아니다 */
for (const w of ['fantasy', 'steampunk']) {
  card.world = w;
  const re = C.BANNED[w];
  for (let seed = 100; seed < 112; seed++) {
    for (const c of C.plan(card, TEN, [], { seed }).cuts) {
      assert(!re.test(C.outfitEn(c)), `${w} 씨앗 ${seed} 칸 ${c.n}: 옷 「${C.outfitEn(c)}」 에 금지 낱말`);
      if (C.EXPOSE_TYPES.includes(C.requiredType(c)) || C.isCosplay(c)) assert(c.frame !== 'face_close', `${w} 씨앗 ${seed} 칸 ${c.n}: 노출 갈래 · 코스프레가 얼굴 클로즈업`);
      if (!c.sfree && !C.lifeOf(c.place)) assert(!re.test(P.placeEn(T1.places.find(p => p.key === c.place) || (J('data/casual-tree-v2.json').extra_places || []).find(p => p.key === c.place), w)), `${w} 씨앗 ${seed} 칸 ${c.n}: 일반 장소 ${c.place} 에 금지 낱말`);
    }
  }
}
/* 도쿄(2026-11-20 설계) — 세 세계가 열 장 · 묶음 규칙 · 생활 장면 필수 컷은 도쿄 장면, 직업컷 세 세계 자세가 서로 다르다 */
{
  const tk = C.cardOf('tokyo'), planned = [];
  assert.deepEqual(tk.worlds, ['fantasy', 'steampunk', 'cyberpunk'], '도쿄 세 세계');
  for (const w of tk.worlds) {
    tk.world = w;
    const res = C.plan(tk, TEN, [], { seed: 7 + tk.worlds.indexOf(w), others: planned });
    assert.equal(res.cuts.length, 10, 'tokyo ' + w + ' 열 장');
    assert.deepEqual(C.check(res.cuts, tk, [], planned), [], 'tokyo ' + w + ' 묶음 규칙');
    const lm = res.cuts.find(c => c.lifeMust);
    assert(lm && C.lifeOf(lm.place).city === 'tokyo', 'tokyo ' + w + ' 생활 장면 필수 컷은 도쿄 장면');
    planned.push(...res.cuts);
  }
  assert.equal(new Set(tk.worlds.map(w => C.ownRow(tk, w).preset)).size, 3, '도쿄 직업컷 자세가 서로 다르다');
}
/* 랜드마크 카드(해치) — 열 장 · 생활 장면은 서울 것 · 90번 없음 · 서울 기록의 장면은 뒤로 밀린다(덜 쓴 장면) */
{
  const HC = C.cardOf('seoul-haechi');
  for (const w of HC.worlds) {
    HC.world = w;
    const res = C.plan(HC, TEN, [], { seed: 7 + HC.worlds.indexOf(w) });
    assert.equal(res.cuts.length, 10, w + ' 해치 열 장');
    assert(res.cuts.filter(c => c.lifeMust).every(c => C.lifeOf(c.place).city === 'seoul'), w + ' 생활 장면은 서울 것');
    assert.equal(C.ownRow(HC, w), null, w + ' 90번 없음');
  }
  HC.world = 'fantasy';
  const hits = (usage) => { let k = 0; for (let seed = 1; seed <= 12; seed++) k += C.plan(HC, TEN, [], { seed, usage }).cuts.filter(c => c.place === 'seoul_noraebang').length; return k; };
  const base = hits({}), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lmu-'));
  try {
    const rec = (dir, name, scene) => { fs.mkdirSync(path.join(tmp, dir), { recursive: true }); fs.writeFileSync(path.join(tmp, dir, name), JSON.stringify(scene)); };
    for (let i = 1; i <= 4; i++) rec('seoul', `fantasy-casual${i}.default-ui.json`, { scene: { place: 'seoul_noraebang' } });
    rec('seoul-haechi', 'fantasy-casual-plan.json', { world: 'fantasy', cuts: [{ n: 5, place: 'seoul_noraebang' }, { n: 1, place: 'seoul_noraebang' }] });
    const u = C.sceneUsage(tmp, 'seoul-haechi');
    assert.equal(u.place.seoul_noraebang, 4, '자기 계획은 빼고 서울 기록 넷');
    rec('seoul-haechi', 'x', {}); fs.rmSync(path.join(tmp, 'seoul-haechi'), { recursive: true });
    rec('seoul-jongro', 'fantasy-casual-plan.json', { world: 'fantasy', cuts: [{ n: 1, place: 'seoul_noraebang' }, { n: 2, place: 'seoul_noraebang' }] });
    rec('seoul-jongro', 'fantasy-casual1.default-ui.json', { scene: { place: 'seoul_noraebang' } });
    assert.equal(C.sceneUsage(tmp, 'seoul-haechi').place.seoul_noraebang, 4 + 1 + 1, '그린 번호 계획은 안 세고 안 그린 계획은 센다');
    assert(!C.sceneUsage(tmp, 'tokyo').place.seoul_noraebang === false, '다른 도시 사용 횟수에도 그린 기록은 센다');
    assert(hits(C.sceneUsage(tmp, 'seoul-haechi')) <= base, '기록 많은 장면은 뒤로 밀린다');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
console.log(`PASS 일상컷 묶음 계획기: 서울 ${n} 묶음(세 세계 × 씨앗 셋)이 열 장(필수 다섯 — 생활 장면 · 노출 갈래 셋 · 게임 코스프레, 보통 셋, 자유 설계 둘) · 묶음 규칙 · 상황 노출은 보통 컷 한 장 · 장소 겹침 0(생활 장면 ∪ 일반 장소) · 자세 겹침 0(세계끼리도) · 금지 장소 · 코스프레 게임 · 캐릭터 · 재단 · 시간 · 계절 · 날씨는 서울 표 안 · 장면 글 · 소품 · 옷의 결 · 금지 낱말 0, 직업컷 셋(자세 서로 다르게), 있는 세 장 위에 일곱 장, 같은 씨앗 같은 답, 틀린 칸, 코스프레 고르기, 도쿄 세 세계 열 장 · 직업컷`);
