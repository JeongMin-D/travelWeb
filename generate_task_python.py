import re
import os

with open('src/data/destinations.js', 'r', encoding='utf-8') as f:
    dests = f.read()

# Extract defined cities from POI database
poi_db_path = 'src/data/cityPoiDatabase.js'
with open(poi_db_path, 'r', encoding='utf-8') as f:
    poi_db = f.read()

defined_cities = set()
matches = re.findall(r'\"([^\"]+)\":\s*\[', poi_db)
for m in matches:
    defined_cities.add(m)

poi_dir = 'src/data/poi'
for file in os.listdir(poi_dir):
    if file.endswith('.js'):
        with open(os.path.join(poi_dir, file), 'r', encoding='utf-8') as f:
            content = f.read()
            matches = re.findall(r'\"([^\"]+)\":\s*\[', content)
            for m in matches:
                defined_cities.add(m)

# Find the COUNTRY_CITIES mapping (or equivalent) in destinations.js
# The block is something like:
# export const COUNTRY_CITIES = {
#   "대한민국": ["서울", "부산", ...],

md = '# 🌍 글로벌 194개 도시 POI 마이그레이션 현황\n\n'

# Find the block where country arrays are defined
# Looks like: "베트남": [\n    "하노이", ... \n  ],
blocks = re.findall(r'\"([^\"]+)\":\s*\[(.*?)\]', dests, re.DOTALL)

for b in blocks:
    country = b[0]
    cities_str = b[1]
    
    # We only care about arrays that contain strings (cities), not numbers (coords)
    cities = re.findall(r'\"([^\"]+)\"', cities_str)
    
    # Exclude if it looks like coordinates, foods, landmarks
    if not cities or country in ["type", "landmarks", "foods"] or cities[0] in ["international", "domestic"]:
        continue
        
    # Also skip if it's city mapping like "서울": ["인천", "수원"] -> Wait! How to distinguish?
    # The country arrays have a LOT of cities. The adjacent cities have few.
    # Actually, let's just use the known countries list from earlier.
    pass

# We need a robust way. Let's just run node, mock the imports and console.log the DESTINATIONS!
