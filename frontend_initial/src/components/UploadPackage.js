import React, { useState } from 'react';

function UploadPackage() {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package URL:', url);
  };

  return (
    <div className="container">
      <h2>Upload Package</h2>
      <form onSubmit={handleSubmit}>
        <label>Package URL: </label>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Enter the package URL"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadPackage;
