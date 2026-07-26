export const poiDeepPohang = {
  "포항": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "pohang_att_1", name: "호미곶 해맞이광장 (상생의 손)", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.0792, 129.5694], zone: "east",
      desc: "한반도에서 가장 해가 먼저 뜨는 곳으로, 바다와 육지에 마주 보는 '상생의 손' 조형물 너머로 떠오르는 장엄한 일출을 봅니다."
    },
    {
      id: "pohang_att_2", name: "스페이스워크 (환호공원)", category: "attraction", subCategory: "landmark",
      themes: { healing: 2, activity: 5, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.0645, 129.3892], zone: "center",
      desc: "롤러코스터처럼 구불구불한 거대한 철제 트랙 계단을 걸어 올라가 영일만과 포항 시내의 아찔한 360도 전경을 내려다봅니다."
    },
    {
      id: "pohang_att_3", name: "구룡포 일본인 가옥거리", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 3, food: 2, culture: 5, shopping: 2 },
      timeOfDay: ["afternoon"], coordinates: [35.9898, 129.5620], zone: "south",
      desc: "드라마 '동백꽃 필 무렵'의 무대가 된 곳으로, 계단 포토존에서 사진을 찍고 일제강점기 가옥들이 남은 골목을 걷습니다."
    },
    {
      id: "pohang_att_4", name: "이가리 닻 전망대", category: "attraction", subCategory: "viewpoint",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.2081, 129.3785], zone: "north",
      desc: "푸른 동해 바다 위로 뻗어 나간 붉은색 닻 모양의 해상 목데크 전망대에서 시원한 파도와 기암괴석을 감상합니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "pohang_rel_1", name: "영일대 해수욕장 & 영일교", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 2, food: 3, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [36.0592, 129.3795], zone: "center",
      desc: "고운 백사장을 걷고, 바다 위 웅장한 해상 누각 영일교까지 연결된 다리를 건너며 시원한 밤바다를 만끽합니다."
    },
    {
      id: "pohang_rel_2", name: "내연산 보경사 12폭포", category: "relaxation", subCategory: "mountain",
      themes: { healing: 5, activity: 4, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.2621, 129.2882], zone: "north",
      desc: "고즈넉한 고찰 보경사를 지나 계곡을 따라 오르며 크고 작은 12개의 비경 폭포를 만나는 청량한 트레킹입니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "pohang_act_1", name: "포항 운하 크루즈", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [36.0282, 129.3621], zone: "center",
      desc: "도심 속 물길을 가로지르는 유람선을 타고 형산강과 동해 바다가 만나는 포항 앞바다의 시원한 풍경을 즐깁니다."
    },
    {
      id: "pohang_act_2", name: "영일만 요트 투어", category: "activity", subCategory: "watersports",
      themes: { healing: 5, activity: 4, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [36.0531, 129.3852], zone: "center",
      desc: "낭만적인 요트에 올라 갈매기에게 먹이를 주고 포스코의 웅장한 야경과 붉은 노을을 감상합니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "pohang_res_1", name: "죽도시장 활어회 & 대게 찜", category: "restaurant", subCategory: "seafood",
      themes: { healing: 1, activity: 2, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["lunch", "dinner"], coordinates: [36.0354, 129.3647], zone: "center",
      desc: "동해안 최대 규모의 어시장에서 펄떡이는 신선한 자연산 회와 속이 꽉 찬 대게 찜을 푸짐하게 먹습니다."
    },
    {
      id: "pohang_res_2", name: "환여횟집 (포항 물회)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [36.0642, 129.3811], zone: "center",
      desc: "영일대 해수욕장 앞, 매콤달콤 살얼음 육수에 신선한 가자미 회와 소면, 공깃밥을 말아 먹는 시원한 포항 물회입니다."
    },
    {
      id: "pohang_res_3", name: "구룡포 까꾸네 모리국수", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.9921, 129.5583], zone: "south",
      desc: "아귀, 미역, 다진 마늘과 고춧가루를 듬뿍 넣고 끓여낸 얼큰하고 걸쭉한 구룡포 어부들의 향토 국수입니다."
    },
    {
      id: "pohang_res_4", name: "구룡포 과메기 (겨울철 한정)", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 3 },
      timeOfDay: ["dinner"], coordinates: [35.9892, 129.5624], zone: "south",
      desc: "겨울 바닷바람에 쫀득하게 말린 과메기를 물미역, 마늘, 쪽파와 함께 김에 싸서 초장에 찍어 먹습니다."
    },

    // --- CAFES (카페) ---
    {
      id: "pohang_caf_1", name: "까멜리아 (구룡포 일본인가옥거리 카페)", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 5, shopping: 2 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.9899, 129.5621], zone: "south",
      desc: "동백이가 운영하던 극 중 술집을 레트로한 감성의 카페로 개조해 동백빵과 커피를 마시며 드라마의 여운을 즐깁니다."
    },
    {
      id: "pohang_caf_2", name: "오도리 / 칠포 오션뷰 대형 카페", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [36.1685, 129.3872], zone: "north",
      desc: "포항 북부의 한적하고 투명한 바다가 전면 통유리로 쏟아지는 감각적인 카페에서 스페셜티 커피를 마십니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "pohang_nig_1", name: "포항제철소 야경 (영일대에서 조망)", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 1, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [36.0592, 129.3795], zone: "center",
      desc: "형산강 건너 거대한 포스코 공장 단지의 굴뚝과 건물들이 쏘아 올리는 수만 개의 화려한 LED 불빛 쇼를 감상합니다."
    }
  ]
};
