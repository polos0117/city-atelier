# 서울 — 세 세계 세계 그림 지시문 (2026-11-20, 기본 화풍 kr_drawn_rim_dewy 로 다시 뽑음)

`lib/prompt-city.js` 가 설계표(`data/city-design.json`)로 지은 그대로 — 손으로 고치지 않았다. 다시 뽑으려면 생성기(`prompt.html?card=seoul&o=world&world=<세계>`)나 `PromptCity.build({ design, styles, city: 'seoul', world, kind: 'world' })`.

- 화풍: `kr_drawn_rim_dewy` — 삼국지 공방 기본 화풍을 그대로 옮겼다(2026-11-20, 사용자 「기본화풍도 아까 테스트했던 화풍으로 바꿔줘. 마지막 기준」, 서울 세 세계 시험). 모델 `gpt-image-2.6-sunburst`. 얼굴 비율 줄은 판의 `worldFace`, 「Face — her own:」 다음 줄은 `worldStyleAfter`(Skin finish), 빛 줄은 `worldLight`, Avoid 에 판의 `avoid` 셋. 얼굴 줄은 「미형이되 세계마다 다른 얼굴」, 머리 줄은 그 나라 사람(`people`).
- 생성기 기본값: 장면은 설계표 첫 장면, 시간대 · 자세 · 실루엣 고르지 않음, 노출 bold, 얼굴 · 실루엣 싣기 켬.
- 세계는 장르 이름이 아니라 표지(`vocab.markers.<세계>.en`)를 사람에게 싣는다 — 3칸 「World marks on her」. 금지 낱말(`banned_en`)은 5칸 「Avoid:」 줄에만 나온다(검사 `tests/prompt-city.cjs` (d)).

## 판타지 (`fantasy`) — 910낱말

달빛 숲의 왕도 서울 — 네 산을 뿌리로 감은 거대한 고목 위에 지은 서양 하이판타지풍 수도, 빛나는 단청 문양을 새긴 곡선 처마의 나무 · 월석 궁전들, 은빛 한강 위로 살아 있는 나무다리가 놓이고 남산 능선엔 달불 봉화가 탄다

