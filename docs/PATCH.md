# 패치 기록

파일을 고친 쪽이 직접 한 칸 적는다. 규칙은 `AGENTS.md` 의 "5. 고쳤으면 적는다" 에 있다.

모양은 두 줄이 전부다. 한 칸은 `##` 으로 시작하고 `날짜 · 누가 · 무엇을 바꿨나` 를
가운뎃점으로 나눈다. 그 아래 `-` 줄에 `파일 — 왜/무엇` 을 파일마다 하나씩 적는다.
날짜는 `2026-11-19` 꼴, 누가는 `claude` 또는 `gpt`, 새 칸이 위로 간다.
이 안내글은 첫 `##` 앞이라 읽히지 않는다. `node tests/patch.cjs` 가 모양을 본다.

## 2026-11-19 · claude · 도시 설계표와 검사기 — 도시 10곳 · 서울 세 세계
- data/city-design.json — 새로. 세계 사전(fantasy · steampunk · cyberpunk, 세계 표지 ko/en 10개씩 · 판타지 · 스팀펑크 금지 낱말 · 옷 말투 costume/bold/moderate/low)과 도시 10곳(위도 · 경도 · 상징 3~5개, 모두 위키백과 src). 서울만 세 세계를 끝까지(세 사람 — 머리색 · 체형 · 얼굴형 · 헤어스타일 모두 다름), 나머지 아홉은 worlds {}(설계 미정)
- tools/city-design.py — 원소 검사기(나라 › 가문 › 주민, roster)를 도시 한 층 검사로 다시 씀
- tests/city-design.py — 건너뜀 걷어 냄. 진짜 표 통과 + 망가뜨린 28가지(세계 열쇠 · lat · src · 머리색 겹침 · scenes 수 · motif · 열쇠 10개 · 금지 낱말 …) 다 걸림
- tests/look-spec.cjs — 건너뜀 걷어 냄. 설계표 look 대조를 도시 × 세계 꼴로(값이 어휘에 있는지 · 눈 크기/눈꼬리 모순)
- docs/PORT_NOTES.md — 건너뛴 검사 표에서 두 줄 되살림

## 2026-11-19 · claude · 1단계 검토 고침 — 저장 열쇠 · 그림 등록 시간표
- 검토에서 나온 두 가지. ① 이 기기에 기억하는 열쇠가 원소 공방과 같았다(`element_room_v1` · `element_background_v1` · `element_hall_v1` · `element_studio_v1` · `element_dex_v1`) — 같은 주소(polos0117.github.io) 아래라 서로 덮어쓴다 → `city_*_v1`. ② `.github/workflows/register-images.yml` 이 원소 그림 저장소를 매시간 읽게 되어 있었다 — 원격을 붙이는 순간 원소 그림을 등록할 수 있어 `schedule` 을 뺐다(Task 5 · 10 에서 이 공방 그림 저장소로 되살린다).

## 2026-11-19 · claude · 도시 공방 뼈대 — 원소 공방에서 복제, 원소 전용 걷어냄
- 저장소 전체 — 원소 공방 main 을 복제해 원소 전용(주기율표 · 궤도 · 목록 · 가문 · 한 장 · 합성 · 홀로 · 옛 주소 껍데기 · 원소 설계표 · 원소 그림 등록부)을 걷었다. 자세한 표는 docs/PORT_NOTES.md
- index.html — 「짓는 중」 껍데기 + 도구 상자(진짜 첫 화면은 Task 7~9)
- lib/walk-core.js — 주소 · 층 꼴을 도시 층(globe · dex · city · card)으로
- lib/toolbox.js · lib/words.js — 합성 · 땅 · 풍경 도구와 원소 낱말을 걷어 냄
- tests/casual-tree-v2.cjs — 공용 모듈 sha256 이 원소 공방 사본과 같은지 보는 줄(저장소가 옆에 없으면 건너뜀)
- tests/ — 원소 꼴에 묶인 검사 열한 개는 맨 위 process.exit(0) 으로 건너뜀(표는 PORT_NOTES)
