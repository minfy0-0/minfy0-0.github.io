---
layout: case-study
permalink: /projects/drspot/
title: Dr. Spot · AI Skin Analysis
eyebrow: DATA QUALITY & MODEL EVALUATION · 2025
description: 피부 이미지 기반 질환 탐지·분류 프로젝트에서 데이터 품질, 평가 무결성, 모델 비교, 오류 분석을 중심으로 신뢰할 수 있는 분석 흐름을 만든 팀 프로젝트입니다.
cover: /assets/img/portfolio/drspot-architecture.png
cover_alt: Dr. Spot AWS 기반 서비스 아키텍처
tags:
  - Python
  - PyTorch
  - AWS
  - Computer Vision
  - Model Evaluation
facts:
  - label: TRAINING
    value: AWS Bio Healthcare AI Academy · 865h
  - label: TEAM
    value: 3-person team
  - label: BEST MODEL
    value: 86.6% Accuracy · 0.974 AUC
---

## 01. 문제 정의

피부 질환 이미지 분류에서 높은 정확도만으로 모델을 신뢰하기는 어렵습니다. 이미지 중복으로 학습·평가 데이터가 섞이거나, 클래스별 데이터 품질과 수량이 크게 다르면 성능 지표가 실제보다 높게 보일 수 있기 때문입니다.

Dr. Spot에서는 모델 학습 자체뿐 아니라 **데이터셋의 무결성과 동일 기준의 모델 평가**에 집중했습니다.

> 핵심 과제는 “어떤 모델의 숫자가 가장 높은가?”가 아니라 “이 숫자를 믿을 수 있도록 데이터와 평가 구조가 설계되어 있는가?”였습니다.

## 02. 데이터 정제와 누수 방지

원천 이미지 **37,961건**을 점검하면서 해시 기반 중복 검사를 적용했습니다. 이 과정에서 학습/평가 데이터 사이에 포함된 **2,700건 이상의 중복·누수 사례**를 제거해 평가 결과가 과대 추정되는 위험을 줄였습니다.

또한 이미지별 품질 편차를 줄이기 위해 다음 작업을 진행했습니다.

- 대비·밝기 등 이미지 품질 보정
- 해상도 규격 통일
- 중복 데이터 제거
- 6개 클래스의 불균형을 약 3,000건 수준으로 조정

정제 후 분석용 데이터셋은 **25,813건**으로 구성했습니다.

## 03. 모델 비교 구조

한 모델의 Accuracy만 보고 선택하지 않고, 동일한 기준에서 여러 후보 모델을 비교했습니다.

비교 대상은 EfficientNet, DenseNet, ConvNeXt, Vision Transformer 등 **5개 후보 모델**이었고, 다음 **5개 KPI**를 함께 확인했습니다.

| Metric | 확인 목적 |
| --- | --- |
| Accuracy | 전체 분류 정확도 |
| AUC | 클래스 구분 능력 |
| F1-score | Precision과 Recall의 균형 |
| Precision | 오탐 관점 성능 |
| Recall | 미탐 관점 성능 |

Confusion Matrix와 ROC Curve를 함께 확인해 단순 평균 지표가 가리는 **클래스별 혼동 패턴**도 분석했습니다.

## 04. 결과와 오류 분석

최종적으로 EfficientNet-B4가 **검증 Accuracy 86.6%, F1-score 86.5%, AUC 0.974**로 가장 안정적인 성능을 보였습니다.

하지만 결과 수치만 정리하지 않고, 시각적으로 유사한 일부 병변 클래스 사이의 혼동을 확인했습니다. 이를 통해 데이터 증강만으로 해결하기 어려운 한계가 있으며, 향후에는 환자 메타데이터 등 추가 정보를 결합하는 방향도 필요하다고 판단했습니다.

## 05. 서비스 흐름 연결

팀은 YOLOv8 탐지 모델과 EfficientNet-B4 분류 모델을 연결해 **이미지 업로드 → 병변 탐지 → 질환 분류 → 결과 제공** 흐름을 구성했습니다.

저는 데이터 전처리·모델 평가·오류 분석을 중심으로 참여했고, YOLOv8 학습·검증 및 YOLO + EfficientNet 파이프라인 통합도 지원했습니다. 최종 서비스는 Streamlit UI와 AWS 기반 배포 구조로 연결했습니다.

![Dr. Spot result]({{ '/assets/img/portfolio/drspot-result.png' | relative_url }})

## What I learned

- 모델의 신뢰도는 학습 기법보다 먼저 **데이터 누수와 품질 관리**에서 결정될 수 있다는 점
- 하나의 KPI보다 **여러 평가 지표와 오류 행렬을 함께 보는 방식**이 더 정확한 판단을 만든다는 점
- 분석 결과가 실제 서비스로 이어지려면 모델 성능뿐 아니라 **입력–추론–결과 전달의 전체 흐름**을 고려해야 한다는 점
