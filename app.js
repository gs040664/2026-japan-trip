/**
 * 202611JapanTrip - 仙台・宮城・田代島(貓島) 6天5夜行程表 核心互動邏輯 (app.js)
 * 特色：全行程嚴格地理區域集中與純單向順行規劃，杜絕折返跑 (Geographically Clustered & Strict Linear Flow)
 * 住宿：田代島漁師民宿、秋保溫泉 瑞鳳大旅館、仙台大都會飯店、仙台遠景飯店
 */

// ==========================================================================
// 1. Google Maps 50 處真實景點資料庫 (含 田代島、秋保大瀑布、瑞鳳大旅館 等)
// ==========================================================================
const SPOTS_DATA = [
  {
    id: 101,
    name: "田代島 (貓島 / Tashirojima)",
    rawTitle: "田代島 仁斗田港 (貓島)",
    area: "tashirojima_ishinomaki",
    areaName: "田代島・石卷",
    lat: 38.2934,
    lng: 141.4239,
    type: "spot",
    typeName: "必訪貓島",
    address: "日本宮城縣石卷市田代島 (仁斗田港)",
    note: "🌟 必訪核心亮點！全日本最著名貓島，島上貓比人多，親人可愛。夜宿島上「漁師民宿 はま屋」，享受無遊客干擾的專屬貓咪時光與現撈海鮮大餐！",
    day: 3
  },
  {
    id: 102,
    name: "石卷中央發著所 (網地島線渡輪碼頭)",
    rawTitle: "網地島ライン 石巻中央発着所",
    area: "tashirojima_ishinomaki",
    areaName: "田代島・石卷",
    lat: 38.4285,
    lng: 141.3065,
    type: "transit",
    typeName: "渡輪碼頭",
    address: "宮城縣石卷市中央 1-14-5",
    note: "前往田代島的客船碼頭。自 JR 石卷站步行 17 分鐘（1.1km 漫畫之街）即達。09:00 啟航，船票單程 ¥1,250（售票機投現金）。",
    day: 3
  },
  {
    id: 103,
    name: "JR 石卷站 (Ishinomaki Station)",
    rawTitle: "JR 石巻駅",
    area: "tashirojima_ishinomaki",
    areaName: "田代島・石卷",
    lat: 38.4343,
    lng: 141.3031,
    type: "transit",
    typeName: "JR車站",
    address: "宮城縣石卷市鑄錢場 9-1",
    note: "JR 仙石東北線（快速列車）起迄站，從仙台站出發 07:24 發車 08:24 抵達 (車程 60分，單程 ¥860，刷 Suica)。",
    day: 3
  },
  {
    id: 104,
    name: "秋保大瀑布 (Akiu Great Falls / 秋保大滝)",
    rawTitle: "秋保大滝 国指定名勝",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2745,
    lng: 140.6015,
    type: "spot",
    typeName: "日本三大名瀑",
    address: "宮城縣仙台市太白區秋保町馬場字大滝",
    note: "日本三大名瀑之一・國指定名勝！落差 55 公尺，秋季滿山金黃楓紅環繞，氣勢雄偉震撼。設有展望台與瀑潭步道。",
    day: 5
  },
  {
    id: 1,
    name: "仙台麵包超人兒童博物館&購物商場",
    rawTitle: "仙台麵包超人兒童博物館&購物商場",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2618,
    lng: 140.8906,
    type: "spot",
    typeName: "名勝/體驗",
    address: "宮城縣仙台市宮城野區小田原山本町 101-14",
    note: "適合採買特色伴手禮與限定現烤麵包造型點心，仙台站東口步行 9 分鐘。",
    day: 6
  },
  {
    id: 2,
    name: "Sendai Gyutan Taka (炭烤牛舌 閣)",
    rawTitle: "Sendai Gyutan Taka",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2612,
    lng: 140.8719,
    type: "food",
    typeName: "美食/牛舌",
    address: "宮城縣仙台市青葉區一番町 4-5-34",
    note: "米其林推薦仙台頂級厚切炭烤牛舌！獨家特製牛舌刺身與炭火香氣絕讚。",
    day: 1
  },
  {
    id: 3,
    name: "Serisoan Sendai-Ekimae (芹菜鍋名店)",
    rawTitle: "Serisoan Sendai-Ekimae 仙台南町通ビル 2F",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2589,
    lng: 140.8795,
    type: "food",
    typeName: "美食/鍋物",
    address: "宮城縣仙台市青葉區中央 3-6-12 仙台南町通大樓 2F",
    note: "冬季仙台在地必吃名物：水芹鴨肉鍋（包含爽脆水芹根部一起涮煮）。",
    day: 1
  },
  {
    id: 5,
    name: "仙台車站 (Sendai Station)",
    rawTitle: "仙台駅 3F 牛たん通り・ずんだ小径",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2601,
    lng: 140.8824,
    type: "transit",
    typeName: "交通樞紐",
    address: "宮城縣仙台市青葉區中央 1-1-1",
    note: "東北最大交通樞紐，3F 為著名的牛舌通與毛豆泥小徑，B1 為土產銘菓街。",
    day: 1
  },
  {
    id: 6,
    name: "Itagaki 百年水果甜點本店",
    rawTitle: "Itagaki Main Shop (Fruit and Sweets)",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2625,
    lng: 140.8895,
    type: "food",
    typeName: "下午茶/甜點",
    address: "宮城縣仙台市宮城野區二十人町 300-1",
    note: "1897 年創立的百年水果老店，招牌為當季極致水果聖代、生乳卷與鮮果汁。",
    day: 2
  },
  {
    id: 7,
    name: "どら焼き専門店まるごと (DORAYAKI MARUGOTO)",
    rawTitle: "どら焼き専門店まるごと 上杉五番館 103號",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2758,
    lng: 140.8732,
    type: "food",
    typeName: "日式甜點",
    address: "宮城縣仙台市青葉區上杉 5-1-1 上杉五番館 103號",
    note: "排隊名店！現烤鬆軟餅皮包裹飽滿紅豆與當季鮮奶油的爆漿銅鑼燒。",
    day: 2
  },
  {
    id: 8,
    name: "名掛丁商店街 (Nakakecho Arcade)",
    rawTitle: "名掛丁商店街",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2618,
    lng: 140.8812,
    type: "spot",
    typeName: "購物街區",
    address: "宮城縣仙台市青葉區中央 2-1",
    note: "仙台站前歷史悠久的拱廊商店街，藥妝、居酒屋、拉麵店林立，雨天不愁。",
    day: 1
  },
  {
    id: 13,
    name: "森林探險 鹽釜 (Forest Adventure Shiogama)",
    rawTitle: "森林探險鹽釜 公園内 95-1",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3225,
    lng: 141.0086,
    type: "spot",
    typeName: "戶外體能體驗",
    address: "宮城縣鹽竈市伊保石 95-1 鹽竈市營中央公園內",
    note: "森林體能活動與高空滑索體驗，享受大自然芬多精冒險。",
    day: 4
  },
  {
    id: 14,
    name: "鹽竈神社 (Shiogama Jinja)",
    rawTitle: "鹽竈神社",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3189,
    lng: 141.0189,
    type: "spot",
    typeName: "神社名勝",
    address: "宮城縣鹽竈市一森山 1-1",
    note: "陸奧國第一神社，擁有 1200 年以上歷史。挑戰登上 202 階極陡峭祈福石階「男坂」。",
    day: 4
  },
  {
    id: 15,
    name: "Shichinoya (七之屋 海鮮烘焙)",
    rawTitle: "Shichinoya 七ヶ浜",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3075,
    lng: 141.0667,
    type: "food",
    typeName: "海鮮/咖啡",
    address: "宮城縣宮城郡七濱町花淵濱字館下 75-41",
    note: "七濱海邊複合式海鮮餐廳與咖啡館，可遠眺太平洋海景。",
    day: 4
  },
  {
    id: 16,
    name: "鹽釜水產物仲卸市場 (My海鮮丼 DIY)",
    rawTitle: "鹽釜水產市場",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3242,
    lng: 141.0378,
    type: "food",
    typeName: "海鮮市場",
    address: "宮城縣鹽竈市新濱町 1-20-74",
    note: "JR 東鹽釜車站步行約 15 分鐘。市場乾淨衛生，可先到各攤位自選刺身，再至 6 號攤位購買白飯與湯品，組裝專屬豪華「My海鮮丼 (マイ海鮮丼)」！",
    day: 4
  },
  {
    id: 17,
    name: "仙台海洋森林水族館 (Sendai Umino-Mori)",
    rawTitle: "仙台海洋森林水族館",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2748,
    lng: 140.9877,
    type: "spot",
    typeName: "水族館",
    address: "宮城縣仙台市宮城野區中野 4-6",
    note: "擁有東北最大巨型水槽「閃耀三陸之海」與生動的海豚海獅露天表演。",
    day: 6
  },
  {
    id: 18,
    name: "天守閣自然公園 (秋保日式庭園)",
    rawTitle: "天守閣自然公園",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2241,
    lng: 140.7075,
    type: "spot",
    typeName: "日式庭園",
    address: "宮城縣仙台市太白區秋保町湯元字源兵衛原 10",
    note: "佔地廣大的回遊式日本庭園，11 月秋季賞楓點燈非常著名，園內有溫泉足湯。",
    day: 5
  },
  {
    id: 19,
    name: "Akiu Winery (秋保酒莊)",
    rawTitle: "Akiu Winery",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2261,
    lng: 140.7145,
    type: "food",
    typeName: "葡萄酒莊",
    address: "宮城縣仙台市太白區秋保町湯元字枇杷原西 6",
    note: "宮城首家在地葡萄酒莊，結合宮城產葡萄釀造，提供試飲與特色佐酒起司盤。",
    day: 5
  },
  {
    id: 20,
    name: "Pizza & Cafe Dottore (森林柴燒披薩)",
    rawTitle: "Dottore",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2285,
    lng: 140.7162,
    type: "food",
    typeName: "森林窯烤披薩",
    address: "宮城縣仙台市太白區秋保町湯元字釜土 1",
    note: "隱身在秋保森林裡的超人氣石窯柴燒拿坡里披薩，外脆內 Q，環境極度療癒！",
    day: 5
  },
  {
    id: 21,
    name: "仙台萬華鏡美術館 (Sendai Kaleidoscopes)",
    rawTitle: "仙台万華鏡美術館",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2325,
    lng: 140.7561,
    type: "spot",
    typeName: "藝術美術館",
    address: "宮城縣仙台市太白區茂庭字松場 1-2",
    note: "世界首座萬華鏡美術館，展示光影變幻萬千的光學藝術品，可親手旋轉體驗。",
    day: 5
  },
  {
    id: 22,
    name: "磊磊峽 (Rairaikyo Gorge)",
    rawTitle: "Rairaikyo Gorge",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2272,
    lng: 140.7225,
    type: "spot",
    typeName: "溪谷自然步道",
    address: "宮城縣仙台市太白區秋保町湯元",
    note: "名取川侵蝕生成的奇岩怪石絕壁，步道入口橋上可俯瞰著名的「天然愛心石」。瑞鳳飯店步行 5 分鐘即達。",
    day: 5
  },
  {
    id: 23,
    name: "秋保傳統工藝之里 (Craft Village)",
    rawTitle: "Akiu Traditional Craft Village",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2295,
    lng: 140.7121,
    type: "spot",
    typeName: "職人工藝體驗",
    address: "宮城縣仙台市太白區秋保町湯元字上原 54-20",
    note: "聚集國家級職人工作坊，可親自用毛筆手繪專屬木芥子娃娃 (Kokeshi)。自磊磊峽步行 6 分鐘直達。",
    day: 5
  },
  {
    id: 25,
    name: "松島 瑞巖寺五大堂 & 円通院",
    rawTitle: "松島 瑞巖寺五大堂",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3705,
    lng: 141.0640,
    type: "spot",
    typeName: "國寶名勝",
    address: "宮城縣宮城郡松島町松島町內 111",
    note: "木製透橋五大堂是松島地標；隔壁國寶瑞巖寺與円通院可參加「天然石數珠手作體驗」，住持會為你解析所選石頭代表的運勢。",
    day: 4
  },
  {
    id: 26,
    name: "Nikka 宮城峽蒸餾酒廠 (Miyagikyo)",
    rawTitle: "宮城峽蒸餾酒廠 1番地 Nikka",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.3156,
    lng: 140.6489,
    type: "spot",
    typeName: "威士忌酒廠見學",
    address: "宮城縣仙台市青葉區日光 1 番地",
    note: "日本威士忌之父竹鶴政孝打造的紅磚蒸餾所，免費深度導覽需官網提前預約，可走進橡木桶庫並品嚐限定威士忌。JR 作並站有免費接駁車 14:55 發車。",
    day: 5
  },
  {
    id: 27,
    name: "秋保溫泉 瑞鳳大旅館 (Hotel Zuiho)",
    rawTitle: "ホテル瑞鳳 (Hotel Zuiho Akiu)",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2280,
    lng: 140.7195,
    type: "stay",
    typeName: "頂級名湯大旅館",
    address: "宮城縣仙台市太白區秋保町湯元字除 26-1",
    note: "🌟 奧州頂級度假大旅館！擁有 6 大景觀主題露天溫泉與日式迴遊庭園；晚餐享用連續多年獲選日本 No.1 豪華自助百匯（現場握壽司、黑毛和牛排、現烤牛舌、松葉蟹吃到飽）！",
    day: 4
  },
  {
    id: 28,
    name: "大崎八幡宮 (國寶權現造)",
    rawTitle: "大崎八幡宮",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2731,
    lng: 140.8443,
    type: "spot",
    typeName: "國寶神社",
    address: "宮城縣仙台市青葉區八幡 4-6-1",
    note: "日本唯一現存最古老的國寶權現造建築，黑漆鑲金箔雕刻華麗非凡，祈求勝利與厄除。るーぷる仙台觀光巴士直達。",
    day: 2
  },
  {
    id: 29,
    name: "瑞鳳殿 (伊達政宗靈廟)",
    rawTitle: "瑞鳳殿",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2505,
    lng: 140.8653,
    type: "spot",
    typeName: "歷史名勝",
    address: "宮城縣仙台市青葉區靈屋下 23-2",
    note: "江戶初期奢華「桃山美學」代表作，被高達 400 年的巨型杉木參道包圍，資料館展出伊達政宗陪葬品與復原容貌。09:40 仙台站搭巴士直達。",
    day: 2
  },
  {
    id: 30,
    name: "鳳鳴四十八瀑布 (Homeishijuhachi)",
    rawTitle: "Homeishijuhachi Falls, Sateyama Nitsukawa",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.3289,
    lng: 140.6125,
    type: "spot",
    typeName: "自然瀑布",
    address: "宮城縣仙台市青葉區新川字佐手山",
    note: "廣瀨川上游層疊相連的階梯式瀑布群，水聲如鳳凰鳴叫般悅耳。",
    day: 5
  },
  {
    id: 36,
    name: "JR Fruit Park 仙台荒濱 (採果樂)",
    rawTitle: "JR Fruit Park Sendai Arahama",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2301,
    lng: 140.9855,
    type: "spot",
    typeName: "農園體驗",
    address: "宮城縣仙台市若林區荒濱新 2-17-1",
    note: "JR 東日本打造的現代化觀光果園，可體驗採摘當季新鮮蘋果/草莓，品嚐農園特製聖代甜點。荒井站轉市營巴士直達。",
    day: 6
  },
  {
    id: 39,
    name: "海鮮料理 さんとり茶屋 (松島牡蠣名店)",
    rawTitle: "海鮮料理 さんとり茶屋",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3695,
    lng: 141.0635,
    type: "food",
    typeName: "海鮮料理",
    address: "宮城縣宮城郡松島町松島字仙隨 24-1",
    note: "松島名物烤牡蠣與極鮮牡蠣丼專門店，坐在二樓可邊賞松島灣景邊嚐美味。",
    day: 4
  },
  {
    id: 40,
    name: "仙台朝市 (Sendai Morning Market)",
    rawTitle: "仙台朝市 3F318号室",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2585,
    lng: 140.8806,
    type: "food",
    typeName: "在地朝市",
    address: "宮城縣仙台市青葉區中央 3-8-5",
    note: "距離車站 5 分鐘的市民廚房，必吃熱呼呼現炸可樂餅、齋藤生魚片丼與新鮮當季水果。",
    day: 2
  },
  {
    id: 41,
    name: "仙台城跡 (青葉城跡)",
    rawTitle: "Sendai Castle Ruins (Aoba Castle Ruins)",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2529,
    lng: 140.8562,
    type: "spot",
    typeName: "歷史城堡",
    address: "宮城縣仙台市青葉區川內 1 番地",
    note: "伊達政宗建造的天然要塞，站在此處可眺望整個仙台平原與太平洋，經典騎馬像打卡聖地。",
    day: 2
  },
  {
    id: 42,
    name: "るーぷる仙台 (Loople 觀光巴士)",
    rawTitle: "るーぷる仙台バス乗り場 仙台站前西口",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2605,
    lng: 140.8818,
    type: "transit",
    typeName: "觀光交通",
    address: "仙台車站西口巴士總站 16 號月台",
    note: "復古單向巡迴觀光巴士，串聯瑞鳳殿、青葉城跡、大崎八幡宮等市區所有精華景點，一日券 ¥630。",
    day: 2
  },
  {
    id: 43,
    name: "地底之森博物館 (富澤遺跡保存館)",
    rawTitle: "地底之森博物館 (仙台市富澤遺跡保存館)",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2215,
    lng: 140.8712,
    type: "spot",
    typeName: "考古博物館",
    address: "宮城縣仙台市太白區長町南 4-3-1",
    note: "世界罕見完整保留 2 萬年前舊石器時代人類營火遺跡與冰河期森林的地下博物館。地下鐵長町南站步行 5 分。",
    day: 6
  },
  {
    id: 44,
    name: "Cafe Aoyama Bunko (青山文庫)",
    rawTitle: "Cafe Aoyama Bunko Ｅｖｅｒ－ｉ中央 5F",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2619,
    lng: 140.8798,
    type: "food",
    typeName: "文青早午餐咖啡",
    address: "宮城縣仙台市青葉區中央 2-1-27 5F",
    note: "氛圍極度迷人的書香復古咖啡館，提供精緻早午餐、法式烘焙甜點與虹吸手沖咖啡。",
    day: 2
  },
  {
    id: 48,
    name: "Sendai Loft (仙台洛夫特 文具專門)",
    rawTitle: "Sendai Loft",
    area: "sendai_city",
    areaName: "仙台市區",
    lat: 38.2595,
    lng: 140.8809,
    type: "spot",
    typeName: "文具雜貨採購",
    address: "宮城縣仙台市青葉區中央 1-10-10",
    note: "整棟文具、生活美學、手帳、日系質感小物的天堂，文具控必逛！仙台站西口天橋直達。",
    day: 2
  },
  {
    id: 49,
    name: "日本三景 松島灣 (Matsushima Bay)",
    rawTitle: "Nihon Sankei Matsushima",
    area: "matsushima_shiogama",
    areaName: "松島・鹽竈",
    lat: 38.3712,
    lng: 141.0645,
    type: "spot",
    typeName: "日本三景",
    address: "宮城縣宮城郡松島町松島字町內",
    note: "名列日本三景之一，由 260 座長滿松樹的島嶼構成。搭乘 11:30 定期遊覽船巡航松島灣。JR 仙石線松島海岸站步行 5 分。",
    day: 4
  }
];

