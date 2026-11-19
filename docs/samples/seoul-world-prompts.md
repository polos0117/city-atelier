# 서울 — 세 세계 세계 그림 지시문 (2026-11-19, 계획 Task 3)

`lib/prompt-city.js` 가 설계표(`data/city-design.json`)로 지은 그대로 — 손으로 고치지 않았다. 다시 뽑으려면 생성기(`prompt.html?card=seoul&o=world&world=<세계>`)나 `PromptCity.build({ design, styles, city: 'seoul', world, kind: 'world' })`.

- 화풍: `jp_paint_anime` — **임시**(화풍 미정, `data/style.json` 의 `undecided` — Task 11 에서 사용자가 고른다). 화풍이 바뀌면 1칸(STYLE)과 5칸 Avoid 의 화풍 금지 낱말만 바뀐다.
- 생성기 기본값: 장면은 설계표 첫 장면, 시간대 · 자세 · 실루엣 고르지 않음, 노출 bold, 얼굴 · 실루엣 싣기 켬.
- 세계는 장르 이름이 아니라 표지(`vocab.markers.<세계>.en`)를 사람에게 싣는다 — 3칸 「World marks on her」. 금지 낱말(`banned_en`)은 5칸 「Avoid:」 줄에만 나온다(검사 `tests/prompt-city.cjs` (d)).

## 판타지 (`fantasy`) — 750낱말

왕도 서울 — 북악 · 인왕 · 남산 · 낙산을 성벽으로 이어 감싼 금빛 궁궐의 도읍, 남산 봉수대에 불이 오르고 한강이 은빛 해자처럼 남쪽을 돈다

```text
A full-body vertical 2:3 (1024×1536) character card image of an adult woman — the personification of the city of Seoul — one woman who IS Seoul as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city's symbols and this world's marks, and the city behind her only supports her.

1. STYLE
A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance.
Face proportions: a short midface and a soft, gently rounded jawline with a small soft chin; any crown or headpiece sits above her hairline. Her eyes keep the shape and size described below.

2. CHARACTER
Age: early thirties — a poised, graceful face with soft contours; at most faint lines, no deep folds or under-eye bags.
Face — her own: a regal, imperious haughtiness; fair skin; oval face; medium-sized eyes — long monolid eyes, outer eye corners slightly lifted; thin arched brows; straight narrow nose; small bow lips; gold eyes; a soft rose-red tint on the lips.
Body and hair: statuesque, long-legged, with a natural neck length build; long straight hair with center-parted bangs framing the face; deep navy-blue hair.
Expression: a proud, poised look with a faint closed-lip smile.
Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.

3. COSTUME — FANTASY
Costume: grand, opulent regalia — layered silk brocade dense with gold-thread embroidery, a jewel-set crown or headdress, heraldic crests on gilded pauldrons or a gorget, a floor-sweeping cape, enchanted jewelry with a soft magical glow; the city's symbol worked into the embroidery and jewels.
City motif: a floor-sweeping Seoul-red silk cape embroidered in gold thread with dancheong temple-eave patterns, gilded pauldrons engraved with a haechi guardian beast, and a jeweled crown shaped like four mountain peaks linked by a city wall.
World marks on her: layered gold-thread embroidery; a jewel-set crown or headdress; a floor-sweeping cape; heraldic crests on her armor ornaments; glowing enchanted jewelry; heavy silk brocade; gilded filigree; towering spires and castle walls behind her; banners and royal regalia; a shimmer of magical light.
Colours: Seoul red (dancheong red), Namsan pine green, palace gold — one of these as her accent colour.
Prop: in one hand she holds a small golden seal topped with a carved haechi guardian beast; her other hand is free.
Exposure (bold): her regalia opens to show skin — bare shoulders and arms between gilded pauldron and bracer, a deep open neckline under the jeweled collar with natural cleavage, a high slit in the brocade robe showing the thigh; the ornaments stay on and symmetrical. Intimate areas covered.

4. SCENE
World: a grand royal capital ringed by four mountains joined by a great stone wall: golden-roofed palace halls with painted dancheong eaves stacked beneath the northern peak, beacon fires burning on the southern mountain, the wide silver river curving past like a moat, banners and lanterns along the processional road.
This card: on the stone-paved courtyard before the great throne hall, painted dancheong eaves and rows of rank stones leading to the stairs.
Pose: standing confidently, her body turned slightly while her face looks toward the viewer.
Light: radiant daylight or the world's own magical glow, catching the gold thread and jewels on her.
Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.

5. CONSTRAINTS
One figure only; no text, lettering or numbers anywhere in the picture; no logo or watermark.
Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish, corset, modern material, machinery, second character, living creature, logo, watermark, speech bubble, frame border, text, lettering, numbers anywhere in the picture.
```

