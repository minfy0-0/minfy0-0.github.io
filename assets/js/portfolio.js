(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', '메뉴 열기');
      toggle?.focus();
    }
  });

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