```text
A full-body vertical 2:3 (1024×1536) character card image of an adult Korean woman — the personification of the city of Seoul — one woman who IS Seoul as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city's symbols and this world's marks, and the city behind her only supports her.

1. STYLE
Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the description below, not a generic pretty face.
Face proportions: Her face is small and soft: a short midface, a softly rounded jaw and a small chin, about 1.3 times as long as it is wide, with her eyes open at their natural size. Bangs, side locks and headpieces frame the face without lengthening it.

2. CHARACTER
Age: late twenties — a graceful grown-up face with soft, smooth contours; no wrinkles, folds or under-eye bags.
Face — her own: a regal, imperious haughtiness; fair skin; oval face; medium-sized eyes — long monolid eyes, outer eye corners slightly lifted; thin arched brows; straight narrow nose; small bow lips; gold eyes; a soft rose-red tint on the lips.
Skin finish: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.
Body and hair: statuesque, long-legged, with a natural neck length build; long straight hair with center-parted bangs framing the face; deep navy-blue hair.
Expression: a proud, poised look with a faint closed-lip smile.
Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.

3. COSTUME — FANTASY
Costume: grand, opulent regalia — layered silk brocade dense with gold-thread embroidery, a jewel-set crown or headdress, guardian-beast emblems on gilded pauldrons or a gorget, a floor-sweeping cape, enchanted jewelry with a soft magical glow; the city's symbol worked into the embroidery and jewels.
City motif: a floor-sweeping gown-cape of Seoul red and moon-silver embroidered in silver and gold thread with glowing dancheong-like filigree, crescent-curved pauldrons carved with a haechi guardian beast, and a delicate silver circlet whose rim rises into four low mountain peaks.
World marks on her: layered gold-thread embroidery; a jewel-set crown or headdress; a floor-sweeping cape; guardian-beast emblems on her gilded armor ornaments; glowing enchanted jewelry; heavy silk brocade; gilded filigree; a jeweled norigae pendant with silk tassels at her waist; banners and royal regalia; a shimmer of magical light.
Colours: Seoul red (dancheong red), Namsan pine green, palace gold — one of these as her accent colour.
Prop: in one hand she holds a small moonstone seal topped with a carved silver haechi guardian beast; her other hand is free.
Exposure (bold): her regalia opens to show skin — bare shoulders and arms between gilded pauldron and bracer, a deep open neckline under the jeweled collar with natural cleavage, a high slit in the brocade robe showing the thigh; the ornaments stay on and symmetrical. Intimate areas covered.

4. SCENE
World: a moonlit elven capital of a Western myth-world, grown into the branches of a colossal ancient world-tree whose roots grip four mountains: sweeping arched halls of pale carved wood and moonstone with gently upswept, curving eaves painted in glowing dancheong-like patterns of red, green and gold, lantern-lit bridges of living wood arching over a wide silver river, blossoming trees with glowing petals and floating spirit lights under a deep violet night sky, a moonfire beacon burning on the southern ridge.
This card: on a moonlit terrace of the great-tree palace, carved moonstone columns painted with glowing dancheong-like patterns, the silver river far below.
Pose: standing confidently, her body turned slightly while her face looks toward the viewer.
Light: a soft key light with a strong rim light tracing her hair, shoulders and armour; bright, crisp specular highlights on metal and jewellery, and a clean, warm-neutral sheen on her skin.
Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.

5. CONSTRAINTS
One figure only; no text, lettering or numbers anywhere in the picture; no logo or watermark.
Avoid: corset, modern material, machinery, second character, living creature, logo, watermark, speech bubble, frame border, text, lettering, numbers anywhere in the picture, a blue or bruise-like tint on the skin around the eyes, glossy or shiny highlights on the face, sweaty, oily or plastic-looking skin, smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, jeans, hologram, billboard, car, denim, bomber jacket, cowboy hat, sweatpants, leggings, baseball cap, tracksuit, jogger, track pants, windbreaker, fleece, bodycon, broadcast tower, TV tower, observation tower, skyscraper, Chinese-style palace, Great Wall, yellow-glazed roof tiles.
```

## 스팀펑크 (`steampunk`) — 947낱말

가스등 판타지 서울 — 황금빛 하늘 아래 남산 놋쇠 계류탑에 비행선이 매이고, 옛 돌 성문 위로 큰 시계탑이 솟고, 빛나는 한강에 증기 유람선이 미끄러지며, 유리 돔 온실과 가스등 거리에 흰 증기가 구름처럼 떠돈다

