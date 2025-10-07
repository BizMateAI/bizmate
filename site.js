/* site.js - updated
   - Maintains previous features (nav active, smooth scroll, GA tracking)
   - Adds mobile hamburger open/close
   - Marks known AJAX-handled forms as data-handled to avoid fallback
   - Exposes API BizMateSite.markFormHandled(formElementOrId)
*/

(function () {
  'use strict';

  // Helpers
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  // 1) NAV: mark active link based on current path
  function setActiveNav() {
    var path = location.pathname || '/';
    if (path === '/' || path === '/index.html') path = '/';
    qa('nav a').forEach(function (a) {
      try {
        var href = a.getAttribute('href') || '';
        if (href === path || (href === '/' && path === '/')) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      } catch (e) { a.classList.remove('active'); }
    });
  }

  // 2) Smooth scroll for same-page anchors
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('a[href^="#"]');
    if (a) {
      var href = a.getAttribute('href');
      if (href && href !== '#') {
        var el = document.querySelector(href);
        if (el) {
          ev.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update hash without adding history entry
          history.replaceState(null, '', href);
        }
      }
    }
  });

  // 3) GA event helper
  function trackEvent(name, props) {
    try { if (window.gtag) window.gtag('event', name, props || {}); } catch (e) {}
  }

  // 4) Track calendly links + mailto + tel
  function attachTracking() {
    qa('a[href*="calendly.com"]').forEach(function (el) {
      el.addEventListener('click', function () { trackEvent('open_calendly', { method: 'link' }); });
    });
    qa('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () { trackEvent('click_mailto', { to: el.getAttribute('href') }); });
    });
    qa('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () { trackEvent('click_phone', { phone: el.getAttribute('href') }); });
    });
  }

  // 5) Mobile hamburger menu
  function initMobileNav() {
    var hamburger = q('.hamburger');
    if (!hamburger) return;
    // create the mobile nav panel if doesn't exist
    var mobileNav = q('.mobile-nav');
    if (!mobileNav) {
      mobileNav = document.createElement('nav');
      mobileNav.className = 'mobile-nav';
      // copy nav links into mobile nav
      var desktopNav = q('nav');
      if (desktopNav) {
        mobileNav.innerHTML = '<div class="close"><button aria-label="Close menu" id="mobileNavClose" style="border:none;background:transparent;cursor:pointer;font-weight:700">Close ✕</button></div>' + desktopNav.innerHTML;
        document.body.appendChild(mobileNav);
      }
    }

    hamburger.addEventListener('click', function () {
      mobileNav.style.display = 'block';
      // animate slightly
      setTimeout(function () { mobileNav.style.transform = 'translateX(0)'; }, 20);
      document.body.style.overflow = 'hidden';
      trackEvent('open_mobile_nav', {});
    });

    // close handlers
    document.getElementById('mobileNavClose')?.addEventListener('click', function () {
      mobileNav.style.display = 'none';
      document.body.style.overflow = '';
    });
    // click link in mobile nav closes it
    mobileNav.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) {
        mobileNav.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // 6) Generic form fallback & marking handled forms
  function markKnownAjaxFormsHandled() {
    // Mark forms that we know have their own JS handlers to avoid fallback.
    // Add any other form IDs here in future.
    var known = ['consultForm', 'contactForm'];
    known.forEach(function (id) {
      var f = document.getElementById(id);
      if (f) f.setAttribute('data-handled', 'true');
    });
  }

  function genericFormFallback() {
    qa('form').forEach(function (form) {
      if (form.hasAttribute('data-handled')) return; // skip
      form.addEventListener('submit', function (ev) {
        // basic validation if name/email fields exist
        var nameField = form.querySelector('[name="name"], [name="fullname"], [name="your-name"]');
        var emailField = form.querySelector('[name="email"], input[type="email"]');
        if (!nameField && !emailField) return;
        var nameVal = nameField ? (nameField.value || '').trim() : '';
        var emailVal = emailField ? (emailField.value || '').trim() : '';
        if ((nameField && !nameVal) || (emailField && !emailVal)) {
          ev.preventDefault();
          alert('Please provide your name and email.');
        } else {
          // track the submission (fallback)
          try { trackEvent('form_submit', { form: form.getAttribute('id') || form.getAttribute('name') || 'unknown' }); } catch (e) {}
        }
      });
    });
  }

  // 7) Accessibility: focus main on nav click
  function attachNavFocus() {
    qa('nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        var main = document.querySelector('main');
        if (main) {
          setTimeout(function () { main.setAttribute('tabindex', '-1'); main.focus(); }, 250);
        }
      });
    });
  }

  // 8) Expose small API to mark form handled
  window.BizMateSite = window.BizMateSite || {};
  window.BizMateSite.markFormHandled = function (formOrId) {
    try {
      var f = (typeof formOrId === 'string') ? document.getElementById(formOrId) : formOrId;
      if (f && f.tagName === 'FORM') f.setAttribute('data-handled', 'true');
    } catch (e) { /* ignore */ }
  };

  // Initialize everything on load
  window.addEventListener('load', function () {
    setActiveNav();
    attachTracking();
    initMobileNav();
    markKnownAjaxFormsHandled(); // mark consultForm/contactForm as handled
    genericFormFallback();
    attachNavFocus();
    // expose for debugging
    window.BizMateSite.navActive = setActiveNav;
    window.BizMateSite.trackEvent = trackEvent;
  });

  // Re-run some on history navigation
  window.addEventListener('popstate', function () { setActiveNav(); attachTracking(); });

})();
