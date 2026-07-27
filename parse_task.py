import os
import re

dests_path = 'src/data/destinations.js'
with open(dests_path, 'r', encoding='utf-8') as f:
    dests = f.read()

poi_dir = 'src/data/poi'
defined_cities = set()
for root, _, files in os.walk(poi_dir):
    for file in files:
        if file.endswith('.js'):
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                content = f.read()
                matches = re.findall(r'\"([^\"]+)\":\s*\[', content)
                for m in matches:
                    defined_cities.add(m)

# Parse countries and cities
# Structure: { country: "...", cities: [ { name: "..." }, ... ] }
countries = []
# Find all blocks of { country: ..., cities: [...] }
country_blocks = re.split(r'country:\s*[\'"]([^\'"]+)[\'"]', dests)[1:]
for i in range(0, len(country_blocks), 2):
    country_name = country_blocks[i]
    block_content = country_blocks[i+1]
    
    cities = []
    city_matches = re.findall(r'name:\s*[\'"]([^\'"]+)[\'"]', block_content)
    for c in city_matches:
        cities.append(c)
    
    countries.append({
        'name': country_name,
        'cities': cities
    })

md = '# 🌍 글로벌 194개 도시 POI 마이그레이션 현황\n\n'
for c in countries:
    md += f'## {c["name"]}\n'
    for city in c['cities']:
        checked = '[x]' if city in defined_cities else '[ ]'
        md += f'- `{checked}` {city}\n'
    md += '\n'

with open('/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/task.md', 'w', encoding='utf-8') as f:
    f.write(md)

print("Generated task.md")
