import React, { useState } from 'react';
import { fetchPackagesDirectory } from '../api_services/packageService.js';

//THIS FILE DOES NOTHING DO NOT USE

function Directory() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);

    try {

      //------- WORKS -------
      const response = await fetch(`http://54.163.22.181:3000/packages`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // --------------------


      setOutput('Packages fetched successfully');
    } catch (error) {
      setError(error.message);
      setOutput('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fetchPackages();
  };

  return (
    <div className="container">
      <h2>Package Directory</h2>
      {error && <p style={{ color: '#a60000' }}>{error}</p>}
      <ul>
        {packages.map((pkg, index) => (
          <li key={index}>{pkg.name} - Version: {pkg.version}</li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      <button onClick={handleButtonClick} disabled={loading}>Fetch Packages</button>
      {output && <p>{output}</p>}
    </div>
  );
}

export default Directory;
