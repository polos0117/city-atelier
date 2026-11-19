/* 일상컷 묶음 계획기(tools/casual-plan.cjs — 2026-11-19 계획 Task 4, 원소 계획기를 도시 꼴로) — 서울 세 세계 × 씨앗 셋.
   세계마다 일곱 장(장면 컷 다섯 + 자유 설계 칸 둘 — 옷 자유 · 갈래 자유), 묶음 규칙(check) 통과, 노출 갈래 한 장(세계마다 돌려 가며) · 상황 노출 한 장,
   장면은 서울 생활 장면표(data/city-life.json)에서 · 한 묶음 안 같은 장면 겹침 0 · 같은 자세 추천 겹침 0(세계끼리도),
   시간 · 계절 · 날씨는 서울 표 안에서(장면이 받는 것만, 트리 날씨 안 씀), 기록 꼴 · 지시문(그 장면의 그 세계 글 · 그 세계 소품 · 판타지 · 스팀펑크 금지 낱말 없음),
   캐릭터만의 컷(90번 — 세 세계 자세 서로 다르게), 있는 두 장 위에 세 장, 같은 씨앗 같은 답, 틀린 칸을 잡는다.
   그림 저장소(city-atelier-img)가 아직 없다 — 쓴 횟수 · 최근 장면은 빈 기록으로(usage 를 주지 않는다). node tests/casual-plan.cjs */
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
const SEVEN = [1, 2, 3, 4, 5, 6, 7];

