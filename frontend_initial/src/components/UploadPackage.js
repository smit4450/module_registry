import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function UploadPackage() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [debloat, setDebloat] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package URL:', url, 'Debloat:', debloat);
    // Implement upload functionality with debloat option
  };

  return (
    <div className="container">
      <h2>Upload or Update Package</h2>
      <form onSubmit={handleSubmit}>
        <label>Package URL: </label>
        <input type="text" value={url} disabled />
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={debloat} 
              onChange={() => setDebloat(!debloat)} 
            />
            Debloat (remove unnecessary bloat)
          </label>
        </div>
        <button type="submit">Upload/Update</button>
      </form>
    </div>
  );
}

export default UploadPackage;
