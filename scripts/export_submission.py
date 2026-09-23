"""Export the submission's allowlisted Jekyll content to standalone static HTML.

No source files, contact templates, or unrelated assets enter the output.
The exporter supports only literal relative_url expressions and the two shared
includes used in the homepage; unresolved Liquid fails the build.
"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse, re, shutil
import markdown
import yaml

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', default=str(ROOT / 'dist'))
args = parser.parse_args()
OUT = Path(args.output).resolve()
if OUT == ROOT or ROOT in OUT.parents and OUT != ROOT / 'dist':
    raise SystemExit('Output must be dist or an external build directory')
if OUT == ROOT / 'dist' and OUT.exists():
    shutil.rmtree(OUT)
elif OUT.exists() and any(OUT.iterdir()):
    raise SystemExit('External output directory must be empty')
OUT.mkdir(parents=True, exist_ok=True)

def read(path): return (ROOT / path).read_text(encoding='utf-8')
def frontmatter(text):
    _, meta, body = text.split('---', 2)
    return yaml.safe_load(meta), body.strip()
def render(text):
    text = re.sub(r"{{\s*'([^']+)'\s*\|\s*relative_url\s*}}", lambda m: m[1], text)
    for name in ('site-nav.html', 'site-footer.html'):
        marker = '{% include ' + name + ' %}'
        if marker in text:
            text = text.replace(marker, render(read('_includes/' + name)))
    if '{{' in text or '{%' in text:
        raise ValueError('Unsupported Liquid in submission content')
    return text

nav = render(read('_includes/site-nav.html'))
footer = render(read('_includes/site-footer.html'))
config = yaml.safe_load(read('_config.yml'))

def page(title, description, body):
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#ffffff"><title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}"><link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Noto+Sans+KR:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/portfolio.css"><link rel="stylesheet" href="/assets/css/portfolio-overrides.css"><link rel="stylesheet" href="/assets/css/submission.css"></head><body>{body}<script src="/assets/js/portfolio.js" defer></script></body></html>'''

def write(path, text):
    dest = OUT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text, encoding='utf-8')

_, home = frontmatter(read('_layouts/home.html'))
write('index.html', page(config['title'], config['description'], render(home)))
cover_override = {'opic-coach':'opic-screen.png', 'seoul-cafe':'cafe-screen.png', 'drspot':'drspot-screen.png'}
for slug in ('opic-coach', 'ask1-pipeline', 'seoul-cafe', 'drspot'):
    data, source = frontmatter(read('projects/' + slug + '.md'))
    body = markdown.markdown(render(source), extensions=['tables','fenced_code','sane_lists'])
    tags = ''.join(f'<span class="tag">{escape(str(tag))}</span>' for tag in data['tags'])
    facts = ''.join(f'<div class="case-fact"><span>{escape(str(fact["label"]))}</span><strong>{escape(str(fact["value"]))}</strong></div>' for fact in data['facts'])
    cover = ''
    if slug in cover_override:
        cover = f'<figure class="case-cover"><img src="/assets/img/portfolio/{cover_override[slug]}" alt="{escape(data["title"], quote=True)} 프로젝트 화면"></figure>'
    main = f'''{nav}<main class="case-page" id="main"><section class="case-hero"><div class="shell"><a class="back-link" href="/#work">← 프로젝트 목록</a><div class="case-hero-grid"><div><p class="eyebrow">{escape(data['eyebrow'])}</p><h1>{escape(data['title'])}</h1><p class="lead">{escape(data['description'])}</p><div class="project-tags">{tags}</div></div><div class="case-facts">{facts}</div></div>{cover}</div></section><article class="case-content">{body}</article></main>{footer}'''
    write('projects/' + slug + '/index.html', page(data['title']+' | 김민서 포트폴리오', data['description'], main))
write('404.html', page('페이지를 찾을 수 없습니다', '지원 포트폴리오', nav+'<main id="main" class="case-page"><section class="case-hero"><div class="shell"><h1>페이지를 찾을 수 없습니다.</h1><p><a class="btn btn-primary" href="/">포트폴리오 첫 화면으로</a></p></div></section></main>'+footer))
write('robots.txt', 'User-agent: *\nDisallow: /\n')

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.urls=[]; self.ids=set(); self.images=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        for key in ('src','href'):
            if key in a: self.urls.append(a[key])
        if tag=='img': self.images.append(a)

pages = list(OUT.rglob('*.html'))
assets = set()
for p in pages:
    for url in Document(p.read_text()).urls:
        if url.startswith('/assets/'): assets.add(url.lstrip('/'))
for asset in sorted(assets):
    source=ROOT/asset
    if not source.is_file(): raise ValueError(f'Missing asset: {asset}')
    dest=OUT/asset; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(source,dest)
# CSS assets may only refer to data URIs or already selected files.
for css in OUT.rglob('*.css'):
    for url in re.findall(r'url\([\"\']?([^\"\')]+)', css.read_text()):
        if not url.startswith('data:'):
            candidate=OUT/url.lstrip('/') if url.startswith('/') else css.parent/url
            if not candidate.is_file(): raise ValueError(f'Missing CSS asset: {url}')
for p in pages:
    doc=Document(p.read_text())
    assert len(re.findall(r'<h1(?:\s|>)',p.read_text()))==1, str(p)
    assert all(img.get('alt') for img in doc.images), str(p)
    for url in doc.urls:
        parts=urlsplit(url)
        if parts.scheme or parts.netloc: continue
        target=(OUT / unquote(parts.path).lstrip('/')) if parts.path.startswith('/') else p.parent/unquote(parts.path)
        if not parts.path: target=p
        if target.is_dir(): target=target/'index.html'
        assert target.is_file(), f'{p}: missing {url}'
        if parts.fragment and target.suffix=='.html':
            assert unquote(parts.fragment) in Document(target.read_text()).ids, f'Missing anchor: {url}'
for p in OUT.rglob('*'):
    if p.suffix not in ('.html','.svg','.js','.css','.txt'): continue
    text=p.read_text()
    assert not re.search(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}',text), f'Email in {p}'
    assert not re.search(r'(?:mailto:|tel:|linkedin\.com|Seoul, South Korea|010[- ]?\d{4}[- ]?\d{4}|G-NHHT43834D)',text,re.I), f'Personal link in {p}'
    assert '{{' not in text and '{%' not in text, f'Unrendered template: {p}'
print(f'Exported {len(pages)} pages; verified internal links, anchors, {len(assets)} assets, image labels, and personal-contact scan: {OUT}')
