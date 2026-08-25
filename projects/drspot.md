---
layout: case-study
permalink: /projects/drspot/
title: Dr. Spot · AI Skin Analysis
eyebrow: HEALTHCARE AI · MODEL EVALUATION · CLOUD · 2025
description: 피부 병변 이미지를 YOLOv8로 탐지하고 EfficientNet-B4로 분류한 3인 팀 프로젝트입니다. 모델 성능 비교·오류 분석, YOLO 학습·검증, 추론 파이프라인 통합과 AWS 기반 서비스 구현에 참여했습니다.
cover: /assets/img/portfolio/drspot-architecture.png
cover_alt: Dr. Spot AWS 기반 서비스 아키텍처
tags:
  - Python
  - PyTorch
  - YOLOv8
  - EfficientNet
  - AWS
  - Computer Vision
facts:
  - label: TRAINING
    value: AWS Bio Healthcare AI Academy · 865h
  - label: TEAM
    value: 3-person team
  - label: BEST MODEL
    value: 86.6% Accuracy · 0.974 AUC
---

## 01. Project Overview

Dr. Spot은 피부 이미지를 입력하면 병변 영역을 탐지하고 질환 클래스를 분류해 결과를 제공하는 AI 웹서비스 프로젝트입니다. AWS Bio Healthcare AI Academy에서 3인 팀으로 진행했으며, 모델 실험에 그치지 않고 **이미지 업로드 → 병변 탐지 → 질환 분류 → 결과 제공**까지 하나의 서비스 흐름으로 연결하는 것을 목표로 했습니다.

저는 프로젝트에서 **모델 성능 비교 및 오류 분석, YOLOv8 탐지 모델 학습·검증 지원, 하이퍼파라미터 튜닝, YOLOv8과 EfficientNet-B4 추론 파이프라인 통합 지원, AWS 배포 아키텍처 구현 과정**에 참여했습니다.

![Dr. Spot result]({{ '/assets/img/portfolio/drspot-result.png' | relative_url }})

## 02. Team Data Pipeline

프로젝트에서는 원천 피부 이미지 **37,961건**을 점검해 중복·품질 편차와 클래스 불균형을 정리하고, 최종 **25,813건**의 분석용 데이터셋을 구성했습니다. 해시 기반 중복 검사와 이미지 품질 보정, 해상도 통일, 클래스 균형 조정 등이 팀의 데이터 전처리 파이프라인에서 수행됐습니다.

이 데이터 품질 작업은 **팀 전체 프로젝트의 전처리 과정**이며, 아래의 `My Contribution`과는 구분해 표시했습니다. 모델 평가 단계에서는 정제된 데이터를 동일한 기준으로 비교할 수 있도록 평가 지표와 오류 패턴을 함께 확인했습니다.

## 03. Detection → Classification Architecture

Dr. Spot은 탐지와 분류를 하나의 모델에 맡기지 않고 두 단계로 구성했습니다.

1. 사용자가 피부 이미지를 업로드합니다.
2. **YOLOv8**이 이미지에서 병변 영역(ROI)을 탐지합니다.
3. 탐지된 병변 이미지를 **EfficientNet-B4** 분류 모델로 전달합니다.
4. 분류 결과를 Streamlit 화면에서 사용자에게 제공합니다.

![Dr. Spot architecture]({{ '/assets/img/portfolio/drspot-architecture.png' | relative_url }})

저는 YOLOv8 탐지 모델의 학습·검증을 지원하고, 탐지 결과가 분류 모델 입력으로 이어지도록 **YOLOv8 → EfficientNet-B4 추론 파이프라인 통합**을 지원했습니다. 개별 모델의 성능뿐 아니라 모델 간 입력·출력 연결이 실제 서비스 흐름에서 정상적으로 이어지는지를 함께 확인했습니다.

## 04. Model Evaluation

분류 모델은 EfficientNet, DenseNet, ConvNeXt, Vision Transformer 등 여러 후보를 비교했습니다. 하나의 Accuracy 수치만으로 모델을 판단하지 않고 다음 지표를 함께 확인했습니다.

