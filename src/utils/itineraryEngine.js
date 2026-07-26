import { getCityPOIs } from '../data/cityPoiDatabase';
import { NEIGHBOR_MAPPING } from '../data/destinations';

/**
 * Generate a realistic, time-slot structured, non-repeating itinerary for any city and duration (1~14 days).
 * 
 * @param {string} cityName - Target city name (e.g., '서울', '교토', '파리')
 * @param {string} countryName - Target country name (e.g., '대한민국', '일본', '프랑스')
 * @param {string} style - Travel style ('healing', 'activity', 'food', 'culture', 'shopping')
 * @param {number} duration - Trip duration in days (1 to 14)
 * @returns {Object} Object mapping day numbers (1..duration) to arrays of time-slot items
 */
export const buildDynamicItinerary = (cityName, countryName, style = 'healing', duration = 3) => {
  const poiData = getCityPOIs(cityName, countryName);
  const usedIds = new Set();
  const itinerary = {};

  // Extract categories
  const attractions = [...(poiData.attractions || [])];
  const restaurants = [...(poiData.restaurants || [])];
  const cafes = [...(poiData.cafes || [])];
  const activities = [...(poiData.activities || [])];

  // Helper to pick an unused item matching criteria
  const pickUnused = (pool, zonePreference, fallbackCategoryName) => {
    // 1. Try unused matching zone
    let match = pool.find(item => !usedIds.has(item.id) && item.zone === zonePreference);
    
    // 2. Try unused any zone
    if (!match) {
      match = pool.find(item => !usedIds.has(item.id));
    }

    if (match) {
      usedIds.add(match.id);
      return match;
    }

    // 3. Fallback: Generate a non-duplicate dynamic POI record for extended stays (Days 4, 5, 6, etc.)
    const synthId = `${cityName}_synth_${fallbackCategoryName}_${usedIds.size + 1}`;
    usedIds.add(synthId);

    if (fallbackCategoryName === 'restaurant_lunch') {
      return {
        id: synthId,
        name: `${cityName} 로컬 숨은 맛집 런치`,
        category: 'restaurant',
        desc: `현지 주민들이 자주 찾는 정갈한 골목 식당에서 구수한 점심 정식을 즐깁니다.`,
        icon: '🍽️'
      };
    } else if (fallbackCategoryName === 'restaurant_dinner') {
      return {
        id: synthId,
        name: `${cityName} 시그니처 숯불 야경 만찬`,
        category: 'restaurant',
        desc: `아름다운 조명이 가득한 식당에서 지역 특산 식재료로 조리한 저녁 코스 요리.`,
        icon: '🍷'
      };
    } else if (fallbackCategoryName === 'cafe') {
      return {
        id: synthId,
        name: `${cityName} 감성 테라스 카페`,
        category: 'cafe',
        desc: `분위기 있는 테라스에서 갓 구운 수제 베이커리와 스페셜티 드립 커피 한 잔의 여유.`,
        icon: '☕'
      };
    } else if (fallbackCategoryName === 'activity') {
      return {
        id: synthId,
        name: `${cityName} 로컬 체험 & 문화 투어`,
        category: 'activity',
        desc: `지역 고유의 쿠킹 클래스, 공예 체험 또는 도심 라이브 버스킹 관람.`,
        icon: '🎡'
      };
    } else {
      return {
        id: synthId,
        name: `${cityName} 미탐방 감성 거리 산책`,
        category: 'attraction',
        desc: `${cityName}의 고즈넉한 골목길과 특색 있는 로컬 플리마켓을 거닐며 스냅 사진 촬영.`,
        icon: '🏛️'
      };
    }
  };

  // Determine zones available
  const zones = ['center', 'east', 'west', 'north', 'south'];

  for (let day = 1; day <= duration; day++) {
    const dayZone = zones[(day - 1) % zones.length];
    const neighbors = NEIGHBOR_MAPPING[cityName] || [];

    // Special Day 4/5 Excursion Option if neighbors exist and duration >= 4
    if (day === 4 && neighbors.length > 0) {
      const neighborCity = neighbors[0];
      itinerary[day] = [
        {
          time: "09:30",
          title: `🚗 인접 도시 [${neighborCity}] 당일치기 투어`,
          desc: `${cityName} 근교의 전원 도시 [${neighborCity}](으)로 이동하여 한적한 일정을 시작합니다.`,
          categoryType: "attraction",
          badgeIcon: "🚗"
        },
        {
          time: "12:30",
          title: `🍴 [${neighborCity}] 지역 향토 점심`,
          desc: `이웃 도시 [${neighborCity}]의 명물 시그니처 든든한 로컬 한 끼 식사를 합니다.`,
          categoryType: "restaurant",
          badgeIcon: "🍽️"
        },
        {
          time: "15:00",
          title: `☕ [${neighborCity}] 전망 좋은 호수/정원 카페`,
          desc: `자연 정경이 내다보이는 한적한 베이커리 카페에서 티 타임과 휴식을 가집니다.`,
          categoryType: "cafe",
          badgeIcon: "☕"
        },
        {
          time: "18:30",
          title: `🏡 ${cityName} 복귀 및 저녁 만찬`,
          desc: `본진인 ${cityName}(으)로 귀환하여 따뜻한 저녁 식사와 함께 하루를 정리합니다.`,
          categoryType: "restaurant",
          badgeIcon: "🍷"
        }
      ];
      continue;
    }

    // Standard Time-Slot Assembly (Strict Category Placement)
    const morningAttraction = pickUnused(attractions, dayZone, 'attraction');
    const lunchRestaurant = pickUnused(restaurants, dayZone, 'restaurant_lunch');
    
    // Choose afternoon item based on style
    let afternoonItem;
    if (style === 'activity') {
      afternoonItem = pickUnused(activities, dayZone, 'activity');
    } else {
      afternoonItem = pickUnused(attractions, dayZone, 'attraction');
    }
    
    const afternoonCafe = pickUnused(cafes, dayZone, 'cafe');
    const dinnerRestaurant = pickUnused(restaurants, dayZone, 'restaurant_dinner');

    // Build standard 5-slot day
    itinerary[day] = [
      {
        time: "10:00",
        title: `🏛️ ${morningAttraction.name}`,
        desc: morningAttraction.desc,
        categoryType: "attraction",
        badgeIcon: "🏛️"
      },
      {
        time: "12:30",
        title: `🍽️ [점심] ${lunchRestaurant.name}`,
        desc: lunchRestaurant.desc,
        categoryType: "restaurant",
        badgeIcon: "🍽️"
      },
      {
        time: "14:30",
        title: `${afternoonItem.category === 'activity' ? '🎡' : '📸'} ${afternoonItem.name}`,
        desc: afternoonItem.desc,
        categoryType: afternoonItem.category || "attraction",
        badgeIcon: afternoonItem.category === 'activity' ? '🎡' : '📸'
      },
      {
        time: "16:30",
        title: `☕ [디저트/카페] ${afternoonCafe.name}`,
        desc: afternoonCafe.desc,
        categoryType: "cafe",
        badgeIcon: "☕"
      },
      {
        time: "18:30",
        title: `🍷 [저녁] ${dinnerRestaurant.name}`,
        desc: dinnerRestaurant.desc,
        categoryType: "restaurant",
        badgeIcon: "🍷"
      }
    ];
  }

  return itinerary;
};
