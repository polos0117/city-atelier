/* 이미지 작업 잠금(tools/image-claim.cjs) — 몫은 도시 단위. 실제 bare 저장소 둘로: 잡기 · 겹쳐 잡기 거절 · 실행마다 하나 · 멈춤 · 끝은 빈 자리가 없어야 ·
   다른 세션이 먼저 밀면 push 거절 뒤 제 커밋을 되돌린다 · 하루 몫. 서울(설계된 유일한 도시)의 빈 자리는 실제 자료로 본다. node tests/image-claim.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), cp = require('node:child_process');
const TOOL = path.join(__dirname, '..', 'tools', 'image-claim.cjs'), K = require(TOOL);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'image-claim-'));
/* 실제 자료: 설계된 도시는 서울 하나라 빈 자리는 세계 셋 × (세계 그림 1 + 일상컷 7) = 24, 이름은 <도시>_<세계>_<화풍>_f[_casualN].webp */
{
  const st = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'style.json'), 'utf8'))['default'];
  const m = K.missing('seoul');
  assert.equal(m.length, 24, '서울 빈 자리 24');
  for (const w of ['fantasy', 'steampunk', 'cyberpunk']) {
    assert(m.includes(`seoul_${w}_${st}_f.webp`), w + ' 세계 그림');
    for (let n = 1; n <= 7; n++) assert(m.includes(`seoul_${w}_${st}_f_casual${n}.webp`), `${w} 일상컷 ${n}`);
  }
  assert.deepEqual(K.order().map(x => x.key), ['seoul', 'tokyo', 'beijing', 'paris', 'london', 'rome', 'newyork', 'istanbul', 'cairo', 'rio'], '설계표 차례');
  assert.equal(K.missing('tokyo').length, 0, '설계 미정 도시는 빈 자리 없음(건너뛴다)');
  assert.equal(K.nextOf({}).key, 'seoul', '다음 차례는 서울');
  /* 캐릭터만의 컷(casual90)은 일상 일곱에 세지 않는다 */
  assert.equal(K.casualGap('seoul', st, [`seoul_fantasy_${st}_f_casual90.webp`], 7).length, 7);
  assert.deepEqual(K.casualGap('seoul', st, ['x_casual1.webp', 'x_casual2.webp', 'x_casual4.webp'], 5), [3, 5]);
}
/* 시험 자료 — 빈 자리가 있는 도시가 셋은 있어야 시험이 된다. 설계표 복사본에서 도쿄 · 베이징에도 서울의 세계 셋을 붙인다(검사용, 저장소 자료는 안 건드림) */
const dataRoot = path.join(tmp, 'root'); fs.mkdirSync(path.join(dataRoot, 'data'), { recursive: true });
for (const f of ['style.json', 'img.json']) fs.copyFileSync(path.join(__dirname, '..', 'data', f), path.join(dataRoot, 'data', f));
{
  const D = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'city-design.json'), 'utf8'));
  const seoul = D.cities.find(c => c.key === 'seoul');
  for (const k of ['tokyo', 'beijing']) D.cities.find(c => c.key === k).worlds = JSON.parse(JSON.stringify(seoul.worlds));
  fs.writeFileSync(path.join(dataRoot, 'data', 'city-design.json'), JSON.stringify(D));
}
process.env.CITY_DATA_ROOT = dataRoot;
const git = (d, ...a) => cp.execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const run = (img, ...a) => { const r = cp.spawnSync('node', [TOOL, ...a, '--img', img], { encoding: 'utf8' }); return { code: r.status, out: r.stdout + r.stderr }; };
try {
  const bare = path.join(tmp, 'img.git');
  cp.execFileSync('git', ['init', '-q', '--bare', '-b', 'main', bare]);
  const clone = name => { const d = path.join(tmp, name); cp.execFileSync('git', ['clone', '-q', bare, d], { stdio: 'ignore' });
    git(d, 'config', 'user.name', 'T'); git(d, 'config', 'user.email', 't@example.invalid'); git(d, 'checkout', '-q', '-B', 'main'); return d; };
  const a = clone('a');
  fs.writeFileSync(path.join(a, 'README.md'), 'x\n'); git(a, 'add', '.'); git(a, 'commit', '-q', '-m', 'init'); git(a, 'push', '-q', 'origin', 'main');
  const b = clone('b');
  const todo = K.order().filter(x => K.missing(x.key).length).map(x => x.key);
  assert(todo.length >= 3, '빈 자리가 있는 도시가 셋은 있어야 시험이 된다');
  const [x, y, z] = todo;
  assert.equal(JSON.parse(run(a, 'next').out).next, x, 'next — 차례대로 첫 빈 도시');

  let r = run(a, 'claim', x, '--execution', 'e1');
  assert.equal(r.code, 0, r.out);
  assert.equal(git(a, 'rev-parse', 'HEAD'), git(a, 'ls-remote', 'origin', 'refs/heads/main').split(/\s/)[0], '일반 push 됐다');
  /* 실행마다 몫 — 있으면 둘째를 못 잡고, 없으면(원소) 잡는다 */
  if (K.EXECUTION_MAX) assert.match(run(a, 'claim', y, '--execution', 'e1').out, /실행마다 1개/);
  else { r = run(a, 'claim', y, '--execution', 'e1'); assert.equal(r.code, 0, r.out); r = run(a, 'release', y, '--execution', 'e1', '--approval', '시험 — 둘째도 잡히는지만'); assert.equal(r.code, 0, r.out); }
  git(b, 'pull', '-q', 'origin', 'main');
  assert.match(run(b, 'claim', x, '--execution', 'e2').out, /이미 잡혀 있다/);
  assert.equal(JSON.parse(run(b, 'next').out).next, y, '잡힌 것은 건너뛴다');

  /* 경합 — b 가 먼저 밀었는데 a 는 옛 받기로 잡으려 한다: 받기가 다르면 멈추고, 받은 뒤 push 가 밀리면 되돌린다 */
  r = run(b, 'claim', y, '--execution', 'e2'); assert.equal(r.code, 0, r.out);
  assert.match(run(a, 'claim', z, '--execution', 'e3').out, /origin\/main 과 다르다/);
  git(a, 'pull', '-q', 'origin', 'main');
  const head = git(a, 'rev-parse', 'HEAD');
  git(b, 'commit', '-q', '--allow-empty', '-m', 'other'); git(b, 'push', '-q', 'origin', 'main');
  /* a 의 받기를 b 의 push 바로 앞으로 맞춘 채 push 만 밀리게 — fetch 를 막으려 origin 을 b 의 push 전 사본으로 돌렸다가 되돌린다 */
  const stale = path.join(tmp, 'stale.git'); cp.execFileSync('git', ['clone', '-q', '--bare', bare, stale]); git(stale, 'update-ref', 'refs/heads/main', head);
  git(a, 'remote', 'set-url', 'origin', stale); git(a, 'fetch', '-q', 'origin');
  git(a, 'remote', 'set-url', '--push', 'origin', bare);
  r = run(a, 'claim', z, '--execution', 'e3');
  assert.equal(r.code, 1); assert.match(r.out, /push 가 거절됐다/);
  assert.equal(git(a, 'rev-parse', 'HEAD'), head, '제 커밋을 되돌렸다');
  assert(!fs.existsSync(path.join(a, 'records/automation/claims', z + '.json')), '잠금 파일도 지웠다');
  assert.equal(git(a, 'status', '--porcelain'), '', '작업 트리가 깨끗하다');
  git(a, 'remote', 'set-url', 'origin', bare); git(a, 'remote', 'set-url', '--push', 'origin', bare); git(a, 'pull', '-q', 'origin', 'main');

  /* 멈춤 · 끝 */
  assert.match(run(a, 'block', x, '--execution', 'e9', '--reason', 'r').out, /이 실행이 잡고 있지 않다/);
  r = run(a, 'block', x, '--execution', 'e1', '--reason', '안전 거절 두 번 — 같은 지시문'); assert.equal(r.code, 0, r.out);
  assert.match(run(a, 'claim', x, '--execution', 'e4').out, /이미 잡혀 있다\(blocked/);
  assert.match(run(a, 'done', y, '--execution', 'e2').out, /아직 빈 자리/);
  assert.match(run(a, 'done', x, '--execution', 'e1').out, /아직 빈 자리|멈춰 있다/);
  assert.match(run(a, 'release', x, '--execution', 'e6').out, /--approval/);
  r = run(a, 'release', x, '--execution', 'e6', '--approval', '사용자 「다시 해」'); assert.equal(r.code, 0, r.out);
  assert.equal(JSON.parse(run(a, 'next').out).next, x, '푼 것은 다시 차례에 든다');

  /* 하루 몫 — 오늘 잡은 것이 열둘이면 더 못 잡는다 */
  const now = new Date(), kst = new Date(now.getTime() + 9 * 3600e3).toISOString().slice(0, 10), utc = now.toISOString().slice(0, 10);
  const dir = path.join(a, 'records/automation/claims');
  for (let i = 0; i < (K.DAILY_MAX || 12); i++) fs.writeFileSync(path.join(dir, 'old' + i + '.json'), JSON.stringify({ key: 'old' + i, runs: [{ key: 'old' + i, execution: 'o' + i, status: 'complete', date_kst: kst, date_utc: utc }] }));
  git(a, 'add', '.'); git(a, 'commit', '-q', '-m', 'full day'); git(a, 'push', '-q', 'origin', 'main');
  if (K.DAILY_MAX) assert.match(run(a, 'claim', z, '--execution', 'e5').out, /오늘 몫\(12\)을 다 썼다/);
  else { r = run(a, 'claim', z, '--execution', 'e5'); assert.equal(r.code, 0, '몫이 없으면 열둘 뒤에도 잡는다 ' + r.out); }
  console.log(`PASS 이미지 작업 잠금: 잡기 · 겹침 · 실행마다 하나 · push 경합 되돌림 · 멈춤 · 끝 검사 · 하루 몫 (${x} · ${y} · ${z})`);
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
