---
layout: case-study
lang: ko
project_slug: drspot
translation_url: /en/projects/drspot/
permalink: /projects/drspot/
title: Dr. Spot 피부 이미지 분석
eyebrow: 3인 팀 프로젝트 / 2025
description: 피부 병변을 찾고 분류하는 모델을 웹의 결과 화면까지 연결했습니다. 팀에서 YOLOv8 학습·검증, 성능과 오류 분석, 추론 통합과 AWS 배포 구조를 맡았습니다.
cover: /assets/img/portfolio/drspot-architecture.png
cover_alt: Dr. Spot의 모델 서빙과 웹 애플리케이션을 연결한 AWS 아키텍처
tags:
  - Python
  - PyTorch
  - YOLOv8
  - EfficientNet-B4
  - SageMaker
  - ECS Fargate
facts:
  - label: 진행 환경
    value: AWS Bio Healthcare AI Academy · 865시간
  - label: 팀 규모
    value: 3명
  - label: 맡은 일
    value: 모델 학습·평가, 추론 통합, AWS 배포
  - label: 분류 모델 검증
    value: EfficientNet-B4 정확도 86.6% · AUC 0.974
---

## 병변을 찾지 못한 입력은 어떻게 처리할까

AWS Bio Healthcare AI Academy에서 3인 팀으로 피부 병변 탐지·분류 서비스를 만들었습니다. 사용자가 이미지를 올리면 병변 후보를 찾고, 해당 영역을 분류해 결과를 보여주는 서비스입니다.

학습 지표를 확인하던 중 YOLOv8의 Precision과 mAP는 좋아졌지만 **Recall은 약 0.4 수준에 머물렀습니다.** 병변이 있어도 탐지하지 못하는 입력을 고려해야 했습니다. 탐지 결과가 있는 경우만 연결해서는 전체 사용 흐름을 구성할 수 없었습니다.

그래서 탐지 영역이 나오지 않으면 원본 이미지를 분류기로 넘기는 대체 경로를 두었습니다. 이는 탐지 누락 시 다음 처리로 이어지는 경로이며, 탐지 성능 자체가 개선됐다는 의미는 아닙니다.

## 팀에서 맡은 범위

최종 발표자료에 정리한 제 역할은 다음과 같습니다.

- YOLOv8 탐지 모델 학습·검증과 하이퍼파라미터 튜닝
- Confusion Matrix·ROC Curve 시각화와 모델별 오류 분석
- YOLOv8 탐지 결과를 EfficientNet 분류 입력으로 넘기는 추론 통합
- AWS 배포 아키텍처 설계·구현과 웹 추론 서비스 연결

데이터셋 준비와 여러 분류 모델의 비교는 팀 단위 작업이었습니다. 팀은 원천 이미지 **37,961건**을 점검하며 품질·해상도·중복·클래스 균형을 정리했습니다. 탐지 데이터는 Roboflow에서 약 **1,200장에 수기 라벨링**하고 Train 80% / Validation 20%로 나눴습니다. 저는 이 데이터로 탐지 모델을 학습·검증하고, 추론과 배포를 연결하는 부분에 집중했습니다.

## 탐지와 분류의 입력을 맞췄습니다

서비스는 두 모델을 순서대로 사용합니다.

1. YOLOv8이 병변 후보 영역과 신뢰도 점수를 반환합니다.
2. 탐지된 영역을 잘라 EfficientNet-B4에 전달합니다.
3. EfficientNet-B4가 6개 피부 질환 클래스로 분류합니다.
4. Streamlit에서 결과를 표시합니다.

탐지 영역이 없는 경우에는 2단계의 입력을 원본 이미지로 바꿉니다. 저는 두 모델 사이의 입력·출력을 연결하고 이미지 업로드부터 결과 화면까지 동작하는 경로를 구성했습니다.

<img src="{{ '/assets/img/portfolio/drspot-result.png' | relative_url }}" alt="Dr. Spot에서 피부 이미지 분석 결과를 보여주는 화면" width="606" height="450" loading="lazy" decoding="async">

YOLOv8 학습에서는 Box Loss, Classification Loss, DFL Loss와 Precision, Recall, mAP@50, mAP@50–95를 함께 확인했습니다. 대체 처리 경로를 둔 판단은 이 과정에서 확인한 Recall의 한계에서 나왔습니다.

