  // import { card } from "/project-root/components/card.js";
  import { createCard } from "../../components/card.js";


  // Inject Navbar
  fetch("../../components/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;
    });


  // Inject Footer
  fetch("../../components/footer.html")
    .then(res => res.text())
    .then(data => {
      document.body.insertAdjacentHTML("beforeend", data);
    });

  fetch("../../components/card.js")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("servicesContainer");
      console.log(data);
      data.services.forEach(service => {
        container.innerHTML += createCard(service);
      });
    })
    .catch(err => console.error("JSON Load Error:", err));

    fetch("../../index.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("servicesContainer");

      data.services.forEach(service => {
        container.innerHTML += createCard(service);
      });
    });
