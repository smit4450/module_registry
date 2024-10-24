import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Home from './components/Home';
import UploadPackage from './components/UploadPackage';
import GetPackageScore from './components/GetPackageScore';
import DatabaseSearch from './components/DatabaseSearch';
import Directory from './components/Directory';  // Import the directory component
import UpdatePackage from './components/UpdatePackage';  // Import the update package component

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login/Signup</Link></li>
            <li><Link to="/upload">Upload Package</Link></li>
            <li><Link to="/update">Update Package</Link></li>
            <li><Link to="/search">Search Database</Link></li>
            <li><Link to="/score">Get Package Score</Link></li>
            <li><Link to="/directory">View Package Directory</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/upload" element={<UploadPackage />} />
          <Route path="/update" element={<UpdatePackage />} />
          <Route path="/search" element={<DatabaseSearch />} />
          <Route path="/score" element={<GetPackageScore />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
