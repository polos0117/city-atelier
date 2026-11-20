# 랜드마크 하위 카드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 도시 아래에 랜드마크 사람(세 세계 · 세계마다 세계 그림 + 일상컷 열 장, 90번 없음)을 두고, 서울 해치로 설계표 → 조립기 → 검사기 → 등록 · 잠금 → 계획기 → 생성기 → 화면을 끝까지 통과시킨다.

**Architecture:** 카드 열쇠 `<도시>-<랜드마크>` 를 조립기 `card(D, key)` 한 곳에서 풀어(부모 도시 칸 위에 랜드마크 칸을 덮은 행), 나머지 도구 · 화면은 카드 열쇠만 다룬다. 생활 장면 · 계절 · 날씨는 부모 도시 것.

**Tech Stack:** 정적 페이지(Preact via esm.sh), JSON 설계표, Node 22 도구(`fnm exec --using=22 node`), Python 3(`python -I -X utf8`), Playwright 화면 검사(`NODE_PATH=/c/Users/jjshs/atelier/node_modules`).

**Spec:** `docs/superpowers/specs/2026-11-20-landmark-cards-design.md`

## Global Constraints

- 카드 열쇠 `<도시>-<랜드마크>` — 도시 · 랜드마크 열쇠는 소문자 · 숫자 · `_` 없음 · `-` 없음(예 `seoul-haechi`). 파일 `seoul-haechi_<세계>_<화풍>_f.webp` · `…_f_casualN.webp`, 기록 `records/seoul-haechi/`, 잠금 `seoul-haechi_<세계>`.
- 서울 · 도쿄 **도시 사람**의 세계 그림 · 일상컷 · 자유 설계 지시문은 글자 하나 안 바뀐다(Task 1 이 떠 둔 묶음과 비교). 랜드마크 기록 · 계획이 없으면 계획기는 같은 씨앗에 같은 계획.
- 랜드마크 카드: 세 세계 다, 세계마다 세계 그림 1 + 일상컷 10(필수 다섯 · 보통 셋 · 자유 둘), **90번 캐릭터만의 컷 없음**.
- 판타지 · 스팀펑크 글에 그 세계 `banned_en` 없음(송신탑 · 타워류는 봉화 · 전신탑으로), 사이버펑크에 비를 박지 않는다.
- 화면 글은 `lib/words.js` 에만(검사 `tests/words.cjs`), 바꾼 화면 파일은 `?v=` 올림, 맨 위 `docs/PATCH.md` 칸, 검사는 바꾼 만큼(CLAUDE.md).
- 사용자 말은 한국어 반말, push 는 사용자가 「올려줘」 할 때만.

## Review Focus

- 열쇠의 `-` 가 이름 · 정규식에서 깨지지 않는다(`worldOfPic` · 등록기 이름 가르기 · 잠금 열쇠 가르기) — Task 3 · Task 6 검사.
- 랜드마크가 없는 도시(도쿄 · 설계 전 아홉)는 무대에 랜드마크 줄이 없고 검사기 통과 — Task 2 · Task 6 검사.
- 서울 도시 사람 지시문 그대로 — Task 1 이 떠 둔 묶음과 Task 4 · Task 7 끝에 비교.
- 등록부에 없는 랜드마크 그림 주소는 도시 무대로 — Task 6 검사.
- 잠금 차례: 도시 세 세계가 그 도시 랜드마크보다 먼저 — Task 3 검사.

---

### Task 1: 해치 설계안 — 사용자 검토 관문 (사람이 끝낸다)

**Files:**
- Modify: `data/city-design.json`(서울 줄에 `landmarks: [해치]`)

**Interfaces:**
- Produces: `cities[seoul].landmarks[0]` = `{ key: 'haechi', ko: '해치', en: 'Haechi', src: <설계표 symbols 의 해치 주소>, persona: '…', worlds: { fantasy, steampunk, cyberpunk } }` — 각 세계는 도시 사람 worlds 와 같은 꼴(ko · en · scenes 셋 · look{face,silhouette,why} · hold · motif · card_ko, 필요하면 palette · own_vocab).

