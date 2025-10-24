// main.js - BizMate (smooth scroll, form UX)
document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var tgt = document.querySelector(this.getAttribute('href'));
      if(tgt) tgt.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Contact form submission UX using Formspree
  var form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.innerText = 'Sending...';
      var fd = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      }).then(function(res){
        if(res.ok){ alert('Thanks — we received your message. I will reply shortly.'); form.reset(); }
        else{ alert('Submission problem — please email growth@bizmte.com'); }
      }).catch(function(){ alert('Network issue. Please try again.'); })
      .finally(function(){ btn.disabled = false; btn.innerText = 'Send message'; });
    });
  }
});
