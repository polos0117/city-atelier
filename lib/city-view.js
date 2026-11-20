/* 도시 무대 · 한 장(Task 8, DESIGN.md 5절) — 세 세계 세 사람이 조명 셋 아래 한 무대에, 사람을 누르면 한 장.
   글은 자료에서만: 도시 이름 · 나라 · 위도경도 · 상징 한 줄(card_ko.symbols)과 세계마다 짧은 말(card_ko.look · motif)은 data/city-design.json,
   직업은 data/casual-own.json, 생활 장면은 data/city-life.json, 그림은 data/img.json(lib/img.js). 낱말은 lib/words.js.
   그림이 없으면 「그림 없음」 자리 + 생성기 길(prompt.html?card=<도시>&o=world&world=<세계>). */
import { h } from 'https://esm.sh/preact@10.24.3';
import { useState, useEffect, useRef } from 'https://esm.sh/preact@10.24.3/hooks';

const W = (k, v) => window.W(k, v), IMG = () => window.AtelierImg, FAV = () => window.AtelierFavorites;
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
/* 카드 열쇠 <도시>-<랜드마크> — 그 도시 랜드마크 목록 · 카드 열쇠로 이름 찾기 */
export const landmarksOf = c => ((c && c.landmarks) || []).map(l => ({ key: c.key + '-' + l.key, ko: l.ko }));
export function cardName(d, key) {
  const c = d.cities.find(x => x.key === key) || d.cities.find(x => String(key).startsWith(x.key + '-')), l = c && landmarksOf(c).find(x => x.key === key);
  return c ? (l ? c.ko + ' · ' + l.ko : c.ko) : '';
}
function casualCount(img, city) {
  const I = IMG(), bs = I.styleMap(img && img[city]); let n = 0;
  for (const k in bs) for (const w in I.formMap(bs[k])) n += I.cuts(I.formOf(bs[k], w), 'casual', 'f').length;
  return n;
}
/* 파일 이름 <도시>_<세계>_<화풍>_f.webp (lib/prompt-spec.js FILES) 에서 세계 */
const worldOfPic = (pic, city) => { const m = String(pic || '').match(new RegExp('^' + String(city).replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + '_(fantasy|steampunk|cyberpunk)_')); return m ? m[1] : ''; };

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
        pic ? h('button', { type: 'button', class: 'th-fig', 'aria-label': W('city.pic.open', { world: W('world.' + k) }), onClick: () => onCard(pic, city) },
                h('img', { src: IMG().thumbURL(pic), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG().imgURL(pic); } }))
            : h('div', { class: 'th-fig is-empty' }, h('i', { 'aria-hidden': 'true' }), W('city.nopic')),
        h('div', { class: 'th-plaque' },
          h('b', { class: 'th-disp' }, W('world.' + k)),
          job ? h('span', { class: 'th-job' }, job) : null,
          h('span', null, ck.look || ''),
          h('span', { class: 'th-motif' }, ck.motif || '')),
        h('a', { class: 'th-draw', href: 'prompt.html?card=' + encodeURIComponent(city) + '&o=world&world=' + k }, W('city.draw')));
    })),
    landmarksOf(c).length ? h('div', { class: 'th-marks', role: 'group', 'aria-label': W('city.marks') }, landmarksOf(c).map(m =>
      h('div', { key: m.key, class: 'th-mark', 'data-card': m.key },
        h('b', { class: 'th-mark-name' }, m.ko),
        h('div', { class: 'th-mark-seats' }, worlds.map(k => {
          const pic = picOf(data.img, m.key, k, st), st2 = '--rc:var(--w-' + k + ')';
          return pic ? h('button', { key: k, type: 'button', class: 'th-mark-fig', style: st2, 'aria-label': W('city.mark.open', { name: m.ko, world: W('world.' + k) }), onClick: () => onCard(pic, m.key) },
              h('img', { src: IMG().thumbURL(pic), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG().imgURL(pic); } }))
            : h('span', { key: k, class: 'th-mark-fig is-empty', style: st2, title: W('city.nopic') }, h('i', { 'aria-hidden': 'true' }));
        })))) ) : null,
    h('p', { class: 'th-day' }, h('b', null, W('city.day', { city: c.ko })), ' — ',
      W('city.day.note', { n: casualCount(data.img, city), scenes: scenes.length, list: scenes.slice(0, 3).map(s => s.ko).join(' · ') })));
}

/* 한 도시의 그림 줄 — 세계 차례로 세계 그림 하나 + 그 세계 일상컷(번호 차례, 캐릭터만의 컷 90 은 끝).
   세계 그림은 고른 화풍(st)부터(picOf), 일상컷은 그 세계 그림과 같은 화풍 칸에서(2026-11-20 사용자 「도감에서 일상컷 못보네. 확대도 안되고」) */
