# Daum Graphic Generator

디자인팀 기초 그래픽(75종) 무드를 유지하며 아이콘을 검색·생성·아카이빙하는 도구.

- 갤러리(웹): https://pages.github.kakaocorp.com/halo-axz/icon-prompt-kit/ (사내) · https://axz-halo.github.io/icon-prompt-kit/ (공개 미러)
- **AI 생성은 로컬 실행이 필요합니다** — timely 라우터가 아직 브라우저 직접 호출(CORS)을 허용하지 않아서입니다.

## 팀원 시작하기 (macOS, 3단계)

1. 이 저장소를 클론(또는 ZIP 다운로드 후 압축 해제)
2. **`start.command` 더블클릭** — 최초 1회 API 키를 물어봅니다
   (키 발급: https://stg.timelyai.io/upstage → 설정 → 기능 → 타임리 라우터)
3. 자동으로 열리는 http://localhost:8787 에서 모델 고르고 생성

> 키는 내 컴퓨터의 `timely.key` 파일에만 저장되며(.gitignore) 커밋되지 않습니다.
> 터미널을 닫으면 서버가 종료됩니다. 다시 쓸 때 start.command만 다시 실행하세요.
> "확인되지 않은 개발자" 경고가 뜨면: 우클릭 → 열기.

## 어떤 모델을 쓰나요?

2026-07-16 동일 주제(돛단배) 실측 벤치마크 기준, 셀렉터에 추천 순으로 정렬돼 있습니다:

| 모델 | 판정 |
|---|---|
| **claude-opus-4-8** ⭐ | 무드·규격 최상, ~6초 — 기본 추천 |
| claude-sonnet-4-6 ⭐ | 형태 정확, 디테일 다소 얇음 |
| claude-haiku-4-5 | 빠르지만 형태 왜곡 잦음 |
| gpt-5.4 | 규격 통과, 무드 이탈 경향 |
| gemini-3.5-flash · deepseek-v4-pro | SVG 출력 불안정 — 비추천 |

## 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 갤러리 + 생성 UI (단일 페이지) |
| `engine.js` | 로컬 생성 엔진 — 모티프 24종 + 스타일 문법 폴백 |
| `data.js` | 79종 프롬프트·이미지 매핑 정본 (실물 전수 검증) |
| `proxy.py` | 로컬 실행기 — 사이트 서빙 + `/v1` 라우터 프록시 + 키 자동 주입 |
| `start.command` | 더블클릭 실행기 (최초 키 설정 포함) |
| `img/ svg/` | 원본 레퍼런스 (주의: 원본 PNG는 파일명 셔플 — data.js 매핑이 정답) |

## 아카이브 → 정식 편입

생성 결과의 [보관] → Archive 탭(브라우저 저장) → [보관함 내보내기]로 JSON을 만들어
관리자에게 전달하면 검수 후 `data.js` 정식 세트로 편입됩니다.

## 라우터 CORS가 열리면

라우터팀에 `/v1/*` CORS 허용(OPTIONS 204, `Access-Control-Allow-Origin`,
`Allow-Headers: Authorization, Content-Type, X-Mock*`, `Expose-Headers: X-Provider`)을 요청해 두었습니다.
적용되면 로컬 실행기 없이 웹 배포본에서 바로 AI 생성이 동작합니다.
