/* PixiJS 불러오기 한 곳(2026-11-24 — 들어갈 때 로딩 화면의 빛 입자, lib/splash.js). 원소 공방 lib/holo.js · walk-fx.js 와 같은 판 고정 주소(jsDelivr pixi.js@8.19.0).
   처음 쓸 때 한 번 불러오고, 실패하면 다음에 다시 — 부르는 쪽은 실패를 조용히 넘긴다(입자만 빠진다) */
export const PIXI_URL = 'https://cdn.jsdelivr.net/npm/pixi.js@8.19.0/dist/pixi.min.mjs';
let P = null;
export const loadPixi = () => (P = P || import(PIXI_URL).catch(e => { P = null; throw e; }));
