/* ==========================================================================
   NCR Industrial Automation - Main JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Add class to body to enable scroll animations once JS is ready
    document.body.classList.add('js-loaded');

    // --- CONFIGURATION & SELECTORS ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('backToTop');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const yearSpan = document.getElementById('year');

    // Set Footer Year
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- COUNTER ANIMATION LOGIC ---
    const runCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const duration = 2000; // Total animation time in ms (2 seconds)

        counters.forEach(counter => {
            // Check if counter has already run to avoid loops
            if (counter.classList.contains('counted')) return;

            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Use easeOutQuad for smoother finish
                const easedProgress = progress * (2 - progress);
                const currentValue = Math.floor(easedProgress * target);

                counter.innerText = currentValue.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString() + "+";
                    counter.classList.add('counted');
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    // --- INTERSECTION OBSERVER (Scroll Animations) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counters if this is the stats section
                if (entry.target.classList.contains('about-stats')) {
                    runCounters();
                }
                
                // Once visible, stop observing to save performance
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade elements and the stats box
    document.querySelectorAll('.scroll-fade, .about-stats').forEach(el => {
        sectionObserver.observe(el);
    });

    // --- SCROLL EVENTS (Progress Bar & Navbar) ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Progress Bar
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        // Navbar Sticky State
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    });

    // --- MOBILE MENU ---
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.querySelector('i').classList.toggle('fa-bars');
        mobileToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').classList.add('fa-bars');
            mobileToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // --- PRODUCT SEARCH FILTER ---
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const name = product.getAttribute('data-name').toLowerCase();
                if (name.includes(term)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // --- BACK TO TOP ---
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
