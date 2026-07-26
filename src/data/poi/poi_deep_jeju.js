export const poiDeepJeju = {
  "제주도": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "jeju_att_1", name: "성산일출봉", category: "attraction", subCategory: "nature",
      themes: { healing: 4, activity: 5, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [33.4581, 126.9426], zone: "east",
      desc: "제주의 상징적인 화산 분화구로, 정상에서 웅장한 일출과 에메랄드빛 바다 절경을 감상할 수 있습니다."
    },
    {
      id: "jeju_att_2", name: "만장굴", category: "attraction", subCategory: "nature",
      themes: { healing: 3, activity: 4, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.5284, 126.7716], zone: "east",
      desc: "세계 최장 길이의 용암 동굴 중 하나로, 한여름에도 서늘하고 웅장한 지하 세계를 탐험합니다."
    },
    {
      id: "jeju_att_3", name: "천지연폭포", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [33.2450, 126.5540], zone: "south",
      desc: "울창한 상록수림 사이로 시원하게 쏟아지는 폭포수를 감상하며 평화로운 산책을 즐깁니다."
    },
    {
      id: "jeju_att_4", name: "주상절리대", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.2376, 126.4249], zone: "south",
      desc: "뜨거운 용암이 바다와 만나 굳어지며 형성된 거대한 육각형 돌기둥의 신비로운 해안 절경을 조망합니다."
    },
    {
      id: "jeju_att_5", name: "용머리해안 & 산방산", category: "attraction", subCategory: "nature",
      themes: { healing: 4, activity: 4, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [33.2314, 126.3146], zone: "west",
      desc: "바닷속으로 들어가는 용의 머리를 닮은 기암괴석 해안을 걷고 거대한 종 모양의 산방산을 올려다봅니다."
    },
    {
      id: "jeju_att_6", name: "제주 해녀박물관", category: "attraction", subCategory: "museum",
      themes: { healing: 3, activity: 1, food: 1, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.5235, 126.8624], zone: "east",
      desc: "유네스코 인류무형문화유산인 제주 해녀들의 강인한 삶과 역사를 생생하게 배우고 느낍니다."
    },

    // --- RELAXATION (휴식/자연/해변) ---
    {
      id: "jeju_rel_1", name: "사려니숲길", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 3, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.4285, 126.6341], zone: "center",
      desc: "수십 미터 높이로 뻗은 빽빽한 삼나무 숲길을 거닐며 피톤치드 가득한 완벽한 산림욕을 경험합니다."
    },
    {
      id: "jeju_rel_2", name: "협재 해수욕장 & 비양도", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [33.3938, 126.2397], zone: "west",
      desc: "투명하고 맑은 에메랄드빛 바다와 하얀 모래사장, 그리고 손에 잡힐 듯 가까운 비양도의 풍광을 만끽합니다."
    },
    {
      id: "jeju_rel_3", name: "함덕 해수욕장 & 서우봉", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 3, culture: 1, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.5434, 126.6687], zone: "east",
      desc: "야자수가 늘어선 이국적인 해변에서 수영을 즐기고 해질녘 서우봉에 올라 노을을 감상합니다."
    },
    {
      id: "jeju_rel_4", name: "비자림", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.4831, 126.8114], zone: "east",
      desc: "수백 년 된 신비로운 비자나무 수천 그루가 자생하는 원시림을 맨발로 걸으며 자연과 하나가 됩니다."
    },
    {
      id: "jeju_rel_5", name: "카멜리아 힐", category: "relaxation", subCategory: "garden",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.2872, 126.3533], zone: "west",
      desc: "수만 그루의 동백나무와 수국이 계절마다 웅장하게 피어나는 동양 최대 규모의 수목원에서 예쁜 사진을 남깁니다."
    },
    {
      id: "jeju_rel_6", name: "새별오름 일몰 산책", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [33.3664, 126.3563], zone: "west",
      desc: "가을이면 은빛 억새가 장관을 이루는 오름 정상에 올라 황금빛으로 물드는 황홀한 일몰을 조망합니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "jeju_act_1", name: "우도 전기자전거 일주", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 5, food: 3, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.5042, 126.9534], zone: "east",
      desc: "성산항에서 배를 타고 들어가 에메랄드빛 해안 도로를 따라 전기자전거를 타고 섬 전체를 유쾌하게 돌아봅니다."
    },
    {
      id: "jeju_act_2", name: "아쿠아플라넷 제주", category: "activity", subCategory: "theme_park",
      themes: { healing: 3, activity: 4, food: 2, culture: 1, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.4328, 126.9276], zone: "east",
      desc: "아시아 최대 규모의 메인 수조에서 대형 가오리와 상어 등 수만 마리의 해양 생물을 관람하는 환상적인 수족관."
    },
    {
      id: "jeju_act_3", name: "9.81파크 (무동력 레이싱)", category: "activity", subCategory: "leisure",
      themes: { healing: 1, activity: 5, food: 2, culture: 1, shopping: 2 },
      timeOfDay: ["afternoon"], coordinates: [33.3853, 126.3686], zone: "west",
      desc: "중력만을 이용해 언덕을 미끄러져 내려오는 친환경 스마트 레이싱을 즐기며 짜릿한 스피드를 경험합니다."
    },
    {
      id: "jeju_act_4", name: "스누피가든", category: "activity", subCategory: "theme_park",
      themes: { healing: 5, activity: 3, food: 2, culture: 2, shopping: 4 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.4357, 126.7785], zone: "east",
      desc: "피너츠 캐릭터들이 자연 속에 어우러진 넓은 야외 정원을 산책하며 귀여운 동심의 세계로 빠져듭니다."
    },
    {
      id: "jeju_act_5", name: "중문 서핑 강습", category: "activity", subCategory: "watersports",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [33.2447, 126.4124], zone: "south",
      desc: "파도가 아름답고 파워풀한 중문 색달해변에서 초보자도 쉽게 배울 수 있는 짜릿한 서핑 강습을 받습니다."
    },

    // --- RESTAURANTS (식당) ---
    {
      id: "jeju_res_1", name: "제주 흑돼지 참숯불구이", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [33.2541, 126.4172], zone: "south",
      desc: "두툼하게 썬 제주산 흑돼지 근고기를 참숯에 구워 고소하고 짭조름한 멜젓에 찍어 먹는 든든한 특식입니다."
    },
    {
      id: "jeju_res_2", name: "자매국수 (제주 고기국수)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "morning"], coordinates: [33.5113, 126.5255], zone: "north",
      desc: "진하게 우려낸 돼지 사골 육수에 부드러운 돔베고기(수육)가 듬뿍 올라간 제주의 소울푸드 고기국수입니다."
    },
    {
      id: "jeju_res_3", name: "애월 통갈치조림 & 구이 전문점", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [33.4652, 126.3201], zone: "west",
      desc: "신선한 전복과 돌문어가 통째로 들어간 매콤한 제주 은갈치 조림과 겉바속촉 갈치구이 한 상입니다."
    },
    {
      id: "jeju_res_4", name: "우진해장국 (고사리 육개장)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 4, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "lunch"], coordinates: [33.5116, 126.5200], zone: "north",
      desc: "제주산 고사리를 푹 끓여 걸쭉하고 구수한 국물을 내는, 어디서도 맛볼 수 없는 독특한 제주식 해장국입니다."
    },
    {
      id: "jeju_res_5", name: "성산 해녀의 집 (전복죽 & 해산물)", category: "restaurant", subCategory: "seafood",
      themes: { healing: 3, activity: 2, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [33.4613, 126.9324], zone: "east",
      desc: "해녀들이 직접 물질해 잡아 올린 싱싱한 뿔소라, 해삼, 멍게와 내장을 듬뿍 넣어 끓인 진한 전복죽을 맛봅니다."
    },
    {
      id: "jeju_res_6", name: "서귀포 올레시장 먹거리 탐방", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 4, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["dinner", "evening"], coordinates: [33.2494, 126.5627], zone: "south",
      desc: "오메기떡, 마늘통닭, 흑돼지 꼬치구이, 꽁치김밥 등 활기찬 시장에서 다채로운 길거리 미식을 배부르게 즐깁니다."
    },

    // --- CAFES (카페/디저트) ---
    {
      id: "jeju_caf_1", name: "오설록 티 뮤지엄 & 이니스프리 제주 하우스", category: "cafe", subCategory: "tea_house",
      themes: { healing: 5, activity: 2, food: 4, culture: 3, shopping: 4 },
      timeOfDay: ["tea", "morning"], coordinates: [33.3059, 126.2895], zone: "west",
      desc: "드넓게 펼쳐진 푸른 녹차밭을 산책하고, 최고급 말차 아이스크림 롤케이크와 함께 비누 만들기 체험을 즐깁니다."
    },
    {
      id: "jeju_caf_2", name: "애월 카페거리 (몽상드애월, 노티드)", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 2, shopping: 3 },
      timeOfDay: ["tea", "afternoon"], coordinates: [33.4623, 126.3126], zone: "west",
      desc: "투명한 에메랄드빛 한담해안산책로를 끼고 늘어선 힙하고 개성 넘치는 오션뷰 카페들에서 디저트를 즐깁니다."
    },
    {
      id: "jeju_caf_3", name: "우도 땅콩 아이스크림 디저트", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [33.5074, 126.9542], zone: "east",
      desc: "하고수동 해수욕장의 하얀 백사장을 바라보며 우도 특산물인 고소한 땅콩이 듬뿍 올라간 시원한 아이스크림을 맛봅니다."
    },
    {
      id: "jeju_caf_4", name: "테라로사 서귀포점", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 1, shopping: 2 },
      timeOfDay: ["morning", "tea"], coordinates: [33.2678, 126.6023], zone: "south",
      desc: "울창한 감귤밭 한가운데 넓은 통유리창을 통해 쏟아지는 햇살을 맞으며 갓 로스팅한 드립 커피를 마십니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "jeju_nig_1", name: "새연교 & 새섬 야경 산책", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [33.2384, 126.5594], zone: "south",
      desc: "서귀포항과 새섬을 연결하는 전통 테우 모양의 다리에 화려한 조명이 켜지면 밤바다의 낭만적인 풍광이 펼쳐집니다."
    },
    {
      id: "jeju_nig_2", name: "용두암 해안도로 야간 드라이브", category: "nightview", subCategory: "nature",
      themes: { healing: 4, activity: 3, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [33.5165, 126.5122], zone: "north",
      desc: "용이 포효하는 형상의 기암괴석을 감상하고, 고기잡이 배들의 어화(漁火)가 불을 밝히는 밤바다를 따라 드라이브합니다."
    }
  ]
};
