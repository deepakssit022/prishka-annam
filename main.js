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
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-prefill]');
    if (btn) {
      const targetVal = btn.getAttribute('data-prefill');
      const select = document.getElementById('inq-grade');
      if (select && targetVal) {
        select.value = targetVal;
      }
    }
  });

  // ── PRODUCT CATALOGUE INTERACTIVE SIZE CONFIGURATOR ────────────────────────
  document.querySelectorAll('.product-card').forEach((card) => {
    const sizePills = card.querySelectorAll('.size-pill-btn');
    const dynamicOffer = card.querySelector('.dynamic-offer');
    const dynamicMrp = card.querySelector('.dynamic-mrp');
    const dynamicSave = card.querySelector('.dynamic-save');
    const activeName = card.querySelector('.config-active-name');
    const orderBtn = card.querySelector('.card-order-btn');
    const orderBtnText = orderBtn ? orderBtn.querySelector('.btn-text') : null;

    sizePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        sizePills.forEach((p) => {
          p.classList.remove('is-active');
          p.removeAttribute('aria-checked');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-checked', 'true');

        const mrp = pill.getAttribute('data-mrp');
        const offer = pill.getAttribute('data-offer');
        const save = pill.getAttribute('data-save');
        const label = pill.getAttribute('data-label');
        const prefill = pill.getAttribute('data-prefill');
        const grade = pill.getAttribute('data-grade');

        if (dynamicOffer) dynamicOffer.textContent = offer;
        if (dynamicMrp) dynamicMrp.textContent = `₹${mrp}`;
        if (dynamicSave) dynamicSave.textContent = `Save ₹${save}`;
        if (activeName && label) activeName.textContent = label;
        if (orderBtn && prefill) orderBtn.setAttribute('data-prefill', prefill);
        if (orderBtnText && label) {
          orderBtnText.textContent = `Order ${label} (${grade})`;
        }
      });
    });

    // Drawer toggle for all 4 sizes comparison
    const toggleBtn = card.querySelector('.btn-toggle-all-sizes');
    const drawer = card.querySelector('.all-sizes-drawer');
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        drawer.hidden = isExpanded;
      });
    }
  });

  // ── INTERACTIVE MAKAHANA POUCH POURING ANIMATION (60FPS CANVAS PHYSICS) ──
  const pouchContainer = document.getElementById('interactive-pouch-container');
  const canvas = document.getElementById('pour-canvas');
  const pouch = document.getElementById('makhana-packet');

  if (pouchContainer && canvas && pouch) {
    const ctx = canvas.getContext('2d');

    // Preload photographic makhana puff textures
    const puffSources = [
      'assets/puff-real-1.png',
      'assets/puff-real-2.png',
      'assets/puff-real-3.png',
      'assets/puff-real-4.png'
    ];
    const puffImages = [];
    let loadedCount = 0;
    puffSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => { loadedCount++; };
      puffImages.push(img);
    });

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      const rect = pouchContainer.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isPouring = false;
    let particles = [];
    let lastSpawnTime = 0;

    // Calculate live mouth & bowl coordinates from DOM elements
    function getStreamCoordinates() {
      const containerRect = pouchContainer.getBoundingClientRect();
      const pouchRect = pouch.getBoundingClientRect();

      // Top-left tilted mouth opening
      const mouthX = pouchRect.left - containerRect.left + pouchRect.width * 0.22;
      const mouthY = pouchRect.top - containerRect.top + pouchRect.height * 0.12;

      // Center of the roasted brass bowl receiving the cascade
      const targetX = pouchRect.left - containerRect.left + pouchRect.width * 0.54;
      const targetY = pouchRect.bottom - containerRect.top - pouchRect.height * 0.08;

      return { mouthX, mouthY, targetX, targetY };
    }

    function emitPuff(isBackLayer) {
      if (loadedCount === 0) return;
      const { mouthX, mouthY, targetX, targetY } = getStreamCoordinates();
      const puffImg = puffImages[Math.floor(Math.random() * puffImages.length)];
      
      const fullSize = isBackLayer ? (28 + Math.random() * 8) : (38 + Math.random() * 12);
      
      particles.push({
        img: puffImg,
        isBackLayer: isBackLayer,
        x: mouthX + (Math.random() * 10 - 5),
        y: mouthY + (Math.random() * 8 - 4),
        vx: 1.2 + Math.random() * 1.4, // natural forward arc
        vy: 1.4 + Math.random() * 1.2, // downward momentum out of tilted mouth
        size: fullSize * 0.75, // emerges naturally sized
        targetSize: fullSize,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.04, // gentle, realistic tumbling
        alpha: 0.2,
        targetX: targetX + (Math.random() * 28 - 14),
        targetY: targetY + (Math.random() * 18 - 9),
        bounced: false,
        dead: false
      });
    }

    function renderPhysics(timestamp) {
      ctx.clearRect(0, 0, width, height);

      // Continuously emit dense, organic stream while pouring (2 puffs per burst)
      if (isPouring) {
        if (!lastSpawnTime || timestamp - lastSpawnTime > 34) { // ~55 puffs/sec for dense stream
          emitPuff(true);  // Background depth puff
          emitPuff(false); // Foreground crisp puff
          lastSpawnTime = timestamp;
        }
      }

      // Sort: draw background depth puffs first, foreground puffs on top
      particles.sort((a, b) => (a.isBackLayer ? -1 : 1));

      // Update and draw active particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.40; // natural earth gravity
        // Smoothly guide stream toward bowl target
        p.vx += (p.targetX - p.x) * 0.008;
        p.rot += p.vrot;

        // Smooth fade-in as it clears the mouth
        if (p.size < p.targetSize) {
          p.size += (p.targetSize - p.size) * 0.2;
        }
        if (p.alpha < 1 && !p.bounced) {
          p.alpha = Math.min(1, p.alpha + 0.25);
        }

        // Soft bounce & landing inside the roasted brass bowl
        if (p.y >= p.targetY) {
          if (!p.bounced) {
            p.bounced = true;
            p.vy = -p.vy * 0.22; // gentle physical dampening
            p.vx = (Math.random() - 0.5) * 0.6;
            p.vrot = p.vrot * 0.3;
          } else {
            p.alpha -= 0.07;
            if (p.alpha <= 0) {
              p.dead = true;
            }
          }
        }

        if (p.dead || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        // Draw puff sprite with soft contact shadow
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.isBackLayer) {
          ctx.filter = 'brightness(0.92)';
          ctx.shadowColor = 'rgba(25, 12, 6, 0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 2;
        } else {
          ctx.shadowColor = 'rgba(25, 12, 6, 0.45)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 4;
        }

        if (p.img && p.img.complete) {
          ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }

      requestAnimationFrame(renderPhysics);
    }

    requestAnimationFrame(renderPhysics);

    // Interactive Hover & Tap Controls
    pouchContainer.addEventListener('mouseenter', () => {
      isPouring = true;
      pouchContainer.classList.add('is-pouring');
    });

    pouchContainer.addEventListener('mouseleave', () => {
      isPouring = false;
      pouchContainer.classList.remove('is-pouring');
    });

    pouchContainer.addEventListener('click', () => {
      isPouring = !isPouring;
      pouchContainer.classList.toggle('is-pouring', isPouring);
    });

    pouchContainer.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        isPouring = !isPouring;
        pouchContainer.classList.toggle('is-pouring', isPouring);
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

