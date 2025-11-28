import React, { useEffect } from "react";
import { motion } from "framer-motion";
import img1 from "../../../assets/imgs/111.png";
import img2 from "../../../assets/imgs/12.jpg";
import img3 from "../../../assets/imgs/11.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './TeamGallery.css';

const TeamMember = ({ image, name, role, linkedin, dataaos }) => (
  <div className="team-member" data-aos={dataaos} data-aos-duration="1500">
    <div className="member-avatar">
      <img src={image} alt={name} />
    </div>
    <div className="member-info">
      <h3>{name}</h3>
      <p>{role}</p>
      <a 
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="profile-link"
      >
        Voir le profil
      </a>
    </div>
  </div>
);

const TeamGallery = () => {
  useEffect(() => {
    AOS.init({ 
      once: true, 
      offset: 100,
      duration: 1500
    });
  }, []);
    
  const teamMembers = [
    {
      name: "Abdelali IBRIZ",
      role: "Directeur elearning Center chez USMBA Fés   Encadrant du projet",
      image: img1,
      linkedin: "https://www.linkedin.com/in/abdelali-ibriz-33426620b",
      dataaos: "fade-left"
    },
    {
      name: "Yassine CHATBI",
      role: "Étudiant en Génie Informatique à EST Fés",
      image: img2,
      linkedin: "https://www.linkedin.com/in/yassine-chatbi",
      dataaos: "fade-in"
    },
    {
      name: "Ilyas BAALOU",
      role: "Étudiant en Génie Informatique à EST Fés",
      image: img3,
      linkedin: "https://www.linkedin.com/in/ilyas-baalou",
      dataaos: "fade-right"
    }
  ];

  return (
    <section className="team-section">
      <div className="container">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              {...member}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGallery;