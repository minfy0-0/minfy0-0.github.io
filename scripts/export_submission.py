"""Export the portfolio's allowlisted Jekyll content to standalone static HTML.

No source files, contact templates, or unrelated assets enter the output.
The original Liquid templates are rendered directly to preserve their markup.
Unresolved Liquid fails the build.
"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse, re, shutil
import markdown
import yaml
from liquid import Environment, DictLoader

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
def liquid_syntax(text):
    return re.sub(r'{% include ([\w.-]+) %}', r'{% include "\1" %}', text)
liquid = Environment(loader=DictLoader({p.name: liquid_syntax(p.read_text(encoding='utf-8')) for p in (ROOT / '_includes').glob('*.html')}))
liquid.add_filter('relative_url', lambda value: value)
def render(text, **context):
    text = liquid_syntax(text)
    result = liquid.from_string(text).render(**context)
    if '{{' in result or '{%' in result:
        raise ValueError('Unsupported Liquid in submission content')
    return result

config = yaml.safe_load(read('_config.yml'))
config['data'] = {
    'interface': yaml.safe_load(read('_data/interface.yml')),
    'skills': yaml.safe_load(read('_data/skills.yml')),
}

def page(title, description, body, is_home=False, lang='ko', url='/', translation_url=None):
    body += render(read('_includes/language-switcher.html'), page={'lang':lang, 'url':url, 'translation_url':translation_url, 'layout':'home' if is_home else 'case-study'}, site=config)
    if is_home:
        styles = '<link rel="stylesheet" href="/assets/css/assembly-home.css?v=20261104-selected-v2"><link rel="stylesheet" href="/assets/css/assembly-layout.css?v=20261106-marketing">'
    else:
        styles = '<link rel="stylesheet" href="/assets/css/portfolio.css"><link rel="stylesheet" href="/assets/css/portfolio-overrides.css"><link rel="stylesheet" href="/assets/css/personal-theme.css"><link rel="stylesheet" href="/assets/css/design-polish.css?v=20261104-playback">'
    styles += '<link rel="stylesheet" href="/assets/css/sculptural-type.css?v=20261104-selected-v2">'
    body_class = ' class="selected-home"' if is_home else ''
    alternates = ''
    if translation_url:
        other = 'ko' if lang == 'en' else 'en'
        alternates = f'<link rel="alternate" hreflang="{lang}" href="{url}"><link rel="alternate" hreflang="{other}" href="{translation_url}">'
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f5f4f0"><title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}">{alternates}<link rel="icon" href="/assets/img/favicon.svg?v=brick-m" type="image/svg+xml"><link rel="preload" href="/assets/fonts/SUIT-Variable.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/BricolageGrotesque.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="/assets/fonts/SUITE-Variable.woff2" as="font" type="font/woff2" crossorigin>{styles}</head><body{body_class}>{body}<script src="/assets/js/portfolio.js?v=20261106-language-links" defer></script></body></html>'''

def write(path, text):
    dest = OUT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text, encoding='utf-8')

_, home = frontmatter(read('_layouts/home.html'))
_, case_template = frontmatter(read('_layouts/case-study.html'))
for lang, prefix in (('ko', ''), ('en', 'en/')):
    data, _ = frontmatter(read(prefix + 'index.md'))
    data['url'] = data['permalink']
    write(prefix+'index.html', page(data.get('title', config['title']), data['description'], render(home, page=data, site=config), is_home=True, lang=lang, url=data['url'], translation_url=data['translation_url']))
    for slug in ('opic-coach', 'ask1-pipeline', 'seoul-cafe', 'drspot'):
        data, source = frontmatter(read(prefix+'projects/'+slug+'.md'))
        data['url'] = data['permalink']
        body = markdown.markdown(render(source, page=data, site=config), extensions=['tables','fenced_code','sane_lists'])
        main = render(case_template, page=data, content=body, site=config)
        write(prefix+'projects/'+slug+'/index.html', page(data['title']+' | Minseo Kim', data['description'], main, lang=lang, url=data['url'], translation_url=data['translation_url']))
    data, source = frontmatter(read(prefix+'404.html'))
    data['url'] = data['permalink']
    _, basic = frontmatter(read('_layouts/page.html'))
    content = render(source, page=data, site=config)
    main = render(basic, page=data, content=content, site=config)
    write(prefix+'404.html', page(data['title'], data['description'], main, lang=lang, url=data['url'], translation_url=data['translation_url']))
write('robots.txt', 'User-agent: *\nDisallow: /\n')
shutil.copy2(ROOT / 'THIRD_PARTY_NOTICES.md', OUT / 'THIRD_PARTY_NOTICES.md')

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.urls=[]; self.ids=set(); self.images=[]; self.lang=None; self.language_links={}; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang')
        if tag=='a' and a.get('hreflang') in ('ko','en'): self.language_links[a['hreflang']]=a.get('href')
        if 'id' in a: self.ids.add(a['id'])
        for key in ('src','href'):
            if key in a: self.urls.append(a[key])
        if 'srcset' in a:
            self.urls.extend(item.strip().split()[0] for item in a['srcset'].split(',') if item.strip())
        if tag=='img': self.images.append(a)

pages = list(OUT.rglob('*.html'))
assets = set()
for p in pages:
    for url in Document(p.read_text(encoding='utf-8')).urls:
        if url.startswith('/assets/'): assets.add(urlsplit(url).path.lstrip('/'))
for asset in sorted(assets):
    source=ROOT/asset
    if not source.is_file(): raise ValueError(f'Missing asset: {asset}')
    dest=OUT/asset; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(source,dest)
for license_name in ('SUIT-LICENSE.txt', 'BricolageGrotesque-OFL.txt', 'SUITE-LICENSE.txt'):
    shutil.copy2(ROOT/'assets'/'fonts'/license_name, OUT/'assets'/'fonts'/license_name)
# CSS assets may only refer to data URIs or already selected files.
for css in OUT.rglob('*.css'):
    for url in re.findall(r'url\([\"\']?([^\"\')]+)', css.read_text(encoding='utf-8')):
        if not url.startswith('data:'):
            candidate=OUT/url.lstrip('/') if url.startswith('/') else css.parent/url
            if not candidate.is_file(): raise ValueError(f'Missing CSS asset: {url}')
for p in pages:
    doc=Document(p.read_text(encoding='utf-8'))
    expected_lang = 'en' if p.relative_to(OUT).parts[0]=='en' else 'ko'
    assert doc.lang == expected_lang, f'Wrong page language: {p}'
    assert set(doc.language_links) == {'ko','en'}, f'Missing language selector: {p}'
    for target_lang, url in doc.language_links.items():
        counterpart = OUT/url.lstrip('/')
        if counterpart.is_dir(): counterpart=counterpart/'index.html'
        other_doc=Document(counterpart.read_text(encoding='utf-8'))
        assert other_doc.lang == target_lang, f'Incorrect translation target: {p} -> {url}'
        own_url = '/' + str(p.relative_to(OUT)).replace('\\','/').removesuffix('index.html')
        assert other_doc.language_links[expected_lang] == own_url, f'Translation link does not return to the same page: {p}'
    assert len(re.findall(r'<h1(?:\s|>)',p.read_text(encoding='utf-8')))==1, str(p)
    assert all(img.get('alt') for img in doc.images), str(p)
    for url in doc.urls:
        parts=urlsplit(url)
        if parts.scheme or parts.netloc: continue
        target=(OUT / unquote(parts.path).lstrip('/')) if parts.path.startswith('/') else p.parent/unquote(parts.path)
        if not parts.path: target=p
        if target.is_dir(): target=target/'index.html'
        assert target.is_file(), f'{p}: missing {url}'
        if parts.fragment and target.suffix=='.html':
            assert unquote(parts.fragment) in Document(target.read_text(encoding='utf-8')).ids, f'Missing anchor: {url}'
for p in OUT.rglob('*'):
    if p.suffix not in ('.html','.svg','.js','.css','.txt'): continue
    text=p.read_text(encoding='utf-8')
    assert not re.search(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}',text), f'Email in {p}'
    assert not re.search(r'(?:mailto:|tel:|linkedin\.com|Seoul, South Korea|010[- ]?\d{4}[- ]?\d{4}|G-NHHT43834D)',text,re.I), f'Personal link in {p}'
    if p.suffix in ('.html', '.svg'):
        assert '{{' not in text and '{%' not in text, f'Unrendered template: {p}'
print(f'Exported {len(pages)} pages; verified internal links, anchors, {len(assets)} assets, image labels, and personal-contact scan: {OUT}')
