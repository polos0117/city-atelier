#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""그림 저장소의 img/ 를 읽어 data/img.json 에 등록한다. 원소 공방의 같은 도구에서 왔다(2026-10-30 → 도시 꼴 2026-11-19).

파일 이름이 곧 등록 정보다. 도시 열쇠 · 세계 열쇠는 data/city-design.json, 화풍 열쇠는 data/style.json 에 있다.
도시 열쇠는 소문자 영문(seoul · newyork …) — 밑줄(_)은 안 들어간다. 사람은 모두 여성이라 성별 표시는 _f 하나다.
    <도시>_<세계>_<화풍>_f.webp           세계 그림 — 세계는 fantasy(판타지) · steampunk(스팀펑크) · cyberpunk(사이버펑크)
    <도시>_<세계>_<화풍>_f_casual3.webp   일상컷 3 — 그 세계 그림을 참고 그림으로 붙인 것이라 세계를 탄다. 그 세계 몫(byForm) 안의 casual 에 든다
                                         번호 90 은 캐릭터만의 컷(IMAGE_RULES 2절) — 같은 꼴, 번호만 90
  예) seoul_fantasy_jp_paint_anime_f.webp · seoul_cyberpunk_jp_paint_anime_f.webp · seoul_steampunk_jp_paint_anime_f_casual1.webp
세계 없는 일상컷 · 특별컷 · 연출컷 · 개방은 없다 — 도시 하나에 세계 셋과 일상컷이 전부다.
성별 표시(_f)는 반드시 붙인다(남성 _m 은 없다 — 이름 꼴 오류). 이름은 모두 소문자다.
화풍·세계는 목록에 있는 열쇠일 때만 떼어 낸다. 뒤에서부터 성별 → 화풍 → 세계 순으로 벗기고 남는 것이 도시 열쇠여야 한다.
그 밖의 토막이 끼면 도시 이름으로 읽히다 실패해 "그런 도시가 없다" 로 남는다 — 오타를 잡으려고 일부러 통과시키지 않는다.
누락·오타·같은 자리 충돌이 있으면 파일을 쓰지 않고 실패한다.

화면(지구본 · 도감)은 data/img.json 에 적힌 것만 그린다. 그림 저장소에 파일이 있어도 여기를 거치기 전에는 없는 것이다.

사용법:
    python3 tools/register-images.py            # data/img.json 에 없는 것을 더한다
    python3 tools/register-images.py --check    # 쓰지 않고 무엇이 달라지는지만 본다
    python3 tools/register-images.py --prune    # 파일이 사라진 항목도 지운다
    python3 tools/register-images.py --backfill-added ../city-atelier-img   # 날짜 없는 그림에 그림 저장소 git 이력의 날짜를(한 번)

