# 디자인 반영 기록

기준일: 2026-11-04

[DESIGN_BRIEF.md](DESIGN_BRIEF.md)를 우선 기준으로 삼습니다. 이번 작업은 레이아웃,
색, 타이포그래피, 블록 표현과 화면 동작을 변경합니다. 한국어·영어 포트폴리오의
소개, 프로젝트 설명과 수치의 의미를 다시 쓰지 않습니다.

사용자는 첫 화면의 미감과 장난감처럼 보이는 블록 표현에 이어, 여러 전시대를 놓은 갤러리도
첫 번째 KUUM 참고 화면을 그대로 따라간다고 지적했습니다. 현재 원칙은 특정 장면을 재현하거나
참고 이미지의 장식을 하나씩 붙이는 대신, 여러 참고의 색·격자·여백·재질 원리를 하나의 구조로 종합하는 것입니다.
기존 중앙 소개 아래에 연결된 계단형 코발트 면, 얇은 창 윤곽선, 작은 격자와 픽셀 커서,
네 모서리가 맞물린 매끈한 조형물 하나를 배치합니다. 글자 굵기는 과하지 않게, CTA는 작고 직선적으로 유지합니다.

## 반영 범위

| 영역 | 반영 기준 |
| --- | --- |
| 색 | 코발트 블루 중심, 흰색·연회색·네이비, 프로젝트별 포인트 색 하나 |
| 첫 화면 | 상단 중앙 HTML 소개, 하단의 연결된 계단형 코발트 면과 단일 투명 조형물 |
| 모듈 구성 | 32/64px 공통 격자, 얇은 창 윤곽선, 작은 격자와 픽셀 커서 하나. 가짜 창 버튼 없음 |
| 배경 동작 | 작은 마우스 반응만 사용. 클릭·드래그·탭 선택, WebGL 초기화 없이 정보 노출 |
| 소개 띠 | 기존 소개 문구를 사용해 히어로 아래에 가운데 정렬 |
| 프로젝트 | 네 개 섹션을 세로로 모두 표시. 설명·숫자와 실제 화면의 좌우를 번갈아 배치 |
| 배경과 글자 | 흰색·연회색·네이비로 섹션 구분. 로컬 SUIT 가변 글꼴, 과하지 않은 굵기, 작은 직선형 CTA |
| 일하는 방식 | 불편 발견 → 기획 → 구현 → 검증, 선 아이콘을 사용한 카드 네 개 |
| 경험·배경 | 기존 타임라인, 학력, 콘텐츠 경험, 자격 유지 |
| 연락 | 네이비 배경에 GitHub 링크. 이메일은 확정 후 조건부 표시 |
| 언어 | 내비게이션 밖 오른쪽 아래의 독립 KR / EN 전환기 유지 |
| 모바일 | 375px에서 가로 넘침 없이, 설명 아래에 스크린샷 배치 |

## 비워둔 항목

사용자 요청: **“일단 비워두고 기록해놔”**

| 항목 | 현재 값 | 후속 작업 |
| --- | --- | --- |
| 공개할 이메일 | `""` | 사용자가 주소를 확정하면 히어로·연락 섹션에 실제 이메일 링크 표시 |
| 한국어 지원 방향 문구 | `""` | 사용자가 문구를 확정하면 히어로에 반영 |
| 영어 지원 방향 문구 | `""` | 한국어와 대응하는 확정 문구를 반영 |

빈 값에 대한 가짜 링크, 비활성 버튼, `준비 중` 표시나 임의의 직무 문구를 페이지에 넣지 않습니다.
이메일을 추가할 때는 정적 내보내기의 연락처 검사에도 확정된 주소만 명시적으로 허용해야 합니다.

## 문구와 자료 보존

- 한국어 홈의 기준 문서는 `_includes/home-ko.html`, 영어 홈은 `_includes/home-en.html`입니다.
- 상세 문서는 `projects/*.md`, `en/projects/*.md`이며, 이번 디자인 변경으로 본문을 수정하지 않습니다.
- 기존 문구는 이동하거나 스타일을 적용할 수 있지만, 프로젝트의 역할·성과·검증 범위를 확대하지 않습니다.
- 사라진 클릭·드래그·프로젝트 선택 동작의 안내는 새 화면에 남기지 않습니다.
- ASK1 실제 화면은 `assets/img/portfolio/ask1-overview.svg`에 들어 있던 JPEG를
  `assets/img/portfolio/ask1-screen.jpg`로 그대로 추출했습니다. 크기는 871 × 1145이며 픽셀을 편집하지 않았습니다.
