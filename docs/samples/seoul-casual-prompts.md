# 서울 일상컷 지시문 본보기 (2026-11-20, 기본 화풍 kr_drawn_rim_dewy 로 다시 뽑음 — Style 줄 다음에 SKIN FINISH)

그 세계의 서울의 하루 — 생활 장면표(`data/city-life.json`) · 세계 소품 사전(`data/world-props.json`)으로 짓는 일상컷 지시문(`lib/prompt-city.js` buildCasual · 짧은 판, 화풍은 기본 `kr_drawn_rim_dewy`). 「World:」 줄은 도시의 세계 글(명소 목록)이 아니라 세계마다의 결(설계표 `vocab.casual_world`)과 다음 줄 guard — 사용자 2026-11-19 「일부러 뒷배경은 다 나오게 만든거야?」 → 「응 그렇게 해줘」.
세계마다 두 장: **A — 같은 장면 하나(포장마차)를 세 세계로 옮긴 짝**(장면 · 손 · 구도 · 시간 · 계절 · 날씨를 똑같이 두고 세계만 바꿨다 — 세계 줄 · 장소 글 · 소품 · 옷의 결 · 금지 단락이 세계를 탄다), **B — 계획기 묶음의 한 장**(`node tools/casual-plan.cjs seoul --world all --seed 4 --usage none`, 그 세계 묶음의 1번 칸).
참고 그림은 그 세계의 세계 그림(`seoul_<세계>_kr_drawn_rim_dewy_f.webp`) — 얼굴 · 화풍은 그 그림을 따른다. 사람이 읽어 보라고 둔 글이다. 다시 뽑는 법은 이 글을 지은 꼴 그대로: A 는 `PromptCity.build({ kind: 'casual', casual: { scene } })`, B 는 계획기 `--out` 의 1번 칸.

## 판타지 (`fantasy`)

### A — 포장마차(같은 장면 · 세 세계)

파일 `seoul_fantasy_kr_drawn_rim_dewy_f_casual1.webp`(본보기 번호) · 참고 그림 `seoul_fantasy_kr_drawn_rim_dewy_f.webp`

```text
Use the attached image as the reference: the same adult Korean woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
SKIN FINISH: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.

She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.

World: an ordinary day in Seoul as her world knows it — a moonlit elven city of a Western myth-world: pale carved wood and moonstone, glowing dancheong-like patterns of red, green and gold, silk, lantern-light and drifting spirit lights, blossoms with softly glowing petals. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.
Let the place itself carry this world through its materials, fittings and objects; do not add the city's landmarks, the great tree, the moon or a skyline unless the place below names them.

Place: a tented night stall at the edge of the market road under magic lanterns — a canvas awning glowing from within, a charcoal brazier roasting skewers, a simmering iron pot of spicy rice cakes and low wooden stools at a plank counter.
Around her, as her world makes them: skewers roasting over a charcoal brazier; lantern-orbs of soft magical light floating overhead; a pewter cup; earthenware bowls on a wooden tray.
Season: autumn — cool, clear, dry air and turning leaves.
Weather: a passing rain shower — wet streets shining and the air washed clean.
Time of day: evening turning to night — the scene lit by its own lamps and windows under a dark sky.
Outfit: everyday clothes that suit the place and activity, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday dress, not regalia — the chosen outfit keeps its cut, cover and skin, but is made of hand-woven linen, silk, cotton and wool, with laced, tied or hooked closures, embroidered hems and soft leather shoes or boots; nothing synthetic, no zips, no printed logos.
POSTURE: standing.
COMPOSITION: a waist-up shot of her head, torso and hands; body facing the camera; camera at her eye level.
Lens / perspective: 50mm-equivalent natural perspective with balanced proportions and modest depth compression.
RIGHT HAND: her own right hand is in PROP.
PROP: with her own right hand she brings a pewter cup to her lips; it is all she holds.
EXPRESSION: faint upward pull at the mouth corners, lips together, warmth reaching the lower eyelids.

Framing: a waist-up shot — the bottom edge crosses her waist; hips, legs and feet are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, jeans, hologram, billboard, car, machinery, denim, bomber jacket, cowboy hat, sweatpants, leggings, baseball cap, tracksuit, jogger, track pants, windbreaker, fleece, bodycon, broadcast tower, TV tower, observation tower, skyscraper, Chinese-style palace, Great Wall, yellow-glazed roof tiles.
```

### B — 계획기 1번 칸: 옥탑방 옥상의 여름밤 · lingerie · 자세 추천 bench_sit · 구도 environmental

