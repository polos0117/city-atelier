/* 지시문 묶음 = 생성기 화면 — tools/prompt-pack.cjs 가 쓴 기록의 저장값(storage)을 생성기에 넣으면 화면이 같은 지시문 · 같은 파일 이름을 만든다.
   도시 꼴(2026-11-19 Task 3): 서울 × 세 세계의 세계 그림 — 한 세계는 외형 · 장면 · 실루엣 · 노출 · 덧붙임을 고친 설정으로, 나머지는 기본 설정 그대로. 틀린 설정은 안 쓴다.
   일상 일곱 장(계획기 tools/casual-plan.cjs — 생활 장면표 · 세계 소품 사전)은 Task 4 가 이 검사에 다시 넣는다(docs/PORT_NOTES.md) — 지금은 계획 없이 세계 그림 자리만.
   Run: CHROMIUM_PATH=<chrome> NODE_PATH=<playwright 가 든 node_modules> node tests/prompt-pack-screen.cjs   (PORT 로 자리 바꾸기, 기본 8795) */
const assert = require('node:assert/strict'), http = require('node:http'), fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const { chromium } = require('playwright');
const K = require('../tools/prompt-pack.cjs');
const ROOT = path.resolve(__dirname, '..'), PORT = +(process.env.PORT || 8795), BASE = 'http://127.0.0.1:' + PORT;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((q, s) => {
  const p = decodeURIComponent(new URL(q.url, BASE).pathname), file = path.join(ROOT, p === '/' ? 'index.html' : p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(s);
});
(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prompt-pack-'));
  await new Promise(r => server.listen(PORT, r));
  const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    let n = 0;
    const key = 'seoul', card = K.cardOf(key), dir = path.join(tmp, key);
    assert.deepEqual(card.worlds, ['fantasy', 'steampunk', 'cyberpunk'], '서울은 세 세계');
    fs.mkdirSync(dir);
    const set = K.initSettings(card, []), w = 'cyberpunk';
    set.worlds[w].look.params = { 'hair color': '#8a8f99', hairstyle: '__custom__', hairstyle_custom: 'a low braided knot' };
    set.worlds[w].notes = { custom: 'rain sliding off a neon awning' }; set.worlds[w].shot = { scene: 'alley', time: 'night', pose: 'kneel', frame: 'long_raincoat' }; set.worlds[w].why = '검사';
    set.worlds[w].look.exposure = 'moderate';
    fs.writeFileSync(path.join(dir, 'settings.json'), JSON.stringify(set));
    const log = console.log; console.log = () => {};
    try { assert.equal(K.build(dir), 0, key + ' build'); } finally { console.log = log; }
    const list = K.slots(card, []);
    assert.equal(list.length, 3, '세계마다 세계 그림 한 자리(일상 일곱은 Task 4)');
    for (const s of list) {
      const rec = JSON.parse(fs.readFileSync(path.join(dir, s.slot + '-ui.json'), 'utf8'));
      assert.equal(fs.readFileSync(path.join(dir, s.slot + '-prompt.txt'), 'utf8'), rec.prompt);
      assert(rec.atelier === 'city' && rec.file === key + '_' + s.world + '_' + rec.style + '_f.webp', s.slot + ' 기록 꼴');
      if (s.world === w) assert(/Exposure \(moderate\)/.test(rec.prompt) && rec.prompt.includes('a low braided knot') && rec.prompt.includes('rain sliding off a neon awning'), '고친 설정이 지시문에');
      const ctx = await br.newContext({ viewport: { width: 344, height: 882 } });
      await ctx.addInitScript(v => { if (!sessionStorage.getItem('__seeded')) { localStorage.setItem('city_studio_v1', v); sessionStorage.setItem('__seeded', '1'); } }, JSON.stringify(rec.storage));
      await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
      const page = await ctx.newPage();
      await page.goto(BASE + '/prompt.html?card=' + key + '&o=' + rec.storage.out + '&world=' + s.world);
      await page.waitForFunction(() => window.AtelierStudio && window.AtelierStudio.prompt && window.AtelierStudio.prompt().length > 0);
      assert.equal(await page.evaluate(() => window.AtelierStudio.prompt()), rec.prompt, key + ' ' + s.slot + ' 화면과 묶음 지시문이 다르다');
      assert.equal(await page.locator('#file-name, .hres .file').first().textContent().then(x => x.includes(rec.file)), true, s.slot + ' 화면 파일 이름');
      await ctx.close(); n++;
    }
    /* 틀린 칸은 아무것도 안 쓴다 — 옛 세계 mecha 칸도 */
    const bad = path.join(tmp, 'bad');
    fs.mkdirSync(bad);
    const b = K.initSettings(card, []);
    b.worlds.fantasy.look.params = { 'hair color': 'not-a-value' }; b.worlds.steampunk.shot = { pose: 'nope' }; b.worlds.cyberpunk.notes = { custom: 'x' }; b.worlds.mecha = {};
    fs.writeFileSync(path.join(bad, 'settings.json'), JSON.stringify(b));
    const err = console.error, said = []; console.error = m => said.push(m);
    try { assert.equal(K.build(bad), 1); } finally { console.error = err; }
    assert(!fs.existsSync(path.join(bad, 'fantasy-prompt.txt')), '틀리면 쓰지 않는다');
    for (const re of [/hair color 의 값 not-a-value/, /shot\.pose 의 값 nope/, /worlds\.cyberpunk 에 직접 입력/, /worlds 에 없는 칸 mecha/]) assert(said.some(m => re.test(m)), re + ' 를 알린다');
    console.log(`PASS 지시문 묶음 ↔ 생성기 화면: 서울 세계 그림 ${n} 자리(고친 설정 하나 · 기본 둘)를 폰 화면(344×882)에 넣으면 같은 지시문 · 같은 파일 이름 · 틀린 설정(옛 mecha 칸 포함)은 안 쓴다 — 일상 자리는 Task 4`);
  } finally { await br.close(); server.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
})().catch(e => { console.error(e); process.exit(1); });
