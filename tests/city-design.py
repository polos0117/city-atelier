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


def lm(d, w=None):
    h = city(d, "seoul")["landmarks"][0]
    return h if w is None else h["worlds"][w]


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
    "짧은 말 look 빔": lambda d: sw(d, "fantasy")["card_ko"].__setitem__("look", ""),
    "짧은 말 칸 없음": lambda d: sw(d, "steampunk").pop("card_ko"),
    "짧은 말 motif 김": lambda d: sw(d, "cyberpunk")["card_ko"].__setitem__("motif", "네온 송신탑 귀걸이 · 해치 문신 · 빛줄 비옷 · 긴 손톱"),
    "상징 한 줄 없음": lambda d: city(d, "seoul").pop("card_ko"),
    "상징 한 줄 지어냄": lambda d: city(d, "seoul")["card_ko"].__setitem__("symbols", "경복궁 · 없는 탑"),
    "도시 people 없음": lambda d: city(d, "tokyo").pop("people"),
    "도시 people.en 빔": lambda d: city(d, "paris")["people"].__setitem__("en", ""),
    "도시 people.en 한국어": lambda d: city(d, "rio")["people"].__setitem__("en", "브라질인"),
    "서울 얼굴 칸 하나만 다름": lambda d: [sw(d, "cyberpunk")["look"]["face"].__setitem__(f, sw(d, "fantasy")["look"]["face"][f]) for f in ("eyes", "brows", "nose", "lips")],
    "서울 얼굴 칸 둘만 다름": lambda d: [sw(d, "steampunk")["look"]["face"].__setitem__(f, sw(d, "fantasy")["look"]["face"][f]) for f in ("eyes", "nose", "lips")],
    "옷 말투 빠짐": lambda d: d["vocab"]["wear"]["cyberpunk"].pop("moderate"),
    "일상컷 세계 결 빠짐": lambda d: d["vocab"]["casual_world"]["fantasy"].pop("guard_en"),
    "일상컷 세계 결에 금지 낱말": lambda d: d["vocab"]["casual_world"]["steampunk"].update(en="a gaslamp city of polished brass and glass, warm gaslight and soot on every sill"),
    "미정 도시에 랜드마크": lambda d: (city(d, "rio").__setitem__("worlds", {}), city(d, "rio").__setitem__("landmarks", [dict(lm(d), key="x")])),   # 2026-11-21 리우까지 열 곳이 다 설계돼 사본에서 리우를 미정({})으로 되돌려 본다
    "own_vocab.unban_en 에 금지 낱말 밖의 말": lambda d: city(d, "beijing")["worlds"]["fantasy"]["own_vocab"]["unban_en"].append("Forbidden City"),
    "랜드마크 열쇠에 -": lambda d: lm(d).__setitem__("key", "hae-chi"),
    "랜드마크 세계 둘뿐": lambda d: lm(d)["worlds"].pop("cyberpunk"),
    "랜드마크 판타지 글에 broadcast tower": lambda d: lm(d, "fantasy").__setitem__("en", lm(d, "fantasy")["en"] + ", beside a broadcast tower"),
    "해치 판타지 얼굴이 서울 판타지와 같음": lambda d: lm(d, "fantasy")["look"].__setitem__("face", dict(sw(d, "fantasy")["look"]["face"])),
}
for name, mut in cases.items():
    assert broken(mut), "검사기가 못 걸었다: " + name
# 미정 도시(worlds {})는 그것만으로는 오류가 아니다(알림) — 위 「미정 도시에 랜드마크」 가 랜드마크 규칙으로 걸린 것인지 본다
assert not broken(lambda d: (city(d, "rio").__setitem__("worlds", {}), city(d, "rio").pop("landmarks", None))), "설계 미정 도시 하나가 오류로 걸린다"   # 2026-11-21 리우에도 랜드마크가 생겨 같이 비운다

print("PASS 설계표 검사기: 진짜 표 통과 · 망가뜨린 %d가지 다 걸림" % len(cases))
