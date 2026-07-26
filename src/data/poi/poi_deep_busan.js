export const poiDeepBusan = {
  "부산": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "busan_att_1", name: "해운대 블루라인파크 (해변열차)", category: "attraction", subCategory: "leisure",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.1583, 129.1764], zone: "east",
      desc: "과거 동해남부선 폐철길을 따라 아름다운 해안 절경을 달리며 청사포와 송정을 잇는 낭만적인 해변열차에 탑승합니다."
    },
    {
      id: "busan_att_2", name: "감천문화마을", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 3, food: 2, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.0975, 129.0106], zone: "west",
      desc: "산비탈을 따라 계단식으로 들어선 알록달록한 파스텔톤 집들이 모인 '한국의 마추픽추' 골목을 누비며 벽화를 감상합니다."
    },
    {
      id: "busan_att_3", name: "해동용궁사", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [35.1884, 129.2233], zone: "east",
      desc: "망망대해를 굽어보는 아찔한 해안 절벽 위에 세워진 우리나라에서 가장 아름다운 일출 명소 사찰을 방문합니다."
    },
    {
      id: "busan_att_4", name: "태종대 유원지 & 다누비 열차", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.0531, 129.0874], zone: "south",
      desc: "울창한 해송 숲과 기암절벽으로 이루어진 해안을 다누비 순환 열차를 타고 편안하게 돌며 탁 트인 바다를 조망합니다."
    },
    {
      id: "busan_att_5", name: "송도 해상케이블카", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 4, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [35.0759, 129.0225], zone: "west",
      desc: "투명한 크리스탈 캐빈을 타고 바다 위를 가로지르며 송도 해수욕장과 기암괴석의 짜릿한 전망을 공중에서 감상합니다."
    },

    // --- RELAXATION (휴식/자연/해변) ---
    {
      id: "busan_rel_1", name: "광안리 해수욕장", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 2, food: 3, culture: 2, shopping: 2 },
      timeOfDay: ["afternoon", "evening"], coordinates: [35.1532, 129.1186], zone: "center",
      desc: "고운 모래사장 위를 거닐고 낭만적인 광안대교 뷰를 감상하며 해변에 늘어선 트렌디한 펍과 카페를 탐험합니다."
    },
    {
      id: "busan_rel_2", name: "동백섬 & 누리마루 APEC하우스", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 3, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.1542, 129.1511], zone: "east",
      desc: "해운대 해변 끝자락에 위치한 섬을 한 바퀴 도는 산책로를 걸으며 맑은 바다와 APEC 정상회의장을 둘러봅니다."
    },
    {
      id: "busan_rel_3", name: "다대포 해수욕장 & 꿈의 낙조분수", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.0483, 128.9664], zone: "west",
      desc: "끝없이 펼쳐진 수심이 얕은 갯벌 위로 떨어지는 전국 최고의 황홀한 일몰을 보고 웅장한 음악 분수 쇼를 관람합니다."
    },
    {
      id: "busan_rel_4", name: "이기대 해안산책로", category: "relaxation", subCategory: "nature",
      themes: { healing: 4, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [35.1227, 129.1171], zone: "south",
      desc: "아찔한 해안 절벽을 따라 조성된 스펙터클한 트레킹 코스를 걸으며 광안대교와 해운대의 풍광을 한눈에 담습니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "busan_act_1", name: "수영만 요트경기장 야간 요트투어", category: "activity", subCategory: "leisure",
      themes: { healing: 5, activity: 4, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.1610, 129.1437], zone: "east",
      desc: "해 질 녘이나 밤에 프라이빗한 요트에 탑승해 샴페인을 마시며 광안대교 밑을 지나는 럭셔리한 불꽃놀이를 즐깁니다."
    },
    {
      id: "busan_act_2", name: "부산 엑스더스카이 전망대", category: "activity", subCategory: "viewpoint",
      themes: { healing: 3, activity: 2, food: 2, culture: 2, shopping: 2 },
      timeOfDay: ["afternoon", "evening"], coordinates: [35.1594, 129.1670], zone: "east",
      desc: "해운대 엘시티 100층 전망대에 올라 발밑으로 아찔하게 펼쳐진 오션뷰와 화려한 마천루 시티뷰를 조망합니다."
    },
    {
      id: "busan_act_3", name: "스카이라인 루지 부산", category: "activity", subCategory: "theme_park",
      themes: { healing: 1, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.1952, 129.2131], zone: "east",
      desc: "기장 오시리아 관광단지에서 리프트를 타고 올라가 구불구불한 트랙을 따라 바다를 보며 스릴 넘치게 활강합니다."
    },
    {
      id: "busan_act_4", name: "송정 해수욕장 서핑 강습", category: "activity", subCategory: "watersports",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.1786, 129.1997], zone: "east",
      desc: "수심이 얕고 파도가 좋아 '한국의 서핑 성지'로 불리는 해변에서 서프보드에 올라 파도를 타는 법을 배웁니다."
    },

    // --- RESTAURANTS (식당) ---
    {
      id: "busan_res_1", name: "서면 돼지국밥 골목", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 2 },
      timeOfDay: ["lunch", "morning"], coordinates: [35.1534, 129.0592], zone: "center",
      desc: "돼지 뼈를 푹 고아 낸 뽀얗고 구수한 국물에 야들야들한 수육과 부추무침을 듬뿍 넣어 든든하게 속을 채웁니다."
    },
    {
      id: "busan_res_2", name: "해운대 암소갈비 전문점", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [35.1631, 129.1636], zone: "east",
      desc: "부드러운 최상급 한우 암소 갈비를 숯불에 굽고, 가장자리에 감자 사리를 끓여 먹는 독특하고 고급스러운 미식 체험입니다."
    },
    {
      id: "busan_res_3", name: "자갈치시장 생선회 & 꼼장어 연탄구이", category: "restaurant", subCategory: "seafood",
      themes: { healing: 1, activity: 2, food: 5, culture: 4, shopping: 3 },
      timeOfDay: ["dinner"], coordinates: [35.0967, 129.0305], zone: "center",
      desc: "국내 최대의 수산시장에서 살아 숨 쉬는 활어회와 매콤하고 쫄깃하게 연탄불에 구운 산꼼장어에 소주 한 잔을 기울입니다."
    },
    {
      id: "busan_res_4", name: "남포동 국제시장 & 깡통시장 먹거리 탐방", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 4, food: 5, culture: 4, shopping: 5 },
      timeOfDay: ["lunch", "evening"], coordinates: [35.1011, 129.0287], zone: "center",
      desc: "비빔당면, 씨앗호떡, 물떡, 유부전골 등 끝없이 이어지는 활기찬 야시장 길거리 음식 포장마차 투어를 즐깁니다."
    },
    {
      id: "busan_res_5", name: "부산역 밀면 맛집", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.1152, 129.0422], zone: "center",
      desc: "밀가루로 만든 쫄깃한 면발에 살얼음 낀 한약재 육수와 매콤달콤한 양념장을 비벼 시원하게 더위를 날립니다."
    },

    // --- CAFES (카페) ---
    {
      id: "busan_caf_1", name: "영도 흰여울문화마을 오션뷰 카페", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 2, food: 3, culture: 4, shopping: 2 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.0782, 129.0438], zone: "south",
      desc: "절벽 위 작고 아기자기한 마을 골목을 걷다, 뻥 뚫린 바다와 묘박지의 큰 배들이 한눈에 보이는 카페에서 커피를 마십니다."
    },
    {
      id: "busan_caf_2", name: "기장 해안도로 대형 루프탑 카페", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 1, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.2345, 129.2451], zone: "east",
      desc: "기장의 끝없이 펼쳐진 맑고 푸른 바다를 바로 앞에서 조망하는 압도적 규모의 카페에서 화려한 베이커리와 휴식을 즐깁니다."
    },
    {
      id: "busan_caf_3", name: "해운대 달맞이길 로스터리 카페", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 3, shopping: 2 },
      timeOfDay: ["tea", "evening"], coordinates: [35.1648, 129.1762], zone: "east",
      desc: "숲과 바다가 어우러진 벚꽃길 드라이브 코스 갤러리 카페에서 갓 구운 디저트와 스페셜티 커피를 맛봅니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "busan_nig_1", name: "더베이 101 야경 & 펍", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 3, culture: 1, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [35.1565, 129.1522], zone: "east",
      desc: "마린시티의 화려한 초고층 아파트 불빛이 바다에 반사되는 이국적인 마천루 야경을 배경으로 시원한 맥주를 즐깁니다."
    },
    {
      id: "busan_nig_2", name: "황령산 봉수대 야경", category: "nightview", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.1558, 129.0825], zone: "center",
      desc: "광안대교, 서면 도심, 영도 앞바다까지 부산 전체가 보석처럼 반짝이는 최고의 360도 파노라마 야경을 드라이브로 감상합니다."
    }
  ]
};
