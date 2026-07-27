import fs from 'fs';

const missing = JSON.parse(fs.readFileSync('missing_global.json', 'utf8'));
const BATCH_SIZE = Math.ceil(missing.length / 10);

const subagents = [];
for (let i = 0; i < missing.length; i += BATCH_SIZE) {
  const batch = missing.slice(i, i + BATCH_SIZE);
  const prompt = `Generate real POI JSON data for these global cities: ${batch.join(', ')}.
Format strictly as a JS module exporting an array of POI objects. Write it to /home/j/Antigravity/travelWeb/poi_global_${i/BATCH_SIZE + 1}.js using the write_to_file tool. Do not do anything else, just generate and write the file. The objects should have: id, city, name, category, coordinates: [lat, lng], zone, timeOfDay, desc, themes. Each city should have exactly 2-3 REAL POIs (actual landmarks or restaurants).`;
  subagents.push({
    TypeName: "self",
    Role: `Global POI Writer ${i/BATCH_SIZE + 1}`,
    Prompt: prompt,
    Model: "pro", // use pro for large context
    Workspace: "inherit"
  });
}

fs.writeFileSync('subagents_10.json', JSON.stringify(subagents, null, 2), 'utf8');
console.log('Created payload for 10 agents');
