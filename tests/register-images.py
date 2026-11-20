"""그림 등록 — 도시의 세계 그림과 일상컷이 제자리에, 틀린 이름은 저장하지 않고 실패. 원소 공방의 같은 검사에서 왔다(2026-10-30 → 도시 꼴 2026-11-19). python3 tests/register-images.py"""
import contextlib, copy, importlib.util, io, json, os, subprocess, sys, tempfile
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
spec = importlib.util.spec_from_file_location('register_images', ROOT / 'tools' / 'register-images.py')
reg = importlib.util.module_from_spec(spec); spec.loader.exec_module(reg)

# 실제 자료의 열쇠를 쓴다 — 설계표·화풍 기록과 등록기가 같은 말을 하는지도 같이 본다
worlds = reg.world_keys()
styles = reg.style_names()
cities = reg.cities()
assert worlds == ['fantasy', 'steampunk', 'cyberpunk'], worlds
assert set(styles) >= {'kr_drawn_rim_dewy', 'painterly_concept', 'real_oil'}, styles
# 카드 열쇠 = 도시 열 + 설계표의 랜드마크(<도시>-<랜드마크>) — 수를 박지 않는다(2026-11-20 랜드마크 넷을 더하자 「11」 이 깨져 그림 등록이 실패했다)
_design = json.load(open(os.path.join(ROOT, 'data', 'city-design.json'), encoding='utf-8'))
_want = [k for c in _design['cities'] for k in [c['key']] + [c['key'] + '-' + l['key'] for l in c.get('landmarks') or []]]
assert cities == _want and cities[:2] == ['seoul', 'seoul-haechi'] and 'newyork' in cities, cities
assert 'zz' not in cities and 'new_york' not in cities and all(c == c.lower() and '_' not in c for c in cities), '도시 열쇠는 소문자 영문, 밑줄 없음'
S = 'painterly_concept'


real_read = reg.read


def run(doc, folder, argv=(), day='2026-11-19'):
    """img.json 만 바꿔 끼우고 설계표·화풍 기록은 실제 것을 읽는다. 매번 새로 읽어 앞 차례가 고친 것이 새지 않게"""
    out = io.StringIO()
    with patch.object(reg, 'IMG_DIR', folder), patch.object(reg, 'EXTRA_DIRS', []), patch.object(reg, 'today', return_value=day), \
         patch.object(reg, 'read', side_effect=lambda n: copy.deepcopy(doc) if n == 'img' else real_read(n)), \
         patch.object(reg, 'art_size', return_value=[]), \
         patch.object(reg, 'write') as write, \
         patch.object(sys, 'argv', ['register-images.py', *argv]), contextlib.redirect_stdout(out):
        try:
            reg.main(); code = 0
        except SystemExit as e:
            code = e.code
    return code, (write.call_args[0][1] if write.called else None), out.getvalue()


