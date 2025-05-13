document.addEventListener("DOMContentLoaded", () => {
  const recipesList = document.getElementById("recipes-list");
  const recipeForm = document.getElementById("recipe-form");
  const searchInput = document.getElementById("searchInput");
  const modal = document.getElementById("recipe-details-modal");
  const closeButton = document.querySelector(".close-button");
  const recipeDetailsContent = document.getElementById("recipe-details-content");
  const fileInput = document.getElementById("recipe-image");
  const imagePreview = document.getElementById("image-preview");

  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  displayRecipes(recipes);

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (typeof result === "string") {
        imagePreview.src = result;
        imagePreview.classList.remove("hidden");
      }
    };
    reader.readAsDataURL(file);
  });

  recipeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("recipe-name").value.trim();
    const ingredients = document.getElementById("recipe-ingredients").value
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    const instructions = document.getElementById("recipe-instructions").value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const file = fileInput.files?.[0];
    if (!file) {
      alert("Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;

      if (typeof imageData !== "string") {
        alert("Invalid image format.");
        return;
      }

      const newRecipe = {
        id: Date.now(),
        name,
        ingredients,
        instructions,
        imageData,
        dateAdded: new Date().toISOString(),
      };

      recipes.push(newRecipe);
      localStorage.setItem("recipes", JSON.stringify(recipes));
      displayRecipes(recipes);
      recipeForm.reset();
      imagePreview.classList.add("hidden");
      alert(`Recipe "${name}" has been added!`);
    };

    reader.onerror = () => {
      alert("Error reading the image file.");
    };

    reader.readAsDataURL(file);
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((i) => i.toLowerCase().includes(searchTerm)) ||
        recipe.instructions.some((s) => s.toLowerCase().includes(searchTerm))
      );
    });

    displayRecipes(filtered);
  });

  recipesList.addEventListener("click", (e) => {
    const card = e.target.closest(".recipe-card");
    if (!card) return;

    const recipeId = parseInt(card.dataset.id);
    showRecipeDetails(recipeId);
  });

  closeButton.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function displayRecipes(list) {
    recipesList.innerHTML = "";

    if (list.length === 0) {
      recipesList.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    list.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.dataset.id = recipe.id;

      card.innerHTML = `
        <img src="${recipe.imageData}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-info">
          <h3>${recipe.name}</h3>
          <p>${recipe.ingredients.length} ingredients | ${recipe.instructions.length} steps</p>
        </div>
      `;

      recipesList.appendChild(card);
    });
  }

  function showRecipeDetails(id) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;

    recipeDetailsContent.innerHTML = `
      <img src="${recipe.imageData}" alt="${recipe.name}" class="detail-image" />
      <h2>${recipe.name}</h2>
      <div class="detail-section">
        <h3>Ingredients:</h3>
        <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>
      <div class="detail-section">
        <h3>Instructions:</h3>
        <ol>${recipe.instructions.map((s) => `<li>${s}</li>`).join("")}</ol>
      </div>
    `;

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
  }

  function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
});
