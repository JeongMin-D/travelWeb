export const poiDeepMokpo = {
  "목포": [
    // --- ATTRACTIONS (명소/역사) ---
    {
      id: "mokpo_att_1", name: "유달산", category: "attraction", subCategory: "mountain",
      themes: { healing: 4, activity: 3, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7865, 126.3770], zone: "center",
      desc: "목포의 상징이자 영혼으로, 기암괴석으로 이루어진 산길을 오르면 목포 시내와 다도해가 한눈에 펼쳐집니다."
    },
    {
      id: "mokpo_att_2", name: "목포 해상케이블카", category: "activity", subCategory: "viewpoint",
      themes: { healing: 4, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.7882, 126.3651], zone: "west",
      desc: "유달산과 다도해를 가로지르는 국내 최장 해상케이블카에 탑승하여 스릴 넘치는 남해의 절경을 감상합니다."
    },
    {
      id: "mokpo_att_3", name: "목포 근대역사관 1관 (호텔 델루나)", category: "attraction", subCategory: "heritage",
      themes: { healing: 3, activity: 1, food: 1, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7854, 126.3812], zone: "center",
      desc: "과거 일본 영사관으로 쓰인 붉은 벽돌 건물로, 드라마 '호텔 델루나'의 외관 촬영지이자 근대 목포의 역사를 담은 곳입니다."
    },
    {
      id: "mokpo_att_4", name: "갓바위", category: "attraction", subCategory: "nature",
      themes: { healing: 4, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [34.7850, 126.4350], zone: "east",
      desc: "삿갓을 쓴 사람 형상을 한 거대한 해식 기암괴석으로, 바다 위에 떠 있는 해상 보행교를 걸으며 가까이서 관찰합니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "mokpo_rel_1", name: "고하도 해상데크 & 전망대", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7675, 126.3710], zone: "south",
      desc: "이순신 장군의 판옥선을 모티브로 한 독특한 전망대에 오르고, 해안 절벽을 따라 끝없이 이어진 데크길을 산책합니다."
    },
    {
      id: "mokpo_rel_2", name: "삼학도 공원", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7891, 126.4011], zone: "center",
      desc: "세 마리의 학이 내려앉았다는 전설을 품은 아담한 섬 공원에서 수로를 따라 핀 꽃들을 보며 평화롭게 걷습니다."
    },
    {
      id: "mokpo_rel_3", name: "평화광장 해안산책로", category: "relaxation", subCategory: "beach",
      themes: { healing: 4, activity: 2, food: 3, culture: 1, shopping: 2 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.7932, 126.4310], zone: "east",
      desc: "넓은 바다를 따라 끝없이 이어진 산책로에서 킥보드나 자전거를 타고 카페와 맛집이 늘어선 거리를 즐깁니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "mokpo_res_1", name: "낙지 탕탕이 (독천식당 등)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [34.7935, 126.3860], zone: "center",
      desc: "목포의 명물인 쫄깃하고 고소한 산낙지와 육회를 잘게 썰어 참기름에 버무린 기력 회복 만점 탕탕이입니다."
    },
    {
      id: "mokpo_res_2", name: "코롬방제과점 (새우바게트)", category: "restaurant", subCategory: "dessert",
      themes: { healing: 1, activity: 1, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7925, 126.3850], zone: "center",
      desc: "70년 전통의 전국 5대 빵집에서 바삭하고 짭조름한 새우바게트와 진한 크림치즈 바게트를 포장합니다."
    },
    {
      id: "mokpo_res_3", name: "영란횟집 (민어회 코스)", category: "restaurant", subCategory: "seafood",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [34.7865, 126.3862], zone: "center",
      desc: "입안에서 사르르 녹는 부드러운 민어회와 고소한 부레, 얼큰한 민어 매운탕까지 푸짐한 한 상을 대접받습니다."
    },
    {
      id: "mokpo_res_4", name: "게살비빔밥 (장터식당)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [34.7871, 126.3890], zone: "center",
      desc: "매콤달콤한 양념에 순살 꽃게살만 완벽하게 발라내어 뜨거운 밥 위에 얹어 참기름과 비벼 먹는 최고의 밥도둑입니다."
    },

    // --- CAFES (카페) ---
    {
      id: "mokpo_caf_1", name: "대반동 201 (대반동 오션뷰 카페)", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [34.7831, 126.3725], zone: "west",
      desc: "목포대교가 눈앞에 아찔하게 펼쳐지는 탁 트인 오션뷰 테라스에서 디저트와 칵테일을 즐기는 핫플레이스입니다."
    },
    {
      id: "mokpo_caf_2", name: "평화광장 오션뷰 카페거리", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 1, shopping: 3 },
      timeOfDay: ["tea", "evening"], coordinates: [34.7928, 126.4315], zone: "east",
      desc: "잔잔한 평화광장 앞바다를 따라 늘어선 세련된 대형 프랜차이즈 및 감성 로컬 카페에서 여유를 만끽합니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "mokpo_nig_1", name: "춤추는 바다분수", category: "nightview", subCategory: "park",
      themes: { healing: 4, activity: 1, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.7935, 126.4350], zone: "east",
      desc: "평화광장 앞바다에서 레이저 조명과 경쾌한 음악에 맞춰 거대한 물줄기가 춤을 추는 환상적인 분수 쇼를 관람합니다."
    },
    {
      id: "mokpo_nig_2", name: "목포대교 일몰 & 야경 (유달유원지)", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 5, activity: 2, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.7845, 126.3712], zone: "west",
      desc: "해 질 녘 유달유원지 백사장에 앉아 붉은 노을 속으로 스며드는 거대한 목포대교의 눈부신 야간 조명을 감상합니다."
    }
  ]
};
