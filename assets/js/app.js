// Detect base path dynamically (local vs GitHub Pages)
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "/project-root";

// loading components specified in the path in the specified id
async function loadHTML(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} not found`);
    const html = await res.text();
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  } catch (e) {
    console.error("HTML Load Error:", e);
  }
}

async function loadCarousel({ mountId, images }) {
  const carouselItemsHTML = createCarouselItems(images);
  document.getElementById(mountId).innerHTML = `
    <div class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        ${carouselItemsHTML}
      </div>
    </div>
  `;
}

function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav.desktop-nav a").forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
  document.querySelectorAll(".sidebar a").forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
      const parentDropdown = link.closest(".dropdown");
      if (parentDropdown) parentDropdown.classList.add("open");
    }
  });
}


// Load Navbar
loadHTML("navbar-placeholder", `${BASE_PATH}/components/navbar.html`).then(() => setActiveNav());;

// Load Footer
loadHTML("footer-placeholder", `${BASE_PATH}/components/footer.html`);
