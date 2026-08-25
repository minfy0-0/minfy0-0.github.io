---
layout: case-study
permalink: /projects/drspot/
title: Dr. Spot · AI Skin Analysis
eyebrow: HEALTHCARE AI · COMPUTER VISION · AWS · 2025
description: 피부 병변 이미지를 YOLOv8로 탐지하고 EfficientNet-B4로 분류해 결과를 제공하는 3인 팀 AI 웹서비스입니다. YOLO 학습·검증, 하이퍼파라미터 튜닝, 성능 시각화·오류 분석, 추론 파이프라인 통합과 AWS 배포 아키텍처를 담당했습니다.
cover: /assets/img/portfolio/drspot-architecture.png
cover_alt: Dr. Spot AWS 기반 서비스 아키텍처
tags:
  - Python
  - PyTorch
  - YOLOv8
  - EfficientNet-B4
  - SageMaker
  - ECS Fargate
facts:
  - label: TRAINING
    value: AWS Bio Healthcare AI Academy · 865h
  - label: TEAM
    value: 3-person team
  - label: BEST MODEL
    value: 86.6% Accuracy · 0.974 AUC
---

## 01. Project Overview

Dr. Spot은 사용자가 피부 이미지를 업로드하면 **병변 위치를 탐지하고 질환을 분류한 뒤 결과와 가이드를 제공하는 AI 웹서비스**입니다. AWS Bio Healthcare AI Academy에서 3인 팀으로 진행했으며, 모델 실험에 그치지 않고 **이미지 입력 → 병변 탐지 → 질환 분류 → 결과 제공 → 클라우드 배포**까지 하나의 서비스 흐름으로 연결했습니다.

프로젝트에서는 EfficientNet-B3/B4, DenseNet-121, ConvNeXt-Tiny, Vision Transformer 등 분류 모델과 YOLOv8 탐지 모델을 실험했습니다. 최종적으로 분류 성능이 가장 우수한 EfficientNet-B4와 YOLOv8을 연결해 End-to-End 추론 파이프라인을 구성했습니다.

![Dr. Spot result]({{ '/assets/img/portfolio/drspot-result.png' | relative_url }})

## 02. My Role

최종 발표자료의 팀 역할표 기준으로 저는 **학습 환경 구축 및 실험 운영** 영역을 맡았습니다.

- **AWS 기반 배포 아키텍처 설계 및 구현**
- **학습 하이퍼파라미터 튜닝**
- **YOLOv8 + EfficientNet 파이프라인 통합 및 End-to-End 추론 서비스 구축**
- **YOLOv8 탐지 모델 학습 및 검증**
- **Confusion Matrix · ROC Curve 성능 지표 시각화 및 오류 분석**

데이터 중복 제거와 클래스 불균형 보정은 팀의 데이터 품질 관리 과정이지만 다른 팀원의 담당 영역이므로 제 개인 기여로 표시하지 않았습니다.

## 03. Team Data Pipeline

팀은 원천 피부 이미지 **37,961건**에서 중복·품질 편차·클래스 불균형을 점검하고 학습용 데이터셋을 구성했습니다. 전처리 과정에서는 이미지 품질 보정과 해상도 규격화, 데이터 중복 검증, 클래스 균형 조정 등을 수행했습니다.

탐지 모델용 데이터는 Roboflow에서 질환 클래스별 피부 병변에 바운딩 박스를 지정해 구축했습니다. 발표자료 기준 약 **1,200장의 이미지에 수기 라벨링**을 진행했고, Train 80% / Validation 20%로 분할해 YOLOv8 학습에 활용했습니다.

이 과정은 팀 단위 데이터 파이프라인이며, 저는 이후 **YOLOv8 학습·검증과 하이퍼파라미터 튜닝, 추론 파이프라인 통합**에 집중했습니다.

## 04. Detection → Classification Pipeline

Dr. Spot은 탐지와 분류를 하나의 모델에 맡기지 않고 두 단계로 분리했습니다.

1. 사용자가 피부 이미지를 업로드합니다.
2. **YOLOv8**이 병변 후보 영역을 탐지해 Bounding Box와 Confidence Score를 생성합니다.
3. 탐지된 ROI(Region of Interest)를 잘라냅니다.
4. ROI를 **EfficientNet-B4**에 전달해 6개 피부 질환 클래스로 분류합니다.
5. 분류 결과를 Streamlit 화면에서 사용자에게 제공합니다.

![Dr. Spot architecture]({{ '/assets/img/portfolio/drspot-architecture.png' | relative_url }})

탐지 단계에서 병변을 찾지 못하는 경우에는 원본 이미지를 분류기에 전달하는 **Fail-Safe 경로**도 설계했습니다. 발표자료에서는 탐지 전처리를 거친 통합 파이프라인이 입력 변동에 따른 분류 성능의 변동 폭을 줄였고, 피부 영역이 일부만 포함된 프레이밍 문제에서 오류율을 낮추는 효과를 확인했습니다.

저는 이 과정에서 **YOLOv8의 출력이 EfficientNet-B4의 입력으로 자연스럽게 이어지도록 모델 간 추론 흐름을 통합**하고 End-to-End 서비스 경로를 구성했습니다.

## 05. YOLOv8 Training & Validation

