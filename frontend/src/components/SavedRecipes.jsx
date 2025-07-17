import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api/recipe';

function StarRatingDisplay({ rating }) {
  return (
    <div className="flex items-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating
              ? 'text-yellow-400 text-2xl'
              : 'text-gray-300 text-2xl'
          }
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating ? `${rating} / 5` : 'No rating'}</span>
    </div>
  );
}

function RecipeCard({ recipe, onDelete }) {
  let content = {};
  try {
    content = JSON.parse(recipe.content);
  } catch (e) {
    content = {};
  }
  return (
    <div className="bg-gray-50 rounded p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-lg">{recipe.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${recipe.searchType === 'ingredient' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{recipe.searchType}</span>
      </div>
      {content.image && <img src={content.image} alt={recipe.title} className="mb-2 rounded" />}
      {content.summary && <div className="mb-2 text-sm text-gray-700" dangerouslySetInnerHTML={{__html: content.summary}} />}
      <div className="mb-2">
        <b>Ingredients:</b>
        <ul className="list-disc ml-6">
          {content.ingredients && content.ingredients.map((ing, i) => (
            <li key={i}>{ing.original}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <b>Instructions:</b>
        <div className="whitespace-pre-line text-sm">{content.instructions || 'No instructions.'}</div>
      </div>
      {content.sourceUrl && (
        <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mb-2">View Source</a>
      )}
      {typeof recipe.rating === 'number' && (
        <StarRatingDisplay rating={recipe.rating} />
      )}
      <div className="flex gap-2 mt-2">
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default function SavedRecipes({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchSaved = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/saved`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch saved recipes');
      setRecipes(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSaved();
    else setRecipes([]);
    // eslint-disable-next-line
  }, [user]);

  const deleteRecipe = async (id) => {
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete recipe');
      setMsg('Deleted!');
      fetchSaved();
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow rounded p-6 w-full max-w-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Saved Recipes</h2>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {msg && <div className="text-green-600 mb-2">{msg}</div>}
      {recipes.length === 0 && !loading && <div className="text-gray-500">No saved recipes.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            onDelete={() => deleteRecipe(recipe._id)}
          />
        ))}
      </div>
    </div>
  );
} 