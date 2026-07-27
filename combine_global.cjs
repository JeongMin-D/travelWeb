const fs = require('fs');
const path = require('path');

let allGlobalPois = {};

for (let i = 1; i <= 8; i++) {
    const p = `/home/j/Antigravity/travelWeb/global_poi_${i}.json`;
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        try {
            const data = JSON.parse(content);
            for (const [city, pois] of Object.entries(data)) {
                allGlobalPois[city] = pois;
            }
            console.log(`Loaded ${Object.keys(data).length} cities from global_poi_${i}.json`);
        } catch (e) {
            console.error(`Error parsing ${p}:`, e.message);
        }
    } else {
        console.error(`File not found: ${p}`);
    }
}

console.log(`Total global cities combined: ${Object.keys(allGlobalPois).length}`);

// Write back to src/data/poi/poi_global_others.js
const outPath = '/home/j/Antigravity/travelWeb/src/data/poi/poi_global_others.js';
const jsContent = `// 글로벌 154개 도시 상세 POI 데이터
// 각 도시별로 엄선된 10개의 명소를 제공합니다. (관광지 2, 공원 1, 액티비티 1, 식당 3, 카페 2, 야경 1)

export const poiGlobalOthers = ${JSON.stringify(allGlobalPois, null, 2)};
`;

fs.writeFileSync(outPath, jsContent, 'utf-8');
console.log('Successfully written to src/data/poi/poi_global_others.js');
