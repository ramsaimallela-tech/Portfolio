document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // 2. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Custom Cursor Tracking - Cosmic Space Theme
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursorDot.style.left = `${cursorX}px`;
            cursorDot.style.top = `${cursorY}px`;

            cursorOutline.style.left = `${cursorX}px`;
            cursorOutline.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const clickableElements = document.querySelectorAll('a, button, .card, .carousel-btn, .nav-links a, .social-btn');
        clickableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.6)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.3)';
                cursorOutline.style.opacity = '1';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.opacity = '0.8';
            });
        });

        window.addEventListener('mousedown', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        window.addEventListener('mouseup', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    // 4. Modal Logic
    const modalsMap = [
        { btnId: "skating-card", modalId: "skating-modal", closeId: null }, // Uses .close-modal inside
        { btnId: "martial-arts-card", modalId: "martial-arts-modal", closeId: "close-martial" },
        { btnId: "yoga-card", modalId: "yoga-modal", closeId: "close-yoga" },
        { btnId: "special-achievements-card", modalId: "special-modal", closeId: "close-special" }
    ];

    modalsMap.forEach(item => {
        const btn = document.getElementById(item.btnId);
        const modal = document.getElementById(item.modalId);
        const closeBtn = item.closeId ? document.getElementById(item.closeId) : modal?.querySelector(".close-modal");

        if (btn && modal) {
            btn.onclick = () => modal.classList.add("show");
            if (closeBtn) {
                closeBtn.onclick = () => modal.classList.remove("show");
            }
        }
    });

    // Generic Modal Close on Background Click
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove("show");
            if (event.target.id === 'image-modal') {
                closeImageModal();
            }
        }
    });

    // ESC key to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove("show"));
            closeImageModal();
        }
    });

    // Stop propagation on image in preview modal
    const modalImg = document.getElementById('modal-image');
    if (modalImg) {
        modalImg.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 5. Carousel Functionality (Infinite Loop)
    const track = document.getElementById('carouselTrack');
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (track && indicatorsContainer) {
        const originalSlides = Array.from(track.children);
        const slideCount = originalSlides.length;

        // Clone slides for infinite effect
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[slideCount - 1].cloneNode(true);

        track.appendChild(firstClone);
        track.prepend(lastClone);

        const allSlides = Array.from(track.children);
        let currentIndex = 1; // Start at the first original slide
        let autoSlideInterval;
        const slideInterval = 2500;

        // Create indicators (based on original slides)
        originalSlides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.onclick = () => goToSlide(index + 1);
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = Array.from(indicatorsContainer.children);

        function updateSlidePosition(withAnimation = true) {
            track.style.transition = withAnimation ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
            const slideWidth = originalSlides[0].offsetWidth;
            const trackStyle = window.getComputedStyle(track);
            const gap = parseFloat(trackStyle.columnGap) || parseFloat(trackStyle.gap) || 24;
            track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;

            // Update indicators active state based on real index
            let realIndex = currentIndex - 1;
            if (currentIndex === 0) realIndex = slideCount - 1;
            if (currentIndex === slideCount + 1) realIndex = 0;

            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === realIndex);
            });
        }

        // Jump to real slide without animation when hitting clones
        track.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                currentIndex = slideCount;
                updateSlidePosition(false);
            } else if (currentIndex === slideCount + 1) {
                currentIndex = 1;
                updateSlidePosition(false);
            }
        });

        function goToSlide(index) {
            currentIndex = index;
            updateSlidePosition();
            resetAutoSlide();
        }

        function nextSlide() {
            if (currentIndex >= slideCount + 1) return; // Prevent double trigger
            currentIndex++;
            updateSlidePosition();
        }

        function prevSlide() {
            if (currentIndex <= 0) return; // Prevent double trigger
            currentIndex--;
            updateSlidePosition();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, slideInterval);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        if (nextButton) {
            nextButton.onclick = () => { nextSlide(); resetAutoSlide(); };
        }
        if (prevButton) {
            prevButton.onclick = () => { prevSlide(); resetAutoSlide(); };
        }

        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);

        window.addEventListener('resize', () => updateSlidePosition(false));

        // Initial set position to first real slide
        updateSlidePosition(false);
        startAutoSlide();

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50; // Minimum distance to trigger swipe

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide(); // Pause auto-slide on touch
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide(); // Resume auto-slide
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swiped Right -> Prev Slide
                    prevSlide();
                } else {
                    // Swiped Left -> Next Slide
                    nextSlide();
                }
                resetAutoSlide();
            }
        }
    }
});

// 6. Global Image Modal Functions
function openImageModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = src;
        modalImg.style.animation = 'none';
        modalImg.offsetHeight; // trigger reflow
        modalImg.style.animation = 'float 0.5s ease-out';
    }
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = "none";
    }
}

// 7. Sport Certificate List Toggle
function toggleCertList(btn) {
    const list = btn.nextElementSibling;
    if (list && list.classList.contains('certificate-list')) {
        const isShowing = list.classList.toggle('show');
        btn.textContent = isShowing ? 'HIDE CERTIFICATES' : 'VIEW CERTIFICATES';

        // Add subtle animation or scroll if needed
        if (isShowing) {
            list.style.animation = 'fadeIn 0.3s ease-out';
        }
    }
}
