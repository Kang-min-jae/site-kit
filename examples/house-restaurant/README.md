# 완성본 예시 — house · 음식점 "여울 YEOUL"

> **이 폴더가 house 디렉션의 기준이다.** `design-site` 스킬은 house 사이트를 만들기 전에 이 페이지(코드 + `shots/` 캡처)를 먼저 본다.
> 여울은 가상의 가게다. 이름·주소·전화·메뉴·가격은 모두 지어낸 것이고, 사진은 `scripts/render-stills/`로 직접 렌더한 시안 소재다.

## 결정 줄
```
preset=calm · direction=house · mode=light(+dark 섹션 1: 방문 정보)
accent=짙은 병초록 #34432f (한 가지 의미: "계절" 표시)
signature=촛불 아래 정물이 화면 아래에서 드러난다 (Reveal, 첫 화면 1회)
패턴: 랜딩 D형 → EditorialSplit(공간) → DragGallery(식탁) → 메뉴판(10) → 정보(9, 어두운 섹션)
```

## 따라 할 것
- **크기 대비**: 영문 `micro-label`(11) ↔ 한글 명조 `display-xl`(최대 104). 중간 크기는 섹션 제목(`title-lg`→`display-sm`)만.
- **여백 리듬**: 섹션 사이 96~144px, 묶음 안 16~24px. 섹션은 선 1px 또는 바탕 전환으로만 나눈다.
- **정렬선**: `container-wide` 왼쪽 선 하나 + 12열 중 5·6열 시작선. 메뉴 단은 7열(6~12).
- **소재**: 같은 빛 방향(왼쪽 위 따뜻한 빛 + 촛불), 같은 보정(`grade.py`). 첫 화면은 물건을 오른쪽 위로 몰아 글자 자리를 비운 구도.
- **사진과 글을 분리**: 메뉴에는 사진이 없고, 사진은 `DragGallery` 한 줄에만.
- **내용 분리**: 메뉴·시간·주소는 `content.ts`에만.

## 따라 하지 말 것
- 문구, 가게 이름, 메뉴 구성 — 사이트마다 새로 쓴다.
- 이 예시의 시그니처(정물 드러내기)를 다른 사이트에 그대로 쓰기 — 시그니처는 사이트마다 새로 정한다.

## 보는 법
```bash
node scripts/build-example.mjs house-restaurant      # dist/examples/house-restaurant/index.html
node scripts/shoot.mjs dist/examples/house-restaurant/index.html examples/house-restaurant/shots
```
`shots/`의 기준 캡처는 용량을 줄이려고 jpg로 바꿔 넣었다.

## 품질 기준표 자기 평가 (DESIGN.md 13.1)
| 항목 | 점수 | 근거 |
|---|---|---|
| Q1 크기 대비 | 5 | 11px 라벨과 104px 명조 한 줄, 중간 크기는 섹션 제목뿐 |
| Q2 여백 리듬 | 4 | 섹션 간격 96~144로 확실히 멀고 묶음 안은 붙어 있음. 메뉴 묶음 간격이 조금 균일 |
| Q3 정렬선 | 5 | 모든 섹션 글자가 같은 왼쪽 선, 메뉴·방문 정보가 같은 6열 시작선 |
| Q4 소재 | 3 | 색감·빛은 통일됐지만 렌더라서 음식 질감이 단순하다 → **실제 사진이 오면 4~5** |
| Q5 디테일 | 4 | 1px 선, 고정폭 숫자, 넓은 자간 라벨. 버튼 아이콘 정렬은 더 다듬을 여지 |
