document.addEventListener("DOMContentLoaded", function () {

  const grid = document.getElementById("cardGrid");
  const tabs = document.querySelectorAll(".tab");

  let allItems = [];

 const BASE_PATH = window.location.hostname.includes("github.io")
    ? "/Advanced-Composite-Materials"
    : ".";

  fetch(`${BASE_PATH}/data/blogs-books.json`)
    .then(res => res.json())
    .then(data => {

      document.getElementById("ribbonTitle").innerText = data.ribbon.title;
      document.getElementById("ribbonDesc").innerText = data.ribbon.description;

      allItems = data.items;

      renderCards(allItems);
    });

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;

      if (filter === "all") {
        renderCards(allItems);
      } else {
        const filtered = allItems.filter(item => item.type === filter);
        renderCards(filtered);
      }
    });
  });

  function renderCards(items) {

    grid.innerHTML = "";

    items.forEach(item => {

      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}">

        <div class="card-content">

          <span class="badge ${item.type}">${item.type}</span>

          <h3>${item.title}</h3>

          <p>${item.short}</p>

          <p class="full-text">${item.full}</p>

          <span class="toggle-btn">Read more...</span>

          <a href="${item.link}" class="explore-btn">
            ${item.type === "Book" ? "Explore Book" : "Read Blog"}
          </a>

        </div>
      `;

      grid.appendChild(card);

      // Expand toggle
      const toggle = card.querySelector(".toggle-btn");
      const fullText = card.querySelector(".full-text");

      toggle.addEventListener("click", () => {
        fullText.style.display =
          fullText.style.display === "block" ? "none" : "block";

        toggle.innerText =
          fullText.style.display === "block" ? "Show less" : "Read more";
      });
    });
  }

});

