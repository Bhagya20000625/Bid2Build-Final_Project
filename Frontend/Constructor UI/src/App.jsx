import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BrowseProjects from './components/pages/BrowseProjects';
import SubmitBids from './components/pages/SubmitBids';
import BidDocuments from './components/pages/BidDocuments';
import UpdateProgress from './components/pages/UpdateProgress';
import Payments from './components/pages/Payments';
import Messages from './components/pages/Messages';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BrowseProjects />} />
          <Route path="/projects" element={<BrowseProjects />} />
          <Route path="/bids" element={<SubmitBids />} />
          <Route path="/documents" element={<BidDocuments />} />
          <Route path="/progress" element={<UpdateProgress />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;