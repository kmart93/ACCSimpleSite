// Accessible, mobile-first navigation + small UX helpers
(function () {
  const body = document.body;
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

  // Load Instagram embed script on demand and ensure mobile-friendly container
  if (document.querySelector('.instagram-media')) {
    document.querySelectorAll('.instagram-media').forEach((el) => {
      try {
        // Normalize inline styles from copy-paste snippets
        if (el.hasAttribute('style')) el.removeAttribute('style');
        el.style.maxWidth = '540px';
        el.style.width = '100%';
        el.style.margin = '0 auto';
        // Ensure permalink has trailing slash, as some mobile agents require it
        const attr = el.getAttribute('data-instgrm-permalink');
        if (attr && !/\/$/.test(attr)) {
          el.setAttribute('data-instgrm-permalink', attr + '/');
        }
      } catch (_) {}
    });
    const ig = document.createElement('script');
    ig.src = 'https://www.instagram.com/embed.js';
    ig.async = true;
    ig.onload = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
        // Retry once after a short delay for mobile Safari
        setTimeout(() => {
          try { window.instgrm.Embeds.process(); } catch (_) {}
        }, 500);
      }
    };
    document.body.appendChild(ig);
  }

  // Load Facebook SDK on demand for fb-post embeds
  if (document.querySelector('.fb-post')) {
    // Ensure fb-root exists as required by the SDK
    if (!document.getElementById('fb-root')) {
      const root = document.createElement('div');
      root.id = 'fb-root';
      document.body.insertBefore(root, document.body.firstChild);
    }
    // Normalize container styles
    document.querySelectorAll('.fb-embed').forEach((el) => {
      el.style.maxWidth = '540px';
      el.style.width = '100%';
      el.style.margin = '0 auto';
    });
    const fb = document.createElement('script');
    fb.async = true;
    fb.defer = true;
    fb.crossOrigin = 'anonymous';
    fb.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v19.0';
    fb.onload = () => {
      try {
        if (window.FB && window.FB.XFBML && typeof window.FB.XFBML.parse === 'function') {
          window.FB.XFBML.parse();
        }
      } catch (_) {}
    };
    document.body.appendChild(fb);
  }

  // Lightbox for gallery images
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-trigger]');

  if (lightbox && lightboxImage && lightboxTriggers.length) {
    const closeBtn = lightbox.querySelector('[data-lightbox-close]');
    let lastTrigger = null;

    const openLightbox = (trigger) => {
      const img = trigger.querySelector('img');
      const src = trigger.getAttribute('data-lightbox-src') || img?.currentSrc || img?.src;
      if (!src) return;
      const alt = trigger.getAttribute('data-lightbox-alt') || img?.alt || '';
      const caption =
        trigger.getAttribute('data-lightbox-caption') ||
        trigger.closest('figure')?.querySelector('figcaption')?.innerText ||
        '';

      lastTrigger = trigger;
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
        lightboxCaption.hidden = !caption;
      }
      lightbox.hidden = false;
      body && body.classList.add('body--locked');
      closeBtn?.focus();
    };

    const closeLightbox = () => {
      if (lightbox.hidden) return;
      lightbox.hidden = true;
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
      if (lightboxCaption) {
        lightboxCaption.textContent = '';
        lightboxCaption.hidden = false;
      }
      body && body.classList.remove('body--locked');
      lastTrigger?.focus();
      lastTrigger = null;
    };

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => openLightbox(trigger));
    });

    closeBtn?.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) {
        event.preventDefault();
        closeLightbox();
      }
    });
  }
})();
