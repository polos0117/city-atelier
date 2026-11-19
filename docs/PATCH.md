# 패치 기록

파일을 고친 쪽이 직접 한 칸 적는다. 규칙은 `AGENTS.md` 의 "5. 고쳤으면 적는다" 에 있다.

모양은 두 줄이 전부다. 한 칸은 `##` 으로 시작하고 `날짜 · 누가 · 무엇을 바꿨나` 를
가운뎃점으로 나눈다. 그 아래 `-` 줄에 `파일 — 왜/무엇` 을 파일마다 하나씩 적는다.
날짜는 `2026-11-19` 꼴, 누가는 `claude` 또는 `gpt`, 새 칸이 위로 간다.
이 안내글은 첫 `##` 앞이라 읽히지 않는다. `node tests/patch.cjs` 가 모양을 본다.

## 2026-11-19 · claude · 전체 도감 탭(Task 9) — 도시마다 표 한 장, 그림 없는 칸 · 설계 전 · 새 그림 점
- lib/dex-view.js(새) — 전체 도감: 도시 10줄(표 한 장 — 도시 상징 색 띠 palette.hex 셋 · 이름 · 나라), 세계 세 칸(그림이 있으면 작은 그림 → 한 장, 없으면 「그림 없음」 → prompt.html?card=<도시>&o=world&world=<세계>), 설계 전 아홉은 「설계 전」, 칸마다 그 세계 일상컷 수 · 줄 끝 일상컷 수, 위 머리(설계된 도시 · 세계 그림 · 일상컷). 줄을 누르면 그 도시 무대, 설계 전이면 그 줄 아래 짧은 안내. 세계 고르개는 그 세계 칸만 강조
- lib/img.js — 새 그림(today · isNew · markSeen): 오늘 · 어제 등록(added)이고 이 기기에서 안 연 그림, 그 도시(무대 · 한 장)를 열면 꺼짐 — 열쇠 city_seen_v1(어제 이후 등록분만 남김)
- index.html — 도감 층을 「짓는 중」 대신 DexView 로, 도시를 열면 새 그림을 본 것으로, 검사용 ?today=YYYY-MM-DD(이 탭의 sessionStorage 에 남김), 도구 상자에 새 그림 수
- lib/toolbox.js · lib/toolbox.css — 공방에서만 「새 그림 모두 확인 {n}」(없으면 누를 수 없음)
- lib/room.css — 도감 표(.th-dex · .th-stats · .th-legend · .th-tk-cols · .th-ticket · .th-stub · .th-tk-name · .th-seat · .th-seat-n · .th-new · .th-count · .th-tk-note)
- lib/words.js — 도감 낱말(dex.stat · dex.lg · dex.col · dex.seat · dex.new · dex.unit · dex.city.open · tool.seen), 쓰지 않게 된 home.building.note 뺌
- tests/dex-screen.cjs(새) — 여섯 판 · 10줄 · 색 띠 · 그림 없음 → 생성기 · 설계 전 · 머리 · 강조 · 줄 누르기, 가짜 등록부(data/img.json 가로채기 — 서울 판타지 그림 + 일상컷 둘 오늘 · 스팀펑크 어제 · 사이버펑크 사흘 전)로 작은 그림 · 일상컷 수 · 새 점 · 열면 꺼짐 · 새로 고침 · 모두 확인 · 날짜 지남, 344 · 1280
- tests/theme.cjs — 도감 탭 제목을 .th-dex h2 에서 본다
- prompt.html · styles.html — 공용 링크 ?v= 올림(words 33 · img 11 · room 5 · toolbox 7 · toolbox.css 4)
- DESIGN.md · AGENTS.md · docs/PORT_NOTES.md — 도감 선택자 · 새 그림 규칙 · 검사 자리