let n = 0;
const card = C.cardOf('seoul');
assert.deepEqual(card.worlds, ['fantasy', 'steampunk', 'cyberpunk'], '서울 세 세계');
assert(SCENES.length >= 10 && SCENES.length <= 12, '서울 생활 장면 10~12 — ' + SCENES.length);
for (const seed of [3, 11, 29]) {
  const planned = [];   /* --world all 처럼 — 앞 세계 묶음이 다음 세계의 겹침 검사(others)에 든다 */
  const exTypes = [];
  for (const w of card.worlds) {
    card.world = w;
    const id = 'seoul ' + w + ' seed ' + seed;
    const res = C.plan(card, SEVEN, [], { seed: seed + card.worlds.indexOf(w), others: planned, recent: ['a test place — standing'] });
    assert.equal(res.cuts.length, 7, id + ' 일곱 장');
    assert.deepEqual(C.check(res.cuts, card, [], planned), [], id + ' 묶음 규칙');
    const scene = res.cuts.filter(c => !c.sfree), free = res.cuts.filter(c => c.sfree);
    assert.equal(scene.length, 5, id + ' 장면 컷 다섯');
    assert.deepEqual(free.map(c => c.n), [6, 7], id + ' 자유 설계 칸은 맨 뒤 번호');
    assert(free.some(c => c.ofree) && free.some(c => c.gfree && C.EXPOSE_TYPES.includes(c.gfree) && c.gsitu === 'free'), id + ' 옷 자유 · 갈래 자유');
    /* 정해 둔 갈래 — 노출 한 장(세계마다 다른 갈래) · 상황 노출 한 장(노출 갈래 컷과 다른 컷) */
    const ex = scene.filter(c => C.EXPOSE_TYPES.includes(C.requiredType(c)));
    const want = C.EXPOSE_TYPES[card.worlds.indexOf(w) % C.EXPOSE_TYPES.length];   /* 서울은 도시 목록 첫째 — 세계마다 란제리풍 · 수영복 · 역할극 */
    assert(ex.length === 1 && ex[0].ofam === want, id + ' 노출 갈래 ' + want + ' 한 장'); exTypes.push(want);
    assert(!free.some(c => ex.some(e => e.ofam === c.gfree)), id + ' 갈래 자유는 노출 갈래 컷과 다른 갈래');
    const si = scene.filter(c => c.situ);
    assert(si.length === 1 && !C.requiredType(si[0]) && P.situFits(si[0].situ, C.outfitEn(si[0])), id + ' 상황 노출 한 장');
    /* 장면 — 서울 생활 장면표에서, 같은 장면 겹침 0 · 같은 자세 추천 겹침 0(세계끼리도) */
    const ls = scene.map(c => C.lifeOf(c.place));
    assert(ls.every(s => s && s.city === 'seoul'), id + ' 장면은 서울 생활 장면표');
    assert.equal(new Set(scene.map(c => c.place)).size, 5, id + ' 같은 장면 겹침 0');
    assert.equal(new Set(scene.map(c => c.preset)).size, 5, id + ' 같은 자세 추천 겹침 0');
    assert(!scene.some(c => planned.some(o => o.preset === c.preset)), id + ' 다른 세계와 같은 자세 추천 0');
    assert(!scene.some(c => planned.some(o => o.place === c.place && o.ofam === c.ofam)), id + ' 다른 세계와 같은 장면 · 같은 옷 계열 0');
    ls.forEach((s, i) => assert(!s.outfits || s.outfits.includes(scene[i].ofam), id + ' 장면 ' + s.key + ' 의 의상 계열 ' + scene[i].ofam));
    /* 시간 · 계절 · 날씨 — 서울 표 안, 장면이 받는 것, 트리 날씨 없음 */
    scene.forEach((c, i) => {
      const s = ls[i], wx = c.cityWeather && byKey(LIFE.weather.seoul, c.cityWeather);
      assert(byKey(LIFE.times, c.time) && (!s.times || s.times.includes(c.time)), id + ' 시간대 ' + c.time + ' @ ' + s.key);
      assert(byKey(LIFE.seasons.seoul, c.season) && (!s.seasons || s.seasons.includes(c.season)), id + ' 계절 ' + c.season + ' @ ' + s.key);
      if (c.cityWeather) assert(wx && !s.indoor && (!wx.seasons || wx.seasons.includes(c.season)) && (!wx.times || wx.times.includes(c.time)), id + ' 날씨 ' + c.cityWeather);
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
      const s = C.lifeOf(c.place), sw = s.worlds[w];
      assert(t.includes('\nPlace: ' + sw.en.replace(/\.$/, '') + '.\n'), id + ' 그 장면의 그 세계 글');
      for (const k of sw.props) assert(t.includes(PROPS.props[k].worlds[w].en), id + ' 소품 ' + k + ' 의 그 세계 낱말');
      assert(t.includes(PROPS.clothes[w].en), id + ' 옷의 결 — 그 세계 평상복');
      assert(t.includes('Season: ' + byKey(LIFE.seasons.seoul, c.season).en.replace(/\.$/, '') + '.') && t.includes('Time of day: ' + byKey(LIFE.times, c.time).en + '.'), id + ' 계절 · 시간대 줄');
    }
    planned.push(...res.cuts);
    n++;
  }
  assert.equal(new Set(exTypes).size, 3, 'seed ' + seed + ' 노출 갈래는 세계마다 다르다 — ' + exTypes);
}
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
/* 이미 있는 두 장 위에 세 장 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'casual-plan-'));
try {
  card.world = 'steampunk';
  const first = C.plan(card, [1, 2], [], { seed: 5 });
  for (const c of first.cuts) fs.writeFileSync(path.join(tmp, `${card.world}-casual${c.n}.${C.STYLE}-ui.json`), JSON.stringify(C.record(card, card.world, c)));
  const old = C.oldCuts(tmp, card, card.world);
  assert.equal(old.length, 2);
  const more = C.plan(card, [3, 4, 5], old, { seed: 9 });
  assert.deepEqual(C.check(more.cuts, card, old), []);
  assert.equal(new Set([...old, ...more.cuts].map(c => c.place)).size, 5, '장면이 있는 컷과도 다르다');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
/* 같은 씨앗 같은 답 · 틀린 칸을 잡는다 */
{
  card.world = 'fantasy';
  const a = C.plan(card, SEVEN, [], { seed: 7 }).cuts;
  assert.deepEqual(a, C.plan(card, SEVEN, [], { seed: 7 }).cuts, '같은 답');
  const c0 = a.find(c => !c.sfree && !C.requiredType(c) && !c.situ), at = i => a.map((c, j) => (j === i ? { ...c } : c)), i0 = a.indexOf(c0);
  const bad = (patch, re, why) => { const x = at(i0); Object.assign(x[i0], patch); assert(C.check(x, card, []).some(e => re.test(e)), why); };
  bad({ place: 'home_bedroom' }, /생활 장면표의 장면이 아니다/, '생활 장면이 아닌 장소');
  bad({ ofam: 'everyday', item: 'jeans_tee' }, /금지 낱말/, '판타지에 청바지');
  bad({ season: 'winter', place: 'seoul_river_pool' }, /계절 winter/, '여름 수영장에 겨울');
  bad({ cityWeather: 'snowfall', season: 'summer' }, /날씨 snowfall/, '여름에 눈');
  bad({ time: 'night' }, /시간대 night/, '트리 시간대');
  bad({ weather: 'rain' }, /트리 날씨/, '트리 날씨');
  card.world = 'steampunk';
  const ph = C.check([{ ...c0, use: 'phone_selfie' }], card, []);
  assert(ph.some(e => /phone_selfie 는 steampunk 에서 안 쓴다/.test(e)), '스팀펑크 셀카');
}
console.log(`PASS 일상컷 묶음 계획기: 서울 ${n} 묶음(세 세계 × 씨앗 셋)이 일곱 장(장면 다섯 + 자유 설계 둘) · 묶음 규칙 · 노출 갈래(세계마다 다르게) · 상황 노출 · 장면 겹침 0 · 자세 겹침 0(세계끼리도) · 시간 · 계절 · 날씨는 서울 표 안 · 그 세계 장면 글 · 소품 · 옷의 결 · 금지 낱말 0, 직업컷 셋(자세 서로 다르게), 있는 두 장 위에 세 장, 같은 씨앗 같은 답, 틀린 칸 여섯`);
