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

const missingDomestic = [];
const missingInternational = [];

for (const d of destinations) {
  if (!definedCities.has(d.name)) {
    if (d.type === 'domestic') {
      missingDomestic.push(d.name);
    } else {
      missingInternational.push(d.name);
    }
  }
}

console.log('Missing Domestic (' + missingDomestic.length + '):', missingDomestic.join(', '));
console.log('Missing International (' + missingInternational.length + '):', missingInternational.join(', '));
