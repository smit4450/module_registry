import React, { useState } from 'react';
import { ingestNpmPackage } from '../api_services/packageService.js';

function NpmIngestion() {
  const [url, setUrl] = useState('');
  const [packageName, setPackageName] = useState('');
  const [packageVersion, setPackageVersion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      
      //------- WORKS -------
      const response = await fetch('http://54.163.22.181:3000/package', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        URL: url,
        packageName: packageName,
        packageVersion: packageVersion
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // --------------------

      setSuccess('Package ingested successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>npm Ingestion</h2>
      <form onSubmit={handleSubmit}>
        <label>URL: </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
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
          placeholder="Enter package version"
        />
        <button type="submit" disabled={loading}>Ingest Package</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default NpmIngestion;
