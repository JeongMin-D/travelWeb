import fs from 'fs';
const content = fs.readFileSync('src/data/poi/poi_japan_1.js', 'utf8');
const cityKeyRegex = /"([^"]+)":\s*\[/g;
let match;
const found = [];
while ((match = cityKeyRegex.exec(content)) !== null) {
  found.push(match[1]);
}
console.log('Found in poi_japan_1:', found);
