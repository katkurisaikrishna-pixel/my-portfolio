document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Preloader Initialization ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        // Delay to ensure all content (including AOS) is ready
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 500); // 500ms transition delay
    });
    
    // --- 2. Typing Animation for Hero Tagline ---
    function initTypingAnimation() {
        const typingTextElement = document.querySelector('.typing-text');
        if (!typingTextElement) return;

        const words = JSON.parse(typingTextElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const display = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
            
            typingTextElement.textContent = display;

            // Speed control
            let typingSpeed = 150;
            if (isDeleting) {
                typingSpeed /= 2;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Done typing current word, wait a second, then start deleting
                typingSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Done deleting, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }

            charIndex += isDeleting ? -1 : 1;
            
            setTimeout(type, typingSpeed);
        }
        type();
    }
    initTypingAnimation();
    
    // --- 3. Sticky Navbar & Scroll Highlight ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopButton = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // Sticky Navbar Toggle
        navbar.classList.toggle('sticky', scrollY > 50);
        
        // Back to Top Button Visibility
        backToTopButton.classList.toggle('show', scrollY > 400);

        // Navbar Active Link Highlight
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
        
        // Parallax Effect on Hero Background
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Back to Top functionality
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 4. Custom Cursor Animation (Desktop Only) ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        follower.style.display = 'block';

        document.addEventListener('mousemove', e => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            follower.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
        });

        // Hover Effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input[type="submit"], .glass-btn, .project-card, #theme-toggle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-cursor-follower');
                follower.classList.add('hover-cursor');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-cursor-follower');
                follower.classList.remove('hover-cursor');
            });
        });
    }

    // --- 5. Dark/Light Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    themeToggle.querySelector('i').className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';


    themeToggle.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });

    // --- 6. Dynamic Year in Footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // --- 7. Simple Form Submission Handler (For Display Only) ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', function(event) {
        // ONLY prevent default if you are using a client-side solution for display
        // If you integrate Formspree/Netlify Forms, you might remove this.
        if (this.getAttribute('action') === '#') { 
            event.preventDefault(); 
            formMessage.textContent = "Thank you for your message! This form is set up for a backend service (like Formspree) to deliver the email.";
            formMessage.classList.add('visible');
            setTimeout(() => {
                formMessage.classList.remove('visible');
                contactForm.reset();
            }, 5000);
        }
        // If 'action' is a valid Formspree link, the form will submit normally.
    });
});