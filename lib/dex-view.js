/* 전체 도감(Task 9, DESIGN.md 5절) — 도시마다 표 한 장. 왼쪽 도시 색 띠(palette.hex 셋) · 도시 이름 · 나라 · 세계 세 칸 · 일상컷 수.
   칸: 그림이 있으면 작은 그림(누르면 한 장) + 그 세계 일상컷 수 · 없으면 「그림 없음」 → 생성기 길(prompt.html?card=<도시>&o=world&world=<세계>) ·
   설계 전 도시는 「설계 전」(누를 것 없음). 새 그림 점(.th-new)은 오늘 · 어제 등록분 중 이 기기에서 아직 안 연 것(lib/img.js isNew) — 그 줄(도시 무대)을 열면 꺼진다.
   줄을 누르면 그 도시 무대, 설계 전이면 그 줄 아래 짧은 안내. 세계 고르개는 그 세계 칸만 강조(도감은 세 세계를 다 보인다). 낱말은 lib/words.js */
import { h } from 'https://esm.sh/preact@10.24.3';
import { useState } from 'https://esm.sh/preact@10.24.3/hooks';
import { ready, picOf, landmarksOf } from './city-view.js?v=11';

const W = (k, v) => window.W(k, v), IMG = () => window.AtelierImg;

/* 한 도시 한 세계의 그림 파일 전부(모든 화풍 · 세계 그림 · 일상컷)와 일상컷 수 */
export function worldFiles(entry, w) {
  const I = IMG(), bs = I.styleMap(entry), out = [];
  for (const k in bs) { const b = I.formOf(bs[k], w); if (b) out.push(...[b.f, b.m].filter(Boolean), ...I.cuts(b, 'casual', 'f'), ...I.cuts(b, 'casual', 'm')); }
  return out;
}
function casualOf(entry, w) {
  const I = IMG(), bs = I.styleMap(entry); let n = 0;
  for (const k in bs) n += I.cutCount(I.formOf(bs[k], w), 'casual');
  return n;
}
/* 새 그림 전부 — 도구 상자 「새 그림 모두 확인」 이 쓴다 */
export function freshFiles(data, day) {
  const out = [];
  for (const c of data.d.cities) for (const k of [c.key, ...landmarksOf(c).map(m => m.key)]) for (const w of data.d.vocab.worlds) out.push(...worldFiles(data.img[k], w).filter(f => IMG().isNew(f, day)));
  return out;
}

