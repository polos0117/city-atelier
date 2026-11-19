# 도시 공방(city-atelier) 틀 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 원소 공방을 복제해, 실제 도시 10곳을 세 세계(판타지 · 스팀펑크 · 사이버펑크)의 여성 셋으로 의인화하는 도감 공방의 틀을 세운다 — 서울 하나를 끝까지 채운 본보기, Blender 지구본(three.js) 첫 화면, 전체 도감 탭.

**Architecture:** 정적 GitHub Pages 공방(원소 공방과 같은 Preact · esm.sh · JSON 표 · 손으로 올리는 `?v=`). 설계표 `data/city-design.json` 한 층(도시), 세계 사전에 세계 표지, 지시문 조립 `lib/prompt-city.js`, 일상컷은 공용 트리 v2 + 이 공방의 장소 · 시대 표(생활 장면표 · 세계 소품 사전). 첫 화면은 Blender 가 만든 세계별 지구본 glb 를 three.js 로 돌리고 위도 · 경도 핀을 꽂는다.

**Tech Stack:** HTML/CSS/JS(Preact via esm.sh), three.js(esm, 판 고정) + GLTFLoader, Blender(이 PC 의 Blender MCP 또는 blender-cloud), Python 3(도구 · 검사), Node 22(`fnm exec --using=22 node`), playwright(화면 검사).

**Spec:** `docs/superpowers/specs/2026-11-19-city-atelier-design.md` — 실행하는 쪽은 둘 다 읽는다.

## Global Constraints

- 사람은 모두 여성(파일 이름 `_f`, 지시문 her/she — 원소 그대로).
- 세계 열쇠는 정확히 `fantasy` · `steampunk` · `cyberpunk`(원소의 `mecha` 없음).
- 세계 느낌: 판타지 = 웅장 · 화려 / 스팀펑크 = 증기 · 그을음 · 땀 / 사이버펑크 = 네온 — 장르 이름이 아니라 **표지**를 사람에게(옷 · 몸 · 소품 · 빛) 싣는다. 주인공은 사람, 배경은 거든다.
- 한 도시 = 세계마다 **다른 사람**(얼굴 · 머리색 · 체형 · 실루엣 모두 세계별). 도시 `palette` 는 상징 색 — 지도 · 도감 색과 세 사람의 강조색 하나.
- 첫 묶음 10곳: `seoul` 서울 · `tokyo` 도쿄 · `beijing` 베이징 · `paris` 파리 · `london` 런던 · `rome` 로마 · `newyork` 뉴욕 · `istanbul` 이스탄불 · `cairo` 카이로 · `rio` 리우데자네이루. 끝까지 채우는 것은 서울 하나.
- 사실은 지어내지 않는다 — 상징 · 위도경도 · 생활 장면마다 `src`(주소). 상표 · 실존 인물 이름은 지시문에 쓰지 않는다.
- 일상컷은 세 세계마다 **그 세계의 그 도시의 하루** — 판타지 · 스팀펑크 일상컷에 지금 도구(스마트폰 · 플라스틱 · 전광판)가 나오지 않는다.
- 화면에 한국어 글자를 박지 않는다(`lib/words.js` · `tests/words.cjs`). 고치면 `docs/PATCH.md` 맨 위 한 칸. 공용 링크 `?v=` 손으로.
- 폴드 덮개 344×882 터치 먼저 — 누르는 자리 44px, 가로 넘침 0, 콘솔 오류 0.
- 공용 모듈(`lib/casual-tree.js` · `lib/casual-tree-v2.js` · `lib/favorites.js`)은 글자 하나 바꾸지 않는다.
- 그림 · 모형은 이 저장소에 두지 않는다 — 그림 저장소 `city-atelier-img`(GitHub 저장소 만들기 · push 는 사용자에게 묻고 「올려줘」 뒤에).
- 화풍 기본은 **미정**(서울 설계 뒤 Task 11 에서 사용자가 고른다). 시험 그림 · 시안은 보여 주고 고른 뒤에만 쓴다.
- 이 PC: Git Bash 에서 한글 heredoc 금지(파이썬 파일 · Write 도구로), 파이썬 `-I -X utf8`, playwright `NODE_PATH=/c/Users/jjshs/atelier/node_modules`, `CHROMIUM_PATH` 는 환경에, OpenAI 키는 `powershell.exe -NoProfile -Command "[Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User')"` 로 읽고 절대 출력하지 않는다.
- 사용자에게 하는 말은 한국어 반말. 검사는 바꾼 만큼만.

