// Categorized POI Database for Destinations
// Categories: 'attraction' (관광지), 'restaurant' (식당), 'cafe' (카페/디저트), 'activity' (액티비티/체험), 'nightview' (야경/전망대)

export const CITY_POI_DATABASE = {
  "서울": {
    attractions: [
      { id: "seoul_att_1", name: "경복궁 & 광화문 광장", category: "attraction", zone: "center", timeOfDay: ["morning"], desc: "조선 왕조의 으뜸 궁궐을 산책하고 한복 체험 및 성문 교대식을 관람합니다." },
      { id: "seoul_att_2", name: "북촌 한옥마을", category: "attraction", zone: "center", timeOfDay: ["morning", "afternoon"], desc: "고즈넉한 한옥 골목길을 걸으며 정갈한 한국 전통의 멋과 경관을 즐깁니다." },
      { id: "seoul_att_3", name: "국립중앙박물관", category: "attraction", zone: "south", timeOfDay: ["afternoon"], desc: "대한민국의 찬란한 역사 유물과 국보급 반가사유상을 관람합니다." },
      { id: "seoul_att_4", name: "성수동 연무장길", category: "attraction", zone: "east", timeOfDay: ["afternoon"], desc: "트렌디한 팝업스토어, 감성 복합문화공간 및 디자인 소품샵을 둘러봅니다." },
      { id: "seoul_att_5", name: "남산서울타워", category: "nightview", zone: "center", timeOfDay: ["evening"], desc: "서울 도심 한복판 높이 솟은 타워 전망대에서 화려한 서울 시티 야경을 관람합니다." },
      { id: "seoul_att_6", name: "한강공원 여의도지구", category: "attraction", zone: "west", timeOfDay: ["afternoon", "evening"], desc: "탁 트인 한강변에서 자전거를 타거나 돗자리를 펴고 힐링 피크닉을 즐깁니다." }
    ],
    restaurants: [
      { id: "seoul_res_1", name: "토속촌 삼계탕", category: "restaurant", mealType: ["lunch"], zone: "center", desc: "진하고 구수한 진국 육수에 영계와 인삼이 들어간 전통 삼계탕 정식." },
      { id: "seoul_res_2", name: "명동교자 본점", category: "restaurant", mealType: ["lunch"], zone: "center", desc: "진한 닭육수 칼국수와 알싸한 마늘 겉절이 김치가 일품인 서울 대표 명가." },
      { id: "seoul_res_3", name: "마장동 우시장 숯불한우", category: "restaurant", mealType: ["dinner"], zone: "east", desc: "마블링 가득한 최고급 최상급 숯불 한우 구이로 즐기는 정통 식사." },
      { id: "seoul_res_4", name: "광장시장 순희네 빈대떡", category: "restaurant", mealType: ["dinner"], zone: "center", desc: "노릇하게 튀겨낸 녹두 빈대떡과 마약김밥, 육회를 즐기는 활기찬 전통시장 만찬." }
    ],
    cafes: [
      { id: "seoul_cafe_1", name: "어니언 안국", category: "cafe", mealType: ["cafe"], zone: "center", desc: "한옥 리노베이션 공간에서 고소한 팡도르 빵과 핸드드립 커피를 즐기는 감성 카페." },
      { id: "seoul_cafe_2", name: "누데이크 성수", category: "cafe", mealType: ["cafe"], zone: "east", desc: "아방가르드한 예술적 디자인의 아이코닉 말차 피크 케이크와 시그니처 음료." },
      { id: "seoul_cafe_3", name: "통인동 대오서점 카페", category: "cafe", mealType: ["cafe"], zone: "center", desc: "서울에서 가장 오래된 서점을 개조한 빈티지 아날로그 전통 차 한 잔의 여유." }
    ],
    activities: [
      { id: "seoul_act_1", name: "한강 뚝섬 윈드서핑 & 카약", category: "activity", zone: "east", timeOfDay: ["afternoon"], desc: "시원한 한강 물살을 가르며 액티브한 수상 레포츠를 체험합니다." },
      { id: "seoul_act_2", name: "홍대 버스킹 & 클럽 라이브 투어", category: "activity", zone: "west", timeOfDay: ["evening"], desc: "젊음과 예술의 열기가 넘치는 거리 공연과 라이브 뮤직 홀 탐방." }
    ]
  },

  "제주도": {
    attractions: [
      { id: "jeju_att_1", name: "성산일출봉", category: "attraction", zone: "east", timeOfDay: ["morning"], desc: "유네스코 세계자연유산인 거대 화산구 정상에 올라 탁 트인 푸른 동해바다 절경을 감상합니다." },
      { id: "jeju_att_2", name: "사려니숲길", category: "attraction", zone: "center", timeOfDay: ["morning"], desc: "삼나무가 우거진 상쾌한 숲길을 도보로 산책하며 삼림욕을 즐깁니다." },
      { id: "jeju_att_3", name: "협재 해수욕장 & 비양도", category: "attraction", zone: "west", timeOfDay: ["afternoon"], desc: "에메랄드빛 투명한 바다와 하얀 모래사장, 에메랄드 해변 산책." },
      { id: "jeju_att_4", name: "카멜리아 힐", category: "attraction", zone: "south", timeOfDay: ["afternoon"], desc: "동백꽃과 계절 수목이 활짝 피어난 아름다운 수목원 정원 탐방." },
      { id: "jeju_att_5", name: "섭지코지", category: "attraction", zone: "east", timeOfDay: ["sunset"], desc: "해안 절벽을 따라 피어난 언덕 산책로와 붉게 물드는 남해 노을 관람." }
    ],
    restaurants: [
      { id: "jeju_res_1", name: "중문 흑돼지 연탄구이", category: "restaurant", mealType: ["dinner"], zone: "south", desc: "두툼한 제주 흑돼지 오겹살과 멜젓의 조화가 매력적인 대표 저녁 특식." },
      { id: "jeju_res_2", name: "애월 해물라면 & 통갈치조림", category: "restaurant", mealType: ["lunch"], zone: "west", desc: "문어, 전복, 꽃게가 듬뿍 들어간 얼큰한 해물 라면과 매콤 달콤 통갈치조림." },
      { id: "jeju_res_3", name: "동문시장 야시장 해산물 특식", category: "restaurant", mealType: ["dinner"], zone: "north", desc: "갓 뜬 딱새우회와 전복 버터구이, 오메기떡 등 전통시장 미식 투어." }
    ],
    cafes: [
      { id: "jeju_cafe_1", name: "오설록 티뮤지엄", category: "cafe", mealType: ["cafe"], zone: "west", desc: "끝없이 펼쳐진 녹차밭 전망과 진한 시그니처 녹차 오프레도 및 아이스크림." },
      { id: "jeju_cafe_2", name: "원앤온리 산방산 뷰 카페", category: "cafe", mealType: ["cafe"], zone: "south", desc: "웅장한 산방산과 오션뷰가 동시에 펼쳐지는 이국적인 야외 테라스 티 타임." },
      { id: "jeju_cafe_3", name: "공백 오션뷰 카페", category: "cafe", mealType: ["cafe"], zone: "east", desc: "폐공장을 갤러리로 재탄생시킨 드넓은 바다 전경의 감성 문화 카페." }
    ],
    activities: [
      { id: "jeju_act_1", name: "윈드 1947 카트 레이싱", category: "activity", zone: "south", timeOfDay: ["afternoon"], desc: "한라산 배경의 아시아 최장 트랙에서 즐기는 짜릿한 속도감의 카트 체험." },
      { id: "jeju_act_2", name: "쇠소깍 전통 테우 & 투명카약", category: "activity", zone: "south", timeOfDay: ["afternoon"], desc: "기암괴석과 민물이 어우러진 계곡에서 패들링하며 즐기는 힐링 수로 탐방." }
    ]
  },

  "부산": {
    attractions: [
      { id: "busan_att_1", name: "해운대 엘시티 X 더 스카이 전망대", category: "attraction", zone: "east", timeOfDay: ["afternoon"], desc: "초고층 빌딩 100층 높이에서 부산의 바다와 도심 전경을 360도로 한눈에 조망합니다." },
      { id: "busan_att_2", name: "감천문화마을", category: "attraction", zone: "west", timeOfDay: ["morning"], desc: "알록달록 산비탈 계단식 가옥과 어린왕자 포토존이 매력적인 문화 골목." },
      { id: "busan_att_3", name: "흰여울문화마을", category: "attraction", zone: "south", timeOfDay: ["afternoon"], desc: "절벽 해안 산책로를 따라 이어지는 하얀 담장 골목과 탁 트인 남해 바다 감상." },
      { id: "busan_att_4", name: "광안리 해수욕장 & 광안대교", category: "nightview", zone: "center", timeOfDay: ["evening"], desc: "밤하늘을 화려하게 수놓는 광안대교 조명 쇼와 낭만적인 밤바다 야경." }
    ],
    restaurants: [
      { id: "busan_res_1", name: "서면 전통 돼지국밥", category: "restaurant", mealType: ["lunch"], zone: "center", desc: "진하게 우려낸 진국 사골 육수에 수육을 듬뿍 넣은 부산 시그니처 든든한 국밥." },
      { id: "busan_res_2", name: "자갈치시장 숯불 꼼장어 구이", category: "restaurant", mealType: ["dinner"], zone: "west", desc: "매콤한 양념 불맛이 일품인 싱싱한 산 꼼장어 자갈치시장 저녁 특식." },
      { id: "busan_res_3", name: "해운대 초량밀면 & 왕만두", category: "restaurant", mealType: ["lunch"], zone: "east", desc: "살얼음 동동 띄운 한약재 육수와 살매콤 양념의 시원한 밀면 정식." }
    ],
    cafes: [
      { id: "busan_cafe_1", name: "기장 웨이브온 커피", category: "cafe", mealType: ["cafe"], zone: "east", desc: "파도가 발밑에서 부서지는 환상적인 오션뷰 파노라마 건축 디저트 카페." },
      { id: "busan_cafe_2", name: "영도 피아크(P.ARK) 복합문화카페", category: "cafe", mealType: ["cafe"], zone: "south", desc: "초대형 선박 모양 아키텍처에서 즐기는 로스터리 커피와 수제 베이커리." }
    ],
    activities: [
      { id: "busan_act_1", name: "해운대 블루라인파크 해변열차", category: "activity", zone: "east", timeOfDay: ["afternoon"], desc: "미포에서 송정까지 동해바다 해안선을 가로지르는 낭만 스카이캡슐 열차 탑승." },
      { id: "busan_act_2", name: "송도 해상케이블카", category: "activity", zone: "west", timeOfDay: ["afternoon"], desc: "바다 위 86m 상공을 통과하며 암남공원과 남해 절경을 감상하는 스릴 체험." }
    ]
  },

  "교토": {
    attractions: [
      { id: "kyoto_att_1", name: "금각사 (킨카쿠지)", category: "attraction", zone: "north", timeOfDay: ["morning"], desc: "연못 위에 찬란하게 반짝이는 금박 연못 선종 사찰 정원을 감상합니다." },
      { id: "kyoto_att_2", name: "청수사 (기요미즈데라)", category: "attraction", zone: "east", timeOfDay: ["morning", "afternoon"], desc: "절벽 위에 목조 훌라트로 세워진 웅장한 본당에서 교토 시내 전경을 내려다봅니다." },
      { id: "kyoto_att_3", name: "후시미이나리 대사", category: "attraction", zone: "south", timeOfDay: ["morning"], desc: "주홍빛 붉은 도리이 천 개가 숲길을 따라 늘어선 인상적인 산책로 탐방." },
      { id: "kyoto_att_4", name: "아라시야마 치쿠린 (대나무 숲)", category: "attraction", zone: "west", timeOfDay: ["afternoon"], desc: "바람에 사각거리는 우뚝 솟은 대나무 숲길과 도게츠교 다리 산책." },
      { id: "kyoto_att_5", name: "기온 거리 & 카모강 변", category: "nightview", zone: "center", timeOfDay: ["evening"], desc: "전통 게이샤 보존 정취 골목길을 거닐고 카모강 변 테라스에서 야경 산책." }
    ],
    restaurants: [
      { id: "kyoto_res_1", name: "정통 교토 가이세키 정식", category: "restaurant", mealType: ["dinner"], zone: "center", desc: "계절 채소와 정갈한 조리법으로 차려내는 장인의 교토식 정통 코스 요리." },
      { id: "kyoto_res_2", name: "아라시야마 유두부(유도후) 정식", category: "restaurant", mealType: ["lunch"], zone: "west", desc: "부드럽고 담백한 수제 고소한 두부와 정갈한 장국 웰빙 점심." },
      { id: "kyoto_res_3", name: "니시키 시장 텐동 & 해산물 꼬치", category: "restaurant", mealType: ["lunch"], zone: "center", desc: "400년 역사의 교토 전통 부엌 시장에서 즐기는 바삭한 튀김덮밥." }
    ],
    cafes: [
      { id: "kyoto_cafe_1", name: "아라비카 교토 아라시야마 (% 커피)", category: "cafe", mealType: ["cafe"], zone: "west", desc: "카모강 다리가 내다보이는 리버뷰에서 맛보는 라떼와 고소한 로스터리 드립." },
      { id: "kyoto_cafe_2", name: "우지 말차 겐소 파르페 찻집", category: "cafe", mealType: ["cafe"], zone: "east", desc: "우지산 최고급 진한 말차 빙수, 젤리, 앙금이 어우러진 정통 찻집 디저트." }
    ],
    activities: [
      { id: "kyoto_act_1", name: "기온 기모노 전통 의상 렌탈 탐방", category: "activity", zone: "center", timeOfDay: ["morning"], desc: "화려한 기모노를 입고 고즈넉한 전통 목조 거리와 사원을 배경으로 인생샷 촬영." },
      { id: "kyoto_act_2", name: "사가노 다이도코로 낭만 료칸 스파", category: "activity", zone: "west", timeOfDay: ["evening"], desc: "온천 노천탕에 몸을 담그고 여행의 피로를 부드럽게 이완시키는 힐링 세션." }
    ]
  },

  "도쿄": {
    attractions: [
      { id: "tokyo_att_1", name: "센소지 & 아사쿠사 나카미세도리", category: "attraction", zone: "east", timeOfDay: ["morning"], desc: "도쿄에서 가장 오래된 도쿄 대표 사찰과 옛 에도 정취 전통 골목 상점가 탐방." },
      { id: "tokyo_att_2", name: "시부야 스카이 전망대", category: "nightview", zone: "west", timeOfDay: ["sunset", "evening"], desc: "지상 229m 루프탑 오픈에어 전망대에서 도쿄 스크램블 교차로와 마천루 야경 관람." },
      { id: "tokyo_att_3", name: "신주쿠 교엔 정원", category: "attraction", zone: "west", timeOfDay: ["morning"], desc: "일식, 프랑스식, 영국식 정원이 조화롭게 조경된 도심 속 넓고 조용한 녹지 공원." },
      { id: "tokyo_att_4", name: "긴자 럭셔리 스트리트", category: "attraction", zone: "center", timeOfDay: ["afternoon"], desc: "세계적인 플래그십 스토어와 명품관, 백화점 미식이 모여있는 품격 있는 도심 거리." }
    ],
    restaurants: [
      { id: "tokyo_res_1", name: "츠키지 장외시장 신선 카이센동", category: "restaurant", mealType: ["lunch"], zone: "center", desc: "신선한 참치, 우니, 연어알이 푸짐하게 올라간 최상급 해산물 덮밥 점심." },
      { id: "tokyo_res_2", name: "이치란 라멘 신주쿠점", category: "restaurant", mealType: ["lunch"], zone: "west", desc: "진하고 깊은 돈코츠 육수와 독서실형 1인 좌석에서 비법 양념 라멘 맛보기." },
      { id: "tokyo_res_3", name: "긴자 정통 와규 스키야키 / 야키니쿠", category: "restaurant", mealType: ["dinner"], zone: "center", desc: "부드럽게 녹아내리는 최고급 와규 고기를 계란물에 적셔 먹는 저녁 럭셔리 특식." }
    ],
    cafes: [
      { id: "tokyo_cafe_1", name: "시부야 푸가렌 수제 푹신한 수플레 팬케이크", category: "cafe", mealType: ["cafe"], zone: "west", desc: "입안에서 사르르 녹아내리는 부드러운 유기농 수플레 팬케이크와 음료." },
      { id: "tokyo_cafe_2", name: "글리치 커피 로스터스 아키하바라", category: "cafe", mealType: ["cafe"], zone: "east", desc: "세계 최고 수준의 싱글 오리진 라이트 로스팅 드립 커피 시음 체험." }
    ],
    activities: [
      { id: "tokyo_act_1", name: "팀랩 플래닛 도쿄 몰입형 디지털 아트", category: "activity", zone: "east", timeOfDay: ["afternoon"], desc: "빛과 수중 공간이 연출하는 환상적인 대형 몰입형 미디어 아트 전시 체험." },
      { id: "tokyo_act_2", name: "도쿄 디즈니씨 테마파크 투어", category: "activity", zone: "east", timeOfDay: ["morning", "afternoon"], desc: "바다와 전설을 테마로 한 세계 유일의 디즈니씨 어트랙션 파크 하루 투어." }
    ]
  },

  "파리": {
    attractions: [
      { id: "paris_att_1", name: "루브르 박물관", category: "attraction", zone: "center", timeOfDay: ["morning"], desc: "모나리자, 비너스상 등 인류 위대한 예술품이 모인 세계 최대 규모 박물관 관람." },
      { id: "paris_att_2", name: "에펠탑 & 샤요 궁 광장", category: "attraction", zone: "west", timeOfDay: ["afternoon", "sunset"], desc: "파리의 영원한 상징 에펠탑을 배경으로 잔디밭 피크닉 및 명당 사진 촬영." },
      { id: "paris_att_3", name: "몽마르트르 언덕 & 사크레쾨르 대성당", category: "attraction", zone: "north", timeOfDay: ["afternoon"], desc: "화가들의 골목 정취와 파리 시내가 한눈에 내려다보이는 높푸른 언덕 탐방." },
      { id: "paris_att_4", name: "오르세 미술관", category: "attraction", zone: "center", timeOfDay: ["morning"], desc: "인상파 거장 모네, 고흐, 드가의 불후의 명작들이 전시된 오르세 기차역 미술관." }
    ],
    restaurants: [
      { id: "paris_res_1", name: "정통 파리식 코스 어니언 수프 & 에스카르고", category: "restaurant", mealType: ["lunch"], zone: "center", desc: "치즈가 듬뿍 들어간 프랑스 전통 양파 수프와 달팽이 에스카르고 요리." },
      { id: "paris_res_2", name: "마레 지구 부용 바갱 전통 비스트로", category: "restaurant", mealType: ["dinner"], zone: "center", desc: "합리적인 가격에 즐기는 갓 구운 스테이크 프릿과 정통 파리 와인 디너." }
    ],
    cafes: [
      { id: "paris_cafe_1", name: "카페 드 플로르 (Café de Flore)", category: "cafe", mealType: ["cafe"], zone: "south", desc: "사르트르와 헤밍웨이가 사랑한 생제르맹 거리의 역사적인 철학 카페 쇼콜라 쇼." },
      { id: "paris_cafe_2", name: "피에르 에르메 / 피에르 마르콜리니 마카롱", category: "cafe", mealType: ["cafe"], zone: "center", desc: "바삭함과 달콤함의 극치를 선사하는 프랑스 최고급 수제 프렌치 마카롱." }
    ],
    activities: [
      { id: "paris_act_1", name: "바토무슈 센강 야경 크루즈", category: "activity", zone: "center", timeOfDay: ["evening"], desc: "센강 물길을 따라 이동하며 조명이 켜진 노트르담, 에펠탑 야경을 유람선에서 관람." },
      { id: "paris_act_2", name: "베르사유 궁전 & 거울의 방 당일 투어", category: "activity", zone: "west", timeOfDay: ["morning", "afternoon"], desc: "태양왕 루이 14세의 화려함이 집약된 절대왕정 궁전과 정원 투어." }
    ]
  }
};

