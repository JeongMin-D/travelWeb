import re
import os
import json

with open('src/data/destinations.js', 'r', encoding='utf-8') as f:
    dests = f.read()

# Extract defined cities
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

country_arrays = re.findall(r'\"([^\"]+)\":\s*\[(.*?)\]', dests, re.DOTALL)

md = '# 🌍 글로벌 194개 도시 POI 마이그레이션 현황\n\n'

countries = ["대한민국", "일본", "중국", "대만", "미국", "캐나다", "프랑스", "이탈리아", "영국", "스페인", "독일", "호주", "베트남", "태국", "인도네시아", "싱가포르", "필리핀", "말레이시아", "터키", "아랍에미리트", "홍콩", "마카오", "캄보디아", "라오스", "스리랑카", "인도", "네팔", "몽골", "몰디브", "우즈베키스탄", "스위스", "오스트리아", "체코", "헝가리", "폴란드", "그리스", "크로아티아", "네덜란드", "벨기에", "포르투갈", "스웨덴", "노르웨이", "덴마크", "핀란드", "아일랜드", "뉴질랜드", "모로코", "남아프리카공화국", "케냐", "이집트", "페루", "칠레", "아이슬란드", "탄자니아", "나미비아", "보츠와나", "르완다", "에티오피아", "가나", "세네갈", "튀니지", "모리셔스", "세이셸", "잠비아", "짐바브웨", "우간다"]

# Track processed countries so we only process each country once!
processed_countries = set()

for match in country_arrays:
    country = match[0]
    items_str = match[1]
    
    if country not in countries:
        continue
    if country in processed_countries:
        continue
        
    items = re.findall(r'\"([^\"]+)\"', items_str)
    if not items: continue
    
    processed_countries.add(country)
    md += f'## {country}\n'
    for city in items:
        checked = '[x]' if city in defined_cities else '[ ]'
        md += f'- `{checked}` {city}\n'
    md += '\n'

with open('task.md', 'w', encoding='utf-8') as f:
    f.write(md)