| Metric | 확인 목적 |
| --- | --- |
| Accuracy | 전체 분류 정확도 |
| F1-score | Precision과 Recall의 균형 |
| AUC | 클래스 구분 성능 |
| Confusion Matrix | 클래스별 오분류 패턴 |
| ROC Curve | 분류 임계값에 따른 성능 변화 |

저는 모델별 성능 지표를 시각화하고 비교했으며, Confusion Matrix와 ROC Curve를 활용해 평균 지표만으로는 보이지 않는 오류 유형을 확인했습니다.

최종적으로 EfficientNet-B4가 다음의 검증 성능을 기록했습니다.

| Metric | Result |
| --- | ---: |
| Validation Accuracy | **86.6%** |
| F1-score | **86.5%** |
| AUC | **0.974** |

## 05. Error Analysis

모델의 최종 점수만 보고 끝내지 않고 클래스별 예측 결과를 함께 확인했습니다. Confusion Matrix를 통해 일부 피부 병변이 다른 클래스와 혼동되는 패턴을 확인하고, ROC Curve와 함께 모델이 어떤 구간에서 분류 성능이 달라지는지 검토했습니다.

이 과정을 통해 **정확도 하나만으로 모델을 선택하기보다 여러 지표와 실제 오분류 패턴을 함께 봐야 한다는 점**을 확인했습니다. 분석 결과는 팀원들과 공유하며 모델 개선 방향을 검토했습니다.

## 06. My Contribution

공식 프로젝트 역할 기준으로 제가 직접 맡거나 지원한 영역은 다음과 같습니다.

- **YOLOv8 탐지 모델 학습·검증 지원**
- **하이퍼파라미터 튜닝** 및 모델 실험 지원
- EfficientNet 계열을 포함한 분류 모델의 **성능 지표 시각화·비교**
- Confusion Matrix · ROC Curve 기반 **오류 분석**
- **YOLOv8 → EfficientNet-B4 추론 파이프라인 통합 지원**
- **AWS 배포 아키텍처** 구성 및 서비스 연결 과정 참여
- Git · Notion · Slack을 활용한 3인 팀 협업 및 실험 결과 공유

데이터 중복 제거와 클래스 균형 조정은 프로젝트의 데이터 파이프라인에는 포함되지만, 제 개인 기여로 표시하지 않았습니다.

## 07. AWS 기반 서비스 연결

모델 결과를 실제 웹 화면까지 전달하기 위해 Streamlit UI와 AWS 기반 배포 구조를 구성했습니다. 프로젝트에서는 **SageMaker Endpoint**를 통한 모델 서빙과 S3, ECR, ECS Fargate, ALB, WAF 등을 활용한 서비스 구조를 경험했습니다.

제가 이 프로젝트에서 중요하게 본 부분은 모델 파일을 만드는 것에서 끝나는 것이 아니라, 사용자의 이미지 입력이 탐지·분류를 거쳐 결과 화면까지 전달되는 전체 경로였습니다. 이를 통해 모델 개발과 서비스 배포가 별개의 작업이 아니라 하나의 제품 흐름으로 연결돼야 한다는 점을 배웠습니다.

## What I Learned

- 모델을 평가할 때 Accuracy 하나보다 **F1-score, AUC, Confusion Matrix, ROC Curve를 함께 보는 이유**를 실제 실험으로 확인했습니다.
- 객체 탐지와 이미지 분류 모델을 연결하며 **모델 간 입력·출력 인터페이스와 추론 흐름**의 중요성을 경험했습니다.
- AI 모델을 Streamlit과 AWS 서비스 구조에 연결하며 **모델 성능 → 추론 파이프라인 → 사용자 결과 화면**까지 이어지는 전체 흐름을 이해했습니다.
- 3인 팀으로 실험 결과와 오류 원인을 공유하면서, 같은 지표를 보고도 서로 다른 해석이 나올 수 있어 **결과를 근거와 함께 설명하는 협업 방식**이 중요하다는 점을 배웠습니다.

[GitHub repository](https://github.com/minfy0-0/say_capybara)