파일 `seoul_fantasy_kr_drawn_rim_dewy_f_casual1.webp` · 참고 그림 `seoul_fantasy_kr_drawn_rim_dewy_f.webp`

```text
Use the attached image as the reference: the same adult Korean woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
SKIN FINISH: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.

She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.

World: an ordinary day in Seoul as her world knows it — a moonlit elven city of a Western myth-world: pale carved wood and moonstone, glowing dancheong-like patterns of red, green and gold, silk, lantern-light and drifting spirit lights, blossoms with softly glowing petals. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.
Let the place itself carry this world through its materials, fittings and objects; do not add the city's landmarks, the great tree, the moon or a skyline unless the place below names them.

Place: the flat roof outside her little room atop a house in the capital on a warm night — a low wooden bench, potted herbs, laundry on a line and the lantern-lit city with its palace lights spread below.
Around her, as her world makes them: a pewter cup; lantern-orbs of soft magical light floating overhead; a painted silk folding fan; a leather-bound book with gilt edges.
Season: spring — cherry blossoms in bloom and petals drifting on the air.
Time of day: past midnight — the last lamps still burning and the streets nearly empty.
Hair: her hair let down loose over her shoulders — same colour and length as the attached image.
Outfit: a qipao-inspired silk set with a mandarin collar and frog-button closures — in a monochrome palette of black and charcoal with at most one white or grey accent; the outfit colour reads clearly at first glance, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday dress, not regalia — the chosen outfit keeps its cut, cover and skin, but is made of hand-woven linen, silk, cotton and wool, with laced, tied or hooked closures, embroidered hems and soft leather shoes or boots; nothing synthetic, no zips, no printed logos.
POSTURE: seated on a chair.
COMPOSITION: an environmental long shot, her complete figure and enough of the place around her; body facing the camera; head turned to the side; camera at her eye level; she is placed in the left third of the frame, open space of the place to her right; a wall or backdrop of the place close behind her.
Lens / perspective: 35mm-equivalent environmental perspective balancing the woman and the setting with moderate depth.
RIGHT HAND: her own right hand is in PROP.
LEFT HAND: her own left hand rests on her knee.
PROP: with her own right hand she holds a leather-bound book with gilt edges closed against her chest; it is all she holds.
LEGS: knees together, feet slightly apart.
GAZE: she looks toward the left of the frame.
EXPRESSION: faint upward pull at the mouth corners, lips together, warmth reaching the lower eyelids.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, jeans, hologram, billboard, car, machinery, denim, bomber jacket, cowboy hat, sweatpants, leggings, baseball cap, tracksuit, jogger, track pants, windbreaker, fleece, bodycon, broadcast tower, TV tower, observation tower, skyscraper, Chinese-style palace, Great Wall, yellow-glazed roof tiles.
```

## 스팀펑크 (`steampunk`)

### A — 포장마차(같은 장면 · 세 세계)

파일 `seoul_steampunk_kr_drawn_rim_dewy_f_casual1.webp`(본보기 번호) · 참고 그림 `seoul_steampunk_kr_drawn_rim_dewy_f.webp`

```text
Use the attached image as the reference: the same adult Korean woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
SKIN FINISH: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.

She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.

World: an ordinary day in Seoul as her world knows it — a storybook gaslamp-fantasy city: gleaming brass, polished wood, glass, silk, lace and feathers, clockwork details, warm gaslight and soft white steam — clean, warm and storybook-bright, never sooty, rusty or grimy. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.
Let the place itself carry this world through its materials, fittings and objects; do not add the city's landmarks, airships or a skyline unless the place below names them. Wherever the place below sounds sooty, smoky, grimy or rusty, show it clean and gleaming instead.

Place: a street-food handcart stall at night under a striped canvas awning — a gleaming brass steam boiler and a hot griddle of skewers, gas lamps on poles, a narrow polished-wood counter with stools and soft clouds of white steam.
Around her, as her world makes them: skewers sizzling on a steam-heated iron griddle; warm gas lamps in polished brass and etched glass; a painted enamel mug; copper coins and a folded paper banknote.
Season: autumn — cool, clear, dry air and turning leaves.
Weather: a passing rain shower — wet streets shining and the air washed clean.
Time of day: evening turning to night — the scene lit by its own lamps and windows under a dark sky.
Outfit: everyday clothes that suit the place and activity, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday dress of a storybook gaslamp city — the chosen outfit keeps its cut, cover and skin, but is made of cotton, fine wool, silk, lace and soft leather, with brass buttons, buckles and hooks, silk ribbons and laced boots, neat and clean.
POSTURE: standing.
COMPOSITION: a waist-up shot of her head, torso and hands; body facing the camera; camera at her eye level.
Lens / perspective: 50mm-equivalent natural perspective with balanced proportions and modest depth compression.
RIGHT HAND: her own right hand is in PROP.
PROP: with her own right hand she brings a painted enamel mug to her lips; it is all she holds.
EXPRESSION: faint upward pull at the mouth corners, lips together, warmth reaching the lower eyelids.

Framing: a waist-up shot — the bottom edge crosses her waist; hips, legs and feet are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, hologram, digital display, touchscreen, bomber jacket, sweatpants, leggings, baseball cap, tracksuit, jogger, track pants, windbreaker, fleece, bodycon, broadcast tower, TV tower, observation tower, skyscraper, Chinese-style palace, Great Wall, yellow-glazed roof tiles, soot, grime, rust, coal smoke, sweat stains, photographic texture.
```

