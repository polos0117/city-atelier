#!/usr/bin/env node
/* 일상컷 색인(2026-11-25) — 그림 저장소 records 의 일상컷 기록과 그 카드 · 세계의 계획 파일을 읽어 data/casual-index.json 을 쓴다. 그림은 읽지 않는다.
   사용자 2026-11-25 「포켓몬, 원소, 삼국지에는 있는 기능인데, 크게보기에서 이 그림이 어떤 갈래에 어떤 의상과 색상으로 만들어졌는지 보여주는 기능도 도시공방이랑 즐겨찾기에도 추가해주고.
   조금 더 세부내용을 추가해줬으면 해. 가령, 장소나 포즈, 표정, 구도 등인데 어디까지 하는게 좋을지 검토해줘」 → 「응 그 범위로 진행해줘」.
   세 공방(sam · element · pkm)과 같은 꼴 — 크게 보기(lib/casual-note.js)와 허브 즐겨찾기가 이 꼴만 읽는다:
     { version: 1, atelier: "city", built, source: [그림 저장소], rows: [{ card, name, world, worldKo, n, date, style, path, required, requiredKo,
       family, familyKo, item, itemKo, shade, shadeKo, cosplay: null|{ game, gameKo, character, characterKo, cut, cutKo, by, round }, free: null|{ kind, kindKo, outfit }, s? }] }
     s(있을 때만 — 장면 풀이: 장소 · 하는 일 · 구도 + 더 보기 칸, 빈 칸은 뺀다)는 tools/casual-detail.cjs(네 공방 같은 파일)가 짓는다.
   - 기록: records/<카드>/<세계>-casualN.<화풍>-ui.json 만(계획 · 전경 · 세계 그림 기록은 줄이 아니다).
   - 필수: 그 카드 · 세계의 계획 파일(<세계>-casual-plan.json)의 required 글 — 「life:<장면> · lingerie · swimwear · roleplay · cosplay:<게임>/… · situ:<상황> · ofree · gfree:…」.
     도시 생활(life — 계획 컷의 lifeMust 또는 그 장면 장소, 장면 이름은 s.pl 이 말한다) · 노출 갈래(글에 적힌 갈래마다 그 갈래 첫 컷) · 게임 코스프레 · 상황 노출(적힌 상황의 첫 컷) · 캐릭터만의 컷(90번, own).
     계획 파일이 없으면 장면만으로 — 코스프레 · 90번 · lifeMust.
   - 한글: 갈래 · 옷 · 옷 색(도시 기록엔 shade 가 없어 색 묶음 color 의 ko) · 게임 · 재단 · 세계 · 카드 이름은 표의 ko, 캐릭터는 data/game-cosplay.json characters[].ko → 주인공 하나 게임 character_ko → null.
     GPT 가 지은 것(자유 설계 Outfit 줄 · GPT 가 고른 코스프레 캐릭터)은 기록의 영어 그대로.
   - rows 는 날짜 새것 먼저(같으면 카드 · 세계 · 번호). 줄이 같으면 파일을 그대로 둔다(built 만 바뀌는 커밋을 막는다).

     node tools/casual-index.cjs [--repos <그림 저장소>] [--out <파일>] [--check]
       --repos  기본 옆의 ../city-atelier-img(등록 워크플로는 img-repo). 저장소가 없으면 쓰지 않고 멈춘다(반쪽 색인으로 덮지 않게) */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = { window: {}, console }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js']) vm.runInContext(read(f), ctx);
const T = ctx.window.AtelierSpec, CT = ctx.window.AtelierCasualTree, C2 = ctx.window.AtelierCasualTreeV2;
const tree = JSON.parse(read('data/casual-tree.json')), tree2 = JSON.parse(read('data/casual-tree-v2.json')), T2 = C2.make(tree2, tree);
const GC0 = JSON.parse(read('data/game-cosplay.json')), DESIGN = JSON.parse(read('data/city-design.json'));
const DETAIL = require('./casual-detail.cjs')(ROOT);
const OWN_N = JSON.parse(read('data/casual-own.json')).number || 90;
const ATELIER = 'city', OUT = 'data/casual-index.json', REPO = 'city-atelier-img';
const EXPOSE = (tree.required || {}).outfits || ['lingerie', 'swimwear', 'roleplay'];
const COS_FAM = (tree.cosplay || {}).outfit || 'game_cosplay';
const REC_RX = /^([a-z]+)-casual(\d+)\.([a-z0-9_]+)-ui\.json$/, PLAN_RX = /^([a-z]+)-casual-plan\.json$/;
const FREE_KO = { ofree: '옷 자유', gfree: '갈래 자유', sfree: '장면 자유', xfree: '갈래 · 상황 자유' };