## 스팀펑크 (`steampunk`) — 785낱말

증기 공업 도시 서울 — 1900년 무렵, 한강을 건너는 리벳 트러스 철교 위로 기관차가 달리고 강변 주물 공장 굴뚝이 그을음을 뿜는다

```text
A full-body vertical 2:3 (1024×1536) character card image of an adult woman — the personification of the city of Seoul — one woman who IS Seoul as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city's symbols and this world's marks, and the city behind her only supports her.

1. STYLE
A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance.
Face proportions: a short midface and a soft, gently rounded jawline with a small soft chin; any crown or headpiece sits above her hairline. Her eyes keep the shape and size described below.

2. CHARACTER
Age: late twenties — a graceful grown-up face with soft, smooth contours; no wrinkles, folds or under-eye bags.
Face — her own: a rugged, tough, outdoorsy look; light warm-beige skin with a golden undertone; softly squared face with a rounded jaw; medium-sized eyes — wide almond eyes, level outer eye corners; thick straight brows; broad soft nose; a wide mouth with softly upturned corners; amber eyes; a dusting of freckles across nose and cheeks.
Body and hair: broad-shouldered and strong build; a shaggy layered wolf cut with choppy uneven bangs; polished copper-red hair.
Hair: her hair is worn exactly as described above — loose, long or cut as named; do not pin it up into a bun or tuck it under goggles or a hat unless the hair above is an updo.
Expression: a firm, resolute look with calm, steady eyes.
Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.

3. COSTUME — STEAMPUNK
Costume: the working dress of a steam city, not clean brass decoration — a sweat-damp shirt with rolled-up sleeves, a scorched leather apron or work harness, oil-stained leather gloves, pressure gauges, tools and brass piping strapped to her body, soot on her cheeks and hands, heavy work boots.
City motif: a soot-blackened leather work harness riveted in the crisscross truss pattern of the iron railway bridge over the Han River, fastened with a pressure-gauge buckle cast in the shape of a haechi head.
World marks on her: soot-smudged cheeks; a sweat-damp shirt; oil-stained leather gloves; rolled-up sleeves; pressure gauges and brass pipes strapped to her body; a heavy tool belt; billowing steam; red furnace glow; riveted iron; coal smoke and grime.
Colours: Seoul red (dancheong red), Namsan pine green, palace gold — one of these as her accent colour.
Prop: in one hand she holds a soot-blackened riveting hammer with a worn brass grip; her other hand is free.
Exposure (bold): her work clothes open to show skin — the sweat-damp shirt unbuttoned to the sternum or tied up over a bandeau with natural cleavage, bare soot-streaked arms and shoulders, short work breeches or a skirt hitched above the boots; the harness and tools stay on. Intimate areas covered.

4. SCENE
World: a steam-powered industrial Seoul around 1900: locomotives thundering over riveted iron truss bridges across the wide river, riverside foundries and factories pouring coal smoke, steam pipes running past the old stone city gates, workers' alleys lit red by furnace glow.
This card: on a maintenance catwalk under the riveted truss of the iron railway bridge over the river, a locomotive roaring overhead in steam.
Pose: standing confidently, her body turned slightly while her face looks toward the viewer.
Light: hazy daylight through steam and coal smoke, with red furnace glow on her skin, sweat and riveted metal.
Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.

5. CONSTRAINTS
One figure only; no text, lettering or numbers anywhere in the picture; no logo or watermark.
Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish, armor plates, crown, corset, second character, living creature, logo, watermark, speech bubble, frame border, text, lettering, numbers anywhere in the picture.
```

