import React, { useState } from 'react';
import { getAvailableVersions } from '../api_services/packageService.js';
//import { retrieveVersions } from "../dynamodb_operations/retrieveVersions.ts";


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

      //------- WORKS -------
      const response = await fetch(`http://54.163.22.181:3000/package/byName/${packageName}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // --------------------

      setVersions(data.versions || []);
    } catch (err) {
      setError(`Fetch error: ${err.message}`);
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
        {versions.length > 0 ? (
          versions.map((version, index) => <li key={index}>{version}</li>)
        ) : (
          <li>No versions available</li>
        )}
      </ul>
    </div>
  );
}

export default CheckVersions;
