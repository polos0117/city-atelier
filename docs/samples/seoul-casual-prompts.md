# 서울 일상컷 지시문 본보기 (2026-11-19, 계획 Task 4)

그 세계의 서울의 하루 — 생활 장면표(`data/city-life.json`) · 세계 소품 사전(`data/world-props.json`)으로 짓는 일상컷 지시문(`lib/prompt-city.js` buildCasual · 짧은 판, 화풍은 임시 기본 `jp_paint_anime` — 기본 화풍은 Task 11 에서 사용자가 고른다).
세계마다 두 장: **A — 같은 장면 하나(포장마차)를 세 세계로 옮긴 짝**(장면 · 손 · 구도 · 시간 · 계절 · 날씨를 똑같이 두고 세계만 바꿨다 — 장소 글 · 소품 · 옷의 결 · 금지 단락이 세계를 탄다), **B — 계획기 묶음의 한 장**(`node tools/casual-plan.cjs seoul --world all --seed 4 --usage none`, 그 세계 묶음의 1번 칸).
참고 그림은 그 세계의 세계 그림(`seoul_<세계>_jp_paint_anime_f.webp`) — 얼굴 · 화풍은 그 그림을 따른다. 사람이 읽어 보라고 둔 글이다(그림은 아직 없다).

## 판타지 (`fantasy`)

### A — 포장마차(같은 장면 · 세 세계)

파일 `seoul_fantasy_jp_paint_anime_f_casual1.webp`(본보기 번호) · 참고 그림 `seoul_fantasy_jp_paint_anime_f.webp`

```text
Use the attached image as the reference: the same woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance. Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.

World: an ordinary day in Seoul as her world knows it — a grand royal capital ringed by four mountains joined by a great stone wall: golden-roofed palace halls with painted dancheong eaves stacked beneath the northern peak, beacon fires burning on the southern mountain, the wide silver river curving past like a moat, banners and lanterns along the processional road. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.

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

Her city — a floor-sweeping Seoul-red silk cape embroidered in gold thread with dancheong temple-eave patterns, gilded pauldrons engraved with a haechi guardian beast, and a jeweled crown shaped like four mountain peaks linked by a city wall — may show in the outfit's details, motifs or small accessories.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish. Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, jeans, hologram, billboard, car, machinery.
```

### B — 계획기 1번 칸: 옥탑방 옥상의 여름밤 · lingerie · 자세 추천 hair_close

파일 `seoul_fantasy_jp_paint_anime_f_casual1.webp` · 참고 그림 `seoul_fantasy_jp_paint_anime_f.webp`

```text
Use the attached image as the reference: the same woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance. Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.

World: an ordinary day in Seoul as her world knows it — a grand royal capital ringed by four mountains joined by a great stone wall: golden-roofed palace halls with painted dancheong eaves stacked beneath the northern peak, beacon fires burning on the southern mountain, the wide silver river curving past like a moat, banners and lanterns along the processional road. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.

Place: the flat roof outside her little room atop a house in the capital on a warm night — a low wooden bench, potted herbs, laundry on a line and the lantern-lit city with its palace lights spread below.
Around her, as her world makes them: a pewter cup; lantern-orbs of soft magical light floating overhead; a painted silk folding fan; a leather-bound book with gilt edges.
Season: the jangma rainy season of early summer — heavy, humid air under low grey skies.
Time of day: past midnight — the last lamps still burning and the streets nearly empty.
Hair: her hair let down loose over her shoulders — same colour and length as the attached image.
Outfit: a simple cotton lingerie set with plain wide bands — in a monochrome palette of black and charcoal with at most one white or grey accent; the outfit colour reads clearly at first glance, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday dress, not regalia — the chosen outfit keeps its cut, cover and skin, but is made of hand-woven linen, silk, cotton and wool, with laced, tied or hooked closures, embroidered hems and soft leather shoes or boots; nothing synthetic, no zips, no printed logos.
POSTURE: standing.
COMPOSITION: a close-up of her face and hair; body in side profile, her face in profile too, not turned toward the camera, facing the right of the frame, so her own right side is toward the camera; camera slightly above, looking down at her; a wall or backdrop of the place close behind her.
Lens / perspective: 85mm-equivalent short-telephoto perspective from a suitable distance, with gentle background compression.
RIGHT HAND: her own right hand tucks hair behind her ear — her near arm, on the camera side.
LEFT HAND: her own left hand stays outside the frame — her far arm, on the side away from the camera.
GAZE: her eyes are lowered.
EXPRESSION: brows level, eyes bright and steady, closed-lip smile with a firm mouth.

Framing: a close-up — her face and hair fill most of the frame and the bottom edge crosses at her collarbones; nothing below the shoulders shows, and her hands and anything she holds stay below the frame unless raised to her face.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Her city — a floor-sweeping Seoul-red silk cape embroidered in gold thread with dancheong temple-eave patterns, gilded pauldrons engraved with a haechi guardian beast, and a jeweled crown shaped like four mountain peaks linked by a city wall — may show in the outfit's details, motifs or small accessories.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish. Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, jeans, hologram, billboard, car, machinery.
```

