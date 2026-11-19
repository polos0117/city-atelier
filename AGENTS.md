# 작업 지침

**도시 공방(city-atelier)** — 실제 도시를 세 세계(판타지 · 스팀펑크 · 사이버펑크)의 여성 셋으로 의인화하는 도감 공방. 지금은 계획 Task 1~5 · 7~9 가 끝났다(설계표 · 조립기 · 일상컷 계획기 · 그림 길 · 공간 여섯 · 지구본/도시 무대/한 장 · 전체 도감). Task 6(Blender 지구본)은 미뤘고, Task 10(올리기)은 그림 저장소 · 자동 등록까지 준비됐다(2026-11-20 — 그림은 아직 없다), Task 11(화풍 비교 서울 묶음 · 나머지 아홉 도시 설계)이 남았다.
설계: `docs/superpowers/specs/2026-11-19-city-atelier-design.md` · 계획: `docs/superpowers/plans/2026-11-19-city-atelier.md` — 일하기 전에 둘 다 읽는다. 무엇을 원소에서 가져오고 뺐는지는 `docs/PORT_NOTES.md`.

## 먼저 읽을 것

| 문서 | 무엇 |
|---|---|
| 이 문서 | 규칙과 자리 |
| `DESIGN.md` | 이 공방의 겉모습 뼈대 — 도시 극장(시안 B): 층 · 주소 · 탭 둘 · 세계 고르개 · 공간 여섯 · 선택자 · 효과 |
| `docs/superpowers/specs/…design.md` · `plans/…city-atelier.md` | 설계 · 계획 |
| `IMAGE_RULES.md` | 그림 만들기 · 파일 이름 · 기록 · 올리기 — 그림 작업 전에(도시 꼴, 2026-11-20 기본 화풍 · 그림 저장소 반영) |
| `docs/IMAGE_AUTOMATION.md` | GPT 세션 이미지 작업(세계 그림 네 장 · 잠금 · 계획기 · 지시문 묶음 · 검수) — 도시 꼴(2026-11-20 다시 씀) — 몫 없이 잠금만 |
| `docs/PORT_NOTES.md` | 원소에서 가져온 것 · 뺀 것 · 건너뛰게 한 검사 |
| `docs/PATCH.md` | 무엇을 고쳤나(아래 규칙 5) |

## 화면 (지금)

| 화면 | 파일 | 무엇 |
|---|---|---|
| 첫 화면 | `index.html` · `lib/globe.js` · `lib/globe-math.js` · `lib/city-view.js` · `lib/dex-view.js` | 도시 극장(막 · 조명 · 세계 고르개 · 도구 단추 · 아래 탭 둘). 지구본 탭 = 회전 무대 위 SVG 지구본(끌어 돌림 — Blender glb 가 오면 three.js, `docs/PORT_NOTES.md` 끝) + 전광판(앞 · 뒤 · 「세 사람 무대로」). 도시 무대 = 세 세계 세 사람(글은 설계표 `card_ko` · 직업표), 한 장. 전체 도감(`?tab=dex`) = 도시마다 표 한 장(색 띠 · 세계 세 칸 · 일상컷 수 · 「그림 없음」 → 생성기 · 「설계 전」 · 새 그림 점 — 오늘 · 어제 등록분, 그 도시를 열면 꺼짐, 도구 상자 「새 그림 모두 확인」) |
| 공간 | `lib/room.css` · `lib/workspace-theme.js` | 공간 여섯 = 세계 셋 × 객석 불 끔/켬. 세계는 주소 · 고르개를 따라 저절로, 밝기는 도구 상자(`city_room_v1`). 변수는 `room.css` 한 곳 |
| 도구 상자 | `lib/toolbox.js` · `lib/toolbox.css` | 「도구」 단추(공방은 머리 오른쪽 위) → 화풍 · 프롬프트 · 즐겨찾기 · 설정(객석 불 · 밀도 · 움직임) · 패치 기록. 도구 화면의 머리는 가는 막대 `ToolBar` |
| 화풍 비교 | `styles.html` · `data/style-compare.json` · `tools/style-compare.py` | 같은 카드를 화풍별로 — 서울 묶음은 Task 11 |
| 프롬프트 | `prompt.html` · `lib/studio.js` · `lib/prompt-spec.js` · `lib/prompt-city.js` · `lib/casual-tree*.js` | 생성기. 도시 › 갈래 › 단계(Task 3). 세계 그림은 도시 꼴(`PromptCity.build` — 도시 motif + 세계 표지, 금지 낱말은 5칸 Avoid 줄만). 일상컷은 그 세계의 그 도시의 하루(Task 4 — 생활 장면표 `data/city-life.json` · 세계 소품 사전 `data/world-props.json`, 계획기 `tools/casual-plan.cjs`). 본보기 지시문 `docs/samples/seoul-world-prompts.md` · `docs/samples/seoul-casual-prompts.md` |
| 주소 | `lib/walk-core.js` | 순수 함수. `?tab=globe\|dex &city= &card= &pic= &w= &st= &view=` — 층 globe · dex · city · card(`DESIGN.md` 2절) |

