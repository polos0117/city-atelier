# 패치 기록

파일을 고친 쪽이 직접 한 칸 적는다. 규칙은 `AGENTS.md` 의 "5. 고쳤으면 적는다" 에 있다.

모양은 두 줄이 전부다. 한 칸은 `##` 으로 시작하고 `날짜 · 누가 · 무엇을 바꿨나` 를
가운뎃점으로 나눈다. 그 아래 `-` 줄에 `파일 — 왜/무엇` 을 파일마다 하나씩 적는다.
날짜는 `2026-11-19` 꼴, 누가는 `claude` 또는 `gpt`, 새 칸이 위로 간다.
이 안내글은 첫 `##` 앞이라 읽히지 않는다. `node tests/patch.cjs` 가 모양을 본다.

## 2026-11-23 · gpt · 대전 스팀펑크 도감 등록
- data/img.json — 대표컷 4번과 일상컷 1~10번, 전차대 신호수 90번을 등록.

## 2026-11-23 · gpt · 대전 판타지 도감 등록
- data/img.json — 대표컷 2번과 일상컷 1~10번, 캐릭터 전용 90번을 등록.

## 2026-11-23 · gpt · 대전 사이버펑크 그림 도감 등록
- data/img.json — 대표컷 4번과 일상컷 11장(전용 90번 포함)을 등록기로 추가.

## 2026-11-23 · claude · 인상 열네 개 더함 — 섹시 · 도발 · 퇴폐 · 팜파탈 · 새침 · 도도 · 여우 · 몽환 · 신비 · 당당 · 냉미녀 · 수줍음 · 당찬 · 아련함
- lib/prompt-spec.js — FACE_DESIGN.impression 에 열네 열쇠(seductive · provocative · decadent · femme_fatale · coquettish · haughty · mischievous · dreamy · mysterious · confident · icy · shy · sassy · wistful), 글은 화풍공방 core v7 블록이 덮는다(블록도 다시 옮김). 사용자 2026-11-23 「인상중에 뭔가 섹시,도발, 퇴폐 느낌이 없네」 → 「다 넣어주고 공방 다 적용해줘. 설계 있는거에서도 옮겨주고」. prompt-spec ?v=51
- data/city-design.json — 도시 · 랜드마크 사람 70명(대전 · 서울 · 부산 새 랜드마크 포함)의 인상을 인물 · 장면에 맞춰 새 열쇠로: 팜파탈 서울 · 런던 사이버펑크 · 멕시코시티 스팀펑크, 퇴폐 라파 아치 · 그랜드 바자르 · 방콕 · 베이징 사이버펑크, 냉미녀 대전 · 부산 · 카이로 사이버펑크 · 자금성 사이버펑크, 도도 루브르 · 돌마바흐체 판타지 · 로마 판타지, 섹시 오페라 가르니에 · 이스탄불 · 리우 판타지 · 경복궁, 도발 파리 · 리우 · 뉴욕 사이버펑크, 몽환 창덕궁 · 한빛탑 · 이화원 · 우에노 공원, 신비 스핑크스 · 저수조 · 해치 사이버펑크, 여우 남산 봉화 · 나보나 · 파리 스팀펑크, 당당 콜로세움 챔피언 · 자유의 여신상 판타지, 당찬 대전 스팀펑크 · 광안대교 · 그랜드 바자르 상인, 수줍음 센트럴 파크 숲지기 · 스페인 계단, 아련함 청계천 · 타워 브리지 사이버펑크 · 태종대 등대, 새침 에펠탑 · 센트럴 파크 스팀펑크. 표정(expr)과 부딪히는 짝은 피했다. look.why 의 「… 인상(열쇠)」 글을 맞추고 끝에 바꾼 날을 적었다
- data/city-design.json — 인상 수(171명): 우아 23→14 · 차가운 17→6 · 밝음 16→9 · 날 선 16→8 · 성숙 15→11 · 부드러운 15→8 · 화려 14→5 …, 새 열넷 4~6

## 2026-11-23 · claude · 대전 설계 · 서울 랜드마크 셋 더(여덟) · 부산 · 대전 랜드마크 셋씩
- data/city-design.json — 대전(daejeon, 36.35 · 127.38 — 비 · 길 · 빛을 다루는 손: 판타지 한밭의 비 부르는 마법사 · 스팀펑크 철도 분기점 신호수 · 사이버펑크 인공 태양 지기) 설계. 랜드마크 서울 changdeokgung(창덕궁 후원) · cheonggyecheon(청계천) · bukchon(북촌 한옥마을), 부산 gwanganbridge(광안대교) · gamcheon(감천문화마을) · taejongdae(태종대), 대전 hanbittower(한빛탑) · yuseongspa(유성온천) · daecheonglake(대청호) — 세 세계 세 사람씩(사용자 「도시에 대전 추가해주고 서울,부산,대전 랜드마크 세 개정도 추가해줘.」). 경복궁 판타지 card_ko.look 을 실제 설계(보랏빛 올림머리 · 연보라 눈)에 맞춤
- data/city-life.json — 대전 생활 장면 열둘 · 계절 다섯 · 날씨 여섯, heritage korea
- data/world-props.json — daejeon_noodles · daejeon_duruchigi · daejeon_bicycle · daejeon_telescope
- data/casual-own.json — 대전 90번(비 부르는 마법사 · 전차대 신호수 · 인공 태양 지기)
- tools/city-design.py — CITY_KEYS 에 daejeon
- tests/image-claim.cjs · dex-screen.cjs · globe-screen.cjs — 도시 열여섯 · 서울 랜드마크 여덟 · 부산 · 대전 랜드마크, 지구본 차례 서울 → 대전 → 부산 → 도쿄(전부터 부산에서 깨지던 두 자리도 함께)
- tests/prompt-city.cjs — NAMES 에 대전 쪽 이름(상호 · 구단 · 인물 등)

## 2026-11-23 · gpt · 시드니 판타지 이미지 등록
- data/img.json — 대표컷 5번과 캐릭터 전용 컷을 포함한 일상컷 11장을 도감에 등록.

## 2026-11-23 · gpt · 멕시코시티 판타지 도감 등록
- data/img.json — 대표컷 1번과 일상컷 10장, 캐릭터 전용 90번을 그림 등록기로 추가

## 2026-11-23 · claude · core v7 나이 문장 — 20대 초 youthful · 중반 young-adult · 후반 clear adult
- lib/prompt-spec.js — 화풍공방 core v7 블록 다시 옮김(나이 문장: 20대 초 youthful · 중반 young-adult · 후반 clear adult). prompt-spec ?v= 올림

## 2026-11-23 · claude · 도시 사람 나이 — 20대 초 · 중반만
- data/city-design.json — look.face.age 20대 후반 41 → 중반, 30대 초반 17 → 20대 초반(사용자 「그냥 다 동안이나 20대초중반으로 맞춰주면 안되나」)
- tools/city-design.py — 나이는 early_20s · mid_20s 만(검사)
- tests/city-design.py — 20대 후반 나이를 걸리는지 본다

## 2026-11-23 · claude · 일상컷 크기 — 같은 비율로 더 크게 온 원본(1:1 1254×1254)은 맞는 그림, WebP 로 바꿀 때 표준 크기로 줄인다
- IMAGE_RULES.md — 크기 규칙에 같은 비율로 더 큰 원본은 맞고 표준 크기로 줄인다는 말
- docs/IMAGE_AUTOMATION.md — 멈춤 조건 · WebP 바꾸기 줄에 같은 비율 큰 원본(ChatGPT 화면 1:1 1254×1254)은 줄여서 올린다

## 2026-11-23 · claude · 일상컷 화면비 — 구도 · 자세에 따라 2:3 / 1:1 / 3:2
- 사용자 「배경이 보이니까 더 시원하네」 · 「다른 공방도 조금씩 해보자」 → 「응 그렇게 진행해줘」(파리 · 카이로 시험 — 같은 지시문 · 같은 참고 그림에 Output 줄만 바꿈: 눕는 자세 · 환경 컷은 3:2, 허리 위 · 3/4 는 1:1 이 인물 크기 그대로 배경이 열렸다, 선 전신 · 가슴 위 · 얼굴은 2:3). 이미 그린 그림은 2:3 그대로, 새 계획 · 지시문만
- data/casual-tree-v2.json — aspect_rules(차례 규칙 · 기본 2:3 · 크기 셋 · keep_fams game_cosplay). 표만 고치면 조정된다
- lib/casual-tree-v2.js — 공용 모듈 aspectFor(t, scene) · aspectSize(t, 화면비) — 원소 · 삼국지 사본과 같은 글자, pkm 사본에도 같은 덩어리
- tools/casual-plan.cjs — 장면이 정해진 뒤 cut.aspect = aspectFor(자유 설계 칸 · 게임 코스프레 2:3, 캐릭터만의 컷 90 도), 묶음 검사에 화면비, 칸 줄에 화면비를 보인다
- lib/prompt-spec.js · lib/prompt-city.js — 짧은 판 Output 줄이 화면비대로(CASUAL.short.outputs — 1:1 square 1024×1024 · 3:2 horizontal 1536×1024), 긴 판은 FRAME 줄 그대로. 자유 설계 칸은 늘 2:3. SCENE_V2 에 aspect
- lib/studio.js — 생성기도 장면을 고치면 aspectFor 로 화면비(지시문 묶음 ↔ 생성기 같은 지시문)
- tools/prompt-pack.cjs — 계획의 aspect 를 그대로(옛 계획은 2:3), INDEX.md 에 「크기」 칸
- tools/register-images.py — 세계 그림은 1024×1536 하나, 일상컷은 셋 가운데 하나이고 기록(scene.aspect)이 있으면 그 크기인지 본다(요약 · 경고 글도). tools/make-thumbs.py — 주석만(긴 변 512 는 가로 · 정사각도 그대로)
- lib/room.css · lib/studio.css · lib/city.css — 한 장 그림 줄 · 생성기 그림 미리보기는 칸 2:3 그대로 object-fit: contain(1:1 · 3:2 를 자르지 않는다). 한 장 큰 그림 · 크게 보기는 원래 비율대로라 그대로. ?v= 올림
- IMAGE_RULES.md · docs/IMAGE_AUTOMATION.md — 일상컷 크기는 계획 화면비(INDEX 「크기」 칸), 검수 · webp · generation.size 도 그 크기
- tests/casual-tree-v2.cjs · tests/register-images.py · tests/make-thumbs.py — 화면비 규칙 · 크기 검사 · 가로 · 정사각 썸네일

## 2026-11-23 · claude · 일상컷 장소 보충 — 놀이 · 겨울 · 물놀이 · 구경 · 관람 · 캠퍼스 장소, 필수 갈래 자리 넓히기 · 소품 · 상황 · 옷
- 사용자 「장소 보충이랑 필수갈래 장소 넓히기, 소품, 상황, 의상 늘리기 같이 진행해줘. 도시공방 만들면서, 설계에는 장소가 다양하다보니 그전에 있던 장소적인 선택지가 부족한게 눈에 보이네.」 장소 96 → 136, 장소 × 의상 계열 쌍(받침 규칙 통과) 373 → 599, 필수 갈래가 서는 곳 란제리풍 5 → 16 · 수영복 14 → 24 · 역할극 8 → 22 · 게임 코스프레 12 → 25. 네 공방 같이(도구 scratchpad add_places.py).
- data/casual-tree.json — 새 묶음 다섯: play 실내 놀이 · winter 겨울 놀이 · shop 구경 · 꾸밈 · stadium 관람석 · 경기장 · campus 캠퍼스. 새 장소(지금 현실, 모두 start_median): 영화관 객석 · 로비, 볼링장, 보드게임 카페, 방탈출, 테마 카페, PC방 / 아이스링크, 스키 슬로프 · 리프트, 눈썰매장 / 파도풀, 슬라이드 착수장, 루프탑 풀 파티, 비치 클럽(물가), 온천 리조트 풀, 목욕탕 탈의실(스파) / 글램핑 텐트 · 호숫가 데크, 료칸 객실(여행), 호텔 스위트 발코니(저녁), 창가 자리(집) / 미술관 전시실, 서점 서가, 꽃집, 꽃 시장, 사진 스튜디오, 부두아르 세트, 미용실, 네일숍, 피팅룸 / 야구장 응원석, 축구장 관중석, e스포츠 경기장, 골프 연습장 · 그린, 펜싱장(스키 · 골프 · e스포츠 · 펜싱 옷이 설 자리) / 강의실, 캠퍼스 잔디밭, 대학 축제 부스.
- data/casual-tree.json — 필수 갈래 넓히기: 란제리풍은 사적인 방 · 촬영 세트(료칸 · 글램핑 텐트 · 스위트 발코니 · 창가 · 탈의실 · 피팅룸 · 부두아르 · 사진 스튜디오)와 스파 라운지 · 파우더룸 · 산장, 수영복은 물놀이 · 탈의실 · 피팅룸 · 촬영 세트 · 글램핑 호숫가, 역할극은 영화관 로비 · 볼링장 · 방탈출 · 테마 카페 · 꽃집 · 미용실 · 사진 스튜디오 · 응원석 · e스포츠 · 강의실 · 축제 부스 · 바 · 노래방, 게임 코스프레는 영화관 로비 · 방탈출 · 테마 카페 · PC방 · e스포츠 · 사진 스튜디오 · 축제 · 노래방 · 물놀이. 공중 · 거리(k_public · k_street) 자리엔 란제리풍 · 수영복을 안 둔다(outfit_rules 그대로).
- data/casual-tree.json — 하는 일 서른셋(영화 보기 · 공 굴리기 · 단서 찾기 · 자물쇠 · 서빙 · 게임 · 스케이트 · 리프트 · 썰매 · 파도 넘기 · 그림 감상 · 꽃 고르기 · 꽃다발 묶기 · 촬영 포즈 · 머리 손질 · 네일 · 옷 입어 보기 · 응원 · 골프 스윙 · 퍼팅 · 펜싱 인사 · 강의 필기 · 부스 호객 …), 있는 하는 일에 새 장소. 옷 열다섯(놀이공원 · 영화관 데이트룩, 응원 크롭 저지, 애프터 스키, 캠퍼스 바시티, 글램핑 니트, 래시가드 비키니(sporty), 골프 스코트, 피겨 연습복, 볼링 셔츠 원피스, 신부 준비 가운, 피겨 갈라 의상(costume mini_dress), 역할극 영화관 안내원(mini_dress) · 방탈출 진행자(tailored) · 헤어 스타일리스트(jumpsuit)) — 상표 · 실제 팀 · 학교 없이, 옷마다 start_median.
- data/casual-tree-v2.json — 새 장소 받침, 새 소품(없는 것만 — 3D 안경 · 볼링공 · 보드게임 카드 · 상자 · 열쇠 · 스케이트 · 방수 폰 파우치 · 스키 고글 · 핫초코 · 썰매 · 동물 귀 머리띠 · 응원 막대 · 응원 수건 · 깃발 · 꽃 양동이 · 반사판 · 축제 전단 · 골프채 …)과 동작(준비 · 하는 중 · 마무리, 두 손이면 grip), 있는 소품(카메라 · 꽃다발 · 책 · 컵 · 수건 · 튜브 · 드라이기 · 매니큐어 · 팝콘 · 솜사탕 …)에 새 자리, 어색한 조합 여섯(사람 많은 물가에 란제리풍 · 홈웨어 / 눈밭 · 골프장 · 캠퍼스에 수영복 · 란제리 · 목욕 · 홈웨어 / 눈밭 · 골프 · 펜싱 · 볼링에 드레스 · 휴양지 · 무대 차림 / 피팅룸 · 부두아르 · 발코니에 목욕 · 운동 · 작업 / 료칸 · 텐트 · 창가에 운동 · 작업 / 물 없는 방에 수영복).
- data/world-props.json — 새 트리 소품 스물둘의 세 세계 글(팝콘 · 3D 안경 · 볼링공 · 카드 · 상자 · 열쇠 · 고글 · 핫초코 · 썰매 · 솜사탕 · 동물 귀 · 풍선 · 응원 막대 · 응원 수건 · 깃발 · 꽃 양동이 · 드라이기 · 매니큐어 · 반사판 · 전단 · 골프채 · 방수 파우치 — 판타지 · 스팀펑크 파우치는 기름 먹인 주머니, 파우치째 찍기 not_uses). 판타지 · 스팀펑크 글엔 금지 낱말 없음.
- 세계 거르기 — 새 일반 장소 마흔 가운데 PC방(neon) · e스포츠 경기장(LED screen)만 판타지 · 스팀펑크에서 빠진다(일부러 — 사이버펑크에만). 나머지 서른여덟은 세 세계 모두.
- lib/prompt-spec.js CASUAL.situations — 장소에서 생기는 상황 다섯(place_rx 로 그 장소에서만): 물보라(워터파크) · 눈발 속 반쯤 연 지퍼(스키 · 눈썰매) · 놀이기구 바람 · 응원석 물세례 · 드라이어 바람. 천은 비치지 않는다는 말 그대로. prompt.html ?v prompt-spec 48.
- tools/casual-plan.cjs — 새 옷(표 옷의 start_median)도 쓴 옷의 가운데 값에서 시작(FRESH_ITEMS — 장소의 start_median 과 같은 꼴). 시험 계획에서 새 홈웨어 하나가 세계 안 칸마다 뽑혔다.
- data/casual-tree.json — 앞 단계 하는 일 글 고정물: 달콤한 간식(「stall」 → 종이 봉투) · 먹이 시간 구경(「rail」 → 우리 너머) — 놀이공원 · 세계의 동물 정원에 가판 · 난간이 없었다(tools/casual-tree.py audit).

