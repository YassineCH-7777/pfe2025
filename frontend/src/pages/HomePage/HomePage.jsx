import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import dots from '../../assets/imgs/dots-light.svg';
import homeBois from '../../assets/imgs/hero.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TeamGallery from '../../components/ui/TeamGallery/TeamGallery';
import ApiService from '../../utils/ApiService';
import Spinner from '../../components/Spinner/Spinner';

function HomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "OptimCut - Optimisation de Découpe Intelligente";
    AOS.init({ once: true, offset: 100 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Données envoyées :", formData);
      const response = await ApiService.submitContact(formData);
      console.log("Réponse de l'API :", response);
      setFormStatus(response.message || 'Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setFormStatus(`Erreur: ${error.message}`);
    }finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "fas fa-th-large",
      title: "Multi-formats",
      description: "La meilleure combinaison de panneaux de vos fabricants est sélectionnée, en s'appuyant sur les différents formats proposés.",
      dataaos: "fade-left"
    },
    {
      icon: "fas fa-chart-bar",
      title: "Gestion du stock et des chutes",
      description: "Les chutes réutilisables peuvent être intégrées dans votre stock à la fin de l'étude, pour être utilisées dans les suivantes.",
      dataaos: "fade-left"
    },
    {
      icon: "fas fa-file-export",
      title: "Export vers votre scie à commande numérique",
      description: "Le fichier de pilotage pour les scies à commande numérique des principaux fabricants peut être généré automatiquement.",
      dataaos: "fade-right"
    },
    {
      icon: "fas fa-euro-sign",
      title: "Des versions adaptées à chaque usage",
      description: "OptimCut est accessible à chaque usage, avec des versions et des tarifs permettant à chaque professionnel de s'équiper avec un budget adapté à son activité.",
      dataaos: "fade-right"
    }
  ];

  return (
    <div className="boddy">
      <section className="hero">
        <div className="hero-main">
          <div data-aos="fade-left" data-aos-duration="2000">
            <h1 className="titre">Optimiser Cut</h1>
            <p className="sous-titre">
              Solution IA d'optimisation de découpe de panneaux avec génération de G-code
            </p>
            <div className="btns">
              <button className="navigate-button" onClick={() => navigate('/optimise')}>
                Découvrir la solution
              </button>
              <button className="navigate-button" onClick={() => navigate('/about')}>
                Savoir plus
              </button>
            </div>
          </div>
          <div>
            <div className="dots">
              <img src={dots} alt="Dots Light" />
            </div>
            <img data-aos="fade-right" data-aos-duration="2000" src={homeBois} alt="Home Wood" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos={feature.dataaos} 
              data-aos-duration="1500"
              className="feature"
            >
              <div className="icon">
                <i className={feature.icon}></i>
              </div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="get-in-touch-section" data-aos="fade-up" data-aos-duration="2000">
        <h2 className="get-in-touch-title">Contact et faq</h2>
        <p>Avez-vous une question ? contactez nous</p>
        <form className="get-in-touch-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Votre Nom"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Votre Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Votre Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? (
              <Spinner />
            ) : formStatus ? (
              formStatus.startsWith('Erreur') ? 'Erreur lors de l\'envoi' : 'Message envoyé !'
            ) : (
              "Envoyer"
            )}
          </button>
        </form>
      </section>

      <section className="content-section" data-aos='fade-in' data-aos-duration="2000">
        <TeamGallery />
      </section>

    </div>
  );
}

export default HomePage;