## 2026-11-19 · claude · 지구본 탭 · 도시 무대 · 한 장(Task 8) — SVG 지구본을 끌어 돌리고, 세 사람이 한 무대에
- lib/globe.js(새) — 회전 무대 위 지구본: d3-geo 정사영 + world-atlas 땅, 세계마다 결(판타지 금 · 남빛 바다 / 스팀펑크 톱니 테 · 그을린 구리 / 사이버펑크 네온 선). 끌면 조명 안 도시가 바뀌고 놓으면 가운데로, 뒷면 점은 숨기고 못 누름, 날짜변경선은 짧은 쪽으로. glb(Task 6)가 그림 저장소에 있고 WebGL 이 되면 three.js 캔버스, 아니면 SVG 그대로
- lib/globe-math.js(새) — latLonToVec3 · facing · nearestCity · wrapLon · lonDelta · 도시 차례(경도 서 → 동). 좌표 약속은 계획 Task 6 그대로
- lib/city-view.js(새) — 도시 무대(세 칸 · 그림 없음 자리 · 생성기 길 · 그 도시의 하루) · 한 장(세계 넘기기)
- index.html — 지구본 탭(전광판 앞 · 뒤 · 설계 전 표지 · 「세 사람 무대로」 막힘 안내) · 도시 무대 · 한 장 층, importmap three, img.js · globe-math.js 불러옴
- lib/room.css — 지구본 결 변수(--sea --land --land-line --grat, 공간 여섯) · 도시 점 · 전광판 · 도시 무대 · 한 장 · 효과(이름 켜짐 · 세 조명 켜짐 — 움직임 켬일 때만), 지구본 자리 CSS 공은 ::before 로
- lib/words.js — 지구본 · 도시 무대 · 한 장 · 위도경도 낱말
- data/city-design.json — 서울 card_ko(상징 한 줄 · 세계마다 머리와 몸 · 무늬 짧은 말 — 화면이 손으로 짓지 않게)
- tools/city-design.py · tests/city-design.py — card_ko 검사(빈 칸 · 길이 상한 · 상징 한 줄 낱말은 symbols[].ko 머리에서)
- tests/globe-math.cjs · tests/globe-screen.cjs(새) — 계획 Task 8 (a)~(f) + 끌기 · 앞뒤 · 날짜변경선 · 세계 바꿈 중 끌기 · 두 번 누르기 · WebGL 없음 · glb 404 · CDN 막힘 · 움직임 끔
- tests/lib/harness.cjs — jsDelivr 판 고정 모듈을 한 번 받아 두는 cdn-cache, 바깥 주소 정해 둔 답(fulfill) · CDN 막기 · 사진용 글꼴 · 브라우저 인자
- prompt.html · styles.html — 공용 링크 ?v= 올림(words 32 · room 4)
- DESIGN.md · AGENTS.md · docs/PORT_NOTES.md — 지구본이 지금은 SVG 인 것 · 짧은 말 칸 · three.js 길은 glb 가 오면 할 일

## 2026-11-19 · claude · 도시 극장 뼈대와 공간 여섯 — 사용자 「B로 해줘」(시안 B · 회전 무대 위 지구본)
- DESIGN.md — 빈 틀을 이 공방의 뼈대로: 층(지구본 · 도시 무대 · 한 장 · 전체 도감)과 주소, 아래 탭 둘, 위 세계 고르개, 오른쪽 위 도구 단추, 공간 여섯, 막 · 조명 · 전광판 · 무대 · 표 한 장의 선택자(Task 8 · 9 가 그대로 쓴다), 효과와 움직임 끄기, 하지 않는 것, 폴드 덮개 규칙
- lib/room.css — 원소 공간 다섯을 걷고 공간 여섯(세계 셋 × 객석 불 끔/켬)의 변수 한 곳으로. 판타지 붉은 벨벳 · 밝은 금 / 스팀펑크 쇠 들보 · 구리 리벳 · 화로 주황(금이 아니다) / 사이버펑크 네온 테 · 아래에서 쏘는 빛. 막 · 조명 · 무대 · 전광판 · 아래 탭 · 막 내림을 그림 파일 없이 CSS 로
- lib/workspace-theme.js — html[data-world][data-tone][data-motion] 를 붙인다. 세계는 주소(?w= · ?world=) → 이 기기의 마지막 세계(city_world_v1), 밝기는 city_room_v1(기본 끔), 움직임 줄이기 · 「움직임 끄기」면 data-motion="off". 제목 글꼴은 간판 글씨 하나
- lib/workspace.css — 원소 공간 다섯의 색 묶음을 걷음(색은 room.css 에서)
- lib/material.css — Task 5 가 none 으로 걷은 그림 단추 · 장식 틀 변수(--ui-* · --frame · border-image)를 지움
- lib/toolbox.js · lib/toolbox.css — 설정의 「공간」 고르개 대신 「객석 불」(끔 · 켬), 판 색이 지금 공간을 따름
- index.html — 「짓는 중」 껍데기에 극장을 입힘(막 · 조명 · 세계 고르개 · 도구 단추 · 무대 · 전광판 · 아래 탭 둘 — 탭은 아직 「짓는 중」)
- lib/words.js — 극장 · 탭 · 객석 불 낱말, 원소 공간 다섯 · 배경 끄기 낱말 지움
- prompt.html · styles.html — 공용 링크 ?v= 올림
- tests/theme.cjs(새) · tests/lib/harness.cjs — 여섯 판 변수 · 강조색 색상 차이 ≥ 25° · 대비 4.5 · 44px · 넘침 · 콘솔 · 세계 따라감 · 밝기 기억 · 움직임 끔(하네스에 터치 맥락)
- docs/PORT_NOTES.md · AGENTS.md — 공간 여섯 · 걷은 그림 변수 · 검사 목록

