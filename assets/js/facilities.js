const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";

const CATEGORY_CLASS_MAP = {
  "Characterization": "cat-characterization",
  "Fabrication":      "cat-fabrication",
  "Mechanical":       "cat-mechanical",
  "Thermal":          "cat-thermal",
  "Computational":    "cat-computational",
  "Imaging":          "cat-imaging",
  "Other":            "cat-other",
};

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${BASE_PATH}/data/facilities.json`)
    .then((res) => res.json())
    .then((data) => {
      renderRibbon(data.ribbon);
      renderStats(data.stats);
      renderFilters(data.equipment);
      renderEquipment(data.equipment);
      renderInfoCards(data.info);
    })
    .catch((err) => console.error("Facilities load error:", err));
});

/* ── Ribbon ── */
function renderRibbon({ title, description }) {
  document.getElementById("ribbonTitle").innerText = title;
  document.getElementById("ribbonDesc").innerText  = description;
}

/* ── Stats bar ── */
function renderStats(stats) {
  const grid = document.getElementById("facStatsGrid");
  grid.innerHTML = stats.map(s => `
    <div class="fac-stat-item">
      <div class="fac-stat-value">${s.value}</div>
      <div class="fac-stat-label">${s.label}</div>
    </div>
  `).join("");
}

/* ── Filter tabs (built from categories in data) ── */
function renderFilters(equipment) {
  const categories = ["All", ...new Set(equipment.map(e => e.category))];
  const filterBar  = document.getElementById("facFilter");

  filterBar.innerHTML = categories.map((cat, i) => `
    <button class="fac-tab ${i === 0 ? "active" : ""}" data-filter="${cat}">
      ${cat}
    </button>
  `).join("");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".fac-tab");
    if (!btn) return;

    filterBar.querySelectorAll(".fac-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    applyFilter(btn.dataset.filter);
  });
}

/* ── Filter logic ── */
function applyFilter(selected) {
  const cards  = document.querySelectorAll(".fac-card");
  const empty  = document.getElementById("facEmpty");
  let visible  = 0;

  cards.forEach(card => {
    const match = selected === "All" || card.dataset.category === selected;
    card.classList.toggle("hidden", !match);
    if (match) visible++;
  });

  empty.classList.toggle("hidden", visible > 0);
}

/* ── Equipment cards ── */
function renderEquipment(equipment) {
  const grid = document.getElementById("facGrid");

  grid.innerHTML = equipment.map(item => {
    const catClass  = CATEGORY_CLASS_MAP[item.category] || "cat-other";
    const statusClass = `status-${item.status.toLowerCase().replace(/\s+/g, "-")}`;
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.name}" class="fac-card-img" loading="lazy">`
      : `<div class="fac-card-placeholder"><i class="bi bi-${item.icon || "cpu"}"></i></div>`;

    const specsHTML = item.specs.map(spec =>
      `<li><i class="bi bi-check2"></i>${spec}</li>`
    ).join("");

    return `
      <div class="fac-card" data-category="${item.category}">
        ${imageHTML}
        <div class="fac-card-body">
          <span class="fac-card-category ${catClass}">${item.category}</span>
          <div class="fac-card-title">${item.name}</div>
          ${item.model ? `<div class="fac-card-model">${item.model}</div>` : ""}
          <p class="fac-card-desc">${item.description}</p>
          <ul class="fac-specs">${specsHTML}</ul>
          <div class="fac-status ${statusClass}">
            <span class="fac-status-dot"></span>
            ${item.status}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* ── Info cards (access, safety, contact) ── */
function renderInfoCards(info) {
  const grid = document.getElementById("facInfoGrid");

  grid.innerHTML = info.map(card => {
    const itemsHTML = card.items.map(item =>
      `<li><i class="bi bi-chevron-right"></i>${item}</li>`
    ).join("");

    return `
      <div class="fac-info-card">
        <div class="fac-info-icon"><i class="bi bi-${card.icon}"></i></div>
        <div class="fac-info-title">${card.title}</div>
        <ul class="fac-info-list">${itemsHTML}</ul>
      </div>
    `;
  }).join("");
}