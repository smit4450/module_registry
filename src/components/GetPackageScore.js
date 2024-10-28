import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function GetPackageScore() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageId, setPackageId] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}/packages/${packageId}/score`);
      if (!response.ok) throw new Error('Failed to fetch package score');
      const data = await response.json();
      setScore(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {score && (
        <div>
          <p>Net Score: {score.netScore}</p>
          <p>Dependencies Pinned: {score.dependenciesPinned}</p>
          <p>Code Review Fraction: {score.codeReviewFraction}</p>
        </div>
      )}
    </div>
  );
}

export default GetPackageScore;
