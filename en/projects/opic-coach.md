---
layout: case-study
lang: en
locale: en_US
project_slug: opic-coach
permalink: /en/projects/opic-coach/
translation_url: /projects/opic-coach/
title: OPIc Speaking Practice
eyebrow: Personal project / 2026
description: I brought the question materials, recordings, feedback, and personal notes I used for OPIc preparation into one place. I defined the practice flow, implemented it with AI tools, and revised the responses and interface by using it myself.
tags: [Next.js 16, React 19, TypeScript, Supabase, Groq API, Vercel]
facts:
  - {label: Project type, value: 'Personal web app'}
  - {label: My role, value: 'Practice flow, record access, API integration, implementation'}
  - {label: Question bank, value: '166 active topics · 219 active questions'}
  - {label: Feedback criteria, value: 'Relevance · Naturalness · Grammar · Tense'}
cover: /assets/img/portfolio/opic-screen.png
cover_alt: The OPIc speaking practice app in its original Korean interface
---

## Record an answer, revise it, and try again

When preparing for OPIc, I used different places to find questions, write scripts, record answers, and get feedback. I wanted one flow where I could listen, answer, see what needed work, and practice again.

This was a personal project. I defined the requirements, screen flow, and data structure, then connected the APIs and implemented the app. I used ChatGPT and other AI tools for coding and error analysis. After each revision, I practiced with the app myself to check the screens and responses.

The practice flow is:

1. Choose a topic and listen to a question.
2. Record an answer, then review or edit the automatic transcript.
3. Read feedback and revision examples, then practice again.
4. Sign in to save personal scripts and practice history.

## Shared questions, with personal records kept separate

I separated starting a practice session from storing personal materials. Guests can practice with shared questions without signing in. Signed-in users can save their own scripts and previous answers.

The shared question bank contains **166 active topics and 219 active questions**. Topics and questions are shared data; scripts, practice history, and profiles belong to individual users. I used Supabase Auth, Postgres, and Row Level Security to separate access to personal records, with email and Kakao sign-in.

These figures describe the question bank documented here. They are not user counts or measures of learning outcomes.

## Let users correct what the AI heard

I connected Orpheus with the Hannah voice for spoken questions, Whisper Large V3 Turbo for transcription, and GPT-OSS-120B for feedback. Users listen before seeing the question text and can play the audio up to twice.

A microphone check lets users inspect the input level and replay a short recording before practicing. This helps them find permission or input-device problems early.

I also avoided sending the transcript straight to evaluation. A transcription error can produce feedback on something the user never said, so **users review and edit the transcript before requesting feedback**.

## A score needed an explanation

In my own sessions, some low grammar scores lacked an explanation, and English sometimes appeared in sections that should have been in Korean. I separated the assessment criteria, reasons for scores, and revision examples so the feedback could help with the next answer.

| Criterion | What it checks |
| --- | --- |
| Relevance | Whether the answer addresses the question's main request |
| Naturalness | Whether the flow and phrasing sound natural |
| Grammar | Sentence structure or verb errors that affect meaning |
| Tense | Whether the answer chooses and maintains the tense the question needs |

Each criterion is shown on a 0–100 scale with an explanation. Grammar feedback selects up to three issues relevant to speaking and shows the original wording, a revision, and the reason. Tense feedback separates the expected tense, actual usage, good examples, and sentences to revise.

For exercises with a reference script, I went beyond literal text matching. The feedback **distinguishes paraphrases that preserve the main idea from missing content**, with coverage notes and a sentence-by-sentence comparison.

### Check the response after prompting

| Problem observed in responses | Handling added |
| --- | --- |
| Explanations returned in English where Korean was required | Inspect the fields and request one correction; show a prepared Korean fallback if it remains unresolved |
| Scores returned on a five-point or other scale instead of 100 points | Normalize scores to a 100-point scale |
| Simple spelling differences with the same pronunciation counted as grammar errors | Filter those items out during post-processing |

I checked actual responses and added validation, correction, and fallback messages rather than assuming prompt changes had solved the errors.

## Keep questions within a coherent situation

Initially, questions were selected randomly, which made practice feel disjointed. I changed mock tests to follow background-survey topics, unexpected topics, role-play, and advanced questions.

| Practice segment | Sequence |
| --- | --- |
| Background-survey and unexpected topics | Description → routines or habits → experiences within one topic |
| Role-play, questions 11–13 | Ask for information → solve a problem → describe a similar past experience within one situation |
| Advanced, questions 14–15 | Comparisons, changes, issues, and solutions, with tense hints |

I grouped related questions around park meetups, shopping, concerts, home repairs, travel, and hotels. Mock tests are available to signed-in users to support cost and history management. This describes the practice structure designed for this app.

## Changes from using the app myself

I also added retries when the question bank fails to load, Korean authentication messages, dark mode, and nickname editing. The dashboard brings together total practice sessions, average relevance and grammar scores, and saved-script counts so users can return to earlier work.

My checks focused on **the practice flow, record features, and the format of feedback responses**. These checks do not establish how the app’s scores relate to official OPIc results or whether practice with the app improves learning outcomes.

## Tools used

| Purpose | Technology |
| --- | --- |
| Interface | Next.js 16 · React 19 · TypeScript |
| Authentication and records | Supabase Auth · Postgres · Row Level Security |
| Spoken questions | Groq API · Orpheus / Hannah voice |
| Transcription | Whisper Large V3 Turbo |
| AI feedback | OpenAI GPT-OSS-120B through the Groq API |
| Deployment | Vercel |
