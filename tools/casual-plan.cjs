#!/usr/bin/env node
/* 일상컷 묶음 계획 — 한 도시의 한 세계 일상컷 열 장을 서로 겹치지 않게 한 번에 짠다(원소 공방 계획기를 도시 꼴로, 2026-11-19 계획 Task 4 · 열 장 2026-11-20).
   일상컷 = 그 세계의 그 도시의 하루(설계 3-1절). 장소는 섞은 풀 — 그 도시의 생활 장면(data/city-life.json — 장면마다 트리 장소 <도시>_<장면>, lib/prompt-city.js lifeTree, Place 줄은 그 장면의 그 세계 글 · 소품은
   세계 소품 사전 data/world-props.json) ∪ 일반 장소(버전1 트리 data/casual-tree.json places, 시대 now — Place 줄은 그 장소 글 그대로, 세계는 World 줄(설계표 vocab.casual_world 「let the place itself carry this world …」)이 입힌다).
   시간 · 계절 · 날씨는 생활 장면표의 times · seasons.<도시> · weather.<도시>(생활 장면은 그 장면이 받는 것만, 일반 장소는 장소 특징 — 밤 장소는 밤 시간대, 실내는 날씨 없음).
   세계마다 열 장(사용자 2026-11-20 「노출 갈래를 다 필수로 해서 2장 더 늘리고, 게임 코스튬도 필수로」 · 「서울 장면은 일반장소랑 섞어 쓰면서 또 하나의 필수 컷으로」 · 「필수칸 두고 전부 섞자」):
     - 필수 다섯 — 생활 장면 컷(lifeMust — 그 도시 생활 장면에서만, 장면이 받는 의상 계열 아무거나 · 노출 갈래 · 코스프레 빼고, 가장 먼저 정한다) · 란제리풍 · 수영복 · 역할극 · 게임 코스프레
     - 보통 셋 — 의상 계열은 아래 규칙대로(노출 갈래 · 코스프레 빼고), 상황 노출(젖은 옷 · 바람 · …)은 늘 이 셋 가운데 한 장(원소 SITU_RATE = 1 꼴 — 필수 · 코스프레 · 자유 칸엔 없다)
     - 자유 설계 둘(sfree, 맨 뒤 번호) — 옷 자유(ofree) · 갈래 자유(gfree — 노출 갈래 셋 가운데 다른 세계 묶음이 덜 쓴 것, 상황은 'free', 그 갈래 필수 컷의 옷(gnot)은 안 쓰게 지시문에 적는다)
   장소 고르기(필수 · 보통 칸 — 자유 칸은 장소를 맡은 쪽이 짓는다): 그 칸의 의상 계열을 받는 곳만. 생활 장면 컷은 생활 장면에서만(먼저 — 뒤 칸이 장면을 다 써 버리지 않게),
     다른 칸은 반쯤(LIFE_FIRST) 생활 장면 먼저, 아니면 일반 장소 먼저 — 고른 쪽이 비면 다른 쪽. 일반 장소 글에 그 세계 금지 낱말(설계표 banned_en)이 들면 그 세계에선 안 쓴다.
     코스프레 칸은 그 계열을 적은 트리 장소(코스프레 행사 · 테마 행사장 · 오락실 · 거실 · 침실 · 댄스 무대, 비키니 · 원피스 수영복 재단이면 물가도) + 그 계열을 받는 생활 장면.
   지키는 묶음 규칙(한 세계 묶음 안, 장면 컷끼리):
     - 장소는 서로 다르게(생활 장면 · 일반 장소 통틀어 겹침 0), 장소 묶음은 두 번까지 · 의상 계열은 겹치지 않게(평상복만 두 번 · 동탄룩 한 장) · 생활 장면의 의상 계열은 장면표 outfits 안에서
     - 자세 추천은 서로 다르게(세계끼리도) · 프레이밍은 한 가지 두 번까지(먼 컷 · 가까운 컷 하나씩은 꼭) · 몸 방향 한 가지는 두 번까지 · 머리 「어깨 너머」 는 한 장까지
     - 노출 갈래 · 코스프레 컷은 얼굴 클로즈업이 아니다 · 상황 노출 컷도
     - 소품은 칸마다 다르게 · 그 도시의 물건(설계표 hold)을 든 컷은 한두 장 · 마실 것은 한 장까지 · ⚠ 어색한 조합은 한 장까지 · 그 세계에서 어색한 소품 동작(세계 소품 사전 not_uses)은 안 고른다
     - 판타지 · 스팀펑크는 그 세계 금지 낱말이 든 옷 · 일반 장소를 안 고른다
     - 옷 색 갈래 · 데니어(맞는 옷의 열에 여섯)를 나눠 준다(코스프레 컷은 없다 — 그 캐릭터 색). 목욕 차림은 세계 셋 통틀어 한 장
     - 세계끼리 같은 장소는 옷 계열이 다를 때만(같은 곳을 세 세계로) — 그래서 노출 갈래 · 코스프레 칸에 남는 곳이 없으면 그 필수 칸만 같은 계열도 된다 · 같은 자세 추천 · 같은 옷은 안 된다
     - 카드 사이에서도 안 쓴 쪽 먼저(--usage, 기본 옆의 city-atelier-img/records — 없으면 알리고 빈 기록으로) — 한 번도 안 쓴 값은 무게 12, 쓴 값은 1/(1+횟수)³
   게임 코스프레(원소 공방 2026-11-15 ~ 11-17 을 옮김): 목록 data/game-cosplay.json(원본 game-atelier — 고치지 않는다, 옆에 있으면 다를 때 경고). 쓴 것은 이 공방 그림 저장소(../city-atelier-img)의
     그린 기록 generation.cosplay + 아직 안 그린 계획 파일(<세계>-casual-plan.json)의 예약만 센다 — 없으면 계획기가 멈춘다(--cosplay-usage none 이면 빈 기록). 게임은 남은 인원의 제곱근 무게,
     캐릭터는 계획기가 정한다(등장인물 많은 게임 — 안 쓴 캐릭터 가운데 여자 2 · 남자 1 무게, 다 쓰면 2회차 — 쓴 캐릭터 중 덜 입은 하나 · 안 입은 재단). 장면 칸 cosplay = { game, character, cut, round }.
   이미 그림이 있는 번호는 짜지 않고, 그 세계의 기록(--records)은 겹침 검사에만 쓴다. --check 는 자유 설계 칸 기록에 채운 설계(generation.free_prompt)가, 게임 코스프레 칸 기록에 그린 코스프레(generation.cosplay)가 있는지도 본다.
   캐릭터만의 컷(90번)은 data/casual-own.json — 세계마다 한 장(묶음 장수에는 안 센다).

     node tools/casual-plan.cjs <도시> --world <세계>|all [--fresh] [--slots 1,2,3] [--records <그림 저장소>/records/<도시>] [--seed N] [--out <폴더>] [--usage <폴더>|none] [--cosplay-usage <저장소,…>|none]
     node tools/casual-plan.cjs <도시> --world <세계> --check <기록 폴더> [--from N]   # 올리기 전 */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = { window: {}, console }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(read(f), ctx);
const T = ctx.window.AtelierSpec, CT = ctx.window.AtelierCasualTree, C2 = ctx.window.AtelierCasualTreeV2, P = ctx.window.AtelierPrompt;
const D = JSON.parse(read('data/city-design.json')), S = JSON.parse(read('data/style.json'));
const tree = JSON.parse(read('data/casual-tree.json')), tree2 = JSON.parse(read('data/casual-tree-v2.json'));
const LIFE = JSON.parse(read('data/city-life.json')), PROPS = JSON.parse(read('data/world-props.json'));   /* 생활 장면표 · 세계 소품 사전(Task 4) */
const T2 = C2.make(P.lifeTree(tree2, tree, LIFE), tree), STYLE = S['default'];
/* 일상컷 열 장(사용자 2026-11-20 「포켓몬도 11장 까지 만드니까 그렇게 늘려도 되고」 — 필수 다섯 · 보통 셋 · 자유 설계 둘). 전엔 일곱(2026-11-11), 여섯(11-09), 다섯 */
const CASUAL_N = 10, RECENT_N = 8;
/* 생활 장면 먼저 고를 비율 — 필수 · 보통 칸이 생활 장면 쪽을 먼저 볼 확률(나머지는 일반 장소 먼저). 생활 장면 컷(lifeMust)은 늘 생활 장면 */
const LIFE_FIRST = 0.5;

const EXPOSE_TYPES = ['lingerie', 'swimwear', 'roleplay'];   /* 노출 갈래 — 셋 다 필수(2026-11-20, 전엔 세계마다 하나씩 돌려 가며) */
/* 묶음 칸 차례 — 생활 장면 컷(먼저) · 노출 갈래 셋 · 게임 코스프레 · 보통 셋 · 옷 자유 · 갈래 자유 */
const KINDS = ['life', ...EXPOSE_TYPES, 'cosplay', 'plain', 'plain', 'plain', 'ofree', 'gfree'], SCENE_N = KINDS.filter(k => k !== 'ofree' && k !== 'gfree').length;
const FAR = ['full_body', 'environmental'], NEAR = ['waist_up', 'chest_up', 'face_close'];   /* 2026-11-23 허리 위도 가까운 컷(사용자 「클로즈업을 가슴 위 아니면 허리 위까지해서 같이 묶는」) — 얼굴 클로즈업 여섯에 몰려 쉿 · 브이가 자주 나왔다 */
const FRAMES = Object.keys(tree2.frames).filter(k => k !== 'note' && k !== 'detail');
/* 일상컷 표정 후보 — 일상컷에 어색한 것은 계획기가 고르지 않는다(사용자 2026-11-03 「표정 관련 문구가 과하게」 · 「다 해줘」):
   웃는 입에 무표정한 눈 · 지루함 · 졸림 · 지침 · 짜증 · 시큰둥 · 눈을 질끈 감은 웃음. 생성기에서 손으로 고르는 것은 그대로 된다 */
/* 2026-11-03 「일상컷쪽이 더 그래」 — 빼는 목록 대신 고르는 목록으로. GPT 세션의 image_gen 은 결연함을 노려봄으로, 으쓱 · 장난을 한쪽 눈썹 + 비웃음으로,
   크게 웃음을 벌린 입으로, 호기심을 치켜든 눈썹으로, 관능을 반쯤 감은 눈으로 키웠다. 일상컷은 은은한 표정 열일곱에서만 */
const EXPR_CASUAL = ['calm', 'soft_smile', 'gentle', 'amused', 'pensive', 'wistful', 'nostalgic', 'confident', 'proud', 'focused', 'half_smile', 'candid', 'relieved',
  'wink', 'sensual', 'serious', 'curious'];   /* 같은 날 사용자 「윙크, 관능, 진지, 호기심 정도는 일상컷에 넣어줘」 */
const EXPR_SKIP = Object.keys(tree2.expressions || {}).filter(k => !EXPR_CASUAL.includes(k));
const EXPRS = EXPR_CASUAL.filter(k => (tree2.expressions || {})[k]);
/* 시대는 하나(now — 그 세계의 하루). 원소의 시대 무게 · 몫(지금 현실 · 현장 · 나라 안 · 무대)은 걷었다 */
const ERA = 'now';
const FIXED_AXES = { overall_intensity: 'strong', skin_exposure: 'bold' };
const DRINKS = ['cup', 'drink_glass', 'water_bottle', 'teapot'];
/* 상황 노출(사용자 2026-11-09 「1번 내용을 필수갈래에 넣어줘. 그러면 필수컷이 3장은 확정」 · 2026-11-20 보통 컷 한 장에 늘) — 보통 컷 한 장, 필수 · 코스프레 · 자유 칸이 아닌 컷에
   젖은 옷 · 바람 · 반쯤 푼 차림 · 흘러내린 어깨끈 중 그 옷에 맞는 것 하나(T.CASUAL.situations). 다른 세계 묶음이 쓴 상황은 뒤로 */
const SITUS = (T.CASUAL.situations || []).map(x => x.key);
const EXPOSE_NO_FRAME = ['face_close'];   /* 노출 갈래(란제리풍 · 수영복 · 역할극) 컷에 안 쓰는 구도 — hair_close 같은 얼굴 클로즈업 자세도 이 구도 */
const SITU_NO_FRAME = ['face_close'];   /* 얼굴 클로즈업엔 옷이 안 보여 상황이 안 산다(손상향 시험 계획 — 젖은 옷이 클로즈업에) */

/* ══ 게임 코스프레(원소 공방 2026-11-15 ~ 11-17 에서 옮김, 도시 2026-11-20 사용자 「게임 코스튬도 필수로 했었는데 그게 없네?」 — 일상컷 필수 다섯 중 하나).
   목록 data/game-cosplay.json(원본 game-atelier — 고치지 않는다): 게임 스물넷(주인공 하나 many: false — character · outfit 정해짐 / 등장인물 많음 many: true — characters) · 재단 열하나(cuts) · 글(text).
   고르는 규칙 — 「캐릭터 + 재단」 묶음이 한 단위, 쓴 기록은 이 공방 그림 저장소만(cosplayUsage):
     1. 게임은 남은 인원의 제곱근 무게로 무작위(다 찬 게임은 빠진다) 2. 주인공 하나 게임 — 그 주인공이 아직 안 입은 재단 → text.fixed
     3. 등장인물 많은 게임 1회차(목록 characters 가운데 아직 안 쓰고 예약도 안 된 캐릭터가 있을 때) — 계획기가 그 가운데 무작위로(여자 2 · 남자 1 — 남자는 크로스플레이), 재단은 그 게임에서 덜 쓴 것 → text.assigned
     4. 2회차(목록의 캐릭터를 모두 쓰거나 예약했을 때) — 쓴 캐릭터 중 덜 입은 하나와 그 캐릭터가 아직 안 입은 재단 → text.again. 다 차면 그 게임은 빠진다.
   「쓴 것」 = 그림 저장소의 그린 기록(generation.cosplay) + 아직 안 그린 계획 파일의 예약(cosplay 의 character 가 찬 것, 같은 도시 · 세계 · 번호는 한 번).
   장면 칸 cosplay = { game, character, cut, round }, 그린 뒤 기록 generation.cosplay = { game, character, cut }. 원소의 옛 계획용 pick 칸 · --recosplay 는 옮기지 않았다(도시는 아직 그린 일상컷이 없다) */
const COSPLAY = fs.existsSync(path.join(ROOT, 'data', 'game-cosplay.json')) ? JSON.parse(read('data/game-cosplay.json')) : { games: [], cuts: [], text: {} };
/* 게임 코스프레 사본이 원본(옆 game-atelier)과 다르면 알린다 — 게임을 더하고 sync 를 깜빡한 때(원소 2026-11-16) */
if (require.main === module) { try { const gcSrc = path.join(ROOT, '..', 'game-atelier', 'data', 'game-cosplay.json'), gcMine = path.join(ROOT, 'data', 'game-cosplay.json');
  if (fs.existsSync(gcSrc) && fs.existsSync(gcMine) && fs.readFileSync(gcSrc, 'utf8') !== fs.readFileSync(gcMine, 'utf8')) console.warn('경고: data/game-cosplay.json 이 게임공방 원본과 다르다(사본이 옛것) — 게임공방에서 node tools/game-cosplay.cjs sync 하고 이 저장소에서 커밋한다'); } catch (e) { /* 읽기 실패는 계획을 막지 않는다 */ } }
