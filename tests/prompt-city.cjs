/* 지시문 조립(lib/prompt-city.js) — 도시 한 층 · 세 세계(계획 Task 3).
   설계된 도시(서울 · 도쿄 · 뉴욕 2026-11-20 · 로마 · 파리 · 런던 · 베이징 · 이스탄불 · 카이로 · 리우데자네이루 2026-11-21 — 열 곳 모두) × 세 세계 세계 그림(kind 'world')이 (a) 그 세계 표지(vocab.markers.<세계>.en) 셋 이상 (b) 그 도시 motif.en (c) 그 사람 머리색 낱말을 싣고,
   (d) 그 세계 banned_en 낱말이 하나도 없다 — 금지 줄(sections.negative, 칸 꼴 5칸의 「Avoid:」 한 줄)만 빼고 본다. 금지 낱말을 「no …」 로 적는 곳은 그 줄뿐이다
       (원소 조립기의 칸 꼴이 「No …」 금지를 5칸 Avoid 로 모으는 꼴을 따랐다 — 판타지 옷 말투의 「no machinery」 는 Avoid 로 간다).
   (e) 상표 · 실존 인물 이름(아래 작은 표)이 없다 (f) world 가 mecha(세 세계 밖)면 던진다 (g) 설계 미정 도시는 던지지 않고 { text: '', missing: ['worlds'] } — 2026-11-21 리우까지 열 곳이 다 설계돼 설계표 사본에서 리우의 worlds 를 비워 본다.
   살아 있는 화풍(retired 아닌 것) 전부로 본다 — 기본 화풍은 kr_drawn_rim_dewy(2026-11-20 — 삼국지 기본 화풍을 옮김, 그 전 painterly_concept)이지만 임시 화풍도 고르개에 남아 한 화풍에 묶지 않는다.
   Run: node tests/prompt-city.cjs */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['lib/prompt-spec.js', 'lib/look-spec.js', 'lib/casual-tree.js', 'lib/casual-tree-v2.js', 'lib/prompt-city.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const T = ctx.window.AtelierSpec, P = ctx.window.AtelierPrompt, PC = ctx.window.PromptCity;
const D = JSON.parse(fs.readFileSync('data/city-design.json', 'utf8')), S = JSON.parse(fs.readFileSync('data/style.json', 'utf8'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const word = (w, flags) => new RegExp('\\b' + esc(w) + '\\b', flags);

/* 상표 · 실존 인물 이름 — 서울 상징 · 설계에서 새기 쉬운 것(남산 송신탑의 상표 이름, 대기업 · 가게, 왕 · 장군 · 가수). 대소문자 그대로 낱말 경계로 본다 */
const NAMES = ['YTN', 'Sungsimdang', 'Kumdori', 'Hanwha', 'Eagles', 'Hana Citizen', 'KAIST', 'Shinsegae', 'Expo Tower', 'Korail', 'KTX', 'SRT', 'Tashu', 'Daejeon Blues', 'Song Si-yeol', 'Taejo', 'Taejong', 'Park Chung-hee', 'Lee Ungno', 'O-World', 'Mannyeonjang', 'N Seoul Tower', 'Seoul Tower', 'Tokyo Tower', 'Skytree', 'Lotte', 'Samsung', 'Hyundai', 'Kia', 'LG', 'Starbucks', 'Coca-Cola', 'Nike', 'Adidas', 'Apple', 'Gucci', 'Chanel',
  'Disney', 'Pokemon', 'Hello Kitty', 'BTS', 'BLACKPINK', 'Sejong', 'Yi Sun-sin', 'Taejo', 'Gojong', 'Heungseon',
  'Empire State', 'Chrysler', 'Rockefeller', 'Yankees', 'Macy', 'Tiffany', 'Yellow Cab', 'Broadway',   /* 뉴욕(2026-11-20) — 사유 건물 · 상표 · 극장가 이름 */
  'Vespa', 'Lambretta', 'Fiat', 'Ferrari', 'Fendi', 'Bulgari', 'Valentino', 'Nutella', 'Peroni', 'Aperol', 'Campari', 'Lazio', 'AS Roma', 'Caritas',
  'Lotte', 'Shinsegae', 'IPark', 'Haedong Yonggungsa', 'Beomeosa', 'BIFF', 'Dureraum', 'Nurimaru', 'Hanjin', 'Choi Chi-won', 'Syngman Rhee', 'Train to Busan',   /* 부산(2026-11-22) */
  'Singha', 'Chang Beer', 'Leo Beer', 'Krating Daeng', 'Red Bull', 'Thai Airways', '7-Eleven', 'Siam Paragon', 'CentralWorld', 'ICONSIAM', 'King Power', 'Mahanakhon', 'Mandarin Oriental', 'Jim Thompson',
  'Bhumibol', 'Vajiralongkorn', 'Sirikit', 'Chulalongkorn', 'Mongkut', 'Chakri', 'Thaksin', 'Yingluck', 'Tony Jaa', 'Wat Arun', 'Wat Pho', 'Wat Phra Kaew', 'Emerald Buddha', 'Erawan', 'Ramakien', 'Hanuman',   /* 방콕(2026-11-22) */
  'Gaudí', 'Gaudi', 'Güell', 'Guell', 'Jujol', 'Domènech', 'Puig i Cadafalch', 'Cerdà', 'Sagrada', 'Batlló', 'Pedrera', 'FC Barcelona', 'Barça', 'Espanyol', 'Camp Nou', 'Estrella Damm', 'Freixenet', 'Chupa Chups', 'Desigual',
  'Miró', 'Picasso', 'Dalí', 'Montserrat Caballé', 'Freddie Mercury', 'Messi', 'Cruyff',   /* 바르셀로나(2026-11-22) */
  'Utzon', 'Bradfield', 'Bennelong', 'Macquarie', 'Captain Cook', 'Arthur Phillip', 'Kidman', 'Hugh Jackman', 'Cate Blanchett', 'Kylie Minogue', 'Steve Irwin', 'Vivid', 'BridgeClimb', 'Qantas', 'Vegemite', 'Tim Tam',
  'Bunnings', 'Woolworths', 'Westfield', 'Luna Park', 'Speedo', 'Billabong', 'Quiksilver', 'Rip Curl', 'Akubra', 'UGG', 'Sydney Swans', 'Waratahs', 'Rabbitohs', 'Bluey', 'Crocodile Dundee', 'Three Sisters',   /* 시드니(2026-11-22) */
  'Frida', 'Kahlo', 'Diego Rivera', 'Siqueiros', 'Orozco', 'Tamayo', 'Ballet Folklórico', 'Arena México', 'Bimbo', 'Jarritos', 'Telcel', 'Pemex', 'Televisa', 'Sanborns', 'OXXO', 'Club América', 'Cruz Azul', 'Chivas',
  'El Santo', 'Blue Demon', 'Cantinflas', 'Barragán', 'Porfirio', 'Maximilian', 'Moctezuma', 'Cuauhtémoc', 'Guadalupe', 'Huitzilopochtli', 'Quetzalcoatl', 'Tlaloc', 'Coatlicue', 'Catrina',   /* 멕시코시티(2026-11-22) */
  'Bernini', 'Fellini', 'Augustus', 'Caesar', 'Romulus', 'Remus', 'Nero', 'Oceanus', 'Palazzo Poli',   /* 로마(2026-11-21) — 상표 · 구단 · 실존 인물 · 분수 조각 · 사유 궁전 이름 */
  'Eiffel', 'Dior', 'Louis Vuitton', 'Hermès', 'Hermes', 'Cartier', 'Ladurée', 'Laduree', 'Moulin Rouge', 'Galeries Lafayette', 'Lafayette', 'PSG', 'Paris Saint-Germain', 'Bateaux Mouches',
  'Napoleon', 'Marie Antoinette', 'Guimard', 'Haussmann', 'Victor Hugo', 'Quasimodo',   /* 파리(2026-11-21) — 상표 · 사유 카바레 · 백화점 · 구단 · 유람선 상표 · 실존 인물(탑 · 지하철 입구 · 대로를 만든 이 이름도) */
  'Harrods', 'Burberry', 'Selfridges', 'Liberty', 'Fortnum', 'London Eye', 'The Shard', 'Shard', 'Gherkin', 'Routemaster', 'Arsenal', 'Chelsea', 'Tottenham',
  'Sherlock', 'Holmes', 'Harry Potter', 'Hogwarts', 'Paddington', 'Mary Poppins', 'Peter Pan', 'Queen Victoria', 'Victoria', 'Elizabeth', 'Shakespeare', 'Beatles', 'Pugin', 'Big Ben',   /* 런던(2026-11-21) — 상표 · 사유 건물 · 버스 모델 · 구단 · 꾸민 인물 · 실존 인물(시계탑 설계자 · 탑 이름의 여왕도), 빅벤은 지시문엔 생김새로만 */
  'Tsingtao', 'Huawei', 'Xiaomi', 'Alibaba', 'Tencent', 'Lenovo', 'Quanjude', 'Bianyifang', 'Donglaishun', 'Lao She', 'Tiananmen', "Tian'anmen", 'Mao', 'Xi Jinping', 'Puyi', 'Cixi', 'Qianlong', 'Yongle', 'Kublai',
  'Bruce Lee', 'Jackie Chan', 'Mulan', 'Monkey King', 'Sun Wukong',   /* 베이징(2026-11-21) — 상표 · 오리구이 · 샤브샤브 노포 · 찻집 이름 · 정치 장소 · 실존 인물(황제 · 황태후 · 지도자) · 배우 · 꾸민 인물 */
  'Turkish Airlines', 'Galatasaray', 'Fenerbahçe', 'Fenerbahce', 'Beşiktaş', 'Besiktas', 'Efes', 'Simit Sarayı', 'Hafız Mustafa', 'Hafiz Mustafa', 'Hacı Bekir', 'Haci Bekir', 'Kurukahveci',
  'Hürrem', 'Hurrem', 'Roxelana', 'Suleiman', 'Süleyman', 'Atatürk', 'Ataturk', 'Mehmed', 'Murad', 'Justinian', 'Theodora', 'Sinan', 'Hezarfen', 'Hezârfen', 'Evliya', 'Leander',
  'Hagia Sophia', 'Ayasofya', 'Blue Mosque', 'Sultanahmet', 'Topkapı', 'Topkapi', 'Galata Tower', "Maiden's Tower", 'Kız Kulesi',   /* 이스탄불(2026-11-21) — 항공사 · 구단 · 맥주 · 빵집 · 과자 · 커피 노포 · 실존 인물(술탄 · 황후 · 건축가 · 날아간 이 · 여행가) · 처녀의 탑 전설 인물, 예배하는 곳 · 궁전 · 탑 이름은 지시문엔 생김새로만 */
  'Al Ahly', 'Zamalek', 'EgyptAir', 'Egyptair', 'Pepsi', 'Fishawy', 'Naguib Mahfouz', 'Mahfouz', 'Umm Kulthum', 'Mohamed Salah', 'Omar Sharif', 'Abdel Halim',
  'Cleopatra', 'Nefertiti', 'Nefertari', 'Tutankhamun', 'Tutankhamen', 'Ramses', 'Ramesses', 'Khufu', 'Cheops', 'Khafre', 'Menkaure', 'Hatshepsut', 'Akhenaten', 'Saladin', 'Muhammad Ali', 'Mohamed Ali', "Al-Mu'izz", 'Mutawakkil', 'Farghani', 'Nasser', 'Sadat',
  'Isis', 'Osiris', 'Horus', 'Anubis', 'Bastet', 'Khan el-Khalili', 'Al-Azhar', 'Alabaster Mosque', 'Nilometer',   /* 카이로(2026-11-21) — 구단 · 항공사 · 음료 · 찻집 노포 · 작가 · 가수 · 배우 · 선수 · 실존 인물(파라오 · 왕비 · 술탄 · 칼리프 · 측정계를 세운 이 · 대통령) · 신 이름(신 · 동물 머리 형상은 싣지 않는다), 시장 · 공원 · 모스크 · 측정계 이름은 지시문엔 생김새로만 */
  'Havaianas', 'Flamengo', 'Fluminense', 'Vasco', 'Botafogo', 'Guaraná', 'Guarana', 'Brahma', 'Skol', 'Matte Leão', 'Biscoito Globo', 'Globo', 'Copacabana Palace', 'Maracanã', 'Maracana',
  'Mangueira', 'Portela', 'Beija-Flor', 'Salgueiro', 'Mocidade', 'Viradouro', 'Sapucaí', 'Sapucai',
  'Pelé', 'Neymar', 'Ronaldinho', 'Ronaldo', 'Romário', 'Romario', 'Zico', 'Carmen Miranda', 'Anitta', 'Jobim', 'Vinicius', 'Vinícius', 'Girl from Ipanema',
  'Niemeyer', 'Burle Marx', 'Selarón', 'Selaron', 'Landowski', 'Dom Pedro', 'Pedro II', 'Christ', 'Redeemer', 'Cristo Redentor', 'Jesus',   /* 리우데자네이루(2026-11-21) — 샌들 · 음료 · 맥주 · 과자 · 방송 상표, 구단 · 사유 호텔 · 경기장 이름, 삼바 학교 이름, 선수 · 가수 · 작곡가 · 건축가 · 조경가 · 계단을 만든 이 · 조각가 · 황제(실존 인물), 구세주상은 이름 없이 생김새로만(종교 이름도 싣지 않는다) */
  'Venezia FC', 'Reyer', 'Vivaldi', 'Albinoni', 'Casanova', 'Marco Polo', 'Titian', 'Tintoretto', 'Canaletto', 'Bellini', 'Veronese', 'Byron', 'Venini', 'Barovier', 'Seguso', 'Aperol', 'Campari', 'Cynar', "Harry's Bar", 'Florian', 'Quadri', 'Danieli', 'Cipriani', 'Gritti', 'Fortuny', 'Guggenheim', 'Tramontin', 'Roberta di Camerino', 'San Marco', 'St Mark', 'Redentore', 'San Giorgio', 'Frari', 'Campanile', 'Shakespeare', 'Othello', 'Shylock', 'Merchant of Venice', 'Golden Lion',   /* 베네치아(2026-11-25) — 구단 · 작곡가 · 화가 · 유리 공방 · 술 · 카페 · 호텔 · 디자이너 · 성당 · 축제 · 문학 이름(Select · Salute · Basilica 는 흔한 낱말이라 뺀다 — 이스탄불 Basilica Cistern 과 겹친다) */
  'Pilsner Urquell', 'Staropramen', 'Budvar', 'Budweiser', 'Gambrinus', 'Kozel', 'U Fleků', 'Moser', 'Rückl', 'Crystalex', 'Preciosa', 'Becherovka', 'Kofola', 'Tatra', 'Škoda', 'Sparta Praha', 'Slavia Praha',
  'Charles IV', 'Rudolf', 'Kafka', 'Mucha', 'Dvořák', 'Smetana', 'Mozart', 'Don Giovanni', 'Kepler', 'Tycho Brahe', 'Havel', 'Masaryk', 'Jan Hus', 'Wenceslas', 'Libuše', 'Golem', 'Křižík', 'Hanuš', 'Mánes', 'Spejbl', 'Hurvínek', 'Krtek', 'Švejk', 'Lennon Wall', 'Dancing House', 'Týn', 'St Vitus', 'Loreta', 'Strahov', 'St Nicholas', 'Nepomuk',   /* 프라하(2026-11-25) — 맥주 · 유리 · 술 · 차 상표, 구단, 실존 · 꾸민 인물, 건물 · 예배 장소 이름 */
  'Burj Khalifa', 'Khalifa', 'Burj Al Arab', 'Emaar', 'Nakheel', 'Jumeirah', 'Atlantis', 'Etihad', 'flydubai', 'Dubai Mall', 'Mall of the Emirates', 'Ski Dubai', 'Ain Dubai', 'Maktoum', 'Mohammed bin Rashid', 'Zayed', 'Al Nahyan', 'Meraas', 'DAMAC', 'Armani', 'Wild Wadi', 'Madinat', 'Al Wasl', 'Shabab Al Ahli', 'Al Nasr',   /* 두바이(2026-11-25) — 사유 탑 · 호텔 · 개발사 · 항공 · 쇼핑몰 · 왕가 · 구단 이름(Emirates 는 United Arab Emirates 와 겹쳐 뺀다) */
  'Star Ferry', 'Peak Tram', 'Peak Tower', 'Sky Terrace', 'HSBC', 'Bank of China', 'Jumbo Kingdom', 'Duk Ling', 'Aqua Luna', 'The Peninsula', 'Cathay Pacific', 'MTR', 'Vitasoy', "Maxim's", 'Tai Cheong', 'Lin Heung', 'Ocean Park', 'Man Mo', 'Wong Tai Sin', 'Tin Hau', 'Tian Tan', 'Big Buddha', 'Po Lin', 'Symphony of Lights', 'Avenue of Stars', 'Leslie Cheung', 'Anita Mui', 'Wong Kar-wai', 'Chow Yun-fat', 'Andy Lau', 'Tony Leung', 'Maggie Cheung', 'Kitchee',   /* 홍콩(2026-11-25) — 배 · 전차 · 은행 · 호텔 · 항공 · 음료 · 빵집 · 찻집 · 사당 · 배우 · 가수 · 감독 · 구단 이름 */
  'Strauss', 'Moisseiff', 'Hallidie', 'Eppelsheimer', 'Klussmann', 'Precita Eyes', 'Mujeres Muralistas', 'Kavanaugh', 'Kardum', 'Postcard Row', 'Seven Sisters', 'Full House', 'Transamerica', 'Salesforce', 'Ghirardelli', 'Boudin', "Levi's", '49ers', 'Warriors', 'Pier 39', 'Muni', 'Mission Dolores'];   /* 샌프란시스코(2026-11-25) — 다리 · 케이블카를 만든 이, 벽화 모임 · 화가, 집 별명 · 방송, 사유 탑 · 상표, 구단, 부두 · 전차 · 성당 이름(Anchor · Ellis · Morrow · Karl · Giants 는 흔한 낱말이라 뺀다) */

/* 세계 사전 — 정확히 세 세계, 표와 설계표가 같다 */
assert(same(D.vocab.worlds, ['fantasy', 'steampunk', 'cyberpunk']) && same(T.WORLDS.map(w => w.key), D.vocab.worlds), '세계 열쇠 셋(mecha 없음)');
assert(same(Object.keys(T.SILHOUETTES), D.vocab.worlds) && same(Object.keys(T.SILHOUETTE_HEAD), D.vocab.worlds) && same(Object.keys(T.WORLD_SHORT.guard), D.vocab.worlds), '실루엣 · 머리 · 가드도 세 세계');
assert(!/\bmecha\b/i.test(JSON.stringify(T.WORLDS) + JSON.stringify(T.SILHOUETTES) + JSON.stringify(T.EXPOSURE_LAYER)), '표에 mecha 가 남았다');
assert(!S.undecided && S.default === 'kr_drawn_rim_dewy', '화풍 확정 — 기본 kr_drawn_rim_dewy, undecided 없음');

const LIVE = Object.keys(S.styles).filter(k => !S.styles[k].retired);
assert(LIVE.includes(S.default), '기본 화풍이 살아 있다');
const seoul = D.cities.find(c => c.key === 'seoul');
/* 설계된 도시 — 서울(2026-11-19) · 도쿄 · 뉴욕(2026-11-20) · 로마 · 파리 · 런던 · 베이징 · 이스탄불 · 카이로 · 리우데자네이루(2026-11-21 — 열 곳 모두). 세계 그림 · 일상컷 단언은 설계된 도시 모두에 */
const DESIGNED = D.cities.filter(c => Object.keys(c.worlds || {}).length);
assert(['seoul', 'tokyo', 'beijing', 'paris', 'london', 'rome', 'newyork', 'istanbul', 'cairo', 'rio', 'busan', 'bangkok', 'barcelona', 'sydney', 'mexicocity'].every(k => DESIGNED.some(c => c.key === k)) && DESIGNED.length === D.cities.length, '열 곳 모두 설계됨(리우데자네이루 2026-11-21)');
let n = 0;
for (const city of DESIGNED) for (const style of LIVE) for (const w of D.vocab.worlds) {
  const id = city.key + ' ' + style + ' ' + w, r = PC.build({ design: D, styles: S, city: city.key, world: w, style, kind: 'world' }), t = r.text, sw = city.worlds[w], mk = D.vocab.markers[w];
  assert(t.length > 2000 && !r.missing, id + ' 지어진다 ' + t.length);
  assert.equal(t, P.build(D, S, city.key, w, { style }), id + ' PromptCity.build = AtelierPrompt.build(생성기가 부르는 것)');
  /* sections — 칸 꼴 이름, 화풍 미정 표시 */
  assert.equal(r.sections.style_undecided, false, id + ' style_undecided');
  assert(t.includes('adult ' + city.people.en + ' woman —') && t.includes(T.WORLD_SHORT.beauty), id + ' 그 나라 사람 · 미형 줄');
  if (P.worldSectionsOn(S, style)) {
    assert(same(Object.keys(r.sections), ['style_undecided', 'head', 's1', 's2', 's3', 's4', 's5', 'negative']), id + ' sections 열쇠 ' + Object.keys(r.sections));
    assert.equal([r.sections.head, r.sections.s1, r.sections.s2, r.sections.s3, r.sections.s4, r.sections.s5].join('\n\n'), t, id + ' sections 를 이으면 지시문');
    assert(/^Avoid: /.test(r.sections.negative) && r.sections.s5.includes(r.sections.negative), id + ' 금지 줄은 5칸 Avoid');
  }
  const body = r.sections.negative ? t.replace(r.sections.negative, '') : t;
  /* (a) 세계 표지 셋 이상 — 사람에게 싣는 문장(세계 표지 줄)으로 */
  const hits = mk.en.filter(x => t.includes(x));
  assert(hits.length >= 3, id + ' (a) 표지 ' + hits.length);
  assert(/^(?:World marks on her|Her world, carried on her|WORLD MARKS, carried on her clothes, body, props and light): /m.test(t), id + ' (a) 표지를 사람에게 싣는 줄');
  /* (b) 서울 motif · (c) 머리색 낱말 · 장면 · 손에 드는 것 · 그 세계의 서울 */
  assert(t.includes(sw.motif.en.replace(/\.$/, '')), id + ' (b) motif');
  assert(t.includes(T.VOCAB_EN.hair_color[sw.look.silhouette.hair_color]), id + ' (c) 머리색 ' + sw.look.silhouette.hair_color);
  assert(t.includes(sw.scenes[0].en) && t.includes(sw.hold.en) && t.includes(sw.en), id + ' 첫 장면 · hold · 세계 글');
  /* (d) 금지 낱말 — 금지 줄 밖에 없다 */
  for (const b of mk.banned_en) assert(!word(b, 'i').test(body), id + ' (d) 금지 낱말 「' + b + '」');
  for (const u of ((sw.own_vocab || {}).unban_en || [])) assert(!word(u, 'i').test(r.sections.negative || ''), id + ' 그 도시가 뺀 금지 낱말 「' + u + '」 은 Avoid 에도 없다');
  /* (e) 상표 · 사람 이름 */
  for (const nm of NAMES) assert(!word(nm).test(t), id + ' (e) 이름 「' + nm + '」');
  /* 장르 이름에 기대지 않는다 — 세계 줄 머리에 장르 낱말이 없다(3칸 머리 「COSTUME — FANTASY」 같은 칸 이름은 둔다) */
  assert(!/\b(?:high-fantasy|steampunk|cyberpunk)\b/i.test(body.replace(/^3\. COSTUME — [A-Z]+$/m, '')), id + ' 장르 이름');
  assert(!/[가-힣]/.test(t) && !/\b(?:element|atomic|Nation|House|citizen)\b/.test(t) && !/\bmecha\b/i.test(t), id + ' 한국어 · 원소 말');
  assert(!/\.\./.test(t) && !/: \./.test(t) && !/\bundefined\b/.test(t), id + ' 찌꺼기');
  n++;
}
/* 장면 · 시간 · 자세 · 실루엣을 고르면 그것 */
{
  const sc = seoul.worlds.cyberpunk.scenes[2], sil = T.SILHOUETTES.cyberpunk[0];
  const t = P.build(D, S, 'seoul', 'cyberpunk', { shot: { scene: sc.key, time: 'night', pose: 'kneel', frame: sil.key } });
  assert(t.includes(sc.en) && !t.includes(seoul.worlds.cyberpunk.scenes[0].en) && t.includes(sil.en) && /Time & weather: night/.test(t) && t.includes('Down on one knee'), '고른 장면 · 시간 · 자세 · 실루엣');
  assert(T.SILHOUETTES.cyberpunk.length >= 6, '사이버펑크 실루엣');
}
/* 노출 단계 — 설계표 vocab.wear 의 그 세계 말투 */
for (const w of D.vocab.worlds) for (const k of ['low', 'moderate', 'bold']) {
  const t = P.build(D, S, 'seoul', w, { look: { exposure: k } }), want = D.vocab.wear[w][k].replace(/^EXPOSURE/, 'Exposure').replace(/Chest and pelvis covered/g, 'Intimate areas covered');
  assert(t.includes(want), w + ' 노출 ' + k);
}
/* 직접 고른 외형이 설계를 이긴다 */
{
  const t = P.build(D, S, 'seoul', 'fantasy', { look: { params: { 'hair color': 'silver' } } });
  assert(t.includes('Chosen look (overrides the automatic look): hair color: silver.') && !t.includes(T.VOCAB_EN.hair_color.navy), '고른 머리색');
}
/* (f) 세 세계 밖은 던진다 */
for (const bad of ['mecha', 'modern', '', undefined]) {
  assert.throws(() => PC.build({ design: D, styles: S, city: 'seoul', world: bad }), /unknown world/, '(f) ' + bad);
  assert.throws(() => P.build(D, S, 'seoul', bad, {}), /unknown world/, '(f) AtelierPrompt ' + bad);
}
/* (g) 설계 미정 도시 — 던지지 않고 비운다(mecha 는 먼저 던진다). 2026-11-21 리우까지 열 곳이 다 설계돼 실제 설계표엔 미정이 없다 —
   설계표 사본(메모리)에서 리우의 worlds 를 {} 로 비워 미정 길을 그대로 본다(저장소 자료는 안 건드림) */
assert.equal(D.cities.filter(c => !Object.keys(c.worlds || {}).length).length, 0, '실제 설계표엔 설계 미정이 없다(열 곳 모두 설계)');
const DU = JSON.parse(JSON.stringify(D)); DU.cities.find(c => c.key === 'rio').worlds = {};
const undesigned = DU.cities.filter(c => !Object.keys(c.worlds || {}).length);
assert(undesigned.length === 1 && undesigned[0].key === 'rio', '사본의 설계 미정 하나(리우)');
for (const c of undesigned) for (const w of DU.vocab.worlds) {
  const r = PC.build({ design: DU, styles: S, city: c.key, world: w });
  assert(r.text === '' && same(r.missing, ['worlds']), '(g) ' + c.key + ' ' + w);
  assert.equal(P.build(DU, S, c.key, w, {}), '', c.key + ' 생성기 쪽도 빈 글');
  assert(same(P.worldsOf(DU, c.key), []), c.key + ' 사는 세계 없음');
}
assert.throws(() => PC.build({ design: D, styles: S, city: 'atlantis', world: 'fantasy' }), /unknown city/);
/* ══ 일상컷(kind 'casual', Task 4) — 그 세계의 서울의 하루 ══
   서울 × 세 세계 × 생활 장면 전부 × 살아 있는 화풍: 그 장면의 그 세계 글(Place) · 그 세계 소품(Around her) · 옷의 결 · 그 세계의 서울 줄,
   (d) 판타지 · 스팀펑크 금지 낱말은 맨 끝 Avoid 단락(sections.negative) 밖에 없다, 소품 낱말이 그 세계 것(phone → 판타지는 전령 수정, smartphone 없음) */
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const tree = J('data/casual-tree.json'), tree2 = J('data/casual-tree-v2.json'), LIFE = J('data/city-life.json'), PROPS = J('data/world-props.json');
/* 세계마다의 명소 낱말 — 일상컷 세계 줄에 나오면 일곱 장 뒷배경이 다 같아진다(장소 줄이 말하면 괜찮다) */
const LANDMARKS = { fantasy: ['great tree', 'world-tree', 'moon', 'palace', 'spire'], steampunk: ['airship', 'airships', 'clocktower', 'clock tower', 'docking tower', 'city gate', 'pleasure boat'],
  cyberpunk: ['space-elevator', 'space elevator', 'arcology', 'sky-bridge', 'maglev', 'transmission tower', 'glass dome', 'guardian beast', 'haechi'] };
const cas = (w, scene, style, city = 'seoul') => PC.build({ design: D, styles: S, city, world: w, style, kind: 'casual', casual: { scene, tree, tree2, life: LIFE, props: PROPS } });
let nc = 0;
for (const city of DESIGNED) for (const style of LIVE) for (const w of D.vocab.worlds) for (const s of LIFE.cities[city.key].scenes) {
  const id = 'casual ' + city.key + ' ' + style + ' ' + w + ' ' + s.key, sw = s.worlds[w], mk = D.vocab.markers[w];
  const r = cas(w, { place: P.lifeKey(city.key, s.key), time: (s.times || [])[0], season: (s.seasons || ['autumn'])[0] }, style, city.key), t = r.text;
  assert(t.length > 1000 && !r.missing, id + ' 지어진다');
  assert.equal(t, P.buildCasual(D, S, city.key, { place: P.lifeKey(city.key, s.key), time: (s.times || [])[0], season: (s.seasons || ['autumn'])[0] }, { world: w, style, tree, tree2, life: LIFE, props: PROPS }), id + ' PromptCity = AtelierPrompt.buildCasual');
  assert.equal([r.sections.head, r.sections.body, r.sections.negative].filter(Boolean).join('\n\n'), t, id + ' sections 를 이으면 지시문');
  assert(t.includes('the same adult ' + city.people.en + ' woman') && t.includes(T.CASUAL.short.beauty), id + ' 일상컷 — 그 나라 사람 · 미형 줄');
  assert(t.includes('\nPlace: ' + sw.en.replace(/\.$/, '') + '.\n'), id + ' 그 장면의 그 세계 글');
  const own = (city.worlds[w] || {}).own_vocab || {};   /* 도시별 말(2026-11-20 own_vocab) — 있으면 공용 대신 */
  for (const k of sw.props) assert(t.includes((own.props || {})[k] || PROPS.props[k].worlds[w].en), id + ' 소품 ' + k);
  /* 세계 줄 = 그 세계의 결(vocab.casual_world — 2026-11-19 「일부러 뒷배경은 다 나오게 만든거야?」), 다음 줄이 guard. 명소 낱말은 장소 줄이 말할 때만 */
  const cw = own.casual_world || D.vocab.casual_world[w], wl = (t.match(/^World: .*$/m) || [''])[0], pl = (t.match(/^Place: .*$/m) || [''])[0];
  assert(t.includes(PROPS.clothes[w].en) && wl.startsWith('World: an ordinary day in ' + city.en + ' as her world knows it — ' + cw.en.replace('{city_en}', city.en).replace(/\.$/, '')) && t.includes(wl + '\n' + cw.guard_en), id + ' 옷의 결 · 그 세계의 결 · guard');
  for (const lm of LANDMARKS[w]) assert(!word(lm, 'i').test(wl) || word(lm, 'i').test(pl), id + ' 세계 줄에 명소 「' + lm + '」');
  for (const o of D.vocab.worlds.filter(x => x !== w)) assert(!t.includes(sw.en === s.worlds[o].en ? '\u0000' : s.worlds[o].en), id + ' 다른 세계 글이 안 샌다');
  const body = r.sections.negative ? t.replace(r.sections.negative, '') : t;
  for (const b of mk.banned_en) assert(!word(b, 'i').test(body), id + ' (d) 금지 낱말 「' + b + '」');
  /* Avoid 단락엔 그 세계 금지 낱말 — 그 도시 own_vocab.unban_en 은 빼고(2026-11-21 베이징 — 자금성 · 장성이 그 도시 자체), 뺀 낱말은 Avoid 에도 없다 */
  const unban = own.unban_en || [], banHere = mk.banned_en.filter(b => !unban.includes(b));
  if (banHere.length) assert(/^Avoid: /.test(r.sections.negative) && r.sections.negative.includes(banHere.join(', ')), id + ' 그 세계 금지 낱말은 Avoid 단락에');
  for (const u of unban) assert(!word(u, 'i').test(r.sections.negative || ''), id + ' 뺀 금지 낱말 「' + u + '」 은 Avoid 에도 없다');
  assert(!/(?:cape|crown|pauldrons?|tiara|regalia)/i.test(body) && !/Her city/.test(t) && !t.includes(mk.en[0]), id + ' 일상컷에 세계 그림용 motif 가 없다');
  for (const nm of NAMES) assert(!word(nm).test(t), id + ' (e) 이름 「' + nm + '」');
  assert(!/[가-힣]/.test(t) && !/\b(?:element|kingdom|atomic|mecha)\b/i.test(t) && !/\bundefined\b/.test(t) && !/\.\./.test(t), id + ' 한국어 · 원소 말 · 찌꺼기');
  nc++;
}
/* 소품 사전 — 트리 소품 동작의 물건도 그 세계 낱말(PROP 줄) */
for (const w of D.vocab.worlds) {
  const r = cas(w, { place: 'seoul_subway_commute', frame: 'waist_up', right: 'prop', use: 'phone_look' }), pl = (r.text.match(/^PROP: .*$/m) || [''])[0];
  assert(pl.includes(PROPS.props.phone.worlds[w].en) && !/\bsmartphone\b/i.test(r.text.replace(r.sections.negative, '')), w + ' 휴대폰 → ' + PROPS.props.phone.worlds[w].en + ' — ' + pl);
}
assert(/messenger crystal/.test(PROPS.props.phone.worlds.fantasy.en) && /telegraph/.test(PROPS.props.phone.worlds.steampunk.en) && /holographic/.test(PROPS.props.phone.worlds.cyberpunk.en), '휴대폰 사전');
/* 같은 장면이 세 세계로 — 세 글이 다 다르다 */
for (const city of DESIGNED) for (const s of LIFE.cities[city.key].scenes) assert.equal(new Set(D.vocab.worlds.map(w => s.worlds[w].en)).size, 3, s.key + ' 세 세계 글이 서로 다르다');
/* 생활 장면 → 트리 장소(lifeTree) — 받침은 base 것, 땅은 서울, 다른 도시 카드엔 안 뽑힌다 */
{
  const t2 = P.lifeTree(tree2, tree, LIFE), s = LIFE.cities.seoul.scenes[0], k = P.lifeKey('seoul', s.key);
  assert(t2 !== tree2 && P.lifeTree(tree2, tree, LIFE) === t2 && !tree2.places[k], 'lifeTree — 사본 · 메모 · 원본은 그대로');
  assert(same(t2.places[k], tree2.places[s.base]), '받침은 base 것');
  assert(same(t2.place_lands[k], ['seoul']), '땅은 서울');
  const C2 = ctx.window.AtelierCasualTreeV2, T2 = C2.make(t2, tree);
  assert(C2.choices(T2, { era: 'now' }, 'place', { land: 'seoul' }).includes(k) && !C2.choices(T2, { era: 'now' }, 'place', { land: 'tokyo' }).includes(k), '서울 카드에만');
  assert.equal(P.lifeScene(LIFE, k).key, s.key);
}
/* 세 세계 밖 · 설계 미정은 세계 그림과 같이 */
assert.throws(() => cas('mecha', {}), /unknown world/);
assert(same(PC.build({ design: DU, styles: S, city: undesigned[0].key, world: 'fantasy', kind: 'casual', casual: { tree, tree2, life: LIFE, props: PROPS } }).missing, ['worlds']), '설계 미정 도시 일상컷(사본)');
/* ══ 기본 화풍 kr_drawn_rim_dewy(2026-11-20 — 사용자 「기본화풍도 아까 테스트했던 화풍으로 바꿔줘. 마지막 기준」) ══
   서울 세 세계 시험(scratchpad style1/build.cjs · casual/swap3.py)을 조립기가 그대로 — 세계 그림: STYLE 칸 화풍 글 · 얼굴 비율 줄 = worldFace ·
   「Face — her own:」 다음 줄 = worldStyleAfter · 빛 줄 = worldLight · Avoid 에 삼국지 avoid 셋. 일상컷: Style 줄 = casual 글, 다음 줄 = casualStyleAfter. 실사 문구 없음 */
{
  const KR = S.styles.kr_drawn_rim_dewy, kv = KR.versions.find(v => v.v === KR.current);
  assert(kv.model === 'gpt-image-2.6-sunburst' && !('worldHead' in kv), 'kr — 모델 2.6 · 삼국지 머리말(worldHead) 안 옮김');
  const REAL = /semi-realistic depth|A semi-realistic face|semi-realistic/i;
  for (const w of D.vocab.worlds) {
    const t = PC.build({ design: D, styles: S, city: 'seoul', world: w, kind: 'world' }).text, L = t.split('\n'), id = 'kr ' + w;
    const s1 = t.split('\n\n')[1].split('\n');
    assert(s1[0] === T.CORE_FRAME.s1 && s1[1] === kv.text && s1[1].startsWith('Korean MMORPG character artwork. A painterly face with naturally observed facial anatomy'), id + ' STYLE 칸 첫 줄 = 화풍 글');
    assert(s1.includes(T.WORLD_SHORT.beauty) && s1.includes('Face proportions: ' + kv.worldFace) && !t.includes(T.WORLD_SHORT.face.slice(0, 40)), id + ' 미형 줄 · 얼굴 비율 = worldFace');
    const fi = L.findIndex(l => l.startsWith('Face — her own: '));
    assert(fi > 0 && L[fi + 1] === kv.worldStyleAfter && L[fi + 1].startsWith('Skin finish: dewy'), id + ' 「Face — her own:」 다음 줄 = Skin finish');
    assert.equal(L.filter(l => /^Light: /.test(l)).join(), kv.worldLight, id + ' 빛 줄 = worldLight');
    const av = L.find(l => /^Avoid: /.test(l));
    for (const a of kv.avoid) assert(av.includes(a), id + ' Avoid 에 「' + a + '」');
    assert(t.includes('adult ' + seoul.people.en + ' woman —') && !REAL.test(t), id + ' 그 나라 사람 머리 · 실사 문구 없음');
    assert.equal(P.fileName('seoul', w, S.default), 'seoul_' + w + '_kr_drawn_rim_dewy_f.webp', id + ' 파일 이름에 화풍 열쇠');
  }
  for (const w of D.vocab.worlds) {
    const t = cas(w, {}).text, L = t.split('\n'), si = L.findIndex(l => l.startsWith('Style: '));
    assert(L[si] === 'Style: ' + kv.casual && L[si + 1] === kv.casualStyleAfter && L[si + 1].startsWith('SKIN FINISH: '), 'kr 일상컷 ' + w + ' Style 줄 · 다음 줄 SKIN FINISH');
    assert(!REAL.test(t) && !t.includes(T.CASUAL.short.keep), 'kr 일상컷 ' + w + ' 실사 문구 · keep 문장 없음(시험 꼴)');
    assert.equal(P.casualFile('seoul', w, S.default, 2), 'seoul_' + w + '_kr_drawn_rim_dewy_f_casual2.webp', 'kr 일상컷 파일 이름');
  }
  /* painterly_concept(칸 없는 화풍)는 예전 글 그대로 — 얼굴 비율 줄은 표 글, Skin finish · SKIN FINISH 없음, 일상 Style 줄 끝에 keep */
  const pt = P.build(D, S, 'seoul', 'steampunk', { style: 'painterly_concept' }), pc = cas('steampunk', {}, 'painterly_concept').text;
  assert(pt.includes(T.WORLD_SHORT.face.replace('described above', 'described below')) && !/Skin finish|SKIN FINISH|Korean MMORPG/.test(pt + pc) &&
    pc.includes('Style: ' + S.styles.painterly_concept.versions[0].casual + ' ' + T.CASUAL.short.keep), 'painterly_concept 는 예전 글');
}
/* 카드 = 도시 */
assert(same(P.cards(D).filter(k => !k.includes('-')), D.cities.map(c => c.key)) && P.card(D, 'seoul').tier === 'city' && same(P.worldsOf(D, 'seoul'), D.vocab.worlds) && P.card(D, 'seoul-x') === null, '카드 = 도시 열쇠');
const rec = P.record(D, S, 'seoul', 'steampunk', {});
assert(rec.atelier === 'city' && rec.styleUndecided === false && rec.file === 'seoul_steampunk_' + S.default + '_f.webp' && rec.prompt === P.build(D, S, 'seoul', 'steampunk', {}), '기록');
/* GPT 설계 주문 — 칸 채우기(2026-11-20 삼국지에서 옮김): 주문 = 안내 + 우리 설계 지시문(칸 표시), 원소 말 없음 · 칸만 바꾼 글은 통과 · 칸 밖 · 두 장 같음은 걸림 */
const FACE_TOK = ['IMPRESSION', 'SKIN TONE', 'FACE SHAPE', 'EYE SHAPE', 'EYE COLOUR', 'BROWS', 'NOSE', 'LIPS'];
for (const card of ['seoul', 'seoul-haechi']) for (const w of D.vocab.worlds) {
  const f = P.buildWorldFree(D, S, card, w, {}), tpl = P.worldFillTemplate(D, S, card, w, {}), id = card + ' ' + w + ' 칸 채우기';
  assert(f.endsWith(tpl) && !/\b(?:element|atomic|mecha)\b/i.test(f) && f.includes('Must differ — costume silhouette'), id + ' 주문');
  assert(['[HAIRSTYLE: …]', '[HAIR COLOUR: …]', '[COSTUME SILHOUETTE: …]', 'Design idea: …', 'Stance and hands: …', 'Setting detail: …'].concat(FACE_TOK.map(k => '[' + k + ': …]')).every(x => tpl.includes(x)), id + ' 칸');
  const B = f.split('\n\n'), lst = h => B.find(x => x.startsWith(h)).split(/: 1\) /)[1].split(/; \d+\) /).map(x => x.replace(/\.$/, ''));
  const face = Object.fromEntries(B.find(x => x.startsWith('Must differ — her face')).split(' | ').map(x => { const m = x.match(/([A-Z ]+) — (.*)$/); return [m[1].trim(), m[2].replace(/\.$/, '').split(/; \d+\) |^1\) /).filter(Boolean)]; }));
  const sil = lst('Must differ — costume'), body = tpl.includes('[BUILD: …]') ? lst('Must differ — build') : null, hcol = lst('Must differ — hair colour');   /* 머리색 · 체형도 우리 것 뺀 목록(2026-11-20) */
  const lk = c => P.lookOf(P.card(D, card), w).silhouette[c], en = (a, k) => T.VOCAB_EN[a][k];
  assert(!hcol.includes(en('hair_color', lk('hair_color')).replace(/\.$/, '')) && (!body || !body.includes(en('body', lk('body')))), id + ' 머리색 · 체형 목록에 우리 것 없음');
  const mk = n => 'SUMMARY: test\n' + tpl.replace('[HAIRSTYLE: …]', n ? 'a sleek high ponytail' : 'a soft low chignon').replace('[COSTUME SILHOUETTE: …]', sil[n]).replace('[BUILD: …]', body ? body[n] : '').replace('[HAIR COLOUR: …]', hcol[n])
    .replace(/\[([A-Z ]+): …\]/g, (_, k) => face[k][n]).replace('Design idea: …', 'Design idea: a hem cut in the stepped outline of the city wall.').replace('Stance and hands: …', 'Stance and hands: one hand raised.').replace('Setting detail: …\n', '');
  const ok = P.worldFillErrors(D, S, card, w, mk(0), {}, mk(1)); assert(ok.length === 0, id + ' 칸만 채움 → 통과 ' + ok.slice(0, 3));   /* vm 쪽 배열이라 deepEqual 대신 길이 */
  const bad = P.worldFillErrors(D, S, card, w, mk(0).replace('\nComposition:', '\nComposition: wide'), {}, mk(0));
  assert(bad.some(e => e.startsWith(T.WORLD_FREE.msg.line_changed)) && bad.includes(T.WORLD_FREE.msg.two_hair) && bad.includes(T.WORLD_FREE.msg.two_sil) && bad.includes(T.WORLD_FREE.msg.two_hcol) && (!body || bad.includes(T.WORLD_FREE.msg.two_body)), id + ' 칸 밖 · 두 장 같음 → 걸림 ' + bad.slice(0, 3));
}
/* 랜드마크 카드(2026-11-20) — 열쇠 <도시>-<랜드마크> 를 card 한 곳에서 푼다 */
const LK = P.card(D, 'seoul-haechi');
assert(LK && LK.tier === 'landmark' && LK.parent === 'seoul' && LK.people === 'Korean', '랜드마크 카드');
assert(same(P.cards(D).slice(0, 2), ['seoul', 'seoul-haechi']), '도시 바로 뒤에 그 랜드마크');
assert(same(P.worldsOf(D, 'seoul-haechi'), ['fantasy', 'steampunk', 'cyberpunk']), '랜드마크 세계');
assert.equal(P.landmarksOf(D, 'tokyo').length, 3, '도쿄 랜드마크 셋(2026-11-21 — 서울 빼고 아홉 도시에 셋씩)');
{ const D0 = JSON.parse(JSON.stringify(D)); D0.cities.find(c => c.key === 'tokyo').landmarks = [];   /* 이제 랜드마크 없는 도시가 없다 — 사본에서 비워 본다 */
  assert(same(P.landmarksOf(D0, 'tokyo'), []), '랜드마크 없는 도시'); }
