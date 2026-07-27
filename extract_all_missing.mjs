import fs from 'fs';

const lines = fs.readFileSync('/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/task.md', 'utf8').split('\n');
const missing = [];
for (const line of lines) {
  if (line.includes('[ ]')) {
    const city = line.split('\`[ ]\` ')[1].trim();
    missing.push(city);
  }
}
console.log('Total missing globally:', missing.length);
fs.writeFileSync('missing_global.json', JSON.stringify(missing), 'utf8');