with tempfile.TemporaryDirectory() as d:
    # 서울은 세계 셋, 도쿄는 한 세계 — 도시 열쇠(소문자 영문)가 카드로 읽혀야 한다
    seoul = {w: f'seoul_{w}_{S}_f.webp' for w in worlds}
    tokyo = f'tokyo_fantasy_{S}_f.webp'
    # 일상컷은 세계를 탄다(그 세계 그림이 참고 그림) — 세계 몫 안의 casual. 90 번은 캐릭터만의 컷(같은 꼴)
    cas = [f'seoul_cyberpunk_{S}_f_casual2.webp', f'seoul_cyberpunk_{S}_f_casual1.webp', f'seoul_cyberpunk_{S}_f_casual90.webp',
           f'seoul_fantasy_{S}_f_casual1.webp', f'tokyo_fantasy_{S}_f_casual1.webp']
    for n in [*seoul.values(), tokyo, *cas, 'style-sample.webp']:
        (Path(d) / n).touch()
    code, saved, out = run({'img': {}, 'added': {}}, d)
    assert code == 0 and saved, out
    se = saved['img']['seoul']['byStyle'][S]
    assert {k: v['f'] for k, v in se['byForm'].items()} == seoul, se
    assert list(se['byForm']) == ['fantasy', 'steampunk', 'cyberpunk'], '세계 차례'
    assert se['byForm']['cyberpunk']['casual']['f'] == [cas[1], cas[0], cas[2]], ('번호 차례(90 은 맨 뒤)', se)
    assert se['byForm']['fantasy']['casual']['f'] == [cas[3]] and 'casual' not in se, '일상컷은 세계 몫 안에만'
    assert saved['img']['tokyo']['byStyle'][S]['byForm'] == {'fantasy': {'f': tokyo, 'casual': {'f': [cas[4]]}}}
    assert saved['count'] == 2 and 'where' not in saved, saved.keys()
    assert sorted(saved['added']) == sorted([*seoul.values(), tokyo, *cas]) and set(saved['added'].values()) == {'2026-11-19'}
    # 다시 돌려도 겹치지 않는다
    code, again, out = run(saved, d)
    assert code == 0 and reg.listed_files(again['img']) == set([*seoul.values(), tokyo, *cas]), out
    # 세계 그림 없이 일상컷만 있는 세계 칸도 산다(참고 그림은 그림 저장소 밖에 있을 수 있다); --prune 으로 일상컷이 빠지면 칸도 빠진다
    extra = f'rome_steampunk_{S}_f_casual1.webp'
    (Path(d) / extra).touch()
    code, s_c, out = run(saved, d)
    assert code == 0 and s_c['img']['rome']['byStyle'][S]['byForm'] == {'steampunk': {'casual': {'f': [extra]}}}, out
    (Path(d) / extra).unlink()
    code, s_p, out = run(s_c, d, ['--prune'])
    assert code == 0 and 'rome' not in s_p['img'], out

    # 랜드마크 카드 열쇠 <도시>-<랜드마크> — 도시와 같은 꼴로 들어간다, 없는 랜드마크는 도시가 없다
    lm, lc = f'seoul-haechi_fantasy_{S}_f.webp', f'seoul-haechi_fantasy_{S}_f_casual1.webp'
    for n in (lm, lc): (Path(d) / n).touch()
    code, s_l, out = run(saved, d)
    assert code == 0 and s_l['img']['seoul-haechi']['byStyle'][S]['byForm'] == {'fantasy': {'f': lm, 'casual': {'f': [lc]}}}, out
    for n in (lm, lc): (Path(d) / n).unlink()
    (Path(d) / f'seoul-nope_fantasy_{S}_f.webp').touch()
    code, s2, out = run(saved, d)
    assert code == 1 and s2 is None and '그런 도시가 없다' in out, out
    (Path(d) / f'seoul-nope_fantasy_{S}_f.webp').unlink()

    (Path(d) / f'seoul-haechi_fantasy_{S}_f_casual90.webp').touch()
    code, s3, out = run(saved, d)
    assert code == 1 and s3 is None and '90번' in out, out
    (Path(d) / f'seoul-haechi_fantasy_{S}_f_casual90.webp').unlink()

    # 틀린 이름은 하나라도 있으면 아무것도 저장하지 않는다
    for bad, why in [(f'seoul_mecha_{S}_f.webp', '그런 도시가 없다'),            # 없는 세계(원소의 mecha) → 도시 이름으로 읽혀 실패
                     (f'seoul_modern_{S}_f.webp', '그런 도시가 없다'),
                     (f'zz_fantasy_{S}_f.webp', '그런 도시가 없다'),              # 없는 도시
                     (f'new_york_fantasy_{S}_f.webp', '그런 도시가 없다'),        # 밑줄 낀 도시 이름 — 열쇠는 newyork
                     (f'seoulx_fantasy_{S}_f.webp', '그런 도시가 없다'),          # 도시 오타
                     (f'seoul_fantasy_watercolor_f.webp', '그런 도시가 없다'),     # 없는 화풍 → 도시 이름으로 읽혀 실패
                     (f'seoul_fantasy_{S}.webp', '이름 꼴'),                      # 성별 표시 없음
                     (f'seoul_fantasy_{S}_m.webp', '이름 꼴'),                    # 남성 표시
                     (f'Tokyo_steampunk_{S}_f.webp', '그런 도시가 없다'),        # 대문자 도시
                     (f'seoul_{S}_f.webp', '세계 열쇠가 없다'),                    # 세계 없는 세계 그림
                     (f'seoul_{S}_f_casual1.webp', '세계 열쇠가 없다'),            # 세계 없는 일상컷(옛 시안 꼴은 없다)
                     (f'seoul_fantasy_{S}_f_extra1.webp', '이름 꼴'),             # 특별컷은 없다
                     (f'seoul_fantasy_{S}_f_action1.webp', '이름 꼴'),            # 연출컷은 없다
                     (f'seoul_fantasy_{S}_f_casual0.webp', '컷 번호는 1 이상'),
                     (f'seoul_fantasy_{S}_f_casualx.webp', '이름 꼴'),
                     (f'seoul_fantasy.webp', '이름 꼴')]:
        p = Path(d) / bad; p.touch()
        code, s2, out = run(saved, d)
        assert code == 1 and s2 is None and why in out, (bad, out)
        p.unlink()
    # 같은 자리 둘
    (Path(d) / f'seoul_cyberpunk_{S}_f_casual02.webp').touch()
    code, s2, out = run({'img': {}}, d)
    assert code == 1 and '중복' in out, out

