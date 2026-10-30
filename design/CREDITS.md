# CREDITS — 외부 자원과 라이선스

| 자원 | 쓰는 곳 | 라이선스 |
|---|---|---|
| Pretendard (orioncactus) | 기본 글꼴 | SIL Open Font License 1.1 |
| Noto Serif KR (Google) | calm 프리셋 제목 글꼴 | SIL Open Font License 1.1 |
| Tailwind CSS 4 | 스타일 도구 | MIT |
| React | 부품 | MIT |
| esbuild | 평가판 빌드 | MIT |
| Cormorant Garamond (Christian Thalmann) | v0.2 house 워드마크·큰 숫자 | SIL Open Font License 1.1 |
| Instrument Serif (Instrument) | v0.2 editorial 제목·인용 | SIL Open Font License 1.1 |
| Inter Tight (Rasmus Andersson 외) | v0.2 영문 대문자 라벨, object 제목 | SIL Open Font License 1.1 |
| three.js | v0.2 시안 소재 렌더 (`scripts/render-stills/`) | MIT |
| Playwright | v0.2 렌더·캡처 실행 | Apache 2.0 |
| axe-core (Deque) | v0.2 캡처 단계의 접근성 자동 검사 (개발 도구, 사이트에 포함되지 않음) | MPL 2.0 |

- 아이콘(`design/components/icons.tsx`): 이 플레이북에서 직접 그린 단순 도형. 외부 아이콘 세트에서 복사하지 않음.
- 이미지: 부품 평가판은 `ImagePlaceholder`. v0.2 완성본 예시의 사진은 `scripts/render-stills/`로 직접 렌더한 것(외부 모델·텍스처·HDRI 없음) — `examples/house-restaurant/public/stills/CREDITS.md`.
- 예시 문구·상품명·가게(여울): 평가판과 예시를 위해 새로 지어냄.

사이트를 만들 때 추가하는 이미지·글꼴·라이브러리는 이 표에 출처와 라이선스를 적는다.
사이트와 함께 나가는 글꼴·라이브러리의 라이선스 전문은 `scripts/licenses.mjs`로 빌드 때 모아 `/licenses/`로 같이 내보낸다(압축하면 코드 안의 `@license` 주석이 빠진다 — 풀스택 9장). 확인: `node scripts/design-lint.mjs --dist <빌드 폴더>`.
