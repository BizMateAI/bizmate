// site.js - shared behaviors: hamburger menu, GA helpers, form attachers, calendly click tracking
(function(){
  // Simple DOM helpers
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

  // 1) Hamburger menu (mobile)
  const hamb = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if(hamb && nav){
    hamb.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', (!expanded).toString());
      nav.style.display = expanded ? '' : 'flex';
    });
    // close nav on outside click (mobile)
    document.addEventListener('click', function(e){
      if(window.innerWidth <= 720 && nav.style.display === 'flex' && !e.target.closest('.topbar')){
        nav.style.display = '';
        hamb.setAttribute('aria-expanded','false');
      }
    });
  }

  // 2) GA helper (safe wrapper)
  function trackEvent(name, params){
    try{ if(window.gtag) gtag('event', name, params || {}); }catch(e){/*no-op*/ }
  }

  // 3) Track Calendly link clicks (global)
  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    if(a.href && a.href.includes('calendly.com')){
      trackEvent('open_calendly', {method: 'link', href: a.href});
    }
  });

  // 4) Attach generic Formspree AJAX handler to forms with data-formspree attribute
  function attachFormspree(formEl, endpoint){
    if(!formEl) return;
    formEl.addEventListener('submit', async function(e){
      e.preventDefault();
      const submitBtn = formEl.querySelector('button[type="submit"], .submit') || null;
      const msgEl = formEl.querySelector('.form-msg') || formEl.querySelector('#consultMsg') || null;
      if(msgEl) msgEl.innerHTML = '';
      // basic validation: require name and email if present
      const name = formEl.querySelector('[name="name"]')?.value?.trim() || '';
      const email = formEl.querySelector('[name="email"]')?.value?.trim() || '';
      if((formEl.querySelector('[name="name"]') && !name) || (formEl.querySelector('[name="email"]') && !email)){
        if(msgEl) msgEl.innerHTML = '<div class="error">Please provide your name and email.</div>';
        return;
      }

      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      // ensure hidden to field if present
      const toField = formEl.querySelector('[name="to"]');
      if(toField) toField.value = 'growth@bizmte.com';

      const fd = new FormData(formEl);
      try{
        const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' }});
        if(res.ok){
          if(msgEl) msgEl.innerHTML = '<div class="success">Thanks — message sent. We will contact you shortly.</div>';
          formEl.reset();
          trackEvent('contact_form_submit', {method:'formspree'});
        } else {
          const json = await res.json().catch(()=>null);
          const error = json?.error || 'Submission failed — please try again later.';
          if(msgEl) msgEl.innerHTML = '<div class="error">'+error+'</div>';
        }
      }catch(err){
        if(msgEl) msgEl.innerHTML = '<div class="error">Network error — please try again.</div>';
        console.error(err);
      }finally{
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Request consultation'; }
      }
    });
  }

  // Attach to the consultation form if present
  document.addEventListener('DOMContentLoaded', function(){
    const consult = document.getElementById('consultForm');
    if(consult){
      // use the page-specific endpoint used across your site
      attachFormspree(consult, 'https://formspree.io/f/xgvnylea');
    }
  });

  // Expose helpers for debugging
  window.BizMate = window.BizMate || {};
  window.BizMate.trackEvent = trackEvent;
})();
