// Progressive enhancement: every project remains a readable section without JS.
const carousel = document.querySelector('[data-project-carousel]');
if (carousel) {
  const panels = [...carousel.querySelectorAll('.project-dossier')];
  const tabs = [...carousel.querySelectorAll('[data-project-target]')];
  const tablist = carousel.querySelector('[data-project-tabs]');
  const track = carousel.querySelector('[data-project-track]');
  const viewport = carousel.querySelector('[data-project-viewport]');
  const toolbar = carousel.querySelector('[data-project-toolbar]');
  const play = carousel.querySelector('[data-project-play]');
  const count = carousel.querySelector('[data-project-count]');
  const announcement = carousel.querySelector('[data-project-announcement]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const compact = matchMedia('(max-width: 760px)');
  const indexLayout = document.body.classList.contains('selected-home');
  const interval = 8000;
  let active = 0, playing = false, inView = false, hovering = false;
  let frame = 0, elapsed = 0, lastTime = 0, pointer = null;

  function orientTabs() {
    tablist.setAttribute('aria-orientation', indexLayout && !compact.matches ? 'vertical' : 'horizontal');
  }
  function revealTab() {
    if (!indexLayout) return;
    const selected = tabs[active].getBoundingClientRect();
    const bounds = tablist.getBoundingClientRect();
    if (compact.matches) {
      if (selected.left < bounds.left) tablist.scrollLeft += selected.left - bounds.left - 5;
      else if (selected.right > bounds.right) tablist.scrollLeft += selected.right - bounds.right + 5;
    } else {
      if (selected.top < bounds.top) tablist.scrollTop += selected.top - bounds.top - 5;
      else if (selected.bottom > bounds.bottom) tablist.scrollTop += selected.bottom - bounds.bottom + 5;
    }
  }

  function sizePanel() {
    viewport.style.height = `${Math.ceil(panels[active].getBoundingClientRect().height)}px`;
    carousel.style.setProperty('--project-toolbar-height', `${toolbar.offsetHeight}px`);
  }
  function progress() {
    carousel.style.setProperty('--project-progress', playing ? String(elapsed / interval) : '1');
  }
  function canPlay() {
    const focused = document.activeElement;
    return playing && !reduced.matches && !document.hidden && inView && !hovering &&
      (!carousel.contains(focused) || focused === play);
  }
  function schedule() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    if (canPlay()) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = 0;
    if (!canPlay()) { lastTime = 0; return; }
    if (lastTime) elapsed += Math.min(time - lastTime, 100);
    lastTime = time;
    if (elapsed >= interval) select(active + 1, {automatic: true});
    progress();
    frame = requestAnimationFrame(tick);
  }
  function setPlaying(value) {
    playing = value && !reduced.matches;
    elapsed = 0;
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-label', playing ? play.dataset.stop : play.dataset.startLabel);
    play.querySelector('span').textContent = playing ? play.dataset.stop : play.dataset.start;
    carousel.classList.toggle('is-playing', playing);
    progress(); schedule();
  }
  function select(index, {automatic = false, updateHash = false, focusTab = false, instant = false} = {}) {
    active = (index + panels.length) % panels.length;
    panels.forEach((panel, i) => {
      panel.inert = i !== active;
      panel.setAttribute('aria-hidden', String(i !== active));
      panel.dataset.active = String(i === active);
      tabs[i].setAttribute('aria-selected', String(i === active));
      tabs[i].tabIndex = i === active ? 0 : -1;
    });
    carousel.dataset.activeProject = panels[active].id;
    if (instant) track.style.transition = 'none';
    track.style.transform = `translateX(-${active * 100}%)`;
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = ''; }));
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
    elapsed = 0; progress(); sizePanel();
    revealTab();
    if (!automatic) announcement.textContent = `${tabs[active].querySelector('span:nth-child(2)').textContent.trim()} · ${active + 1} / ${panels.length}`;
    if (focusTab) tabs[active].focus({preventScroll: true});
    if (updateHash) {
      history.replaceState(null, '', `#${panels[active].id}`);
      window.dispatchEvent(new Event('hashchange'));
    }
  }
  function manual(index, focusTab = false) {
    setPlaying(false);
    select(index, {updateHash: true, focusTab});
    // Keep the new title visible when controls are used partway through a long project.
    if (carousel.getBoundingClientRect().top < -8) carousel.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  function fromHash(instant = false) {
    const index = panels.findIndex(panel => `#${panel.id}` === location.hash);
    if (index >= 0 && panels[index].id !== carousel.dataset.activeProject) {
      setPlaying(false); select(index, {instant});
    }
  }

  panels.forEach((panel, i) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[i].id);
    tabs[i].setAttribute('role', 'tab');
    tabs[i].setAttribute('aria-controls', panel.id);
    tabs[i].addEventListener('click', () => manual(i));
    tabs[i].addEventListener('keydown', event => {
      const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      const arrows = vertical ? {ArrowUp: i - 1, ArrowDown: i + 1} : {ArrowLeft: i - 1, ArrowRight: i + 1};
      const next = {...arrows, Home: 0, End: panels.length - 1}[event.key];
      if (next === undefined) return;
      event.preventDefault(); manual(next, true);
    });
  });
  tablist.setAttribute('role', 'tablist');
  orientTabs();
  compact.addEventListener('change', () => { orientTabs(); revealTab(); });
  tablist.hidden = false;
  carousel.querySelector('[data-project-controls]').hidden = false;
  carousel.classList.add('is-carousel');
  select(0, {instant: true});
  fromHash(true);
  window.addEventListener('hashchange', () => fromHash());
  carousel.addEventListener('portfolio:select-project', event => {
    const index = panels.findIndex(panel => panel.id === event.detail);
    if (index >= 0) select(index, {instant: true});
  });
  carousel.querySelector('[data-project-prev]').addEventListener('click', () => manual(active - 1));
  carousel.querySelector('[data-project-next]').addEventListener('click', () => manual(active + 1));
  play.addEventListener('click', () => setPlaying(!playing));
  viewport.addEventListener('pointerenter', event => {
    if (fine.matches && event.pointerType === 'mouse') { hovering = true; schedule(); }
  });
  viewport.addEventListener('pointerleave', () => { hovering = false; schedule(); });
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || event.target.closest('a,button')) return;
    setPlaying(false);
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY};
  }, {passive: true});
  viewport.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) manual(active + (dx < 0 ? 1 : -1));
  }, {passive: true});
  viewport.addEventListener('pointercancel', () => { pointer = null; }, {passive: true});
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => requestAnimationFrame(schedule));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { setPlaying(false); play.disabled = reduced.matches; });
  play.disabled = reduced.matches;
  // Observe the first 200px of content, not the sticky controls, to pause while reading below.
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }).observe(carousel.querySelector('[data-autoplay-sentinel]'));
  const sizes = new ResizeObserver(sizePanel);
  panels.forEach(panel => sizes.observe(panel));
  sizes.observe(toolbar);
  window.addEventListener('load', () => {
    sizePanel();
    if (panels.some(panel => `#${panel.id}` === location.hash)) carousel.scrollIntoView({block: 'start', behavior: 'instant'});
  }, {once: true});
}
