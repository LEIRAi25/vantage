// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isOpen);
        navLinks.classList.toggle('mobile-open');
    });
    }

    // Testimonial carousel
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    function updateCarousel() {
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
        dot.setAttribute('aria-selected', index === currentSlide);
    });
    }

    dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
    });

    // Auto-rotate testimonials
    setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
    }, 5000);

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        }
    });
    });
});