// ==========================================================================
// 2. 每日行程時間軸資料 (區域集中・嚴格單向順行・零折返跑)
// ==========================================================================
const ITINERARY_DATA = {
  day1: {
    dayNum: "Day 1",
    date: "2026 年 11 月 19 日 (週四)",
    theme: "台北起飛 ➔ 抵達仙台 ➔ Access線電車 ➔ 頂級炭烤牛舌晚餐 ➔ 入住站前大都會飯店",
    area: "【市區核心集中】仙台站周邊 500m",
    stay: "🏨 仙台大都會大飯店 (Hotel Metropolitan Sendai)",
    budget: "¥5,500 / 人",
    transitSummary: "🚆 仙台機場 Access 線 (直通電車 19:45發 ➔ 20:10抵仙台站，25分，¥660，刷 Suica 直達無折返)",
    items: [
      {
        time: "14:35 - 18:45",
        title: "台北桃園機場 (TPE) T1 ➔ 仙台機場 (SDJ) 直飛航班",
        type: "transit",
        typeName: "直飛航班",
        desc: "搭乘國際直飛航班前往日本東北仙台機場 (SDJ)，航程約 3 小時 10 分。",
        transitDetail: "🛫 桃園機場 T1 (14:35) ➔ 仙台機場 (18:45) ｜ 訂單編號：1658114632869861",
        cost: "已計入機票",
        spotId: null
      },
      {
        time: "18:45 - 19:40",
        title: "入境手續 ➔ 提領行李 ➔ 開通 eSIM 上網",
        type: "transit",
        typeName: "機場入境",
        desc: "通過海關、提取行李並開通日本 eSIM 網路，沿著航廈指標前往 B1 鐵路月台搭車。",
        transitDetail: "🚶 仙台機場國際線到達大廳 ➔ B1 鐵道月台 (步行 3 分鐘)",
        cost: "-",
        spotId: 5
      },
      {
        time: "19:45 - 20:10",
        title: "搭乘「仙台機場 Access 線」直通電車前往市區",
        type: "transit",
        typeName: "大眾鐵道",
        desc: "搭乘機場直通電車直達 JR 仙台站，免換車，中途僅停靠數站。",
        transitDetail: "🚆 仙台空港アクセス線 (往仙台行) ｜ 19:45 仙台機場站發 ➔ 20:10 抵達 JR 仙台站 (車程 25分，月台 3/4 號，¥660，刷 Apple Pay Suica)",
        cost: "¥660",
        spotId: 5
      },
      {
        time: "20:12 - 20:30",
        title: "飯店 Check-in：仙台大都會大飯店 (Hotel Metropolitan)",
        type: "stay",
        typeName: "住宿入住",
        desc: "出仙台站西口走天橋步行 1 分鐘直達飯店辦理入住，免在寒風中拖行李！換上輕便保暖大衣出發吃晚餐。",
        transitDetail: "🚶 JR 仙台站西口天橋直達 (20:12 - 20:16 步行 4 分鐘)",
        cost: "預估 ¥28,000 / 4人",
        spotId: 5
      },
      {
        time: "20:45 - 22:00",
        title: "仙台必吃名物：炭烤牛舌 / 芹菜鴨肉鍋",
        type: "food",
        typeName: "名物晚餐",
        desc: "品嚐米其林推薦「Sendai Gyutan Taka (牛舌 閣)」厚切炭烤牛舌套餐，或「Serisoan」仙台水芹鴨肉鍋！",
        note: "炭火厚切牛舌套餐附帶麥飯、山藥泥與濃郁牛尾湯，香氣四溢！",
        transitDetail: "🚶 飯店步行 5-8 分鐘即可抵達一番町/南町通名店",
        cost: "約 ¥2,800 - ¥3,500",
        spotId: 2
      },
      {
        time: "22:00 - 23:00",
        title: "名掛丁商店街散策 & 超商補給",
        type: "spot",
        typeName: "夜間散步",
        desc: "在仙台站前有棚商店街漫步，購買翌日飲水、鮮奶與休足時間貼布。",
        transitDetail: "🚶 全程步行漫遊",
        cost: "約 ¥800",
        spotId: 8
      }
    ]
  },
  day2: {
    dayNum: "Day 2",
    date: "2026 年 11 月 20 日 (週五)",
    theme: "仙台朝市海鮮 ➔ 復古觀光巴士 (Loople單向順時針環線) ➔ 瑞鳳殿 ➔ 青葉城跡 ➔ 國寶大崎八幡宮 ➔ 續住站前大都會",
    area: "【歷史文化順行環線】仙台市區",
    stay: "🏨 仙台大都會大飯店 (續住免搬行李)",
    budget: "¥7,000 / 人",
    transitSummary: "🚌 るーぷる仙台 (Loople Sendai) 單向順行環線巴士 (西口16號月台發，單向環遊不走回頭路，一日券 ¥630)",
    items: [
      {
        time: "08:15 - 09:30",
        title: "仙台朝市 (市民廚房) 活力海鮮早餐",
        type: "food",
        typeName: "市場早餐",
        desc: "探索熱鬧朝市，品嚐新鮮生魚片丼、熱騰騰現炸朝市可樂餅與當季水果。",
        note: "距車站僅 5 分鐘步程，可樂餅一個僅需 ¥100-¥150，酥脆多汁！",
        transitDetail: "🚶 飯店步行 5 分鐘 (08:15 - 08:20 步行 350m)",
        cost: "約 ¥1,500",
        spotId: 40
      },
      {
        time: "09:40 - 09:55",
        title: "搭乘「るーぷる仙台」觀光巴士前往瑞鳳殿",
        type: "transit",
        typeName: "市區觀光巴士",
        desc: "於仙台站西口 16 號月台購買「るーぷる仙台 一日乘車券」(¥630)，搭乘復古車廂啟程。",
        transitDetail: "🚌 るーぷる仙台 (西口16號乘車處) ｜ 09:40 仙台站發 ➔ 09:55 抵達 瑞鳳殿前 (車程 15分，一日券 ¥630)",
        cost: "¥630 (一日券)",
        spotId: 42
      },
      {
        time: "09:55 - 11:45",
        title: "瑞鳳殿 (伊達政宗靈廟)",
        type: "spot",
        typeName: "歷史名勝",
        desc: "參拜伊達政宗安息之地，欣賞極致華麗的桃山建築風格與高聳 400 年巨杉參道。",
        note: "憑 Loople 一日券購票可享團體優惠折價！",
        transitDetail: "🚌 於「瑞鳳殿前」站牌搭乘 11:55 班次前往「仙台城跡」",
        cost: "¥570",
        spotId: 29
      },
      {
        time: "11:55 - 12:08",
        title: "搭乘 Loople 巴士前往青葉城跡",
        type: "transit",
        typeName: "市區觀光巴士",
        desc: "搭乘復古觀光巴士沿山路行駛至青葉山仙台城跡。",
        transitDetail: "🚌 るーぷる仙台 ｜ 11:55 瑞鳳殿前發 ➔ 12:08 抵達 仙台城跡 (車程 13分，憑一日券)",
        cost: "已計入一日券",
        spotId: 42
      },
      {
        time: "12:10 - 13:40",
        title: "仙台城跡 (青葉城跡) 展望全景",
        type: "spot",
        typeName: "古城遺跡",
        desc: "登上本丸遺跡，在經典「伊達政宗騎馬像」前合影，俯瞰廣闊的仙台市容與遠方太平洋。",
        note: "可於城跡本丸茶屋品嚐仙台正宗毛豆泥麻糬 (Zunda Mochi)。",
        transitDetail: "🚶 城跡展望台漫步",
        cost: "約 ¥800",
        spotId: 41
      },
      {
        time: "13:48 - 14:08",
        title: "搭乘 Loople 巴士順路前往大崎八幡宮",
        type: "transit",
        typeName: "市區觀光巴士",
        desc: "搭乘觀光巴士穿越廣瀨川前往國寶神社。",
        transitDetail: "🚌 るーぷる仙台 ｜ 13:48 仙台城跡發 ➔ 14:08 抵達 大崎八幡宮前 (車程 20分)",
        cost: "已計入一日券",
        spotId: 42
      },
      {
        time: "14:10 - 15:05",
        title: "大崎八幡宮 (國寶權現造神社)",
        type: "spot",
        typeName: "國寶神社",
        desc: "參拜日本唯一現存最古老之國寶神社，欣賞黑漆金箔相間的武士豪氣雕刻。",
        transitDetail: "🚌 於大崎八幡宮前搭乘 15:10 巴士返回市區廣瀨通",
        cost: "免費參拜",
        spotId: 28
      },
      {
        time: "15:10 - 15:28",
        title: "搭巴士返回市區 ➔ まるごと銅鑼燒 & Itagaki 水果聖代",
        type: "food",
        typeName: "人氣甜點",
        desc: "搭乘 Loople 巴士回到廣瀨通站，品嚐爆漿現烤銅鑼燒與 Itagaki 百年水果百匯聖代！",
        transitDetail: "🚌 るーぷる仙台 (15:10 大崎八幡宮前發 ➔ 15:28 廣瀨通站抵達) ➔ 🚶 步行商圈",
        cost: "約 ¥1,600",
        spotId: 6
      },
      {
        time: "17:00 - 18:30",
        title: "Cafe Aoyama Bunko (青山文庫) & Sendai Loft",
        type: "food",
        typeName: "書香咖啡/文具",
        desc: "在充滿文青氛圍的書香復古咖啡館享受手沖咖啡，隨後至 Loft 採購日系質感文具與手帳。",
        transitDetail: "🚶 仙台站前商圈步行",
        cost: "約 ¥1,200",
        spotId: 44
      },
      {
        time: "19:00 - 21:00",
        title: "一番町居酒屋 仙台和牛與地酒饗宴 ➔ 返回飯店休息",
        type: "food",
        typeName: "居酒屋晚餐",
        desc: "品嚐宮城在地名酒（浦霞、一之藏）佐以仙台牛燒肉與旬鮮生魚片，早點休息迎接明日田代島貓島之旅！",
        transitDetail: "🚶 步行回大都會飯店",
        cost: "約 ¥3,500",
        spotId: 2
      }
    ]
  },
  day3: {
    dayNum: "Day 3",
    date: "2026 年 11 月 21 日 (週六)",
    theme: "【🌟 必訪重點】仙台 ➔ 直達東北海岸石卷 ➔ 網地島線渡輪 ➔ 田代島(貓島) ➔ 貓神社 ➔ 宿：田代島漁師民宿 はま屋",
    area: "【東北海岸與海島集中】田代島 (貓島)",
    stay: "🐱 田代島 漁師民宿「はま屋」(Hamaya) ｜ 一泊二食現撈三陸海味",
    budget: "¥11,000 / 人 (含島上住宿及早晚餐)",
    transitSummary: "🚆 JR仙石東北線快速 (07:24發 ➔ 08:24抵石卷，60分，¥860) ➔ 🚢 網地島線渡輪 (09:00發 ➔ 09:46抵仁斗田，46分，¥1,250)",
    items: [
      {
        time: "07:00 - 07:20",
        title: "大行李寄放仙台飯店櫃檯 ➔ 隨身小背包出發",
        type: "transit",
        typeName: "輕裝出發",
        desc: "將大行李箱寄存在仙台大都會飯店，僅攜帶 1 晚換洗衣物隨身包，並在超商買妥飲用水與輕食午餐（⚠️ 田代島無商店需自備）。",
        transitDetail: "🚶 步行至 JR 仙台站月台",
        cost: "約 ¥800",
        spotId: 5
      },
      {
        time: "07:24 - 08:24",
        title: "搭乘 JR 仙石東北線（快速列車）直達石卷",
        type: "transit",
        typeName: "JR 快速鐵道",
        desc: "於仙台站搭乘 JR 仙石東北線快速列車直達 JR 石卷站，車程約 60 分鐘，單一直線無轉乘。",
        transitDetail: "🚆 JR 仙石東北線 (快速・石卷行) ｜ 07:24 JR仙台站(9號月台)發 ➔ 08:24 抵達 JR石卷站 (車程 60分，單程 ¥860，刷 Apple Pay Suica)",
        cost: "¥860",
        spotId: 103
      },
      {
        time: "08:25 - 08:45",
        title: "自石卷站步行前往「石卷中央發著所」渡輪碼頭",
        type: "transit",
        typeName: "市區步行",
        desc: "出石卷站沿著「漫畫之街」直行約 17 分鐘（1.1 公里）抵達網地島線渡輪乘船處。",
        transitDetail: "🚶 石卷站 ➔ 石卷中央發著所 (08:25 - 08:42 步行 17分鐘，距離 1.1km)",
        cost: "免費",
        spotId: 102
      },
      {
        time: "08:45 - 09:00",
        title: "售票處購買網地島線渡輪船票、登船",
        type: "transit",
        typeName: "渡輪購票",
        desc: "於石卷中央發著所自動售票機購買至「田代島・仁斗田」單程票 (單程 ¥1,250，僅收日圓現金)。",
        transitDetail: "🚢 網地島線渡輪客船 ｜ 09:00 石卷中央(1號棧橋)開船 ➔ 09:46 抵達 田代島仁斗田港 (航程 46分，票價 ¥1,250 現金)",
        cost: "¥1,250",
        spotId: 102
      },
      {
        time: "09:46 - 12:00",
        title: "抵達【田代島 (貓島)】，至漁師民宿「はま屋」寄放隨身包",
        type: "spot",
        typeName: "貓島漫遊",
        desc: "下船抵達仁斗田港，步行 3 分鐘至「漁師民宿 はま屋」放下背包。門口與小徑隨處可見親人悠閒的貓咪迎賓！",
        note: "🌟 必訪景點！貓咪溫馴親人，請溫柔拍照，勿餵食人類零食。",
        transitDetail: "🚶 仁斗田港 ➔ 民宿 はま屋 (09:48 - 09:53 步行 5分鐘)",
        cost: "免費",
        spotId: 101
      },
      {
        time: "12:00 - 14:30",
        title: "島上自備午餐野餐 ➔ 健行參拜「貓神社」與阿仁貓屋",
        type: "spot",
        typeName: "貓神社健行",
        desc: "沿島上林蔭步道步行約 25 分鐘（1.5 公里）前往島中心參拜全日唯一的「貓神社（美與利大明神）」，祈求平安與好運。",
        transitDetail: "🚶 仁斗田港 ➔ 貓神社 (12:00 - 12:25 步道健行 25分鐘)",
        cost: "自備午餐",
        spotId: 101
      },
      {
        time: "15:00 - 17:30",
        title: "觀光客離去後的寧靜貓島 ➔ 港邊夕陽與貓咪時光",
        type: "spot",
        typeName: "專屬貓島體驗",
        desc: "當下午最後一班遊客渡輪開走後，整座島嶼回歸最純粹的靜謐！坐在港邊看夕陽沉入海面，享受專屬群貓陪伴。",
        transitDetail: "🚶 仁斗田港聚落散策",
        cost: "免費",
        spotId: 101
      },
      {
        time: "18:00 - 21:00",
        title: "民宿晚餐：漁師現撈三陸鮑魚、鮮魚刺身晚宴 ➔ 宿：はま屋",
        type: "stay",
        typeName: "漁師海味晚宴",
        desc: "享用民宿主人自家漁船出海捕撈的三陸極品海鮮（鮑魚、當季海魚刺身、炭烤魚），在海浪聲與滿天星斗下入眠。",
        cost: "含在民宿一泊二食 (約 ¥9,500/人)",
        spotId: 101
      }
    ]
  },
  day4: {
    dayNum: "Day 4",
    date: "2026 年 11 月 22 日 (週日)",
    theme: "田代島晨光 ➔ 渡輪返石卷 ➔ 順遊松島灣遊船 ➔ 烤牡蠣 ➔ 順行抵達秋保溫泉 瑞鳳大旅館 (六大露天風呂+極致百匯)",
    area: "【沿海走廊順路南下 ➔ 西部名湯】松島・秋保",
    stay: "♨️ 秋保溫泉 瑞鳳大旅館 (Hotel Zuiho) ｜ 六大露天風呂與極致百匯晚宴",
    budget: "¥17,000 / 人 (含瑞鳳頂級一泊二食早晚餐)",
    transitSummary: "🚢 渡輪(09:05發) ➔ 🚆 JR仙石線順路回程(10:18發 ➔ 10:59抵松島海岸) ➔ 🚌 宮城交通巴士(15:35仙台發 ➔ 16:25抵瑞鳳前)",
    items: [
      {
        time: "07:00 - 08:30",
        title: "田代島日出散步 ➔ 民宿漁師朝食",
        type: "stay",
        typeName: "島嶼朝食",
        desc: "清晨在貓咪陪伴下欣賞三陸太平洋晨曦，享用新鮮烤魚、白飯與海帶味噌湯日式朝食，辦理退房。",
        transitDetail: "🚶 步行至仁斗田港碼頭 (3分鐘)",
        cost: "包含在住宿",
        spotId: 101
      },
      {
        time: "09:05 - 09:50",
        title: "搭乘網地島線渡輪返回「石卷中央發著所」",
        type: "transit",
        typeName: "渡輪返航",
        desc: "向可愛的貓咪們道別，搭乘早班渡輪返回本島石卷港。",
        transitDetail: "🚢 網地島線客船 ｜ 09:05 仁斗田港開船 ➔ 09:50 抵達 石卷中央發著所 (航程 45分，¥1,250 現金)",
        cost: "¥1,250",
        spotId: 102
      },
      {
        time: "10:18 - 10:59",
        title: "JR 石卷站搭乘仙石線順路前往「松島海岸站」",
        type: "transit",
        typeName: "JR 電車",
        desc: "自石卷站搭乘 JR 仙石線直達松島海岸站，沿海走廊完全順路不走回頭路！",
        transitDetail: "🚆 JR 仙石線 (普通・あおば通行) ｜ 10:18 JR石卷站(1/2月台)發 ➔ 10:59 抵達 JR松島海岸站 (車程 41分，¥590，刷 Suica)",
        cost: "¥590",
        spotId: 49
      },
      {
        time: "11:30 - 12:20",
        title: "日本三景 松島灣觀光遊覽船巡航",
        type: "spot",
        typeName: "三景巡航",
        desc: "搭乘觀光遊覽船巡航 50 分鐘，近距離飽覽 260 餘座奇松怪石島嶼構成的蔚藍絕景。",
        transitDetail: "🚶 松島海岸站出站步行 6 分鐘抵達遊覽船碼頭",
        cost: "¥1,500",
        spotId: 49
      },
      {
        time: "12:30 - 14:00",
        title: "松島 瑞巖寺五大堂 & さんとり茶屋炭烤鮮牡蠣",
        type: "food",
        typeName: "國寶與牡蠣",
        desc: "踏過木製透橋五大堂，享用松島名物現烤肥美牡蠣、牡蠣丼，品嚐現烤竹輪魚板。",
        transitDetail: "🚶 松島海岸商圈步行",
        cost: "約 ¥2,200",
        spotId: 39
      },
      {
        time: "14:26 - 15:06",
        title: "搭 JR 仙石線返回仙台站領取大行李",
        type: "transit",
        typeName: "JR 電車",
        desc: "搭乘電車返回仙台站，在大都會飯店櫃檯取回寄放大行李箱。",
        transitDetail: "🚆 JR 仙石線 ｜ 14:26 松島海岸站發 ➔ 15:06 抵達 JR 仙台站 (車程 40分，¥420，刷 Suica)",
        cost: "¥420",
        spotId: 5
      },
      {
        time: "15:35 - 16:25",
        title: "搭乘宮城交通巴士直達「秋保溫泉 瑞鳳大旅館」",
        type: "transit",
        typeName: "溫泉路線巴士",
        desc: "於仙台站西口 8 號月台搭乘直達秋保溫泉之路線巴士，直達瑞鳳大旅館前。",
        transitDetail: "🚌 宮城交通巴士 (秋保溫泉行) ｜ 15:35 仙台站西口(8號乘車處)發 ➔ 16:25 抵達 瑞鳳前 (車程 50分，¥860，可刷 IC 卡)",
        cost: "¥860",
        spotId: 27
      },
      {
        time: "16:30 - 21:30",
        title: "入住「秋保溫泉 瑞鳳大旅館」➔ 六大露天風呂 ➔ 日本第一豪華百匯盛宴",
        type: "stay",
        typeName: "頂級名湯一泊二食",
        desc: "享受 6 大主題景觀露天風呂與日式迴遊庭園，晚餐享用現捏黑鮪壽司、現煎霜降黑毛和牛排、現烤炭火牛舌、松葉蟹吃到飽晚宴！",
        cost: "含在住宿 (約 ¥16,000/人)",
        spotId: 27
      }
    ]
  },
  day5: {
    dayNum: "Day 5",
    date: "2026 年 11 月 23 日 (週一 - 國定假日)",
    theme: "湯元純步行散策 ➔ 工藝體驗 ➔ 森林披薩 ➔ 西向秋保大瀑布 ➔ Nikka酒廠 ➔ 仙山線直達仙台大浴場",
    area: "【湯元步行圈 ➔ 西行大瀑布 ➔ 酒廠】完全單向順行",
    stay: "🏨 仙台遠景飯店 (Hotel Vista Sendai) ｜ 頂樓絹之湯大浴場",
    budget: "¥8,500 / 人",
    transitSummary: "🚶 湯元上午純步行 (08:40-12:40 無車程) ➔ 🚌 秋保大滝專線巴士 (12:55發) ➔ 🚆 JR仙山線 (直達仙台東口)",
    items: [
      {
        time: "07:30 - 08:30",
        title: "瑞鳳大旅館極致百匯朝食 ➔ 退房",
        type: "stay",
        typeName: "朝食與退房",
        desc: "享用瑞鳳豐盛早餐百匯（現煎蛋卷、現煮海鮮粥、道地小菜與鮮果），退房輕裝出發。",
        transitDetail: "🚶 瑞鳳飯店步行 5 分鐘直達磊磊峽覗橋",
        cost: "-",
        spotId: 27
      },
      {
        time: "08:40 - 09:30",
        title: "【湯元步行圈】磊磊峽 (Rairaikyo Gorge) 步道尋找「天然愛心石」",
        type: "spot",
        typeName: "溪谷自然步道",
        desc: "漫步名取川溪谷步道，從覗橋俯瞰溪谷中自然侵蝕生成的浪漫「天然愛心石」，欣賞秋日奇岩怪石絕壁。",
        transitDetail: "🚶 瑞鳳大旅館 ➔ 磊磊峽覗橋 (步行 5 分鐘，免搭車)",
        cost: "免費",
        spotId: 22
      },
      {
        time: "09:35 - 11:15",
        title: "【湯元步行圈】秋保傳統工藝之里 (手繪木芥子體驗)",
        type: "spot",
        typeName: "工藝體驗",
        desc: "親手用毛筆繪製專屬木芥子娃娃 (Kokeshi) 當作紀念品，參觀國家級傳統工藝職人工作坊。",
        transitDetail: "🚶 磊磊峽 ➔ 工藝之里 (沿步道直行 6 分鐘，約 450m，免搭車)",
        cost: "約 ¥1,500",
        spotId: 23
      },
      {
        time: "11:20 - 12:40",
        title: "【湯元步行圈】Pizza & Cafe Dottore (森林柴燒窯烤披薩午餐)",
        type: "food",
        typeName: "森林披薩午餐",
        desc: "隱身在秋保森林裡的超人氣石窯柴燒拿坡里披薩，外脆內 Q，搭配在地起司與手沖咖啡（或順遊 Akiu Winery 品酒）。",
        transitDetail: "🚶 工藝之里 ➔ Pizza Dottore (林蔭小徑步行 3 分鐘，免搭車)",
        cost: "約 ¥2,200",
        spotId: 20
      },
      {
        time: "12:55 - 14:15",
        title: "【西向推進】秋保大瀑布 (Akiu Great Falls) —— 日本三大名瀑・國指定名勝",
        type: "spot",
        typeName: "日本三大名瀑",
        desc: "欣賞落差高達 55 公尺的震撼瀑布！秋季被滿山金黃楓紅包圍，水氣騰空如萬馬奔騰，順道參拜秋保大滝不動尊。",
        transitDetail: "🚌 秋保大滝專線巴士 ｜ 12:55 湯元發 ➔ 13:15 抵達 秋保大滝 (車程 20分，¥460，一路向西單向前進)",
        cost: "¥460",
        spotId: 104
      },
      {
        time: "14:30 - 17:00",
        title: "【西北向推進】Nikka 宮城峽蒸餾所 (紅磚威士忌酒廠見學與免費試飲)",
        type: "spot",
        typeName: "威士忌酒廠",
        desc: "日本威士忌聖地！參觀巨大蒸餾銅鍋與橡木桶倉庫，免費試飲限定款威士忌與特製蘋果酒。",
        note: "需事先官網預約免費導覽場次。",
        transitDetail: "🚌 秋保大滝接駁專車前往 JR 作並站 ➔ 14:55 作並站搭 Nikka 免費接駁車 5分鐘直達大門",
        cost: "免費見學",
        spotId: 26
      },
      {
        time: "17:48 - 18:28",
        title: "搭 JR 仙山線返回仙台站東口 ➔ 入住「仙台遠景飯店 (Hotel Vista)」",
        type: "stay",
        typeName: "大浴場飯店",
        desc: "搭車返回仙台站東口，步行 4 分鐘入住飯店，享受頂樓「絹之湯」天然大浴場放鬆雙腿！",
        transitDetail: "🚆 JR 仙山線 ｜ 17:48 作並站發 ➔ 18:28 抵達 仙台站 (車程 40分，¥510，直達東口) ➔ 🚶 步行 4分鐘",
        cost: "預估 ¥26,000 / 4人",
        spotId: 5
      },
      {
        time: "19:00 - 21:30",
        title: "旅程慶功盛宴：A5 仙台牛霜降燒肉大餐",
        type: "food",
        typeName: "慶功大餐",
        desc: "享用肉質入口即化的 A5 仙台和牛燒肉盛合與在地地酒，慶祝旅程精彩圓滿！",
        transitDetail: "🚶 仙台站周邊步行",
        cost: "約 ¥5,500",
        spotId: 2
      }
    ]
  },
  day6: {
    dayNum: "Day 6",
    date: "2026 年 11 月 24 日 (週二)",
    theme: "荒濱季節採果樂 / 地底之森 ➔ 仙台站伴手禮最後大採購 ➔ 17:05 Access電車 ➔ 仙台機場返台",
    area: "【東部採果與機場走廊集中】仙台東部・機場",
    stay: "🏠 返抵溫暖的家 (台北)",
    budget: "¥6,500 / 人",
    transitSummary: "🚇 地下鐵東西線 (09:35發 ➔ 09:49抵荒井) + 🚌 市營巴士 ➔ 🚆 仙台機場 Access線 (17:05發 ➔ 17:30抵機場)",
    items: [
      {
        time: "09:00 - 09:30",
        title: "飯店辦理退房 ➔ 行李寄放櫃檯",
        type: "stay",
        typeName: "退房寄物",
        desc: "退房後將大件行李箱寄放於遠景飯店櫃檯，攜帶輕便隨身背包出發。",
        transitDetail: "🚶 步行至仙台地下鐵月台 (5分鐘)",
        cost: "-",
        spotId: 5
      },
      {
        time: "09:35 - 10:10",
        title: "搭地下鐵東西線 + 市營巴士前往「JR Fruit Park 荒濱」",
        type: "transit",
        typeName: "地下鐵 + 巴士",
        desc: "搭乘地下鐵至終點荒井站，轉乘市營巴士直達觀光果園門口。",
        transitDetail: "🚇 地下鐵東西線 (09:35 仙台發 ➔ 09:49 荒井站抵達，¥310) ➔ 🚌 市營巴士 (09:55 荒井站2號月台發 ➔ 10:10 抵農園，¥260)",
        cost: "¥570",
        spotId: 36
      },
      {
        time: "10:10 - 12:00",
        title: "JR Fruit Park 仙台荒濱 (當季蘋果/草莓採摘體驗)",
        type: "spot",
        typeName: "農園體驗",
        desc: "在現代化溫室觀光果園體驗採摘新鮮水果，品嚐現做水果聖代與特製甜點。",
        transitDetail: "🚶 果園園區內漫步",
        cost: "約 ¥1,800",
        spotId: 36
      },
      {
        time: "12:00 - 12:35",
        title: "搭乘市營巴士 + 地下鐵返回仙台車站",
        type: "transit",
        typeName: "回程大眾運輸",
        desc: "搭車返回仙台車站商圈享用午餐與採買伴手禮。",
        transitDetail: "🚌 12:00 農園前發 ➔ 12:15 荒井站 ➔ 🚇 12:21 地下鐵東西線 ➔ 12:35 抵達 仙台站 (¥570)",
        cost: "¥570",
        spotId: 5
      },
      {
        time: "12:40 - 14:30",
        title: "返回仙台站享用最後午餐 (牛舌/拉麵回味)",
        type: "food",
        typeName: "回味午餐",
        desc: "在仙台站 3 樓牛舌通或 S-PAL 餐廳街，再吃一次念念不忘的仙台美食。",
        transitDetail: "🚶 仙台站 S-PAL 商場內",
        cost: "約 ¥2,000",
        spotId: 5
      },
      {
        time: "14:30 - 16:45",
        title: "仙台站伴手禮最後大採買",
        type: "spot",
        typeName: "名產採購",
        desc: "必買：菓匠三全「萩之月」、喜久水庵「喜久福毛豆大福」、白謙竹葉烤魚板、地酒浦霞。",
        transitDetail: "🚶 仙台站伴手禮街區",
        cost: "依個人購物",
        spotId: 5
      },
      {
        time: "16:45 - 17:00",
        title: "回遠景飯店取行李 ➔ 前往 Access 線電車月台",
        type: "transit",
        typeName: "行李整理",
        desc: "回飯店領取寄放行李箱，確認護照、登機憑證與退稅物品備妥。",
        transitDetail: "🚶 飯店 ➔ 仙台站 3/4 號月台 (步行 6分鐘)",
        cost: "-",
        spotId: 5
      },
      {
        time: "17:05 - 17:30",
        title: "搭乘「仙台機場 Access 線」直達機場航廈",
        type: "transit",
        typeName: "機場電車",
        desc: "刷 Suica 搭乘直通電車直達仙台機場，免受塞車風險。",
        transitDetail: "🚆 仙台空港アクセス線 (往仙台空港行) ｜ 17:05 JR仙台站(3/4號月台)發 ➔ 17:30 抵達 仙台機場站 (車程 25分，¥660，刷 Suica)",
        cost: "¥660",
        spotId: 5
      },
      {
        time: "17:35 - 19:40",
        title: "仙台機場辦理報到、托運 ➔ 免稅店最後巡禮",
        type: "transit",
        typeName: "登機手續",
        desc: "於國際線大廳辦理報到與行李托運，出境後於免稅店購買日本生巧克力、獺祭地酒。",
        transitDetail: "🚶 機場出境大廳",
        cost: "-",
        spotId: null
      },
      {
        time: "19:40 - 23:00",
        title: "搭乘直飛航班返回台北 (TPE) T1",
        type: "transit",
        typeName: "返台航班",
        desc: "班機準時起飛，於 23:00 平安抵達台北桃園機場，滿載美好回憶返家！",
        transitDetail: "🛫 仙台機場 (19:40) ➔ 台北桃園機場第一航廈 (23:00) ｜ 航程 4h 20m",
        cost: "已計入機票",
        spotId: null
      }
    ]
  }
};

