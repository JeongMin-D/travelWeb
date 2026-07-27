import fs from 'fs';

const dbPath = 'src/data/cityPoiDatabase.js';
const dbContent = fs.readFileSync(dbPath, 'utf8');

// Find all imports in cityPoiDatabase.js
const imports = [...dbContent.matchAll(/import \{ ([^}]+) \} from '\.\/poi\/([^']+)'/g)];

const allDbKeys = new Set();
let dummyCount = 0;

for (const match of imports) {
  const file = `src/data/poi/${match[2]}.js`;
  if (!fs.existsSync(file)) continue;
  
  const content = fs.readFileSync(file, 'utf8');
  // extract keys (cities)
  const keys = [...content.matchAll(/"([^"]+)": \s*\[/g)].map(m => m[1]);
  for (const key of keys) {
    allDbKeys.add(key);
  }
}

// read destinations.js
const destContent = fs.readFileSync('src/data/destinations.js', 'utf8');
const destMatch = destContent.match(/const compactCitiesByCountry = (\{[\s\S]*?\});/);
const compact = eval('(' + destMatch[1] + ')');

const missingCities = [];
for (const [country, cities] of Object.entries(compact)) {
  for (const city of cities) {
    if (!allDbKeys.has(city)) {
      missingCities.push(city);
    }
  }
}

console.log('Total cities in DB files:', allDbKeys.size);
console.log('Missing from DB files (dummy fallback):', missingCities.length);
console.log('Missing cities:', missingCities.slice(0, 50));
