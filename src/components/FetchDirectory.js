import React, { useState, useEffect } from 'react';
import { fetchEntireDirectory } from '../api_services/packageService.js';

function FetchDirectory() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://54.163.22.181:3000/packages`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const output = [];
        if (Array.isArray(data)) {
          data.forEach((pkg) => {
            output.push({ Name: pkg.Name, Version: pkg.Version, ID: pkg.ID });
          });
          setPackages(output);
        } else if (data.message) {
          setError(data.message);
        } else if (data.error) {
          setError(data.error);
        }
            } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="container">
      <h2>Fetch Package Directory</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#a60000' }}>{error}</p>}
      <ul>
        {packages.map((pkg) => (
          <li key={pkg.ID}>
            Name: {pkg.Name}, Version: {pkg.Version}, ID: {pkg.ID}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FetchDirectory;
