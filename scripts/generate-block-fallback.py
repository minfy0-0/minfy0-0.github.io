"""Build a small, local SVG illustration for no-JavaScript / no-WebGL visitors."""
from pathlib import Path
import math

ROOT=Path(__file__).resolve().parents[1]
colors={'blue':'#3e60dc','coral':'#dc725f','mint':'#8caf9c','yellow':'#edc14b','cream':'#e0e0d3'}
bricks=[(-1.98,.36,0,2,'blue'),(1.98,.36,0,2,'coral'),(-1.98,1.12,0,2,'cream'),(1.98,1.12,0,2,'mint'),(0,1.88,0,8,'yellow'),(-.66,2.64,0,4,'blue'),(1.32,2.64,0,2,'cream'),(0,3.4,0,2,'coral'),(-2.7,.36,2.3,4,'mint'),(2.6,.36,2.25,2,'yellow')]
def project(x,y,z):return (360+(x-z)*48,390+(x+z)*22-y*66)
def poly(points,fill):
    coords=' '.join(f'{x:.2f},{y:.2f}' for x,y in points)
    return f'<polygon points="{coords}" fill="{fill}" stroke="#222" stroke-opacity=".025" stroke-linejoin="round"/>'
out=['<svg xmlns="http://www.w3.org/2000/svg" width="720" height="600" viewBox="0 0 720 600"><defs><filter id="shadow"><feGaussianBlur stdDeviation="14"/></filter></defs><ellipse cx="360" cy="462" rx="226" ry="49" fill="#5e604d" opacity=".12" filter="url(#shadow)"/>']
for x,y,z,n,color in bricks:
    w=n*.66/2-.02;d=.64;h=.36;c=colors[color]
    front=[project(x-w,y-h,z+d),project(x+w,y-h,z+d),project(x+w,y+h,z+d),project(x-w,y+h,z+d)]
    right=[project(x+w,y-h,z-d),project(x+w,y-h,z+d),project(x+w,y+h,z+d),project(x+w,y+h,z-d)]
    top=[project(x-w,y+h,z-d),project(x+w,y+h,z-d),project(x+w,y+h,z+d),project(x-w,y+h,z+d)]
    out.extend([poly(front,c),poly(front,'#00000018'),poly(right,c),poly(right,'#0000002b'),poly(top,c)])
    for i in range(n):
        for j in range(2):
            a,b=project(x+(i-(n-1)/2)*.66,y+h+.08,z+(j-.5)*.66)
            out.append(f'<ellipse cx="{a:.2f}" cy="{b+4:.2f}" rx="16.3" ry="8" fill="{c}"/><path d="M{a-16.3:.2f},{b:.2f}v4a16.3,8 0 0 0 32.6,0v-4" fill="{c}"/><ellipse cx="{a:.2f}" cy="{b:.2f}" rx="16.3" ry="8" fill="{c}" stroke="#fff" stroke-opacity=".24"/>')
out.append('</svg>')
(ROOT/'assets/img/block-bridge.svg').write_text(''.join(out),encoding='utf-8')
