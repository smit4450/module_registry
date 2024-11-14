import React, { useState } from 'react';
import { downloadPackageZip } from '../api_services/packageService';

function DownloadZip() {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('');

  const handleDownload = async () => {
    try {
      const response = await downloadPackageZip(packageName, version);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${packageName}-${version}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
