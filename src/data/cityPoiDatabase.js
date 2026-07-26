// Extended Categorized & Theme-Scored POI Database
// Category types: 'attraction', 'restaurant', 'cafe', 'activity', 'relaxation', 'nightview'
// Themes scores (1-5): healing, activity, food, culture, shopping

export const CITY_POI_DATABASE = {
  "서울": [
    {
      id: "seoul_att_1", name: "경복궁 & 광화문 광장", category: "attraction", subCategory: "palace",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5796, 126.9770], zone: "center",
      desc: "조선 왕조의 으뜸 궁궐을 산책하고 한복 체험 및 전통 성문 교대식을 관람합니다."
    },
    {
      id: "seoul_att_2", name: "북촌 한옥마을 & 삼청동", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 2, culture: 5, shopping: 3 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5826, 126.9831], zone: "center",
      desc: "고즈넉한 한옥 골목길을 걸으며 정갈한 한국 전통의 멋과 고풍스러운 정취를 즐깁니다."
    },
    {
      id: "seoul_att_3", name: "국립중앙박물관 & 용산가족공원", category: "attraction", subCategory: "museum",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5240, 126.9804], zone: "south",
      desc: "대한민국의 찬란한 역사 유물과 반가사유상을 관람하고 평화로운 공원을 걸어봅니다."
    },
    {
      id: "seoul_att_4", name: "성수동 연무장길 & 팝업스토어", category: "attraction", subCategory: "trendy",
      themes: { healing: 2, activity: 4, food: 3, culture: 2, shopping: 5 },
      timeOfDay: ["afternoon"], coordinates: [37.5445, 127.0560], zone: "east",
      desc: "트렌디한 브랜드 팝업스토어, 감성 복합문화공간 및 디자인 소품샵을 둘러봅니다."
    },
    {
      id: "seoul_att_5", name: "남산서울타워 야경 전망대", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 3, food: 2, culture: 3, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [37.5512, 126.9882], zone: "center",
      desc: "서울 도심 한복판 높이 솟은 타워 전망대에서 반짝이는 서울 시티 파노라마 야경을 관람합니다."
    },
    {
      id: "seoul_att_6", name: "한강공원 여의도 피크닉", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 3, food: 3, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [37.5284, 126.9331], zone: "west",
      desc: "탁 트인 한강변에서 자전거를 타거나 돗자리를 펴고 시원한 강바람과 힐링 피크닉을 즐깁니다."
    },
    {
      id: "seoul_res_1", name: "토속촌 전통 삼계탕", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 4, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [37.5778, 126.9717], zone: "center",
      desc: "진하고 구수한 진국 육수에 영계와 인삼, 견과류가 들어간 건강한 보양 삼계탕 정식."
    },
    {
      id: "seoul_res_2", name: "명동교자 본점", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 2, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.5625, 126.9856], zone: "center",
      desc: "진한 닭육수 칼국수와 만두, 알싸한 마늘 겉절이 김치가 일품인 미쉐린 가이드 맛집."
    },
    {
      id: "seoul_res_3", name: "마장동 우시장 숯불 한우 구이", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 3, activity: 2, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [37.5697, 127.0436], zone: "east",
      desc: "마블링 가득한 최고급 최상급 숯불 한우 구이로 즐기는 풍미 넘치는 저녁 특식."
    },
    {
      id: "seoul_cafe_1", name: "어니언 안국 한옥 카페", category: "cafe", subCategory: "bakery_cafe",
      themes: { healing: 5, activity: 2, food: 4, culture: 5, shopping: 2 },
      timeOfDay: ["tea"], coordinates: [37.5772, 126.9863], zone: "center",
      desc: "한옥 리노베이션 공간에서 고소한 팡도르 빵과 시그니처 드립 커피를 즐기는 감성 찻집."
    },
    {
      id: "seoul_cafe_2", name: "누데이크 성수 아방가르드 카페", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 2, activity: 3, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["tea"], coordinates: [37.5441, 127.0542], zone: "east",
      desc: "예술 작품 같은 아이코닉 말차 피크 크로와상 케이크와 독창적인 시그니처 디저트 음료."
    },
    {
      id: "seoul_act_1", name: "한강 뚝섬 윈드서핑 & 패들보드", category: "activity", subCategory: "watersports",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.5312, 127.0671], zone: "east",
      desc: "시원한 한강 물살을 가르며 액티브한 수상 레포츠와 패들보딩을 체험합니다."
    }
  ],

  "제주도": [
    {
      id: "jeju_att_1", name: "성산일출봉 화산구", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 4, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [33.4581, 126.9426], zone: "east",
      desc: "유네스코 세계자연유산인 거대 화산구 정상에 올라 탁 트인 푸른 바다 절경을 감상합니다."
    },
    {
      id: "jeju_att_2", name: "사려니숲길 삼나무 코스", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 2, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [33.4285, 126.6341], zone: "center",
      desc: "울창한 삼나무 숲길을 걸으며 피톤치드를 쐬고 온전한 자연 치유 삼림욕을 즐깁니다."
    },
    {
      id: "jeju_att_3", name: "협재 해수욕장 & 비양도", category: "attraction", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [33.3938, 126.2397], zone: "west",
      desc: "에메랄드빛 에메랄드 투명한 바다와 하얀 몽돌 모래사장을 산책하며 힐링합니다."
    },
    {
      id: "jeju_res_1", name: "중문 흑돼지 연탄구이", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 2, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [33.2541, 126.4172], zone: "south",
      desc: "두툼한 제주 흑돼지 오겹살과 멜젓의 고소한 풍미가 일품인 저녁 특식 만찬."
    },
    {
      id: "jeju_res_2", name: "애월 해물라면 & 전복 통갈치조림", category: "restaurant", subCategory: "seafood",
      themes: { healing: 3, activity: 2, food: 5, culture: 1, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [33.4652, 126.3201], zone: "west",
      desc: "문어, 전복, 꽃게가 푸짐하게 들어간 시원한 해물 라면과 매콤 통갈치조림 점심."
    },
    {
      id: "jeju_cafe_1", name: "오설록 티뮤지엄 녹차밭", category: "cafe", subCategory: "tea_house",
      themes: { healing: 5, activity: 1, food: 4, culture: 3, shopping: 2 },
      timeOfDay: ["tea"], coordinates: [33.3059, 126.2895], zone: "west",
      desc: "초록빛 차밭 전망과 함께 즐기는 최고급 오설록 녹차 아이스크림과 롤케이크."
    },
    {
      id: "jeju_act_1", name: "윈드 1947 카트 레이싱", category: "activity", subCategory: "leisure",
      themes: { healing: 1, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [33.2841, 126.5812], zone: "south",
      desc: "한라산 배경의 아시아 최장 트랙에서 펼쳐지는 스릴 만점 속도감의 카트 체험."
    }
  ],

  "교토": [
    {
      id: "kyoto_att_1", name: "금각사 (킨카쿠지)", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [35.0394, 135.7292], zone: "north",
      desc: "연못 위에 찬란하게 반짝이는 금박 선종 사찰 정원과 조경을 감상합니다."
    },
    {
      id: "kyoto_att_2", name: "청수사 (기요미즈데라)", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 2, culture: 5, shopping: 3 },
      timeOfDay: ["morning", "afternoon"], coordinates: [34.9949, 135.7850], zone: "east",
      desc: "절벽 위 웅장한 목조 본당에서 교토 시내 전경과 사계절 절경을 감상합니다."
    },
    {
      id: "kyoto_att_3", name: "후시미이나리 대사 (붉은 도리이)", category: "attraction", subCategory: "shrine",
      themes: { healing: 4, activity: 3, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning"], coordinates: [34.9671, 135.7727], zone: "south",
      desc: "주홍빛 붉은 도리이 천 개가 숲길을 따라 늘어선 몽환적인 신사 산책로 탐방."
    },
    {
      id: "kyoto_att_4", name: "아라시야마 치쿠린 (대나무 숲)", category: "relaxation", subCategory: "bamboo_forest",
      themes: { healing: 5, activity: 2, food: 2, culture: 4, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.0170, 135.6713], zone: "west",
      desc: "바람에 사각거리는 우뚝 솟은 대나무 숲길과 도게츠교 다리의 고요한 풍경."
    },
    {
      id: "kyoto_res_1", name: "정통 교토 가이세키 코스 요리", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 4, activity: 1, food: 5, culture: 5, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [35.0037, 135.7772], zone: "center",
      desc: "계절 채소와 정갈한 조리법으로 차려내는 장인의 교토식 전통 코스 요리."
    },
    {
      id: "kyoto_res_2", name: "아라시야마 담백한 유두부(유도후) 정식", category: "restaurant", subCategory: "traditional",
      themes: { healing: 5, activity: 1, food: 4, culture: 4, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.0135, 135.6775], zone: "west",
      desc: "부드럽고 고소한 수제 맑은 두부 냄비와 정갈한 일본식 점심 정식."
    },
    {
      id: "kyoto_cafe_1", name: "아라비카 교토 아라시야마 (% 커피)", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea"], coordinates: [35.0128, 135.6778], zone: "west",
      desc: "카모강 다리와 계곡이 내다보이는 리버뷰에서 맛보는 로스터리 드립 커피."
    },
    {
      id: "kyoto_act_1", name: "기온 기모노 전통 의상 렌탈 탐방", category: "activity", subCategory: "culture_exp",
      themes: { healing: 2, activity: 4, food: 1, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.0037, 135.7750], zone: "east",
      desc: "화려한 전통 기모노를 입고 보존 거리와 사원을 배경으로 스냅 촬영."
    }
  ]
};

// Fallback Helper: Generates theme-scored POIs dynamically for any missing city
export const getCityPOIs = (cityName, countryName) => {
  if (CITY_POI_DATABASE[cityName]) {
    return CITY_POI_DATABASE[cityName];
  }

  // Base coordinates fallback
  const baseLat = 35.0 + ((cityName.charCodeAt(0) % 20) * 0.1);
  const baseLng = 135.0 + (((cityName.charCodeAt(1) || 65) % 20) * 0.1);

  return [
    {
      id: `${cityName}_poi_1`, name: `${cityName} 시그니처 전통 수목원 & 공원`, category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [baseLat + 0.01, baseLng + 0.01], zone: "north",
      desc: `${cityName}의 자연 식생과 고즈넉한 수목이 조화롭게 정원화된 힐링 도보 숲길.`
    },
    {
      id: `${cityName}_poi_2`, name: `${cityName} 역사 문화 유적지 / 대성당`, category: "attraction", subCategory: "heritage",
      themes: { healing: 3, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [baseLat - 0.01, baseLng - 0.01], zone: "center",
      desc: `오랜 세월 보존된 전통 문화유산과 웅장한 건축 양식을 관람하는 도보 산책.`
    },
    {
      id: `${cityName}_poi_3`, name: `${cityName} 트렌디한 아트 갤러리 & 감성 거리`, category: "attraction", subCategory: "trendy",
      themes: { healing: 3, activity: 3, food: 2, culture: 4, shopping: 4 },
      timeOfDay: ["afternoon"], coordinates: [baseLat + 0.02, baseLng - 0.01], zone: "east",
      desc: `로컬 아티스트 공방과 분위기 있는 독립 서점, 소품 상점가 탐방.`
    },
    {
      id: `${cityName}_poi_4`, name: `${cityName} 스카이라인 시티 야경 전망대`, category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 2, culture: 2, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [baseLat - 0.02, baseLng + 0.02], zone: "south",
      desc: `${cityName} 도심 마천루 전경과 아름다운 노을 및 화려한 조명 쇼 관람.`
    },
    {
      id: `${cityName}_poi_5`, name: `${cityName} 정통 로컬 시그니처 런치`, category: "restaurant", subCategory: "gourmet",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [baseLat + 0.005, baseLng], zone: "center",
      desc: `${countryName} 특산 신선한 재료로 정갈하게 차려내는 고소하고 구수한 대표 점심.`
    },
    {
      id: `${cityName}_poi_6`, name: `${cityName} 전통 시장 / 숯불 저녁 만찬`, category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 3, food: 5, culture: 4, shopping: 3 },
      timeOfDay: ["dinner"], coordinates: [baseLat, baseLng - 0.015], zone: "east",
      desc: `활기찬 현지 야시장 먹거리 또는 정성스럽게 조리한 저녁 코스 디너.`
    },
    {
      id: `${cityName}_poi_7`, name: `${cityName} 전망 좋은 감성 로스팅 카페`, category: "cafe", subCategory: "bakery_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 2, shopping: 2 },
      timeOfDay: ["tea"], coordinates: [baseLat - 0.005, baseLng + 0.005], zone: "west",
      desc: `탁 트인 정경을 조망하며 시원한 드립 커피와 수제 특산 베이커리 음미.`
    },
    {
      id: `${cityName}_poi_8`, name: `${cityName} 이색 야외 액티비티 & 온천/스파`, category: "activity", subCategory: "leisure",
      themes: { healing: 4, activity: 5, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [baseLat + 0.015, baseLng + 0.02], zone: "south",
      desc: `${cityName} 자연 지형을 활용한 스릴 레저 또는 피로를 푸는 따뜻한 스파 체험.`
    }
  ];
};
