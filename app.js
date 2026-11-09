/**
 * 202611JapanTrip - 仙台・鹽竈・松島・秋保名湯 6天5夜行程表 核心互動邏輯 (app.js)
 * 特色：全行程嚴格地理區域集中與純單向順行規劃，杜絕折返跑 (Geographically Clustered & Strict Linear Flow)
 * 住宿：HOTEL LiVEMAX Sendai Kokubuncho (2晚)、秋保溫泉 綠水亭 (2晚連住篝火名湯)、Matsushima hill bungalow (松島包棟木屋自炊)
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
    note: "🌟 知名貓島，島上貓比人多，親人可愛。因島上住宿有限，本次行程改訪鹽竈水產市場與古剎，保留作為未來候選景點。"
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
    note: "前往田代島的客船碼頭。自 JR 石卷站步行 17 分鐘（1.1km 漫畫之街）即達。09:00 啟航，船票單程 ¥1,250（售票機投現金）。"
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
    note: "JR 仙石東北線（快速列車）起迄站，從仙台站出發 07:24 發車 08:24 抵達 (車程 60分，單程 ¥860，刷 Suica)。"
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
    note: "日本三大名瀑之一・國指定名勝！落差 55 公尺，秋季滿山金黃楓紅環繞，氣勢雄偉震撼。設有展望台與瀑潭步道。"
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
    note: "適合採買特色伴手禮與限定現烤麵包造型點心，仙台站東口步行 9 分鐘。"
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
    note: "米其林推薦仙台頂級厚切炭烤牛舌！獨家特製牛舌刺身與炭火香氣絕讚。"
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
    note: "冬季仙台在地必吃名物：水芹鴨肉鍋（包含爽脆水芹根部一起涮煮）。"
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
    note: "東北最大交通樞紐，3F 為著名的牛舌通與毛豆泥小徑，B1 為土產銘菓街。"
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
    note: "1897 年創立的百年水果老店，招牌為當季極致水果聖代、生乳卷與鮮果汁。"
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
    note: "排隊名店！現烤鬆軟餅皮包裹飽滿紅豆與當季鮮奶油的爆漿銅鑼燒。"
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
    note: "仙台站前歷史悠久的拱廊商店街，藥妝、居酒屋、拉麵店林立，雨天不愁。"
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
    note: "森林體能活動與高空滑索體驗，享受大自然芬多精冒險。"
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
    note: "陸奧國第一神社，擁有 1200 年以上歷史。境內紅葉古木參天，可遠眺鹽竈港與松島灣景色。"
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
    note: "七濱海邊複合式海鮮餐廳與咖啡館，可遠眺太平洋海景。"
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
    note: "JR 東鹽釜車站步行約 15 分鐘。市場乾淨衛生，可先到各攤位自選刺身，再至 6 號攤位購買白飯與湯品，組裝專屬豪華「My海鮮丼 (マイ海鮮丼)」！亦備有炭烤熟食區。"
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
    note: "擁有東北最大巨型水槽「閃耀三陸之海」與生動的海豚海獅露天表演。"
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
    note: "佔地廣大的回遊式日本庭園，11 月秋季賞楓點燈非常著名，園內有溫泉足湯。"
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
    note: "宮城首家在地葡萄酒莊，結合宮城產葡萄釀造，提供試飲與特色佐酒起司盤。"
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
    note: "隱身在秋保森林裡的超人氣石窯柴燒拿坡里披薩，外脆內 Q，環境極度療癒！"
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
    note: "世界首座萬華鏡美術館，展示光影變幻萬千的光學藝術品，可親手旋轉體驗。"
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
    note: "名取川侵蝕生成的奇岩怪石絕壁，步道入口橋上可俯瞰著名的「天然愛心石」。瑞鳳飯店步行 5 分鐘即達。"
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
    note: "聚集國家級職人工作坊，可親自用毛筆手繪專屬木芥子娃娃 (Kokeshi)。自磊磊峽步行 6 分鐘直達。"
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
    note: "木製透橋五大堂是松島地標；隔壁國寶瑞巖寺與円通院可參加「天然石數珠手作體驗」，住持會為你解析所選石頭代表的運勢。"
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
    note: "日本威士忌之父竹鶴政孝打造的紅磚蒸餾所，免費深度導覽需官網提前預約，可走進橡木桶庫並品嚐限定威士忌。JR 作並站有免費接駁車 14:55 發車。"
  },
  {
    id: 27,
    name: "仙台秋保温泉 篝火の湯 緑水亭 (Ryokusuitei)",
    rawTitle: "仙台秋保温泉 篝火の湯 緑水亭",
    area: "akiu_nikka",
    areaName: "秋保・宮城峽",
    lat: 38.2268,
    lng: 140.7127,
    type: "stay",
    typeName: "篝火名湯旅館",
    address: "宮城縣仙台市太白區秋保町湯元字上原 27-2",
    note: "🌟 東北頂級露天名湯！以萬坪日式山林庭園與夕暮點燃篝火的「篝火之湯」露天風呂聞名天下。本次訂房含早餐，晚餐另安排。"
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
    note: "日本唯一現存最古老的國寶權現造建築，黑漆鑲金箔雕刻華麗非凡，祈求勝利與厄除。るーぷる仙台觀光巴士直達。"
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
    note: "江戶初期奢華「桃山美學」代表作，被高達 400 年的巨型杉木參道包圍，資料館展出伊達政宗陪葬品與復原容貌。09:40 仙台站搭巴士直達。"
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
    note: "廣瀨川上游層疊相連的階梯式瀑布群，水聲如鳳凰鳴叫般悅耳。"
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
    note: "JR 東日本打造的現代化觀光果園，可體驗採摘當季新鮮蘋果/草莓，品嚐農園特製聖代甜點。荒井站轉市營巴士直達。"
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
    note: "松島名物烤牡蠣與極鮮牡蠣丼專門店，坐在二樓可邊賞松島灣景邊嚐美味。"
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
    note: "距離車站 5 分鐘的市民廚房，必吃熱呼呼現炸可樂餅、齋藤生魚片丼與新鮮當季水果。"
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
    note: "伊達政宗建造的天然要塞，站在此處可眺望整個仙台平原與太平洋，經典騎馬像打卡聖地。"
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
    note: "復古單向巡迴觀光巴士，串聯瑞鳳殿、青葉城跡、大崎八幡宮等市區所有精華景點，一日券 ¥630。"
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
    note: "世界罕見完整保留 2 萬年前舊石器時代人類營火遺跡與冰河期森林的地下博物館。地下鐵長町南站步行 5 分。"
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
    note: "氛圍極度迷人的書香復古咖啡館，提供精緻早午餐、法式烘焙甜點與虹吸手沖咖啡。"
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
    note: "整棟文具、生活美學、手帳、日系質感小物的天堂，文具控必逛！仙台站西口天橋直達。"
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
    note: "名列日本三景之一，由 260 座長滿松樹的島嶼構成。搭乘 11:30 定期遊覽船巡航松島灣。JR 仙石線松島海岸站步行 5 分。"
  }
];

// ==========================================================================
// 2. 每日行程時間軸資料 (區域集中・嚴格單向順行・零折返跑)
// ==========================================================================
const ITINERARY_DATA = {
  day1: {
    dayNum: "Day 1", date: "11/19（四）", area: "抵達仙台", stay: "LiVEMAX 國分町",
    morning: "出發準備", afternoon: "抵達仙台、入住", backups: ["定禪寺通", "仙台站牛舌通"],
    transitSummary: "18:45 抵仙台，搭機場線進市區。",
    items: [
      stop("14:35–18:45", "transit", "桃園 → 仙台", "航班時間採當地時間。"),
      stop("抵達後", "transit", "仙台機場線 → 仙台站", "搭機場線進市區，再前往國分町。", 5),
      stop("晚餐", "food", "仙台牛舌", "時間充裕可吃牛たん料理 閣本店，或在仙台站用餐後入住。"),
      stop("15:00 起可入住", "stay", "LiVEMAX 國分町", "四人兩間，兩晚不含餐。")
    ]
  },
  day2: {
    dayNum: "Day 2", date: "11/20（五）", area: "仙台歷史與紅葉", stay: "LiVEMAX 國分町",
    morning: "青葉城跡", afternoon: "瑞鳳殿", backups: ["大崎八幡宮", "仙台朝市"],
    transitSummary: "市區搭觀光巴士或短程計程車。猊鼻溪可整天替換，班次在交通分頁。",
    items: [
      stop("10:00", "spot", "青葉城跡", "上午看城跡與仙台市景。", 41),
      stop("12:30", "food", "だし廊 DASHIRO 本店", "食べログ 3.74，2025 拉麵 EAST 百名店。", null, "https://tabelog.com/miyagi/A0401/A040101/4019493/"),
      stop("14:30", "spot", "瑞鳳殿", "先看白天紅葉，15:30 預計點燈。週五依一般入場時間。", 29, "https://www.sentabi.jp/events/217?lang=en"),
      stop("18:00–18:30", "food", "佗び助 芹菜鍋", "可先詢四人座位，備案是仙台站旁的せり草庵。", null, "https://tabelog.com/miyagi/A0401/A040101/4002537/")
    ]
  },
  day3: {
    dayNum: "Day 3", date: "11/21（六）", area: "鹽釜海鮮與神社", stay: "秋保綠水亭",
    morning: "鹽釜水產市場", afternoon: "鹽竈神社", backups: ["浦霞酒ギャラリー", "榮太樓鹽竈本店"],
    transitSummary: "08:15–08:30 退房寄行李。搭 JR 仙石線到東鹽釜，14:15 前回仙台站取行李，15:00 東口接駁。",
    driveSummary: "08:30 左右仙台站取車，市場 → 神社 → 綠水亭。住宿免費停車，15:00–16:00 入住。",
    items: [
      stop("上午", "food", "鹽釜水產市場", "挑當季鮪魚做海鮮丼，市場也有熟食。", 16),
      stop("約 12:00", "spot", "鹽竈神社", "市場到神社可搭車至上方停車場。", 14),
      stop("15:00–18:00", "stay", "秋保溫泉綠水亭", "入住、泡湯。訂房含早餐，晚餐另安排。", 27),
      stop("18:00 或 18:30", "food", "秋保酒莊 TERROAGE AKIU", "先詢四人預約。備案是さいち熟食。駕駛想喝酒可搭車往返。", 19, "https://akiuwinery.co.jp/pages/shop-restaurant")
    ]
  },
  day4: {
    dayNum: "Day 4", date: "11/22（日）", area: "秋保峽谷與大瀑布", stay: "秋保綠水亭",
    morning: "磊磊峽", afternoon: "秋保大瀑布", backups: ["天守閣自然公園", "秋保・里センター"],
    transitSummary: "里センター 12:57 → 大瀑布 13:22，回程 14:30 → 14:57，15:31 為後備回程。",
    driveSummary: "午餐後開車去瀑布觀景台停車場，依紅葉或天候選大瀑布或天守閣。",
    items: [
      stop("上午", "spot", "磊磊峽", "旅館早餐後步行看覗橋和峽谷。", 22),
      stop("11:00 左右", "food", "Dottore 森林披薩", "食べログ 3.61，2023 披薩百名店。搭巴士時留意排隊時間。", 20, "https://tabelog.com/miyagi/A0401/A040105/4013772/"),
      stop("下午", "spot", "秋保大瀑布", "以觀景台為主。葉況普通可換天守閣自然公園，看庭園、泡足湯。", 104),
      stop("18:00", "food", "柏鮨 秋保店", "先詢四人座位，備案是さいち熟食。", null, "https://tabelog.com/miyagi/A0401/A040105/4012604/")
    ]
  },
  day5: {
    dayNum: "Day 5", date: "11/23（一・祝）", area: "松島紅葉與木屋自炊", stay: "Matsushima hill bungalow",
    morning: "秋保移動到松島", afternoon: "円通院", backups: ["14:00 仁王丸遊船", "五大堂"],
    transitSummary: "09:40 左右退房，10:00 接駁回仙台站，11:10–11:49 JR 至松島海岸。約 15:10 搭車去超市和木屋。",
    driveSummary: "09:30 左右開往松島，目標 11:00 前停車。約 15:10 開去 A&COOP，再到木屋。",
    items: [
      stop("12:20", "food", "松島 寿司幸", "食べログ 3.56，先問四人午餐。備案是さんとり茶屋。", null, "https://tabelog.com/miyagi/A0404/A040404/4001492/"),
      stop("約 13:30", "spot", "松島円通院", "Weathernews 目前預估約 11/25 開始落葉。葉況轉差時可換 14:00 仁王丸。", 25, "https://weathernews.jp/koyo/spot/23421/"),
      stop("15:20–15:50", "food", "A&COOP 松島店採買", "一起買晚餐和隔日早餐。火鍋可備肉片、白菜、菇類、豆腐和烏龍麵。", null, "https://www.acoop-east-t.jp/store/list/store_52.html"),
      stop("16:00–16:30", "stay", "松島包棟木屋自炊", "15:00–19:00 可入住。公開頁列免費私人停車，依房東資訊入場。")
    ]
  },
  day6: {
    dayNum: "Day 6", date: "11/24（二）", area: "松島退房與返台", stay: "回程日",
    morning: "木屋早餐、退房", afternoon: "午餐、仙台機場", backups: ["仙台朝市", "仙台站ずんだ小径"],
    transitSummary: "木屋約車到車站，16:30 仙台站搭機場線，約 16:57 抵機場。",
    driveSummary: "松島或仙台站午餐，15:30–16:00 到機場租車門市，留時間加油、驗車和接駁。",
    items: [
      stop("10:00 前", "stay", "木屋退房", "吃前一天備好的早餐，整理行李後出發。"),
      stop("午餐", "food", "すし哲 S-PAL 仙台店", "食べログ 3.68。自駕也可留在松島吃午餐。", 5, "https://tabelog.com/miyagi/A0401/A040101/4000160/"),
      stop("19:40", "transit", "仙台 → 桃園", "19:40 仙台起飛，23:00 桃園抵達，時間為當地時間。")
    ]
  }
};

function stop(time, type, title, desc, spotId = null, source = null) {
  const typeNames = { spot: "景點", food: "用餐與採買", transit: "交通", stay: "住宿" };
  return { time, type, typeName: typeNames[type], title, desc, spotId, source };
}

// ==========================================================================
// 3. 全局變數與地圖實例
// ==========================================================================
let dayMap = null;
let fullMap = null;
let dayMarkersLayer = null;
let dayRouteLayer = null;
let fullMarkersLayer = null;
let currentDay = "day1";
let travelMode = "drive";
let particlesEnabled = true;

// ==========================================================================
// 4. 初始化入口
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initTabs();
  initDaySwitcher();
  initTripOverview();
  renderTimeline(currentDay);
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

function initTripOverview() {
  document.getElementById("trip-overview").innerHTML = Object.entries(ITINERARY_DATA)
    .map(([key, day]) => `<button type="button" class="trip-overview-card" data-open-day="${key}">
      <strong>${day.date} ・ ${day.area}</strong>
      <span>上午　${day.morning}</span>
      <span>下午　${day.afternoon}</span>
    </button>`).join("");

  document.querySelectorAll("[data-open-day]").forEach(button => {
    button.addEventListener("click", () => {
      const dayButton = document.querySelector(`[data-day="${button.dataset.openDay}"]`);
      dayButton.click();
      dayButton.focus({ preventScroll: true });
      document.querySelector(".day-switcher").scrollIntoView({ block: "start" });
    });
  });

  const modeButtons = document.querySelectorAll("[data-travel-mode]");
  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      travelMode = button.dataset.travelMode;
      modeButtons.forEach(option => option.setAttribute("aria-pressed", String(option === button)));
      renderTimeline(currentDay);
      updateDayMap(currentDay);
    });
  });
}

function renderTimeline(dayKey) {
  const container = document.getElementById("timeline-container");
  const dayData = ITINERARY_DATA[dayKey];
  if (!dayData) return;
  const useCar = travelMode === "drive" && dayData.driveSummary;
  const transport = useCar ? dayData.driveSummary : dayData.transitSummary;
  
  let html = `
    <div class="day-header-summary">
      <div>
        <h2><i class="fa-solid fa-calendar-day text-gold"></i> ${dayData.dayNum} ｜ ${dayData.date}</h2>
        <div class="day-transit-summary-badge">
          <i class="fa-solid fa-train-subway"></i> <strong>${useCar ? "分段自駕" : "大眾交通"}</strong>　${transport}
        </div>
      </div>
      <div class="day-meta-tags">
        <span class="day-tag"><i class="fa-solid fa-location-dot"></i> ${dayData.area}</span>
        <span class="day-tag"><i class="fa-solid fa-bed"></i> ${dayData.stay}</span>
      </div>
    </div>
  `;
  
  html += `<p class="trip-backups"><strong>兩個備案</strong>　${dayData.backups.join(" ・ ")}</p>`;

  dayData.items.forEach(item => {
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
          
          <div class="card-footer-info">
            ${item.source ? `<a class="mini-btn" href="${item.source}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">來源與營業資訊</a>` : ""}
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

function createTripMap(id, zoom) {
  const status = document.getElementById(`${id}-status`);
  const message = status.firstChild;
  let map = null;
  const showFailure = () => {
    message.textContent = map ? "詳細圖磚暫時無法載入，目前顯示區域底圖。" : "地圖暫時無法載入。";
    status.hidden = false;
  };

  if (typeof L === "undefined") {
    showFailure();
    return null;
  }

  map = L.map(id, { minZoom: 5, maxZoom: 18 })
    .setView([38.2601, 140.8824], zoom);
  const attribution = '<a href="https://openfreemap.org/">OpenFreeMap</a> · <a href="https://openmaptiles.org/">© OpenMapTiles</a> · <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>';
  map.createPane("overview").style.zIndex = 190;
  L.imageOverlay("assets/tohoku-overview.webp?v=positron", [[37.71859033, 140.2734375], [38.82259098, 141.6796875]], {
    pane: "overview",
    alt: "仙台、秋保、松島街道底圖",
    attribution
  }).addTo(map);

  if (typeof MaplibreGLLeaflet === "undefined") {
    showFailure();
    return map;
  }

  try {
    const layer = MaplibreGLLeaflet.maplibreGL({
      style: "https://tiles.openfreemap.org/styles/positron",
      attributionControl: false
    }).addTo(map);
    const vectorMap = layer.getMaplibreMap();
    const canvas = vectorMap.getCanvas();
    canvas.style.opacity = "0";
    let failed = false;
    vectorMap.on("error", () => {
      if (canvas.style.opacity === "0") {
        failed = true;
        showFailure();
      }
    });
    vectorMap.once("idle", () => {
      if (!failed) {
        canvas.style.opacity = "1";
        status.hidden = true;
      }
    });
  } catch {
    showFailure();
  }
  return map;
}

function initDayMap() {
  dayMap = createTripMap("itinerary-day-map", 11);
  if (!dayMap) return;
  dayRouteLayer = L.layerGroup().addTo(dayMap);
  dayMarkersLayer = L.featureGroup().addTo(dayMap);
  updateDayMap("day1");
}

function directionsUrl(points, mode) {
  const params = new URLSearchParams({
    api: "1",
    origin: points[0][3],
    destination: points.at(-1)[3],
    travelmode: mode
  });
  if (points.length > 2) {
    params.set("waypoints", points.slice(1, -1).map(point => point[3]).join("|"));
  }
  return `https://www.google.com/maps/dir/?${params}`;
}

function renderDayRoute(dayKey) {
  const route = TRIP_MAP_ROUTES[dayKey];
  const driving = travelMode === "drive" ? route.drive : null;
  const keys = driving ? driving.stops : route.transit;
  const points = keys.map(key => TRIP_ROUTE_POINTS[key]);
  const coordinates = driving ? driving.line : points.map(([, lat, lng]) => [lat, lng]);
  const pathStyle = { interactive: false, lineCap: "round" };
  const dashArray = driving ? undefined : "7 9";
  L.polyline(coordinates, { ...pathStyle, color: "#fff", weight: 8, opacity: 0.9, dashArray }).addTo(dayRouteLayer);
  L.polyline(coordinates, { ...pathStyle, color: "#1769e0", weight: 4, dashArray, className: "trip-route-line" }).addTo(dayRouteLayer);

  const order = new Map();
  keys.forEach((key, index) => order.set(key, [...(order.get(key) ?? []), index + 1]));
  for (const [key, numbers] of order) {
    const [name, lat, lng, query, spotId] = TRIP_ROUTE_POINTS[key];
    const label = numbers.join("・");
    const icon = L.divIcon({ className: "trip-route-pin", html: label, iconSize: [32, 32], iconAnchor: [16, 16] });
    const marker = L.marker([lat, lng], { icon, title: `${label} ${name}`, alt: `${label} ${name}` });
    const url = `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
    marker.bindPopup(`<strong>${label}　${name}</strong><br><a href="${url}" target="_blank" rel="noopener">在 Google Maps 開啟</a>`);
    marker.spotId = spotId;
    dayMarkersLayer.addLayer(marker);
  }

  const summary = document.getElementById("day-route-summary");
  const items = points.map((point, index) => {
    const next = points[index + 1];
    const link = !driving && next
      ? ` <a href="${directionsUrl([point, next], "transit")}" target="_blank" rel="noopener">查到下一站</a>`
      : "";
    return `<li>${point[0]}${link}</li>`;
  }).join("");
  summary.innerHTML = `<p class="route-key ${driving ? "" : "route-key-transit"}">${driving ? "自駕道路參考線" : "大眾交通與步行順序示意"}</p>
    <ol>${items}</ol>
    ${driving ? `<a href="${directionsUrl(points, "driving")}" target="_blank" rel="noopener">用 Google Maps 開啟自駕路線</a>
      <small>道路資料 © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>，以即時導航為準。</small>` : ""}`;
  return { points, coordinates };
}

function updateDayMap(dayKey) {
  if (!dayMap || !dayMarkersLayer) return;
  dayMap.stop();
  dayMarkersLayer.clearLayers();
  dayRouteLayer.clearLayers();
  const { points, coordinates } = renderDayRoute(dayKey);
  
  const dayNum = Number(dayKey.slice(3));
  const spotIds = new Set(ITINERARY_DATA[dayKey].items.map(item => item.spotId));
  const routeIds = new Set(points.map(point => point[4]));
  const daySpots = SPOTS_DATA.filter(spot => spotIds.has(spot.id) && !routeIds.has(spot.id));
  
  daySpots.forEach(spot => {
    const icon = getCustomMarkerIcon(spot.type, dayNum);
    const marker = L.marker([spot.lat, spot.lng], { icon: icon });
    
    const popupContent = `
      <div style="font-family: 'Noto Sans TC', sans-serif; min-width: 190px;">
        <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #111;">${spot.name}</h4>
        <div style="font-size: 11px; color: #666; margin-bottom: 6px;">Day ${dayNum} ｜ ${spot.typeName} ｜ ${spot.areaName}</div>
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
  
  dayMap.fitBounds(dayMarkersLayer.getBounds().extend(L.latLngBounds(coordinates)), { padding: [36, 36], maxZoom: 14, animate: false });
}

function focusSpotOnMap(spotId) {
  if (!dayMap) return;
  const marker = dayMarkersLayer.getLayers().find(layer => layer.spotId === spotId);
  if (!marker) return;
  dayMap.flyTo(marker.getLatLng(), 14, { duration: 1.2 });
  marker.openPopup();
}

function handleTimelineItemClick(spotId) {
  if (spotId) {
    focusSpotOnMap(spotId);
  }
}

// ==========================================================================
// 9. 全域景點地圖 (Tab 4)
// ==========================================================================
function tripDayForSpot(spotId) {
  return Object.values(ITINERARY_DATA).find(day => day.items.some(item => item.spotId === spotId));
}

function initFullMap() {
  fullMap = createTripMap("full-interactive-map", 10);
  if (!fullMap) return;
  requestAnimationFrame(() => fullMap.invalidateSize());

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
    const day = tripDayForSpot(spot.id);
    const icon = getCustomMarkerIcon(spot.type, day ? Number(day.dayNum.slice(4)) : null);
    const marker = L.marker([spot.lat, spot.lng], { icon: icon });
    
    const popupContent = `
      <div style="font-family: 'Noto Sans TC', sans-serif; min-width: 200px;">
        <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #111;">${spot.name}</h4>
        <div style="font-size: 11px; color: #666; margin-bottom: 6px;">${day?.dayNum ?? "收藏"} ｜ ${spot.typeName} ｜ ${spot.areaName}</div>
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
    const day = tripDayForSpot(spot.id);
    html += `
      <div class="spot-vault-card">
        <div class="spot-card-top">
          <div class="spot-card-badges">
            <span class="spot-area-tag">${spot.areaName}</span>
            <span class="spot-idx">${day?.dayNum ?? "收藏"} ・ #${spot.id}</span>
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
  document.getElementById("modal-area").textContent = `${spot.areaName} ｜ ${tripDayForSpot(spot.id)?.dayNum ?? "收藏"} ｜ ${spot.typeName}`;
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