- [ ] **Step 1:** 바꾸기 전 서울 · 도쿄 도시 사람 지시문 묶음을 떠 둔다 — `tools/casual-plan.cjs <도시> --world all --fresh --seed 7 --usage none --cosplay-usage none --out $B/plan-<도시>` → `tools/prompt-pack.cjs init <도시> --dir $B/pack-<도시> --plan …` → `build`. `$B` 를 계획 끝까지 둔다.
- [ ] **Step 2:** 해치 세 세계 설계안(신수의 화신 · 태엽 수호수 · 홀로그램 수호 AI)을 한국어로 짜 사용자에게 보인다 — 세계 글 · 장면 셋 · 얼굴(서울 도시 사람 셋과 같은 세계끼리 얼굴 칸 셋 이상 다르게) · 실루엣 · 소품 · 무늬 · 짧은 말. **사용자 답을 받기 전에 다음 단계로 가지 않는다.**
- [ ] **Step 3:** 검토대로 설계표에 넣는다(설계표의 손으로 맞춘 줄 꼴을 지킨다 — 통째로 다시 쓰지 않는다).
- [ ] **Step 4:** `python -I -X utf8 tests/city-design.py` · `python -I -X utf8 tools/city-design.py` — 지금 검사기는 `landmarks` 를 모르니 통과해야 한다(Task 2 가 검사를 더한다).
- [ ] **Step 5:** 커밋.

### Task 2: 조립기 — 랜드마크 카드 풀기 · 검사기

**Files:**
- Modify: `lib/prompt-city.js`(card · cards · worldsOf · 머리 줄), `lib/prompt-spec.js`(`CONCEPT_LANDMARK`), `tools/city-design.py`
- Test: `tests/prompt-city.cjs`, `tests/city-design.py`

**Interfaces:**
- Produces (`window.AtelierPrompt` / `PromptCity`):
  - `card(D, key)` — `key` 가 `<도시>-<랜드마크>` 면 `{ key, tier: 'landmark', parent: '<도시>', landmark: '<랜드마크>', city: <행>, ko, en, people }`, `<행>` = 부모 도시 행 위에 랜드마크 칸(ko · en · persona · worlds · card_ko)을 덮고 `key` · `parent` · `landmark` 를 단 새 객체. 도시 열쇠면 지금과 같다(`tier: 'city'`).
  - `cards(D)` — 설계표 차례로 도시 열쇠, 그 바로 뒤에 그 도시 랜드마크 열쇠들: `['seoul','seoul-haechi','tokyo',…]`.
  - `landmarksOf(D, cityKey)` → `[{ key: 'seoul-haechi', ko, en }]`(없으면 `[]`), `parentOf(key)` → `'seoul'`.
  - `worldsOf(D, key)` 가 랜드마크 열쇠도 받는다.
- 세계 그림 머리 줄: 랜드마크면 `T.CONCEPT_LANDMARK` — `'CONCEPT: the personification of {landmark_en}, a landmark of the city of {city_en} — one woman who IS {landmark_en} as it stands in this world. …'`(뒤 문장은 지금 `CONCEPT` 그대로). 일상컷 줄은 그대로(「an ordinary day in {city_en}」 · 그 나라 사람).