## 2026-11-23 · claude · 일상컷 동물 — 배경 동물 장소 · 돌봄 장면 · 놀이공원
- 사용자 「배경 동물 장소 · 돌봄 장면은 열고, 나머지는 동물 없음을 말로」 + 「놀이공원 장소도 같이」. 동물이 몸에 붙어 나와 일상컷에서 막아 두던 것을 장소로 연다. 동물 의상은 다음 단계.
- data/casual-tree.json — 묶음 셋: animal 「동물 구경」(animals: true — 동물원 산책로 · 먹이 주는 데크 · 수족관 터널 · 대형 수조 · 해파리관 · 고양이 카페 · 강아지 카페 · 공원 연못), pet 「동물 돌봄」(companion: true — 고양이와 집 · 강아지 산책 · 광장 비둘기 한 마리 · 토끼 · 어항 금붕어 한 마리 · 마구간 말 손질), amusement 「놀이공원」(회전목마 · 대관람차 곤돌라 · 롤러코스터 앞 광장 · 퍼레이드 거리 · 간식 거리 · 밤의 놀이공원). 새 장소 스물 모두 start_median, 하는 일 열셋(동물 구경 · 수조 유리 앞 · 먹이 시간 구경 · 쓰다듬기 · 같이 놀기 · 강아지 산책 · 먹이 주기 · 안아 들기 · 말 손질 · 놀이기구 기다리기 · 달콤한 간식 · 퍼레이드 구경 · 관람차 창밖) + 이미 있는 하는 일에 새 장소. 장소 글엔 세계 금지 낱말(neon · plastic · car …)이 없다.
- data/casual-tree-v2.json — 새 장소의 받침(k_public · k_street · k_vehicle 이라 수영복 · 목욕 · 란제리 · 홈웨어가 안 선다), 소품 자리(카메라 · 아이스크림 · 컵 · 책 · 우산 · 스케치북 · 물병 · 휴대폰), 어색한 조합 「동물 돌봄에 란제리풍 · 수영복 · 목욕 차림」.
- lib/casual-tree.js · lib/casual-tree-v2.js — animals(트리, 장소) · animalsAt(t, 장소)(장소나 그 묶음의 animals: true — 동물이 배경에 나오는 곳, 돌봄의 companion 과 따로)를 더해 내보냄. 공용 모듈이라 도시 · 삼국지 · 원소 · pkm 네 사본을 같이 고쳤다(game · book · myth 사본은 아직 옛것).
- lib/prompt-spec.js · lib/prompt-city.js — 일상컷 끝 줄: 보통 장소 「No animals or other creatures.」, 동물 구경 장소 「Animals of this place appear only in the background …」, 돌봄 장소는 한 사람 + 동물 한 마리 줄(short.endCompanion · figureCompanion). 글자 금지에 numbers. 긴 판 WORLD 줄의 「no creatures」 는 FIGURE 줄로 옮겼다.
- tools/casual-plan.cjs — usageOf 가 start_median 장소를 쓴 장소의 가운데 값에서 시작(옷 계열과 같은 길 — 새 장소만 연달아 뽑히지 않게). prompt.html ?v prompt-spec 47 · casual-tree 2 · casual-tree-v2 12 · prompt-city 50.

## 2026-11-23 · claude · 역할극 · 무대·판타지 · 할로윈 — 역할(콘셉트) × 재단
- 사용자 「코스튬 의상들도 같이 이런식으로」 · 「남은 2단계 작업 먼저 하고」. 옷 하나에 역할과 재단이 묶여 있어 같은 역할은 늘 같은 실루엣이었다. 네 공방 같이.
- data/casual-tree.json — roleplay · costume · halloween 계열에 classes(재단 갈래 10: 미니 드레스 · 보디수트 · 크롭 투피스 · 코르셋 · 레오타드 — 게임 코스프레 재단 — + 슬릿 가운 · 테일러드 셋업 · 점프수트 · 케이프 겹침 · 조형 보디스), 지금 옷마다 cls(옷 글로 가름), 역할 · 콘셉트마다 아직 없는 재단 둘(그 계열에서 덜 쓴 재단부터 — 역할은 색 · 휘장 · 소품 글로, 실제 휘장 · 상표 없음). 역할극 36 → 108, 무대·판타지 19 → 57, 할로윈 16 → 48.
- 고르기는 1단계(수영복 · 란제리)와 같은 공용 모듈 classLean — 덜 쓴 재단의 옷 먼저, 새 재단은 쓴 재단들의 가운데 값에서 시작.

## 2026-11-23 · claude · 수영복 · 란제리 실루엣 갈래 — 갈래 열셋씩 · 화보 · 런웨이 옷 · 덜 쓴 갈래 먼저
- 사용자 「같은 필수갈래에서는 의상들 실루엣이 거의 다 비슷 … 수영복이나 란제리쪽이 부족」 → 「1,2번 같이 하는데 … 패션쇼나 패션잡지에 실릴만한 느낌」 → 「1단계부터 진행해주고 덜 쓴 것 먼저로 섞어줘. 화보쪽을 더 자주나오게 할 필요는 없어」. 네 공방 같이.
- data/casual-tree.json — swimwear · lingerie 계열에 classes(갈래 표)와 옷마다 cls. 수영복 갈래 13(비키니 · 원피스 · 컷아웃/모노키니 · 스포티 · 레트로 핀업 · 덮개 겹침 · 조형 · 드레이프 · 스트래피 케이지 · 하드웨어 · 다이브 하이넥 · 쿠튀르 장식 · 리조트 런웨이), 란제리 갈래 13(브라렛 세트 · 코르셋/뷔스티에 · 보디수트/테디 · 슬립/슈미즈/베이비돌 · 가터 · 로브 겹침 · 겉옷처럼 입는 란제리 · 하네스 구조 · 시스루 겹침 · 쿠튀르 코르셋 · 빈티지 부두아르 · 미니멀 모노크롬 · 주얼 부두아르). 새 옷 — 수영복 37 · 란제리 34(상의 · 하의 · 한 벌 · 디테일을 갈래마다 엇갈려 짬, 시스루는 불투명 안감). 수영복 23 → 60, 란제리 29 → 63.
- lib/casual-tree-v2.js — itemClass · classLean(후보 옷 가운데 덜 쓴 갈래의 옷만, 새 갈래는 쓴 갈래들의 가운데 값에서 시작 — 새 갈래만 연달아 나오지 않게).
- tools/casual-plan.cjs — 옷 고르기 전에 classLean. ?v casual-tree-v2 11.

## 2026-11-23 · claude · 일상컷 자세 — 기도꼴 · 쉿 줄이기, 가까운 컷에 허리 위, 가슴 위 · 허리 위 추천 열
- 사용자 「무릎꿇고 기도하는 장면이나, 손으로 쉿 하는 포즈가 자주 나오는 기분」 → 원인(조건 없는 추천이 거의 모든 칸 후보라 「덜 쓴 것 먼저」 로도 안 눌림 — 기록에서 평균의 1.4 ~ 2.1 배, 필수 컷은 후보가 좁아 몰림, 가까운 컷 규칙이 얼굴 클로즈업 여섯에 몰림) → 「1,2,3 은 해주고, 4번은 자세도 늘리고 클로즈업을 가슴 위 아니면 허리 위까지해서 같이 묶는」. 네 공방 같이.
- lib/casual-tree-v2.js — presetBreadth(시대 × 장소 가운데 그 추천이 되는 몫) · presetBias(log2(몫 / 가운데 값), -1 ~ 1.5) · presetOnce(표 preset_once).
- data/casual-tree-v2.json — preset_once [clasp_low · kneel_clasp · shush_close](한 캐릭터 한 장까지). 손 clasp_both 「가슴 앞에 두 손 모으기」 → 「허리 앞 깍지」(zone waist), kneel_clasp 손 → 한 손 무릎 위(lap · natural — 기도로 읽혔다, 한 손 동작은 양쪽에 같이 못 쓴다). 조건 없는 가슴 위 · 허리 위 추천 열(collarbone_chest · cheek_hip_waist · wave_waist · thumbs_chest · crossed_tilt_waist · behind_head_chest · hair_hip_waist · reach_chest · strap_chest(어깨끈 옷) · collar_waist(깃 옷)).
- tools/casual-plan.cjs — 자세 추천 무게에 2^-presetBias, preset_once 는 묶음 · 다른 세계 · 옛 컷에 있으면 후보에서 빼고 check 도 잡음, 가까운 컷(NEAR)에 허리 위. ?v casual-tree-v2 10.

## 2026-11-23 · claude · README 를 지금 상태로
- 사용자 「README 고쳐줘」 — 첫머리가 11-19(도시 열 곳 · 「공방이 서는 중」 · Pages 아직)에 머물러 있었다. README.md — 도시 열다섯 · 랜드마크 카드 · 공방 모음 지도의 문이 열린 것 · 새 다섯 도시는 도시 설계만 된 시안 · 생성기 주소로 고쳤다.

## 2026-11-23 · claude · 일상컷 옷 꾸밈 — 같은 옷도 소재 · 입은 모양 · 핏 · 겹쳐 입기 · 장신구로
- 사용자 「같은 의상이라도 색상말고 다른 방법으로 다양화를 할 수는 없을까?」 → 「1,3,4,5,6번까지해서 공통으로 해줘」. 같은 옷 열쇠는 색 · 데니어 · 노출만 달라 같은 옷으로 보였다. 네 공방(도시 · 삼국지 · 원소 · 포켓몬) 같이.
- data/casual-tree-v2.json — 표 outfit_style: 축 다섯(소재 16 · 입은 모양 8 · 핏 · 길이 7 · 겹쳐 입기 10 · 장신구 15), 축마다 몫(rate)과 이미 정해진 옷이면 안 얹는 말(clash), 꾸밈마다 옷 계열 · 프레이밍 · 옷 글에 있어야 할 말(needs) · 부딪히는 말(clash) · 추운 철에만(warm). 노출을 늘리는 꾸밈(어깨 내리기 · 단추 풀기)은 노출 축과 겹쳐 넣지 않았다.
- lib/casual-tree-v2.js — styleOpts · styleText · spreadStyles(묶음 + 앞 기록에서 덜 쓴 것부터, 게임 코스프레 · 자유 설계 · 직접 쓴 옷 글은 안 꾸밈). scene.ostyle = { 축: 열쇠 }.
- tools/casual-plan.cjs — 색 · 데니어 다음에 spreadStyles(세계 금지 낱말은 worldOk 로 거름, 두꺼운 겉옷 · 장갑은 눈 · 겨울일 때만). lib/prompt-city.js — Outfit 줄 색 · 데니어 뒤에 「styled with …」, SCENE_V2 에 ostyle. ?v — casual-tree-v2 9 · prompt-city 49.
- 서울 · 도쿄 · 부산 · 런던 세 세계 씨앗 7 — 120컷 가운데 72컷에 꾸밈(소재 22 · 입은 모양 15 · 핏 17 · 겹쳐 입기 13 · 장신구 45), 묶음 규칙 오류 0.

## 2026-11-22 · claude · 새 도시 다섯 — 부산 · 방콕 · 바르셀로나 · 시드니 · 멕시코시티(시안)
- 사용자 「다음 도시들 5개정도 만들어줘. 우선은 도시만. 부산 포함해서」 · 「다되면 올려줘」. 랜드마크 없이 도시만, 시험 그림 전 시안. 도시마다 따로 짠 조각을 한 도구로 끼웠다(작업 폴더의 add_city_parts.py — 설계표 · 검사기 도시 목록 · 생활 장면표 · 소품 사전 · 캐릭터만의 컷).
- data/city-design.json — 도시 다섯 줄(근거 주소 · 위경도 · 상징 · palette · 세 세계 사람 · motif · hold · 실루엣). 세 세계 체형은 굴곡형 위주, 얼굴 칸은 다른 도시 사람과 셋 이상 다름, 부산 · 방콕은 주근깨 없음. 예배 장소 · 종교상 · 왕실 사람 · 건축가 이름(가우디 · 구엘 등)은 안 씀. 합친 뒤 겹친 머리 둘을 바꿈 — 시드니 사이버펑크 올백 → 숏컷(방콕 사이버펑크와 같은 은백 올백), 바르셀로나 스팀펑크 핑거웨이브 → 풍성한 머리(멕시코시티 스팀펑크와 같은 핑거웨이브 · 크리놀린).
- data/city-life.json — 도시마다 생활 장면 열둘 · 계절 · 날씨(근거 주소), heritage 에 부산 korea · 멕시코시티 mexico. data/world-props.json — 새 소품(도시 열쇠를 앞에 붙임 — busan_eomuk 등). data/casual-own.json — 도시마다 세 세계 직업 셋.
- tools/city-design.py — CITY_KEYS 열다섯, NO_FRECKLES 에 Thai. IMAGE_RULES.md 1절 주근깨 줄에 태국.
- data/city-design.json 로마 스팀펑크 eye_size large → medium(눈 모양 narrow_upturned 와 부딪혀 tests/look-spec.cjs 가 전부터 실패하던 것).
- tests — prompt-city(도시 목록 열다섯 · 이름 표에 다섯 도시의 상표 · 실존 인물 · 구단 · 예배 장소 이름), image-claim(빈 자리 33 · 차례 수 (15+5+27)×3), dex-screen(설계된 도시 열다섯 · 칸 수를 표에서), globe-screen(서에서 동 차례에 부산 · 방콕 · 바르셀로나 — 이 세션에서 cdn 이 막혀 못 돌림).
- 볼 것: 공용 「전통 문양 수영복」(heritage_pattern_swim) · heritage_couture 가 시드니에서 원주민 무늬로 읽힐 수 있다. 방콕 스팀펑크 배경의 첨탑 셋 궁전 홀(왕실 건물)은 건축 모양만. 부산 판타지 · 스팀펑크 지시문은 1126 · 1127 낱말(상한 1150).

## 2026-11-22 · claude · 랜드마크 새 그림 표시
- 사용자 「도시공방 랜드마크에도 신규이미지 등록표시 만들어줘」. 새 그림 점(오늘 · 어제 등록분 중 이 기기에서 안 연 것)이 도시 세계 칸에만 있었고, 도시 무대를 열면 랜드마크 새 그림까지 같이 꺼졌다.
- lib/city-view.js — 도시 무대 랜드마크 줄의 칸(.th-mark-fig)마다 그 세계 새 그림이면 「새」 점(칸 안쪽), CityStage 가 day 를 받음, markFiles(세계 그림 + 일상컷 파일 — dex-view worldFiles 와 같음).
- lib/dex-view.js — 도감 도시 줄 이름 밑에 「랜드마크 새」(그 도시 랜드마크 어느 세계든 새 그림이면). lib/words.js dex.new.mark · dex.new.mark.label. lib/room.css — 랜드마크 칸 점 자리 · 「랜드마크 새」 꼴.
- index.html — 도시 무대를 열면 그 도시 그림만 본 것으로, 랜드마크는 그 랜드마크 그림을 열 때 꺼짐(route.card). ?v — words 39 · room.css 9 · city-view 6 · dex-view 7.
- tests/dex-screen.cjs — 도감 「랜드마크 새」 하나 · 무대 해치 칸 점(도시를 열어도 남음) · 44px · 넘침 · 해치를 열면 꺼짐. 새 점 칸 고르개를 .th-seat 안으로 좁힘.

## 2026-11-22 · claude · 동양 쪽 설계에 주근깨 빼기
- 사용자 「설계에 동양쪽은 주근깨 안나오게 해줘」. 한국 · 일본 · 중국 사람 설계 가운데 주근깨(mark freckles)가 다섯이었다.
- data/city-design.json — 서울 스팀펑크 → 입가 점(mole_lip), 남산 판타지 → 눈 밑 점(mole_eye), 한강철교 스팀펑크 → 발그레한 볼(blush), 도쿄 레인보우 브리지 스팀펑크 → 입가 점, 베이징 자금성 스팀펑크 → 눈 밑 점. look.why 의 주근깨 말도 같이. 다른 나라 사람의 주근깨는 그대로.
- tools/city-design.py — NO_FRECKLES(Korean · Japanese · Chinese): 그 나라 사람 설계(도시 · 랜드마크)에 주근깨(mark · why · 영어 글)가 있으면 오류. tests/city-design.py 에 걸림 하나 더. IMAGE_RULES.md 1절에 한 줄.
- 한국 · 일본 · 중국 카드 세계 그림 지시문(화풍 셋)에 freckle 이 0 인 것을 뽑아 봤다.

## 2026-11-21 · claude · 랜드마크 스물일곱 — 서울 빼고 아홉 도시에 셋씩
- 사용자 「도시공방 서울 제외한 나머지 9나라의 랜드마크를 3개씩 추가해서 업로드까지 해줘」. 카드마다 세 세계 세 사람(도시 사람 · 같은 도시 다른 랜드마크와 얼굴 칸 셋 이상 다름, 굴곡형 위주 · 마른 체형은 도시마다 많아야 하나), 근거 src(위키백과). 예배 장소 · 종교 조각상 · 상표 걸린 사유 건물은 카드로 안 함, 도시 사람과 겹치는 명소는 뺌.
- data/city-design.json — landmarks: 도쿄 tokyostation · rainbowbridge · uenopark / 뉴욕 liberty · centralpark · grandcentral / 로마 colosseum · spanishsteps · navona / 파리 eiffeltower(en 은 이름 없이 the iron lattice tower on the Champ de Mars) · louvre · opera(en the grand opera house) / 런던 bigben(en the clock tower of Westminster) · towerbridge · buckingham / 베이징 forbiddencity · summerpalace · greatwall / 이스탄불 cistern · grandbazaar · dolmabahce / 카이로 pyramids · sphinx · cairotower / 리우 sugarloaf · copacabana · lapaarches. 부모 도시 palette 가 다른 명소 말(트레비 청록 · 북 · 장미창 등)이면 그 세계에 palette 를 따로.
- tests/prompt-city.cjs — 「랜드마크 없는 도시」는 도쿄를 비운 사본으로, 도쿄 셋. tests/image-claim.cjs — 잠금 차례 기대값을 표에서 세움(도시 열 + 랜드마크 서른둘 × 세 세계). tests/city-design.py — 「미정 도시 하나」 사본에서 리우 랜드마크도 비움. tests/globe-screen.cjs — 도쿄 랜드마크 줄 셋(이 세션에서 cdn 이 막혀 못 돌림).
- tests/screen.cjs — 일상컷 시간대 줄 뒤 빛 모습(「; …」, 2026-11-21 11-18 개선 옮기기)도 받게(그때 못 돌린 검사).
- 확인할 것: 뉴욕 en 「the Statue of Liberty」 가 이름 표의 런던 백화점 Liberty 와, 베이징 en 「the Great Wall at Badaling」 이 공용 금지 낱말과 겹친다(지금 검사는 랜드마크 첫 줄을 이름 표로 안 본다 — 베이징은 own_vocab.unban_en 을 물려받아 Avoid 줄엔 안 실림). 랜드마크 근거는 src 하나만 들어가 덧 근거 주소는 작업 보고에만 있다.