const cutNo = f => Number((/_casual(\d+)\.webp$/.exec(f) || [])[1] || 0);
export function picsOf(img, city, worlds, st) {
  const I = IMG(), bs = I.styleMap(img && img[city]), out = [];
  for (const w of worlds) {
    const f = picOf(img, city, w, st); if (!f) continue;
    const k = Object.keys(bs).find(x => (I.formOf(bs[x], w) || {}).f === f);
    out.push({ file: f, w, kind: 'world' });
    I.cuts(I.formOf(bs[k], w), 'casual', 'f').slice().sort((a, b) => cutNo(a) - cutNo(b))
      .forEach(x => out.push({ file: x, w, kind: cutNo(x) >= 90 ? 'own' : 'casual', n: cutNo(x) }));
  }
  return out;
}

/* 등록부에 있는 그림인가 — 주소로 들어온 낯선 pic 은 한 장을 못 연다(세계 그림 · 일상컷 · 어느 화풍이든) */
export function known(img, city, pic) {
  const I = IMG(), bs = I.styleMap(img && img[city]);
  return !!pic && Object.keys(bs).some(k => Object.keys(I.formMap(bs[k])).some(w => { const b = I.formOf(bs[k], w) || {}; return b.f === pic || I.cuts(b, 'casual', 'f').includes(pic); }));
}

const kindOf = p => p.kind === 'world' ? W('card.kind.world') : p.kind === 'own' ? W('card.kind.own') : W('card.kind.casual', { n: p.n });

/* 크게 보기 — 화면 가득 한 장, 누르면 두 배 반(끌어서 옮긴다) · 다시 누르면 맞춤. Esc · 닫기 · 바깥.
   맞춤일 때 옆으로 밀면 · ←→ 로 앞뒤 장(2026-11-20 사용자 「크게보기때도 옆으로 넘기는 기능」), 아래 막대에 몇째 장 · 즐겨찾기 단추. 장이 바뀌면 key 로 새로 그려 맞춤으로 */
function Zoom({ p, alt, onClose, onStep, count, fav }) {
  const [big, setBig] = useState(false), box = useRef(null), touch = useRef(null);
  useEffect(() => {
    const k = e => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && onStep) { e.stopPropagation(); onStep(e.key === 'ArrowRight' ? 1 : -1); }
    };
    addEventListener('keydown', k, true); if (box.current) box.current.focus({ preventScroll: true });
    return () => removeEventListener('keydown', k, true);
  }, []);
  const tap = e => {
    const b = box.current, r = e.currentTarget.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    setBig(v => { if (!v) requestAnimationFrame(() => { if (!b) return; b.scrollLeft = fx * b.scrollWidth - b.clientWidth / 2; b.scrollTop = fy * b.scrollHeight - b.clientHeight / 2; }); return !v; });
  };
  const swipe = {
    onTouchStart: e => { touch.current = big || e.touches.length > 1 ? null : e.touches[0].clientX; },
    onTouchEnd: e => { const x = touch.current; touch.current = null; if (x == null || big || !onStep) return; const dx = e.changedTouches[0].clientX - x; if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1); } };
  return h('div', { class: 'th-zoom', role: 'dialog', 'aria-modal': 'true', 'aria-label': alt },
    h('div', Object.assign({ class: 'th-zoom-box' + (big ? ' is-big' : ''), ref: box, tabIndex: -1, onClick: e => { if (e.target === e.currentTarget) onClose(); } }, swipe),
      h('img', { src: IMG().imgURL(p.file), alt, onClick: tap })),
    h('div', { class: 'th-zoom-bar' },
      h('span', null, W(big ? 'card.zoom.out' : 'card.zoom.hint'), count ? h('b', { class: 'th-zoom-n' }, count) : null),
      fav || null,
      h('button', { type: 'button', onClick: onClose }, W('card.zoom.close'))));
}

