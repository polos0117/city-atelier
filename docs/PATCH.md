# 패치 기록

파일을 고친 쪽이 직접 한 칸 적는다. 규칙은 `AGENTS.md` 의 "5. 고쳤으면 적는다" 에 있다.

모양은 두 줄이 전부다. 한 칸은 `##` 으로 시작하고 `날짜 · 누가 · 무엇을 바꿨나` 를
가운뎃점으로 나눈다. 그 아래 `-` 줄에 `파일 — 왜/무엇` 을 파일마다 하나씩 적는다.
날짜는 `2026-11-19` 꼴, 누가는 `claude` 또는 `gpt`, 새 칸이 위로 간다.
이 안내글은 첫 `##` 앞이라 읽히지 않는다. `node tests/patch.cjs` 가 모양을 본다.

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
