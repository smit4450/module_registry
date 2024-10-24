import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [url, setUrl] = useState('');

  return (
    <div className="container">
      <h1>Welcome to the Package Registry</h1>
      <input 
        type="text" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="Enter the package URL"
        style={{ marginBottom: '20px', width: '95%', padding: '10px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Link to="/upload" state={{ url }}><button>Upload Package</button></Link>
        <Link to="/update" state={{ url }}><button>Update Package</button></Link>
        <Link to="/search" state={{ url }}><button>Search Database</button></Link>
        <Link to="/score" state={{ url }}><button>Get Package Score</button></Link>
        <Link to="/directory" state={{ url }}><button>View Package Directory</button></Link>
      </div>
    </div>
  );
}

export default Home;
