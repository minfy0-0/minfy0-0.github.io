---
layout: case-study
lang: en
locale: en_US
project_slug: drspot
permalink: /en/projects/drspot/
translation_url: /projects/drspot/
title: Dr. Spot Skin Image Analysis
eyebrow: Team of three / 2025
description: We connected skin-lesion detection and classification models to a web results screen. My role covered YOLOv8 training and validation, performance and error analysis, inference integration, and the AWS deployment architecture.
cover: /assets/img/portfolio/drspot-screen.png
cover_alt: The original Dr. Spot skin image analysis results screen
tags: [Python, PyTorch, YOLOv8, EfficientNet-B4, SageMaker, ECS Fargate]
facts:
  - {label: Program, value: 'AWS Bio Healthcare AI Academy · 865 hours'}
  - {label: Team size, value: 'Three people'}
  - {label: My role, value: 'Model training and evaluation, inference integration, AWS deployment'}
  - {label: Classifier validation, value: 'EfficientNet-B4 accuracy 86.6% · AUC 0.974'}
---

## What happens when no lesion is detected?

At the AWS Bio Healthcare AI Academy, our team of three built a skin-lesion detection and classification service. A user uploads an image; the service finds candidate lesion regions, classifies them, and displays the results.

While reviewing training metrics, I found that YOLOv8's precision and mAP improved, but **recall stayed around 0.4**. We needed to account for images where a lesion was present but went undetected. Connecting only successful detections would leave a gap in the user flow.

I added a fallback that sends the original image to the classifier when no region is detected. This keeps processing moving after a missed detection; it does not mean detection performance itself improved.

## My responsibilities within the team

My role, as documented in our final presentation, covered:

- YOLOv8 training, validation, and hyperparameter tuning
- Confusion-matrix and ROC-curve visualization, and model error analysis
- Integrating YOLOv8 outputs with EfficientNet classification inputs
- Designing and implementing the AWS deployment architecture and connecting web inference

Dataset preparation and comparison of the classification models were team efforts. The team reviewed **37,961 source images** for quality, resolution, duplicates, and class balance. Approximately **1,200 images were manually annotated** in Roboflow for detection, with an 80% training / 20% validation split. I focused on training and validating the detector with this data, then connecting inference and deployment.

## Connecting detection to classification

The service uses two models in sequence:

1. YOLOv8 returns candidate lesion regions and confidence scores.
2. Detected regions are cropped and passed to EfficientNet-B4.
3. EfficientNet-B4 classifies them into six skin-condition classes.
4. Streamlit displays the results.

When no region is detected, the original image replaces the input at step 2. I connected the models' inputs and outputs and built the path from image upload to the results screen.

<img src="{{ '/assets/img/portfolio/drspot-result.png' | relative_url }}" alt="The original Dr. Spot skin image analysis results screen" width="606" height="450" loading="lazy" decoding="async">

During YOLOv8 training, I reviewed box loss, classification loss, DFL loss, precision, recall, mAP@50, and mAP@50–95 together. The recall limitation observed here led to the fallback path.

<img src="{{ '/assets/img/portfolio/drspot-yolo-training.png' | relative_url }}" alt="YOLOv8 training and validation curves for losses, precision, recall, and mAP" width="1280" height="640" loading="lazy" decoding="async">

## Look at recurring errors alongside the highest average score

The team compared five classifiers using the same validation criteria. I visualized the results with confusion matrices and ROC curves and examined misclassifications by class.

| Classifier | Validation accuracy | F1-score | AUC |
| --- | ---: | ---: | ---: |
| **EfficientNet-B4** | **86.6%** | **86.5%** | **0.974** |
| EfficientNet-B3 | 85.8% | 85.6% | 0.971 |
| ConvNeXt-Tiny | 84.1% | 84.3% | 0.969 |
| DenseNet-121 | 83.3% | 83.5% | 0.964 |
| Vision Transformer | 71.9% | 72.5% | 0.931 |

EfficientNet-B4 had the strongest validation results and was selected as the final classifier. However, a high average score did not remove confusion between conditions.

- Akne (acne) was classified at roughly 94%, while errors recurred between Pigment (pigment-related conditions) and Malign (malignant tumors).
- Enfeksiyonel and Ekzama shared features such as color, boundaries, and size, with some cases difficult to distinguish under different lighting or camera angles.
- Training accuracy reached around 98% while validation accuracy stayed near 87% in some intervals, prompting a review of possible overfitting.

<img src="{{ '/assets/img/portfolio/drspot-model-comparison.png' | relative_url }}" alt="Comparison of validation results for five classification models" width="601" height="417" loading="lazy" decoding="async">

We recorded additional data collection, class-specific augmentation, early stopping, and hyperparameter adjustments as future improvements. The table reports **classifier results on the project's validation data**. These are not end-to-end service accuracy figures or measures of clinical diagnostic performance.

## Making the models callable from the web

We used SageMaker Studio, JupyterLab, and Training Jobs for experimentation and training, with a SageMaker Endpoint for inference. The Streamlit app was built as a Docker image, stored in ECR, and run on ECS Fargate.

<img src="{{ '/assets/img/portfolio/drspot-architecture.png' | relative_url }}" alt="Architecture connecting SageMaker inference, S3 storage, and the ECS Fargate web app" width="992" height="918" loading="lazy" decoding="async">

| Component | Role |
| --- | --- |
| SageMaker | Model experimentation, training, and real-time inference |
| S3 | Data, models, and inference results |
| ECR · ECS Fargate | Storing and running the web application image |
| CloudFront · ALB | HTTPS access for users |
| Private subnets · NAT Gateway · WAF | Network and traffic security configuration |

The ECS service ran in private subnets and accessed the SageMaker Endpoint and S3 through a NAT Gateway. The service also included an explanation-support chatbot connected through Lambda, Bedrock, and a Knowledge Base.

Deployment was manual: **push an image to ECR → update the ECS Task Definition**.

## What worked, and what remained unresolved

I connected image upload, detection, classification, and result display, and implemented the AWS deployment architecture.

The fallback did not remove the detector's recall limitation or confusion between classes. I documented the implemented service path, the model validation results, and the issues that still needed improvement separately.

[Project on GitHub](https://github.com/minfy0-0/say_capybara)