assert.equal(P.parentOf('seoul-haechi'), 'seoul');
assert(P.card(D, 'seoul').tier === 'city' && P.card(D, 'seoul-nope') === null, '도시 카드 그대로 · 없는 랜드마크 null');
for (const w of T.WORLDS.map(x => x.key)) { const t = PC.build({ design: D, styles: S, city: 'seoul-haechi', world: w, style: S['default'], kind: 'world' }).text;
  assert(/personification of Haechi, a landmark of the city of Seoul/.test(t) && !/haechi_/.test(t), w + ' 랜드마크 머리 줄'); }
{ const s = LIFE.cities.seoul.scenes[0], sc = { place: P.lifeKey('seoul', s.key), time: (s.times || [])[0], season: (s.seasons || ['autumn'])[0] };
  const r = cas('fantasy', sc, S['default'], 'seoul-haechi'), t = r.text;
  assert(t.length > 1000 && !r.missing, '랜드마크 일상컷 — 서울 생활 장면이 지어진다');
  assert(t.includes(s.worlds.fantasy.en), '랜드마크 일상컷 Place');
  assert(t.includes('an ordinary day in Seoul'), '랜드마크 일상컷 — 부모 도시 줄'); }
/* 랜드마크 세계는 부모 도시 세계의 palette · own_vocab 을 물려받는다(서울 판타지 태극 색 · 서울 말) */
{ const sf = D.cities.find(c => c.key === 'seoul').worlds.fantasy, t = PC.build({ design: D, styles: S, city: 'seoul-haechi', world: 'fantasy', style: S['default'], kind: 'world' }).text;
  assert(t.includes(sf.palette.en) && !t.includes('Seoul red (dancheong red)'), '해치 판타지 — 서울 판타지 palette 를 물려받음');
  const s0 = LIFE.cities.seoul.scenes[0], r = cas('fantasy', { place: P.lifeKey('seoul', s0.key), time: (s0.times || [])[0], season: (s0.seasons || ['autumn'])[0] }, S['default'], 'seoul-haechi').text;
  assert(r.split('\n').some(l => l.startsWith('World: ') && l.includes(sf.own_vocab.casual_world.en)), '해치 판타지 일상컷 World 줄 — 서울 own_vocab'); }

