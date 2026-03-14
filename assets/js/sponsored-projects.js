 const BASE_PATH = window.location.hostname.includes("github.io")
    ? "/Advanced-Composite-Materials"
    : "";

const icons = {
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>`,

  coin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M14.5 9a3 3 0 0 0-5 2c0 2 3 3 3 3"/>
    <line x1="12" y1="17" x2="12" y2="17.5" stroke-width="2.5"/>
  </svg>`,

  building: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>`,

  cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="#58e3e1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>`,

  empty: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8"  x2="12"   y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>`
};

/* single project card  */
function buildCard(project, type) {
  const badgeClass = type === 'ongoing' ? 'badge-ongoing' : 'badge-completed';
  const badgeLabel = type === 'ongoing' ? 'Ongoing'       : 'Completed';

  return `
    <article class="card">
      <span class="card-badge ${badgeClass}">${badgeLabel}</span>

      <div class="card-icon">${icons.cardIcon}</div>

      <h3 class="card-title">${project.title}</h3>

      <div class="card-meta">

        <div class="meta-row">
          <div class="meta-icon">${icons.calendar}</div>
          <div class="meta-text">
            <span class="meta-label">Duration</span>
            <span class="meta-value">${project.duration}</span>
          </div>
        </div>

        <div class="meta-row">
          <div class="meta-icon">${icons.coin}</div>
          <div class="meta-text">
            <span class="meta-label">Funding</span>
            <span class="meta-value">${project.funding}</span>
          </div>
        </div>

        <div class="meta-row">
          <div class="meta-icon">${icons.building}</div>
          <div class="meta-text">
            <span class="meta-label">Sponsoring Agency</span>
            <span class="meta-value">${project.agency}</span>
          </div>
        </div>

      </div><!-- /.card-meta -->

      <div class="card-divider"></div>

      <div class="role-pill">
        <span class="role-pip"></span>
        ${project.role}
      </div>
    </article>`;
}

/* Render a grid panel */
function renderGrid(type, data) {
  const grid  = document.getElementById(`grid-${type}`);
  const count = document.getElementById(`count-${type}`);
  const projects = data[type] ?? [];

  count.textContent = `${projects.length} Project${projects.length !== 1 ? 's' : ''}`;

  if (!projects.length) {
    grid.innerHTML = `
      <div class="empty-state">
        ${icons.empty}
        <p>No projects available.</p>
      </div>`;
    return;
  }

  grid.innerHTML = projects.map(p => buildCard(p, type)).join('');
}

/*  Tab switching */
function switchTab(tab) {
  ['ongoing', 'completed'].forEach(t => {
    const btn   = document.getElementById(`tab-${t}`);
    const panel = document.getElementById(`panel-${t}`);
    const isActive = t === tab;

    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    panel.classList.toggle('active', isActive);
  });
}

/* Expose switchTab globally so inline onclick in HTML can reach it */
window.switchTab = switchTab;

/*  Fetch data & initialise  */
async function init() {
  const grids = ['ongoing', 'completed'];

  /* Show a loading placeholder in each grid while fetching */
  grids.forEach(type => {
    const grid = document.getElementById(`grid-${type}`);
    if (grid) grid.innerHTML = '<div class="loading-state">Loading projects…</div>';
  });

  try {
    const response = await fetch(`${BASE_PATH}/data/sponsored-projects.json`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    grids.forEach(type => renderGrid(type, data));

  } catch (err) {
    console.error('Failed to load project data:', err);

    grids.forEach(type => {
      const grid = document.getElementById(`grid-${type}`);
      if (grid) {
        grid.innerHTML = `
          <div class="error-state">
            ⚠️ Could not load projects. Please try again later.<br>
            <small style="opacity:.6">${err.message}</small>
          </div>`;
      }
    });
  }
}

/*  Boot  */
init();