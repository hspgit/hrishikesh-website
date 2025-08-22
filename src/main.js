import "./style.css";
import Typed from 'typed.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fontsource/jetbrains-mono';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';


document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    const sections = document.querySelectorAll('section');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
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
    
    const pdfModal = document.getElementById('pdf-modal');
    const resumeBtn = document.getElementById('resume-btn');
    const pdfModalClose = document.querySelector('.pdf-modal-close');
    const pdfCanvas = document.getElementById('pdf-canvas');
    const pdfPrevBtn = document.getElementById('pdf-prev');
    const pdfNextBtn = document.getElementById('pdf-next');
    const pdfPageInfo = document.getElementById('pdf-page-info');
    
    let pdfDoc = null;
    let currentPage = 1;
    let totalPages = 1;
    let scale = 1.5;
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    const renderPage = (pageNum) => {
        if (!pdfDoc) return;
        
        pdfDoc.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: scale });
            const context = pdfCanvas.getContext('2d');
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            page.render(renderContext);
            
            // Update page info and buttons
            pdfPageInfo.textContent = `Page ${pageNum} of ${totalPages}`;
            pdfPrevBtn.disabled = pageNum <= 1;
            pdfNextBtn.disabled = pageNum >= totalPages;
        });
    };
    
    const loadPDF = () => {
        const pdfUrl = '/resume.pdf';
        
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            pdfDoc = pdf;
            totalPages = pdf.numPages;
            currentPage = 1;
            
            if (window.innerWidth <= 768) {
                scale = 1;
            }
            
            renderPage(currentPage);
        }).catch(error => {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF file. Please try again.');
        });
    };
    
    const openPdfModal = () => {
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (!pdfDoc) {
            loadPDF();
        }
    };
    
    const closePdfModal = () => {
        pdfModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPdfModal();
    });
    
    pdfModalClose.addEventListener('click', closePdfModal);
    
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            closePdfModal();
        }
    });
    
    pdfPrevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });
    
    pdfNextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePdfModal();
        }
    });
    
    window.addEventListener('resize', () => {
        if (pdfDoc && pdfModal.classList.contains('active')) {
            scale = window.innerWidth <= 768 ? 1 : 1.5;
            renderPage(currentPage);
        }
    });
});