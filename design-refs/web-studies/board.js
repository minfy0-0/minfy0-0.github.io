const names = {a:'Cobalt Assembly',b:'Night Gallery',c:'Open Index'};
let variant='a', language='ko';
const section=document.querySelector('#section');
const preview=document.querySelector('#preview');
function update(){
  const base=`./${variant}-${language}.html`;
  preview.src=base+'?embedded=1'+section.value;
  preview.title=`${variant.toUpperCase()} ${names[variant]} ${language==='ko'?'한국어':'English'}`;
  document.querySelector('#full-link').href=base+section.value;
  document.querySelector('#current').textContent=`${variant.toUpperCase()} · ${names[variant]} · ${language==='ko'?'KR':'EN'} · ${section.selectedOptions[0].textContent}`;
  document.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===variant)));
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===language)));
}
document.querySelectorAll('[data-variant]').forEach(b=>b.addEventListener('click',()=>{variant=b.dataset.variant;update()}));
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{language=b.dataset.lang;update()}));
section.addEventListener('change',update);
const sizes=new ResizeObserver(entries=>entries.forEach(entry=>{entry.target.querySelector('iframe').style.transform=`scale(${entry.contentRect.width/1440})`}));
document.querySelectorAll('.mini').forEach(el=>sizes.observe(el));
