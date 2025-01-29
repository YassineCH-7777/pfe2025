import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <NavLink to="/">OptimCut</NavLink>
      </div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          Accueil
        </NavLink>
        <NavLink to="/optimise" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          Optimisation
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          À propos
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;