```text
A full-body vertical 2:3 (1024×1536) character card image of an adult Korean woman — the personification of the city of Seoul — one woman who IS Seoul as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city's symbols and this world's marks, and the city behind her only supports her.

1. STYLE
Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the description below, not a generic pretty face.
Face proportions: Her face is small and soft: a short midface, a softly rounded jaw and a small chin, about 1.3 times as long as it is wide, with her eyes open at their natural size. Bangs, side locks and headpieces frame the face without lengthening it.

2. CHARACTER
Age: mid-twenties — a clear adult face; no facial lines.
Face — her own: an elegant, refined presence; light warm-beige skin with a golden undertone; diamond-shaped face; medium-sized eyes — large round eyes, level outer eye corners; soft rounded brows; upturned nose; full heart-shaped lips; amber eyes; a dusting of freckles across nose and cheeks.
Skin finish: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.
Body and hair: lean and toned — a slim, firm waist with softly defined vertical abs and lightly sculpted arms and shoulders, a full bust build; glossy chin-length finger waves with side-swept bangs; polished copper-red hair.
Hair: her hair is worn exactly as described above — loose, long or cut as named; do not pin it up into a bun or tuck it under goggles or a hat unless the hair above is an updo.
Expression: a composed, self-assured look.
Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.

3. COSTUME — STEAMPUNK
Costume: gaslamp-fantasy dress of a storybook steam city — a fitted brass-buttoned airship officer's coat or tailored waistcoat over a crisp blouse, a short layered skirt or fitted breeches, polished brass buckles and clockwork filigree, fine leather gloves, a little gear-and-crystal brooch; clean, elegant and adventurous, gleaming brass and glass, never sooty or rusty.
City motif: a navigator's harness of polished leather and brass worked in the crisscross truss pattern of the Han River railway bridge, fastened with a brass compass buckle shaped like a haechi head, and a short cape in Seoul red lined with dancheong-patterned silk.
World marks on her: polished brass buttons and buckles; clockwork filigree; little gears and glass lenses as jewelry; flight goggles with tinted lenses pushed up on her hat; a pocket watch on a fine chain; a ribbon of white steam curling around her; warm gaslight glinting on brass; feathers and silk ribbons; an airship pilot's fitted coat; delicate brass instruments clipped to her belt.
Colours: Seoul red (dancheong red), Namsan pine green, palace gold — one of these as her accent colour.
Prop: in one hand she holds an ornate brass spyglass; her other hand is free.
Exposure (bold): her elegant outfit shows skin — an open coat over a low-cut fitted bodice with natural cleavage, bare shoulders and arms, a short skirt or fitted breeches over tall laced boots; the brass ornaments stay neat and symmetrical. Intimate areas covered.

4. SCENE
World: a storybook gaslamp-fantasy Seoul under a golden sky: airships moored to a brass docking tower on the southern mountain, a great clocktower rising above the old stone city gate, steam pleasure boats gliding along the wide shining river, glass-domed greenhouses and gaslit streets, white steam drifting in soft clouds.
This card: on the brass deck of an airship landing platform on the southern mountain, the clocktower gate and the shining river spread below, airships drifting past.
Pose: standing confidently, her body turned slightly while her face looks toward the viewer.
Light: a soft key light with a strong rim light tracing her hair, shoulders and armour; bright, crisp specular highlights on metal and jewellery, and a clean, warm-neutral sheen on her skin.
Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.

5. CONSTRAINTS
One figure only; no text, lettering or numbers anywhere in the picture; no logo or watermark.
Avoid: armor plates, crown, corset, second character, living creature, logo, watermark, speech bubble, frame border, text, lettering, numbers anywhere in the picture, a blue or bruise-like tint on the skin around the eyes, glossy or shiny highlights on the face, sweaty, oily or plastic-looking skin, smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, hologram, digital display, touchscreen, bomber jacket, sweatpants, leggings, baseball cap, tracksuit, jogger, track pants, windbreaker, fleece, bodycon, broadcast tower, TV tower, observation tower, skyscraper, Chinese-style palace, Great Wall, yellow-glazed roof tiles, soot, grime, rust, coal smoke, sweat stains, photographic texture.
```

## 사이버펑크 (`cyberpunk`) — 889낱말

두 세기 뒤의 먼 미래 도시 서울 — 구름을 뚫는 킬로미터 높이의 아콜로지 타워가 층층 공중 다리로 이어지고, 남산 송신탑은 빛의 줄을 궤도까지 올리는 거대한 궤도 엘리베이터 첨탑이 되었으며, 한강 위로 층층 자기부상 아치가 걸치고 탑 사이 빛의 길로 비행 차량이 흐르고, 하늘엔 해치와 단청 홀로그램, 옛 궁궐은 탑들 사이 거대한 유리 돔 속에 남았다

