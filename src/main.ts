import './style.css';
import { supabase } from './supabaseClient';

// --- Supabase Data Loading ---

async function loadDynamicContent() {
  const { data, error } = await supabase.from('site_content').select('*');
  if (error) {
    console.error('Error fetching content:', error);
    return;
  }

  data.forEach((item: { key: string; value: string }) => {
    const element = document.getElementById(item.key);
    if (element) {
      element.innerHTML = item.value;
    }
  });
}

async function loadClients() {
  const { data, error } = await supabase.from('clients').select('*');
  if (error) {
    console.error('Error fetching clients:', error);
    return;
  }

  const grid = document.getElementById('clients-grid');
  if (grid && data.length > 0) {
    grid.innerHTML = data.map(client => `
      <div class="client-logo">
        <img src="${client.logo_url}" alt="${client.name}">
      </div>
    `).join('');
  }
}

// Initial Load
loadDynamicContent();
loadClients();

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
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerText;
    
    // Get form data
    const formData = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value,
    };

    // Simulate sending + Supabase storage
    submitBtn.innerText = 'Enviando...';
    submitBtn.disabled = true;
    
    const { error } = await supabase.from('contact_leads').insert([formData]);

    if (error) {
      console.error('Error saving lead:', error);
      submitBtn.innerText = 'Error al enviar';
      submitBtn.style.background = '#ef4444'; // Red
    } else {
      submitBtn.innerText = '¡Enviado con éxito!';
      submitBtn.style.background = '#10b981'; // Green
      contactForm.reset();
    }
    
    setTimeout(() => {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  });
}
