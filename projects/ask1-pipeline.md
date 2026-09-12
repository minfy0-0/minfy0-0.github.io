---
layout: case-study
title: ASK1 공개 데이터 통합 파이프라인
eyebrow: DATA ENGINEERING · 2026
description: 흩어져 있는 ASK1 연구 데이터를 한곳에서 살펴보기 위해 시작했습니다. 세 공개 API를 Snowflake에 연결하고, 데이터가 빠지거나 잘못 연결되는 지점을 확인하며 수집·검증 과정을 다듬었습니다.
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

## 흩어진 연구 자료를 함께 볼 수 있을까

ASK1(MAP3K5) 활성 예측 경진대회를 경험한 뒤, 실험 데이터에 관련 연구 자료를 함께 붙여보고 싶었습니다. ChEMBL에는 화합물과 활성 데이터가, Open Targets에는 표적의 질환 연관 근거가, ClinicalTrials.gov에는 임상시험 기록이 있었습니다. 이 자료를 한곳에 모으는 것부터 시작했습니다.

Python으로 세 API를 연결하고 Snowflake에 원본을 보관했습니다. 수집한 데이터는 다음과 같습니다.

| 출처 | 수집한 자료 |
| --- | --- |
| ChEMBL | 화합물 1,777개 · 활성 레코드 2,576건(IC50 2,485건 / Ki 91건) |
| Open Targets | ASK1의 질환·형질 연관 근거 100건 |
| ClinicalTrials.gov | Selonsertib·GS-4997로 검색한 임상시험 11건 |

활성 데이터는 ASK1을 기준으로 모았지만, 임상시험은 Selonsertib을 연결 사례로 정해 수집했습니다. 이 차이는 나중에 화면을 구성할 때도 중요했습니다.

<figure style="margin:32px 0;"><img src="{{ '/assets/img/portfolio/ask1-overview.svg' | relative_url }}" alt="ASK1 활성 탐색 실제 화면: 이름·동의어 검색, 유형 필터와 활성 레코드 목록" loading="lazy" style="width:100%;height:auto;border:1px solid #d7dfe6;border-radius:8px;"><figcaption>ASK1 활성 탐색 실제 화면: 이름·동의어 검색, 유형 필터와 활성 레코드 목록</figcaption></figure>

## 원본을 남겨야 다시 확인할 수 있었습니다

정제한 결과가 이상할 때 어디서 달라졌는지 되짚을 수 있도록, API 응답을 JSONL과 Snowflake RAW에 보관했습니다. 그 위에 이름·단위를 정리하는 STAGING 뷰와 조회 목적에 맞게 연결하는 MART 뷰를 두었습니다.

| 계층 | 역할 |
| --- | --- |
| RAW | 표적·활성·화합물·질환 연관·임상시험 5개 테이블, 총 4,465건 보관 |
| STAGING | 이름·식별자·단위를 정리하는 6개 뷰 |
| MART | 활성·질환 연관·임상 연결을 조회하는 3개 뷰 |
| MONITORING | 실행 이력, 변경 로그, 품질검사와 PDF 검토 후보 보관 |
| Streamlit | 조회 결과를 탐색하고 연결 근거를 확인하는 화면 |

STAGING과 MART는 데이터를 복사해 쌓는 대신 원본을 조회하는 뷰로 구성했습니다. SQL 실행에는 Snowflake Warehouse를 사용했습니다.

시연 화면에는 **2026년 9월 7–8일 수집하고 9월 11일 검증·내보낸 스냅샷**을 사용합니다. 로컬에서 실행하는 화면이라 실시간 조회나 공개 웹서비스는 제공하지 않습니다.

<figure style="margin:32px 0;"><img src="{{ '/assets/img/portfolio/ask1-architecture.svg' | relative_url }}" alt="공개 API → 원본 보존 → 정제·마트 뷰 → 스냅샷 조회 구조" loading="lazy" style="width:100%;height:auto;border:1px solid #d7dfe6;border-radius:8px;"><figcaption>공개 API → 원본 보존 → 정제·마트 뷰 → 스냅샷 조회 구조</figcaption></figure>

## 데이터를 모은 뒤, 빠진 값과 재실행 결과를 확인했습니다

처음에는 IC50이 수집 제한을 모두 채우면서 Ki가 빠졌습니다. Codex와 코드를 살펴보니 두 유형에 하나의 제한을 적용하고 있었습니다. 유형별로 제한과 페이지네이션을 나누고, 회귀 테스트와 실제 수집 결과에서 **Ki 91건**이 들어오는 것을 확인했습니다.

적재 과정도 손봤습니다. 행마다 처리하던 방식을 묶음 처리로 바꾸고, RAW 변경과 변경 로그가 파일별 트랜잭션 안에서 함께 기록되도록 했습니다. 같은 데이터를 다시 넣었을 때 결과는 **신규 0건 / 변경 0건 / 동일 4,465건**이었습니다. 로컬과 DB를 대조했을 때 ID·콘텐츠 해시 불일치와 ID 중복도 0건이었습니다.

품질검사 결과는 오류와 경고를 나눠 확인했습니다.

