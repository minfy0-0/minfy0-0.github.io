"""Build isolated web design proposals from the current bilingual portfolio.

Does not export or modify the production portfolio. Requires an existing dist.
"""
from pathlib import Path
import re
import shutil
import argparse
from html import escape

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'design-refs' / 'web-studies'
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, default=ROOT / 'dist', help='Rendered site to use as proposal content; pass a before snapshot to reproduce the original studies.')
args = parser.parse_args()
OUT = ROOT / 'dist' / 'web-studies'
OUT.mkdir(parents=True, exist_ok=True)
for name in ['studies.css', 'studies.js', 'index.html', 'board.css', 'board.js']:
    shutil.copy2(SOURCE / name, OUT / name)
shutil.copy2(ROOT / 'src' / 'project-carousel.js', OUT / 'carousel.js')

ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>'
SLUGS = ['opic-coach', 'drspot', 'ask1-pipeline', 'seoul-cafe']
ART = '''<div class="poster-art" aria-hidden="true">
<div class="art-cell art-stair"><i></i><i></i><i></i></div>
<div class="art-cell art-orbit"><i></i></div>
<div class="art-cell art-check"><i></i><i></i><i></i><i></i></div>
<div class="art-cell art-bracket"><i></i></div>
<span class="art-sign">Portfolio / 2026</span></div>'''

def between(text, start, end):
    return text[text.index(start):text.index(end, text.index(start))]

for lang in ['ko', 'en']:
    original = (args.source / ('en/index.html' if lang == 'en' else 'index.html')).read_text(encoding='utf-8')
    intro = re.search(r'<p class="hero-intro">(.*?)</p>', original, re.S).group(1)
    header = re.search(r'<header class="bench-header[^\"]*">(.*?)</header>', original, re.S).group(1)
    header = re.sub(r'href="/(?:en/)?#', 'href="#', header)
    actions = re.search(r'<div class="hero-actions">(.*?)</div>', original, re.S).group(1)
    about = between(original, '<section class="intro-band"', '<section class="project-records"')
    work = between(original, '<section class="project-records"', '<section class="skill-section"')
    rest_start = '<section class="work-process"' if '<section class="work-process"' in original else '<section class="bench-about"'
    skills = between(original, '<section class="skill-section"', rest_start)
    skills = re.sub(r'<span class="skill-number".*?</span>', '', skills)
    rest = between(original, rest_start, '</main>')
    rest = re.sub(r'<span class="section-index">.*?</span>', '', rest)
    images = re.findall(r'<figure class="dossier-screen">.*?(<img .*?>)', work, re.S)
    titles = re.findall(r'data-project-target="[^"]+"><span[^>]*>.*?</span><span>(.*?)</span>', work, re.S)
    if len(titles) != 4 or len(images) != 4:
        raise ValueError('Expected four projects from existing content')
    view = '프로젝트 보기' if lang == 'ko' else 'View projects'
    compare = '시안 비교' if lang == 'ko' else 'Compare'
    hero_images = [re.sub(r' loading="lazy"', '', img) for img in images]
    gallery = '<div class="gallery-art">' + ''.join(
        f'<a class="gallery-window window-{i}" href="#{SLUGS[i]}" aria-label="{escape(titles[i])}"><span class="window-top"><i></i><span>{titles[i]}</span>{ARROW}</span>{hero_images[i]}</a>'
        for i in [3, 0, 1]) + '</div>'
    index_grid = '<div class="index-art">' + ''.join(
        f'<a class="index-tile index-{i}" href="#{SLUGS[i]}"><span>{titles[i]}{ARROW}</span><div>{hero_images[i]}</div></a>'
        for i in range(4)) + '</div>'
    for variant, title in [('a', 'Cobalt Assembly'), ('b', 'Night Gallery'), ('c', 'Open Index')]:
        local_header = re.sub(r'href="/(?:en/)?"', f'href="./{variant}-{lang}.html"', header)
        if variant == 'a':
            hero = f'<section class="study-hero" aria-labelledby="hero-title"><div class="hero-text"><h1 id="hero-title">MINSEO <br>KIM</h1><p class="hero-intro">{intro}</p><div class="hero-actions">{actions}</div></div>{ART}</section>'
        elif variant == 'b':
            hero = f'<section class="study-hero" aria-labelledby="hero-title"><div class="gallery-heading"><h1 id="hero-title">MINSEO KIM</h1><div><p class="hero-intro">{intro}</p><div class="hero-actions">{actions}</div></div></div>{gallery}</section>'
        else:
            hero = f'<section class="study-hero" aria-labelledby="hero-title"><div class="hero-text"><h1 id="hero-title">MINSEO <br>KIM</h1><p class="hero-intro">{intro}</p><div class="hero-actions">{actions}</div></div>{index_grid}</section>'
        language = '<div class="study-language" role="group" aria-label="Language / 언어">' + ''.join(f'<a href="./{variant}-{l}.html" data-language="{l}" lang="{l}"'+ (' aria-current="page"' if l == lang else '') + f'>{label}</a>' for l, label in [('ko', 'KR'), ('en', 'EN')]) + '</div>'
        controls = f'<div class="study-switch" aria-label="{compare}"><a href="./">{compare}</a>' + ''.join(f'<a href="./{v}-{lang}.html"' + (' aria-current="page"' if v == variant else '') + f'>{v.upper()}</a>' for v in 'abc') + '</div>'
        html = f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{variant.upper()} · {title} — MINSEO KIM</title><link rel="icon" href="/assets/img/favicon.svg"><link rel="preload" href="/assets/fonts/SUIT-Variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="./studies.css?v=20261104-playback"></head><body class="direction-{variant}"><a class="skip-link" href="#work">{view}</a><header class="study-header">{local_header}</header><main>{hero}{about}{work}{skills}{rest}</main><footer class="study-footer"><span>MINSEO KIM</span><span>Portfolio / 2026</span></footer>{language}{controls}<script src="./carousel.js" defer></script><script src="./studies.js" defer></script></body></html>'''
        (OUT / f'{variant}-{lang}.html').write_text(html, encoding='utf-8')
print(f'Built 3 complete web proposals in Korean and English: {OUT}')
