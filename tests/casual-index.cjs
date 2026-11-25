/* 일상컷 색인(tools/casual-index.cjs, 2026-11-25) — 시험 그림 저장소(fixture)로:
   꼴(세 공방과 같은 칸 + 끝에 장면 풀이 s) · 우리 값 한글 · 계획 파일 필수 표시(도시 생활 · 노출 갈래 · 코스프레 · 상황 · 90번) · 자유 설계 Outfit 줄 ·
   장면 풀이(둘째 줄 · 더 보기, 시간대 · 계절 · 날씨는 도시 표, 손 · 받침 · 고개 없음, 옛 기록은 있는 칸만) · 계획 · 세계 그림 기록은 줄이 아님 · 줄이 같으면 안 쓰기.
   node tests/casual-index.cjs */
'use strict';
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), assert = require('node:assert/strict');
const X = require('../tools/casual-index.cjs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'city-casual-index-')), S = 'kr_drawn_rim_dewy';
function put(card, file, obj) { const d = path.join(tmp, 'records', card); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, file), JSON.stringify(obj)); }
const rec = (n, scene, extra = {}) => ({ atelier: 'city', card: 'seoul', world: 'fantasy', style: S, scene: { treeV: 2, aspect: '2:3', ...scene }, imported: extra.imported || '2026-11-24', generation: extra.generation || {}, prompt: extra.prompt || '', ...(extra.own ? { own: extra.own } : {}) });
const base = { era: 'now', posture: 'stand', support: 'none', body: 'front', head: 'tilt', camera: 'eye', right: 'prop', left: 'out', gaze: 'camera', expr: 'calm' };

put('seoul', 'fantasy-casual-plan.json', { card: 'seoul', world: 'fantasy', style: S, required: 'life:hangang_picnic · lingerie · swimwear · cosplay:tekken_8/Asuka/bodysuit · situ:wind · ofree',
  cuts: [{ n: 1, lifeMust: true }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 }] });
put('seoul', `fantasy-casual1.${S}-ui.json`, rec(1, { ...base, place: 'seoul_hangang_picnic', ofam: 'everyday', item: 'jeans_tee', color: 'pastel', frame: 'waist_up', use: 'cup_hold', prop: 'cup',
  time: 'night_out', season: 'spring', cityWeather: 'shower', light: 'side', ostyle: { material: 'satin' }, lifeMust: true }));
put('seoul', `fantasy-casual2.${S}-ui.json`, rec(2, { ...base, place: 'home_bedroom', ofam: 'lingerie', item: 'lace_set', frame: 'full_body' }));
put('seoul', `fantasy-casual3.${S}-ui.json`, rec(3, { ...base, place: 'home_living', ofam: 'game_cosplay', item: 'gc_bodysuit', frame: 'full_body', cosplay: { game: 'tekken_8', character: 'Asuka Kazama', cut: 'bodysuit', round: 1 } },
  { generation: { cosplay: { game: 'tekken_8', character: 'Asuka Kazama', cut: 'bodysuit' } } }));
put('seoul', `fantasy-casual4.${S}-ui.json`, rec(4, { ...base, place: 'street_park', ofam: 'everyday', item: 'jeans_tee', situ: 'wind', frame: 'three_quarter' }));
put('seoul', `fantasy-casual5.${S}-ui.json`, rec(5, { ofree: true, sfree: true, time: 'midday', season: 'autumn' },
  { generation: { free_design: 'FREE DESIGN: design the place, activity, pose, framing and outfit yourself.\nPlace: a rooftop garden\nActivity: …\nOutfit: a sage linen halter set' } }));
put('seoul', `fantasy-casual6.${S}-ui.json`, rec(6, { era: 'now', place: 'home_bedroom', ofam: 'swimwear' }));   /* 옛 기록 — 칸이 적다 */
put('seoul', `fantasy-casual90.${S}-ui.json`, rec(90, { ...base, place: 'street_rooftop', ofam: 'everyday', frame: 'full_body', own: 'fantasy', placeText: 'the beacon terrace' }, { own: { job_ko: '봉수대 봉화지기', level: 'bold' } }));
put('seoul', `fantasy.${S}-ui.json`, { card: 'seoul', world: 'fantasy' });   /* 세계 그림 기록 — 줄이 아니다 */
put('seoul', `fantasy-vista.${S}-api.json`, { card: 'seoul' });

const doc = X.build([{ name: 'city-atelier-img', dir: tmp }], { built: '2026-11-25T00:00:00Z' });
const row = n => doc.rows.find(r => r.n === n);

