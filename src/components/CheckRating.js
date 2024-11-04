import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function CheckRating() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('');
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}/rating?name=${packageName}&version=${version}`);
      if (!response.ok) throw new Error('Failed to fetch package rating');
      const data = await response.json();
      setRating(data.rating);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Check Package Rating</h2>
      <form onSubmit={handleSubmit}>
        <label>Package Name: </label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="Enter package name"
        />
        <label>Package Version: </label>
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="Enter version"
        />
        <button type="submit">Check Rating</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rating && <p>Rating: {rating}</p>}
    </div>
  );
}

export default CheckRating;
