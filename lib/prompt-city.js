/* 지시문 조립 — 표(lib/prompt-spec.js)와 설계표(data/city-design.json)·화풍 판(data/style.json)으로 영어 지시문을 짓는다.
   ES 모듈도 빌드도 쓰지 않는다. window.AtelierPrompt(생성기 · 도구 · 검사가 쓰는 함수 묶음)와 window.PromptCity(계획 Task 3 의 꼴) 둘을 붙인다.

   원소 공방(lib/prompt-element.js)에서 옮겼다(2026-11-19, 계획 Task 3). 원소의 나라 › 가문 › 주민 세 층은 걷어 내고 도시 한 층 — 카드 열쇠 = 도시 열쇠(seoul …).
   원소 조립기의 「원소 성질 = 시각 언어 한 줄」 자리에 「도시 motif + 세계 표지」 — 세계는 장르 이름이 아니라 설계표 vocab.markers.<세계>.en 을 사람에게(옷 · 몸 · 소품 · 빛) 싣는다.
   배경은 그 세계의 그 도시(worlds.<세계>.en)가 거든다. 구도 기본은 원소 그대로(사람이 주인공, 전신 2:3).

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
  function card(D, key) { var c = city(D, key); return c ? { key: c.key, tier: 'city', city: c, ko: c.ko, en: c.en, people: trim((c.people || {}).en) } : null; }
  function cards(D) { return ((D && D.cities) || []).map(function (c) { return c.key; }); }
  function worldKeys(D) { return ((D && D.vocab) || {}).worlds || T.WORLDS.map(function (w) { return w.key; }); }
  /* 설계한 세계만 — 설계 미정 도시는 [] */
  function worldsOf(D, key) { var c = city(D, key); if (!c) return []; return worldKeys(D).filter(function (w) { return !!(c.worlds || {})[w]; }); }
  function worldRow(world) { return T.WORLDS.filter(function (w) { return w.key === world; })[0] || null; }
  /* 세 세계가 아니면 던진다 — 원소의 mecha 가 기억값 · 옛 기록으로 들어오지 않게 */
  function needWorld(world) { if (!worldRow(world)) throw new Error('unknown world: ' + world + ' (fantasy · steampunk · cyberpunk)'); return worldRow(world); }
  function worldOf(c, world) { return ((c && c.city.worlds) || {})[world] || null; }
  function markers(D, world) { return ((((D && D.vocab) || {}).markers || {})[world]) || { en: [], banned_en: [] }; }
  function wearOf(D, world) { return ((((D && D.vocab) || {}).wear || {})[world]) || {}; }

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
  /* 실루엣 — 고른 값(shot.frame)만. 도시는 카드마다 실루엣 설계값이 없다(세계 옷 말투 · motif 가 옷을 정한다), 'free' 면 없음 */
  function silOf(c, world, shot) {
    var f = trim((shot || {}).frame);
    if (f === 'free' || !c) return null;
    return byKey((T.SILHOUETTES || {})[world], f);
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
    var look = normLook(opts.look), shot = normShot(D, key, world, opts.shot), m = { city_en: c.en, city_ko: c.ko };
    var lines = [], add = function (t, x) { if (trim(x)) lines.push([t, x]); };
    add('concept', fill(T.CONCEPT, m));
    /* 도시 motif + 상징 색 — 원소의 「ELEMENT TRAITS」 자리 */
    var pal = trim((c.city.palette || {}).en);
    add('motif', fill(T.MOTIF_HEAD, m) + noDot((w.motif || {}).en) + '.' + (pal ? ' ' + T.PALETTE_HEAD + pal + T.ACCENT_TAIL + '.' : ''));
    var mk = markers(D, world).en || [];
    if (mk.length) add('marks', T.MARKS_HEAD + mk.map(noDot).join('; ') + '.');
    /* 외형 — 나이 · 실루엣 · 얼굴 */
    var dzf = look.faceDesignOn === false ? {} : lookOf(c, world).face;
    add('look', ageLine(look, dzf));
    var sil = silhouetteItems(c, look, world); if (sil.length && T.LOOK_LINES) add('look', fill(T.LOOK_LINES.silhouette, { items: sil.join('; ') }));
    var fw = styleFace(S, opts.style), face = faceItems(c, look, world, fw);
    if (face.length && styleVer(S, opts.style).face_tail && designedFace(dzf)) face.push(styleVer(S, opts.style).face_tail);
    if (face.length && T.LOOK_LINES) add('look', fill(designedFace(dzf) ? T.FACE_DESIGN.head : T.LOOK_LINES.face, { items: face.join('; ') }));
    /* WORLD — 그 세계의 그 도시(배경은 거든다) + 세계 옷 말투(설계표 wear.costume) + 빛 · 머리 */
    add('world', trim(W.head + noDot(w.en) + '. ' + trim(wearOf(D, world).costume) + ' ' + W.tail));
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
    var avoid = st.avoid.concat(co.avoid, rules.avoid, row.avoid || [], markers(D, world).banned_en || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
    var p5 = [CF.s5, WS.end.replace('One figure only, natural hands with five fingers; ', 'One figure only; ') + (WS.guard[world] ? ' ' + WS.guard[world] : ''),
      avoid.length ? fill(CF.avoid, { list: avoid.join(', ') }) : ''];
    return [fill(WS.head, { concept: X.line('CONCEPT:'), people: card(D, key).people })].concat([p1, p2, p3, p4, p5].map(function (p) { return p.filter(Boolean).join('\n'); })).join('\n\n');
  }
  /* GPT 임의 설계 주문 — 긴 판에서 누구 · 도시 · 세계만 뽑고, 나머지는 GPT 가 정한다(T.WORLD_FREE). 의상 목록은 그 세계 실루엣 전부 */
  function silPool(c, world) { return ((T.SILHOUETTES || {})[world] || []).slice(); }
  function buildWorldFree(D, S, key, world, opts) {
    opts = opts || {};
    var WF = T.WORLD_FREE, WS = T.WORLD_SHORT, c = card(D, key); needWorld(world); if (!c || !worldOf(c, world)) return '';
    var X = longParts(D, S, key, world, Object.assign({}, opts, { shot: {}, notes: {} }));
    var mo = pal(X.motif), hairC = WF.hair ? en('hair_color', (lookOf(c, world).silhouette || {}).hair_color) : '';
    var list = silPool(c, world).map(function (x, i) { return (i + 1) + ') ' + noDot(x.en); }).join('; ');
    return [fill(WF.head, { concept: X.line('CONCEPT:'), people: c.people, age: first(X.line('AGE:')) }), WF.free, 'Style (fixed): ' + shortStyle(S, opts.style),
      mo.text ? fill(WF.legend, { traits: mo.text + (X.marks ? ' ' + X.marks : '') }) : '', fill(WF.world, { world: first(splitWorld(X.world).desc) }),
      list ? fill(WF.costume, { list: list }) : '', mo.palette ? fill(WF.palette, { palette: mo.palette }) : '', hairC ? fill(WF.hair, { hair: hairC }) : '', WF.expose,
      WS.face.replace('Her eyes keep the shape and size described above', 'Her eyes stay at a natural open size'), WS.composition, WF.second, WF.end].filter(Boolean).join('\n\n');
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
  var SCENE_V2 = ['treeV', 'era', 'place', 'ofam', 'item', 'posture', 'support', 'frame', 'body', 'head', 'camera', 'right', 'left', 'use', 'kind', 'legs', 'gaze',
    'weather', 'time', 'season', 'cityWeather', 'hair', 'own', 'placeText', 'ownProp', 'light', 'spot', 'depth', 'view', 'color', 'denier', 'situ', 'ofree', 'sfree', 'gfree', 'gsitu', 'recent', 'expr', 'preset', 'prop', 'outfit', 'ofeat', 'scene', 'custom', 'axes', 'unlocked', 'unlockedAuto'];
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
  function propWorld(props, key, world) { var p = ((props && props.props) || {})[key]; return p && p.worlds && p.worlds[world] ? trim(p.worlds[world].en) : ''; }
  function sceneV2(st) { var o = {}; SCENE_V2.forEach(function (k) { if (st && st[k] !== undefined) o[k] = st[k]; }); return o; }
  function quoted(v) { return trim(v).replace(/"/g, "'"); }
  /* 버전2 표정 — 표정 문장 속 시선 말을 뗀다(시선은 GAZE 줄 하나가 정한다) */
  var EXPR_GAZE = [[/,?\s*gaze slightly to the side/, ''], [/\bdirect (\w+) gaze\b/, '$1 eyes'], [/\bhard forward gaze\b/, 'hard eyes'],
    [/\bsoft distant gaze past the camera\b/, 'soft distant eyes'], [/\bsoft distant eyes looking just beside the camera at her own eye level\b/, 'soft distant eyes'], [/\bgaze softened and directed slightly upward or away\b/, 'softened eyes'],
    [/\bgaze direct and unwarm\b/, 'eyes unwarm'], [/ fixed on one point/, ''], [/ looking away/, ''], [/,?\s*eyes off camera/, ''], [/\bgaze angled down and away,\s*/, '']];
  function exprNoGaze(text) { return EXPR_GAZE.reduce(function (t, r) { return t.replace(r[0], r[1]); }, String(text || '')); }
  /* 트리가 보는 「카드」 — 손에 드는 그 도시의 물건 하나(hold) */
  /* 땅 = 도시 — 생활 장면표의 장소는 그 도시 카드에만(lifeTree 의 place_lands) */
  function casualCard(c, tree2, world) { var h = holdOf(c, world); return { key: c.key, signature: h ? [h] : [], signature_hold: h ? [0] : [], land: c.key, world: world || '' }; }
  function casualVars(c, world, opts) {
    var w = worldOf(c, world) || {}, life = (opts || {}).life, props = (opts || {}).props;
    return { city_en: c.en, city_ko: c.ko, people: c.people, traits: '', palette: trim((c.city.palette || {}).en), hold: holdOf(c, world),
      world: world || '', worldEn: noDot(w.en), life: life || null, props: props || null,
      clothes: trim((((props || {}).clothes || {})[world] || {}).en),
      times: (life && life.times) || [], seasons: ((life && life.seasons) || {})[c.key] || [], weathers: ((life && life.weather) || {})[c.key] || [] };
  }
  /* 그 장면의 Place · Around her 줄 — 생활 장면이면 그 세계 글 · 그 세계 소품 */
  function lifeLines(m, placeKey) {
    var s = lifeScene(m.life, placeKey), w = s && (s.worlds || {})[m.world];
    if (!w) return null;
    var things = (w.props || []).map(function (k) { return propWorld(m.props, k, m.world); }).filter(Boolean);
    return { place: noDot(w.en), around: things.length ? fill(T.CASUAL.life.around, { props: things.join('; ') }) : '' };
  }
  /* 맨 끝 금지 단락 — 화풍 글의 「No …」 + 그 세계 banned_en(설계표). 없으면 '' */
  function casualAvoid(D, S, styleKey, world) {
    var L = T.CASUAL.life, st = splitNo(shortStyle(S, styleKey)).avoid, ban = markers(D, world).banned_en || [];
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
  function freeDesignLines(sc, t) {
    var F = T.FREE_DESIGN, C = root.AtelierCasualTreeV2, recent = (sc.recent || []).map(trim).filter(Boolean);
    var out = [F.head, fill(F.recent, { recent: recent.join('; ') || F.recentNone })].concat(F.lines);
    if (sc.gfree) {
      var fam = C.family(t, sc.gfree), si = byKey(T.CASUAL.situations, sc.gsitu);
      out.push(fill(F.family, { family: (F.familyNames || {})[sc.gfree] || trim(fam && fam.en) || sc.gfree }));
      if (sc.gsitu === 'free' && F.situFree) out.push(F.situFree); else if (si) out.push(fill(F.situ, { situ: si.en }));
    }
    out.push(sc.gfree ? F.outfit : F.outfitFree);
    return out;
  }
  /* 버전2 장면 → SCENE 줄들. 손·소품·받침의 관계는 PROP 한 줄에서만, 오른손·왼손은 인물 본인 기준 */
  function casualDetailsV2(sc, t, m, ex) {
    if (sc.sfree && T.FREE_DESIGN) return freeDesignLines(sc, t);
    var C = root.AtelierCasualTreeV2, CL = T.CASUAL, out = [], f = C.frame(t, sc.frame);
    var p = C.place(t, sc.place), fam = C.family(t, sc.ofam), it = C.item(t, sc.ofam, sc.item);
    var po = C.posture(t, sc.posture), su = C.support(t, sc.support), u = C.use(t, sc.use), pr = u && C.prop(t, u.prop);
    var by = function (list, k) { return (list || []).filter(function (r) { return r.key === k; })[0]; };
    var body = by(t.v2.body, sc.body), head = by(t.v2.head, sc.head), cam = by(t.v2.camera, sc.camera);
    var bl = C.backLook(t, sc);
    var gaze = by(t.v2.gaze, sc.gaze || (u && u.gaze) || '');
    var ll = p && m && m.life ? lifeLines(m, p.key) : null;
    if (trim(sc.placeText)) out.push('Place: ' + trim(sc.placeText)); else if (ll) out.push('Place: ' + ll.place + '.'); else if (p) out.push('Place: ' + (p.world_place ? CL.worldPlace : p.en));
    if (ll && ll.around) out.push(ll.around);
    var wt = (t.v2.weather || []).filter(function (r) { return r.key === sc.weather; })[0];
    if (wt) out.push('Weather / season: ' + wt.en + '.');
    var sn = byKey((m || {}).seasons, sc.season); if (sn) out.push(fill(CL.life.season, { en: noDot(sn.en) }));
    var cw = byKey((m || {}).weathers, sc.cityWeather); if (cw) out.push(fill(CL.life.weather, { en: noDot(cw.en) }));
    var tm = byKey((m || {}).times, sc.time) || byKey(CL.times, sc.time); if (tm) out.push('Time of day: ' + tm.en + '.');
    var hr = byKey(CL.hairs, sc.hair); if (hr) out.push('Hair: ' + hr.en + '.');
    var X = C.extras(t, sc);
    if (X.light) out.push('Light direction: ' + X.light + '.');
    var specs = (sc.ofeat || []).indexOf('glasses') >= 0 ? CL.glasses : '';
    var oen = trim(sc.outfit) || (it && it.en) || (fam && fam.en) || '', col = colorFixed(oen) ? null : byKey(CL.colors, sc.color);
    var dn = denierFits(oen) ? byKey(CL.deniers, sc.denier) : null, si = situFits(sc.situ, oen) ? byKey(CL.situations, sc.situ) : null;
    if (sc.ofree && T.OUTFIT_FREE) out.push(T.OUTFIT_FREE + specs + '.');
    else if (oen) out.push('Outfit: ' + oen + (col ? fill(CL.colorLine, { color: col.en }) : '') + (dn ? fill(CL.denierLine, dn).replace(', denim and ', ' and ') : '') + (si ? fill(CL.situLine, { en: (X.indoor && si.enIn) || si.en }) : '') + specs);
    if (m && m.clothes) out.push(m.clothes);   /* 옷의 결 — 그 세계의 평상복(세계 소품 사전 clothes) */
    if (po) out.push('POSTURE: ' + po.en + '.');
    if (su && su.en) out.push('SUPPORT: ' + su.en + '.');
    var bodyText = body && body.en + (body.profile_face && head && head.key === 'with_body' ? (gaze && gaze.key === 'camera' ? ', her face in profile too — only her eyes turn toward the camera' : ', her face in profile too, not turned toward the camera') : '')
      + (body.turned_face && head && head.key === 'with_body' ? ', ' + body.turned_face : '')
      + (X.side ? ', ' + X.side.body : '');
    out.push('COMPOSITION: ' + [(f && f.en) || sc.frame, bodyText, head && head.key !== 'with_body' && (bl ? bl.head : head.en), cam && cam.en].concat(X.comp).filter(Boolean).join('; ') + '.');
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
      var thing = pr.signature ? (trim(sc.ownProp) || fill(CL.signatureProp, m)) : (propWorld(m && m.props, pr.key, m && m.world) || pr.en), action = u.en.replace('{prop}', thing);
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
    return { axes: axes, aspect: T.ASPECT_FRAME[trim(scene.aspect)] ? trim(scene.aspect) : F.aspect };
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
  function buildCasualShort(S, opts, c, wr, t, sc, m, close) {
    var C = root.AtelierCasualTreeV2, CL = T.CASUAL, SH = CL.short, row = styleVer(S, opts.style) || {};
    var ex = SH.expose[((sc.axes || {}).skin_exposure) || 'bold'] || SH.expose.bold;
    var det = casualDetailsV2(sc, t, m, row.expr).filter(function (l) { return !/^(?:overall_intensity|skin_exposure|action_level|source_influence|separates_preference):/.test(l); }).map(function (l) {
      if (/^Outfit: /.test(l)) return l.replace(/\.?\s*$/, '') + ', ' + ex + ', ' + SH.body + '.';
      if (/^EXPRESSION: /.test(l)) { var i = l.indexOf('. '); return i > 0 ? l.slice(0, i + 1) : l; }
      return l;
    });
    /* 화풍 글의 「No …」 는 맨 끝 Avoid 단락으로(세계 그림 칸 꼴과 같이 — 금지 낱말이 본문에 안 나온다) */
    var lines = [fill(SH.input, Object.assign({}, m, { who: fill(SH.who.city, m) })), SH.output || '', SH.face, 'Style: ' + splitNo(shortStyle(S, opts.style)).text +
      /* 판에 casualStyleAfter(피부 마감)가 있으면 Style 줄은 화풍 글만, 다음 줄이 그것 — 2026-11-20 서울 일상컷 시험 꼴(SH.keep 없이) */
      (trim(row.casualStyleAfter) ? '\n' + trim(row.casualStyleAfter) : ' ' + SH.keep), SH.beauty || ''];
    /* 그 세계의 그 도시의 하루 — 원소의 「지금 현실」 대신 늘 실린다(시대 = 세계) */
    if (m.worldEn) lines.push(fill(CL.life.world, { city_en: m.city_en, world: m.worldEn }) + (m.worldGuard ? '\n' + m.worldGuard : ''));
    lines.push(det.join('\n'));
    if (close) lines.push('Framing: ' + T.CROP_EDGE[trim(sc.frame)] + '.');
    if (SH.headwear) lines.push(SH.headwear);
    if (m.traits) lines.push(fill(SH.legend, m));
    lines.push(trim(row.casualLight) || SH.light, SH.end, m.avoid || '');
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
    var cw = (((D && D.vocab) || {}).casual_world || {})[wr.key] || {};
    var m = Object.assign(casualVars(c, wr.key, opts), { world_en: wr.en.charAt(0) + wr.en.slice(1).toLowerCase(), avoid: casualAvoid(D, S, opts.style, wr.key), worldGuard: trim(cw.guard_en) },
      trim(cw.en) ? { worldEn: noDot(fill(cw.en, { city_en: c.en })) } : {});
    var sc = scene.sfree ? Object.assign(sceneV2(scene), { treeV: 2, axes: fx.axes }) : C.repair(t, Object.assign(sceneV2(scene), { axes: fx.axes }), g), f = C.frame(t, sc.frame);
    var body = (t.v2.body || []).filter(function (r) { return r.key === sc.body; })[0] || {};
    var head = (t.v2.head || []).filter(function (r) { return r.key === sc.head; })[0] || {};
    var close = !sc.sfree && T.CLOSE_FRAMES.indexOf(trim(sc.frame)) >= 0, lines = [];
    if (casualShortOn(S, opts.style)) return buildCasualShort(S, opts, c, wr, t, sc, m, close);
    lines.push(fill(CL.input, m));
    lines.push(fill(CL.character.city, m));
    if (m.traits) lines.push(fill(CL.design, m));
    var st = styleText(S, opts.style, 'casual') || styleText(S, opts.style, 'text'); if (st) lines.push('STYLE: ' + st);
    lines.push(CL.age);
    lines.push(CL.output);
    lines.push(fill(CL.frame, { frame: T.ASPECT_FRAME[fx.aspect] }));
    if (close) lines.push(fill(CL.crop, { edge: T.CROP_EDGE[trim(sc.frame)] }));
    var era = C.era(t, sc.era); if (era) lines.push(casualEraLine(c, era, m, wr.key));
    if (C1.screens(t.v1, sc.place)) lines.push(fill(CL.screens, m));
    lines.push('SCENE (chosen):\n' + casualDetailsV2(sc, t, m, styleVer(S, opts.style).expr).join('\n'));
    var csk = styleVer(S, opts.style).casualSkin; if (csk) lines.push(csk);
    lines.push(close ? CL.wardrobeClose : CL.wardrobe);
    lines.push(CL.angle);
    if (body.far && head.look_back) lines.push(CL.lookBack);
    lines.push(fill(CL.figure, m), close ? CL.anatomyClose : CL.anatomy, CL.body, CL.hands);
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

  root.AtelierPrompt = { card: card, cards: cards, city: city, worldsOf: worldsOf,
    build: build, worldLines: worldLines, fileName: fileName, record: record, styleText: styleText, styleVersion: styleVersion,
    lookOf: lookOf, normLook: normLook, scenesOf: scenesOf, normShot: normShot, holdOf: holdOf, faceItems: faceItems, silhouetteItems: silhouetteItems, identityParams: identityParams, paramValues: paramValues, exposureLine: exposureLine,
    buildCasual: buildCasual, casualWorld: casualWorld, casualFile: casualFile, casualRecord: casualRecord, casualDetailsV2: casualDetailsV2, freeDesignLines: freeDesignLines, exprNoGaze: exprNoGaze, sceneV2: sceneV2, casualFixed: casualFixed,
    silOf: silOf, buildWorldFree: buildWorldFree, silPool: silPool, worldShortOn: worldShortOn, worldSectionsOn: worldSectionsOn, splitNo: splitNo, casualShortOn: casualShortOn, shortStyle: shortStyle, colorFixed: colorFixed, denierFits: denierFits, situsFor: situsFor, situFits: situFits,
    sectionsOf: sectionsOf, casualSections: casualSections, lifeTree: lifeTree, lifeScene: lifeScene, lifeKey: lifeKey, propWorld: propWorld };
  root.PromptCity = { build: buildCity };
})(typeof window !== 'undefined' ? window : globalThis);
