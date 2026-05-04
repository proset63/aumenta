import './style.css';

// Navigation scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: Stop observing once visible if you want it to happen only once
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-up');
animatedElements.forEach(el => observer.observe(el));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form') as HTMLFormElement;
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerText;
    
    // Simulate sending
    submitBtn.innerText = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.innerText = '¡Enviado con éxito!';
      submitBtn.style.background = '#10b981'; // Green
      contactForm.reset();
      
      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3000);
    }, 1500);
  });
}
