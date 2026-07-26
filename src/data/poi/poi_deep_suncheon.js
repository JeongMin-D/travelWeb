export const poiDeepSuncheon = {
  "순천": [
    // --- ATTRACTIONS (명소/자연) ---
    {
      id: "suncheon_att_1", name: "순천만 국가정원", category: "attraction", subCategory: "garden",
      themes: { healing: 5, activity: 3, food: 2, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9281, 127.5098], zone: "center",
      desc: "대한민국 제1호 국가정원으로, 전 세계 각국의 특색 있는 세계 정원과 화려한 꽃망울을 여유롭게 감상합니다."
    },
    {
      id: "suncheon_att_2", name: "순천만 습지 (갈대밭)", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [34.8872, 127.4981], zone: "south",
      desc: "끝없이 펼쳐진 황금빛 갈대밭 데크길을 걷고 용산전망대에 올라 S자형 수로 위로 지는 환상적인 일몰을 봅니다."
    },
    {
      id: "suncheon_att_3", name: "낙안읍성 민속마을", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 3, food: 3, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9080, 127.3401], zone: "west",
      desc: "조선 시대 흙담과 초가집이 그대로 보존되어 실제 주민들이 살아가는 정겨운 마을에서 과거로 시간 여행을 떠납니다."
    },
    {
      id: "suncheon_att_4", name: "선암사", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9961, 127.3275], zone: "west",
      desc: "조계산 자락의 평화롭고 고풍스러운 산사로, 무지개 모양의 승선교와 겹벚꽃, 맑은 계곡물이 어우러진 비경을 간직하고 있습니다."
    },
    {
      id: "suncheon_att_5", name: "송광사", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9958, 127.2831], zone: "west",
      desc: "우리나라 삼보사찰 중 승보사찰로, 아름다운 계곡 위의 우화각을 지나 고승들의 맑은 정신이 깃든 도량을 거닙니다."
    },

    // --- RELAXATION (휴식) ---
    {
      id: "suncheon_rel_1", name: "순천 드라마 촬영장", category: "relaxation", subCategory: "village",
      themes: { healing: 3, activity: 4, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9575, 127.5350], zone: "east",
      desc: "60~80년대 서울 달동네와 순천 읍내를 재현한 오픈 세트장에서 교복을 빌려 입고 추억 사진을 찍습니다."
    },
    {
      id: "suncheon_rel_2", name: "와온해변 일몰 산책", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [34.8251, 127.5270], zone: "south",
      desc: "끝없는 갯벌 위로 떨어지는 붉은 해와 솔섬의 실루엣이 연출하는 한 폭의 그림 같은 노을 풍경을 조망합니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "suncheon_act_1", name: "스카이큐브 탑승", category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 3, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9281, 127.5020], zone: "center",
      desc: "국가정원에서 순천만 습지까지 무인 궤도열차 스카이큐브를 타고 공중에서 동천 갈대밭의 풍경을 시원하게 감상합니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "suncheon_res_1", name: "순천만 꼬막정식", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [34.8912, 127.5005], zone: "south",
      desc: "순천만 근처 식당가에서 삶은 꼬막, 꼬막무침, 꼬막전, 꼬막 탕수육 등 한 상 가득 나오는 남도의 맛을 즐깁니다."
    },
    {
      id: "suncheon_res_2", name: "건봉국밥 (아랫장 돼지국밥)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "lunch"], coordinates: [34.9452, 127.4935], zone: "center",
      desc: "순천 아랫장 시장에서 맑고 깔끔한 국물에 머릿고기와 순대가 푸짐하게 들어간 국밥으로 든든히 배를 채웁니다."
    },
    {
      id: "suncheon_res_3", name: "대원식당 (남도 한정식)", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [34.9535, 127.4872], zone: "center",
      desc: "상다리가 부러지게 차려지는 수십 가지의 정갈한 남도 밑반찬과 불고기, 홍어삼합 한정식을 제대로 대접받습니다."
    },
    {
      id: "suncheon_res_4", name: "짱뚱어탕 (대대선창집 등)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [34.8920, 127.4981], zone: "south",
      desc: "순천만 갯벌에서 나는 짱뚱어를 곱게 갈아 우거지와 함께 얼큰하고 진하게 끓여낸 최고의 보양식입니다."
    },

    // --- CAFES (카페) ---
    {
      id: "suncheon_caf_1", name: "조곡동 철도문화마을 기적소리 카페", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 3, culture: 3, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [34.9492, 127.5041], zone: "center",
      desc: "일제강점기 철도 관사 마을의 레트로한 분위기를 살린 좁은 골목길과 카페에서 옛 감성에 젖어 듭니다."
    },
    {
      id: "suncheon_caf_2", name: "순천 브루웍스 (창고형 카페)", category: "cafe", subCategory: "bakery_cafe",
      themes: { healing: 3, activity: 2, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "evening"], coordinates: [34.9442, 127.4965], zone: "center",
      desc: "순천역 인근, 거대한 곡물 창고를 빈티지하게 리모델링한 압도적인 층고의 힙한 카페에서 수제 맥주와 커피를 마십니다."
    }
  ]
};
