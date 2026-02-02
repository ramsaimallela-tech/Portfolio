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
});