YOLOv8 학습에서는 Box Loss, Classification Loss, DFL Loss와 함께 Precision, Recall, mAP@50, mAP@50–95를 확인했습니다.

학습이 진행되면서 Precision과 mAP 지표는 개선됐지만, Recall은 약 **0.4 수준에서 수렴**해 일부 실제 병변을 놓치는 한계도 확인했습니다. 단순히 학습이 끝났다는 사실보다 **탐지 단계가 전체 서비스의 병목이 될 수 있다는 점**을 확인하고 통합 파이프라인의 Fail-Safe 설계에 반영했습니다.

## 06. Classification Model Evaluation

팀은 다중 클래스 피부 병변 분류를 위해 5개 후보 모델을 동일한 검증 기준으로 비교했습니다.

| Model | Validation Accuracy | F1-score | AUC |
| --- | ---: | ---: | ---: |
| **EfficientNet-B4** | **86.6%** | **86.5%** | **0.974** |
| EfficientNet-B3 | 85.8% | 85.6% | 0.971 |
| ConvNeXt-Tiny | 84.1% | 84.3% | 0.969 |
| DenseNet-121 | 83.3% | 83.5% | 0.964 |
| Vision Transformer | 71.9% | 72.5% | 0.931 |

저는 모델별 성능을 **Confusion Matrix와 ROC Curve로 시각화하고 오류 패턴을 분석**했습니다. 최종적으로 EfficientNet-B4가 검증 Accuracy 86.6%, F1-score 86.5%, AUC 0.974로 가장 높은 성능을 보여 최종 분류 모델로 선택됐습니다.

## 07. Error Analysis

평균 성능 지표만으로는 의료 이미지 모델의 한계를 확인하기 어렵기 때문에 클래스별 오분류를 함께 살펴봤습니다.

**Akne(여드름)** 클래스는 약 94% 수준으로 안정적으로 분류됐지만, **Pigment(색소성 질환)와 Malign(악성 종양)** 사이에서는 오분류가 반복됐습니다. 또한 Enfeksiyonel과 Ekzama는 색조·경계·크기 등 시각적 특징이 유사해 촬영 조명이나 각도에 따라 구분이 어려운 사례가 있었습니다.

학습 정확도가 약 98%까지 올라간 반면 검증 정확도는 87% 내외에 머무르는 구간도 확인해 **잠재적 과적합 가능성**을 검토했습니다. 이를 바탕으로 추가 데이터 확보, 클래스별 증강, Early Stopping과 하이퍼파라미터 조정이 필요하다고 정리했습니다.

이 경험을 통해 저는 모델의 최고 점수보다 **어떤 클래스에서 왜 틀리는지 설명할 수 있는 평가 과정**이 더 중요하다는 점을 배웠습니다.

## 08. AWS Architecture & Deployment

모델을 노트북 안에 두지 않고 실제 서비스로 연결하기 위해 AWS 기반 배포 구조를 구성했습니다.

- **SageMaker Studio / JupyterLab**: 모델 실험 및 학습 환경
- **SageMaker Training Job / Endpoint**: 모델 학습 및 실시간 추론 서빙
- **Amazon S3**: 데이터·모델·추론 결과 저장
- **Amazon ECR**: Streamlit 애플리케이션 Docker 이미지 저장
- **ECS Fargate**: 컨테이너 기반 웹 애플리케이션 실행
- **CloudFront → ALB → ECS**: 사용자 HTTPS 접근 경로
- **Private Subnet · NAT Gateway · WAF**: 네트워크 및 트래픽 보안 구성
- **Lambda · Bedrock · Knowledge Base**: 사용자 설명을 보조하는 챗봇 기능 연결

Streamlit 앱은 Docker 이미지로 빌드해 ECR에 저장한 뒤 ECS Fargate에서 실행했습니다. ECS 서비스는 프라이빗 서브넷에 배치하고, NAT Gateway를 통해 SageMaker Endpoint와 S3에 접근하도록 구성했습니다.

최종 발표자료에서는 배포 과정을 Git 기반 자동 CI/CD가 아니라 **ECR 이미지 푸시 → ECS Task Definition 갱신 방식의 수동 배포**로 명확히 구분했습니다. 이를 통해 실제 배포 구조를 설계할 때 모델 서빙뿐 아니라 네트워크, 보안, 컨테이너 실행 환경까지 함께 고려했습니다.

## 09. What I Learned

Dr. Spot에서 가장 크게 배운 것은 모델 하나의 정확도를 높이는 것보다 **모델이 실제 서비스 안에서 신뢰할 수 있게 동작하는 전체 흐름을 설계하는 일**이 중요하다는 점입니다.

- 탐지와 분류를 연결하면서 **모델 간 입력·출력 인터페이스**를 고려했습니다.
- Accuracy뿐 아니라 F1-score, AUC, Confusion Matrix, ROC Curve를 함께 보며 **오류의 원인을 설명하는 평가 방식**을 익혔습니다.
- Recall 한계와 클래스 간 혼동을 확인하고 **Fail-Safe와 개선 방향**으로 연결했습니다.
- SageMaker 모델 서빙부터 ECS Fargate 웹서비스까지 연결하며 **AI 모델 → 추론 파이프라인 → 사용자 화면 → 클라우드 인프라**의 전체 구조를 경험했습니다.

[GitHub repository](https://github.com/minfy0-0/say_capybara)
