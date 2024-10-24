import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Directory() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/packages?page=${page}`);
        const data = await response.json();
        setPackages((prevPackages) => [...prevPackages, ...data]);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
      setLoading(false);
    };

    fetchPackages();
  }, [page, url]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h2>Package Directory</h2>
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
