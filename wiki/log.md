# Wiki Log

위키에서 발생한 모든 작업의 로그입니다.

## [2026-04-09] setup | LLM Wiki 환경 구축
- `GEMINI.md` 스키마 정의 및 `raw/`, `wiki/` 구조 생성.
- 초기 인덱스 및 로그 파일 생성.

## [2026-04-09] ingest | Source: llm-wiki.md
- `raw/llm-wiki.md` 원본 복사.
- `wiki/Source-llm-wiki.md` 요약 페이지 생성.

## [2026-04-09] maint | 날씨 기능 제거
- `public/index.html`에서 날씨 표시부(`#weather`) 및 `weather.js` 스크립트 제거.
- `public/JS/weather.js` 파일 삭제.

## [2026-04-09] ui | 타이틀 중앙 정렬 개선
- `public/index.html` 네비게이션 바 레이아웃 수정.
- `flex-1` 및 더미 요소를 활용하여 `sohyunsoo.com` 타이틀을 화면 중앙에 배치.

## [2026-04-09] deploy | 서버 배포 완료
- `npm run build:css` 실행 후 Firebase Hosting 배포 완료.
- 날씨 기능 제거 및 타이틀 중앙 정렬 사항 실제 서버 반영.
- Hosting URL: https://sohyunsoo-2026.web.app

## [2026-04-09] bugfix | 뒤로가기 검은 화면 현상 수정
- `window.onpageshow` 이벤트를 활용하여 브라우저 '뒤로가기' 시 `blackOverlay` 상태 초기화.
- 전환 효과 후 잔치되던 버튼 이미지 상태 복구 로직 추가 (bfcache 대응).

## [2026-04-09] deploy | 버그 수정 사항 배포 완료
- '뒤로가기 검은 화면' 수정 내역 Firebase Hosting 반영 완료.

## [2026-04-09] bugfix | 뒤로가기 현상 3차 대응 (확정)
- 브라우저 캐시 강제 갱신을 위해 `index.html` 내 스크립트 버전 쿼리(`?v=0409`) 적용.
- `resetTransitionState`에 `transition: none`을 추가하여 뒤로가기 시 딜레이 없는 화면 복구 구현.
- `pageshow`, `load`, `DOMContentLoaded` 모든 단계에서 초기화 보장.
