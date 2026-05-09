import './style.css';
import { supabase } from './supabaseClient';
// 1. Importamos la librería corregida
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Gemini 3 Integration (Google AI Studio) ---

// Configuración de la API. 
// Reemplaza 'TU_API_KEY_AQUÍ' por tu clave real de Google AI Studio.
const genAI = new GoogleGenerativeAI("AIzaSyBQA1NnVMrb0PgUG56g8aCeM8oLaf-CsPk");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * Función genérica para usar Gemini 3 en tu proyecto
 */
async function askGemini(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    // Log token usage for monitoring
    if (response.usageMetadata) {
      console.log("Tokens usados:", response.usageMetadata);
    }
    return response.text();
  } catch (error) {
    console.error("Error en Gemini 3:", error);
    return "Lo siento, hubo un error al procesar la inteligencia artificial.";
  }
}

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

// Contact Form Handling + IA Integration
const contactForm = document.querySelector('.contact-form') as HTMLFormElement;
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerText;

    const formData = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value,
    };

    submitBtn.innerText = 'Enviando...';
    submitBtn.disabled = true;

    // Almacenamos en Supabase
    const { error } = await supabase.from('contact_leads').insert([formData]);

    if (error) {
      console.error('Error saving lead:', error);
      submitBtn.innerText = 'Error al enviar';
      submitBtn.style.background = '#ef4444';
    } else {
      // OPCIONAL: Usamos Gemini 3 para analizar el sentimiento o responder algo rápido
      const aiResponse = await askGemini(`Un cliente llamado ${formData.name} envió un mensaje: "${formData.message}". Responde en una frase corta agradeciendo el interés.`);
      console.log("IA Feedback:", aiResponse);

      submitBtn.innerText = '¡Enviado con éxito!';
      submitBtn.style.background = '#10b981';
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
    content: `<p>La Realidad Aumentada (RA) industrial transforma la colaboración entre humanos y máquinas al superponer guías de producción y calidad directamente en el entorno físico del operador. Esta tecnología optimiza las tareas de mantenimiento al agilizar los tiempos de inspección de calidad y reducir significativamente los errores manuales y de incorporación. Como resultado de estos flujos de trabajo más intuitivos, las empresas logran minimizar los tiempos de inactividad en la planta e incrementar la productividad y eficiencia operativa general.</p>`
  },
  'card-dt': {
    title: 'Gemelos Digitales e IoT',
    content: `<p>Los Gemelos Digitales interactúan con sensores IoT para crear réplicas virtuales precisas que se sincronizan bidireccionalmente y en tiempo real con los equipos físicos. Este flujo constante de telemetría permite ejecutar estrategias de mantenimiento predictivo, utilizando análisis de inteligencia artificial para identificar patrones de degradación y predecir fallos antes de que ocurran. Con estas simulaciones, las instalaciones industriales pueden programar intervenciones de forma óptima, lo que reduce drásticamente el tiempo de inactividad no planificado y prolonga la vida útil de los activos críticos.</p>`
  },
  'card-mr': {
    title: 'Realidad Mixta y Hologramas',
    content: `<p>La pantalla inmersiva Looking Glass 8K redefine la visualización holográfica al generar impresionantes 33,2 millones de píxeles y más de mil millones de colores a 60 Hz. Su motor principal es una tecnología patentada de campo de luz de 45 elementos que permite proyectar de forma colaborativa escenas tridimensionales estereoscópicas con verdadera profundidad. El beneficio técnico más disruptivo es que permite a grupos de personas visualizar e interactuar con estos hologramas sin la fricción de requerir gafas o visores de realidad virtual o aumentada.</p>`
  },
  'card-ai': {
    title: 'Inteligencia Artificial Predictiva',
    content: `<p>La Inteligencia Artificial predictiva eleva el nivel de inmersión al integrar avatares generados por IA y asistentes conversacionales directamente en plataformas de Realidad Virtual e interfaces digitales. Estos sistemas utilizan procesamiento de lenguaje natural integrado a modelos de lenguaje grande (LLM) para generar conversaciones adaptables en tiempo real, facilitando desde simulaciones complejas hasta el triaje interactivo en la atención médica. Al crear estos espacios inteligentes y adaptativos, las organizaciones logran optimizar el aprendizaje libre de presiones e impulsar una asistencia ágil basada en análisis de datos continuos.</p>`
  }
};

const modal = document.getElementById('tech-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

async function openModal(cardId: string) {
  const info = techInfo[cardId as keyof typeof techInfo];
  if (info && modalTitle && modalBody) {
    modalTitle.innerText = info.title;
    modalBody.innerHTML = '<div class="loading-spinner"></div><p>Generando información técnica detallada...</p>';
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Simular un tiempo de procesamiento para mejorar la experiencia "IA"
    setTimeout(() => {
      if (modalBody) {
        modalBody.innerHTML = info.content;
        modalBody.classList.add('fade-in');
        modalBody.classList.add('visible');
      }
    }, 800);
  }
}

function closeModal() {
  modal?.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.feature-card');
  if (card && card.id && techInfo[card.id as keyof typeof techInfo]) {
    openModal(card.id);
    return;
  }
  if (target.classList.contains('close-modal') || target.classList.contains('close-btn') || target === modal) {
    closeModal();
  }
});