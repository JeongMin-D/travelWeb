export const poiDeepAndong = {
  "안동": [
    // --- ATTRACTIONS (명소/역사) ---
    {
      id: "andong_att_1", name: "안동 하회마을", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 2, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.5387, 128.5193], zone: "west",
      desc: "낙동강이 S자로 마을을 감싸 안고 흐르는 유네스코 세계유산으로, 고즈넉한 초가집과 기와집 사이를 걷습니다."
    },
    {
      id: "andong_att_2", name: "병산서원", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.5404, 128.5528], zone: "west",
      desc: "만대루에 올라 앞으로 흐르는 낙동강과 깎아지른 병산의 절벽을 마주하며 조선 서원 건축의 백미를 감상합니다."
    },
    {
      id: "andong_att_3", name: "도산서원", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.7266, 128.8471], zone: "north",
      desc: "퇴계 이황의 학문과 덕행을 기리는 서원으로, 고요한 안동호 상류를 바라보며 선비의 기품을 느낍니다."
    },
    {
      id: "andong_att_4", name: "안동시립민속박물관 & 민속촌", category: "attraction", subCategory: "museum",
      themes: { healing: 3, activity: 2, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.5684, 128.7615], zone: "east",
      desc: "안동댐 건설로 수몰된 지역의 고가옥들을 이건해 놓은 야외 박물관에서 옛 선조들의 생활상을 엿봅니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "andong_rel_1", name: "월영교", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [36.5828, 128.7610], zone: "center",
      desc: "안동호 위를 가로지르는 국내에서 가장 긴 목책교로, 호수 한가운데 월영정에 앉아 물안개를 감상합니다."
    },
    {
      id: "andong_rel_2", name: "만휴정", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.4357, 128.8858], zone: "south",
      desc: "드라마 '미스터 션샤인' 촬영지로 유명한 계곡 위 좁은 외나무다리에서 아름다운 자연과 폭포를 배경으로 사진을 찍습니다."
    },
    {
      id: "andong_rel_3", name: "낙강물길공원 (안동 비밀의 숲)", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.5880, 128.7621], zone: "center",
      desc: "안동댐 수력발전소 옆에 조성된 이국적인 연못과 징검다리, 울창한 숲에서 요정의 숲 같은 힐링 피크닉을 즐깁니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "andong_act_1", name: "하회별신굿 탈놀이 관람", category: "activity", subCategory: "culture_exp",
      themes: { healing: 2, activity: 3, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [36.5401, 128.5205], zone: "west",
      desc: "하회마을 전수관에서 신명 나는 풍물 장단에 맞춰 양반을 풍자하는 해학적인 전통 탈놀이 공연을 관람합니다."
    },
    {
      id: "andong_act_2", name: "문보트 (월영교 야간 보트)", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 4, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [36.5825, 128.7615], zone: "center",
      desc: "달 모양의 로맨틱한 문보트를 타고 월영교의 아름다운 야경을 호수 한가운데서 프라이빗하게 감상합니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "andong_res_1", name: "안동구시장 찜닭 골목", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 2 },
      timeOfDay: ["lunch", "dinner"], coordinates: [36.5670, 128.7291], zone: "center",
      desc: "달콤 짭짤한 간장 양념에 닭고기, 당면, 각종 채소를 푸짐하게 졸여낸 안동 원조 찜닭을 배부르게 먹습니다."
    },
    {
      id: "andong_res_2", name: "맘모스베이커리 (크림치즈빵)", category: "restaurant", subCategory: "dessert",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 4 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.5658, 128.7294], zone: "center",
      desc: "전국 3대 빵집 중 하나로 쫀득한 식감과 진한 크림치즈가 어우러진 크림치즈빵과 향긋한 유자 파운드를 맛봅니다."
    },
    {
      id: "andong_res_3", name: "일직식당 (안동 간고등어 구이)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [36.5661, 128.7303], zone: "center",
      desc: "짭조름하게 간이 잘 밴 겉바속촉 안동 간고등어 숯불구이 한 마리로 밥 한 공기를 뚝딱 비웁니다."
    },
    {
      id: "andong_res_4", name: "까치구멍집 (헛제사밥)", category: "restaurant", subCategory: "traditional",
      themes: { healing: 3, activity: 1, food: 4, culture: 5, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [36.5815, 128.7592], zone: "center",
      desc: "제사를 지내지 않고도 제사 음식처럼 나물과 전, 탕국을 차려 비벼 먹는 안동 양반가의 독특한 향토 음식을 경험합니다."
    },

    // --- CAFES (카페) ---
    {
      id: "andong_caf_1", name: "월영당 (한옥 카페 & 대마라떼)", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 4, activity: 1, food: 4, culture: 4, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [36.5822, 128.7618], zone: "center",
      desc: "월영교 옆 고즈넉한 한옥 테라스에 앉아 지붕 위 커다란 보름달 조형물과 함께 안동 특산 대마씨앗 라떼를 마십니다."
    },
    {
      id: "andong_caf_2", name: "풍산읍 한옥 카페 (풍세 커피 등)", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 4, shopping: 1 },
      timeOfDay: ["tea", "morning"], coordinates: [36.5361, 128.5305], zone: "west",
      desc: "하회마을 가는 길목에 위치한 널찍한 잔디밭과 고풍스러운 전통 한옥이 어우러진 카페에서 평온을 찾습니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "andong_nig_1", name: "월영교 야간 산책 & 음악분수", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [36.5828, 128.7610], zone: "center",
      desc: "어두운 안동호 위로 은은한 보랏빛 조명이 켜진 월영교를 걷고 웅장한 낙동강 음악분수 쇼를 관람합니다."
    }
  ]
};