const COS_FAM = (tree.costume_required || {}).outfit || 'game_cosplay', COS_NO_FRAME = (tree.costume_required || {}).not_frames || ['face_close'];
const COS_CUTS = (COSPLAY.cuts || []).map(c => c.key);
const COS_SWIM = (COSPLAY.cuts || []).filter(c => /\b(?:bikini|swimsuit)\b/i.test(c.en)).map(c => c.key);   /* 비키니 · 원피스 수영복 — 물가(수영장 · 해변)도 된다 */
const isCosplay = c => !!c && c.ofam === COS_FAM;
const cosItem = cut => 'gc_' + cut, cutOfItem = item => ((CT.item(tree, COS_FAM, item) || {}).cut) || '';
const isWater = place => ((C2.place(T2, place) || {}).group) === 'water';
const cosCutOk = (cut, place) => !isWater(place) || COS_SWIM.includes(cut);
/* 코스프레 장소 — 일반 장소는 버전1 표에 그 계열을 적은 곳만(코스프레 행사 · 테마 행사장 · 오락실 · 거실 · 침실 · 댄스 무대 · 물가 — 버전2 표는 계열을 어디서나 받는다), 생활 장면은 장면표 outfits 에 그 계열이 있을 때 */
const cosPlace = place => lifeOf(place) ? famsAt(place).includes(COS_FAM) : ((CT.place(tree, place) || {}).outfits || []).includes(COS_FAM);
/* 쓴 기록을 읽는 그림 저장소 — 이 공방 것만(원소 2026-11-16 「공방별로 따로 두는건?」 → 「응 그렇게 진행해줘」 — 다른 공방과는 같은 캐릭터가 나올 수 있다). 없으면 계획기가 멈춘다 */
const COSPLAY_ROOTS = ['city-atelier-img'].map(d => path.join(ROOT, '..', d));
function cosplayReposOk(opt = {}) {
  if (opt['cosplay-usage']) return true;
  const miss = COSPLAY_ROOTS.filter(d => !fs.existsSync(path.join(d, 'records')));
  if (miss.length) throw new Error('게임 코스프레 — 이 공방 그림 저장소가 없다: ' + miss.map(d => path.basename(d)).join(' · ') + ' — 옆 폴더에 받은 뒤 다시(쓴 캐릭터를 몰라 겹친다). 일부러 비우려면 --cosplay-usage none');
  return true;
}
/* 한 기록의 코스프레 — generation.cosplay(그린 것), 없으면 scene.cosplay 의 character 가 찬 것 */
function cosplayRow(r) {
  const g = ((r || {}).generation || {}).cosplay, s = ((r || {}).scene || {}).cosplay, filled = x => x && x.game && String(x.character || '').trim();
  const x = filled(g) ? g : filled(s) ? s : null;
  return x ? { game: x.game, character: String(x.character).trim(), cut: x.cut || '' } : null;
}
/* 계획 파일 — records/<도시>/<세계>-casual-plan.json(· -replan …). 옛 판을 남겨 둔 것(original · initial · before …)과 history 폴더는 안 센다 */
const PLAN_FILE = /casual\d*[-.](?:re)?plan(?:ned)?\b[^/]*\.json$/, PLAN_OLD = /original|initial|before/;
/* 그림 기록 파일 이름 → 세계 · 번호(<세계>-casualN.<화풍>-ui.json) */
const REC_FILE = /^(?:(.+?)-)?casual(\d+)(?:\.[a-z0-9_]+)?-ui\.json$/;
const cutNo = c => Number(c && (c.n != null ? c.n : c.cut));
/* 쓴 코스프레 — 그림 저장소의 그린 기록 + 아직 안 그린 계획의 예약. 같은 도시 · 세계 · 번호가 기록에 있으면(그렸다) 계획은 안 센다.
   skip — 「<도시>|<세계>」 목록: 지금 다시 짜는 도시 · 세계의 옛 계획은 예약으로 안 센다. plans: false 면 기록만. 줄마다 at(파일) · plan(예약이면 true) */
function cosplayUsage(roots = COSPLAY_ROOTS, { skip = [], plans = true } = {}) {
  const out = [], drawn = new Set(), planned = new Map(), skipSet = new Set(skip), rel = f => path.relative(path.join(ROOT, '..'), f);
  const filled = x => x && x.game && String(x.character || '').trim() ? { game: x.game, character: String(x.character).trim(), cut: x.cut || '' } : null;
  const walk = (dir, depth, rootTag) => {
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) { if (depth < 3 && e.name !== 'history') walk(f, depth + 1, rootTag); continue; }
      const card = path.basename(dir), rm = REC_FILE.exec(e.name);
      if (rm) drawn.add(rootTag + '|' + card + '|' + (rm[1] || '') + '|' + Number(rm[2]));   /* 그렸다 — 그 번호의 계획은 끝난 것 */
      if (!/casual.*\.json$/.test(e.name)) continue;
      let txt; try { txt = fs.readFileSync(f, 'utf8'); } catch (er) { continue; }
      if (!txt.includes('"cosplay"')) continue;   /* 먼저 글로 거른다 */
      let r; try { r = JSON.parse(txt); } catch (er) { continue; }
      if (PLAN_FILE.test(e.name)) {
        if (!plans || PLAN_OLD.test(e.name) || !Array.isArray(r.cuts)) continue;
        const world = r.world || (/^([^.-]+)[.-]/.exec(e.name) || [])[1] || '', re = /replan/.test(e.name) ? 1 : 0;
        if (skipSet.has(card + '|' + world)) continue;
        for (const c of r.cuts) {
          const x = filled(c && c.cosplay); if (!x) continue;
          const k = rootTag + '|' + card + '|' + world + '|' + cutNo(c), was = planned.get(k);
          if (!was || re >= was.re) planned.set(k, { ...x, at: rel(f), plan: true, re });
        }
        continue;
      }
      const row = cosplayRow(r); if (row) out.push({ ...row, at: rel(f) });
    }
  };
  for (const r of [].concat(roots || [])) walk(fs.existsSync(path.join(r, 'records')) ? path.join(r, 'records') : r, 0, r);
  for (const [k, x] of planned) if (!drawn.has(k)) { const { re, ...row } = x; out.push(row); }
  return out;
}
const normName = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
/* 게임마다 쓴 수 · 재단마다 쓴 수 · 캐릭터마다 입은 재단(이름은 글자 크기 · 빈칸을 무시하고 하나로, 다른 표기 aka 는 그 캐릭터로, 주인공 하나 게임은 그 주인공으로) */
function cosplayTally(used) {
  const out = {};
  for (const u of used || []) {
    if (!u || !u.game) continue;
    const g = out[u.game] = out[u.game] || { n: 0, cuts: {}, chars: {} }; g.n++;
    if (u.cut) g.cuts[u.cut] = (g.cuts[u.cut] || 0) + 1;
    const gm = (COSPLAY.games || []).find(g => g.key === u.game), ak = gm && gm.many ? (gm.characters || []).find(c => (c.aka || []).some(a => normName(a) === normName(u.character))) : null, nm = gm && !gm.many ? normName(gm.character) : normName(ak ? ak.name : u.character);
    if (nm) { const ch = g.chars[nm] = g.chars[nm] || { name: ak ? ak.name : String(u.character).trim(), cuts: new Set() }; if (u.cut) ch.cuts.add(u.cut); }
  }
  return out;
}
const EMPTY_TALLY = () => ({ n: 0, cuts: {}, chars: {} });
/* 등장인물 많은 게임의 1회차 후보 — 목록(characters)에서 아직 안 쓰고 예약도 안 된 캐릭터 */
function cosplayOpen(g, tg = EMPTY_TALLY()) { return g.many ? (g.characters || []).filter(ch => !tg.chars[normName(ch.name)]) : null; }
const firstRound = (g, tg = EMPTY_TALLY()) => (cosplayOpen(g, tg) || []).length > 0;
/* 캐릭터 무게 — 여자 2 · 남자 1(남자 캐릭터는 크로스플레이, 원소 2026-11-16) */
const COS_FEMALE_W = 2, COS_MALE_W = 1;
function cosplayFull(g, tg = EMPTY_TALLY(), cutOk = () => true) {
  if (!g.many) { const ch = tg.chars[normName(g.character)]; return !COS_CUTS.some(k => cutOk(k) && !(ch && ch.cuts.has(k))); }
  if (firstRound(g, tg)) return !COS_CUTS.some(cutOk);
  return !Object.values(tg.chars).some(ch => COS_CUTS.some(k => cutOk(k) && !ch.cuts.has(k)));
}
/* 2회차 — 쓴 캐릭터 중 덜 입은 하나 + 그 캐릭터가 아직 안 입은 재단 */
function cosplayAgain(tg, r = Math.random, cutOk = () => true) {
  const open = Object.values((tg || EMPTY_TALLY()).chars).map(ch => ({ ch, cuts: COS_CUTS.filter(k => !ch.cuts.has(k) && cutOk(k)) })).filter(x => x.cuts.length)
    .sort((a, b) => a.ch.name.localeCompare(b.ch.name));
  if (!open.length) return null;
  const lo = Math.min(...open.map(x => x.ch.cuts.size)), pool = open.filter(x => x.ch.cuts.size === lo), x = pool[Math.floor(r() * pool.length)];
  return { character: x.ch.name, cut: x.cuts[Math.floor(r() * x.cuts.length)] };
}
/* 게임 고르기 무게(원소 2026-11-15 「케릭터 수 많은 게임일수록 더 많이 선택되게」 → B) — 주인공 하나 게임은 √(남은 재단 비율),
   등장인물 많은 게임은 1회차 √(남은 캐릭터 수), 2회차 √(남은 「캐릭터 + 재단」 / 재단 수) */
function cosplayWeight(g, tg = EMPTY_TALLY()) {
  const chars = Object.values(tg.chars), N = COS_CUTS.length;
  if (!g.many) { const ch = tg.chars[normName(g.character)]; return Math.sqrt(COS_CUTS.filter(k => !(ch && ch.cuts.has(k))).length / N); }
  if (firstRound(g, tg)) return Math.sqrt(cosplayOpen(g, tg).length);
  return Math.sqrt(chars.reduce((s, ch) => s + COS_CUTS.filter(k => !ch.cuts.has(k)).length, 0) / N);
}
const pickWeighted = (list, w, r) => { const ws = list.map(w), sum = ws.reduce((a, b) => a + b, 0); let x = r() * sum; for (let i = 0; i < list.length; i++) { x -= ws[i]; if (x < 0) return list[i]; } return list[list.length - 1]; };
/* 한 칸의 코스프레 — 남은 인원의 제곱근 무게로 고른 게임(다 찬 게임은 빠짐) → 그 게임의 회차대로. 다 찼으면 null. 재단을 먼저 정하고 장소를 그 재단에 맞춰 고른다(물가는 수영복 재단) */
/* gameOk — 그 세계에서 쓸 게임만(판타지 · 스팀펑크 금지 낱말이 게임 · 주인공 · 의상 글에 든 게임은 뺀다 — 다크 소울의 rust 가 스팀펑크 금지 낱말) */
function pickCosplay(used, r = Math.random, cutOk = () => true, gameOk = () => true) {
  const TL = cosplayTally(used), games = (COSPLAY.games || []).filter(g => gameOk(g) && (!g.many || (g.characters || []).length) && !cosplayFull(g, TL[g.key], cutOk));
  if (!games.length) return null;
  const g = pickWeighted(games, x => cosplayWeight(x, TL[x.key]), r), tg = TL[g.key] || EMPTY_TALLY(), any = list => list[Math.floor(r() * list.length)];
  if (!g.many) { const ch = tg.chars[normName(g.character)]; return { game: g.key, character: g.character, cut: any(COS_CUTS.filter(k => cutOk(k) && !(ch && ch.cuts.has(k)))), round: 1 }; }
  if (firstRound(g, tg)) {
    const cuts = COS_CUTS.filter(cutOk), cn = k => tg.cuts[k] || 0, m = Math.min(...cuts.map(cn)), cut = any(cuts.filter(k => cn(k) === m));   /* 재단은 그 게임에서 덜 쓴 것 */
    return { game: g.key, character: pickWeighted(cosplayOpen(g, tg), ch => ch.female ? COS_FEMALE_W : COS_MALE_W, r).name, cut, round: 1 };
  }
  const a = cosplayAgain(tg, r, cutOk);
  return { game: g.key, character: a.character, cut: a.cut, round: 2 };
}
const cosplayKo = cs => { const g = (COSPLAY.games || []).find(x => x.key === (cs || {}).game) || {}, c = (COSPLAY.cuts || []).find(x => x.key === (cs || {}).cut) || {}, ch = g.many ? (g.characters || []).find(x => x.name === (cs || {}).character) : null;
  return `${g.ko || (cs || {}).game} — ${g.many ? ((ch && ch.ko) || (cs || {}).character) + ((cs || {}).round === 2 ? '(2회차)' : '(1회차)') : (g.character_ko || (cs || {}).character)} · ${c.ko || (cs || {}).cut}`; };

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, list) => list[Math.floor(r() * list.length)];
function weighted(r, weights) { const keys = Object.keys(weights), sum = keys.reduce((s, k) => s + weights[k], 0); let x = r() * sum; for (const k of keys) { x -= weights[k]; if (x < 0) return k; } return keys[0]; }
const by = (list, k) => (list || []).find(r => r.key === k);

/* 카드 — 생성기 지시문이 쓰는 꼴(prompt-city 의 casualCard): 그 도시의 물건 하나(설계표 hold)가 「알아볼 거리」. 땅 = 도시(생활 장면은 그 도시 카드에만) */
function cardOf(key) {
  const c = P.card(D, key);
  if (!c) throw new Error('카드가 없다: ' + key + ' (설계표 data/city-design.json 의 도시 열쇠)');
  const h = P.holdOf(c);
  const city = c.parent || key;   /* 랜드마크 카드는 생활 장면 · 계절 · 날씨 · 땅이 부모 도시 것 */
  return { key, city, c, g: { key, signature: h ? [h] : [], signature_hold: h ? [0] : [], land: city }, worlds: P.worldsOf(D, key) };
}
/* 생활 장면 — 트리 장소 열쇠 → 장면 줄 · 그 도시의 장면 장소들 · 장면이 받는 의상 계열 · 시간 · 계절 · 날씨 */
const LIFE_OF = new Map(), lifeOf = place => { if (!LIFE_OF.has(place)) LIFE_OF.set(place, P.lifeScene(LIFE, place)); return LIFE_OF.get(place); };   /* 표는 안 바뀐다 — 한 번만 찾는다(속도) */
const lifePlaces = card => (((LIFE.cities || {})[card.city] || {}).scenes || []).map(s => P.lifeKey(card.city, s.key));
const SEASONS = k => (LIFE.seasons || {})[k] || [], WEATHERS = k => (LIFE.weather || {})[k] || [], TIMES = LIFE.times || [];
/* 그 세계의 금지 낱말(설계표 banned_en)이 든 옷 · 그 세계에서 어색한 소품 동작(세계 소품 사전 not_uses) */
const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BANNED = Object.fromEntries((D.vocab.worlds || []).map(w => { const b = ((D.vocab.markers || {})[w] || {}).banned_en || []; return [w, b.length ? new RegExp('\\b(?:' + b.map(esc).join('|') + ')s?\\b', 'i') : null]; }));
const worldOk = (world, en) => !BANNED[world] || !BANNED[world].test(en || '');
const NOT_USES = world => Object.values(PROPS.props || {}).flatMap(p => ((p.worlds || {})[world] || {}).not_uses || []);
/* 필수 갈래 종류 — 옷 계열이 노출 갈래(란제리풍 · 수영복 · 역할극)면 그 계열. 원소의 「나라 안」 갈래는 없다 */
function requiredType(sc) {
  if (sc.sfree) return '';   /* 자유 설계 칸은 장면을 짜지 않는다 — 갈래 자유 칸의 갈래는 gfree 에 따로 */
  return (tree.required.outfits || []).includes(sc.ofam) ? sc.ofam : '';
}
/* 컷의 칸 갈래(KINDS) — 옷 자유 · 갈래 자유 · 코스프레 · 노출 갈래 · 생활 장면 컷(lifeMust) · 보통 */
const kindOf = c => c.sfree ? (c.gfree ? 'gfree' : 'ofree') : isCosplay(c) ? 'cosplay' : requiredType(c) || (c.lifeMust ? 'life' : 'plain');
/* 장소가 받는 의상 계열 — 트리가 고를 수 있는 것(생활 장면이면 ∩ 장면표 outfits) */
const FAMS_AT = new Map();
function famsAt(place) {
  /* 생활 장면은 장면표 outfits, 일반 장소는 버전1 표의 그 장소 outfits(2026-11-20 — 버전2 표는 계열을 거의 어디서나 받아 라이브하우스에 수영복이 나왔다) */
  if (!FAMS_AT.has(place)) { const s = lifeOf(place), g = (tree.places || []).find(x => x.key === place), all = C2.choices(T2, { era: ERA, place }, 'ofam', null), allow = s && s.outfits ? s.outfits : g && g.outfits ? g.outfits : null; FAMS_AT.set(place, allow ? all.filter(f => allow.includes(f)) : all); }
  return FAMS_AT.get(place);
}
/* 생활 장면 컷 · 보통 칸이 고를 계열 — 노출 갈래 · 코스프레는 정해 둔 칸 한 장씩만 */
const plainFams = place => famsAt(place).filter(f => !EXPOSE_TYPES.includes(f) && f !== COS_FAM);
/* 전통 · 민족 의상 — 그 문화의 도시에서만(data/city-life.json heritage, 2026-11-21 사용자 「1번으로 하고」 — 유카타 · 한복 · 기모노 · 아바야가 아무 도시에나 나왔다).
   표에 적힌 옷은 그 도시 문화 것만, never(종교 옷)는 어디서도 안 고른다. 고를 옷이 하나도 안 남는 계열(자기 전통 옷이 없는 도시의 traditional)은 계열째 안 고른다 */
