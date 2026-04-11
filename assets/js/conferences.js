document.addEventListener("DOMContentLoaded", function () {
  const timeline = document.getElementById("conferenceTimeline");
  const tabs = document.querySelectorAll(".tab");
  let allItems = [];

  const BASE_PATH = window.location.hostname.includes("github.io")
    ? "/Advanced-Composite-Materials"
    : "";

  fetch(`${BASE_PATH}/data/conferences.json`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("ribbonTitle").innerText = data.ribbon.title;
      document.getElementById("ribbonDesc").innerText = data.ribbon.description;

      const conferences = data["Conferences"].map((item) => ({ ...item, type: "Conference" }));
      const talks       = data["Invited Talks"].map((item) => ({ ...item, type: "Talk" }));
      const proceedings = data["Conference Proceedings"].map((item) => ({ ...item, type: "Proceeding" }));

      allItems = [...conferences, ...talks, ...proceedings];
      renderTimeline(allItems);
    });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      renderTimeline(filter === "all" ? allItems : allItems.filter((i) => i.type === filter));
    });
  });

  function renderTimeline(items) {
    timeline.innerHTML = "";

    items.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("timeline-item");

      if (item.type === "Talk") {
        const yearMatch = item.event.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "";

        div.innerHTML = `
          <div class="year">${year}</div>
          ${year ? '<div class="dot"></div>' : ""}
          <div class="conf-card">
            <span class="badge talk">Talk</span>
            <h3>${item.title}</h3>
            <div class="authors">${item.event}</div>
            <div class="journal">${item.venue}</div>
          </div>
        `;
      } else {
        const yearMatch = item.journal.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "";
        const badgeClass = item.type === "Conference" ? "conference" : "proceeding";

        div.innerHTML = `
          <div class="year">${year}</div>
          ${year ? '<div class="dot"></div>' : ""}
          <div class="conf-card">
            <span class="badge ${badgeClass}">${item.type}</span>
            <h3>${item.title}</h3>
            <div class="authors">${item.authors}</div>
            <div class="journal">${item.journal}</div>
          </div>
        `;
      }

      timeline.appendChild(div);
    });
  }
});