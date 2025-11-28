import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import './Header.css';

const Header = () => {
  const [navActive, setNavActive] = useState(false);
  const { user, loading, error, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setNavActive(!navActive);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('nav') && !event.target.closest('.menu-icon')) {
      setNavActive(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1450) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={navActive ? 'nav-active' : ''}>
      <div className="logo">
        <NavLink to="/">OptimCut</NavLink>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>☰</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          Accueil
        </NavLink>
        <NavLink to="/optimise" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          Optimisation
        </NavLink>
        <NavLink to="/wood" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          Bois
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          À propos
        </NavLink>
      </nav>
      <div className="auth-buttons">
        {user ? (
          <div className="dashboard-section">
            <FaUserCircle className="dashboard-icon" onClick={() => navigate('/dashboard')} />
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="login-btn">
            Connexion
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
