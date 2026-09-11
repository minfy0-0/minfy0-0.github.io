---
layout: case-study
title: ASK1 공개 데이터 통합 파이프라인
eyebrow: DATA ENGINEERING · 2026
description: ChEMBL·Open Targets·ClinicalTrials.gov의 공개 데이터를 Python과 Snowflake로 통합하고, Selonsertib 사례로 임상시험 매칭 근거와 미연결 원인을 추적한 개인 프로젝트입니다.
tags:
  - Python
  - Snowflake
  - SQL
  - Public API
  - Streamlit
facts:
  - label: Source snapshot
    value: 4,465 RAW records · 2026-09-07–08
  - label: Bioactivity
    value: 1,777 compounds · 2,576 records
  - label: Selonsertib case
    value: 11 collected trials · 9 matched · 2 pending review
  - label: Verification
    value: 43 offline tests passed · 2026-09-11
permalink: /projects/ask1-pipeline/
---

## 01. 시작한 이유와 범위

ASK1(MAP3K5) 활성 예측 경진대회 경험을 바탕으로, 여러 출처의 바이오 데이터를 연결하고 반복 조회할 수 있는 파이프라인을 만들었습니다. 모델 학습보다 **API 수집 → 원본 보존 → 정제·연결 → 품질검증 → 조회** 흐름에 집중했습니다.

수집 범위가 다른 데이터를 동일한 기준으로 비교하지 않도록 화면을 구분했습니다.

- **ASK1 활성 탐색:** ChEMBL 화합물 1,777개와 활성 레코드 2,576건(IC50 2,485건 / Ki 91건).
- **Selonsertib 연결 사례:** Selonsertib·GS-4997 검색으로 수집한 임상시험 11건의 동의어·중재명 매칭.
- **표적의 질환·형질 근거:** Open Targets 100건. 개별 화합물의 치료 효과와 연결하지 않습니다.

다른 화합물의 임상 이력은 조사 범위 밖입니다. 이 프로젝트는 신약 후보나 임상 개발 성공 가능성을 예측하지 않습니다.


<figure style="margin:32px 0;"><img src="{{ '/assets/img/portfolio/ask1-overview.svg' | relative_url }}" alt="ASK1 활성 탐색 실제 화면: 이름·동의어 검색, 유형 필터와 활성 레코드 목록" loading="lazy" style="width:100%;height:auto;border:1px solid #d7dfe6;border-radius:8px;"><figcaption>ASK1 활성 탐색 실제 화면: 이름·동의어 검색, 유형 필터와 활성 레코드 목록</figcaption></figure>

## 02. 수집과 Snowflake 계층 구성

| 계층 | 구현과 역할 |
| --- | --- |
| API / JSONL | ChEMBL·Open Targets·ClinicalTrials.gov에서 수집한 원본과 입력 스냅샷 보존 |
| RAW | 표적·활성·화합물·질환 연관·임상시험 5개 테이블, 총 4,465건 |
| STAGING | 이름·식별자·단위 등을 정리하는 6개 뷰 |
| MART | 활성·질환 연관·임상 연결을 조회하는 3개 뷰 |
| MONITORING | 실행 이력·변경 로그·품질검사·PDF 검토 후보 보관 |
| Streamlit | 공개 조회 스냅샷으로 활성 탐색과 연결 사례 시연 |

STAGING과 MART는 데이터를 별도로 복사한 테이블이 아닌 조회 규칙을 정의한 뷰입니다. Snowflake Warehouse는 SQL을 실행하는 컴퓨트입니다.

화면은 2026년 9월 7–8일 수집하고 9월 11일 검증·내보낸 스냅샷을 사용합니다. 실시간 조회나 공개 배포된 웹서비스는 아닙니다.


<figure style="margin:32px 0;"><img src="{{ '/assets/img/portfolio/ask1-architecture.svg' | relative_url }}" alt="공개 API → 원본 보존 → 정제·마트 뷰 → 스냅샷 조회 구조" loading="lazy" style="width:100%;height:auto;border:1px solid #d7dfe6;border-radius:8px;"><figcaption>공개 API → 원본 보존 → 정제·마트 뷰 → 스냅샷 조회 구조</figcaption></figure>

## 03. 수집 누락과 재적재 검증

초기에는 IC50이 전체 수집 제한을 소진해 Ki가 누락됐습니다. Codex로 원인을 분석하고 유형별 제한과 페이지네이션으로 수정한 뒤, 회귀 테스트와 실제 수집 결과에서 Ki 91건을 확인했습니다.

