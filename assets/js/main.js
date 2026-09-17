/* Savva Henchevskyi — personal site
   Vanilla JS, no dependencies. Everything degrades gracefully without it. */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Theme toggle — dark is the default, choice persists.
     --------------------------------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
  }

  setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeToggle.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('nav-toggle');

  function closeNav() {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------------------------------------------------------
     Header state, scroll progress, back-to-top
     --------------------------------------------------------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('scroll-progress');
  var toTop = document.getElementById('to-top');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('scrolled', y > 8);
    toTop.classList.toggle('show', y > 600);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------
     Scroll spy — highlight the section currently in view
     --------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var visible = new Set();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // The topmost visible section wins, so the highlight never lags behind.
      var activeId = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible.has(sections[i].id)) { activeId = sections[i].id; break; }
      }

      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
      });
    }, { rootMargin: '-30% 0px -55% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Small stagger for items revealed in the same batch.
        entry.target.style.transitionDelay = Math.min(i, 6) * 55 + 'ms';
        entry.target.classList.add('visible');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------------------------------------------------------
     Animated stat counters
     --------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        var duration = 1100;

        function step(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     Projects disclosure — hidden by default, expands on click
     --------------------------------------------------------- */
  var projToggle = document.getElementById('projects-toggle');
  var projPanel = document.getElementById('projects-panel');
  var projLabel = projToggle.querySelector('[data-open-text]');

  projToggle.addEventListener('click', function () {
    var willOpen = projToggle.getAttribute('aria-expanded') !== 'true';

    projToggle.setAttribute('aria-expanded', String(willOpen));
    projPanel.hidden = !willOpen;
    projLabel.textContent = projLabel.getAttribute(willOpen ? 'data-open-text' : 'data-closed-text');

    if (willOpen) {
      projPanel.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
    } else {
      projToggle.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  // Deep link: /#projects opens the panel so a shared link lands on content.
  if (window.location.hash === '#projects') projToggle.click();

  /* ---------------------------------------------------------
     Service cards — spotlight follows the pointer
     --------------------------------------------------------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ======================== Contact heading switcher ========================
  (function initContactHeadingSwitcher() {
    const headings = document.querySelectorAll('.contact-heading');
    if (headings.length < 2) return;

    let currentIndex = 0;

    function switchHeading() {
      headings[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % headings.length;
      headings[currentIndex].classList.add('active');
    }

    setInterval(switchHeading, 5000);
  })();

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
