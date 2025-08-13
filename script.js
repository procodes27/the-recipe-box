let recipes = [];
let visibleCount = 8;

const recipeGrid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");
const clearIcon = document.getElementById("clearIcon");

const modal = document.getElementById("recipeModal");
const closeModal = document.querySelector(".close-button");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");
const showMoreBtn = document.getElementById("showMoreBtn");

async function fetchRecipes() {
  try {
    const response = await fetch("recipes.json");
    if (!response.ok) throw new Error("Failed to fetch recipes.");
    const data = await response.json();
    recipes = data;
    displayRecipes(recipes.slice(0, visibleCount));
    if (visibleCount < recipes.length) {
      showMoreBtn.style.display = "block";
    }
  } catch (error) {
    recipeGrid.innerHTML = '<p style="color:red;">Failed to load recipes.</p>';
    console.error(error);
  }
}

function displayRecipes(recipesToShow) {
  recipeGrid.innerHTML = "";
  recipesToShow.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" />
      <h3>${recipe.name}</h3>
    `;
    card.addEventListener("click", () => showRecipeModal(recipe));
    recipeGrid.appendChild(card);
  });
}

searchIcon.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = recipes.filter(r => r.name.toLowerCase().includes(query));
  displayRecipes(filtered);
});

clearIcon.addEventListener("click", () => {
  searchInput.value = "";
  clearIcon.style.display = "none";
  displayRecipes(recipes.slice(0, visibleCount));
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = recipes.filter(r => r.name.toLowerCase().includes(query));
  displayRecipes(filtered);
  clearIcon.style.display = query ? "block" : "none";
});
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    searchIcon.click(); // simulate clicking the icon
  }
});

function showRecipeModal(recipe) {
  modalTitle.textContent = recipe.name;
  modalImage.src = recipe.image;

  modalIngredients.innerHTML = "";
  recipe.ingredients.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    modalIngredients.appendChild(li);
  });

  modalInstructions.innerHTML = "";
  recipe.instructions.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    modalInstructions.appendChild(li);
  });

  modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

showMoreBtn.addEventListener("click", () => {
  visibleCount += 8;
  displayRecipes(recipes.slice(0, visibleCount));
  if (visibleCount >= recipes.length) {
    showMoreBtn.style.display = "none";
  }
});

fetchRecipes();

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadBtn");

  downloadBtn.addEventListener("click", () => {
    const title = modalTitle.textContent.trim();
    const imageSrc = modalImage.src;
    const ingredients = Array.from(modalIngredients.querySelectorAll("li")).map(li => li.textContent);
    const instructions = Array.from(modalInstructions.querySelectorAll("li")).map(li => li.textContent);

    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(`
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h1 { color: #4a148c; }
          img { width: 100%; max-width: 500px; border-radius: 10px; margin-bottom: 20px; }
          h2 { margin-top: 20px; color: #333; }
          ul, ol { padding-left: 20px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <img src="${imageSrc}" alt="${title}" />
        <h2>Ingredients</h2>
        <ul>${ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
        <h2>Instructions</h2>
        <ol>${instructions.map(step => `<li>${step}</li>`).join("")}</ol>
      </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print(); // lets user download/save as PDF
  });
});
