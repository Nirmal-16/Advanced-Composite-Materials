import { createCard } from "../../components/card.js";

// Detect base path dynamically (local vs GitHub Pages)
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "/project-root";

// Utility to fetch text files (HTML files)
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

// Load JSON and render cards
fetch(`${BASE_PATH}/index.json`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("servicesContainer");
    if (!container) return;

    data.services.forEach(service => {
      container.innerHTML += createCard(service);
    });
  })
  .catch(err => console.error("JSON Load Error:", err));
