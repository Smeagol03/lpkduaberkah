document.addEventListener("DOMContentLoaded", function () {
  // Carousel elements
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const carouselItems = document.querySelectorAll(".carousel-item");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  let currentIndex = 0;
  const totalItems = carouselItems.length;

  // Create indicators
  for (let i = 0; i < totalItems; i++) {
    const indicator = document.createElement("button");
    indicator.classList.add(
      "w-3",
      "h-3",
      "rounded-full",
      "bg-white",
      "bg-opacity-50",
      "transition-all",
      "duration-300"
    );
    indicator.setAttribute("data-index", i);
    indicator.addEventListener("click", () => {
      goToSlide(i);
    });
    indicatorsContainer.appendChild(indicator);
  }

  const indicators = document.querySelectorAll(".carousel-indicators button");

  // Initialize carousel
  updateCarousel();

  // Auto slide - mengubah interval menjadi 3 detik (3000ms)
  let autoSlideInterval = setInterval(nextSlide, 3000);

  // Event listeners
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Functions
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function updateCarousel() {
    // Update carousel position
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add("bg-opacity-100", "w-6");
      } else {
        indicator.classList.remove("bg-opacity-100", "w-6");
      }
    });
  }

  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide(); // Swipe left
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide(); // Swipe right
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });
});
