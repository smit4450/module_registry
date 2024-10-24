import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function UpdatePackage() {
  const location = useLocation();
  const url = location.state?.url || '';
  const [newVersion, setNewVersion] = useState('');
  const [debloat, setDebloat] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating Package:', url, 'Version:', newVersion, 'Debloat:', debloat);
    // Call your API to update the package, send the new version and debloat option
  };

  return (
    <div className="container">
      <h2>Update Package</h2>
      <form onSubmit={handleSubmit}>
        <label>Package URL: </label>
        <input type="text" value={url} disabled />
        <label>New Version: </label>
        <input 
          type="text" 
          value={newVersion} 
          onChange={(e) => setNewVersion(e.target.value)} 
          placeholder="Enter the new version" 
        />
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
        <button type="submit">Update Package</button>
      </form>
    </div>
  );
}

export default UpdatePackage;