# 등록한 날(added) — 새로 적힌 것만 오늘, 있던 날짜는 그대로, 날짜를 지어내지 않는다
with tempfile.TemporaryDirectory() as d:
    a1, a2, a3 = (f'paris_{w}_{S}_f.webp' for w in ('fantasy', 'steampunk', 'cyberpunk'))
    (Path(d) / a1).touch()
    code, s1, out = run({'img': {}}, d, day='2026-10-10')
    assert code == 0 and s1['added'] == {a1: '2026-10-10'}, out
    code, s2, out = run(s1, d, day='2026-10-12')
    assert code == 0 and s2['added'] == {a1: '2026-10-10'}, ('다시 돌려도 날짜는 그대로', out)
    # 날짜 없이 적혀 있던 그림은 날짜 없이 남는다 — 오늘로 메우지 않는다
    old = copy.deepcopy(s1); old.pop('added')
    (Path(d) / a2).touch()
    code, s3, out = run(old, d, day='2026-10-12')
    assert code == 0 and s3['added'] == {a2: '2026-10-12'}, ('옛 그림은 날짜 없이', out)
    # 틀린 날짜는 버린다 · --check 는 쓰지 않는다
    bad = copy.deepcopy(s3); bad['added'][a1] = 'yesterday'
    code, s4, out = run(bad, d)
    assert code == 0 and a1 not in s4['added'] and s4['added'][a2] == '2026-10-12', out
    code, s5, out = run(s1, d, ['--check'])
    assert code == 0 and s5 is None and '등록한 날' in out and '[대조]' in out, out
    # 파일이 사라지면 --prune 때 날짜도 빠진다. --prune 이 아니면 자리와 날짜를 남긴다
    (Path(d) / a1).unlink()
    code, s6, out = run(s3 | {'added': {a1: '2026-10-10', a2: '2026-10-12'}}, d)
    assert code == 0 and s6['added'] == {a1: '2026-10-10', a2: '2026-10-12'}, out
    code, s7, out = run(s6, d, ['--prune'])
    assert code == 0 and s7['added'] == {a2: '2026-10-12'}, out
    assert list(s7['img']['paris']['byStyle'][S]['byForm']) == ['steampunk'], '빠진 세계 칸은 지운다'
    # 오류가 있으면 날짜도 저장하지 않는다
    (Path(d) / 'paris_fantasy_watercolor_f.webp').touch()
    code, s8, out = run(s7, d)
    assert code == 1 and s8 is None, out

