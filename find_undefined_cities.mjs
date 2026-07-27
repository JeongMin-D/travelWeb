import fs from 'fs';

const dbContent = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');
const imports = [...dbContent.matchAll(/import \{ ([^}]+) \} from '\.\/poi\/([^']+)'/g)];

const badFiles = [];
let badCityCount = 0;

for (const match of imports) {
  const file = `src/data/poi/${match[2]}.js`;
  if (!fs.existsSync(file)) continue;
  
  const content = fs.readFileSync(file, 'utf8');
  // eval the export
  const fileMatch = content.match(/export const [A-Za-z0-9_]+ = (\{[\s\S]*\}\s*);\s*$/) 
                 || content.match(/export const [A-Za-z0-9_]+ = (\[[\s\S]*\]\s*);\s*$/);
  
  if (!fileMatch) continue;
  
  try {
    const data = eval('(' + fileMatch[1] + ')');
    let hasBad = false;
    
    // Some are arrays (e.g. poi_japan_1), some are objects
    if (Array.isArray(data)) {
      // It's an array of POIs
      for (const poi of data) {
        if (!poi.coordinates || poi.coordinates[0] === undefined || poi.coordinates[0] === null) {
          hasBad = true;
          break;
        }
      }
      if (hasBad) {
        badFiles.push(file);
        // group by city to count
        const cities = new Set(data.map(p => p.city));
        badCityCount += cities.size;
      }
    } else {
      // It's an object { city: [pois] }
      let localBad = 0;
      for (const city in data) {
        let cityBad = false;
        for (const poi of data[city]) {
          if (!poi.coordinates || poi.coordinates[0] === undefined || poi.coordinates[0] === null) {
            cityBad = true;
            break;
          }
        }
        if (cityBad) localBad++;
      }
      if (localBad > 0) {
        badFiles.push(file);
        badCityCount += localBad;
      }
    }
  } catch (e) {
    console.error('Error eval', file);
  }
}

console.log('Total bad cities:', badCityCount);
console.log('Bad files:', badFiles);