## 2026-11-19 · claude · 그림 길을 도시 꼴로 — 등록 · 잠금 · 썸네일 · 그림 저장소 city-atelier-img
- tools/register-images.py — `roster` 를 걷고 `data/city-design.json` · `data/style.json` 을 바로 읽음. 이름 꼴 `<도시>_<세계>_<화풍>_f[_casualN].webp`(세계 fantasy · steampunk · cyberpunk, 일상컷 90 = 캐릭터만의 컷), 남성 · 세계 없는 컷 · 특별컷 · 없는 도시 · 대문자는 저장 안 하고 실패. SHARDS 는 `city-atelier-img` 하나
- tools/image-claim.cjs — 그림 저장소 `city-atelier-img`, 몫은 도시 단위, 일상컷 빈 자리 셈에서 90번 제외, 환경 변수 `CITY_DATA_ROOT`(검사용)
- tools/make-thumbs.py · tools/style-compare.py · tests/style-compare.py · data/style-compare.json — 원소 그림 저장소 이름을 `city-atelier-img` 로(말만)
- lib/img.js — BASES 를 `https://polos0117.github.io/city-atelier-img/img/` 하나로, 머리 설명을 도시 꼴로
- lib/material.css · lib/room.css — 원소 그림 저장소의 UI 배경 그림 주소를 `none` 으로(장식 틀 · 단추 그림 · 공간 풍경은 Task 7 이 채운다)
- .github/workflows/register-images.yml — 그림 저장소 하나를 받음, `schedule` 은 아직 되살리지 않음(Task 10)
- tests/register-images.py · tests/image-claim.cjs · tests/make-thumbs.py · tests/img-shards.cjs — 건너뜀을 걷고 도시 꼴 기대값으로(서울 세 세계 · 일상컷 · 90번 · 틀린 이름 · 서울 빈 자리 24), make-thumbs 는 Windows 경로 구분 허용
- IMAGE_RULES.md — 본문을 도시 꼴로 다시 씀(세 세계 · 여성 · 시험 그림은 보여 주고 고른 뒤 · 화풍 미정 · 노출 · 상표 · 사실 · 파일 이름 · 그림 저장소), 「개정 중」 머리 걷음
- docs/IMAGE_AUTOMATION.md — 그림 길 · 원소 전용 대목을 도시로, 머리에 「Task 10 · 11 뒤 다시」
- docs/PORT_NOTES.md · AGENTS.md — 건너뛴 검사 표가 비었다는 것 · 파일 이름 · 판단 기록

