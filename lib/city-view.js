/* 도시 무대 · 한 장(Task 8, DESIGN.md 5절) — 세 세계 세 사람이 조명 셋 아래 한 무대에, 사람을 누르면 한 장.
   글은 자료에서만: 도시 이름 · 나라 · 위도경도 · 상징 한 줄(card_ko.symbols)과 세계마다 짧은 말(card_ko.look · motif)은 data/city-design.json,
   직업은 data/casual-own.json, 생활 장면은 data/city-life.json, 그림은 data/img.json(lib/img.js). 낱말은 lib/words.js.
   그림이 없으면 「그림 없음」 자리 + 생성기 길(prompt.html?card=<도시>&o=world&world=<세계>). */
import { h } from 'https://esm.sh/preact@10.24.3';
import { useState, useEffect, useLayoutEffect, useRef } from 'https://esm.sh/preact@10.24.3/hooks';
import { useFill } from './fill-view.js?v=1';   /* 크게 보기 꽉 채우기 — 휴대폰 세로에서 1:1 · 3:2 그림을 높이에 맞춰 옆으로(2026-11-24) */

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
/* 한 카드 한 세계의 그림 파일 전부(세계 그림 + 일상컷) — lib/dex-view.js worldFiles 와 같다(그 파일이 이 파일을 불러 여기 따로 둔다) */
export function markFiles(entry, w) {
  const I = IMG(), bs = I.styleMap(entry), out = [];
  for (const k in bs) { const b = I.formOf(bs[k], w); if (b) out.push(...[b.f, b.m].filter(Boolean), ...I.cuts(b, 'casual', 'f'), ...I.cuts(b, 'casual', 'm')); }
  return out;
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

/* ── 전경(2026-11-24) ── 그 도시 그 세계의 풍경 한 장(img.json 세계 몫의 vista — tools/register-images.py). 고른 화풍(st)부터, 없으면 아무 화풍.
   전경은 분위기만 — 명소 자리는 설계표 landmarks[].lat · lon(작은 지도)이 쥔다(사용자 「랜드마크는 계속 추가할건데 미리 그려놓으면 …」) */
export function vistaOf(img, city, world, st) {
  const I = IMG(), bs = I.styleMap(img && img[city]), order = [st].concat(Object.keys(bs)).filter((k, i, a) => k && bs[k] && a.indexOf(k) === i);
  for (const k of order) { const f = I.formOf(bs[k], world); if (f && f.vista) return f.vista; }
  return null;
}
/* 작은 지도의 점 — 도시 한가운데(설계표 도시 lat · lon) + 좌표 있는 랜드마크. 점들의 둘레 상자(여백 30%)를 정사각으로 펴 0~100 자리에.
   경도는 cos(위도)로 눌러 모양을 지킨다. 지도 그림 · 타일은 없다(코드로만) */
export function mapPins(c) {
  const lms = ((c && c.landmarks) || []).filter(l => typeof l.lat === 'number' && typeof l.lon === 'number');
  const pts = [{ key: c.key, ko: c.ko, lat: c.lat, lon: c.lon, home: true }].concat(lms.map(l => ({ key: c.key + '-' + l.key, ko: l.ko, lat: l.lat, lon: l.lon })));
  const k = Math.cos(c.lat * Math.PI / 180), xs = pts.map(p => p.lon * k), ys = pts.map(p => p.lat);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 0.005) * 1.3;
  return pts.map(p => Object.assign(p, { x: +(50 + (p.lon * k - cx) / span * 100).toFixed(2), y: +(50 - (p.lat - cy) / span * 100).toFixed(2) }));
}
/* 전경 무대 — 배경(휴대폰 세로는 천천히 좌우로, 움직임 끔이면 멈춤) · 위에 제목 · 구석에 작은 지도 · 아래 1/4 에 카드 띠(그 도시 사람 → 랜드마크).
   지도 점을 누르면 그 카드를 띠에서 찾아 강조하고, 강조된 점을 한 번 더 누르면 카드를 누른 것과 같다(그림 → 한 장, 그림 없음 → 생성기).
   전경 구경(2026-11-24 둘째 — 사용자 「모바일보단 pc에서 확실히 맛이 살긴하는구나」 → 「휴대폰 쪽까지 고친 다음 한 번에 올려줘」): 「전경」 단추 또는 배경 길게 누르기(0.45초 —
   카드 · 점 · 단추 · 길 위는 아님)면 제목 · 지도 · 띠를 감추고 흐름을 멈춘 채 그림을 무대 높이에 맞춰 펴 옆으로 밀어 본다(흐르던 자리부터, 아니면 가운데).
   「돌아가기」 · 「전경」 다시 · Esc · 그림을 한 번 누르기로 나온다. 좁은 화면(600px 이하)은 작은 지도를 「지도」 단추 하나로 접어 두고(이 탭에 기억 city_map_v1), 누르면 편다 */
