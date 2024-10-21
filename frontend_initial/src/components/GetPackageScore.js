import React, { useState } from 'react';

function GetPackageScore() {
  const [packageId, setPackageId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package ID:', packageId);
  };

  return (
    <div className="container">
      <h2>Get Package Score</h2>
      <form onSubmit={handleSubmit}>
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