- 검사 9개 중 오류 등급 7개: 실패 건수 0
- 활성값 누락: 12건
- 원천 데이터의 중복 가능성 표시: 196건

196건은 원천에서 표시한 중복 가능성으로, 재적재 중복과는 다릅니다. 경고 항목끼리 겹칠 수도 있어 단순히 합산하지 않았습니다.

## 이름이 같으면 연결됐지만, 약어에서는 멈췄습니다

Selonsertib의 ChEMBL ID는 **CHEMBL3916717**이고, 수집한 ASK1 활성 레코드는 204건입니다. 이 물질의 이름·동의어와 임상시험 중재명에서 양끝 공백과 대소문자를 정리한 뒤, 정확히 일치하는 기록을 연결했습니다.

수집한 시험 11건 중 **고유 임상시험 9건**이 연결됐습니다. 별칭별 일치 결과는 15행이었는데, 같은 시험이 여러 이름과 일치하기 때문입니다. 그래서 화면에서도 15행과 9개 시험을 구분했습니다.

남은 NCT03449446과 NCT04026165에서는 **SEL**이라는 약어가 기존 규칙에 걸리지 않았습니다. Codex가 공식 연구계획서에서 약어 정의를 찾고, Python으로 인용문·PDF 페이지·문서 해시·출처를 대조했습니다.

- [NCT03449446 연구계획서](https://cdn.clinicaltrials.gov/large-docs/46/NCT03449446/Prot_000.pdf): PDF 23쪽
- [NCT04026165 연구계획서](https://cdn.clinicaltrials.gov/large-docs/65/NCT04026165/Prot_000.pdf): PDF 22쪽

두 후보 모두 원문 대조는 통과했습니다. 다만 문구가 있다는 것과 연결해도 된다는 판단은 별개라, **EVIDENCE_MATCHED / 의미 검토 PENDING**으로 보관하고 최종 매핑에는 반영하지 않았습니다.

<figure style="margin:32px 0;"><img src="{{ '/assets/img/portfolio/ask1-evidence.svg' | relative_url }}" alt="SEL 약어 검토 기록: 공식 PDF 인용과 페이지, PENDING 및 최종 매핑 미반영" loading="lazy" style="width:100%;height:auto;border:1px solid #d7dfe6;border-radius:8px;"><figcaption>SEL 약어 검토 기록: 공식 PDF 인용과 페이지, PENDING 및 최종 매핑 미반영</figcaption></figure>

## ‘0건’이라고 보여줘도 되는지 다시 생각했습니다

처음 화면에는 모든 화합물 옆에 임상시험 수를 표시했습니다. 하지만 임상시험은 Selonsertib만 검색했기 때문에 다른 화합물의 0건은 ‘없음’이 아니라 ‘조사하지 않음’에 가까웠습니다.

이 점을 확인한 뒤 **ASK1 활성 탐색과 Selonsertib 연결 사례를 별도 탭으로 나눴습니다.** 활성 목록에서는 이름·동의어·ID로 검색하고, 측정 유형과 최소 레코드 수로 범위를 좁힐 수 있습니다. 대표명이 없는 물질은 ChEMBL ID로 표시했습니다.

숫자를 읽는 기준도 함께 정리했습니다. **9/11은 이번에 수집한 시험의 매칭 결과**이며 정확도나 전체 ASK1 임상 커버리지가 아닙니다. IC50·Ki와 실험 조건이 다른 값을 하나의 약효 순위로 묶지 않았고, Open Targets의 표적 연관 근거도 개별 화합물의 치료 효과로 해석하지 않았습니다. 신약 후보나 임상 개발 성공 가능성을 예측하는 것은 이번 범위에 포함하지 않았습니다.

## AI와 함께 개발하면서 확인한 것

개발 중 문제가 생기면 Codex에 원인과 가능한 해결 방법을 물었습니다. 대안의 차이를 설명받고 방향을 정한 뒤, 코드 수정과 테스트를 이어가는 방식으로 활용했습니다. PDF 약어 조사에도 같은 도구를 사용했습니다.

별도 LLM API 에이전트 서버를 만드는 데까지 범위를 넓히지는 않았습니다. 이번에는 기존 Python·SQL 도구를 활용해 데이터를 수집하고, 제안된 수정이 실제 결과에 맞는지 확인하는 데 집중했습니다.

**2026년 9월 11일 기준 오프라인 테스트 43개가 통과했습니다.** 수집·정제·적재, PDF 근거 검증, 스냅샷 덮어쓰기 방지와 화면의 검색·필터·페이지 이동을 확인했습니다.

## 마무리하며

시작할 때는 여러 API를 연결하는 일이 중심이라고 생각했습니다. 진행하면서는 수집 범위가 다른 자료를 어떻게 보여줄지, 연결되지 않은 기록을 어디까지 해석할지가 더 까다로웠습니다.

이번 프로젝트에서는 원본과 검토 상태를 남기고, 숫자가 무엇을 세는지 설명하는 데까지 마무리했습니다. 덕분에 결과가 이상할 때 원본으로 돌아가 확인할 수 있고, 아직 판단하지 못한 부분도 구분해서 볼 수 있게 됐습니다.
