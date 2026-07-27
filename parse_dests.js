import fs from 'fs';
const text = fs.readFileSync('src/data/destinations.js', 'utf8');

// Find DESTINATIONS
const start = text.indexOf('export const DESTINATIONS = [');
const end = text.indexOf('export const WIKI_TAGLINE_KO');
const block = text.slice(start, end);

const dests = [];
let currentCountry = null;
let currentCities = [];

const lines = block.split('\n');
for (const line of lines) {
  const countryMatch = line.match(/country:\s*["']([^"']+)["']/);
  if (countryMatch) {
    if (currentCountry) {
      dests.push({ country: currentCountry, cities: currentCities });
    }
    currentCountry = countryMatch[1];
    currentCities = [];
  }
  
  const cityMatch = line.match(/name:\s*["']([^"']+)["']/);
  if (cityMatch && currentCountry) {
    currentCities.push(cityMatch[1]);
  }
}
if (currentCountry) {
  dests.push({ country: currentCountry, cities: currentCities });
}

// read pois
const poiDB = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');
const definedCities = new Set();
let match;
const dbRegex = /"([^"]+)":\s*\[/g;
while ((match = dbRegex.exec(poiDB)) !== null) definedCities.add(match[1]);

const poiDir = 'src/data/poi';
const poiFiles = fs.readdirSync(poiDir);
for (const file of poiFiles) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(poiDir + '/' + file, 'utf8');
  const cityKeyRegex = /"([^"]+)":\s*\[/g;
  while ((match = cityKeyRegex.exec(content)) !== null) definedCities.add(match[1]);
}

let md = '# 🌍 글로벌 194개 도시 POI 마이그레이션 현황\n\n';
for (const group of dests) {
  md += '## ' + group.country + '\n';
  for (const city of group.cities) {
    const checked = definedCities.has(city) ? '[x]' : '[ ]';
    md += '- `' + checked + '` ' + city + '\n';
  }
  md += '\n';
}

fs.writeFileSync('task_final.md', md);
console.log('Done parsing dests');
