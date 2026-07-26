export const poiDeepTongyeong = {
  "통영": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "tongyeong_att_1", name: "동피랑 벽화마을", category: "attraction", subCategory: "village",
      themes: { healing: 4, activity: 3, food: 2, culture: 4, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8433, 128.4276], zone: "center",
      desc: "산기슭을 따라 아기자기한 벽화가 그려진 골목을 오르며 통영 강구안 항구의 활기찬 뷰를 감상합니다."
    },
    {
      id: "tongyeong_att_2", name: "이순신 공원", category: "attraction", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8398, 128.4411], zone: "east",
      desc: "한산대첩의 현장이 내려다보이는 해안 절벽 공원에서 산책로를 걷고 웅장한 이순신 장군 동상을 봅니다."
    },
    {
      id: "tongyeong_att_3", name: "통영 케이블카 (미륵산)", category: "attraction", subCategory: "viewpoint",
      themes: { healing: 4, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8213, 128.4111], zone: "south",
      desc: "한려수도의 아름다운 섬들이 점점이 박힌 보석 같은 남해 바다의 절경을 케이블카를 타고 미륵산에 올라 감상합니다."
    },
    {
      id: "tongyeong_att_4", name: "삼도수군통제영 (세병관)", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8458, 128.4223], zone: "center",
      desc: "조선 수군의 본부였던 통제영과 웅장한 국보 목조 건축물인 세병관의 넓은 마루에 앉아 역사를 배웁니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "tongyeong_rel_1", name: "달아공원 일몰", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.7675, 128.3842], zone: "south",
      desc: "미륵도 남단 끝자락 언덕에서 붉게 타오르며 수많은 다도해 섬들 사이로 떨어지는 최고의 일몰을 맞이합니다."
    },
    {
      id: "tongyeong_rel_2", name: "소매물도 & 등대섬 트레킹", category: "relaxation", subCategory: "island",
      themes: { healing: 5, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.6214, 128.5441], zone: "south",
      desc: "여객선을 타고 들어가 썰물 때만 열리는 몽돌 바닷길을 건너 새하얀 등대섬까지 아름다운 트레킹을 합니다."
    },
    {
      id: "tongyeong_rel_3", name: "장사도 해상공원 까멜리아", category: "relaxation", subCategory: "garden",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.6983, 128.5392], zone: "south",
      desc: "겨울부터 봄까지 만개하는 붉은 동백꽃 터널과 한려해상의 푸른 물결이 어우러진 해상 수목원입니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "tongyeong_act_1", name: "스카이라인 루지 통영", category: "activity", subCategory: "theme_park",
      themes: { healing: 1, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.8211, 128.4118], zone: "south",
      desc: "케이블카 탑승장 바로 옆에서 리프트를 타고 올라가 구불구불한 트랙을 직접 카트를 조종해 신나게 질주합니다."
    },
    {
      id: "tongyeong_act_2", name: "한산도 요트 투어 (일몰)", category: "activity", subCategory: "leisure",
      themes: { healing: 5, activity: 4, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.8252, 128.4231], zone: "center",
      desc: "바람을 가르며 나아가는 프라이빗 요트에 누워 샴페인을 마시며 남해의 환상적인 일몰을 럭셔리하게 감상합니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "tongyeong_res_1", name: "통영 다찌집 (해산물 풀코스)", category: "restaurant", subCategory: "seafood",
      themes: { healing: 1, activity: 2, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [34.8415, 128.4251], zone: "center",
      desc: "술을 시키면 철 따라 싱싱한 제철 해산물 안주가 상다리가 휘어지게 끊임없이 나오는 통영 고유의 술집 문화입니다."
    },
    {
      id: "tongyeong_res_2", name: "통영 중앙시장 꿀빵 & 충무김밥", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 2, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [34.8436, 128.4253], zone: "center",
      desc: "강구안 앞 꿀빵 거리에서 쫀득하고 달콤한 팥 꿀빵을 맛보고, 섞박지와 오징어무침을 곁들인 충무김밥으로 배를 채웁니다."
    },
    {
      id: "tongyeong_res_3", name: "서호시장 시락국 (장어뼈 해장국)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 2 },
      timeOfDay: ["morning", "lunch"], coordinates: [34.8395, 128.4206], zone: "center",
      desc: "장어 머리와 뼈를 푹 고아 낸 구수하고 진한 육수에 시래기를 넣고 끓여낸 최고의 아침 해장 국밥입니다."
    },
    {
      id: "tongyeong_res_4", name: "통영 굴 코스요리 전문점", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [34.8451, 128.4262], zone: "center",
      desc: "전국 굴 생산량의 메카답게 신선하고 통통한 굴전, 굴무침, 굴밥, 굴구이까지 굴의 모든 것을 즐깁니다."
    },
    {
      id: "tongyeong_res_5", name: "통영 중앙 전통시장 활어회", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 3, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["dinner"], coordinates: [34.8441, 128.4248], zone: "center",
      desc: "펄떡이는 참돔, 광어, 우럭 등 자연산 활어를 저렴하게 골라 초장집에서 신선한 회 정식을 맛봅니다."
    },

    // --- CAFES (카페) ---
    {
      id: "tongyeong_caf_1", name: "미륵산 인근 오션뷰 대형 카페", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 1, shopping: 2 },
      timeOfDay: ["tea", "afternoon"], coordinates: [34.8142, 128.4190], zone: "south",
      desc: "루지나 케이블카 탑승 후, 바다로 이어지는 마리나 항만의 여유로운 풍경을 보며 달콤한 빵과 커피를 마십니다."
    },
    {
      id: "tongyeong_caf_2", name: "강구안 동피랑 카페거리", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 3, shopping: 3 },
      timeOfDay: ["tea", "evening"], coordinates: [34.8431, 128.4270], zone: "center",
      desc: "동피랑 꼭대기나 골목 어귀에 자리한 작은 테라스 카페에서 알록달록한 항구를 내려다보며 청귤 에이드를 마십니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "tongyeong_nig_1", name: "디피랑 (빛의 정원)", category: "nightview", subCategory: "theme_park",
      themes: { healing: 5, activity: 3, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.8412, 128.4255], zone: "center",
      desc: "남망산 조각공원이 밤이 되면 화려한 미디어아트와 빛의 숲으로 변신하는 몽환적인 야간 산책로를 탐험합니다."
    },
    {
      id: "tongyeong_nig_2", name: "통영대교 야경 드라이브", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.8285, 128.4061], zone: "west",
      desc: "통영 운하를 가로지르는 아치형 다리에 불을 밝힌 푸른 조명이 물결에 반사되는 고요한 밤의 낭만을 느낍니다."
    }
  ]
};
