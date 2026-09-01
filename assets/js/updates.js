const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : ".";

let latestItems = [];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function loadUpdates() {
  const grid = document.getElementById("updatesGrid");
  if (!grid) return;

  const response = await fetch(`${BASE_PATH}/data/updates.json`);
  const items = await response.json();

  const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  latestItems = sorted.slice(0, 6);

  grid.innerHTML = "";

  latestItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("update-card");

    card.innerHTML = `
      <div class="update-meta">
        <span class="update-tag ${item.type}">${item.type}</span>
        <span class="update-date">${formatDate(item.date)}</span>
      </div>
      <h3 class="update-title">${item.title}</h3>
      <p class="update-desc">${item.description}</p>
      <button type="button" class="update-link" data-index="${index}">Read more →</button>
    `;

    grid.appendChild(card);
  });

  grid.querySelectorAll(".update-link").forEach(btn => {
    btn.addEventListener("click", () => openUpdateModal(Number(btn.dataset.index)));
  });
}

// ==========================
// MODAL
// ==========================
const modalOverlay = document.getElementById("updateModalOverlay");
const modalTag = document.getElementById("updateModalTag");
const modalDate = document.getElementById("updateModalDate");
const modalTitle = document.getElementById("updateModalTitle");
const modalVenue = document.getElementById("updateModalVenue");
const modalDesc = document.getElementById("updateModalDesc");
const modalClose = document.getElementById("updateModalClose");

function openUpdateModal(index) {
  const item = latestItems[index];
  if (!item) return;

  modalTag.textContent = item.type;
  modalTag.className = `update-tag ${item.type}`;
  modalDate.textContent = formatDate(item.date);
  modalTitle.textContent = item.title;
  modalVenue.textContent = item.venue || "";
  modalDesc.textContent = item.details || item.description;

  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeUpdateModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose?.addEventListener("click", closeUpdateModal);

modalOverlay?.addEventListener("click", e => {
  if (e.target === modalOverlay) closeUpdateModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalOverlay?.classList.contains("open")) {
    closeUpdateModal();
  }
});

document.addEventListener("DOMContentLoaded", loadUpdates);
