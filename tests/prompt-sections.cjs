/* 칸 꼴 세계 그림 — 화풍이 core 칸 틀(AtelierSpec.CORE_FRAME, 화풍공방 core v4~)로 짓는다(원소 공방 2026-11-11 3단계에서 옮김, 도시 꼴 2026-11-19 Task 3).
   글은 짧은 판 그대로 칸에 나눠 싣고, 원소 때 정한 걸림 다섯: ① 빛 한 줄 ② 얼굴 비율 줄 「described below」 ③ 노출 줄은 세계 옷 말투 그대로(「WORLD describes」 없음)
   ④ 「No …」 금지는 5칸 Avoid ⑤ 5칸에서 손가락 말 빼기(해부 줄과 겹침). 옛 줄 이름(WORLD · SILHOUETTE · CONCEPT · TIME & WEATHER · EXPOSURE · CITY MOTIF …)이 남지 않는다.
   도시 칸: 3칸에 의상 · 도시 motif · 세계 표지 · 색 · 손에 드는 것 · 노출, 4칸에 그 세계의 그 도시 · 장면. 화풍은 미정(Task 11)이라 살아 있는 화풍 전부로 본다.
   Run: node tests/prompt-sections.cjs */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const ctx = { window: {}, console }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const T = ctx.window.AtelierSpec, P = ctx.window.AtelierPrompt, CF = T.CORE_FRAME;
