import fs from 'fs';

(async () => {
  for (const [file, varName] of [['src/data/poi/poi_japan_1.js', 'poiJapan1'], ['src/data/poi/poi_japan_2.js', 'poiJapan2']]) {
    const mod = await import('./' + file);
    const arr = mod[varName] || mod.default;
    
    const grouped = {};
    for (const poi of arr) {
      const city = poi.city;
      if (!grouped[city]) grouped[city] = [];
      delete poi.city;
      grouped[city].push(poi);
    }
    
    const newContent = `export const ${varName} = ${JSON.stringify(grouped, null, 2)};\n`;
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
  }
})();
