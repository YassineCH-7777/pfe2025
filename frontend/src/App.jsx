import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage/AboutPage';
import PanelInputForm from './components/PanelInputForm/PanelInputForm';
import './index.css';
import Header from './components/Header/Header';

function App() {
  const handleOptimize = (newLayout, panels, toolParams) => {
    console.log('Optimization result:', newLayout);
  };

  return (
    <Router>
      <div>
        {/* Barre de navigation */}
        <Header />
        
        {/* Définition des routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/optimise" element={<PanelInputForm onOptimize={handleOptimize} />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;