const HER = LIFE.heritage || {}, HER_ITEMS = HER.items || {}, HER_NEVER = HER.never || [];
const HER_ALL = new Set([...Object.values(HER_ITEMS).flat(), ...HER_NEVER]);
const herOk = (city, item) => !item || !HER_ALL.has(item) || (!HER_NEVER.includes(item) && ((HER.cities || {})[city] || []).some(c => (HER_ITEMS[c] || []).includes(item)));
const famHerOk = (city, fam) => { const f = (tree.outfits || []).find(o => o.key === fam); return !f || !(f.items || []).length || f.items.some(it => herOk(city, it.key)); };
/* 일반 장소 — 버전1 트리 장소(data/casual-tree.json places). 버전2 표의 새 장소(extra_places)는 안 쓴다 */
const GEN = new Set((tree.places || []).map(p => p.key));
/* 일반 장소의 그 세계 글(트리 장소 worlds — 2026-11-24 탈 것, 조립기 placeEn 과 같다) — 금지 낱말은 그 세계 글로 본다 */
const placeText = (k, world) => P.placeEn(C2.place(T2, k), world);
/* 그 세계 그 도시의 장소 풀 — 생활 장면(그 도시) · 일반 장소(그 세계 금지 낱말이 글에 없는 곳) */
const POOL = new Map();
function poolOf(card) {
  const k = card.key + '|' + (card.world || '');
  if (!POOL.has(k)) {
    const all = C2.choices(T2, { era: ERA }, 'place', card.g), lp = lifePlaces(card);
    POOL.set(k, { life: all.filter(p => lp.includes(p)), gen: all.filter(p => GEN.has(p) && worldOk(card.world || '', placeText(p, card.world))) });
  }
  return POOL.get(k);
}
/* 칸 갈래가 받는 곳 — 생활 장면 컷은 생활 장면만, 노출 갈래는 그 계열을 받는 곳, 코스프레는 그 계열을 받고 재단에 맞는 곳(물가는 수영복 재단), 보통은 고를 계열이 남는 곳 */
function placeCands(card, kind, cut = '') {
  const { life, gen } = poolOf(card);
  const ok = kind === 'life' || kind === 'plain' ? p => plainFams(p).length > 0
    : kind === 'cosplay' ? p => cosPlace(p) && cosCutOk(cut, p) : p => famsAt(p).includes(kind);
  return { life: life.filter(ok), gen: kind === 'life' ? [] : gen.filter(ok) };
}
/* 노출 갈래 · 코스프레 칸이 아직 쓸 수 있는 곳 — 다른 세계 · 다른 묶음이 같은 계열로 쓴 곳을 뺀 것 */
function openPlaces(card, kind, cut, others) {
  const fam = kind === 'cosplay' ? COS_FAM : kind, c = placeCands(card, kind, cut);
  return [...c.life, ...c.gen].filter(p => !others.some(o => o.place === p && o.ofam === fam));
}
/* 장소 하나 — 이 세계 묶음이 쓴 곳(taken)은 빼고, 노출 갈래 · 코스프레 칸은 다른 세계가 같은 계열로 쓴 곳도 뺀다(남는 곳이 없으면 그 필수 칸만 다시 넣는다).
   생활 장면 컷 말고는 반쯤 생활 장면 먼저 · 아니면 일반 장소 먼저 — 고른 쪽이 비면 다른 쪽. 그 안에선 다른 카드가 덜 쓴 곳(lean) */
function pickPlace(r, card, kind, { cut = '', taken = new Set(), others = [], U = {} } = {}) {
  const c = placeCands(card, kind, cut), free = list => list.filter(p => !taken.has(p));
  let L = free(c.life), G = free(c.gen);
  if (EXPOSE_TYPES.includes(kind) || kind === 'cosplay') {
    const fam = kind === 'cosplay' ? COS_FAM : kind, fresh = list => list.filter(p => !others.some(o => o.place === p && o.ofam === fam));
    if (fresh(L).length + fresh(G).length) { L = fresh(L); G = fresh(G); }
  }
  const lifeFirst = kind === 'life' || r() < LIFE_FIRST;
  const pool = lifeFirst ? (L.length ? L : G) : (G.length ? G : L);
  return lean(r, pool, U.place);
}
const MEMO = new Map();
function presetsAt(sc, g) {
  const k = [sc.era, sc.place, sc.ofam, sc.prop].join('|');
  if (!MEMO.has(k)) MEMO.set(k, C2.presets(T2, sc, g));
  return MEMO.get(k);
}
const sigProp = c => { const u = C2.use(T2, c.use); return !!u && u.prop === 'signature'; };

/* 카드 사이 쓴 횟수의 무게 — 한 번도 안 쓴 값이 먼저(12), 쓴 값은 1/(1+횟수)³.
   2026-11-02 사용자 「가중치 올려줘」 — 기록 159장 중 세계 안 · 방 · 홈웨어 · 발목 꼬고 앉기 한 장면이 12장, 길(자세 추천 × 장소) 3583 중 102 만 썼다.
   전엔 4 와 1/(1+횟수)² — 안 쓴 값이 한 번 쓴 값보다 16 배, 이제 96 배. 길(자세 추천 × 장소) · 옷 계열 횟수도 센다 */
const WEIGHT_UNUSED = 12;
/* 카메라용 몸짓 추천(쉿 · 브이 · 엄지 척 · 손 흔들기 · 카메라로 손 뻗기 … — 표의 pose)은 덜 고른다(2026-11-13 검토 — 추천 47 중 카메라 응시 28 · 눈높이 34 라
   장소가 달라도 「사진 찍히는 중」 한 장이 됐다). 없애지는 않는다 */
const POSE_WEIGHT = 0.4, ACT_MOST = 2;
/* 어색한 조합(⚠ — 표 awkward: 수영복으로 작업 자리, 휴양지 차림으로 현장 …)인 의상 계열은 덜 고른다(2026-11-13 — 새 장소 · 새 계열이 새 모순이 되지 않게). 묶음마다 한 장까지는 여전히 된다 */
const AWKWARD_WEIGHT = 0.15;
const wOf = n => n ? 1 / Math.pow(1 + n, 3) : WEIGHT_UNUSED;
/* 자세 · 몸 방향 · 카메라 높이 짝(원소 2026-11-18 사용자 C, 도시 2026-11-21) — 셋을 따로 세면 고르게 퍼져도 「서서 · 정면 · 눈높이」 짝이 34% 로 몰렸다. 짝 횟수(전체 기록 + 묶음)로 덜고, 그 짝은 반으로 */
const comboKey = c => [c.posture || '', c.body || '', c.camera || ''].join('|');
const standFrontEye = c => c.posture === 'stand' && (c.body === 'front' || c.body === 'front_3q') && c.camera === 'eye';
/* 옷 계열 무게 — 목욕 차림(수건 · 페슈테말 · 찜질복 · 가운)이 계획 12.7% · 등록 10.8% 로 계열 가운데 가장 많았다(사용자 2026-11-09 「수건 감는 옷 많이 나오던데 이전부터」).
   목욕 계열 장소 · 세계 안 목욕탕이 많아 그렇다 — 고를 때 무게를 줄이고, 한 카드의 세 세계 통틀어 한 장까지(check) */
const FAM_WEIGHT = { bath: 0.25 };
const famW = sc => FAM_WEIGHT[(sc && sc.ofam) || sc] || 1;
function lean(r, list, count, key = x => x, factor = () => 1) {
  if (!list.length) return undefined;
  const w = list.map(x => wOf((count || {})[key(x)] || 0) * factor(x)), sum = w.reduce((a, b) => a + b, 0);
  let x = r() * sum; for (let i = 0; i < list.length; i++) { x -= w[i]; if (x < 0) return list[i]; }
  return list[list.length - 1];
}
/* 쓴 횟수 꼴 바로잡기 — 옛 꼴(소품 → 횟수)도 받는다 */
const EMPTY_USAGE = () => ({ prop: {}, place: {}, item: {}, preset: {}, posture: {}, expr: {}, ofam: {}, path: {}, time: {}, light: {}, cityWeather: {}, combo: {}, moment: {} });
const usageOf0 = u => (u && (u.place || u.prop || u.preset)) ? { ...EMPTY_USAGE(), ...u } : { ...EMPTY_USAGE(), prop: u || {} };
/* 새로 더한 옷 계열(쓴 횟수 0)은 다른 계열의 가운데 값에서 시작한다 — 안 그러면 「안 쓴 쪽 먼저」 무게로 모든 묶음에 들어갔다(2026-11-03 동탄룩 72묶음 중 72) */
const FAMS = (tree.outfits || []).map(o => o.key);
const FRESH_PLACES = [...(tree.places || []), ...(tree2.extra_places || [])].filter(p => p.start_median).map(p => p.key);
/* 새로 더한 옷(표 옷의 start_median — 2026-11-23 장소 보충 옷 열다섯)도 쓴 옷의 가운데 값에서 시작한다 — 시험 계획에서 새 홈웨어 하나가 세계 안 칸마다 뽑혔다 */
const FRESH_ITEMS = (tree.outfits || []).flatMap(o => (o.items || []).filter(i => i.start_median).map(i => i.key));
const usageOf = u => {
  const x = usageOf0(u), used = FAMS.map(k => x.ofam[k] || 0).filter(n => n > 0).sort((a, b) => a - b);
  if (used.length) { const mid = used[Math.floor(used.length / 2)]; x.ofam = { ...x.ofam }; for (const k of FAMS) if (!x.ofam[k]) x.ofam[k] = mid; }
  /* 새로 더한 장소(표 start_median — 2026-11-23 동물 · 돌봄 · 놀이공원)도 쓴 장소의 가운데 값에서 시작한다 — 안 쓴 값 무게 12 라 그대로 두면 한동안 새 장소만 뽑혔다 */
  const pu = Object.values(x.place || {}).filter(n => n > 0).sort((a, b) => a - b);
  if (pu.length) { const mid = pu[Math.floor(pu.length / 2)]; x.place = { ...x.place }; for (const k of FRESH_PLACES) if (!x.place[k]) x.place[k] = mid; }
  const iu = Object.values(x.item || {}).filter(n => n > 0).sort((a, b) => a - b);
  if (iu.length) { const mid = iu[Math.floor(iu.length / 2)]; x.item = { ...x.item }; for (const k of FRESH_ITEMS) if (!x.item[k]) x.item[k] = mid; }
  return x;
};
/* slot 이 같은 usage 로 여러 번 불린다 — 꼴 바로잡기는 한 번만(읽기만 하므로 같은 답, 2026-11-24 속도) */
const USAGE_OF = new WeakMap(), usageMemo = u => { if (!u || typeof u !== 'object') return usageOf(u); if (!USAGE_OF.has(u)) USAGE_OF.set(u, usageOf(u)); return USAGE_OF.get(u); };
const pathKey = (preset, place) => preset + '@' + place;
/* 화면비(2026-11-23 사용자 「배경이 보이니까 더 시원하네」 → 「다른 공방도 조금씩 해보자」) — 눕는 자세 · 환경 컷 3:2, 허리 위 · 3/4 1:1, 나머지 2:3(표 aspect_rules · 공용 모듈 aspectFor).
   자유 설계 칸 · 게임 코스프레는 2:3. 이미 그린 컷(기록에 aspect 가 없거나 2:3)은 그대로 */
const aspectOf = sc => C2.aspectFor ? C2.aspectFor(T2, sc) : '2:3';

/* 한 칸 — 칸 갈래(kind: life · 노출 갈래 · cosplay · plain)대로 장소 · 의상 · 옷, 그 장소에서 쓸 수 있는 자세 추천 하나(frame 을 주면 그 프레이밍의 추천만).
   wantSig 면 소품 동작을 그 도시의 물건(설계표 hold)으로. 소품 동작은 덜 쓴 소품 쪽으로(무게 1/(1+횟수)², 따로 된 난수 흐름 — game 과 같다).
   장소 · 옷 · 자세 추천(그 자세) · 표정은 다른 카드에서 안 쓴 · 덜 쓴 쪽으로(lean — 2026-11-01). taken — 이 세계 묶음이 벌써 쓴 장소, others — 다른 세계 · 다른 묶음 컷 */
