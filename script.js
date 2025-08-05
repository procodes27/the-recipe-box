let recipes = [];
let visibleCount = 8;
const recipeGrid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");
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

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = recipes.filter(r => r.name.toLowerCase().includes(query));
  displayRecipes(filtered.slice(0, visibleCount));
  showMoreBtn.style.display = filtered.length > visibleCount ? "block" : "none";
});

showMoreBtn.addEventListener("click", () => {
  visibleCount += 8;
  displayRecipes(recipes.slice(0, visibleCount));
  if (visibleCount >= recipes.length) {
    showMoreBtn.style.display = "none";
  }
});

fetchRecipes();
