import fs from 'fs';

const dests = fs.readFileSync('src/data/destinations.js', 'utf8');
const poiDB = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');

// Extract all city names from destinations.js
const cityRegex = /name:\s*['"](.+?)['"]/g;
const allCities = new Set();
let match;
while ((match = cityRegex.exec(dests)) !== null) {
  allCities.add(match[1]);
}

// See which ones are defined in our POI files
// We can just check if the city name appears as a key in any of the POI files in src/data/poi
const poiDir = 'src/data/poi';
const poiFiles = fs.readdirSync(poiDir);
const definedCities = new Set();

// Also check cityPoiDatabase.js for direct keys like "교토":
const dbRegex = /"([^"]+)":\s*\[/g;
while ((match = dbRegex.exec(poiDB)) !== null) {
    definedCities.add(match[1]);
}

for (const file of poiFiles) {
  const content = fs.readFileSync(`${poiDir}/${file}`, 'utf8');
  const cityKeyRegex = /"([^"]+)":\s*\[/g;
  while ((match = cityKeyRegex.exec(content)) !== null) {
    definedCities.add(match[1]);
  }
}

const missing = [...allCities].filter(c => !definedCities.has(c));
console.log('Total cities:', allCities.size);
console.log('Missing POI cities:', missing.length);
console.log('Missing list:', JSON.stringify(missing));
