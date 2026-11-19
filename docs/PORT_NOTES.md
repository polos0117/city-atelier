# 어디서 무엇을 가져왔나 (2026-11-19, Task 1)

도시 공방은 원소 공방(`element-atelier` main, `git archive`)을 복제해 시작했다. 원소의 `docs/superpowers/` · `docs/held/` · `.claude/` 는 가져오지 않았다(원소의 지난 설계 · 계획은 이 공방 것이 아니다). 원격 없음.

## 남긴 것

| 파일 | 무엇 | 바꾼 것 |
|---|---|---|
| `prompt.html` · `lib/studio.js` · `lib/studio.css` · `lib/prompt-spec.js` · `lib/prompt-city.js`(← `prompt-element.js`) · `lib/look-spec.js` | 생성기 · 조립기 · 외형 어휘 | 이름만(`prompt-element` → `prompt-city`, `element-design` → `city-design`). 안은 아직 원소 꼴 — Task 3 |
| `styles.html` · `data/style-compare.json` · `tools/style-compare.py` · `data/style.json` | 화풍 비교 · 화풍 판 | 판 그대로(기본 화풍 미정 표시는 Task 3 · 11) |
| `lib/toolbox.js` · `lib/toolbox.css` | 도구 상자 | 도구 = 화풍 · 프롬프트, 합성 · 땅 · 풍경 걷어 냄, 즐겨찾기 열쇠 `city`, 움직임 열쇠 `city_motion_v1` |
| `lib/walk-core.js` | 주소 · 층 꼴 | 층 globe · dex · city · card, 열쇠 `tab city card pic w st view` 로 다시 씀. 주기율표 · 나라 · 가문 · 입자 · 땅 · 옛 주소 함수는 걷음. 함수 꼴(readRoute · routeSearch · layerOf · parentOf · ancestors · resolve · validate · worldOf · motionOn · setMotion)은 남김 |
| `lib/words.js` | 낱말 표 | 합성 · 주기율표 · 땅 낱말 삭제, `app.title` 「도시 공방」, `home.building` 추가. studio · prompt · dex · gallery · fact · cat 낱말은 생성기가 아직 쓸 수 있어 남김(Task 3 · 8 · 9 에서 정리) |
| `lib/img.js` · `lib/fresh.js` · `lib/look-spec.js` · `lib/patch.js` · `lib/favorites.js` · `lib/casual-tree.js` · `lib/casual-tree-v2.js` · `lib/motion-fx.js` | 공용 · 그림 길 · 새 그림 | 그대로(img.js 의 그림 저장소 주소 · 카드 열쇠는 Task 5) |
| `lib/city.css`(← `element.css`) · `lib/workspace.css` · `lib/workspace-theme.js` · `lib/room.css` · `lib/material.css` · `lib/studio.css` | 겉모습 | 그대로(공간 다섯 · 원소 배경 경로는 Task 7). `city.css` 에 홀로 효과 규칙이 남아 있다 |
| `data/casual-tree.json` · `data/casual-tree-v2.json` · `data/casual-own.json`(`cards: {}`) · `data/img.json`(빈 꼴) | 일상컷 트리 · 직업표 · 등록부 | 트리 표는 그대로(Task 4 가 이 공방 것으로), 직업표 · 등록부는 비움 |
| `tools/*` · `tests/*` · `.github/workflows/register-images.yml` | 도구 · 검사 | 이름 바꿈: `element-design.py` → `city-design.py`, `prompt-element.cjs` → `prompt-city.cjs`, `element.css` → `city.css`. 워크플로는 원소 그림 저장소를 가리킨 채(Task 5 · 10) |
| `IMAGE_RULES.md` · `docs/IMAGE_AUTOMATION.md` · `docs/CASUAL_TREE_PORT.md` | 규칙 문서 | 머리에 개정 중 안내. 본문은 원소 꼴 그대로 |
| `AGENTS.md` · `CLAUDE.md` · `README.md` · `DESIGN.md` · `docs/PATCH.md` | 문서 | 도시 공방 것으로 다시 씀(DESIGN 은 빈 틀) |
| `index.html` | 첫 화면 | 「짓는 중」 껍데기 + 도구 상자 |

## 뺀 것