function slot(r, card, kind = 'plain', { frame = '', wantSig = false, usage = {}, rUse = r, cut = '', taken = new Set(), others = [] , once = false, prune = null } = {}) {
  if ((EXPOSE_TYPES.includes(kind) || kind === 'cosplay') && EXPOSE_NO_FRAME.includes(frame)) return null;   /* 노출 갈래 · 코스프레 컷은 얼굴 클로즈업으로 짜지 않는다 — 옷이 안 보인다 */
  const g = card.g, U = usageMemo(usage), world = card.world || '', noUse = NOT_USES(world);
  const place = pickPlace(r, card, kind, { cut, taken, others, U });
  if (!place) return null;
  let sc;
  if (kind === 'cosplay') sc = { era: ERA, place, ofam: COS_FAM };
  else if (EXPOSE_TYPES.includes(kind)) sc = { era: ERA, place, ofam: kind };
  else {
    const fams = plainFams(place).filter(f => famHerOk(card.city, f) && !(prune && others.some(o => o.place === place && o.ofam === f))); if (!fams.length) return null;   /* prune — 다른 세계 · 묶음이 이 곳에 입힌 계열은 처음부터 안 고른다(check 와 같은 규칙) */   /* 노출 갈래 · 코스프레는 정해 둔 칸 한 장씩만 */
    sc = { era: ERA, place, ofam: lean(r, fams, U.ofam, x => x, f => famW(f) * (C2.awkward(T2, f, place).length ? AWKWARD_WEIGHT : 1)) };
  }
  sc.treeV = 2; sc.prop = wantSig ? '0' : '';
  const presets = presetsAt(sc, g).filter(p => (!frame || p.frame === frame) && (!wantSig || p.prop_kind) && !(once && C2.presetOnce && C2.presetOnce(T2, p.key)) && !(prune && (prune.presets.has(p.key) || !prune.fits(p, kind))));   /* 한 장까지 추천(표 preset_once)은 이미 쓴 캐릭터면 뺀다 — 2026-11-23 */
  if (!presets.length) return null;
  const rp = list => pick(r, list);
  /* 자세 추천 — 그 추천과 그 자세의 횟수를 함께(선 자세가 절반이 넘었다 — 2026-11-01 기록 434장) */
  const pw = presets.map(p => Math.pow(2, -(C2.presetBias ? C2.presetBias(T2, p.key) : 0)) * wOf(U.preset[p.key] || 0) * Math.sqrt(wOf(U.posture[p.posture] || 0)) * wOf(U.path[pathKey(p.key, sc.place)] || 0) * (p.pose ? POSE_WEIGHT : 1) * Math.sqrt(wOf((U.combo || {})[comboKey(p)] || 0)) * (standFrontEye(p) ? 0.5 : 1));
  let px = r() * pw.reduce((a, b) => a + b, 0), chosen = presets[presets.length - 1];
  for (let i = 0; i < presets.length; i++) { px -= pw[i]; if (px < 0) { chosen = presets[i]; break; } }
  sc = C2.repair(T2, C2.applyPreset(T2, sc, chosen.key), g, rp);
  if (wantSig) {
    const sig = C2.choices(T2, sc, 'use', g).filter(k => C2.use(T2, k).prop === 'signature');
    if (!sig.length) return null;
    sc = { ...sc, use: pick(r, sig) };
  }
  const items0 = C2.choices(T2, sc, 'item', g).filter(k => worldOk(world, (C2.item(T2, sc.ofam, k) || {}).en) && herOk(card.city, k));
  const items = prune && kind !== 'cosplay' ? items0.filter(k => !prune.outfits.has(sc.ofam + '/' + k)) : items0;   /* prune — 다른 세계 · 묶음이 입은 옷은 처음부터 안 고른다(check 와 같은 규칙) */
  if (prune && items0.length && !items.length) return null;
  if (!items.length && (!worldOk(world, (C2.family(T2, sc.ofam) || {}).en) || !famHerOk(card.city, sc.ofam))) return null;
  if (kind === 'cosplay') { if (!items.includes(cosItem(cut))) return null; sc.item = cosItem(cut); }   /* 재단은 pickCosplay 가 정했다 */
  else { const pool = C2.classLean ? C2.classLean(T2, sc.ofam, items, k => (U.item || {})[k] || 0) : items; sc.item = pool.length ? lean(r, pool, U.item) : ''; }   /* 실루엣 갈래 — 덜 쓴 갈래의 옷 먼저(공용 모듈 classLean, 2026-11-23) */
  sc = C2.repair(T2, sc, g, rp);
  if (!wantSig && sc.use && !sigProp(sc)) {
    const alt = C2.choices(T2, sc, 'use', g).filter(k => C2.use(T2, k).prop !== 'signature' && !noUse.includes(k));
    if (alt.length > 1) {
      const n = p => DRINKS.includes(p) ? DRINKS.reduce((a, d) => a + (U.prop[d] || 0), 0) : (U.prop[p] || 0);
      const u = weighted(rUse, Object.fromEntries(alt.map(k => [k, 1 / Math.pow(1 + n(C2.use(T2, k).prop), 2)])));
      const next = C2.set(T2, sc, 'use', u, g, rp);
      if (next.use === u) sc = next;
    }
  }
  if (wantSig && !sigProp(sc)) return null;
  if (sc.use && noUse.includes(sc.use)) return null;   /* 그 세계에서 어색한 소품 동작(화면을 보는 · 셀카) */
  if (!worldOk(world, outfitEn(sc))) return null;
  const body = by(tree2.body, sc.body), head = by(tree2.head, sc.head);
  sc.expr = body && body.face_hidden && !(head && head.look_back) ? '' : pick(r, EXPRS);   /* 표정은 고르게 — 덜 쓴 쪽 무게(lean)를 걸면 덜 쓴 극단 표정으로 쏠렸다(2026-11-03) */
  sc.axes = { ...FIXED_AXES }; sc.aspect = aspectOf(sc); sc.unlocked = [];   /* 화면비 — 자세 · 프레이밍이 정해진 뒤(공용 모듈 aspectFor, 2026-11-23) */
  return sc;
}

/* 같은 옷 열쇠(세계끼리 · 묶음끼리 돌려입지 않는다 — check) */
const outfitKeyOf = c => isCosplay(c) ? 'cosplay/' + ((c.cosplay || {}).game || '') + '/' + normName((c.cosplay || {}).character) + '/' + ((c.cosplay || {}).cut || '')   /* 코스프레는 게임 · 캐릭터 · 재단이 같을 때만 같은 옷 */
  : c.item ? c.ofam + '/' + c.item : (c.ofam && c.ofam !== 'everyday' ? c.ofam : '');
/* 묶음 규칙 — 틀린 것 목록. base 는 이미 있는 컷(그 세계): 그것들이 벌써 넘긴 한도는 그만큼 올려 준다 */
function check(cuts, card, base = [], others = []) {
  const all = [...base, ...cuts], errs = [];
  /* 장면 규칙은 장면 컷만 — 자유 설계 칸(sfree)은 장소 · 구도 · 시대를 맡은 쪽이 짓는다(2026-11-11) */
  const sc = c => !c.sfree, sAll = all.filter(sc), sBase = base.filter(sc), sCuts = cuts.filter(sc);
  const count = (f, xs) => xs.reduce((m, c) => { const k = f(c); if (k) m[k] = (m[k] || 0) + 1; return m; }, {});
  const over = (name, f, most, xs = sAll, bs = sBase) => {
    const m = count(f, xs), b = count(f, bs);
    Object.entries(m).forEach(([k, n]) => { if (n > Math.max(most, b[k] || 0)) errs.push(`${name} ${k} 가 ${n} 번(${most} 번까지)`); });
  };
  const complete = all.length >= CASUAL_N;   /* 「… 컷이 없다」 는 열 장이 다 찬 묶음에서만(있는 컷 위에 몇 장 더 짤 때는 뒤에 올 칸) */
  /* 필수 — 노출 갈래 셋 다(2026-11-20) */
  for (const f of EXPOSE_TYPES) if (complete && !sAll.some(c => requiredType(c) === f)) errs.push(`필수 노출 갈래 ${f} 컷이 없다`);
  over('장소', c => c.place, 1);
  over('장소 묶음', c => (C2.place(T2, c.place) || {}).group, 2);
  over('의상 계열', c => c.ofam !== 'everyday' && c.ofam, 1);
  over('평상복', c => c.ofam === 'everyday' && c.ofam, 2);
  over('프레이밍', c => c.frame, Math.max(1, Math.ceil(Math.max(SCENE_N, sAll.length) / FRAMES.length)));   /* 장면 컷 여덟 · 프레이밍 여섯 — 한 가지 두 번까지 */
  over('자세 추천', c => c.preset, 1);
  /* 하는 일 갈래(표 presets[].act — 이동 · 야영 · 손보기 · 집안일 · 채비 · 살피기 · 걷기 · 쉬기 · 먹고 마시기 · 카메라용 몸짓)는 묶음에 두 장까지(2026-11-13 — 한 사람의 묶음이 한 갈래로 몰리지 않게) */
  over('하는 일 갈래', c => (by(tree2.presets, c.preset) || {}).act, ACT_MOST);
  /* 몸 방향 — 자세 추천 59 의 몸 방향이 사실상 셋(앞 3/4 · 앞 · 옆 — 뒤 3/4 · 뒤는 하나씩)이라 장면 컷 여덟이면 한 가지 세 번까지(2026-11-20, 다섯 장일 땐 두 번) */
  over('몸 방향', c => c.body, Math.max(2, Math.ceil(Math.max(SCENE_N, sAll.length) / 3)));
  over('머리 어깨 너머', c => (by(tree2.head, c.head) || {}).look_back && 'over_shoulder', 1);
  over('소품', c => { const u = C2.use(T2, c.use); return u && u.prop !== 'signature' && u.prop; }, 1);   /* 그 도시의 물건은 아래 「두 장까지」 가 센다 */
  over('마실 것', c => { const u = C2.use(T2, c.use); return u && DRINKS.includes(u.prop) && 'drink'; }, 1);
  over('그 도시의 물건', c => sigProp(c) && 'signature', 2);
  over('어색한 조합', c => C2.awkward(T2, c.ofam, c.place).length && 'awkward', 1);
  for (const c of cuts) if (EXPOSE_TYPES.includes(requiredType(c)) && EXPOSE_NO_FRAME.includes(c.frame)) errs.push(`칸 ${c.n || '?'}: 노출 갈래 컷은 얼굴 클로즈업에 두지 않는다`);
  over('동탄룩', c => c.ofam === 'dongtan' && 'dongtan', 1);
  /* 필수 — 생활 장면 컷 한 장(lifeMust, 2026-11-20 「서울 장면은 … 또 하나의 필수 컷으로」): 그 도시 생활 장면에서, 노출 갈래 · 코스프레 · 상황 노출이 아닌 컷 */
  over('생활 장면 필수', c => c.lifeMust && 'life', 1);
  for (const c of cuts) {
    if (!c.lifeMust) continue;
    const ls = lifeOf(c.place);
    if (!ls || ls.city !== card.city) errs.push(`칸 ${c.n || '?'}: 생활 장면 필수 컷의 장소 ${c.place} 가 ${card.city} 생활 장면이 아니다`);
    if (requiredType(c) || isCosplay(c) || c.situ) errs.push(`칸 ${c.n || '?'}: 생활 장면 필수 컷은 노출 갈래 · 코스프레 · 상황 노출이 아닌 컷`);
  }
  if (complete && !sAll.some(c => c.lifeMust)) errs.push(`생활 장면 필수 컷이 없다 — ${card.city} 생활 장면에서 한 장`);
  /* 필수 — 게임 코스프레 한 장(원소 2026-11-15 에서 옮김) */
  over('게임 코스프레', c => isCosplay(c) && 'cosplay', 1);
  if (complete && !sAll.some(isCosplay)) errs.push('게임 코스프레 컷이 없다 — 필수');
  for (const c of cuts) {
    if (!isCosplay(c)) continue;
    const cs = c.cosplay || {}, gm = (COSPLAY.games || []).find(x => x.key === cs.game), cut = cutOfItem(c.item);
    if (COS_NO_FRAME.includes(c.frame)) errs.push(`칸 ${c.n || '?'}: 게임 코스프레 컷의 프레이밍 ${c.frame} — 코스튬이 안 보인다`);
    if (c.situ || c.color || c.denier) errs.push(`칸 ${c.n || '?'}: 게임 코스프레 컷엔 옷 색 · 데니어 · 상황을 얹지 않는다`);
    if (!gm) errs.push(`칸 ${c.n || '?'}: 게임 코스프레의 게임 ${cs.game || '없음'} 이 목록에 없다`);
    else if (!worldOk(card.world || '', [gm.en, gm.character, gm.outfit].join(' '))) errs.push(`칸 ${c.n || '?'}: 게임 코스프레 ${gm.key} 의 글에 ${card.world} 금지 낱말`);
    else if (!gm.many && cs.character !== gm.character) errs.push(`칸 ${c.n || '?'}: ${gm.key} 의 캐릭터는 ${gm.character}`);
    else if (gm.many && !String(cs.character || '').trim()) errs.push(`칸 ${c.n || '?'}: 게임 코스프레의 캐릭터가 비었다 — 계획기가 정한다`);
    if (!cs.cut || cs.cut !== cut) errs.push(`칸 ${c.n || '?'}: 게임 코스프레의 재단 ${cs.cut || '없음'} 이 옷 ${c.item || '없음'} 과 다르다`);
    if (c.place && !cosPlace(c.place)) errs.push(`칸 ${c.n || '?'}: 게임 코스프레 장소 ${c.place} 는 그 계열을 받지 않는다`);
    if (cut && !cosCutOk(cut, c.place)) errs.push(`칸 ${c.n || '?'}: 물가 ${c.place} 엔 수영복 재단(${COS_SWIM.join(' · ')})만`);
  }
  /* 화면비 — 새 컷은 계획대로(aspectFor). 이미 그린 컷은 2:3 이라 2:3 도 받는다. 자유 설계 칸은 칸을 정한 뒤 2:3 으로 맞춘다 */
  for (const c of cuts) if (c.aspect && c.aspect !== '2:3' && !c.ofree && !c.sfree && c.aspect !== aspectOf(c)) errs.push(`칸 ${c.n || '?'}: 화면비 ${c.aspect} 가 계획(${aspectOf(c)})과 다르다`);
  /* 상황 노출 — 보통 컷 한 장에 늘(원소 SITU_RATE = 1 꼴, 2026-11-20 — 필수 · 코스프레 · 자유 칸엔 없다) */
  over('상황 노출', c => c.situ && 'situ', 1);
  for (const c of cuts) if (c.situ && kindOf(c) !== 'plain') errs.push(`칸 ${c.n || '?'}: 상황 노출은 보통 컷에만(이 컷은 ${kindOf(c)})`);
  for (const c of cuts) if (c.situ && !P.situFits(c.situ, outfitEn(c))) errs.push(`칸 ${c.n || '?'}: 상황 ${c.situ} 는 이 옷에 안 맞는다`);
  for (const c of cuts) if (c.situ && SITU_NO_FRAME.includes(c.frame)) errs.push(`칸 ${c.n || '?'}: 상황 노출은 얼굴 클로즈업에 두지 않는다`);
  if (complete && !sAll.some(c => c.situ)) errs.push('상황 노출 컷이 없다 — 보통 컷 한 장');
  /* 자유 설계 둘 — 옷 자유 한 장 · 갈래 자유 한 장(노출 갈래 하나 + 열린 상황, 그 갈래 필수 컷의 옷은 gnot 으로 피한다) */
  over('옷 자유', c => c.ofree && 'ofree', 1, all, base);
  over('갈래 자유', c => c.gfree && 'gfree', 1, all, base);
  if (complete && !all.some(c => c.ofree)) errs.push('옷 자유 컷이 없다 — 자유 설계 한 장');
  if (complete && !all.some(c => c.gfree)) errs.push('갈래 자유 컷이 없다 — 노출 갈래 하나를 묶은 자유 설계 한 장');
  const situs = sAll.map(c => c.situ).filter(Boolean);
  for (const c of cuts) {
    if (c.ofree && c.gfree) errs.push(`칸 ${c.n || '?'}: 옷 자유와 갈래 자유는 다른 칸`);
    if (!c.gfree) continue;
    if (!c.sfree) errs.push(`칸 ${c.n || '?'}: 갈래 자유 컷은 자유 설계(sfree) 칸이다`);
    if (!EXPOSE_TYPES.includes(c.gfree)) errs.push(`칸 ${c.n || '?'}: 갈래 자유의 갈래 ${c.gfree} 는 필수 노출 갈래(${EXPOSE_TYPES.join(' · ')})가 아니다`);
    const req = sAll.find(x => requiredType(x) === c.gfree);
    if (req && req.item && c.gnot !== req.item) errs.push(`칸 ${c.n || '?'}: 갈래 자유가 피할 옷(gnot)이 ${c.gfree} 필수 컷의 옷 ${req.item} 이 아니다 — ${c.gnot || '없음'}`);
    if (c.gsitu === 'free') { /* 열린 상황(2026-11-11) */ }
    else if (!SITUS.includes(c.gsitu)) errs.push(`칸 ${c.n || '?'}: 갈래 자유의 상황(gsitu)이 'free' 도 상황 표에도 없다 — ${c.gsitu || '없음'}`);
    else if (situs.includes(c.gsitu)) errs.push(`칸 ${c.n || '?'}: 갈래 자유의 상황 ${c.gsitu} 가 상황 노출 컷과 같다`);
  }
  if (card.g.signature_hold.length && sAll.length >= 3 && !sAll.some(sigProp)) errs.push('그 도시의 물건을 든 컷이 없다(한두 장)');
  if (sAll.length >= 3) {
    if (!sAll.some(c => FAR.includes(c.frame))) errs.push('먼 컷(전신·환경)이 없다');
    if (!sAll.some(c => NEAR.includes(c.frame))) errs.push('가까운 컷(허리 위·가슴 위·클로즈업)이 없다');
  }
  /* 장소 — 그 도시의 생활 장면 또는 일반 장소(버전1 트리 장소 · 그 세계 금지 낱말 없음), 시간 · 계절 · 날씨는 생활 장면표(생활 장면은 받는 것만, 일반 장소는 장소 특징) */
  const world = card.world || '', noUse = NOT_USES(world), seasons = SEASONS(card.city), weathers = WEATHERS(card.city);
  for (const c of sCuts) {
    const ls = lifeOf(c.place), pr = placeRules(c.place), where = ls ? '장면 ' + ls.key : '장소 ' + c.place;
    if (ls ? ls.city !== card.city : !GEN.has(c.place)) { errs.push(`칸 ${c.n || '?'}: 장소 ${c.place} 는 ${card.city} 생활 장면도 일반 장소(버전1 트리 장소)도 아니다`); continue; }
    if (!ls && !worldOk(world, placeText(c.place, world))) errs.push(`칸 ${c.n || '?'}: 일반 장소 ${c.place} 의 글에 ${world} 금지 낱말`);
    if (ls && ls.outfits && !ls.outfits.includes(c.ofam)) errs.push(`칸 ${c.n || '?'}: 장면 ${ls.key} 에서 의상 계열 ${c.ofam} 은 안 고른다(장면표 outfits)`);
    if (!worldOk(world, outfitEn(c))) errs.push(`칸 ${c.n || '?'}: 옷 「${outfitEn(c)}」 에 ${world} 금지 낱말`);
    if (!herOk(card.city, c.item) || (!c.item && !c.outfit && !famHerOk(card.city, c.ofam))) errs.push(`칸 ${c.n || '?'}: 전통 의상 ${c.item || c.ofam} 은 ${card.city} 것이 아니다(data/city-life.json heritage)`);
    if (c.use && noUse.includes(c.use)) errs.push(`칸 ${c.n || '?'}: 소품 동작 ${c.use} 는 ${world} 에서 안 쓴다(세계 소품 사전 not_uses)`);
    if (c.time && !(TIMES.some(x => x.key === c.time) && (!pr.times || pr.times.includes(c.time)))) errs.push(`칸 ${c.n || '?'}: 시간대 ${c.time} 는 생활 장면표 times · ${where} 밖`);
    if (c.season && !(seasons.some(x => x.key === c.season) && (!pr.seasons || pr.seasons.includes(c.season)))) errs.push(`칸 ${c.n || '?'}: 계절 ${c.season} 는 ${card.city} 표 · ${where} 밖`);
    const wx = c.cityWeather && weathers.find(x => x.key === c.cityWeather);
    if (c.cityWeather && !(wx && !pr.indoor && (!wx.seasons || wx.seasons.includes(c.season)) && (!wx.times || wx.times.includes(c.time)))) errs.push(`칸 ${c.n || '?'}: 날씨 ${c.cityWeather} 는 ${card.city} 표 · 그 계절 · 시간대 · 실외 밖`);
    if (c.weather) errs.push(`칸 ${c.n || '?'}: 트리 날씨(weather)는 쓰지 않는다 — 생활 장면표 날씨(cityWeather)`);
    if (c.moment && !(momentFits(world, c.moment) && C2.momentOk(T2, c, by(tree2.moments, c.moment)))) errs.push(`칸 ${c.n || '?'}: 순간 ${c.moment} 은 이 장면 · ${world} 에 안 맞는다(표 moments)`);
  }
  for (const c of sCuts) {
    const fixed = C2.repair(T2, { ...c }, card.g);
    for (const k of C2.ORDER) if ((fixed[k] || '') !== (c[k] || '')) errs.push(`칸 ${c.n || '?'}: ${k}=${c[k]} 는 트리에서 못 고른다`);
  }
  /* 세계끼리 · 묶음끼리 장면을 돌려쓰지 않는다(2026-11-02 — 세 세계에 같은 장면 한 벌을 쓴 일). 같은 장소(생활 장면 · 일반 장소)는 옷 계열까지 같을 때만 막는다(같은 곳을 세 세계로 —
     일반 장소도 World 줄이 그 세계로 바꾼다, 2026-11-20). 다만 노출 갈래 · 코스프레 칸은 그 계열을 받는 곳이 다 찼으면(남은 곳 0) 같은 계열도 된다(필수 칸만).
     장소 · 옷과 상관없이 같은 자세 추천(= 같은 구도)도 안 된다(사용자 「같은 구도의 장면」) */
  /* 같은 옷도 세계끼리 · 묶음끼리 돌려입지 않는다(사용자 2026-11-08 「무협에서 니트 상의했으면 메카에서도 …」 → 「응 막아줘」) — 옷(item)이 같으면, 옷 없이 계열만이면 그 계열(평상복 계열 자체는 빼고) */
  const outfitKey = outfitKeyOf;
  for (const c of sCuts) {
    if (others.some(o => o.place && o.place === c.place && o.ofam === c.ofam)) {
      const kind = kindOf(c), fixed = EXPOSE_TYPES.includes(kind) || kind === 'cosplay';
      const left = fixed ? openPlaces(card, kind, cutOfItem(c.item), others).filter(p => !sAll.some(x => x !== c && x.place === p)) : [];
      if (!fixed || left.length) errs.push(`칸 ${c.n || '?'}: 장소 ${c.place} 는 다른 세계 · 다른 묶음이 같은 옷 계열(${c.ofam})로 쓴 곳`);
    }
    if (C2.presetOnce && C2.presetOnce(T2, c.preset) && [...sCuts.filter(o => o !== c), ...others].some(o => C2.presetOnce(T2, o.preset))) errs.push(`칸 ${c.n || '?'}: 두 손 모으기 · 무릎 꿇기 · 쉿 자세 추천은 한 캐릭터(세 세계 · 묶음 통틀어) 한 장까지 — ${c.preset}`);
    if (c.preset && others.some(o => o.preset === c.preset)) errs.push(`칸 ${c.n || '?'}: 자세 추천 ${c.preset} 는 다른 세계 · 다른 묶음이 쓴 구도`);
    const ok = outfitKey(c); if (ok && others.some(o => outfitKey(o) === ok)) errs.push(`칸 ${c.n || '?'}: 옷 ${ok} 는 다른 세계 · 다른 묶음이 입은 옷`);
    if (c.ofam === 'bath' && others.some(o => o.ofam === 'bath')) errs.push(`칸 ${c.n || '?'}: 목욕 차림은 한 카드의 세계 셋 통틀어 한 장까지(2026-11-09)`);
  }
  return errs;
}
/* 옷 색 갈래(2026-11-08 「일상컷 생성 옵션에 의상색 관련 다양성은 없었나?」 → 「응 넣어줘」) — 색이 박히지 않은 옷마다 서로 다른 갈래를 준다.
   이미 있는 컷 · 다른 세계 묶음이 쓴 갈래는 뒤로(다 쓰면 다시 처음부터). 장면 고르기(씨앗 r)와 따로 굴려 옛 씨앗의 장면이 그대로다 */