const NARROW = '(max-width:600px)', MAP_KEY = 'city_map_v1', LONG = 450;
const mapPref = () => { try { return sessionStorage.getItem(MAP_KEY); } catch (e) { return null; } };
function useNarrow() {
  const mq = () => typeof matchMedia === 'function' && matchMedia(NARROW).matches, [on, set] = useState(mq);
  useEffect(() => { if (typeof matchMedia !== 'function') return; const m = matchMedia(NARROW), f = () => set(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return on;
}
function VistaStage({ data, c, world, st, day, file, head, onCard }) {
  const [sel, setSel] = useState(''), strip = useRef(null), bg = useRef(null), look = useRef(null), press = useRef(null), I = IMG();
  const [seeing, setSeeing] = useState(false), at = useRef(0.5), narrow = useNarrow(), [mapOpen, setMapOpen] = useState(() => mapPref() === 'open');
  const cards = [{ key: c.key, ko: c.ko, home: true }].concat(landmarksOf(c)), pins = mapPins(c), wn = W('world.' + world), showMap = !narrow || mapOpen;
  const cardEl = key => strip.current && strip.current.querySelector('[data-card="' + key + '"] .th-vcard');
  const find = key => {
    const el = cardEl(key), box = strip.current; if (!el || !box) return;
    const li = el.parentNode, left = li.offsetLeft - (box.clientWidth - li.offsetWidth) / 2;
    box.scrollTo({ left: Math.max(0, left), behavior: document.documentElement.getAttribute('data-motion') === 'off' ? 'auto' : 'smooth' });
  };
  const tapPin = key => { if (sel === key) { const el = cardEl(key); if (el) el.click(); return; } setSel(key); find(key); };
  const toggleMap = () => { const v = !mapOpen; setMapOpen(v); try { sessionStorage.setItem(MAP_KEY, v ? 'open' : 'closed'); } catch (e) {} };
  /* 들어갈 때 흐르던 자리(background-position-x %)를 잡아 둔다 — 멈춰 있으면 가운데(50%) */
  const enter = () => { const x = bg.current ? parseFloat(getComputedStyle(bg.current).backgroundPositionX) : NaN; at.current = isFinite(x) ? Math.min(1, Math.max(0, x / 100)) : 0.5; setSeeing(true); };
  const leave = () => setSeeing(false);
  useLayoutEffect(() => {   /* 그리는 즉시 붙인다(useEffect 는 한 박자 늦어 들자마자 누른 Esc 를 놓친다) */
    if (!seeing) return;
    const k = e => { if (e.key === 'Escape') { e.stopPropagation(); leave(); } };
    addEventListener('keydown', k, true); return () => removeEventListener('keydown', k, true);
  }, [seeing]);
  const place = () => { const b = look.current; if (b) b.scrollLeft = at.current * Math.max(0, b.scrollWidth - b.clientWidth); };
  /* 배경 길게 누르기 — 카드 · 점 · 단추 · 길 위가 아니고, 0.45초 동안 10px 넘게 움직이지 않을 때 */
  const longOff = () => { if (press.current) { clearTimeout(press.current.t); press.current = null; } };
  useEffect(() => longOff, []);
  const longOn = {
    onPointerDown: e => { if (seeing || e.button > 0 || e.target.closest('button, a, .th-map, .th-vista-strip, .th-vista-tools')) return;
      longOff(); const x = e.clientX, y = e.clientY; press.current = { x, y, t: setTimeout(() => { press.current = null; enter(); }, LONG) }; },
    onPointerMove: e => { const p = press.current; if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) longOff(); },
    onPointerUp: longOff, onPointerCancel: longOff, onPointerLeave: longOff,
    onContextMenu: e => { if (!e.target.closest('button, a')) e.preventDefault(); } };
  /* 구경 — 손가락은 기본 옆 스크롤, 마우스는 끌어서. 움직임 없이 한 번 누르면 나온다 */
  const drag = useRef(null);
  const lookOn = {
    onPointerDown: e => { drag.current = { x: e.clientX, l: look.current.scrollLeft, moved: false, mouse: e.pointerType === 'mouse' }; },
    onPointerMove: e => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 6) d.moved = true; if (d.mouse && e.buttons) look.current.scrollLeft = d.l - dx; },
    onPointerUp: () => { const d = drag.current; drag.current = null; if (d && !d.moved) leave(); },
    onPointerCancel: () => { drag.current = null; } };
  return h('section', Object.assign({ class: 'th-vista' + (seeing ? ' is-look' : '') + (showMap ? ' map-open' : ''), 'data-world': world, 'aria-label': W('city.vista', { world: wn, city: c.ko }) }, longOn),
    h('div', { class: 'th-vista-bg', ref: bg, 'aria-hidden': 'true', style: '--vista:url("' + I.imgURL(file) + '")' }),
    seeing ? h('div', Object.assign({ class: 'th-vista-look', ref: look, role: 'img', 'aria-label': W('city.vista', { world: wn, city: c.ko }) + ' — ' + W('city.look.hint') }, lookOn),
      h('img', { src: I.imgURL(file), alt: '', draggable: false, onLoad: place, ref: el => { if (el && el.complete) requestAnimationFrame(place); } })) : null,
    seeing ? h('button', { type: 'button', class: 'th-look-close', ref: el => { if (el && !el.dataset.f) { el.dataset.f = '1'; el.focus({ preventScroll: true }); } }, onClick: leave }, W('city.look.close')) : null,
    seeing ? h('p', { class: 'th-look-hint', 'aria-hidden': 'true' }, W('city.look.hint')) : null,
    h('div', { class: 'th-vista-top', 'aria-hidden': seeing ? 'true' : undefined }, head),
    pins.length > 1 && showMap ? h('div', { class: 'th-map', role: 'group', 'aria-label': W('city.map'), 'aria-hidden': seeing ? 'true' : undefined },
      h('span', { class: 'th-map-n', 'aria-hidden': 'true' }, h('i', null), W('city.map.north')),
      pins.map(p => h('button', { key: p.key, type: 'button', class: 'th-map-pin' + (p.home ? ' is-home' : '') + (sel === p.key ? ' is-sel' : ''), 'data-card': p.key, tabIndex: seeing ? -1 : undefined,
        style: 'left:' + p.x + '%;top:' + p.y + '%' + (p.home ? ';--pc:' + c.palette.hex[0] : ''),
        'aria-label': p.home ? W('city.map.home', { city: c.ko }) : W(sel === p.key ? 'city.map.pin.sel' : 'city.map.pin', { name: p.ko }), 'aria-pressed': sel === p.key ? 'true' : 'false', title: p.ko,
        onClick: () => tapPin(p.key) }, h('i', { 'aria-hidden': 'true' })))) : null,
    h('div', { class: 'th-vista-tools' },
      pins.length > 1 && narrow ? h('button', { type: 'button', class: 'th-map-toggle', 'aria-expanded': mapOpen ? 'true' : 'false', 'aria-label': W(mapOpen ? 'city.map.fold' : 'city.map.unfold'), tabIndex: seeing ? -1 : undefined, onClick: toggleMap }, W('city.map.toggle')) : null,
      h('button', { type: 'button', class: 'th-look-btn', 'aria-pressed': seeing ? 'true' : 'false', title: W('city.look.label'), onClick: () => (seeing ? leave() : enter()) }, W('city.look'))),
    h('ol', { class: 'th-vista-strip', ref: strip, 'aria-label': W('city.strip', { world: wn, city: c.ko }), 'aria-hidden': seeing ? 'true' : undefined }, cards.map(m => {
      const pic = picOf(data.img, m.key, world, st), fresh = pic && day && markFiles(data.img[m.key], world).some(f => I.isNew(f, day)), on = sel === m.key;
      const kids = [pic ? h('span', { class: 'th-vcard-fig' }, h('img', { src: I.thumbURL(pic), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = I.imgURL(pic); } }))
          : h('span', { class: 'th-vcard-fig is-empty' }, h('i', { 'aria-hidden': 'true' }), W('city.nopic')),
        h('b', null, m.ko), fresh ? h('em', { class: 'th-new' }, W('dex.new')) : null];
      const common = { class: 'th-vcard' + (m.home ? ' is-home' : '') + (on ? ' is-sel' : ''), style: '--rc:var(--w-' + world + ')', tabIndex: seeing ? -1 : undefined, onFocus: () => setSel(m.key) };
      return h('li', { key: m.key, 'data-card': m.key }, pic
        ? h('button', Object.assign({ type: 'button', 'aria-label': W('city.vcard.open', { name: m.ko, world: wn }) + (fresh ? ' — ' + W('dex.lg.new') : ''), onClick: () => onCard(pic, m.key) }, common), kids)
        : h('a', Object.assign({ href: 'prompt.html?card=' + encodeURIComponent(m.key) + '&o=world&world=' + world, 'aria-label': W('city.vcard.draw', { name: m.ko, world: wn }) }, common), kids));
    })));
}

