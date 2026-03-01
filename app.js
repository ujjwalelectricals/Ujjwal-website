/**
 * NCR Industrial Automation - Performance Optimized Script
 */

(function() {
    "use strict";

    const state = {
        isNavOpen: false,
        isDarkMode: localStorage.getItem('theme') === 'dark'
    };

    const elements = {
        body: document.body,
        navbar: document.getElementById('navbar'),
        navLinks: document.querySelector('.nav-links'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        scrollProgress: document.getElementById('scroll-progress'),
        backToTop: document.getElementById('backToTop'),
        contactForm: document.getElementById('contactForm'),
        faqQuestions: document.querySelectorAll('.faq-question'),
        searchInput: document.getElementById('productSearch'),
        productCards: document.querySelectorAll('.product-card'),
        yearSpan: document.getElementById('year')
    };

    const init = () => {
        elements.body.classList.add('js-loaded');
        if (elements.yearSpan) elements.yearSpan.textContent = new Date().getFullYear();
        setupIntersectionObserver();
        applySavedTheme();
    };

    const applySavedTheme = () => {
        if (state.isDarkMode) elements.body.classList.add('dark-theme');
    };

    const toggleMobileMenu = () => {
        state.isNavOpen = !state.isNavOpen;
        elements.navLinks.classList.toggle('active');
        const icon = elements.mobileToggle.querySelector('i');
        icon.className = state.isNavOpen ? 'fas fa-times' : 'fas fa-bars';
        elements.body.style.overflow = state.isNavOpen ? 'hidden' : '';
    };

    // Performance Optimized Scroll
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollEffects();
                ticking = false;
            });
            ticking = true;
        }
    });

    const handleScrollEffects = () => {
        const scrollY = window.scrollY;
        
        // Progress Bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;
        if (elements.scrollProgress) elements.scrollProgress.style.width = `${scrollPercent}%`;

        // Nav & Back to Top
        elements.navbar.classList.toggle('scrolled', scrollY > 50);
        elements.backToTop.classList.toggle('show', scrollY > 400);
    };

    // FIXED: Snappier Scroll Animations
    const setupIntersectionObserver = () => {
        // threshold 0.05 makes it trigger almost instantly
        // rootMargin -50px ensures it doesn't wait for the middle of the screen
        const options = { 
            threshold: 0.05, 
            rootMargin: "0px 0px -50px 0px" 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Force the animation into a separate thread
                    window.requestAnimationFrame(() => {
                        entry.target.classList.add('visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
    };

    // Search Optimization
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            elements.productCards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(term) ? "block" : "none";
            });
        });
    }

    // Event Listeners
    elements.mobileToggle.addEventListener('click', toggleMobileMenu);
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (state.isNavOpen) toggleMobileMenu();
        });
    });

    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    init();
})();
