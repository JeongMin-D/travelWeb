import fs from 'fs';

const dests = fs.readFileSync('src/data/destinations.js', 'utf8');
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

const countryBlocks = dests.split('country:');
for (let i = 1; i < countryBlocks.length; i++) {
  const block = countryBlocks[i];
  const countryMatch = block.match(/^\s*['"]([^'"]+)['"]/);
  if (!countryMatch) continue;
  const country = countryMatch[1];
  
  md += '## ' + country + '\n';
  
  const citiesStrMatch = block.match(/cities:\s*\[([\s\S]*?)\]/);
  if (citiesStrMatch) {
    const citiesStr = citiesStrMatch[1];
    const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
    let nameMatch;
    while ((nameMatch = nameRegex.exec(citiesStr)) !== null) {
      const city = nameMatch[1];
      const checked = definedCities.has(city) ? '[x]' : '[ ]';
      md += '- `' + checked + '` ' + city + '\n';
    }
  }
  md += '\n';
}

fs.writeFileSync('/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/task.md', md);
console.log('task.md generated successfully');