/* 꼴 — 세 공방과 같은 칸, s 는 끝에 있을 때만 */
assert.deepEqual(Object.keys(doc), ['version', 'atelier', 'built', 'source', 'rows']);
assert.equal(doc.atelier, 'city'); assert.deepEqual(doc.source, ['city-atelier-img']);
assert.equal(doc.rows.length, 7, '일상컷 일곱(계획 · 세계 그림 · 전경 기록은 줄이 아니다)');
const KEYS = ['card', 'name', 'world', 'worldKo', 'n', 'date', 'style', 'path', 'required', 'requiredKo', 'family', 'familyKo', 'item', 'itemKo', 'shade', 'shadeKo', 'cosplay', 'free'];
const S_KEYS = ['pl', 'act', 'fr', 'ex', 'gz', 'bd', 'cam', 'ln', 'lt', 'mo', 'cp', 'si', 'os', 'tm', 'ss', 'wt', 'era', 'ar', 'en'];
const HAN = /[가-힣]/;
for (const r of doc.rows) {
  assert.deepEqual(Object.keys(r).filter((k) => k !== 's' && k !== 'cls' && k !== 'clsKo'), KEYS, r.path + ' 칸');
  for (const k of ['required', 'family', 'item', 'shade', 'world']) if (r[k]) assert.match(r[k + 'Ko'] || '', HAN, `${r.path} ${k}Ko 는 한글`);
  if (!('s' in r)) continue;
  assert.equal(Object.keys(r).pop(), 's', 's 는 줄 끝');
  for (const [k, v] of Object.entries(r.s)) {
    assert.ok(S_KEYS.includes(k), r.path + ' s 칸 ' + k);
    if (k === 'en') { assert.equal(v, 1); continue; }
    assert.ok(typeof v === 'string' && v.trim() && !/undefined|null|\[object/.test(v), r.path + ' s.' + k);
    if (!['ln', 'ar'].includes(k) && !(r.s.en && ['pl', 'act', 'fr'].includes(k))) assert.match(v, v === '3/4' ? /^3\/4$/ : HAN, r.path + ' s.' + k + ' 한글');
  }
}
assert.equal(row(1).name, '서울'); assert.equal(row(1).worldKo, '판타지'); assert.equal(row(1).path, `city-atelier-img/records/seoul/fantasy-casual1.${S}-ui.json`);

/* 필수 — 계획 required 글 */
const req = Object.fromEntries(doc.rows.map(r => [r.n, r.required]));
assert.deepEqual(req, { 1: 'life', 2: 'lingerie', 3: 'cosplay', 4: 'situ', 5: null, 6: 'swimwear', 90: 'own' });
assert.equal(row(1).requiredKo, '도시 생활', '장면 이름은 둘째 줄(장소)이 말한다');
assert.equal(row(2).requiredKo, '노출 갈래(란제리풍)'); assert.match(row(4).requiredKo, /^상황 노출\(바람/);
assert.equal(row(90).requiredKo, '캐릭터만의 컷'); assert.equal(row(90).itemKo, '봉수대 봉화지기');

/* 첫 줄 — 갈래 · 옷 · 색, 코스프레, 자유 설계 */
assert.deepEqual([row(1).familyKo, row(1).itemKo, row(1).shade, row(1).shadeKo], ['평상복', '청바지 + 티셔츠', 'pastel', '파스텔']);
assert.deepEqual([row(3).cosplay.by, row(3).cosplay.character, row(3).cosplay.cutKo, row(3).item, row(3).shade], ['planner', 'Asuka Kazama', '바디수트', null, null]);
assert.deepEqual(row(5).free, { kind: 'ofree', kindKo: '옷 자유', outfit: 'a sage linen halter set' });

/* 장면 풀이 — 둘째 줄 + 더 보기(도시 생활 장면 · 시간대 · 계절 · 날씨는 도시 표 ko) */
assert.deepEqual(row(1).s, { pl: '한강공원 강변의 밤 돗자리 야식', act: '잔을 든다', fr: '허리 위', ex: '차분함', gz: '카메라', bd: '정면', cam: '눈높이', ln: '50mm 표준', lt: '옆 빛',
  os: '윤기 나는 새틴', tm: '저녁 밤', ss: '봄 벚꽃', wt: '지나가는 비', era: '그 세계의 하루', ar: '2:3' });
assert.deepEqual(row(5).s, { pl: 'a rooftop garden', en: 1, tm: '한낮', ss: '가을', ar: '2:3' }, '자유 설계 — GPT 가 채운 줄만(「…」 빈 칸은 뺀다), 시간 · 철은 우리 것');
assert.deepEqual(row(6).s, { pl: '침실', era: '그 세계의 하루', ar: '2:3' }, '옛 기록 — 있는 칸만');
assert.equal(row(90).s.act, '봉수대 봉화지기 일'); assert.equal('pl' in row(90).s, false, '캐릭터만의 컷 — 받침 장소는 싣지 않는다');

/* 차례 · 쓰기 */
for (let i = 1; i < doc.rows.length; i++) assert(doc.rows[i - 1].date >= doc.rows[i].date);
const out = path.join(tmp, 'casual-index.json');
assert.equal(X.write(doc, out), true); assert.equal(X.write({ ...doc, built: '2026-11-26T00:00:00Z' }, out), false, '줄이 같으면 안 쓴다');
assert.equal(fs.readFileSync(out, 'utf8').split('\n').length, 2, '한 줄 JSON');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`PASS 일상컷 색인(도시): 줄 ${doc.rows.length} · 꼴 · 한글 칸 · 계획 필수 표시 · 코스프레 · 자유 설계 · 장면 풀이 · 그대로 두기`);
/* 실루엣 갈래(2026-11-25) — cls 가 있으면 한글 clsKo 도 있다, 수영복 · 란제리 줄 가운데 얼마는 cls 를 가진다 */
{ const R = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'casual-index.json'), 'utf8')).rows; for (const r of R) if (r.cls) require('assert').ok(r.clsKo, 'clsKo ' + r.path); require('assert').ok(R.some((r) => r.cls), '실루엣 갈래 줄이 하나도 없다'); }
