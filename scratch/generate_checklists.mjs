import fs from 'fs';
import path from 'path';

const reportPath = '/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/scratch/audit_report.json';
const existencePath = '/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/data_existence_checklist.md';
const linkagePath = '/home/j/.gemini/antigravity/brain/476f4a44-0923-4ba3-9f48-4c891ed1a62b/data_linkage_checklist.md';

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Group by Country
const byCountry = {};
for (const item of report) {
  if (!byCountry[item.country]) byCountry[item.country] = [];
  byCountry[item.country].push(item);
}

// 1. Existence Checklist
let exMd = `# 🌍 모든 도시 실제 POI 데이터 존재 여부 체크리스트\n\n`;
exMd += `본 문서는 총 908개 도시에 대해 **실제 관광지/명소(더미 데이터 아님) 데이터가 존재하는지 여부**를 검증합니다.\n\n`;
exMd += `> [!NOTE]\n> - **[x]**: POI 데이터가 1개 이상 존재하여 실제 장소 추천이 가능한 도시\n> - **[ ]**: 실제 데이터가 0개여서 일정이 비어있게 되는 도시\n\n`;

for (const country in byCountry) {
  exMd += `## 📍 ${country}\n`;
  for (const city of byCountry[country]) {
    const hasData = city.poiCount > 0;
    const check = hasData ? '[x]' : '[ ]';
    const status = hasData ? `🟢 존재 (${city.poiCount}개)` : `🔴 데이터 없음`;
    exMd += `- ${check} **${city.city}** | 실제 데이터: ${status}\n`;
  }
  exMd += `\n`;
}
fs.writeFileSync(existencePath, exMd, 'utf8');

// 2. Linkage Checklist
let lnkMd = `# 🔗 모든 도시 데이터 연동(System Linkage) 확인 체크리스트\n\n`;
lnkMd += `본 문서는 추천 일정 엔진(\`itineraryEngine.js\`) 및 데이터베이스(\`cityPoiDatabase.js\`)에 데이터가 **성공적으로 매핑되고 로드되는지 여부**를 검증합니다.\n`;
lnkMd += `더미 데이터 생성 로직이 삭제됨에 따라, 연동된 실제 데이터가 정확하게 시스템을 통과하는지 확인하는 지표입니다.\n\n`;
lnkMd += `> [!NOTE]\n> - **[x]**: 도시 엔드포인트 및 데이터베이스 연동 완료 (시스템 오류 없음)\n> - **[ ]**: 연동 누락 또는 매핑 에러\n\n`;

for (const country in byCountry) {
  lnkMd += `## 📍 ${country}\n`;
  for (const city of byCountry[country]) {
    const isLinked = city.isLinked;
    const check = isLinked ? '[x]' : '[ ]';
    const status = isLinked ? `🟢 시스템 연동 확인됨` : `🔴 시스템 연동 누락`;
    lnkMd += `- ${check} **${city.city}** | 연동 상태: ${status}\n`;
  }
  lnkMd += `\n`;
}
fs.writeFileSync(linkagePath, lnkMd, 'utf8');

console.log("Checklists generated.");