## Review Focus

1. **WebGL 이 없거나 glb 가 늦거나 실패할 때** — 첫 화면이 빈 화면이 되지 않고 같은 모형의 정지 그림 + 누를 수 있는 도시 표지가 나온다. → Task 8 검사(`webgl` 끈 브라우저 · glb 404).
2. **지구본 뒷면의 핀** — 지구 뒤에 숨은 도시는 보이지도 눌리지도 않는다(앞면만). 날짜변경선 근처(서울 · 도쿄 · 리우가 한 화면에 섞일 때) 위치가 튀지 않는다. → Task 8 `latLonToVec3` · 앞면 판정 검사.
3. **세계를 바꾸는 중 끌기 · 두 번 누르기** — 모형 바꿈 중에 돌리거나 핀을 눌러도 오류 · 엉뚱한 도시로 가지 않는다. → Task 8 화면 검사.
4. **그림이 하나도 없는 도시**(9곳) — 도감 · 도시 화면이 빈 칸을 「그림 없음」 표지로 채우고 생성기로 가는 길을 준다. → Task 9 검사.
5. **판타지 · 스팀펑크 일상컷 지시문에 지금 물건이 새는 것** — 장면 · 소품 조립 결과에 금지 낱말(smartphone · plastic · LED screen 등)이 없다. → Task 4 검사.

---

### Task 1: 저장소 뼈대 — 원소 복제 · 원소 전용 걷어내기

