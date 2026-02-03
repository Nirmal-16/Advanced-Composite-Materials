const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : "";
fetch(`${BASE_PATH}/data/footer.json`)
  .then(res => res.json())
  .then(data => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    footer.querySelector(".footer-logo").textContent = data.logoTitle;
    footer.querySelector(".footer-desc").textContent = data.description;

    const linksList = footer.querySelector(".footer-links");
    linksList.innerHTML = "";
    data.quickLinks.forEach(link => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${link.url}">${link.label}</a>`;
      linksList.appendChild(li);
    });

    const contactCol = footer.querySelectorAll(".footer-col")[2];
    contactCol.querySelector("p:nth-of-type(1)").textContent = `📍 ${data.contact.location}`;
    contactCol.querySelector("p:nth-of-type(3)").textContent = `📞 ${data.contact.phone}`;

    const emailLink = contactCol.querySelector("a[href^='mailto']");
    emailLink.href = `mailto:${data.contact.email}`;
    emailLink.textContent =`✉️ ${data.contact.email}`;

    const socials = contactCol.querySelector(".social-icons");
    socials.innerHTML = `
      <a href="${data.contact.socials.linkedin}" target="_blank">LinkedIn</a> |
      <a href="${data.contact.socials.github}" target="_blank">GitHub</a>
    `;

    const mapCol = footer.querySelectorAll(".footer-col")[3];
    mapCol.querySelector("a").href = data.map.link;
    mapCol.querySelector("img").src = data.map.image;

    footer.querySelector(".footer-bottom p").textContent = data.copyright;
  })
  .catch(err => console.error("Footer load failed:", err));
