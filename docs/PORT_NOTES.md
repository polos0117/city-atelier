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
| `lib/img.js` · `lib/fresh.js` · `lib/look-spec.js` · `lib/patch.js` · `lib/favorites.js` · `lib/casual-tree.js` · `lib/casual-tree-v2.js` · `lib/motion-fx.js` | 공용 · 그림 길 · 새 그림 | 그대로(`img.js` 는 Task 5 에서 `BASES` 를 `city-atelier-img` 하나로, 머리 설명만 도시 꼴로) |
| `lib/city.css`(← `element.css`) · `lib/workspace.css` · `lib/workspace-theme.js` · `lib/room.css` · `lib/material.css` · `lib/studio.css` | 겉모습 | **Task 7 에서 공간 여섯(도시 극장)으로 다시 씀** — 색 변수는 `room.css` 한 곳(세계 셋 × 객석 불 둘), `workspace-theme.js` 가 `data-world` · `data-tone` · `data-motion`, `workspace.css` 는 원소 공간 다섯을 걷고 틀 규칙만, `material.css` 는 그림 변수를 지움. `city.css` 에 홀로 효과 규칙이 남아 있다 |
| `data/casual-tree.json` · `data/casual-tree-v2.json` · `data/casual-own.json`(`cards: {}`) · `data/img.json`(빈 꼴) | 일상컷 트리 · 직업표 · 등록부 | 트리 표는 그대로(Task 4 가 이 공방 것으로), 직업표 · 등록부는 비움 |
| `tools/*` · `tests/*` · `.github/workflows/register-images.yml` | 도구 · 검사 | 이름 바꿈: `element-design.py` → `city-design.py`, `prompt-element.cjs` → `prompt-city.cjs`, `element.css` → `city.css`. 워크플로는 Task 5 에서 `city-atelier-img` 하나를 받게 고침(`schedule` 은 Task 10) |
| `IMAGE_RULES.md` · `docs/IMAGE_AUTOMATION.md` · `docs/CASUAL_TREE_PORT.md` | 규칙 문서 | `IMAGE_RULES.md` 는 Task 5 에서 도시 꼴로 다시 씀. `IMAGE_AUTOMATION.md` 는 그림 길 대목만 고치고 머리에 「Task 10 · 11 뒤 다시」, `CASUAL_TREE_PORT.md` 는 머리 안내 그대로 |
| `AGENTS.md` · `CLAUDE.md` · `README.md` · `DESIGN.md` · `docs/PATCH.md` | 문서 | 도시 공방 것으로 다시 씀(DESIGN 은 빈 틀) |
| `index.html` | 첫 화면 | 도시 극장 — 지구본 · 도시 무대 · 한 장(Task 8) · 전체 도감(Task 9, `lib/dex-view.js`) + 도구 상자 |

## 뺀 것

| 파일 | 왜 |
|---|---|
| `alchemy.html` · `lib/alchemy.js` · `tests/alchemy.cjs` | 원소 합성 |
| `hall.html` · `gallery.html` · `dex.html` | 옛 원소 주소를 새 주소로 넘기는 껍데기(`gallery.html` · `dex.html` 은 원소 전용이라 뺌 — 도감은 Task 9 가 `index.html?tab=dex` 로) |
| `lib/walk.js` · `lib/walk.css` · `lib/walk-table.js` · `lib/walk-orbit.js` · `lib/walk-family.js` · `lib/walk-list.js` · `lib/walk-card.js` · `lib/walk-data.js` · `lib/walk-fx.js` | 원소 층 화면(주기율표 · 궤도 · 가문 · 목록 · 한 장) · 껍데기 · 효과 다섯. 한 장 · 자료 읽기 꼴은 Task 8 이 원소 저장소에서 참고해 새로 짠다 |
| `lib/holo.js` | 한 장의 홀로(Pixi) 효과 — 한 장 층과 함께 쓰임. 판단이 갈려 뺌(Task 8 이 다시 가져올지 정한다) |
| `tests/walk-orbit|table|family|list|card|shell|world|tools|particles|theme.cjs` · `tests/dex-holo.cjs` · `tests/dex-turn.cjs` | 위 화면의 검사(`walk-theme` 는 땅 · 원소 설계표에 묶여 있어 뺌 — Task 7 이 `tests/theme.cjs` 를 새로 씀: 공간 여섯 · 세계 따라감 · 밝기 기억 · 움직임 끔) |
| `tools/seed-elements.py` · `tools/roster.py` | 원소 번호 채우기 · 세 층 카드 읽기. **`tools/register-images.py` 는 Task 5 에서 `roster` 없이 `data/city-design.json` 을 바로 읽게 고쳤다**(`tools/city-design.py` 는 Task 2 에서 `roster` 없이 다시 씀) |
| `data/element-design.json` · `docs/ELEMENT_CONCEPT.md` · `docs/casual-review-2026-11-13.md` | 원소 설계표 · 기획 · 원소 일상컷 검토 |
| 원소 공간 다섯의 그림 · 원소 그림 | 저장소에 없던 것(그림 저장소) — 경로를 쓰던 `lib/img.js` · `lib/room.css` · `lib/material.css` 는 Task 5 에서 걷었고, Task 7 에서 그 변수(`--room-src` · `--ui-*` · `--frame`)를 지웠다 — 도시 극장은 그림 파일 없이 CSS 로만 꾸민다 |

