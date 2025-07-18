import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import IngredientSearch from './components/IngredientSearch';
import NameSearch from './components/NameSearch';
import SavedRecipes from './components/SavedRecipes';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    fetch((import.meta.env.VITE_API_URL + '/api/user/me'), {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.data) setUser(data.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 transition-colors duration-200">
      <ThemeToggle />
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Recipe App</h1>
      <Auth user={user} setUser={setUser} />
      {user && (
        <>
          <IngredientSearch user={user} />
          <NameSearch user={user} />
          <SavedRecipes user={user} />
        </>
      )}
    </div>
  );
}

export default App;