- 영어에서도 실제 서비스 화면의 원래 언어를 보존합니다. `ask1-architecture-en.svg`와
  `ask1-evidence-en.svg`는 번역된 도식이며 실제 화면을 번역한 파일이 아닙니다.

## 현재 히어로 자산과 실행 구조

| 자산 | 크기 | 용도 |
| --- | --- | --- |
| `assets/img/hero/modular-knot-v1.png` | 1254 × 1254, 1,255,529바이트 | 네 모서리가 맞물린 단일 투명 조형물 |
| `assets/fonts/SUIT-Variable.woff2` | 624,536바이트 | 로컬 가변 글꼴 |
| `assets/js/workbench.js` | 현재 1,202바이트 | 선택적인 작은 마우스 배경 이동 |

조형물은 내장 이미지 도구로 생성한 투명 PNG입니다. 큰 파란 면, 창 윤곽선, 격자와 커서는
HTML·CSS·SVG로 구성하며, 소개와 버튼은 실제 HTML로 유지합니다. 현재는 갤러리 `<picture>`를 사용하지 않습니다.
이전 `block-gallery-v1.png`와 `block-gallery-mobile-v1.png`는 저장소에 기록용으로 보존하지만,
현재 홈에서 참조하지 않으며 정적 결과물에도 포함하지 않습니다.

`assets/css/modular-hero.css`가 현재 첫 화면을 담당하며, `_includes/head.html`과 정적 내보내기에서
모두 `workbench.css` 다음에 로드합니다. 기존 소개 띠, 프로젝트, 프로세스, 경험·연락 섹션은 그대로 유지합니다.

현재 홈은 Three.js를 불러오거나 WebGL을 초기화하지 않습니다. `src/workbench.js`는 하단 구성 전체의 미세한 이동만
처리하며, JavaScript가 없어도 이미지와 본문을 숨기지 않습니다. `src/gallery-scene.js`는 배포하지 않는
선택적 실험 소스입니다. SUIT의 SIL Open Font License와 고지는 `assets/fonts/SUIT-LICENSE.txt`,
`THIRD_PARTY_NOTICES.md`에 보관합니다.

## 참고 사이트

아래 링크는 구성과 시각 표현의 참고 자료입니다. 문구나 이미지를 그대로 가져오는 기준이 아닙니다.
구체적인 구현 요구는 `DESIGN_BRIEF.md`를 따릅니다.