등록한 날(added): img.json 의 "added" 에 {파일: "YYYY-MM-DD"} 로 적는다. 도감의 "최근 추가"·"새" 표가 읽는다.
이번에 새로 적힌 파일만 오늘 날짜를 받고, 이미 있는 날짜는 그대로 둔다. 날짜를 지어내지 않는다 — 처음부터 있던
그림은 --backfill-added 가 그림 저장소의 git 이력(그 파일이 처음 더해진 커밋 날짜)에서만 채우고, 이력에서 못 찾으면
날짜 없이 둔다(도감에 "최근" 으로 안 뜬다). 워크플로의 그림 저장소 체크아웃은 얕아서(이력 한 칸) 거기서는 채우지 않는다.
"""
import argparse
import datetime
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
ART_SIZE = (1024, 1536)          # 2:3 세로. 모든 그림은 이 크기로 맞춘다

# 그림이 사는 곳. GitHub 의 파일 목록 API 가 1000개에서 잘리므로 저장소 최상위가 아니라 img/ 에 둔다. img.json 에는
# 폴더 없이 파일 이름만 적는다 — 주소는 화면 쪽 lib/img.js 가 붙인다(where 로 저장소를 고른다).
IMG_DIR = "img"
# 그림 저장소는 여럿이 될 수 있다(원소 공방은 둘이 됐다). 한 Pages 사이트는 1 GB 까지라 차면 새 그림은 다음 저장소에 올린다.
# 지금 도시 공방은 하나다 — 0 번이 IMG_DIR, 그 뒤가 EXTRA_DIRS 차례(지금은 없다) — lib/img.js 의 BASES 와 같은 차례다
# (tests/img-shards.cjs 가 맞춰 본다). 저장소를 더할 때는 SHARDS 끝에 이름을, EXTRA_DIRS 끝에 img-2 · img-3 … 을 붙인다. 워크플로는 각 저장소의 img/ 를 이 이름으로 잇는다.
# 어느 파일이 몇 번 저장소에 있는지는 img.json 의 where 에 적는다(0 번은 적지 않는다 — 옛 주소 그대로).
# 새 그림은 "열린 저장소" 에만 받는다: 체크아웃에 있는 저장소 가운데 번호가 가장 큰 것.
# 닫힌 저장소에는 이미 있는 이름의 교체만 받는다 — 새 이름이 오면 등록 전체를 멈춘다.
SHARDS = ["city-atelier-img"]
EXTRA_DIRS = []

# 세계 그림 · 일상컷만 받는다. 성별은 _f 하나 · 이름은 소문자 — 남성 _m · 특별컷 · 연출컷 · 대문자는 "이름 꼴이 안 맞는다" 로 선다
PAT = re.compile(r"^(.+)_f(?:_casual(\d+))?\.webp$")
# 화풍 견본. 도시 그림이 아니다
SKIP = re.compile(r"^style-")
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
# 얕은 그림 저장소에서 이력을 더 받을 때 한 번에 받는 칸 수와 그 끝. 끝까지 받아도 얕으면 경계 커밋의 날짜는 버린다
DEEPEN, DEEPEN_MAX = 200, 5000


def today():
    """오늘 날짜(YYYY-MM-DD). 검사가 갈아 끼운다."""
    return datetime.date.today().isoformat()


def read(name):
    with open(os.path.join(DATA, name + ".json"), encoding="utf-8") as f:
        return json.load(f)


def cities():
    """카드 열쇠 목록 — data/city-design.json 의 도시 + 그 도시의 랜드마크 <도시>-<랜드마크>(설계가 비어 있어도 열쇠는 있다)."""
    return [k for c in read("city-design")["cities"] for k in [c["key"]] + [c["key"] + "-" + l["key"] for l in c.get("landmarks") or []]]


def world_keys():
    """세계 열쇠 목록(차례 그대로)."""
    return list(read("city-design")["vocab"]["worlds"])


def style_names():
    """화풍 열쇠 → 이름. data/style.json 의 styles."""
    return {k: v.get("name") or k for k, v in (read("style").get("styles") or {}).items()}


def _render(obj):
    def one(v):
        return json.dumps(v, ensure_ascii=False, separators=(", ", ": "))

    def val(v, pad):
        if isinstance(v, dict) and len(v) > 8:
            return "{\n" + ",\n".join('%s "%s": %s' % (pad, k, val(x, pad + " ")) for k, x in v.items()) + "\n" + pad + "}"
        return one(v)
    return "{\n" + ",\n".join(' "%s": %s' % (k, val(v, " ")) for k, v in obj.items()) + "\n}\n"


def write(name, obj):
    with open(os.path.join(DATA, name + ".json"), "w", encoding="utf-8") as f:
        f.write(_render(obj))


def _webp_size(path):
    """webp 머리말에서 가로·세로만 읽는다. 외부 꾸러미 없이."""
    try:
        b = open(path, "rb").read(64)
    except OSError:
        return None
    if b[:4] != b"RIFF" or b[8:12] != b"WEBP":
        return None
    if b[12:16] == b"VP8X":
        return (int.from_bytes(b[24:27], "little") + 1, int.from_bytes(b[27:30], "little") + 1)
    if b[12:16] == b"VP8L":
        n = int.from_bytes(b[21:25], "little")
        return ((n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1)
    if b[12:16] == b"VP8 ":
        return (int.from_bytes(b[26:28], "little") & 0x3FFF, int.from_bytes(b[28:30], "little") & 0x3FFF)
    return None


def art_size(dirs):
    """[(이름, 가로, 세로)…] — 그림 자리 안에서 ART_SIZE 가 아닌 그림."""
    bad = []
    for d in dirs:
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if f.lower().endswith(".webp"):
                s = _webp_size(os.path.join(d, f))
                if s and tuple(s) != ART_SIZE:
                    bad.append((f, s[0], s[1]))
    return bad


def git(repo, *args):
    return subprocess.run(["git", "-C", repo] + list(args), check=True,
                          capture_output=True, text=True).stdout


def history_dates(repo, folder=IMG_DIR):
    """그림 저장소 git 이력에서 {파일: 처음 더해진 커밋 날짜}.

    파일마다 `git log --diff-filter=A --format=%cs -- img/<파일>` 의 맨 아래 줄과 같은 것을 한 번에 셈한다.
    이름 바꾸기도 새 이름이 더해진 것으로 친다(--no-renames). 얕은 저장소면 --depth 를 늘려 가며 받고,
    그래도 얕으면 경계 커밋(이전 이력이 잘린 자리라 모든 파일이 거기서 "더해진" 것으로 보인다)의 날짜는 쓰지 않는다."""
    def shallow():
        return git(repo, "rev-parse", "--is-shallow-repository").strip() == "true"

    depth = DEEPEN
    while shallow() and depth <= DEEPEN_MAX:
        git(repo, "fetch", "--quiet", "--depth=%d" % depth)
        depth += DEEPEN
    edge = set()
    if shallow():
        p = git(repo, "rev-parse", "--git-path", "shallow").strip()
        p = p if os.path.isabs(p) else os.path.join(repo, p)
        if os.path.exists(p):
            edge = set(open(p).read().split())
    out, at = {}, None
    log = git(repo, "log", "--no-renames", "--diff-filter=A", "--name-only", "--format=@%H %cs", "--", folder + "/")
    for line in log.splitlines():
        if line.startswith("@"):
            sha, date = line[1:].split()
            at = None if sha in edge else date
        elif line.strip() and at:
            name = line.strip()
            if os.path.dirname(name) == folder:
                out[os.path.basename(name)] = at       # 새 것부터 내려오므로 마지막에 남는 것이 처음 더해진 날
    return out


def split_style(head, styles):
    """'seoul_fantasy_game_keyart' → ('seoul_fantasy', 'game_keyart').

    화풍이 안 붙었으면 style 자리가 None 이다. 이름 뒤가 아는 화풍일 때만
    떼어내므로, 화풍처럼 생겼지만 목록에 없는 토막은 도시 열쇠의 일부로 남아
    뒤에서 '그런 도시가 없다'로 걸린다."""
    for k in sorted(styles, key=len, reverse=True):
        if head.lower().endswith("_" + k):
            return head[: -len(k) - 1], k
    return head, None


def split_form(head, forms):
    """'seoul_fantasy' → ('seoul', 'fantasy'). 세계가 없으면 form 자리가 None.

    split_style 과 같은 방식이다 — 아는 세계일 때만 떼어낸다. 세계처럼 생겼지만 목록에 없는 토막(mecha 등)이 끼면
    이름이 그대로 남아 뒤에서 '그런 도시가 없다'로 걸린다.

    이름 차례가 <도시>_<세계>_<화풍>_<성별> 인 까닭도 여기 있다. 뒤에서부터
    성별 → 화풍 → 세계 순으로 벗겨야 남는 것이 도시 열쇠가 된다."""
    for k in sorted(forms, key=len, reverse=True):
        if head.lower().endswith("_" + k):
            return head[: -len(k) - 1], k
    return head, None


def shots(bucket, slot):
    """일상컷·특별컷은 {"f": [...], "m": [...]} 꼴이다. 없는 성별은 칸이 없다."""
    v = bucket.get(slot)
    return v if isinstance(v, dict) else ({"f": v} if v else {})


def buckets(img):
    """도시 몫·화풍 몫·세계 몫을 한 줄로 늘어놓는다. 셋의 속은 같은 꼴이다."""
    def walk(v):
        yield v
        for b in (v.get("byStyle") or {}).values():
            for x in walk(b):
                yield x
        for b in (v.get("byForm") or {}).values():
            yield b

    for v in img.values():
        for x in walk(v):
            yield x


SLOTS = ("m", "f", "face", "casual", "extra", "byForm")   # lib/img.js 가 읽는 칸 — 이 공방은 f · casual · byForm 만 쓴다


def tidy(img, styles, forms=()):
    """칸 차례를 고정한다. 파일이 붙는 차례대로 두면 같은 내용이라도 줄이
    달라 보여서, 손으로 넣은 항목과 이 스크립트가 넣은 항목의 diff 가 지저분해진다.
    세계(byForm)도 설계표 차례(fantasy · steampunk · cyberpunk)로 둔다 — 화면이 그 차례로 그린다."""
    order = list(styles)
    worlds = list(forms)

    def rank(seq, x):
        return (seq.index(x) if x in seq else len(seq), x)

    def one(b):
        out = {k: b[k] for k in SLOTS if k in b}
        if isinstance(out.get("byForm"), dict):
            out["byForm"] = {k: out["byForm"][k] for k in sorted(out["byForm"], key=lambda x: rank(worlds, x))}
        return out

    for v in img.values():
        bs = v.pop("byStyle", None)
        for k in [k for k in v if k not in SLOTS]:
            del v[k]
        v.update(one(dict(v)))
        for k in [k for k in v if k not in SLOTS]:
            del v[k]
        if bs:
            v["byStyle"] = {k: one(bs[k]) for k in sorted(bs, key=lambda x: rank(order, x))}


def listed_files(img):
    """img.json 이 이미 가리키고 있는 파일 전부. byStyle·byForm 안쪽까지 본다."""
    out = set()

    def take(d):
        for k in ("m", "f"):
            if d.get(k):
                out.add(d[k])
        for k in ("casual", "extra"):
            for lst in shots(d, k).values():
                for f in lst or []:
                    out.add(f)

    for b in buckets(img):
        take(b)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--prune", action="store_true", help="파일이 없어진 항목을 지운다")
    ap.add_argument("--backfill-added", metavar="그림저장소", help="날짜 없는 그림에 그 저장소 git 이력의 날짜를 채운다")
    a = ap.parse_args()

    doc = read("img")
    img = doc["img"]
    known = set(cities())
    styles = style_names()
    forms = world_keys()
    owner, unknown, missing = {}, [], []
    for i, d in enumerate([IMG_DIR] + list(EXTRA_DIRS)):
        if not os.path.isdir(d):
            if i == 0:
                raise SystemExit("그림 자리 %s 가 없다" % d)
            missing.append(SHARDS[i] if i < len(SHARDS) else d)
            continue
        for f in os.listdir(d):
            if not f.lower().endswith(".webp"):
                continue
            if f in owner:
                unknown.append((f, "두 그림 저장소(%s·%s)에 같은 이름이 있다 — 한쪽만 둔다" % (SHARDS[owner[f]], SHARDS[i])))
                continue
            owner[f] = i
    # 못 받은 저장소에 적힌 그림이 있으면 --prune 이 그것을 다 지운다. 아직 아무것도 안 올린 저장소(만들기 전 포함)면 잃을 것이 없다
    held = sorted({SHARDS[i] for i in (doc.get("where") or {}).values()
                   if isinstance(i, int) and 0 < i < len(SHARDS) and SHARDS[i] in missing})
    if held and a.prune:
        raise SystemExit("그림 저장소 %s 를 못 받았다 — 그 저장소 그림이 다 지워지므로 --prune 하지 않는다" % ", ".join(held))
    open_at = max([0] + [i + 1 for i, d in enumerate(EXTRA_DIRS) if os.path.isdir(d)])
    disk = set(owner)
    listed = listed_files(img)

    added = []
    for f in sorted(disk - listed):
        if SKIP.match(f):
            continue
        if owner[f] < open_at:
            unknown.append((f, "닫힌 그림 저장소 %s 에 새 그림 — 새 그림은 %s 에 올린다(이미 있는 이름의 교체만 닫힌 저장소에 둔다)"
                            % (SHARDS[owner[f]], SHARDS[open_at])))
            continue
        m = PAT.match(f)
        if not m:
            unknown.append((f, "이름 꼴이 안 맞는다(<도시>_<세계>_<화풍>_f.webp · <도시>_<세계>_<화풍>_f_casualN.webp — 소문자, 성별은 _f 만)"))
            continue
        head, style = split_style(m.group(1), styles)
        head, form = split_form(head, forms)
        city = head if head in known else None
        if not city:
            unknown.append((f, "그런 도시가 없다 — 도시 열쇠·세계 열쇠·화풍 열쇠 중에 잘못된 것이 있다(<도시>_<세계>_<화풍>_f.webp · 도시 열쇠는 소문자 영문)"))
            continue
        if not style:
            unknown.append((f, "화풍 열쇠가 없다 — <도시>_<세계>_<화풍>_f.webp 꼴이어야 한다"))
            continue
        if not form:
            unknown.append((f, "세계 열쇠가 없다 — <도시>_<세계>_<화풍>_f.webp 꼴이어야 한다(fantasy · steampunk · cyberpunk)"))
            continue
        # 세계 몫 — 세계 그림과, 그 그림을 참고 그림으로 붙인 일상컷
        e = img.setdefault(city, {}).setdefault("byStyle", {}).setdefault(style, {}).setdefault("byForm", {}).setdefault(form, {})
        if m.group(2) is None:
            if e.get("f"):
                unknown.append((f, "세계 그림 슬롯 중복: " + e["f"]))
                continue
            e["f"] = f
            cut = ""
        else:
            n = int(m.group(2))
            if n < 1:
                unknown.append((f, "컷 번호는 1 이상이어야 한다"))
                continue
            lst = e.setdefault("casual", {}).setdefault("f", [])
            # 번호가 같으면 0 을 앞에 붙인 철자(casual02)도 같은 자리다
            collision = next((x for x in lst if re.search(r"_casual0*" + str(n) + r"\.webp$", x)), None)
            if collision:
                unknown.append((f, "컷 슬롯 중복: " + collision))
                continue
            lst.append(f)
            lst.sort(key=lambda x: int(re.search(r"_casual(\d+)\.webp$", x).group(1)))
            cut = " · casual" + str(n)
        added.append((city + " · " + styles[style] + " · " + form + cut, f))

    # 자리를 메우려고 넣은 빈 칸은 도로 걷어낸다
    for e in buckets(img):
        for slot in ("casual", "extra"):
            if slot not in e:
                continue
            box = shots(e, slot)
            box = {g: [x for x in lst if x] for g, lst in box.items()}
            box = {g: lst for g, lst in box.items() if lst}
            if box:
                e[slot] = {g: box[g] for g in ("f", "m") if g in box}
            else:
                del e[slot]

    ghosts = sorted(listed_files(img) - disk)
    if a.prune and ghosts:
        gone = set(ghosts)
        for e in buckets(img):
            for k in ("m", "f"):
                if e.get(k) in gone:
                    del e[k]
            for k in ("casual", "extra"):
                if k not in e:
                    continue
                box = {g: [x for x in lst if x not in gone]
                       for g, lst in shots(e, k).items()}
                box = {g: lst for g, lst in box.items() if lst}
                if box:
                    e[k] = box
                else:
                    del e[k]

    # 그림이 다 빠진 세계 칸·화풍 칸은 남겨봐야 하나 더 있는 것처럼 보인다(세계 칸은 세계 그림도 일상컷도 없을 때)
    for v in img.values():
        bs = v.get("byStyle")
        if bs is None:
            continue
        for b in bs.values():
            bf = b.get("byForm")
            if bf is not None:
                for k in [k for k, x in bf.items() if not x or not any(x.get(s) for s in ("m", "f", "casual"))]:
                    del bf[k]
                if not bf:
                    del b["byForm"]
        for k in [k for k, b in bs.items() if not b]:
            del bs[k]
        if not bs:
            del v["byStyle"]

    img = {k: v for k, v in img.items() if v}      # 그림이 다 빠진 도시 칸도 지운다
    tidy(img, styles, forms)
    # 등록한 날 — 적혀 있는 그림만 남긴다(--prune 으로 빠진 그림은 날짜도 빠진다). 새로 적힌 것만 오늘
    final = listed_files(img)
    dates = {f: d for f, d in (doc.get("added") or {}).items()
             if f in final and isinstance(d, str) and DATE.match(d)}
    stamp = today()
    for _, f in added:
        dates.setdefault(f, stamp)
    filled = 0
    if a.backfill_added:
        for f, d in history_dates(a.backfill_added).items():
            if f in final and f not in dates:
                dates[f] = d
                filled += 1
    if dates or "added" in doc:
        doc["added"] = dict(sorted(dates.items()))
    # 저장소 자리 — 0 번이 아닌 것만. 못 받은 저장소의 그림·파일이 없어진 그림은 --prune 전에는 자리를 남긴다
    # (지우면 주소가 0 번으로 돌아가 404 가 된다). 등록 안 하는 화풍 견본(style-)도 적는다 — 생성기가 그린다
    where = {f: i for f, i in owner.items() if i > 0}
    if not a.prune:
        for f, i in (doc.get("where") or {}).items():
            if f not in owner and isinstance(i, int) and 0 < i < len(SHARDS):
                where[f] = i
    if where or "where" in doc:
        doc["where"] = dict(sorted(where.items()))
    doc["img"] = dict(sorted(img.items()))
    doc["count"] = len(img)
    if not a.check and not unknown:
        write("img", doc)

    print("[%s] data/img.json · 도시 %d · 파일 %d"
          % ("검증 실패·저장 안 함" if unknown else ("대조" if a.check else "완료"), len(img), len(listed_files(img))))
    print("  그림 저장소: " + " · ".join("%s %d" % (SHARDS[i], sum(1 for v in owner.values() if v == i))
                                        for i in range(len(SHARDS)) if i == 0 or i <= len(EXTRA_DIRS))
          + " · 새 그림은 %s" % SHARDS[open_at] + (" · 못 받은 저장소 " + ", ".join(missing) if missing else ""))
    print("  등록 후보 %d%s" % (len(added), " — 오류로 저장 안 함" if unknown else ""))
    print("  등록한 날 %d / %d%s" % (len(dates), len(final),
                                ((" · 이력에서 채움 %d" % filled) if a.backfill_added else "")))
    for card, f in added[:20]:
        print("     %-32s %s" % (card, f))
    if ghosts:
        print("  적혀 있는데 파일이 없는 것 %d%s"
              % (len(ghosts), " (지웠다)" if a.prune and not a.check else " — --prune 으로 지운다"))
        for f in ghosts[:10]:
            print("     %s" % f)
    if unknown:
        print("  등록 못 한 파일 %d" % len(unknown))
        for f, why in unknown:
            print("     %-44s %s" % (f, why))
    odd = art_size([IMG_DIR] + [d for d in EXTRA_DIRS if os.path.isdir(d)])
    if odd:
        print("  새로 들어왔는데 %d×%d 이 아닌 그림 %d"
              % (ART_SIZE[0], ART_SIZE[1], len(odd)))
        for name, w, h in odd[:10]:
            print("     %-44s %d×%d" % (name, w, h))
    if missing and os.environ.get("GITHUB_ACTIONS"):
        print("::warning::그림 저장소 %s 를 못 받았다 — 그쪽 자리는 그대로 두고, 새 그림은 %s 로 받는다" % (", ".join(missing), SHARDS[open_at]))
    annotate(added, ghosts, unknown, a.prune and not a.check and not unknown, odd)
    if unknown:
        raise SystemExit(1)


def annotate(added, ghosts, unknown, pruned, odd=()):
    """GitHub Actions 로 돌 때는 실행 화면에도 남긴다.

    등록 못 한 파일이 있으면 저장하지 않고 실패한다. 실행 요약에 원인을 모두 남긴다."""
    if not os.environ.get("GITHUB_ACTIONS"):
        return
    for f, why in unknown:
        print("::error file=%s::그림을 등록하지 못했다 — %s" % (f, why))
    for f in ghosts:
        print("::warning::%s 가 img.json 에 적혀 있는데 파일이 없다%s"
              % (f, " (지웠다)" if pruned else " — --prune 으로 지운다"))
    for name, w, h in odd:
        print("::warning file=%s::%d×%d 로 들어왔다 — 그림 규격은 %d×%d 다."
              " 일상컷처럼 일부러 다른 꼴이면 그냥 두라"
              % (name, w, h, ART_SIZE[0], ART_SIZE[1]))
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as f:
        f.write("### 그림 등록\n\n")
        f.write("- 새로 등록 **%d**\n" % len(added))
        for card, name in added:
            f.write("  - `%s` ← %s\n" % (card, name))
        if unknown:
            f.write("- 등록 못 한 파일 **%d** — 도시 열쇠 · 세계 · 화풍 · 성별 표시와 파일 이름이 맞는지 본다\n"
                    % len(unknown))
            for name, why in unknown:
                f.write("  - `%s` — %s\n" % (name, why))
        if ghosts:
            f.write("- 적혀 있는데 파일이 없는 것 **%d**\n" % len(ghosts))
        if odd:
            f.write("- 규격(%d×%d) 밖으로 들어온 그림 **%d** — 일부러 그런 것인지 본다\n"
                    % (ART_SIZE[0], ART_SIZE[1], len(odd)))
            for name, w, h in odd:
                f.write("  - `%s` — %d×%d\n" % (name, w, h))


if __name__ == "__main__":
    main()