### B — 계획기 1번 칸: 한강 야외 수영장 · swimwear · 자세 추천 raise_chest · 구도 chest_up

파일 `seoul_steampunk_kr_drawn_rim_dewy_f_casual1.webp` · 참고 그림 `seoul_steampunk_kr_drawn_rim_dewy_f.webp`

```text
Use the attached image as the reference: the same adult Korean woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
SKIN FINISH: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.

She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.

World: an ordinary day in Seoul as her world knows it — a storybook gaslamp-fantasy city: gleaming brass, polished wood, glass, silk, lace and feathers, clockwork details, warm gaslight and soft white steam — clean, warm and storybook-bright, never sooty, rusty or grimy. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.
Let the place itself carry this world through its materials, fittings and objects; do not add the city's landmarks, airships or a skyline unless the place below names them. Wherever the place below sounds sooty, smoky, grimy or rusty, show it clean and gleaming instead.

Place: a riverside open-air bathing pool in high summer — a brass-railed diving tower, striped canvas awnings, a gleaming steam pump churning fresh water into the basin and the truss railway bridge beyond.
Around her, as her world makes them: a striped canvas float ring; a painted enamel mug; a pleated paper fan; a black waxed-canvas umbrella on a brass-ribbed frame.
Season: high summer — hot, humid air and strong sunlight.
Time of day: midday — bright, even daylight.
Outfit: swimwear with a light yukata worn open over it — in denim blues and indigo, with white or cream as the only second colour; the outfit colour reads clearly at first glance, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday dress of a storybook gaslamp city — the chosen outfit keeps its cut, cover and skin, but is made of cotton, fine wool, silk, lace and soft leather, with brass buttons, buckles and hooks, silk ribbons and laced boots, neat and clean.
POSTURE: standing.
COMPOSITION: a chest-up shot of her face, shoulders and expression; body turned three-quarters toward the camera; head tilted slightly; camera at her eye level.
Lens / perspective: 85mm-equivalent short-telephoto perspective from a suitable distance, with gentle background compression.
RIGHT HAND: her own right hand is in PROP.
LEFT HAND: her own left hand stays outside the frame.
PROP: with her own right hand she brings a thick pressed-glass tumbler to her lips; it is all she holds.
EXPRESSION: level brow, calm unhurried eyes, mouth closed and composed.

Framing: a chest-up shot — the bottom edge crosses just below her bust; waist, hips and legs are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, hologram, digital display, touchscreen, bomber jacket, sweatpants, leggings, baseball cap, tracksuit, jogger, track pants, windbreaker, fleece, bodycon, broadcast tower, TV tower, observation tower, skyscraper, Chinese-style palace, Great Wall, yellow-glazed roof tiles, soot, grime, rust, coal smoke, sweat stains, photographic texture.
```

## 사이버펑크 (`cyberpunk`)

### A — 포장마차(같은 장면 · 세 세계)

파일 `seoul_cyberpunk_kr_drawn_rim_dewy_f_casual1.webp`(본보기 번호) · 참고 그림 `seoul_cyberpunk_kr_drawn_rim_dewy_f.webp`