**Files:**
- Create: `C:\Users\jjshs\city-atelier\` 아래 원소 공방 사본(`git init`, 원격 없음 — 원격은 Task 10)
- Remove(사본에서): `alchemy.html` · `lib/alchemy.js` · `hall.html` · `gallery.html`(원소 전용이면) · `lib/walk-orbit.js` · `lib/walk-table.js` · `lib/walk-family.js` · 원소 입자 · 주기율표 관련 · `tools/seed-elements.py` · `tools/roster.py` · 그 검사들(`tests/walk-orbit|table|family|particles.cjs`, `tests/alchemy.cjs`) · `data/element-design.json` · `data/img.json` 내용(빈 꼴로)
- Rename: `tools/element-design.py` → `tools/city-design.py`, `tests/element-design.py` → `tests/city-design.py`, `lib/prompt-element.js` → `lib/prompt-city.js`, `tests/prompt-element.cjs` → `tests/prompt-city.cjs`, `lib/element.css` → `lib/city.css`
- Modify: `AGENTS.md` · `CLAUDE.md` · `README.md` · `IMAGE_RULES.md`(도시 · 세 세계 · 여성 · 그림 저장소 `city-atelier-img`) · `DESIGN.md`(빈 틀 — Task 7 에서 채운다) · `docs/PATCH.md`(새로, 첫 칸) · `docs/PORT_NOTES.md`(무엇을 원소에서 가져왔고 뺐는지) · 스펙 · 이 계획을 `docs/superpowers/` 로
- Test: `tests/words.cjs` · `tests/patch.cjs` · `tests/favorites.cjs` · `tests/casual-tree-v2.cjs`(공용 모듈이 원소와 글자 하나 다르지 않은지 — sha256 비교 줄을 더한다)

**Interfaces:**
- Produces: 저장소 자리 `C:\Users\jjshs\city-atelier`, 이름 바꾼 파일들(아래 Task 들이 그 이름을 쓴다), 빈 `index.html` 껍데기(Task 8 이 채운다).

- [ ] **Step 1:** 원소 공방 `main` 을 `git archive` 로 풀어 `city-atelier` 에 놓고 `git init`(스펙 파일은 이미 있다 — 덮어쓰지 않는다).
- [ ] **Step 2:** 위 Remove · Rename 을 하고, 남은 코드에서 지운 모듈을 부르는 곳을 걷어 낸다(`grep -rn "walk-orbit\|alchemy\|element-design\|prompt-element"` 가 0).
- [ ] **Step 3:** 공용 모듈 동일성 검사 줄 추가 — `tests/casual-tree-v2.cjs` 에 `sha256(city lib/casual-tree-v2.js) === sha256(element-atelier lib/casual-tree-v2.js)`(원소 저장소가 옆에 없으면 건너뛰고 알린다).
- [ ] **Step 4:** 문서 고치기(위 Modify). `AGENTS.md` 에 원소 1-1-1 을 옮긴 「새 도시를 설계하면 그 자리에서 캐릭터만의 컷 직업도(`per_world`)」 규칙.
- [ ] **Step 5:** `node tests/words.cjs` · `node tests/patch.cjs` · `node tests/favorites.cjs` · `node tests/casual-tree-v2.cjs` 통과.
- [ ] **Step 6:** 커밋 「도시 공방 뼈대 — 원소 공방에서 복제, 원소 전용 걷어냄」.

### Task 2: 설계표 `data/city-design.json` 과 검사기

**Files:**
- Create: `data/city-design.json`
- Modify: `tools/city-design.py`(check), `tests/city-design.py`
- Test: `python -I -X utf8 tools/city-design.py check` · `python -I -X utf8 tests/city-design.py`

**Interfaces:**
- Produces(꼴 — 다음 Task 들이 읽는다):
  - `vocab.worlds = ["fantasy","steampunk","cyberpunk"]`, `vocab.world_ko`, `vocab.markers.<world> = { ko: [...], en: [...], banned_en: [...] }`(세계 표지 · 금지 낱말 — 판타지 · 스팀펑크의 `banned_en` 에 `smartphone`, `plastic`, `LED screen`, `neon sign` …), `vocab.wear.<world>`(옷 말투 — 원소 것을 세계에 맞게).
  - `cities[] = { key, ko, en, country, lat, lon, latlon_src, persona, palette: { en, hex: [..] }, symbols: [ { ko, en, src } ], worlds: { <world>: { ko, en, scenes: [ {key, ko, en} ×3 ], look: { face, silhouette, why }, hold: { en }, motif: { ko, en } } } }` — `worlds` 는 서울만 채우고 나머지 아홉은 `worlds: {}`(설계 미정 표시).
  - `look` 어휘는 `lib/look-spec.js` 그대로(세 세계가 서로 다른 값이어야 한다).

- [ ] **Step 1: 검사기 규칙 검사 먼저** — `tests/city-design.py` 에 실패하는 경우마다 하나씩: 세계 열쇠가 셋이 아님 · `lat` 범위 밖 · `src` 빈 상징 · 서울 세 세계 `look.silhouette.hair_color` 가 둘 이상 같음 · 서울 세계에 `scenes` 셋 아님 · `motif` 없음 · 열쇠 10개가 Global Constraints 의 목록과 다름.
- [ ] **Step 2:** 돌려서 실패 확인.
- [ ] **Step 3:** `tools/city-design.py check` 구현(원소 검사기 꼴에서 나라 › 가문 › 주민을 도시 한 층으로).
- [ ] **Step 4:** 데이터 채우기 — 10곳의 `ko · en · country · lat · lon · latlon_src · persona · palette · symbols(3~5개, 각 src)` 를 웹에서 확인해 적고, **서울 세 세계를 끝까지**(세계마다 다른 사람, 표지가 사람에게 실리는 `motif` — 예: 판타지 단청 문양 금실 망토, 스팀펑크 그을린 한강 철교 리벳 코르셋, 사이버펑크 네온 남산 송신탑 귀걸이). 상징은 사실만.
- [ ] **Step 5:** 검사 둘 통과.
- [ ] **Step 6:** 커밋.

### Task 3: 지시문 조립 `lib/prompt-city.js`

**Files:**
- Modify: `lib/prompt-city.js`, `lib/prompt-spec.js`(세계 · 칸 이름), `data/style.json`(판 꼴은 그대로, `default` 위에 `"undecided": true` 와 note — Task 11 에서 푼다)
- Test: `tests/prompt-city.cjs`, `tests/prompt-sections.cjs`

**Interfaces:**
- Consumes: Task 2 의 `cities[]` · `vocab.markers` · `vocab.wear`.
- Produces: `PromptCity.build({ city, world, style, kind: 'world' | 'casual', casual? }) → { text, sections }` — `sections` 열쇠는 원소 조립기와 같은 이름(생성기 판이 그대로 읽는다).

- [ ] **Step 1: 실패하는 검사** — `tests/prompt-city.cjs`: 서울 × 세 세계 `kind:'world'` 의 `text` 에 (a) 그 세계 `markers.en` 가운데 셋 이상, (b) 서울 `motif.en`, (c) `look` 의 머리색 낱말이 들어 있다; (d) 그 세계 `banned_en` 낱말이 없다; (e) 상표 · 사람 이름 목록(검사 안의 작은 표)이 없다; (f) `world` 가 `mecha` 면 던진다; (g) 설계 미정 도시(`worlds:{}`)는 던지지 않고 `{ text:'', missing:['worlds'] }`.
- [ ] **Step 2:** 실패 확인.
- [ ] **Step 3:** 원소 조립기의 「원소 성질 = 시각 언어 한 줄」 자리를 「도시 motif + 세계 표지」 로 바꿔 구현. 구도 기본은 원소 그대로(사람이 주인공).
- [ ] **Step 4:** 두 검사 통과. 서울 세 세계 지시문을 뽑아 `docs/samples/seoul-world-prompts.md` 에 둔다(사람이 읽어 보게).
- [ ] **Step 5:** 커밋.

### Task 4: 일상컷 — 생활 장면표 · 세계 소품 사전 · 직업

**Files:**
- Create: `data/city-life.json`(생활 장면표), `data/world-props.json`(세계 소품 사전)
- Modify: `data/casual-tree.json`(버전1 몫 — 시대 · 장소 · 의상을 이 공방 것으로: 원소 `site_*` · `nation_*` · 원소 분류 갈래 삭제), `data/casual-own.json`(서울 `per_world` 직업 셋), `tools/casual-tree.py`, `tools/casual-plan.cjs`, `lib/prompt-city.js`(casual 갈래)
- Test: `python -I -X utf8 tools/casual-tree.py check` · `node tests/casual-tree.cjs` · `node tests/casual-plan.cjs` · `node tests/prompt-city.cjs`

**Interfaces:**
- Consumes: Task 3 `PromptCity.build`.
- Produces:
  - `city-life.json`: `{ cities: { seoul: { scenes: [ { key, ko, src, worlds: { <world>: { en, props: [prop key…] } } } ] } }, times: [...], seasons: { seoul: [...] }, weather: { seoul: [...] } }` — 서울 장면 10개 안팎.
  - `world-props.json`: `{ props: { <prop key>: { ko, worlds: { fantasy: {en}, steampunk: {en}, cyberpunk: {en} } } } }` — 휴대폰 · 컵 · 가방 · 우산 · 조명 · 탈것 · 간판 · 음식 그릇 · 돈 · 책 등 15개 이상.
  - `casual-plan.cjs <도시> --world all` 이 세계마다 일곱 장을 짜되 장면은 `city-life` 에서, 소품은 `world-props` 의 그 세계 낱말로.

- [ ] **Step 1: 실패하는 검사** — `tests/prompt-city.cjs` 에: 서울 × 세 세계 × 장면 전부 casual 지시문에 그 장면의 그 세계 `en` 이 있고, 판타지 · 스팀펑크에는 `banned_en` 이 없으며, 소품 낱말이 그 세계 것이다(예: `phone` 열쇠 → 판타지 문장에 `smartphone` 없음 · `messenger crystal` 류 있음). `tests/casual-plan.cjs`: 서울 세 세계 × 씨앗 3 — 일곱 장, 같은 장면 · 같은 자세 겹침 0, 시간 · 계절 · 날씨 칸이 서울 표 안에서.
- [ ] **Step 2:** 실패 확인.
- [ ] **Step 3:** 표 둘을 채운다(장면은 서울에 실제로 있는 생활만, 각 `src`). 버전1 표를 이 공방 것으로 다시 짜고 계획기 · 조립기 연결. 서울 직업 셋(`per_world` — 상징 · 별명 · 명물에서, 동물 · 상표 · 실존 인물 피함, 세 세계 자세 서로 다르게).
- [ ] **Step 4:** 위 검사 넷 통과. `docs/samples/seoul-casual-prompts.md` 에 세계마다 두 장씩 뽑아 둔다.
- [ ] **Step 5:** 커밋.

### Task 5: 그림 길 — 등록 · 잠금 · 그림 저장소 자리

**Files:**
- Modify: `lib/img.js`(BASES → `https://polos0117.github.io/city-atelier-img/img/` 하나), `tools/register-images.py` · `tools/image-claim.cjs` · `tools/make-thumbs.py`(카드 열쇠 꼴 = 도시 열쇠, 파일 이름 `<city>_<world>_f_<n>.webp` — 원소 꼴에서 나라 › 가문 › 주민 자리를 도시 하나로), `.github/workflows/*`(있으면), `IMAGE_RULES.md`
- Test: `python -I -X utf8 tests/register-images.py` · `node tests/image-claim.cjs` · `node tests/img-shards.cjs` · `python -I -X utf8 tests/make-thumbs.py`

