import fs from 'fs';
import path from 'path';

// read cityPoiDatabase.js
const dbContent = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');
const missingContent = fs.readFileSync('src/data/poi/poi_global_missing.js', 'utf8');

const isMissingInDB = dbContent.includes('poiGlobalMissing');
const hasKampalaInMissing = missingContent.includes('캄팔라');

console.log('poiGlobalMissing is imported:', isMissingInDB);
console.log('Kampala is in missing:', hasKampalaInMissing);