- [토스](https://toss.im/): 큰 여백, 첫 화면과 소개 섹션의 정보 위계
- [KUUM · Felissimo](https://www.felissimo.co.jp/company/contents/press/nrr2015200187/): 조형물의 매끈한 재질만 참고. 전시대 나열 구도는 사용하지 않음
- [NETSPA](https://netspa.co.kr/): 세로 섹션의 리듬과 프로세스 카드
- [nader.io](https://nader.io/): 첫 화면의 정보 구성
- 사용자 제공 Weblium 이미지: 하나로 연결된 큰 코발트 면과 계단형 가장자리
- 사용자 제공 Blue Skies 이미지: 얇은 창 윤곽선과 작은 픽셀 포인트. 노이즈·가짜 창 버튼은 제외
- 사용자 제공 Lego Effect 이미지: 작은 영역의 격자와 모듈 결합 원리. 돌기나 장난감 표면은 제외

## 검증 상태

- 한국어·영어 홈의 기존 문구 각 35개, 총 70개 조각을 원본과 대조했습니다.
- 상세 Markdown 본문은 이번 디자인 작업에서 수정하지 않았습니다.
- 정적 내보내기: 12개 페이지, 23개 자산, 내부 링크·앵커·언어 대응 링크 검사 통과.
- 이미지의 원래 크기를 명시해 지연 로딩 중 레이아웃 이동을 줄였습니다.
- 모션 감소 설정과 JavaScript가 없는 경우는 소스 구조로 확인했습니다. 이미지·본문·링크는 정적 HTML이며, 스크립트는 선택적인 미세 배경 움직임만 담당합니다. 실제 브라우저의 JavaScript 비활성화·모션 감소 환경 에뮬레이션은 수행하지 않았습니다.
- 이메일·지원 방향은 빈 값이며 화면에 가짜 버튼이나 자리표시자를 표시하지 않습니다.
- Git diff 공백 검사와 JavaScript 구문 검사 통과. 공개 배포·커밋·푸시는 하지 않았습니다.

현재 모듈형 히어로를 실제 브라우저에서 확인했습니다.

- 1440px 데스크톱: 한·영 소개와 그래픽이 겹치지 않으며 가로 넘침 없음.
- 375 × 667px: 한·영 모두 제목·CTA·하단 구성 분리, 버튼 한 줄, 가로 넘침 없음. 영문 줄바꿈은 모바일 크기에 맞췄습니다.
- 네 프로젝트가 모두 표시되며 모바일에서는 설명 다음에 스크린샷이 배치됩니다.
- 언어 전환과 독립된 KR / EN을 확인했습니다. 상세 URL·앵커·대응 언어 링크는 12개 페이지 정적 검사에서 재확인했습니다.
- 키보드 Tab 포커스와 새 탭 안내를 확인했습니다. 브라우저 오류·경고 로그 없음.
- 장식 프레임에는 작동하지 않는 닫기·확대 버튼을 만들지 않았습니다.

## Claude 소스 리뷰 반영

직전 요청의 응답이 도착했습니다(`preview-evidence/claude-gallery-review.md`). 이는 이전 갤러리의
소스 리뷰이며, 현재 새 구성에 대한 시각 리뷰가 아닙니다. 계속 사용하는 언어 전환과 모션 코드에서
유효한 지적을 확인해 반영했습니다.

- 언어 링크의 접근성 이름에 화면의 KR / EN을 포함했습니다. 보이는 문구는 유지합니다.
- 모션 감소 시 render와 request 양쪽에서 애니메이션 프레임을 차단합니다.
- 탭 복귀 시 배경 이동 목표를 중심으로 되돌립니다.
- 히어로·연락 GitHub 링크에 언어별 새 탭 안내를 추가했습니다. 이 안내는 사용성 보완이며,
  리뷰의 WCAG 3.2.2 위반 단정을 검증된 사실로 받아들이지 않습니다.

빌드와 로컬 실행 방법은 [README.md](README.md), 자산과 동작 기준은 [HERO.md](HERO.md)에 정리합니다.


## 프로젝트 가로 탐색 — 2026-11-04 추가 요청

사용자 요청에 따라 메뉴와 섹션 제목을 ‘프로젝트 / Projects’로 바꾸고, 기존 네 개의 본문을
가로로 넘기는 구성으로 전환했습니다. 초기 브리프의 세로 나열 요구보다 이번 요청을 우선합니다.

- 상단에 네 프로젝트 이름, 선택 막대, 01 / 04 위치 표시와 이전·다음 버튼을 배치합니다.
- 자동 넘김은 기본 꺼짐이며, 켜면 8초마다 진행합니다. 수동 선택은 재생을 끕니다.
- 마우스가 본문 위에 있거나 본문/선택기에 키보드 초점이 있으면 일시적으로 멈춥니다. 프로젝트
  상단 200px를 벗어나 읽거나 탭이 백그라운드일 때도 멈춥니다. 모션 감소 시 자동 넘김 비활성화.
- 현재 패널 높이를 반영해 설명이 잘리지 않게 하고, 비활성 패널은 inert와 aria-hidden으로
  키보드·스크린리더 탐색에서 제외합니다. JavaScript가 없으면 기존 세로 목록이 표시됩니다.
- 상단 탭은 방향키·Home·End로 선택할 수 있습니다. 터치 가로 스와이프도 구현했습니다.
- 프로젝트 URL 앵커와 한·영 전환에서 선택한 프로젝트를 유지합니다. 언어 선택기는 계속 독립된
  오른쪽 아래 위치에 있습니다.
- 한국어·영어의 네 article 본문을 작업 직전 백업과 바이트 단위로 비교해 모두 동일함을 확인했습니다.
  상세 Markdown도 이번 변경에서는 수정하지 않았습니다.

검증: 12개 페이지/23개 자산 정적 내보내기, JavaScript 빌드·구문 검사 통과. 실제 브라우저에서
1440px 데스크톱, 375×667px 모바일의 레이아웃과 가로 넘침 없음, 탭·화살표·키보드 선택,
8초 자동 진행과 정지, 한국어↔영어 선택 유지, 영문 café 상세 페이지 진입·해당 슬라이드로 복귀,
비활성 패널 inert/ARIA 상태 및 활성 패널 높이 반영을 확인했습니다. 브라우저 오류·경고 없음.
터치 스와이프·모션 감소·JavaScript 비활성화는 소스 확인이며 실제 기기 에뮬레이션 검증은 아닙니다.

독립 소스 리뷰에서 자동 넘김 버튼의 접근성 이름과 모바일 영문 제목 CSS 우선순위 문제를
발견해 반영했습니다. 실제 Claude 소스 리뷰는 API 연결 오류(FailedToOpenSocket)로 실패했습니다.
권한을 확장한 읽기 전용 재시도에서도 응답이 오지 않아 종료했으며, 이번 변경을 Claude가
검토했다고 주장하지 않습니다. 이 변경의 검증은 위 브라우저 검사와 별도 Codex 소스 리뷰입니다.

이름 표기 추가 수정: 한·영 홈의 헤더·소개 이름·연락·푸터를 MINSEO KIM으로 통일했습니다. 한국어 본문은 유지합니다.


## 내비게이션 정리

홈과 상세 페이지의 메뉴를 프로젝트 / 일하는 방식 / 경험 / 연락으로 통일했습니다.
공유 include인 primary-navigation-links.html을 사용하며 영어 메뉴는 Projects / How I work /
Experience / Contact입니다. process 앵커와 언어 전환 시 해당 영역의 읽던 위치 보존을 추가했습니다.
소개 띠와 기존 about·skills 앵커는 남아 있습니다.

560px 이하 홈에서는 이름 아래에 네 링크가 직접 보이는 한 줄 메뉴를 두고 소개와의 간격을 확보합니다.
상세 페이지의 기존 모바일 메뉴는 누락된 data-nav 연결을 보완해 실제로 열리고 링크를 선택할 수 있습니다.
KR / EN은 독립된 오른쪽 아래 위치를 유지합니다.

검증: 12개 페이지·23개 자산 내보내기와 앵커 검사 통과. 375px 한·영 메뉴 44px 높이,
가로 넘침 없음, 헤더와 소개 사이 39px 간격 확인. 일하는 방식 이동 시 프로젝트의 고정 바가
영역을 가리지 않으며 언어 전환 후 위치가 유지됩니다. 영문 상세 모바일 메뉴 열기와
How I work 선택 후 홈 process 영역 도착을 실제 브라우저에서 확인했습니다.


## 스킬 블록 추가

사용자 요청에 따라 프로젝트와 일하는 방식 사이에 디자인 / 개발 / 데이터 / AI·클라우드의
네 블록을 추가했습니다. 코발트·네이비·옅은 파랑의 각진 면, 일부 모서리의 28px 계단,
격자에서 만든 작은 그래픽으로 기존 첫 화면과 연결합니다. 데스크톱은 2×2, 모바일은 한 열입니다.

각 블록은 확인된 기술·활동과 적용 프로젝트 링크로 구성합니다. 평가 점수나 숙련도 막대는
없습니다. 디자인 도구를 묻는 선택적 질문에 대한 답변은 아직 없어 화면 흐름·정보 구조·
대시보드 시각화만 넣었습니다. Figma·Blender·Adobe 사용 능력을 추정하지 않았습니다.
근거는 preview-evidence/skills-evidence.md, 한·영 내용은 _data/skills.yml에 기록했습니다.

메뉴에 스킬을 추가하고 기존 학력 문단의 skills ID를 새 섹션으로 옮겨 중복 앵커를 방지합니다.
학력 문구는 유지합니다. 언어 전환 시 스킬 영역의 읽던 위치를 보존하며, 정적 내보내기에서도
skills 데이터를 로드합니다. 기존 프로젝트 본문과 소개 문구는 변경하지 않았습니다.

검증: 12개 페이지·23개 자산 내보내기 및 내부 링크·앵커 검사, JS 구문·diff 검사 통과.
1440px 데스크톱에서 2×2 구성과 네 블록의 동일 높이(338px)를 확인했습니다.
375px 영어 메뉴 다섯 항목·44px 링크 높이, 스킬 한 열, 문구 잘림·가로 넘침 없음.
한·영 전환 후 skills 위치 유지, 디자인 블록의 카페 기록 링크 진입과 상세 메뉴를 통한
스킬 영역 복귀를 실제 브라우저에서 확인했습니다. 이 추가는 별도 이미지·JS 의존성이 없습니다.
# Typography comparison — 2026-11-04

User requested font mockups before choosing a direction. Added an isolated review board at `/type-studies/`, built from `design-refs/typography` by `scripts/build_type_studies.py`. Main home templates and existing copy are unchanged.

- A: Archivo Narrow + SUIT; B: Bodoni Moda + MaruBuri; C: Bricolage Grotesque + SUITE.
- Shared comparison hierarchy: MINSEO KIM as the large title, unchanged introduction on two lines; same graphic, colors, navigation and actions in all three.
- Three side-by-side specimens, individual full previews, A/B/C switching and separate KR/EN preview controls. Uses original local font binaries, with source and license records alongside them.
- Desktop 1440px and mobile 375px reviewed. A/C Korean and B English mobile previews have no horizontal overflow or copy/art overlap. B/EN selector and full-preview link verified in the browser.
- These studies are excluded from Jekyll production. Run the optional study builder after a regular static export to recreate them locally.
- Design tool experience remains deferred at the user's request; keep the current evidence-based skills pending later input.

## Selected direction — 2026-11-04

- User selected Sculptural typography, A's hero composition, C's project index, meaningful symbols, removal of the process section, and less intense color.
- Home now uses a warm off-white ground with ink text, muted blue and sand modules. Bricolage Grotesque 650 is the name/display face; SUITE 450 is the Korean introduction face; long body copy remains SUIT. Case headings use the same selected font families.
- Four hero symbols reuse the verified skill categories and shared SVG paths: screen composition / code brackets / data records / connected AI-cloud components. Links lead to the matching focusable skill blocks; existing skill descriptions are unchanged.
- Desktop project navigation is a sticky vertical index with bounded internal scrolling; mobile uses a horizontal overflow list. Arrow keys follow the list orientation, Home/End select the ends, and the selected item is revealed inside the list. Count derives from the project data. The content carousel and opt-in 8-second playback remain.
- Playback control remains borderless below the project list. Process is removed from both home languages and shared navigation. Blank email/direction and deferred software skills remain blank/deferred.
- Validation: successful 12-page static export and asset/link/anchor checks; Korean/English project, intro, skill and experience text comparison against the before snapshot; browser checks at 375, 768 and 1280px with no page overflow; correct skill-link focus/scroll, vertical keyboard navigation, mobile End/selected-tab visibility, play/pause, language/project continuity and a mobile case link. A temporary 12-project fixture confirmed internal list scrolling and last-item visibility, and was removed after QA. Development module label contrast is 4.89:1.
- Physical touch gestures and full screen-reader testing were not performed. No public deploy or push.
- Source/rendered before and after snapshots: `../design-review/selected-direction-2026-11-04/`. Original A/B/C and typography proposal pages remain available. The comparison board links to the combined main page.



## Impeccable audit + polish / 2026-11-04

- Official Impeccable 4.8.0, engine 0.1.18: context once, audit then polish, one static detector run.
- Before/after source and rendered snapshots are stored outside the repo in `../design-review/impeccable-2026-11-04/`; the report and exact source diff accompany them.
- Added `design-polish.css`: name-first hero hierarchy; consistent identity/navigation/arrow/controls; 17px/70ch case reading layout; mobile 16px; visible 12px metadata; refined table and figure rhythm.
- Preserved narrative copy and project facts. Existing SUIT remains; no typography study was selected on the user's behalf.
- Added intrinsic sizes for case images, skip links and Escape/outside-click menu dismissal.
- Browser verified at 375/768/1440px; eight mobile case pages do not overflow; EN project → detail → KR → same project return passed. Physical touch and full screen-reader checks remain untested.
- `AUDIT.md` records detector false positives and limits; the raw detector output is retained, not presented as a clean certification.
- Compare saved versions at http://127.0.0.1:4176/ while the archive's `serve.py` is running. Main local site remains :4173. No push or deployment.

## Experience timeline restored — 2026-11-04

User selected the attached previous experience layout. Restored the white background, background label, left education and outlined certificate badges, right year-by-year vertical line/dot timeline, and separated writing/video note. Sculptural typography and all existing Korean/English copy are retained. Changes are scoped to the experience styles; mobile uses one column.

Validation: 12-page export and link/asset checks passed; experience wording matches the immediately prior rendered version in both languages; desktop timeline/badges and 375px Korean/English layout checked with no horizontal overflow. Before/after files are in `../design-review/experience-timeline-2026-11-04/`. Earlier design archives remain unchanged.

## Recognizable skill icons — 2026-11-04

Replaced the ambiguous abstract shapes with four shared inline SVGs: design = screen and pencil; development = code chevrons and slash; data = a layered database cylinder; AI/cloud = a cloud connected to an AI-marked processor. Thick strokes, square terminals and geometric frames keep the modular graphic language. Visible category labels remain; the paired SVGs stay aria-hidden. Both hero and skill cards use the same include, so Korean/English versions are consistent without new image or library dependencies.

Validation: 12-page export and existing checks passed; full rendered text unchanged in both languages; all eight icons per page parse as SVG; hero and 56px mobile skill symbols visually checked; AI/cloud link still focuses the matching card; no overflow at 375px. Previous icons and new source/rendered output are archived in `../design-review/recognizable-icons-2026-11-04/`.

## Project wording — 2026-11-04

Removed the repeated “한 가지 판단” / “A decision” subheading from all four project summaries. The existing bold sentence explaining the actual choice now starts each note directly. No role descriptions, project facts, metrics or underlying explanation were rewritten. Static export (12 pages) and existing checks passed; all eight rendered headings are absent and the four concrete lead sentences remain in each language. Source before/after and rendered result are preserved in `../design-review/project-copy-2026-11-04/`.

## Balanced skills and personal direction — 2026-11-04

User rejected the large design block because it implied an unrequested priority. Removed the first/last-card spans, dark design-only fill and enlarged icon. All four skill cards now have the same background, dimensions and 56px symbols; responsive layout uses four, two or one columns with equal row sizing. No experience/hero/project layout changes.

The user clarified that the introduction should express their desired role: seeing the bigger picture, understanding broadly, helping people with and without specialist knowledge communicate, and planning business/services. Replaced the one project-list sentence with two sentences expressing that direction. The English version conveys the same intent. This is framed as an aspiration, not an invented communication or planning accomplishment.

Validation: 12-page static export and existing asset/link checks passed. Only the requested introduction sentence was changed in each home template; other copy is byte-identical. Browser checks confirmed identical card sizes, backgrounds and icons across four/two/one-column layouts; English mobile cards are also equal and no horizontal overflow was observed. Both language introductions verified. Before/after files: `../design-review/balanced-skills-intro-2026-11-04/`.

## Weighted skill blocks — 2026-11-04

The user clarified that equal-sized cards were not intended and selected “개발·데이터를 넓게, 디자인은 작게”. This supersedes the equal-card layout above. The desktop grid now pairs a small design block with a wide development block, then a wide data block with a medium AI/cloud block. Muted category fills and different icon sizes support that hierarchy. Development/data lists use two columns where space allows. On mobile, development/data use the full width while design and AI/cloud are slightly inset on opposite sides.

All Korean/English narrative and skill text is unchanged. The selected introduction, experience timeline, hero and project interaction remain as before. The CSS cache key is updated in both Jekyll and static-export paths.

Validation: desktop widths are approximately 379 / 772 / 673 / 477 CSS pixels in category order at the tested 1309px content viewport. English tablet and Korean/English mobile layouts have no page/card overflow or clipped titles; mobile widths are 251 / 279 / 279 / 265px at the tested 341px viewport. Temporary browser sizing was reset. The static export and before/after text checks passed. Source, renderable before/after sites, and a desktop screenshot are saved in `../design-review/weighted-skills-2026-11-04/`. No public deployment.