## 건너뛰게 한 검사 (맨 위 `process.exit(0)` · `sys.exit(0)`)

| 검사 | 까닭 | 되살리는 곳 |
|---|---|---|
| ~~`tests/city-design.py`~~ | 되살림(Task 2, 2026-11-19) — 도시 한 층 검사기(`roster` 없이 `data/city-design.json` 을 바로 읽는다) | — |
| ~~`tests/look-spec.cjs`~~ | 되살림(Task 2, 2026-11-19) — 설계표 `look` 을 도시 × 세계로 어휘와 견준다. `EXPOSURE_LAYER` 줄은 Task 3 에서 `cyberpunk` 로 | — |
| ~~`tests/prompt-city.cjs`~~ | 되살림(Task 3, 2026-11-19) — 서울 × 세 세계 × 살아 있는 화풍: 표지 셋 이상 · motif · 머리색 · 금지 낱말(Avoid 줄 밖) · 상표 · 사람 이름 · mecha 던짐 · 설계 미정 아홉 | — |
| ~~`tests/prompt-sections.cjs` · `tests/prompt-short-look.cjs`~~ | 되살림(Task 3) — 칸 꼴 · 짧은 판의 도시 칸 | — |
| ~~`tests/prompt-pack-screen.cjs`~~ | 되살림(Task 3 · 4) — 서울 세계 그림 셋 + 세계마다 일상 일곱(계획기 · 자유 설계 둘), 폰 344×882 | — |
| ~~`tests/screen.cjs`~~ | 되살림(Task 3 · 4) — 화풍 비교 · 생성기 도시 판 · 세계 그림 걸음 · **일상컷 걸음**(세계 → 시대 → 서울 생활 장면 → … · 화면 = 조립기 · 해방 · 랜덤 · 여기부터 다시 · 처음부터 · 그 도시의 물건) · 폰 레일/막대/시트/44px. 지구본 · 도감 화면은 따로 — `tests/globe-screen.cjs`(Task 8) · `tests/dex-screen.cjs`(Task 9) | 끝 |
| ~~`tests/casual-plan.cjs`~~ | 되살림(Task 4, 2026-11-19) — 서울 세 세계 × 씨앗 셋: 일곱 장 · 장면 · 자세 겹침 0 · 시간 · 계절 · 날씨는 서울 표 안 · 금지 낱말 · 직업컷 셋 | — |
| ~~`tests/image-claim.cjs` · `tests/register-images.py` · `tests/make-thumbs.py`~~ | 되살림(Task 5, 2026-11-19) — 그림 잠금 · 등록 · 썸네일을 도시 꼴로(도시 열쇠 · 세계 셋 · `_f` 만 · 그림 저장소 하나). 건너뛴 검사 표는 이제 비었다 — 남은 건너뜀 없음 | — |

건너뛰지 않은 것: `words` · `patch` · `favorites` · `casual-tree-v2`(공용 모듈 sha256 견주기 포함) · `walk-core`(도시 층으로 다시 씀) · `casual-tree.cjs/.py` · `style-compare.py` · `img-shards.cjs`. `tests/casual-tree-v2.py` 는 `multiprocessing` 의 `fork` 때문에 Windows 에서 돌지 않는다(이 일 전부터의 환경 문제 — 원소 저장소의 같은 파일, 건드리지 않음).

도구 가운데 설계표(`data/city-design.json`, Task 2 가 만든다)를 읽는 것 — `tools/casual-plan.cjs` · `tools/prompt-pack.cjs` · `tools/image-claim.cjs` · `tools/sil-spread.py` · `lib/studio.js` 의 불러오기 — 은 그 표가 생기기 전에는 돌지 않는다.

