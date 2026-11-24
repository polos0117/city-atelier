/* 프롬프트 표 — 생성기가 쓰는 영어 문장과 선택지는 전부 여기 있다. 함수는 없다(tests/words.cjs 가 본다).
   조립은 lib/prompt-city.js 가 한다. 도시 · 세계마다 다른 글(세계 글 · 장면 · 외형 · motif · hold · 세계 표지 · 옷 말투)은 data/city-design.json, 화풍 문장은 data/style.json 의 판에서 온다.
   원소 공방(element-atelier)에서 옮겼다(2026-11-19, 계획 Task 3). 원소의 나라 › 가문 › 주민 세 층은 걷어 내고 도시 한 층 — 세계 그림 뼈대:
     CONCEPT(도시 그 자체의 의인화) → CITY MOTIF(도시 상징을 그 세계 식으로 실은 옷 · 장신구 + 상징 색) → WORLD MARKS(세계 표지 — 장르 이름이 아니라 사람에게 싣는 낱말)
     → 외형(AGE · SILHOUETTE · FACE) → WORLD(그 세계의 그 도시 — 배경은 거든다 + 세계 옷 말투 + 빛) → SETTING(장면) → PROP(손에 드는 것) → STYLE → EXPOSURE → OUTPUT · BODY · ONE FIGURE ONLY · ANATOMY.
   주인공은 사람, 배경은 거든다(설계 3절). 현대 세계는 없다(일상컷이 맡는다 — Task 4). */