const ALL_COLORS = (T.CASUAL.colors || []).map(c => c.key), COLORS = ALL_COLORS;
function outfitEn(c) { const it = C2.item(T2, c.ofam, c.item), fm = C2.family(T2, c.ofam); return (c.outfit || '').trim() || (it && it.en) || (fm && fm.en) || ''; }
function colorize(cuts, old = [], others = [], rc = Math.random, world = '') {
  const COLORS = ALL_COLORS.filter(k => worldOk(world, ((T.CASUAL.colors || []).find(c => c.key === k) || {}).en));   /* 그 세계 금지 낱말이 든 색 이름(denim)은 거른다 */
  const used = new Set([...old, ...others].map(c => c.color).filter(Boolean)), mine = new Set();
  for (const c of cuts) {
    if (isCosplay(c) || P.colorFixed(outfitEn(c))) { delete c.color; continue; }   /* 게임 코스프레는 그 캐릭터 색 */
    let pool = COLORS.filter(k => !used.has(k) && !mine.has(k));
    if (!pool.length) pool = COLORS.filter(k => !mine.has(k));
    if (!pool.length) pool = COLORS.slice();
    c.color = pool[Math.floor(rc() * pool.length)]; mine.add(c.color);
  }
  return cuts;
}
/* 데니어(2026-11-08 「데니어 설정값 넣어서 랜덤하게 설정될 수 있게 해줘. 기존 노출설정값 과는 별개로」) — 데니어가 닿는 옷(P.denierFits)마다
   열에 여섯은 갈래 하나(40 · 60 · 80), 묶음 안에선 갈래를 돌려 가며. 노출 단계(skin_exposure)는 건드리지 않는다. 장면 · 색과 따로 된 난수 */
const DENIERS = (T.CASUAL.deniers || []).map(d => d.key), DENIER_RATE = 0.6;
function denierize(cuts, rd = Math.random) {
  const mine = [];
  for (const c of cuts) {
    if (isCosplay(c) || !P.denierFits(outfitEn(c)) || rd() >= DENIER_RATE) { delete c.denier; continue; }
    let pool = DENIERS.filter(k => !mine.includes(k)); if (!pool.length) pool = DENIERS.slice();
    c.denier = pool[Math.floor(rd() * pool.length)]; mine.push(c.denier);
  }
  return cuts;
}
/* 바람에 날림은 실내가 아닌 곳만(2026-11-13 — 장소 특징 indoor). 젖은 옷은 실내면 지시문이 비 대신 물 튐 글(enIn)을 싣는다 */
const situAtPlace = (k, c) => C2.situOk(T2, c, by(T.CASUAL.situations, k));   /* 상황 표의 조건(장소 특징 · 묶음 · 자세 · 프레이밍 — 바람은 실내가 아닌 곳, 땀은 더운 곳, 역광 실루엣은 창 · 하늘, 트임은 걷거나 앉은 전신 컷) */
/* 빛 · 날씨 · 머리 매무새 · 빛의 방향 · 화면 안 자리 · 배경 깊이 · 전경 · 카메라 높이(2026-11-13) — 전엔 계획기가 이 칸들을 한 번도 안 채워 묶음의 빛이 한 가지였다.
   조건은 표 ambience(시간대는 하늘 · 창이 있는 곳, 등불은 실내, 밤 고정 장소는 밤 시간대만, 날씨는 하늘 · 창이 있는 곳 …)와 모듈 C2.ambience 가 쥔다.
   묶음 안에서 덜 쓴 값부터. 장면 고르기와 따로 된 난수라 옛 씨앗의 장면(장소 · 옷 · 자세)은 그대로다 */
const AMBIENT = ['time', 'weather', 'hair', 'light', 'spot', 'depth', 'view'];
const NIGHT_TIMES = ['night_out', 'past_midnight'];
/* 장소가 받는 시간대 · 계절 · 실내 — 생활 장면은 장면표 times · seasons · indoor, 일반 장소는 장소 특징(timed 면 시간대 없음 · night 면 밤 시간대 · indoor/timed 면 날씨 없음). null 은 다 받는다 */
function placeRules(place) {
  const ls = lifeOf(place); if (ls) return { times: ls.times || null, seasons: ls.seasons || null, indoor: !!ls.indoor };
  const hs = ((T2.v2.places || {})[place]) || [];
  return { times: hs.includes('timed') ? [] : hs.includes('night') ? NIGHT_TIMES : null, seasons: null, indoor: hs.includes('indoor') || hs.includes('timed') };
}
/* 생활 장면표의 시간대 · 계절 · 날씨 — 장소가 받는 것(placeRules), 묶음 안에서 덜 쓴 것부터. 날씨는 실외 · 열에 넷, 그 계절 · 시간대에 되는 것만.
   덜 쓴 값은 묶음 횟수(used) + 전체 기록 비율(global — 0 ~ 1, 가장 많이 쓴 값이 1). 묶음 횟수가 먼저, 같으면 전체에서 덜 쓴 쪽(원소 2026-11-18 A, 도시 2026-11-21) */
const leastOf = (used, global, ra) => (kind, list) => {
  if (!list.length) return '';
  const u = used[kind] || {}, g = (global || {})[kind] || {}, sc = k => (u[k] || 0) + (g[k] || 0), min = Math.min(...list.map(sc)), pool = list.filter(k => sc(k) - min < 0.35);
  return pool[Math.floor(ra() * pool.length)];
};
const timesAt = place => { const pr = placeRules(place); return TIMES.map(x => x.key).filter(k => !pr.times || pr.times.includes(k)); };
function lifeAmbience(c, city, ra, used, global = {}) {
  const pr = placeRules(c.place), least = leastOf(used, global, ra);
  const time = least('time', timesAt(c.place));
  const season = least('season', SEASONS(city).map(x => x.key).filter(k => !pr.seasons || pr.seasons.includes(k)));
  const ws = pr.indoor ? [] : WEATHERS(city).filter(x => (!x.seasons || x.seasons.includes(season)) && (!x.times || x.times.includes(time))).map(x => x.key);
  const cityWeather = ws.length && ra() < 0.4 ? least('cityWeather', ws) : '';
  return { time, season, cityWeather };
}
/* 순간(원소 2026-11-18 사용자 D, 도시 2026-11-21) — 노출과 상관없는 작은 사건 하나(표 moments). 일반 컷 가운데 몇 장에(자유 설계 · 상황 노출 · 게임 코스프레 컷은 빼고 — 한 컷에 작은 사건은 하나),
   전체 기록 + 묶음에서 덜 쓴 것. 장면(장소 · 프레이밍 · 시간대)이 다 정해진 뒤. 도시: 그 세계 금지 낱말이 든 순간은 거르고, 시대 열쇠(eras — now 만)가 붙은 순간(반짝이 스티커 · 풍선 · 선크림)은
   금지 낱말이 없는 세계(사이버펑크)에서만 — 도시 컷은 시대가 늘 now 라 표의 eras 가 판타지 · 스팀펑크를 거르지 못한다. 날씨가 붙은 순간(눈송이 · 입김 · 꽃잎 · 낙엽 · 빗방울)은
   트리 날씨(weather)를 안 쓰는 도시에선 안 맞는다 */
