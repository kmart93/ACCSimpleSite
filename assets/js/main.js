// Accessible, mobile-first navigation + small UX helpers
(function () {
  const navToggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');

  function isMobile() {
    return window.matchMedia('(max-width: 860px)').matches;
  }

  function setMenu(open) {
    const shouldHide = isMobile() ? !open : false;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (menu) {
      menu.hidden = shouldHide;
      menu.classList.toggle('nav__links--open', open);
    }
  }

  // Initialize based on viewport
  setMenu(false);

  // Toggle on click
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      setMenu(!open);
    });
  }

  // Close on Escape and return focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMenu(false);
      navToggle && navToggle.focus();
    }
  });

  // Close after navigation
  document.querySelectorAll('#nav-menu a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Ensure correct state on resize (mobile <-> desktop)
  window.addEventListener('resize', () => {
    // On desktop, force menu visible; on mobile keep it controlled by aria state
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    setMenu(open && isMobile());
    if (!isMobile()) {
      // Ensure desktop visibility regardless of open state
      menu.hidden = false;
      menu.classList.remove('nav__links--open');
    }
  });

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Load Instagram embed script on demand
  if (document.querySelector('.instagram-media')) {
    const ig = document.createElement('script');
    ig.src = 'https://www.instagram.com/embed.js';
    ig.async = true;
    ig.onload = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(ig);
  }
})();

