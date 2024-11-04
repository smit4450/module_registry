import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Directory() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${url}/packages?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch packages');
        const data = await response.json();
        setPackages((prevPackages) => [...prevPackages, ...data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [page, url]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h2>Package Directory</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {packages.map((pkg, index) => (
          <li key={index}>{pkg.name} - Version: {pkg.version}</li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      <button onClick={loadMore} disabled={loading}>Load More</button>
    </div>
  );
}

export default Directory;
