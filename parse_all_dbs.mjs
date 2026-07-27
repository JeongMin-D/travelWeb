import fs from 'fs';

const dbContent = fs.readFileSync('src/data/cityPoiDatabase.js', 'utf8');
const imports = [...dbContent.matchAll(/import \{ ([^}]+) \} from '\.\/poi\/([^']+)'/g)];

const finalDb = {};

for (const match of imports) {
  const file = `src/data/poi/${match[2]}.js`;
  if (!fs.existsSync(file)) continue;
  
  const content = fs.readFileSync(file, 'utf8');
  const arrMatches = [...content.matchAll(/"([^"]+)": \s*\[([\s\S]*?)\]/g)];
  for (const m of arrMatches) {
    const city = m[1];
    const arrayContent = m[2];
    finalDb[city] = arrayContent;
  }
}

// Check dummy data
let dummyCount = 0;
for (const [city, content] of Object.entries(finalDb)) {
  if (content.includes('시그니처') || content.includes('유명 랜드마크') || content.includes('필수 관광지') || content.includes('대표 명소')) {
    dummyCount++;
  }
}

console.log('Total cities in finalDb:', Object.keys(finalDb).length);
console.log('Dummy count in finalDb:', dummyCount);

