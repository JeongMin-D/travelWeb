export const poiDeepDamyang = {
  "담양": [
    // --- ATTRACTIONS (자연/명소) ---
    {
      id: "damyang_att_1", name: "죽녹원", category: "attraction", subCategory: "forest",
      themes: { healing: 5, activity: 3, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.3283, 126.9852], zone: "center",
      desc: "하늘을 찌를 듯 솟아오른 새파란 대나무들이 끝없이 펼쳐진 숲길을 걸으며 시원한 대잎 소리와 피톤치드에 취합니다."
    },
    {
      id: "damyang_att_2", name: "메타세쿼이아 가로수길", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 2, culture: 1, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.3265, 127.0094], zone: "east",
      desc: "수십 미터 높이의 이국적인 메타세쿼이아 나무들이 길게 늘어선 터널을 걷거나 자전거를 타며 인생 사진을 남깁니다."
    },
    {
      id: "damyang_att_3", name: "소쇄원", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.2131, 127.0022], zone: "south",
      desc: "조선 최고의 민간 정원으로, 계곡의 맑은 물과 대나무, 아름다운 정자가 완벽한 조화를 이루는 선비의 휴식처입니다."
    },
    {
      id: "damyang_att_4", name: "관방제림", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [35.3225, 126.9921], zone: "center",
      desc: "영산강 상류 천변을 따라 수백 년 된 아름드리 거목들이 긴 띠를 이루며 시원한 그늘을 만들어주는 산책로입니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "damyang_rel_1", name: "담양호 국민관광지 & 추월산", category: "relaxation", subCategory: "lake",
      themes: { healing: 5, activity: 4, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.3942, 127.0071], zone: "north",
      desc: "잔잔한 담양호수 위를 가로지르는 용마루길 나무 데크를 산책하고 가을 단풍이 붉게 타오르는 추월산을 조망합니다."
    },
    {
      id: "damyang_rel_2", name: "명옥헌 원림", category: "relaxation", subCategory: "garden",
      themes: { healing: 5, activity: 2, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.2530, 127.0251], zone: "south",
      desc: "여름철 연못 주변을 온통 붉게 물들이는 수백 그루의 배롱나무꽃(백일홍)이 장관을 이루는 숨겨진 전통 정원입니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "damyang_act_1", name: "대나무 자전거 / 관방제림 자전거 대여", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [35.3211, 126.9912], zone: "center",
      desc: "관방제림 주변에서 2인용 자전거나 이색적인 대나무 자전거를 빌려 천변을 따라 시원한 라이딩을 즐깁니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "damyang_res_1", name: "담양 떡갈비 정식 (신식당 / 남도예담)", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [35.3185, 126.9856], zone: "center",
      desc: "잘게 다진 한우에 숯불 향을 입혀 구워낸 육즙 가득한 떡갈비를 죽순 나물과 함께 남도의 진수성찬으로 즐깁니다."
    },
    {
      id: "damyang_res_2", name: "대통밥 & 죽순 요리", category: "restaurant", subCategory: "local_food",
      themes: { healing: 4, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.3272, 126.9881], zone: "center",
      desc: "대나무 향이 은은하게 밴 찰진 대통밥과 아삭아삭한 죽순회무침, 죽순 전으로 담양의 건강한 맛을 섭취합니다."
    },
    {
      id: "damyang_res_3", name: "담양 국수거리 (진우네집국수 등)", category: "restaurant", subCategory: "street_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [35.3204, 126.9875], zone: "center",
      desc: "관방제림 나무 그늘 아래 평상에 앉아 뜨끈한 멸치 국물 국수와 새콤달콤 비빔국수, 약계란을 저렴하게 호루룩 먹습니다."
    },

    // --- CAFES (카페/마을) ---
    {
      id: "damyang_caf_1", name: "메타프로방스 카페 & 거리", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 3, activity: 3, food: 4, culture: 3, shopping: 4 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.3255, 127.0123], zone: "east",
      desc: "메타세쿼이아 길 옆 프랑스 남부 마을을 옮겨 놓은 듯한 이국적인 골목에서 맛있는 도넛과 마카롱, 커피를 즐깁니다."
    },
    {
      id: "damyang_caf_2", name: "서플라이 (창고 리모델링 카페)", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 1, food: 4, culture: 2, shopping: 2 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.3188, 126.9922], zone: "center",
      desc: "낡은 농협 창고를 개조하여 높은 층고와 인더스트리얼 감성을 살린 힙한 카페에서 더치커피를 마십니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "damyang_nig_1", name: "관방제림 야간 달빛 산책", category: "nightview", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.3225, 126.9921], zone: "center",
      desc: "밤이 되면 수백 년 된 거목을 비추는 은은한 조명과 강물에 비친 불빛을 감상하며 조용히 달빛 산책을 즐깁니다."
    },
    {
      id: "damyang_nig_2", name: "메타프로방스 야경", category: "nightview", subCategory: "village",
      themes: { healing: 3, activity: 2, food: 3, culture: 3, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [35.3255, 127.0123], zone: "east",
      desc: "알록달록한 유럽풍 건물들에 로맨틱한 불빛이 들어오면 더욱 이국적이고 활기찬 밤거리를 거닙니다."
    }
  ]
};
