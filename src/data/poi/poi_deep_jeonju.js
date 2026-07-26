export const poiDeepJeonju = {
  "전주": [
    // --- ATTRACTIONS (명소/역사) ---
    {
      id: "jeonju_att_1", name: "전주 한옥마을", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 3, culture: 5, shopping: 3 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8147, 127.1526], zone: "center",
      desc: "700여 채의 전통 한옥이 군락을 이룬 도심 속 고즈넉한 마을을 한복을 입고 여유롭게 산책합니다."
    },
    {
      id: "jeonju_att_2", name: "경기전 & 어진박물관", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8152, 127.1495], zone: "center",
      desc: "태조 이성계의 어진을 모신 신성한 공간에서 대나무 숲을 배경으로 아름다운 스냅 사진을 남깁니다."
    },
    {
      id: "jeonju_att_3", name: "전동성당", category: "attraction", subCategory: "heritage",
      themes: { healing: 4, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8133, 127.1493], zone: "center",
      desc: "로마네스크 양식의 이국적이고 웅장한 붉은 벽돌 성당 건물을 감상하며 순교의 역사를 되새깁니다."
    },
    {
      id: "jeonju_att_4", name: "오목대 & 이목대", category: "attraction", subCategory: "viewpoint",
      themes: { healing: 5, activity: 2, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [35.8140, 127.1558], zone: "center",
      desc: "가벼운 언덕길을 올라 수많은 한옥 지붕들이 기와 물결을 이루는 전주 한옥마을의 아름다운 전경을 내려다봅니다."
    },
    {
      id: "jeonju_att_5", name: "전주 향교", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 1, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8115, 127.1560], zone: "center",
      desc: "수백 년 된 거대한 은행나무들이 지키고 있는 옛 성균관의 고즈넉하고 평화로운 분위기를 만끽합니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "jeonju_rel_1", name: "자만 벽화마을", category: "relaxation", subCategory: "village",
      themes: { healing: 4, activity: 3, food: 2, culture: 4, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8135, 127.1578], zone: "center",
      desc: "오목대 다리 건너 달동네 골목골목을 수놓은 알록달록한 애니메이션 벽화와 예쁜 카페들을 구경합니다."
    },
    {
      id: "jeonju_rel_2", name: "덕진공원 연꽃 군락", category: "relaxation", subCategory: "park",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8475, 127.1215], zone: "north",
      desc: "거대한 호수를 가득 메운 연꽃의 향연을 구경하고, 호수 한가운데 위치한 전통 건축물 연화정 도서관을 방문합니다."
    },
    {
      id: "jeonju_rel_3", name: "한국도로공사 전주수목원", category: "relaxation", subCategory: "garden",
      themes: { healing: 5, activity: 2, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8722, 127.0655], zone: "west",
      desc: "다양한 식물들이 아름답게 조경된 수목원을 거닐며 유리온실과 수생식물원의 이국적인 풍경을 감상합니다."
    },
    {
      id: "jeonju_rel_4", name: "팔복예술공장", category: "relaxation", subCategory: "trendy",
      themes: { healing: 3, activity: 2, food: 2, culture: 5, shopping: 2 },
      timeOfDay: ["afternoon"], coordinates: [35.8451, 127.1082], zone: "north",
      desc: "버려진 카세트테이프 공장을 개조해 만든 트렌디한 복합문화공간에서 힙한 전시물과 설치 미술을 봅니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "jeonju_act_1", name: "한옥마을 한복 대여 & 스냅 촬영", category: "activity", subCategory: "culture_exp",
      themes: { healing: 2, activity: 4, food: 1, culture: 5, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [35.8150, 127.1520], zone: "center",
      desc: "화려한 테마 한복이나 경성시대 의상을 대여하여 한옥 골목과 경기전을 배경으로 인생샷을 남깁니다."
    },
    {
      id: "jeonju_act_2", name: "전주 한옥 레일바이크", category: "activity", subCategory: "leisure",
      themes: { healing: 3, activity: 5, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [35.8080, 127.1645], zone: "east",
      desc: "아중역 폐철길을 활용한 레일바이크를 페달링하며 시원한 바람과 다채로운 빛 터널의 재미를 느낍니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "jeonju_res_1", name: "전주 전통 비빔밥 (가족회관/한국집)", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 1, food: 5, culture: 5, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [35.8182, 127.1472], zone: "center",
      desc: "놋그릇에 30여 가지의 다채로운 나물과 육회가 오색찬란하게 담긴 전주의 자랑, 유네스코 창의 음식 비빔밥입니다."
    },
    {
      id: "jeonju_res_2", name: "남부시장 현대옥 콩나물국밥", category: "restaurant", subCategory: "local_food",
      themes: { healing: 4, activity: 1, food: 5, culture: 3, shopping: 2 },
      timeOfDay: ["morning", "lunch"], coordinates: [35.8123, 127.1470], zone: "center",
      desc: "맑고 개운한 국물에 송송 썬 오징어를 올리고 수란에 김을 부숴 먹는 최고의 해장 음식 콩나물국밥입니다."
    },
    {
      id: "jeonju_res_3", name: "베테랑 칼국수 본점", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch"], coordinates: [35.8130, 127.1528], zone: "center",
      desc: "계란을 푼 진한 국물에 들깨가루와 고춧가루, 김가루가 듬뿍 올라간 독특하고 고소한 전주식 칼국수입니다."
    },
    {
      id: "jeonju_res_4", name: "삼천동 막걸리 골목", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 2, activity: 2, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["dinner", "evening"], coordinates: [35.8041, 127.1195], zone: "south",
      desc: "맑은 막걸리 한 주전자를 시킬 때마다 상다리가 부러질 듯 푸짐한 안주가 끊임없이 나오는 전주만의 미식 문화입니다."
    },
    {
      id: "jeonju_res_5", name: "남부시장 조점례 남문피순대", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 2 },
      timeOfDay: ["lunch", "dinner"], coordinates: [35.8118, 127.1473], zone: "center",
      desc: "돼지 선지와 채소로 꽉 채워 촉촉하고 녹진한 피순대와 얼큰한 순대국밥을 초장에 찍어 먹습니다."
    },
    {
      id: "jeonju_res_6", name: "길거리야 바게트버거 & 먹거리 투어", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 3, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [35.8135, 127.1510], zone: "center",
      desc: "바삭한 바게트 속에 고기와 야채가 매콤달콤하게 채워진 바게트버거, 다우랑 만두, 십원빵 등을 길거리에서 즐깁니다."
    },

    // --- CAFES (카페/디저트) ---
    {
      id: "jeonju_caf_1", name: "외할머니솜씨 (흑임자 팥빙수)", category: "cafe", subCategory: "dessert_cafe",
      themes: { healing: 3, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.8122, 127.1555], zone: "center",
      desc: "직접 쑨 달지 않은 팥과 고소한 흑임자, 쫄깃한 떡이 어우러진 옛날식 팥빙수로 더위를 식힙니다."
    },
    {
      id: "jeonju_caf_2", name: "PNB 풍년제과 본점 (초코파이)", category: "cafe", subCategory: "bakery",
      themes: { healing: 2, activity: 1, food: 4, culture: 3, shopping: 5 },
      timeOfDay: ["tea", "afternoon"], coordinates: [35.8166, 127.1455], zone: "center",
      desc: "달콤한 초콜릿 코팅 속에 딸기잼과 호두 크림이 샌드된 전주의 수제 초코파이를 여행 선물로 포장합니다."
    },
    {
      id: "jeonju_caf_3", name: "객리단길 감성 카페 & 디저트", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 3, shopping: 4 },
      timeOfDay: ["tea", "evening"], coordinates: [35.8188, 127.1425], zone: "center",
      desc: "과거 구도심이었던 객사 길에 들어선 트렌디하고 감각적인 인테리어의 카페들을 탐방합니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "jeonju_nig_1", name: "남부시장 한옥마을 야시장", category: "nightview", subCategory: "street_food",
      themes: { healing: 2, activity: 4, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["evening"], coordinates: [35.8120, 127.1468], zone: "center",
      desc: "금/토요일 밤에 열리는 야시장에서 불곱창, 육전 등 퓨전 글로벌 먹거리를 즐기며 왁자지껄한 밤을 보냅니다."
    },
    {
      id: "jeonju_nig_2", name: "청연루 (남천교) 야경 산책", category: "nightview", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [35.8085, 127.1528], zone: "center",
      desc: "전주천 위를 가로지르는 남천교 위에 세워진 팔작지붕 누각 청연루의 단아한 야간 조명을 감상합니다."
    }
  ]
};
