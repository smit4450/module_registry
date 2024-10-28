import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function UpdatePackage() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageName, setPackageName] = useState('');
  const [packageInput, setPackageInput] = useState('');
  const [packageVersion, setPackageVersion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${url}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: packageName, input: packageInput, version: packageVersion }),
      });
      if (!response.ok) throw new Error('Failed to update package');
      setSuccess('Package updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDebloat = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${url}/debloat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: packageName, input: packageInput, version: packageVersion }),
      });
      if (!response.ok) throw new Error('Failed to debloat package');
      setSuccess('Package debloated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Update Package</h2>
      <form onSubmit={handleUpdate}>
        <label>Package Name: </label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="Enter package name"
        />
        <label>Package Input: </label>
        <input
          type="text"
          value={packageInput}
          onChange={(e) => setPackageInput(e.target.value)}
          placeholder="Enter package input"
        />
        <label>Package Version: </label>
        <input
          type="text"
          value={packageVersion}
          onChange={(e) => setPackageVersion(e.target.value)}
          placeholder="Enter package version"
        />
        <button type="submit" disabled={loading}>Update Package</button>
      </form>
      <button onClick={handleDebloat} disabled={loading}>Debloat Package</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default UpdatePackage;
