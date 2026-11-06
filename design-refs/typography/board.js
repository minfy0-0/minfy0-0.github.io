const names={a:'Archivo Narrow × SUIT',b:'Bodoni Moda × 마루부리',c:'Bricolage Grotesque × SUITE'};
let variant='a';
let language='ko';
const livePreview=document.querySelector('#live-preview');
function updatePreview(){
 const src=`./${variant}-${language}.html`;
 livePreview.src=src;
 livePreview.title=`${variant.toUpperCase()}안 ${language==='ko'?'한국어':'영어'} 실제 크기 미리보기`;
 document.querySelector('#full-preview').href=src;
 document.querySelector('#preview-description').textContent=`${variant.toUpperCase()} — ${names[variant]}`;
 document.querySelectorAll('[data-variant]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.variant===variant)));
 document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
}
document.querySelectorAll('[data-variant]').forEach(button=>button.addEventListener('click',()=>{variant=button.dataset.variant;updatePreview()}));
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.language;updatePreview()}));
const scalePreviews=new ResizeObserver(entries=>{entries.forEach(({target,contentRect})=>target.style.setProperty('--preview-scale',String(contentRect.width/1440)))});
document.querySelectorAll('.miniature').forEach(preview=>scalePreviews.observe(preview));
