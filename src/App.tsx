import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Enquiries from './pages/Enquiries';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import PackageEditor from './pages/PackageEditor';
import ActivityCreate from './pages/ActivityCreate';
import ThemeCreate from './pages/ThemeCreate';
import AddonCreate from './pages/AddonCreate';
import Activities from './pages/Activities';
import Themes from './pages/Themes';
import Addons from './pages/Addons';
import Bookings from './pages/Bookings';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id/edit" element={<PackageEditor />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/new" element={<ActivityCreate />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/themes/new" element={<ThemeCreate />} />
            <Route path="/addons" element={<Addons />} />
            <Route path="/addons/new" element={<AddonCreate />} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;