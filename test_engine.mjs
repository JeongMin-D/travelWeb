import { buildDynamicItinerary } from './src/utils/itineraryEngine.js';

console.log("--- UIJEONGBU ITINERARY ---");
const uijeongbu = buildDynamicItinerary('의정부', '대한민국', 'food', 3);
console.log(JSON.stringify(uijeongbu, null, 2));

console.log("\n--- UGANDA ITINERARY ---");
const uganda = buildDynamicItinerary('우간다', '우간다', 'healing', 3);
console.log(JSON.stringify(uganda, null, 2));
