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
      const href = link.getAttribute("href");

      if (href === currentPage) {
        // Activate the clicked/current link
        link.classList.add("active");

        // If inside dropdown, activate parent
        const dropdown = link.closest(".dropdown");
        if (dropdown) {
          dropdown.classList.add("open");

          const parentLink = dropdown.querySelector(":scope > a");
          parentLink && parentLink.classList.add("active");
        }
      }
    });
  };

  activateLinks("nav.desktop-nav a");
  activateLinks(".sidebar a");
  document.querySelectorAll(".contact-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = `${BASE_PATH}/contact.html`;
  });
});

}

document.querySelectorAll(".contact-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = `${BASE_PATH}/contact.html`;
  });
});

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