적재는 행별 처리에서 묶음 처리로 바꾸고, RAW 변경과 변경 로그를 파일별 트랜잭션으로 처리했습니다. 같은 입력을 재적재했을 때 **신규 0건 / 변경 0건 / 동일 4,465건**을 확인했습니다. 로컬과 DB의 ID·콘텐츠 해시 불일치와 ID 중복도 0건이었습니다.

품질검사 9개 중 오류 등급 7개는 실패 건수 0이었습니다. 활성값 누락 12건과 원천 중복 가능성 표시 196건은 경고로 보존했습니다. 원천의 중복 가능성 표시를 적재 중복으로 취급하지 않았으며, 경고 건수는 서로 겹칠 수 있습니다.

## 04. Selonsertib 연결과 실패 원인 추적

Selonsertib의 ChEMBL ID는 **CHEMBL3916717**이며 수집한 ASK1 활성 레코드는 204건입니다. 화합물 동의어와 임상시험 중재명의 양끝 공백·대소문자를 정리한 뒤 정확히 일치하는 기록을 연결했습니다.

결과는 **고유 임상시험 9건 / 별칭 일치 15행**입니다. 같은 시험이 여러 별칭과 일치할 수 있어 행 수와 시험 수를 구분했습니다.

**9/11은 Selonsertib·GS-4997로 수집한 시험의 매칭 결과입니다.** 매칭 정확도나 전체 ASK1 임상 커버리지를 뜻하지 않습니다.

미연결 시험 NCT03449446과 NCT04026165에서는 SEL 약어가 기존 규칙과 일치하지 않았습니다. Codex가 공식 연구계획서에서 약어 정의를 찾고, Python이 인용문·물리 페이지·문서 해시·출처를 대조했습니다.

- [NCT03449446 공식 연구계획서](https://cdn.clinicaltrials.gov/large-docs/46/NCT03449446/Prot_000.pdf): PDF 23쪽
- [NCT04026165 공식 연구계획서](https://cdn.clinicaltrials.gov/large-docs/65/NCT04026165/Prot_000.pdf): PDF 22쪽

두 후보는 **EVIDENCE_MATCHED / 의미 검토 PENDING**으로 별도 보관했습니다. 원문 대조와 의미 판단을 구분하고 최종 매핑에는 반영하지 않았습니다.


<figure style="margin:32px 0;"><img src="{{ '/assets/img/portfolio/ask1-evidence.svg' | relative_url }}" alt="SEL 약어 검토 기록: 공식 PDF 인용과 페이지, PENDING 및 최종 매핑 미반영" loading="lazy" style="width:100%;height:auto;border:1px solid #d7dfe6;border-radius:8px;"><figcaption>SEL 약어 검토 기록: 공식 PDF 인용과 페이지, PENDING 및 최종 매핑 미반영</figcaption></figure>

## 05. 탐색 화면에서 수정한 판단

처음에는 전체 화합물 목록에 임상시험 수를 함께 표시했습니다. 그러나 임상시험 수집은 Selonsertib에 한정돼 있어, 나머지 화합물을 0건으로 표시하면 임상 이력이 없는 것처럼 해석될 수 있었습니다.

이를 수정해 **ASK1 활성 탐색과 Selonsertib 연결 사례를 분리**했습니다. 활성 탐색은 이름·동의어·ID 검색, 측정 유형·최소 레코드 수 필터, 정렬과 페이지 이동을 제공합니다. 대표명이 없는 화합물은 ChEMBL ID로 표시합니다.

IC50·Ki와 실험 조건이 다른 값을 통합한 약효 순위는 제공하지 않습니다.

## 06. AI 활용과 검증

Codex를 문제 파악, 해결 대안과 차이 설명, 코드 작성·수정, PDF 근거 조사에 활용했습니다. 대안을 이해하고 범위를 선택한 뒤 실행 결과와 테스트로 재검증하는 방식으로 진행했습니다. 모든 과거 결정에서 대안 3개 비교를 수행했다고 소급해서 주장하지 않습니다.

독립 LLM API 에이전트 서버는 구현 범위에서 제외했습니다. Python의 원문 대조 통과를 생물학적 의미 검증 완료로 해석하지 않았습니다.

2026년 9월 11일 기준 오프라인 테스트 **43개**가 통과했습니다. 수집·정제·적재 로직, PDF 근거 검증, 스냅샷 덮어쓰기 방지, 검색·필터·페이지 이동과 화면의 해석 범위를 확인했습니다.

## 07. 프로젝트에서 얻은 점

데이터를 연결하는 코드뿐 아니라 **검색 범위, 레코드의 집계 단위, 연결 규칙과 해석 한계**가 결과의 신뢰성을 결정한다는 점을 배웠습니다. 연결하지 못한 데이터를 삭제하거나 임의로 보완하는 대신, 원본과 검토 상태를 보존해 다음 판단의 근거로 남겼습니다.
