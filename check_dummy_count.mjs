import fs from 'fs';
import { CITY_POI_DATABASE, getCityPOIs } from './src/data/cityPoiDatabase.js';
import { compactCitiesByCountry } from './src/data/destinations.js';

let dummyCount = 0;
let realCount = 0;
let dummyCities = [];

for (const [country, cities] of Object.entries(compactCitiesByCountry)) {
  for (const city of cities) {
    const pois = getCityPOIs(city, country);
    if (!pois || pois.length === 0) {
      dummyCount++;
      dummyCities.push(city);
    } else {
      // Check if it's dummy data
      const firstPoi = pois[0];
      if (firstPoi.name.includes('시그니처') || firstPoi.name.includes('전통 수목원') || firstPoi.name.includes('랜드마크')) {
        dummyCount++;
        dummyCities.push(city);
      } else {
        realCount++;
      }
    }
  }
}

console.log('Dummy count:', dummyCount);
console.log('Real count:', realCount);
console.log('Sample dummy cities:', dummyCities.slice(0, 50));
