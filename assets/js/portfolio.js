(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const syncLanguageLinks = () => {
    document.querySelectorAll('[data-preserve-hash]').forEach(link => { link.hash = location.hash; });
  };
  syncLanguageLinks();
  window.addEventListener('hashchange', syncLanguageLinks);
  // Preserve the reading section even when translated paragraphs have different heights.
  document.querySelectorAll('[data-preserve-hash]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const carousel = document.querySelector('[data-project-carousel]');
      const sections = [...document.querySelectorAll('[data-workbench], #about, #work, .project-dossier, #skills, #process, #experience, #contact')].filter(node => node.getAttribute('aria-hidden') !== 'true');
      const section = sections.filter(node => node.getBoundingClientRect().top <= 100).at(-1) || sections[0];
      const rect = section?.getBoundingClientRect();
      try { sessionStorage.setItem('portfolio-language-view', JSON.stringify({
        path: link.pathname, hash: link.hash, top: window.scrollY,
        anchor: section?.id || '__hero', offset: rect?.height ? -rect.top / rect.height : 0,
        project: carousel?.dataset.activeProject
      })); } catch {}
    });
  });
  try {
    const view = JSON.parse(sessionStorage.getItem('portfolio-language-view') || 'null');
    sessionStorage.removeItem('portfolio-language-view');
    if (view && view.path === location.pathname && view.hash === location.hash && Number.isFinite(view.top)) {
      window.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(() => {
        if (view.project) document.querySelector('[data-project-carousel]')?.dispatchEvent(new CustomEvent('portfolio:select-project', {detail: view.project}));
        const section = view.anchor === '__hero' ? document.querySelector('[data-workbench]') : document.getElementById(view.anchor || '');
        const rect = section?.getBoundingClientRect();
        const top = rect && Number.isFinite(view.offset) ? window.scrollY + rect.top + view.offset * rect.height : view.top;
        window.scrollTo({top: Math.max(0, top), behavior: 'instant'});
        document.querySelector('.language-switch [aria-current="page"]')?.focus({preventScroll: true});
      })), {once: true});
    }
  } catch {}

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (toggle && nav) {
    const closeNavigation = () => {
      body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && body.classList.contains('nav-open')) {
        closeNavigation();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (body.classList.contains('nav-open') && !nav.contains(event.target) && !toggle.contains(event.target)) closeNavigation();
    });
  }

  const revealNodes = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && revealNodes.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }
})();
