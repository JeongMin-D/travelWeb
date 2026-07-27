import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// We need to parse batches.json to know the exact list of expected cities
const batchesFile = '/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/scratch/batches.json';
const dbFile = '/home/j/Antigravity/travelWeb/src/data/poi/poi_global_massive.js';

const batchesData = JSON.parse(fs.readFileSync(batchesFile, 'utf8'));
let expectedCities = [];
for (let i = 0; i < batchesData.length; i++) {
    const batch = batchesData[i];
    if (batch) {
        expectedCities.push(...batch);
    }
}

console.log(`Total Expected Cities: ${expectedCities.length}`);

// Load the generated dictionary manually (since it's an export)
const data = fs.readFileSync(dbFile, 'utf8');
const jsonStr = data.replace('export const poiGlobalMassive = ', '').replace(/;\s*$/, '');
let actualDb = {};
try {
    actualDb = JSON.parse(jsonStr);
} catch (e) {
    console.error("Error parsing poi_global_massive.js", e.message);
    process.exit(1);
}

let missingCities = [];
let incompleteCities = [];
let emptyCities = [];

expectedCities.forEach(city => {
    if (!actualDb[city]) {
        missingCities.push(city);
    } else {
        const len = actualDb[city].length;
        if (len === 0) {
            emptyCities.push(city);
        } else if (len < 10) {
            incompleteCities.push(`${city} (${len} POIs)`);
        }
    }
});

console.log(`\n--- Verification Report ---`);
console.log(`Total Valid Cities in DB: ${Object.keys(actualDb).length}`);
console.log(`Missing Cities: ${missingCities.length}`);
if (missingCities.length > 0) console.log(missingCities.join(', '));

console.log(`\nEmpty Cities (0 POIs): ${emptyCities.length}`);
if (emptyCities.length > 0) console.log(emptyCities.join(', '));

console.log(`\nIncomplete Cities (< 10 POIs): ${incompleteCities.length}`);
if (incompleteCities.length > 0) console.log(incompleteCities.join(', '));
