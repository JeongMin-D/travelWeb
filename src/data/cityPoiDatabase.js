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
import { poiDomesticMissing } from './poi/poi_domestic_missing';
import { poiJapan1 } from './poi/poi_japan_1';
import { poiJapan2 } from './poi/poi_japan_2';
import { poiGlobalMissing } from './poi/poi_global_missing';
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
import { poiGlobalOthers } from './poi/poi_global_others';
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
  ...poiDomesticMissing,
  ...poiJapan1,
  ...poiJapan2,
  ...poiGlobalMissing,
  // 154 Global Cities
  ...poiGlobalOthers,
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

  return [];
};
