export const poiDeepGunsan = {
  "군산": [
    // --- ATTRACTIONS (명소/역사) ---
    {
      id: "gunsan_att_1", name: "근대역사박물관", category: "attraction", subCategory: "museum",
      themes: { healing: 3, activity: 2, food: 1, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.9904, 126.7115], zone: "center",
      desc: "과거 해상물류 유통의 중심지였던 군산의 1930년대 옛 거리를 완벽하게 재현한 실내 박물관을 구경합니다."
    },
    {
      id: "gunsan_att_2", name: "초원사진관 (8월의 크리스마스)", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 1, culture: 4, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.9868, 126.7082], zone: "center",
      desc: "명작 영화 '8월의 크리스마스'의 주 무대가 된 빛바랜 간판의 사진관 앞에서 아날로그 감성 스냅을 찍습니다."
    },
    {
      id: "gunsan_att_3", name: "신흥동 일본식 가옥 (히로쓰 가옥)", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.9855, 126.7042], zone: "center",
      desc: "일제강점기 미곡상의 적산가옥으로, 목조 건축물의 다다미방과 잘 꾸며진 일본식 정원을 조용히 거닙니다."
    },
    {
      id: "gunsan_att_4", name: "동국사", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.9840, 126.7061], zone: "center",
      desc: "국내에 유일하게 남아 있는 일본식 사찰로, 화려한 단청 없이 검고 높은 지붕이 주는 독특한 분위기를 느낍니다."
    },
    {
      id: "gunsan_att_5", name: "경암동 철길마을", category: "attraction", subCategory: "village",
      themes: { healing: 3, activity: 4, food: 3, culture: 4, shopping: 3 },
      timeOfDay: ["afternoon"], coordinates: [35.9818, 126.7325], zone: "east",
      desc: "낡은 판잣집 사이를 아슬아슬하게 통과하던 옛 철길을 걸으며 추억의 불량식품 달고나를 만들어 먹습니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "gunsan_rel_1", name: "선유도 해수욕장 (고군산군도)", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8152, 126.4150], zone: "west",
      desc: "새만금 방조제를 타고 섬으로 들어가 곱고 고운 모래사장 명사십리와 천혜의 비경을 간직한 선유도를 거닙니다."
    },
    {
      id: "gunsan_rel_2", name: "신시도 자연휴양림", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 3, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8234, 126.4712], zone: "west",
      desc: "아름다운 서해 바다를 향해 별처럼 흩어진 고군산군도의 풍경을 내려다보는 산림욕 트레킹 코스입니다."
    },
    {
      id: "gunsan_rel_3", name: "은파호수공원", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [35.9610, 126.7001], zone: "south",
      desc: "봄이면 벚꽃 잎이 흐드러지게 날리는 거대한 저수지 둘레길을 자전거를 타며 여유롭게 돕니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "gunsan_act_1", name: "철길마을 옛날 교복 체험", category: "activity", subCategory: "culture_exp",
      themes: { healing: 2, activity: 4, food: 1, culture: 4, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.9815, 126.7330], zone: "east",
      desc: "부모님 세대의 얼룩무늬 교련복과 세일러복을 입고 철길과 옛날 기차를 배경으로 흑백 사진을 남깁니다."
    },
    {
      id: "gunsan_act_2", name: "선유도 스카이썬라인 (짚라인)", category: "activity", subCategory: "leisure",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [35.8148, 126.4162], zone: "west",
      desc: "선유도 해수욕장 타워 꼭대기에서 바다 위를 시원하게 가로지르며 활강하는 짜릿한 짚라인 어트랙션입니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "gunsan_res_1", name: "이성당 (단팥빵/야채빵)", category: "restaurant", subCategory: "dessert",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 5 },
      timeOfDay: ["morning", "tea"], coordinates: [35.9880, 126.7118], zone: "center",
      desc: "우리나라에서 가장 오래된 빵집에서 속이 꽉 찬 시그니처 단팥빵과 아삭한 야채빵을 한가득 구매합니다."
    },
    {
      id: "gunsan_res_2", name: "복성루 / 지린성 (전국구 짬뽕 & 고추짜장)", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 1, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.9815, 126.7121], zone: "center",
      desc: "눈물 쏙 빼게 매콤한 지린성 고추짜장이나 돼지고기와 해산물이 듬뿍 올라간 복성루 짬뽕을 줄을 서서 먹습니다."
    },
    {
      id: "gunsan_res_3", name: "한일옥 (소고기 무국)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 4, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "lunch"], coordinates: [35.9866, 126.7083], zone: "center",
      desc: "초원사진관 바로 맞은편 오래된 적산가옥에서 맑고 시원하고 깊은 맛의 한우 소고기 무국으로 해장합니다."
    },
    {
      id: "gunsan_res_4", name: "째보식당 / 계곡가든 간장게장", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 2 },
      timeOfDay: ["lunch", "dinner"], coordinates: [35.9860, 126.7112], zone: "center",
      desc: "서해안의 알이 꽉 찬 암꽃게를 비리지 않게 담근 짭조름한 밥도둑 간장게장과 모둠장(전복, 새우)을 맛봅니다."
    },
    {
      id: "gunsan_res_5", name: "빈해원 (문화재 지정 중국집)", category: "restaurant", subCategory: "traditional",
      themes: { healing: 3, activity: 1, food: 4, culture: 5, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [35.9892, 126.7125], zone: "center",
      desc: "영화 '타짜' 촬영지로 유명한 등록문화재 건물 1층 홀 한가운데 앉아 물짜장과 탕수육을 먹으며 과거로 시간 여행을 합니다."
    },

    // --- CAFES (카페) ---
    {
      id: "gunsan_caf_1", name: "근대 창고형 감성 카페 '틈'", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 4, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.9875, 126.7101], zone: "center",
      desc: "일제강점기 쌀 창고를 리모델링해 담쟁이넝쿨로 덮인 몽환적인 입구를 지나 앤티크한 공간에서 커피를 홀짝입니다."
    },
    {
      id: "gunsan_caf_2", name: "은파호수공원 산타로사", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "evening"], coordinates: [35.9602, 126.6985], zone: "south",
      desc: "호숫가 울창한 나무 사이에 위치한 2층 테라스에서 잔잔한 물결을 감상하며 직접 로스팅한 신선한 커피를 즐깁니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "gunsan_nig_1", name: "은파 물빛다리 야경", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.9620, 126.7020], zone: "south",
      desc: "호수를 가로지르는 긴 보도교에 오색찬란한 야간 조명이 켜지고 음악 분수가 춤추는 환상적인 데이트 코스입니다."
    },
    {
      id: "gunsan_nig_2", name: "비응항 일몰과 등대", category: "nightview", subCategory: "nature",
      themes: { healing: 4, activity: 2, food: 3, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.9325, 126.5350], zone: "west",
      desc: "새만금 방조제 입구의 수산물 시장에서 식사를 마치고 빨간 등대와 바다 위로 떨어지는 웅장한 노을을 조망합니다."
    }
  ]
};
