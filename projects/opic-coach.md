---
layout: case-study
title: OPIc AI Speaking Coach
eyebrow: PERSONAL AI WEB PRODUCT · 2026
description: 실제 OPIc 학습 과정에서 반복되는 불편을 직접 정의하고, 질문 음성부터 답변 전사·AI 피드백·연습 기록까지 하나의 학습 흐름으로 만든 개인 웹 프로젝트입니다.
tags:
  - Next.js 16
  - React 19
  - TypeScript
  - Supabase
  - Groq API
  - Vercel
facts:
  - label: Question bank
    value: 74 active topics · 264 question variants
  - label: Speech pipeline
    value: Orpheus TTS · Whisper Large V3 Turbo · GPT-OSS-120B
  - label: Data
    value: Supabase Auth · Postgres · Row Level Security
  - label: Role
    value: Product planning · UX flow · Full-stack implementation
cover: /assets/img/portfolio/opic-coach.svg
cover_alt: OPIc AI Speaking Coach product flow
permalink: /projects/opic-coach/
---

## 01. 시작점 — 공부하면서 불편한 지점을 직접 제품으로 만들기

OPIc를 준비하면서 질문 자료, 개인 스크립트, 녹음, 피드백 기록이 서로 분리되어 있어 연습 흐름이 자주 끊겼습니다. 단순히 AI에게 답안을 평가받는 기능보다, **실제 시험처럼 질문을 듣고 말한 뒤 피드백을 받고 다시 연습하는 전체 경험**이 필요하다고 판단했습니다.

그래서 이 프로젝트의 목표를 “AI 기능을 많이 넣는 것”이 아니라 다음 흐름을 한 서비스 안에서 자연스럽게 연결하는 것으로 잡았습니다.

1. 문제은행에서 주제 선택
2. 실전 모드 / 암기 모드 선택
3. 질문을 음성으로 최대 2회 재생
4. 사용자가 직접 녹음 시작·종료
5. 음성을 텍스트로 전사하고 필요하면 직접 수정
6. 질문 적합도·자연스러움·문법 중심의 AI 피드백 제공
7. 로그인 사용자의 스크립트와 연습 기록 저장

## 02. 정보 구조 — 문제은행과 개인 데이터를 분리

공용 문제은행은 **74개 활성 주제와 264개 활성 질문 변형**으로 구성했습니다. 반면 개인 스크립트와 연습 기록은 사용자별 데이터이므로 Supabase에서 분리해 관리했습니다.

- `topics` — 공용 문제 주제
- `questions` — 공용 질문 변형
- `scripts` — 로그인 사용자별 개인 스크립트
- `practice_records` — 사용자별 연습 기록 및 피드백
- `profiles` — 사용자 프로필

게스트도 공용 문제은행은 사용할 수 있지만, 개인 데이터는 **Supabase Row Level Security**를 적용해 본인의 데이터만 접근하도록 설계했습니다.

## 03. AI 기능 — 한 번의 답변이 하나의 연습 사이클로 이어지도록

### Question TTS

질문은 화면에 바로 보여주지 않고 음성으로 들려줍니다. 실제 시험 상황을 반영하면서도 사용자가 놓쳤을 때 다시 들을 수 있도록 최대 2회 재생 구조를 적용했습니다.

### Speech-to-Text

녹음된 답변은 **Whisper Large V3 Turbo**로 전사합니다. 자동 전사 결과가 완벽하지 않을 수 있기 때문에 사용자가 피드백 전에 텍스트를 직접 수정할 수 있도록 했습니다.

### LLM Feedback

현재 배포 설정은 **GPT-OSS-120B**를 사용합니다. 스크립트 유무에 따라 평가 기준도 달라집니다.

- 스크립트 없음 — 질문 적합도, 자연스러움, 문법 중심
- 스크립트 있음 — 재현도, 핵심 내용, paraphrase 비교까지 추가

초기 사용 과정에서는 피드백이 지나치게 추상적이거나 영어로 출력되는 문제, 문법 점수가 낮아도 이유가 충분히 설명되지 않는 문제를 발견했습니다. 이후 프롬프트와 서비스 로직을 반복 수정해 **사용자가 다음 답변에서 무엇을 고쳐야 하는지 알 수 있는 피드백**을 목표로 개선했습니다.

## 04. 제품 관점에서의 개선

이 프로젝트에서 중요했던 것은 모델을 붙이는 것보다 실제 사용 흐름을 계속 관찰한 일이었습니다.

- 질문 변형 범위가 지나치게 넓어지지 않도록 문제은행 구조와 생성 범위를 조정
- 실전 연습과 암기 연습의 목적이 다르므로 모드를 분리
- 사용자가 원할 때만 녹음을 시작하도록 RECORD / STOP 흐름을 명확화
- 로그인 없이도 바로 체험할 수 있도록 게스트 모드 제공
- 로그인 사용자는 스크립트와 연습 결과를 누적해 다시 확인할 수 있도록 설계

## 05. 기술 구성

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 16 · React 19 · TypeScript |
| Auth / DB | Supabase Auth · Postgres · RLS |
| TTS | Groq API · Orpheus English TTS |
| STT | Whisper Large V3 Turbo |
| Feedback | GPT-OSS-120B |
| Deployment | Vercel |

## 06. 이 프로젝트에서 증명한 것

이 프로젝트는 AI API 사용 자체보다 **사용자 문제를 정의하고, 데이터 구조와 AI 파이프라인을 설계한 뒤 실제 사용을 통해 계속 수정한 경험**에 가깝습니다.

특히 문제은행, 사용자 데이터, 음성 처리, LLM 피드백을 하나의 제품 흐름으로 연결하면서 분석 역량뿐 아니라 웹서비스의 UX와 데이터 구조를 함께 고민했습니다.
