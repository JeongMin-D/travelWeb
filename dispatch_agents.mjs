import fs from 'fs';

const missing = JSON.parse(fs.readFileSync('missing_global.json', 'utf8'));
const BATCH_SIZE = 20;

const subagents = [];
for (let i = 0; i < missing.length; i += BATCH_SIZE) {
  const batch = missing.slice(i, i + BATCH_SIZE);
  const prompt = `Generate real POI JSON data for these global cities: ${batch.join(', ')}.
Format strictly as a JS module exporting an array of POI objects. Write it to /home/j/Antigravity/travelWeb/poi_global_${i/BATCH_SIZE + 1}.js using the write_to_file tool. Do not do anything else, just generate and write the file. The objects should have: id, city, name, category, coordinates: [lat, lng], zone, timeOfDay, desc, themes. Each city should have exactly 3 POIs.`;
  subagents.push({
    TypeName: "self",
    Role: `Global POI Writer ${i/BATCH_SIZE + 1}`,
    Prompt: prompt,
    Model: "flash",
    Workspace: "inherit"
  });
}

console.log(JSON.stringify(subagents, null, 2));
fs.writeFileSync('subagents_payload.json', JSON.stringify(subagents), 'utf8');