## 판단이 갈린 곳

- (Task 5) **파일 이름 꼴**: 계획 Task 5 는 `<city>_<world>_f_<n>.webp` 라 적었으나 원소 꼴에는 화풍 칸이 있고 조립기(`lib/prompt-spec.js` `FILES`)도 이미 화풍을 넣어 이름을 짓는다 — 원소 꼴 그대로 화풍 칸을 두었다: 세계 그림 `<도시>_<세계>_<화풍>_f.webp`, 일상컷 `<도시>_<세계>_<화풍>_f_casual<N>.webp`, 캐릭터만의 컷 N=90. 예: `seoul_fantasy_jp_paint_anime_f.webp` · `seoul_cyberpunk_jp_paint_anime_f.webp` · `seoul_steampunk_jp_paint_anime_f_casual1.webp`. 화풍이 이름에 있어야 Task 11 에서 화풍이 바뀌어도 옛 그림과 이름이 안 겹친다. 등록부 `data/img.json` 꼴은 원소와 같다(도시 > `byStyle` > 화풍 > `byForm` > 세계 > `f` · `casual.f`).
- (Task 5) **등록기가 받지 않는 것**: 원소의 옛 꼴 — 세계 없는 일상컷(시안) · 특별컷(extra) · 남성 `_m` · 대문자 — 은 도시에 없으므로 이름 꼴 오류로 막는다(`lib/img.js` 는 그 칸을 읽는 코드가 남아 있으나 이 공방은 안 쓴다). 컷 번호 90 은 일상컷과 같은 칸에 든다(`tools/image-claim.cjs` 는 일상 일곱 장 수에 90 을 세지 않는다).
- (Task 5) **그림 저장소 하나**: `lib/img.js` BASES · `tools/register-images.py` SHARDS · 워크플로 체크아웃이 모두 `city-atelier-img` 하나(`EXTRA_DIRS` 는 빈 배열). `.github/workflows/register-images.yml` 의 `schedule` 은 아직 되살리지 않았다 — Task 10 에서 그림 저장소가 생기면 사용자에게 묻고.
- (Task 5) **UI 배경 그림**: `lib/material.css`(현판 · 단추 · 장식 틀) · `lib/room.css`(공간 풍경)의 원소 그림 저장소 주소를 모두 `none` 으로 걷었다 — 장식 틀(`border-image`)은 그림 없이 보통 테두리로, 풍경 겹은 빛 번짐 그라디언트만 남는다. 이 공방 것은 **Task 7 이 공간을 지을 때** 그림 저장소 `backgrounds/` 에 채운다(`--ui-*` · `--frame` · `--room-src`).
- (Task 5) **화풍 비교 자료**: `data/style-compare.json` 의 `base` · `oldBase` 와 `tools/style-compare.py` · `tests/style-compare.py` 의 저장소 이름만 `city-atelier-img` 로 바꿨다(묶음 내용은 원소 것 그대로 — Task 11 이 서울 묶음으로 바꾼다. 주소는 저장소가 생기기 전이라 열리지 않는다).
- (Task 5) **`tests/image-claim.cjs`**: 설계가 끝난 도시가 서울 하나라 「빈 자리 있는 도시 셋」 시험이 안 선다 — 도구가 환경 변수 `CITY_DATA_ROOT`(data/ 를 읽는 자리, 기본은 이 저장소)를 받게 하고, 검사가 임시 설계표(도쿄 · 베이징에 서울의 세계 셋을 붙인 사본)를 가리킨다. 서울의 실제 빈 자리 스물넷은 실제 자료로 따로 본다. `tests/make-thumbs.py` 는 Windows 경로 구분(`\\`)을 받게 고쳤다.

