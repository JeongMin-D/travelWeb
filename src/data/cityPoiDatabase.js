import { poiGlobalMassive } from './poi/poi_global_massive.js';
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
import { poiDeepGlobalTop } from './poi/poi_deep_global_top';
import { poiDeepKoreaExpanded } from './poi/poi_deep_korea_expanded';

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
  ...poiGlobalMassive,
  ...poiDeepKoreaExpanded,
  ...poiDeepGlobalTop
};

const CITY_ALIASES = {
  "제주": "제주도",
  "제주도": "제주",
  "LA": "로스앤젤레스",
  "로스앤젤레스": "LA",
  "빈": "비엔나",
  "비엔나": "빈",
  "호치민": "호찌민",
  "호찌민": "호치민",
  "하와이": "호놀룰루",
  "호놀룰루": "하와이"
};

// Helper: Returns POIs for a given city
export const getCityPOIs = (cityName) =>
  CITY_POI_DATABASE[cityName] || CITY_POI_DATABASE[CITY_ALIASES[cityName]] || [];

