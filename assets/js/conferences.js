document.addEventListener("DOMContentLoaded", function () {
  const timeline = document.getElementById("conferenceTimeline");
  const tabs = document.querySelectorAll(".tab");

  let allItems = []; // must be global

  const BASE_PATH = window.location.hostname.includes("github.io")
    ? "/Advanced-Composite-Materials"
    : "";

  fetch(`${BASE_PATH}/data/conferences.json`)
    .then((res) => res.json())
    .then((data) => {
      // Ribbon
      document.getElementById("ribbonTitle").innerText = data.ribbon.title;
      document.getElementById("ribbonDesc").innerText = data.ribbon.description;

      // Merge conferences + talks + proceedings
      const conferences = data["Conferences"].map((item) => ({
        ...item,
        type: "Conference",
      }));
      const talks = data["Invited Talks"].map((item) => ({
        ...item,
        type: "Talk",
      }));

      const proceedings = data["Conference Proceedings"].map((item) => ({
        ...item,
        type: "Proceeding",
      }));

      allItems = [...conferences, ...talks, ...proceedings];

      renderTimeline(allItems);
    });

  // Filter Click
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;

      if (filter === "all") {
        renderTimeline(allItems);
      } else {
        const filtered = allItems.filter((item) => item.type === filter);
        renderTimeline(filtered);
      }
    });
  });

  function renderTimeline(items) {
    timeline.innerHTML = "";

    items.forEach((item) => {
      let yearMatch;
      let year;
      const div = document.createElement("div");
      div.classList.add("timeline-item");
      if (item.type === "Talk") {
        yearMatch = item.event.match(/\d{4}/);
        year = yearMatch ? yearMatch[0] : "";

        div.innerHTML = `
        <div class="year">${year}</div>
        ${year ? '<div class="dot"></div>' : ""}

        <div class="conf-card">
          <span class="badge talk"}">
            ${item.type}
          </span>

          <h3>${item.title}</h3>
          <div class="authors">${item.event}</div>
          <div class="journal">${item.venue}</div>
        </div>
      `;
      } else {
        yearMatch = item.journal.match(/\d{4}/);
        year = yearMatch ? yearMatch[0] : "";

        div.innerHTML = `
        <div class="year">${year}</div>
        ${year ? '<div class="dot"></div>' : ""}

        <div class="conf-card">
          <span class="badge ${item.type === "Conference" ? "conference" : "proceeding"}">
            ${item.type}
          </span>

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
