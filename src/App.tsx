import React, { useState, useEffect } from 'react';
import './App.css';

// SVG Icons Components
const DeleteIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" 
      fill="currentColor"
    />
  </svg>
);

const RecipeBookIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChefHatIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="17" x2="18" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UtensilsIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 15V2a10 10 0 0 0-4 8v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  imageData: string;
  dateAdded: string;
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    setRecipes(savedRecipes);
  }, []);

  // Keyboard shortcut for delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedRecipe) {
        e.preventDefault();
        handleDeleteRecipe(selectedRecipe.id, selectedRecipe.name);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal, selectedRecipe]);

  const saveRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Please upload an image.');
      return;
    }

    const newRecipe: Recipe = {
      id: Date.now(),
      name: formData.name.trim(),
      ingredients: formData.ingredients.split('\n').map(i => i.trim()).filter(Boolean),
      instructions: formData.instructions.split('\n').map(s => s.trim()).filter(Boolean),
      imageData: imagePreview,
      dateAdded: new Date().toISOString()
    };

    const newRecipes = [...recipes, newRecipe];
    saveRecipes(newRecipes);
    
    // Reset form
    setFormData({
      name: '',
      ingredients: '',
      instructions: '',
      image: null
    });
    setImagePreview('');
    
    alert(`Recipe "${newRecipe.name}" has been added!`);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const search = searchTerm.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(search) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(search)) ||
      recipe.instructions.some(s => s.toLowerCase().includes(search))
    );
  });

  const showRecipeDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = (recipeId: number, recipeName: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent modal from opening when clicking delete
    
    const confirmed = window.confirm(`Are you sure you want to delete "${recipeName}"? This action cannot be undone.`);
    
    if (confirmed) {
      const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
      saveRecipes(updatedRecipes);
      
      // Close modal if it's open
      if (showModal && selectedRecipe?.id === recipeId) {
        closeModal();
      }
      
      alert(`Recipe "${recipeName}" has been deleted successfully!`);
    }
  };

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div className="header-title">
            <RecipeBookIcon className="header-icon" />
            <h1>Recipe Book</h1>
          </div>
          <div className="search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="recipes-container">
            <div className="section-header">
              <ChefHatIcon className="section-icon" />
              <h2>My Recipes</h2>
              <span className="recipe-count">({filteredRecipes.length} recipes)</span>
            </div>
            <div className="recipes-grid">
              {filteredRecipes.length === 0 ? (
                <div className="empty-state">
                  <RecipeBookIcon className="empty-icon" />
                  <p>No recipes found.</p>
                  <p className="empty-hint">Add your first recipe to get started!</p>
                </div>
              ) : (
                filteredRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className="recipe-card"
                    onClick={() => showRecipeDetails(recipe)}
                  >
                    <div className="recipe-card-header">
                      <button
                        className="delete-button"
                        onClick={(e) => handleDeleteRecipe(recipe.id, recipe.name, e)}
                        title="Delete recipe"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                    <img src={recipe.imageData} alt={recipe.name} className="recipe-image" />
                    <div className="recipe-info">
                      <h3>{recipe.name}</h3>
                      <div className="recipe-meta">
                        <span className="meta-item">
                          <UtensilsIcon className="meta-icon" />
                          {recipe.ingredients.length} ingredients
                        </span>
                        <span className="meta-item">
                          <ClockIcon className="meta-icon" />
                          {recipe.instructions.length} steps
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-container">
            <div className="section-header">
              <PlusIcon className="section-icon" />
              <h2>Add New Recipe</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="recipe-name">
                  <ChefHatIcon className="form-icon" />
                  Recipe Name
                </label>
                <input
                  type="text"
                  id="recipe-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-ingredients">
                  <UtensilsIcon className="form-icon" />
                  Ingredients
                </label>
                <textarea
                  id="recipe-ingredients"
                  placeholder="Enter each ingredient on a new line"
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-instructions">
                  <ClockIcon className="form-icon" />
                  Preparation Steps
                </label>
                <textarea
                  id="recipe-instructions"
                  placeholder="Enter each step on a new line"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-image">
                  <RecipeBookIcon className="form-icon" />
                  Upload Image
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="recipe-image"
                    accept="image/*"
                    className="file-input"
                    onChange={handleImageChange}
                  />
                  <div className="image-preview-container">
                    {imagePreview && (
                      <img src={imagePreview} alt="Recipe preview" className="image-preview" />
                    )}
                  </div>
                </div>
              </div>

              <button type="submit">
                <PlusIcon />
                Add Recipe
              </button>
            </form>
          </div>
        </div>

        {showModal && selectedRecipe && (
          <div className="modal show" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-buttons">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <button
                  className="delete-button modal-delete"
                  onClick={() => handleDeleteRecipe(selectedRecipe.id, selectedRecipe.name)}
                  title="Delete recipe (or press Delete key)"
                >
                  <DeleteIcon />
                </button>
              </div>
              <div className="recipe-details">
                <div className="recipe-details-header">
                  <ChefHatIcon className="detail-icon" />
                  <h2>{selectedRecipe.name}</h2>
                </div>
                <div className="shortcut-hint">
                  💡 Press <kbd>Delete</kbd> key to delete this recipe
                </div>
                <img src={selectedRecipe.imageData} alt={selectedRecipe.name} className="detail-image" />
                <div className="detail-section">
                  <h3>
                    <UtensilsIcon className="detail-section-icon" />
                    Ingredients:
                  </h3>
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-section">
                  <h3>
                    <ClockIcon className="detail-section-icon" />
                    Instructions:
                  </h3>
                  <ol>
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