const by = (list, k) => (Array.isArray(list) && k ? list.find(x => x && x.key === k) : null) || null;
const str = v => (typeof v === 'string' ? v.trim() : '');
const nz = v => (v == null || v === '' ? null : v);
const normName = s => str(s).toLowerCase().replace(/\s+/g, ' ');
const day = s => (/^\d{4}-\d{2}-\d{2}/.exec(String(s || '')) || [''])[0];
const loadJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };

/* ── 한글 ── */
const worldKo = w => (by(T.WORLDS, w) || {}).ko || '';
function cardKo(card) {
  for (const c of DESIGN.cities || []) {
    if (c.key === card) return c.ko || card;
    for (const l of c.landmarks || []) if (c.key + '-' + l.key === card) return l.ko || card;
  }
  return card;
}
const famKo = k => { const f = k && (C2.family(T2, k) || CT.family(tree, k)); return (f && f.ko) || null; };
/* 실루엣 갈래(2026-11-25 사용자 「실루엣 갈래도 색인에 넣어줘」) — 옷의 cls(수영복 · 란제리 · 역할극 … 계열의 classes) · 한글 이름 */
const CLS_TREE = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'casual-tree.json'), 'utf8'));
function clsOf(fam, k) {
  const f = fam && (CLS_TREE.outfits || []).find((o) => o.key === fam), it = f && k && (f.items || []).find((i) => i.key === k), c = it && it.cls;
  if (!c) return {};
  const cl = (f.classes || []).find((x) => x.key === c);
  return { cls: c, clsKo: (cl && cl.ko) || c };
}
const itemKo = (fam, k) => { const it = fam && k && (C2.item(T2, fam, k) || CT.item(tree, fam, k)); return (it && it.ko) || null; };
const colorKo = k => (by((T.CASUAL || {}).colors, k) || {}).ko || null;
const situKo = k => String((by((T.CASUAL || {}).situations, k) || {}).ko || k).split(' — ')[0];
function characterKo(gc, game, name) {
  const gm = ((gc || {}).games || []).find(g => g.key === game); if (!gm) return null;
  const ch = (gm.characters || []).find(c => [c.name].concat(c.aka || []).some(n => normName(n) === normName(name)));
  if (ch && ch.ko) return ch.ko;
  if (!gm.many && gm.character_ko) return gm.character_ko;
  const rk = (((gc || {}).retired_ko || {})[game] || {}), rn = Object.keys(rk).find(n => normName(n) === normName(name));
  return rn ? rk[rn] : null;
}

/* ── 자유 설계 Outfit 줄 — free_design 덩어리 → free_prompt → 지시문. 「…」 로 시작하는 빈 틀은 건너뛴다 ── */
const outfitIn = t => { const m = [...String(t || '').matchAll(/(?:^|\n)[ \t]*Outfit:[ \t]*([^\n]*)/g)].map(x => x[1].trim()).filter(x => x && !/^…/.test(x)); return m[0] || null; };
function freeOutfit(r) {
  const g = r.generation || {}, fd = g.free_design;
  if (fd && typeof fd === 'object' && !Array.isArray(fd)) { const v = fd.Outfit || fd.outfit; if (v && !/^…/.test(String(v).trim())) return String(v).trim(); }
  if (Array.isArray(fd) && fd.length >= 5 && fd[4] && !/^…/.test(String(fd[4]).trim())) return String(fd[4]).trim();
  return outfitIn(typeof fd === 'string' ? fd : '') || outfitIn(g.free_prompt) || outfitIn(g.prompt) || outfitIn(r.prompt);
}
const freeKind = s => (s.gfree ? 'gfree' : s.xfree ? 'xfree' : s.ofree ? 'ofree' : s.sfree ? 'sfree' : null);

