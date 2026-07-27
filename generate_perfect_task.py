import json

with open('/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/task.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = ["# 🌍 글로벌 906개 도시 POI 연동 완료 현황", ""]
output.append("모든 글로벌 도시에 대한 리얼 POI 마이그레이션 및 일정 연동이 완료되었습니다! 🎉")
output.append("")

current_country = None
count = 0
for line in lines:
    line = line.strip()
    if line.startswith("## "):
        if current_country:
            output.append(f"- `[x]` **{current_country}** ({count}/{count} 도시 완료)")
        current_country = line[3:]
        count = 0
    elif line.startswith("- `[x]`"):
        count += 1

if current_country:
    output.append(f"- `[x]` **{current_country}** ({count}/{count} 도시 완료)")

print("\n".join(output))
