import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL + '/api/recipe';

function StarRating({ rating, setRating }) {
  return (
    <div className="flex items-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={
            star <= rating
              ? 'text-yellow-400 text-2xl focus:outline-none'
              : 'text-gray-300 dark:text-gray-600 text-2xl focus:outline-none'
          }
          onClick={() => setRating(star)}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{rating ? `${rating} / 5` : 'No rating'}</span>
    </div>
  );
}

export default function IngredientSearch({ user, onSave }) {
  const [ingredients, setIngredients] = useState(['']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [ratings, setRatings] = useState({}); // { [recipeId]: rating }

  const handleIngredientChange = (idx, value) => {
    const newIngredients = [...ingredients];
    newIngredients[idx] = value;
    setIngredients(newIngredients);
  };
  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    setRecipes([]);
    setSavedMsg('');
    setRatings({});
    try {
      const res = await fetch(`${API_BASE}/by-ingredients`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredients.filter(Boolean) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch recipes');
      setRecipes(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipe) => {
    setSavedMsg('');
    const rating = ratings[recipe.id] || 0;
    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: recipe.title, content: recipe, searchType: 'ingredient', rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save recipe');
      setSavedMsg(`Saved: ${data.data.title}`);
      onSave && onSave();
    } catch (err) {
      setSavedMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-6 w-full max-w-md mb-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Enter Ingredients</h2>
      <form onSubmit={e => { e.preventDefault(); fetchRecipes(); }}>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="text"
              value={ing}
              onChange={e => handleIngredientChange(idx, e.target.value)}
              className="flex-1 border dark:border-gray-600 rounded px-2 py-1 mr-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              placeholder={`Ingredient ${idx + 1}`}
              required
            />
            {ingredients.length > 1 && (
              <button type="button" onClick={() => removeIngredient(idx)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 transition-colors duration-200">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="bg-blue-100 dark:bg-blue-900 text-white px-2 py-1 rounded mb-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">+ Add Ingredient</button>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2 transition-colors duration-200">Find Recipes</button>
      </form>
      {loading && <div className="text-blue-600 dark:text-blue-400">Loading...</div>}
      {error && <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>}
      {savedMsg && <div className="text-green-600 dark:text-green-400 mb-2">{savedMsg}</div>}
      <div className="w-full max-w-2xl">
        {recipes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe, idx) => (
                <div key={recipe.id || idx} className="bg-white dark:bg-gray-700 shadow rounded p-4 flex flex-col transition-colors duration-200">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{recipe.title}</h3>
                  {recipe.image && <img src={recipe.image} alt={recipe.title} className="mb-2 rounded" />}
                  {recipe.summary && <div className="mb-2 text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{__html: recipe.summary}} />}
                  <div className="mb-2">
                    <b className="text-gray-800 dark:text-white">Ingredients:</b>
                    <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
                      {recipe.ingredients && recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing.original}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-2">
                    <b className="text-gray-800 dark:text-white">Instructions:</b>
                    <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{recipe.instructions || 'No instructions.'}</div>
                  </div>
                  {recipe.sourceUrl && (
                    <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline mb-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">View Source</a>
                  )}
                  <StarRating
                    rating={ratings[recipe.id] || 0}
                    setRating={(r) => setRatings((prev) => ({ ...prev, [recipe.id]: r }))}
                  />
                  <div className="flex-1" />
                  {user && (
                    <button
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 rounded transition-colors duration-200"
                      onClick={() => saveRecipe(recipe)}
                    >
                      Save
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 