const MOMENT_RATE = 0.4, MOMENT_MAX = 2;
const momentFits = (world, k) => { const r = by(tree2.moments || [], k); return !!r && worldOk(world, r.en) && (!r.eras || !BANNED[world]); };
function momentize(cuts, old = [], ra = Math.random, usage = null, world = '') {
  const U0 = usage ? usageOf(usage) : null, g = (U0 && U0.moment) || {}, here = {};
  [...old, ...cuts].forEach(c => { if (c.moment) here[c.moment] = (here[c.moment] || 0) + 1; });
  let n = cuts.filter(c => c.moment).length;
  for (const c of cuts) {
    if (n >= MOMENT_MAX || c.moment || c.ofree || c.sfree || c.situ || isCosplay(c) || ra() >= MOMENT_RATE) continue;
    const list = C2.moments(T2, c).filter(k => momentFits(world, k)); if (!list.length) continue;
    const sc = k => 3 * (here[k] || 0) + (g[k] || 0), min = Math.min(...list.map(sc)), pool = list.filter(k => sc(k) - min < 1);
    c.moment = pool[Math.floor(ra() * pool.length)]; here[c.moment] = (here[c.moment] || 0) + 1; n++;
  }
  return cuts;
}
function ambient(cuts, old = [], ra = Math.random, city = '', usage = null) {
  /* 전체 기록 비율(원소 2026-11-18 사용자 A) — 그림 저장소의 다른 카드 컷에서 센 시간대 · 빛 · 날씨 횟수를 0 ~ 1 로(가장 많이 쓴 값이 1). 묶음 안 횟수 다음으로 본다 */
  const U0 = usage ? usageOf(usage) : null, global = {};
  if (U0) for (const k of ['time', 'light', 'cityWeather']) { const m = U0[k] || {}, top = Math.max(1, ...Object.values(m)); global[k] = Object.fromEntries(Object.entries(m).map(([x, n]) => [x, n / top])); }
  const used = {}, note = c => [...AMBIENT, 'season', 'cityWeather', 'camera'].forEach(k => { if (c[k]) { used[k] = used[k] || {}; used[k][c[k]] = (used[k][c[k]] || 0) + 1; } });
  old.filter(c => !c.sfree).forEach(note);
  const opts = { times: [], hairs: (T.CASUAL.hairs || []).map(x => x.key), used, global };   /* 시간대는 생활 장면표(lifeAmbience) — 트리 시간대 · 날씨는 안 쓴다 */
  for (const c of cuts) {
    /* 장면 자유 칸은 맡은 쪽이 짓는다 — 시간대만 준다(원소 2026-11-18 사용자 B — 비면 늘 따뜻한 밤 실내로 그렸다). 장소가 없어 생활 장면표 시간대 모두에서 */
    if (c.sfree) { const t = leastOf(used, global, ra)('time', timesAt(c.place)); if (t) { c.time = t; note({ time: t }); } else delete c.time; continue; }
    Object.assign(c, C2.ambience(T2, c, ra, opts), lifeAmbience(c, city, ra, used, global));
    delete c.weather;
    if (isCosplay(c)) delete c.hair;   /* 코스튬엔 제 머리 장식이 있다 — 머리 매무새 줄을 얹지 않는다(원소 2026-11-15) */
    /* 빛 — 밤 시간대에 낮 빛, 낮에 밤 빛이 남지 않게 */
    const lr = c.light && by(tree2.light, c.light), night = NIGHT_TIMES.includes(c.time);
    if (lr && ((night && lr.day) || (!night && lr.night_only))) delete c.light;
    /* 역광 실루엣 상황은 빛이 뒤에서 — 밤 시간대는 뗀다 */
    if (c.situ === 'sheer_light') { c.light = 'back'; if (NIGHT_TIMES.includes(c.time)) { const pr = placeRules(c.place), day = TIMES.map(x => x.key).filter(k => !NIGHT_TIMES.includes(k) && (!pr.times || pr.times.includes(k))); c.time = day[0] || c.time; } }
    for (const k of [...AMBIENT, 'season', 'cityWeather']) if (!c[k]) delete c[k];
    note(c);
  }
  /* 고개 · 몸 좌우(2026-11-20 — 공용 모듈 spreadTurns): 한 묶음 안에서 정면 · 왼쪽 · 오른쪽을 덜 쓴 쪽으로. 자유 설계 칸은 맡은 쪽이 짓는다 */
  if (C2.spreadTurns) C2.spreadTurns(T2, cuts.filter(c => !(c.sfree)), ra, old);
  return cuts;
}
/* 상황 — 상황 칸(situAt)에 그 옷에 맞는 것 하나. 이미 있는 컷 · 다른 세계 묶음이 쓴 상황은 뒤로. 장면과 따로 된 난수 */
function situate(cuts, at, old = [], others = [], rs = Math.random) {
  const used = new Set([...old, ...others].map(c => c.situ).filter(Boolean));
  cuts.forEach((c, i) => {
    if (i !== at) { delete c.situ; return; }
    const fit = P.situsFor(outfitEn(c)).filter(k => situAtPlace(k, c)); let pool = fit.filter(k => !used.has(k)); if (!pool.length) pool = fit;
    /* 젖은 옷은 거의 모든 옷에 맞아 늘 후보에 들었다(기록에서 가장 많은 상황) — 다른 후보가 있으면 열에 넷만 남긴다(2026-11-13) */
    if (pool.length > 1 && pool.includes('wet') && rs() >= 0.4) pool = pool.filter(k => k !== 'wet');
    if (pool.length) c.situ = pool[Math.floor(rs() * pool.length)]; else delete c.situ;
  });
  return cuts;
}
/* 자유 설계 칸(2026-11-11) — 옷 자유 칸(ofree, 사용자 2026-11-09 「일상컷도 1장은 gpt에게 노출의상 자유롭게 만들어달라고 해줘」)과 갈래 자유 칸(gfree).
   둘 다 장면 줄을 짜지 않는다(sfree — 장소 · 활동 · 자세 · 구도 · 의상을 맡은 쪽이 T.FREE_DESIGN 덩어리에 채운다), 옷 색 · 데니어는 없다.
   갈래 자유 칸은 노출 갈래 셋 가운데 다른 세계 묶음이 덜 쓴 것(같으면 무작위 — 세계 셋이면 돌아간다) + 열린 상황(gsitu 'free'). 노출 갈래가 다 필수라(2026-11-20) 그 갈래 필수 컷과 같은 갈래다 —
   그 컷의 옷(gnot)은 안 쓰게 지시문에 적는다. recent 는 최근 장면 — 그림 저장소 기록의 최근 장면(recentScenes)에 같은 묶음의 장면 컷을 더한 것 */
function makeFree(cardKey, nums, kinds, cuts, old = [], others = [], recentList = [], rf = Math.random, world = '') {
  const all = [...old, ...cuts], bundle = all.filter(c => !c.sfree).sort((a, b) => a.n - b.n).map(c => sceneText(c, holdOfKey(cardKey), world)).filter(Boolean);
  const recent = [...new Set([...recentList, ...bundle])], out = [];
  for (let i = 0; i < kinds.length; i++) {
    const c = { n: nums[i], treeV: 2, sfree: true };
    if (kinds[i] === 'ofree') c.ofree = true;
    else {
      const n = f => others.filter(o => o.gfree === f).length, lo = Math.min(...EXPOSE_TYPES.map(n)), pool = EXPOSE_TYPES.filter(f => n(f) === lo);
      c.gfree = pool[Math.floor(rf() * pool.length)];
      const req = all.find(x => requiredType(x) === c.gfree);
      if (req && req.item) c.gnot = req.item;
      c.gsitu = 'free';   /* 상황은 GPT 가 짓는다 — 우리 넷이 아닌 것 먼저(사용자 2026-11-11 「상황도 열어주자」) */
    }
    Object.assign(c, { recent, axes: { ...FIXED_AXES }, aspect: '2:3', unlocked: [] });
    out.push(c);
  }
  return out;
}
/* 장면 한 줄(영어, 트리 표 이름) — 장소 + 하는 일(소품 동작, 없으면 자세). 최근 장면 · 같은 묶음 장면을 자유 설계 칸에 적을 때 */
const HOLD = new Map();
function holdOfKey(key) { if (!key) return ''; if (!HOLD.has(key)) { const c = P.card(D, key); HOLD.set(key, c ? P.holdOf(c) : ''); } return HOLD.get(key); }
function sceneText(sc, hold = '', world = '') {
  const p = C2.place(T2, sc.place); if (!p) return '';
  const u = C2.use(T2, sc.use), pr = u && C2.prop(T2, u.prop), po = C2.posture(T2, sc.posture);
  const act = u && pr ? u.en.replace('{prop}', pr.signature ? (String(hold).split(/ with |, /)[0] || 'her own object') : pr.en) : (po && po.en) || '';
  const short = t => String(t).split(/ — |, /)[0].replace(/\s+/g, ' ').trim();   /* 짧게 — 첫 덩어리만(「a mine gallery of rough rock walls, timber props, …」 → 앞 말) */
  return short(P.placeEn(p, world)) + (act ? ' — ' + short(act) : '');   /* 장소는 그 세계 글(트리 장소 worlds, 2026-11-24) */
}
/* 자유 설계 기록의 장면 — 채운 덩어리의 Place · Activity 줄(「…」 그대로면 없음) */
function freeText(text) {
  const g = re => ((re.exec(String(text || '')) || [])[1] || '').trim();
  const place = g(/^Place: (.+)$/m), act = g(/^Activity: (.+)$/m);
  if (!place || /…/.test(place)) return '';
  return place.replace(/\.$/, '') + (act && !/…/.test(act) ? ' — ' + act.replace(/\.$/, '') : '');
}
/* 최근 장면 — 그림 저장소의 모든 카드 일상컷 기록을 올린 날(imported, 없으면 date) 늦은 차례로, 같은 글은 한 번, n 개까지 */
function recentScenes(dir, n = RECENT_N) {
  if (!dir || !fs.existsSync(dir)) return [];
  const rows = [];
  for (const k of fs.readdirSync(dir)) {
    if (!fs.statSync(path.join(dir, k)).isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(dir, k)).filter(x => /-casual\d+\.[a-z0-9_]+-ui\.json$/.test(x))) {
      let r; try { r = JSON.parse(fs.readFileSync(path.join(dir, k, f), 'utf8')); } catch (e) { continue; }
      if (!r || !r.scene) continue;
      const gen = r.generation || {}, text = r.scene.sfree ? freeText(gen.free_design || gen.free_prompt) : sceneText(r.scene, holdOfKey(r.card || k), r.world || '');
      if (text) rows.push({ when: String(r.imported || r.date || ''), at: k + '/' + f, text });
    }
  }
  rows.sort((a, b) => b.when.localeCompare(a.when) || b.at.localeCompare(a.at));
  const out = [];
  for (const r of rows) { if (!out.includes(r.text)) out.push(r.text); if (out.length >= n) break; }
  return out;
}
/* ══ 캐릭터만의 컷(2026-11-13) — 표 data/casual-own.json. 세계마다 한 장을 일상 묶음에 더해(번호 OWN_N — 묶음 장수 · 묶음 규칙에는 안 센다) 필수로.
   장면 글은 하나, 의상 줄만 노출 단계(bold → moderate → low)로 바뀐다. 손 · 구도는 표의 자세 추천을 트리로 풀어 쓴다(팔 규칙 그대로). 내용이 없는 카드 · 세계는 건너뛴다 */
const OWN = fs.existsSync(path.join(ROOT, 'data', 'casual-own.json')) ? JSON.parse(read('data/casual-own.json')) : { cards: {} };
const OWN_N = OWN.number || 90, OWN_LEVELS = OWN.levels || ['bold', 'moderate', 'low'];
const ownRow = (card, world) => card.c && card.c.tier === 'landmark' ? null : (((OWN.cards || {})[card.key] || {}).worlds || {})[world] || null;
function ownCut(card, world, level = OWN_LEVELS[0], rr = Math.random) {
  const row = ownRow(card, world); if (!row) return null;
  if (!OWN_LEVELS.includes(level)) throw new Error('노출 단계는 ' + OWN_LEVELS.join(' · ') + ' — ' + level);
  const g = { ...card.g, world, land: '' };   /* 바탕 장소는 받침만 빌린다 — 땅은 안 본다 */
  const era = ERA;
  /* 직업의 도구(row.prop)는 「그 물건」 소품 자리로 든다(sig_hold · sig_raise · sig_both · sig_low — 어느 장소에서나, 손 글은 트리 것) */
  let sc = { treeV: 2, era, place: row.base, ofam: row.ofam || 'everyday', prop: row.prop ? '0' : '', ...(row.prop ? { ownProp: row.prop } : {}) };
  if (!C2.presetOk(T2, sc, row.preset, g) && !row.use) throw new Error(`${card.key} ${world} 캐릭터만의 컷: 자세 추천 ${row.preset} 가 바탕 장소 ${row.base} 에서 안 된다 — 표의 base · preset 을 고친다`);
  sc = C2.repair(T2, C2.applyPreset(T2, sc, row.preset), g, l => l[0]);
  if (row.use) { const next = C2.set(T2, sc, 'use', row.use, g, l => l[0]); if (next.use !== row.use) throw new Error(`${card.key} ${world} 캐릭터만의 컷: 소품 동작 ${row.use} 가 ${row.preset} @ ${row.base} 에서 안 된다`); sc = next; }
  if (sc.posture !== (C2.preset(T2, row.preset) || {}).posture) throw new Error(`${card.key} ${world} 캐릭터만의 컷: ${row.preset} 의 자세가 ${row.base} 에서 안 된다`);
  Object.assign(sc, C2.ambience(T2, sc, rr, { times: [], hairs: [] }), lifeOf(row.base) ? lifeAmbience({ place: row.base }, card.city, rr, {}) : {});
  delete sc.weather;
  for (const k of [...AMBIENT, 'season', 'cityWeather']) if (!sc[k]) delete sc[k];
  const body = by(tree2.body, sc.body), head = by(tree2.head, sc.head);
  return { ...sc, n: OWN_N, own: world, ...(row.prop ? { prop: '0', ownProp: row.prop } : {}), placeText: row.place, scene: row.activity, outfit: row.outfit[level] || row.outfit[OWN_LEVELS[0]], preset: row.preset,
    expr: body && body.face_hidden && !(head && head.look_back) ? '' : EXPRS[Math.floor(rr() * EXPRS.length)], axes: { ...FIXED_AXES, skin_exposure: level }, aspect: aspectOf(sc), unlocked: [] };
}
const MUST = /^(필수 노출 갈래|먼 컷|가까운 컷|그 도시의 물건을 든 컷이 없다|생활 장면 필수 컷이 없다|게임 코스프레 컷이 없다|상황 노출 컷이 없다|옷 자유 컷이 없다|갈래 자유 컷이 없다)/;
/* 아직 짤 칸 갈래 — KINDS 에서 이미 있는 컷(old)의 갈래를 하나씩 뺀 것(차례 그대로 — 생활 장면 컷이 맨 앞, 자유 설계 둘이 맨 뒤) */
function kindsLeft(old) {
  const left = KINDS.slice();
  for (const c of old) { const i = left.indexOf(kindOf(c)); if (i >= 0) left.splice(i, 1); }
  return left;
}
/* 둘째 판(prune)의 자세 추천 한도 — 묶음 규칙(check)의 프레이밍 · 몸 방향 · 하는 일 갈래 · 어깨 너머 한도를 이 추천이 넘기면 처음부터 빼고,
   노출 갈래 · 코스프레 칸엔 얼굴 클로즈업 추천을 안 준다. base(이미 있는 컷)가 벌써 넘긴 한도는 check 처럼 그만큼 올려 준다 */
