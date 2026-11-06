# Web design proposals — 2026-11-04

These are preserved, interactive design alternatives. On 2026-11-04 the user selected A's hero composition and C's project index, with Sculptural typography, a quieter palette, meaningful skill symbols, and no process section. The combined direction is at `/` and `/en/`.
The original proposal pages and before/after Impeccable snapshots remain available.

## Shared truth

- Audience: companies reviewing Minseo Kim's work across biotechnology, business and computing.
- Preserve Korean and English factual copy, project scope, metrics and verified skill content.
- Name: MINSEO KIM. No invented email, application direction, tool proficiency or new slogan.
- All alternatives use the existing SUIT font so the comparison concerns web composition.
- Project browsing remains horizontal, with explicit controls and optional 8-second autoplay.
- Language controls stay separate from site navigation.
- Detail links lead to the existing case-study pages; this round proposes the whole home page.

## Three directions

### A — Cobalt Assembly

An editorial poster built from flat modules. A large name and existing introduction occupy the left half of a cobalt field; four precisely shaped forms compose the right half. The same modular grammar becomes an asymmetric skills layout. Project imagery moves to the left of the story. Pointer entry assembles the graphic; reduced motion retains a static composition.

### B — Night Gallery

A dark exhibition space where actual project screens are the visual material. The heading and introduction sit above overlapping project windows; each window selects its project. Project images have more space than the narrative column. Skills become open horizontal rows, and the experience section changes to a light ground.

### C — Open Index

A bright editorial index. The name and introduction sit beside four offset project tiles which act as real project shortcuts. Projects use a left-hand selection rail, then an image, title and record on the right. Skills follow a stepped block rhythm. On mobile the rail becomes a horizontal project selector.

## Source and build

`scripts/build_web_studies.py` extracts existing rendered content from `dist/index.html` and `dist/en/index.html`, preserving the project/skills/process/experience/contact content. It writes six variant pages and this comparison interface into `dist/web-studies/`. Run it after the regular exporter. The script does not overwrite the main pages, stylesheet, or JavaScript.

Existing raster assets are original project screenshots from `assets/img/portfolio/`. The poster shapes are CSS geometry; no generated or stock images are introduced. The existing carousel is copied unchanged from `src/project-carousel.js`.

No public deployment. To reproduce the original proposals, use `--source ../design-review/selected-direction-2026-11-04/before/site`; otherwise the builder uses current rendered copy. The existing proposal pages have been preserved for comparison.
