const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";

/* ── SVG icons ── */
const icons = {
  fallback: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>`,

  doi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="#58e3e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>`,

  empty: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8"  x2="12"    y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>`
};

/* ── Build one research card ── */
function buildCard(item, index) {
  /* alternating: even index (0,2,4…) = image-left, odd = image-right (flip) */
  const flipClass = index % 2 !== 0 ? ' flip' : '';
  const cardNum   = String(index + 1).padStart(2, '0');

  /* keywords */
  const keywordsHTML = (item.keywords ?? [])
    .map(k => `<span class="keyword-tag">${k}</span>`)
    .join('');

  /* DOI */
  const doiDisplay = item.doi
    ? item.doi.startsWith('http')
      ? `<a class="doi-value" href="${item.doi}" target="_blank" rel="noopener">${item.doi}</a>`
      : `<span class="doi-value">${item.doi}</span>`
    : `<span class="doi-value" style="opacity:.4">Not assigned</span>`;

  /* thumbnail */
  const imgHTML = item.image
    ? `<img src="${BASE_PATH}/${item.image}" alt="${item.title}" loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';

  return `
    <article class="rcard${flipClass}" data-index="${index}">

      <div class="rcard-thumb">
        ${imgHTML}
        <div class="thumb-fallback" ${item.image ? 'style="display:none"' : ''}>
          ${icons.fallback}
        </div>
      </div>

      <div class="rcard-body">

        <span class="rcard-index">Research — ${cardNum}</span>

        <h3 class="rcard-title">${item.title}</h3>

        <div class="rcard-desc-wrap">
          <p class="rcard-desc" id="desc-${index}">${item.description}</p>
          <button class="toggle-desc" aria-expanded="false" aria-controls="desc-${index}"
            onclick="toggleDesc(${index}, this)">
            Show more <span class="arrow">&#x25BE;</span>
          </button>
        </div>

        ${keywordsHTML ? `<div class="rcard-keywords">${keywordsHTML}</div>` : ''}

        <div class="rcard-doi">
          <div class="doi-icon">${icons.doi}</div>
          <div>
            <span class="doi-label">DOI</span>
            ${doiDisplay}
          </div>
        </div>

      </div>
    </article>`;
}

/* ── Toggle description expand / collapse ── */
function toggleDesc(index, btn) {
  const desc     = document.getElementById(`desc-${index}`);
  const expanded = desc.classList.toggle('expanded');

  btn.setAttribute('aria-expanded', String(expanded));
  btn.classList.toggle('open', expanded);
  btn.innerHTML = expanded
    ? `Show less <span class="arrow">&#x25BE;</span>`
    : `Show more <span class="arrow">&#x25BE;</span>`;
}

/* expose globally for inline onclick */
window.toggleDesc = toggleDesc;

/* ── Render one domain panel ── */
function renderPanel(domainKey, items, container) {
  const safeKey = domainKey.replace(/\s+/g, '-').toLowerCase();

  /* split title for teal highlight on last word */
  const words     = domainKey.split(' ');
  const last      = words.pop();
  const rest      = words.join(' ');
  const titleHTML = rest ? `${rest} <span>${last}</span>` : `<span>${last}</span>`;

  const panelEl   = document.createElement('div');
  panelEl.className = 'panel';
  panelEl.id        = `panel-${safeKey}`;
  panelEl.setAttribute('role', 'tabpanel');

  panelEl.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${titleHTML}</h2>
      <span class="research-count">${items.length} Paper${items.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="card-list">
      ${items.length
        ? items.map((item, i) => buildCard(item, i)).join('')
        : `<div class="empty-state">${icons.empty}<p>No research items available.</p></div>`
      }
    </div>`;

  container.appendChild(panelEl);
}

/* ── Build tab buttons ── */
function buildTabs(domains, tabBar) {
  domains.forEach((domain, idx) => {
    const safeKey = domain.replace(/\s+/g, '-').toLowerCase();
    const btn     = document.createElement('button');

    btn.className = `tab-btn${idx === 0 ? ' active' : ''}`;
    btn.id        = `tab-${safeKey}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(idx === 0));
    btn.setAttribute('aria-controls', `panel-${safeKey}`);
    btn.innerHTML = `${domain} <span class="tab-dot"></span>`;
    btn.addEventListener('click', () => switchTab(safeKey, domains));

    tabBar.appendChild(btn);
  });
}

/* ── Tab switching ── */
function switchTab(activeKey, domains) {
  domains.forEach(domain => {
    const safeKey  = domain.replace(/\s+/g, '-').toLowerCase();
    const isActive = safeKey === activeKey;

    document.getElementById(`tab-${safeKey}`)
      ?.classList.toggle('active', isActive);
    document.getElementById(`tab-${safeKey}`)
      ?.setAttribute('aria-selected', String(isActive));
    document.getElementById(`panel-${safeKey}`)
      ?.classList.toggle('active', isActive);
  });
}

/* ── Fetch & initialise ── */
async function init() {
  const tabBar    = document.getElementById('tab-bar');
  const container = document.getElementById('panels-container');

  container.innerHTML = '<div class="loading-state">Loading research…</div>';

  try {
    const response = await fetch(`${BASE_PATH}/data/current-research.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data    = await response.json();
    const domains = Object.keys(data);
    if (!domains.length) throw new Error('No domains found in data.');

    container.innerHTML = '';
    buildTabs(domains, tabBar);
    domains.forEach(domain => renderPanel(domain, data[domain], container));

    /* activate first panel */
    const firstKey = domains[0].replace(/\s+/g, '-').toLowerCase();
    document.getElementById(`panel-${firstKey}`)?.classList.add('active');

  } catch (err) {
    console.error('Failed to load current research:', err);
    container.innerHTML = `
      <div class="error-state">
        ⚠️ Could not load research data. Please try again later.<br>
        <small style="opacity:.6">${err.message}</small>
      </div>`;
  }
}

init();