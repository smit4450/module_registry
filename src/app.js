import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginSignup from './components/LoginSignup.js';
import Home from './components/Home.js';
import UploadPackage from './components/UploadPackage.js';
import GetPackageScore from './components/GetPackageScore.js';
import DatabaseSearch from './components/DatabaseSearch.js';
import Directory from './components/Directory.js';
import CheckRating from './components/CheckRating.js';
import CheckVersions from './components/CheckVersions.js';
import DownloadZip from './components/DownloadZip.js';
import CheckSize from './components/CheckSize.js';
import NpmIngestion from './components/NpmIngestion.js';
import RegexSearch from './components/RegexSearch.js';
import FetchDirectory from './components/FetchDirectory.js';
import NotFound from './components/NotFound.js';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login/Signup</Link></li>
            <li><Link to="/upload">Upload Package</Link></li>
            <li><Link to="/search">Search Database</Link></li>
            <li><Link to="/check-rating">Check Rating</Link></li>
            <li><Link to="/check-versions">Check Versions</Link></li>
            <li><Link to="/download-zip">Download ZIP</Link></li>
            <li><Link to="/check-size">Check Size</Link></li>
            <li><Link to="/npm-ingestion">npm Ingestion</Link></li>
            <li><Link to="/regex-search">Regex Search</Link></li>
            <li><Link to="/fetch-directory">Fetch Directory</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/upload" element={<UploadPackage />} />
          <Route path="/search" element={<DatabaseSearch />} />
          <Route path="/check-rating" element={<CheckRating />} />
          <Route path="/check-versions" element={<CheckVersions />} />
          <Route path="/download-zip" element={<DownloadZip />} />
          <Route path="/check-size" element={<CheckSize />} />
          <Route path="/npm-ingestion" element={<NpmIngestion />} />
          <Route path="/regex-search" element={<RegexSearch />} />
          <Route path="/fetch-directory" element={<FetchDirectory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