// Fallback Helper: Dynamic Generation of POIs for any missing city based on Country Registry and City Name
export const getCityPOIs = (cityName, countryName) => {
  if (CITY_POI_DATABASE[cityName]) {
    return CITY_POI_DATABASE[cityName];
  }

  // Generate customized structured POIs dynamically so NO CITY ever has undefined or empty categories
  return {
    attractions: [
      { id: `${cityName}_att_1`, name: `${cityName} 시그니처 중심 광장`, category: "attraction", zone: "center", timeOfDay: ["morning"], desc: `${cityName}의 역사적 정취와 도심 라이프스타일이 집약된 중심 광장 산책.` },
      { id: `${cityName}_att_2`, name: `${cityName} 푸른 도심 시립 공원`, category: "attraction", zone: "north", timeOfDay: ["morning", "afternoon"], desc: `상쾌한 공기와 자연 식생이 조화롭게 정원화된 힐링 도보 숲길.` },
      { id: `${cityName}_att_3`, name: `${cityName} 역사 문화 박물관/유적지`, category: "attraction", zone: "east", timeOfDay: ["afternoon"], desc: `오랜 세월 보존된 전통 문화유산과 지역 조각 예술품 감상.` },
      { id: `${cityName}_att_4`, name: `${cityName} 감성 거리 & 아트 갤러리`, category: "attraction", zone: "west", timeOfDay: ["afternoon"], desc: `로컬 아티스트들의 공방과 소품 상점이 늘어선 감성 도보 코스.` },
      { id: `${cityName}_att_5`, name: `${cityName} 스카이라인 파노라마 전망대`, category: "nightview", zone: "center", timeOfDay: ["evening"], desc: `${cityName} 도심 전경과 일몰 및 화려한 불빛 야경을 관람하는 스팟.` }
    ],
    restaurants: [
      { id: `${cityName}_res_1`, name: `${cityName} 대표 정통 시그니처 만찬`, category: "restaurant", mealType: ["dinner"], zone: "center", desc: `${countryName} 특유의 고유 향신료와 조리 기법으로 조리한 든든한 정통 저녁 코스.` },
      { id: `${cityName}_res_2`, name: `${cityName} 로컬 웰빙 수제 런치`, category: "restaurant", mealType: ["lunch"], zone: "north", desc: `현지에서 생산된 신선한 특산 재료로 정갈하게 차려내는 구수한 특식 점심.` },
      { id: `${cityName}_res_3`, name: `${cityName} 야시장/전통시장 로컬 특식`, category: "restaurant", mealType: ["dinner"], zone: "east", desc: `활기찬 시장에서 즐기는 갓 구워낸 맛깔스러운 시장 먹거리 디너.` }
    ],
    cafes: [
      { id: `${cityName}_cafe_1`, name: `${cityName} 전망 좋은 로컬 카페`, category: "cafe", mealType: ["cafe"], zone: "center", desc: `탁 트인 시티뷰를 바라보며 로스팅 드립 커피와 수제 케이크 음미.` },
      { id: `${cityName}_cafe_2`, name: `${cityName} 특산 수제 디저트 베이커리`, category: "cafe", mealType: ["cafe"], zone: "west", desc: `달콤하고 부드러운 특 특산 재료 과일 빵과 차 한 잔의 유유자적 여유.` }
    ],
    activities: [
      { id: `${cityName}_act_1`, name: `${cityName} 이색 테마 트레킹 / 수로 투어`, category: "activity", zone: "south", timeOfDay: ["afternoon"], desc: `${cityName} 고유 지형을 만끽하는 액티비티 레저 체험.` },
      { id: `${cityName}_act_2`, name: `${cityName} 나이트 라이브 & 버스킹 거리`, category: "activity", zone: "center", timeOfDay: ["evening"], desc: `화려한 도심 조명 아래 펼쳐지는 야간 소통 문화 탐방.` }
    ]
  };
};
