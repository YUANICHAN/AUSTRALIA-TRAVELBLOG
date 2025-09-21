class CoverflowCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 10;
        this.isAnimating = false;
        
        this.slides = document.querySelectorAll('.slide'); // Changed from .swiper-slide
        this.paginationBullets = document.querySelectorAll('.pagination-bullet');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSlidePositions();
    }

    bindEvents() {
        // Navigation buttons - updated selectors
        const nextButton = document.querySelector('.nav-button-next');
        const prevButton = document.querySelector('.nav-button-prev');
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextSlide());
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => this.prevSlide());
        }

        // Pagination bullets
        this.paginationBullets.forEach((bullet, index) => {
            bullet.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'ArrowLeft') this.prevSlide();
        });

        // Touch/Swipe support - updated selector
        const carousel = document.querySelector('.carousel-3d');
        if (carousel) {
            let startX = 0;
            let endX = 0;

            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });
        }
    }

    updateSlidePositions() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;

        this.slides.forEach((slide, index) => {
            // Remove all position classes
            slide.classList.remove('slide-center', 'slide-left-1', 'slide-left-2', 'slide-right-1', 'slide-right-2', 'slide-hidden');
            
            // Calculate relative position from current slide
            const relativePosition = (index - this.currentSlide + this.totalSlides) % this.totalSlides;
            
            // Assign position classes based on relative position
            if (relativePosition === 0) {
                slide.classList.add('slide-center');
            } else if (relativePosition === 1) {
                slide.classList.add('slide-right-1');
            } else if (relativePosition === 2) {
                slide.classList.add('slide-right-2');
            } else if (relativePosition === this.totalSlides - 1) {
                slide.classList.add('slide-left-1');
            } else if (relativePosition === this.totalSlides - 2) {
                slide.classList.add('slide-left-2');
            } else {
                slide.classList.add('slide-hidden');
            }
        });

        // Update pagination - using CSS classes instead of Tailwind
        this.paginationBullets.forEach((bullet, index) => {
            if (index === this.currentSlide) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 700);
    }

    nextSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlidePositions();
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePositions();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateSlidePositions();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoverflowCarousel();
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust offset for fixed nav height
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu functionality - updated selector
const burgerButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.getElementById('mobileMenu');

if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', () => {
        // Toggle display instead of 'hidden' class
        if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
            mobileMenu.style.display = 'flex';
        } else {
            mobileMenu.style.display = 'none';
        }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !burgerButton.contains(e.target)) {
            mobileMenu.style.display = 'none';
        }
    });
}