| 파일 | 왜 |
|---|---|
| `alchemy.html` · `lib/alchemy.js` · `tests/alchemy.cjs` | 원소 합성 |
| `hall.html` · `gallery.html` · `dex.html` | 옛 원소 주소를 새 주소로 넘기는 껍데기(`gallery.html` · `dex.html` 은 원소 전용이라 뺌 — 도감은 Task 9 가 `index.html?tab=dex` 로) |
| `lib/walk.js` · `lib/walk.css` · `lib/walk-table.js` · `lib/walk-orbit.js` · `lib/walk-family.js` · `lib/walk-list.js` · `lib/walk-card.js` · `lib/walk-data.js` · `lib/walk-fx.js` | 원소 층 화면(주기율표 · 궤도 · 가문 · 목록 · 한 장) · 껍데기 · 효과 다섯. 한 장 · 자료 읽기 꼴은 Task 8 이 원소 저장소에서 참고해 새로 짠다 |
| `lib/holo.js` | 한 장의 홀로(Pixi) 효과 — 한 장 층과 함께 쓰임. 판단이 갈려 뺌(Task 8 이 다시 가져올지 정한다) |
| `tests/walk-orbit|table|family|list|card|shell|world|tools|particles|theme.cjs` · `tests/dex-holo.cjs` · `tests/dex-turn.cjs` | 위 화면의 검사(`walk-theme` 는 땅 · 원소 설계표에 묶여 있어 뺌 — Task 7 이 `tests/theme.cjs` 로 새로) |
| `tools/seed-elements.py` · `tools/roster.py` | 원소 번호 채우기 · 세 층 카드 읽기. **`tools/register-images.py` · `tools/city-design.py` 가 `import roster` 라 Task 5 · 2 가 도시 꼴 읽기를 새로 넣기 전까지 돌지 않는다** |
| `data/element-design.json` · `docs/ELEMENT_CONCEPT.md` · `docs/casual-review-2026-11-13.md` | 원소 설계표 · 기획 · 원소 일상컷 검토 |
| 원소 공간 다섯의 그림 · 원소 그림 | 저장소에 없던 것(그림 저장소) — 경로를 쓰는 곳은 `lib/room.css` · `lib/material.css` · `lib/img.js`, Task 5 · 7 |

## 건너뛰게 한 검사 (맨 위 `process.exit(0)` · `sys.exit(0)`)

| 검사 | 까닭 | 되살리는 곳 |
|---|---|---|
| `tests/city-design.py` | 설계표 검사기 — 원소 표 · `roster` | Task 2 |
| `tests/look-spec.cjs` | 설계표 `look` 와 어휘 견주기 | Task 2 |
| `tests/prompt-city.cjs` | 조립기 — 원소 카드 전부 | Task 3 |
| `tests/prompt-sections.cjs` · `tests/prompt-short-look.cjs` | 원소 설계표로 지시문 칸 | Task 3 |
| `tests/prompt-pack-screen.cjs` · `tests/screen.cjs` | 생성기 화면 — 설계표 · 원소 카드 | Task 3(생성기) · 8 |
| `tests/casual-plan.cjs` | 일상컷 계획기 — 원소 카드 · 땅 | Task 4 |
| `tests/image-claim.cjs` · `tests/register-images.py` · `tests/make-thumbs.py` | 그림 잠금 · 등록 · 썸네일 — 원소 카드 열쇠(`fe-steel` …) · `roster` | Task 5 |

건너뛰지 않은 것: `words` · `patch` · `favorites` · `casual-tree-v2`(공용 모듈 sha256 견주기 포함) · `walk-core`(도시 층으로 다시 씀) · `casual-tree.cjs/.py` · `style-compare.py` · `img-shards.cjs`. `tests/casual-tree-v2.py` 는 `multiprocessing` 의 `fork` 때문에 Windows 에서 돌지 않는다(이 일 전부터의 환경 문제 — 원소 저장소의 같은 파일, 건드리지 않음).

도구 가운데 설계표(`data/city-design.json`, Task 2 가 만든다)를 읽는 것 — `tools/casual-plan.cjs` · `tools/prompt-pack.cjs` · `tools/image-claim.cjs` · `tools/sil-spread.py` · `lib/studio.js` 의 불러오기 — 은 그 표가 생기기 전에는 돌지 않는다.

## 판단이 갈린 곳

- `dex.html`: 원소 AGENTS 는 「옛 주소 껍데기」, 계획 Task 9 는 「`dex.html` 또는 `index.html` 의 `tab=dex`」 — 껍데기는 뺐고, 도감은 Task 7 이 정한다.
- `holo.js` · 한 장 층: 도시 한 장에도 쓸 수 있으나 원소 한 장 층(`walk-card`)과 한 몸이라 뺌.
- `lib/city.css` 의 홀로 규칙 · `tb-lands` 규칙(`toolbox.css`) · `studio.js`/`prompt-spec.js` 의 원소 낱말 · `words.js` 의 studio/prompt/dex 낱말: 걷으면 생성기가 깨질 수 있어 두었다 — 각 Task 가 정리.
- `lib/workspace-theme.js` 의 기억 열쇠(`element_room_v1` 등) · 공간 다섯의 원소 이름: 그대로, Task 7.
