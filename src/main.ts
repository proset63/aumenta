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
      if (element.tagName.toLowerCase() === 'img') {
        (element as HTMLImageElement).src = item.value;
      } else {
        element.innerHTML = item.value;
      }
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
  if (grid && data && data.length > 0) {
    // Filter duplicates by name to ensure each client only appears once
    const uniqueClients = data.filter((client, index, self) =>
      index === self.findIndex((c) => c.name === client.name)
    );

    grid.innerHTML = uniqueClients.map(client => `
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

// --- Modal System Logic ---

const techInfo = {
  'card-ar': {
    title: 'Realidad Aumentada (RA) Industrial',
    content: `
      <p>Según los documentos de Aumenta Solutions, la <strong>Realidad Aumentada (RA)</strong> es una tecnología que permite superponer información gráfica y modelos 3D sobre el entorno real.</p>
      <p><strong>Servicios destacados:</strong></p>
      <ul>
        <li>Formación y manuales virtuales sobre equipos reales.</li>
        <li>Asistencia remota experta en tiempo real con smartglasses.</li>
        <li>Información geolocalizada conectada a CRM/ERP.</li>
      </ul>
      <p><strong>Beneficio clave:</strong> Disminuye drásticamente la curva de aprendizaje y permite operar con manos libres, mejorando la seguridad y eficiencia.</p>
    `
  },
  'card-dt': {
    title: 'Gemelos Digitales e IoT',
    content: `
      <p>Aumenta Solutions emplea los <strong>Gemelos Digitales</strong> como réplicas virtuales exactas de instalaciones físicas, como plantas de energía solar.</p>
      <p><strong>Capacidades:</strong></p>
      <ul>
        <li>Supervisión remota 360º de operaciones.</li>
        <li>Control centralizado de alarmas y alertas en tiempo real.</li>
        <li>Simulación de escenarios para identificar errores de diseño.</li>
      </ul>
      <p><strong>Beneficio clave:</strong> Optimiza el mantenimiento y permite la toma de decisiones basada en datos reales sin desplazamientos físicos.</p>
    `
  },
  'card-mr': {
    title: 'Realidad Mixta y Hologramas',
    content: `
      <p>La <strong>Realidad Mixta (MR)</strong> combina el mundo físico con objetos virtuales interactivos. Un caso de éxito es el simulador de diálisis del Hospital de Bellvitge.</p>
      <p><strong>Tecnología única:</strong></p>
      <ul>
        <li>Distribución exclusiva de pantallas holográficas <strong>Looking Glass</strong> (8K volumétrico sin gafas).</li>
        <li>Teletransportación de ponentes para eventos corporativos.</li>
        <li>Control gestual sin contacto mediante sensores Leap Motion.</li>
      </ul>
      <p><strong>Beneficio clave:</strong> Genera un impacto visual inigualable y permite interacciones naturales con modelos 3D complejos.</p>
    `
  },
  'card-ai': {
    title: 'Inteligencia Artificial Predictiva',
    content: `
      <p>La IA en Aumenta Solutions dota a los entornos virtuales de capacidades analíticas avanzadas para el análisis de grandes volúmenes de datos.</p>
      <p><strong>Aplicaciones:</strong></p>
      <ul>
        <li>Mantenimiento predictivo mediante Machine Learning (TensorFlow).</li>
        <li>Análisis de tendencias y detección anticipada de fallos.</li>
        <li>Asistentes virtuales inteligentes y adaptativos.</li>
      </ul>
      <p><strong>Beneficio clave:</strong> Transforma la gestión reactiva en proactiva, anticipando incidencias antes de que ocurran.</p>
    `
  }
};

const modal = document.getElementById('tech-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtns = document.querySelectorAll('.close-modal, .close-btn');

function openModal(cardId: string) {
  const info = techInfo[cardId as keyof typeof techInfo];
  if (info && modalTitle && modalBody) {
    modalTitle.innerText = info.title;
    modalBody.innerHTML = info.content;
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }
}

function closeModal() {
  modal?.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
}

// Add event listeners to cards
Object.keys(techInfo).forEach(id => {
  const card = document.getElementById(id);
  if (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModal(id));
  }
});

// Close modal listeners
closeBtns.forEach(btn => {
  btn.addEventListener('click', closeModal);
});

// Close on outside click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
