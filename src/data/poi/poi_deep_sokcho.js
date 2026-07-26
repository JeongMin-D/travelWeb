export const poiDeepSokcho = {
  "속초": [
    // --- ATTRACTIONS (명소) ---
    {
      id: "sokcho_att_1", name: "설악산 케이블카 & 권금성", category: "attraction", subCategory: "mountain",
      themes: { healing: 4, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [38.1741, 128.4851], zone: "west",
      desc: "케이블카를 타고 단숨에 설악산 권금성 정상에 올라 기암괴석과 동해 바다를 아우르는 절경을 감상합니다."
    },
    {
      id: "sokcho_att_2", name: "신흥사 & 통일대불", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 2, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [38.1729, 128.4877], zone: "west",
      desc: "설악산 국립공원 초입에 위치한 천년 고찰로, 거대한 청동 불상인 통일대불 앞에서 평화를 기원합니다."
    },
    {
      id: "sokcho_att_3", name: "영금정 & 속초등대전망대", category: "attraction", subCategory: "nature",
      themes: { healing: 4, activity: 2, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [38.2132, 128.6015], zone: "east",
      desc: "거문고 소리가 난다는 바위 정자 영금정에서 시원한 파도를 맞고, 하얀 등대에 올라 속초 시내를 조망합니다."
    },
    {
      id: "sokcho_att_4", name: "아바이마을 & 갯배 체험", category: "attraction", subCategory: "heritage",
      themes: { healing: 3, activity: 4, food: 5, culture: 4, shopping: 2 },
      timeOfDay: ["morning", "afternoon"], coordinates: [38.2014, 128.5956], zone: "center",
      desc: "함경도 실향민들이 모여 사는 작은 섬마을로, 사람이 직접 줄을 당겨 건너는 이색적인 갯배를 타봅니다."
    },

    // --- RELAXATION (자연/휴식/온천) ---
    {
      id: "sokcho_rel_1", name: "속초 해수욕장 & 속초아이", category: "relaxation", subCategory: "beach",
      themes: { healing: 5, activity: 3, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [38.1901, 128.6026], zone: "east",
      desc: "접근성이 뛰어난 속초 대표 해수욕장에서 바다를 보고 랜드마크인 대관람차 '속초아이'를 탑니다."
    },
    {
      id: "sokcho_rel_2", name: "영랑호수공원", category: "relaxation", subCategory: "lake",
      themes: { healing: 5, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [38.2173, 128.5815], zone: "north",
      desc: "웅장한 설악산을 병풍처럼 두른 거대한 석호 주변을 자전거나 전동 카트로 여유롭게 한 바퀴 돕니다."
    },
    {
      id: "sokcho_rel_3", name: "청초호 호수공원", category: "relaxation", subCategory: "park",
      themes: { healing: 4, activity: 2, food: 2, culture: 2, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [38.1970, 128.5833], zone: "center",
      desc: "바다와 이어진 도심 속 아름다운 청초호를 따라 잘 정비된 데크길을 걷고 철새들을 관찰합니다."
    },
    {
      id: "sokcho_rel_4", name: "척산온천 휴양촌", category: "relaxation", subCategory: "spa",
      themes: { healing: 5, activity: 1, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [38.1983, 128.5372], zone: "west",
      desc: "설악산 산행이나 여행으로 쌓인 피로를 매끄러운 알칼리성 천연 온천수로 말끔하게 씻어냅니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "sokcho_act_1", name: "설악 워터피아", category: "activity", subCategory: "theme_park",
      themes: { healing: 4, activity: 5, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [38.2081, 128.5273], zone: "west",
      desc: "천연 온천수로 채워진 대형 워터파크에서 짜릿한 파도풀과 슬라이드를 즐기며 스파도 겸합니다."
    },
    {
      id: "sokcho_act_2", name: "다이나믹 메이즈 & 얼라이브 하트", category: "activity", subCategory: "theme_park",
      themes: { healing: 1, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [38.1975, 128.5412], zone: "west",
      desc: "실내에서 미션을 풀며 미로를 탈출하는 익사이팅 체험과 착시 미술 사진을 찍으며 신나게 놉니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "sokcho_res_1", name: "청초수물회 / 봉포머구리집", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [38.1942, 128.5910], zone: "east",
      desc: "살얼음이 동동 띄워진 새콤달콤하고 시원한 육수에 해삼, 전복, 회가 푸짐하게 올라간 물회를 맛봅니다."
    },
    {
      id: "sokcho_res_2", name: "중앙시장 닭강정 (만석/중앙)", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 2, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [38.2045, 128.5904], zone: "center",
      desc: "식어도 바삭하고 매콤달콤한 속초의 명물 닭강정을 여행 선물로 박스째 구입하고 간식으로 먹습니다."
    },
    {
      id: "sokcho_res_3", name: "아바이마을 오징어순대 & 아바이순대", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 4, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [38.2018, 128.5958], zone: "center",
      desc: "계란물을 입혀 노릇하게 부친 통통한 오징어순대와 함경도식 돼지창자 아바이순대로 든든한 식사를 합니다."
    },
    {
      id: "sokcho_res_4", name: "동명항 / 대포항 활어회 센터", category: "restaurant", subCategory: "seafood",
      themes: { healing: 2, activity: 2, food: 5, culture: 3, shopping: 3 },
      timeOfDay: ["dinner"], coordinates: [38.1746, 128.6074], zone: "south",
      desc: "항구의 활기찬 분위기 속에서 펄떡이는 싱싱한 동해안 자연산 활어회와 바삭한 대포항 새우튀김을 먹습니다."
    },
    {
      id: "sokcho_res_5", name: "88생선구이", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [38.2025, 128.5921], zone: "center",
      desc: "숯불 위에 꽁치, 고등어, 오징어 등 여러 종류의 생선을 얹어 구워 먹는 짭조름한 생선구이 모둠 정식입니다."
    },

    // --- CAFES (카페/디저트) ---
    {
      id: "sokcho_caf_1", name: "칠성조선소 (호수뷰 카페)", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 2, food: 4, culture: 4, shopping: 3 },
      timeOfDay: ["tea", "afternoon"], coordinates: [38.1963, 128.5878], zone: "center",
      desc: "오래된 배를 만들던 옛 조선소를 리모델링하여 레트로한 감성과 넓은 청초호 뷰를 자랑하는 핫플레이스."
    },
    {
      id: "sokcho_caf_2", name: "바다정원 대형 오션뷰 베이커리", category: "cafe", subCategory: "bakery_cafe",
      themes: { healing: 5, activity: 2, food: 4, culture: 1, shopping: 2 },
      timeOfDay: ["tea", "morning"], coordinates: [38.2392, 128.5583], zone: "north",
      desc: "속초-고성 경계에 위치해 솔밭과 백사장이 펼쳐진 압도적 규모의 카페에서 카라멜 마끼아또와 빵을 즐깁니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "sokcho_nig_1", name: "엑스포타워 야경 조망", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 1, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [38.1932, 128.5830], zone: "center",
      desc: "청초호 변에 우뚝 솟은 나선형 모양의 엑스포타워 전망대에서 속초 시내와 설악산, 동해바다의 360도 야경을 봅니다."
    },
    {
      id: "sokcho_nig_2", name: "영금정 해돋이정자 야경 조명", category: "nightview", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [38.2135, 128.6018], zone: "east",
      desc: "밤이 되면 바다 위 정자로 이어지는 동명해교에 화려한 조명이 켜지며 어두운 파도 소리와 함께 낭만을 더합니다."
    }
  ]
};
