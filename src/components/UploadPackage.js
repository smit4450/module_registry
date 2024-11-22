import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { uploadPackage, debloatPackage } from '../api_services/packageService';

function UploadPackage() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageName, setPackageName] = useState('');
  const [packageInput, setPackageInput] = useState('');
  const [packageVersion, setPackageVersion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadPackage({ name: packageName, input: packageInput, version: packageVersion });
      setSuccess('Package uploaded successfully');
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
      await debloatPackage({ name: packageName, input: packageInput, version: packageVersion });
      setSuccess('Package debloated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Upload Package</h2>
      <form onSubmit={handleUpload}>
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
        <button type="submit" disabled={loading}>Upload Package</button>
      </form>
      <button onClick={handleDebloat} disabled={loading}>Debloat Package</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default UploadPackage;