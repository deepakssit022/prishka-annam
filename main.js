/* ══════════════════════════════════════════════════════════════════════════════
   PRISHKA ANNAM — Main JavaScript
   Handles: mobile nav toggle, pricing toggle, scroll animations, form handling
   ══════════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── MOBILE NAV TOGGLE ─────────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
    });

    // Close nav when a link is clicked (mobile)
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      }
    });
  }

  // ── PRICING TOGGLE ────────────────────────────────────────────────────────
  const priceToggle = document.getElementById('price-toggle-btn');
  const mrpLabel    = document.getElementById('toggle-label-mrp');
  const offerLabel  = document.getElementById('toggle-label-offer');

  // Initialize offer view as active by default (matching flyer highlight & initial aria-checked="true")
  document.body.classList.add('show-offer');

  if (priceToggle) {
    priceToggle.addEventListener('click', () => {
      const isOffer = priceToggle.getAttribute('aria-checked') === 'true';
      const newState = !isOffer;

      priceToggle.setAttribute('aria-checked', String(newState));
      document.body.classList.toggle('show-offer', newState);

      // Visual label emphasis
      if (newState) {
        mrpLabel.classList.remove('price-toggle-label--active');
        offerLabel.classList.add('price-toggle-label--active');
      } else {
        mrpLabel.classList.add('price-toggle-label--active');
        offerLabel.classList.remove('price-toggle-label--active');
      }
    });
  }

  // ── CATALOG VIEW SWITCHER (Board View vs Card Grid) ───────────────────────
  const btnBoard = document.getElementById('btn-view-board');
  const btnCards = document.getElementById('btn-view-cards');
  const viewBoard = document.getElementById('pricing-board-view');
  const viewCards = document.getElementById('pricing-cards-view');

  if (btnBoard && btnCards && viewBoard && viewCards) {
    btnBoard.addEventListener('click', () => {
      btnBoard.classList.add('is-active');
      btnBoard.setAttribute('aria-selected', 'true');
      btnCards.classList.remove('is-active');
      btnCards.setAttribute('aria-selected', 'false');

      viewBoard.hidden = false;
      viewCards.hidden = true;
    });

    btnCards.addEventListener('click', () => {
      btnCards.classList.add('is-active');
      btnCards.setAttribute('aria-selected', 'true');
      btnBoard.classList.remove('is-active');
      btnBoard.setAttribute('aria-selected', 'false');

      viewBoard.hidden = true;
      viewCards.hidden = false;
    });
  }

  // ── QUICK INQUIRE PRE-FILL ────────────────────────────────────────────────
  document.querySelectorAll('[data-prefill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetVal = btn.getAttribute('data-prefill');
      const select = document.getElementById('inq-grade');
      if (select && targetVal) {
        select.value = targetVal;
      }
    });
  });

  // ── INTERACTIVE MAKAHANA POUCH POURING ANIMATION ─────────────────────────
  const pouchContainer = document.getElementById('interactive-pouch-container');
  if (pouchContainer) {
    // Tap or Click toggle (perfect for mobile and desktop click)
    pouchContainer.addEventListener('click', () => {
      pouchContainer.classList.toggle('is-pouring');
    });

    // Keyboard support (Space or Enter triggers pour)
    pouchContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pouchContainer.classList.toggle('is-pouring');
      }
    });
  }

  // ── SCROLL REVEAL ANIMATION ───────────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!prefersReducedMotion.matches) {
    const revealElements = document.querySelectorAll(
      '.use-case-card, .grade-card, .inquiry-form-wrapper'
    );

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback: show everything immediately
      revealElements.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // ── FORM HANDLING ─────────────────────────────────────────────────────────
  const inquiryForm = document.getElementById('inquiry-form');
  const formStatus  = inquiryForm ? inquiryForm.querySelector('.form-status') : null;

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = inquiryForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value !== '') {
        return; // Bot detected
      }

      // Gather data
      const formData = new FormData(inquiryForm);
      const data = Object.fromEntries(formData.entries());

      // Validate required fields
      const name = data.name ? data.name.trim() : '';
      const role = data.role || '';

      if (!name || !role) {
        if (formStatus) {
          formStatus.textContent = 'Please fill in your name and select your role.';
          formStatus.className = 'form-status error';
        }
        // Move focus to first invalid field
        const firstInvalid = inquiryForm.querySelector(':user-invalid, :invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate submission (replace with actual endpoint)
      const submitBtn = inquiryForm.querySelector('.btn-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent =
            '✓ Thank you! Your inquiry has been received. We\'ll get back to you shortly.';
          formStatus.className = 'form-status success';
        }
        inquiryForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      }, 1200);
    });
  }

  // ── SMOOTH SCROLL for anchor links (progressive enhancement) ──────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without reload
        history.pushState(null, '', targetId);
      }
    });
  });

  // ── HEADER SHADOW ON SCROLL ───────────────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