// ==========================================================================
// 3. 全局變數與地圖實例
// ==========================================================================
let dayMap = null;
let fullMap = null;
let dayMarkersLayer = null;
let fullMarkersLayer = null;
let currentDay = "day1";
let particlesEnabled = true;

// ==========================================================================
// 4. 初始化入口
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initTabs();
  initDaySwitcher();
  renderTimeline("day1");
  initDayMap();
  renderSpotsVault("all");
  initCurrencyConverter();
  initParticles();
  initModal();
});

// ==========================================================================
// 5. 倒數計時器 (Target: 2026/11/19 14:35 TPE)
// ==========================================================================
function initCountdown() {
  const targetDate = new Date("2026-11-19T14:35:00+08:00").getTime();
  
  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff <= 0) {
      document.getElementById("cd-days").textContent = "00";
      document.getElementById("cd-hours").textContent = "00";
      document.getElementById("cd-mins").textContent = "00";
      document.getElementById("cd-secs").textContent = "00";
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById("cd-days").textContent = String(days).padStart(2, '0');
    document.getElementById("cd-hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("cd-mins").textContent = String(mins).padStart(2, '0');
    document.getElementById("cd-secs").textContent = String(secs).padStart(2, '0');
  }
  
  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 6. 主頁籤切換邏輯
// ==========================================================================
function initTabs() {
  const tabBtns = document.querySelectorAll(".main-tabs .tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabKey = btn.getAttribute("data-tab");
      
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const activeContent = document.getElementById(`tab-${tabKey}`);
      if (activeContent) {
        activeContent.classList.add("active");
      }
      
      if (tabKey === "map-view") {
        if (!fullMap) {
          initFullMap();
        } else {
          setTimeout(() => fullMap.invalidateSize(), 200);
        }
      } else if (tabKey === "itinerary") {
        if (dayMap) {
          setTimeout(() => dayMap.invalidateSize(), 200);
        }
      }
    });
  });
}