- [ ] **Step 1: 실패하는 검사** — `tests/prompt-city.cjs` 에:
```js
const LK = P.card(D, 'seoul-haechi');
assert(LK && LK.tier === 'landmark' && LK.parent === 'seoul' && LK.people === 'Korean', '랜드마크 카드');
assert.deepEqual(P.cards(D).slice(0, 2), ['seoul', 'seoul-haechi'], '도시 바로 뒤에 그 랜드마크');
assert.deepEqual(P.worldsOf(D, 'seoul-haechi'), ['fantasy', 'steampunk', 'cyberpunk']);
assert.deepEqual(P.landmarksOf(D, 'tokyo'), [], '랜드마크 없는 도시');
for (const w of WORLDS) { const t = P.build({ design: D, styles: S, city: 'seoul-haechi', world: w, style, kind: 'world' }).text;
  assert(/personification of Haechi, a landmark of the city of Seoul/.test(t) && !/\bhaechi_/.test(t), w + ' 랜드마크 머리 줄'); }
```
- [ ] **Step 2:** `node tests/prompt-city.cjs` → FAIL(`card` 가 null).
- [ ] **Step 3:** 위 함수들을 `lib/prompt-city.js` 에, `CONCEPT_LANDMARK` 를 `lib/prompt-spec.js` 에. 행 찾기는 한 함수(`row(D, key)`)로 모은다 — `city(D, key)` 를 부르던 곳(worldsOf · card)이 그것을 쓴다.
- [ ] **Step 4:** `tools/city-design.py` — `landmarks` 는 고를 수 있는 칸. 있으면 랜드마크마다 key(소문자 · `_` `-` 없음 · 도시 안에서 겹침 없음) · ko · en · src(주소) · persona · worlds 를 도시 worlds 와 같은 검사로(세 세계 다 · 금지 낱말 · 짧은 말 · 세 세계 얼굴 다름). 그리고 **같은 도시 · 같은 세계** 사람끼리(도시 사람 + 랜드마크 전부) 얼굴 칸이 `FACE_DIFF_MIN`(3) 개 이상 다르지 않으면 오류. `tests/city-design.py` 의 「망가뜨린 경우」 에 넷: 랜드마크 열쇠에 `-` · 세계 둘뿐 · 판타지 글에 「broadcast tower」 · 해치 판타지 얼굴을 서울 판타지와 같게.
- [ ] **Step 5:** `node tests/prompt-city.cjs` · `python -I -X utf8 tests/city-design.py` → PASS. Task 1 Step 1 묶음을 다시 짓고(`build`) 서울 · 도쿄 지시문 파일이 글자 하나 다르지 않음을 `cmp` 로 본다.
- [ ] **Step 6:** 커밋.

### Task 3: 등록 · 잠금

**Files:**
- Modify: `tools/register-images.py`, `tools/image-claim.cjs`
- Test: `tests/register-images.py`, `tests/image-claim.cjs`

**Interfaces:**
- Consumes: `P.cards(D)` · `P.worldsOf(D, key)`(Task 2).
- Produces: 등록부 `img['seoul-haechi'].byStyle.<화풍>.byForm.<세계>.{f, casual.f}` — 도시와 같은 꼴. 잠금 차례 `order()` = `cards(D)` × 그 카드의 세계(설계 미정 카드 없음). `missing('seoul-haechi_fantasy')` = 세계 그림 1 + 일상 10(90 없음 — 지금처럼 안 센다).

- [ ] **Step 1: 실패하는 검사** — `tests/register-images.py`: 가짜 그림 자리에 `seoul-haechi_fantasy_<기본 화풍>_f.webp` · `…_f_casual1.webp` 를 두면 `img['seoul-haechi']` 에 들어가고, `seoul-nope_fantasy_…` 는 「그런 도시가 없다」 로 남는다. `tests/image-claim.cjs`:
```js
assert.deepEqual(K.order().map(x => x.key).slice(0, 6), ['seoul_fantasy','seoul_steampunk','seoul_cyberpunk','seoul-haechi_fantasy','seoul-haechi_steampunk','seoul-haechi_cyberpunk'], '도시 세 세계 다음 그 랜드마크');
assert.equal(K.missing('seoul-haechi_fantasy').length, 11, '랜드마크 한 세계 = 세계 그림 1 + 일상 10');
assert(K.missing('seoul-haechi_fantasy').every(f => f.startsWith('seoul-haechi_fantasy_')));
```
- [ ] **Step 2:** 두 검사 → FAIL.
- [ ] **Step 3:** 등록기의 알려진 열쇠를 `cards` 꼴(도시 + `<도시>-<랜드마크>`)로 — 설계표를 읽어 만든다(조립기를 부르지 않는 파이썬이라 같은 규칙을 그대로). 잠금 도구는 `order()` 를 `P.cards` 로, `missing` 의 열쇠 가르기는 **마지막** 세계 열쇠 앞의 `_` 가 아니라 첫 `_`(카드 열쇠엔 `_` 가 없다 — Global Constraints)로 그대로 두고 카드를 `row` 로 찾는다. `title` 은 `서울 해치 판타지` 꼴.
- [ ] **Step 4:** 두 검사 → PASS(도쿄 · 서울 기존 단언 포함).
- [ ] **Step 5:** 커밋.

