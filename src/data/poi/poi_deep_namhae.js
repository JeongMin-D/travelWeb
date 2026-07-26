export const poiDeepNamhae = {
  "남해": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "namhae_att_1", name: "다랭이마을", category: "attraction", subCategory: "village",
      themes: { healing: 5, activity: 2, food: 3, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7265, 127.8931], zone: "south",
      desc: "해안가 깎아지른 비탈에 일군 100여 층의 계단식 논밭이 남해 바다와 어우러진 그림 같은 마을을 산책합니다."
    },
    {
      id: "namhae_att_2", name: "독일마을", category: "attraction", subCategory: "village",
      themes: { healing: 4, activity: 2, food: 4, culture: 4, shopping: 3 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.7925, 128.0411], zone: "east",
      desc: "주황색 지붕의 이국적인 독일식 주택들이 바다를 내려다보는 마을에서 독일 맥주와 소시지, 파독 광부의 역사를 만납니다."
    },
    {
      id: "namhae_att_3", name: "금산 보리암", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 3, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7505, 127.9818], zone: "south",
      desc: "기암괴석으로 둘러싸인 남해 금산 정상의 암자에서 상주은모래비치와 남해의 절경을 한눈에 내려다봅니다."
    },
    {
      id: "namhae_att_4", name: "원예예술촌", category: "attraction", subCategory: "garden",
      themes: { healing: 4, activity: 2, food: 2, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7942, 128.0381], zone: "east",
      desc: "독일마을 바로 옆에 위치한 아름다운 꽃과 테마별 세계 정원, 개성 있는 집들이 모인 원예 공원입니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "namhae_rel_1", name: "상주은모래비치", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [34.7135, 127.9861], zone: "south",
      desc: "은가루를 뿌린 듯 부드럽고 새하얀 백사장과 울창한 송림이 어우러진 남해 최고의 피서지에서 힐링합니다."
    },
    {
      id: "namhae_rel_2", name: "남해 양떼목장 (양모리학교)", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8621, 127.8765], zone: "north",
      desc: "편백나무 숲과 바다가 보이는 넓은 초원에서 양 떼에게 먹이를 주며 뉴질랜드 같은 평화로움을 느낍니다."
    },
    {
      id: "namhae_rel_3", name: "남해 편백자연휴양림", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7725, 128.0284], zone: "east",
      desc: "빽빽하게 들어선 수만 그루의 편백나무 숲에서 쏟아지는 피톤치드를 온몸으로 맞으며 치유의 산책을 합니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "namhae_act_1", name: "설리스카이워크", category: "activity", subCategory: "viewpoint",
      themes: { healing: 4, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [34.7175, 128.0335], zone: "south",
      desc: "바다 쪽으로 길게 뻗은 아찔한 유리 바닥 스카이워크를 걷고 바다를 향해 날아가는 '스카이 스윙' 그네를 탑니다."
    },
    {
      id: "namhae_act_2", name: "문항어촌체험마을 (갯벌체험)", category: "activity", subCategory: "leisure",
      themes: { healing: 2, activity: 5, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8512, 127.9252], zone: "north",
      desc: "썰물 때 드러나는 넓은 갯벌에서 바지락과 쏙을 직접 캐보는 즐거운 어촌 생태 체험을 합니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "namhae_res_1", name: "멸치쌈밥 & 멸치회무침", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [34.8212, 128.0461], zone: "east",
      desc: "은빛 남해 생멸치를 뼈째 졸여 상추에 싸 먹고, 새콤달콤하게 무쳐낸 멸치회무침으로 입맛을 돋웁니다."
    },
    {
      id: "namhae_res_2", name: "다랭이마을 해물파전과 유자 막걸리", category: "restaurant", subCategory: "street_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [34.7262, 127.8935], zone: "south",
      desc: "계단식 논과 바다가 보이는 평상에 앉아 갓 부쳐낸 해물파전과 향긋한 남해 유자 막걸리를 즐깁니다."
    },
    {
      id: "namhae_res_3", name: "독일마을 수제 소시지와 맥주 (슈바인학센)", category: "restaurant", subCategory: "trendy",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["dinner", "evening"], coordinates: [34.7928, 128.0415], zone: "east",
      desc: "정통 독일식 족발 요리인 겉바속촉 슈바인학센과 육즙 가득한 소시지에 시원한 독일 생맥주를 곁들입니다."
    },
    {
      id: "namhae_res_4", name: "남해 마늘 한우 구이", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [34.8321, 127.8951], zone: "north",
      desc: "남해 특산물인 달콤한 해풍 마늘을 먹여 키운 최고급 한우를 숯불에 구워 입안 가득 퍼지는 육즙을 음미합니다."
    },

    // --- CAFES (카페) ---
    {
      id: "namhae_caf_1", name: "독일마을 쿤스트라운지", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 3, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [34.7915, 128.0421], zone: "east",
      desc: "독일마을의 이국적인 전경과 탁 트인 바다 뷰를 편안한 빈백에 기대어 맥주나 커피를 마시며 즐깁니다."
    },
    {
      id: "namhae_caf_2", name: "남해 앵강다방", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 3, shopping: 2 },
      timeOfDay: ["tea", "morning"], coordinates: [34.7612, 127.9315], zone: "center",
      desc: "앵강만 해안가의 고즈넉하고 일본식 정취가 묻어나는 다방에서 정갈한 다과와 말차 라떼, 유자차를 마십니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "namhae_nig_1", name: "남해대교 & 노량대교 야경", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.9451, 127.8721], zone: "north",
      desc: "하동과 남해를 잇는 붉은 현수교 남해대교에 화려한 조명이 켜진 밤바다 풍경을 드라이브하며 감상합니다."
    }
  ]
};