function capFits(old, cuts) {
  const base = old.filter(c => !c.sfree), all = [...base, ...cuts.filter(c => !c.sfree)], n = Math.max(SCENE_N, all.length + 1);
  const cnt = (xs, f, v) => xs.filter(c => f(c) === v).length, roomFor = (f, v, most) => !v || cnt(all, f, v) + 1 <= Math.max(most, cnt(base, f, v));
  const actOf = c => (by(tree2.presets, c.preset) || {}).act, lookBack = c => !!(by(tree2.head, c.head) || {}).look_back;
  return (p, kind) => {
    if ((EXPOSE_TYPES.includes(kind) || kind === 'cosplay') && (EXPOSE_NO_FRAME.includes(p.frame) || (kind === 'cosplay' && COS_NO_FRAME.includes(p.frame)))) return false;
    return roomFor(c => c.frame, p.frame, Math.max(1, Math.ceil(n / FRAMES.length))) && roomFor(c => c.body, p.body, Math.max(2, Math.ceil(n / 3)))
      && roomFor(actOf, p.act, ACT_MOST) && (!(by(tree2.head, p.head) || {}).look_back || roomFor(lookBack, true, 1));
  };
}
/* cosplayUsed — 이 공방 그림 저장소의 쓴 코스프레(cosplayUsage)에 이번에 짠 다른 세계의 것을 더한 목록. 비우면 아무도 안 쓴 것으로 본다(검사는 그렇게 돈다) */
function plan(card, slots, old, { seed = Date.now(), usage = {}, others = [], recent = [], cosplayUsed = [] } = {}) {
  /* 씨앗에 카드 · 세계를 섞는다 — 같은 씨앗이면 카드마다 같은 묶음이 나왔다 */
  card.g.world = card.world || '';   /* 그 세계에만 있는 자리(worlds_only) */
  const mix = [...(card.key + '|' + (card.world || ''))].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const rUse0 = rng((seed ^ mix ^ 0x5bd1e995) >>> 0), r0 = rng((seed ^ mix) >>> 0);
  /* 칸 갈래 — 남은 갈래를 앞에서부터 칸 수만큼(자유 설계 둘은 맨 뒤 번호에) */
  const want = kindsLeft(old).slice(0, slots.length), kinds = want.filter(k => k !== 'ofree' && k !== 'gfree'), freeKinds = want.filter(k => k === 'ofree' || k === 'gfree');
  const freeNums = slots.slice(kinds.length, kinds.length + freeKinds.length);
  slots = slots.slice(0, kinds.length);   /* 여기부터 slots 는 장면을 짜는 칸만 */
  const cos = kinds.includes('cosplay') ? pickCosplay(cosplayUsed, rng((seed ^ mix ^ 0x2545f491) >>> 0), () => true, g => worldOk(card.world || '', [g.en, g.character, g.outfit].join(' '))) : null;
  if (kinds.includes('cosplay') && !cos) throw new Error('게임 코스프레 — 목록의 게임 · 캐릭터 · 재단을 다 썼다(data/game-cosplay.json 에 게임을 더한다)');
  const oldScene = old.filter(c => !c.sfree), oldFrames = new Set(oldScene.map(c => c.frame));
  const sigOk = k => k === 'life' || k === 'plain', noClose = k => EXPOSE_TYPES.includes(k) || k === 'cosplay';
  const needSig = card.g.signature_hold.length > 0 && !old.some(sigProp) && slots.length + oldScene.length >= 3;
  const U0 = usageOf(usage);   /* 쓴 횟수 꼴은 한 번만(칸마다 다시 셌다 — 2026-11-24 속도) */
  /* 막히는 씨앗(2026-11-24) — 한 카드에 묶음이 쌓이면 다른 세계 · 묶음이 쓴 자세 추천 · 옷이 늘어, 미리 나눈 프레이밍(얼굴 클로즈업 — 추천 몇 개뿐)이나
     덜 쓴 실루엣 갈래의 옷 하나가 「다른 세계가 쓴 것」 만 남아 400 번을 다 버렸다. 그러면 둘째 판(prune)에서 그 규칙(check)이 어차피 막을 고를 거리를 처음부터 빼고
     (다른 세계 · 묶음 · 이 묶음이 쓴 자세 추천 · 다른 세계 · 묶음이 입은 옷 · 이 곳에 입힌 계열 · 남은 추천이 없는 프레이밍) 따로 된 난수로 다시 400 번. 규칙은 그대로, 첫 판은 옛 씨앗 그대로 */
  for (let phase = 0; phase < 2; phase++) {
  const prune = phase === 1, r = prune ? rng((seed ^ mix ^ 0x0b4f3a1d) >>> 0) : r0, rUse = prune ? rng((seed ^ mix ^ 0x7c1e9d55) >>> 0) : rUse0;
  const usedPresets = new Set([...old, ...others].map(c => c.preset).filter(Boolean)), worn = new Set(others.map(outfitKeyOf).filter(Boolean));
  const framePool = prune ? FRAMES.filter(f => (tree2.presets || []).some(p => p.frame === f && !usedPresets.has(p.key))) : FRAMES;
  if (!framePool.length) continue;
  for (let attempt = 1; attempt <= 400; attempt++) {
    let frames = framePool.filter(f => !oldFrames.has(f)).sort(() => r() - 0.5);
    while (frames.length < slots.length) frames = frames.concat(framePool.slice().sort(() => r() - 0.5));
    frames = frames.slice(0, slots.length);
    /* 노출 갈래 · 코스프레 칸엔 얼굴 클로즈업을 두지 않는다 — 걸리면 생활 장면 · 보통 칸과 바꾼다 */
    let stuck = false;
    kinds.forEach((k, i) => {
      if (!noClose(k) || !EXPOSE_NO_FRAME.includes(frames[i])) return;
      const j = kinds.findIndex((x, jj) => !noClose(x) && !EXPOSE_NO_FRAME.includes(frames[jj]));
      if (j < 0) stuck = true; else [frames[i], frames[j]] = [frames[j], frames[i]];
    });
    if (stuck) continue;
    const seen = [...oldScene, ...frames.map(frame => ({ frame }))];
    if (slots.length + oldScene.length >= 3 && (!seen.some(c => FAR.includes(c.frame)) || !seen.some(c => NEAR.includes(c.frame)))) continue;
    const sigPool = kinds.map((k, i) => i).filter(i => sigOk(kinds[i])), sigAt = needSig && sigPool.length ? sigPool[Math.floor(r() * sigPool.length)] : -1, cuts = [];
    for (let i = 0; i < slots.length; i++) {
      let got = null;
      const taken = new Set([...old, ...cuts].map(c => c.place).filter(Boolean));
      const here = { ...U0, prop: { ...U0.prop }, ofam: { ...U0.ofam }, combo: { ...(U0.combo || {}) } }; cuts.forEach(c => { if (c.posture) here.combo[comboKey(c)] = (here.combo[comboKey(c)] || 0) + 2; const u = C2.use(T2, c.use); if (u) here.prop[u.prop] = (here.prop[u.prop] || 0) + 10; here.ofam[c.ofam] = (here.ofam[c.ofam] || 0) + 10; });   /* 묶음 안에서 이미 고른 옷 계열은 다시 덜 고른다(동탄룩 한 장까지) */   /* 칸마다 한 번(시도마다 같은 값이었다 — 2026-11-24 속도) */
      const pr = prune ? { presets: new Set([...usedPresets, ...cuts.map(c => c.preset)]), outfits: worn, fits: capFits(old, cuts) } : null;
      for (let k = 0; k < 60 && !got; k++) {
        /* 둘째 판은 미리 나눈 프레이밍으로 스무 번 — 안 되면 한도가 남은 아무 프레이밍(먼 컷 · 가까운 컷 하나씩은 끝 검사가 본다) */
        const sc = slot(r, card, kinds[i], { once: [...old, ...cuts, ...others].some(x => x && C2.presetOnce && C2.presetOnce(T2, x.preset)), frame: prune && k >= 20 ? '' : frames[i], wantSig: i === sigAt, usage: here, rUse, cut: cos ? cos.cut : '', taken, others, prune: pr });
        if (!sc) continue;
        const cand = { n: slots[i], ...sc };
        if (kinds[i] === 'life') cand.lifeMust = true;
        if (kinds[i] === 'cosplay') cand.cosplay = { ...cos };
        if (!check([...cuts, cand], card, old, others).filter(e => !MUST.test(e)).length) got = cand;
      }
      if (!got) break;
      cuts.push(got);
    }
    if (cuts.length !== slots.length || check(cuts, card, old, others).filter(e => !MUST.test(e)).length) continue;
    colorize(cuts, old, others, rng((seed ^ mix ^ 0x27d4eb2f) >>> 0), card.world || ''); denierize(cuts, rng((seed ^ mix ^ 0x165667b1) >>> 0));
    /* 옷 꾸밈(2026-11-23 — 공용 모듈 spreadStyles, 사용자 「1,3,4,5,6번까지해서 공통으로 해줘」): 소재 · 입은 모양 · 핏 · 겹쳐 입기 · 장신구를 묶음 안에서 덜 쓴 것부터. 코스프레 · 자유 설계 · 직접 쓴 옷 글은 모듈이 뺀다. 두꺼운 겉옷 · 장갑은 눈 · 겨울일 때만 */
    if (C2.spreadStyles) C2.spreadStyles(T2, cuts.filter(c => !c.sfree), rng((seed ^ mix ^ 0x5bd1e995) >>> 0), old, { ok: en => worldOk(card.world || '', en), cold: sc => /snow|winter|cold|frost|freez/.test([sc.season, sc.weather, sc.cityWeather].join(' ')) });
    /* 상황 노출 — 보통 컷 한 장(얼굴 클로즈업이 아닌, 맞는 상황이 있는 컷)에 늘. 그 세계에 이미 상황 컷이 있으면 없음, 보통 칸이 있는데 맞는 컷이 없으면 다른 묶음으로 */
    const rs = rng((seed ^ mix ^ 0x3c6ef372) >>> 0), plainAt = cuts.map((c, i) => i).filter(i => kindOf(cuts[i]) === 'plain');
    const sPool = old.some(c => c.situ) ? [] : plainAt.filter(i => !SITU_NO_FRAME.includes(cuts[i].frame) && P.situsFor(outfitEn(cuts[i])).some(k => situAtPlace(k, cuts[i])));
    if (!old.some(c => c.situ) && plainAt.length && !sPool.length) continue;
    situate(cuts, sPool.length ? sPool[Math.floor(rs() * sPool.length)] : -1, old, others, rs);
    if (sPool.length && !cuts.some(c => c.situ)) continue;
    ambient(cuts, old, rng((seed ^ mix ^ 0x7f4a7c15) >>> 0), card.city, usage); momentize(cuts, old, rng((seed ^ mix ^ 0x61c88647) >>> 0), usage, card.world || '');
    const free = makeFree(card.key, freeNums, freeKinds, cuts, old, others, recent, rng((seed ^ mix ^ 0x1b873593) >>> 0), card.world || '');
    ambient(free, [...old, ...cuts], rng((seed ^ mix ^ 0x68e31da4) >>> 0), card.city, usage);   /* 자유 설계 칸의 시간대(원소 B) — 자유 칸은 ambient 뒤에 생겨 원소 계획기에선 시간대가 안 붙었다. 장면 컷과 덜 겹치는 시간대 */
    if (check([...cuts, ...free], card, old, others).length) continue;
    const all = [...old, ...cuts, ...free];
    return { cuts: [...cuts, ...free], attempt: phase * 400 + attempt, prune, required: [...all.filter(c => c.lifeMust).map(c => 'life:' + c.place), ...all.map(requiredType).filter(Boolean), ...all.filter(isCosplay).map(c => 'cosplay:' + (c.cosplay || {}).game + '/' + (c.cosplay || {}).character + '/' + (c.cosplay || {}).cut),
      ...all.filter(c => c.situ).map(c => 'situ:' + c.situ), ...all.filter(c => c.ofree && c.sfree).map(() => 'ofree'), ...all.filter(c => c.gfree).map(c => 'gfree:' + c.gfree + '+' + c.gsitu)].join(' · ') };
  }
  }
  throw new Error('규칙을 다 지키는 묶음을 못 찾았다 — 이미 있는 컷이 칸을 너무 많이 차지했는지 본다');
}

/* 기록 — 생성기 「기록 내보내기」 와 같은 꼴(P.casualRecord) + 그 기록이 놓일 자리 */
const recordRel = (key, world, n, style = STYLE) => `records/${key}/${world}-casual${n}.${style}-ui.json`;
function record(card, world, cut) {
  const { n, ...scene } = cut;
  return { ...P.casualRecord(D, S, card.key, scene, { world, style: STYLE, tree, tree2, life: LIFE, props: PROPS, cosplay: COSPLAY }, n), record: recordRel(card.key, world, n) };
}
/* 이미 있는 컷 — 그 세계의 기록(<세계>-casualN.<화풍>-ui.json) */
function oldCuts(dir, card, world) {
  if (!dir || !fs.existsSync(dir)) return [];
  const re = new RegExp('^' + world + '-casual(\\d+)\\.' + STYLE + '-ui\\.json$');
  return fs.readdirSync(dir).filter(f => re.test(f) && Number(re.exec(f)[1]) !== OWN_N).map(f => {   /* 캐릭터만의 컷(OWN_N)은 묶음 밖 */
    const rec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    return { n: Number(re.exec(f)[1]), ...(rec.scene.sfree ? { ...rec.scene } : C2.repair(T2, { ...rec.scene }, card.g)), old: true };   /* 자유 설계 칸은 트리로 채우지 않는다 */
  });
}
/* 등록된 그 세계의 일상컷 번호 */
function registered(card, world) {
  const v = (((JSON.parse(read('data/img.json')).img || {})[card.key] || {}).byStyle || {})[STYLE] || {};
  return (((((v.byForm || {})[world] || {}).casual || {}).f) || []).map(f => Number((/_casual(\d+)\.webp$/.exec(f) || [])[1])).filter(n => n && n !== OWN_N);
}
/* 그 세계의 캐릭터만의 컷이 벌써 있나 — 등록부 또는 기록 */
function ownDone(card, world, recDir) {
  const v = (((JSON.parse(read('data/img.json')).img || {})[card.key] || {}).byStyle || {})[STYLE] || {};
  const reg = (((((v.byForm || {})[world] || {}).casual || {}).f) || []).some(f => new RegExp('_casual' + OWN_N + '\\.webp$').test(f));
  return reg || [].concat(recDir || []).some(d => fs.existsSync(path.join(d, `${world}-casual${OWN_N}.${STYLE}-ui.json`)));
}
/* 캐릭터만의 컷 한 걸음 — 표에 내용이 있고 아직 없으면(등록 · 기록) 한 장. 일상 묶음이 다 찬 카드도 이 한 장은 짠다.
   --own-level 로 단계를 내려 다시 짓는다(막혔을 때 — IMAGE_RULES) */
