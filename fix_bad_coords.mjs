import fs from 'fs';
import https from 'https';

const filesToFix = [
  'src/data/poi/poi_domestic_missing.js',
  'src/data/poi/poi_deep_korea_others.js',
  'src/data/poi/poi_global_others.js'
];

async function geocode(city) {
  return new Promise((resolve) => {
    // some cities have english names in destinations.js, let's just use Korean name as fallback, Nominatim is good at it
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'TravelWeb/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.length > 0) {
            resolve([parseFloat(json[0].lat), parseFloat(json[0].lon)]);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const cityCoordsCache = {};
  
  for (const file of filesToFix) {
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');
    const fileMatch = content.match(/export const ([A-Za-z0-9_]+) = (\{[\s\S]*\}\s*);\s*$/);
    if (!fileMatch) continue;
    
    const varName = fileMatch[1];
    const data = eval('(' + fileMatch[2] + ')');
    
    let updated = false;
    
    for (const city in data) {
      // Check if coordinates are undefined
      let needsFix = false;
      for (const poi of data[city]) {
        if (!poi.coordinates || poi.coordinates[0] === undefined || poi.coordinates[0] === null) {
          needsFix = true;
          break;
        }
      }
      
      if (needsFix) {
        let coords = cityCoordsCache[city];
        if (!coords) {
          console.log('Geocoding', city, '...');
          coords = await geocode(city);
          await new Promise(r => setTimeout(r, 1100)); // Respect Nominatim 1 request/sec limit
          if (!coords) {
            console.log('Failed to geocode', city, 'using fallback [35.0, 135.0]');
            coords = [35.0, 135.0];
          }
          cityCoordsCache[city] = coords;
        }
        
        // Update POIs
        data[city].forEach((poi, index) => {
          // spiral or diagonal offset
          const offsetLat = (index % 3 === 0 ? 1 : -1) * (index * 0.002);
          const offsetLng = (index % 2 === 0 ? 1 : -1) * (index * 0.002);
          poi.coordinates = [coords[0] + offsetLat, coords[1] + offsetLng];
        });
        updated = true;
      }
    }
    
    if (updated) {
      const out = `export const ${varName} = ${JSON.stringify(data, null, 2)};\n`;
      fs.writeFileSync(file, out, 'utf8');
      console.log('Fixed coordinates in', file);
    }
  }
}

run();