**Interfaces:**
- Produces: `IMG.imgURL(file)` · `IMG.thumbURL(file)` · 등록부 `data/img.json` 꼴(원소와 같은 꼴, 열쇠만 도시) — Task 8 · 9 가 쓴다.

- [ ] **Step 1:** 네 검사의 기대값을 도시 꼴로 먼저 고친다(서울 세계 그림 · 일상컷 이름 몇 개, 틀린 이름은 저장 안 함).
- [ ] **Step 2:** 실패 확인 → 도구 고치기 → 통과.
- [ ] **Step 3:** 커밋. (GitHub 의 `city-atelier-img` 는 아직 만들지 않는다 — Task 10.)

### Task 6: 지구본 모형 셋 — Blender (사용자가 고르는 관문)

**Files:**
- Create: blender-cloud 저장소 `scenes/city_globe.py`(세계 인자 하나로 모형을 짓는 스크립트), 결과 `out/city-globe/<world>.glb` · `<world>-still.webp`(정면 렌더, 1024×1024) — 그림 저장소에 올릴 것은 Task 10 에서
- Test: `tests/globe-assets.cjs`(이 저장소 — 파일이 있으면 크기 · 노드 이름 검사)

**Interfaces:**
- Produces: glb 마다 노드 `Globe`(구 — 반지름 1, 중심 원점, 경도 0 이 +Z, 북극 +Y, 텍스처 정방형 도법) · `Stand`(받침 · 장식 — 돌지 않는다). 파일 하나 ≤ **1.5MB**(Draco 압축 쓰면 three.js DRACOLoader 도 Task 8 에). 세계별 생김새: 판타지 금장식 받침 + 양피지 바다 천구의 / 스팀펑크 톱니 · 놋쇠 고리 · 그을린 기계 지구본 / 사이버펑크 네온 선 홀로그램 구(받침은 빛나는 고리).