<img src="{{ '/assets/img/portfolio/drspot-yolo-training.png' | relative_url }}" alt="YOLOv8 학습·검증의 손실, Precision, Recall, mAP 변화" width="1280" height="640" loading="lazy" decoding="async">

## 가장 높은 평균 점수와 반복되는 오분류를 함께 봤습니다

팀은 다섯 분류 모델을 동일한 검증 기준으로 비교했습니다. 저는 결과를 Confusion Matrix와 ROC Curve로 시각화하고 클래스별 오분류를 확인했습니다.

| 분류 모델 | 검증 정확도 | F1-score | AUC |
| --- | ---: | ---: | ---: |
| **EfficientNet-B4** | **86.6%** | **86.5%** | **0.974** |
| EfficientNet-B3 | 85.8% | 85.6% | 0.971 |
| ConvNeXt-Tiny | 84.1% | 84.3% | 0.969 |
| DenseNet-121 | 83.3% | 83.5% | 0.964 |
| Vision Transformer | 71.9% | 72.5% | 0.931 |

검증 결과가 가장 좋았던 EfficientNet-B4를 최종 분류 모델로 선택했습니다. 다만 평균 점수가 높아도 질환 사이의 혼동은 남아 있었습니다.

- Akne(여드름)는 약 94% 수준으로 분류됐지만 Pigment(색소성 질환)와 Malign(악성 종양) 사이에서는 오분류가 반복됐습니다.
- Enfeksiyonel과 Ekzama는 색조·경계·크기 등 특징이 비슷해 조명이나 촬영 각도에 따라 구분이 어려운 사례가 있었습니다.
- 학습 정확도가 약 98%인 반면 검증 정확도는 87% 내외에 머무르는 구간이 있어 과적합 가능성도 검토했습니다.

<img src="{{ '/assets/img/portfolio/drspot-model-comparison.png' | relative_url }}" alt="다섯 분류 모델의 검증 결과 비교" width="601" height="417" loading="lazy" decoding="async">

추가 데이터 확보, 클래스별 증강, Early Stopping과 하이퍼파라미터 조정을 개선 과제로 정리했습니다. 위 표는 **분류 모델의 프로젝트 검증 데이터 결과**입니다. 탐지부터 화면 출력까지의 전체 서비스 정확도나 의료 현장의 진단 성능으로 해석하지 않았습니다.

## 웹에서 모델을 호출할 수 있도록 배포했습니다

모델 실험과 학습에는 SageMaker Studio·JupyterLab과 Training Job을 사용하고, 추론은 SageMaker Endpoint로 연결했습니다. Streamlit 앱은 Docker 이미지로 빌드해 ECR에 저장한 뒤 ECS Fargate에서 실행했습니다.

<img src="{{ '/assets/img/portfolio/drspot-architecture.png' | relative_url }}" alt="SageMaker 모델 서빙, S3 저장소, ECS Fargate 웹서비스의 연결 구조" width="992" height="918" loading="lazy" decoding="async">

| 구성 | 역할 |
| --- | --- |
| SageMaker | 모델 실험·학습과 실시간 추론 서빙 |
| S3 | 데이터·모델·추론 결과 저장 |
| ECR · ECS Fargate | 웹 애플리케이션 이미지 저장·실행 |
| CloudFront · ALB | 사용자 HTTPS 접근 경로 |
| 프라이빗 서브넷 · NAT Gateway · WAF | 네트워크와 트래픽 보안 구성 |

ECS 서비스는 프라이빗 서브넷에 배치하고 NAT Gateway를 통해 SageMaker Endpoint와 S3에 접근하도록 구성했습니다. 서비스에는 Lambda·Bedrock·Knowledge Base를 이용한 설명 보조 챗봇 연결도 포함됐습니다.

배포는 **ECR 이미지 푸시 → ECS Task Definition 갱신**으로 진행하는 수동 방식이었습니다.

## 결과와 남은 문제

이미지 업로드, 탐지와 분류, 결과 표시를 연결하고 AWS 배포 구조를 구성했습니다.

대체 처리 경로가 있어도 탐지 Recall과 클래스 간 혼동은 남아 있습니다. 구현한 서비스 경로와 모델 검증 결과, 이후 개선이 필요한 부분을 구분해 기록했습니다.

[프로젝트 GitHub 저장소](https://github.com/minfy0-0/say_capybara)
