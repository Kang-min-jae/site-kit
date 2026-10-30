# site-kit — 새 사이트를 시작하는 규칙 묶음

"이 사이트를 이렇게, 이런 느낌으로 만들어줘"를 AI에게 한 번에 맡기기 위한 시작점이다.
**사이트 코드는 없다.** 규칙(풀스택 플레이북 + 디자인 플레이북)과 스킬만 있고, 사이트는 매번 새로 만든다.

## 새 사이트 시작하기

1. GitHub에서 이 저장소의 **Use this template → Create a new repository** (Private 권장)
2. 새 저장소의 `SITE_REQUEST.md`를 채운다 (★ 칸만 채워도 된다)
3. Claude Code(웹 claude.ai/code 또는 터미널)에서 새 저장소를 열고 요청한다:

   > SITE_REQUEST.md대로 사이트를 만들어줘. ★ 칸 중 빈 것만 먼저 물어보고, 끝나면 design-review로 점검해줘.

4. 첫 결과 맨 위의 "결정" 줄(preset·direction·mode·강조색·시그니처·패턴)과 375·1440 캡처를 보고 고칠 것을 말한다
5. 이 README는 새 저장소에서 그 사이트의 README로 바꿔 쓴다

Claude Code는 `CLAUDE.md` → `AGENTS.md`를 자동으로 읽고, `.claude/skills/`의 스킬도 자동으로 쓴다. 따로 "플레이북 읽어"라고 하지 않아도 된다.

## 들어 있는 것

| 파일 | 역할 |
|---|---|
| `AGENTS.md` | **풀스택 규칙 원본** — 21분야 + "왜". 0장은 새 사이트에서 채운다. 20장 작은 사이트(로그인·DB 없음), 21장 외주와 인계 |
| `CLAUDE.md` | `@AGENTS.md` 한 줄 — Claude Code가 AGENTS.md를 읽게 한다 |
| `SITE_REQUEST.md` | 사이트 요청서 빈 양식 (디자인 칸 = `design/brief.md`와 같은 번호, 기능·운영 칸 F1~F14) |
| `CHECKLIST.md` | 단계별 체크리스트 (0, A~N — L 작은 사이트 · M 외주 · N AI 기능) |
| `STACK_MAPPING.md` | 원칙 → 스택별 도구 (Next.js·FastAPI·Node·Django·Rails·Spring) |
| `PROMPTS.md` · `PROMPT_SHORT.md` | 상황별 요청문, 1쪽 요약 (다른 AI 도구·채팅용) |
| `adapters/` | Cursor·Copilot·Claude 전역용 파일 — `node scripts/sync-adapters.mjs`로 만든다, 직접 고치지 않는다 |
| `design/DESIGN.md` | **디자인 규칙 원본** — 바닥(F)·취향(T) 두 층, 원칙, 부품 표, 하지 않을 것, 저작권, 점검표 C1~C24, 품질 기준표 Q1~Q5 |
| `design/tokens.css` | 디자인 값 (Tailwind 4 `@theme`, 역할 이름만) — calm·friendly 프리셋, light·dark, 아트 디렉션 house·editorial·object |
| `design/directions.md` · `typography.md` | 아트 디렉션 3종(쓰는 곳·값·배치 문법·시그니처 자리), 글꼴 짝·영문 라벨 규칙·세부 값 |
| `design/moods.md` · `patterns.md` | 느낌 단어 → 프리셋 고르기, 페이지 패턴 |
| `design/components/` | React 부품 32종 (Button, TextField, Dialog, Dropzone, SpecList … + 쇼케이스 FullBleedMedia·EditorialSplit·MenuList·DragGallery·IndexList·PressQuote·ObjectStage·Reveal + 도구 화면 Segmented·StageBar·PanelSection) |
| `design/LOG.md` | 디자인 평가·사이트별 고친 기록 — 취향이 쌓이는 곳 |
| `design/CREDITS.md` | 글꼴·라이브러리 라이선스 |
| `.claude/skills/` | `design-site` `design-review` `predeploy-check` `external-api` `usage-alert` `copy-audit` `handover` |
| `examples/house-restaurant/` | house 디렉션 완성본 예시(가상 음식점) — AI가 같은 디렉션 사이트를 만들기 전에 먼저 본다 |
| `scripts/check-contrast.mjs` | 글자·배경 대비(WCAG) 검사 — 프리셋·디렉션·밝은 페이지 안 어두운 섹션까지 |
| `scripts/design-lint.mjs` | 날것의 값·12px 미만·말투·외부 소재·한글 micro 라벨·시안 소재 남음(`--release`)·글꼴 라이선스(`--dist`) 자동 검사 |
| `scripts/shoot.mjs` | 375·1440 캡처 + 접근성 자동 검사(axe) — 화면 점검 필수 단계 |
| `scripts/licenses.mjs` | 함께 배포되는 글꼴(OFL)·라이브러리(MIT 등) 라이선스 전문을 빌드 때 모아 `public/licenses/`로 — 빌드 명령 앞에 붙인다(풀스택 9장) |
| `scripts/render-stills/` · `build-example.mjs` | 시안 소재 렌더(three.js 정물 + 색감 보정), 완성본 예시 정적 빌드 |
| `docs/SITE_REQUEST_예시.md` | 요청서 작성 예시 |

