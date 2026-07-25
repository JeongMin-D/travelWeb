# 구조와 데이터 모델

## 코드 구조

| 영역 | 주요 위치 | 역할 |
| --- | --- | --- |
| 앱 상태/탭 | `src/App.jsx` | 언어, 테마, 선택 여행지, 탭 전환 |
| 여행지 데이터 | `src/data/destinations.js` | 도시·국가·좌표·번역·일정 생성 규칙 |
| 랜덤 추천 | `src/components/Randomizer.jsx` | 후보 필터, 다트 애니메이션, 지도 범위 |
| 지도/일정 | `WorldMap.jsx`, `ItineraryViewer.jsx` | 탐색 지도와 일정별 경로 |
| 사용자 기록 | `BudgetTracker.jsx`, `VisitedTracker.jsx`, `ManualPlanner.jsx` | 브라우저 로컬 저장소 기반 개인 기록 |

## 여행지 데이터 흐름

```text
COUNTRY_REGISTRY + compactCitiesByCountry
        ↓
standardDirectory → processedStandard
        ↓
destinations
        ↓
검색 / 랜덤 추천 / 지도 / 일정 생성
```

## 도시 레코드의 필수 정보

- 식별: `id`, `name`, `englishName`, `country`, `continent`, `type`
- 지도: `CITY_COORDINATES[name]`의 유효 위도·경도
- 추천: 국가별 `landmarks`, `foods`, 통화 정보와 생성 일정
- 다국어: `CITY_ENGLISH_MAPPING`, `COUNTRY_ENGLISH_MAPPING`

`[0, 0]`은 실패 좌표 표식이므로 지도에 사용하면 안 됩니다. 상세 기준은 [[04-Data/Destination Data Guide|여행지 데이터 가이드]]를 따릅니다.
