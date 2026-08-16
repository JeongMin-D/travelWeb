import { getCityPOIs } from '../data/cityPoiDatabase';
import { NEIGHBOR_MAPPING } from '../data/destinations';

const getDistanceKm = (coord1, coord2) => {
  if (!coord1 || !coord2) return 0;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const CAT_MATCH = {
  restaurant: ['restaurant'],
  cafe: ['cafe'],
  activity: ['activity', 'attraction'],
  relaxation: ['relaxation', 'attraction', 'cafe']
};

const matchCategory = (itemCat, targetCat) => 
  (CAT_MATCH[targetCat] || ['attraction', 'relaxation', 'nightview']).includes(itemCat);

const STYLE_PATTERNS = {
  healing: [
    { time: "08:30", cat: "restaurant", prefix: "🍳 [상쾌한 조식]", icon: "🍳" },
    { time: "10:00", cat: "relaxation", prefix: "🌿", icon: "🌿" },
    { time: "12:30", cat: "restaurant", prefix: "🍽️ [정갈한 점심]", icon: "🍽️" },
    { time: "14:30", cat: "relaxation", prefix: "🍃", icon: "🍃" },
    { time: "16:30", cat: "cafe", prefix: "🍵 [힐링 찻집]", icon: "🍵" },
    { time: "18:30", cat: "restaurant", prefix: "🍷 [여유로운 저녁]", icon: "🍷" },
    { time: "20:00", cat: "nightview", prefix: "🌙", icon: "🌙" }
  ],
  activity: [
    { time: "08:30", cat: "restaurant", prefix: "🍳 [든든한 조식]", icon: "🍳" },
    { time: "10:00", cat: "activity", prefix: "🎡", icon: "🎡" },
    { time: "12:30", cat: "restaurant", prefix: "🍽️ [에너지 보충 점심]", icon: "🍽️" },
    { time: "14:30", cat: "activity", prefix: "⚡", icon: "⚡" },
    { time: "17:00", cat: "cafe", prefix: "☕ [달콤한 휴식]", icon: "☕" },
    { time: "19:00", cat: "restaurant", prefix: "🍺 [활기찬 야간 만찬]", icon: "🍺" },
    { time: "21:00", cat: "nightview", prefix: "✨", icon: "✨" }
  ],
  food: [
    { time: "08:30", cat: "restaurant", prefix: "🍳 [브런치/조식]", icon: "🍳" },
    { time: "10:30", cat: "attraction", prefix: "🛍️", icon: "🛍️" },
    { time: "12:30", cat: "restaurant", prefix: "🍕 [시그니처 미식 점심]", icon: "🍕" },
    { time: "14:30", cat: "cafe", prefix: "🍰 [유명 디저트]", icon: "🍰" },
    { time: "16:30", cat: "cafe", prefix: "☕ [로스터리 카페]", icon: "☕" },
    { time: "18:30", cat: "restaurant", prefix: "🍷 [정통 만찬]", icon: "🍷" },
    { time: "20:30", cat: "nightview", prefix: "🌙", icon: "🌙" }
  ],
  culture: [
    { time: "08:30", cat: "restaurant", prefix: "🍳 [현지식 조식]", icon: "🍳" },
    { time: "10:00", cat: "attraction", prefix: "🏛️", icon: "🏛️" },
    { time: "12:30", cat: "restaurant", prefix: "🍽️ [전통 정식 점심]", icon: "🍽️" },
    { time: "14:30", cat: "attraction", prefix: "📸", icon: "📸" },
    { time: "16:30", cat: "cafe", prefix: "☕ [문화 카페]", icon: "☕" },
    { time: "18:30", cat: "restaurant", prefix: "🍷 [품격 저녁]", icon: "🍷" },
    { time: "20:00", cat: "nightview", prefix: "🌃", icon: "🌃" }
  ]
};

const ZONES = ['center', 'east', 'west', 'north', 'south'];

export const buildDynamicItinerary = (cityName, countryName, style = 'healing', duration = 3) => {
  const poiList = getCityPOIs(cityName, countryName);
  const usedIds = new Set();
  const itinerary = {};

  const getThemeScore = (item) => (item.themes?.[style] || item.themes?.healing || 3);

  const selectPOI = (targetCat, preferredZone, lastCoord) => {
    const candidates = poiList.filter(item => !usedIds.has(item.id) && matchCategory(item.category, targetCat));
    if (!candidates.length) return null;

    candidates.sort((a, b) => {
      const distA = (lastCoord && a.coordinates) ? getDistanceKm(lastCoord, a.coordinates) : 5;
      const distB = (lastCoord && b.coordinates) ? getDistanceKm(lastCoord, b.coordinates) : 5;
      const diff = (getThemeScore(b) * 20 - distB * 3) - (getThemeScore(a) * 20 - distA * 3);
      if (diff !== 0) return diff;
      return (preferredZone && a.zone === preferredZone ? -1 : 1);
    });

    const chosen = candidates[0];
    usedIds.add(chosen.id);
    return chosen;
  };

  for (let day = 1; day <= duration; day++) {
    const dayZone = ZONES[(day - 1) % ZONES.length];
    const neighbors = NEIGHBOR_MAPPING[cityName] || [];

    if (day === 4 && neighbors.length > 0) {
      const nb = neighbors[0];
      itinerary[day] = [
        { time: "09:30", title: `🚗 인접 도시 [${nb}] 당일치기 투어`, desc: `${cityName} 근교의 아름다운 이웃 도시 [${nb}](으)로 출발하여 특별한 근교 여정을 만끽합니다.`, categoryType: "attraction", badgeIcon: "🚗", distText: "약 45km (1시간)" },
        { time: "12:30", title: `🍴 [${nb}] 로컬 특산 점심`, desc: `이웃 도시 [${nb}]에서만 맛볼 수 있는 소문난 지역 특선 명가 요리.`, categoryType: "restaurant", badgeIcon: "🍽️", distText: "약 3km (10분)" },
        { time: "15:00", title: `☕ [${nb}] 호숫가/전망 테라스 카페`, desc: `근교 자연 정경이 내다보이는 고즈넉한 카페에서 여유롭게 음료와 디저트를 음미합니다.`, categoryType: "cafe", badgeIcon: "☕", distText: "약 5km (15분)" },
        { time: "18:30", title: `🏡 ${cityName} 복귀 및 만찬`, desc: `본진인 ${cityName}(으)로 귀환하여 따뜻한 식사와 함께 하루를 만족스럽게 정리합니다.`, categoryType: "restaurant", badgeIcon: "🍷", distText: "약 45km (1시간)" }
      ];
      continue;
    }

    const pattern = STYLE_PATTERNS[style] || STYLE_PATTERNS.culture;
    let currentCoord = null;

    itinerary[day] = pattern.map(slot => {
      const spot = selectPOI(slot.cat, dayZone, currentCoord);
      if (!spot) return null;
      const distKm = (currentCoord && spot.coordinates && !spot.isSynth) ? getDistanceKm(currentCoord, spot.coordinates) : null;
      currentCoord = spot.coordinates || currentCoord;
      return {
        time: slot.time,
        title: `${slot.prefix} ${spot.name}`,
        desc: spot.desc,
        categoryType: spot.category || slot.cat,
        badgeIcon: slot.icon,
        distText: distKm !== null ? `약 ${distKm.toFixed(1)}km (${Math.max(5, Math.round(distKm * 2.5))}분)` : null
      };
    }).filter(Boolean);
  }

  return itinerary;
};

export const regenerateSlot = (cityName, countryName, style, currentCategory, dayZone, currentItineraryIds = []) => {
  const poiList = getCityPOIs(cityName, countryName);
  const candidates = poiList.filter(item => !currentItineraryIds.includes(item.id) && matchCategory(item.category, currentCategory));
  return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
};
