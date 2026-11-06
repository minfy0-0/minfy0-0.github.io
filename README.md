# 김민서 · Portfolio

생명공학·경영·컴퓨터과학을 공부하며 만든 서비스와 데이터 분석 기록입니다.
각 프로젝트의 문제, 제가 맡은 역할, 선택한 방법과 검증 범위를 정리했습니다.

[포트폴리오 사이트](https://minfy0-0.github.io/)

## 프로젝트

| 프로젝트 | 담은 경험 |
| --- | --- |
| [OPIc AI Speaking Practice](projects/opic-coach.md) | 개인적으로 필요한 연습 도구의 요구사항, 음성·피드백 흐름, 사용자별 기록 설계 및 구현 |
| [Dr. Spot](projects/drspot.md) | 3인 팀에서 모델 학습·평가, 추론 통합, AWS 배포 |
| [ASK1 데이터 통합](projects/ask1-pipeline.md) | 공개 API 수집, Snowflake 적재, 데이터 품질·연결 기준 검증 |
| [서울 카페 시장·입지 분석](projects/seoul-cafe.md) | 지역 코드 정제, 수요·공급 비교 지표, Power BI 대시보드 |

## 사이트 구성

첫 화면의 네 아이콘은 디자인, 개발, 데이터, AI·클라우드 스킬 블록으로 각각 연결됩니다.
개발·데이터 블록을 넓게 배치했고, 각 블록에서 기술을 사용한 프로젝트 기록을 열 수 있습니다.
이름은 Bricolage Grotesque, 한국어 제목과 소개는 SUITE, 긴 본문은 SUIT로 표시합니다.

프로젝트는 데스크톱에서 왼쪽 목록으로, 모바일에서 가로 목록으로 선택합니다.
좌우 화살표와 키보드로도 이동할 수 있습니다. 자동 넘김을 켜면 8초마다 다음 프로젝트가 열립니다.
상단 메뉴는 프로젝트, 스킬, 경험, 연락으로 구성됩니다.

- 첫 화면과 스킬 아이콘은 `_includes/assembly-hero.html`과 `_includes/skill-symbol-paths.html`에서 관리합니다.
- 홈 레이아웃과 글꼴은 `assets/css/assembly-layout.css`와 `assets/css/sculptural-type.css`에서 조정합니다.
- 스킬 내용과 프로젝트 연결은 `_data/skills.yml`, 프로젝트 선택 동작은 `src/project-carousel.js`에서 관리합니다.
- 선택한 시안과 검증 기록은 [DESIGN_BRIEF.md](DESIGN_BRIEF.md)와 [DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md)에 있습니다.

## 로컬 실행

```sh
npm ci
npm run build:home
python -m pip install -r requirements-submission.txt
python scripts/export_submission.py
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

정적 내보내기는 내부 링크, 앵커, 이미지 경로와 대체 텍스트, 언어별 연결을 확인합니다.
GitHub Pages는 Jekyll 원본과 미리 빌드한 자산을 사용하므로 Node 빌드 없이 배포할 수 있습니다.
기존 검색 제외 설정은 유지합니다. 이메일과 지원 방향 문구는 사용자 요청에 따라
비워두고, 확정 전까지 페이지에 자리표시자나 비활성 버튼을 표시하지 않습니다.
현재 연락 경로는 GitHub이며, 이메일은 주소를 확정한 뒤 조건부로 표시합니다.

공개 포트폴리오에서는 OPIc 프로젝트를 작업 기록과 실제 화면으로 소개합니다. `_config.yml`의 `project_live_urls.opic-coach` 값은 비워 둡니다.

## 출처

[Agency Jekyll Theme](https://github.com/raviriley/agency-jekyll-theme)를 바탕으로 개인화했습니다.
원본 테마의 MIT 라이선스는 [LICENSE.txt](LICENSE.txt)에 있습니다. SUIT는 SIL Open Font License로
사용하며, 고지와 라이선스는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 및
[SUIT-LICENSE.txt](assets/fonts/SUIT-LICENSE.txt)에 있습니다. 과거 3D 실험의 Three.js 고지도 유지합니다.
이전 히어로 시안은 [HERO.md](HERO.md), 과거 기업 제출 버전은 [SUBMISSION.md](SUBMISSION.md)에 기록했습니다.

## 한국어·영어

오른쪽 아래의 독립된 KR / EN 전환기로 언어를 선택합니다. 한국어는 `/`, 영어는 `/en/`이며,
각 상세 페이지에도 대응하는 언어 링크가 있습니다. 전환기는 내비게이션과 분리되어 있으며,
홈에서는 프로젝트 앵커와 읽던 위치를 유지합니다.

- 공통 UI 문구: `_data/interface.yml`
- 언어 선택: `_includes/language-switcher.html`
- 홈 콘텐츠: `_includes/home-ko.html`, `_includes/home-en.html`
- 상세 문서: `projects/*.md`, `en/projects/*.md`
- 각 페이지의 `lang`, `permalink`, `translation_url`을 짝지어 유지합니다.
- 영어 설명용 ASK1 도식은 `*-en.svg`입니다. 실제 서비스 스크린샷은 원본 언어를 보존합니다.

내보내기는 두 언어의 홈, 상세 4개씩, 404 화면까지 총 12개 페이지를 생성합니다.
이번 변경에서는 한국어·영어 소개와 프로젝트 설명 문구, 상세 Markdown 문서를 유지합니다.
새 레이아웃의 최종 브라우저 검증 결과는 [DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md)에 기록합니다.
# Selected portfolio direction — 2026-11-04

Current home combines the selected SCULPTURAL typography with A's modular hero and C's project index. A warm neutral palette replaces the full cobalt field. Four symbols link to the matching design, development, data and AI/cloud skills; the process section is removed. Korean/English project copy and metrics are preserved.

Local preview: `http://127.0.0.1:4173/` and `/en/`. Build the homepage bundle with `npm run build:home`, then run `.\.venv\Scripts\python.exe scripts/export_submission.py`. The normal exporter replaces `dist`; the frozen before/after site and original optional proposals are kept in `../design-review/selected-direction-2026-11-04/`. To recreate original comparison pages, pass `--source ../design-review/selected-direction-2026-11-04/before/site` to the study builders. New source fonts include their OFL licenses.
