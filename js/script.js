/* =============================================
   MENU TOGGLE
   ============================================= */

function toggleMenu() {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    menu.classList.toggle('open');
    icon.classList.toggle('open');
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .menu-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active-link');
        }
    });
}

/* =============================================
   TYPEWRITER EFFECT (Home page)
   ============================================= */

function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const phrases = [
        'Aspiring IT Professional',
        'Full-Stack Developer',
        'Mobile App Developer',
        'Problem Solver'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 120;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            delay = 60;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            delay = 120;
        }

        if (!isDeleting && charIndex === current.length) {
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
}

/* =============================================
   COUNTER ANIMATION (About page)
   ============================================= */

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            let count = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
                count = Math.min(count + step, target);
                el.textContent = count + (el.dataset.suffix || '+');
                if (count >= target) clearInterval(interval);
            }, 40);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

/* =============================================
   SCROLL-IN ANIMATIONS
   ============================================= */

function initScrollAnimations() {
    const targets = document.querySelectorAll(
        '.details-container, article, .section__text, .btn-container, .projects__card, .contact-wrapper'
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    targets.forEach(el => observer.observe(el));
}

/* =============================================
   TECH STACK FILTER (Tech Stack page)
   ============================================= */

function initTechFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const containers = document.querySelectorAll('.tech-stack-details-container .details-container');

            containers.forEach(container => {
                if (filter === 'all' || container.dataset.category === filter) {
                    container.classList.remove('hidden');
                    container.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    container.classList.add('hidden');
                }
            });
        });
    });
}

/* =============================================
   NAV SCROLL SHADOW
   ============================================= */

function initNavShadow() {
    const navDesktop = document.getElementById('desktop-nav');
    const navMobile = document.getElementById('hamburger-nav');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 30;
        [navDesktop, navMobile].forEach(nav => {
            if (!nav) return;
            nav.style.boxShadow = scrolled
                ? '0 8px 32px rgba(0,0,0,0.35)'
                : '0 5px 20px rgba(0,0,0,0.2)';
        });
    }, { passive: true });
}

/* =============================================
   INIT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initTypewriter();
    animateCounters();
    initScrollAnimations();
    initTechFilter();
    initNavShadow();
});
