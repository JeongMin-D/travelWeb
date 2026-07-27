import fs from 'fs';
import path from 'path';

const scratchDir = '/home/j/Antigravity/travelWeb/scratch';
const outputDir = '/home/j/Antigravity/travelWeb/src/data/poi';
const dbFile = '/home/j/Antigravity/travelWeb/src/data/cityPoiDatabase.js';

let allPoisDict = {};
let missingFiles = [];

// Read all 42 files
for (let i = 1; i <= 42; i++) {
    const file = path.join(scratchDir, `global_poi_${i}.json`);
    if (fs.existsSync(file)) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            if (Array.isArray(data)) {
                // Not expected anymore based on what we saw, but handle if any
                data.forEach(poi => {
                    const cityMatch = poi.id.split('_');
                    if (cityMatch.length >= 2) {
                        const city = cityMatch[1];
                        if (!allPoisDict[city]) allPoisDict[city] = [];
                        allPoisDict[city].push(poi);
                    }
                });
            } else if (typeof data === 'object' && data !== null) {
                // If it's a dictionary mapping city names to arrays
                for (const city in data) {
                    if (Array.isArray(data[city])) {
                        if (!allPoisDict[city]) allPoisDict[city] = [];
                        allPoisDict[city].push(...data[city]);
                    }
                }
            }
        } catch (e) {
            console.error(`Error parsing ${file}: ${e.message}`);
        }
    } else {
        missingFiles.push(i);
    }
}

if (missingFiles.length > 0) {
    console.log(`Waiting for subagents to finish... Missing batches: ${missingFiles.join(', ')}`);
    process.exit(0);
}

const cityCount = Object.keys(allPoisDict).length;
const totalPois = Object.values(allPoisDict).reduce((acc, arr) => acc + arr.length, 0);
console.log(`All 42 batches found! Cities: ${cityCount}, Total POIs generated: ${totalPois}`);

// Merge them into one big dictionary and save as poi_global_massive.js
const fileContent = `export const poiGlobalMassive = ${JSON.stringify(allPoisDict, null, 2)};\n`;
fs.writeFileSync(path.join(outputDir, 'poi_global_massive.js'), fileContent, 'utf8');

// Update cityPoiDatabase.js
let dbContent = fs.readFileSync(dbFile, 'utf8');
if (!dbContent.includes('import { poiGlobalMassive }')) {
    const importStatement = `import { poiGlobalMassive } from './poi/poi_global_massive.js';\n`;
    
    // Inject import at the top
    dbContent = importStatement + dbContent;
}

if (!dbContent.includes('...poiGlobalMassive')) {
    // Inject into CITY_POI_DATABASE
    dbContent = dbContent.replace(
        'export const CITY_POI_DATABASE = {',
        'export const CITY_POI_DATABASE = {\n  ...poiGlobalMassive,'
    );
    
    fs.writeFileSync(dbFile, dbContent, 'utf8');
    console.log('Successfully injected into cityPoiDatabase.js');
} else {
    fs.writeFileSync(dbFile, dbContent, 'utf8');
}

console.log('Data integration complete.');
