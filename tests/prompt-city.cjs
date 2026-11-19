/* 지시문 조립(lib/prompt-city.js) — 도시 한 층 · 세 세계(계획 Task 3).
   서울 × 세 세계 세계 그림(kind 'world')이 (a) 그 세계 표지(vocab.markers.<세계>.en) 셋 이상 (b) 서울 motif.en (c) 그 사람 머리색 낱말을 싣고,
   (d) 그 세계 banned_en 낱말이 하나도 없다 — 금지 줄(sections.negative, 칸 꼴 5칸의 「Avoid:」 한 줄)만 빼고 본다. 금지 낱말을 「no …」 로 적는 곳은 그 줄뿐이다
       (원소 조립기의 칸 꼴이 「No …」 금지를 5칸 Avoid 로 모으는 꼴을 따랐다 — 판타지 옷 말투의 「no machinery」 는 Avoid 로 간다).
   (e) 상표 · 실존 인물 이름(아래 작은 표)이 없다 (f) world 가 mecha(세 세계 밖)면 던진다 (g) 설계 미정 도시는 던지지 않고 { text: '', missing: ['worlds'] }.
   살아 있는 화풍(retired 아닌 것) 전부로 본다 — 기본 화풍은 painterly_concept(2026-11-19 확정)이지만 임시 화풍도 고르개에 남아 한 화풍에 묶지 않는다.
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
assert(!S.undecided && S.default === 'painterly_concept', '화풍 확정 — 기본 painterly_concept, undecided 없음');

const LIVE = Object.keys(S.styles).filter(k => !S.styles[k].retired);
assert(LIVE.includes(S.default), '기본 화풍이 살아 있다');
const seoul = D.cities.find(c => c.key === 'seoul');
let n = 0;
for (const style of LIVE) for (const w of D.vocab.worlds) {
  const id = style + ' ' + w, r = PC.build({ design: D, styles: S, city: 'seoul', world: w, style, kind: 'world' }), t = r.text, sw = seoul.worlds[w], mk = D.vocab.markers[w];
  assert(t.length > 2000 && !r.missing, id + ' 지어진다 ' + t.length);
  assert.equal(t, P.build(D, S, 'seoul', w, { style }), id + ' PromptCity.build = AtelierPrompt.build(생성기가 부르는 것)');
  /* sections — 칸 꼴 이름, 화풍 미정 표시 */
  assert.equal(r.sections.style_undecided, false, id + ' style_undecided');
  assert(t.includes('adult ' + seoul.people.en + ' woman —') && t.includes(T.WORLD_SHORT.beauty), id + ' 그 나라 사람 · 미형 줄');
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
/* ══ 일상컷(kind 'casual', Task 4) — 그 세계의 서울의 하루 ══
   서울 × 세 세계 × 생활 장면 전부 × 살아 있는 화풍: 그 장면의 그 세계 글(Place) · 그 세계 소품(Around her) · 옷의 결 · 그 세계의 서울 줄,
   (d) 판타지 · 스팀펑크 금지 낱말은 맨 끝 Avoid 단락(sections.negative) 밖에 없다, 소품 낱말이 그 세계 것(phone → 판타지는 전령 수정, smartphone 없음) */
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const tree = J('data/casual-tree.json'), tree2 = J('data/casual-tree-v2.json'), LIFE = J('data/city-life.json'), PROPS = J('data/world-props.json');
const cas = (w, scene, style) => PC.build({ design: D, styles: S, city: 'seoul', world: w, style, kind: 'casual', casual: { scene, tree, tree2, life: LIFE, props: PROPS } });
let nc = 0;
for (const style of LIVE) for (const w of D.vocab.worlds) for (const s of LIFE.cities.seoul.scenes) {
  const id = 'casual ' + style + ' ' + w + ' ' + s.key, sw = s.worlds[w], mk = D.vocab.markers[w];
  const r = cas(w, { place: P.lifeKey('seoul', s.key), time: (s.times || [])[0], season: (s.seasons || ['autumn'])[0] }, style), t = r.text;
  assert(t.length > 1000 && !r.missing, id + ' 지어진다');
  assert.equal(t, P.buildCasual(D, S, 'seoul', { place: P.lifeKey('seoul', s.key), time: (s.times || [])[0], season: (s.seasons || ['autumn'])[0] }, { world: w, style, tree, tree2, life: LIFE, props: PROPS }), id + ' PromptCity = AtelierPrompt.buildCasual');
  assert.equal([r.sections.head, r.sections.body, r.sections.negative].filter(Boolean).join('\n\n'), t, id + ' sections 를 이으면 지시문');
  assert(t.includes('the same adult ' + seoul.people.en + ' woman') && t.includes(T.CASUAL.short.beauty), id + ' 일상컷 — 그 나라 사람 · 미형 줄');
  assert(t.includes('\nPlace: ' + sw.en.replace(/\.$/, '') + '.\n'), id + ' 그 장면의 그 세계 글');
  for (const k of sw.props) assert(t.includes(PROPS.props[k].worlds[w].en), id + ' 소품 ' + k);
  assert(t.includes(PROPS.clothes[w].en) && t.includes('World: an ordinary day in Seoul as her world knows it — ' + seoul.worlds[w].en.replace(/\.$/, '')), id + ' 옷의 결 · 그 세계의 서울');
  for (const o of D.vocab.worlds.filter(x => x !== w)) assert(!t.includes(sw.en === s.worlds[o].en ? '\u0000' : s.worlds[o].en), id + ' 다른 세계 글이 안 샌다');
  const body = r.sections.negative ? t.replace(r.sections.negative, '') : t;
  for (const b of mk.banned_en) assert(!word(b, 'i').test(body), id + ' (d) 금지 낱말 「' + b + '」');
  if (mk.banned_en.length) assert(/^Avoid: /.test(r.sections.negative) && r.sections.negative.includes(mk.banned_en.join(', ')), id + ' 그 세계 금지 낱말은 Avoid 단락에');
  assert(!/(?:cape|crown|pauldrons?|tiara|regalia)/i.test(body) && !/Her city/.test(t) && !t.includes(mk.en[0]), id + ' 일상컷에 세계 그림용 motif 가 없다');
  for (const nm of NAMES) assert(!word(nm).test(t), id + ' (e) 이름 「' + nm + '」');
  assert(!/[가-힣]/.test(t) && !/\b(?:element|kingdom|atomic|mecha)\b/i.test(t) && !/\bundefined\b/.test(t) && !/\.\./.test(t), id + ' 한국어 · 원소 말 · 찌꺼기');
  nc++;
}
/* 소품 사전 — 트리 소품 동작의 물건도 그 세계 낱말(PROP 줄) */
for (const w of D.vocab.worlds) {
  const r = cas(w, { place: 'seoul_subway_commute', frame: 'waist_up', right: 'prop', use: 'phone_look' }), pl = (r.text.match(/^PROP: .*$/m) || [''])[0];
  assert(pl.includes(PROPS.props.phone.worlds[w].en) && !/\bsmartphone\b/i.test(r.text.replace(r.sections.negative, '')), w + ' 휴대폰 → ' + PROPS.props.phone.worlds[w].en + ' — ' + pl);
}
assert(/messenger crystal/.test(PROPS.props.phone.worlds.fantasy.en) && /telegraph/.test(PROPS.props.phone.worlds.steampunk.en) && /holographic/.test(PROPS.props.phone.worlds.cyberpunk.en), '휴대폰 사전');
/* 같은 장면이 세 세계로 — 세 글이 다 다르다 */
for (const s of LIFE.cities.seoul.scenes) assert.equal(new Set(D.vocab.worlds.map(w => s.worlds[w].en)).size, 3, s.key + ' 세 세계 글이 서로 다르다');
/* 생활 장면 → 트리 장소(lifeTree) — 받침은 base 것, 땅은 서울, 다른 도시 카드엔 안 뽑힌다 */
{
  const t2 = P.lifeTree(tree2, tree, LIFE), s = LIFE.cities.seoul.scenes[0], k = P.lifeKey('seoul', s.key);
  assert(t2 !== tree2 && P.lifeTree(tree2, tree, LIFE) === t2 && !tree2.places[k], 'lifeTree — 사본 · 메모 · 원본은 그대로');
  assert(same(t2.places[k], tree2.places[s.base]), '받침은 base 것');
  assert(same(t2.place_lands[k], ['seoul']), '땅은 서울');
  const C2 = ctx.window.AtelierCasualTreeV2, T2 = C2.make(t2, tree);
  assert(C2.choices(T2, { era: 'now' }, 'place', { land: 'seoul' }).includes(k) && !C2.choices(T2, { era: 'now' }, 'place', { land: 'tokyo' }).includes(k), '서울 카드에만');
  assert.equal(P.lifeScene(LIFE, k).key, s.key);
}
/* 세 세계 밖 · 설계 미정은 세계 그림과 같이 */
assert.throws(() => cas('mecha', {}), /unknown world/);
assert(same(PC.build({ design: D, styles: S, city: 'tokyo', world: 'fantasy', kind: 'casual', casual: { tree, tree2, life: LIFE, props: PROPS } }).missing, ['worlds']), '설계 미정 도시 일상컷');
/* 카드 = 도시 */
assert(same(P.cards(D), D.cities.map(c => c.key)) && P.card(D, 'seoul').tier === 'city' && same(P.worldsOf(D, 'seoul'), D.vocab.worlds) && P.card(D, 'seoul-x') === null, '카드 = 도시 열쇠');
const rec = P.record(D, S, 'seoul', 'steampunk', {});
assert(rec.atelier === 'city' && rec.styleUndecided === false && rec.file === 'seoul_steampunk_' + S.default + '_f.webp' && rec.prompt === P.build(D, S, 'seoul', 'steampunk', {}), '기록');
/* GPT 임의 설계 주문(tools/prompt-pack.cjs) — 도시 말, 원소 말 없음 */
for (const w of D.vocab.worlds) { const f = P.buildWorldFree(D, S, 'seoul', w, {}); assert(f.includes(seoul.worlds[w].motif.en.replace(/\.$/, '')) && !/\b(?:element|atomic|mecha)\b/i.test(f), w + ' 임의 설계 주문'); }
console.log('PASS 지시문 조립: 서울 × 세 세계 × 화풍 ' + LIVE.length + ' = ' + n + '장 — 표지 · motif · 머리색 · 금지 낱말(Avoid 줄 밖) · 이름 · mecha 던짐 · 설계 미정 ' + undesigned.length + '곳 · 노출 · 고른 칸; ' +
  '일상컷 ' + nc + '장(서울 × 세 세계 × 생활 장면 ' + LIFE.cities.seoul.scenes.length + ' × 화풍) — 그 세계 장면 글 · 소품 · 옷의 결 · 금지 낱말(Avoid 단락 밖) · 휴대폰 사전 · lifeTree');
