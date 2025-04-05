import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavBar from './components/NavBar';
import Home from './components/Home';
import IndexManagement from './components/IndexManagement';
import Search from './components/Search';
import DocumentIndexing from './components/DocumentIndexing';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/indices" element={<IndexManagement />} />
          <Route path="/search" element={<Search />} />
          <Route path="/documents" element={<DocumentIndexing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
