import React, { useEffect } from "react";
import { motion } from "framer-motion";
import img1 from "../../../assets/imgs/111.png";
import img2 from "../../../assets/imgs/12.jpg";
import img3 from "../../../assets/imgs/11.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './TeamGallery.css'; // Importez le fichier CSS

const teamMembers = [
  {
    name: "Abdelali IBRIZ",
    role: "Directeur elearning Center chez USMBA Fés",
    image: img1,
    linkedin: "https://www.linkedin.com/in/abdelali-ibriz",
    dataaos: "fade-left",
  },
  {
    name: "Yassine CHATBI",
    role: "Étudiant en Génie Informatique à EST Fés",
    image: img2,
    linkedin: "https://www.linkedin.com/in/yassine-chatbi",
    dataaos: "fade-in",
  },
  {
    name: "Ilyas BAALOU",
    role: "Étudiant en Génie Informatique à EST Fés",
    image: img3,
    linkedin: "https://www.linkedin.com/in/ilyas-baalou",
    dataaos: "fade-right",
  },
];

const TeamGallery = () => {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <section className="team-section" data-aos="fade-in" data-aos-duration="2000">
      <h2>Notre Équipe</h2>
      <div className="team-members">
        {teamMembers.map((member, index) => (
          <motion.div
            data-aos={member.dataaos} data-aos-duration="1000"
            key={index}
            className="team-member"
            whileHover={{ scale: 1.05, duration: 0.3 }}
            transition={{ duration: 0.3 }} 
          >
            <img src={member.image} alt={member.name} />
            <div className="overlay">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                Voir le profil
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamGallery;