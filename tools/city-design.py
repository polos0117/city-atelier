#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""도시 설계표 검사 — 원소 검사기(나라 › 가문 › 주민)를 도시 한 층으로 줄였다.

    python -I -X utf8 tools/city-design.py check

규칙(docs/superpowers/specs/2026-11-19-city-atelier-design.md 3 · 6절, 계획 Task 2):
- vocab.worlds 는 정확히 fantasy · steampunk · cyberpunk. world_ko · markers · wear 가 세계마다.
- markers.<세계> = { ko, en(8~12, 같은 수), banned_en } — 판타지 · 스팀펑크는 금지 낱말 10개 이상(스팀펑크는 neon 포함), 사이버펑크는 빈 배열.
- wear.<세계> = { costume, bold, moderate, low } — 영어 옷 말투(원소 prompt-spec 의 COSTUME · EXPOSURE 꼴).
- casual_world.<세계> = { en, guard_en } — 일상컷 「World:」 줄의 세계 결(명소 없이)과 다음 줄 guard. en 에 그 세계 금지 낱말이 없다.
- cities 열쇠는 CITY_KEYS 와 같은 열 개 같은 차례. 도시마다 ko · en · country · persona, lat · lon(범위 안, 소수 둘째 자리까지) · latlon_src(주소),
  palette { en, hex 2~3개 #RRGGBB }, symbols 3~5개(ko · en · src 주소).
- landmarks(고를 수 있는 칸) 가 있으면 랜드마크마다 key(소문자 · 숫자 — '-' '_' 없음, 도시 안에서 겹침 없음) · ko · en · persona · src(주소) · worlds 를
  도시 worlds 와 같은 검사로 보고, 같은 도시 · 같은 세계 사람끼리(도시 사람 + 랜드마크 전부) 얼굴 칸이 FACE_DIFF_MIN 개 이상 다르지 않으면 오류.
- worlds 가 {} 면 설계 미정. 채우면 세 세계 다: ko · en(40자 이상, 한국어 없음) · scenes 셋(key · ko · en) ·
  look { face 여섯, silhouette 셋, why } · hold.en · motif { ko, en }. 세 세계는 다른 사람 — 머리색 · 체형 · 얼굴형 · 헤어스타일이 세계끼리 모두 다르고, 얼굴 칸(face_shape · eyes · brows · nose · lips) 가운데
  셋 이상이 세 세계 모두 다르다(미형이되 같은 얼굴은 피한다 — 사용자 2026-11-19). 도시마다 people { ko, en }(그 나라 사람, 조립기 머리 줄 「an adult <en> woman」).
- 판타지 · 스팀펑크의 글(en · scenes · hold · motif)에 그 세계 banned_en 낱말이 없다.
- 화면 짧은 말(도시 무대 · Task 8): 설계된 도시는 card_ko.symbols(상징 한 줄, SHORT_SYMBOLS 자 이하 — " · " 로 나눈 낱말마다
  symbols[].ko 하나의 머리), 세계마다 card_ko { look(머리 · 몸), motif(무늬) } 각 SHORT_WORLD 자 이하. 화면은 이 칸을 그대로 읽는다.
- look 값은 소문자 열쇠까지만 본다 — 어휘 대조는 tests/look-spec.cjs(lib/look-spec.js VOCAB_EN · FACE_DESIGN).
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORLDS = ["fantasy", "steampunk", "cyberpunk"]
CITY_KEYS = ["seoul", "tokyo", "beijing", "paris", "london", "rome", "newyork", "istanbul", "cairo", "rio", "busan", "bangkok", "barcelona", "sydney", "mexicocity"]
KEY = re.compile(r"^[a-z0-9]+$")
HEX = re.compile(r"^#[0-9A-Fa-f]{6}$")
URL = re.compile(r"^https?://\S+$")
HANGUL = re.compile(r"[가-힣]")
LOOK = {"face": ("face_shape", "eyes", "brows", "nose", "lips", "eye_color"), "silhouette": ("body", "hair", "hair_color")}
AGES = ("early_20s", "mid_20s")   # 나이 — 20대 초 · 중반만(2026-11-23)
FACE_DESIGN = {"face": ("age", "impression", "skin_tone", "eye_size", "eye_tilt", "mark", "expr"), "silhouette": ("bangs",)}
FACE_KEYS = ("face_shape", "eyes", "brows", "nose", "lips")
FACE_DIFF_MIN = 3
NO_FRECKLES = ("Korean", "Japanese", "Chinese", "Thai")   # 동양 쪽은 주근깨 없음(사용자 2026-11-22 「설계에 동양쪽은 주근깨 안나오게 해줘」)
DIFFER = (("silhouette", "hair_color"), ("silhouette", "body"), ("face", "face_shape"), ("silhouette", "hair"))
WEAR = ("costume", "bold", "moderate", "low")
SHORT_SYMBOLS, SHORT_WORLD = 40, 20


def banned_in(text, banned):
    return [b for b in banned if re.search(r"\b" + re.escape(b.lower()) + r"\b", (text or "").lower())]


def _sil_keys():
    """lib/prompt-spec.js 의 세계별 실루엣 열쇠(SILHOUETTES = { fantasy: FANTASY_SILHOUETTES, … })"""
    import re as _re
    src = open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "lib", "prompt-spec.js"), encoding="utf-8").read()
    out = {}
    for w, name in (("fantasy", "FANTASY"), ("steampunk", "STEAMPUNK"), ("cyberpunk", "CYBERPUNK")):
        m = _re.search(r"var " + name + r"_SILHOUETTES = \[(.*?)\n  \];", src, _re.S)
        out[w] = tuple(_re.findall(r"key: '([a-z_]+)'", m.group(1))) if m else ()
    return out


SIL_KEYS = _sil_keys()


def check(doc):
    errs, warns = [], []

    def en(where, s, least=40):
        s = (s or "").strip() if isinstance(s, str) else ""
        if len(s) < least:
            errs.append("%s — 영어 글이 짧다(%d자, %d자 이상)" % (where, len(s), least))
        if HANGUL.search(s):
            errs.append("%s — 영어 칸에 한국어" % where)

    v = doc.get("vocab") or {}
    if v.get("worlds") != WORLDS:
        errs.append("vocab.worlds 는 fantasy · steampunk · cyberpunk 셋 — %r" % (v.get("worlds"),))
    markers, wear, wko = v.get("markers") or {}, v.get("wear") or {}, v.get("world_ko") or {}
    for w in WORLDS:
        if not (wko.get(w) or "").strip():
            errs.append("vocab.world_ko.%s 가 비었다" % w)
        m = markers.get(w) or {}
        ko, ens, ban = m.get("ko") or [], m.get("en") or [], m.get("banned_en")
        if not 8 <= len(ens) <= 12:
            errs.append("vocab.markers.%s.en 은 8~12개 — %d" % (w, len(ens)))
        if len(ko) != len(ens):
            errs.append("vocab.markers.%s ko(%d) · en(%d) 수가 다르다" % (w, len(ko), len(ens)))
        for s in ens:
            en("vocab.markers.%s.en %r" % (w, s), s, 3)
        if not isinstance(ban, list):
            errs.append("vocab.markers.%s.banned_en 이 목록이 아니다" % w)
            ban = []
        if w == "cyberpunk":
            if ban:
                errs.append("vocab.markers.cyberpunk.banned_en 은 빈 배열")
        elif len(ban) < 10:
            errs.append("vocab.markers.%s.banned_en 은 10개 이상 — %d" % (w, len(ban)))
        if w == "steampunk" and not any("neon" in b for b in ban):
            errs.append("vocab.markers.steampunk.banned_en 에 neon 이 없다")
        for s in ens:
            if banned_in(s, ban):
                errs.append("vocab.markers.%s 표지 %r 에 금지 낱말" % (w, s))
        wr = wear.get(w) or {}
        for k in WEAR:
            en("vocab.wear.%s.%s" % (w, k), wr.get(k), 30)
        cw = (v.get("casual_world") or {}).get(w) or {}
        for k in ("en", "guard_en"):
            en("vocab.casual_world.%s.%s" % (w, k), cw.get(k), 40)
        if banned_in(cw.get("en"), ban or []):
            errs.append("vocab.casual_world.%s.en 에 그 세계 금지 낱말 %s" % (w, banned_in(cw.get("en"), ban or [])))
    for w in list(markers) + list(wear):
        if w not in WORLDS:
            errs.append("vocab 의 %r 는 아는 세계가 아니다" % w)

    def worlds_check(here, ws, people=""):
        if sorted(ws) != sorted(WORLDS):
            errs.append(here + " worlds 는 세 세계 다 — %r" % sorted(ws))
        for w, body in ws.items():
            if w not in WORLDS:
                return
            wh = here + " " + w
            if not (body.get("ko") or "").strip():
                errs.append(wh + " ko 가 비었다")
            en(wh + " en", body.get("en"))
            sc = body.get("scenes")
            if not isinstance(sc, list) or len(sc) != 3:
                errs.append(wh + " scenes 는 셋")
                sc = sc if isinstance(sc, list) else []
            seen = set()
            for r in sc:
                rk = (r or {}).get("key")
                if not rk or not KEY.match(rk) or rk in seen:
                    errs.append(wh + " scenes 열쇠 %r 가 꼴이 아니거나 겹친다" % rk)
                seen.add(rk)
                if not (r.get("ko") or "").strip():
                    errs.append(wh + " scenes.%s ko 가 비었다" % rk)
                en(wh + " scenes.%s en" % rk, r.get("en"), 12)
            lk = body.get("look") or {}
            for grp, need in LOOK.items():
                box = lk.get(grp) or {}
                for f in need:
                    if not box.get(f):
                        errs.append("%s look.%s.%s 가 비었다" % (wh, grp, f))
                for f, val in box.items():
                    if f not in need and f not in FACE_DESIGN[grp]:
                        errs.append("%s look.%s 의 %r 는 모르는 칸" % (wh, grp, f))
                    elif not isinstance(val, str) or not KEY.match(val.replace("_", "")):
                        errs.append("%s look.%s.%s 값은 소문자 열쇠 — %r" % (wh, grp, f, val))
            if not (lk.get("why") or "").strip():
                errs.append(wh + " look.why 가 비었다")
            # 나이는 20대 초 · 중반만(2026-11-23 사용자 「그냥 다 동안이나 20대초중반으로 맞춰주면 안되나」)
            if (lk.get("face") or {}).get("age") not in AGES:
                errs.append("%s look.face.age 는 %s 가운데 하나 — %r" % (wh, " · ".join(AGES), (lk.get("face") or {}).get("age")))
            if people in NO_FRECKLES and ((lk.get("face") or {}).get("mark") == "freckles" or "주근깨" in (lk.get("why") or "") or "freckl" in json.dumps(body, ensure_ascii=False).lower()):
                errs.append(wh + " 동양 쪽(%s) 사람에 주근깨 — 다른 표시(mark)로" % people)
            # 옷의 꼴 — 세계별 실루엣 한 칸(2026-11-20 사용자 「안에 입는옷은 다 똑같아보이는데」 → 「응 바꿔줘」). 열쇠는 lib/prompt-spec.js 의 그 세계 *_SILHOUETTES
            if body.get("sil") not in SIL_KEYS.get(w, ()):
                errs.append("%s sil 이 없거나 그 세계 실루엣 표에 없다 — %r" % (wh, body.get("sil")))
            en(wh + " hold.en", (body.get("hold") or {}).get("en"), 12)
            mo = body.get("motif")
            if not isinstance(mo, dict) or not (mo.get("ko") or "").strip():
                errs.append(wh + " motif 가 없다(도시 상징을 실은 옷 · 장신구 한 줄)")
            en(wh + " motif.en", (mo or {}).get("en"), 30)
            ck = body.get("card_ko") or {}
            for f in ("look", "motif"):
                t = ck.get(f).strip() if isinstance(ck.get(f), str) else ""
                if not t or len(t) > SHORT_WORLD:
                    errs.append("%s card_ko.%s(화면 짧은 말)가 비었거나 %d자 넘음 — %d자" % (wh, f, SHORT_WORLD, len(t)))
            ban = (markers.get(w) or {}).get("banned_en") or []
            # 도시별로 Avoid 줄에서만 빼는 금지 낱말(2026-11-21 베이징) — 그 세계 banned_en 에 있는 낱말만. 글 검사는 그대로(빼도 글엔 쓰지 않는다)
            for u in (body.get("own_vocab") or {}).get("unban_en") or []:
                if u not in ban:
                    errs.append("%s own_vocab.unban_en %r 는 그 세계 banned_en 에 없다" % (wh, u))
            texts =[body.get("en"), (body.get("hold") or {}).get("en"), (mo or {}).get("en")] + [(r or {}).get("en") for r in sc]
            for t in texts:
                hit = banned_in(t, ban)
                if hit:
                    errs.append("%s 글에 그 세계 금지 낱말 %s" % (wh, hit))
        for grp, f in DIFFER:
            vals = [(((ws.get(w) or {}).get("look") or {}).get(grp) or {}).get(f) for w in WORLDS]
            if len(set(vals)) < len(vals):
                errs.append("%s 세 세계가 다른 사람이 아니다 — look.%s.%s %r" % (here, grp, f, vals))
        far = [f for f in FACE_KEYS if len({(((ws.get(w) or {}).get("look") or {}).get("face") or {}).get(f) for w in WORLDS}) == len(WORLDS)]
        if len(far) < FACE_DIFF_MIN:
            errs.append("%s 세 세계 얼굴 칸 가운데 세계마다 다른 것이 %d개뿐(%d개 이상) — %s" % (here, len(far), FACE_DIFF_MIN, "·".join(far) or "없음"))

    cities = doc.get("cities") or []
    keys = [c.get("key") for c in cities]
    if keys != CITY_KEYS:
        errs.append("cities 열쇠가 계획 목록과 다르다 — %r" % keys)
    undecided = 0
    for c in cities:
        k = c.get("key")
        here = "도시 %r" % k
        if not k or not KEY.match(k):
            errs.append(here + " 열쇠는 소문자 · 숫자만")
        for col in ("ko", "en", "country", "persona"):
            if not (c.get(col) or "").strip():
                errs.append(here + " %s 가 비었다" % col)
        pp = c.get("people")
        if not isinstance(pp, dict) or not (pp.get("ko") or "").strip() or not (pp.get("en") or "").strip() or HANGUL.search(pp.get("en") or ""):
            errs.append(here + " people { ko, en } 이 없거나 비었다(그 나라 사람 — en 은 한국어 없이 한 낱말)")
        for col, lim in (("lat", 90), ("lon", 180)):
            x = c.get(col)
            if not isinstance(x, (int, float)) or isinstance(x, bool) or not -lim <= x <= lim:
                errs.append(here + " %s 가 범위 밖 — %r" % (col, x))
            elif round(x, 2) != x:
                errs.append(here + " %s 는 소수 둘째 자리까지 — %r" % (col, x))
        if not URL.match(c.get("latlon_src") or ""):
            errs.append(here + " latlon_src 가 주소가 아니다")
        pal = c.get("palette") or {}
        if not (pal.get("en") or "").strip() or HANGUL.search(pal.get("en") or ""):
            errs.append(here + " palette.en 이 비었거나 한국어")
        hx = pal.get("hex") or []
        if not 2 <= len(hx) <= 3 or not all(isinstance(h, str) and HEX.match(h) for h in hx):
            errs.append(here + " palette.hex 는 #RRGGBB 2~3개 — %r" % (hx,))
        sy = c.get("symbols") or []
        if not 3 <= len(sy) <= 5:
            errs.append(here + " symbols 는 3~5개 — %d" % len(sy))
        for i, s in enumerate(sy):
            if not (s.get("ko") or "").strip():
                errs.append(here + " symbols[%d].ko 가 비었다" % i)
            en(here + " symbols[%d].en" % i, s.get("en"), 3)
            if not URL.match(s.get("src") or ""):
                errs.append(here + " symbols[%d].src 가 주소가 아니다" % i)
        ws = c.get("worlds")
        if not isinstance(ws, dict):
            errs.append(here + " worlds 는 {}(미정) 이거나 세 세계")
            continue
        if not ws:
            undecided += 1
            if c.get("landmarks"):
                errs.append(here + " 설계 미정(worlds {})인데 landmarks 가 있다 — 랜드마크는 설계된 도시에만")
            continue
        line = (c.get("card_ko") or {}).get("symbols")
        line = line.strip() if isinstance(line, str) else ""
        if not line or len(line) > SHORT_SYMBOLS:
            errs.append(here + " card_ko.symbols(상징 한 줄)가 비었거나 %d자 넘음 — %d자" % (SHORT_SYMBOLS, len(line)))
        for part in [x.strip() for x in line.split(" · ") if x.strip()]:
            if not any((s.get("ko") or "").startswith(part) for s in sy):
                errs.append(here + " card_ko.symbols 의 %r 가 symbols[].ko 머리에 없다(지어내지 않는다)" % part)
        worlds_check(here, ws, (c.get("people") or {}).get("en") or "")
        lms = c.get("landmarks") or []
        seen_lm = set()
        for l in lms:
            lk = l.get("key")
            lh = here + " 랜드마크 %r" % lk
            if not lk or not KEY.match(lk) or lk in seen_lm:
                errs.append(lh + " 열쇠는 소문자 · 숫자만('-' · '_' 없음)이고 도시 안에서 겹치지 않는다")
            seen_lm.add(lk)
            for col in ("ko", "en", "persona"):
                if not (l.get(col) or "").strip():
                    errs.append(lh + " %s 가 비었다" % col)
            if not URL.match(l.get("src") or ""):
                errs.append(lh + " src 가 주소가 아니다")
            lw = l.get("worlds")
            if not isinstance(lw, dict) or not lw:
                errs.append(lh + " worlds 는 세 세계 다")
                continue
            worlds_check(lh, lw, (c.get("people") or {}).get("en") or "")
            for w in WORLDS:
                mine = (((lw.get(w) or {}).get("look") or {}).get("face") or {})
                for other, ow in [(here, ws)] + [("랜드마크 %r" % o.get("key"), o.get("worlds") or {}) for o in lms if o is not l and o.get("key") in seen_lm]:
                    theirs = (((ow.get(w) or {}).get("look") or {}).get("face") or {})
                    diff = [f for f in FACE_KEYS if mine.get(f) != theirs.get(f)]
                    if len(diff) < FACE_DIFF_MIN:
                        errs.append("%s %s 얼굴이 %s 과 칸 %d개만 다르다(%d개 이상)" % (lh, w, other, len(diff), FACE_DIFF_MIN))
    if undecided:
        warns.append("설계 미정(worlds {}) 도시 %d곳" % undecided)
    return errs, warns


def load():
    with open(os.path.join(ROOT, "data", "city-design.json"), encoding="utf-8") as f:
        return json.load(f)


def main(argv):
    if len(argv) < 2 or argv[1] != "check":
        print(__doc__)
        return 2
    doc = load()
    errs, warns = check(doc)
    for w in warns:
        print("알림:", w)
    for e in errs:
        print("오류:", e)
    cities = doc.get("cities") or []
    print("도시 %d · 설계 %d · 오류 %d" % (len(cities), sum(1 for c in cities if c.get("worlds")), len(errs)))
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
