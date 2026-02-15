let currentIndex = 0;
let autoSlide;
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";

async function loadTestimonials() {
  const response = await fetch(`${BASE_PATH}/data/testimonials.json`);
  const testimonials = await response.json();

  const track = document.getElementById("testimonialTrack");
  const dotsContainer = document.getElementById("testimonialDots");

  // Duplicate for infinite illusion
  const duplicated = [...testimonials, ...testimonials];

  duplicated.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("testimonial-card");

    const stars = "★".repeat(item.rating);

    card.innerHTML = `
      <div class="testimonial-header">
        <img src="${item.image}" alt="${item.name}">
        <div class="testimonial-name">${item.name}</div>
        <div class="testimonial-role">${item.designation}</div>
        <div class="stars">${stars}</div>
      </div>
      <div class="testimonial-text">${item.text}</div>
    `;

    track.appendChild(card);
  });

  // Create dots (only original length)
  testimonials.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("testimonial-dot");
    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      goToSlide(index, testimonials.length);
      resetAutoSlide(testimonials.length);
    });

    dotsContainer.appendChild(dot);
  });

  startAutoSlide(testimonials.length);
}

function goToSlide(index, total) {
  const track = document.getElementById("testimonialTrack");
  const card = track.querySelector(".testimonial-card");
  const cardWidth = card.offsetWidth + 30;

  currentIndex = index;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

  updateDots(total);
}

function updateDots(total) {
  const dots = document.querySelectorAll(".testimonial-dot");
  dots.forEach(dot => dot.classList.remove("active"));

  dots[currentIndex % total].classList.add("active");
}

function startAutoSlide(total) {
  autoSlide = setInterval(() => {
    const track = document.getElementById("testimonialTrack");
    const card = track.querySelector(".testimonial-card");
    const cardWidth = card.offsetWidth + 30;

    currentIndex++;

    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    updateDots(total);

    if (currentIndex >= total) {
      setTimeout(() => {
        track.style.transition = "none";
        track.style.transform = `translateX(0px)`;
        currentIndex = 0;

        setTimeout(() => {
          track.style.transition = "transform 0.8s ease-in-out";
        }, 50);
      }, 800);
    }

  }, 3000);
}

function resetAutoSlide(total) {
  clearInterval(autoSlide);
  startAutoSlide(total);
}

document.addEventListener("DOMContentLoaded", loadTestimonials);
