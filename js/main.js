// ERPize - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Navbar background on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 11, 0.98)';
      } else {
        nav.style.background = 'rgba(10, 10, 11, 0.9)';
      }
    });
  }
  
  // Newsletter form feedback
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', function() {
      setTimeout(() => {
        alert('Thanks for subscribing! You\'ll receive our first newsletter soon.');
      }, 500);
    });
  }
});
