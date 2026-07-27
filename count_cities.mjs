import { destinations, COUNTRY_REGIONS } from './src/data/destinations.js';
console.log('Total in destinations array:', destinations.length);
let totalInRegions = 0;
for (const country in COUNTRY_REGIONS) {
  totalInRegions += COUNTRY_REGIONS[country].length;
}
console.log('Total in COUNTRY_REGIONS:', totalInRegions);
