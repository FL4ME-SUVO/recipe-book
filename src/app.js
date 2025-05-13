
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const recipesList = document.getElementById('recipes-list');
  const recipeForm = document.getElementById('recipe-form');
  const searchInput = document.getElementById('searchInput');
  const modal = document.getElementById('recipe-details-modal');
  const closeButton = document.querySelector('.close-button');
  const recipeDetailsContent = document.getElementById('recipe-details-content');
  const fileInput = document.getElementById('recipe-image');
  const imagePreview = document.getElementById('image-preview');

  // Load recipes from local storage or initialize empty array
  let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

  // Display all recipes on page load
  displayRecipes(recipes);

  // Image preview functionality
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
      };
      
      reader.readAsDataURL(file);
    }
  });

  // Event listener for adding new recipes
  recipeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value.split('\n').filter(item => item.trim() !== '');
    const instructions = document.getElementById('recipe-instructions').value.split('\n').filter(item => item.trim() !== '');
    
    // Process image
    const file = fileInput.files[0];
    if (!file) {
      alert('Please upload an image for your recipe.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageData = e.target.result;
      
      // Create new recipe object
      const newRecipe = {
        id: Date.now(), // Use timestamp as unique ID
        name,
        ingredients,
        instructions,
        imageData,
        dateAdded: new Date()
      };
      
      // Add the new recipe to our recipes array
      recipes.push(newRecipe);
      
      // Save to local storage
      saveToLocalStorage();
      
      // Display updated recipes
      displayRecipes(recipes);
      
      // Reset the form
      recipeForm.reset();
      imagePreview.src = '';
      imagePreview.classList.add('hidden');
      
      // Show a confirmation message
      alert(`Recipe "${name}" has been added!`);
    };
    
    reader.readAsDataURL(file);
  });

  // Event listener for search functionality
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in ingredients
      for (const ingredient of recipe.ingredients) {
        if (ingredient.toLowerCase().includes(searchTerm)) return true;
      }
      
      // Search in instructions
      for (const instruction of recipe.instructions) {
        if (instruction.toLowerCase().includes(searchTerm)) return true;
      }
      
      return false;
    });
    
    displayRecipes(filteredRecipes);
  });

  // Event delegation for recipe card clicks
  recipesList.addEventListener('click', function(e) {
    const recipeCard = e.target.closest('.recipe-card');
    if (recipeCard) {
      const recipeId = parseInt(recipeCard.dataset.id);
      showRecipeDetails(recipeId);
    }
  });

  // Close modal when clicking the close button
  closeButton.addEventListener('click', function() {
    closeModal();
  });

  // Close modal when clicking outside of it
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Function to display recipes in the UI
  function displayRecipes(recipesToShow) {
    recipesList.innerHTML = '';
    
    if (recipesToShow.length === 0) {
      recipesList.innerHTML = '<p>No recipes found. Add a recipe or try a different search.</p>';
      return;
    }
    
    recipesToShow.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';
      recipeCard.dataset.id = recipe.id;
      
      recipeCard.innerHTML = `
        <img src="${recipe.imageData}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-info">
          <h3 class="recipe-title">${recipe.name}</h3>
          <p>${recipe.ingredients.length} ingredients | ${recipe.instructions.length} steps</p>
        </div>
      `;
      
      recipesList.appendChild(recipeCard);
    });
  }

  // Function to show recipe details in modal
  function showRecipeDetails(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) return;
    
    recipeDetailsContent.innerHTML = `
      <img src="${recipe.imageData}" alt="${recipe.name}" class="detail-image">
      <h2 class="detail-title">${recipe.name}</h2>
      
      <div class="detail-section">
        <h3>Ingredients:</h3>
        <ul class="ingredients-list">
          ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
      
      <div class="detail-section">
        <h3>Instructions:</h3>
        <ol class="instructions-list">
          ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
    `;
    
    // Show the modal with animation
    modal.style.display = 'block';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
  
  // Function to close modal with animation
  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

  // Function to save recipes to local storage
  function saveToLocalStorage() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }
});
