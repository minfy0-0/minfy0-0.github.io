---
caption:
  title: Dr. Spot
  subtitle: AI 피부 병변 탐지·분류 웹 플랫폼
  thumbnail: /assets/img/portfolio/drspot-thumb.png

title: Dr. Spot
subtitle: 의료 이미지 기반 AI 모델을 평가하고 추론 파이프라인과 AWS 서비스 흐름으로 연결한 팀 프로젝트
image: /assets/img/portfolio/drspot-result.png
alt: Dr. Spot Analysis Result
---

### 🧭 Project Overview
AWS Bio Healthcare AI Academy에서 3인 팀으로 수행한 피부 병변 탐지·분류 프로젝트입니다.  
의료 이미지 데이터를 바탕으로 **탐지 모델 학습·검증 → 분류 모델 성능 비교 → 오류 분석 → 추론 파이프라인 통합 → 서비스 연결**의 흐름을 경험했습니다.

* **교육 과정:** 865시간
* **팀 구성:** 3명
* **주요 도구:** Python · PyTorch · YOLOv8 · EfficientNet · SageMaker · S3 · ECS/ECR · Streamlit

---

### 🔎 1. Detection Model Training & Validation
YOLOv8을 활용해 피부 이미지에서 병변 영역을 탐지하는 모델의 학습·검증을 지원했습니다.

탐지 결과가 이후 분류 모델의 입력으로 이어지는 구조를 이해하고, 전체 서비스 흐름에서 탐지 단계가 안정적으로 동작하는지 확인했습니다.

---

### 📊 2. Model Evaluation & Error Analysis
EfficientNet, DenseNet, ConvNeXt, Vision Transformer 등 후보 분류 모델의 성능 지표를 비교·시각화했습니다.

* Accuracy
* AUC
* F1-score
* Precision
* Recall

최종적으로 **EfficientNet-B4**가 안정적인 성능을 보였으며 다음 결과를 기록했습니다.

| Metric | Result |
|---|---:|
| Accuracy | **86.6%** |
| F1-score | **86.5%** |
| AUC | **0.974** |

Confusion Matrix와 ROC Curve를 함께 확인해 단일 정확도만 보는 대신 클래스별 오분류 패턴과 모델의 오류 특성을 분석했습니다.

---

### 🔗 3. Detection → Classification Pipeline

![Architecture](/assets/img/portfolio/drspot-architecture.png)

서비스에서는 **YOLOv8 탐지 → EfficientNet-B4 분류**의 2단계 추론 흐름을 구성했습니다.

1. 사용자가 피부 이미지를 업로드
2. YOLOv8이 병변 영역(ROI)을 탐지
3. EfficientNet-B4가 질환 클래스를 분류
4. Streamlit 화면에서 분석 결과를 제공

YOLOv8 탐지 결과와 EfficientNet-B4 분류 모델을 연결하는 추론 파이프라인 통합을 지원했고, AWS에서는 SageMaker 기반 모델 서빙과 S3, ECS/ECR 등을 활용해 분석 결과가 실제 웹 화면으로 이어지는 배포 구조를 경험했습니다.

---

### 🎯 My Contribution
* YOLOv8 탐지 모델 **학습·검증 지원**
* 분류 모델의 **성능 지표 시각화 및 비교**
* Confusion Matrix · ROC Curve 기반 **오류 분석**
* YOLO + EfficientNet **추론 파이프라인 통합 지원**
* AWS 기반 서비스 배포 구조 구현 참여
* Git · Notion · Slack을 활용한 3인 팀 협업 및 실험 결과 공유

---

### 💡 What I Learned
모델 성능을 판단할 때 하나의 지표만 보는 것보다 여러 지표와 오류 패턴을 함께 확인해야 실제 개선 방향을 찾을 수 있다는 점을 배웠습니다.  
또한 탐지와 분류 모델을 각각 학습하는 데서 끝나지 않고, 두 모델을 하나의 추론 흐름으로 연결하고 서비스 화면까지 전달하는 과정에서 **AI 모델을 실제 서비스로 연결하는 관점**을 익혔습니다.