### Task 4: 계획기 · 지시문 묶음

**Files:**
- Modify: `tools/casual-plan.cjs`, `tools/prompt-pack.cjs`(필요한 곳만)
- Test: `tests/casual-plan.cjs`, `tests/prompt-pack-screen.cjs`

**Interfaces:**
- Consumes: `P.card` · `P.parentOf`(Task 2).
- Produces: `cardOf('seoul-haechi')` — `lifePlaces` · 계절 · 날씨 · 생활 장면 필수 칸은 **부모 도시**(`parentOf`) 것. `ownRow(card, w)` 는 랜드마크면 `null`(90번 없음). `sceneUsage(dir, skip)` 는 그 도시 카드 전부(`<도시>` · `<도시>-*` 기록 폴더)의 그린 기록 + 아직 안 그린 계획 파일(`<세계>-casual-plan.json`)의 장면을 센다.

- [ ] **Step 1: 실패하는 검사** — `tests/casual-plan.cjs` 에 해치 블록:
```js
const HC = C.cardOf('seoul-haechi');
for (const w of HC.worlds) { const res = C.plan(HC, TEN, [], { seed: 7 + HC.worlds.indexOf(w) });
  assert.equal(res.cuts.length, 10, w + ' 해치 열 장');
  assert(res.cuts.filter(c => c.lifeMust).every(c => C.lifeOf(c.place).city === 'seoul'), w + ' 생활 장면은 서울 것');
  assert.equal(C.ownRow(HC, w), null, w + ' 90번 없음'); }
```
그리고 「덜 쓴 장면」: 임시 기록 폴더 `seoul/fantasy-casual1…` 에 서울 장면 하나(`seoul_noraebang`)를 둔 뒤, 해치 판타지 계획이 그 장면을 무게상 뒤로 미는지(같은 씨앗, 기록 없을 때보다 그 장면을 고른 칸 수가 늘지 않음).
- [ ] **Step 2:** → FAIL.
- [ ] **Step 3:** 위 Interfaces 대로. 기록 · 계획이 없으면 무게가 지금과 같아야 한다(서울 도시 사람 기존 단언 그대로 통과).
- [ ] **Step 4:** `node tests/casual-plan.cjs` → PASS. `tools/prompt-pack.cjs init seoul-haechi --dir … --plan …` → `build` 가 30 + 세계 그림 3(+ 자유 3) 자리를 짓고 90번 자리가 없다. `node tests/prompt-pack-screen.cjs` → PASS. Task 1 묶음과 서울 · 도쿄 지시문 비교 — 같음.
- [ ] **Step 5:** 커밋.

### Task 5: 생성기(prompt.html) — 카드 고르개

**Files:**
- Modify: `lib/studio.js`, `lib/words.js`, `prompt.html`(`?v=`)
- Test: `tests/screen.cjs`

**Interfaces:**
- Consumes: `P.cards` · `P.landmarksOf` · `P.card`(Task 2).
- Produces: 카드 고르개(첫 칸 「도시」)에 도시마다 그 아래 랜드마크(들여 쓴 줄 · 「서울 › 해치」 꼴), `?card=seoul-haechi` 주소가 그대로 열린다.

- [ ] **Step 1: 실패하는 검사** — `tests/screen.cjs`: `/prompt.html?card=seoul-haechi&o=world&world=fantasy` 를 열면 화면 지시문 = `P.build(… city: 'seoul-haechi' …)` 글자 그대로, 고르개에 `seoul-haechi` 칸이 서울 바로 아래.
- [ ] **Step 2:** → FAIL.
- [ ] **Step 3:** 고르개 목록을 `P.cards(D)` 로, 랜드마크 칸 글은 낱말 표(`studio.card.landmark` = `'{city} › {name}'`).
- [ ] **Step 4:** `node tests/screen.cjs` · `node tests/words.cjs` → PASS.
- [ ] **Step 5:** 커밋.

### Task 6: 도시 무대 · 한 장 · 전체 도감

**Files:**
- Modify: `lib/city-view.js`, `lib/dex-view.js`, `index.html`, `lib/room.css`, `lib/words.js`(+ `?v=`)
- Test: `tests/globe-screen.cjs`, `tests/dex-screen.cjs`