# --backfill-added — 그림 저장소 git 이력에서 처음 더해진 날. 얕은 저장소면 더 받고, 그래도 잘린 경계의 날짜는 버린다
def sh(*args, cwd=None, date=None):
    env = dict(os.environ, GIT_AUTHOR_NAME='t', GIT_AUTHOR_EMAIL='t@t', GIT_COMMITTER_NAME='t', GIT_COMMITTER_EMAIL='t@t',
               GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM='1')
    if date:
        env.update(GIT_AUTHOR_DATE=date + 'T12:00:00+0000', GIT_COMMITTER_DATE=date + 'T12:00:00+0000')
    return subprocess.run(args, cwd=cwd, env=env, check=True, capture_output=True, text=True).stdout


with tempfile.TemporaryDirectory() as t:
    src = Path(t) / 'src'; (src / 'img').mkdir(parents=True)
    sh('git', 'init', '-q', '-b', 'main', cwd=src)
    b1, b2, b3 = (f'london_{w}_{S}_f.webp' for w in ('steampunk', 'cyberpunk', 'fantasy'))
    b4 = f'london_fantasy_{S}_f_casual1.webp'
    gone = f'london_fantasy_{S}_f_casual2.webp'
    for date, add, rm in [('2026-10-01', [b1, gone], []), ('2026-10-03', [b2], [gone]), ('2026-10-05', [b3], []), ('2026-10-07', [b4], [])]:
        for n in add:
            (src / 'img' / n).write_bytes(b'x')
        for n in rm:
            (src / 'img' / n).unlink()
        # 교체(같은 이름의 새 판)는 더하기가 아니다 — 날짜가 안 바뀐다
        if date == '2026-10-05':
            (src / 'img' / b1).write_bytes(b'y')
        sh('git', 'add', '-A', cwd=src); sh('git', 'commit', '-qm', date, cwd=src, date=date)
    hist = reg.history_dates(str(src))
    assert hist == {b1: '2026-10-01', b2: '2026-10-03', b3: '2026-10-05', b4: '2026-10-07', gone: '2026-10-01'}, hist
    # 가져온 날짜는 적힌 그림에만 · 이미 있는 날짜는 덮지 않는다 · 이력에 없는 그림은 날짜 없이
    folder = Path(t) / 'img'; folder.mkdir()
    for n in (b1, b2, b3, f'london_fantasy_{S}_f_casual3.webp'):
        (folder / n).touch()
    code, base, out = run({'img': {}}, str(folder))
    seeded = base | {'added': {b2: '2026-10-09'}}
    code, s9, out = run(seeded, str(folder), ['--backfill-added', str(src)])
    assert code == 0 and s9['added'] == {b1: '2026-10-01', b2: '2026-10-09', b3: '2026-10-05'}, (s9.get('added'), out)
    # 얕게 받은 저장소(워크플로의 체크아웃) — 더 받으면 끝까지 맞고, 더 못 받으면 잘린 경계 커밋은 날짜로 쓰지 않는다
    for name, deepen, want in [('deep', (200, 5000), hist),
                               ('edge', (200, 0), {b4: '2026-10-07'})]:
        clone = Path(t) / name
        sh('git', 'clone', '-q', '--depth', '2', 'file://' + str(src), str(clone))
        with patch.object(reg, 'DEEPEN', deepen[0]), patch.object(reg, 'DEEPEN_MAX', deepen[1]):
            got = reg.history_dates(str(clone))
        assert got == want, (name, got)
print('PASS 그림 등록: 서울 세 세계 · 도쿄 한 세계의 세계 그림(fantasy·steampunk·cyberpunk)·일상컷(90 번 포함) 자리 · 다시 돌려도 그대로'
      ' · 일상컷은 세계 몫 안 · 없는 세계(mecha)·도시·화풍·성별 표시·남성·대문자·밑줄 도시·세계 없는 그림·특별컷·연출컷·같은 자리는 저장 안 함'
      ' · 등록한 날(새 것만 오늘·있던 날짜 그대로·지어내지 않음·틀린 날짜 버림·--check·--prune) · git 이력 채우기(교체·지운 것·얕은 저장소 경계)')