/* ── 게임 코스프레 — generation.cosplay(그린 것) > scene.cosplay. by: 장면에 캐릭터가 차 있으면 planner, 비고 generation 에만 있으면 gpt ── */
function cosplayOf(r, gc = GC0) {
  const s = r.scene || {}, sc = s.cosplay, gn = (r.generation || {}).cosplay;
  if (s.ofam !== COS_FAM && !sc && !gn) return null;
  const filled = x => x && str(x.character);
  const game = (gn && gn.game) || (sc && sc.game) || '';
  const character = filled(gn) ? str(gn.character) : filled(sc) ? str(sc.character) : '';
  const cut = (gn && gn.cut) || (sc && sc.cut) || String(s.item || '').replace(/^gc_/, '');
  const gm = (gc.games || []).find(g => g.key === game) || {};
  return { game, gameKo: gm.ko || null, character: character || null, characterKo: character ? characterKo(gc, game, character) : null,
    cut: cut || null, cutKo: (by(gc.cuts, cut) || {}).ko || null, by: filled(sc) ? 'planner' : 'gpt', round: Number((sc && sc.round) || 1) };
}

/* ── 계획 required 글 → { life, expose: [갈래], cosplay, situ } ── */
function parseRequired(text) {
  const tags = String(text || '').split('·').map(x => x.trim()).filter(Boolean);
  const after = p => { const t = tags.find(x => x.startsWith(p)); return t ? t.slice(p.length) : ''; };
  return { life: after('life:'), expose: tags.filter(t => EXPOSE.includes(t)), cosplay: tags.some(t => t.startsWith('cosplay:')), situ: after('situ:') };
}
/* 한 묶음(카드 · 세계 · 화풍)의 필수 — 번호 → [required, requiredKo] */
function assign(card, list, plan) {
  const out = new Map(), req = plan ? parseRequired(plan.required) : null, planCut = n => ((plan && plan.cuts) || []).find(c => Number(c.n) === n) || {};
  const free = s => !!freeKind(s);
  for (const x of [...list].sort((a, b) => a.n - b.n)) {
    const s = x.r.scene || {};
    if (x.n === OWN_N || s.own) { out.set(x.n, ['own', '캐릭터만의 컷']); continue; }
    if (free(s)) continue;
    if (s.ofam === COS_FAM) { out.set(x.n, ['cosplay', '게임 코스프레']); continue; }
    if (s.lifeMust || planCut(x.n).lifeMust || (req && req.life && s.place === card.split('-')[0] + '_' + req.life)) {
      if (![...out.values()].some(v => v[0] === 'life')) { out.set(x.n, ['life', '도시 생활']); continue;   /* 장면 이름은 둘째 줄(장소 — 장면 풀이 s.pl)이 말한다 */ }
    }
    if (req && req.expose.includes(s.ofam) && ![...out.values()].some(v => v[0] === s.ofam)) { out.set(x.n, [s.ofam, '노출 갈래(' + (famKo(s.ofam) || s.ofam) + ')']); continue; }
    if (req && req.situ && s.situ === req.situ && ![...out.values()].some(v => v[0] === 'situ')) out.set(x.n, ['situ', '상황 노출(' + situKo(s.situ) + ')']);
  }
  return out;
}

