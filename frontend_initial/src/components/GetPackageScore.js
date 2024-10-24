import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function GetPackageScore() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageId, setPackageId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package ID:', packageId);
    // Implement the API call to get the package score
    // Include net score, fraction of pinned dependencies, and PR review code fraction
  };

  return (
    <div className="container">
      <h2>Get Package Score</h2>
      <form onSubmit={handleSubmit}>
        <label>Package URL: </label>
        <input type="text" value={url} disabled />
        <label>Package ID: </label>
        <input 
          type="text" 
          value={packageId} 
          onChange={(e) => setPackageId(e.target.value)} 
          placeholder="Enter the package ID"
        />
        <button type="submit">Get Score</button>
      </form>
    </div>
  );
}

export default GetPackageScore;