// ==========================================================================
// 7. 每日行程切換與渲染 (含區域集中標籤與大眾交通精確時刻)
// ==========================================================================
function initDaySwitcher() {
  const dayBtns = document.querySelectorAll(".day-switcher .day-btn");
  
  dayBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dayBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const dayKey = btn.getAttribute("data-day");
      currentDay = dayKey;
      renderTimeline(dayKey);
      updateDayMap(dayKey);
    });
  });
}

function renderTimeline(dayKey) {
  const container = document.getElementById("timeline-container");
  const dayData = ITINERARY_DATA[dayKey];
  if (!dayData) return;
  
  let html = `
    <div class="day-header-summary">
      <div>
        <h2><i class="fa-solid fa-calendar-day text-gold"></i> ${dayData.dayNum} ｜ ${dayData.date}</h2>
        <div class="day-transit-summary-badge">
          <i class="fa-solid fa-train-subway"></i> <strong>交通總覽：</strong> ${dayData.transitSummary}
        </div>
      </div>
      <div class="day-meta-tags">
        <span class="day-tag"><i class="fa-solid fa-location-dot"></i> ${dayData.area}</span>
        <span class="day-tag"><i class="fa-solid fa-bed"></i> ${dayData.stay}</span>
        <span class="day-tag budget"><i class="fa-solid fa-coins"></i> 預估 ${dayData.budget}</span>
      </div>
    </div>
  `;
  
  dayData.items.forEach((item, idx) => {
    const nodeClass = item.type === "food" ? "food" : (item.type === "transit" ? "transport" : (item.type === "stay" ? "stay" : ""));
    const tagClass = item.type === "food" ? "food" : (item.type === "transit" ? "transit" : "spot");
    
    html += `
      <div class="timeline-item" onclick="handleTimelineItemClick(${item.spotId})">
        <div class="timeline-node ${nodeClass}"></div>
        <div class="timeline-card">
          <div class="time-badge-row">
            <span class="time-slot"><i class="fa-regular fa-clock"></i> ${item.time}</span>
            <span class="card-type-tag ${tagClass}">${item.typeName}</span>
          </div>
          <h3>${item.title}</h3>
          <p class="card-desc">${item.desc}</p>
          
          ${item.transitDetail ? `
            <div class="card-transit-box">
              <i class="fa-solid fa-route"></i> <strong>搭乘路線與精確時刻：</strong> ${item.transitDetail}
            </div>
          ` : ''}

          ${item.note ? `
            <div class="card-note-box">
              <i class="fa-solid fa-circle-exclamation"></i> ${item.note}
            </div>
          ` : ''}
          
          <div class="card-footer-info">
            <span><i class="fa-solid fa-wallet"></i> 預估費用：${item.cost}</span>
            <div class="card-actions">
              ${item.spotId ? `
                <button class="mini-btn" onclick="event.stopPropagation(); focusSpotOnMap(${item.spotId})">
                  <i class="fa-solid fa-map-pin"></i> 地圖定位
                </button>
                <button class="mini-btn" onclick="event.stopPropagation(); openSpotModal(${item.spotId})">
                  <i class="fa-solid fa-circle-info"></i> 筆記詳情
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ==========================================================================
// 8. Leaflet 地圖模組 (當日 Mini 地圖 + 全域 Full 地圖)
// ==========================================================================
function getCustomMarkerIcon(type, dayNumber) {
  let color = "#e5a852"; // Gold (default)
  let iconClass = "fa-map-pin";
  
  if (type === "food") {
    color = "#d84a38"; // Red
    iconClass = "fa-utensils";
  } else if (type === "stay") {
    color = "#2ecc71"; // Green
    iconClass = "fa-bed";
  } else if (type === "transit") {
    color = "#3498db"; // Blue
    iconClass = "fa-train";
  } else if (type === "spot") {
    color = "#f39c12"; // Amber
    iconClass = "fa-camera";
  }
  
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
      ">
        <i class="fa-solid ${iconClass}" style="transform: rotate(45deg); color: #fff; font-size: 13px;"></i>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

function initDayMap() {
  const mapElem = document.getElementById("itinerary-day-map");
  if (!mapElem) return;
  
  dayMap = L.map('itinerary-day-map', {
    zoomControl: true,
    attributionControl: false
  }).setView([38.2601, 140.8824], 11);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(dayMap);
  
  dayMarkersLayer = L.featureGroup().addTo(dayMap);
  updateDayMap("day1");
}

function updateDayMap(dayKey) {
  if (!dayMap || !dayMarkersLayer) return;
  dayMarkersLayer.clearLayers();
  
  const dayNum = parseInt(dayKey.replace("day", ""), 10);
  const daySpots = SPOTS_DATA.filter(s => s.day === dayNum);
  
  if (daySpots.length === 0) return;
  
  daySpots.forEach(spot => {
    const icon = getCustomMarkerIcon(spot.type, spot.day);
    const marker = L.marker([spot.lat, spot.lng], { icon: icon });
    
    const popupContent = `
      <div style="font-family: 'Noto Sans TC', sans-serif; min-width: 190px;">
        <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #111;">${spot.name}</h4>
        <div style="font-size: 11px; color: #666; margin-bottom: 6px;">Day ${spot.day} ｜ ${spot.typeName} ｜ ${spot.areaName}</div>
        ${spot.note ? `<p style="margin: 0 0 8px; font-size: 12px; color: #d84a38; background: #fff5f5; padding: 4px 6px; border-radius: 4px; line-height: 1.4;">${spot.note}</p>` : ''}
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}" target="_blank" style="display: inline-block; background: #d84a38; color: #fff; text-decoration: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
          Google Maps 導航
        </a>
      </div>
    `;
    
    marker.bindPopup(popupContent);
    marker.spotId = spot.id;
    dayMarkersLayer.addLayer(marker);
  });
  
  if (dayMarkersLayer.getLayers().length > 0) {
    dayMap.fitBounds(dayMarkersLayer.getBounds(), { padding: [40, 40], maxZoom: 14 });
  }
}

function focusSpotOnMap(spotId) {
  const spot = SPOTS_DATA.find(s => s.id === spotId);
  if (!spot || !dayMap) return;
  
  dayMap.flyTo([spot.lat, spot.lng], 14, { duration: 1.2 });
  
  dayMarkersLayer.eachLayer(layer => {
    if (layer.spotId === spotId) {
      layer.openPopup();
    }
  });
}

function handleTimelineItemClick(spotId) {
  if (spotId) {
    focusSpotOnMap(spotId);
  }
}

// ==========================================================================
// 9. 全域景點地圖 (Tab 4)
// ==========================================================================
function initFullMap() {
  const fullMapElem = document.getElementById("full-interactive-map");
  if (!fullMapElem) return;
  
  fullMap = L.map('full-interactive-map', {
    zoomControl: true
  }).setView([38.2601, 140.8824], 10);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '© OpenStreetMap contributors, © CARTO'
  }).addTo(fullMap);
  
  fullMarkersLayer = L.featureGroup().addTo(fullMap);
  renderFullMapMarkers("all");
  
  const filterBtns = document.querySelectorAll(".map-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderFullMapMarkers(filter);
    });
  });
  
  const searchInput = document.getElementById("map-search-input");
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    renderFullMapMarkers("all", q);
  });
}

