// ================================
// CONFIG
// ================================
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";

// ================================
// UTILITIES
// ================================
async function loadHTML(targetId, filePath, onLoad) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`${filePath} not found`);

    const html = await res.text();
    const target = document.getElementById(targetId);
    if (!target) return;

    target.innerHTML = html;
    onLoad && onLoad();
  } catch (err) {
    console.error("HTML Load Error:", err);
  }
}

// ================================
// NAVIGATION
// ================================
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  const activateLinks = (selector) => {
    document.querySelectorAll(selector).forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");

        const dropdown = link.closest(".dropdown");
        dropdown && dropdown.classList.add("open");
      }
    });
  };

  activateLinks("nav.desktop-nav a");
  activateLinks(".sidebar a");
}

// Sidebar toggle (used by HTML onclick)
window.toggleSidebar = () => {
  document.getElementById("sidebar")?.classList.toggle("show");
};

window.toggleDropdown = (el) => {
  el?.parentElement?.classList.toggle("open");
};

// ================================
// CAROUSEL HELPER (optional reuse)
// ================================
function mountCarousel({ mountId, images }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  mount.innerHTML = `
    <div class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        ${createCarouselItems(images)}
      </div>
    </div>
  `;
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // Navbar
  loadHTML(
    "navbar-placeholder",
    `${BASE_PATH}/components/navbar.html`,
    setActiveNav
  );

  // Footer
  loadHTML(
    "footer-placeholder",
    `${BASE_PATH}/components/footer.html`,
    () => {
      const script = document.createElement("script");
      script.src = `${BASE_PATH}/assets/js/footer.js`;
      document.body.appendChild(script);
    }
  );
});
