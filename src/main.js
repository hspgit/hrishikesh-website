import "./style.css";

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    const sections = document.querySelectorAll('section');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    // Initialize Typed.js
    var typed = new Typed('.typing-effect', {
        strings: [
            "passionate web developer.",
            "dedicated frontend enthusiast.",
            "creative problem solver.",
            "zealous AI advocate.",
            "innovative creator.",
            "analytical logical thinker.",
            "proficient skilled programmer.",
            "driven code architect.",
            "dynamic tech explorer.",
            "meticulous debugger.",
            "enthusiastic system optimizer.",
            "collaborative team coder.",
            "ambitious project builder.",
            "resilient bug hunter."
        ],
        typeSpeed: 50,
        backSpeed: 25,
        loop: true
    });
    
    const getHeaderHeight = () => header.offsetHeight;
    
    const smoothScroll = targetElement => {
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - getHeaderHeight();
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };
    
    const closeMobileMenu = () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        document.body.style.overflow = 'auto';
    };
    
    const toggleMobileMenu = () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    };
    
    const highlightActiveNavLink = () => {
        let currentSection = '';
        const scrollPosition = window.scrollY;
        const headerHeight = getHeaderHeight();
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            link.classList.toggle('active', href.slice(1) === currentSection);
        });
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                closeMobileMenu();
                smoothScroll(targetElement);
            }
        });
    });
    
    navToggle.addEventListener('click', toggleMobileMenu);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        highlightActiveNavLink();
        
        // Handle scroll to top button visibility
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    highlightActiveNavLink();
});