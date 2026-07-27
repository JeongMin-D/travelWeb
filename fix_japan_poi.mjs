import fs from 'fs';

for (const file of ['src/data/poi/poi_japan_1.js', 'src/data/poi/poi_japan_2.js']) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Quick and dirty way to parse: it's a JS file exporting an array.
  // We can just strip the export, eval it, transform, and re-write.
  let arrayContent = content.replace(/export (const|let|var) [^=]+ = /, '').replace(/export default[^;]+;?/, '');
  let arr;
  try {
    arr = eval('(' + arrayContent + ')');
  } catch (e) {
    console.error('Failed to parse', file, e);
    continue;
  }
  
  const grouped = {};
  for (const poi of arr) {
    const city = poi.city;
    if (!grouped[city]) grouped[city] = [];
    // Remove the city key from the object since it's now the parent key
    delete poi.city;
    grouped[city].push(poi);
  }
  
  const varName = file.includes('1') ? 'poiJapan1' : 'poiJapan2';
  const newContent = `export const ${varName} = ${JSON.stringify(grouped, null, 2)};\n`;
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('Fixed', file);
}
