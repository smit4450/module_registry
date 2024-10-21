import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1>Welcome to the Package Registry</h1>
      <ul>
        <li><Link to="/upload">Upload Package</Link></li>
        <li><Link to="/score">Get Package Score</Link></li>
        <li><Link to="/search">Search Database</Link></li>
      </ul>
    </div>
  );
}

export default Home;
