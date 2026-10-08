/*
  MINDNEXT Technologies - Single Page Application Script
  Clean, Simple, Zero-Lag Smooth Scrolling & 3-Line to Cross (X) Toggle
*/

(function () {
  'use strict';

  /* ============ 3-LINE TO CROSS (X / CHOKADI) & SIMPLE MENU ============ */
  var navLinks = document.querySelectorAll('.simple-nav-list .nav-link');
  var mobileNav = document.getElementById('mobileNav');
  var menuToggle = document.getElementById('menuToggle');
  var isNavigating = false;
  var navTimeout = null;

  function closeMenu() {
    if (menuToggle && mobileNav) {
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function openMenu() {
    if (menuToggle && mobileNav) {
      menuToggle.classList.add('open');
      mobileNav.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menuToggle.classList.contains('open');
      if (isOpen) {
        closeMenu(); // Clicking X (cross / chokadi) closes menu & turns back to 3 lines
      } else {
        openMenu(); // Clicking 3 lines opens menu & turns into X (cross / chokadi)
      }
    });
  }

  // Close menu on click outside
  document.addEventListener('click', function (e) {
    if (mobileNav && mobileNav.classList.contains('open')) {
      if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  function setActiveNavLink(targetId) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + targetId) {
        link.classList.add('is-active');
      } else if (href && href.startsWith('#')) {
        link.classList.remove('is-active');
      }
    });
  }

  // Smooth scroll for internal anchors & auto-close menu
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMenu();

        // Lock scrollspy during user-initiated smooth scroll to avoid stutter
        isNavigating = true;
        if (navTimeout) clearTimeout(navTimeout);
        setActiveNavLink(targetId);

        var headerOffset = 76;
        var elementPosition = targetEl.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Release lock
        navTimeout = setTimeout(function () {
          isNavigating = false;
        }, 650);
      }
    });
  });

  /* ============ HIGH-PERFORMANCE SCROLLSPY ============ */
  var primarySectionIds = ['home', 'services', 'pillars', 'contact'];
  var ticking = false;

  function updateActiveNavOnScroll() {
    if (isNavigating) {
      ticking = false;
      return;
    }

    var scrollY = window.pageYOffset;
    var headerOffset = 90;
    var windowHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight;

    // If reached bottom of page, highlight contact
    if (scrollY + windowHeight >= docHeight - 40) {
      setActiveNavLink('contact');
      ticking = false;
      return;
    }

    var currentSection = 'home';
    for (var i = 0; i < primarySectionIds.length; i++) {
      var sectionId = primarySectionIds[i];
      var sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        var top = sectionEl.offsetTop - headerOffset;
        if (scrollY >= top) {
          currentSection = sectionId;
        }
      }
    }

    setActiveNavLink(currentSection);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveNavOnScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ============ REVEAL ON SCROLL ============ */
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
  }

  function observeReveals() {
    var items = document.querySelectorAll('.reveal:not(.visible)');
    items.forEach(function (item) {
      if (observer) { observer.observe(item); } else { item.classList.add('visible'); }
    });
  }

  observeReveals();

  // Fallback so all elements appear
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (item) {
      item.classList.add('visible');
    });
  }, 1200);

  /* ============ INQUIRY FORM SUBMISSION ============ */
  document.querySelectorAll('form').forEach(function (formEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }
      var noteEl = formEl.querySelector('.form-note') || document.getElementById('formNote');
      if (noteEl) noteEl.classList.add('show');
      formEl.reset();
    });
  });

  /* ============ INIT DATES ============ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
