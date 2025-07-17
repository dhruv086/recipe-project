import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import IngredientSearch from './components/IngredientSearch';
import NameSearch from './components/NameSearch';
import SavedRecipes from './components/SavedRecipes';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    fetch('http://localhost:5000/api/user/me', {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.data) setUser(data.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Recipe App</h1>
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
