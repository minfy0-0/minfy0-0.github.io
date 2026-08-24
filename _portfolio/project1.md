---
caption:
  title: Dr. Spot
  subtitle: AI 피부 병변 탐지·분류 웹 플랫폼
  thumbnail: /assets/img/portfolio/drspot-thumb.png

title: Dr. Spot
subtitle: 피부 이미지 데이터의 품질을 정비하고 모델 성능을 비교해 AWS 기반 분석 서비스로 연결한 팀 프로젝트
image: /assets/img/portfolio/drspot-result.png
alt: Dr. Spot Analysis Result
---

### 🧭 Project Overview
AWS Bio Healthcare AI Academy에서 3인 팀으로 수행한 피부 병변 분석 프로젝트입니다.  
단순히 모델 정확도를 높이는 것보다 **데이터 품질 → 모델 평가 → 오류 분석 → 서비스 연결**의 전체 흐름을 안정적으로 만드는 데 집중했습니다.

* **교육 과정:** 865시간
* **팀 구성:** 3명
* **주요 도구:** Python · PyTorch · YOLOv8 · EfficientNet · SageMaker · S3 · ECS/ECR · Streamlit

---

### 🧹 1. Data Quality & Integrity
원천 이미지 **37,961개**를 정리해 최종 **25,813개** 분석 데이터셋을 구축했습니다.

* 해시 기반 중복 검사를 통해 **2,700건 이상의 train/test leakage 후보**를 제거
* 밝기·대비·해상도 차이를 정리해 이미지 품질을 표준화
* 편향된 6개 클래스를 클래스당 약 3,000개 수준으로 재구성해 학습 데이터 불균형을 완화

이 과정을 통해 모델 성능 수치가 데이터 중복이나 품질 편차 때문에 과대평가되지 않도록 평가 기반을 정비했습니다.

---

### 📊 2. Model Evaluation
EfficientNet, DenseNet, ConvNeXt, Vision Transformer 등 **5개 후보 모델**을 아래 KPI로 비교했습니다.

* Accuracy
* AUC
* F1-score
* Precision
* Recall

최종적으로 **EfficientNet-B4**가 가장 안정적인 성능을 보였습니다.

| Metric | Result |
|---|---:|
| Accuracy | **86.6%** |
| F1-score | **86.5%** |
| AUC | **0.974** |

Confusion Matrix와 ROC Curve를 함께 확인해 단일 정확도만으로 모델을 선택하지 않고, 클래스별 오분류 패턴까지 분석했습니다.

---

### 🔗 3. Detection → Classification Pipeline

![Architecture](/assets/img/portfolio/drspot-architecture.png)

서비스에서는 **YOLOv8 탐지 → EfficientNet-B4 분류**의 2단계 흐름을 구성했습니다.

1. 사용자가 피부 이미지를 업로드
2. YOLOv8이 병변 영역(ROI)을 탐지
3. EfficientNet-B4가 질환 클래스를 분류
4. Streamlit 화면에서 분석 결과를 제공

AWS에서는 SageMaker 기반 모델 서빙과 S3, ECS/ECR, CloudFront 등을 활용해 분석 결과가 실제 웹 화면으로 이어지는 과정을 경험했습니다.

---

### 🎯 My Contribution
* 이미지 데이터 **중복 제거·전처리·클래스 균형 조정**
* 5개 모델의 **성능 지표 시각화 및 비교**
* Confusion Matrix · ROC Curve 기반 **오류 분석**
* YOLOv8 탐지 모델 학습·검증 지원
* YOLO + EfficientNet **추론 파이프라인 통합 지원**
* Slack · Notion · 주간 미팅을 활용한 3인 팀 협업

---

### 💡 What I Learned
좋은 모델을 고르는 것보다 먼저 **평가 가능한 데이터를 만드는 과정**이 중요하다는 점을 배웠습니다.  
또한 Accuracy 하나만 보는 대신 여러 KPI와 오류 패턴을 함께 비교해야 실제 개선 방향을 찾을 수 있었습니다.  
이 경험을 통해 데이터 품질, 모델 성능, 서비스 구현을 각각 따로 보지 않고 하나의 분석 파이프라인으로 연결하는 관점을 갖게 되었습니다.
