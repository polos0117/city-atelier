/* 짧은 세계 그림 · 칸 꼴의 외형 칸 — 원소 공방 2026-11-11 사용자 「응 둘 다 고쳐줘」 를 도시 꼴로(2026-11-19 Task 3).
   1) 생성기에서 직접 고른 외형(머리색 등)이 지시문에 실린다 — 고르면 설계의 그 칸이 빠지는데 고른 값이 안 실리던 일.
   2) 얼굴 싣기를 끄면 「Her: . 」 처럼 앞 찌꺼기가 남지 않는다.
   칸 꼴(기본)과 칸 꼴을 끈 짧은 판 둘 다 본다.
   Run: node tests/prompt-short-look.cjs */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const ctx = { window: {}, console }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const P = ctx.window.AtelierPrompt, D = JSON.parse(fs.readFileSync('data/city-design.json', 'utf8')), S0 = JSON.parse(fs.readFileSync('data/style.json', 'utf8'));
const SHORT = Object.assign({}, S0, { worldSections: false });
assert(P.worldShortOn(S0, S0['default']) && P.worldSectionsOn(S0, S0['default']) && !P.worldSectionsOn(SHORT, SHORT['default']) && P.worldShortOn(SHORT, SHORT['default']), '기본 화풍은 칸 꼴, 칸 꼴을 끄면 짧은 판');
/* 칸 꼴에선 줄이 칸 안에 한 줄씩 — 줄로 나눠 본다. 얼굴 줄은 「Face — her own: 」(칸 꼴) 또는 「Her: 」(짧은 판) */
const blocks = t => t.split(/\n+/), her = t => blocks(t).find(x => x.startsWith('Her: ') || x.startsWith('Body and hair: '));
let n = 0;
for (const [label, S] of [['칸 꼴', S0], ['짧은 판', SHORT]]) for (const key of P.cards(D)) for (const w of P.worldsOf(D, key)) {
  const id = label + ' ' + key + ' ' + w, base = P.build(D, S, key, w, {});
  assert(!/Chosen look/.test(base), id + ' 고른 것이 없으면 Chosen 줄 없음');
  const pick = P.build(D, S, key, w, { look: { params: { 'hair color': 'silver' } } });
  assert(blocks(pick).includes('Chosen look (overrides the automatic look): hair color: silver.'), id + ' 고른 머리색이 실린다');
  const off = P.build(D, S, key, w, { look: { faceDesignOn: false } });
  assert(/^(?:Her|Body and hair): [^.\s]/.test(her(off)) && !/^(?:Her|Body and hair): \./.test(her(off)) && !/^Face — her own: *\.?$/m.test(off), id + ' 얼굴 끄면 찌꺼기 없음: ' + her(off).slice(0, 30));
  assert(!/\. \./.test(off) && !/\.\./.test(off), id + ' 마침표 겹침 없음');
  if (label === '짧은 판') assert(/\n\nHer city, worn on her: /.test(base) && /\n\nHer world, carried on her: /.test(base) && /\n\nWorld and costume: /.test(base) && /\n\nProp: /.test(base), id + ' 짧은 판 도시 줄');
  n++;
}
console.log('PASS 짧은 판 · 칸 꼴 외형 칸: ' + n + '장 — 고른 외형 줄 · 얼굴 끈 Her 줄 · 짧은 판 도시 줄');