- (Task 3) **금지 낱말의 자리**: 원소 조립기의 칸 꼴은 「No …」 금지를 5칸 `Avoid:` 한 줄로 모은다 — 이 꼴을 따랐다. 설계표 `banned_en` 낱말은 그 줄에만 나와도 된다(판타지 옷 말투의 「no machinery」 · 화풍 글의 「plastic 3D-render finish」 가 그 줄로 간다). `tests/prompt-city.cjs` (d)는 `sections.negative`(그 줄)를 빼고 본다. 칸 꼴이 아닌 화풍(지금은 없다 — 살아 있는 화풍 넷이 다 칸 꼴)은 금지가 본문에 남으니, Task 11 에서 칸 꼴이 아닌 화풍을 고르면 (d)를 다시 본다.
- (Task 3) **구조판(mmorpg2d · semireal) · kv 판**: 둘 다 내린 화풍(retired)뿐이라 조립기에서 그 길과 `prompt-spec.js` 의 STRUCT 표를 뺐다. 그 화풍 열쇠를 주면 판의 `text` 로 줄 꼴을 짓는다. Task 11 에서 그런 꼴의 화풍을 고르면 다시 옮긴다.
- (Task 3) **장면 기본**: 원소는 장면을 안 고르면 세계 글만 실었다 — 「세계 장면을 넣는다」 에 맞춰 안 고르면 설계표 첫 장면을 싣는다(생성기 「설계 첫 장면」).
- (Task 3) **사이버펑크 실루엣**: 원소의 메카 실루엣 열여덟은 장갑 메카라 맞지 않아 지우고 사이버펑크 여덟을 새로 적었다(시험 그림 전 초안). 도시는 카드마다 실루엣 설계값(`sil`)이 없어 고르지 않으면 실루엣 없이 세계 옷 말투 · motif 대로. `tools/sil-spread.py` 는 원소 태그 묶음(지운 SIL_POOLS · SIL_TAGS)을 읽던 원소 도구라 돌지 않는다 — 도시에서 쓸 일이 생기면 그때 다시.
- (Task 3) **일상컷**: `buildCasual` 은 도시 카드를 읽게만 했다 → Task 4 에서 풀었다(아래).
- (Task 4) **시대는 하나**: 트리 표의 시대 넷(지금 현실 · 쓰임의 현장 · 나라 안 · 무대)을 `now`(그 세계의 하루) 하나로. 공용 모듈이 시대 기본값으로 `now` 를 박아 두어(`era: s.era || 'now'`) 열쇠 이름은 그대로 두고 뜻만 바꿨다. 세 세계는 참고 그림의 세계가 정하고, 지시문의 `World:` 줄(그 세계의 서울)이 「지금 현실이 아니다」 를 말한다.
- (Task 4) **생활 장면 = 트리 장소**: 트리 표에 서울 장면을 적지 않고, 조립기 `lifeTree` 가 생활 장면표에서 트리 장소 `<도시>_<장면>` 을 만든다(받침 · 묶음 · 표의 places 목록은 base 장소 것을 빌림, 땅 = 도시). 생성기 · 계획기 · 지시문 묶음이 다 이 사본을 쓴다(공용 모듈은 그대로 — sha256 같음). 트리의 일반 장소(침실 · 카페 · 노래방 …)는 받침으로 남았고 생성기에서 손으로 고를 수 있다 — 그 장소 글은 지금 물건 말을 담을 수 있다(계획기는 생활 장면만 고른다).
- (Task 4) **노출 갈래는 세계마다 돌려 가며 정해 둔 칸 한 장**: 원소는 카드마다 한 갈래 + 다른 칸에도 노출 계열이 나올 수 있었다. 생활 장면 가운데 란제리풍 · 수영복 · 역할극을 받는 장면이 적어(옥탑방 · 한옥 마당 / 한강 수영장 / 야구장) 세계 셋이 그 장면을 서로 빼앗아 묶음이 안 짜졌다 — 정해 둔 칸 밖에서는 노출 계열을 안 고르고, 갈래를 카드 · 세계마다 돌린다(서울: 판타지 란제리풍 · 스팀펑크 수영복 · 사이버펑크 역할극). 「나라 안」 갈래(원소의 둘째 필수)는 없다.
- (Task 4) **같은 장면은 세계끼리 다시 나와도 된다**: 장면이 열둘이라 세계 셋 열다섯 컷에 다시 나온다 — 옷 계열까지 같을 때만 막는다(원소의 「나라 안 장소」 예외 자리). 한 묶음 안 같은 장면 · 같은 자세 추천(세계끼리도)은 0.
- (Task 4) **금지 낱말**: 판타지 · 스팀펑크 일상컷은 그 세계 `banned_en` 을 맨 끝 `Avoid:` 단락(sections.negative)에만 싣는다. 계획기는 그 낱말이 든 옷(jeans · hoodie · sneakers …)을 그 두 세계에서 안 고른다. 생성기에서 손으로 고르면(일반 장소 · 트리 시간대 「네온 밤」 · 청바지) 본문에 나올 수 있다 — 사람의 선택이라 막지 않았다.
- (Task 4) **편의점 앞 파라솔**은 근거(위키백과)를 못 찾아 장면표에서 뺐다 — 한강공원 편의점은 Hangang Park 문서에 있어 밤 돗자리 장면의 근거로만.
- (Task 3) **화풍 비교(styles.html)**: 아직 세계 `mecha` 를 쓴다(원소 그림 묶음) — 낱말 `world.mecha` 를 그래서 남겼다. Task 11 에서 서울 묶음으로 바꿀 때 뺀다.