/* ── 저장소 읽기 ── */
function scan(dir, name) {
  const top = path.join(dir, 'records'), recs = [], plans = new Map();
  if (!fs.existsSync(top)) return { recs, plans };
  for (const card of fs.readdirSync(top).sort()) {
    const d = path.join(top, card); if (card === 'automation' || !fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).sort()) {
      const m = REC_RX.exec(f), p = PLAN_RX.exec(f);
      if (p) { const doc = loadJson(path.join(d, f)); if (doc && (!doc.card || doc.card === card)) plans.set(card + '|' + p[1] + '|' + (doc.style || ''), doc); continue; }
      if (!m) continue;
      const r = loadJson(path.join(d, f)); if (!r) continue;
      recs.push({ card, world: m[1], n: Number(m[2]), style: m[3], r, date: day(r.imported) || day(r.date) || day((r.generation || {}).date), at: `${name}/records/${card}/${f}` });
    }
  }
  return { recs, plans };
}
function rowOf(x, required, gc = GC0) {
  const r = x.r, s = r.scene || {}, fk = freeKind(s), own = required && required[0] === 'own';
  const row = { card: x.card, name: cardKo(x.card), world: x.world, worldKo: worldKo(x.world), n: x.n, date: x.date, style: x.style, path: x.at,
    required: required ? required[0] : null, requiredKo: required ? required[1] : null,
    family: null, familyKo: null, item: null, itemKo: null, shade: null, shadeKo: null, cosplay: null, free: null };
  if (own) row.itemKo = nz(str((r.own || {}).job_ko));   /* 캐릭터만의 컷 — 옷은 그 직업 차림(data/casual-own.json) */
  else if (fk) {
    if (fk === 'gfree') { row.family = s.gfree; row.familyKo = famKo(s.gfree); }   /* 갈래 자유 — 갈래는 우리가, 옷은 GPT 가 */
    row.free = { kind: fk, kindKo: FREE_KO[fk], outfit: freeOutfit(r) };
  } else {
    row.family = nz(s.ofam); row.familyKo = famKo(s.ofam);
    if (s.ofam === COS_FAM) row.cosplay = cosplayOf(r, gc);
    else { row.item = nz(s.item); row.itemKo = itemKo(s.ofam, s.item); Object.assign(row, clsOf(s.ofam, s.item)); row.shade = nz(s.shade || s.color); row.shadeKo = row.shade ? colorKo(s.color) : null; }
  }
  const det = DETAIL(s, r, x.card); if (det) row.s = det;
  return row;
}
function build(repos, { gc = GC0, built = new Date().toISOString() } = {}) {
  const rows = [];
  for (const repo of repos) {
    const { recs, plans } = scan(repo.dir, repo.name), groups = new Map();
    for (const x of recs) { const k = [x.card, x.world, x.style].join('|'); (groups.get(k) || groups.set(k, []).get(k)).push(x); }
    for (const [k, list] of groups) {
      const [card, world, style] = k.split('|');
      const plan = plans.get(card + '|' + world + '|' + style) || plans.get(card + '|' + world + '|');
      const req = assign(card, list, plan);
      for (const x of list) rows.push(rowOf(x, req.get(x.n) || null, gc));
    }
  }
  rows.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0) || a.card.localeCompare(b.card) || a.world.localeCompare(b.world) || a.n - b.n || a.style.localeCompare(b.style));
  return { version: 1, atelier: ATELIER, built, source: repos.filter(r => fs.existsSync(path.join(r.dir, 'records'))).map(r => r.name), rows };
}
function stats(doc) {
  const rows = doc.rows, cnt = f => rows.filter(f).length;
  return { rows: rows.length, byReq: rows.reduce((m, r) => (r.required ? (m[r.required] = (m[r.required] || 0) + 1, m) : m), {}),
    cosplay: cnt(r => r.cosplay), free: cnt(r => r.free), outfit: cnt(r => r.free && r.free.outfit), s: cnt(r => r.s) };
}
/* 줄이 같으면 그대로 둔다 — built 만 바뀌어 매시 커밋되지 않게 */
function write(doc, file = path.join(ROOT, OUT)) {
  const old = loadJson(file);
  if (old && JSON.stringify(old.rows) === JSON.stringify(doc.rows) && JSON.stringify(old.source) === JSON.stringify(doc.source)) return false;
  fs.writeFileSync(file, JSON.stringify(doc) + '\n');
  return true;
}
function main(argv) {
  const opt = {}; for (let i = 0; i < argv.length; i++) { const k = argv[i].replace(/^--/, ''); opt[k] = k === 'check' ? true : argv[++i]; }
  const dir = path.resolve(opt.repos || path.join(ROOT, '..', REPO));
  if (!fs.existsSync(path.join(dir, 'records'))) { console.error('그림 저장소가 없다: ' + dir + ' — 받은 뒤 다시(반쪽 색인으로 덮지 않는다)'); return 2; }
  const doc = build([{ name: REPO, dir }]), st = stats(doc);
  console.log(`일상컷 색인 — ${st.rows} 줄 · 필수 ${Object.entries(st.byReq).map(([k, v]) => k + ' ' + v).join(' · ')} · 코스프레 ${st.cosplay} · 자유 설계 ${st.free}(Outfit 줄 ${st.outfit}) · 장면 풀이 ${st.s}`);
  if (opt.check) return 0;
  const file = opt.out ? path.resolve(opt.out) : path.join(ROOT, OUT);
  console.log(write(doc, file) ? '→ ' + path.relative(process.cwd(), file) : '달라진 줄 없음 — 그대로');
  return 0;
}
module.exports = { build, write, stats, rowOf, assign, parseRequired, freeOutfit, cosplayOf, characterKo, scan, OWN_N };
if (require.main === module) process.exit(main(process.argv.slice(2)));
