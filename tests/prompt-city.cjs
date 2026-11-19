/* 지시문 조립(lib/prompt-city.js) — 도시 한 층 · 세 세계(계획 Task 3).
   서울 × 세 세계 세계 그림(kind 'world')이 (a) 그 세계 표지(vocab.markers.<세계>.en) 셋 이상 (b) 서울 motif.en (c) 그 사람 머리색 낱말을 싣고,
   (d) 그 세계 banned_en 낱말이 하나도 없다 — 금지 줄(sections.negative, 칸 꼴 5칸의 「Avoid:」 한 줄)만 빼고 본다. 금지 낱말을 「no …」 로 적는 곳은 그 줄뿐이다
       (원소 조립기의 칸 꼴이 「No …」 금지를 5칸 Avoid 로 모으는 꼴을 따랐다 — 판타지 옷 말투의 「no machinery」 는 Avoid 로 간다).
   (e) 상표 · 실존 인물 이름(아래 작은 표)이 없다 (f) world 가 mecha(세 세계 밖)면 던진다 (g) 설계 미정 도시는 던지지 않고 { text: '', missing: ['worlds'] }.
   살아 있는 화풍(retired 아닌 것) 전부로 본다 — 기본 화풍은 미정(style.json undecided, Task 11)이라 한 화풍에 묶지 않는다.
   Run: node tests/prompt-city.cjs */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const T = ctx.window.AtelierSpec, P = ctx.window.AtelierPrompt, PC = ctx.window.PromptCity;
