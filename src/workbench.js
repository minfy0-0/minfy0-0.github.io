import './project-carousel.js';

// The complete modular composition is visible immediately; motion is optional.
const hero = document.querySelector('[data-workbench]');
const stage = hero?.querySelector('[data-block-stage]');
if (hero && stage) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0, visible = true;
  function render() {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    x += (targetX - x) * .09;
    y += (targetY - y) * .09;
    stage.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .025) frame = requestAnimationFrame(render);
  }
  function request() { if (!frame && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(render); }
  function reset() { targetX = targetY = 0; request(); }
  hero.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * 8;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * 5;
    request();
  }, {passive:true});
  hero.addEventListener('pointerleave', reset, {passive:true});
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      cancelAnimationFrame(frame); frame = 0;
      x = y = targetX = targetY = 0;
      stage.style.transform = '';
    }
  });
  fine.addEventListener('change', reset);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) {cancelAnimationFrame(frame);frame = 0;} else request();
  }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {cancelAnimationFrame(frame);frame=0;} else reset();
  });
}
