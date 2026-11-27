/* 지시문 조립 — 표(lib/prompt-spec.js)와 설계표(data/city-design.json)·화풍 판(data/style.json)으로 영어 지시문을 짓는다.
   ES 모듈도 빌드도 쓰지 않는다. window.AtelierPrompt(생성기 · 도구 · 검사가 쓰는 함수 묶음)와 window.PromptCity(계획 Task 3 의 꼴) 둘을 붙인다.

   원소 공방(lib/prompt-element.js)에서 옮겼다(2026-11-19, 계획 Task 3). 원소의 나라 › 가문 › 주민 세 층은 걷어 내고 도시 한 층 — 카드 열쇠 = 도시 열쇠(seoul …).
   원소 조립기의 「원소 성질 = 시각 언어 한 줄」 자리에 「도시 motif + 세계 표지」 — 세계는 장르 이름이 아니라 설계표 vocab.markers.<세계>.en 을 사람에게(옷 · 몸 · 소품 · 빛) 싣는다.
   배경은 그 세계의 그 도시(worlds.<세계>.en)가 거든다. 구도 기본은 원소 그대로(사람이 주인공, 전신 2:3).

   PromptCity.vista({ design, styles, city, world, style }) → { text, file } — 전경(2026-11-24, 사람 없는 도시 풍경 3:2 — 도시 무대 배경). 도구 tools/vista-prompt.cjs.
   PromptCity.build({ design, styles, city, world, style, kind, look, shot, notes }) → { text, sections } — 설계 미정 도시(worlds: {})는 { text: '', sections: {}, missing: ['worlds'] }.
     world 가 세 세계(fantasy · steampunk · cyberpunk)가 아니면(옛 mecha 포함) 던진다.
     kind 'casual'(Task 4) — o.casual = { scene, tree, tree2, life, props, n } → 일상컷 지시문. sections = head · body · negative(맨 끝 「Avoid:」 단락 — 화풍 금지 + 그 세계 banned_en).
     sections — 기본 화풍의 칸 꼴: head · s1(STYLE) · s2(CHARACTER) · s3(COSTUME) · s4(SCENE) · s5(CONSTRAINTS) · negative(5칸의 Avoid 줄 — 금지 낱말은 이 줄에만 나온다).
     칸 꼴이 아닌 화풍은 head · body. 둘 다 style_undecided(화풍 판의 undecided — 생성기가 「화풍 미정」 을 보일 수 있게).
   AtelierPrompt.build(D, S, key, world, opts) → 지시문 글. opts = { style, notes: {scene, outfit, custom}, look: {params, faceDesignOn, silhouetteOn, exposure}, shot: {scene, time, pose, expr, frame} }.
     shot.scene 은 설계표 worlds.<세계>.scenes 의 열쇠(비우면 첫 장면), time 은 T.WORLD_TIMES, pose 는 T.WORLD_POSES, expr 은 T.EXPRESSION_DETAIL, frame 은 T.SILHOUETTES.<세계>.
   buildCasual(D, S, key, scene, opts) → 일상컷 지시문(트리 버전2). opts = { world, style, tree, tree2, life(data/city-life.json), props(data/world-props.json) }.
     일상컷 = 그 세계의 그 도시의 하루(설계 3-1절, Task 4): 생활 장면표의 장면은 트리 장소 <도시>_<장면>(lifeTree — 받침은 base 장소 것)이 되고, Place 줄은 그 장면의 그 세계 글,
     Around her 줄은 그 장면 소품의 그 세계 낱말, PROP 의 물건 · 옷의 결도 그 세계 것. 시간 · 계절 · 날씨는 생활 장면표(times · seasons · weather). */
