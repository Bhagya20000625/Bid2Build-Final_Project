import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BrowseProjects from './pages/BrowseProjects';
import MyProposals from './pages/MyProposals'; 
import Messages from './pages/Messages';
import Payments from './pages/Payments';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <Routes>
          <Route path="/" element={<BrowseProjects />} />
          <Route path="/proposals" element={<MyProposals />} />
          {/* Removed /my-projects route as it's now consolidated into /proposals */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;