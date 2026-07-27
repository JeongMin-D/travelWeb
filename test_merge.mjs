import fs from 'fs';

const files = Array.from({length: 10}, (_, i) => `src/data/poi/poi_global_${i+1}.js`);
let allValid = true;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // very basic check to see if it exports an array and ends properly
    if (!content.includes('export const POI_GLOBAL') && !content.includes('export const poiGlobal')) {
      console.error(file, 'missing export');
      allValid = false;
    }
    if (!content.trim().endsWith(';')) {
      console.warn(file, 'might be truncated (does not end with semicolon)');
    }
  } catch(e) {
    console.error(file, 'failed to read');
    allValid = false;
  }
}
if (allValid) console.log('All files look structurally okay.');