(function (root) {
  'use strict';
  var T = root.AtelierSpec;

  function fill(t, m) { return String(t).replace(/\{(\w+)\}/g, function (_, k) { return m[k] != null ? m[k] : ''; }); }
  function trim(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function noDot(s) { return trim(s).replace(/[.;:]+$/, ''); }
  function byKey(list, k) { return (list || []).filter(function (r) { return r.key === k; })[0] || null; }

  /* ══ 카드 = 도시 ══ */
  function city(D, key) { return ((D && D.cities) || []).filter(function (c) { return c.key === key; })[0] || null; }
  /* 카드 열쇠 <도시>-<랜드마크> 를 푸는 한 곳. 랜드마크 행 = 부모 도시 행 위에 랜드마크 칸을 덮은 새 객체(도시 칸 people · palette · symbols … 은 그대로) */
  function parentOf(key) { return String(key || '').split('-')[0]; }
  function landmarksOf(D, cityKey) { var c = city(D, cityKey); return ((c && c.landmarks) || []).map(function (l) { return { key: c.key + '-' + l.key, ko: l.ko, en: l.en }; }); }
  function row(D, key) {
    var c = city(D, key); if (c) return c;
    var i = String(key || '').indexOf('-'); if (i < 0) return null;
    var p = city(D, key.slice(0, i)), lk = key.slice(i + 1), l = p && (p.landmarks || []).filter(function (x) { return x.key === lk; })[0];
    if (!l) return null;
    /* 랜드마크 세계는 부모 도시 세계의 palette · own_vocab 을 물려받는다(자기 것이 있으면 그것) */
    var lw = {}; Object.keys(l.worlds || {}).forEach(function (w) { var a = l.worlds[w], b = (p.worlds || {})[w] || {}, o = Object.assign({}, a); if (!a.palette && b.palette) o.palette = b.palette; if (!a.own_vocab && b.own_vocab) o.own_vocab = b.own_vocab; lw[w] = o; });
    var r = Object.assign({}, p, { key: key, parent: p.key, landmark: lk, ko: l.ko, en: l.en, persona: l.persona, worlds: lw, card_ko: l.card_ko });
    delete r.landmarks; return r;
  }
  function card(D, key) {
    var c = row(D, key); if (!c) return null;
    var p = c.parent ? city(D, c.parent) : c, o = { key: c.key, tier: c.parent ? 'landmark' : 'city', city: c, ko: c.ko, en: c.en, cityKo: p.ko, cityEn: p.en, people: trim((c.people || {}).en) };
    if (c.parent) { o.parent = c.parent; o.landmark = c.landmark; }
    return o;
  }
  function cards(D) { var out = []; ((D && D.cities) || []).forEach(function (c) { out.push(c.key); landmarksOf(D, c.key).forEach(function (l) { out.push(l.key); }); }); return out; }
  function worldKeys(D) { return ((D && D.vocab) || {}).worlds || T.WORLDS.map(function (w) { return w.key; }); }
  /* 설계한 세계만 — 설계 미정 도시는 [] */
  function worldsOf(D, key) { var c = row(D, key); if (!c) return []; return worldKeys(D).filter(function (w) { return !!(c.worlds || {})[w]; }); }
  function worldRow(world) { return T.WORLDS.filter(function (w) { return w.key === world; })[0] || null; }
  /* 세 세계가 아니면 던진다 — 원소의 mecha 가 기억값 · 옛 기록으로 들어오지 않게 */
  function needWorld(world) { if (!worldRow(world)) throw new Error('unknown world: ' + world + ' (fantasy · steampunk · cyberpunk)'); return worldRow(world); }
  function worldOf(c, world) { return ((c && c.city.worlds) || {})[world] || null; }
  function markers(D, world) { return ((((D && D.vocab) || {}).markers || {})[world]) || { en: [], banned_en: [] }; }
  function wearOf(D, world) { return ((((D && D.vocab) || {}).wear || {})[world]) || {}; }
  /* 도시별 말(설계표 worlds.<세계>.own_vocab — 2026-11-20): 있으면 공용 표지 · 옷 말투 · 일상컷 세계 줄 · 소품 글 대신. 공용에 한 도시 것이 섞이지 않게 */
  function ownVocab(c, world) { return (((c && c.worlds) || {})[world] || {}).own_vocab || {}; }
  /* Avoid 줄에 싣는 그 세계 금지 낱말 — own_vocab.unban_en 은 그 도시에서만 뺀다(2026-11-21 베이징 — 서울 때 더한 Chinese-style palace · Great Wall · yellow-glazed roof tiles 가 베이징에선 그 도시 자체). 글 검사는 그대로 */
  function bannedOf(D, c, world, casual) { var off = ownVocab(c, world).unban_en || [], mk = markers(D, world); return (mk.banned_en || []).concat(casual ? mk.casual_banned_en || [] : []).filter(function (b) { return off.indexOf(b) < 0; }); }

  function styleRow(S, styleKey) { var st = (S && S.styles || {})[styleKey || (S && S['default'])]; return st || null; }
  function styleVer(S, styleKey) { var st = styleRow(S, styleKey); return st ? (st.versions || []).filter(function (x) { return x.v === st.current; })[0] || (st.versions || [])[0] || {} : {}; }
  function styleText(S, styleKey, slot) { return styleVer(S, styleKey)[slot || 'text'] || ''; }
  /* 화풍 판의 얼굴 낱말(v3) — {'칸.값': 글}. 옛 판엔 없다 */
  function styleFace(S, styleKey) { return styleVer(S, styleKey).face || {}; }
  function exprText(S, styleKey, k, fallback) { var e = styleVer(S, styleKey).expr || {}; return e[k] || fallback; }
  function styleVersion(S, styleKey) { var st = styleRow(S, styleKey); return st ? st.current : ''; }

  /* ══ 외형 ══ 설계표 worlds.<세계>.look — 세계마다 완전히 다른 사람이라 물려받는 칸이 없다(설계 6절). 표는 lib/look-spec.js.
     opts.look = { params: {열쇠: 값}, faceDesignOn, silhouetteOn, exposure }. 직접 고른 항목이 설계의 그 묶음을 이긴다 */
  function lookOf(c, world) {
    var l = (worldOf(c, world) || {}).look || {};
    return { face: Object.assign({}, l.face || {}), silhouette: Object.assign({}, l.silhouette || {}) };
  }
  function en(axis, key) { return ((T.VOCAB_EN || {})[axis] || {})[key] || key || ''; }
  function isHex(v) { return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v); }
  /* 외형 칸 {열쇠: 값} → [[열쇠, 값]] — 외형 묶음(base·build·face·hair)의 값 있는 것만. 직접 입력(__custom__)은 그 글(열쇠_custom)로 */
  function identityParams(params) {
    var out = [];
    if (!T.PARAM_DEFS) return out;
    Object.keys(params || {}).forEach(function (k) {
      var d = T.PARAM_DEFS.filter(function (x) { return x.key === k; })[0], v = params[k];
      if (!d || T.IDENTITY_GROUPS.indexOf(d.group) < 0 || T.IDENTITY_EXCLUDED.indexOf(k) >= 0) return;
      if (v === '__custom__') v = trim(params[k + '_custom']);
      if (!v || v === 'AUTO') return;
      out.push([k, v]);
    });
    return out;
  }
  function chosenKeys(params) { var out = {}; identityParams(params).forEach(function (p) { out[p[0]] = 1; }); return out; }
  /* game 의 paramValues — 저장된 열쇠는 그대로, 풀이만 붙인다 */
  function paramValues(raw) {
    var out = raw.map(function (p) { return p.slice(); });
    var value = function (k) { var p = raw.filter(function (p) { return p[0] === k; })[0]; return p ? p[1] : ''; };
    var has = function (k) { return !!value(k); };
    out = out.map(function (p) {
      var guide = T.PARAM_GUIDES[p[0]] && T.PARAM_GUIDES[p[0]][p[1]];
      if (p[0] === 'hair length' && guide && T.HAIR_LENGTH_LIMITS[value('hairstyle')]) return [p[0], T.HAIR_LENGTH_LIMITS[value('hairstyle')][1]];
      if (p[0] === 'eye shape' && ((p[1] === 'large' && has('eye size')) || (p[1] !== 'large' && has('eye tilt'))) && T.EYE_CONTOURS[p[1]]) return [p[0], T.EYE_CONTOURS[p[1]]];
      if (T.COLOR_KEYS[p[0]] && isHex(p[1])) return [p[0], p[1].toUpperCase()];
      return [p[0], guide ? p[1] + ' — ' + guide[1] : p[1]];
    });
    if (has('body type')) out.push(['body scope', 'Body type sets the build; body details adjust within it. These describe anatomy beneath the costume, not costume volume.']);
    if (has('hairstyle')) out.push(['hair scope', 'Keep the cut and its fixed length; other hair settings adjust within it. Hair choices do not set ethnicity.']);
    if (T.FACE_KEYS.some(has)) out.push(['facial precedence', 'Explicit facial geometry controls the actual outline, above style, ethnicity or demeanor; shading and expression must not reshape it.']);
    if (has('facial character')) out.push(['demeanor scope', 'Facial character affects demeanor only; preserve age and geometry. Explicit scene expression takes priority.']);
    if (has('facial ethnicity')) out.push(['ethnicity scope', 'Broad ancestry cue with individual variation; preserve explicit geometry, skin tone and hair. No stereotyped features.']);
    var right = value('eye color'), left = value('second eye color');
    out = out.filter(function (p) { return p[0] !== 'second eye color'; });
    if (left && left !== right) out.push(['heterochromia', 'Character-relative right eye is ' + (right || 'one chosen primary color, different from ' + left) + '; left eye is ' + left + '. Keep the sides; do not blend colors.']);
    else if (right) out.push(['eye color consistency', 'both eyes are ' + right]);
    return out;
  }
  /* 설계의 얼굴 → FACE 줄 항목. 직접 고른 묶음·끈 경우는 빠진다 */
  function faceItems(c, look, world, fw) {
    look = look || {}; fw = fw || {}; var f = lookOf(c, world).face, chosen = chosenKeys(look.params);
    if (look.faceDesignOn === false || !T.FACE_PARAM) return [];
    var base = Object.keys(T.FACE_PARAM).filter(function (k) { return f[k] && !chosen[T.FACE_PARAM[k]]; }).map(function (k) { return [k, fw[k + '.' + f[k]] || en(k, f[k])]; });
    if (!designedFace(f)) return base.map(function (p) { return p[1]; });
    /* 얼굴 설계 — 인상이 먼저, 피부 · 윤곽 · 눈(크기 · 꼬리 · 모양) · 눈썹 · 코 · 입 · 눈 색 · 표식 */
    var FD = T.FACE_DESIGN, d = function (k) { return f[k] && FD[k][f[k]] && !chosen[FD.param[k]] ? (fw[k + '.' + f[k]] || FD[k][f[k]]) : ''; }, get = function (k) { var p = base.filter(function (x) { return x[0] === k; })[0]; return p ? p[1] : ''; };
    var eyes = [d('eye_size'), get('eyes')].filter(Boolean).join(' — ') + (d('eye_tilt') ? ', ' + d('eye_tilt') : '');
    var imp = d('impression');
    return [imp ? 'first impression — ' + imp : '', d('skin_tone'), get('face_shape'), eyes, get('brows'), get('nose'), get('lips'), get('eye_color'), d('mark')].filter(function (x) { return x && x !== ', '; });
  }
  function designedFace(f) { return !!(T.FACE_DESIGN && f && f.impression && T.FACE_DESIGN.impression[f.impression]); }
  /* 설계의 실루엣 셋 → SILHOUETTE 줄 항목 */
  function silhouetteItems(c, look, world) {
    look = look || {}; var s = lookOf(c, world).silhouette, chosen = chosenKeys(look.params), out = [];
    if (look.silhouetteOn === false || !T.SIL_PARAM) return out;
    if (s.body && !chosen[T.SIL_PARAM.body]) out.push(en('body', s.body) + ' build');
    if (s.hair && !chosen[T.SIL_PARAM.hair]) out.push(en('hair', s.hair) + (s.bangs && T.FACE_DESIGN && T.FACE_DESIGN.bangs[s.bangs] && !chosen.bangs ? ' with ' + T.FACE_DESIGN.bangs[s.bangs] : ''));
    if (s.hair_color && !chosen[T.SIL_PARAM.hair_color]) out.push(en('hair_color', s.hair_color));
    return out;
  }
  function ageLine(look, f) {
    var v = ((look || {}).params || {})['apparent age'];
    if (v === '__custom__') v = trim((look.params || {})['apparent age_custom']);
    if ((!v || v === 'AUTO') && f && f.age && T.FACE_DESIGN && T.FACE_DESIGN.age[f.age]) return T.FACE_DESIGN.age[f.age];
    if (!v || v === 'AUTO') v = T.AGE_DEFAULT;
    return T.AGE_LINES ? (T.AGE_LINES[v] || ('AGE: ' + v + '.')) : '';
  }
  /* 노출 — 비우면 싣지 않는다. 설계표 vocab.wear.<세계>.<단계>(세계 옷 말투)가 먼저, 없으면 공용 문장(EXPOSURE · EXPOSURE_LAYER) */
  function exposureLine(look, world, D) {
    var k = (look || {}).exposure, own = wearOf(D, world)[k];
    if (k && own) return trim(own);
    var e = T.EXPOSURE && T.EXPOSURE[k];
    if (!e) return '';
    if (typeof e === 'string') return e;
    return e[T.EXPOSURE_LAYER[world]] || e.open;
  }
  /* 생성기 · 도구가 저장한 외형 칸을 바로잡는다 — 모르는 열쇠는 버리고, 노출은 아는 값만 */
  function normLook(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    var out = { params: {}, faceDesignOn: raw.faceDesignOn !== false, silhouetteOn: raw.silhouetteOn !== false, exposure: T.EXPOSURE_DEFAULT || '' };
    if (T.EXPOSURE_KEYS && T.EXPOSURE_KEYS.indexOf(raw.exposure) >= 0) out.exposure = raw.exposure;
    var p = raw.params && typeof raw.params === 'object' ? raw.params : {};
    Object.keys(p).forEach(function (k) {
      var base = k.replace(/_custom$/, ''), d = (T.PARAM_DEFS || []).filter(function (x) { return x.key === base; })[0];
      if (d && typeof p[k] === 'string' && p[k]) out.params[k] = p[k];
    });
    return out;
  }

  /* 그 도시 · 세계의 장면 셋(설계표 scenes) */
  function scenesOf(c, world) { return ((worldOf(c, world) || {}).scenes || []).slice(); }
  /* 실루엣 — 고른 값(shot.frame)이 먼저, 없으면 카드의 세계별 설계값(worlds.<세계>.sil), 'free' 면 없음.
     2026-11-20 사용자 「사이버펑크는 외투 의상만 다르고 안에 입는옷은 다 똑같아보이는데」 → 「응 바꿔줘」(세 세계 다) — 전엔 카드마다 실루엣 설계값이 없어
     세계 옷 말투 · 노출 줄이 옷 종류까지 정해 모든 카드가 같은 옷이었다. 이제 옷의 꼴은 이 칸이, 세계 옷 말투는 소재 · 결만 */
  function silOf(c, world, shot) {
    var f = trim((shot || {}).frame);
    if (f === 'free' || !c) return null;
    if (!f) f = trim((worldOf(c, world) || {}).sil);
    return f ? byKey((T.SILHOUETTES || {})[world], f) : null;
  }
  /* 세계 그림 칸(장면·시간대·자세·표정·실루엣)을 바로잡는다 — 모르는 열쇠는 비운다 */
  function normShot(D, key, world, raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    var c = card(D, key), out = { scene: '', time: '', pose: '', expr: '', frame: '' };
    if (raw.frame === 'free' || byKey((T.SILHOUETTES || {})[world], raw.frame)) out.frame = raw.frame;
    if (c && byKey(scenesOf(c, world), raw.scene)) out.scene = raw.scene;
    if (byKey(T.WORLD_TIMES, raw.time)) out.time = raw.time;
    if (byKey(T.WORLD_POSES, raw.pose)) out.pose = raw.pose;
    if (T.EXPRESSION_DETAIL && T.EXPRESSION_DETAIL[raw.expr]) out.expr = raw.expr;
    return out;
  }
  /* 손에 드는 것 — 설계표 worlds.<세계>.hold.en(세계를 안 주면 첫 세계) */
  function holdOf(c, world) { var w = worldOf(c, world) || worldOf(c, Object.keys((c && c.city.worlds) || {})[0]) || {}; return trim((w.hold || {}).en); }

  /* ══ 세계 그림 — 줄 꼴(긴 판) ══ 짧은 판 · 칸 꼴은 이 줄들에서 뽑는다. 원소의 구조판(mmorpg2d · semireal)과 kv 판은 내린 화풍(retired)뿐이라 옮기지 않았다 —
     그 화풍을 열쇠로 주면 판의 text 를 쓰는 줄 꼴로 짓는다(Task 11 에서 새 화풍을 고르면 그 꼴을 다시 본다) */
  function worldLines(D, S, key, world, opts) {
    opts = opts || {};
    var W = needWorld(world), c = card(D, key); if (!c) return null;
    var w = worldOf(c, world); if (!w) return null;
    var look = normLook(opts.look), shot = normShot(D, key, world, opts.shot), m = { city_en: c.cityEn, city_ko: c.cityKo };
    var lines = [], add = function (t, x) { if (trim(x)) lines.push([t, x]); };
    add('concept', fill(c.tier === 'landmark' ? T.CONCEPT_LANDMARK : T.CONCEPT, Object.assign({ landmark_en: c.en }, m)));
    /* 도시 motif + 상징 색 — 원소의 「ELEMENT TRAITS」 자리 */
    var pal = trim((w.palette || c.city.palette || {}).en);   /* 세계 palette 가 있으면 그것(서울 판타지 — 빨강이 중국풍으로 읽혀서) */
    add('motif', fill(T.MOTIF_HEAD, m) + noDot((w.motif || {}).en) + '.' + (pal ? ' ' + T.PALETTE_HEAD + pal + T.ACCENT_TAIL + '.' : ''));
    var mk = ownVocab(c.city, world).marks || markers(D, world).en || [];
    if (mk.length) add('marks', T.MARKS_HEAD + mk.map(noDot).join('; ') + '.');
    /* 외형 — 나이 · 실루엣 · 얼굴 */
    var dzf = look.faceDesignOn === false ? {} : lookOf(c, world).face;
    add('look', ageLine(look, dzf));
    var sil = silhouetteItems(c, look, world); if (sil.length && T.LOOK_LINES) add('look', fill(T.LOOK_LINES.silhouette, { items: sil.join('; ') }));
    var fw = styleFace(S, opts.style), face = faceItems(c, look, world, fw);
    if (face.length && styleVer(S, opts.style).face_tail && designedFace(dzf)) face.push(styleVer(S, opts.style).face_tail);
    if (face.length && T.LOOK_LINES) add('look', fill(designedFace(dzf) ? T.FACE_DESIGN.head : T.LOOK_LINES.face, { items: face.join('; ') }));
    /* WORLD — 그 세계의 그 도시(배경은 거든다) + 세계 옷 말투(설계표 wear.costume) + 빛 · 머리 */
    add('world', trim(W.head + noDot(w.en) + '. ' + trim(ownVocab(c.city, world).costume || wearOf(D, world).costume) + ' ' + W.tail));
    var mf = silOf(c, world, shot);
    if (mf) add('world', T.SILHOUETTE_HEAD[world] + mf.en + '. Only the overall shape is fixed; design the details freely in the city motif, the world marks and the palette. This silhouette overrides the overall shape of the costume above.');
    /* 장면 — 고른 것, 없으면 첫 장면(세계 장면이 늘 실린다) · 시간대 */
    var sc = scenesOf(c, world), scn = byKey(sc, shot.scene) || sc[0];
    if (scn) add('scene', T.SCENE_HEAD + noDot(scn.en) + '.');
    var tm = byKey(T.WORLD_TIMES, shot.time); if (tm) add('scene', tm.en);
    var h = holdOf(c, world); if (h) add('prop', T.PROP_HEAD + noDot(h) + '; her other hand is free.');
    add('style', styleText(S, opts.style, 'text') ? 'STYLE: ' + styleText(S, opts.style, 'text') : '');
    add('exposure', exposureLine(look, world, D));
    var notes = opts.notes || {};
    T.NOTES.forEach(function (f) { var v = trim(notes[f.id]); if (v) add('note', f.head + v); });
    var po = byKey(T.WORLD_POSES, shot.pose);
    add('output', fill(T.OUTPUT, { pose: po ? po.en : T.POSE_DEFAULT }));
    var ex2 = shot.expr || (dzf.expr && T.EXPRESSION_DETAIL[dzf.expr] ? dzf.expr : '');
    if (ex2) add('expr', T.EXPR_HEAD + exprText(S, opts.style, ex2, T.EXPRESSION_DETAIL[ex2]) + '.');
    add('body', T.BODY_LINE);
    var values = paramValues(identityParams(look.params)).filter(function (p) { return p[0] !== 'apparent age'; });
    if (values.length && T.LOOK_LINES) add('look', T.LOOK_LINES.identity + '\n' + values.map(function (p) { return p[0] + ': ' + p[1]; }).join('\n') +
      (values.some(function (p) { return p[0] === 'body measurements (B/W/H)'; }) ? '\n' + T.LOOK_LINES.measurement : ''));
    T.RULES.forEach(function (r) { add('rules', fill(r, m)); });
    lines.card = c; lines.m = m;
    return lines;
  }
  function longText(D, S, key, world, opts) { var L = worldLines(D, S, key, world, opts); return L ? L.map(function (x) { return x[1]; }).join('\n') : ''; }

  /* ── 짧은 판(삼국지 · 원소에서) — 줄 꼴 긴 지시문에서 설계 칸만 뽑는다 ── */
  function worldShortOn(S, styleKey) { var row = styleVer(S, styleKey) || {}; return row.worldShort === false || row.format === 'structured' ? false : !!(row.worldShort || (S && S.worldShort)); }
  function chosenLine(look) {
    var values = paramValues(identityParams((normLook(look) || {}).params)).filter(function (p) { return p[0] !== 'apparent age'; });
    if (!values.length) return '';
    return 'Chosen look (overrides the automatic look): ' + values.map(function (p) { return p[0] + ': ' + p[1]; }).join('; ') + '.' +
      (values.some(function (p) { return p[0] === 'body measurements (B/W/H)'; }) && T.LOOK_LINES ? ' ' + T.LOOK_LINES.measurement : '');
  }
  function longParts(D, S, key, world, opts) {
    var L = longText(D, S, key, world, opts).split('\n');
    var P = {};
    P.line = function (h) { var l = L.filter(function (x) { return x.indexOf(h) === 0; })[0]; return l ? trim(l.slice(h.length)) : ''; };
    P.lineRe = function (re) { var l = L.filter(function (x) { return re.test(x); })[0]; return l ? trim(l.replace(re, '')) : ''; };
    P.all = L;
    var face = P.line('FACE —'), fi = face.indexOf('first impression — '), fe = face.indexOf('. Whatever');
    P.face = noDot(fi >= 0 ? face.slice(fi + 19, fe > 0 ? fe : undefined) : face);
    P.motif = P.lineRe(/^CITY MOTIF of [^:]+:\s*/);
    P.marks = P.line(T.MARKS_HEAD.trim());
    P.prop = P.line('PROP:');
    P.world = P.lineRe(/^WORLD \([^)]*\):\s*/);
    P.sil = P.lineRe(/^OUTFIT SILHOUETTE:\s*/);
    P.scene = P.line(T.SCENE_HEAD.trim());
    P.ex = L.filter(function (x) { return /^EXPOSURE \(/.test(x); })[0] || '';
    return P;
  }
  function first(x) { var i = x.indexOf('. '); return i > 0 ? x.slice(0, i + 1) : x; }
  /* 「… Palette: x.」 → { text, palette } */
  function pal(x) { var m = x.match(/\s*Palette: ([^.]+)\.?$/); return m ? { text: trim(x.slice(0, m.index)), palette: trim(m[1]) } : { text: x, palette: '' }; }
  /* 세계 줄 → 세계 글 · 의상 · 빛 · 머리 */
  function splitWorld(wl) {
    var ci = wl.search(/\sCOSTUME \(/), out = { desc: ci >= 0 ? trim(wl.slice(0, ci)) : wl, costume: '', light: '', hair: '' };
    (ci >= 0 ? wl.slice(ci) : '').split(/\s(?=(?:LIGHT|HAIR): )/).forEach(function (seg) {
      seg = trim(seg);
      if (/^LIGHT: /.test(seg)) out.light = seg.slice(7); else if (/^HAIR: /.test(seg)) out.hair = seg.slice(6); else if (seg) out.costume = seg.replace(/^COSTUME \([^)]*\):\s*/, '');
    });
    return out;
  }
  /* 화풍 판 몫 얼굴 비율(삼국지에서 옮긴 kr_drawn_rim_dewy 의 worldFace, 2026-11-20) — 있으면 「Face proportions:」 줄을 그 글로. 판의 worldStyleAfter(피부 마감)는 얼굴 줄 바로 뒤 */
  function faceLine(row, fallback) { return trim(row.worldFace) ? 'Face proportions: ' + trim(row.worldFace) : fallback; }
  function buildWorldShort(D, S, key, world, opts) {
    var WS = T.WORLD_SHORT, X = longParts(D, S, key, world, opts), shot = normShot(D, key, world, opts.shot), po = byKey(T.WORLD_POSES, shot.pose), row = styleVer(S, opts.style) || {};
    var out = [
      fill(WS.head, { concept: X.line('CONCEPT:'), people: card(D, key).people }) + (X.line('AGE:') ? ' Age: ' + first(X.line('AGE:')) : ''),
      'Style: ' + shortStyle(S, opts.style),
      WS.beauty || '',
      'Her: ' + [X.face, X.line('SILHOUETTE:')].filter(Boolean).join('. '),
      trim(row.worldStyleAfter),
      chosenLine(opts.look),
      faceLine(row, WS.face || ''),
      X.motif ? 'Her city, worn on her: ' + X.motif : '',
      X.marks ? 'Her world, carried on her: ' + X.marks : '',
      X.world ? 'World and costume: ' + X.world : '',
      X.sil ? 'Outfit silhouette: ' + X.sil : '',
      X.ex ? X.ex.replace(/Chest and pelvis covered/g, 'Intimate areas covered') : '',
      X.prop ? 'Prop: ' + X.prop : '',
      'Pose: ' + noDot(po ? po.en : WS.pose) + '.' + (X.line('EXPRESSION:') ? ' Expression: ' + first(X.line('EXPRESSION:')) : ''),
      X.scene ? 'This card: ' + X.scene : ''];
    var tm = byKey(T.WORLD_TIMES, shot.time); if (tm) out.push(tm.en);
    var notes = opts.notes || {}; (T.NOTES || []).forEach(function (f) { var v = trim(notes[f.id]); if (v) out.push(f.head + v); });
    out.push(WS.composition, trim(row.worldLight) || WS.light, WS.end + (WS.guard[world] ? ' ' + WS.guard[world] : ''));
    return out.filter(Boolean).join('\n\n');
  }
  /* 칸 꼴 세계 그림(원소 2026-11-11 3단계 — 기본 화풍) — 짧은 판과 같은 글을 core 칸 틀(AtelierSpec.CORE_FRAME)의 다섯 칸에 나눠 싣는다.
     「No …」 금지는 5칸 Avoid 한 줄로 모인다 — 금지 낱말(설계표 banned_en 포함)이 지시문에 나와도 되는 곳은 그 줄뿐(tests/prompt-city.cjs (d)) */
  function worldSectionsOn(S, styleKey) {
    var row = styleVer(S, styleKey) || {};
    return worldShortOn(S, styleKey) && !!T.CORE_FRAME && row.worldSections !== false && !!(row.worldSections || (S && S.worldSections));
  }
  /* 「No a, b or c.」 · 「no a, no b」 → 금지 낱말 목록, 나머지 글은 그대로 */
  function splitNo(text) {
    var keep = [], avoid = [];
    trim(text).split(/\.\s+(?=[A-Z])/).forEach(function (sen) {
      var k = [], cap = false;
      sen.replace(/\.$/, '').split(/;\s*/).forEach(function (p) {
        if (!/^no\s/i.test(p)) { k.push(p); return; }
        p.replace(/^no\s+/i, '').split(/,\s*(?:no\s+)?|\s+or\s+(?:no\s+)?/i).map(trim).filter(Boolean).forEach(function (x) {
          if (/\bunless\b/.test(x)) { if (!k.length) cap = true; k.push('no ' + x); } else avoid.push(x);
        });
      });
      if (k.length) keep.push((cap ? k.join('; ').replace(/^./, function (c) { return c.toUpperCase(); }) : k.join('; ')) + '.');
    });
    return { text: keep.join(' '), avoid: avoid };
  }
  function buildWorldSections(D, S, key, world, opts) {
    var WS = T.WORLD_SHORT, CF = T.CORE_FRAME, X = longParts(D, S, key, world, opts), wr = worldRow(world) || {};
    var shot = normShot(D, key, world, opts.shot), po = byKey(T.WORLD_POSES, shot.pose), tm = byKey(T.WORLD_TIMES, shot.time), row = styleVer(S, opts.style) || {};
    var ex = X.ex.replace(/^EXPOSURE/, 'Exposure').replace(/Chest and pelvis covered/g, 'Intimate areas covered').replace(/the costume WORLD describes/g, 'the costume above');
    var mo = pal(X.motif), wd = splitWorld(X.world);
    var st = splitNo(shortStyle(S, opts.style)), co = splitNo(wd.costume), rules = splitNo(T.RULES[0]);
    var hair = wd.hair.replace('as SILHOUETTE says', 'as described above').replace('unless SILHOUETTE says an updo', 'unless the hair above is an updo');
    var wlight = tm ? wd.light.replace('unless TIME & WEATHER says otherwise', 'unless the time and weather above say otherwise') : wd.light.replace(/,?\s*unless TIME & WEATHER says otherwise/, '');
    var notes = opts.notes || {}, expr = X.line('EXPRESSION:');
    var p1 = [CF.s1, st.text, WS.beauty || '', faceLine(row, (WS.face || '').replace('described above', 'described below'))];
    var p2 = [CF.s2, X.line('AGE:') ? 'Age: ' + first(X.line('AGE:')) : '', X.face ? 'Face — her own: ' + X.face + '.' : '', trim(row.worldStyleAfter), X.line('SILHOUETTE:') ? 'Body and hair: ' + X.line('SILHOUETTE:') : '',
      hair ? 'Hair: ' + hair : '', chosenLine(opts.look), expr ? 'Expression: ' + first(expr) : '', CF.anatomy];
    var p3 = [fill(CF.s3, { costume: 'COSTUME', genre: wr.en || world.toUpperCase() }), co.text ? 'Costume: ' + co.text : '', mo.text ? 'City motif: ' + mo.text : '',
      X.marks ? 'World marks on her: ' + X.marks : '', X.sil ? 'Silhouette: ' + X.sil.replace('where EXPOSURE allows', 'where the exposure below allows') : '',
      mo.palette ? 'Colours: ' + mo.palette + '.' : '', X.prop ? 'Prop: ' + X.prop : '', ex];
    var p4 = [CF.s4, wd.desc ? 'World: ' + wd.desc : '', X.scene ? 'This card: ' + X.scene : ''];
    var secHead = function (x) { return x.replace(/^([A-Z][A-Z &]*):/, function (m, h) { return h.charAt(0) + h.slice(1).toLowerCase() + ':'; }); };
    (T.NOTES || []).forEach(function (f) { var v = trim(notes[f.id]); if (v) p4.push(secHead(f.head) + v); });
    p4.push('Pose: ' + noDot(po ? po.en : WS.pose) + '.', tm ? secHead(tm.en) : '', trim(row.worldLight) || (wlight ? 'Light: ' + wlight : WS.light), WS.composition);
    var avoid = st.avoid.concat(co.avoid, rules.avoid, row.avoid || [], bannedOf(D, card(D, key).city, world)).filter(function (x, i, a) { return a.indexOf(x) === i; });
    var p5 = [CF.s5, WS.end.replace('One figure only, natural hands with five fingers; ', 'One figure only; ') + (WS.guard[world] ? ' ' + WS.guard[world] : ''),
      avoid.length ? fill(CF.avoid, { list: avoid.join(', ') }) : ''];
    return [fill(WS.head, { concept: X.line('CONCEPT:'), people: card(D, key).people })].concat([p1, p2, p3, p4, p5].map(function (p) { return p.filter(Boolean).join('\n'); })).join('\n\n');
  }
  /* GPT 설계 실루엣 목록 — 그 세계 실루엣 전부(도시는 카드마다 실루엣 묶음이 없다) */
  function silPool(c, world) { return ((T.SILHOUETTES || {})[world] || []).slice(); }
  /* ══ 칸 채우기 세계컷 GPT 설계(삼국지 공방 2026-11-18 · 11-19 를 옮김 — 사용자 2026-11-20 「칸 채우기로 옮겨줘」) ══
     우리 설계 지시문(build)에서 헤어스타일 · 체형 글 자리를 칸으로 비우고, Face 줄을 얼굴 여덟 칸으로, 실루엣 칸 · 디자인 아이디어 줄 · 서는 법 · 배경 줄을 더한다.
     표정 줄은 맡은 쪽이 고쳐도 되고, 나머지 줄은 글자 그대로. 도시는 카드마다 실루엣 설계값이 없어(silOf) 실루엣 칸은 Costume 줄 뒤에 새 줄로, 목록은 그 세계 실루엣 전부 */
  var FILL_HAIR = '[HAIRSTYLE: …]', FILL_HCOL = '[HAIR COLOUR: …]', FILL_SIL = '[COSTUME SILHOUETTE: …]', FILL_BODY = '[BUILD: …]', FILL_IDEA = 'Design idea: …', FILL_STANCE = 'Stance and hands: …', FILL_SET = 'Setting detail: …';
  var FILL_FREE = /^(Face —[^:]*:|FACE —[^:]*:|Face:|FACE:|Expression:|EXPRESSION:)/;
  var FACE_SLOTS = [['impression', 'IMPRESSION'], ['skin_tone', 'SKIN TONE'], ['face_shape', 'FACE SHAPE'], ['eyes', 'EYE SHAPE'], ['eye_color', 'EYE COLOUR'], ['brows', 'BROWS'], ['nose', 'NOSE'], ['lips', 'LIPS']];
  var FACE_NO = { lips: ['wide_smile'] }, FACE_LINE = /^(Face —[^:]*:|FACE —[^:]*:|Face:|FACE:)/;
  var faceTok = function (lab) { return '[' + lab + ': …]'; };
  function faceOpts(c, world) {
    var f = (lookOf(c, world) || {}).face || {}, FD = T.FACE_DESIGN || {}, out = {};
    FACE_SLOTS.forEach(function (sl) {
      var k = sl[0], tab = (k === 'impression' || k === 'skin_tone') ? (FD[k] || {}) : ((T.VOCAB_EN || {})[k] || {});
      var ours = f[k] && typeof tab[f[k]] === 'string' ? noDot(tab[f[k]]) : '', seen = {};
      var list = Object.keys(tab).filter(function (x) { return typeof tab[x] === 'string' && tab[x] && x !== f[k] && (FACE_NO[k] || []).indexOf(x) < 0; })
        .map(function (x) { return noDot(tab[x]); }).filter(function (x) { if (!x || x === ours || seen[x]) return false; seen[x] = 1; return true; });
      out[k] = { label: sl[1], ours: ours, list: list };
    });
    return out;
  }
  var SLOTS = {};
  function slotTable() { if (!SLOTS[FILL_HAIR]) { SLOTS[FILL_HAIR] = 'hair'; SLOTS[FILL_HCOL] = 'hcol'; SLOTS[FILL_SIL] = 'sil'; SLOTS[FILL_BODY] = 'body'; FACE_SLOTS.forEach(function (sl) { SLOTS[faceTok(sl[1])] = 'face_' + sl[0]; }); } return SLOTS; }
  var escRe = function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  function slotSplit() { return new RegExp('(' + Object.keys(slotTable()).map(escRe).join('|') + ')'); }
  function hasSlot(tl) { return slotSplit().test(tl); }
  function slotRe(tl, keys) { var ST = slotTable(); return new RegExp('^' + tl.split(slotSplit()).map(function (x) { if (ST[x]) { keys.push(ST[x]); return '(.+?)'; } return escRe(x); }).join('') + '$'); }
  function fillOpts(c, world) {
    var h = (lookOf(c, world) || {}).silhouette || {};
    return { hair: h.hair ? en('hair', h.hair) : '', bangs: h.bangs ? (((T.FACE_DESIGN || {}).bangs || {})[h.bangs] || '') : '',
      sil: (function (x) { return x ? noDot(x.en) : ''; })(silOf(c, world, {})), list: silPool(c, world).filter(function (x) { var o = silOf(c, world, {}); return !o || x.key !== o.key; }).map(function (x) { return noDot(x.en); }),
      /* 머리색 · 체형도 우리와 다르게(2026-11-20 사용자 「gpt 설계 세계컷에 머리색이랑 눈색, 체형을 우리 설계랑 다 다르게 해줘」 → 「도시 공방에만」) — 목록에서 우리 것을 뺀다. 눈색은 얼굴 칸(EYE COLOUR)이 이미 그렇다 */
      body: h.body ? en('body', h.body) : '', bodies: Object.keys((T.VOCAB_EN || {}).body || {}).filter(function (k) { return k !== h.body; }).map(function (k) { return en('body', k); }).filter(function (x, i, a) { return x && x !== en('body', h.body) && a.indexOf(x) === i; }),
      hcol: h.hair_color ? en('hair_color', h.hair_color) : '', hcols: Object.keys((T.VOCAB_EN || {}).hair_color || {}).filter(function (k) { return k !== h.hair_color; }).map(function (k) { return noDot(en('hair_color', k)); }).filter(function (x, i, a) { return x && x !== noDot(en('hair_color', h.hair_color)) && a.indexOf(x) === i; }) };
  }
  function worldFillTemplate(D, S, key, world, opts) {
    var c = card(D, key); if (!c || !worldOf(c, world)) return '';
    var o = fillOpts(c, world), t = build(D, S, key, world, Object.assign({}, opts, { shot: {}, notes: {} })), low = t.toLowerCase();
    for (var bi = o.body ? t.indexOf(o.body) : -1; bi >= 0; bi = t.indexOf(o.body, bi + 1)) if (bi === 0 || !/[A-Za-z-]/.test(t[bi - 1])) { t = t.slice(0, bi) + FILL_BODY + t.slice(bi + o.body.length); low = t.toLowerCase(); break; }   /* 우리 체형 글 → [BUILD: …] */
    var hci = o.hcol ? t.indexOf(o.hcol) : -1;   /* 우리 머리색 글 → [HAIR COLOUR: …] */
    if (hci >= 0) { t = t.slice(0, hci) + FILL_HCOL + t.slice(hci + o.hcol.length); low = t.toLowerCase(); }
    var i = o.hair ? low.indexOf(o.hair.toLowerCase()) : -1;
    if (i >= 0) { var end = i + o.hair.length; if (o.bangs) { var j = t.indexOf(o.bangs, end); if (j >= 0 && j - end <= 12) end = j + o.bangs.length; } t = t.slice(0, i) + FILL_HAIR + t.slice(end); }
    var L = t.split('\n');
    var ffi = L.findIndex(function (x) { return FACE_LINE.test(x); });   /* Face 줄 → 얼굴 칸 여덟 */
    if (ffi >= 0) L[ffi] = L[ffi].match(FACE_LINE)[1] + ' ' + FACE_SLOTS.map(function (sl) { return faceTok(sl[1]); }).join('; ') + '.';
    else L.splice(1, 0, 'Face: ' + FACE_SLOTS.map(function (sl) { return faceTok(sl[1]); }).join('; ') + '.');
    if (i < 0) { var fi = L.findIndex(function (x) { return FILL_FREE.test(x); }); L.splice(fi >= 0 ? fi + 1 : 1, 0, 'Hairstyle: ' + FILL_HAIR + '.'); }
    var oi = o.sil ? L.findIndex(function (x) { return x.indexOf(o.sil) >= 0; }) : -1;   /* 우리 실루엣 글이 있으면 그 자리를 칸으로(2026-11-20) */
    if (oi >= 0) { L[oi] = L[oi].replace(o.sil, FILL_SIL); L.splice(oi + 1, 0, FILL_IDEA); }
    else { var ci = L.findIndex(function (x) { return /^(Costume:|COSTUME:)/.test(x); });
      L.splice(ci >= 0 ? ci + 1 : L.length, 0, 'Costume silhouette: ' + FILL_SIL + '.', FILL_IDEA); }
    var pi = L.findIndex(function (x) { return /^(Pose:|POSE:)/.test(x); });
    L.splice(pi >= 0 ? pi + 1 : L.length, 0, FILL_STANCE, FILL_SET);
    return L.join('\n');
  }
  /* 채운 글이 틀을 지켰나 — 틀린 것 목록(빈 목록이면 통과). other — 다른 GPT 설계 글(둘이 헤어스타일 · 실루엣 · 얼굴 칸마다 달라야 한다). 검사 말은 낱말 표 WORLD_FREE.msg */
  var FM = function (k) { return ((T.WORLD_FREE || {}).msg || {})[k] || k; };
  function worldFillErrors(D, S, key, world, filled, opts, other) {
    opts = opts || {};
    var c = card(D, key); if (!c) return [FM('no_card')];
    var o = fillOpts(c, world), errs = [], got = {};
    var T0 = worldFillTemplate(D, S, key, world, opts).split('\n').map(trim).filter(Boolean);
    var F = String(filled || '').split('\n').map(trim).filter(Boolean);
    if (!F.length || !/^SUMMARY:\s*\S/.test(F[0])) errs.push(FM('no_summary')); else F = F.slice(1);
    var j = 0;
    for (var i = 0; i < T0.length; i++) {
      var tl = T0[i], fl = F[j];
      if (tl === FILL_STANCE || tl === FILL_SET) { var pre = tl.split(':')[0] + ':'; if (fl && fl.indexOf(pre) === 0) { if (/…/.test(fl)) errs.push(pre + FM('slot_empty')); j++; } continue; }
      if (fl == null) { errs.push(FM('line_missing') + tl.slice(0, 60)); continue; }
      if (tl === FILL_IDEA) { if (!/^Design idea:\s*\S/.test(fl) || /…/.test(fl)) errs.push(FM('idea_empty')); else got.idea = fl; j++; continue; }
      if (hasSlot(tl)) {
        var keys = [], m = slotRe(tl, keys).exec(fl);
        if (!m) errs.push(FM('outside_changed') + tl.slice(0, 60)); else keys.forEach(function (k, n) { got[k] = trim(m[n + 1]); });
        j++; continue;
      }
      var fm = FILL_FREE.exec(tl);
      if (fm) { if (fl.indexOf(fm[1]) !== 0) errs.push(FM('line_head') + tl.slice(0, 40)); j++; continue; }
      if (fl !== tl) errs.push(FM('line_changed') + tl.slice(0, 60)); j++;
    }
    if (j < F.length) errs.push(FM('line_added') + F[j].slice(0, 60));
    if (got.hair != null) { var gh = got.hair.toLowerCase(); if (/…/.test(gh) || !gh) errs.push(FM('hair_empty')); else if (o.hair && gh.indexOf(o.hair.toLowerCase()) >= 0) errs.push(FM('hair_same') + o.hair + ')'); }
    if (got.body != null && o.bodies.indexOf(trim(got.body)) < 0) errs.push(FM('body_off') + got.body.slice(0, 60));
    if (got.hcol != null) { if (!trim(got.hcol) || /…/.test(got.hcol)) errs.push(FM('hcol_empty')); else if (o.hcols.indexOf(noDot(got.hcol)) < 0) errs.push(FM('hcol_off') + got.hcol.slice(0, 60)); }
    if (got.sil != null && o.list.indexOf(noDot(got.sil)) < 0) errs.push(FM('sil_off') + got.sil.slice(0, 60));
    var fo = faceOpts(c, world);
    FACE_SLOTS.forEach(function (sl) { var v = got['face_' + sl[0]]; if (v == null) return;
      if (!trim(v) || /…/.test(v)) errs.push(sl[1] + FM('slot_empty')); else if (fo[sl[0]].list.indexOf(noDot(v)) < 0) errs.push(FM('face_off') + sl[1] + ': ' + v.slice(0, 50)); });
    if (other) { var e2 = worldFillPicks(D, S, key, world, other, opts); if (got.hair && e2.hair && got.hair.toLowerCase() === e2.hair.toLowerCase()) errs.push(FM('two_hair')); if (got.sil && e2.sil && noDot(got.sil) === noDot(e2.sil)) errs.push(FM('two_sil'));
      if (got.hcol && e2.hcol && noDot(got.hcol) === noDot(e2.hcol)) errs.push(FM('two_hcol')); if (got.body && e2.body && trim(got.body) === trim(e2.body)) errs.push(FM('two_body'));
      FACE_SLOTS.forEach(function (sl) { var a = got['face_' + sl[0]], b = e2['face_' + sl[0]]; if (a && b && noDot(a) === noDot(b)) errs.push(FM('two_face') + sl[1]); }); }
    return errs;
  }
  /* 채운 글에서 칸 값 */
  function worldFillPicks(D, S, key, world, filled, opts) {
    var T0 = worldFillTemplate(D, S, key, world, opts || {}).split('\n').map(trim), F = String(filled || '').split('\n').map(trim), out = {};
    T0.forEach(function (tl) {
      if (!hasSlot(tl)) return;
      var keys = [], re = slotRe(tl, keys);
      F.forEach(function (fl) { var m = re.exec(fl); if (m) keys.forEach(function (k, n) { out[k] = trim(m[n + 1]); }); });
    });
    return out;
  }
  /* 설계 주문 = 칸 채우기 안내 + 우리 설계 지시문(칸 표시). 아이디어 영감은 그 도시 motif · 세계 표지 */
  /* 머리 갈래 둘(2026-11-26 — WORLD_FREE.fill.family, 네 공방 같은 꼴) — 카드 · 세계로 돌려 가며, 우리 설계 머리가 든 갈래는 뺀다. 설계 1 · 2 는 다른 갈래 */
  function hairFamilyPair(ours, seed) {
    var F = T.WORLD_FREE.hairFamilies || [], n = F.length; if (n < 3) return null;
    var h = 0; for (var q = 0; q < String(seed).length; q++) h = (h * 31 + String(seed).charCodeAt(q)) % 100003;
    var skip = F.map(function (f) { return f.keys.indexOf(ours) >= 0; }), out = [];
    for (var k = 0; k < n && out.length < 2; k++) { var j = (h + k * 3) % n; if (!skip[j] && out.indexOf(j) < 0) out.push(j); }   /* 3 칸씩 건너 — 이웃 카드와 겹침을 줄인다(8 과 서로소) */
    return out.length === 2 ? [F[out[0]], F[out[1]]] : null;
  }
  function buildWorldFree(D, S, key, world, opts) {
    opts = opts || {};
    var FL = T.WORLD_FREE.fill, c = card(D, key); needWorld(world); if (!c || !worldOf(c, world)) return '';
    var o = fillOpts(c, world), tpl = worldFillTemplate(D, S, key, world, opts);
    var X = longParts(D, S, key, world, Object.assign({}, opts, { shot: {}, notes: {} })), mo = pal(X.motif), traits = [mo.text, X.marks].filter(Boolean).join(' ');
    var num = function (a) { return a.map(function (x, i) { return (i + 1) + ') ' + x; }).join('; '); };
    return [fill(FL.head, { name_en: c.en }), fill(FL.hair, { ours: [o.hair, o.bangs].filter(Boolean).join(', ') || 'see the prompt' }), (function (hf) { return hf && FL.family ? fill(FL.family, { f1: hf[0].en, f2: hf[1].en }) : ''; })(hairFamilyPair(((lookOf(c, world) || {}).silhouette || {}).hair, key + '|' + world)),
      o.hcol && tpl.indexOf(FILL_HCOL) >= 0 ? fill(FL.hcol, { ours: noDot(o.hcol), list: num(o.hcols) }) : '',
      o.body && tpl.indexOf(FILL_BODY) >= 0 ? fill(FL.body, { ours: o.body, list: num(o.bodies) }) : '',
      fill(FL.sil, { list: num(o.list) }),
      fill(FL.face, { lists: (function (fo) { return FACE_SLOTS.map(function (sl) { return sl[1] + ' — ' + num(fo[sl[0]].list); }).join(' | '); })(faceOpts(c, world)) }),
      fill(FL.idea, { traits: noDot(traits) }), FL.free, FL.two,
      opts.near && opts.near.length ? fill(FL.near, { near: num(opts.near) }) : '', FL.out, FL.sep, tpl].filter(Boolean).join('\n\n');
  }
  function build(D, S, key, world, opts) {
    opts = opts || {};
    needWorld(world);
    if (worldSectionsOn(S, opts.style)) return worldLines(D, S, key, world, opts) ? buildWorldSections(D, S, key, world, opts) : '';
    if (worldShortOn(S, opts.style)) return worldLines(D, S, key, world, opts) ? buildWorldShort(D, S, key, world, opts) : '';
    return longText(D, S, key, world, opts);
  }
  /* 칸 꼴 지시문 → sections. 칸 꼴이 아니면 head · body */
  function sectionsOf(text, S, styleKey) {
    var out = { style_undecided: !!(S && S.undecided) };
    if (!text) return out;
    var B = text.split('\n\n');
    if (worldSectionsOn(S, styleKey) && B.length === 6) {
      ['head', 's1', 's2', 's3', 's4', 's5'].forEach(function (k, i) { out[k] = B[i]; });
      out.negative = (B[5].split('\n').filter(function (l) { return /^Avoid: /.test(l); })[0] || '');
    } else { out.head = B[0]; out.body = B.slice(1).join('\n\n'); out.negative = ''; }
    return out;
  }
  /* 계획 Task 3 의 꼴 — { design, styles, city, world, style, kind, look, shot, notes } */
  function buildCity(o) {
    o = o || {};
    var D = o.design, S = o.styles, kind = o.kind || 'world';
    needWorld(o.world);
    var c = card(D, o.city); if (!c) throw new Error('unknown city: ' + o.city);
    if (!Object.keys(c.city.worlds || {}).length) return { text: '', sections: {}, missing: ['worlds'] };
    if (!worldOf(c, o.world)) return { text: '', sections: {}, missing: ['worlds.' + o.world] };
    if (kind === 'casual') {
      var cs = o.casual || {}, ct = buildCasual(D, S, o.city, cs.scene || {}, { world: o.world, style: o.style, tree: cs.tree, tree2: cs.tree2, life: cs.life, props: cs.props });
      return { text: ct, sections: casualSections(ct, S) };
    }
    if (kind !== 'world') throw new Error('unknown kind: ' + kind);
    var style = o.style || (S && S['default']), text = build(D, S, o.city, o.world, { style: style, look: o.look, shot: o.shot, notes: o.notes });
    return { text: text, sections: sectionsOf(text, S, style) };
  }

  /* 올릴 파일 이름 — IMAGE_RULES.md 3절(도시 꼴은 Task 5). 일상컷도 세계를 탄다(그 세계 그림이 참고 그림) */
  function fileName(key, world, styleKey, casualN) {
    return casualN ? fill(T.FILES.casual, { card: key, world: world, style: styleKey, n: casualN }) : fill(T.FILES.world, { card: key, world: world, style: styleKey });
  }
  /* 기록 내보내기 — 그림 저장소 records/<도시>/<세계>.<화풍>-ui.json */
  function record(D, S, key, world, opts) {
    opts = opts || {};
    var styleKey = opts.style || (S && S['default']), c = card(D, key);
    return { atelier: 'city', card: key, world: world, style: styleKey, styleVersion: styleVersion(S, styleKey), styleUndecided: !!(S && S.undecided),
      notes: opts.notes || {}, look: normLook(opts.look), design: c ? lookOf(c, world) : null, shot: normShot(D, key, world, opts.shot), file: fileName(key, world, styleKey), prompt: build(D, S, key, world, opts), date: new Date().toISOString().slice(0, 10) };
  }

  /* ══ 일상컷(트리 버전2) ══ 원소 꼴 그대로 — 도시 카드를 읽게만 했다(2026-11-19 Task 3). 장소 · 시대 · 소품 · 세계 금지 낱말은 Task 4(data/city-life.json · data/world-props.json).
     참고 그림은 그 도시의 세계 그림 하나(opts.world) — 일상컷은 세계를 타고 화풍은 그 그림을 따른다 */
  var SCENE_V2 = ['treeV', 'ostyle', 'era', 'place', 'ofam', 'item', 'posture', 'support', 'frame', 'body', 'head', 'camera', 'right', 'left', 'use', 'kind', 'legs', 'gaze', 'turn',
    'weather', 'time', 'moment', 'season', 'cityWeather', 'hair', 'own', 'placeText', 'ownProp', 'light', 'spot', 'depth', 'view', 'color', 'denier', 'situ', 'ofree', 'sfree', 'gfree', 'gsitu', 'gnot', 'recent', 'cosplay', 'lifeMust', 'expr', 'preset', 'prop', 'outfit', 'ofeat', 'scene', 'custom', 'axes', 'aspect', 'unlocked', 'unlockedAuto'];
  /* ══ 생활 장면표 → 트리 장소(2026-11-19 Task 4) ══ 장면마다 트리 장소 <도시>_<장면> 을 더한 버전2 표 사본. 받침(장소 특징) · 묶음 · 표의 places 목록은 base 장소 것을 빌리고,
     땅(place_lands)은 그 도시 — 다른 도시 카드에는 안 뽑힌다(카드 land = 도시 열쇠). 같은 표 · 같은 생활 장면표면 같은 사본(메모) */
  var LIFE_MEMO = typeof WeakMap === 'function' ? new WeakMap() : null;
  function lifeKey(city, scene) { return city + '_' + scene; }
  function lifeTree(tree2, tree, life) {
    if (!tree2 || !life || !life.cities) return tree2;
    var hit = LIFE_MEMO && LIFE_MEMO.get(tree2);
    if (hit && hit.life === life && hit.tree === tree) return hit.t;
    var t = JSON.parse(JSON.stringify(tree2)), alias = {}, base = function (k) { return ((tree && tree.places) || []).concat(t.extra_places || []).filter(function (p) { return p.key === k; })[0]; };
    t.extra_places = t.extra_places || []; t.place_lands = t.place_lands || {};
    Object.keys(life.cities).forEach(function (ck) {
      ((life.cities[ck] || {}).scenes || []).forEach(function (s) {
        var b = base(s.base), k = lifeKey(ck, s.key);
        if (!b) throw new Error('city-life ' + k + ': base ' + s.base + ' is not a tree place');
        t.extra_places.push({ key: k, group: b.group, ko: s.ko, en: s.en, eras: ['now'], life: { city: ck, scene: s.key } });
        t.places[k] = (t.places[s.base] || []).slice();
        t.place_lands[k] = [ck];
        (alias[s.base] = alias[s.base] || []).push(k);
      });
    });
    (function walk(o) {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (!o || typeof o !== 'object') return;
      Object.keys(o).forEach(function (k) {
        var v = o[k];
        if (k === 'places' && Array.isArray(v)) v.slice().forEach(function (x) { (alias[x] || []).forEach(function (a) { if (v.indexOf(a) < 0) v.push(a); }); });
        else walk(v);
      });
    })(Object.assign({}, t, { places: null, extra_places: null }));
    if (LIFE_MEMO) LIFE_MEMO.set(tree2, { life: life, tree: tree, t: t });
    return t;
  }
  /* 트리 장소 열쇠 → 생활 장면 줄(없으면 null) */
  function lifeScene(life, placeKey) {
    var cities = (life && life.cities) || {}, out = null;
    Object.keys(cities).forEach(function (ck) { ((cities[ck] || {}).scenes || []).forEach(function (s) { if (lifeKey(ck, s.key) === placeKey) out = Object.assign({ city: ck }, s); }); });
    return out;
  }
  /* 세계 소품 사전의 그 세계 낱말 */
  /* 일반 장소의 그 세계 글(트리 장소 worlds.<세계>.en — 2026-11-24 탈 것: 차 → 판타지 짐마차 · 스팀펑크 증기차 · 사이버펑크 호버카). 없으면 장소 글 그대로 */
  function placeEn(p, world) { var w = p && p.worlds && world && p.worlds[world]; return w && w.en ? w.en : (p ? p.en : ''); }
  function propWorld(props, key, world, own) { if (own && own[key]) return trim(own[key]); var p = ((props && props.props) || {})[key]; return p && p.worlds && p.worlds[world] ? trim(p.worlds[world].en) : ''; }
  function sceneV2(st) { var o = {}; SCENE_V2.forEach(function (k) { if (st && st[k] !== undefined) o[k] = st[k]; }); return o; }
  function quoted(v) { return trim(v).replace(/"/g, "'"); }
  /* 버전2 표정 — 표정 문장 속 시선 말을 뗀다(시선은 GAZE 줄 하나가 정한다) */
  var EXPR_GAZE = [[/,?\s*gaze slightly to the side/, ''], [/\bdirect (\w+) gaze\b/, '$1 eyes'], [/\bhard forward gaze\b/, 'hard eyes'],
    [/\bsoft distant gaze past the camera\b/, 'soft distant eyes'], [/\bsoft distant eyes looking just beside the camera at her own eye level\b/, 'soft distant eyes'], [/\bgaze softened and directed slightly upward or away\b/, 'softened eyes'],
    [/\bgaze direct and unwarm\b/, 'eyes unwarm'], [/ fixed on one point/, ''], [/ looking away/, ''], [/,?\s*eyes off camera/, ''], [/\bgaze angled down and away,\s*/, '']];
  function exprNoGaze(text) { return EXPR_GAZE.reduce(function (t, r) { return t.replace(r[0], r[1]); }, String(text || '')); }
  /* 트리가 보는 「카드」 — 땅 = 도시(생활 장면표의 장소는 그 도시 카드에만 — lifeTree 의 place_lands) · 세계.
     세계 그림의 손 물건(hold)은 일상컷에서 들지 않는다(2026-11-25 사용자 「카페에서 랜치라든가 … 삼국지나 포켓몬처럼 악세사리 형식으로」) — signature 를 비워
     트리가 「그 물건 들기」 소품 동작을 고르지 않게 하고, 그 물건은 SIGNATURE ACCESSORY 줄(holdAccessory)이 작은 장신구 · 곁의 물건으로만 싣는다.
     캐릭터만의 컷(90번)은 직업 도구(scene.ownProp)를 그 자리로 든다(공용 모듈 signatureHold). 생성기 · 계획기 · 묶음 모두 이 카드 */
  function casualCard(c, tree2, world) { return { key: c.key, signature: [], signature_hold: [], land: c.parent || c.key, world: world || '' }; }
  /* SIGNATURE ACCESSORY 줄 — 세계 그림의 손 물건을 본뜬 작은 장신구 또는 곁에 둔 물건. 물건 글은 hold 의 첫 마디(쉼표 · 줄표 앞),
     그 세계 금지 낱말(banned_en)이 들어 있으면 싣지 않는다 */
  function holdAccessory(D, c, world) {
    var h = noDot(String(holdOf(c, world) || '').split(/,\s|\s[—–-]\s/)[0]), ban = bannedOf(D, c.city, world);
    if (!h || ban.some(function (b) { return new RegExp('\\b' + escRe(b) + 's?\\b', 'i').test(h); })) return '';
    return fill(T.CASUAL.accessory, { hold: h });
  }
  function casualVars(c, world, opts) {
    var w = worldOf(c, world) || {}, life = (opts || {}).life, props = (opts || {}).props;
    return { city_en: c.cityEn, city_ko: c.cityKo, people: c.people, traits: '', palette: trim((w.palette || c.city.palette || {}).en), hold: holdOf(c, world),
      world: world || '', worldEn: noDot(w.en), life: life || null, props: props || null, ownProps: ownVocab(c.city, world).props || null,
      clothes: trim((((props || {}).clothes || {})[world] || {}).en),
      times: (life && life.times) || [], seasons: ((life && life.seasons) || {})[c.parent || c.key] || [], weathers: ((life && life.weather) || {})[c.parent || c.key] || [] };
  }
  /* 그 장면의 Place · Around her 줄 — 생활 장면이면 그 세계 글 · 그 세계 소품 */
  function lifeLines(m, placeKey) {
    var s = lifeScene(m.life, placeKey), w = s && (s.worlds || {})[m.world];
    if (!w) return null;
    var things = (w.props || []).map(function (k) { return propWorld(m.props, k, m.world, m.ownProps); }).filter(Boolean);
    return { place: noDot(w.en), around: things.length ? fill(T.CASUAL.life.around, { props: things.join('; ') }) : '' };
  }
  /* 맨 끝 금지 단락 — 화풍 글의 「No …」 + 그 세계 banned_en(설계표). 없으면 '' */
  function casualAvoid(D, S, styleKey, world, cityRow) {
    var L = T.CASUAL.life, st = splitNo(shortStyle(S, styleKey)).avoid, ban = bannedOf(D, cityRow, world, true);   /* 일상컷은 casual_banned_en 도(2026-11-27) */
    var parts = [st.length ? st.join(', ') : '', ban.length ? fill(L.avoidWorld, { list: ban.join(', ') }).replace(/\.$/, '') : ''].filter(Boolean);
    return parts.length ? fill(L.avoid, { list: parts.join('. ') }) : '';
  }
  /* 일상컷 sections — head(첫 단락) · body · negative(맨 끝 Avoid 단락) */
  function casualSections(text, S) {
    var out = { style_undecided: !!(S && S.undecided) };
    if (!text) return out;
    var B = text.split('\n\n'), last = B[B.length - 1];
    out.negative = /^Avoid: /.test(last) ? last : '';
    out.head = B[0]; out.body = B.slice(1, out.negative ? -1 : undefined).join('\n\n');
    return out;
  }
  /* 시대 줄 — 표의 시대 열쇠로 틀을 고른다. 「나라 안」(nation) 은 참고 그림의 세계 글 */
  function casualEraLine(c, eraRow, m, world) {
    var CL = T.CASUAL, tpl = CL.era[eraRow.key];
    if (!tpl) return fill(CL.eraOther, { en: trim(eraRow.en) || eraRow.key });
    return fill(tpl, Object.assign({}, m, { world: m.worldEn || 'its own recognisable places', site: '' })) + (m.worldGuard ? '\n' + m.worldGuard : '');
  }
  /* 자유 설계 칸 — 장면 줄 대신 T.FREE_DESIGN 덩어리 */
  function freeDesignLines(sc, t, m) {
    var F = T.FREE_DESIGN, C = root.AtelierCasualTreeV2, recent = (sc.recent || []).map(trim).filter(Boolean);
    var out = [F.head, fill(F.recent, { recent: recent.join('; ') || F.recentNone })].concat(F.lines);
    if (sc.gfree) {
      var fam = C.family(t, sc.gfree), si = byKey(T.CASUAL.situations, sc.gsitu);
      out.push(fill(F.family, { family: (F.familyNames || {})[sc.gfree] || trim(fam && fam.en) || sc.gfree }));
      var gn = sc.gnot && C.item(t, sc.gfree, sc.gnot); if (gn && F.familyNot) out.push(fill(F.familyNot, { item: noDot(gn.en) }));   /* 그 갈래 필수 컷의 옷은 피한다(2026-11-20 — 노출 갈래가 다 필수라 같은 갈래) */
      if (sc.gsitu === 'free' && F.situFree) out.push(F.situFree); else if (si) out.push(fill(F.situ, { situ: si.en }));
    }
    /* 시간대(원소 2026-11-18 사용자 B, 도시 2026-11-21) — 자유 설계 칸도 계획기가 고른 시간대를 준다(비면 늘 따뜻한 밤 실내로 그렸다). 시간대 글은 생활 장면표 */
    var tm = byKey((m || {}).times, sc.time) || byKey(T.CASUAL.times, sc.time); if (tm) out.push('Time of day (fixed): ' + noDot(tm.en) + ' — set your scene at this time.');
    out.push(sc.gfree ? F.outfit : F.outfitFree);
    return out;
  }
  /* 게임 코스프레 컷(원소 2026-11-15 에서 옮김, 2026-11-20) — 의상 계열에 cosplay: true(트리 game_cosplay). 장면 칸 cosplay = { game, character, cut, round }(계획기 tools/casual-plan.cjs pickCosplay).
     Outfit 줄은 목록(data/game-cosplay.json — opts.cosplay 로 받는다)의 글: 주인공 하나 게임은 fixed, 등장인물 많은 게임은 1회차 assigned · 2회차 again.
     재단은 트리 옷(gc_<재단>)의 cut, 없으면 cosplay.cut. 게임 · 캐릭터 · 목록이 없으면 트리 옷 글(원소의 옛 pick 칸은 도시엔 없다) */
  function isCosplay(t, sc) { var C = root.AtelierCasualTreeV2, f = C && sc && C.family(t, sc.ofam); return !!(f && f.cosplay); }
  function cosplayText(data, cos, itemRow) {
    cos = cos || {};
    var g = data && byKey(data.games, cos.game), cut = data && byKey(data.cuts, (itemRow && itemRow.cut) || cos.cut), X = (data && data.text) || {};
    if (!g || !cut) return itemRow ? trim(itemRow.en) : '';
    if (!g.many) return fill(X.fixed, { character: g.character, game: g.en, outfit: g.outfit, cut: cut.en });
    if (trim(cos.character)) return fill(cos.round === 2 || !X.assigned ? X.again : X.assigned, { character: trim(cos.character), game: g.en, cut: cut.en });
    return itemRow ? trim(itemRow.en) : '';
  }
  /* 버전2 장면 → SCENE 줄들. 손·소품·받침의 관계는 PROP 한 줄에서만, 오른손·왼손은 인물 본인 기준 */
  /* 놀이터(장소 특징 k_kids, 2026-11-25 사용자 — 아이들이 배경에 나올 수 있다): 노출은 적게 · 상황 노출 · 드러내기 없음, 장면 줄 Place 뒤에 배경 아이들 · 덮인 옷 두 줄(표 kids_place) */
  function kidsAt(t, sc) { var C = root.AtelierCasualTreeV2; return !!(sc && C && sc.place && C.placeHas(t, sc.place).indexOf('k_kids') >= 0); }
  function kidsScene(t, sc) { return kidsAt(t, sc) ? Object.assign({}, sc, { axes: Object.assign({}, sc.axes || {}, { skin_exposure: 'low' }), situ: '', ofreeSitu: '', expose: '' }) : sc; }
  function kidsLines(t, sc) { var K = (t.v2 && t.v2.kids_place) || {}; return kidsAt(t, sc) ? [K.people, K.cover].filter(Boolean) : []; }
  function casualDetailsV2(sc, t, m, ex) {
    if (sc.sfree && T.FREE_DESIGN) return freeDesignLines(sc, t, m);
    var C = root.AtelierCasualTreeV2, CL = T.CASUAL, out = [], f = C.frame(t, sc.frame);
    var p = C.place(t, sc.place), fam = C.family(t, sc.ofam), it = C.item(t, sc.ofam, sc.item);
    var po = C.posture(t, sc.posture), su = C.support(t, sc.support), u = C.use(t, sc.use), pr = u && C.prop(t, u.prop);
    var by = function (list, k) { return (list || []).filter(function (r) { return r.key === k; })[0]; };
    var body = by(t.v2.body, sc.body), head = by(t.v2.head, sc.head), cam = by(t.v2.camera, sc.camera);
    var bl = C.backLook(t, sc);
    var gaze = by(t.v2.gaze, sc.gaze || (u && u.gaze) || '');
    var ll = p && m && m.life ? lifeLines(m, p.key) : null;
    if (trim(sc.placeText)) out.push('Place: ' + trim(sc.placeText)); else if (ll) out.push('Place: ' + ll.place + '.'); else if (p) out.push('Place: ' + (p.world_place ? CL.worldPlace : placeEn(p, m && m.world)));
    kidsLines(t, sc).forEach(function (l) { out.push(l); });
    if (ll && ll.around) out.push(ll.around);
    var wt = (t.v2.weather || []).filter(function (r) { return r.key === sc.weather; })[0];
    if (wt) out.push('Weather / season: ' + wt.en + '.');
    var lsn = p && m && m.life ? lifeScene(m.life, p.key) : null, hs = p ? (C.placeHas(t, p.key) || []) : [];
    var indoor = lsn ? !!lsn.indoor : (hs.indexOf('indoor') >= 0 || hs.indexOf('timed') >= 0);   /* 실내 — 생활 장면표 indoor, 일반 장소는 장소 특징(계획기 placeRules 와 같다) */
    var sn = byKey((m || {}).seasons, sc.season); if (sn) out.push(indoor && CL.life.seasonIn ? fill(CL.life.seasonIn, { en: noDot(sn.en.split(' — ')[0]) }) : fill(CL.life.season, { en: noDot(sn.en) }));   /* 실내는 계절 이름만 — 벚꽃 · 낙엽 같은 바깥 풍경 글을 싣지 않는다 */
    var cw = byKey((m || {}).weathers, sc.cityWeather); if (cw) out.push(fill(CL.life.weather, { en: noDot(cw.en) }));
    var X = C.extras(t, sc);   /* 빛의 방향 · 빛 모습 · 순간 · 화면 안 자리 · 옆모습의 가까운 팔 · 실내 여부(lib/casual-tree-v2.js extras) */
    var tm = byKey((m || {}).times, sc.time) || byKey(CL.times, sc.time); if (tm) out.push('Time of day: ' + noDot(tm.en) + (X.look ? '; ' + X.look : '') + '.');   /* 빛 모습(원소 2026-11-18 G — 표 ambience.looks, 도시 시간대 열쇠를 더했다) */
    var hr = byKey(CL.hairs, sc.hair); if (hr) out.push('Hair: ' + hr.en + '.');
    if (X.light) out.push('Light direction: ' + X.light + '.');
    if (X.moment) out.push('Small moment: ' + X.moment + '.');   /* 순간(원소 2026-11-18 D — 표 moments) */
    var specs = (sc.ofeat || []).indexOf('glasses') >= 0 ? CL.glasses : '';
    /* 게임 코스프레 컷은 목록 글 — 옷 색 · 데니어 · 상황 · 세계 평상복 결은 얹지 않는다 */
    var cos = fam && fam.cosplay, oen = (cos && !trim(sc.outfit) ? cosplayText((m || {}).cosplay, sc.cosplay, it) : '') || trim(sc.outfit) || (it && it.en) || (fam && fam.en) || '', col = cos || colorFixed(oen) ? null : byKey(CL.colors, sc.color);
    var dn = !cos && denierFits(oen) ? byKey(CL.deniers, sc.denier) : null, si = !cos && situFits(sc.situ, oen) ? byKey(CL.situations, sc.situ) : null;
    if (sc.ofree && T.OUTFIT_FREE) out.push(T.OUTFIT_FREE + specs + '.');
    else if (oen) out.push('Outfit: ' + oen + (col ? fill(CL.colorLine, { color: col.en }) : '') + (dn ? fill(CL.denierLine, dn).replace(', denim and ', ' and ') : '') + (C.styleText && C.styleText(t, sc) ? '; ' + C.styleText(t, sc) : '') + (si ? fill(CL.situLine, { en: (X.indoor && si.enIn) || si.en }) : '') + specs);   /* 옷 꾸밈(scene.ostyle, 2026-11-23 — 공용 모듈 styleText) */
    if (m && m.clothes && !cos) out.push(m.clothes);   /* 옷의 결 — 그 세계의 평상복(세계 소품 사전 clothes) */
    if (po) out.push('POSTURE: ' + po.en + '.');
    if (su && su.en) out.push('SUPPORT: ' + su.en + '.');
    /* 바로 위 카메라(camera no_body)엔 몸 방향 글을 뺀다 — 엎드린 몸에 「body facing the camera」 가 붙어 몸이 뒤집혔다(2026-11-26) */
    var bodyText = body && !(cam && cam.no_body && !body.far) && body.en + (body.profile_face && head && head.key === 'with_body' ? (gaze && gaze.key === 'camera' ? ', her face in profile too — only her eyes turn toward the camera' : ', her face in profile too, not turned toward the camera') : '')
      + (body.turned_face && head && head.key === 'with_body' ? ', ' + body.turned_face : '')
      + (X.side ? ', ' + X.side.body : '');
    var TT = C.turnText ? C.turnText(t, sc) : null;   /* 고개 · 몸 좌우(scene.turn, 2026-11-20 — 공용 모듈 turnText) */
    out.push('COMPOSITION: ' + [(f && f.en) || sc.frame, (TT && TT.body) || bodyText, TT ? TT.head : head && head.key !== 'with_body' && (bl ? bl.head : head.en), cam && cam.en].concat(X.comp, TT ? [TT.lock] : []).filter(Boolean).join('; ') + '.');
    var lens = C.lens(t, sc.frame);
    if (lens) out.push('Lens / perspective: ' + ((T.LENS_GUIDES[lens] || [])[1] || lens));
    var r = C.hand(t, sc.right), both = r && r.both && sc.right === sc.left;
    if (both) out.push('BOTH HANDS: ' + r.en + '.');
    else ['right', 'left'].forEach(function (side) {
      var k = sc[side], h = C.hand(t, k), text;
      if (k === 'prop') text = fill(CL.handBusy, { side: side });
      else if (h) text = h.en.replace('{side}', side) + (h.elbow ? ', her elbow ' + h.elbow : '');
      if (text) out.push(side.toUpperCase() + ' HAND: ' + text + X.where(side) + '.');
    });
    if (bl && bl.arm && !both) out.push(bl.arm);
    if (u && pr) {
      var thing = pr.signature ? (trim(sc.ownProp) || fill(CL.signatureProp, m)) : (propWorld(m && m.props, pr.key, m && m.world, m && m.ownProps) || pr.en), action = u.en.replace('{prop}', thing);
      var side = sc.right === 'prop' ? 'right' : 'left';
      out.push('PROP: ' + (u.hands === 'both' ? fill(CL.propBoth, { action: action, right: (u.grip || {}).right, left: (u.grip || {}).left }) : fill(CL.propOne, { side: side, action: action })) + '.');
    }
    var lg = C.leg(t, sc.legs);
    if (lg && f && f.legs) out.push('LEGS: ' + lg.en + '.');
    if (gaze) out.push('GAZE: ' + gaze.en + '.');
    var faceHidden = body && body.face_hidden && !(head && head.look_back);
    if (trim(sc.expr) && !faceHidden) out.push('EXPRESSION: ' + ((ex || {})[sc.expr] || (t.v2.expressions || {})[sc.expr] || exprNoGaze(T.EXPRESSION_DETAIL[sc.expr] || sc.expr)) + '.');
    if (trim(sc.scene)) out.push('Scene note: ' + quoted(sc.scene));
    if (trim(sc.custom)) out.push('Note: ' + quoted(sc.custom));
    T.LOCAL_AXES.forEach(function (k) {
      var v = sc.axes && sc.axes[k];
      if (!v || v === 'AUTO' || (T.ADVANCED_OPTIONS[k] || []).indexOf(v) < 0) return;
      var closeGuide = f && f.close && T.CLOSE_AXIS_GUIDES[k] && T.CLOSE_AXIS_GUIDES[k][v];
      out.push(k + ': ' + v + ' — ' + (closeGuide || T.SCENE_AXIS_GUIDES[k][v][1]));
    });
    return out;
  }
  /* 고정값 — 두 축과 화면비는 비었거나 AUTO 면 고정값 */
  function casualFixed(scene) {
    var F = T.CASUAL_FIXED, axes = Object.assign({}, scene.axes || {});
    Object.keys(F.axes).forEach(function (k) { if (!axes[k] || axes[k] === 'AUTO') axes[k] = F.axes[k]; });
    /* 자유 설계 칸은 늘 2:3(2026-11-23 — 화면비는 계획의 자세 · 프레이밍이 정하는데 자유 칸은 그것을 맡은 쪽이 짓는다) */
    return { axes: axes, aspect: !scene.sfree && T.ASPECT_FRAME[trim(scene.aspect)] ? trim(scene.aspect) : F.aspect };
  }
  /* 참고 그림의 세계 — 그 도시가 설계한 세계여야 한다. 아니면 '' */
  function casualWorld(D, key, world) { return worldsOf(D, key).indexOf(world) >= 0 ? world : ''; }
  /* 일상컷 — 얼굴 · 화풍은 첨부 그림에 맡긴다(원소 2026-11-03) */
  var REF_STYLE = "STYLE: keep the attached image's rendering exactly — the same finish, skin rendering, line weight, colour palette, saturation and lighting quality. Do not restyle her: no more realistic, no more painterly, no more 2D than the attached image. Only the outfit, pose, expression, framing and place change.";
  var REF_FACE = "FACE: exactly the face of the attached image — the same face shape, jawline, eye shape and size, nose, lips and their proportions, and the same skin rendering. Do not add skin texture, pores, harder nose or lip modelling, or any facial definition the attached image does not have. Keep the same face proportions — the same short midface (eyes to mouth), jaw length and face length-to-width ratio; no camera angle or pose (low or high camera, chin on a hand, profile, looking back), bangs or headpiece may lengthen her face or lower face or make her jaw look heavier than in the attached image.";
  var REF_EXPR = ' Show it mildly, only with her brows, eyelids and mouth corners; her face shape and features stay exactly as in the attached image.';
  function refLock(text) {
    var out = [], faced = false;
    String(text).split('\n\n').forEach(function (p) {
      if (/^STYLE: /.test(p)) { out.push(REF_STYLE); return; }
      if (/^FINAL CHECK: /.test(p)) return;
      if (/^AGE: the same adult woman as in the attached image/.test(p)) { out.push(REF_FACE); faced = true; return; }
      out.push(p.replace(/^EXPRESSION: .*$/m, function (l) { return l.replace(/\s+$/, '') + REF_EXPR; }));
    });
    if (!faced) { var i = out.findIndex(function (p) { return /^CHARACTER: /.test(p); }); out.splice(i >= 0 ? i + 1 : 1, 0, REF_FACE); }
    return out.join('\n\n');
  }
  function colorFixed(en) { return !!(T.CASUAL.colorFixed && new RegExp(T.CASUAL.colorFixed, 'i').test(en || '')); }
  function denierFits(en) { var C = T.CASUAL; return !!(C.denierFit && new RegExp(C.denierFit, 'i').test(en || '') && !(C.denierSkip && new RegExp(C.denierSkip, 'i').test(en || ''))); }
  function situsFor(en) { return (T.CASUAL.situations || []).filter(function (s) { return new RegExp(s.fit || '.', 'i').test(en || '') && !(s.skip && new RegExp(s.skip, 'i').test(en || '')); }).map(function (s) { return s.key; }); }
  function situFits(key, en) { return situsFor(en).indexOf(key) >= 0; }
  function casualShortOn(S, styleKey) { var row = styleVer(S, styleKey) || {}; return row.casualShort === false || row.format === 'structured' ? false : !!(row.casualShort || T.CASUAL.shortAll); }
  /* 짧은 판의 화풍 단락 — 일상 글 > 세계 글, kv 판은 1절에서 머리 · 장르 고정을 뗀 앞 문장들(120낱말까지) */
  function shortStyle(S, styleKey) {
    var row = styleVer(S, styleKey) || {};
    var t = trim((row.casualKit || {}).style) || styleText(S, styleKey, 'casual') || styleText(S, styleKey, 'text') || String(row.section1 || '');
    t = String(t).replace(/^1\. RENDERING STYLE[^\n]*\n/, '').replace(/^STYLE:\s*/, '').split('GENRE LOCK')[0].replace(/\s+/g, ' ').trim();
    t = t.replace(/\s*[—-]\s*the same rendering quality as the attached image\.?/i, '.');
    var w = t.split(' ');
    if (w.length > 120) { var cut = w.slice(0, 120).join(' '); t = cut.lastIndexOf('.') > 0 ? cut.slice(0, cut.lastIndexOf('.') + 1) : cut; }
    return t;
  }
  /* 동물 줄(2026-11-23) — 돌봄 장소(묶음 companion)는 한 사람 + 동물 한 마리, 동물원 · 수족관 · 동물 카페 · 연못(animals)은 배경에만, 나머지는 동물 없음 */
  function creatureKind(t, sc) {
    var C = root.AtelierCasualTreeV2, k = sc && !sc.sfree && sc.place;
    if (!k || !C) return 'none';
    return C.companionAt(t, k) ? 'companion' : C.animalsAt && C.animalsAt(t, k) ? 'background' : 'none';
  }
  function creatureEnd(t, sc) {
    var CL = T.CASUAL, SH = CL.short, k = creatureKind(t, sc);
    return k === 'companion' ? SH.endCompanion : SH.end + ' ' + CL.creatures[k];
  }
  function creatureFigure(t, sc, m) {
    var CL = T.CASUAL, k = creatureKind(t, sc);
    return k === 'companion' ? fill(CL.figureCompanion, m) : fill(CL.figure, m) + ' ' + CL.creatures[k];
  }
  function buildCasualShort(S, opts, c, wr, t, sc, m, close, aspect) {
    var C = root.AtelierCasualTreeV2, CL = T.CASUAL, SH = CL.short, row = styleVer(S, opts.style) || {};
    var ex = SH.expose[((sc.axes || {}).skin_exposure) || 'bold'] || SH.expose.bold;
    var det = casualDetailsV2(sc, t, m, row.expr).filter(function (l) { return !/^(?:overall_intensity|skin_exposure|action_level|source_influence|separates_preference):/.test(l); }).map(function (l) {
      if (/^Outfit: /.test(l)) return l.replace(/\.?\s*$/, '') + ', ' + ex + ', ' + SH.body + '.';
      if (/^EXPRESSION: /.test(l)) { var i = l.indexOf('. '); return i > 0 ? l.slice(0, i + 1) : l; }
      return l;
    });
    /* 화풍 글의 「No …」 는 맨 끝 Avoid 단락으로(세계 그림 칸 꼴과 같이 — 금지 낱말이 본문에 안 나온다) */
    var lines = [fill(SH.input, Object.assign({}, m, { who: fill(SH.who.city, m) })), (SH.outputs || {})[aspect] || SH.output || '', SH.face, 'Style: ' + splitNo(shortStyle(S, opts.style)).text +
      /* 판에 casualStyleAfter(피부 마감)가 있으면 Style 줄은 화풍 글만, 다음 줄이 그것 — 2026-11-20 서울 일상컷 시험 꼴(SH.keep 없이) */
      (trim(row.casualStyleAfter) ? '\n' + trim(row.casualStyleAfter) : ' ' + SH.keep), SH.beauty || ''];
    /* 그 세계의 그 도시의 하루 — 원소의 「지금 현실」 대신 늘 실린다(시대 = 세계) */
    if (m.worldEn) lines.push(fill(CL.life.world, { city_en: m.city_en, world: m.worldEn }) + (m.worldGuard ? '\n' + m.worldGuard : ''));
    lines.push(det.join('\n'));
    if (close) lines.push('Framing: ' + T.CROP_EDGE[trim(sc.frame)] + '.');
    var cos = isCosplay(t, sc);   /* 게임 코스프레 컷 — 머리 장식 줄 대신 코스튬 줄 */
    if (cos && (CL.cosplay || {}).short) lines.push(CL.cosplay.short); else if (SH.headwear) lines.push(SH.headwear);
    if (!cos && m.accessory) lines.push(m.accessory);   /* 세계 그림의 손 물건은 장신구 · 곁의 물건으로만(2026-11-25) — 코스프레 컷엔 싣지 않는다 */
    if (m.traits && !cos) lines.push(fill(SH.legend, m));
    lines.push(trim(row.casualLight) || SH.light, creatureEnd(t, sc), m.avoid || '');
    return lines.filter(Boolean).join('\n\n');
  }
  function buildCasual(D, S, key, scene, opts) {
    opts = opts || {}; scene = scene || {};
    var C = root.AtelierCasualTreeV2, C1 = root.AtelierCasualTree, CL = T.CASUAL;
    if (!C || !C1 || !opts.tree || !opts.tree2) throw new Error('Casual tree v2 needs lib/casual-tree.js, lib/casual-tree-v2.js, data/casual-tree.json and data/casual-tree-v2.json');
    var c = card(D, key); if (!c) return '';
    var wr = worldRow(casualWorld(D, key, opts.world)); if (!wr) return '';
    var t = C.make(lifeTree(opts.tree2, opts.tree, opts.life), opts.tree), g = casualCard(c, opts.tree2, wr.key), fx = casualFixed(scene);
    /* 세계 줄 = 그 세계의 결(설계표 vocab.casual_world — 명소 목록인 도시 세계 글을 실으면 일곱 장 뒷배경이 다 같아졌다, 2026-11-19). 없으면 도시 세계 글 */
    var cw = ownVocab(c.city, wr.key).casual_world || (((D && D.vocab) || {}).casual_world || {})[wr.key] || {};
    var m = Object.assign(casualVars(c, wr.key, opts), { world_en: wr.en.charAt(0) + wr.en.slice(1).toLowerCase(), avoid: casualAvoid(D, S, opts.style, wr.key, c.city), worldGuard: trim(cw.guard_en), cosplay: opts.cosplay || null, accessory: holdAccessory(D, c, wr.key) },
      trim(cw.en) ? { worldEn: noDot(fill(cw.en, { city_en: c.cityEn })) } : {});
    var sc = scene.sfree ? Object.assign(sceneV2(scene), { treeV: 2, axes: fx.axes }) : kidsScene(t, C.repair(t, Object.assign(sceneV2(scene), { axes: fx.axes }), g)), f = C.frame(t, sc.frame);
    var body = (t.v2.body || []).filter(function (r) { return r.key === sc.body; })[0] || {};
    var head = (t.v2.head || []).filter(function (r) { return r.key === sc.head; })[0] || {};
    var close = !sc.sfree && T.CLOSE_FRAMES.indexOf(trim(sc.frame)) >= 0, lines = [];
    if (casualShortOn(S, opts.style)) return buildCasualShort(S, opts, c, wr, t, sc, m, close, fx.aspect);   /* 화면비 — Output 줄(2026-11-23) */
    var cos = isCosplay(t, sc) && CL.cosplay;   /* 게임 코스프레 컷 — CHARACTER 끝 「도시는 장신구로만」 · OUTPUT · WARDROBE 를 코스튬 줄로 */
    lines.push(fill(CL.input, m));
    lines.push(cos ? fill(CL.character.city, m).replace(/ Her city shows ONLY [\s\S]*$/, ' ' + cos.city) : fill(CL.character.city, m));
    if (m.traits && !cos) lines.push(fill(CL.design, m));
    if (!cos && m.accessory) lines.push(m.accessory);
    var st = styleText(S, opts.style, 'casual') || styleText(S, opts.style, 'text'); if (st) lines.push('STYLE: ' + st);
    lines.push(CL.age);
    lines.push(cos ? cos.output : CL.output);
    lines.push(fill(CL.frame, { frame: T.ASPECT_FRAME[fx.aspect] }));
    if (close) lines.push(fill(CL.crop, { edge: T.CROP_EDGE[trim(sc.frame)] }));
    var era = C.era(t, sc.era); if (era) lines.push(casualEraLine(c, era, m, wr.key));
    if (C1.screens(t.v1, sc.place)) lines.push(fill(CL.screens, m));
    lines.push('SCENE (chosen):\n' + casualDetailsV2(sc, t, m, styleVer(S, opts.style).expr).join('\n'));
    var csk = styleVer(S, opts.style).casualSkin; if (csk) lines.push(csk);
    lines.push(cos ? cos.wardrobe : close ? CL.wardrobeClose : CL.wardrobe);
    lines.push(CL.angle);
    if (body.far && head.look_back) lines.push(CL.lookBack);
    lines.push(creatureFigure(t, sc, m), close ? CL.anatomyClose : CL.anatomy, CL.body, CL.hands);
    return refLock(lines.join('\n\n')) + (m.avoid ? '\n\n' + m.avoid : '');
  }
  function casualFile(key, world, styleKey, n) { return fileName(key, world, styleKey, n || 1); }
  function casualRecord(D, S, key, scene, opts, n) {
    opts = opts || {}; n = n || 1;
    var styleKey = opts.style || (S && S['default']), c = card(D, key), C = root.AtelierCasualTreeV2, world = casualWorld(D, key, opts.world);
    var fx = casualFixed(scene || {}), sc = sceneV2(scene);
    sc.axes = fx.axes; sc.aspect = fx.aspect;
    if (C && opts.tree && opts.tree2 && !sc.sfree) sc = Object.assign(C.repair(C.make(lifeTree(opts.tree2, opts.tree, opts.life), opts.tree), sc, c ? casualCard(c, opts.tree2, world) : null), { aspect: fx.aspect });
    else if (sc.sfree) sc.treeV = 2;
    return { atelier: 'city', card: key, slot: 'casual' + n, treeV: 2, world: world, style: styleKey, styleVersion: styleVersion(S, styleKey),
      ref: world ? fileName(key, world, styleKey) : '', scene: sc, file: world ? casualFile(key, world, styleKey, n) : '', prompt: buildCasual(D, S, key, scene, opts), date: new Date().toISOString().slice(0, 10) };
  }

  /* ══ 전경(2026-11-24) ══ 도시 × 세계 × 화풍마다 풍경 한 장 — 사람 없음 · 글자 없음 · 3:2(도시 무대의 배경). 글은 T.VISTA(lib/prompt-spec.js), 장소는 설계표 worlds.<세계>.en,
     화풍 줄은 화풍 판의 vista 칸(없으면 화풍 글 첫 문장으로 T.VISTA.styleFallback), Avoid 는 그 세계 금지 낱말(그 도시 unban_en 뺌)에서 옷 낱말을 뺀 것.
     명소 자리는 그림에 박지 않는다 — 설계표 landmarks[].lat · lon 이 자료(화면의 작은 지도). 도시 열쇠만 — 랜드마크 카드에는 전경이 없다 */
  var CLOTH_RE = null;
  function clothRe() { return CLOTH_RE || (CLOTH_RE = new RegExp('\\b(?:' + T.VISTA.cloth.map(escRe).join('|') + ')s?\\b', 'i')); }
  function vistaAvoid(D, c, world) { return bannedOf(D, c, world).filter(function (b) { return !clothRe().test(b); }); }
  function vistaStyle(S, styleKey) { var v = styleVer(S, styleKey), t = trim(v.vista), head = noDot(first(trim(v.text))); return t || (head ? fill(T.VISTA.styleFallback, { head: head }) : ''); }
  function vistaFile(key, world, styleKey) { return fill(T.FILES.vista, { card: key, world: world, style: styleKey }); }
  function buildVista(D, S, key, world, opts) {
    opts = opts || {}; needWorld(world);
    var c = city(D, key); if (!c) throw new Error('unknown city: ' + key + ' (vista — city keys only, no landmark cards)');
    var b = (c.worlds || {})[world]; if (!b || !trim(b.en)) return '';
    var V = T.VISTA, st = vistaStyle(S, opts.style || (S && S['default'])), ban = vistaAvoid(D, c, world);
    return [fill(V.head, { city_en: c.en, genre: V.genre[world] }), fill(V.place, { place: noDot(b.en) }), V.composition, st ? fill(V.style, { style: st }) : '', V.none,
      ban.length ? fill(V.avoid, { list: ban.join(', ') }) : '', V.output].filter(Boolean).join('\n\n');
  }
  /* 전경 기록 — 그림 저장소 records/<도시>/<세계>-vista.<화풍>-api.json 의 바탕(그린 뒤 generation 을 더한다) */
  function vistaRecord(D, S, key, world, opts) {
    opts = opts || {};
    var styleKey = opts.style || (S && S['default']);
    return { atelier: 'city', card: key, kind: 'vista', world: world, style: styleKey, styleVersion: styleVersion(S, styleKey), file: vistaFile(key, world, styleKey),
      size: T.VISTA.size.slice(), prompt: buildVista(D, S, key, world, opts), date: new Date().toISOString().slice(0, 10) };
  }

  root.AtelierPrompt = { card: card, cards: cards, landmarksOf: landmarksOf, parentOf: parentOf, city: city, worldsOf: worldsOf,
    build: build, worldLines: worldLines, fileName: fileName, record: record, styleText: styleText, styleVersion: styleVersion,
    lookOf: lookOf, normLook: normLook, scenesOf: scenesOf, normShot: normShot, holdOf: holdOf, faceItems: faceItems, silhouetteItems: silhouetteItems, identityParams: identityParams, paramValues: paramValues, exposureLine: exposureLine,
    buildCasual: buildCasual, casualCard: casualCard, holdAccessory: holdAccessory, casualWorld: casualWorld, casualFile: casualFile, casualRecord: casualRecord, casualDetailsV2: casualDetailsV2, freeDesignLines: freeDesignLines, exprNoGaze: exprNoGaze, sceneV2: sceneV2, casualFixed: casualFixed,
    silOf: silOf, buildWorldFree: buildWorldFree, worldFillTemplate: worldFillTemplate, worldFillErrors: worldFillErrors, worldFillPicks: worldFillPicks, silPool: silPool, worldShortOn: worldShortOn, worldSectionsOn: worldSectionsOn, splitNo: splitNo, casualShortOn: casualShortOn, shortStyle: shortStyle, colorFixed: colorFixed, denierFits: denierFits, situsFor: situsFor, situFits: situFits, cosplayText: cosplayText, isCosplay: isCosplay,
    sectionsOf: sectionsOf, casualSections: casualSections, lifeTree: lifeTree, lifeScene: lifeScene, lifeKey: lifeKey, propWorld: propWorld, placeEn: placeEn,
    buildVista: buildVista, vistaFile: vistaFile, vistaRecord: vistaRecord, vistaAvoid: vistaAvoid, vistaStyle: vistaStyle };
  /* PromptCity.vista({ design, styles, city, world, style }) → { text, file } — 설계 전 도시 · 세계는 { text: '', missing: [...] } */
  function vistaCity(o) {
    o = o || {}; needWorld(o.world);
    var c = city(o.design, o.city); if (!c) throw new Error('unknown city: ' + o.city);
    if (!((c.worlds || {})[o.world])) return { text: '', file: '', missing: [Object.keys(c.worlds || {}).length ? 'worlds.' + o.world : 'worlds'] };
    var style = o.style || (o.styles && o.styles['default']);
    return { text: buildVista(o.design, o.styles, o.city, o.world, { style: style }), file: vistaFile(o.city, o.world, style) };
  }
  root.PromptCity = { build: buildCity, vista: vistaCity };
})(typeof window !== 'undefined' ? window : globalThis);
