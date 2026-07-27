import fs from 'fs';

let content = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');

if (!content.includes('poiGlobalMissing')) {
  // Add imports
  content = content.replace(
    "import { poiJapan2 } from './poi/poi_japan_2';",
    "import { poiJapan2 } from './poi/poi_japan_2';\nimport { poiGlobalMissing } from './poi/poi_global_missing';"
  );
  
  // Add to ALL_RAW_POIS
  content = content.replace(
    "...poiJapan2",
    "...poiJapan2,\n  ...poiGlobalMissing"
  );
  
  fs.writeFileSync('src/data/cityPoiDatabase.js', content, 'utf8');
  console.log('patched database with global');
} else {
  console.log('already patched');
}