## 2026-11-19 · claude · 일상컷 검토 고침 — 세계 그림 motif 빼기 · 지금 옷 거르기 · 노출 컷 클로즈업 막기
- lib/prompt-city.js — 일상컷(casualVars)이 도시 motif(왕관 · 망토 · 견갑)를 싣지 않는다(traits 비움 — 「no crown … regalia」 와 부딪혔다, 도시다움은 장면 · 소품 · 상징 색이). 옷 무게 문구의 「denim」 은 뺀다
- data/city-design.json — 판타지 · 스팀펑크 banned_en 에 지금 옷 낱말(denim · bomber jacket · cowboy hat · sweatpants · leggings · baseball cap · tracksuit · jogger · track pants · windbreaker · fleece · bodycon). 스팀펑크는 denim · cowboy hat 허용(1900년 무렵에도 있었다)
- tools/casual-plan.cjs — 노출 갈래 칸은 얼굴 클로즈업(face_close — hair_close 자세 포함) 구도를 안 고른다(+check 한 줄) · 색 이름도 그 세계 금지 낱말(denim)이 들면 거른다
- tests/prompt-city.cjs · tests/casual-plan.cjs — 일상컷에 motif 낱말 없음 · 판타지 · 스팀펑크 씨앗 12개의 모든 칸 옷에 금지 낱말 없음 · 노출 컷 클로즈업 없음
- docs/samples/seoul-casual-prompts.md — 조립기로 다시 뽑음(motif 줄 없음, 본보기 B 도 새 계획)
- docs/PORT_NOTES.md — 「남은 것」 에 손으로 고를 때 새는 것 · 역할극 산타 한 줄씩

## 2026-11-19 · claude · 일상컷을 그 세계의 서울의 하루로 — 생활 장면표 · 세계 소품 사전 · 서울 직업
- data/city-life.json — 새로. 서울 생활 장면 열둘(한강공원 밤 돗자리 · 출근길 지하철 · 포장마차 · 찜질방 · 광장시장 노점 · 익선동 한옥 카페 · 북촌 한옥 마당 · 청계천 · 한양도성 순성길 · 야구장 응원석 · 한강 수영장 · 옥탑방, 장면마다 위키백과 src · 받침 장소 base)과 장면마다 세 세계 글 · 소품, 공용 시간대 · 서울 계절 · 날씨(장마 · 황사 · 가을 안개 · 눈 — 근거 src)
- data/world-props.json — 새로. 세계 소품 사전 스물넷(휴대폰 · 컵 · 가방 · 우산 · 조명 · 탈것 · 간판 · 그릇 · 돈 · 책 · 시계 · 음악 · 열쇠 · 쇼핑봉투 · 표 …) × 세 세계, 그 세계에서 어색한 소품 동작(not_uses), 일상컷 옷의 결(clothes — 그 세계의 평상복)
- data/casual-tree.json · data/casual-tree-v2.json — 원소 말 걷음: 시대 넷 → now 하나(그 세계의 하루), 쓰임의 현장 · 나라 안 · 환상 무대 장소 73 · 그 하는 일 · 추천 조합 · 예전 기록, required.world, 땅(lands_of · place_lands), 현장 소품(시험관 · 연습용 검 · 안장 천)과 그 동작. 소품 이름 「그 원소의 물건」 → 「그 도시의 물건」
- data/casual-own.json — 서울 캐릭터만의 컷(90번) 직업 셋(per_world — 남산 봉수대 → 송신탑: 봉수대 봉화지기 · 전보국 타전수 · 송신탑 신호 정비사, 세 세계 자세 서로 다르게)
- lib/prompt-city.js — kind 'casual' 구현(PromptCity.build → { text, sections: head · body · negative }). lifeTree(생활 장면 → 트리 장소 <도시>_<장면>, 받침은 base 것, 땅 = 도시), Place 줄 = 그 장면의 그 세계 글, Around her = 그 세계 소품, PROP 물건 · 옷의 결도 그 세계 것, 생활 장면표 시간 · 계절 · 날씨, 그 세계의 서울 줄(World), 화풍 「No …」 + 그 세계 banned_en 은 맨 끝 Avoid 단락으로. 카드 land = 도시 열쇠
- lib/prompt-spec.js — 일상컷 시대 틀을 now 하나(WORLD 줄)로, life 줄들(world · around · season · weather · avoid)
- tools/casual-plan.cjs — 도시 꼴: 장면은 그 도시 생활 장면표에서(같은 장면 겹침 0), 시대 몫 · 나라 안 갈래 걷음, 노출 갈래는 세계마다 돌려 가며 정해 둔 칸 한 장, 판타지 · 스팀펑크 금지 낱말 든 옷 · 어색한 소품 동작 안 고름, 시간 · 계절 · 날씨는 생활 장면표, 그림 저장소는 city-atelier-img(없으면 알리고 빈 기록으로)
- tools/casual-tree.py — check 에 생활 장면표 · 세계 소품 사전 검사(장면 10~12 · src · 받침 · 소품 · 금지 낱말 · 시간 · 계절 · 날씨)
- tools/prompt-pack.cjs — 일상 기록 · 계획 검사에 생활 장면표 · 세계 소품 사전
- lib/studio.js · prompt.html — 생성기가 생활 장면표 · 세계 소품 사전을 읽는다(장소 목록에 서울 장면, 시간대에 생활 장면표 시간), 폰 자세 추천 탭의 빈 묶음 낱말 경고(words: frame.) 고침. ?v= 올림
- tests/casual-plan.cjs · tests/prompt-city.cjs · tests/prompt-pack-screen.cjs · tests/screen.cjs · tests/casual-tree.cjs · tests/casual-tree-v2.cjs · tests/casual-tree.py — 일상컷 검사 되살림 · 도시 꼴로(서울 세 세계 × 씨앗 셋, 장면 × 세계 × 화풍, 생성기 일상컷 걸음 · 일상 일곱 자리)
- docs/samples/seoul-casual-prompts.md — 새로. 세계마다 두 장(같은 포장마차를 세 세계로 + 계획기 한 장)
- docs/PORT_NOTES.md · AGENTS.md — 건너뛴 검사 표 · 판단이 갈린 곳 · 일상컷 자리