- `dex.html`: 원소 AGENTS 는 「옛 주소 껍데기」, 계획 Task 9 는 「`dex.html` 또는 `index.html` 의 `tab=dex`」 — 껍데기는 뺐고, 도감은 `index.html?tab=dex`(Task 7 이 정하고 Task 9 가 지음). 계획은 `lib/city.css` 를 고친다고 했지만 index.html 은 그 파일을 부르지 않는다 — 도감 꼴은 극장 선택자와 같이 `lib/room.css` 에.
- 새 그림 점: 원소의 `lib/fresh.js` 는 「새 판이 나왔다」 띠(빌드 살핌)라 그림과 상관없다 — 새 그림(오늘 · 어제 등록 · 열면 꺼짐)은 등록일(added)을 이미 읽는 `lib/img.js` 에 `isNew` · `markSeen` 으로 더했다(삼국지 공방 규칙, 열쇠 `city_seen_v1`).
- `holo.js` · 한 장 층: 도시 한 장에도 쓸 수 있으나 원소 한 장 층(`walk-card`)과 한 몸이라 뺌.
- `lib/city.css` 의 홀로 규칙 · `tb-lands` 규칙(`toolbox.css`) · `studio.js`/`prompt-spec.js` 의 원소 낱말 · `words.js` 의 studio/prompt/dex 낱말: 걷으면 생성기가 깨질 수 있어 두었다 — 각 Task 가 정리.
- ~~`lib/workspace-theme.js` 의 공간 다섯~~ — Task 7 에서 공간 여섯으로(열쇠 `city_world_v1` · `city_room_v1`). 「배경 끄기」(`data-background`)는 도구 상자에 고르개가 없던 것이라 같이 걷었다.
- (Task 7) **세계의 기억**: 공방 · 생성기가 같은 `city_world_v1` 을 쓴다 — 생성기에서 `?world=cyberpunk` 로 열면 공방의 마지막 세계도 사이버펑크가 된다(「세계는 하나의 상태」). 주소에 세계가 있으면 늘 주소가 먼저.
- (Task 7) **장식 영어 · 도시 영어 이름**: 시안 B 의 「SEOUL」 같은 장식 영어 대문자는 뺐고, 도시 영어 이름은 화면에 내지 않기로 DESIGN.md 에 적었다(`tests/theme.cjs` 가 화면 글에 영어 대문자 셋 이상 연달음이 없는지 본다).

## 남은 것
- (Task 11 화풍 몫 끝 — 2026-11-19) 화풍은 `painterly_concept` 로 확정(미정 표시 `undecided` 걷음), 미형 · 다른 얼굴 줄과 `people` 칸도 들어갔다. 2026-11-20 기본을 삼국지의 `kr_drawn_rim_dewy` 로 바꿨다(「기본화풍도 아까 테스트했던 화풍으로 바꿔줘. 마지막 기준」 — 서울 시험 그림 기준). 판 몫 칸(`worldFace` · `worldStyleAfter` · `casualStyleAfter`)은 조립기가 읽고, 삼국지 몫 `worldHead` · `casualLegacy` 는 옮기지 않았다. 남은 Task 11 몫은 서울 묶음 화풍 비교(`styles.html` · `data/style-compare.json`)와 나머지 아홉 도시 설계다.
- (전체 검토) `lib/city.css` 에 원소 시절 규칙이 남아 있다 — 정리는 미룸(공용 규칙과 얽혀 있어 화면 검사를 돌리며 한 번에).
- (전체 검토) `tools/port-look-spec.cjs` 를 다시 돌리면 `lib/look-spec.js` 끝의 core:v6 동기 덩어리(`core/sync.cjs` 가 붙인 것)와 얼굴 어휘 세 줄이 되돌아간다 — 돌린 뒤 `core/sync.cjs` 를 다시 돌리거나 되돌린다. `EXPOSURE_LAYER` 의 `cyberpunk` 는 이제 도구에도 있다.
- (Task 4 검토) 손으로 고를 때 새는 것 — 노래방 · 네온 밤 같은 지금 장면이 판타지 · 스팀펑크 장면 고르기에서 손으로 고르면 그대로 나온다. 계획기는 거르지만 손으로 고르는 길은 아직 안 막았다. 다음으로 미룸.
- (Task 4 검토) 역할극 산타 — 판타지 · 스팀펑크 역할극 갈래에 산타 같은 지금 문화 옷이 뽑힐 수 있다. 다음으로 미룸.