도구 스크립트에 필요한 개발 패키지(사이트 저장소에서 한 번): `npm i -D playwright axe-core` (캡처·접근성), 시안 소재 렌더까지 쓰면 `three esbuild`. `design-lint`·`check-contrast`는 추가 패키지가 필요 없다.

부품은 React + Tailwind 4 기준이다. 다른 프레임워크면 `tokens.css`와 `DESIGN.md` 규칙은 그대로 쓰고 부품만 옮겨 만든다.

## 키트 키우기 (사이트를 하나 끝낼 때마다)

사이트에서 고친 것은 그 사이트에만 두지 말고 이 저장소로 올린다. 사이트 저장소에서 Claude Code에 이렇게 요청하면 된다:

> 이 프로젝트에서 키트에 올릴 것을 정리해서 site-kit에 PR을 만들어줘. 프로젝트 전용 이름·값은 빼고, 비밀 값은 절대 넣지 마.

- 새로 겪은 사고 → `AGENTS.md` 해당 장에 규칙 + "왜:" 한 줄. **(예)** 규칙을 실제로 겪으면 "왜:"를 붙이고 (예)를 뗀다
- 새 부품 → `design/components/` + `DESIGN.md` 5장 표 + `index.ts`
- 디자인 평가·고친 이유 → `design/LOG.md`
- 새 스택에서 쓴 도구 → `STACK_MAPPING.md`
- `PROMPT_SHORT.md`를 고쳤으면 `node scripts/sync-adapters.mjs`

## 버전

- 풀스택 규칙 **v3** (2026-10-30): 20 작은 사이트 · 21 외주와 인계 · 18 AI 보강 · 9 소재 라이선스 · `handover` 스킬
- 디자인 플레이북 **v0.2.1** (2026-10-30): 바닥/취향 두 층 · 아트 디렉션 · 타이포 · 쇼케이스 부품 · 시안 소재 · 움직임 2단계 · 캡처 필수 + 품질 기준표 · `design-lint` · 접근성 자동 검사. v0.2의 CreditList는 SpecList로, `layout="center"`는 SiteHeader `brandAlign="center"`로 합쳤다
  - 같은 날 Auto-BIM을 이 판으로 다시 만들며 추가: 도구 화면 부품(`Segmented`·`StageBar`·`PanelSection`, `SpecList layout="row"`, `Checkbox size="sm"`, `Dialog size="xl"`), patterns C형 "무대 + 패널", 부품 평가 2차 반영(첫 화면 주 버튼 md, PressQuote 순서), `scripts/licenses.mjs`

## 꼭 지킬 것

- **비밀 값을 넣지 않는다.** 비밀번호·API 키·DB 주소·토큰은 어떤 파일에도. 필요한 설정은 이름 목록만 (`.env.example`)
- **참고 사이트는 원칙만.** 이미지·로고·아이콘·브랜드 색·글꼴·문구·배치·코드·대표 효과를 옮기지 않는다. 기록에는 회사 이름 없이 번호와 종류만 남긴다 (`design/DESIGN.md` 12장)

## 지금까지 만든 사이트

| 사이트 | 시작 | 키트에 남긴 것 |
|---|---|---|
| (영화 리뷰 사이트) | — | 풀스택 규칙의 "왜:" 대부분 |
| 도면3D → Auto-BIM (캡스톤, 프론트) | 2026-10 | 부품 Dropzone·SpecList·ProgressBar, 6장 "오래 걸리는 작업은 대기열" (예), STACK_MAPPING FastAPI 메모, patterns C형 무대형 · 2026-10-30 v0.2.1로 다시 만들며: 도구 화면 부품 6종, C형 "무대 + 패널", 9장 "라이선스 모아 배포" + `licenses.mjs`, design-site "다시 만들 땐 행동 목록 대조" |
