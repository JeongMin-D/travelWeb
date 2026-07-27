import fs from 'fs';
import { DESTINATIONS } from './src/data/destinations.js';

const poiDB = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');
const definedCities = new Set();
let match;
const dbRegex = /"([^"]+)":\s*\[/g;
while ((match = dbRegex.exec(poiDB)) !== null) definedCities.add(match[1]);

const poiDir = 'src/data/poi';
const poiFiles = fs.readdirSync(poiDir);
for (const file of poiFiles) {
  const content = fs.readFileSync(poiDir + '/' + file, 'utf8');
  const cityKeyRegex = /"([^"]+)":\s*\[/g;
  while ((match = cityKeyRegex.exec(content)) !== null) definedCities.add(match[1]);
}

let md = '# 🌍 글로벌 194개 도시 POI 마이그레이션 현황\n\n';
for (const group of DESTINATIONS) {
  md += '## ' + group.country + '\n';
  for (const city of group.cities) {
    const checked = definedCities.has(city.name) ? '[x]' : '[ ]';
    md += '- `' + checked + '` ' + city.name + '\n';
  }
  md += '\n';
}

console.log(md);
