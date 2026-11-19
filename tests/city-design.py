#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""설계표 검사기가 규칙마다 제대로 거는지 — 진짜 표는 통과하고, 망가뜨린 사본은 걸린다.
    python -I -X utf8 tests/city-design.py"""
import copy
import importlib.util
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location("city_design", os.path.join(ROOT, "tools", "city-design.py"))
cd = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cd)

with open(os.path.join(ROOT, "data", "city-design.json"), encoding="utf-8") as f:
    doc = json.load(f)
errs, warns = cd.check(doc)
assert not errs, "진짜 설계표가 걸린다:\n" + "\n".join(errs)


def broken(mut):
    d = copy.deepcopy(doc)
    mut(d)
    return cd.check(d)[0]


def city(d, k):
    return [c for c in d["cities"] if c["key"] == k][0]


def sw(d, w):
    return city(d, "seoul")["worlds"][w]


cases = {
    "세계 열쇠가 셋이 아님": lambda d: d["vocab"].__setitem__("worlds", ["fantasy", "steampunk", "mecha"]),
    "세계 열쇠 넷": lambda d: d["vocab"]["worlds"].append("mecha"),
    "서울 세계 하나 빠짐": lambda d: city(d, "seoul")["worlds"].pop("cyberpunk"),
    "서울 모르는 세계": lambda d: city(d, "seoul")["worlds"].__setitem__("mecha", sw(d, "fantasy")),
    "lat 범위 밖": lambda d: city(d, "tokyo").__setitem__("lat", 95.0),
    "lon 범위 밖": lambda d: city(d, "rio").__setitem__("lon", -190.0),
    "lat 소수 셋째 자리": lambda d: city(d, "paris").__setitem__("lat", 48.856),
    "latlon_src 빔": lambda d: city(d, "cairo").__setitem__("latlon_src", ""),
    "상징 src 빔": lambda d: city(d, "paris")["symbols"][0].__setitem__("src", ""),
    "상징 둘뿐": lambda d: city(d, "rome").__setitem__("symbols", city(d, "rome")["symbols"][:2]),
    "palette hex 꼴": lambda d: city(d, "london")["palette"].__setitem__("hex", ["#zzz", "#112233"]),
    "서울 머리색 겹침": lambda d: sw(d, "steampunk")["look"]["silhouette"].__setitem__("hair_color", sw(d, "fantasy")["look"]["silhouette"]["hair_color"]),
    "서울 체형 겹침": lambda d: sw(d, "cyberpunk")["look"]["silhouette"].__setitem__("body", sw(d, "fantasy")["look"]["silhouette"]["body"]),
    "서울 look.why 빔": lambda d: sw(d, "fantasy")["look"].__setitem__("why", ""),
    "서울 scenes 둘": lambda d: sw(d, "steampunk")["scenes"].pop(),
    "서울 scenes 넷": lambda d: sw(d, "fantasy")["scenes"].append(dict(sw(d, "fantasy")["scenes"][0], key="extra")),
    "motif 없음": lambda d: sw(d, "cyberpunk").pop("motif"),
    "motif.en 에 한국어": lambda d: sw(d, "fantasy")["motif"].__setitem__("en", sw(d, "fantasy")["motif"]["en"] + " 단청"),
    "hold 없음": lambda d: sw(d, "fantasy").pop("hold"),
    "열쇠 10개가 목록과 다름": lambda d: city(d, "rio").__setitem__("key", "sydney"),
    "도시 아홉": lambda d: d["cities"].pop(),
    "판타지에 지금 물건": lambda d: sw(d, "fantasy").__setitem__("en", sw(d, "fantasy")["en"] + ", a woman checking her smartphone"),
    "스팀펑크 장면에 네온": lambda d: sw(d, "steampunk")["scenes"][0].__setitem__("en", sw(d, "steampunk")["scenes"][0]["en"] + " under a neon sign"),
    "스팀펑크 금지에 neon 없음": lambda d: d["vocab"]["markers"]["steampunk"].__setitem__("banned_en", [w for w in d["vocab"]["markers"]["steampunk"]["banned_en"] if "neon" not in w]),
    "사이버펑크 금지 낱말 있음": lambda d: d["vocab"]["markers"]["cyberpunk"].__setitem__("banned_en", ["sword"]),
    "표지 다섯": lambda d: d["vocab"]["markers"]["fantasy"].__setitem__("en", d["vocab"]["markers"]["fantasy"]["en"][:5]),
    "표지 ko · en 수 다름": lambda d: d["vocab"]["markers"]["steampunk"]["ko"].pop(),
    "옷 말투 빠짐": lambda d: d["vocab"]["wear"]["cyberpunk"].pop("moderate"),
}
for name, mut in cases.items():
    assert broken(mut), "검사기가 못 걸었다: " + name

print("PASS 설계표 검사기: 진짜 표 통과 · 망가뜨린 %d가지 다 걸림" % len(cases))
