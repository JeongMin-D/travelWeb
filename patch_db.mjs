import fs from 'fs';

let content = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');

if (!content.includes('poiJapan1')) {
  // Add imports
  content = content.replace(
    "import { poiDomesticMissing } from './poi/poi_domestic_missing';",
    "import { poiDomesticMissing } from './poi/poi_domestic_missing';\nimport { poiJapan1 } from './poi/poi_japan_1';\nimport { poiJapan2 } from './poi/poi_japan_2';"
  );
  
  // Add to ALL_RAW_POIS
  content = content.replace(
    "...poiDomesticMissing",
    "...poiDomesticMissing,\n  ...poiJapan1,\n  ...poiJapan2"
  );
  
  fs.writeFileSync('src/data/cityPoiDatabase.js', content, 'utf8');
  console.log('patched database');
} else {
  console.log('already patched');
}
