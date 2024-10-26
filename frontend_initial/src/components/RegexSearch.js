import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function RegexSearch() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`${url}/regex-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Regex Search</h2>
      <form onSubmit={handleSearch}>
        <label>Package URL: </label>
        <input type="text" value={url} disabled />
        <label>Query Text: </label>
        <input
          type="text"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Enter regex query"
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default RegexSearch;