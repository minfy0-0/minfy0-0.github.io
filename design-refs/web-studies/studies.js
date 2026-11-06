// Study-only navigation: retain the current project when changing language.
document.querySelectorAll('[data-language]').forEach(link => {
  const base = link.getAttribute('href');
  const update = () => { link.href = base + location.search + location.hash; };
  update();
  window.addEventListener('hashchange', update);
});
if (new URLSearchParams(location.search).has('embedded')) {
  document.body.classList.add('is-embedded');
}
const projectIds = ['opic-coach', 'drspot', 'ask1-pipeline', 'seoul-cafe'];
document.querySelectorAll('.gallery-art a, .index-art a').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.hash.slice(1);
    if (!projectIds.includes(id)) return;
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    window.dispatchEvent(new Event('hashchange'));
    document.querySelector('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
});
// One composed interaction: the four flat modules gently assemble on pointer entry.
const art = document.querySelector('.poster-art');
if (art && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  art.addEventListener('pointerenter', () => art.classList.add('assembled'));
  art.addEventListener('pointerleave', () => art.classList.remove('assembled'));
}
