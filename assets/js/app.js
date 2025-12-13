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

// Load Navbar
loadHTML("navbar-placeholder", `${BASE_PATH}/components/navbar.html`);

// Load Footer
loadHTML("footer-placeholder", `${BASE_PATH}/components/footer.html`);