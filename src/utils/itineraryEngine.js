import { getCityPOIs } from '../data/cityPoiDatabase';
import { NEIGHBOR_MAPPING } from '../data/destinations';

/**
 * Calculate Haversine distance between two [lat, lng] coordinates in km
 */
const getDistanceKm = (coord1, coord2) => {
  if (!coord1 || !coord2) return 0;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Build a realistic, theme-customized, distance-clustered & non-repeating itinerary.
 * 
 * @param {string} cityName - City Name (e.g., '서울', '교토', '파리')
 * @param {string} countryName - Country Name (e.g., '대한민국', '일본', '프랑스')
 * @param {string} style - Theme ('healing', 'activity', 'food', 'culture', 'shopping')
 * @param {number} duration - Trip Duration (1..14)
 * @returns {Object} Object mapping day numbers (1..duration) to arrays of time-slot items
 */
export const buildDynamicItinerary = (cityName, countryName, style = 'healing', duration = 3) => {
  const poiList = getCityPOIs(cityName, countryName);
  const usedIds = new Set();
  const itinerary = {};

  // Score POIs according to theme
  const getThemeScore = (item) => {
    const scores = item.themes || {};
    return scores[style] || scores.healing || 3;
  };

  // Helper to filter & select unused POIs matching criteria
  const selectPOI = (targetCategory, preferredZone, lastCoord) => {
    let pool = poiList.filter(item => !usedIds.has(item.id));
    
    if (targetCategory === 'restaurant') {
      pool = pool.filter(item => item.category === 'restaurant');
    } else if (targetCategory === 'cafe') {
      pool = pool.filter(item => item.category === 'cafe');
    } else if (targetCategory === 'activity') {
      pool = pool.filter(item => item.category === 'activity' || item.category === 'attraction');
    } else if (targetCategory === 'relaxation') {
      pool = pool.filter(item => item.category === 'relaxation' || item.category === 'attraction' || item.category === 'cafe');
    } else {
      pool = pool.filter(item => item.category === 'attraction' || item.category === 'relaxation' || item.category === 'nightview');
    }

    if (pool.length === 0) {
      // Fallback: search any unused POI
      pool = poiList.filter(item => !usedIds.has(item.id));
    }

    if (pool.length > 0) {
      // Sort candidates by Theme Score (descending) & Distance to lastCoord (ascending)
      pool.sort((a, b) => {
        const scoreA = getThemeScore(a);
        const scoreB = getThemeScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;

        if (lastCoord && a.coordinates && b.coordinates) {
          const distA = getDistanceKm(lastCoord, a.coordinates);
          const distB = getDistanceKm(lastCoord, b.coordinates);
          return distA - distB;
        }

        if (preferredZone) {
          if (a.zone === preferredZone && b.zone !== preferredZone) return -1;
          if (b.zone === preferredZone && a.zone !== preferredZone) return 1;
        }

        return 0;
      });

      const selected = pool[0];
      usedIds.add(selected.id);
      return selected;
    }

    // Dynamic Synth POI for extended multi-day trips when pool runs out
    const synthIndex = usedIds.size + 1;
    const synthId = `${cityName}_synth_${style}_${synthIndex}`;
    usedIds.add(synthId);

    if (targetCategory === 'restaurant') {
      return {
        id: synthId,
        name: style === 'food' ? `${cityName} 미쉐린 / 로컬 숨은 맛집` : `${cityName} 정갈한 현지식 식당`,
        category: 'restaurant',
        desc: `${cityName}의 로컬 재료로 조리한 깊은 풍미의 미식 한 끼를 음미합니다.`,
        badgeIcon: '🍽️'
      };
    } else if (targetCategory === 'cafe') {
      return {
        id: synthId,
        name: `${cityName} 감성 테라스 찻집`,
        category: 'cafe',
        desc: `여유로운 풍경이 보이는 테라스에서 갓 추출한 커피와 스페셜 디저트 타임.`,
        badgeIcon: '☕'
      };
    } else if (style === 'activity') {
      return {
        id: synthId,
        name: `${cityName} 이색 야외 레저 / 스포츠 체험`,
        category: 'activity',
        desc: `지형과 자연을 활용한 액티브한 현지 스포츠 및 미디어 아트 탐방.`,
        badgeIcon: '🎡'
      };
    } else if (style === 'healing') {
      return {
        id: synthId,
        name: `${cityName} 고즈넉한 정원 & 숲길 피크닉`,
        category: 'relaxation',
        desc: `새소리가 들리는 한적한 수목 정원에서 마음의 평안을 얻는 힐링 산책.`,
        badgeIcon: '🌿'
      };
    } else {
      return {
        id: synthId,
        name: `${cityName} 역사 골목 & 갤러리 산책`,
        category: 'attraction',
        desc: `${cityName}의 오랜 이야기가 깃든 문화 골목길을 둘러보며 스냅 사진 촬영.`,
        badgeIcon: '🏛️'
      };
    }
  };

  const zones = ['center', 'east', 'west', 'north', 'south'];

  for (let day = 1; day <= duration; day++) {
    const dayZone = zones[(day - 1) % zones.length];
    const neighbors = NEIGHBOR_MAPPING[cityName] || [];

    // Excursion day for 4th day if neighbors exist
    if (day === 4 && neighbors.length > 0) {
      const neighborCity = neighbors[0];
      itinerary[day] = [
        {
          time: "09:30",
          title: `🚗 인접 도시 [${neighborCity}] 당일치기 투어`,
          desc: `${cityName} 근교의 아름다운 이웃 도시 [${neighborCity}](으)로 출발하여 특별한 근교 여정을 만끽합니다.`,
          categoryType: "attraction",
          badgeIcon: "🚗"
        },
        {
          time: "12:30",
          title: `🍴 [${neighborCity}] 로컬 특산 점심`,
          desc: `이웃 도시 [${neighborCity}]에서만 맛볼 수 있는 소문난 지역 특선 명가 요리.`,
          categoryType: "restaurant",
          badgeIcon: "🍽️"
        },
        {
          time: "15:00",
          title: `☕ [${neighborCity}] 호숫가/전망 테라스 카페`,
          desc: `근교 자연 정경이 내다보이는 고즈넉한 카페에서 여유롭게 음료와 디저트를 음미합니다.`,
          categoryType: "cafe",
          badgeIcon: "☕"
        },
        {
          time: "18:30",
          title: `🏡 ${cityName} 복귀 및 만찬`,
          desc: `본진인 ${cityName}(으)로 귀환하여 따뜻한 식사와 함께 하루를 만족스럽게 정리합니다.`,
          categoryType: "restaurant",
          badgeIcon: "🍷"
        }
      ];
      continue;
    }

    // Dynamic Rhythm according to Style
    let lastCoord = null;

    if (style === 'healing') {
      // 🌿 Healing Rhythm: Nature/Park -> Healthy Lunch -> Quiet View/Spa -> Tea House -> Gentle Dinner
      const morningSpot = selectPOI('relaxation', dayZone, lastCoord);
      lastCoord = morningSpot.coordinates || lastCoord;

      const lunchSpot = selectPOI('restaurant', dayZone, lastCoord);
      lastCoord = lunchSpot.coordinates || lastCoord;

      const afternoonSpot = selectPOI('relaxation', dayZone, lastCoord);
      lastCoord = afternoonSpot.coordinates || lastCoord;

      const teaSpot = selectPOI('cafe', dayZone, lastCoord);
      lastCoord = teaSpot.coordinates || lastCoord;

      const dinnerSpot = selectPOI('restaurant', dayZone, lastCoord);

      itinerary[day] = [
        { time: "10:00", title: `🌿 ${morningSpot.name}`, desc: morningSpot.desc, categoryType: "relaxation", badgeIcon: "🌿" },
        { time: "12:30", title: `🍽️ [정갈한 점심] ${lunchSpot.name}`, desc: lunchSpot.desc, categoryType: "restaurant", badgeIcon: "🍽️" },
        { time: "14:30", title: `☕ ${afternoonSpot.name}`, desc: afternoonSpot.desc, categoryType: afternoonSpot.category || "relaxation", badgeIcon: "☕" },
        { time: "16:30", title: `🍵 [힐링 찻집] ${teaSpot.name}`, desc: teaSpot.desc, categoryType: "cafe", badgeIcon: "🍵" },
        { time: "18:30", title: `🍷 [여유로운 저녁] ${dinnerSpot.name}`, desc: dinnerSpot.desc, categoryType: "restaurant", badgeIcon: "🍷" }
      ];
    } else if (style === 'activity') {
      // ⚡ Activity Rhythm: Thrill Morning -> Active Lunch -> Outdoor Sports/Leisure -> Energy Cafe -> Night Market/Bar
      const morningSpot = selectPOI('activity', dayZone, lastCoord);
      lastCoord = morningSpot.coordinates || lastCoord;

      const lunchSpot = selectPOI('restaurant', dayZone, lastCoord);
      lastCoord = lunchSpot.coordinates || lastCoord;

      const afternoonSpot = selectPOI('activity', dayZone, lastCoord);
      lastCoord = afternoonSpot.coordinates || lastCoord;

      const cafeSpot = selectPOI('cafe', dayZone, lastCoord);
      lastCoord = cafeSpot.coordinates || lastCoord;

      const dinnerSpot = selectPOI('restaurant', dayZone, lastCoord);

      itinerary[day] = [
        { time: "09:30", title: `🎡 ${morningSpot.name}`, desc: morningSpot.desc, categoryType: "activity", badgeIcon: "🎡" },
        { time: "12:30", title: `🍽️ [에너지 든든 점심] ${lunchSpot.name}`, desc: lunchSpot.desc, categoryType: "restaurant", badgeIcon: "🍽️" },
        { time: "14:30", title: `⚡ ${afternoonSpot.name}`, desc: afternoonSpot.desc, categoryType: "activity", badgeIcon: "⚡" },
        { time: "17:00", title: `☕ [에너지 충전] ${cafeSpot.name}`, desc: cafeSpot.desc, categoryType: "cafe", badgeIcon: "☕" },
        { time: "19:00", title: `🍺 [활기찬 야간 만찬] ${dinnerSpot.name}`, desc: dinnerSpot.desc, categoryType: "restaurant", badgeIcon: "🍺" }
      ];
    } else if (style === 'food') {
      // 🍕 Food Rhythm: Market Tour -> Gourmet Lunch -> Dessert Tasting -> Specialty Cafe -> Dinner Feast
      const morningSpot = selectPOI('attraction', dayZone, lastCoord);
      lastCoord = morningSpot.coordinates || lastCoord;

      const lunchSpot = selectPOI('restaurant', dayZone, lastCoord);
      lastCoord = lunchSpot.coordinates || lastCoord;

      const dessertSpot = selectPOI('cafe', dayZone, lastCoord);
      lastCoord = dessertSpot.coordinates || lastCoord;

      const cafeSpot = selectPOI('cafe', dayZone, lastCoord);
      lastCoord = cafeSpot.coordinates || lastCoord;

      const dinnerSpot = selectPOI('restaurant', dayZone, lastCoord);

      itinerary[day] = [
        { time: "10:30", title: `🛍️ ${morningSpot.name}`, desc: morningSpot.desc, categoryType: "attraction", badgeIcon: "🛍️" },
        { time: "12:30", title: `🍕 [시그니처 미식 점심] ${lunchSpot.name}`, desc: lunchSpot.desc, categoryType: "restaurant", badgeIcon: "🍕" },
        { time: "14:30", title: `🍰 [유명 디저트] ${dessertSpot.name}`, desc: dessertSpot.desc, categoryType: "cafe", badgeIcon: "🍰" },
        { time: "16:30", title: `☕ [로스터리 카페] ${cafeSpot.name}`, desc: cafeSpot.desc, categoryType: "cafe", badgeIcon: "☕" },
        { time: "18:30", title: `🍷 [정통 만찬] ${dinnerSpot.name}`, desc: dinnerSpot.desc, categoryType: "restaurant", badgeIcon: "🍷" }
      ];
    } else {
      // 🏛️ Culture / General Rhythm: Heritage Morning -> Traditional Lunch -> Museum/Old Town -> Cultural Cafe -> Fine Dinner
      const morningSpot = selectPOI('attraction', dayZone, lastCoord);
      lastCoord = morningSpot.coordinates || lastCoord;

      const lunchSpot = selectPOI('restaurant', dayZone, lastCoord);
      lastCoord = lunchSpot.coordinates || lastCoord;

      const afternoonSpot = selectPOI('attraction', dayZone, lastCoord);
      lastCoord = afternoonSpot.coordinates || lastCoord;

      const cafeSpot = selectPOI('cafe', dayZone, lastCoord);
      lastCoord = cafeSpot.coordinates || lastCoord;

      const dinnerSpot = selectPOI('restaurant', dayZone, lastCoord);

      itinerary[day] = [
        { time: "09:30", title: `🏛️ ${morningSpot.name}`, desc: morningSpot.desc, categoryType: "attraction", badgeIcon: "🏛️" },
        { time: "12:30", title: `🍽️ [전통 정식 점심] ${lunchSpot.name}`, desc: lunchSpot.desc, categoryType: "restaurant", badgeIcon: "🍽️" },
        { time: "14:30", title: `📸 ${afternoonSpot.name}`, desc: afternoonSpot.desc, categoryType: "attraction", badgeIcon: "📸" },
        { time: "16:30", title: `☕ [문화 카페] ${cafeSpot.name}`, desc: cafeSpot.desc, categoryType: "cafe", badgeIcon: "☕" },
        { time: "18:30", title: `🍷 [품격 저녁] ${dinnerSpot.name}`, desc: dinnerSpot.desc, categoryType: "restaurant", badgeIcon: "🍷" }
      ];
    }
  }

  return itinerary;
};
