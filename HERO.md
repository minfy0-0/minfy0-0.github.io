# Block hero and scrolling portfolio

[DESIGN_BRIEF.md](DESIGN_BRIEF.md), refined by the user's supplied references and corrections,
is the design authority. The upper hero centers the existing live HTML introduction and links.
Below it, a connected stepped cobalt plane, thin outlined window, restrained grid, and one pixel cursor
share a modular layout with a single smooth interlocking four-corner sculpture.
The composition is decorative; the four project records are always available by scrolling.
Existing Korean and English portfolio narrative, case-study Markdown, and URLs are preserved.

The user rejected the previous gallery because its arrangement repeated the KUUM reference.
Combine visual rules from the references, not a specific scene or a collection of unrelated stickers:
Toss for readable whitespace, Weblium for one large stepped plane, Blue Skies for a thin window outline
and a pixel accent, the Lego-effect reference for a small shared grid, KUUM for material only,
and NETSPA for the existing section and process rhythm below the hero.

## Source and build

- Hero and primary links: `_includes/workbench.html`
- Locale selection: `_layouts/home.html`
- Project records and personal background: `_includes/home-ko.html`, `_includes/home-en.html`
- Shared interface labels: `_data/interface.yml`
- Shared home styles: `assets/css/workbench.css`
- Active hero styles: `assets/css/modular-hero.css`, loaded after `workbench.css`
- Optional pointer parallax: `src/workbench.js`
- Compiled bundle: `assets/js/workbench.js`
- Transparent sculpture: `assets/img/hero/modular-knot-v1.png` (1254 × 1254; 1,255,529 bytes)
- Local variable font: `assets/fonts/SUIT-Variable.woff2` (624,536 bytes)
- Independent language control: `_includes/language-switcher.html`
- Pending content and verification: [DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md)

```sh
npm ci
npm run build:workbench
python -m pip install -r requirements-submission.txt
python scripts/export_submission.py
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Commit the compiled bundle with source changes. GitHub Pages uses the prebuilt asset.
The current bundle is approximately 5.6 KB, including project navigation. It does not import Three.js or require WebGL.
`src/gallery-scene.js` is an optional, unshipped experiment. The active homepage combines HTML/CSS
with one transparent PNG; it does not use the old gallery `<picture>`.
Both `_includes/head.html` and the static exporter load `modular-hero.css` after `workbench.css`.

## Layout and interaction

The hero fills the opening viewport and exposes its introduction and working links immediately.
The scene does not require a click, drag, project selection, or loading screen.
Only slight pointer-following movement is allowed. The background is not a button or keyboard stop.
Project anchors and case-study links remain normal HTML links.

After the introduction strip, JavaScript enhances the four project sections into a horizontal selector. Without JavaScript, all four remain readable in a vertical list.
Desktop sections alternate the description and framed screenshot. At 375px the screenshot follows
its description, with no horizontal scrolling. Existing metrics keep their original scope and labels.
The four process cards use line icons, followed by the experience timeline, background, and navy contact section.

The transparent sculpture and CSS composition appear without a renderer startup or hidden-content state.
JavaScript shifts the whole lower composition by a few pixels for a fine mouse pointer. It respects reduced motion,
pauses when offscreen or hidden, and schedules animation frames only while movement settles.
Without JavaScript, the image, HTML content, and links remain visible. Final browser verification must cover
these behaviors and ensure that the lower composition does not overlap copy or links at 375px.

Use 32/64px steps to relate the large plane, small grid, and outlines. Mobile reduces the secondary grid
and keeps one outline rather than adding more cards. The outlined window is decorative and has no fake controls.

SUIT is hosted locally and preloaded. Use moderate font weights and compact buttons; do not restore the
oversized heavy text or toy-block appearance rejected in the visual feedback. The sculpture contains
no Lego-style studs, labels, branding, or text. It was generated with the built-in image tool as a transparent asset.
The previous `block-gallery-v1.png` and `block-gallery-mobile-v1.png` remain archived in the repository,
but the current homepage does not reference or export them.

KR / EN stays in a separate fixed control at the bottom-right, outside the navigation.
Keep reciprocal locale URLs, project fragments, and reading-position restoration working.

## Screenshots and pending content

`assets/img/portfolio/ask1-screen.jpg` is the original JPEG extracted from `ask1-overview.svg`:
871 × 1145 pixels, with no cropping, repainting, or translation. It shows the actual ASK1 lookup interface.
English pages can use the same Korean service UI screenshot, as with the other original screenshots.
The English ASK1 SVG files are translated diagrams, not translated service screenshots.

Email and the target-role line remain blank at the user's request. Do not invent either value or render
an empty link, placeholder, disabled button, or empty target-role label. GitHub remains available;
an email action is conditional on a future confirmed address.

The copy comparison passed for 35 existing fragments per language, 70 total. The current static export
passed for 12 pages and 23 assets. The current modular hero was checked in Korean and English at
1440px and 375 × 667px, with no horizontal overflow or copy/art overlap. Track results in
[DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md).

The previous Claude source review has arrived. Applicable language-label and motion feedback was
checked against current code and applied; it is not a visual review of this new composition.

Earlier hero experiments remain in the repository but are not loaded by the homepage.
SUIT OFL license and historical Three.js notice: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).


## 프로젝트 선택 연결

히어로의 ‘프로젝트 보기’는 같은 #work를 사용합니다. 프로젝트 영역은 2026-11-04 추가 요청으로
가로 슬라이드가 되었으며, src/project-carousel.js를 workbench 번들에 포함합니다. 번들 전체는
약 5.6KB이고, 자동 넘김·키보드·언어 유지 동작과 검증 범위는 DESIGN_IMPLEMENTATION.md를 참고합니다.
히어로 자체의 문구·그래픽·미세 움직임은 이 변경에서 유지했습니다.
