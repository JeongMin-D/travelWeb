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

for (const d of destinations) {
  if (d.name === '오키나와' || d.country === '일본') {
    console.log(d.name, '=>', definedCities.has(d.name));
  }
}
