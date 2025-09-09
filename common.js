// Common functionality shared across all pages
document.addEventListener('DOMContentLoaded', function() {
  // Initialize particles
  initParticles();
  
  // Initialize 3D logo or fallback
  init3DLogo();
  
  // Initialize reveal animations
  initRevealAnimations();
  
  // Initialize stat counters
  initStatCounters();
  
  // Initialize testimonial carousel
  initTestimonialCarousel();
  
  // Initialize availability widget
  initAvailabilityWidget();
});

// Particle system
function initParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;
  
  const particleCount = 12;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 25 + 's';
    particle.style.animationDuration = (25 + Math.random() * 15) + 's';
    particlesContainer.appendChild(particle);
  }
}

// 3D Logo with Three.js
function init3DLogo() {
  const container = document.getElementById('logo-3d-wrapper');
  if (!container) return;
  
  // Check for WebGL support and reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!window.THREE || prefersReducedMotion) {
    // Fallback to SVG
    container.innerHTML = `
      <div class="logo-3d-fallback">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#102e16"/>
          <polygon points="100,34 141,120 59,120" fill="white"/>
        </svg>
      </div>
    `;
    return;
  }
  
  // Three.js scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(200, 200);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Create logo geometry (cylinder with triangle cutout)
  const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x102e16,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });
  
  const logo = new THREE.Mesh(geometry, material);
  scene.add(logo);
  
  // Add lighting
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(5, 5, 5);
  scene.add(light1);
  
  const light2 = new THREE.AmbientLight(0x404040);
  scene.add(light2);
  
  camera.position.z = 3;
  
  // Animation
  function animate() {
    requestAnimationFrame(animate);
    logo.rotation.y += 0.005;
    logo.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    renderer.render(scene, camera);
  }
  
  animate();
}

// Reveal animations with Intersection Observer
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(reveal => observer.observe(reveal));
  } else {
    // Fallback for older browsers
    reveals.forEach(reveal => reveal.classList.add('active'));
  }
}

// Animated stat counters
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  const duration = 2000;
  const steps = 60;
  const stepValue = target / steps;
  const stepDuration = duration / steps;
  
  let current = 0;
  const timer = setInterval(() => {
    current += stepValue;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    let display = Math.floor(current);
    if (target >= 1000000) {
      display = (current / 1000000).toFixed(1);
    }
    
    element.textContent = prefix + display.toLocaleString() + suffix;
  }, stepDuration);
}

// Testimonial Carousel
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!track || !dots.length) return;
  
  let currentSlide = 0;
  const slideCount = 3;
  
  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 33.333}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index);
    });
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });
  
  // Auto-rotate
  setInterval(() => {
    goToSlide((currentSlide + 1) % slideCount);
  }, 5000);
}

// Live availability widget
function initAvailabilityWidget() {
  const countElement = document.querySelector('.availability-count');
  if (!countElement) return;
  
  // Simulate dynamic availability
  const updateAvailability = () => {
    const spots = Math.floor(Math.random() * 4) + 2; // 2-5 spots
    countElement.textContent = spots;
  };
  
  // Update every 30 seconds
  setInterval(updateAvailability, 30000);
}