function renderFullMapMarkers(filterArea, searchQuery = "") {
  if (!fullMap || !fullMarkersLayer) return;
  fullMarkersLayer.clearLayers();
  
  let filtered = SPOTS_DATA;
  if (filterArea !== "all") {
    filtered = filtered.filter(s => s.area === filterArea);
  }
  if (searchQuery) {
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchQuery) ||
      s.address.toLowerCase().includes(searchQuery) ||
      (s.note && s.note.toLowerCase().includes(searchQuery))
    );
  }
  
  filtered.forEach(spot => {
    const icon = getCustomMarkerIcon(spot.type, spot.day);
    const marker = L.marker([spot.lat, spot.lng], { icon: icon });
    
    const popupContent = `
      <div style="font-family: 'Noto Sans TC', sans-serif; min-width: 200px;">
        <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #111;">${spot.name}</h4>
        <div style="font-size: 11px; color: #666; margin-bottom: 6px;">Day ${spot.day} ｜ ${spot.typeName} ｜ ${spot.areaName}</div>
        ${spot.note ? `<p style="margin: 0 0 8px; font-size: 12px; color: #d84a38; background: #fff5f5; padding: 5px 8px; border-radius: 4px; line-height: 1.4;">${spot.note}</p>` : ''}
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}" target="_blank" style="display: inline-block; background: #d84a38; color: #fff; text-decoration: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 600;">
          Google Maps 導航
        </a>
      </div>
    `;
    
    marker.bindPopup(popupContent);
    fullMarkersLayer.addLayer(marker);
  });
  
  if (fullMarkersLayer.getLayers().length > 0) {
    fullMap.fitBounds(fullMarkersLayer.getBounds(), { padding: [50, 50], maxZoom: 13 });
  }
}

