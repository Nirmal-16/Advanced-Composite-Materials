export function createCard({ title, description, icon }) {
  return `
    <div class="card">
      <div class="icon">${icon}</div>
      <h3 class="title">${title}</h3>
      <p class="desc">${description}</p>
    </div>
  `;
}