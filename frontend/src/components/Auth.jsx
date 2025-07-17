import React, { useState } from 'react';

const API_USER = 'http://localhost:5000/api/user';

export default function Auth({ onAuthChange, user, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ fullname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const body = isLogin ? { email: form.email, password: form.password } : form;
      const res = await fetch(API_USER + endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      setUser(data.data);
      onAuthChange && onAuthChange(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_USER + '/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');
      setUser(null);
      onAuthChange && onAuthChange(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="mb-6 bg-white shadow rounded p-4 w-full max-w-md flex flex-col items-center">
        <div className="mb-2 text-green-700">Logged in as <b>{user.fullname || user.email}</b></div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded">Logout</button>
      </div>
    );
  }

  return (
    <div className="mb-6 text-center bg-white mt-40 shadow rounded p-4 w-full max-w-md">
      <h2 className="text-xl text-center pb-10 font-semibold mb-2">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {!isLogin && (
          <input
            name="fullname"
            type="text"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="border rounded px-2 py-1"
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-2" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button
        className="mt-2 text-blue-600 underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
} 