/* 도시 무대 · 한 장(Task 8, DESIGN.md 5절) — 세 세계 세 사람이 조명 셋 아래 한 무대에, 사람을 누르면 한 장.
   글은 자료에서만: 도시 이름 · 나라 · 위도경도 · 상징 한 줄(card_ko.symbols)과 세계마다 짧은 말(card_ko.look · motif)은 data/city-design.json,
   직업은 data/casual-own.json, 생활 장면은 data/city-life.json, 그림은 data/img.json(lib/img.js). 낱말은 lib/words.js.
   그림이 없으면 「그림 없음」 자리 + 생성기 길(prompt.html?card=<도시>&o=world&world=<세계>). */
import { h } from 'https://esm.sh/preact@10.24.3';

const W = (k, v) => window.W(k, v), IMG = () => window.AtelierImg;
export const ready = c => !!(c && c.worlds && Object.keys(c.worlds).length);
export function latlon(c) {
  const f = (v, p, n) => W(v >= 0 ? p : n, { v: Math.abs(v).toFixed(2) });
  return f(c.lat, 'geo.lat.n', 'geo.lat.s') + ' · ' + f(c.lon, 'geo.lon.e', 'geo.lon.w');
}
/* 그 도시 그 세계의 그림 한 장 — 고른 화풍(st)부터, 없으면 아무 화풍 */
export function picOf(img, city, world, st) {
  const I = IMG(), bs = I.styleMap(img && img[city]), order = [st].concat(Object.keys(bs)).filter((k, i, a) => k && bs[k] && a.indexOf(k) === i);
  for (const k of order) { const f = I.formOf(bs[k], world); if (f && f.f) return f.f; }
  return null;
}
function casualCount(img, city) {
  const I = IMG(), bs = I.styleMap(img && img[city]); let n = 0;
  for (const k in bs) for (const w in I.formMap(bs[k])) n += I.cuts(I.formOf(bs[k], w), 'casual', 'f').length;
  return n;
}
/* 파일 이름 <도시>_<세계>_<화풍>_f.webp (lib/prompt-spec.js FILES) 에서 세계 */
const worldOfPic = (pic, city) => { const m = String(pic || '').match(new RegExp('^' + city + '_(fantasy|steampunk|cyberpunk)_')); return m ? m[1] : ''; };

function Crumb({ label, onBack, note }) {
  return h('div', { class: 'th-crumb' }, h('button', { type: 'button', class: 'th-back', onClick: onBack }, label), note ? h('span', null, note) : null);
}
function Title({ c }) {
  return h('section', { class: 'th-city-title' },
    h('h2', { class: 'th-disp' }, c.ko),
    h('p', { class: 'th-city-meta' }, c.country + ' · ' + latlon(c)),
    c.card_ko && c.card_ko.symbols ? h('p', { class: 'th-city-sym' }, h('b', null, W('city.symbols')), c.card_ko.symbols) : null);
}

/* 도시 무대. data = { d, own, life, img }, world = 지금 무대 세계(막 · 조명), st = 화풍 */
export function CityStage({ data, city, world, st, from, onBack, onCard }) {
  const c = data.d.cities.find(x => x.key === city), worlds = data.d.vocab.worlds;
  const back = W(from === 'dex' ? 'city.back.dex' : 'city.back.globe');
  if (!ready(c)) return h('div', { class: 'th-city' }, h(Crumb, { label: back, onBack }), h(Title, { c }), h('p', { class: 'th-day' }, W('city.pre')));
  const own = (((data.own || {}).cards || {})[city] || {}).worlds || {}, scenes = ((((data.life || {}).cities || {})[city] || {}).scenes || []);
  return h('div', { class: 'th-city' },
    h(Crumb, { label: back, onBack, note: W('city.crumb', { world: W('world.' + world) }) }),
    h(Title, { c }),
    h('div', { class: 'th-cast' }, worlds.map(k => {
      const v = c.worlds[k] || {}, ck = v.card_ko || {}, pic = picOf(data.img, city, k, st), job = (own[k] || {}).job_ko;
      return h('article', { key: k, class: 'th-role', 'data-world': k, style: '--rc:var(--w-' + k + ')' },
        h('span', { class: 'th-beam', 'aria-hidden': 'true' }),
        pic ? h('button', { type: 'button', class: 'th-fig', 'aria-label': W('city.pic.open', { world: W('world.' + k) }), onClick: () => onCard(pic) },
                h('img', { src: IMG().thumbURL(pic), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG().imgURL(pic); } }))
            : h('div', { class: 'th-fig is-empty' }, h('i', { 'aria-hidden': 'true' }), W('city.nopic')),
        h('div', { class: 'th-plaque' },
          h('b', { class: 'th-disp' }, W('world.' + k)),
          job ? h('span', { class: 'th-job' }, job) : null,
          h('span', null, ck.look || ''),
          h('span', { class: 'th-motif' }, ck.motif || '')),
        h('a', { class: 'th-draw', href: 'prompt.html?card=' + encodeURIComponent(city) + '&o=world&world=' + k }, W('city.draw')));
    })),
    h('p', { class: 'th-day' }, h('b', null, W('city.day', { city: c.ko })), ' — ',
      W('city.day.note', { n: casualCount(data.img, city), scenes: scenes.length, list: scenes.slice(0, 3).map(s => s.ko).join(' · ') })));
}

/* 등록부에 있는 그림인가 — 주소로 들어온 낯선 pic 은 한 장을 못 연다 */
export function known(img, city, pic) {
  const I = IMG(), bs = I.styleMap(img && img[city]);
  return !!pic && Object.keys(bs).some(k => Object.keys(I.formMap(bs[k])).some(w => (I.formOf(bs[k], w) || {}).f === pic));
}

/* 한 장 — 막 틀 안에 그림 하나. 세계 넘기기는 그림이 있는 세계끼리 */
export function CardView({ data, city, pic, st, onBack, onPic }) {
  const c = data.d.cities.find(x => x.key === city), w = worldOfPic(pic, city);
  const pics = data.d.vocab.worlds.map(k => [k, picOf(data.img, city, k, st)]).filter(x => x[1]), i = pics.findIndex(x => x[1] === pic);
  const flip = d => { const n = pics[(i + d + pics.length) % pics.length]; if (n && n[1] !== pic) onPic(n[1]); };
  return h('div', { class: 'th-card', 'data-world': w, style: '--rc:var(--w-' + (w || 'fantasy') + ')' },
    h(Crumb, { label: W('card.back', { city: c.ko }), onBack, note: w ? W('world.' + w) : null }),
    h('figure', null, h('img', { src: IMG().imgURL(pic), alt: c.ko + (w ? ' · ' + W('world.' + w) : '') }), h('figcaption', null, c.ko + (w ? ' · ' + W('world.' + w) : ''))),
    pics.length > 1 ? h('div', { class: 'th-card-nav' },
      h('button', { type: 'button', onClick: () => flip(-1) }, W('card.prev')), h('button', { type: 'button', onClick: () => flip(1) }, W('card.next'))) : null);
}
