/* 전경 지시문(2026-11-24 — lib/prompt-city.js buildVista · PromptCity.vista, 글은 lib/prompt-spec.js T.VISTA, 도구 tools/vista-prompt.cjs).
   설계된 도시 모두 × 설계된 세계 × 살아 있는 화풍으로 짓고 본다:
   (a) 머리 줄 = 그 도시 en + 세계 결 이름, 장소 줄 = 설계표 worlds.<세계>.en 그대로, 3:2 Output 줄 · 아래 1/4 잔잔하게(카드 자리) 줄 · 「No people … no text …」 줄
   (b) 날 열쇠가 없다(「{…}」 · undefined · 밑줄 낀 열쇠 · 세계 · 화풍 열쇠 낱말 밖의 열쇠) (c) 상표 · 실존 인물 이름(tests/prompt-city.cjs 의 NAMES 그대로)이 없다
   (d) 그 세계 금지 낱말(그 도시 unban_en 뺌)은 Avoid 줄에만 — 옷 낱말은 Avoid 에도 없다(사람이 없는 그림) · 그 도시가 뺀 낱말은 Avoid 에 없다
   (e) 400 낱말 이하 (f) 파일 이름 <도시>_<세계>_<화풍>_vista.webp 가 등록기의 전경 꼴 (g) 랜드마크 카드 · mecha 는 던지고, 설계 전 도시는 { text: '', missing }
   (h) 그림 저장소가 옆에 있으면 서울 기록(records/seoul/<세계>-vista.<화풍>-api.json)의 prompt 가 지금 조립기 글과 글자 하나까지 같다 — 그린 글과 조립기가 갈라지면 잡는다.
   Run: node tests/prompt-vista.cjs */
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path'), assert = require('node:assert/strict');
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const T = ctx.window.AtelierSpec, P = ctx.window.AtelierPrompt, PC = ctx.window.PromptCity;
const D = JSON.parse(fs.readFileSync('data/city-design.json', 'utf8')), S = JSON.parse(fs.readFileSync('data/style.json', 'utf8'));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), word = (w, flags) => new RegExp('\\b' + esc(w) + '\\b', flags);
/* 상표 · 실존 인물 이름 — 지시문 검사의 표 하나를 그대로 읽는다(표를 둘로 두지 않는다) */
const NAMES = vm.runInNewContext('(' + fs.readFileSync('tests/prompt-city.cjs', 'utf8').match(/const NAMES = (\[[\s\S]*?\]);/)[1] + ')');
assert(NAMES.length > 100 && NAMES.includes('N Seoul Tower'), 'NAMES 표를 읽었다');
const VISTA_RE = /^(.+)_vista\.webp$/;   /* tools/register-images.py VISTA 와 같은 꼴 */
const reg = fs.readFileSync('tools/register-images.py', 'utf8');
assert(reg.includes('VISTA = re.compile(r"^(.+)_vista\\.webp$")'), '등록기의 전경 꼴이 이 검사와 같다');

