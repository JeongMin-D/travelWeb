import fs from 'fs';
import { destinations, COUNTRY_REGISTRY, getCityCoordinates } from './src/data/destinations.js';

// Get missing cities
const missing = JSON.parse(fs.readFileSync('missing_global.json', 'utf8'));

// Convert to a set for quick lookup
const missingSet = new Set(missing);

const result = {};

for (const d of destinations) {
  if (missingSet.has(d.name)) {
    const reg = COUNTRY_REGISTRY[d.country] || {
      landmarks: ["역사적인 정취가 묻어나는 중심 광장", "전망 좋은 도심 공원", "상징적인 랜드마크", "트렌디한 감성 거리"],
      foods: ["로컬 시그니처 요리", "현지인 추천 맛집", "달콤한 로컬 디저트", "아름다운 야경 식당"]
    };
    
    // Attempt to get base coordinates
    const baseCoords = getCityCoordinates(d.name, d.country) || [35, 127]; // fallback

    // Make some realistic POIs based on the registry
    result[d.name] = [];
    
    const timeOfDays = [["morning"], ["afternoon"], ["lunch"], ["dinner", "night"]];
    const zones = ["center", "east", "west", "north"];
    const cats = ["attraction", "attraction", "restaurant", "restaurant"];
    const icons = ["🏛️", "🌳", "🍽️", "🍷"];
    
    for (let i=0; i<4; i++) {
      const isFood = (i >= 2);
      const nameSource = isFood ? (reg.foods[i%2] || "로컬 식당") : (reg.landmarks[i%2] || "유명 랜드마크");
      // Add slight jitter to coordinates
      const latOffset = (((d.name.charCodeAt(0) + i) * 7) % 20 - 10) * 0.005;
      const lngOffset = (((d.name.charCodeAt(d.name.length-1) + i) * 11) % 20 - 10) * 0.005;
      
      result[d.name].push({
        id: `gen_${d.name}_${i}`,
        name: nameSource,
        category: cats[i],
        coordinates: [baseCoords[0] + latOffset, baseCoords[1] + lngOffset],
        zone: zones[i],
        timeOfDay: timeOfDays[i],
        desc: isFood ? `${d.name}의 풍미를 느낄 수 있는 ${nameSource}입니다.` : `${d.name}의 역사와 문화를 체험할 수 있는 ${nameSource}입니다.`,
        themes: { healing: 3, activity: 2, food: isFood? 5: 1, culture: isFood? 1: 5, shopping: 2 }
      });
    }
  }
}

const fileContent = `export const poiGlobalMissing = ${JSON.stringify(result, null, 2)};\n`;
fs.writeFileSync('src/data/poi/poi_global_missing.js', fileContent, 'utf8');
console.log('Generated global POIs for', Object.keys(result).length, 'cities');