/* 도시 무대. data = { d, own, life, img }, world = 지금 무대 세계(막 · 조명), st = 화풍.
   그 세계 전경이 있으면 머리(돌아가기 · 제목)를 전경 무대(VistaStage) 위에 얹고, 없으면 예전 그대로 */
export function CityStage({ data, city, world, st, from, day, onBack, onCard }) {
  const c = data.d.cities.find(x => x.key === city), worlds = data.d.vocab.worlds;
  const back = W(from === 'dex' ? 'city.back.dex' : 'city.back.globe');
  if (!ready(c)) return h('div', { class: 'th-city' }, h(Crumb, { label: back, onBack }), h(Title, { c }), h('p', { class: 'th-day' }, W('city.pre')));
  const own = (((data.own || {}).cards || {})[city] || {}).worlds || {}, scenes = ((((data.life || {}).cities || {})[city] || {}).scenes || []);
  const vista = vistaOf(data.img, city, world, st), head = [h(Crumb, { key: 'b', label: back, onBack, note: W('city.crumb', { world: W('world.' + world) }) }), h(Title, { key: 't', c })];
  return h('div', { class: 'th-city' + (vista ? ' has-vista' : '') },
    vista ? h(VistaStage, { data, c, world, st, day, file: vista, head, onCard }) : head,
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
          /* 새 그림 점 — 그 랜드마크 그 세계에 오늘 · 어제 등록분 중 이 기기에서 안 연 것(2026-11-22 사용자 「랜드마크에도 신규이미지 등록표시」). 그 랜드마크 그림을 열면 꺼진다(index.html) */
          const fresh = pic && day && markFiles(data.img[m.key], k).some(f => IMG().isNew(f, day));
          return pic ? h('button', { key: k, type: 'button', class: 'th-mark-fig', style: st2, 'aria-label': W('city.mark.open', { name: m.ko, world: W('world.' + k) }) + (fresh ? ' — ' + W('dex.lg.new') : ''), onClick: () => onCard(pic, m.key) },
              h('img', { src: IMG().thumbURL(pic), alt: '', loading: 'lazy', onError: e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG().imgURL(pic); } }),
              fresh ? h('em', { class: 'th-new' }, W('dex.new')) : null)
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
/* 꽉 채우기(lib/fill-view.js, 2026-11-24) — 휴대폰 세로에서 넓은 그림이면 아래 막대에 단추, 그림을 두 번 눌러도. 켜면 높이에 맞춰 옆으로 밀어 보고(밀어 넘기기는 쉰다),
   ← → · 닫기 · 장 바꾸기는 맞춤으로. 꽉 채우기가 뜨는 그림은 한 번 누르기(두 배 반)를 잠깐 기다렸다 한다 — 두 번 누르기와 갈리게 */
function Zoom({ p, alt, onClose, onStep, count, fav }) {
  const [big, setBig] = useState(false), box = useRef(null), touch = useRef(null), F = useFill(p.file, { box: 'stage', off: big }), wait = useRef(0);
  useEffect(() => () => clearTimeout(wait.current), []);
  useEffect(() => { clearTimeout(wait.current); wait.current = 0; }, [F.on]);   /* 두 번 누르기로 펴고 접으면 기다리던 한 번 누르기는 버린다 */
  useEffect(() => {
    const k = e => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && onStep) { e.stopPropagation(); onStep(e.key === 'ArrowRight' ? 1 : -1); }
    };
    addEventListener('keydown', k, true); if (box.current) box.current.focus({ preventScroll: true });
    return () => removeEventListener('keydown', k, true);
  }, []);
  const tap = e => {
    if (F.on || F.can) {
      if (wait.current) { clearTimeout(wait.current); wait.current = 0; return; }
      if (F.on) return;
      const ev = { clientX: e.clientX, clientY: e.clientY, currentTarget: e.currentTarget };
      wait.current = setTimeout(() => { wait.current = 0; zoomAt(ev); }, 320); return;
    }
    zoomAt(e);
  };
  const zoomAt = e => {
    const b = box.current, r = e.currentTarget.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    setBig(v => { if (!v) requestAnimationFrame(() => { if (!b) return; b.scrollLeft = fx * b.scrollWidth - b.clientWidth / 2; b.scrollTop = fy * b.scrollHeight - b.clientHeight / 2; }); return !v; });
  };
  const swipe = {
    onTouchStart: e => { touch.current = big || F.on || e.touches.length > 1 ? null : e.touches[0].clientX; },
    onTouchEnd: e => { const x = touch.current; touch.current = null; if (x == null || big || F.on || !onStep) return; const dx = e.changedTouches[0].clientX - x; if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1); } };
  return h('div', { class: 'th-zoom', role: 'dialog', 'aria-modal': 'true', 'aria-label': alt },
    h('div', Object.assign({ class: 'th-zoom-box' + (big ? ' is-big' : '') + (F.on ? ' is-fill' : ''), ref: el => { box.current = el; F.stageRef(el); }, tabIndex: -1, onClick: e => { if (e.target === e.currentTarget) onClose(); } }, swipe, F.tap),
      F.frame(h, h('img', { key: F.on ? 'fill' : 'fit', src: IMG().imgURL(p.file), alt, onClick: tap }))),
    h('div', { class: 'th-zoom-bar' },
      h('span', null, W(big ? 'card.zoom.out' : F.on ? 'card.zoom.fill.hint' : 'card.zoom.hint'), count ? h('b', { class: 'th-zoom-n' }, count) : null),
      fav || null,
      F.button(h, [W('card.zoom.fill'), W('card.zoom.fit')]),
      h('button', { type: 'button', class: 'th-zoom-close', onClick: onClose }, W('card.zoom.close'))));
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
