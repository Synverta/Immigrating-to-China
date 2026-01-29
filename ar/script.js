// Constants
const FORM_SUBMIT_DELAY = 1000; // Simulated form submission delay in ms
const SUCCESS_MESSAGE_TIMEOUT = 5000; // Auto-hide timeout for success message in ms
const HEADER_HEIGHT = 80; // Approximate header height in pixels

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - HEADER_HEIGHT;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    const submitButton = this.querySelector('.submit-button');
    
    // Get form data
    const formValues = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = i18n.t('contact.form.submitting');
    
    // Simulate form submission (in a real scenario, this would send data to a server)
    setTimeout(() => {
        // Reset form
        this.reset();
        
        // Show success message
        formMessage.className = 'form-message success';
        formMessage.textContent = i18n.t('contact.form.success');
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = i18n.t('contact.form.submit');
        
        // Hide message after timeout
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, SUCCESS_MESSAGE_TIMEOUT);
    }, FORM_SUBMIT_DELAY);
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card, .about-card, .step').forEach(element => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
});

// Header shadow on scroll (using class toggle)
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        const header = document.querySelector('.header');
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);
});
