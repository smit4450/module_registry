import React, { useState } from 'react';

function DatabaseSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="container">
      <h2>Search Package Database</h2>
      <form onSubmit={handleSearch}>
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