## 2026-11-21 · claude · 그림 속 글자 · 숫자로 올림을 멈추지 않음
- 사용자 「도시공방에 숫자나 글자보인다고 업로드 보류하는 것좀 없애줘」. 지시문의 글자 · 숫자 금지(Avoid)는 그대로 둔다.
- docs/IMAGE_AUTOMATION.md — 0절: 글자 · 숫자는 멈출 까닭이 아니다(qa.observations 에 적기만, passed 를 false 로 안 하고 block · 다시 그리기 없이 올린다). 로고 · 워터마크 · 말풍선은 4절대로 passed: false 로 올린다(block 아님). 4절 검수 줄도 같게.
- IMAGE_RULES.md — 1절 글자 줄에 「나와도 올림을 멈추지 않는다」.

## 2026-11-21 · claude · 일상컷 — 11-18 공용 개선 옮기기(자세 쏠림 · 순간 · 시간대 · 빛)
- 사용자 「1번만해줘」 — 도시 일상컷 표가 원소 2026-11-18 공용 개선(C · D · A · B · G) 전 사본이었다. 원소(element-atelier)에서 옮기고 도시 몫(생활 장면 · 전통 의상 · 직업컷 · 노출 셋 · 코스프레 · spreadTurns)은 그대로.
- data/casual-tree-v2.json — 추천 자세 열넷(chair_3q_high · chair_lookback · sideways_lookback · floor_low_cam · kneel_high_prop · recline_low · squat_side_high · edge_cheek_high · rail_sky_low · walk_side_low · half_kneel_lookback · table_chin_high · lie_side_eye · kneel_side_low, 원소 차례대로 끼움), 순간 moments 스물다섯(도시에 없는 장소 fx_spa · fx_marble_bath · nation_bath 는 뺐고 잠 머리 · 베개 자국 times 에 commute_am), ambience.times 다섯(dawn · forenoon · overcast · day_indoor · fluorescent) · weather_times 원소 것 · looks 열일곱(times 에 도시 시간대 열쇠를 더함 — 아침 → commute_am · 한낮 → midday · 해 질 녘 → commute_pm · 밤 창가 · 등불 → night_out · past_midnight). 도시 계획기는 시간대를 생활 장면표(data/city-life.json times)에서 고르고 트리 시간대 · 날씨는 안 쓴다 — times · weather_times 는 원소와 맞춘 사본일 뿐, 형광등은 도시에 안 나온다.
- tools/casual-plan.cjs — 자세 추천 무게에 자세 · 몸 방향 · 카메라 짝 횟수(전체 기록 + 묶음, comboKey), 「서기 · 정면쪽 · 눈높이」 추천은 반(C). momentize — 일반 컷(자유 설계 · 상황 노출 · 코스프레 빼고) 열에 넷 꼴로 묶음에 둘까지, 덜 쓴 것(D) — 도시는 그 세계 금지 낱말이 든 순간과, 시대 열쇠(eras)가 붙은 순간(반짝이 스티커 · 풍선 · 선크림)을 판타지 · 스팀펑크에서 거른다(momentFits — 도시 컷은 시대가 늘 now). check 가 순간을 본다. sceneUsage 가 시간대 · 빛 · 날씨(cityWeather) · 자세 짝 · 순간을 세고(그린 기록 + 같은 도시 계획), ambient 가 전체 기록 비율(global)을 C2.ambience(빛)와 lifeAmbience(시간대 · 날씨)에 넘긴다(A). 자유 설계 칸에도 시간대(B) — 원소는 자유 칸이 ambient 뒤에 생겨 시간대가 안 붙었다(원소 계획 파일에도 없음), 도시는 makeFree 뒤에 ambient 를 한 번 더.
- lib/prompt-city.js — 장면 칸에 moment, 「Time of day: …; <빛 모습>.」(extras().look) · 「Small moment: ….」 · 자유 설계 칸 「Time of day (fixed): … — set your scene at this time.」(시간대 글은 생활 장면표). prompt.html prompt-city ?v=48.
- tests/casual-plan.cjs — 시간대 줄 단언이 빛 모습이 붙은 꼴(「…; 」)도 받는다.
- 시험 계획(설계된 도시 열 곳 × 세 세계 × 씨앗 넷, 장면 컷 960): 서기 · 정면쪽 · 눈높이 18.1% → 10.8%, 서기 44.8% → 35.7%, 눈높이 50.5% → 45.2%, 빛 모습이 붙은 시간대 줄 0 → 84%, 순간 0 → 176컷(18%), 자유 설계 칸 시간대 0 → 240/240. 판타지 · 스팀펑크 지시문의 시간대 · 순간 줄에 금지 낱말 0.

## 2026-11-21 · claude · 일상컷 전통 의상 — 그 문화의 도시에서만
- 사용자 「1번으로 하고 올려줘」. 베이징 · 이스탄불 · 카이로 · 리우 시안의 시험 계획에서 유카타 · 기모노 · 한푸 · 살와르 카미즈 · 아바야가 아무 도시에나 뽑혔다.
- data/city-life.json — heritage 표: 문화별 옷(items — 한국 · 일본 · 중국 · 튀르키예 · 이집트 …), 어디서도 안 고르는 종교 옷(never — 아바야 · 부르키니), 도시별 문화(cities — 서울 한국 · 도쿄 일본 · 베이징 중국 · 이스탄불 튀르키예 · 카이로 이집트). 자기 전통 옷이 없는 뉴욕 · 로마 · 파리 · 런던 · 리우는 전통 의상 계열을 안 고르고 그 칸이 다른 옷이 된다.
- tools/casual-plan.cjs — herOk · famHerOk: 옷 고르기 · 계열 고르기에서 걸러 내고, check 가 남의 문화 옷을 잡는다(란제리 · 수영복 · 목욕 차림 속 전통 옷 — 한복 슬립 · 수영복 위 유카타 · 페슈테말 등도 같이).
- tools/casual-tree.py — heritage 표 검사(옷 · 도시 · 문화 열쇠, 전통 의상 계열 옷은 다 표에 있어야). tests/casual-plan.cjs — 서울에 기모노 · 아바야를 잡고 한복은 통과.