function ownStep(card, world, seed, opt, recDir, worlds) {
  if (ownRow(card, world) && (opt['own-level'] || !(ownDone(card, world, recDir)))) {
    /* 같은 카드의 다른 세계와 자세 추천(= 구도)이 같으면 짓지 않는다 — 표를 고친다(2026-11-13 사용자 「세 세계가 같은 구도인 직업컷은 세계마다 다른 자세로」) */
    const same = Object.entries((OWN.cards[card.key] || {}).worlds || {}).filter(([w, r]) => w !== world && r.preset === ownRow(card, world).preset).map(([w]) => w);
    if (same.length) { console.log(`  ${OWN_N} ✗ 캐릭터만의 컷 — ${same.join(' · ')} 세계와 같은 구도(${ownRow(card, world).preset}) · data/casual-own.json 을 고친다 · 건너뜀`); return; }
    const oc = ownCut(card, world, opt['own-level'] || OWN_LEVELS[0], rng((seed ^ 0x51ed270b) >>> 0));
    console.log(`  ${OWN_N} ◆ 캐릭터만의 컷 — ${ownRow(card, world).job_ko} · 노출 ${oc.axes.skin_exposure} · ${oc.preset}`);
    if (opt.out) { const out = worlds.length > 1 ? path.join(opt.out, 'plan-' + world) : opt.out; fs.mkdirSync(out, { recursive: true }); const rec = record(card, world, oc);
      rec.own = { job_ko: ownRow(card, world).job_ko, level: oc.axes.skin_exposure, example: !!((OWN.cards[card.key] || {}).example) };
      fs.writeFileSync(path.join(out, `${world}-casual${OWN_N}.${STYLE}-ui.json`), JSON.stringify(rec, null, 1) + '\n'); fs.writeFileSync(path.join(out, `${world}-casual${OWN_N}-prompt.txt`), rec.prompt); }
  } else if (card.c.tier === 'landmark') { /* 랜드마크는 90 컷이 없다 — 말 없음 */
  } else if (!ownRow(card, world)) console.log(`  ${OWN_N} ◇ 캐릭터만의 컷 — 아직 없음(data/casual-own.json 에 내용이 없다) · 건너뜀`);
}
function freeSlots(card, world, want = CASUAL_N) {
  const taken = new Set(registered(card, world)), out = [];
  for (let n = 1; taken.size + out.length < want; n++) if (!taken.has(n)) out.push(n);
  return out;
}
/* 쓴 횟수 — 그림 저장소의 모든 카드 기록에서(그 카드는 빼고): 소품(그 도시의 물건은 빼고) · 장소 · 옷 · 자세 추천 · 자세 · 표정 */
function sceneUsage(dir, skip) {
  const out = EMPTY_USAGE();
  if (!dir || !fs.existsSync(dir)) return out;
  const add = (m, k) => { if (k) m[k] = (m[k] || 0) + 1; };
  const tally = sc => {
    const u = C2.use(T2, sc.use);
    if (u && u.prop !== 'signature') add(out.prop, u.prop);
    add(out.place, sc.place); add(out.item, sc.item); add(out.preset, sc.preset); add(out.posture, sc.posture); add(out.expr, sc.expr); add(out.ofam, sc.ofam);
    add(out.time, sc.time); add(out.light, sc.light); add(out.cityWeather, sc.cityWeather); if (sc.posture) add(out.combo, comboKey(sc)); add(out.moment, sc.moment);   /* 시간대 · 빛 · 날씨(원소 2026-11-18 A — 전체 기록 비율) · 자세 짝(C) · 순간(D) */
    if (sc.preset && sc.place) add(out.path, pathKey(sc.preset, sc.place));
  };
  const city = String(skip || '').split('-')[0];   /* 같은 도시 카드(<도시> · <도시>-*) — 안 그린 계획 파일도 센다 */
  for (const k of fs.readdirSync(dir)) {
    if (k === skip || !fs.statSync(path.join(dir, k)).isDirectory()) continue;
    const files = fs.readdirSync(path.join(dir, k)), drawn = new Set();
    for (const f of files.filter(x => /-casual\d+\.[a-z_]+-ui\.json$/.test(x))) {
      const m = REC_FILE.exec(f); if (m) drawn.add((m[1] || '') + '|' + Number(m[2]));
      let sc; try { sc = JSON.parse(fs.readFileSync(path.join(dir, k, f), 'utf8')).scene; } catch (e) { continue; }
      if (sc) tally(sc);
    }
    if (!city || k.split('-')[0] !== city) continue;
    const planned = new Map();   /* 세계 · 번호마다 가장 나중(replan) 계획 한 칸 — 그린 번호는 기록이 센다 */
    for (const f of files.filter(x => PLAN_FILE.test(x) && !PLAN_OLD.test(x))) {
      let r; try { r = JSON.parse(fs.readFileSync(path.join(dir, k, f), 'utf8')); } catch (e) { continue; }
      if (!Array.isArray(r.cuts)) continue;
      const world = r.world || (/^([^.-]+)[.-]/.exec(f) || [])[1] || '', re = /replan/.test(f) ? 1 : 0;
      for (const c of r.cuts) { const pk = world + '|' + cutNo(c), was = planned.get(pk); if (c && !c.sfree && (!was || re >= was.re)) planned.set(pk, { c, re }); }
    }
    for (const [pk, { c }] of planned) if (!drawn.has(pk)) tally(c);
  }
  return out;
}
const propUsage = (dir, skip) => sceneUsage(dir, skip).prop;
function line(c) {
  if (c.sfree) {
    const fam = c.gfree ? (CT.family(tree, c.gfree) || {}).ko || c.gfree : '', si = c.gsitu === 'free' ? '상황 자유' : c.gsitu ? (by(T.CASUAL.situations, c.gsitu) || {}).ko || c.gsitu : '';
    return `${c.old ? '  (있음)' : '  '} ${c.n} ✦  ${c.gfree ? '갈래 자유 — ' + fam + ' · 상황 ' + si + (c.gnot ? ' · ' + ((CT.item(tree, c.gfree, c.gnot) || {}).ko || c.gnot) + ' 말고' : '') : '옷 자유'} │ 장면 통째 자유 설계(장소 · 활동 · 자세 · 구도 · 의상을 GPT · Claude 가 — 최근 장면 ${(c.recent || []).length} 개 피하기)`;
  }
  const p = C2.place(T2, c.place) || {}, f = CT.family(tree, c.ofam) || {}, it = CT.item(tree, c.ofam, c.item), u = C2.use(T2, c.use), pr = by(tree2.presets, c.preset);
  const ko = (list, k) => (by(list, k) || {}).ko || k || '—', hand = k => k === 'prop' ? '소품' : ko(tree2.hands, k);
  const tko = (by(TIMES, c.time) || {}).ko, sko = (by(SEASONS(lifeOf(c.place) ? lifeOf(c.place).city : ''), c.season) || {}).ko, wko = (by(WEATHERS(lifeOf(c.place) ? lifeOf(c.place).city : ''), c.cityWeather) || {}).ko;
  return `${c.old ? '  (있음)' : '  '} ${c.n} ${requiredType(c) || isCosplay(c) || c.lifeMust ? '★' : ' '}${C2.awkward(T2, c.ofam, c.place).length ? '⚠' : ' '} ${lifeOf(c.place) ? '[장면] ' : '[일반] '}${p.ko} · ${[sko, wko, tko].filter(Boolean).join(' · ') || '—'} · ${f.ko}${it ? '(' + it.ko + ')' : ''} │ ${pr ? pr.ko : '—'} │ ` +
    `${ko(tree2.postures, c.posture)} · ${c.frame} ${c.aspect || '2:3'} · ${ko(tree2.body, c.body)} · ${ko(tree2.head, c.head)} · 오른손 ${hand(c.right)} · 왼손 ${hand(c.left)}${u ? ' · ' + ko(tree2.props, u.prop) + ' ' + u.ko : ''}${c.legs ? ' · ' + ko(tree2.legs, c.legs) : ''}${c.gaze ? ' · 시선 ' + ko(tree2.gaze, c.gaze) : ''}${c.situ ? ' · 상황 ' + ko(T.CASUAL.situations, c.situ) : ''}${c.ofree ? ' · 옷 자유(노출 의상을 GPT · Claude 가)' : ''}${isCosplay(c) ? ' · 코스프레 ' + cosplayKo(c.cosplay) : ''}${c.lifeMust ? ' · 생활 장면 필수' : ''}`;
}

const FLAGS = new Set(['fresh']);
function main(argv) {
  const key = argv[0], opt = {};
  for (let i = 1; i < argv.length; i++) { const k = argv[i].replace(/^--/, ''); opt[k] = FLAGS.has(k) ? true : argv[++i]; }   /* --fresh 는 값 없이 */
  let card;
  try { card = cardOf(key); } catch (e) { console.error(e.message + '\n' + fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 20).join('\n')); return 2; }
  const recDir = opt.records || path.join(ROOT, '..', 'city-atelier-img', 'records', key);
  /* 다른 세계의 컷(그리고 --fresh 면 같은 세계의 옛 묶음까지) — 장면을 돌려쓰지 않게 겹침만 본다 */
  const allOld = w => oldCuts(recDir, { ...card, world: w }, w);
  if (opt.check) {
    const world = opt.world; card.world = world;
    if (!card.worlds.includes(world)) { console.error(`${key} 는 ${card.worlds.join(' · ')} 에 산다 — --world 로 하나`); return 2; }
    /* --from N: 옛 묶음 뒤에 더한 새 묶음(N 번부터)만 묶음으로 보고, 옛 묶음은 겹침에만 넣는다 */
    const from = Number(opt.from || 0), all = oldCuts(opt.check, card, world);
    const cuts = all.filter(c => c.n >= from), others = [...all.filter(c => c.n < from), ...card.worlds.filter(w => w !== world).flatMap(w => oldCuts(opt.check, { ...card, world: w }, w))];
    for (const c of cuts.sort((a, b) => a.n - b.n)) console.log(line(c));
    const errs = cuts.length ? check(cuts.map(c => ({ ...c, old: false })), card, [], others) : [`${world} 일상컷 기록이 없다 — 폴더 · --from 을 확인`];
    /* 자유 설계 칸은 채운 글이 기록에 남아야 한다(2026-11-11 사용자 「어떤 설계 했는지 다 남지?」) — generation.free_prompt 에 「…」 를 채운 지시문 통째 */
    for (const c of cuts.filter(x => x.sfree)) {
      const g = JSON.parse(fs.readFileSync(path.join(opt.check, `${world}-casual${c.n}.${STYLE}-ui.json`), 'utf8')).generation || {}, t = String(g.free_prompt || '');
      if (!/^FREE DESIGN: /m.test(t) || /^(?:Place|Activity|Pose|Framing|Outfit): …/m.test(t)) errs.push(`칸 ${c.n}: 자유 설계 칸인데 채운 설계가 기록에 없다 — generation.free_prompt(실제로 넘긴 지시문 통째, 「…」 를 채운 것) · free_design(채운 덩어리)`);
    }
    /* 게임 코스프레 칸은 그린 코스프레가 기록에 남아야 한다(원소 2026-11-15) — generation.cosplay = { game, character, cut }, 계획이 정한 캐릭터 · 재단 그대로 */
    for (const c of cuts.filter(isCosplay)) {
      const g = (JSON.parse(fs.readFileSync(path.join(opt.check, `${world}-casual${c.n}.${STYLE}-ui.json`), 'utf8')).generation || {}).cosplay || {}, cs = c.cosplay || {};
      const name = String(g.character || '').trim();
      if (g.game !== cs.game || !name || !COS_CUTS.includes(g.cut)) errs.push(`칸 ${c.n}: 게임 코스프레 칸인데 그린 코스프레가 기록에 없다 — generation.cosplay = { game: "${cs.game}", character: "${cs.character || '<그린 캐릭터>'}", cut: "${cs.cut || '<재단>'}" }`);
      else if (cs.character && (normName(name) !== normName(cs.character) || g.cut !== cs.cut)) errs.push(`칸 ${c.n}: 정해 둔 코스프레는 ${cs.character} · ${cs.cut} — 기록은 ${name} · ${g.cut}`);
    }
    for (const e of errs) console.log('  X ' + e);
    console.log(errs.length ? `일상컷 묶음 ${errs.length} 가지 걸림` : `일상컷 묶음 통과 — ${cuts.length} 장`);
    return errs.length ? 1 : 0;
  }
  const worlds = opt.world === 'all' ? card.worlds : [opt.world];
  if (!worlds.every(w => card.worlds.includes(w))) { console.error(`${key} 는 ${card.worlds.join(' · ')} 에 산다 — --world 로 하나 또는 all`); return 2; }
  const fresh = 'fresh' in opt, seed0 = Number(opt.seed || Date.now() % 1e9);
  const usageDir = opt.usage === 'none' ? '' : (opt.usage || path.join(ROOT, '..', 'city-atelier-img', 'records'));
  if (usageDir && !fs.existsSync(usageDir)) console.log(`그림 저장소 기록이 없다(${usageDir}) — 다른 카드 쓴 횟수 · 최근 장면 없이 빈 기록으로 짠다(--usage none 과 같다)`);
  const extra = (opt.others || '').split(',').filter(Boolean).flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')).cuts || []);
  /* 게임 코스프레의 쓴 것 — 이 공방 그림 저장소의 그린 기록 + 아직 안 그린 계획의 예약(원소 2026-11-16). 저장소가 없으면 멈춘다. 지금 짜는 도시 · 세계의 옛 계획은 빼고, --cosplay-usage none 이면 비운다 */
  try { cosplayReposOk(opt); } catch (e) { console.error(e.message); return 2; }
  const cosUsed = opt['cosplay-usage'] === 'none' ? [] : cosplayUsage(opt['cosplay-usage'] ? opt['cosplay-usage'].split(',') : COSPLAY_ROOTS, { skip: worlds.map(w => key + '|' + w) });
  const planned = [];
  for (const world of worlds) {
    card.world = world;
    const mine = allOld(world), taken = Math.max(0, ...mine.map(c => c.n), ...registered(card, world));
    /* --fresh: 옛 묶음은 그대로 두고 그 뒤 번호로 새 열 장(사용자 2026-11-02 「대체하는건 아니고, 추가로」) */
    const slots = opt.slots ? opt.slots.split(',').map(Number) : fresh ? Array.from({ length: CASUAL_N }, (_, i) => taken + 1 + i) : freeSlots(card, world);
    if (!slots.length) { console.log(`${key} ${world} — 일상컷이 벌써 ${CASUAL_N} 장이다`); ownStep(card, world, seed0 + worlds.indexOf(world), opt, recDir, worlds); continue; }
    const old = fresh ? [] : mine.filter(c => !slots.includes(c.n));
    const others = [...card.worlds.filter(w => w !== world).flatMap(allOld), ...(fresh ? mine : []), ...extra, ...planned];
    const seed = seed0 + worlds.indexOf(world);
    const res = plan(card, slots, old, { seed, usage: sceneUsage(usageDir, key), others, recent: recentScenes(usageDir),
      cosplayUsed: [...cosUsed, ...[...extra, ...planned].filter(c => isCosplay(c) && c.cosplay).map(c => ({ game: c.cosplay.game, character: c.cosplay.character || '', cut: c.cosplay.cut }))] });   /* 이번에 짠 앞 세계 것도 센다 */
    planned.push(...res.cuts);
    console.log(`${key} ${world} 일상컷 묶음 — 칸 ${slots.join(',')} · 정해 둔 갈래 ${res.required} · 시도 ${res.attempt}${res.prune ? '(막힘 풀기 — 쓴 고를 거리를 처음부터 빼고)' : ''} · seed ${seed}${fresh ? ' · 새 묶음(옛 묶음과 겹치지 않게)' : ''}`);
    for (const c of [...old, ...res.cuts].sort((a, b) => a.n - b.n)) console.log(line(c));
    if (opt.out) {
      const out = worlds.length > 1 ? path.join(opt.out, 'plan-' + world) : opt.out;
      fs.mkdirSync(out, { recursive: true });
      for (const c of res.cuts) {
        const rec = record(card, world, c);
        fs.writeFileSync(path.join(out, `${world}-casual${c.n}.${STYLE}-ui.json`), JSON.stringify(rec, null, 1) + '\n');
        fs.writeFileSync(path.join(out, `${world}-casual${c.n}-prompt.txt`), rec.prompt);
      }
      fs.writeFileSync(path.join(out, 'plan.json'), JSON.stringify({ card: key, world, seed, tree: 2, style: STYLE, required: res.required, slots, fresh, cosplayRead: opt['cosplay-usage'] || COSPLAY_ROOTS.map(d => path.basename(d)).join(','), cuts: res.cuts }, null, 1) + '\n');
      console.log('→ ' + out);
    }
    ownStep(card, world, seed, opt, recDir, worlds);
  }
  return 0;
}
module.exports = { aspectOf, LIFE, PROPS, lifeOf, lifePlaces, lifeAmbience, placeRules, BANNED, worldOk, NOT_USES, famsAt, plainFams, placeCands, openPlaces, GEN, KINDS, kindOf, LIFE_FIRST, ownCut, ownRow, OWN_N, OWN_LEVELS, ambient, POSE_WEIGHT, cardOf, plan, colorize, denierize, situate, makeFree, sceneText, freeText, recentScenes, SITUS, DENIERS, outfitEn, COLORS, check, record, recordRel, oldCuts, freeSlots, registered, requiredType, propUsage, sceneUsage, CASUAL_N, STYLE, WEIGHT_UNUSED, EXPOSE_TYPES,
  COSPLAY, COS_FAM, COS_SWIM, COSPLAY_ROOTS, cosplayReposOk, isCosplay, cosItem, cutOfItem, cosCutOk, cosplayRow, cosplayUsage, cosplayTally, cosplayOpen, cosplayFull, cosplayAgain, cosplayWeight, pickCosplay, normName };
if (require.main === module) process.exit(main(process.argv.slice(2)));
