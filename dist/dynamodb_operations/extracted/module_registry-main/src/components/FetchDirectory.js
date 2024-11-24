import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function FetchDirectory() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${url}/fetch-directory`);
        if (!response.ok) throw new Error('Failed to fetch package directory');
        const data = await response.json();
        setPackages(data.packages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [url]);

  return (
    <div className="container">
      <h2>Fetch Package Directory</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {packages.map((pkg, index) => (
          <li key={index}>{pkg.name} - Version: {pkg.version}</li>
        ))}
      </ul>
    </div>
  );
}

export default FetchDirectory;