/* 놀이터(k_kids, 2026-11-25) — 노출 축을 많이(bold)로 줘도 지시문에 드러내는 노출 글이 없고, 배경 아이들 · 덮인 옷 줄이 실린다. 상황 노출도 안 실린다 */
for (const style of LIVE) for (const w of D.vocab.worlds) {
  const o = cas(w, { place: 'playground', ofam: 'everyday', situ: 'wet', axes: { skin_exposure: 'bold' }, posture: 'swing_sit', frame: 'full_body' }, style), txt = typeof o === 'string' ? o : o.text;
  assert(/children may appear only as small, soft-focus background figures/.test(txt) && /fully non-revealing/.test(txt), 'playground kids lines ' + style + ' ' + w);
  assert(!/most revealing|natural cleavage|more scene-appropriate shoulder|skin clearly showing|Situation: right now/i.test(txt), 'playground bold exposure ' + style + ' ' + w + '\n' + txt);
}

console.log('PASS 지시문 조립: ' + DESIGNED.map(c => c.ko).join(' · ') + ' × 세 세계 × 화풍 ' + LIVE.length + ' = ' + n + '장 — 표지 · motif · 머리색 · 금지 낱말(Avoid 줄 밖) · 이름 · mecha 던짐 · 설계 미정 ' + undesigned.length + '곳(사본) · 노출 · 고른 칸; ' +
  '일상컷 ' + nc + '장(' + DESIGNED.map(c => c.ko + ' 생활 장면 ' + LIFE.cities[c.key].scenes.length).join(' · ') + ' × 세 세계 × 화풍) — 그 세계 장면 글 · 소품 · 옷의 결 · 금지 낱말(Avoid 단락 밖) · 휴대폰 사전 · lifeTree');