## 스팀펑크 (`steampunk`)

### A — 포장마차(같은 장면 · 세 세계)

파일 `seoul_steampunk_jp_paint_anime_f_casual1.webp`(본보기 번호) · 참고 그림 `seoul_steampunk_jp_paint_anime_f.webp`

```text
Use the attached image as the reference: the same woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance. Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.

World: an ordinary day in Seoul as her world knows it — a steam-powered industrial Seoul around 1900: locomotives thundering over riveted iron truss bridges across the wide river, riverside foundries and factories pouring coal smoke, steam pipes running past the old stone city gates, workers' alleys lit red by furnace glow. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.

Place: a street-food handcart stall at night under a soot-stained tarp — a hissing steam boiler and a hot iron griddle of skewers, gas lamps on poles, a narrow tin counter with stools and clouds of steam.
Around her, as her world makes them: skewers sizzling on a steam-heated iron griddle; hissing gas lamps behind sooty glass; an enamel mug chipped at the rim; copper coins and a folded paper banknote.
Season: autumn — cool, clear, dry air and turning leaves.
Weather: a passing rain shower — wet streets shining and the air washed clean.
Time of day: evening turning to night — the scene lit by its own lamps and windows under a dark sky.
Outfit: everyday clothes that suit the place and activity, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday street and working dress of a steam city around 1900 — the chosen outfit keeps its cut, cover and skin, but is made of cotton, wool twill, canvas and leather, with buttons, braces, buckles and hooks, laced boots and a little soot at the cuffs.
POSTURE: standing.
COMPOSITION: a waist-up shot of her head, torso and hands; body facing the camera; camera at her eye level.
Lens / perspective: 50mm-equivalent natural perspective with balanced proportions and modest depth compression.
RIGHT HAND: her own right hand is in PROP.
PROP: with her own right hand she brings an enamel mug chipped at the rim to her lips; it is all she holds.
EXPRESSION: faint upward pull at the mouth corners, lips together, warmth reaching the lower eyelids.

Framing: a waist-up shot — the bottom edge crosses her waist; hips, legs and feet are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Her city — a soot-blackened leather work harness riveted in the crisscross truss pattern of the iron railway bridge over the Han River, fastened with a pressure-gauge buckle cast in the shape of a haechi head — may show in the outfit's details, motifs or small accessories.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish. Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, hologram, digital display, touchscreen.
```

### B — 계획기 1번 칸: 한강 야외 수영장 · swimwear · 자세 추천 raise_chest

파일 `seoul_steampunk_jp_paint_anime_f_casual1.webp` · 참고 그림 `seoul_steampunk_jp_paint_anime_f.webp`

```text
Use the attached image as the reference: the same woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance. Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.

World: an ordinary day in Seoul as her world knows it — a steam-powered industrial Seoul around 1900: locomotives thundering over riveted iron truss bridges across the wide river, riverside foundries and factories pouring coal smoke, steam pipes running past the old stone city gates, workers' alleys lit red by furnace glow. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.

Place: a riverside open-air bathing pool in high summer — a riveted iron diving tower, canvas awnings, a steam pump churning fresh water into the basin and the iron railway bridge beyond.
Around her, as her world makes them: a canvas float ring patched with rubber; an enamel mug chipped at the rim; a pleated paper fan; a black waxed-canvas umbrella on a brass-ribbed frame.
Season: high summer — hot, humid air and strong sunlight.
Time of day: midday — bright, even daylight.
Outfit: swimwear with a light yukata worn open over it — in denim blues and indigo, with white or cream as the only second colour; the outfit colour reads clearly at first glance, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday street and working dress of a steam city around 1900 — the chosen outfit keeps its cut, cover and skin, but is made of cotton, wool twill, canvas and leather, with buttons, braces, buckles and hooks, laced boots and a little soot at the cuffs.
POSTURE: standing.
COMPOSITION: a chest-up shot of her face, shoulders and expression; body turned three-quarters toward the camera; head tilted slightly; camera at her eye level.
Lens / perspective: 85mm-equivalent short-telephoto perspective from a suitable distance, with gentle background compression.
RIGHT HAND: her own right hand is in PROP.
LEFT HAND: her own left hand stays outside the frame.
PROP: with her own right hand she brings a thick pressed-glass tumbler to her lips; it is all she holds.
EXPRESSION: level brow, calm unhurried eyes, mouth closed and composed.

Framing: a chest-up shot — the bottom edge crosses just below her bust; waist, hips and legs are out of frame.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Her city — a soot-blackened leather work harness riveted in the crisscross truss pattern of the iron railway bridge over the Han River, fastened with a pressure-gauge buckle cast in the shape of a haechi head — may show in the outfit's details, motifs or small accessories.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish. Nothing from our present day in her world: smartphone, mobile phone, plastic, LED screen, neon sign, neon, laptop, headphones, earbuds, sneakers, hoodie, hologram, digital display, touchscreen.
```

## 사이버펑크 (`cyberpunk`)

### A — 포장마차(같은 장면 · 세 세계)

