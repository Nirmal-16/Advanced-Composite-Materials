const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Advanced-Composite-Materials"
  : ".";

fetch(`${BASE_PATH}/data/footer.json`)
  .then((res) => res.json())
  .then((data) => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    /* Brand */
    footer.querySelector(".footer-logo").textContent = data.logoTitle;
    footer.querySelector(".footer-desc").textContent = data.description;

    /* Social icons (icon-only) */
    footer.querySelector(".social-icons").innerHTML = `
      <a href="${data.contact.socials.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
        <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
        </svg>
      </a>
      <a href="${data.contact.socials.g_scholar}" target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
          <title>Google Scholar icon</title>
          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/>
        </svg>
      </a>
      <a href="${data.contact.socials.researchgate}" target="_blank" rel="noopener" aria-label="ResearchGate" title="ResearchGate">
        <span class="footer-researchgate-icon" aria-hidden="true"></span>
      </a>
      <a href="${data.contact.socials.twitter}" target="_blank" rel="noopener" aria-label="Twitter / X" title="Twitter / X">
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
          <title>Twitter / X icon</title>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
      </a>
    `;

    /* Quick links */
    footer.querySelector(".footer-links").innerHTML = data.quickLinks
      .map((link) => `<li><a href="${link.url}">${link.label}</a></li>`)
      .join("");

    /* Contact */
    footer.querySelector(".contact-location").innerHTML = `
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
      </svg>
      <span>${data.contact.location}</span>
    `;

    footer.querySelector(".contact-email").innerHTML = `
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
      </svg>
      <a href="mailto:${data.contact.email}">${data.contact.email}</a>
    `;

    footer.querySelector(".contact-phone").innerHTML = `
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
      </svg>
      <span>${data.contact.phone}</span>
    `;

    /* Map */
    const mapLink = footer.querySelector(".map-link");
    mapLink.href = data.map.link;
    mapLink.querySelector(".map-image").src = data.map.image;

    /* Institute + lab logos */
    footer.querySelector(".footer-institute-logo").src = data.instituteLogo;
    footer.querySelector(".footer-lab-logo").src = data.labLogo;

    /* Copyright (year fetched from the visitor's current date) */
    const currentYear = new Date().getFullYear();
    footer.querySelector(".footer-copyright").textContent = `© ${currentYear} ${data.copyright}`;
  })
  .catch((err) => console.error("Footer load failed:", err));