```text
A full-body vertical 2:3 (1024×1536) character card image of an adult Korean woman — the personification of the city of Seoul — one woman who IS Seoul as it stands in this world. She is the subject of the picture; her costume, body, props and light carry the city's symbols and this world's marks, and the city behind her only supports her.

1. STYLE
Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the description below, not a generic pretty face.
Face proportions: Her face is small and soft: a short midface, a softly rounded jaw and a small chin, about 1.3 times as long as it is wide, with her eyes open at their natural size. Bangs, side locks and headpieces frame the face without lengthening it.

2. CHARACTER
Age: about twenty — a fresh young-adult face; no facial lines.
Face — her own: a cool, aloof beauty; porcelain-pale skin; heart-shaped face; medium-sized eyes — narrow upturned eyes, outer eye corners slightly lifted; sharp angled brows; small button nose; thin long lips; pale violet eyes; sharp winged eyeliner.
Skin finish: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.
Body and hair: lean and long-legged, with a natural neck length build; an asymmetric bob, longer on one side with long bangs falling over one eye; bright cyan hair.
Expression: a faint cool smile, calm composed eyes.
Anatomy: one head, two arms and two legs, each joined at its natural joint; natural hands with five fingers.

3. COSTUME — CYBERPUNK
Costume: techwear for a neon megacity — a reflective rain-slick coat or cropped jacket over fitted technical layers, straps and buckles, chrome and glossy vinyl, glowing tattoo lines and cybernetic implants on her skin, holographic jewelry; sign light reflected on her face and coat.
City motif: long earrings shaped like the Namsan transmission tower in glowing Seoul-red neon, a reflective raincoat with light strips racing along it like the river bridges at night, and a glowing haechi tattoo on the back of her hand.
World marks on her: glowing neon tattoos; cybernetic implants; a reflective rain-slick raincoat; sign light reflected on her face; holographic jewelry; fiber-optic glowing hair strands; chrome and glossy vinyl; magenta and cyan glow; rain beading on her skin and coat; techwear traced with glowing light lines; far-future smart fabric rippling with soft light patterns.
Colours: Seoul red (dancheong red), Namsan pine green, palace gold — one of these as her accent colour.
Prop: in one hand she holds a palm-sized hologram projector showing a tiny glowing tower above her hand; her other hand is free.
Exposure (bold): her techwear opens to show skin — a cropped top under the open reflective coat with natural cleavage, bare midriff and shoulders traced with glowing tattoo lines, high-cut shorts or a slit skirt over strapped thigh-high boots. Intimate areas covered.

4. SCENE
World: Seoul two centuries from now, a vertical far-future megacity: arcology towers kilometres tall piercing the clouds, linked by glowing sky-bridges at many levels; the old transmission tower on the southern mountain rebuilt as a colossal space-elevator spire whose cable of light climbs straight into orbit; the wide river spanned by stacked tiers of luminous maglev arches; streams of flying vehicles moving in lanes of light between the towers; giant holographic guardian beasts and dancheong patterns projected across the sky; the old palace preserved as a small island of curved tiled roofs under a vast glass dome, deep among the towers; rain falling through layers of light.
This card: on a high open-air sky-terrace of an arcology tower, the space-elevator spire and the luminous maglev arches over the river spread far below her, flying vehicles streaming past at eye level in the rain.
Pose: standing confidently, her body turned slightly while her face looks toward the viewer.
Light: a soft key light with a strong rim light tracing her hair, shoulders and armour; bright, crisp specular highlights on metal and jewellery, and a clean, warm-neutral sheen on her skin.
Composition: vertical 2:3 full-body framing with modest headroom and clear space below the boots — the whole figure from the top of her head or headpiece to both feet stays inside the frame, occupying about four-fifths of the image height, with the same camera distance in every world; her hands stay inside the frame. Camera level with her face with natural portrait perspective; her head level, chin neither raised nor tucked — no upward perspective on her face, no wide-angle distortion, no low angle, no close crop.

5. CONSTRAINTS
One figure only; no text, lettering or numbers anywhere in the picture; no logo or watermark.
Avoid: second character, living creature, logo, watermark, speech bubble, frame border, text, lettering, numbers anywhere in the picture, a blue or bruise-like tint on the skin around the eyes, glossy or shiny highlights on the face, sweaty, oily or plastic-looking skin.
```
