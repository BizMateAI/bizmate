// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});});
});

// Testimonial carousel
const carousel=document.querySelector('.testimonial-carousel');let scrollAmount=0;
setInterval(()=>{if(carousel){scrollAmount+=320;if(scrollAmount>=carousel.scrollWidth-carousel.clientWidth)scrollAmount=0;carousel.scrollTo({left:scrollAmount,behavior:'smooth'});}},4000);

// Form submission
const form=document.getElementById('contact-form');if(form){form.addEventListener('submit',function(e){e.preventDefault();const data=new FormData(form);fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}}).then(r=>{if(r.ok){window.location.href='https://calendly.com/bizmate-growth/30-minute-consultation';}else{alert('Submission failed, try again!');}}).catch(()=>{alert('Submission failed, try again!');});});}

// Scroll animations & parallax
const scrollElements=document.querySelectorAll('.animate-on-scroll');
const elementInView=(el,offset=0)=>{const t=el.getBoundingClientRect().top;return t<=(window.innerHeight||document.documentElement.clientHeight)-offset;};
const displayScrollElement=el=>el.classList.add('visible');
const hideScrollElement=el=>el.classList.remove('visible');
const parallaxElements=document.querySelectorAll('.hero-image[data-speed]');
const nodes=document.querySelectorAll('.hero-image .node');
const handleAllScroll=()=>{
  scrollElements.forEach(el=>{elementInView(el,100)?displayScrollElement(el):hideScrollElement(el);});
  parallaxElements.forEach(el=>{const s=parseFloat(el.getAttribute('data-speed'));el.style.transform=`translateY(${window.scrollY*s}px)`;});
  nodes.forEach((node,i)=>{const r=8+Math.sin((window.scrollY/50)+i)*4;node.setAttribute('r',r);});
};
window.addEventListener('scroll',handleAllScroll);
window.addEventListener('load',handleAllScroll);
