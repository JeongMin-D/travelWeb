export const poiDeepGangneung = {
  "강릉": [
    // --- ATTRACTIONS (명소/역사) ---
    {
      id: "gangneung_att_1", name: "오죽헌", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7818, 128.8784], zone: "center",
      desc: "신사임당과 율곡 이이가 태어난 곳으로, 검은 대나무 숲이 둘러싸인 고즈넉하고 아름다운 조선 시대 건축물을 관람합니다."
    },
    {
      id: "gangneung_att_2", name: "강릉 선교장", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7885, 128.8872], zone: "center",
      desc: "조선 시대 사대부 가옥의 원형이 가장 잘 보존된 아름다운 한옥 저택과 연꽃이 가득한 활래정을 거닙니다."
    },
    {
      id: "gangneung_att_3", name: "하슬라 아트월드", category: "attraction", subCategory: "museum",
      themes: { healing: 4, activity: 3, food: 2, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7121, 129.0116], zone: "south",
      desc: "동해 바다를 마주하는 산기슭에 조성된 거대한 야외 조각 공원과 이색적인 현대 미술관에서 인생 사진을 남깁니다."
    },
    {
      id: "gangneung_att_4", name: "정동심곡 바다부채길", category: "attraction", subCategory: "nature",
      themes: { healing: 4, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.6698, 129.0498], zone: "south",
      desc: "2300만 년 전 지각변동으로 생긴 천혜의 기암괴석과 투명한 바다를 감상할 수 있는 해안 단구 탐방로를 걷습니다."
    },
    {
      id: "gangneung_att_5", name: "경포대 & 경포호", category: "relaxation", subCategory: "lake",
      themes: { healing: 5, activity: 3, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.7951, 128.8964], zone: "center",
      desc: "관동팔경 중 하나인 경포대에 올라 고요한 호수 전경을 감상하고 호숫가를 따라 자전거를 탑니다."
    },

    // --- RELAXATION (자연/휴식/해변) ---
    {
      id: "gangneung_rel_1", name: "경포 해수욕장", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.8052, 128.9077], zone: "east",
      desc: "넓은 백사장과 울창한 소나무 숲이 어우러진 강릉 최대의 해변에서 시원한 동해 바다를 즐깁니다."
    },
    {
      id: "gangneung_rel_2", name: "안목해변 (커피거리)", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 2, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [37.7716, 128.9472], zone: "east",
      desc: "향긋한 커피 향이 진동하는 해변을 걸으며 부서지는 파도를 보고 여유로운 산책을 합니다."
    },
    {
      id: "gangneung_rel_3", name: "강문해변 포토존", category: "relaxation", subCategory: "beach",
      themes: { healing: 4, activity: 2, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7957, 128.9174], zone: "east",
      desc: "수제 버거 맛집이 모여 있고 해변 곳곳에 설치된 예쁜 액자형 조형물에서 바다 배경으로 사진을 찍습니다."
    },
    {
      id: "gangneung_rel_4", name: "솔향수목원", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 3, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.6974, 128.8512], zone: "west",
      desc: "금강소나무 숲속의 맑은 계곡을 따라 걸으며 피톤치드를 듬뿍 마시는 완벽한 힐링 생태 공원입니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "gangneung_act_1", name: "정동진 레일바이크", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.6896, 129.0322], zone: "south",
      desc: "정동진역에서 출발해 파도가 치는 해안선을 바짝 따라 달리며 시원한 바닷바람과 짜릿함을 느낍니다."
    },
    {
      id: "gangneung_act_2", name: "아라나비 짚라인", category: "activity", subCategory: "leisure",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.7661, 128.9515], zone: "east",
      desc: "안목해변 근처 남항진에서 바다 위를 가로질러 300m를 빠르게 활강하는 아찔한 공중 질주를 체험합니다."
    },
    {
      id: "gangneung_act_3", name: "사천진 해변 서핑", category: "activity", subCategory: "watersports",
      themes: { healing: 3, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.8341, 128.8752], zone: "north",
      desc: "비교적 한적하고 파도가 좋은 사천진 해변에서 초보자도 안심하고 서핑 강습을 받으며 파도를 즐깁니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "gangneung_res_1", name: "초당 짬뽕순두부 골목", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "morning"], coordinates: [37.7885, 128.9136], zone: "east",
      desc: "부드럽고 담백한 초당순두부에 얼큰하고 불맛 나는 짬뽕 국물을 접목시킨 강릉 최고의 웨이팅 맛집입니다."
    },
    {
      id: "gangneung_res_2", name: "엄지네 포장마차 (꼬막비빔밥)", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 1, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.7675, 128.9042], zone: "center",
      desc: "거대한 접시에 매콤하고 고소하게 양념된 꼬막무침과 볶음밥이 반반씩 나오는 전국구 유명 맛집입니다."
    },
    {
      id: "gangneung_res_3", name: "중앙시장 닭강정 & 먹거리 탐방", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 3, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["lunch", "evening"], coordinates: [37.7540, 128.8986], zone: "center",
      desc: "바삭하고 달콤한 명물 닭강정, 수제 어묵 고로케, 아이스크림 호떡 등 활기찬 시장에서 길거리 음식을 섭렵합니다."
    },
    {
      id: "gangneung_res_4", name: "장칼국수 (형제칼국수/벌집)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [37.7552, 128.8953], zone: "center",
      desc: "고추장으로 진하고 텁텁하게 끓여내어 얼큰하고 구수한 강원도식 향토 음식 장칼국수로 땀을 뺍니다."
    },
    {
      id: "gangneung_res_5", name: "주문진 수산시장 오징어회 & 대게", category: "restaurant", subCategory: "seafood",
      themes: { healing: 1, activity: 2, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["dinner"], coordinates: [37.8920, 128.8288], zone: "north",
      desc: "동해안 최대 수산시장에서 살아있는 쫄깃한 오징어회와 살이 꽉 찬 대게찜을 배부르게 즐깁니다."
    },
    {
      id: "gangneung_res_6", name: "교동반점 (강릉 교동짬뽕 본점)", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 1, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [37.7644, 128.8966], zone: "center",
      desc: "해산물과 고기가 진하게 어우러진 전국 5대 짬뽕의 묵직하고 후추 향이 강한 국물을 맛봅니다."
    },

    // --- CAFES (카페/디저트) ---
    {
      id: "gangneung_caf_1", name: "카페 툇마루 (흑임자 커피)", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 3, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [37.7944, 128.9103], zone: "east",
      desc: "고소한 흑임자 크림과 진한 에스프레소가 층을 이룬 시그니처 툇마루 커피를 맛보기 위해 기꺼이 줄을 섭니다."
    },
    {
      id: "gangneung_caf_2", name: "갤러리밥스 (초당옥수수 커피)", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 3, activity: 1, food: 5, culture: 1, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [37.7885, 128.9056], zone: "east",
      desc: "강릉 초당옥수수의 달콤하고 고소한 풍미가 에스프레소와 섞여 입안을 감도는 환상적인 크림 라떼를 마십니다."
    },
    {
      id: "gangneung_caf_3", name: "안목해변 테라로사 커피", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 2 },
      timeOfDay: ["tea", "morning"], coordinates: [37.7712, 128.9481], zone: "east",
      desc: "국내 스페셜티 커피의 성지에서 드립 커피를 마시며 통유리 너머로 쏟아지는 동해 바다의 푸른 파도를 봅니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "gangneung_nig_1", name: "정동진 모래시계공원 야경", category: "nightview", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [37.6854, 129.0346], zone: "south",
      desc: "거대한 모래시계와 기차를 개조한 박물관에 조명이 켜진 고즈넉한 바닷가를 산책하며 밤의 낭만을 느낍니다."
    }
  ]
};
