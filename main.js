/* ============================================================
   main.js — Portfolio JavaScript
   Handles: navbar, particles, smooth scroll, project filters,
            flip cards (touch), scroll-to-top, contact form.
   No external dependencies required.
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILITY: query helper
  ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ----------------------------------------------------------
     NAVBAR — shrink on scroll + mobile toggle
  ---------------------------------------------------------- */
  const nav       = $('#mainNav');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  const updateNav = () => {
    if (window.scrollY > 60) {
      nav.classList.add('shrink');
    } else {
      nav.classList.remove('shrink');
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  $$('.js-scroll', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ----------------------------------------------------------
     SMOOTH SCROLL with navbar offset
  ---------------------------------------------------------- */
  $$('a.js-scroll, a.btn-hero').forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      const target = $(hash);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     NAVBAR ACTIVE LINK on scroll
  ---------------------------------------------------------- */
  const sections  = $$('section[id], header[id]');
  const navAnchors = $$('#navLinks .js-scroll');

  const markActiveNavLink = () => {
    const scrollPos = window.scrollY + nav.offsetHeight + 60;
    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${section.id}`) {
            a.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', markActiveNavLink, { passive: true });
  markActiveNavLink();


  /* ----------------------------------------------------------
     PARTICLES (hero background)
  ---------------------------------------------------------- */
  const particleContainer = $('#particles');

  if (particleContainer) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 60 + 20;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 14 + 10}s;
        animation-delay: ${Math.random() * -20}s;
      `;
      particleContainer.appendChild(p);
    }
  }


  /* ----------------------------------------------------------
     PROJECT FILTER
  ---------------------------------------------------------- */
  const filterBtns  = $$('.filter-btn');
  const projectItems = $$('.portfolio-item', $('#projectsGrid'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ----------------------------------------------------------
     SCROLL TO TOP BUTTON
  ---------------------------------------------------------- */
  const scrollTopBtn = $('#scrollTop');

  const toggleScrollTop = () => {
    if (window.scrollY > 120) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  toggleScrollTop();


  /* ----------------------------------------------------------
     CONTACT FORM — basic validation + feedback
  ---------------------------------------------------------- */
  const form       = $('#contactForm');
  const nameField  = $('#name');
  const emailField = $('#email');
  const msgField   = $('#message');
  const sendBtn    = $('#sendBtn');
  const formStatus = $('#formStatus');

  const nameError  = $('#nameError');
  const emailError = $('#emailError');
  const msgError   = $('#messageError');

  const showError = (field, errEl) => {
    field.classList.add('invalid');
    errEl.classList.add('show');
  };

  const clearError = (field, errEl) => {
    field.classList.remove('invalid');
    errEl.classList.remove('show');
  };

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Live clear
  nameField.addEventListener('input',  () => clearError(nameField,  nameError));
  emailField.addEventListener('input', () => clearError(emailField, emailError));
  msgField.addEventListener('input',   () => clearError(msgField,   msgError));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!nameField.value.trim()) {
      showError(nameField, nameError); valid = false;
    }
    if (!isValidEmail(emailField.value)) {
      showError(emailField, emailError); valid = false;
    }
    if (!msgField.value.trim()) {
      showError(msgField, msgError); valid = false;
    }

    if (!valid) return;

    // Disable button while "sending"
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = '';

    // Simulate async send (replace with real fetch/POST in production)
    setTimeout(() => {
      formStatus.textContent = '✓ Message sent! I will get back to you soon.';
      formStatus.className = 'success';
      form.reset();
      sendBtn.disabled = false;
      sendBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    }, 1400);
  });


  /* ----------------------------------------------------------
     SCROLL-TRIGGERED FADE IN (Intersection Observer)
     Adds .visible class to skill items and timeline cards
     when they enter the viewport.
  ---------------------------------------------------------- */
  const fadeEls = $$('.skill-item, .timeline-card, .portfolio-item');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      io.observe(el);
    });

    // Add .visible style immediately
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .skill-item.visible,
        .timeline-card.visible,
        .portfolio-item.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        /* Keep hidden filter items truly invisible */
        .portfolio-item.hidden {
          display: none !important;
        }
      </style>
    `);
  }

})();
