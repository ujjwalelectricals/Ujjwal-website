/* ==========================================================================
   Ujjwal Electricals & Mechanical Engineers Enterprises
   Advanced JavaScript — All Features
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ── Enable JS class ──────────────────────────────────────────────────────
    document.body.classList.add('js-loaded');

    // ── Selectors ────────────────────────────────────────────────────────────
    const navbar       = document.getElementById('navbar');
    const scrollProg   = document.getElementById('scroll-progress');
    const backToTop    = document.getElementById('backToTop');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks     = document.getElementById('navLinks');
    const yearSpan     = document.getElementById('year');
    const contactForm  = document.getElementById('contactForm');

    // Footer year
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();


    // =========================================================================
    // 1. HERO CANVAS — Animated Particle Network
    // =========================================================================
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx    = canvas.getContext('2d');
        let W, H, particles, animFrameId;
        const PARTICLE_COUNT = 70;
        const MAX_DIST       = 140;

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.r  = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.15;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 180, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
        };

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 160, 255, ${0.2 * (1 - dist / MAX_DIST)})`;
                        ctx.lineWidth   = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const loop = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            animFrameId = requestAnimationFrame(loop);
        };

        init();
        loop();

        // Pause canvas when not in view (performance)
        const heroObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!animFrameId) loop();
            } else {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
        }, { threshold: 0 });

        heroObserver.observe(canvas.closest('.hero'));

        const debounce = (fn, ms) => {
            let t;
            return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
        };

        window.addEventListener('resize', debounce(() => { resize(); }, 200));
    }


    // =========================================================================
    // 2. SCROLL ANIMATIONS (IntersectionObserver)
    // =========================================================================
    const fadeEls = document.querySelectorAll('.scroll-fade, .about-stats');
    const counterTriggered = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counters when stat rows are in view
                const countersInEl = entry.target.querySelectorAll('.counter');
                if (countersInEl.length && !counterTriggered.has(entry.target)) {
                    counterTriggered.add(entry.target);
                    countersInEl.forEach(c => animateCounter(c));
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));

    // Also observe elements that hold counters directly
    document.querySelectorAll('.hero-stats, .about-stats-row').forEach(el => {
        observer.observe(el);
    });


    // =========================================================================
    // 3. COUNTER ANIMATION
    // =========================================================================
    const animateCounter = (el) => {
        if (el.classList.contains('counted')) return;
        el.classList.add('counted');

        const target   = +el.getAttribute('data-target');
        const duration = 2200;
        const start    = performance.now();

        const step = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo for snappy finish
            const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value    = Math.floor(eased * target);

            el.textContent = value.toLocaleString('en-IN');

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString('en-IN') + (target >= 10 ? '+' : '');
            }
        };

        requestAnimationFrame(step);
    };


    // =========================================================================
    // 4. SCROLL EVENTS — Navbar & Progress & Back-to-Top
    // =========================================================================
    let lastScroll = 0;

    const onScroll = () => {
        const scroll = window.scrollY;
        const total  = document.documentElement.scrollHeight - window.innerHeight;

        // Progress bar
        if (scrollProg) scrollProg.style.width = ((scroll / total) * 100) + '%';

        // Navbar state
        if (scroll > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }

        // Active nav link highlight
        updateActiveNav();

        lastScroll = scroll;
    };

    window.addEventListener('scroll', onScroll, { passive: true });


    // =========================================================================
    // 5. ACTIVE NAV LINK (Scrollspy)
    // =========================================================================
    const sections   = document.querySelectorAll('main section[id]');
    const navAnchors = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    };


    // =========================================================================
    // 6. MOBILE MENU
    // =========================================================================
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // Close on nav link click
    navAnchors.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navbar.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    // =========================================================================
    // 7. PRODUCT SEARCH + CATEGORY FILTER
    // =========================================================================
    const searchInput  = document.getElementById('productSearch');
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const noResults    = document.getElementById('noResultsMsg');

    let activeFilter = 'all';
    let searchTerm   = '';

    const filterProducts = () => {
        let visible = 0;

        productCards.forEach(card => {
            const name    = card.getAttribute('data-name') || '';
            const cat     = card.getAttribute('data-cat')  || '';
            const matchSearch = searchTerm === '' || name.includes(searchTerm);
            const matchCat    = activeFilter === 'all' || cat === activeFilter;

            if (matchSearch && matchCat) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase().trim();
            filterProducts();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            filterProducts();
        });
    });


    // =========================================================================
    // 8. FAQ ACCORDION
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-q');
        const answer   = item.querySelector('.faq-a');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(fi => {
                fi.classList.remove('open');
                fi.querySelector('.faq-a').classList.remove('open');
            });

            // Open clicked (if was closed)
            if (!isOpen) {
                item.classList.add('open');
                answer.classList.add('open');
            }
        });
    });


    // =========================================================================
    // 9. CONTACT FORM VALIDATION + WHATSAPP SUBMIT
    // =========================================================================
    if (contactForm) {
        const fields = {
            name:    { el: document.getElementById('f-name'),    err: document.getElementById('err-name') },
            phone:   { el: document.getElementById('f-phone'),   err: document.getElementById('err-phone') },
            message: { el: document.getElementById('f-message'), err: document.getElementById('err-message') }
        };

        const btnText    = contactForm.querySelector('.btn-text');
        const btnLoading = contactForm.querySelector('.btn-loading');
        const formSuccess = document.getElementById('formSuccess');

        const validate = () => {
            let valid = true;

            // Name
            if (!fields.name.el.value.trim()) {
                fields.name.el.classList.add('error');
                fields.name.err.classList.add('show');
                valid = false;
            } else {
                fields.name.el.classList.remove('error');
                fields.name.err.classList.remove('show');
            }

            // Phone — 10 digit Indian number
            const phone = fields.phone.el.value.replace(/\D/g, '');
            if (phone.length < 10) {
                fields.phone.el.classList.add('error');
                fields.phone.err.classList.add('show');
                valid = false;
            } else {
                fields.phone.el.classList.remove('error');
                fields.phone.err.classList.remove('show');
            }

            // Message
            if (!fields.message.el.value.trim()) {
                fields.message.el.classList.add('error');
                fields.message.err.classList.add('show');
                valid = false;
            } else {
                fields.message.el.classList.remove('error');
                fields.message.err.classList.remove('show');
            }

            return valid;
        };

        // Live validation
        Object.values(fields).forEach(({ el, err }) => {
            el.addEventListener('input', () => {
                el.classList.remove('error');
                err.classList.remove('show');
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate()) return;

            // Show loading state
            btnText.style.display    = 'none';
            btnLoading.style.display = 'flex';
            contactForm.querySelector('.btn-submit').disabled = true;

            // Build WhatsApp message
            const name    = fields.name.el.value.trim();
            const phone   = fields.phone.el.value.trim();
            const type    = document.getElementById('f-type')?.value || '';
            const message = fields.message.el.value.trim();

            const waMsg = encodeURIComponent(
                `Hello Ujjwal Electricals!\n\n` +
                `*Name:* ${name}\n` +
                `*Phone:* ${phone}\n` +
                `*Inquiry Type:* ${type || 'General'}\n` +
                `*Requirements:* ${message}`
            );

            // Simulate brief delay, then open WhatsApp
            setTimeout(() => {
                window.open(`https://wa.me/919910228978?text=${waMsg}`, '_blank');

                // Reset button & show success
                btnText.style.display    = 'flex';
                btnLoading.style.display = 'none';
                contactForm.querySelector('.btn-submit').disabled = false;
                formSuccess.classList.add('show');

                // Reset form
                contactForm.reset();
                setTimeout(() => formSuccess.classList.remove('show'), 6000);
            }, 900);
        });
    }


    // =========================================================================
    // 10. BACK TO TOP
    // =========================================================================
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // =========================================================================
    // 11. SMOOTH HOVER EFFECTS — Product cards tilt on mouse move
    // =========================================================================
    const productGrid = document.getElementById('productGrid');
    if (productGrid && window.innerWidth > 768) {
        productGrid.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x    = (e.clientX - rect.left) / rect.width  - 0.5;
            const y    = (e.clientY - rect.top)  / rect.height - 0.5;

            card.style.transform = `
                perspective(600px)
                rotateX(${-y * 6}deg)
                rotateY(${x * 6}deg)
                translateY(-6px)
            `;
        });

        productGrid.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.product-card');
            if (card) card.style.transform = '';
        }, true);

        // Reset each card on individual mouse leave
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }


    // =========================================================================
    // 12. BRAND ITEMS — Staggered entrance animation
    // =========================================================================
    const brandItems = document.querySelectorAll('.brand-item');
    const brandObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.brand-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity  = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 80);
                });
                brandObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const brandsGrid = document.querySelector('.brands-grid');
    if (brandsGrid) {
        brandItems.forEach(item => {
            item.style.opacity  = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        });
        brandObserver.observe(brandsGrid);
    }


    // =========================================================================
    // 13. SERVICE CARDS — Sequential slide-in
    // =========================================================================
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, i) => {
                    card.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
                    card.style.opacity    = '1';
                    card.style.transform  = 'translateY(0)';
                });
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.querySelectorAll('.service-card').forEach(card => {
            card.style.opacity  = '0';
            card.style.transform = 'translateY(24px)';
        });
        serviceObserver.observe(servicesGrid);
    }


    // =========================================================================
    // 14. KEYBOARD NAVIGATION — FAQ
    // =========================================================================
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });


    // =========================================================================
    // 15. PHONE INPUT — Auto-format
    // =========================================================================
    const phoneInput = document.getElementById('f-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 10) v = v.slice(0, 10);
            e.target.value = v;
        });
    }

});
