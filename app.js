// Add a class to body to let CSS know JS successfully loaded for lower-page elements
document.body.classList.add('js-loaded');

// Current Year for Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll Progress Indicator & Sticky Nav
window.addEventListener('scroll', function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
    
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    const backToTop = document.getElementById("backToTop");
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

// Back to top functionality
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Robust Scroll Animations (Only applies to elements below the fold now)
const fadeElements = document.querySelectorAll('.scroll-fade');
const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);

fadeElements.forEach(el => appearOnScroll.observe(el));

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isActive = question.classList.contains('active');
        
        // Close all
        faqQuestions.forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.style.maxHeight = null;
        });

        // Open clicked if it wasn't active
        if (!isActive) {
            question.classList.add('active');
            const answer = question.nextElementSibling;
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Industrial Form Validation
const contactForm = document.getElementById('contactForm');

if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        
        const nameError = document.getElementById('nameError');
        const phoneError = document.getElementById('phoneError');
        const messageError = document.getElementById('messageError');
        const successMsg = document.getElementById('formSuccess');
        
        // Reset state
        [nameError, phoneError, messageError].forEach(el => el.style.display = 'none');
        successMsg.style.display = 'none';
        [name, phone, message].forEach(el => {
            el.style.borderColor = 'var(--border-color)';
            el.style.background = 'var(--light-grey)';
        });

        if (name.value.trim() === '') {
            nameError.style.display = 'block';
            name.style.borderColor = '#dc2626';
            name.style.background = '#fef2f2';
            isValid = false;
        }
        
        const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
        if (!phonePattern.test(phone.value.trim())) {
            phoneError.style.display = 'block';
            phone.style.borderColor = '#dc2626';
            phone.style.background = '#fef2f2';
            isValid = false;
        }
        
        if (message.value.trim() === '') {
            messageError.style.display = 'block';
            message.style.borderColor = '#dc2626';
            message.style.background = '#fef2f2';
            isValid = false;
        }
        
        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Simulate processing time
            setTimeout(() => {
                successMsg.style.display = 'block';
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 6000);
            }, 1200);
        }
    });
}
