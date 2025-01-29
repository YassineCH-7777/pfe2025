import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons';
import footerImg from '../../assets/imgs/footer-img.png';
import './Footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Abonnement enregistré avec succès !');
        setFormData({ name: '', email: '' });
      } else {
        const errorText = await response.text();
        alert(`Erreur : ${errorText}`);
      }
    } catch (error) {
      alert('Erreur de connexion au serveur.');
    }
  };

  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <footer>
      <div className="Newsletter">
        <div className="Newsletter-content">
          <div className="Newsletter-form">
            <h3>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: '#fff' }} />
              <span> Subscribe</span>
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
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
            <ScrollToTop />
            <ul>
              <li>
                <NavLink to="/">
                Accueil</NavLink>
              </li>
              <li>
                <NavLink to="/optimise">
                Optimisation</NavLink>
              </li>
              <li>
                <NavLink to="/about">
                À propos</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="Newsletter-img">
          <img data-aos="fade-right" data-aos-duration="2000" src={footerImg} alt="" />
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; PFE Yassine CHATBI & Ilyas BAALOU 2025</p>
      </div>
    </footer>
  );
};

export default Footer;