export function DexView({ data, world, st, day, onCity, onCard }) {
  const [pre, setPre] = useState(''), worlds = data.d.vocab.worlds, cities = data.d.cities;
  const rows = cities.map(c => {
    const on = ready(c), e = data.img[c.key];
    const seats = worlds.map(w => {
      const pic = on ? picOf(data.img, c.key, w, st) : null;
      return { w, pic, n: pic ? casualOf(e, w) : 0, fresh: on && worldFiles(e, w).some(f => IMG().isNew(f, day)) };
    });
    /* 랜드마크 일상컷도 그 도시 줄에 더한다 */
    const lm = landmarksOf(c).reduce((s, m) => s + worlds.reduce((t, w) => t + casualOf(data.img[m.key], w), 0), 0);
    /* 랜드마크 새 그림(2026-11-22) — 도시 칸 점과 따로, 도시 이름 밑에 「랜드마크 새」 */
    const mfresh = on && landmarksOf(c).some(m => worlds.some(w => worldFiles(data.img[m.key], w).some(f => IMG().isNew(f, day))));
    return { c, on, seats, mfresh, casual: seats.reduce((s, x) => s + x.n, 0) + lm };
  });
  const sum = (f) => rows.reduce((s, r) => s + f(r), 0);
  const stat = (n, all, label) => h('div', null, h('b', { class: 'th-disp' }, n, all != null ? h('small', null, W('dex.stat.of', { n: all })) : null), h('span', null, label));
  const open = c => { if (ready(c)) onCity(c.key); else setPre(p => p === c.key ? '' : c.key); };
  const wname = w => W('world.' + w);

  return h('div', { class: 'th-dexwrap' },
    h('section', { class: 'th-dex' },
      h('h2', { class: 'th-disp' }, W('tab.dex')),
      h('div', { class: 'th-stats' },
        stat(sum(r => r.on ? 1 : 0), cities.length, W('dex.stat.cities')),
        stat(sum(r => r.seats.filter(x => x.pic).length), cities.length * worlds.length, W('dex.stat.pics')),
        stat(sum(r => r.casual), null, W('dex.stat.casual'))),
      h('div', { class: 'th-legend', 'aria-hidden': 'true' },
        h('span', null, h('i', { class: 'is-empty' }), W('city.nopic')),
        h('span', null, h('i', { class: 'is-pre' }), W('globe.pre')),
        h('span', null, h('i', null, h('em', { class: 'th-new' }, W('dex.new'))), W('dex.lg.new')))),
    h('div', { class: 'th-tk-cols', 'aria-hidden': 'true' }, h('span'), h('span', null, W('dex.col.city')),
      worlds.map(w => h('span', { key: w, class: w === world ? 'is-cur' : undefined, style: '--rc:var(--w-' + w + ')' }, W('dex.col.' + w))), h('span', null, W('dex.col.casual'))),
    h('ol', { class: 'th-tickets' }, rows.map(({ c, on, seats, mfresh, casual }) => h('li', {
      key: c.key, class: 'th-ticket' + (on ? '' : ' is-pre'), 'data-city': c.key,
      onClick: e => { if (!e.target.closest('a, button')) open(c); } },
      h('span', { class: 'th-stub', 'aria-hidden': 'true', style: 'background:linear-gradient(' + c.palette.hex[0] + ' 0 34%,' + c.palette.hex[1] + ' 34% 67%,' + c.palette.hex[2] + ' 67%)' }),
      h('button', { type: 'button', class: 'th-tk-name', 'aria-label': W('dex.city.open', { city: c.ko }), 'aria-expanded': on ? undefined : pre === c.key, onClick: () => open(c) },
        h('b', { class: 'th-disp', style: 'font-size:' + Math.min(17, Math.floor(80 / c.ko.length)) + 'px' }, c.ko), h('small', null, c.country),
        mfresh ? h('em', { class: 'th-new th-new-mark', title: W('dex.new.mark.label') }, W('dex.new.mark')) : null),
      seats.map(({ w, pic, n, fresh }) => {
        const cls = 'th-seat' + (w === world ? ' is-cur' : ''), st2 = '--rc:var(--w-' + w + ')', dot = fresh ? h('em', { class: 'th-new' }, W('dex.new')) : null;
        if (!on) return h('span', { key: w, class: cls + ' is-pre', 'data-world': w, style: st2 }, W('dex.seat.pre'));
        if (!pic) return h('a', { key: w, class: cls + ' is-empty', 'data-world': w, style: st2, 'aria-label': W('dex.seat.draw', { city: c.ko, world: wname(w) }),
          href: 'prompt.html?card=' + encodeURIComponent(c.key) + '&o=world&world=' + w }, W('dex.seat.empty'), dot);
        return h('button', { key: w, type: 'button', class: cls + ' has-pic', 'data-world': w, style: st2, 'aria-label': W('dex.seat.open', { city: c.ko, world: wname(w) }), onClick: () => onCard(c.key, pic) },
          h('img', { src: IMG().thumbURL(pic), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG().imgURL(pic); } }),
          n ? h('span', { class: 'th-seat-n', title: W('dex.seat.casual', { n }) }, n) : null, dot);
      }),
      h('span', { class: 'th-count' }, h('b', { class: 'th-disp' }, casual), h('small', null, W('dex.unit'))),
      pre === c.key ? h('p', { class: 'th-tk-note', role: 'status' }, W('globe.pre.note', { city: c.ko })) : null))));
}
