import React, { useEffect } from 'react';
import img1 from '../../assets/imgs/111.png';
import img2 from '../../assets/imgs/12.jpg';
import img3 from '../../assets/imgs/11.png';
import './AboutPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function AboutPage() {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <div className="about">
      <div className='info' data-aos="fade-in" data-aos-duration="2000">
        <h1>À propos</h1>
        <p>
          Mon projet de fin d'études (PFE) consiste à développer une plateforme basée sur l'intelligence artificielle pour optimiser la découpe de panneaux de bois. <br /><br />
          L'application propose la meilleure configuration de découpe pour réduire les pertes, gère les chutes réutilisables et génère un fichier de commande compatible avec un robot de découpe.
        </p>
      </div>
      <div className="gallery">
        <div className="image-box" data-aos="fade-top" data-aos-duration="2000">
          <img src={img1} alt="Abdelali IBRIZ" />
          <div className="overlay-content">
            <h1>
              <a 
                href="https://www.linkedin.com/in/abdelali-ibriz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                Abdelali IBRIZ
              </a>
            </h1>
            <p>Directeur elearning Center chez USMBA Fés</p>
          </div>
        </div>
        <div className="image-box" data-aos="fade-top" data-aos-duration="2500">
          <img src={img2} alt="Yassine CHATBI" />
          <div className="overlay-content">
            <h1>
              <a 
                href="https://www.linkedin.com/in/yassine-chatbi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                Yassine CHATBI
              </a>
            </h1>
            <p>Étudiant en Génie Informatique à EST Fés</p>
          </div>
        </div>
        <div className="image-box" data-aos="fade-top" data-aos-duration="3000">
          <img src={img3} alt="Ilyas BAALOU" />
          <div className="overlay-content">
            <h1>
              <a 
                href="https://www.linkedin.com/in/ilyas-baalou" 
                target="_blank" 
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                Ilyas BAALOU
              </a>
            </h1>
            <p>Étudiant en Génie Informatique à EST Fés</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;