(function (root) {
  'use strict';

  /* 세계 셋 — 열쇠는 설계표 vocab.worlds 와 같다(fantasy · steampunk · cyberpunk — 원소의 mecha 는 없다). ko 는 화면, en 은 칸 꼴 3칸 머리.
     head 는 세계 줄의 머리 — 장르 이름을 싣지 않는다(설계 3절: 장르 이름 위주라 모델이 무난한 중간값을 그렸다). 옷 뼈대 · 노출 단계는 설계표 vocab.wear.<세계>,
     여기는 빛(LIGHT)과 머리카락(HAIR)만 — 판타지 웅장 · 화려 / 스팀펑크 증기 · 그을음 · 땀 / 사이버펑크 네온 */
  var WORLDS = [
    { key: 'fantasy', ko: '판타지', en: 'FANTASY',
      head: 'WORLD (her city in this world, behind her — it supports her, she is the subject): ',
      tail: 'LIGHT: radiant daylight or the world\'s own magical glow, catching the gold thread and jewels on her, unless TIME & WEATHER says otherwise.' },
    { key: 'steampunk', ko: '스팀펑크', en: 'STEAMPUNK',
      head: 'WORLD (her city in this world, behind her — it supports her, she is the subject): ',
      tail: 'LIGHT: warm golden daylight or soft gaslight through drifting white steam, glinting on polished brass, glass and her skin, unless TIME & WEATHER says otherwise. HAIR: her hair is worn exactly as SILHOUETTE says — loose, long or cut as named; do not pin it up into a bun or tuck it under goggles or a hat unless SILHOUETTE says an updo.' },
    { key: 'cyberpunk', ko: '사이버펑크', en: 'CYBERPUNK',
      head: 'WORLD (her city in this world, behind her — it supports her, she is the subject): ',
      tail: 'LIGHT: night lit by magenta and cyan neon, sign light reflected on her face, skin and coat, glowing implants and tattoo lines, unless TIME & WEATHER says otherwise.' }
  ];

  /* 도시 한 층의 CONCEPT 한 문장과 줄 머리. {city_en} 은 설계표에서 */
  var CONCEPT = 'CONCEPT: the personification of the city of {city_en} — one woman who IS {city_en} as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city\'s symbols and this world\'s marks, and the city behind her only supports her.';
  /* 랜드마크 카드의 머리 줄 — 뒤 문장은 CONCEPT 그대로 */
  var CONCEPT_LANDMARK = 'CONCEPT: the personification of {landmark_en}, a landmark of the city of {city_en} — one woman who IS {landmark_en} as it stands in this world.' + CONCEPT.slice(CONCEPT.indexOf(' She is the subject'));
  var MOTIF_HEAD = 'CITY MOTIF of {city_en}, worn on her: ';
  var MARKS_HEAD = 'WORLD MARKS, carried on her clothes, body, props and light: ';
  var PROP_HEAD = 'PROP: in one hand she holds ';
  var PALETTE_HEAD = 'Palette: ';
  var ACCENT_TAIL = ' — one of these as her accent colour';

  /* 출력 — 세로 2:3 카드 한 장. 일상컷은 트리가 붙을 때 더한다 */
  var OUTPUT = 'OUTPUT: one character image that works as card art. Vertical 2:3 frame, full body with head and feet inside the frame with clear margins, face turned toward the camera (front or three-quarter). {pose} the environment may be rich while her design stays fully readable.';
  /* 세계 그림의 자세 — 비우면 카드 자세. 셋을 나란히 견주는 자리라 프레이밍·카메라는 그대로(전신·정면 또는 3/4) */
  var POSE_DEFAULT = 'Standing, card-ready pose;';
  var WORLD_POSES = [
    { key: 'stand_3q', ko: '3/4 로 서서', en: 'Standing turned three-quarters toward the camera, weight on one leg, one hand resting at her side or hip;' },
    { key: 'stride', ko: '걸어 나오며', en: 'Mid-stride toward the camera, one foot forward, cloth and hair in motion;' },
    { key: 'sit_throne', ko: '앉아서(자리·계단)', en: 'Seated on a throne, step or edge that belongs to the world, upright, knees together or crossed, both feet visible;' },
    { key: 'kneel', ko: '한쪽 무릎', en: 'Down on one knee, the other foot planted, torso upright and facing the camera;' },
    { key: 'lean', ko: '기대서', en: 'Leaning back against a structure of the world (gate, rail, tank, pillar), arms relaxed;' },
    { key: 'arms_cross', ko: '팔짱', en: 'Standing square to the camera with arms crossed, chin level;' },
    { key: 'hand_heart', ko: '가슴에 손', en: 'Standing with one hand laid over her heart, the other at her side, a quiet ceremonial bearing;' }
  ];
  var WORLD_TIMES = [
    { key: 'dawn', ko: '새벽', en: 'TIME & WEATHER: first light of dawn — cool blue shadows, a thin warm line on the horizon.' },
    { key: 'day', ko: '한낮', en: 'TIME & WEATHER: clear daylight, crisp shadows.' },
    { key: 'golden', ko: '석양', en: 'TIME & WEATHER: golden hour — long warm light, deep orange sky.' },
    { key: 'night', ko: '밤', en: 'TIME & WEATHER: night — the scene lit by its own fires, lamps or glow, a dark sky above.' },
    { key: 'storm', ko: '폭풍', en: 'TIME & WEATHER: an approaching storm — heavy clouds, wind in cloth and hair, a flash of distant lightning.' },
    { key: 'snow', ko: '눈', en: 'TIME & WEATHER: falling snow, soft diffused light, snow on edges and shoulders.' },
    { key: 'fog', ko: '안개', en: 'TIME & WEATHER: thick fog — the far structures fade to silhouettes, near light glows in the mist.' }
  ];
  var SCENE_HEAD = 'SETTING (this card): ';   /* 장면 글은 전치사(inside·before·on·at)나 명사로 시작한다 — 머리말은 콜론까지만 */
  var EXPR_HEAD = 'EXPRESSION: ';
  var BODY_LINE = 'BODY: a normal human body — one head, two arms and two legs, each joined at its natural joint. Hands and feet may be partly hidden by the pose or the frame.';
  var RULES = [
    /* 원소 공방은 원소 기호 · 원자 번호만 허용했다 — 도시에는 그런 글자가 없다. 상표 · 사람 이름도 싣지 않는다(설계 5절) */
    'ONE FIGURE ONLY. No second character, no living creature, no logo, no watermark, no speech bubble, no frame border. No text, lettering or numbers anywhere in the picture.',
    'ANATOMY: natural adult proportions, both hands drawn correctly as hands. No extra limbs.'
  ];

  /* 덧붙임 칸 — 생성기 화면의 글 칸. id 는 기록의 열쇠 */
  var NOTES = [
    { id: 'scene', ko: '장소·상황', multi: true, head: 'SCENE NOTE: ' },
    { id: 'outfit', ko: '의상·소품', multi: true, head: 'OUTFIT NOTE: ' },
    { id: 'custom', ko: '추가 연출 요청', multi: true, head: 'EXTRA: ' }
  ];

  /* 파일 이름 틀 — IMAGE_RULES.md 3절과 같다 */
  var FILES = {
    world: '{card}_{world}_{style}_f.webp',
    casual: '{card}_{world}_{style}_f_casual{n}.webp',   /* 일상컷은 그 세계 그림을 참고 그림으로 붙인다 — 세계를 탄다(사용자 2026-10-30) */
    vista: '{card}_{world}_{style}_vista.webp'   /* 전경 — 사람이 아니라 성별 표시가 없다(2026-11-24) */
  };

  /* ══ 전경(2026-11-24) ══ 도시 × 세계 × 화풍마다 풍경 한 장 — 사람 없음 · 글자 없음 · 가로 3:2. 도시 무대(lib/city-view.js)의 배경.
     전경은 분위기만 싣는다 — 명소 자리는 자료(설계표 landmarks[].lat · lon)라 그림에 박지 않는다(사용자 2026-11-24 「랜드마크는 계속 추가할건데 미리 그려놓으면 추가할 때마다 다시 그려야 되지 않나?」).
     조립은 lib/prompt-city.js vista(): 장소 = 설계표 worlds.<세계>.en, 화풍 줄 = 화풍 판의 vista 칸(없으면 styleFallback 에 화풍 글 첫 문장),
     Avoid = 그 세계 banned_en − 그 도시 own_vocab.unban_en − 옷 낱말(cloth — 사람이 없는 그림이라 옷을 막을 까닭이 없다). 서울 시험 셋(2026-11-24)의 글 그대로 */
  var VISTA = {
    genre: { fantasy: 'high-fantasy', steampunk: 'storybook gaslamp-fantasy steampunk', cyberpunk: 'far-future cyberpunk' },
    head: 'A wide establishing vista of {city_en} in a {genre} world — environment key art for a game world map, with no people.',
    place: 'The place: {place}.',
    composition: 'Composition: a sweeping view from a high vantage point at a three-quarter angle, layered depth — framing elements in the near foreground, the city spread across the middle ground, mountains and sky far behind. The whole city reads at a glance as one memorable skyline. Keep the lower quarter of the picture calm and slightly darker (water, terrace or treetops without detail clutter) so interface cards can sit over it.',
    style: 'Style: {style}',
    styleFallback: 'painterly environment key art matching {head}; rich atmospheric perspective and luminous light.',
    none: 'No people, no characters, no animals in focus; no text, letters, numbers, signs, logos or watermark; no frame or border.',
    avoid: 'Avoid: {list}.',
    output: 'Output: one horizontal 3:2 image, 1536×1024.',
    size: [1536, 1024],
    cloth: ['hoodie', 'jeans', 'denim', 'jacket', 'hat', 'sweatpants', 'leggings', 'cap', 'tracksuit', 'jogger', 'pants', 'windbreaker', 'fleece', 'bodycon', 'sneakers', 'headphones', 'earbuds',
      'kimono', 'corset', 'gown', 'dress', 'shirt', 'skirt', 'boots', 'gloves', 'suit', 'armour', 'armor']
  };

  /* ══ 일상컷(트리 버전2) ══ game-atelier 의 GAME_LINES 일상컷 몫에서 왔다(2026-10-30, docs/CASUAL_TREE_V2.md 5절).
     장면(시대·장소·의상·자세·받침·구도·손·소품·다리·시선)은 data/casual-tree.json·casual-tree-v2.json 이 쥐고 lib/casual-tree*.js 가 거른다.
     여기는 그 장면을 영어 줄에 싣는 틀만. 조립은 lib/prompt-city.js 의 buildCasual.
     game 과 같은 것: 참고 그림을 붙인다 — 그 카드의 세계 그림(판타지·스팀펑크·메카 중 하나) 이 사람이 일상에 나온 한 장(사용자 2026-10-30 「일상컷은 참고 이미지가 있어야 돼서 그 화풍을 따라가야 돼」).
     그래서 일상컷은 세계를 타고(파일 이름에 세계), 화풍은 그 세계 그림의 화풍이다. INPUT·CHARACTER·WARDROBE·ANGLE 은 game 의 「첨부 그림의 …」 꼴.
     「그 게임」 자리는 「그 원소」 — 원소·물질·물건은 장신구·주변 사물로만, 옷의 색·무늬·재단과 갑옷으로는 옮기지 않는다. */
  /* 판타지 실루엣 열아홉(2026-11-20 — 원소 · 삼국지의 열넷을 서양 하이판타지 · 미형 쪽으로 다듬고(열쇠는 그대로) 다섯을 더함. 사용자 「다 다시 짯으면」 · 「19개로 맞춰줘」). 큰 덩어리 모양만, 세부 · 도시 무늬는 설계표 motif */
  var FANTASY_SILHOUETTES = [
    { key: 'full_plate', ko: '판금 기사형', kot: '목부터 발끝까지 이어진 판금 갑옷과 둥근 큰 어깨판, 짧은 문장 겉옷 — 단단한 기사의 실루엣', en: 'full plate armor from neck to feet with big rounded pauldrons and a short heraldic tabard — a solid knight\'s silhouette' },
    { key: 'battle_mage', ko: '전투 마법사형', kot: '가벼운 흉갑과 팔 보호대 위로 허리에서 갈라져 흐르는 로브 자락 — 갑옷과 로브가 반씩', en: 'a light breastplate and bracers with robe panels split from the waist — half armor, half robe' },
    { key: 'dark_spiked', ko: '흑기사 가시형', kot: '각지고 가시 돋친 어두운 판금, 끝이 찢긴 긴 망토 — 날카롭고 위협적인 실루엣', en: 'angular, spiked dark plate armor and a long cape with torn edges — a sharp, menacing silhouette' },
    { key: 'wild_warrior', ko: '야성 전사형', kot: '털 망토와 가죽 띠, 최소한의 금속 갑편, 뼈와 이빨 장식 — 거칠고 강인한 실루엣', en: 'a fur cloak, leather straps, minimal metal plates and bone and tooth ornaments — a rugged, wild warrior silhouette' },
    { key: 'noble_coat', ko: '귀족 장교 코트형', kot: '무릎 아래까지 내려오는 긴 코트와 견장, 허리띠와 장갑, 높은 장화 — 단정하고 권위 있는 실루엣', en: 'a long coat below the knees with epaulettes, a belt, gloves and tall boots — a crisp, commanding officer\'s silhouette' },
    { key: 'gown_armor', ko: '드레스 갑주형', kot: '몸에 맞는 흉갑과 어깨갑 아래로 바닥까지 넓게 퍼지는 드레스 자락 — 우아한 여기사의 실루엣', en: 'a fitted breastplate and pauldrons above a gown skirt flaring to the floor — an elegant lady-knight silhouette' },
    { key: 'paladin_cape', ko: '성기사 망토형', kot: '판금 갑옷 위 긴 문장 겉옷과 발목까지 내려오는 흰 망토 — 곧고 성스러운 실루엣', en: 'plate armor under a long heraldic tabard with a white cape to the ankles — a straight, holy silhouette' },
    { key: 'ranger', ko: '엘프 숲 순찰형', kot: '잎맥 무늬를 새긴 몸에 맞는 가죽 갑옷과 짧은 반망토, 등에 내린 후드, 허벅지까지 오는 장화 — 가볍고 날렵한 실루엣', en: 'fitted leaf-veined leather armor with a short half-cape, a lowered hood and thigh-high boots — a light, agile elven ranger silhouette' },
    { key: 'mage_robe', ko: '대마법사 로브형', kot: '별 자수를 놓은 높은 깃의 긴 로브와 겹겹이 내린 어깨 망토, 넓은 소매 — 길고 신비로운 실루엣', en: 'a long star-embroidered robe with a tall standing collar, layered shoulder mantles and wide sleeves — a tall, mysterious archmage silhouette' },
    { key: 'priestess', ko: '달빛 무녀 예복형', kot: '높은 깃과 겹겹이 내린 드레스, 바닥까지 끌리는 긴 소매, 가는 관 — 길고 고요한 실루엣', en: 'a high-collared, many-layered gown with long trailing sleeves sweeping to the floor and a slender circlet — a long, serene moon-priestess silhouette' },
    { key: 'crown_regalia', ko: '궁정 여왕 드레스형', kot: '몸에 맞는 상의와 넓게 퍼지는 치마, 바닥에 끌리는 긴 자락과 어깨 망토, 왕관 — 위엄 있게 퍼지는 실루엣', en: 'a fitted bodice above a wide, sweeping skirt with a long train, a shoulder cape and a crown — a regal, spreading court-queen silhouette' },
    { key: 'dragon_scale', ko: '용기사형', kot: '비늘 무늬 가죽 갑주와 한쪽만 큰 어깨판, 허리에서 갈라져 날리는 긴 코트 — 비스듬하고 힘 있는 실루엣', en: 'scaled leather armor with one large asymmetric pauldron and a long coat split from the waist streaming behind her — a bold, asymmetric dragon-rider silhouette' },
    { key: 'winged', ko: '하늘 기사형', kot: '날개 장식 투구와 가벼운 판금, 어깨 뒤로 펼쳐진 금속 깃털 날개, 길게 날리는 겉옷 — 날개가 실루엣의 중심', en: 'a winged helm and light plate with metal feathered wings spreading behind her shoulders and a long tabard flowing in the wind — the wings make the shape' },
    { key: 'elven_leaf', ko: '숲 드루이드형', kot: '이끼와 잎이 겹친 긴 망토와 덩굴이 감긴 얇은 드레스, 나뭇가지 모양 머리 장식 — 숲처럼 부드럽게 늘어진 실루엣', en: 'a long cloak layered with moss and leaves over a slender vine-wrapped gown and a branching circlet — a soft, forest-draped druid silhouette' },
    { key: 'silk_sorceress', ko: '비단 마녀 드레이프형', kot: '몸을 따라 흘러내리는 비단 자락과 트인 긴 소매, 보석 허리 사슬 — 가늘고 매혹적인 실루엣', en: 'flowing silk drapery that follows her body, long open sleeves and jeweled waist chains — a slender, enchanting sorceress silhouette' },
    { key: 'bard', ko: '음유시인형', kot: '몸에 맞는 끈 조임 튜닉과 짧은 망토, 장화 위로 겹친 짧은 치마, 어깨에 멘 악기 띠 — 경쾌한 떠돌이 실루엣', en: 'a fitted laced tunic, a short cape, layered short skirts over tall boots and an instrument strap across her shoulder — a light, wandering bard silhouette' },
    { key: 'shadow_dancer', ko: '그림자 무희형', kot: '몸에 붙는 어두운 옷 위로 흩날리는 베일 띠와 두건 — 가늘고 움직이는 실루엣', en: 'a close-fitting dark outfit wrapped in fluttering veil sashes and a deep hood — a slender, moving shadow-dancer silhouette' },
    { key: 'frost_witch', ko: '서리 마녀형', kot: '흰 털 장식 드레스와 바닥까지 끌리는 긴 망토, 얼음 결정 관 — 차갑고 길게 선 실루엣', en: 'a white fur-trimmed gown with a floor-sweeping cape and a crown of ice crystals — a cold, tall frost-witch silhouette' },
    { key: 'tide_oracle', ko: '물결 예언자형', kot: '파도처럼 겹쳐 흐르는 자락과 진주 줄 장식, 조개 모양 머리 장식 — 물결치는 실루엣', en: 'layered panels flowing like waves, strands of pearls and a shell-shaped headdress — a rippling tide-oracle silhouette' }
  ];
  /* 사이버펑크 실루엣 열아홉(2026-11-19 Task 3 여덟 + 2026-11-20 열하나 — 두 세기 뒤의 먼 미래, 특정 나라 옷은 없다 · 열 도시가 같이 쓴다). 큰 덩어리 모양만, 세부 · 빛은 표지가 싣는다 */
  var CYBERPUNK_SILHOUETTES = [
    { key: 'long_raincoat', ko: '반사 롱코트형', kot: '발목까지 오는 반사 롱코트를 열어 걸치고 그 아래 몸에 붙는 옷 — 길게 흐르는 실루엣', en: 'an ankle-length reflective coat worn open over fitted layers — a long, flowing street silhouette' },
    { key: 'cropped_jacket', ko: '크롭 재킷 하네스형', kot: '짧은 크롭 재킷과 몸을 가로지르는 끈 · 버클 하네스, 짧은 하의와 높은 부츠 — 짧고 날렵한 실루엣', en: 'a cropped jacket with crossing strap-and-buckle harnesses, short bottoms and tall boots — a short, sharp silhouette' },
    { key: 'implant_suit', ko: '의체 보디슈트형', kot: '몸에 붙는 보디슈트 사이로 드러난 크롬 의체 팔 · 다리 — 사람과 기계가 이어진 실루엣', en: 'a skin-tight bodysuit with chrome cybernetic arm or leg sections showing through cut-outs — a sleek half-machine silhouette' },
    { key: 'oversized_techwear', ko: '오버사이즈 테크웨어형', kot: '어깨가 크게 부푼 패딩 테크 점퍼와 가는 다리, 큰 후드 — 위가 크고 아래가 가는 실루엣', en: 'an oversized padded techwear jacket with a big hood over slim legs — a top-heavy street silhouette' },
    { key: 'street_samurai', ko: '거리 무사형', kot: '한쪽 어깨에 걸친 긴 겉옷과 허리띠, 등에 멘 칼집 모양 장치 — 비스듬한 무사의 실루엣', en: 'a long coat slung off one shoulder, a wide sash belt and a sheath-like device on her back — an asymmetric street-samurai silhouette' },
    { key: 'corporate_sleek', ko: '기업 정장형', kot: '날 선 어깨의 매끈한 정장과 높은 칼라, 가는 발광 선 — 곧고 차가운 실루엣', en: 'a razor-shouldered sleek corporate suit with a high collar and thin glowing seams — an upright, cold silhouette' },
    { key: 'racer_jumpsuit', ko: '라이더 점프슈트형', kot: '몸에 맞는 라이더 점프슈트와 큰 장갑, 목에 건 헬멧 바이저 — 빠르게 기운 실루엣', en: 'a fitted rider jumpsuit with big gloves and a visor hanging at the neck — a fast, forward-leaning silhouette' },
    { key: 'layered_street', ko: '겹겹 스트리트형', kot: '겹쳐 입은 비닐 · 그물 · 천 조각과 많은 액세서리, 높은 밑창 — 복잡하게 겹친 실루엣', en: 'layered vinyl, mesh and fabric pieces with many accessories and platform soles — a busy, layered street silhouette' },
    { key: 'holo_gown', ko: '홀로그램 드레스형', kot: '몸에 맞는 바탕 위로 빛으로 비춘 자락이 겹겹이 떠 있는 드레스 — 빛으로 퍼지는 실루엣', en: 'a fitted base layer with flowing panels of projected light floating around her like a gown — a silhouette spread in light' },
    { key: 'orbital_pilot', ko: '궤도 파일럿 슈트형', kot: '몸에 맞는 매끈한 비행복과 목의 링 칼라, 팔에 감긴 조종 띠 — 곧고 매끈한 실루엣', en: 'a sleek fitted flight suit with a ring collar at the neck and control bands on her forearms — a clean, upright orbital-pilot silhouette' },
    { key: 'cyber_idol', ko: '사이버 아이돌 무대형', kot: '짧은 무대 상의와 빛나는 층 치마, 귀에 건 마이크 헤드셋, 높은 부츠 — 반짝이는 무대 실루엣', en: 'a cropped stage top, a layered skirt that glows, a mic headset and tall boots — a sparkling cyber-idol stage silhouette' },
    { key: 'smart_wrap', ko: '스마트 직물 랩 드레스형', kot: '무늬가 천천히 흐르는 스마트 직물을 몸에 감아 입은 드레스 — 부드럽게 감긴 실루엣', en: 'a wrap dress of smart fabric whose patterns slowly drift across it — a softly wrapped silhouette' },
    { key: 'exo_frame', ko: '경장 외골격형', kot: '몸에 붙는 보디슈트 위로 등과 팔다리를 따라 가는 외골격 프레임 — 선이 몸을 감싸는 실루엣', en: 'a bodysuit with a slim exoskeleton frame tracing her spine, arms and legs — a line-drawn exo-frame silhouette' },
    { key: 'sky_courier', ko: '공중 배달 질주형', kot: '주머니 많은 기능 조끼와 몸을 가로지르는 짐 하네스, 짧은 하의와 추진 부츠 — 앞으로 달리는 실루엣', en: 'a many-pocketed utility vest, a cargo harness across her body, short bottoms and thruster boots — a forward-dashing sky-courier silhouette' },
    { key: 'stealth_suit', ko: '은신 슈트형', kot: '무광 보디슈트와 두건, 빛을 휘게 하는 판이 몸을 따라 흐르는 차림 — 어둠에 녹는 실루엣', en: 'a matte bodysuit with a hood and light-bending panels along her body — a silhouette that melts into shadow' },
    { key: 'runway_avantgarde', ko: '하이패션 런웨이형', kot: '기하학으로 솟은 어깨의 조각 같은 아방가르드 코트 — 각지고 과감한 실루엣', en: 'a sculptural avant-garde coat with geometric, raised shoulders — a bold, angular runway silhouette' },
    { key: 'hacker_cloak', ko: '해커 망토형', kot: '데이터 빛이 베일처럼 드리운 커다란 두건 망토와 그 아래 몸에 맞는 옷 — 위가 크고 신비로운 실루엣', en: 'an oversized hooded cloak with a veil of flickering data light over a fitted outfit — a large, mysterious hacker silhouette' },
    { key: 'biolume_dress', ko: '바이오 발광 드레스형', kot: '살아 있는 직물이 은은하게 빛나며 몸을 따라 흐르는 드레스 — 생물처럼 빛나는 실루엣', en: 'a gown of living bio-fabric glowing softly as it flows along her body — an organic, bioluminescent silhouette' },
    { key: 'rescue_suit', ko: '구조대 슈트형', kot: '반사 띠를 두른 구조 슈트와 허리의 의료 드론 홀더, 튼튼한 부츠 — 단단하게 움직이는 실루엣', en: 'a rescue suit banded with reflective strips, a medical-drone holster at the hip and sturdy boots — a sturdy, ready-to-move rescue silhouette' }
  ];
  /* 스팀펑크 실루엣 열아홉(2026-11-20 — 밝은 동화풍 가스등에 맞춰 넷을 다듬고(열쇠는 그대로) 다섯을 더함, 공업 쪽 다섯은 남김 — 세계 옷 말투가 깨끗하고 반짝이게 바꾼다). 코르셋 말은 쓰지 않는다(노출 줄의 no corset) */
  var STEAMPUNK_SILHOUETTES = [
    { key: 'ironclad', ko: '리벳 철갑형', kot: '리벳 박힌 철판 흉갑과 큰 어깨판 아래로 뒤가 부푼 치마, 무거운 장화 — 단단한 기계 갑주의 실루엣', en: 'a riveted iron breastplate and broad pauldrons over a bustled skirt, heavy boots — a solid, armoured industrial shape' },
    { key: 'boiler_engineer', ko: '보일러 기술자형', kot: '두꺼운 가죽 작업 앞치마와 걷어 올린 소매, 공구 멜빵, 한 팔의 큰 장갑 — 현장 기술자의 실루엣', en: "a heavy leather work apron with rolled sleeves, a tool harness and one big gauntlet glove — a hands-on engineer's shape" },
    { key: 'mech_gauntlet', ko: '기계 팔 건틀릿형', kot: '한 팔을 덮는 큰 놋쇠 기계 건틀릿과 날렵한 몸 차림 — 크고 작은 대비가 실루엣의 중심', en: 'one large brass mechanical gauntlet covering a whole arm over an otherwise trim outfit — the contrast makes the shape' },
    { key: 'engineer', ko: '비행선 기관사형', kot: '소매 없는 놋쇠 단추 조끼와 고운 가죽 장갑, 몸에 맞는 바지와 끈 부츠, 허리의 가는 공구 띠 — 날렵하게 일하는 실루엣', en: "a sleeveless brass-buttoned waistcoat, fine leather gloves, fitted trousers, laced boots and a slim tool belt — an airship engineer's trim, capable shape" },
    { key: 'alchemist_coat', ko: '연금술사 코트형', kot: '약병 띠를 두른 긴 가죽 코트와 놋쇠 고글, 긴 장갑 — 신비로운 실험가의 실루엣', en: "a long leather coat with a bandolier of glass vials, brass goggles and long gloves — a mysterious experimenter's shape" },
    { key: 'aeronaut', ko: '비행선 조종사형', kot: '짧은 비행 재킷과 머리의 고글, 몸을 가로지르는 멜빵, 바람에 길게 날리는 스카프 — 하늘을 나는 실루엣', en: 'a cropped flight jacket, goggles on her head, crossing harness straps and a long scarf streaming in the wind — an airborne shape' },
    { key: 'crinoline_cage', ko: '크리놀린 철테형', kot: '허리 아래 드러난 놋쇠 철테 크리놀린 틀과 그 위의 얇은 겉치마 — 새장처럼 퍼지는 실루엣', en: 'an open crinoline cage of brass hoops below the waist under a sheer overskirt — a birdcage-wide shape' },
    { key: 'explorer', ko: '탐험가형', kot: '주머니 많은 탐험 재킷과 넓은 챙 모자, 비스듬한 가방, 끈 장화 — 먼 길을 가는 실루엣', en: "a many-pocketed expedition jacket, a wide-brimmed hat, a cross-body satchel and laced boots — a far-travelling explorer's shape" },
    { key: 'naval_officer', ko: '해군 장교형', kot: '짧은 해군 프록코트와 금 장식 띠, 모자, 바람에 날리는 허리 장식 — 항해자의 실루엣', en: "a short naval frock coat with gold braid, a captain's cap and a sash catching the wind — a seafarer's shape" },
    { key: 'botanist', ko: '온실 식물학자형', kot: '겹친 리넨 옷과 넓은 챙 모자, 유리병 허리띠, 덩굴 문양 — 부드럽게 자라는 실루엣', en: "layered linen with a wide-brimmed hat, a belt of glass specimen jars and vine motifs — a greenhouse botanist's soft shape" },
    { key: 'ballroom_gown', ko: '가스등 무도회 드레스형', kot: '몸에 맞는 보디스와 뒤가 크게 부푼 긴 드레스, 레이스 장갑과 깃털 머리 장식 — 우아하게 퍼지는 실루엣', en: 'a fitted bodice and a long bustled ball gown sweeping out behind her, lace gloves and a feathered hair ornament — an elegant, wide-trailing gaslight ballroom shape' },
    { key: 'top_hat_coat', ko: '연미복 마술사형', kot: '짧게 떨어지는 연미복과 조끼, 비스듬히 쓴 작은 실크해트, 짧은 하의와 긴 장화 — 경쾌한 무대 마술사의 실루엣', en: 'a sharp tailcoat over a waistcoat, a small silk top hat tilted on her head, short bottoms and tall boots — a playful stage-magician shape' },
    { key: 'officer_greatcoat', ko: '하늘 선장 외투형', kot: '놋쇠 견장이 달린 긴 연미 외투가 바람에 날리고 그 아래 몸에 맞는 옷, 선장 모자 — 길고 당당한 실루엣', en: 'a long swallow-tailed greatcoat with brass epaulettes streaming in the wind over a fitted outfit, and a captain\'s hat — a tall, commanding sky-captain shape' },
    { key: 'clockwork_harness', ko: '태엽 날개형', kot: '등에 멘 놋쇠 태엽 날개 하네스가 크게 펼쳐지고 몸에 맞는 조끼 차림 — 날개가 실루엣의 중심', en: 'a harness of brass clockwork wings spreading wide from her back over a fitted vest — the clockwork wings make the shape' },
    { key: 'opera_diva', ko: '오페라 디바형', kot: '어깨가 드러난 긴 드레스와 팔꿈치 위 긴 장갑, 높이 솟은 깃털 관 — 무대 위에서 빛나는 실루엣', en: 'an off-shoulder long gown, opera gloves above the elbow and a tall feathered headdress — a glittering opera-diva shape' },
    { key: 'clockwork_bodice', ko: '태엽 보디스 드레스형', kot: '놋쇠 뼈대가 드러난 몸에 맞는 보디스와 톱니 장식 단의 드레스 — 기계 장식이 몸선을 그리는 실루엣', en: 'a fitted bodice with visible brass boning and a gown hemmed with little gear ornaments — clockwork detailing traces her shape' },
    { key: 'lady_inventor', ko: '숙녀 발명가형', kot: '걷어 올린 소매의 블라우스와 공구 허리띠, 뒤가 부푼 치마, 머리 위 고글 — 손이 바쁜 실루엣', en: 'a blouse with rolled sleeves, a tool belt, a bustled skirt and goggles pushed up on her head — a busy, clever lady-inventor shape' },
    { key: 'ringmaster', ko: '서커스 단장형', kot: '몸에 맞는 붉은 연미복과 실크해트, 승마 장화, 손에 든 지휘봉 — 무대를 이끄는 실루엣', en: 'a fitted red tailcoat, a silk top hat, riding boots and a slim baton in hand — a showy ringmaster shape' },
    { key: 'detective_cape', ko: '탐정 케이프형', kot: '어깨 케이프가 겹친 긴 코트와 체크 무늬 모자, 장갑 — 곧고 날카로운 실루엣', en: 'a long coat with a layered shoulder cape, a checked cap and gloves — a sharp, upright detective shape' }
  ];
  var SILHOUETTE_HEAD = { fantasy: 'OUTFIT SILHOUETTE: ', steampunk: 'OUTFIT SILHOUETTE: ', cyberpunk: 'OUTFIT SILHOUETTE: ' };
  /* 짧은 세계 그림(2026-11-09 삼국지 공방에서 옮김 — 사용자 「element 쪽도 생성기 구조 sam 쪽에 맞추자. 간결버전에」).
     줄 꼴 판의 긴 지시문에서 설계 칸만 뽑아 400~600낱말: 머리말(CONCEPT) · 화풍 단락 · 얼굴 · 체형 · 얼굴 비율 · 원소 · 가문 · 세계와 차림 · 노출 · 자세 · 표정 · 구도 · 빛 · 끝 줄 */
  /* GPT 임의 설계 세계 그림(2026-11-09 삼국지 공방과 같이 — 사용자 「element, pkm 쪽도 넣어주고」). 세계마다 네 장 = 우리 설계(<세계>-prompt.txt) 둘 + 이 설계 주문(<세계>-free.txt) 둘.
     정해 두는 것은 누구인지 · 원소 성질(영감으로만) · 세계 · 화풍 · 크기 · 노출 · 얼굴 비율 · 구도 · 끝 줄뿐. 맡은 쪽(GPT · Claude)은 우리 갈래에 없는 것 위주로(같은 날 「최대한 없는걸로」) */
  var WORLD_FREE = {
    head: "Design brief — your own take on this character. A full-body vertical 2:3 (1024×1536) character card image of an adult {people} woman — {concept} Age: {age}",
    /* 2026-11-09 삼국지와 같이 — 「세계컷 의상과 무기는 우리가 만든 의상들 안에서 … 그 외의 얼굴이나 헤어색, 스타일은 자유롭게」 · 「본인만의 생각을 담으면」 → 「응 좋은 아이디어야」 */
    free: "You design her yourself: invent her face, eye colour, hairstyle, makeup, expression, pose and setting as a fresh, original take — do not follow any earlier design of this character. Her hair colour and costume are NOT free: take them from our designs below.",
    /* 2026-11-09 사용자 「gpt에 세계컷 맡길때는 머리색까진 고정하는게 좋을거 같네. 마음에 안들면 설계를 바꾸는게 날 거 같아」 — 머리색은 우리 설계값, 헤어스타일만 자유. 원소는 한때 되돌렸다가(같은 날 「우선은 삼국지만」) 「원소공방에도 gpt 설계쪽에 머리색은 우리 설계 그대로로 바꾸자」 로 다시 */
    hair: "Hair colour (fixed — ours): {hair}. Keep exactly this hair colour; only the hairstyle is yours.",
    costume: "Costume (choose one of ours, then add your own idea): pick ONE of these costume shapes from our set and keep its overall silhouette — {list}. Then add one signature idea of your own drawn from her city's symbols, built into the construction of the outfit itself rather than as a print or a loose accessory — e.g. a hem, sleeve or collar cut into the shape of one of its landmarks. Build it in this world's materials and our colours below.",
    palette: "Costume colours (ours): {palette}.",
    second: "If you have already drawn a free design of her in this session, make this one clearly different — another face and hairstyle (the same hair colour), another costume shape with another signature idea, another pose and setting.",
    legend: "Inspiration only — her city on her: {traits}",
    world: "World (fixed): {world} Her costume and setting belong to this world.",
    expose: "Exposure (fixed): bold — her outfit shows skin by design (a deep neckline, bare shoulders or arms, a high slit or short hem); intimate areas covered.",
    /* 그 세계의 금지 낱말(설계표 vocab.markers.<세계>.banned_en — 판타지 · 스팀펑크의 지금 물건 · 명소 · 그을음 · 실사 질감). 도시 공방 2026-11-20 — 우리 설계의 Avoid 줄과 같은 목록 */
    banned: "Keep out of this world (fixed): {list}.",
    end: "Write your own detailed image prompt from this brief, then draw it. One figure only, natural hands with five fingers; no text, lettering or numbers anywhere in the picture; no logo or watermark.",
    /* 칸 채우기(삼국지 공방 2026-11-18 · 11-19 를 옮김, 사용자 2026-11-20 「칸 채우기로 옮겨줘」) — 맡은 쪽이 우리 설계 지시문을 글자 그대로 베끼고 표시한 칸만 채운다:
       헤어스타일 · 실루엣(그 세계 목록에서 글 그대로) · 체형(우리 목록) · 얼굴 여덟 칸(우리 것 뺀 목록) · Design idea · 서는 법 · 배경 세부. 화풍 · 빛 · 색 · 소품 · 노출 · 세계 · 몸 방향 · 구도 · 끝 줄은 우리 것.
       조립은 lib/prompt-city.js worldFillTemplate · buildWorldFree, 돌아온 글 검사는 worldFillErrors(tools/world-fill-check.cjs). 위 head ~ end 는 옛 열린 주문(이제 안 씀) */
    fill: {
      head: "Design brief — fill-in design for {name_en}. Below is our own design prompt for this card. Write two designs of her (Design 1 and Design 2) by copying it and changing ONLY the marked parts; every other line stays exactly as written, character for character — the style, skin finish, light, colours, prop, exposure, world, pose direction, composition and constraints are ours.",
      hair: "Must differ — hairstyle: write a new hairstyle in [HAIRSTYLE: …] (ours is {ours}).",
      hcol: "Must differ — hair colour: in [HAIR COLOUR: …] paste exactly one hair colour from our set, word for word; ours ({ours}) is not on this list: {list}.",
      sil: "Must differ — costume silhouette: in [COSTUME SILHOUETTE: …] paste exactly one of these shapes from our set, word for word; ours is not on this list: {list}.",
      idea: "Required — design idea: on the Design idea line, one visual feature of her legend or symbol built into the structure of the costume — its layering, a cross-section, a cut-out, a fastening or the arrangement of plates; never a print or a loose accessory. Inspiration only: {traits}.",
      body: "Must differ — build: in [BUILD: …] paste exactly one build from our set, word for word; ours ({ours}) is not on this list: {list}.",
      face: "Must differ — her face: in the Face line fill every marked part with exactly one entry from our lists below, word for word; ours is not on these lists. Design 1 and Design 2 must also differ from each other in every face part. {lists}.",
      free: "May keep or change — the Expression line; the Stance and hands and Setting detail lines may be filled or deleted.",
      two: "Design 1 and Design 2 must differ from each other in hairstyle, hair colour, build, costume silhouette and every face part.",
      near: "Registered designs to keep apart from (hairstyle and costume): {near}.",
      out: "For each design write, first, one line — SUMMARY: hairstyle …; costume silhouette …; design idea …; face …; expression … — then the whole prompt with the marked parts filled. Do not add, drop or reword any other line. Save Design 1 as -gpt1 and Design 2 as -gpt2.",
      sep: "---- our design prompt (copy it, fill only the marked parts) ----"
    },
    /* 칸 채우기 검사 말 — 화면 코드에 한글을 두지 않는다(tests/words.cjs) */
    msg: {
      body_off: "체형이 우리 체형 목록의 글이 아니다(우리 것 · 고친 글 · 목록 밖): ",
      hcol_off: "머리색이 목록의 글이 아니다(우리 것 · 고친 글 · 목록 밖): ",
      hcol_empty: "머리색 칸을 안 채웠다",
      two_hcol: "두 설계의 머리색이 같다",
      two_body: "두 설계의 체형이 같다",
      hair_empty: "헤어스타일 칸을 안 채웠다",
      hair_same: "헤어스타일이 우리 설계와 같다(",
      idea_empty: "Design idea 줄을 안 채웠다",
      line_added: "없는 줄이 더해졌다: ",
      line_changed: "줄이 바뀌었다: ",
      line_head: "줄이 바뀌었다(앞머리): ",
      line_missing: "줄이 빠졌다: ",
      face_off: "얼굴 칸이 목록의 글이 아니다(우리 것 · 목록 밖 · 고친 글) — ",
      no_card: "카드가 없다",
      no_summary: "첫 줄이 SUMMARY: 가 아니다",
      outside_changed: "칸 밖 글이 바뀌었다: ",
      sil_off: "실루엣이 목록의 글이 아니다(우리 것 · 목록 밖 · 고친 글): ",
      slot_empty: " 칸을 안 채웠다",
      two_face: "두 설계의 얼굴 칸이 같다 — ",
      two_hair: "두 설계의 헤어스타일이 같다",
      two_sil: "두 설계의 실루엣이 같다"
    }
  };
  /* 일상컷 옷 자유 컷(삼국지와 같이) — 여섯 장 묶음 때의 꼴, Outfit 줄이 이 주문. 2026-11-11 부터 새 묶음은 아래 FREE_DESIGN(장면 통째 자유) — 이 글은 옛 기록(sfree 없는 ofree)을 다시 지을 때만 */
  var OUTFIT_FREE = "Outfit: your own design — create a revealing, fashionable outfit for this place and moment, as daring as the scene allows: a figure-hugging cut with bare skin by design (neckline, shoulders, midriff or legs), styled with care. New design: before drawing, read our outfit catalog (outfit-catalog.md in this pack — every outfit type we already use) and design one that is NOT in it, then write that outfit into this line; it stays";   /* 같은 날 「일상컷도 우리쪽 의상자료를 참고하라고해서 여기 없는걸 선택하라고 하자」 — 목록은 묶음의 outfit-catalog.md */
  /* 일상컷 자유 설계 덩어리(2026-11-11 사용자 「장소·활동·자세·구도·의상을 자유롭게 설계해줘. 캐릭터의 특징에서 출발해, 예상하지 못했지만 그 캐릭터에게 자연스럽게 어울리는 일상의 한 순간을 보여줘.
     참신함은 장식의 양보다 상황과 행동에서 만들어줘. 최근 작업과 비슷한 장면은 피하고, 얼굴·화풍·인체 규칙은 유지해줘. 필수갈래랑 상황노출 두개를 묶어서 이렇게 가자. 그리고 지금 맡겨놓은 일상컷 1장도 같이 이런식으로」).
     옷 자유 칸(ofree)과 갈래 자유 칸(gfree)이 같이 쓴다 — 계획기가 장면 줄(장소 · 자세 · 구도 · 손 · 소품 · 시대)을 짜지 않고 이 덩어리를 싣는다. 글은 여기 한 곳.
     「…」 는 맡은 쪽(GPT 세션은 GPT, API 길은 Claude)이 채우고, 채운 글은 기록 generation.free_prompt(넘긴 지시문 통째) · free_design(채운 덩어리)에 남긴다.
     갈래 자유 칸은 family · situ 두 줄을 Outfit 줄 바로 위에 더한다. 옷 자유 칸의 Outfit 줄은 outfitFree(목록에 없는 옷). 노출 · 몸 줄은 짧은 판이 Outfit 줄 끝에 붙인다 */
  var FREE_DESIGN = {
    head: "FREE DESIGN: design the place, activity, pose, framing and outfit yourself. Start from who she is — her legend, traits and personality — and show an everyday moment that is unexpected yet feels natural for her. Make it fresh through the situation and what she is doing, not through more decoration. Avoid scenes like the recent ones listed below. Keep her face, the art style and the body and anatomy rules exactly as stated. Before drawing, write your design into the lines below, then draw it. In your pose, give each hand one job only and say plainly where each arm goes; avoid poses where it is unclear which shoulder an arm comes from — an arm behind her back, behind her head or pinned under her body — and never state where a foot sits under water. Do not make it another small repair, adjusting, measuring or sorting task at a workbench, repair stall, equipment room or locker room — those scenes are already in our own list; choose another kind of everyday moment (rest, play, a meal, travel, weather, getting ready, simply being in the place).",   /* 끝 두 문장(2026-11-13 — 팔 · 물속 발 사고, 자유 설계가 「작업대에서 손보기」 한 틀로 굳음. 그 틀은 우리 자세 추천에 넣었다) */
    recent: "Recent scenes to avoid: {recent}.",
    recentNone: "none yet",
    lines: ["Place: …", "Activity: …", "Pose: …", "Framing: …"],
    /* 갈래는 큰 범위만 · 상황은 열기(사용자 2026-11-11 「상황도 열어주자. 옷도 이제 큰범위로만 지정해줘. 수영복갈래면 우리쪽에서 선택해도 되고, 본인이 골라도 되는데, 최대한 우리쪽에 없는걸 고르게」) */
    family: "Outfit family (required): {family} — any {family} outfit; you may pick one from our outfit catalog (outfit-catalog.md in this pack) or design your own, but prefer one that is not in it.",
    situ: "Situation (required): right now — {situ}.",
    /* {family} 자리는 짧은 이름 — 문장 안에 두 번 들어가 트리 표의 긴 영어 글을 넣으면 깨진다(삼국지 공방과 같은 이름) */
    familyNames: { lingerie: 'lingerie-inspired', swimwear: 'swimwear', roleplay: 'role-play costume' },
    familyNot: "Not the same outfit as the one already in this set: {item}.",   /* 갈래 자유 칸 — 그 갈래 필수 컷의 옷(scene.gnot)을 피한다(2026-11-20) */
    situFree: "Situation (required): a situational exposure moment of your own design that fits the scene — prefer one that is not among ours: clothes soaked by rain or a splash, clothes caught by a strong gust of wind, a top worn half undone, a strap slipped off the shoulder, a hem knotted up under the bust, an outer layer tied around the waist, a sheen of sweat from heat, a backlit silhouette through thin fabric, a skirt slit fallen open, sleeves pushed up with one more button undone, a tie or scarf pulled loose.",
    outfit: "Outfit: …",
    outfitFree: "Outfit: … (a revealing, fashionable outfit that is not in our outfit catalog — outfit-catalog.md in this pack)"
  };
  var WORLD_SHORT = {
    head: "A full-body vertical 2:3 (1024×1536) character card image of an adult {people} woman — {concept}",
    /* 미형이되 세계마다 다른 얼굴(사용자 2026-11-19 「웬만하면 미형으로 가고」 · 「같은 얼굴은 피하고」) — 화풍 줄 바로 뒤, 얼굴 칸(Her · Face)보다 앞 */
    beauty: "She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the description below, not a generic pretty face.",
    /* 금지 나열을 뺐다(2026-11-11 감사 E2 — Her 줄의 「long face」 · 「softly square face」 · 가는 눈을 이 줄이 다시 막았다. 원소 금 판타지 두 쌍에서 긴 얼굴이 세지지 않아 사용자 「넣어주고」) */
    face: "Face proportions: a short midface and a soft, gently rounded jawline with a small soft chin; any crown or headpiece sits above her hairline. Her eyes keep the shape and size described above.",
    pose: "standing confidently, her body turned slightly while her face looks toward the viewer",
    /* 카메라는 얼굴 높이 · 고개 수평(2026-11-10 — 사용자 「세계컷 만드는중인데 그 고개를 뒤로 젖히다보니 일상컷도 다 고개를 젖히거나 하관이 길어지게 나와」. 가슴 높이 카메라는 얼굴을 아래에서 올려다봐 턱 밑이 보이고 하관이 길어졌다 — 포켓몬 공방과 같은 문장) */
    composition: "Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.",
    light: "Light: the scene's own light, rendered the way this style renders light and skin.",
    end: "One figure only, natural hands with five fingers; no text, lettering or numbers anywhere in the picture; no logo or watermark.",
    guard: { fantasy: "", steampunk: "", cyberpunk: "" }
  };

  var CASUAL = {
    input: "INPUT: the attached image is the approved character — her {world_en} card; keep her. Do not reuse earlier conversation images.",
    /* CHARACTER 한 문장(도시 한 층 — Task 3 에서 원소 말만 도시로, 일상컷 갈래는 Task 4). 얼굴·머리·몸은 첨부 그대로, 옷만 바꾼다 */
    character: {
      city: "CHARACTER: the same {people} woman as the attached image — the personification of {city_en}, seen in her everyday life. Keep her face, eye and hair colors, haircut, skin tone and body proportions; expression and hair motion may change, and her hair may be worn differently only as SCENE's Hair line says. Her city shows ONLY as a small accessory, an object around her, or the object PROP says she holds — never in the outfit's colours, patterns or cut, never as armor, regalia or a costume."
    },
    /* 시간대 — 계절·날씨 뒤. 비우면 싣지 않는다(사용자 2026-10-30 「일상컷에 시간대」) */
    times: [
      { key: 'morning', ko: '아침', en: 'early morning — low clean light, long soft shadows' },
      { key: 'noon', ko: '한낮', en: 'midday — bright even light' },
      { key: 'golden', ko: '해 질 녘', en: 'golden hour — warm low sun, long shadows' },
      { key: 'dusk', ko: '땅거미', en: 'dusk — blue hour, lights coming on' },
      { key: 'night', ko: '밤', en: 'night — the scene lit by lamps, screens or windows, dark outside' },
      { key: 'neon', ko: '네온 밤', en: 'night under neon and signage light, coloured reflections' },
      { key: 'lamplight', ko: '등불', en: 'warm lamplight or candlelight indoors, the rest in shadow' }
    ],
    /* 머리 변화 — 첨부 그림의 색·길이는 지키고 매무새만(사용자 2026-10-30) */
    hairs: [
      { key: 'tied', ko: '묶음', en: 'her hair tied up in a loose bun or ponytail — same colour and length as the attached image, a few strands loose' },
      { key: 'down', ko: '풀어 내림', en: 'her hair let down loose over her shoulders — same colour and length as the attached image' },
      { key: 'braid', ko: '땋음', en: 'her hair in a single loose braid over one shoulder — same colour and length as the attached image' },
      { key: 'hat', ko: '모자·후드', en: 'a casual hat, cap or hood that suits the outfit, her hair showing beneath it — same colour and length as the attached image' },
      { key: 'wet', ko: '젖은 머리', en: 'her hair wet and slicked back or dripping — same colour and length as the attached image' }
    ],
    /* ── 2026-11-09 삼국지 공방에서 옮김(사용자 「element 쪽도 생성기 구조 sam 쪽에 맞추자. 간결버전에 일상컷도 간결, 갈래추가」) ── */
    /* 옷 색 — 일상컷만(사용자 2026-11-08 「일상컷 생성 옵션에 의상색 관련 다양성은 없었나?」 → 「응 넣어줘」). 색 말이 없는 옷은 모델이 흰색 · 아이보리 · 베이지로 몰렸다.
       고르면 Outfit 줄 끝에 붙는다(GPT 구조형도 그 칸 그대로). 비우면 예전처럼 옷 제 색. 옷 이름에 색 · 무늬가 박힌 것(colorFixed)은 붙이지 않는다 — 메이드 블랙 · 크리스마스 레드 그대로.
       묶음 도구(tools/casual-plan.cjs)는 한 카드 묶음의 장면 컷마다 서로 다른 갈래를 나눠 준다. 세력색 금지(WARDROBE · OUTPUT)는 그대로 */
    colors: [
      { key: 'pastel', ko: '파스텔', en: 'a soft pastel palette such as powder pink, baby blue, mint or lavender' },
      { key: 'vivid', ko: '비비드 원색', en: 'one bright, saturated colour such as cherry red, cobalt blue, sunflower yellow or kelly green' },
      { key: 'earth', ko: '어스톤', en: 'warm earth tones such as camel, olive, terracotta, chocolate or burgundy' },
      { key: 'mono', ko: '모노톤 블랙', en: 'a monochrome palette of black and charcoal with at most one white or grey accent' },
      { key: 'jewel', ko: '주얼톤', en: 'rich jewel tones such as emerald, sapphire, amethyst or wine red' },
      { key: 'denim', ko: '데님 · 인디고', en: 'denim blues and indigo, with white or cream as the only second colour' },
      { key: 'pattern', ko: '무늬', en: 'a clear pattern such as a floral print, bold stripes, gingham or plaid, in two or three cheerful colours' },
      { key: 'neutral', ko: '화이트 · 뉴트럴', en: 'clean neutrals such as white, ivory, oatmeal or soft grey' }
    ],
    colorLine: ' — in {color}; the outfit colour reads clearly at first glance',
    colorFixed: '\\b(?:black|white|red|green|denim|cream|navy|pink|blue|grey|gray|pastel|crimson|scarlet|ivory|beige|floral|striped|stripes|plaid|gingham|leopard|camo|camouflage|tartan|polka)\\b',
    /* 데니어(실 굵기) — 일상컷 옷의 비침, 노출 단계(skin_exposure)와 따로(사용자 2026-11-08 「데니어 설정값 넣어서 랜덤하게 설정될 수 있게 해줘. 기존 노출설정값 과는 별개로」).
       오프숄더 니트 25데니어 시험(장료)에서 니트가 은은히 비쳤고, 가죽 일상 시험(조운)에서 25데니어 이너는 가슴까지 비쳐 — 상의는 40데니어부터, 가슴은 늘 불투명 안감, 타이츠 · 스타킹만 25데니어까지.
       맞는 옷(denierFit — 니트 · 얇은 천 상의 · 타이츠 · 가죽 옷의 이너)에만 Outfit 줄 끝에 붙는다. 수영복 · 란제리는 붙이지 않는다(denierSkip). 비우면 예전처럼 옷 그대로 */
    deniers: [
      { key: 'd40', ko: '40데니어 — 얇게 비침', top: 40, legs: 25 },
      { key: 'd60', ko: '60데니어 — 은은히 비침', top: 60, legs: 40 },
      { key: 'd80', ko: '80데니어 — 살짝 비침', top: 80, legs: 60 }
    ],
    denierLine: '; fabric weight — its knit or thin-fabric pieces (a top, an inner top or a knit dress) are {top}-denier yarn, semi-sheer so her skin tone and body line show softly through, with a fully opaque lining over the bust and the hips; any tights or stockings are sheer {legs}-denier nylon; shorts, skirts, leather, denim and other heavy materials stay opaque',
    denierFit: '\\b(?:knit|knitted|sweater|cardigan|jumper|pullover|tights|stockings?|pantyhose|leggings|mesh|chiffon|tulle|jersey|ribbed|tee|t-shirt|tank top|camisole|cami|blouse|leather)\\b',
    denierSkip: '\\b(?:bikini|swimsuit|swimwear|swim|lingerie|bralette|bra|corset|garter|negligee|babydoll)\\b',
    /* 상황 노출(2026-11-09 사용자 「1번 … 필수갈래에 넣어줘」) — 옷 갈래가 아니라 어떤 옷에든 얹는 순간 하나. 평범한 옷도 노출이 오른다.
       묶음 도구는 보통 컷 한 장(필수 · 코스프레 · 자유 칸이 아닌 컷 — 2026-11-20)에 꼭 하나를 주고, 갈래 자유 컷(FREE_DESIGN)은 열린 상황(free)이다(2026-11-11). 맞는 옷(fit, skip)에만 Outfit 줄 끝에 붙는다.
       「옷 갈아입는 중」 같은 것은 필터에 잘 걸려 넣지 않는다. 젖어도 천은 불투명 */
    situations: [
      { key: 'wet', ko: '젖은 옷 — 비 · 물 튐', en: 'a sudden rain shower or a splash of water has just soaked her clothes — the damp fabric clings to her body line and darkens in patches, a few wet strands of hair stick to her neck and cheek; the fabric stays opaque',
        enIn: 'a splash of water has just soaked her clothes — the damp fabric clings to her body line and darkens in patches, a few wet strands of hair stick to her neck and cheek; the fabric stays opaque',   /* 실내(장소 특징 indoor) — 비가 아니라 물 튐(2026-11-13) */
        fit: '.', skip: '\\b(?:bikini|swimsuit|swimwear|swim|monokini|towel|bathrobe|sauna|onsen|jjimjilbang)\\b' },
      { key: 'wind', ko: '바람에 날림', en: 'a strong gust of wind catches her clothes — the hem and every loose piece of fabric lift and flutter, pressing tight against her body line on the windward side, her hair blown to one side',
        fit: '\\b(?:skirt|miniskirt|dress|gown|shirt|blouse|robe|coat|trench|cardigan|cape|cloak|scarf|shawl|hanfu|kimono|yukata|qipao|hanbok|chiffon|tulle|slip|kaftan|sarong|pareo|wrap|drape|draped|chiton|peplos|veil|sash|flowing|wide-leg|culottes)\\b', skip: '', not_has: ['indoor'] },
      { key: 'undone', ko: '반쯤 푼 차림', en: 'she wears her top half undone — the zip or the top buttons open much lower than usual, so the neckline falls open over her collarbones and the inner curve of her chest, the loose edges slipping apart',
        fit: '\\b(?:shirt|blouse|jacket|zip|zipped|zip-up|hoodie|jumpsuit|catsuit|cardigan|buttons?|button-up|button-down|coat|blazer|track|tracksuit|overalls|parka|bomber|vest|waistcoat|uniform|leather jacket|flight suit|robe)\\b', skip: '\\b(?:bikini|swimsuit|lingerie|bralette)\\b' },
      { key: 'strap', ko: '흘러내린 어깨끈', en: 'one strap — or one side of the neckline — has slipped down off her shoulder, baring that whole shoulder and the top of her arm; she leaves it as it is',
        fit: '\\b(?:straps?|strappy|cami|camisole|slip|tank|dress|sundress|gown|off-shoulder|sweater|knit|jumper|tee|t-shirt|top|crop|bra|bralette|bodysuit|leotard|chemise|nightgown|nightdress|negligee|babydoll|corset|bustier|halter|blouse)\\b', skip: '' },
      /* 2026-11-13 — 상황이 넷뿐이라 묶음마다 같은 넷이 돌았다(사용자 「그게 종류가 적은걸로 알아」). 옷 상태만 말하고 팔 동작은 말하지 않는다(손 줄과 부딪힌다). 조건은 lib/casual-tree-v2.js situOk */
      { key: 'knot', ko: '밑단을 묶어 올림', en: 'she has knotted the hem of her top up under her bust to keep it out of the way, baring her midriff and waist',
        fit: '\\b(?:shirt|tee|t-shirt|blouse|top|tank|sweater|knit|jumper|jersey|hoodie|flannel)\\b', skip: '\\b(?:bikini|swimsuit|swimwear|lingerie|bralette|dress|gown|bodysuit|leotard|corset|bustier|crop|cropped|knotted|bandeau)\\b' },
      { key: 'waist_tied', ko: '겉옷을 허리에 묶음', en: 'she has slipped her outer layer off and tied it around her waist by its sleeves, leaving only the fitted inner top over her bare shoulders and arms',
        fit: '\\b(?:jacket|hoodie|cardigan|coat|blazer|coverall|jumpsuit|flannel|overshirt|parka|bomber|track|tracksuit|windbreaker|trench)\\b', skip: '\\b(?:bikini|swimsuit|swimwear|lingerie)\\b' },
      { key: 'sweat', ko: '더위에 밴 땀', en: 'the heat of the place has left a fine sheen on her skin, her top clinging lightly at the collar and the small of her back, a few damp strands at her temples; the fabric stays opaque',
        fit: '.', skip: '\\b(?:towel|bathrobe|coat|parka|fur)\\b', groups: ['spa', 'sports'], place_rx: 'furnace|kiln|sauna|oven|forge|desert|dune|greenhouse|kitchen|galley|gym|hot spring|steam|boiler|stove|jungle|oasis|ranch|summer|saltpan|salt pan|dance' },
      { key: 'sheer_light', ko: '역광에 비친 실루엣', en: 'strong light from behind passes through the thin outer fabric, so the outline of her figure shows as a soft silhouette inside it; the inner layer stays fully opaque',
        fit: '\\b(?:dress|sundress|skirt|shirt|blouse|robe|chiffon|slip|kaftan|linen|tunic|gown|hanfu|drape|draped|chiton|sarong|pareo|nightgown|negligee|yukata)\\b', skip: '\\b(?:leather|denim|bikini|swimsuit|swimwear|latex|vinyl|armou?r)\\b', needs_any: ['window', 'sky'], not_has: ['night'] },
      { key: 'slit', ko: '움직임에 벌어진 트임', en: 'the slit or wrap of her skirt has fallen open along one thigh with her movement, baring that leg up to the hip line; the fabric stays in place',
        fit: '\\b(?:slit|wrap|wrapped|qipao|cheongsam|kimono|yukata|sarong|pareo|robe|hanfu|gown|kaftan|side-tie)\\b', skip: '\\b(?:bikini|swimsuit|trousers|pants|jeans|shorts)\\b',
        postures: ['walk', 'step_up', 'sit_chair', 'sit_edge', 'sit_sideways', 'half_kneel', 'kneel'], frames: ['three_quarter', 'full_body', 'environmental'] },
      /* 일하다 풀어지는 순간(2026-11-13 사용자 「옷에 맞더라도 조금은 보이게」) */
      { key: 'sleeves_up', ko: '소매를 걷고 단추 하나를 풂', en: 'mid-task she has pushed her sleeves up above the elbows and opened one more button at the collar, baring her forearms and collarbones',
        fit: '\\b(?:shirt|blouse|coat|jacket|uniform|coverall|jumpsuit|robe|cardigan|overshirt|lab coat)\\b', skip: '\\b(?:bikini|swimsuit|swimwear|lingerie|bralette|sleeveless|strapless|bandeau)\\b' },
      { key: 'tie_loose', ko: '넥타이 · 스카프를 풀어 내림', en: 'she has pulled her tie or neck scarf loose and let it hang open, the collar unfastened over her collarbones',
        fit: '\\b(?:tie|necktie|scarf|neckerchief|bow tie|ribbon tie|uniform|suit|blazer)\\b', skip: '\\b(?:bikini|swimsuit|swimwear|lingerie)\\b' },
      /* 장소에서 생기는 순간(2026-11-23 일상컷 장소 보충) — place_rx 로 그 장소에서만. 옷 상태만 말하고 팔 동작은 말하지 않는다 */
      { key: 'splash', ko: '물보라를 뒤집어씀(워터파크)', en: 'a wave or a burst of spray from the slide has just broken over her — water streams down her skin and drips from her hair and chin, droplets glittering, the fabric slick and clinging to her body line; the fabric stays opaque',
        fit: '.', skip: '\\b(?:towel|bathrobe|coat|parka|fur)\\b', place_rx: 'water park|wave pool|water slide' },
      { key: 'snow_flurry', ko: '눈발 속에 반쯤 연 지퍼', en: 'snow flurries swirl around her after a fast run — flakes caught in her hair and lashes, cheeks flushed, and her front zip has come down halfway to cool off, the collar falling open over the fitted layer beneath',
        fit: '\\b(?:jacket|ski|parka|coat|suit|zip|zip-up|hoodie|anorak|puffer|sweater)\\b', skip: '\\b(?:bikini|swimsuit|swimwear|lingerie)\\b', not_has: ['indoor'], place_rx: 'ski slope|snowy|sledding|snow dome' },
      { key: 'ride_wind', ko: '놀이기구가 일으킨 바람', en: 'the rush of air from a ride sweeping past right behind her whips her hair back and presses her clothes flat against her body line, the hem and every loose piece of fabric fluttering hard',
        fit: '\\b(?:skirt|miniskirt|dress|gown|shirt|blouse|robe|coat|cardigan|cape|scarf|chiffon|tulle|slip|kaftan|sarong|pareo|wrap|flowing|wide-leg|culottes)\\b', skip: '', not_has: ['indoor'], place_rx: 'roller coaster|carousel|amusement park|fairground|water slide|chairlift' },
      { key: 'cheer_spray', ko: '응원석 물세례', en: 'a summer cheering spray fired over the stands has caught her — her top darkened in damp patches and clinging to her body line, droplets beading on her collarbones and arms; the fabric stays opaque',
        fit: '.', skip: '\\b(?:bikini|swimsuit|swimwear|swim|monokini|towel|bathrobe|coat|parka|fur)\\b', needs_any: ['sky'], place_rx: 'stadium|stands of' },
      { key: 'dryer_gust', ko: '드라이어 바람', en: 'the warm blast of a hair dryer lifts her hair in a loose cloud and flutters her loose neckline open over her collarbones',
        fit: '\\b(?:shirt|blouse|robe|gown|cape|slip|dress|camisole|cami|wrap|kimono|top|tee|knit|sweater)\\b', skip: '', place_rx: 'hair salon|changing room|dressing room|dressing chamber|grooming suite' }
    ],
    situLine: '; right now — {en}',
    /* 게임 코스프레 컷(원소 공방 2026-11-15 에서 옮김, 도시 2026-11-20 — 일상컷 필수 다섯 중 하나, 의상 자체가 그 게임 캐릭터를 드러낸다).
       트리 의상 계열 game_cosplay(cosplay: true). Outfit 줄은 data/game-cosplay.json 의 글(fixed · assigned · again — lib/prompt-city.js cosplayText).
       이 컷은 옷 색 · 데니어 · 상황 · 세계 평상복 결(세계 소품 사전 clothes)을 얹지 않고, 짧은 꼴 headwear 줄 · 긴 꼴 OUTPUT · WARDROBE · CHARACTER 끝 「도시는 장신구로만」 문장을 아래 줄로 바꾼다.
       게임 · 캐릭터 이름을 지시문에 넣는 것은 사용자 결정 — 「실제 작품 · 상표 이름은 지시문에 쓰지 않는다」 의 예외(이 갈래만) */
    cosplay: {
      short: "Costume: her outfit itself shows that game character — the costume's recognisable colours, shapes and parts at first glance, rebuilt as a glamorous adult outfit. She is a real woman wearing a cosplay of that character, not the character: her face, hair colour and body stay exactly as in the attached image — never the character's face, body, creature shape, logo or readable text. Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, armour or regalia from it; only the costume's own pieces.",
      output: "OUTPUT: one standalone off-duty scene of her wearing the cosplay chosen in SCENE, as worn to a costume event, a photo shoot or at home. In this cut the game character shows in the outfit itself: its recognisable colours, shapes and parts. Everything else follows SCENE (chosen).",
      wardrobe: "WARDROBE: change her clothes completely into the cosplay SCENE describes. From the attached image take only her face, hair and body — not its garment, armor, regalia, ornaments, implants or background. The costume must read at first glance as that character's look, rebuilt as a glamorous adult outfit; she is a real woman in a cosplay of that character, not the character — her face, hair colour and body stay as in the attached image; never the character's face, body, creature shape, logo or readable text.",
      city: "Her city stays out of this outfit; the outfit is the game character's cosplay SCENE describes."
    },
    shortAll: true,   /* 모든 화풍이 짧은 일상컷(2026-11-08 「다른 화풍도 켜주고」) — 판에 casualShort: false 면 옛 꼴 */
    short: {
      output: "Output: one vertical 2:3 image, 1024×1536.",   /* 크기(2026-11-09) — 짧은 판에서 빠졌던 것 */
      /* 화면비마다(2026-11-23 — 계획의 scene.aspect, 공용 모듈 aspectFor: 눕는 자세 · 환경 컷 3:2, 허리 위 · 3/4 1:1). 자유 설계 칸은 늘 2:3 */
      outputs: { '2:3': "Output: one vertical 2:3 image, 1024×1536.", '1:1': "Output: one square 1:1 image, 1024×1024.", '3:2': "Output: one horizontal 3:2 image, 1536×1024." },
      who: { city: "the personification of {city_en}" },
      input: "Use the attached image as the reference: the same adult {people} woman — {who} — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.",
      beauty: "She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.",
      face: "Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.",
      keep: "Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.",
      expose: {
        bold: "showing her shoulders, collarbones and legs as far as the outfit allows",
        moderate: "open at the collarbone and showing her arms or lower legs",
        low: "mostly covered"
      },
      body: "following her curvy figure — a slim waist and rounded hips; intimate areas covered",
      legend: "Her city — {traits} — may show in the outfit's details, motifs or small accessories.",
      /* 세계 그림의 관 · 머리 장식 · 예복 장식은 가져오지 않는다(2026-11-09 장료 일상 세 장에 초승달 관 · 깃털이 남았다 — 사용자 「응 b는 고쳐줘」) */
      headwear: "Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.",
      light: "Light: the place's own light, lit and coloured the way this style renders light and skin.",
      end: "One figure in focus, natural hands with five fingers, no text, numbers, logo or watermark.",
      /* 돌봄 장소(트리 묶음 companion — 2026-11-23): 한 사람 + 장면이 이름 부른 동물 한 마리 */
      endCompanion: "One woman in focus with exactly one animal companion as the scene describes — a separate animal at its own natural scale, its body never merged with hers, not a second human; no other animals. Natural hands with five fingers, no text, numbers, logo or watermark."
    },
    /* 동물(2026-11-23 사용자 — 몸에 붙어 나와 막아 두던 것을 장소로 연다): 보통 장소엔 동물 없음, 동물원 · 수족관 · 동물 카페 · 연못(트리 animals)은 배경에만, 돌봄 장소는 endCompanion · figureCompanion */
    creatures: {
      none: "No animals or other creatures.",
      background: "Animals of this place appear only in the background — behind glass, fences or at a distance, at natural scale, never touching or merged with her."
    },
    /* 팔레트·시각 언어는 장신구 힌트로만. 피부·머리·눈은 첨부 그림의 그 사람 */
    design: "DESIGN (accessory hints only): her city's visual language — {traits} — may inform at most one small accessory, a hair ornament or an object beside her, in its palette ({palette}). The clothes keep the chosen outfit's own colours; her skin, hair and eyes stay as in the attached image.",
    /* 2026-11-01 — 「soft full cheeks · soft smile」 을 뺐다(얼굴을 하나로 만들었다). 얼굴 · 나이는 첨부 그림의 그 사람, 표정은 SCENE 의 것 */
    age: "AGE: the same adult woman as in the attached image — keep her own face shape, cheekbones, eye proportions and skin tone exactly; minimal facial lines (no nasolabial folds, crow's feet, under-eye bags or cheek creases).",
    output: "OUTPUT: one standalone off-duty scene of her in the outfit chosen in SCENE; her city shows only through accessories and objects around her — never in the outfit's colours, patterns or cut, never as armor, regalia or a costume. Everything else follows SCENE (chosen).",
    frame: "FRAME: {frame} image. Compose the image for this frame; COMPOSITION in SCENE sets how much of her shows.",
    crop: "CROP: {edge}. This crop wins over every other line: details apply only to the part that shows, and the outfit reads through its visible neckline, straps, fabric and colour. Never widen the framing to show a hidden support, hand or leg; a limb crossing the edge runs naturally on past it, never cut off or fading out inside the image.",
    /* 시대 하나(2026-11-19 Task 4 — 트리 표 eras 는 now 하나: 그 세계의 하루). 원소의 「지금 현실 · 쓰임의 현장 · 나라 안 · 무대」 넷은 걷었다 — 시대는 곧 세계(참고 그림의 세계).
       긴 판(casualShort 가 꺼진 화풍)은 이 줄, 짧은 판은 아래 life.world 줄 */
    era: {
      now: "WORLD: an ordinary day in {city_en} as her world knows it — {world}. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them; no second character, no readable text."
    },
    /* 일상컷 = 그 세계의 그 도시의 하루(설계 3-1절). 생활 장면표(data/city-life.json) · 세계 소품 사전(data/world-props.json) 을 싣는 줄들.
       world 의 {world} = 설계표 vocab.casual_world.<세계>.en(세계의 결 — 명소 목록인 도시 세계 글이 아니다, 2026-11-19), 다음 줄에 guard_en */
    life: {
      world: "World: an ordinary day in {city_en} as her world knows it — {world}. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.",
      around: "Around her, as her world makes them: {props}.",
      season: "Season: {en}.",
      /* 실내 장소면 계절은 창밖 · 옷차림으로만(2026-11-20 사용자 「계절표현이 보니까 나무들로 되있던데, 실내공간까지 따라들어오는것 같아」) */
      seasonIn: "Season: {en} — but she is indoors: show the season only through a window or in her clothing; no blossoms, petals, falling leaves, snow or trees inside the room.",
      weather: "Weather: {en}.",
      /* 금지 — 화풍 글의 「No …」 와 그 세계 banned_en. 지시문 맨 끝 한 단락(sections.negative) — 금지 낱말이 나와도 되는 곳은 여기뿐 */
      avoid: "Avoid: {list}.",
      avoidWorld: "Nothing from our present day in her world: {list}."
    },
    eraOther: "ERA: {en}.",
    worldPlace: "the place named in WORLD",
    screens: "SCREENS: any monitor, screen, poster or sign shows only abstract colored light, simple shapes or blank art — no readable text or numbers, no logo.",
    wardrobe: "WARDROBE: change her clothes completely. From the attached image take only her face, hair and body — not its garment, armor, regalia, ornaments, implants or background. Dress her exactly as SCENE describes; that outfit must read at first glance, keeping its own recognisable colours and parts. Do not carry the attached image's palette, patterns or trim into the outfit; her city belongs in accessories and props, never in the clothes — never restyle the chosen outfit into her city's palette, materials, patterns or regalia.",
    /* 가까운 컷의 옷 줄 — 「옷이 한눈에, 알아볼 부분이 다」 가 크롭 밖 치마·드레스 자락까지 불렀다(game 조조전 일상, 2026-10-29) */
    wardrobeClose: "WARDROBE: change her clothes completely. From the attached image take only her face, hair and body — not its garment, armor, regalia, ornaments, implants or background. Dress her exactly as SCENE describes; the part of that outfit inside the crop must read at first glance in its own colours. Do not carry the attached image's palette, patterns or trim into the outfit; her city belongs in accessories and props, never in the clothes — never restyle the chosen outfit into her city's palette, materials, patterns or regalia.",
    angle: "ANGLE: the attached image fixes who she is, not how she is posed or shot. Do not copy its head angle, head tilt, gaze direction, face size in frame, camera height or crop — turn her head, set her gaze and place the camera exactly as SCENE describes, and let her face read naturally from that new angle (profile, three-quarter, looking down or away), with her features staying the same. No default card pose, no default front-facing portrait.",
    /* 돌아보기 — 등이 카메라 쪽이고 고개를 어깨 너머로 돌렸을 때만. 눈이 어디를 보는지는 GAZE 줄이 정한다 */
    lookBack: "LOOK-BACK: her back is toward the camera and her head turns at most a quarter turn over one shoulder — the face shows in profile or three-quarter view, never full-front on a back-facing torso. Her chin sits just above the near shoulder, the far eye and cheek may be partly hidden, the side of the neck shows the turn and the shoulder line continues behind the head. Where her eyes go follows GAZE.",
    /* 붐비는 장소(레드카펫·입장 줄·관중석)는 작고 흐린 배경 인물을 허용한다(game 사용자 2026-10-29) */
    figure: "ONE MAIN FIGURE: she is the only character in focus. Where the place is busy, other people may appear only as small, soft-focus background extras — never posed with her. No logo, no watermark, no speech bubble, no frame border. No readable text or numbers.",
    figureCompanion: "ONE MAIN FIGURE: she is the only person in focus, with exactly one animal companion as SCENE describes — a separate animal at its own natural scale, its body never merged with hers, not a second human and not dressed like her; no other animals. Where the place is busy, other people may appear only as small, soft-focus background extras — never posed with her. No logo, no watermark, no speech bubble, no frame border. No readable text or numbers.",
    anatomy: "ANATOMY: natural adult proportions, about 7.5 heads tall — height from the legs, never a smaller head or a longer neck. The neck is a natural length and the head sits close to the shoulders. No body-part enlargement, no extra limbs.",
    /* 가까운 컷의 몸 줄 — 「7.5 등신·키는 다리에서」 가 전신을 부른다(game 스파2 일상, 2026-10-29) */
    anatomyClose: "ANATOMY: natural adult proportions, never a smaller head or a longer neck. The neck is a natural length and the head sits close to the shoulders. No body-part enlargement, no extra limbs.",
    body: "BODY: a normal human body — one head, two arms and two legs, each joined at its natural joint; elbows, knees and wrists bend the human way. Hands and feet may be partly hidden by the pose, what she holds or the frame. Right and left mean her own right and left, not the viewer's.",
    hands: "HANDS: natural human hands, no extra or duplicated limbs; each visible hand joins through its wrist and forearm to the matching shoulder. A hand may stay outside the crop, and fingers may be partly hidden by a grip.",
    handBusy: "her own {side} hand is in PROP",
    propOne: "with her own {side} hand she {action}; it is all she holds",
    propBoth: "with both hands she {action} — her own right hand {right}, her own left hand {left}",
    /* 소품 표의 「알아볼 거리」(signature) 자리 — 그 도시 · 그 세계의 작은 물건(설계표 hold). 보통은 트리 거르기(signature_hold 비움)가 고르지 않게 한다 */
    signatureProp: "{hold}",   /* 설계표 worlds.<세계>.hold.en — 일상컷에서 손에 드는 그 도시의 물건 */
    glasses: "; she wears thin-framed glasses"
  };
  /* 일상컷 고정값 — pkm·game 과 같다(IMAGE_RULES 일상컷 고정값). 생성기가 이 값으로 고르고 잠근다; 조립기도 빈 값이면 이 값으로 */
  var CASUAL_FIXED = { axes: { overall_intensity: 'strong', skin_exposure: 'bold' }, aspect: '2:3' };
  var ASPECT_OPTIONS = ['2:3', '3:2', '1:1', '9:16', '16:9'];
  /* 화면비 → FRAME 줄. 그림 크기는 2:3 이 1024×1536 · 1:1 이 1024×1024 · 3:2 가 1536×1024(그림 API 가 받는 셋 — 일상컷 화면비는 계획이 정한다, 2026-11-23) */
  var ASPECT_FRAME = { '2:3': 'a vertical 2:3 (1024×1536)', '3:2': 'a horizontal 3:2 (1536×1024)', '1:1': 'a square 1:1 (1024×1024)',
    '9:16': 'a tall vertical 9:16', '16:9': 'a wide horizontal 16:9' };
  /* CROP 줄의 아래 가장자리 — 「이 크롭이 이긴다」 만으로는 넓게 나왔다. 어디서 잘리는지를 말한다 */
  var CROP_EDGE = {
    waist_up: 'a waist-up shot — the bottom edge crosses her waist; hips, legs and feet are out of frame',
    chest_up: 'a chest-up shot — the bottom edge crosses just below her bust; waist, hips and legs are out of frame',
    face_close: 'a close-up — her face and hair fill most of the frame and the bottom edge crosses at her collarbones; nothing below the shoulders shows, and her hands and anything she holds stay below the frame unless raised to her face',
    detail: 'a detail shot — only the part of her the scene names fills the frame'
  };
  var CLOSE_FRAMES = Object.keys(CROP_EDGE);
  /* 추가 연출·장면 글에 이 말이 보이면 「손·소품은 칸에서 고르세요」 경고(막지는 않는다) */
  var CASUAL_HAND_WORDS = /\b(hold|holds|holding|hand|hands|grip|grips|cup|glass|phone|book|camera)\b|손|쥐|든다|들고|잔을/i;
  /* 가까운 컷의 노출 풀이 — 「배·다리 노출」 이 크롭 밖을 부른다. 노출은 CROP 안에서만, 컷은 움직이지 않는다 */
  var CLOSE_AXIS_GUIDES = { skin_exposure: {
    moderate: 'some exposed shoulders or arms inside the crop, with the chest covered',
    bold: 'more bare shoulder and collarbone inside the crop; the crop stays exactly where CROP sets it and never moves down to show more; cover the chest' } };
  /* 렌즈 — 버전2 는 프레이밍에 따라 자동(표 lens). [ko, en] */
  var LENS_GUIDES = {
    wide24: ['24mm 광각: 주변 장소와 앞뒤 거리감이 넓게 드러나요. 가까운 손발이나 얼굴이 과장되지 않도록 억제해요.',
      '24mm-equivalent wide-angle impression with spacious environmental depth; use enough camera distance to avoid stretching the face or limbs.'],
    documentary35: ['35mm 준광각: 인물과 주변 상황을 균형 있게 담는 생활 스냅 느낌이에요.',
      '35mm-equivalent environmental perspective balancing the woman and the setting with moderate depth.'],
    natural50: ['50mm 표준: 앞뒤 거리감을 과하게 벌리거나 압축하지 않는 무난한 표현이에요.',
      '50mm-equivalent natural perspective with balanced proportions and modest depth compression.'],
    portrait85: ['85mm 준망원: 배경이 조금 가까워 보이고 얼굴과 몸의 원근감이 차분해져요.',
      '85mm-equivalent short-telephoto perspective from a suitable distance, with gentle background compression.'],
    telephoto135: ['135mm 망원: 앞뒤 공간이 압축되고 배경 요소가 겹쳐 보여요.',
      '135mm-equivalent telephoto perspective from farther away, with compressed background depth and unchanged anatomy.']
  };
  /* 일상컷 두 축 — 장부(IMAGE_RULES)가 보는 축. 값·풀이는 pkm·book·game 과 열쇠가 같다 */
  var LOCAL_AXES = ['overall_intensity', 'skin_exposure'];
  var ADVANCED_OPTIONS = {
    overall_intensity: ['AUTO', 'restrained', 'sensual', 'bold', 'strong'],
    skin_exposure: ['AUTO', 'low', 'moderate', 'bold']
  };
  var ADVANCED_LABELS = { overall_intensity: ['Overall Intensity', '전체 강도'], skin_exposure: ['Skin Exposure', '피부 노출 정도'] };
  var ADV_AXIS = { overall_intensity: '이 장면의 스타일링과 분위기를 얼마나 강하게 표현할지 정해요.', skin_exposure: '가슴·골반을 제외한 부위의 노출 정도.' };
  var ADV_VAL = {
    overall_intensity: { restrained: '절제', sensual: '자연스럽게 관능적', bold: '과감', strong: '가장 강함' },
    skin_exposure: { low: '적게', moderate: '보통', bold: '많이' }
  };
  var SCENE_AXIS_GUIDES = {
    overall_intensity: {
      restrained: ['의상과 태도를 차분하게 절제해요. 노출량은 별도 선택이에요.', 'understated styling and restrained demeanor; exposure is separate'],
      sensual: ['부드러운 옷의 흐름과 여유 있는 몸짓으로 관능미를 표현해요.', 'sensual fabric drape and relaxed expressive posture; no automatic extra exposure'],
      bold: ['대담한 의상선과 자신감 있는 태도로 강도를 높여요.', 'bold outfit lines and confident demeanor; honor chosen coverage'],
      strong: ['선택한 장면 안에서 의상·태도의 존재감을 가장 강하게 해요.', 'maximal styling presence within the scene; retain chosen exposure and anatomy']
    },
    skin_exposure: {
      low: ['목·손 정도의 제한된 노출이에요. 직접 지정한 의상이 우선해요.', 'mostly covered clothing, limited neck/hand exposure unless outfit is explicit'],
      moderate: ['팔이나 종아리 등 일부 부위를 드러내요. 가슴·골반은 가려요.', 'some exposed arms or lower legs, with chest and pelvis covered'],
      bold: ['어깨·등·복부·다리에서 장면에 맞는 부위를 더 드러내요. 가슴·골반은 가려요.', 'more scene-appropriate shoulder, back, midriff or leg exposure; cover chest and pelvis']
    }
  };
  /* 표정 — 열쇠는 pkm·book·game 과 같다. 버전2 는 트리 표 expressions(시선 말 없는 문장)가 있으면 그것, 없으면 여기 문장에서 시선 말을 뗀 것 */
  var EXPRESSION_OPTIONS = [
    ['', 'AUTO — 자동'], ['calm', 'calm — 차분함'], ['focused', 'focused — 집중'], ['soft_smile', 'soft smile — 옅은 미소'], ['half_smile', 'half-smile — 은은한 미소'],
    ['playful', 'playful — 장난기'], ['confident', 'confident — 자신감'], ['sensual', 'sensual — 자연스러운 섹시'], ['provocative', 'provocative — 도발적이되 비노출'],
    ['sleepy', 'sleepy — 졸린 느낌'], ['candid', 'candid — 생활감'], ['mildly_annoyed', 'mildly annoyed — 약간 짜증'], ['surprised', 'surprised — 놀람'],
    ['curious', 'curious — 호기심'], ['serious', 'serious — 진지함'], ['amused', 'amused — 재미있어하는'], ['bored', 'bored — 심드렁함'], ['pensive', 'pensive — 생각에 잠긴'],
    ['smug', 'smug — 우쭐한'], ['gentle', 'gentle — 온화함'], ['determined', 'determined — 결의에 찬'], ['exhausted', 'exhausted — 지친'], ['nostalgic', 'nostalgic — 아련한'],
    ['unimpressed', 'unimpressed — 시큰둥함'], ['flustered', 'flustered — 당황한'], ['proud', 'proud — 자랑스러운'], ['wistful', 'wistful — 그리운 듯한'],
    ['mischievous', 'mischievous — 짓궂은'], ['relieved', 'relieved — 안도한'], ['cold_smile', 'cold smile — 차가운 미소'], ['laughing', 'laughing — 소리내어 웃는 · 눈 감김'],
    ['laughing_open', 'laughing, eyes open — 소리내어 웃는 · 눈 뜬 채'], ['wink', 'wink — 윙크']
  ];
  var EXPRESSION_DETAIL = {
    calm: 'relaxed brow, softly open eyes, lips closed and unstrained, no smile',
    focused: 'slightly drawn brow, narrowed steady eyes fixed on one point, mouth firmly closed',
    soft_smile: 'faint upward pull at the mouth corners, lips together, warmth reaching the lower eyelids',
    half_smile: 'one mouth corner lifted higher than the other, lips closed, gaze slightly to the side',
    playful: 'asymmetric grin with teeth just showing, one brow raised, eyes narrowed with amusement',
    confident: 'level brow, direct unhurried gaze, chin slightly raised, mouth closed and composed',
    sensual: 'heavy-lidded eyes, lips slightly parted and relaxed, brow smooth, chin a little lowered',
    provocative: 'direct challenging gaze under lowered lids, one brow raised, mouth corner tugged in a slight smirk',
    sleepy: 'heavy drooping eyelids, unfocused gaze, softened slack mouth, brow low and relaxed',
    candid: 'caught mid-motion, eyes off camera, mouth in an unposed in-between shape',
    mildly_annoyed: 'inner brows drawn together, one eye slightly narrowed, mouth pressed flat to one side',
    surprised: 'raised brows, widened eyes with visible upper white, mouth open in a small round shape',
    curious: 'one brow raised higher, head tilted, eyes wide and attentive, lips slightly parted',
    serious: 'level lowered brow, steady unblinking gaze, mouth closed in a straight line, jaw set',
    amused: 'crinkled lower eyelids, closed-lip smile pushing the cheeks up, brows relaxed',
    bored: 'lidded half-open eyes looking away, slack mouth, brows flat and unengaged',
    pensive: 'gaze angled down and away, slightly furrowed brow, lips lightly pressed or touched',
    smug: 'one mouth corner lifted, lids lowered in a knowing look, chin tipped slightly up',
    gentle: 'softly lowered brows, warm relaxed eyes, faint closed-lip smile, no tension anywhere',
    determined: 'brows pulled down and in, hard forward gaze, jaw clenched, mouth a tight line',
    exhausted: 'drooping lids and brows, dull unfocused gaze, mouth slightly open and slack, shoulders of the face fallen',
    /* 향수(2026-11-10) — 「gaze past the camera」 가 시선을 위로 올려 턱이 들렸다(오가네손) → 카메라 바로 옆 · 눈높이 */
    nostalgic: 'soft distant eyes looking just beside the camera at her own eye level, faint wistful half-smile, brows gently raised at the inner ends',
    unimpressed: 'flat level brows, half-lidded deadpan stare, mouth in a straight unmoved line',
    flustered: 'raised inner brows, darting or averted eyes, mouth slightly open, faint blush across the cheeks and nose',
    proud: 'chin lifted, brows level, eyes bright and steady, closed-lip smile with a firm mouth',
    wistful: 'gaze softened and directed slightly upward or away, faint sad smile, inner brows raised',
    mischievous: 'narrowed sparkling eyes, one brow up, closed-lip grin pushed to one side',
    relieved: 'brows released upward and outward, eyes half closed, breath-out mouth slightly open, whole face loosened',
    cold_smile: 'mouth smiling while the eyes stay flat and unsmiling, brows level, gaze direct and unwarm',
    laughing: 'head tipped back slightly, eyes squeezed nearly shut, mouth open wide with teeth showing, cheeks raised high',
    laughing_open: 'mouth open wide in a laugh with teeth showing and cheeks raised, but the eyes stay open and engaged — lids only slightly narrowed, gaze still readable rather than squeezed shut',
    wink: 'one eye closed in a playful wink while the other stays open and bright, one mouth corner lifted in a small smile, brows relaxed'
  };

  /* 얼굴 설계 — 설계한 얼굴형 · 이목구비가 있어도 얼굴 느낌이 비슷하게 나왔다(사용자 2026-11-01 「얼굴형이나 이목구비를 설계로 나눠놔도 얼굴 느낌이 비슷하게 나오는것 같아」).
     판타지 열여섯 장의 얼굴을 모아 보니 큰 눈 · 갸름한 턱 · 흰 피부 · 같은 옅은 미소 — 다른 것은 머리뿐. 까닭: 모두에게 같은 AGE 줄(「soft full cheeks · soft smile」), 화풍 줄의
     「controlled anime facial design」, 전신 2:3 에서 코 · 입 차이는 안 보인다. 그래서 전신에서도 읽히는 칸을 더한다 — 나이감 · 인상 · 피부 톤 · 눈 크기 · 눈꼬리 · 표식(점 · 주근깨 · 화장) ·
     기본 표정(EXPRESSION_DETAIL 열쇠), 세계마다 앞머리. 설계표 look 에 인상(impression)이 있는 카드만 이 줄로 쓴다(시험 셋 → 사용자 확인 뒤 나머지) */
  var FACE_DESIGN = {
    head: "FACE — she must read as her own person at a glance, NOT the style's default pretty face and not a sister of the other characters: {items}.",
    age: {
      early_20s: 'AGE: about twenty — a fresh young-adult face; no facial lines.',
      mid_20s: 'AGE: mid-twenties — a clear adult face; no facial lines.',
      late_20s: 'AGE: late twenties — a settled, mature adult face; no wrinkles, folds or under-eye bags.',
      early_30s: 'AGE: early thirties — a poised, mature face; at most faint lines, no deep folds or under-eye bags.'
    },
    impression: {
      elegant: 'an elegant, refined presence', cool: 'a cool, aloof beauty', sharp: 'a sharp, striking, intense look', mature: 'a mature, poised woman',
      soft: 'a soft, gentle warmth', glamorous: 'a glamorous, sultry allure', rugged: 'a rugged, tough, outdoorsy look', stoic: 'a stoic, unreadable reserve',
      boyish: 'a boyish, mischievous tomboy energy', regal: 'a regal, imperious haughtiness', cute: 'a cute, bright-eyed sweetness', cheerful: 'a cheerful, sunny openness',
      languid: 'a languid, sleepy-eyed ease', fierce: 'a fierce, wild ferocity', melancholic: 'a quiet melancholy', androgynous: 'a striking androgynous handsomeness', innocent: 'a clear, innocent purity',
      /* 2026-11-23 인상 열네 열쇠 더함(사용자 「다 넣어주고 공방 다 적용해줘」 — 글은 style-atelier core v7, 블록이 덮는다) */
      seductive: 'a seductive, smouldering allure — a slow, inviting gaze', provocative: 'a provocative, teasing boldness — a challenging, half-lidded stare and a knowing closed-lip smile',
      decadent: 'a decadent, world-weary glamour — heavy-lidded eyes and a jaded, careless poise', femme_fatale: 'a dangerous femme-fatale poise — cool, calculating eyes behind a faint smile',
      coquettish: 'a coquettish, flirtatious charm — a sidelong glance and a playful pout', haughty: 'a haughty, untouchable pride — a cool, superior gaze and a proud, straight-backed poise',
      mischievous: 'a mischievous, sly-fox playfulness — narrowed, amused eyes', dreamy: 'a dreamy, faraway gaze — soft unfocused eyes, lost in thought',
      mysterious: 'an enigmatic, mysterious aura — an unreadable, veiled gaze', confident: 'a bold, self-assured confidence — a direct, steady gaze',
      icy: 'an icy, cold beauty — piercing, emotionless eyes', shy: 'a shy, bashful sweetness — a lowered gaze and a faint blush',
      sassy: 'a sassy, spirited attitude — a raised brow and a sharp little smile', wistful: 'a wistful, longing tenderness — soft, misty eyes'
    },
    skin_tone: { porcelain: 'porcelain-pale skin', fair: 'fair skin', warm_beige: 'warm beige skin', olive: 'olive skin', golden_tan: 'light warm-beige skin with a golden undertone', bronze: 'bronze-brown skin', deep_brown: 'deep brown skin' },
    eye_size: { small: 'smaller, narrower eyes than usual anime proportion', medium: 'medium-sized eyes', large: 'large eyes' },
    eye_tilt: { up: 'outer eye corners slightly lifted',   /* 2026-11-09 삼국지 공방과 같이 — 「sharply upward」 가 째진 눈으로 나왔다 */ level: 'level outer eye corners', down: 'outer eye corners drooping downward' },
    mark: {
      freckles: 'a dusting of freckles across nose and cheeks', mole_eye: 'a small beauty mark under one eye', mole_lip: 'a small beauty mark beside the lips',
      winged_liner: 'sharp winged eyeliner', smoky: 'smoky dark eye makeup', red_lip: 'bold red lipstick', dark_lip: 'dark berry lipstick', gloss: 'glossy nude lips',
      blush: 'rosy flushed cheeks', bare: 'a bare, makeup-free face', scar: 'a thin faint scar through one eyebrow'
    },
    bangs: {
      none: 'no bangs, forehead bare', straight: 'blunt straight bangs', side_swept: 'side-swept bangs', curtain: 'curtain bangs', one_eye: 'long bangs falling over one eye',
      parted: 'center-parted bangs framing the face', choppy: 'choppy uneven bangs'
    },
    /* 설계 칸 → 생성기 외형 칸(직접 고르면 설계 값이 빠진다) */
    param: { impression: 'facial character', skin_tone: 'skin tone', eye_size: 'eye size', eye_tilt: 'eye tilt', bangs: 'bangs', age: 'apparent age' }
  };

  root.AtelierSpec = {
    FACE_DESIGN: FACE_DESIGN,
    WORLDS: WORLDS, CONCEPT: CONCEPT, CONCEPT_LANDMARK: CONCEPT_LANDMARK, MOTIF_HEAD: MOTIF_HEAD, MARKS_HEAD: MARKS_HEAD, PROP_HEAD: PROP_HEAD, PALETTE_HEAD: PALETTE_HEAD, ACCENT_TAIL: ACCENT_TAIL,
    OUTPUT: OUTPUT, POSE_DEFAULT: POSE_DEFAULT, WORLD_POSES: WORLD_POSES, WORLD_TIMES: WORLD_TIMES, SCENE_HEAD: SCENE_HEAD, EXPR_HEAD: EXPR_HEAD, BODY_LINE: BODY_LINE, RULES: RULES, NOTES: NOTES, FILES: FILES, VISTA: VISTA,
    SILHOUETTES: { fantasy: FANTASY_SILHOUETTES, steampunk: STEAMPUNK_SILHOUETTES, cyberpunk: CYBERPUNK_SILHOUETTES }, SILHOUETTE_HEAD: SILHOUETTE_HEAD,
    WORLD_FREE: WORLD_FREE, OUTFIT_FREE: OUTFIT_FREE, FREE_DESIGN: FREE_DESIGN, WORLD_SHORT: WORLD_SHORT, CASUAL: CASUAL, CASUAL_FIXED: CASUAL_FIXED, ASPECT_OPTIONS: ASPECT_OPTIONS, ASPECT_FRAME: ASPECT_FRAME, CROP_EDGE: CROP_EDGE, CLOSE_FRAMES: CLOSE_FRAMES,
    CASUAL_HAND_WORDS: CASUAL_HAND_WORDS, CLOSE_AXIS_GUIDES: CLOSE_AXIS_GUIDES, LENS_GUIDES: LENS_GUIDES,
    LOCAL_AXES: LOCAL_AXES, ADVANCED_OPTIONS: ADVANCED_OPTIONS, ADVANCED_LABELS: ADVANCED_LABELS, ADV_AXIS: ADV_AXIS, ADV_VAL: ADV_VAL, SCENE_AXIS_GUIDES: SCENE_AXIS_GUIDES,
    EXPRESSION_OPTIONS: EXPRESSION_OPTIONS, EXPRESSION_DETAIL: EXPRESSION_DETAIL
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* ── core:v7 begin 9d0652328727 — style-atelier core/v7/vocab.json 에서 core/sync.cjs 가 옮긴 것. 손으로 고치지 않는다 ── */
(function (S) {
  if (!S) return;
  var C = {"FACE_DESIGN":{"age":{"early_20s":"AGE: about twenty — a youthful face; no facial lines.","mid_20s":"AGE: mid-twenties — a young-adult face; no facial lines.","late_20s":"AGE: late twenties — a clear adult face with soft, smooth contours; no wrinkles, folds or under-eye bags.","early_30s":"AGE: early thirties — a poised, graceful face with soft contours; at most faint lines, no deep folds or under-eye bags.","late_30s":"AGE: late thirties — a glamorous, alluring mature beauty in her prime: confident, sensual poise, a knowing gaze and a ripe, womanly figure; smooth, radiant skin with at most the faintest lines at the eye corners; never old, tired, gaunt or matronly — still the small, soft chin and soft contours."},"impression":{"elegant":"an elegant, refined presence","cool":"a cool, aloof beauty","sharp":"a sharp, striking, intense look","mature":"a mature, poised woman","soft":"a soft, gentle warmth","glamorous":"a glamorous, sultry allure","rugged":"a rugged, tough, outdoorsy look","stoic":"a stoic, unreadable reserve","boyish":"a boyish, mischievous tomboy energy","regal":"a regal, imperious haughtiness","cute":"a cute, bright-eyed sweetness","cheerful":"a cheerful, sunny openness","languid":"a languid, sleepy-eyed ease","fierce":"a fierce, wild ferocity","melancholic":"a quiet melancholy","androgynous":"a striking androgynous handsomeness","innocent":"a clear, innocent purity","seductive":"a seductive, smouldering allure — a slow, inviting gaze","provocative":"a provocative, teasing boldness — a challenging, half-lidded stare and a knowing closed-lip smile","decadent":"a decadent, world-weary glamour — heavy-lidded eyes and a jaded, careless poise","femme_fatale":"a dangerous femme-fatale poise — cool, calculating eyes behind a faint smile","coquettish":"a coquettish, flirtatious charm — a sidelong glance and a playful pout","haughty":"a haughty, untouchable pride — a cool, superior gaze and a proud, straight-backed poise","mischievous":"a mischievous, sly-fox playfulness — narrowed, amused eyes","dreamy":"a dreamy, faraway gaze — soft unfocused eyes, lost in thought","mysterious":"an enigmatic, mysterious aura — an unreadable, veiled gaze","confident":"a bold, self-assured confidence — a direct, steady gaze","icy":"an icy, cold beauty — piercing, emotionless eyes","shy":"a shy, bashful sweetness — a lowered gaze and a faint blush","sassy":"a sassy, spirited attitude — a raised brow and a sharp little smile","wistful":"a wistful, longing tenderness — soft, misty eyes"},"skin_tone":{"porcelain":"porcelain-pale skin","fair":"fair skin","warm_beige":"warm beige skin","olive":"olive skin","golden_tan":"light warm-beige skin with a golden undertone","bronze":"bronze-brown skin","deep_brown":"deep brown skin","honey_tan":"light honey-beige skin"},"eye_size":{"small":"eyes on the smaller side of natural","medium":"eyes of natural size","large":"eyes on the larger side of natural"},"eye_tilt":{"up":"outer eye corners slightly lifted","level":"level outer eye corners","down":"outer eye corners drooping downward"},"mark":{"freckles":"a dusting of freckles across nose and cheeks","mole_eye":"a small beauty mark under one eye","mole_lip":"a small beauty mark beside the lips","winged_liner":"sharp winged eyeliner","smoky":"smoky dark eye makeup","red_lip":"a soft rose-red tint on the lips","dark_lip":"dark berry lipstick","gloss":"glossy nude lips","blush":"rosy flushed cheeks","bare":"a bare, makeup-free face","scar":"a thin faint scar through one eyebrow"},"bangs":{"none":"no bangs, forehead bare","straight":"blunt straight bangs","side_swept":"side-swept bangs","curtain":"curtain bangs","one_eye":"long bangs falling over one eye","parted":"center-parted bangs framing the face","choppy":"choppy uneven bangs","wispy":"wispy see-through bangs","baby":"short baby bangs","side_locks":"no bangs, long face-framing side locks","asymmetric":"asymmetric bangs","swept_back":"hair swept back off the forehead"},"param":{"impression":"facial character","skin_tone":"skin tone","eye_size":"eye size","eye_tilt":"eye tilt","bangs":"bangs","age":"apparent age"}},"EXPRESSION_DETAIL":{"calm":"a relaxed, unforced face, lips gently closed","focused":"attentive, steady eyes, mouth closed","soft_smile":"a faint soft smile, relaxed eyes","half_smile":"a slight smile, lips closed","playful":"a light teasing smile, bright eyes","confident":"a composed, self-assured look","sensual":"softly lidded eyes, lips relaxed","provocative":"a cool, knowing look","sleepy":"softly drowsy eyes, relaxed mouth","candid":"a natural, unposed in-between expression","mildly_annoyed":"a faint pout, brows slightly drawn","surprised":"lightly raised brows, lips slightly parted","curious":"one brow slightly raised, attentive eyes","serious":"a level, steady look, mouth closed","amused":"a small closed-lip smile that reaches the eyes","bored":"an idle, unbothered look","pensive":"a quiet, thoughtful look, lips lightly closed","smug":"a faint knowing smile","gentle":"a warm, gentle look with a faint smile","determined":"a firm, resolute look with calm, steady eyes","exhausted":"tired but soft eyes, a relaxed face","nostalgic":"a soft faraway look with a faint wistful smile","unimpressed":"a cool, unimpressed look","flustered":"a slightly flustered look with a light blush","proud":"a proud, poised look with a faint closed-lip smile","wistful":"a faint wistful smile, soft eyes","mischievous":"a small sly smile, bright eyes","relieved":"a relaxed, relieved look","cold_smile":"a faint cool smile, calm composed eyes","laughing":"a natural laugh, eyes crinkled, mouth open in a smile","laughing_open":"a bright open laugh, eyes open and engaged","wink":"a playful wink with a small smile"},"FRAME":{"s1":"1. STYLE","s2":"2. CHARACTER","s3":"3. {costume} — {genre}","s4":"4. SCENE","s5":"5. CONSTRAINTS","anatomy":"Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.","avoid":"Avoid: {list}."}};
  Object.keys(C).forEach(function (t) { if (t === "FRAME") { S.CORE_FRAME = C[t]; return; } if (!S[t]) return; Object.keys(C[t]).forEach(function (g) {
    if (!(g in S[t])) return;
    if (C[t][g] && typeof C[t][g] === "object") { if (!S[t][g] || typeof S[t][g] !== "object") return; Object.keys(C[t][g]).forEach(function (k) { if (k in S[t][g]) S[t][g][k] = C[t][g][k]; }); }
    else S[t][g] = C[t][g];
  }); });
  S.CORE_VERSION = "v7";
})((typeof window !== "undefined" ? window : globalThis).AtelierSpec);
/* ── core:v7 end ── */

