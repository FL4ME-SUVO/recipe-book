import React, { useState, useEffect } from 'react';
import './App.css';

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

  return (
    <div className="app">
      <header>
        <h1>Recipe Book</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main>
        <div className="container">
          <div className="recipes-container">
            <h2>My Recipes</h2>
            <div className="recipes-grid">
              {filteredRecipes.length === 0 ? (
                <p>No recipes found.</p>
              ) : (
                filteredRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className="recipe-card"
                    onClick={() => showRecipeDetails(recipe)}
                  >
                    <img src={recipe.imageData} alt={recipe.name} className="recipe-image" />
                    <div className="recipe-info">
                      <h3>{recipe.name}</h3>
                      <p>{recipe.ingredients.length} ingredients | {recipe.instructions.length} steps</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-container">
            <h2>Add New Recipe</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="recipe-name">Recipe Name</label>
                <input
                  type="text"
                  id="recipe-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-ingredients">Ingredients</label>
                <textarea
                  id="recipe-ingredients"
                  placeholder="Enter each ingredient on a new line"
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-instructions">Preparation Steps</label>
                <textarea
                  id="recipe-instructions"
                  placeholder="Enter each step on a new line"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-image">Upload Image</label>
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

              <button type="submit">Add Recipe</button>
            </form>
          </div>
        </div>

        {showModal && selectedRecipe && (
          <div className="modal show" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-button" onClick={closeModal}>&times;</span>
              <div className="recipe-details">
                <img src={selectedRecipe.imageData} alt={selectedRecipe.name} className="detail-image" />
                <h2>{selectedRecipe.name}</h2>
                <div className="detail-section">
                  <h3>Ingredients:</h3>
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-section">
                  <h3>Instructions:</h3>
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
