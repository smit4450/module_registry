import React, { useState } from 'react';
import { getAvailableVersions } from '../api_services/packageService';

function CheckVersions() {
  const [packageName, setPackageName] = useState('');
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await getAvailableVersions(packageName);
      setVersions(data.versions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Check Available Versions</h2>
      <form onSubmit={handleSubmit}>
        <label>Package Name: </label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="Enter package name"
        />
        <button type="submit">Check Versions</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {versions.map((version, index) => (
          <li key={index}>{version}</li>
        ))}
      </ul>
    </div>
  );
}

export default CheckVersions;
