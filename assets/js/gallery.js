const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";

/* ─────────────────────────────
   SVG helpers
───────────────────────────── */
const svgClock = `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.62)"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <polyline points="12 6 12 12 16 14"/>
</svg>`;

const svgImgPlaceholder = `<svg viewBox="0 0 24 24" fill="none"
  stroke="rgba(255,255,255,.28)" stroke-width="1.4">
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <circle cx="8.5" cy="8.5" r="1.5"/>
  <polyline points="21 15 16 10 5 21"/>
</svg>`;

const svgZoom = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff"
  stroke-width="2.2" stroke-linecap="round">
  <circle cx="11" cy="11" r="8"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  <line x1="11" y1="8"  x2="11" y2="14"/>
  <line x1="8"  y1="11" x2="14" y2="11"/>
</svg>`;

/* ─────────────────────────────
   State
───────────────────────────── */
let allItems       = [];   // flat array of all gallery items
let filteredItems  = [];   // currently visible items
let currentIndex   = 0;    // open modal index in filteredItems

/* ─────────────────────────────
   Build one gallery card
───────────────────────────── */
function buildCard(item, globalIndex) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.dataset.index = globalIndex;

  const imgOrPlaceholder = item.image
    ? `<img src="${BASE_PATH}/${item.image}" alt="${item.title}" loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';

  div.innerHTML = `
    ${imgOrPlaceholder}
    <div class="img-placeholder" ${item.image ? 'style="display:none"' : ''}>
      ${svgImgPlaceholder}
    </div>
    <div class="gallery-item-overlay">
      <div class="overlay-category">${item.category}</div>
      <div class="overlay-title">${item.title}</div>
      <div class="overlay-timeline">
        ${svgClock}
        ${item.timeline}
      </div>
    </div>
    <div class="gallery-item-zoom">${svgZoom}</div>`;

  div.addEventListener('click', () => openModal(globalIndex));
  return div;
}

/* ─────────────────────────────
   Render grid
───────────────────────────── */
function renderGrid(items) {
  const grid  = document.getElementById('masonryGrid');
  const stats = document.getElementById('galleryStats');

  grid.innerHTML = '';

  if (!items.length) {
    grid.innerHTML = '<div class="empty-state">No items found for this category.</div>';
    stats.innerHTML = '';
    return;
  }

  stats.innerHTML = `Showing <span>${items.length}</span> of <span>${allItems.length}</span> items`;

  items.forEach((item, i) => {
    // find its original index in allItems for modal navigation
    const globalIndex = allItems.indexOf(item);
    grid.appendChild(buildCard(item, globalIndex));
  });
}

/* ─────────────────────────────
   Build filter buttons
───────────────────────────── */
function buildFilters(categories) {
  const bar = document.getElementById('filterBar');
  bar.innerHTML = '';

  const all = document.createElement('button');
  all.className   = 'filter-btn active';
  all.textContent = 'All';
  all.addEventListener('click', () => applyFilter('All', all));
  bar.appendChild(all);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className   = 'filter-btn';
    btn.textContent = cat;
    btn.addEventListener('click', () => applyFilter(cat, btn));
    bar.appendChild(btn);
  });
}

/* ─────────────────────────────
   Apply filter
───────────────────────────── */
function applyFilter(category, clickedBtn) {
  // toggle active class
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  clickedBtn.classList.add('active');

  filteredItems = category === 'All'
    ? [...allItems]
    : allItems.filter(item => item.category === category);

  renderGrid(filteredItems);
}

/* ─────────────────────────────
   MODAL
───────────────────────────── */
const overlay    = document.getElementById('modalOverlay');
const modalImg   = document.getElementById('modalImg');
const modalFallback = document.getElementById('modalFallback');
const modalTitle    = document.getElementById('modalTitle');
const modalDesc     = document.getElementById('modalDesc');
const modalVenue    = document.getElementById('modalVenue');
const modalTimeline = document.getElementById('modalTimeline');
const modalCounter  = document.getElementById('modalCounter');
const modalCategory = document.getElementById('modalCategory');

function openModal(globalIndex) {
  currentIndex = globalIndex;
  populateModal(allItems[globalIndex]);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function populateModal(item) {
  // image
  if (item.image) {
    modalImg.src = `${BASE_PATH}/${item.image}`;
    modalImg.alt = item.title;
    modalImg.style.display = 'block';
    modalFallback.style.display = 'none';
    modalImg.onerror = () => {
      modalImg.style.display = 'none';
      modalFallback.style.display = 'flex';
    };
  } else {
    modalImg.style.display = 'none';
    modalFallback.style.display = 'flex';
  }

  // text content
  modalCategory.textContent  = item.category;
  modalTitle.textContent     = item.title;
  modalDesc.textContent      = item.description;
  modalVenue.textContent     = item.venue;
  modalTimeline.textContent  = item.timeline;
  modalCounter.textContent   = `${currentIndex + 1} / ${allItems.length}`;

  // hide/show prev-next based on position
  document.getElementById('modalPrev').style.display = currentIndex > 0 ? 'flex' : 'none';
  document.getElementById('modalNext').style.display = currentIndex < allItems.length - 1 ? 'flex' : 'none';
}

function navigateModal(direction) {
  const next = currentIndex + direction;
  if (next < 0 || next >= allItems.length) return;
  currentIndex = next;
  populateModal(allItems[currentIndex]);
}

/* ─────────────────────────────
   Event listeners
───────────────────────────── */
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalPrev').addEventListener('click', () => navigateModal(-1));
document.getElementById('modalNext').addEventListener('click', () => navigateModal(1));

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (!overlay.classList.contains('open')) return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowLeft')  navigateModal(-1);
  if (e.key === 'ArrowRight') navigateModal(1);
});

/* ─────────────────────────────
   Fetch & initialise
───────────────────────────── */
async function init() {
  const grid = document.getElementById('masonryGrid');
  grid.innerHTML = '<div class="loading-state">Loading gallery…</div>';

  try {
    const res = await fetch(`${BASE_PATH}/data/gallery.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const data = await res.json();
    allItems = data;

    // extract unique categories preserving order
    const categories = [...new Set(data.map(item => item.category))];

    filteredItems = [...allItems];
    buildFilters(categories);
    renderGrid(filteredItems);

  } catch (err) {
    console.error('Gallery load error:', err);
    grid.innerHTML = `
      <div class="error-state">
        ⚠️ Could not load gallery. Please try again later.<br>
        <small style="opacity:.6">${err.message}</small>
      </div>`;
  }
}

init();