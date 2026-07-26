export const poiDeepDanyang = {
  "단양": [
    // --- ATTRACTIONS (명소/자연) ---
    {
      id: "danyang_att_1", name: "도담삼봉 & 석문", category: "attraction", subCategory: "nature",
      themes: { healing: 5, activity: 2, food: 1, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.0041, 128.3533], zone: "east",
      desc: "남한강 푸른 물결 한가운데 솟은 세 개의 기암괴석 봉우리의 신비로움과, 무지개 모양의 천연 돌문인 석문을 관람합니다."
    },
    {
      id: "danyang_att_2", name: "고수동굴", category: "attraction", subCategory: "nature",
      themes: { healing: 4, activity: 4, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.9852, 128.3811], zone: "east",
      desc: "수억 년의 시간이 빚어낸 웅장한 석회암 동굴 속으로 깊이 들어가 신비로운 종유석과 석순의 화려한 미로를 탐험합니다."
    },
    {
      id: "danyang_att_3", name: "만천하 스카이워크", category: "attraction", subCategory: "viewpoint",
      themes: { healing: 4, activity: 4, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.9612, 128.3475], zone: "south",
      desc: "남한강 절벽 위에 솟은 거대한 알 모양 전망대에 올라 아찔한 투명 유리 바닥 아래로 펼쳐진 소백산맥의 굽이치는 절경을 봅니다."
    },
    {
      id: "danyang_att_4", name: "구인사", category: "attraction", subCategory: "heritage",
      themes: { healing: 5, activity: 4, food: 1, culture: 5, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [37.0421, 128.4872], zone: "east",
      desc: "소백산 깊은 계곡을 따라 웅장한 전각들이 빽빽하게 들어선 국내 최대 규모의 사찰로, 화려하고 이국적인 경관에 압도됩니다."
    },

    // --- RELAXATION (휴식/자연) ---
    {
      id: "danyang_rel_1", name: "단양강 잔도", category: "relaxation", subCategory: "nature",
      themes: { healing: 5, activity: 3, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.9741, 128.3501], zone: "south",
      desc: "남한강의 깎아지른 절벽 옆구리에 설치된 아슬아슬한 나무 데크길을 걸으며 스릴과 치유를 동시에 느끼는 힐링 산책로입니다."
    },
    {
      id: "danyang_rel_2", name: "수양개 선사유물전시관 & 비밀의 정원", category: "relaxation", subCategory: "park",
      themes: { healing: 4, activity: 2, food: 1, culture: 4, shopping: 1 },
      timeOfDay: ["afternoon", "evening"], coordinates: [36.9582, 128.3402], zone: "south",
      desc: "구석기 시대 유물 관람 후, 밤이 되면 5만 송이의 LED 장미가 켜지는 수양개빛터널의 빛의 정원을 거닙니다."
    },

    // --- ACTIVITIES (액티비티) ---
    {
      id: "danyang_act_1", name: "단양 패러글라이딩", category: "activity", subCategory: "extreme",
      themes: { healing: 2, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["morning", "afternoon"], coordinates: [36.9815, 128.3752], zone: "east",
      desc: "두산활공장 산 정상에서 전문가와 함께 새처럼 날아올라 단양 도심과 굽이치는 남한강의 황홀한 파노라마를 비행합니다."
    },
    {
      id: "danyang_act_2", name: "만천하 짚와이어 & 알파인코스터", category: "activity", subCategory: "leisure",
      themes: { healing: 1, activity: 5, food: 1, culture: 1, shopping: 1 },
      timeOfDay: ["afternoon"], coordinates: [36.9610, 128.3470], zone: "south",
      desc: "스카이워크 전망대에서 줄 하나에 의지해 계곡을 시원하게 가로지르거나, 숲속을 고속으로 질주하는 짜릿한 놀이기구를 탑니다."
    },

    // --- RESTAURANTS (식당/미식) ---
    {
      id: "danyang_res_1", name: "구경시장 마늘 닭강정 & 흑마늘 빵", category: "restaurant", subCategory: "street_food",
      themes: { healing: 1, activity: 3, food: 5, culture: 3, shopping: 4 },
      timeOfDay: ["lunch", "afternoon"], coordinates: [36.9842, 128.3685], zone: "center",
      desc: "단양 특산물인 육쪽마늘을 듬뿍 넣어 알싸하면서도 달콤한 마늘 닭강정과 귀여운 모양의 마늘빵을 포장합니다."
    },
    {
      id: "danyang_res_2", name: "단양 마늘 떡갈비 정식", category: "restaurant", subCategory: "gourmet",
      themes: { healing: 3, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["lunch", "dinner"], coordinates: [36.9835, 128.3692], zone: "center",
      desc: "통마늘이 박혀 있어 느끼함을 잡고 숯불 향이 그윽한 육즙 가득한 떡갈비를 푸짐한 밑반찬과 함께 먹습니다."
    },
    {
      id: "danyang_res_3", name: "쏘가리 매운탕 골목", category: "restaurant", subCategory: "local_food",
      themes: { healing: 2, activity: 1, food: 5, culture: 2, shopping: 1 },
      timeOfDay: ["dinner"], coordinates: [36.9850, 128.3675], zone: "center",
      desc: "남한강 청정수역에서 잡은 민물고기의 제왕 쏘가리로 끓여낸 얼큰하고 시원한 흙내 없는 최고급 매운탕입니다."
    },
    {
      id: "danyang_res_4", name: "충청도 순대 (마늘 순대국밥)", category: "restaurant", subCategory: "local_food",
      themes: { healing: 3, activity: 1, food: 5, culture: 3, shopping: 1 },
      timeOfDay: ["morning", "lunch"], coordinates: [36.9848, 128.3681], zone: "center",
      desc: "구경시장 내에서 마늘이 듬뿍 들어가 잡내가 전혀 없고 국물이 뽀얗고 진한 순대국밥으로 든든하게 해장합니다."
    },

    // --- CAFES (카페) ---
    {
      id: "danyang_caf_1", name: "카페 산 (패러글라이딩 뷰 카페)", category: "cafe", subCategory: "view_cafe",
      themes: { healing: 5, activity: 2, food: 4, culture: 1, shopping: 2 },
      timeOfDay: ["tea", "afternoon"], coordinates: [36.9818, 128.3761], zone: "east",
      desc: "해발 600m 구름 위에 떠 있는 듯한 산 정상 카페에서 수많은 패러글라이더들이 이륙하는 경관과 빵을 즐깁니다."
    },
    {
      id: "danyang_caf_2", name: "도담삼봉 뷰 테라스 카페", category: "cafe", subCategory: "trendy_cafe",
      themes: { healing: 4, activity: 1, food: 4, culture: 2, shopping: 1 },
      timeOfDay: ["tea", "morning"], coordinates: [37.0045, 128.3540], zone: "east",
      desc: "남한강에 떠 있는 도담삼봉의 고요한 절경을 가장 가까이서 감상하며 시원한 차와 커피로 더위를 식힙니다."
    },

    // --- NIGHTVIEW (야경) ---
    {
      id: "danyang_nig_1", name: "수양개빛터널 야경", category: "nightview", subCategory: "theme_park",
      themes: { healing: 4, activity: 3, food: 1, culture: 2, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [36.9585, 128.3400], zone: "south",
      desc: "일제강점기에 지어진 버려진 터널이 화려한 레이저와 은하수 LED 불빛으로 재탄생한 몽환적인 미디어아트 터널을 걷습니다."
    },
    {
      id: "danyang_nig_2", name: "고수대교 및 남한강 야경", category: "nightview", subCategory: "viewpoint",
      themes: { healing: 4, activity: 2, food: 2, culture: 1, shopping: 1 },
      timeOfDay: ["evening"], coordinates: [36.9858, 128.3705], zone: "center",
      desc: "밤이 되면 붉고 푸른 조명으로 화려하게 옷을 갈아입는 고수대교와 남한강변의 낭만적인 밤 풍경을 산책하며 즐깁니다."
    }
  ]
};
