export const poiDeepYeosu = {
  "여수": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "yeosu_att_1", name: "오동도 & 동백열차", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7431, 127.7686], zone: "south",
      desc: "동백열차를 타고 들어가는 작고 아름다운 섬으로, 울창한 동백나무 숲과 기암절벽 해안 산책로를 감상합니다."
    },
    {
      id: "yeosu_att_2", name: "아쿠아플라넷 여수", category: "attraction", subCategory: "theme_park",
      themes: { healing: 3, activity: 3, food: 1, culture: 2, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7451, 127.7470], zone: "center",
      desc: "국내 2위 규모의 대형 수족관에서 희귀 해양 생물인 벨루가와 귀여운 바다거북을 만나고 다채로운 해양 공연을 봅니다."
    },
    {
      id: "yeosu_att_3", name: "여수 해상 케이블카", category: "activity", subCategory: "viewpoint",
      themes: { healing: 4, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.7291, 127.7513], zone: "south",
      desc: "바다 위를 가로지르는 크리스탈 케이블카에 탑승하여 거북선대교와 하멜등대, 그리고 빛나는 여수 앞바다를 내려다봅니다."
    },
    {
      id: "yeosu_att_4", name: "고소동 천사벽화마을", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 3, food: 2, culture: 4, shopping: 2 },
      timeOfDay: ["afternoon"], coordinates: [34.7381, 127.7371], zone: "center",
      desc: "언덕 비탈을 따라 조성된 예쁜 벽화 골목을 굽이굽이 오르며 돌산대교와 여수 앞바다의 시원한 풍경을 조망합니다."
    },

    // --- RELAXATION (휴식) ---
    {
      id: "yeosu_rel_1", name: "향일암 일출", category: "relaxation", subCategory: "heritage",
      themes: { healing: 5, activity: 3, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [34.5937, 127.8005], zone: "south",
      desc: "돌산도 끝자락 깎아지른 절벽 위에 위치한 관음 기도 도량으로, 좁은 바위틈을 지나 맞이하는 장엄한 해돋이가 일품입니다."
    },
    {
      id: "yeosu_rel_2", name: "돌산공원 산책", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.7285, 127.7411], zone: "south",
      desc: "케이블카 탑승장과 연결된 탁 트인 공원에서 돌산대교와 여수 시내를 한눈에 굽어보며 휴식을 취합니다."
    },
    {
      id: "yeosu_rel_3", name: "만성리 검은모래해변", category: "relaxation", subCategory: "beach",
      themes: { healing: 4, activity: 2, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [34.7708, 127.7483], zone: "east",
      desc: "신경통과 피부 미용에 좋다는 독특한 검은 모래로 찜질을 즐기고 한적하고 고요한 파도 소리를 듣습니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "yeosu_act_1", name: "유월드 루지 테마파크", category: "activity", subCategory: "theme_park",
      themes: { healing: 1, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.7303, 127.6534], zone: "west",
      desc: "짜릿하게 산등성이를 질주하는 루지와 공룡 테마파크 어트랙션을 묶어 신나는 액티비티를 즐깁니다."
    },
    {
      id: "yeosu_act_2", name: "여수 예술랜드 (마이다스의 손)", category: "activity", subCategory: "theme_park",
      themes: { healing: 3, activity: 4, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [34.6644, 127.7794], zone: "south",
      desc: "아찔한 절벽 위 거대한 조각상 '마이다스의 손' 위에서 아찔한 인생샷을 찍고 스카이워크 공중그네를 체험합니다."
    },
    {
      id: "yeosu_act_3", name: "여수 앞바다 요트 투어", category: "activity", subCategory: "leisure",
      themes: { healing: 5, activity: 4, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.7438, 127.7121], zone: "center",
      desc: "선상에서 낭만적인 여수 밤바다의 야경과 화려한 조명들을 와인 한 잔과 함께 유유자적 감상합니다."
    },

    // --- RESTAURANTS (식당) ---
    {
      id: "yeosu_res_1", name: "여수 낭만포차 거리 (해물 삼합)", category: "restaurant", subCategory: "street_food",
      themes: { healing: 2, activity: 3, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["dinner", "evening"], coordinates: [34.7383, 127.7351], zone: "center",
      desc: "여수 밤바다를 배경으로 돌문어, 삼겹살, 갓김치를 철판에 볶아 먹는 해물 삼합에 여수 밤바다 소주를 곁들입니다."
    },
    {
      id: "yeosu_res_2", name: "이순신 광장 먹거리 투어 (바게트버거/딸기모찌)", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 3, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [34.7391, 127.7350], zone: "center",
      desc: "거북선이 전시된 광장을 중심으로 바삭한 여수당 바게트버거, 수제 딸기모찌, 갓버터 도나스 등을 줄 서서 포장해 먹습니다."
    },
    {
      id: "yeosu_res_3", name: "게장 백반 거리 (돌게장 무한리필)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 2 },
      timeOfDay: ["lunch"], coordinates: [34.7455, 127.7214], zone: "center",
      desc: "여수 특산품인 돌게로 담근 짭조름한 간장게장과 매콤달콤한 양념게장을 갈치조림과 함께 밥도둑으로 즐깁니다."
    },
    {
      id: "yeosu_res_4", name: "돌산 갓김치 & 장어탕", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["dinner"], coordinates: [34.7311, 127.7551], zone: "south",
      desc: "보양식으로 으뜸인 얼큰하고 걸쭉한 붕장어(아나고)탕에 알싸하고 아삭아삭한 돌산 갓김치를 얹어 먹습니다."
    },
    {
      id: "yeosu_res_5", name: "선어회 (삼치회) 전문점", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [34.7335, 127.7332], zone: "center",
      desc: "여수에서만 제대로 맛볼 수 있는 입안에서 사르르 녹는 두툼한 삼치 선어회를 특제 양념장과 김에 싸서 먹습니다."
    },

    // --- CAFES (카페) ---
    {
      id: "yeosu_caf_1", name: "돌산 오션뷰 대형 루프탑 카페", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 1, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [34.6931, 127.7681], zone: "south",
      desc: "돌산도의 눈부신 에메랄드빛 바다가 파노라마처럼 펼쳐지는 압도적 규모의 인피니티풀 뷰 카페에서 휴식합니다."
    },
    {
      id: "yeosu_caf_2", name: "고소동 천사벽화마을 뷰 카페", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 3, shopping: 1 },
      timeOfDay: ["tea", "evening"], coordinates: [34.7385, 127.7375], zone: "center",
      desc: "아기자기한 벽화 골목 끝에 위치해 거북선 대교와 케이블카가 오가는 낭만적인 바다 풍광을 보며 스페셜티 커피를 마십니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "yeosu_nig_1", name: "돌산대교 야경 조망", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 5, activity: 1, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.7310, 127.7396], zone: "south",
      desc: "돌산공원에 올라 형형색색으로 조명이 바뀌는 거대한 돌산대교와 어선들의 불빛이 어우러진 최고의 야경을 즐깁니다."
    },
    {
      id: "yeosu_nig_2", name: "종포 해양공원 야간 산책", category: "nightview", subCategory: "park",
      themes: { healing: 4, activity: 2, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.7383, 127.7391], zone: "center",
      desc: "버스킹 공연의 선율이 흐르는 해양공원을 걸으며 하멜등대의 붉은 불빛과 여수 밤바다의 정취를 온몸으로 느낍니다."
    }
  ]
};
