(function () {
  'use strict';

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.nav-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden') === false;
      if (open) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
      toggle.setAttribute('aria-expanded', String(!open));
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { panel.setAttribute('hidden', ''); });
    });
  }

  // Enquiry form — client-side only for now; no backend wired up yet.
  var form = document.querySelector('[data-enquiry-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    var defaultStatus = status ? status.textContent : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) status.textContent = 'Thank you — we will be in touch.';
    });
  }

  // Scroll-triggered reveal. Only ever ADDS a class; the un-animated state
  // is the finished layout, so any failure here is invisible rather than
  // destructive to content.
  var armed = false;
  function armReveals() {
    if (typeof IntersectionObserver !== 'function') return;
    var targets = Array.prototype.slice
      .call(document.body.querySelectorAll('h1, h2, h3, blockquote, p, .photo-placeholder-mount, img.wx-target'))
      .filter(function (el) {
        return !el.classList.contains('wx-rise') && !el.classList.contains('wx-plate');
      });

    function mark(el) {
      el.classList.add(el.tagName === 'IMG' || el.classList.contains('photo-placeholder-mount') ? 'wx-plate' : 'wx-rise');
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        mark(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });

    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        mark(el);
      } else {
        io.observe(el);
      }
    });
    armed = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', armReveals);
  } else {
    armReveals();
  }
  window.addEventListener('scroll', function () { if (!armed) armReveals(); }, { passive: true });
})();
