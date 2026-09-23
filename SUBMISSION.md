# NAVER Cloud 제출용 포트폴리오

제출 주소: https://minfy0-0.github.io/

작업 브랜치: `application/naver-cloud-api-ai-20260923`
GitHub Pages 배포 브랜치: `main`
병합 전 원본 백업: `backup/main-before-naver-20260923`

기존 포트폴리오의 영문 섹션명, 프로젝트 순서, 배치, 글자 크기와 간격을 유지합니다.
NAVER Cloud Open API·AI 플랫폼 기획 JD에 맞춰 소개와 프로젝트 설명을 보강했습니다.
기존 경험에 있는 요구사항, 선택 이유, 검증 결과와 한계를 명확히 하고 별도 지원용 분석은 추가하지 않았습니다.
제출용 버전에서는 이메일, 연락 버튼, 거주 지역과 개인 프로필 링크만 제외했습니다.
사용자가 요청한 네이버 그린은 `assets/css/naver-theme.css`에서 색상만 적용합니다.
흰색·차콜을 바탕으로 로고, 작은 라벨과 화살표에 초록 포인트를 사용합니다.
프로젝트 화면과 도표의 원래 색상은 유지합니다.

## 편집과 정적 내보내기

Jekyll 원본은 `_layouts/home.html`, `_includes/`, `projects/*.md`, `assets/`입니다.
실제 사용하는 페이지와 자산만 `dist/`로 내보냅니다.

```bash
python -m pip install -r requirements-submission.txt
python scripts/export_submission.py
node --check assets/js/portfolio.js
```

내보내기에서 내부 링크·앵커·이미지 경로와 연락처 노출을 검사합니다.
별도의 배포 저장소에는 생성한 `dist/`와 배포 설정만 포함합니다.
사용자 요청에 따라 제출용 수정본을 `main`에 병합하여 GitHub Pages에도 게시합니다.
검색 제외 메타 태그와 robots.txt는 검색 노출 억제용이며 접근 제어가 아닙니다.
