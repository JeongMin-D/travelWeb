const fs = require('fs');
const path = require('path');

const batchPaths = [
    '/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/scratch/poi_batch_1.json',
    '/home/j/Antigravity/travelWeb/poi_batch_2.json',
    '/home/j/Antigravity/travelWeb/poi_batch_3.json',
    '/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/scratch/poi_batch_4.json',
    '/home/j/Antigravity/travelWeb/poi_batch_5.json',
    '/home/j/Antigravity/travelWeb/poi_batch_6.json'
];

let allPois = {};

for (const p of batchPaths) {
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        try {
            const data = JSON.parse(content);
            for (const [city, pois] of Object.entries(data)) {
                allPois[city] = pois;
            }
            console.log(`Loaded ${Object.keys(data).length} cities from ${path.basename(p)}`);
        } catch (e) {
            console.error(`Error parsing ${p}:`, e.message);
        }
    } else {
        console.error(`File not found: ${p}`);
    }
}

console.log(`Total cities combined: ${Object.keys(allPois).length}`);

// Write back to src/data/poi/poi_deep_korea_others.js
const outPath = '/home/j/Antigravity/travelWeb/src/data/poi/poi_deep_korea_others.js';
const jsContent = `// 국내 기타 도시 상세 POI 데이터
// 각 도시별로 엄선된 10개의 명소를 제공합니다. (관광지 2, 공원 1, 액티비티 1, 식당 3, 카페 2, 야경 1)

export const poiKoreaOthers = ${JSON.stringify(allPois, null, 2)};
`;

fs.writeFileSync(outPath, jsContent, 'utf-8');
console.log('Successfully written to src/data/poi/poi_deep_korea_others.js');
