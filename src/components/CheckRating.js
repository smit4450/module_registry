import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPackageRating } from '../api_services/packageService.js';

function CheckRating() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('');
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const packageId = `${packageName}-${version}`;

      const response = await fetch(`http://54.163.22.181:3000/package/${packageId}/rate`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setRatings(data); // Set the entire response object
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Check Package Ratings</h2>
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
        <button type="submit">Check Ratings</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#a60000' }}>{error}</p>}
      {ratings && (
        <div>
          <h3>Ratings:</h3>
          <ul>
            {Object.entries(ratings).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


export default CheckRating;
