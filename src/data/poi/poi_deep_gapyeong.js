export const poiDeepGapyeong = {
  "가평": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "gapyeong_att_1", name: "아침고요수목원", category: "attraction", subCategory: "garden",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7431, 127.3521], zone: "west",
      desc: "축령산 자락에 안긴 한국의 미를 살린 수목원으로, 사계절 내내 피어나는 수천 종의 꽃과 고즈넉한 정원 길을 걷습니다."
    },
    {
      id: "gapyeong_att_2", name: "쁘띠프랑스 & 이탈리아마을", category: "attraction", subCategory: "theme_park",
      themes: { healing: 4, activity: 3, food: 2, culture: 4, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7145, 127.4872], zone: "center",
      desc: "청평호가 내려다보이는 언덕 위의 작고 예쁜 프랑스 마을과 피노키오 테마의 이탈리아 마을에서 동화 속 주인공이 됩니다."
    },
    {
      id: "gapyeong_att_3", name: "에델바이스 스위스 테마파크", category: "attraction", subCategory: "theme_park",
      themes: { healing: 4, activity: 3, food: 2, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.6621, 127.4523], zone: "south",
      desc: "스위스의 작은 마을을 그대로 옮겨 놓은 듯한 스위스풍 건물들과 언덕을 배경으로 곰 인형 탈을 쓰고 사진을 찍습니다."
    },
    {
      id: "gapyeong_att_4", name: "자라섬", category: "attraction", subCategory: "park",
      themes: { healing: 5, activity: 3, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.8182, 127.5305], zone: "east",
      desc: "재즈 페스티벌로 유명한 남도 꽃 정원에서 아름다운 계절 꽃들과 수변 생태 탐방로를 따라 상쾌한 피크닉을 즐깁니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "gapyeong_rel_1", name: "호명호수", category: "relaxation", subCategory: "lake",
      themes: { healing: 5, activity: 4, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7285, 127.4261], zone: "center",
      desc: "호명산 해발 500m 고지에 위치한 아름다운 인공 호수로, 산 정상까지 버스를 타고 올라 호반을 도는 자전거를 탑니다."
    },
    {
      id: "gapyeong_rel_2", name: "청평호반 드라이브 코스", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.7214, 127.4582], zone: "south",
      desc: "호수 양쪽으로 솟은 산맥과 짙푸른 호수가 만들어내는 절경을 따라 차를 몰며 상쾌한 호반 드라이브를 즐깁니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "gapyeong_act_1", name: "청평호 수상레저 (가평 빠지)", category: "activity", subCategory: "watersports",
      themes: { healing: 2, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.7241, 127.4615], zone: "south",
      desc: "여름철 가평의 필수 코스! 웨이크보드, 바나나보트, 초대형 워터파크 등 청평호에서 신나게 물놀이를 즐깁니다."
    },
    {
      id: "gapyeong_act_2", name: "가평 레일파크 (레일바이크)", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.8281, 127.5142], zone: "east",
      desc: "구 가평역에서 출발해 높은 북한강 철교 위를 직접 페달을 밟아 건너며 아찔하고 시원한 강바람을 맞습니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "gapyeong_res_1", name: "가평 숯불 닭갈비 골목", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.7441, 127.3510], zone: "west",
      desc: "아침고요수목원 진입로에 즐비한 맛집에서 치즈가 듬뿍 올라간 매콤한 철판 닭갈비나 은은한 숯불 닭갈비를 뜯습니다."
    },
    {
      id: "gapyeong_res_2", name: "언덕마루 (가평 잣두부 전골)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 2 },
      timeOfDay: ["lunch"], coordinates: [37.7405, 127.3551], zone: "west",
      desc: "가평 특산물인 고소한 잣을 통째로 콕콕 박아 직접 만든 수제 잣두부와 얼큰한 버섯 전골로 속을 든든히 채웁니다."
    },
    {
      id: "gapyeong_res_3", name: "잣 막국수 & 수육 정식", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.8242, 127.5098], zone: "east",
      desc: "메밀면에 잣가루를 듬뿍 뿌려 고소함이 폭발하는 막국수와 촉촉하게 삶아낸 돼지 수육을 곁들여 먹습니다."
    },

    // --- CAFES (카페) ---
    {
      id: "gapyeong_caf_1", name: "청평호반 리버뷰 카페 (골든트리 등)", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [37.7225, 127.4652], zone: "south",
      desc: "아름다운 건축미를 뽐내는 갤러리 같은 대형 카페에서 통유리창 너머 북한강 절경을 보며 시그니처 잣 라떼를 마십니다."
    },
    {
      id: "gapyeong_caf_2", name: "니피울 / 숲속 감성 카페", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "morning"], coordinates: [37.7512, 127.3821], zone: "west",
      desc: "울창한 숲속이나 조용한 계곡가에 위치한 한적한 프라이빗 카페 정원에서 베이커리와 함께 온전한 힐링을 합니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "gapyeong_nig_1", name: "아침고요수목원 오색별빛정원전", category: "nightview", subCategory: "garden",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [37.7431, 127.3521], zone: "west",
      desc: "겨울 한정! 일몰 후 수목원 전체가 수백만 개의 다채로운 LED 전구로 빛나는 환상적이고 로맨틱한 빛의 축제입니다."
    },
    {
      id: "gapyeong_nig_2", name: "자라섬 남도 빛의 정원 야간 산책", category: "nightview", subCategory: "park",
      themes: { healing: 4, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [37.8185, 127.5310], zone: "east",
      desc: "꽃 축제 기간 동안 야간에도 문을 여는 자라섬 남도에서 호수 위를 비추는 조명과 꽃들의 실루엣을 따라 산책합니다."
    }
  ]
};
