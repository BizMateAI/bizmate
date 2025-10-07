/* site.js - BizMate single page behaviors
   - hamburger menu
   - smooth anchors
   - pricing toggle
   - testimonials carousel
   - FAQ accordion
   - Formspree AJAX form
   - Calendly inline & popup + GA events
*/
(function(){
  const CFG = {
    GA_ID: 'G-GCW489P0WR',
    FORMSPREE: 'https://formspree.io/f/xgvnylea',
    CALENDLY_URL: 'https://calendly.com/bizmate-growth/30-minute-consultation',
    CONTACT_EMAIL: 'growth@bizmte.com'
  };

  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
  function trackEvent(name, params){ try{ if(window.gtag) gtag('event', name, params||{}); }catch(e){} }

  // Mobile nav
  const hamb = $('#hamburger'), nav = $('#nav');
  if(hamb && nav){
    hamb.addEventListener('click', ()=> {
      const expanded = hamb.getAttribute('aria-expanded') === 'true';
      hamb.setAttribute('aria-expanded', (!expanded).toString());
      nav.style.display = expanded ? '' : 'flex';
    });
    window.addEventListener('resize', ()=> { if(window.innerWidth>820) nav.style.display='flex'; else nav.style.display=''; });
  }

  // Smooth scroll for same-page links
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    if(a.dataset.plan) trackEvent('plan_click',{plan:a.dataset.plan});
    if(a.id==='primaryCTA' || a.id==='bookNowTop' || a.id==='bookNowAside') trackEvent('cta_click',{label:id});
  });

  // Pricing toggle
  const billing = $('#billing');
  function updatePrices(mode){
    $$('.price').forEach(el=>{
      const month = parseInt(el.dataset.month,10);
      const annual = parseInt(el.dataset.annual,10);
      if(isNaN(month) || isNaN(annual)) return;
      if(mode==='monthly') el.innerHTML = '$' + month + '<small>/mo</small>';
      else el.innerHTML = '$' + Math.round(annual/12) + '<small>/mo billed annually</small>';
    });
  }
  if(billing){
    billing.addEventListener('change', e=> updatePrices(e.target.value));
    updatePrices(billing.value);
  }

  // Testimonials carousel
  (function(){
    const track = document.getElementById('testTrack');
    const prev = document.getElementById('prevTest');
    const next = document.getElementById('nextTest');
    if(!track) return;
    const items = track.children;
    let index = 0;
    function show(i){
      const w = items[0].getBoundingClientRect().width + 12;
      track.style.transform = 'translateX(' + (-i * w) + 'px)';
    }
    prev?.addEventListener('click', ()=> { index = Math.max(0,index-1); show(index); });
    next?.addEventListener('click', ()=> { index = Math.min(items.length-1,index+1); show(index); });
    setInterval(()=>{ index = (index+1)%items.length; show(index); }, 5000);
  })();

  // FAQ accordion
  $$('.faq-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      const parent = q.parentElement;
      const open = q.getAttribute('data-open') === 'true';
      q.setAttribute('data-open', (!open).toString());
      const a = parent.querySelector('.faq-a');
      if(a) a.style.display = open ? 'none' : 'block';
      trackEvent('faq_toggle',{question: q.textContent.trim(), open: !open});
    });
  });

  // Calendly
  function initCalendly(){
    try{
      if(window.Calendly && document.getElementById('calendlyInline') && !document.getElementById('calendlyInline').hasChildNodes()){
        Calendly.initInlineWidget({ url: CFG.CALENDLY_URL, parentElement: document.getElementById('calendlyInline') });
      }
    }catch(e){}
  }
  if(window.Calendly) initCalendly();
  window.addEventListener('load', initCalendly);
  $('#openCalendlyPopup')?.addEventListener('click', function(e){
    e.preventDefault();
    if(window.Calendly){ Calendly.initPopupWidget({ url: CFG.CALENDLY_URL }); trackEvent('open_calendly',{method:'popup'}); }
    else { window.open(CFG.CALENDLY_URL,'_blank','noopener'); trackEvent('open_calendly',{method:'newtab'}); }
  });

  // Track calendly inline view (intersection)
  const calEl = document.getElementById('calendlyInline');
  if(calEl){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ trackEvent('calendly_view',{visible:true}); obs.disconnect(); }
      });
    }, {threshold:0.4});
    obs.observe(calEl);
  }

  // Formspree AJAX submit
  (function(){
    const form = document.getElementById('consultForm');
    const msg = document.getElementById('formMsg');
    const submitBtn = document.getElementById('submitBtn');
    if(!form) return;
    form.addEventListener('submit', async (e)=>{
      e.preventDefault(); msg.innerHTML='';
      const name = form.name.value.trim(); const email = form.email.value.trim();
      if(!name || !email){ msg.innerHTML = '<div class="error">Please include your name and email.</div>'; return; }
      submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
      form.querySelector('[name="to"]').value = CFG.CONTACT_EMAIL;
      const fd = new FormData(form);
      try{
        const res = await fetch(CFG.FORMSPREE, { method:'POST', body: fd, headers: { 'Accept': 'application/json' }});
        if(res.ok){ msg.innerHTML = '<div class="success">Thanks — message sent. We will contact you shortly.</div>'; form.reset(); trackEvent('contact_form_submit',{method:'formspree'}); }
        else { const json = await res.json().catch(()=>null); msg.innerHTML = '<div class="error">'+(json?.error||'Submission failed — try again later.')+'</div>'; }
      }catch(err){ msg.innerHTML = '<div class="error">Network error — please try again.</div>'; console.error(err); }
      finally{ submitBtn.disabled = false; submitBtn.textContent = 'Request consultation'; }
    });
  })();

  // Track phone / mail clicks
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(href.startsWith('tel:')) trackEvent('phone_click',{phone: href});
    if(href.startsWith('mailto:')) trackEvent('email_click',{email: href});
  });

})();
