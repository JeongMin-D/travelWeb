import fs from 'fs';

let allPois = {};

for (let i = 1; i <= 10; i++) {
  const file = `src/data/poi/poi_global_${i}.js`;
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract the array using regex
  const match = content.match(/export const [A-Za-z0-9_]+ = (\[[\s\S]*\]);?/);
  if (!match) {
    console.error(`Failed to parse ${file}`);
    continue;
  }
  
  try {
    // using eval to parse the array of objects (it's safe here since we generated it)
    const array = eval(match[1]);
    for (const poi of array) {
      if (!allPois[poi.city]) {
        allPois[poi.city] = [];
      }
      allPois[poi.city].push(poi);
    }
  } catch(e) {
    console.error(`Error evaluating ${file}:`, e.message);
  }
}

// Convert allPois to a string
let out = 'export const poiGlobalMissing = {\n';
for (const [city, pois] of Object.entries(allPois)) {
  out += `  "${city}": ${JSON.stringify(pois, null, 2)},\n`;
}
out += '};\n';

fs.writeFileSync('src/data/poi/poi_global_missing.js', out, 'utf8');
console.log('Successfully combined all POIs into poi_global_missing.js');