const D = JSON.parse(fs.readFileSync('data/city-design.json', 'utf8')), S = JSON.parse(fs.readFileSync('data/style.json', 'utf8'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const word = (w, flags) => new RegExp('\\b' + esc(w) + '\\b', flags);

/* 상표 · 실존 인물 이름 — 서울 상징 · 설계에서 새기 쉬운 것(남산 송신탑의 상표 이름, 대기업 · 가게, 왕 · 장군 · 가수). 대소문자 그대로 낱말 경계로 본다 */
const NAMES = ['YTN', 'N Seoul Tower', 'Seoul Tower', 'Lotte', 'Samsung', 'Hyundai', 'Kia', 'LG', 'Starbucks', 'Coca-Cola', 'Nike', 'Adidas', 'Apple', 'Gucci', 'Chanel',
  'Disney', 'Pokemon', 'Hello Kitty', 'BTS', 'BLACKPINK', 'Sejong', 'Yi Sun-sin', 'Taejo', 'Gojong', 'Heungseon'];

/* 세계 사전 — 정확히 세 세계, 표와 설계표가 같다 */
assert(same(D.vocab.worlds, ['fantasy', 'steampunk', 'cyberpunk']) && same(T.WORLDS.map(w => w.key), D.vocab.worlds), '세계 열쇠 셋(mecha 없음)');
assert(same(Object.keys(T.SILHOUETTES), D.vocab.worlds) && same(Object.keys(T.SILHOUETTE_HEAD), D.vocab.worlds) && same(Object.keys(T.WORLD_SHORT.guard), D.vocab.worlds), '실루엣 · 머리 · 가드도 세 세계');
assert(!/\bmecha\b/i.test(JSON.stringify(T.WORLDS) + JSON.stringify(T.SILHOUETTES) + JSON.stringify(T.EXPOSURE_LAYER)), '표에 mecha 가 남았다');
assert(S.undecided === true, '화풍 판 undecided(Task 11 에서 푼다)');

const LIVE = Object.keys(S.styles).filter(k => !S.styles[k].retired);
assert(LIVE.includes(S.default), '기본 화풍이 살아 있다');
const seoul = D.cities.find(c => c.key === 'seoul');
let n = 0;
for (const style of LIVE) for (const w of D.vocab.worlds) {
  const id = style + ' ' + w, r = PC.build({ design: D, styles: S, city: 'seoul', world: w, style, kind: 'world' }), t = r.text, sw = seoul.worlds[w], mk = D.vocab.markers[w];
  assert(t.length > 2000 && !r.missing, id + ' 지어진다 ' + t.length);
  assert.equal(t, P.build(D, S, 'seoul', w, { style }), id + ' PromptCity.build = AtelierPrompt.build(생성기가 부르는 것)');
  /* sections — 칸 꼴 이름, 화풍 미정 표시 */
  assert.equal(r.sections.style_undecided, true, id + ' style_undecided');
  if (P.worldSectionsOn(S, style)) {
    assert(same(Object.keys(r.sections), ['style_undecided', 'head', 's1', 's2', 's3', 's4', 's5', 'negative']), id + ' sections 열쇠 ' + Object.keys(r.sections));
    assert.equal([r.sections.head, r.sections.s1, r.sections.s2, r.sections.s3, r.sections.s4, r.sections.s5].join('\n\n'), t, id + ' sections 를 이으면 지시문');
    assert(/^Avoid: /.test(r.sections.negative) && r.sections.s5.includes(r.sections.negative), id + ' 금지 줄은 5칸 Avoid');
  }
  const body = r.sections.negative ? t.replace(r.sections.negative, '') : t;
  /* (a) 세계 표지 셋 이상 — 사람에게 싣는 문장(세계 표지 줄)으로 */
  const hits = mk.en.filter(x => t.includes(x));
  assert(hits.length >= 3, id + ' (a) 표지 ' + hits.length);
  assert(/^(?:World marks on her|Her world, carried on her|WORLD MARKS, carried on her clothes, body, props and light): /m.test(t), id + ' (a) 표지를 사람에게 싣는 줄');
  /* (b) 서울 motif · (c) 머리색 낱말 · 장면 · 손에 드는 것 · 그 세계의 서울 */
  assert(t.includes(sw.motif.en.replace(/\.$/, '')), id + ' (b) motif');
  assert(t.includes(T.VOCAB_EN.hair_color[sw.look.silhouette.hair_color]), id + ' (c) 머리색 ' + sw.look.silhouette.hair_color);
  assert(t.includes(sw.scenes[0].en) && t.includes(sw.hold.en) && t.includes(sw.en), id + ' 첫 장면 · hold · 세계 글');
  /* (d) 금지 낱말 — 금지 줄 밖에 없다 */
  for (const b of mk.banned_en) assert(!word(b, 'i').test(body), id + ' (d) 금지 낱말 「' + b + '」');
  /* (e) 상표 · 사람 이름 */
  for (const nm of NAMES) assert(!word(nm).test(t), id + ' (e) 이름 「' + nm + '」');
  /* 장르 이름에 기대지 않는다 — 세계 줄 머리에 장르 낱말이 없다(3칸 머리 「COSTUME — FANTASY」 같은 칸 이름은 둔다) */
  assert(!/\b(?:high-fantasy|steampunk|cyberpunk)\b/i.test(body.replace(/^3\. COSTUME — [A-Z]+$/m, '')), id + ' 장르 이름');
  assert(!/[가-힣]/.test(t) && !/\b(?:element|atomic|Nation|House|citizen)\b/.test(t) && !/\bmecha\b/i.test(t), id + ' 한국어 · 원소 말');
  assert(!/\.\./.test(t) && !/: \./.test(t) && !/\bundefined\b/.test(t), id + ' 찌꺼기');
  n++;
}
/* 장면 · 시간 · 자세 · 실루엣을 고르면 그것 */
{
  const sc = seoul.worlds.cyberpunk.scenes[2], sil = T.SILHOUETTES.cyberpunk[0];
  const t = P.build(D, S, 'seoul', 'cyberpunk', { shot: { scene: sc.key, time: 'night', pose: 'kneel', frame: sil.key } });
  assert(t.includes(sc.en) && !t.includes(seoul.worlds.cyberpunk.scenes[0].en) && t.includes(sil.en) && /Time & weather: night/.test(t) && t.includes('Down on one knee'), '고른 장면 · 시간 · 자세 · 실루엣');
  assert(T.SILHOUETTES.cyberpunk.length >= 6, '사이버펑크 실루엣');
}
/* 노출 단계 — 설계표 vocab.wear 의 그 세계 말투 */
for (const w of D.vocab.worlds) for (const k of ['low', 'moderate', 'bold']) {
  const t = P.build(D, S, 'seoul', w, { look: { exposure: k } }), want = D.vocab.wear[w][k].replace(/^EXPOSURE/, 'Exposure').replace(/Chest and pelvis covered/g, 'Intimate areas covered');
  assert(t.includes(want), w + ' 노출 ' + k);
}
/* 직접 고른 외형이 설계를 이긴다 */
{
  const t = P.build(D, S, 'seoul', 'fantasy', { look: { params: { 'hair color': 'silver' } } });
  assert(t.includes('Chosen look (overrides the automatic look): hair color: silver.') && !t.includes(T.VOCAB_EN.hair_color.navy), '고른 머리색');
}
/* (f) 세 세계 밖은 던진다 */
for (const bad of ['mecha', 'modern', '', undefined]) {
  assert.throws(() => PC.build({ design: D, styles: S, city: 'seoul', world: bad }), /unknown world/, '(f) ' + bad);
  assert.throws(() => P.build(D, S, 'seoul', bad, {}), /unknown world/, '(f) AtelierPrompt ' + bad);
}
/* (g) 설계 미정 도시 — 던지지 않고 비운다(mecha 는 먼저 던진다) */
const undesigned = D.cities.filter(c => !Object.keys(c.worlds || {}).length);
assert(undesigned.length === 9, '설계 미정 아홉');
for (const c of undesigned) for (const w of D.vocab.worlds) {
  const r = PC.build({ design: D, styles: S, city: c.key, world: w });
  assert(r.text === '' && same(r.missing, ['worlds']), '(g) ' + c.key + ' ' + w);
  assert.equal(P.build(D, S, c.key, w, {}), '', c.key + ' 생성기 쪽도 빈 글');
  assert(same(P.worldsOf(D, c.key), []), c.key + ' 사는 세계 없음');
}
assert.throws(() => PC.build({ design: D, styles: S, city: 'atlantis', world: 'fantasy' }), /unknown city/);
/* 일상컷 갈래는 Task 4 자리 */
assert.throws(() => PC.build({ design: D, styles: S, city: 'seoul', world: 'fantasy', kind: 'casual' }), /Task 4/);
/* 카드 = 도시 */
assert(same(P.cards(D), D.cities.map(c => c.key)) && P.card(D, 'seoul').tier === 'city' && same(P.worldsOf(D, 'seoul'), D.vocab.worlds) && P.card(D, 'seoul-x') === null, '카드 = 도시 열쇠');
const rec = P.record(D, S, 'seoul', 'steampunk', {});
assert(rec.atelier === 'city' && rec.styleUndecided === true && rec.file === 'seoul_steampunk_' + S.default + '_f.webp' && rec.prompt === P.build(D, S, 'seoul', 'steampunk', {}), '기록');
/* GPT 임의 설계 주문(tools/prompt-pack.cjs) — 도시 말, 원소 말 없음 */
for (const w of D.vocab.worlds) { const f = P.buildWorldFree(D, S, 'seoul', w, {}); assert(f.includes(seoul.worlds[w].motif.en.replace(/\.$/, '')) && !/\b(?:element|atomic|mecha)\b/i.test(f), w + ' 임의 설계 주문'); }
console.log('PASS 지시문 조립: 서울 × 세 세계 × 화풍 ' + LIVE.length + ' = ' + n + '장 — 표지 · motif · 머리색 · 금지 낱말(Avoid 줄 밖) · 이름 · mecha 던짐 · 설계 미정 ' + undesigned.length + '곳 · 노출 · 고른 칸');
