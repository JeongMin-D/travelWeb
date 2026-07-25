# 여행지 데이터 가이드

## 현재 데이터 현황

- 911개 도시, 67개국
- 기본 데이터 원본: `src/data/destinations.js`
- 신규 도시는 랜덤 추천, 세계 지도, 일정 생성, 영문 UI에서 모두 노출될 수 있습니다.

## 신규 도시 추가 체크리스트

- [ ] `compactCitiesByCountry`에 도시를 추가했는가?
- [ ] 국가가 신규라면 `COUNTRY_REGISTRY`에 대륙·통화·랜드마크·음식을 추가했는가?
- [ ] `CITY_COORDINATES`에 실제 좌표를 넣었는가? (`[0,0]` 금지)
- [ ] `CITY_ENGLISH_MAPPING`과 `COUNTRY_ENGLISH_MAPPING`을 추가했는가?
- [ ] 주요 도시라면 `CITY_IMAGE_MAP`에 Unsplash 이미지 ID를 등록했는가?
- [ ] 신규 국가라면 `COUNTRY_IMAGE_MAP`에 국가 대표 이미지 ID를 등록했는가?
- [ ] 랜덤 대륙 필터에서 올바른 후보군에 포함되는가?
- [ ] 빌드와 좌표/번역 검사를 통과했는가?

## 이미지 시스템

도시 카드에 표시되는 이미지는 3단 캐스케이드 룩업으로 결정됩니다:

1. **`CITY_IMAGE_MAP`** (~120개 주요 도시): 도시명으로 직접 매핑된 Unsplash 사진 ID
2. **`COUNTRY_IMAGE_MAP`** (67개국): 해당 국가의 대표 풍경/랜드마크 사진 ID
3. **`CONTINENT_IMAGE_MAP`** (6개 대륙): 최종 폴백용 대륙 대표 이미지

### 이미지 URL 형식
```
https://images.unsplash.com/{photo-id}?auto=format&fit=crop&w=600&q=80
```

### 이미지 등록 방법
- [Unsplash](https://unsplash.com)에서 도시/국가 검색 후 사진 ID를 복사
- 사진 ID 형식: `photo-1234567890123-abcdef123456`
- `destinations.js`의 해당 Map 객체에 `"도시명": "photo-id"` 형태로 추가

## 품질 기준

| 항목 | 기준 |
| --- | --- |
| 위치 | 도시/명소 실제 위치와 일치하는 위도·경도 |
| 영문명 | 통용되는 공식 또는 널리 쓰이는 영문 표기 우선 |
| 대륙 | 랜덤 필터 정책과 일치하는 단일 분류 |
| 추천 정보 | 국가 특성을 반영하는 랜드마크·음식 최소 3개 |
| 이미지 | 주요 도시는 도시 고유 이미지, 나머지는 국가 대표 이미지 사용 |
| 중복 | 같은 도시명이라도 다른 국가면 국가 기반 좌표 키를 검토 |

## 검증 명령

```bash
npm run build
npm run lint
```

데이터 변경 후에는 랜덤 추천에서 해당 도시를 선택하고, 지도 핀·영문 결과·일정 생성·이미지 표시까지 확인합니다.
