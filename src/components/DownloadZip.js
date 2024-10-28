import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function DownloadZip() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('');

  const handleDownload = async () => {
    try {
      const downloadUrl = `${url}/download?name=${packageName}&version=${version}`;
      window.location.href = downloadUrl; // Initiate download
    } catch (err) {
      alert('Failed to initiate download');
    }
  };

  return (
    <div className="container">
      <h2>Download ZIP</h2>
      <label>Package Name: </label>
      <input
        type="text"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
        placeholder="Enter package name"
      />
      <label>Package Version: </label>
      <input
        type="text"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        placeholder="Enter version"
      />
      <button onClick={handleDownload}>Download ZIP</button>
    </div>
  );
}

export default DownloadZip;