/* 한 장 — 막 틀 안에 그림 하나. 넘기기는 세 세계의 세계 그림 · 일상컷 전부(밀어서도), 아래 줄은 그 세계 그림 목록, 그림을 누르면 크게 보기 */
export function CardView({ data, city, pic, st, onBack, onPic }) {
  const c = data.d.cities.find(x => city === x.key || String(city).startsWith(x.key + '-')), worlds = data.d.vocab.worlds;
  const pics = picsOf(data.img, city, worlds, st), at = pics.findIndex(x => x.file === pic), i = at < 0 ? 0 : at;
  const p = at < 0 ? { file: pic, w: worldOfPic(pic, city), kind: 'world' } : pics[i], w = p.w;
  const [zoom, setZoom] = useState(false), touch = useRef(null), [favs, setFavs] = useState(() => FAV() ? FAV().list() : []), [say, setSay] = useState(''), sayT = useRef(0);
  useEffect(() => { const f = FAV(); return f ? f.onChange(setFavs) : undefined; }, []);
  useEffect(() => () => clearTimeout(sayT.current), []);
  const step = d => { const n = pics[(i + d + pics.length) % pics.length]; if (n && n.file !== pic) onPic(n.file); };
  useEffect(() => {
    if (zoom) return;
    const k = e => { if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  });
  const alt = cardName(data.d, city) + (w ? ' · ' + W('world.' + w) : '') + ' · ' + kindOf(p), strip = pics.filter(x => x.w === w);
  /* 즐겨찾기 — 공방 모음 공용 모듈(lib/favorites.js, a = 'city'), 지금 보이는 그림 한 장 */
  const faved = favs.some(x => x.a === 'city' && x.file === p.file);
  const toggleFav = () => {
    const f = FAV(); if (!f) return;
    const parent = (c || {}).key || city, link = location.pathname + '?city=' + encodeURIComponent(parent) + '&card=' + encodeURIComponent(city) + '&pic=' + encodeURIComponent(p.file);
    const on = f.toggle({ a: 'city', key: city, file: p.file, title: cardName(data.d, city), sub: (w ? W('world.' + w) + ' · ' : '') + kindOf(p), thumb: IMG().thumbURL(p.file), full: IMG().imgURL(p.file), link });
    setSay(W(on ? 'dex.fav.added' : faved ? 'dex.fav.removed' : 'dex.fav.blocked')); clearTimeout(sayT.current); sayT.current = setTimeout(() => setSay(''), 2000);
  };
  const favBtn = h('button', { type: 'button', class: 'th-fav', 'aria-pressed': faved ? 'true' : 'false', disabled: !FAV(), title: W('dex.fav.note'), onClick: toggleFav },
    h('span', { 'aria-hidden': 'true' }, faved ? '\u2665' : '\u2661'), ' ' + W('dex.fav'));
  const thumb = x => h('img', { src: IMG().thumbURL(x.file), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG().imgURL(x.file); } });
  return h('div', { class: 'th-card', 'data-world': w, style: '--rc:var(--w-' + (w || 'fantasy') + ')' },
    h(Crumb, { label: W('card.back', { city: c.ko }), onBack, note: w ? W('world.' + w) : null }),
    h('figure', {
        onTouchStart: e => { touch.current = e.touches[0].clientX; },
        onTouchEnd: e => { const x = touch.current; touch.current = null; if (x == null) return; const dx = e.changedTouches[0].clientX - x; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); } },
      h('button', { type: 'button', class: 'th-zoom-open', 'aria-label': W('card.zoom'), onClick: () => setZoom(true) },
        h('img', { key: p.file, src: IMG().imgURL(p.file), alt })),
      h('figcaption', null, alt, h('span', { class: 'th-card-n' }, W('card.count', { i: i + 1, n: Math.max(pics.length, 1) })))),
    strip.length > 1 ? h('ol', { class: 'th-strip', 'aria-label': W('card.strip', { world: W('world.' + w) }) }, strip.map(x =>
      h('li', { key: x.file }, h('button', { type: 'button', 'aria-current': x.file === p.file ? 'true' : undefined, 'aria-label': kindOf(x), onClick: () => { if (x.file !== pic) onPic(x.file); } },
        thumb(x), h('span', null, x.kind === 'world' ? W('card.kind.world.short') : x.kind === 'own' ? W('card.kind.own.short') : String(x.n)))))) : null,
    h('div', { class: 'th-card-nav' },
      pics.length > 1 ? h('button', { type: 'button', onClick: () => step(-1) }, W('card.prev')) : null, favBtn,
      pics.length > 1 ? h('button', { type: 'button', onClick: () => step(1) }, W('card.next')) : null),
    worlds.filter(k => pics.some(x => x.w === k)).length > 1 ? h('div', { class: 'th-card-worlds' }, worlds.filter(k => pics.some(x => x.w === k)).map(k =>
      h('button', { key: k, type: 'button', 'aria-pressed': k === w ? 'true' : 'false', style: '--rc:var(--w-' + k + ')', onClick: () => { if (k !== w) onPic(pics.find(x => x.w === k).file); } }, W('world.' + k)))) : null,
    zoom ? h(Zoom, { key: p.file, p, alt, onClose: () => setZoom(false), onStep: pics.length > 1 ? step : null, count: W('card.count', { i: i + 1, n: Math.max(pics.length, 1) }), fav: favBtn }) : null,
    h('p', { class: 'th-toast', role: 'status', 'aria-live': 'polite' }, say));
}