const D = JSON.parse(fs.readFileSync('data/city-design.json', 'utf8')), S = JSON.parse(fs.readFileSync('data/style.json', 'utf8'));
assert(CF && CF.s1 && CF.anatomy && CF.avoid, 'core 칸 틀(CORE_FRAME) — core v4 블록');
const LIVE = Object.keys(S.styles).filter(k => !S.styles[k].retired);
let n = 0, maxW = 0;
for (const style of LIVE) {
  assert(P.worldSectionsOn(S, style), style + ' 는 칸 꼴');
  const styleNo = P.splitNo(P.shortStyle(S, style));
  for (const key of P.cards(D)) for (const w of P.worldsOf(D, key)) {
    const t = P.build(D, S, key, w, { style }), B = t.split('\n\n'), id = key + ' ' + w + ' ' + style, lines = t.split('\n');
    assert.equal(B.length, 6, id + ' 머리말 + 다섯 칸');
    assert(B[0].startsWith('A full-body vertical 2:3 (1024×1536) character card image of an adult ' + D.cities.find(c => c.key === key).people.en + ' woman — the personification of the city of ') && !/ Age: /.test(B[0]), id + ' 머리말(나이는 2칸 · 그 나라 사람)');
    assert(B[1].includes(T.WORLD_SHORT.beauty) && B[1].indexOf(T.WORLD_SHORT.beauty) > B[1].indexOf(styleNo.text), id + ' 1칸 — 화풍 뒤 미형 · 다른 얼굴 줄');
    assert.deepEqual(B.slice(1).map(b => b.split('\n')[0]), [CF.s1, CF.s2, CF.s3.replace('{costume}', 'COSTUME').replace('{genre}', T.WORLDS.find(x => x.key === w).en), CF.s4, CF.s5], id + ' 칸 머리 차례');
    assert(B[1].includes(styleNo.text) && B[1].includes('described below') && !B[1].includes('described above'), id + ' 1칸 — 화풍 · 얼굴 비율(②)');
    assert(/^Age: /m.test(B[2]) && /^Face — her own: /m.test(B[2]) && /^Body and hair: /m.test(B[2]) && B[2].endsWith(CF.anatomy), id + ' 2칸 — 나이 · 얼굴 · 몸과 머리 · 해부');
    assert(/^Costume: /m.test(B[3]) && /^City motif: /m.test(B[3]) && /^World marks on her: /m.test(B[3]) && /^Colours: /m.test(B[3]) && /^Prop: in one hand she holds /m.test(B[3]) && /^Exposure \(/m.test(B[3]) && !B[3].includes('WORLD describes'), id + ' 3칸 — 의상 · motif · 표지 · 색 · 소품 · 노출(③)');
    assert(/^World: /m.test(B[4]) && /^This card: /m.test(B[4]) && /^Pose: /m.test(B[4]) && /^Composition: /m.test(B[4]), id + ' 4칸 — 세계 · 장면 · 자세 · 구도');
    assert.equal(lines.filter(l => /^Light: /.test(l)).length, 1, id + ' 빛 줄 하나(①)');
    assert(/^One figure only; no text/m.test(B[5]) && !/five fingers/.test(B[5]) && /^Avoid: /m.test(B[5]), id + ' 5칸 — 손가락 말 없음 · Avoid(④⑤)');
    assert(!lines.some(l => !/^Avoid: /.test(l) && /(?:^|[.;:] )No [a-z]/.test(l) && !/unless/.test(l)), id + ' 「No …」 금지 문장은 Avoid 로(조건 unless 마디만 남김)');
    assert(!/\b(?:CONCEPT|WORLD|SILHOUETTE|TIME & WEATHER|TRAITS|EXPOSURE|IDENTITY|CITY MOTIF|WORLD MARKS|PROP|SETTING)\b/.test(t) && !/\.\./.test(t) && !/: \./.test(t), id + ' 옛 줄 이름 · 찌꺼기 없음');
    const wc = t.split(/\s+/).length; maxW = Math.max(maxW, wc); assert(wc > 450 && wc < 950, id + ' 낱말 ' + wc);
    n++;
  }
}
/* 스팀펑크 HAIR 조각은 2칸 Hair 줄로, 고른 시간대가 있으면 빛 줄이 그것을 가리킨다 */
const sp = P.build(D, S, 'seoul', 'steampunk', {});
assert(/^Hair: her hair is worn exactly as described above/m.test(sp) && /^Costume: gaslamp-fantasy dress of a storybook steam city/m.test(sp) && /^Avoid: [^\n]*armor plates/m.test(sp), '서울 스팀펑크 — Hair 줄 · 의상 글 · 금지는 Avoid');
const times = T.WORLD_TIMES || [];
const tt = P.build(D, S, 'seoul', 'steampunk', { shot: { time: times[0].key } });
assert(tt.includes(times[0].en.replace(/^TIME & WEATHER:/, 'Time & weather:')) && /unless the time and weather above say otherwise/.test(tt), '시간대를 고르면 빛 줄이 그것을 따른다');
/* 시간대 · 덧붙임을 고른 판 — 4칸 줄 이름도 칸 꼴. 칸 꼴을 끈 옛 꼴(줄 꼴)은 옛 이름 그대로 */
const ts = P.build(D, S, 'seoul', 'steampunk', { shot: { time: times[0].key }, notes: { scene: 'a windy ridge' } }), T4 = ts.split('\n\n')[4];
assert(/^Time & weather: /m.test(T4) && /^Scene note: a windy ridge$/m.test(T4) && !/TIME & WEATHER|SCENE NOTE/.test(ts), '시간대 · 덧붙임 — 4칸에 칸 꼴 이름');
const SO = Object.assign({}, S, { worldSections: false, worldShort: false }), to = P.build(D, SO, 'seoul', 'steampunk', { shot: { time: times[0].key }, notes: { scene: 'a windy ridge' } });
assert(!P.worldSectionsOn(SO, SO['default']) && to.includes(times[0].en) && to.includes('SCENE NOTE: a windy ridge') && /^CITY MOTIF of Seoul, worn on her: /m.test(to) && /^WORLD MARKS, carried on her clothes, body, props and light: /m.test(to), '칸 꼴을 끈 줄 꼴 — 옛 이름 그대로 · 도시 줄');
console.log('PASS 칸 꼴 세계 그림: ' + n + '장(화풍 ' + LIVE.length + ') · 칸 머리 = core 칸 틀 · 걸림 다섯 · 도시 칸(motif · 표지 · 소품) · 옛 줄 이름 없음 · 가장 긴 것 ' + maxW + '낱말');
