// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });

    // Improved smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log('Clicking link to:', targetId); // Debug log
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    console.log('Target section found:', targetSection); // Debug log
                    
                    // Calculate header height more reliably
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    console.log('Scrolling to position:', targetPosition); // Debug log
                    
                    // Use window.scrollTo with smooth behavior
                    window.scrollTo({
                        top: targetPosition,
                        left: 0,
                        behavior: 'smooth'
                    });
                    
                    // Fallback for browsers that don't support smooth scrolling
                    if (!('scrollBehavior' in document.documentElement.style)) {
                        // Manual smooth scrolling implementation
                        const startPosition = window.pageYOffset;
                        const distance = targetPosition - startPosition;
                        const duration = 800;
                        let start = null;
                        
                        function animation(currentTime) {
                            if (start === null) start = currentTime;
                            const timeElapsed = currentTime - start;
                            const run = ease(timeElapsed, startPosition, distance, duration);
                            window.scrollTo(0, run);
                            if (timeElapsed < duration) requestAnimationFrame(animation);
                        }
                        
                        function ease(t, b, c, d) {
                            t /= d / 2;
                            if (t < 1) return c / 2 * t * t + b;
                            t--;
                            return -c / 2 * (t * (t - 2) - 1) + b;
                        }
                        
                        requestAnimationFrame(animation);
                    }
                } else {
                    console.log('Target section not found for:', targetId); // Debug log
                }
            }
        });
    });

    // Header background change on scroll
    if (header) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const headerHeight = header.offsetHeight;
            
            if (scrolled > headerHeight) {
                header.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(139, 0, 0, 0.95) 100%)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #000000 0%, #8B0000 100%)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = header ? header.offsetHeight : 80;
        const scrollPosition = window.pageYOffset + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section nav link
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    // Update active nav on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNav, 10);
    });
    
    // Initial call to set active nav on page load
    setTimeout(updateActiveNav, 100);

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.initiative-card, .benefit-item, .board-member, .section__title');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations and active states
    const style = document.createElement('style');
    style.textContent = `
        .initiative-card,
        .benefit-item,
        .board-member,
        .section__title {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .nav__link.active {
            color: #DC143C !important;
        }
        
        .nav__link.active::after {
            width: 100% !important;
        }
        
        html {
            scroll-behavior: smooth;
        }
        
        @media (prefers-reduced-motion: reduce) {
            html {
                scroll-behavior: auto;
            }
            .initiative-card,
            .benefit-item,
            .board-member,
            .section__title {
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Enhanced card hover effects for initiative cards
    const initiativeCards = document.querySelectorAll('.initiative-card');
    initiativeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Benefit items hover effects
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Board member hover effects
    const boardMembers = document.querySelectorAll('.board-member');
    boardMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // CTA button enhanced animation
    const ctaButton = document.querySelector('.hero__cta');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
            this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        ctaButton.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        ctaButton.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
        });
    }

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.style.opacity = '0';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.textContent = '';
            
            let i = 0;
            function typeWriter() {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 30);
                }
            }
            
            typeWriter();
        }, 300);
    }

    // Email link click tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Email contact clicked: ', this.href);
        });
    });

    // Add some entrance animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);

    // Initialize entrance animation styles
    const heroContentElement = document.querySelector('.hero__content');
    if (heroContentElement) {
        heroContentElement.style.opacity = '0';
        heroContentElement.style.transform = 'translateY(30px)';
        heroContentElement.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    // Staggered animation for board members
    const boardMemberElements = document.querySelectorAll('.board-member');
    boardMemberElements.forEach((member, index) => {
        member.style.animationDelay = `${index * 0.1}s`;
    });

    // Staggered animation for initiative cards
    const initiativeCardElements = document.querySelectorAll('.initiative-card');
    initiativeCardElements.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Staggered animation for benefit items
    const benefitItemElements = document.querySelectorAll('.benefit-item');
    benefitItemElements.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }

    // Add counter animation for board members (if you want to show number of members)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const range = target - start;
        const increment = target > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = start;
            if (start === target) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Debug: Log all sections with IDs to ensure they exist
    console.log('Sections found:', document.querySelectorAll('section[id]'));
    console.log('Navigation links found:', navLinks);
    
    // Log board section specifically
    const boardSection = document.querySelector('#board');
    console.log('Board section found:', boardSection);
    
    console.log('BCC IIT Delhi website with Board section initialized successfully!');
});