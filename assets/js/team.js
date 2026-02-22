
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";
  
  document.addEventListener("DOMContentLoaded", () => {
  fetch(`${BASE_PATH}/data/team.json`)
    .then(response => response.json())
    .then(data => {

     /* ================= RIBBON ================= */
    document.getElementById("ribbonTitle").innerText = data.ribbon.title;
    document.getElementById("ribbonDesc").innerText = data.ribbon.description;


      const container = document.getElementById("teamContainer");

      data.Team.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("team-card");

        card.innerHTML = `
          <img src="${member.image}" alt="${member.name}" class="team-img">
          
          <div class="team-content">
            <h3 class="team-name">${member.name}</h3>
            <p class="team-role">${member.role}</p>
            <p class="team-desc">${member.description}</p>
            
            <div class="social-links">
              <a href="${member.socials.twitter}" target="_blank"><i class="bi bi-twitter-x"></i></a>
              <a href="#"><i class="bi bi-envelope"></i></a>
              <a href="${member.socials.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>
              <a href="#"><i class="bi bi-github"></i></a>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
      const grid = document.getElementById("statsGrid");

      data.Stats.forEach(stat => {
        const item = document.createElement("div");
        item.classList.add("stat-item");

        item.innerHTML = `
          <div class="stat-value">${stat.value}</div>
          <div class="stat-divider"></div>
          <h3 class="stat-title">${stat.title}</h3>
          <p class="stat-desc">${stat.description}</p>
        `;

        grid.appendChild(item);
      });
    
    const collabcontainer = document.getElementById("teamContainer1");

      data.Team.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("team-card");

        card.innerHTML = `
          <img src="${member.image}" alt="${member.name}" class="team-img">
          
          <div class="team-content">
            <h3 class="team-name">${member.name}</h3>
            <p class="team-role">${member.role}</p>
            <p class="team-desc">${member.description}</p>
            
            <div class="social-links">
              <a href="${member.socials.twitter}" target="_blank"><i class="bi bi-twitter-x"></i></a>
              <a href="#"><i class="bi bi-envelope"></i></a>
              <a href="${member.socials.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>
              <a href="#"><i class="bi bi-github"></i></a>
            </div>
          </div>
        `;

        collabcontainer.appendChild(card);
      });

    // logo   
    const logocontainer = document.getElementById("clientsContainer");
    console.log(data.Logo);
    data.Logo.forEach(client => {
      const logocard = document.createElement("a"); 
      logocard.href = client.url;
      logocard.classList.add("client-card");
      logocard.target = "_blank";
      logocard.rel = "noopener noreferrer";

      logocard.innerHTML = `
        <img src="${client.logo}" alt="${client.name} logo" loading="lazy">
      `;

      logocontainer.appendChild(logocard);
    });

      const expertcontainer = document.getElementById("expertiseContainer");

    renderExpertise(data.Expert);
      animateBars();

     function renderExpertise(items) {
    expertcontainer.innerHTML = items.map(item => `
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
    const bars = document.querySelectorAll(".progress-fill");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  }

  function getIcon(type) {
    const icons = {
      palette: `<i class="bi bi-palette2 expert-logo"></i>`,
      code: `<i class="bi bi-code-slash expert-logo"></i>`,
      chart: `<i class="bi bi-graph-up expert-logo"></i>`,
      team: `<i class="bi bi-people-fill expert-logo"></i>`,
      bulb: `<i class="bi bi-lightbulb expert-logo"></i>`,
      gear: `<i class="bi bi-gear expert-logo"></i>`
    };
    return icons[type] || "⭐";
  }
  }).catch(error => console.error("Error loading team data:", error));
});