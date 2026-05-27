document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.querySelectorAll('.img-card'));
        const nextBtn = carousel.querySelector('.next');
        const prevBtn = carousel.querySelector('.prev');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        let currentIndex = 0;
        let direction = 1;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function moveNext() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function movePrev() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        nextBtn.addEventListener('click', () => {
            direction = 1; 
            moveNext();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            direction = -1;
            movePrev();
            resetAutoPlay();
        });

        let autoPlayTimer;
        function startAutoPlay() {
            autoPlayTimer = setInterval(() => {
                if (direction === 1) {
                    moveNext();
                } else {
                    movePrev();
                }
            }, 3000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        startAutoPlay();

        setInterval(() => {
            direction *= -1;
        }, 30000);
    });
});