- [ ] **Step 1: 실패하는 검사** — `tests/globe-assets.cjs`: 세 glb 가 있고 각 ≤ 1.5MB, 노드 `Globe` · `Stand` 가 있고 `Globe` 의 bounding sphere 반지름이 1±0.02.
- [ ] **Step 2:** `city_globe.py` 를 짓고 세 세계를 뽑는다(이 PC Blender MCP 또는 blender-cloud — blender-cloud 메모 「headless Blender in cloud sessions」).
- [ ] **Step 3: 관문** — 세 정지 렌더를 사용자에게 보내고 고르기를 기다린다(다시 그리기 요청이면 2 로). **승인 전에는 Task 8 을 시작하지 않는다.**
- [ ] **Step 4:** 검사 통과, blender-cloud 쪽 스크립트 커밋(push 는 사용자에게 묻는다), 이 저장소에 `docs/GLOBE.md`(좌표 약속 · 다시 뽑는 법).

### Task 7: 화면 시안 — 지구본 탭 · 도시 화면 · 전체 도감 탭 (사용자가 고르는 관문)

**Files:**
- Create: 스크래치 시안 HTML/PNG(저장소 밖), `DESIGN.md`(고른 뒤 이 공방의 뼈대 — 탭 둘 · 세계 고르개 · 도구 상자 · 공간 여섯 · 겉모습)
- Modify: `lib/workspace-theme.js` · `lib/room.css`(공간 = 세계 셋 × 밝은 · 어두운; 공간은 세계를 따라 저절로, 밝기는 도구 상자 설정)