## 2026-11-21 · claude · 리우데자네이루 설계 — 시안
- 사용자 「남은 도시도 설계해줘」(리우데자네이루 차례 — 열 곳 가운데 마지막, 이제 열 곳 모두 설계). 카이로 · 이스탄불 · 베이징 · 런던 · 파리 · 로마 · 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로, 공용 모듈 · 조립기는 안 건드림.
- data/city-design.json — 리우 design_note(근거 주소들) · card_ko.symbols(「구세주 그리스도상 · 빵 산 · 코파카바나 · 경이로운 도시」 — 40자 안에 들게 상징 ko 둘을 앞뒤만 바꿈: 「구세주 그리스도상 — 코르코바두 산」 · 「경이로운 도시(Cidade Maravilhosa) — 리우의 별명」, en · src 그대로), 다섯째 상징 「셀라롱 계단」(근거 https://en.wikipedia.org/wiki/Escadaria_Selar%C3%B3n — 한 줄엔 넷만). 이야기 줄기 「해를 보내고 · 봉우리를 잇고 · 장단을 이끄는 경이로운 도시의 손」. 세 세계 — 판타지 「경이로운 도시의 해넘이 왕도」(청록 만의 둥근 화강암 봉우리 · 금빛 줄의 유리 곤돌라 · 우림 산 · 검고 흰 돌 물결 산책로 · 왕실 야자수 정원 · 봉우리 위 두 팔 벌린 아르데코 석상(이름 없이) — 아르포아도르의 해넘이 전령, 짙은 갈색 피부 · 보라에서 장밋빛으로 번지는 구름 곱슬 permanganate · voluminous · 풍만 voluptuous · 노을 주황 · 산호 · 금 깃털 날개(축제 깃털 부채) + 청록 비단 겉옷의 우림 잎 · 열대 꽃 금실 자수 · 노을빛 유리 원반 금 전령 지팡이, 실루엣 winged — 처음 씀), 스팀펑크 「가스등 동화 리우」(봉우리를 잇는 놋쇠 · 나무 곤돌라 · 큰 놋쇠 줄바퀴 · 흰 두 층 아치 수도교 위 열린 전차 · 물결 산책로 · 외륜선 · 비행선 — 1912년 빵 산 곤돌라 길의 조종사, 금빛 도는 밝은 피부 · 주근깨 · 풀빛 초록 낮은 포니테일 grass_green · low_ponytail · 작은 곡선 petite_curvy · 둥근 놋쇠 곤돌라 귀걸이 + 검은 물결무늬 흰 비단 스카프 · 청록 법랑 놋쇠 망원경, aeronaut), 사이버펑크 「두 세기 뒤 리우」(빛 고리를 두른 봉우리 · 빛의 실 위 투명 곤돌라 · 우림 정원 테라스 탑 · 빛으로 다시 깐 물결 산책로 · 빛의 행진 대로 — 삼바 학교 바테리아(북 패) 지휘자, 구릿빛 갈색 피부 · 스모키 눈 · 노랑 · 루비 · 초록 줄의 크롬 은빛 언더컷 chrome_prism · undercut_sweep · 큰 키 곡선 tall_curvy · 셀라롱 계단의 초록 · 노랑 · 파랑 타일 · 거울 모자이크 재킷 + 장단에 맞춰 번지는 빛 고리 치마 · 유리 지휘봉, cropped_jacket — 처음 씀). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 다른 아홉 도시 사람(랜드마크 포함)과도 셋 이상 다르다, 머리색 셋은 다른 도시가 안 쓴 색(헤어스타일 열쇠는 다 쓰여 조합으로 갈랐다). 판타지만 세계 palette(청록 · 노을 주황 · 금, 우림 초록은 자수에만)와 own_vocab.casual_world(공용 「서양 신화 세계」 대신 우림의 산과 바다 사이 신화 세계). 구세주상은 사람의 옷 · 몸짓으로 옮기지 않았고(배경 봉우리 위 석상으로만, 종교 이름 · 장면 없음), 「카니발 의상」 한 벌로 뭉뚱그리지 않았다. 판타지 · 스팀펑크엔 cable car 대신 gondola(공용 금지 낱말 car).
- data/city-life.json — 리우 계절 다섯(여름 · 카니발 무렵 · 가을 · 겨울 · 봄) · 날씨 다섯(여름 큰비 · 찌는 더위 · 바닷바람 · 맑고 마른 날 · 찬 공기 지나는 날 — 근거 https://en.wikipedia.org/wiki/Rio_de_Janeiro 기후 · https://en.wikipedia.org/wiki/Rio_Carnival), 생활 장면 열둘(코파카바나 해변 초록 코코넛 · 해변 풋발리 구경 · 아르포아도르 해넘이 박수 · 빵 산 케이블카 · 산책로 키오스크 아사이 볼 · 라파의 밤 삼바 · 셀라롱 계단 · 식물원 왕실 야자수 길 · 일요일 차 없는 바닷길 · 보테코 생맥주와 치즈빵 · 새해 전야 코파카바나 · 카니발 거리 블로코 — 동물 없는 장면). 근거는 위키백과(있는지 · 내용을 API 로 확인). 받침은 다른 도시가 쓰는 장소만.
- data/world-props.json — 소품 넷(초록 코코넛 coconut · 아사이 볼 acai · 치즈빵 pao_de_queijo · 생맥주 chope)을 세 세계 함께 더함.
- data/casual-own.json — 리우 뿌리 「해를 보내고 · 봉우리를 잇고 · 장단을 이끄는 경이로운 도시의 손」(아르포아도르 · 이파네마 해넘이 박수 · 1912년 빵 산 곤돌라 길 · 삼바 학교 바테리아 지휘자, story), 세계마다 직업: 아르포아도르의 해넘이 전령(travel_lookout · light_check · sig_raise) · 빵 산 곤돌라 조종사(street_rooftop · stand_use · sig_both) · 빛의 대로의 바테리아 지휘자(stage_festival · stride_prop · sig_hold). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계된 도시 열 곳 모두, 이름 표에 리우 상표 · 구단 · 사유 호텔 · 경기장 · 삼바 학교 · 실존 인물(선수 · 가수 · 작곡가 · 건축가 · 조경가 · 계단을 만든 이 · 조각가 · 황제) · 구세주상 이름(Havaianas · Flamengo · Fluminense · Vasco · Botafogo · Guaraná · Brahma · Globo · Copacabana Palace · Maracanã · Mangueira · Portela · Beija-Flor · Pelé · Neymar · Ronaldinho · Romário · Carmen Miranda · Anitta · Jobim · Niemeyer · Burle Marx · Selarón · Landowski · Christ · Redeemer …). 「설계 미정」 단언은 실제 표엔 미정이 없다(0) + 설계표 사본(메모리)에서 리우의 worlds 를 {} 로 비워 빈 글 · missing 길을 그대로 본다(세계 그림 · 생성기 · 일상컷).
- tests/image-claim.cjs — 몫 차례에 리우 셋 · 빈 자리 33, 「미정 도시는 빈 자리 · 몫 없음」 은 리우를 비운 설계표 사본(CITY_DATA_ROOT)으로. tests/city-design.py — 「미정 도시에 랜드마크」 는 사본에서 리우를 {} 로 되돌린 뒤 걸고, 미정 하나만으로는 오류가 아님도 본다. tests/dex-screen.cjs — 설계된 도시 열 곳 · 「설계 전」 줄 누르기 판은 설계표를 가로채(리우 {}) 본다. tests/screen.cjs — 실제 도시 판엔 막힌 칸 0 · 리우 설계됨, 가로챈 설계표 판에서 리우 막힘 · 「설계 미정」. tests/globe-screen.cjs — 설계 전 점 · 전광판 막힘 판 둘은 가로챈 설계표(리우 {})로.
- 남은 것: 기본 화풍 낱말 수는 판타지 1081 · 스팀펑크 1099 · 사이버펑크 1007(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다). 계획기의 공용 「전통 의상 · 목욕 차림」 이 이 도시에도 유카타(수영복 위) · 페슈테말 · 치파오를 골랐다(공용 모듈 문제 — 그대로 둠). tests/globe-screen.cjs 는 cdn.jsdelivr.net 이 막혀 못 돌렸다(첫 지구본 기다림에서 멈춤). 산타 테레사 전차 · 거리 시장(페이라)은 생활 장면에서 뺐다(열둘 상한 · 페이라는 영어 근거를 못 찾음).

## 2026-11-21 · claude · 카이로 설계 — 시안
- 사용자 「남은 도시도 설계해줘」(카이로 차례). 이스탄불 · 베이징 · 런던 · 파리 · 로마 · 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로, 공용 모듈 · 조립기는 안 건드림.
- data/city-design.json — 카이로 design_note(근거 주소들) · card_ko.symbols(「기자 피라미드 · 기자의 대스핑크스 · 나일강 · 천 개 첨탑의 도시」 — 40자 안에 들게 다섯째 상징 ko 를 「별명 「천 개 첨탑의 도시」」 → 「천 개 첨탑의 도시 — 카이로의 별명」 으로 앞뒤만 바꿈, en · src 그대로, 상징은 다섯 그대로). 이야기 줄기 「물때와 별과 등불로 때를 알리는 도시」. 세 세계 — 판타지 「나일 강가의 황금 왕도」(흰 돌을 입은 세 피라미드 · 돌 스핑크스 · 천 개 첨탑 · 성채의 큰 돔 · 강 섬의 눈금 기둥 — 로다섬 나일 측정계의 물때 수호자, 구릿빛 갈색 피부 bronze(처음 쓰는 피부) · 콜 화장 같은 아이라인 · 바다빛 푸른 땋은 머리 ocean_blue · braids · 근육 곡선 strong_curvy · 금 · 청금석 · 터키석 파이앙스 우세크 목깃 가슴판 + 피라미드 돌 단처럼 계단진 금테의 흰 리넨 주름 자락 + 푸른 연꽃 금 머리띠 · 금 눈금 지팡이, 실루엣 battle_mage), 스팀펑크 「가스등 동화 카이로」(흰 돛배 · 놋쇠 외륜선 · 금빛 피라미드 곁 비행선 · 별 뚫린 놋쇠 등불 수백 개의 지붕 덮인 시장 골목 · 나무 격자 발코니 — 칸 엘칼릴리 놋쇠 등불 장인, 따뜻한 베이지 피부 · 끝이 불씨처럼 달아오른 짙은 쇳빛 긴 물결머리 plutonium_ember · 서양배 굴곡 pear_curvy · 나일빛 비단 코트에 마슈라비야 격자를 옮긴 놋쇠 투각 어깨 망토 · 소매 + 여덟 꼭짓점 별 뚫린 놋쇠 허리띠 · 파누스 등불, alchemist_coat — 처음 쓰는 실루엣), 사이버펑크 「두 세기 뒤 카이로」(빛 고리를 두른 세 피라미드 · 꼭대기에서 별로 오르는 빛줄기 · 계단식 흰 탑 · 투명 차양 아래 천 개 첨탑 — 피라미드처럼 별로 방위를 맞추는 별빛 측량사, 올리브빛 피부 · 아쿠아마린 넘긴 머리 beryl_aqua · slicked_back · 버들 곡선 willowy_curvy · 어깨 · 깃이 피라미드 돌 단처럼 계단진 흰 세라믹 조형 코트 + 금빛 머릿돌 빛 + 스핑크스 머릿수건 줄무늬 같은 금 · 청금석빛 빛의 띠 · 유리 · 금 조준대, runway_avantgarde). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 · 베이징 · 파리 · 런던 · 로마 · 뉴욕 · 이스탄불 사람(랜드마크 포함)과도 셋 이상 다르다, 머리색 셋은 다른 도시가 안 쓴 색(헤어스타일 열쇠는 다 쓰여 조합으로 갈랐다). 세계 palette 는 따로 두지 않았다. 판타지만 own_vocab.casual_world(공용 「서양 신화 세계」 대신 사막 끝 큰 강의 신화 세계). 파라오 · 여왕 분장, 상형문자 · 아랍 글씨, 종교 옷 · 예배당 안 장면, 미라 · 신 · 동물 머리 형상, 낙타 · 말은 싣지 않았다.
- data/city-life.json — 카이로 계절 넷 · 날씨 넷(봄 모래바람 함신 · 한여름 불볕 · 맑고 온화한 날 · 드문 겨울 소나기 — 근거 https://en.wikipedia.org/wiki/Cairo · https://en.wikipedia.org/wiki/Khamsin), 생활 장면 열둘(나일 펠루카 해 질 녘 · 칸 엘칼릴리 시장 골목 · 아흐와 민트 홍차 · 코샤리 가게 · 이른 아침 풀 수레 · 지하철 여성 전용 칸 · 알아자르 공원 · 나일 코르니슈 저녁 산책 · 파누스 등불 골목 · 샴 엔네심 봄 소풍 · 사탕수수 즙 가게 · 기자 고원 해 질 녘 — 동물 없는 장면). 근거는 위키백과(있는지 · 내용을 REST 로 확인). 받침은 다른 도시가 쓰는 장소만. 아흐와는 차만 — 물담배는 싣지 않았다.
- data/world-props.json — 소품 여섯(민트 홍차 mint_tea · 코샤리 koshary · 풀 메담므스 ful · 파누스 등불 fanous · 사탕수수 즙 cane_juice · 물들인 달걀 dyed_eggs)을 세 세계 함께 더함.
- data/casual-own.json — 카이로 뿌리 「물때와 별과 등불로 때를 알리는 손」(로다섬 나일 측정계 · 피라미드를 지은 이들이 별로 찾은 참북쪽 · 파누스 등불, story), 세계마다 직업: 나일 측정계의 물때 수호자(stage_open_air · half_kneel_use · sig_hold) · 칸 엘칼릴리 놋쇠 등불 장인(repair_kiosk · counter_work · sig_both) · 별빛 측량사(street_rooftop · light_check · sig_raise). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 둘 → 하나(리우), 이름 표에 카이로 구단 · 항공사 · 음료 · 찻집 노포 · 작가 · 가수 · 배우 · 선수 · 실존 인물(파라오 · 왕비 · 칼리프 · 대통령 · 무함마드 알리) · 신 이름 · 시장 · 공원 · 측정계 이름(Al Ahly · Zamalek · Cleopatra · Nefertiti · Tutankhamun · Ramses · Khufu · Umm Kulthum · Mohamed Salah · Isis · Anubis · Khan el-Khalili · Nilometer …). tests/image-claim.cjs — 몫 차례에 카이로 셋 · 빈 자리 33, 미정 예는 리우. tests/dex-screen.cjs — 설계된 도시 아홉, 설계 전 예는 리우. tests/screen.cjs · tests/city-design.py — 미정 예를 리우로. tests/globe-screen.cjs — 설계 전 예를 리우로(전광판 앞 단추로 카이로 → 이스탄불 → 로마 → 파리 → 런던 → 리우 차례도 본다), 「설계 전 앞면 점」 은 설계 전이 리우 하나뿐이라 조명을 뉴욕에 두고 앞면의 리우 점을 누른다.
- 남은 것: 기본 화풍 낱말 수는 판타지 1088 · 스팀펑크 1106 · 사이버펑크 1013(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다). 계획기의 공용 「전통 의상 · 목욕 차림」 이 이 도시에도 기모노 · 한푸 · 아바야 · 크바야 · 페슈테말을 골랐다(공용 모듈 문제 — 그대로 둠). 펠루카는 카이로를 따로 짚은 근거를 못 찾아 「나일의 펠루카 · 나일을 오가는 탈것」 근거로 적었다.

## 2026-11-21 · claude · 이스탄불 설계 — 시안
- 사용자 「남은 도시도 설계해줘」(이스탄불 차례). 베이징 · 런던 · 파리 · 로마 · 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로, 공용 모듈 · 조립기는 안 건드림.
- data/city-design.json — 이스탄불 design_note(근거 주소들) · card_ko.symbols, 상징에 「처녀의 탑」 하나 더(근거 https://en.wikipedia.org/wiki/Maiden%27s_Tower — 검사기 상한 다섯), 화면 상징 한 줄이 40자 안에 들게 블루 모스크 줄 ko 를 「블루 모스크(술탄 아흐메트 모스크) — …」 로 앞뒤만 바꿈(en · src 그대로). 이야기 줄기 「두 대륙에 걸친 도시 — 해협을 건너는 길」. 세 세계 — 판타지 「두 대륙에 걸친 해협의 황금 돔 왕도」(해협 입구 섬 탑의 튤립 궁정 등불 공주, 따뜻한 베이지 피부 · 입가 점 · 튤립빛 붉은 긴 곱슬 bright_red · 풍만 voluptuous · 이즈니크 튤립 · 카네이션 · 사즈 잎 금란의 오스만 카프탄 재단 겉옷 + 작은 돔 · 반쪽 돔이 층층이 오른 금세공 관 · 청록 유리 금 등불, 실루엣 mage_robe), 스팀펑크 「가스등 동화 이스탄불」(외륜 연락선 · 두 층 다리 · 원뿔 지붕 돌탑에서 뜨는 비단 · 놋쇠 활공 날개 — 갈라타 탑 날개 비행사, 금빛 도는 피부 · 주근깨 · 납빛 회색 숏컷 lead_silver · short_crop(처음 쓰는 머리) · 탄탄한 굴곡 curvy_athletic · 갈라타 원뿔 지붕 모자 + 사즈 잎 · 물결 그린 비단 날개 · 놋쇠 풍향계, clockwork_harness), 사이버펑크 「두 세기 뒤 이스탄불」(몇 겹 빛의 다리 · 투명 차양 아래 옛 도시 · 아시아 기슭 청록 유리 탑 — 두 대륙 해협 횡단 관제사, 올리브빛 피부 · 한쪽 빨강 한쪽 파랑으로 물든 은회색 긴 생머리 pole_tipped · 늘씬 글래머 busty_slender · 코발트 · 청록으로 가운데가 갈리고 흰 빛 솔기가 흐르는 두 대륙 드레스 + 떠가는 튤립 빛 무늬 · 튤립 잔 차, biolume_dress). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 · 베이징 · 파리 · 런던 · 로마 · 뉴욕 사람(랜드마크 포함)과도 셋 이상 다르다, 머리색 셋은 다른 도시가 안 쓴 색. 판타지만 세계 palette(청록 · 코발트 · 금 · 상아, 빨강은 튤립에만)와 own_vocab.casual_world(공용 「서양 신화 세계」 대신 동서가 만나는 해협의 신화 세계). 아야 소피아 · 블루 모스크는 돔 꼴 · 타일 꽃무늬만 디자인 모양으로 — 종교 글씨 · 기도 · 종교 옷 · 예배당 안 장면은 싣지 않았고, 처녀의 탑 전설의 뱀 · 갈매기는 생물이라 쓰지 않았다.
- data/city-life.json — 이스탄불 계절 넷 · 날씨 다섯(차가운 비 · 물 위 아침 안개 · 바닷바람 · 한여름 햇볕 · 눈 — 근거 https://en.wikipedia.org/wiki/Climate_of_Istanbul), 생활 장면 열둘(연락선 튤립 잔 차와 시미트 · 카흐발트 아침상 · 하맘 · 그랜드 바자르 · 향신료 시장 로쿰 · 물가 찻집 정원 · 갈라타 다리 아래 고등어 빵 · 튀르키예 커피 · 시미트 수레 · 이스티클랄 옛 노면전차 · 4월 에미르간 튤립 축제 · 메이하네 메제와 라크). 근거는 위키백과(있는지 · 내용을 REST 로 확인). 받침은 다른 도시가 쓰는 장소만, 하맘은 bath · homewear 만.
- data/world-props.json — 소품 일곱(시미트 simit · 튤립 잔 차 tea_glass · 튀르키예 커피 turkish_coffee · 로쿰 lokum · 고등어 빵 fish_bread · 목욕 천과 놋쇠 그릇 pestemal · 메제 meze)을 세 세계 함께 더함.
- data/casual-own.json — 이스탄불 뿌리 「두 대륙 사이를 건너게 하는 손」(보스포루스 · 연락선 · 등대가 된 처녀의 탑 · 갈라타 탑 날개 이야기, story), 세계마다 직업: 처녀의 탑 등불지기(light_check · sig_raise) · 갈라타 탑 비단 날개 비행사(stand_use · sig_both) · 두 대륙 해협 횡단 관제사(counter_work · sig_both). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 셋 → 둘, 이름 표에 이스탄불 항공사 · 구단 · 맥주 · 과자 · 커피 노포 · 실존 인물 · 전설 인물 · 명소 이름(Turkish Airlines · Galatasaray · Efes · Simit Sarayı · Hürrem · Suleiman · Atatürk · Mehmed · Sinan · Hezarfen · Hagia Sophia · Galata Tower …). tests/image-claim.cjs — 몫 차례에 이스탄불 셋 · 빈 자리 33, 미정 예는 카이로. tests/dex-screen.cjs — 설계된 도시 여덟, 설계 전 예는 카이로. tests/screen.cjs · tests/city-design.py — 미정 예를 카이로로.
- 남은 것: 기본 화풍 낱말 수는 판타지 1105 · 스팀펑크 1118 · 사이버펑크 1016(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다). 계획기의 공용 「전통 의상 · 목욕 차림」 이 이 도시에도 유카타 · 살와르 카미즈를 골랐다(공용 모듈 문제 — 그대로 둠). tests/globe-screen.cjs 는 cdn.jsdelivr.net 이 막혀 못 돌렸다.

## 2026-11-21 · claude · 베이징 설계 — 시안
- 사용자 「남은 도시도 설계해줘」(베이징 차례). 런던 · 파리 · 로마 · 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로.
- data/city-design.json — 베이징 design_note(근거 주소들) · card_ko.symbols, 상징에 「고루와 종루」 하나 더(근거 https://en.wikipedia.org/wiki/Drum_Tower_and_Bell_Tower_of_Beijing — 검사기 상한 다섯). 세 세계 — 판타지 「하늘 축선의 금빛 왕도」(하늘 제단의 풍년 기원 제사 공주, 도자기빛 피부 · 눈 밑 점 · 청흑에 보랏빛 끝 쪽머리 iodine_violet · 버들 곡선 willowy_curvy · 명 궁정풍 겹 예복 — 황제 노랑 금란 겉옷 · 주홍 마면군 · 짙은 하늘빛 운견 + 천단 기년전 세 겹 지붕 금관 · 구름무늬 옥 벽, 실루엣 priestess), 스팀펑크 「가스등 동화 베이징」(후퉁 · 사합원 · 고루 · 종루 · 증기 인력거 · 놋쇠 외륜 대리석 배 — 고루 시보 북지기, 금빛 도는 밝은 피부 · 로열 블루 단발 · 모래시계 hourglass · 청화백자 치파오 재단 + 흉벽 놋쇠 치맛단 · 허리의 작은 붉은 북 · 놋쇠 북채, clockwork_bodice), 사이버펑크 「두 세기 뒤 베이징」(빛의 띠가 된 중축선 · 빛 고리가 된 순환로 · 망루마다 빛 신호를 건네는 옛 성벽 — 장성 봉화 빛 신호 관제사, 올리브빛 피부 · 루비빛 금속 회색 포니테일 selenium_ruby · 큰 키 곡선 tall_curvy · 운견 깃 + 흉벽 마디 외골격 · 봉화 지휘봉, exo_frame). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 · 파리 · 런던 · 로마 · 뉴욕 사람(랜드마크 포함)과도 셋 이상 다르다, 머리색 셋은 다른 도시가 안 쓴 색. 스팀펑크만 세계 palette(청화 코발트 · 흰빛 · 놋쇠, 옻칠 빨강은 북 · 대문에만). 용 · 봉황은 생물이라, 천안문 · 정치 장면은 싣지 않았다.
- data/city-design.json · lib/prompt-city.js — 도시별 말 own_vocab.unban_en(새): 서울 때 공용 금지 낱말에 더한 셋(Chinese-style palace · Great Wall · yellow-glazed roof tiles)이 베이징 지시문 Avoid 에 실려 자금성 · 장성을 막았다 → 베이징 판타지 · 스팀펑크에서만 Avoid 줄(세계 그림 5칸 · 일상컷 끝 단락)에서 뺀다(bannedOf). 글 검사는 그대로라 글엔 그 낱말을 쓰지 않는다(생김새로). 다른 도시 지시문은 글자까지 그대로. 판타지 일상컷 세계 줄은 공용 「서양 신화 세계」 대신 own_vocab.casual_world(중국 신화 세계의 도시). prompt.html prompt-city ?v=47.
- tools/city-design.py — unban_en 낱말이 그 세계 banned_en 에 있는지 본다. tests/city-design.py — 그 걸림 하나 더, 「미정 도시에 랜드마크」 예를 이스탄불로.
- data/city-life.json — 베이징 계절 넷 · 날씨 다섯(봄 모래바람 · 찌는 여름 · 여름 큰비 · 맑고 매서운 추위 · 드문 눈 — 근거 https://en.wikipedia.org/wiki/Beijing 기후 · 날씨 표), 생활 장면 열둘(후퉁 어귀 젠빙 · 사합원 안마당 · 후퉁 인력거 · 천단 공원 아침 춤 · 후하이 호숫가 술집 · 스차하이 얼음 지치기 · 경극 분장실 · 솬양러우 · 오리구이 · 지하철 · 탕후루 · 798 예술구). 근거는 위키백과(있는지 · 내용을 API 로 확인). 받침은 다른 도시가 쓰는 장소만.
- data/world-props.json — 소품 여섯(젠빙 jianbing · 세발 인력거 pedicab · 스케이트 ice_skates · 탕후루 candied_haws · 솬양러우 냄비 hot_pot · 오리구이 roast_duck)을 세 세계 함께 더함.
- data/casual-own.json — 베이징 뿌리 「황제의 도시에 때와 소식을 알리던 소리와 불」(천단 풍년 기원 · 고루 · 종루 공식 시각 · 장성 봉화, story), 세계마다 직업: 하늘 제단의 풍년 기원 제사관(half_kneel_use · sig_hold) · 고루 시보 북지기(stand_use · sig_both) · 장성 봉화 빛 신호 관제사(stride_prop · sig_hold). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 넷 → 셋, 뺀 금지 낱말은 Avoid 에도 없다, 이름 표에 베이징 상표 · 노포 · 정치 장소 · 실존 인물(Tsingtao · Huawei · Quanjude · Bianyifang · Tiananmen · Mao · Puyi · Cixi · Qianlong · Bruce Lee · Mulan …). tests/image-claim.cjs — 몫 차례에 베이징 셋 · 빈 자리 33, 미정 예는 이스탄불. tests/dex-screen.cjs · screen.cjs · globe-screen.cjs — 설계된 도시 일곱, 설계 전 예를 이스탄불 · 카이로로.
- 남은 것: 기본 화풍 낱말 수는 판타지 1095 · 스팀펑크 1097 · 사이버펑크 996(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다). tests/globe-screen.cjs 는 이 세션에서 cdn.jsdelivr.net 이 막혀 못 돌렸다.

## 2026-11-21 · claude · 런던 설계 — 시안
- 사용자 「런던 설계해줘」. 파리 · 로마 · 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로.
- data/city-design.json — 런던 design_note(근거 주소들) · card_ko.symbols, 상징에 「빨간 이층 버스」 하나 더(근거 https://en.wikipedia.org/wiki/Bus_transport_in_London — 검사기 상한 다섯). 세 세계 — 판타지 「시간의 대종이 울리는 강가의 고딕 왕도」(시간 여군주, 흰 피부 · 주근깨 · 구리빛 반묶음 · 늘씬 글래머 busty_slender · 프러시안 블루 브로케이드 궁정 코트에 고딕 창살 금실 + 숫자 없는 시계 문자판 금 펜던트 · 큰 다이아몬드 금 홀, 실루엣 noble_coat), 스팀펑크 「가스등 동화 런던」(도개교 신호수, 따뜻한 베이지 피부 · 크림 금발 볼륨 · 작은 굴곡 petite_curvy · 현수 쇠사슬 장식 물망초빛 연미복 + 쌍탑 놋쇠 모자핀 · 푸른 · 흰 유리 신호등, top_hat_coat), 사이버펑크 「두 세기 뒤 런던」(흰 요새 열쇠지기, 짙은 갈색 피부 · 로열 퍼플 셰그 · 탄탄한 굴곡 curvy_athletic · 까마귀 깃 결 직물의 두건 망토 + 흉벽 총안 깃 · 붉은 빛줄 옛 열쇠, hacker_cloak). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 · 파리 · 로마 · 뉴욕 사람(랜드마크 포함)과도 셋 이상 다르다. 판타지(빨강이 금빛 궁정 옷에서 다른 나라로 읽히지 않게 프러시안 블루 · 금 · 포틀랜드 상아, 루비는 보석에만) · 스팀펑크(실크해트 연미복이 빨강이면 근위병 · 서커스 단장이라 다리의 파랑 · 흰색 · 놋쇠)만 세계 palette. 까마귀는 생물이라 망토 재질로만, 빅벤 문자판 글귀 · 숫자는 글자라 싣지 않았고, 옛 스모그 안개는 날씨표에 넣지 않았다.
- data/city-life.json — 런던 계절 넷 · 날씨 넷(지나가는 비 · 잿빛 흐린 날 · 여름 더위 · 드문 눈 — 근거 https://en.wikipedia.org/wiki/London · https://en.wikipedia.org/wiki/Climate_of_London), 생활 장면 열둘(애프터눈 티 · 퇴근길 펍 · 튜브 출퇴근 · 이층 버스 맨 앞자리 · 버러 마켓 · 템스 남쪽 강변 · 리틀 베니스 좁은 배 · 하이드 파크 접이 의자 · 채링 크로스 로드 헌책방 · 테라스 하우스 현관 계단 · 운하 갑문 옆 캠던 마켓 · 피시 앤드 칩스). 근거는 위키백과(있는지 · 내용을 API 로 확인). 받침은 다른 도시가 쓰는 장소만(이층 버스는 subway_car).
- data/world-props.json — 소품 넷(애프터눈 티 차림 tea_set · 맥주 한 잔 pint · 피시 앤드 칩스 fish_chips · 줄무늬 접이 의자 deckchair)을 세 세계 함께 더함.
- data/casual-own.json — 런던 뿌리 「매일 같은 시각 도시의 일과를 지키는 오래된 손」(빅벤 대종 · 페니로 맞추는 대시계 · 배가 먼저인 타워 브리지 · 런던 탑 열쇠 의식, story), 세계마다 직업: 시간을 울리는 대종지기(stand_use · sig_both) · 타워 브리지 도개교 신호수(light_check · sig_raise) · 흰 요새 열쇠지기(stride_prop · sig_hold). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 다섯 → 넷, 이름 표에 런던 상표 · 사유 건물 · 구단 · 꾸민 인물 · 실존 인물(Harrods · Burberry · Liberty · London Eye · Shard · Routemaster · Sherlock · Paddington · Victoria · Elizabeth · Pugin · Big Ben …). tests/image-claim.cjs — 몫 차례에 런던 셋 · 빈 자리 33. tests/dex-screen.cjs — 설계된 도시 여섯.
- 남은 것: 기본 화풍 낱말 수는 판타지 1111 · 스팀펑크 1100 · 사이버펑크 963(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다).

## 2026-11-21 · claude · 파리 설계 — 시안
- 사용자 「파리 설계해줘」. 로마 · 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로.
- data/city-design.json — 파리 design_note(근거 주소들) · card_ko.symbols, 상징은 다섯 그대로(검사기가 3~5개라 사크레쾨르 · 오스만 대로는 세계 글에만). 세 세계 — 판타지 「장미창이 타오르는 강 위의 빛의 왕도」(대성당 장미창의 빛 공주, 도자기빛 피부 · 금발 옆 넘긴 긴 머리 · 버들 곡선 · 장미창 창살 스테인드글라스 치마 판 + 장미창 금 브로치 · 작은 장미창을 인 금 홀, 실루엣 silk_sorceress), 스팀펑크 「가스등 벨 에포크 파리」(철탑 거리 아가씨, 따뜻한 베이지 피부 · 철회색 바깥말이 단발 · 작고 풍만한 몸 · 철탑 격자 보디스 + 철탑 머리핀 · 장미창 빨강 양산, crinoline_cage), 사이버펑크 「두 세기 뒤 파리」(가라앉지 않는 빛의 강 수위 지휘관, 청동빛 갈색 피부 · 진홍 올백 · 단단한 굴곡 몸 · 옛 지하철 입구 아르누보 덩굴 깃 + 강물결 빛 치마 판 · 손바닥 위 빛의 은빛 범선, corporate_sleek). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 · 로마 · 뉴욕 사람(랜드마크 포함)과도 셋 이상 다르다. 체형은 셋 다 굴곡형(willowy_curvy · petite_voluptuous · strong_curvy — 로마 · 뉴욕과 안 겹침). 판타지만 세계 palette(사파이어 · 금 · 석회암 크림, 루비는 유리에만). 표어는 글자라 그림에 싣지 않았고, 가고일은 생물이라 쓰지 않았다. 「아연 지붕」 은 근거를 못 찾아 지시문엔 blue-grey mansard roofs.
- data/city-life.json — 파리 계절 넷 · 날씨 넷(가랑비 · 갑작스러운 소나기 · 폭염 · 가벼운 눈 — 근거 https://en.wikipedia.org/wiki/Climate_of_Paris), 생활 장면 열둘(카페 테라스 크루아상 · 빵집 바게트 · 센강 헌책 노점 · 샹드마르스 피크닉 · 지하철 출퇴근 · 테르트르 광장 화가들 · 유리 지붕 파사주 · 시테섬 꽃시장 · 뤽상부르 팔각 연못 · 센강 유람선 · 파리 플라주 모래사장 · 망사르드 다락방). 근거는 위키백과(있는지 · 내용을 API 로 확인). 받침은 다른 도시가 쓰는 장소만.
- data/world-props.json — 소품 넷(크루아상 croissant · 바게트 baguette · 이젤 easel · 꽃다발 flowers)을 세 세계 함께 더함.
- data/casual-own.json — 파리 뿌리 「흔들려도 가라앉지 않는 배」(문장의 은빛 범선 · 센강 뱃사공 조합 · 표어, story), 세계마다 직업: 은빛 배 길드 강 기수(stride_prop · sig_hold) · 센강 증기선 도선사(counter_work · sig_both) · 떠 있는 강 구역 부력 관리사(half_kneel_use · sig_hold). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 여섯 → 다섯, 이름 표에 파리 상표 · 실존 인물(Eiffel · Dior · Louis Vuitton · Hermès · Cartier · Ladurée · Moulin Rouge · Galeries Lafayette · PSG · Napoleon · Marie Antoinette · Guimard · Haussmann …). tests/image-claim.cjs — 몫 차례에 파리 셋 · 빈 자리 33. tests/dex-screen.cjs — 설계된 도시 다섯.
- 남은 것: 기본 화풍 낱말 수는 판타지 1063 · 스팀펑크 1090 · 사이버펑크 1011(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다).

## 2026-11-21 · claude · 로마 설계 — 시안
- 사용자 「로마 설계해줘」. 뉴욕 · 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로.
- data/city-design.json — 로마 design_note(근거 주소들) · card_ko.symbols, 상징은 넷 그대로. 세 세계 — 판타지 「일곱 언덕의 황금 영원 왕도」(빛의 분수 소원 무녀, 올리브 피부 · 청동빛 인어 물결머리 · 풍만 · 분수 물줄기 층 치마 + 판테온 오쿨루스 금 목걸이 · 가리비 금잔, 실루엣 tide_oracle), 스팀펑크 「가스등 로마 수도교 거리」(수도교 분수 기관사, 흰 피부 · 주근깨 · 와인빛 한쪽 땋은머리 · 서양배 굴곡 몸 · 투기장 아치 치맛단 + 놋쇠 월계수 잎 · 가리비 손잡이 밸브 렌치, mech_gauntlet), 사이버펑크 「두 세기 뒤 로마」(황금 이정표 빛길 길잡이, 그을린 금빛 피부 · 물빛 단발 · 모래시계 몸 · 돔 격자 빛의 토가 랩 + 빛 월계관 · 길 지도 홀로그램 구슬, smart_wrap). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 · 뉴욕 사람(랜드마크 포함)과도 셋 이상 다르다. 체형은 셋 다 굴곡형. 판타지만 세계 palette(테라코타 · 황금이 화려한 드레스에서 붉은 금빛으로 몰리지 않게 분수 청록). SPQR 은 글자라 그림에 싣지 않았고, 트레비의 해마 · 트리톤 · 늑대는 생물이라 쓰지 않았다. 어휘는 이 공방 lib/look-spec.js 에 있는 열쇠만(원소 · game 표에만 있는 jet_black · braided_crown 같은 열쇠는 지시문에 열쇠 그대로 나가서 뺐다).
- data/city-life.json — 로마 계절 넷 · 날씨 넷(지나가는 비 · 불볕더위 · 가을 큰비 · 드문 눈 — 근거 https://en.wikipedia.org/wiki/Rome 기후), 생활 장면 열둘(바 카운터 에스프레소 · 젤라토 · 캄포 데 피오리 아침 시장 · 트라스테베레 트라토리아 · 트레비 동전 · 골목 스쿠터 · 스페인 계단 · 테베레 강변 · 옥상 아페리티보 · 골목 위 빨래 · 보르게세 공원 호숫가 · 오스티아 바닷가). 근거는 위키백과(있는지 · 내용을 API 로 확인). 받침은 다른 도시가 쓰는 장소, 빨래는 drying_terrace 를 처음 썼다.
- data/world-props.json — 소품 셋(에스프레소 espresso · 젤라토 gelato · 스쿠터 scooter)을 세 세계 함께 더함.
- data/casual-own.json — 로마 뿌리 「영원의 도시로 다시 돌아오게 하는 것」(트레비 동전 · 아쿠아 비르고 · 황금 이정표, story), 세계마다 직업: 소원 분수 무녀(light_check · sig_raise) · 수도교 분수 기관사(half_kneel_use · sig_hold) · 황금 이정표 빛길 길잡이(stand_use · sig_both). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 일곱 → 여섯, 이름 표에 로마 상표 · 구단 · 실존 인물(Vespa · Fiat · Ferrari · Fendi · Bulgari · Nutella · Peroni · Lazio · AS Roma · Bernini …). tests/image-claim.cjs — 몫 차례에 로마 셋 · 빈 자리 33. tests/dex-screen.cjs · tests/screen.cjs — 설계된 도시 넷.
- 남은 것: 기본 화풍 낱말 수는 판타지 1052 · 스팀펑크 1071 · 사이버펑크 987(tests/prompt-sections.cjs 상한 1150 안, 줄이지 않았다).

## 2026-11-21 · gpt · 경복궁 판타지 대표컷 4번 도감 설명 갱신
- data/city-design.json — 적갈색 반묶음 물결머리, 녹색 눈, 단청 공포 견갑과 한삼 소매를 도감에 반영.

## 2026-11-21 · gpt · 뉴욕 판타지 대표컷 4번 도감 설명 갱신
- data/city-design.json — 대표컷의 와인빛 긴 땋은 머리, 조개 부채 관, 현수교 아치 치맛자락을 도감에 반영.

## 2026-11-20 · claude · 체형 — 마른 체형 일곱 자리를 굴곡형으로
- 사용자 「도시공방은 마른 체형이 많은가」 → 24명 가운데 마르게 읽히는 체형이 12명이었다 → 「1번으로 하는데 마른체형도 일부 넣어줘. slender 같은거」.
- data/city-design.json — 서울 판타지 · 성곽 스팀펑크 · 뉴욕 판타지 tall_statuesque → tall_curvy, 경복궁 판타지 · 한강다리 사이버펑크 · 도쿄 스팀펑크 petite → petite_curvy, 경복궁 사이버펑크 tall_statuesque → willowy_curvy(look.why 체형 말도 같이). slender 둘 · lanky 하나 · lean_toned 둘은 그대로 — 마른 쪽 5 · athletic 4 · 굴곡 15.
- lib/look-spec.js · tools/port-look-spec.cjs — 도시 체형 표에 굴곡 다섯(tall_curvy · strong_curvy · petite_curvy · pear_curvy · willowy_curvy)을 원소 표에서 옮김. 표에 없으면 core 블록이 글을 못 덮어 지시문에 열쇠가 그대로 나갔다. prompt.html look-spec ?v=13.

## 2026-11-20 · claude · 일상컷 고개 · 몸 좌우 — 몸 · 고개 · 시선을 따로, 묶음 안에 좌우를 나눔
- 사용자 「도시공방 경복궁 사이버펑크야. 고치려면 공통으로 고쳐줘」. GPT 검토 — 일상컷 시선은 정해도 고개 좌우를 안 적어 모델이 참고 그림 각도를 그대로 따라 컷마다 같은 각도였다. 네 공방 같이 고침.
- lib/casual-tree-v2.js — turns · turnText · spreadTurns 추가(scene.turn = 코끝이 향하는 화면 쪽 front · left · right). 몸 · 고개를 따로 적고 「각도는 이 줄을 따르고 붙인 그림을 따르지 않는다」 한 줄. 옆모습에서 두 손 쓰임이 같으면 turn 쪽을 본다.
- 계획기 — 분위기 단계 끝에 spreadTurns 로 묶음 안 좌우를 고르게 나눔(자유 설계 칸 빼고). 조립부 COMPOSITION 줄이 turnText 를 씀, SCENE_V2 에 turn. ?v= 올림.
- lib/casual-tree-v2.js — 도시 사본이 옛 판이라 casual-tree-v2 검사가 실패하던 것을 원소 · 삼국지 사본과 같게 맞춤.

## 2026-11-20 · claude · 뉴욕 설계 — 시안
- 사용자 「city-atelier 에 뉴욕 설계해줘」. 도쿄 꼴을 따른 시안(시험 그림 전). 다른 도시는 그대로.
- data/city-design.json — 뉴욕 en 「New York City」 → 「New York」(머리 줄이 「the city of New York City」 로 겹쳐서). 상징에 노란 택시 하나 더(근거 https://en.wikipedia.org/wiki/Taxis_of_New_York_City), card_ko.symbols · design_note(근거 주소들). 세 세계 — 판타지 「횃불 수호상의 새벽 항구 왕도」(항구의 빛을 다스리는 여군주, 짙은 갈색 피부 · 고금빛 곱슬 · 큰 키 · 일곱 빛살 티아라 · 녹청 비단 · 빅 애플 사과 홀), 스팀펑크 「가스등 브라운스톤 거리」(고가 증기 철로 · 놋쇠 케이블 돌탑 다리 · 돌탑 꼭대기 비행선 계류탑 — 엠파이어 스테이트 빌딩 첨탑이 원래 계류탑으로 지어진 사실, 이름은 지시문에 안 씀 · 흰 피부 · 테라코타 올림머리 · 곡선 몸 · 다리 케이블 재킷 · 횃불 모양 놋쇠 등), 사이버펑크 「두 세기 뒤 뉴욕」(1마일 아콜로지 · 하늘 택시 길 · 빛의 돔 아래 숲 협곡 · 올리브 피부 · 코발트 땋은머리 · 탄탄한 몸 · 아르데코 계단식 깃 · 택시 노랑 빛). 얼굴 칸 다섯이 세 세계끼리 모두 다르고 서울 · 도쿄 사람(랜드마크 포함)과도 셋 이상 다르다. 판타지 · 스팀펑크만 세계 palette(「taxi yellow」 가 지시문에 실려 현대로 끌어서).
- data/city-life.json — 뉴욕 계절 넷(봄 · 한여름 · 가을 단풍 · 겨울) · 날씨 다섯(지나가는 비 · 무더위 · 여름 뇌우 · 눈 · 노이스터), 생활 장면 열둘(지하철 만원 객차 · 한밤의 보데가 · 센트럴 파크 잔디밭 피크닉 · 브라운스톤 현관 계단 · 한여름 밤 비상계단 · 항구 연락선 · 코니아일랜드 해변 · 할랄 카트 · 조각 피자 · 극장가 분장실 · 코인 빨래방 · 새해 전야 볼 드롭). 근거는 위키백과(있는지 API 로 확인). 받침은 대부분 다른 도시가 쓰는 것, 연락선 travel_ferry · 해변 water_beach · 빨래방 street_laundromat 은 트리에 있는 장소를 처음 썼다. 비상계단은 「fire escape」 의 escape 가 일상컷 검사의 cape 에 걸려 「fire stair」 로.
- data/world-props.json — 소품 셋(조각 피자 slice · 길거리 음식 street_food · 빨래 바구니 laundry_basket)을 세 세계 함께 더함.
- data/casual-own.json — 뉴욕 뿌리 「자유의 여신상의 횃불 — 바다를 건너온 이들을 맞는 도시」(story), 세계마다 직업: 항구 횃불 등대지기(light_check · sig_raise) · 이민 섬 등록 홀 안내원(counter_work · sig_both) · 하늘 택시 승강장 착륙 유도원(half_kneel_use · sig_hold). 계획기가 90번을 세 세계 다 짠다.
- tests/prompt-city.cjs — 설계 미정 여덟 → 일곱, 이름 표에 뉴욕 사유 건물 · 상표(Empire State · Chrysler · Rockefeller · Yellow Cab · Broadway …). tests/image-claim.cjs — 몫 차례에 뉴욕 셋 · 빈 자리 33. tests/dex-screen.cjs · tests/screen.cjs — 설계된 도시 셋.
- 남은 것: tests/prompt-sections.cjs 낱말 상한(950)은 전부터 서울 판타지(1006)로 걸려 있다. 뉴욕은 기본 화풍에서 판타지 974 · 스팀펑크 1021 · 사이버펑크 901 — 둘이 상한을 넘는다(줄이지 않았다).

## 2026-11-20 · gpt · 도쿄 스팀펑크 도감 설명 갱신
- data/city-design.json — 대표컷 1번의 자주색 리본, 은행잎 장식 치마와 벚꽃 놋쇠 랜턴을 도감에 반영.

## 2026-11-20 · gpt · 도쿄 사이버펑크 도감 설명 갱신
- data/city-design.json — 대표컷 3번의 노을분홍 단발, 연보랏빛 눈과 도리이에서 따온 깃을 도감에 반영.

## 2026-11-20 · gpt · 서울 판타지 도감 설명 갱신
- data/city-design.json — 대표컷 3번의 땋은 올림머리, 연보랏빛 눈, 산봉우리 흉갑을 도감 설명에 반영.

## 2026-11-20 · gpt · 서울 스팀펑크 도감 설명 갱신
- data/city-design.json — 대표컷 3번의 구리빛 긴 웨이브와 한강철교 트러스 여밈을 도감 설명에 반영.

## 2026-11-20 · claude · 서울 스팀펑크 — 시계탑을 성문 위에서 한강 증기선 나루로
- 사용자 「스팀펑크에서 광화문 뒤에 시계탑 위치 옮겨야겠는데? 총독부 같잖아..」 → 「1번으로」. 세계 글(en · ko)의 「a great clocktower rising above the old stone city gate」 → 성문은 뒤에 큰 건물 없이 하늘과 산, 시계탑은 한강 증기선 나루(「a brass-faced clocktower over the steamboat pier」). 장면 airship 의 「the clocktower gate」 · 장면 clocktower 의 글(열쇠는 그린 그림 기록이 가리켜 그대로)도. 본보기 지시문도 맞췄다. 이미 그린 서울 스팀펑크 그림은 그대로.

## 2026-11-20 · claude · 세계컷 GPT 설계 — 칸 채우기(삼국지에서 옮김)
- 사용자 「세계컷에서 gpt 담당컷을 얼마나 풀어놨어? 삼국지공방이랑 비교해서」 → 「아.. 그러니 이상하지. 칸 채우기로 옮겨줘」. 전엔 열린 주문(맡은 쪽이 얼굴 · 헤어스타일 · 자세 · 장면 · 빛까지 지어 제 지시문을 씀)이라 우리 화풍 · 얼굴 규칙이 GPT 장엔 안 닿았다. 이제 삼국지 2026-11-18 · 11-19 판처럼 우리 설계 지시문을 통째로 주고 칸만 채운다 — lib/prompt-spec.js WORLD_FREE.fill · msg, lib/prompt-city.js worldFillTemplate · worldFillErrors · worldFillPicks · buildWorldFree, tools/world-fill-check.cjs(새). 도시 꼴: 머리 줄의 무기 → 소품, 카드마다 실루엣 설계값이 없어 실루엣 칸은 Costume 줄 뒤 새 줄 · 목록은 그 세계 실루엣 열아홉 전부(우리 것 뺌 없음). 지시문 묶음 INDEX · docs/IMAGE_AUTOMATION.md 0-1 · tests/prompt-city.cjs 를 맞췄다.

## 2026-11-20 · claude · 기본 화풍 kr_drawn_rim_dewy v2 — 얼굴 문장 한 줄
- 사용자 「기본화풍 v2로 올려줘」. text · casual 의 「A recognisably drawn face with gently simplified anatomical structure.」 → 「A painterly face with naturally observed facial anatomy, subtle eyelid structure, and soft, realistic shading across the nose and cheeks.」, 나머지 칸은 v1 그대로, current v2. 서울 세 세계 세계 그림 · 일상컷 스물넷 시험. 머리 문구 교체 시험은 효과가 흔들림 안이라 안 넣었다. 본보기 지시문(docs/samples) 그 문장도 바꿨다. 이미 그린 그림은 v1 기록 그대로.

## 2026-11-20 · claude · 화풍 셋만 — 기본 · 회화적 콘셉트 아트 · 실사 유화
- 사용자 「실사유화 화풍도 우선 key 로 등록해줄래? 지금 기존화풍, 실사유화, 너가 만든 회화적 콘셉아트 3개만 남기고 다른건 지워줘」. data/style.json — real_oil(실사 유화, 시험 열쇠 oil_real_try 의 화풍 글 · 세계 공통 빛 줄 · avoid) 더하고, kr_drawn_rim_dewy(기본) · painterly_concept 말고 열여덟 화풍(원소에서 옮긴 임시 · 내린 화풍, 등록된 그림 없음)을 지웠다. 시험 때 얼굴 줄 · 표정 줄 덧붙임과 사이버펑크 비 젖은 빛은 장면 몫이라 넣지 않았다. tests/register-images.py · tests/screen.cjs 가 지운 화풍(game_keyart · retired)을 쓰던 곳을 고쳤다.

## 2026-11-20 · claude · core v7 — 얼굴 낱말에서 크기 말을 빼고 모양 · 방향만
- 사용자 「이건 공통적으로 손볼 부분 같긴한데」 → 「이건 지금 고치자」 → 「옮겨주고」. style-atelier core/v7 — VOCAB_EN 얼굴 낱말(face_shape · eyes · brows · nose · lips 스물다섯)과 FACE_DESIGN.eye_size 에서 크기 말을 빼고, 이목구비 크기는 자연스러운 범위 · 차이는 눈꼬리 · 눈썹 곡선 · 입꼬리 · 턱선으로(예: square_soft · broad_soft · wide_smile · round_large). 도시 공방 해치 스팀펑크 시험에서 각진 얼굴 · 넓은 코 · 넓은 입 · 긴 아몬드 눈이 겹쳐 넓적하게 나왔다. 열쇠는 그대로 — 이 공방 lib/ 끝 core 블록을 node core/sync.cjs 로 v7 로 옮겼다(블록은 손으로 고치지 않는다). 이미 그린 그림은 그대로.

## 2026-11-20 · claude · 해치 스팀펑크 얼굴 — 넓적함 걷기
- 사용자 「1번은 예쁜 서양인이고, 2번은 얼굴이 엄청 넓적하고 눈매는 길어서 못생기게 나왔는데. 원인이 뭘까?」 → 머리색 · 얼굴 시험(머리색 문구 셋 × 세 번, 얼굴 칸을 바꾼 것과 안 바꾼 것) → 「염색 효과는 없어도 되겠네. 얼굴만 바꾸자」.  
  data/city-design.json 해치 스팀펑크 look.face — 눈 almond_wide → droopy_soft, 눈썹 straight_thick → soft_round, 코 broad_soft → straight_narrow(처음 승인안으로 — 검사기에 맞추느라 넓은 코로 바꿨던 칸), 입 wide_smile → small_bow, 눈색 emerald → hazel, why 글도. 얼굴형 square_soft 는 그대로(서울 스팀펑크 여섯 사람이 얼굴형을 하나씩 나눠 가진다). 시험에서 얼굴 칸을 바꾸자 아홉 장 모두 넓적함 · 긴 눈매가 빠졌고, 머리색 「hair dyed …」 는 장마다 효과가 갈려 넣지 않았다. 검사기 통과.

## 2026-11-20 · claude · 그림 등록 실패 고침 — 등록 검사의 카드 수
- 사용자 「그림 등록 한 번 실패했다는데 확인좀해줄래?」. 랜드마크 넷(5c9c30d)을 더한 뒤 「그림 등록」 워크플로의 검사 단계(tests/register-images.py)가 카드 열쇠 수를 11 로 박아 두어 실패했다(등록 단계는 성공, 되커밋만 건너뜀). 그 사이 해치 사이버펑크 11장은 8417fb1 로 등록부에 들어와 있고, 등록기 --check 로 그림 저장소 47장과 등록부가 맞는다.  
  tests/register-images.py — 카드 열쇠를 설계표(도시 + <도시>-<랜드마크>)에서 지어 견준다(수를 박지 않는다).

## 2026-11-20 · claude · 서울 랜드마크 넷 더함 — 경복궁 · 남산 송신탑 · 한강철교 · 한양도성
- 사용자 「응 이대로 해줘」(랜드마크 카드 설계 승인). 서울 landmarks 에 해치 뒤로 넷을 더해 카드 다섯이 됐다. 세계마다 다른 사람(궁중 무희 · 연회 안주인 · 유리 돔 궁궐 관리자 / 봉화 정령 · 전파 등대지기 · 궤도 승강 칸 조종사 / 살아 있는 나무다리 수호자 · 기관사 · 자기부상 관제사 / 성곽 순찰 기사 · 가스등 문지기 · 빛 방어막 관리자).
  data/city-design.json — landmarks 열쇠는 검사기 규칙(소문자 · 숫자만, '_' 없음)대로 gyeongbokgung · namsantower · hangangbridge · citywall(설계 문서의 namsan_tower 등은 카드 열쇠 꼴 때문에 붙여 씀). 남산 송신탑 en 은 "Namsan"(조립기가 en 을 그림 지시문 첫 줄에 실어 탑 이름이 새지 않게). 한강철교 사이버펑크 코를 broad_soft → small_button 으로(세 세계 얼굴 칸 셋 이상 다름 규칙).
  tests/image-claim.cjs · tests/globe-screen.cjs — 카드 수가 박혀 있던 기대값(잠금 차례 · 서울 무대 랜드마크 줄 1 → 5)을 맞춤.

## 2026-11-20 · claude · 실내 장면의 계절 — 창밖 · 옷차림으로만
- 사용자 「계절표현이 보니까 나무들로 되있던데, 실내공간까지 따라들어오는것 같아」. 일상컷 계절 줄(생활 장면표 seasons 의 en — 벚꽃 · 낙엽 · 은행잎 …)이 장소와 상관없이 실려 찜질방 · 고시원 같은 실내에도 나무 · 꽃잎이 들어왔다(날씨는 실내에서 이미 뺐다).  
  lib/prompt-city.js — 실내(생활 장면 indoor, 일반 장소는 장소 특징 indoor · timed — 계획기 placeRules 와 같은 기준)면 계절 이름만 싣고 lib/prompt-spec.js CASUAL.life.seasonIn(「창밖이나 옷차림으로만 — 방 안에 꽃 · 꽃잎 · 낙엽 · 눈 · 나무 없음」). 바깥 장면은 그대로. tests/casual-plan.cjs 계절 줄 단언을 실내 · 바깥으로 나눔. prompt.html ?v — prompt-spec · prompt-city 하나씩.

## 2026-11-20 · claude · 크게 보기에서 넘기기 · 즐겨찾기
- 사용자 「도감에서 크게보기때도 옆으로 넘기는 기능이랑, 다른 공방에도있는 즐겨찾기 버튼 붙여줘」. lib/city-view.js — 크게 보기(맞춤일 때)에서 옆으로 밀기 · ←→ 로 앞뒤 장(크게 보기는 열린 채), 아래 막대에 몇째 장 · 즐겨찾기 단추. 한 장 화면의 앞 장 · 뒤 장 사이에도 즐겨찾기 단추(♡/♥, aria-pressed) — 공방 모음 공용 lib/favorites.js, a = 'city', 지금 보이는 그림 한 장(세계 그림 · 일상컷 · 랜드마크 카드도), 담고 빼면 잠깐 알림.  
  낱말 card.zoom.hint, 꼴 lib/room.css(막대가 폰에서 줄바꿈하지 않게). ?v — words 38 · room.css 8 · city-view 5 · dex-view 6. tests/globe-screen.cjs — 크게 보기 → · 밀기 · 몇째 장 · 즐겨찾기 담기/빼기 · 저장 칸. 공방 모음 favorites.html 에 도시공방(칩 · 문).

## 2026-11-20 · claude · 랜드마크 카드 — 서울 해치 (도시 카드 한 장 더)
- 사용자 「랜드마크같은게 좋지 않을까?」 · 「10장으로 해줘」(일상컷 열 장) · 「사는 세계를 다 할까 그럼」(세 세계 모두) · 「해치 먼저」(서울 해치부터).  
  설계표 cities[].landmarks[](key · ko · en · src · persona · worlds.<세계> — 도시 세계와 같은 꼴), 서울에 haechi 해치 세 세계. tools/city-design.py 가 랜드마크를 검사(열쇠 꼴 · 세 세계 · 금지 낱말 · 짧은 글 · 얼굴이 자기 세 세계끼리 · 같은 도시 사람 셋과 달라야 함 FACE_DIFF_MIN 3, 설계 전 도시의 랜드마크는 오류).  
  카드 열쇠 `<도시>-<랜드마크>`(seoul-haechi) — 파일 seoul-haechi_<세계>_<화풍>_f(_casualN).webp · 등록 img['seoul-haechi'] · 기록 records/seoul-haechi/ · 잠금 seoul-haechi_<세계>. 차례: 도시 세 세계 → 그 도시 랜드마크(각 세 세계) → 다음 도시. 한 몫 = 세계 그림 1 + 일상컷 10, 90번 없음.  
  지시문: 세계 그림 첫 줄 CONCEPT_LANDMARK(<랜드마크>를 의인화, <도시>의 랜드마크), 일상컷은 부모 도시 생활 장면 · 계절 · 날씨 · 「an ordinary day in <도시>」. 계획기는 같은 도시 카드끼리 덜 쓴 장면부터(그린 기록 + 아직 안 그린 계획 파일). 서울 · 도쿄 지시문 36개씩은 바꾸기 전과 글자까지 같다.  
  화면: 생성기 카드 고르개에 「서울 › 해치」(?card=seoul-haechi) · 도시 무대 세 사람 아래 랜드마크 줄(.th-marks, 랜드마크 없는 도시는 숨김) · 랜드마크 한 장 보기(?city=seoul&card=seoul-haechi&pic=…) · 도감 도시 줄의 일상컷 수에 랜드마크 일상컷 합산.  
  IMAGE_RULES.md 2절 · docs/IMAGE_AUTOMATION.md 1절 · AGENTS.md 3절에 랜드마크 카드 규칙을 적음.
- 마무리 검토 고침 — lib/prompt-city.js row(): 랜드마크 세계가 부모 도시 세계의 palette · own_vocab 을 물려받음(자기 것이 있으면 그것) · prompt.html ?v 올림(prompt-spec 43 · prompt-city 42) · lib/dex-view.js freshFiles · index.html markSeen 이 랜드마크 그림도 셈 · tools/casual-plan.cjs 랜드마크는 90 컷 없음 말 안 함 · tools/register-images.py 랜드마크 casual90 거절 · tests/prompt-sections.cjs 랜드마크 열쇠.

## 2026-11-20 · claude · 도시별 말 own_vocab — 공용 판타지 말에서 서울 것을 뺌
- 도쿄를 설계하자 공용 판타지 말의 서울 것(노리개 · 수호수 문장 · 단청 · 청자 잔 · 엘프 달빛 고목 도시 일상컷 세계 줄)이 도쿄 지시문에 실렸다 → 사용자 「그렇게 해」(서울 것을 공용에서 빼고 서울에만).  
  설계표 worlds.<세계>.own_vocab = { marks, costume, casual_world, props } — 있으면 공용 표지 · 세계 옷 말투 · 일상컷 세계 줄 · 소품 글 대신(lib/prompt-city.js ownVocab). 서울 판타지에 지금 글 그대로를 옮겼다 — 서울 지시문 36개(세계 그림 셋 · 자유 설계 셋 · 일상 서른)가 바꾸기 전과 글자까지 같다.  
  공용은 어느 도시에나: 수호수 문장 → 문장(heraldic emblems), 노리개 → 보석 펜던트, 일상컷 판타지 세계 줄 → 서양 신화 세계의 도시(돌 · 나무 · 빛나는 무늬 · 비단 · 초롱), 청자 술잔 → 유약 도자기 술잔. tests/prompt-city.cjs · casual-plan.cjs 가 own_vocab 을 본다.

## 2026-11-20 · claude · 도쿄 설계 — 세 세계 · 캐릭터만의 컷 · 생활 장면 열여섯
- 사용자 「한 도시씩 검토」 → 검토한 시안대로, 사이버펑크는 「사이버펑크에서 사나운 인상대신 아련한 느낌에 몸매는 좀 글래머러스하게 가보자」. 서울은 그대로.
  data/city-design.json 도쿄 — card_ko(상징 한 줄) · design_note(시안 — 시험 그림 전) · 세 세계(세계 글 · 장면 셋 · look · hold · motif · card_ko). 세 사람 모두 일본인 성인 여성, 얼굴 칸 다섯 · 머리색 · 체형 · 헤어스타일이 세계끼리 다 다르고 서울 셋과도 겹치지 않게.
  판타지 「벚꽃 만의 달빛 왕도」(서양 신화 세계의 섬 왕도 · 주홍 수정 아치 문 · 빛나는 벚나무 · 은행잎 초롱 · 붉고 흰 격자 주문 첨탑 — 벚꽃 문 무녀 기사, 하트형 · 은백 히메컷 · 가는 몸, 세계 palette 는 벚꽃 분홍 · 달빛 은 · 쪽빛, 주홍은 문에만 — 빨강 · 금이 중국풍으로 읽히지 않게).
  스팀펑크 「가스등 긴자 벽돌 거리」(메이지 긴자 벽돌 거리 · 가스등은 실제 역사, 근거 https://ko.wikipedia.org/wiki/긴자 — 시계탑 대로 · 말이 끄는 궤도 마차 · 비행선 · 놋쇠 격자 계류탑 — 다이쇼 하이칼라, 갸름한 얼굴 · 삼나무빛 반묶음 · 작은 몸).
  사이버펑크 「두 세기 뒤 도쿄만」(떠 있는 아콜로지 섬 · 자기부상 고리 · 겹겹 빛의 광장이 된 시부야 스크램블 · 도리이 · 벚꽃 홀로그램 · 빛기둥 탑 — 공중 무대 드론 연출가, 둥근 얼굴 · 노을분홍 울프컷 · 모래시계 몸 · 아련한 인상에 그리운 듯한 표정). 세계 글 · 장면에 비를 박지 않았다.
  판타지 · 스팀펑크 글에 그 세계 금지 낱말 없음, 세계 그림 지시문은 낱말 950 아래(판타지 923 · 스팀펑크 943 · 사이버펑크 867).
- data/casual-own.json 도쿄 — 뿌리 「도시의 밤을 밝히는 사람」(가미나리몬 큰 초롱 · 도쿄 타워 불빛), 세계마다 직업: 벚꽃 문 초롱지기(light_check · sig_raise) · 긴자 가스등 점등원(stride_prop · sig_hold) · 공중 무대 드론 연출가(stand_use · sig_both). 계획기가 90번을 세 세계 다 짠다.
- data/city-life.json 도쿄 — 계절 다섯(봄 벚꽃 · 쓰유 · 한여름 · 가을 은행잎 · 겨울) · 날씨 다섯(쓰유 비 · 지나가는 비 · 후텁지근함 · 태풍 언저리 · 드문 눈), 생활 장면 열여섯(시부야 스크램블 출퇴근길 · 야마노테선 만원 전철 · 신주쿠 골든가이 · 동네 센토 · 한밤의 편의점 · 쓰키지 장외시장 · 아사쿠사 나카미세 · 스미다 공원 벚꽃놀이 · 스미다강 불꽃놀이 유카타 · 메이지 신궁 하쓰모데 · 아키하바라 메이드 카페 · 하라주쿠 다케시타 거리 · 게임 센터 · 진보초 헌책방 거리 · 여름 워터파크 · 캡슐 호텔의 밤). 근거는 위키백과 문서(있는지 API 로 확인). 란제리풍(캡슐 호텔) · 수영복(워터파크) · 역할극(메이드 카페) · 게임 코스프레(게임 센터)를 받는 장면이 있다.
  오모이데요코초 · 오다이바 해변 · 옥상 비어가든은 근거가 약해 뺐다(오모이데요코초는 위키백과 문서가 없어 골든가이로, 오다이바는 수영이 늘 되는 곳이 아니라 도쿄 서머랜드 워터파크로).
- tests/prompt-city.cjs — 세계 그림 · 일상컷 단언을 설계된 도시 모두(서울 · 도쿄)로, 설계 미정 아홉 → 여덟, 상표 이름에 Tokyo Tower · Skytree. tests/casual-plan.cjs — 도쿄 세 세계 열 장 · 직업컷 자세. tests/dex-screen.cjs · screen.cjs — 설계 전 예를 도쿄 → 베이징, 설계된 도시 수. tests/image-claim.cjs — 빈 자리는 실제 설계표 + 빈 등록부로(서울 그림이 다 올라와 「빈 자리 33」 이 이미 깨져 있었다), 도쿄 33 · 차례 여섯.
- 남은 것: tests/prompt-sections.cjs 는 전부터 서울 판타지 낱말 979 로 걸린다(도쿄는 셋 다 950 아래로 통과). 판타지 공용 표지에 서울 것(노리개 · 수호 짐승 문장)이 있어 도쿄 판타지 지시문에도 실린다 — 공용 말이라 손대지 않았다.

## 2026-11-20 · claude · 세계컷 실루엣 세 세계 열아홉씩
- 사용자 「판타지랑 스팀펑크도 다 다시 짯으면 좋겠는데, 사이버펑크도 조금 더 추가하고」 → 「사이버펑크도 19개까지」 → 「이대로 19개로 맞춰줘」. lib/prompt-spec.js 실루엣(열쇠는 그대로 — 기록 · 주소가 쓴다).  
  판타지: 원소 · 삼국지 열넷 중 일곱을 서양 하이판타지 · 미형으로 다듬음(ranger → 엘프 숲 순찰 · mage_robe → 대마법사 로브 · priestess → 달빛 무녀 예복 · crown_regalia → 궁정 여왕 드레스 · dragon_scale → 용기사 · winged → 하늘 기사 · elven_leaf → 숲 드루이드), 나머지 일곱 그대로, 새로 다섯(비단 마녀 드레이프 · 음유시인 · 그림자 무희 · 서리 마녀 · 물결 예언자).  
  스팀펑크: 넷을 밝은 가스등에 맞춰 다듬음(ballroom_gown → 가스등 무도회 드레스 · top_hat_coat → 연미복 마술사 · officer_greatcoat → 하늘 선장 외투 · clockwork_harness → 태엽 날개), 공업 쪽 다섯 포함 열은 그대로, 새로 다섯(오페라 디바 · 태엽 보디스 드레스 · 숙녀 발명가 · 서커스 단장 · 탐정 케이프). 코르셋 말은 그대로 안 쓴다.  
  사이버펑크: 여덟에 열하나(홀로그램 드레스 · 궤도 파일럿 슈트 · 사이버 아이돌 무대 · 스마트 직물 랩 드레스 · 경장 외골격 · 공중 배달 질주 · 은신 슈트 · 하이패션 런웨이 · 해커 망토 · 바이오 발광 드레스 · 구조대 슈트) — 특정 나라 옷은 없다. 판타지 · 스팀펑크 실루엣 글에 그 세계 금지 낱말 없음.

## 2026-11-20 · claude · 사이버펑크 — 비를 박아 두지 않기(서울은 그대로)
- 사용자 「사이버펑크에서 굳이 비오는 배경으로 안만들어도 될 것 같아」 → 「다른 나라 설계할 때 그렇게 하라는 거였어. 서울은 그대로 놔둬도 돼」 · 「비가 와도 되고 안와도 되고」.  
  모든 도시가 같이 쓰는 말에서만 비를 뺐다 — data/city-design.json 사이버펑크 표지(비 젖은 비옷 · 피부에 맺힌 빗방울 · 비 젖은 네온 골목 → 매끈한 반사 롱코트 · 피부와 코트에 어리는 홀로그램 빛 · 겹겹이 빛나는 도시 층) · 옷 말투(반사 비옷 → 반사 코트), lib/prompt-spec.js 사이버펑크 LIGHT 줄(wet raincoat → coat) · 실루엣 long_raincoat 의 글(반사 롱코트, 열쇠는 그대로). 서울 사이버펑크의 세계 글 · 장면 · motif 는 그대로(빗속 그대로).  
  새 도시 설계는 사이버펑크 세계 글 · 장면에 비를 박지 않는다 — 비는 와도 되고 안 와도 된다(생활 장면표의 계절 날씨 · 상황 「젖은 옷」 이 맡는다).

## 2026-11-20 · claude · 한 장에서 일상컷 보기 · 크게 보기
- 사용자 「도감에서 일상컷 못보네. 확대도 안되고」. 한 장(lib/city-view.js CardView)이 세계 그림 하나만 보였다 — 이제 세 세계의 세계 그림 · 일상컷(번호 차례, 캐릭터만의 컷 90 은 끝)을 다 넘긴다(앞 장 · 뒤 장 · 밀기 · ←→), 그림 바로 아래 그 세계 그림 줄(작은 그림 · 세계 / 번호 / 직업), 세계 단추, 「2 / 5」 세는 말. 그림을 누르면 크게 보기(화면 가득 · 그림을 누르면 두 배 반으로 끌어 옮기기 · 다시 누르면 맞춤 · Esc · 닫기).  
  known() 이 일상컷 주소도 받는다. 낱말 card.* (lib/words.js), 꼴 lib/room.css. ?v — words 35 · room.css 6 · city-view 3 · dex-view 3.  
  tests/globe-screen.cjs · dex-screen.cjs — 등록부를 늘 빈 것으로 준다(GPT 가 서울 사이버펑크를 올려 「그림 없음」 단언이 진짜 등록부에서 깨졌다). 그림 있는 판에 일상컷 셋을 더해 줄 차례 · 넘기기 · 줄에서 고르기 · 세계 단추 · 크게 보기를 본다.

## 2026-11-20 · claude · 서울 생활 장면 열여섯 더 — 열둘 → 스물여덟
- 사용자 「서울 장면 더 만들어서 넣어줘도 되잖아」 → 「서울 장면도 다 넣어주고」. data/city-life.json 서울에 노래방 · PC방 밤샘 · 고시원 작은 방 · 홍대 거리 공연 · 서울 코믹월드 행사장 · 대학로 소극장 분장실 · 한복 입고 고궁 나들이 · 이태원 밤거리 바 · 동대문 새벽 도매시장 · 성수동 공장 개조 카페 · 을지로 골목 노포 · 명동 길거리 음식 · 북한산 등산 · 서울숲 산책 · 노들섬 노을 · 반포대교 달빛 분수.  
  근거는 한국어 · 영어 위키백과 문서(있는지 확인), 세 세계 글 · 소품, 판타지 · 스팀펑크 금지 낱말 없음. 역할극(노래방 · 홍대 · 대학로 · 고궁) · 게임 코스프레(홍대 · 코믹월드) · 란제리풍(고시원)을 받는 장면이 늘었다. 검사기 · 검사의 「장면 10~12」 를 「10 이상」 으로.
- 같이 고친 것: tools/casual-plan.cjs famsAt — 일반 장소가 받는 옷 계열을 버전1 표의 그 장소 outfits 로 좁혔다(버전2 표는 계열을 거의 어디서나 받아 표본 계획에 라이브하우스 수영복이 나왔다).

## 2026-11-20 · claude · 자세별 구도 제한 풀기 — 엎드리기 추천 · 카메라 높이 · 가슴 위 뒤 3/4
- 사용자 「엎드린 자세는 위에서 찍은거 밖에 안나오는거 같던데」 → 「구도제한 다 풀어주고, 다른 공방도 같이 적용해줘」. 엎드리기 추천이 「전신 · 정면」 하나라 세로 화면에서 늘 위에서 찍혔다.  
  data/casual-tree-v2.json — 엎드리기 추천 더함: lie_front_face(바닥 높이 · 가슴 위 · 얼굴 정면) · lie_front_side(바닥 높이 · 환경 컷 · 옆모습) · lie_front_top(바로 위에서). 카메라 floor(바닥 높이)는 서기 · 걷기도 받고(서면 올려다본다) 누운 자세 말을 더했다, top(바로 위에서)은 앉기 · 무릎 꿇기도 받는다. 쪼그려 앉기는 가슴 위 컷도.  
  data/casual-tree.json — frame_rules.chest_up 의 no_orients 에서 뒤 3/4(rear_3q · three_quarter_back)을 뺐다(어깨 너머로 돌아보는 가슴 위 컷). 등 돌림 · 뒤 · 걸어가는 뒷모습은 그대로 막는다. tests/casual-tree.cjs 단언을 새 규칙으로.

## 2026-11-20 · claude · 일상컷 열 장 — 필수 다섯(생활 장면 · 노출 갈래 셋 · 게임 코스프레) · 장소는 생활 장면과 일반 장소를 섞어
- 사용자 「노출 갈래를 다 필수로 해서 2장 더 늘리고, 게임 코스튬도 필수로 했었는데 그게 없네?」 · 「기존 장소들을 해당 시대 느낌으로 바꿔서 쓰는건 안되는거야?」 · 「서울 장면은 일반장소랑 섞어 쓰면서 또 하나의 필수 컷으로」 · 「포켓몬도 11장 까지 만드니까 그렇게 늘려도 되고」 · 「필수칸 두고 전부 섞자」.
  tools/casual-plan.cjs — 세계마다 열 장: 필수 다섯(생활 장면 컷 lifeMust — 그 도시 생활 장면에서 가장 먼저 · 란제리풍 · 수영복 · 역할극 · 게임 코스프레) + 보통 셋(상황 노출은 늘 그 가운데 한 장) + 자유 설계 둘(옷 자유 · 갈래 자유 — 갈래는 다른 세계가 덜 쓴 노출 갈래, 그 갈래 필수 컷의 옷은 gnot 으로 피함). 장소 풀 = 생활 장면 ∪ 일반 장소(버전1 트리 장소 — 판타지 · 스팀펑크는 글에 금지 낱말이 든 곳을 뺀다), 반쯤 생활 장면 먼저. 장소 겹침 0(한 세계), 세계끼리는 같은 장소 · 같은 옷 계열만 막고 노출 갈래 · 코스프레 칸은 남은 곳이 없으면 허용. 일반 장소의 시간대 · 날씨는 장소 특징(밤 · 실내)대로. 몸 방향 한도는 장면 여덟이라 세 번까지(자세 추천의 몸 방향이 사실상 셋). 옛 묶음 호환(SITU_FROM · OFREE_FROM · GFREE_FROM · --required)은 걷었다 — 도시는 아직 그린 일상컷이 없다.
  게임 코스프레 — 원소 공방(origin/main 53b1956 ~ 6d68172)에서 옮김: data/game-cosplay.json 사본, pickCosplay(남은 인원 제곱근 무게 · 계획기가 캐릭터를 정함 · 2회차), cosplayUsage 는 이 공방 그림 저장소(city-atelier-img)의 그린 기록 + 계획 예약만(없으면 멈춤, --cosplay-usage none), game-atelier 원본과 다르면 경고, --check 가 generation.cosplay 를 본다. 옛 pick 칸 · --recosplay 는 옮기지 않았다. 판타지 · 스팀펑크는 글에 그 세계 금지 낱말이 든 게임을 안 고른다(다크 소울의 rust).
  data/casual-tree.json · data/casual-tree-v2.json — 의상 계열 game_cosplay(재단 열하나) · costume_required · 시대 now 계열, 그 계열을 받는 장소(침실 · 거실 · 수영장 · 해변 · 댄스 무대 · 코스프레 행사 · 테마 행사장)와 새 장소 arcade_hall(오락실, 원소 것 그대로).
  lib/prompt-spec.js · lib/prompt-city.js — 코스프레 컷 글(Costume 줄 · OUTPUT · WARDROBE · CHARACTER 끝), Outfit 줄은 목록 글(게임 · 캐릭터 이름), 옷 색 · 데니어 · 상황 · 세계 평상복 결 없음. 장면 칸 cosplay · lifeMust · gnot, 갈래 자유의 「Not the same outfit …」 줄. lib/studio.js · prompt.html — 생성기도 목록을 읽어 같은 지시문(?v= 올림).
  tools/prompt-pack.cjs — 코스프레 기록 안내(INDEX.md) · 차례표 갈래. tools/image-claim.cjs CASUAL_N 10 — 한 세계 몫 11, 서울 33.
  IMAGE_RULES.md · docs/IMAGE_AUTOMATION.md · AGENTS.md · docs/PORT_NOTES.md · docs/CASUAL_TREE_PORT.md — 일곱 → 열 장, 필수 다섯, 섞은 장소 풀, 코스프레 절(generation.cosplay · --check). 새 서울 생활 장면은 더하지 않았다(다른 일).
  tests/casual-plan.cjs · tests/image-claim.cjs · tests/prompt-pack-screen.cjs — 열 칸 갈래 · 필수 다섯 · 생활 장면 컷 · 장소 겹침 0 · 금지 장소 · 코스프레 게임 · 캐릭터 · 재단 · 쓴 것 읽기, 빈 자리 33 · 11, 묶음 33 자리.

## 2026-11-20 · claude · 그림 몫을 한 세계씩 · 몸 이상은 다시 그린다
- 사용자 「몸 이상은 다시 그리도록 해줘」 「세가지 세계를 다 한 번에 만드는게 아니고 한 세계씩 하는걸로」.  
  tools/image-claim.cjs — 몫 열쇠가 <도시>_<세계>(seoul_fantasy). 차례 = 설계표 도시 차례 × 세계 차례, 잠금 파일 claims/<도시>_<세계>.json, missing 은 그 세계의 세계 그림 + 일상컷 일곱(도시 열쇠만 주면 세계 전부). tests/image-claim.cjs 맞춤.  
  docs/IMAGE_AUTOMATION.md · IMAGE_RULES.md — 몫 · 잠금 · 계획(잡은 세계 하나) · 올리기(한 몫 한 커밋) · done 을 세계 단위로. 몸 이상(qa.anatomy)은 같은 지시문 그대로 두 번까지 다시 그리고, 세 번째도 걸리면 passed: false 로 올린다(retries 에 result anatomy). 기록 틀 예시의 see_through 는 지난 칸에서 걷은 규칙의 남은 것이라 뺐다(PORT_NOTES 의 말도).

## 2026-11-20 · claude · 서울 판타지 색 · 무늬 — 중국풍 빨강을 걷고 태극 · 서울 무늬로
- 사용자 「판타지 쪽 색상이 너무 붉은색이라 중국 느낌」 「입술도 너무 빨가면 이상해」 「의상색을 빨/청에 검정이랑 흰색으로 포인트 — 태극기처럼」 「괘를 검은 선 무늬로」 「서울보다는 한국같아진건 있네」 → 1번(무늬로 서울).  
  data/city-design.json 서울 판타지: 망토 = 흰 비단 · 빨강 · 파랑 태극 물결, 검은 단은 한양도성 성곽 선, 치맛단 은실 한강 물결, 큰 해치 견갑, 네 봉우리 관. 입술 mark red_lip → gloss. 배경 단청은 뇌록 청록 바탕 · 빨강은 가는 선만(세계 글 · 일상컷 세계 줄 둘 다). 「태극기」 낱말은 괘를 끌고 와서 쓰지 않는다.  
  세계 palette 칸 새로 — 세계에 palette 가 있으면 도시 palette 대신 그것(lib/prompt-city.js build · casualVars). 지금은 서울 판타지만(흰 · 태극 빨강 · 태극 파랑 · 검정).

## 2026-11-20 · claude · 「비치는 옷」 규칙 걷어 냄 — 원래대로
- 사용자 「없던 규칙은 왜 집어넣어. 원래대로 가」. 바로 아래 칸(규칙 문서 정리)에서 만든 쪽이 새로 지어 넣은 「젖거나 비치는 옷은 가슴 끝이 비치면 올리지 않고 노출을 낮춰 다시 그린다」 를 IMAGE_RULES.md(1절 · 4절)와 docs/IMAGE_AUTOMATION.md(0-1 · 3절 · 4절 · 8절)에서 걷었다. 노출 규칙은 원래 줄 그대로 — 은밀한 부위(가슴 끝 · 하반신)는 가린다, 검수에서 걸린 것은 `passed: false` 로 적고 올린다.

## 2026-11-20 · claude · 그림 생성 규칙 문서 정리 · 그림 저장소 자동 등록 준비
- 사용자 「정리해줘. 토큰은 넣어놨어」 — 그림 저장소 polos0117/city-atelier-img(Pages 켬 · Actions 비밀 CODE_REPO_TOKEN)가 생겼고, 규칙 문서에 「저장소 없음 · 화풍 미정 · 원소 말투」 가 남아 있었다.
- IMAGE_RULES.md — 머리말(저장소 있음 · 기본 화풍 kr_drawn_rim_dewy), 1절(그 나라 성인 여성 · 미형이되 세 세계 다른 얼굴 · 세 세계의 결 — 스팀펑크 가스등 판타지 · 사이버펑크 먼 미래 · 판타지 서양 신화 엘프 도시 + 한국 결, 세계 그림 네 장 뽑고 멈춤, 일상컷 세계 줄은 결만, 화풍 결, **젖거나 비치는 옷은 가슴 끝이 비치면 올리지 않고 그 칸만 노출 한 단계 낮춰 다시**), 2절 90번(서울 채워짐) · 필수 둘, 3절 이름 예시 kr_drawn_rim_dewy · 썸네일 크기, 4절 썸네일 → 깨우기 → 등록 · 주기 실행, 화풍 비교 절.
- docs/IMAGE_AUTOMATION.md — 원소 말투를 걷고 코드 그대로 다시 씀: 0-1 임의 설계 주문이 정하는 것(사람 · 미형 · 도시 상징 · 세계 표지 · 머리색 · 금지 낱말), 계획기 필수 둘(노출 갈래 · 상황 노출), 실행 ID city-…, 4절 검수(화풍 결 · 지금 물건 · 그을음 · 사진 질감 · 일상컷 뒷배경 명소 · 비치는 옷 → 올리지 않고 노출 낮춰 다시), 7절 retries · design 칸.
- lib/prompt-spec.js · lib/prompt-city.js — 세계 그림 임의 설계 주문(<세계>-free.txt)에 미형 줄과 그 세계 금지 낱말 줄(「Keep out of this world」 — 판타지 · 스팀펑크)을 더함. prompt.html ?v= 올림. tests/prompt-city.cjs — 임의 설계 주문의 사람 · 미형 · 머리색 · 금지 낱말 검사.
- tools/prompt-pack.cjs INDEX 안내 · tools/casual-plan.cjs · tools/image-claim.cjs · tools/style-compare.py 주석 — 원소 말(주민은 그 물건 · 원소에서 딴 · Her element · 나라 안 · 메카)을 도시 말로.
- .github/workflows/register-images.yml — schedule(매시 41분, 원소와 같게) 되살림. AGENTS.md · README.md · docs/PORT_NOTES.md — 그림 저장소 있음 · Task 10 남은 일.
- 그림 저장소(따로 커밋) — 폴더 자리(.gitkeep) · README · .gitignore(*.png) · 썸네일 워크플로(원소 그림 저장소 것을 도시 꼴로, 끝나면 코드 저장소에 images-updated). 검사 register-images · img-shards · image-claim · make-thumbs · style-compare · words · patch · prompt-city · prompt-sections · casual-plan · prompt-pack-screen 통과.

## 2026-11-20 · claude · 기본 화풍을 kr_drawn_rim_dewy(삼국지 기본 화풍)로
- 사용자 「기본화풍도 아까 테스트했던 화풍으로 바꿔줘. 마지막 기준」 — 서울 세 세계 · 일상컷 시험을 삼국지 기본 화풍으로 했고 그 지시문이 기준.
- data/style.json — 삼국지 `kr_drawn_rim_dewy` 를 옮겨(text · casual · worldFace · worldStyleAfter · casualStyleAfter · worldLight · casualLight · avoid · model · source, 삼국지 몫 worldHead · casualLegacy 는 뺌) 기본으로. painterly_concept 는 남김.
- lib/prompt-city.js — 판의 worldFace 가 있으면 얼굴 비율 줄을 그 글로, worldStyleAfter 는 「Face — her own:」(짧은 판은 「Her:」) 다음 줄, 일상컷 Style 줄은 casualStyleAfter 가 있으면 화풍 글 + 다음 줄 그것(keep 문장 없이 — 시험 꼴). 칸 없는 화풍은 예전 글 그대로. `?v=39`.
- tests/prompt-city.cjs — 기본 화풍 서울 세 세계 · 일상컷이 시험 꼴과 같은 줄, 실사 문구 없음, 파일 이름에 화풍 열쇠, painterly_concept 는 예전 글. tests/prompt-sections.cjs — 얼굴 비율 줄 기대값, 시간대 빛 줄 검사는 painterly_concept 로.
- AGENTS.md 규칙 8 · 설계 6-1절 · docs/PORT_NOTES.md — 화풍 바꾼 일. docs/samples 두 개 — 조립기로 다시 뽑음.

## 2026-11-19 · claude · 서울 사이버펑크 직업컷 — 송신탑 정비사를 궤도 엘리베이터 정비사로
- 바로 앞 칸(사이버펑크 = 두 세기 뒤의 먼 미래)에서 서울 남산 송신탑이 궤도 엘리베이터 첨탑이 됐는데, 캐릭터만의 컷(90번) 직업 「송신탑 신호 정비사」 의 장소 글은 옛 송신탑 · 네온 도시 그대로였다(그림은 아직 없다). data/casual-own.json 서울 사이버펑크: 직업 「궤도 엘리베이터 신호 정비사」, 장소 — 먼 미래 도시 위 궤도 엘리베이터 첨탑의 정비 발판(빛의 케이블을 따라 오르는 유도등 · 신호 배열 · 아래로 층층의 타워와 공중 다리), 하는 일 글 맞춤. 자세 · 소품 · 옷은 그대로. 검사 casual-tree check · casual-plan · prompt-city 통과.

## 2026-11-19 · claude · 시험 그림으로 정한 세 방향 — 스팀펑크 가스등 판타지 · 사이버펑크 먼 미래 · 일상컷 세계 줄은 결만
- 사용자 「스팀펑크만 너무 실사쪽으로 가는데 시대를 바꿔볼까?」 → 「1번으로 해줘」 → 「이거는 이렇게 가고」 · 「지금은 그냥 서울에다가 네온사인만 더 한 느낌이라 완전 미래 느낌은 안나거든」 · 「일부러 뒷배경은 다 나오게 만든거야?」 → 「응 그렇게 해줘」(판타지도 「지금 이 느낌으로 가자」). 시험 지시문의 낱말을 가져왔고 화풍은 그대로(painterly_concept).
- data/city-design.json — `vocab.markers.steampunk` 를 가스등 판타지 표지 열로(놋쇠 단추 · 시계태엽 · 비행 고글 · 회중시계 · 흰 증기 · 가스등 빛 …), banned_en 에 soot · grime · rust · coal smoke · sweat stains · photographic texture. `vocab.wear.steampunk` 를 깔끔하고 우아한 모험가 차림으로(시험의 「rather than soot and rust」 는 금지 낱말이 본문에 나오면 안 되는 규칙 때문에 「never sooty or rusty」). `vocab.markers.cyberpunk` 에 먼 미래 표지 하나. 새 `vocab.casual_world.<세계> = { en, guard_en }`(시험 swap3 의 세계 결 · guard — 스팀펑크 guard 의 「mentions soot, coal, grime or rust」 도 같은 까닭으로 「sounds sooty, smoky, grimy or rusty」). 서울 스팀펑크 세계 글 · 장면 셋(airship · clocktower · pier) · motif(나침반 해치 버클 항해사 하네스 + 단청 안감 망토) · hold(놋쇠 망원경) · card_ko.motif, look.why 머리만. 서울 사이버펑크 세계 글 · 장면 셋(skyterrace · 자기부상 아치 · 아콜로지 아래층 골목). 사람(외형 · 나이 · 얼굴)은 그대로 — 표정 confident 는 core 표(손으로 안 고침)의 「composed, self-assured」 그대로.
- lib/prompt-city.js — 일상컷 「World:」 줄이 도시 세계 글(명소 목록) 대신 casual_world.en, 다음 줄 guard_en(짧은 판 · 긴 판). `?v=38`.
- lib/prompt-spec.js — 스팀펑크 빛 줄(석탄 연기 · 화로 · 땀 → 가스등 · 흰 증기 · 놋쇠), 실루엣 stoker(그을음 바지) → engineer(비행선 기관사형), 일상 옷 색 earth 의 rust → terracotta(스팀펑크 금지 낱말과 겹침). `?v=40`.
- data/city-life.json — 서울 스팀펑크 장면 글 열(그을음 · 석탄 · 주물 공장 · 굴뚝 연기 → 놋쇠 · 유리 · 가스등 · 흰 증기, 장소는 그대로), 사이버펑크 장면 글 일곱(네온 · 플라스틱 → 자기부상 아치 · 아콜로지 · 스마트 유리 등 먼 미래 결). data/world-props.json — 스팀펑크 lamp · bowl · cup · ride · float_ring 과 평상복(「a little soot at the cuffs」 걷음).
- tools/city-design.py · tests/city-design.py — casual_world 검사(글 · 금지 낱말)와 망가뜨린 경우 둘. tests/prompt-city.cjs — 일상컷 세계 줄 = casual_world + guard, 세계마다 명소 낱말 표가 장소 줄이 말하지 않는 한 세계 줄에 없다. tests/prompt-sections.cjs — 스팀펑크 의상 글 첫머리 기대값.
- AGENTS.md 규칙 1 · 설계 3절 표 · 3-1절 — 세 방향과 까닭. docs/samples 두 개 — 조립기로 다시 뽑음(일상컷 본보기는 기본 화풍 painterly_concept 로).

## 2026-11-19 · claude · 서울 스팀펑크 — 건장한 철교 정비공에서 예쁜 쪽으로
- 사용자 「아니.. 이 건장한 느낌말고 설계를 좀 바꾸자. 예쁘게」(삼국지 화풍 시험 그림을 보고).
- data/city-design.json 서울 스팀펑크 `look`: 체형 broad_strong → lean_toned(날씬하고 탄탄한), 헤어 wolf_cut(두 번 다 긴 웨이브로 나왔다) → finger_waves(1900~1920년대 결의 윤기 나는 핑거웨이브) · 앞머리 choppy → side_swept, 얼굴 square_soft · almond_wide · straight_thick · broad_soft · wide_smile → diamond · round_large · soft_round · upturned · heart_full, 인상 rugged → elegant, 표정 determined → confident, 나이 late_20s → mid_20s. 구리빛 머리 · 호박색 눈 · 주근깨 · 직업(철교 정비공) · motif 는 그대로. card_ko.look 「구리빛 핑거웨이브 · 날씬한 몸」. 얼굴 칸 다섯이 판타지 · 사이버펑크와 다 다르다(FACE_DIFF_MIN 3). 검사 city-design · look-spec · prompt-city · prompt-sections · casual-plan 통과.

## 2026-11-19 · claude · 화풍 확정(painterly_concept) · 미형 · 세계마다 다른 얼굴 · 도시 people
- 사용자 「그림체만 우선 이걸로 가보자」 · 「이대로 가자」 (서울 세 장 시험) · 「웬만하면 미형으로 가고」 · 「같은 얼굴은 피하고」 · 「도시공방 이니까 인종을 각 나라의 사람으로 해보자」.
- data/style.json — 새 화풍 painterly_concept(회화적 콘셉트 아트, 모델 gpt-image-2.6-sunburst)를 더해 기본으로, undecided · undecided_note 걷음. 옛 임시 화풍은 그대로.
- data/city-design.json — 도시 열 곳에 people { ko, en }(한국인/Korean … 브라질인/Brazilian). 서울 얼굴 칸 다섯은 세 세계가 이미 다 달라 값은 안 고침.
- tools/city-design.py · tests/city-design.py — people 검사, 얼굴 칸 다섯 가운데 셋 이상이 세 세계 모두 다를 것(FACE_DIFF_MIN) 검사 · 망가뜨린 경우 다섯 더함(38가지).
- lib/prompt-spec.js · lib/prompt-city.js — 머리 줄 「an adult <people> woman」(세계 그림 · 임의 설계 · 일상컷), 화풍 줄 뒤 미형 · 다른 얼굴 한 줄(세계 그림 · 일상컷), 카드에 people. prompt.html 의 ?v= 올림.
- tests/prompt-city.cjs · tests/prompt-sections.cjs — 화풍 확정 · people · 미형 줄 기대값. docs/samples/seoul-world-prompts.md — 조립기로 다시 뽑음.
- AGENTS.md · docs/superpowers/specs/2026-11-19-city-atelier-design.md · docs/PORT_NOTES.md — 규칙 세 줄 · 6-1절 「정해졌다」 · Task 11 화풍 몫 끝 줄.

## 2026-11-19 · claude · 서울 판타지 — 동양 궁궐에서 서양 하이판타지 속 한국 결로
- 사용자 「판타지도 느낌이 지금은 동양쪽 판타지잖아. 이걸 서양판타지 쪽에 들어간 한국 느낌으로 해봤으면 좋겠는데」 — 참고로 든 것은 한 게임의 엘프 수도(지시문에는 게임 · 종족 이름을 쓰지 않는다).
- data/city-design.json 서울 판타지: 세계 글 → 네 산을 뿌리로 감은 거대한 고목 위의 달빛 엘프풍 수도(옅은 조각 나무 · 월석 아치 궁전, 빛나는 단청 문양의 곡선 처마, 은빛 강 위 살아 있는 나무다리, 빛나는 꽃잎 · 떠다니는 정령 빛, 보랏빛 밤하늘, 남쪽 능선의 달불 봉화). 장면 셋 → 고목 궁전의 달빛 테라스 · 은빛 강 위 나무다리 · 남쪽 능선의 달불 봉화. motif → 서울 빨강 · 달빛 은색 망토 가운(은실 · 금실 단청 문양), 해치 초승달 견갑, 네 봉우리 은빛 관. 손에 든 것 → 은 해치 월석 인장. 짧은 말(card_ko.motif) 맞춤.
- 장르 이름 검사(「high-fantasy」 금지)에 걸려 「a moonlit elven capital of a Western myth-world」 로. 얼굴 · 나이 · 머리 · 체형은 그대로(20대 후반 · 남빛 긴 생머리). 검사 city-design · prompt-city · prompt-sections · prompt-short-look · casual-plan 통과.

## 2026-11-19 · claude · 서울 판타지 — 나이 서른 초반 → 20대 후반, 성벽은 먼 능선에 희미하게
- 사용자가 실사 유화 판타지 지시문으로 뽑은 그림을 보고 「얼굴 이거 어쩔거야」 — 이를 드러낸 웃음 · 주름으로 설계보다 나이 들어 보였고, 배경에 만리장성 같은 성벽이 Avoid(Great Wall)에도 또 섰다.
- data/city-design.json 서울 판타지 `look.face.age` early_30s → late_20s(「no wrinkles, folds or under-eye bags」). 세계 글의 성벽 「a low granite fortress wall following their ridges」 → 「a low granite city wall only faintly visible on the distant ridges」(긍정 문장이 금지 낱말보다 세게 먹었다). 화풍 쪽 얼굴 고침(얼굴도 같은 유화로 · 입 다문 미소)은 화풍 시험 지시문 몫 — 저장소에 화풍을 넣을 때 같이.

## 2026-11-19 · claude · 세계 그림 Avoid 줄에도 그 세계 금지 낱말 · 판타지 옷 말투의 서양 문장 낱말
- 판타지 실사 유화 지시문을 다시 지어 보니 앞 칸(송신탑 · 중국식 궁궐 금지)이 Avoid 에 안 나왔다 — 세계 그림의 5칸 Avoid 는 화풍 · 규칙 금지만 모았고, 설계표 banned_en 은 일상컷 Avoid 에만 실렸다. lib/prompt-city.js 세계 그림 칸 꼴의 Avoid 에 그 세계 banned_en 을 더했다(판타지 · 스팀펑크 — 사이버펑크는 빈 목록). `prompt-city.js?v=36`.
- data/city-design.json `vocab.wear.fantasy.costume` 의 「heraldic crests on gilded pauldrons」(서양 문장) → 「guardian-beast emblems on gilded pauldrons」. 검사 prompt-city · prompt-sections · prompt-short-look · casual-plan · city-design check 통과.

## 2026-11-19 · claude · 서울 시험 그림에서 새어 나온 것 고침 — 판타지 궁궐 · 송신탑 · 배경 표지
- 사용자 「이번엔 판타지 옮겨줘. 위에 잘못된 문장들 고쳐서」. 삼국지 기본 화풍 시험 세 장(판타지 · 스팀펑크 · 사이버펑크)에서 본 것: 판타지 · 스팀펑크 배경에 지금의 남산 송신탑이 섰고, 판타지 궁궐 · 성벽이 중국식(노란 기와 · 만리장성)으로 읽혔고, 네 봉우리 왕관이 흐렸다.
- data/city-design.json — 판타지 세계 글: 「a great stone wall · golden-roofed palace halls」 → 산등성이를 따르는 낮은 화강암 성벽 · 조선식 궁궐(살짝 들린 짙은 기와지붕 · 금빛 용마루 장식 · 단청 처마) · 남산 꼭대기엔 봉수대 불만. 판타지 장면 둘째 「golden palace roofs」 → 금빛 용마루의 짙은 기와지붕. 판타지 motif 왕관 → 테두리가 낮은 네 봉우리로 솟고 화강암 성벽 모양 띠로 이어진 금관.
- 세계 표지 가운데 배경 표지를 사람 표지로(검토 지적): 판타지 「towering spires and castle walls behind her」 → 허리의 보석 노리개 · 비단 술, 「heraldic crests」(서양 문장) → 금 갑옷 장식의 해치류 수호수 문양, 사이버펑크 「a rain-soaked neon alley behind her」 → 피부와 비옷에 맺힌 빗방울.
- 금지 낱말(판타지 · 스팀펑크 banned_en)에 broadcast tower · TV tower · observation tower · skyscraper · Chinese-style palace · Great Wall · yellow-glazed roof tiles — Avoid 줄로만 나간다. 검사 city-design · prompt-city · casual-plan · prompt-sections 통과. docs/samples 의 서울 지시문 본보기는 이 고침 전 것이다.

## 2026-11-19 · claude · 전체 검토 고침 — 한 장의 세계 · 원소 화풍 묶음 · 원소 낱말 · 검사 목록 · 주소 검증
- lib/city-view.js — 한 장의 세계 읽기를 실제 파일 이름(`<도시>_<세계>_<화풍>_f.webp`)에 맞춤(늘 빈 값이던 것), 등록부에 없는 그림 확인 `known` 추가
- index.html · lib/dex-view.js — 한 장 주소의 그림이 등록부에 없으면 도시 무대로, city-view `?v=2` · walk-core `?v=8` · img.js `?v=12` · words `?v=34` · dex-view `?v=2`
- lib/walk-core.js — validate 가 그 도시의 그림이 아닌 pic 을 비우고 원소 잔재 `w=all` 을 받지 않음
- data/style-compare.json · styles.html · tools/style-compare.py · tests/style-compare.py · tests/screen.cjs — 원소 화풍 묶음을 비우고 세계를 판타지 · 스팀펑크 · 사이버펑크로, 묶음이 없으면 「화풍 시험 전」 안내
- lib/words.js — 원소 낱말 49개 지움(gallery · cat · state · fact · tier · dex 근본/가문주/홀로/나라 · prompt 나라/가문주 · world.mecha 등), 시대 · 일상 · 장면 안내를 도시 말로
- tools/port-look-spec.cjs — EXPOSURE_LAYER 의 mecha 를 cyberpunk 로(다시 돌려도 안 되돌아가게)
- lib/img.js — 안 쓰는 전시관(hall) 지움, 썸네일 설명을 워크플로 주석과 맞춤 · .gitignore 의 /img-2 지움
- tests/walk-core.cjs · tests/globe-screen.cjs — 실제 파일 이름 꼴 · 한 장의 세계/이름/테 색 · 다른 도시 그림 · 없는 그림 검사
- AGENTS.md · README.md · docs/PORT_NOTES.md — 검사 목록을 실제 tests/ · tools/ 에 맞추고 낡은 상태 줄을 지금 기준으로

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