**Interfaces:**
- Consumes: `P.landmarksOf` · `P.card`(Task 2), 지금의 `picsOf` · `known` · `CardView`.
- Produces: 무대 랜드마크 줄 `.th-marks` > `.th-mark[data-card="seoul-haechi"]`(이름 · 세 세계 작은 그림 또는 빈 자리, 누르면 그 카드 한 장 — 그림이 없으면 누를 수 없다). 한 장 주소 `?city=seoul&card=seoul-haechi&pic=<파일>` — 한 장 층은 `route.card` 를 카드 열쇠로 쓴다(`known(img, route.card, pic)`, `CardView({ … city: route.card … })`), 돌아가기는 `route.city` 무대. `worldOfPic` 정규식은 카드 열쇠를 escape 한다. 도감 도시 줄 일상컷 수에 그 도시 랜드마크 일상컷을 더한다.

- [ ] **Step 1: 실패하는 검사** — `tests/globe-screen.cjs` 「그림이 있으면」 판의 가짜 등록부에 `seoul-haechi` 판타지 세계 그림 + 일상 둘을 더해: 서울 무대에 `.th-mark[data-card="seoul-haechi"]` 하나, 그 판의 그림을 누르면 주소 `card=seoul-haechi&pic=seoul-haechi_fantasy_s1_f.webp`, 한 장의 그림 줄이 「세계 · 1 · 2」, 돌아가기 → 서울 무대. 도쿄 무대(`?city=tokyo`)엔 `.th-marks` 가 없다. 등록부에 없는 `pic=seoul-haechi_fantasy_zz_f.webp` → 무대. `tests/dex-screen.cjs`: 가짜 등록부에 해치 일상 둘을 더하면 서울 줄 일상컷 수가 그만큼 는다. 44px · 넘침 · 대비 단언은 기존 판과 같게.
- [ ] **Step 2:** → FAIL.
- [ ] **Step 3:** 위 Interfaces 대로, 344×882 폰 화면에서 랜드마크 줄은 가로로 넘기는 판(넘침 없음).
- [ ] **Step 4:** 두 검사 → PASS, `node tests/words.cjs` PASS. 화면 사진(`SHOT_DIR`)으로 무대 · 한 장을 눈으로 본다.
- [ ] **Step 5:** 커밋.

### Task 7: 문서 · 전체 검사 · 서울 그대로 확인

**Files:**
- Modify: `IMAGE_RULES.md`, `docs/IMAGE_AUTOMATION.md`, `AGENTS.md`, `docs/PATCH.md`

- [ ] **Step 1:** 문서에 랜드마크 카드(이름 꼴 · 차례 · 90번 없음 · 생활 장면은 부모 도시 · 세 세계)를 적는다 — 잠금 · 빈 자리 · 그림 이름 대목. `docs/PATCH.md` 맨 위 칸(사용자 인용: 「랜드마크같은게 좋지 않을까?」 · 「10장으로 해줘」 · 「사는 세계를 다 할까 그럼」 · 「해치 먼저」).
- [ ] **Step 2:** 전체 검사 `for t in tests/*.cjs; do …; done` 와 `tests/*.py` — 전부터 실패하던 `tests/prompt-sections.cjs`(서울 판타지 낱말 979) 말고 PASS. Task 1 묶음과 서울 · 도쿄 지시문 마지막 비교.
- [ ] **Step 3:** 커밋. push 는 사용자에게 묻는다.

### Task 8: 나머지 랜드마크 넷 — 사용자 검토 관문 (사람이 끝낸다)

- [ ] **Step 1:** 경복궁 · 남산 송신탑 · 한강철교 · 한양도성 × 세 세계(설계 문서 4-2절 표) 설계안을 해치 검토에서 나온 방향대로 짜 사용자에게 보인다. 답을 받기 전에 설계표에 넣지 않는다.
- [ ] **Step 2:** 설계표에 넣고 `tests/city-design.py` · `tools/city-design.py` · `tests/prompt-city.cjs` · `tests/casual-plan.cjs` · `tests/image-claim.cjs` PASS, PATCH 칸, 커밋.
