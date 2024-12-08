import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPackageSize } from '../api_services/packageService.js';

function CheckSize() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageName, setPackageName] = useState('');
  const [packageVersion, setPackageVersion] = useState('');
  const [size, setSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckSize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSize(null);

    try {
      const data = await getPackageSize(packageName, packageVersion);
      setSize(data.size);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Check Package Size</h2>
      <form onSubmit={handleCheckSize}>
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
          value={packageVersion}
          onChange={(e) => setPackageVersion(e.target.value)}
          placeholder="Enter version"
        />
        <button type="submit" disabled={loading}>Check Size</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#a60000' }}>{error}</p>}
      {size && <p>Package Size: {size} KB</p>}
    </div>
  );
}

export default CheckSize;
