import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function DatabaseSearch() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement regex search over package names and READMEs
  };

  return (
    <div className="container">
      <h2>Search Package Database</h2>
      <form onSubmit={handleSearch}>
        <label>Package URL: </label>
        <input type="text" value={url} disabled />
        <label>Search: </label>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Enter search term"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default DatabaseSearch;
