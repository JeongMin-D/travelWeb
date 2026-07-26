export const poiDeepGyeongju = {
  "경주": [
    // --- ATTRACTIONS (명소/역사) ---
    {
      id: "gyeongju_att_1", name: "불국사", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.7901, 129.3320], zone: "east",
      desc: "유네스코 세계문화유산이자 신라 불교 미술의 정수인 다보탑, 석가탑의 아름다움을 감상하며 천년의 숨결을 느낍니다."
    },
    {
      id: "gyeongju_att_2", name: "석굴암", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [35.7950, 129.3490], zone: "east",
      desc: "토함산 중턱에 자리한 완벽한 비례의 웅장한 인공 석굴과 자비로운 미소의 본존불을 마주하며 경건함을 느낍니다."
    },
    {
      id: "gyeongju_att_3", name: "대릉원 & 천마총", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8384, 129.2114], zone: "center",
      desc: "경주 도심 한가운데 솟아오른 거대한 신라 고분군 사이를 걷고 화려한 천마도와 금관이 출토된 천마총 내부를 관람합니다."
    },
    {
      id: "gyeongju_att_4", name: "첨성대 & 핑크뮬리 꽃밭", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [35.8347, 129.2190], zone: "center",
      desc: "동양 최고의 천문 관측대 주변으로 넓게 펼쳐진 가을 핑크뮬리와 계절 꽃밭에서 아름다운 산책을 즐깁니다."
    },
    {
      id: "gyeongju_att_5", name: "국립경주박물관 (에밀레종)", category: "attraction", subCategory: "museum",
      themes: { healing: 3, activity: 1, food: 1, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8291, 129.2272], zone: "center",
      desc: "수만 점의 신라 유물이 전시된 거대한 박물관에서 눈부신 금관과 성덕대왕신종의 장엄함을 관람합니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "gyeongju_rel_1", name: "보문호수 둘레길 산책", category: "relaxation", subCategory: "lake",
      themes: { healing: 5, activity: 3, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8421, 129.2842], zone: "east",
      desc: "봄에는 벚꽃이 흩날리고 가을에는 단풍이 물드는 거대한 보문호수 주변을 자전거나 도보로 여유롭게 한 바퀴 돕니다."
    },
    {
      id: "gyeongju_rel_2", name: "경상북도 산림환경연구원", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8078, 129.2391], zone: "south",
      desc: "외나무다리 포토존과 쭉 뻗은 메타세쿼이아 숲길이 있는 고요한 수목원에서 완벽한 자연의 힐링을 얻습니다."
    },
    {
      id: "gyeongju_rel_3", name: "교촌 한옥마을", category: "relaxation", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 3, culture: 4, shopping: 2 },
      timeOfDay: ["afternoon"], coordinates: [35.8295, 129.2163], zone: "center",
      desc: "최부자댁의 철학이 담긴 고즈넉한 한옥 마을을 거닐며 전통주 체험과 떡메치기 등 전통 문화를 느낍니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "gyeongju_act_1", name: "경주월드 어뮤즈먼트", category: "activity", subCategory: "theme_park",
      themes: { healing: 1, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8385, 129.2816], zone: "east",
      desc: "90도 수직으로 떨어지는 최강 스릴의 다이브 코스터 '드라켄'을 비롯한 아찔한 놀이기구들을 타고 스트레스를 날립니다."
    },
    {
      id: "gyeongju_act_2", name: "황리단길 한복 & 개화기 의상 체험", category: "activity", subCategory: "culture_exp",
      themes: { healing: 3, activity: 4, food: 2, culture: 4, shopping: 3 },
      timeOfDay: ["afternoon"], coordinates: [35.8382, 129.2095], zone: "center",
      desc: "힙하고 전통적인 황리단길에서 아름다운 한복을 빌려 입고 네컷 사진을 남기며 즐거운 추억을 만듭니다."
    },

    // --- RESTAURANTS (식당) ---
    {
      id: "gyeongju_res_1", name: "보문단지 맷돌순두부", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "morning"], coordinates: [35.8451, 129.2780], zone: "east",
      desc: "국산 콩을 맷돌로 직접 갈아 만든 몽글몽글하고 고소한 순두부찌개에 날계란을 풀어 뜨끈하게 속을 채웁니다."
    },
    {
      id: "gyeongju_res_2", name: "교리김밥 본점", category: "restaurant", subCategory: "street_food",
      themes: { healing: 2, activity: 2, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "morning"], coordinates: [35.8290, 129.2155], zone: "center",
      desc: "얇게 채 썬 짭짤하고 부드러운 계란지단이 터질 듯 듬뿍 들어간 전국구 명물 김밥을 줄 서서 포장해 먹습니다."
    },
    {
      id: "gyeongju_res_3", name: "경주 한우 떡갈비 정식", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [35.8398, 129.2081], zone: "center",
      desc: "황리단길 인근에서 육즙이 촉촉하게 배어 나오는 달콤 짭짤한 한우 떡갈비와 풍성한 신라식 한정식을 맛봅니다."
    },
    {
      id: "gyeongju_res_4", name: "경주빵 & 찰보리빵", category: "restaurant", subCategory: "dessert",
      themes: { healing: 2, activity: 1, food: 4, culture: 3, shopping: 5 },
      timeOfDay: ["afternoon", "tea"], coordinates: [35.8402, 129.2123], zone: "center",
      desc: "얇은 피 속에 팥앙금이 가득한 경주빵과 쫀득쫀득하고 구수한 찰보리빵을 여행 선물로 구매하고 간식으로 즐깁니다."
    },
    {
      id: "gyeongju_res_5", name: "함양집 본점 (한우물회 & 육회비빔밥)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.8465, 129.2795], zone: "east",
      desc: "살얼음 동동 띄운 새콤달콤하고 시원한 육수에 신선한 육회가 듬뿍 올라간 한우물회의 독보적인 맛을 경험합니다."
    },

    // --- CAFES (카페) ---
    {
      id: "gyeongju_caf_1", name: "황리단길 대형 한옥 카페 (루프탑)", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 5, shopping: 3 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.8391, 129.2088], zone: "center",
      desc: "전통 기와지붕이 파도처럼 이어지는 멋진 전경을 테라스에 앉아 감상하며 퓨전 디저트와 아인슈페너를 마십니다."
    },
    {
      id: "gyeongju_caf_2", name: "보문호수 오션뷰(호수뷰) 카페", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.8430, 129.2811], zone: "east",
      desc: "반짝이는 맑은 보문호수의 잔잔한 물결을 통유리창으로 조망하는 웅장한 대형 카페에서 여유를 만끽합니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "gyeongju_nig_1", name: "동궁과 월지 (안압지) 야경", category: "nightview", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.8349, 129.2266], zone: "center",
      desc: "거울처럼 맑은 연못에 비친 화려하고 신비로운 신라 왕궁의 누각 야경을 보며 황홀경에 빠집니다."
    },
    {
      id: "gyeongju_nig_2", name: "월정교 야경 산책", category: "nightview", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.8285, 129.2155], zone: "center",
      desc: "남천 위를 수놓은 웅장하고 아름다운 목조 교량의 은은한 단청 조명을 감상하며 낭만적인 밤길을 걷습니다."
    }
  ]
};
