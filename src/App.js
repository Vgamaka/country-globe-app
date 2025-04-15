import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CountryDetails from './pages/CountryDetails'; // We'll create this next

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
