import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons';
import footerImage from '../../assets/imgs/bois.png';
import './Footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    
  };

  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <footer>
      <div className="Newsletter">
        <div className="Newsletter-content">
          <div className="Newsletter-form">
            <h3>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: '#fff' }} />
              <span> Newsletter</span>
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="submit">
                Submit
              </button>
            </form>
          </div>
          <div className="links">
            <h3>
              <FontAwesomeIcon icon={faLink} style={{ marginRight: '8px', color: '#fff' }} />
              <span>Liens</span>
            </h3>
            <ul className="footer-links">
              <li>
                <NavLink to="/">
                Accueil</NavLink>
              </li>
              <li>
                <NavLink to="/optimise">
                Optimisation</NavLink>
              </li>
              <li>
                <NavLink to="/wood">
                Bois</NavLink>
              </li>
              <li>
                <NavLink to="/about">
                À propos</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="Newsletter-img">
          <img data-aos="fade-bottom" data-aos-duration="2000" src={footerImage} alt="" />
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; PFE Yassine CHATBI & Ilyas BAALOU 2025</p>
      </div>
    </footer>
  );
};

export default Footer;