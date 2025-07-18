import React, { useState } from 'react';

// StarRating component copied from IngredientSearch
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

const API_BASE = import.meta.env.VITE_API_URL + '/api/recipe';

export default function NameSearch({ user, onSave }) {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [rating, setRating] = useState(0); // New rating state

  const fetchRecipe = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setSavedMsg('');
    try {
      const res = await fetch(`${API_BASE}/by-name`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch recipe');
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    setSavedMsg('');
    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: result.title, content: result, searchType: 'name', rating }), // include rating
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
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Search Recipe by Name</h2>
      <form onSubmit={e => { e.preventDefault(); fetchRecipe(); }} className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 border dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
          placeholder="Recipe name"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200">Search</button>
      </form>
      {loading && <div className="text-blue-600 dark:text-blue-400">Loading...</div>}
      {error && <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>}
      {savedMsg && <div className="text-green-600 dark:text-green-400 mb-2">{savedMsg}</div>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 transition-colors duration-200">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{result.title}</h3>
          {result.image && <img src={result.image} alt={result.title} className="mb-2 rounded" />}
          <div className="mb-2">
            <b className="text-gray-800 dark:text-white">Ingredients:</b>
            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
              {result.ingredients && result.ingredients.map((ing, idx) => (
                <li key={idx}>{ing.original}</li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <b className="text-gray-800 dark:text-white">Instructions:</b>
            <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{result.instructions || 'No instructions.'}</div>
          </div>
          <StarRating rating={rating} setRating={setRating} /> {/* Add rating UI */}
          {user && (
            <button
              className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded transition-colors duration-200"
              onClick={saveRecipe}
            >
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
} 