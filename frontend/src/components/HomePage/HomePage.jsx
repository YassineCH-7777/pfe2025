import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import dots from '../../assets/imgs/dots-light.svg';
import homeBois from '../../assets/imgs/hero.png';
import TeamGallery from "../ui/TeamGallery/TeamGallery.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);
  
  const FeatureCard = ({ icon, title, description }) => {
    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => {
        if (cardRef.current) {
          observer.unobserve(cardRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={cardRef}
        data-aos="fade-in" data-aos-duration="1500"
        className={isInView ? 'aos-animate feature' : 'feature'}
      >
        <div className="icon">
          <i className={icon}></i>
        </div>
        <h4 className="feature-title">{title}</h4>
        <p className="feature-description">{description}</p>
      </div>
    );
  };

  const features = [
    {
      icon: "fas fa-th-large",
      title: "Multi-formats",
      description: "La meilleure combinaison de panneaux de vos fabricants est sélectionnée, en s'appuyant sur les différents formats proposés."
    },
    {
      icon: "fas fa-chart-bar",
      title: "Gestion du stock et des chutes",
      description: "Les chutes réutilisables peuvent être intégrées dans votre stock à la fin de l'étude, pour être utilisées dans les suivantes."
    },
    {
      icon: "fas fa-file-export",
      title: "Export vers votre scie à commande numérique",
      description: "Le fichier de pilotage pour les scies à commande numérique des principaux fabricants peut être généré automatiquement."
    },
    {
      icon: "fas fa-euro-sign",
      title: "Des versions adaptées à chaque usage",
      description: "OptimCut est accessible à chaque usage, avec des versions et des tarifs permettant à chaque professionnel de s'équiper avec un budget adapté à son activité."
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
                Consulter l'optimisation
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

      <main className="content-section" data-aos='fade-in' data-aos-duration="2000">
          <TeamGallery />
      </main>

      <section className="features-section">
        <div className="features-container">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;