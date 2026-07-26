export const poiDeepSeoul = {
  "서울": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "seoul_att_1", name: "경복궁 & 광화문 광장", category: "attraction", subCategory: "palace",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5796, 126.9770], zone: "center",
      desc: "조선 왕조의 으뜸 궁궐을 산책하고 한복 체험 및 전통 성문 교대식을 관람합니다."
    },
    {
      id: "seoul_att_2", name: "창덕궁 & 후원 (비원)", category: "attraction", subCategory: "palace",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5794, 126.9910], zone: "center",
      desc: "유네스코 세계유산으로 자연과 완벽한 조화를 이루는 왕실의 비밀 정원 비원을 해설사와 함께 거닙니다."
    },
    {
      id: "seoul_att_3", name: "북촌 한옥마을", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 2, culture: 5, shopping: 3 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5826, 126.9831], zone: "center",
      desc: "고즈넉한 한옥 골목길을 걸으며 정갈한 한국 전통의 멋과 고풍스러운 도심 정취를 즐깁니다."
    },
    {
      id: "seoul_att_4", name: "국립중앙박물관", category: "attraction", subCategory: "museum",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5240, 126.9804], zone: "south",
      desc: "대한민국의 찬란한 역사 유물과 반가사유상을 관람하고 넓게 펼쳐진 용산가족공원을 걸어봅니다."
    },
    {
      id: "seoul_att_5", name: "동대문 디자인 플라자 (DDP)", category: "attraction", subCategory: "landmark",
      themes: { healing: 2, activity: 3, food: 2, culture: 4, shopping: 4 },
      timeOfDay: ["afternoon", "evening"], coordinates: [37.5668, 127.0096], zone: "center",
      desc: "우주선 모양의 독특한 은빛 건축물 내부에서 다양한 디자인 전시와 글로벌 패션 트렌드를 엿봅니다."
    },
    {
      id: "seoul_att_6", name: "롯데월드타워 서울스카이", category: "attraction", subCategory: "viewpoint",
      themes: { healing: 3, activity: 2, food: 2, culture: 2, shopping: 4 },
      timeOfDay: ["afternoon"], coordinates: [37.5126, 127.1025], zone: "south",
      desc: "대한민국 최고 높이의 전망대에 올라 아찔한 유리 바닥 위에서 서울 전역의 장관을 한눈에 내려다봅니다."
    },

    // --- RELAXATION (휴식/자연/공원) ---
    {
      id: "seoul_rel_1", name: "반포 한강공원 & 무지개분수", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 3, food: 3, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [37.5098, 126.9946], zone: "south",
      desc: "탁 트인 한강변에 돗자리를 펴고 피크닉을 즐기며, 일몰 후 화려하게 춤추는 반포대교 달빛무지개분수를 봅니다."
    },
    {
      id: "seoul_rel_2", name: "서울숲", category: "relaxation", subCategory: "forest",
      themes: { healing: 5, activity: 3, food: 2, culture: 2, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5443, 127.0374], zone: "east",
      desc: "거대한 도심 속 녹색 쉼터에서 사슴 먹이주기 체험을 하고 아름다운 호수와 메타세쿼이아 길을 자전거로 달립니다."
    },
    {
      id: "seoul_rel_3", name: "청계천 산책로", category: "relaxation", subCategory: "river",
      themes: { healing: 5, activity: 2, food: 2, culture: 3, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [37.5691, 126.9787], zone: "center",
      desc: "도심 한복판을 가로지르는 맑은 인공 하천을 따라 청량한 물소리를 들으며 여유로운 밤 산책을 즐깁니다."
    },
    {
      id: "seoul_rel_4", name: "남산공원 & 백범광장", category: "relaxation", subCategory: "park",
      themes: { healing: 4, activity: 3, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5539, 126.9806], zone: "center",
      desc: "성곽길을 따라 남산 둘레길을 오르며 계절마다 피어나는 꽃들과 서울 도심의 상쾌한 전경을 마주합니다."
    },
    {
      id: "seoul_rel_5", name: "올림픽공원 나홀로나무", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5207, 127.1215], zone: "south",
      desc: "끝없이 넓은 잔디광장 한가운데 서 있는 외롭고 아름다운 나홀로나무를 배경으로 인생 사진을 남기고 휴식합니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "seoul_act_1", name: "롯데월드 어드벤처 & 매직아일랜드", category: "activity", subCategory: "theme_park",
      themes: { healing: 1, activity: 5, food: 3, culture: 1, shopping: 3 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.5111, 127.0981], zone: "south",
      desc: "세계 최대 규모의 실내 테마파크와 야외 호수 위의 매직아일랜드에서 짜릿한 어트랙션과 퍼레이드를 즐깁니다."
    },
    {
      id: "seoul_act_2", name: "뚝섬 한강공원 윈드서핑 & 패들보드", category: "activity", subCategory: "watersports",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [37.5312, 127.0671], zone: "east",
      desc: "도심 속 한강 물살을 시원하게 가르며 패들보드, 카약, 윈드서핑 등 다이내믹한 수상 레포츠를 체험합니다."
    },
    {
      id: "seoul_act_3", name: "익선동 개화기 의상 & 한복 체험", category: "activity", subCategory: "culture_exp",
      themes: { healing: 3, activity: 4, food: 2, culture: 5, shopping: 3 },
      timeOfDay: ["afternoon"], coordinates: [37.5744, 126.9897], zone: "center",
      desc: "미로 같은 비좁은 한옥 골목에서 레트로한 개화기 의상이나 화려한 한복을 빌려 입고 타임머신을 탄 듯 산책합니다."
    },
    {
      id: "seoul_act_4", name: "강남 방탈출 카페 & 실내 레포츠", category: "activity", subCategory: "leisure",
      themes: { healing: 1, activity: 5, food: 1, culture: 1, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [37.4980, 127.0276], zone: "south",
      desc: "최첨단 장치가 도입된 대형 프리미엄 방탈출 테마를 풀거나, 실내 클라이밍 센터에서 에너지를 발산합니다."
    },

    // --- RESTAURANTS (식당) ---
    {
      id: "seoul_res_1", name: "토속촌 전통 삼계탕", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 4, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [37.5778, 126.9717], zone: "center",
      desc: "진하고 구수한 진국 육수에 영계와 인삼, 잣 등 견과류가 듬뿍 들어간 건강한 보양식 삼계탕 정식입니다."
    },
    {
      id: "seoul_res_2", name: "명동교자 본점", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.5625, 126.9856], zone: "center",
      desc: "진한 닭육수 베이스의 칼국수와 육즙 가득한 얇은 피 만두, 알싸한 마늘 겉절이 김치가 일품인 미쉐린 맛집입니다."
    },
    {
      id: "seoul_res_3", name: "마장동 우시장 숯불 한우 구이", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [37.5697, 127.0436], zone: "east",
      desc: "국내 최대의 축산물 시장에서 눈꽃 같은 마블링의 최고급 최상급 한우를 골라 숯불에 구워 먹는 특식입니다."
    },
    {
      id: "seoul_res_4", name: "광장시장 빈대떡 & 육회", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 3, food: 5, culture: 4, shopping: 2 },
      timeOfDay: ["lunch", "evening"], coordinates: [37.5701, 126.9996], zone: "center",
      desc: "시끌벅적한 전통 시장 통로에 앉아 지글지글 부쳐내는 바삭한 녹두빈대떡과 신선한 육회, 마약김밥을 즐깁니다."
    },
    {
      id: "seoul_res_5", name: "성수동 감자탕 골목", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.5441, 127.0542], zone: "east",
      desc: "커다란 뚝배기 위로 산더미처럼 쌓아 올린 야들야들한 돼지 등뼈와 얼큰하고 진한 국물로 배를 든든하게 채웁니다."
    },
    {
      id: "seoul_res_6", name: "신당동 떡볶이 타운", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 2, food: 5, culture: 3, shopping: 2 },
      timeOfDay: ["lunch", "dinner"], coordinates: [37.5658, 127.0142], zone: "center",
      desc: "오랜 역사를 가진 떡볶이 거리에서 춘장과 고추장이 섞인 중독성 있는 즉석 떡볶이를 푸짐한 사리와 끓여 먹습니다."
    },
    {
      id: "seoul_res_7", name: "이태원 세계음식거리", category: "restaurant", subCategory: "trendy",
      themes: { healing: 1, activity: 3, food: 5, culture: 4, shopping: 4 },
      timeOfDay: ["dinner"], coordinates: [37.5348, 126.9933], zone: "center",
      desc: "이국적인 향신료가 가득한 골목에서 정통 할랄 푸드, 텍사스 바비큐, 멕시칸 타코 등 다양한 글로벌 미식을 탐험합니다."
    },

    // --- CAFES (카페/디저트) ---
    {
      id: "seoul_caf_1", name: "어니언 안국 한옥 카페", category: "cafe", subCategory: "bakery_cafe",
      themes: { healing: 5, activity: 1, food: 4, culture: 5, shopping: 2 },
      timeOfDay: ["tea", "morning"], coordinates: [37.5772, 126.9863], zone: "center",
      desc: "세월의 흔적이 묻어나는 한옥 리노베이션 공간 대청마루에 앉아 달콤한 팡도르와 시그니처 드립 커피를 즐깁니다."
    },
    {
      id: "seoul_caf_2", name: "성수 대림창고 갤러리 코아", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 3, activity: 2, food: 4, culture: 4, shopping: 4 },
      timeOfDay: ["tea", "afternoon"], coordinates: [37.5407, 127.0560], zone: "east",
      desc: "거대한 폐공장을 개조한 빈티지하고 웅장한 공간에서 감각적인 예술 작품 전시를 보며 커피를 홀짝입니다."
    },
    {
      id: "seoul_caf_3", name: "청수당 익선동 한옥 카페", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 5, activity: 1, food: 5, culture: 4, shopping: 2 },
      timeOfDay: ["tea"], coordinates: [37.5746, 126.9882], zone: "center",
      desc: "도심 속 작은 숲처럼 꾸며진 대나무 정원과 연못 징검다리를 건너 들어가 부드러운 수플레 카스텔라를 맛봅니다."
    },
    {
      id: "seoul_caf_4", name: "북악스카이웨이 산모퉁이 카페", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 1, food: 3, culture: 3, shopping: 1 },
      timeOfDay: ["tea", "evening"], coordinates: [37.5959, 126.9745], zone: "north",
      desc: "드라마 '커피프린스 1호점' 촬영지로 유명한 산 중턱 카페에서 맑은 공기와 함께 성곽길 전경을 내려다봅니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "seoul_nig_1", name: "남산서울타워 야경 전망대", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 2, culture: 3, shopping: 2 },
      timeOfDay: ["evening"], coordinates: [37.5512, 126.9882], zone: "center",
      desc: "서울 도심 한복판 높이 솟은 타워 전망대에 올라 360도로 펼쳐지는 반짝이는 서울 시티 파노라마 야경을 관람합니다."
    },
    {
      id: "seoul_nig_2", name: "낙산공원 성곽길 야경", category: "nightview", subCategory: "heritage",
      themes: { healing: 5, activity: 3, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [37.5804, 127.0076], zone: "center",
      desc: "은은한 조명이 켜진 고풍스러운 성곽길을 따라 언덕을 오르며 대학로와 도심의 낭만적인 밤풍경을 즐깁니다."
    },
    {
      id: "seoul_nig_3", name: "응봉산 팔각정 일몰 및 야경", category: "nightview", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [37.5457, 127.0315], zone: "east",
      desc: "가벼운 산행 후 만나는 팔각정에서 붉게 물드는 노을과 자동차 불빛이 그리는 화려한 강변북로 야경을 내려다봅니다."
    }
  ]
};
