document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
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

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Cursor effect (optional: adds a subtle glow follow)
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // You could add a custom cursor div here if you want extra flair
        // For now, we keep it performant
    });

    // Modal Logic
    const modal = document.getElementById("skating-modal");
    const btn = document.getElementById("skating-card");
    const span = document.getElementsByClassName("close-modal")[0];

    if (btn) {
        btn.onclick = function () {
            modal.classList.add("show");
        }
    }

    if (span) {
        span.onclick = function () {
            modal.classList.remove("show");
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.classList.remove("show");
        }
        if (event.target == martialModal) {
            martialModal.classList.remove("show");
        }
    }

    // Martial Arts Modal Logic
    const martialModal = document.getElementById("martial-arts-modal");
    const martialBtn = document.getElementById("martial-arts-card");
    const martialSpan = document.getElementById("close-martial");

    if (martialBtn) {
        martialBtn.onclick = function () {
            martialModal.classList.add("show");
        }
    }

    if (martialSpan) {
        martialSpan.onclick = function () {
            martialModal.classList.remove("show");
        }
    }

    // Carousel Functionality
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    let currentIndex = 0;
    let autoSlideInterval;
    const slideInterval = 4000; // 4 seconds per slide

    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = Array.from(indicatorsContainer.children);

    // Update slide position
    function updateSlidePosition() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * (slideWidth + 24)}px)`; // 24px = 1.5rem gap

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlidePosition();
        resetAutoSlide();
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
    }

    // Auto-slide functionality
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

    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    // Pause auto-slide on hover
    if (track) {
        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);
    }

    // Handle window resize
    window.addEventListener('resize', updateSlidePosition);

    // Start auto-slide
    startAutoSlide();
});

// Image Modal Functions (Global Scope)
function openImageModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = src;
        // Reset animation
        modalImg.style.animation = 'none';
        modalImg.offsetHeight; /* trigger reflow */
        modalImg.style.animation = 'float 0.5s ease-out';
    } else {
        console.error("Image modal elements not found!");
    }
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = "none";
    }
}

// Close modal when clicking on the image (prevent bubbling if needed, but here we usually want close on background)
// The HTML has onclick="closeImageModal()" on the container, so clicking the container closes it.
// We should stop propagation on the image so clicking the image DOES NOT close it.
document.addEventListener('DOMContentLoaded', () => {
    const modalImg = document.getElementById('modal-image');
    if (modalImg) {
        modalImg.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // ESC key to close
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            closeImageModal();
        }
    });
});