// ==========================================================================
// 10. 景點庫卡片列表 (Tab 5: Spots Vault)
// ==========================================================================
function renderSpotsVault(filterArea) {
  const grid = document.getElementById("spots-cards-grid");
  if (!grid) return;
  
  document.getElementById("count-all").textContent = SPOTS_DATA.length;
  document.getElementById("count-tashiro").textContent = SPOTS_DATA.filter(s => s.area === "tashirojima_ishinomaki").length;
  document.getElementById("count-sendai").textContent = SPOTS_DATA.filter(s => s.area === "sendai_city").length;
  document.getElementById("count-matsushima").textContent = SPOTS_DATA.filter(s => s.area === "matsushima_shiogama").length;
  document.getElementById("count-akiu").textContent = SPOTS_DATA.filter(s => s.area === "akiu_nikka").length;
  
  let filtered = SPOTS_DATA;
  if (filterArea !== "all") {
    filtered = filtered.filter(s => s.area === filterArea);
  }
  
  let html = "";
  filtered.forEach(spot => {
    html += `
      <div class="spot-vault-card">
        <div class="spot-card-top">
          <div class="spot-card-badges">
            <span class="spot-area-tag">${spot.areaName}</span>
            <span class="spot-idx">Day ${spot.day} ・ #${spot.id}</span>
          </div>
          <h4>${spot.name}</h4>
          ${spot.note ? `
            <div class="spot-note-preview">
              <i class="fa-solid fa-lightbulb"></i> ${spot.note}
            </div>
          ` : ''}
          <div class="spot-address-preview" title="${spot.address}">
            <i class="fa-solid fa-location-dot"></i> ${spot.address}
          </div>
        </div>
        
        <div class="spot-card-actions">
          <button class="spot-nav-link" onclick="openSpotModal(${spot.id})">
            <i class="fa-solid fa-circle-info"></i> 詳細資訊
          </button>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}" target="_blank" class="spot-nav-link">
            <i class="fa-solid fa-map-location-dot"></i> Google Maps
          </a>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = html;
  
  const vaultBtns = document.querySelectorAll(".vault-btn");
  vaultBtns.forEach(btn => {
    btn.onclick = () => {
      vaultBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.getAttribute("data-vault-filter");
      renderSpotsVault(f);
    };
  });
}

// ==========================================================================
// 11. 景點詳細彈窗 (Spot Modal)
// ==========================================================================
function initModal() {
  const modal = document.getElementById("spot-modal");
  const closeBtn = document.getElementById("modal-close");
  
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
}

function openSpotModal(spotId) {
  const spot = SPOTS_DATA.find(s => s.id === spotId);
  if (!spot) return;
  
  const modal = document.getElementById("spot-modal");
  document.getElementById("modal-area").textContent = `${spot.areaName} ｜ Day ${spot.day} ｜ ${spot.typeName}`;
  document.getElementById("modal-title").textContent = spot.name;
  document.getElementById("modal-address").textContent = spot.address;
  
  const noteBox = document.getElementById("modal-note-box");
  if (spot.note) {
    noteBox.style.display = "block";
    document.getElementById("modal-note").textContent = spot.note;
  } else {
    noteBox.style.display = "none";
  }
  
  document.getElementById("modal-gmaps-link").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}`;
  modal.classList.add("show");
}

// ==========================================================================
// 12. 匯率即時試算器 (Currency Converter)
// ==========================================================================
function initCurrencyConverter() {
  const jpyInput = document.getElementById("calc-jpy");
  const twdInput = document.getElementById("calc-twd");
  const rate = 0.2083; // 1 JPY = 0.2083 TWD (1 TWD ≈ 4.8 JPY)
  
  if (!jpyInput || !twdInput) return;
  
  jpyInput.addEventListener("input", () => {
    const jpyVal = parseFloat(jpyInput.value) || 0;
    twdInput.value = Math.round(jpyVal * rate);
  });
}

// ==========================================================================
// 13. 動態楓葉背景畫布 (Foliage Canvas Particle Effect)
// ==========================================================================
function initParticles() {
  const canvas = document.getElementById("foliage-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const leaves = [];
  const leafCount = 28;
  const colors = ["#d84a38", "#e5a852", "#c0392b", "#d35400", "#f39c12"];
  
  for (let i = 0; i < leafCount; i++) {
    leaves.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.2 - 0.6,
      speedY: Math.random() * 0.8 + 0.6,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 1.5 - 0.75,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.3
    });
  }
  
  function animate() {
    if (particlesEnabled) {
      ctx.clearRect(0, 0, width, height);
      
      leaves.forEach(l => {
        l.x += l.speedX + Math.sin(l.y * 0.01) * 0.4;
        l.y += l.speedY;
        l.rotation += l.rotSpeed;
        
        if (l.y > height + 20) {
          l.y = -20;
          l.x = Math.random() * width;
        }
        
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate((l.rotation * Math.PI) / 180);
        ctx.fillStyle = l.color;
        ctx.globalAlpha = l.opacity;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, l.size, l.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    } else {
      ctx.clearRect(0, 0, width, height);
    }
    requestAnimationFrame(animate);
  }
  
  animate();
  
  const toggleBtn = document.getElementById("btn-toggle-particles");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      particlesEnabled = !particlesEnabled;
      toggleBtn.classList.toggle("active", particlesEnabled);
    });
  }
}