## 사이버펑크 (`cyberpunk`) — 736낱말

네온 메가시티 서울 — 남산 송신탑이 붉은 네온 첨탑으로 빛나고, 한강 다리마다 빛줄기가 흐르며, 고층 아파트 숲과 비 젖은 골목에 간판 빛이 넘친다

```text
A full-body vertical 2:3 (1024×1536) character card image of an adult woman — the personification of the city of Seoul — one woman who IS Seoul as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city's symbols and this world's marks, and the city behind her only supports her.

1. STYLE
A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance.
Face proportions: a short midface and a soft, gently rounded jawline with a small soft chin; any crown or headpiece sits above her hairline. Her eyes keep the shape and size described below.

2. CHARACTER
Age: about twenty — a fresh young-adult face; no facial lines.
Face — her own: a cool, aloof beauty; porcelain-pale skin; heart-shaped face; medium-sized eyes — narrow upturned eyes, outer eye corners slightly lifted; sharp angled brows; small button nose; thin long lips; pale violet eyes; sharp winged eyeliner.
Body and hair: lean and long-legged, with a natural neck length build; an asymmetric bob, longer on one side with long bangs falling over one eye; bright cyan hair.
Expression: a faint cool smile, calm composed eyes.
Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.

3. COSTUME — CYBERPUNK
Costume: techwear for a neon megacity — a reflective rain-slick coat or cropped jacket over fitted technical layers, straps and buckles, chrome and glossy vinyl, glowing tattoo lines and cybernetic implants on her skin, holographic jewelry; sign light reflected on her face and coat.
City motif: long earrings shaped like the Namsan transmission tower in glowing Seoul-red neon, a reflective raincoat with light strips racing along it like the river bridges at night, and a glowing haechi tattoo on the back of her hand.
World marks on her: glowing neon tattoos; cybernetic implants; a reflective rain-slick raincoat; sign light reflected on her face; holographic jewelry; fiber-optic glowing hair strands; chrome and glossy vinyl; magenta and cyan glow; a rain-soaked neon alley behind her; techwear traced with glowing light lines.
Colours: Seoul red (dancheong red), Namsan pine green, palace gold — one of these as her accent colour.
Prop: in one hand she holds a palm-sized hologram projector showing a tiny glowing tower above her hand; her other hand is free.
Exposure (bold): her techwear opens to show skin — a cropped top under the open reflective coat with natural cleavage, bare midriff and shoulders traced with glowing tattoo lines, high-cut shorts or a slit skirt over strapped thigh-high boots. Intimate areas covered.

4. SCENE
World: a neon megacity Seoul: the transmission tower on the southern mountain glowing as a red neon spire, light streams racing along the many bridges over the wide river, endless high-rise apartment towers, rain-wet alleys stacked with glowing signs and steaming food stalls.
This card: at the railing of the observation deck of the neon tower on the southern mountain, the glowing city sprawling below in the rain.
Pose: standing confidently, her body turned slightly while her face looks toward the viewer.
Light: night lit by magenta and cyan neon, sign light reflected on her face, skin and wet raincoat, glowing implants and tattoo lines.
Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.

5. CONSTRAINTS
One figure only; no text, lettering or numbers anywhere in the picture; no logo or watermark.
Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish, second character, living creature, logo, watermark, speech bubble, frame border, text, lettering, numbers anywhere in the picture.
```