파일 `seoul_cyberpunk_jp_paint_anime_f_casual1.webp`(본보기 번호) · 참고 그림 `seoul_cyberpunk_jp_paint_anime_f.webp`

```text
Use the attached image as the reference: the same woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance. Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.

World: an ordinary day in Seoul as her world knows it — a neon megacity Seoul: the transmission tower on the southern mountain glowing as a red neon spire, light streams racing along the many bridges over the wide river, endless high-rise apartment towers, rain-wet alleys stacked with glowing signs and steaming food stalls. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.

Place: a street-food tent stall at night under a translucent neon-lit awning — a holographic menu board floating over the counter, skewers on an induction grill, steam rising through pink and cyan light.
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

Her city — long earrings shaped like the Namsan transmission tower in glowing Seoul-red neon, a reflective raincoat with light strips racing along it like the river bridges at night, and a glowing haechi tattoo on the back of her hand — may show in the outfit's details, motifs or small accessories.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish.
```

### B — 계획기 1번 칸: 야구장 응원석 · roleplay · 자세 추천 walk_away

파일 `seoul_cyberpunk_jp_paint_anime_f_casual1.webp` · 참고 그림 `seoul_cyberpunk_jp_paint_anime_f.webp`

```text
Use the attached image as the reference: the same woman — the personification of Seoul — seen off duty in her everyday life. Keep her face, eye colour, hair colour, skin tone and body exactly; change only her clothes, pose and place. Do not reuse earlier conversation images.

Output: one vertical 2:3 image, 1024×1536.

Face: exactly the attached image's face — the same short midface and face length-to-width ratio; the camera angle, pose, bangs or a headpiece never make her face look longer or her jaw heavier.

Style: A Japanese anime key visual with a painterly finish: an anime-style character with an elegant adult anime face, large expressive eyes, a small nose and mouth, fine coloured linework and soft cel-to-painted shading with painted highlights in the hair and fabric. Behind her, a richly painted background with layered painterly colour, subtle visible brushwork, atmospheric perspective and cinematic depth. Luminous, rich colours; crisp focal details on the face and costume, softer painted edges toward the distance. Keep this rendering exactly as in the attached image — the same finish, line, shading, skin and colour treatment.

World: an ordinary day in Seoul as her world knows it — a neon megacity Seoul: the transmission tower on the southern mountain glowing as a red neon spire, light streams racing along the many bridges over the wide river, endless high-rise apartment towers, rain-wet alleys stacked with glowing signs and steaming food stalls. This is her world's own everyday life, not our present day: every made thing around her — tools, cups, lamps, signs, vehicles, money and devices — is made the way her world makes them.

Place: the packed stands of a domed ballpark at a night game — the crowd singing fight songs, glowing thundersticks, holographic replays over the field and fried chicken delivered to the seats by drone.
Around her, as her world makes them: a pair of glowing inflatable thundersticks; heat-sealed takeaway trays with glowing lids; a self-heating tumbler with a glowing band; neon and holographic shop signs in abstract shapes, no readable letters.
Season: autumn — cool, clear, dry air and turning leaves.
Time of day: the evening rush after work — the warm low sun sinking into dusk and lamps coming on along the street.
Light direction: dappled light — patches of light with leaf or blind shadow across her.
Outfit: a Christmas party costume — a fur-trimmed red velvet mini dress, a Santa hat and boots, showing her shoulders, collarbones and legs as far as the outfit allows, following her curvy figure — a slim waist and rounded hips; intimate areas covered.
Her clothes are her world's everyday techwear — the chosen outfit keeps its cut, cover and skin, but is made of technical fabrics with reflective panels, glowing seam lines, magnetic clasps and chunky-soled boots.
POSTURE: walking.
COMPOSITION: an environmental long shot, her complete figure and enough of the place around her; back to the camera; camera at her eye level; she is placed in the right third of the frame, open space of the place to her left; the space runs far back behind her, its lines receding into the distance; a soft out-of-focus object of the place sits in the near foreground at one edge of the frame.
Lens / perspective: 35mm-equivalent environmental perspective balancing the woman and the setting with moderate depth.
RIGHT HAND: her own right hand is in PROP.
LEFT HAND: her own left arm hangs relaxed at her side.
PROP: with her own right hand she carries a palm-sized camera drone by its grip at her side; it is all she holds.
LEGS: mid-stride, one heel lifting.
GAZE: she looks toward the far distance.

Leave behind everything she wears in the attached image — no crown, tiara, helmet, feathers, headpiece, hairpins from it, armour or regalia; her hair is styled for the everyday outfit, with at most one small accessory.

Her city — long earrings shaped like the Namsan transmission tower in glowing Seoul-red neon, a reflective raincoat with light strips racing along it like the river bridges at night, and a glowing haechi tattoo on the back of her hand — may show in the outfit's details, motifs or small accessories.

Light: the place's own light, lit and coloured the way this style renders light and skin.

One figure in focus, natural hands with five fingers, no text, logo or watermark.

Avoid: flat single-tone cel shading, photographic appearance, semi-realistic face, plastic 3D-render finish.
```
