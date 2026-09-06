const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : ".";

// Tab definitions: label → category key in JSON
const TABS = [
  { label: "All",          key: "all" },
  { label: "Post Doc",     key: "postdoc" },
  { label: "PhD",          key: "phd" },
  { label: "MTech / MS",   key: "mtech" },
  { label: "UG / Dual",    key: "ug" },
  { label: "Student",      key: "student" },
  { label: "Project Staff",key: "project_staff" },
  { label: "Alumni",       key: "alumni" },
];

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${BASE_PATH}/data/team.json`)
    .then(res => res.json())
    .then(data => {

      /* ── Ribbon ── */
      document.getElementById("ribbonTitle").innerText = data.ribbon.title;
      document.getElementById("ribbonDesc").innerText  = data.ribbon.description;

      /* ── Team section with filter tabs ── */
      const teamSection = document.querySelector(".team-section");
      const container   = document.getElementById("teamContainer");

      // Inject filter tabs before the grid
      const filterBar = document.createElement("div");
      filterBar.classList.add("team-filter");
      filterBar.setAttribute("role", "tablist");
      filterBar.setAttribute("aria-label", "Filter team by category");

      TABS.forEach(tab => {
        const btn = document.createElement("button");
        btn.classList.add("filter-btn");
        btn.dataset.filter = tab.key;
        btn.textContent = tab.label;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", tab.key === "all" ? "true" : "false");
        if (tab.key === "all") btn.classList.add("active");
        filterBar.appendChild(btn);
      });

      container.insertAdjacentElement("beforebegin", filterBar);

      // Icon set: Email, Google Scholar, Profile (LinkedIn) — used for student cards & collaborators
      // Icons always render, even when a value is missing from the data — a
      // missing link just falls back to "#" instead of hiding the icon.
      function compactSocialLinks(member) {
        const s = member.socials || {};
        return `
          <a href="${s.email || "#"}" aria-label="Email"><i class="bi bi-envelope"></i></a>
          <a href="${s.g_scholar || "#"}" target="_blank" rel="noopener" aria-label="Google Scholar">
            <svg class="gscholar-icon" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
              <title>Google Scholar icon</title>
              <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/>
            </svg>
          </a>
          <a href="${s.linkedin || "#"}" target="_blank" rel="noopener" aria-label="Profile"><i class="bi bi-linkedin"></i></a>
        `;
      }

      // Icon set: ResearchGate, Email, LinkedIn, GitHub — default for team cards
      function fullSocialLinks(member) {
        const s = member.socials || {};
        return `
          <a href="${s.researchGate || "#"}" target="_blank" rel="noopener" aria-label="ResearchGate">
          <span class="researchgate-icon" aria-hidden="true"></span></a>
          <a href="${s.email || "#"}" aria-label="Email"><i class="bi bi-envelope"></i></a>
          <a href="${s.linkedin || "#"}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
          <a href="#" aria-label="GitHub"><i class="bi bi-github"></i></a>
        `;
      }

      // Alumni card: name, project/thesis title, passed-out year — no role/description/socials
      function alumniCardBody(member) {
        return `
          <h3 class="team-name">${member.name}</h3>
          <p class="team-role">Alumnus · Class of ${member.passedOutYear}</p>
          <p class="team-desc">${member.project}</p>
        `;
      }

      function standardCardBody(member) {
        return `
          <h3 class="team-name">${member.name}</h3>
          <p class="team-role">${member.role}</p>
          <p class="team-desc">${member.description}</p>
          <div class="social-links">
            ${member.category === "student" ? compactSocialLinks(member) : fullSocialLinks(member)}
          </div>
        `;
      }

      // Render all team cards
      data.Team.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("team-card");
        card.dataset.category = member.category || "other";

        card.innerHTML = `
          <img src="${member.image}" alt="${member.name}" class="team-img" loading="lazy">
          <div class="team-content">
            ${member.category === "alumni" ? alumniCardBody(member) : standardCardBody(member)}
          </div>
        `;
        container.appendChild(card);
      });

      // Filter logic
      function applyFilter(activeKey) {
        const cards = container.querySelectorAll(".team-card");

        // Remove stale empty state
        container.querySelectorAll(".team-empty").forEach(el => el.remove());

        let visibleCount = 0;
        cards.forEach(card => {
          const match = activeKey === "all" || card.dataset.category === activeKey;
          card.classList.toggle("hidden", !match);
          if (match) visibleCount++;
        });

        // Show empty state if no matches
        if (visibleCount === 0) {
          const empty = document.createElement("p");
          empty.classList.add("team-empty");
          empty.textContent = "No team members found in this category.";
          container.appendChild(empty);
        }
      }

      filterBar.addEventListener("click", e => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;

        filterBar.querySelectorAll(".filter-btn").forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        applyFilter(btn.dataset.filter);
      });

      /* ── Collaborators ── */
      const collabContainer = document.getElementById("teamContainer1");
      data.Collaborators.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("team-card");
        card.innerHTML = `
          <img src="${member.image}" alt="${member.name}" class="team-img" loading="lazy">
          <div class="team-content">
            <h3 class="team-name">${member.name}</h3>
            <p class="team-role">${member.role}</p>
            <p class="team-desc">${member.description}</p>
            <div class="social-links">
              ${compactSocialLinks(member)}
            </div>
          </div>
        `;
        collabContainer.appendChild(card);
      });

      /* ── Stats ── */
      const statsGrid = document.getElementById("statsGrid");
      data.Stats.forEach(stat => {
        const item = document.createElement("div");
        item.classList.add("stat-item");
        item.innerHTML = `
          <div class="stat-value">${stat.value}</div>
          <div class="stat-divider"></div>
          <h3 class="stat-title">${stat.title}</h3>
          <p class="stat-desc">${stat.description}</p>
        `;
        statsGrid.appendChild(item);
      });

      /* ── Logos ── */
      const logoContainer = document.getElementById("clientsContainer");
      data.Logo.forEach(client => {
        const a = document.createElement("a");
        a.href = client.url;
        a.classList.add("client-card");
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = `<img src="${client.logo}" alt="${client.name} logo" loading="lazy">`;
        logoContainer.appendChild(a);
      });

      /* ── Expertise ── */
      const expertContainer = document.getElementById("expertiseContainer");
      renderExpertise(data.Expert);
      animateBars();

      function renderExpertise(items) {
        expertContainer.innerHTML = items.map(item => `
          <div class="expertise-card">
            <div class="expertise-icon">${getIcon(item.icon)}</div>
            <h3 class="expertise-title">${item.title}</h3>
            <div class="level-row">
              <span class="level-text">${item.level}</span>
              <div class="progress-bar">
                <div class="progress-fill" data-width="${item.percentage}%"></div>
              </div>
            </div>
            <p class="expertise-description">${item.description}</p>
          </div>
        `).join("");
      }

      function animateBars() {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.width = entry.target.dataset.width;
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        document.querySelectorAll(".progress-fill").forEach(bar => observer.observe(bar));
      }

      function getIcon(type) {
        const icons = {
          palette: `<i class="bi bi-palette2 expert-logo"></i>`,
          code:    `<i class="bi bi-code-slash expert-logo"></i>`,
          chart:   `<i class="bi bi-graph-up expert-logo"></i>`,
          team:    `<i class="bi bi-people-fill expert-logo"></i>`,
          bulb:    `<i class="bi bi-lightbulb expert-logo"></i>`,
          gear:    `<i class="bi bi-gear expert-logo"></i>`
        };
        return icons[type] || "⭐";
      }

    })
    .catch(err => console.error("Error loading team data:", err));
});