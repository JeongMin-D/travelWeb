import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scratchDir = path.join(__dirname, '../scratch');
const targetFile = path.join(__dirname, '../src/data/poi/poi_global_massive.js');

let allPoisDict = {};
let missingFiles = [];

// Read all 42 batch files if present
for (let i = 1; i <= 42; i++) {
    const file = path.join(scratchDir, `global_poi_${i}.json`);
    if (fs.existsSync(file)) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item.city && item.pois) {
                        allPoisDict[item.city] = item.pois;
                    }
                });
            } else if (typeof data === 'object') {
                Object.keys(data).forEach(city => {
                    allPoisDict[city] = data[city];
                });
            }
        } catch (e) {
            console.error(`Error parsing ${file}:`, e.message);
        }
    } else {
        missingFiles.push(`global_poi_${i}.json`);
    }
}

if (missingFiles.length > 0) {
    console.log(`Missing batch files (${missingFiles.length}):`, missingFiles.join(', '));
}

const cityCount = Object.keys(allPoisDict).length;
const totalPois = Object.values(allPoisDict).reduce((acc, arr) => acc + arr.length, 0);
console.log(`Batches processed. Cities: ${cityCount}, Total POIs: ${totalPois}`);

if (cityCount > 0) {
    const fileContent = `export const poiGlobalMassive = ${JSON.stringify(allPoisDict, null, 2)};\n`;
    fs.writeFileSync(targetFile, fileContent, 'utf8');
    console.log(`Saved to ${targetFile}`);
}