## 지구본 three.js 길 — glb 가 오면(Task 6 뒤 할 일, 2026-11-19 Task 8 에서 적음)

Task 8 은 Blender 지구본(Task 6 — 사용자가 클라우드 세션에서 나중에 만들기로 미룸)이 없는 채로 지었다. 지금 첫 화면의 지구본은 **SVG 지구본**(`lib/globe.js` — d3-geo@3.1.1 정사영 + world-atlas@2.0.2 `land-110m` + topojson-client@3.1.0, jsDelivr 판 고정)이고, three.js 길은 자리만 있다:
`lib/globe.js` 가 SVG 를 띄운 뒤 그림 저장소 `models/globe/<세계>.glb`(주소는 `lib/img.js` `BASE` 의 `img/` 옆)를 HEAD 로 찾아, 있고 WebGL 이 되면 three@0.170.0 + `GLTFLoader` 로 캔버스(`.gl-canvas`)를 SVG 공 자리에 띄운다(도시 점 · 이름표는 그대로 SVG 가 위에 — 같은 정사영 · 같은 가운데). 없거나(404) · WebGL 이 없거나 · 실패하면 SVG 그대로. 지금은 `tests/globe-screen.cjs` 가 노드 `Globe` · `Stand` 만 든 아주 작은 가짜 glb 로 이 길이 도는 것만 본다.

glb 가 오면:
1. **좌표 약속 맞춰 보기** — 노드 `Globe` 반지름 1 · 경도 0 = +Z · 북극 +Y(계획 Task 6 Interfaces, `lib/globe-math.js` `latLonToVec3`). `lib/globe.js` 는 `Globe.rotation = (lat, −lon, 0, 'XYZ')`(라디안)로 돌리고 정사영 카메라(반지름 1 = SVG 의 r 픽셀)로 본다 — 서울 · 리우 · 날짜변경선 근처 도시 점이 모형의 땅 위에 정확히 앉는지 사진으로 본다. 어긋나면 모형의 텍스처 경도 기준(정방형 도법의 가운데가 경도 0 인지)부터.
2. **`tests/globe-assets.cjs`**(계획 Task 6 Step 1) — 세 glb ≤ 1.5MB, `Globe` · `Stand`, `Globe` bounding sphere 1±0.02.
3. **Draco 압축을 쓰면** `DRACOLoader`(three@0.170.0 `examples/jsm/loaders/DRACOLoader.js` + 디코더 경로)를 `lib/globe.js` 에 더한다(지금은 없다 — 압축 없는 glb 만 읽는다).
4. **빛 · 받침** — 지금은 주변광 + 방향광 하나(`lib/globe.js` `tryModel`). 모형의 재질에 맞춰 세계마다 조정, `Stand` 는 돌지 않는다. SVG 장식(톱니 테 · 금 고리 · 빛 고리 · 받침)은 모형일 때 숨긴다(`.th-slot.is-model .gl-deco`).
5. **정지 그림** — 계획의 `<world>-still.webp`(정면 렌더)는 지금 쓰지 않는다(SVG 지구본이 곧바로 그 자리를 맡는다). 모형이 무거워 늦으면 SVG → 캔버스 바뀜이 보이니, 바뀔 때 0.3초 겹쳐 사라지기(움직임 켬일 때만)를 더할지 본다.
6. **그림 저장소에 올리기** — `models/globe/` 는 Task 10(사용자 「올려줘」 뒤). 그 전까지 라이브의 HEAD 는 404(콘솔에 리소스 404 한 줄이 남는다 — 아래 걱정).
7. 실제 모형으로 `tests/globe-screen.cjs` 의 「모형 길」 칸을 진짜 glb 로도 한 번 돌리고, 344×882 사진을 세계 셋으로 다시 찍는다.

걱정: 그림 저장소에 모형이 없는 동안 라이브 첫 화면은 HEAD 404 를 한 번 부른다(브라우저 콘솔에 「Failed to load resource 404」 한 줄 — 검사 하네스는 이 줄을 오류로 치지 않는다). 거슬리면 `data/img.json` 에 모형 목록을 적어 HEAD 없이 고르는 꼴로 바꾼다.
