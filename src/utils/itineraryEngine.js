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

    if (pool.length > 0) {
      // Sort candidates by Theme Score (descending) & Distance to lastCoord (ascending)
      pool.sort((a, b) => {
        const scoreA = getThemeScore(a);
        const scoreB = getThemeScore(b);
        
        let distA = 0;
        let distB = 0;
        if (lastCoord) {
          distA = a.coordinates ? getDistanceKm(lastCoord, a.coordinates) : 5;
          distB = b.coordinates ? getDistanceKm(lastCoord, b.coordinates) : 5;
        }

        // Weighted score: Theme (0~5) * 20 - Distance * 3
        // We want HIGHEST total score. A 5km difference reduces score by 15, which is almost 1 theme star (20).
        // This makes the algorithm prefer closer places unless the theme score is vastly superior.
        const totalA = (scoreA * 20) - (distA * 3);
        const totalB = (scoreB * 20) - (distB * 3);
        
        if (totalA !== totalB) return totalB - totalA;

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

    // Arrays for diverse random names to prevent repetitive schedules
    const restNames = ["로컬 숨은 맛집", "현지인 추천 미식 식당", "유명 향토 요리점", "인기 만점 웨이팅 식당"];
    const cafeNames = ["감성 테라스 찻집", "뷰가 아름다운 대형 카페", "로스터리 핸드드립 카페", "아기자기한 디저트 카페"];
    const actNames = ["이색 야외 레저 체험", "전통 문화 체험 클래스", "로컬 시장 투어", "자연 속 힐링 스포츠"];
    const relNames = ["고즈넉한 숲길 피크닉", "숨겨진 비밀의 정원", "강변 달빛 산책로", "마음이 편안해지는 명상 산책"];
    const attNames = ["역사 골목 갤러리 산책", "랜드마크 기념사진 포인트", "아름다운 벽화마을", "도시의 전경이 보이는 언덕"];

    const getSynthName = (arr) => `${cityName} ${arr[synthIndex % arr.length]}`;

    if (targetCategory === 'restaurant') {
      return {
        id: synthId,
        name: getSynthName(restNames),
        category: 'restaurant',
        desc: `${cityName}의 신선한 로컬 재료로 조리한 깊은 풍미의 미식 한 끼를 음미합니다.`,
        badgeIcon: '🍽️',
        isSynth: true
      };
    } else if (targetCategory === 'cafe') {
      return {
        id: synthId,
        name: getSynthName(cafeNames),
        category: 'cafe',
        desc: `여유로운 풍경이 보이는 공간에서 갓 추출한 커피와 스페셜 디저트 타임.`,
        badgeIcon: '☕',
        isSynth: true
      };
    } else if (style === 'activity' || targetCategory === 'activity') {
      return {
        id: synthId,
        name: getSynthName(actNames),
        category: 'activity',
        desc: `지형과 문화를 활용한 액티브한 현지 체험 및 탐방을 즐깁니다.`,
        badgeIcon: '🎡',
        isSynth: true
      };
    } else if (style === 'healing' || targetCategory === 'relaxation') {
      return {
        id: synthId,
        name: getSynthName(relNames),
        category: 'relaxation',
        desc: `바쁜 일상에서 벗어나 마음의 평안을 얻는 진정한 힐링 타임.`,
        badgeIcon: '🌿',
        isSynth: true
      };
    } else {
      return {
        id: synthId,
        name: getSynthName(attNames),
        category: 'attraction',
        desc: `${cityName}의 오랜 이야기가 깃든 명소를 둘러보며 멋진 여행 사진을 남깁니다.`,
        badgeIcon: '🏛️',
        isSynth: true
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
          badgeIcon: "🚗",
          distText: "약 45km (1시간)"
        },
        {
          time: "12:30",
          title: `🍴 [${neighborCity}] 로컬 특산 점심`,
          desc: `이웃 도시 [${neighborCity}]에서만 맛볼 수 있는 소문난 지역 특선 명가 요리.`,
          categoryType: "restaurant",
          badgeIcon: "🍽️",
          distText: "약 3km (10분)"
        },
        {
          time: "15:00",
          title: `☕ [${neighborCity}] 호숫가/전망 테라스 카페`,
          desc: `근교 자연 정경이 내다보이는 고즈넉한 카페에서 여유롭게 음료와 디저트를 음미합니다.`,
          categoryType: "cafe",
          badgeIcon: "☕",
          distText: "약 5km (15분)"
        },
        {
          time: "18:30",
          title: `🏡 ${cityName} 복귀 및 만찬`,
          desc: `본진인 ${cityName}(으)로 귀환하여 따뜻한 식사와 함께 하루를 만족스럽게 정리합니다.`,
          categoryType: "restaurant",
          badgeIcon: "🍷",
          distText: "약 45km (1시간)"
        }
      ];
      continue;
    }

    // Dynamic Rhythm according to Style
    let lastCoord = null;
    const generateDaySlots = (pattern) => {
      const slots = [];
      let currentCoord = null;
      
      pattern.forEach((slotInfo, index) => {
        const spot = selectPOI(slotInfo.cat, dayZone, currentCoord);
        
        let distKm = null;
        if (currentCoord && spot.coordinates && !spot.isSynth) {
          distKm = getDistanceKm(currentCoord, spot.coordinates);
        }
        
        let distText = null;
        if (distKm !== null) {
          const timeMins = Math.max(5, Math.round(distKm * 2.5)); // rough estimate: 24km/h avg city speed
          distText = `약 ${distKm.toFixed(1)}km (${timeMins}분)`;
        }

        currentCoord = spot.coordinates || currentCoord;
        
        slots.push({
          time: slotInfo.time,
          title: `${slotInfo.prefix} ${spot.name}`,
          desc: spot.desc,
          categoryType: spot.category || slotInfo.cat,
          badgeIcon: slotInfo.icon,
          distText: distText
        });
      });
      return slots;
    };

    if (style === 'healing') {
      itinerary[day] = generateDaySlots([
        { time: "08:30", cat: "restaurant", prefix: "🍳 [상쾌한 조식]", icon: "🍳" },
        { time: "10:00", cat: "relaxation", prefix: "🌿", icon: "🌿" },
        { time: "12:30", cat: "restaurant", prefix: "🍽️ [정갈한 점심]", icon: "🍽️" },
        { time: "14:30", cat: "relaxation", prefix: "🍃", icon: "🍃" },
        { time: "16:30", cat: "cafe", prefix: "🍵 [힐링 찻집]", icon: "🍵" },
        { time: "18:30", cat: "restaurant", prefix: "🍷 [여유로운 저녁]", icon: "🍷" },
        { time: "20:00", cat: "nightview", prefix: "🌙", icon: "🌙" }
      ]);
    } else if (style === 'activity') {
      itinerary[day] = generateDaySlots([
        { time: "08:30", cat: "restaurant", prefix: "🍳 [든든한 조식]", icon: "🍳" },
        { time: "10:00", cat: "activity", prefix: "🎡", icon: "🎡" },
        { time: "12:30", cat: "restaurant", prefix: "🍽️ [에너지 보충 점심]", icon: "🍽️" },
        { time: "14:30", cat: "activity", prefix: "⚡", icon: "⚡" },
        { time: "17:00", cat: "cafe", prefix: "☕ [달콤한 휴식]", icon: "☕" },
        { time: "19:00", cat: "restaurant", prefix: "🍺 [활기찬 야간 만찬]", icon: "🍺" },
        { time: "21:00", cat: "nightview", prefix: "✨", icon: "✨" }
      ]);
    } else if (style === 'food') {
      itinerary[day] = generateDaySlots([
        { time: "08:30", cat: "restaurant", prefix: "🍳 [브런치/조식]", icon: "🍳" },
        { time: "10:30", cat: "attraction", prefix: "🛍️", icon: "🛍️" },
        { time: "12:30", cat: "restaurant", prefix: "🍕 [시그니처 미식 점심]", icon: "🍕" },
        { time: "14:30", cat: "cafe", prefix: "🍰 [유명 디저트]", icon: "🍰" },
        { time: "16:30", cat: "cafe", prefix: "☕ [로스터리 카페]", icon: "☕" },
        { time: "18:30", cat: "restaurant", prefix: "🍷 [정통 만찬]", icon: "🍷" },
        { time: "20:30", cat: "nightview", prefix: "🌙", icon: "🌙" }
      ]);
    } else {
      itinerary[day] = generateDaySlots([
        { time: "08:30", cat: "restaurant", prefix: "🍳 [현지식 조식]", icon: "🍳" },
        { time: "10:00", cat: "attraction", prefix: "🏛️", icon: "🏛️" },
        { time: "12:30", cat: "restaurant", prefix: "🍽️ [전통 정식 점심]", icon: "🍽️" },
        { time: "14:30", cat: "attraction", prefix: "📸", icon: "📸" },
        { time: "16:30", cat: "cafe", prefix: "☕ [문화 카페]", icon: "☕" },
        { time: "18:30", cat: "restaurant", prefix: "🍷 [품격 저녁]", icon: "🍷" },
        { time: "20:00", cat: "nightview", prefix: "🌃", icon: "🌃" }
      ]);
    }
  }

  return itinerary;
};

export const regenerateSlot = (cityName, countryName, style, currentCategory, dayZone, currentItineraryIds = []) => {
  const poiList = getCityPOIs(cityName, countryName);
  
  // Filter out already used IDs
  let pool = poiList.filter(item => !currentItineraryIds.includes(item.id));
  
  if (currentCategory === 'restaurant') {
    pool = pool.filter(item => item.category === 'restaurant');
  } else if (currentCategory === 'cafe') {
    pool = pool.filter(item => item.category === 'cafe');
  } else if (currentCategory === 'activity') {
    pool = pool.filter(item => item.category === 'activity' || item.category === 'attraction');
  } else if (currentCategory === 'relaxation') {
    pool = pool.filter(item => item.category === 'relaxation' || item.category === 'attraction' || item.category === 'cafe');
  } else {
    pool = pool.filter(item => item.category === 'attraction' || item.category === 'relaxation' || item.category === 'nightview');
  }

  // Shuffle pool to give a different one each time
  pool = pool.sort(() => Math.random() - 0.5);

  if (pool.length > 0) {
    return pool[0];
  }
  return null; // No alternative found
};
