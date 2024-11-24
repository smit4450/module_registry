import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [url, setUrl] = useState('');

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {isValidUrl(url) ? (
          <>
            <Link to="/upload" state={{ url }}><button>Upload Package</button></Link>
            <Link to="/update" state={{ url }}><button>Update Package</button></Link>
            <Link to="/search" state={{ url }}><button>Search Database</button></Link>
            <Link to="/check-rating" state={{ url }}><button>Check Rating</button></Link>
            <Link to="/check-versions" state={{ url }}><button>Check Versions</button></Link>
            <Link to="/download-zip" state={{ url }}><button>Download ZIP</button></Link>
            <Link to="/check-size" state={{ url }}><button>Check Size</button></Link>
            <Link to="/npm-ingestion" state={{ url }}><button>npm Ingestion</button></Link>
            <Link to="/regex-search" state={{ url }}><button>Regex Search</button></Link>
            <Link to="/fetch-directory" state={{ url }}><button>Fetch Directory</button></Link>
          </>
        ) : (
          <p style={{ color: 'red' }}>Please enter a valid URL to proceed.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
