import './project-carousel.js';

// The whole composition is present before any interaction. Four links connect
// the visual vocabulary to the same symbols and evidence in the skills section.
document.querySelectorAll('.meaning-module').forEach(link => {
  link.addEventListener('click', () => {
    const block = document.getElementById(link.hash.slice(1));
    block?.focus({preventScroll: true});
  });
});