```text
Use the attached image as the reference: the same adult Korean woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
SKIN FINISH: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.

She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.

World: an ordinary day in Seoul as her world knows it — a far-future city two centuries from now: sleek curved architecture, smart glowing materials, holographic interfaces, layered levels of the city and quiet flying vehicles; even an everyday place is rebuilt in that future, not today's Seoul with neon added. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.
Let the place itself carry this world through its materials, fittings and objects; do not add the city's landmarks, towers, giant holograms or a skyline unless the place below names them.

Place: a street-food tent stall at night under a translucent smart-fabric awning glowing pink and cyan — a holographic menu board floating over the counter, skewers on an induction grill, steam rising through layers of light.
Around her, as her world makes them: skewers on an induction grill under a glowing hood; neon and holographic shop signs in abstract shapes, no readable letters; a self-heating tumbler with a glowing band; a chip ring tapped on a glowing pay pad.
Season: autumn — cool, clear, dry air and turning leaves.
Weather: a passing rain shower — wet streets shining and the air washed clean.
Time of day: evening turning to night — the scene lit by its own lamps and windows under a dark sky.
Outfit: everyday clothes that suit the place and activity, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday techwear — the chosen outfit keeps its cut, cover and skin, but is made of technical fabrics with reflective panels, glowing seam lines, magnetic clasps and chunky-soled boots.
POSTURE: standing.
COMPOSITION: a waist-up shot of her head, torso and hands; body facing the camera; camera at her eye level.
Lens / perspective: 50mm-equivalent natural perspective with balanced proportions and modest depth compression.
RIGHT HAND: her own right hand is in PROP.
PROP: with her own right hand she brings a self-heating tumbler with a glowing band to her lips; it is all she holds.
EXPRESSION: faint upward pull at the mouth corners, lips together, warmth reaching the lower eyelids.

Framing: a waist-up shot — the bottom edge crosses her waist; hips, legs and feet are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.
```

### B — 계획기 1번 칸: 야구장 응원석 · roleplay · 자세 추천 reach_waist · 구도 waist_up

파일 `seoul_cyberpunk_kr_drawn_rim_dewy_f_casual1.webp` · 참고 그림 `seoul_cyberpunk_kr_drawn_rim_dewy_f.webp`

```text
Use the attached image as the reference: the same adult Korean woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: Korean MMORPG character artwork. A recognisably drawn face with gently simplified anatomical structure. 2D painting with visible brushwork: layered strokes of colour, soft broken edges, thin coloured linework and a few crisp accents on the face and costume.
SKIN FINISH: dewy, glass-like highlights on the skin of her shoulders, arms, collarbones and legs — a soft, luminous wet-look sheen that follows the body's forms; her face keeps a soft, natural finish.

She is strikingly beautiful and refined — harmonious features, clear luminous skin, graceful posture — while her own face stays distinct: her face shape, eyes, brows, nose and lips follow the attached image, not a generic pretty face.

World: an ordinary day in Seoul as her world knows it — a far-future city two centuries from now: sleek curved architecture, smart glowing materials, holographic interfaces, layered levels of the city and quiet flying vehicles; even an everyday place is rebuilt in that future, not today's Seoul with neon added. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.
Let the place itself carry this world through its materials, fittings and objects; do not add the city's landmarks, towers, giant holograms or a skyline unless the place below names them.

Place: the packed stands of a domed ballpark at a night game — the crowd singing fight songs, glowing thundersticks, holographic replays over the field and fried chicken delivered to the seats by drone.
Around her, as her world makes them: a pair of glowing inflatable thundersticks; heat-sealed takeaway trays with glowing lids; a self-heating tumbler with a glowing band; neon and holographic shop signs in abstract shapes, no readable letters.
Season: autumn — cool, clear, dry air and turning leaves.
Time of day: the evening rush after work — the warm low sun sinking into dusk and lamps coming on along the street.
Light direction: dappled light — patches of light with leaf or blind shadow across her.
Outfit: a marching majorette costume — a plumed shako, a braided short jacket and a pleated mini skirt — in one bright, saturated colour such as cherry red, cobalt blue, sunflower yellow or kelly green; the outfit colour reads clearly at first glance, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday techwear — the chosen outfit keeps its cut, cover and skin, but is made of technical fabrics with reflective panels, glowing seam lines, magnetic clasps and chunky-soled boots.
POSTURE: standing.
COMPOSITION: a waist-up shot of her head, torso and hands; body facing the camera; camera at her eye level; she is placed in the left third of the frame, open space of the place to her right; the space runs far back behind her, its lines receding into the distance; a soft out-of-focus object of the place sits in the near foreground at one edge of the frame.
Lens / perspective: 50mm-equivalent natural perspective with balanced proportions and modest depth compression.
RIGHT HAND: her own right hand reaches gently toward the camera.
LEFT HAND: her own left hand rests lightly on her collarbone.
GAZE: she looks into the camera.
EXPRESSION: relaxed brow, softly open eyes, lips closed and unstrained, no smile.

Framing: a waist-up shot — the bottom edge crosses her waist; hips, legs and feet are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.
```
