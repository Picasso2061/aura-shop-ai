import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Store from './Store';
import ThemePreview from './components/ThemePreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/store" element={<Store />} />
        <Route path="/theme-preview" element={<ThemePreview />} />
      </Routes>
    </Router>
  );
}

export default App;
