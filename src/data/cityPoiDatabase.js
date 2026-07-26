// Extended Categorized & Theme-Scored POI Database
// Category types: 'attraction', 'restaurant', 'cafe', 'activity', 'relaxation', 'nightview'
// Themes scores (1-5): healing, activity, food, culture, shopping

import { poiDomestic } from './poi/poi_domestic';
import { poiKoreaExtra } from './poi/poi_korea_extra';
import { poiKoreaExtra2 } from './poi/poi_korea_extra2';
import { poiKoreaExtra3 } from './poi/poi_korea_extra3';
import { poiKoreaExtra4 } from './poi/poi_korea_extra4';
import { poiKoreaExtra5 } from './poi/poi_korea_extra5';
import { poiKoreaExtra6 } from './poi/poi_korea_extra6';
import { poiDeepJeju } from './poi/poi_deep_jeju';
import { poiDeepSeoul } from './poi/poi_deep_seoul';
import { poiDeepBusan } from './poi/poi_deep_busan';
import { poiDeepGyeongju } from './poi/poi_deep_gyeongju';
import { poiDeepYeosu } from './poi/poi_deep_yeosu';
import { poiDeepGangneung } from './poi/poi_deep_gangneung';
import { poiDeepJeonju } from './poi/poi_deep_jeonju';
import { poiDeepSokcho } from './poi/poi_deep_sokcho';
import { poiDeepTongyeong } from './poi/poi_deep_tongyeong';
import { poiDeepGunsan } from './poi/poi_deep_gunsan';
import { poiDeepAndong } from './poi/poi_deep_andong';
import { poiDeepPohang } from './poi/poi_deep_pohang';
import { poiDeepGeoje } from './poi/poi_deep_geoje';
import { poiDeepNamhae } from './poi/poi_deep_namhae';
import { poiDeepSuncheon } from './poi/poi_deep_suncheon';
import { poiDeepMokpo } from './poi/poi_deep_mokpo';
import { poiDeepDamyang } from './poi/poi_deep_damyang';
import { poiDeepDanyang } from './poi/poi_deep_danyang';
import { poiDeepChuncheon } from './poi/poi_deep_chuncheon';
import { poiDeepGapyeong } from './poi/poi_deep_gapyeong';
import { poiDeepKoreaOthers } from './poi/poi_deep_korea_others';
import { poiJapan } from './poi/poi_japan';
import { poiSeasia } from './poi/poi_seasia';
import { poiEurope } from './poi/poi_europe';
import { poiAmericas } from './poi/poi_americas';

export const CITY_POI_DATABASE = {
  ...poiDomestic,
  ...poiKoreaExtra,
  ...poiKoreaExtra2,
  ...poiKoreaExtra3,
  ...poiKoreaExtra4,
  ...poiKoreaExtra5,
  ...poiKoreaExtra6,
  ...poiJapan,
  ...poiSeasia,
  ...poiEurope,
  ...poiAmericas,
  // Deep Overrides (These will replace shallow data for the top 5 cities)
  ...poiDeepJeju,
  ...poiDeepSeoul,
  ...poiDeepBusan,
  ...poiDeepGyeongju,
  ...poiDeepYeosu,
  // 2nd Batch Deep Overrides
  ...poiDeepGangneung,
  ...poiDeepJeonju,
  ...poiDeepSokcho,
  ...poiDeepTongyeong,
  ...poiDeepGunsan,
  // 3rd Batch Deep Overrides
  ...poiDeepAndong,
  ...poiDeepPohang,
  ...poiDeepGeoje,
  ...poiDeepNamhae,
  ...poiDeepSuncheon,
  // 4th Batch Deep Overrides
  ...poiDeepMokpo,
  ...poiDeepDamyang,
  ...poiDeepDanyang,
  ...poiDeepChuncheon,
  ...poiDeepGapyeong,
  // Remaining 117+ Domestic Cities
  ...poiDeepKoreaOthers,
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
