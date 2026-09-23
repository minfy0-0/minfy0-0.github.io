# NAVER Cloud 제출용 포트폴리오

브랜치: `application/naver-cloud-api-ai-20260923`

기존 Jekyll 포트폴리오의 프로젝트 내용과 이미지를 바탕으로 만든 지원용 버전입니다.
`main`은 변경하지 않습니다. 제출용 웹 주소는 별도로 배포합니다.

## 구성

- OPIc: AI API 연계, 사용자 흐름, 프롬프트와 응답 품질 개선
- ASK1: 공개 API 수집·통합, 데이터 검증, 조회 결과의 해석 범위
- 서울 카페: 시장·입지 비교, 지표 정의, Power BI
- Dr. Spot: 본인 담당 역할, 추론 흐름 통합, AWS 배포 구조

이메일, 연락 버튼, 거주 지역과 개인 프로필 링크를 제외했습니다.
게시물의 수치는 기존 포트폴리오의 검증 시점과 범위에 한정합니다.
공개된 프로젝트 설명과 화면만 재사용했으며, 새 성과나 경력을 추가하지 않았습니다.
검색 제외 메타 태그와 robots.txt는 검색 노출 억제용이며 접근 제어가 아닙니다.
Git 저장소의 과거 커밋까지 삭제하는 작업은 포함하지 않습니다.

## 편집과 정적 내보내기

Jekyll 원본은 `_layouts/home.html`, `_includes/`, `projects/*.md`, `assets/`입니다.
사이트에 실제로 쓰는 페이지와 자산만 `dist/`로 내보냅니다.

```bash
python -m pip install -r requirements-submission.txt
python scripts/export_submission.py
node --check assets/js/portfolio.js
```

내보내기에서 내부 링크·앵커·이미지 경로와 연락처 노출을 검사합니다.
원래 Jekyll 프로젝트는 유지하며 제출용 배포만 Ruby 없이 정적 HTML로 생성합니다.
별도의 Sites 배포 저장소에는 검증한 `dist/`와 배포 설정만 포함합니다.