## 2026-11-19 · claude · 지시문 조립을 도시 한 층 · 세 세계로 — 서울 세 세계 지시문
- lib/prompt-city.js — 원소의 나라 › 가문 › 주민 갈래(가문주 · 주민 · 입는 물건 · 돌림 외형)를 걷고 도시 한 층(카드 = 도시 열쇠). 「원소 성질」 자리에 도시 motif + 상징 색 + 세계 표지(vocab.markers.<세계>.en)를 사람에게 싣는 줄, 세계 줄은 장르 이름 없이 그 세계의 서울 + 설계표 옷 말투(vocab.wear) + 빛, 장면은 고르지 않으면 첫 장면, 손에 드는 것(hold). PromptCity.build({ … }) → { text, sections } 를 더함(sections: head · s1~s5 · negative · style_undecided). 세 세계 밖(mecha)은 던지고, 설계 미정 도시는 { text: '', missing: ['worlds'] }. 내린 화풍만 쓰던 구조판 · kv 길은 뺐다. 일상컷은 도시 카드만 읽게(갈래는 Task 4)
- lib/prompt-spec.js — 세계 mecha → cyberpunk(빛 · 머리 꼬리만, 옷 · 노출은 설계표), CONCEPT · CITY MOTIF · WORLD MARKS · PROP 머리, 글자 금지(원소 기호 · 번호 허용 뺌), 사이버펑크 실루엣 여덟(메카 실루엣 대신), 원소 태그 묶음(SIL_POOLS · SIL_TAGS) · 구조판 표(STRUCT) 삭제, 일상컷 원소 말을 도시로
- lib/look-spec.js — EXPOSURE_LAYER 의 mecha → cyberpunk
- data/style.json — 머리에 undecided: true 와 undecided_note(화풍 미정 — Task 11 에서 사용자가 고른다, 지금 default 는 임시). 판 꼴은 그대로
- lib/studio.js · lib/words.js — 생성기 카드 고르기를 도시 › 갈래로(나라 › 카드 단계 걷음, 설계 미정 도시는 「설계 미정」 으로 못 누름), 주소 · 기억값의 세계가 그 도시 세계가 아니면 버림. 낱말: 도시 판 · world.cyberpunk · 실루엣 안내 · 얼굴 설계 칸 이름(설계 줄 목록에서 없는 낱말 경고가 났다)
- prompt.html · styles.html · index.html — ?v= 올림, 없는 lib/element.css 를 lib/city.css 로(1단계 이름 바꿈 뒤 남은 링크)
- tests/prompt-city.cjs · tests/prompt-sections.cjs · tests/prompt-short-look.cjs · tests/prompt-pack-screen.cjs · tests/screen.cjs — 건너뜀 걷어 내고 도시 꼴로 다시 씀(일상컷 걸음 · 일상 자리는 Task 4). tests/look-spec.cjs — 노출 갈래 cyberpunk
- docs/samples/seoul-world-prompts.md — 새로. 서울 세 세계 세계 그림 지시문 전문
- docs/PORT_NOTES.md — 건너뛴 검사 표 · 판단이 갈린 곳

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
