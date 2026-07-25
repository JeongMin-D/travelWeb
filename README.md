# VOYAGE Travel Planner

여행지를 탐색하고, 지도 위 다트로 랜덤 추천을 받고, 일정·예산·방문 기록까지 관리하는 React 기반 여행 플래너입니다.

## 주요 기능

- 859개 도시, 53개국의 여행지 검색과 대륙·국가별 탐색
- 지도 다트 애니메이션 기반 랜덤 여행지 추천
- 1~14일 맞춤 일정, 주변 여행지, 준비물 및 기후 가이드
- 여행 경로 지도와 A4 브로셔 프리뷰·인쇄/PDF 저장
- 예산 추적, 셀프 플래너, 방문 도시 기록
- 한국어/영어 및 라이트/다크 테마 전환

## 기술 스택

- React 19
- Vite 8
- Leaflet 1.9
- Vanilla CSS

## 실행 방법

```bash
npm install
npm run dev
```

검증 및 배포용 빌드:

```bash
npm run lint
npm run build
```

## 프로젝트 구조

```text
src/
├── components/          # 화면과 기능별 React 컴포넌트
├── data/destinations.js # 도시·국가·좌표·번역·추천 일정 데이터
├── App.jsx              # 앱 상태와 탭 전환
└── index.css            # 앱·브로셔·인쇄 스타일

Voyage-Travel-Planner-Vault/
├── 00-Dashboard/        # 현재 상태와 문서 진입점
├── 01-Project/          # 제품 개요·구조·데이터 모델
├── 02-Delivery/         # 개발·변경·문제 이력
├── 03-Planning/         # 실행 계획과 제품 백로그
└── 04-Data/             # 여행지 데이터 관리 기준
```

## 여행지 데이터 관리

신규 도시를 추가할 때는 도시명, 영문명, 국가/대륙, 유효한 지도 좌표, 국가별 추천 정보가 함께 필요합니다. 상세 기준과 점검 목록은 [여행지 데이터 가이드](Voyage-Travel-Planner-Vault/04-Data/Destination%20Data%20Guide.md)에서 확인할 수 있습니다.

## 개발 문서

프로젝트 현황과 다음 작업은 [프로젝트 대시보드](Voyage-Travel-Planner-Vault/00-Dashboard/Project%20Dashboard.md)에서 확인할 수 있습니다.
