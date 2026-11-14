// Progressive disclosure: no scroll interception, and no hidden content without JS.
const root = document.documentElement;
const sections = Array.from(document.querySelectorAll('[data-terminal-section]'));
const content = document.getElementById('terminal-content');
const controls = document.getElementById('terminal-continue');
const nextButton = document.getElementById('terminal-next');
const showAllButton = document.getElementById('terminal-show-all');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

// The early CSS class is only a flash-prevention hint, not an initialization
// flag. Vite or a slow connection can load this module after its fallback timer.
if (sections.length && content && controls && nextButton && showAllButton && !motionPreference.matches && !location.hash) {
  const commands = sections.map((section) => section.querySelector('[data-command-text]'));
  const labels = commands.map((command) => command.textContent);
  let nextIndex = 0;
  let busy = false;
  let finished = false;
  let typingTimer;
  let scrollFrame;
  let lastScrollY = window.scrollY;

  function showAll() {
    finished = true;
    busy = false;
    clearTimeout(typingTimer);
    cancelAnimationFrame(scrollFrame);
    sections.forEach((section, index) => {
      delete section.dataset.state;
      section.removeAttribute('aria-busy');
      commands[index].textContent = labels[index];
    });
    // Don't leave keyboard focus on a control that is about to disappear.
    if (controls.contains(document.activeElement)) {
      const target = sections[Math.min(nextIndex, sections.length - 1)];
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
    controls.hidden = true;
    root.classList.remove('terminal-booting');
    window.removeEventListener('scroll', scheduleReveal);
  }

  function revealNext() {
    if (busy || finished || nextIndex >= sections.length) return;
    const index = nextIndex++;
    const section = sections[index];
    const command = commands[index];
    const label = labels[index];
    const characterDelay = index === 0 ? 65 : Math.min(40, 500 / label.length);
    let characters = 0;
    busy = true;
    nextButton.disabled = true;
    nextButton.textContent = 'Typing…';
    section.dataset.state = 'typing';
    section.setAttribute('aria-busy', 'true');
    command.textContent = '';

    function typeCharacter() {
      if (finished) return;
      if (characters < label.length) {
        command.textContent = label.slice(0, ++characters);
        typingTimer = window.setTimeout(typeCharacter, characterDelay);
        return;
      }
      typingTimer = window.setTimeout(() => {
        section.dataset.state = 'revealed';
        section.removeAttribute('aria-busy');
        busy = false;
        lastScrollY = window.scrollY;
        nextButton.disabled = false;
        nextButton.textContent = 'Scroll to continue ↓';
        if (nextIndex === sections.length) showAll();
      }, 120);
    }

    typingTimer = window.setTimeout(typeCharacter, index === 0 ? 120 : 80);
  }

  function scheduleReveal() {
    if (scrollFrame || finished) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = undefined;
      // Only a fresh downward scroll near the output's end runs another command.
      // Revealing content itself never cascades through the remaining sections.
      if (!busy && window.scrollY > lastScrollY + 24 && content.getBoundingClientRect().bottom < window.innerHeight + 80) {
        revealNext();
      }
    });
  }

  // Refreshing a previously scrolled page should still start with neofetch.
  window.scrollTo({ top: 0, behavior: 'instant' });
  lastScrollY = 0;
  sections.forEach((section) => { section.dataset.state = 'pending'; });
  controls.hidden = false;
  revealNext();
  root.classList.remove('terminal-booting');

  window.addEventListener('scroll', scheduleReveal, { passive: true });
  nextButton.addEventListener('click', () => {
    const next = sections[nextIndex];
    revealNext();
    // Explicit button activation can bring an offscreen command into view.
    if (next && next.getBoundingClientRect().top > window.innerHeight - 80) {
      next.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'center' });
    }
  });
  showAllButton.addEventListener('click', showAll);
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) showAll();
  });
  // Deep links, browser find, printing, and history navigation must reach all content.
  window.addEventListener('hashchange', () => {
    showAll();
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    target?.scrollIntoView();
  });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      showAll();
    } else if (!finished && nextIndex === 1) {
      // Browsers may restore scroll after deferred scripts have initialized.
      // That restoration must not silently cancel the entire experience.
      window.scrollTo({ top: 0, behavior: 'instant' });
      lastScrollY = 0;
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'End' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f')) showAll();
  });
} else {
  root.classList.remove('terminal-booting');
}
