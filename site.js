/* site.js: nav active, smooth anchors, mobile nav, basic tracking, form handling API */
(function(){'use strict';function q(s,r){return (r||document).querySelector(s);}function qa(s,r){return Array.from((r||document).querySelectorAll(s));}
function setActiveNav(){var path=location.pathname||'/'; if(path==='/index.html') path='/'; qa('nav a').forEach(function(a){var href=a.getAttribute('href')||''; if(href===path || (href==='/'&&path==='/')) a.classList.add('active'); else a.classList.remove('active');});}
// smooth anchors
document.addEventListener('click',function(ev){var a=ev.target.closest('a[href^="#"]'); if(!a) return; var href=a.getAttribute('href'); if(href&&href!=='#'){var el=document.querySelector(href); if(el){ev.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); history.replaceState(null,'',href);}}});
// tracking helper
function trackEvent(n,p){try{if(window.gtag)window.gtag('event',n,p||{});}catch(e){}
}
// attach basic link tracking
qa('a[href*="calendly.com"]').forEach(function(el){el.addEventListener('click',function(){trackEvent('open_calendly',{method:'link'});});});qa('a[href^="mailto:"]').forEach(function(el){el.addEventListener('click',function(){trackEvent('click_mailto',{to:el.getAttribute('href')});});});qa('a[href^="tel:"]').forEach(function(el){el.addEventListener('click',function(){trackEvent('click_phone',{phone:el.getAttribute('href')});});});
// mobile nav (simplified): copy desktop nav into mobile panel
function initMobile(){var ham=q('.hamburger'); if(!ham) return; var mobile=q('.mobile-nav'); if(!mobile){mobile=document.createElement('nav');mobile.className='mobile-nav'; var desktop=q('nav'); mobile.innerHTML='<div class="close"><button id="mobileClose">Close ✕</button></div>'+ (desktop?desktop.innerHTML:''); document.body.appendChild(mobile);} ham.addEventListener('click',function(){mobile.style.display='block'; document.body.style.overflow='hidden'; trackEvent('open_mobile_nav');}); document.getElementById('mobileClose')?.addEventListener('click',function(){mobile.style.display='none'; document.body.style.overflow='';}); mobile.addEventListener('click',function(e){var a=e.target.closest('a'); if(a){mobile.style.display='none'; document.body.style.overflow='';}});
}
// forms: expose API to mark a form handled
window.BizMateSite=window.BizMateSite||{}; window.BizMateSite.markFormHandled=function(f){try{var el=(typeof f==='string')?document.getElementById(f):f; if(el&&el.tagName==='FORM') el.setAttribute('data-handled','true');}catch(e){} };
// generic fallback validation
function genericForms(){qa('form').forEach(function(form){ if(form.hasAttribute('data-handled')) return; form.addEventListener('submit',function(ev){ var name=form.querySelector('[name="name"]'); var email=form.querySelector('[type="email"]'); if((name && !name.value.trim()) || (email && !email.value.trim())){ ev.preventDefault(); alert('Please provide your name and email.'); } else { trackEvent('form_submit',{form: form.getAttribute('id')||form.getAttribute('name')||'unknown'}); } }); });}
window.addEventListener('load',function(){ setActiveNav(); initMobile(); genericForms(); }); window.addEventListener('popstate',setActiveNav);
})();