const LIVE = Object.keys(S.styles).filter(k => !S.styles[k].retired), DESIGNED = D.cities.filter(c => Object.keys(c.worlds || {}).length);
assert(DESIGNED.length >= 16 && LIVE.includes(S.default), '설계된 도시 · 기본 화풍');
const CLOTH = new RegExp('\\b(?:' + T.VISTA.cloth.map(esc).join('|') + ')s?\\b', 'i');
let n = 0, maxWords = 0;
for (const c of DESIGNED) for (const w of D.vocab.worlds.filter(k => c.worlds[k])) for (const st of LIVE) {
  const id = `${c.key}/${w}/${st}`, t = P.buildVista(D, S, c.key, w, { style: st }), r = PC.vista({ design: D, styles: S, city: c.key, world: w, style: st });
  assert.equal(r.text, t, id + ' PromptCity.vista = buildVista');
  const B = t.split('\n\n');
  /* (a) 줄 */
  assert.equal(B[0], T.VISTA.head.replace('{city_en}', c.en).replace('{genre}', T.VISTA.genre[w]), id + ' 머리 줄');
  assert.equal(B[1], 'The place: ' + c.worlds[w].en.trim().replace(/[.;:]+$/, '') + '.', id + ' 장소 줄 = 설계표 세계 글');
  assert(B.includes(T.VISTA.composition) && /lower quarter of the picture calm/.test(t) && /interface cards can sit over it/.test(t), id + ' 아래 1/4 카드 자리');
  assert(B.includes(T.VISTA.none) && /^No people, no characters/.test(T.VISTA.none) && /no text, letters, numbers/.test(T.VISTA.none), id + ' 사람 · 글자 없음');
  assert.equal(B[B.length - 1], 'Output: one horizontal 3:2 image, 1536×1024.', id + ' 3:2 Output 줄이 맨 끝');
  assert(B.some(b => /^Style: \S/.test(b)), id + ' 화풍 줄');
  if (st === S.default) assert(B.includes('Style: ' + S.styles[st].versions.find(v => v.v === S.styles[st].current).vista), id + ' 기본 화풍은 판의 vista 칸 그대로');
  /* (b) 날 열쇠 */
  assert(!/\{\w+\}|undefined|\bnull\b|NaN|\[object/.test(t), id + ' 날 자리표시');
  assert(!/\b[a-z0-9]+_[a-z0-9_]+\b/.test(t), id + ' 밑줄 낀 열쇠 ' + (t.match(/\b[a-z0-9]+_[a-z0-9_]+\b/) || [])[0]);
  /* (c) 상표 · 실존 인물 */
  for (const x of NAMES) assert(!word(x).test(t), id + ' (c) 이름 「' + x + '」');
  /* (d) 금지 낱말 */
  const avoid = B.find(b => /^Avoid: /.test(b)) || '', body = t.replace(avoid, ''), unban = ((c.worlds[w].own_vocab || {}).unban_en || []);
  const banHere = (D.vocab.markers[w].banned_en || []).filter(b => !unban.includes(b));
  for (const b of banHere) assert(!word(b, 'i').test(body), id + ' (d) 금지 낱말 「' + b + '」 이 Avoid 밖에');
  const wantAvoid = banHere.filter(b => !CLOTH.test(b));
  assert.equal(avoid, wantAvoid.length ? 'Avoid: ' + wantAvoid.join(', ') + '.' : '', id + ' Avoid = 금지 낱말 − 옷 낱말');
  for (const b of banHere.filter(b => CLOTH.test(b))) assert(!word(b, 'i').test(avoid), id + ' 옷 낱말 「' + b + '」 은 Avoid 에 없다');
  for (const u of unban) assert(!word(u, 'i').test(avoid), id + ' 그 도시가 뺀 금지 낱말 「' + u + '」');
  /* (e) 길이 */
  const words = t.split(/\s+/).length; maxWords = Math.max(maxWords, words);
  assert(words <= 400, id + ' 400 낱말 이하 — ' + words);
  /* (f) 파일 이름 */
  assert.equal(r.file, `${c.key}_${w}_${st}_vista.webp`, id + ' 파일 이름');
  assert.equal(VISTA_RE.exec(r.file)[1], `${c.key}_${w}_${st}`, id + ' 등록기 전경 꼴');
  const rec = P.vistaRecord(D, S, c.key, w, { style: st });
  assert(rec.kind === 'vista' && rec.file === r.file && rec.prompt === t && rec.size.join('x') === '1536x1024' && rec.styleVersion === S.styles[st].current, id + ' 기록 바탕');
  n++;
}
/* 서울 판타지의 금지 낱말에 옷이 들어 있어 옷 거르기가 실제로 돈다 */
const sf = P.buildVista(D, S, 'seoul', 'fantasy');
assert(/Avoid: smartphone/.test(sf) && !/\b(?:hoodie|jeans|sneakers|cowboy hat|baseball cap|track pants)\b/.test(sf) && /skyscraper/.test(sf), '서울 판타지 Avoid — 옷 낱말 뺌');
/* (g) 랜드마크 · mecha · 설계 전 */
assert.throws(() => P.buildVista(D, S, 'seoul-haechi', 'fantasy'), /city keys only/, '랜드마크 카드에는 전경이 없다');
assert.throws(() => PC.vista({ design: D, styles: S, city: 'seoul', world: 'mecha' }), /unknown world/, 'mecha 는 던진다');
const D2 = JSON.parse(JSON.stringify(D)); D2.cities.find(c => c.key === 'rio').worlds = {};
assert.deepEqual(JSON.parse(JSON.stringify(PC.vista({ design: D2, styles: S, city: 'rio', world: 'fantasy' }))), { text: '', file: '', missing: ['worlds'] }, '설계 전 도시');
/* (h) 그린 글 = 조립기 글(그림 저장소가 옆에 있을 때) */
const recDir = path.join('..', 'city-atelier-img', 'records', 'seoul');
let drawn = 0;
for (const w of D.vocab.worlds) {
  const f = path.join(recDir, `${w}-vista.${S.default}-api.json`); if (!fs.existsSync(f)) continue;
  const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  assert.equal(r.prompt, P.buildVista(D, S, 'seoul', w), 'seoul/' + w + ' 기록의 지시문 = 지금 조립기');
  assert.equal(r.file, `seoul_${w}_${S.default}_vista.webp`, 'seoul/' + w + ' 기록의 파일 이름');
  drawn++;
}
console.log(`PASS 전경 지시문: ${DESIGNED.length}개 도시 × 세계 × 화풍 ${LIVE.length} = ${n}장(가장 긴 것 ${maxWords} 낱말) · 머리 · 장소 · 화풍 · 아래 1/4 · 사람 · 글자 없음 · 3:2 · 날 열쇠 · 이름 · 금지 낱말 · 옷 낱말 · 랜드마크 · mecha · 설계 전`
  + (drawn ? ` · 서울 그린 글 ${drawn}장 = 조립기` : ' · (그림 저장소 기록 없음 — 그린 글 견주기 건너뜀)'));