**Interfaces:**
- Produces: `DESIGN.md` 의 선택자 · 층 이름 약속 — `?tab=globe|dex`, `?w=<world>`, `?city=<key>`, `?card=` · `?pic=`(원소 walk-core 주소 꼴을 따른다), `html[data-world][data-tone]`.

- [ ] **Step 1:** 폴드 덮개 344×882 시안 두 갈래(지구본 탭 + 도시 화면 + 도감 탭 한 벌씩)를 만들어 보낸다.
- [ ] **Step 2: 관문** — 사용자가 고르면 `DESIGN.md` 에 적고 공간 여섯을 짓는다. **승인 전에는 Task 8 · 9 를 시작하지 않는다.**
- [ ] **Step 3:** `node tests/walk-theme.cjs`(남겼다면 이름 바꿔 `tests/theme.cjs`)로 공간 여섯 · 세계를 따라 바뀜 검사. 커밋.

### Task 8: 지구본 탭 · 도시 화면

**Files:**
- Create: `lib/globe.js`(three.js 장면 · 끌어 돌리기 · 핀), `lib/globe-math.js`(순수 함수), `lib/city-view.js`(세 사람 나란히 · 한 장)
- Modify: `index.html`(탭 둘 껍데기 — 원소 `walk-core` 의 주소 · 층 꼴 재사용), `lib/words.js`, `lib/city.css`
- Test: `tests/globe-math.cjs`, `tests/globe-screen.cjs`

**Interfaces:**
- Consumes: Task 2 `cities[].lat/lon/palette`, Task 5 `IMG.*`, Task 6 glb · still, Task 7 주소 약속.
- Produces: `GlobeMath.latLonToVec3(lat, lon, r=1) → [x,y,z]`(Task 6 의 좌표 약속: 경도 0 = +Z, 북극 +Y), `GlobeMath.facing(vec, cameraDir) → boolean`(앞면), `GlobeMath.nearestCity(cities, rotation) → key`.
- three.js: `https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js` 와 `.../examples/jsm/loaders/GLTFLoader.js`(판 번호 고정 — 2주 넘은 판).

- [ ] **Step 1: 실패하는 검사** — `tests/globe-math.cjs`: `latLonToVec3(0,0)` ≈ `[0,0,1]`, `(90,0)` ≈ `[0,1,0]`, 서울(37.57,126.98) 과 리우(−22.91,−43.17)가 앞면 판정에서 서로 반대편; 경도 179.9 · −179.9 가 거의 같은 점. `tests/globe-screen.cjs`(344×882 터치): (a) 첫 화면에 정지 그림이 곧바로, 그 뒤 캔버스; (b) 끌면 돌고 서울 핀을 누르면 `?city=seoul` 도시 화면에 세 칸; (c) 세계 고르개로 모형 바뀜 중 끌기 · 핀 두 번 누르기에 오류 0; (d) WebGL 끈 브라우저(`--disable-webgl`)와 glb 404 에서 정지 그림 + 누를 수 있는 도시 목록 표지; (e) 뒷면 핀은 `pointer-events:none`; (f) 누르는 자리 ≥44px, 가로 넘침 0, 콘솔 오류 0.
- [ ] **Step 2:** 실패 확인.
- [ ] **Step 3:** `globe-math.js` → `globe.js`(늦게 불러오기, 정지 그림 먼저) → `city-view.js` 구현. 도시 화면은 세 세계 세 사람 나란히(그림 없으면 「그림 없음」 + 생성기 길), 누르면 한 장.
- [ ] **Step 4:** 검사 둘 통과. 커밋.

