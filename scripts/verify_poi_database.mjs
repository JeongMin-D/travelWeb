import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, '../src/data/poi/poi_global_massive.js');
const destinationsFile = path.join(__dirname, '../src/data/destinations.js');

const dbData = fs.readFileSync(dbFile, 'utf8');
const jsonStr = dbData.replace('export const poiGlobalMassive = ', '').replace(/;\s*$/, '');
const actualDb = JSON.parse(jsonStr);

// Extract city names from destinations.js
const destContent = fs.readFileSync(destinationsFile, 'utf8');
const cityMatches = destContent.matchAll(/name:\s*['"]([^'"]+)['"]/g);
const allDestCities = new Set();
for (const match of cityMatches) {
    allDestCities.add(match[1]);
}

const dbCities = Object.keys(actualDb);
const validCities = dbCities.filter(c => actualDb[c] && actualDb[c].length >= 10);
const incompleteCities = dbCities.filter(c => actualDb[c] && actualDb[c].length < 10);
const emptyCities = dbCities.filter(c => !actualDb[c] || actualDb[c].length === 0);

console.log('--- POI Database Verification Report ---');
console.log(`Total Unique Cities in DB: ${dbCities.length}`);
console.log(`Valid Cities (>=10 POIs): ${validCities.length}`);
console.log(`Incomplete Cities (<10 POIs): ${incompleteCities.length}`);
console.log(`Empty Cities (0 POIs): ${emptyCities.length}`);

let totalPois = 0;
dbCities.forEach(c => {
    totalPois += actualDb[c].length;
});
console.log(`Total POIs stored: ${totalPois}`);
