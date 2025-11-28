import React from 'react';
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'; // Utilisez BrowserRouter directement
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import WoodPage from './pages/WoodPage/WoodPage';
import PanelInputForm from './pages/PanelInputForm/PanelInputForm';
import WoodDetailPage from './pages/WoodDetailPage/WoodDetailPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Breadcrumb from './components/shortCut/shortCut';
import { AuthProvider } from './context/authContext';

import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import Dashboard from './components/Dashboard/Dashboard';
import ProfileUpdate from './components/updateProfil/updateProfil';
import ProjectsHistory from './components/ProjectsHistory/ProjectsHistory';
import ProjectDetailsContainer from './components/ProjectDetailsContainer/ProjectDetailsContainer';
import './index.css';

function App() {
  const handleOptimize = (newLayout, panels, toolParams) => {
    console.log('Optimization result:', newLayout);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Breadcrumb />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/optimise" element={<PanelInputForm onOptimize={handleOptimize} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/wood" element={<WoodPage />} />
            <Route path="/wood/:name" element={<WoodDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/update-profile" element={<ProfileUpdate />} />
            <Route path="/dashboard/projects" element={<ProjectsHistory />} />
            <Route path="/dashboard/projects/:optimizationId" element={<ProjectDetailsContainer />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;