## 지켜야 할 것

### 1. 사람은 모두 여성, 세계는 셋
세계 열쇠는 정확히 `fantasy` · `steampunk` · `cyberpunk`(`mecha` 없음). 한 도시 = 세계마다 **다른 사람**(얼굴 · 머리색 · 체형 · 실루엣 모두). 세계는 장르 이름이 아니라 **표지**(옷 · 몸 · 소품 · 빛)로 싣는다 — 판타지 웅장 · 화려 / 스팀펑크 증기 · 놋쇠 · 동화(가스등 판타지 — 그을음 · 녹 · 땀은 그림을 실사로 끌어 뺐다) / 사이버펑크 두 세기 뒤의 먼 미래(오늘의 서울 + 네온이 아니다). 주인공은 사람, 배경은 거든다. 일상컷 「World:」 줄은 도시의 명소가 아니라 세계의 결(설계표 `vocab.casual_world`)만 — 명소는 장소 줄이 말할 때만(사용자 2026-11-19).

### 2. 사실은 지어내지 않는다
상징 · 위도경도 · 생활 장면마다 근거 `src`(주소). 상표 · 실존 인물 이름은 그림 지시문에 쓰지 않는다. 확신 없는 것은 적지 않는다.

### 3. 일상컷은 그 세계의 그 도시의 하루
판타지 · 스팀펑크 일상컷에 지금 도구(스마트폰 · 플라스틱 · 전광판)가 나오지 않는다. 일상컷 트리 v2(공용 모듈)는 그대로 쓰고 장소 · 시대 표만 이 공방 것. 새 도시를 설계하면 생활 장면표(`data/city-life.json` — 그 도시에 실제로 있는 생활 10~12, 장면마다 src · 받침 base · 세 세계 글 · 소품)와 계절 · 날씨(근거)도 같이 적고 `python -I -X utf8 tools/casual-tree.py check` 로 본다. 소품이 모자라면 세계 소품 사전(`data/world-props.json`)에 세 세계를 함께 더한다.

### 3-1. 캐릭터만의 컷 — 새 도시를 설계하면 직업도 같이
새 도시를 설계하면 **그 자리에서** 캐릭터만의 컷(일상컷 90번)의 직업도 같이 설계해 `data/casual-own.json` 에 적는다(원소 공방 1-1-1 규칙을 옮김). 표에 줄이 없는 카드는 계획기가 이 컷을 건너뛰므로 나중으로 미루면 그 카드만 한 장이 빈다. 직업은 도시의 상징 · 명물 · 별명에서, 세계마다 다른 직업(`mode: per_world`) — 동물 · 상표 · 실존 인물은 피하고, 세 세계 자세가 서로 다르게. 줄마다 장소 글 · 하는 일 · 자세 추천 · 도구 · 노출 단계별 의상 글 셋(bold · moderate · low)을 쓰고 `node tools/casual-plan.cjs <도시> --world all` 로 90번이 짜지는지 본다. 그림 작업 중인 카드의 줄은 바꾸기 전에 사용자에게 묻는다.

### 4. 화면에 말을 적지 않는다
사람이 읽는 말은 전부 `lib/words.js`(`W('home.building')`). 생성기의 영어 문구는 `lib/prompt-spec.js`, 외형 선택지는 `lib/look-spec.js`. `node tests/words.cjs`. `<title>` 은 `app.title` 과 같아야 한다. 설계표의 글은 자료라서 화면이 그대로 읽는다.

### 5. 고쳤으면 적는다
파일을 고쳤으면 `docs/PATCH.md` 맨 위에 한 칸 적는다. 커밋 메시지로 갈음하지 않는다.

```
## 2026-11-19 · claude · 무엇을 바꿨나
- data/foo.json — 왜 고쳤나
```

날짜는 `2026-11-19` 꼴, 누가는 `claude` 또는 `gpt`, 새 칸이 맨 위로 간다. `node tests/patch.cjs` 가 모양을 본다. 공용 링크의 `?v=` 는 손으로 올린다.

### 6. 공용 모듈은 고치지 않는다
`lib/casual-tree.js` · `lib/casual-tree-v2.js` · `lib/favorites.js` 는 원소 · 삼국지 · 포켓몬 공방과 글자 하나 다르지 않게 복사한 공용 모듈이다. 여기서 따로 고치지 않는다(`node tests/casual-tree-v2.cjs` 가 원소 공방 사본과 sha256 으로 견준다 — 저장소가 옆에 없으면 건너뛴다). `lib/motion-fx.js` 도 sam-atelier 와 같이.

### 7. 그림 · 모형은 이 저장소에 두지 않는다
그림 저장소 `city-atelier-img`(`polos0117/city-atelier-img` — 2026-11-20 만듦, Pages 켬, 썸네일 워크플로가 Actions 비밀 `CODE_REPO_TOKEN` 으로 이 저장소의 `그림 등록` 을 깨운다 · 뒤받침 한 시간마다). `img/` 는 `.gitignore` 에 있다. 원본 PNG 는 올리지 않는다. 그림 규칙은 `IMAGE_RULES.md`. `data/img.json` 은 손으로 고치지 않는다.

