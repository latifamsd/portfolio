
/*nav*/
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("text-green-600", "font-semibold");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("text-green-600", "font-semibold");
        }
    });
});




// Show/Hide more certificates
document.getElementById('show-more-btn').addEventListener('click', function () {
    const moreCertificates = document.getElementById('more-certificates');
    const button = this;

    if (moreCertificates.classList.contains('hidden')) {
        moreCertificates.classList.remove('hidden');
        button.innerHTML = '<i class="fas fa-minus-circle mr-3"></i> Voir moins';

        // Animate new certificates
        setTimeout(() => {
            moreCertificates.querySelectorAll('.fade-in-blur').forEach((cert, index) => {
                setTimeout(() => {
                    cert.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    } else {
        moreCertificates.classList.add('hidden');
        button.innerHTML = '<i class="fas fa-plus-circle mr-3"></i> Voir plus de certificats';
    }
});

// Intersection Observer for fade-in animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in-blur').forEach(el => {
    observer.observe(el);
});



// Classe Carousel pour gérer tous les carousels
class Carousel {
    constructor(element) {
        this.root = element;
        this.track = this.root.querySelector('.carousel-tracks');
        this.slides = Array.from(this.track.children);
        this.prevBtn = this.root.querySelector('.carousel-prev');
        this.nextBtn = this.root.querySelector('.carousel-next');
        this.dotsContainer = this.root.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        // Attendre que les images soient chargées
        this.waitForImages().then(() => {
            this.init();
        });
    }

    waitForImages() {
        const images = this.root.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            return new Promise(resolve => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = resolve;
                }
            });
        });
        return Promise.all(promises);
    }

    init() {
        this.setupCarousel();
        this.createDots();
        this.update();
        this.addEvents();
        // Démarrer l'autoplay après un délai
        setTimeout(() => {
            this.startAutoPlay();
        }, 1000);
    }

    setupCarousel() {
        // S'assurer que le track a la bonne largeur
        const totalWidth = this.slides.length * 100;
        this.track.style.width = `${totalWidth}%`;

        // Définir la largeur de chaque slide
        this.slides.forEach(slide => {
            slide.style.width = `${100 / this.slides.length}%`;
        });
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'w-2 h-2 rounded-full cursor-pointer bg-white/50 transition-all hover:bg-white/80';
            dot.addEventListener('click', () => {
                this.currentIndex = index;
                this.update();
                this.resetAutoPlay();
            });
            this.dotsContainer.appendChild(dot);
        });
    }

    update() {
        if (!this.slides.length) return;

        // Calculer le décalage en pourcentage
        const translateX = -(this.currentIndex * (100 / this.slides.length));
        this.track.style.transform = `translateX(${translateX}%)`;

        // Mise à jour des dots
        Array.from(this.dotsContainer.children).forEach((dot, i) => {
            dot.className = i === this.currentIndex
                ? 'w-2 h-2 rounded-full bg-white cursor-pointer transition-all'
                : 'w-2 h-2 rounded-full bg-white/50 cursor-pointer transition-all hover:bg-white/80';
        });
    }

    addEvents() {
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.next();
            this.resetAutoPlay();
        });

        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.prev();
            this.resetAutoPlay();
        });

        // Pause l'autoplay au survol
        this.root.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.root.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

        // Redimensionnement
        window.addEventListener('resize', () => {
            // Petite temporisation pour éviter les appels répétés
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.update();
            }, 100);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.update();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.update();
    }

    startAutoPlay() {
        if (this.autoPlayInterval || this.slides.length <= 1) return;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 3000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        setTimeout(() => {
            this.startAutoPlay();
        }, 1000);
    }
}

// Système de filtrage des projets
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setActiveButton(e.target);
                this.filterProjects(filter);
            });
        });
    }

    setActiveButton(activeBtn) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('px-6', 'py-2', 'rounded-full', 'border-2', 'border-gray-300', 'text-gray-600', 'font-medium', 'transition-all', 'duration-300', 'hover:border-green-600', 'hover:text-green-600');
        });

        activeBtn.classList.add('active');
        activeBtn.classList.remove('border-gray-300', 'text-gray-600');
        activeBtn.classList.add('border-green-600', 'text-green-600');
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.dataset.category;

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 100);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser tous les carousels
    document.querySelectorAll('[data-carousel]').forEach(el => {
        new Carousel(el);
    });

    // Initialiser le système de filtrage
    new ProjectFilter();
});


// Animation de défilement horizontal pour le carousel
const track = document.querySelector('.carousel-track');

// Dupliquer les éléments pour un effet de boucle fluide
const items = Array.from(track.children);
items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
});

let scrollSpeed = 1; // pixels
let scrollInterval;

function startScroll() {
    scrollInterval = setInterval(() => {
        track.scrollLeft += scrollSpeed;

        // Revenir au début sans montrer l'espace blanc
        if (track.scrollLeft >= track.scrollWidth / 2) {
            track.scrollLeft = 0;
        }
    }, 20);
}

function stopScroll() {
    clearInterval(scrollInterval);
}

track.addEventListener('mouseenter', stopScroll);
track.addEventListener('mouseleave', startScroll);

startScroll();

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active', 'bg-green-600', 'text-white'));
        button.classList.add('active', 'bg-green-600', 'text-white');

        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact form animation
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
    });
});
// EmailJS integration

(function () {
    emailjs.init("-QmE4sVYf64vCCTxk"); // Remplace avec ta vraie public key
})();

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm("service_jsrvsia", "template_ti79wrc", this)
        .then(function () {
            Swal.fire({
                icon: 'success',
                title: 'Message envoyé',
                text: 'Votre message a été envoyé avec succès !',
                confirmButtonColor: '#3085d6',
            });
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Une erreur s'est produite. Veuillez réessayer.",
                confirmButtonColor: '#d33',
            });
            console.log(error);
        });
});

