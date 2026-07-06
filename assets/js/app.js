 // ================================
// CONFIG
// ================================
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : ".";

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

// Sidebar toggle (used by HTML onclick)
window.toggleSidebar = () => {
  const isOpen = document.getElementById("sidebar")?.classList.toggle("show");
  const btn = document.querySelector(".hamburger");
  if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

window.toggleDropdown = (el) => {
  const isOpen = el?.parentElement?.classList.toggle("open");
  if (el) el.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

// ================================
// SCROLL REVEAL
// ================================
function initScrollReveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  function observeNew() {
    document.querySelectorAll(".reveal:not(.observed)").forEach(el => {
      el.classList.add("observed");
      io.observe(el);
    });
  }

  observeNew();

  // Auto-pick up .reveal elements added by dynamic renderers
  new MutationObserver(observeNew).observe(document.body, {
    childList: true,
    subtree: true,
  });
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

  initScrollReveal();
});