### 8. 화풍 · 얼굴 · 사람 (사용자 2026-11-19 확정)
- 화풍은 `kr_drawn_rim_dewy`(`data/style.json` 기본 — 2026-11-20 삼국지 공방 기본 화풍을 그대로 옮김, 사용자 「기본화풍도 아까 테스트했던 화풍으로 바꿔줘. 마지막 기준」, 모델 `gpt-image-2.6-sunburst`). 판 몫 칸 `worldFace` · `worldStyleAfter` · `worldLight` · `avoid` · `casualStyleAfter` 는 조립기가 싣고, 실사 문구는 넣지 않는다. 그 전 기본 `painterly_concept`(2026-11-19)와 옛 임시 화풍은 지우지 않고 고르개에 남긴다. 시험 그림 · 시안은 보여 주고 고른 뒤에만 쓴다.
- 미형이되 세계마다 다른 얼굴 — 「웬만하면 미형으로 가고 · 같은 얼굴은 피하고」. 조립기가 한 줄(`WORLD_SHORT.beauty` · `CASUAL.short.beauty`)을 싣고, 설계표는 얼굴 칸(face_shape · eyes · brows · nose · lips) 가운데 셋 이상이 세 세계 모두 다르게 짠다(검사기 `FACE_DIFF_MIN`).
- 사람은 그 나라 사람 — 「도시공방이니까 인종을 각 나라의 사람으로」. 도시 줄 `people: { ko, en }` 을 반드시 채우고(조립기 머리 줄 「an adult <en> woman」), 피부색 · 얼굴은 `look` 이 정한다(인종 낱말이 정하지 않는다).

### 9. 올리기
GitHub 저장소 만들기 · push 는 사용자가 「올려줘」 한 뒤에만. 강제 push 와 남의 작업 지우기는 하지 않는다.

### 10. 폴드 덮개 344×882 터치가 먼저
누르는 자리 44px, 가로 넘침 0, 콘솔 오류 0.

## 검사

```bash
node tests/words.cjs                 # 낱말 표
node tests/patch.cjs                 # 패치 기록 모양
node tests/favorites.cjs             # 즐겨찾기 공용 모듈 = 공방 모음 사본
node tests/casual-tree-v2.cjs        # 일상컷 트리 v2 + 공용 모듈 동일성(원소 공방 사본)
node tests/walk-core.cjs             # 주소 순수 함수
node tests/look-spec.cjs             # 외형 표 = game 표 + 도시 × 세계 어휘
node tests/prompt-city.cjs           # 서울 × 세 세계 × 화풍 지시문(표지 · 금지 낱말 · 설계 미정)
node tests/prompt-sections.cjs       # 지시문 칸 꼴
node tests/prompt-short-look.cjs     # 짧은 판의 도시 칸
node tests/casual-plan.cjs           # 일상컷 계획기(서울 세 세계 × 씨앗)
node tests/image-claim.cjs           # 그림 잠금
node tests/img-shards.cjs            # 그림 저장소 목록 세 곳이 같은지
node tests/globe-math.cjs            # 지구본 순수 함수(좌표 약속 · 앞면 · 조명 안의 도시 · 날짜변경선)
# 브라우저 (NODE_PATH · ESM_DIR · CHROMIUM_PATH)
node tests/theme.cjs                 # 공간 여섯 · 세계 따라감 · 밝기 기억 · 움직임 끔
node tests/globe-screen.cjs          # 지구본 탭 · 도시 무대 · 한 장(CDN 모듈은 처음 한 번 받아 ESM_DIR 옆 cdn-cache 에)
node tests/dex-screen.cjs            # 전체 도감(여섯 판 · 가짜 등록부로 그림 · 새 그림 점, 날짜는 ?today=)
node tests/screen.cjs                # 화풍 비교 · 생성기 도시 판 · 세계 그림 걸음 · 일상컷 걸음
node tests/prompt-pack-screen.cjs    # 서울 세계 그림 셋 + 일상 일곱 묶음(폰 344×882)
# 파이썬 (python -I -X utf8)
python -I -X utf8 tools/city-design.py check     # 설계표 검사기
python -I -X utf8 tests/city-design.py           # 검사기 자체의 검사
python -I -X utf8 tests/style-compare.py         # 화풍 비교 묶음
python -I -X utf8 tests/register-images.py       # 그림 등록기
python -I -X utf8 tests/make-thumbs.py           # 썸네일 만들기
node tests/casual-tree.cjs · python -I -X utf8 tests/casual-tree.py   # 공용 트리 v1
```

건너뛰는 검사는 지금 없다(`tests/favorites.cjs` 만 옆에 공방 모음 저장소가 없으면 견주기를 건너뛴다) — 되살린 내력은 `docs/PORT_NOTES.md` 표에. 브라우저 검사는 `NODE_PATH`(playwright) · `ESM_DIR`(preact 가 든 node_modules) · `CHROMIUM_PATH` 가 필요하다.
