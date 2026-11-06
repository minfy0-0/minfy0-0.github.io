"""Build an isolated typography comparison from the existing exported hero.

Run after export_submission.py. Does not change the shipped home or templates.
"""
from pathlib import Path
from html import escape
import re
import shutil
import argparse

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'design-refs'/'typography'
parser=argparse.ArgumentParser()
parser.add_argument('--source',type=Path,default=ROOT/'dist',help='Rendered site; use the before snapshot to reproduce the original font studies.')
args=parser.parse_args()
OUT=ROOT/'dist'/'type-studies'
if not (ROOT/'dist'/'index.html').is_file():
    raise SystemExit('Run scripts/export_submission.py first')
shutil.copytree(SOURCE,OUT,dirs_exist_ok=True)
labels={'a':'Archivo Narrow × SUIT','b':'Bodoni Moda × MaruBuri','c':'Bricolage Grotesque × SUITE'}
for language,prefix in [('ko',''),('en','en/')]:
    original=(args.source/prefix/'index.html').read_text(encoding='utf-8')
    head=re.search(r'<head>(.*?)</head>',original,re.S).group(1)
    hero=re.search(r'<header class="bench-header[^\"]*">.*?</section>',original,re.S).group(0)
    hero=hero.replace('href="#work"',f'href="/{prefix}#work"')
    intro=re.search(r'<section class="intro-band".*?<p>(.*?)</p>',original,re.S).group(1)
    for variant,label in labels.items():
        page_head=re.sub(r'<title>.*?</title>',f'<title>{variant.upper()} — {escape(label)} | Typography study</title>',head)
        page_head+='<base target="_top"><link rel="stylesheet" href="./studies.css">'
        title='디자인 · 개발 · 데이터' if language=='ko' else 'Design · Development · Data'
        note=f'<section class="type-notes"><div><small>HEADING / BODY</small><h2>{title}</h2><p>{intro}</p></div><div><small>TYPE DIRECTION {variant.upper()} / {escape(label)}</small><p class="sample-name">MINSEO KIM</p><a href="./">시안 비교로 돌아가기 ↗</a></div></section>'
        document=f'<!doctype html><html lang="{language}"><head>{page_head}</head><body class="type-{variant}"><main>{hero}{note}</main></body></html>'
        (OUT/f'{variant}-{language}.html').write_text(document,encoding='utf-8')
print(f'Built 3 typography directions × 2 languages: {OUT}')
