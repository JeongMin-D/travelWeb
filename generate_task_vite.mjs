import fs from 'fs';
import { destinations } from './src/data/destinations.js';

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

// Group by country
const grouped = {};
for (const d of destinations) {
  const country = d.country;
  if (!grouped[country]) grouped[country] = [];
  grouped[country].push(d.name);
}

let md = '# 🌍 글로벌 194개 도시 POI 마이그레이션 현황\n\n';
for (const country in grouped) {
  md += '## ' + country + '\n';
  for (const city of grouped[country]) {
    const checked = definedCities.has(city) ? '[x]' : '[ ]';
    md += '- `' + checked + '` ' + city + '\n';
  }
  md += '\n';
}

fs.writeFileSync('task.md', md, 'utf8');
console.log('Success, wrote', Object.keys(grouped).length, 'countries');