### Task 9: 전체 도감 탭

**Files:**
- Modify: `dex.html`(또는 `index.html` 의 `tab=dex` 층 — Task 7 에서 정한 대로), `lib/words.js`, `lib/city.css`
- Test: `tests/screen.cjs`(도감 부분)

**Interfaces:**
- Consumes: Task 2 설계표, Task 5 등록부, 원소의 `lib/fresh.js`(새 그림 · 확인하면 꺼짐).

- [ ] **Step 1: 실패하는 검사** — 도시 10줄, 줄마다 세계 세 칸 + 일상컷 수, 도시 상징 색(`palette.hex[0]`)이 줄 색, 그림 없는 칸은 「그림 없음」 표지와 `prompt.html?card=<city>&world=<world>` 길, 설계 미정 도시(아홉)는 「설계 전」 표지, 새 그림 표시(오늘 · 어제 등록, 열어 보면 꺼짐 — 삼국지 공방 규칙).
- [ ] **Step 2:** 실패 확인 → 구현 → 통과(344×882, 44px, 넘침 0).
- [ ] **Step 3:** 커밋.

### Task 10: 공방 밖과 잇기 (사용자에게 묻는 관문)

**Files:**
- 공방 모음 `polos0117.github.io/index.html` 의 `ROOMS` `city` 줄(`soon` 빼고 `links` · `desc`), `README.md`, `docs/PATCH.md`(그쪽 규칙대로)

- [ ] **Step 1: 관문** — 사용자에게 묻는다: GitHub 저장소 `polos0117/city-atelier` · `polos0117/city-atelier-img` 만들기(Pages 켜기), 지구본 glb · 정지 그림을 그림 저장소 `models/globe/` 에 올리기, 허브 「준비 중」 풀기, 세 저장소 push. **「올려줘」 전에는 하지 않는다.**
- [ ] **Step 2:** 승인되면 차례대로 하고, 라이브에서 344×882 로 지구본 · 도감을 찍어 확인(콘솔 오류 0).

### Task 11: 화풍 시험 — 서울을 여러 화풍으로 (사용자가 고르는 관문)

**Files:**
- Create: `data/style-compare.json` 의 서울 묶음, `tools/style-compare.py`(원소 것)로 그림 뽑기
- Modify: `data/style.json`(고른 화풍을 `default` 로, `undecided` 삭제)

- [ ] **Step 1:** 화풍 후보 — 화풍공방(`style-atelier`)의 화풍들과 삼국지 · 원소 · 포켓몬 공방의 화풍 판(각 저장소 `data/style.json`)을 모아, **인물 설계만 서울로 바꿔** 서울 세 사람을 화풍마다 뽑는다(`gpt-image-2`, 키는 사용자 환경 변수 — 출력하지 않는다). 몇 화풍 × 세 세계인지는 뽑기 전에 사용자에게 수와 비용을 말하고 묻는다.
- [ ] **Step 2: 관문** — 한 장에 나란히 모아 보여 주고, 기준은 **캐릭터 분별성**(세 사람이 서로, 다른 도시와 한눈에 구별 — 「너무 2D 애니메이션 느낌」 피하기). 사용자가 고르거나 섞는다.
- [ ] **Step 3:** 고른 화풍을 `default` 로. `node tests/prompt-city.cjs` 통과, 커밋, PATCH.
